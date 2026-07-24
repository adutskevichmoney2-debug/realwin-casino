-- ============================================================
-- RealWin — учёт устройств и антимультиакк (дополнение)
-- Выполните в Supabase: SQL Editor → New query → Run
-- ============================================================

create table if not exists public.devices (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  fp         text not null,
  ua         text,
  platform   text,
  screen     text,
  tz         text,
  lang       text,
  ip         text,
  first_seen timestamptz not null default now(),
  last_seen  timestamptz not null default now(),
  unique (user_id, fp)
);
create index if not exists devices_fp_idx on public.devices (fp);
create index if not exists devices_seen_idx on public.devices (last_seen desc);

alter table public.devices enable row level security;

drop policy if exists devices_sel on public.devices;
create policy devices_sel on public.devices for select
  using (user_id = auth.uid() or is_admin());

create or replace function public.log_device(
  p_fp text, p_ua text, p_platform text, p_screen text, p_tz text, p_lang text, p_ip text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  insert into devices (user_id, fp, ua, platform, screen, tz, lang, ip)
  values (auth.uid(), p_fp, left(p_ua,300), left(p_platform,60), left(p_screen,20), left(p_tz,60), left(p_lang,20), left(p_ip,60))
  on conflict (user_id, fp) do update
    set last_seen = now(), ip = coalesce(excluded.ip, devices.ip);
end $$;

grant execute on function public.log_device(text,text,text,text,text,text,text) to authenticated;
