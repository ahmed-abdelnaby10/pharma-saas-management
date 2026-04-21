import React from 'react';
import { TrendingUp } from 'lucide-react';

export function UsageLimitsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Usage & Limits</h1>
        <p className="mt-1 text-sm text-gray-500">Monitor tenant resource consumption and quota risks</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Usage Monitoring</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Track branch usage, user limits, OCR consumption, and identify tenants approaching their quotas
        </p>
      </div>
    </div>
  );
}
