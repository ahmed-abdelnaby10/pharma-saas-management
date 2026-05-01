import { create } from "zustand";

export type SubscriptionStatus =
  | "ACTIVE"
  | "TRIALING"
  | "CANCELED"
  | "PAST_DUE"
  | "EXPIRED";

export interface SubscriptionClaims {
  id: string;
  status: SubscriptionStatus;
  trialEndsAt?: string | null;   // ISO date string
  offlineValidUntil?: string | null; // ISO date string
}

type SubscriptionStore = {
  /** True when the API returned 402 — app should show the blocker screen. */
  subscriptionBlocked: boolean;
  /** Reason code returned by the 402 response (e.g. "trial_expired", "canceled"). */
  blockReason: string | null;
  /** Subscription claims decoded from the JWT. */
  claims: SubscriptionClaims | null;
  // ── Actions ─────────────────────────────────────────────────────────────────
  setSubscriptionBlocked: (reason?: string) => void;
  clearSubscriptionBlocked: () => void;
  setClaims: (claims: SubscriptionClaims | null) => void;
};

const useSubscription = create<SubscriptionStore>()((set) => ({
  subscriptionBlocked: false,
  blockReason: null,
  claims: null,

  setSubscriptionBlocked: (reason?: string) =>
    set({ subscriptionBlocked: true, blockReason: reason ?? null }),

  clearSubscriptionBlocked: () =>
    set({ subscriptionBlocked: false, blockReason: null }),

  setClaims: (claims) => set({ claims }),
}));

export default useSubscription;
