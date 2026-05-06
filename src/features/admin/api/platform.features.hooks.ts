import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/shared/api/request";
import { PLATFORM_FEATURES, QUERY_KEYS } from "@/shared/utils/constants";
import type { FeatureDefinition } from "./platform.types";

export function useFeatureDefinitions(includeInactive = true) {
  const { data = [], isLoading, error } = useQuery<FeatureDefinition[]>({
    queryKey: [
      ...QUERY_KEYS.platform.featureDefinitions,
      { includeInactive },
    ] as const,
    queryFn: () =>
      get<FeatureDefinition[]>(`/api/v1${PLATFORM_FEATURES}`, {
        params: includeInactive ? { includeInactive: true } : undefined,
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const definitionMap = useMemo(
    () => new Map(data.map((definition) => [definition.key, definition])),
    [data],
  );

  return {
    definitions: data,
    definitionMap,
    isLoading,
    error,
  };
}
