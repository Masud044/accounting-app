// // // import { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import {
// // //   flexRender,
// // //   getCoreRowModel,
// // //   getFilteredRowModel,
// // //   getPaginationRowModel,
// // //   getSortedRowModel,
// // //   useReactTable,
// // // } from "@tanstack/react-table";
// // // import {
// // //   ArrowUpDown,
// // //   ChevronDown,
// // //   Trash2,
// // //   AlertCircle,
// // //   RefreshCw,
// // //   Beef,
// // //   Eye,
// // // } from "lucide-react";
// // // import { toast } from "react-toastify";
// // // import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuCheckboxItem,
// // //   DropdownMenuContent,
// // //   DropdownMenuTrigger,
// // // } from "@/components/ui/dropdown-menu";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import { DataTablePagination } from "@/components/DataTablePagination";
// // // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // // import { Spinner } from "@/components/ui/spinner";
// // // import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// // // import { useCowProjects, useDeleteCowProject } from "./queries";
// // // import AddCowProjectSheet from "./add-cow-sheet";
// // // import UpdateCowProjectSheet from "./update-cow-sheet";

// // // // ── Date formatter — backend already sends 'YYYY-MM-DD' ─────────────────────
// // // const formatDate = (val) => {
// // //   if (!val) return "—";
// // //   const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
// // //   if (!isoMatch) return "—";
// // //   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// // //   const [, year, month, day] = isoMatch;
// // //   return `${day} ${months[Number(month) - 1]} ${year}`;
// // // };

// // // const fmtAmt = (v) =>
// // //   v === null || v === undefined
// // //     ? "—"
// // //     : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// // // export default function CowProjectList() {
// // //   const navigate = useNavigate();

// // //   const [sorting, setSorting] = useState([{ id: "ID", desc: true }]);
// // //   const [columnFilters, setColumnFilters] = useState([]);
// // //   const [columnVisibility, setColumnVisibility] = useState({});
// // //   const [rowSelection, setRowSelection] = useState({});
// // //   const [globalFilter, setGlobalFilter] = useState("");

// // //   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
// // //   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
// // //   const [selectedRecord, setSelectedRecord] = useState(null);

// // //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

// // //   const {
// // //     data: records = [],
// // //     isLoading,
// // //     isError,
// // //     error,
// // //     refetch,
// // //     isFetching,
// // //   } = useCowProjects();

// // //   const deleteMutation = useDeleteCowProject();

// // //   const handleEdit = (record) => {
// // //     setSelectedRecord(record);
// // //     setIsUpdateSheetOpen(true);
// // //   };

// // //   const handleViewDetail = (record) => {
// // //     navigate(`/dashboard/cow-project/${record.ID}`);
// // //   };

// // //   const handleDelete = async (record) => {
// // //     const confirmed = await showConfirmation({
// // //       title: "Delete record?",
// // //       description: `Are you sure you want to delete cow project #${record.ID}? This action cannot be undone.`,
// // //       confirmText: "Delete",
// // //       cancelText: "Cancel",
// // //       variant: "destructive",
// // //     });
// // //     if (confirmed) {
// // //       try {
// // //         await deleteMutation.mutateAsync(record.ID);
// // //         toast.success("Record deleted successfully!");
// // //       } catch (err) {
// // //         toast.error(err?.message || "Failed to delete record. Please try again.");
// // //       }
// // //     }
// // //   };

// // //   const columns = [
// // //     {
// // //       accessorKey: "COW_NUMBER",
// // //       header: ({ column }) => (
// // //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // //           Cow Number <ArrowUpDown className="ml-2 h-4 w-4" />
// // //         </Button>
// // //       ),
// // //       cell: ({ row }) => (
// // //         <div className=" tabular-nums ps-2">{row.getValue("COW_NUMBER")}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "PURCHASE_DATE",
// // //       header: "Purchase Date",
// // //       cell: ({ row }) => (
// // //         <div className="ps-2">{formatDate(row.getValue("PURCHASE_DATE"))}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "SELLING_DATE",
// // //       header: "Selling Date",
// // //       cell: ({ row }) => (
// // //         <div className="ps-2">{formatDate(row.getValue("SELLING_DATE"))}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "PURCHASE_AMT",
// // //       header: "Purchase Amt",
// // //       cell: ({ row }) => (
// // //         <div className="tabular-nums text-right pr-4">{fmtAmt(row.getValue("PURCHASE_AMT"))}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "SELLING_AMT",
// // //       header: "Selling Amt",
// // //       cell: ({ row }) => (
// // //         <div className="tabular-nums text-right pr-4">{fmtAmt(row.getValue("SELLING_AMT"))}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "WEIGHT",
// // //       header: "Weight",
// // //       cell: ({ row }) => (
// // //         <div className="tabular-nums">{row.getValue("WEIGHT") ?? "—"}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "STATUS",
// // //       header: "Status",
// // //       cell: ({ row }) => {
// // //         const active = Number(row.getValue("STATUS")) === 1;
// // //         return (
// // //           <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
// // //             active
// // //               ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
// // //               : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
// // //           }`}>
// // //             {active ? "Active" : "Inactive"}
// // //           </span>
// // //         );
// // //       },
// // //     },
// // //     {
// // //       id: "actions",
// // //       header: "Actions",
// // //       enableHiding: false,
// // //       cell: ({ row }) => {
// // //         const record = row.original;
// // //         return (
// // //           <div className="flex items-center gap-1">
// // //             <Button
// // //               variant="ghost"
// // //               size="icon"
// // //               className="h-8 w-8"
// // //               onClick={() => handleViewDetail(record)}
// // //             >
// // //               <Eye className="h-4 w-4" />
// // //               <span className="sr-only">View Detail</span>
// // //             </Button>
// // //             <Button
// // //               variant="ghost"
// // //               size="icon"
// // //               className="h-8 w-8"
// // //               onClick={() => handleEdit(record)}
// // //             >
// // //               <IconEdit className="h-4 w-4" />
// // //               <span className="sr-only">Edit</span>
// // //             </Button>
// // //             <Button
// // //               variant="ghost"
// // //               size="icon"
// // //               className="h-8 w-8 text-destructive hover:text-destructive"
// // //               onClick={() => handleDelete(record)}
// // //               disabled={deleteMutation.isPending}
// // //             >
// // //               {deleteMutation.isPending
// // //                 ? <Spinner className="h-4 w-4" />
// // //                 : <Trash2 className="h-4 w-4" />}
// // //               <span className="sr-only">Delete</span>
// // //             </Button>
// // //           </div>
// // //         );
// // //       },
// // //     },
// // //   ];

// // //   const table = useReactTable({
// // //     data: records,
// // //     columns,
// // //     onSortingChange: setSorting,
// // //     onColumnFiltersChange: setColumnFilters,
// // //     getCoreRowModel: getCoreRowModel(),
// // //     getPaginationRowModel: getPaginationRowModel(),
// // //     getSortedRowModel: getSortedRowModel(),
// // //     getFilteredRowModel: getFilteredRowModel(),
// // //     onColumnVisibilityChange: setColumnVisibility,
// // //     onRowSelectionChange: setRowSelection,
// // //     onGlobalFilterChange: setGlobalFilter,
// // //     state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
// // //   });

// // //   // ── Loading ──────────────────────────────────────────────────────────────────
// // //   if (isLoading) {
// // //     return (
// // //       <div>
// // //         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
// // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Cow Project</h1>
// // //             <Button disabled><IconCircleDashedPlus className="mr-1" />Add Record</Button>
// // //           </div>
// // //         </div>
// // //         <div className="bg-card rounded-lg shadow-sm p-4">
// // //           <div className="flex flex-col items-center justify-center py-16">
// // //             <Spinner className="h-12 w-12 mb-4" />
// // //             <p className="text-muted-foreground">Loading cow project records...</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ── Error ────────────────────────────────────────────────────────────────────
// // //   if (isError) {
// // //     return (
// // //       <div>
// // //         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
// // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Cow Project</h1>
// // //             <Button onClick={() => setIsAddSheetOpen(true)}>
// // //               <IconCircleDashedPlus className="mr-1" />Add Record
// // //             </Button>
// // //           </div>
// // //         </div>
// // //         <div className="bg-card rounded-lg shadow-sm p-4">
// // //           <Alert variant="destructive">
// // //             <AlertCircle className="h-4 w-4" />
// // //             <AlertTitle>Error Loading Records</AlertTitle>
// // //             <AlertDescription className="mt-2 flex flex-col gap-2">
// // //               <p>{error?.message || "Failed to load cow project records."}</p>
// // //               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
// // //                 {isFetching
// // //                   ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
// // //                   : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
// // //               </Button>
// // //             </AlertDescription>
// // //           </Alert>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ── Main ─────────────────────────────────────────────────────────────────────
// // //   return (
// // //     <div>
// // //       {/* Header */}
// // //       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
// // //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //           <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Cow Project</h1>
// // //           <div className="flex items-center gap-2">
// // //             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
// // //               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
// // //               <span className="sr-only">Refresh</span>
// // //             </Button>
// // //             <Button onClick={() => setIsAddSheetOpen(true)}>
// // //               <IconCircleDashedPlus className="mr-1" />Add Record
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Table */}
// // //       <div className="bg-card rounded-md shadow-sm p-4">
// // //         <div className="space-y-4">
// // //           <div className="flex flex-col sm:flex-row gap-4">
// // //             <Input
// // //               placeholder="Search records..."
// // //               value={globalFilter ?? ""}
// // //               onChange={(e) => setGlobalFilter(e.target.value)}
// // //               className="max-w-sm"
// // //             />
// // //             <DropdownMenu>
// // //               <DropdownMenuTrigger asChild>
// // //                 <Button variant="outline" className="ml-auto">
// // //                   Columns <ChevronDown className="ml-2 h-4 w-4" />
// // //                 </Button>
// // //               </DropdownMenuTrigger>
// // //               <DropdownMenuContent align="end">
// // //                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
// // //                   <DropdownMenuCheckboxItem
// // //                     key={col.id}
// // //                     className="capitalize"
// // //                     checked={col.getIsVisible()}
// // //                     onCheckedChange={(v) => col.toggleVisibility(!!v)}
// // //                   >
// // //                     {col.id.replace(/_/g, " ").toLowerCase()}
// // //                   </DropdownMenuCheckboxItem>
// // //                 ))}
// // //               </DropdownMenuContent>
// // //             </DropdownMenu>
// // //           </div>

// // //           <div className="overflow-hidden rounded-md border">
// // //             <Table>
// // //               <TableHeader>
// // //                 {table.getHeaderGroups().map((hg) => (
// // //                   <TableRow key={hg.id}>
// // //                     {hg.headers.map((h) => (
// // //                       <TableHead key={h.id}>
// // //                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// // //                       </TableHead>
// // //                     ))}
// // //                   </TableRow>
// // //                 ))}
// // //               </TableHeader>
// // //               <TableBody>
// // //                 {table.getRowModel().rows?.length ? (
// // //                   table.getRowModel().rows.map((row) => (
// // //                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
// // //                       {row.getVisibleCells().map((cell) => (
// // //                         <TableCell key={cell.id}>
// // //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
// // //                         </TableCell>
// // //                       ))}
// // //                     </TableRow>
// // //                   ))
// // //                 ) : (
// // //                   <TableRow>
// // //                     <TableCell colSpan={columns.length} className="h-24 text-center">
// // //                       <Empty>
// // //                         <EmptyHeader>
// // //                           <EmptyMedia variant="icon"><Beef /></EmptyMedia>
// // //                           <EmptyTitle>No Records Found</EmptyTitle>
// // //                         </EmptyHeader>
// // //                       </Empty>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 )}
// // //               </TableBody>
// // //             </Table>
// // //           </div>
// // //           <DataTablePagination table={table} />
// // //         </div>
// // //       </div>

// // //       {/* Sheets */}
// // //       {isAddSheetOpen && (
// // //         <AddCowProjectSheet
// // //           open={isAddSheetOpen}
// // //           onOpenChange={setIsAddSheetOpen}
// // //           showConfirmation={showConfirmation}
// // //         />
// // //       )}
// // //       {isUpdateSheetOpen && (
// // //         <UpdateCowProjectSheet
// // //           open={isUpdateSheetOpen}
// // //           onOpenChange={setIsUpdateSheetOpen}
// // //           showConfirmation={showConfirmation}
// // //           record={selectedRecord}
// // //         />
// // //       )}
// // //       <ConfirmationDialog />
// // //     </div>
// // //   );
// // // }

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
// //       // cell: ({ row }) => {
// //       //   const record = row.original;
// //       //   return (
// //       //     <div className="flex items-center justify-end gap-1">
// //       //       <Tooltip>
// //       //         <TooltipTrigger asChild>
// //       //           <Button
// //       //             variant="ghost"
// //       //             size="icon"
// //       //             className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
// //       //             onClick={() => handleViewDetail(record)}
// //       //           >
// //       //             <Eye className="h-4 w-4" />
// //       //             <span className="sr-only">View Detail</span>
// //       //           </Button>
// //       //         </TooltipTrigger>
// //       //         <TooltipContent>View Details</TooltipContent>
// //       //       </Tooltip>

// //       //       <Tooltip>
// //       //         <TooltipTrigger asChild>
// //       //           <Button
// //       //             variant="ghost"
// //       //             size="icon"
// //       //             className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
// //       //             onClick={() => handleEdit(record)}
// //       //           >
// //       //             <IconEdit className="h-4 w-4" />
// //       //             <span className="sr-only">Edit</span>
// //       //           </Button>
// //       //         </TooltipTrigger>
// //       //         <TooltipContent>Edit</TooltipContent>
// //       //       </Tooltip>

// //       //       <Tooltip>
// //       //         <TooltipTrigger asChild>
// //       //           <Button
// //       //             variant="ghost"
// //       //             size="icon"
// //       //             className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-gray-400"
// //       //             onClick={() => handleDelete(record)}
// //       //             disabled={deleteMutation.isPending}
// //       //           >
// //       //             {deleteMutation.isPending
// //       //               ? <Spinner className="h-4 w-4" />
// //       //               : <Trash2 className="h-4 w-4" />}
// //       //             <span className="sr-only">Delete</span>
// //       //           </Button>
// //       //         </TooltipTrigger>
// //       //         <TooltipContent>Delete</TooltipContent>
// //       //       </Tooltip>
// //       //     </div>
// //       //   );
// //       // },

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

// //       <Tooltip>
// //         <TooltipTrigger asChild>
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
// //             onClick={() => handleEdit(record)}
// //           >
// //             <IconEdit className="h-4 w-4" />
// //             <span className="sr-only">Edit</span>
// //           </Button>
// //         </TooltipTrigger>
// //         <TooltipContent>{active ? "Edit" : "View (read-only)"}</TooltipContent>
// //       </Tooltip>

// //       <Tooltip>
// //         <TooltipTrigger asChild>
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className={`h-8 w-8 text-gray-400 ${active ? "hover:bg-red-50 hover:text-red-600" : "opacity-30 cursor-not-allowed"}`}
// //             onClick={() => active && handleDelete(record)}
// //             disabled={!active || deleteMutation.isPending}
// //           >
// //             {deleteMutation.isPending
// //               ? <Spinner className="h-4 w-4" />
// //               : <Trash2 className="h-4 w-4" />}
// //             <span className="sr-only">Delete</span>
// //           </Button>
// //         </TooltipTrigger>
// //         <TooltipContent>{active ? "Delete" : "Inactive — cannot delete"}</TooltipContent>
// //       </Tooltip>
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
// //               <Button onClick={() => setIsAddSheetOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
// //                 <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
// //               </Button>
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
// //             <Button onClick={() => setIsAddSheetOpen(true)} >
// //               <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
// //             </Button>
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
// import { useState } from "react";
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
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
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

// const formatDate = (val) => {
//   if (!val) return "—";
//   const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
//   if (!isoMatch) return "—";
//   const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//   const [, year, month, day] = isoMatch;
//   return `${day} ${months[Number(month) - 1]} ${year}`;
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

//      cell: ({ row }) => {
//   const record = row.original;
//   const active = Number(record.STATUS) === 1;
//   return (
//     <div className="flex items-center justify-end gap-1">
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
//             onClick={() => handleViewDetail(record)}
//           >
//             <Eye className="h-4 w-4" />
//             <span className="sr-only">View Detail</span>
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>View Details</TooltipContent>
//       </Tooltip>

//       {canEdit && (
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
//               onClick={() => handleEdit(record)}
//             >
//               <IconEdit className="h-4 w-4" />
//               <span className="sr-only">Edit</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>{active ? "Edit" : "View (read-only)"}</TooltipContent>
//         </Tooltip>
//       )}

//       {canDelete && (
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className={`h-8 w-8 text-gray-400 ${active ? "hover:bg-red-50 hover:text-red-600" : "opacity-30 cursor-not-allowed"}`}
//               onClick={() => active && handleDelete(record)}
//               disabled={!active || deleteMutation.isPending}
//             >
//               {deleteMutation.isPending
//                 ? <Spinner className="h-4 w-4" />
//                 : <Trash2 className="h-4 w-4" />}
//               <span className="sr-only">Delete</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>{active ? "Delete" : "Inactive — cannot delete"}</TooltipContent>
//         </Tooltip>
//       )}
//     </div>
//   );
// },
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
//                 {records.length} {records.length === 1 ? "record" : "records"} found
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
//               <Button onClick={() => setIsAddSheetOpen(true)} >
//                 <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Filters */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="relative flex-1 max-w-sm">
//               <Input
//                 placeholder="Search records..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="h-9 bg-white border-gray-200 pl-9 text-sm"
//               />
//               <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
//             <div className="ml-auto">
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
//                         <p className="text-sm font-medium text-gray-500">No Records Found</p>
//                         <p className="text-xs text-gray-400">Click "Add Record" to create a new entry</p>
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

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Beef,
  Eye,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Backend sends 'YYYY-MM-DD' — normalize to that for filtering
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

const fmtAmt = (v) =>
  v === null || v === undefined
    ? "—"
    : Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CowProjectList() {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([{ id: "ID", desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // ── Filters: Cow Number (search) + Purchase Date (range) ──
  const [cowNumberFilter, setCowNumberFilter] = useState("");
  const [purchaseDateFrom, setPurchaseDateFrom] = useState("");
  const [purchaseDateTo, setPurchaseDateTo] = useState("");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("COW_PROJECT_CREATE");
  const canEdit = useHasPermission("COW_PROJECT_EDIT");
  const canDelete = useHasPermission("COW_PROJECT_DELETE");

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCowProjects();

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

  const hasActiveFilter = cowNumberFilter.trim() !== "" || purchaseDateFrom || purchaseDateTo;

  const clearFilters = () => {
    setCowNumberFilter("");
    setPurchaseDateFrom("");
    setPurchaseDateTo("");
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleViewDetail = (record) => {
    navigate(`/dashboard/cow-project/${record.ID}`);
  };

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

  const columns = [
    {
      accessorKey: "COW_NUMBER",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="h-8 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cow Number <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold text-gray-900">
          {row.getValue("COW_NUMBER")}
        </div>
      ),
    },
    {
      accessorKey: "PURCHASE_DATE",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">{formatDate(row.getValue("PURCHASE_DATE"))}</div>
      ),
    },
    {
      accessorKey: "SELLING_DATE",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling/Death Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">{formatDate(row.getValue("SELLING_DATE"))}</div>
      ),
    },
    {
      accessorKey: "PURCHASE_AMT",
      header: () => (
        <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Amt</div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm text-gray-700">{fmtAmt(row.getValue("PURCHASE_AMT"))}</div>
      ),
    },
    {
      accessorKey: "SELLING_AMT",
      header: () => (
        <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling Amt</div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm font-semibold text-gray-900">{fmtAmt(row.getValue("SELLING_AMT"))}</div>
      ),
    },
    {
      accessorKey: "WEIGHT",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</div>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-600">{row.getValue("WEIGHT") ?? "—"}</div>
      ),
    },
    {
      accessorKey: "STATUS",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
      ),
      cell: ({ row }) => {
        const active = Number(row.getValue("STATUS")) === 1;
        return (
          <Badge className={active
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-gray-100 text-gray-600 border-gray-200"
          }>
            {active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        const active = Number(record.STATUS) === 1;
        return (
          <div className="flex items-center justify-end gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
                  onClick={() => handleViewDetail(record)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View Detail</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>

            {canEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => handleEdit(record)}
                  >
                    <IconEdit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{active ? "Edit" : "View (read-only)"}</TooltipContent>
              </Tooltip>
            )}

            {canDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 text-gray-400 ${active ? "hover:bg-red-50 hover:text-red-600" : "opacity-30 cursor-not-allowed"}`}
                    onClick={() => active && handleDelete(record)}
                    disabled={!active || deleteMutation.isPending}
                  >
                    {deleteMutation.isPending
                      ? <Spinner className="h-4 w-4" />
                      : <Trash2 className="h-4 w-4" />}
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{active ? "Delete" : "Inactive — cannot delete"}</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
                <Beef size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
                <p className="text-xs text-gray-400">Loading records...</p>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 text-emerald-600 mb-4" />
            <p className="text-sm text-gray-400">Loading cow project records...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
                  <Beef size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
                  <p className="text-xs text-gray-400">Error loading records</p>
                </div>
              </div>
              {canCreate && (
                <Button onClick={() => setIsAddSheetOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
                </Button>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error Loading Records</h4>
                  <p className="text-sm text-red-600 mt-1">{error?.message || "Failed to load cow project records."}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {isFetching ? (
                      <>
                        <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Retry
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm">
              <Beef size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Cow Project</h2>
              <p className="text-xs text-gray-400">
                {filteredRecords.length} of {records.length} {records.length === 1 ? "record" : "records"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-gray-200 bg-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {canCreate && (
              <Button onClick={() => setIsAddSheetOpen(true)}>
                <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Record
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-3 flex-wrap">
            {/* Global search */}
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search records..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-9 bg-white border-gray-200 pl-9 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Cow Number (search) */}
           {/* Cow Number */}
<div className="flex items-center gap-2 w-full sm:w-auto">
  <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Cow Number</Label>
  <div className="relative w-full sm:w-44">
    <Input
      placeholder="Filter cow number..."
      value={cowNumberFilter}
      onChange={(e) => setCowNumberFilter(e.target.value)}
      className="h-9 bg-white border-gray-200 pr-8 text-sm focus-visible:ring-1 focus-visible:ring-emerald-300"
    />
    {cowNumberFilter && (
      <button
        type="button"
        onClick={() => setCowNumberFilter("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        title="Clear cow number"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
</div>

{/* Purchase From Date */}
<div className="flex items-center gap-2 w-full sm:w-auto">
  <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">Purchase From Date</Label>
  <div className="relative w-full sm:w-40">
    <Input
      type="date"
      value={purchaseDateFrom}
      max={purchaseDateTo || undefined}
      onChange={(e) => setPurchaseDateFrom(e.target.value)}
      className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-300"
    />
    {purchaseDateFrom && (
      <button
        type="button"
        onClick={() => setPurchaseDateFrom("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
        title="Clear from date"
      >
        ✕
      </button>
    )}
  </div>
</div>

{/* To Date */}
<div className="flex items-center gap-2 w-full sm:w-auto">
  <Label className="text-xs font-medium text-gray-500 whitespace-nowrap">To Date</Label>
  <div className="relative w-full sm:w-40">
    <Input
      type="date"
      value={purchaseDateTo}
      min={purchaseDateFrom || undefined}
      onChange={(e) => setPurchaseDateTo(e.target.value)}
      className="h-9 pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-emerald-300"
    />
    {purchaseDateTo && (
      <button
        type="button"
        onClick={() => setPurchaseDateTo("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
        title="Clear to date"
      >
        ✕
      </button>
    )}
  </div>
</div>

            {hasActiveFilter && (
              <Button
                variant="ghost"
                className="h-9 text-gray-500 hover:text-gray-800"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" /> Clear filters
              </Button>
            )}

            <div className="lg:ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 border-gray-200 bg-white text-sm">
                    Columns <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
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
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="py-2.5">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-2.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Beef className="h-10 w-10 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">
                          {hasActiveFilter ? "No records match the selected filters" : "No Records Found"}
                        </p>
                        {!hasActiveFilter && (
                          <p className="text-xs text-gray-400">Click "Add Record" to create a new entry</p>
                        )}
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

      {/* Sheets */}
      {isAddSheetOpen && (
        <AddCowProjectSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
        />
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