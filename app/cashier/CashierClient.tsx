"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "@/app/rewards/rewards.module.css";

type PendingRequest = {
  id: string;
  requestedAt: string;
  customerId: string;
  name: string;
  phone: string;
  stampCount: number;
  expiresAt: string | null;
  rewardReady: boolean;
  billAmount: number;
  cycleSpend: number;
  rewardValue: number;
};

type Reward = {
  customerId: string;
  name: string;
  phone: string;
  stampCount: number;
  expiresAt: string | null;
  rewardsRedeemed: number;
  cycleSpend: number;
  rewardValue: number;
};

type QueueData = {
  pending: PendingRequest[];
  rewards: Reward[];
  stats: { pending: number; customers: number; rewardsReady: number };
  error?: string;
};

const emptyQueue: QueueData = { pending: [], rewards: [], stats: { pending: 0, customers: 0, rewardsReady: 0 } };

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} hr ago`;
}

function money(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export default function CashierClient() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [queue, setQueue] = useState<QueueData>(emptyQueue);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadQueue = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch("/api/cashier/requests", { cache: "no-store" });
      const data = (await response.json()) as QueueData;
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error(data.error || "Could not load cashier queue.");
      setQueue(data);
      setAuthenticated(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load cashier queue.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/cashier/session", { cache: "no-store" });
        const data = (await response.json()) as { authenticated: boolean };
        setAuthenticated(data.authenticated);
        if (data.authenticated) await loadQueue();
      } catch {
        setAuthenticated(false);
      }
    })();
  }, [loadQueue]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setInterval(() => void loadQueue(true), 6000);
    return () => window.clearInterval(timer);
  }, [authenticated, loadQueue]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/cashier/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      setAuthenticated(true);
      setPin("");
      await loadQueue();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/cashier/session", { method: "DELETE" });
    setAuthenticated(false);
    setQueue(emptyQueue);
  }

  async function requestAction(id: string, action: "approve" | "reject") {
    setActingId(`${action}-${id}`);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/cashier/requests/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Action failed.");
      setNotice(data.message ?? "Done.");
      await loadQueue(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Action failed.");
    } finally {
      setActingId(null);
    }
  }

  async function redeem(customerId: string) {
    setActingId(`redeem-${customerId}`);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/cashier/customers/${customerId}/redeem`, { method: "POST" });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Redemption failed.");
      setNotice(data.message ?? "Reward redeemed.");
      await loadQueue(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Redemption failed.");
    } finally {
      setActingId(null);
    }
  }

  if (authenticated !== true) {
    return (
      <main className={styles.loginWrap}>
        <section className={styles.loginCard}>
          <Link href="/">← Customer page</Link>
          <h1>Cashier portal</h1>
          <p>Enter the staff PIN to verify customer bills and approve reward requests.</p>
          <form onSubmit={login}>
            <label htmlFor="cashier-pin">Cashier PIN</label>
            <input id="cashier-pin" type="password" inputMode="numeric" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="••••" required />
            {error && <p className={styles.error}>{error}</p>}
            <button disabled={loading}>{loading ? "Opening..." : "Open portal"}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.cashierShell}>
      <header className={styles.cashierTop}><div>
        <Link href="/" className={styles.brand}><img src="/brand/logo.png" alt="" /><span><b>Dhakaiya Rewards</b><small>CASHIER DASHBOARD</small></span></Link>
        <nav><Link href="/rewards/qr">Shop QR</Link><button onClick={() => void loadQueue()}>Refresh</button><button onClick={() => void logout()}>Log out</button></nav>
      </div></header>

      <div className={styles.cashierMain}>
        <div className={styles.cashierHeading}><div><small>LIVE COUNTER QUEUE</small><h1>Bill approvals</h1><p>Match every submitted amount with the receipt before approval. New requests refresh every six seconds.</p></div><Link href="/rewards">← Customer page</Link></div>
        <div className={styles.statGrid}>
          <div className={styles.stat}><b>{queue.stats.pending}</b><span>Pending requests</span></div>
          <div className={styles.stat}><b>{queue.stats.customers}</b><span>Total customers</span></div>
          <div className={styles.stat}><b>{queue.stats.rewardsReady}</b><span>Rewards ready</span></div>
        </div>

        {notice && <p className={styles.noticeMessage}>{notice}</p>}
        {error && <p className={styles.error}>{error}</p>}

        {queue.rewards.length > 0 && <section className={styles.queueSection}><h2>Dish rewards ready</h2><div className={styles.queueGrid}>{queue.rewards.map((reward) => (
          <article key={reward.customerId} className={styles.rewardQueueCard}><div className={styles.rewardCustomer}><small>CUSTOMER</small><b>{reward.name}</b><a className={styles.customerPhone} href={`tel:+88${reward.phone}`}>{reward.phone}</a><div className={styles.cashierRewardValue}><span>Reward limit</span><b>{money(reward.rewardValue)}</b></div><p>7-bill spend: {money(reward.cycleSpend)} · Redeemed before: {reward.rewardsRedeemed}</p></div><button className={styles.redeemButton} disabled={actingId !== null} onClick={() => void redeem(reward.customerId)}>{actingId === `redeem-${reward.customerId}` ? "Redeeming..." : `Redeem up to ${money(reward.rewardValue)}`}</button></article>
        ))}</div></section>}

        <section className={styles.queueSection}><h2>Waiting for approval</h2>
          {queue.pending.length === 0 ? <div className={styles.empty}><b>All caught up</b>New customer requests will appear here automatically.</div> : <div className={styles.queueGrid}>{queue.pending.map((item) => (
            <article key={item.id} className={styles.queueCard}>
              <header><div className={styles.customerIdentity}><small>CUSTOMER</small><b>{item.name}</b><a className={styles.customerPhone} href={`tel:+88${item.phone}`}>{item.phone}</a></div><span>{timeAgo(item.requestedAt)}</span></header>
              <div className={styles.billCheck}><small>SUBMITTED BILL</small><b>{money(item.billAmount)}</b><span>Verify this against the customer&apos;s receipt.</span></div>
              <div className={styles.queueProgress}><span>Current progress</span><span>{item.stampCount}/7</span></div>
              <div className={styles.queueSpend}><span>Approved spend</span><b>{money(item.cycleSpend)}</b><span>After approval: {money(item.cycleSpend + item.billAmount)}</span></div>
              <div className={styles.progress}><span style={{ width: `${(item.stampCount / 7) * 100}%` }} /></div>
              <div className={styles.queueActions}><button disabled={actingId !== null} onClick={() => void requestAction(item.id, "reject")}>Reject</button><button disabled={actingId !== null} onClick={() => void requestAction(item.id, "approve")}>{actingId === `approve-${item.id}` ? "Approving..." : "Amount matches — approve"}</button></div>
            </article>
          ))}</div>}
        </section>
      </div>
    </main>
  );
}
