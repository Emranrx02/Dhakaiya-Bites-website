import { NextResponse } from "next/server";
import { isCashierAuthenticated } from "@/lib/cashier-session";
import { supabaseRest } from "@/lib/supabase-admin";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isCashierAuthenticated())) {
    return NextResponse.json({ error: "Please sign in as cashier." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { action?: unknown };
    if (body.action !== "approve" && body.action !== "reject") {
      return NextResponse.json({ error: "Invalid cashier action." }, { status: 400 });
    }

    if (body.action === "reject") {
      const rows = await supabaseRest<Array<{ id: string }>>(
        `stamp_requests?id=eq.${id}&status=eq.pending&select=id`,
        {
          method: "PATCH",
          body: { status: "rejected", reviewed_at: new Date().toISOString() },
          prefer: "return=representation",
        },
      );
      if (!rows[0]) return NextResponse.json({ error: "This request was already reviewed." }, { status: 409 });
      return NextResponse.json({ ok: true, message: "Stamp request rejected." });
    }

    const result = await supabaseRest<{ stampCount?: number; rewardReady?: boolean; cycleSpend?: number; rewardValue?: number }>(
      "rpc/approve_stamp_request",
      { method: "POST", body: { p_request_id: id } },
    );
    const stampCount = Number(result?.stampCount ?? 0);
    return NextResponse.json({
      ok: true,
      message: result?.rewardReady
        ? `7 bills complete — reward limit is ৳${Number(result.rewardValue ?? 0).toLocaleString("en-BD")}!`
        : `Bill approved. Progress is now ${stampCount}/7; approved spend ৳${Number(result?.cycleSpend ?? 0).toLocaleString("en-BD")}.`,
    });
  } catch (error) {
    console.error("Cashier action failed", error);
    return NextResponse.json({ error: "Could not complete the cashier action." }, { status: 500 });
  }
}
