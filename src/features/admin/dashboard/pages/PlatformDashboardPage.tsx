import type { ElementType } from "react";
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
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/app/contexts/useLanguage";
import { usePlatformDashboardQuery } from "@/features/admin/api";

export function PlatformDashboardPage() {
  const { t, language } = useLanguage();
  const { data: dashboard, isLoading } = usePlatformDashboardQuery();

  const kpis = dashboard?.kpis;
  const health = dashboard?.subscriptionHealth;
  const revenueTrend = dashboard?.revenueTrend ?? [];
  const tenantGrowth = dashboard?.tenantGrowthTrend ?? [];
  const recentActivity = dashboard?.recentActivity ?? [];
  const dateLocale = language === "ar" ? "ar-EG" : "en-US";

  const statusData = [
    {
      name: t("adminDashboard:status.active"),
      value: health?.active ?? 0,
      color: "#10B981",
    },
    {
      name: t("adminDashboard:status.trialing"),
      value: health?.trialing ?? 0,
      color: "#3B82F6",
    },
    {
      name: t("adminDashboard:status.pastDue"),
      value: health?.pastDue ?? 0,
      color: "#F59E0B",
    },
    {
      name: t("adminDashboard:status.suspended"),
      value: health?.suspended ?? 0,
      color: "#EF4444",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        {t("adminDashboard:loading")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminDashboard:header.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminDashboard:header.subtitle")}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            {t("adminDashboard:header.exportReport")}
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t("adminDashboard:header.createTenant")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t("adminDashboard:kpis.totalTenants")}
          value={String(kpis?.totalTenants ?? t("adminDashboard:kpis.empty"))}
          change={
            kpis?.churnRate != null
              ? t("adminDashboard:kpis.churn", {
                  value: kpis.churnRate.toFixed(1),
                })
              : t("adminDashboard:kpis.empty")
          }
          trend="up"
          icon={Users}
          color="teal"
        />
        <KPICard
          title={t("adminDashboard:kpis.activeTenants")}
          value={String(kpis?.activeTenants ?? t("adminDashboard:kpis.empty"))}
          change={t("adminDashboard:kpis.empty")}
          trend="up"
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title={t("adminDashboard:kpis.mrr")}
          value={
            kpis?.mrr != null
              ? `$${kpis.mrr.toLocaleString()}`
              : t("adminDashboard:kpis.empty")
          }
          change={t("adminDashboard:kpis.empty")}
          trend="up"
          icon={DollarSign}
          color="blue"
        />
        <KPICard
          title={t("adminDashboard:kpis.pastDue")}
          value={String(
            kpis?.pastDueInvoices ?? t("adminDashboard:kpis.empty"),
          )}
          change={t("adminDashboard:kpis.empty")}
          trend="down"
          icon={AlertCircle}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("adminDashboard:kpis.trialingTenants")}
          value={String(kpis?.trialingTenants ?? t("adminDashboard:kpis.empty"))}
          subtitle=""
        />
        <StatCard
          title={t("adminDashboard:kpis.suspended")}
          value={String(health?.suspended ?? t("adminDashboard:kpis.empty"))}
          subtitle=""
        />
        <StatCard
          title={t("adminDashboard:kpis.arr")}
          value={
            kpis?.arr != null
              ? `$${kpis.arr.toLocaleString()}`
              : t("adminDashboard:kpis.empty")
          }
          subtitle=""
        />
        <StatCard
          title={t("adminDashboard:kpis.overdueInvoices")}
          value={String(
            kpis?.pastDueInvoices ?? t("adminDashboard:kpis.empty"),
          )}
          subtitle=""
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("adminDashboard:charts.revenueTrend.title")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("adminDashboard:charts.revenueTrend.subtitle")}
              </p>
            </div>
            <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>
                {t("adminDashboard:charts.revenueTrend.options.last6Months")}
              </option>
              <option>
                {t("adminDashboard:charts.revenueTrend.options.last12Months")}
              </option>
              <option>
                {t("adminDashboard:charts.revenueTrend.options.thisYear")}
              </option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="period"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#0D9488"
                strokeWidth={2}
                dot={{ fill: "#0D9488" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {t("adminDashboard:charts.subscriptionGrowth.title")}
              </h3>
              <p className="text-sm text-gray-500">
                {t("adminDashboard:charts.subscriptionGrowth.subtitle")}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="period"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="newTenants"
                fill="#0D9488"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {t("adminDashboard:sections.tenantStatus")}
          </h3>
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
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("adminDashboard:sections.subscriptionHealth")}
            </h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {statusData.map((status) => (
              <div
                key={status.name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm text-gray-700">{status.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("adminDashboard:sections.recentActivity")}
            </h3>
            <AlertCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-400">
                {t("adminDashboard:recentActivity.empty")}
              </p>
            ) : (
              recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    {activity.tenantName && (
                      <p className="text-xs text-gray-500">
                        {activity.tenantName}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-3">
                    {new Date(activity.occurredAt).toLocaleDateString(dateLocale)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("adminDashboard:sections.quickActions")}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <QuickActionButton
            icon={Plus}
            label={t("adminDashboard:quickActions.createTenant")}
          />
          <QuickActionButton
            icon={Clock}
            label={t("adminDashboard:quickActions.startTrial")}
          />
          <QuickActionButton
            icon={DollarSign}
            label={t("adminDashboard:quickActions.createInvoice")}
          />
          <QuickActionButton
            icon={CheckCircle}
            label={t("adminDashboard:quickActions.assignPlan")}
          />
          <QuickActionButton
            icon={XCircle}
            label={t("adminDashboard:quickActions.suspendTenant")}
          />
          <QuickActionButton
            icon={TrendingUp}
            label={t("adminDashboard:quickActions.viewReports")}
          />
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ElementType;
  color: "teal" | "green" | "blue" | "orange";
}

function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: KPICardProps) {
  const colorClasses = {
    teal: "bg-teal-50 text-teal-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
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

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
}: {
  icon: ElementType;
  label: string;
}) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors group">
      <Icon className="w-5 h-5 text-gray-600 group-hover:text-teal-600" />
      <span className="text-xs font-medium text-gray-700 group-hover:text-teal-700">
        {label}
      </span>
    </button>
  );
}
