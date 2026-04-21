import React from 'react';
import { LifeBuoy, Search } from 'lucide-react';

export function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Support Tools</h1>
        <p className="mt-1 text-sm text-gray-500">Customer support and account assistance tools</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenant for support..."
            className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <LifeBuoy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Support Dashboard</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Quick tenant lookup, support timeline, internal notes, and impersonation tools for customer assistance
        </p>
      </div>
    </div>
  );
}
