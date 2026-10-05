-- =============================================================
-- Mashroom-Demo — Supabase backend (schema, RLS, RPCs)
-- Run in: Supabase Dashboard -> SQL Editor
-- Seed data is applied separately by 0002_seed.sql
-- =============================================================

-- -------------------------------------------------------------
-- 1. Profiles & roles
-- -------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  address jsonb,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so policies can call it without recursing into
-- user_profiles RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile row for every new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- 2. Content tables (uniform id + jsonb data shape)
-- -------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'products', 'categories', 'coupons', 'reviews', 'blogs',
    'banners', 'faqs', 'customers', 'messages', 'subscribers'
  ] loop
    execute format(
      'create table if not exists public.%I (
         id text primary key,
         data jsonb not null,
         created_at timestamptz not null default now()
       )', t);
  end loop;
end;
$$;

create table if not exists public.settings (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text,
  status text not null default 'Placed',
  total numeric not null default 0,
  date timestamptz,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_email_idx on public.orders (customer_email);
create index if not exists orders_status_idx on public.orders (status);

-- Seed payload powering the admin "Reset Demo Data" action
create table if not exists public.seed_payload (
  key text primary key,
  data jsonb not null
);

-- -------------------------------------------------------------
-- 3. Row Level Security
-- -------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'user_profiles', 'products', 'categories', 'coupons', 'reviews', 'blogs',
    'banners', 'faqs', 'customers', 'messages', 'subscribers',
    'settings', 'orders', 'seed_payload'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- Public catalog tables: everyone reads, admins write
do $$
declare
  t text;
begin
  foreach t in array array['products', 'categories', 'coupons', 'blogs', 'banners', 'faqs'] loop
    execute format('drop policy if exists %I on public.%I', t || '_select_public', t);
    execute format('create policy %I on public.%I for select using (true)', t || '_select_public', t);

    execute format('drop policy if exists %I on public.%I', t || '_insert_admin', t);
    execute format('create policy %I on public.%I for insert with check (public.is_admin())', t || '_insert_admin', t);

    execute format('drop policy if exists %I on public.%I', t || '_update_admin', t);
    execute format('create policy %I on public.%I for update using (public.is_admin()) with check (public.is_admin())', t || '_update_admin', t);

    execute format('drop policy if exists %I on public.%I', t || '_delete_admin', t);
    execute format('create policy %I on public.%I for delete using (public.is_admin())', t || '_delete_admin', t);
  end loop;
end;
$$;

-- Reviews: anyone can read/post, only admins moderate
drop policy if exists reviews_select_public on public.reviews;
create policy reviews_select_public on public.reviews for select using (true);
drop policy if exists reviews_insert_public on public.reviews;
create policy reviews_insert_public on public.reviews for insert with check (true);
drop policy if exists reviews_update_admin on public.reviews;
create policy reviews_update_admin on public.reviews for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists reviews_delete_admin on public.reviews;
create policy reviews_delete_admin on public.reviews for delete using (public.is_admin());

-- Customers: admin only (PII)
drop policy if exists customers_admin_all on public.customers;
create policy customers_admin_all on public.customers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Contact form messages: anyone submits, only admins read/manage
drop policy if exists messages_select_admin on public.messages;
create policy messages_select_admin on public.messages for select using (public.is_admin());
drop policy if exists messages_insert_public on public.messages;
create policy messages_insert_public on public.messages for insert with check (true);
drop policy if exists messages_update_admin on public.messages;
create policy messages_update_admin on public.messages for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists messages_delete_admin on public.messages;
create policy messages_delete_admin on public.messages for delete using (public.is_admin());

-- Newsletter subscribers: anyone subscribes, only admins read/manage
drop policy if exists subscribers_select_admin on public.subscribers;
create policy subscribers_select_admin on public.subscribers for select using (public.is_admin());
drop policy if exists subscribers_insert_public on public.subscribers;
create policy subscribers_insert_public on public.subscribers for insert with check (true);
drop policy if exists subscribers_delete_admin on public.subscribers;
create policy subscribers_delete_admin on public.subscribers for delete using (public.is_admin());

-- Settings (site config / shipping-tax): public read, admin write
drop policy if exists settings_select_public on public.settings;
create policy settings_select_public on public.settings for select using (true);
drop policy if exists settings_write_admin on public.settings;
create policy settings_write_admin on public.settings
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists settings_insert_admin on public.settings;
create policy settings_insert_admin on public.settings for insert with check (public.is_admin());

-- Seed payload: only admins can read (used by reset RPC, which is
-- SECURITY DEFINER anyway)
drop policy if exists seed_payload_admin on public.seed_payload;
create policy seed_payload_admin on public.seed_payload
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Orders:
--  * admins see everything
--  * customers see their own (by user id or email claim)
--  * guests may place orders (user_id null) but not read others'
--  * status/payment updates happen via admin UI or the server-side
--    service-role client (Razorpay verify), never from anon clients
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders for select
  using (
    public.is_admin()
    or user_id is not null and user_id = auth.uid()
    or customer_email is not null and customer_email = (auth.jwt() ->> 'email')
  );

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders for insert
  with check (
    public.is_admin()
    or user_id is null
    or user_id = auth.uid()
  );

drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_delete_admin on public.orders;
create policy orders_delete_admin on public.orders for delete using (public.is_admin());

-- Profiles
drop policy if exists profiles_select on public.user_profiles;
create policy profiles_select on public.user_profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert on public.user_profiles;
create policy profiles_insert on public.user_profiles for insert
  with check (id = auth.uid());

drop policy if exists profiles_update on public.user_profiles;
create policy profiles_update on public.user_profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- -------------------------------------------------------------
-- 4. RPCs
-- -------------------------------------------------------------

-- Guest-safe order tracking: lookup by order id + phone only.
create or replace function public.track_order(p_id text, p_phone text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select o.data
  from public.orders o
  where lower(o.id) = lower(trim(p_id))
    and (
      p_phone is null or trim(p_phone) = ''
      or replace(replace(replace(coalesce(o.data -> 'customer' ->> 'phone', ''), ' ', ''), '+', ''), '-', '')
         like '%' || replace(replace(replace(trim(p_phone), ' ', ''), '+', ''), '-', '') || '%'
    )
  limit 1;
$$;

-- Place an order atomically: insert row + decrement product stock.
-- Mirrors the original demo behaviour (product-level stock only).
create or replace function public.create_order(p_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
begin
  if p_data is null
     or p_data ->> 'id' is null
     or jsonb_typeof(p_data -> 'items') is distinct from 'array' then
    raise exception 'Invalid order payload';
  end if;

  insert into public.orders (id, user_id, customer_email, status, total, date, data)
  values (
    p_data ->> 'id',
    auth.uid(),
    p_data -> 'customer' ->> 'email',
    coalesce(p_data ->> 'status', 'Placed'),
    coalesce((p_data ->> 'total')::numeric, 0),
    coalesce((p_data ->> 'date')::timestamptz, now()),
    p_data || jsonb_build_object('userId', to_jsonb(auth.uid()))
  )
  on conflict (id) do nothing;

  for item in select value from jsonb_array_elements(p_data -> 'items') loop
    update public.products
    set data = jsonb_set(
      data,
      '{stock}',
      to_jsonb(greatest(0, coalesce((data ->> 'stock')::int, 0) - coalesce((item ->> 'quantity')::int, 0)))
    )
    where id = item ->> 'id';
  end loop;

  return p_data;
end;
$$;

-- Admin-only: restore every content table from the seeded payload.
create or replace function public.reset_demo_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb;
  rec record;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  select data into payload from public.seed_payload where key = 'initial';
  if payload is null then
    raise exception 'Seed payload missing — run 0002_seed.sql';
  end if;

  for rec in select key, value from jsonb_each(payload) loop
    if rec.key = 'settings' then
      insert into public.settings (key, data, updated_at)
      select s.key, s.value, now()
      from jsonb_each(payload -> 'settings') as s(key, value)
      on conflict (key) do update set data = excluded.data, updated_at = now();
    elsif rec.key = 'orders' then
      delete from public.orders;
      insert into public.orders (id, user_id, customer_email, status, total, date, data)
      select
        o.value ->> 'id',
        null,
        o.value -> 'customer' ->> 'email',
        coalesce(o.value ->> 'status', 'Placed'),
        coalesce((o.value ->> 'total')::numeric, 0),
        (o.value ->> 'date')::timestamptz,
        o.value
      from jsonb_array_elements(payload -> 'orders') as o(value);
    elsif rec.key in (
      'products', 'categories', 'coupons', 'reviews', 'blogs',
      'banners', 'faqs', 'customers', 'messages', 'subscribers'
    ) then
      execute format('delete from public.%I', rec.key);
      execute format(
        'insert into public.%I (id, data)
         select e.value ->> ''id'', e.value
         from jsonb_array_elements($1) as e(value)
         on conflict (id) do update set data = excluded.data',
        rec.key
      )
      using rec.value;
    end if;
  end loop;
end;
$$;
