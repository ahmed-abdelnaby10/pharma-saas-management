/**
 * Subscription heartbeat — keeps the server informed the session is active
 * and refreshes the subscription claim so the UI stays in sync.
 *
 * Usage: call `startHeartbeat()` once on app mount (after authentication).
 * Returns a cleanup function that clears the interval.
 */

import { apiClient } from "@/shared/api/client";
import { TENANT_API } from "@/shared/utils/constants";
import { decodeAccessToken } from "@/shared/services/auth";
import { getAccessToken } from "@/shared/services/auth";
import useSubscription from "@/shared/store/useSubscription";

const HEARTBEAT_INTERVAL_MS = 30 * 60 * 1_000; // 30 minutes

async function sendHeartbeat(): Promise<void> {
  try {
    const res = await apiClient.post(TENANT_API.auth.heartbeat);
    // If the backend rotates and returns a fresh access token, decode its claims
    const newToken: string | undefined =
      res.data?.data?.accessToken ?? res.data?.accessToken;
    if (newToken) {
      const { subscription } = decodeAccessToken(newToken);
      if (subscription) {
        useSubscription.getState().setClaims({
          id: subscription.id,
          status: subscription.status as any,
          trialEndsAt: subscription.trialEndsAt,
          offlineValidUntil: subscription.offlineValidUntil,
        });
      }
    }
  } catch {
    // Heartbeat failures are silent — the 402 interceptor in client.ts
    // will surface subscription-blocked state if the server returns 402.
  }
}

export function startHeartbeat(): () => void {
  // Only run when there's an active token
  if (!getAccessToken()) return () => undefined;

  // Fire immediately on start, then every 30 min
  sendHeartbeat();
  const id = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
  return () => clearInterval(id);
}
