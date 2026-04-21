import React from 'react';
import { FileSearch, Search, Filter } from 'lucide-react';

const auditLogs = [
  {
    timestamp: '2026-03-18 14:32:15',
    actor: 'admin@pharmasaas.com',
    role: 'Super Admin',
    action: 'Extended Trial',
    target: 'Green Valley Pharmacy',
    module: 'Subscriptions',
    result: 'Success',
  },
  {
    timestamp: '2026-03-18 11:22:08',
    actor: 'support@pharmasaas.com',
    role: 'Support Agent',
    action: 'Added Feature Override',
    target: 'Green Valley Pharmacy',
    module: 'Features',
    result: 'Success',
  },
  {
    timestamp: '2026-03-18 09:45:33',
    actor: 'billing@pharmasaas.com',
    role: 'Billing Admin',
    action: 'Marked Invoice as Paid',
    target: 'MediCare Plus',
    module: 'Invoices',
    result: 'Success',
  },
  {
    timestamp: '2026-03-17 16:18:42',
    actor: 'admin@pharmasaas.com',
    role: 'Super Admin',
    action: 'Suspended Tenant',
    target: 'Central Meds',
    module: 'Tenants',
    result: 'Success',
  },
  {
    timestamp: '2026-03-17 14:05:19',
    actor: 'support@pharmasaas.com',
    role: 'Support Agent',
    action: 'Impersonated User',
    target: 'HealthHub Pharmacy',
    module: 'Support',
    result: 'Success',
  },
  {
    timestamp: '2026-03-17 11:33:57',
    actor: 'admin@pharmasaas.com',
    role: 'Super Admin',
    action: 'Changed Plan',
    target: 'Wellness Rx',
    module: 'Subscriptions',
    result: 'Success',
  },
  {
    timestamp: '2026-03-16 15:42:11',
    actor: 'billing@pharmasaas.com',
    role: 'Billing Admin',
    action: 'Created Invoice',
    target: 'Metro Health Pharmacy',
    module: 'Invoices',
    result: 'Success',
  },
  {
    timestamp: '2026-03-16 10:12:33',
    actor: 'admin@pharmasaas.com',
    role: 'Super Admin',
    action: 'Created Tenant',
    target: 'Community Care Pharmacy',
    module: 'Tenants',
    result: 'Success',
  },
];

export function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-gray-500">Complete internal activity log for accountability and compliance</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
            </div>
            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>All Modules</option>
              <option>Tenants</option>
              <option>Subscriptions</option>
              <option>Invoices</option>
              <option>Features</option>
              <option>Support</option>
            </select>

            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>All Actors</option>
              <option>Super Admin</option>
              <option>Billing Admin</option>
              <option>Support Agent</option>
              <option>Operations Admin</option>
            </select>

            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.actor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.module}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{auditLogs.length}</span> audit logs
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
