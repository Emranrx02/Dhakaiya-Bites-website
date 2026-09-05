import type { Metadata } from "next";
import RewardsClient from "./RewardsClient";

export const metadata: Metadata = {
  title: "Dhakaiya Rewards | 7 Bills, 1 Free Dish",
  description: "Complete 7 approved Dhakaiya Bites bills within 15 days and get one dish free, worth up to 10% of your total spend.",
};

export default function RewardsPage() {
  return <RewardsClient />;
}
