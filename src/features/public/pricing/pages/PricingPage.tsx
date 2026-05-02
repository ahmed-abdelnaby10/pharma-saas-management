import { Fragment, useState } from "react";
import { useNavigate } from "react-router";
import { Check, X, HelpCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

type BillingCycle = "monthly" | "yearly";

export function PricingPage() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const isRtl = direction === "rtl";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const plans = [
    {
      key: "trial",
      price: { monthly: 0, yearly: 0 },
      badgeColor: "bg-blue-100 text-blue-700",
      popular: false,
      features: [
        { key: "allFeatures", included: true },
        { key: "branches1", included: true },
        { key: "users2", included: true },
        { key: "basicPos", included: true },
        { key: "productManagement", included: true },
        { key: "basicReports", included: true },
        { key: "emailSupport", included: true },
        { key: "ocrImport", included: false },
        { key: "advancedReports", included: false },
        { key: "multiBranch", included: false },
      ],
    },
    {
      key: "basic",
      price: { monthly: 49, yearly: 470 },
      popular: false,
      features: [
        { key: "branches1", included: true },
        { key: "users3", included: true },
        { key: "fullPos", included: true },
        { key: "productManagement", included: true },
        { key: "inventoryTracking", included: true },
        { key: "batchExpiry", included: true },
        { key: "basicReports", included: true },
        { key: "shiftManagement", included: true },
        { key: "emailSupport", included: true },
        { key: "ocrImport", included: false },
        { key: "advancedReports", included: false },
        { key: "multiBranch", included: false },
      ],
    },
    {
      key: "professional",
      price: { monthly: 99, yearly: 950 },
      badgeColor: "bg-[#0F5C47] text-white",
      popular: true,
      features: [
        { key: "branches3", included: true },
        { key: "users10", included: true },
        { key: "fullPos", included: true },
        { key: "productManagement", included: true },
        { key: "inventoryTracking", included: true },
        { key: "batchExpiry", included: true },
        { key: "advancedReports", included: true },
        { key: "shiftManagement", included: true },
        { key: "ocrImport", included: true },
        { key: "stockMovements", included: true },
        { key: "priorityEmail", included: true },
        { key: "phoneSupport", included: false },
      ],
    },
    {
      key: "enterprise",
      price: { monthly: 199, yearly: 1910 },
      badgeColor: "bg-purple-100 text-purple-700",
      popular: false,
      features: [
        { key: "branchesUnlimited", included: true },
        { key: "usersUnlimited", included: true },
        { key: "fullPos", included: true },
        { key: "productManagement", included: true },
        { key: "inventoryTracking", included: true },
        { key: "batchExpiry", included: true },
        { key: "advancedReports", included: true },
        { key: "shiftManagement", included: true },
        { key: "ocrImport", included: true },
        { key: "stockMovements", included: true },
        { key: "prioritySupport", included: true },
        { key: "phoneChat", included: true },
        { key: "customIntegrations", included: true },
        { key: "accountManager", included: true },
      ],
    },
  ] as const;

  const comparisonCategories = [
    {
      key: "core",
      features: [
        { key: "pos", trial: true, basic: true, professional: true, enterprise: true },
        { key: "productManagement", trial: true, basic: true, professional: true, enterprise: true },
        { key: "medicineManagement", trial: true, basic: true, professional: true, enterprise: true },
        { key: "cosmeticsManagement", trial: true, basic: true, professional: true, enterprise: true },
        { key: "inventoryTracking", trial: true, basic: true, professional: true, enterprise: true },
        { key: "batchExpiry", trial: true, basic: true, professional: true, enterprise: true },
      ],
    },
    {
      key: "operations",
      features: [
        { key: "shiftManagement", trial: true, basic: true, professional: true, enterprise: true },
        { key: "purchasing", trial: true, basic: true, professional: true, enterprise: true },
        { key: "supplierManagement", trial: true, basic: true, professional: true, enterprise: true },
        { key: "representativeManagement", trial: false, basic: false, professional: true, enterprise: true },
        { key: "stockMovements", trial: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      key: "advanced",
      features: [
        { key: "ocrImport", trial: false, basic: false, professional: true, enterprise: true },
        { key: "advancedReports", trial: false, basic: false, professional: true, enterprise: true },
        { key: "branchComparison", trial: false, basic: false, professional: true, enterprise: true },
        { key: "productEnrichment", trial: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      key: "multiBranch",
      features: [
        { key: "branches", trial: "1", basic: "1", professional: "3", enterprise: "unlimited" },
        { key: "users", trial: "2", basic: "3", professional: "10", enterprise: "unlimited" },
        { key: "branchTransfer", trial: false, basic: false, professional: true, enterprise: true },
        { key: "centralizedInventory", trial: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      key: "support",
      features: [
        { key: "emailSupport", trial: true, basic: true, professional: true, enterprise: true },
        { key: "prioritySupport", trial: false, basic: false, professional: true, enterprise: true },
        { key: "phoneSupport", trial: false, basic: false, professional: false, enterprise: true },
        { key: "accountManager", trial: false, basic: false, professional: false, enterprise: true },
      ],
    },
  ] as const;

  const faqKeys = ["trial", "plans", "payments", "refunds"] as const;

  const renderComparisonValue = (
    value: boolean | string,
  ) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }

    return (
      <span className="text-sm text-gray-700">
        {value === "unlimited"
          ? t("pricingPage:comparison.values.unlimited")
          : value}
      </span>
    );
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("pricingPage:hero.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t("pricingPage:hero.subtitle")}
          </p>

          <div className="inline-flex items-center bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#0F5C47] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("pricingPage:billing.monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-[#0F5C47] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("pricingPage:billing.yearly")}
              <span className={`${isRtl ? "mr-2" : "ml-2"} text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded`}>
                {t("pricingPage:billing.save")}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`bg-white rounded-xl p-8 border-2 transition-all ${
                plan.popular
                  ? "border-[#0F5C47] shadow-xl scale-105"
                  : "border-gray-200 hover:border-gray-300"
              } ${textAlignClass}`}
            >
              {"badgeColor" in plan && t(`pricingPage:plans.${plan.key}.badge`) && (
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${plan.badgeColor}`}>
                    {t(`pricingPage:plans.${plan.key}.badge`)}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t(`pricingPage:plans.${plan.key}.name`)}
              </h3>
              <p className="text-gray-600 mb-6 h-12">
                {t(`pricingPage:plans.${plan.key}.description`)}
              </p>

              <div className="mb-6">
                <div className={`flex items-baseline gap-2 ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price[billingCycle]}
                  </span>
                  <span className="text-gray-600">
                    /{t(`pricingPage:billing.${billingCycle === "monthly" ? "month" : "year"}`)}
                  </span>
                </div>
                {billingCycle === "yearly" && plan.price.yearly > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {t("pricingPage:billing.billedAnnually", {
                      price: (plan.price.yearly / 12).toFixed(0),
                    })}
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  plan.key === "enterprise"
                    ? navigate("/contact")
                    : navigate("/signup")
                }
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
                  plan.popular
                    ? "bg-[#0F5C47] text-white hover:bg-[#0d4a39]"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {t(`pricingPage:plans.${plan.key}.cta`)}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.key}
                    className={`flex items-start gap-3 ${isRtl ? "flex-row-reverse text-right" : ""}`}
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                      {t(`pricingPage:plans.${plan.key}.features.${feature.key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className={`p-8 border-b border-gray-200 ${textAlignClass}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("pricingPage:comparison.title")}
            </h2>
            <p className="text-gray-600">{t("pricingPage:comparison.subtitle")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className={`${isRtl ? "text-right" : "text-left"} py-4 px-6 text-sm font-semibold text-gray-900`}>
                    {t("pricingPage:comparison.headers.features")}
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">
                    {t("pricingPage:comparison.headers.trial")}
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">
                    {t("pricingPage:comparison.headers.basic")}
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">
                    {t("pricingPage:comparison.headers.professional")}
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">
                    {t("pricingPage:comparison.headers.enterprise")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonCategories.map((category) => (
                  <Fragment key={category.key}>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className={`${isRtl ? "text-right" : "text-left"} py-3 px-6 text-sm font-semibold text-gray-900`}>
                        {t(`pricingPage:comparison.categories.${category.key}.title`)}
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.key} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className={`${isRtl ? "text-right" : "text-left"} py-4 px-6 text-sm text-gray-700`}>
                          {t(`pricingPage:comparison.categories.${category.key}.items.${feature.key}`)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {renderComparisonValue(feature.trial)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {renderComparisonValue(feature.basic)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {renderComparisonValue(feature.professional)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {renderComparisonValue(feature.enterprise)}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("pricingPage:faq.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {faqKeys.map((faqKey) => (
              <div key={faqKey}>
                <div className={`flex items-start gap-3 ${isRtl ? "flex-row-reverse text-right" : ""}`}>
                  <HelpCircle className="w-6 h-6 text-[#0F5C47] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t(`pricingPage:faq.items.${faqKey}.question`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`pricingPage:faq.items.${faqKey}.answer`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("pricingPage:cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t("pricingPage:cta.subtitle")}
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
          >
            {t("pricingPage:cta.button")}
          </button>
        </div>
      </div>
    </div>
  );
}
