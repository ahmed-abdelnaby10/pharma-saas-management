import React, { useState } from "react";
import { AlertCircle, Package, Filter, Download, Eye } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { ProductDetailsModal } from "@/app/components/modals/ProductDetailsModal";

const mockLowStockProducts = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    scientificName: "Acetaminophen",
    barcode: "6281001234567",
    category: "Analgesic",
    currentStock: 5,
    reorderLevel: 20,
    supplier: "PharmaCorp",
    batch: "BATCH001",
    expiry: "2026-12-31",
    status: "Critical",
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    scientificName: "Amoxicillin",
    barcode: "6281001234568",
    category: "Antibiotic",
    currentStock: 8,
    reorderLevel: 25,
    supplier: "MedSupply Co",
    batch: "BATCH002",
    expiry: "2026-11-15",
    status: "Low",
  },
  {
    id: "3",
    name: "Vitamin D3 5000 IU",
    scientificName: "Cholecalciferol",
    barcode: "6281001234569",
    category: "Supplement",
    currentStock: 0,
    reorderLevel: 15,
    supplier: "HealthCare Ltd",
    batch: "BATCH003",
    expiry: "2027-01-20",
    status: "Out of Stock",
  },
  {
    id: "4",
    name: "Ibuprofen 400mg",
    scientificName: "Ibuprofen",
    barcode: "6281001234570",
    category: "Analgesic",
    currentStock: 12,
    reorderLevel: 30,
    supplier: "Global Meds",
    batch: "BATCH004",
    expiry: "2026-10-10",
    status: "Low",
  },
  {
    id: "5",
    name: "Cetirizine 10mg",
    scientificName: "Cetirizine HCl",
    barcode: "6281001234571",
    category: "Antihistamine",
    currentStock: 3,
    reorderLevel: 20,
    supplier: "Apex Pharma",
    batch: "BATCH005",
    expiry: "2026-09-05",
    status: "Critical",
  },
];

export function LowStockReportPage() {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
  };

  const filteredProducts =
    filterStatus === "all"
      ? mockLowStockProducts
      : mockLowStockProducts.filter(
          (p) => p.status.toLowerCase().replace(" ", "") === filterStatus,
        );

  const stats = {
    outOfStock: mockLowStockProducts.filter((p) => p.status === "Out of Stock")
      .length,
    critical: mockLowStockProducts.filter((p) => p.status === "Critical")
      .length,
    low: mockLowStockProducts.filter((p) => p.status === "Low").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Low Stock Report
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor products that need reordering
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.outOfStock}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Critical Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.critical}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.low}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-[#0F5C47] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("outofstock")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "outofstock"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Out of Stock
            </button>
            <button
              onClick={() => setFilterStatus("critical")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "critical"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilterStatus("low")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "low"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Low Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("barcode")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("category")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Current Stock
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Reorder Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("status")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {product.scientificName}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                    {product.barcode}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm font-semibold ${
                        product.currentStock === 0
                          ? "text-red-600"
                          : product.currentStock < product.reorderLevel / 2
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {product.currentStock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {product.reorderLevel}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        product.status === "Out of Stock"
                          ? "bg-red-100 text-red-700"
                          : product.status === "Critical"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewDetails(product)}
                      className="flex items-center gap-1 text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium ml-auto"
                    >
                      <Eye className="w-4 h-4" />
                      {t("view")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
