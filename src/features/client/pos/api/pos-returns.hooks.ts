import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type { SaleReturn, CreateSaleReturnPayload } from "./pos-returns.types";

export function useCreateSaleReturnMutation() {
  const qc = useQueryClient();
  return useMutation<SaleReturn, Error, { saleId: string; payload: CreateSaleReturnPayload }>({
    mutationFn: ({ saleId, payload }) =>
      post<SaleReturn, CreateSaleReturnPayload>(
        TENANT_API.posReturns.create(saleId),
        payload,
      ),
    onSuccess: () => {
      // Invalidate POS history so the returned sale reflects the update
      qc.invalidateQueries({ queryKey: QUERY_KEYS.pos.all });
    },
  });
}
