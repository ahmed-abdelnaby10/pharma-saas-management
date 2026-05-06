import React, { useState } from "react";
import { Search, Filter, Loader2, LifeBuoy } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  usePlatformSupportTicketsQuery,
  useUpdateSupportTicketStatusMutation,
} from "@/features/admin/api";
import type { SupportTicketStatus, SupportTicketPriority } from "@/features/admin/api";

const STATUS_STYLES: Record<SupportTicketStatus, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-yellow-50 text-yellow-700 border-yellow-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const PRIORITY_STYLES: Record<SupportTicketPriority, string> = {
  low: "text-gray-500",
  medium: "text-blue-500",
  high: "text-orange-500",
  critical: "text-red-600 font-semibold",
};

function StatusBadge({ status }: { status: SupportTicketStatus }) {
  const { t } = useLanguage();
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}>
      {t(`adminSupport:status.${status}`)}
    </span>
  );
}

export function SupportPage() {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "all">("all");

  const { data: tickets = [], isLoading } = usePlatformSupportTicketsQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const updateStatus = useUpdateSupportTicketStatusMutation();

  const filtered = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.tenantName?.toLowerCase().includes(search.toLowerCase()) ?? false),
  );

  async function handleStatusChange(id: string, status: SupportTicketStatus) {
    try {
      await updateStatus.mutateAsync({ id, payload: { status } });
      toast.success(t("adminSupport:updated"));
    } catch {
      toast.error(t("adminSupport:updateFailed"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          {t("adminSupport:header.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("adminSupport:header.subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("adminSupport:filters.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SupportTicketStatus | "all")}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          >
            <option value="all">{t("adminSupport:filters.status.all")}</option>
            <option value="open">{t("adminSupport:filters.status.open")}</option>
            <option value="in_progress">{t("adminSupport:filters.status.in_progress")}</option>
            <option value="resolved">{t("adminSupport:filters.status.resolved")}</option>
            <option value="closed">{t("adminSupport:filters.status.closed")}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t("adminSupport:table.loading")}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={LifeBuoy}
            heading={t("adminSupport:empty.heading")}
            subline={t("adminSupport:empty.subline")}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSupport:table.subject")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSupport:table.tenant")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSupport:table.priority")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSupport:table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSupport:table.created")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminSupport:table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ticket.tenantName ?? t("adminSupport:table.emptyValue")}
                    </td>
                    <td className={`px-6 py-4 text-sm ${PRIORITY_STYLES[ticket.priority]}`}>
                      {t(`adminSupport:priority.${ticket.priority}`)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString(dateLocale)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value as SupportTicketStatus)
                        }
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="open">{t("adminSupport:status.open")}</option>
                        <option value="in_progress">{t("adminSupport:status.in_progress")}</option>
                        <option value="resolved">{t("adminSupport:status.resolved")}</option>
                        <option value="closed">{t("adminSupport:status.closed")}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500">
          {t("adminSupport:table.showing", {
            filtered: filtered.length,
            total: tickets.length,
          })}
        </div>
      </div>
    </div>
  );
}
