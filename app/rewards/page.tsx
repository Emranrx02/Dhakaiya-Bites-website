import type { Metadata } from "next";
import RewardsClient from "./RewardsClient";

export const metadata: Metadata = {
  title: "Dhakaiya Rewards | 7 Bills, 1 Free Dish",
  description: "Complete 7 approved Dhakaiya Bites bills within 15 days and get one dish free, worth 20% of your total spend up to ৳1,000.",
};

export default function RewardsPage() {
  return <RewardsClient />;
}
