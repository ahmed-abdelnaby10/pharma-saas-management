import React from "react";
import { CreditCard, Check, Lock, TrendingUp } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useApp } from "@/app/contexts/useApp";

const plans = [
  {
    name: "Basic",
    price: 99,
    features: [
      "1 Branch",
      "Up to 5 Users",
      "Basic Reports",
      "Email Support",
      "1000 Products",
    ],
  },
  {
    name: "Professional",
    price: 249,
    features: [
      "3 Branches",
      "Up to 15 Users",
      "Advanced Reports",
      "Priority Support",
      "Unlimited Products",
      "Multi-branch Transfers",
      "Representative Orders",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 499,
    features: [
      "Unlimited Branches",
      "Unlimited Users",
      "Custom Reports",
      "24/7 Support",
      "Unlimited Products",
      "API Access",
      "Custom Integrations",
      "Dedicated Account Manager",
    ],
  },
];

export function SubscriptionPage() {
  const { t } = useLanguage();
  const { tenant } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {t("subscription")}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your plan and billing
        </p>
      </div>

      <div className="bg-gradient-to-r from-[#0F5C47] to-[#1a8c6b] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">{t("currentPlan")}</h3>
            <p className="text-2xl font-bold mb-1">
              {tenant?.plan === "professional" ? "Professional" : tenant?.plan}
            </p>
            <p className="text-sm text-white/80">Next billing: April 9, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">$249</p>
            <p className="text-sm text-white/80">per month</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/80">Branches Used</p>
              <p className="text-lg font-semibold">3 / 3</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Users</p>
              <p className="text-lg font-semibold">8 / 15</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Products</p>
              <p className="text-lg font-semibold">342 / ÃƒÂ¢Ã‹â€ Ã…Â¾</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl border-2 p-6 ${
                plan.popular ? "border-[#0F5C47] shadow-lg" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="inline-flex px-3 py-1 bg-[#0F5C47] text-white text-xs font-medium rounded-full mb-4">
                  Current Plan
                </div>
              )}
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {plan.name}
              </h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-[#0F5C47] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                    : "bg-[#0F5C47] text-white hover:bg-[#0d4a39]"
                }`}
                disabled={plan.popular}
              >
                {plan.popular
                  ? "Current Plan"
                  : plan.name === "Enterprise"
                    ? "Contact Sales"
                    : t("upgradePlan")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("billingHistory")}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("date")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Description
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("amount")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("status")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                  Mar 9, 2026
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  Professional Plan - Monthly
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                  $249.00
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                    Paid
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium whitespace-nowrap">
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
