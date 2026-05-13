-- Trust Tools — Schema
-- Aplicado via service_role. RLS habilitado em todas as tabelas.

-- ──────────────────────────────────────────────────────────
-- CATEGORIES
-- ──────────────────────────────────────────────────────────
create table if not exists public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  icon          text,
  image_url     text,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_order on public.categories (display_order);

-- ──────────────────────────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────────────────────────
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  category_id       uuid not null references public.categories(id) on delete restrict,
  short_description text,
  long_description  text,
  applications      text[] not null default '{}',
  specs             jsonb  not null default '{}'::jsonb,
  brand             text,
  tags              text[] not null default '{}',
  featured          boolean not null default false,
  active            boolean not null default true,
  display_order     integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_products_slug         on public.products (slug);
create index if not exists idx_products_category     on public.products (category_id);
create index if not exists idx_products_active       on public.products (active);
create index if not exists idx_products_featured     on public.products (featured);
create index if not exists idx_products_search       on public.products
  using gin (to_tsvector('portuguese', coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(long_description,'')));

-- ──────────────────────────────────────────────────────────
-- PRODUCT IMAGES
-- ──────────────────────────────────────────────────────────
create table if not exists public.product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  url           text not null,
  alt           text,
  is_primary    boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists idx_product_images_product on public.product_images (product_id);

-- Apenas uma primary image por produto
create unique index if not exists uq_product_images_primary
  on public.product_images (product_id) where is_primary = true;

-- ──────────────────────────────────────────────────────────
-- INQUIRIES (leads/orçamentos)
-- ──────────────────────────────────────────────────────────
create table if not exists public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid references public.products(id) on delete set null,
  name         text not null,
  email        text,
  phone        text,
  company      text,
  message      text not null,
  status       text not null default 'new' check (status in ('new','contacted','closed')),
  created_at   timestamptz not null default now()
);

create index if not exists idx_inquiries_status on public.inquiries (status);
create index if not exists idx_inquiries_created on public.inquiries (created_at desc);

-- ──────────────────────────────────────────────────────────
-- updated_at triggers
-- ──────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated
  before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated
  before update on public.products
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries      enable row level security;

-- Leitura pública (anon + authenticated) — apenas registros ativos
drop policy if exists "public_read_categories" on public.categories;
create policy "public_read_categories"
  on public.categories for select
  using (true);

drop policy if exists "public_read_active_products" on public.products;
create policy "public_read_active_products"
  on public.products for select
  using (active = true);

drop policy if exists "public_read_product_images" on public.product_images;
create policy "public_read_product_images"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.active = true
    )
  );

-- Inquiries: qualquer um pode inserir
drop policy if exists "public_insert_inquiries" on public.inquiries;
create policy "public_insert_inquiries"
  on public.inquiries for insert
  with check (true);

-- Admin (authenticated) tem acesso total — controlado via service_role no servidor.
-- Para operações de escrita, usamos sempre o service_role no Server Action
-- após validar que o usuário está autenticado.
drop policy if exists "authenticated_all_categories" on public.categories;
create policy "authenticated_all_categories"
  on public.categories for all
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_products" on public.products;
create policy "authenticated_all_products"
  on public.products for all
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_product_images" on public.product_images;
create policy "authenticated_all_product_images"
  on public.product_images for all
  to authenticated
  using (true) with check (true);

drop policy if exists "authenticated_all_inquiries" on public.inquiries;
create policy "authenticated_all_inquiries"
  on public.inquiries for all
  to authenticated
  using (true) with check (true);

-- ──────────────────────────────────────────────────────────
-- STORAGE BUCKET (criado via API separadamente)
-- bucket: product-images, public read
-- ──────────────────────────────────────────────────────────
