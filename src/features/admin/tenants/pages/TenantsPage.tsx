import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, Download, RefreshCw } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  owner: string;
  plan: string;
  status: 'Active' | 'Trialing' | 'Suspended' | 'Past Due' | 'Canceled';
  trialEnd: string | null;
  renewalDate: string;
  branchesUsed: string;
  usersUsed: string;
  mrr: number;
  unpaidBalance: number;
  lastActivity: string;
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Green Valley Pharmacy',
    owner: 'Sarah Johnson',
    plan: 'Growth',
    status: 'Trialing',
    trialEnd: '2026-03-21',
    renewalDate: '2026-04-21',
    branchesUsed: '2/5',
    usersUsed: '8/15',
    mrr: 2499,
    unpaidBalance: 0,
    lastActivity: '2 hours ago',
  },
  {
    id: '2',
    name: 'MediCare Plus',
    owner: 'Michael Chen',
    plan: 'Pro',
    status: 'Active',
    trialEnd: null,
    renewalDate: '2026-04-15',
    branchesUsed: '5/10',
    usersUsed: '22/30',
    mrr: 4999,
    unpaidBalance: 0,
    lastActivity: '1 day ago',
  },
  {
    id: '3',
    name: 'Sunrise Pharmacy',
    owner: 'Emily Rodriguez',
    plan: 'Growth',
    status: 'Past Due',
    trialEnd: null,
    renewalDate: '2026-03-03',
    branchesUsed: '3/5',
    usersUsed: '12/15',
    mrr: 2499,
    unpaidBalance: 2499,
    lastActivity: '5 days ago',
  },
  {
    id: '4',
    name: 'HealthHub Pharmacy',
    owner: 'David Wilson',
    plan: 'Enterprise',
    status: 'Active',
    trialEnd: null,
    renewalDate: '2026-05-01',
    branchesUsed: '15/25',
    usersUsed: '48/100',
    mrr: 9999,
    unpaidBalance: 0,
    lastActivity: '3 hours ago',
  },
  {
    id: '5',
    name: 'QuickMeds Rx',
    owner: 'Lisa Anderson',
    plan: 'Starter',
    status: 'Active',
    trialEnd: null,
    renewalDate: '2026-04-10',
    branchesUsed: '1/1',
    usersUsed: '4/5',
    mrr: 999,
    unpaidBalance: 0,
    lastActivity: '6 hours ago',
  },
  {
    id: '6',
    name: 'Central Meds',
    owner: 'Robert Taylor',
    plan: 'Pro',
    status: 'Suspended',
    trialEnd: null,
    renewalDate: '2026-03-10',
    branchesUsed: '4/10',
    usersUsed: '18/30',
    mrr: 4999,
    unpaidBalance: 4999,
    lastActivity: '12 days ago',
  },
  {
    id: '7',
    name: 'Wellness Rx',
    owner: 'Jennifer Martinez',
    plan: 'Growth',
    status: 'Trialing',
    trialEnd: '2026-03-25',
    renewalDate: '2026-04-25',
    branchesUsed: '1/5',
    usersUsed: '3/15',
    mrr: 2499,
    unpaidBalance: 0,
    lastActivity: '30 minutes ago',
  },
  {
    id: '8',
    name: 'Metro Health Pharmacy',
    owner: 'Christopher Lee',
    plan: 'Growth',
    status: 'Active',
    trialEnd: null,
    renewalDate: '2026-04-20',
    branchesUsed: '4/5',
    usersUsed: '14/15',
    mrr: 2499,
    unpaidBalance: 0,
    lastActivity: '1 hour ago',
  },
];

export function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || tenant.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Tenants</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all pharmacy clients and their subscriptions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Tenant
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trialing">Trialing</option>
              <option value="Past Due">Past Due</option>
              <option value="Suspended">Suspended</option>
              <option value="Canceled">Canceled</option>
            </select>

            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>All Plans</option>
              <option>Starter</option>
              <option>Growth</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>

            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={mockTenants.length} color="gray" />
        <StatCard label="Active" value={mockTenants.filter(t => t.status === 'Active').length} color="green" />
        <StatCard label="Trialing" value={mockTenants.filter(t => t.status === 'Trialing').length} color="blue" />
        <StatCard label="Past Due" value={mockTenants.filter(t => t.status === 'Past Due').length} color="orange" />
        <StatCard label="Suspended" value={mockTenants.filter(t => t.status === 'Suspended').length} color="red" />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                      <div className="text-xs text-gray-500">{tenant.owner}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{tenant.plan}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={tenant.status} />
                    {tenant.trialEnd && (
                      <div className="text-xs text-gray-500 mt-1">Ends {tenant.trialEnd}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tenant.renewalDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-600">
                      <div>Branches: {tenant.branchesUsed}</div>
                      <div className="mt-1">Users: {tenant.usersUsed}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${tenant.mrr.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tenant.unpaidBalance > 0 ? (
                      <span className="text-sm font-medium text-red-600">
                        ${tenant.unpaidBalance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tenant.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredTenants.length}</span> of <span className="font-medium">{mockTenants.length}</span> tenants
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

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Active: 'bg-green-50 text-green-700 border-green-200',
    Trialing: 'bg-blue-50 text-blue-700 border-blue-200',
    'Past Due': 'bg-orange-50 text-orange-700 border-orange-200',
    Suspended: 'bg-red-50 text-red-700 border-red-200',
    Canceled: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.Active}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorStyles = {
    gray: 'bg-gray-50 border-gray-200',
    green: 'bg-green-50 border-green-200',
    blue: 'bg-blue-50 border-blue-200',
    orange: 'bg-orange-50 border-orange-200',
    red: 'bg-red-50 border-red-200',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorStyles[color as keyof typeof colorStyles]}`}>
      <p className="text-xs text-gray-600 uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
