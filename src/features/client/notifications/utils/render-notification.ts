import type { TFunction } from "i18next";
import type { Notification } from "@/features/client/notifications/api/notifications.types";

export interface RenderedNotification {
  title: string;
  body: string;
}

/**
 * Derive a localised title + body from a notification's type and metadata.
 * Never falls back to the raw `title`/`message` fields stored in the DB —
 * those may be in a different locale.
 *
 * @param n       The notification object
 * @param t       i18next t function, scoped to the "pharmacy" namespace
 * @param locale  Active locale ("en" | "ar") — used for pluralisation helpers
 */
export function renderNotification(
  n: Notification,
  t: TFunction<"pharmacy">,
  locale: string,
): RenderedNotification {
  const d = n.data ?? {};

  switch (n.type) {
    case "LOW_STOCK":
      return {
        title: t("notifications.low_stock_title"),
        body: t("notifications.low_stock_body", {
          medicineName: d.medicineName ?? "—",
          quantity: d.quantityOnHand ?? 0,
        }),
      };

    case "EXPIRY_ALERT": {
      const days = d.daysUntilExpiry ?? 0;
      const bodyKey =
        days === 1
          ? "notifications.expiry_alert_body"
          : "notifications.expiry_alert_body_plural";
      return {
        title: t("notifications.expiry_alert_title"),
        body: t(bodyKey, {
          medicineName: d.medicineName ?? "—",
          batchNumber: d.batchNumber ?? "—",
          days,
        }),
      };
    }

    case "OCR_COMPLETED": {
      const confidence = Math.round((d.confidence ?? 1) * 100);
      return {
        title: t("notifications.ocr_completed_title"),
        body: t("notifications.ocr_completed_body", { confidence }),
      };
    }

    case "OCR_FAILED":
      return {
        title: t("notifications.ocr_failed_title"),
        body: t("notifications.ocr_failed_body", {
          error: d.errorMessage ?? "Unknown error",
        }),
      };

    case "SHIFT_OPENED":
      return {
        title: t("notifications.shift_opened_title"),
        body: t("notifications.shift_opened_body"),
      };

    case "SHIFT_CLOSED":
      return {
        title: t("notifications.shift_closed_title"),
        body: t("notifications.shift_closed_body"),
      };

    case "PURCHASE_ORDER_RECEIVED":
    case "PURCHASE_ORDER_APPROVED":
      return {
        title: t("notifications.purchase_order_received_title"),
        body: t("notifications.purchase_order_received_body", {
          id: d.purchaseOrderId ?? "—",
        }),
      };

    default:
      return {
        title: t("notifications.general_title"),
        body: t("notifications.general_body"),
      };
  }
}
