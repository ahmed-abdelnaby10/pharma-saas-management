import React from 'react';
import { useNavigate } from 'react-router';
import { Download, Monitor, Check, Scan, Printer, Zap, Shield, HardDrive, Cpu, ArrowRight } from 'lucide-react';

export function DownloadPage() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Scan,
      title: 'Better Hardware Integration',
      description: 'Direct connection to barcode scanners and thermal printers without browser limitations',
    },
    {
      icon: Zap,
      title: 'Faster Performance',
      description: 'Native Windows app optimized for speed with local caching',
    },
    {
      icon: Shield,
      title: 'Offline Mode',
      description: 'Continue working even when internet connection is unstable (coming soon)',
    },
    {
      icon: HardDrive,
      title: 'Same Account & Data',
      description: 'Login with your existing account - all data syncs automatically',
    },
  ];

  const systemRequirements = [
    { label: 'Operating System', value: 'Windows 10 or Windows 11 (64-bit)' },
    { label: 'Processor', value: 'Intel Core i3 or equivalent' },
    { label: 'RAM', value: '4 GB minimum, 8 GB recommended' },
    { label: 'Storage', value: '500 MB available space' },
    { label: 'Display', value: '1280x720 minimum resolution' },
    { label: 'Internet', value: 'Required for sync and updates' },
  ];

  const features = [
    'Full POS system with barcode scanner support',
    'Thermal receipt printer integration',
    'Medicine and cosmetics management',
    'Inventory tracking across branches',
    'Purchase order management',
    'OCR invoice import',
    'Shift management and cash counting',
    'Complete reports and analytics',
    'Multi-branch support',
    'Automatic cloud sync',
    'Same login as web app',
    'Free updates included',
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0F5C47] rounded-2xl mb-6">
            <Monitor className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Download for Windows
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Native Windows desktop app with better hardware integration and performance. Use the same account as the web version.
          </p>
        </div>

        {/* Download CTA */}
        <div className="bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-2xl p-12 text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              PharmaSaaS for Windows
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Version 2.1.0 • Released March 2026 • 45 MB
            </p>
            <button
              onClick={() => {/* Trigger download */}}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
            >
              <Download className="w-6 h-6" />
              Download for Windows
            </button>
            <p className="text-sm text-white/70 mt-4">
              Free to download • Requires PharmaSaaS account
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why use the desktop app?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 border border-gray-200">
                  <div className="w-12 h-12 bg-[#0F5C47]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#0F5C47]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Included */}
        <div className="bg-white rounded-2xl p-12 border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <div className="bg-white rounded-2xl p-12 border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            System Requirements
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {systemRequirements.map((req, index) => (
              <div key={index} className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0">
                <div className="w-1/3 font-semibold text-gray-900">{req.label}</div>
                <div className="w-2/3 text-gray-600">{req.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F5C47] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Download</h3>
              <p className="text-sm text-gray-600">Download the Windows installer from this page</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F5C47] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Install</h3>
              <p className="text-sm text-gray-600">Run the installer and follow the setup wizard</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F5C47] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Login</h3>
              <p className="text-sm text-gray-600">Sign in with your existing PharmaSaaS account</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0F5C47] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Working</h3>
              <p className="text-sm text-gray-600">All your data syncs automatically</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Common questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I need a separate account?</h3>
              <p className="text-gray-600">
                No! Use the same account for both web and desktop. Your data syncs automatically between them.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is the desktop app free?</h3>
              <p className="text-gray-600">
                Yes, the desktop app is free to download. You just need an active PharmaSaaS subscription.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I use both web and desktop?</h3>
              <p className="text-gray-600">
                Absolutely! Use the web app on any device and the desktop app on your Windows PC. All data syncs in real-time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Will it work with my barcode scanner?</h3>
              <p className="text-gray-600">
                Yes! The desktop app works with most USB barcode scanners and thermal receipt printers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Don't have an account yet?
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C47] text-white rounded-lg text-lg font-semibold hover:bg-[#0d4a39] transition-all"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
