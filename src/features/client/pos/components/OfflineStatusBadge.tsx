import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useOfflineStatus } from '@/desktop/offline';
import { isDesktop } from '@/desktop/platform';

/**
 * Connectivity and sync status chip for the POS header.
 * Only renders on desktop — returns null on web.
 */
export function OfflineStatusBadge() {
  // Always call the hook (Rules of Hooks), but render nothing on web.
  const { isOnline, syncState } = useOfflineStatus();

  if (!isDesktop()) return null;

  // Online + idle + nothing pending → green pill
  if (isOnline && syncState.status !== 'syncing' && syncState.pendingCount === 0) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
        <Wifi className="w-3.5 h-3.5 text-green-600" />
        <span className="text-xs font-medium text-green-700">Online</span>
      </div>
    );
  }

  // Actively syncing
  if (syncState.status === 'syncing') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
        <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
        <span className="text-xs font-medium text-blue-700">Syncing…</span>
      </div>
    );
  }

  // Offline — show queued count
  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-xs font-medium text-amber-700">
          Offline
          {syncState.pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded text-[10px] font-semibold">
              {syncState.pendingCount} queued
            </span>
          )}
        </span>
      </div>
    );
  }

  // Online but sync failed
  if (syncState.status === 'error') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
        <span className="text-xs font-medium text-red-700">
          Sync failed
          {syncState.pendingCount > 0 && ` — ${syncState.pendingCount} pending`}
        </span>
      </div>
    );
  }

  // Online + all synced recently
  if (syncState.status === 'success') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
        <span className="text-xs font-medium text-green-700">Synced</span>
      </div>
    );
  }

  // Online + pending items (waiting for next sync trigger)
  if (isOnline && syncState.pendingCount > 0) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
        <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-xs font-medium text-amber-700">
          {syncState.pendingCount} pending sync
        </span>
      </div>
    );
  }

  return null;
}
