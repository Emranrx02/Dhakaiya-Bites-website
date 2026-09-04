"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "../rewards.module.css";

export default function RewardsQr({ siteUrl }: { siteUrl: string }) {
  const [rewardUrl, setRewardUrl] = useState(siteUrl ? `${siteUrl.replace(/\/$/, "")}/rewards` : "");

  useEffect(() => {
    if (rewardUrl) return;
    const timer = window.setTimeout(() => setRewardUrl(`${window.location.origin}/rewards`), 0);
    return () => window.clearTimeout(timer);
  }, [rewardUrl]);

  return (
    <main className={styles.qrWrap}>
      <section className={styles.qrCard}>
        <div className={styles.qrActions}><Link href="/cashier">← Cashier portal</Link><button onClick={() => window.print()}>Print QR</button></div>
        <h1>Scan. Stamp. Enjoy.</h1>
        <p>Collect 7 stamps within 15 days and get 1 dish FREE from our reward menu.</p>
        <div className={styles.qrCode}>
          {rewardUrl ? <QRCodeSVG value={rewardUrl} size={300} level="H" bgColor="#ffffff" fgColor="#12372c" title="Dhakaiya Rewards QR code" /> : <div style={{ width: 300, height: 300 }} />}
        </div>
        <strong>7 STAMPS · 15 DAYS · 1 FREE DISH</strong>
        <small>Open your camera and point it at the QR code to start.</small>
      </section>
    </main>
  );
}
