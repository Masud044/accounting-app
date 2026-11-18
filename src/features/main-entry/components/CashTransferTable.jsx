

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
//   Download,
//   FileText,
//   FileSpreadsheet,
//   PlusIcon,
//   Search,
//   ArrowLeftRight,
//   BadgeCheck,
//   RotateCcw,
//   Eye,
//   X,
//   Upload,
//   Paperclip as PaperclipIcon,
// } from "lucide-react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";

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
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
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
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useHasPermission } from "@/hooks/use-permission";
// import { EntryTypeBadge } from "./entry-type-badge";
// import { AttachmentIndicator } from "./attachment-indicator";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Backend e DELETE route style confirm hole ekhane-i change koro.
// // Param style:  DELETE /api/gldoc/:id
// // Query style:  DELETE /api/gldoc?id=123
// const gldocDeleteRequest = (docId) =>
//   axios.delete(`${BASE_URL}/api/gldoc/${docId}`);
// // const gldocDeleteRequest = (docId) =>
// //   axios.delete(`${BASE_URL}/api/gldoc`, { params: { id: docId } });

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

// // Normalize a date value to YYYY-MM-DD for comparison
// const toISODateString = (val) => {
//   if (!val) return null;
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return null;
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// const formatAmount = (value) =>
//   new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(value || 0));

// const isRowApproved = (v) => v.POSTED === 1 || v.POSTED === "1";

// export default function CashTransferTable() {
//   const queryClient = useQueryClient();

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [downloading, setDownloading] = useState(null);
//   const [glDateFrom, setGlDateFrom] = useState("");
//   const [glDateTo, setGlDateTo] = useState("");

//   // ── Reverse state ──
//   const [reverseId, setReverseId] = useState(null);
//   const [isReversing, setIsReversing] = useState(false);

//   // ── Review state ──
//   const [reviewVoucher, setReviewVoucher] = useState(null);

//   // ── Upload state ──
//   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
//   const [selectedVoucher, setSelectedVoucher] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const canCreate = useHasPermission("CASH_TRANSFER_CREATE");
//   const canDownload = useHasPermission("CASH_TRANSFER_DOWNLOAD");

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["unpostedCashTransfers"],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/cash-all-unposted`);
//       return res.data;
//     },
//   });

//   // ── Existing docs for the Upload dialog ──
//   const { data: existingDocs = [], refetch: refetchDocs } = useQuery({
//     queryKey: ["gldocs", selectedVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/gldoc`, {
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
//         return axios.post(`${BASE_URL}/api/gldoc`, fd);
//       });
//       return await Promise.all(uploads);
//     },
//     onSuccess: async () => {
//       toast.success("Invoice uploaded successfully!");
//       setSelectedFiles([]);
//       await refetchDocs();
//       queryClient.invalidateQueries({ queryKey: ["unpostedCashTransfers"] });
//     },
//     onError: (err) => {
//       toast.error("Failed to upload invoice: " + (err.response?.data?.message || err.message));
//     },
//     onSettled: () => setUploading(false),
//   });

//   // ── Delete document mutation ──
//   const deleteDocMutation = useMutation({
//     mutationFn: (docId) => gldocDeleteRequest(docId),
//     onSuccess: async () => {
//       toast.success("Document deleted successfully!");
//       await refetchDocs();
//       queryClient.invalidateQueries({ queryKey: ["unpostedCashTransfers"] });
//     },
//     onError: (err) => {
//       toast.error("Failed to delete document: " + (err.response?.data?.message || err.message));
//     },
//   });

//   // ── Review modal: master + details ──
//   const { data: reviewData, isLoading: reviewLoading } = useQuery({
//     queryKey: ["voucherReview", reviewVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/voucher-review/${reviewVoucher.ID}`);
//       return res.data;
//     },
//     enabled: !!reviewVoucher,
//   });

//   // ── Review modal: attachments ──
//   const { data: reviewDocs = [] } = useQuery({
//     queryKey: ["gldocs", "review", reviewVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/gldoc`, {
//         params: { glmaster_id: reviewVoucher.ID },
//       });
//       return res.data.data || [];
//     },
//     enabled: !!reviewVoucher,
//   });

//   const distributionRows = useMemo(() => {
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

//   const reviewTotalDebit = distributionRows.reduce((s, d) => s + d.debit, 0);
//   const reviewTotalCredit = distributionRows.reduce((s, d) => s + d.credit, 0);
//   const reviewMaster = reviewData?.master || {};

//   const sortedVouchers = useMemo(() => {
//     const vouchers = data?.status === "success" ? data.data : [];
//     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
//   }, [data]);

//   // ── GL Date range filter ──
//   const filteredVouchers = useMemo(() => {
//     if (!glDateFrom && !glDateTo) return sortedVouchers;
//     return sortedVouchers.filter((v) => {
//       const formatted = toISODateString(v.GL_ENTRY_DATE);
//       if (!formatted) return false;
//       if (glDateFrom && formatted < glDateFrom) return false;
//       if (glDateTo && formatted > glDateTo) return false;
//       return true;
//     });
//   }, [sortedVouchers, glDateFrom, glDateTo]);

//   // ── Totals for filtered data ──
//   const totalDebit = useMemo(
//     () => filteredVouchers.reduce((sum, v) => sum + parseFloat(v.DEBIT || 0), 0),
//     [filteredVouchers]
//   );
//   const totalCredit = useMemo(
//     () => filteredVouchers.reduce((sum, v) => sum + parseFloat(v.CREDIT || 0), 0),
//     [filteredVouchers]
//   );
//   const totalCount = filteredVouchers.length;

//   const handleDownload = async (voucher, type) => {
//     const key = `${voucher.ID}-${type}`;
//     setDownloading(key);
//     try {
//       const response = await fetch(
//         `${BASE_URL}/api/cash-transfer/download/${voucher.ID}?type=${type}`
//       );
//       if (!response.ok) {
//         let errMsg = `Server error ${response.status}`;
//         try { const b = await response.json(); errMsg = b.detail || b.message || errMsg; } catch { /* ignore */ }
//         toast.error(`Download failed: ${errMsg}`);
//         return;
//       }
//       const blob = await response.blob();
//       const objectUrl = URL.createObjectURL(blob);
//       const anchor = document.createElement("a");
//       anchor.href = objectUrl;
//       anchor.download = `cash_transfer_${voucher.VOUCHERNO}.${type === "pdf" ? "pdf" : "xlsx"}`;
//       document.body.appendChild(anchor);
//       anchor.click();
//       anchor.remove();
//       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
//       toast.success(`${type.toUpperCase()} downloaded successfully!`);
//     } catch (err) {
//       toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
//     } finally {
//       setDownloading(null);
//     }
//   };

//   const handleReverseVoucher = async () => {
//     if (!reverseId) return;
//     setIsReversing(true);
//     try {
//       const res = await axios.post(`${BASE_URL}/api/reverse-voucher`, { id: reverseId });
//       if (res.data.status === "success") {
//         toast.success(res.data.message || "Voucher reversed successfully!");
//         queryClient.invalidateQueries({ queryKey: ["unpostedCashTransfers"] });
//       } else {
//         toast.error(res.data.message || "Failed to reverse voucher");
//       }
//     } catch (err) {
//       toast.error("Error reversing voucher: " + (err.response?.data?.message || err.message));
//     } finally {
//       setIsReversing(false);
//       setReverseId(null);
//     }
//   };

//   // ── Upload handlers ──
//   const closeUploadDialog = () => {
//     setUploadDialogOpen(false);
//     setSelectedVoucher(null);
//     setSelectedFiles([]);
//   };

//   const handleUploadClick = (voucher) => {
//     setSelectedVoucher(voucher);
//     setSelectedFiles([]);
//     setUploadDialogOpen(true);
//   };

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles((prev) => [...prev, ...files]);
//     e.target.value = "";
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

//   const columns = [
//     {
//       accessorKey: "VOUCHERNO",
//       header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("VOUCHERNO")}</div>
//       ),
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
//       accessorKey: "DEBIT",
//       header: ({ column }) => <SortableHeader column={column} label="Debit" />,
//       cell: ({ row }) => {
//         const amount = parseFloat(row.getValue("DEBIT") || 0);
//         return <div className="ml-3 text-sm font-semibold text-gray-800">{formatAmount(amount)}</div>;
//       },
//     },
//     {
//       accessorKey: "CREDIT",
//       header: ({ column }) => <SortableHeader column={column} label="Credit" />,
//       cell: ({ row }) => {
//         const amount = parseFloat(row.getValue("CREDIT") || 0);
//         return <div className="ml-3 text-sm font-semibold text-gray-800">{formatAmount(amount)}</div>;
//       },
//     },
//     // ── Entry Type ──
//     {
//       id: "type",
//       header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</div>,
//       cell: ({ row }) => (
//         <div className="flex justify-center">
//           <EntryTypeBadge type={row.original.TYPE} />
//         </div>
//       ),
//     },
//     // ── Invoice Count ──
//     {
//       id: "attachment",
//       header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Count</div>,
//       cell: ({ row }) => (
//         <div className="flex justify-center">
//           <AttachmentIndicator count={row.original.DOC_COUNT} />
//         </div>
//       ),
//     },
//     // ── Upload Invoice ──
//     {
//       id: "uploadInvoice",
//       header: () => (
//         <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Upload Invoice</div>
//       ),
//       cell: ({ row }) => {
//         const voucher = row.original;
//         const approved = isRowApproved(voucher);
//         return (
//           <div className="flex justify-center">
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
//                     onClick={() => handleUploadClick(voucher)}
//                     disabled={approved}
//                   >
//                     <Upload size={16} />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent side="top">
//                   {approved ? "Cannot upload (approved)" : "Upload Invoice"}
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         );
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
//         const approved = isRowApproved(voucher);

//         return (
//           <div className="flex items-center justify-center gap-1">
//             {/* Approved → Review (read-only modal) */}
//             {approved && (
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
//                       onClick={() => setReviewVoucher(voucher)}
//                     >
//                       <Eye size={16} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent side="top">Review Voucher</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             )}

//             {canDownload && (
//               <DropdownMenu>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="hover:bg-amber-50 hover:text-amber-700"
//                           disabled={downloading?.startsWith(`${voucher.ID}-`)}
//                         >
//                           <Download size={16} />
//                         </Button>
//                       </DropdownMenuTrigger>
//                     </TooltipTrigger>
//                     <TooltipContent side="top">Download</TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <DropdownMenuContent align="end" className="w-40">
//                   <DropdownMenuLabel className="text-xs text-muted-foreground">Download as</DropdownMenuLabel>
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

//             {approved && (
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

//             {approved && String(voucher.TYPE).toUpperCase() !== "REVERSE" && !voucher.REF_REVERSE_ENTRY && (
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
//                       onClick={() => setReverseId(voucher.ID)}
//                     >
//                       <RotateCcw size={16} />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent side="top">Reverse Entry</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             )}

//             {approved && voucher.REF_REVERSE_ENTRY && (
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 bg-red-100 border border-red-200 cursor-default">
//                       <RotateCcw size={16} />
//                     </span>
//                   </TooltipTrigger>
//                   <TooltipContent side="top" className="bg-red-700 text-white text-xs">
//                     Reversed (Voucher #{voucher.REF_REVERSE_ENTRY})
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

//   if (isLoading) return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         <div className="flex items-center justify-center py-12">
//           <p className="text-sm text-gray-500">Loading...</p>
//         </div>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         <div className="flex items-center justify-center py-12">
//           <p className="text-sm text-red-600">Error loading records.</p>
//         </div>
//       </div>
//     </div>
//   );

//   const hasDateFilter = glDateFrom || glDateTo;

//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
//               <ArrowLeftRight size={16} />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">Cash Transfer</h2>
//               <p className="text-xs text-gray-400">
//                 {filteredVouchers.length} total — cash transfer records
//               </p>
//             </div>
//           </div>

//           {canCreate && (
//             <Link to="/dashboard/cash-transfer-create">
//               <Button>
//                 <PlusIcon size={16} className="mr-2" />
//                 Add New Transfer
//               </Button>
//             </Link>
//           )}
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Search + GL Date range filter + Column visibility */}
//           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//             <div className="relative max-w-sm w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search records..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
//               />
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
//                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
//                   <DropdownMenuCheckboxItem
//                     key={col.id}
//                     className="capitalize"
//                     checked={col.getIsVisible()}
//                     onCheckedChange={(value) => col.toggleVisibility(!!value)}
//                   >
//                     {col.id.replace(/_/g, " ")}
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
//                   <>
//                     {table.getRowModel().rows.map((row) => (
//                       <TableRow key={row.id} className="hover:bg-gray-50/70 transition-colors">
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id} className="text-sm text-gray-700">
//                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))}

//                     {/* Total Row */}
//                     {filteredVouchers.length > 0 && (
//                       <TableRow className="bg-gray-100 font-semibold border-t-2 border-gray-300">
//                         <TableCell colSpan={3} className="text-right text-sm font-bold text-gray-800">
//                           Total ({totalCount} entries)
//                         </TableCell>
//                         <TableCell className="text-sm font-bold text-gray-800">
//                           <span className="ml-3">{formatAmount(totalDebit)}</span>
//                         </TableCell>
//                         <TableCell className="text-sm font-bold text-gray-800">
//                           <span className="ml-3">{formatAmount(totalCredit)}</span>
//                         </TableCell>
//                         <TableCell colSpan={4} />
//                       </TableRow>
//                     )}
//                   </>
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <p className="text-sm text-gray-400">
//                         {hasDateFilter
//                           ? "No records found for the selected date range"
//                           : "No cash transfer records found"}
//                       </p>
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
//                         href={`${BASE_URL}/api/gldoc?id=${doc.ID}&file=true`}
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

//       {/* ── Reverse Confirmation Dialog ── */}
//       <AlertDialog open={!!reverseId} onOpenChange={() => !isReversing && setReverseId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2">
//               <RotateCcw className="text-orange-600" size={20} />
//               Reverse Voucher?
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               A new reversal entry will be created with debit/credit swapped.{" "}
//               <span className="text-red-500 font-medium">This action cannot be undone.</span>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isReversing}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleReverseVoucher}
//               disabled={isReversing}
//               className="bg-orange-600 hover:bg-orange-700"
//             >
//               {isReversing ? "Reversing..." : "Yes, Reverse"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* ── Review Voucher Modal (read-only) ── */}
//       {reviewVoucher && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <div className="flex items-center gap-2">
//                 <Eye size={18} className="text-indigo-600" />
//                 <h2 className="text-base font-bold text-gray-900">
//                   Cash Transfer #{reviewVoucher.VOUCHERNO}
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
//                   Transaction Date
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
//                   {reviewMaster.TRANS_DATE || reviewVoucher.TRANS_DATE || "—"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   GL Date
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
//                   {reviewVoucher.GL_ENTRY_DATE || "—"}
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
//                   {formatAmount(
//                     parseFloat(reviewVoucher.DEBIT || 0) !== 0
//                       ? reviewVoucher.DEBIT
//                       : reviewVoucher.CREDIT
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
//                         href={`${BASE_URL}/api/gldoc?id=${doc.ID}&file=true`}
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
//                             {d.debit > 0 ? formatAmount(d.debit) : ""}
//                           </td>
//                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
//                             {d.credit > 0 ? formatAmount(d.credit) : ""}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                   {!reviewLoading && distributionRows.length > 0 && (
//                     <tfoot>
//                       <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
//                         <td colSpan={2} className="px-4 py-2 text-right text-slate-800">Total</td>
//                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatAmount(reviewTotalDebit)}</td>
//                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatAmount(reviewTotalCredit)}</td>
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


import { useState, useMemo, useRef, useLayoutEffect, useEffect } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Check,
  ChevronDown,
  Eye,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  BadgeCheck,
  Search,
  ArrowLeftRight,
  Paperclip as PaperclipIcon,
  PlusIcon,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { create } from "zustand";

import { cn } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
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

import { DataTablePagination } from "@/components/DataTablePagination";

import { toast } from "react-toastify";
import axios from "axios";
import { useHasPermission } from "@/hooks/use-permission";
import { AttachmentIndicator } from "./attachment-indicator";
import { EntryTypeBadge } from "./entry-type-badge";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Below this container width the table becomes a row list
// (pinned columns + at least 3 scrolling columns × ~115px ≈ 800px).
const NARROW_BREAKPOINT = 800;

// ── Active row (row click only highlights; one id at a time) ────────────────
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
  clear: () => set({ activeId: null }),
}));

// ── Narrow container (container-query behaviour, independent of Tailwind) ──
// Stores a boolean, so resize noise (e.g. scrollbar lock while a menu is open)
// never re-renders the table unless the layout really flips.
function useIsNarrow(ref, breakpoint) {
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setNarrow(el.getBoundingClientRect().width < breakpoint);
    const ro = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < breakpoint));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, breakpoint]);
  return narrow;
}

// Call header/cell defs directly instead of as components: `columns` is rebuilt
// every render, so flexRender would remount cells and close open dropdowns.
const renderDef = (def, ctx) => (typeof def === "function" ? def(ctx) : def);

// ── Formatting ──────────────────────────────────────────────────────────────
const amountFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Missing value → dash. Real zero → 0.00. Negative → minus sign (+ destructive tone).
const Amount = ({ value, className }) => {
  const n =
    value === null || value === undefined || value === "" ? NaN : parseFloat(value);
  if (Number.isNaN(n)) return <span className="text-gray-500">—</span>;
  return (
    <span className={cn("tabular-nums", n < 0 && "text-red-600", className)}>
      {amountFmt.format(n)}
    </span>
  );
};

const Dash = () => <span className="text-gray-500">—</span>;

// ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
const toISODateString = (val) => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ── Layout helpers ──────────────────────────────────────────────────────────
const alignClass = (align) =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";

// Pinned cells: solid background, 1px border on the inner edge, no shadow.
const pinClass = (pin, z) =>
  pin === "left"
    ? `sticky left-0 ${z} border-r border-gray-200`
    : pin === "right"
      ? `sticky right-0 ${z} border-l border-gray-200`
      : "";

// Solid row backgrounds (pinned cells need opaque colours).
// Active is a stronger solid tint than hover.
const cellBg = (isActive) =>
  isActive
    ? "bg-blue-100"
    : "bg-white group-hover/row:bg-gray-50";

// Sort arrow only on the active column.
const SortableHeader = ({ column, label, align = "left" }) => {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-mx-2 h-8 gap-1 px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-transparent hover:text-gray-700",
        align === "right" && "flex-row-reverse"
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" && <ArrowUp className="h-3 w-3" aria-hidden="true" />}
      {sorted === "desc" && <ArrowDown className="h-3 w-3" aria-hidden="true" />}
    </Button>
  );
};

// One hover style for the whole table: dark navy bubble, rounded, small arrow.
const HoverTip = ({ content, children, side = "top" }) => (
  <TooltipPrimitive.Root delayDuration={150}>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        sideOffset={6}
        className="z-[200] max-w-sm break-words rounded-md bg-slate-800 px-3 py-2 text-xs font-medium leading-snug text-white shadow-lg"
      >
        {content}
        <TooltipPrimitive.Arrow className="fill-slate-800" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

const PlainHeader = ({ label }) => <span>{label}</span>;

const SORT_OPTIONS = [
  { id: "VOUCHERNO", label: "Voucher No" },
  { id: "GL_ENTRY_DATE", label: "GL Date" },
  { id: "DEBIT", label: "Debit" },
  { id: "CREDIT", label: "Credit" },
];

// Backend e DELETE route style confirm hole ekhane-i change koro.
// Param style:  DELETE /api/gldoc/:id
// Query style:  DELETE /api/gldoc?id=123
const gldocDeleteRequest = (docId) =>
  axios.delete(`${BASE_URL}/api/gldoc/${docId}`);
// const gldocDeleteRequest = (docId) =>
//   axios.delete(`${BASE_URL}/api/gldoc`, { params: { id: docId } });

const formatAmount = (value) => amountFmt.format(Number(value || 0));

const isRowApproved = (v) => v.POSTED === 1 || v.POSTED === "1";

// Phone row key value: debit when present, otherwise credit (same rule as the review modal)
const keyAmount = (v) => (parseFloat(v.DEBIT || 0) !== 0 ? v.DEBIT : v.CREDIT);

export default function CashTransferTable() {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [glDateFrom, setGlDateFrom] = useState("");
  const [glDateTo, setGlDateTo] = useState("");

  // ── Reverse state ──
  const [reverseId, setReverseId] = useState(null);
  const [isReversing, setIsReversing] = useState(false);

  // ── Review state ──
  const [reviewVoucher, setReviewVoucher] = useState(null);

  // ── Upload state ──
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ── Table UI state ──
  const wrapperRef = useRef(null);
  const isNarrow = useIsNarrow(wrapperRef, NARROW_BREAKPOINT);
  const [expandedId, setExpandedId] = useState(null); // phone rows: one open at a time

  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);
  const clearActive = useActiveRowStore((s) => s.clear);
  useEffect(() => clearActive, [clearActive]);

  const canCreate = useHasPermission("CASH_TRANSFER_CREATE");
  const canDownload = useHasPermission("CASH_TRANSFER_DOWNLOAD");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["unpostedCashTransfers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/cash-all-unposted`);
      return res.data;
    },
  });

  // ── Existing docs for the Upload dialog ──
  const { data: existingDocs = [], refetch: refetchDocs } = useQuery({
    queryKey: ["gldocs", selectedVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/gldoc`, {
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
        return axios.post(`${BASE_URL}/api/gldoc`, fd);
      });
      return await Promise.all(uploads);
    },
    onSuccess: async () => {
      toast.success("Invoice uploaded successfully!");
      setSelectedFiles([]);
      await refetchDocs();
      queryClient.invalidateQueries({ queryKey: ["unpostedCashTransfers"] });
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
      queryClient.invalidateQueries({ queryKey: ["unpostedCashTransfers"] });
    },
    onError: (err) => {
      toast.error("Failed to delete document: " + (err.response?.data?.message || err.message));
    },
  });

  // ── Review modal: master + details ──
  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["voucherReview", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/voucher-review/${reviewVoucher.ID}`);
      return res.data;
    },
    enabled: !!reviewVoucher,
  });

  // ── Review modal: attachments ──
  const { data: reviewDocs = [] } = useQuery({
    queryKey: ["gldocs", "review", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/gldoc`, {
        params: { glmaster_id: reviewVoucher.ID },
      });
      return res.data.data || [];
    },
    enabled: !!reviewVoucher,
  });

  const distributionRows = useMemo(() => {
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

  const reviewTotalDebit = distributionRows.reduce((s, d) => s + d.debit, 0);
  const reviewTotalCredit = distributionRows.reduce((s, d) => s + d.credit, 0);
  const reviewMaster = reviewData?.master || {};

  const sortedVouchers = useMemo(() => {
    const vouchers = data?.status === "success" ? data.data : [];
    return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
  }, [data]);

  // ── GL Date range filter ──
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

  // ── Totals for filtered data ──
  const totalDebit = useMemo(
    () => filteredVouchers.reduce((sum, v) => sum + parseFloat(v.DEBIT || 0), 0),
    [filteredVouchers]
  );
  const totalCredit = useMemo(
    () => filteredVouchers.reduce((sum, v) => sum + parseFloat(v.CREDIT || 0), 0),
    [filteredVouchers]
  );
  const totalCount = filteredVouchers.length;

  const handleDownload = async (voucher, type) => {
    const key = `${voucher.ID}-${type}`;
    setDownloading(key);
    try {
      const response = await fetch(
        `${BASE_URL}/api/cash-transfer/download/${voucher.ID}?type=${type}`
      );
      if (!response.ok) {
        let errMsg = `Server error ${response.status}`;
        try { const b = await response.json(); errMsg = b.detail || b.message || errMsg; } catch { /* ignore */ }
        toast.error(`Download failed: ${errMsg}`);
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `cash_transfer_${voucher.VOUCHERNO}.${type === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success(`${type.toUpperCase()} downloaded successfully!`);
    } catch (err) {
      toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleReverseVoucher = async () => {
    if (!reverseId) return;
    setIsReversing(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/reverse-voucher`, { id: reverseId });
      if (res.data.status === "success") {
        toast.success(res.data.message || "Voucher reversed successfully!");
        queryClient.invalidateQueries({ queryKey: ["unpostedCashTransfers"] });
      } else {
        toast.error(res.data.message || "Failed to reverse voucher");
      }
    } catch (err) {
      toast.error("Error reversing voucher: " + (err.response?.data?.message || err.message));
    } finally {
      setIsReversing(false);
      setReverseId(null);
    }
  };

  // ── Upload handlers ──
  const closeUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedVoucher(null);
    setSelectedFiles([]);
  };

  const handleUploadClick = (voucher) => {
    setSelectedVoucher(voucher);
    setSelectedFiles([]);
    setUploadDialogOpen(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
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

  // ── Columns ──────────────────────────────────────────────────────────────
  // meta: align (by data type), pin (identity left / actions right), width.
  // Description is the one flexible column that absorbs the slack.
  const columns = [
    {
      accessorKey: "VOUCHERNO", // identity
      meta: { align: "left", pin: "left", width: "w-[11rem] min-w-[11rem]" },
      header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
      cell: ({ row }) => {
        const v = row.getValue("VOUCHERNO");
        return <span className="font-medium text-gray-800">{v || <Dash />}</span>;
      },
    },
    {
      accessorKey: "GL_ENTRY_DATE", // date
      meta: { align: "left", width: "w-[8.5rem] min-w-[8.5rem]" },
      header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
      cell: ({ row }) => {
        const v = row.getValue("GL_ENTRY_DATE");
        return v ? <span className="tabular-nums text-gray-600">{v}</span> : <Dash />;
      },
    },
    {
      accessorKey: "DESCRIPTION", // meta text — flexible column
      meta: { align: "left", width: "w-full min-w-[16rem]" },
      header: () => <PlainHeader label="Description" />,
      cell: ({ row }) => {
        const v = row.getValue("DESCRIPTION");
        return v ? (
          <HoverTip content={v}>
            <div className="w-0 min-w-full truncate text-gray-600">{v}</div>
          </HoverTip>
        ) : (
          <Dash />
        );
      },
    },
    {
      accessorKey: "DEBIT", // value
      meta: { align: "right", width: "w-[9rem] min-w-[9rem]" },
      header: ({ column }) => <SortableHeader column={column} label="Debit" align="right" />,
      cell: ({ row }) => <Amount value={row.getValue("DEBIT")} className="font-semibold text-gray-800" />,
    },
    {
      accessorKey: "CREDIT", // value
      meta: { align: "right", width: "w-[9rem] min-w-[9rem]" },
      header: ({ column }) => <SortableHeader column={column} label="Credit" align="right" />,
      cell: ({ row }) => <Amount value={row.getValue("CREDIT")} className="font-semibold text-gray-800" />,
    },
    {
      id: "type", // state
      meta: { align: "center", width: "w-[8rem] min-w-[8rem]" },
      header: () => <PlainHeader label="Type" />,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <EntryTypeBadge type={row.original.TYPE} />
        </div>
      ),
    },
    {
      id: "attachment",
      meta: { align: "center", width: "w-[8rem] min-w-[8rem]" },
      header: () => <PlainHeader label="Invoice Count" />,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AttachmentIndicator count={row.original.DOC_COUNT} />
        </div>
      ),
    },
    // ── Upload Invoice ──
    {
      id: "uploadInvoice",
      meta: { align: "center", width: "w-[8rem] min-w-[8rem]" },
      header: () => <PlainHeader label="Upload Invoice" />,
      cell: ({ row }) => {
        const voucher = row.original;
        const approved = isRowApproved(voucher);
        return (
          <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
            <HoverTip content={<>{approved ? "Cannot upload (approved)" : "Upload Invoice"}</>}>
              {/* span keeps the tooltip working while the button is disabled */}
              <span tabIndex={approved ? 0 : -1}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Upload invoice"
                  onClick={() => handleUploadClick(voucher)}
                  disabled={approved}
                >
                  <Upload size={16} />
                </Button>
              </span>
            </HoverTip>
          </div>
        );
      },
    },
    {
      id: "actions", // action — always visible
      enableHiding: false,
      meta: { align: "center", pin: "right", width: "w-[11rem] min-w-[11rem]" },
      header: () => <PlainHeader label="Actions" />,
      cell: ({ row }) => {
        const voucher = row.original;
        const approved = isRowApproved(voucher);

        return (
          <div
            className="flex items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Approved → Review (read-only modal) */}
            {approved && (
              <HoverTip content={<>Review Voucher</>}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label="Review voucher"
                  onClick={() => setReviewVoucher(voucher)}
                >
                  <Eye size={16} />
                </Button>
              </HoverTip>
            )}

            {canDownload && (
              <DropdownMenu>
                <HoverTip content="Download">
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Download"
                      className="h-8 w-8 hover:bg-amber-50 hover:text-amber-700"
                      disabled={downloading?.startsWith(`${voucher.ID}-`)}
                    >
                      <Download size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                </HoverTip>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Download as</DropdownMenuLabel>
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

            {approved && (
              <HoverTip content={<>Approved</>}>
                <span className="inline-flex h-8 w-8 cursor-default items-center justify-center rounded-full border border-green-200 bg-green-100 text-green-600">
                  <BadgeCheck size={16} />
                  <span className="sr-only">Approved</span>
                </span>
              </HoverTip>
            )}

            {approved &&
              String(voucher.TYPE).toUpperCase() !== "REVERSE" &&
              !voucher.REF_REVERSE_ENTRY && (
                <HoverTip content={<>Reverse Entry</>}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-800"
                    aria-label="Reverse entry"
                    onClick={() => setReverseId(voucher.ID)}
                  >
                    <RotateCcw size={16} />
                  </Button>
                </HoverTip>
              )}

            {approved && voucher.REF_REVERSE_ENTRY && (
              <HoverTip content={<>Reversed (Voucher #{voucher.REF_REVERSE_ENTRY})</>}>
                <span className="inline-flex h-8 w-8 cursor-default items-center justify-center rounded-full border border-red-200 bg-red-100 text-red-600">
                  <RotateCcw size={16} />
                  <span className="sr-only">Reversed</span>
                </span>
              </HoverTip>
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

  const hasDateFilter = glDateFrom || glDateTo;
  const hasFilters = hasDateFilter || globalFilter;
  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  const clearFilters = () => {
    setGlDateFrom("");
    setGlDateTo("");
    setGlobalFilter("");
  };

  // Phone: sorting lives in a control above the list
  const handleSortSelect = (id) => {
    const current = sorting.find((s) => s.id === id);
    setSorting([{ id, desc: current ? !current.desc : false }]);
  };
  const activeSort = sorting[0];
  const activeSortLabel = SORT_OPTIONS.find((o) => o.id === activeSort?.id)?.label;

  // ── Phone row actions (labelled buttons, 40px+, no kebab) ─────────────────
  const renderMobileActions = (voucher) => {
    const isApproved = isRowApproved(voucher);
    return (
      <div className="flex flex-wrap gap-2">
        {isApproved && (
            <Button
              variant="outline"
              className="h-10 gap-2"
              onClick={() => setReviewVoucher(voucher)}
            >
              <Eye size={16} />
              Review
            </Button>
        )}

        <Button
          variant="outline"
          className="h-10 gap-2"
          disabled={isApproved}
          onClick={() => handleUploadClick(voucher)}
        >
          <Upload size={16} />
          Upload invoice
        </Button>

        {canDownload && (
          <>
            <Button
              variant="outline"
              className="h-10 gap-2"
              disabled={downloading === `${voucher.ID}-pdf`}
              onClick={() => handleDownload(voucher, "pdf")}
            >
              <FileText size={16} />
              {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
            </Button>
            <Button
              variant="outline"
              className="h-10 gap-2"
              disabled={downloading === `${voucher.ID}-excel`}
              onClick={() => handleDownload(voucher, "excel")}
            >
              <FileSpreadsheet size={16} />
              {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
            </Button>
          </>
        )}

        {isApproved &&
          String(voucher.TYPE).toUpperCase() !== "REVERSE" &&
          !voucher.REF_REVERSE_ENTRY && (
            <Button
              variant="outline"
              className="h-10 gap-2 text-orange-600 hover:text-orange-800"
              onClick={() => setReverseId(voucher.ID)}
            >
              <RotateCcw size={16} />
              Reverse
            </Button>
          )}
      </div>
    );
  };

  // ── Empty / error blocks (message + next action) ──────────────────────────
  const stateBlock = error ? (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="text-sm text-red-600">
        Couldn’t load records. Check your connection and try again.
      </p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>
        Try again
      </Button>
    </div>
  ) : !isLoading && rows.length === 0 ? (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <p className="text-sm text-gray-500">
        {hasFilters ? "No records match your filters." : "No cash transfer records yet."}
      </p>
      {hasFilters ? (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      ) : (
        canCreate && (
          <Button asChild variant="link" size="sm">
            <Link to="/dashboard/cash-transfer-create">
              <PlusIcon size={16} className="mr-2" />
              Add first transfer
            </Link>
          </Button>
        )
      )}
    </div>
  ) : null;

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-50 text-amber-600">
                <ArrowLeftRight size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Cash Transfer</h2>
                <p className="text-xs text-gray-500">
                  {filteredVouchers.length} total — cash transfer records
                </p>
              </div>
            </div>

            {canCreate && (
              <Link to="/dashboard/cash-transfer-create">
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  Add New Transfer
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-4 p-5">
            {/* Search + GL Date range filter + Column visibility */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search records..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="border-gray-200 bg-white pl-9 focus-visible:ring-1 focus-visible:ring-amber-300"
                />
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <label className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Gl From Date
                </label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={glDateFrom}
                    max={glDateTo || undefined}
                    onChange={(e) => setGlDateFrom(e.target.value)}
                    className="border-gray-200 bg-white pr-8 focus-visible:ring-1 focus-visible:ring-violet-300"
                  />
                  {glDateFrom && (
                    <button
                      type="button"
                      onClick={() => setGlDateFrom("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800"
                      title="Clear from date"
                      aria-label="Clear from date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <label className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-500">
                  To Date
                </label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={glDateTo}
                    min={glDateFrom || undefined}
                    onChange={(e) => setGlDateTo(e.target.value)}
                    className="border-gray-200 bg-white pr-8 focus-visible:ring-1 focus-visible:ring-violet-300"
                  />
                  {glDateTo && (
                    <button
                      type="button"
                      onClick={() => setGlDateTo("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800"
                      title="Clear to date"
                      aria-label="Clear to date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {!isNarrow && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 bg-white sm:ml-auto">
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
              )}
            </div>

            {/* Table (desktop) / row list (narrow container) */}
            <div ref={wrapperRef} className="overflow-hidden rounded-md border border-gray-200">
              {isNarrow ? (
                <div>
                  {/* Sort control above the list */}
                  <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
                    <span className="text-xs text-gray-500">{totalCount} entries</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 gap-2 text-xs">
                          <ArrowUpDown size={14} />
                          {activeSortLabel ? `Sort: ${activeSortLabel}` : "Sort"}
                          {activeSort &&
                            (activeSort.desc ? <ArrowDown size={12} /> : <ArrowUp size={12} />)}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {SORT_OPTIONS.map((opt) => {
                          const current = sorting.find((s) => s.id === opt.id);
                          return (
                            <DropdownMenuItem
                              key={opt.id}
                              className="cursor-pointer gap-2"
                              onClick={() => handleSortSelect(opt.id)}
                            >
                              <span className="w-4">
                                {current && <Check size={14} />}
                              </span>
                              {opt.label}
                              {current &&
                                (current.desc ? (
                                  <ArrowDown size={12} className="ml-auto" />
                                ) : (
                                  <ArrowUp size={12} className="ml-auto" />
                                ))}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <ul className="divide-y divide-border">
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <li key={i} className="flex min-h-[44px] flex-col gap-2 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="ml-auto h-3 w-24" />
                          </div>
                        </li>
                      ))}

                    {!isLoading &&
                      !error &&
                      rows.map((row) => {
                        const v = row.original;
                        const open = expandedId === v.ID;
                        const isApproved = isRowApproved(v);
                        return (
                          <li key={row.id}>
                            {/* Line 1: identity + key value. Line 2: state + secondary info */}
                            <button
                              type="button"
                              aria-expanded={open}
                              aria-controls={`cash-row-${v.ID}`}
                              onClick={() => setExpandedId(open ? null : v.ID)}
                              className="flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            >
                              <span className="block min-w-0 flex-1">
                                <span className="flex items-baseline justify-between gap-3">
                                  <span className="truncate text-sm font-medium text-gray-800">
                                    {v.VOUCHERNO || <Dash />}
                                  </span>
                                  <Amount
                                    value={keyAmount(v)}
                                    className="shrink-0 text-sm font-semibold"
                                  />
                                </span>
                                <span className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                  <EntryTypeBadge type={v.TYPE} />
                                  {isApproved && (
                                    <span className="inline-flex items-center gap-1 text-green-600">
                                      <BadgeCheck size={14} aria-hidden="true" />
                                      Approved
                                    </span>
                                  )}
                                  <span className="ml-auto whitespace-nowrap">
                                    GL {v.GL_ENTRY_DATE || "—"}
                                  </span>
                                </span>
                              </span>
                              <ChevronDown
                                aria-hidden="true"
                                className={cn(
                                  "h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ease-out motion-reduce:transition-none",
                                  open && "rotate-180"
                                )}
                              />
                            </button>

                            {/* Expand in place: only fields not already on the row + actions */}
                            <div
                              id={`cash-row-${v.ID}`}
                              className={cn(
                                "grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
                                open
                                  ? "visible grid-rows-[1fr] opacity-100"
                                  : "invisible grid-rows-[0fr] opacity-0"
                              )}
                            >
                              <div className="overflow-hidden">
                                <div className="space-y-3 px-4 pb-4">
                                  <dl className="space-y-2 text-sm">
                                    <div>
<dt className="text-xs text-gray-500">Debit</dt>
<dd className="text-gray-800"><Amount value={v.DEBIT} /></dd>
</div>
<div>
<dt className="text-xs text-gray-500">Credit</dt>
<dd className="text-gray-800"><Amount value={v.CREDIT} /></dd>
</div>
                                    <div>
                                      <dt className="text-xs text-gray-500">Description</dt>
                                      <dd className="line-clamp-2 text-gray-800">
                                        {v.DESCRIPTION || <Dash />}
                                      </dd>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <dt className="text-xs text-gray-500">Invoices</dt>
                                      <dd>
                                        <AttachmentIndicator count={v.DOC_COUNT} />
                                      </dd>
                                    </div>
                                  </dl>
                                  {isApproved && v.REF_REVERSE_ENTRY && (
                                    <p className="flex items-center gap-1 text-xs text-red-600">
                                      <RotateCcw size={14} aria-hidden="true" />
                                      Reversed (Voucher #{v.REF_REVERSE_ENTRY})
                                    </p>
                                  )}
                                  {renderMobileActions(v)}
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>

                  {!isLoading && !error && filteredVouchers.length > 0 && (
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold">
                      <span>Total ({totalCount} entries)</span>
                      <span className="flex gap-4">
                        <span>Debit <Amount value={totalDebit} /></span>
                        <span>Credit <Amount value={totalCredit} /></span>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Single scroll container: header pinned vertically, identity + actions pinned horizontally
                <div className="max-h-[calc(100dvh-12rem)] overflow-auto">
                  <table className="w-full border-separate border-spacing-0 text-sm">
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
                                aria-sort={
                                  sorted ? (sorted === "asc" ? "ascending" : "descending") : undefined
                                }
                                className={cn(
                                  "sticky top-0 h-12 whitespace-nowrap border-b border-gray-200 bg-gray-50 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500",
                                  alignClass(meta.align),
                                  meta.width,
                                  meta.pin ? pinClass(meta.pin, "z-30") : "z-20"
                                )}
                              >
                                {h.isPlaceholder
                                  ? null
                                  : renderDef(h.column.columnDef.header, h.getContext())}
                              </th>
                            );
                          })}
                        </tr>
                      ))}
                    </thead>

                    <tbody>
                      {isLoading &&
                        Array.from({ length: 8 }).map((_, i) => (
                          <tr key={i} className="h-12">
                            {visibleColumns.map((col) => {
                              const meta = col.columnDef.meta ?? {};
                              return (
                                <td
                                  key={col.id}
                                  className={cn(
                                    "h-12 whitespace-nowrap border-b border-gray-200 bg-white px-3",
                                    meta.width,
                                    pinClass(meta.pin, "z-10")
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "flex",
                                      meta.align === "right" && "justify-end",
                                      meta.align === "center" && "justify-center"
                                    )}
                                  >
                                    <Skeleton
                                      className={cn(
                                        "h-4",
                                        meta.align === "center" ? "w-12" : "w-3/4"
                                      )}
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}

                      {!isLoading &&
                        !error &&
                        rows.map((row) => {
                          const id = row.original.ID ?? row.id;
                          const isActive = activeId === id;
                          return (
                            <tr
                              key={row.id}
                              tabIndex={0}
                              aria-current={isActive ? "true" : undefined}
                              data-state={row.getIsSelected() ? "selected" : undefined}
                              onClick={() => toggleActive(id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.target === e.currentTarget) {
                                  e.preventDefault();
                                  toggleActive(id);
                                }
                              }}
                              className="group/row h-12 cursor-pointer outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                            >
                              {row.getVisibleCells().map((cell) => {
                                const meta = cell.column.columnDef.meta ?? {};
                                return (
                                  <td
                                    key={cell.id}
                                    className={cn(
                                      "h-12 whitespace-nowrap border-b border-gray-200 px-3 text-sm text-gray-700",
                                      alignClass(meta.align),
                                      meta.width,
                                      pinClass(meta.pin, "z-10"),
                                      cellBg(isActive)
                                    )}
                                  >
                                    {renderDef(cell.column.columnDef.cell, cell.getContext())}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </tbody>

                    {/* ── Total row ── */}
                    {!isLoading && !error && filteredVouchers.length > 0 && (
                      <tfoot>
                        <tr className="h-12">
                          {visibleColumns.map((col, i) => {
                            const meta = col.columnDef.meta ?? {};
                            return (
                              <td
                                key={col.id}
                                className={cn(
                                  "sticky bottom-0 h-12 whitespace-nowrap border-t-2 border-gray-300 bg-gray-100 px-3 text-sm font-semibold text-gray-800",
                                  alignClass(meta.align),
                                  meta.pin ? pinClass(meta.pin, "z-30") : "z-20"
                                )}
                              >
                                {i === 0 ? (
                                  `Total (${totalCount} entries)`
                                ) : col.id === "DEBIT" ? (
                                  <Amount value={totalDebit} />
                                ) : col.id === "CREDIT" ? (
                                  <Amount value={totalCredit} />
                                ) : null}
                              </td>
                            );
                          })}
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}

              {stateBlock}
            </div>

            {!isLoading && !error && <DataTablePagination table={table} />}
          </div>
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
                        href={`${BASE_URL}/api/gldoc?id=${doc.ID}&file=true`}
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

      {/* ── Reverse Confirmation Dialog ── */}
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

      {/* ── Review Voucher Modal (read-only) ── */}
      {reviewVoucher && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-indigo-600" />
                <h2 className="text-base font-bold text-gray-900">
                  Cash Transfer #{reviewVoucher.VOUCHERNO}
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
                  Transaction Date
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                  {reviewMaster.TRANS_DATE || reviewVoucher.TRANS_DATE || "—"}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  GL Date
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                  {reviewVoucher.GL_ENTRY_DATE || "—"}
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
                  {formatAmount(
                    parseFloat(reviewVoucher.DEBIT || 0) !== 0
                      ? reviewVoucher.DEBIT
                      : reviewVoucher.CREDIT
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
                        href={`${BASE_URL}/api/gldoc?id=${doc.ID}&file=true`}
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
                            {d.debit > 0 ? formatAmount(d.debit) : ""}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                            {d.credit > 0 ? formatAmount(d.credit) : ""}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {!reviewLoading && distributionRows.length > 0 && (
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                        <td colSpan={2} className="px-4 py-2 text-right text-slate-800">Total</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatAmount(reviewTotalDebit)}</td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatAmount(reviewTotalCredit)}</td>
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
    </TooltipProvider>
  );
}