import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  Calendar,
  ShoppingCart,
  DollarSign,
  FileText,
  Plus,
  Pill,
  Sparkles,
  ArrowUpRight,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useApp } from "@/app/contexts/useApp";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useDashboardSummaryQuery,
  useTopProductsQuery,
  useRecentSalesQuery,
  useAnalyticsQuery,
  usePaymentBreakdownQuery,
} from "../api";

export function DashboardPage() {
  const { t } = useLanguage();
  const { currentBranch } = useApp();
  const navigate = useNavigate();

  const { data: summary } = useDashboardSummaryQuery();
  const { data: topProducts = [] } = useTopProductsQuery();
  const { data: recentSales = [] } = useRecentSalesQuery();
  const { data: analytics = [] } = useAnalyticsQuery({ groupBy: "day" });
  const { data: paymentBreakdown } = usePaymentBreakdownQuery();

  const chartData = analytics.map((pt) => ({
    name: new Date(pt.date).toLocaleDateString("en", { weekday: "short" }),
    sales: pt.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("dashboard")}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentBranch?.name} — {new Date().toLocaleDateString("en", { dateStyle: "long" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <Calendar className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">{t("openShift")}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("todaySales")}</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary ? `$${summary.todayRevenue.toLocaleString()}` : "—"}
          </p>
          {summary && (
            <p className="text-xs text-gray-500 mt-1">{summary.todayTransactions} transactions</p>
          )}
        </div>

        {/* Active Shifts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Active Shifts</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary ? summary.activeShifts : "—"}
          </p>
        </div>

        {/* Low Stock */}
        <button
          onClick={() => navigate("/app/reports/low-stock")}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#0F5C47] transition-colors text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            {summary && summary.lowStockCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-orange-600">
                <AlertCircle className="w-3 h-3" />
                Critical
              </span>
            )}
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("lowStock")}</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary ? summary.lowStockCount : "—"}
          </p>
        </button>

        {/* Near Expiry */}
        <button
          onClick={() => navigate("/app/reports/expiry")}
          className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#0F5C47] transition-colors text-left w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            {summary && summary.expiringCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                <XCircle className="w-3 h-3" />
                Alert
              </span>
            )}
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("nearExpiry")}</h3>
          <p className="text-2xl font-semibold text-gray-900">
            {summary ? summary.expiringCount : "—"}
          </p>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("quickActions")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: t("startPOS"), icon: ShoppingCart, path: "/app/pos" },
            { label: t("startShift"), icon: Calendar, path: "/app/shifts" },
            { label: t("addProduct"), icon: Plus, path: "/app/medicines/add" },
            { label: t("createPO"), icon: FileText, path: "/app/purchasing" },
          ].map(({ label, icon: Icon, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0F5C47] hover:bg-[#0F5C47]/5 transition-all group"
            >
              <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#0F5C47]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("salesTrend")}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData.length ? chartData : [{ name: "—", sales: 0 }]}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F5C47" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0F5C47" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#0F5C47"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("recentActivity")}</h3>
          <div className="space-y-3">
            {recentSales.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">No recent sales.</p>
            )}
            {recentSales.slice(0, 6).map((sale) => (
              <div
                key={sale.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {sale.customerName ? `Sale — ${sale.customerName}` : "Walk-in Sale"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {sale.itemCount} items · {new Date(sale.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  ${sale.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t("topProducts")}</h3>
          <button
            onClick={() => navigate("/app/reports")}
            className="text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium flex items-center gap-1"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("productName")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("category")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Units Sold</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          product.category === "medicine" ? "bg-blue-50" : "bg-pink-50"
                        }`}>
                          {product.category === "medicine"
                            ? <Pill className="w-4 h-4 text-blue-600" />
                            : <Sparkles className="w-4 h-4 text-pink-600" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">{product.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{product.totalSold}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">${product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment breakdown */}
      {paymentBreakdown && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["CASH", "CARD", "INSURANCE", "OTHER"] as const).map((method) => {
              const stats = paymentBreakdown[method];
              const total = Object.values(paymentBreakdown).reduce((s, v) => s + (v?.total ?? 0), 0);
              const pct = total > 0 ? Math.round((stats?.total ?? 0) / total * 100) : 0;
              const colors: Record<string, string> = {
                CASH: "bg-green-500",
                CARD: "bg-blue-500",
                INSURANCE: "bg-purple-500",
                OTHER: "bg-gray-400",
              };
              return (
                <div key={method} className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium capitalize">{method.toLowerCase()}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[method]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      ${(stats?.total ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{stats?.count ?? 0} transactions</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
