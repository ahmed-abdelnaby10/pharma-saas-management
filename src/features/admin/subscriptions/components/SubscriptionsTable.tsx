import { useLanguage } from "@/app/contexts/useLanguage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import TableSkeleton from "@/shared/components/TableSkeleton";
import TenantSubscriptionsRow, { type TenantListRow } from "./TenantSubscriptionsRow";

interface SubscriptionsTableProps {
  tenants: TenantListRow[];
  totalTenants: number;
  isLoading: boolean;
  onConfirmCancel: (tenantId: string) => Promise<void> | void;
}

export default function SubscriptionsTable({
  tenants,
  totalTenants,
  isLoading,
  onConfirmCancel,
}: SubscriptionsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("adminSubscriptions:table.tenant")}
                </TableHead>
                <TableHead className="px-6 py-3 ltr:text-left rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("adminSubscriptions:table.subscriptions")}
                </TableHead>
                <TableHead className="px-6 py-3 ltr:text-right rtl:text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("adminSubscriptions:table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {tenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="py-12 text-center text-sm text-gray-500">
                    {t("adminSubscriptions:table.empty")}
                  </TableCell>
                </TableRow>
              )}
              {tenants.map((tenant) => (
                <TenantSubscriptionsRow
                  key={tenant.id}
                  tenant={tenant}
                  onConfirmCancel={onConfirmCancel}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
        {t("adminSubscriptions:footer.showing", {
          filtered: tenants.length,
          total: totalTenants,
        })}
      </div>
    </div>
  );
}
