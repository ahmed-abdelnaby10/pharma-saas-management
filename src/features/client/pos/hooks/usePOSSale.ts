import { useState, useCallback } from 'react';
import { finalizeSale } from '../services/pos.service';
import type { SaleFinalizationPayload, SaleResult } from '../types';

interface UsePOSSaleReturn {
  submit: (payload: SaleFinalizationPayload, isOnline: boolean) => Promise<SaleResult | null>;
  isSubmitting: boolean;
  lastResult: SaleResult | null;
  error: string | null;
  clearResult: () => void;
}

/**
 * React hook that wraps the POS service finalizeSale call.
 * Manages loading, result, and error state for the page.
 */
export function usePOSSale(): UsePOSSaleReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<SaleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (
      payload: SaleFinalizationPayload,
      isOnline: boolean,
    ): Promise<SaleResult | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await finalizeSale(payload, isOnline);
        setLastResult(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Sale failed. Please try again.';
        setError(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const clearResult = useCallback(() => {
    setLastResult(null);
    setError(null);
  }, []);

  return { submit, isSubmitting, lastResult, error, clearResult };
}
