import React from 'react';
import { useNavigate } from 'react-router';
import {
  Pill,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Scan,
  Building2,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Download,
  Monitor,
  Smartphone,
  Play,
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const featureColorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  const features = [
    {
      icon: ShoppingCart,
      title: 'Point of Sale',
      description: 'Fast, barcode-enabled POS with shift management and receipt printing',
      color: 'blue',
    },
    {
      icon: Pill,
      title: 'Medicine Management',
      description: 'Complete medicine catalog with batch tracking and expiry alerts',
      color: 'green',
    },
    {
      icon: Package,
      title: 'Inventory Control',
      description: 'Real-time stock levels, low stock alerts, and multi-branch visibility',
      color: 'orange',
    },
    {
      icon: FileText,
      title: 'OCR Invoice Import',
      description: 'Automatically extract purchase data from invoices using AI',
      color: 'purple',
    },
    {
      icon: Calendar,
      title: 'Shift Management',
      description: 'Track opening/closing cash, cash in/out, and shift reconciliation',
      color: 'red',
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Sales, profit, stock, and expiry reports across all branches',
      color: 'indigo',
    },
  ];

  const benefits = [
    {
      icon: Building2,
      title: 'Multi-Branch Ready',
      description: 'Manage unlimited branches from one account',
    },
    {
      icon: Scan,
      title: 'Barcode Scanner Support',
      description: 'Works with USB barcode scanners and receipt printers',
    },
    {
      icon: Zap,
      title: 'Fast & Modern',
      description: 'Built for speed with a clean, professional interface',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is encrypted and backed up automatically',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Daily Transactions' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djItMnptMC00djItMnptMC00djItMnptLTQgMTJ2LTJ6bTAtNHYtMnptMC00di0yem0wLTR2LTJ6bS00IDEydi0yem0wLTR2LTJ6bTAtNHYtMnptMC00di0yem0tNCAxMnYtMnptMC00di0yem0wLTR2LTJ6bTAtNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                3-Day Free Trial • No Credit Card Required
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Complete Pharmacy Management Platform
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Streamline your pharmacy operations with our all-in-one SaaS platform. 
                POS, inventory, purchasing, reports, and more - all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => navigate('/demo')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Web + Windows App
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Barcode Scanner Ready
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <Monitor className="w-24 h-24 text-white/20" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-white/60">POS</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-white/60">Inventory</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-white/60">Reports</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#0F5C47] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to run your pharmacy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From POS to inventory, purchasing to reports - all the tools you need in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses =
                featureColorClasses[
                  feature.color as keyof typeof featureColorClasses
                ];

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#0F5C47] hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/features')}
              className="inline-flex items-center gap-2 px-6 py-3 text-[#0F5C47] font-semibold hover:gap-3 transition-all"
            >
              View All Features
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why choose PharmaSaaS?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#0F5C47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#0F5C47]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Works everywhere you work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access your pharmacy from web browsers or download our Windows desktop app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <Monitor className="w-12 h-12 text-[#0F5C47] mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Web Application</h3>
              <p className="text-gray-600 mb-4">
                Access from any device with a web browser. Works on desktop, tablet, and mobile.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-[#0F5C47] font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all"
              >
                Launch Web App
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <Download className="w-12 h-12 text-[#0F5C47] mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Windows Desktop App</h3>
              <p className="text-gray-600 mb-4">
                Native Windows app with offline support and hardware integration for barcode scanners.
              </p>
              <button
                onClick={() => navigate('/download')}
                className="text-[#0F5C47] font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all"
              >
                Download for Windows
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to modernize your pharmacy?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your 3-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
