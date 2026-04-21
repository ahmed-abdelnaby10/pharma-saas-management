import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

export function AddCosmeticPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    barcode: "",
    category: "",
    supplier: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
    reorderLevel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/cosmetics");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app/cosmetics")}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {id ? "Edit Cosmetic" : t("addCosmetic")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the product details
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("productName")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("barcode")} *
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) =>
                  setFormData({ ...formData, barcode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("category")} *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              >
                <option value="">Select category</option>
                <option value="Skincare">Skincare</option>
                <option value="Sun Protection">Sun Protection</option>
                <option value="Lip Care">Lip Care</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("supplier")} *
              </label>
              <select
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              >
                <option value="">Select supplier</option>
                <option value="CosmeticCo">CosmeticCo</option>
                <option value="BeautySupply">BeautySupply</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("purchasePrice")} *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) =>
                  setFormData({ ...formData, purchasePrice: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("sellingPrice")} *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) =>
                  setFormData({ ...formData, sellingPrice: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("stock")} *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("reorderLevel")} *
              </label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) =>
                  setFormData({ ...formData, reorderLevel: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]"
            >
              <Save className="w-4 h-4" />
              {t("save")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/cosmetics")}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
