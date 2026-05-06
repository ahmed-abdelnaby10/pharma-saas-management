import React, { useState } from "react";
import {
  Search,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  XCircle,
  Edit2,
  X,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useTenantsQuery,
  usePlansQuery,
  useSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "@/features/admin/api";
import type { TenantSubscription, TenantSubscriptionStatus } from "@/features/admin/api";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-green-50 text-green-700 border-green-200",
  trialing:  "bg-blue-50 text-blue-700 border-blue-200",
  past_due:  "bg-orange-50 text-orange-700 border-orange-200",
  canceled:  "bg-red-50 text-red-700 border-red-200",
  paused:    "bg-gray-50 text-gray-600 border-gray-200",
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.canceled}`}
    >
      {t(`adminSubscriptions:status.${status}`)}
    </span>
  );
}

// ─── Create subscription modal ────────────────────────────────────────────────

interface CreateSubModalProps {
  tenantId: string;
  tenantName: string;
  onClose: () => void;
}

function CreateSubModal({ tenantId, tenantName, onClose }: CreateSubModalProps) {
  const { t } = useLanguage();
  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const createSub = useCreateSubscriptionMutation();

  const [planId, setPlanId] = useState("");
  const [status, setStatus] = useState<TenantSubscriptionStatus>("active");
  const [trialEndsAt, setTrialEndsAt] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!planId) return;
    createSub.mutate(
      { tenantId, planId, status, ...(trialEndsAt ? { trialEndsAt } : {}) },
      { onSuccess: onClose },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("adminSubscriptions:modal.createTitle", { tenantName })}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminSubscriptions:modal.fields.plan.label")}
            </label>
            {plansLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("adminSubscriptions:modal.actions.loadingPlans")}
              </div>
            ) : (
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">{t("adminSubscriptions:modal.fields.plan.placeholder")}</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.monthlyPrice}/mo
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminSubscriptions:modal.fields.status.label")}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TenantSubscriptionStatus)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">{t("adminSubscriptions:status.active")}</option>
              <option value="trialing">{t("adminSubscriptions:status.trialing")}</option>
              <option value="paused">{t("adminSubscriptions:status.paused")}</option>
            </select>
          </div>

          {status === "trialing" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("adminSubscriptions:modal.fields.trialEndsAt.label")}
              </label>
              <input
                type="date"
                value={trialEndsAt}
                onChange={(e) => setTrialEndsAt(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminSubscriptions:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={createSub.isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {createSub.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("adminSubscriptions:modal.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit subscription modal ──────────────────────────────────────────────────

interface EditSubModalProps {
  sub: TenantSubscription;
  tenantId: string;
  onClose: () => void;
}

function EditSubModal({ sub, tenantId, onClose }: EditSubModalProps) {
  const { t } = useLanguage();
  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const updateSub = useUpdateSubscriptionMutation();

  const [planId, setPlanId] = useState(sub.planId);
  const [status, setStatus] = useState<TenantSubscriptionStatus>(sub.status);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSub.mutate(
      { tenantId, subscriptionId: sub.id, planId, status },
      { onSuccess: onClose },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("adminSubscriptions:modal.editTitle")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminSubscriptions:modal.fields.plan.label")}
            </label>
            {plansLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("adminSubscriptions:modal.actions.loadingPlans")}
              </div>
            ) : (
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.monthlyPrice}/mo
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminSubscriptions:modal.fields.status.label")}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TenantSubscriptionStatus)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="active">{t("adminSubscriptions:status.active")}</option>
              <option value="trialing">{t("adminSubscriptions:status.trialing")}</option>
              <option value="past_due">{t("adminSubscriptions:status.past_due")}</option>
              <option value="paused">{t("adminSubscriptions:status.paused")}</option>
              <option value="canceled">{t("adminSubscriptions:status.canceled")}</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminSubscriptions:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={updateSub.isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {updateSub.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("adminSubscriptions:modal.actions.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Per-tenant subscription row ──────────────────────────────────────────────

interface TenantRowProps {
  tenant: { id: string; name: string; email: string };
}

function TenantRow({ tenant }: TenantRowProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";
  const [expanded, setExpanded] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSub, setEditSub] = useState<TenantSubscription | null>(null);

  const { data: subs = [], isLoading } = useSubscriptionsQuery(tenant.id, {
    enabled: expanded,
  });
  const cancel = useCancelSubscriptionMutation();

  const subCountLabel = subs.length === 1
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
          {expanded ? (isLoading ? "…" : subCountLabel) : "—"}
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

      {expanded && !isLoading && subs.map((sub) => (
        <tr key={sub.id} className="bg-gray-50 border-b border-gray-100">
          <td className="px-6 py-3 pl-16 whitespace-nowrap">
            <div className="text-sm text-gray-700">{sub.plan?.name ?? sub.planId}</div>
            {sub.currentPeriodEnd && (
              <div className="text-xs text-gray-400">
                {t("adminSubscriptions:row.periodEnds", {
                  date: new Date(sub.currentPeriodEnd).toLocaleDateString(dateLocale),
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
                onClick={() =>
                  cancel.mutate({ tenantId: tenant.id, subscriptionId: sub.id })
                }
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
        <CreateSubModal
          tenantId={tenant.id}
          tenantName={tenant.name}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editSub && (
        <EditSubModal
          sub={editSub}
          tenantId={tenant.id}
          onClose={() => setEditSub(null)}
        />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SubscriptionsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tenants = [], isLoading, refetch, isFetching } = useTenantsQuery();

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminSubscriptions:header.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminSubscriptions:header.subtitle")}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          {t("adminSubscriptions:header.refresh")}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("adminSubscriptions:filters.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t("adminSubscriptions:table.loading")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSubscriptions:table.tenant")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSubscriptions:table.subscriptions")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSubscriptions:table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-sm text-gray-500">
                      {t("adminSubscriptions:table.empty")}
                    </td>
                  </tr>
                )}
                {filtered.map((tenant) => (
                  <TenantRow key={tenant.id} tenant={tenant} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          {t("adminSubscriptions:footer.showing", {
            filtered: filtered.length,
            total: tenants.length,
          })}
        </div>
      </div>
    </div>
  );
}
