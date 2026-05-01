# Offline Architecture — Desktop App

The pharmacy desktop app is **online-first but offline-resilient**. When internet is lost, critical POS workflows continue using local SQLite data. When the connection returns, pending operations are synced automatically.

The web app is **not affected** — it keeps its normal online-only behavior.

---

## Layer Map

```
src/desktop/offline/
  types/
    index.ts              — all shared offline types (SyncQueueItem, MedicineSnapshot, …)
  db/
    schema.ts             — CREATE TABLE SQL + initSchema()
    index.ts              — getDb() lazy SQLite singleton
  repositories/
    base.ts               — abstract BaseRepository
    sync-queue.repository.ts      — outbox CRUD
    medicine-snapshot.repository.ts — product catalog cache
    pending-sale.repository.ts    — offline sales store
    index.ts              — singleton repo instances
  sync/
    status.ts             — OrchestratorState pub-sub
    orchestrator.ts       — runSync(), registerSyncHandler()
    index.ts              — barrel
  connectivity/
    index.ts              — useConnectivity() hook
  index.ts                — barrel + useOfflineSync() hook
```

---

## SQLite Tables

### `sync_queue` — the outbox

Every offline write is appended here **before** it is sent to the server.

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | `crypto.randomUUID()` |
| `entity_type` | TEXT | `sale`, `sale_item`, `inventory_adjustment`, `cash_transaction` |
| `operation_type` | TEXT | `CREATE`, `UPDATE`, `DELETE` |
| `local_id` | TEXT | local entity ID |
| `server_id` | TEXT | populated after successful sync |
| `payload` | TEXT | JSON — full API request body |
| `status` | TEXT | `pending` → `syncing` → `synced` \| `failed_retry` \| `failed_permanent` |
| `retry_count` / `max_retries` | INTEGER | default max = 3 |
| `created_at` / `processed_at` | TEXT | ISO timestamps |
| `error_message` | TEXT | last error |

**Lifecycle of a sync_queue row:**

```
enqueue()           → status = 'pending'
runSync() picks up  → status = 'syncing'
  API success       → status = 'synced'      (row kept — audit trail)
  API error         → status = 'failed_retry' (if retryCount < maxRetries)
                    → status = 'failed_permanent' (if retries exhausted)
```

**What clears after sync:**
Only the active queue shrinks — `pending` / `syncing` rows become `synced`.
`synced` rows are **never automatically deleted**; they form an audit trail.
Use `syncQueueRepo.archiveSynced(olderThanIso)` for optional housekeeping.

### `medicine_snapshots` — product catalog cache

Populated during an online session from the server. Used for offline POS product lookup and barcode scan.

Retained permanently. Refreshed (full replace) each time the app goes online and fetches a fresh catalog. Never deleted on sync.

### `pending_sales` — offline POS transactions

Sales created while offline. Each row holds the full sale payload including items (JSON).

Status: `pending` → `syncing` → `synced` | `failed`.
Rows are **kept after sync** — they serve as the local sales history.

---

## Data Flow

### Online path (unchanged from today)

```
Feature → TanStack Query / Axios → Backend API → Response
```

### Offline write path (new — desktop only)

```
Feature calls local service
  → pendingSaleRepo.save(sale)         — persists to pending_sales
  → syncQueueRepo.enqueue(...)         — appends to outbox
  → UI shows "saved offline" indicator
```

### Reconnect sync path (new — desktop only)

```
navigator 'online' event fires
  → useOfflineSync detects offline→online transition
  → runSync() called
      → syncQueueRepo.getPending()
      → for each item: handler(item) → API call
          success → syncQueueRepo.markSynced(id, serverId)
          failure → syncQueueRepo.markFailed(id, message)
      → updateSyncState({ status, pendingCount, lastSyncAt })
```

---

## What is Stored Where

| Data | Storage | Cleared on sync? |
|------|---------|-----------------|
| Medicine / cosmetic catalog | `medicine_snapshots` (SQLite) | No — refreshed in place |
| Offline POS sales | `pending_sales` (SQLite) | No — kept as history |
| Sync outbox | `sync_queue` (SQLite) | No — status updated to `synced` |
| Auth tokens | Cookies + localStorage | No — managed by auth service |
| UI preferences (lang, theme) | localStorage | No |
| Server state cache | TanStack Query in-memory | On page reload |

---

## Connectivity Detection

```typescript
import { useConnectivity } from '@/desktop/offline';

const { isOnline } = useConnectivity();
```

Uses `navigator.onLine` + `window.addEventListener('online' | 'offline')`.
Works in the Tauri webview and in a regular browser.

---

## Wiring useOfflineSync into the App

Add a watcher component near the app root. It is a **no-op on web**.

```tsx
// src/app/components/OfflineSyncWatcher.tsx
import { useOfflineSync } from '@/desktop/offline';

export function OfflineSyncWatcher() {
  useOfflineSync(); // triggers sync on reconnect, desktop only
  return null;
}
```

```tsx
// src/app/App.tsx  — add inside AppProvider
<OfflineSyncWatcher />
```

---

## Registering a Sync Handler

Each feature that has offline writes registers a handler before the first sync.

```typescript
// src/features/client/pos/offline/pos-sync.ts
import { registerSyncHandler } from '@/desktop/offline';
import { post } from '@/shared/api/request';

registerSyncHandler('sale', async (item) => {
  const res = await post('/sales', item.payload);
  return { serverId: (res as any).id };
});
```

Call this at module load time (e.g. imported in the feature's index or the POS page).

---

## Offline Scope — What Is Ready vs What Comes Next

### Ready (this slice)

- SQLite database initialisation + schema
- Sync queue / outbox repository
- Medicine snapshot repository
- Pending sales repository
- Connectivity detection hook
- Reconnect-triggered sync orchestrator
- Handler registry for entity-specific sync logic

### Not yet offline-capable (future slices)

| Module | Status |
|--------|--------|
| POS sale creation | ✅ **Implemented** — service layer + sync handler wired |
| Inventory adjustment | handler to register + UI guard needed |
| Cash drawer transaction | handler to register + UI guard needed |
| Purchasing orders | online-only for now |
| Reports | online-only — read-only, use cached data |
| Admin / backoffice | web-only, always online |
| Conflict resolution | future — last-write-wins assumed for now |
| Background periodic sync | future — reconnect trigger is the MVP |

---

## Sync Status in UI

```typescript
import { getSyncState, onSyncStateChange } from '@/desktop/offline';

// Reactive:
const [syncState, setSyncState] = useState(getSyncState);
useEffect(() => onSyncStateChange(setSyncState), []);

// syncState.status: 'idle' | 'syncing' | 'success' | 'error'
// syncState.pendingCount: number of items still waiting
// syncState.lastSyncAt: ISO timestamp of last completed sync
// syncState.lastError: last error message if status === 'error'
```

---

## Offline POS Flow

### What is supported offline in v1

| POS action | Offline support | Notes |
|------------|-----------------|-------|
| Browse product grid | ✅ | Mock data; future: `medicine_snapshots` |
| Add / remove cart items | ✅ | Pure in-memory cart state |
| Apply discount (%) | ✅ | Calculated locally |
| Pay with cash | ✅ | Saved to SQLite + queued |
| Pay with card | ✅ | Saved to SQLite + queued (same as cash offline) |
| Customer name on sale | ✅ | Stored in `pending_sales.customer_name` |
| Print receipt | ❌ | Deferred — printer adapter not yet built |
| Real-time stock check | ❌ | Local stock display only; no conflict engine |
| Customer lookup (server) | ❌ | Online only |
| Returns / refunds | ❌ | Online only |
| Barcode scan (server verify) | ❌ | Local snapshot lookup only |

### Call chain

```
POSPage.handleCheckout(paymentMethod)
  → usePOSSale.submit(payload, isOnline)
    → pos.service.finalizeSale(payload, isOnline)
        if online  → finalizeOnline()  → stub / future POST /sales
        if offline + desktop → finalizeOffline()
            → pendingSaleRepo.save()       — writes to pending_sales
            → syncQueueRepo.enqueue()      — writes to sync_queue
```

### What gets written to SQLite (offline sale)

**`pending_sales` row:**
- Full sale: items (JSON), totals, payment method, customer name, branch, shift, user
- `status = 'pending'`

**`sync_queue` row:**
- `entity_type = 'sale'`, `operation_type = 'CREATE'`
- `payload` = full sale JSON (all fields needed for the backend API)
- `status = 'pending'`
- Both rows kept after sync; only status changes to `'synced'`

### What happens after reconnect

```
navigator 'online' fires
  → OfflineSyncWatcher (App.tsx) detects offline → online
  → runSync() called
    → syncQueueRepo.getPending() — finds pending sale entries
    → registerPOSSyncHandlers handler fires → POST /sales
        success → syncQueueRepo.markSynced(id, serverId)
        failure → syncQueueRepo.markFailed(id, error) → retry later
  → OfflineStatusBadge updates reactively via pub-sub
```

### Sync handler registration

`registerPOSSyncHandlers()` is called once on desktop in `POSPage` `useEffect`.
Move this to a feature-level bootstrap if the POS gains more offline operations.

### Files added in this slice

```
src/features/client/pos/
  types/index.ts              — PaymentMethod, LocalCartItem, SaleFinalizationPayload, SaleResult
  services/pos.service.ts     — platform-aware finalizeSale()
  hooks/usePOSSale.ts         — React hook wrapping the service
  offline/pos-sync-handler.ts — registerPOSSyncHandlers()
  components/OfflineStatusBadge.tsx — connectivity + sync status chip

src/app/components/
  OfflineSyncWatcher.tsx      — mounts useOfflineSync() once at app root
```

---

## Safety Notes

- SQLite is **never wiped** after sync. Only queue row statuses change.
- `failed_permanent` items require manual intervention or a future admin UI.
- The sync orchestrator is **re-entrant safe** — a second `runSync()` call while one is running is a no-op.
- Items with no registered handler are skipped (not failed) — they will be picked up once the handler is registered.
- Stock adjustments via `medicineSnapshotRepo.adjustStock()` use `MAX(0, quantity + delta)` to prevent negative stock locally.
