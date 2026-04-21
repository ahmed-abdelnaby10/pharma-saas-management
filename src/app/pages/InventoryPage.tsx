import React from 'react';
import { Package, AlertTriangle, XCircle, TrendingUp, Pill, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../contexts/LanguageContext';

const mockInventory = [
  { id: '1', name: 'Paracetamol 500mg', stock: 150, reorderLevel: 50, branch: 'Main Branch', status: 'Good', lastUpdated: '2026-03-08' },
  { id: '2', name: 'Amoxicillin', stock: 25, reorderLevel: 30, branch: 'Main Branch', status: 'Low', lastUpdated: '2026-03-07' },
  { id: '3', name: 'Vitamin D3', stock: 80, reorderLevel: 40, branch: 'North Branch', status: 'Good', lastUpdated: '2026-03-09' },
];

const nearExpiryItems = [
  { id: '1', name: 'Antibiotic Syrup', batch: 'BATCH002', expiry: '2026-04-15', daysLeft: 37, stock: 45 },
  { id: '2', name: 'Pain Relief Gel', batch: 'BATCH005', expiry: '2026-05-20', daysLeft: 72, stock: 30 },
];

export function InventoryPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t('inventory')}</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor and manage stock levels</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/app/medicines')}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">{t('medicines')}</p>
            <p className="text-sm text-gray-500">View all medicines inventory</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/app/cosmetics')}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">{t('cosmetics')}</p>
            <p className="text-sm text-gray-500">View all cosmetics inventory</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">342</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/app/reports/low-stock')}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left flex items-center gap-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('lowStock')}</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">24</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </button>
        <button
          onClick={() => navigate('/app/reports/expiry')}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left flex items-center gap-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('nearExpiry')}</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">18</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </button>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Value</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">$45,320</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stock</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('productName')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('branch')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t('stock')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Reorder Level</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('status')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {mockInventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.branch}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.stock}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-right">{item.reorderLevel}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'Good' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('nearExpiry')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('productName')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('batch')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t('expiryDate')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Days Left</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t('stock')}</th>
              </tr>
            </thead>
            <tbody>
              {nearExpiryItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono">{item.batch}</td>
                  <td className="py-3 px-4 text-sm text-red-600">{item.expiry}</td>
                  <td className="py-3 px-4 text-sm text-red-600 text-right font-medium">{item.daysLeft}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}