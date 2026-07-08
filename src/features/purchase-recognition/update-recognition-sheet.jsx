// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import {
//   Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
// } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import { Spinner } from "@/components/ui/spinner";
// import { FileText, Trash2, Plus, ArchiveIcon, Wallet } from "lucide-react";
// import { Link } from "react-router-dom";

// import {
//   usePurchaseRecognitionByFormId, useUpdatePurchaseRecognition, useActiveSuppliers, useUoms,
//   useInvTypes, usePaymentCodes,
// } from "./queries";
// import ItemPicker from "./item-picker";

// // ── helpers ────────────────────────────────────────────────────────────────────
// const today = () => new Date().toISOString().split("T")[0];

// const toInputDate = (val) => {
//   if (!val) return today();
//   if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return today();
//   return d.toISOString().split("T")[0];
// };

// const emptyItem = () => ({
//   itemNo: null,
//   itemId: null,
//   itemName: "",
//   description: "",
//   grnQty: "",    // GRN Qty
//   qtyRecv: "",   // Receive Qty
//   unitId: "",    // UOM id
//   unit: "",      // UOM name
//   unitPrice: "",
// });

// const editableCell =
//   "h-8 text-sm border-0 rounded-none bg-blue-50 dark:bg-blue-950/40 " +
//   "focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0 px-1";

// export default function EditRecognitionSheet({ open, onOpenChange, formId, showConfirmation }) {
//   const { data: formData, isLoading: isLoadingForm } = usePurchaseRecognitionByFormId(formId);
//   const updateMutation = useUpdatePurchaseRecognition(formId);
//   const { data: suppliers = [] } = useActiveSuppliers();
//   const { data: uoms = [] } = useUoms();
//   const { data: invTypes = [] } = useInvTypes();
// const { data: paymentCodes = [] } = usePaymentCodes();
  

//   const [header, setHeader] = useState(null);
//   const [items, setItems] = useState([]);
//   const [isDirty, setIsDirty] = useState(false);
//   const [initialized, setInitialized] = useState(false);

//   useEffect(() => {
//     if (!open) {
//       setInitialized(false);
//       setIsDirty(false);
//     }
//   }, [open]);

//   useEffect(() => {
//     if (!open || initialized || !formData) return;

//     setHeader({
//       recognitionDate: toInputDate(formData.RECOGNITION_DATE),
//       poNumber:        formData.PO_NUMBER || "",
//       invoiceNumber:   formData.INVOICE_NUMBER || "",
//       department:      formData.DEPARTMENT || "",
//       requestedBy:     formData.REQUESTED_BY || "",
//       supplierId:      formData.SUPPLIER_ID ? String(formData.SUPPLIER_ID) : "",
//       vendorName:      formData.VENDOR_NAME || "",
//       contactPerson:   formData.CONTACT_PERSON || "",
//       costCenterCode:  formData.COST_CENTER_CODE || "",
//       invoiceDate:     toInputDate(formData.INVOICE_DATE),
//       description:     formData.DESCRIPTION || "",
//       purchaseType: formData.PURCHASE_TYPE || "ITEM",
//       // header init
// invType: formData.INV_TYPE ? String(formData.INV_TYPE) : "",
// paymentCode: formData.PAYMENT_CODE ? String(formData.PAYMENT_CODE) : "",
//     });

//     const rawItems = formData.items || [];
//     setItems(
//       rawItems.length > 0
//         ? rawItems.map((it) => ({
//             itemNo: it.ITEM_NO,
//             itemId: it.ITEM_ID,
//             itemName: it.ITEM_NAME || "",
//             description: it.DESCRIPTION || "",
//             grnQty: it.GRN_QTY ?? "",
//             qtyRecv: it.QTY_RECV ?? "",
//             unitId: it.UNIT_ID ?? "",
//             unit: it.UOM || "",
//             unitPrice: it.UNIT_PRICE ?? "",
//           }))
//         : [emptyItem()]
//     );

//     setInitialized(true);
//   }, [open, initialized, formData]);

//   const updateHeader = (field, value) => {
//     setIsDirty(true);
//     setHeader((h) => ({ ...h, [field]: value }));
//   };

//   const handleSupplierChange = (supplierId) => {
//     const supplier = suppliers.find((s) => String(s.SUPPLIER_ID) === supplierId);
//     setIsDirty(true);
//     setHeader((h) => ({
//       ...h,
//       supplierId,
//       vendorName: supplier?.SUPPLIER_NAME || h.vendorName,
//       contactPerson: supplier?.CONTACT_PERSON || h.contactPerson,
//     }));
//   };

//   const addItemRow = () => {
//     setIsDirty(true);
//     setItems((prev) => [...prev, emptyItem()]);
//   };

//   const updateItem = (idx, field, value) => {
//     setIsDirty(true);
//     setItems((prev) => {
//       const next = [...prev];
//       const row = { ...next[idx], [field]: value };
//       if (field === "unitId") {
//         const selected = uoms.find((u) => String(u.ID) === String(value));
//         row.unit = selected?.NAME || "";
//       }
//       next[idx] = row;
//       return next;
//     });
//   };

//   const handleItemSelect = (idx, item) => {
//     setIsDirty(true);
//     setItems((prev) => {
//       const next = [...prev];
//       next[idx] = {
//         ...next[idx],
//         itemId: item.ITEM_ID,
//         itemName: item.NAME || "",
//         description: item.DESCRIPTION || "",
//         unitPrice: item.PRICE ?? "",
//       };
//       return next;
//     });
//   };

//   const removeItem = (idx) => {
//     setIsDirty(true);
//     setItems((prev) => prev.filter((_, i) => i !== idx));
//   };

//   // ✅ Total ager moto Receive Qty (qtyRecv) * unitPrice diyei calculate hoy
//   const lineTotal = (item) => Number(item.qtyRecv || 0) * Number(item.unitPrice || 0);
//   const totalAmount = items.reduce((s, it) => s + lineTotal(it), 0);

//   const handleSubmit = async () => {
//   if (!header.recognitionDate) { toast.error("Please select a recognition date."); return; }
//   if (!header.vendorName.trim()) { toast.error("Please enter or select a vendor."); return; }
//   if (items.length === 0) { toast.error("Add at least one item."); return; }
//   if (items.some((it) => !it.itemId  || Number(it.qtyRecv) <= 0 || Number(it.unitPrice) <= 0)) {
//     toast.error("Each item needs to be selected with  receive qty, and unit price.");
//     return;
//   }
//   // ✅ SERVICE hole Type + Payment Code required
//   if (header.purchaseType === "SERVICE" && (!header.invType || !header.paymentCode)) {
//     toast.error("Please select Type and Payment Code for a Service purchase.");
//     return;
//   }

//   const payload = {
//     header: {
//       ...header,
//       supplierId: header.supplierId ? Number(header.supplierId) : null,
//       // ✅ ITEM hole null pathabe
//       invType: header.purchaseType === "SERVICE" ? (header.invType ? Number(header.invType) : null) : null,
//       paymentCode: header.purchaseType === "SERVICE" ? (header.paymentCode || null) : null,
//     },
//     items: items.map((it, idx) => ({
//       itemNo: idx + 1,
//       itemId: it.itemId,
//       description: it.description,
//       qtyRecv: Number(it.qtyRecv),
//       unitId: it.unitId ? Number(it.unitId) : null,
//       unitPrice: Number(it.unitPrice),
//     })),
//   };

//   try {
//     await updateMutation.mutateAsync(payload);
//     toast.success("Form updated successfully!");
//     onOpenChange(false);
//   } catch (err) {
//     toast.error(err?.response?.data?.message || "Failed to update form.");
//   }
// };
//   const handleCancel = async () => {
//     if (isDirty && showConfirmation) {
//       const ok = await showConfirmation({
//         title: "Discard changes?",
//         description: "You have unsaved changes. Close without saving?",
//         confirmText: "Discard", cancelText: "Keep Editing", variant: "destructive",
//       });
//       if (!ok) return;
//     }
//     onOpenChange(false);
//   };

//   const isSubmitting = updateMutation.isPending;
//   const isLocked = formData?.OVERALL_STATUS === "Approved";
//   const isLoading = isLoadingForm || !header;

//   // ✅ GRN Qty, Receive Qty, UOM, Unit Price — sob Purchase Recognition theke
//   //    Inventory create page e auto-fill er jonno pathano hocche
//   const inventoryState = {
//     purchaseFormId: formId,
//     poNumber: header?.poNumber || "",
//     bulkItems: items.map((it) => ({
//       itemId:      it.itemId,
//       itemName:    it.itemName,
     
//       receiveQty:  it.qtyRecv,     // Inventory er "Receive Qty" field e jabe
//       unitId:      it.unitId,      // Inventory er UOM select e prefill hobe
     
//       price:       it.unitPrice,   // per-unit price
//     })),
//     invtDate: header?.recognitionDate ?? today(),
//   };

//   const paymentState = {
//   supplier: header?.supplierId ?? "",
//   entryDate: header?.recognitionDate ?? today(),
//   glDate: header?.invoiceDate ?? today(),
//   description: header?.description || `Payment against Purchase Recognition #${formId}`,
//   invoiceNo: header?.invoiceNumber ? String(header.invoiceNumber) : "",
//   poNumber: header?.poNumber ?? "",
//   invType: header?.invType ?? "",         // 👈 নতুন
//   paymentCode: header?.paymentCode ?? "", // 👈 নতুন
// };

//   return (
//     <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
//       <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-105">

//         <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//               <FileText className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <SheetTitle>Edit Purchase Recognition {formId ? `— ${formId}` : ""}</SheetTitle>
//               <SheetDescription>Update form details and line items</SheetDescription>
//             </div>
//           </div>
//         </SheetHeader>

//         {isLoading ? (
//           <div className="flex-1 flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 mb-3" />
//             <p className="text-muted-foreground text-sm">Loading form...</p>
//           </div>
//         ) : (
//           <>
//             <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Recognition Date <span className="text-destructive">*</span></Label>
//                   <Input
//                     type="date" value={header.recognitionDate}
//                     onChange={(e) => updateHeader("recognitionDate", e.target.value)}
//                     disabled={isSubmitting} className="h-9"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Need by Date</Label>
//                   <Input
//                     type="date" value={header.invoiceDate}
//                     onChange={(e) => updateHeader("invoiceDate", e.target.value)}
//                     disabled={isSubmitting} className="h-9"
//                   />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">PO Number</Label>
//                   <Input value={header.poNumber} disabled className="h-9 bg-muted/50" />
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Supplier</Label>
//                   <Select
//                     value={header.supplierId ? String(header.supplierId) : ""}
//                     onValueChange={handleSupplierChange}
//                     disabled={isSubmitting}
//                   >
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Select supplier" />
//                     </SelectTrigger>
//                     <SelectContent className="z-110">
//                       {suppliers.map((s) => (
//                         <SelectItem key={s.SUPPLIER_ID} value={String(s.SUPPLIER_ID)}>
//                           {s.SUPPLIER_NAME}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Purchase Type <span className="text-destructive">*</span></Label>
//                   <Select
//                     value={header.purchaseType}
//                     onValueChange={(v) => updateHeader("purchaseType", v)}
//                     disabled={isSubmitting}
//                   >
//                     <SelectTrigger className="h-9">
//                       <SelectValue placeholder="Select type" />
//                     </SelectTrigger>
//                     <SelectContent className="z-110">
//                       <SelectItem value="ITEM">Item</SelectItem>
//                       <SelectItem value="SERVICE">Service</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-1.5">
//                   <Label className="text-xs font-medium">Contact Person</Label>
//                   <Input
//                     value={header.contactPerson}
//                     onChange={(e) => updateHeader("contactPerson", e.target.value)}
//                     disabled={isSubmitting} className="h-9"
//                   />
//                 </div>

//                 <div className="space-y-1.5 col-span-2 md:col-span-3">
//                   <Label className="text-xs font-medium">Description</Label>
//                   <Input
//                     value={header.description}
//                     onChange={(e) => updateHeader("description", e.target.value)}
//                     disabled={isSubmitting} className="h-9"
//                     placeholder="Brief note about this purchase"
//                   />
//                 </div>
//               </div>
//             {header.purchaseType === "SERVICE" && (
//   <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-1.5">
//       <Label className="text-xs font-medium">Type <span className="text-destructive">*</span></Label>
//       <Select value={header.invType} onValueChange={(v) => updateHeader("invType", v)} disabled={isSubmitting}>
//         <SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger>
//         <SelectContent className="z-110">
//           {invTypes.map((t) => (<SelectItem key={t.ID} value={String(t.ID)}>{t.DESCRIPTIO}</SelectItem>))}
//         </SelectContent>
//       </Select>
//     </div>

//     <div className="space-y-1.5">
//       <Label className="text-xs font-medium">Payment Code <span className="text-destructive">*</span></Label>
//       <Select value={header.paymentCode} onValueChange={(v) => updateHeader("paymentCode", v)} disabled={isSubmitting}>
//         <SelectTrigger className="h-9"><SelectValue placeholder="Select payment" /></SelectTrigger>
//         <SelectContent className="z-110">
//           {paymentCodes.map((c) => (<SelectItem key={c.ACCOUNT_ID} value={String(c.ACCOUNT_ID)}>{c.ACCOUNT_NAME}</SelectItem>))}
//         </SelectContent>
//       </Select>
//     </div>
//   </div>
// )}

//               <div className="flex items-center justify-between pt-2">
//                 <Label className="text-xs font-medium">Itemized Asset Breakdown</Label>
//                 <Button type="button" size="sm" onClick={addItemRow} disabled={isSubmitting}>
//                   <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
//                 </Button>
//               </div>

//               <div className="rounded-md overflow-hidden border border-border">
//                 <table className="w-full text-sm border-collapse">
//                   <thead>
//                     <tr style={{ background: "#1a3c34" }}>
//                       {["#", "Item", "Description", " Qty", "UOM", "Unit Price", "Total", ""].map((h) => (
//                         <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap">
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.map((item, idx) => (
//                       <tr key={idx} className="border-t border-border">
//                         <td className="px-3 py-1 text-center text-muted-foreground w-8">{idx + 1}</td>
//                         <td className="px-1 py-1 min-w-[200px]">
//                           <ItemPicker
//                             value={item.itemId}
//                             displayName={item.itemName}
//                             onSelect={(selected) => handleItemSelect(idx, selected)}
//                             disabled={isSubmitting}
//                           />
//                         </td>
//                         <td className="px-1 py-1 min-w-[200px]">
//                           <Input
//                             value={item.description}
//                             onChange={(e) => updateItem(idx, "description", e.target.value)}
//                             disabled={isSubmitting}
//                             className={editableCell + " w-full text-left"}
//                           />
//                         </td>
//                         {/* <td className="px-1 py-1 w-24">
//                           <Input
//                             type="number" min="0"
//                             value={item.grnQty}
//                             onChange={(e) => updateItem(idx, "grnQty", e.target.value)}
//                             disabled={isSubmitting}
//                             className={editableCell + " w-full text-center"}
//                           />
//                         </td> */}
//                         <td className="px-1 py-1 w-24">
//                           <Input
//                             type="number" min="0"
//                             value={item.qtyRecv}
//                             onChange={(e) => updateItem(idx, "qtyRecv", e.target.value)}
//                             disabled={isSubmitting}
//                             className={editableCell + " w-full text-center"}
//                           />
//                         </td>
//                         <td className="px-1 py-1 w-28">
//                           <Select
//                             value={item.unitId ? String(item.unitId) : ""}
//                             onValueChange={(v) => updateItem(idx, "unitId", v)}
//                             disabled={isSubmitting}
//                           >
//                             <SelectTrigger className="h-8 text-sm border-0 rounded-none bg-blue-50 dark:bg-blue-950/40">
//                               <SelectValue placeholder="UOM" />
//                             </SelectTrigger>
//                             <SelectContent className="z-110">
//                               {uoms.map((u) => (
//                                 <SelectItem key={u.ID} value={String(u.ID)}>{u.NAME}</SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </td>
//                         <td className="px-1 py-1 w-28">
//                           <Input
//                             type="number" min="0" step="0.01"
//                             value={item.unitPrice}
//                             onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
//                             disabled={isSubmitting}
//                             className={editableCell + " w-full text-center"}
//                           />
//                         </td>
//                         <td className="px-3 py-1 w-28 text-right tabular-nums font-medium text-orange-600 dark:text-orange-400">
//                           {lineTotal(item) > 0
//                             ? lineTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             : "—"}
//                         </td>
//                         <td className="px-1 py-1 w-8">
//                           <Button
//                             type="button" variant="ghost" size="icon"
//                             className="h-8 w-8 text-destructive hover:text-destructive"
//                             onClick={() => removeItem(idx)}
//                             disabled={isSubmitting}
//                           >
//                             <Trash2 className="h-3.5 w-3.5" />
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="flex justify-end">
//                 <div className="w-72 rounded-md overflow-hidden border border-border text-sm">
//                   <div className="flex items-center justify-between px-3 py-2 font-medium bg-muted/40">
//                     <span>Total</span>
//                     <span className="tabular-nums">
//                       {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//             </div>

//             <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
//               <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmit} disabled={isSubmitting || items.length === 0}>
//                 {isSubmitting ? <><Spinner className="mr-2 h-4 w-4" />Updating...</> : "Update Form"}
//               </Button>

//               {header.purchaseType === "ITEM" && (
//                 <Link to="/dashboard/inventory" state={inventoryState}>
//                   <Button type="button" variant="secondary">
//                     <ArchiveIcon className="h-4 w-4 mr-1" /> Create Inventory
//                   </Button>
//                 </Link>
//               )}

//               {header.purchaseType === "SERVICE" && (
//                 <Link to="/dashboard/payment-create" state={paymentState}>
//                   <Button type="button" variant="secondary">
//                     <Wallet className="h-4 w-4 mr-1" /> Create Payment
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </>
//         )}

//       </SheetContent>
//     </Sheet>
//   );
// }

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Trash2, Plus, Lock } from "lucide-react";

import {
  usePurchaseRecognitionByFormId, useUpdatePurchaseRecognition, useActiveSuppliers, useUoms,
  useInvTypes, usePaymentCodes,
} from "./queries";
import ItemPicker from "./item-picker";

// ── helpers ────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

const toInputDate = (val) => {
  if (!val) return today();
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return today();
  return d.toISOString().split("T")[0];
};

const emptyItem = () => ({
  itemNo: null,
  itemId: null,
  itemName: "",
  description: "",
  grnQty: "",    // GRN Qty
  qtyRecv: "",   // Receive Qty
  unitId: "",    // UOM id
  unit: "",      // UOM name
  unitPrice: "",
});

const editableCell =
  "h-8 text-sm border-0 rounded-none bg-blue-50 dark:bg-blue-950/40 " +
  "focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0 px-1";

export default function EditRecognitionSheet({ open, onOpenChange, formId, showConfirmation }) {
  const { data: formData, isLoading: isLoadingForm } = usePurchaseRecognitionByFormId(formId);
  const updateMutation = useUpdatePurchaseRecognition(formId);
  const { data: suppliers = [] } = useActiveSuppliers();
  const { data: uoms = [] } = useUoms();
  const { data: invTypes = [] } = useInvTypes();
  const { data: paymentCodes = [] } = usePaymentCodes();

  const [header, setHeader] = useState(null);
  const [items, setItems] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!open) {
      setInitialized(false);
      setIsDirty(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || initialized || !formData) return;

    setHeader({
      recognitionDate: toInputDate(formData.RECOGNITION_DATE),
      poNumber:        formData.PO_NUMBER || "",
      invoiceNumber:   formData.INVOICE_NUMBER || "",
      department:      formData.DEPARTMENT || "",
      requestedBy:     formData.REQUESTED_BY || "",
      supplierId:      formData.SUPPLIER_ID ? String(formData.SUPPLIER_ID) : "",
      vendorName:      formData.VENDOR_NAME || "",
      contactPerson:   formData.CONTACT_PERSON || "",
      costCenterCode:  formData.COST_CENTER_CODE || "",
      invoiceDate:     toInputDate(formData.INVOICE_DATE),
      description:     formData.DESCRIPTION || "",
      purchaseType: formData.PURCHASE_TYPE || "ITEM",
      invType: formData.INV_TYPE ? String(formData.INV_TYPE) : "",
      paymentCode: formData.PAYMENT_CODE ? String(formData.PAYMENT_CODE) : "",
    });

    const rawItems = formData.items || [];
    setItems(
      rawItems.length > 0
        ? rawItems.map((it) => ({
            itemNo: it.ITEM_NO,
            itemId: it.ITEM_ID,
            itemName: it.ITEM_NAME || "",
            description: it.DESCRIPTION || "",
            grnQty: it.GRN_QTY ?? "",
            qtyRecv: it.QTY_RECV ?? "",
            unitId: it.UNIT_ID ?? "",
            unit: it.UOM || "",
            unitPrice: it.UNIT_PRICE ?? "",
          }))
        : [emptyItem()]
    );

    setInitialized(true);
  }, [open, initialized, formData]);

  // ✅ Approved হলে পুরো ফর্ম read-only/locked
  const isLocked = formData?.OVERALL_STATUS === "Approved";

  const updateHeader = (field, value) => {
    if (isLocked) return;
    setIsDirty(true);
    setHeader((h) => ({ ...h, [field]: value }));
  };

  const handleSupplierChange = (supplierId) => {
    if (isLocked) return;
    const supplier = suppliers.find((s) => String(s.SUPPLIER_ID) === supplierId);
    setIsDirty(true);
    setHeader((h) => ({
      ...h,
      supplierId,
      vendorName: supplier?.SUPPLIER_NAME || h.vendorName,
      contactPerson: supplier?.CONTACT_PERSON || h.contactPerson,
    }));
  };

  const addItemRow = () => {
    if (isLocked) return;
    setIsDirty(true);
    setItems((prev) => [...prev, emptyItem()]);
  };

  const updateItem = (idx, field, value) => {
    if (isLocked) return;
    setIsDirty(true);
    setItems((prev) => {
      const next = [...prev];
      const row = { ...next[idx], [field]: value };
      if (field === "unitId") {
        const selected = uoms.find((u) => String(u.ID) === String(value));
        row.unit = selected?.NAME || "";
      }
      next[idx] = row;
      return next;
    });
  };

  const handleItemSelect = (idx, item) => {
    if (isLocked) return;
    setIsDirty(true);
    setItems((prev) => {
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        itemId: item.ITEM_ID,
        itemName: item.NAME || "",
        description: item.DESCRIPTION || "",
        unitPrice: item.PRICE ?? "",
      };
      return next;
    });
  };

  const removeItem = (idx) => {
    if (isLocked) return;
    setIsDirty(true);
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // ✅ Total ager moto Receive Qty (qtyRecv) * unitPrice diyei calculate hoy
  const lineTotal = (item) => Number(item.qtyRecv || 0) * Number(item.unitPrice || 0);
  const totalAmount = items.reduce((s, it) => s + lineTotal(it), 0);

  const handleSubmit = async () => {
    if (isLocked) return;
    if (!header.recognitionDate) { toast.error("Please select a recognition date."); return; }
    if (!header.vendorName.trim()) { toast.error("Please enter or select a vendor."); return; }
    if (items.length === 0) { toast.error("Add at least one item."); return; }
    if (items.some((it) => !it.itemId || Number(it.qtyRecv) <= 0 || Number(it.unitPrice) <= 0)) {
      toast.error("Each item needs to be selected with  receive qty, and unit price.");
      return;
    }
    // ✅ SERVICE hole Type + Payment Code required
    if (header.purchaseType === "SERVICE" && (!header.invType || !header.paymentCode)) {
      toast.error("Please select Type and Payment Code for a Service purchase.");
      return;
    }

    const payload = {
      header: {
        ...header,
        supplierId: header.supplierId ? Number(header.supplierId) : null,
        invType: header.purchaseType === "SERVICE" ? (header.invType ? Number(header.invType) : null) : null,
        paymentCode: header.purchaseType === "SERVICE" ? (header.paymentCode || null) : null,
      },
      items: items.map((it, idx) => ({
        itemNo: idx + 1,
        itemId: it.itemId,
        description: it.description,
        qtyRecv: Number(it.qtyRecv),
        unitId: it.unitId ? Number(it.unitId) : null,
        unitPrice: Number(it.unitPrice),
      })),
    };

    try {
      await updateMutation.mutateAsync(payload);
      toast.success("Form updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update form.");
    }
  };

  const handleCancel = async () => {
    if (isDirty && showConfirmation) {
      const ok = await showConfirmation({
        title: "Discard changes?",
        description: "You have unsaved changes. Close without saving?",
        confirmText: "Discard", cancelText: "Keep Editing", variant: "destructive",
      });
      if (!ok) return;
    }
    onOpenChange(false);
  };

  const isSubmitting = updateMutation.isPending;
  const isLoading = isLoadingForm || !header;
  const isDisabled = isSubmitting || isLocked;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-5xl w-full flex flex-col gap-0 p-0 z-105">

        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit Purchase Recognition {formId ? `— ${formId}` : ""}</SheetTitle>
              <SheetDescription>Update form details and line items</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-muted-foreground text-sm">Loading form...</p>
          </div>
        ) : (
          <>
            {isLocked && (
              <div className="mx-6 mt-4 px-3 py-2 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-sm border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                This form is Approved and locked for editing.
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Recognition Date <span className="text-destructive">*</span></Label>
                  <Input
                    type="date" value={header.recognitionDate}
                    onChange={(e) => updateHeader("recognitionDate", e.target.value)}
                    disabled={isDisabled} className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Need by Date</Label>
                  <Input
                    type="date" value={header.invoiceDate}
                    onChange={(e) => updateHeader("invoiceDate", e.target.value)}
                    disabled={isDisabled} className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">PO Number</Label>
                  <Input value={header.poNumber} disabled className="h-9 bg-muted/50" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Supplier</Label>
                  <Select
                    value={header.supplierId ? String(header.supplierId) : ""}
                    onValueChange={handleSupplierChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="z-110">
                      {suppliers.map((s) => (
                        <SelectItem key={s.SUPPLIER_ID} value={String(s.SUPPLIER_ID)}>
                          {s.SUPPLIER_NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Purchase Type <span className="text-destructive">*</span></Label>
                  <Select
                    value={header.purchaseType}
                    onValueChange={(v) => updateHeader("purchaseType", v)}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="z-110">
                      <SelectItem value="ITEM">Item</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Contact Person</Label>
                  <Input
                    value={header.contactPerson}
                    onChange={(e) => updateHeader("contactPerson", e.target.value)}
                    disabled={isDisabled} className="h-9"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 md:col-span-3">
                  <Label className="text-xs font-medium">Description</Label>
                  <Input
                    value={header.description}
                    onChange={(e) => updateHeader("description", e.target.value)}
                    disabled={isDisabled} className="h-9"
                    placeholder="Brief note about this purchase"
                  />
                </div>
              </div>

              {header.purchaseType === "SERVICE" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Type <span className="text-destructive">*</span></Label>
                    <Select value={header.invType} onValueChange={(v) => updateHeader("invType", v)} disabled={isDisabled}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent className="z-110">
                        {invTypes.map((t) => (<SelectItem key={t.ID} value={String(t.ID)}>{t.DESCRIPTIO}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Payment Code <span className="text-destructive">*</span></Label>
                    <Select value={header.paymentCode} onValueChange={(v) => updateHeader("paymentCode", v)} disabled={isDisabled}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select payment" /></SelectTrigger>
                      <SelectContent className="z-110">
                        {paymentCodes.map((c) => (<SelectItem key={c.ACCOUNT_ID} value={String(c.ACCOUNT_ID)}>{c.ACCOUNT_NAME}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Label className="text-xs font-medium">Itemized Asset Breakdown</Label>
                <Button type="button" size="sm" onClick={addItemRow} disabled={isDisabled}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                </Button>
              </div>

              <div className="rounded-md overflow-hidden border border-border">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: "#1a3c34" }}>
                      {["#", "Item", "Description", " Qty", "UOM", "Unit Price", "Total", ""].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="px-3 py-1 text-center text-muted-foreground w-8">{idx + 1}</td>
                        <td className="px-1 py-1 min-w-[200px]">
                          <ItemPicker
                            value={item.itemId}
                            displayName={item.itemName}
                            onSelect={(selected) => handleItemSelect(idx, selected)}
                            disabled={isDisabled}
                          />
                        </td>
                        <td className="px-1 py-1 min-w-[200px]">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(idx, "description", e.target.value)}
                            disabled={isDisabled}
                            className={editableCell + " w-full text-left"}
                          />
                        </td>
                        <td className="px-1 py-1 w-24">
                          <Input
                            type="number" min="0"
                            value={item.qtyRecv}
                            onChange={(e) => updateItem(idx, "qtyRecv", e.target.value)}
                            disabled={isDisabled}
                            className={editableCell + " w-full text-center"}
                          />
                        </td>
                        <td className="px-1 py-1 w-28">
                          <Select
                            value={item.unitId ? String(item.unitId) : ""}
                            onValueChange={(v) => updateItem(idx, "unitId", v)}
                            disabled={isDisabled}
                          >
                            <SelectTrigger className="h-8 text-sm border-0 rounded-none bg-blue-50 dark:bg-blue-950/40">
                              <SelectValue placeholder="UOM" />
                            </SelectTrigger>
                            <SelectContent className="z-110">
                              {uoms.map((u) => (
                                <SelectItem key={u.ID} value={String(u.ID)}>{u.NAME}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-1 py-1 w-28">
                          <Input
                            type="number" min="0" step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                            disabled={isDisabled}
                            className={editableCell + " w-full text-center"}
                          />
                        </td>
                        <td className="px-3 py-1 w-28 text-right tabular-nums font-medium text-orange-600 dark:text-orange-400">
                          {lineTotal(item) > 0
                            ? lineTotal(item).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : "—"}
                        </td>
                        <td className="px-1 py-1 w-8">
                          <Button
                            type="button" variant="ghost" size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeItem(idx)}
                            disabled={isDisabled}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-72 rounded-md overflow-hidden border border-border text-sm">
                  <div className="flex items-center justify-between px-3 py-2 font-medium bg-muted/40">
                    <span>Total</span>
                    <span className="tabular-nums">
                      {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || items.length === 0 || isLocked}>
                {isLocked
                  ? <><Lock className="h-3.5 w-3.5 mr-1" />Approved — Locked</>
                  : isSubmitting
                  ? <><Spinner className="mr-2 h-4 w-4" />Updating...</>
                  : "Update Form"}
              </Button>
            </div>
          </>
        )}

      </SheetContent>
    </Sheet>
  );
}