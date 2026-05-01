import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Clock, X } from "lucide-react";
import { toast } from "sonner";
import useSubscription from "@/shared/store/useSubscription";

const TRIAL_TOAST_KEY = "pharma-trial-toast-shown";

function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Sticky trial-expiry banner. Rules:
 * - Hidden when >7 days remain
 * - Yellow (warning) when 4–7 days remain
 * - Orange (urgent) when 1–3 days remain
 * - Also fires a one-per-session toast when ≤3 days remain
 */
export function TrialBanner() {
  const { claims } = useSubscription();
  const toastFiredRef = useRef(false);

  const trialEndsAt = claims?.status === "TRIALING" ? claims.trialEndsAt : null;
  const days = trialEndsAt ? daysUntil(trialEndsAt) : null;

  // Fire toast once per session when ≤3 days
  useEffect(() => {
    if (
      days !== null &&
      days <= 3 &&
      !toastFiredRef.current &&
      !sessionStorage.getItem(TRIAL_TOAST_KEY)
    ) {
      toastFiredRef.current = true;
      sessionStorage.setItem(TRIAL_TOAST_KEY, "1");
      toast.warning(
        `Your free trial expires in ${days} day${days !== 1 ? "s" : ""}. Upgrade to keep access.`,
        { duration: 8000 },
      );
    }
  }, [days]);

  // Hide when not trialing or >7 days remain
  if (days === null || days > 7) return null;

  const isUrgent = days <= 3;

  const bannerClass = isUrgent
    ? "bg-orange-500 text-white"
    : "bg-yellow-400 text-yellow-900";

  const message = isUrgent
    ? `Trial ending soon — ${days} day${days !== 1 ? "s" : ""} left`
    : `Your trial ends in ${days} days`;

  return (
    <div
      className={`sticky top-0 z-40 flex items-center justify-between px-4 py-2 text-sm font-medium ${bannerClass}`}
      role="alert"
    >
      <span className="flex items-center gap-2">
        <Clock className="w-4 h-4 flex-shrink-0" />
        {message}
      </span>
      <Link
        to="/app/subscription"
        className={`ml-4 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
          isUrgent
            ? "bg-white text-orange-600 hover:bg-orange-50"
            : "bg-yellow-900/10 text-yellow-900 hover:bg-yellow-900/20"
        }`}
      >
        Upgrade Now
      </Link>
    </div>
  );
}
