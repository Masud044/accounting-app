

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
// //   Eye,
// //   X,
// //   Download,
// //   FileText,
// //   FileSpreadsheet,
// //   BadgeCheck,
// //   Search,
// //   BookOpenText,
// //   PlusIcon,
// //   RotateCcw,
// //   Upload,
// // } from "lucide-react";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import { Link } from "react-router-dom";

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
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import { toast } from "react-toastify";
// // import axios from "axios";
// // import { useHasPermission } from "@/hooks/use-permission";
// // import { EntryTypeBadge } from "./entry-type-badge";
// // import { AttachmentIndicator } from "./attachment-indicator";

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

// // // ── Helper: normalize a date value to YYYY-MM-DD for comparison ─────────────
// // const toISODateString = (val) => {
// //   if (!val) return null;
// //   const d = new Date(val);
// //   if (isNaN(d.getTime())) return null;
// //   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// // };

// // export default function JournalTable() {
// //   const [reviewVoucher, setReviewVoucher] = useState(null);
// //   const queryClient = useQueryClient();

// //   const [sorting, setSorting] = useState([]);
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [columnVisibility, setColumnVisibility] = useState({});
// //   const [globalFilter, setGlobalFilter] = useState("");
// //   const [downloading, setDownloading] = useState(null);
// //   const [glDateFrom, setGlDateFrom] = useState("");
// //   const [glDateTo, setGlDateTo] = useState("");

// //   const [reverseId, setReverseId] = useState(null);
// //   const [isReversing, setIsReversing] = useState(false);

// //   // ── Upload State ──
// //   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
// //   const [selectedVoucher, setSelectedVoucher] = useState(null);
// //   const [selectedFiles, setSelectedFiles] = useState([]);
// //   const [uploading, setUploading] = useState(false);
// //   const [existingDocs, setExistingDocs] = useState([]);

// //   const canCreate = useHasPermission("JOURNAL_VOUCHER_CREATE");
// //   const canEdit = useHasPermission("JOURNAL_VOUCHER_EDIT");
// //   const canDownload = useHasPermission("JOURNAL_VOUCHER_DOWNLOAD");

// //   // const formatDate = (value) => {
// //   //   if (!value) return "—";
// //   //   const date = new Date(value);
// //   //   if (isNaN(date.getTime())) return value;
// //   //   return date.toLocaleDateString("en-US", {
// //   //     month: "short",
// //   //     day: "2-digit",
// //   //     year: "numeric",
// //   //   });
// //   // };
// //   const formatDate = (value) => {
// //   if (!value) return "—";
// //   const date = new Date(value);
// //   if (isNaN(date.getTime())) return value;
// //   const yyyy = date.getFullYear();
// //   const mm = String(date.getMonth() + 1).padStart(2, "0");
// //   const dd = String(date.getDate()).padStart(2, "0");
// //   return `${yyyy}-${mm}-${dd}`;
// // };


// //   const { data, isLoading, error } = useQuery({
// //     queryKey: ["unpostedJournalVouchers"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${BASE_URL}/api/gl-all-unposted`);
// //       return res.data;
// //     },
// //   });

// //   // ── Review modal — fetch full master+details for the selected voucher ──────
// //   const { data: reviewData, isLoading: reviewLoading } = useQuery({
// //     queryKey: ["voucherReview", "journal", reviewVoucher?.ID],
// //     queryFn: async () => {
// //       const res = await axios.get(`${BASE_URL}/api/gl-view?insertID=${reviewVoucher.ID}`);
// //       return res.data;
// //     },
// //     enabled: !!reviewVoucher,
// //   });

// //   // ── Fetch existing docs for the selected voucher ──
// //   const { refetch: refetchDocs } = useQuery({
// //     queryKey: ["gldocs", selectedVoucher?.ID],
// //     queryFn: async () => {
// //       if (!selectedVoucher) return [];
// //       const res = await axios.get(`${BASE_URL}/api/gldoc`, {
// //         params: { glmaster_id: selectedVoucher.ID },
// //       });
// //       const docs = res.data.data || [];
// //       setExistingDocs(docs);
// //       return docs;
// //     },
// //     enabled: !!selectedVoucher,
// //   });

// //   // ── Upload Invoice Mutation ──
// //   const uploadMutation = useMutation({
// //     mutationFn: async ({ voucherId, files }) => {
// //       const uploads = files.map((file) => {
// //         const fd = new FormData();
// //         fd.append("doc_file", file);
// //         fd.append("GLMASTERID", voucherId);
// //         return axios.post(`${BASE_URL}/api/gldoc`, fd);
// //       });
// //       return await Promise.all(uploads);
// //     },
// //     onSuccess: async () => {
// //       toast.success("Invoice uploaded successfully!");
// //       setSelectedFiles([]);
// //       await refetchDocs();
// //       queryClient.invalidateQueries(["unpostedJournalVouchers"]);
// //     },
// //     onError: (error) => {
// //       toast.error("Failed to upload invoice: " + (error.response?.data?.message || error.message));
// //     },
// //     onSettled: () => {
// //       setUploading(false);
// //     },
// //   });

// //   // ── Delete Document Mutation ──
// //   const deleteDocMutation = useMutation({
// //     mutationFn: async (docId) => {
// //       await axios.delete(`${BASE_URL}/api/gldoc/${docId}`);
// //     },
// //     onSuccess: async () => {
// //       toast.success("Document deleted successfully!");
// //       await refetchDocs();
// //       queryClient.invalidateQueries(["unpostedJournalVouchers"]);
// //     },
// //     onError: (error) => {
// //       toast.error("Failed to delete document: " + (error.response?.data?.message || error.message));
// //     },
// //   });

// //   // ── Upload Handlers ──
// //   const handleUploadClick = (voucher) => {
// //     setSelectedVoucher(voucher);
// //     setExistingDocs([]);
// //     setUploadDialogOpen(true);
// //     setSelectedFiles([]);
// //   };

// //   const handleFileSelect = (e) => {
// //     const files = Array.from(e.target.files);
// //     setSelectedFiles((prev) => [...prev, ...files]);
// //   };

// //   const handleRemoveFile = (index) => {
// //     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
// //   };

// //   const handleUploadSubmit = () => {
// //     if (selectedFiles.length === 0) {
// //       toast.error("Please select at least one file.");
// //       return;
// //     }
// //     setUploading(true);
// //     uploadMutation.mutate({
// //       voucherId: selectedVoucher.ID,
// //       files: selectedFiles,
// //     });
// //   };

// //   // ── View Document Handler ──
// //   // const handleViewDoc = (doc) => {
// //   //   const fileUrl = doc.FILE_PATH || doc.URL || doc.PATH;
// //   //   if (fileUrl) {
// //   //     window.open(fileUrl, "_blank");
// //   //   } else {
// //   //     toast.info("No file URL available for this document.");
// //   //   }
// //   // };

// //   const sortedVouchers = useMemo(() => {
// //     const vouchers = Array.isArray(data?.data) ? data.data : [];
// //     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
// //   }, [data]);

// //   // ── GL Date range filter ─────────────────────────────────────────────────
// //   const filteredVouchers = useMemo(() => {
// //     if (!glDateFrom && !glDateTo) return sortedVouchers;
// //     return sortedVouchers.filter((v) => {
// //       const formatted = toISODateString(v.GL_ENTRY_DATE);
// //       if (!formatted) return false;
// //       if (glDateFrom && formatted < glDateFrom) return false;
// //       if (glDateTo && formatted > glDateTo) return false;
// //       return true;
// //     });
// //   }, [sortedVouchers, glDateFrom, glDateTo]);

// //   // ── Total calculation for filtered data ─────────────────────────────────
// //   const totalDebit = useMemo(() => {
// //     return filteredVouchers.reduce((sum, v) => sum + parseFloat(v.DEBIT || 0), 0);
// //   }, [filteredVouchers]);

// //   const totalCredit = useMemo(() => {
// //     return filteredVouchers.reduce((sum, v) => sum + parseFloat(v.CREDIT || 0), 0);
// //   }, [filteredVouchers]);

// //   const totalCount = filteredVouchers.length;

// //   const handleDownload = async (voucher, type) => {
// //     const key = `${voucher.ID}-${type}`;
// //     setDownloading(key);

// //     try {
// //       const response = await fetch(
// //         `${BASE_URL}/api/journal/download/${voucher.ID}?type=${type}`
// //       );

// //       if (!response.ok) {
// //         let errMsg = `Server error ${response.status}`;
// //         try {
// //           const errBody = await response.json();
// //           errMsg = errBody.detail || errBody.message || errMsg;
// //         } catch { /* ignore */ }
// //         toast.error(`Download failed: ${errMsg}`);
// //         return;
// //       }

// //       const blob = await response.blob();
// //       const objectUrl = URL.createObjectURL(blob);
// //       const anchor = document.createElement("a");
// //       const ext = type === "pdf" ? "pdf" : "xlsx";

// //       anchor.href = objectUrl;
// //       anchor.download = `journal_voucher_${voucher.VOUCHERNO}.${ext}`;
// //       document.body.appendChild(anchor);
// //       anchor.click();
// //       anchor.remove();
// //       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
// //       toast.success(`${type.toUpperCase()} downloaded successfully!`);
// //     } catch (err) {
// //       console.error(`[handleDownload] journal ${type} error:`, err);
// //       toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
// //     } finally {
// //       setDownloading(null);
// //     }
// //   };

// //   const handleReverseVoucher = async () => {
// //     if (!reverseId) return;
// //     setIsReversing(true);
// //     try {
// //       const res = await axios.post(`${BASE_URL}/api/reverse-voucher`, { id: reverseId });
// //       if (res.data.status === "success") {
// //         toast.success(res.data.message || "Voucher reversed successfully!");
// //         queryClient.invalidateQueries(["unpostedJournalVouchers"]);
// //       } else {
// //         toast.error(res.data.message || "Failed to reverse voucher");
// //       }
// //     } catch (error) {
// //       toast.error(
// //         "Error reversing voucher: " + (error.response?.data?.message || error.message)
// //       );
// //     } finally {
// //       setIsReversing(false);
// //       setReverseId(null);
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
// //       accessorKey: "GL_ENTRY_DATE",
// //       header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
// //       cell: ({ row }) => <div className="ml-3 text-sm text-gray-600">{formatDate(row.getValue("GL_ENTRY_DATE"))}</div>,
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
// //       accessorKey: "DEBIT",
// //       header: ({ column }) => <SortableHeader column={column} label="Debit" />,
// //       cell: ({ row }) => {
// //         const amount = parseFloat(row.getValue("DEBIT") || 0);
// //         const formatted = new Intl.NumberFormat("en-US", {
// //           minimumFractionDigits: 2,
// //           maximumFractionDigits: 2,
// //         }).format(amount);
// //         return <div className="ml-3 text-sm font-semibold text-gray-800">{formatted}</div>;
// //       },
// //     },
// //     {
// //       accessorKey: "CREDIT",
// //       header: ({ column }) => <SortableHeader column={column} label="Credit" />,
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
// //       id: "type",
// //       header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</div>,
// //       cell: ({ row }) => (
// //         <div className="flex justify-center">
// //           <EntryTypeBadge type={row.original.TYPE} />
// //         </div>
// //       ),
// //     },
// //     {
// //       id: "attachment",
// //       header: () => <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice Count</div>,
// //       cell: ({ row }) => (
// //         <div className="flex justify-center">
// //           <AttachmentIndicator count={row.original.DOC_COUNT} />
// //         </div>
// //       ),
// //     },
// //     // ── Upload Invoice Column ──
// //     {
// //       id: "uploadInvoice",
// //       header: () => (
// //         <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
// //           Upload Invoice
// //         </div>
// //       ),
// //       cell: ({ row }) => {
// //         const voucher = row.original;
// //         const isApproved = voucher.POSTED === 1 || voucher.POSTED === "1";
        
// //         return (
// //           <div className="flex justify-center">
// //             <TooltipProvider>
// //               <Tooltip>
// //                 <TooltipTrigger asChild>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
// //                     onClick={() => handleUploadClick(voucher)}
// //                     disabled={isApproved}
// //                   >
// //                     <Upload size={16} />
// //                   </Button>
// //                 </TooltipTrigger>
// //                 <TooltipContent side="top">
// //                   {isApproved ? "Cannot upload (approved)" : "Upload Invoice"}
// //                 </TooltipContent>
// //               </Tooltip>
// //             </TooltipProvider>
// //           </div>
// //         );
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
// //             {canEdit && (
// //               isApproved ? (
// //                 <TooltipProvider>
// //                   <Tooltip>
// //                     <TooltipTrigger asChild>
// //                       <Button
// //                         variant="ghost"
// //                         size="icon"
// //                         className="text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
// //                         onClick={() => setReviewVoucher(voucher)}
// //                       >
// //                         <Eye size={16} />
// //                       </Button>
// //                     </TooltipTrigger>
// //                     <TooltipContent side="top">Review Voucher</TooltipContent>
// //                   </Tooltip>
// //                 </TooltipProvider>
// //               ) : (
// //                 <Link to={`/dashboard/journal-edit/${voucher.ID}`} title="Edit Voucher">
// //                   <Button variant="ghost" size="icon" className="hover:bg-violet-50 hover:text-violet-700">
// //                     <Pencil size={16} />
// //                   </Button>
// //                 </Link>
// //               )
// //             )}

// //             {canDownload && (
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
// //                     title="Download"
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

// //             {isApproved && String(voucher.TYPE).toUpperCase() !== "REVERSE" && !voucher.REF_REVERSE_ENTRY && (
// //               <TooltipProvider>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <Button
// //                       variant="ghost"
// //                       size="icon"
// //                       className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
// //                       onClick={() => setReverseId(voucher.ID)}
// //                     >
// //                       <RotateCcw size={16} />
// //                     </Button>
// //                   </TooltipTrigger>
// //                   <TooltipContent side="top">Reverse Entry</TooltipContent>
// //                 </Tooltip>
// //               </TooltipProvider>
// //             )}

// //             {isApproved && voucher.REF_REVERSE_ENTRY && (
// //               <TooltipProvider>
// //                 <Tooltip>
// //                   <TooltipTrigger asChild>
// //                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 bg-red-100 border border-red-200 cursor-default">
// //                       <RotateCcw size={16} />
// //                     </span>
// //                   </TooltipTrigger>
// //                   <TooltipContent side="top" className="bg-red-700 text-white text-xs">
// //                     Reversed (Voucher #{voucher.REF_REVERSE_ENTRY})
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
// //     data: filteredVouchers,
// //     columns,
// //     onSortingChange: setSorting,
// //     onColumnFiltersChange: setColumnFilters,
// //     getCoreRowModel: getCoreRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     onColumnVisibilityChange: setColumnVisibility,
// //     onGlobalFilterChange: setGlobalFilter,
// //     initialState: {
// //       pagination: {
// //         pageSize: 50,
// //       },
// //     },
// //     state: { 
// //       sorting, 
// //       columnFilters, 
// //       columnVisibility, 
// //       globalFilter 
// //     },
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

// //   const hasDateFilter = glDateFrom || glDateTo;

// //   return (
// //     <>
// //       <div className="p-4 md:p-6">
// //         <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
// //           {/* Header */}
// //           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
// //             <div className="flex items-center gap-2">
// //               <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
// //                 <BookOpenText size={16} />
// //               </div>
// //               <div>
// //                 <h2 className="text-sm font-bold text-gray-900">Journal Vouchers</h2>
// //                 <p className="text-xs text-gray-400">
// //                   {filteredVouchers.length} total — unposted journal vouchers
// //                 </p>
// //               </div>
// //             </div>

// //             {canCreate && (
// //               <Link to="/dashboard/journal-create">
// //                 <Button>
// //                   <PlusIcon size={16} className="mr-2" />
// //                   Add New Journal
// //                 </Button>
// //               </Link>
// //             )}
// //           </div>

// //           <div className="p-5 space-y-4">
// //             {/* Search + GL Date range filter + Column visibility */}
// //             <div className="flex flex-col sm:flex-row sm:items-end gap-3">
// //               <div className="relative max-w-sm w-full">
// //                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                 <Input
// //                   placeholder="Search vouchers..."
// //                   value={globalFilter ?? ""}
// //                   onChange={(e) => setGlobalFilter(e.target.value)}
// //                   className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// //                 />
// //               </div>

// //               <div className="flex items-center gap-2 w-full sm:w-auto">
// //                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                   GL From Date
// //                 </label>
// //                 <div className="relative w-full sm:w-40">
// //                   <Input
// //                     type="date"
// //                     value={glDateFrom}
// //                     max={glDateTo || undefined}
// //                     onChange={(e) => setGlDateFrom(e.target.value)}
// //                     className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// //                   />
// //                   {glDateFrom && (
// //                     <button
// //                       type="button"
// //                       onClick={() => setGlDateFrom("")}
// //                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
// //                       title="Clear from date"
// //                     >
// //                       ✕
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="flex items-center gap-2 w-full sm:w-auto">
// //                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
// //                   To Date
// //                 </label>
// //                 <div className="relative w-full sm:w-40">
// //                   <Input
// //                     type="date"
// //                     value={glDateTo}
// //                     min={glDateFrom || undefined}
// //                     onChange={(e) => setGlDateTo(e.target.value)}
// //                     className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
// //                   />
// //                   {glDateTo && (
// //                     <button
// //                       type="button"
// //                       onClick={() => setGlDateTo("")}
// //                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
// //                       title="Clear to date"
// //                     >
// //                       ✕
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>

// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
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
// //                     <>
// //                       {table.getRowModel().rows.map((row) => (
// //                         <TableRow
// //                           key={row.id}
// //                           data-state={row.getIsSelected() && "selected"}
// //                           className="hover:bg-gray-50/70 transition-colors"
// //                         >
// //                           {row.getVisibleCells().map((cell) => (
// //                             <TableCell key={cell.id} className="text-sm text-gray-700">
// //                               {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                             </TableCell>
// //                           ))}
// //                         </TableRow>
// //                       ))}
                      
// //                       {/* ── Total Row ── */}
// //                       {filteredVouchers.length > 0 && (
// //                         <TableRow className="bg-gray-100 font-semibold border-t-2 border-gray-300">
// //                           <TableCell colSpan={3} className="text-right text-sm font-bold text-gray-800">
// //                             Total ({totalCount} entries)
// //                           </TableCell>
// //                           <TableCell className="text-right text-sm font-bold text-gray-800">
// //                             {new Intl.NumberFormat("en-US", {
// //                               minimumFractionDigits: 2,
// //                               maximumFractionDigits: 2,
// //                             }).format(totalDebit)}
// //                           </TableCell>
// //                           <TableCell className="text-right text-sm font-bold text-gray-800">
// //                             {new Intl.NumberFormat("en-US", {
// //                               minimumFractionDigits: 2,
// //                               maximumFractionDigits: 2,
// //                             }).format(totalCredit)}
// //                           </TableCell>
// //                           <TableCell colSpan={3} />
// //                         </TableRow>
// //                       )}
// //                     </>
// //                   ) : (
// //                     <TableRow>
// //                       <TableCell colSpan={columns.length} className="h-24 text-center">
// //                         <p className="text-sm text-gray-400">
// //                           {hasDateFilter
// //                             ? "No vouchers found for the selected date range"
// //                             : "No unposted vouchers found"}
// //                         </p>
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

// //       {/* Reverse Confirmation Dialog */}
// //       <AlertDialog open={!!reverseId} onOpenChange={() => !isReversing && setReverseId(null)}>
// //         <AlertDialogContent>
// //           <AlertDialogHeader>
// //             <AlertDialogTitle className="flex items-center gap-2">
// //               <RotateCcw className="text-orange-600" size={20} />
// //               Reverse Voucher?
// //             </AlertDialogTitle>
// //             <AlertDialogDescription>
// //               A new reversal entry will be created with debit/credit swapped.{" "}
// //               <span className="text-red-500 font-medium">This action cannot be undone.</span>
// //             </AlertDialogDescription>
// //           </AlertDialogHeader>
// //           <AlertDialogFooter>
// //             <AlertDialogCancel disabled={isReversing}>Cancel</AlertDialogCancel>
// //             <AlertDialogAction
// //               onClick={handleReverseVoucher}
// //               disabled={isReversing}
// //               className="bg-orange-600 hover:bg-orange-700"
// //             >
// //               {isReversing ? "Reversing..." : "Yes, Reverse"}
// //             </AlertDialogAction>
// //           </AlertDialogFooter>
// //         </AlertDialogContent>
// //       </AlertDialog>

// //       {/* ── Upload Invoice Dialog ── */}
// //       <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
// //         if (!uploading) {
// //           setUploadDialogOpen(open);
// //           if (!open) {
// //             setSelectedVoucher(null);
// //             setSelectedFiles([]);
// //             setExistingDocs([]);
// //           }
// //         }
// //       }}>
// //         <DialogContent className="max-w-lg">
// //           <DialogHeader>
// //             <DialogTitle className="flex items-center gap-2">
// //               <Upload size={18} className="text-blue-600" />
// //               Upload Invoice
// //             </DialogTitle>
// //             <DialogDescription>
// //               Upload invoice for voucher #{selectedVoucher?.VOUCHERNO}
// //             </DialogDescription>
// //           </DialogHeader>

// //           <div className="space-y-4 py-2">
// //             {/* File Input */}
// //             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
// //               <Input
// //                 type="file"
// //                 multiple
// //                 onChange={handleFileSelect}
// //                 disabled={uploading}
// //                 className="cursor-pointer"
// //                 accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
// //               />
// //               <p className="text-xs text-gray-400 mt-2">
// //                 Supported: PDF, JPG, PNG, DOC (Max 5MB each)
// //               </p>
// //             </div>

// //             {/* Selected Files List */}
// //             {selectedFiles.length > 0 && (
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Selected Files ({selectedFiles.length})
// //                 </label>
// //                 <div className="max-h-40 overflow-y-auto space-y-1">
// //                   {selectedFiles.map((file, index) => (
// //                     <div
// //                       key={index}
// //                       className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
// //                     >
// //                       <div className="flex items-center gap-2">
// //                         <FileText size={14} className="text-gray-400" />
// //                         <span className="text-gray-700 truncate max-w-[200px]">
// //                           {file.name}
// //                         </span>
// //                         <span className="text-xs text-gray-400">
// //                           ({(file.size / 1024).toFixed(1)} KB)
// //                         </span>
// //                       </div>
// //                       <Button
// //                         type="button"
// //                         variant="ghost"
// //                         size="sm"
// //                         className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
// //                         onClick={() => handleRemoveFile(index)}
// //                         disabled={uploading}
// //                       >
// //                         <X size={14} />
// //                       </Button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Existing Documents */}
// //             {existingDocs && existingDocs.length > 0 && (
// //               <div className="space-y-2">
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Existing Documents ({existingDocs.length})
// //                 </label>
// //                 <div className="max-h-32 overflow-y-auto space-y-1">
// //                   {existingDocs.map((doc) => (
// //                     <div
// //                       key={doc.ID}
// //                       className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 text-sm"
// //                     >
// //                       <div className="flex items-center gap-2">
// //                         {/* <Button
// //                           variant="ghost"
// //                           size="sm"
// //                           className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700"
// //                           onClick={() => handleViewDoc(doc)}
// //                         >
// //                           <Eye size={14} />
// //                         </Button> */}
// //                         <span className="text-gray-700 truncate max-w-[150px]">
// //                           {doc.FILENAME || `Document #${doc.ID}`}
// //                         </span>
// //                       </div>
// //                       <Button
// //                         type="button"
// //                         variant="ghost"
// //                         size="sm"
// //                         className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
// //                         onClick={() => deleteDocMutation.mutate(doc.ID)}
// //                         disabled={uploading || deleteDocMutation.isPending}
// //                       >
// //                         <X size={14} />
// //                       </Button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           <DialogFooter>
// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={() => {
// //                 setUploadDialogOpen(false);
// //                 setSelectedVoucher(null);
// //                 setSelectedFiles([]);
// //                 setExistingDocs([]);
// //               }}
// //               disabled={uploading}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="button"
// //               onClick={handleUploadSubmit}
// //               disabled={selectedFiles.length === 0 || uploading}
// //             >
// //               {uploading ? (
// //                 <>
// //                   <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
// //                   Uploading...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Upload size={16} className="mr-2" />
// //                   Upload {selectedFiles.length} file(s)
// //                 </>
// //               )}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       {/* ── Review Voucher Modal (approved, read-only) ──────────────────────── */}
// //       {reviewVoucher && (
// //         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
// //               <div className="flex items-center gap-2">
// //                 <Eye size={18} className="text-indigo-600" />
// //                 <h2 className="text-base font-bold text-gray-900">
// //                   Journal Voucher #{reviewVoucher.VOUCHERNO}
// //                 </h2>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <EntryTypeBadge type={reviewVoucher.TYPE} />
// //                 <button
// //                   onClick={() => setReviewVoucher(null)}
// //                   className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// //                 >
// //                   <X size={18} className="text-gray-500" />
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
// //               <div>
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   Transaction Date
// //                 </label>
// //                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
// //                   {formatDate(reviewVoucher.TRANS_DATE)}
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   GL Date
// //                 </label>
// //                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
// //                   {formatDate(reviewVoucher.GL_ENTRY_DATE)}
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   Voucher No
// //                 </label>
// //                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
// //                   {reviewVoucher.VOUCHERNO}
// //                 </div>
// //               </div>
// //               <div className="md:col-span-3">
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   Description
// //                 </label>
// //                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 min-h-[42px]">
// //                   {reviewVoucher.DESCRIPTION || "—"}
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   Total Debit
// //                 </label>
// //                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800">
// //                   {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
// //                     parseFloat(reviewVoucher.DEBIT || 0)
// //                   )}
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   Status
// //                 </label>
// //                 <div className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
// //                   Approved
// //                 </div>
// //               </div>
// //               <div>
// //                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
// //                   Attachments
// //                 </label>
// //                 <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
// //                   <AttachmentIndicator count={reviewVoucher.DOC_COUNT} />
// //                   <span className="text-xs text-slate-500">
// //                     {Number(reviewVoucher.DOC_COUNT) || 0} file(s)
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* ── Account Distribution breakdown ── */}
// //             <div className="px-6 pb-6">
// //               <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
// //                 Account Distribution
// //               </h3>
// //               <div className="overflow-hidden rounded-lg border border-slate-200">
// //                 <table className="w-full text-sm">
// //                   <thead>
// //                     <tr className="bg-slate-50">
// //                       <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
// //                         Code
// //                       </th>
// //                       <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
// //                         Particulars
// //                       </th>
// //                       <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
// //                         Debit
// //                       </th>
// //                       <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
// //                         Credit
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {reviewLoading && (
// //                       <tr>
// //                         <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
// //                           Loading account details…
// //                         </td>
// //                       </tr>
// //                     )}
// //                     {!reviewLoading && (reviewData?.details || []).length === 0 && (
// //                       <tr>
// //                         <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
// //                           No account rows found.
// //                         </td>
// //                       </tr>
// //                     )}
// //                     {!reviewLoading &&
// //                       (reviewData?.details || []).map((d, i) => (
// //                         <tr key={d.ID ?? i} className="border-t border-slate-100">
// //                           <td className="px-4 py-2 text-slate-700 font-medium">{d.CODE}</td>
// //                           <td className="px-4 py-2 text-slate-600">
// //                             {d.ACCOUNT_NAME || d.CODEDESCRIPTION || d.DESCRIPTION || "—"}
// //                           </td>
// //                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
// //                             {Number(d.DEBIT) > 0
// //                               ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(d.DEBIT)
// //                               : "—"}
// //                           </td>
// //                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
// //                             {Number(d.CREDIT) > 0
// //                               ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(d.CREDIT)
// //                               : "—"}
// //                           </td>
// //                         </tr>
// //                       ))}
// //                   </tbody>
// //                   {!reviewLoading && (reviewData?.details || []).length > 0 && (
// //                     <tfoot>
// //                       <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
// //                         <td colSpan={2} className="px-4 py-2 text-right text-slate-800">
// //                           Total
// //                         </td>
// //                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">
// //                           {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
// //                             (reviewData.details || []).reduce((s, d) => s + Number(d.DEBIT || 0), 0)
// //                           )}
// //                         </td>
// //                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">
// //                           {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
// //                             (reviewData.details || []).reduce((s, d) => s + Number(d.CREDIT || 0), 0)
// //                           )}
// //                         </td>
// //                       </tr>
// //                     </tfoot>
// //                   )}
// //                 </table>
// //               </div>
// //             </div>

// //             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setReviewVoucher(null)}
// //                 className="border-slate-200 text-slate-700"
// //               >
// //                 Close
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// import { useState, useMemo, useRef, useEffect } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUp,
//   ArrowDown,
//   ChevronDown,
//   Pencil,
//   Eye,
//   X,
//   Download,
//   FileText,
//   FileSpreadsheet,
//   BadgeCheck,
//   Search,
//   BookOpenText,
//   PlusIcon,
//   RotateCcw,
//   Upload,
// } from "lucide-react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import { create } from "zustand";

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
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useHasPermission } from "@/hooks/use-permission";
// import { EntryTypeBadge } from "./entry-type-badge";
// import { AttachmentIndicator } from "./attachment-indicator";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Below this container width the table restructures into rows
// // (pinned columns + 3 scrolling columns × ~115px ≈ 800px).
// const ROW_LAYOUT_BREAKPOINT = 800;

// // ── Active row (one id at a time; clicking the same row clears it) ──────────
// const useActiveRowStore = create((set) => ({
//   activeId: null,
//   toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
// }));

// // ── Helpers ─────────────────────────────────────────────────────────────────
// const amountFormatter = new Intl.NumberFormat("en-US", {
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });

// // Missing value → dash. Real zero → 0.00. Same decimals everywhere.
// const formatAmount = (value) => {
//   if (value === null || value === undefined || value === "") return "—";
//   const n = parseFloat(value);
//   if (isNaN(n)) return "—";
//   return amountFormatter.format(n);
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

// // normalize a date value to YYYY-MM-DD for comparison
// const toISODateString = (val) => {
//   if (!val) return null;
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return null;
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// const isPosted = (v) => v.POSTED === 1 || v.POSTED === "1";

// // Container-width based switch (not a viewport media query)
// function useIsNarrow(ref, threshold) {
//   const [narrow, setNarrow] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const ro = new ResizeObserver(([entry]) => {
//       setNarrow(entry.contentRect.width < threshold);
//     });
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, [ref, threshold]);
//   return narrow;
// }

// const ALIGN_CLASS = {
//   left: "text-left",
//   right: "text-right",
//   center: "text-center",
// };
// const JUSTIFY_CLASS = {
//   left: "justify-start",
//   right: "justify-end",
//   center: "justify-center",
// };
// const PIN_CLASS = {
//   left: "sticky left-0 border-r border-border",
//   right: "sticky right-0 border-l border-border",
// };

// const HEAD_TEXT =
//   "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

// // Sort arrow only appears on the active (sorted) column.
// const SortableHeader = ({ column, label, align = "left" }) => {
//   const sorted = column.getIsSorted();
//   return (
//     <Button
//       variant="ghost"
//       className={`${HEAD_TEXT} p-0 h-auto w-full gap-1 hover:bg-transparent ${JUSTIFY_CLASS[align]}`}
//       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//     >
//       {label}
//       {sorted === "asc" && <ArrowUp className="h-3 w-3" aria-hidden="true" />}
//       {sorted === "desc" && <ArrowDown className="h-3 w-3" aria-hidden="true" />}
//     </Button>
//   );
// };

// const PlainHeader = ({ label }) => <span className={HEAD_TEXT}>{label}</span>;

// export default function JournalTable() {
//   const [reviewVoucher, setReviewVoucher] = useState(null);
//   const queryClient = useQueryClient();

//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [downloading, setDownloading] = useState(null);
//   const [glDateFrom, setGlDateFrom] = useState("");
//   const [glDateTo, setGlDateTo] = useState("");

//   const [reverseId, setReverseId] = useState(null);
//   const [isReversing, setIsReversing] = useState(false);

//   // ── Upload State ──
//   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
//   const [selectedVoucher, setSelectedVoucher] = useState(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [existingDocs, setExistingDocs] = useState([]);

//   // ── Layout / row state ──
//   const containerRef = useRef(null);
//   const isNarrow = useIsNarrow(containerRef, ROW_LAYOUT_BREAKPOINT);
//   const [expandedId, setExpandedId] = useState(null); // phone: one open at a time
//   const activeId = useActiveRowStore((s) => s.activeId);
//   const toggleActive = useActiveRowStore((s) => s.toggle);

//   const canCreate = useHasPermission("JOURNAL_VOUCHER_CREATE");
//   const canEdit = useHasPermission("JOURNAL_VOUCHER_EDIT");
//   const canDownload = useHasPermission("JOURNAL_VOUCHER_DOWNLOAD");

//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ["unpostedJournalVouchers"],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/gl-all-unposted`);
//       return res.data;
//     },
//   });

//   // ── Review modal — fetch full master+details for the selected voucher ──────
//   const { data: reviewData, isLoading: reviewLoading } = useQuery({
//     queryKey: ["voucherReview", "journal", reviewVoucher?.ID],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE_URL}/api/gl-view?insertID=${reviewVoucher.ID}`);
//       return res.data;
//     },
//     enabled: !!reviewVoucher,
//   });

//   // ── Fetch existing docs for the selected voucher ──
//   const { refetch: refetchDocs } = useQuery({
//     queryKey: ["gldocs", selectedVoucher?.ID],
//     queryFn: async () => {
//       if (!selectedVoucher) return [];
//       const res = await axios.get(`${BASE_URL}/api/gldoc`, {
//         params: { glmaster_id: selectedVoucher.ID },
//       });
//       const docs = res.data.data || [];
//       setExistingDocs(docs);
//       return docs;
//     },
//     enabled: !!selectedVoucher,
//   });

//   // ── Upload Invoice Mutation ──
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
//       queryClient.invalidateQueries(["unpostedJournalVouchers"]);
//     },
//     onError: (error) => {
//       toast.error("Failed to upload invoice: " + (error.response?.data?.message || error.message));
//     },
//     onSettled: () => {
//       setUploading(false);
//     },
//   });

//   // ── Delete Document Mutation ──
//   const deleteDocMutation = useMutation({
//     mutationFn: async (docId) => {
//       await axios.delete(`${BASE_URL}/api/gldoc/${docId}`);
//     },
//     onSuccess: async () => {
//       toast.success("Document deleted successfully!");
//       await refetchDocs();
//       queryClient.invalidateQueries(["unpostedJournalVouchers"]);
//     },
//     onError: (error) => {
//       toast.error("Failed to delete document: " + (error.response?.data?.message || error.message));
//     },
//   });

//   // ── Upload Handlers ──
//   const handleUploadClick = (voucher) => {
//     setSelectedVoucher(voucher);
//     setExistingDocs([]);
//     setUploadDialogOpen(true);
//     setSelectedFiles([]);
//   };

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles((prev) => [...prev, ...files]);
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
//     uploadMutation.mutate({
//       voucherId: selectedVoucher.ID,
//       files: selectedFiles,
//     });
//   };

//   const sortedVouchers = useMemo(() => {
//     const vouchers = Array.isArray(data?.data) ? data.data : [];
//     return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
//   }, [data]);

//   // ── GL Date range filter ─────────────────────────────────────────────────
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

//   // ── Total calculation for filtered data ─────────────────────────────────
//   const totalDebit = useMemo(() => {
//     return filteredVouchers.reduce((sum, v) => sum + parseFloat(v.DEBIT || 0), 0);
//   }, [filteredVouchers]);

//   const totalCredit = useMemo(() => {
//     return filteredVouchers.reduce((sum, v) => sum + parseFloat(v.CREDIT || 0), 0);
//   }, [filteredVouchers]);

//   const totalCount = filteredVouchers.length;

//   const handleDownload = async (voucher, type) => {
//     const key = `${voucher.ID}-${type}`;
//     setDownloading(key);

//     try {
//       const response = await fetch(
//         `${BASE_URL}/api/journal/download/${voucher.ID}?type=${type}`
//       );

//       if (!response.ok) {
//         let errMsg = `Server error ${response.status}`;
//         try {
//           const errBody = await response.json();
//           errMsg = errBody.detail || errBody.message || errMsg;
//         } catch { /* ignore */ }
//         toast.error(`Download failed: ${errMsg}`);
//         return;
//       }

//       const blob = await response.blob();
//       const objectUrl = URL.createObjectURL(blob);
//       const anchor = document.createElement("a");
//       const ext = type === "pdf" ? "pdf" : "xlsx";

//       anchor.href = objectUrl;
//       anchor.download = `journal_voucher_${voucher.VOUCHERNO}.${ext}`;
//       document.body.appendChild(anchor);
//       anchor.click();
//       anchor.remove();
//       setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
//       toast.success(`${type.toUpperCase()} downloaded successfully!`);
//     } catch (err) {
//       console.error(`[handleDownload] journal ${type} error:`, err);
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
//         queryClient.invalidateQueries(["unpostedJournalVouchers"]);
//       } else {
//         toast.error(res.data.message || "Failed to reverse voucher");
//       }
//     } catch (error) {
//       toast.error(
//         "Error reversing voucher: " + (error.response?.data?.message || error.message)
//       );
//     } finally {
//       setIsReversing(false);
//       setReverseId(null);
//     }
//   };

//   // ── Desktop action cell (icon buttons, always visible) ────────────────────
//   const renderDesktopActions = (voucher) => {
//     const isApproved = isPosted(voucher);

//     return (
//       <div className="flex items-center justify-center gap-1">
//         {canEdit &&
//           (isApproved ? (
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
//                   aria-label="Review Voucher"
//                   onClick={() => setReviewVoucher(voucher)}
//                 >
//                   <Eye size={16} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">Review Voucher</TooltipContent>
//             </Tooltip>
//           ) : (
//             <Button
//               asChild
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
//             >
//               <Link to={`/dashboard/journal-edit/${voucher.ID}`} title="Edit Voucher" aria-label="Edit Voucher">
//                 <Pencil size={16} />
//               </Link>
//             </Button>
//           ))}

//         {canDownload && (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
//                 title="Download"
//                 aria-label="Download"
//                 disabled={downloading?.startsWith(`${voucher.ID}-`)}
//               >
//                 <Download size={16} />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-40">
//               <DropdownMenuLabel className="text-xs text-muted-foreground">
//                 Download as
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer gap-2"
//                 disabled={downloading === `${voucher.ID}-pdf`}
//                 onClick={() => handleDownload(voucher, "pdf")}
//               >
//                 <FileText size={14} className="text-red-500" />
//                 {downloading === `${voucher.ID}-pdf` ? "Generating…" : "PDF"}
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 className="cursor-pointer gap-2"
//                 disabled={downloading === `${voucher.ID}-excel`}
//                 onClick={() => handleDownload(voucher, "excel")}
//               >
//                 <FileSpreadsheet size={14} className="text-green-600" />
//                 {downloading === `${voucher.ID}-excel` ? "Generating…" : "Excel"}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         )}

//         {isApproved && (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <span
//                 role="img"
//                 aria-label="Approved"
//                 className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default"
//               >
//                 <BadgeCheck size={16} />
//               </span>
//             </TooltipTrigger>
//             <TooltipContent side="top" className="bg-green-700 text-white text-xs">
//               Approved
//             </TooltipContent>
//           </Tooltip>
//         )}

//         {isApproved && String(voucher.TYPE).toUpperCase() !== "REVERSE" && !voucher.REF_REVERSE_ENTRY && (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
//                 aria-label="Reverse Entry"
//                 onClick={() => setReverseId(voucher.ID)}
//               >
//                 <RotateCcw size={16} />
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent side="top">Reverse Entry</TooltipContent>
//           </Tooltip>
//         )}

//         {isApproved && voucher.REF_REVERSE_ENTRY && (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <span
//                 role="img"
//                 aria-label={`Reversed (Voucher #${voucher.REF_REVERSE_ENTRY})`}
//                 className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 bg-red-100 border border-red-200 cursor-default"
//               >
//                 <RotateCcw size={16} />
//               </span>
//             </TooltipTrigger>
//             <TooltipContent side="top" className="bg-red-700 text-white text-xs">
//               Reversed (Voucher #{voucher.REF_REVERSE_ENTRY})
//             </TooltipContent>
//           </Tooltip>
//         )}
//       </div>
//     );
//   };

//   // ── Columns ──────────────────────────────────────────────────────────────
//   // meta: { align, width, minWidth, pin }
//   const columns = [
//     {
//       accessorKey: "VOUCHERNO",
//       meta: { align: "left", width: 150, pin: "left" },
//       header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
//       cell: ({ row }) => (
//         <span className="block truncate text-sm font-medium text-foreground">
//           {row.getValue("VOUCHERNO") ?? "—"}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "GL_ENTRY_DATE",
//       meta: { align: "left", width: 120 },
//       header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
//       cell: ({ row }) => (
//         <span className="text-sm text-muted-foreground">
//           {formatDate(row.getValue("GL_ENTRY_DATE"))}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "DESCRIPTION",
//       meta: { align: "left", minWidth: 240 }, // flexible column absorbs the slack
//       header: () => <PlainHeader label="Description" />,
//       cell: ({ row }) => {
//         const text = row.getValue("DESCRIPTION");
//         if (!text) return <span className="text-sm text-muted-foreground">—</span>;
//         return (
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <span className="block truncate text-sm text-muted-foreground">{text}</span>
//             </TooltipTrigger>
//             <TooltipContent side="top" className="max-w-sm whitespace-normal break-words">
//               {text}
//             </TooltipContent>
//           </Tooltip>
//         );
//       },
//     },
//     {
//       accessorKey: "DEBIT",
//       meta: { align: "right", width: 140 },
//       header: ({ column }) => <SortableHeader column={column} label="Debit" align="right" />,
//       cell: ({ row }) => (
//         <span className="text-sm font-semibold tabular-nums text-foreground">
//           {formatAmount(row.getValue("DEBIT"))}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "CREDIT",
//       meta: { align: "right", width: 140 },
//       header: ({ column }) => <SortableHeader column={column} label="Credit" align="right" />,
//       cell: ({ row }) => (
//         <span className="text-sm font-semibold tabular-nums text-foreground">
//           {formatAmount(row.getValue("CREDIT"))}
//         </span>
//       ),
//     },
//     {
//       id: "type",
//       meta: { align: "center", width: 110 },
//       header: () => <PlainHeader label="Type" />,
//       cell: ({ row }) => (
//         <div className="flex justify-center">
//           <EntryTypeBadge type={row.original.TYPE} />
//         </div>
//       ),
//     },
//     {
//       id: "attachment",
//       meta: { align: "center", width: 120 },
//       header: () => <PlainHeader label="Invoice Count" />,
//       cell: ({ row }) => (
//         <div className="flex justify-center">
//           <AttachmentIndicator count={row.original.DOC_COUNT} />
//         </div>
//       ),
//     },
//     {
//       id: "uploadInvoice",
//       meta: { align: "center", width: 130 },
//       header: () => <PlainHeader label="Upload Invoice" />,
//       cell: ({ row }) => {
//         const voucher = row.original;
//         const isApproved = isPosted(voucher);
//         return (
//           <div className="flex justify-center">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
//                   aria-label="Upload Invoice"
//                   onClick={() => handleUploadClick(voucher)}
//                   disabled={isApproved}
//                 >
//                   <Upload size={16} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">
//                 {isApproved ? "Cannot upload (approved)" : "Upload Invoice"}
//               </TooltipContent>
//             </Tooltip>
//           </div>
//         );
//       },
//     },
//     {
//       id: "actions",
//       enableHiding: false,
//       meta: { align: "center", width: 190, pin: "right" },
//       header: () => <PlainHeader label="Actions" />,
//       cell: ({ row }) => renderDesktopActions(row.original),
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
//     initialState: {
//       pagination: {
//         pageSize: 50,
//       },
//     },
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       globalFilter,
//     },
//   });

//   const hasDateFilter = glDateFrom || glDateTo;
//   const rows = table.getRowModel().rows;
//   const visibleColumnCount = table.getVisibleLeafColumns().length;

//   // Phone sort control (sorting moves above the list)
//   const phoneSortField = sorting[0]?.id ?? "";
//   const phoneSortDesc = sorting[0]?.desc ?? false;

//   // ── Shared state blocks ──────────────────────────────────────────────────
//   const emptyState = (
//     <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
//       <p className="text-sm text-muted-foreground">
//         {hasDateFilter
//           ? "No vouchers found for the selected date range"
//           : "No unposted vouchers found"}
//       </p>
//       {hasDateFilter ? (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             setGlDateFrom("");
//             setGlDateTo("");
//           }}
//         >
//           Clear date filter
//         </Button>
//       ) : (
//         canCreate && (
//           <Button asChild size="sm">
//             <Link to="/dashboard/journal-create">
//               <PlusIcon size={16} className="mr-2" />
//               Add first journal
//             </Link>
//           </Button>
//         )
//       )}
//     </div>
//   );

//   const errorState = (
//     <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
//       <p className="text-sm text-red-600">Error loading vouchers.</p>
//       <Button variant="outline" size="sm" onClick={() => refetch()}>
//         Retry
//       </Button>
//     </div>
//   );

//   // ── Desktop table ────────────────────────────────────────────────────────
//   const renderDesktopTable = () => (
//     <div className="max-h-[calc(100dvh-12rem)] overflow-auto rounded-md border border-border">
//       <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-sm">
//         <thead>
//           {table.getHeaderGroups().map((hg) => (
//             <tr key={hg.id} className="h-12">
//               {hg.headers.map((h) => {
//                 const meta = h.column.columnDef.meta || {};
//                 const sorted = h.column.getIsSorted();
//                 return (
//                   <th
//                     key={h.id}
//                     scope="col"
//                     aria-sort={
//                       sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
//                     }
//                     style={{ width: meta.width, minWidth: meta.minWidth ?? meta.width }}
//                     className={[
//                       "sticky top-0 bg-muted px-3 border-b border-border whitespace-nowrap",
//                       ALIGN_CLASS[meta.align || "left"],
//                       meta.pin ? `${PIN_CLASS[meta.pin]} z-30` : "z-20",
//                     ].join(" ")}
//                   >
//                     {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                   </th>
//                 );
//               })}
//             </tr>
//           ))}
//         </thead>

//         <tbody>
//           {isLoading &&
//             Array.from({ length: 8 }).map((_, i) => (
//               <tr key={`sk-${i}`} className="h-12">
//                 {table.getVisibleLeafColumns().map((col) => {
//                   const meta = col.columnDef.meta || {};
//                   return (
//                     <td
//                       key={col.id}
//                       className={[
//                         "h-12 px-3 py-0 border-b border-border bg-background",
//                         meta.pin ? `${PIN_CLASS[meta.pin]} z-10` : "",
//                       ].join(" ")}
//                     >
//                       <Skeleton
//                         className={`h-4 ${meta.align === "right" ? "ml-auto" : meta.align === "center" ? "mx-auto" : ""} ${meta.align === "left" || !meta.align ? "w-3/4" : "w-16"}`}
//                       />
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}

//           {!isLoading && !error &&
//             rows.map((row) => {
//               const id = row.original.ID;
//               const isActive = activeId === id;
//               return (
//                 <tr
//                   key={row.id}
//                   tabIndex={0}
//                   aria-current={isActive ? "true" : undefined}
//                   data-state={row.getIsSelected() ? "selected" : undefined}
//                   onClick={() => toggleActive(id)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && e.target === e.currentTarget) {
//                       e.preventDefault();
//                       toggleActive(id);
//                     }
//                   }}
//                   className="group h-12 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
//                 >
//                   {row.getVisibleCells().map((cell) => {
//                     const meta = cell.column.columnDef.meta || {};
//                     const bg = isActive
//                       ? "bg-violet-100"
//                       : "bg-white group-hover:bg-violet-50";
//                     return (
//                       <td
//                         key={cell.id}
//                         style={{ width: meta.width, minWidth: meta.minWidth ?? meta.width }}
//                         className={[
//                           "h-12 px-3 py-0 whitespace-nowrap border-b border-border",
//                           ALIGN_CLASS[meta.align || "left"],
//                           bg,
//                           meta.pin ? `${PIN_CLASS[meta.pin]} z-10` : "",
//                           meta.width ? "" : "max-w-0", // lets the flexible column truncate
//                         ].join(" ")}
//                       >
//                         {/* Buttons/links inside cells must never toggle the row highlight */}
//                         {meta.align === "center" ? (
//                           <div onClick={(e) => e.stopPropagation()}>
//                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                           </div>
//                         ) : (
//                           flexRender(cell.column.columnDef.cell, cell.getContext())
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//         </tbody>

//         {/* ── Total row ── */}
//         {!isLoading && !error && filteredVouchers.length > 0 && (
//           <tfoot>
//             <tr className="h-12">
//               {table.getVisibleLeafColumns().map((col) => {
//                 const meta = col.columnDef.meta || {};
//                 const base =
//                   "sticky bottom-0 h-12 px-3 py-0 bg-muted border-t border-border whitespace-nowrap text-sm font-bold text-foreground";
//                 const pin = meta.pin ? `${PIN_CLASS[meta.pin]} z-20` : "z-10";
//                 if (col.id === "VOUCHERNO") {
//                   return (
//                     <td key={col.id} className={`${base} ${pin} text-left`}>
//                       Total ({totalCount})
//                     </td>
//                   );
//                 }
//                 if (col.id === "DEBIT") {
//                   return (
//                     <td key={col.id} className={`${base} ${pin} text-right tabular-nums`}>
//                       {formatAmount(totalDebit)}
//                     </td>
//                   );
//                 }
//                 if (col.id === "CREDIT") {
//                   return (
//                     <td key={col.id} className={`${base} ${pin} text-right tabular-nums`}>
//                       {formatAmount(totalCredit)}
//                     </td>
//                   );
//                 }
//                 return <td key={col.id} className={`${base} ${pin}`} />;
//               })}
//             </tr>
//           </tfoot>
//         )}
//       </table>

//       {!isLoading && error && errorState}
//       {!isLoading && !error && rows.length === 0 && emptyState}
//     </div>
//   );

//   // ── Phone / narrow layout: rows, no header, tap to expand ────────────────
//   const renderPhoneList = () => (
//     <div className="space-y-3">
//       {/* Sorting control above the list */}
//       <div className="flex items-center gap-2">
//         <label htmlFor="journal-sort" className={HEAD_TEXT}>
//           Sort
//         </label>
//         <select
//           id="journal-sort"
//           value={phoneSortField}
//           onChange={(e) =>
//             setSorting(e.target.value ? [{ id: e.target.value, desc: phoneSortDesc }] : [])
//           }
//           className="h-10 flex-1 rounded-md border border-border bg-background px-2 text-sm"
//         >
//           <option value="">Newest first</option>
//           <option value="VOUCHERNO">Voucher No</option>
//           <option value="GL_ENTRY_DATE">GL Date</option>
//           <option value="DEBIT">Debit</option>
//           <option value="CREDIT">Credit</option>
//         </select>
//         <Button
//           variant="outline"
//           className="h-10 w-10 p-0"
//           disabled={!phoneSortField}
//           aria-label={phoneSortDesc ? "Descending" : "Ascending"}
//           onClick={() => setSorting([{ id: phoneSortField, desc: !phoneSortDesc }])}
//         >
//           {phoneSortDesc ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
//         </Button>
//       </div>

//       <div className="rounded-md border border-border">
//         {isLoading && (
//           <ul>
//             {Array.from({ length: 5 }).map((_, i) => (
//               <li key={i} className="space-y-2 border-b border-border px-4 py-3 last:border-b-0">
//                 <div className="flex justify-between">
//                   <Skeleton className="h-4 w-28" />
//                   <Skeleton className="h-4 w-20" />
//                 </div>
//                 <Skeleton className="h-4 w-40" />
//               </li>
//             ))}
//           </ul>
//         )}

//         {!isLoading && error && errorState}
//         {!isLoading && !error && rows.length === 0 && emptyState}

//         {!isLoading && !error && rows.length > 0 && (
//           <ul>
//             {rows.map((row) => {
//               const v = row.original;
//               const open = expandedId === v.ID;
//               const isApproved = isPosted(v);
//               return (
//                 <li key={row.id} className="border-b border-border last:border-b-0">
//                   <button
//                     type="button"
//                     aria-expanded={open}
//                     onClick={() => setExpandedId(open ? null : v.ID)}
//                     className="flex min-h-[56px] w-full flex-col justify-center gap-1 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
//                   >
//                     {/* Line 1: identity left, key value (debit) right */}
//                     <span className="flex items-center justify-between gap-3">
//                       <span className="truncate text-sm font-medium text-foreground">
//                         {v.VOUCHERNO ?? "—"}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <span className="text-sm font-semibold tabular-nums text-foreground">
//                           {formatAmount(v.DEBIT)}
//                         </span>
//                         <ChevronDown
//                           size={16}
//                           aria-hidden="true"
//                           className={`text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
//                         />
//                       </span>
//                     </span>
//                     {/* Line 2: state + secondary info */}
//                     <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
//                       <EntryTypeBadge type={v.TYPE} />
//                       <AttachmentIndicator count={v.DOC_COUNT} />
//                       {isApproved && (
//                         <span className="inline-flex items-center gap-1 text-green-700">
//                           <BadgeCheck size={14} aria-hidden="true" />
//                           Approved
//                         </span>
//                       )}
//                       {v.REF_REVERSE_ENTRY && (
//                         <span className="inline-flex items-center gap-1 text-red-700">
//                           <RotateCcw size={14} aria-hidden="true" />
//                           Reversed (#{v.REF_REVERSE_ENTRY})
//                         </span>
//                       )}
//                       <span className="ml-auto">{formatDate(v.GL_ENTRY_DATE)}</span>
//                     </span>
//                   </button>

//                   {/* Expand in place: only fields not already on the row + actions */}
//                   <div
//                     inert={!open ? "" : undefined}
//                     className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
//                   >
//                     <div className="overflow-hidden">
//                       <div className="space-y-3 px-4 pb-4 pt-1">
//                         <dl className="space-y-1 text-sm">
//                           <div className="flex justify-between gap-3">
//                             <dt className="text-muted-foreground">Credit</dt>
//                             <dd className="font-semibold tabular-nums">{formatAmount(v.CREDIT)}</dd>
//                           </div>
//                           <div>
//                             <dt className="text-muted-foreground">Description</dt>
//                             <dd className="line-clamp-2 break-words">{v.DESCRIPTION || "—"}</dd>
//                           </div>
//                         </dl>

//                         <div className="flex flex-wrap gap-2">
//                           <Button
//                             variant="outline"
//                             className="h-10 gap-2"
//                             disabled={isApproved}
//                             onClick={() => handleUploadClick(v)}
//                           >
//                             <Upload size={16} /> Upload
//                           </Button>

//                           {canEdit &&
//                             (isApproved ? (
//                               <Button
//                                 variant="outline"
//                                 className="h-10 gap-2"
//                                 onClick={() => setReviewVoucher(v)}
//                               >
//                                 <Eye size={16} /> View
//                               </Button>
//                             ) : (
//                               <Button asChild variant="outline" className="h-10 gap-2">
//                                 <Link to={`/dashboard/journal-edit/${v.ID}`}>
//                                   <Pencil size={16} /> Edit
//                                 </Link>
//                               </Button>
//                             ))}

//                           {canDownload && (
//                             <>
//                               <Button
//                                 variant="outline"
//                                 className="h-10 gap-2"
//                                 disabled={downloading === `${v.ID}-pdf`}
//                                 onClick={() => handleDownload(v, "pdf")}
//                               >
//                                 <FileText size={16} className="text-red-500" />
//                                 {downloading === `${v.ID}-pdf` ? "Generating…" : "PDF"}
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 className="h-10 gap-2"
//                                 disabled={downloading === `${v.ID}-excel`}
//                                 onClick={() => handleDownload(v, "excel")}
//                               >
//                                 <FileSpreadsheet size={16} className="text-green-600" />
//                                 {downloading === `${v.ID}-excel` ? "Generating…" : "Excel"}
//                               </Button>
//                             </>
//                           )}

//                           {isApproved &&
//                             String(v.TYPE).toUpperCase() !== "REVERSE" &&
//                             !v.REF_REVERSE_ENTRY && (
//                               <Button
//                                 variant="outline"
//                                 className="h-10 gap-2 text-orange-600"
//                                 onClick={() => setReverseId(v.ID)}
//                               >
//                                 <RotateCcw size={16} /> Reverse
//                               </Button>
//                             )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>

//       {!isLoading && !error && filteredVouchers.length > 0 && (
//         <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-4 py-3 text-sm font-bold">
//           <span>Total ({totalCount})</span>
//           <span className="tabular-nums">
//             Dr {formatAmount(totalDebit)} · Cr {formatAmount(totalCredit)}
//           </span>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <TooltipProvider>
//       <div className="p-4 md:p-6">
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//           {/* Header */}
//           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//             <div className="flex items-center gap-2">
//               <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
//                 <BookOpenText size={16} />
//               </div>
//               <div>
//                 <h2 className="text-sm font-bold text-gray-900">Journal Vouchers</h2>
//                 <p className="text-xs text-gray-400">
//                   {filteredVouchers.length} total — unposted journal vouchers
//                 </p>
//               </div>
//             </div>

//             {canCreate && (
//               <Link to="/dashboard/journal-create">
//                 <Button>
//                   <PlusIcon size={16} className="mr-2" />
//                   Add New Journal
//                 </Button>
//               </Link>
//             )}
//           </div>

//           <div className="p-5 space-y-4">
//             {/* Search + GL Date range filter + Column visibility */}
//             <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//               <div className="relative max-w-sm w-full">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search vouchers..."
//                   value={globalFilter ?? ""}
//                   onChange={(e) => setGlobalFilter(e.target.value)}
//                   className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//                 />
//               </div>

//               <div className="flex items-center gap-2 w-full sm:w-auto">
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                   GL From Date
//                 </label>
//                 <div className="relative w-full sm:w-40">
//                   <Input
//                     type="date"
//                     value={glDateFrom}
//                     max={glDateTo || undefined}
//                     onChange={(e) => setGlDateFrom(e.target.value)}
//                     className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//                   />
//                   {glDateFrom && (
//                     <button
//                       type="button"
//                       onClick={() => setGlDateFrom("")}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                       title="Clear from date"
//                       aria-label="Clear from date"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 w-full sm:w-auto">
//                 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
//                   To Date
//                 </label>
//                 <div className="relative w-full sm:w-40">
//                   <Input
//                     type="date"
//                     value={glDateTo}
//                     min={glDateFrom || undefined}
//                     onChange={(e) => setGlDateTo(e.target.value)}
//                     className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//                   />
//                   {glDateTo && (
//                     <button
//                       type="button"
//                       onClick={() => setGlDateTo("")}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
//                       title="Clear to date"
//                       aria-label="Clear to date"
//                     >
//                       ✕
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="sm:ml-auto bg-white border-gray-200">
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

//             {/* Table (desktop) / row list (narrow container) — switched by container width */}
//             <div ref={containerRef}>
//               {isNarrow ? renderPhoneList() : renderDesktopTable()}
//             </div>

//             <DataTablePagination table={table} />
//           </div>
//         </div>
//       </div>

//       {/* Reverse Confirmation Dialog */}
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

//       {/* ── Upload Invoice Dialog ── */}
//       <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
//         if (!uploading) {
//           setUploadDialogOpen(open);
//           if (!open) {
//             setSelectedVoucher(null);
//             setSelectedFiles([]);
//             setExistingDocs([]);
//           }
//         }
//       }}>
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
//             {/* File Input */}
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

//             {/* Selected Files List */}
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
//                         <span className="text-gray-700 truncate max-w-[200px]">
//                           {file.name}
//                         </span>
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
//                         aria-label="Remove file"
//                       >
//                         <X size={14} />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Existing Documents */}
//             {existingDocs && existingDocs.length > 0 && (
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
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-700 truncate max-w-[150px]">
//                           {doc.FILENAME || `Document #${doc.ID}`}
//                         </span>
//                       </div>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
//                         onClick={() => deleteDocMutation.mutate(doc.ID)}
//                         disabled={uploading || deleteDocMutation.isPending}
//                         aria-label="Delete document"
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
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => {
//                 setUploadDialogOpen(false);
//                 setSelectedVoucher(null);
//                 setSelectedFiles([]);
//                 setExistingDocs([]);
//               }}
//               disabled={uploading}
//             >
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

//       {/* ── Review Voucher Modal (approved, read-only) ──────────────────────── */}
//       {reviewVoucher && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <div className="flex items-center gap-2">
//                 <Eye size={18} className="text-indigo-600" />
//                 <h2 className="text-base font-bold text-gray-900">
//                   Journal Voucher #{reviewVoucher.VOUCHERNO}
//                 </h2>
//               </div>
//               <div className="flex items-center gap-2">
//                 <EntryTypeBadge type={reviewVoucher.TYPE} />
//                 <button
//                   onClick={() => setReviewVoucher(null)}
//                   className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//                   aria-label="Close"
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
//                   {formatDate(reviewVoucher.TRANS_DATE)}
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
//                   Total Debit
//                 </label>
//                 <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800">
//                   {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
//                     parseFloat(reviewVoucher.DEBIT || 0)
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
//               <div>
//                 <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
//                   Attachments
//                 </label>
//                 <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
//                   <AttachmentIndicator count={reviewVoucher.DOC_COUNT} />
//                   <span className="text-xs text-slate-500">
//                     {Number(reviewVoucher.DOC_COUNT) || 0} file(s)
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* ── Account Distribution breakdown ── */}
//             <div className="px-6 pb-6">
//               <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
//                 Account Distribution
//               </h3>
//               <div className="overflow-hidden rounded-lg border border-slate-200">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-slate-50">
//                       <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                         Code
//                       </th>
//                       <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                         Particulars
//                       </th>
//                       <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                         Debit
//                       </th>
//                       <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
//                         Credit
//                       </th>
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
//                     {!reviewLoading && (reviewData?.details || []).length === 0 && (
//                       <tr>
//                         <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
//                           No account rows found.
//                         </td>
//                       </tr>
//                     )}
//                     {!reviewLoading &&
//                       (reviewData?.details || []).map((d, i) => (
//                         <tr key={d.ID ?? i} className="border-t border-slate-100">
//                           <td className="px-4 py-2 text-slate-700 font-medium">{d.CODE}</td>
//                           <td className="px-4 py-2 text-slate-600">
//                             {d.ACCOUNT_NAME || d.CODEDESCRIPTION || d.DESCRIPTION || "—"}
//                           </td>
//                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
//                             {Number(d.DEBIT) > 0
//                               ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(d.DEBIT)
//                               : "—"}
//                           </td>
//                           <td className="px-4 py-2 text-right tabular-nums text-slate-700">
//                             {Number(d.CREDIT) > 0
//                               ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(d.CREDIT)
//                               : "—"}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                   {!reviewLoading && (reviewData?.details || []).length > 0 && (
//                     <tfoot>
//                       <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
//                         <td colSpan={2} className="px-4 py-2 text-right text-slate-800">
//                           Total
//                         </td>
//                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">
//                           {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
//                             (reviewData.details || []).reduce((s, d) => s + Number(d.DEBIT || 0), 0)
//                           )}
//                         </td>
//                         <td className="px-4 py-2 text-right tabular-nums text-slate-900">
//                           {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
//                             (reviewData.details || []).reduce((s, d) => s + Number(d.CREDIT || 0), 0)
//                           )}
//                         </td>
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
//     </TooltipProvider>
//   );
// }


import { useState, useMemo, useRef, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Pencil,
  Eye,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  BadgeCheck,
  Search,
  BookOpenText,
  PlusIcon,
  RotateCcw,
  Upload,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { create } from "zustand";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { EntryTypeBadge } from "./entry-type-badge";
import { AttachmentIndicator } from "./attachment-indicator";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ⚠️ Tomar backend-er journal delete endpoint ekhane boshao.
// Method: DELETE, id URL-e jabe. Onno rokom hole deleteMutation-er moddhe change koro.
const JOURNAL_DELETE_URL = (id) => `${BASE_URL}/api/gl-edit/${id}`;

// Below this container width the table restructures into rows
// (pinned columns + 3 scrolling columns × ~115px ≈ 800px).
const ROW_LAYOUT_BREAKPOINT = 800;

// ── Active row (one id at a time; clicking the same row clears it) ──────────
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
  clear: () => set({ activeId: null }),
}));

// ── Helpers ─────────────────────────────────────────────────────────────────
const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Missing value → dash. Real zero → 0.00. Same decimals everywhere.
const formatAmount = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const n = parseFloat(value);
  if (isNaN(n)) return "—";
  return amountFormatter.format(n);
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

// normalize a date value to YYYY-MM-DD for comparison
const toISODateString = (val) => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const isPosted = (v) => v.POSTED === 1 || v.POSTED === "1";

// Container-width based switch (not a viewport media query)
function useIsNarrow(ref, threshold) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setNarrow(entry.contentRect.width < threshold);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, threshold]);
  return narrow;
}

const ALIGN_CLASS = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};
const JUSTIFY_CLASS = {
  left: "justify-start",
  right: "justify-end",
  center: "justify-center",
};
const PIN_CLASS = {
  left: "sticky left-0 border-r border-border",
  right: "sticky right-0 border-l border-border",
};

const HEAD_TEXT =
  "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

// Sort arrow only appears on the active (sorted) column.
const SortableHeader = ({ column, label, align = "left" }) => {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      className={`${HEAD_TEXT} p-0 h-auto w-full gap-1 hover:bg-transparent ${JUSTIFY_CLASS[align]}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      {sorted === "asc" && <ArrowUp className="h-3 w-3" aria-hidden="true" />}
      {sorted === "desc" && <ArrowDown className="h-3 w-3" aria-hidden="true" />}
    </Button>
  );
};

const PlainHeader = ({ label }) => <span className={HEAD_TEXT}>{label}</span>;

const EMPTY_DELETE_MODAL = { show: false, id: null, voucherNo: "", posted: false };

export default function JournalTable() {
  const [reviewVoucher, setReviewVoucher] = useState(null);
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [downloading, setDownloading] = useState(null);
  const [glDateFrom, setGlDateFrom] = useState("");
  const [glDateTo, setGlDateTo] = useState("");

  const [reverseId, setReverseId] = useState(null);
  const [isReversing, setIsReversing] = useState(false);

  // ── Delete State ──
  const [deleteModal, setDeleteModal] = useState(EMPTY_DELETE_MODAL);

  // ── Upload State ──
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [existingDocs, setExistingDocs] = useState([]);

  // ── Layout / row state ──
  const containerRef = useRef(null);
  const isNarrow = useIsNarrow(containerRef, ROW_LAYOUT_BREAKPOINT);
  const [expandedId, setExpandedId] = useState(null); // phone: one open at a time
  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);
  const clearActive = useActiveRowStore((s) => s.clear);
  useEffect(() => clearActive, [clearActive]);

  const canCreate = useHasPermission("JOURNAL_VOUCHER_CREATE");
  const canEdit = useHasPermission("JOURNAL_VOUCHER_EDIT");
  const canDownload = useHasPermission("JOURNAL_VOUCHER_DOWNLOAD");
  const canDelete = useHasPermission("JOURNAL_VOUCHER_DELETE");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["unpostedJournalVouchers"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/gl-all-unposted`);
      return res.data;
    },
  });

  // ── Review modal — fetch full master+details for the selected voucher ──────
  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["voucherReview", "journal", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/gl-view?insertID=${reviewVoucher.ID}`);
      return res.data;
    },
    enabled: !!reviewVoucher,
  });

  // ── Fetch existing docs for the selected voucher ──
  const { refetch: refetchDocs } = useQuery({
    queryKey: ["gldocs", selectedVoucher?.ID],
    queryFn: async () => {
      if (!selectedVoucher) return [];
      const res = await axios.get(`${BASE_URL}/api/gldoc`, {
        params: { glmaster_id: selectedVoucher.ID },
      });
      const docs = res.data.data || [];
      setExistingDocs(docs);
      return docs;
    },
    enabled: !!selectedVoucher,
  });

  // ── Upload Invoice Mutation ──
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
      queryClient.invalidateQueries(["unpostedJournalVouchers"]);
    },
    onError: (error) => {
      toast.error("Failed to upload invoice: " + (error.response?.data?.message || error.message));
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  // ── Delete Document Mutation ──
  const deleteDocMutation = useMutation({
    mutationFn: async (docId) => {
      await axios.delete(`${BASE_URL}/api/gldoc/${docId}`);
    },
    onSuccess: async () => {
      toast.success("Document deleted successfully!");
      await refetchDocs();
      queryClient.invalidateQueries(["unpostedJournalVouchers"]);
    },
    onError: (error) => {
      toast.error("Failed to delete document: " + (error.response?.data?.message || error.message));
    },
  });

  // ── Delete Voucher Mutation (permanent) ──
  const deleteMutation = useMutation({
    mutationFn: async (voucherId) => {
      const res = await axios.delete(JOURNAL_DELETE_URL(voucherId));
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success === 1 || data?.status === "success") {
        toast.success("Voucher deleted successfully!");
        queryClient.invalidateQueries(["unpostedJournalVouchers"]);
        clearActive();
        setExpandedId(null);
      } else {
        toast.error(data?.message || "Delete failed!");
      }
      setDeleteModal(EMPTY_DELETE_MODAL);
    },
    onError: (error) => {
      toast.error(
        "Error deleting voucher: " + (error.response?.data?.message || error.message)
      );
      setDeleteModal(EMPTY_DELETE_MODAL);
    },
  });

  const openDeleteModal = (voucher) => {
    setDeleteModal({
      show: true,
      id: voucher.ID,
      voucherNo: voucher.VOUCHERNO,
      posted: isPosted(voucher),
    });
  };

  const confirmDelete = () => {
    if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
  };

  // ── Upload Handlers ──
  const handleUploadClick = (voucher) => {
    setSelectedVoucher(voucher);
    setExistingDocs([]);
    setUploadDialogOpen(true);
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
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
    uploadMutation.mutate({
      voucherId: selectedVoucher.ID,
      files: selectedFiles,
    });
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

  // ── Total calculation for filtered data ─────────────────────────────────
  const totalDebit = useMemo(() => {
    return filteredVouchers.reduce((sum, v) => sum + parseFloat(v.DEBIT || 0), 0);
  }, [filteredVouchers]);

  const totalCredit = useMemo(() => {
    return filteredVouchers.reduce((sum, v) => sum + parseFloat(v.CREDIT || 0), 0);
  }, [filteredVouchers]);

  const totalCount = filteredVouchers.length;

  const handleDownload = async (voucher, type) => {
    const key = `${voucher.ID}-${type}`;
    setDownloading(key);

    try {
      const response = await fetch(
        `${BASE_URL}/api/journal/download/${voucher.ID}?type=${type}`
      );

      if (!response.ok) {
        let errMsg = `Server error ${response.status}`;
        try {
          const errBody = await response.json();
          errMsg = errBody.detail || errBody.message || errMsg;
        } catch { /* ignore */ }
        toast.error(`Download failed: ${errMsg}`);
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const ext = type === "pdf" ? "pdf" : "xlsx";

      anchor.href = objectUrl;
      anchor.download = `journal_voucher_${voucher.VOUCHERNO}.${ext}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success(`${type.toUpperCase()} downloaded successfully!`);
    } catch (err) {
      console.error(`[handleDownload] journal ${type} error:`, err);
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
        queryClient.invalidateQueries(["unpostedJournalVouchers"]);
      } else {
        toast.error(res.data.message || "Failed to reverse voucher");
      }
    } catch (error) {
      toast.error(
        "Error reversing voucher: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsReversing(false);
      setReverseId(null);
    }
  };

  // ── Desktop action cell (icon buttons, always visible) ────────────────────
  const renderDesktopActions = (voucher) => {
    const isApproved = isPosted(voucher);

    return (
      <div className="flex items-center justify-center gap-1">
        {canEdit &&
          (isApproved ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label="Review Voucher"
                  onClick={() => setReviewVoucher(voucher)}
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Review Voucher</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
            >
              <Link to={`/dashboard/journal-edit/${voucher.ID}`} title="Edit Voucher" aria-label="Edit Voucher">
                <Pencil size={16} />
              </Link>
            </Button>
          ))}

        {canDownload && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
                title="Download"
                aria-label="Download"
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
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                role="img"
                aria-label="Approved"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600 bg-green-100 border border-green-200 cursor-default"
              >
                <BadgeCheck size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-green-700 text-white text-xs">
              Approved
            </TooltipContent>
          </Tooltip>
        )}

        {isApproved && String(voucher.TYPE).toUpperCase() !== "REVERSE" && !voucher.REF_REVERSE_ENTRY && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                aria-label="Reverse Entry"
                onClick={() => setReverseId(voucher.ID)}
              >
                <RotateCcw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Reverse Entry</TooltipContent>
          </Tooltip>
        )}

        {isApproved && voucher.REF_REVERSE_ENTRY && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                role="img"
                aria-label={`Reversed (Voucher #${voucher.REF_REVERSE_ENTRY})`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 bg-red-100 border border-red-200 cursor-default"
              >
                <RotateCcw size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-red-700 text-white text-xs">
              Reversed (Voucher #{voucher.REF_REVERSE_ENTRY})
            </TooltipContent>
          </Tooltip>
        )}

        {/* ── Delete (permanent) — approved & unapproved both ── */}
        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                aria-label="Delete Voucher"
                onClick={() => openDeleteModal(voucher)}
              >
                <Trash2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete Voucher</TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  // ── Columns ──────────────────────────────────────────────────────────────
  // meta: { align, width, minWidth, pin }
  const columns = [
    {
      accessorKey: "VOUCHERNO",
      meta: { align: "left", width: 150, pin: "left" },
      header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
      cell: ({ row }) => (
        <span className="block truncate text-sm font-medium text-foreground">
          {row.getValue("VOUCHERNO") ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "GL_ENTRY_DATE",
      meta: { align: "left", width: 120 },
      header: ({ column }) => <SortableHeader column={column} label="GL Date" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.getValue("GL_ENTRY_DATE"))}
        </span>
      ),
    },
    {
      accessorKey: "DESCRIPTION",
      meta: { align: "left", minWidth: 240 }, // flexible column absorbs the slack
      header: () => <PlainHeader label="Description" />,
      cell: ({ row }) => {
        const text = row.getValue("DESCRIPTION");
        if (!text) return <span className="text-sm text-muted-foreground">—</span>;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block truncate text-sm text-muted-foreground">{text}</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm whitespace-normal break-words">
              {text}
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "DEBIT",
      meta: { align: "right", width: 140 },
      header: ({ column }) => <SortableHeader column={column} label="Debit" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatAmount(row.getValue("DEBIT"))}
        </span>
      ),
    },
    {
      accessorKey: "CREDIT",
      meta: { align: "right", width: 140 },
      header: ({ column }) => <SortableHeader column={column} label="Credit" align="right" />,
      cell: ({ row }) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatAmount(row.getValue("CREDIT"))}
        </span>
      ),
    },
    {
      id: "type",
      meta: { align: "center", width: 110 },
      header: () => <PlainHeader label="Type" />,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <EntryTypeBadge type={row.original.TYPE} />
        </div>
      ),
    },
    {
      id: "attachment",
      meta: { align: "center", width: 120 },
      header: () => <PlainHeader label="Invoice Count" />,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AttachmentIndicator count={row.original.DOC_COUNT} />
        </div>
      ),
    },
    {
      id: "uploadInvoice",
      meta: { align: "center", width: 130 },
      header: () => <PlainHeader label="Upload Invoice" />,
      cell: ({ row }) => {
        const voucher = row.original;
        const isApproved = isPosted(voucher);
        return (
          <div className="flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Upload Invoice"
                  onClick={() => handleUploadClick(voucher)}
                  disabled={isApproved}
                >
                  <Upload size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isApproved ? "Cannot upload (approved)" : "Upload Invoice"}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      meta: { align: "center", width: 230, pin: "right" },
      header: () => <PlainHeader label="Actions" />,
      cell: ({ row }) => renderDesktopActions(row.original),
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
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  const hasDateFilter = glDateFrom || glDateTo;
  const rows = table.getRowModel().rows;

  // Phone sort control (sorting moves above the list)
  const phoneSortField = sorting[0]?.id ?? "";
  const phoneSortDesc = sorting[0]?.desc ?? false;

  // ── Shared state blocks ──────────────────────────────────────────────────
  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        {hasDateFilter
          ? "No vouchers found for the selected date range"
          : "No unposted vouchers found"}
      </p>
      {hasDateFilter ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setGlDateFrom("");
            setGlDateTo("");
          }}
        >
          Clear date filter
        </Button>
      ) : (
        canCreate && (
          <Button asChild size="sm">
            <Link to="/dashboard/journal-create">
              <PlusIcon size={16} className="mr-2" />
              Add first journal
            </Link>
          </Button>
        )
      )}
    </div>
  );

  const errorState = (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-sm text-red-600">Error loading vouchers.</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}>
        Retry
      </Button>
    </div>
  );

  // ── Desktop table ────────────────────────────────────────────────────────
  const renderDesktopTable = () => (
    <div className="max-h-[calc(100dvh-12rem)] overflow-auto rounded-md border border-border">
      <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="h-12">
              {hg.headers.map((h) => {
                const meta = h.column.columnDef.meta || {};
                const sorted = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    scope="col"
                    aria-sort={
                      sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
                    }
                    style={{ width: meta.width, minWidth: meta.minWidth ?? meta.width }}
                    className={[
                      "sticky top-0 bg-muted px-3 border-b border-border whitespace-nowrap",
                      ALIGN_CLASS[meta.align || "left"],
                      meta.pin ? `${PIN_CLASS[meta.pin]} z-30` : "z-20",
                    ].join(" ")}
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={`sk-${i}`} className="h-12">
                {table.getVisibleLeafColumns().map((col) => {
                  const meta = col.columnDef.meta || {};
                  return (
                    <td
                      key={col.id}
                      className={[
                        "h-12 px-3 py-0 border-b border-border bg-background",
                        meta.pin ? `${PIN_CLASS[meta.pin]} z-10` : "",
                      ].join(" ")}
                    >
                      <Skeleton
                        className={`h-4 ${meta.align === "right" ? "ml-auto" : meta.align === "center" ? "mx-auto" : ""} ${meta.align === "left" || !meta.align ? "w-3/4" : "w-16"}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}

          {!isLoading && !error &&
            rows.map((row) => {
              const id = row.original.ID;
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
                  className="group h-12 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta || {};
                    const bg = isActive
                      ? "bg-violet-100"
                      : "bg-white group-hover:bg-violet-50";
                    return (
                      <td
                        key={cell.id}
                        style={{ width: meta.width, minWidth: meta.minWidth ?? meta.width }}
                        className={[
                          "h-12 px-3 py-0 whitespace-nowrap border-b border-border",
                          ALIGN_CLASS[meta.align || "left"],
                          bg,
                          meta.pin ? `${PIN_CLASS[meta.pin]} z-10` : "",
                          meta.width ? "" : "max-w-0", // lets the flexible column truncate
                        ].join(" ")}
                      >
                        {/* Buttons/links inside cells must never toggle the row highlight */}
                        {meta.align === "center" ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
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

        {/* ── Total row ── */}
        {!isLoading && !error && filteredVouchers.length > 0 && (
          <tfoot>
            <tr className="h-12">
              {table.getVisibleLeafColumns().map((col) => {
                const meta = col.columnDef.meta || {};
                const base =
                  "sticky bottom-0 h-12 px-3 py-0 bg-muted border-t border-border whitespace-nowrap text-sm font-bold text-foreground";
                const pin = meta.pin ? `${PIN_CLASS[meta.pin]} z-20` : "z-10";
                if (col.id === "VOUCHERNO") {
                  return (
                    <td key={col.id} className={`${base} ${pin} text-left`}>
                      Total ({totalCount})
                    </td>
                  );
                }
                if (col.id === "DEBIT") {
                  return (
                    <td key={col.id} className={`${base} ${pin} text-right tabular-nums`}>
                      {formatAmount(totalDebit)}
                    </td>
                  );
                }
                if (col.id === "CREDIT") {
                  return (
                    <td key={col.id} className={`${base} ${pin} text-right tabular-nums`}>
                      {formatAmount(totalCredit)}
                    </td>
                  );
                }
                return <td key={col.id} className={`${base} ${pin}`} />;
              })}
            </tr>
          </tfoot>
        )}
      </table>

      {!isLoading && error && errorState}
      {!isLoading && !error && rows.length === 0 && emptyState}
    </div>
  );

  // ── Phone / narrow layout: rows, no header, tap to expand ────────────────
  const renderPhoneList = () => (
    <div className="space-y-3">
      {/* Sorting control above the list */}
      <div className="flex items-center gap-2">
        <label htmlFor="journal-sort" className={HEAD_TEXT}>
          Sort
        </label>
        <select
          id="journal-sort"
          value={phoneSortField}
          onChange={(e) =>
            setSorting(e.target.value ? [{ id: e.target.value, desc: phoneSortDesc }] : [])
          }
          className="h-10 flex-1 rounded-md border border-border bg-background px-2 text-sm"
        >
          <option value="">Newest first</option>
          <option value="VOUCHERNO">Voucher No</option>
          <option value="GL_ENTRY_DATE">GL Date</option>
          <option value="DEBIT">Debit</option>
          <option value="CREDIT">Credit</option>
        </select>
        <Button
          variant="outline"
          className="h-10 w-10 p-0"
          disabled={!phoneSortField}
          aria-label={phoneSortDesc ? "Descending" : "Ascending"}
          onClick={() => setSorting([{ id: phoneSortField, desc: !phoneSortDesc }])}
        >
          {phoneSortDesc ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        </Button>
      </div>

      <div className="rounded-md border border-border">
        {isLoading && (
          <ul>
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="space-y-2 border-b border-border px-4 py-3 last:border-b-0">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-40" />
              </li>
            ))}
          </ul>
        )}

        {!isLoading && error && errorState}
        {!isLoading && !error && rows.length === 0 && emptyState}

        {!isLoading && !error && rows.length > 0 && (
          <ul>
            {rows.map((row) => {
              const v = row.original;
              const open = expandedId === v.ID;
              const isApproved = isPosted(v);
              return (
                <li key={row.id} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setExpandedId(open ? null : v.ID)}
                    className="flex min-h-[56px] w-full flex-col justify-center gap-1 px-4 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    {/* Line 1: identity left, key value (debit) right */}
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-foreground">
                        {v.VOUCHERNO ?? "—"}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {formatAmount(v.DEBIT)}
                        </span>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className={`text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                        />
                      </span>
                    </span>
                    {/* Line 2: state + secondary info */}
                    <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <EntryTypeBadge type={v.TYPE} />
                      <AttachmentIndicator count={v.DOC_COUNT} />
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-green-700">
                          <BadgeCheck size={14} aria-hidden="true" />
                          Approved
                        </span>
                      )}
                      {v.REF_REVERSE_ENTRY && (
                        <span className="inline-flex items-center gap-1 text-red-700">
                          <RotateCcw size={14} aria-hidden="true" />
                          Reversed (#{v.REF_REVERSE_ENTRY})
                        </span>
                      )}
                      <span className="ml-auto">{formatDate(v.GL_ENTRY_DATE)}</span>
                    </span>
                  </button>

                  {/* Expand in place: only fields not already on the row + actions */}
                  <div
                    inert={!open ? "" : undefined}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-3 px-4 pb-4 pt-1">
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between gap-3">
                            <dt className="text-muted-foreground">Credit</dt>
                            <dd className="font-semibold tabular-nums">{formatAmount(v.CREDIT)}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Description</dt>
                            <dd className="line-clamp-2 break-words">{v.DESCRIPTION || "—"}</dd>
                          </div>
                        </dl>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            className="h-10 gap-2"
                            disabled={isApproved}
                            onClick={() => handleUploadClick(v)}
                          >
                            <Upload size={16} /> Upload
                          </Button>

                          {canEdit &&
                            (isApproved ? (
                              <Button
                                variant="outline"
                                className="h-10 gap-2"
                                onClick={() => setReviewVoucher(v)}
                              >
                                <Eye size={16} /> View
                              </Button>
                            ) : (
                              <Button asChild variant="outline" className="h-10 gap-2">
                                <Link to={`/dashboard/journal-edit/${v.ID}`}>
                                  <Pencil size={16} /> Edit
                                </Link>
                              </Button>
                            ))}

                          {canDownload && (
                            <>
                              <Button
                                variant="outline"
                                className="h-10 gap-2"
                                disabled={downloading === `${v.ID}-pdf`}
                                onClick={() => handleDownload(v, "pdf")}
                              >
                                <FileText size={16} className="text-red-500" />
                                {downloading === `${v.ID}-pdf` ? "Generating…" : "PDF"}
                              </Button>
                              <Button
                                variant="outline"
                                className="h-10 gap-2"
                                disabled={downloading === `${v.ID}-excel`}
                                onClick={() => handleDownload(v, "excel")}
                              >
                                <FileSpreadsheet size={16} className="text-green-600" />
                                {downloading === `${v.ID}-excel` ? "Generating…" : "Excel"}
                              </Button>
                            </>
                          )}

                          {isApproved &&
                            String(v.TYPE).toUpperCase() !== "REVERSE" &&
                            !v.REF_REVERSE_ENTRY && (
                              <Button
                                variant="outline"
                                className="h-10 gap-2 text-orange-600"
                                onClick={() => setReverseId(v.ID)}
                              >
                                <RotateCcw size={16} /> Reverse
                              </Button>
                            )}

                          {canDelete && (
                            <Button
                              variant="outline"
                              className="h-10 gap-2 text-red-600 hover:text-red-800"
                              onClick={() => openDeleteModal(v)}
                            >
                              <Trash2 size={16} /> Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!isLoading && !error && filteredVouchers.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-4 py-3 text-sm font-bold">
          <span>Total ({totalCount})</span>
          <span className="tabular-nums">
            Dr {formatAmount(totalDebit)} · Cr {formatAmount(totalCredit)}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
                <BookOpenText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Journal Vouchers</h2>
                <p className="text-xs text-gray-400">
                  {filteredVouchers.length} total — unposted journal vouchers
                </p>
              </div>
            </div>

            {canCreate && (
              <Link to="/dashboard/journal-create">
                <Button>
                  <PlusIcon size={16} className="mr-2" />
                  Add New Journal
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
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  GL From Date
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
                      aria-label="Clear from date"
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
                      aria-label="Clear to date"
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

            {/* Table (desktop) / row list (narrow container) — switched by container width */}
            <div ref={containerRef}>
              {isNarrow ? renderPhoneList() : renderDesktopTable()}
            </div>

            <DataTablePagination table={table} />
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-11/12 rounded-lg bg-white p-6 shadow-xl md:w-96">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
              <Trash2 className="text-red-500" size={20} />
              Confirm Delete
            </h2>
            <p className="mb-3 text-gray-600">
              Are you sure you want to delete voucher{" "}
              <span className="font-semibold">{deleteModal.voucherNo}</span>?{" "}
              <span className="font-medium text-red-500">
                This will permanently delete the voucher and its entries. It cannot be undone.
              </span>
            </p>
            {deleteModal.posted && (
              <p className="mb-4 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
                This voucher is already approved/posted. Deleting it will remove it from the ledger.
              </p>
            )}
            <div className="mt-2 flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModal(EMPTY_DELETE_MODAL)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reverse Confirmation Dialog */}
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

      {/* ── Upload Invoice Dialog ── */}
      <Dialog open={uploadDialogOpen} onOpenChange={(open) => {
        if (!uploading) {
          setUploadDialogOpen(open);
          if (!open) {
            setSelectedVoucher(null);
            setSelectedFiles([]);
            setExistingDocs([]);
          }
        }
      }}>
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
            {/* File Input */}
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

            {/* Selected Files List */}
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
                        <span className="text-gray-700 truncate max-w-[200px]">
                          {file.name}
                        </span>
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
                        aria-label="Remove file"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Documents */}
            {existingDocs && existingDocs.length > 0 && (
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
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 truncate max-w-[150px]">
                          {doc.FILENAME || `Document #${doc.ID}`}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => deleteDocMutation.mutate(doc.ID)}
                        disabled={uploading || deleteDocMutation.isPending}
                        aria-label="Delete document"
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
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                setSelectedVoucher(null);
                setSelectedFiles([]);
                setExistingDocs([]);
              }}
              disabled={uploading}
            >
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

      {/* ── Review Voucher Modal (approved, read-only) ──────────────────────── */}
      {reviewVoucher && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-indigo-600" />
                <h2 className="text-base font-bold text-gray-900">
                  Journal Voucher #{reviewVoucher.VOUCHERNO}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <EntryTypeBadge type={reviewVoucher.TYPE} />
                <button
                  onClick={() => setReviewVoucher(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close"
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
                  {formatDate(reviewVoucher.TRANS_DATE)}
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
                  Total Debit
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800">
                  {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
                    parseFloat(reviewVoucher.DEBIT || 0)
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
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Attachments
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <AttachmentIndicator count={reviewVoucher.DOC_COUNT} />
                  <span className="text-xs text-slate-500">
                    {Number(reviewVoucher.DOC_COUNT) || 0} file(s)
                  </span>
                </div>
              </div>
            </div>

            {/* ── Account Distribution breakdown ── */}
            <div className="px-6 pb-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
                Account Distribution
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Code
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Particulars
                      </th>
                      <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Debit
                      </th>
                      <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Credit
                      </th>
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
                    {!reviewLoading && (reviewData?.details || []).length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
                          No account rows found.
                        </td>
                      </tr>
                    )}
                    {!reviewLoading &&
                      (reviewData?.details || []).map((d, i) => (
                        <tr key={d.ID ?? i} className="border-t border-slate-100">
                          <td className="px-4 py-2 text-slate-700 font-medium">{d.CODE}</td>
                          <td className="px-4 py-2 text-slate-600">
                            {d.ACCOUNT_NAME || d.CODEDESCRIPTION || d.DESCRIPTION || "—"}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                            {Number(d.DEBIT) > 0
                              ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(d.DEBIT)
                              : "—"}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                            {Number(d.CREDIT) > 0
                              ? new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(d.CREDIT)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {!reviewLoading && (reviewData?.details || []).length > 0 && (
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                        <td colSpan={2} className="px-4 py-2 text-right text-slate-800">
                          Total
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-900">
                          {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
                            (reviewData.details || []).reduce((s, d) => s + Number(d.DEBIT || 0), 0)
                          )}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums text-slate-900">
                          {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
                            (reviewData.details || []).reduce((s, d) => s + Number(d.CREDIT || 0), 0)
                          )}
                        </td>
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