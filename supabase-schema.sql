-- ============================================================================
-- EcoCycle: E-Waste Pickup & Recycler Locator
-- Full Database Schema, Row Level Security (RLS) Policies & Seed Data
-- Database Engine: PostgreSQL / Supabase Free Tier
-- ============================================================================

-- 1. CLEANUP (Optional - only if resetting existing tables)
-- drop table if exists public.pickups cascade;
-- drop table if exists public.centers cascade;
-- drop table if exists public.profiles cascade;

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- A. User Profiles Table (Stores user roles: 'user' or 'admin')
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- B. Collection Centers Table (Stores verified recycling drop-off centers)
create table if not exists public.centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text default 'Bangalore',
  lat double precision not null,
  lng double precision not null,
  accepts text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- C. Pickups Table (Stores doorstep collection requests)
create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_type text not null,
  quantity int default 1 check (quantity > 0),
  address text not null,
  pickup_date date not null,
  status text default 'pending' check (status in ('pending', 'scheduled', 'collected', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================================
-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- ============================================================================
-- Automatically inserts a corresponding row into public.profiles whenever a 
-- new user registers via Supabase Auth (auth.users).

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update 
  set email = excluded.email,
      role = coalesce(excluded.role, public.profiles.role);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.centers enable row level security;
alter table public.pickups enable row level security;

-- Helper security definer function to test if the current requesting user is an admin
-- Bypasses recursion by executing with table owner privileges
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Any authenticated user can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

-- Users can update their own email/data
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Allow new user profile creation
create policy "Allow profile creation"
  on public.profiles for insert
  to authenticated, anon
  with check (true);

-- ----------------------------------------------------------------------------
-- CENTERS POLICIES
-- ----------------------------------------------------------------------------
-- Everyone (including non-logged-in public visitors) can view collection centers
create policy "Public can view collection centers"
  on public.centers for select
  to public
  using (true);

-- Only admins can add new collection centers
create policy "Admins can insert collection centers"
  on public.centers for insert
  to authenticated
  with check (public.is_admin());

-- Only admins can update collection centers
create policy "Admins can update collection centers"
  on public.centers for update
  to authenticated
  using (public.is_admin());

-- Only admins can delete collection centers
create policy "Admins can delete collection centers"
  on public.centers for delete
  to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- PICKUPS POLICIES
-- ----------------------------------------------------------------------------
-- Authenticated users can insert pickups for themselves
create policy "Users can insert own pickups"
  on public.pickups for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can read only their own pickups; Admins can read all pickups
create policy "Users read own pickups or Admin reads all"
  on public.pickups for select
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Admins can update pickup status; Users can cancel their pending pickups
create policy "Admins can update all pickups"
  on public.pickups for update
  to authenticated
  using (public.is_admin() or auth.uid() = user_id);

-- Admins can delete pickups
create policy "Admins can delete pickups"
  on public.pickups for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 5. AGGREGATE IMPACT ANALYTICS RPC FUNCTION
-- ============================================================================
-- Returns aggregated impact statistics for the Impact dashboard without 
-- violating individual privacy or RLS restrictions on user addresses.

create or replace function public.get_pickup_stats()
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_pickups', count(*),
    'collected_pickups', count(*) filter (where status = 'collected'),
    'scheduled_pickups', count(*) filter (where status = 'scheduled'),
    'pending_pickups', count(*) filter (where status = 'pending'),
    'total_items', coalesce(sum(quantity), 0),
    'by_type', coalesce(
      (
        select json_object_agg(item_type, cnt)
        from (
          select item_type, sum(quantity) as cnt
          from public.pickups
          group by item_type
        ) t
      ),
      '{}'::json
    )
  ) into result
  from public.pickups;
  return result;
end;
$$ language plpgsql security definer;

-- Grant execution permission to public visitors and logged-in users
grant execute on function public.get_pickup_stats() to anon, authenticated;

-- ============================================================================
-- 6. SEED DATA: 10 REAL-LOOKING COLLECTION CENTERS IN BENGALURU, INDIA
-- ============================================================================

insert into public.centers (name, address, city, lat, lng, accepts)
values
  (
    'EcoE-Waste Recycling Hub - Whitefield',
    'ITPB Main Road, Near Hope Farm Junction, Whitefield',
    'Bangalore',
    12.9698,
    77.7499,
    array['Smartphones & Tablets', 'Laptops & Notebooks', 'Cables, Chargers & Adapters', 'Li-ion Batteries']
  ),
  (
    'GreenTech E-Waste Facility - Electronic City',
    'Phase 1, Hosur Main Road, Electronic City',
    'Bangalore',
    12.8452,
    77.6602,
    array['Desktop PCs & Monitors', 'Laptops & Notebooks', 'Servers', 'Keyboards', 'Printers, Scanners & Cartridges']
  ),
  (
    'SustainCycle Collection Depot - Koramangala',
    '80 Feet Road, 4th Block, Koramangala',
    'Bangalore',
    12.9352,
    77.6245,
    array['Smartphones & Tablets', 'Audio Equipment & Headphones', 'Cables, Chargers & Adapters', 'Li-ion Batteries']
  ),
  (
    'Urban Recyclers Dismantling Station - Indiranagar',
    '100 Feet Road, HAL 2nd Stage, Indiranagar',
    'Bangalore',
    12.9784,
    77.6408,
    array['Laptops & Notebooks', 'Desktop PCs & Monitors', 'Small Home Appliances (Microwaves, Kettles)', 'Audio Equipment & Headphones']
  ),
  (
    'EarthSafe Certified E-Waste - Jayanagar',
    '33rd Cross, 9th Block, Jayanagar',
    'Bangalore',
    12.9250,
    77.5938,
    array['Televisions & Displays', 'Small Home Appliances (Microwaves, Kettles)', 'Smartphones & Tablets']
  ),
  (
    'CleanCity Circular Depot - Malleshwaram',
    'Sampige Road, Between 7th & 8th Cross, Malleshwaram',
    'Bangalore',
    13.0031,
    77.5643,
    array['Li-ion Batteries', 'Smartphones & Tablets', 'Cables, Chargers & Adapters', 'Other Electronic Waste']
  ),
  (
    'Silicon Valley E-Waste Recovery - HSR Layout',
    '27th Main Road, Sector 1, HSR Layout',
    'Bangalore',
    12.9116,
    77.6534,
    array['Laptops & Notebooks', 'Desktop PCs & Monitors', 'Smartphones & Tablets', 'Cables, Chargers & Adapters']
  ),
  (
    'EcoTrust Industrial Demanufacturing - Peenya',
    'Plot 42, 2nd Stage, Peenya Industrial Area',
    'Bangalore',
    13.0329,
    77.5142,
    array['Desktop PCs & Monitors', 'Televisions & Displays', 'Small Home Appliances (Microwaves, Kettles)', 'Servers']
  ),
  (
    'GreenKarma E-Drop Point - Hebbal',
    'Bellary Road, Near Flyover, Hebbal',
    'Bangalore',
    13.0358,
    77.5970,
    array['Smartphones & Tablets', 'Laptops & Notebooks', 'Li-ion Batteries', 'Cables, Chargers & Adapters']
  ),
  (
    'NatureFirst Recyclers - Yelahanka New Town',
    'Major Sandeep Unnikrishnan Road, Sector A, Yelahanka',
    'Bangalore',
    13.1007,
    77.5963,
    array['Printers, Scanners & Cartridges', 'Desktop PCs & Monitors', 'Audio Equipment & Headphones']
  );
