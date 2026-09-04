import type { Metadata } from "next";
import RewardsQr from "./RewardsQr";

export const metadata: Metadata = { title: "Shop QR | Dhakaiya Rewards" };

export default function RewardsQrPage() {
  return <RewardsQr siteUrl={process.env.NEXT_PUBLIC_SITE_URL ?? ""} />;
}
