import { useOfflineSync } from '@/desktop/offline';
import { useApp } from '@/app/contexts/useApp';

/**
 * Mounts the reconnect-triggered sync listener once at the app root.
 * Renders nothing — exists purely for its side-effect hooks.
 *
 * On web: the hook is a no-op (isDesktop() guard inside prevents sync calls).
 * On desktop: triggers runSync() (push) then runSyncPull() on startup and
 * whenever an offline → online transition occurs.
 */
export function OfflineSyncWatcher() {
  const { currentBranch } = useApp();
  useOfflineSync(currentBranch?.id);
  return null;
}
