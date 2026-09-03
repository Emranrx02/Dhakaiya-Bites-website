import type { Metadata } from "next";
import RewardsClient from "./RewardsClient";

export const metadata: Metadata = {
  title: "Dhakaiya Rewards | 7 Stamps, 1 Free Dish",
  description: "Collect 7 Dhakaiya Bites stamps within 15 days and unlock a free dish.",
};

export default function RewardsPage() {
  return <RewardsClient />;
}
