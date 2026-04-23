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
  DollarSign,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

const mockCosmetics = [
  {
    id: "1",
    name: "Moisturizer Cream",
    brand: "BeautyPro",
    barcode: "8901234567893",
    category: "Skincare",
    supplier: "CosmeticCo",
    price: 25,
    stock: 120,
    reorderLevel: 30,
  },
  {
    id: "2",
    name: "Sunscreen SPF 50",
    brand: "SunGuard",
    barcode: "8901234567894",
    category: "Sun Protection",
    supplier: "BeautySupply",
    price: 35,
    stock: 90,
    reorderLevel: 40,
  },
  {
    id: "3",
    name: "Lip Balm",
    brand: "LipCare",
    barcode: "8901234567895",
    category: "Lip Care",
    supplier: "CosmeticCo",
    price: 8,
    stock: 200,
    reorderLevel: 50,
  },
  {
    id: "4",
    name: "Face Serum",
    brand: "GlowPro",
    barcode: "8901234567896",
    category: "Skincare",
    supplier: "BeautySupply",
    price: 45,
    stock: 60,
    reorderLevel: 25,
  },
  {
    id: "5",
    name: "Hand Cream",
    brand: "SoftHands",
    barcode: "8901234567897",
    category: "Skincare",
    supplier: "CosmeticCo",
    price: 15,
    stock: 15,
    reorderLevel: 30,
  },
];

export function CosmeticsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCosmetics = mockCosmetics.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery),
  );

  const lowStockCount = mockCosmetics.filter(
    (item) => item.stock <= item.reorderLevel,
  ).length;
  const outOfStockCount = mockCosmetics.filter(
    (item) => item.stock === 0,
  ).length;
  const totalValue = mockCosmetics.reduce(
    (sum, item) => sum + item.price * item.stock,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("cosmetics")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your cosmetic products
          </p>
        </div>
        <button
          onClick={() => navigate("/app/cosmetics/add")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("addCosmetic")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cosmetics</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {mockCosmetics.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-600" />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/app/reports/low-stock")}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#0F5C47] transition-colors text-left w-full"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t("lowStock")}</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">
                {lowStockCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </button>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">
                {outOfStockCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search") + " cosmetics..."}
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("productName")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Brand
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("barcode")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("category")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("supplier")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("stock")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("price")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCosmetics.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-pink-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {item.brand}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                    {item.barcode}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {item.supplier}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium whitespace-nowrap">
                    {item.stock}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                    ${item.price}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/app/cosmetics/edit/${item.id}`)
                        }
                        className="p-1 text-gray-600 hover:text-[#0F5C47]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
