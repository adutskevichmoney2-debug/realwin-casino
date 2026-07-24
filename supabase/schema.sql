-- ============================================================
-- RealWin — схема базы данных (Supabase / PostgreSQL)
-- Выполните этот файл целиком в Supabase: SQL Editor → New query → Run
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- типы ----------
do $$ begin
  create type tx_type as enum ('dep','wd','bet','win','bonus','rake','adjust');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ticket_status as enum ('open','answered','closed');
exception when duplicate_object then null; end $$;

-- ---------- профили ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  username    text not null,
  role        text not null default 'player' check (role in ('player','moderator','admin')),
  banned      boolean not null default false,
  avatar_hue  int not null default floor(random()*360),
  wagered     numeric(18,2) not null default 0,
  pnl         numeric(18,2) not null default 0,
  settings    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create unique index if not exists profiles_username_uq on public.profiles (lower(username));
create index if not exists profiles_created_idx on public.profiles (created_at desc);

-- ---------- кошельки ----------
create table if not exists public.wallets (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  coin       text not null,
  balance    numeric(30,8) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, coin)
);

-- ---------- леджер транзакций ----------
create table if not exists public.transactions (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       tx_type not null,
  coin       text not null,
  amount     numeric(30,8) not null,
  status     text not null default 'done',
  meta       text,
  created_at timestamptz not null default now()
);
create index if not exists tx_user_idx on public.transactions (user_id, created_at desc);
create index if not exists tx_created_idx on public.transactions (created_at desc);

-- ---------- ставки ----------
create table if not exists public.bets (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  kind       text not null default 'casino' check (kind in ('casino','sport')),
  game       text,
  coin       text not null,
  stake      numeric(30,8) not null,
  mult       numeric(12,4) not null default 0,
  payout     numeric(30,8) not null default 0,
  status     text not null default 'settled' check (status in ('settled','open','won','lost')),
  meta       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists bets_user_idx on public.bets (user_id, created_at desc);

-- ---------- избранное ----------
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug    text not null,
  primary key (user_id, slug)
);

-- ---------- промокоды ----------
create table if not exists public.promo_codes (
  code        text primary key,
  amount_usdt numeric(18,2) not null,
  max_uses    int not null default 100000,
  uses        int not null default 0,
  active      boolean not null default true
);
insert into public.promo_codes (code, amount_usdt) values
  ('REALWIN', 100), ('WIN50', 50), ('RW2026', 200)
on conflict (code) do nothing;

create table if not exists public.promo_redemptions (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  code       text not null references public.promo_codes(code),
  created_at timestamptz not null default now(),
  primary key (user_id, code)
);

-- ---------- поддержка ----------
create table if not exists public.support_tickets (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  subject    text not null,
  status     ticket_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tickets_user_idx on public.support_tickets (user_id, created_at desc);
create index if not exists tickets_status_idx on public.support_tickets (status, updated_at desc);

create table if not exists public.ticket_messages (
  id         bigint generated always as identity primary key,
  ticket_id  bigint not null references public.support_tickets(id) on delete cascade,
  author_id  uuid references public.profiles(id) on delete set null,
  staff      boolean not null default false,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists tmsg_ticket_idx on public.ticket_messages (ticket_id, created_at);

-- ============================================================
-- ФУНКЦИИ
-- ============================================================

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role in ('admin','moderator')) $$;

-- создание профиля/кошельков/приветственного бонуса при регистрации
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare uname text;
begin
  uname := coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1));
  if exists (select 1 from profiles where lower(username) = lower(uname)) then
    uname := uname || floor(random()*9000 + 1000)::int::text;
  end if;
  insert into profiles (id, email, username) values (new.id, new.email, uname)
  on conflict (id) do nothing;
  insert into wallets (user_id, coin, balance)
    select new.id, c, case when c = 'USDT' then 1000 else 0 end
    from unnest(array['USDT','BTC','ETH','SOL','TON','TRX','LTC','DOGE','XRP','BNB','USDC','ADA']) as c
  on conflict do nothing;
  insert into transactions (user_id, type, coin, amount, meta)
    values (new.id, 'bonus', 'USDT', 1000, 'Welcome bonus');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- атомарная проводка: обновляет баланс и пишет строку в леджер
create or replace function public.apply_tx(p_coin text, p_amount numeric, p_type tx_type, p_meta text default null)
returns numeric language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); new_bal numeric;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  if exists (select 1 from profiles where id = uid and banned) then raise exception 'banned'; end if;
  if p_type = 'adjust' then raise exception 'forbidden_type'; end if;
  if abs(p_amount) > 10000000 then raise exception 'amount_limit'; end if;
  update wallets set balance = balance + p_amount, updated_at = now()
    where user_id = uid and coin = p_coin
    returning balance into new_bal;
  if new_bal is null then raise exception 'wallet_not_found'; end if;
  insert into transactions (user_id, type, coin, amount, meta) values (uid, p_type, p_coin, p_amount, p_meta);
  return new_bal;
end $$;

-- активация промокода
create or replace function public.redeem_promo(p_code text)
returns numeric language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); v_amount numeric;
begin
  if uid is null then raise exception 'not_authenticated'; end if;
  select amount_usdt into v_amount from promo_codes
    where code = upper(trim(p_code)) and active and uses < max_uses for update;
  if v_amount is null then raise exception 'invalid_code'; end if;
  begin
    insert into promo_redemptions (user_id, code) values (uid, upper(trim(p_code)));
  exception when unique_violation then
    raise exception 'already_used';
  end;
  update promo_codes set uses = uses + 1 where code = upper(trim(p_code));
  update wallets set balance = balance + v_amount, updated_at = now() where user_id = uid and coin = 'USDT';
  insert into transactions (user_id, type, coin, amount, meta) values (uid, 'bonus', 'USDT', v_amount, upper(trim(p_code)));
  return v_amount;
end $$;

-- админ: корректировка баланса
create or replace function public.admin_adjust(p_user uuid, p_coin text, p_amount numeric, p_note text default null)
returns numeric language plpgsql security definer set search_path = public as $$
declare new_bal numeric;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update wallets set balance = balance + p_amount, updated_at = now()
    where user_id = p_user and coin = p_coin
    returning balance into new_bal;
  if new_bal is null then raise exception 'wallet_not_found'; end if;
  insert into transactions (user_id, type, coin, amount, meta)
    values (p_user, 'adjust', p_coin, p_amount, coalesce(p_note,'By admin'));
  return new_bal;
end $$;

-- админ: бан/разбан
create or replace function public.admin_set_ban(p_user uuid, p_banned boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update profiles set banned = p_banned where id = p_user and role = 'player';
end $$;

grant execute on function public.apply_tx(text, numeric, tx_type, text) to authenticated;
grant execute on function public.redeem_promo(text) to authenticated;
grant execute on function public.admin_adjust(uuid, text, numeric, text) to authenticated;
grant execute on function public.admin_set_ban(uuid, boolean) to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles          enable row level security;
alter table public.wallets           enable row level security;
alter table public.transactions      enable row level security;
alter table public.bets              enable row level security;
alter table public.favorites         enable row level security;
alter table public.promo_codes       enable row level security;
alter table public.promo_redemptions enable row level security;
alter table public.support_tickets   enable row level security;
alter table public.ticket_messages   enable row level security;

-- профили: свои читаем/правим, админ видит всех
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (username, wagered, pnl, settings, avatar_hue) on public.profiles to authenticated;

-- кошельки: читать свои (админ — все), менять только через функции
drop policy if exists wallets_select on public.wallets;
create policy wallets_select on public.wallets for select
  using (user_id = auth.uid() or is_admin());

-- транзакции: читать свои (админ — все), запись только через функции
drop policy if exists tx_select on public.transactions;
create policy tx_select on public.transactions for select
  using (user_id = auth.uid() or is_admin());

-- ставки: свои читаем/пишем/обновляем, админ читает все
drop policy if exists bets_select on public.bets;
create policy bets_select on public.bets for select
  using (user_id = auth.uid() or is_admin());
drop policy if exists bets_insert on public.bets;
create policy bets_insert on public.bets for insert
  with check (user_id = auth.uid());
drop policy if exists bets_update on public.bets;
create policy bets_update on public.bets for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- избранное
drop policy if exists fav_all on public.favorites;
create policy fav_all on public.favorites for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- промокоды: код можно применить только через функцию; свои активации видны
drop policy if exists redemptions_select on public.promo_redemptions;
create policy redemptions_select on public.promo_redemptions for select
  using (user_id = auth.uid());

-- тикеты
drop policy if exists tickets_select on public.support_tickets;
create policy tickets_select on public.support_tickets for select
  using (user_id = auth.uid() or is_admin());
drop policy if exists tickets_insert on public.support_tickets;
create policy tickets_insert on public.support_tickets for insert
  with check (user_id = auth.uid());
drop policy if exists tickets_update on public.support_tickets;
create policy tickets_update on public.support_tickets for update
  using (user_id = auth.uid() or is_admin());

-- сообщения тикетов
drop policy if exists tmsg_select on public.ticket_messages;
create policy tmsg_select on public.ticket_messages for select
  using (exists (select 1 from support_tickets t where t.id = ticket_id and (t.user_id = auth.uid() or is_admin())));
drop policy if exists tmsg_insert on public.ticket_messages;
create policy tmsg_insert on public.ticket_messages for insert
  with check (
    (staff = false and exists (select 1 from support_tickets t where t.id = ticket_id and t.user_id = auth.uid()))
    or (staff = true and is_admin())
  );

-- ============================================================
-- ГОТОВО. После регистрации своего аккаунта на сайте выполните
-- (подставьте свою почту), чтобы стать владельцем-админом:
--   update public.profiles set role = 'admin' where email = 'ВАША_ПОЧТА';
-- ============================================================
