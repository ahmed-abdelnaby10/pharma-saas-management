import { isDesktop } from '@/desktop/platform';
import { pendingSaleRepo, syncQueueRepo } from '@/desktop/offline/repositories';
import type { SaleItem } from '@/desktop/offline/types';
import type { SaleFinalizationPayload, SaleResult, LocalCartItem } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSaleItems(items: LocalCartItem[]): SaleItem[] {
  return items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  }));
}

// ---------------------------------------------------------------------------
// Offline path — desktop only, no network
// ---------------------------------------------------------------------------

async function finalizeOffline(
  payload: SaleFinalizationPayload,
): Promise<SaleResult> {
  const saleItems = toSaleItems(payload.items);

  // Stable client-generated UUID — sent to server so duplicate sync uploads are idempotent
  const externalId      = crypto.randomUUID();
  const clientCreatedAt = new Date().toISOString();

  // 1. Persist the full sale to SQLite pending_sales
  const saved = await pendingSaleRepo.save({
    externalId,
    clientCreatedAt,
    branchId: payload.branchId,
    shiftId: payload.shiftId,
    userId: payload.userId,
    patientId: payload.patientId ?? null,
    prescriptionId: payload.prescriptionId ?? null,
    totalAmount: payload.total,
    discountAmount: payload.discountAmount,
    paymentMethod: payload.paymentMethod,
    items: saleItems,
    customerName: payload.customerName,
  });

  // 2. Enqueue for sync — full payload stored so the sync worker can replay it
  await syncQueueRepo.enqueue({
    entityType: 'sale',
    operationType: 'CREATE',
    localId: saved.id,
    payload: {
      externalId,
      clientCreatedAt,
      localId: saved.id,
      branchId: payload.branchId,
      shiftId: payload.shiftId,
      userId: payload.userId,
      patientId: payload.patientId ?? null,
      prescriptionId: payload.prescriptionId ?? null,
      subtotal: payload.subtotal,
      discountPercent: payload.discountPercent,
      discountAmount: payload.discountAmount,
      taxRate: payload.taxRate,
      tax: payload.tax,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      customerName: payload.customerName,
      items: saleItems,
      createdAt: saved.createdAt,
    },
  });

  return {
    localId: saved.id,
    serverId: null,
    isOffline: true,
    total: payload.total,
    paymentMethod: payload.paymentMethod,
    itemCount: payload.items.length,
    createdAt: saved.createdAt,
  };
}

// ---------------------------------------------------------------------------
// Online path — web always, desktop when connected
// ---------------------------------------------------------------------------

async function finalizeOnline(
  payload: SaleFinalizationPayload,
): Promise<SaleResult> {
  const { post } = await import('@/shared/api/request');
  const { TENANT_API } = await import('@/shared/utils/constants');

  const saleItems       = toSaleItems(payload.items);
  const externalId      = crypto.randomUUID();
  const clientCreatedAt = new Date().toISOString();

  const res = await post<{ id: string }>(TENANT_API.pos.finalize, {
    externalId,
    clientCreatedAt,
    branchId: payload.branchId,
    shiftId: payload.shiftId,
    userId: payload.userId,
    subtotal: payload.subtotal,
    discountPercent: payload.discountPercent,
    discountAmount: payload.discountAmount,
    taxRate: payload.taxRate,
    tax: payload.tax,
    total: payload.total,
    paymentMethod: payload.paymentMethod,
    customerName: payload.customerName,
    ...(payload.patientId      != null && { patientId:      payload.patientId }),
    ...(payload.prescriptionId != null && { prescriptionId: payload.prescriptionId }),
    items: saleItems,
  });

  const serverId = (res as Record<string, unknown>)?.id as string;
  const now = new Date().toISOString();

  return {
    localId: serverId ?? crypto.randomUUID(),
    serverId: serverId ?? null,
    isOffline: false,
    total: payload.total,
    paymentMethod: payload.paymentMethod,
    itemCount: payload.items.length,
    createdAt: now,
  };
}

// ---------------------------------------------------------------------------
// Public entry point — called by usePOSSale hook
// ---------------------------------------------------------------------------

/**
 * Finalize a POS sale.
 *
 * Routing logic:
 *   offline + desktop  → SQLite write + sync queue enqueue
 *   online (any)       → API call (stubbed until backend is ready)
 *
 * The caller supplies `isOnline` so the service does not need to read
 * navigator.onLine itself — the hook/page owns that state.
 */
export async function finalizeSale(
  payload: SaleFinalizationPayload,
  isOnline: boolean,
): Promise<SaleResult> {
  if (!isOnline && isDesktop()) {
    return finalizeOffline(payload);
  }
  return finalizeOnline(payload);
}
