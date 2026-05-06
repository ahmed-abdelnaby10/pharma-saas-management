import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Check, X, Plus, Edit2, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  usePlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  type Plan,
  type CreatePlanPayload,
} from "@/features/admin/api";
import { toast } from "sonner";

// ─── Create / Edit Plan Modal ─────────────────────────────────────────────────

interface PlanModalProps {
  plan?: Plan;
  onClose: () => void;
}

type PlanFeatureInput = {
  featureKey: string;
  enabled: boolean;
  limitValue?: number;
};

type PlanFormValues = {
  code: string;
  name: string;
  description: string;
  billingInterval: "monthly" | "yearly";
  price: number;
  currency: string;
  trialDays: number;
  isActive: boolean;
  branchesMaxEnabled: boolean;
  branchesMaxLimitValue: number;
  medicinesEnabled: boolean;
};

function PlanModal({ plan, onClose }: PlanModalProps) {
  const { t } = useLanguage();
  const isEdit = !!plan;
  const createMutation = useCreatePlanMutation();
  const updateMutation = useUpdatePlanMutation();

  const featuresByKey = useMemo(() => {
    return new Map((plan?.features ?? []).map((feature) => [feature.featureKey, feature]));
  }, [plan?.features]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PlanFormValues>({
    defaultValues: {
      code: "",
      name: "",
      description: "",
      billingInterval: "monthly",
      price: 0,
      currency: "EGP",
      trialDays: 14,
      isActive: true,
      branchesMaxEnabled: true,
      branchesMaxLimitValue: 1,
      medicinesEnabled: true,
    },
  });

  useEffect(() => {
    reset({
      code: plan?.code ?? "",
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      billingInterval: plan?.billingInterval ?? "monthly",
      price: plan?.price ?? 0,
      currency: plan?.currency ?? "EGP",
      trialDays: plan?.trialDays ?? 14,
      isActive: plan?.isActive ?? true,
      branchesMaxEnabled: featuresByKey.get("branches.max")?.enabled ?? true,
      branchesMaxLimitValue:
        featuresByKey.get("branches.max")?.limitValue ?? plan?.maxBranches ?? 1,
      medicinesEnabled: featuresByKey.get("catalog.medicines")?.enabled ?? true,
    });
  }, [featuresByKey, plan, reset]);

  function onSubmit(values: PlanFormValues) {
    const features: PlanFeatureInput[] = [
      {
        featureKey: "catalog.medicines",
        enabled: values.medicinesEnabled,
      },
      {
        featureKey: "branches.max",
        enabled: values.branchesMaxEnabled,
        ...(values.branchesMaxEnabled
          ? { limitValue: Number(values.branchesMaxLimitValue) }
          : {}),
      },
    ];

    const payload: CreatePlanPayload = {
      code: values.code.trim(),
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      billingInterval: values.billingInterval,
      price: Number(values.price),
      currency: values.currency.trim().toUpperCase(),
      trialDays: Number(values.trialDays),
      isActive: values.isActive,
      features,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: plan.id, ...payload },
        {
          onSuccess: () => {
            toast.success(t("adminPlans:actions.editPlan"));
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(t("adminPlans:header.createPlan"));
          onClose();
        },
      });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";
  const inputErrCls = "mt-1 text-[10px] text-red-500";
  const branchesMaxEnabled = watch("branchesMaxEnabled");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? t("adminPlans:modal.editTitle") : t("adminPlans:modal.createTitle")}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminPlans:modal.fields.code.label")}
            </label>
            <input
              {...register("code", {
                required: t("adminPlans:modal.validation.codeRequired"),
              })}
              className={inputCls}
              placeholder={t("adminPlans:modal.fields.code.placeholder")}
            />
            {errors.code && <p className={inputErrCls}>{errors.code.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminPlans:modal.fields.name.label")}
            </label>
            <input
              {...register("name", {
                required: t("adminPlans:modal.validation.nameRequired"),
              })}
              className={inputCls}
              placeholder={t("adminPlans:modal.fields.name.placeholder")}
            />
            {errors.name && <p className={inputErrCls}>{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("adminPlans:modal.fields.description.label")}
            </label>
            <input
              {...register("description")}
              className={inputCls}
              placeholder={t("adminPlans:modal.fields.description.placeholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminPlans:modal.fields.billingInterval.label")}
              </label>
              <select
                {...register("billingInterval", {
                  required: t("adminPlans:modal.validation.billingIntervalRequired"),
                })}
                className={inputCls}
              >
                <option value="monthly">
                  {t("adminPlans:modal.fields.billingInterval.monthly")}
                </option>
                <option value="yearly">
                  {t("adminPlans:modal.fields.billingInterval.yearly")}
                </option>
              </select>
              {errors.billingInterval && (
                <p className={inputErrCls}>{errors.billingInterval.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminPlans:modal.fields.price.label")}
              </label>
              <input
                type="number"
                min={0}
                {...register("price", {
                  required: t("adminPlans:modal.validation.priceRequired"),
                  min: {
                    value: 0,
                    message: t("adminPlans:modal.validation.priceMin"),
                  },
                  valueAsNumber: true,
                })}
                className={inputCls}
                placeholder={t("adminPlans:modal.fields.price.placeholder")}
              />
              {errors.price && <p className={inputErrCls}>{errors.price.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminPlans:modal.fields.currency.label")}
              </label>
              <input
                {...register("currency", {
                  required: t("adminPlans:modal.validation.currencyRequired"),
                })}
                className={inputCls}
                placeholder={t("adminPlans:modal.fields.currency.placeholder")}
              />
              {errors.currency && (
                <p className={inputErrCls}>{errors.currency.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminPlans:modal.fields.trialDays.label")}
              </label>
              <input
                type="number"
                min={0}
                {...register("trialDays", {
                  required: t("adminPlans:modal.validation.trialDaysRequired"),
                  min: {
                    value: 0,
                    message: t("adminPlans:modal.validation.trialDaysMin"),
                  },
                  valueAsNumber: true,
                })}
                className={inputCls}
                placeholder={t("adminPlans:modal.fields.trialDays.placeholder")}
              />
              {errors.trialDays && (
                <p className={inputErrCls}>{errors.trialDays.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-3 space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              {t("adminPlans:modal.fields.isActive.label")}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("medicinesEnabled")}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              {t("adminPlans:modal.fields.medicinesEnabled.label")}
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  {...register("branchesMaxEnabled")}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                {t("adminPlans:modal.fields.branchesMaxEnabled.label")}
              </label>
              <input
                type="number"
                min={1}
                {...register("branchesMaxLimitValue", {
                  valueAsNumber: true,
                  validate: (value) =>
                    !branchesMaxEnabled ||
                    value >= 1 ||
                    t("adminPlans:modal.validation.branchesLimitMin"),
                })}
                disabled={!branchesMaxEnabled}
                className={inputCls}
                placeholder={t("adminPlans:modal.fields.branchesMaxLimitValue.placeholder")}
              />
              {errors.branchesMaxLimitValue && (
                <p className={inputErrCls}>{errors.branchesMaxLimitValue.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("adminPlans:modal.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-60 flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? t("adminPlans:modal.actions.save") : t("adminPlans:modal.actions.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, onEdit }: { plan: Plan; onEdit: () => void }) {
  const { t } = useLanguage();

  const branchesFeature = plan.features?.find((feature) => feature.featureKey === "branches.max");
  const branchesLimit = branchesFeature?.limitValue ?? plan.maxBranches ?? "-";

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
          {plan.description && (
            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
          )}
        </div>
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-teal-600 rounded transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {plan.currency ?? "USD"} {plan.price ?? 0}
          </span>
          <span className="text-sm text-gray-500">
            {plan.billingInterval === "yearly"
              ? t("adminPlans:labels.yearlyPrice")
              : t("adminPlans:labels.monthlyPrice")}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t("adminPlans:features.branches")}</span>
          <span className="text-sm font-medium text-gray-900">{branchesLimit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{t("adminPlans:features.trialDays")}</span>
          <span className="text-sm font-medium text-gray-900">{plan.trialDays ?? 0}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
            plan.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-gray-50 text-gray-500 border-gray-200"
          }`}
        >
          {plan.isActive ? t("adminPlans:status.active") : t("adminPlans:status.inactive")}
        </span>
      </div>

      <button
        onClick={onEdit}
        className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        {t("adminPlans:actions.editPlan")}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PlansPage() {
  const { t } = useLanguage();
  const { data: plans = [], isLoading } = usePlansQuery();
  const [modalPlan, setModalPlan] = useState<Plan | null | "new">(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminPlans:header.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminPlans:header.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setModalPlan("new")}
          className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("adminPlans:header.createPlan")}
        </button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          {t("adminPlans:labels.loading")}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center text-sm text-gray-500">
          {t("adminPlans:empty")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => setModalPlan(plan)}
            />
          ))}
        </div>
      )}

      {/* Feature Comparison Table */}
      {plans.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("adminPlans:comparison.title")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t("adminPlans:comparison.subtitle")}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("adminPlans:comparison.feature")}
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {t("adminPlans:features.branches")}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.features?.find((feature) => feature.featureKey === "branches.max")
                        ?.limitValue ??
                        plan.maxBranches ??
                        "-"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {t("adminPlans:features.trialDays")}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-900">
                      {plan.trialDays ?? 0}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {t("adminPlans:table.status")}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.isActive ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalPlan !== null && (
        <PlanModal
          plan={modalPlan === "new" ? undefined : modalPlan}
          onClose={() => setModalPlan(null)}
        />
      )}
    </div>
  );
}
