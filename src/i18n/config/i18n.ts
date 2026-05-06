import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/shared/utils/constants";
import { getStoredLanguage } from "@/shared/utils/appSettings";

// Import translation files
import enCommon from "../locales/en/common.json";
import enAdminCatalog from "../locales/en/admin-catalog.json";
import enAdminDashboard from "../locales/en/admin-dashboard.json";
import enAdminFeatureOverrides from "../locales/en/admin-feature-overrides.json";
import enAdminInvoices from "../locales/en/admin-invoices.json";
import enAdminLayout from "../locales/en/admin-layout.json";
import enAdminLogs from "../locales/en/admin-logs.json";
import enAdminTenants from "../locales/en/admin-tenants.json";
import enAdminPlans from "../locales/en/admin-plans.json";
import enAdminSettings from "../locales/en/admin-settings.json";
import enAdminSubscriptions from "../locales/en/admin-subscriptions.json";
import enAdminSupport from "../locales/en/admin-support.json";
import enAdminSignupRequests from "../locales/en/admin-signup-requests.json";
import enAdminSystem from "../locales/en/admin-system.json";
import enAdminUsageLimits from "../locales/en/admin-usage-limits.json";
import enAuth from "../locales/en/auth.json";
import enContact from "../locales/en/contact.json";
import enDownload from "../locales/en/download.json";
import enFeaturesPage from "../locales/en/features-page.json";
import enHomePage from "../locales/en/home-page.json";
import enPricingPage from "../locales/en/pricing-page.json";

import arCommon from "../locales/ar/common.json";
import arAdminCatalog from "../locales/ar/admin-catalog.json";
import arAdminDashboard from "../locales/ar/admin-dashboard.json";
import arAdminFeatureOverrides from "../locales/ar/admin-feature-overrides.json";
import arAdminInvoices from "../locales/ar/admin-invoices.json";
import arAdminLayout from "../locales/ar/admin-layout.json";
import arAdminLogs from "../locales/ar/admin-logs.json";
import arAdminTenants from "../locales/ar/admin-tenants.json";
import arAdminPlans from "../locales/ar/admin-plans.json";
import arAdminSettings from "../locales/ar/admin-settings.json";
import arAdminSubscriptions from "../locales/ar/admin-subscriptions.json";
import arAdminSupport from "../locales/ar/admin-support.json";
import arAdminSignupRequests from "../locales/ar/admin-signup-requests.json";
import arAdminSystem from "../locales/ar/admin-system.json";
import arAdminUsageLimits from "../locales/ar/admin-usage-limits.json";
import arAuth from "../locales/ar/auth.json";
import arContact from "../locales/ar/contact.json";
import arDownload from "../locales/ar/download.json";
import arFeaturesPage from "../locales/ar/features-page.json";
import arHomePage from "../locales/ar/home-page.json";
import arPricingPage from "../locales/ar/pricing-page.json";

const resources = {
  en: {
    common: enCommon,
    adminCatalog: enAdminCatalog,
    adminDashboard: enAdminDashboard,
    adminFeatureOverrides: enAdminFeatureOverrides,
    adminInvoices: enAdminInvoices,
    adminLayout: enAdminLayout,
    adminLogs: enAdminLogs,
    adminTenants: enAdminTenants,
    adminPlans: enAdminPlans,
    adminSettings: enAdminSettings,
    adminSubscriptions: enAdminSubscriptions,
    adminSupport: enAdminSupport,
    adminSignupRequests: enAdminSignupRequests,
    adminSystem: enAdminSystem,
    adminUsageLimits: enAdminUsageLimits,
    auth: enAuth,
    contact: enContact,
    download: enDownload,
    featuresPage: enFeaturesPage,
    homePage: enHomePage,
    pricingPage: enPricingPage,
  },
  ar: {
    common: arCommon,
    adminCatalog: arAdminCatalog,
    adminDashboard: arAdminDashboard,
    adminFeatureOverrides: arAdminFeatureOverrides,
    adminInvoices: arAdminInvoices,
    adminLayout: arAdminLayout,
    adminLogs: arAdminLogs,
    adminTenants: arAdminTenants,
    adminPlans: arAdminPlans,
    adminSettings: arAdminSettings,
    adminSubscriptions: arAdminSubscriptions,
    adminSupport: arAdminSupport,
    adminSignupRequests: arAdminSignupRequests,
    adminSystem: arAdminSystem,
    adminUsageLimits: arAdminUsageLimits,
    auth: arAuth,
    contact: arContact,
    download: arDownload,
    featuresPage: arFeaturesPage,
    homePage: arHomePage,
    pricingPage: arPricingPage,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  ns: [
    "common",
    "adminCatalog",
    "adminDashboard",
    "adminFeatureOverrides",
    "adminInvoices",
    "adminLayout",
    "adminLogs",
    "adminTenants",
    "adminPlans",
    "adminSettings",
    "adminSubscriptions",
    "adminSupport",
    "adminSignupRequests",
    "adminSystem",
    "adminUsageLimits",
    "auth",
    "contact",
    "download",
    "featuresPage",
    "homePage",
    "pricingPage",
  ],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
