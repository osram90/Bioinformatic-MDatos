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
