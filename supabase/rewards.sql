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
  cycle_spend integer not null default 0 check (cycle_spend >= 0),
  reward_value integer not null default 0 check (reward_value >= 0),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stamp_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  bill_amount integer not null check (bill_amount between 1 and 100000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.reward_events (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  request_id uuid references public.stamp_requests(id) on delete set null,
  event_type text not null check (event_type in ('stamp_approved', 'reward_redeemed')),
  bill_amount integer,
  reward_value integer,
  created_at timestamptz not null default now()
);

-- Safe upgrades for projects that already ran an earlier version of this file.
alter table public.customers
  add column if not exists cycle_spend integer not null default 0 check (cycle_spend >= 0),
  add column if not exists reward_value integer not null default 0 check (reward_value >= 0);

alter table public.stamp_requests
  add column if not exists bill_amount integer;

-- Old pending requests did not contain a bill amount, so customers should resubmit them.
update public.stamp_requests
set status = 'rejected', reviewed_at = coalesce(reviewed_at, now())
where status = 'pending' and bill_amount is null;

update public.stamp_requests set bill_amount = 0 where bill_amount is null;
alter table public.stamp_requests alter column bill_amount set default 0;
alter table public.stamp_requests alter column bill_amount set not null;

alter table public.reward_events
  add column if not exists bill_amount integer,
  add column if not exists reward_value integer;

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
  v_cycle_spend integer;
  v_reward_value integer;
begin
  select * into v_request
  from public.stamp_requests
  where id = p_request_id
  for update;

  if not found then raise exception 'Stamp request not found'; end if;
  if v_request.status <> 'pending' then raise exception 'Stamp request was already reviewed'; end if;
  if v_request.bill_amount < 1 or v_request.bill_amount > 100000 then raise exception 'Invalid bill amount'; end if;

  select * into v_customer
  from public.customers
  where id = v_request.customer_id
  for update;

  if v_customer.reward_ready then raise exception 'Reward must be redeemed first'; end if;

  if v_customer.stamp_count = 0 or (v_customer.expires_at is not null and v_customer.expires_at <= v_now) then
    v_count := 1;
    v_cycle_start := v_now;
    v_expires := v_now + interval '15 days';
    v_cycle_spend := v_request.bill_amount;
  else
    v_count := least(v_customer.stamp_count + 1, 7);
    v_cycle_start := coalesce(v_customer.cycle_started_at, v_now);
    v_expires := coalesce(v_customer.expires_at, v_now + interval '15 days');
    v_cycle_spend := v_customer.cycle_spend + v_request.bill_amount;
  end if;

  v_reward_value := floor(v_cycle_spend * 0.10)::integer;

  update public.customers
  set stamp_count = v_count,
      cycle_started_at = v_cycle_start,
      expires_at = v_expires,
      reward_ready = v_count >= 7,
      cycle_spend = v_cycle_spend,
      reward_value = v_reward_value,
      updated_at = v_now
  where id = v_customer.id;

  update public.stamp_requests
  set status = 'approved', reviewed_at = v_now
  where id = v_request.id;

  insert into public.reward_events(customer_id, request_id, event_type, bill_amount, reward_value)
  values (v_customer.id, v_request.id, 'stamp_approved', v_request.bill_amount, v_reward_value);

  return jsonb_build_object(
    'stampCount', v_count,
    'cycleSpend', v_cycle_spend,
    'rewardValue', v_reward_value,
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
      cycle_spend = 0,
      reward_value = 0,
      updated_at = now()
  where id = p_customer_id;

  insert into public.reward_events(customer_id, event_type, reward_value)
  values (p_customer_id, 'reward_redeemed', v_customer.reward_value);

  return jsonb_build_object('redeemed', true, 'rewardValue', v_customer.reward_value);
end;
$$;

revoke all on function public.approve_stamp_request(uuid) from public, anon, authenticated;
revoke all on function public.redeem_customer_reward(uuid) from public, anon, authenticated;
grant execute on function public.approve_stamp_request(uuid) to service_role;
grant execute on function public.redeem_customer_reward(uuid) to service_role;
