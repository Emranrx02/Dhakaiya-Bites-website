import { NextResponse } from "next/server";
import { customerResponse, normalizeBangladeshPhone, type RewardCustomer } from "@/lib/rewards";
import { supabaseRest } from "@/lib/supabase-admin";

const customerFields = "id,name,phone,stamp_count,cycle_started_at,expires_at,reward_ready,rewards_redeemed";

export async function GET(request: Request) {
  try {
    const phone = normalizeBangladeshPhone(new URL(request.url).searchParams.get("phone") ?? "");
    if (!phone) return NextResponse.json({ error: "Invalid mobile number." }, { status: 400 });

    const [customer] = await supabaseRest<RewardCustomer[]>(
      `customers?phone=eq.${phone}&select=${customerFields}&limit=1`,
    );
    if (!customer) return NextResponse.json({ error: "Stamp card not found." }, { status: 404 });

    const pending = await supabaseRest<{ id: string }[]>(
      `stamp_requests?customer_id=eq.${customer.id}&status=eq.pending&select=id&limit=1`,
    );

    return NextResponse.json({
      requestStatus: customer.reward_ready ? "reward_ready" : pending[0] ? "pending" : "approved",
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
