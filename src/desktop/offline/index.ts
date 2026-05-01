import { useEffect, useRef, useState } from 'react';
import { isDesktop } from '@/desktop/platform';
import { useConnectivity } from './connectivity';
import { runSync, runSyncPull, getSyncState, onSyncStateChange } from './sync';
import { useSyncStatus } from './sync/status';
import type { OrchestratorState } from './types';

// Re-export everything features may need from this layer
export { useConnectivity } from './connectivity';
export {
  registerSyncHandler,
  runSync,
  runSyncPull,
  getSyncState,
  onSyncStateChange,
} from './sync';
export { useSyncStatus } from './sync/status';
export { syncQueueRepo, medicineSnapshotRepo, pendingSaleRepo } from './repositories';
export type { SyncHandler } from './sync';
export type {
  SyncQueueItem,
  SyncEntityType,
  SyncOperationType,
  SyncStatus,
  MedicineSnapshot,
  PendingSale,
  SaleItem,
  PendingSaleStatus,
  ConnectivityState,
  SyncResult,
  OrchestratorState,
  OrchestratorSyncStatus,
} from './types';

// ---------------------------------------------------------------------------
// useOfflineStatus — read-only connectivity + sync state for UI components.
// Safe to mount in any component; does NOT trigger sync.
// ---------------------------------------------------------------------------

export function useOfflineStatus(): {
  isOnline: boolean;
  syncState: OrchestratorState;
} {
  const { isOnline } = useConnectivity();
  const syncState = useSyncStatus();
  return { isOnline, syncState };
}

// ---------------------------------------------------------------------------
// useOfflineSync — connectivity watcher + reconnect sync trigger.
// Mount ONCE at the app root (OfflineSyncWatcher in App.tsx).
// On web it is a no-op (sync guard inside the effect checks isDesktop()).
// ---------------------------------------------------------------------------

export function useOfflineSync(branchId?: string): {
  isOnline: boolean;
  syncState: OrchestratorState;
} {
  const connectivity = useConnectivity();
  const [syncState, setSyncState] = useState<OrchestratorState>(getSyncState);
  const wasOnlineRef = useRef(connectivity.isOnline);
  // Track whether we've done the initial pull this session
  const initialPullDoneRef = useRef(false);

  useEffect(() => onSyncStateChange(setSyncState), []);

  useEffect(() => {
    if (!isDesktop() || !branchId) return;

    const justReconnected = !wasOnlineRef.current && connectivity.isOnline;
    wasOnlineRef.current = connectivity.isOnline;

    if (connectivity.isOnline && (!initialPullDoneRef.current || justReconnected)) {
      initialPullDoneRef.current = true;
      // Push queued outbox first, then pull server updates
      runSync()
        .then(() => runSyncPull(branchId))
        .catch(console.error);
    }
  }, [connectivity.isOnline, branchId]);

  return { isOnline: connectivity.isOnline, syncState };
}
