export const ACCESS_TOKEN_KEY = "pharmacy-access-token";
export const REFRESH_TOKEN_KEY = "pharmacy-refresh-token";
export const ACCESS_TOKEN_EXPIRES_AT_KEY = "pharmacy-access-token-exp";
export const REFRESH_TOKEN_EXPIRES_AT_KEY = "pharmacy-refresh-token-exp";
export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const USER_KEY = "pharmacy-user";
export const SUPPORTED_LANGUAGES: readonly Language[] = ["en", "ar"];
export const DEFAULT_LANGUAGE: Language = "en";
/** Persisted admin-only branch filter for API query `branchId` (org-wide admin; not used for branch-locked roles). */
export const PAGE_SIZE = 12;

export const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

// ─── Tenant API endpoints (/api/api/v1/tenant/*) ───────────────────────────────────
export const TENANT_API = {
  // Auth
  auth: {
    login: "/api/v1/tenant/auth/login",
    refresh: "/api/v1/tenant/auth/refresh",
    logout: "/api/v1/tenant/auth/logout",
    me: "/api/v1/tenant/auth/me",
    heartbeat: "/api/v1/tenant/auth/heartbeat",
  },

  // Branches
  branches: {
    list: "/api/v1/tenant/branches",
    create: "/api/v1/tenant/branches",
    get: (id: string) => `/api/v1/tenant/branches/${id}`,
    update: (id: string) => `/api/v1/tenant/branches/${id}`,
    delete: (id: string) => `/api/v1/tenant/branches/${id}`,
  },

  // Users
  users: {
    list: "/api/v1/tenant/users",
    create: "/api/v1/tenant/users",
    get: (id: string) => `/api/v1/tenant/users/${id}`,
    update: (id: string) => `/api/v1/tenant/users/${id}`,
    delete: (id: string) => `/api/v1/tenant/users/${id}`,
    roles: "/api/v1/tenant/users/roles",
    // Per-user role assignment
    assignRole: (userId: string) => `/api/v1/tenant/users/${userId}/roles`,
    removeRole: (userId: string, roleId: string) =>
      `/api/v1/tenant/users/${userId}/roles/${roleId}`,
  },

  // Roles & Permissions
  roles: {
    list: "/api/v1/tenant/roles",
    create: "/api/v1/tenant/roles",
    get: (id: string) => `/api/v1/tenant/roles/${id}`,
    update: (id: string) => `/api/v1/tenant/roles/${id}`,
    delete: (id: string) => `/api/v1/tenant/roles/${id}`,
  },

  permissions: {
    list: "/api/v1/tenant/permissions",
  },

  // Shifts
  shifts: {
    list: "/api/v1/tenant/shifts",
    open: "/api/v1/tenant/shifts/open",
    close: (id: string) => `/api/v1/tenant/shifts/${id}/close`,
    current: "/api/v1/tenant/shifts/current",
    get: (id: string) => `/api/v1/tenant/shifts/${id}`,
  },

  // POS
  pos: {
    finalize: "/api/v1/tenant/pos",
    history: "/api/v1/tenant/pos/history",
    get: (id: string) => `/api/v1/tenant/pos/${id}`,
    refund: (id: string) => `/api/v1/tenant/pos/${id}/refund`,
  },

  // Inventory / Medicines
  inventory: {
    list: "/api/v1/tenant/inventory",
    create: "/api/v1/tenant/inventory",
    get: (id: string) => `/api/v1/tenant/inventory/${id}`,
    update: (id: string) => `/api/v1/tenant/inventory/${id}`,
    delete: (id: string) => `/api/v1/tenant/inventory/${id}`,
    adjustStock: (id: string) => `/api/v1/tenant/inventory/${id}/adjust`,
    batches: (itemId: string) => `/api/v1/tenant/inventory/${itemId}/batches`,
    createBatch: (itemId: string) =>
      `/api/v1/tenant/inventory/${itemId}/batches`,
    updateBatch: (itemId: string, batchId: string) =>
      `/api/v1/tenant/inventory/${itemId}/batches/${batchId}`,
    deleteBatch: (itemId: string, batchId: string) =>
      `/api/v1/tenant/inventory/${itemId}/batches/${batchId}`,
    movements: "/api/v1/tenant/inventory/movements",
    lowStock: "/api/v1/tenant/inventory/low-stock",
    expiringSoon: "/api/v1/tenant/inventory/expiring-soon",
  },

  // Cosmetics
  cosmetics: {
    list: "/api/v1/tenant/cosmetics",
    create: "/api/v1/tenant/cosmetics",
    get: (id: string) => `/api/v1/tenant/cosmetics/${id}`,
    update: (id: string) => `/api/v1/tenant/cosmetics/${id}`,
    delete: (id: string) => `/api/v1/tenant/cosmetics/${id}`,
  },

  // Catalog (unified product search)
  catalog: {
    search: "/api/v1/tenant/catalog/search",
    barcode: (code: string) => `/api/v1/tenant/catalog/barcode/${code}`,
  },

  // Suppliers
  suppliers: {
    list: "/api/v1/tenant/suppliers",
    create: "/api/v1/tenant/suppliers",
    get: (id: string) => `/api/v1/tenant/suppliers/${id}`,
    update: (id: string) => `/api/v1/tenant/suppliers/${id}`,
    delete: (id: string) => `/api/v1/tenant/suppliers/${id}`,
  },

  // Purchasing Orders
  purchasing: {
    list: "/api/v1/tenant/purchasing",
    create: "/api/v1/tenant/purchasing",
    get: (id: string) => `/api/v1/tenant/purchasing/${id}`,
    update: (id: string) => `/api/v1/tenant/purchasing/${id}`,
    receive: (id: string) => `/api/v1/tenant/purchasing/${id}/receive`,
    cancel: (id: string) => `/api/v1/tenant/purchasing/${id}/cancel`,
    approve: (id: string) => `/api/v1/tenant/purchasing/${id}/approve`,
    status: (id: string) => `/api/v1/tenant/purchasing/${id}/status`,
    addItem: (orderId: string) => `/api/v1/tenant/purchasing/${orderId}/items`,
    updateItem: (orderId: string, itemId: string) =>
      `/api/v1/tenant/purchasing/${orderId}/items/${itemId}`,
    deleteItem: (orderId: string, itemId: string) =>
      `/api/v1/tenant/purchasing/${orderId}/items/${itemId}`,
  },

  // Patients
  patients: {
    list: "/api/v1/tenant/patients",
    create: "/api/v1/tenant/patients",
    get: (id: string) => `/api/v1/tenant/patients/${id}`,
    update: (id: string) => `/api/v1/tenant/patients/${id}`,
    delete: (id: string) => `/api/v1/tenant/patients/${id}`,
  },

  // Prescriptions
  prescriptions: {
    list: "/api/v1/tenant/prescriptions",
    create: "/api/v1/tenant/prescriptions",
    get: (id: string) => `/api/v1/tenant/prescriptions/${id}`,
    update: (id: string) => `/api/v1/tenant/prescriptions/${id}`,
    verify: (id: string) => `/api/v1/tenant/prescriptions/${id}/verify`,
    dispense: (id: string) => `/api/v1/tenant/prescriptions/${id}/dispense`,
  },

  // Cash drawer / transactions
  cashDrawer: {
    balance: "/api/v1/tenant/cash-drawer/balance",
    transactions: "/api/v1/tenant/cash-drawer/transactions",
    open: "/api/v1/tenant/cash-drawer/open",
    close: "/api/v1/tenant/cash-drawer/close",
    deposit: "/api/v1/tenant/cash-drawer/deposit",
    withdraw: "/api/v1/tenant/cash-drawer/withdraw",
  },

  // Reports
  reports: {
    sales: "/api/v1/tenant/reports/sales",
    inventory: "/api/v1/tenant/reports/inventory",
    financial: "/api/v1/tenant/reports/financial",
    patients: "/api/v1/tenant/reports/patients",
    prescriptions: "/api/v1/tenant/reports/prescriptions",
    export: (type: string) => `/api/v1/tenant/reports/${type}/export`,
  },

  // Dashboard / Analytics
  dashboard: {
    summary: "/api/v1/tenant/dashboard/summary",
    topProducts: "/api/v1/tenant/dashboard/top-products",
    recentSales: "/api/v1/tenant/dashboard/recent-sales",
    analytics: "/api/v1/tenant/dashboard/analytics",
  },

  // Analytics
  analytics: {
    salesTrend: "/api/v1/tenant/analytics/sales-trend",
    topProducts: "/api/v1/tenant/analytics/top-products",
    paymentBreakdown: "/api/v1/tenant/analytics/payment-breakdown",
  },

  // Alerts
  alerts: {
    all: "/api/v1/tenant/alerts",
    lowStock: "/api/v1/tenant/alerts/low-stock",
    expiring: "/api/v1/tenant/alerts/expiring",
    notify: "/api/v1/tenant/alerts/notify",
    dismiss: (id: string) => `/api/v1/tenant/alerts/${id}/dismiss`,
    dismissAll: "/api/v1/tenant/alerts/dismiss-all",
    settings: "/api/v1/tenant/alerts/settings",
  },

  // Notifications
  notifications: {
    list: "/api/v1/tenant/notifications",
    unreadCount: "/api/v1/tenant/notifications/unread-count",
    markRead: (id: string) => `/api/v1/tenant/notifications/${id}/read`,
    markAllRead: "/api/v1/tenant/notifications/read-all",
  },

  // OCR
  ocr: {
    documents: "/api/v1/tenant/ocr/documents",
    get: (id: string) => `/api/v1/tenant/ocr/documents/${id}`,
    process: (id: string) => `/api/v1/tenant/ocr/documents/${id}/process`,
    review: (id: string) => `/api/v1/tenant/ocr/documents/${id}/review`,
  },

  // Tenant-side support tickets
  support: {
    tickets: "/api/v1/tenant/support/tickets",
    get: (id: string) => `/api/v1/tenant/support/tickets/${id}`,
  },

  // Subscription (tenant-facing)
  subscription: {
    current: "/api/v1/tenant/subscription",
    upgrade: "/api/v1/tenant/subscription/upgrade",
    invoices: "/api/v1/tenant/subscription/invoices",
  },

  // Settings
  settings: {
    get: "/api/v1/tenant/settings",
    update: "/api/v1/tenant/settings",
    branchSettings: (id: string) => `/api/v1/tenant/settings/branches/${id}`,
  },

  // POS returns
  posReturns: {
    create: (saleId: string) => `/api/v1/tenant/pos/${saleId}/returns`,
  },

  // Offline sync
  sync: {
    push: "/api/v1/tenant/sync/push",
    pull: "/api/v1/tenant/sync/pull",
  },
} as const;

// ─── Platform API endpoints (/api/platform/*) ───────────────────────────────
export const PLATFORM_API = {
  // Platform auth
  auth: {
    login: "/api/v1/platform/auth/login",
    refresh: "/api/v1/platform/auth/refresh",
    me: "/api/v1/platform/auth/me",
  },

  // Tenants
  tenants: {
    list: "/api/v1/platform/tenants",
    create: "/api/v1/platform/tenants",
    get: (id: string) => `/api/v1/platform/tenants/${id}`,
    update: (id: string) => `/api/v1/platform/tenants/${id}`,
    suspend: (id: string) => `/api/v1/platform/tenants/${id}/suspend`,
    activate: (id: string) => `/api/v1/platform/tenants/${id}/activate`,
  },

  // Subscriptions (per tenant)
  subscriptions: {
    list: (tenantId: string) =>
      `/api/v1/platform/tenants/${tenantId}/subscriptions`,
    create: (tenantId: string) =>
      `/api/v1/platform/tenants/${tenantId}/subscriptions`,
    get: (tenantId: string, subId: string) =>
      `/api/v1/platform/tenants/${tenantId}/subscriptions/${subId}`,
    update: (tenantId: string, subId: string) =>
      `/api/v1/platform/tenants/${tenantId}/subscriptions/${subId}`,
    cancel: (tenantId: string, subId: string) =>
      `/api/v1/platform/tenants/${tenantId}/subscriptions/${subId}/cancel`,
  },

  // Plans
  plans: {
    list: "/api/v1/platform/plans",
    create: "/api/v1/platform/plans",
    get: (id: string) => `/api/v1/platform/plans/${id}`,
    update: (id: string) => `/api/v1/platform/plans/${id}`,
    delete: (id: string) => `/api/v1/platform/plans/${id}`,
  },

  // Invoices
  invoices: {
    list: "/api/v1/platform/invoices",
    get: (id: string) => `/api/v1/platform/invoices/${id}`,
    create: "/api/v1/platform/invoices",
    issue: (id: string) => `/api/v1/platform/invoices/${id}/issue`,
    pay: (id: string) => `/api/v1/platform/invoices/${id}/pay`,
    markPaid: (id: string) => `/api/v1/platform/invoices/${id}/mark-paid`,
    void: (id: string) => `/api/v1/platform/invoices/${id}/void`,
  },

  // Platform metrics
  metrics: {
    overview: "/api/v1/platform/metrics/overview",
    mrr: "/api/v1/platform/metrics/mrr",
    churn: "/api/v1/platform/metrics/churn",
  },

  // Audit log
  audit: {
    list: "/api/v1/platform/audit",
  },

  // Platform dashboard
  dashboard: "/api/v1/platform/dashboard",

  // Support
  support: {
    tickets: "/api/v1/platform/support/tickets",
    get: (id: string) => `/api/v1/platform/support/tickets/${id}`,
    reply: (id: string) => `/api/v1/platform/support/tickets/${id}/reply`,
    close: (id: string) => `/api/v1/platform/support/tickets/${id}/close`,
    updateStatus: (id: string) =>
      `/api/v1/platform/support/tickets/${id}/status`,
    assign: (id: string) => `/api/v1/platform/support/tickets/${id}/assign`,
  },

  // Feature overrides per tenant
  features: {
    list: (tenantId: string) => `/api/v1/platform/tenants/${tenantId}/features`,
    update: (tenantId: string) =>
      `/api/v1/platform/tenants/${tenantId}/features`,
  },

  // Platform catalog (master product library)
  catalog: {
    list: "/api/v1/platform/catalog",
    create: "/api/v1/platform/catalog",
    get: (id: string) => `/api/v1/platform/catalog/${id}`,
    update: (id: string) => `/api/v1/platform/catalog/${id}`,
    delete: (id: string) => `/api/v1/platform/catalog/${id}`,
  },

  // Usage stats per tenant
  usage: {
    get: (tenantId: string) => `/api/v1/platform/tenants/${tenantId}/usage`,
  },
} as const;

// ─── Public API endpoints (/api/api/v1/public/*) ────────────────────────────────────
export const PUBLIC_API = {
  plans: "/api/v1/plans",
  downloads: "/api/v1/public/downloads",
  signupRequests: "/api/v1/public/signup-requests",
} as const;

// ─── Platform Admin: signup requests ─────────────────────────────────────────
// These are appended below into PLATFORM_API.signupRequests where possible,
// but we export them here so they can be used before PLATFORM_API is extended.
export const PLATFORM_SIGNUP_API = {
  list: "/api/v1/platform/signup-requests",
  get: (id: string) => `/api/v1/platform/signup-requests/${id}`,
  approve: (id: string) => `/api/v1/platform/signup-requests/${id}/approve`,
  reject: (id: string) => `/api/v1/platform/signup-requests/${id}/reject`,
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
    all: ["users"] as const,
    list: (params?: object) => ["users", "list", params] as const,
    detail: (id: string) => ["users", id] as const,
    roles: ["users", "roles"] as const,
  },

  // Roles
  roles: {
    all: ["roles"] as const,
    list: (params?: object) => ["roles", "list", params] as const,
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
    salesTrend: (params?: object) =>
      ["analytics", "sales-trend", params] as const,
    topProducts: (params?: object) =>
      ["analytics", "top-products", params] as const,
    paymentBreakdown: (params?: object) =>
      ["analytics", "payment-breakdown", params] as const,
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
      list: (params?: object) =>
        ["platform", "tenants", "list", params] as const,
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
      list: (params?: object) =>
        ["platform", "invoices", "list", params] as const,
      detail: (id: string) => ["platform", "invoices", id] as const,
    },
    metrics: {
      overview: ["platform", "metrics", "overview"] as const,
      mrr: ["platform", "metrics", "mrr"] as const,
      churn: ["platform", "metrics", "churn"] as const,
    },
    audit: (params?: object) => ["platform", "audit", params] as const,
    usage: (tenantId: string) =>
      ["platform", "tenants", tenantId, "usage"] as const,
    features: (tenantId: string) =>
      ["platform", "tenants", tenantId, "features"] as const,
    dashboard: ["platform", "dashboard"] as const,
    support: {
      all: ["platform", "support"] as const,
      list: (params?: object) =>
        ["platform", "support", "tickets", params] as const,
      detail: (id: string) => ["platform", "support", "tickets", id] as const,
    },
    catalog: {
      all: ["platform", "catalog"] as const,
      list: (params?: object) =>
        ["platform", "catalog", "list", params] as const,
      detail: (id: string) => ["platform", "catalog", id] as const,
    },
    signupRequests: {
      all: ["platform", "signup-requests"] as const,
      list: (params?: object) =>
        ["platform", "signup-requests", "list", params] as const,
      detail: (id: string) => ["platform", "signup-requests", id] as const,
    },
  },

  // Public (unauthenticated)
  public: {
    plans: (locale: Language) => ["public", "plans", { locale }] as const,
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
