

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
//   Trash2,
//   AlertCircle,
//   RefreshCw,
//   Egg,
//   Search,
// } from "lucide-react";
// import { toast } from "react-toastify";

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
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import { Label } from "@/components/ui/label";
// import { useHasPermission } from "@/hooks/use-permission";

// import { useAllEggProductions, useDeleteEggProduction } from "./queries";
// import { useAllChickenSheds } from "../chicken-shed/queries"; // path adjust korun
// import AddEggProductionSheet from "./add-egg-production-sheet";
// import UpdateEggProductionSheet from "./update-egg-production-sheet";

// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// const MONTH_NUM = {
//   JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
//   JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
// };

// // ── Normalize any supported date value to YYYY-MM-DD (used for filtering) ────
// const toISODateString = (val) => {
//   if (!val) return "";
//   const str = String(val);

//   // Oracle "DD-MON-YY"
//   const oracleMatch = str.match(/^(\d{2})-([A-Z]{3})-(\d{2})$/i);
//   if (oracleMatch) {
//     const [, day, mon, yy] = oracleMatch;
//     const mm = MONTH_NUM[mon.toUpperCase()];
//     return mm ? `20${yy}-${mm}-${day}` : "";
//   }

//   // ISO "2026-06-26T..."
//   const isoMatch = str.match(/(\d{4}-\d{2}-\d{2})/);
//   if (isoMatch) return isoMatch[1];

//   // Fallback: JS Date string
//   const parsed = new Date(str);
//   if (!isNaN(parsed.getTime())) {
//     return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
//   }

//   return "";
// };

// // ── Date formatter (display) ─────────────────────────────────────────────────
// const formatDate = (val) => {
//   const iso = toISODateString(val);
//   if (!iso) return "—";
//   const [year, month, day] = iso.split("-");
//   return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
// };

// // Reusable sortable header — clean uppercase gray style
// const SortableHeader = ({ column, label }) => (
//   <Button
//     variant="ghost"
//     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
//     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//   >
//     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
//   </Button>
// );

// export default function EggProductionList() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");

//   // Production date range filter (applies instantly as you pick dates)
//   const [prodDateFrom, setProdDateFrom] = useState("");
//   const [prodDateTo, setProdDateTo] = useState("");

//   // Shed tab: empty = prothom shed (sheds load hole auto set hoy), otherwise SHED_ID (string)
//   const [shedFilter, setShedFilter] = useState("");

//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("EGG_PRODUCTION_CREATE");
//   const canEdit = useHasPermission("EGG_PRODUCTION_EDIT");
//   const canDelete = useHasPermission("EGG_PRODUCTION_DELETE");

//   // ── Shed list (CHICKEN_SHED master) — tabs er jonno ──
//   const { data: sheds = [] } = useAllChickenSheds();

//   // Selected tab, na thakle prothom shed
//   const activeShedId = shedFilter || (sheds[0] ? String(sheds[0].ID) : "");

//   const {
//     data: allRecords = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useAllEggProductions();

//   const deleteMutation = useDeleteEggProduction();

//   // ── Shed tab + Date range filter ─────────────────────────────────────────
//   const records = useMemo(() => {
//     if (!prodDateFrom && !prodDateTo && !activeShedId) return allRecords;
//     return allRecords.filter((r) => {
//       if (activeShedId && String(r.SHED_ID) !== activeShedId) return false;
//       if (prodDateFrom || prodDateTo) {
//         const d = toISODateString(r.PRODUCTION_DATE);
//         if (!d) return false;
//         if (prodDateFrom && d < prodDateFrom) return false;
//         if (prodDateTo && d > prodDateTo) return false;
//       }
//       return true;
//     });
//   }, [allRecords, prodDateFrom, prodDateTo, activeShedId]);

//   const hasActiveFilter = prodDateFrom || prodDateTo;

//   // Tab-wise record count (SHED_ID onujayi)
//   const shedCounts = useMemo(() => {
//     const map = {};
//     allRecords.forEach((r) => {
//       const k = String(r.SHED_ID);
//       map[k] = (map[k] || 0) + 1;
//     });
//     return map;
//   }, [allRecords]);

//   const handleEdit = (record) => {
//     setSelectedRecord(record);
//     setIsUpdateSheetOpen(true);
//   };

//   const handleDelete = async (record) => {
//     const confirmed = await showConfirmation({
//       title: "Delete record?",
//       description: `Are you sure you want to delete egg production record #${record.ID}? This action cannot be undone.`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });
//     if (confirmed) {
//       try {
//         await deleteMutation.mutateAsync(record.ID);
//         toast.success("Record deleted successfully!");
//       } catch (err) {
//         toast.error(err?.message || "Failed to delete record. Please try again.");
//       }
//     }
//   };

//   const columns = [
//     {
//       accessorKey: "PRODUCTION_DATE",
//       header: ({ column }) => <SortableHeader column={column} label="Production Date" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{formatDate(row.getValue("PRODUCTION_DATE"))}</div>
//       ),
//     },
//     {
//       accessorKey: "SHED_CODE",
//       header: ({ column }) => <SortableHeader column={column} label="Shade" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">
//           {row.getValue("SHED_CODE") || "—"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "QTY",
//       header: ({ column }) => <SortableHeader column={column} label="Quantity" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-semibold tabular-nums text-gray-800">
//           {row.getValue("QTY")?.toLocaleString() ?? "—"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "REJECT_QTY",
//       header: ({ column }) => <SortableHeader column={column} label="Reject Qty" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-semibold tabular-nums text-emerald-600">
//           {row.getValue("REJECT_QTY")?.toLocaleString() ?? "—"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "REMARKS",
//       header: () => (
//         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Remarks</div>
//       ),
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm text-gray-600 truncate max-w-[150px]">
//           {row.getValue("REMARKS") || "—"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "CREATION_DATE",
//       header: () => (
//         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At</div>
//       ),
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm text-gray-500">{formatDate(row.getValue("CREATION_DATE"))}</div>
//       ),
//     },
//     // ── Actions column: only rendered if user has at least one of edit/delete ──
//     ...(canEdit || canDelete
//       ? [
//           {
//             id: "actions",
//             header: () => (
//               <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
//             ),
//             enableHiding: false,
//             cell: ({ row }) => {
//               const record = row.original;
//               return (
//                 <div className="flex items-center justify-center gap-1">
//                   {canEdit && (
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
//                       onClick={() => handleEdit(record)}
//                     >
//                       <IconEdit className="h-4 w-4" />
//                       <span className="sr-only">Edit</span>
//                     </Button>
//                   )}
//                   {canDelete && (
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 hover:text-destructive hover:bg-red-50"
//                       onClick={() => handleDelete(record)}
//                       disabled={deleteMutation.isPending}
//                     >
//                       {deleteMutation.isPending
//                         ? <Spinner className="h-4 w-4" />
//                         : <Trash2 className="h-4 w-4" />}
//                       <span className="sr-only">Delete</span>
//                     </Button>
//                   )}
//                 </div>
//               );
//             },
//           },
//         ]
//       : []),
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
//     onRowSelectionChange: setRowSelection,
//     onGlobalFilterChange: setGlobalFilter,
//     state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
//     initialState: {
//       pagination: { pageSize: 50 },
//     },
//   });

//   // ── Totals (tab + date + search anujai, sob page mile) ──
//   const filteredRows = table.getFilteredRowModel().rows;
//   const totals = filteredRows.reduce(
//     (acc, row) => {
//       acc.qty += Number(row.original.QTY) || 0;
//       acc.reject += Number(row.original.REJECT_QTY) || 0;
//       return acc;
//     },
//     { qty: 0, reject: 0 }
//   );
//   const totalEntries = filteredRows.length;

//   // ── Loading ──────────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
//               <Egg size={16} />
//             </div>
//             <h1 className="text-sm font-bold text-gray-900">Egg Production</h1>
//           </div>
//           {canCreate && (
//             <Button disabled className="bg-amber-600"><IconCircleDashedPlus className="mr-1" />Add Record</Button>
//           )}
//         </div>
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 mb-4 text-amber-600" />
//             <p className="text-sm text-gray-500">Loading egg production records...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error ────────────────────────────────────────────────────────────────────
//   if (isError) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
//               <Egg size={16} />
//             </div>
//             <h1 className="text-sm font-bold text-gray-900">Egg Production</h1>
//           </div>
//           {canCreate && (
//             <Button onClick={() => setIsAddSheetOpen(true)} className="bg-amber-600 hover:bg-amber-700">
//               <IconCircleDashedPlus className="mr-1" />Add Record
//             </Button>
//           )}
//         </div>
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Records</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load egg production records."}</p>
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
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
//               <Egg size={16} />
//             </div>
//             <div>
//               <h1 className="text-sm font-bold text-gray-900">Egg Production</h1>
//               <p className="text-xs text-gray-400">
//                 {records.length} of {allRecords.length} records
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="bg-white border-gray-200"
//               onClick={() => refetch()}
//               disabled={isFetching}
//             >
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             {canCreate && (
//               <Button onClick={() => setIsAddSheetOpen(true)}>
//                 <IconCircleDashedPlus className="mr-1" />Add Record
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Shed Tabs */}
//           <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1">
//             {sheds.map((s) => {
//               const value = String(s.ID);
//               const active = activeShedId === value;
//               const count = shedCounts[value] || 0;
//               return (
//                 <button
//                   key={value}
//                   type="button"
//                   onClick={() => setShedFilter(value)}
//                   className={`flex items-center rounded-md px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
//                     active
//                       ? "bg-emerald-700 text-white shadow-sm"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   {s.SHED_CODE}
//                   <span
//                     className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
//                       active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
//                     }`}
//                   >
//                     {count}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Filters Row */}
//           <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-4 flex-wrap">
//             {/* Global Search */}
//             <div className="flex flex-col gap-1.5 w-full sm:w-auto">
//               <Label className="text-xs font-medium text-gray-500">Search</Label>
//               <div className="relative w-full sm:w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search records..."
//                   value={globalFilter ?? ""}
//                   onChange={(e) => setGlobalFilter(e.target.value)}
//                   className="h-9 pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
//                 />
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="hidden lg:block w-px h-9 bg-gray-200 mb-0" />

//             {/* Production Date Range Filter */}
//             <div className="flex items-center gap-3 flex-wrap">
//               {/* From */}
//               <div className="flex items-center gap-2">
//                 <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Production From Date</Label>
//                 <div className="relative w-full sm:w-40">
//                   <Input
//                     type="date"
//                     value={prodDateFrom}
//                     max={prodDateTo || undefined}
//                     onChange={(e) => setProdDateFrom(e.target.value)}
//                     className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
//                   />
//                   {prodDateFrom && (
//                     <button
//                       type="button"
//                       onClick={() => setProdDateFrom("")}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                       title="Clear from date"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* To */}
//               <div className="flex items-center gap-2">
//                 <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">To Date</Label>
//                 <div className="relative w-full sm:w-40">
//                   <Input
//                     type="date"
//                     value={prodDateTo}
//                     min={prodDateFrom || undefined}
//                     onChange={(e) => setProdDateTo(e.target.value)}
//                     className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
//                   />
//                   {prodDateTo && (
//                     <button
//                       type="button"
//                       onClick={() => setProdDateTo("")}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                       title="Clear to date"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Column Visibility */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="h-9 lg:ml-auto bg-white border-gray-200">
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
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Entries</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
//                 {totalEntries.toLocaleString()}
//               </p>
//             </div>
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Quantity</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
//                 {totals.qty.toLocaleString()}
//               </p>
//             </div>
//             <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
//               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Reject Qty</p>
//               <p className="mt-1 text-lg font-bold tabular-nums text-emerald-600">
//                 {totals.reject.toLocaleString()}
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
//                           <EmptyMedia variant="icon"><Egg /></EmptyMedia>
//                           <EmptyTitle>
//                             {hasActiveFilter
//                               ? "No records found for the selected filters"
//                               : "No Records Found"}
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

//       {/* Sheets */}
//       {isAddSheetOpen && (
//         <AddEggProductionSheet
//           open={isAddSheetOpen}
//           onOpenChange={setIsAddSheetOpen}
//           showConfirmation={showConfirmation}
//           defaultShedId={activeShedId}
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateEggProductionSheet
//           open={isUpdateSheetOpen}
//           onOpenChange={setIsUpdateSheetOpen}
//           showConfirmation={showConfirmation}
//           record={selectedRecord}
//           defaultShedId={activeShedId}
//         />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Trash2,
  AlertCircle,
  RefreshCw,
  Egg,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import { create } from "zustand";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { useHasPermission } from "@/hooks/use-permission";

import { useAllEggProductions, useDeleteEggProduction } from "./queries";
import { useAllChickenSheds } from "../chicken-shed/queries"; // path adjust korun
import AddEggProductionSheet from "./add-egg-production-sheet";
import UpdateEggProductionSheet from "./update-egg-production-sheet";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_NUM = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

// ── Table design constants (table-design skill) ──────────────────────────────
const PHONE_BREAKPOINT = 800;      // pinned + 3 scrolling cols (~115px each) ≈ 800px
const PIN_HEADER_MIN_ROWS = 15;    // header pin/bounded height only above ~15 rows
const PAGE_CHROME = "12rem";       // header + tabs + filters + summary above the table (adjust)
// Solid (not translucent) so pinned cells stay opaque while scrolling.
// Stronger than hover (bg-gray-50).
const ACTIVE_BG = "bg-emerald-100";

// ── Active row store: one id at a time, same id again clears ─────────────────
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
}));

// ── Normalize any supported date value to YYYY-MM-DD (used for filtering) ────
const toISODateString = (val) => {
  if (!val) return "";
  const str = String(val);

  // Oracle "DD-MON-YY"
  const oracleMatch = str.match(/^(\d{2})-([A-Z]{3})-(\d{2})$/i);
  if (oracleMatch) {
    const [, day, mon, yy] = oracleMatch;
    const mm = MONTH_NUM[mon.toUpperCase()];
    return mm ? `20${yy}-${mm}-${day}` : "";
  }

  // ISO "2026-06-26T..."
  const isoMatch = str.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  // Fallback: JS Date string
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  }

  return "";
};

// ── Date formatter (display) — one consistent format ─────────────────────────
const formatDate = (val) => {
  const iso = toISODateString(val);
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
};

// Missing = dash, real zero = 0
const formatNumber = (v) =>
  v === null || v === undefined || v === "" ? "—" : Number(v).toLocaleString();

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
const headerText = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

// Sort arrow only on the active column
const SortableHeader = ({ column, label, align }) => {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      className={cn(
        headerText,
        "h-auto p-0 hover:bg-transparent w-full gap-1",
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

// ── Skeleton matching the real row layout ────────────────────────────────────
const TableSkeleton = ({ phone }) => (
  <div aria-busy="true" aria-label="Loading records">
    {Array.from({ length: 8 }).map((_, i) =>
      phone ? (
        <div key={i} className="min-h-[56px] border-b border-border px-4 py-2 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-4 w-14 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ) : (
        <div key={i} className="flex h-12 items-center gap-6 border-b border-border px-3">
          <div className="h-4 w-[130px] animate-pulse rounded bg-muted" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-muted" />
          <div className="ml-auto h-4 w-[90px] animate-pulse rounded bg-muted" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-muted" />
          <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-4 w-[110px] animate-pulse rounded bg-muted" />
          <div className="h-4 w-[70px] animate-pulse rounded bg-muted" />
        </div>
      )
    )}
  </div>
);

export default function EggProductionList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Production date range filter (applies instantly as you pick dates)
  const [prodDateFrom, setProdDateFrom] = useState("");
  const [prodDateTo, setProdDateTo] = useState("");

  // Shed tab: empty = prothom shed (sheds load hole auto set hoy), otherwise SHED_ID (string)
  const [shedFilter, setShedFilter] = useState("");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Phone: one row expanded at a time
  const [expandedId, setExpandedId] = useState(null);

  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);

  const [containerRef, containerWidth] = useContainerWidth();
  const isPhone = containerWidth > 0 && containerWidth < PHONE_BREAKPOINT;

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("EGG_PRODUCTION_CREATE");
  const canEdit = useHasPermission("EGG_PRODUCTION_EDIT");
  const canDelete = useHasPermission("EGG_PRODUCTION_DELETE");

  // ── Shed list (CHICKEN_SHED master) — tabs er jonno ──
  const { data: sheds = [] } = useAllChickenSheds();

  // Selected tab, na thakle prothom shed
  const activeShedId = shedFilter || (sheds[0] ? String(sheds[0].ID) : "");

  const {
    data: allRecords = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllEggProductions();

  const deleteMutation = useDeleteEggProduction();

  // ── Shed tab + Date range filter ─────────────────────────────────────────
  const records = useMemo(() => {
    if (!prodDateFrom && !prodDateTo && !activeShedId) return allRecords;
    return allRecords.filter((r) => {
      if (activeShedId && String(r.SHED_ID) !== activeShedId) return false;
      if (prodDateFrom || prodDateTo) {
        const d = toISODateString(r.PRODUCTION_DATE);
        if (!d) return false;
        if (prodDateFrom && d < prodDateFrom) return false;
        if (prodDateTo && d > prodDateTo) return false;
      }
      return true;
    });
  }, [allRecords, prodDateFrom, prodDateTo, activeShedId]);

  const hasActiveFilter = !!(prodDateFrom || prodDateTo || globalFilter);

  const clearFilters = () => {
    setProdDateFrom("");
    setProdDateTo("");
    setGlobalFilter("");
  };

  // Tab-wise record count (SHED_ID onujayi)
  const shedCounts = useMemo(() => {
    const map = {};
    allRecords.forEach((r) => {
      const k = String(r.SHED_ID);
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [allRecords]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete record?",
      description: `Are you sure you want to delete egg production record #${record.ID}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Record deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete record. Please try again.");
      }
    }
  };

  const isDeleting = (record) =>
    deleteMutation.isPending && deleteMutation.variables === record.ID;

  // ── Columns ────────────────────────────────────────────────────────────────
  // Classified: identity = Production Date (pinned left), value = Quantity / Reject Qty
  // (right-aligned), state = Shade, meta = Remarks (flexible) / Created At, action = pinned right.
  // meta: { align, pin, flex }. Fixed widths via `size`; Remarks is the one flexible column.
  const columns = [
    {
      id: "PRODUCTION_DATE",
      accessorFn: (r) => toISODateString(r.PRODUCTION_DATE), // ISO so sorting is chronological
      size: 150,
      enableHiding: false,
      meta: { pin: "left" },
      header: ({ column }) => <SortableHeader column={column} label="Production Date" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">{formatDate(row.getValue("PRODUCTION_DATE"))}</span>
      ),
    },
    {
      accessorKey: "SHED_CODE",
      size: 110,
      header: ({ column }) => <SortableHeader column={column} label="Shade" />,
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.getValue("SHED_CODE") || "—"}</span>
      ),
    },
    {
      accessorKey: "QTY",
      size: 130,
      meta: { align: "right" },
      header: ({ column }) => <SortableHeader column={column} label="Quantity" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatNumber(row.getValue("QTY"))}
        </span>
      ),
    },
    {
      accessorKey: "REJECT_QTY",
      size: 130,
      meta: { align: "right" },
      header: ({ column }) => <SortableHeader column={column} label="Reject Qty" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-foreground">
          {formatNumber(row.getValue("REJECT_QTY"))}
        </span>
      ),
    },
    {
      accessorKey: "REMARKS",
      size: 220, // min-width only; this column absorbs the slack
      meta: { flex: true },
      header: () => <PlainHeader label="Remarks" />,
      cell: ({ row }) => {
        const v = row.getValue("REMARKS");
        return (
          <div className="truncate text-sm text-muted-foreground" title={v || undefined}>
            {v || "—"}
          </div>
        );
      },
    },
    {
      id: "CREATION_DATE",
      accessorFn: (r) => toISODateString(r.CREATION_DATE),
      size: 150,
      header: () => <PlainHeader label="Created At" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.getValue("CREATION_DATE"))}</span>
      ),
    },
    // ── Actions column: only rendered if user has at least one of edit/delete ──
    ...(canEdit || canDelete
      ? [
          {
            id: "actions",
            size: 100,
            enableHiding: false,
            meta: { pin: "right", align: "center" },
            header: () => <PlainHeader label="Actions" align="center" />,
            cell: ({ row }) => {
              const record = row.original;
              return (
                <div className="flex items-center justify-center gap-1">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(record);
                      }}
                    >
                      <IconEdit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record);
                      }}
                      disabled={isDeleting(record)}
                    >
                      {isDeleting(record) ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data: records,
    columns,
    getRowId: (r) => String(r.ID),
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

  // ── Totals (tab + date + search anujai, sob page mile) ──
  const filteredRows = table.getFilteredRowModel().rows;
  const totals = filteredRows.reduce(
    (acc, row) => {
      acc.qty += Number(row.original.QTY) || 0;
      acc.reject += Number(row.original.REJECT_QTY) || 0;
      return acc;
    },
    { qty: 0, reject: 0 }
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
          <EmptyMedia variant="icon"><Egg /></EmptyMedia>
          <EmptyTitle>
            {hasActiveFilter ? "No records match the selected filters" : "No records yet"}
          </EmptyTitle>
        </EmptyHeader>
        <div className="mt-3 flex justify-center">
          {hasActiveFilter ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
          ) : canCreate ? (
            <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add first record
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
        <AlertTitle>Error Loading Records</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load egg production records."}</p>
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
                        "h-12 border-b border-border px-3 py-0 align-middle whitespace-nowrap",
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
    { id: "PRODUCTION_DATE", label: "Production Date" },
    { id: "SHED_CODE", label: "Shade" },
    { id: "QTY", label: "Quantity" },
    { id: "REJECT_QTY", label: "Reject Qty" },
  ];
  const currentSort = sorting[0];

  const phoneList = (
    <div>
      {/* Sorting moves to a control above the list */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Label htmlFor="egg-sort" className="text-xs font-medium text-muted-foreground">Sort</Label>
        <select
          id="egg-sort"
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
          className="h-10 w-10"
          disabled={!currentSort}
          onClick={() => currentSort && setSorting([{ id: currentSort.id, desc: !currentSort.desc }])}
        >
          {currentSort?.desc ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
          <span className="sr-only">Toggle sort direction</span>
        </Button>
      </div>

      <ul className="divide-y divide-border">
        {pageRows.map((row) => {
          const r = row.original;
          const open = expandedId === row.id;
          return (
            <li key={row.id}>
              {/* Line 1: identity left, key value right. Line 2: state + secondary */}
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpandedId(open ? null : row.id)}
                className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium text-foreground">
                      {formatDate(r.PRODUCTION_DATE)}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {formatNumber(r.QTY)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="truncate">Shade {r.SHED_CODE || "—"}</span>
                    <span className="tabular-nums">Reject {formatNumber(r.REJECT_QTY)}</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
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
                      <dt className="text-muted-foreground">Remarks</dt>
                      <dd className="text-foreground">{r.REMARKS || "—"}</dd>
                      <dt className="text-muted-foreground">Created</dt>
                      <dd className="text-foreground">{formatDate(r.CREATION_DATE)}</dd>
                    </dl>
                    {(canEdit || canDelete) && (
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button
                            variant="outline"
                            className="h-10 flex-1"
                            tabIndex={open ? 0 : -1}
                            onClick={() => handleEdit(r)}
                          >
                            <IconEdit className="mr-2 h-4 w-4" />Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            className="h-10 flex-1 text-destructive hover:text-destructive"
                            tabIndex={open ? 0 : -1}
                            onClick={() => handleDelete(r)}
                            disabled={isDeleting(r)}
                          >
                            {isDeleting(r)
                              ? <Spinner className="mr-2 h-4 w-4" />
                              : <Trash2 className="mr-2 h-4 w-4" />}
                            Delete
                          </Button>
                        )}
                      </div>
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

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
              <Egg size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Egg Production</h1>
              <p className="text-xs text-gray-400">
                {records.length} of {allRecords.length} records
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white border-gray-200"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            {canCreate && (
              <Button onClick={() => setIsAddSheetOpen(true)}>
                <IconCircleDashedPlus className="mr-1" />Add Record
              </Button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Shed Tabs */}
          <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1 max-w-full overflow-x-auto">
            {sheds.map((s) => {
              const value = String(s.ID);
              const active = activeShedId === value;
              const count = shedCounts[value] || 0;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setShedFilter(value)}
                  className={`flex items-center rounded-md px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {s.SHED_CODE}
                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-4 flex-wrap">
            {/* Global Search */}
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <Label className="text-xs font-medium text-gray-500">Search</Label>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search records..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="h-9 pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-9 bg-gray-200 mb-0" />

            {/* Production Date Range Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* From */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Production From Date</Label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={prodDateFrom}
                    max={prodDateTo || undefined}
                    onChange={(e) => setProdDateFrom(e.target.value)}
                    className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
                  />
                  {prodDateFrom && (
                    <button
                      type="button"
                      onClick={() => setProdDateFrom("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      title="Clear from date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* To */}
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">To Date</Label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={prodDateTo}
                    min={prodDateFrom || undefined}
                    onChange={(e) => setProdDateTo(e.target.value)}
                    className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
                  />
                  {prodDateTo && (
                    <button
                      type="button"
                      onClick={() => setProdDateTo("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      title="Clear to date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Column Visibility (hide, never delete) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 lg:ml-auto bg-white border-gray-200">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Entries</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
                {totalEntries.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Quantity</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-gray-800">
                {totals.qty.toLocaleString()}
              </p>
            </div>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Reject Qty</p>
              <p className="mt-1 text-lg font-bold tabular-nums text-emerald-600">
                {totals.reject.toLocaleString()}
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

      {/* Sheets */}
      {isAddSheetOpen && (
        <AddEggProductionSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
          defaultShedId={activeShedId}
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateEggProductionSheet
          open={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          defaultShedId={activeShedId}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}