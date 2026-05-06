import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { onTokensRefreshed } from "../services/auth";

export default function TokenRefreshSubscriber() {
  const qc = useQueryClient();

  useEffect(() => {
    const unsubscribe = onTokensRefreshed(() => {
      // Token refresh should not blow away the whole cache.
      // Keep data queries cached and only refresh user identity state.
      qc.invalidateQueries({ queryKey: ["me"] });
    });
    return unsubscribe;
  }, [qc]);

  return null;
}
