import React from "react";
import {
  FileText,
  TrendingUp,
  Package,
  Calendar,
  Download,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/app/contexts/useLanguage";
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
} from "recharts";

export function ReportsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const salesData = [
    { id: "jan", month: "Jan", sales: 45000, profit: 12000 },
    { id: "feb", month: "Feb", sales: 52000, profit: 15000 },
    { id: "mar", month: "Mar", sales: 48000, profit: 13500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("reports")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Business analytics and insights
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]">
          <FileText className="w-4 h-4" />
          {t("generateReport")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate("/app/reports/sales")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("salesReport")}
              </p>
              <p className="text-xs text-gray-500">Daily, Weekly, Monthly</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => navigate("/app/reports/profit")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("profitReport")}
              </p>
              <p className="text-xs text-gray-500">Margins & Growth</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => navigate("/app/reports/low-stock")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("stockReport")}
              </p>
              <p className="text-xs text-gray-500">Inventory Status</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => navigate("/app/reports/expiry")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("expiryReport")}
              </p>
              <p className="text-xs text-gray-500">Near & Expired</p>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Sales & Profit Trend
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              Last 3 Months
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#0F5C47"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
