import { Link } from "react-router";
import { CheckCircle, Pill } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function SignupSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Yomdix</span>
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t("auth:signupSuccess.title")}
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t("auth:signupSuccess.description")}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-colors"
        >
          {t("auth:signupSuccess.actions.backHome")}
        </Link>
      </div>
    </div>
  );
}
