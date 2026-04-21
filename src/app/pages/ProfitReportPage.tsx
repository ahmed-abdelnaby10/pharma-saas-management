import React, { useState } from 'react';
import { FileText, Calendar, Download, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../contexts/LanguageContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ProfitReportPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('monthly');

  const profitData = [
    { id: 'week1', period: 'Week 1', revenue: 16700, cost: 11200, profit: 5500, margin: 32.9 },
    { id: 'week2', period: 'Week 2', revenue: 21000, cost: 14300, profit: 6700, margin: 31.9 },
    { id: 'week3', period: 'Week 3', revenue: 18700, cost: 12500, profit: 6200, margin: 33.2 },
    { id: 'week4', period: 'Week 4', revenue: 22700, cost: 15100, profit: 7600, margin: 33.5 },
  ];

  const categoryProfit = [
    { id: 'medicines', category: 'Medicines', revenue: 58100, cost: 39200, profit: 18900, margin: 32.5 },
    { id: 'cosmetics', category: 'Cosmetics', revenue: 21100, cost: 13900, profit: 7200, margin: 34.1 },
  ];

  const totalRevenue = profitData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = profitData.reduce((sum, item) => sum + item.cost, 0);
  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);
  const avgMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/app/reports')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-1"
          >
            ← Back to Reports
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{t('profitReport')}</h1>
          <p className="text-sm text-gray-600 mt-1">Profit margins and financial performance</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Total Revenue</h3>
          <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Total Cost</h3>
          <p className="text-2xl font-semibold text-gray-900">${totalCost.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +18.2%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Net Profit</h3>
          <p className="text-2xl font-semibold text-gray-900">${totalProfit.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              +2.1%
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">Profit Margin</h3>
          <p className="text-2xl font-semibold text-gray-900">{avgMargin.toFixed(1)}%</p>
        </div>
      </div>

      {/* Profit Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue vs Profit Trend</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-gray-600">Profit</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryProfit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Breakdown</h3>
          <div className="space-y-4">
            {categoryProfit.map((cat) => (
              <div key={cat.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                  <span className="text-sm font-semibold text-green-600">{cat.margin.toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium text-gray-900">${cat.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cost</p>
                    <p className="font-medium text-gray-900">${cat.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Profit</p>
                    <p className="font-medium text-green-600">${cat.profit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}