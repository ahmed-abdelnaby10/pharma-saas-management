import React from 'react';
import { Modal } from './Modal';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Pill, Barcode, Package, Calendar, DollarSign, Building2, AlertCircle } from 'lucide-react';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  const { t } = useLanguage();

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Product Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-[#0F5C47] rounded-lg flex items-center justify-center flex-shrink-0">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.scientificName}</p>
            {product.status && (
              <span className={`inline-flex mt-2 px-2 py-1 rounded text-xs font-medium ${
                product.status === 'Out of Stock' || product.status === 'Expired' ? 'bg-red-100 text-red-700' :
                product.status === 'Critical' || product.status === 'Expiring Soon' ? 'bg-orange-100 text-orange-700' :
                product.status === 'Low' || product.status === 'Near Expiry' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {product.status}
              </span>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Pill className="w-4 h-4 text-[#0F5C47]" />
            {t('basicInformation')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t('barcode')}
              </label>
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-mono text-gray-900">{product.barcode}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {t('category')}
              </label>
              <p className="text-sm text-gray-900">{product.category}</p>
            </div>

            {product.supplier && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('supplier')}
                </label>
                <p className="text-sm text-gray-900">{product.supplier}</p>
              </div>
            )}

            {product.batch && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('batch')}
                </label>
                <p className="text-sm font-mono text-gray-900">{product.batch}</p>
              </div>
            )}
          </div>
        </div>

        {/* Stock Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0F5C47]" />
            Stock Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.currentStock !== undefined && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Current Stock
                </label>
                <p className={`text-lg font-semibold ${
                  product.currentStock === 0 ? 'text-red-600' : 
                  product.currentStock < (product.reorderLevel || 0) / 2 ? 'text-orange-600' : 
                  'text-gray-900'
                }`}>
                  {product.currentStock} {t('items')}
                </p>
              </div>
            )}

            {product.stock !== undefined && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {t('stock')}
                </label>
                <p className="text-lg font-semibold text-gray-900">{product.stock} {t('items')}</p>
              </div>
            )}

            {product.reorderLevel && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Reorder Level
                </label>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{product.reorderLevel} {t('items')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expiry Information */}
        {product.expiry && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F5C47]" />
              Expiry Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Expiry Date
                </label>
                <p className="text-sm text-gray-900">{product.expiry}</p>
              </div>

              {product.daysUntilExpiry !== undefined && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Days Until Expiry
                  </label>
                  <p className={`text-sm font-semibold ${
                    product.daysUntilExpiry < 0 ? 'text-red-600' : 
                    product.daysUntilExpiry <= 14 ? 'text-orange-600' : 
                    product.daysUntilExpiry <= 60 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {product.daysUntilExpiry < 0 ? 'Expired' : `${product.daysUntilExpiry} days`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Information */}
        {(product.purchasePrice || product.sellingPrice || product.price) && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#0F5C47]" />
              Pricing Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.purchasePrice && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Purchase Price
                  </label>
                  <p className="text-sm text-gray-900">${product.purchasePrice.toFixed(2)}</p>
                </div>
              )}

              {product.sellingPrice && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Selling Price
                  </label>
                  <p className="text-sm font-semibold text-[#0F5C47]">${product.sellingPrice.toFixed(2)}</p>
                </div>
              )}

              {product.price && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Price
                  </label>
                  <p className="text-sm font-semibold text-[#0F5C47]">${product.price.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {product.prescriptionRequired !== undefined && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              {product.prescriptionRequired ? '⚕️ This medicine requires a valid prescription' : 'ℹ️ No prescription required'}
            </p>
          </div>
        )}

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
