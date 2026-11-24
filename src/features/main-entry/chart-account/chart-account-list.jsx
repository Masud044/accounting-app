

// // import { useState } from "react";
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
// //   RefreshCw,
// //   BookOpen,
// //   AlertCircle,
// //   Search,
// // } from "lucide-react";

// // import { Button } from "@/components/ui/button";
// // import { Checkbox } from "@/components/ui/checkbox";
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
// // import { Badge } from "@/components/ui/badge";
// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // import { Spinner } from "@/components/ui/spinner";
// // import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// // import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// // import { useHasPermission } from "@/hooks/use-permission";

// // import { useChartOfAccounts } from "./queries";
// // import AddChartSheet from "./add-chart-account-sheet";
// // import UpdateChartSheet from "./update-chart-account-sheet";

// // const LEVEL_COLORS = {
// //   1: "bg-purple-100 text-purple-700",
// //   2: "bg-blue-100 text-blue-700",
// //   3: "bg-teal-100 text-teal-700",
// //   4: "bg-amber-100 text-amber-700",
// // };

// // // Reusable sortable header — consistent uppercase gray style
// // const SortableHeader = ({ column, label }) => (
// //   <Button
// //     variant="ghost"
// //     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
// //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
// //   >
// //     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
// //   </Button>
// // );

// // export default function ChartList() {
// //   const [sorting, setSorting] = useState([]);
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [columnVisibility, setColumnVisibility] = useState({});
// //   const [rowSelection, setRowSelection] = useState({});
// //   const [globalFilter, setGlobalFilter] = useState("");
// //   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
// //   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
// //   const [selectedAccount, setSelectedAccount] = useState(null);

// //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

// //   // ── Permissions ──
// //   const canCreate = useHasPermission("CHART_ACCOUNT_CREATE");
// //   const canEdit = useHasPermission("CHART_ACCOUNT_EDIT");

// //   const {
// //     data: accounts = [],
// //     isLoading,
// //     isError,
// //     error,
// //     refetch,
// //     isFetching,
// //   } = useChartOfAccounts();

// //   const handleEdit = (account) => {
// //     setSelectedAccount(account);
// //     setIsUpdateSheetOpen(true);
// //   };

// //   const columns = [
// //     {
// //       id: "select",
// //       header: ({ table }) => (
// //         <Checkbox
// //           checked={
// //             table.getIsAllPageRowsSelected() ||
// //             (table.getIsSomePageRowsSelected() && "indeterminate")
// //           }
// //           onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
// //           aria-label="Select all"
// //         />
// //       ),
// //       cell: ({ row }) => (
// //         <Checkbox
// //           checked={row.getIsSelected()}
// //           onCheckedChange={(v) => row.toggleSelected(!!v)}
// //           aria-label="Select row"
// //         />
// //       ),
// //       enableSorting: false,
// //       enableHiding: false,
// //     },
// //     {
// //       accessorKey: "ACCOUNT_ID",
// //       header: ({ column }) => <SortableHeader column={column} label="Account ID" />,
// //       cell: ({ row }) => (
// //         <span className="ml-3 font-mono text-sm text-gray-500">
// //           {row.getValue("ACCOUNT_ID")}
// //         </span>
// //       ),
// //     },
// //     {
// //       accessorKey: "ACCOUNT_NAME",
// //       header: ({ column }) => <SortableHeader column={column} label="Account Name" />,
// //       cell: ({ row }) => {
// //         const level = row.getValue("LEBEL") ?? 1;
// //         const name = String(row.getValue("ACCOUNT_NAME") ?? "").trim();
// //         const indent = (level - 1) * 16;
// //         return (
// //           <span
// //             className="ml-3 text-sm font-medium text-gray-800 block"
// //             style={{ paddingLeft: `${indent}px` }}
// //           >
// //             {name || "—"}
// //           </span>
// //         );
// //       },
// //       filterFn: (row, _, filterValue) =>
// //         String(row.getValue("ACCOUNT_NAME"))
// //           .trim()
// //           .toLowerCase()
// //           .includes(filterValue.toLowerCase()),
// //     },
// //     {
// //       accessorKey: "ROOT_ACCOUNT",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Root</div>
// //       ),
// //       cell: ({ row }) => (
// //         <Badge variant="outline" className="text-xs font-normal bg-white border-gray-200 text-gray-600">
// //           {row.getValue("ROOT_ACCOUNT") || "—"}
// //         </Badge>
// //       ),
// //     },
// //     {
// //       accessorKey: "LEBEL",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Level</div>
// //       ),
// //       cell: ({ row }) => {
// //         const lvl = row.getValue("LEBEL");
// //         return (
// //           <span
// //             className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
// //               LEVEL_COLORS[lvl] ?? "bg-gray-100 text-gray-700"
// //             }`}
// //           >
// //             L{lvl}
// //           </span>
// //         );
// //       },
// //     },
// //     {
// //       accessorKey: "IS_LEAF",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</div>
// //       ),
// //       cell: ({ row }) => {
// //         const isLeaf = row.getValue("IS_LEAF") === 1;
// //         return (
// //           <Badge
// //             className={
// //               isLeaf
// //                 ? "bg-green-100 text-green-700 border-green-200"
// //                 : "bg-gray-100 text-gray-600 border-gray-200"
// //             }
// //           >
// //             {isLeaf ? "Leaf" : "Parent"}
// //           </Badge>
// //         );
// //       },
// //     },
// //     {
// //       accessorKey: "FULL_PATH",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Path</div>
// //       ),
// //       cell: ({ row }) => {
// //         const path = String(row.getValue("FULL_PATH") ?? "").replace(/^\s*>\s*/, "");
// //         return (
// //           <span className="text-xs text-gray-400 max-w-[260px] block truncate" title={path}>
// //             {path || "—"}
// //           </span>
// //         );
// //       },
// //     },
// //     {
// //       id: "actions",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
// //       ),
// //       enableHiding: false,
// //       cell: ({ row }) => {
// //         const account = row.original;
// //         return (
// //           canEdit && (
// //             <Button
// //               variant="ghost"
// //               size="icon"
// //               className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
// //               onClick={() => handleEdit(account)}
// //             >
// //               <IconEdit className="h-4 w-4" />
// //               <span className="sr-only">Edit</span>
// //             </Button>
// //           )
// //         );
// //       },
// //     },
// //   ];

// //   const table = useReactTable({
// //     data: accounts,
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
// //     autoResetPageIndex: false,
// //     enableMultiSort: false,
// //   });

// //   if (isLoading) {
// //     return (
// //       <div className="p-4 md:p-6">
// //         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
// //           <div className="flex flex-col items-center justify-center py-16">
// //             <Spinner className="h-10 w-10 mb-3" />
// //             <p className="text-sm text-gray-500">Loading accounts...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div className="p-4 md:p-6">
// //         <Alert variant="destructive">
// //           <AlertCircle className="h-4 w-4" />
// //           <AlertTitle>Error Loading Accounts</AlertTitle>
// //           <AlertDescription className="mt-2 flex flex-col gap-2">
// //             <p>{error?.message || "Failed to load accounts."}</p>
// //             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
// //               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
// //             </Button>
// //           </AlertDescription>
// //         </Alert>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-6">
// //       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
// //           <div className="flex items-center gap-2">
// //             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
// //               <BookOpen size={16} />
// //             </div>
// //             <div>
// //               <h2 className="text-sm font-bold text-gray-900">Chart of Account</h2>
// //               <p className="text-xs text-gray-400">{accounts.length} total accounts</p>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
// //               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
// //               <span className="sr-only">Refresh</span>
// //             </Button>
// //             {canCreate && (
// //               <Button onClick={() => setIsAddSheetOpen(true)}>
// //                 <IconCircleDashedPlus className="mr-1" />Add Account
// //               </Button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="p-5 space-y-4">
// //           <div className="flex flex-col sm:flex-row gap-3">
// //             <div className="relative max-w-sm w-full">
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //               <Input
// //                 placeholder="Search by name or account ID..."
// //                 value={globalFilter ?? ""}
// //                 onChange={(e) => setGlobalFilter(e.target.value)}
// //                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// //               />
// //             </div>
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="outline" className="ml-auto bg-white border-gray-200">
// //                   Columns
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent align="end">
// //                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
// //                   <DropdownMenuCheckboxItem
// //                     key={col.id}
// //                     className="capitalize"
// //                     checked={col.getIsVisible()}
// //                     onCheckedChange={(v) => col.toggleVisibility(!!v)}
// //                   >
// //                     {col.id.replace(/_/g, " ").toLowerCase()}
// //                   </DropdownMenuCheckboxItem>
// //                 ))}
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>

// //           <div className="overflow-hidden rounded-md border border-gray-200">
// //             <Table>
// //               <TableHeader className="bg-gray-50">
// //                 {table.getHeaderGroups().map((hg) => (
// //                   <TableRow key={hg.id}>
// //                     {hg.headers.map((h) => (
// //                       <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
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
// //                         <TableCell key={cell.id} className="text-sm text-gray-700">
// //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                         </TableCell>
// //                       ))}
// //                     </TableRow>
// //                   ))
// //                 ) : (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="h-24 text-center">
// //                       <Empty>
// //                         <EmptyHeader>
// //                           <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
// //                           <EmptyTitle>No Accounts Found</EmptyTitle>
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
// //         <AddChartSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
// //       )}
// //       {isUpdateSheetOpen && (
// //         <UpdateChartSheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} account={selectedAccount} />
// //       )}
// //       <ConfirmationDialog />
// //     </div>
// //   );
// // }
// import { useState } from "react";
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
//   RefreshCw,
//   BookOpen,
//   AlertCircle,
//   Search,
//   ShieldAlert,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
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
// import { Badge } from "@/components/ui/badge";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import { useHasPermission } from "@/hooks/use-permission";

// import { CHART_PERMS } from "./permissions";
// import { useChartOfAccounts } from "./queries";
// import AddChartSheet from "./add-chart-account-sheet";
// import UpdateChartSheet from "./update-chart-account-sheet";

// const LEVEL_COLORS = {
//   1: "bg-purple-100 text-purple-700",
//   2: "bg-blue-100 text-blue-700",
//   3: "bg-teal-100 text-teal-700",
//   4: "bg-amber-100 text-amber-700",
// };

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

// export default function ChartList() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canView = useHasPermission(CHART_PERMS.VIEW);
//   const canCreate = useHasPermission(CHART_PERMS.CREATE);
//   const canEdit = useHasPermission(CHART_PERMS.EDIT);

//   const {
//     data: accounts = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useChartOfAccounts();

//   const handleEdit = (account) => {
//     setSelectedAccount(account);
//     setIsUpdateSheetOpen(true);
//   };

//   const columns = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(v) => row.toggleSelected(!!v)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "ACCOUNT_ID",
//       header: ({ column }) => <SortableHeader column={column} label="Account ID" />,
//       cell: ({ row }) => (
//         <span className="ml-3 font-mono text-sm text-gray-500">
//           {row.getValue("ACCOUNT_ID")}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "ACCOUNT_NAME",
//       header: ({ column }) => <SortableHeader column={column} label="Account Name" />,
//       cell: ({ row }) => {
//         const level = row.getValue("LEBEL") ?? 1;
//         const name = String(row.getValue("ACCOUNT_NAME") ?? "").trim();
//         const indent = (level - 1) * 16;
//         return (
//           <span
//             className="ml-3 text-sm font-medium text-gray-800 block"
//             style={{ paddingLeft: `${indent}px` }}
//           >
//             {name || "—"}
//           </span>
//         );
//       },
//       filterFn: (row, _, filterValue) =>
//         String(row.getValue("ACCOUNT_NAME"))
//           .trim()
//           .toLowerCase()
//           .includes(filterValue.toLowerCase()),
//     },
//     {
//       accessorKey: "ROOT_ACCOUNT",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Root</div>
//       ),
//       cell: ({ row }) => (
//         <Badge variant="outline" className="text-xs font-normal bg-white border-gray-200 text-gray-600">
//           {row.getValue("ROOT_ACCOUNT") || "—"}
//         </Badge>
//       ),
//     },
//     {
//       accessorKey: "LEBEL",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Level</div>
//       ),
//       cell: ({ row }) => {
//         const lvl = row.getValue("LEBEL");
//         return (
//           <span
//             className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//               LEVEL_COLORS[lvl] ?? "bg-gray-100 text-gray-700"
//             }`}
//           >
//             L{lvl}
//           </span>
//         );
//       },
//     },
//     {
//       accessorKey: "IS_LEAF",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</div>
//       ),
//       cell: ({ row }) => {
//         const isLeaf = row.getValue("IS_LEAF") === 1;
//         return (
//           <Badge
//             className={
//               isLeaf
//                 ? "bg-green-100 text-green-700 border-green-200"
//                 : "bg-gray-100 text-gray-600 border-gray-200"
//             }
//           >
//             {isLeaf ? "Leaf" : "Parent"}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "FULL_PATH",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Path</div>
//       ),
//       cell: ({ row }) => {
//         const path = String(row.getValue("FULL_PATH") ?? "").replace(/^\s*>\s*/, "");
//         return (
//           <span className="text-xs text-gray-400 max-w-[260px] block truncate" title={path}>
//             {path || "—"}
//           </span>
//         );
//       },
//     },
//     {
//       id: "actions",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
//       ),
//       enableHiding: false,
//       cell: ({ row }) => {
//         const account = row.original;
//         return canEdit ? (
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
//             onClick={() => handleEdit(account)}
//           >
//             <IconEdit className="h-4 w-4" />
//             <span className="sr-only">Edit</span>
//           </Button>
//         ) : null;
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: accounts,
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
//     autoResetPageIndex: false,
//     enableMultiSort: false,
//   });

//   // View permission na thakle kichui dekhabe na (shob hooks er pore early return)
//   if (!canView) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
//           <ShieldAlert className="h-10 w-10 text-gray-400 mb-3" />
//           <p className="text-sm font-medium text-gray-800">Access denied</p>
//           <p className="text-xs text-gray-500 mt-1">
//             You don't have permission to view chart of accounts.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 mb-3" />
//             <p className="text-sm text-gray-500">Loading accounts...</p>
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
//           <AlertTitle>Error Loading Accounts</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load accounts."}</p>
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
//               <BookOpen size={16} />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">Chart of Account</h2>
//               <p className="text-xs text-gray-400">{accounts.length} total accounts</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             {canCreate && (
//               <Button onClick={() => setIsAddSheetOpen(true)}>
//                 <IconCircleDashedPlus className="mr-1" />Add Account
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="relative max-w-sm w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by name or account ID..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//               />
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto bg-white border-gray-200">
//                   Columns
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
//                           <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
//                           <EmptyTitle>No Accounts Found</EmptyTitle>
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
//         <AddChartSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateChartSheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} account={selectedAccount} />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
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
  RefreshCw,
  BookOpen,
  AlertCircle,
  Search,
  ShieldAlert,
} from "lucide-react";
import { create } from "zustand";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useHasPermission } from "@/hooks/use-permission";

import { CHART_PERMS } from "./permissions";
import { useChartOfAccounts } from "./queries";
import AddChartSheet from "./add-chart-account-sheet";
import UpdateChartSheet from "./update-chart-account-sheet";

// ── Table design constants (table-design skill) ──────────────────────────────
// Pinned (select + id + name + actions ≈ 544px) + 3 scrolling cols (~115px each) ≈ 890px
const PHONE_BREAKPOINT = 890;
const PAGE_CHROME = "12rem";       // header + toolbar above the table (adjust)
// Solid (not translucent) so pinned cells stay opaque while scrolling.
// Order of strength: hover (gray-50) < selected (gray-100) < active (violet-100).
const ACTIVE_BG = "bg-violet-100";
const SELECTED_BG = "bg-gray-100";

const LEVEL_COLORS = {
  1: "bg-purple-100 text-purple-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-teal-100 text-teal-700",
  4: "bg-amber-100 text-amber-700",
};

// ── Active row store: one id at a time, same id again clears ─────────────────
// (separate from checkbox selection)
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
}));

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

const cleanName = (v) => String(v ?? "").trim();
const cleanPath = (v) => String(v ?? "").replace(/^\s*>\s*/, "");
const isLeafRow = (r) => Number(r.IS_LEAF) === 1;

// ── Headers ──────────────────────────────────────────────────────────────────
const headerText = "text-xs font-semibold uppercase tracking-wide text-gray-500";

// Sort arrow only on the active column
const SortableHeader = ({ column, label }) => {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      className={cn(headerText, "h-auto w-full justify-start gap-1 p-0 hover:bg-transparent")}
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

// ── Cell pieces shared by table and phone rows ───────────────────────────────
const LevelBadge = ({ level }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      LEVEL_COLORS[level] ?? "bg-gray-100 text-gray-700"
    )}
  >
    L{level ?? "—"}
  </span>
);

const TypeBadge = ({ leaf }) => (
  <Badge
    className={
      leaf
        ? "border-green-200 bg-green-100 text-green-700"
        : "border-gray-200 bg-gray-100 text-gray-600"
    }
  >
    {leaf ? "Leaf" : "Parent"}
  </Badge>
);

// ── Action icon button with tooltip ──────────────────────────────────────────
// Wrapped in a span so the tooltip still shows if the button is ever disabled.
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
  <div aria-busy="true" aria-label="Loading accounts">
    {Array.from({ length: 8 }).map((_, i) =>
      phone ? (
        <div key={i} className="min-h-[56px] space-y-2 border-b border-gray-200 px-4 py-2">
          <div className="flex justify-between">
            <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-14 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-12 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ) : (
        <div key={i} className="flex h-12 items-center gap-6 border-b border-gray-200 px-3">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[220px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[90px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[40px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[60px] animate-pulse rounded bg-gray-100" />
          <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-[40px] animate-pulse rounded bg-gray-100" />
        </div>
      )
    )}
  </div>
);

export default function ChartList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Phone: one row expanded at a time
  const [expandedId, setExpandedId] = useState(null);

  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);

  const [containerRef, containerWidth] = useContainerWidth();
  const isPhone = containerWidth > 0 && containerWidth < PHONE_BREAKPOINT;

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canView = useHasPermission(CHART_PERMS.VIEW);
  const canCreate = useHasPermission(CHART_PERMS.CREATE);
  const canEdit = useHasPermission(CHART_PERMS.EDIT);

  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useChartOfAccounts();

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsUpdateSheetOpen(true);
  };

  const editLabel = (a) => `Edit ${cleanName(a.ACCOUNT_NAME) || `account ${a.ACCOUNT_ID}`}`;

  // ── Columns ────────────────────────────────────────────────────────────────
  // Classified: identity = Account ID + Account Name (pinned left with the checkbox),
  // state = Level / Type badges, meta = Root / Full Path (flexible), action = pinned right.
  // meta: { align, pin, flex, stopRowClick }. Pinned columns need a fixed width.
  const columns = [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      enableHiding: false,
      meta: { pin: "left", align: "center", stopRowClick: true },
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all rows on this page"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "ACCOUNT_ID",
      size: 120,
      enableHiding: false,
      meta: { pin: "left" },
      header: ({ column }) => <SortableHeader column={column} label="Account ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-500">
          {row.getValue("ACCOUNT_ID") ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "ACCOUNT_NAME",
      size: 300,
      enableHiding: false,
      meta: { pin: "left" },
      header: ({ column }) => <SortableHeader column={column} label="Account Name" />,
      cell: ({ row }) => {
        const level = Number(row.original.LEBEL) || 1;
        const name = cleanName(row.getValue("ACCOUNT_NAME"));
        const indent = (level - 1) * 16;
        return (
          <div
            className="truncate text-sm font-medium text-gray-800"
            style={{ paddingLeft: `${indent}px` }}
            title={name || undefined}
          >
            {name || "—"}
          </div>
        );
      },
      filterFn: (row, _, filterValue) =>
        String(row.getValue("ACCOUNT_NAME"))
          .trim()
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
    },
    {
      accessorKey: "ROOT_ACCOUNT",
      size: 130,
      header: () => <PlainHeader label="Root" />,
      cell: ({ row }) => {
        const v = row.getValue("ROOT_ACCOUNT");
        return v ? (
          <Badge
            variant="outline"
            title={String(v)}
            className="max-w-full justify-start truncate border-gray-200 bg-white text-xs font-normal text-gray-600"
          >
            {v}
          </Badge>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      },
    },
    {
      accessorKey: "LEBEL",
      size: 90,
      header: () => <PlainHeader label="Level" />,
      cell: ({ row }) => <LevelBadge level={row.getValue("LEBEL")} />,
    },
    {
      accessorKey: "IS_LEAF",
      size: 110,
      header: () => <PlainHeader label="Type" />,
      cell: ({ row }) => <TypeBadge leaf={isLeafRow(row.original)} />,
    },
    {
      accessorKey: "FULL_PATH",
      size: 260, // min-width only; this column absorbs the slack
      meta: { flex: true },
      header: () => <PlainHeader label="Full Path" />,
      cell: ({ row }) => {
        const path = cleanPath(row.getValue("FULL_PATH"));
        return (
          <div className="truncate text-xs text-gray-400" title={path || undefined}>
            {path || "—"}
          </div>
        );
      },
    },
    // ── Actions column: only rendered if user can edit ──
    ...(canEdit
      ? [
          {
            id: "actions",
            size: 90,
            enableHiding: false,
            meta: { pin: "right", align: "center", stopRowClick: true },
            header: () => <PlainHeader label="Actions" align="center" />,
            cell: ({ row }) => {
              const account = row.original;
              return (
                <div className="flex items-center justify-center">
                  <RowAction
                    label={editLabel(account)}
                    className="hover:bg-violet-50 hover:text-violet-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(account);
                    }}
                  >
                    <IconEdit className="h-4 w-4" />
                  </RowAction>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data: accounts,
    columns,
    getRowId: (r) => String(r.ACCOUNT_ID),
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
    autoResetPageIndex: false,
    enableMultiSort: false,
  });

  // View permission na thakle kichui dekhabe na (shob hooks er pore early return)
  if (!canView) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
          <ShieldAlert className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-800">Access denied</p>
          <p className="text-xs text-gray-500 mt-1">
            You don't have permission to view chart of accounts.
          </p>
        </div>
      </div>
    );
  }

  const pageRows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const tableMinWidth = visibleColumns.reduce((sum, c) => sum + c.getSize(), 0);
  const selectedCount = table.getSelectedRowModel().rows.length;
  const hasActiveFilter = !!globalFilter;

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
          <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
          <EmptyTitle>
            {hasActiveFilter ? "No accounts match your search" : "No accounts yet"}
          </EmptyTitle>
        </EmptyHeader>
        <div className="mt-3 flex justify-center">
          {hasActiveFilter ? (
            <Button variant="outline" size="sm" onClick={() => setGlobalFilter("")}>
              Clear search
            </Button>
          ) : canCreate ? (
            <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add first account
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
        <AlertTitle>Error Loading Accounts</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load accounts."}</p>
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
    { id: "ACCOUNT_ID", label: "Account ID" },
    { id: "ACCOUNT_NAME", label: "Account Name" },
  ];
  const currentSort = sorting[0];

  const phoneList = (
    <div>
      {/* Sorting moves to a control above the list */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2">
        <label htmlFor="chart-sort" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort
        </label>
        <select
          id="chart-sort"
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
          const a = row.original;
          const open = expandedId === row.id;
          const level = Number(a.LEBEL) || 1;
          const path = cleanPath(a.FULL_PATH);
          return (
            <li key={row.id} className={cn(row.getIsSelected() && SELECTED_BG)}>
              <div className="flex items-center">
                {/* 44px touch target for selection, outside the expand button */}
                <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    aria-label="Select row"
                  />
                </label>

                {/* Line 1: identity left, state right. Line 2: id, root, level */}
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setExpandedId(open ? null : row.id)}
                  className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 py-2 pr-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="min-w-0 truncate text-sm font-medium text-gray-800"
                        style={{ paddingLeft: `${Math.min(level - 1, 3) * 12}px` }}
                      >
                        {cleanName(a.ACCOUNT_NAME) || "—"}
                      </span>
                      <TypeBadge leaf={isLeafRow(a)} />
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-xs text-gray-500">
                      <span className="truncate font-mono">
                        {a.ACCOUNT_ID ?? "—"}
                        {a.ROOT_ACCOUNT ? ` · ${a.ROOT_ACCOUNT}` : ""}
                      </span>
                      <LevelBadge level={a.LEBEL} />
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
                      <dt className="text-gray-500">Full Path</dt>
                      <dd className="break-words text-gray-800">{path || "—"}</dd>
                    </dl>
                    {canEdit && (
                      <Button
                        variant="outline"
                        className="h-10 w-full border-gray-200 bg-white"
                        tabIndex={open ? 0 : -1}
                        onClick={() => handleEdit(a)}
                      >
                        <IconEdit className="mr-2 h-4 w-4" />Edit
                      </Button>
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
                <BookOpen size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Chart of Account</h2>
                <p className="text-xs text-gray-400">{accounts.length} total accounts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              {canCreate && (
                <Button onClick={() => setIsAddSheetOpen(true)}>
                  <IconCircleDashedPlus className="mr-1" />Add Account
                </Button>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or account ID..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                />
              </div>
              {/* Column Visibility (hide, never delete) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto bg-white border-gray-200">
                    Columns
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

            {/* Table area — width of this box decides table vs phone rows */}
            <div ref={containerRef} className="min-w-0 max-w-full overflow-hidden rounded-md border border-gray-200 bg-white">
              {tableContent}
            </div>

            <DataTablePagination table={table} />
          </div>
        </div>

        {isAddSheetOpen && (
          <AddChartSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
        )}
        {isUpdateSheetOpen && (
          <UpdateChartSheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} account={selectedAccount} />
        )}
        <ConfirmationDialog />
      </div>
    </TooltipProvider>
  );
}