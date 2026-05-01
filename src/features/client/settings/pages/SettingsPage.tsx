import React, { useEffect, useState } from "react";
import { Globe, Bell, Printer, Save, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { toast } from "sonner";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/features/client/settings/api";
import type { TenantSettings } from "@/features/client/settings/api";

export function SettingsPage() {
  const { t } = useLanguage();
  const { data: settings, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const [form, setForm] = useState<Partial<TenantSettings>>({});

  // Populate form once settings load
  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  function set<K extends keyof TenantSettings>(key: K, value: TenantSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save settings");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t("settings")}</h1>
        <p className="text-sm text-gray-600 mt-1">Configure your pharmacy system</p>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
            <p className="text-sm text-gray-600">Currency, VAT, and locale</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Default Currency
            </label>
            <input
              type="text"
              value={form.defaultCurrency ?? ""}
              onChange={(e) => set("defaultCurrency", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
              placeholder="USD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">VAT Rate (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.vatRate ?? ""}
              onChange={(e) => set("vatRate", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
            <input
              type="text"
              value={form.timezone ?? ""}
              onChange={(e) => set("timezone", e.target.value)}
              placeholder="UTC"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Default Language
            </label>
            <select
              value={form.language ?? "en"}
              onChange={(e) => set("language", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Alert Preferences</h3>
            <p className="text-sm text-gray-600">Configure when you receive alerts</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Low Stock Alerts</p>
              <p className="text-xs text-gray-500">Get notified when products reach reorder level</p>
            </div>
            <input
              type="checkbox"
              checked={form.lowStockAlerts ?? false}
              onChange={(e) => set("lowStockAlerts", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]"
            />
          </label>

          {form.lowStockAlerts && (
            <div className="ml-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold (days of supply)
              </label>
              <input
                type="number"
                min={1}
                value={form.lowStockThresholdDays ?? ""}
                onChange={(e) => set("lowStockThresholdDays", parseInt(e.target.value) || undefined)}
                className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>
          )}

          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-900">Expiry Alerts</p>
              <p className="text-xs text-gray-500">Get notified about near-expiry products</p>
            </div>
            <input
              type="checkbox"
              checked={form.expiryAlerts ?? false}
              onChange={(e) => set("expiryAlerts", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]"
            />
          </label>

          {form.expiryAlerts && (
            <div className="ml-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Alert Window (days before expiry)
              </label>
              <input
                type="number"
                min={1}
                value={form.expiryAlertDays ?? ""}
                onChange={(e) => set("expiryAlertDays", parseInt(e.target.value) || undefined)}
                className="w-40 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Receipt */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Printer className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Receipt Settings</h3>
            <p className="text-sm text-gray-600">Configure receipt printing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Receipt Header
            </label>
            <textarea
              rows={3}
              value={form.receiptHeader ?? ""}
              onChange={(e) => set("receiptHeader", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Receipt Footer
            </label>
            <textarea
              rows={3}
              value={form.receiptFooter ?? ""}
              onChange={(e) => set("receiptFooter", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {t("save")} Changes
        </button>
        <button
          type="button"
          onClick={() => settings && setForm(settings)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
