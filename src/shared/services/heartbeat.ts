import { apiClient } from "@/shared/api/client";
import { TENANT_API } from "@/shared/utils/constants";
import { decodeAccessToken, getAccessToken } from "@/shared/services/auth";
import useSubscription from "@/shared/store/useSubscription";

const HEARTBEAT_INTERVAL_MS = 30 * 60 * 1_000; // 30 minutes

// Guards against multiple concurrent intervals if isAuthenticated toggles rapidly.
let activeIntervalId: ReturnType<typeof setInterval> | null = null;

async function sendHeartbeat(): Promise<void> {
  try {
    const res = await apiClient.post(TENANT_API.auth.heartbeat);
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
    // Failures are silent — the 402 interceptor in client.ts surfaces
    // subscription-blocked state when the server returns 402.
  }
}

export function startHeartbeat(): () => void {
  if (!getAccessToken()) return () => undefined;

  // Prevent duplicate intervals if called again before cleanup
  if (activeIntervalId !== null) {
    return () => {
      if (activeIntervalId !== null) {
        clearInterval(activeIntervalId);
        activeIntervalId = null;
      }
    };
  }

  sendHeartbeat();
  activeIntervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

  return () => {
    if (activeIntervalId !== null) {
      clearInterval(activeIntervalId);
      activeIntervalId = null;
    }
  };
}
