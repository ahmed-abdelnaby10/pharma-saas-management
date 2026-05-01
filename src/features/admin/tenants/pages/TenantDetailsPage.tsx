import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  FileText,
  Activity,
  Settings,
  Loader2,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  useTenantQuery,
  useTenantUsageQuery,
  useFeatureOverridesQuery,
  useUpdateFeatureOverrideMutation,
  useSuspendTenantMutation,
  useActivateTenantMutation,
} from '@/features/admin/api';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'subscription', label: 'Subscription', icon: DollarSign },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'features', label: 'Features', icon: Shield },
  { id: 'usage', label: 'Usage', icon: TrendingUp },
  { id: 'audit', label: 'Audit', icon: Settings },
];

const invoices = [
  { id: 'INV-2026-0045', date: '2026-03-01', amount: 2499, status: 'Paid', dueDate: '2026-03-15' },
  { id: 'INV-2026-0028', date: '2026-02-01', amount: 2499, status: 'Paid', dueDate: '2026-02-15' },
  { id: 'INV-2026-0012', date: '2026-01-01', amount: 2499, status: 'Paid', dueDate: '2026-01-15' },
  { id: 'INV-2025-0142', date: '2025-12-01', amount: 2499, status: 'Paid', dueDate: '2025-12-15' },
];

const features = [
  { name: 'Multi-branch Management', planDefault: true, override: null },
  { name: 'Advanced Reports', planDefault: true, override: null },
  { name: 'Batch Tracking', planDefault: true, override: null },
  { name: 'Expiry Management', planDefault: true, override: null },
  { name: 'OCR Import', planDefault: false, override: { enabled: true, until: '2026-06-01', reason: 'Trial extension' } },
  { name: 'Branch Transfers', planDefault: true, override: null },
  { name: 'Prescription Tracking', planDefault: true, override: null },
  { name: 'API Access', planDefault: false, override: null },
];

const auditLogs = [
  { timestamp: '2026-03-18 14:32', actor: 'admin@pharmasaas.com', action: 'Extended trial', details: 'Trial extended by 7 days' },
  { timestamp: '2026-03-15 09:18', actor: 'support@pharmasaas.com', action: 'Added feature override', details: 'Enabled OCR Import until 2026-06-01' },
  { timestamp: '2026-03-10 16:45', actor: 'billing@pharmasaas.com', action: 'Invoice paid', details: 'INV-2026-0045 marked as paid' },
  { timestamp: '2026-03-01 10:22', actor: 'system', action: 'Invoice created', details: 'Monthly invoice INV-2026-0045 generated' },
  { timestamp: '2026-02-28 11:05', actor: 'admin@pharmasaas.com', action: 'Plan updated', details: 'Changed from Starter to Growth plan' },
];

export function TenantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: tenant, isLoading } = useTenantQuery(id ?? '');
  const suspend = useSuspendTenantMutation();
  const activate = useActivateTenantMutation();

  async function handleToggleStatus() {
    if (!tenant) return;
    try {
      if (tenant.status === 'suspended') {
        await activate.mutateAsync(tenant.id);
        toast.success('Tenant activated');
      } else {
        await suspend.mutateAsync(tenant.id);
        toast.success('Tenant suspended');
      }
    } catch {
      toast.error('Action failed');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading…
      </div>
    );
  }

  if (!tenant) {
    return <p className="text-sm text-gray-500 p-6">Tenant not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/tenants')}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tenants
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{tenant.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                  {tenant.status}
                </span>
                {tenant.plan && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {tenant.plan.name} Plan
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleStatus}
              className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
            >
              {tenant.status === 'suspended' ? 'Activate' : 'Suspend'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <InfoItem icon={Mail} label="Email" value={tenant.email} />
              {tenant.phone && <InfoItem icon={Phone} label="Phone" value={tenant.phone} />}
              {tenant.address && <InfoItem icon={MapPin} label="Address" value={tenant.address} />}
              <InfoItem icon={Calendar} label="Created" value={new Date(tenant.createdAt).toLocaleDateString()} />
              {tenant.branchCount != null && (
                <InfoItem icon={Users} label="Branches" value={String(tenant.branchCount)} />
              )}
              {tenant.userCount != null && (
                <InfoItem icon={Users} label="Users" value={String(tenant.userCount)} />
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Financial</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Monthly Recurring Revenue</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">$2,499</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Unpaid Balance</p>
                <p className="text-lg font-semibold text-green-600 mt-1">$0</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Paid</p>
                <p className="text-sm text-gray-900 mt-1">$4,998</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <ActionButton label="Create Invoice" variant="default" />
              <ActionButton label="Add Feature Override" variant="default" />
              <ActionButton label="Suspend Account" variant="danger" />
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'subscription' && <SubscriptionTab />}
              {activeTab === 'invoices' && <InvoicesTab />}
              {activeTab === 'features' && <FeaturesTab tenantId={id ?? ''} />}
              {activeTab === 'usage' && <UsageTab tenantId={id ?? ''} />}
              {activeTab === 'audit' && <AuditTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ label, variant }: { label: string; variant: 'default' | 'danger' }) {
  return (
    <button
      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        variant === 'danger'
          ? 'text-red-700 bg-red-50 hover:bg-red-100'
          : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard icon={CheckCircle} label="Account Status" value="Active Trial" color="blue" />
        <SummaryCard icon={DollarSign} label="Plan Value" value="$2,499/mo" color="green" />
        <SummaryCard icon={Calendar} label="Customer Since" value="Jan 15, 2026" color="gray" />
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            title="Trial extended by 7 days"
            timestamp="2 days ago"
            actor="Admin Team"
          />
          <ActivityItem
            title="OCR feature enabled temporarily"
            timestamp="5 days ago"
            actor="Support Team"
          />
          <ActivityItem
            title="Added 2 new users"
            timestamp="1 week ago"
            actor="Sarah Johnson"
          />
          <ActivityItem
            title="Created second branch"
            timestamp="2 weeks ago"
            actor="Sarah Johnson"
          />
        </div>
      </div>

      {/* Support Notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Support Notes</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Customer requested trial extension to evaluate OCR feature. Extended trial by 7 days and enabled OCR temporarily. Follow up before trial ends.
          </p>
          <p className="text-xs text-gray-500 mt-2">— Alex Chen, Mar 16, 2026</p>
        </div>
      </div>
    </div>
  );
}

function SubscriptionTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Current Subscription</h3>
          <div className="space-y-3">
            <DetailRow label="Plan" value="Growth" />
            <DetailRow label="Billing Cycle" value="Monthly" />
            <DetailRow label="Status" value="Trialing" badge="blue" />
            <DetailRow label="Trial Started" value="Feb 20, 2026" />
            <DetailRow label="Trial Ends" value="Mar 21, 2026" badge="orange" />
            <DetailRow label="Monthly Amount" value="$2,499" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Renewal Information</h3>
          <div className="space-y-3">
            <DetailRow label="Next Renewal" value="Apr 21, 2026" />
            <DetailRow label="Renewal Amount" value="$2,499" />
            <DetailRow label="Payment Method" value="Card •••• 4242" />
            <DetailRow label="Auto-Renew" value="Enabled" badge="green" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Subscription History</h3>
        <div className="space-y-2">
          <HistoryItem date="Mar 16, 2026" event="Trial extended by 7 days" />
          <HistoryItem date="Feb 28, 2026" event="Upgraded from Starter to Growth plan" />
          <HistoryItem date="Feb 20, 2026" event="Trial started on Growth plan" />
          <HistoryItem date="Jan 15, 2026" event="Account created" />
        </div>
      </div>
    </div>
  );
}

function InvoicesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Invoice History</h3>
        <button className="px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
          Create Invoice
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{invoice.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{invoice.dueDate}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeaturesTab({ tenantId }: { tenantId: string }) {
  const { data: overrides = [], isLoading } = useFeatureOverridesQuery(tenantId);
  const updateOverride = useUpdateFeatureOverrideMutation();

  async function toggle(key: string, currentEnabled: boolean) {
    try {
      await updateOverride.mutateAsync({
        tenantId,
        key,
        payload: { enabled: !currentEnabled },
      });
      toast.success(`Feature ${!currentEnabled ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update feature');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading features…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Feature Overrides</h3>

      {overrides.length === 0 ? (
        <p className="text-sm text-gray-400">No feature overrides configured for this tenant.</p>
      ) : (
        <div className="space-y-2">
          {overrides.map((f) => (
            <div key={f.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-900 capitalize">{f.key.replace(/_/g, ' ')}</p>
                  {f.enabled ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                {f.description && (
                  <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                )}
              </div>
              <button
                onClick={() => toggle(f.key, f.enabled)}
                disabled={updateOverride.isPending}
                className="text-sm text-teal-600 hover:text-teal-800 font-medium disabled:opacity-50"
              >
                {f.enabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsageTab({ tenantId }: { tenantId: string }) {
  const { data: usage, isLoading } = useTenantUsageQuery(tenantId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading usage…
      </div>
    );
  }

  if (!usage) return <p className="text-sm text-gray-400">No usage data available.</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">Resource Usage</h3>

      <UsageBar label="Branches" used={usage.branchCount} max={99} />
      <UsageBar label="Users" used={usage.userCount} max={99} />
      <UsageBar label="Inventory Items" used={usage.inventoryItemCount} max={9999} />
      <UsageBar label="Sales This Month" used={usage.salesThisMonth} max={9999} />
      <UsageBar label="Storage" used={parseFloat((usage.storageUsedMb / 1024).toFixed(2))} max={10} unit="GB" />
    </div>
  );
}

function AuditTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Audit Log</h3>
      <div className="space-y-3">
        {auditLogs.map((log, index) => (
          <div key={index} className="flex gap-4 pb-3 border-b border-gray-200 last:border-0">
            <div className="flex-shrink-0 w-36 text-xs text-gray-500">{log.timestamp}</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{log.action}</p>
              <p className="text-xs text-gray-600 mt-1">{log.details}</p>
              <p className="text-xs text-gray-500 mt-1">by {log.actor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color }: any) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color as keyof typeof colorStyles]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-gray-600 mt-3">{label}</p>
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function ActivityItem({ title, timestamp, actor }: any) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
      <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{actor} • {timestamp}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value, badge }: any) {
  const badgeColors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      {badge ? (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColors[badge as keyof typeof badgeColors]}`}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  );
}

function HistoryItem({ date, event }: any) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-100">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-900">{event}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}

function UsageBar({ label, used, max, unit = '' }: any) {
  const percentage = (used / max) * 100;
  const color = percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-orange-500' : 'bg-teal-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <span className="text-sm text-gray-600">
          {used} / {max} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% used</p>
    </div>
  );
}
