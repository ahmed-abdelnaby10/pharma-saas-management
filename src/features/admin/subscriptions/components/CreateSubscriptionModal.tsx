import React from "react";
import { Loader2, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  usePlansQuery,
  useCreateSubscriptionMutation,
} from "@/features/admin/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface CreateSubscriptionModalProps {
  tenantId: string;
  tenantName: string;
  onClose: () => void;
}

interface CreateSubscriptionFormValues {
  planId: string;
}

export default function CreateSubscriptionModal({
  tenantId,
  tenantName,
  onClose,
}: CreateSubscriptionModalProps) {
  const { t } = useLanguage();
  const { data: plans = [], isLoading: plansLoading } = usePlansQuery();
  const createSub = useCreateSubscriptionMutation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSubscriptionFormValues>({
    defaultValues: { planId: "" },
  });

  function planOptionLabel(plan: {
    name: string;
    billingInterval?: "monthly" | "yearly";
    price?: number | string;
    monthlyPrice?: number;
    currency?: string;
  }) {
    const rawPrice = plan.price ?? plan.monthlyPrice ?? 0;
    const price =
      typeof rawPrice === "string" ? Number(rawPrice || 0) : rawPrice;
    const cycle = plan.billingInterval === "yearly" ? "year" : "month";
    const currency = plan.currency ?? "EGP";
    return `${plan.name} -- ${price} ${currency} / ${cycle}`;
  }

  function onSubmit(values: CreateSubscriptionFormValues) {
    if (!values.planId) return;
    createSub.mutate({ tenantId, planId: values.planId }, { onSuccess: onClose });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("adminSubscriptions:modal.createTitle", { tenantName })}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("adminSubscriptions:modal.fields.plan.label")}
            </label>
            {plansLoading ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("adminSubscriptions:modal.actions.loadingPlans")}
              </div>
            ) : (
              <Controller
                name="planId"
                control={control}
                rules={{ required: t("adminSubscriptions:modal.validation.planRequired") }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("adminSubscriptions:modal.fields.plan.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {planOptionLabel(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
            {errors.planId && (
              <p className="text-red-500 text-[10px] mt-1">
                {errors.planId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminSubscriptions:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={createSub.isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {createSub.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("adminSubscriptions:modal.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
