import React from 'react';
import { Plus, Shield } from 'lucide-react';

export function FeatureOverridesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Feature Overrides</h1>
          <p className="mt-1 text-sm text-gray-500">Manage tenant-specific feature exceptions and temporary access</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Override
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Feature Override Management</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Control tenant-specific exceptions, temporary feature access, and plan limit overrides
        </p>
      </div>
    </div>
  );
}
