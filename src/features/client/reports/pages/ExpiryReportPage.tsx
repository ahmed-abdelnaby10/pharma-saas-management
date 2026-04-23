import React, { useState } from "react";
import { Calendar, AlertTriangle, Download, Eye, Filter } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { ProductDetailsModal } from "@/app/components/modals/ProductDetailsModal";

const mockExpiryProducts = [
  {
    id: "1",
    name: "Aspirin 100mg",
    scientificName: "Acetylsalicylic Acid",
    barcode: "6281001234580",
    category: "Analgesic",
    stock: 45,
    batch: "BATCH101",
    expiry: "2026-03-15",
    daysUntilExpiry: 4,
    supplier: "PharmaCorp",
    status: "Expired",
  },
  {
    id: "2",
    name: "Cough Syrup",
    scientificName: "Dextromethorphan",
    barcode: "6281001234581",
    category: "Respiratory",
    stock: 23,
    batch: "BATCH102",
    expiry: "2026-03-20",
    daysUntilExpiry: 9,
    supplier: "MedSupply Co",
    status: "Expiring Soon",
  },
  {
    id: "3",
    name: "Insulin Glargine",
    scientificName: "Insulin Glargine",
    barcode: "6281001234582",
    category: "Antidiabetic",
    stock: 12,
    batch: "BATCH103",
    expiry: "2026-04-10",
    daysUntilExpiry: 30,
    supplier: "HealthCare Ltd",
    status: "Near Expiry",
  },
  {
    id: "4",
    name: "Antibiotic Cream",
    scientificName: "Mupirocin",
    barcode: "6281001234583",
    category: "Derma",
    stock: 18,
    batch: "BATCH104",
    expiry: "2026-03-10",
    daysUntilExpiry: -1,
    supplier: "Global Meds",
    status: "Expired",
  },
  {
    id: "5",
    name: "Eye Drops",
    scientificName: "Timolol",
    barcode: "6281001234584",
    category: "Ophthalmology",
    stock: 34,
    batch: "BATCH105",
    expiry: "2026-03-25",
    daysUntilExpiry: 14,
    supplier: "Apex Pharma",
    status: "Expiring Soon",
  },
  {
    id: "6",
    name: "Vitamin C 1000mg",
    scientificName: "Ascorbic Acid",
    barcode: "6281001234585",
    category: "Supplement",
    stock: 56,
    batch: "BATCH106",
    expiry: "2026-05-01",
    daysUntilExpiry: 51,
    supplier: "PharmaCorp",
    status: "Near Expiry",
  },
];

export function ExpiryReportPage() {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
  };

  const filteredProducts =
    filterStatus === "all"
      ? mockExpiryProducts
      : mockExpiryProducts.filter(
          (p) => p.status.toLowerCase().replace(" ", "") === filterStatus,
        );

  const stats = {
    expired: mockExpiryProducts.filter((p) => p.status === "Expired").length,
    expiringSoon: mockExpiryProducts.filter((p) => p.status === "Expiring Soon")
      .length,
    nearExpiry: mockExpiryProducts.filter((p) => p.status === "Near Expiry")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Expiry Report
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor products approaching expiration
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
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expired Products</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expiring Soon (ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤14 days)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.expiringSoon}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Near Expiry (ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¤60 days)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.nearExpiry}
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
              onClick={() => setFilterStatus("expired")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "expired"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Expired
            </button>
            <button
              onClick={() => setFilterStatus("expiringsoon")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "expiringsoon"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Expiring Soon
            </button>
            <button
              onClick={() => setFilterStatus("nearexpiry")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "nearexpiry"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Near Expiry
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
                  {t("batch")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("stock")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Expiry Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Days Remaining
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
                  <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                    {product.batch}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {product.stock}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {product.expiry}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm font-semibold whitespace-nowrap ${
                        product.daysUntilExpiry < 0
                          ? "text-red-600"
                          : product.daysUntilExpiry <= 14
                            ? "text-orange-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {product.daysUntilExpiry < 0
                        ? "Expired"
                        : `${product.daysUntilExpiry} days`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        product.status === "Expired"
                          ? "bg-red-100 text-red-700"
                          : product.status === "Expiring Soon"
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
