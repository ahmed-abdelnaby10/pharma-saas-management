import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';

interface Subscription {
  id: string;
  tenant: string;
  plan: string;
  cycle: 'Monthly' | 'Yearly';
  status: 'Trialing' | 'Active' | 'Past Due' | 'Canceled' | 'Expired';
  trialEnd: string | null;
  renewal: string;
  amount: number;
  cancelAtPeriodEnd: boolean;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_001',
    tenant: 'Green Valley Pharmacy',
    plan: 'Growth',
    cycle: 'Monthly',
    status: 'Trialing',
    trialEnd: '2026-03-21',
    renewal: '2026-04-21',
    amount: 2499,
    cancelAtPeriodEnd: false,
  },
  {
    id: 'sub_002',
    tenant: 'MediCare Plus',
    plan: 'Pro',
    cycle: 'Monthly',
    status: 'Active',
    trialEnd: null,
    renewal: '2026-04-15',
    amount: 4999,
    cancelAtPeriodEnd: false,
  },
  {
    id: 'sub_003',
    tenant: 'Sunrise Pharmacy',
    plan: 'Growth',
    cycle: 'Monthly',
    status: 'Past Due',
    trialEnd: null,
    renewal: '2026-03-03',
    amount: 2499,
    cancelAtPeriodEnd: false,
  },
  {
    id: 'sub_004',
    tenant: 'HealthHub Pharmacy',
    plan: 'Enterprise',
    cycle: 'Yearly',
    status: 'Active',
    trialEnd: null,
    renewal: '2027-01-15',
    amount: 99999,
    cancelAtPeriodEnd: false,
  },
  {
    id: 'sub_005',
    tenant: 'QuickMeds Rx',
    plan: 'Starter',
    cycle: 'Monthly',
    status: 'Active',
    trialEnd: null,
    renewal: '2026-04-10',
    amount: 999,
    cancelAtPeriodEnd: false,
  },
  {
    id: 'sub_006',
    tenant: 'Central Meds',
    plan: 'Pro',
    cycle: 'Monthly',
    status: 'Canceled',
    trialEnd: null,
    renewal: '2026-03-10',
    amount: 4999,
    cancelAtPeriodEnd: true,
  },
];

export function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesSearch = sub.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || sub.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all customer subscriptions and billing cycles</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Subscription
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={mockSubscriptions.length} color="gray" />
        <StatCard label="Active" value={mockSubscriptions.filter(s => s.status === 'Active').length} color="green" />
        <StatCard label="Trialing" value={mockSubscriptions.filter(s => s.status === 'Trialing').length} color="blue" />
        <StatCard label="Past Due" value={mockSubscriptions.filter(s => s.status === 'Past Due').length} color="orange" />
        <StatCard label="Canceled" value={mockSubscriptions.filter(s => s.status === 'Canceled').length} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

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
              <option value="all">All</option>
              <option value="Active">Active</option>
              <option value="Trialing">Trialing</option>
              <option value="Past Due">Past Due</option>
              <option value="Canceled">Canceled</option>
              <option value="Expired">Expired</option>
            </select>

            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>All Plans</option>
              <option>Starter</option>
              <option>Growth</option>
              <option>Pro</option>
              <option>Enterprise</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renewal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {sub.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sub.tenant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sub.cycle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sub.status} />
                    {sub.trialEnd && (
                      <div className="text-xs text-gray-500 mt-1">Ends {sub.trialEnd}</div>
                    )}
                    {sub.cancelAtPeriodEnd && (
                      <div className="text-xs text-orange-600 mt-1">Cancels at period end</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.renewal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${sub.amount.toLocaleString()}
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
            Showing <span className="font-medium">{filteredSubscriptions.length}</span> of <span className="font-medium">{mockSubscriptions.length}</span> subscriptions
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
    Canceled: 'bg-red-50 text-red-700 border-red-200',
    Expired: 'bg-gray-50 text-gray-700 border-gray-200',
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
