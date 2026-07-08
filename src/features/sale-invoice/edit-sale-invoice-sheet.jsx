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
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { FileText, Trash2, ChevronDown, Plus, X, PlusIcon } from "lucide-react";
import { useInvoiceById, useUpdateInvoice } from "./queries";
import { useCustomers } from "@/features/customer/queries";
import { useAllEggProductions } from "@/features/egg-production/queries";

// ── helpers ────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

// const fmtDate = (val) => {
//   if (!val) return "—";
//   return new Date(val).toLocaleDateString("en-GB", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// const toInputDate = (val) => {
//   if (!val) return today();
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return today();
//   return d.toISOString().split("T")[0];
// };

// ── Editable cell styles ───────────────────────────────────────────────────────

 const toInputDate = (val) => {
  if (!val) return today();
  // backend এখন 'YYYY-MM-DD' plain string পাঠায় — সরাসরি ব্যবহার করো,
  // কোনো Date()/timezone conversion করার দরকার নেই
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const d = new Date(val);
  if (isNaN(d.getTime())) return today();
  return d.toISOString().split("T")[0];
};

// ── Distribute a total quantity across components proportionally,
//    guaranteeing the distributed amounts sum EXACTLY to targetTotal
//    (uses the "largest remainder" method to avoid rounding drift) ──────────
function distributeQty(components, targetTotal) {
  const originalSum = components.reduce((s, c) => s + c.qty, 0) || 1;

  if (targetTotal === originalSum) {
    // No change needed — return original qtys as-is
    return components.map((c) => c.qty);
  }

  // Floor each proportional share, track remainders
  const raw = components.map((c) => (c.qty / originalSum) * targetTotal);
  const floored = raw.map(Math.floor);
  let remainder = targetTotal - floored.reduce((s, v) => s + v, 0);

  // Sort indices by fractional part (largest remainder first)
  const order = raw
    .map((v, i) => ({ i, frac: v - floored[i] }))
    .sort((a, b) => b.frac - a.frac);

  const result = [...floored];
  for (let k = 0; k < remainder; k++) {
    result[order[k].i] += 1;
  }
  return result;
}


const fmtDate = (val) => {
  if (!val) return "—";
  // 'YYYY-MM-DD' string হলে সরাসরি parse করো local-safe ভাবে (UTC constructor দিয়ে,
  // কারণ Date("YYYY-MM-DD") ব্রাউজারে UTC midnight ধরে parse হয়)
  const d = /^\d{4}-\d{2}-\d{2}$/.test(val)
    ? new Date(`${val}T00:00:00`)   // local midnight হিসেবে parse করো, UTC midnight নয়
    : new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const editableCell =
  "h-8 text-sm border-0 rounded-none bg-blue-50 dark:bg-blue-950/40 " +
  "focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0 " +
  "text-center px-1";

const yellowCell =
  "h-8 text-sm border-0 rounded-none bg-yellow-100 dark:bg-yellow-900/40 " +
  "focus-visible:ring-1 focus-visible:ring-yellow-400 focus-visible:ring-offset-0 " +
  "text-center px-1";

export default function EditInvoiceSheet({ open, onOpenChange, hid, showConfirmation }) {
  const { data: invoiceData, isLoading: isLoadingInvoice } = useInvoiceById(hid);
  const updateMutation = useUpdateInvoice(hid);
  const { data: customers   = [] } = useCustomers();
  const { data: productions = [] } = useAllEggProductions();

  const [customerId,     setCustomerId]     = useState("");
  const [invoiceDate,    setInvoiceDate]    = useState(today());
  const [lines,          setLines]          = useState([]);
  const [taxRate,        setTaxRate]        = useState(5);
  const [manualTotal,    setManualTotal]    = useState("");
  const [isDirty,        setIsDirty]        = useState(false);
  const [initialized,    setInitialized]    = useState(false);

  const [pickerOpen,     setPickerOpen]     = useState(false);
  const [checkedProdIds, setCheckedProdIds] = useState([]);

  // reset on open/close
  useEffect(() => {
    if (!open) {
      setInitialized(false);
      setCheckedProdIds([]);
      setIsDirty(false);
    }
  }, [open]);

  // populate form once invoice data has loaded — merge all saved
  // production rows into a single line, same convention as the create sheet
  useEffect(() => {
    if (!open || initialized || !invoiceData) return;

    setCustomerId(String(invoiceData.CUSTOMER_ID ?? ""));
    setInvoiceDate(toInputDate(invoiceData.INVOICE_DATE));

   const rawLines = (invoiceData.lines || []).filter((l) => l.PRODUTION_ID);
if (rawLines.length > 0) {
  const components = rawLines.map((l) => ({
    productionId: l.PRODUTION_ID,
    qty: Number(l.PRODUCTION_QTY || 0),
  }));
  const totalQty     = components.reduce((s, c) => s + c.qty, 0);
  const totalSaleQty = rawLines.reduce((s, l) => s + Number(l.SALE_QTY || 0), 0);

  setLines([
    {
      components,
      date: toInputDate(invoiceData.INVOICE_DATE),
      description: components.length > 1
        ? `Egg sale - ${components.length} production dates`
        : "Egg sale - daily production",
      qty: totalQty,
      saleQty: totalSaleQty || totalQty,   // ← notun, fallback qty
      unitPrice: rawLines[0]?.PRICE ?? "",
    },
  ]);
} else {
  setLines([]);
}
    setTaxRate(5);
    setManualTotal("");
    setInitialized(true);
  }, [open, initialized, invoiceData]);

  const usedProdIds = lines.flatMap((l) => l.components.map((c) => String(c.productionId)));

  const toggleChecked = (id) => {
    setCheckedProdIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

 

  const handleAddSelected = () => {
    if (checkedProdIds.length === 0) return;

    const chosen = productions.filter((p) => checkedProdIds.includes(String(p.ID)));
    if (chosen.length === 0) return;

    setLines((prev) => {
      if (prev.length > 0) {
        const existing = prev[0];
        const newComponents = [
          ...existing.components,
          ...chosen.map((p) => ({ productionId: p.ID, qty: Number(p.QTY || 0) })),
        ];
        const totalQty = newComponents.reduce((s, c) => s + c.qty, 0);

        return [{
          ...existing,
          components: newComponents,
          qty: totalQty,
          saleQty: totalQty,
          description:
            newComponents.length > 1
              ? `Egg sale - ${newComponents.length} production dates`
              : "Egg sale - daily production",
        }];
      }

      const totalQty = chosen.reduce((s, p) => s + Number(p.QTY || 0), 0);
      return [{
        components: chosen.map((p) => ({
          productionId: p.ID,
          qty: Number(p.QTY || 0),
        })),
        date: today(),
        description:
          chosen.length > 1
            ? `Egg sale - ${chosen.length} production dates`
            : "Egg sale - daily production",
        qty: totalQty,
        saleQty: totalQty,
        unitPrice: "",
      }];
    });

    setCheckedProdIds([]);
    setPickerOpen(false);
    setIsDirty(true);
  };

  // ── Remove a single production date chip ────────────────────────────────────
  // Removes one production from the merged line's components, recalculates
  // qty, and frees the date back up in the dropdown. If it was the last
  // remaining component, the whole line is dropped.
  const removeComponent = (prodId) => {
    setIsDirty(true);
    setLines((prev) => {
      if (prev.length === 0) return prev;
      const line = prev[0];
      const newComponents = line.components.filter(
        (c) => String(c.productionId) !== String(prodId)
      );
      if (newComponents.length === 0) return [];
      const totalQty = newComponents.reduce((s, c) => s + c.qty, 0);
      return [
        {
          ...line,
          components: newComponents,
          qty: totalQty,
          description:
            newComponents.length > 1
              ? `Egg sale - ${newComponents.length} production dates`
              : "Egg sale - daily production",
        },
      ];
    });
  };

  const updateLine = (idx, field, value) => {
    setIsDirty(true);
    setLines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeLine = (idx) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  // ── Calculations ───────────────────────────────────────────────────────────
  const subtotal = lines.reduce(
  (s, l) => s + Number(l.saleQty || 0) * Number(l.unitPrice || 0), 0
);
  const taxAmt   = subtotal * (Number(taxRate || 0) / 100);
  const autoTotal = subtotal + taxAmt;
  const totalDue  = manualTotal !== "" ? Number(manualTotal) : autoTotal;

  const availableProductions = productions.filter(
    (p) => !usedProdIds.includes(String(p.ID))
  );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!customerId)        { toast.error("Please select a customer.");        return; }
    if (!invoiceDate)       { toast.error("Please select invoice date.");      return; }
    if (lines.length === 0) { toast.error("Add at least one production line."); return; }
    if (lines.some((l) => !l.unitPrice || Number(l.unitPrice) <= 0)) {
      toast.error("Enter unit price for all lines."); return;
    }

  const backendLines = lines.flatMap((l) => {
  const productionQtys = distributeQty(l.components, Number(l.qty || 0));
  const saleQtys        = distributeQty(l.components, Number(l.saleQty || 0));

  return l.components.map((c, i) => ({
    productionId:  Number(c.productionId),
    productionQty: productionQtys[i],
    saleQty:       saleQtys[i],
    price:         Number(l.unitPrice),
  }));
});
    try {
      await updateMutation.mutateAsync({
        customerId:  Number(customerId),
        invoiceDate,
        createdBy:   null,
        taxRate:     Number(taxRate),
        totAmt:      totalDue,
        lines:       backendLines,
      });
      toast.success("Invoice updated successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update invoice.");
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

  // ── Data to pass to Create Receive Voucher page ─────────────────────────────
  // ── Data to pass to Create Receive Voucher page ─────────────────────────────
  const productionDatesText = lines
    .flatMap((l) => l.components)
    .map((c) => {
      const prod = productions.find((p) => String(p.ID) === String(c.productionId));
      return prod ? fmtDate(prod.PRODUCTION_DATE) : null;
    })
    .filter(Boolean)
    .join(", ");

 const receiveVoucherState = {
  customer: customerId,
  invoiceDate,
  invoiceHid: invoiceData?.HID,
  invoiceNo:  invoiceData?.INVOICE_ID ? String(invoiceData.INVOICE_ID) : "",
  saleInvoiceNo: invoiceData?.HID ?? "",
  description: productionDatesText || `Payment against Sale Invoice #${invoiceData?.HID ?? ""}`,
  rows: lines.map((l) => ({
    particulars: l.description,
    amount: Math.round(Number(l.saleQty || 0) * Number(l.unitPrice || 0) * 100) / 100,
  })),
};
  const isSubmitting = updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-3xl w-full flex flex-col gap-0 p-0 z-105">

        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Edit Invoice {invoiceData ? `#${invoiceData.HID}` : ""}</SheetTitle>
              <SheetDescription>Update sales invoice</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoadingInvoice ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-muted-foreground text-sm">Loading invoice...</p>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* ── Row 1: Customer + Invoice Date ── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Customer <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={customerId}
                    onValueChange={(v) => { setCustomerId(v); setIsDirty(true); }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="z-110">
                      {customers.map((c) => (
                        <SelectItem key={c.CUSTOMER_ID} value={String(c.CUSTOMER_ID)}>
                          {c.CUSTOMER_NAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Invoice Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date" value={invoiceDate}
                    onChange={(e) => { setInvoiceDate(e.target.value); setIsDirty(true); }}
                    disabled={isSubmitting} className="h-9"
                  />
                </div>
              </div>

              {/* ── Row 2: Production multi-select ── */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Add Production Record</Label>
                <div className="flex gap-2">
                  <DropdownMenu open={pickerOpen} onOpenChange={setPickerOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button" variant="outline"
                        className="h-9 flex-1 justify-between font-normal"
                        disabled={isSubmitting}
                      >
                        <span className="text-muted-foreground truncate">
                          {checkedProdIds.length > 0
                            ? `${checkedProdIds.length} production date(s) selected`
                            : "Select production date(s) to add line…"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="z-110 w-[--radix-dropdown-menu-trigger-width] max-h-72 overflow-y-auto">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Select one or more — combined into a single line
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {availableProductions.length === 0 && (
                        <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                          No available production records.
                        </div>
                      )}
                      {availableProductions.map((p) => {
                        const id = String(p.ID);
                        return (
                          <DropdownMenuCheckboxItem
                            key={id}
                            checked={checkedProdIds.includes(id)}
                            onSelect={(e) => e.preventDefault()}
                            onCheckedChange={() => toggleChecked(id)}
                          >
                            {fmtDate(p.PRODUCTION_DATE)} — {Number(p.QTY || 0).toLocaleString()} eggs
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    type="button"
                    className="h-9 shrink-0"
                    disabled={checkedProdIds.length === 0 || isSubmitting}
                    onClick={handleAddSelected}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add {checkedProdIds.length > 0 ? `${checkedProdIds.length} ` : ""}Selected
                  </Button>
                </div>

                {/* Checked (not yet added) production date chips — visible as soon as you check them */}
    {checkedProdIds.length > 0 && (
      <div className="flex flex-wrap gap-2 pt-1">
        {checkedProdIds.map((id) => {
          const prod = productions.find((p) => String(p.ID) === id);
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-xs font-medium"
            >
              {prod ? fmtDate(prod.PRODUCTION_DATE) : `#${id}`}
              <button
                type="button"
                onClick={() => toggleChecked(id)}
                disabled={isSubmitting}
                className="rounded-sm p-0.5 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>
    )}

                {/* Selected production date chips — mirrors what's already been
                    added to the invoice line. Clicking × pulls that date back
                    out of the line and it becomes available in the dropdown
                    again. */}
                {lines.length > 0 && lines[0].components.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lines[0].components.map((c) => {
                      const prod = productions.find(
                        (p) => String(p.ID) === String(c.productionId)
                      );
                      return (
                        <span
                          key={c.productionId}
                          className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-md  bg-blue-900 text-white text-xs font-bold"
                        >
                          {prod ? fmtDate(prod.PRODUCTION_DATE) : `#${c.productionId}`}
                          <button
                            type="button"
                            onClick={() => removeComponent(c.productionId)}
                            disabled={isSubmitting}
                            className="rounded-sm p-0.5  hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Invoice Table ── */}
              <div className="rounded-md overflow-hidden border border-border">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: "#1a3c34" }}>
                      {["Date", "Description", "Quantity (Eggs)", "Sales Qty", "Unit Price/Egg", "Amount", ""].map((h) => (
  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap">
    {h}
  </th>
))}
                    </tr>
                  </thead>

                  <tbody>
                    {lines.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                          Select production record(s) above to add a line.
                        </td>
                      </tr>
                    )}

                    {lines.map((line, idx) => {
                      const amount = Number(line.saleQty || 0) * Number(line.unitPrice || 0);
                      return (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-1 py-1 w-32">
                            <Input
                              type="date"
                              value={line.date}
                              onChange={(e) => updateLine(idx, "date", e.target.value)}
                              disabled={isSubmitting}
                              className={editableCell + " w-full"}
                            />
                          </td>

                          <td className="px-1 py-1">
                            <Input
                              value={line.description}
                              onChange={(e) => updateLine(idx, "description", e.target.value)}
                              disabled={isSubmitting}
                              className={editableCell + " w-full text-left"}
                            />
                          
                          </td>

                          {/* <td className="px-1 py-1 w-28">
                            <Input
                              type="number" min="0"
                              value={line.qty}
                              onChange={(e) => updateLine(idx, "qty", e.target.value)}
                              disabled={isSubmitting}
                              className={editableCell + " w-full"}
                            />
                          </td> */}
                          <td className="px-3 py-1 w-28 text-center tabular-nums font-medium">
  {Number(line.qty || 0).toLocaleString()}
</td>
                           <td className="px-1 py-1 w-28">
        <Input
          type="number" min="0"
          value={line.saleQty}
          onChange={(e) => updateLine(idx, "saleQty", e.target.value)}
          disabled={isSubmitting}
          className={yellowCell + " w-full"}
        />
      </td>

                          <td className="px-1 py-1 w-28">
                            <Input
                              type="number" min="0" step="0.01" placeholder="0"
                              value={line.unitPrice}
                              onChange={(e) => updateLine(idx, "unitPrice", e.target.value)}
                              disabled={isSubmitting}
                              className={yellowCell + " w-full"}
                            />
                          </td>

                          <td className="px-3 py-1 w-24 text-right tabular-nums font-medium text-orange-600 dark:text-orange-400">
                            {amount > 0 ? amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2, maximumFractionDigits: 2,
                            }) : "—"}
                          </td>

                          <td className="px-1 py-1 w-8">
                            <Button
                              type="button" variant="ghost" size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeLine(idx)}
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Summary ── */}
              {lines.length > 0 && (
                <div className="flex justify-end">
                  <div className="w-72 rounded-md overflow-hidden border border-border text-sm">
                    <div className="flex items-center border-b border-border">
                      <span className="flex-1 px-3 py-2 font-medium bg-muted/40">Subtotal</span>
                      <span className="w-28 px-3 py-2 text-right tabular-nums">
                        {subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2, maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                  
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="grid grid-cols-3 justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || lines.length === 0}>
                {isSubmitting
                  ? <><Spinner className="mr-2 h-4 w-4" />Updating...</>
                  : "Update Invoice"}
              </Button>

              <Link to="/dashboard/receive-create" state={receiveVoucherState}>
                <Button type="button" variant="secondary">
                  Receive Voucher
                </Button>
              </Link>
            </div>
          </>
        )}

      </SheetContent>
    </Sheet>
  );
}