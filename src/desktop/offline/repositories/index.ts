export { BaseRepository } from './base';
export { SyncQueueRepository } from './sync-queue.repository';
export { MedicineSnapshotRepository } from './medicine-snapshot.repository';
export { PendingSaleRepository } from './pending-sale.repository';

// ---------------------------------------------------------------------------
// Module-level singletons — import these instead of instantiating directly
// ---------------------------------------------------------------------------

import { SyncQueueRepository } from './sync-queue.repository';
import { MedicineSnapshotRepository } from './medicine-snapshot.repository';
import { PendingSaleRepository } from './pending-sale.repository';

export const syncQueueRepo = new SyncQueueRepository();
export const medicineSnapshotRepo = new MedicineSnapshotRepository();
export const pendingSaleRepo = new PendingSaleRepository();
