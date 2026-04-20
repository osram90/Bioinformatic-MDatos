-- MDatos.ai initial schema (PostgreSQL)

create table if not exists users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists plans (
  code text primary key,
  display_name text not null,
  credits_per_session int not null,
  max_hourly_usd numeric(10,4) not null
);

create table if not exists wallets (
  user_id uuid primary key references users(id),
  credits int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists wallet_ledger (
  id uuid primary key,
  user_id uuid not null references users(id),
  delta_credits int not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists experiments (
  id uuid primary key,
  user_id uuid not null references users(id),
  project_name text not null,
  tier text not null references plans(code),
  kind text not null,
  status text not null,
  credits_reserved int not null,
  rented_offer_id uuid,
  estimated_cost_usd numeric(10,4),
  ask_contract_id bigint,
  instance_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists artifacts (
  id uuid primary key,
  experiment_id uuid not null references experiments(id),
  object_key text not null,
  created_at timestamptz not null default now()
);

create table if not exists compute_spaces (
  id uuid primary key,
  owner_user_id uuid not null references users(id),
  label text not null,
  location text not null,
  total_gpu_units int not null,
  total_cpu_units int not null,
  total_ram_gb int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists capacity_offers (
  id uuid primary key,
  space_id uuid not null references compute_spaces(id),
  seller_user_id uuid not null references users(id),
  kind text not null,
  gpu_units int not null,
  cpu_units int not null,
  ram_gb int not null,
  price_usd_hour numeric(10,4) not null,
  status text not null,
  reserved_for_experiment_id uuid references experiments(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
