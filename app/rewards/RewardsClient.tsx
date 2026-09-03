"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "./rewards.module.css";

type CustomerCard = {
  name: string;
  phone: string;
  stampCount: number;
  cycleStartedAt: string | null;
  expiresAt: string | null;
  rewardReady: boolean;
  rewardsRedeemed: number;
  stampsRequired: number;
};

type CardResponse = {
  requestStatus: "pending" | "approved" | "reward_ready";
  customer: CustomerCard;
  message?: string;
  error?: string;
};

function expiryLabel(value: string | null) {
  if (!value) return "Starts after your first approved stamp";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export default function RewardsClient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState<CustomerCard | null>(null);
  const [status, setStatus] = useState<CardResponse["requestStatus"] | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStatus = useCallback(async (mobile: string) => {
    try {
      const response = await fetch(`/api/rewards/status?phone=${encodeURIComponent(mobile)}`, { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as CardResponse;
      setCard(data.customer);
      setStatus(data.requestStatus);
    } catch {
      // A temporary refresh failure should not clear the card already on screen.
    }
  }, []);

  useEffect(() => {
    const savedPhone = localStorage.getItem("dhakaiya-rewards-phone") ?? "";
    const savedName = localStorage.getItem("dhakaiya-rewards-name") ?? "";
    if (!savedPhone) return;
    const timer = window.setTimeout(() => {
      setPhone(savedPhone);
      setName(savedName);
      void loadStatus(savedPhone);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadStatus]);

  useEffect(() => {
    if (status !== "pending" || !phone) return;
    const timer = window.setInterval(() => void loadStatus(phone), 5000);
    return () => window.clearInterval(timer);
  }, [loadStatus, phone, status]);

  async function requestStamp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/rewards/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = (await response.json()) as CardResponse;
      if (!response.ok) throw new Error(data.error || "Could not request a stamp.");
      setCard(data.customer);
      setStatus(data.requestStatus);
      setMessage(data.message ?? "Stamp request sent.");
      localStorage.setItem("dhakaiya-rewards-phone", phone);
      localStorage.setItem("dhakaiya-rewards-name", name);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not request a stamp.");
    } finally {
      setLoading(false);
    }
  }

  const stampCount = card?.stampCount ?? 0;

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Dhakaiya Bites home">
          <img src="/brand/logo.png" alt="Dhakaiya Bites" />
          <span><b>Dhakaiya Bites</b><small>REWARDS</small></span>
        </Link>
        <div className={styles.rulePill}>7 stamps · 15 days · 1 free dish</div>
      </header>

      <section className={styles.mainGrid}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>✦ EAT MORE. EARN MORE.</div>
          <h1>Your next favourite dish could be <em>on us.</em></h1>
          <p className={styles.lead}>Scan in-store, request a stamp, and let our cashier approve it. Collect seven within fifteen days to unlock a free dish from the reward menu.</p>

          <div className={styles.stampCard}>
            <div className={styles.cardHeading}>
              <div><small>DIGITAL STAMP CARD</small><h2>{card ? `Hi, ${card.name}` : "Get today’s stamp"}</h2></div>
              <span className={styles.scanIcon}>⌁</span>
            </div>

            <div className={styles.stamps} aria-label={`${stampCount} of 7 stamps collected`}>
              {Array.from({ length: 7 }, (_, index) => (
                <span key={index} className={index < stampCount ? styles.earned : ""}>{index < stampCount ? "✓" : "●"}</span>
              ))}
            </div>
            <div className={styles.progress}><span style={{ width: `${(stampCount / 7) * 100}%` }} /></div>

            {card && <div className={styles.cardMeta}><span>{card.phone}</span><span>Valid until: {expiryLabel(card.expiresAt)}</span></div>}

            {status === "reward_ready" ? (
              <div className={styles.rewardReady}><b>🎁 Free dish unlocked!</b><span>Show this card to the cashier to redeem.</span></div>
            ) : (
              <form onSubmit={requestStamp} className={styles.form}>
                <label htmlFor="reward-name">Your name</label>
                <input id="reward-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" autoComplete="name" required />
                <label htmlFor="reward-phone">WhatsApp number</label>
                <input id="reward-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel" required />
                <small>One mobile number can open one reward card. No OTP is required.</small>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}
                <button disabled={loading || status === "pending"}>
                  {loading ? "Sending request..." : status === "pending" ? "Waiting for cashier approval" : "Get stamp"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.foodVisual}>
          <img src="/brand/hot-chicken.jpg" alt="Dhakaiya Bites hot chicken" />
          <div className={styles.foodCaption}><small>THE REWARD</small><b>One dish, completely free.</b></div>
        </div>
      </section>

      <section className={styles.steps}>
        <div><small>SIMPLE BY DESIGN</small><h2>Three steps. One delicious reward.</h2></div>
        <div className={styles.stepGrid}>
          <article><span>01</span><b>Scan & enter</b><p>Scan the in-store QR and enter your name and WhatsApp number.</p></article>
          <article><span>02</span><b>Cashier approves</b><p>Show your request after ordering. The cashier approves one stamp.</p></article>
          <article><span>03</span><b>Enjoy it free</b><p>Complete seven stamps within fifteen days and unlock a free dish.</p></article>
        </div>
        <footer><span>© 2026 Dhakaiya Bites.</span><Link href="/cashier">Staff cashier portal →</Link></footer>
      </section>
    </main>
  );
}
