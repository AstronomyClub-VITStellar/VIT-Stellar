-- ============================================================
-- VIT Stellar — Merchandise Orders
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Table
create table if not exists merch_orders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  reg_number text not null unique,
  email text not null,
  phone_number text not null,
  print_name text not null,
  size text not null,
  screenshot_path text not null,
  created_at timestamptz default now()
);

-- 2. Lock the table down, then explicitly allow only INSERT for anon
alter table merch_orders enable row level security;

create policy "Allow public insert on merch_orders"
  on merch_orders for insert
  to anon
  with check (true);

-- No select/update/delete policy is created for anon on purpose.
-- This means submitted orders cannot be read, edited, or deleted
-- from the frontend — only you can see them via the dashboard
-- Table Editor, or a service-role key in a private script.


-- ============================================================
-- 3. Storage bucket for payment screenshots
-- ============================================================
-- Do this part in the dashboard UI, not SQL:
--   Storage -> New bucket -> name: payment-screenshots -> Private (NOT public)
--
-- Then run the policies below to allow public uploads only
-- (no listing/reading other people's screenshots).

create policy "Allow public upload to payment-screenshots"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'payment-screenshots');

-- No select policy for anon here either — uploaded screenshots
-- are only viewable by you via the dashboard or a service-role key.

-- Time-locks (open/close dates) now live in supabase/deadlines.sql and read
-- from the `deadlines` table. Run that file after this one.
