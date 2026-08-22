// import { useState, useMemo } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpDown,
//   ChevronDown,
//   AlertCircle,
//   RefreshCw,
//   Calculator,
//   Printer,
//   FileSpreadsheet,
// } from "lucide-react";
// import * as XLSX from "xlsx";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Spinner } from "@/components/ui/spinner";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// import { useTrialBalance } from "./queries";

// // ── Number formatter ─────────────────────────────────────────────────────────
// const fmt = (val) =>
//   Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// export default function TrialBalanceList() {
//   const [sorting, setSorting] = useState([{ id: "CODE", desc: false }]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [applied, setApplied] = useState(null);

//   const {
//     data: records = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useTrialBalance(applied);

//   const handleGenerate = () => {
//     if (!fromDate || !toDate) return;
//     setApplied({ fromDate, toDate });
//   };

//   const totals = useMemo(() => {
//     if (!records.length) return null;
//     return records.reduce(
//       (acc, r) => ({
//         openingDr: acc.openingDr + Number(r.OPENING_DR || 0),
//         openingCr: acc.openingCr + Number(r.OPENING_CR || 0),
//         periodDr: acc.periodDr + Number(r.PERIOD_DR || 0),
//         periodCr: acc.periodCr + Number(r.PERIOD_CR || 0),
//         closingDr: acc.closingDr + Number(r.CLOSING_DR || 0),
//         closingCr: acc.closingCr + Number(r.CLOSING_CR || 0),
//       }),
//       { openingDr: 0, openingCr: 0, periodDr: 0, periodCr: 0, closingDr: 0, closingCr: 0 }
//     );
//   }, [records]);

//   // ── Excel export ─────────────────────────────────────────────────────────
//   const handleExportExcel = () => {
//     if (!records.length) return;

//     const exportData = records.map((r) => ({
//       "Code": r.CODE,
//       "Account Name": r.ACCOUNT_NAME,
//       "Opening Dr": Number(r.OPENING_DR || 0),
//       "Opening Cr": Number(r.OPENING_CR || 0),
//       "Period Dr": Number(r.PERIOD_DR || 0),
//       "Period Cr": Number(r.PERIOD_CR || 0),
//       "Closing Dr": Number(r.CLOSING_DR || 0),
//       "Closing Cr": Number(r.CLOSING_CR || 0),
//     }));

//     if (totals) {
//       exportData.push({
//         "Code": "",
//         "Account Name": "TOTAL",
//         "Opening Dr": totals.openingDr,
//         "Opening Cr": totals.openingCr,
//         "Period Dr": totals.periodDr,
//         "Period Cr": totals.periodCr,
//         "Closing Dr": totals.closingDr,
//         "Closing Cr": totals.closingCr,
//       });
//     }

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     ws["!cols"] = [
//       { wch: 14 }, { wch: 35 }, { wch: 14 }, { wch: 14 },
//       { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
//     ];

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

//     const fileName = `Trial_Balance_${applied.fromDate}_to_${applied.toDate}.xlsx`;
//     XLSX.writeFile(wb, fileName);
//   };

//   const columns = [
//     {
//       accessorKey: "CODE",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Code <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-mono text-sm ps-2 font-medium">{row.getValue("CODE")}</div>
//       ),
//     },
//     {
//       accessorKey: "ACCOUNT_NAME",
//       header: "Account Name",
//       cell: ({ row }) => (
//         <div className="ps-2">{row.getValue("ACCOUNT_NAME")}</div>
//       ),
//     },
//     {
//       accessorKey: "OPENING_DR",
//       header: ({ column }) => (
//         <Button variant="ghost" className="w-full justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Opening Dr <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="text-right tabular-nums">{fmt(row.getValue("OPENING_DR"))}</div>
//       ),
//     },
//     {
//       accessorKey: "OPENING_CR",
//       header: () => <div className="text-right pe-4">Opening Cr</div>,
//       cell: ({ row }) => (
//         <div className="text-right tabular-nums">{fmt(row.getValue("OPENING_CR"))}</div>
//       ),
//     },
//     {
//       accessorKey: "PERIOD_DR",
//       header: () => <div className="text-right pe-4">Period Dr</div>,
//       cell: ({ row }) => (
//         <div className="text-right tabular-nums">{fmt(row.getValue("PERIOD_DR"))}</div>
//       ),
//     },
//     {
//       accessorKey: "PERIOD_CR",
//       header: () => <div className="text-right pe-4">Period Cr</div>,
//       cell: ({ row }) => (
//         <div className="text-right tabular-nums">{fmt(row.getValue("PERIOD_CR"))}</div>
//       ),
//     },
//     {
//       accessorKey: "CLOSING_DR",
//       header: ({ column }) => (
//         <Button variant="ghost" className="w-full justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Closing Dr <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="text-right tabular-nums font-medium">{fmt(row.getValue("CLOSING_DR"))}</div>
//       ),
//     },
//     {
//       accessorKey: "CLOSING_CR",
//       header: () => <div className="text-right pe-4">Closing Cr</div>,
//       cell: ({ row }) => (
//         <div className="text-right tabular-nums font-medium">{fmt(row.getValue("CLOSING_CR"))}</div>
//       ),
//     },
//   ];

//   const table = useReactTable({
//     data: records,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onGlobalFilterChange: setGlobalFilter,
//     state: { sorting, columnFilters, columnVisibility, globalFilter },
//   });

//   // ── Filter bar (always visible) ───────────────────────────────────────────
//   const FilterBar = (
//     <div className="bg-card rounded-md shadow-sm p-4 mb-4 print:hidden">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Trial Balance</h1>
//         <div className="flex flex-wrap items-end gap-2">
//           <div>
//             <label className="text-xs text-muted-foreground block mb-1">From Date</label>
//             <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
//           </div>
//           <div>
//             <label className="text-xs text-muted-foreground block mb-1">To Date</label>
//             <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
//           </div>
//           <Button onClick={handleGenerate} disabled={!fromDate || !toDate}>
//             <Calculator className="mr-1 h-4 w-4" /> Generate
//           </Button>
//           {applied && (
//             <Button variant="outline" onClick={() => window.print()}>
//               <Printer className="h-4 w-4" />
//               <span className="sr-only">Print</span>
//             </Button>
//           )}
//           {applied && records?.length > 0 && (
//             <Button variant="outline" onClick={handleExportExcel}>
//               <FileSpreadsheet className="mr-1 h-4 w-4" /> Excel
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // ── Not yet generated ───────────────────────────────────────────────────────
//   if (!applied) {
//     return (
//       <div>
//         {FilterBar}
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Empty>
//             <EmptyHeader>
//               <EmptyMedia variant="icon"><Calculator /></EmptyMedia>
//               <EmptyTitle>Date range select kore Generate button e click korun</EmptyTitle>
//             </EmptyHeader>
//           </Empty>
//         </div>
//       </div>
//     );
//   }

//   // ── Loading ──────────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div>
//         {FilterBar}
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">Trial balance generate kora hocche...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error ────────────────────────────────────────────────────────────────────
//   if (isError) {
//     return (
//       <div>
//         {FilterBar}
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Report</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load trial balance."}</p>
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

//   // ── Main ─────────────────────────────────────────────────────────────────────
//   return (
//     <div>
//       {FilterBar}

//       {/* Print header — only visible on print */}
//       <div className="hidden print:block mb-4 text-center">
//         <h1 className="text-xl font-bold">Trial Balance</h1>
//         <p className="text-sm text-muted-foreground">
//           {applied.fromDate} to {applied.toDate}
//         </p>
//       </div>

//       {/* Summary cards */}
//       {totals && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 print:hidden">
//           <div className="bg-card rounded-md shadow-sm p-4">
//             <p className="text-sm text-muted-foreground">Opening (Dr / Cr)</p>
//             <p className="text-lg font-semibold tabular-nums">{fmt(totals.openingDr)} / {fmt(totals.openingCr)}</p>
//           </div>
//           <div className="bg-card rounded-md shadow-sm p-4">
//             <p className="text-sm text-muted-foreground">Period (Dr / Cr)</p>
//             <p className="text-lg font-semibold tabular-nums">{fmt(totals.periodDr)} / {fmt(totals.periodCr)}</p>
//           </div>
//           <div className="bg-card rounded-md shadow-sm p-4">
//             <p className="text-sm text-muted-foreground">Closing (Dr / Cr)</p>
//             <p className="text-lg font-semibold tabular-nums">{fmt(totals.closingDr)} / {fmt(totals.closingCr)}</p>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4 print:hidden">
//             <Input
//               placeholder="Search account..."
//               value={globalFilter ?? ""}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className="max-w-sm"
//             />
//             <div className="flex items-center gap-2 ml-auto">
//               <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//                 <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//                 <span className="sr-only">Refresh</span>
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline">
//                     Columns <ChevronDown className="ml-2 h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
//                     <DropdownMenuCheckboxItem
//                       key={col.id}
//                       className="capitalize"
//                       checked={col.getIsVisible()}
//                       onCheckedChange={(v) => col.toggleVisibility(!!v)}
//                     >
//                       {col.id.replace(/_/g, " ").toLowerCase()}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id}>
//                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <Empty>
//                         <EmptyHeader>
//                           <EmptyMedia variant="icon"><Calculator /></EmptyMedia>
//                           <EmptyTitle>No Records Found</EmptyTitle>
//                         </EmptyHeader>
//                       </Empty>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="print:hidden">
//             <DataTablePagination table={table} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Calculator,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useTrialBalance } from "./queries";

// ── Number formatter ─────────────────────────────────────────────────────────
const fmt = (val) =>
  Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TrialBalanceList() {
  const [sorting, setSorting] = useState([{ id: "CODE", desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applied, setApplied] = useState(null);

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTrialBalance(applied);

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    setApplied({ fromDate, toDate });
  };

  const totals = useMemo(() => {
    if (!records.length) return null;
    return records.reduce(
      (acc, r) => ({
        openingDr: acc.openingDr + Number(r.OPENING_DR || 0),
        openingCr: acc.openingCr + Number(r.OPENING_CR || 0),
        periodDr: acc.periodDr + Number(r.PERIOD_DR || 0),
        periodCr: acc.periodCr + Number(r.PERIOD_CR || 0),
        closingDr: acc.closingDr + Number(r.CLOSING_DR || 0),
        closingCr: acc.closingCr + Number(r.CLOSING_CR || 0),
      }),
      { openingDr: 0, openingCr: 0, periodDr: 0, periodCr: 0, closingDr: 0, closingCr: 0 }
    );
  }, [records]);

  // ── Excel export ─────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    if (!records.length) return;

    const exportData = records.map((r) => ({
      "Code": r.CODE,
      "Account Name": r.ACCOUNT_NAME,
      "Opening Dr": Number(r.OPENING_DR || 0),
      "Opening Cr": Number(r.OPENING_CR || 0),
      "Period Dr": Number(r.PERIOD_DR || 0),
      "Period Cr": Number(r.PERIOD_CR || 0),
      "Closing Dr": Number(r.CLOSING_DR || 0),
      "Closing Cr": Number(r.CLOSING_CR || 0),
    }));

    if (totals) {
      exportData.push({
        "Code": "",
        "Account Name": "TOTAL",
        "Opening Dr": totals.openingDr,
        "Opening Cr": totals.openingCr,
        "Period Dr": totals.periodDr,
        "Period Cr": totals.periodCr,
        "Closing Dr": totals.closingDr,
        "Closing Cr": totals.closingCr,
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 14 }, { wch: 35 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

    const fileName = `Trial_Balance_${applied.fromDate}_to_${applied.toDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const columns = [
    {
      accessorKey: "CODE",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          className="h-8 px-2 text-xs font-medium text-gray-500 hover:text-gray-700"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-600">{row.getValue("CODE")}</div>
      ),
    },
    {
      accessorKey: "ACCOUNT_NAME",
      header: () => (
        <div className="text-xs font-medium text-gray-500">Account Name</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">{row.getValue("ACCOUNT_NAME")}</div>
      ),
    },
    {
      accessorKey: "OPENING_DR",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          className="h-8 px-2 text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto justify-end w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Opening Dr <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-sm text-gray-600">{fmt(row.getValue("OPENING_DR"))}</div>
      ),
    },
    {
      accessorKey: "OPENING_CR",
      header: () => (
        <div className="text-right pr-2 text-xs font-medium text-gray-500">Opening Cr</div>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-sm text-gray-600">{fmt(row.getValue("OPENING_CR"))}</div>
      ),
    },
    {
      accessorKey: "PERIOD_DR",
      header: () => (
        <div className="text-right pr-2 text-xs font-medium text-gray-500">Period Dr</div>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-sm text-gray-600">{fmt(row.getValue("PERIOD_DR"))}</div>
      ),
    },
    {
      accessorKey: "PERIOD_CR",
      header: () => (
        <div className="text-right pr-2 text-xs font-medium text-gray-500">Period Cr</div>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-sm text-gray-600">{fmt(row.getValue("PERIOD_CR"))}</div>
      ),
    },
    {
      accessorKey: "CLOSING_DR",
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          className="h-8 px-2 text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto justify-end w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Closing Dr <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-sm font-semibold text-gray-800">{fmt(row.getValue("CLOSING_DR"))}</div>
      ),
    },
    {
      accessorKey: "CLOSING_CR",
      header: () => (
        <div className="text-right pr-2 text-xs font-medium text-gray-500">Closing Cr</div>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums text-sm font-semibold text-gray-800">{fmt(row.getValue("CLOSING_CR"))}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: records,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
  });

  // ── Not yet generated ───────────────────────────────────────────────────────
  if (!applied) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-700">
              <Calculator size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Trial Balance</h2>
              <p className="text-xs text-gray-400">Generate trial balance report</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">From Date</label>
                <Input 
                  type="date" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)} 
                  className="h-9 w-40 bg-white border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">To Date</label>
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
                <Calculator className="mr-1 h-4 w-4" /> Generate
              </Button>
            </div>

            <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
              <Calculator className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">Date range select kore Generate button e click korun</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-700">
              <Calculator size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Trial Balance</h2>
              <p className="text-xs text-gray-400">
                {applied?.fromDate} to {applied?.toDate}
              </p>
            </div>
          </div>
          <div className="p-5 flex flex-col items-center justify-center py-16">
            <Spinner className="h-8 w-8 mb-3 text-emerald-700" />
            <p className="text-sm text-gray-400">Trial balance generate kora hocche...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-700">
              <Calculator size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Trial Balance</h2>
              <p className="text-xs text-gray-400">
                {applied?.fromDate} to {applied?.toDate}
              </p>
            </div>
          </div>
          <div className="p-5">
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error Loading Report</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-2">
                <p className="text-red-700">{error?.message || "Failed to load trial balance."}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()} 
                  disabled={isFetching} 
                  className="w-fit border-red-200 hover:bg-red-50"
                >
                  {isFetching
                    ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                    : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-700">
              <Calculator size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Trial Balance</h2>
              <p className="text-xs text-gray-400">
                {applied?.fromDate} to {applied?.toDate}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.print()} 
              className="h-8 border-gray-200 bg-white"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="sr-only">Print</span>
            </Button>
            {records?.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleExportExcel}
                className="h-8 border-gray-200 bg-white"
              >
                <FileSpreadsheet className="mr-1 h-3.5 w-3.5" /> Excel
              </Button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Summary cards */}
          {totals && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-md bg-blue-50 px-4 py-3">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Opening Balance</p>
                <p className="text-sm font-bold font-mono text-blue-800">
                  Dr {fmt(totals.openingDr)} / Cr {fmt(totals.openingCr)}
                </p>
              </div>
              <div className="rounded-md bg-purple-50 px-4 py-3">
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Period Balance</p>
                <p className="text-sm font-bold font-mono text-purple-800">
                  Dr {fmt(totals.periodDr)} / Cr {fmt(totals.periodCr)}
                </p>
              </div>
              <div className="rounded-md bg-emerald-50 px-4 py-3">
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Closing Balance</p>
                <p className="text-sm font-bold font-mono text-emerald-800">
                  Dr {fmt(totals.closingDr)} / Cr {fmt(totals.closingCr)}
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Search account..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 bg-white border-gray-200 pl-8 text-sm"
              />
              <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                variant="outline" 
                onClick={() => refetch()} 
                disabled={isFetching}
                className="h-9 border-gray-200 bg-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 border-gray-200 bg-white text-sm">
                    Columns <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-gray-200">
                  {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize text-sm"
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    >
                      {col.id.replace(/_/g, " ").toLowerCase()}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="py-2">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50/70 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-2.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Calculator className="h-8 w-8 text-gray-300" />
                        <p className="text-sm text-gray-400">No Records Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-100 pt-3">
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}