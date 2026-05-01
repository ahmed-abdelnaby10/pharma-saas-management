import { useState, useEffect } from 'react';
import type { OrchestratorState, OrchestratorSyncStatus } from '../types';

type Listener = (state: OrchestratorState) => void;

const listeners = new Set<Listener>();

let _state: OrchestratorState = {
  status: 'idle',
  pendingCount: 0,
  lastSyncAt: null,
  lastError: null,
};

export function getSyncState(): OrchestratorState {
  return _state;
}

export function updateSyncState(patch: Partial<OrchestratorState>): void {
  _state = { ..._state, ...patch };
  listeners.forEach((fn) => {
    try { fn(_state); } catch { /* never crash the caller */ }
  });
}

export function onSyncStateChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setStatus(status: OrchestratorSyncStatus): void {
  updateSyncState({ status });
}

/**
 * React hook — subscribes to orchestrator state changes.
 * Read-only: does NOT trigger sync. Safe to mount in any component.
 * Use useOfflineSync (offline/index.ts) at the app root for the sync trigger.
 */
export function useSyncStatus(): OrchestratorState {
  const [state, setState] = useState<OrchestratorState>(getSyncState);
  useEffect(() => onSyncStateChange(setState), []);
  return state;
}
