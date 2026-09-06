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
  cycleSpend: number;
  rewardValue: number;
  stampsRequired: number;
  rewardPercent: number;
};

type CardResponse = {
  requestStatus: "pending" | "approved" | "reward_ready";
  customer: CustomerCard;
  pendingBillAmount?: number;
  message?: string;
  error?: string;
};

function expiryLabel(value: string | null) {
  if (!value) return "Starts after your first approved stamp";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function money(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export default function RewardsClient() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [card, setCard] = useState<CustomerCard | null>(null);
  const [status, setStatus] = useState<CardResponse["requestStatus"] | null>(null);
  const [message, setMessage] = useState("");
  const [pendingBillAmount, setPendingBillAmount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStatus = useCallback(async (mobile: string) => {
    try {
      const response = await fetch(`/api/rewards/status?phone=${encodeURIComponent(mobile)}`, { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as CardResponse;
      setCard(data.customer);
      setStatus(data.requestStatus);
      setPendingBillAmount(data.pendingBillAmount ?? null);
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
        body: JSON.stringify({ name, phone, billAmount: Number(billAmount) }),
      });
      const data = (await response.json()) as CardResponse;
      if (!response.ok) throw new Error(data.error || "Could not request a stamp.");
      setCard(data.customer);
      setStatus(data.requestStatus);
      setPendingBillAmount(data.pendingBillAmount ?? Number(billAmount));
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
        <div className={styles.rulePill}>7 bills · 15 days · 1 free dish</div>
      </header>

      <section className={styles.mainGrid}>
        <div className={styles.content}>
          <div className={styles.eyebrow}>✦ EAT MORE. EARN MORE.</div>
          <h1>Your next favourite dish could be <em>on us.</em></h1>
          <p className={styles.lead}>Submit each bill and let our cashier verify it. Complete seven approved bills within fifteen days to get one dish free—up to 10% of your total spend.</p>

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

            {card && (
              <div className={styles.spendSummary}>
                <div><small>APPROVED SPEND</small><b>{money(card.cycleSpend)}</b></div>
                <div><small>FREE DISH LIMIT</small><b>{money(card.rewardValue)}</b></div>
              </div>
            )}

            {status === "reward_ready" ? (
              <div className={styles.rewardReady}><b>🎁 1 free dish unlocked!</b><span>Choose any one dish priced at or below {money(card?.rewardValue ?? 0)}, then ask the cashier to redeem it.</span></div>
            ) : status === "pending" ? (
              <div className={styles.pendingBill}><small>WAITING FOR CASHIER</small><b>{money((pendingBillAmount ?? Number(billAmount)) || 0)}</b><span>Keep your receipt ready. Your card will update automatically after approval.</span>{message && <p className={styles.success}>{message}</p>}</div>
            ) : (
              <form onSubmit={requestStamp} className={styles.form}>
                <label htmlFor="reward-name">Your name</label>
                <input id="reward-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" autoComplete="name" required />
                <label htmlFor="reward-phone">WhatsApp number</label>
                <input id="reward-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel" required />
                <label htmlFor="bill-amount">Today&apos;s bill amount</label>
                <div className={styles.moneyInput}><span>৳</span><input id="bill-amount" type="number" min="1" max="100000" step="1" value={billAmount} onChange={(event) => setBillAmount(event.target.value)} placeholder="500" inputMode="numeric" required /></div>
                <small>Enter the receipt total. The cashier will match it with your bill before approval. One mobile number opens one reward card; no OTP is required.</small>
                {error && <p className={styles.error}>{error}</p>}
                {message && <p className={styles.success}>{message}</p>}
                <button disabled={loading}>
                  {loading ? "Sending request..." : "Submit bill for approval"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.foodVisual}>
          <img src="/brand/hot-chicken.jpg" alt="Dhakaiya Bites hot chicken" />
          <div className={styles.foodCaption}><small>THE REWARD</small><b>One dish free, worth up to 10% of your spend.</b></div>
        </div>
      </section>

      <section className={styles.steps}>
        <div><small>SIMPLE BY DESIGN</small><h2>Three steps. A reward based on your spend.</h2></div>
        <div className={styles.stepGrid}>
          <article><span>01</span><b>Scan & submit</b><p>Enter your name, WhatsApp number, and the total shown on today&apos;s bill.</p></article>
          <article><span>02</span><b>Cashier verifies</b><p>The cashier matches the amount with your receipt and approves one bill.</p></article>
          <article><span>03</span><b>Enjoy 1 free dish</b><p>After seven approvals, choose one free dish worth up to 10% of your total spend.</p></article>
        </div>
        <div className={styles.rewardFooter}>
          <span>© 2026 Dhakaiya Bites.</span>
          <span>7 bills · 15 days · 1 free dish</span>
        </div>
      </section>
    </main>
  );
}
