/**
 * Sync pull — fetches records updated on the server since the last pull
 * and merges them into the local SQLite database.
 *
 * Call on app startup and on reconnect (after runSync completes).
 * Safe to call concurrently — a concurrent run is a no-op.
 */

import { get } from "@/shared/api/request";
import { TENANT_API } from "@/shared/utils/constants";
import { medicineSnapshotRepo } from "@/desktop/offline/repositories";
import type { MedicineSnapshot } from "@/desktop/offline/types";

const LAST_SYNC_KEY = "sync-pull-last-at";

export interface SyncPullRecord {
  type: "medicine" | "cosmetic";
  id: string;
  serverId?: string;
  name: string;
  barcode?: string;
  price: number;
  stockQuantity: number;
  category?: string;
  isAvailable: boolean;
  updatedAt: string;
}

export interface SyncPullResponse {
  inventory?: SyncPullRecord[];
  batches?: unknown[]; // future: batch updates
  catalogItems?: unknown[]; // future: catalog updates
  pulledAt: string;
}

let _pulling = false;

/** ISO timestamp of the last successful pull (persisted in localStorage). */
function getLastSyncAt(): string {
  return localStorage.getItem(LAST_SYNC_KEY) ?? new Date(0).toISOString();
}

function setLastSyncAt(iso: string) {
  localStorage.setItem(LAST_SYNC_KEY, iso);
}

export async function runSyncPull(branchId: string): Promise<void> {
  if (_pulling) return;
  _pulling = true;

  try {
    const updatedSince = getLastSyncAt();
    const data = await get<SyncPullResponse>(TENANT_API.sync.pull, {
      params: { updatedSince, branchId },
    });

    // Merge inventory / medicine snapshots
    if (data.inventory?.length) {
      for (const record of data.inventory) {
        const snapshot: MedicineSnapshot = {
          id: record.id,
          serverId: record.serverId ?? record.id,
          name: record.name,
          barcode: record.barcode ?? null,
          price: record.price,
          stockQuantity: record.stockQuantity,
          category: record.category ?? null,
          type: record.type as "medicine" | "cosmetic",
          isAvailable: record.isAvailable,
          updatedAt: record.updatedAt,
          syncedAt: new Date().toISOString(),
        };
        await medicineSnapshotRepo.upsert(snapshot);
      }
    }

    // Store the server-reported pull timestamp
    if (data.pulledAt) {
      setLastSyncAt(data.pulledAt);
    }
  } finally {
    _pulling = false;
  }
}
