import { useState } from "react";
import { FileSearch, ShieldAlert, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useAuditLogQuery } from "@/features/admin/api";

export function AuditLogsPage() {
  const { t, language } = useLanguage();
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";
  const [page] = useState(1);

  const { data: logs = [], isLoading } = useAuditLogQuery({ page, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {t("adminLogs:header.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {t("adminLogs:header.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {t("adminLogs:stats.eventsToday")}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {isLoading ? "—" : logs.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <FileSearch className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {t("adminLogs:stats.securityAlerts")}
              </p>
              <p className="mt-1 text-2xl font-semibold text-amber-600">0</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">
            {t("adminLogs:stats.retentionWindow")}
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {t("adminLogs:stats.retentionValue")}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t("adminLogs:recentEvents.title")}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    {t("adminLogs:recentEvents.columns.actor")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    {t("adminLogs:recentEvents.columns.action")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    {t("adminLogs:recentEvents.columns.target")}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    {t("adminLogs:recentEvents.columns.timestamp")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                      —
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {log.userId ?? "system"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {log.entity}{log.entityId ? ` (${log.entityId})` : ""}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString(dateLocale)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
