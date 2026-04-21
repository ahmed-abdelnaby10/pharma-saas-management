import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { DollarSign, Plus, Minus } from 'lucide-react';

interface CashTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: { amount: number; reason: string; type: 'in' | 'out' }) => void;
  type: 'in' | 'out';
  isLoading?: boolean;
}

export function CashTransactionModal({
  isOpen,
  onClose,
  onSave,
  type,
  isLoading = false,
}: CashTransactionModalProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ amount, reason, type });
    setAmount(0);
    setReason('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'in' ? t('cashIn') : t('cashOut')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            {type === 'in' ? (
              <Plus className="w-4 h-4 text-green-600" />
            ) : (
              <Minus className="w-4 h-4 text-red-600" />
            )}
            {type === 'in' ? 'Add Cash to Register' : 'Remove Cash from Register'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none resize-none"
                placeholder={type === 'in' ? 'e.g., Starting float, Bank deposit return' : 'e.g., Bank deposit, Petty cash'}
              />
            </div>
          </div>

          {/* Transaction Summary */}
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            type === 'in' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {type === 'in' ? 'Cash In Amount' : 'Cash Out Amount'}
              </span>
              <span className={`text-xl font-semibold ${
                type === 'in' ? 'text-green-600' : 'text-red-600'
              }`}>
                ${amount.toFixed(2)}
              </span>
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
            className={`flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 ${
              type === 'in' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {isLoading ? 'Processing...' : `Confirm ${type === 'in' ? 'Cash In' : 'Cash Out'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
