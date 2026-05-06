import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useSubscriptionsQuery } from "@/features/admin/api";
import type { TenantSubscription } from "@/features/admin/api";
import { useAdminSubscriptionDetailQuery } from "../api/subscriptions.hooks";
import CreateSubscriptionModal from "./CreateSubscriptionModal";
import EditSubscriptionModal from "./EditSubscriptionModal";
import StatusBadge from "./StatusBadge";
import CancelSubscriptionModal from "./CancelSubscriptionModal";

export interface TenantListRow {
  id: string;
  name: string;
  email: string;
  currentPlanName?: string;
  currentStatus?: "active" | "trialing" | "past_due" | "canceled" | "paused";
}

interface TenantSubscriptionsRowProps {
  tenant: TenantListRow;
  onConfirmCancel: (tenantId: string) => Promise<void> | void;
}

export default function TenantSubscriptionsRow({
  tenant,
  onConfirmCancel,
}: TenantSubscriptionsRowProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSub, setEditSub] = useState<TenantSubscription | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const { data: subs = [], isLoading } = useSubscriptionsQuery(tenant.id, {
    enabled: expanded,
  });
  const { data: currentSubscription } = useAdminSubscriptionDetailQuery(
    tenant.id,
    expanded,
  );

  const subCountLabel =
    subs.length === 1
      ? t("adminSubscriptions:row.subscriptionCount", { count: 1 })
      : t("adminSubscriptions:row.subscriptionCount_other", { count: subs.length });

  return (
    <>
      <tr
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
              <div className="text-xs text-gray-500">{tenant.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {expanded ? (
            isLoading ? (
              "…"
            ) : (
              <div className="space-y-1">
                <div>{subCountLabel}</div>
                {currentSubscription && (
                  <div className="text-xs text-gray-400">
                    {t("adminSubscriptions:row.current", {
                      plan: currentSubscription.plan?.name ?? currentSubscription.planId,
                    })}
                  </div>
                )}
              </div>
            )
          ) : (
            "—"
          )}
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("adminSubscriptions:row.add")}
          </button>
        </td>
      </tr>

      {expanded &&
        !isLoading &&
        subs.map((sub) => (
          <tr key={sub.id} className="bg-gray-50 border-b border-gray-100">
            <td className="px-6 py-3 pl-16 whitespace-nowrap">
              <div className="text-sm text-gray-700">{sub.plan?.name ?? sub.planId}</div>
              {(sub.endsAt ?? sub.trialEndsAt) && (
                <div className="text-xs text-gray-400">
                  {t("adminSubscriptions:row.periodEnds", {
                    date: new Date(
                      (sub.endsAt ?? sub.trialEndsAt) as string,
                    ).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US"),
                  })}
                </div>
              )}
            </td>
            <td className="px-6 py-3 whitespace-nowrap">
              <StatusBadge status={sub.status} />
            </td>
            <td className="px-6 py-3 whitespace-nowrap text-right">
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => setEditSub(sub)}
                  className="p-1.5 text-gray-400 hover:text-teal-600 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCancelOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  disabled={sub.status === "canceled"}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}

      {expanded && isLoading && (
        <tr className="bg-gray-50">
          <td colSpan={3} className="px-6 py-3 pl-16 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
            {t("adminSubscriptions:row.loading")}
          </td>
        </tr>
      )}

      {expanded && !isLoading && subs.length === 0 && (
        <tr className="bg-gray-50">
          <td colSpan={3} className="px-6 py-3 pl-16 text-sm text-gray-400 italic">
            {t("adminSubscriptions:row.noSubscriptions")}
          </td>
        </tr>
      )}

      {createOpen && (
        <tr className="h-0 border-0">
          <td colSpan={3} className="p-0 h-0 border-0">
            <CreateSubscriptionModal
              tenantId={tenant.id}
              tenantName={tenant.name}
              onClose={() => setCreateOpen(false)}
            />
          </td>
        </tr>
      )}
      {editSub && (
        <tr className="h-0 border-0">
          <td colSpan={3} className="p-0 h-0 border-0">
            <EditSubscriptionModal
              sub={editSub}
              tenantId={tenant.id}
              onClose={() => setEditSub(null)}
            />
          </td>
        </tr>
      )}
      {cancelOpen && (
        <tr className="h-0 border-0">
          <td colSpan={3} className="p-0 h-0 border-0">
            <CancelSubscriptionModal
              tenantName={tenant.name}
              isPending={isCanceling}
              onClose={() => setCancelOpen(false)}
              onConfirm={async () => {
                setIsCanceling(true);
                try {
                  await onConfirmCancel(tenant.id);
                  setCancelOpen(false);
                } finally {
                  setIsCanceling(false);
                }
              }}
            />
          </td>
        </tr>
      )}
    </>
  );
}
