export interface TenantSettings {
  defaultCurrency: string;
  vatRate: number;
  lowStockAlerts: boolean;
  expiryAlerts: boolean;
  lowStockThresholdDays?: number;
  expiryAlertDays?: number;
  timezone?: string;
  language?: string;
  receiptHeader?: string;
  receiptFooter?: string;
}

export type UpdateSettingsPayload = Partial<TenantSettings>;
