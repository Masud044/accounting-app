import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Info } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useApprovalTracking } from "./queries";
import ApprovalDetailSheet from "./approval-detail-sheet";

// ── helpers ────────────────────────────────────────────────────────────────────
const fmtMoney = (val) =>
  Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusBadgeCls = (status) =>
  status === "Approved"
    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    : status === "Rejected"
    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

export default function ApprovalDashboardPage() {
  const { data: rows = [], isLoading } = useApprovalTracking();

  // ✅ Eye icon click korle ei formId set hobe, Sheet open hobe
  const [viewFormId, setViewFormId] = useState(null);

  return (
    <SectionContainer>
      <div className="p-4 space-y-4 bg-white dark:bg-background rounded-lg mt-4 shadow-md">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base text-gray-800 dark:text-foreground">
              Purchase Recognition — Approval Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Review the full form before approving or rejecting
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/dashboard/purchase-recognition">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to List
            </Link>
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="px-3 py-2 text-left font-semibold">Form ID</th>
                <th className="px-3 py-2 text-left font-semibold">PO Number</th>
                <th className="px-3 py-2 text-left font-semibold">Vendor</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    <Spinner className="h-5 w-5 inline mr-2" /> Loading approval queue...
                  </td>
                </tr>
              )}

              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No forms pending approval.
                  </td>
                </tr>
              )}

              {rows.map((row) => (
                <tr key={row.FORM_ID} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{row.FORM_ID}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.PO_NUMBER}</td>
                  <td className="px-3 py-2">{row.VENDOR_NAME}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(row.TOTAL_AMOUNT)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(row.OVERALL_STATUS)}`}
                      title={row.OVERALL_STATUS === "Rejected" ? row.REJECT_REASON || "" : undefined}
                    >
                      {row.OVERALL_STATUS}
                      {row.OVERALL_STATUS === "Rejected" && row.REJECT_REASON && (
                        <Info className="h-3 w-3" />
                      )}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2"
                      onClick={() => setViewFormId(row.FORM_ID)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      {row.OVERALL_STATUS === "Pending" ? "Review" : "View"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Sheet — shob details dekhe tarpor Approve/Reject ── */}
      <ApprovalDetailSheet
        open={!!viewFormId}
        formId={viewFormId}
        onOpenChange={(isOpen) => { if (!isOpen) setViewFormId(null); }}
      />
    </SectionContainer>
  );
}