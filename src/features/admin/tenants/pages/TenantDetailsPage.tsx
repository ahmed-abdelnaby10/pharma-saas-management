import React, { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  Activity,
  Settings,
  Shield,
  TrendingUp,
  Loader2,
  Plus,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useTenantQuery,
  useTenantUsageQuery,
  useFeatureOverridesQuery,
  useUpdateFeatureOverrideMutation,
  useSuspendTenantMutation,
  useActivateTenantMutation,
  useSubscriptionsQuery,
  useInvoicesQuery,
  useAuditLogQuery,
} from "@/features/admin/api";

const tabs = [
  { id: "overview", labelKey: "adminTenants:tabs.overview", icon: Activity },
  { id: "subscription", labelKey: "adminTenants:tabs.subscription", icon: DollarSign },
  { id: "invoices", labelKey: "adminTenants:tabs.invoices", icon: FileText },
  { id: "features", labelKey: "adminTenants:tabs.features", icon: Shield },
  { id: "usage", labelKey: "adminTenants:tabs.usage", icon: TrendingUp },
  { id: "audit", labelKey: "adminTenants:tabs.audit", icon: Settings },
];

export function TenantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";
  const [activeTab, setActiveTab] = useState("overview");

  const { data: tenant, isLoading } = useTenantQuery(id ?? "");
  const suspend = useSuspendTenantMutation();
  const activate = useActivateTenantMutation();

  async function handleToggleStatus() {
    if (!tenant) return;
    try {
      if (tenant.status === "suspended") {
        await activate.mutateAsync(tenant.id);
        toast.success(t("adminTenants:actions.activated"));
      } else {
        await suspend.mutateAsync(tenant.id);
        toast.success(t("adminTenants:actions.suspended"));
      }
    } catch {
      toast.error(t("adminTenants:actions.failed"));
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      </div>
    );
  }

  if (!tenant) {
    return <p className="text-sm text-gray-500 p-6">{t("adminTenants:table.empty")}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/tenants")}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("adminTenants:header.title")}
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{tenant.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                  {t(`adminTenants:status.${tenant.status}`)}
                </span>
                {tenant.plan && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {tenant.plan.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleStatus}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
          >
            {tenant.status === "suspended"
              ? t("adminTenants:actions.activate")
              : t("adminTenants:actions.suspend")}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {t("adminTenants:detail.accountInfo")}
            </h3>
            <div className="space-y-4">
              <InfoItem icon={Mail} label={t("adminTenants:detail.email")} value={tenant.email} />
              {tenant.phone && (
                <InfoItem icon={Phone} label={t("adminTenants:detail.phone")} value={tenant.phone} />
              )}
              {tenant.address && (
                <InfoItem icon={MapPin} label={t("adminTenants:detail.address")} value={tenant.address} />
              )}
              <InfoItem
                icon={Calendar}
                label={t("adminTenants:table.created")}
                value={new Date(tenant.createdAt).toLocaleDateString(dateLocale)}
              />
              {tenant.branchCount != null && (
                <InfoItem
                  icon={Users}
                  label={t("adminTenants:table.branches")}
                  value={String(tenant.branchCount)}
                />
              )}
              {tenant.userCount != null && (
                <InfoItem
                  icon={Users}
                  label={t("adminTenants:table.users")}
                  value={String(tenant.userCount)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-teal-600 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {t(tab.labelKey)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "overview" && <OverviewTab tenant={tenant} dateLocale={dateLocale} />}
              {activeTab === "subscription" && <SubscriptionTab tenantId={id ?? ""} dateLocale={dateLocale} />}
              {activeTab === "invoices" && <InvoicesTab tenantId={id ?? ""} dateLocale={dateLocale} />}
              {activeTab === "features" && <FeaturesTab tenantId={id ?? ""} />}
              {activeTab === "usage" && <UsageTab tenantId={id ?? ""} />}
              {activeTab === "audit" && <AuditTab tenantId={id ?? ""} dateLocale={dateLocale} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

function OverviewTab({ tenant, dateLocale }: { tenant: any; dateLocale: string }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={CheckCircle}
          label={t("adminTenants:detail.accountStatus")}
          value={t(`adminTenants:status.${tenant.status}`)}
          color="blue"
        />
        <SummaryCard
          icon={DollarSign}
          label={t("adminTenants:table.plan")}
          value={tenant.plan?.name ?? t("adminTenants:table.emptyValue")}
          color="green"
        />
        <SummaryCard
          icon={Calendar}
          label={t("adminTenants:table.created")}
          value={new Date(tenant.createdAt).toLocaleDateString(dateLocale)}
          color="gray"
        />
      </div>
    </div>
  );
}

function SubscriptionTab({ tenantId, dateLocale }: { tenantId: string; dateLocale: string }) {
  const { t } = useLanguage();
  const { data: subs = [], isLoading } = useSubscriptionsQuery(tenantId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      </div>
    );
  }

  if (subs.length === 0) {
    return (
      <p className="text-sm text-gray-400">{t("adminSubscriptions:row.noSubscriptions")}</p>
    );
  }

  const active = subs[0];

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">
        {t("adminTenants:tabs.subscription")}
      </h3>
      <div className="space-y-3">
        <DetailRow label={t("adminTenants:table.plan")} value={active.plan?.name ?? active.planId} />
        <DetailRow
          label={t("adminTenants:detail.status")}
          value={t(`adminSubscriptions:status.${active.status}`)}
          badge={active.status === "active" ? "green" : active.status === "trialing" ? "blue" : "orange"}
        />
        {active.trialEndsAt && (
          <DetailRow
            label={t("adminTenants:detail.trialEnds")}
            value={new Date(active.trialEndsAt).toLocaleDateString(dateLocale)}
            badge="orange"
          />
        )}
        {active.currentPeriodEnd && (
          <DetailRow
            label={t("adminTenants:detail.periodEnd")}
            value={new Date(active.currentPeriodEnd).toLocaleDateString(dateLocale)}
          />
        )}
        <DetailRow
          label={t("adminTenants:table.created")}
          value={new Date(active.createdAt).toLocaleDateString(dateLocale)}
        />
      </div>

      {subs.length > 1 && (
        <div className="mt-6">
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
            {t("adminTenants:detail.allSubscriptions")}
          </h4>
          <div className="space-y-2">
            {subs.slice(1).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-700">{sub.plan?.name ?? sub.planId}</span>
                <span className="text-xs text-gray-500">
                  {t(`adminSubscriptions:status.${sub.status}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InvoicesTab({ tenantId, dateLocale }: { tenantId: string; dateLocale: string }) {
  const { t } = useLanguage();
  const { data: invoices = [], isLoading } = useInvoicesQuery({ tenantId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {t("adminTenants:tabs.invoices")}
        </h3>
        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
          <Plus className="w-3.5 h-3.5" />
          {t("adminInvoices:header.createInvoice")}
        </button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">{t("adminInvoices:table.empty")}</p>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("adminInvoices:table.invoiceId")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("adminInvoices:table.date")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("adminInvoices:table.amount")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("adminInvoices:table.status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{invoice.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(invoice.createdAt).toLocaleDateString(dateLocale)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      invoice.status === "paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : invoice.status === "open"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}>
                      {t(`adminInvoices:status.${invoice.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FeaturesTab({ tenantId }: { tenantId: string }) {
  const { t } = useLanguage();
  const { data: overrides = [], isLoading } = useFeatureOverridesQuery(tenantId);
  const updateOverride = useUpdateFeatureOverrideMutation();

  async function toggle(key: string, currentEnabled: boolean) {
    try {
      await updateOverride.mutateAsync({
        tenantId,
        key,
        payload: { enabled: !currentEnabled },
      });
      toast.success(!currentEnabled
        ? t("adminFeatureOverrides:toast.enabled")
        : t("adminFeatureOverrides:toast.disabled"));
    } catch {
      toast.error(t("adminFeatureOverrides:toast.failed"));
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        {t("adminFeatureOverrides:header.title")}
      </h3>

      {overrides.length === 0 ? (
        <p className="text-sm text-gray-400">
          {t("adminFeatureOverrides:emptyState.description")}
        </p>
      ) : (
        <div className="space-y-2">
          {overrides.map((f) => (
            <div key={f.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {f.key.replace(/_/g, " ")}
                  </p>
                  {f.enabled ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                {f.description && (
                  <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                )}
              </div>
              <button
                onClick={() => toggle(f.key, f.enabled)}
                disabled={updateOverride.isPending}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium disabled:opacity-50"
              >
                {f.enabled
                  ? t("adminFeatureOverrides:action.disable")
                  : t("adminFeatureOverrides:action.enable")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsageTab({ tenantId }: { tenantId: string }) {
  const { t } = useLanguage();
  const { data: usage, isLoading } = useTenantUsageQuery(tenantId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      </div>
    );
  }

  if (!usage) return <p className="text-sm text-gray-400">{t("adminSystem:usage.chart.title")}</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">
        {t("adminTenants:tabs.usage")}
      </h3>

      <UsageBar label={t("adminTenants:table.branches")} used={usage.branchCount} max={99} />
      <UsageBar label={t("adminTenants:table.users")} used={usage.userCount} max={99} />
      <UsageBar label={t("adminTenants:detail.inventoryItems")} used={usage.inventoryItemCount} max={9999} />
      <UsageBar label={t("adminTenants:detail.salesThisMonth")} used={usage.salesThisMonth} max={9999} />
      <UsageBar
        label={t("adminTenants:detail.storage")}
        used={parseFloat((usage.storageUsedMb / 1024).toFixed(2))}
        max={10}
        unit="GB"
      />
    </div>
  );
}

function AuditTab({ tenantId, dateLocale }: { tenantId: string; dateLocale: string }) {
  const { t } = useLanguage();
  const { data: logs = [], isLoading } = useAuditLogQuery({ tenantId, limit: 20 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        {t("adminTenants:tabs.audit")}
      </h3>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-400">—</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4 pb-3 border-b border-gray-200 last:border-0">
              <div className="flex-shrink-0 w-36 text-xs text-gray-500">
                {new Date(log.createdAt).toLocaleString(dateLocale)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {log.entity} {log.entityId ? `(${log.entityId})` : ""}
                </p>
                {log.userId && (
                  <p className="text-xs text-gray-500 mt-1">
                    by {log.userId}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color] ?? colorStyles.gray}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-gray-600 mt-3">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, badge }: {
  label: string;
  value: string;
  badge?: string;
}) {
  const badgeColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      {badge ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColors[badge] ?? badgeColors.blue}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
}

function UsageBar({ label, used, max, unit = "" }: {
  label: string;
  used: number;
  max: number;
  unit?: string;
}) {
  const percentage = Math.min((used / max) * 100, 100);
  const color = percentage >= 90 ? "bg-red-500" : percentage >= 70 ? "bg-orange-500" : "bg-teal-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <span className="text-sm text-gray-600">
          {used} / {max} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</p>
    </div>
  );
}
