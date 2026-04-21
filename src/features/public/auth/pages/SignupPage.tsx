import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Pill, Mail, Lock, User, Building2, Phone, Globe, Check, ArrowRight } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    pharmacyName: '',
    phone: '',
    country: '',
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
    navigate('/');
  };

  const trialBenefits = [
    '3-day free trial',
    'No credit card required',
    'Full access to all features',
    'Cancel anytime',
    'Same account for web & desktop',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/home" className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PharmaSaaS</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Start your free trial</h2>
            <p className="mt-2 text-sm text-gray-600">
              Get full access for 3 days. No credit card required.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="john@pharmacy.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pharmacy Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.pharmacyName}
                    onChange={(e) => setFormData({ ...formData, pharmacyName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="Your Pharmacy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="Min. 8 characters"
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#0F5C47] border-gray-300 rounded focus:ring-[#0F5C47]"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#0F5C47] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#0F5C47] hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-all"
              >
                Start 3-Day Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0F5C47] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djItMnptMC00djItMnptMC00djItMnptLTQgMTJ2LTJ6bTAtNHYtMnptMC00di0yem0wLTR2LTJ6bS00IDEydi0yem0wLTR2LTJ6bTAtNHYtMnptMC00di0yem0tNCAxMnYtMnptMC00di0yem0wLTR2LTJ6bTAtNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative h-full flex flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6">
              Everything you need to manage your pharmacy
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Join thousands of pharmacies using PharmaSaaS to streamline their operations
            </p>

            <div className="space-y-4 mb-12">
              {trialBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">
                    "PharmaSaaS helped us cut inventory waste by 40% with expiry tracking"
                  </p>
                  <p className="text-white/70 text-sm">
                    - Sarah Ahmed, Green Valley Pharmacy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
