/**
 * Platform detection.
 *
 * Tauri injects __TAURI_INTERNALS__ into the window at startup.
 * This is the only reliable way to distinguish desktop from web at runtime.
 */

export const isDesktop = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const isWeb = (): boolean => !isDesktop();

export type Platform = 'desktop' | 'web';

export const platform: Platform = isDesktop() ? 'desktop' : 'web';
