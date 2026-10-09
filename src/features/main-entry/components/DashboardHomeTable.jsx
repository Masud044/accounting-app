
// // "use client";

// // import * as React from "react";
// // import {
// //   flexRender,
// //   getCoreRowModel,
// //   getFilteredRowModel,
// //   getPaginationRowModel,
// //   getSortedRowModel,
// //   useReactTable,
// // } from "@tanstack/react-table";

// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";
// // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // import { Link } from "react-router-dom";
// // import {
// //   Pencil,
// //   ArrowUpDown,
// //   ChevronDown,
// //   FileUser,
// //   CheckCircle,
// //   BadgeCheck,
// //   Search,
// //   ReceiptText,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import {
// //   DropdownMenu,
// //   DropdownMenuCheckboxItem,
// //   DropdownMenuContent,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from "@/components/ui/alert-dialog";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import axios from "axios";
// // import { useHasPermission } from "@/hooks/use-permission";

// // const getVoucherTypeLabel = (type) => {
// //   switch (String(type)) {
// //     case "1": return "Receive";
// //     case "2": return "Payment";
// //     case "3": return "Journal";
// //     case "4": return "Bank Transfer";
// //     default: return "Unknown";
// //   }
// // };

// // const getEditRoute = (type, id) => {
// //   switch (String(type)) {
// //     case "1": return `/dashboard/receive-edit/${id}`;
// //     case "2": return `/dashboard/payment-edit/${id}`;
// //     case "3": return `/dashboard/journal-edit/${id}`;
// //     default: return `/dashboard/cash-transfer`;
// //   }
// // };

// // const formatDate = (value) => {
// //   if (!value) return "—";
// //   const date = new Date(value);
// //   if (isNaN(date.getTime())) return value;
// //   const yyyy = date.getFullYear();
// //   const mm = String(date.getMonth() + 1).padStart(2, "0");
// //   const dd = String(date.getDate()).padStart(2, "0");
// //   return `${yyyy}-${mm}-${dd}`;
// // };

// // // ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
// // const toISODateString = (val) => {
// //   if (!val) return null;
// //   const d = new Date(val);
// //   if (isNaN(d.getTime())) return null;
// //   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// // };

// // // Voucher type options for the filter dropdown
// // const VOUCHER_TYPE_OPTIONS = [
// //   { value: "1", label: "Receive" },
// //   { value: "2", label: "Payment" },
// //   { value: "3", label: "Journal" },
// //   { value: "4", label: "Bank Transfer" },
// // ];

// // // Reusable sortable header — clean uppercase gray style
// // const SortableHeader = ({ column, label }) => (
// //   <Button
// //     variant="ghost"
// //     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
// //     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
// //   >
// //     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
// //   </Button>
// // );

// // // approvedIds: locally tracked approved IDs Set
// // const createColumns = (setConfirmId, approvedIds, canEdit, canApprove) => [
// //   {
// //     id: "select",
// //     header: ({ table }) => (
// //       <Checkbox
// //         checked={
// //           table.getIsAllPageRowsSelected() ||
// //           (table.getIsSomePageRowsSelected() && "indeterminate")
// //         }
// //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
// //         aria-label="Select all"
// //       />
// //     ),
// //     cell: ({ row }) => (
// //       <Checkbox
// //         checked={row.getIsSelected()}
// //         onCheckedChange={(value) => row.toggleSelected(!!value)}
// //         aria-label="Select row"
// //       />
// //     ),
// //     enableSorting: false,
// //     enableHiding: false,
// //   },
// //   {
// //     accessorKey: "VOUCHER_TYPE",
// //     header: ({ column }) => <SortableHeader column={column} label="Voucher Type" />,
// //     cell: ({ row }) => {
// //       const type = row.getValue("VOUCHER_TYPE");
// //       const colorMap = {
// //         1: "text-green-800 bg-green-100",
// //         2: "text-red-800 bg-red-100",
// //         3: "text-blue-800 bg-blue-100",
// //         4: "text-purple-800 bg-purple-100",
// //       };
// //       return (
// //         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[type] || "text-gray-800 bg-gray-100"}`}>
// //           {getVoucherTypeLabel(type)}
// //         </span>
// //       );
// //     },
// //   },
// //   {
// //     accessorKey: "VOUCHERNO",
// //     header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
// //     cell: ({ row }) => <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>,
// //   },
// //   {
// //     accessorKey: "GL_ENTRY_DATE",
// //     header: ({ column }) => <SortableHeader column={column} label="Gl Date" />,
// //     cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{formatDate(row.getValue("GL_ENTRY_DATE"))}</div>,
// //   },
// //   {
// //     accessorKey: "DESCRIPTION",
// //     header: ({ column }) => <SortableHeader column={column} label="Description" />,
// //     cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("DESCRIPTION")}</div>,
// //   },
// //   {
// //     id: "AMOUNT",
// //     header: () => (
// //       <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Debit/Credit</div>
// //     ),
// //     cell: ({ row }) => {
// //       const item = row.original;
// //       const debit = parseFloat(item.TOTAL_DEBIT || 0);
// //       const credit = parseFloat(item.TOTAL_CREDIT || 0);
// //       const amount = debit !== 0 ? debit : credit;
// //       const formatted = new Intl.NumberFormat("en-US", {
// //         minimumFractionDigits: 2,
// //         maximumFractionDigits: 2,
// //       }).format(amount);
// //       return <div className="ml-3 text-sm font-semibold text-gray-800">{formatted}</div>;
// //     },
// //   },
// //   {
// //     id: "actions",
// //     enableHiding: false,
// //     header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>,
// //     cell: ({ row }) => {
// //       const item = row.original;
// //       const editRoute = getEditRoute(item.VOUCHER_TYPE, item.ID);

// //       const isApproved =
// //         item.POSTED === 1 ||
// //         item.POSTED === "1" ||
// //         approvedIds.has(item.ID);

// //       if (isApproved) {
// //         return (
// //           <div className="flex items-center justify-center gap-3">
// //             <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
// //               <Pencil size={16} />
// //             </Button>

// //             <TooltipProvider>
// //               <Tooltip>
// //                 <TooltipTrigger asChild>
// //                   <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
// //                     <BadgeCheck size={16} />
// //                   </span>
// //                 </TooltipTrigger>
// //                 <TooltipContent side="top" className="bg-green-700 text-white text-xs">
// //                   Approved
// //                 </TooltipContent>
// //               </Tooltip>
// //             </TooltipProvider>
// //           </div>
// //         );
// //       }

// //       return (
// //         <div className="flex items-center justify-center gap-3">
// //           <TooltipProvider>
// //             {canEdit && (
// //               <Tooltip>
// //                 <TooltipTrigger asChild>
// //                   <Link to={editRoute}>
// //                     <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
// //                       <Pencil size={16} />
// //                     </Button>
// //                   </Link>
// //                 </TooltipTrigger>
// //                 <TooltipContent side="top">Edit Voucher</TooltipContent>
// //               </Tooltip>
// //             )}

// //             {canApprove && (
// //               <Tooltip>
// //                 <TooltipTrigger asChild>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="text-green-600 hover:text-green-800 hover:bg-green-50"
// //                     onClick={() => setConfirmId(item.ID)}
// //                   >
// //                     <FileUser size={16} />
// //                   </Button>
// //                 </TooltipTrigger>
// //                 <TooltipContent side="top" className="bg-green-700 text-white text-xs">
// //                   Approve Voucher
// //                 </TooltipContent>
// //               </Tooltip>
// //             )}
// //           </TooltipProvider>
// //         </div>
// //       );
// //     },
// //   },
// // ];

// // const url = import.meta.env.VITE_API_BASE_URL;

// // export function DashboardHomeTable() {
// //   const queryClient = useQueryClient();

// //   const [confirmId, setConfirmId] = React.useState(null);
// //   const [isApproving, setIsApproving] = React.useState(false);

// //   const canEdit    = useHasPermission("HOME_VOUCHER_EDIT");
// //   const canApprove = useHasPermission("HOME_VOUCHER_APPROVE");
// //   const canDelete  = useHasPermission("HOME_VOUCHER_DELETE");

// //   const [approvedIds, setApprovedIds] = React.useState(new Set());
// //   const [voucherTypeFilter, setVoucherTypeFilter] = React.useState("all");
// //   const [glDateFrom, setGlDateFrom] = React.useState("");
// //   const [glDateTo, setGlDateTo] = React.useState("");

// //   const { data, isLoading, error } = useQuery({
// //     queryKey: ["unpostedVouchers"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/info-list`);
// //       return res.data;
// //     },
// //   });

// //   const apiData = Array.isArray(data?.vouchers) ? data.vouchers : [];

// //   // ── Apply voucher type + GL date range filter before passing data to the table ──
// //   const filteredData = React.useMemo(() => {
// //     return apiData.filter((v) => {
// //       if (voucherTypeFilter !== "all" && String(v.VOUCHER_TYPE) !== voucherTypeFilter) {
// //         return false;
// //       }

// //       if (glDateFrom || glDateTo) {
// //         const d = toISODateString(v.GL_ENTRY_DATE);
// //         if (!d) return false;
// //         if (glDateFrom && d < glDateFrom) return false;
// //         if (glDateTo && d > glDateTo) return false;
// //       }
// //       return true;
// //     });
// //   }, [apiData, voucherTypeFilter, glDateFrom, glDateTo]);

// //   const [sorting, setSorting] = React.useState([]);
// //   const [columnFilters, setColumnFilters] = React.useState([]);
// //   const [columnVisibility, setColumnVisibility] = React.useState({});
// //   const [rowSelection, setRowSelection] = React.useState({});

// //   const handleActivateVoucher = async () => {
// //     if (!confirmId) return;
// //     setIsApproving(true);
// //     try {
// //       const res = await axios.get(`${url}/api/active-voucher?id=${confirmId}`);
// //       if (res.data.success) {
// //         setApprovedIds((prev) => new Set([...prev, confirmId]));
// //         queryClient.invalidateQueries(["unpostedVouchers"]);
// //       } else {
// //         alert(res.data.message || "Failed to approve voucher");
// //       }
// //     } catch (error) {
// //       alert("Something went wrong: " + error.message);
// //     } finally {
// //       setIsApproving(false);
// //       setConfirmId(null);
// //     }
// //   };

// //   const columns = React.useMemo(
// //     () => createColumns(setConfirmId, approvedIds, canEdit, canApprove, canDelete),
// //     [approvedIds, canEdit, canApprove, canDelete]
// //   );

// //   const table = useReactTable({
// //     data: filteredData,
// //     columns,
// //     onSortingChange: setSorting,
// //     onColumnFiltersChange: setColumnFilters,
// //     getCoreRowModel: getCoreRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     onColumnVisibilityChange: setColumnVisibility,
// //     onRowSelectionChange: setRowSelection,
// //     initialState: {
// //       pagination: {
// //         pageSize: 50,
// //       },
// //     },
// //     state: { sorting, columnFilters, columnVisibility, rowSelection },
// //   });

// //   return (
// //     <div className="p-4 md:p-6">
// //       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
// //         {/* Approve Confirmation Dialog */}
// //         <AlertDialog
// //           open={!!confirmId}
// //           onOpenChange={() => !isApproving && setConfirmId(null)}
// //         >
// //           <AlertDialogContent>
// //             <AlertDialogHeader>
// //               <AlertDialogTitle className="flex items-center gap-2">
// //                 <CheckCircle className="text-green-600" size={20} />
// //                 Approve Voucher?
// //               </AlertDialogTitle>
// //               <AlertDialogDescription>
// //                 Voucher ID <strong>{confirmId}</strong> will be permanently approved.{" "}
// //                 <span className="text-red-500 font-medium">This action cannot be undone.</span>{" "}
// //                 Please confirm before proceeding.
// //               </AlertDialogDescription>
// //             </AlertDialogHeader>
// //             <AlertDialogFooter>
// //               <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
// //               <AlertDialogAction
// //                 onClick={handleActivateVoucher}
// //                 disabled={isApproving}
// //                 className="bg-green-600 hover:bg-green-700"
// //               >
// //                 {isApproving ? "Approving..." : "Yes, Approve"}
// //               </AlertDialogAction>
// //             </AlertDialogFooter>
// //           </AlertDialogContent>
// //         </AlertDialog>

// //         {/* Header */}
// //         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
// //           <div className="flex items-center gap-2">
// //             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600">
// //               <ReceiptText size={16} />
// //             </div>
// //             <div>
// //               <h2 className="text-sm font-bold text-gray-900">Home Voucher</h2>
// //               <p className="text-xs text-gray-400">
// //                 {filteredData.length} of {apiData.length} — unposted vouchers
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="p-5 space-y-4">
// //           {/* Search + Voucher Type filter + GL Date range + Column Toggle */}
// //           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
// //             <div className="relative max-w-sm w-full">
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //               <Input
// //                 placeholder="Filter voucher no..."
// //                 value={table.getColumn("VOUCHERNO")?.getFilterValue() ?? ""}
// //                 onChange={(e) =>
// //                   table.getColumn("VOUCHERNO")?.setFilterValue(e.target.value)
// //                 }
// //                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
// //               />
// //             </div>

// //             <div className="flex flex-col gap-1.5 w-full sm:w-48">
// //               <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
// //                 <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-blue-300">
// //                   <SelectValue placeholder="All types" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="all">All Types</SelectItem>
// //                   {VOUCHER_TYPE_OPTIONS.map((opt) => (
// //                     <SelectItem key={opt.value} value={opt.value}>
// //                       {opt.label}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             {/* GL From Date */}
// //             <div className="flex items-center gap-2 w-full sm:w-auto">
// //               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                 Gl From Date
// //               </label>
// //               <div className="relative w-full sm:w-40">
// //                 <Input
// //                   type="date"
// //                   value={glDateFrom}
// //                   max={glDateTo || undefined}
// //                   onChange={(e) => setGlDateFrom(e.target.value)}
// //                   className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// //                 />
// //                 {glDateFrom && (
// //                   <button
// //                     type="button"
// //                     onClick={() => setGlDateFrom("")}
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
// //                     title="Clear from date"
// //                   >
// //                     ✕
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             {/* GL To Date */}
// //             <div className="flex items-center gap-2 w-full sm:w-auto">
// //               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                 To Date
// //               </label>
// //               <div className="relative w-full sm:w-40">
// //                 <Input
// //                   type="date"
// //                   value={glDateTo}
// //                   min={glDateFrom || undefined}
// //                   onChange={(e) => setGlDateTo(e.target.value)}
// //                   className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// //                 />
// //                 {glDateTo && (
// //                   <button
// //                     type="button"
// //                     onClick={() => setGlDateTo("")}
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
// //                     title="Clear to date"
// //                   >
// //                     ✕
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
// //                   Columns <ChevronDown className="ml-2 h-4 w-4" />
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent align="end">
// //                 {table
// //                   .getAllColumns()
// //                   .filter((col) => col.getCanHide())
// //                   .map((column) => (
// //                     <DropdownMenuCheckboxItem
// //                       key={column.id}
// //                       className="capitalize"
// //                       checked={column.getIsVisible()}
// //                       onCheckedChange={(value) => column.toggleVisibility(!!value)}
// //                     >
// //                       {column.id}
// //                     </DropdownMenuCheckboxItem>
// //                   ))}
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>

// //           {/* Table */}
// //           <div className="overflow-hidden rounded-md border border-gray-200">
// //             <Table>
// //               <TableHeader className="bg-gray-50">
// //                 {table.getHeaderGroups().map((group) => (
// //                   <TableRow key={group.id}>
// //                     {group.headers.map((header) => (
// //                       <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //                         {header.isPlaceholder
// //                           ? null
// //                           : flexRender(header.column.columnDef.header, header.getContext())}
// //                       </TableHead>
// //                     ))}
// //                   </TableRow>
// //                 ))}
// //               </TableHeader>
// //               <TableBody>
// //                 {isLoading && (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-gray-500">
// //                       Loading...
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //                 {error && (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="text-center h-24 text-red-600 text-sm">
// //                       Error: {error.message}
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //                 {!isLoading && !error &&
// //                   table.getRowModel().rows.map((row) => (
// //                     <TableRow
// //                       key={row.id}
// //                       data-state={row.getIsSelected() && "selected"}
// //                       className="hover:bg-gray-50/70 transition-colors"
// //                     >
// //                       {row.getVisibleCells().map((cell) => (
// //                         <TableCell key={cell.id} className="text-sm text-gray-700">
// //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                         </TableCell>
// //                       ))}
// //                     </TableRow>
// //                   ))}
// //                 {!isLoading && !error && table.getRowModel().rows.length === 0 && (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-gray-500">
// //                       No results.
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>

// //           <DataTablePagination table={table} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import * as React from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import {
//   Pencil,
//   ArrowUpDown,
//   ChevronDown,
//   FileUser,
//   CheckCircle,
//   BadgeCheck,
//   Search,
//   ReceiptText,
//   Eye,
//   Upload,
//   X,
//   FileText,
//   Paperclip as PaperclipIcon,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
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
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useHasPermission } from "@/hooks/use-permission";
// // ⚠️ Path ta tomar folder structure onujayi thik kore nio (payment table-er same component)
// import { EntryTypeBadge } from "./entry-type-badge";
// import { AttachmentIndicator } from "./attachment-indicator";

// const url = import.meta.env.VITE_API_BASE_URL;

// const getVoucherTypeLabel = (type) => {
//   switch (String(type)) {
//     case "1": return "Receive";
//     case "2": return "Payment";
//     case "3": return "Journal";
//     case "4": return "Bank Transfer";
//     default: return "Unknown";
//   }
// };

// const VOUCHER_TYPE_COLOR = {
//   1: "text-green-800 bg-green-100",
//   2: "text-red-800 bg-red-100",
//   3: "text-blue-800 bg-blue-100",
//   4: "text-purple-800 bg-purple-100",
// };

// const getEditRoute = (type, id) => {
//   switch (String(type)) {
//     case "1": return `/dashboard/receive-edit/${id}`;
//     case "2": return `/dashboard/payment-edit/${id}`;
//     case "3": return `/dashboard/journal-edit/${id}`;
//     default: return `/dashboard/cash-transfer`;
//   }
// };

// const formatDate = (value) => {
//   if (!value) return "—";
//   const date = new Date(value);
//   if (isNaN(date.getTime())) return value;
//   const yyyy = date.getFullYear();
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// };

// const formatMoney = (n) =>
//   new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(n || 0));

// // ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
// const toISODateString = (val) => {
//   if (!val) return null;
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return null;
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// // Voucher type options for the filter dropdown
// const VOUCHER_TYPE_OPTIONS = [
//   { value: "1", label: "Receive" },
//   { value: "2", label: "Payment" },
//   { value: "3", label: "Journal" },
//   { value: "4", label: "Bank Transfer" },
// ];

// const isRowApproved = (item, approvedIds) =>
//   item.POSTED === 1 || item.POSTED === "1" || approvedIds.has(item.ID);

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

// // approvedIds: locally tracked approved IDs Set
// const createColumns = ({
//   setConfirmId,
//   approvedIds,
//   canEdit,
//   canApprove,
//   onUpload,
//   onReview,
// }) => [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "VOUCHER_TYPE",
//     header: ({ column }) => <SortableHeader column={column} label="Voucher Type" />,
//     cell: ({ row }) => {
//       const type = row.getValue("VOUCHER_TYPE");
//       return (
//         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${VOUCHER_TYPE_COLOR[type] || "text-gray-800 bg-gray-100"}`}>
//           {getVoucherTypeLabel(type)}
//         </span>
//       );
//     },
//   },
//   {
//     accessorKey: "VOUCHERNO",
//     header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
//     cell: ({ row }) => <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>,
//   },
//   {
//     accessorKey: "GL_ENTRY_DATE",
//     header: ({ column }) => <SortableHeader column={column} label="Gl Date" />,
//     cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{formatDate(row.getValue("GL_ENTRY_DATE"))}</div>,
//   },
//   {
//     accessorKey: "DESCRIPTION",
//     header: ({ column }) => <SortableHeader column={column} label="Description" />,
//     cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("DESCRIPTION")}</div>,
//   },
//   {
//     id: "AMOUNT",
//     header: () => (
//       <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Debit/Credit</div>
//     ),
//     cell: ({ row }) => {
//       const item = row.original;
//       const debit = parseFloat(item.TOTAL_DEBIT || 0);
//       const credit = parseFloat(item.TOTAL_CREDIT || 0);
//       const amount = debit !== 0 ? debit : credit;
//       return <div className="ml-3 text-sm font-semibold text-gray-800">{formatMoney(amount)}</div>;
//     },
//   },
//   // ── Entry Type (NORMAL / REVERSE ...) ──
//   {
//     id: "type",
//     header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</div>,
//     cell: ({ row }) => (
//       <div className="flex justify-center">
//         <EntryTypeBadge type={row.original.TYPE} />
//       </div>
//     ),
//   },
//   // ── Invoice Count ──
//   {
//     id: "attachment",
//     header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Count</div>,
//     cell: ({ row }) => (
//       <div className="flex justify-center">
//         <AttachmentIndicator count={row.original.DOC_COUNT} />
//       </div>
//     ),
//   },
//   // ── Upload Invoice ──
//   {
//     id: "uploadInvoice",
//     header: () => (
//       <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Invoice</div>
//     ),
//     cell: ({ row }) => {
//       const item = row.original;
//       const approved = isRowApproved(item, approvedIds);
//       return (
//         <div className="flex justify-center">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
//                   onClick={() => onUpload(item)}
//                   disabled={approved}
//                 >
//                   <Upload size={16} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">
//                 {approved ? "Cannot upload (approved)" : "Upload Invoice"}
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       );
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>,
//     cell: ({ row }) => {
//       const item = row.original;
//       const editRoute = getEditRoute(item.VOUCHER_TYPE, item.ID);
//       const approved = isRowApproved(item, approvedIds);

//       // ✅ Approved → Edit er jaygay "Review" (read-only modal) + Approved badge
//       if (approved) {
//         return (
//           <div className="flex items-center justify-center gap-2">
//             <TooltipProvider>
//               {canEdit && (
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
//                       onClick={() => onReview(item)}
//                     >
//                       <Eye size={16} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent side="top">Review Voucher</TooltipContent>
//                 </Tooltip>
//               )}

//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
//                     <BadgeCheck size={16} />
//                   </span>
//                 </TooltipTrigger>
//                 <TooltipContent side="top" className="bg-green-700 text-white text-xs">
//                   Approved
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         );
//       }

//       return (
//         <div className="flex items-center justify-center gap-3">
//           <TooltipProvider>
//             {canEdit && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Link to={editRoute}>
//                     <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
//                       <Pencil size={16} />
//                     </Button>
//                   </Link>
//                 </TooltipTrigger>
//                 <TooltipContent side="top">Edit Voucher</TooltipContent>
//               </Tooltip>
//             )}

//             {canApprove && (
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-green-600 hover:text-green-800 hover:bg-green-50"
//                     onClick={() => setConfirmId(item.ID)}
//                   >
//                     <FileUser size={16} />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent side="top" className="bg-green-700 text-white text-xs">
//                   Approve Voucher
//                 </TooltipContent>
//               </Tooltip>
//             )}
//           </TooltipProvider>
//         </div>
//       );
//     },
//   },
// ];

// export function DashboardHomeTable() {
//   const queryClient = useQueryClient();

//   const [confirmId, setConfirmId] = React.useState(null);
//   const [isApproving, setIsApproving] = React.useState(false);

//   const canEdit    = useHasPermission("HOME_VOUCHER_EDIT");
//   const canApprove = useHasPermission("HOME_VOUCHER_APPROVE");

//   const [approvedIds, setApprovedIds] = React.useState(new Set());
//   const [voucherTypeFilter, setVoucherTypeFilter] = React.useState("all");
//   const [glDateFrom, setGlDateFrom] = React.useState("");
//   const [glDateTo, setGlDateTo] = React.useState("");

//   // ── Upload state ──
//   const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
//   const [selectedVoucher, setSelectedVoucher] = React.useState(null);
//   const [selectedFiles, setSelectedFiles] = React.useState([]);
//   const [uploading, setUploading] = React.useState(false);

//   // ── Review state ──
//   const [reviewVoucher, setReviewVoucher] = React.useState(null);

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["unpostedVouchers"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/info-list`);
//       return res.data;
//     },
//   });

//   const apiData = Array.isArray(data?.vouchers) ? data.vouchers : [];

//   // ── Existing docs for the Upload dialog ──
//   const { data: existingDocs = [], refetch: refetchDocs } = useQuery({
//     queryKey: ["gldocs", selectedVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/gldoc`, {
//         params: { glmaster_id: selectedVoucher.ID },
//       });
//       return res.data.data || [];
//     },
//     enabled: !!selectedVoucher,
//   });

//   // ── Upload mutation ──
//   const uploadMutation = useMutation({
//     mutationFn: async ({ voucherId, files }) => {
//       const uploads = files.map((file) => {
//         const fd = new FormData();
//         fd.append("doc_file", file);
//         fd.append("GLMASTERID", voucherId);
//         return axios.post(`${url}/api/gldoc`, fd);
//       });
//       return await Promise.all(uploads);
//     },
//     onSuccess: async () => {
//       toast.success("Invoice uploaded successfully!");
//       setSelectedFiles([]);
//       await refetchDocs();
//       queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
//     },
//     onError: (err) => {
//       toast.error("Failed to upload invoice: " + (err.response?.data?.message || err.message));
//     },
//     onSettled: () => setUploading(false),
//   });

//   // ── Delete document mutation ──
//   const deleteDocMutation = useMutation({
//     mutationFn: async (docId) => {
//       await axios.delete(`${url}/api/gldoc/${docId}`);
//     },
//     onSuccess: async () => {
//       toast.success("Document deleted successfully!");
//       await refetchDocs();
//       queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
//     },
//     onError: (err) => {
//       toast.error("Failed to delete document: " + (err.response?.data?.message || err.message));
//     },
//   });

//   // ── Review modal: master + details (all voucher types) ──
//   const { data: reviewData, isLoading: reviewLoading } = useQuery({
//     queryKey: ["voucherReview", reviewVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/voucher-review/${reviewVoucher.ID}`);
//       return res.data;
//     },
//     enabled: !!reviewVoucher,
//   });

//   // ── Review modal: attachments ──
//   const { data: reviewDocs = [] } = useQuery({
//     queryKey: ["gldocs", "review", reviewVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/gldoc`, {
//         params: { glmaster_id: reviewVoucher.ID },
//       });
//       return res.data.data || [];
//     },
//     enabled: !!reviewVoucher,
//   });

//   const distributionRows = React.useMemo(() => {
//     const details = reviewData?.details || [];
//     return details
//       .map((d) => ({
//         id: d.ID ?? d.id,
//         code: d.CODE ?? d.code ?? "",
//         codedescription: d.CODEDESCRIPTION ?? d.codedescription ?? "",
//         description: d.DESCRIPTION ?? d.description ?? "",
//         debit: Number(d.DEBIT ?? d.debit ?? 0),
//         credit: Number(d.CREDIT ?? d.credit ?? 0),
//       }))
//       .filter((d) => d.debit > 0 || d.credit > 0);
//   }, [reviewData]);

//   const totalDebit = distributionRows.reduce((s, d) => s + d.debit, 0);
//   const totalCredit = distributionRows.reduce((s, d) => s + d.credit, 0);

//   // ── Apply voucher type + GL date range filter before passing data to the table ──
//   const filteredData = React.useMemo(() => {
//     return apiData.filter((v) => {
//       if (voucherTypeFilter !== "all" && String(v.VOUCHER_TYPE) !== voucherTypeFilter) {
//         return false;
//       }

//       if (glDateFrom || glDateTo) {
//         const d = toISODateString(v.GL_ENTRY_DATE);
//         if (!d) return false;
//         if (glDateFrom && d < glDateFrom) return false;
//         if (glDateTo && d > glDateTo) return false;
//       }
//       return true;
//     });
//   }, [apiData, voucherTypeFilter, glDateFrom, glDateTo]);

//   const [sorting, setSorting] = React.useState([]);
//   const [columnFilters, setColumnFilters] = React.useState([]);
//   const [columnVisibility, setColumnVisibility] = React.useState({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   const handleActivateVoucher = async () => {
//     if (!confirmId) return;
//     setIsApproving(true);
//     try {
//       const res = await axios.get(`${url}/api/active-voucher?id=${confirmId}`);
//       if (res.data.success) {
//         setApprovedIds((prev) => new Set([...prev, confirmId]));
//         queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
//       } else {
//         alert(res.data.message || "Failed to approve voucher");
//       }
//     } catch (err) {
//       alert("Something went wrong: " + err.message);
//     } finally {
//       setIsApproving(false);
//       setConfirmId(null);
//     }
//   };

//   // ── Upload handlers ──
//   const closeUploadDialog = () => {
//     setUploadDialogOpen(false);
//     setSelectedVoucher(null);
//     setSelectedFiles([]);
//   };

//   const handleUploadClick = React.useCallback((voucher) => {
//     setSelectedVoucher(voucher);
//     setSelectedFiles([]);
//     setUploadDialogOpen(true);
//   }, []);

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles((prev) => [...prev, ...files]);
//     e.target.value = ""; // same file abar select korte parbe
//   };

//   const handleRemoveFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleUploadSubmit = () => {
//     if (selectedFiles.length === 0) {
//       toast.error("Please select at least one file.");
//       return;
//     }
//     setUploading(true);
//     uploadMutation.mutate({ voucherId: selectedVoucher.ID, files: selectedFiles });
//   };

//   const columns = React.useMemo(
//     () =>
//       createColumns({
//         setConfirmId,
//         approvedIds,
//         canEdit,
//         canApprove,
//         onUpload: handleUploadClick,
//         onReview: setReviewVoucher,
//       }),
//     [approvedIds, canEdit, canApprove, handleUploadClick]
//   );

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     initialState: {
//       pagination: {
//         pageSize: 50,
//       },
//     },
//     state: { sorting, columnFilters, columnVisibility, rowSelection },
//   });

//   const reviewMaster = reviewData?.master || {};

//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Approve Confirmation Dialog */}
//         <AlertDialog
//           open={!!confirmId}
//           onOpenChange={() => !isApproving && setConfirmId(null)}
//         >
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle className="flex items-center gap-2">
//                 <CheckCircle className="text-green-600" size={20} />
//                 Approve Voucher?
//               </AlertDialogTitle>
//               <AlertDialogDescription>
//                 Voucher ID <strong>{confirmId}</strong> will be permanently approved.{" "}
//                 <span className="text-red-500 font-medium">This action cannot be undone.</span>{" "}
//                 Please confirm before proceeding.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={handleActivateVoucher}
//                 disabled={isApproving}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 {isApproving ? "Approving..." : "Yes, Approve"}
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600">
//               <ReceiptText size={16} />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">Home Voucher</h2>
//               <p className="text-xs text-gray-400">
//                 {filteredData.length} of {apiData.length} — unposted vouchers
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Search + Voucher Type filter + GL Date range + Column Toggle */}
//           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//             <div className="relative max-w-sm w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Filter voucher no..."
//                 value={table.getColumn("VOUCHERNO")?.getFilterValue() ?? ""}
//                 onChange={(e) =>
//                   table.getColumn("VOUCHERNO")?.setFilterValue(e.target.value)
//                 }
//                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5 w-full sm:w-48">
//               <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
//                 <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-blue-300">
//                   <SelectValue placeholder="All types" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   {VOUCHER_TYPE_OPTIONS.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value}>
//                       {opt.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* GL From Date */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                 Gl From Date
//               </label>
//               <div className="relative w-full sm:w-40">
//                 <Input
//                   type="date"
//                   value={glDateFrom}
//                   max={glDateTo || undefined}
//                   onChange={(e) => setGlDateFrom(e.target.value)}
//                   className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//                 />
//                 {glDateFrom && (
//                   <button
//                     type="button"
//                     onClick={() => setGlDateFrom("")}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                     title="Clear from date"
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* GL To Date */}
//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                 To Date
//               </label>
//               <div className="relative w-full sm:w-40">
//                 <Input
//                   type="date"
//                   value={glDateTo}
//                   min={glDateFrom || undefined}
//                   onChange={(e) => setGlDateTo(e.target.value)}
//                   className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//                 />
//                 {glDateTo && (
//                   <button
//                     type="button"
//                     onClick={() => setGlDateTo("")}
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
//                 {table
//                   .getAllColumns()
//                   .filter((col) => col.getCanHide())
//                   .map((column) => (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                     >
//                       {column.id}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Table */}
//           <div className="overflow-hidden rounded-md border border-gray-200">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 {table.getHeaderGroups().map((group) => (
//                   <TableRow key={group.id}>
//                     {group.headers.map((header) => (
//                       <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(header.column.columnDef.header, header.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {isLoading && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-gray-500">
//                       Loading...
//                     </TableCell>
//                   </TableRow>
//                 )}
//                 {error && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="text-center h-24 text-red-600 text-sm">
//                       Error: {error.message}
//                     </TableCell>
//                   </TableRow>
//                 )}
//                 {!isLoading && !error &&
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
//                   ))}
//                 {!isLoading && !error && table.getRowModel().rows.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-gray-500">
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           <DataTablePagination table={table} />
//         </div>
//       </div>

//       {/* ── Upload Invoice Dialog ── */}
//       <Dialog
//         open={uploadDialogOpen}
//         onOpenChange={(open) => {
//           if (uploading) return;
//           if (!open) closeUploadDialog();
//           else setUploadDialogOpen(true);
//         }}
//       >
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Upload size={18} className="text-blue-600" />
//               Upload Invoice
//             </DialogTitle>
//             <DialogDescription>
//               Upload invoice for voucher #{selectedVoucher?.VOUCHERNO}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4 py-2">
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
//               <Input
//                 type="file"
//                 multiple
//                 onChange={handleFileSelect}
//                 disabled={uploading}
//                 className="cursor-pointer"
//                 accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//               />
//               <p className="text-xs text-gray-400 mt-2">
//                 Supported: PDF, JPG, PNG, DOC (Max 5MB each)
//               </p>
//             </div>

//             {selectedFiles.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Selected Files ({selectedFiles.length})
//                 </label>
//                 <div className="max-h-40 overflow-y-auto space-y-1">
//                   {selectedFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
//                     >
//                       <div className="flex items-center gap-2">
//                         <FileText size={14} className="text-gray-400" />
//                         <span className="text-gray-700 truncate max-w-[200px]">{file.name}</span>
//                         <span className="text-xs text-gray-400">
//                           ({(file.size / 1024).toFixed(1)} KB)
//                         </span>
//                       </div>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
//                         onClick={() => handleRemoveFile(index)}
//                         disabled={uploading}
//                       >
//                         <X size={14} />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {existingDocs.length > 0 && (
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-gray-700">
//                   Existing Documents ({existingDocs.length})
//                 </label>
//                 <div className="max-h-32 overflow-y-auto space-y-1">
//                   {existingDocs.map((doc) => (
//                     <div
//                       key={doc.ID}
//                       className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 text-sm"
//                     >
//                       <a
//                         href={`${url}/api/gldoc?id=${doc.ID}&file=true`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-2 text-blue-700 hover:underline min-w-0"
//                       >
//                         <FileText size={14} className="text-blue-500 shrink-0" />
//                         <span className="truncate max-w-[200px]">
//                           {doc.FILE_NAME || `Document #${doc.ID}`}
//                         </span>
//                       </a>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0"
//                         onClick={() => deleteDocMutation.mutate(doc.ID)}
//                         disabled={uploading || deleteDocMutation.isPending}
//                       >
//                         <X size={14} />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={closeUploadDialog} disabled={uploading}>
//               Cancel
//             </Button>
//             <Button
//               type="button"
//               onClick={handleUploadSubmit}
//               disabled={selectedFiles.length === 0 || uploading}
//             >
//               {uploading ? (
//                 <>
//                   <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <Upload size={16} className="mr-2" />
//                   Upload {selectedFiles.length} file(s)
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* ── Review Voucher Modal (read-only) ── */}
//       {reviewVoucher && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <div className="flex items-center gap-2">
//                 <Eye size={18} className="text-indigo-600" />
//                 <h2 className="text-base font-bold text-gray-900">
//                   {getVoucherTypeLabel(reviewVoucher.VOUCHER_TYPE)} Voucher #{reviewVoucher.VOUCHERNO}
//                 </h2>
//               </div>
//               <div className="flex items-center gap-2">
//                 <EntryTypeBadge type={reviewVoucher.TYPE} />
//                 <button
//                   onClick={() => setReviewVoucher(null)}
//                   className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <X size={18} className="text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Voucher Type
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
//                   {getVoucherTypeLabel(reviewVoucher.VOUCHER_TYPE)}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   GL Date
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
//                   {formatDate(reviewVoucher.GL_ENTRY_DATE)}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Voucher No
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
//                   {reviewVoucher.VOUCHERNO}
//                 </div>
//               </div>
//               {reviewMaster.TRANS_DATE && (
//                 <div>
//                   <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                     Transaction Date
//                   </label>
//                   <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
//                     {formatDate(reviewMaster.TRANS_DATE)}
//                   </div>
//                 </div>
//               )}
//               <div className="md:col-span-3">
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Description
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 min-h-[42px]">
//                   {reviewVoucher.DESCRIPTION || "—"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Total Amount
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800">
//                   {formatMoney(
//                     parseFloat(reviewVoucher.TOTAL_DEBIT || 0) !== 0
//                       ? reviewVoucher.TOTAL_DEBIT
//                       : reviewVoucher.TOTAL_CREDIT
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Status
//                 </label>
//                 <div className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
//                   Approved
//                 </div>
//               </div>

//               {/* Attachments */}
//               <div className="md:col-span-3">
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Attachments
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 space-y-1.5">
//                   {reviewDocs.length === 0 ? (
//                     <span className="text-xs text-slate-500">
//                       {Number(reviewVoucher.DOC_COUNT) || 0} file(s)
//                     </span>
//                   ) : (
//                     reviewDocs.map((doc) => (
//                       <a
//                         key={doc.ID}
//                         href={`${url}/api/gldoc?id=${doc.ID}&file=true`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
//                       >
//                         <PaperclipIcon size={13} />
//                         {doc.FILE_NAME || `Document #${doc.ID}`}
//                       </a>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Account Distribution */}
//             <div className="px-6 pb-6">
//               <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
//                 Account Distribution
//               </h3>
//               <div className="overflow-hidden rounded-lg border border-slate-200">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-slate-50">
//                       <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Code</th>
//                       <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Particulars</th>
//                       <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Debit</th>
//                       <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Credit</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reviewLoading && (
//                       <tr>
//                         <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
//                           Loading account details…
//                         </td>
//                       </tr>
//                     )}
//                     {!reviewLoading && distributionRows.length === 0 && (
//                       <tr>
//                         <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
//                           No account rows found.
//                         </td>
//                       </tr>
//                     )}
//                     {!reviewLoading &&
//                       distributionRows.map((d, i) => (
//                         <tr key={d.id ?? i} className="border-t border-slate-100">
//                           <td className="px-4 py-2 text-slate-700 font-medium">{d.code}</td>
//                           <td className="px-4 py-2 text-slate-600">
//                             {d.codedescription || d.description || "—"}
//                           </td>
//                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
//                             {d.debit > 0 ? formatMoney(d.debit) : ""}
//                           </td>
//                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
//                             {d.credit > 0 ? formatMoney(d.credit) : ""}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                   {!reviewLoading && distributionRows.length > 0 && (
//                     <tfoot>
//                       <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
//                         <td colSpan={2} className="px-4 py-2 text-right text-slate-800">Total</td>
//                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatMoney(totalDebit)}</td>
//                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatMoney(totalCredit)}</td>
//                       </tr>
//                     </tfoot>
//                   )}
//                 </table>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
//               <Button
//                 variant="outline"
//                 onClick={() => setReviewVoucher(null)}
//                 className="border-slate-200 text-slate-700"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Pencil,
  ArrowUpDown,
  ChevronDown,
  FileUser,
  CheckCircle,
  BadgeCheck,
  Search,
  ReceiptText,
  Eye,
  Upload,
  X,
  FileText,
  Paperclip as PaperclipIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import axios from "axios";
import { toast } from "react-toastify";
import { useHasPermission } from "@/hooks/use-permission";
// Path ta folder structure onujayi thik kore nio (payment table-er same component)
import { EntryTypeBadge } from "./entry-type-badge";
import { AttachmentIndicator } from "./attachment-indicator";

const url = import.meta.env.VITE_API_BASE_URL;

// ── Doc delete request ──
// Backend e DELETE route kon style e ache sheta confirm hole ekhane-i change koro.
// Param style:  DELETE /api/gldoc/:id
// Query style:  DELETE /api/gldoc?id=123
const gldocDeleteRequest = (docId) =>
  axios.delete(`${url}/api/gldoc/${docId}`);
// const gldocDeleteRequest = (docId) =>
//   axios.delete(`${url}/api/gldoc`, { params: { id: docId } });

const getVoucherTypeLabel = (type) => {
  switch (String(type)) {
    case "1": return "Receive";
    case "2": return "Payment";
    case "3": return "Journal";
    case "4": return "Bank Transfer";
    default: return "Unknown";
  }
};

const VOUCHER_TYPE_COLOR = {
  1: "text-green-800 bg-green-100",
  2: "text-red-800 bg-red-100",
  3: "text-blue-800 bg-blue-100",
  4: "text-purple-800 bg-purple-100",
};

const getEditRoute = (type, id) => {
  switch (String(type)) {
    case "1": return `/dashboard/receive-edit/${id}`;
    case "2": return `/dashboard/payment-edit/${id}`;
    case "3": return `/dashboard/journal-edit/${id}`;
    default: return `/dashboard/cash-transfer`;
  }
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

// Normalize a date value to YYYY-MM-DD for comparison
const toISODateString = (val) => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Voucher type options for the filter dropdown
const VOUCHER_TYPE_OPTIONS = [
  { value: "1", label: "Receive" },
  { value: "2", label: "Payment" },
  { value: "3", label: "Journal" },
  { value: "4", label: "Bank Transfer" },
];

const isRowApproved = (item, approvedIds) =>
  item.POSTED === 1 || item.POSTED === "1" || approvedIds.has(item.ID);

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

const createColumns = ({
  setConfirmId,
  approvedIds,
  canEdit,
  canApprove,
  onUpload,
  onReview,
}) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "VOUCHER_TYPE",
    header: ({ column }) => <SortableHeader column={column} label="Voucher Type" />,
    cell: ({ row }) => {
      const type = row.getValue("VOUCHER_TYPE");
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${VOUCHER_TYPE_COLOR[type] || "text-gray-800 bg-gray-100"}`}>
          {getVoucherTypeLabel(type)}
        </span>
      );
    },
  },
  {
    accessorKey: "VOUCHERNO",
    header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
    cell: ({ row }) => <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>,
  },
  {
    accessorKey: "GL_ENTRY_DATE",
    header: ({ column }) => <SortableHeader column={column} label="Gl Date" />,
    cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{formatDate(row.getValue("GL_ENTRY_DATE"))}</div>,
  },
  {
    accessorKey: "DESCRIPTION",
    header: ({ column }) => <SortableHeader column={column} label="Description" />,
    cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("DESCRIPTION")}</div>,
  },
  {
    id: "AMOUNT",
    header: () => (
      <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Debit/Credit</div>
    ),
    cell: ({ row }) => {
      const item = row.original;
      const debit = parseFloat(item.TOTAL_DEBIT || 0);
      const credit = parseFloat(item.TOTAL_CREDIT || 0);
      const amount = debit !== 0 ? debit : credit;
      return <div className="ml-3 text-sm font-semibold text-gray-800">{formatMoney(amount)}</div>;
    },
  },
  // ── Entry Type (MANUAL / REVERSE ...) ──
  {
    id: "type",
    header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <EntryTypeBadge type={row.original.TYPE} />
      </div>
    ),
  },
  // ── Invoice Count ──
  {
    id: "attachment",
    header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Count</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <AttachmentIndicator count={row.original.DOC_COUNT} />
      </div>
    ),
  },
  // ── Upload Invoice ──
  {
    id: "uploadInvoice",
    header: () => (
      <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Invoice</div>
    ),
    cell: ({ row }) => {
      const item = row.original;
      const approved = isRowApproved(item, approvedIds);
      return (
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => onUpload(item)}
                  disabled={approved}
                >
                  <Upload size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {approved ? "Cannot upload (approved)" : "Upload Invoice"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>,
    cell: ({ row }) => {
      const item = row.original;
      const editRoute = getEditRoute(item.VOUCHER_TYPE, item.ID);
      const approved = isRowApproved(item, approvedIds);

      // Approved → Edit er jaygay "Review" (read-only modal) + Approved badge
      if (approved) {
        return (
          <div className="flex items-center justify-center gap-2">
            <TooltipProvider>
              {canEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => onReview(item)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Review Voucher</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
                    <BadgeCheck size={16} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-green-700 text-white text-xs">
                  Approved
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center gap-3">
          <TooltipProvider>
            {canEdit && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={editRoute}>
                    <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                      <Pencil size={16} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top">Edit Voucher</TooltipContent>
              </Tooltip>
            )}

            {canApprove && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-600 hover:text-green-800 hover:bg-green-50"
                    onClick={() => setConfirmId(item.ID)}
                  >
                    <FileUser size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-green-700 text-white text-xs">
                  Approve Voucher
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      );
    },
  },
];

export function DashboardHomeTable() {
  const queryClient = useQueryClient();

  const [confirmId, setConfirmId] = React.useState(null);
  const [isApproving, setIsApproving] = React.useState(false);

  const canEdit    = useHasPermission("HOME_VOUCHER_EDIT");
  const canApprove = useHasPermission("HOME_VOUCHER_APPROVE");

  const [approvedIds, setApprovedIds] = React.useState(new Set());
  const [voucherTypeFilter, setVoucherTypeFilter] = React.useState("all");
  const [glDateFrom, setGlDateFrom] = React.useState("");
  const [glDateTo, setGlDateTo] = React.useState("");

  // ── Upload state ──
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState(null);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  // ── Review state ──
  const [reviewVoucher, setReviewVoucher] = React.useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["unpostedVouchers"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/info-list`);
      return res.data;
    },
  });

  const apiData = Array.isArray(data?.vouchers) ? data.vouchers : [];

  // ── Existing docs for the Upload dialog ──
  const { data: existingDocs = [], refetch: refetchDocs } = useQuery({
    queryKey: ["gldocs", selectedVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gldoc`, {
        params: { glmaster_id: selectedVoucher.ID },
      });
      return res.data.data || [];
    },
    enabled: !!selectedVoucher,
  });

  // ── Upload mutation ──
  const uploadMutation = useMutation({
    mutationFn: async ({ voucherId, files }) => {
      const uploads = files.map((file) => {
        const fd = new FormData();
        fd.append("doc_file", file);
        fd.append("GLMASTERID", voucherId);
        return axios.post(`${url}/api/gldoc`, fd);
      });
      return await Promise.all(uploads);
    },
    onSuccess: async () => {
      toast.success("Invoice uploaded successfully!");
      setSelectedFiles([]);
      await refetchDocs();
      queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
    },
    onError: (err) => {
      toast.error("Failed to upload invoice: " + (err.response?.data?.message || err.message));
    },
    onSettled: () => setUploading(false),
  });

  // ── Delete document mutation ──
  const deleteDocMutation = useMutation({
    mutationFn: (docId) => gldocDeleteRequest(docId),
    onSuccess: async () => {
      toast.success("Document deleted successfully!");
      await refetchDocs();
      queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
    },
    onError: (err) => {
      toast.error("Failed to delete document: " + (err.response?.data?.message || err.message));
    },
  });

  // ── Review modal: master + details (all voucher types) ──
  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["voucherReview", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/voucher-review/${reviewVoucher.ID}`);
      return res.data;
    },
    enabled: !!reviewVoucher,
  });

  // ── Review modal: attachments ──
  const { data: reviewDocs = [] } = useQuery({
    queryKey: ["gldocs", "review", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gldoc`, {
        params: { glmaster_id: reviewVoucher.ID },
      });
      return res.data.data || [];
    },
    enabled: !!reviewVoucher,
  });

  const distributionRows = React.useMemo(() => {
    const details = reviewData?.details || [];
    return details
      .map((d) => ({
        id: d.ID ?? d.id,
        code: d.CODE ?? d.code ?? "",
        codedescription: d.CODEDESCRIPTION ?? d.codedescription ?? "",
        description: d.DESCRIPTION ?? d.description ?? "",
        debit: Number(d.DEBIT ?? d.debit ?? 0),
        credit: Number(d.CREDIT ?? d.credit ?? 0),
      }))
      .filter((d) => d.debit > 0 || d.credit > 0);
  }, [reviewData]);

  const totalDebit = distributionRows.reduce((s, d) => s + d.debit, 0);
  const totalCredit = distributionRows.reduce((s, d) => s + d.credit, 0);

  // ── Apply voucher type + GL date range filter before passing data to the table ──
  const filteredData = React.useMemo(() => {
    return apiData.filter((v) => {
      if (voucherTypeFilter !== "all" && String(v.VOUCHER_TYPE) !== voucherTypeFilter) {
        return false;
      }

      if (glDateFrom || glDateTo) {
        const d = toISODateString(v.GL_ENTRY_DATE);
        if (!d) return false;
        if (glDateFrom && d < glDateFrom) return false;
        if (glDateTo && d > glDateTo) return false;
      }
      return true;
    });
  }, [apiData, voucherTypeFilter, glDateFrom, glDateTo]);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleActivateVoucher = async () => {
    if (!confirmId) return;
    setIsApproving(true);
    try {
      const res = await axios.get(`${url}/api/active-voucher?id=${confirmId}`);
      if (res.data.success) {
        setApprovedIds((prev) => new Set([...prev, confirmId]));
        queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
      } else {
        alert(res.data.message || "Failed to approve voucher");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setIsApproving(false);
      setConfirmId(null);
    }
  };

  // ── Upload handlers ──
  const closeUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedVoucher(null);
    setSelectedFiles([]);
  };

  const handleUploadClick = React.useCallback((voucher) => {
    setSelectedVoucher(voucher);
    setSelectedFiles([]);
    setUploadDialogOpen(true);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = ""; // same file abar select korte parbe
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    setUploading(true);
    uploadMutation.mutate({ voucherId: selectedVoucher.ID, files: selectedFiles });
  };

  const columns = React.useMemo(
    () =>
      createColumns({
        setConfirmId,
        approvedIds,
        canEdit,
        canApprove,
        onUpload: handleUploadClick,
        onReview: setReviewVoucher,
      }),
    [approvedIds, canEdit, canApprove, handleUploadClick]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const reviewMaster = reviewData?.master || {};

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Approve Confirmation Dialog */}
        <AlertDialog
          open={!!confirmId}
          onOpenChange={() => !isApproving && setConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                Approve Voucher?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Voucher ID <strong>{confirmId}</strong> will be permanently approved.{" "}
                <span className="text-red-500 font-medium">This action cannot be undone.</span>{" "}
                Please confirm before proceeding.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleActivateVoucher}
                disabled={isApproving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isApproving ? "Approving..." : "Yes, Approve"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600">
              <ReceiptText size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Approval Voucher</h2>
              <p className="text-xs text-gray-400">
                {filteredData.length} of {apiData.length} — all vouchers
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Search + Voucher Type filter + GL Date range + Column Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter voucher no..."
                value={table.getColumn("VOUCHERNO")?.getFilterValue() ?? ""}
                onChange={(e) =>
                  table.getColumn("VOUCHERNO")?.setFilterValue(e.target.value)
                }
                className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full sm:w-48">
              <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-blue-300">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {VOUCHER_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GL From Date */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                Gl From Date
              </label>
              <div className="relative w-full sm:w-40">
                <Input
                  type="date"
                  value={glDateFrom}
                  max={glDateTo || undefined}
                  onChange={(e) => setGlDateFrom(e.target.value)}
                  className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                />
                {glDateFrom && (
                  <button
                    type="button"
                    onClick={() => setGlDateFrom("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    title="Clear from date"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* GL To Date */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                To Date
              </label>
              <div className="relative w-full sm:w-40">
                <Input
                  type="date"
                  value={glDateTo}
                  min={glDateFrom || undefined}
                  onChange={(e) => setGlDateTo(e.target.value)}
                  className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                />
                {glDateTo && (
                  <button
                    type="button"
                    onClick={() => setGlDateTo("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    title="Clear to date"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id}>
                    {group.headers.map((header) => (
                      <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24 text-red-600 text-sm">
                      Error: {error.message}
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error &&
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
                  ))}
                {!isLoading && !error && table.getRowModel().rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24 text-sm text-gray-500">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination table={table} />
        </div>
      </div>

      {/* ── Upload Invoice Dialog ── */}
      <Dialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          if (uploading) return;
          if (!open) closeUploadDialog();
          else setUploadDialogOpen(true);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload size={18} className="text-blue-600" />
              Upload Invoice
            </DialogTitle>
            <DialogDescription>
              Upload invoice for voucher #{selectedVoucher?.VOUCHERNO}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <Input
                type="file"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
                className="cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <p className="text-xs text-gray-400 mt-2">
                Supported: PDF, JPG, PNG, DOC (Max 5MB each)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Selected Files ({selectedFiles.length})
                </label>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-gray-400" />
                        <span className="text-gray-700 truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveFile(index)}
                        disabled={uploading}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {existingDocs.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Existing Documents ({existingDocs.length})
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {existingDocs.map((doc) => (
                    <div
                      key={doc.ID}
                      className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 text-sm"
                    >
                      <a
                        href={`${url}/api/gldoc?id=${doc.ID}&file=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-700 hover:underline min-w-0"
                      >
                        <FileText size={14} className="text-blue-500 shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {doc.FILE_NAME || `Document #${doc.ID}`}
                        </span>
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0"
                        onClick={() => deleteDocMutation.mutate(doc.ID)}
                        disabled={uploading || deleteDocMutation.isPending}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeUploadDialog} disabled={uploading}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUploadSubmit}
              disabled={selectedFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload {selectedFiles.length} file(s)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Review Voucher Modal (read-only) ── */}
      {reviewVoucher && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-indigo-600" />
                <h2 className="text-base font-bold text-gray-900">
                  {getVoucherTypeLabel(reviewVoucher.VOUCHER_TYPE)} Voucher #{reviewVoucher.VOUCHERNO}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <EntryTypeBadge type={reviewVoucher.TYPE} />
                <button
                  onClick={() => setReviewVoucher(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Voucher Type
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                  {getVoucherTypeLabel(reviewVoucher.VOUCHER_TYPE)}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  GL Date
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                  {formatDate(reviewVoucher.GL_ENTRY_DATE)}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Voucher No
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                  {reviewVoucher.VOUCHERNO}
                </div>
              </div>
              {reviewMaster.TRANS_DATE && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Transaction Date
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                    {formatDate(reviewMaster.TRANS_DATE)}
                  </div>
                </div>
              )}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Description
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 min-h-[42px]">
                  {reviewVoucher.DESCRIPTION || "—"}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Total Amount
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800">
                  {formatMoney(
                    parseFloat(reviewVoucher.TOTAL_DEBIT || 0) !== 0
                      ? reviewVoucher.TOTAL_DEBIT
                      : reviewVoucher.TOTAL_CREDIT
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Status
                </label>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  Approved
                </div>
              </div>

              {/* Attachments */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Attachments
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 space-y-1.5">
                  {reviewDocs.length === 0 ? (
                    <span className="text-xs text-slate-500">
                      {Number(reviewVoucher.DOC_COUNT) || 0} file(s)
                    </span>
                  ) : (
                    reviewDocs.map((doc) => (
                      <a
                        key={doc.ID}
                        href={`${url}/api/gldoc?id=${doc.ID}&file=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        <PaperclipIcon size={13} />
                        {doc.FILE_NAME || `Document #${doc.ID}`}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Account Distribution */}
            <div className="px-6 pb-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Account Distribution
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Code</th>
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Particulars</th>
                      <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Debit</th>
                      <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewLoading && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
                          Loading account details…
                        </td>
                      </tr>
                    )}
                    {!reviewLoading && distributionRows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
                          No account rows found.
                        </td>
                      </tr>
                    )}
                    {!reviewLoading &&
                      distributionRows.map((d, i) => (
                        <tr key={d.id ?? i} className="border-t border-slate-100">
                          <td className="px-4 py-2 text-slate-700 font-medium">{d.code}</td>
                          <td className="px-4 py-2 text-slate-600">
                            {d.codedescription || d.description || "—"}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                            {d.debit > 0 ? formatMoney(d.debit) : ""}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                            {d.credit > 0 ? formatMoney(d.credit) : ""}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {!reviewLoading && distributionRows.length > 0 && (
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                        <td colSpan={2} className="px-4 py-2 text-right text-slate-800">Total</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatMoney(totalDebit)}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatMoney(totalCredit)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setReviewVoucher(null)}
                className="border-slate-200 text-slate-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}