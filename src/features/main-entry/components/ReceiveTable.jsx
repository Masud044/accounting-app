// // // // import { useState, useMemo } from "react";
// // // // import {
// // // //   flexRender,
// // // //   getCoreRowModel,
// // // //   getFilteredRowModel,
// // // //   getPaginationRowModel,
// // // //   getSortedRowModel,
// // // //   useReactTable,
// // // // } from "@tanstack/react-table";
// // // // import {
// // // //   ArrowUpDown,
// // // //   ChevronDown,
// // // //   Pencil,
// // // //   Trash2,
// // // //   PlusIcon,
// // // //   Download,
// // // //   FileText,
// // // //   FileSpreadsheet,
// // // //   BadgeCheck,
// // // // } from "lucide-react";
// // // // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // // // import { Link } from "react-router-dom";

// // // // import { Button } from "@/components/ui/button";
// // // // import {
// // // //   DropdownMenu,
// // // //   DropdownMenuCheckboxItem,
// // // //   DropdownMenuContent,
// // // //   DropdownMenuItem,
// // // //   DropdownMenuLabel,
// // // //   DropdownMenuSeparator,
// // // //   DropdownMenuTrigger,
// // // // } from "@/components/ui/dropdown-menu";
// // // // import { Input } from "@/components/ui/input";
// // // // import {
// // // //   Table,
// // // //   TableBody,
// // // //   TableCell,
// // // //   TableHead,
// // // //   TableHeader,
// // // //   TableRow,
// // // // } from "@/components/ui/table";
// // // // import {
// // // //   Tooltip,
// // // //   TooltipContent,
// // // //   TooltipProvider,
// // // //   TooltipTrigger,
// // // // } from "@/components/ui/tooltip";

// // // // import { DataTablePagination } from "@/components/DataTablePagination";
// // // // import { ReceiveService } from "@/api/AccontingApi";
// // // // import { toast } from "react-toastify";
// // // // import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// // // // import axios from "axios";

// // // // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // // // export default function ReceiveTable() {
// // // //   const [sorting, setSorting] = useState([]);
// // // //   const [columnFilters, setColumnFilters] = useState([]);
// // // //   const [columnVisibility, setColumnVisibility] = useState({});
// // // //   const [globalFilter, setGlobalFilter] = useState("");
// // // //   const [deleteModal, setDeleteModal] = useState({ show: false, id: null, voucherNo: "" });
// // // //   const [downloading, setDownloading] = useState(null);

// // // //   const queryClient = useQueryClient();

// // // //   const { data, isLoading, error } = useQuery({
// // // //     queryKey: ["unpostedVouchers"],
// // // //     queryFn: async () => {
// // // //       const res = await axios.get(`${BASE_URL}/api/receive-all-unposted`);
// // // //       return res.data;
// // // //     },
// // // //   });

// // // //   const deleteMutation = useMutation({
// // // //     mutationFn: async (voucherId) => {
// // // //       const res = await ReceiveService.delete(voucherId);
// // // //       return res.data;
// // // //     },
// // // //     onSuccess: (data) => {
// // // //       if (data.success === 1 || data.status === "success") {
// // // //         toast.success("Voucher deleted successfully!");
// // // //         queryClient.invalidateQueries(["unpostedVouchers"]);
// // // //       } else {
// // // //         toast.error(data.message || "Delete failed!");
// // // //       }
// // // //       setDeleteModal({ show: false, id: null, voucherNo: "" });
// // // //     },
// // // //     onError: (error) => {
// // // //       toast.error("Error deleting voucher: " + error.message);
// // // //       setDeleteModal({ show: false, id: null, voucherNo: "" });
// // // //     },
// // // //   });

// // // //   const handleDeleteClick = (voucher) => {
// // // //     setDeleteModal({ show: true, id: voucher.ID, voucherNo: voucher.VOUCHERNO });
// // // //   };

// // // //   const confirmDelete = () => {
// // // //     if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
// // // //   };

// // // //   const sortedVouchers = useMemo(() => {
// // // //     const vouchers = Array.isArray(data?.data) ? data.data : [];
// // // //     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
// // // //   }, [data]);

// // // //   const handleDownload = async (voucher, type) => {
// // // //     const key = `${voucher.ID}-${type}`;
// // // //     setDownloading(key);

// // // //     try {
// // // //       const response = await fetch(
// // // //         `${BASE_URL}/api/receipt/download/${voucher.ID}?type=${type}`
// // // //       );

// // // //       if (!response.ok) {
// // // //         let errMsg = `Server error ${response.status}`;
// // // //         try {
// // // //           const errBody = await response.json();
// // // //           errMsg = errBody.detail || errBody.message || errMsg;
// // // //         } catch {
// // // //           // ignore
// // // //         }
// // // //         toast.error(`Download failed: ${errMsg}`);
// // // //         return;
// // // //       }

// // // //       const blob = await response.blob();
// // // //       const objectUrl = URL.createObjectURL(blob);
// // // //       const anchor = document.createElement("a");
// // // //       const ext = type === "pdf" ? "pdf" : "xlsx";

// // // //       anchor.href = objectUrl;
// // // //       anchor.download = `receipt_voucher_${voucher.VOUCHERNO}.${ext}`;
// // // //       document.body.appendChild(anchor);
// // // //       anchor.click();
// // // //       anchor.remove();

// // // //       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
// // // //       toast.success(`${type.toUpperCase()} downloaded successfully!`);
// // // //     } catch (err) {
// // // //       console.error(`[handleDownload] ${type} error:`, err);
// // // //       toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
// // // //     } finally {
// // // //       setDownloading(null);
// // // //     }
// // // //   };

// // // //   const columns = [
// // // //     {
// // // //       accessorKey: "VOUCHERNO",
// // // //       header: ({ column }) => (
// // // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // // //           Voucher No <ArrowUpDown />
// // // //         </Button>
// // // //       ),
// // // //       cell: ({ row }) => <div className="ml-3">{row.getValue("VOUCHERNO")}</div>,
// // // //     },
// // // //     {
// // // //       accessorKey: "TRANS_DATE",
// // // //       header: ({ column }) => (
// // // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // // //           Transaction Date <ArrowUpDown />
// // // //         </Button>
// // // //       ),
// // // //       cell: ({ row }) => <div className="ml-3">{row.getValue("TRANS_DATE")}</div>,
// // // //     },
// // // //     {
// // // //       accessorKey: "GL_ENTRY_DATE",
// // // //       header: ({ column }) => (
// // // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // // //           GL Date <ArrowUpDown />
// // // //         </Button>
// // // //       ),
// // // //       cell: ({ row }) => <div className="ml-3">{row.getValue("GL_ENTRY_DATE")}</div>,
// // // //     },
// // // //     // {
// // // //     //   accessorKey: "DESCRIPTION",
// // // //     //   header: "Description",
// // // //     //   cell: ({ row }) => (
// // // //     //     <div className="max-w-[200px] truncate" title={row.getValue("DESCRIPTION")}>
// // // //     //       {row.getValue("DESCRIPTION")}
// // // //     //     </div>
// // // //     //   ),
// // // //     // },
// // // //      {
// // // //       accessorKey: "DESCRIPTION",
// // // //       header: () => (
// // // //         <div className="text-left font-bold text-gray-800 text-sm font-sans">Description</div>
// // // //       ),
// // // //       cell: ({ row }) => (
// // // //         <div className="max-w-[200px] truncate" title={row.getValue("DESCRIPTION")}>
// // // //           {row.getValue("DESCRIPTION")}
// // // //         </div>
// // // //       ),
// // // //     },
// // // //     {
// // // //       accessorKey: "CREDIT",
// // // //       header: ({ column }) => (
// // // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // // //           Debit <ArrowUpDown />
// // // //         </Button>
// // // //       ),
// // // //       cell: ({ row }) => {
// // // //         const amount = parseFloat(row.getValue("CREDIT") || 0);
// // // //         const formatted = new Intl.NumberFormat("en-US", {
// // // //           minimumFractionDigits: 2,
// // // //           maximumFractionDigits: 2,
// // // //         }).format(amount);
// // // //         return <div className="font-medium ml-3">{formatted}</div>;
// // // //       },
// // // //     },
// // // //     {
// // // //       id: "actions",
// // // //       enableHiding: false,
// // // //       header: () => <div className="text-center  font-bold text-gray-800 text-sm font-sans">Actions</div>,
// // // //       cell: ({ row }) => {
// // // //         const voucher = row.original;
// // // //         const isApproved = voucher.POSTED === 1 || voucher.POSTED === "1";

// // // //         return (
// // // //           <div className="flex items-center justify-center gap-1">

// // // //             {/* Edit — approved হলে disabled */}
// // // //             {isApproved ? (
// // // //               <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
// // // //                 <Pencil size={16} />
// // // //               </Button>
// // // //             ) : (
// // // //               <Link to={`/dashboard/receive-edit/${voucher.ID}`} title="Edit Voucher">
// // // //                 <Button variant="ghost" size="icon">
// // // //                   <Pencil size={16} />
// // // //                 </Button>
// // // //               </Link>
// // // //             )}

// // // //             {/* Download — সবসময় active */}
// // // //             <DropdownMenu>
// // // //               <DropdownMenuTrigger asChild>
// // // //                 <Button
// // // //                   variant="ghost"
// // // //                   size="icon"
// // // //                   title="Download"
// // // //                   disabled={downloading?.startsWith(`${voucher.ID}-`)}
// // // //                 >
// // // //                   <Download size={16} />
// // // //                 </Button>
// // // //               </DropdownMenuTrigger>
// // // //               <DropdownMenuContent align="end" className="w-40">
// // // //                 <DropdownMenuLabel className="text-xs text-muted-foreground">
// // // //                   Download as
// // // //                 </DropdownMenuLabel>
// // // //                 <DropdownMenuSeparator />
// // // //                 <DropdownMenuItem
// // // //                   className="cursor-pointer gap-2"
// // // //                   disabled={downloading === `${voucher.ID}-pdf`}
// // // //                   onClick={() => handleDownload(voucher, "pdf")}
// // // //                 >
// // // //                   <FileText size={14} className="text-red-500" />
// // // //                   {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
// // // //                 </DropdownMenuItem>
// // // //                 <DropdownMenuItem
// // // //                   className="cursor-pointer gap-2"
// // // //                   disabled={downloading === `${voucher.ID}-excel`}
// // // //                   onClick={() => handleDownload(voucher, "excel")}
// // // //                 >
// // // //                   <FileSpreadsheet size={14} className="text-green-600" />
// // // //                   {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
// // // //                 </DropdownMenuItem>
// // // //               </DropdownMenuContent>
// // // //             </DropdownMenu>

// // // //             {/* Approved tooltip icon OR Delete */}
// // // //             {isApproved ? (
// // // //               <TooltipProvider>
// // // //                 <Tooltip>
// // // //                   <TooltipTrigger asChild>
// // // //                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
// // // //                       <BadgeCheck size={16} />
// // // //                     </span>
// // // //                   </TooltipTrigger>
// // // //                   <TooltipContent side="top" className="bg-green-700 text-white text-xs">
// // // //                     Approved
// // // //                   </TooltipContent>
// // // //                 </Tooltip>
// // // //               </TooltipProvider>
// // // //             ) : (
// // // //               <Button
// // // //                 // variant="ghost"
// // // //                 size="icon"
// // // //                 onClick={() => handleDeleteClick(voucher)}
// // // //                 title="Delete Voucher"
// // // //               >
// // // //                 <Trash2 size={16} />
// // // //               </Button>
// // // //             )}

// // // //           </div>
// // // //         );
// // // //       },
// // // //     },
// // // //   ];

// // // //   const table = useReactTable({
// // // //     data: sortedVouchers,
// // // //     columns,
// // // //     onSortingChange: setSorting,
// // // //     onColumnFiltersChange: setColumnFilters,
// // // //     getCoreRowModel: getCoreRowModel(),
// // // //     getPaginationRowModel: getPaginationRowModel(),
// // // //     getSortedRowModel: getSortedRowModel(),
// // // //     getFilteredRowModel: getFilteredRowModel(),
// // // //     onColumnVisibilityChange: setColumnVisibility,
// // // //     onGlobalFilterChange: setGlobalFilter,
// // // //     state: { sorting, columnFilters, columnVisibility, globalFilter },
// // // //   });

// // // //   if (isLoading) {
// // // //     return (
// // // //       <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
// // // //         <div className="flex items-center justify-center py-12">
// // // //           <p className="text-muted-foreground">Loading vouchers...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
// // // //         <div className="flex items-center justify-center py-12">
// // // //           <p className="text-red-600">Error loading vouchers.</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <>
// // // //       <div className="mt-6">
// // // //         <Card className="w-full shadow-lg">
// // // //           <CardHeader className="border-b">
// // // //             <CardTitle className="text-sm font-bold">Receive Voucher</CardTitle>
// // // //           </CardHeader>

// // // //           <div className="bg-card rounded-md p-4">
// // // //             <div className="space-y-4">
// // // //               <div className="flex flex-col sm:flex-row gap-4">
// // // //                 <Input
// // // //                   placeholder="Search vouchers..."
// // // //                   value={globalFilter ?? ""}
// // // //                   onChange={(e) => setGlobalFilter(e.target.value)}
// // // //                   className="max-w-sm"
// // // //                 />
// // // //                 <DropdownMenu>
// // // //                   <DropdownMenuTrigger asChild>
// // // //                     <Button variant="outline" className="ml-auto">
// // // //                       Columns <ChevronDown className="ml-2 h-4 w-4" />
// // // //                     </Button>
// // // //                   </DropdownMenuTrigger>
// // // //                   <DropdownMenuContent align="end">
// // // //                     {table
// // // //                       .getAllColumns()
// // // //                       .filter((col) => col.getCanHide())
// // // //                       .map((col) => (
// // // //                         <DropdownMenuCheckboxItem
// // // //                           key={col.id}
// // // //                           className="capitalize"
// // // //                           checked={col.getIsVisible()}
// // // //                           onCheckedChange={(value) => col.toggleVisibility(!!value)}
// // // //                         >
// // // //                           {col.id.replace(/_/g, " ")}
// // // //                         </DropdownMenuCheckboxItem>
// // // //                       ))}
// // // //                   </DropdownMenuContent>
// // // //                 </DropdownMenu>

// // // //                 <Link to="/dashboard/receive-create">
// // // //                   <Button>
// // // //                     <PlusIcon size={16} className="mr-2" />
// // // //                     Add New Receiver
// // // //                   </Button>
// // // //                 </Link>
// // // //               </div>

// // // //               <div className="overflow-hidden rounded-md border">
// // // //                 <Table>
// // // //                   <TableHeader>
// // // //                     {table.getHeaderGroups().map((hg) => (
// // // //                       <TableRow key={hg.id}>
// // // //                         {hg.headers.map((h) => (
// // // //                           <TableHead key={h.id}>
// // // //                             {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// // // //                           </TableHead>
// // // //                         ))}
// // // //                       </TableRow>
// // // //                     ))}
// // // //                   </TableHeader>
// // // //                   <TableBody>
// // // //                     {table.getRowModel().rows?.length ? (
// // // //                       table.getRowModel().rows.map((row) => (
// // // //                         <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
// // // //                           {row.getVisibleCells().map((cell) => (
// // // //                             <TableCell key={cell.id}>
// // // //                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
// // // //                             </TableCell>
// // // //                           ))}
// // // //                         </TableRow>
// // // //                       ))
// // // //                     ) : (
// // // //                       <TableRow>
// // // //                         <TableCell colSpan={columns.length} className="h-24 text-center">
// // // //                           <p className="text-muted-foreground">No unposted vouchers found</p>
// // // //                         </TableCell>
// // // //                       </TableRow>
// // // //                     )}
// // // //                   </TableBody>
// // // //                 </Table>
// // // //               </div>

// // // //               <DataTablePagination table={table} />
// // // //             </div>
// // // //           </div>
// // // //         </Card>
// // // //       </div>

// // // //       {/* Delete Confirmation Modal */}
// // // //       {deleteModal.show && (
// // // //         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
// // // //           <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 shadow-xl">
// // // //             <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
// // // //             <p className="text-gray-600 mb-6">
// // // //               Are you sure you want to delete voucher{" "}
// // // //               <span className="font-semibold">{deleteModal.voucherNo}</span>?
// // // //             </p>
// // // //             <div className="flex justify-end space-x-3">
// // // //               <button
// // // //                 onClick={() => setDeleteModal({ show: false, id: null, voucherNo: "" })}
// // // //                 disabled={deleteMutation.isPending}
// // // //                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //               <button
// // // //                 onClick={confirmDelete}
// // // //                 disabled={deleteMutation.isPending}
// // // //                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
// // // //               >
// // // //                 {deleteMutation.isPending ? "Deleting..." : "Delete"}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </>
// // // //   );
// // // // }


// // // import { useState, useMemo } from "react";
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
// // //   Pencil,
// // //   Trash2,
// // //   PlusIcon,
// // //   Download,
// // //   FileText,
// // //   FileSpreadsheet,
// // //   BadgeCheck,
// // // } from "lucide-react";
// // // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // // import { Link } from "react-router-dom";

// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuCheckboxItem,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuLabel,
// // //   DropdownMenuSeparator,
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
// // // import {
// // //   Tooltip,
// // //   TooltipContent,
// // //   TooltipProvider,
// // //   TooltipTrigger,
// // // } from "@/components/ui/tooltip";

// // // import { DataTablePagination } from "@/components/DataTablePagination";
// // // import { ReceiveService } from "@/api/AccontingApi";
// // // import { toast } from "react-toastify";
// // // import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// // // import axios from "axios";
// // // import { useHasPermission } from "@/hooks/use-permission";

// // // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // // export default function ReceiveTable() {
// // //   const [sorting, setSorting] = useState([]);
// // //   const [columnFilters, setColumnFilters] = useState([]);
// // //   const [columnVisibility, setColumnVisibility] = useState({});
// // //   const [globalFilter, setGlobalFilter] = useState("");
// // //   const [deleteModal, setDeleteModal] = useState({ show: false, id: null, voucherNo: "" });
// // //   const [downloading, setDownloading] = useState(null);

// // //   const canCreate   = useHasPermission("RECEIVE_VOUCHER_CREATE");
// // //   const canEdit     = useHasPermission("RECEIVE_VOUCHER_EDIT");

// // //   const canDownload = useHasPermission("RECEIVE_VOUCHER_DOWNLOAD");

// // //   const queryClient = useQueryClient();

// // //   const { data, isLoading, error } = useQuery({
// // //     queryKey: ["unpostedVouchers"],
// // //     queryFn: async () => {
// // //       const res = await axios.get(`${BASE_URL}/api/receive-all-unposted`);
// // //       return res.data;
// // //     },
// // //   });

// // //   const deleteMutation = useMutation({
// // //     mutationFn: async (voucherId) => {
// // //       const res = await ReceiveService.delete(voucherId);
// // //       return res.data;
// // //     },
// // //     onSuccess: (data) => {
// // //       if (data.success === 1 || data.status === "success") {
// // //         toast.success("Voucher deleted successfully!");
// // //         queryClient.invalidateQueries(["unpostedVouchers"]);
// // //       } else {
// // //         toast.error(data.message || "Delete failed!");
// // //       }
// // //       setDeleteModal({ show: false, id: null, voucherNo: "" });
// // //     },
// // //     onError: (error) => {
// // //       toast.error("Error deleting voucher: " + error.message);
// // //       setDeleteModal({ show: false, id: null, voucherNo: "" });
// // //     },
// // //   });

 

// // //   const confirmDelete = () => {
// // //     if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
// // //   };

// // //   const sortedVouchers = useMemo(() => {
// // //     const vouchers = Array.isArray(data?.data) ? data.data : [];
// // //     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
// // //   }, [data]);

// // //   const handleDownload = async (voucher, type) => {
// // //     const key = `${voucher.ID}-${type}`;
// // //     setDownloading(key);

// // //     try {
// // //       const response = await fetch(
// // //         `${BASE_URL}/api/receipt/download/${voucher.ID}?type=${type}`
// // //       );

// // //       if (!response.ok) {
// // //         let errMsg = `Server error ${response.status}`;
// // //         try {
// // //           const errBody = await response.json();
// // //           errMsg = errBody.detail || errBody.message || errMsg;
// // //         } catch {
// // //           // ignore
// // //         }
// // //         toast.error(`Download failed: ${errMsg}`);
// // //         return;
// // //       }

// // //       const blob = await response.blob();
// // //       const objectUrl = URL.createObjectURL(blob);
// // //       const anchor = document.createElement("a");
// // //       const ext = type === "pdf" ? "pdf" : "xlsx";

// // //       anchor.href = objectUrl;
// // //       anchor.download = `receipt_voucher_${voucher.VOUCHERNO}.${ext}`;
// // //       document.body.appendChild(anchor);
// // //       anchor.click();
// // //       anchor.remove();

// // //       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
// // //       toast.success(`${type.toUpperCase()} downloaded successfully!`);
// // //     } catch (err) {
// // //       console.error(`[handleDownload] ${type} error:`, err);
// // //       toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
// // //     } finally {
// // //       setDownloading(null);
// // //     }
// // //   };

// // //   const columns = [
// // //     {
// // //       accessorKey: "VOUCHERNO",
// // //       header: ({ column }) => (
// // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // //           Voucher No <ArrowUpDown />
// // //         </Button>
// // //       ),
// // //       cell: ({ row }) => <div className="ml-3">{row.getValue("VOUCHERNO")}</div>,
// // //     },
// // //     {
// // //       accessorKey: "TRANS_DATE",
// // //       header: ({ column }) => (
// // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // //           Transaction Date <ArrowUpDown />
// // //         </Button>
// // //       ),
// // //       cell: ({ row }) => <div className="ml-3">{row.getValue("TRANS_DATE")}</div>,
// // //     },
// // //     {
// // //       accessorKey: "GL_ENTRY_DATE",
// // //       header: ({ column }) => (
// // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // //           GL Date <ArrowUpDown />
// // //         </Button>
// // //       ),
// // //       cell: ({ row }) => <div className="ml-3">{row.getValue("GL_ENTRY_DATE")}</div>,
// // //     },
// // //     {
// // //       accessorKey: "DESCRIPTION",
// // //       header: () => (
// // //         <div className="text-left font-bold text-gray-800 text-sm font-sans">Description</div>
// // //       ),
// // //       cell: ({ row }) => (
// // //         <div className="max-w-[200px] truncate" title={row.getValue("DESCRIPTION")}>
// // //           {row.getValue("DESCRIPTION")}
// // //         </div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "CREDIT",
// // //       header: ({ column }) => (
// // //         <Button variant="ghost" className=" font-bold text-gray-800 text-sm font-sans" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// // //           Debit <ArrowUpDown />
// // //         </Button>
// // //       ),
// // //       cell: ({ row }) => {
// // //         const amount = parseFloat(row.getValue("CREDIT") || 0);
// // //         const formatted = new Intl.NumberFormat("en-US", {
// // //           minimumFractionDigits: 2,
// // //           maximumFractionDigits: 2,
// // //         }).format(amount);
// // //         return <div className="font-medium ml-3">{formatted}</div>;
// // //       },
// // //     },
// // //     {
// // //       id: "actions",
// // //       enableHiding: false,
// // //       header: () => <div className="text-center  font-bold text-gray-800 text-sm font-sans">Actions</div>,
// // //       cell: ({ row }) => {
// // //         const voucher = row.original;
// // //         const isApproved = voucher.POSTED === 1 || voucher.POSTED === "1";

// // //         return (
// // //           <div className="flex items-center justify-center gap-1">

// // //             {/* Edit — approved হলে disabled */}
// // //             {canEdit && (
// // //               isApproved ? (
// // //                 <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
// // //                   <Pencil size={16} />
// // //                 </Button>
// // //               ) : (
// // //                 <Link to={`/dashboard/receive-edit/${voucher.ID}`} title="Edit Voucher">
// // //                   <Button variant="ghost" size="icon">
// // //                     <Pencil size={16} />
// // //                   </Button>
// // //                 </Link>
// // //               )
// // //             )}

// // //             {/* Download — সবসময় active */}
// // //             {canDownload && (
// // //               <DropdownMenu>
// // //                 <DropdownMenuTrigger asChild>
// // //                   <Button
// // //                     variant="ghost"
// // //                     size="icon"
// // //                     title="Download"
// // //                     disabled={downloading?.startsWith(`${voucher.ID}-`)}
// // //                   >
// // //                     <Download size={16} />
// // //                   </Button>
// // //                 </DropdownMenuTrigger>
// // //                 <DropdownMenuContent align="end" className="w-40">
// // //                   <DropdownMenuLabel className="text-xs text-muted-foreground">
// // //                     Download as
// // //                   </DropdownMenuLabel>
// // //                   <DropdownMenuSeparator />
// // //                   <DropdownMenuItem
// // //                     className="cursor-pointer gap-2"
// // //                     disabled={downloading === `${voucher.ID}-pdf`}
// // //                     onClick={() => handleDownload(voucher, "pdf")}
// // //                   >
// // //                     <FileText size={14} className="text-red-500" />
// // //                     {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
// // //                   </DropdownMenuItem>
// // //                   <DropdownMenuItem
// // //                     className="cursor-pointer gap-2"
// // //                     disabled={downloading === `${voucher.ID}-excel`}
// // //                     onClick={() => handleDownload(voucher, "excel")}
// // //                   >
// // //                     <FileSpreadsheet size={14} className="text-green-600" />
// // //                     {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
// // //                   </DropdownMenuItem>
// // //                 </DropdownMenuContent>
// // //               </DropdownMenu>
// // //             )}

// // //             {/* Approved tooltip icon OR Delete */}
// // //           {/* Approved badge */}
// // // {isApproved && (
// // //   <TooltipProvider>
// // //     <Tooltip>
// // //       <TooltipTrigger asChild>
// // //         <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
// // //           <BadgeCheck size={16} />
// // //         </span>
// // //       </TooltipTrigger>
// // //       <TooltipContent side="top" className="bg-green-700 text-white text-xs">
// // //         Approved
// // //       </TooltipContent>
// // //     </Tooltip>
// // //   </TooltipProvider>
// // // )}
// // //           </div>
// // //         );
// // //       },
// // //     },
// // //   ];

// // //   const table = useReactTable({
// // //     data: sortedVouchers,
// // //     columns,
// // //     onSortingChange: setSorting,
// // //     onColumnFiltersChange: setColumnFilters,
// // //     getCoreRowModel: getCoreRowModel(),
// // //     getPaginationRowModel: getPaginationRowModel(),
// // //     getSortedRowModel: getSortedRowModel(),
// // //     getFilteredRowModel: getFilteredRowModel(),
// // //     onColumnVisibilityChange: setColumnVisibility,
// // //     onGlobalFilterChange: setGlobalFilter,
// // //     state: { sorting, columnFilters, columnVisibility, globalFilter },
// // //   });

// // //   if (isLoading) {
// // //     return (
// // //       <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
// // //         <div className="flex items-center justify-center py-12">
// // //           <p className="text-muted-foreground">Loading vouchers...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
// // //         <div className="flex items-center justify-center py-12">
// // //           <p className="text-red-600">Error loading vouchers.</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <div className="mt-6">
// // //         <Card className="w-full shadow-lg">
// // //           <CardHeader className="border-b">
// // //             <CardTitle className="text-sm font-bold">Receive Voucher</CardTitle>
// // //           </CardHeader>

// // //           <div className="bg-card rounded-md p-4">
// // //             <div className="space-y-4">
// // //               <div className="flex flex-col sm:flex-row gap-4">
// // //                 <Input
// // //                   placeholder="Search vouchers..."
// // //                   value={globalFilter ?? ""}
// // //                   onChange={(e) => setGlobalFilter(e.target.value)}
// // //                   className="max-w-sm"
// // //                 />
// // //                 <DropdownMenu>
// // //                   <DropdownMenuTrigger asChild>
// // //                     <Button variant="outline" className="ml-auto">
// // //                       Columns <ChevronDown className="ml-2 h-4 w-4" />
// // //                     </Button>
// // //                   </DropdownMenuTrigger>
// // //                   <DropdownMenuContent align="end">
// // //                     {table
// // //                       .getAllColumns()
// // //                       .filter((col) => col.getCanHide())
// // //                       .map((col) => (
// // //                         <DropdownMenuCheckboxItem
// // //                           key={col.id}
// // //                           className="capitalize"
// // //                           checked={col.getIsVisible()}
// // //                           onCheckedChange={(value) => col.toggleVisibility(!!value)}
// // //                         >
// // //                           {col.id.replace(/_/g, " ")}
// // //                         </DropdownMenuCheckboxItem>
// // //                       ))}
// // //                   </DropdownMenuContent>
// // //                 </DropdownMenu>

// // //                 {canCreate && (
// // //                   <Link to="/dashboard/receive-create">
// // //                     <Button>
// // //                       <PlusIcon size={16} className="mr-2" />
// // //                       Add New Receiver
// // //                     </Button>
// // //                   </Link>
// // //                 )}
// // //               </div>

// // //               <div className="overflow-hidden rounded-md border">
// // //                 <Table>
// // //                   <TableHeader>
// // //                     {table.getHeaderGroups().map((hg) => (
// // //                       <TableRow key={hg.id}>
// // //                         {hg.headers.map((h) => (
// // //                           <TableHead key={h.id}>
// // //                             {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// // //                           </TableHead>
// // //                         ))}
// // //                       </TableRow>
// // //                     ))}
// // //                   </TableHeader>
// // //                   <TableBody>
// // //                     {table.getRowModel().rows?.length ? (
// // //                       table.getRowModel().rows.map((row) => (
// // //                         <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
// // //                           {row.getVisibleCells().map((cell) => (
// // //                             <TableCell key={cell.id}>
// // //                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
// // //                             </TableCell>
// // //                           ))}
// // //                         </TableRow>
// // //                       ))
// // //                     ) : (
// // //                       <TableRow>
// // //                         <TableCell colSpan={columns.length} className="h-24 text-center">
// // //                           <p className="text-muted-foreground">No unposted vouchers found</p>
// // //                         </TableCell>
// // //                       </TableRow>
// // //                     )}
// // //                   </TableBody>
// // //                 </Table>
// // //               </div>

// // //               <DataTablePagination table={table} />
// // //             </div>
// // //           </div>
// // //         </Card>
// // //       </div>

// // //       {/* Delete Confirmation Modal */}
// // //       {deleteModal.show && (
// // //         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
// // //           <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 shadow-xl">
// // //             <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
// // //             <p className="text-gray-600 mb-6">
// // //               Are you sure you want to delete voucher{" "}
// // //               <span className="font-semibold">{deleteModal.voucherNo}</span>?
// // //             </p>
// // //             <div className="flex justify-end space-x-3">
// // //               <button
// // //                 onClick={() => setDeleteModal({ show: false, id: null, voucherNo: "" })}
// // //                 disabled={deleteMutation.isPending}
// // //                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={confirmDelete}
// // //                 disabled={deleteMutation.isPending}
// // //                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
// // //               >
// // //                 {deleteMutation.isPending ? "Deleting..." : "Delete"}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // }

// // import { useState, useMemo } from "react";
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
// //   Pencil,
// //   Trash2,
// //   PlusIcon,
// //   Download,
// //   FileText,
// //   FileSpreadsheet,
// //   BadgeCheck,
// //   Search,
// //   Landmark,
// // } from "lucide-react";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import { Link } from "react-router-dom";

// // import { Button } from "@/components/ui/button";
// // import {
// //   DropdownMenu,
// //   DropdownMenuCheckboxItem,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
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
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip";

// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import { ReceiveService } from "@/api/AccontingApi";
// // import { toast } from "react-toastify";
// // import axios from "axios";
// // import { useHasPermission } from "@/hooks/use-permission";

// // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// // export default function ReceiveTable() {
// //   const [sorting, setSorting] = useState([]);
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [columnVisibility, setColumnVisibility] = useState({});
// //   const [globalFilter, setGlobalFilter] = useState("");
// //   const [deleteModal, setDeleteModal] = useState({ show: false, id: null, voucherNo: "" });
// //   const [downloading, setDownloading] = useState(null);

// //   const canCreate = useHasPermission("RECEIVE_VOUCHER_CREATE");
// //   const canEdit = useHasPermission("RECEIVE_VOUCHER_EDIT");
// //   const canDownload = useHasPermission("RECEIVE_VOUCHER_DOWNLOAD");

// //   const queryClient = useQueryClient();

// //   const { data, isLoading, error } = useQuery({
// //     queryKey: ["unpostedVouchers"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${BASE_URL}/api/receive-all-unposted`);
// //       return res.data;
// //     },
// //   });

// //   const deleteMutation = useMutation({
// //     mutationFn: async (voucherId) => {
// //       const res = await ReceiveService.delete(voucherId);
// //       return res.data;
// //     },
// //     onSuccess: (data) => {
// //       if (data.success === 1 || data.status === "success") {
// //         toast.success("Voucher deleted successfully!");
// //         queryClient.invalidateQueries(["unpostedVouchers"]);
// //       } else {
// //         toast.error(data.message || "Delete failed!");
// //       }
// //       setDeleteModal({ show: false, id: null, voucherNo: "" });
// //     },
// //     onError: (error) => {
// //       toast.error("Error deleting voucher: " + error.message);
// //       setDeleteModal({ show: false, id: null, voucherNo: "" });
// //     },
// //   });

// //   const confirmDelete = () => {
// //     if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
// //   };

// //   const sortedVouchers = useMemo(() => {
// //     const vouchers = Array.isArray(data?.data) ? data.data : [];
// //     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
// //   }, [data]);

// //   const handleDownload = async (voucher, type) => {
// //     const key = `${voucher.ID}-${type}`;
// //     setDownloading(key);

// //     try {
// //       const response = await fetch(
// //         `${BASE_URL}/api/receipt/download/${voucher.ID}?type=${type}`
// //       );

// //       if (!response.ok) {
// //         let errMsg = `Server error ${response.status}`;
// //         try {
// //           const errBody = await response.json();
// //           errMsg = errBody.detail || errBody.message || errMsg;
// //         } catch {
// //           // ignore
// //         }
// //         toast.error(`Download failed: ${errMsg}`);
// //         return;
// //       }

// //       const blob = await response.blob();
// //       const objectUrl = URL.createObjectURL(blob);
// //       const anchor = document.createElement("a");
// //       const ext = type === "pdf" ? "pdf" : "xlsx";

// //       anchor.href = objectUrl;
// //       anchor.download = `receipt_voucher_${voucher.VOUCHERNO}.${ext}`;
// //       document.body.appendChild(anchor);
// //       anchor.click();
// //       anchor.remove();

// //       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
// //       toast.success(`${type.toUpperCase()} downloaded successfully!`);
// //     } catch (err) {
// //       console.error(`[handleDownload] ${type} error:`, err);
// //       toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
// //     } finally {
// //       setDownloading(null);
// //     }
// //   };

// //   const columns = [
// //     {
// //       accessorKey: "VOUCHERNO",
// //       header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
// //       cell: ({ row }) => (
// //         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "TRANS_DATE",
// //       header: ({ column }) => <SortableHeader column={column} label="Transaction Date" />,
// //       cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("TRANS_DATE")}</div>,
// //     },
// //     {
// //       accessorKey: "GL_ENTRY_DATE",
// //       header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
// //       cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("GL_ENTRY_DATE")}</div>,
// //     },
// //     {
// //       accessorKey: "DESCRIPTION",
// //       header: () => (
// //         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //           Description
// //         </div>
// //       ),
// //       cell: ({ row }) => (
// //         <div className="max-w-[200px] truncate text-sm text-gray-600" title={row.getValue("DESCRIPTION")}>
// //           {row.getValue("DESCRIPTION")}
// //         </div>
// //       ),
// //     },
// //     {
// //       accessorKey: "CREDIT",
// //       header: ({ column }) => <SortableHeader column={column} label="Debit" />,
// //       cell: ({ row }) => {
// //         const amount = parseFloat(row.getValue("CREDIT") || 0);
// //         const formatted = new Intl.NumberFormat("en-US", {
// //           minimumFractionDigits: 2,
// //           maximumFractionDigits: 2,
// //         }).format(amount);
// //         return <div className="ml-3 text-sm font-semibold text-gray-800">{formatted}</div>;
// //       },
// //     },
// //     {
// //       id: "actions",
// //       enableHiding: false,
// //       header: () => (
// //         <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //           Actions
// //         </div>
// //       ),
// //       cell: ({ row }) => {
// //         const voucher = row.original;
// //         const isApproved = voucher.POSTED === 1 || voucher.POSTED === "1";

// //         return (
// //           <div className="flex items-center justify-center gap-1">
// //             {/* Edit — approved হলে disabled */}
// //             {canEdit && (
// //               isApproved ? (
// //                 <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
// //                   <Pencil size={16} />
// //                 </Button>
// //               ) : (
// //                 <Link to={`/dashboard/receive-edit/${voucher.ID}`} title="Edit Voucher">
// //                   <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
// //                     <Pencil size={16} />
// //                   </Button>
// //                 </Link>
// //               )
// //             )}

// //             {/* Download */}
// //             {canDownload && (
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     title="Download"
// //                     className="hover:bg-gray-100"
// //                     disabled={downloading?.startsWith(`${voucher.ID}-`)}
// //                   >
// //                     <Download size={16} />
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent align="end" className="w-40">
// //                   <DropdownMenuLabel className="text-xs text-muted-foreground">
// //                     Download as
// //                   </DropdownMenuLabel>
// //                   <DropdownMenuSeparator />
// //                   <DropdownMenuItem
// //                     className="cursor-pointer gap-2"
// //                     disabled={downloading === `${voucher.ID}-pdf`}
// //                     onClick={() => handleDownload(voucher, "pdf")}
// //                   >
// //                     <FileText size={14} className="text-red-500" />
// //                     {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
// //                   </DropdownMenuItem>
// //                   <DropdownMenuItem
// //                     className="cursor-pointer gap-2"
// //                     disabled={downloading === `${voucher.ID}-excel`}
// //                     onClick={() => handleDownload(voucher, "excel")}
// //                   >
// //                     <FileSpreadsheet size={14} className="text-green-600" />
// //                     {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
// //                   </DropdownMenuItem>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             )}

// //             {/* Approved badge */}
// //             {isApproved && (
// //               <TooltipProvider>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
// //                       <BadgeCheck size={16} />
// //                     </span>
// //                   </TooltipTrigger>
// //                   <TooltipContent side="top" className="bg-green-700 text-white text-xs">
// //                     Approved
// //                   </TooltipContent>
// //                 </Tooltip>
// //               </TooltipProvider>
// //             )}
// //           </div>
// //         );
// //       },
// //     },
// //   ];

// //   const table = useReactTable({
// //     data: sortedVouchers,
// //     columns,
// //     onSortingChange: setSorting,
// //     onColumnFiltersChange: setColumnFilters,
// //     getCoreRowModel: getCoreRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     onColumnVisibilityChange: setColumnVisibility,
// //     onGlobalFilterChange: setGlobalFilter,
// //     state: { sorting, columnFilters, columnVisibility, globalFilter },
// //   });

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
// //         <div className="flex items-center justify-center py-12">
// //           <p className="text-sm text-gray-500">Loading vouchers...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
// //         <div className="flex items-center justify-center py-12">
// //           <p className="text-sm text-red-600">Error loading vouchers.</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <div className="p-4 md:p-6">
// //         <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
// //           {/* Header */}
// //           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
// //             <div className="flex items-center gap-2">
// //               <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600">
// //                 <Landmark size={16} />
// //               </div>
// //               <div>
// //                 <h2 className="text-sm font-bold text-gray-900">Receive Voucher</h2>
// //                 <p className="text-xs text-gray-400">
// //                   {sortedVouchers.length} total — unposted receive vouchers
// //                 </p>
// //               </div>
// //             </div>

// //             {canCreate && (
// //               <Link to="/dashboard/receive-create">
// //                 <Button >
// //                   <PlusIcon size={16} className="mr-2" />
// //                   Add New Receiver
// //                 </Button>
// //               </Link>
// //             )}
// //           </div>

// //           <div className="p-5 space-y-4">
// //             {/* Search + Column visibility */}
// //             <div className="flex flex-col sm:flex-row gap-3">
// //               <div className="relative max-w-sm w-full">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                 <Input
// //                   placeholder="Search vouchers..."
// //                   value={globalFilter ?? ""}
// //                   onChange={(e) => setGlobalFilter(e.target.value)}
// //                   className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
// //                 />
// //               </div>

// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button variant="outline" className="ml-auto bg-white border-gray-200">
// //                     Columns <ChevronDown className="ml-2 h-4 w-4" />
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent align="end">
// //                   {table
// //                     .getAllColumns()
// //                     .filter((col) => col.getCanHide())
// //                     .map((col) => (
// //                       <DropdownMenuCheckboxItem
// //                         key={col.id}
// //                         className="capitalize"
// //                         checked={col.getIsVisible()}
// //                         onCheckedChange={(value) => col.toggleVisibility(!!value)}
// //                       >
// //                         {col.id.replace(/_/g, " ")}
// //                       </DropdownMenuCheckboxItem>
// //                     ))}
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>

// //             {/* Table */}
// //             <div className="overflow-hidden rounded-md border border-gray-200">
// //               <Table>
// //                 <TableHeader className="bg-gray-50">
// //                   {table.getHeaderGroups().map((hg) => (
// //                     <TableRow key={hg.id}>
// //                       {hg.headers.map((h) => (
// //                         <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //                           {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// //                         </TableHead>
// //                       ))}
// //                     </TableRow>
// //                   ))}
// //                 </TableHeader>
// //                 <TableBody>
// //                   {table.getRowModel().rows?.length ? (
// //                     table.getRowModel().rows.map((row) => (
// //                       <TableRow
// //                         key={row.id}
// //                         data-state={row.getIsSelected() && "selected"}
// //                         className="hover:bg-gray-50/70 transition-colors"
// //                       >
// //                         {row.getVisibleCells().map((cell) => (
// //                           <TableCell key={cell.id} className="text-sm text-gray-700">
// //                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                           </TableCell>
// //                         ))}
// //                       </TableRow>
// //                     ))
// //                   ) : (
// //                     <TableRow>
// //                       <TableCell colSpan={columns.length} className="h-24 text-center">
// //                         <p className="text-sm text-gray-400">No unposted vouchers found</p>
// //                       </TableCell>
// //                     </TableRow>
// //                   )}
// //                 </TableBody>
// //               </Table>
// //             </div>

// //             <DataTablePagination table={table} />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Delete Confirmation Modal */}
// //       {deleteModal.show && (
// //         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 shadow-xl">
// //             <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
// //             <p className="text-gray-600 mb-6">
// //               Are you sure you want to delete voucher{" "}
// //               <span className="font-semibold">{deleteModal.voucherNo}</span>?
// //             </p>
// //             <div className="flex justify-end space-x-3">
// //               <button
// //                 onClick={() => setDeleteModal({ show: false, id: null, voucherNo: "" })}
// //                 disabled={deleteMutation.isPending}
// //                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={confirmDelete}
// //                 disabled={deleteMutation.isPending}
// //                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
// //               >
// //                 {deleteMutation.isPending ? "Deleting..." : "Delete"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

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
//   Pencil,
//   Trash2,
//   PlusIcon,
//   Download,
//   FileText,
//   FileSpreadsheet,
//   BadgeCheck,
//   Search,
//   Landmark,
// } from "lucide-react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
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
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// import { DataTablePagination } from "@/components/DataTablePagination";
// import { ReceiveService } from "@/api/AccontingApi";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useHasPermission } from "@/hooks/use-permission";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// export default function ReceiveTable() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [deleteModal, setDeleteModal] = useState({ show: false, id: null, voucherNo: "" });
//   const [downloading, setDownloading] = useState(null);
//   const [glDateFilter, setGlDateFilter] = useState("");

//   const canCreate = useHasPermission("RECEIVE_VOUCHER_CREATE");
//   const canEdit = useHasPermission("RECEIVE_VOUCHER_EDIT");
//   const canDownload = useHasPermission("RECEIVE_VOUCHER_DOWNLOAD");

//   const queryClient = useQueryClient();

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["unpostedVouchers"],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/receive-all-unposted`);
//       return res.data;
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (voucherId) => {
//       const res = await ReceiveService.delete(voucherId);
//       return res.data;
//     },
//     onSuccess: (data) => {
//       if (data.success === 1 || data.status === "success") {
//         toast.success("Voucher deleted successfully!");
//         queryClient.invalidateQueries(["unpostedVouchers"]);
//       } else {
//         toast.error(data.message || "Delete failed!");
//       }
//       setDeleteModal({ show: false, id: null, voucherNo: "" });
//     },
//     onError: (error) => {
//       toast.error("Error deleting voucher: " + error.message);
//       setDeleteModal({ show: false, id: null, voucherNo: "" });
//     },
//   });

//   const confirmDelete = () => {
//     if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
//   };

//   const sortedVouchers = useMemo(() => {
//     const vouchers = Array.isArray(data?.data) ? data.data : [];
//     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
//   }, [data]);

//   // ── GL Date filter ──────────────────────────────────────────────────────────
//   const filteredVouchers = useMemo(() => {
//     if (!glDateFilter) return sortedVouchers;
//     return sortedVouchers.filter((v) => {
//       if (!v.GL_ENTRY_DATE) return false;
//       const d = new Date(v.GL_ENTRY_DATE);
//       if (isNaN(d.getTime())) return false;
//       const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
//       return formatted === glDateFilter;
//     });
//   }, [sortedVouchers, glDateFilter]);

//   const handleDownload = async (voucher, type) => {
//     const key = `${voucher.ID}-${type}`;
//     setDownloading(key);

//     try {
//       const response = await fetch(
//         `${BASE_URL}/api/receipt/download/${voucher.ID}?type=${type}`
//       );

//       if (!response.ok) {
//         let errMsg = `Server error ${response.status}`;
//         try {
//           const errBody = await response.json();
//           errMsg = errBody.detail || errBody.message || errMsg;
//         } catch {
//           // ignore
//         }
//         toast.error(`Download failed: ${errMsg}`);
//         return;
//       }

//       const blob = await response.blob();
//       const objectUrl = URL.createObjectURL(blob);
//       const anchor = document.createElement("a");
//       const ext = type === "pdf" ? "pdf" : "xlsx";

//       anchor.href = objectUrl;
//       anchor.download = `receipt_voucher_${voucher.VOUCHERNO}.${ext}`;
//       document.body.appendChild(anchor);
//       anchor.click();
//       anchor.remove();

//       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
//       toast.success(`${type.toUpperCase()} downloaded successfully!`);
//     } catch (err) {
//       console.error(`[handleDownload] ${type} error:`, err);
//       toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
//     } finally {
//       setDownloading(null);
//     }
//   };

//   const columns = [
//     {
//       accessorKey: "VOUCHERNO",
//       header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>
//       ),
//     },
//     {
//       accessorKey: "TRANS_DATE",
//       header: ({ column }) => <SortableHeader column={column} label="Transaction Date" />,
//       cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("TRANS_DATE")}</div>,
//     },
//     {
//       accessorKey: "GL_ENTRY_DATE",
//       header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
//       cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("GL_ENTRY_DATE")}</div>,
//     },
//     {
//       accessorKey: "DESCRIPTION",
//       header: () => (
//         <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
//           Description
//         </div>
//       ),
//       cell: ({ row }) => (
//         <div className="max-w-[200px] truncate text-sm text-gray-600" title={row.getValue("DESCRIPTION")}>
//           {row.getValue("DESCRIPTION")}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "CREDIT",
//       header: ({ column }) => <SortableHeader column={column} label="Debit" />,
//       cell: ({ row }) => {
//         const amount = parseFloat(row.getValue("CREDIT") || 0);
//         const formatted = new Intl.NumberFormat("en-US", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         }).format(amount);
//         return <div className="ml-3 text-sm font-semibold text-gray-800">{formatted}</div>;
//       },
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
//         const voucher = row.original;
//         const isApproved = voucher.POSTED === 1 || voucher.POSTED === "1";

//         return (
//           <div className="flex items-center justify-center gap-1">
//             {/* Edit — approved হলে disabled */}
//             {canEdit && (
//               isApproved ? (
//                 <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
//                   <Pencil size={16} />
//                 </Button>
//               ) : (
//                 <Link to={`/dashboard/receive-edit/${voucher.ID}`} title="Edit Voucher">
//                   <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
//                     <Pencil size={16} />
//                   </Button>
//                 </Link>
//               )
//             )}

//             {/* Download */}
//             {canDownload && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     title="Download"
//                     className="hover:bg-gray-100"
//                     disabled={downloading?.startsWith(`${voucher.ID}-`)}
//                   >
//                     <Download size={16} />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-40">
//                   <DropdownMenuLabel className="text-xs text-muted-foreground">
//                     Download as
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     className="cursor-pointer gap-2"
//                     disabled={downloading === `${voucher.ID}-pdf`}
//                     onClick={() => handleDownload(voucher, "pdf")}
//                   >
//                     <FileText size={14} className="text-red-500" />
//                     {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
//                   </DropdownMenuItem>
//                   <DropdownMenuItem
//                     className="cursor-pointer gap-2"
//                     disabled={downloading === `${voucher.ID}-excel`}
//                     onClick={() => handleDownload(voucher, "excel")}
//                   >
//                     <FileSpreadsheet size={14} className="text-green-600" />
//                     {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}

//             {/* Approved badge */}
//             {isApproved && (
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default">
//                       <BadgeCheck size={16} />
//                     </span>
//                   </TooltipTrigger>
//                   <TooltipContent side="top" className="bg-green-700 text-white text-xs">
//                     Approved
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: filteredVouchers,
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

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//         <div className="flex items-center justify-center py-12">
//           <p className="text-sm text-gray-500">Loading vouchers...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//         <div className="flex items-center justify-center py-12">
//           <p className="text-sm text-red-600">Error loading vouchers.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="p-4 md:p-6">
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//           {/* Header */}
//           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600">
//                 <Landmark size={16} />
//               </div>
//               <div>
//                 <h2 className="text-sm font-bold text-gray-900">Receive Voucher</h2>
//                 <p className="text-xs text-gray-400">
//                   {filteredVouchers.length} total — unposted receive vouchers
//                 </p>
//               </div>
//             </div>

//             {canCreate && (
//               <Link to="/dashboard/receive-create">
//                 <Button >
//                   <PlusIcon size={16} className="mr-2" />
//                   Add New Receiver
//                 </Button>
//               </Link>
//             )}
//           </div>

//           <div className="p-5 space-y-4">
//             {/* Search + GL Date filter + Column visibility */}
//             <div className="flex flex-col sm:flex-row gap-3">
//               <div className="relative max-w-sm w-full">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search vouchers..."
//                   value={globalFilter ?? ""}
//                   onChange={(e) => setGlobalFilter(e.target.value)}
//                   className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
//                 />
//               </div>

//               <div className="flex items-center gap-2 w-full sm:w-auto">
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                   GL Date
//                 </label>
//                 <div className="relative w-full sm:w-44">
//                   <Input
//                     type="date"
//                     value={glDateFilter}
//                     onChange={(e) => setGlDateFilter(e.target.value)}
//                     className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
//                   />
//                   {glDateFilter && (
//                     <button
//                       type="button"
//                       onClick={() => setGlDateFilter("")}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                       title="Clear GL date filter"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="ml-auto bg-white border-gray-200">
//                     Columns <ChevronDown className="ml-2 h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {table
//                     .getAllColumns()
//                     .filter((col) => col.getCanHide())
//                     .map((col) => (
//                       <DropdownMenuCheckboxItem
//                         key={col.id}
//                         className="capitalize"
//                         checked={col.getIsVisible()}
//                         onCheckedChange={(value) => col.toggleVisibility(!!value)}
//                       >
//                         {col.id.replace(/_/g, " ")}
//                       </DropdownMenuCheckboxItem>
//                     ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             {/* Table */}
//             <div className="overflow-hidden rounded-md border border-gray-200">
//               <Table>
//                 <TableHeader className="bg-gray-50">
//                   {table.getHeaderGroups().map((hg) => (
//                     <TableRow key={hg.id}>
//                       {hg.headers.map((h) => (
//                         <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                           {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//                 <TableBody>
//                   {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map((row) => (
//                       <TableRow
//                         key={row.id}
//                         data-state={row.getIsSelected() && "selected"}
//                         className="hover:bg-gray-50/70 transition-colors"
//                       >
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id} className="text-sm text-gray-700">
//                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={columns.length} className="h-24 text-center">
//                         <p className="text-sm text-gray-400">
//                           {glDateFilter
//                             ? "No vouchers found for the selected GL date"
//                             : "No unposted vouchers found"}
//                         </p>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             <DataTablePagination table={table} />
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteModal.show && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 shadow-xl">
//             <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete voucher{" "}
//               <span className="font-semibold">{deleteModal.voucherNo}</span>?
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setDeleteModal({ show: false, id: null, voucherNo: "" })}
//                 disabled={deleteMutation.isPending}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={deleteMutation.isPending}
//                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
//               >
//                 {deleteMutation.isPending ? "Deleting..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
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
  Pencil,
  Download,
  FileText,
  FileSpreadsheet,
  BadgeCheck,
  Search,
  Landmark,
  PlusIcon,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCcw } from "lucide-react";
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

import { DataTablePagination } from "@/components/DataTablePagination";
import { ReceiveService } from "@/api/AccontingApi";
import { toast } from "react-toastify";
import axios from "axios";
import { useHasPermission } from "@/hooks/use-permission";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

// ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
const toISODateString = (val) => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function ReceiveTable() {

  const [reverseId, setReverseId] = useState(null);
const [isReversing, setIsReversing] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, voucherNo: "" });
  const [downloading, setDownloading] = useState(null);
  const [glDateFrom, setGlDateFrom] = useState("");
  const [glDateTo, setGlDateTo] = useState("");

  const canCreate = useHasPermission("RECEIVE_VOUCHER_CREATE");
  const canEdit = useHasPermission("RECEIVE_VOUCHER_EDIT");
  const canDownload = useHasPermission("RECEIVE_VOUCHER_DOWNLOAD");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["unpostedVouchers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/receive-all-unposted`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (voucherId) => {
      const res = await ReceiveService.delete(voucherId);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success === 1 || data.status === "success") {
        toast.success("Voucher deleted successfully!");
        queryClient.invalidateQueries(["unpostedVouchers"]);
      } else {
        toast.error(data.message || "Delete failed!");
      }
      setDeleteModal({ show: false, id: null, voucherNo: "" });
    },
    onError: (error) => {
      toast.error("Error deleting voucher: " + error.message);
      setDeleteModal({ show: false, id: null, voucherNo: "" });
    },
  });

  const confirmDelete = () => {
    if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
  };
const handleReverseVoucher = async () => {
  if (!reverseId) return;
  setIsReversing(true);
  try {
    const res = await axios.post(`${BASE_URL}/api/reverse-voucher`, { id: reverseId });
    if (res.data.status === "success") {
      toast.success(res.data.message || "Voucher reversed successfully!");
      queryClient.invalidateQueries(["unpostedVouchers"]);
    } else {
      toast.error(res.data.message || "Failed to reverse voucher");
    }
  } catch (error) {
    toast.error("Error reversing voucher: " + (error.response?.data?.message || error.message));
  } finally {
    setIsReversing(false);
    setReverseId(null);
  }
};
  const sortedVouchers = useMemo(() => {
    const vouchers = Array.isArray(data?.data) ? data.data : [];
    return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
  }, [data]);

  // ── GL Date range filter ─────────────────────────────────────────────────
  const filteredVouchers = useMemo(() => {
    if (!glDateFrom && !glDateTo) return sortedVouchers;
    return sortedVouchers.filter((v) => {
      const formatted = toISODateString(v.GL_ENTRY_DATE);
      if (!formatted) return false;
      if (glDateFrom && formatted < glDateFrom) return false;
      if (glDateTo && formatted > glDateTo) return false;
      return true;
    });
  }, [sortedVouchers, glDateFrom, glDateTo]);

  const handleDownload = async (voucher, type) => {
    const key = `${voucher.ID}-${type}`;
    setDownloading(key);

    try {
      const response = await fetch(
        `${BASE_URL}/api/receipt/download/${voucher.ID}?type=${type}`
      );

      if (!response.ok) {
        let errMsg = `Server error ${response.status}`;
        try {
          const errBody = await response.json();
          errMsg = errBody.detail || errBody.message || errMsg;
        } catch {
          // ignore
        }
        toast.error(`Download failed: ${errMsg}`);
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const ext = type === "pdf" ? "pdf" : "xlsx";

      anchor.href = objectUrl;
      anchor.download = `receipt_voucher_${voucher.VOUCHERNO}.${ext}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success(`${type.toUpperCase()} downloaded successfully!`);
    } catch (err) {
      console.error(`[handleDownload] ${type} error:`, err);
      toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const columns = [
    {
      accessorKey: "VOUCHERNO",
      header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>
      ),
    },
    {
      accessorKey: "TRANS_DATE",
      header: ({ column }) => <SortableHeader column={column} label="Transaction Date" />,
      cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("TRANS_DATE")}</div>,
    },
    {
      accessorKey: "GL_ENTRY_DATE",
      header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
      cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{row.getValue("GL_ENTRY_DATE")}</div>,
    },
    {
      accessorKey: "DESCRIPTION",
      header: () => (
        <div className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Description
        </div>
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm text-gray-600" title={row.getValue("DESCRIPTION")}>
          {row.getValue("DESCRIPTION")}
        </div>
      ),
    },
    {
      accessorKey: "CREDIT",
      header: ({ column }) => <SortableHeader column={column} label="Debit" />,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("CREDIT") || 0);
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
        return <div className="ml-3 text-sm font-semibold text-gray-800">{formatted}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => (
        <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        const voucher = row.original;
        const isApproved = voucher.POSTED === 1 || voucher.POSTED === "1";

        return (
          <div className="flex items-center justify-center gap-1">
            {canEdit && (
              isApproved ? (
                <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
                  <Pencil size={16} />
                </Button>
              ) : (
                <Link to={`/dashboard/receive-edit/${voucher.ID}`} title="Edit Voucher">
                  <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                    <Pencil size={16} />
                  </Button>
                </Link>
              )
            )}

            {canDownload && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Download"
                    className="hover:bg-gray-100"
                    disabled={downloading?.startsWith(`${voucher.ID}-`)}
                  >
                    <Download size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Download as
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    disabled={downloading === `${voucher.ID}-pdf`}
                    onClick={() => handleDownload(voucher, "pdf")}
                  >
                    <FileText size={14} className="text-red-500" />
                    {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    disabled={downloading === `${voucher.ID}-excel`}
                    onClick={() => handleDownload(voucher, "excel")}
                  >
                    <FileSpreadsheet size={14} className="text-green-600" />
                    {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          {isApproved && (
  <TooltipProvider>
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
)}

{/* ── Reverse icon / Reversed badge ── */}
{isApproved && String(voucher.TYPE).toUpperCase() === "REVERSE" && (
  voucher.REF_REVERSE_ENTRY ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 bg-red-100 border border-red-200 cursor-default">
            <RotateCcw size={16} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-red-700 text-white text-xs">
          Reversed (Voucher #{voucher.REF_REVERSE_ENTRY})
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
            onClick={() => setReverseId(voucher.ID)}
          >
            <RotateCcw size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Reverse Entry</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
)}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredVouchers,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Loading vouchers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-red-600">Error loading vouchers.</p>
        </div>
      </div>
    );
  }

  const hasDateFilter = glDateFrom || glDateTo;

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-50 text-emerald-600">
                <Landmark size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Receive Voucher</h2>
                <p className="text-xs text-gray-400">
                  {filteredVouchers.length} total — unposted receive vouchers
                </p>
              </div>
            </div>

            {canCreate && (
              <Link to="/dashboard/receive-create">
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  Add New Receiver
                </Button>
              </Link>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Search + GL Date range filter + Column visibility */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vouchers..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
                />
              </div>

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
              {/* {hasDateFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 border border-dashed border-gray-200 text-gray-500 hover:text-gray-700"
                  onClick={() => { setGlDateFrom(""); setGlDateTo(""); }}
                >
                  Clear dates
                </Button>
              )} */}

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
                    .map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        className="capitalize"
                        checked={col.getIsVisible()}
                        onCheckedChange={(value) => col.toggleVisibility(!!value)}
                      >
                        {col.id.replace(/_/g, " ")}
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
                        <p className="text-sm text-gray-400">
                          {hasDateFilter
                            ? "No vouchers found for the selected date range"
                            : "No unposted vouchers found"}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <DataTablePagination table={table} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete voucher{" "}
              <span className="font-semibold">{deleteModal.voucherNo}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, id: null, voucherNo: "" })}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!reverseId} onOpenChange={() => !isReversing && setReverseId(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        <RotateCcw className="text-orange-600" size={20} />
        Reverse Voucher?
      </AlertDialogTitle>
      <AlertDialogDescription>
        A new reversal entry will be created with debit/credit swapped.{" "}
        <span className="text-red-500 font-medium">This action cannot be undone.</span>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={isReversing}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleReverseVoucher}
        disabled={isReversing}
        className="bg-orange-600 hover:bg-orange-700"
      >
        {isReversing ? "Reversing..." : "Yes, Reverse"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </>
  );
}