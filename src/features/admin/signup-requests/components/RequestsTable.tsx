import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { formatDateTime } from "@/shared/utils/format";
import StatusBadge from "./StatusBadge";
import { useLanguage } from "@/app/contexts/useLanguage";
import { RejectState, SignupRequest } from "../api";
import { Dispatch, SetStateAction } from "react";

interface Props {
  requests: SignupRequest[];
  setApprovingRequest: Dispatch<SetStateAction<SignupRequest | null>>;
  setRejectState: Dispatch<SetStateAction<RejectState | null>>;
}

export default function RequestsTable({
  requests,
  setApprovingRequest,
  setRejectState,
}: Props) {
  const { t, language } = useLanguage();

  const requestBusinessName = (req: SignupRequest) =>
    language === "en"
      ? req.pharmacyNameEn
      : (req.pharmacyNameAr ?? t("adminSignupRequests:table.emptyValue"));
  const requestContactName = (req: SignupRequest) =>
    req.fullName ?? t("adminSignupRequests:table.emptyValue");
  const requestContactEmail = (req: SignupRequest) =>
    req.email ?? t("adminSignupRequests:table.emptyValue");
  const requestPlan = (req: SignupRequest) =>
    req.plan?.name ?? t("adminSignupRequests:table.emptyValue");
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <Table className="w-full text-sm">
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow>
            <TableHead className="px-4 py-3 ltr:text-left rtl:text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("adminSignupRequests:table.business")}
            </TableHead>
            <TableHead className="px-4 py-3 ltr:text-left rtl:text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("adminSignupRequests:table.contact")}
            </TableHead>
            <TableHead className="px-4 py-3 ltr:text-left rtl:text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              {t("adminSignupRequests:table.plan")}
            </TableHead>
            <TableHead className="px-4 py-3 ltr:text-left rtl:text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              {t("adminSignupRequests:table.submitted")}
            </TableHead>
            <TableHead className="px-4 py-3 ltr:text-left rtl:text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("adminSignupRequests:table.status")}
            </TableHead>
            <TableHead className="px-4 py-3" />
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100">
          {requests.map((req) => (
            <TableRow
              key={req.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="px-4 py-3">
                <p className="font-medium text-gray-900">
                  {requestBusinessName(req)}
                </p>
              </TableCell>
              <TableCell className="px-4 py-3">
                <p className="text-gray-900">{requestContactName(req)}</p>
                <p className="text-xs text-gray-500">
                  {requestContactEmail(req)}
                </p>
              </TableCell>
              <TableCell className="px-4 py-3 hidden md:table-cell text-gray-600">
                {requestPlan(req)}
              </TableCell>
              <TableCell className="px-4 py-3 hidden lg:table-cell text-gray-500">
                {formatDateTime(req.createdAt, language)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <StatusBadge status={req.status} />
              </TableCell>
              <TableCell className="px-4 py-3">
                {req.status === "PENDING" && (
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setApprovingRequest(req)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-[#0F5C47] rounded-lg hover:bg-[#0d4a39] transition-colors"
                    >
                      {t("adminSignupRequests:actions.approve")}
                    </button>
                    <button
                      onClick={() =>
                        setRejectState({
                          id: req.id,
                          name: requestBusinessName(req),
                        })
                      }
                      className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      {t("adminSignupRequests:actions.reject")}
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
