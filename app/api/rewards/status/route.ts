import { NextResponse } from "next/server";
import { customerResponse, isExpired, normalizeBangladeshPhone, type RewardCustomer } from "@/lib/rewards";
import { supabaseRest } from "@/lib/supabase-admin";

const customerFields = "id,name,phone,stamp_count,cycle_started_at,expires_at,reward_ready,rewards_redeemed,cycle_spend,reward_value";

export async function GET(request: Request) {
  try {
    const phone = normalizeBangladeshPhone(new URL(request.url).searchParams.get("phone") ?? "");
    if (!phone) return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });

    let [customer] = await supabaseRest<RewardCustomer[]>(
      `customers?phone=eq.${phone}&select=${customerFields}&limit=1`,
    );
    if (!customer) return NextResponse.json({ error: "Stamp card not found." }, { status: 404 });

    if (!customer.reward_ready && isExpired(customer.expires_at)) {
      [customer] = await supabaseRest<RewardCustomer[]>(
        `customers?id=eq.${customer.id}&select=${customerFields}`,
        {
          method: "PATCH",
          body: { stamp_count: 0, cycle_started_at: null, expires_at: null, cycle_spend: 0, reward_value: 0, updated_at: new Date().toISOString() },
          prefer: "return=representation",
        },
      );
      if (!customer) throw new Error("Customer could not be reset.");
    }

    const pending = await supabaseRest<{ id: string; bill_amount: number }[]>(
      `stamp_requests?customer_id=eq.${customer.id}&status=eq.pending&select=id,bill_amount&limit=1`,
    );

    return NextResponse.json({
      requestStatus: customer.reward_ready ? "reward_ready" : pending[0] ? "pending" : "approved",
      pendingBillAmount: pending[0]?.bill_amount,
      customer: customerResponse(customer),
    });
  } catch (error) {
    console.error("Reward status failed", error);
    const setupMissing = error instanceof Error && error.message.includes("not configured");
    return NextResponse.json(
      { error: setupMissing ? "Rewards setup is not connected yet." : "Could not load the stamp card." },
      { status: setupMissing ? 503 : 500 },
    );
  }
}
