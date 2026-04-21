import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Sparkles, Barcode, Package, DollarSign, Calendar } from 'lucide-react';

interface Cosmetic {
  id?: string;
  name: string;
  brand: string;
  barcode: string;
  category: string;
  supplier: string;
  stock: number;
  price: number;
  discount: number;
}

interface CosmeticFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cosmetic: Cosmetic) => void;
  cosmetic?: Cosmetic;
  isLoading?: boolean;
}

export function CosmeticFormModal({
  isOpen,
  onClose,
  onSave,
  cosmetic,
  isLoading = false,
}: CosmeticFormModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Cosmetic>(
    cosmetic || {
      name: '',
      brand: '',
      barcode: '',
      category: '',
      supplier: '',
      stock: 0,
      price: 0,
      discount: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Personal Care', 'Sun Care'];
  const suppliers = ['Beauty Corp', 'Cosmetics Ltd', 'Glow Supplies', 'Elite Beauty'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cosmetic ? 'Edit Cosmetic' : 'Add New Cosmetic'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            {t('basicInformation')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Name (Trade Name) *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="Enter product/trade name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Barcode className="w-4 h-4" />
                {t('barcode')} *
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none font-mono"
                placeholder="8901234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('category')} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('supplier')} *
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
              >
                <option value="">Select supplier</option>
                {suppliers.map((sup) => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#0F5C47]" />
            Pricing & Stock
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {t('stock')} *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Discount *
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="0.00"
              />
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
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors disabled:opacity-50"
          >
            {isLoading ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}