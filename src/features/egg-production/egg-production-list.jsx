

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

//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("EGG_PRODUCTION_CREATE");
//   const canEdit = useHasPermission("EGG_PRODUCTION_EDIT");
//   const canDelete = useHasPermission("EGG_PRODUCTION_DELETE");

//   const {
//     data: allRecords = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useAllEggProductions();

//   const deleteMutation = useDeleteEggProduction();

//   // ── Production Date range filter ─────────────────────────────────────────
//   const records = useMemo(() => {
//     if (!prodDateFrom && !prodDateTo) return allRecords;
//     return allRecords.filter((r) => {
//       const d = toISODateString(r.PRODUCTION_DATE);
//       if (!d) return false;
//       if (prodDateFrom && d < prodDateFrom) return false;
//       if (prodDateTo && d > prodDateTo) return false;
//       return true;
//     });
//   }, [allRecords, prodDateFrom, prodDateTo]);

//   const hasDateFilter = prodDateFrom || prodDateTo;

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
//   });

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

//         {/* Table */}
//         <div className="p-5 space-y-4">
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
//   {/* From */}
//   <div className="flex items-center gap-2">
//     <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Production From Date</Label>
//     <div className="relative w-full sm:w-40">
//       <Input
//         type="date"
//         value={prodDateFrom}
//         max={prodDateTo || undefined}
//         onChange={(e) => setProdDateFrom(e.target.value)}
//         className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
//       />
//       {prodDateFrom && (
//         <button
//           type="button"
//           onClick={() => setProdDateFrom("")}
//           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//           title="Clear from date"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   </div>

//   {/* To */}
//   <div className="flex items-center gap-2">
//     <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">To Date</Label>
//     <div className="relative w-full sm:w-40">
//       <Input
//         type="date"
//         value={prodDateTo}
//         min={prodDateFrom || undefined}
//         onChange={(e) => setProdDateTo(e.target.value)}
//         className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
//       />
//       {prodDateTo && (
//         <button
//           type="button"
//           onClick={() => setProdDateTo("")}
//           className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//           title="Clear to date"
//         >
//           ✕
//         </button>
//       )}
//     </div>
//   </div>
// </div>

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
//                             {hasDateFilter
//                               ? "No records found for the selected date range"
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
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateEggProductionSheet
//           open={isUpdateSheetOpen}
//           onOpenChange={setIsUpdateSheetOpen}
//           showConfirmation={showConfirmation}
//           record={selectedRecord}
//         />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

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
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
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
// import AddEggProductionSheet from "./add-egg-production-sheet";
// import UpdateEggProductionSheet from "./update-egg-production-sheet";
// // ── imports (add) ──
// import { useAllChickenSheds } from "../chicken-shed/queries"; // path adjust korun

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

//   // Shed filter ("ALL" = no filter)
//  // ── State: age chilo shedFilter = "ALL" (code), ekhon SHED_ID (string) rakhbo ──
// const [shedFilter, setShedFilter] = useState("ALL");

//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("EGG_PRODUCTION_CREATE");
//   const canEdit = useHasPermission("EGG_PRODUCTION_EDIT");
//   const canDelete = useHasPermission("EGG_PRODUCTION_DELETE");
// // ── shedOptions: loaded data theke na niye CHICKEN_SHED theke ──
// const { data: sheds = [] } = useAllChickenSheds();
//   const {
//     data: allRecords = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useAllEggProductions();

//   const deleteMutation = useDeleteEggProduction();

//   // ── Distinct shed list from loaded data (for filter dropdown) ────────────
//   const shedOptions = useMemo(
//     () => [...new Set(allRecords.map((r) => r.SHED).filter(Boolean))].sort(),
//     [allRecords]
//   );

//   // ── Date range + Shed filter ─────────────────────────────────────────────
//   const records = useMemo(() => {
//     if (!prodDateFrom && !prodDateTo && shedFilter === "ALL") return allRecords;
//     return allRecords.filter((r) => {
//       if (shedFilter !== "ALL" && r.SHED !== shedFilter) return false;
//       if (prodDateFrom || prodDateTo) {
//         const d = toISODateString(r.PRODUCTION_DATE);
//         if (!d) return false;
//         if (prodDateFrom && d < prodDateFrom) return false;
//         if (prodDateTo && d > prodDateTo) return false;
//       }
//       return true;
//     });
//   }, [allRecords, prodDateFrom, prodDateTo, shedFilter]);

//   const hasActiveFilter = prodDateFrom || prodDateTo || shedFilter !== "ALL";

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
//       accessorKey: "SHED",
//       header: ({ column }) => <SortableHeader column={column} label="Shed" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">
//           {row.getValue("SHED") || "—"}
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
//   });

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

//         {/* Table */}
//         <div className="p-5 space-y-4">
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

//             {/* Shed Filter */}
//             <div className="flex flex-col gap-1.5 w-full sm:w-auto">
//               <Label className="text-xs font-medium text-gray-500">Shed</Label>
//               <Select value={shedFilter} onValueChange={setShedFilter}>
//                 <SelectTrigger className="h-9 w-full sm:w-36 bg-white border-gray-200">
//                   <SelectValue placeholder="All sheds" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">All sheds</SelectItem>
//                   {shedOptions.map((s) => (
//                     <SelectItem key={s} value={s}>{s}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
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
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateEggProductionSheet
//           open={isUpdateSheetOpen}
//           onOpenChange={setIsUpdateSheetOpen}
//           showConfirmation={showConfirmation}
//           record={selectedRecord}
//         />
//       )}
//       <ConfirmationDialog />
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
  Trash2,
  AlertCircle,
  RefreshCw,
  Egg,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// ── Date formatter (display) ─────────────────────────────────────────────────
const formatDate = (val) => {
  const iso = toISODateString(val);
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
};

// Reusable sortable header — clean uppercase gray style
const SortableHeader = ({ column, label }) => (
  <Button
    variant="ghost"
    className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label} <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
);

export default function EggProductionList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Production date range filter (applies instantly as you pick dates)
  const [prodDateFrom, setProdDateFrom] = useState("");
  const [prodDateTo, setProdDateTo] = useState("");

  // Shed filter: "ALL" = no filter, otherwise SHED_ID (string)
  const [shedFilter, setShedFilter] = useState("ALL");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("EGG_PRODUCTION_CREATE");
  const canEdit = useHasPermission("EGG_PRODUCTION_EDIT");
  const canDelete = useHasPermission("EGG_PRODUCTION_DELETE");

  // ── Shed list (CHICKEN_SHED master) — filter dropdown er jonno ──
  const { data: sheds = [] } = useAllChickenSheds();

  const {
    data: allRecords = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllEggProductions();

  const deleteMutation = useDeleteEggProduction();

  // ── Date range + Shed filter ─────────────────────────────────────────────
  const records = useMemo(() => {
    if (!prodDateFrom && !prodDateTo && shedFilter === "ALL") return allRecords;
    return allRecords.filter((r) => {
      if (shedFilter !== "ALL" && String(r.SHED_ID) !== shedFilter) return false;
      if (prodDateFrom || prodDateTo) {
        const d = toISODateString(r.PRODUCTION_DATE);
        if (!d) return false;
        if (prodDateFrom && d < prodDateFrom) return false;
        if (prodDateTo && d > prodDateTo) return false;
      }
      return true;
    });
  }, [allRecords, prodDateFrom, prodDateTo, shedFilter]);

  const hasActiveFilter = prodDateFrom || prodDateTo || shedFilter !== "ALL";

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

  const columns = [
    {
      accessorKey: "PRODUCTION_DATE",
      header: ({ column }) => <SortableHeader column={column} label="Production Date" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">{formatDate(row.getValue("PRODUCTION_DATE"))}</div>
      ),
    },
    {
      accessorKey: "SHED_CODE",
      header: ({ column }) => <SortableHeader column={column} label="Shed" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">
          {row.getValue("SHED_CODE") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "QTY",
      header: ({ column }) => <SortableHeader column={column} label="Quantity" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-semibold tabular-nums text-gray-800">
          {row.getValue("QTY")?.toLocaleString() ?? "—"}
        </div>
      ),
    },
    {
      accessorKey: "REJECT_QTY",
      header: ({ column }) => <SortableHeader column={column} label="Reject Qty" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-semibold tabular-nums text-emerald-600">
          {row.getValue("REJECT_QTY")?.toLocaleString() ?? "—"}
        </div>
      ),
    },
    {
      accessorKey: "REMARKS",
      header: () => (
        <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Remarks</div>
      ),
      cell: ({ row }) => (
        <div className="ml-3 text-sm text-gray-600 truncate max-w-[150px]">
          {row.getValue("REMARKS") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "CREATION_DATE",
      header: () => (
        <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At</div>
      ),
      cell: ({ row }) => (
        <div className="ml-3 text-sm text-gray-500">{formatDate(row.getValue("CREATION_DATE"))}</div>
      ),
    },
    // ── Actions column: only rendered if user has at least one of edit/delete ──
    ...(canEdit || canDelete
      ? [
          {
            id: "actions",
            header: () => (
              <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
            ),
            enableHiding: false,
            cell: ({ row }) => {
              const record = row.original;
              return (
                <div className="flex items-center justify-center gap-1">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => handleEdit(record)}
                    >
                      <IconEdit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:bg-red-50"
                      onClick={() => handleDelete(record)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending
                        ? <Spinner className="h-4 w-4" />
                        : <Trash2 className="h-4 w-4" />}
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
  });

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
              <Egg size={16} />
            </div>
            <h1 className="text-sm font-bold text-gray-900">Egg Production</h1>
          </div>
          {canCreate && (
            <Button disabled className="bg-amber-600"><IconCircleDashedPlus className="mr-1" />Add Record</Button>
          )}
        </div>
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-4 text-amber-600" />
            <p className="text-sm text-gray-500">Loading egg production records...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
              <Egg size={16} />
            </div>
            <h1 className="text-sm font-bold text-gray-900">Egg Production</h1>
          </div>
          {canCreate && (
            <Button onClick={() => setIsAddSheetOpen(true)} className="bg-amber-600 hover:bg-amber-700">
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          )}
        </div>
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
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
      </div>
    );
  }

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

        {/* Table */}
        <div className="p-5 space-y-4">
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

            {/* Shed Filter */}
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <Label className="text-xs font-medium text-gray-500">Shed</Label>
              <Select value={shedFilter} onValueChange={setShedFilter}>
                <SelectTrigger className="h-9 w-full sm:w-36 bg-white border-gray-200">
                  <SelectValue placeholder="All sheds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All sheds</SelectItem>
                  {sheds.map((s) => (
                    <SelectItem key={s.ID} value={String(s.ID)}>{s.SHED_CODE}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Column Visibility */}
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

          {/* Table */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-sm text-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon"><Egg /></EmptyMedia>
                          <EmptyTitle>
                            {hasActiveFilter
                              ? "No records found for the selected filters"
                              : "No Records Found"}
                          </EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateEggProductionSheet
          open={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}