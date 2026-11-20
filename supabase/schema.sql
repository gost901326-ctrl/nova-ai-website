-- NOVA AI: database schema + Row Level Security (no payment logic yet).
-- Run once in Supabase Dashboard -> SQL Editor. Review before running.
-- Assumes public.customer_profiles already exists (id uuid = auth.users.id).

alter table public.customer_profiles add column if not exists avatar text;
create unique index if not exists customer_profiles_username_key
  on public.customer_profiles (lower(username)) where username is not null;

alter table public.customer_profiles enable row level security;
drop policy if exists "profiles_select_own" on public.customer_profiles;
drop policy if exists "profiles_update_own" on public.customer_profiles;
drop policy if exists "profiles_insert_own" on public.customer_profiles;
create policy "profiles_select_own" on public.customer_profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.customer_profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert_own" on public.customer_profiles for insert with check (auth.uid() = id);

-- Products and server-owned prices (Toman). Clients may read, never write.
create table if not exists public.products (
  id text primary key,
  name text not null,
  monthly_original int not null, monthly_price int not null,
  six_month_original int not null, six_month_price int not null,
  is_active boolean not null default true
);
insert into public.products values
  ('nova-ai-pro', 'NOVA AI PRO', 80000, 55000, 480000, 400000, true),
  ('nova-system-monitor-pro', 'NOVA SYSTEM MONITOR PRO', 80000, 55000, 480000, 400000, true)
on conflict (id) do nothing;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id),
  plan text not null check (plan in ('monthly','six_month')),
  status text not null default 'active' check (status in ('active','expired','cancelled')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id),
  plan text not null check (plan in ('monthly','six_month')),
  amount int not null,
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled')),
  created_at timestamptz not null default now()
);

-- Server-only tables: RLS on, NO policies => browser clients get nothing.
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  authority text unique, ref_id text, status text, created_at timestamptz default now()
);
create table if not exists public.discount_codes (
  code text primary key,
  kind text not null check (kind in ('percent','fixed')),
  value int not null, expires_at timestamptz,
  max_uses int, used_count int not null default 0, is_active boolean not null default true
);

alter table public.products enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.discount_codes enable row level security;

drop policy if exists "products_read" on public.products;
drop policy if exists "subs_read_own" on public.subscriptions;
drop policy if exists "orders_read_own" on public.orders;
create policy "products_read" on public.products for select using (is_active);
create policy "subs_read_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "orders_read_own" on public.orders for select using (auth.uid() = user_id);
-- No insert/update policies: only server code (service role) can create orders/subscriptions.

-- Avatars: public read, each user writes only inside their own folder.
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;
drop policy if exists "avatars_write_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_write_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
