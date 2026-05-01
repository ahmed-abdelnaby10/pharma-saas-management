export type NotificationType =
  | "LOW_STOCK"
  | "EXPIRY_ALERT"
  | "OCR_COMPLETED"
  | "OCR_FAILED"
  | "SHIFT_OPENED"
  | "SHIFT_CLOSED"
  | "PURCHASE_ORDER_RECEIVED"
  | "PURCHASE_ORDER_APPROVED"
  | "GENERAL";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO timestamp — doubles as cursor
  data?: {
    // LOW_STOCK
    medicineId?: string;
    medicineName?: string;
    quantityOnHand?: number;
    reorderLevel?: number;
    // EXPIRY_ALERT
    batchId?: string;
    batchNumber?: string;
    daysUntilExpiry?: number;
    // OCR
    documentId?: string;
    confidence?: number;
    errorMessage?: string;
    // SHIFT
    shiftId?: string;
    branchId?: string;
    // PURCHASE_ORDER
    purchaseOrderId?: string;
  };
}

export interface NotificationListParams {
  limit?: number;
  /** ISO timestamp cursor (exclusive) */
  cursor?: string;
}

export interface NotificationListResponse {
  data: Notification[];
  nextCursor: string | null;
}

export interface UnreadCountResponse {
  count: number;
}
