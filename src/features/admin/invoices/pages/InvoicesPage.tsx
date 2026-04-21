import React, { useState } from 'react';
import { Search, Filter, Download, Plus, MoreVertical, FileText } from 'lucide-react';

interface Invoice {
  id: string;
  tenant: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Draft' | 'Open' | 'Paid' | 'Overdue' | 'Void';
  items: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-2026-0048',
    tenant: 'Green Valley Pharmacy',
    date: '2026-03-18',
    dueDate: '2026-04-01',
    amount: 2499,
    status: 'Open',
    items: 'Growth Plan - Monthly',
  },
  {
    id: 'INV-2026-0047',
    tenant: 'MediCare Plus',
    date: '2026-03-15',
    dueDate: '2026-03-29',
    amount: 4999,
    status: 'Paid',
    items: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2026-0046',
    tenant: 'HealthHub Pharmacy',
    date: '2026-03-15',
    dueDate: '2026-03-29',
    amount: 9999,
    status: 'Paid',
    items: 'Enterprise Plan - Monthly',
  },
  {
    id: 'INV-2026-0045',
    tenant: 'Sunrise Pharmacy',
    date: '2026-03-01',
    dueDate: '2026-03-15',
    amount: 2499,
    status: 'Overdue',
    items: 'Growth Plan - Monthly',
  },
  {
    id: 'INV-2026-0044',
    tenant: 'Central Meds',
    date: '2026-03-01',
    dueDate: '2026-03-15',
    amount: 4999,
    status: 'Overdue',
    items: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2026-0043',
    tenant: 'QuickMeds Rx',
    date: '2026-03-10',
    dueDate: '2026-03-24',
    amount: 999,
    status: 'Paid',
    items: 'Starter Plan - Monthly',
  },
  {
    id: 'INV-2026-0042',
    tenant: 'Wellness Rx',
    date: '2026-03-05',
    dueDate: '2026-03-19',
    amount: 2499,
    status: 'Paid',
    items: 'Growth Plan - Monthly',
  },
  {
    id: 'INV-2026-0041',
    tenant: 'Metro Health Pharmacy',
    date: '2026-03-02',
    dueDate: '2026-03-16',
    amount: 2499,
    status: 'Paid',
    items: 'Growth Plan - Monthly',
  },
];

export function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: mockInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0),
    overdue: mockInvoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0),
    open: mockInvoices.filter(inv => inv.status === 'Open').reduce((sum, inv) => sum + inv.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Invoices & Billing</h1>
          <p className="mt-1 text-sm text-gray-500">Manage invoicing and payment operations</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Billed"
          value={`$${(stats.total / 100).toLocaleString()}`}
          color="gray"
          icon={FileText}
        />
        <SummaryCard
          label="Total Paid"
          value={`$${(stats.paid / 100).toLocaleString()}`}
          color="green"
          icon={FileText}
        />
        <SummaryCard
          label="Overdue Amount"
          value={`$${(stats.overdue / 100).toLocaleString()}`}
          color="red"
          icon={FileText}
        />
        <SummaryCard
          label="Open Invoices"
          value={`$${(stats.open / 100).toLocaleString()}`}
          color="blue"
          icon={FileText}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
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
              <option value="all">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Open">Open</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Void">Void</option>
            </select>

            <select className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.tenant}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{invoice.items}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(invoice.amount / 100).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
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
            Showing <span className="font-medium">{filteredInvoices.length}</span> of <span className="font-medium">{mockInvoices.length}</span> invoices
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
    Draft: 'bg-gray-50 text-gray-700 border-gray-200',
    Open: 'bg-blue-50 text-blue-700 border-blue-200',
    Paid: 'bg-green-50 text-green-700 border-green-200',
    Overdue: 'bg-red-50 text-red-700 border-red-200',
    Void: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

function SummaryCard({ label, value, color, icon: Icon }: any) {
  const colorStyles = {
    gray: 'bg-gray-50 text-gray-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color as keyof typeof colorStyles]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm text-gray-600 mt-4">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
