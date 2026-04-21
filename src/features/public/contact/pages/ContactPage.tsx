import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, HelpCircle } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get in touch via email',
      value: 'support@pharmasaas.com',
      action: 'mailto:support@pharmasaas.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 9am to 6pm',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello',
      value: '123 Healthcare St, Medical City',
      action: '#',
    },
  ];

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'You can start using PharmaSaaS within minutes. Sign up for a free trial, add your first branch, and start managing your pharmacy immediately.',
    },
    {
      question: 'Do you offer training and onboarding?',
      answer: 'Yes! We provide comprehensive documentation, video tutorials, and one-on-one onboarding calls for Professional and Enterprise plans.',
    },
    {
      question: 'Can I migrate my existing data?',
      answer: 'Absolutely. Our team can help you migrate your existing product catalog, customer data, and inventory from your current system.',
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer email support for all plans, priority support for Professional plans, and phone + chat support for Enterprise customers.',
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get in touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We're here to help. Contact our team or send us a message.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.action}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#0F5C47] hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-[#0F5C47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#0F5C47]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <p className="text-[#0F5C47] font-medium">{method.value}</p>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0F5C47]/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#0F5C47]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none resize-none"
                  placeholder="Tell us more about your needs..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-all"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0F5C47]/10 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#0F5C47]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Need immediate assistance?</h3>
              <p className="text-white/90 mb-4">
                For urgent technical support, existing customers can access our priority support line.
              </p>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F5C47] rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
