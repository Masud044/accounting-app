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
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  PlusIcon,
  Download,
  FileText,
  FileSpreadsheet,
 
} from "lucide-react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
// import { DataTablePagination } from "@/components/DataTablePagination";


// import api from "@/api/Ap";
import { DataTablePagination } from "@/components/DataTablePagination";
import { ReceiveService } from "@/api/AccontingApi";
import { toast } from "react-toastify";
import ReceiveCreate from "../pages/ReceiveCreate";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

 
const BASE_URL  = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export default function ReceiveTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
   const [deleteModal, setDeleteModal] = useState({ show: false, id: null, voucherNo: "" });
   // Track which voucher+type is currently downloading to show a loading state
  const [downloading, setDownloading] = useState(null); // e.g. "42-pdf"


    const queryClient = useQueryClient();

  // Fetch unposted vouchers - simplified like working version
  const { data, isLoading, error } = useQuery({
    queryKey: ["unpostedVouchers"],
    queryFn: async () => {
      // const res = await api.get("/receive_all_unposted.php");
       const res = await axios.get(`${BASE_URL}/api/receive-all-unposted`);
   
      return res.data;
     
    },
   
  });
  console.log(data)


  // ✅ Delete Mutation
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

  // ✅ Handle Delete Click
  const handleDeleteClick = (voucher) => {
    setDeleteModal({
      show: true,
      id: voucher.ID,
      voucherNo: voucher.VOUCHERNO,
    });
  };

  // ✅ Confirm Delete
  const confirmDelete = () => {
    if (deleteModal.id) {
      deleteMutation.mutate(deleteModal.id);
    }
  };

  

  // Extract and sort vouchers with useMemo to prevent infinite re-renders
  const sortedVouchers = useMemo(() => {
    // const vouchers = data?.success === "true" ? data.data : [];
    //  const vouchers = data?.success ? data.data : [];
     const vouchers = Array.isArray(data?.data) ? data.data : [];
    return [...vouchers].sort((a, b) => Number(b.ID) - Number(a.ID));
  }, [data]);
  console.log(sortedVouchers)

  const handleDownload = async (voucher, type) => {
      const key = `${voucher.ID}-${type}`;
      setDownloading(key);
  
      try {
        const response = await fetch(
          `${BASE_URL}/api/receipt/download/${voucher.ID}?type=${type}`
        );
  
        if (!response.ok) {
          // Try to parse error body from backend
          let errMsg = `Server error ${response.status}`;
          try {
            const errBody = await response.json();
            errMsg = errBody.detail || errBody.message || errMsg;
          } catch {
            // ignore parse failure
          }
          toast.error(`Download failed: ${errMsg}`);
          return;
        }
  
        const blob = await response.blob();
  
        // ── Use a different variable name — NOT "url" ──
        const objectUrl = URL.createObjectURL(blob);
        const anchor    = document.createElement("a");
        const ext       = type === "pdf" ? "pdf" : "xlsx";
  
        anchor.href     = objectUrl;
        anchor.download = `receipt_voucher_${voucher.VOUCHERNO}.${ext}`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
  
        // Revoke after a short delay so the browser has time to start the download
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  
        toast.success(`${type.toUpperCase()} downloaded successfully!`);
      } catch (err) {
        // Now we actually log and display the real error
        console.error(`[handleDownload] ${type} error:`, err);
        toast.error(`Error downloading ${type.toUpperCase()}: ${err.message}`);
      } finally {
        setDownloading(null);
      }
    };
  

  const columns = [
    // {
    //   accessorKey: "ID",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       #
    //       <ArrowUpDown  />
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="font-medium ml-3">{row.getValue("ID")}</div>
    //   ),
    // },
    {
      accessorKey: "VOUCHERNO",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Voucher No
          <ArrowUpDown  />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-3">{row.getValue("VOUCHERNO")}</div>,
    },
    {
      accessorKey: "TRANS_DATE",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          
        >
          Transaction Date
          <ArrowUpDown  />
        </Button>
      ),
      cell: ({ row }) => <div className="ml-3">{row.getValue("TRANS_DATE")}</div>,
    },
    {
      accessorKey: "GL_ENTRY_DATE",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          GL Date
          <ArrowUpDown  />
        </Button>
      ),
      cell: ({ row }) => <div  className="ml-3">{row.getValue("GL_ENTRY_DATE")}</div>,
    },
    {
      accessorKey: "DESCRIPTION",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("DESCRIPTION")}>
          {row.getValue("DESCRIPTION")}
        </div>
      ),
      
    },
    {
      accessorKey: "CREDIT",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Debit
          <ArrowUpDown  />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("CREDIT") || 0);
        const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
        return <div className="font-medium ml-3">{formatted}</div>;
      },
    },

     {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const voucher = row.original;

        return (
          <div className="flex items-center justify-center gap-1">

            {/* Edit */}
            <Link
              to={`/dashboard/receive-edit/${voucher.ID}`}
              // className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-violet-700 hover:bg-violet-50 transition-colors"
              title="Edit Voucher"
            >
              <Pencil size={16} />
            </Link>

            {/* Download dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  // className="h-8 w-8 text-gray-500 hover:text-violet-700"
                  title="Download"
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

            {/* Delete */}
            <Button
              // variant="ghost"
              size="icon"
              // className="h-8 w-8 text-gray-500 hover:text-red-600"
              onClick={() => handleDeleteClick(voucher)}
              title="Delete Voucher"
            >
              <Trash2 size={16} />
            </Button>

          </div>
        );
      },
    },
//    {
//   id: "actions",
//   enableHiding: false,
//   header: () => <div className="text-center">Actions</div>,
//   cell: ({ row }) => {
//     const voucher = row.original;

//     return (
//       <div className="flex items-center justify-center gap-3">
//         {/* Edit Button */}
//         <Link
//           to={`/dashboard/receive-edit/${voucher.ID}`}
         
//         >
//           <Pencil size={18} />
//         </Link>

//         {/* Copy Voucher No */}
//         {/* <button
//           onClick={() =>
//             navigator.clipboard.writeText(voucher.VOUCHERNO?.toString() || "")
//           }
//           className="text-gray-600 hover:text-black"
//           title="Copy Voucher No"
//         >
//           📋
//         </button> */}

//         {/* Delete Button */}
//         <Button
//           onClick={() => handleDeleteClick(voucher)}
         
//         >
//           <Trash2 size={18} />
//         </Button>
//       </div>
//     );
//   },
// }
  ];

  const table = useReactTable({
    data: sortedVouchers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading vouchers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">Error loading vouchers.</p>
          </div>
        </div>
      </div>
    );
  }

  return (

    <>
    <div className=" mt-6">
      <Card className="w-full  shadow-lg">
          <CardHeader className="border-b">
          <CardTitle className="text-sm font-bold">
            Receive Voucher
          </CardTitle>
         
        </CardHeader>

        {/* Data Table */}
        <div className="bg-card rounded-md  p-4 ">
          <div className="space-y-4">
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search vouchers..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />

             

              <DropdownMenu>
                
                <DropdownMenuTrigger asChild>
                  
                  <Button variant="outline" className="ml-auto">
                  
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id.replace(/_/g, " ")}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/dashboard/receive-create">
  <Button>
    <PlusIcon size={16} className="mr-2" />
    Add New Receiver
  </Button>
</Link>

            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
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
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground">
                            No unposted vouchers found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <DataTablePagination table={table} />
          </div>
        </div>
        </Card>
     
    </div>

     {/* ✅ Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 md:w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete voucher{" "}
              <span className="font-semibold">{deleteModal.voucherNo}</span>?
              
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setDeleteModal({ show: false, id: null, voucherNo: "" })
                }
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

      </>
  );
}