import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLanguage } from '@/app/contexts/useLanguage';
import { FileText, Plus, Trash2, Package, Pill, Sparkles } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  priceAfterDiscount: number;
  total: number;
}

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: any) => void;
  isLoading?: boolean;
}

export function PurchaseOrderModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: PurchaseOrderModalProps) {
  const { t } = useLanguage();
  const [supplier, setSupplier] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [productType, setProductType] = useState<'medicine' | 'cosmetic'>('medicine');
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', productName: '', quantity: 0, unitPrice: 0, discount: 0, priceAfterDiscount: 0, total: 0 }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasErrors = Object.keys(errors).length > 0;

  const addItem = () => {
    setItems([...items, { 
      id: Date.now().toString(), 
      productName: '', 
      quantity: 0, 
      unitPrice: 0, 
      discount: 0, 
      priceAfterDiscount: 0, 
      total: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          updated.priceAfterDiscount = updated.unitPrice * (1 - updated.discount / 100);
          updated.total = updated.quantity * updated.priceAfterDiscount;
        }
        return updated;
      }
      return item;
    }));
    setErrors((prev) => { const next = { ...prev }; delete next[`${id}_${field}`]; return next; });
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    items.forEach((item) => {
      if (!item.productName.trim()) e[`${item.id}_productName`] = "Product name is required";
      if (item.quantity <= 0) e[`${item.id}_quantity`] = "Quantity must be greater than 0";
      if (item.unitPrice < 0) e[`${item.id}_unitPrice`] = "Unit price cannot be negative";
    });
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      supplier,
      invoiceNumber,
      items,
      totalAmount,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const suppliers = ['PharmaCorp', 'MedSupply Co', 'HealthCare Ltd', 'Global Meds', 'Apex Pharma'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Purchase Order"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0F5C47]" />
            Order Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Type *
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as 'medicine' | 'cosmetic')}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
              >
                <option value="medicine">Medicine</option>
                <option value="cosmetic">Cosmetic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('supplier')} *
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
              >
                <option value="">Select supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Invoice Number *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="Enter invoice number"
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#0F5C47]" />
              Order Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#0F5C47] border border-[#0F5C47] rounded-lg hover:bg-[#0F5C47]/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="col-span-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none ${errors[`${item.id}_productName`] ? "border-red-400" : "border-gray-300"}`}
                    placeholder="Enter product name"
                  />
                  {errors[`${item.id}_productName`] && (
                    <p className="mt-0.5 text-xs text-red-600">{errors[`${item.id}_productName`]}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    min="0"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none ${errors[`${item.id}_quantity`] ? "border-red-400" : "border-gray-300"}`}
                    placeholder="0"
                  />
                  {errors[`${item.id}_quantity`] && (
                    <p className="mt-0.5 text-xs text-red-600">{errors[`${item.id}_quantity`]}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none ${errors[`${item.id}_unitPrice`] ? "border-red-400" : "border-gray-300"}`}
                    placeholder="0.00"
                  />
                  {errors[`${item.id}_unitPrice`] && (
                    <p className="mt-0.5 text-xs text-red-600">{errors[`${item.id}_unitPrice`]}</p>
                  )}
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Disc %
                  </label>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Total
                  </label>
                  <div className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg font-medium">
                    ${item.total.toFixed(2)}
                  </div>
                </div>

                <div className="col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-lg font-semibold text-gray-900">{items.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-[#0F5C47]">${totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading || hasErrors}
            className="flex-1 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}