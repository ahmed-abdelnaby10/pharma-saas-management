import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch, type Control, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { Check, X, Plus, Edit2, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  usePlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useFeatureDefinitions,
  type Plan,
  type CreatePlanPayload,
  type PlanFeatureFormRow,
  type FeatureDefinition,
} from "@/features/admin/api";
import { toast } from "sonner";

// ─── Create / Edit Plan Modal ─────────────────────────────────────────────────

interface PlanModalProps {
  plan?: Plan;
  onClose: () => void;
}

type PlanFormValues = {
  code: string;
  name: string;
  description: string;
  billingInterval: "monthly" | "yearly";
  price: number;
  currency: string;
  trialDays: number;
  isActive: boolean;
  features: Array<{
    featureKey: string;
    enabled: boolean;
    limitValue: number | null;
  }>;
};

type FeatureRowProps = {
  index: number;
  control: Control<PlanFormValues>;
  register: UseFormRegister<PlanFormValues>;
  setValue: UseFormSetValue<PlanFormValues>;
  remove: (index: number) => void;
  definitions: FeatureDefinition[];
  definitionMap: Map<string, FeatureDefinition>;
  selectedKeys: string[];
  featureRows: PlanFeatureFormRow[];
  isDefinitionsLoading: boolean;
  onRequestRemove: (index: number, featureKey: string) => void;
};

const FeatureRow = React.memo(function FeatureRow({
  index,
  control,
  register,
  setValue,
  remove,
  definitions,
  definitionMap,
  selectedKeys,
  featureRows,
  isDefinitionsLoading,
  onRequestRemove,
}: FeatureRowProps) {
  const { t, direction, language } = useLanguage();
  const isRtl = direction === "rtl";
  const featureKeyPath = `features.${index}.featureKey` as const;
  const enabledPath = `features.${index}.enabled` as const;
  const limitPath = `features.${index}.limitValue` as const;
  const featureKey = useWatch({ control, name: featureKeyPath }) ?? "";
  const enabled = useWatch({ control, name: enabledPath }) ?? false;
  const selectedDef = definitionMap.get(featureKey);

  const groupedOptions = useMemo(() => {
    const groups = new Map<string, FeatureDefinition[]>();
    for (const definition of definitions) {
      const moduleKey = definition.module || t("adminPlans:feature.moduleUnknown");
      const list = groups.get(moduleKey) ?? [];
      list.push(definition);
      groups.set(moduleKey, list);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [definitions, t]);

  useEffect(() => {
    if (selectedDef?.type === "boolean") {
      setValue(limitPath, null, { shouldValidate: true, shouldDirty: true });
    }
  }, [limitPath, selectedDef?.type, setValue]);

  const missingDependencies = useMemo(() => {
    if (!selectedDef || selectedDef.requiresKeys.length === 0 || !enabled) {
      return [];
    }
    return selectedDef.requiresKeys.filter((dependencyKey) => {
      const depIndex = selectedKeys.findIndex((key, idx) => idx !== index && key === dependencyKey);
      if (depIndex === -1) return true;
      const depEnabled = featureRows?.[depIndex]?.enabled ?? false;
      return !depEnabled;
    });
  }, [enabled, featureRows, index, selectedDef, selectedKeys]);

  const requiresText = selectedDef?.requiresKeys
    .map((dependencyKey) => {
      const depDef = definitionMap.get(dependencyKey);
      return language === "ar" ? depDef?.labelAr ?? depDef?.label ?? dependencyKey : depDef?.label ?? dependencyKey;
    })
    .join(", ");

  return (
    <div className="rounded-lg border border-gray-200 p-3 space-y-3">
      <div className="flex items-start gap-x-3">
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-medium text-gray-600">
            {t("adminPlans:feature.key")}
          </label>
          {isDefinitionsLoading ? (
            <div className="h-10 w-full rounded-lg border border-gray-200 flex items-center ps-3 pe-3 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin me-2" />
              {t("adminPlans:feature.loadingRegistry")}
            </div>
          ) : (
            <select
              {...register(featureKeyPath)}
              dir="ltr"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">{t("adminPlans:feature.selectPlaceholder")}</option>
              {groupedOptions.map(([module, moduleDefs]) => (
                <optgroup key={module} label={module}>
                  {moduleDefs.map((definition) => {
                    const isAlreadyAdded =
                      selectedKeys.includes(definition.key) && definition.key !== featureKey;
                    const disabled = !definition.isActive || isAlreadyAdded;
                    const suffix = !definition.isActive
                      ? ` ${t("adminPlans:feature.retired_suffix")}`
                      : isAlreadyAdded
                        ? ` - ${t("adminPlans:feature.already_added")}`
                        : "";
                    const description = definition.description.slice(0, 60);
                    return (
                      <option
                        key={definition.key}
                        value={definition.key}
                        disabled={disabled}
                        title={isAlreadyAdded ? t("adminPlans:feature.already_added") : description}
                      >
                        {definition.label} - {description}
                        {suffix}
                      </option>
                    );
                  })}
                </optgroup>
              ))}
            </select>
          )}
          {selectedDef && (
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="font-mono rounded bg-gray-100 px-1.5 py-0.5" dir="ltr">
                {selectedDef.key}
              </span>
              <span>{selectedDef.description}</span>
            </div>
          )}
          {selectedDef?.requiresKeys.length ? (
            <div
              className={`inline-flex items-center rounded px-2 py-1 text-[11px] ${
                missingDependencies.length
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {t("adminPlans:feature.requires_label", { keys: requiresText })}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="ms-auto mt-6 rounded p-1.5 text-gray-400 hover:text-red-600"
          onClick={() => (featureKey ? onRequestRemove(index, featureKey) : remove(index))}
          aria-label={t("adminPlans:feature.remove")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-3 ${isRtl ? "text-right" : "text-left"}`}>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            {...register(enabledPath)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          {t("adminPlans:feature.enabled")}
        </label>

        {selectedDef?.type === "limit" ? (
          <div>
            <input
              type="number"
              min={0}
              dir="ltr"
              {...register(limitPath, {
                setValueAs: (value) =>
                  value === "" || value === null || value === undefined
                    ? null
                    : Number(value),
              })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={t("adminPlans:feature.limit_placeholder")}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
});

function PlanModal({ plan, onClose }: PlanModalProps) {
  const { t } = useLanguage();
  const isEdit = !!plan;
  const createMutation = useCreatePlanMutation();
  const updateMutation = useUpdatePlanMutation();
  const {
    definitions,
    definitionMap,
    isLoading: isDefinitionsLoading,
  } = useFeatureDefinitions(true);

  const planFeatureSchema = useMemo(
    () =>
      z.array(
        z.object({
          featureKey: z.string().min(1, t("adminPlans:feature.key_required")),
          enabled: z.boolean(),
          limitValue: z.number().int().min(0).nullable(),
        }),
      ).superRefine((features, ctx) => {
        const seen = new Set<string>();
        const enabledKeys = new Set(
          features.filter((feature) => feature.enabled).map((feature) => feature.featureKey),
        );

        features.forEach((feature, index) => {
          if (seen.has(feature.featureKey)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("adminPlans:feature.duplicate_key"),
              path: [index, "featureKey"],
            });
          }
          seen.add(feature.featureKey);

          const definition = definitionMap.get(feature.featureKey);
          if (!definition) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("adminPlans:feature.key_required"),
              path: [index, "featureKey"],
            });
            return;
          }

          if (definition.type === "boolean" && feature.limitValue != null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("adminPlans:feature.limit_value_not_allowed"),
              path: [index, "limitValue"],
            });
          }

          if (definition.type === "limit" && feature.limitValue == null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("adminPlans:feature.limit_value_required"),
              path: [index, "limitValue"],
            });
          }

          if (feature.enabled) {
            definition.requiresKeys.forEach((dependencyKey) => {
              if (!enabledKeys.has(dependencyKey)) {
                const depDefinition = definitionMap.get(dependencyKey);
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: t("adminPlans:feature.missing_dependency", {
                    key: depDefinition?.label ?? dependencyKey,
                  }),
                  path: [index, "featureKey"],
                });
              }
            });
          }
        });
      }),
    [definitionMap, t],
  );

  const schema = useMemo(
    () =>
      z.object({
        code: z.string().min(1, t("adminPlans:modal.validation.codeRequired")),
        name: z.string().min(1, t("adminPlans:modal.validation.nameRequired")),
        description: z.string(),
        billingInterval: z.enum(["monthly", "yearly"]),
        price: z.number().min(0, t("adminPlans:modal.validation.priceMin")),
        currency: z.string().min(1, t("adminPlans:modal.validation.currencyRequired")),
        trialDays: z.number().int().min(0, t("adminPlans:modal.validation.trialDaysMin")),
        isActive: z.boolean(),
        features: planFeatureSchema,
      }),
    [planFeatureSchema, t],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      billingInterval: "monthly",
      price: 0,
      currency: "EGP",
      trialDays: 14,
      isActive: true,
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const watchedFeatureValues = useWatch({ control, name: "features" });
  const featureValues = useMemo(
    () => watchedFeatureValues ?? [],
    [watchedFeatureValues],
  );
  const selectedKeys = useMemo(
    () => featureValues.map((row) => row?.featureKey || ""),
    [featureValues],
  );

  useEffect(() => {
    const normalizedRows: PlanFeatureFormRow[] =
      plan?.features?.map((feature) => ({
        featureKey: feature.featureKey,
        enabled: feature.enabled,
        limitValue: feature.limitValue ?? null,
      })) ?? [];

    reset({
      code: plan?.code ?? "",
      name: plan?.name ?? "",
      description: plan?.description ?? "",
      billingInterval: plan?.billingInterval ?? "monthly",
      price: plan?.price ?? 0,
      currency: plan?.currency ?? "EGP",
      trialDays: plan?.trialDays ?? 14,
      isActive: plan?.isActive ?? true,
      features: normalizedRows,
    });
  }, [plan, reset]);

  function onRequestRemove(index: number, featureKey: string) {
    const currentFeatures = getValues("features");
    const hasDependents = currentFeatures.some((row, rowIndex) => {
      if (rowIndex === index || !row.enabled) return false;
      const definition = definitionMap.get(row.featureKey);
      return definition?.requiresKeys.includes(featureKey);
    });

    if (hasDependents) {
      const confirmed = confirm(t("adminPlans:feature.remove_has_dependents"));
      if (!confirmed) return;
    }

    remove(index);
  }

  function onSubmit(values: PlanFormValues) {
    const payload: CreatePlanPayload = {
      code: values.code.trim(),
      name: values.name.trim(),
      description: values.description.trim() || undefined,
      billingInterval: values.billingInterval,
      price: Number(values.price),
      currency: values.currency.trim().toUpperCase(),
      trialDays: Number(values.trialDays),
      isActive: values.isActive,
      features: values.features.map((feature) => {
        const definition = definitionMap.get(feature.featureKey);
        return {
          featureKey: feature.featureKey,
          enabled: feature.enabled,
          ...(definition?.type === "limit"
            ? { limitValue: feature.limitValue ?? 0 }
            : {}),
        };
      }),
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
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t("adminPlans:header.createPlan"));
        onClose();
      },
    });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const inputCls =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500";
  const inputErrCls = "mt-1 text-[10px] text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
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
              {errors.billingInterval && <p className={inputErrCls}>{errors.billingInterval.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("adminPlans:modal.fields.price.label")}
              </label>
              <input
                type="number"
                min={0}
                {...register("price", { valueAsNumber: true })}
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
                {...register("currency")}
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
                {...register("trialDays", { valueAsNumber: true })}
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
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">
                {t("adminPlans:feature.section_title")}
              </h4>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                onClick={() =>
                  append({
                    featureKey: "",
                    enabled: true,
                    limitValue: null,
                  })
                }
              >
                <Plus className="w-3 h-3" />
                {t("adminPlans:feature.add")}
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-sm text-gray-500">
                {t("adminPlans:feature.none")}
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id}>
                    <FeatureRow
                      index={index}
                      control={control}
                      register={register}
                      setValue={setValue}
                      remove={remove}
                      definitions={definitions}
                      definitionMap={definitionMap}
                      selectedKeys={selectedKeys}
                      featureRows={featureValues}
                      isDefinitionsLoading={isDefinitionsLoading}
                      onRequestRemove={onRequestRemove}
                    />
                    {errors.features?.[index]?.featureKey?.message ? (
                      <p className={inputErrCls}>{errors.features[index]?.featureKey?.message}</p>
                    ) : null}
                    {errors.features?.[index]?.limitValue?.message ? (
                      <p className={inputErrCls}>{errors.features[index]?.limitValue?.message}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
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
  const { t, language } = useLanguage();

  const sortedFeatures = useMemo(() => {
    const list = [...(plan.features ?? [])];
    list.sort((a, b) => Number(b.enabled) - Number(a.enabled));
    const grouped = new Map<string, typeof list>();
    list.forEach((feature) => {
      const moduleName = feature.module || t("adminPlans:feature.moduleUnknown");
      const arr = grouped.get(moduleName) ?? [];
      arr.push(feature);
      grouped.set(moduleName, arr);
    });
    return Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [plan.features, t]);

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
        {sortedFeatures.length === 0 ? (
          <p className="text-sm text-gray-500">{t("adminPlans:feature.none")}</p>
        ) : (
          sortedFeatures.map(([moduleName, features]) => (
            <div key={moduleName} className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {moduleName}
              </p>
              {features.map((feature) => {
                const isLimit = feature.type === "limit";
                const featureLabel = language === "ar" ? feature.labelAr || feature.label : feature.label;
                return (
                  <div key={`${plan.id}-${feature.featureKey}`} className="rounded border border-gray-200 p-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-medium text-gray-900"
                        dir={language === "ar" ? "rtl" : "ltr"}
                        title={feature.description}
                      >
                        {featureLabel}
                      </span>
                      {!feature.isActive && (
                        <span className="text-[10px] rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">
                          {t("adminPlans:feature.retired_suffix")}
                        </span>
                      )}
                      <span className={`text-[10px] rounded px-1.5 py-0.5 ${isLimit ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {isLimit ? t("adminPlans:feature.type_limit") : t("adminPlans:feature.type_boolean")}
                      </span>
                      <span className={`text-[10px] rounded px-1.5 py-0.5 ${feature.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {feature.enabled ? t("adminPlans:status.active") : t("adminPlans:status.inactive")}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="font-mono rounded bg-gray-100 px-1.5 py-0.5" dir="ltr">
                        {feature.featureKey}
                      </span>
                      {isLimit && (
                        <span>
                          {feature.limitValue === 0
                            ? t("common:unlimited")
                            : feature.limitValue}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
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
  const { t, language } = useLanguage();
  const { data: plans = [], isLoading } = usePlansQuery();
  const [modalPlan, setModalPlan] = useState<Plan | null | "new">(null);

  const comparisonFeatures = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        label: string;
        description: string;
        type: "boolean" | "limit";
        module: string;
      }
    >();

    for (const plan of plans) {
      for (const feature of plan.features ?? []) {
        if (map.has(feature.featureKey)) continue;
        map.set(feature.featureKey, {
          key: feature.featureKey,
          label: language === "ar" ? feature.labelAr || feature.label : feature.label,
          description:
            language === "ar"
              ? feature.descriptionAr || feature.description
              : feature.description,
          type: feature.type,
          module: feature.module,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.module !== b.module) return a.module.localeCompare(b.module);
      return a.label.localeCompare(b.label);
    });
  }, [language, plans]);

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
                {comparisonFeatures.map((comparisonFeature) => (
                  <tr key={comparisonFeature.key} className="hover:bg-gray-50">
                    <td
                      className="px-6 py-4 text-sm font-medium text-gray-900"
                      title={comparisonFeature.description}
                    >
                      <div className="flex items-center gap-2">
                        <span>{comparisonFeature.label}</span>
                        <span
                          className={`text-[10px] rounded px-1.5 py-0.5 ${
                            comparisonFeature.type === "limit"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {comparisonFeature.type === "limit"
                            ? t("adminPlans:feature.type_limit")
                            : t("adminPlans:feature.type_boolean")}
                        </span>
                      </div>
                    </td>
                    {plans.map((plan) => {
                      const featureValue = (plan.features ?? []).find(
                        (feature) => feature.featureKey === comparisonFeature.key,
                      );

                      if (!featureValue) {
                        return (
                          <td
                            key={plan.id}
                            className="px-6 py-4 text-center text-sm text-gray-400"
                          >
                            -
                          </td>
                        );
                      }

                      if (comparisonFeature.type === "boolean") {
                        return (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {featureValue.enabled ? (
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                        );
                      }

                      return (
                        <td key={plan.id} className="px-6 py-4 text-center text-sm text-gray-900">
                          {featureValue.limitValue === 0
                            ? t("common:unlimited")
                            : featureValue.limitValue ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}

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
