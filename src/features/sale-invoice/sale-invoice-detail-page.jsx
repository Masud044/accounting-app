import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FileText, Download, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useInvoiceById } from "./queries";

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};
const fmtAmt = (v) =>
  Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

export default function InvoiceDetailSheet({ open, onOpenChange, hid }) {
  const { data: invoice, isLoading, isError, error } = useInvoiceById(hid);
  const [isDownloading, setIsDownloading] = useState(false);

  // ── Download as PDF ──────────────────────────────────────────────────────
  // Built directly with jsPDF + autotable (no DOM screenshot), so it never
  // trips over Tailwind v4's oklch() colors like html2canvas-based tools do.
  const handleDownload = async () => {
    if (!invoice) return;
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 14;

      // ── Farm header (left) + Invoice title (right) ──
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Your Farm Name", marginX, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Address line, City, Country", marginX, 26);
      doc.text("Phone: 01XXXXXXXXX", marginX, 31);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(16, 122, 87); // emerald-ish
      doc.text("INVOICE", pageWidth - marginX, 20, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text(`Invoice #: ${invoice.HID}`, pageWidth - marginX, 27, { align: "right" });
      doc.text(`Date: ${fmtDate(invoice.INVOICE_DATE)}`, pageWidth - marginX, 32, { align: "right" });

      // ── Bill To ──
      let y = 42;
      doc.setFillColor(245, 245, 245);
      doc.rect(marginX, y, pageWidth - marginX * 2, 24, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text("BILL TO", marginX + 4, y + 6);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(20);
      doc.text(invoice.CUSTOMER_NAME || "—", marginX + 4, y + 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(90);
      let by = y + 17;
      if (invoice.ADDRESS) { doc.text(String(invoice.ADDRESS), marginX + 4, by); by += 4.5; }
      if (invoice.PHONE || invoice.MOBILE) { doc.text(String(invoice.PHONE || invoice.MOBILE), marginX + 4, by); by += 4.5; }
      if (invoice.EMAIL) { doc.text(String(invoice.EMAIL), marginX + 4, by); }

      // ── Line items table ──
      // Fixed column widths so header + body always line up exactly,
      // and total width matches the summary table below.
      const tableWidth = pageWidth - marginX * 2; // 182mm on A4
      const colWidths = {
        idx:    10,
        date:   45,
        qty:    30,
        price:  35,
        amount: tableWidth - 10 - 45 - 30 - 35, // remainder, ~62mm
      };
      const colHalign = ["left", "left", "right", "right", "right"];

      autoTable(doc, {
        startY: y + 30,
        head: [["#", "Production Date", "Qty (eggs)", "Price / egg", "Amount"]],
        body: invoice.lines.map((line, idx) => [
          idx + 1,
          fmtDate(line.PRODUCTION_DATE),
          Number(line.PRODUCTION_QTY || 0).toLocaleString(),
          `Tk ${fmtAmt(line.PRICE)}`,
          `Tk ${fmtAmt(line.LINE_TOTAL)}`,
        ]),
        margin: { left: marginX, right: marginX },
        tableWidth,
        headStyles: { fillColor: [243, 244, 246], textColor: [80, 80, 80], fontStyle: "bold", fontSize: 8 },
        bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
        columnStyles: {
          0: { cellWidth: colWidths.idx },
          1: { cellWidth: colWidths.date },
          2: { cellWidth: colWidths.qty },
          3: { cellWidth: colWidths.price },
          4: { cellWidth: colWidths.amount, fontStyle: "bold" },
        },
        // columnStyles.halign isn't always honored for the head section,
        // so force it explicitly here for both head and body cells.
        didParseCell: (data) => {
          data.cell.styles.halign = colHalign[data.column.index];
        },
      });

      // ── Summary ── (own mini-table, same margins/width as items table
      // above, so its right edge lines up exactly with the Amount column)
      const finalY = doc.lastAutoTable.finalY + 8;

      autoTable(doc, {
        startY: finalY,
        body: [
          ["Total Qty", `${Number(invoice.TOT_QTY || 0).toLocaleString()} eggs`],
          ["Total Due", `Tk ${fmtAmt(invoice.TOT_AMT)}`],
        ],
        theme: "plain",
        margin: { left: marginX, right: marginX },
        tableWidth,
        columnStyles: {
          0: { cellWidth: tableWidth - 55, halign: "left" },
          1: { cellWidth: 55, halign: "right" },
        },
        bodyStyles: { fontSize: 9, textColor: [90, 90, 90], cellPadding: { top: 2, bottom: 2 } },
        didParseCell: (data) => {
          if (data.row.index === 1) {
            data.cell.styles.fontSize = 11;
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor = data.column.index === 1 ? [16, 122, 87] : [20, 20, 20];
            if (data.column.index === 0) {
              data.cell.styles.lineWidth = { top: 0.3 };
              data.cell.styles.lineColor = [200, 200, 200];
            } else {
              data.cell.styles.lineWidth = { top: 0.3 };
              data.cell.styles.lineColor = [200, 200, 200];
            }
          }
        },
      });

      doc.save(`invoice-${invoice.HID}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-4xl w-full flex flex-col gap-0 p-0 z-105">

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle>Invoice #{hid}</SheetTitle>
                <SheetDescription>Full invoice detail</SheetDescription>
              </div>
            </div>
            {invoice && (
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
                {isDownloading
                  ? <><Spinner className="h-4 w-4 mr-1" />Preparing...</>
                  : <><Download className="h-4 w-4 mr-1" />Download PDF</>}
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner className="h-10 w-10" />
              <p className="text-sm text-muted-foreground">Loading invoice...</p>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to load</AlertTitle>
              <AlertDescription>{error?.message}</AlertDescription>
            </Alert>
          )}

          {invoice && (
            <div className="space-y-6 bg-white p-6 text-black">

              {/* Farm / Invoice header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold">Your Farm Name</h1>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Address line, City, Country
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: 01XXXXXXXXX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-700">INVOICE</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Invoice #: <span className="font-medium text-black">{invoice.HID}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: <span className="font-medium text-black">{fmtDate(invoice.INVOICE_DATE)}</span>
                  </p>
                </div>
              </div>

              {/* Bill to */}
              <div className="bg-gray-50 rounded-md p-4 space-y-0.5 border border-gray-200">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                  Bill To
                </p>
                <p className="font-semibold text-black">{invoice.CUSTOMER_NAME || "—"}</p>
                {invoice.ADDRESS && (
                  <p className="text-sm text-gray-600">{invoice.ADDRESS}</p>
                )}
                {(invoice.PHONE || invoice.MOBILE) && (
                  <p className="text-sm text-gray-600">
                    {invoice.PHONE || invoice.MOBILE}
                  </p>
                )}
                {invoice.EMAIL && (
                  <p className="text-sm text-gray-600">{invoice.EMAIL}</p>
                )}
              </div>

              {/* Line items table */}
              <div className="overflow-hidden rounded-md border border-gray-200">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">#</th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500">Production Date</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">Qty (eggs)</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">Price / egg</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lines.map((line, idx) => (
                      <tr key={line.LID} className="border-t border-gray-200">
                        <td className="px-4 py-2.5 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-2.5">{fmtDate(line.PRODUCTION_DATE)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                          {Number(line.PRODUCTION_QTY || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">
                           {fmtAmt(line.PRICE)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-medium">
                          {fmtAmt(line.LINE_TOTAL)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Qty</span>
                    <span className="font-medium tabular-nums">
                      {Number(invoice.TOT_QTY || 0).toLocaleString()} eggs
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="font-semibold">Total Due</span>
                    <span className="font-bold text-emerald-700 tabular-nums text-base">
                       {fmtAmt(invoice.TOT_AMT)}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}