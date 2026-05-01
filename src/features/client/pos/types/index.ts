// ---------------------------------------------------------------------------
// POS-specific domain types
// These live in the feature layer and do NOT depend on the desktop layer.
// The service layer maps between these and the offline storage types.
// ---------------------------------------------------------------------------

export type PaymentMethod = 'cash' | 'card';

/** A product as used inside the POS grid. */
export interface LocalProduct {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  type: 'medicine' | 'cosmetic';
}

/**
 * A cart item ready to be included in a sale payload.
 * Mapped from the page-level CartItem before calling the service.
 */
export interface LocalCartItem {
  productId: string;
  productName: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  type: 'medicine' | 'cosmetic';
}

/**
 * Everything the service needs to record and/or submit a sale.
 * Constructed in the page from cart state + app context.
 */
export interface SaleFinalizationPayload {
  items: LocalCartItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName: string | null;
  branchId: string;
  shiftId: string | null;
  userId: string | null;
  /** Linked patient — optional walk-in scenario leaves this null */
  patientId?: string | null;
  /** Linked prescription — backend auto-dispenses on successful sale */
  prescriptionId?: string | null;
}

/**
 * What the service returns after a successful finalization, whether the sale
 * went online or was saved locally for later sync.
 */
export interface SaleResult {
  /** Local UUID — always present. */
  localId: string;
  /** Server-assigned ID — null when saved offline; populated after sync. */
  serverId: string | null;
  /** True when the sale was saved to SQLite because the device was offline. */
  isOffline: boolean;
  total: number;
  paymentMethod: PaymentMethod;
  itemCount: number;
  createdAt: string;
}
