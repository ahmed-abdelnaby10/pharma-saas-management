import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, X, Zap, HelpCircle } from 'lucide-react';

export function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Trial',
      description: 'Try all features free for 3 days',
      price: { monthly: 0, yearly: 0 },
      badge: 'Free',
      badgeColor: 'bg-blue-100 text-blue-700',
      features: [
        { name: 'All features unlocked', included: true },
        { name: 'Up to 1 branch', included: true },
        { name: 'Up to 2 users', included: true },
        { name: 'Basic POS', included: true },
        { name: 'Product management', included: true },
        { name: 'Basic reports', included: true },
        { name: 'Email support', included: true },
        { name: 'OCR invoice import', included: false },
        { name: 'Advanced reports', included: false },
        { name: 'Multi-branch', included: false },
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Basic',
      description: 'Perfect for single pharmacy',
      price: { monthly: 49, yearly: 470 },
      badge: null,
      features: [
        { name: 'Up to 1 branch', included: true },
        { name: 'Up to 3 users', included: true },
        { name: 'Full POS system', included: true },
        { name: 'Product management', included: true },
        { name: 'Inventory tracking', included: true },
        { name: 'Batch & expiry tracking', included: true },
        { name: 'Basic reports', included: true },
        { name: 'Shift management', included: true },
        { name: 'Email support', included: true },
        { name: 'OCR invoice import', included: false },
        { name: 'Advanced reports', included: false },
        { name: 'Multi-branch', included: false },
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For growing pharmacy businesses',
      price: { monthly: 99, yearly: 950 },
      badge: 'Popular',
      badgeColor: 'bg-[#0F5C47] text-white',
      features: [
        { name: 'Up to 3 branches', included: true },
        { name: 'Up to 10 users', included: true },
        { name: 'Full POS system', included: true },
        { name: 'Product management', included: true },
        { name: 'Inventory tracking', included: true },
        { name: 'Batch & expiry tracking', included: true },
        { name: 'Advanced reports', included: true },
        { name: 'Shift management', included: true },
        { name: 'OCR invoice import', included: true },
        { name: 'Stock movements', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Phone support', included: false },
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For pharmacy chains',
      price: { monthly: 199, yearly: 1910 },
      badge: 'Best Value',
      badgeColor: 'bg-purple-100 text-purple-700',
      features: [
        { name: 'Unlimited branches', included: true },
        { name: 'Unlimited users', included: true },
        { name: 'Full POS system', included: true },
        { name: 'Product management', included: true },
        { name: 'Inventory tracking', included: true },
        { name: 'Batch & expiry tracking', included: true },
        { name: 'Advanced reports', included: true },
        { name: 'Shift management', included: true },
        { name: 'OCR invoice import', included: true },
        { name: 'Stock movements', included: true },
        { name: 'Priority support', included: true },
        { name: 'Phone & chat support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const allFeatures = [
    {
      category: 'Core Features',
      features: [
        { name: 'Point of Sale (POS)', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Product Management', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Medicine Management', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Cosmetics Management', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Inventory Tracking', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Batch & Expiry Tracking', trial: true, basic: true, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Operations',
      features: [
        { name: 'Shift Management', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Purchasing', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Supplier Management', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Representative Management', trial: false, basic: false, professional: true, enterprise: true },
        { name: 'Stock Movements', trial: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Advanced Features',
      features: [
        { name: 'OCR Invoice Import', trial: false, basic: false, professional: true, enterprise: true },
        { name: 'Advanced Reports', trial: false, basic: false, professional: true, enterprise: true },
        { name: 'Branch Comparison Reports', trial: false, basic: false, professional: true, enterprise: true },
        { name: 'Product Enrichment', trial: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Multi-Branch',
      features: [
        { name: 'Number of Branches', trial: '1', basic: '1', professional: '3', enterprise: 'Unlimited' },
        { name: 'Number of Users', trial: '2', basic: '3', professional: '10', enterprise: 'Unlimited' },
        { name: 'Branch Transfer', trial: false, basic: false, professional: true, enterprise: true },
        { name: 'Centralized Inventory', trial: false, basic: false, professional: true, enterprise: true },
      ],
    },
    {
      category: 'Support',
      features: [
        { name: 'Email Support', trial: true, basic: true, professional: true, enterprise: true },
        { name: 'Priority Support', trial: false, basic: false, professional: true, enterprise: true },
        { name: 'Phone Support', trial: false, basic: false, professional: false, enterprise: true },
        { name: 'Dedicated Account Manager', trial: false, basic: false, professional: false, enterprise: true },
      ],
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start with a 3-day free trial. No credit card required. Choose the plan that fits your pharmacy.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#0F5C47] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-[#0F5C47] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl p-8 border-2 transition-all ${
                plan.popular
                  ? 'border-[#0F5C47] shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.badge && (
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6 h-12">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price[billingCycle]}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    ${(plan.price.yearly / 12).toFixed(0)}/month billed annually
                  </div>
                )}
              </div>

              <button
                onClick={() => plan.cta === 'Contact Sales' ? navigate('/contact') : navigate('/signup')}
                className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 ${
                  plan.popular
                    ? 'bg-[#0F5C47] text-white hover:bg-[#0d4a39]'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare all features</h2>
            <p className="text-gray-600">See what's included in each plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Trial</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Basic</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((category, catIndex) => (
                  <React.Fragment key={catIndex}>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="py-3 px-6 text-sm font-semibold text-gray-900">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, featIndex) => (
                      <tr key={featIndex} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-700">{feature.name}</td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.trial === 'boolean' ? (
                            feature.trial ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-700">{feature.trial}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-700">{feature.basic}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.professional === 'boolean' ? (
                            feature.professional ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-700">{feature.professional}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-gray-700">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#0F5C47] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How does the free trial work?</h3>
                  <p className="text-gray-600">
                    You get full access to all features for 3 days. No credit card required. After the trial, choose a plan or your account will be paused.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#0F5C47] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
                  <p className="text-gray-600">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#0F5C47] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">
                    We accept all major credit cards, debit cards, and bank transfers for annual plans.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#0F5C47] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-600">
                    Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Our team is here to help you choose the right plan
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
