import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useCancelSubscriptionMutation,
  useTenantsQuery,
} from "@/features/admin/api";
import type { Tenant } from "@/features/admin/api";
import { toast } from "sonner";
import SubscriptionsFilters from "../components/SubscriptionsFilters";
import SubscriptionsSummaryCards from "../components/SubscriptionsSummaryCards";
import SubscriptionsTable from "../components/SubscriptionsTable";
import type { TenantListRow } from "../components/TenantSubscriptionsRow";

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SubscriptionsPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const cancelSubscription = useCancelSubscriptionMutation();

  const {
    data: tenants = [],
    isLoading,
    refetch,
    isFetching,
  } = useTenantsQuery();

  const tenantRows = useMemo<TenantListRow[]>(() => {
    const isArabic = language === "ar";
    return (tenants as Tenant[]).map((tenant) => {
      const localizedName =
        (isArabic ? tenant.nameAr : tenant.nameEn) ??
        tenant.name ??
        tenant.slug ??
        tenant.id;
      return {
        id: tenant.id,
        name: localizedName,
        email: tenant.email ?? tenant.settings?.email ?? "-",
        currentPlanName: tenant.subscription?.plan?.name,
        currentStatus: tenant.subscription?.status,
      };
    });
  }, [language, tenants]);

  const planOptions = useMemo(() => {
    const map = new Map<string, string>();
    (tenants as Tenant[]).forEach((tenant) => {
      const plan = tenant.subscription?.plan;
      if (plan?.id && plan?.name && !map.has(plan.id)) {
        map.set(plan.id, plan.name);
      }
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [tenants]);

  const filteredTenants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return tenantRows.filter((tenant) => {
      const matchesSearch =
        !normalizedQuery ||
        tenant.name.toLowerCase().includes(normalizedQuery) ||
        tenant.email.toLowerCase().includes(normalizedQuery) ||
        (tenant.currentPlanName ?? "").toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" || tenant.currentStatus === statusFilter;
      const tenantPlanId =
        (tenants as Tenant[]).find((t) => t.id === tenant.id)?.subscription?.plan
          ?.id ?? "none";
      const matchesPlan = planFilter === "all" || tenantPlanId === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [planFilter, searchQuery, statusFilter, tenantRows, tenants]);

  const summary = useMemo(() => {
    const base = {
      total: tenantRows.length,
      active: 0,
      trialing: 0,
      pastDue: 0,
      canceled: 0,
    };
    tenantRows.forEach((tenant) => {
      if (tenant.currentStatus === "active") base.active += 1;
      if (tenant.currentStatus === "trialing") base.trialing += 1;
      if (tenant.currentStatus === "past_due") base.pastDue += 1;
      if (tenant.currentStatus === "canceled") base.canceled += 1;
    });
    return base;
  }, [tenantRows]);

  return (
    <div className="space-y-6">
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
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          {t("adminSubscriptions:header.refresh")}
        </button>
      </div>
      <SubscriptionsSummaryCards
        isLoading={isLoading || isFetching}
        total={summary.total}
        active={summary.active}
        trialing={summary.trialing}
        pastDue={summary.pastDue}
        canceled={summary.canceled}
      />

      <SubscriptionsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        plans={planOptions}
      />
      <SubscriptionsTable
        tenants={filteredTenants}
        totalTenants={tenantRows.length}
        isLoading={isLoading}
        onConfirmCancel={async (tenantId) =>
          new Promise<void>((resolve, reject) => {
            cancelSubscription.mutate(
              { tenantId },
              {
                onSuccess: () => {
                  toast.success(t("adminSubscriptions:cancelModal.success"));
                  resolve();
                },
                onError: () => reject(),
              },
            );
          })
        }
      />
    </div>
  );
}
