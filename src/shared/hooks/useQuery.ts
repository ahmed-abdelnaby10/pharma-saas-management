import { get } from "@/shared/api";
import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AppRequestConfig } from "@/shared/api";

type CustomQueryParams<
  TData,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey,
> = {
  endpoint: string;
  queryKey: TQueryKey;
  requestConfig?: AppRequestConfig;
  options?: Omit<
    UseQueryOptions<TData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >;
};

export function useCustomQuery<
  TData = unknown,
  TError = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  endpoint,
  queryKey,
  requestConfig,
  options,
}: CustomQueryParams<TData, TError, TQueryKey>) {
  return useQuery({
    queryKey,
    queryFn: () => get<TData>(endpoint, requestConfig),
    ...options,
  });
}
