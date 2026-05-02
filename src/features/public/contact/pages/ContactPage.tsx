import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function ContactPage() {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(t("contact:form.success"));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: t("contact:methods.email.title"),
      description: t("contact:methods.email.description"),
      value: "support@pharmasaas.com",
      action: "mailto:support@pharmasaas.com",
    },
    {
      icon: Phone,
      title: t("contact:methods.phone.title"),
      description: t("contact:methods.phone.description"),
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: t("contact:methods.visit.title"),
      description: t("contact:methods.visit.description"),
      value: "123 Healthcare St, Medical City",
      action: "#",
    },
  ];

  const faqKeys = [
    "gettingStarted",
    "training",
    "migration",
    "support",
  ] as const;

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("contact:hero.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("contact:hero.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.title}
                href={method.action}
                className="bg-white rounded-xl p-8 border border-gray-200 hover:border-[#0F5C47] hover:shadow-lg transition-all text-center"
              >
                <div className="w-16 h-16 bg-[#0F5C47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-[#0F5C47]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <p className="text-[#0F5C47] font-medium">{method.value}</p>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div
              className={`flex items-center gap-3 mb-6 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <div className="w-10 h-10 bg-[#0F5C47]/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-[#0F5C47]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("contact:form.title")}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={textAlignClass}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("contact:form.fields.name.label")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder={t("contact:form.fields.name.placeholder")}
                  />
                </div>

                <div className={textAlignClass}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("contact:form.fields.email.label")}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                    placeholder={t("contact:form.fields.email.placeholder")}
                  />
                </div>
              </div>

              <div className={textAlignClass}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("contact:form.fields.phone.label")}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                  placeholder={t("contact:form.fields.phone.placeholder")}
                />
              </div>

              <div className={textAlignClass}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("contact:form.fields.subject.label")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
                  placeholder={t("contact:form.fields.subject.placeholder")}
                />
              </div>

              <div className={textAlignClass}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("contact:form.fields.message.label")}
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none resize-none"
                  placeholder={t("contact:form.fields.message.placeholder")}
                />
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-all ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <Send className={`w-5 h-5 ${isRtl ? "scale-x-[-1]" : ""}`} />
                {t("contact:form.submit")}
              </button>
            </form>
          </div>

          <div>
            <div
              className={`flex items-center gap-3 mb-6 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <div className="w-10 h-10 bg-[#0F5C47]/10 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-[#0F5C47]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("contact:faq.title")}
              </h2>
            </div>

            <div className="space-y-6">
              {faqKeys.map((faqKey) => (
                <div
                  key={faqKey}
                  className={`bg-white rounded-xl p-6 border border-gray-200 ${textAlignClass}`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t(`contact:faq.items.${faqKey}.question`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`contact:faq.items.${faqKey}.answer`)}
                  </p>
                </div>
              ))}
            </div>

            <div className={`mt-8 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-xl p-8 text-white ${textAlignClass}`}>
              <h3 className="text-xl font-bold mb-2">{t("contact:cta.title")}</h3>
              <p className="text-white/90 mb-4">{t("contact:cta.description")}</p>
              <a
                href="tel:+15551234567"
                className={`inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0F5C47] rounded-lg font-semibold hover:bg-gray-100 transition-all ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <Phone className="w-5 h-5" />
                {t("contact:cta.button")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
