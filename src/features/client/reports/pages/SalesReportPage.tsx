import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/app/contexts/LanguageContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function SalesReportPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("monthly");

  const salesData = [
    {
      id: "week1",
      period: "Week 1",
      medicines: 12500,
      cosmetics: 4200,
      total: 16700,
    },
    {
      id: "week2",
      period: "Week 2",
      medicines: 15200,
      cosmetics: 5800,
      total: 21000,
    },
    {
      id: "week3",
      period: "Week 3",
      medicines: 13800,
      cosmetics: 4900,
      total: 18700,
    },
    {
      id: "week4",
      period: "Week 4",
      medicines: 16500,
      cosmetics: 6200,
      total: 22700,
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      type: "Medicine",
      sold: 450,
      revenue: 4500,
    },
    { id: 2, name: "Vitamin D3", type: "Medicine", sold: 320, revenue: 6400 },
    {
      id: 3,
      name: "Moisturizer Cream",
      type: "Cosmetic",
      sold: 280,
      revenue: 7000,
    },
    {
      id: 4,
      name: "Antibiotic Syrup",
      type: "Medicine",
      sold: 250,
      revenue: 7500,
    },
    {
      id: 5,
      name: "Sunscreen SPF 50",
      type: "Cosmetic",
      sold: 220,
      revenue: 7700,
    },
  ];

  const totalSales = salesData.reduce((sum, item) => sum + item.total, 0);
  const totalMedicineSales = salesData.reduce(
    (sum, item) => sum + item.medicines,
    0,
  );
  const totalCosmeticSales = salesData.reduce(
    (sum, item) => sum + item.cosmetics,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/app/reports")}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
          >
            â† Back to Reports
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("salesReport")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed sales analytics and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +15.3%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Total Sales</h3>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalSales.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +12.1%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Medicine Sales</h3>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalMedicineSales.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-pink-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +18.7%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Cosmetic Sales</h3>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalCosmeticSales.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Medicines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-600 rounded"></div>
              <span className="text-gray-600">Cosmetics</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Legend />
            <Bar dataKey="medicines" fill="#2563eb" name="Medicines" />
            <Bar dataKey="cosmetics" fill="#ec4899" name="Cosmetics" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Selling Products
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  #
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Product Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Type
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Units Sold
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        product.type === "Medicine"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      {product.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">
                    {product.sold}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                    ${product.revenue.toLocaleString()}
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
