import React, { useState } from "react";
import {
  Search,
  Barcode,
  Pill,
  Sparkles,
  X,
  Plus,
  Minus,
  Trash2,
  User,
  DollarSign,
  CreditCard,
  Printer,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useApp } from "@/app/contexts/AppContext";
import { CustomerFormModal } from "@/app/components/modals";
import * as Tabs from "@radix-ui/react-tabs";

interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  type: "medicine" | "cosmetic";
}

interface CartItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    barcode: "8901234567890",
    price: 10,
    stock: 150,
    type: "medicine",
  },
  {
    id: "2",
    name: "Vitamin D3",
    barcode: "8901234567891",
    price: 20,
    stock: 80,
    type: "medicine",
  },
  {
    id: "3",
    name: "Antibiotic Syrup",
    barcode: "8901234567892",
    price: 30,
    stock: 45,
    type: "medicine",
  },
  {
    id: "4",
    name: "Moisturizer Cream",
    barcode: "8901234567893",
    price: 25,
    stock: 120,
    type: "cosmetic",
  },
  {
    id: "5",
    name: "Sunscreen SPF 50",
    barcode: "8901234567894",
    price: 35,
    stock: 90,
    type: "cosmetic",
  },
  {
    id: "6",
    name: "Lip Balm",
    barcode: "8901234567895",
    price: 8,
    stock: 200,
    type: "cosmetic",
  },
];

export function POSPage() {
  const { t } = useLanguage();
  const { currentShift } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "medicine" | "cosmetic">(
    "all",
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    const matchesTab = activeTab === "all" || product.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.15; // 15% VAT
  const total = subtotal - discountAmount + tax;

  const completeSale = () => {
    // Handle sale completion
    alert("Sale completed successfully!");
    clearCart();
  };

  const handleCustomerSave = (customer: any) => {
    console.log("Customer added:", customer);
    alert(`Customer ${customer.name} added to order`);
    setIsCustomerFormOpen(false);
  };

  return (
    <div className="h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{t("pos")}</h1>
            <p className="text-sm text-gray-600 mt-1">Point of Sale System</p>
          </div>
          {currentShift?.isOpen ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">
                Shift Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-red-700">
                No Active Shift
              </span>
            </div>
          )}
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
            onValueChange={(value: any) => setActiveTab(value)}
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
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#0F5C47] hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          product.type === "medicine"
                            ? "bg-blue-50"
                            : "bg-pink-50"
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
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      {product.barcode}
                    </p>
                    <p className="text-lg font-semibold text-[#0F5C47]">
                      ${product.price}
                    </p>
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
                <p className="text-xs text-gray-400 mt-1">
                  Scan or select products to add
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        ${item.price} each
                      </p>
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
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
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

          {/* Customer Info */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <button
              onClick={() => setIsCustomerFormOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg hover:border-[#0F5C47] hover:bg-[#0F5C47]/5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{t("addCustomer")}</span>
            </button>
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("discount")} (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) =>
                setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))
              }
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
                <span className="text-gray-600">
                  {t("discount")} ({discount}%)
                </span>
                <span className="font-medium text-red-600">
                  -${discountAmount.toFixed(2)}
                </span>
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
              onClick={completeSale}
              disabled={cart.length === 0}
              className="w-full bg-[#0F5C47] text-white py-3 rounded-lg hover:bg-[#0d4a39] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              {t("cash")}
            </button>
            <button
              onClick={completeSale}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {t("card")}
            </button>
            <button
              disabled={cart.length === 0}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isCustomerFormOpen}
        onClose={() => setIsCustomerFormOpen(false)}
        onSave={handleCustomerSave}
      />
    </div>
  );
}
