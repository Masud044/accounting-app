// // import { useState } from "react";
// // import {
// //   flexRender, getCoreRowModel, getFilteredRowModel,
// //   getPaginationRowModel, getSortedRowModel, useReactTable,
// // } from "@tanstack/react-table";
// // import { ArrowUpDown, ChevronDown, Trash2, AlertCircle, RefreshCw, ArchiveIcon } from "lucide-react";
// // import { toast } from "sonner";
// // import { format } from "date-fns";
// // import { Button } from "@/components/ui/button";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import {
// //   DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// // } from "@/components/ui/table";
// // import { Badge } from "@/components/ui/badge";
// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // import { Spinner } from "@/components/ui/spinner";
// // import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// // import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// // import { useInventories, useDeleteInventory } from "./queries";
// // import AddInventorySheet from "./add-inventory-sheet";
// // import UpdateInventorySheet from "./update-inventory-sheet";

// // export default function InventoryList() {
// //   const [sorting, setSorting] = useState([]);
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [columnVisibility, setColumnVisibility] = useState({});
// //   const [rowSelection, setRowSelection] = useState({});
// //   const [globalFilter, setGlobalFilter] = useState("");
// //   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
// //   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
// //   const [selectedHid, setSelectedHid] = useState(null);

// //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
// //   const { data: inventories = [], isLoading, isError, error, refetch, isFetching } = useInventories();
// //   const deleteMutation = useDeleteInventory();

// //   const handleEdit = (inv) => {
// //     setSelectedHid(inv.HID);
// //     setIsUpdateSheetOpen(true);
// //   };

// //   const handleDelete = async (inv) => {
// //     const confirmed = await showConfirmation({
// //       title: "Delete GRN record?",
// //       description: `GRN ${inv.GRN_NO} — ${inv.ITEM_COUNT} item(s) shoho delete hobe. Are you sure?`,
// //       confirmText: "Delete",
// //       cancelText: "Cancel",
// //       variant: "destructive",
// //     });
// //     if (confirmed) {
// //       try {
// //         await deleteMutation.mutateAsync(inv.HID);
// //         toast.success("Inventory GRN deleted successfully!");
// //       } catch (err) {
// //         toast.error(err?.message || "Failed to delete. Please try again.");
// //       }
// //     }
// //   };

// //   const columns = [
// //     {
// //       id: "select",
// //       header: ({ table }) => (
// //         <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} />
// //       ),
// //       cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />,
// //       enableSorting: false, enableHiding: false,
// //     },
// //     {
// //       accessorKey: "GRN_NO",
// //       header: ({ column }) => (
// //         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// //           GRN No <ArrowUpDown className="ml-2 h-4 w-4" />
// //         </Button>
// //       ),
// //       cell: ({ row }) => <Badge variant="outline" className="font-mono text-xs">{row.getValue("GRN_NO") || "—"}</Badge>,
// //     },
// //     {
// //       accessorKey: "PO_NO",
// //       header: "PO No",
// //       cell: ({ row }) => <div>{row.getValue("PO_NO") || "—"}</div>,
// //     },
// //     {
// //       accessorKey: "STORE_NAME",
// //       header: "Store Name",
// //       cell: ({ row }) => <div>{row.getValue("STORE_NAME") ?? "—"}</div>,
// //     },
// //     {
// //       accessorKey: "INV_DATE",
// //       header: "Inv Date",
// //       cell: ({ row }) => {
// //         const val = row.getValue("INV_DATE");
// //         return <div>{val ? format(new Date(val), "dd MMM yyyy") : "—"}</div>;
// //       },
// //     },
// //     {
// //       accessorKey: "ITEM_COUNT",
// //       header: "Items",
// //       cell: ({ row }) => <div className="font-medium text-center">{row.getValue("ITEM_COUNT") ?? 0}</div>,
// //     },
// //     {
// //       accessorKey: "TOTAL_QTY",
// //       header: "Total Qty",
// //       cell: ({ row }) => <div className="font-medium">{row.getValue("TOTAL_QTY") ?? "—"}</div>,
// //     },
// //     {
// //       accessorKey: "CREATION_DATE",
// //       header: "Created",
// //       cell: ({ row }) => {
// //         const val = row.getValue("CREATION_DATE");
// //         return <div className="text-xs text-muted-foreground">{val ? format(new Date(val), "dd MMM yyyy, h:mm a") : "—"}</div>;
// //       },
// //     },
// //     {
// //       id: "actions",
// //       header: "Actions",
// //       enableHiding: false,
// //       cell: ({ row }) => {
// //         const inv = row.original;
// //         return (
// //           <div className="flex items-center gap-2">
// //             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(inv)}>
// //               <IconEdit className="h-4 w-4" />
// //               <span className="sr-only">Edit</span>
// //             </Button>
// //             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(inv)} disabled={deleteMutation.isPending}>
// //               {deleteMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
// //               <span className="sr-only">Delete</span>
// //             </Button>
// //           </div>
// //         );
// //       },
// //     },
// //   ];

// //   const table = useReactTable({
// //     data: inventories,
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
// //       <div>
// //         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
// //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Inventories</h1>
// //             <Button disabled><IconCircleDashedPlus className="mr-1" />Add Inventory</Button>
// //           </div>
// //         </div>
// //         <div className="bg-card rounded-lg shadow-sm p-4">
// //           <div className="flex flex-col items-center justify-center py-16">
// //             <Spinner className="h-12 w-12 mb-4" />
// //             <p className="text-muted-foreground">Loading inventories...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div>
// //         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
// //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Inventories</h1>
// //             <Button onClick={() => setIsAddSheetOpen(true)}><IconCircleDashedPlus className="mr-1" />Add Inventory</Button>
// //           </div>
// //         </div>
// //         <div className="bg-card rounded-lg shadow-sm p-4">
// //           <Alert variant="destructive">
// //             <AlertCircle className="h-4 w-4" />
// //             <AlertTitle>Error Loading Inventories</AlertTitle>
// //             <AlertDescription className="mt-2 flex flex-col gap-2">
// //               <p>{error?.message || "Failed to load inventories."}</p>
// //               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
// //                 {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
// //               </Button>
// //             </AlertDescription>
// //           </Alert>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //           <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Inventory</h1>
// //           <div className="flex items-center gap-2">
// //             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
// //               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
// //               <span className="sr-only">Refresh</span>
// //             </Button>
// //             <Button onClick={() => setIsAddSheetOpen(true)}>
// //               <IconCircleDashedPlus className="mr-1" />Add Inventory
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="bg-card rounded-md shadow-sm p-4">
// //         <div className="space-y-4">
// //           <div className="flex flex-col sm:flex-row gap-4">
// //             <Input placeholder="Search by GRN, PO, store..." value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="outline" className="ml-auto">Columns <ChevronDown className="ml-2 h-4 w-4" /></Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent align="end">
// //                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
// //                   <DropdownMenuCheckboxItem key={col.id} className="capitalize" checked={col.getIsVisible()} onCheckedChange={(v) => col.toggleVisibility(!!v)}>
// //                     {col.id.replace(/_/g, " ").toLowerCase()}
// //                   </DropdownMenuCheckboxItem>
// //                 ))}
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>

// //           <div className="overflow-hidden rounded-md border">
// //             <Table>
// //               <TableHeader>
// //                 {table.getHeaderGroups().map((hg) => (
// //                   <TableRow key={hg.id}>
// //                     {hg.headers.map((h) => (
// //                       <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
// //                     ))}
// //                   </TableRow>
// //                 ))}
// //               </TableHeader>
// //               <TableBody>
// //                 {table.getRowModel().rows?.length ? (
// //                   table.getRowModel().rows.map((row) => (
// //                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
// //                       {row.getVisibleCells().map((cell) => (
// //                         <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
// //                       ))}
// //                     </TableRow>
// //                   ))
// //                 ) : (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="h-24 text-center">
// //                       <Empty>
// //                         <EmptyHeader>
// //                           <EmptyMedia variant="icon"><ArchiveIcon /></EmptyMedia>
// //                           <EmptyTitle>No Inventory Records Found</EmptyTitle>
// //                         </EmptyHeader>
// //                       </Empty>
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>

// //           <DataTablePagination table={table} />
// //         </div>
// //       </div>

// //       {isAddSheetOpen && (
// //         <AddInventorySheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} initialData={null} />
// //       )}
// //       {isUpdateSheetOpen && (
// //         <UpdateInventorySheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} hid={selectedHid} />
// //       )}
// //       <ConfirmationDialog />
// //     </div>
// //   );
// // }

// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   flexRender, getCoreRowModel, getFilteredRowModel,
//   getPaginationRowModel, getSortedRowModel, useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ChevronDown, Trash2, AlertCircle, RefreshCw, ArchiveIcon } from "lucide-react";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
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

// import { useInventories, useDeleteInventory } from "./queries";
// import AddInventorySheet from "./add-inventory-sheet";
// import UpdateInventorySheet from "./update-inventory-sheet";

// export default function InventoryList() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [addInitialData, setAddInitialData] = useState(null);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedHid, setSelectedHid] = useState(null);

//   // ✅ Purchase Recognition page-er "Create Inventory" button Link-e state
//   //    diye ei page-e navigate kore, kintu ager code-e eita consume kore
//   //    Add Inventory sheet open kora hoto na — tai click korle kichu
//   //    hocchilo na mone hocchilo. Ekhon location.state check kore sheet
//   //    auto-open kora hocche, ar consume kora shesh hole state clear kore
//   //    dicchi (na hole refresh/back korle abar khule jabe).
//   useEffect(() => {
//     if (location.state?.bulkItems) {
//       setAddInitialData(location.state);
//       setIsAddSheetOpen(true);
//       navigate(location.pathname, { replace: true, state: null });
//     }
//   }, [location.state]);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
//   const { data: inventories = [], isLoading, isError, error, refetch, isFetching } = useInventories();
//   const deleteMutation = useDeleteInventory();

//   const handleEdit = (inv) => {
//     setSelectedHid(inv.HID);
//     setIsUpdateSheetOpen(true);
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
//    {
//   accessorKey: "GRN_NO",
//   header: ({ column }) => (
//     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//       GRN No <ArrowUpDown className="ml-2 h-4 w-4" />
//     </Button>
//   ),
//   cell: ({ row }) => (
//     <div className="flex items-center gap-2">
//       <Badge variant="outline" className="font-mono text-xs">{row.getValue("GRN_NO") || "—"}</Badge>
//       {Number(row.original.PAYMENT_CREATED) === 1 && (
//         <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
//           Payment
//         </span>
//       )}
//     </div>
//   ),
// },
//     {
//       accessorKey: "PO_NO",
//       header: "PO No",
//       cell: ({ row }) => <div>{row.getValue("PO_NO") || "—"}</div>,
//     },
//     {
//       accessorKey: "STORE_NAME",
//       header: "Store Name",
//       cell: ({ row }) => <div>{row.getValue("STORE_NAME") ?? "—"}</div>,
//     },
//     {
//       accessorKey: "INV_DATE",
//       header: "Inv Date",
//       cell: ({ row }) => {
//         const val = row.getValue("INV_DATE");
//         return <div>{val ? format(new Date(val), "dd MMM yyyy") : "—"}</div>;
//       },
//     },
//     {
//       accessorKey: "ITEM_COUNT",
//       header: "Items",
//       cell: ({ row }) => <div className="font-medium text-center">{row.getValue("ITEM_COUNT") ?? 0}</div>,
//     },
//     {
//       accessorKey: "TOTAL_QTY",
//       header: "Total Qty",
//       cell: ({ row }) => <div className="font-medium">{row.getValue("TOTAL_QTY") ?? "—"}</div>,
//     },
//     {
//       accessorKey: "CREATION_DATE",
//       header: "Created",
//       cell: ({ row }) => {
//         const val = row.getValue("CREATION_DATE");
//         return <div className="text-xs text-muted-foreground">{val ? format(new Date(val), "dd MMM yyyy, h:mm a") : "—"}</div>;
//       },
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const inv = row.original;
//         return (
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(inv)}>
//               <IconEdit className="h-4 w-4" />
//               <span className="sr-only">Edit</span>
//             </Button>
//             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(inv)} disabled={deleteMutation.isPending}>
//               {deleteMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
//               <span className="sr-only">Delete</span>
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: inventories,
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
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Inventories</h1>
//             <Button disabled><IconCircleDashedPlus className="mr-1" />Add Inventory</Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">Loading inventories...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Inventories</h1>
//             <Button onClick={() => setIsAddSheetOpen(true)}><IconCircleDashedPlus className="mr-1" />Add Inventory</Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Inventories</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load inventories."}</p>
//               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//                 {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Inventory</h1>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             <Button onClick={() => { setAddInitialData(null); setIsAddSheetOpen(true); }}>
//               <IconCircleDashedPlus className="mr-1" />Add Inventory
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Input placeholder="Search by GRN, PO, store..." value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto">Columns <ChevronDown className="ml-2 h-4 w-4" /></Button>
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

//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

//       {isAddSheetOpen && (
//         <AddInventorySheet
//           open={isAddSheetOpen}
//           onOpenChange={(o) => { setIsAddSheetOpen(o); if (!o) setAddInitialData(null); }}
//           showConfirmation={showConfirmation}
//           initialData={addInitialData}
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateInventorySheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} hid={selectedHid} />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Trash2, AlertCircle, RefreshCw, ArchiveIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useInventories, useDeleteInventory } from "./queries";
import AddInventorySheet from "./add-inventory-sheet";
import UpdateInventorySheet from "./update-inventory-sheet";

// Reusable sortable header — consistent uppercase gray style
const SortableHeader = ({ column, label }) => (
  <Button
    variant="ghost"
    className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label} <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
);

export default function InventoryList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [storeFilter, setStoreFilter] = useState("all");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [addInitialData, setAddInitialData] = useState(null);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedHid, setSelectedHid] = useState(null);

  useEffect(() => {
    if (location.state?.bulkItems) {
      setAddInitialData(location.state);
      setIsAddSheetOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
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

  const handleEdit = (inv) => {
    setSelectedHid(inv.HID);
    setIsUpdateSheetOpen(true);
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
        toast.success("Inventory GRN deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete. Please try again.");
      }
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)} />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} />,
      enableSorting: false, enableHiding: false,
    },
    {
      accessorKey: "GRN_NO",
      header: ({ column }) => <SortableHeader column={column} label="GRN No" />,
      cell: ({ row }) => (
        <div className="ml-3 flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs bg-white border-gray-200 text-gray-600">
            {row.getValue("GRN_NO") || "—"}
          </Badge>
          {Number(row.original.PAYMENT_CREATED) === 1 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
              Payment
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "PO_NO",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PO No</div>
      ),
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("PO_NO") || "—"}</div>,
    },
    {
      accessorKey: "STORE_NAME",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Store Name</div>
      ),
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("STORE_NAME") ?? "—"}</div>,
    },
    {
      accessorKey: "INV_DATE",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Inv Date</div>
      ),
      cell: ({ row }) => {
        const val = row.getValue("INV_DATE");
        return <div className="text-sm text-gray-600">{val ? format(new Date(val), "dd MMM yyyy") : "—"}</div>;
      },
    },
    {
      accessorKey: "ITEM_COUNT",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Items</div>
      ),
      cell: ({ row }) => <div className="text-sm font-medium text-gray-800 text-center">{row.getValue("ITEM_COUNT") ?? 0}</div>,
    },
    {
      accessorKey: "TOTAL_QTY",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Qty</div>
      ),
      cell: ({ row }) => <div className="text-sm font-medium text-gray-800">{row.getValue("TOTAL_QTY") ?? "—"}</div>,
    },
    {
      accessorKey: "CREATION_DATE",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</div>
      ),
      cell: ({ row }) => {
        const val = row.getValue("CREATION_DATE");
        return <div className="text-xs text-gray-400">{val ? format(new Date(val), "dd MMM yyyy, h:mm a") : "—"}</div>;
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const inv = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700" onClick={() => handleEdit(inv)}>
              <IconEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(inv)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredInventories,
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
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-sm text-gray-500">Loading inventories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Inventories</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load inventories."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
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
            <Button onClick={() => { setAddInitialData(null); setIsAddSheetOpen(true); }}>
              <IconCircleDashedPlus className="mr-1" />Add Inventory
            </Button>
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
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-sm text-gray-700">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon"><ArchiveIcon /></EmptyMedia>
                          <EmptyTitle>No Inventory Records Found</EmptyTitle>
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

      {isAddSheetOpen && (
        <AddInventorySheet
          open={isAddSheetOpen}
          onOpenChange={(o) => { setIsAddSheetOpen(o); if (!o) setAddInitialData(null); }}
          showConfirmation={showConfirmation}
          initialData={addInitialData}
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateInventorySheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} hid={selectedHid} />
      )}
      <ConfirmationDialog />
    </div>
  );
}