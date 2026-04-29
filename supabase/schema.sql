create extension if not exists "pgcrypto";

create table if not exists public.redeem_codes (
  code text primary key,
  type text not null default 'sale' check (type in ('internal_test', 'sale')),
  status text not null default 'unused' check (status in ('unused', 'used')),
  used_at timestamptz,
  result_id uuid unique,
  created_at timestamptz not null default now()
);

alter table public.redeem_codes
  add column if not exists type text not null default 'sale';

create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  code text not null unique references public.redeem_codes(code),
  answers jsonb not null,
  result_payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  code text,
  payload jsonb,
  created_at timestamptz default now()
);

create index if not exists test_results_code_idx
  on public.test_results(code);

create index if not exists events_event_name_created_at_idx
  on public.events(event_name, created_at desc);

create index if not exists events_code_created_at_idx
  on public.events(code, created_at desc);

alter table public.redeem_codes enable row level security;
alter table public.test_results enable row level security;
alter table public.events enable row level security;

-- These tables are written by Next.js route handlers with
-- SUPABASE_SERVICE_ROLE_KEY. Do not expose that key to client code.
