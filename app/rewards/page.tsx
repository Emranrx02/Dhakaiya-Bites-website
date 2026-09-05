import type { Metadata } from "next";
import RewardsClient from "./RewardsClient";

export const metadata: Metadata = {
  title: "Dhakaiya Rewards | 7 Bills, 10% Dish Reward",
  description: "Complete 7 approved Dhakaiya Bites bills within 15 days and get 10% of your total spend toward one dish.",
};

export default function RewardsPage() {
  return <RewardsClient />;
}
