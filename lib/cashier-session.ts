import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "dhakaiya_cashier_session";
const SESSION_SECONDS = 8 * 60 * 60;

function sessionSecret() {
  const secret = process.env.CASHIER_SESSION_SECRET;
  if (!secret || secret.length < 24) throw new Error("Cashier session secret is not configured.");
  return secret;
}

function signature(expiresAt: string) {
  return createHmac("sha256", sessionSecret()).update(expiresAt).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function cashierPinMatches(pin: string) {
  const expected = process.env.CASHIER_PIN;
  return Boolean(expected && safeEqual(pin, expected));
}

export function createCashierSessionToken() {
  const expiresAt = String(Date.now() + SESSION_SECONDS * 1000);
  return `${expiresAt}.${signature(expiresAt)}`;
}

export function verifyCashierSessionToken(token: string | undefined) {
  if (!token) return false;
  const [expiresAt, suppliedSignature] = token.split(".");
  if (!expiresAt || !suppliedSignature || Number(expiresAt) <= Date.now()) return false;
  return safeEqual(suppliedSignature, signature(expiresAt));
}

export async function isCashierAuthenticated() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  try {
    return verifyCashierSessionToken(token);
  } catch {
    return false;
  }
}

export async function setCashierSession() {
  (await cookies()).set(COOKIE_NAME, createCashierSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearCashierSession() {
  (await cookies()).set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
