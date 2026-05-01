import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  Pill,
  Mail,
  User,
  Building2,
  Phone,
  Globe,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { PUBLIC_API, QUERY_KEYS } from "@/shared/utils/constants";
import type { AppRequestConfig } from "@/shared/api/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "MONTHLY" | "YEARLY";
  trialDays: number;
}

interface SignupFormValues {
  tenantName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  country: string;
  requestedPlanId: string;
  notes: string;
}

// ─── Helper: public request config ───────────────────────────────────────────

const publicConfig: AppRequestConfig = {
  meta: { visibility: "public" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SignupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    defaultValues: {
      tenantName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      country: "",
      requestedPlanId: "",
      notes: "",
    },
  });

  // Fetch public plans
  const { data: plans = [], isLoading: plansLoading } = useQuery<PublicPlan[]>({
    queryKey: QUERY_KEYS.public.plans,
    queryFn: () => get<PublicPlan[]>(PUBLIC_API.plans, publicConfig),
  });

  const submitMutation = useMutation<unknown, Error, SignupFormValues>({
    mutationFn: (payload) =>
      post<unknown, SignupFormValues>(
        PUBLIC_API.signupRequests,
        payload,
        publicConfig,
      ),
    onSuccess: () => {
      navigate("/signup/success");
    },
    onError: (err: any) => {
      const status = err?.response?.status;
      if (status === 409) {
        toast.error(
          "An account with this email already exists. Try signing in instead.",
        );
      }
      // Other errors are handled globally by the API client interceptor
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    submitMutation.mutate(values);
  };

  const trialBenefits = [
    "No credit card required",
    "Full access to all features",
    "Cancel anytime",
    "Works on web & desktop",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PharmaSaaS</span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">
            Start Your Free Trial
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Set up your pharmacy management system in minutes.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Pharmacy Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pharmacy / Business Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("tenantName", { required: "Business name is required" })}
                  placeholder="Al-Noor Pharmacy"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm"
                />
              </div>
              {errors.tenantName && (
                <p className="mt-1 text-xs text-red-600">{errors.tenantName.message}</p>
              )}
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("contactName", { required: "Contact name is required" })}
                  placeholder="Ahmed Al-Rashid"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm"
                />
              </div>
              {errors.contactName && (
                <p className="mt-1 text-xs text-red-600">{errors.contactName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("contactEmail", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="contact@pharmacy.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm"
                />
              </div>
              {errors.contactEmail && (
                <p className="mt-1 text-xs text-red-600">{errors.contactEmail.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("contactPhone")}
                  type="tel"
                  placeholder="+966 50 000 0000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Country *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("country", { required: "Country is required" })}
                  placeholder="Saudi Arabia"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm"
                />
              </div>
              {errors.country && (
                <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
              )}
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select a Plan *
              </label>
              {plansLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading plans…
                </div>
              ) : (
                <select
                  {...register("requestedPlanId", { required: "Please select a plan" })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm bg-white"
                >
                  <option value="">— Choose a plan —</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} · {plan.currency} {plan.price}/{plan.interval.toLowerCase()}
                      {plan.trialDays > 0 ? ` · ${plan.trialDays}-day free trial` : ""}
                    </option>
                  ))}
                </select>
              )}
              {errors.requestedPlanId && (
                <p className="mt-1 text-xs text-red-600">{errors.requestedPlanId.message}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Anything you'd like us to know…"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none text-sm resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0F5C47] text-white rounded-lg font-semibold hover:bg-[#0d4a39] transition-all disabled:opacity-60"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending request…
                </>
              ) : (
                <>
                  Request Free Trial
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0F5C47] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex relative flex-1 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] flex-col justify-center px-12 xl:px-20">
        <div className="max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6">
            Everything you need to manage your pharmacy
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Join pharmacies across the region using PharmaSaaS to streamline
            their operations.
          </p>

          <div className="space-y-4 mb-12">
            {trialBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
