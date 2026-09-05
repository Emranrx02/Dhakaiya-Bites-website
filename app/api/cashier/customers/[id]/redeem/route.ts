import { NextResponse } from "next/server";
import { isCashierAuthenticated } from "@/lib/cashier-session";
import { supabaseRest } from "@/lib/supabase-admin";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isCashierAuthenticated())) {
    return NextResponse.json({ error: "Please sign in as cashier." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await supabaseRest("rpc/redeem_customer_reward", {
      method: "POST",
      body: { p_customer_id: id },
    });
    return NextResponse.json({ ok: true, message: "Dish reward redeemed and the card was reset." });
  } catch (error) {
    console.error("Reward redemption failed", error);
    return NextResponse.json({ error: "Could not redeem the reward." }, { status: 500 });
  }
}
