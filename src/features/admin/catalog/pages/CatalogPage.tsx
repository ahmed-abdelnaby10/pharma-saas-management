import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";
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

const CATEGORIES: CatalogItemCategory[] = [
  "medicine",
  "cosmetic",
  "supplement",
  "equipment",
  "other",
];

function getCategoryLabel(
  category: CatalogItemCategory,
  t: (key: string, options?: Record<string, unknown>) => any,
) {
  return t(`adminCatalog:categories.${category}`);
}

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
    nameEn: item.nameEn,
    nameAr: item.nameAr ?? "",
    sku: item.sku ?? "",
    barcode: item.barcode ?? "",
    category: item.category,
    unit: item.unit ?? "",
    manufacturer: item.manufacturer ?? "",
    description: item.description ?? "",
  };
}

interface CatalogFormModalProps {
  item?: CatalogItem;
  onClose: () => void;
}

function CatalogFormModal({ item, onClose }: CatalogFormModalProps) {
  const { t } = useLanguage();
  const create = useCreateCatalogItemMutation();
  const update = useUpdateCatalogItemMutation();
  const isEdit = !!item;

  const [form, setForm] = useState<FormState>(item ? itemToForm(item) : EMPTY);

  const set =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: CreateCatalogItemPayload = {
      nameEn: form.nameEn,
      ...(form.nameAr && { nameAr: form.nameAr }),
      ...(form.sku && { sku: form.sku }),
      ...(form.barcode && { barcode: form.barcode }),
      category: form.category,
      ...(form.unit && { unit: form.unit }),
      ...(form.manufacturer && { manufacturer: form.manufacturer }),
      ...(form.description && { description: form.description }),
    };

    if (isEdit) {
      update.mutate(
        { id: item.id, ...payload },
        {
          onSuccess: () => {
            toast.success(t("adminCatalog:toasts.updated"));
            onClose();
          },
          onError: () => toast.error(t("adminCatalog:toasts.updateFailed")),
        },
      );
      return;
    }

    create.mutate(payload, {
      onSuccess: () => {
        toast.success(t("adminCatalog:toasts.created"));
        onClose();
      },
      onError: () => toast.error(t("adminCatalog:toasts.createFailed")),
    });
  }

  const isPending = create.isPending || update.isPending;
  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit
              ? t("adminCatalog:modal.editTitle")
              : t("adminCatalog:modal.newTitle")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.nameEn.label")}
              </label>
              <input
                value={form.nameEn}
                onChange={set("nameEn")}
                required
                className={inputCls}
                placeholder={t("adminCatalog:modal.fields.nameEn.placeholder")}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.nameAr.label")}
              </label>
              <input
                value={form.nameAr}
                onChange={set("nameAr")}
                className={inputCls}
                dir="rtl"
                placeholder={t("adminCatalog:modal.fields.nameAr.placeholder")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.category.label")}
              </label>
              <select
                value={form.category}
                onChange={set("category")}
                className={inputCls}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category, t)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.unit.label")}
              </label>
              <input
                value={form.unit}
                onChange={set("unit")}
                className={inputCls}
                placeholder={t("adminCatalog:modal.fields.unit.placeholder")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.sku.label")}
              </label>
              <input
                value={form.sku}
                onChange={set("sku")}
                className={inputCls}
                placeholder={t("adminCatalog:modal.fields.sku.placeholder")}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.barcode.label")}
              </label>
              <input
                value={form.barcode}
                onChange={set("barcode")}
                className={inputCls}
                placeholder={t("adminCatalog:modal.fields.barcode.placeholder")}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.manufacturer.label")}
              </label>
              <input
                value={form.manufacturer}
                onChange={set("manufacturer")}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminCatalog:modal.fields.description.label")}
              </label>
              <textarea
                value={form.description}
                onChange={set("description")}
                rows={3}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminCatalog:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit
                ? t("adminCatalog:modal.actions.save")
                : t("adminCatalog:modal.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CatalogPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    CatalogItemCategory | "all"
  >("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);

  const { data: items = [], isLoading } = useCatalogQuery({
    search: search || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });
  const deleteItem = useDeleteCatalogItemMutation();

  function handleDelete(id: string, name: string) {
    if (!confirm(t("adminCatalog:page.deleteConfirm", { name }))) return;
    deleteItem.mutate(id, {
      onSuccess: () => toast.success(t("adminCatalog:toasts.deleted")),
      onError: () => toast.error(t("adminCatalog:toasts.deleteFailed")),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminCatalog:page.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminCatalog:page.subtitle")}
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          {t("adminCatalog:page.newItem")}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t("adminCatalog:page.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as CatalogItemCategory | "all")
          }
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">{t("adminCatalog:categories.all")}</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {getCategoryLabel(category, t)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {t("adminCatalog:page.loading")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.name")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.category")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.sku")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.barcode")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.unit")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.manufacturer")}
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.status")}
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminCatalog:page.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Package className="w-10 h-10" />
                        <p className="text-sm">{t("adminCatalog:page.empty")}</p>
                      </div>
                    </td>
                  </tr>
                )}
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.nameEn}</div>
                      {item.nameAr && (
                        <div className="text-xs text-gray-500 mt-0.5" dir="rtl">
                          {item.nameAr}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {getCategoryLabel(item.category, t)}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {item.sku ?? t("adminCatalog:page.placeholder.emptyValue")}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600">
                      {item.barcode ??
                        t("adminCatalog:page.placeholder.emptyValue")}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.unit ?? t("adminCatalog:page.placeholder.emptyValue")}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.manufacturer ??
                        t("adminCatalog:page.placeholder.emptyValue")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          item.isActive
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                        }`}
                      >
                        {item.isActive
                          ? t("adminCatalog:status.active")
                          : t("adminCatalog:status.inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditing(item);
                            setModalOpen(true);
                          }}
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
          {t("adminCatalog:page.table.itemsCount", { count: items.length })}
        </div>
      </div>

      {modalOpen && (
        <CatalogFormModal
          item={editing ?? undefined}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
