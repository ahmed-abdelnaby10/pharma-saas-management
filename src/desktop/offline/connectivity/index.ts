import { useEffect, useState } from 'react';
import type { ConnectivityState } from '../types';

function now(): string {
  return new Date().toISOString();
}

function initialState(): ConnectivityState {
  return {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastOnlineAt: null,
    lastOfflineAt: null,
  };
}

/**
 * Tracks real-time network connectivity using the browser online/offline events.
 * Works in both the Tauri webview and a regular browser.
 */
export function useConnectivity(): ConnectivityState {
  const [state, setState] = useState<ConnectivityState>(initialState);

  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true, lastOnlineAt: now() }));

    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false, lastOfflineAt: now() }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return state;
}
