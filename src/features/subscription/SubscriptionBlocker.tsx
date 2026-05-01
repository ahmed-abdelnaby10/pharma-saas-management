import React from "react";
import { AlertOctagon, ExternalLink } from "lucide-react";
import useSubscription from "@/shared/store/useSubscription";

const reasonMessages: Record<string, string> = {
  trial_expired: "Your free trial period has ended.",
  canceled: "Your subscription has been canceled.",
  past_due: "Your payment is overdue. Please update your billing information.",
  offline_expired:
    "Offline access has expired. Please connect to the internet to verify your subscription.",
};

/**
 * Full-screen blocker rendered when the API returns 402 (subscription expired).
 * Sits above everything in the React tree — place it just inside App root, before
 * the router output.
 */
export function SubscriptionBlocker() {
  const { subscriptionBlocked, blockReason } = useSubscription();

  if (!subscriptionBlocked) return null;

  const message =
    (blockReason && reasonMessages[blockReason]) ||
    "Your subscription has expired or your trial has ended. Please upgrade to continue.";

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertOctagon className="w-10 h-10 text-red-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Subscription Required
      </h1>
      <p className="text-gray-600 max-w-md mb-8 leading-relaxed">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/app/subscription"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-colors"
        >
          Upgrade Plan
          <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href="mailto:support@pharmasaas.com"
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
