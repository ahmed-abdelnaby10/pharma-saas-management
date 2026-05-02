/**
 * Shared formatting utilities.
 *
 * All functions accept an optional `locale` parameter (e.g. "en", "ar").
 * When omitted they fall back to the browser's preferred locale.
 */

// ─── Currency ─────────────────────────────────────────────────────────────────

/**
 * Format a numeric amount as a currency string.
 *
 * @example
 *   formatCurrency(1234.5, "en", "SAR") → "SAR 1,234.50"
 *   formatCurrency(1234.5, "ar", "SAR") → "١٬٢٣٤٫٥٠ ر.س."
 */
export function formatCurrency(
  amount: number,
  locale = "en",
  currency = "SAR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ─── Number ───────────────────────────────────────────────────────────────────

/**
 * Format a plain number with locale-aware digit grouping.
 *
 * @example
 *   formatNumber(1234567, "ar") → "١٬٢٣٤٬٥٦٧"
 */
export function formatNumber(value: number, locale = "en"): string {
  return new Intl.NumberFormat(locale).format(value);
}

// ─── Date ─────────────────────────────────────────────────────────────────────

/**
 * Format a date (ISO string, timestamp, or Date object) as a localised date string.
 *
 * @example
 *   formatDate("2026-05-01", "ar") → "١ مايو ٢٠٢٦"
 */
export function formatDate(
  value: string | number | Date,
  locale = "en",
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// ─── DateTime ─────────────────────────────────────────────────────────────────

/**
 * Format a date-time value as a localised date + time string.
 *
 * @example
 *   formatDateTime("2026-05-01T14:30:00Z", "en") → "May 1, 2026, 2:30 PM"
 */
export function formatDateTime(
  value: string | number | Date,
  locale = "en",
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// ─── Days until ──────────────────────────────────────────────────────────────

/**
 * Return the number of whole days remaining until `isoDate`.
 * Returns 0 if the date is in the past.
 */
export function daysUntil(isoDate: string): number {
  const diff = new Date(isoDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Relative time ────────────────────────────────────────────────────────────

/**
 * Format a date relative to now ("2 days ago", "in 3 hours").
 * Falls back gracefully in environments that don't support `Intl.RelativeTimeFormat`.
 */
export function formatRelativeTime(
  value: string | number | Date,
  locale = "en",
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "—";

  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1_000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
    if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
    if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
    return rtf.format(diffDay, "day");
  } catch {
    // Fallback for environments without Intl.RelativeTimeFormat
    return formatDate(date, locale);
  }
}
