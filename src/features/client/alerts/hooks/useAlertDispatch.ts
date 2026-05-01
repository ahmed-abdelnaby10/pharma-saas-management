/**
 * Dispatches branch alerts exactly once per browser session by storing
 * a per-branch flag in sessionStorage.
 */
import { useEffect } from "react";
import { useDispatchAlertsMutation } from "@/features/client/alerts/api";

export function useAlertDispatch(branchId: string | undefined) {
  const dispatch = useDispatchAlertsMutation();

  useEffect(() => {
    if (!branchId) return;

    const key = `alerts-dispatched-${branchId}`;
    if (sessionStorage.getItem(key)) return;

    dispatch.mutate(
      { branchId },
      {
        onSettled: () => {
          sessionStorage.setItem(key, "1");
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);
}
