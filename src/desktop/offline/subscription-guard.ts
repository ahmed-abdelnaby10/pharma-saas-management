/**
 * Desktop offline subscription guard.
 *
 * On launch (desktop-only), check whether the stored `offlineValidUntil` date
 * has passed. If so, set the global subscription-blocked flag so the app shows
 * the blocker screen immediately — before any API call is made.
 *
 * This module is intentionally side-effect free when imported in a web context;
 * it only acts when `window.__TAURI__` is present (or the caller checks itself).
 */

import { getAccessToken } from "@/shared/services/auth";
import { decodeAccessToken } from "@/shared/services/auth";
import useSubscription from "@/shared/store/useSubscription";

const OFFLINE_VALID_UNTIL_KEY = "pharma-offline-valid-until";

/**
 * Persist the `offlineValidUntil` ISO date from a decoded token to localStorage
 * so it survives across desktop app restarts.
 */
export function persistOfflineValidUntil(date: string | null | undefined): void {
  if (typeof localStorage === "undefined") return;
  if (date) {
    localStorage.setItem(OFFLINE_VALID_UNTIL_KEY, date);
  } else {
    localStorage.removeItem(OFFLINE_VALID_UNTIL_KEY);
  }
}

/**
 * Run on desktop app launch.
 *
 * 1. Reads `offlineValidUntil` from localStorage.
 * 2. If it has expired, sets `subscriptionBlocked` in the Zustand store.
 *
 * This runs before any network call, so the user sees the blocker immediately
 * if their cached offline period has expired.
 */
export function checkOfflineSubscription(): void {
  // Only relevant on desktop (Tauri)
  if (typeof window === "undefined") return;
  const isTauri =
    // @ts-ignore — Tauri injects this global
    typeof window.__TAURI__ !== "undefined" ||
    typeof (window as any).__TAURI_IPC__ !== "undefined";
  if (!isTauri) return;

  // First, try to get offlineValidUntil from the stored access token
  const token = getAccessToken();
  if (token) {
    const { subscription } = decodeAccessToken(token);
    if (subscription?.offlineValidUntil) {
      persistOfflineValidUntil(subscription.offlineValidUntil);
      if (new Date(subscription.offlineValidUntil).getTime() < Date.now()) {
        useSubscription.getState().setSubscriptionBlocked("offline_expired");
      }
      return;
    }
  }

  // Fallback: read from localStorage cache
  const stored = localStorage.getItem(OFFLINE_VALID_UNTIL_KEY);
  if (stored && new Date(stored).getTime() < Date.now()) {
    useSubscription.getState().setSubscriptionBlocked("offline_expired");
  }
}
