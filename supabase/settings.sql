-- Trust Tools — Configurações do site (pixels, tags, scripts de campanha)
-- Tabela de linha única (id = 1). Aplicar no Supabase: SQL Editor → Run.

create table if not exists public.site_settings (
  id              integer primary key default 1,
  gtm_id          text,
  ga4_id          text,
  google_ads_id   text,
  meta_pixel_id   text,
  tiktok_pixel_id text,
  head_scripts    text,
  body_scripts    text,
  updated_at      timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

-- Garante a linha única
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- RLS
alter table public.site_settings enable row level security;

-- Leitura pública (necessária pro site injetar os pixels)
drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- Escrita apenas autenticado (no servidor usamos service_role de qualquer forma)
drop policy if exists "authenticated_all_site_settings" on public.site_settings;
create policy "authenticated_all_site_settings"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);
