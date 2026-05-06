import { useState, useRef, useEffect, type ElementType, type FormEvent } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useInvoicesQuery,
  useTenantsQuery,
  useSubscriptionsQuery,
  useCreateInvoiceMutation,
  useIssueInvoiceMutation,
  useMarkInvoicePaidMutation,
  useVoidInvoiceMutation,
  type Invoice,
} from "@/features/admin/api";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-50 text-gray-700 border-gray-200",
  open: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  uncollectible: "bg-red-50 text-red-700 border-red-200",
  void: "bg-gray-50 text-gray-500 border-gray-200",
};

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}
    >
      {t(`adminInvoices:status.${status}`)}
    </span>
  );
}

function SummaryCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: ElementType;
}) {
  const colorStyles: Record<string, string> = {
    gray: "bg-gray-50 text-gray-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color] ?? colorStyles.gray}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-gray-600 mt-4">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function ActionMenu({ invoice }: { invoice: Invoice }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const issueMutation = useIssueInvoiceMutation();
  const markPaidMutation = useMarkInvoicePaidMutation();
  const voidMutation = useVoidInvoiceMutation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleIssue = () => {
    setOpen(false);
    issueMutation.mutate(invoice.id, {
      onSuccess: () => toast.success(t("adminInvoices:actions.issued")),
      onError: () => toast.error(t("adminInvoices:actions.failed")),
    });
  };

  const handleMarkPaid = () => {
    setOpen(false);
    markPaidMutation.mutate(invoice.id, {
      onSuccess: () => toast.success(t("adminInvoices:actions.markedPaid")),
      onError: () => toast.error(t("adminInvoices:actions.failed")),
    });
  };

  const handleVoid = () => {
    setOpen(false);
    voidMutation.mutate(invoice.id, {
      onSuccess: () => toast.success(t("adminInvoices:actions.voided")),
      onError: () => toast.error(t("adminInvoices:actions.failed")),
    });
  };

  const isDraft = invoice.status === "draft";
  const isOpen = invoice.status === "open";
  const canVoid = isDraft || isOpen;

  if (!isDraft && !isOpen && !canVoid) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
          {isDraft && (
            <button
              onClick={handleIssue}
              disabled={issueMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {t("adminInvoices:actions.issue")}
            </button>
          )}
          {isOpen && (
            <button
              onClick={handleMarkPaid}
              disabled={markPaidMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {t("adminInvoices:actions.markPaid")}
            </button>
          )}
          {canVoid && (
            <button
              onClick={handleVoid}
              disabled={voidMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {t("adminInvoices:actions.void")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CreateInvoiceModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const createMutation = useCreateInvoiceMutation();
  const { data: tenants = [] } = useTenantsQuery();

  const [tenantId, setTenantId] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [dueDate, setDueDate] = useState("");

  const { data: subscriptions = [] } = useSubscriptionsQuery(tenantId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!tenantId || !subscriptionId || !amount) return;
    createMutation.mutate(
      {
        tenantId,
        subscriptionId,
        amount: parseFloat(amount),
        currency: currency || "USD",
        dueDate: dueDate || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("adminInvoices:actions.issued"));
          onClose();
        },
        onError: () => toast.error(t("adminInvoices:actions.failed")),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t("adminInvoices:modal.createTitle")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminInvoices:modal.fields.tenant.label")}
            </label>
            <select
              value={tenantId}
              onChange={(e) => { setTenantId(e.target.value); setSubscriptionId(""); }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t("adminInvoices:modal.fields.tenant.placeholder")}</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminInvoices:modal.fields.subscription.label")}
            </label>
            <select
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
              required
              disabled={!tenantId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            >
              <option value="">{t("adminInvoices:modal.fields.subscription.placeholder")}</option>
              {subscriptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.plan?.name ?? s.id}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("adminInvoices:modal.fields.amount.label")}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("adminInvoices:modal.fields.amount.placeholder")}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("adminInvoices:modal.fields.currency.label")}
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder={t("adminInvoices:modal.fields.currency.placeholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminInvoices:modal.fields.dueDate.label")}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminInvoices:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending
                ? t("adminInvoices:modal.actions.creating")
                : t("adminInvoices:modal.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function InvoicesPage() {
  const { t, language, direction } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isRtl = direction === "rtl";
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";

  const { data: invoices = [], isLoading } = useInvoicesQuery();

  const filtered = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.tenant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === "open" && inv.dueDate && new Date(inv.dueDate) < new Date())
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOpen = invoices
    .filter((inv) => inv.status === "open")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      {showCreateModal && (
        <CreateInvoiceModal onClose={() => setShowCreateModal(false)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminInvoices:header.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminInvoices:header.subtitle")}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t("adminInvoices:header.export")}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t("adminInvoices:header.createInvoice")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={t("adminInvoices:summary.totalBilled")}
          value={`$${totalBilled.toLocaleString()}`}
          color="gray"
          icon={FileText}
        />
        <SummaryCard
          label={t("adminInvoices:summary.totalPaid")}
          value={`$${totalPaid.toLocaleString()}`}
          color="green"
          icon={FileText}
        />
        <SummaryCard
          label={t("adminInvoices:summary.overdue")}
          value={`$${totalOverdue.toLocaleString()}`}
          color="red"
          icon={FileText}
        />
        <SummaryCard
          label={t("adminInvoices:summary.openInvoices")}
          value={`$${totalOpen.toLocaleString()}`}
          color="blue"
          icon={FileText}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("adminInvoices:filters.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {t("adminInvoices:filters.status")}
              </span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{t("adminInvoices:status.all")}</option>
              <option value="draft">{t("adminInvoices:status.draft")}</option>
              <option value="open">{t("adminInvoices:status.open")}</option>
              <option value="paid">{t("adminInvoices:status.paid")}</option>
              <option value="uncollectible">{t("adminInvoices:status.uncollectible")}</option>
              <option value="void">{t("adminInvoices:status.void")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t("adminInvoices:table.loading")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.invoiceId")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.tenant")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.dueDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.amount")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.status")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminInvoices:table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                      {t("adminInvoices:table.empty")}
                    </td>
                  </tr>
                )}
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {invoice.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.tenant?.name ?? t("adminInvoices:table.emptyValue")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString(dateLocale)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString(dateLocale)
                        : t("adminInvoices:table.emptyValue")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ActionMenu invoice={invoice} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t("adminInvoices:table.showing", {
              filtered: filtered.length,
              total: invoices.length,
            })}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              {t("adminInvoices:table.previous")}
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              {t("adminInvoices:table.next")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
