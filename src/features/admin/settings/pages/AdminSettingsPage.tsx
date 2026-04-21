import React from 'react';
import { Settings, Users, Bell, Shield, Globe } from 'lucide-react';

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Configure platform-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SettingCard
          icon={Users}
          title="Admin Users"
          description="Manage platform administrators and their permissions"
        />
        <SettingCard
          icon={Bell}
          title="Notifications"
          description="Configure system alerts and notification preferences"
        />
        <SettingCard
          icon={Shield}
          title="Security"
          description="Security policies, 2FA, and access controls"
        />
        <SettingCard
          icon={Globe}
          title="Platform Configuration"
          description="General platform settings and configurations"
        />
      </div>
    </div>
  );
}

function SettingCard({ icon: Icon, title, description }: any) {
  return (
    <button className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:border-teal-300 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-teal-50 transition-colors">
          <Icon className="w-6 h-6 text-gray-600 group-hover:text-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}
