import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { useLanguage } from '@/app/contexts/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{message}</p>
            {itemName && (
              <p className="text-sm font-medium text-gray-900 mt-2">"{itemName}"</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? t('deleting') : t('delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
