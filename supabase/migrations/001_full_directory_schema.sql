-- ============================================================================
-- 001_full_directory_schema.sql
-- Full database schema for the Vector Directories platform
-- ============================================================================
-- Creates : 9 tables, 1 view, 2 callable functions, 8 trigger functions
-- Seeds   : 7 directory sites, 6 scoring-config entries
-- ============================================================================

begin;

-- ════════════════════════════════════════════════════════════════════════════
-- 0. Extensions
-- ════════════════════════════════════════════════════════════════════════════

create extension if not exists "pg_trgm" with schema extensions;

-- ════════════════════════════════════════════════════════════════════════════
-- 1. Custom enum types
-- ════════════════════════════════════════════════════════════════════════════

do $$ begin create type company_tier   as enum ('basic','enhanced','premium','featured','bundle_all'); exception when duplicate_object then null; end $$;
do $$ begin create type company_status as enum ('draft','pending','published','suspended','archived');  exception when duplicate_object then null; end $$;
do $$ begin create type listing_status as enum ('active','inactive','pending','archived');              exception when duplicate_object then null; end $$;
do $$ begin create type cert_type      as enum ('insurance','permit','certification');                  exception when duplicate_object then null; end $$;
do $$ begin create type media_type     as enum ('photo','video','document');                            exception when duplicate_object then null; end $$;
do $$ begin create type lead_status    as enum ('new','read','responded','archived');                   exception when duplicate_object then null; end $$;
do $$ begin create type user_role      as enum ('user','owner','admin');                                exception when duplicate_object then null; end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Tables
-- ════════════════════════════════════════════════════════════════════════════

-- ── 2a. directory_sites ─────────────────────────────────────────────────────

create table if not exists directory_sites (
  id            uuid primary key default gen_random_uuid(),
  key           text not null unique,
  name          text not null,
  domain        text not null unique,
  tagline       text,
  description   text,
  primary_color text,
  accent_color  text,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── 2b. directory_companies ─────────────────────────────────────────────────

create table if not exists directory_companies (
  id                         uuid primary key default gen_random_uuid(),
  name                       text not null,
  slug                       text not null unique,
  description                text,
  website                    text,
  phone                      text,
  email                      text,
  logo_url                   text,
  cover_image_url            text,

  -- Primary location shorthand (for search / state-city browsing)
  state                      text,
  city                       text,
  category                   text,

  -- Status & ownership
  status                     company_status not null default 'draft',
  is_claimed                 boolean        not null default false,
  claimed_by                 uuid references auth.users(id) on delete set null,
  tier                       company_tier   not null default 'basic',

  -- Insurance (exact amount hidden from public view)
  insurance_amount           numeric(12,2),
  insurance_verified         boolean     not null default false,
  insurance_expires_at       timestamptz,

  -- Scoring sub-scores (each 0-100)
  service_quality_score      numeric(5,2) default 0 check (service_quality_score      between 0 and 100),
  certification_score        numeric(5,2) default 0 check (certification_score        between 0 and 100),
  insurance_compliance_score numeric(5,2) default 0 check (insurance_compliance_score between 0 and 100),
  customer_review_score      numeric(5,2) default 0 check (customer_review_score      between 0 and 100),
  experience_score           numeric(5,2) default 0 check (experience_score           between 0 and 100),
  responsiveness_score       numeric(5,2) default 0 check (responsiveness_score       between 0 and 100),

  -- Composite trust score (computed by trigger / function)
  trust_score                numeric(5,2) check (trust_score between 0 and 100),

  -- Denormalised counters (kept in sync by triggers)
  years_in_business          integer not null default 0,
  airport_count              integer not null default 0,
  certification_count        integer not null default 0,
  location_count             integer not null default 0,
  photo_count                integer not null default 0,

  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

create index if not exists idx_dc_slug       on directory_companies (slug);
create index if not exists idx_dc_state_city on directory_companies (state, city);
create index if not exists idx_dc_trust      on directory_companies (trust_score desc nulls last);
create index if not exists idx_dc_tier       on directory_companies (tier);
create index if not exists idx_dc_status     on directory_companies (status);
create index if not exists idx_dc_claimed_by on directory_companies (claimed_by);
create index if not exists idx_dc_name_trgm  on directory_companies using gin (name extensions.gin_trgm_ops);

-- ── 2c. company_locations ───────────────────────────────────────────────────

create table if not exists company_locations (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid        not null references directory_companies(id) on delete cascade,
  name            text        not null,
  address_line1   text        not null,
  address_line2   text,
  city            text        not null,
  state           text        not null,
  zip             text        not null,
  country         text        not null default 'US',
  lat             numeric(10,7),
  lng             numeric(10,7),
  phone           text,
  is_headquarters boolean     not null default false,
  airport_codes   text[]      not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_cl_company  on company_locations (company_id);
create index if not exists idx_cl_state    on company_locations (state, city);
create index if not exists idx_cl_airports on company_locations using gin (airport_codes);
create index if not exists idx_cl_coords   on company_locations (lat, lng) where lat is not null;

-- ── 2d. company_certifications ──────────────────────────────────────────────

create table if not exists company_certifications (
  id            uuid primary key default gen_random_uuid(),
  company_id    uuid        not null references directory_companies(id) on delete cascade,
  name          text        not null,
  document_url  text,
  type          cert_type   not null default 'certification',
  issued_at     timestamptz,
  expires_at    timestamptz,
  is_verified   boolean     not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists idx_cc_company on company_certifications (company_id);

-- ── 2e. company_media ───────────────────────────────────────────────────────

create table if not exists company_media (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid       not null references directory_companies(id) on delete cascade,
  url         text       not null,
  alt_text    text,
  media_type  media_type not null default 'photo',
  sort_order  integer    not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_cm_company on company_media (company_id);

-- ── 2f. directory_listings (links companies ↔ directory sites) ──────────────

create table if not exists directory_listings (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid           not null references directory_companies(id) on delete cascade,
  site_id        uuid           not null references directory_sites(id)     on delete cascade,
  trust_score    numeric(5,2),
  tier           company_tier   not null default 'basic',
  status         listing_status not null default 'pending',
  featured       boolean        not null default false,
  featured_until timestamptz,
  sort_priority  integer        not null default 0,
  created_at     timestamptz    not null default now(),
  updated_at     timestamptz    not null default now(),

  unique (company_id, site_id)
);

create index if not exists idx_dl_company on directory_listings (company_id);
create index if not exists idx_dl_site    on directory_listings (site_id);
create index if not exists idx_dl_status  on directory_listings (status);

-- ── 2g. directory_leads ─────────────────────────────────────────────────────

create table if not exists directory_leads (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid        not null references directory_companies(id) on delete cascade,
  site_id     uuid        references directory_sites(id) on delete set null,
  name        text        not null,
  email       text        not null,
  phone       text,
  message     text,
  status      lead_status not null default 'new',
  created_at  timestamptz not null default now()
);

create index if not exists idx_dle_company on directory_leads (company_id);
create index if not exists idx_dle_site    on directory_leads (site_id);

-- ── 2h. scoring_config ──────────────────────────────────────────────────────

create table if not exists scoring_config (
  id          uuid primary key default gen_random_uuid(),
  factor_key  text        not null unique,
  factor_name text        not null,
  weight      numeric(4,3) not null check (weight >= 0 and weight <= 1),
  max_score   numeric(5,2) not null default 100,
  description text,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── 2i. user_profiles ───────────────────────────────────────────────────────

create table if not exists user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text      not null,
  full_name   text,
  avatar_url  text,
  role        user_role not null default 'user',
  company_id  uuid      references directory_companies(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Seed data
-- ════════════════════════════════════════════════════════════════════════════

insert into directory_sites (key, name, domain, tagline, primary_color, accent_color) values
  ('directory',        'Aircraft Detailing Directory', 'aircraftdetailingdirectory.com', 'The comprehensive directory for aircraft detailing professionals', '#1B4332', '#2D6A4F'),
  ('near-me',          'Aircraft Detailing Near Me',   'aircraftdetailingnearme.com',    'Find aircraft detailers near your location',                       '#0EA5E9', '#10B981'),
  ('authority',        'Aircraft Detailing Authority',  'aircraftdetailingauthority.com', 'Expert rankings and reviews of aircraft detailing services',       '#1E3A5F', '#D4A843'),
  ('hub',              'Aviation Detailing Hub',        'aviationdetailinghub.com',       'Your community hub for aviation detailing services',               '#0D9488', '#FB7185'),
  ('detailer-pro',     'Aircraft Detailer Pro',         'aircraftdetailerpro.com',        'The professional network for aircraft detailing experts',          '#3B82F6', '#0F172A'),
  ('detailer-near-me', 'Aircraft Detailer Near Me',     'aircraftdetailernearme.com',     'Quick matching to aircraft detailers in your area',                '#F97316', '#92400E'),
  ('best-detailer',    'Best Aircraft Detailer',        'bestaircraftdetailer.com',       'Curated selection of the finest aircraft detailing services',      '#0A0A0A', '#D4AF37')
on conflict (key) do nothing;

insert into scoring_config (factor_key, factor_name, weight, description) values
  ('service_quality',      'Service Quality',        0.250, 'Quality of workmanship, materials, and finish'),
  ('certifications',       'Certifications',         0.200, 'Industry certifications, FAA compliance, and training'),
  ('insurance_compliance', 'Insurance & Compliance', 0.200, 'Liability coverage, hangar insurance, and regulatory compliance'),
  ('customer_reviews',     'Customer Reviews',       0.150, 'Verified customer satisfaction and review ratings'),
  ('experience',           'Industry Experience',    0.100, 'Years in business, fleet diversity, and project portfolio'),
  ('responsiveness',       'Responsiveness',         0.100, 'Response time, scheduling flexibility, and communication')
on conflict (factor_key) do nothing;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. View — public_company_profiles
--    Exposes everything EXCEPT the exact insurance_amount (shows range instead)
-- ════════════════════════════════════════════════════════════════════════════

create or replace view public_company_profiles as
select
  c.id,
  c.name,
  c.slug,
  c.description,
  c.website,
  c.phone,
  c.email,
  c.logo_url,
  c.cover_image_url,
  c.state,
  c.city,
  c.category,
  c.status,
  c.is_claimed,
  c.tier,
  c.trust_score,
  c.years_in_business,
  c.airport_count,
  c.certification_count,
  c.location_count,
  c.photo_count,
  c.service_quality_score,
  c.certification_score,
  c.insurance_compliance_score,
  c.customer_review_score,
  c.experience_score,
  c.responsiveness_score,
  c.insurance_verified,
  c.insurance_expires_at,
  case
    when c.insurance_amount is null    then 'Not provided'
    when c.insurance_amount < 500000   then 'Under $500K'
    when c.insurance_amount < 1000000  then '$500K - $1M'
    when c.insurance_amount < 2000000  then '$1M - $2M'
    when c.insurance_amount < 5000000  then '$2M - $5M'
    when c.insurance_amount < 10000000 then '$5M - $10M'
    else '$10M+'
  end as insurance_range,
  c.created_at,
  c.updated_at
from directory_companies c;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. Functions
-- ════════════════════════════════════════════════════════════════════════════

-- ── 5a. calculate_trust_score ───────────────────────────────────────────────
--    Computes the weighted composite trust score for one company, writes it
--    back to directory_companies AND propagates to all directory_listings.

create or replace function calculate_trust_score(p_company_id uuid)
returns numeric
language plpgsql security definer as $$
declare
  v_score numeric(5,2);
begin
  select coalesce(sum(
    case sc.factor_key
      when 'service_quality'      then c.service_quality_score      * sc.weight
      when 'certifications'       then c.certification_score        * sc.weight
      when 'insurance_compliance' then c.insurance_compliance_score * sc.weight
      when 'customer_reviews'     then c.customer_review_score      * sc.weight
      when 'experience'           then c.experience_score           * sc.weight
      when 'responsiveness'       then c.responsiveness_score       * sc.weight
      else 0
    end
  ), 0)
  into v_score
  from directory_companies c
  cross join scoring_config sc
  where c.id = p_company_id
    and sc.is_active = true;

  v_score := greatest(0, least(100, v_score));

  update directory_companies
     set trust_score = v_score,
         updated_at  = now()
   where id = p_company_id;

  update directory_listings
     set trust_score = v_score,
         updated_at  = now()
   where company_id = p_company_id;

  return v_score;
end;
$$;

-- ── 5b. refresh_all_trust_scores ────────────────────────────────────────────
--    Batch-recalculates every published company. Call after changing weights.

create or replace function refresh_all_trust_scores()
returns void
language plpgsql security definer as $$
declare
  r record;
begin
  for r in select id from directory_companies where status = 'published' loop
    perform calculate_trust_score(r.id);
  end loop;
end;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- 6. Trigger functions & triggers
-- ════════════════════════════════════════════════════════════════════════════

-- ── 6a. Generic updated_at helper ───────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$;

drop trigger if exists set_updated_at on directory_sites;
create trigger set_updated_at before update on directory_sites
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on directory_companies;
create trigger set_updated_at before update on directory_companies
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on company_locations;
create trigger set_updated_at before update on company_locations
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on directory_listings;
create trigger set_updated_at before update on directory_listings
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on scoring_config;
create trigger set_updated_at before update on scoring_config
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on user_profiles;
create trigger set_updated_at before update on user_profiles
  for each row execute function set_updated_at();

-- ── 6b. Auto-create directory_listings when a company becomes published ─────

create or replace function trg_auto_create_listings()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'published'
     and (TG_OP = 'INSERT' or OLD.status is distinct from 'published')
  then
    insert into directory_listings (company_id, site_id, trust_score, tier, status)
    select NEW.id, ds.id, NEW.trust_score, NEW.tier, 'active'
      from directory_sites ds
     where ds.is_active = true
    on conflict (company_id, site_id) do update
       set status     = 'active',
           tier       = excluded.tier,
           trust_score = excluded.trust_score,
           updated_at = now();
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_listings_on_publish_insert on directory_companies;
create trigger trg_listings_on_publish_insert
  after insert on directory_companies
  for each row execute function trg_auto_create_listings();

drop trigger if exists trg_listings_on_publish_update on directory_companies;
create trigger trg_listings_on_publish_update
  after update of status on directory_companies
  for each row execute function trg_auto_create_listings();

-- ── 6c. Sync airport_count + location_count ─────────────────────────────────

create or replace function trg_sync_location_counts()
returns trigger language plpgsql security definer as $$
declare
  v_cid uuid := coalesce(NEW.company_id, OLD.company_id);
begin
  update directory_companies
     set location_count = (
           select count(*) from company_locations where company_id = v_cid
         ),
         airport_count  = (
           select count(distinct code)
             from company_locations,
                  lateral unnest(airport_codes) as code
            where company_id = v_cid
         )
   where id = v_cid;
  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists trg_location_counts on company_locations;
create trigger trg_location_counts
  after insert or update or delete on company_locations
  for each row execute function trg_sync_location_counts();

-- ── 6d. Sync certification_count ────────────────────────────────────────────

create or replace function trg_sync_cert_count()
returns trigger language plpgsql security definer as $$
declare
  v_cid uuid := coalesce(NEW.company_id, OLD.company_id);
begin
  update directory_companies
     set certification_count = (
           select count(*) from company_certifications where company_id = v_cid
         )
   where id = v_cid;
  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists trg_cert_count on company_certifications;
create trigger trg_cert_count
  after insert or update or delete on company_certifications
  for each row execute function trg_sync_cert_count();

-- ── 6e. Sync photo_count ────────────────────────────────────────────────────

create or replace function trg_sync_photo_count()
returns trigger language plpgsql security definer as $$
declare
  v_cid uuid := coalesce(NEW.company_id, OLD.company_id);
begin
  update directory_companies
     set photo_count = (
           select count(*) from company_media where company_id = v_cid
         )
   where id = v_cid;
  return coalesce(NEW, OLD);
end;
$$;

drop trigger if exists trg_photo_count on company_media;
create trigger trg_photo_count
  after insert or update or delete on company_media
  for each row execute function trg_sync_photo_count();

-- ── 6f. Auto-recalculate trust_score when scoring sub-scores change ─────────
--    Uses AFTER UPDATE OF <columns> so the trigger only fires when scoring
--    columns appear in the SET clause — prevents recursion with
--    calculate_trust_score() which only updates trust_score + updated_at.

create or replace function trg_recalc_trust_score()
returns trigger language plpgsql security definer as $$
begin
  if NEW.service_quality_score      is distinct from OLD.service_quality_score
  or NEW.certification_score        is distinct from OLD.certification_score
  or NEW.insurance_compliance_score is distinct from OLD.insurance_compliance_score
  or NEW.customer_review_score      is distinct from OLD.customer_review_score
  or NEW.experience_score           is distinct from OLD.experience_score
  or NEW.responsiveness_score       is distinct from OLD.responsiveness_score
  then
    perform calculate_trust_score(NEW.id);
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_recalc_trust on directory_companies;
create trigger trg_recalc_trust
  after update of
    service_quality_score, certification_score,
    insurance_compliance_score, customer_review_score,
    experience_score, responsiveness_score
  on directory_companies
  for each row execute function trg_recalc_trust_score();

-- ── 6g. Calculate trust_score on insert (if any sub-scores are non-zero) ────

create or replace function trg_calc_trust_on_insert()
returns trigger language plpgsql security definer as $$
begin
  if coalesce(NEW.service_quality_score, 0)
   + coalesce(NEW.certification_score, 0)
   + coalesce(NEW.insurance_compliance_score, 0)
   + coalesce(NEW.customer_review_score, 0)
   + coalesce(NEW.experience_score, 0)
   + coalesce(NEW.responsiveness_score, 0) > 0
  then
    perform calculate_trust_score(NEW.id);
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_calc_trust_insert on directory_companies;
create trigger trg_calc_trust_insert
  after insert on directory_companies
  for each row execute function trg_calc_trust_on_insert();

-- ════════════════════════════════════════════════════════════════════════════
-- 7. Row Level Security
-- ════════════════════════════════════════════════════════════════════════════

alter table directory_sites        enable row level security;
alter table directory_companies    enable row level security;
alter table company_locations      enable row level security;
alter table company_certifications enable row level security;
alter table company_media          enable row level security;
alter table directory_listings     enable row level security;
alter table directory_leads        enable row level security;
alter table scoring_config         enable row level security;
alter table user_profiles          enable row level security;

-- ── directory_sites: publicly readable ───────────────────────────────────────

create policy "ds_select" on directory_sites
  for select using (true);

-- ── directory_companies: published = public read; owner = full CRUD ──────────

create policy "dc_select" on directory_companies
  for select using (status = 'published' or auth.uid() = claimed_by);

create policy "dc_insert" on directory_companies
  for insert with check (auth.uid() = claimed_by);

create policy "dc_update" on directory_companies
  for update using (auth.uid() = claimed_by);

create policy "dc_delete" on directory_companies
  for delete using (auth.uid() = claimed_by);

-- ── company_locations: public read (published co); owner write ───────────────

create policy "cl_select" on company_locations
  for select using (
    exists (
      select 1 from directory_companies
       where id = company_locations.company_id
         and (status = 'published' or claimed_by = auth.uid())
    )
  );

create policy "cl_insert" on company_locations
  for insert with check (
    exists (
      select 1 from directory_companies
       where id = company_locations.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "cl_update" on company_locations
  for update using (
    exists (
      select 1 from directory_companies
       where id = company_locations.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "cl_delete" on company_locations
  for delete using (
    exists (
      select 1 from directory_companies
       where id = company_locations.company_id
         and claimed_by = auth.uid()
    )
  );

-- ── company_certifications: public read (published co); owner write ──────────

create policy "cc_select" on company_certifications
  for select using (
    exists (
      select 1 from directory_companies
       where id = company_certifications.company_id
         and (status = 'published' or claimed_by = auth.uid())
    )
  );

create policy "cc_insert" on company_certifications
  for insert with check (
    exists (
      select 1 from directory_companies
       where id = company_certifications.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "cc_update" on company_certifications
  for update using (
    exists (
      select 1 from directory_companies
       where id = company_certifications.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "cc_delete" on company_certifications
  for delete using (
    exists (
      select 1 from directory_companies
       where id = company_certifications.company_id
         and claimed_by = auth.uid()
    )
  );

-- ── company_media: public read (published co); owner write ──────────────────

create policy "cm_select" on company_media
  for select using (
    exists (
      select 1 from directory_companies
       where id = company_media.company_id
         and (status = 'published' or claimed_by = auth.uid())
    )
  );

create policy "cm_insert" on company_media
  for insert with check (
    exists (
      select 1 from directory_companies
       where id = company_media.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "cm_update" on company_media
  for update using (
    exists (
      select 1 from directory_companies
       where id = company_media.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "cm_delete" on company_media
  for delete using (
    exists (
      select 1 from directory_companies
       where id = company_media.company_id
         and claimed_by = auth.uid()
    )
  );

-- ── directory_listings: active = public read; owner can also read own ────────

create policy "dl_select_public" on directory_listings
  for select using (status = 'active');

create policy "dl_select_owner" on directory_listings
  for select using (
    exists (
      select 1 from directory_companies
       where id = directory_listings.company_id
         and claimed_by = auth.uid()
    )
  );

-- ── directory_leads: anyone can insert; owner read + update ─────────────────

create policy "dle_insert" on directory_leads
  for insert with check (true);

create policy "dle_select" on directory_leads
  for select using (
    exists (
      select 1 from directory_companies
       where id = directory_leads.company_id
         and claimed_by = auth.uid()
    )
  );

create policy "dle_update" on directory_leads
  for update using (
    exists (
      select 1 from directory_companies
       where id = directory_leads.company_id
         and claimed_by = auth.uid()
    )
  );

-- ── scoring_config: publicly readable ───────────────────────────────────────

create policy "sc_select" on scoring_config
  for select using (true);

-- ── user_profiles: own profile only ─────────────────────────────────────────

create policy "up_select" on user_profiles
  for select using (id = auth.uid());

create policy "up_insert" on user_profiles
  for insert with check (id = auth.uid());

create policy "up_update" on user_profiles
  for update using (id = auth.uid());

commit;
