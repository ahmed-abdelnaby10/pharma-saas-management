import React from 'react';
import { useNavigate } from 'react-router';
import {
  ShoppingCart,
  Pill,
  Package,
  FileText,
  Calendar,
  BarChart3,
  Building2,
  Users,
  Scan,
  Upload,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Shield,
  Smartphone,
  Monitor,
  Printer,
  Database,
  ArrowRight,
} from 'lucide-react';

export function FeaturesPage() {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: 'Point of Sale',
      description: 'Fast, efficient POS designed for pharmacy operations',
      icon: ShoppingCart,
      color: 'blue',
      features: [
        { icon: Scan, title: 'Barcode Scanner Integration', description: 'Instant product lookup with USB barcode scanners' },
        { icon: DollarSign, title: 'Multiple Payment Methods', description: 'Cash, card, and mixed payment support' },
        { icon: Printer, title: 'Receipt Printing', description: 'Auto-print receipts with thermal printers' },
        { icon: Clock, title: 'Quick Sale Processing', description: 'Fast checkout optimized for high-volume sales' },
      ],
    },
    {
      title: 'Inventory Management',
      description: 'Complete control over your pharmacy stock',
      icon: Package,
      color: 'green',
      features: [
        { icon: Package, title: 'Real-time Stock Tracking', description: 'Live inventory updates across all branches' },
        { icon: AlertTriangle, title: 'Low Stock Alerts', description: 'Automatic notifications when stock runs low' },
        { icon: Calendar, title: 'Batch & Expiry Tracking', description: 'FEFO/FIFO support with expiry date management' },
        { icon: TrendingUp, title: 'Stock Movements', description: 'Complete audit trail of all inventory changes' },
      ],
    },
    {
      title: 'Medicine Management',
      description: 'Specialized tools for pharmaceutical products',
      icon: Pill,
      color: 'purple',
      features: [
        { icon: Pill, title: 'Scientific Name Database', description: 'Organize medicines by scientific and trade names' },
        { icon: Shield, title: 'Prescription Tracking', description: 'Flag prescription-required medications' },
        { icon: FileText, title: 'Batch Numbers', description: 'Track medicine batches for recall management' },
        { icon: Calendar, title: 'Expiry Management', description: 'Never sell expired medicines with automatic alerts' },
      ],
    },
    {
      title: 'OCR Invoice Import',
      description: 'AI-powered invoice data extraction',
      icon: Upload,
      color: 'orange',
      features: [
        { icon: Upload, title: 'Upload Invoices', description: 'Scan or upload supplier invoice images/PDFs' },
        { icon: Scan, title: 'Automatic Extraction', description: 'AI extracts products, prices, and quantities' },
        { icon: FileText, title: 'Smart Matching', description: 'Auto-match products to your catalog' },
        { icon: Shield, title: 'Human Review', description: 'Review and confirm before posting to inventory' },
      ],
    },
    {
      title: 'Purchasing',
      description: 'Streamline supplier orders and receiving',
      icon: FileText,
      color: 'red',
      features: [
        { icon: Building2, title: 'Supplier Management', description: 'Organize suppliers and representatives' },
        { icon: FileText, title: 'Purchase Orders', description: 'Create and track purchase orders' },
        { icon: Package, title: 'Stock Receiving', description: 'Record received stock with batch and expiry' },
        { icon: DollarSign, title: 'Cost Tracking', description: 'Monitor purchase costs and margins' },
      ],
    },
    {
      title: 'Shifts & Cash Management',
      description: 'Control daily operations and cash flow',
      icon: Calendar,
      color: 'indigo',
      features: [
        { icon: Clock, title: 'Shift Opening/Closing', description: 'Start and end shifts with cash counts' },
        { icon: DollarSign, title: 'Cash In/Out', description: 'Track cash additions and withdrawals' },
        { icon: BarChart3, title: 'Shift Reports', description: 'Expected vs actual cash reconciliation' },
        { icon: Shield, title: 'Shortage Detection', description: 'Identify cash discrepancies automatically' },
      ],
    },
    {
      title: 'Reports & Analytics',
      description: 'Make data-driven business decisions',
      icon: BarChart3,
      color: 'pink',
      features: [
        { icon: TrendingUp, title: 'Sales Reports', description: 'Track sales by day, week, month, and year' },
        { icon: DollarSign, title: 'Profit Analysis', description: 'Monitor profit margins and trends' },
        { icon: Package, title: 'Stock Reports', description: 'Low stock, near expiry, and valuation reports' },
        { icon: Building2, title: 'Branch Comparison', description: 'Compare performance across branches' },
      ],
    },
    {
      title: 'Multi-Branch Management',
      description: 'Manage multiple locations from one account',
      icon: Building2,
      color: 'teal',
      features: [
        { icon: Building2, title: 'Unlimited Branches', description: 'Add and manage all your pharmacy locations' },
        { icon: Database, title: 'Centralized Data', description: 'One database for all branches' },
        { icon: Package, title: 'Branch Transfers', description: 'Move stock between locations' },
        { icon: Users, title: 'Branch Permissions', description: 'Control user access by branch' },
      ],
    },
  ];

  const platforms = [
    {
      icon: Monitor,
      title: 'Web Application',
      description: 'Access from any device with a web browser',
      features: ['Works on desktop, tablet, mobile', 'No installation required', 'Automatic updates', 'Cloud-based'],
    },
    {
      icon: Smartphone,
      title: 'Windows Desktop App',
      description: 'Native Windows application with offline support',
      features: ['Better hardware integration', 'Works with barcode scanners', 'Thermal printer support', 'Same account & data'],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-red-50 text-red-600',
      indigo: 'bg-indigo-50 text-indigo-600',
      pink: 'bg-pink-50 text-pink-600',
      teal: 'bg-teal-50 text-teal-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything your pharmacy needs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A complete, modern platform designed specifically for pharmacy operations. From POS to inventory, reports to multi-branch management.
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-24">
          {featureCategories.map((category, index) => {
            const CategoryIcon = category.icon;
            return (
              <div key={index} className={index % 2 === 0 ? '' : 'bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-2xl'}>
                <div className="mb-12">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getColorClasses(category.color)} mb-4`}>
                    <CategoryIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.title}</h2>
                  <p className="text-xl text-gray-600">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.features.map((feature, featIndex) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div key={featIndex} className="flex gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${getColorClasses(category.color)} flex items-center justify-center`}>
                          <FeatureIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Platforms */}
        <div className="mt-24 pt-24 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Works where you work
            </h2>
            <p className="text-xl text-gray-600">
              Choose web or desktop - same account, same data
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platforms.map((platform, index) => {
              const PlatformIcon = platform.icon;
              return (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#0F5C47] transition-all">
                  <PlatformIcon className="w-12 h-12 text-[#0F5C47] mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{platform.title}</h3>
                  <p className="text-gray-600 mb-6">{platform.description}</p>
                  <ul className="space-y-2">
                    {platform.features.map((feat, featIndex) => (
                      <li key={featIndex} className="flex items-center gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0F5C47]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Try all features free for 3 days. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
