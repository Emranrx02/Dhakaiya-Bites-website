import { NextResponse } from "next/server";
import { customerResponse, isExpired, normalizeBangladeshPhone, type RewardCustomer } from "@/lib/rewards";
import { supabaseRest, SupabaseRequestError } from "@/lib/supabase-admin";

const customerFields = "id,name,phone,stamp_count,cycle_started_at,expires_at,reward_ready,rewards_redeemed,cycle_spend,reward_value";

function validName(value: unknown) {
  return typeof value === "string" && value.trim().length >= 2 && value.trim().length <= 60;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: unknown; phone?: unknown; billAmount?: unknown };
    if (!validName(body.name) || typeof body.phone !== "string") {
      return NextResponse.json({ error: "Please enter a valid name and mobile number." }, { status: 400 });
    }

    const name = (body.name as string).trim();
    const phone = normalizeBangladeshPhone(body.phone);
    const billAmount = Number(body.billAmount);
    if (!phone) {
      return NextResponse.json({ error: "Use a valid Bangladeshi number, for example 01XXXXXXXXX." }, { status: 400 });
    }
    if (!Number.isInteger(billAmount) || billAmount < 1 || billAmount > 100000) {
      return NextResponse.json({ error: "Enter a valid bill amount between ৳1 and ৳100,000." }, { status: 400 });
    }

    let [customer] = await supabaseRest<RewardCustomer[]>(
      `customers?phone=eq.${phone}&select=${customerFields}&limit=1`,
    );

    if (!customer) {
      try {
        [customer] = await supabaseRest<RewardCustomer[]>(`customers?select=${customerFields}`, {
          method: "POST",
          body: { name, phone },
          prefer: "return=representation",
        });
      } catch (error) {
        if (!(error instanceof SupabaseRequestError) || error.code !== "23505") throw error;
        [customer] = await supabaseRest<RewardCustomer[]>(
          `customers?phone=eq.${phone}&select=${customerFields}&limit=1`,
        );
      }
    }

    if (!customer) throw new Error("Customer could not be created.");

    if (!customer.reward_ready && isExpired(customer.expires_at)) {
      [customer] = await supabaseRest<RewardCustomer[]>(
        `customers?id=eq.${customer.id}&select=${customerFields}`,
        {
          method: "PATCH",
          body: { stamp_count: 0, cycle_started_at: null, expires_at: null, cycle_spend: 0, reward_value: 0, updated_at: new Date().toISOString() },
          prefer: "return=representation",
        },
      );
    }

    if (customer.reward_ready) {
      return NextResponse.json({
        requestStatus: "reward_ready",
        customer: customerResponse(customer),
        message: `Your free dish is ready. Choose one priced at or below ৳${customer.reward_value}.`,
      });
    }

    const pending = await supabaseRest<{ id: string; bill_amount: number }[]>(
      `stamp_requests?customer_id=eq.${customer.id}&status=eq.pending&select=id,bill_amount&limit=1`,
    );
    let requestId = pending[0]?.id;
    let pendingBillAmount = pending[0]?.bill_amount;
    if (!requestId) {
      try {
        const created = await supabaseRest<{ id: string }[]>("stamp_requests?select=id", {
          method: "POST",
          body: { customer_id: customer.id, bill_amount: billAmount },
          prefer: "return=representation",
        });
        requestId = created[0]?.id;
        pendingBillAmount = billAmount;
      } catch (error) {
        if (!(error instanceof SupabaseRequestError) || error.code !== "23505") throw error;
        const existing = await supabaseRest<{ id: string; bill_amount: number }[]>(
          `stamp_requests?customer_id=eq.${customer.id}&status=eq.pending&select=id,bill_amount&limit=1`,
        );
        requestId = existing[0]?.id;
        pendingBillAmount = existing[0]?.bill_amount;
      }
    }

    return NextResponse.json({
      requestStatus: "pending",
      requestId,
      pendingBillAmount: pendingBillAmount ?? billAmount,
      customer: customerResponse(customer),
      message: pending[0]
        ? "Your stamp request is already waiting for cashier approval."
        : "Stamp requested. Please show this screen to the cashier.",
    });
  } catch (error) {
    console.error("Reward request failed", error);
    const setupMissing = error instanceof Error && error.message.includes("not configured");
    return NextResponse.json(
      { error: setupMissing ? "Rewards setup is not connected yet." : "Stamp service is temporarily unavailable." },
      { status: setupMissing ? 503 : 500 },
    );
  }
}
