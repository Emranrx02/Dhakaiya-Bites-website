import type { Metadata } from "next";
import CashierClient from "./CashierClient";

export const metadata: Metadata = { title: "Cashier Portal | Dhakaiya Rewards" };

export default function CashierPage() {
  return <CashierClient />;
}
