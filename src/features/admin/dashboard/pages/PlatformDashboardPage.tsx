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
  Loader2,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePlatformDashboardQuery } from '@/features/admin/api';

export function PlatformDashboardPage() {
  const { data: dashboard, isLoading } = usePlatformDashboardQuery();

  const kpis = dashboard?.kpis;
  const health = dashboard?.subscriptionHealth;
  const revenueTrend = dashboard?.revenueTrend ?? [];
  const tenantGrowth = dashboard?.tenantGrowthTrend ?? [];
  const recentActivity = dashboard?.recentActivity ?? [];

  const statusData = [
    { name: 'Active',   value: health?.active ?? 0,    color: '#10B981' },
    { name: 'Trialing', value: health?.trialing ?? 0,  color: '#3B82F6' },
    { name: 'Past Due', value: health?.pastDue ?? 0,   color: '#F59E0B' },
    { name: 'Suspended',value: health?.suspended ?? 0, color: '#EF4444' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading dashboard…
      </div>
    );
  }

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
          value={String(kpis?.totalTenants ?? '—')}
          change={kpis?.churnRate != null ? `${kpis.churnRate.toFixed(1)}% churn` : '—'}
          trend="up"
          icon={Users}
          color="teal"
        />
        <KPICard
          title="Active Tenants"
          value={String(kpis?.activeTenants ?? '—')}
          change="—"
          trend="up"
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="MRR"
          value={kpis?.mrr != null ? `$${kpis.mrr.toLocaleString()}` : '—'}
          change="—"
          trend="up"
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title="Past Due"
          value={String(kpis?.pastDueInvoices ?? '—')}
          change="—"
          trend="down"
          icon={AlertCircle}
          color="orange"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Trialing Tenants" value={String(kpis?.trialingTenants ?? '—')} subtitle="" />
        <StatCard title="Suspended" value={String(health?.suspended ?? '—')} subtitle="" />
        <StatCard title="ARR" value={kpis?.arr != null ? `$${kpis.arr.toLocaleString()}` : '—'} subtitle="" />
        <StatCard title="Overdue Invoices" value={String(kpis?.pastDueInvoices ?? '—')} subtitle="" />
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
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="period" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line type="monotone" dataKey="mrr" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488' }} />
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
            <BarChart data={tenantGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="period" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="newTenants" fill="#0D9488" radius={[6, 6, 0, 0]} />
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

        {/* Subscription Health */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Health</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-gray-700">{s.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400">No recent activity</p>
            ) : (
              recentActivity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.description}</p>
                    {a.tenantName && (
                      <p className="text-xs text-gray-500">{a.tenantName}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                    {new Date(a.occurredAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickActionButton icon={Plus} label="Create Tenant" />
          <QuickActionButton icon={Clock} label="Start Trial" />
          <QuickActionButton icon={DollarSign} label="Create Invoice" />
          <QuickActionButton icon={CheckCircle} label="Assign Plan" />
          <QuickActionButton icon={XCircle} label="Suspend Tenant" />
          <QuickActionButton icon={TrendingUp} label="View Reports" />
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
