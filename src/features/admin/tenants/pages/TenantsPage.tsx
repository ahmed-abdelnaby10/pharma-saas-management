import React, { useState } from "react";
import { Search, Filter, MoreVertical, Plus, Download, RefreshCw, Loader2, X } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useTenantsQuery,
  useCreateTenantMutation,
  usePlansQuery,
  useSuspendTenantMutation,
  useActivateTenantMutation,
  type TenantStatus,
  type CreateTenantPayload,
} from "@/features/admin/api";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  trial: "bg-blue-50 text-blue-700 border-blue-200",
  trialing: "bg-blue-50 text-blue-700 border-blue-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
  churned: "bg-gray-50 text-gray-700 border-gray-200",
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status] ?? STATUS_COLORS.churned}`}>
      {t(`adminTenants:status.${status}`)}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  const colorStyles: Record<string, string> = {
    gray: "bg-gray-50 border-gray-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    red: "bg-red-50 border-red-200",
  };
  return (
    <div className={`border rounded-lg p-4 ${colorStyles[color] ?? colorStyles.gray}`}>
      <p className="text-xs text-gray-600 uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// ─── Create Tenant Modal ──────────────────────────────────────────────────────

interface CreateTenantModalProps {
  onClose: () => void;
}

function CreateTenantModal({ onClose }: CreateTenantModalProps) {
  const { t } = useLanguage();
  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const createMutation = useCreateTenantMutation();

  const [form, setForm] = useState<CreateTenantPayload>({
    name: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
    planId: "",
  });

  const set = (key: keyof CreateTenantPayload) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateTenantPayload = {
      name: form.name,
      slug: form.slug,
      email: form.email,
      ...(form.phone && { phone: form.phone }),
      ...(form.address && { address: form.address }),
      ...(form.planId && { planId: form.planId }),
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t("adminTenants:actions.activated"));
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? t("adminTenants:actions.failed"));
      },
    });
  }

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("adminTenants:modal.createTitle")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminTenants:modal.fields.name.label")}
            </label>
            <input
              value={form.name}
              onChange={set("name")}
              required
              className={inputCls}
              placeholder={t("adminTenants:modal.fields.name.placeholder")}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminTenants:modal.fields.slug.label")}
            </label>
            <input
              value={form.slug}
              onChange={set("slug")}
              required
              className={inputCls}
              placeholder={t("adminTenants:modal.fields.slug.placeholder")}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminTenants:modal.fields.email.label")}
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              required
              className={inputCls}
              placeholder={t("adminTenants:modal.fields.email.placeholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminTenants:modal.fields.phone.label")}
              </label>
              <input
                value={form.phone ?? ""}
                onChange={set("phone")}
                className={inputCls}
                placeholder={t("adminTenants:modal.fields.phone.placeholder")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminTenants:modal.fields.plan.label")}
              </label>
              {plansLoading ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <select value={form.planId ?? ""} onChange={set("planId")} className={inputCls}>
                  <option value="">{t("adminTenants:modal.fields.plan.placeholder")}</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminTenants:modal.fields.address.label")}
            </label>
            <input
              value={form.address ?? ""}
              onChange={set("address")}
              className={inputCls}
              placeholder={t("adminTenants:modal.fields.address.placeholder")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminTenants:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending
                ? t("adminTenants:modal.actions.creating")
                : t("adminTenants:modal.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TenantsPage() {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const { data: tenants = [], isLoading, refetch } = useTenantsQuery();
  const suspendMutation = useSuspendTenantMutation();
  const activateMutation = useActivateTenantMutation();

  const filtered = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id: string, currentStatus: TenantStatus) => {
    try {
      if (currentStatus === "suspended") {
        await activateMutation.mutateAsync(id);
        toast.success(t("adminTenants:actions.activated"));
      } else {
        await suspendMutation.mutateAsync(id);
        toast.success(t("adminTenants:actions.suspended"));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? t("adminTenants:actions.failed"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminTenants:header.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminTenants:header.subtitle")}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t("adminTenants:header.export")}
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("adminTenants:header.createTenant")}
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("adminTenants:filters.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{t("adminTenants:filters.status")}</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{t("adminTenants:status.all")}</option>
              <option value="active">{t("adminTenants:status.active")}</option>
              <option value="trial">{t("adminTenants:status.trialing")}</option>
              <option value="suspended">{t("adminTenants:status.suspended")}</option>
              <option value="churned">{t("adminTenants:status.churned")}</option>
            </select>
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("adminTenants:stats.total")}
          value={isLoading ? "—" : tenants.length}
          color="gray"
        />
        <StatCard
          label={t("adminTenants:stats.active")}
          value={isLoading ? "—" : tenants.filter((t) => t.status === "active").length}
          color="green"
        />
        <StatCard
          label={t("adminTenants:stats.trialing")}
          value={isLoading ? "—" : tenants.filter((t) => t.status === "trial").length}
          color="blue"
        />
        <StatCard
          label={t("adminTenants:stats.suspended")}
          value={isLoading ? "—" : tenants.filter((t) => t.status === "suspended").length}
          color="red"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t("adminTenants:table.loading")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.tenant")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.plan")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.branches")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.users")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.created")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminTenants:table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                      {t("adminTenants:table.empty")}
                    </td>
                  </tr>
                )}
                {filtered.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                        <div className="text-xs text-gray-500">{tenant.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tenant.plan?.name ?? t("adminTenants:table.emptyValue")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={tenant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tenant.branchCount ?? t("adminTenants:table.emptyValue")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tenant.userCount ?? t("adminTenants:table.emptyValue")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tenant.createdAt).toLocaleDateString(dateLocale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleToggleStatus(tenant.id, tenant.status)}
                        className="text-xs text-teal-600 hover:text-teal-800 font-medium mr-3"
                      >
                        {tenant.status === "suspended"
                          ? t("adminTenants:actions.activate")
                          : t("adminTenants:actions.suspend")}
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t("adminTenants:table.showing", {
              filtered: filtered.length,
              total: tenants.length,
            })}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              {t("adminTenants:table.previous")}
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              {t("adminTenants:table.next")}
            </button>
          </div>
        </div>
      </div>

      {createOpen && <CreateTenantModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
}
