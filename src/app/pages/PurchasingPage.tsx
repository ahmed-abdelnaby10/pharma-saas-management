import React, { useState } from 'react';
import { Plus, FileText, Package, DollarSign, Clock, Eye } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { PurchaseOrderModal } from '../components/modals/PurchaseOrderModal';
import { PurchaseOrderDetailsModal } from '../components/modals/PurchaseOrderDetailsModal';

const mockOrders = [
  { 
    id: 'PO-001', 
    supplier: 'PharmaCorp', 
    date: '2026-03-08', 
    totalAmount: 5400, 
    status: 'Pending', 
    type: 'Company',
    invoiceNumber: 'INV-2026-001',
    items: [
      { productName: 'Paracetamol 500mg', quantity: 100, unitPrice: 25, discount: 5, priceAfterDiscount: 23.75, total: 2375 },
      { productName: 'Amoxicillin 250mg', quantity: 50, unitPrice: 45, discount: 10, priceAfterDiscount: 40.50, total: 2025 },
      { productName: 'Vitamin D3 5000 IU', quantity: 30, unitPrice: 35, discount: 0, priceAfterDiscount: 35, total: 1000 },
    ]
  },
  { 
    id: 'PO-002', 
    supplier: 'MedSupply Co', 
    date: '2026-03-07', 
    totalAmount: 2800, 
    status: 'Received', 
    type: 'Company',
    invoiceNumber: 'INV-2026-002',
    items: [
      { productName: 'Ibuprofen 400mg', quantity: 80, unitPrice: 30, discount: 5, priceAfterDiscount: 28.50, total: 2280 },
      { productName: 'Cetirizine 10mg', quantity: 20, unitPrice: 26, discount: 0, priceAfterDiscount: 26, total: 520 },
    ]
  },
  { 
    id: 'PO-003', 
    supplier: 'John Smith (Rep)', 
    date: '2026-03-06', 
    totalAmount: 3200, 
    status: 'Processing', 
    type: 'Representative',
    invoiceNumber: 'INV-2026-003',
    items: [
      { productName: 'Aspirin 100mg', quantity: 60, unitPrice: 40, discount: 10, priceAfterDiscount: 36, total: 2160 },
      { productName: 'Cough Syrup', quantity: 25, unitPrice: 42, discount: 2, priceAfterDiscount: 41.16, total: 1029 },
    ]
  },
];

export function PurchasingPage() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleSaveOrder = (orderData: any) => {
    console.log('Saving order:', orderData);
    // Add your save logic here
    setIsModalOpen(false);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('purchasing')}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage purchase orders and suppliers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" />
          {t('createPO')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">156</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">12</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">$89,450</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchase Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t('supplier')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t('date')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t('items')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t('amount')}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t('status')}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{order.supplier}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      order.type === 'Company' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{order.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">{order.items.length}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">${order.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      order.status === 'Received' ? 'bg-green-100 text-green-700' :
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium" onClick={() => handleViewOrder(order)}>{t('view')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PurchaseOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveOrder} />
      <PurchaseOrderDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} order={selectedOrder} />
    </div>
  );
}