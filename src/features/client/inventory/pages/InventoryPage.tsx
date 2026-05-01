import React from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Pill,
  Sparkles,
  Loader2,
  PackageX,
  CalendarX,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useInventoryQuery, useExpiringSoonQuery, useLowStockQuery } from "../api";
import { EmptyState } from "@/shared/components/EmptyState";

function stockStatus(item: { quantity: number; minStockLevel: number }) {
  return item.quantity <= item.minStockLevel ? "Low" : "Good";
}

export function InventoryPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: inventory = [], isLoading } = useInventoryQuery();
  const { data: lowStock = [] } = useLowStockQuery();
  const { data: expiring = [] } = useExpiringSoonQuery();

  const totalValue = inventory.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t("inventory")}</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor and manage stock levels</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/app/medicines")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">{t("medicines")}</p>
            <p className="text-sm text-gray-500">View all medicines inventory</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/app/cosmetics")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-pink-600" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">{t("cosmetics")}</p>
            <p className="text-sm text-gray-500">View all cosmetics inventory</p>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : inventory.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/app/reports/low-stock")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("lowStock")}</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">
                {isLoading ? "—" : lowStock.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate("/app/reports/expiry")}
          className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#0F5C47] transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("nearExpiry")}</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">
                {isLoading ? "—" : expiring.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </button>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stock Value</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : `$${totalValue.toLocaleString()}`}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Stock Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Stock</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading inventory…
          </div>
        ) : inventory.length === 0 ? (
          <EmptyState
            icon={PackageX}
            heading="No low-stock items"
            subline="All inventory items are above their reorder levels"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t("productName")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t("stock")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t("status")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const status = stockStatus(item);
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize">{item.category}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right">{item.quantity} {item.unit}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">{item.minStockLevel}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          status === "Good" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Near Expiry Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("nearExpiry")}</h3>
        </div>
        {expiring.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            heading="No expiring batches"
            subline="No batches are expiring within the selected window"
          />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t("productName")}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">{t("expiryDate")}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">{t("stock")}</th>
              </tr>
            </thead>
            <tbody>
              {expiring.map((item) => {
                const daysLeft = item.expiryDate
                  ? Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / 86_400_000)
                  : null;
                return (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 capitalize">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-red-600">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}
                      {daysLeft !== null && (
                        <span className="ml-2 text-xs text-red-500">({daysLeft}d left)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      {item.quantity} {item.unit}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
