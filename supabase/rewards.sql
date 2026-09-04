create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  phone text not null unique check (phone ~ '^01[0-9]{9}$'),
  stamp_count integer not null default 0 check (stamp_count between 0 and 7),
  cycle_started_at timestamptz,
  expires_at timestamptz,
  reward_ready boolean not null default false,
  rewards_redeemed integer not null default 0 check (rewards_redeemed >= 0),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stamp_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.reward_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  request_id uuid references public.stamp_requests(id) on delete set null,
  event_type text not null check (event_type in ('stamp_approved', 'reward_redeemed')),
  created_at timestamptz not null default now()
);

create unique index if not exists idx_one_pending_request_per_customer
  on public.stamp_requests(customer_id)
  where status = 'pending';

create index if not exists idx_stamp_requests_status_requested
  on public.stamp_requests(status, requested_at);

create index if not exists idx_reward_events_customer_created
  on public.reward_events(customer_id, created_at desc);

alter table public.customers enable row level security;
alter table public.stamp_requests enable row level security;
alter table public.reward_events enable row level security;

create or replace function public.approve_stamp_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.stamp_requests%rowtype;
  v_customer public.customers%rowtype;
  v_now timestamptz := now();
  v_count integer;
  v_cycle_start timestamptz;
  v_expires timestamptz;
begin
  select * into v_request
  from public.stamp_requests
  where id = p_request_id
  for update;

  if not found then raise exception 'Stamp request not found'; end if;
  if v_request.status <> 'pending' then raise exception 'Stamp request was already reviewed'; end if;

  select * into v_customer
  from public.customers
  where id = v_request.customer_id
  for update;

  if v_customer.reward_ready then raise exception 'Reward must be redeemed first'; end if;

  if v_customer.stamp_count = 0 or (v_customer.expires_at is not null and v_customer.expires_at <= v_now) then
    v_count := 1;
    v_cycle_start := v_now;
    v_expires := v_now + interval '15 days';
  else
    v_count := least(v_customer.stamp_count + 1, 7);
    v_cycle_start := coalesce(v_customer.cycle_started_at, v_now);
    v_expires := coalesce(v_customer.expires_at, v_now + interval '15 days');
  end if;

  update public.customers
  set stamp_count = v_count,
      cycle_started_at = v_cycle_start,
      expires_at = v_expires,
      reward_ready = v_count >= 7,
      updated_at = v_now
  where id = v_customer.id;

  update public.stamp_requests
  set status = 'approved', reviewed_at = v_now
  where id = v_request.id;

  insert into public.reward_events(customer_id, request_id, event_type)
  values (v_customer.id, v_request.id, 'stamp_approved');

  return jsonb_build_object(
    'stampCount', v_count,
    'rewardReady', v_count >= 7,
    'expiresAt', v_expires
  );
end;
$$;

create or replace function public.redeem_customer_reward(p_customer_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer public.customers%rowtype;
begin
  select * into v_customer
  from public.customers
  where id = p_customer_id
  for update;

  if not found then raise exception 'Customer not found'; end if;
  if not v_customer.reward_ready then raise exception 'No reward is ready'; end if;

  update public.customers
  set stamp_count = 0,
      cycle_started_at = null,
      expires_at = null,
      reward_ready = false,
      rewards_redeemed = rewards_redeemed + 1,
      updated_at = now()
  where id = p_customer_id;

  insert into public.reward_events(customer_id, event_type)
  values (p_customer_id, 'reward_redeemed');

  return jsonb_build_object('redeemed', true);
end;
$$;

revoke all on function public.approve_stamp_request(uuid) from public, anon, authenticated;
revoke all on function public.redeem_customer_reward(uuid) from public, anon, authenticated;
grant execute on function public.approve_stamp_request(uuid) to service_role;
grant execute on function public.redeem_customer_reward(uuid) to service_role;
