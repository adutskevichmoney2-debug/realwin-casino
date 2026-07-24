-- ============================================================
-- RealWin — числовые ID игроков (дополнение)
-- Выполните в Supabase: SQL Editor → New query → Run
-- ============================================================

alter table public.profiles add column if not exists pid bigint;
create unique index if not exists profiles_pid_uq on public.profiles (pid);

-- генератор свободного 8-значного ID
create or replace function public.gen_pid()
returns bigint language plpgsql as $$
declare v bigint;
begin
  loop
    v := floor(random()*90000000)::bigint + 10000000;
    exit when not exists (select 1 from profiles where pid = v);
  end loop;
  return v;
end $$;

-- выдать ID всем существующим игрокам
update public.profiles set pid = public.gen_pid() where pid is null;

-- автоприсвоение ID новым игрокам
create or replace function public.set_pid()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.pid is null then new.pid := public.gen_pid(); end if;
  return new;
end $$;
drop trigger if exists profiles_pid_trg on public.profiles;
create trigger profiles_pid_trg before insert on public.profiles
  for each row execute function public.set_pid();

-- админ: смена ID (своего или игрока), с проверкой уникальности
create or replace function public.admin_set_pid(p_user uuid, p_pid bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_pid is null or p_pid < 1 or p_pid > 999999999999 then raise exception 'bad_pid'; end if;
  if exists (select 1 from profiles where pid = p_pid and id <> p_user) then raise exception 'pid_taken'; end if;
  update profiles set pid = p_pid where id = p_user;
end $$;
grant execute on function public.admin_set_pid(uuid, bigint) to authenticated;
