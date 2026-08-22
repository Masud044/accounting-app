// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Eye, Info } from "lucide-react";
// import { SectionContainer } from "@/components/SectionContainer";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { useApprovalTracking } from "./queries";
// import ApprovalDetailSheet from "./approval-detail-sheet";

// // ── helpers ────────────────────────────────────────────────────────────────────
// const fmtMoney = (val) =>
//   Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// const statusBadgeCls = (status) =>
//   status === "Approved"
//     ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
//     : status === "Rejected"
//     ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
//     : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

// export default function ApprovalDashboardPage() {
//   const { data: rows = [], isLoading } = useApprovalTracking();

//   // ✅ Eye icon click korle ei formId set hobe, Sheet open hobe
//   const [viewFormId, setViewFormId] = useState(null);

//   return (
//     <SectionContainer>
//       <div className="p-4 space-y-4 bg-white dark:bg-background rounded-lg mt-4 shadow-md">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="font-semibold text-base text-gray-800 dark:text-foreground">
//               Purchase Recognition — Approval Dashboard
//             </h2>
//             <p className="text-sm text-muted-foreground">
//               Review the full form before approving or rejecting
//             </p>
//           </div>
//           <Button asChild variant="outline">
//             <Link to="/dashboard/purchase-recognition">
//               <ArrowLeft className="h-4 w-4 mr-1" /> Back to List
//             </Link>
//           </Button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-md border border-border">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="bg-muted/40">
//                 <th className="px-3 py-2 text-left font-semibold">Form ID</th>
//                 <th className="px-3 py-2 text-left font-semibold">PO Number</th>
//                 <th className="px-3 py-2 text-left font-semibold">Vendor</th>
//                 <th className="px-3 py-2 text-right font-semibold">Amount</th>
//                 <th className="px-3 py-2 text-left font-semibold">Status</th>
//                 <th className="px-3 py-2 text-right font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading && (
//                 <tr>
//                   <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
//                     <Spinner className="h-5 w-5 inline mr-2" /> Loading approval queue...
//                   </td>
//                 </tr>
//               )}

//               {!isLoading && rows.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
//                     No forms pending approval.
//                   </td>
//                 </tr>
//               )}

//               {rows.map((row) => (
//                 <tr key={row.FORM_ID} className="border-t border-border">
//                   <td className="px-3 py-2 font-medium">{row.FORM_ID}</td>
//                   <td className="px-3 py-2 text-muted-foreground">{row.PO_NUMBER}</td>
//                   <td className="px-3 py-2">{row.VENDOR_NAME}</td>
//                   <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(row.TOTAL_AMOUNT)}</td>
//                   <td className="px-3 py-2">
//                     <span
//                       className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(row.OVERALL_STATUS)}`}
//                       title={row.OVERALL_STATUS === "Rejected" ? row.REJECT_REASON || "" : undefined}
//                     >
//                       {row.OVERALL_STATUS}
//                       {row.OVERALL_STATUS === "Rejected" && row.REJECT_REASON && (
//                         <Info className="h-3 w-3" />
//                       )}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2 text-right">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="h-7 px-2"
//                       onClick={() => setViewFormId(row.FORM_ID)}
//                     >
//                       <Eye className="h-3.5 w-3.5 mr-1" />
//                       {row.OVERALL_STATUS === "Pending" ? "Review" : "View"}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Detail Sheet — shob details dekhe tarpor Approve/Reject ── */}
//       <ApprovalDetailSheet
//         open={!!viewFormId}
//         formId={viewFormId}
//         onOpenChange={(isOpen) => { if (!isOpen) setViewFormId(null); }}
//       />
//     </SectionContainer>
//   );
// }

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, Info, CheckCircle, XCircle, Clock, FileText, Users, DollarSign } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useApprovalTracking } from "./queries";
import ApprovalDetailSheet from "./approval-detail-sheet";

// ── helpers ────────────────────────────────────────────────────────────────────
const fmtMoney = (val) =>
  Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusBadgeCls = (status) =>
  status === "Approved"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : status === "Rejected"
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

const statusIcon = (status) => {
  if (status === "Approved") return <CheckCircle className="h-3.5 w-3.5" />;
  if (status === "Rejected") return <XCircle className="h-3.5 w-3.5" />;
  return <Clock className="h-3.5 w-3.5" />;
};

export default function ApprovalDashboardPage() {
  const { data: rows = [], isLoading } = useApprovalTracking();

  const [viewFormId, setViewFormId] = useState(null);

  // Stats
  const total = rows.length;
  const pending = rows.filter((r) => r.OVERALL_STATUS === "Pending").length;
  const approved = rows.filter((r) => r.OVERALL_STATUS === "Approved").length;
  const rejected = rows.filter((r) => r.OVERALL_STATUS === "Rejected").length;

  return (
    <SectionContainer>
      <div className="space-y-6 px-6 py-5">
        {/* Header Card */}
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm">
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Approval Dashboard</h2>
                  <p className="text-xs text-gray-400">Purchase Recognition — Review & Approve</p>
                </div>
              </div>
              <Button asChild variant="outline" className="border-gray-200 bg-white hover:bg-gray-50">
                <Link to="/dashboard/purchase-recognition">
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to List
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
            <div className="bg-white px-4 py-3.5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-lg font-bold text-gray-900">{total}</p>
            </div>
            <div className="bg-white px-4 py-3.5">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Pending</p>
              <p className="text-lg font-bold text-amber-600">{pending}</p>
            </div>
            <div className="bg-white px-4 py-3.5">
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Approved</p>
              <p className="text-lg font-bold text-emerald-600">{approved}</p>
            </div>
            <div className="bg-white px-4 py-3.5">
              <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Rejected</p>
              <p className="text-lg font-bold text-red-600">{rejected}</p>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Approval Queue</span>
              {!isLoading && rows.length > 0 && (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 ml-1">
                  {rows.length} {rows.length === 1 ? "item" : "items"}
                </Badge>
              )}
            </div>
            {!isLoading && rows.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-500">{pending} pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500">{approved} approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-500">{rejected} rejected</span>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Form ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Spinner className="h-6 w-6 text-emerald-600" />
                        <p className="text-sm text-gray-400">Loading approval queue...</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                          <CheckCircle size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">All caught up!</p>
                        <p className="text-xs text-gray-400">No forms pending approval</p>
                      </div>
                    </td>
                  </tr>
                )}

                {rows.map((row) => (
                  <tr key={row.FORM_ID} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-medium text-gray-900">
                        {row.FORM_ID}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 font-mono">
                        {row.PO_NUMBER}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{row.VENDOR_NAME}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        {fmtMoney(row.TOTAL_AMOUNT)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeCls(row.OVERALL_STATUS)}`}
                        title={row.OVERALL_STATUS === "Rejected" ? row.REJECT_REASON || "" : undefined}
                      >
                        {statusIcon(row.OVERALL_STATUS)}
                        {row.OVERALL_STATUS}
                        {row.OVERALL_STATUS === "Rejected" && row.REJECT_REASON && (
                          <Info className="h-3 w-3 text-red-500" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className={`h-8 px-3 border-gray-200 hover:border-gray-300 transition-all ${
                          row.OVERALL_STATUS === "Pending" 
                            ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:text-emerald-800" 
                            : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => setViewFormId(row.FORM_ID)}
                      >
                        <Eye className={`h-3.5 w-3.5 mr-1.5 ${row.OVERALL_STATUS === "Pending" ? "text-emerald-600" : "text-gray-500"}`} />
                        {row.OVERALL_STATUS === "Pending" ? "Review" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!isLoading && rows.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {rows.length} {rows.length === 1 ? "entry" : "entries"}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500">Approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-500">Rejected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Sheet ── */}
      <ApprovalDetailSheet
        open={!!viewFormId}
        formId={viewFormId}
        onOpenChange={(isOpen) => { if (!isOpen) setViewFormId(null); }}
      />
    </SectionContainer>
  );
}