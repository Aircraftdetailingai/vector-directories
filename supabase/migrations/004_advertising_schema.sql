-- ============================================================================
-- Migration 004: Self-Service Advertising System
-- Adds tables for ad placements, ads, and daily stats tracking
-- ============================================================================

begin;

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Enum types
-- ════════════════════════════════════════════════════════════════════════════

do $$ begin create type ad_placement_type as enum (
  'top_banner','sidebar','featured_boost','category_sponsor','homepage_spotlight','popup'
); exception when duplicate_object then null; end $$;

do $$ begin create type ad_status as enum (
  'draft','pending_payment','active','paused','cancelled','expired'
); exception when duplicate_object then null; end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Tables
-- ════════════════════════════════════════════════════════════════════════════

-- ── 2a. ad_placements ─────────────────────────────────────────────────────
-- Defines the available placement options and pricing

create table if not exists ad_placements (
  id             uuid primary key default gen_random_uuid(),
  placement_type ad_placement_type not null unique,
  name           text              not null,
  description    text,
  price_cents    integer           not null,
  dimensions     text,
  max_file_size  text              not null default '2MB',
  is_active      boolean           not null default true,
  sort_order     integer           not null default 0,
  created_at     timestamptz       not null default now(),
  updated_at     timestamptz       not null default now()
);

-- ── 2b. ads ───────────────────────────────────────────────────────────────
-- Individual ad campaigns booked by advertisers

create table if not exists ads (
  id                    uuid primary key default gen_random_uuid(),
  advertiser_id         uuid              not null references auth.users(id) on delete cascade,
  placement_id          uuid              not null references ad_placements(id) on delete restrict,
  site_key              text              not null,
  company_name          text              not null,
  title                 text              not null,
  description           text,
  destination_url       text              not null,
  image_url             text,
  status                ad_status         not null default 'draft',
  stripe_subscription_id text,
  stripe_customer_id    text,
  started_at            timestamptz,
  cancelled_at          timestamptz,
  created_at            timestamptz       not null default now(),
  updated_at            timestamptz       not null default now()
);

create index if not exists idx_ads_advertiser on ads (advertiser_id);
create index if not exists idx_ads_placement  on ads (placement_id);
create index if not exists idx_ads_site_key   on ads (site_key);
create index if not exists idx_ads_status     on ads (status);
create index if not exists idx_ads_stripe_sub on ads (stripe_subscription_id);

-- ── 2c. ad_daily_stats ────────────────────────────────────────────────────
-- Aggregated daily impression and click counts per ad

create table if not exists ad_daily_stats (
  id           uuid primary key default gen_random_uuid(),
  ad_id        uuid    not null references ads(id) on delete cascade,
  stat_date    date    not null,
  impressions  bigint  not null default 0,
  clicks       bigint  not null default 0,
  created_at   timestamptz not null default now(),

  unique (ad_id, stat_date)
);

create index if not exists idx_ads_stats_ad_date on ad_daily_stats (ad_id, stat_date desc);

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Seed placement data
-- ════════════════════════════════════════════════════════════════════════════

insert into ad_placements (placement_type, name, description, price_cents, dimensions, sort_order) values
  ('top_banner',         'Top Banner',         'Full-width banner displayed at the top of every page. Maximum visibility for your brand.',                           19900, '728x90',  1),
  ('sidebar',            'Sidebar',            'Prominent sidebar placement on search results and company listing pages.',                                            14900, '300x250', 2),
  ('featured_boost',     'Featured Boost',     'Boost your company listing to the top of search results with a highlighted badge.',                                   9900, '200x200', 3),
  ('category_sponsor',   'Category Sponsor',   'Exclusive sponsorship of a service category page with your branding and logo.',                                     24900, '728x90',  4),
  ('homepage_spotlight',  'Homepage Spotlight', 'Premium spotlight section on the homepage featuring your company with logo and description.',                        29900, '600x400', 5),
  ('popup',              'Popup',              'Attention-grabbing popup shown to visitors once per session with your offer or promotion.',                           34900, '500x400', 6)
on conflict (placement_type) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. Functions
-- ════════════════════════════════════════════════════════════════════════════

-- Atomic impression increment
create or replace function increment_ad_impression(p_ad_id uuid, p_date date)
returns void
language plpgsql security definer as $$
begin
  insert into ad_daily_stats (ad_id, stat_date, impressions)
  values (p_ad_id, p_date, 1)
  on conflict (ad_id, stat_date)
  do update set impressions = ad_daily_stats.impressions + 1;
end;
$$;

-- Atomic click increment
create or replace function increment_ad_click(p_ad_id uuid, p_date date)
returns void
language plpgsql security definer as $$
begin
  insert into ad_daily_stats (ad_id, stat_date, clicks)
  values (p_ad_id, p_date, 1)
  on conflict (ad_id, stat_date)
  do update set clicks = ad_daily_stats.clicks + 1;
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. Triggers
-- ════════════════════════════════════════════════════════════════════════════

drop trigger if exists set_updated_at on ad_placements;
create trigger set_updated_at before update on ad_placements
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on ads;
create trigger set_updated_at before update on ads
  for each row execute function set_updated_at();

-- ════════════════════════════════════════════════════════════════════════════
-- 6. Row Level Security
-- ════════════════════════════════════════════════════════════════════════════

alter table ad_placements  enable row level security;
alter table ads            enable row level security;
alter table ad_daily_stats enable row level security;

-- ad_placements: publicly readable
create policy "ap_select" on ad_placements
  for select using (true);

-- ads: owner can CRUD; active ads publicly readable for display
create policy "ads_select_public" on ads
  for select using (status = 'active');

create policy "ads_select_owner" on ads
  for select using (advertiser_id = auth.uid());

create policy "ads_insert" on ads
  for insert with check (advertiser_id = auth.uid());

create policy "ads_update" on ads
  for update using (advertiser_id = auth.uid());

create policy "ads_delete" on ads
  for delete using (advertiser_id = auth.uid());

-- ad_daily_stats: readable by ad owner; insertable by functions (security definer)
create policy "adstats_select_owner" on ad_daily_stats
  for select using (
    exists (
      select 1 from ads where ads.id = ad_daily_stats.ad_id and ads.advertiser_id = auth.uid()
    )
  );

-- Allow public insert for tracking (impressions/clicks come from anonymous visitors)
create policy "adstats_insert" on ad_daily_stats
  for insert with check (true);

create policy "adstats_update" on ad_daily_stats
  for update using (true);

commit;
