export const STAMPS_REQUIRED = 7;
export const REWARD_PERCENT = 10;

export type RewardCustomer = {
  id: string;
  name: string;
  phone: string;
  stamp_count: number;
  cycle_started_at: string | null;
  expires_at: string | null;
  reward_ready: boolean;
  rewards_redeemed: number;
  cycle_spend: number;
  reward_value: number;
};

export function normalizeBangladeshPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (/^01\d{9}$/.test(digits)) return digits;
  if (/^8801\d{9}$/.test(digits)) return `0${digits.slice(3)}`;
  return null;
}

export function maskPhone(phone: string) {
  return `${phone.slice(0, 3)}•••••${phone.slice(-3)}`;
}

export function isExpired(expiresAt: string | null) {
  return Boolean(expiresAt && new Date(expiresAt).getTime() <= Date.now());
}

export function customerResponse(customer: RewardCustomer) {
  return {
    name: customer.name,
    phone: maskPhone(customer.phone),
    stampCount: customer.stamp_count,
    cycleStartedAt: customer.cycle_started_at,
    expiresAt: customer.expires_at,
    rewardReady: customer.reward_ready,
    rewardsRedeemed: customer.rewards_redeemed,
    cycleSpend: customer.cycle_spend,
    rewardValue: customer.reward_value,
    stampsRequired: STAMPS_REQUIRED,
    rewardPercent: REWARD_PERCENT,
  };
}
