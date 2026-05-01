import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Filter,
  FileDown,
  Edit,
  Trash2,
  Sparkles,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useInventoryQuery, useDeleteInventoryItemMutation } from "@/features/client/inventory/api";
import { toast } from "sonner";

function getStockStatus(quantity: number, minStockLevel: number) {
  if (quantity === 0) return { label: "Out of Stock", color: "red" };
  if (quantity <= minStockLevel) return { label: "Low Stock", color: "orange" };
  return { label: "In Stock", color: "green" };
}

export function CosmeticsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items = [], isLoading } = useInventoryQuery({ category: "cosmetic" });
  const deleteMutation = useDeleteInventoryItemMutation();

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.includes(searchQuery) ||
      item.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalValue = items.reduce((sum, m) => sum + m.quantity * m.sellingPrice, 0);
  const lowStockCount = items.filter((m) => m.quantity <= m.minStockLevel).length;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Cosmetic item deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("cosmetics")}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your cosmetics inventory</p>
        </div>
        <button
          onClick={() => navigate("/app/cosmetics/add")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Cosmetic
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : items.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">
                {isLoading ? "—" : lowStockCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : new Set(items.map((i) => i.category)).size}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : `$${totalValue.toLocaleString()}`}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search / Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cosmetics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            {t("filter")}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FileDown className="w-4 h-4" />
            {t("export")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading cosmetics…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("productName")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Brand</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("barcode")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("category")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("stock")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("price")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("status")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-sm text-gray-500">
                      {searchQuery ? "No cosmetics match your search." : "No cosmetics in inventory yet."}
                    </td>
                  </tr>
                )}
                {filtered.map((item) => {
                  const stockStatus = getStockStatus(item.quantity, item.minStockLevel);
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.manufacturer ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                        {item.barcode ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium whitespace-nowrap">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                        ${item.sellingPrice}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          stockStatus.color === "green" ? "bg-green-100 text-green-700"
                          : stockStatus.color === "orange" ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                        }`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/app/cosmetics/edit/${item.id}`)}
                            className="p-1 text-gray-600 hover:text-[#0F5C47]"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
