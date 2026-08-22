// import { useState, useMemo } from "react";
// import {
//   AlertCircle,
//   RefreshCw,
//   BookOpen,
//   Printer,
//   ChevronDown,
//   ChevronRight,
//   Check,
//   ChevronsUpDown,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Spinner } from "@/components/ui/spinner";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import {
//   Popover, PopoverContent, PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
// } from "@/components/ui/command";
// import { cn } from "@/lib/utils";

// import { useGeneralLedger, useChartOfAccounts } from "./queries";

// const fmt = (val) =>
//   Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// const fmtDate = (val) => {
//   if (!val) return "—";
//   const d = new Date(val);
//   if (isNaN(d)) return String(val);
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
// };

// const fmtBalance = (val) => {
//   const n = Number(val || 0);
//   return n < 0 ? `${fmt(Math.abs(n))} CR` : `${fmt(n)} DR`;
// };

// export default function GeneralLedgerList() {
//   const [fromDate, setFromDate] = useState("2026-01-01");
//   const [toDate, setToDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const [accountCode, setAccountCode] = useState("");
//   const [applied, setApplied] = useState(null);
//   const [collapsed, setCollapsed] = useState({});
//   const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);

//   const { data: rows = [], isLoading, isError, error, refetch, isFetching } =
//     useGeneralLedger(applied);

//   const { data: allAccounts = [], isLoading: accountsLoading } = useChartOfAccounts();

//   // ── শুধু enabled + leaf accounts dropdown e দেখাবো (GL entry শুধু leaf-এ post হয়) ──
//   const accounts = useMemo(
//     () => allAccounts.filter((a) => a.ENABLED === 1),
//     [allAccounts]
//   );

//   const selectedAccount = accounts.find((a) => String(a.ACCOUNT_ID) === String(accountCode));

//   const handleGenerate = () => {
//     if (!fromDate || !toDate) return;
//     setApplied({ fromDate, toDate, accountCode: accountCode || null });
//   };

//   // ── Group rows by account CODE ──────────────────────────────────────────
//   const groups = useMemo(() => {
//     const map = new Map();
//     for (const r of rows) {
//       if (!map.has(r.CODE)) {
//         map.set(r.CODE, { code: r.CODE, name: r.ACCOUNT_NAME, entries: [] });
//       }
//       map.get(r.CODE).entries.push(r);
//     }
//     return Array.from(map.values());
//   }, [rows]);

//   const grandTotals = useMemo(() => {
//     if (!rows.length) return null;
//     return rows.reduce(
//       (acc, r) => ({
//         debit: acc.debit + Number(r.DEBIT || 0),
//         credit: acc.credit + Number(r.CREDIT || 0),
//       }),
//       { debit: 0, credit: 0 }
//     );
//   }, [rows]);

//   const toggleGroup = (code) =>
//     setCollapsed((c) => ({ ...c, [code]: !c[code] }));

//   // ── Filter bar ───────────────────────────────────────────────────────────
//   const FilterBar = (
//     <div className="bg-card rounded-lg border shadow-sm p-5 mb-4 print:hidden">
//       {/* Header row */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b">
//         <div className="flex items-center gap-2.5">
//           <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
//             <BookOpen className="h-5 w-5" />
//           </div>
//           <div>
//             <h1 className="text-lg md:text-xl font-semibold tracking-tight leading-none">
//               General Ledger
//             </h1>
//             <p className="text-xs text-muted-foreground mt-1">
//               Account-wise transaction history & running balance
//             </p>
//           </div>
//         </div>

//         {applied && (
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm" onClick={() => window.print()}>
//               <Printer className="h-4 w-4" />
//               <span className="ml-1.5 hidden sm:inline">Print</span>
//             </Button>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="ml-1.5 hidden sm:inline">Refresh</span>
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Account Code — full width row */}
//       <div className="mb-4">
//         <label className="text-xs font-medium text-muted-foreground block mb-1.5">
//           Account Code
//         </label>
//         <Popover open={accountPopoverOpen} onOpenChange={setAccountPopoverOpen}>
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               role="combobox"
//               aria-expanded={accountPopoverOpen}
//               className="w-full justify-between font-normal"
//             >
//               <span className="truncate text-left">
//                 {selectedAccount
//                   ? `${selectedAccount.ACCOUNT_ID} — ${selectedAccount.FULL_PATH.trim()}`
//                   : "All accounts"}
//               </span>
//               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
//             <Command>
//               <CommandInput placeholder="Search account code or name..." />
//               <CommandList>
//                 <CommandEmpty>
//                   {accountsLoading ? "Loading..." : "No account found."}
//                 </CommandEmpty>
//                 <CommandGroup>
//                   <CommandItem
//                     value="all-accounts"
//                     onSelect={() => {
//                       setAccountCode("");
//                       setAccountPopoverOpen(false);
//                     }}
//                   >
//                     <Check className={cn("mr-2 h-4 w-4", !accountCode ? "opacity-100" : "opacity-0")} />
//                     All accounts
//                   </CommandItem>
//                   {accounts.map((a) => (
//                     <CommandItem
//                       key={a.ID}
//                       value={`${a.ACCOUNT_ID} ${a.ACCOUNT_NAME}`}
//                       onSelect={() => {
//                         setAccountCode(a.ACCOUNT_ID);
//                         setAccountPopoverOpen(false);
//                       }}
//                     >
//                       <Check
//                         className={cn(
//                           "mr-2 h-4 w-4",
//                           String(accountCode) === String(a.ACCOUNT_ID) ? "opacity-100" : "opacity-0"
//                         )}
//                       />
//                       <span className="truncate">
//                         {a.ACCOUNT_ID} — {a.FULL_PATH.trim()}
//                       </span>
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               </CommandList>
//             </Command>
//           </PopoverContent>
//         </Popover>
//       </div>

//       {/* Date range + Generate — separate row */}
//       <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//         <div className="flex-1">
//           <label className="text-xs font-medium text-muted-foreground block mb-1.5">
//             From Date
//           </label>
//           <Input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="w-full"
//           />
//         </div>
//         <div className="flex-1">
//           <label className="text-xs font-medium text-muted-foreground block mb-1.5">
//             To Date
//           </label>
//           <Input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="w-full"
//           />
//         </div>
//         <Button onClick={handleGenerate} disabled={!fromDate || !toDate} className="sm:w-auto w-full">
//           <BookOpen className="mr-1 h-4 w-4" /> Generate
//         </Button>
//       </div>
//     </div>
//   );

//   if (!applied) {
//     return (
//       <div>
//         {FilterBar}
//         <div className="bg-card rounded-lg border shadow-sm p-4">
//           <Empty>
//             <EmptyHeader>
//               <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
//               <EmptyTitle>Date range select kore Generate button e click korun</EmptyTitle>
//             </EmptyHeader>
//           </Empty>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div>
//         {FilterBar}
//         <div className="bg-card rounded-lg border shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">General ledger generate kora hocche...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div>
//         {FilterBar}
//         <div className="bg-card rounded-lg border shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Report</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load general ledger."}</p>
//               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//                 {isFetching
//                   ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
//                   : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {FilterBar}

//       {/* Print header — only visible on print */}
//       <div className="hidden print:block mb-4 text-center">
//         <h1 className="text-xl font-bold">General Ledger</h1>
//         <p className="text-sm text-muted-foreground">
//           {fmtDate(applied.fromDate)} to {fmtDate(applied.toDate)}
//           {applied.accountCode ? ` — Account: ${applied.accountCode}` : ""}
//         </p>
//       </div>

//       {grandTotals && (
//         <div className="grid grid-cols-2 gap-3 mb-4 print:hidden">
//           <div className="bg-card rounded-lg border shadow-sm p-4">
//             <p className="text-sm text-muted-foreground">Total Debit</p>
//             <p className="text-lg font-semibold tabular-nums">{fmt(grandTotals.debit)}</p>
//           </div>
//           <div className="bg-card rounded-lg border shadow-sm p-4">
//             <p className="text-sm text-muted-foreground">Total Credit</p>
//             <p className="text-lg font-semibold tabular-nums">{fmt(grandTotals.credit)}</p>
//           </div>
//         </div>
//       )}

//       <div className="bg-card rounded-lg border shadow-sm p-4">
//         {groups.length === 0 ? (
//           <Empty>
//             <EmptyHeader>
//               <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
//               <EmptyTitle>No Records Found</EmptyTitle>
//             </EmptyHeader>
//           </Empty>
//         ) : (
//           <div className="space-y-6">
//             {groups.map((g) => {
//               const isCollapsed = collapsed[g.code];
//               const openingBal = g.entries[0]
//                 ? Number(g.entries[0].BALANCE) - (Number(g.entries[0].DEBIT) - Number(g.entries[0].CREDIT))
//                 : 0;
//               const closingBal = g.entries[g.entries.length - 1]?.BALANCE ?? 0;
//               const subtotal = g.entries.reduce(
//                 (acc, r) => ({
//                   debit: acc.debit + Number(r.DEBIT || 0),
//                   credit: acc.credit + Number(r.CREDIT || 0),
//                 }),
//                 { debit: 0, credit: 0 }
//               );

//               return (
//                 <div key={g.code} className="border rounded-md overflow-hidden break-inside-avoid">
//                   {/* Account header */}
//                   <button
//                     onClick={() => toggleGroup(g.code)}
//                     className="w-full flex items-center justify-between bg-muted/50 px-4 py-2.5 text-left print:hidden hover:bg-muted/70 transition-colors"
//                   >
//                     <span className="font-semibold">
//                       {g.code} — {g.name}
//                     </span>
//                     {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                   </button>
//                   <div className="hidden print:block bg-muted/50 px-4 py-2 font-semibold">
//                     {g.code} — {g.name}
//                   </div>

//                   {!isCollapsed && (
//                     <>
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Date</TableHead>
//                             <TableHead>Description</TableHead>
//                             <TableHead className="text-right">Debit</TableHead>
//                             <TableHead className="text-right">Credit</TableHead>
//                             <TableHead className="text-right">Balance</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           <TableRow className="bg-muted/20 italic">
//                             <TableCell colSpan={4} className="text-muted-foreground">
//                               Opening Balance
//                             </TableCell>
//                             <TableCell className="text-right tabular-nums text-muted-foreground">
//                               {fmtBalance(openingBal)}
//                             </TableCell>
//                           </TableRow>
//                           {g.entries.map((r, idx) => (
//                             <TableRow key={`${g.code}-${idx}`}>
//                               <TableCell>{fmtDate(r.GL_ENTRY_DATE)}</TableCell>
//                               <TableCell className="max-w-xs truncate text-muted-foreground">
//                                 {r.DESCRIPTION || "—"}
//                               </TableCell>
//                               <TableCell className="text-right tabular-nums">
//                                 {Number(r.DEBIT) ? fmt(r.DEBIT) : ""}
//                               </TableCell>
//                               <TableCell className="text-right tabular-nums">
//                                 {Number(r.CREDIT) ? fmt(r.CREDIT) : ""}
//                               </TableCell>
//                               <TableCell className="text-right tabular-nums">
//                                 {fmtBalance(r.BALANCE)}
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                           <TableRow className="font-semibold border-t-2">
//                             <TableCell colSpan={2}>Total / Closing Balance</TableCell>
//                             <TableCell className="text-right tabular-nums">{fmt(subtotal.debit)}</TableCell>
//                             <TableCell className="text-right tabular-nums">{fmt(subtotal.credit)}</TableCell>
//                             <TableCell className="text-right tabular-nums">{fmtBalance(closingBal)}</TableCell>
//                           </TableRow>
//                         </TableBody>
//                       </Table>
//                     </>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import {
  AlertCircle,
  RefreshCw,
  BookOpen,
  Download,
  Loader2,
  ChevronDown,
  Check,
  ChevronsUpDown,
  TrendingUp,
  TrendingDown,
  Scale,
  FileSearch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { useGeneralLedger, useChartOfAccounts } from "./queries";

const fmt = (val) =>
  Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d)) return String(val);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const fmtBalance = (val) => {
  const n = Number(val || 0);
  return n < 0 ? `${fmt(Math.abs(n))} CR` : `${fmt(n)} DR`;
};

export default function GeneralLedgerList() {
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [accountCode, setAccountCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: rows = [], isLoading, isError, error, refetch, isFetching } =
    useGeneralLedger(applied);

  const { data: allAccounts = [], isLoading: accountsLoading } = useChartOfAccounts();

  // ── শুধু enabled + leaf accounts dropdown e দেখাবো (GL entry শুধু leaf-এ post হয়) ──
  const accounts = useMemo(
    () => allAccounts.filter((a) => a.ENABLED === 1),
    [allAccounts]
  );

  const selectedAccount = accounts.find((a) => String(a.ACCOUNT_ID) === String(accountCode));

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    setApplied({ fromDate, toDate, accountCode: accountCode || null });
  };

  // ── Group rows by account CODE ──────────────────────────────────────────
  const groups = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      if (!map.has(r.CODE)) {
        map.set(r.CODE, { code: r.CODE, name: r.ACCOUNT_NAME, entries: [] });
      }
      map.get(r.CODE).entries.push(r);
    }
    return Array.from(map.values());
  }, [rows]);

  const grandTotals = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce(
      (acc, r) => ({
        debit: acc.debit + Number(r.DEBIT || 0),
        credit: acc.credit + Number(r.CREDIT || 0),
      }),
      { debit: 0, credit: 0 }
    );
  }, [rows]);

  const net = grandTotals ? grandTotals.debit - grandTotals.credit : 0;

  const toggleGroup = (code) =>
    setCollapsed((c) => ({ ...c, [code]: !c[code] }));

  // ── Export PDF ───────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (!groups.length) {
      toast.warning("Export করার মতো কোনো data নেই");
      return;
    }
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("General Ledger", 14, 15);
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100);
      const periodLabel = `Period: ${fmtDate(applied.fromDate)} to ${fmtDate(applied.toDate)}${
        applied.accountCode ? ` — Account: ${applied.accountCode}` : ""
      }`;
      doc.text(periodLabel, 14, 21);
      doc.setTextColor(20);

      let cursorY = 28;

      groups.forEach((g, gIdx) => {
        const openingBal = g.entries[0]
          ? Number(g.entries[0].BALANCE) - (Number(g.entries[0].DEBIT) - Number(g.entries[0].CREDIT))
          : 0;
        const closingBal = g.entries[g.entries.length - 1]?.BALANCE ?? 0;
        const subtotal = g.entries.reduce(
          (acc, r) => ({
            debit: acc.debit + Number(r.DEBIT || 0),
            credit: acc.credit + Number(r.CREDIT || 0),
          }),
          { debit: 0, credit: 0 }
        );

        if (gIdx > 0) cursorY += 4;

        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text(`${g.code} — ${g.name}`, 14, cursorY);
        cursorY += 2;

        autoTable(doc, {
          startY: cursorY,
          margin: { left: 14, right: 14 },
          head: [["Date", "Description", "Debit", "Credit", "Balance"]],
          body: [
            ["", "Opening Balance", "", "", fmtBalance(openingBal)],
            ...g.entries.map((r) => [
              fmtDate(r.GL_ENTRY_DATE),
              r.DESCRIPTION || "—",
              Number(r.DEBIT) ? fmt(r.DEBIT) : "",
              Number(r.CREDIT) ? fmt(r.CREDIT) : "",
              fmtBalance(r.BALANCE),
            ]),
          ],
          foot: [["", "Total / Closing Balance", fmt(subtotal.debit), fmt(subtotal.credit), fmtBalance(closingBal)]],
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [4, 120, 87], textColor: 255, fontStyle: "bold" },
          footStyles: { fillColor: [243, 244, 246], textColor: 20, fontStyle: "bold" },
          columnStyles: {
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
          },
          didParseCell: (data) => {
            if (data.row.section === "body" && data.row.index === 0) {
              data.cell.styles.fillColor = [249, 250, 251];
              data.cell.styles.fontStyle = "italic";
              data.cell.styles.textColor = 130;
            }
          },
        });

        cursorY = doc.lastAutoTable.finalY + 6;

        if (cursorY > 260 && gIdx < groups.length - 1) {
          doc.addPage();
          cursorY = 15;
        }
      });

      if (grandTotals) {
        if (cursorY > 250) {
          doc.addPage();
          cursorY = 15;
        }
        autoTable(doc, {
          startY: cursorY,
          margin: { left: 14, right: 14 },
          body: [
            ["Total Debit", fmt(grandTotals.debit)],
            ["Total Credit", fmt(grandTotals.credit)],
            [
              "Net Movement",
              `${fmt(Math.abs(net))} ${net < 0 ? "CR" : "DR"}`,
            ],
          ],
          styles: { fontSize: 9, cellPadding: 2.5, fontStyle: "bold" },
          columnStyles: { 1: { halign: "right" } },
          theme: "plain",
          tableWidth: 80,
        });
      }

      const suffix = `_${applied.fromDate}_to_${applied.toDate}${
        applied.accountCode ? `_${applied.accountCode}` : ""
      }`;
      doc.save(`general-ledger${suffix}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">General Ledger</h2>
              <p className="text-xs text-gray-400">
                Account-wise transaction history &amp; running balance
              </p>
            </div>
          </div>

          {applied && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-9 bg-white border-gray-200"
              >
                <RefreshCw className={cn("mr-1 size-4", isFetching && "animate-spin")} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isLoading || !groups.length || isExporting}
                className="h-9 bg-white border-gray-200"
              >
                {isExporting ? (
                  <Loader2 className="mr-1 size-4 animate-spin" />
                ) : (
                  <Download className="mr-1 size-4" />
                )}
                Export PDF
              </Button>
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Summary cards */}
          {grandTotals && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between rounded-md px-4 py-3 shadow-sm bg-emerald-50">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-700" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Total Debit
                  </span>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  {fmt(grandTotals.debit)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md px-4 py-3 shadow-sm bg-rose-50">
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} className="text-rose-700" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Total Credit
                  </span>
                </div>
                <span className="text-lg font-bold font-mono text-rose-700">
                  {fmt(grandTotals.credit)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md px-4 py-3 shadow-sm bg-gray-50">
                <div className="flex items-center gap-2">
                  <Scale size={16} className="text-gray-600" />
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Net Movement
                  </span>
                </div>
                <span
                  className={cn(
                    "text-lg font-bold font-mono",
                    net < 0 ? "text-rose-700" : "text-emerald-700"
                  )}
                >
                  {fmt(Math.abs(net))} {net < 0 ? "CR" : "DR"}
                </span>
              </div>
            </div>
          )}

          {/* Filters row */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5 w-full sm:w-72">
              <Label className="text-xs font-medium text-gray-500">Account Code</Label>
              <Popover open={accountPopoverOpen} onOpenChange={setAccountPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={accountPopoverOpen}
                    className="h-9 w-full justify-between font-normal bg-white border-gray-200"
                  >
                    <span className="truncate text-left text-sm text-gray-700">
                      {selectedAccount
                        ? `${selectedAccount.ACCOUNT_ID} — ${selectedAccount.FULL_PATH.trim()}`
                        : "All accounts"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search account code or name..." />
                    <CommandList>
                      <CommandEmpty>
                        {accountsLoading ? "Loading..." : "No account found."}
                      </CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all-accounts"
                          onSelect={() => {
                            setAccountCode("");
                            setAccountPopoverOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", !accountCode ? "opacity-100" : "opacity-0")} />
                          All accounts
                        </CommandItem>
                        {accounts.map((a) => (
                          <CommandItem
                            key={a.ID}
                            value={`${a.ACCOUNT_ID} ${a.ACCOUNT_NAME}`}
                            onSelect={() => {
                              setAccountCode(a.ACCOUNT_ID);
                              setAccountPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                String(accountCode) === String(a.ACCOUNT_ID) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="truncate">
                              {a.ACCOUNT_ID} — {a.FULL_PATH.trim()}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-500">From Date</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 w-40 bg-white border-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-500">To Date</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 w-40 bg-white border-gray-200"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!fromDate || !toDate}
              className="h-9 bg-emerald-700 hover:bg-emerald-800"
            >
              <BookOpen className="mr-1.5 size-4" />
              Generate
            </Button>
          </div>

          {isError && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <AlertCircle className="size-4" />
              {error?.message || "General ledger load করতে সমস্যা হয়েছে"}
            </p>
          )}

          {/* States */}
          {!applied ? (
            <div className="flex flex-col items-center justify-center h-40 rounded-md border border-dashed border-gray-200 text-center px-4">
              <FileSearch className="size-6 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                Date range select kore Generate button e click korun
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Spinner className="size-8 mb-3 text-emerald-700" />
              <p className="text-sm text-gray-400">General ledger generate kora hocche...</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex items-center justify-center h-24 rounded-md border border-gray-200 text-sm text-gray-400">
              No records found
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((g) => {
                const isCollapsed = collapsed[g.code];
                const openingBal = g.entries[0]
                  ? Number(g.entries[0].BALANCE) - (Number(g.entries[0].DEBIT) - Number(g.entries[0].CREDIT))
                  : 0;
                const closingBal = g.entries[g.entries.length - 1]?.BALANCE ?? 0;
                const subtotal = g.entries.reduce(
                  (acc, r) => ({
                    debit: acc.debit + Number(r.DEBIT || 0),
                    credit: acc.credit + Number(r.CREDIT || 0),
                  }),
                  { debit: 0, credit: 0 }
                );

                return (
                  <div
                    key={g.code}
                    className="rounded-md border border-gray-200 overflow-hidden"
                  >
                    {/* Account header */}
                    <button
                      onClick={() => toggleGroup(g.code)}
                      aria-expanded={!isCollapsed}
                      className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="font-mono text-xs font-semibold text-emerald-700 shrink-0">
                          {g.code}
                        </span>
                        <span className="text-sm font-bold text-gray-900 truncate">{g.name}</span>
                        <span className="text-xs text-gray-400 shrink-0">
                          · {g.entries.length} {g.entries.length === 1 ? "entry" : "entries"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline text-sm font-mono font-medium text-gray-500">
                          {fmtBalance(closingBal)}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-400 transition-transform duration-200",
                            isCollapsed && "-rotate-90"
                          )}
                        />
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gray-50">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wide w-28">
                                Date
                              </TableHead>
                              <TableHead className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                                Description
                              </TableHead>
                              <TableHead className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wide">
                                Debit
                              </TableHead>
                              <TableHead className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wide">
                                Credit
                              </TableHead>
                              <TableHead className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wide">
                                Balance
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="bg-gray-50/60 hover:bg-gray-50/60 italic">
                              <TableCell colSpan={4} className="text-xs text-gray-400">
                                Opening Balance
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs text-gray-400">
                                {fmtBalance(openingBal)}
                              </TableCell>
                            </TableRow>
                            {g.entries.map((r, idx) => (
                              <TableRow
                                key={`${g.code}-${idx}`}
                                className="hover:bg-gray-50/70 transition-colors"
                              >
                                <TableCell className="text-sm text-gray-600">
                                  {fmtDate(r.GL_ENTRY_DATE)}
                                </TableCell>
                                <TableCell className="max-w-xs truncate text-sm text-gray-600">
                                  {r.DESCRIPTION || "—"}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm text-gray-800">
                                  {Number(r.DEBIT) ? fmt(r.DEBIT) : ""}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm text-gray-800">
                                  {Number(r.CREDIT) ? fmt(r.CREDIT) : ""}
                                </TableCell>
                                <TableCell
                                  className={cn(
                                    "text-right font-mono text-sm font-medium",
                                    Number(r.BALANCE) < 0 ? "text-rose-600" : "text-gray-800"
                                  )}
                                >
                                  {fmtBalance(r.BALANCE)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-gray-50 font-semibold hover:bg-gray-50">
                              <TableCell colSpan={2} className="text-sm text-gray-800">
                                Total / Closing Balance
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm text-gray-900">
                                {fmt(subtotal.debit)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm text-gray-900">
                                {fmt(subtotal.credit)}
                              </TableCell>
                              <TableCell
                                className={cn(
                                  "text-right font-mono text-sm",
                                  Number(closingBal) < 0 ? "text-rose-700" : "text-emerald-700"
                                )}
                              >
                                {fmtBalance(closingBal)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}