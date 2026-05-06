import { Link, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import {
  Pill,
  Mail,
  User,
  Building2,
  Phone,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { get, post } from "@/shared/api/request";
import { PUBLIC_API, QUERY_KEYS } from "@/shared/utils/constants";

interface PublicPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval?: "MONTHLY" | "YEARLY" | "monthly" | "yearly" | null;
  trialDays: number;
}

interface SignupFormValues {
  pharmacyNameEn: string;
  pharmacyNameAr: string;
  fullName: string;
  email: string;
  phone: string;
  planId: string;
  notes: string;
}

interface SignupSubmitPayload {
  planId: string;
  fullName: string;
  email: string;
  phone?: string;
  pharmacyNameEn: string;
  pharmacyNameAr: string;
  preferredLanguage?: "en" | "ar";
  notes?: string;
}

const publicConfig = {
  meta: { visibility: "public" as const },
};

export function SignupPage() {
  const navigate = useNavigate();
  const { t, language, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const iconPositionClass = isRtl ? "right-3" : "left-3";
  const inputPaddingClass = isRtl ? "pr-10 pl-4" : "pl-10 pr-4";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      pharmacyNameEn: "",
      pharmacyNameAr: "",
      fullName: "",
      email: "",
      phone: "",
      planId: "",
      notes: "",
    },
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery<PublicPlan[]>({
    queryKey: QUERY_KEYS.public.plans(language),
    queryFn: () => get<PublicPlan[]>(PUBLIC_API.plans, publicConfig),
  });

  const submitMutation = useMutation<unknown, Error, SignupSubmitPayload>({
    mutationFn: (payload) =>
      post<unknown, SignupSubmitPayload>(
        PUBLIC_API.signupRequests,
        payload,
        publicConfig,
      ),
    onSuccess: () => {
      navigate("/signup/success");
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        toast.error(t("auth:signup.errors.emailExists"));
      }
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    const payload: SignupSubmitPayload = {
      planId: values.planId,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      pharmacyNameEn: values.pharmacyNameEn.trim(),
      pharmacyNameAr: values.pharmacyNameAr.trim(),
      preferredLanguage: language,
      ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    };
    submitMutation.mutate(payload);
  };

  const trialBenefitKeys = [
    "auth:signup.benefits.items.noCreditCard",
    "auth:signup.benefits.items.fullAccess",
    "auth:signup.benefits.items.cancelAnytime",
    "auth:signup.benefits.items.webAndDesktop",
  ] as const;

  const planIntervalLabel = (interval?: PublicPlan["interval"]) => {
    if (!interval) return t("auth:signup.planIntervals.monthly");
    const normalized = String(interval).toLowerCase();
    if (normalized !== "monthly" && normalized !== "yearly") {
      return t("auth:signup.planIntervals.monthly");
    }
    return t(`auth:signup.planIntervals.${normalized}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 lg:min-h-screen overflow-auto">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Yomdix</span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">
            {t("auth:signup.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth:signup.subtitle")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.tenantName.label")}
              </label>
              <div className={`relative ${textAlignClass}`}>
                <Building2
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${iconPositionClass}`}
                />
                <input
                  {...register("pharmacyNameEn", {
                    required: t("auth:signup.validation.tenantNameRequired"),
                  })}
                  dir="ltr"
                  placeholder={t("auth:signup.fields.tenantName.placeholder")}
                  className={`w-full ${inputPaddingClass} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm`}
                />
              </div>
              {errors.pharmacyNameEn && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.pharmacyNameEn.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.tenantNameAr.label")}
              </label>
              <div className={`relative text-right`}>
                <Building2
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 right-3`}
                />
                <input
                  dir="rtl"
                  {...register("pharmacyNameAr", {
                    required: t("auth:signup.validation.tenantNameRequired"),
                  })}
                  placeholder={t("auth:signup.fields.tenantNameAr.placeholder")}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm"
                />
              </div>
              {errors.pharmacyNameAr && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.pharmacyNameAr.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.contactName.label")}
              </label>
              <div className={`relative ${textAlignClass}`}>
                <User
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${iconPositionClass}`}
                />
                <input
                  {...register("fullName", {
                    required: t("auth:signup.validation.contactNameRequired"),
                  })}
                  placeholder={t("auth:signup.fields.contactName.placeholder")}
                  className={`w-full ${inputPaddingClass} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.contactEmail.label")}
              </label>
              <div className={`relative ${textAlignClass}`}>
                <Mail
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${iconPositionClass}`}
                />
                <input
                  {...register("email", {
                    required: t("auth:signup.validation.contactEmailRequired"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("auth:signup.validation.contactEmailInvalid"),
                    },
                  })}
                  dir="ltr"
                  type="email"
                  placeholder={t("auth:signup.fields.contactEmail.placeholder")}
                  className={`w-full ${inputPaddingClass} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.contactPhone.label")}
              </label>
              <div className={`relative ${textAlignClass}`}>
                <Phone
                  className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${iconPositionClass}`}
                />
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder={t("auth:signup.fields.contactPhone.placeholder")}
                  className={`w-full ${inputPaddingClass} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.requestedPlanId.label")}
              </label>
              {plansLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("auth:signup.states.loadingPlans")}
                </div>
              ) : (
                <Controller
                  name="planId"
                  control={control}
                  rules={{
                    required: t(
                      "auth:signup.validation.requestedPlanIdRequired",
                    ),
                  }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className="w-full !h-12 rounded-lg border-gray-300 !bg-transparent px-4 text-sm focus-visible:ring-2 focus-visible:ring-[#0F5C47] focus-visible:border-transparent"
                        aria-invalid={!!errors.planId}
                      >
                        <SelectValue
                          placeholder={t(
                            "auth:signup.fields.requestedPlanId.placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {plan.currency} {plan.price}/
                            {planIntervalLabel(plan.interval)}
                            {plan.trialDays > 0
                              ? ` - ${t("auth:signup.planTrialDays", { count: plan.trialDays })}`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.planId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.planId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth:signup.fields.notes.label")}
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder={t("auth:signup.fields.notes.placeholder")}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm resize-none ${textAlignClass}`}
              />
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-all disabled:opacity-60"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("auth:signup.states.submitting")}
                </>
              ) : (
                <>
                  {t("auth:signup.actions.submit")}
                  <ArrowRight
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              {t("auth:signup.footer.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-[#0F5C47] font-medium hover:underline"
              >
                {t("auth:signup.footer.signIn")}
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden sticky lg:flex h-screen top-0 left-0 flex-1 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] flex-col justify-center px-12 xl:px-20">
        <div
          className={`max-w-lg ${isRtl ? "text-right ml-auto" : "text-left"}`}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("auth:signup.benefits.title")}
          </h2>
          <p className="text-xl text-white/90 mb-12">
            {t("auth:signup.benefits.subtitle")}
          </p>

          <div className="space-y-4 mb-12">
            {trialBenefitKeys.map((benefitKey) => (
              <div key={benefitKey} className={`flex items-center gap-3`}>
                <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-lg">{t(benefitKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
