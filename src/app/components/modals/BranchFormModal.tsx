import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

interface BranchData {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: 'Active' | 'Inactive';
}

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branch: BranchData) => void;
  branch?: BranchData;
  isLoading?: boolean;
}

export function BranchFormModal({
  isOpen,
  onClose,
  onSave,
  branch,
  isLoading = false,
}: BranchFormModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BranchData>(
    branch || {
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      status: 'Active',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={branch ? 'Edit Branch' : 'Add New Branch'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branch Information */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0F5C47]" />
            Branch Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Branch Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                  placeholder="Enter branch name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none resize-none"
                  placeholder="Enter complete address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="+966 50 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('email')} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="branch@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Branch Manager *
              </label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                placeholder="Enter manager name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('status')}
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Active"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' })}
                    className="w-4 h-4 text-[#0F5C47] focus:ring-[#0F5C47]"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Inactive"
                    checked={formData.status === 'Inactive'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Inactive' })}
                    className="w-4 h-4 text-[#0F5C47] focus:ring-[#0F5C47]"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
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
