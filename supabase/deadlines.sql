-- ============================================================
-- VIT Stellar — Deadlines (single source of truth)
-- Run this ONCE in Supabase Dashboard -> SQL Editor.
-- Safe to re-run: it never overwrites dates you already edited.
-- ============================================================

-- 1. Table: one row per date -----------------------------------------------
create table if not exists deadlines (
  key        text primary key,          -- used by the website, don't rename
  label      text not null,             -- human-readable, so rows are easy to find on a phone
  at         timestamptz not null,      -- the date/time (enter with +05:30 for IST)
  updated_at timestamptz not null default now()
);

create or replace function set_deadlines_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists deadlines_set_updated_at on deadlines;
create trigger deadlines_set_updated_at
  before update on deadlines
  for each row execute function set_deadlines_updated_at();

-- 2. Security: everyone can READ, nobody but you (dashboard) can write ------
-- `authenticated` is included on purpose: after a visitor signs in with Google
-- (certificates section) the same client runs as `authenticated`.
alter table deadlines enable row level security;

drop policy if exists "Public can read deadlines" on deadlines;
create policy "Public can read deadlines"
  on deadlines for select
  to anon, authenticated
  using (true);

-- 3. Seed with the dates that were in src/config/deadlines.js ---------------
insert into deadlines (key, label, at) values
  ('merch_release',           'Merchandise — form opens',              '2026-08-01 00:00:00+05:30'),
  ('merch_close',             'Merchandise — form closes',             '2026-08-15 23:59:00+05:30'),

  ('fest_team_reg_open',      'Fest — team registration opens',        '2026-09-10 00:00:00+05:30'),
  ('fest_team_reg_close',     'Fest — team registration closes',      '2026-09-11 10:59:59+05:30'),
  ('fest_certificates_open',  'Fest — certificates open',              '2026-09-24 00:00:00+05:30'),
  ('fest_certificates_close', 'Fest — certificates close',             '2026-11-05 23:59:59+05:30'),
  ('fest_feedback_open',      'Fest — feedback opens',                 '2026-09-24 00:00:00+05:30'),
  ('fest_feedback_close',     'Fest — feedback closes',                '2026-10-12 23:59:59+05:30'),

  ('board_open',              'Board application — opens',             '2027-01-01 00:00:00+05:30'),
  ('board_deadline',          'Board application — last date',         '2027-01-30 23:59:59+05:30'),
  ('board_slots_start',       'Board application — interview slots shown from', '2027-01-01 00:00:00+05:30'),
  ('board_slots_end',         'Board application — interview slots shown until', '2027-01-30 23:59:59+05:30'),
  ('board_results',           'Board application — results out',       '2027-01-01 00:00:00+05:30'),

  ('domain_open',             'Domain selection — opens',              '2026-12-01 00:00:00+05:30'),
  ('domain_deadline',         'Domain selection — last date',          '2026-12-01 23:59:59+05:30')
on conflict (key) do nothing;

-- 3b. Cleanup: the shots-upload feature was discontinued, so its row is removed.
delete from deadlines where key = 'fest_shots_upload';

-- 4. Server-side time-locks now read the SAME table --------------------------
-- (replaces the hard-coded dates that used to live in setup.sql, so the form
-- the visitor sees and the database that accepts/rejects the insert can never
-- disagree). If a key is missing, the comparison is NULL and the insert is
-- rejected — i.e. it fails closed.
create or replace function deadline_at(k text)
returns timestamptz
language sql stable security definer set search_path = public as $$
  select at from public.deadlines where key = k
$$;

drop policy if exists "Allow public insert on merch_orders" on merch_orders;
create policy "Allow public insert on merch_orders"
  on merch_orders for insert
  to anon
  with check (
    now() >= deadline_at('merch_release')
    and now() <= deadline_at('merch_close')
  );

drop policy if exists "Allow public insert on board_applications" on board_applications;
create policy "Allow public insert on board_applications"
  on board_applications for insert
  to anon
  with check (
    now() >= deadline_at('board_open')
    and now() <= deadline_at('board_deadline')
  );

-- ============================================================
-- HOW TO CHANGE A DATE (works from a phone browser)
--   Option A: Dashboard -> Table Editor -> deadlines -> tap the row -> edit `at`.
--   Option B: SQL Editor:
--     update deadlines set at = '2026-09-12 23:59:59+05:30' where key = 'merch_close';
-- Always include +05:30, otherwise Supabase treats the time as UTC.
-- The website shows the change on the next page load (or within ~5 minutes
-- on a page that is already open).
-- ============================================================
