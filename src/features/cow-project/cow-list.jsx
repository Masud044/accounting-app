
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   flexRender,
// //   getCoreRowModel,
// //   getFilteredRowModel,
// //   getPaginationRowModel,
// //   getSortedRowModel,
// //   useReactTable,
// // } from "@tanstack/react-table";
// // import {
// //   ArrowUpDown,
// //   ChevronDown,
// //   Trash2,
// //   AlertCircle,
// //   RefreshCw,
// //   Beef,
// //   Eye,
// // } from "lucide-react";
// // import { toast } from "react-toastify";
// // import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

// // import { Button } from "@/components/ui/button";
// // import {
// //   DropdownMenu,
// //   DropdownMenuCheckboxItem,
// //   DropdownMenuContent,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // import { Spinner } from "@/components/ui/spinner";
// // import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";
// // import { useHasPermission } from "@/hooks/use-permission";

// // import { useCowProjects, useDeleteCowProject } from "./queries";
// // import AddCowProjectSheet from "./add-cow-sheet";
// // import UpdateCowProjectSheet from "./update-cow-sheet";

// // const formatDate = (val) => {
// //   if (!val) return "—";
// //   const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
// //   if (!isoMatch) return "—";
// //   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// //   const [, year, month, day] = isoMatch;
// //   return `${day} ${months[Number(month) - 1]} ${year}`;
// // };

// // const fmtAmt = (v) =>
// //   v === null || v === undefined
// //     ? "—"
// //     : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// // export default function CowProjectList() {
// //   const navigate = useNavigate();

// //   const [sorting, setSorting] = useState([{ id: "ID", desc: true }]);
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [columnVisibility, setColumnVisibility] = useState({});
// //   const [rowSelection, setRowSelection] = useState({});
// //   const [globalFilter, setGlobalFilter] = useState("");

// //   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
// //   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
// //   const [selectedRecord, setSelectedRecord] = useState(null);

// //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

// //   // ── Permissions ──
// //   const canCreate = useHasPermission("COW_PROJECT_CREATE");
// //   const canEdit = useHasPermission("COW_PROJECT_EDIT");
// //   const canDelete = useHasPermission("COW_PROJECT_DELETE");

// //   const {
// //     data: records = [],
// //     isLoading,
// //     isError,
// //     error,
// //     refetch,
// //     isFetching,
// //   } = useCowProjects();

// //   const deleteMutation = useDeleteCowProject();

// //   const handleEdit = (record) => {
// //     setSelectedRecord(record);
// //     setIsUpdateSheetOpen(true);
// //   };

// //   const handleViewDetail = (record) => {
// //     navigate(`/dashboard/cow-project/${record.ID}`);
// //   };

// //   const handleDelete = async (record) => {
// //     const confirmed = await showConfirmation({
// //       title: "Delete record?",
// //       description: `Are you sure you want to delete cow project #${record.ID}? This action cannot be undone.`,
// //       confirmText: "Delete",
// //       cancelText: "Cancel",
// //       variant: "destructive",
// //     });
// //     if (confirmed) {
// //       try {
// //         await deleteMutation.mutateAsync(record.ID);
// //         toast.success("Record deleted successfully!");
// //       } catch (err) {
// //         toast.error(err?.message || "Failed to delete record. Please try again.");
// //       }
// //     }
// //   };

// //   const columns = [
// //     {
// //       accessorKey: "COW_NUMBER",
// //       header: ({ column }) => (
// //         <Button 
// //           variant="ghost" 
// //           className="h-8 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
// //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
// //         >
// //           Cow Number <ArrowUpDown className="ml-1.5 h-3 w-3" />
// //         </Button>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="font-mono text-sm font-semibold text-gray-900">
// //           {row.getValue("COW_NUMBER")}
// //         </div>
// //       ),
// //     },
// //     {
// //       accessorKey: "PURCHASE_DATE",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Date</div>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="text-sm text-gray-700">{formatDate(row.getValue("PURCHASE_DATE"))}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "SELLING_DATE",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling/Death Date</div>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="text-sm text-gray-700">{formatDate(row.getValue("SELLING_DATE"))}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "PURCHASE_AMT",
// //       header: () => (
// //         <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Amt</div>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="text-right font-mono text-sm text-gray-700">{fmtAmt(row.getValue("PURCHASE_AMT"))}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "SELLING_AMT",
// //       header: () => (
// //         <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling Amt</div>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="text-right font-mono text-sm font-semibold text-gray-900">{fmtAmt(row.getValue("SELLING_AMT"))}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "WEIGHT",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</div>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="font-mono text-sm text-gray-600">{row.getValue("WEIGHT") ?? "—"}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "STATUS",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
// //       ),
// //       cell: ({ row }) => {
// //         const active = Number(row.getValue("STATUS")) === 1;
// //         return (
// //           <Badge className={active 
// //             ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
// //             : "bg-gray-100 text-gray-600 border-gray-200"
// //           }>
// //             {active ? "Active" : "Inactive"}
// //           </Badge>
// //         );
// //       },
// //     },
// //     {
// //       id: "actions",
// //       header: () => (
// //         <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</div>
// //       ),
// //       enableHiding: false,

// //      cell: ({ row }) => {
// //   const record = row.original;
// //   const active = Number(record.STATUS) === 1;
// //   return (
// //     <div className="flex items-center justify-end gap-1">
// //       <Tooltip>
// //         <TooltipTrigger asChild>
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
// //             onClick={() => handleViewDetail(record)}
// //           >
// //             <Eye className="h-4 w-4" />
// //             <span className="sr-only">View Detail</span>
// //           </Button>
// //         </TooltipTrigger>
// //         <TooltipContent>View Details</TooltipContent>
// //       </Tooltip>

// //       {canEdit && (
// //         <Tooltip>
// //           <TooltipTrigger asChild>
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
// //               onClick={() => handleEdit(record)}
// //             >
// //               <IconEdit className="h-4 w-4" />
// //               <span className="sr-only">Edit</span>
// //             </Button>
// //           </TooltipTrigger>
// //           <TooltipContent>{active ? "Edit" : "View (read-only)"}</TooltipContent>
// //         </Tooltip>
// //       )}

// //       {canDelete && (
// //         <Tooltip>
// //           <TooltipTrigger asChild>
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               className={`h-8 w-8 text-gray-400 ${active ? "hover:bg-red-50 hover:text-red-600" : "opacity-30 cursor-not-allowed"}`}
// //               onClick={() => active && handleDelete(record)}
// //               disabled={!active || deleteMutation.isPending}
// //             >
// //               {deleteMutation.isPending
// //                 ? <Spinner className="h-4 w-4" />
// //                 : <Trash2 className="h-4 w-4" />}
// //               <span className="sr-only">Delete</span>
// //             </Button>
// //           </TooltipTrigger>
// //           <TooltipContent>{active ? "Delete" : "Inactive — cannot delete"}</TooltipContent>
// //         </Tooltip>
// //       )}
// //     </div>
// //   );
// // },
// //     },
// //   ];

// //   const table = useReactTable({
// //     data: records,
// //     columns,
// //     onSortingChange: setSorting,
// //     onColumnFiltersChange: setColumnFilters,
// //     getCoreRowModel: getCoreRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     onColumnVisibilityChange: setColumnVisibility,
// //     onRowSelectionChange: setRowSelection,
// //     onGlobalFilterChange: setGlobalFilter,
// //     state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
// //   });

// //   if (isLoading) {
// //     return (
// //       <div className="p-4 md:p-6">
// //         <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
// //           <div className="px-6 py-4 border-b border-gray-100">
// //             <div className="flex items-center gap-3">
// //               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
// //                 <Beef size={20} className="text-white" />
// //               </div>
// //               <div>
// //                 <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
// //                 <p className="text-xs text-gray-400">Loading records...</p>
// //               </div>
// //             </div>
// //           </div>
// //           <div className="p-6 flex flex-col items-center justify-center py-16">
// //             <Spinner className="h-10 w-10 text-emerald-600 mb-4" />
// //             <p className="text-sm text-gray-400">Loading cow project records...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div className="p-4 md:p-6">
// //         <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
// //           <div className="px-6 py-4 border-b border-gray-100">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-3">
// //                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
// //                   <Beef size={20} className="text-white" />
// //                 </div>
// //                 <div>
// //                   <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
// //                   <p className="text-xs text-gray-400">Error loading records</p>
// //                 </div>
// //               </div>
// //               {canCreate && (
// //                 <Button onClick={() => setIsAddSheetOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
// //                   <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
// //                 </Button>
// //               )}
// //             </div>
// //           </div>
// //           <div className="p-6">
// //             <div className="rounded-lg bg-red-50 border border-red-200 p-6">
// //               <div className="flex items-start gap-3">
// //                 <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
// //                 <div>
// //                   <h4 className="text-sm font-medium text-red-800">Error Loading Records</h4>
// //                   <p className="text-sm text-red-600 mt-1">{error?.message || "Failed to load cow project records."}</p>
// //                   <Button 
// //                     variant="outline" 
// //                     size="sm" 
// //                     onClick={() => refetch()} 
// //                     disabled={isFetching}
// //                     className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
// //                   >
// //                     {isFetching ? (
// //                       <>
// //                         <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
// //                         Retrying...
// //                       </>
// //                     ) : (
// //                       <>
// //                         <RefreshCw className="mr-2 h-3.5 w-3.5" />
// //                         Retry
// //                       </>
// //                     )}
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-6">
// //       <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
// //           <div className="flex items-center gap-3">
// //             <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm">
// //               <Beef size={20} className="text-white" />
// //             </div>
// //             <div>
// //               <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
// //               <p className="text-xs text-gray-400">
// //                 {records.length} {records.length === 1 ? "record" : "records"} found
// //               </p>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <Button 
// //               variant="outline" 
// //               size="sm" 
// //               onClick={() => refetch()} 
// //               disabled={isFetching}
// //               className="border-gray-200 bg-white"
// //             >
// //               <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
// //               Refresh
// //             </Button>
// //             {canCreate && (
// //               <Button onClick={() => setIsAddSheetOpen(true)} >
// //                 <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
// //               </Button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="p-6 space-y-4">
// //           {/* Filters */}
// //           <div className="flex flex-col sm:flex-row gap-3">
// //             <div className="relative flex-1 max-w-sm">
// //               <Input
// //                 placeholder="Search records..."
// //                 value={globalFilter ?? ""}
// //                 onChange={(e) => setGlobalFilter(e.target.value)}
// //                 className="h-9 bg-white border-gray-200 pl-9 text-sm"
// //               />
// //               <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //               </svg>
// //             </div>
// //             <div className="ml-auto">
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button variant="outline" className="h-9 border-gray-200 bg-white text-sm">
// //                     Columns <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent align="end" className="bg-white border-gray-200">
// //                   {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
// //                     <DropdownMenuCheckboxItem
// //                       key={col.id}
// //                       className="capitalize text-sm"
// //                       checked={col.getIsVisible()}
// //                       onCheckedChange={(v) => col.toggleVisibility(!!v)}
// //                     >
// //                       {col.id.replace(/_/g, " ").toLowerCase()}
// //                     </DropdownMenuCheckboxItem>
// //                   ))}
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>
// //           </div>

// //           {/* Table */}
// //           <div className="overflow-hidden rounded-xl border border-gray-200">
// //             <Table>
// //               <TableHeader className="bg-gray-50">
// //                 {table.getHeaderGroups().map((hg) => (
// //                   <TableRow key={hg.id}>
// //                     {hg.headers.map((h) => (
// //                       <TableHead key={h.id} className="py-2.5">
// //                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// //                       </TableHead>
// //                     ))}
// //                   </TableRow>
// //                 ))}
// //               </TableHeader>
// //               <TableBody>
// //                 {table.getRowModel().rows?.length ? (
// //                   table.getRowModel().rows.map((row) => (
// //                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
// //                       {row.getVisibleCells().map((cell) => (
// //                         <TableCell key={cell.id} className="py-2.5">
// //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                         </TableCell>
// //                       ))}
// //                     </TableRow>
// //                   ))
// //                 ) : (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="h-32 text-center">
// //                       <div className="flex flex-col items-center gap-2">
// //                         <Beef className="h-10 w-10 text-gray-300" />
// //                         <p className="text-sm font-medium text-gray-500">No Records Found</p>
// //                         <p className="text-xs text-gray-400">Click "Add Record" to create a new entry</p>
// //                       </div>
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>

// //           {/* Pagination */}
// //           <div className="border-t border-gray-100 pt-3">
// //             <DataTablePagination table={table} />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Sheets */}
// //       {isAddSheetOpen && (
// //         <AddCowProjectSheet
// //           open={isAddSheetOpen}
// //           onOpenChange={setIsAddSheetOpen}
// //           showConfirmation={showConfirmation}
// //         />
// //       )}
// //       {isUpdateSheetOpen && (
// //         <UpdateCowProjectSheet
// //           open={isUpdateSheetOpen}
// //           onOpenChange={setIsUpdateSheetOpen}
// //           showConfirmation={showConfirmation}
// //           record={selectedRecord}
// //         />
// //       )}
// //       <ConfirmationDialog />
// //     </div>
// //   );
// // }

// import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
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
//   Beef,
//   Eye,
//   Search,
//   X,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useHasPermission } from "@/hooks/use-permission";

// import { useCowProjects, useDeleteCowProject } from "./queries";
// import AddCowProjectSheet from "./add-cow-sheet";
// import UpdateCowProjectSheet from "./update-cow-sheet";

// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// // Backend sends 'YYYY-MM-DD' — normalize to that for filtering
// const toISODateString = (val) => {
//   if (!val) return "";
//   const isoMatch = String(val).match(/(\d{4}-\d{2}-\d{2})/);
//   if (isoMatch) return isoMatch[1];
//   const parsed = new Date(val);
//   if (!isNaN(parsed.getTime())) {
//     return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
//   }
//   return "";
// };

// const formatDate = (val) => {
//   const iso = toISODateString(val);
//   if (!iso) return "—";
//   const [year, month, day] = iso.split("-");
//   return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
// };

// const fmtAmt = (v) =>
//   v === null || v === undefined
//     ? "—"
//     : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// export default function CowProjectList() {
//   const navigate = useNavigate();

//   const [sorting, setSorting] = useState([{ id: "ID", desc: true }]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");

//   // ── Filters: Cow Number (search) + Purchase Date (range) ──
//   const [cowNumberFilter, setCowNumberFilter] = useState("");
//   const [purchaseDateFrom, setPurchaseDateFrom] = useState("");
//   const [purchaseDateTo, setPurchaseDateTo] = useState("");

//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("COW_PROJECT_CREATE");
//   const canEdit = useHasPermission("COW_PROJECT_EDIT");
//   const canDelete = useHasPermission("COW_PROJECT_DELETE");

//   const {
//     data: records = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useCowProjects();

//   const deleteMutation = useDeleteCowProject();

//   // ── Apply Cow Number + Purchase Date filters ──
//   const filteredRecords = useMemo(() => {
//     const cow = cowNumberFilter.trim().toLowerCase();
//     return records.filter((r) => {
//       if (cow && !String(r.COW_NUMBER ?? "").toLowerCase().includes(cow)) return false;

//       if (purchaseDateFrom || purchaseDateTo) {
//         const d = toISODateString(r.PURCHASE_DATE);
//         if (!d) return false;
//         if (purchaseDateFrom && d < purchaseDateFrom) return false;
//         if (purchaseDateTo && d > purchaseDateTo) return false;
//       }
//       return true;
//     });
//   }, [records, cowNumberFilter, purchaseDateFrom, purchaseDateTo]);

//   const hasActiveFilter = cowNumberFilter.trim() !== "" || purchaseDateFrom || purchaseDateTo;

//   const clearFilters = () => {
//     setCowNumberFilter("");
//     setPurchaseDateFrom("");
//     setPurchaseDateTo("");
//   };

//   const handleEdit = (record) => {
//     setSelectedRecord(record);
//     setIsUpdateSheetOpen(true);
//   };

//   const handleViewDetail = (record) => {
//     navigate(`/dashboard/cow-project/${record.ID}`);
//   };

//   const handleDelete = async (record) => {
//     const confirmed = await showConfirmation({
//       title: "Delete record?",
//       description: `Are you sure you want to delete cow project #${record.ID}? This action cannot be undone.`,
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
//       accessorKey: "COW_NUMBER",
//       header: ({ column }) => (
//         <Button
//           variant="ghost"
//           className="h-8 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Cow Number <ArrowUpDown className="ml-1.5 h-3 w-3" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-mono text-sm font-semibold text-gray-900">
//           {row.getValue("COW_NUMBER")}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "PURCHASE_DATE",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Date</div>
//       ),
//       cell: ({ row }) => (
//         <div className="text-sm text-gray-700">{formatDate(row.getValue("PURCHASE_DATE"))}</div>
//       ),
//     },
//     {
//       accessorKey: "SELLING_DATE",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling/Death Date</div>
//       ),
//       cell: ({ row }) => (
//         <div className="text-sm text-gray-700">{formatDate(row.getValue("SELLING_DATE"))}</div>
//       ),
//     },
//     {
//       accessorKey: "PURCHASE_AMT",
//       header: () => (
//         <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Amt</div>
//       ),
//       cell: ({ row }) => (
//         <div className="text-right font-mono text-sm text-gray-700">{fmtAmt(row.getValue("PURCHASE_AMT"))}</div>
//       ),
//     },
//     {
//       accessorKey: "SELLING_AMT",
//       header: () => (
//         <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling Amt</div>
//       ),
//       cell: ({ row }) => (
//         <div className="text-right font-mono text-sm font-semibold text-gray-900">{fmtAmt(row.getValue("SELLING_AMT"))}</div>
//       ),
//     },
//     {
//       accessorKey: "WEIGHT",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</div>
//       ),
//       cell: ({ row }) => (
//         <div className="font-mono text-sm text-gray-600">{row.getValue("WEIGHT") ?? "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "STATUS",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
//       ),
//       cell: ({ row }) => {
//         const active = Number(row.getValue("STATUS")) === 1;
//         return (
//           <Badge className={active
//             ? "bg-emerald-100 text-emerald-700 border-emerald-200"
//             : "bg-gray-100 text-gray-600 border-gray-200"
//           }>
//             {active ? "Active" : "Inactive"}
//           </Badge>
//         );
//       },
//     },
//     {
//       id: "actions",
//       header: () => (
//         <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</div>
//       ),
//       enableHiding: false,
//       cell: ({ row }) => {
//         const record = row.original;
//         const active = Number(record.STATUS) === 1;
//         return (
//           <div className="flex items-center justify-end gap-1">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
//                   onClick={() => handleViewDetail(record)}
//                 >
//                   <Eye className="h-4 w-4" />
//                   <span className="sr-only">View Detail</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>View Details</TooltipContent>
//             </Tooltip>

//             {canEdit && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
//                     onClick={() => handleEdit(record)}
//                   >
//                     <IconEdit className="h-4 w-4" />
//                     <span className="sr-only">Edit</span>
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>{active ? "Edit" : "View (read-only)"}</TooltipContent>
//               </Tooltip>
//             )}

//             {canDelete && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className={`h-8 w-8 text-gray-400 ${active ? "hover:bg-red-50 hover:text-red-600" : "opacity-30 cursor-not-allowed"}`}
//                     onClick={() => active && handleDelete(record)}
//                     disabled={!active || deleteMutation.isPending}
//                   >
//                     {deleteMutation.isPending
//                       ? <Spinner className="h-4 w-4" />
//                       : <Trash2 className="h-4 w-4" />}
//                     <span className="sr-only">Delete</span>
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>{active ? "Delete" : "Inactive — cannot delete"}</TooltipContent>
//               </Tooltip>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: filteredRecords,
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

//   if (isLoading) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
//           <div className="px-6 py-4 border-b border-gray-100">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
//                 <Beef size={20} className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
//                 <p className="text-xs text-gray-400">Loading records...</p>
//               </div>
//             </div>
//           </div>
//           <div className="p-6 flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 text-emerald-600 mb-4" />
//             <p className="text-sm text-gray-400">Loading cow project records...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
//           <div className="px-6 py-4 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
//                   <Beef size={20} className="text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
//                   <p className="text-xs text-gray-400">Error loading records</p>
//                 </div>
//               </div>
//               {canCreate && (
//                 <Button onClick={() => setIsAddSheetOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
//                   <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
//                 </Button>
//               )}
//             </div>
//           </div>
//           <div className="p-6">
//             <div className="rounded-lg bg-red-50 border border-red-200 p-6">
//               <div className="flex items-start gap-3">
//                 <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <h4 className="text-sm font-medium text-red-800">Error Loading Records</h4>
//                   <p className="text-sm text-red-600 mt-1">{error?.message || "Failed to load cow project records."}</p>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => refetch()}
//                     disabled={isFetching}
//                     className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
//                   >
//                     {isFetching ? (
//                       <>
//                         <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
//                         Retrying...
//                       </>
//                     ) : (
//                       <>
//                         <RefreshCw className="mr-2 h-3.5 w-3.5" />
//                         Retry
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm">
//               <Beef size={20} className="text-white" />
//             </div>
//             <div>
//               <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
//               <p className="text-xs text-gray-400">
//                 {filteredRecords.length} of {records.length} {records.length === 1 ? "record" : "records"}
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => refetch()}
//               disabled={isFetching}
//               className="border-gray-200 bg-white"
//             >
//               <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
//               Refresh
//             </Button>
//             {canCreate && (
//               <Button onClick={() => setIsAddSheetOpen(true)}>
//                 <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Filters */}
//           <div className="flex flex-col lg:flex-row lg:items-end gap-3 flex-wrap">
//             {/* Global search */}
//             <div className="relative w-full sm:w-64">
//               <Input
//                 placeholder="Search records..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="h-9 bg-white border-gray-200 pl-9 text-sm"
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>

//             {/* Cow Number (search) */}
//            {/* Cow Number */}
// <div className="flex items-center gap-2 w-full sm:w-auto">
//   <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Cow Number</Label>
//   <div className="relative w-full sm:w-44">
//     <Input
//       placeholder="Filter cow number..."
//       value={cowNumberFilter}
//       onChange={(e) => setCowNumberFilter(e.target.value)}
//       className="h-9 bg-white border-gray-200 pr-8 text-sm focus-visible:ring-1 focus-visible:ring-emerald-300"
//     />
//     {cowNumberFilter && (
//       <button
//         type="button"
//         onClick={() => setCowNumberFilter("")}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//         title="Clear cow number"
//       >
//         <X className="h-4 w-4" />
//       </button>
//     )}
//   </div>
// </div>

// {/* Purchase From Date */}
// <div className="flex items-center gap-2 w-full sm:w-auto">
//   <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Purchase From Date</Label>
//   <div className="relative w-full sm:w-40">
//     <Input
//       type="date"
//       value={purchaseDateFrom}
//       max={purchaseDateTo || undefined}
//       onChange={(e) => setPurchaseDateFrom(e.target.value)}
//       className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-300"
//     />
//     {purchaseDateFrom && (
//       <button
//         type="button"
//         onClick={() => setPurchaseDateFrom("")}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//         title="Clear from date"
//       >
//         ✕
//       </button>
//     )}
//   </div>
// </div>

// {/* To Date */}
// <div className="flex items-center gap-2 w-full sm:w-auto">
//   <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">To Date</Label>
//   <div className="relative w-full sm:w-40">
//     <Input
//       type="date"
//       value={purchaseDateTo}
//       min={purchaseDateFrom || undefined}
//       onChange={(e) => setPurchaseDateTo(e.target.value)}
//       className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-300"
//     />
//     {purchaseDateTo && (
//       <button
//         type="button"
//         onClick={() => setPurchaseDateTo("")}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//         title="Clear to date"
//       >
//         ✕
//       </button>
//     )}
//   </div>
// </div>

//             {hasActiveFilter && (
//               <Button
//                 variant="ghost"
//                 className="h-9 text-gray-500 hover:text-gray-800"
//                 onClick={clearFilters}
//               >
//                 <X className="h-4 w-4 mr-1" /> Clear filters
//               </Button>
//             )}

//             <div className="lg:ml-auto">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="h-9 border-gray-200 bg-white text-sm">
//                     Columns <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="bg-white border-gray-200">
//                   {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
//                     <DropdownMenuCheckboxItem
//                       key={col.id}
//                       className="capitalize text-sm"
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

//           {/* Table */}
//           <div className="overflow-hidden rounded-xl border border-gray-200">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id} className="py-2.5">
//                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="py-2.5">
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-32 text-center">
//                       <div className="flex flex-col items-center gap-2">
//                         <Beef className="h-10 w-10 text-gray-300" />
//                         <p className="text-sm font-medium text-gray-500">
//                           {hasActiveFilter ? "No records match the selected filters" : "No Records Found"}
//                         </p>
//                         {!hasActiveFilter && (
//                           <p className="text-xs text-gray-400">Click "Add Record" to create a new entry</p>
//                         )}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           <div className="border-t border-gray-100 pt-3">
//             <DataTablePagination table={table} />
//           </div>
//         </div>
//       </div>

//       {/* Sheets */}
//       {isAddSheetOpen && (
//         <AddCowProjectSheet
//           open={isAddSheetOpen}
//           onOpenChange={setIsAddSheetOpen}
//           showConfirmation={showConfirmation}
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateCowProjectSheet
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

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";
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
  Beef,
  Eye,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHasPermission } from "@/hooks/use-permission";

import { useCowProjects, useDeleteCowProject } from "./queries";
import AddCowProjectSheet from "./add-cow-sheet";
import UpdateCowProjectSheet from "./update-cow-sheet";

/* ──────────────────────────────────────────────────────────────
   Constants & helpers
   ────────────────────────────────────────────────────────────── */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Below this container width the table becomes a row list (pinned + 3 scrolling cols × ~115px)
const PHONE_BREAKPOINT = 800;
// Header pinning only makes sense when the page has more than ~15 rows
const PIN_HEADER_MIN_ROWS = 15;

// Backend sends 'YYYY-MM-DD' — normalize to that for filtering/sorting
const toISODateString = (val) => {
  if (!val) return "";
  const isoMatch = String(val).match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];
  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  }
  return "";
};

const formatDate = (val) => {
  const iso = toISODateString(val);
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
};

const isMissing = (v) => v === null || v === undefined || v === "";

// Same decimals in every number column. Missing → dash, real zero → 0.00
const fmtNum = (v) =>
  isMissing(v) || Number.isNaN(Number(v))
    ? "—"
    : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const toNum = (v) => (isMissing(v) || Number.isNaN(Number(v)) ? undefined : Number(v));

/* ──────────────────────────────────────────────────────────────
   Active row store — one id at a time, same id again clears it
   (move to its own file if other tables want to share the pattern)
   ────────────────────────────────────────────────────────────── */

const useActiveCowRow = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
  clear: () => set({ activeId: null }),
}));

/* ──────────────────────────────────────────────────────────────
   Container width (container query, not viewport media query)
   ────────────────────────────────────────────────────────────── */

function useContainerWidth(ref) {
  const [width, setWidth] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/* ──────────────────────────────────────────────────────────────
   Small building blocks
   ────────────────────────────────────────────────────────────── */

// Solid backgrounds only — pinned cells must not be see-through
const CELL_BG_IDLE = "bg-card group-hover:bg-muted";
const CELL_BG_ACTIVE = "bg-[color-mix(in_oklab,var(--primary)_16%,var(--card))]";

const ALIGN = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

const pinCell = (pin) =>
  pin === "left"
    ? "sticky left-0 z-10 border-r border-border"
    : pin === "right"
      ? "sticky right-0 z-10 border-l border-border"
      : "";

function StatusBadge({ status }) {
  const active = Number(status) === 1;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}

function SortHeader({ column, label, align = "left" }) {
  const sorted = column.getIsSorted();
  return (
    <div className={cn("flex", align === "right" ? "justify-end" : "justify-start")}>
      <Button
        type="button"
        variant="ghost"
        className="-mx-2 h-8 gap-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        {label}
        {/* Sort arrow only on the active column */}
        {sorted === "asc" && <ArrowUp className="size-3" aria-hidden="true" />}
        {sorted === "desc" && <ArrowDown className="size-3" aria-hidden="true" />}
      </Button>
    </div>
  );
}

function PlainHeader({ label }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
  );
}

function ActionButton({ label, icon, onClick, className, disabled, withLabels, tooltip }) {
  const btn = (
    <Button
      type="button"
      variant="ghost"
      size={withLabels ? "default" : "icon"}
      className={cn(withLabels ? "h-10 gap-1.5 px-3" : "h-8 w-8", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {withLabels ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </Button>
  );
  if (withLabels) return btn;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent>{tooltip ?? label}</TooltipContent>
    </Tooltip>
  );
}

// Always visible. Clicks/keys never bubble to the row, so they never toggle the highlight.
function RowActions({ record, canEdit, canDelete, isDeleting, onView, onEdit, onDelete, withLabels = false }) {
  const active = Number(record.STATUS) === 1;
  return (
    <div
      className={cn("flex items-center gap-1", withLabels ? "flex-wrap justify-start" : "justify-end")}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <ActionButton
        label="View"
        tooltip="View details"
        withLabels={withLabels}
        icon={<Eye className="size-4" />}
        className="hover:bg-accent hover:text-accent-foreground"
        onClick={() => onView(record)}
      />
      {canEdit && (
        <ActionButton
          label={active ? "Edit" : "View (read-only)"}
          withLabels={withLabels}
          icon={<IconEdit className="size-4" />}
          className="hover:bg-accent hover:text-accent-foreground"
          onClick={() => onEdit(record)}
        />
      )}
      {canDelete && (
        <ActionButton
          label="Delete"
          tooltip={active ? "Delete" : "Inactive — cannot delete"}
          withLabels={withLabels}
          icon={isDeleting ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
          className={cn(
            "text-muted-foreground",
            active ? "hover:bg-destructive/10 hover:text-destructive" : "cursor-not-allowed opacity-40",
          )}
          disabled={!active || isDeleting}
          onClick={() => active && onDelete(record)}
        />
      )}
    </div>
  );
}

function SkeletonRows({ count = 8 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border" role="status" aria-label="Loading records">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex h-12 items-center gap-4 border-b border-border px-3 last:border-b-0">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="hidden h-3 w-24 animate-pulse rounded bg-muted sm:block" />
          <div className="ml-auto h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry, retrying }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <h4 className="text-sm font-medium text-destructive">Error loading records</h4>
          <p className="mt-1 text-sm text-muted-foreground">{message || "Failed to load cow project records."}</p>
          <Button type="button" variant="outline" size="sm" onClick={onRetry} disabled={retrying} className="mt-3">
            <RefreshCw className={cn("mr-2 size-3.5", retrying && "animate-spin")} />
            {retrying ? "Retrying..." : "Retry"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filtered, onClear, onAdd, canCreate }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border py-14 text-center">
      <Beef className="size-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">
        {filtered ? "No records match the selected filters" : "No records yet"}
      </p>
      {filtered ? (
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <X className="mr-1 size-4" /> Clear filters
        </Button>
      ) : (
        canCreate && (
          <Button type="button" size="sm" onClick={onAdd}>
            <IconCircleDashedPlus className="mr-1.5 size-4" /> Add first record
          </Button>
        )
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

export default function CowProjectList() {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([{ id: "ID", desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Filters: Cow Number (search) + Purchase Date (range)
  const [cowNumberFilter, setCowNumberFilter] = useState("");
  const [purchaseDateFrom, setPurchaseDateFrom] = useState("");
  const [purchaseDateTo, setPurchaseDateTo] = useState("");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Phone: one expanded row at a time
  const [expandedId, setExpandedId] = useState(null);

  const activeId = useActiveCowRow((s) => s.activeId);
  const toggleActive = useActiveCowRow((s) => s.toggle);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("COW_PROJECT_CREATE");
  const canEdit = useHasPermission("COW_PROJECT_EDIT");
  const canDelete = useHasPermission("COW_PROJECT_DELETE");

  const { data: records = [], isLoading, isError, error, refetch, isFetching } = useCowProjects();
  const deleteMutation = useDeleteCowProject();

  // ── Apply Cow Number + Purchase Date filters ──
  const filteredRecords = useMemo(() => {
    const cow = cowNumberFilter.trim().toLowerCase();
    return records.filter((r) => {
      if (cow && !String(r.COW_NUMBER ?? "").toLowerCase().includes(cow)) return false;
      if (purchaseDateFrom || purchaseDateTo) {
        const d = toISODateString(r.PURCHASE_DATE);
        if (!d) return false;
        if (purchaseDateFrom && d < purchaseDateFrom) return false;
        if (purchaseDateTo && d > purchaseDateTo) return false;
      }
      return true;
    });
  }, [records, cowNumberFilter, purchaseDateFrom, purchaseDateTo]);

  const hasActiveFilter =
    cowNumberFilter.trim() !== "" || !!purchaseDateFrom || !!purchaseDateTo || globalFilter.trim() !== "";

  const clearFilters = () => {
    setCowNumberFilter("");
    setPurchaseDateFrom("");
    setPurchaseDateTo("");
    setGlobalFilter("");
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleViewDetail = (record) => navigate(`/dashboard/cow-project/${record.ID}`);

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete record?",
      description: `Are you sure you want to delete cow project #${record.ID}? This action cannot be undone.`,
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

  const isDeletingRecord = (record) =>
    deleteMutation.isPending && deleteMutation.variables === record.ID;

  /* ── Columns ──
     Identity: COW_NUMBER · Value: PURCHASE_AMT, SELLING_AMT, WEIGHT
     State: STATUS · Date: PURCHASE_DATE, SELLING_DATE · Meta: ID (hidden, default sort) · Action: actions */
  const columns = [
    {
      // Meta: hidden, only drives the default "newest first" sort
      id: "ID",
      accessorKey: "ID",
      enableHiding: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "COW_NUMBER",
      meta: { pin: "left", minWidth: 180, align: "left" },
      header: ({ column }) => <SortHeader column={column} label="Cow Number" />,
      cell: ({ row }) => {
        const v = row.getValue("COW_NUMBER");
        if (isMissing(v)) return <span className="text-muted-foreground">—</span>;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[240px] truncate font-mono text-sm font-semibold text-foreground">{v}</div>
            </TooltipTrigger>
            <TooltipContent>{v}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      id: "PURCHASE_DATE",
      accessorFn: (r) => toISODateString(r.PURCHASE_DATE),
      meta: { width: 140, align: "left" },
      header: ({ column }) => <SortHeader column={column} label="Purchase Date" />,
      cell: ({ row }) => <span className="text-sm text-foreground">{formatDate(row.getValue("PURCHASE_DATE"))}</span>,
    },
    {
      id: "SELLING_DATE",
      accessorFn: (r) => toISODateString(r.SELLING_DATE),
      meta: { width: 180, align: "left" },
      header: ({ column }) => <SortHeader column={column} label="Selling/Death Date" />,
      cell: ({ row }) => <span className="text-sm text-foreground">{formatDate(row.getValue("SELLING_DATE"))}</span>,
    },
    {
      id: "PURCHASE_AMT",
      accessorFn: (r) => toNum(r.PURCHASE_AMT),
      meta: { width: 150, align: "right" },
      sortUndefined: "last",
      header: ({ column }) => <SortHeader column={column} label="Purchase Amt" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-foreground">{fmtNum(row.getValue("PURCHASE_AMT"))}</span>
      ),
    },
    {
      id: "SELLING_AMT",
      accessorFn: (r) => toNum(r.SELLING_AMT),
      meta: { width: 150, align: "right" },
      sortUndefined: "last",
      header: ({ column }) => <SortHeader column={column} label="Selling Amt" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">{fmtNum(row.getValue("SELLING_AMT"))}</span>
      ),
    },
    {
      id: "WEIGHT",
      accessorFn: (r) => toNum(r.WEIGHT),
      meta: { width: 120, align: "right" },
      sortUndefined: "last",
      header: ({ column }) => <SortHeader column={column} label="Weight" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-foreground">{fmtNum(row.getValue("WEIGHT"))}</span>
      ),
    },
    {
      accessorKey: "STATUS",
      meta: { width: 130, align: "center" },
      header: () => <PlainHeader label="Status" />,
      cell: ({ row }) => <StatusBadge status={row.getValue("STATUS")} />,
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      meta: { pin: "right", width: 140, align: "right" },
      header: () => <PlainHeader label="Actions" />,
      cell: ({ row }) => (
        <RowActions
          record={row.original}
          canEdit={canEdit}
          canDelete={canDelete}
          isDeleting={isDeletingRecord(row.original)}
          onView={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: filteredRecords,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility: { ID: false, ...columnVisibility }, globalFilter },
  });

  const bodyRef = useRef(null);
  const bodyWidth = useContainerWidth(bodyRef);
  const isPhone = bodyWidth !== null && bodyWidth < PHONE_BREAKPOINT;

  const rows = table.getRowModel().rows;
  const pinHeader = rows.length > PIN_HEADER_MIN_ROWS;

  // ── Phone sort control (replaces header sorting) ──
  const SORT_OPTIONS = [
    { id: "ID", label: "Newest first" },
    { id: "COW_NUMBER", label: "Cow number" },
    { id: "PURCHASE_DATE", label: "Purchase date" },
    { id: "PURCHASE_AMT", label: "Purchase amt" },
    { id: "SELLING_AMT", label: "Selling amt" },
    { id: "WEIGHT", label: "Weight" },
  ];
  const currentSort = sorting[0] ?? { id: "ID", desc: true };

  /* ── Body renderers ── */

  const renderDesktopTable = () => (
    <div
      className="overflow-auto rounded-xl border border-border"
      style={pinHeader ? { maxHeight: "calc(100dvh - 20rem)" } : undefined}
    >
      {/* Plain <table> inside ONE scroll container (no nested scrollers) */}
      <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const meta = h.column.columnDef.meta ?? {};
                const sorted = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    scope="col"
                    aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                    style={{ width: meta.width, minWidth: meta.minWidth ?? meta.width }}
                    className={cn(
                      "h-11 whitespace-nowrap border-b border-border bg-muted px-3 font-medium",
                      ALIGN[meta.align ?? "left"],
                      (pinHeader || meta.pin) && "sticky",
                      pinHeader && "top-0",
                      meta.pin ? "z-30" : pinHeader && "z-20",
                      meta.pin === "left" && "left-0 border-r",
                      meta.pin === "right" && "right-0 border-l",
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
          {rows.map((row) => {
            const id = row.original.ID;
            const isActive = activeId === id;
            return (
              <tr
                key={row.id}
                tabIndex={0}
                aria-current={isActive ? "true" : undefined}
                data-active={isActive}
                onClick={() => toggleActive(id)}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    toggleActive(id);
                  }
                }}
                className="group cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta ?? {};
                  return (
                    <td
                      key={cell.id}
                      style={{ width: meta.width, minWidth: meta.minWidth ?? meta.width }}
                      className={cn(
                        "h-12 whitespace-nowrap border-b border-border px-3 align-middle",
                        ALIGN[meta.align ?? "left"],
                        isActive ? CELL_BG_ACTIVE : CELL_BG_IDLE,
                        pinCell(meta.pin),
                      )}
                    >
                      {meta.align === "center" ? (
                        <div className="flex justify-center">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
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

  const renderPhoneList = () => (
    <div className="space-y-3">
      {/* Sorting lives above the list on phone */}
      <div className="flex items-center gap-2">
        <Label htmlFor="cow-sort" className="sr-only">
          Sort by
        </Label>
        <select
          id="cow-sort"
          value={currentSort.id}
          onChange={(e) => setSorting([{ id: e.target.value, desc: currentSort.desc }])}
          className="h-11 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          className="size-11"
          onClick={() => setSorting([{ id: currentSort.id, desc: !currentSort.desc }])}
          aria-label={currentSort.desc ? "Sorted descending, switch to ascending" : "Sorted ascending, switch to descending"}
        >
          {currentSort.desc ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />}
        </Button>
      </div>

      <ul className="overflow-hidden rounded-xl border border-border">
        {rows.map((row) => {
          const r = row.original;
          const open = expandedId === r.ID;
          return (
            <li key={row.id} className="border-b border-border bg-card last:border-b-0">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpandedId(open ? null : r.ID)}
                className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="min-w-0 flex-1">
                  {/* Line 1: identity left, key value right (same slot on every row) */}
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="line-clamp-2 min-w-0 break-words font-mono text-sm font-semibold text-foreground">
                      {isMissing(r.COW_NUMBER) ? "—" : r.COW_NUMBER}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-foreground">{fmtNum(r.PURCHASE_AMT)}</span>
                  </div>
                  {/* Line 2: state + secondary info */}
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <StatusBadge status={r.STATUS} />
                    <span className="text-xs text-muted-foreground">Purchased {formatDate(r.PURCHASE_DATE)}</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Expand in place: only fields not already on the row + actions */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 px-3 pb-3">
                    <dl className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">Selling/Death</dt>
                        <dd>{formatDate(r.SELLING_DATE)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Selling Amt</dt>
                        <dd className="tabular-nums">{fmtNum(r.SELLING_AMT)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Weight</dt>
                        <dd className="tabular-nums">{fmtNum(r.WEIGHT)}</dd>
                      </div>
                    </dl>
                    <RowActions
                      withLabels
                      record={r}
                      canEdit={canEdit}
                      canDelete={canDelete}
                      isDeleting={isDeletingRecord(r)}
                      onView={handleViewDetail}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const renderBody = () => {
    if (isLoading) return <SkeletonRows />;
    if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} retrying={isFetching} />;
    if (rows.length === 0)
      return (
        <EmptyState
          filtered={hasActiveFilter}
          onClear={clearFilters}
          onAdd={() => setIsAddSheetOpen(true)}
          canCreate={canCreate}
        />
      );
    return isPhone ? renderPhoneList() : renderDesktopTable();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Beef size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Cow Project</h2>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "Loading records..."
                  : isError
                    ? "Error loading records"
                    : `${filteredRecords.length} of ${records.length} ${records.length === 1 ? "record" : "records"}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={cn("mr-1.5 size-3.5", isFetching && "animate-spin")} />
              Refresh
            </Button>
            {canCreate && (
              <Button type="button" onClick={() => setIsAddSheetOpen(true)}>
                <IconCircleDashedPlus className="mr-1.5 size-4" /> Add Record
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4 p-4 md:p-6">
          {/* Filters */}
          <div className="flex flex-col flex-wrap gap-3 lg:flex-row lg:items-end">
            {/* Global search */}
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search records..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 pl-9 text-sm"
              />
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            </div>

            {/* Cow Number */}
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Label className="whitespace-nowrap text-xs font-medium text-muted-foreground">Cow Number</Label>
              <div className="relative w-full sm:w-44">
                <Input
                  placeholder="Filter cow number..."
                  value={cowNumberFilter}
                  onChange={(e) => setCowNumberFilter(e.target.value)}
                  className="h-9 pr-8 text-sm"
                />
                {cowNumberFilter && (
                  <button
                    type="button"
                    onClick={() => setCowNumberFilter("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title="Clear cow number"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Purchase From Date */}
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Label className="whitespace-nowrap text-xs font-medium text-muted-foreground">Purchase From Date</Label>
              <div className="relative w-full sm:w-40">
                <Input
                  type="date"
                  value={purchaseDateFrom}
                  max={purchaseDateTo || undefined}
                  onChange={(e) => setPurchaseDateFrom(e.target.value)}
                  className="h-9 pr-8"
                />
                {purchaseDateFrom && (
                  <button
                    type="button"
                    onClick={() => setPurchaseDateFrom("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title="Clear from date"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* To Date */}
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Label className="whitespace-nowrap text-xs font-medium text-muted-foreground">To Date</Label>
              <div className="relative w-full sm:w-40">
                <Input
                  type="date"
                  value={purchaseDateTo}
                  min={purchaseDateFrom || undefined}
                  onChange={(e) => setPurchaseDateTo(e.target.value)}
                  className="h-9 pr-8"
                />
                {purchaseDateTo && (
                  <button
                    type="button"
                    onClick={() => setPurchaseDateTo("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    title="Clear to date"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {hasActiveFilter && (
              <Button type="button" variant="ghost" className="h-9 text-muted-foreground" onClick={clearFilters}>
                <X className="mr-1 size-4" /> Clear filters
              </Button>
            )}

            {/* Column toggle: desktop table only */}
            {!isPhone && (
              <div className="lg:ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="h-9 text-sm">
                      Columns <ChevronDown className="ml-1.5 size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((col) => col.getCanHide())
                      .map((col) => (
                        <DropdownMenuCheckboxItem
                          key={col.id}
                          className="text-sm capitalize"
                          checked={col.getIsVisible()}
                          onCheckedChange={(v) => col.toggleVisibility(!!v)}
                        >
                          {col.id.replace(/_/g, " ").toLowerCase()}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Table / phone list — this wrapper is the container-query target */}
          <div ref={bodyRef}>{renderBody()}</div>

          {/* Pagination (default for large data) */}
          {!isLoading && !isError && rows.length > 0 && (
            <div className="border-t border-border pt-3">
              <DataTablePagination table={table} />
            </div>
          )}
        </div>
      </div>

      {/* Sheets */}
      {isAddSheetOpen && (
        <AddCowProjectSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
      )}
      {isUpdateSheetOpen && (
        <UpdateCowProjectSheet
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