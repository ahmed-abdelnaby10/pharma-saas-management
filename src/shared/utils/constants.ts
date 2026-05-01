export const ACCESS_TOKEN_KEY = "pharmacy-access-token";
export const REFRESH_TOKEN_KEY = "pharmacy-refresh-token";
export const ACCESS_TOKEN_EXPIRES_AT_KEY = "pharmacy-access-token-exp";
export const REFRESH_TOKEN_EXPIRES_AT_KEY = "pharmacy-refresh-token-exp";
export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const USER_KEY = "pharmacy-user";
/** Persisted admin-only branch filter for API query `branchId` (org-wide admin; not used for branch-locked roles). */
export const PAGE_SIZE = 12;

export const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

// ─── Tenant API endpoints (/api/tenant/*) ───────────────────────────────────
export const TENANT_API = {
  // Auth
  auth: {
    login: "/tenant/auth/login",
    refresh: "/tenant/auth/refresh",
    logout: "/tenant/auth/logout",
    me: "/tenant/auth/me",
    heartbeat: "/tenant/auth/heartbeat",
  },

  // Branches
  branches: {
    list: "/tenant/branches",
    create: "/tenant/branches",
    get: (id: string) => `/tenant/branches/${id}`,
    update: (id: string) => `/tenant/branches/${id}`,
    delete: (id: string) => `/tenant/branches/${id}`,
  },

  // Users
  users: {
    list:   "/tenant/users",
    create: "/tenant/users",
    get:    (id: string) => `/tenant/users/${id}`,
    update: (id: string) => `/tenant/users/${id}`,
    delete: (id: string) => `/tenant/users/${id}`,
    roles:  "/tenant/users/roles",
    // Per-user role assignment
    assignRole:  (userId: string) => `/tenant/users/${userId}/roles`,
    removeRole:  (userId: string, roleId: string) => `/tenant/users/${userId}/roles/${roleId}`,
  },

  // Roles & Permissions
  roles: {
    list:   "/tenant/roles",
    create: "/tenant/roles",
    get:    (id: string) => `/tenant/roles/${id}`,
    update: (id: string) => `/tenant/roles/${id}`,
    delete: (id: string) => `/tenant/roles/${id}`,
  },

  permissions: {
    list: "/tenant/permissions",
  },

  // Shifts
  shifts: {
    list: "/tenant/shifts",
    open: "/tenant/shifts/open",
    close: (id: string) => `/tenant/shifts/${id}/close`,
    current: "/tenant/shifts/current",
    get: (id: string) => `/tenant/shifts/${id}`,
  },

  // POS
  pos: {
    finalize: "/tenant/pos",
    history: "/tenant/pos/history",
    get: (id: string) => `/tenant/pos/${id}`,
    refund: (id: string) => `/tenant/pos/${id}/refund`,
  },

  // Inventory / Medicines
  inventory: {
    list: "/tenant/inventory",
    create: "/tenant/inventory",
    get: (id: string) => `/tenant/inventory/${id}`,
    update: (id: string) => `/tenant/inventory/${id}`,
    delete: (id: string) => `/tenant/inventory/${id}`,
    adjustStock: (id: string) => `/tenant/inventory/${id}/adjust`,
    batches:      (itemId: string)              => `/tenant/inventory/${itemId}/batches`,
    createBatch:  (itemId: string)              => `/tenant/inventory/${itemId}/batches`,
    updateBatch:  (itemId: string, batchId: string) => `/tenant/inventory/${itemId}/batches/${batchId}`,
    deleteBatch:  (itemId: string, batchId: string) => `/tenant/inventory/${itemId}/batches/${batchId}`,
    movements: "/tenant/inventory/movements",
    lowStock: "/tenant/inventory/low-stock",
    expiringSoon: "/tenant/inventory/expiring-soon",
  },

  // Cosmetics
  cosmetics: {
    list: "/tenant/cosmetics",
    create: "/tenant/cosmetics",
    get: (id: string) => `/tenant/cosmetics/${id}`,
    update: (id: string) => `/tenant/cosmetics/${id}`,
    delete: (id: string) => `/tenant/cosmetics/${id}`,
  },

  // Catalog (unified product search)
  catalog: {
    search: "/tenant/catalog/search",
    barcode: (code: string) => `/tenant/catalog/barcode/${code}`,
  },

  // Suppliers
  suppliers: {
    list: "/tenant/suppliers",
    create: "/tenant/suppliers",
    get: (id: string) => `/tenant/suppliers/${id}`,
    update: (id: string) => `/tenant/suppliers/${id}`,
    delete: (id: string) => `/tenant/suppliers/${id}`,
  },

  // Purchasing Orders
  purchasing: {
    list: "/tenant/purchasing",
    create: "/tenant/purchasing",
    get: (id: string) => `/tenant/purchasing/${id}`,
    update: (id: string) => `/tenant/purchasing/${id}`,
    receive: (id: string) => `/tenant/purchasing/${id}/receive`,
    cancel: (id: string) => `/tenant/purchasing/${id}/cancel`,
    approve: (id: string) => `/tenant/purchasing/${id}/approve`,
    status:     (id: string)                  => `/tenant/purchasing/${id}/status`,
    addItem:    (orderId: string)              => `/tenant/purchasing/${orderId}/items`,
    updateItem: (orderId: string, itemId: string) => `/tenant/purchasing/${orderId}/items/${itemId}`,
    deleteItem: (orderId: string, itemId: string) => `/tenant/purchasing/${orderId}/items/${itemId}`,
  },

  // Patients
  patients: {
    list: "/tenant/patients",
    create: "/tenant/patients",
    get: (id: string) => `/tenant/patients/${id}`,
    update: (id: string) => `/tenant/patients/${id}`,
    delete: (id: string) => `/tenant/patients/${id}`,
  },

  // Prescriptions
  prescriptions: {
    list: "/tenant/prescriptions",
    create: "/tenant/prescriptions",
    get: (id: string) => `/tenant/prescriptions/${id}`,
    update: (id: string) => `/tenant/prescriptions/${id}`,
    verify: (id: string) => `/tenant/prescriptions/${id}/verify`,
    dispense: (id: string) => `/tenant/prescriptions/${id}/dispense`,
  },

  // Cash drawer / transactions
  cashDrawer: {
    balance: "/tenant/cash-drawer/balance",
    transactions: "/tenant/cash-drawer/transactions",
    open: "/tenant/cash-drawer/open",
    close: "/tenant/cash-drawer/close",
    deposit: "/tenant/cash-drawer/deposit",
    withdraw: "/tenant/cash-drawer/withdraw",
  },

  // Reports
  reports: {
    sales: "/tenant/reports/sales",
    inventory: "/tenant/reports/inventory",
    financial: "/tenant/reports/financial",
    patients: "/tenant/reports/patients",
    prescriptions: "/tenant/reports/prescriptions",
    export: (type: string) => `/tenant/reports/${type}/export`,
  },

  // Dashboard / Analytics
  dashboard: {
    summary: "/tenant/dashboard/summary",
    topProducts: "/tenant/dashboard/top-products",
    recentSales: "/tenant/dashboard/recent-sales",
    analytics: "/tenant/dashboard/analytics",
  },

  // Analytics
  analytics: {
    salesTrend:       "/tenant/analytics/sales-trend",
    topProducts:      "/tenant/analytics/top-products",
    paymentBreakdown: "/tenant/analytics/payment-breakdown",
  },

  // Alerts
  alerts: {
    all: "/tenant/alerts",
    lowStock: "/tenant/alerts/low-stock",
    expiring: "/tenant/alerts/expiring",
    notify: "/tenant/alerts/notify",
    dismiss: (id: string) => `/tenant/alerts/${id}/dismiss`,
    dismissAll: "/tenant/alerts/dismiss-all",
    settings: "/tenant/alerts/settings",
  },

  // Notifications
  notifications: {
    list: "/tenant/notifications",
    unreadCount: "/tenant/notifications/unread-count",
    markRead: (id: string) => `/tenant/notifications/${id}/read`,
    markAllRead: "/tenant/notifications/read-all",
  },

  // OCR
  ocr: {
    documents: "/tenant/ocr/documents",
    get: (id: string) => `/tenant/ocr/documents/${id}`,
    process: (id: string) => `/tenant/ocr/documents/${id}/process`,
    review: (id: string) => `/tenant/ocr/documents/${id}/review`,
  },

  // Tenant-side support tickets
  support: {
    tickets: "/tenant/support/tickets",
    get: (id: string) => `/tenant/support/tickets/${id}`,
  },

  // Subscription (tenant-facing)
  subscription: {
    current: "/tenant/subscription",
    upgrade: "/tenant/subscription/upgrade",
    invoices: "/tenant/subscription/invoices",
  },

  // Settings
  settings: {
    get: "/tenant/settings",
    update: "/tenant/settings",
    branchSettings: (id: string) => `/tenant/settings/branches/${id}`,
  },

  // POS returns
  posReturns: {
    create: (saleId: string) => `/tenant/pos/${saleId}/returns`,
  },

  // Offline sync
  sync: {
    push: "/tenant/sync/push",
    pull: "/tenant/sync/pull",
  },
} as const;

// ─── Platform API endpoints (/api/platform/*) ───────────────────────────────
export const PLATFORM_API = {
  // Platform auth
  auth: {
    login: "/platform/auth/login",
    refresh: "/platform/auth/refresh",
    me: "/platform/auth/me",
  },

  // Tenants
  tenants: {
    list: "/platform/tenants",
    create: "/platform/tenants",
    get: (id: string) => `/platform/tenants/${id}`,
    update: (id: string) => `/platform/tenants/${id}`,
    suspend: (id: string) => `/platform/tenants/${id}/suspend`,
    activate: (id: string) => `/platform/tenants/${id}/activate`,
  },

  // Subscriptions (per tenant)
  subscriptions: {
    list: (tenantId: string) => `/platform/tenants/${tenantId}/subscriptions`,
    create: (tenantId: string) => `/platform/tenants/${tenantId}/subscriptions`,
    get: (tenantId: string, subId: string) =>
      `/platform/tenants/${tenantId}/subscriptions/${subId}`,
    update: (tenantId: string, subId: string) =>
      `/platform/tenants/${tenantId}/subscriptions/${subId}`,
    cancel: (tenantId: string, subId: string) =>
      `/platform/tenants/${tenantId}/subscriptions/${subId}/cancel`,
  },

  // Plans
  plans: {
    list: "/platform/plans",
    create: "/platform/plans",
    get: (id: string) => `/platform/plans/${id}`,
    update: (id: string) => `/platform/plans/${id}`,
    delete: (id: string) => `/platform/plans/${id}`,
  },

  // Invoices
  invoices: {
    list: "/platform/invoices",
    get: (id: string) => `/platform/invoices/${id}`,
    pay: (id: string) => `/platform/invoices/${id}/pay`,
  },

  // Platform metrics
  metrics: {
    overview: "/platform/metrics/overview",
    mrr: "/platform/metrics/mrr",
    churn: "/platform/metrics/churn",
  },

  // Audit log
  audit: {
    list: "/platform/audit",
  },

  // Support
  support: {
    tickets: "/platform/support/tickets",
    get: (id: string) => `/platform/support/tickets/${id}`,
    reply: (id: string) => `/platform/support/tickets/${id}/reply`,
    close: (id: string) => `/platform/support/tickets/${id}/close`,
  },

  // Feature overrides per tenant
  features: {
    list: (tenantId: string) => `/platform/tenants/${tenantId}/features`,
    update: (tenantId: string) => `/platform/tenants/${tenantId}/features`,
  },

  // Platform catalog (master product library)
  catalog: {
    list:   "/platform/catalog",
    create: "/platform/catalog",
    get:    (id: string) => `/platform/catalog/${id}`,
    update: (id: string) => `/platform/catalog/${id}`,
    delete: (id: string) => `/platform/catalog/${id}`,
  },

  // Usage stats per tenant
  usage: {
    get: (tenantId: string) => `/platform/tenants/${tenantId}/usage`,
  },
} as const;

// ─── Public API endpoints (/api/public/*) ────────────────────────────────────
export const PUBLIC_API = {
  plans: "/public/plans",
  downloads: "/public/downloads",
  signupRequests: "/public/signup-requests",
} as const;

// ─── Platform Admin: signup requests ─────────────────────────────────────────
// These are appended below into PLATFORM_API.signupRequests where possible,
// but we export them here so they can be used before PLATFORM_API is extended.
export const PLATFORM_SIGNUP_API = {
  list: "/platform/signup-requests",
  get: (id: string) => `/platform/signup-requests/${id}`,
  approve: (id: string) => `/platform/signup-requests/${id}/approve`,
  reject: (id: string) => `/platform/signup-requests/${id}/reject`,
} as const;

// ─── Legacy fallback (kept for backward-compat, prefer TENANT_API / PLATFORM_API) ──
export const API_ENDPOINTS = {
  refresh: TENANT_API.auth.refresh,
} as const;

// ─── React Query cache keys ──────────────────────────────────────────────────
export const QUERY_KEYS = {
  // Auth
  me: ["me"] as const,

  // Branches
  branches: {
    all: ["branches"] as const,
    list: (params?: object) => ["branches", "list", params] as const,
    detail: (id: string) => ["branches", id] as const,
  },

  // Users
  users: {
    all:    ["users"] as const,
    list:   (params?: object) => ["users", "list", params] as const,
    detail: (id: string) => ["users", id] as const,
    roles:  ["users", "roles"] as const,
  },

  // Roles
  roles: {
    all:    ["roles"] as const,
    list:   (params?: object) => ["roles", "list", params] as const,
    detail: (id: string) => ["roles", id] as const,
  },

  // Permissions
  permissions: {
    all: ["permissions"] as const,
  },

  // Shifts
  shifts: {
    all: ["shifts"] as const,
    list: (params?: object) => ["shifts", "list", params] as const,
    current: ["shifts", "current"] as const,
    detail: (id: string) => ["shifts", id] as const,
  },

  // POS
  pos: {
    all: ["pos"] as const,
    history: (params?: object) => ["pos", "history", params] as const,
    detail: (id: string) => ["pos", id] as const,
  },

  // Inventory
  inventory: {
    all: ["inventory"] as const,
    list: (params?: object) => ["inventory", "list", params] as const,
    detail: (id: string) => ["inventory", id] as const,
    batches: (id: string) => ["inventory", id, "batches"] as const,
    movements: (params?: object) => ["inventory", "movements", params] as const,
    lowStock: ["inventory", "low-stock"] as const,
    expiringSoon: ["inventory", "expiring-soon"] as const,
  },

  // Cosmetics
  cosmetics: {
    all: ["cosmetics"] as const,
    list: (params?: object) => ["cosmetics", "list", params] as const,
    detail: (id: string) => ["cosmetics", id] as const,
  },

  // Catalog
  catalog: {
    search: (q: string) => ["catalog", "search", q] as const,
    barcode: (code: string) => ["catalog", "barcode", code] as const,
  },

  // Suppliers
  suppliers: {
    all: ["suppliers"] as const,
    list: (params?: object) => ["suppliers", "list", params] as const,
    detail: (id: string) => ["suppliers", id] as const,
  },

  // Purchasing
  purchasing: {
    all: ["purchasing"] as const,
    list: (params?: object) => ["purchasing", "list", params] as const,
    detail: (id: string) => ["purchasing", id] as const,
  },

  // Patients
  patients: {
    all: ["patients"] as const,
    list: (params?: object) => ["patients", "list", params] as const,
    detail: (id: string) => ["patients", id] as const,
  },

  // Prescriptions
  prescriptions: {
    all: ["prescriptions"] as const,
    list: (params?: object) => ["prescriptions", "list", params] as const,
    detail: (id: string) => ["prescriptions", id] as const,
  },

  // Cash drawer
  cashDrawer: {
    balance: ["cash-drawer", "balance"] as const,
    transactions: (params?: object) =>
      ["cash-drawer", "transactions", params] as const,
  },

  // Reports
  reports: {
    sales: (params?: object) => ["reports", "sales", params] as const,
    inventory: (params?: object) => ["reports", "inventory", params] as const,
    financial: (params?: object) => ["reports", "financial", params] as const,
  },

  // Dashboard
  dashboard: {
    summary: ["dashboard", "summary"] as const,
    topProducts: ["dashboard", "top-products"] as const,
    recentSales: ["dashboard", "recent-sales"] as const,
    analytics: (params?: object) => ["dashboard", "analytics", params] as const,
  },

  // Analytics
  analytics: {
    salesTrend:       (params?: object) => ["analytics", "sales-trend", params] as const,
    topProducts:      (params?: object) => ["analytics", "top-products", params] as const,
    paymentBreakdown: (params?: object) => ["analytics", "payment-breakdown", params] as const,
  },

  // Alerts
  alerts: {
    all: ["alerts"] as const,
    list: (params?: object) => ["alerts", "list", params] as const,
    lowStock: (params?: object) => ["alerts", "low-stock", params] as const,
    expiring: (params?: object) => ["alerts", "expiring", params] as const,
    settings: ["alerts", "settings"] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: (params?: object) => ["notifications", "list", params] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },

  // OCR
  ocr: {
    all: ["ocr"] as const,
    list: (params?: object) => ["ocr", "documents", params] as const,
    detail: (id: string) => ["ocr", "documents", id] as const,
  },

  // Tenant support
  support: {
    all: ["support"] as const,
    list: (params?: object) => ["support", "tickets", params] as const,
    detail: (id: string) => ["support", "tickets", id] as const,
  },

  // Subscription
  subscription: {
    current: ["subscription", "current"] as const,
    invoices: ["subscription", "invoices"] as const,
  },

  // Settings
  settings: {
    all: ["settings"] as const,
    branch: (id: string) => ["settings", "branch", id] as const,
  },

  // Platform admin
  platform: {
    tenants: {
      all: ["platform", "tenants"] as const,
      list: (params?: object) => ["platform", "tenants", "list", params] as const,
      detail: (id: string) => ["platform", "tenants", id] as const,
    },
    subscriptions: {
      list: (tenantId: string) =>
        ["platform", "tenants", tenantId, "subscriptions"] as const,
      detail: (tenantId: string, subId: string) =>
        ["platform", "tenants", tenantId, "subscriptions", subId] as const,
    },
    plans: {
      all: ["platform", "plans"] as const,
      list: (params?: object) => ["platform", "plans", "list", params] as const,
      detail: (id: string) => ["platform", "plans", id] as const,
    },
    invoices: {
      all: ["platform", "invoices"] as const,
      list: (params?: object) => ["platform", "invoices", "list", params] as const,
      detail: (id: string) => ["platform", "invoices", id] as const,
    },
    metrics: {
      overview: ["platform", "metrics", "overview"] as const,
      mrr: ["platform", "metrics", "mrr"] as const,
      churn: ["platform", "metrics", "churn"] as const,
    },
    audit: (params?: object) => ["platform", "audit", params] as const,
    usage: (tenantId: string) => ["platform", "tenants", tenantId, "usage"] as const,
    features: (tenantId: string) => ["platform", "tenants", tenantId, "features"] as const,
    dashboard: ["platform", "dashboard"] as const,
    support: {
      all: ["platform", "support"] as const,
      list: (params?: object) => ["platform", "support", "tickets", params] as const,
      detail: (id: string) => ["platform", "support", "tickets", id] as const,
    },
    catalog: {
      all:    ["platform", "catalog"] as const,
      list:   (params?: object) => ["platform", "catalog", "list", params] as const,
      detail: (id: string) => ["platform", "catalog", id] as const,
    },
    signupRequests: {
      all:    ["platform", "signup-requests"] as const,
      list:   (params?: object) => ["platform", "signup-requests", "list", params] as const,
      detail: (id: string) => ["platform", "signup-requests", id] as const,
    },
  },

  // Public (unauthenticated)
  public: {
    plans:     ["public", "plans"] as const,
    downloads: ["public", "downloads"] as const,
  },
};

export function queryKeyHasLocaleScope(queryKey: unknown): boolean {
  if (!Array.isArray(queryKey)) return false;
  return queryKey.some(
    (part) =>
      part !== null &&
      typeof part === "object" &&
      "locale" in (part as Record<string, unknown>),
  );
}
