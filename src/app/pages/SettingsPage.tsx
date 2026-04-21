import React from 'react';
import { Globe, Bell, Printer, Save } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t('settings')}</h1>
        <p className="text-sm text-gray-600 mt-1">Configure your pharmacy system</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Organization Settings</h3>
            <p className="text-sm text-gray-600">Manage your organization details</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
            <input
              type="text"
              defaultValue="Green Valley Pharmacy"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax ID</label>
            <input
              type="text"
              defaultValue="123456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input
              type="tel"
              defaultValue="+1 234 567 8900"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              defaultValue="info@greenvalleypharmacy.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <p className="text-sm text-gray-600">Manage alert preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Low Stock Alerts</p>
              <p className="text-xs text-gray-500">Get notified when products reach reorder level</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]" />
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Expiry Alerts</p>
              <p className="text-xs text-gray-500">Get notified about near-expiry products</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]" />
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Purchase Order Updates</p>
              <p className="text-xs text-gray-500">Get notified about order status changes</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]" />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Printer className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Receipt & Printer Settings</h3>
            <p className="text-sm text-gray-600">Configure receipt printing</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt Header</label>
            <textarea
              rows={3}
              defaultValue="Green Valley Pharmacy&#10;Downtown Medical Center&#10;Tel: +1 234 567 8900"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt Footer</label>
            <textarea
              rows={3}
              defaultValue="Thank you for your visit!&#10;Keep this receipt for warranty"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">VAT %</label>
            <input
              type="number"
              defaultValue="15"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Language</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-6 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]">
          <Save className="w-4 h-4" />
          {t('save')} Changes
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}
