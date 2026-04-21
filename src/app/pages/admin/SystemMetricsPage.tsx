import React from 'react';
import { Activity, Server, Database, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export function SystemMetricsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">System Metrics</h1>
        <p className="mt-1 text-sm text-gray-500">Platform operations and infrastructure monitoring</p>
      </div>

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <HealthCard
          title="API Status"
          status="Operational"
          icon={Server}
          color="green"
          metric="99.98% uptime"
        />
        <HealthCard
          title="Database"
          status="Operational"
          icon={Database}
          color="green"
          metric="< 50ms latency"
        />
        <HealthCard
          title="Background Jobs"
          status="Processing"
          icon={Zap}
          color="blue"
          metric="42 jobs in queue"
        />
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Sessions" value="1,247" />
        <StatCard label="API Requests/min" value="3,842" />
        <StatCard label="OCR Jobs Today" value="8,512" />
        <StatCard label="Failed Jobs" value="3" />
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">System Performance Metrics</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          API health, worker queues, OCR pipeline usage, processing times, and platform-wide event monitoring
        </p>
      </div>
    </div>
  );
}

function HealthCard({ title, status, icon: Icon, color, metric }: any) {
  const colorStyles = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {color === 'green' ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{status}</p>
        <p className="mt-1 text-xs text-gray-500">{metric}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
