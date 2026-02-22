-- Migration 003: Contact submissions and page view tracking
-- =========================================================

-- Table: contact_submissions
create table if not exists contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  site_key    text        not null,
  name        text        not null,
  email       text        not null,
  subject     text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_cs_site_key on contact_submissions (site_key);
create index if not exists idx_cs_created_at on contact_submissions (created_at desc);

alter table contact_submissions enable row level security;

create policy "cs_insert" on contact_submissions
  for insert with check (true);

create policy "cs_select_admin" on contact_submissions
  for select using (
    exists (
      select 1 from user_profiles
       where id = auth.uid()
         and role = 'admin'
    )
  );

-- Table: site_daily_views
create table if not exists site_daily_views (
  id          uuid primary key default gen_random_uuid(),
  site_key    text    not null,
  view_date   date    not null,
  view_count  bigint  not null default 0,
  created_at  timestamptz not null default now(),

  unique (site_key, view_date)
);

create index if not exists idx_sdv_site_date on site_daily_views (site_key, view_date desc);

alter table site_daily_views enable row level security;

create policy "sdv_insert" on site_daily_views
  for insert with check (true);

create policy "sdv_update" on site_daily_views
  for update using (true);

create policy "sdv_select" on site_daily_views
  for select using (true);

-- Function: atomic page view increment
create or replace function increment_page_view(p_site_key text, p_date date)
returns void
language plpgsql security definer as $$
begin
  insert into site_daily_views (site_key, view_date, view_count)
  values (p_site_key, p_date, 1)
  on conflict (site_key, view_date)
  do update set view_count = site_daily_views.view_count + 1;
end;
$$;
