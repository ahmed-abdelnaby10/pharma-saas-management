export { isDesktop, isWeb, platform } from './platform';
export type { Platform } from './platform';

// Offline layer — desktop only. Guard all calls with isDesktop().
export {
  useConnectivity,
  useOfflineSync,
  useOfflineStatus,
  useSyncStatus,
  registerSyncHandler,
  runSync,
  getSyncState,
  onSyncStateChange,
  syncQueueRepo,
  medicineSnapshotRepo,
  pendingSaleRepo,
} from './offline';
export type {
  SyncHandler,
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
} from './offline';
