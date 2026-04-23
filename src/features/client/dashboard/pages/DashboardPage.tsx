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

const salesData = [
  { id: "mon", name: "Mon", sales: 4200 },
  { id: "tue", name: "Tue", sales: 3800 },
  { id: "wed", name: "Wed", sales: 5100 },
  { id: "thu", name: "Thu", sales: 4600 },
  { id: "fri", name: "Fri", sales: 6200 },
  { id: "sat", name: "Sat", sales: 7800 },
  { id: "sun", name: "Sun", sales: 5900 },
];

const topProducts = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Medicine",
    sales: 245,
    revenue: 2450,
    trend: 12,
  },
  {
    id: 2,
    name: "Vitamin D3",
    category: "Medicine",
    sales: 198,
    revenue: 3960,
    trend: 8,
  },
  {
    id: 3,
    name: "Moisturizer Cream",
    category: "Cosmetic",
    sales: 167,
    revenue: 3340,
    trend: -3,
  },
  {
    id: 4,
    name: "Antibiotic Syrup",
    category: "Medicine",
    sales: 134,
    revenue: 4020,
    trend: 15,
  },
  {
    id: 5,
    name: "Sunscreen SPF 50",
    category: "Cosmetic",
    sales: 112,
    revenue: 2800,
    trend: 5,
  },
];

const recentActivity = [
  {
    id: 1,
    type: "sale",
    description: "Sale completed - Invoice #1247",
    time: "5 min ago",
    amount: 125,
  },
  {
    id: 2,
    type: "stock",
    description: "Low stock alert - Paracetamol",
    time: "12 min ago",
  },
  {
    id: 3,
    type: "order",
    description: "Purchase order received",
    time: "1 hour ago",
    amount: 5400,
  },
  {
    id: 4,
    type: "expiry",
    description: "Near expiry alert - 8 items",
    time: "2 hours ago",
  },
  {
    id: 5,
    type: "sale",
    description: "Sale completed - Invoice #1246",
    time: "3 hours ago",
    amount: 87,
  },
];

export function DashboardPage() {
  const { t } = useLanguage();
  const { currentBranch, currentShift } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("dashboard")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {currentBranch?.name} - March 9, 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentShift?.isOpen && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {t("openShift")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("todaySales")}</h3>
          <p className="text-2xl font-semibold text-gray-900">$6,842</p>
        </div>

        {/* Profit */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +8.2%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("profit")}</h3>
          <p className="text-2xl font-semibold text-gray-900">$2,184</p>
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
            <span className="flex items-center gap-1 text-sm font-medium text-orange-600">
              <AlertCircle className="w-4 h-4" />
              Critical
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("lowStock")}</h3>
          <p className="text-2xl font-semibold text-gray-900">24</p>
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
            <span className="flex items-center gap-1 text-sm font-medium text-red-600">
              <XCircle className="w-4 h-4" />
              Alert
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{t("nearExpiry")}</h3>
          <p className="text-2xl font-semibold text-gray-900">18</p>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("quickActions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => navigate("/app/pos")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0F5C47] hover:bg-[#0F5C47]/5 transition-all group"
          >
            <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#0F5C47]">
              {t("startPOS")}
            </span>
          </button>

          <button
            onClick={() => navigate("/app/shifts")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0F5C47] hover:bg-[#0F5C47]/5 transition-all group"
          >
            <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#0F5C47]">
              {t("startShift")}
            </span>
          </button>

          <button
            onClick={() => navigate("/app/medicines/add")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0F5C47] hover:bg-[#0F5C47]/5 transition-all group"
          >
            <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#0F5C47]">
              {t("addProduct")}
            </span>
          </button>

          <button
            onClick={() => navigate("/app/purchasing")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0F5C47] hover:bg-[#0F5C47]/5 transition-all group"
          >
            <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#0F5C47]">
              {t("createPO")}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("salesTrend")}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F5C47" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0F5C47" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("recentActivity")}
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === "sale"
                      ? "bg-green-100"
                      : activity.type === "stock"
                        ? "bg-orange-100"
                        : activity.type === "order"
                          ? "bg-blue-100"
                          : "bg-red-100"
                  }`}
                >
                  {activity.type === "sale" && (
                    <DollarSign className="w-4 h-4 text-green-600" />
                  )}
                  {activity.type === "stock" && (
                    <Package className="w-4 h-4 text-orange-600" />
                  )}
                  {activity.type === "order" && (
                    <FileText className="w-4 h-4 text-blue-600" />
                  )}
                  {activity.type === "expiry" && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.time}
                  </p>
                </div>
                {activity.amount && (
                  <span className="text-sm font-medium text-gray-900">
                    ${activity.amount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("topProducts")}
          </h3>
          <button className="text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("productName")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("category")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Sales
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Revenue
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          product.category === "Medicine"
                            ? "bg-blue-50"
                            : "bg-pink-50"
                        }`}
                      >
                        {product.category === "Medicine" ? (
                          <Pill className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-pink-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                    {product.sales}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                    ${product.revenue}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${
                        product.trend > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.trend > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(product.trend)}%
                    </span>
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
