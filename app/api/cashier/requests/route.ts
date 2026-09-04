import { NextResponse } from "next/server";
import { isCashierAuthenticated } from "@/lib/cashier-session";
import { supabaseRest } from "@/lib/supabase-admin";

type PendingRow = {
  id: string;
  requested_at: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    stamp_count: number;
    expires_at: string | null;
    reward_ready: boolean;
  } | Array<{
    id: string;
    name: string;
    phone: string;
    stamp_count: number;
    expires_at: string | null;
    reward_ready: boolean;
  }>;
};

type RewardRow = {
  id: string;
  name: string;
  phone: string;
  stamp_count: number;
  expires_at: string | null;
  rewards_redeemed: number;
};

export async function GET() {
  if (!(await isCashierAuthenticated())) {
    return NextResponse.json({ error: "Please sign in as cashier." }, { status: 401 });
  }

  try {
    const [requestRows, rewardRows, customerRows] = await Promise.all([
      supabaseRest<PendingRow[]>(
        "stamp_requests?status=eq.pending&select=id,requested_at,customer:customers(id,name,phone,stamp_count,expires_at,reward_ready)&order=requested_at.asc",
      ),
      supabaseRest<RewardRow[]>(
        "customers?reward_ready=eq.true&select=id,name,phone,stamp_count,expires_at,rewards_redeemed&order=updated_at.asc",
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
