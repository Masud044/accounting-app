// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ArrowLeft } from "lucide-react";
// import { SectionContainer } from "@/components/SectionContainer";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { useApprovalTracking, useUpdateApprovalStage } from "./queries";

// // ── helpers ────────────────────────────────────────────────────────────────────
// const fmtMoney = (val) =>
//   Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// const statusBadgeCls = (status) =>
//   status === "Fully Approved"
//     ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
//     : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

// const STAGES = [
//   { key: "STAGE1_IT_RECV",   label: "Stage 1: IT Receiving" },
//   { key: "STAGE2_DEPT_HEAD", label: "Stage 2: Dept. Head" },
//   { key: "STAGE3_FINANCE",   label: "Stage 3: Finance" },
// ];

// export default function ApprovalDashboardPage() {
//   const { data: rows = [], isLoading } = useApprovalTracking();
//   const updateStageMutation = useUpdateApprovalStage();

//   const handleStageChange = async (formId, stage, value) => {
//     try {
//       await updateStageMutation.mutateAsync({ formId, stage, value });
//       toast.success(`${formId} — stage updated to ${value}.`);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to update stage.");
//     }
//   };

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
//               Update a stage below — overall status recalculates automatically
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
//                 {STAGES.map((s) => (
//                   <th key={s.key} className="px-3 py-2 text-left font-semibold">{s.label}</th>
//                 ))}
//                 <th className="px-3 py-2 text-left font-semibold">Overall Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading && (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
//                     <Spinner className="h-5 w-5 inline mr-2" /> Loading approval queue...
//                   </td>
//                 </tr>
//               )}

//               {!isLoading && rows.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
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

//                   {STAGES.map((s) => (
//                     <td key={s.key} className="px-3 py-2">
//                       <select
//                         value={row[s.key]}
//                         onChange={(e) => handleStageChange(row.FORM_ID, s.key, e.target.value)}
//                         disabled={updateStageMutation.isPending}
//                         className="h-8 text-sm border rounded px-2 bg-white dark:bg-background w-full"
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Approved">Approved</option>
//                       </select>
//                     </td>
//                   ))}

//                   <td className="px-3 py-2">
//                     <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(row.OVERALL_STATUS)}`}>
//                       {row.OVERALL_STATUS}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </SectionContainer>
//   );
// }

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useApprovalTracking, useUpdateApprovalStatus } from "./queries";

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
  const updateStatusMutation = useUpdateApprovalStatus();

  const handleStatusChange = async (formId, status) => {
    try {
      await updateStatusMutation.mutateAsync({ formId, status });
      toast.success(`${formId} — status updated to ${status}.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <SectionContainer>
      <div className="p-4 space-y-4 bg-white dark:bg-background rounded-lg mt-4 shadow-md">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base text-gray-800 dark:text-foreground">
              Purchase Recognition — Approval Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">Update the status below</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/dashboard/purchase-recognition">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back Form
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
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    <Spinner className="h-5 w-5 inline mr-2" /> Loading approval queue...
                  </td>
                </tr>
              )}

              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
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
                    <div className="flex items-center gap-2">
                      <select
                        value={row.OVERALL_STATUS}
                        onChange={(e) => handleStatusChange(row.FORM_ID, e.target.value)}
                        disabled={updateStatusMutation.isPending}
                        className="h-8 text-sm border rounded px-2 bg-white dark:bg-background"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        {/* <option value="Rejected">Rejected</option> */}
                      </select>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(row.OVERALL_STATUS)}`}>
                        {row.OVERALL_STATUS}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionContainer>
  );
}