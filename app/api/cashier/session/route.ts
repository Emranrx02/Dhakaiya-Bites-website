import { NextResponse } from "next/server";
import { cashierPinMatches, clearCashierSession, isCashierAuthenticated, setCashierSession } from "@/lib/cashier-session";

export async function GET() {
  return NextResponse.json({ authenticated: await isCashierAuthenticated() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: unknown };
    if (typeof body.pin !== "string" || !cashierPinMatches(body.pin.trim())) {
      return NextResponse.json({ error: "Cashier PIN is incorrect." }, { status: 401 });
    }
    await setCashierSession();
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Cashier login failed", error);
    return NextResponse.json({ error: "Cashier login is not configured yet." }, { status: 503 });
  }
}

export async function DELETE() {
  await clearCashierSession();
  return NextResponse.json({ authenticated: false });
}
