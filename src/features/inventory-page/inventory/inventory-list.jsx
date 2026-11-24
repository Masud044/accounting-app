
// // // import { useState, useMemo } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import {
// // //   flexRender, getCoreRowModel, getFilteredRowModel,
// // //   getPaginationRowModel, getSortedRowModel, useReactTable,
// // // } from "@tanstack/react-table";
// // // import { ArrowUpDown, Trash2, AlertCircle, RefreshCw, ArchiveIcon, Search } from "lucide-react";
// // // import { toast } from "sonner";
// // // import { format } from "date-fns";
// // // import { Button } from "@/components/ui/button";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import {
// // //   DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
// // // } from "@/components/ui/dropdown-menu";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import {
// // //   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// // // } from "@/components/ui/table";
// // // import { Badge } from "@/components/ui/badge";
// // // import { DataTablePagination } from "@/components/DataTablePagination";
// // // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // // import { Spinner } from "@/components/ui/spinner";
// // // import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// // // import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// // // import { useInventories, useDeleteInventory } from "./queries";

// // // // Reusable sortable header — consistent uppercase gray style
// // // const SortableHeader = ({ column, label }) => (
// // //   <Button
// // //     variant="ghost"
// // //     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
// // //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
// // //   >
// // //     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
// // //   </Button>
// // // );

// // // export default function InventoryList() {
// // //   const navigate = useNavigate();

// // //   const [sorting, setSorting] = useState([]);
// // //   const [columnFilters, setColumnFilters] = useState([]);
// // //   const [columnVisibility, setColumnVisibility] = useState({});
// // //   const [rowSelection, setRowSelection] = useState({});
// // //   const [globalFilter, setGlobalFilter] = useState("");
// // //   const [storeFilter, setStoreFilter] = useState("all");

// // //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
// // //   const { data: inventories = [], isLoading, isError, error, refetch, isFetching } = useInventories();
// // //   const deleteMutation = useDeleteInventory();

// // //   // ── Unique store names for the filter dropdown ────────────────────────────
// // //   const storeOptions = useMemo(() => {
// // //     const stores = new Set(
// // //       inventories.map((r) => r.STORE_NAME).filter((s) => s && String(s).trim())
// // //     );
// // //     return Array.from(stores).sort();
// // //   }, [inventories]);

// // //   // ── Apply store filter before passing data to the table ──────────────────
// // //   const filteredInventories = useMemo(() => {
// // //     if (storeFilter === "all") return inventories;
// // //     return inventories.filter((r) => r.STORE_NAME === storeFilter);
// // //   }, [inventories, storeFilter]);

// // //   const handleEdit = (inv) => {
// // //     navigate(`/dashboard/inventory-edit/${inv.HID}`);
// // //   };

// // //   const handleDelete = async (inv) => {
// // //     const confirmed = await showConfirmation({
// // //       title: "Delete GRN record?",
// // //       description: `GRN ${inv.GRN_NO} — ${inv.ITEM_COUNT} item(s) shoho delete hobe. Are you sure?`,
// // //       confirmText: "Delete",
// // //       cancelText: "Cancel",
// // //       variant: "destructive",
// // //     });
// // //     if (confirmed) {
// // //       try {
// // //         await deleteMutation.mutateAsync(inv.HID);
// // //         toast.success("Inventory GRN deleted successfully!");
// // //       } catch (err) {
// // //         toast.error(err?.message || "Failed to delete. Please try again.");
// // //       }
// // //     }
// // //   };

// // //   const columns = [
// // //     {
// // //       id: "select",
// // //       header: ({ table }) => (
// // //         <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} />
// // //       ),
// // //       cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />,
// // //       enableSorting: false, enableHiding: false,
// // //     },
// // //     {
// // //       accessorKey: "GRN_NO",
// // //       header: ({ column }) => <SortableHeader column={column} label="GRN No" />,
// // //       cell: ({ row }) => (
// // //         <div className="ml-3 flex items-center gap-2">
// // //           <Badge variant="outline" className="font-mono text-xs bg-white border-gray-200 text-gray-600">
// // //             {row.getValue("GRN_NO") || "—"}
// // //           </Badge>
// // //           {Number(row.original.PAYMENT_CREATED) === 1 && (
// // //             <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
// // //               Payment
// // //             </span>
// // //           )}
// // //         </div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "PO_NO",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PO No</div>
// // //       ),
// // //       cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("PO_NO") || "—"}</div>,
// // //     },
// // //     {
// // //       accessorKey: "STORE_NAME",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Store Name</div>
// // //       ),
// // //       cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("STORE_NAME") ?? "—"}</div>,
// // //     },
// // //     {
// // //       accessorKey: "INV_DATE",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inv Date</div>
// // //       ),
// // //       cell: ({ row }) => {
// // //         const val = row.getValue("INV_DATE");
// // //         return <div className="text-sm text-gray-600">{val ? format(new Date(val), "dd MMM yyyy") : "—"}</div>;
// // //       },
// // //     },
// // //     {
// // //       accessorKey: "ITEM_COUNT",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Items</div>
// // //       ),
// // //       cell: ({ row }) => <div className="text-sm font-medium text-gray-800 text-center">{row.getValue("ITEM_COUNT") ?? 0}</div>,
// // //     },
// // //     {
// // //       accessorKey: "TOTAL_QTY",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Qty</div>
// // //       ),
// // //       cell: ({ row }) => <div className="text-sm font-medium text-gray-800">{row.getValue("TOTAL_QTY") ?? "—"}</div>,
// // //     },
// // //     {
// // //       accessorKey: "CREATION_DATE",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</div>
// // //       ),
// // //       cell: ({ row }) => {
// // //         const val = row.getValue("CREATION_DATE");
// // //         return <div className="text-xs text-gray-400">{val ? format(new Date(val), "dd MMM yyyy, h:mm a") : "—"}</div>;
// // //       },
// // //     },
// // //     {
// // //       id: "actions",
// // //       header: () => (
// // //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
// // //       ),
// // //       enableHiding: false,
// // //       cell: ({ row }) => {
// // //         const inv = row.original;
// // //         return (
// // //           <div className="flex items-center gap-2">
// // //             <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700" onClick={() => handleEdit(inv)}>
// // //               <IconEdit className="h-4 w-4" />
// // //               <span className="sr-only">Edit</span>
// // //             </Button>
// // //             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(inv)} disabled={deleteMutation.isPending}>
// // //               {deleteMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
// // //               <span className="sr-only">Delete</span>
// // //             </Button>
// // //           </div>
// // //         );
// // //       },
// // //     },
// // //   ];

// // //   const table = useReactTable({
// // //     data: filteredInventories,
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

// // //   if (isLoading) {
// // //     return (
// // //       <div className="p-4 md:p-6">
// // //         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
// // //           <div className="flex flex-col items-center justify-center py-16">
// // //             <Spinner className="h-10 w-10 mb-3" />
// // //             <p className="text-sm text-gray-500">Loading inventories...</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (isError) {
// // //     return (
// // //       <div className="p-4 md:p-6">
// // //         <Alert variant="destructive">
// // //           <AlertCircle className="h-4 w-4" />
// // //           <AlertTitle>Error Loading Inventories</AlertTitle>
// // //           <AlertDescription className="mt-2 flex flex-col gap-2">
// // //             <p>{error?.message || "Failed to load inventories."}</p>
// // //             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
// // //               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
// // //             </Button>
// // //           </AlertDescription>
// // //         </Alert>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-4 md:p-6">
// // //       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
// // //         {/* Header */}
// // //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
// // //           <div className="flex items-center gap-2">
// // //             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
// // //               <ArchiveIcon size={16} />
// // //             </div>
// // //             <div>
// // //               <h2 className="text-sm font-bold text-gray-900">Inventory</h2>
// // //               <p className="text-xs text-gray-400">{filteredInventories.length} of {inventories.length} records</p>
// // //             </div>
// // //           </div>
// // //           <div className="flex items-center gap-2">
// // //             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
// // //               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
// // //               <span className="sr-only">Refresh</span>
// // //             </Button>
// // //             <Button onClick={() => navigate("/dashboard/inventory-create")}>
// // //               <IconCircleDashedPlus className="mr-1" />Add Inventory
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         <div className="p-5 space-y-4">
// // //           {/* Search + Store Name filter + Column visibility — all in one row */}
// // //           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
// // //             <div className="relative max-w-sm w-full">
// // //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// // //               <Input
// // //                 placeholder="Search by GRN, PO, store..."
// // //                 value={globalFilter ?? ""}
// // //                 onChange={(e) => setGlobalFilter(e.target.value)}
// // //                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// // //               />
// // //             </div>

// // //             <div className="flex flex-col gap-1.5 w-full sm:w-48">
// // //               <Select value={storeFilter} onValueChange={setStoreFilter}>
// // //                 <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-violet-300">
// // //                   <SelectValue placeholder="All stores" />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   <SelectItem value="all">All Stores</SelectItem>
// // //                   {storeOptions.map((store) => (
// // //                     <SelectItem key={store} value={store}>
// // //                       {store}
// // //                     </SelectItem>
// // //                   ))}
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>

// // //             <DropdownMenu>
// // //               <DropdownMenuTrigger asChild>
// // //                 <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
// // //                   Columns
// // //                 </Button>
// // //               </DropdownMenuTrigger>
// // //               <DropdownMenuContent align="end">
// // //                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
// // //                   <DropdownMenuCheckboxItem key={col.id} className="capitalize" checked={col.getIsVisible()} onCheckedChange={(v) => col.toggleVisibility(!!v)}>
// // //                     {col.id.replace(/_/g, " ").toLowerCase()}
// // //                   </DropdownMenuCheckboxItem>
// // //                 ))}
// // //               </DropdownMenuContent>
// // //             </DropdownMenu>
// // //           </div>

// // //           {/* Table */}
// // //           <div className="overflow-hidden rounded-md border border-gray-200">
// // //             <Table>
// // //               <TableHeader className="bg-gray-50">
// // //                 {table.getHeaderGroups().map((hg) => (
// // //                   <TableRow key={hg.id}>
// // //                     {hg.headers.map((h) => (
// // //                       <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
// // //                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// // //                       </TableHead>
// // //                     ))}
// // //                   </TableRow>
// // //                 ))}
// // //               </TableHeader>
// // //               <TableBody>
// // //                 {table.getRowModel().rows?.length ? (
// // //                   table.getRowModel().rows.map((row) => (
// // //                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
// // //                       {row.getVisibleCells().map((cell) => (
// // //                         <TableCell key={cell.id} className="text-sm text-gray-700">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
// // //                       ))}
// // //                     </TableRow>
// // //                   ))
// // //                 ) : (
// // //                   <TableRow>
// // //                     <TableCell colSpan={columns.length} className="h-24 text-center">
// // //                       <Empty>
// // //                         <EmptyHeader>
// // //                           <EmptyMedia variant="icon"><ArchiveIcon /></EmptyMedia>
// // //                           <EmptyTitle>No Inventory Records Found</EmptyTitle>
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

// // //       <ConfirmationDialog />
// // //     </div>
// // //   );
// // // }

// import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   flexRender, getCoreRowModel, getFilteredRowModel,
//   getPaginationRowModel, getSortedRowModel, useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, Trash2, AlertCircle, RefreshCw, ArchiveIcon, Search } from "lucide-react";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
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
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import { useHasPermission } from "@/hooks/use-permission";

// import { useInventories, useDeleteInventory } from "./queries";

// // Reusable sortable header — consistent uppercase gray style
// const SortableHeader = ({ column, label }) => (
//   <Button
//     variant="ghost"
//     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
//     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//   >
//     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
//   </Button>
// );

// export default function InventoryList() {
//   const navigate = useNavigate();

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [storeFilter, setStoreFilter] = useState("all");

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("INVENTORY_CREATE");
//   const canEdit = useHasPermission("INVENTORY_EDIT");
//   const canDelete = useHasPermission("INVENTORY_DELETE");

//   const { data: inventories = [], isLoading, isError, error, refetch, isFetching } = useInventories();
//   const deleteMutation = useDeleteInventory();

//   // ── Unique store names for the filter dropdown ────────────────────────────
//   const storeOptions = useMemo(() => {
//     const stores = new Set(
//       inventories.map((r) => r.STORE_NAME).filter((s) => s && String(s).trim())
//     );
//     return Array.from(stores).sort();
//   }, [inventories]);

//   // ── Apply store filter before passing data to the table ──────────────────
//   const filteredInventories = useMemo(() => {
//     if (storeFilter === "all") return inventories;
//     return inventories.filter((r) => r.STORE_NAME === storeFilter);
//   }, [inventories, storeFilter]);

//   const handleEdit = (inv) => {
//     navigate(`/dashboard/inventory-edit/${inv.HID}`);
//   };

//   const handleDelete = async (inv) => {
//     const confirmed = await showConfirmation({
//       title: "Delete GRN record?",
//       description: `GRN ${inv.GRN_NO} — ${inv.ITEM_COUNT} item(s) shoho delete hobe. Are you sure?`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });
//     if (confirmed) {
//       try {
//         await deleteMutation.mutateAsync(inv.HID);
//         toast.success("Inventory GRN deleted successfully!");
//       } catch (err) {
//         toast.error(err?.message || "Failed to delete. Please try again.");
//       }
//     }
//   };

//   const columns = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} />
//       ),
//       cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />,
//       enableSorting: false, enableHiding: false,
//     },
//     {
//       accessorKey: "GRN_NO",
//       header: ({ column }) => <SortableHeader column={column} label="GRN No" />,
//       cell: ({ row }) => (
//         <div className="ml-3 flex items-center gap-2">
//           <Badge variant="outline" className="font-mono text-xs bg-white border-gray-200 text-gray-600">
//             {row.getValue("GRN_NO") || "—"}
//           </Badge>
//           {Number(row.original.PAYMENT_CREATED) === 1 && (
//             <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
//               Payment
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "PO_NO",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PO No</div>
//       ),
//       cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("PO_NO") || "—"}</div>,
//     },
//     {
//       accessorKey: "STORE_NAME",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Store Name</div>
//       ),
//       cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("STORE_NAME") ?? "—"}</div>,
//     },
//     {
//       accessorKey: "INV_DATE",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inv Date</div>
//       ),
//       cell: ({ row }) => {
//         const val = row.getValue("INV_DATE");
//         return <div className="text-sm text-gray-600">{val ? format(new Date(val), "dd MMM yyyy") : "—"}</div>;
//       },
//     },
//     {
//       accessorKey: "ITEM_COUNT",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Items</div>
//       ),
//       cell: ({ row }) => <div className="text-sm font-medium text-gray-800 text-center">{row.getValue("ITEM_COUNT") ?? 0}</div>,
//     },
//     {
//       accessorKey: "TOTAL_QTY",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Qty</div>
//       ),
//       cell: ({ row }) => <div className="text-sm font-medium text-gray-800">{row.getValue("TOTAL_QTY") ?? "—"}</div>,
//     },
//     {
//       accessorKey: "CREATION_DATE",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</div>
//       ),
//       cell: ({ row }) => {
//         const val = row.getValue("CREATION_DATE");
//         return <div className="text-xs text-gray-400">{val ? format(new Date(val), "dd MMM yyyy, h:mm a") : "—"}</div>;
//       },
//     },
//     {
//       id: "actions",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
//       ),
//       enableHiding: false,
//       cell: ({ row }) => {
//         const inv = row.original;
//         return (
//           <div className="flex items-center gap-2">
//             {canEdit && (
//               <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700" onClick={() => handleEdit(inv)}>
//                 <IconEdit className="h-4 w-4" />
//                 <span className="sr-only">Edit</span>
//               </Button>
//             )}
//             {canDelete && (
//               <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(inv)} disabled={deleteMutation.isPending}>
//                 {deleteMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
//                 <span className="sr-only">Delete</span>
//               </Button>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: filteredInventories,
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
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 mb-3" />
//             <p className="text-sm text-gray-500">Loading inventories...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-4 md:p-6">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Inventories</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load inventories."}</p>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
//               <ArchiveIcon size={16} />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">Inventory</h2>
//               <p className="text-xs text-gray-400">{filteredInventories.length} of {inventories.length} records</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             {canCreate && (
//               <Button onClick={() => navigate("/dashboard/inventory-create")}>
//                 <IconCircleDashedPlus className="mr-1" />Add Inventory
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Search + Store Name filter + Column visibility — all in one row */}
//           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//             <div className="relative max-w-sm w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by GRN, PO, store..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5 w-full sm:w-48">
//               <Select value={storeFilter} onValueChange={setStoreFilter}>
//                 <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-violet-300">
//                   <SelectValue placeholder="All stores" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Stores</SelectItem>
//                   {storeOptions.map((store) => (
//                     <SelectItem key={store} value={store}>
//                       {store}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
//                   Columns
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
//                   <DropdownMenuCheckboxItem key={col.id} className="capitalize" checked={col.getIsVisible()} onCheckedChange={(v) => col.toggleVisibility(!!v)}>
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
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="text-sm text-gray-700">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <Empty>
//                         <EmptyHeader>
//                           <EmptyMedia variant="icon"><ArchiveIcon /></EmptyMedia>
//                           <EmptyTitle>No Inventory Records Found</EmptyTitle>
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
  ArrowDown, ArrowUp, ChevronDown, Trash2, AlertCircle, RefreshCw, ArchiveIcon, Search,
} from "lucide-react";
import { toast } from "sonner";
import { format, isValid } from "date-fns";
import { create } from "zustand";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useHasPermission } from "@/hooks/use-permission";

import { useInventories, useDeleteInventory } from "./queries";

// ── Table design constants (table-design skill) ──────────────────────────────
const PHONE_BREAKPOINT = 800;      // pinned + 3 scrolling cols (~115px each) ≈ 800px
const PAGE_CHROME = "12rem";       // header + toolbar above the table (adjust)
// Solid (not translucent) so pinned cells stay opaque while scrolling.
// Order of strength: hover (gray-50) < selected (gray-100) < active (violet-100).
const ACTIVE_BG = "bg-violet-100";
const SELECTED_BG = "bg-gray-100";

// ── Active row store: one id at a time, same id again clears ─────────────────
// (separate from checkbox selection)
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
}));

// Missing = dash, real zero = 0
const isMissing = (v) => v === null || v === undefined || v === "";
const fmtNum = (v) => (isMissing(v) ? "—" : Number(v).toLocaleString());
const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isValid(d) ? format(d, "dd MMM yyyy") : "—";
};
const fmtDateTime = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  return isValid(d) ? format(d, "dd MMM yyyy, h:mm a") : "—";
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
// Wrapped in a span so the tooltip still shows when the button is disabled.
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
  <div aria-busy="true" aria-label="Loading inventories">
    {Array.from({ length: 8 }).map((_, i) =>
      phone ? (
        <div key={i} className="min-h-[56px] space-y-2 border-b border-gray-200 px-4 py-2">
          <div className="flex justify-between">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-14 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ) : (
        <div key={i} className="flex h-12 items-center gap-6 border-b border-gray-200 px-3">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[120px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[80px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[50px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[80px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[130px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[60px] animate-pulse rounded bg-gray-100" />
        </div>
      )
    )}
  </div>
);

export default function InventoryList() {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");

  // Phone: one row expanded at a time
  const [expandedId, setExpandedId] = useState(null);

  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);

  const [containerRef, containerWidth] = useContainerWidth();
  const isPhone = containerWidth > 0 && containerWidth < PHONE_BREAKPOINT;

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("INVENTORY_CREATE");
  const canEdit = useHasPermission("INVENTORY_EDIT");
  const canDelete = useHasPermission("INVENTORY_DELETE");

  const { data: inventories = [], isLoading, isError, error, refetch, isFetching } = useInventories();
  const deleteMutation = useDeleteInventory();

  // ── Unique store names for the filter dropdown ────────────────────────────
  const storeOptions = useMemo(() => {
    const stores = new Set(
      inventories.map((r) => r.STORE_NAME).filter((s) => s && String(s).trim())
    );
    return Array.from(stores).sort();
  }, [inventories]);

  // ── Apply store filter before passing data to the table ──────────────────
  const filteredInventories = useMemo(() => {
    if (storeFilter === "all") return inventories;
    return inventories.filter((r) => r.STORE_NAME === storeFilter);
  }, [inventories, storeFilter]);

  const hasActiveFilter = storeFilter !== "all" || !!globalFilter;
  const clearFilters = () => {
    setStoreFilter("all");
    setGlobalFilter("");
  };

  const handleEdit = (inv) => {
    navigate(`/dashboard/inventory-edit/${inv.HID}`);
  };

  const handleDelete = async (inv) => {
    const confirmed = await showConfirmation({
      title: "Delete GRN record?",
      description: `GRN ${inv.GRN_NO} — ${inv.ITEM_COUNT} item(s) shoho delete hobe. Are you sure?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(inv.HID);
        // drop the deleted row from the selection
        setRowSelection((prev) => {
          const next = { ...prev };
          delete next[String(inv.HID)];
          return next;
        });
        toast.success("Inventory GRN deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete. Please try again.");
      }
    }
  };

  const isDeleting = (inv) => deleteMutation.isPending && deleteMutation.variables === inv.HID;
  const editLabel = (inv) => `Edit GRN ${inv.GRN_NO || `#${inv.HID}`}`;
  const deleteLabel = (inv) =>
    isDeleting(inv) ? "Deleting…" : `Delete GRN ${inv.GRN_NO || `#${inv.HID}`}`;

  // ── Columns ────────────────────────────────────────────────────────────────
  // Classified: identity = GRN No (pinned with the checkbox), state = Payment badge,
  // value = Items / Total Qty (right-aligned), date = Inv Date / Created,
  // meta = PO No / Store Name (flexible), action = pinned right.
  // meta: { align, pin, flex, stopRowClick }. Fixed widths via `size`.
  const columns = [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      enableHiding: false,
      meta: { pin: "left", align: "center", stopRowClick: true },
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows on this page"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
    },
    {
      accessorKey: "GRN_NO",
      size: 190,
      enableHiding: false,
      meta: { pin: "left" },
      header: ({ column }) => <SortableHeader column={column} label="GRN No" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-gray-200 bg-white font-mono text-xs text-gray-600">
            {row.getValue("GRN_NO") || "—"}
          </Badge>
          {Number(row.original.PAYMENT_CREATED) === 1 && (
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
              Payment
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "PO_NO",
      size: 170,
      header: () => <PlainHeader label="PO No" />,
      cell: ({ row }) => {
        const v = row.getValue("PO_NO");
        return (
          <div className="truncate text-sm text-gray-600" title={v || undefined}>
            {v || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "STORE_NAME",
      size: 200, // min-width only; this column absorbs the slack
      meta: { flex: true },
      header: () => <PlainHeader label="Store Name" />,
      cell: ({ row }) => {
        const v = row.getValue("STORE_NAME");
        return (
          <div className="truncate text-sm text-gray-600" title={v || undefined}>
            {v || "—"}
          </div>
        );
      },
    },
    {
      accessorKey: "INV_DATE",
      size: 120,
      header: () => <PlainHeader label="Inv Date" />,
      cell: ({ row }) => <span className="text-sm text-gray-600">{fmtDate(row.getValue("INV_DATE"))}</span>,
    },
    {
      accessorKey: "ITEM_COUNT",
      size: 90,
      meta: { align: "right" },
      header: () => <PlainHeader label="Items" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums text-gray-800">{fmtNum(row.getValue("ITEM_COUNT"))}</span>
      ),
    },
    {
      accessorKey: "TOTAL_QTY",
      size: 120,
      meta: { align: "right" },
      header: () => <PlainHeader label="Total Qty" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums text-gray-800">{fmtNum(row.getValue("TOTAL_QTY"))}</span>
      ),
    },
    {
      accessorKey: "CREATION_DATE",
      size: 190,
      header: () => <PlainHeader label="Created" />,
      cell: ({ row }) => (
        <span className="text-xs text-gray-400">{fmtDateTime(row.getValue("CREATION_DATE"))}</span>
      ),
    },
    // ── Actions column: only rendered if user has at least one of edit/delete ──
    ...(canEdit || canDelete
      ? [
          {
            id: "actions",
            size: 100,
            enableHiding: false,
            meta: { pin: "right", align: "center", stopRowClick: true },
            header: () => <PlainHeader label="Actions" align="center" />,
            cell: ({ row }) => {
              const inv = row.original;
              return (
                <div className="flex items-center justify-center gap-1">
                  {canEdit && (
                    <RowAction
                      label={editLabel(inv)}
                      className="hover:bg-violet-50 hover:text-violet-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(inv);
                      }}
                    >
                      <IconEdit className="h-4 w-4" />
                    </RowAction>
                  )}
                  {canDelete && (
                    <RowAction
                      label={deleteLabel(inv)}
                      className="text-destructive hover:text-destructive"
                      disabled={isDeleting(inv)}
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
        ]
      : []),
  ];

  const table = useReactTable({
    data: filteredInventories,
    columns,
    getRowId: (r) => String(r.HID),
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

  const pageRows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const tableMinWidth = visibleColumns.reduce((sum, c) => sum + c.getSize(), 0);
  const selectedCount = table.getSelectedRowModel().rows.length;

  // Left-pinned columns stack: checkbox + identity pinned together
  const leftPinned = visibleColumns.filter((c) => c.columnDef.meta?.pin === "left");
  const lastLeftId = leftPinned[leftPinned.length - 1]?.id;
  const leftOffset = (col) => {
    let offset = 0;
    for (const c of leftPinned) {
      if (c.id === col.id) break;
      offset += c.getSize();
    }
    return offset;
  };

  // ── Pieces ─────────────────────────────────────────────────────────────────
  const emptyBlock = (
    <div className="py-10">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon"><ArchiveIcon /></EmptyMedia>
          <EmptyTitle>
            {hasActiveFilter ? "No inventory records match the filters" : "No inventory records yet"}
          </EmptyTitle>
        </EmptyHeader>
        <div className="mt-3 flex justify-center">
          {hasActiveFilter ? (
            <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
          ) : canCreate ? (
            <Button size="sm" onClick={() => navigate("/dashboard/inventory-create")}>
              <IconCircleDashedPlus className="mr-1" />Add first inventory
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
        <AlertTitle>Error Loading Inventories</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load inventories."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            {isFetching
              ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
              : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );

  // Bulk-action bar: count + actions, shown while rows are selected
  const bulkBar = selectedCount > 0 && (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2"
    >
      <span className="text-sm font-medium text-gray-700">
        {selectedCount.toLocaleString()} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        className="border-gray-200 bg-white"
        onClick={() => table.resetRowSelection()}
      >
        Clear selection
      </Button>
    </div>
  );

  // Desktop: plain <table> in ONE overflow container (no nested scroll)
  const desktopTable = (
    <div
      className="max-w-full overflow-auto"
      style={{ maxHeight: `calc(100dvh - ${PAGE_CHROME})` }}
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
                    style={{
                      ...(meta.flex ? {} : { width: h.column.getSize() }),
                      ...(meta.pin === "left" ? { left: leftOffset(h.column) } : {}),
                    }}
                    className={cn(
                      "sticky top-0 h-10 border-b border-gray-200 bg-gray-50 px-3 font-normal",
                      meta.align === "right" ? "text-right" : meta.align === "center" ? "text-center" : "text-left",
                      meta.pin === "left" && "z-30",
                      meta.pin === "left" && h.column.id === lastLeftId && "border-r",
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
            const isSelected = row.getIsSelected();
            // active colour wins over selection, selection wins over hover
            const rowBg = isActive ? ACTIVE_BG : isSelected ? SELECTED_BG : "hover:bg-gray-50";
            const pinBg = isActive
              ? ACTIVE_BG
              : isSelected
                ? SELECTED_BG
                : "bg-white group-hover/row:bg-gray-50";
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
                  rowBg
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta || {};
                  return (
                    <td
                      key={cell.id}
                      onClick={meta.stopRowClick ? (e) => e.stopPropagation() : undefined}
                      style={meta.pin === "left" ? { left: leftOffset(cell.column) } : undefined}
                      className={cn(
                        "h-12 whitespace-nowrap border-b border-gray-200 px-3 py-0 align-middle",
                        meta.align === "right" && "text-right tabular-nums",
                        meta.align === "center" && "text-center",
                        // pinned: solid bg matching row state, inner-edge border, no shadow
                        meta.pin && "sticky z-10",
                        meta.pin && pinBg,
                        meta.pin === "left" && cell.column.id === lastLeftId && "border-r",
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
    { id: "GRN_NO", label: "GRN No" },
    { id: "PO_NO", label: "PO No" },
    { id: "STORE_NAME", label: "Store Name" },
    { id: "INV_DATE", label: "Inv Date" },
    { id: "TOTAL_QTY", label: "Total Qty" },
  ];
  const currentSort = sorting[0];

  const phoneList = (
    <div>
      {/* Sorting moves to a control above the list */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
        <label htmlFor="inventory-sort" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort
        </label>
        <select
          id="inventory-sort"
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
          className="h-10 w-10 border-gray-200 bg-white"
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
          const paid = Number(inv.PAYMENT_CREATED) === 1;
          return (
            <li key={row.id} className={cn(row.getIsSelected() && SELECTED_BG)}>
              <div className="flex items-center">
                {/* 44px touch target for selection, outside the expand button */}
                <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
                  <Checkbox
                    aria-label="Select row"
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                  />
                </label>

                {/* Line 1: identity left, key value right. Line 2: store + date */}
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setExpandedId(open ? null : row.id)}
                  className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 py-2 pr-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <Badge variant="outline" className="border-gray-200 bg-white font-mono text-xs text-gray-600">
                          {inv.GRN_NO || "—"}
                        </Badge>
                        {paid && (
                          <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
                            Payment
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-gray-800">
                        {fmtNum(inv.TOTAL_QTY)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-xs text-gray-500">
                      <span className="truncate">{inv.STORE_NAME || "—"}</span>
                      <span className="whitespace-nowrap">{fmtDate(inv.INV_DATE)}</span>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ease-out motion-reduce:transition-none",
                      open && "rotate-180"
                    )}
                  />
                </button>
              </div>

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
                      <dt className="text-gray-500">PO No</dt>
                      <dd className="text-gray-800">{inv.PO_NO || "—"}</dd>
                      <dt className="text-gray-500">Items</dt>
                      <dd className="tabular-nums text-gray-800">{fmtNum(inv.ITEM_COUNT)}</dd>
                      <dt className="text-gray-500">Created</dt>
                      <dd className="text-gray-800">{fmtDateTime(inv.CREATION_DATE)}</dd>
                    </dl>
                    {(canEdit || canDelete) && (
                      <div className="flex gap-2">
                        {canEdit && (
                          <Button
                            variant="outline"
                            className="h-10 flex-1 border-gray-200 bg-white"
                            tabIndex={open ? 0 : -1}
                            onClick={() => handleEdit(inv)}
                          >
                            <IconEdit className="mr-2 h-4 w-4" />Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            className="h-10 flex-1 border-gray-200 bg-white text-destructive hover:text-destructive"
                            tabIndex={open ? 0 : -1}
                            onClick={() => handleDelete(inv)}
                            disabled={isDeleting(inv)}
                          >
                            {isDeleting(inv)
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
  else tableContent = (
    <>
      {bulkBar}
      {isPhone ? phoneList : desktopTable}
    </>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
                <ArchiveIcon size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Inventory</h2>
                <p className="text-xs text-gray-400">{filteredInventories.length} of {inventories.length} records</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              {canCreate && (
                <Button onClick={() => navigate("/dashboard/inventory-create")}>
                  <IconCircleDashedPlus className="mr-1" />Add Inventory
                </Button>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Search + Store Name filter + Column visibility — all in one row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by GRN, PO, store..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-48">
                <Select value={storeFilter} onValueChange={setStoreFilter}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-violet-300">
                    <SelectValue placeholder="All stores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {storeOptions.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Column Visibility (hide, never delete) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                    <DropdownMenuCheckboxItem key={col.id} className="capitalize" checked={col.getIsVisible()} onCheckedChange={(v) => col.toggleVisibility(!!v)}>
                      {col.id.replace(/_/g, " ").toLowerCase()}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Table area — width of this box decides table vs phone rows */}
            <div ref={containerRef} className="min-w-0 max-w-full overflow-hidden rounded-md border border-gray-200 bg-white">
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