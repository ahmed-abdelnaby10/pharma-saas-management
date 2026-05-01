import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { PLATFORM_SIGNUP_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  SignupRequest,
  SignupRequestListParams,
  ApproveSignupRequestPayload,
  ApproveSignupRequestResponse,
  RejectSignupRequestPayload,
} from "./signup-requests.types";

// ─── List ─────────────────────────────────────────────────────────────────────

export function useSignupRequestsQuery(
  params?: SignupRequestListParams,
  options?: Partial<UseQueryOptions<SignupRequest[]>>,
) {
  return useQuery<SignupRequest[]>({
    queryKey: QUERY_KEYS.platform.signupRequests.list(params),
    queryFn: () =>
      get<SignupRequest[]>(PLATFORM_SIGNUP_API.list, { params }),
    ...options,
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export function useSignupRequestQuery(
  id: string,
  options?: Partial<UseQueryOptions<SignupRequest>>,
) {
  return useQuery<SignupRequest>({
    queryKey: QUERY_KEYS.platform.signupRequests.detail(id),
    queryFn: () => get<SignupRequest>(PLATFORM_SIGNUP_API.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Approve ─────────────────────────────────────────────────────────────────

export function useApproveSignupRequestMutation() {
  const qc = useQueryClient();
  return useMutation<
    ApproveSignupRequestResponse,
    Error,
    { id: string; payload: ApproveSignupRequestPayload }
  >({
    mutationFn: ({ id, payload }) =>
      post<ApproveSignupRequestResponse, ApproveSignupRequestPayload>(
        PLATFORM_SIGNUP_API.approve(id),
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.platform.signupRequests.all,
      });
    },
  });
}

// ─── Reject ───────────────────────────────────────────────────────────────────

export function useRejectSignupRequestMutation() {
  const qc = useQueryClient();
  return useMutation<
    SignupRequest,
    Error,
    { id: string; payload: RejectSignupRequestPayload }
  >({
    mutationFn: ({ id, payload }) =>
      post<SignupRequest, RejectSignupRequestPayload>(
        PLATFORM_SIGNUP_API.reject(id),
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.platform.signupRequests.all,
      });
    },
  });
}
