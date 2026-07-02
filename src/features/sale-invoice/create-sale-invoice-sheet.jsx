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
import { FileText, Trash2, ChevronDown, Plus } from "lucide-react";
import { useCreateInvoice } from "./queries";
import { useCustomers } from "@/features/customer/queries";
import { useAllEggProductions } from "@/features/egg-production/queries";

// ── helpers ────────────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ── Editable cell styles ───────────────────────────────────────────────────────
const editableCell =
  "h-8 text-sm border-0 rounded-none bg-blue-50 dark:bg-blue-950/40 " +
  "focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0 " +
  "text-center px-1";

const yellowCell =
  "h-8 text-sm border-0 rounded-none bg-yellow-100 dark:bg-yellow-900/40 " +
  "focus-visible:ring-1 focus-visible:ring-yellow-400 focus-visible:ring-offset-0 " +
  "text-center px-1";

export default function AddInvoiceSheet({ open, onOpenChange, showConfirmation }) {
  const createMutation = useCreateInvoice();
  const { data: customers   = [] } = useCustomers();
  const { data: productions = [] } = useAllEggProductions();

  const [customerId,     setCustomerId]     = useState("");
  const [invoiceDate,    setInvoiceDate]    = useState(today());
  const [lines,          setLines]          = useState([]);
  const [taxRate,        setTaxRate]        = useState(5);
  const [manualTotal,    setManualTotal]    = useState("");
  const [isDirty,        setIsDirty]        = useState(false);

  // multi-select state for the "Add Production Record" picker
  const [pickerOpen,       setPickerOpen]       = useState(false);
  const [checkedProdIds,   setCheckedProdIds]   = useState([]);

  useEffect(() => {
    if (open) {
      setCustomerId(""); setInvoiceDate(today());
      setLines([]); setCheckedProdIds([]);
      setTaxRate(5); setManualTotal(""); setIsDirty(false);
    }
  }, [open]);

  // production IDs already used across ALL lines (each line can now hold
  // multiple merged production components)
  const usedProdIds = lines.flatMap((l) => l.components.map((c) => String(c.productionId)));

  const toggleChecked = (id) => {
    setCheckedProdIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ── Add merged production line ─────────────────────────────────────────────
  // All currently checked productions collapse into a single line: quantities
  // sum together, date defaults to today (editable), everything else behaves
  // like a normal line. The individual production breakdown is kept in
  // `components` so we can still submit correct per-production quantities.
  const handleAddSelected = () => {
  if (checkedProdIds.length === 0) return;

  const chosen = productions.filter((p) => checkedProdIds.includes(String(p.ID)));
  if (chosen.length === 0) return;

  setLines((prev) => {
    // Already ekta line ache — tar modde e merge hobe, notun row hobe na
    if (prev.length > 0) {
      const existing = prev[0];
      const newComponents = [
        ...existing.components,
        ...chosen.map((p) => ({ productionId: p.ID, qty: Number(p.QTY || 0) })),
      ];
      const totalQty = newComponents.reduce((s, c) => s + c.qty, 0);

      const updatedLine = {
        ...existing,
        components: newComponents,
        qty: totalQty,
        description:
          newComponents.length > 1
            ? `Egg sale - ${newComponents.length} production dates`
            : "Egg sale - daily production",
      };

      return [updatedLine];
    }

    // Prothom bar — notun 1 ta line create hobe
    const totalQty = chosen.reduce((s, p) => s + Number(p.QTY || 0), 0);
    return [
      {
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
        unitPrice: "",
      },
    ];
  });

  setCheckedProdIds([]);
  setPickerOpen(false);
  setIsDirty(true);
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
    (s, l) => s + Number(l.qty || 0) * Number(l.unitPrice || 0), 0
  );
  const taxAmt   = subtotal * (Number(taxRate || 0) / 100);
  const autoTotal = subtotal + taxAmt;
  const totalDue  = manualTotal !== "" ? Number(manualTotal) : autoTotal;

  const availableProductions = productions.filter(
    (p) => !usedProdIds.includes(String(p.ID))
  );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!customerId)       { toast.error("Please select a customer.");        return; }
    if (!invoiceDate)      { toast.error("Please select invoice date.");      return; }
    if (lines.length === 0){ toast.error("Add at least one production line."); return; }
    if (lines.some((l) => !l.unitPrice || Number(l.unitPrice) <= 0)) {
      toast.error("Enter unit price for all lines."); return;
    }

    // Expand each (possibly merged) line back into one backend row per
    // production, so quantities stay traceable to their source production.
    // If the displayed qty was edited away from the auto-summed total, the
    // difference is distributed proportionally across the merged components.
    const backendLines = lines.flatMap((l) => {
      const originalSum = l.components.reduce((s, c) => s + c.qty, 0) || 1;
      const editedQty    = Number(l.qty || 0);
      const ratio        = editedQty / originalSum;

      return l.components.map((c) => ({
        productionId:  Number(c.productionId),
        productionQty: ratio === 1 ? c.qty : Math.round(c.qty * ratio),
        price:         Number(l.unitPrice),
      }));
    });

    try {
      await createMutation.mutateAsync({
        customerId:  Number(customerId),
        invoiceDate,
        createdBy:   null,
        taxRate:     Number(taxRate),
        totAmt:      totalDue,
        lines:       backendLines,
      });
      toast.success("Invoice created successfully!");
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create invoice.");
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

  const isSubmitting = createMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <SheetContent className="sm:max-w-4xl w-full flex flex-col gap-0 p-0 z-105">

        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>New Invoice</SheetTitle>
              <SheetDescription>Create a new sales invoice</SheetDescription>
            </div>
          </div>
        </SheetHeader>

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
              onSelect={(e) => e.preventDefault()} // keep menu open for multi-pick
              onCheckedChange={() => toggleChecked(id)}
            >
              {fmtDate(p.PRODUCTION_DATE)} — {Number(p.QTY || 0).toLocaleString()} eggs
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Add button moved OUTSIDE the dropdown — Radix's dismiss layer was
        swallowing clicks on this button when it lived inside DropdownMenuContent */}
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
</div>
          {/* ── Invoice Table ── */}
          <div className="rounded-md overflow-hidden border border-border">
            <table className="w-full text-sm border-collapse">

              {/* Table head */}
              <thead>
                <tr style={{ background: "#1a3c34" }}>
                  {["Date", "Description", "Quantity (Eggs)", "Unit Price/Egg", "Amount", ""].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lines.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Select production record(s) above to add a line.
                    </td>
                  </tr>
                )}

                {lines.map((line, idx) => {
                  const amount = Number(line.qty || 0) * Number(line.unitPrice || 0);
                  return (
                    <tr key={idx} className="border-t border-border">

                      {/* Date — blue editable, defaults to today */}
                      <td className="px-1 py-1 w-32">
                        <Input
                          type="date"
                          value={line.date}
                          onChange={(e) => updateLine(idx, "date", e.target.value)}
                          disabled={isSubmitting}
                          className={editableCell + " w-full"}
                        />
                      </td>

                      {/* Description — blue editable */}
                      <td className="px-1 py-1">
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(idx, "description", e.target.value)}
                          disabled={isSubmitting}
                          className={editableCell + " w-full text-left"}
                        />
                       
                      </td>

                      {/* Qty — blue editable, auto-summed from selection */}
                      <td className="px-1 py-1 w-28">
                        <Input
                          type="number" min="0"
                          value={line.qty}
                          onChange={(e) => updateLine(idx, "qty", e.target.value)}
                          disabled={isSubmitting}
                          className={editableCell + " w-full"}
                        />
                      </td>

                      {/* Unit Price — yellow (select before print) */}
                      <td className="px-1 py-1 w-28">
                        <Input
                          type="number" min="0" step="0.01" placeholder="0"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(idx, "unitPrice", e.target.value)}
                          disabled={isSubmitting}
                          className={yellowCell + " w-full"}
                        />
                      </td>

                      {/* Amount — computed, read-only */}
                      <td className="px-3 py-1 w-24 text-right tabular-nums font-medium text-orange-600 dark:text-orange-400">
                        {amount > 0 ? amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2, maximumFractionDigits: 2,
                        }) : "—"}
                      </td>

                      {/* Remove */}
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

                {/* Subtotal */}
                <div className="flex items-center border-b border-border">
                  <span className="flex-1 px-3 py-2 font-medium bg-muted/40">Subtotal</span>
                  <span className="w-28 px-3 py-2 text-right tabular-nums">
                    {subtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Tax Rate — editable */}
                <div className="flex items-center border-b border-border">
                  <span className="flex-1 px-3 py-1.5 font-medium bg-muted/40">Tax Rate</span>
                  <div className="w-28 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number" min="0" max="100" step="0.1"
                        value={taxRate}
                        onChange={(e) => { setTaxRate(e.target.value); setManualTotal(""); }}
                        disabled={isSubmitting}
                        className="h-7 text-sm text-right text-blue-600 dark:text-blue-400
                                   border-0 bg-blue-50 dark:bg-blue-950/40
                                   focus-visible:ring-1 focus-visible:ring-blue-400
                                   focus-visible:ring-offset-0 px-1"
                      />
                      <span className="text-muted-foreground text-xs">%</span>
                    </div>
                  </div>
                </div>

                {/* Tax Amount */}
                <div className="flex items-center border-b border-border">
                  <span className="flex-1 px-3 py-2 font-medium bg-muted/40">Tax Amount</span>
                  <span className="w-28 px-3 py-2 text-right tabular-nums">
                    {taxAmt.toLocaleString(undefined, {
                      minimumFractionDigits: 2, maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* Total Due — editable override */}
                <div className="flex items-center" style={{ background: "#1a3c34" }}>
                  <span className="flex-1 px-3 py-2 font-bold text-white">TOTAL DUE</span>
                  <div className="w-28 px-2 py-1">
                    <Input
                      type="number" min="0" step="0.01"
                      value={manualTotal !== "" ? manualTotal : autoTotal.toFixed(2)}
                      onChange={(e) => setManualTotal(e.target.value)}
                      disabled={isSubmitting}
                      className="h-7 text-sm text-right font-bold text-white
                                 border-0 bg-white/10
                                 focus-visible:ring-1 focus-visible:ring-white/60
                                 focus-visible:ring-offset-0 px-1"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || lines.length === 0}>
            {isSubmitting
              ? <><Spinner className="mr-2 h-4 w-4" />Creating...</>
              : "Create Invoice"}
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}