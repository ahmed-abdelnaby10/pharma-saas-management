import React, { useRef, useState } from "react";
import { Bell, Check, CheckCheck, ExternalLink, Loader2 } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useNavigate } from "react-router";
import {
  useNotificationsInfiniteQuery,
  useUnreadCountQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "@/features/client/notifications/api";
import type { Notification, NotificationType } from "@/features/client/notifications/api";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

// ─── Type-specific sub-text ───────────────────────────────────────────────────

function NotificationMeta({ n }: { n: Notification }) {
  if (!n.data) return null;

  switch (n.type) {
    case "EXPIRY_ALERT":
      return (
        <span className="text-xs text-orange-600">
          Expires in {n.data.daysUntilExpiry} day{n.data.daysUntilExpiry !== 1 ? "s" : ""}
          {n.data.batchNumber ? ` · Batch ${n.data.batchNumber}` : ""}
        </span>
      );
    case "OCR_COMPLETED": {
      const conf = n.data.confidence ?? 1;
      const color = conf >= 0.8 ? "text-green-600" : conf >= 0.6 ? "text-amber-600" : "text-red-600";
      return (
        <span className={`text-xs ${color}`}>
          Confidence {Math.round(conf * 100)}%
          {conf < 0.6 ? " · Low confidence — review required" : ""}
        </span>
      );
    }
    case "OCR_FAILED":
      return (
        <span className="text-xs text-red-600">
          {n.data.errorMessage ?? "Processing failed"}
        </span>
      );
    case "SHIFT_OPENED":
    case "SHIFT_CLOSED":
      return n.data.branchId ? (
        <span className="text-xs text-gray-500">Branch {n.data.branchId}</span>
      ) : null;
    default:
      return null;
  }
}

// ─── Nav target for clicking a notification ───────────────────────────────────

function notificationTarget(n: Notification): string | undefined {
  switch (n.type) {
    case "LOW_STOCK":
      return n.data?.medicineId ? `/app/inventory` : undefined;
    case "EXPIRY_ALERT":
      return `/app/inventory`;
    case "OCR_COMPLETED":
    case "OCR_FAILED":
      return n.data?.documentId ? `/app/ocr` : undefined;
    case "PURCHASE_ORDER_RECEIVED":
    case "PURCHASE_ORDER_APPROVED":
      return n.data?.purchaseOrderId
        ? `/app/purchasing`
        : undefined;
    default:
      return undefined;
  }
}

// ─── Single notification row ──────────────────────────────────────────────────

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const navigate = useNavigate();
  const target = notificationTarget(notification);

  const handleClick = () => {
    if (!notification.isRead) onRead(notification.id);
    if (target) navigate(target);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors ${
        !notification.isRead ? "bg-blue-50/40" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
            !notification.isRead ? "bg-blue-500" : "bg-transparent"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
          <NotificationMeta n={notification} />
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        {target && <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />}
      </div>
    </button>
  );
}

// ─── Bell + dropdown ──────────────────────────────────────────────────────────

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setOpen(false));

  const { data: unreadData } = useUnreadCountQuery();
  const unreadCount = unreadData?.count ?? 0;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNotificationsInfiniteQuery({ limit: 20 });

  const markRead = useMarkReadMutation();
  const markAllRead = useMarkAllReadMutation();

  const allNotifications = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading…
              </div>
            ) : allNotifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                heading="You're all caught up"
                subline="No new notifications"
                className="py-8"
              />
            ) : (
              allNotifications.map((n) => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  onRead={(id) => markRead.mutate(id)}
                />
              ))
            )}

            {/* Load more */}
            {hasNextPage && (
              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Loading more…
                    </>
                  ) : (
                    "Load more"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
