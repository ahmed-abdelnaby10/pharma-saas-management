import { FileSearch, ShieldAlert } from "lucide-react";

const auditEvents = [
  {
    id: "audit-1",
    actor: "System Admin",
    action: "Updated tenant plan",
    target: "Green Valley Pharmacy",
    timestamp: "2026-04-20 14:32",
  },
  {
    id: "audit-2",
    actor: "Support Agent",
    action: "Reset tenant owner password",
    target: "Al Noor Pharmacy",
    timestamp: "2026-04-20 11:08",
  },
  {
    id: "audit-3",
    actor: "System",
    action: "Applied usage-limit override",
    target: "Demo Workspace",
    timestamp: "2026-04-19 18:21",
  },
];

export function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review sensitive platform actions across tenant administration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Events Today</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">128</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <FileSearch className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Alerts</p>
              <p className="mt-1 text-2xl font-semibold text-amber-600">3</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">Retention Window</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">90 days</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Actor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {auditEvents.map((event) => (
                <tr key={event.id} className="border-t border-gray-100">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {event.actor}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {event.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {event.target}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
