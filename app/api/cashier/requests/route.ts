import { NextResponse } from "next/server";
import { isCashierAuthenticated } from "@/lib/cashier-session";
import { supabaseRest } from "@/lib/supabase-admin";

type PendingRow = {
  id: string;
  requested_at: string;
  bill_amount: number;
  customer: {
    id: string;
    name: string;
    phone: string;
    stamp_count: number;
    expires_at: string | null;
    reward_ready: boolean;
    cycle_spend: number;
    reward_value: number;
  } | Array<{
    id: string;
    name: string;
    phone: string;
    stamp_count: number;
    expires_at: string | null;
    reward_ready: boolean;
    cycle_spend: number;
    reward_value: number;
  }>;
};

type RewardRow = {
  id: string;
  name: string;
  phone: string;
  stamp_count: number;
  expires_at: string | null;
  rewards_redeemed: number;
  cycle_spend: number;
  reward_value: number;
};

export async function GET() {
  if (!(await isCashierAuthenticated())) {
    return NextResponse.json({ error: "Please sign in as cashier." }, { status: 401 });
  }

  try {
    const [requestRows, rewardRows, customerRows] = await Promise.all([
      supabaseRest<PendingRow[]>(
        "stamp_requests?status=eq.pending&select=id,requested_at,bill_amount,customer:customers(id,name,phone,stamp_count,expires_at,reward_ready,cycle_spend,reward_value)&order=requested_at.asc",
      ),
      supabaseRest<RewardRow[]>(
        "customers?reward_ready=eq.true&select=id,name,phone,stamp_count,expires_at,rewards_redeemed,cycle_spend,reward_value&order=updated_at.asc",
      ),
      supabaseRest<Array<{ id: string; reward_ready: boolean }>>("customers?select=id,reward_ready"),
    ]);

    const pending = requestRows.flatMap((request) => {
      const customer = Array.isArray(request.customer) ? request.customer[0] : request.customer;
      if (!customer) return [];
      return [{
        id: request.id,
        requestedAt: request.requested_at,
        customerId: customer.id,
        name: customer.name,
        phone: customer.phone,
        stampCount: customer.stamp_count,
        expiresAt: customer.expires_at,
        rewardReady: customer.reward_ready,
        billAmount: request.bill_amount,
        cycleSpend: customer.cycle_spend,
        rewardValue: customer.reward_value,
      }];
    });

    return NextResponse.json({
      pending,
      rewards: rewardRows.map((customer) => ({
        customerId: customer.id,
        name: customer.name,
        phone: customer.phone,
        stampCount: customer.stamp_count,
        expiresAt: customer.expires_at,
        rewardsRedeemed: customer.rewards_redeemed,
        cycleSpend: customer.cycle_spend,
        rewardValue: customer.reward_value,
      })),
      stats: {
        pending: pending.length,
        customers: customerRows.length,
        rewardsReady: customerRows.filter((customer) => customer.reward_ready).length,
      },
    });
  } catch (error) {
    console.error("Cashier queue failed", error);
    return NextResponse.json({ error: "Could not load cashier queue." }, { status: 500 });
  }
}
