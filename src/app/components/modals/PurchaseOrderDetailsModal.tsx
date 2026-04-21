import React from 'react';
import { Modal } from './Modal';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FileText, Building2, Calendar, Package, DollarSign } from 'lucide-react';

interface PurchaseOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function PurchaseOrderDetailsModal({ isOpen, onClose, order }: PurchaseOrderDetailsModalProps) {
  const { t } = useLanguage();

  if (!order) return null;

  const items = order.items || [];
  const totalDiscount = items.reduce((sum: number, item: any) => {
    const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
    return sum + discountAmount;
  }, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Order Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Order Header */}
        <div className="flex items-start justify-between pb-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#0F5C47] rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">PO-{order.id}</h3>
              <p className="text-sm text-gray-600 mt-1">{order.supplier}</p>
              {order.invoiceNumber && (
                <p className="text-xs text-gray-500 mt-1">Invoice: {order.invoiceNumber}</p>
              )}
            </div>
          </div>
          <span className={`inline-flex px-3 py-1.5 rounded text-sm font-medium ${
            order.status === 'Completed' ? 'bg-green-100 text-green-700' :
            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {order.status}
          </span>
        </div>

        {/* Order Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F5C47]" />
            Order Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Order Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-900">{order.date}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t('supplier')}
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-900">{order.supplier}</p>
              </div>
            </div>

            {order.invoiceNumber && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Invoice Number
                </label>
                <p className="text-sm font-mono text-gray-900">{order.invoiceNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0F5C47]" />
            Order Items
          </h4>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Product</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">{t('quantity')}</th>
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Unit Price</th>
                    {order.items?.[0]?.discount !== undefined && (
                      <>
                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Discount</th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Price After Discount</th>
                      </>
                    )}
                    <th className="text-right py-2 px-3 text-xs font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item: any, index: number) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-2 px-3 text-sm text-gray-900">{item.productName || item.name}</td>
                      <td className="py-2 px-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="py-2 px-3 text-sm text-gray-900 text-right">${item.unitPrice.toFixed(2)}</td>
                      {item.discount !== undefined && (
                        <>
                          <td className="py-2 px-3 text-sm text-orange-600 text-right">{item.discount}%</td>
                          <td className="py-2 px-3 text-sm text-gray-900 text-right">${item.priceAfterDiscount.toFixed(2)}</td>
                        </>
                      )}
                      <td className="py-2 px-3 text-sm font-medium text-gray-900 text-right">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#0F5C47]" />
            Order Summary
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900 font-medium">${order.subtotal?.toFixed(2) || order.totalAmount?.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Discount:</span>
                <span className="text-orange-600 font-medium">-${totalDiscount.toFixed(2)}</span>
              </div>
            )}
            {order.totalAfterDiscount !== undefined && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Total After Discount:</span>
                <span className="text-[#0F5C47] font-semibold text-lg">${order.totalAfterDiscount.toFixed(2)}</span>
              </div>
            )}
            {order.totalAfterDiscount === undefined && (
              <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Total Amount:</span>
                <span className="text-[#0F5C47] font-semibold text-lg">${order.totalAmount?.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}