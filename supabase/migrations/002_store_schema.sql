-- ============================================================
-- Migration 002: E-Commerce Store Schema
-- Site: aircraftdetailing101.com
-- ============================================================

begin;

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

do $$ begin create type store_product_status as enum ('draft','active','archived'); exception when duplicate_object then null; end $$;
do $$ begin create type store_order_status as enum ('pending','paid','processing','shipped','delivered','cancelled','refunded'); exception when duplicate_object then null; end $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Supplier accounts
create table if not exists store_suppliers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  company_name  text not null,
  slug          text not null unique,
  contact_email text not null,
  phone         text,
  logo_url      text,
  description   text,
  stripe_connect_id text,
  is_approved   boolean not null default false,
  commission_rate numeric(5,4) not null default 0.1500,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_store_suppliers_user_id on store_suppliers(user_id);
create index if not exists idx_store_suppliers_slug on store_suppliers(slug);

-- Brands
create table if not exists store_brands (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  description text,
  supplier_id uuid references store_suppliers(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_store_brands_slug on store_brands(slug);

-- Categories (self-referential for hierarchy)
create table if not exists store_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  parent_id   uuid references store_categories(id) on delete set null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_store_categories_slug on store_categories(slug);
create index if not exists idx_store_categories_parent on store_categories(parent_id);

-- Products
create table if not exists store_products (
  id                uuid primary key default gen_random_uuid(),
  supplier_id       uuid not null references store_suppliers(id) on delete cascade,
  brand_id          uuid references store_brands(id) on delete set null,
  category_id       uuid references store_categories(id) on delete set null,
  name              text not null,
  slug              text not null unique,
  description       text,
  short_description text,
  base_price        numeric(10,2) not null,
  compare_at_price  numeric(10,2),
  sku               text,
  status            store_product_status not null default 'draft',
  is_featured       boolean not null default false,
  weight_oz         numeric(8,2),
  dimensions_json   jsonb,
  tags              text[] default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_store_products_slug on store_products(slug);
create index if not exists idx_store_products_supplier on store_products(supplier_id);
create index if not exists idx_store_products_brand on store_products(brand_id);
create index if not exists idx_store_products_category on store_products(category_id);
create index if not exists idx_store_products_status on store_products(status);
create index if not exists idx_store_products_featured on store_products(is_featured) where is_featured = true;
create index if not exists idx_store_products_name_trgm on store_products using gin (name gin_trgm_ops);

-- Product variants
create table if not exists store_product_variants (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid not null references store_products(id) on delete cascade,
  name             text not null,
  sku              text,
  price            numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_quantity   integer not null default 0,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

create index if not exists idx_store_variants_product on store_product_variants(product_id);

-- Product images
create table if not exists store_product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references store_products(id) on delete cascade,
  url        text not null,
  alt_text   text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_store_images_product on store_product_images(product_id);

-- Orders
create table if not exists store_orders (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid references auth.users(id) on delete set null,
  email                    text not null,
  stripe_session_id        text,
  stripe_payment_intent_id text,
  status                   store_order_status not null default 'pending',
  subtotal                 numeric(10,2) not null default 0,
  tax_amount               numeric(10,2) not null default 0,
  shipping_amount          numeric(10,2) not null default 0,
  total                    numeric(10,2) not null default 0,
  shipping_name            text,
  shipping_address_json    jsonb,
  tracking_number          text,
  tracking_url             text,
  supplier_id              uuid references store_suppliers(id) on delete set null,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists idx_store_orders_user on store_orders(user_id);
create index if not exists idx_store_orders_email on store_orders(email);
create index if not exists idx_store_orders_status on store_orders(status);
create index if not exists idx_store_orders_supplier on store_orders(supplier_id);
create index if not exists idx_store_orders_stripe_session on store_orders(stripe_session_id);

-- Order line items
create table if not exists store_order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references store_orders(id) on delete cascade,
  product_id  uuid not null references store_products(id) on delete restrict,
  variant_id  uuid references store_product_variants(id) on delete set null,
  quantity    integer not null default 1,
  unit_price  numeric(10,2) not null,
  total_price numeric(10,2) not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_store_order_items_order on store_order_items(order_id);
create index if not exists idx_store_order_items_product on store_order_items(product_id);

-- ============================================================
-- 3. TRIGGERS (reuse set_updated_at from migration 001)
-- ============================================================

create trigger trg_store_suppliers_updated_at before update on store_suppliers
  for each row execute function set_updated_at();

create trigger trg_store_products_updated_at before update on store_products
  for each row execute function set_updated_at();

create trigger trg_store_orders_updated_at before update on store_orders
  for each row execute function set_updated_at();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

alter table store_suppliers enable row level security;
alter table store_brands enable row level security;
alter table store_categories enable row level security;
alter table store_products enable row level security;
alter table store_product_variants enable row level security;
alter table store_product_images enable row level security;
alter table store_orders enable row level security;
alter table store_order_items enable row level security;

-- Suppliers: public read if approved, owner read/update
create policy "Approved suppliers are publicly readable"
  on store_suppliers for select using (is_approved = true or user_id = auth.uid());

create policy "Suppliers can update own record"
  on store_suppliers for update using (user_id = auth.uid());

create policy "Authenticated users can create supplier record"
  on store_suppliers for insert with check (user_id = auth.uid());

-- Brands: public read
create policy "Brands are publicly readable"
  on store_brands for select using (true);

create policy "Suppliers can manage own brands"
  on store_brands for insert with check (
    supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

create policy "Suppliers can update own brands"
  on store_brands for update using (
    supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

-- Categories: public read
create policy "Categories are publicly readable"
  on store_categories for select using (true);

-- Products: public read when active, supplier manages own
create policy "Active products are publicly readable"
  on store_products for select using (
    status = 'active' or supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

create policy "Suppliers can insert own products"
  on store_products for insert with check (
    supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

create policy "Suppliers can update own products"
  on store_products for update using (
    supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

-- Product variants: public read for active products, supplier manages own
create policy "Variants readable for active products"
  on store_product_variants for select using (
    product_id in (select id from store_products where status = 'active')
    or product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

create policy "Suppliers can manage own variants"
  on store_product_variants for insert with check (
    product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

create policy "Suppliers can update own variants"
  on store_product_variants for update using (
    product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

create policy "Suppliers can delete own variants"
  on store_product_variants for delete using (
    product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

-- Product images: same pattern as variants
create policy "Images readable for active products"
  on store_product_images for select using (
    product_id in (select id from store_products where status = 'active')
    or product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

create policy "Suppliers can manage own images"
  on store_product_images for insert with check (
    product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

create policy "Suppliers can update own images"
  on store_product_images for update using (
    product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

create policy "Suppliers can delete own images"
  on store_product_images for delete using (
    product_id in (
      select p.id from store_products p
      join store_suppliers s on s.id = p.supplier_id
      where s.user_id = auth.uid()
    )
  );

-- Orders: owner by user_id or email, supplier for their orders
create policy "Users can view own orders"
  on store_orders for select using (
    user_id = auth.uid()
    or supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

create policy "Orders can be created by webhook"
  on store_orders for insert with check (true);

create policy "Suppliers can update own orders"
  on store_orders for update using (
    supplier_id in (select id from store_suppliers where user_id = auth.uid())
  );

-- Order items: accessible through order ownership
create policy "Order items viewable by order owner"
  on store_order_items for select using (
    order_id in (
      select id from store_orders
      where user_id = auth.uid()
      or supplier_id in (select id from store_suppliers where user_id = auth.uid())
    )
  );

create policy "Order items can be created by webhook"
  on store_order_items for insert with check (true);

-- ============================================================
-- 5. SEED DATA
-- ============================================================

-- Brands
insert into store_brands (name, slug, logo_url, description) values
  ('Fly Shiny', 'fly-shiny', null, 'Professional aircraft polishing and coating products designed for aviation perfection.'),
  ('Autofiber', 'autofiber', null, 'Premium microfiber towels and detailing accessories trusted by professionals worldwide.'),
  ('Nuvite', 'nuvite', null, 'Industry-leading aircraft metal polishing and surface care systems since 1978.'),
  ('SkyGlide', 'skyglide', null, 'Aviation-grade ceramic coatings and sealants for superior surface protection.')
on conflict (slug) do nothing;

-- Categories
insert into store_categories (name, slug, description, sort_order) values
  ('Polishes', 'polishes', 'Metal and paint polishing compounds for aircraft surfaces.', 1),
  ('Towels', 'towels', 'Microfiber and specialty towels for aviation detailing.', 2),
  ('Ceramic Coatings', 'ceramic-coatings', 'Long-lasting ceramic protection for aircraft surfaces.', 3),
  ('Cleaners', 'cleaners', 'Degreasers, wash soaps, and surface cleaners for aviation.', 4),
  ('Tools', 'tools', 'Polishers, applicators, and specialty detailing tools.', 5),
  ('Kits', 'kits', 'Complete detailing kits and bundles for every job.', 6)
on conflict (slug) do nothing;

commit;
