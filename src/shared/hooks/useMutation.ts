import { edit, patch, post, remove } from "@/shared/api";
import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AppRequestConfig } from "@/shared/api";

type MutationParams<TData, TVariables> = {
  endpoint: string;
  invalidateQueryKeys?: readonly QueryKey[];
  requestConfig?: AppRequestConfig<TVariables>;
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">;
};

async function invalidateQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKeys?: readonly QueryKey[],
) {
  if (!queryKeys?.length) return;

  await Promise.all(
    queryKeys.map((queryKey) =>
      queryClient.invalidateQueries({
        queryKey,
      }),
    ),
  );
}

export function useCustomPost<TData = unknown, TVariables = unknown>({
  endpoint,
  invalidateQueryKeys,
  requestConfig,
  options,
}: MutationParams<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TVariables) => post<TData, TVariables>(endpoint, body, requestConfig),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateQueries(queryClient, invalidateQueryKeys);
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useCustomUpdate<TData = unknown, TVariables = unknown>({
  endpoint,
  invalidateQueryKeys,
  requestConfig,
  options,
}: MutationParams<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TVariables) => edit<TData, TVariables>(endpoint, body, requestConfig),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateQueries(queryClient, invalidateQueryKeys);
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useCustomPatch<TData = unknown, TVariables = unknown>({
  endpoint,
  invalidateQueryKeys,
  requestConfig,
  options,
}: MutationParams<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: TVariables) => patch<TData, TVariables>(endpoint, body, requestConfig),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateQueries(queryClient, invalidateQueryKeys);
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useCustomRemove<TData = unknown>({
  endpoint,
  invalidateQueryKeys,
  requestConfig,
  options,
}: Omit<MutationParams<TData, void>, "endpoint"> & { endpoint: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => remove<TData>(endpoint, requestConfig),
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await invalidateQueries(queryClient, invalidateQueryKeys);
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
