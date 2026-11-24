
// import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   flexRender, getCoreRowModel, getFilteredRowModel,
//   getPaginationRowModel, getSortedRowModel, useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpDown, ChevronDown, Trash2, AlertCircle, RefreshCw, FileText,
//   Search, ReceiptText,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu, DropdownMenuCheckboxItem,
//   DropdownMenuContent, DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import { useHasPermission } from "@/hooks/use-permission";

// import { useInvoices, useDeleteInvoice } from "./queries";

// const fmtDate = (val) => {
//   if (!val) return "—";
//   return new Date(val).toLocaleDateString("en-GB", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };
// const fmtAmt = (v) =>
//   Number(v || 0).toLocaleString(undefined, {
//     minimumFractionDigits: 2, maximumFractionDigits: 2,
//   });

// // ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
// const toISODateString = (val) => {
//   if (!val) return null;
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return null;
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// // Reusable sortable header — journal table's uppercase gray style
// const SortableHeader = ({ column, label }) => (
//   <Button
//     variant="ghost"
//     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
//     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//   >
//     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
//   </Button>
// );

// export default function InvoiceList() {
//   const navigate = useNavigate();

//   const [sorting,          setSorting]          = useState([]);
//   const [columnFilters,    setColumnFilters]    = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection,     setRowSelection]     = useState({});
//   const [globalFilter,     setGlobalFilter]     = useState("");
//   const [invoiceDateFrom,  setInvoiceDateFrom]  = useState("");
//   const [invoiceDateTo,    setInvoiceDateTo]    = useState("");

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("SALE_INVOICE_CREATE");
//   const canEdit = useHasPermission("SALE_INVOICE_EDIT");
//   const canDelete = useHasPermission("SALE_INVOICE_DELETE");

//   const { data: invoices = [], isLoading, isError, error, refetch, isFetching } = useInvoices();
//   const deleteMutation = useDeleteInvoice();

//   // ── Invoice Date range filter ────────────────────────────────────────────
//   const filteredInvoices = useMemo(() => {
//     if (!invoiceDateFrom && !invoiceDateTo) return invoices;
//     return invoices.filter((inv) => {
//       const d = toISODateString(inv.INVOICE_DATE);
//       if (!d) return false;
//       if (invoiceDateFrom && d < invoiceDateFrom) return false;
//       if (invoiceDateTo && d > invoiceDateTo) return false;
//       return true;
//     });
//   }, [invoices, invoiceDateFrom, invoiceDateTo]);

//   const hasDateFilter = invoiceDateFrom || invoiceDateTo;

//   const handleView = (hid) => {
//     navigate(`/dashboard/sale-invoice/edit/${hid}`);
//   };

//   const handleDelete = async (invoice) => {
//     const confirmed = await showConfirmation({
//       title: "Delete invoice?",
//       description: `Delete invoice #${invoice.HID} for ${invoice.CUSTOMER_NAME}? This cannot be undone.`,
//       confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
//     });
//     if (confirmed) {
//       try {
//         await deleteMutation.mutateAsync(invoice.HID);
//         toast.success("Invoice deleted successfully!");
//       } catch (err) {
//         toast.error(err?.message || "Failed to delete invoice.");
//       }
//     }
//   };

//   const columns = [
//     {
//       accessorKey: "HID",
//       header: ({ column }) => <SortableHeader column={column} label="Invoice #" />,
//       cell: ({ row }) => (
//         <div className="ml-3 font-mono text-sm font-medium text-gray-800 flex items-center gap-2">
//           #{row.getValue("HID")}
//           {Number(row.original.RECEIVE_CREATED) === 1 && (
//             <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
//               Received
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "INVOICE_DATE",
//       header: ({ column }) => <SortableHeader column={column} label="Invoice Date" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm text-gray-600">{fmtDate(row.getValue("INVOICE_DATE"))}</div>
//       ),
//     },
//     {
//       accessorKey: "CUSTOMER_NAME",
//       header: ({ column }) => <SortableHeader column={column} label="Customer" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("CUSTOMER_NAME") || "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "SHED_CODE",
//       header: ({ column }) => <SortableHeader column={column} label="Shade" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("SHED_CODE") || "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "PRODUCTION_QTY",
//       header: () => (
//         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           Quantity (Eggs)
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="tabular-nums text-sm text-gray-600 text-left pr-4">
//           {Number(row.getValue("PRODUCTION_QTY") || 0).toLocaleString()}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "TOT_QTY",
//       header: () => (
//         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           Sales Qty
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="tabular-nums text-sm text-gray-600 text-left pr-4">
//           {Number(row.getValue("TOT_QTY") || 0).toLocaleString()}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "TOT_AMT",
//       header: () => (
//         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           Total Amount
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="tabular-nums text-sm font-semibold text-gray-800 text-left pr-4">
//           {fmtAmt(row.getValue("TOT_AMT"))}
//         </div>
//       ),
//     },
//     {
//       id: "actions",
//       enableHiding: false,
//       header: () => (
//         <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           Actions
//         </div>
//       ),
//       cell: ({ row }) => {
//         const inv = row.original;
//         const isLocked = Number(inv.RECEIVE_CREATED) === 1;
//         return (
//           <div className="flex items-center justify-center gap-1">
//             {canEdit && (
//               <Button
//                 variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
//                 onClick={() => handleView(inv.HID)}
//                 title={isLocked ? "View only — Receive Voucher already created" : "Edit"}
//               >
//                 <IconEdit className="h-4 w-4" />
//                 <span className="sr-only">View</span>
//               </Button>
//             )}
//             {canDelete && (
//               <Button
//                 variant="ghost" size="icon"
//                 className="h-8 w-8 hover:text-destructive"
//                 onClick={() => handleDelete(inv)}
//                 disabled={deleteMutation.isPending || isLocked}
//                 title={isLocked ? "Receive Voucher already created — cannot delete" : "Delete"}
//               >
//                 {deleteMutation.isPending
//                   ? <Spinner className="h-4 w-4" />
//                   : <Trash2 className="h-4 w-4" />}
//                 <span className="sr-only">Delete</span>
//               </Button>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: filteredInvoices,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onGlobalFilterChange: setGlobalFilter,
//     state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
//     initialState: {
//       pagination: { pageSize: 50 },
//     },
//   });

//   // ── Totals (date filter + search anujai, sob page mile) ──
//   const filteredRows = table.getFilteredRowModel().rows;
//   const totals = filteredRows.reduce(
//     (acc, row) => {
//       acc.productionQty += Number(row.original.PRODUCTION_QTY) || 0;
//       acc.salesQty += Number(row.original.TOT_QTY) || 0;
//       acc.amount += Number(row.original.TOT_AMT) || 0;
//       return acc;
//     },
//     { productionQty: 0, salesQty: 0, amount: 0 }
//   );
//   const totalEntries = filteredRows.length;

//   // ── Loading ──────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//         <div className="flex items-center justify-center py-12">
//           <div className="flex flex-col items-center">
//             <Spinner className="h-10 w-10 mb-3" />
//             <p className="text-sm text-gray-500">Loading invoices...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error ────────────────────────────────────────────────────────────────
//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Invoices</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load invoices."}</p>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//               {isFetching
//                 ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
//                 : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   // ── Main ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
//               <ReceiptText size={16} />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">Sales Invoices</h2>
//               <p className="text-xs text-gray-400">
//                 {filteredInvoices.length} of {invoices.length} — sales invoices
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             {canCreate && (
//               <Button onClick={() => navigate("/dashboard/sale-invoice/new")}>
//                 <IconCircleDashedPlus className="mr-1" />New Invoice
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Search + Invoice Date range filter + Column visibility */}
//           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//             <div className="relative max-w-sm w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by customer, shed, date..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30"
//               />
//             </div>

//             {/* Invoice From Date */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                 Invoice From Date
//               </label>
//               <div className="relative w-full sm:w-40">
//                 <Input
//                   type="date"
//                   value={invoiceDateFrom}
//                   max={invoiceDateTo || undefined}
//                   onChange={(e) => setInvoiceDateFrom(e.target.value)}
//                   className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30"
//                 />
//                 {invoiceDateFrom && (
//                   <button
//                     type="button"
//                     onClick={() => setInvoiceDateFrom("")}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                     title="Clear from date"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Invoice To Date */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                 To Date
//               </label>
//               <div className="relative w-full sm:w-40">
//                 <Input
//                   type="date"
//                   value={invoiceDateTo}
//                   min={invoiceDateFrom || undefined}
//                   onChange={(e) => setInvoiceDateTo(e.target.value)}
//                   className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30"
//                 />
//                 {invoiceDateTo && (
//                   <button
//                     type="button"
//                     onClick={() => setInvoiceDateTo("")}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                     title="Clear to date"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
//                   Columns <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
//                   <DropdownMenuCheckboxItem
//                     key={col.id}
//                     className="capitalize"
//                     checked={col.getIsVisible()}
//                     onCheckedChange={(v) => col.toggleVisibility(!!v)}
//                   >
//                     {col.id.replace(/_/g, " ").toLowerCase()}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Summary */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Entries</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
//                 {totalEntries.toLocaleString()}
//               </p>
//             </div>
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Quantity (Eggs)</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
//                 {totals.productionQty.toLocaleString()}
//               </p>
//             </div>
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sales Qty</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
//                 {totals.salesQty.toLocaleString()}
//               </p>
//             </div>
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Amount</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-primary">
//                 {fmtAmt(totals.amount)}
//               </p>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-hidden rounded-md border border-gray-200">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && "selected"}
//                       className="hover:bg-gray-50/70 transition-colors"
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="text-sm text-gray-700">
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
//                           <EmptyMedia variant="icon"><FileText /></EmptyMedia>
//                           <EmptyTitle>
//                             {hasDateFilter
//                               ? "No invoices found for the selected date range"
//                               : "No Invoices Found"}
//                           </EmptyTitle>
//                         </EmptyHeader>
//                       </Empty>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           <DataTablePagination table={table} />
//         </div>
//       </div>

//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown, ArrowUp, ChevronDown, Trash2, AlertCircle, RefreshCw, FileText,
  Search, ReceiptText, Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { create } from "zustand";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useHasPermission } from "@/hooks/use-permission";

import { useInvoices, useDeleteInvoice } from "./queries";

// ── Table design constants (table-design skill) ──────────────────────────────
const PHONE_BREAKPOINT = 800;      // pinned + 3 scrolling cols (~115px each) ≈ 800px
const PIN_HEADER_MIN_ROWS = 15;    // header pin/bounded height only above ~15 rows
const PAGE_CHROME = "12rem";       // header + toolbar + summary above the table (adjust)
// Solid (not translucent) so pinned cells stay opaque while scrolling.
// Stronger than hover (bg-gray-50).
const ACTIVE_BG = "bg-emerald-100";

// ── Active row store: one id at a time, same id again clears ─────────────────
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
}));

const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// Missing = dash, real zero = 0 / 0.00
const isMissing = (v) => v === null || v === undefined || v === "";
const fmtQty = (v) => (isMissing(v) ? "—" : Number(v).toLocaleString());
const fmtAmt = (v) =>
  isMissing(v)
    ? "—"
    : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
const toISODateString = (val) => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ── Container width (container-query behaviour, no plugin needed) ────────────
function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

// ── Headers ──────────────────────────────────────────────────────────────────
const headerText = "text-xs font-semibold uppercase tracking-wide text-gray-500";

// Sort arrow only on the active column
const SortableHeader = ({ column, label, align }) => {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      className={cn(
        headerText,
        "h-auto w-full gap-1 p-0 hover:bg-transparent",
        align === "right" ? "justify-end" : "justify-start"
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" && <ArrowUp className="h-3 w-3" />}
      {sorted === "desc" && <ArrowDown className="h-3 w-3" />}
    </Button>
  );
};

const PlainHeader = ({ label, align }) => (
  <div className={cn(headerText, align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left")}>
    {label}
  </div>
);

// ── Action icon button with tooltip ──────────────────────────────────────────
// The button is wrapped in a span so the tooltip still shows when the button is disabled
// (disabled buttons swallow pointer events) — that is how the "why is this locked" hint works.
const RowAction = ({ label, className, children, ...buttonProps }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="inline-flex">
        <Button
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn("h-8 w-8", className)}
          {...buttonProps}
        >
          {children}
        </Button>
      </span>
    </TooltipTrigger>
    <TooltipContent side="top">{label}</TooltipContent>
  </Tooltip>
);

// ── Skeleton matching the real row layout ────────────────────────────────────
const TableSkeleton = ({ phone }) => (
  <div aria-busy="true" aria-label="Loading invoices">
    {Array.from({ length: 8 }).map((_, i) =>
      phone ? (
        <div key={i} className="min-h-[56px] space-y-2 border-b border-gray-200 px-4 py-2">
          <div className="flex justify-between">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ) : (
        <div key={i} className="flex h-12 items-center gap-6 border-b border-gray-200 px-3">
          <div className="h-4 w-[110px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[60px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[80px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[100px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[60px] animate-pulse rounded bg-gray-100" />
        </div>
      )
    )}
  </div>
);

export default function InvoiceList() {
  const navigate = useNavigate();

  const [sorting,          setSorting]          = useState([]);
  const [columnFilters,    setColumnFilters]    = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter,     setGlobalFilter]     = useState("");
  const [invoiceDateFrom,  setInvoiceDateFrom]  = useState("");
  const [invoiceDateTo,    setInvoiceDateTo]    = useState("");

  // Phone: one row expanded at a time
  const [expandedId, setExpandedId] = useState(null);

  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);

  const [containerRef, containerWidth] = useContainerWidth();
  const isPhone = containerWidth > 0 && containerWidth < PHONE_BREAKPOINT;

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("SALE_INVOICE_CREATE");
  const canEdit = useHasPermission("SALE_INVOICE_EDIT");
  const canDelete = useHasPermission("SALE_INVOICE_DELETE");

  const { data: invoices = [], isLoading, isError, error, refetch, isFetching } = useInvoices();
  const deleteMutation = useDeleteInvoice();

  // ── Invoice Date range filter ────────────────────────────────────────────
  const filteredInvoices = useMemo(() => {
    if (!invoiceDateFrom && !invoiceDateTo) return invoices;
    return invoices.filter((inv) => {
      const d = toISODateString(inv.INVOICE_DATE);
      if (!d) return false;
      if (invoiceDateFrom && d < invoiceDateFrom) return false;
      if (invoiceDateTo && d > invoiceDateTo) return false;
      return true;
    });
  }, [invoices, invoiceDateFrom, invoiceDateTo]);

  const hasActiveFilter = !!(invoiceDateFrom || invoiceDateTo || globalFilter);

  const clearFilters = () => {
    setInvoiceDateFrom("");
    setInvoiceDateTo("");
    setGlobalFilter("");
  };

  const handleView = (hid) => {
    navigate(`/dashboard/sale-invoice/edit/${hid}`);
  };

  const handleDelete = async (invoice) => {
    const confirmed = await showConfirmation({
      title: "Delete invoice?",
      description: `Delete invoice #${invoice.HID} for ${invoice.CUSTOMER_NAME}? This cannot be undone.`,
      confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(invoice.HID);
        toast.success("Invoice deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete invoice.");
      }
    }
  };

  const isDeleting = (inv) => deleteMutation.isPending && deleteMutation.variables === inv.HID;
  const isLockedInvoice = (inv) => Number(inv.RECEIVE_CREATED) === 1;

  const editLabel = (inv) =>
    isLockedInvoice(inv)
      ? `View invoice #${inv.HID} (Receive Voucher already created)`
      : `Edit invoice #${inv.HID}`;
  const deleteLabel = (inv) =>
    isLockedInvoice(inv)
      ? "Can't delete — Receive Voucher already created"
      : isDeleting(inv)
        ? "Deleting…"
        : `Delete invoice #${inv.HID}`;

  // ── Columns ────────────────────────────────────────────────────────────────
  // Classified: identity = Invoice # (pinned left) + Customer (flexible), value = qty/amount
  // (right-aligned), state = Shade / Received badge, date = Invoice Date, action = pinned right.
  // meta: { align, pin, flex }. Fixed widths via `size`; Customer is the one flexible column.
  const columns = [
    {
      accessorKey: "HID",
      size: 170,
      enableHiding: false,
      meta: { pin: "left" },
      header: ({ column }) => <SortableHeader column={column} label="Invoice #" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-mono text-sm font-medium text-gray-800">
          #{row.getValue("HID")}
          {isLockedInvoice(row.original) && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
              Received
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "INVOICE_DATE",
      size: 130,
      header: ({ column }) => <SortableHeader column={column} label="Invoice Date" />,
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">{fmtDate(row.getValue("INVOICE_DATE"))}</span>
      ),
    },
    {
      accessorKey: "CUSTOMER_NAME",
      size: 220, // min-width only; this column absorbs the slack
      meta: { flex: true },
      header: ({ column }) => <SortableHeader column={column} label="Customer" />,
      cell: ({ row }) => {
        const v = row.getValue("CUSTOMER_NAME");
        return (
          <div className="truncate text-sm font-medium text-gray-800" title={v || undefined}>
            {v || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "SHED_CODE",
      size: 100,
      header: ({ column }) => <SortableHeader column={column} label="Shade" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-800">{row.getValue("SHED_CODE") || "—"}</span>
      ),
    },
    {
      accessorKey: "PRODUCTION_QTY",
      size: 150,
      meta: { align: "right" },
      header: () => <PlainHeader label="Quantity (Eggs)" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-gray-600">{fmtQty(row.getValue("PRODUCTION_QTY"))}</span>
      ),
    },
    {
      accessorKey: "TOT_QTY",
      size: 120,
      meta: { align: "right" },
      header: () => <PlainHeader label="Sales Qty" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-gray-600">{fmtQty(row.getValue("TOT_QTY"))}</span>
      ),
    },
    {
      accessorKey: "TOT_AMT",
      size: 140,
      meta: { align: "right" },
      header: () => <PlainHeader label="Total Amount" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums text-gray-800">{fmtAmt(row.getValue("TOT_AMT"))}</span>
      ),
    },
    {
      id: "actions",
      size: 100,
      enableHiding: false,
      meta: { pin: "right", align: "center" },
      header: () => <PlainHeader label="Actions" align="center" />,
      cell: ({ row }) => {
        const inv = row.original;
        const locked = isLockedInvoice(inv);
        return (
          <div className="flex items-center justify-center gap-1">
            {canEdit && (
              <RowAction
                label={editLabel(inv)}
                className="hover:bg-primary/10 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(inv.HID);
                }}
              >
                {locked ? <Eye className="h-4 w-4" /> : <IconEdit className="h-4 w-4" />}
              </RowAction>
            )}
            {canDelete && (
              <RowAction
                label={deleteLabel(inv)}
                className="hover:text-destructive"
                disabled={isDeleting(inv) || locked}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(inv);
                }}
              >
                {isDeleting(inv) ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              </RowAction>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredInvoices,
    columns,
    getRowId: (r) => String(r.HID),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    initialState: {
      pagination: { pageSize: 50 },
    },
  });

  // ── Totals (date filter + search anujai, sob page mile) ──
  const filteredRows = table.getFilteredRowModel().rows;
  const totals = filteredRows.reduce(
    (acc, row) => {
      acc.productionQty += Number(row.original.PRODUCTION_QTY) || 0;
      acc.salesQty += Number(row.original.TOT_QTY) || 0;
      acc.amount += Number(row.original.TOT_AMT) || 0;
      return acc;
    },
    { productionQty: 0, salesQty: 0, amount: 0 }
  );
  const totalEntries = filteredRows.length;

  const pageRows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const tableMinWidth = visibleColumns.reduce((sum, c) => sum + c.getSize(), 0);
  const pinHeader = pageRows.length > PIN_HEADER_MIN_ROWS;

  // ── Pieces ─────────────────────────────────────────────────────────────────
  const emptyBlock = (
    <div className="py-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><FileText /></EmptyMedia>
          <EmptyTitle>
            {hasActiveFilter ? "No invoices match the selected filters" : "No invoices yet"}
          </EmptyTitle>
        </EmptyHeader>
        <div className="mt-3 flex justify-center">
          {hasActiveFilter ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
          ) : canCreate ? (
            <Button size="sm" onClick={() => navigate("/dashboard/sale-invoice/new")}>
              <IconCircleDashedPlus className="mr-1" />Add first invoice
            </Button>
          ) : null}
        </div>
      </Empty>
    </div>
  );

  const errorBlock = (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Invoices</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load invoices."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            {isFetching
              ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
              : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );

  // Desktop: plain <table> in ONE overflow container (no nested scroll)
  const desktopTable = (
    <div
      className="overflow-auto"
      style={pinHeader ? { maxHeight: `calc(100dvh - ${PAGE_CHROME})` } : undefined}
    >
      <table
        className="w-full table-fixed border-separate border-spacing-0"
        style={{ minWidth: tableMinWidth }}
      >
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const meta = h.column.columnDef.meta || {};
                const sorted = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    scope="col"
                    aria-sort={sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined}
                    style={meta.flex ? undefined : { width: h.column.getSize() }}
                    className={cn(
                      "sticky top-0 h-10 border-b border-gray-200 bg-gray-50 px-3 font-normal",
                      meta.align === "right" ? "text-right" : meta.align === "center" ? "text-center" : "text-left",
                      meta.pin === "left" && "left-0 z-30 border-r",
                      meta.pin === "right" && "right-0 z-30 border-l",
                      !meta.pin && "z-20"
                    )}
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {pageRows.map((row) => {
            const isActive = activeId === row.id;
            return (
              <tr
                key={row.id}
                tabIndex={0}
                aria-current={isActive ? "true" : undefined}
                onClick={() => toggleActive(row.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target === e.currentTarget) toggleActive(row.id);
                }}
                className={cn(
                  "group/row h-12 cursor-pointer outline-none transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                  isActive ? ACTIVE_BG : "hover:bg-gray-50"
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta || {};
                  return (
                    <td
                      key={cell.id}
                      onClick={meta.pin === "right" ? (e) => e.stopPropagation() : undefined}
                      className={cn(
                        "h-12 whitespace-nowrap border-b border-gray-200 px-3 py-0 align-middle",
                        meta.align === "right" && "text-right tabular-nums",
                        meta.align === "center" && "text-center",
                        // pinned: solid bg matching row state, inner-edge border, no shadow
                        meta.pin && "sticky z-10",
                        meta.pin && (isActive ? ACTIVE_BG : "bg-white group-hover/row:bg-gray-50"),
                        meta.pin === "left" && "left-0 border-r",
                        meta.pin === "right" && "right-0 border-l"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Phone: restructure into rows (no table, no horizontal scroll)
  const sortOptions = [
    { id: "HID", label: "Invoice #" },
    { id: "INVOICE_DATE", label: "Invoice Date" },
    { id: "CUSTOMER_NAME", label: "Customer" },
    { id: "TOT_AMT", label: "Total Amount" },
  ];
  const currentSort = sorting[0];

  const phoneList = (
    <div>
      {/* Sorting moves to a control above the list */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
        <label htmlFor="invoice-sort" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort
        </label>
        <select
          id="invoice-sort"
          value={currentSort?.id ?? ""}
          onChange={(e) =>
            setSorting(e.target.value ? [{ id: e.target.value, desc: currentSort?.desc ?? false }] : [])
          }
          className="h-10 flex-1 rounded-md border border-gray-200 bg-white px-2 text-sm"
        >
          <option value="">Default</option>
          {sortOptions.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 bg-white border-gray-200"
          disabled={!currentSort}
          onClick={() => currentSort && setSorting([{ id: currentSort.id, desc: !currentSort.desc }])}
        >
          {currentSort?.desc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          <span className="sr-only">Toggle sort direction</span>
        </Button>
      </div>

      <ul className="divide-y divide-gray-200">
        {pageRows.map((row) => {
          const inv = row.original;
          const open = expandedId === row.id;
          const locked = isLockedInvoice(inv);
          return (
            <li key={row.id}>
              {/* Line 1: identity left, key value (amount) right. Line 2: customer + date */}
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpandedId(open ? null : row.id)}
                className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex items-center gap-2 font-mono text-sm font-medium text-gray-800">
                      #{inv.HID}
                      {locked && (
                        <span className="rounded bg-green-100 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-green-700">
                          Received
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-gray-800">
                      {fmtAmt(inv.TOT_AMT)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-gray-500">
                    <span className="truncate">{inv.CUSTOMER_NAME || "—"}</span>
                    <span className="whitespace-nowrap">{fmtDate(inv.INVOICE_DATE)}</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180"
                  )}
                />
              </button>

              {/* Expand in place: only fields not already on the row + actions */}
              <div
                aria-hidden={!open}
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 px-4 pb-3 pt-1">
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                      <dt className="text-gray-500">Shade</dt>
                      <dd className="text-gray-800">{inv.SHED_CODE || "—"}</dd>
                      <dt className="text-gray-500">Quantity (Eggs)</dt>
                      <dd className="tabular-nums text-gray-800">{fmtQty(inv.PRODUCTION_QTY)}</dd>
                      <dt className="text-gray-500">Sales Qty</dt>
                      <dd className="tabular-nums text-gray-800">{fmtQty(inv.TOT_QTY)}</dd>
                    </dl>
                    {(canEdit || canDelete) && (
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button
                            variant="outline"
                            className="h-10 flex-1 bg-white border-gray-200"
                            tabIndex={open ? 0 : -1}
                            onClick={() => handleView(inv.HID)}
                          >
                            {locked
                              ? <><Eye className="mr-2 h-4 w-4" />View</>
                              : <><IconEdit className="mr-2 h-4 w-4" />Edit</>}
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            className="h-10 flex-1 bg-white border-gray-200 text-destructive hover:text-destructive"
                            tabIndex={open ? 0 : -1}
                            onClick={() => handleDelete(inv)}
                            disabled={isDeleting(inv) || locked}
                          >
                            {isDeleting(inv)
                              ? <Spinner className="mr-2 h-4 w-4" />
                              : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                    {canDelete && locked && (
                      <p className="text-xs text-gray-500">
                        Delete unavailable — Receive Voucher already created.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  let tableContent;
  if (isLoading) tableContent = <TableSkeleton phone={isPhone} />;
  else if (isError) tableContent = errorBlock;
  else if (pageRows.length === 0) tableContent = emptyBlock;
  else tableContent = isPhone ? phoneList : desktopTable;

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider delayDuration={150}>
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
                <ReceiptText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Sales Invoices</h2>
                <p className="text-xs text-gray-400">
                  {filteredInvoices.length} of {invoices.length} — sales invoices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              {canCreate && (
                <Button onClick={() => navigate("/dashboard/sale-invoice/new")}>
                  <IconCircleDashedPlus className="mr-1" />New Invoice
                </Button>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Search + Invoice Date range filter + Column visibility */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer, shed, date..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
              </div>

              {/* Invoice From Date */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Invoice From Date
                </label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={invoiceDateFrom}
                    max={invoiceDateTo || undefined}
                    onChange={(e) => setInvoiceDateFrom(e.target.value)}
                    className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                  {invoiceDateFrom && (
                    <button
                      type="button"
                      onClick={() => setInvoiceDateFrom("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      title="Clear from date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Invoice To Date */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  To Date
                </label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={invoiceDateTo}
                    min={invoiceDateFrom || undefined}
                    onChange={(e) => setInvoiceDateTo(e.target.value)}
                    className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                  {invoiceDateTo && (
                    <button
                      type="button"
                      onClick={() => setInvoiceDateTo("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      title="Clear to date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Column Visibility (hide, never delete) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize"
                      checked={col.getIsVisible()}
                      onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    >
                      {col.id.replace(/_/g, " ").toLowerCase()}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Entries</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
                  {totalEntries.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Quantity (Eggs)</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
                  {totals.productionQty.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Sales Qty</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
                  {totals.salesQty.toLocaleString()}
                </p>
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Amount</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-primary">
                  {fmtAmt(totals.amount)}
                </p>
              </div>
            </div>

            {/* Table area — width of this box decides table vs phone rows */}
            <div ref={containerRef} className="overflow-hidden rounded-md border border-gray-200 bg-white">
              {tableContent}
            </div>

            <DataTablePagination table={table} />
          </div>
        </div>

        <ConfirmationDialog />
      </div>
    </TooltipProvider>
  );
}