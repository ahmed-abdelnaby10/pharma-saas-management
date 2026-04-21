import React from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 45000, subscriptions: 28 },
  { month: 'Feb', revenue: 52000, subscriptions: 32 },
  { month: 'Mar', revenue: 58000, subscriptions: 38 },
  { month: 'Apr', revenue: 65000, subscriptions: 42 },
  { month: 'May', revenue: 73000, subscriptions: 48 },
  { month: 'Jun', revenue: 82000, subscriptions: 54 },
];

const statusData = [
  { name: 'Active', value: 42, color: '#10B981' },
  { name: 'Trialing', value: 12, color: '#3B82F6' },
  { name: 'Past Due', value: 5, color: '#F59E0B' },
  { name: 'Suspended', value: 3, color: '#EF4444' },
];

const recentTrials = [
  { name: 'Green Valley Pharmacy', daysLeft: 2, plan: 'Growth' },
  { name: 'MediCare Plus', daysLeft: 3, plan: 'Pro' },
  { name: 'HealthHub Pharmacy', daysLeft: 5, plan: 'Growth' },
  { name: 'QuickMeds Rx', daysLeft: 7, plan: 'Starter' },
];

const overdueInvoices = [
  { tenant: 'Sunrise Pharmacy', amount: 2499, daysOverdue: 15 },
  { tenant: 'Central Meds', amount: 4999, daysOverdue: 8 },
  { tenant: 'Valley Drug Store', amount: 999, daysOverdue: 3 },
];

const recentSignups = [
  { name: 'Metro Health Pharmacy', date: '2 hours ago', plan: 'Growth' },
  { name: 'Wellness Rx', date: '5 hours ago', plan: 'Pro' },
  { name: 'Community Care Pharmacy', date: '1 day ago', plan: 'Starter' },
];

export function PlatformDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Platform Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Monitor your SaaS platform performance and health</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Tenant
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Tenants"
          value="62"
          change="+8.2%"
          trend="up"
          icon={Users}
          color="teal"
        />
        <KPICard
          title="Active Tenants"
          value="42"
          change="+12.5%"
          trend="up"
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="MRR"
          value="$82,450"
          change="+15.3%"
          trend="up"
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title="Past Due"
          value="5"
          change="-2"
          trend="down"
          icon={AlertCircle}
          color="orange"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Trialing Tenants" value="12" subtitle="3 ending soon" />
        <StatCard title="Suspended" value="3" subtitle="Non-payment" />
        <StatCard title="ARR" value="$989,400" subtitle="+18% YoY" />
        <StatCard title="Overdue Invoices" value="$8,497" subtitle="3 invoices" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Growth */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Subscription Growth</h3>
              <p className="text-sm text-gray-500">New subscriptions per month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="subscriptions" fill="#0D9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tenant Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trials Ending Soon */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trials Ending Soon</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {recentTrials.map((trial) => (
              <div key={trial.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{trial.name}</p>
                  <p className="text-xs text-gray-500">{trial.plan} Plan</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-full">
                  {trial.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100">
            View All Trials
          </button>
        </div>

        {/* Overdue Invoices */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Overdue Invoices</h3>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {overdueInvoices.map((invoice) => (
              <div key={invoice.tenant} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invoice.tenant}</p>
                  <p className="text-xs text-gray-500">{invoice.daysOverdue} days overdue</p>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  ${invoice.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100">
            Manage Invoices
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Signups */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Signups</h3>
          <div className="space-y-4">
            {recentSignups.map((signup) => (
              <div key={signup.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{signup.name}</p>
                    <p className="text-xs text-gray-500">{signup.date}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                  {signup.plan}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton icon={Plus} label="Create Tenant" />
            <QuickActionButton icon={Clock} label="Start Trial" />
            <QuickActionButton icon={DollarSign} label="Create Invoice" />
            <QuickActionButton icon={CheckCircle} label="Assign Plan" />
            <QuickActionButton icon={XCircle} label="Suspend Tenant" />
            <QuickActionButton icon={TrendingUp} label="View Reports" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: 'teal' | 'green' | 'blue' | 'orange';
}

function KPICard({ title, value, change, trend, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors group">
      <Icon className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
      <span className="text-xs font-medium text-gray-700 group-hover:text-teal-700">{label}</span>
    </button>
  );
}
