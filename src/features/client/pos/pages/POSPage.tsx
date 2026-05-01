import { useState, useEffect, useRef } from "react";
import {
  Search,
  Barcode,
  Pill,
  Sparkles,
  X,
  Plus,
  Minus,
  Trash2,
  UserCheck,
  DollarSign,
  CreditCard,
  Printer,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";

import { useLanguage } from "@/app/contexts/useLanguage";
import { useApp } from "@/app/contexts/useApp";
import { isDesktop } from "@/desktop/platform";
import { useConnectivity } from "@/desktop/offline/connectivity";
import { get } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";

import { usePOSSale } from "../hooks/usePOSSale";
import { registerPOSSyncHandlers } from "../offline/pos-sync-handler";
import { OfflineStatusBadge } from "../components/OfflineStatusBadge";
import type { LocalProduct, LocalCartItem, SaleFinalizationPayload, PaymentMethod } from "../types";
import type { Patient } from "@/features/client/patients/api/patients.types";
import type { Prescription } from "@/features/client/prescriptions/api/prescriptions.types";

// ---------------------------------------------------------------------------
// Mock product data — replaced by API / SQLite snapshot in a future slice
// ---------------------------------------------------------------------------

const mockProducts: LocalProduct[] = [
  { id: "1", name: "Paracetamol 500mg",  barcode: "8901234567890", price: 10, stock: 150, type: "medicine" },
  { id: "2", name: "Vitamin D3",          barcode: "8901234567891", price: 20, stock: 80,  type: "medicine" },
  { id: "3", name: "Antibiotic Syrup",    barcode: "8901234567892", price: 30, stock: 45,  type: "medicine" },
  { id: "4", name: "Moisturizer Cream",   barcode: "8901234567893", price: 25, stock: 120, type: "cosmetic" },
  { id: "5", name: "Sunscreen SPF 50",    barcode: "8901234567894", price: 35, stock: 90,  type: "cosmetic" },
  { id: "6", name: "Lip Balm",            barcode: "8901234567895", price: 8,  stock: 200, type: "cosmetic" },
];

// ---------------------------------------------------------------------------
// Cart item as rendered in the page (extends LocalProduct with quantity)
// ---------------------------------------------------------------------------

interface CartItem extends LocalProduct {
  quantity: number;
}

const TAX_RATE = 0.15; // 15% VAT

// ---------------------------------------------------------------------------
// PatientSearch — typeahead for linking a patient to the sale
// ---------------------------------------------------------------------------

interface PatientSearchProps {
  selectedPatient: Patient | null;
  onSelect: (patient: Patient | null) => void;
}

function PatientSearch({ selectedPatient, onSelect }: PatientSearchProps) {
  const [query, setQuery]           = useState("");
  const [open, setOpen]             = useState(false);
  const containerRef                = useRef<HTMLDivElement>(null);

  const { data: results = [], isFetching } = useQuery<Patient[]>({
    queryKey: QUERY_KEYS.patients.list({ search: query }),
    queryFn: () => get<Patient[]>(TENANT_API.patients.list, { params: { search: query, limit: 8 } }),
    enabled: open && query.trim().length >= 1,
    staleTime: 15_000,
  });

  // Close dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (selectedPatient) {
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex items-center gap-2 min-w-0">
          <UserCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-teal-800 truncate">{selectedPatient.name}</p>
            {selectedPatient.phone && (
              <p className="text-xs text-teal-600">{selectedPatient.phone}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => onSelect(null)}
          className="text-teal-500 hover:text-teal-700 flex-shrink-0 ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search patient by name / ID…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>
      {open && (query.trim().length >= 1) && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {results.length === 0 && !isFetching && (
            <p className="px-3 py-2 text-sm text-gray-400">No patients found</p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onMouseDown={() => { onSelect(p); setQuery(""); setOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{p.name}</p>
                {p.nationalId && <p className="text-xs text-gray-500">ID: {p.nationalId}</p>}
              </div>
              {p.phone && <span className="text-xs text-gray-400">{p.phone}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PrescriptionSelect — dropdown of PENDING prescriptions for selected patient
// ---------------------------------------------------------------------------

interface PrescriptionSelectProps {
  patientId: string | null;
  selectedPrescriptionId: string | null;
  onSelect: (id: string | null) => void;
}

function PrescriptionSelect({ patientId, selectedPrescriptionId, onSelect }: PrescriptionSelectProps) {
  const { data: prescriptions = [], isLoading } = useQuery<Prescription[]>({
    queryKey: QUERY_KEYS.prescriptions.list({ patientId: patientId ?? undefined, status: "PENDING" }),
    queryFn: () =>
      get<Prescription[]>(TENANT_API.prescriptions.list, {
        params: { patientId, status: "PENDING", limit: 50 },
      }),
    enabled: !!patientId,
    staleTime: 30_000,
  });

  if (!patientId) return null;

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1">
        <ChevronDown className="w-4 h-4 text-gray-400" />
        <label className="text-xs font-medium text-gray-600">Link Prescription (optional)</label>
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
          <Loader2 className="w-3 h-3 animate-spin" /> Loading…
        </div>
      ) : (
        <select
          value={selectedPrescriptionId ?? ""}
          onChange={(e) => onSelect(e.target.value || null)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
        >
          <option value="">— Walk-in / no prescription —</option>
          {prescriptions.map((rx) => (
            <option key={rx.id} value={rx.id}>
              {rx.id.slice(-8).toUpperCase()} · {rx.items?.length ?? 0} item{rx.items?.length !== 1 ? "s" : ""}
              {rx.notes ? ` · ${rx.notes.slice(0, 30)}` : ""}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function POSPage() {
  const { t } = useLanguage();
  const { currentShift, currentBranch, user } = useApp();

  // Connectivity — works on web (always online) and desktop
  const { isOnline } = useConnectivity();

  // Sale submission hook
  const { submit, isSubmitting } = usePOSSale();

  // Cart state
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeTab, setActiveTab]           = useState<"all" | "medicine" | "cosmetic">("all");
  const [cart, setCart]                     = useState<CartItem[]>([]);
  const [discount, setDiscount]             = useState(0);

  // Patient / prescription link
  const [selectedPatient, setSelectedPatient]           = useState<Patient | null>(null);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);

  // Register POS sync handlers once, on desktop only
  useEffect(() => {
    if (isDesktop()) {
      registerPOSSyncHandlers();
    }
  }, []);

  // Clear prescription when patient changes
  useEffect(() => {
    setSelectedPrescriptionId(null);
  }, [selectedPatient]);

  // ---------------------------------------------------------------------------
  // Cart helpers
  // ---------------------------------------------------------------------------

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    const matchesTab = activeTab === "all" || product.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const addToCart = (product: LocalProduct) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(cart.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setSelectedPatient(null);
    setSelectedPrescriptionId(null);
  };

  // ---------------------------------------------------------------------------
  // Totals
  // ---------------------------------------------------------------------------

  const subtotal       = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax            = (subtotal - discountAmount) * TAX_RATE;
  const total          = subtotal - discountAmount + tax;

  // ---------------------------------------------------------------------------
  // Checkout — routes through the platform-aware POS service
  // ---------------------------------------------------------------------------

  const handleCheckout = async (paymentMethod: PaymentMethod) => {
    if (cart.length === 0) return;

    const items: LocalCartItem[] = cart.map((item) => ({
      productId:   item.id,
      productName: item.name,
      barcode:     item.barcode,
      unitPrice:   item.price,
      quantity:    item.quantity,
      totalPrice:  item.price * item.quantity,
      type:        item.type,
    }));

    const payload: SaleFinalizationPayload = {
      items,
      subtotal,
      discountPercent: discount,
      discountAmount,
      taxRate: TAX_RATE,
      tax,
      total,
      paymentMethod,
      customerName: selectedPatient?.name ?? null,
      branchId: currentBranch?.id ?? "default-branch",
      shiftId:  currentShift?.id ?? null,
      userId:   user?.id ?? null,
      patientId:      selectedPatient?.id ?? null,
      prescriptionId: selectedPrescriptionId,
    };

    const result = await submit(payload, isOnline);

    if (result) {
      if (result.isOffline) {
        toast.success("Sale saved offline", {
          description: `${result.itemCount} item${result.itemCount !== 1 ? "s" : ""} · $${result.total.toFixed(2)} — will sync when online`,
          duration: 5000,
        });
      } else {
        toast.success("Sale completed", {
          description: `${result.itemCount} item${result.itemCount !== 1 ? "s" : ""} · $${result.total.toFixed(2)} · ${paymentMethod === "cash" ? "Cash" : "Card"}`,
          duration: 4000,
        });
      }
      clearCart();
    } else {
      toast.error("Sale failed", {
        description: "Please try again or check your connection.",
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{t("pos")}</h1>
            <p className="text-sm text-gray-600 mt-1">Point of Sale System</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline / sync status — desktop only */}
            <OfflineStatusBadge />

            {/* Shift status */}
            {currentShift?.isOpen ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-700">Shift Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium text-red-700">No Active Shift</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Products Section */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("scanBarcode")}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs.Root
            value={activeTab}
            onValueChange={(value: string) => setActiveTab(value as typeof activeTab)}
            className="flex-1 flex flex-col"
          >
            <Tabs.List className="flex gap-2 mb-4 border-b border-gray-200">
              <Tabs.Trigger
                value="all"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-[#0F5C47] data-[state=active]:border-b-2 data-[state=active]:border-[#0F5C47] transition-colors"
              >
                All Products
              </Tabs.Trigger>
              <Tabs.Trigger
                value="medicine"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-[#0F5C47] data-[state=active]:border-b-2 data-[state=active]:border-[#0F5C47] transition-colors flex items-center gap-2"
              >
                <Pill className="w-4 h-4" />
                {t("medicines")}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="cosmetic"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:text-[#0F5C47] data-[state=active]:border-b-2 data-[state=active]:border-[#0F5C47] transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t("cosmetics")}
              </Tabs.Trigger>
            </Tabs.List>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={isSubmitting}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#0F5C47] hover:shadow-md transition-all text-left disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          product.type === "medicine" ? "bg-blue-50" : "bg-pink-50"
                        }`}
                      >
                        {product.type === "medicine" ? (
                          <Pill className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-pink-600" />
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          product.stock < 50
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{product.barcode}</p>
                    <p className="text-lg font-semibold text-[#0F5C47]">${product.price}</p>
                  </button>
                ))}
              </div>
            </div>
          </Tabs.Root>
        </div>

        {/* Cart Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("cart")}</h3>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                {t("clearCart")}
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Scan or select products to add</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">${item.price} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Patient + Prescription */}
          <div className="border-t border-gray-200 pt-4 mb-4 space-y-3">
            <PatientSearch
              selectedPatient={selectedPatient}
              onSelect={setSelectedPatient}
            />
            <PrescriptionSelect
              patientId={selectedPatient?.id ?? null}
              selectedPrescriptionId={selectedPrescriptionId}
              onSelect={setSelectedPrescriptionId}
            />
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("discount")} (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
              min="0"
              max="100"
            />
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("discount")} ({discount}%)</span>
                <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t("tax")} (15%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span>{t("total")}</span>
              <span className="text-[#0F5C47]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleCheckout("cash")}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full bg-[#0F5C47] text-white py-3 rounded-lg hover:bg-[#0d4a39] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              {isSubmitting ? "Processing…" : t("cash")}
            </button>
            <button
              onClick={() => handleCheckout("card")}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {isSubmitting ? "Processing…" : t("card")}
            </button>
            <button
              disabled={cart.length === 0 || isSubmitting}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
