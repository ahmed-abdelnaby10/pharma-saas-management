import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, patch } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type { TenantSettings, UpdateSettingsPayload } from "./settings.types";

export function useSettingsQuery(
  options?: Partial<UseQueryOptions<TenantSettings>>,
) {
  return useQuery<TenantSettings>({
    queryKey: QUERY_KEYS.settings.all,
    queryFn: () => get<TenantSettings>(TENANT_API.settings.get),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useUpdateSettingsMutation() {
  const qc = useQueryClient();
  return useMutation<TenantSettings, Error, UpdateSettingsPayload>({
    mutationFn: (payload) =>
      patch<TenantSettings, UpdateSettingsPayload>(TENANT_API.settings.update, payload),
    onSuccess: (updated) => {
      qc.setQueryData(QUERY_KEYS.settings.all, updated);
    },
  });
}
