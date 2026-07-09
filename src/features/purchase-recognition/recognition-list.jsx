// import { useState } from "react";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { Plus, ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import {
//   usePurchaseRecognitions, usePurchaseRecognitionByFormId, useDeletePurchaseRecognition,
// } from "./queries";
// import AddRecognitionSheet from "./create-recognition-sheet";
// import EditRecognitionSheet from "./update-recognition-sheet";

// // ── helpers ────────────────────────────────────────────────────────────────────
// const fmtDate = (val) => {
//   if (!val) return "—";
//   const d = /^\d{4}-\d{2}-\d{2}$/.test(val) ? new Date(`${val}T00:00:00`) : new Date(val);
//   if (isNaN(d.getTime())) return "—";
//   return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
// };

// const fmtMoney = (val) =>
//   Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// const statusBadgeCls = (status) =>
//   status === "Fully Approved"
//     ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
//     : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

// // ── Expandable items sub-row — fetches item detail only when opened ──────────
// function ItemsSubRow({ formId }) {
//   const { data, isLoading } = usePurchaseRecognitionByFormId(formId);

//   if (isLoading) {
//     return (
//       <tr>
//         <td colSpan={7} className="px-4 py-3 text-center text-sm text-muted-foreground">
//           <Spinner className="h-4 w-4 inline mr-2" /> Loading items...
//         </td>
//       </tr>
//     );
//   }

//   const items = data?.items || [];
//   if (items.length === 0) {
//     return (
//       <tr>
//         <td colSpan={7} className="px-4 py-3 text-center text-sm text-muted-foreground">
//           No items on this form.
//         </td>
//       </tr>
//     );
//   }

//   return items.map((it) => (
//     <tr key={it.ID} className="bg-muted/20">
//       <td className="px-4 py-2"></td>
//       <td className="px-3 py-2 text-sm" colSpan={2}>{it.DESCRIPTION}</td>
//       <td className="px-3 py-2 text-sm text-center">{it.QTY_RECV}</td>
//       <td className="px-3 py-2 text-sm text-right">{fmtMoney(it.TOTAL_PRICE)}</td>
//       <td className="px-3 py-2 text-sm text-muted-foreground">{it.ASSET_CLASS_CODE}</td>
//       <td></td>
//     </tr>
//   ));
// }

// export default function RecognitionListPage() {
//   const { data: forms = [], isLoading } = usePurchaseRecognitions();
//   const deleteMutation = useDeletePurchaseRecognition();

//   const [expandedId, setExpandedId] = useState(null);
//   const [addOpen, setAddOpen] = useState(false);
//   const [editFormId, setEditFormId] = useState(null);

//   const toggleExpand = (formId) => setExpandedId((prev) => (prev === formId ? null : formId));

//   const handleDelete = async (formId) => {
//     if (!window.confirm(`Delete form ${formId}? This cannot be undone.`)) return;
//     try {
//       await deleteMutation.mutateAsync(formId);
//       toast.success(`Form ${formId} deleted.`);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to delete form.");
//     }
//   };

//   return (
//     <>
//       <div className="p-4 space-y-4 bg-white dark:bg-background rounded-lg mt-4 shadow-md">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="font-semibold text-base text-gray-800 dark:text-foreground">
//               Purchase Recognition Forms
//             </h2>
//             <p className="text-sm text-muted-foreground">One row per form — expand to see items</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button asChild variant="outline">
//               <Link to="/dashboard/purchase-approve">Approval Dashboard</Link>
//             </Button>
//             <Button onClick={() => setAddOpen(true)}>
//               <Plus className="h-4 w-4 mr-1" /> New Form
//             </Button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-md border border-border">
//           <table className="w-full text-sm border-collapse">
//             <thead>
//               <tr className="bg-muted/40">
//                 <th className="px-2 py-2 w-8"></th>
//                 <th className="px-3 py-2 text-left font-semibold">Form ID</th>
//                 <th className="px-3 py-2 text-left font-semibold">Vendor</th>
//                 <th className="px-3 py-2 text-center font-semibold">Items</th>
//                 <th className="px-3 py-2 text-right font-semibold">Total</th>
//                 <th className="px-3 py-2 text-left font-semibold">Status</th>
//                 <th className="px-3 py-2 text-right font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading && (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
//                     <Spinner className="h-5 w-5 inline mr-2" /> Loading forms...
//                   </td>
//                 </tr>
//               )}

//               {!isLoading && forms.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
//                     No purchase recognition forms yet.
//                   </td>
//                 </tr>
//               )}

//               {forms.map((form) => (
//                 <>
//                   <tr key={form.FORM_ID} className="border-t border-border">
//                     <td className="px-2 py-2">
//                       <button
//                         type="button"
//                         aria-label="Expand items"
//                         onClick={() => toggleExpand(form.FORM_ID)}
//                         className="p-1 rounded hover:bg-muted"
//                       >
//                         {expandedId === form.FORM_ID
//                           ? <ChevronDown className="h-4 w-4" />
//                           : <ChevronRight className="h-4 w-4" />}
//                       </button>
//                     </td>
//                     <td className="px-3 py-2 font-medium">{form.FORM_ID}</td>
//                     <td className="px-3 py-2">{form.VENDOR_NAME}</td>
//                     <td className="px-3 py-2 text-center text-muted-foreground">{form.ITEM_COUNT} items</td>
//                     <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(form.TOTAL_AMOUNT)}</td>
//                     <td className="px-3 py-2">
//                       <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(form.OVERALL_STATUS)}`}>
//                         {form.OVERALL_STATUS || "In Progress"}
//                       </span>
//                     </td>
//                     <td className="px-3 py-2 text-right">
//                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditFormId(form.FORM_ID)}>
//                         <Pencil className="h-3.5 w-3.5" />
//                       </Button>
//                       <Button
//                         variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
//                         onClick={() => handleDelete(form.FORM_ID)}
//                         disabled={deleteMutation.isPending}
//                       >
//                         <Trash2 className="h-3.5 w-3.5" />
//                       </Button>
//                     </td>
//                   </tr>
//                   {expandedId === form.FORM_ID && <ItemsSubRow formId={form.FORM_ID} />}
//                 </>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <AddRecognitionSheet open={addOpen} onOpenChange={setAddOpen} />
//       <EditRecognitionSheet
//         open={!!editFormId}
//         formId={editFormId}
//         onOpenChange={(isOpen) => { if (!isOpen) setEditFormId(null); }}
//       />
//     </>
//   );
// }

import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Package, Wallet, Lock } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePurchaseRecognitions, useDeletePurchaseRecognition } from "./queries";
import AddRecognitionSheet from "./create-recognition-sheet";
import EditRecognitionSheet from "./update-recognition-sheet";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE = `${url}/api/purchase-recognition`;

// ── helpers ────────────────────────────────────────────────────────────────────
const fmtMoney = (val) =>
  Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusBadgeCls = (status) =>
  status === "Approved"
    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
    : status === "Rejected"
    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
    : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

export default function RecognitionListPage() {
  const navigate = useNavigate();
  const { data: forms = [], isLoading } = usePurchaseRecognitions();
  const deleteMutation = useDeletePurchaseRecognition();

  const [addOpen, setAddOpen] = useState(false);
  const [editFormId, setEditFormId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null); // form-level spinner for inv/payment nav

  const handleDelete = async (formId) => {
    if (!window.confirm(`Delete form ${formId}? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(formId);
      toast.success(`Form ${formId} deleted.`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete form.");
    }
  };

  // ✅ Approved + PURCHASE_TYPE = ITEM hole "Create Inventory" button dekhabe
  const handleCreateInventory = async (form) => {
    setActionLoadingId(form.FORM_ID);
    try {
      const res = await axios.get(`${BASE}/${form.FORM_ID}`);
      const full = res.data?.data;
      if (!full) throw new Error("Form details not found.");

      const bulkItems = (full.items || []).map((it) => ({
        itemId: it.ITEM_ID,
        itemName: it.ITEM_NAME,
        qty: it.GRN_QTY,
        receiveQty: it.QTY_RECV,
        unitId: it.UNIT_ID,
        unit: it.UOM,
        price: it.UNIT_PRICE,
      }));

      navigate("/dashboard/inventory", {
        state: {
          purchaseFormId: full.FORM_ID,
          poNumber: full.PO_NUMBER,
          supplierId: full.SUPPLIER_ID,
          invtDate: full.RECOGNITION_DATE,
          bulkItems,
        },
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load form for inventory.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ✅ Approved + PURCHASE_TYPE = SERVICE hole "Create Payment" button dekhabe
  const handleCreatePayment = async (form) => {
    setActionLoadingId(form.FORM_ID);
    try {
      const res = await axios.get(`${BASE}/${form.FORM_ID}`);
      const full = res.data?.data;
      if (!full) throw new Error("Form details not found.");

      // const rows = (full.items || []).map((it) => ({
      //   particulars: it.DESCRIPTION || it.ITEM_NAME,
      //   amount: Number(it.QTY_RECV || 0) * Number(it.UNIT_PRICE || 0),
      // }));

      navigate("/dashboard/payment-create", {
        state: {
          purchaseFormId: full.FORM_ID,
          supplier: full.SUPPLIER_ID,
          entryDate: full.RECOGNITION_DATE,
          glDate: full.RECOGNITION_DATE,
          description: full.DESCRIPTION,
          invoiceNo: full.INVOICE_NUMBER,
          poNumber: full.PO_NUMBER,
          invType: full.INV_TYPE,
          paymentCode: full.PAYMENT_CODE,
         
        },
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load form for payment.");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <div className="p-4 space-y-4 bg-white dark:bg-background rounded-lg mt-4 shadow-md">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base text-gray-800 dark:text-foreground">
              Purchase Recognition Forms
            </h2>
            <p className="text-sm text-muted-foreground">One row per form</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/approval-dashboard">Approval Dashboard</Link>
            </Button>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> New Form
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="px-3 py-2 text-left font-semibold">Form ID</th>
                <th className="px-3 py-2 text-left font-semibold">PO Number</th>
                <th className="px-3 py-2 text-left font-semibold">Vendor</th>
                <th className="px-3 py-2 text-center font-semibold">Items</th>
                <th className="px-3 py-2 text-right font-semibold">Total</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    <Spinner className="h-5 w-5 inline mr-2" /> Loading forms...
                  </td>
                </tr>
              )}

              {!isLoading && forms.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No purchase recognition forms yet.
                  </td>
                </tr>
              )}

              {forms.map((form) => {
                const isApproved = form.OVERALL_STATUS === "Approved";
                // ✅ /lock hit hoye gele backend theke ACTION_CREATED = 1 ashe
                const isLocked = Number(form.ACTION_CREATED) === 1;
                const isActionBusy = actionLoadingId === form.FORM_ID;

                const showInventoryBtn = isApproved && form.PURCHASE_TYPE === "ITEM";
                const showPaymentBtn = isApproved && form.PURCHASE_TYPE === "SERVICE";

                return (
                  <tr key={form.FORM_ID} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{form.FORM_ID}</td>
                    <td className="px-3 py-2 text-muted-foreground">{form.PO_NUMBER}</td>
                    <td className="px-3 py-2">{form.VENDOR_NAME}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{form.ITEM_COUNT} items</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(form.TOTAL_AMOUNT)}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeCls(form.OVERALL_STATUS)}`}>
                        {form.OVERALL_STATUS || "Pending"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* ✅ Pending hole eibar kichu dekhabe na, Approved hole type onujayi ekta button */}
                        {showInventoryBtn && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            disabled={isLocked || isActionBusy}
                            onClick={() => handleCreateInventory(form)}
                            title={isLocked ? "Already created — locked" : "Create Inventory"}
                          >
                            {isLocked ? (
                              <Lock className="h-3.5 w-3.5 mr-1" />
                            ) : isActionBusy ? (
                              <Spinner className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Package className="h-3.5 w-3.5 mr-1" />
                            )}
                            Inventory
                          </Button>
                        )}

                        {showPaymentBtn && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            disabled={isLocked || isActionBusy}
                            onClick={() => handleCreatePayment(form)}
                            title={isLocked ? "Already created — locked" : "Create Payment"}
                          >
                            {isLocked ? (
                              <Lock className="h-3.5 w-3.5 mr-1" />
                            ) : isActionBusy ? (
                              <Spinner className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Wallet className="h-3.5 w-3.5 mr-1" />
                            )}
                            Payment
                          </Button>
                        )}

                        <Button
  variant="ghost" size="icon" className="h-8 w-8"
  onClick={() => setEditFormId(form.FORM_ID)}
  disabled={isApproved}
  title={isApproved ? "Approved form cannot be edited" : "Edit"}
>
  <Pencil className="h-3.5 w-3.5" />
</Button>
<Button
  variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
  onClick={() => handleDelete(form.FORM_ID)}
  disabled={deleteMutation.isPending || isApproved}
  title={isApproved ? "Approved form cannot be deleted" : "Delete"}
>
  <Trash2 className="h-3.5 w-3.5" />
</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddRecognitionSheet open={addOpen} onOpenChange={setAddOpen} />
      <EditRecognitionSheet
        open={!!editFormId}
        formId={editFormId}
        onOpenChange={(isOpen) => { if (!isOpen) setEditFormId(null); }}
      />
    </>
  );
}