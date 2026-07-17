import { useState } from "react";
import { toast } from "react-toastify";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Check, X, FileText, Building2, Calendar, Hash } from "lucide-react";
import { usePurchaseRecognitionByFormId, useUpdateApprovalStatus } from "./queries";

const fmtMoney = (val) =>
  Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      <Icon className="h-3 w-3" /> {label}
    </p>
    <p className="text-sm font-medium">{value || "—"}</p>
  </div>
);

export default function ApprovalDetailSheet({ open, onOpenChange, formId }) {
  const { data: form, isLoading } = usePurchaseRecognitionByFormId(formId);
  const updateStatusMutation = useUpdateApprovalStatus();

  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync({ formId, status: "Approved" });
      toast.success(`Form ${formId} approved.`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve.");
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) { toast.error("Rejection reason required."); return; }
    try {
      await updateStatusMutation.mutateAsync({ formId, status: "Rejected", reason: reason.trim() });
      toast.success(`Form ${formId} rejected.`);
      onOpenChange(false);
      setRejecting(false);
      setReason("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject.");
    }
  };

  const isPending = form?.STATUS === undefined ? true : Number(form?.STATUS) === 2;
  const items = form?.items || [];
  const totalAmount = items.reduce((s, it) => s + Number(it.QTY_RECV || 0) * Number(it.UNIT_PRICE || 0), 0);

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { onOpenChange(false); setRejecting(false); setReason(""); } }}>
      <SheetContent className="sm:max-w-3xl w-full flex flex-col gap-0 p-0 z-105">
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle>Review Form {formId}</SheetTitle>
              <SheetDescription>Check details before approving or rejecting</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {isLoading || !form ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-muted-foreground text-sm">Loading details...</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Header info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg border border-border bg-muted/20">
                <InfoField icon={Hash} label="PO Number" value={form.PO_NUMBER} />
                <InfoField icon={Building2} label="Vendor" value={form.VENDOR_NAME} />
                <InfoField icon={Calendar} label="Recognition Date" value={fmtDate(form.RECOGNITION_DATE)} />
                <InfoField icon={FileText} label="Purchase Type" value={form.PURCHASE_TYPE} />
                <InfoField icon={FileText} label="Contact Person" value={form.CONTACT_PERSON} />
                <InfoField icon={FileText} label="Description" value={form.DESCRIPTION} />
              </div>

              {/* Items table */}
              <div>
                <p className="text-xs font-medium mb-2">Itemized Breakdown</p>
                <div className="rounded-md overflow-hidden border border-border">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr style={{ background: "#1a3c34" }}>
                        {["#", "Item", "Description", "Qty", "UOM", "Unit Price", "Total"].map((h) => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-white whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, idx) => (
                        <tr key={it.ITEM_NO ?? idx} className="border-t border-border">
                          <td className="px-3 py-2 text-center text-muted-foreground">{idx + 1}</td>
                          <td className="px-3 py-2">{it.ITEM_NAME}</td>
                          <td className="px-3 py-2 text-muted-foreground">{it.DESCRIPTION}</td>
                          <td className="px-3 py-2 text-center">{it.QTY_RECV}</td>
                          <td className="px-3 py-2 text-center">{it.UOM}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(it.UNIT_PRICE)}</td>
                          <td className="px-3 py-2 text-right tabular-nums font-medium">
                            {fmtMoney(Number(it.QTY_RECV || 0) * Number(it.UNIT_PRICE || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-72 rounded-md overflow-hidden border border-border text-sm">
                  <div className="flex items-center justify-between px-3 py-2 font-medium bg-muted/40">
                    <span>Total</span>
                    <span className="tabular-nums">{fmtMoney(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Reject reason inline */}
              {rejecting && (
                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm font-medium mb-2 text-red-700 dark:text-red-300">Rejection Reason</p>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    autoFocus
                    placeholder="Why is this form being rejected?"
                    className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-400 bg-white dark:bg-background"
                  />
                </div>
              )}
            </div>

            {/* Footer actions */}
            {isPending && (
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
                {rejecting ? (
                  <>
                    <Button variant="outline" onClick={() => { setRejecting(false); setReason(""); }} disabled={updateStatusMutation.isPending}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={updateStatusMutation.isPending}>
                      {updateStatusMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Rejecting...</> : "Confirm Reject"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => setRejecting(true)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleApprove}
                      disabled={updateStatusMutation.isPending}
                    >
                      {updateStatusMutation.isPending ? <><Spinner className="mr-2 h-4 w-4" />Approving...</> : <><Check className="h-4 w-4 mr-1" /> Approve</>}
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}