import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Filter,
  FileDown,
  Edit,
  Trash2,
  AlertCircle,
  Package,
  Loader2,
  Layers,
  X,
  Save,
  PlusCircle,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useInventoryQuery,
  useDeleteInventoryItemMutation,
  useInventoryBatchesQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} from "@/features/client/inventory/api";
import type { InventoryBatch } from "@/features/client/inventory/api";
import { toast } from "sonner";

function getStockStatus(quantity: number, minStockLevel: number) {
  if (quantity === 0) return { label: "Out of Stock", color: "red" };
  if (quantity <= minStockLevel) return { label: "Low Stock", color: "orange" };
  return { label: "In Stock", color: "green" };
}

function isNearExpiry(expiryDate?: string) {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  return expiry <= threeMonthsFromNow;
}

// ─── Batch panel ──────────────────────────────────────────────────────────────

interface BatchFormState {
  batchNumber: string;
  quantity: string;
  expiryDate: string;
  costPrice: string;
}

const EMPTY_FORM: BatchFormState = {
  batchNumber: "",
  quantity: "",
  expiryDate: "",
  costPrice: "",
};

function batchToForm(b: InventoryBatch): BatchFormState {
  return {
    batchNumber: b.batchNumber,
    quantity: String(b.quantity),
    expiryDate: b.expiryDate?.slice(0, 10) ?? "",
    costPrice: String(b.costPrice),
  };
}

interface BatchesPanelProps {
  itemId: string;
  itemName: string;
  onClose: () => void;
}

function BatchesPanel({ itemId, itemName, onClose }: BatchesPanelProps) {
  const { data: batches = [], isLoading } = useInventoryBatchesQuery(itemId);
  const createBatch = useCreateBatchMutation();
  const updateBatch = useUpdateBatchMutation();
  const deleteBatch = useDeleteBatchMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BatchFormState>(EMPTY_FORM);
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<BatchFormState>(EMPTY_FORM);

  function startEdit(b: InventoryBatch) {
    setEditingId(b.id);
    setEditForm(batchToForm(b));
  }

  function saveEdit() {
    if (!editingId) return;
    updateBatch.mutate(
      {
        itemId,
        batchId: editingId,
        batchNumber: editForm.batchNumber,
        quantity: Number(editForm.quantity),
        expiryDate: editForm.expiryDate,
        costPrice: Number(editForm.costPrice),
      },
      {
        onSuccess: () => { setEditingId(null); toast.success("Batch updated"); },
        onError: () => toast.error("Failed to update batch"),
      },
    );
  }

  function handleDelete(batchId: string, batchNumber: string) {
    if (!confirm(`Delete batch "${batchNumber}"?`)) return;
    deleteBatch.mutate(
      { itemId, batchId },
      {
        onSuccess: () => toast.success("Batch deleted"),
        onError: () => toast.error("Failed to delete batch"),
      },
    );
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    createBatch.mutate(
      {
        itemId,
        batchNumber: addForm.batchNumber,
        quantity: Number(addForm.quantity),
        expiryDate: addForm.expiryDate,
        costPrice: Number(addForm.costPrice),
      },
      {
        onSuccess: () => {
          setAddOpen(false);
          setAddForm(EMPTY_FORM);
          toast.success("Batch added");
        },
        onError: () => toast.error("Failed to add batch"),
      },
    );
  }

  const fieldCls =
    "w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500";

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Batches</h3>
            <p className="text-xs text-gray-500">{itemName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setAddOpen((v) => !v); setEditingId(null); }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add batch
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add form */}
        {addOpen && (
          <form onSubmit={submitAdd} className="px-6 py-4 bg-teal-50 border-b border-teal-100 grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Batch #</label>
              <input value={addForm.batchNumber} onChange={(e) => setAddForm({ ...addForm, batchNumber: e.target.value })} required className={fieldCls} placeholder="Lot-001" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Qty</label>
              <input type="number" min="1" value={addForm.quantity} onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })} required className={fieldCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expiry date</label>
              <input type="date" value={addForm.expiryDate} onChange={(e) => setAddForm({ ...addForm, expiryDate: e.target.value })} required className={fieldCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost</label>
              <input type="number" step="0.01" min="0" value={addForm.costPrice} onChange={(e) => setAddForm({ ...addForm, costPrice: e.target.value })} required className={fieldCls} />
            </div>
            <div className="col-span-4 flex justify-end gap-2">
              <button type="button" onClick={() => setAddOpen(false)} className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={createBatch.isPending} className="px-3 py-1.5 text-xs text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-1">
                {createBatch.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                Save
              </button>
            </div>
          </form>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading batches…
            </div>
          ) : batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Layers className="w-10 h-10 mb-2" />
              <p className="text-sm">No batches recorded</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Batch #</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {batches.map((b) =>
                  editingId === b.id ? (
                    <tr key={b.id} className="bg-blue-50">
                      <td className="px-4 py-2">
                        <input value={editForm.batchNumber} onChange={(e) => setEditForm({ ...editForm, batchNumber: e.target.value })} className={fieldCls} />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min="1" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} className={`${fieldCls} text-right`} />
                      </td>
                      <td className="px-4 py-2">
                        <input type="date" value={editForm.expiryDate} onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })} className={fieldCls} />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" step="0.01" min="0" value={editForm.costPrice} onChange={(e) => setEditForm({ ...editForm, costPrice: e.target.value })} className={`${fieldCls} text-right`} />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={saveEdit} disabled={updateBatch.isPending} className="p-1.5 text-teal-600 hover:text-teal-800 disabled:opacity-60">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-800">{b.batchNumber}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{b.quantity}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(b.expiryDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right text-gray-700">${b.costPrice}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => startEdit(b)} className="p-1.5 text-gray-400 hover:text-teal-600 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(b.id, b.batchNumber)} disabled={deleteBatch.isPending} className="p-1.5 text-gray-400 hover:text-red-500 rounded disabled:opacity-60">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MedicinesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [batchesItem, setBatchesItem] = useState<{ id: string; name: string } | null>(null);

  const { data: items = [], isLoading } = useInventoryQuery({ category: "medicine" });
  const deleteMutation = useDeleteInventoryItemMutation();

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.includes(searchQuery),
  );

  const totalValue = items.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);
  const lowStockCount = items.filter((m) => m.quantity <= m.minStockLevel).length;
  const nearExpiryCount = items.filter((m) => isNearExpiry(m.expiryDate)).length;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Medicine deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete medicine");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("medicines")}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your medicine inventory</p>
        </div>
        <button
          onClick={() => navigate("/app/medicines/add")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("addMedicine")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Medicines</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : items.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/app/reports/low-stock")}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#0F5C47] transition-colors text-left w-full"
        >
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
        </button>

        <button
          onClick={() => navigate("/app/reports/expiry")}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#0F5C47] transition-colors text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Near Expiry</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">
                {isLoading ? "—" : nearExpiryCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </button>

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
              placeholder={`${t("search")} medicines...`}
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
            Loading medicines…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("productName")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("scientificName")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("barcode")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("category")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("expiryDate")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("stock")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("price")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("status")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-sm text-gray-500">
                      {searchQuery ? "No medicines match your search." : "No medicines in inventory yet."}
                    </td>
                  </tr>
                )}
                {filtered.map((item) => {
                  const stockStatus = getStockStatus(item.quantity, item.minStockLevel);
                  const nearExpiry = isNearExpiry(item.expiryDate);
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</p>
                          {item.manufacturer && (
                            <p className="text-xs text-gray-500">{item.manufacturer}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                        {item.genericName ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                        {item.barcode ?? "—"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 capitalize whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`text-sm whitespace-nowrap ${nearExpiry ? "text-red-600 font-medium" : "text-gray-600"}`}>
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}
                          {nearExpiry && <AlertCircle className="w-3 h-3 inline ml-1" />}
                        </div>
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
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setBatchesItem({ id: item.id, name: item.name })}
                            title="Manage batches"
                            className="p-1 text-gray-500 hover:text-teal-600"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/app/medicines/edit/${item.id}`)}
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

      {/* Batch management panel */}
      {batchesItem && (
        <BatchesPanel
          itemId={batchesItem.id}
          itemName={batchesItem.name}
          onClose={() => setBatchesItem(null)}
        />
      )}
    </div>
  );
}
