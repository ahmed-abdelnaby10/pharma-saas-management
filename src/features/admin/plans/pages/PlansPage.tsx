import React from 'react';
import { Check, X, Plus, Edit2 } from 'lucide-react';
import { usePlansQuery, useDeletePlanMutation } from '@/features/admin/api';
import { toast } from 'sonner';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 999, yearly: 9999 },
    description: 'Perfect for single-location pharmacies',
    features: {
      branches: 1,
      users: 5,
      ocrPages: 100,
      multiBranch: false,
      advancedReports: false,
      branchTransfers: false,
      ocrImport: false,
      prescriptionTracking: true,
      batchTracking: true,
      expiryTracking: true,
      apiAccess: false,
      prioritySupport: false,
    },
    color: 'gray',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: { monthly: 2499, yearly: 24999 },
    description: 'For expanding pharmacy businesses',
    features: {
      branches: 5,
      users: 15,
      ocrPages: 1000,
      multiBranch: true,
      advancedReports: true,
      branchTransfers: true,
      ocrImport: true,
      prescriptionTracking: true,
      batchTracking: true,
      expiryTracking: true,
      apiAccess: false,
      prioritySupport: false,
    },
    color: 'teal',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 4999, yearly: 49999 },
    description: 'For established pharmacy chains',
    features: {
      branches: 10,
      users: 30,
      ocrPages: 5000,
      multiBranch: true,
      advancedReports: true,
      branchTransfers: true,
      ocrImport: true,
      prescriptionTracking: true,
      batchTracking: true,
      expiryTracking: true,
      apiAccess: true,
      prioritySupport: true,
    },
    color: 'blue',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 9999, yearly: 99999 },
    description: 'For large organizations',
    features: {
      branches: 25,
      users: 100,
      ocrPages: 20000,
      multiBranch: true,
      advancedReports: true,
      branchTransfers: true,
      ocrImport: true,
      prescriptionTracking: true,
      batchTracking: true,
      expiryTracking: true,
      apiAccess: true,
      prioritySupport: true,
      dedicatedSupport: true,
      customIntegrations: true,
    },
    color: 'purple',
  },
];

const featureLabels: Record<string, string> = {
  branches: 'Max Branches',
  users: 'Max Users',
  ocrPages: 'OCR Pages/Month',
  multiBranch: 'Multi-Branch Management',
  advancedReports: 'Advanced Reports',
  branchTransfers: 'Branch Transfers',
  ocrImport: 'OCR Import',
  prescriptionTracking: 'Prescription Tracking',
  batchTracking: 'Batch Tracking',
  expiryTracking: 'Expiry Tracking',
  apiAccess: 'API Access',
  prioritySupport: 'Priority Support',
  dedicatedSupport: 'Dedicated Support Manager',
  customIntegrations: 'Custom Integrations',
};

export function PlansPage() {
  // Real plans from API — available for future wiring into the comparison table
  const { data: _apiPlans } = usePlansQuery();
  const _deleteMutation = useDeletePlanMutation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Plans & Features</h1>
          <p className="mt-1 text-sm text-gray-500">Manage subscription plans and feature configurations</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border-2 rounded-xl p-6 relative ${
              plan.popular ? 'border-teal-500 shadow-lg' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 text-xs font-medium text-white bg-teal-600 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${(plan.price.monthly / 100).toFixed(0)}
                </span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                or ${(plan.price.yearly / 100).toFixed(0)}/year
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <FeatureItem
                label="Branches"
                value={plan.features.branches}
                type="number"
              />
              <FeatureItem
                label="Users"
                value={plan.features.users}
                type="number"
              />
              <FeatureItem
                label="OCR Pages"
                value={`${plan.features.ocrPages}/mo`}
                type="text"
              />
            </div>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
                Features Included
              </p>
              <div className="space-y-2">
                {Object.entries(plan.features).map(([key, value]) => {
                  if (key === 'branches' || key === 'users' || key === 'ocrPages') return null;
                  if (typeof value === 'boolean') {
                    return (
                      <FeatureCheck
                        key={key}
                        label={featureLabels[key]}
                        included={value}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Feature Comparison</h3>
          <p className="text-sm text-gray-500 mt-1">Complete feature matrix across all plans</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(featureLabels).map(([key, label]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {label}
                  </td>
                  {plans.map((plan) => {
                    const value = plan.features[key as keyof typeof plan.features];
                    return (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-900">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Subscriptions Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600">Starter Subscriptions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">12</p>
          <p className="text-xs text-gray-500 mt-1">$11,988 MRR</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600">Growth Subscriptions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">28</p>
          <p className="text-xs text-gray-500 mt-1">$69,972 MRR</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600">Pro Subscriptions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">15</p>
          <p className="text-xs text-gray-500 mt-1">$74,985 MRR</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600">Enterprise Subscriptions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">7</p>
          <p className="text-xs text-gray-500 mt-1">$69,993 MRR</p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ label, value, type }: { label: string; value: string | number; type: 'number' | 'text' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function FeatureCheck({ label, included }: { label: string; included: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {included ? (
        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
      )}
      <span className={`text-xs ${included ? 'text-gray-700' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}