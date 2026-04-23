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
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

interface Medicine {
  id: string;
  name: string;
  scientificName: string;
  tradeName: string;
  barcode: string;
  category: string;
  supplier: string;
  batch: string;
  expiry: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  prescriptionRequired: boolean;
}

const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol",
    scientificName: "Acetaminophen",
    tradeName: "Panadol",
    barcode: "8901234567890",
    category: "Analgesic",
    supplier: "PharmaCorp",
    batch: "BATCH001",
    expiry: "2026-12-31",
    purchasePrice: 5,
    sellingPrice: 10,
    stock: 150,
    reorderLevel: 50,
    prescriptionRequired: false,
  },
  {
    id: "2",
    name: "Amoxicillin",
    scientificName: "Amoxicillin",
    tradeName: "Amoxil",
    barcode: "8901234567891",
    category: "Antibiotic",
    supplier: "MedSupply Co",
    batch: "BATCH002",
    expiry: "2026-06-30",
    purchasePrice: 15,
    sellingPrice: 30,
    stock: 45,
    reorderLevel: 30,
    prescriptionRequired: true,
  },
  {
    id: "3",
    name: "Vitamin D3",
    scientificName: "Cholecalciferol",
    tradeName: "VitaD Plus",
    barcode: "8901234567892",
    category: "Supplement",
    supplier: "HealthCare Ltd",
    batch: "BATCH003",
    expiry: "2027-03-15",
    purchasePrice: 10,
    sellingPrice: 20,
    stock: 80,
    reorderLevel: 40,
    prescriptionRequired: false,
  },
  {
    id: "4",
    name: "Omeprazole",
    scientificName: "Omeprazole",
    tradeName: "Losec",
    barcode: "8901234567893",
    category: "Gastro",
    supplier: "PharmaCorp",
    batch: "BATCH004",
    expiry: "2026-09-20",
    purchasePrice: 12,
    sellingPrice: 25,
    stock: 25,
    reorderLevel: 30,
    prescriptionRequired: true,
  },
];

export function MedicinesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredMedicines = mockMedicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.barcode.includes(searchQuery),
  );

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "red" };
    if (stock <= reorderLevel) return { label: "Low Stock", color: "orange" };
    return { label: "In Stock", color: "green" };
  };

  const isNearExpiry = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("medicines")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your medicine inventory
          </p>
        </div>
        <button
          onClick={() => navigate("/app/medicines/add")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("addMedicine")}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Medicines</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {mockMedicines.length}
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
                {mockMedicines.filter((m) => m.stock <= m.reorderLevel).length}
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
                {mockMedicines.filter((m) => isNearExpiry(m.expiry)).length}
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
                $
                {mockMedicines
                  .reduce((sum, m) => sum + m.stock * m.purchasePrice, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search") + " medicines..."}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("productName")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("scientificName")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("barcode")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("category")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("batch")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("expiryDate")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("stock")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("price")}
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
              {filteredMedicines.map((medicine) => {
                const stockStatus = getStockStatus(
                  medicine.stock,
                  medicine.reorderLevel,
                );
                const nearExpiry = isNearExpiry(medicine.expiry);

                return (
                  <tr
                    key={medicine.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {medicine.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {medicine.tradeName}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {medicine.scientificName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                      {medicine.barcode}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {medicine.category}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 font-mono whitespace-nowrap">
                      {medicine.batch}
                    </td>
                    <td className="py-3 px-4">
                      <div
                        className={`text-sm whitespace-nowrap ${nearExpiry ? "text-red-600 font-medium" : "text-gray-600"}`}
                      >
                        {medicine.expiry}
                        {nearExpiry && (
                          <AlertCircle className="w-3 h-3 inline ml-1" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium whitespace-nowrap">
                      {medicine.stock}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      ${medicine.sellingPrice}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          stockStatus.color === "green"
                            ? "bg-green-100 text-green-700"
                            : stockStatus.color === "orange"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/app/medicines/edit/${medicine.id}`)
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
