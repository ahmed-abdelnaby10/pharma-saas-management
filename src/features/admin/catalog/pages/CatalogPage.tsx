import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Package,
} from "lucide-react";
import {
  useCatalogQuery,
  useCreateCatalogItemMutation,
  useUpdateCatalogItemMutation,
  useDeleteCatalogItemMutation,
} from "../api";
import type {
  CatalogItem,
  CatalogItemCategory,
  CreateCatalogItemPayload,
} from "../api";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES: CatalogItemCategory[] = [
  "medicine",
  "cosmetic",
  "supplement",
  "equipment",
  "other",
];

const CAT_LABELS: Record<CatalogItemCategory, string> = {
  medicine:    "Medicine",
  cosmetic:    "Cosmetic",
  supplement:  "Supplement",
  equipment:   "Equipment",
  other:       "Other",
};

// ─── Form modal ───────────────────────────────────────────────────────────────

interface FormState {
  nameEn: string;
  nameAr: string;
  sku: string;
  barcode: string;
  category: CatalogItemCategory;
  unit: string;
  manufacturer: string;
  description: string;
}

const EMPTY: FormState = {
  nameEn: "",
  nameAr: "",
  sku: "",
  barcode: "",
  category: "medicine",
  unit: "",
  manufacturer: "",
  description: "",
};

function itemToForm(item: CatalogItem): FormState {
  return {
    nameEn:       item.nameEn,
    nameAr:       item.nameAr ?? "",
    sku:          item.sku ?? "",
    barcode:      item.barcode ?? "",
    category:     item.category,
    unit:         item.unit ?? "",
    manufacturer: item.manufacturer ?? "",
    description:  item.description ?? "",
  };
}

interface CatalogFormModalProps {
  item?: CatalogItem;
  onClose: () => void;
}

function CatalogFormModal({ item, onClose }: CatalogFormModalProps) {
  const create = useCreateCatalogItemMutation();
  const update = useUpdateCatalogItemMutation();
  const isEdit = !!item;

  const [form, setForm] = useState<FormState>(item ? itemToForm(item) : EMPTY);

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: CreateCatalogItemPayload = {
      nameEn:   form.nameEn,
      ...(form.nameAr       && { nameAr:       form.nameAr }),
      ...(form.sku          && { sku:          form.sku }),
      ...(form.barcode      && { barcode:      form.barcode }),
      category: form.category,
      ...(form.unit         && { unit:         form.unit }),
      ...(form.manufacturer && { manufacturer: form.manufacturer }),
      ...(form.description  && { description:  form.description }),
    };

    if (isEdit) {
      update.mutate(
        { id: item.id, ...payload },
        {
          onSuccess: () => { toast.success("Item updated"); onClose(); },
          onError: () => toast.error("Failed to update"),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => { toast.success("Item created"); onClose(); },
        onError: () => toast.error("Failed to create"),
      });
    }
  }

  const isPending = create.isPending || update.isPending;

  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit catalog item" : "New catalog item"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (EN) *</label>
              <input value={form.nameEn} onChange={set("nameEn")} required className={inputCls} placeholder="Paracetamol 500mg" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Name (AR)</label>
              <input value={form.nameAr} onChange={set("nameAr")} className={inputCls} dir="rtl" placeholder="باراسيتامول" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CAT_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
              <input value={form.unit} onChange={set("unit")} className={inputCls} placeholder="tablet, bottle…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
              <input value={form.sku} onChange={set("sku")} className={inputCls} placeholder="SKU-001" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Barcode</label>
              <input value={form.barcode} onChange={set("barcode")} className={inputCls} placeholder="6123456789" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Manufacturer</label>
              <input value={form.manufacturer} onChange={set("manufacturer")} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CatalogItemCategory | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);

  const { data: items = [], isLoading } = useCatalogQuery({
    search: search || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });
  const deleteItem = useDeleteCatalogItemMutation();

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}" from catalog?`)) return;
    deleteItem.mutate(id, {
      onSuccess: () => toast.success("Item deleted"),
      onError: () => toast.error("Failed to delete"),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Product Catalog</h1>
          <p className="mt-1 text-sm text-gray-500">
            Master library of all products available to tenants
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          New item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, barcode…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CatalogItemCategory | "all")}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{CAT_LABELS[c]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading catalog…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Package className="w-10 h-10" />
                        <p className="text-sm">No items found</p>
                      </div>
                    </td>
                  </tr>
                )}
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.nameEn}</div>
                      {item.nameAr && (
                        <div className="text-xs text-gray-500 mt-0.5" dir="rtl">{item.nameAr}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{item.sku ?? "—"}</td>
                    <td className="px-6 py-4 font-mono text-gray-600">{item.barcode ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{item.unit ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{item.manufacturer ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        item.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      }`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditing(item); setModalOpen(true); }}
                          className="p-1.5 text-gray-400 hover:text-teal-600 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.nameEn)}
                          disabled={deleteItem.isPending}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded disabled:opacity-60"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Form modal */}
      {modalOpen && (
        <CatalogFormModal
          item={editing ?? undefined}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
