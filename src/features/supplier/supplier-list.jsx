// import { useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ChevronDown, Trash2, AlertCircle, RefreshCw, Truck } from "lucide-react";


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
// import { Badge } from "@/components/ui/badge";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// import { useSuppliers } from "./queries";
// import AddSupplierSheet from "./add-supplier-sheet";
// import UpdateSupplierSheet from "./update-supplier-sheet";

// export default function SupplierList() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const {
//     data: suppliers = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useSuppliers();

//   // const deleteMutation = useDeleteSupplier();

//   const handleEdit = (supplier) => {
//     setSelectedSupplier(supplier);
//     setIsUpdateSheetOpen(true);
//   };

//   // const handleDelete = async (supplier) => {
//   //   const confirmed = await showConfirmation({
//   //     title: "Delete supplier?",
//   //     description: `Are you sure you want to delete "${supplier.SUPPLIER_NAME}"? This action cannot be undone.`,
//   //     confirmText: "Delete",
//   //     cancelText: "Cancel",
//   //     variant: "destructive",
//   //   });
//   //   if (confirmed) {
//   //     try {
//   //       await deleteMutation.mutateAsync(supplier.SUPPLIER_ID);
//   //       toast.success("Supplier deleted successfully!");
//   //     } catch (err) {
//   //       toast.error(err?.message || "Failed to delete supplier. Please try again.");
//   //     }
//   //   }
//   // };

//   const columns = [
//     // Supplier Name
//     {
//       accessorKey: "SUPPLIER_NAME",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Supplier Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className="font-medium ps-2">{row.getValue("SUPPLIER_NAME") || "—"}</div>
//       ),
//     },

//     // Contact Person
//     {
//       accessorKey: "CONTACT_PERSON",
//       header: "Contact Person",
//       cell: ({ row }) => (
//         <div className="text-muted-foreground">{row.getValue("CONTACT_PERSON") || "—"}</div>
//       ),
//     },

//     // Phone
//     {
//       accessorKey: "PHONE",
//       header: "Phone",
//       cell: ({ row }) => (
//         <div>{row.getValue("PHONE") || "—"}</div>
//       ),
//     },

//     // Mobile
//     {
//       accessorKey: "MOBILE",
//       header: "Mobile",
//       cell: ({ row }) => (
//         <div>{row.getValue("MOBILE") || "—"}</div>
//       ),
//     },

//     // Email
//     {
//       accessorKey: "EMAIL",
//       header: "Email",
//       cell: ({ row }) => (
//         <div className="text-muted-foreground text-sm truncate max-w-[180px]">
//           {row.getValue("EMAIL") || "—"}
//         </div>
//       ),
//     },

//     // Status
//     {
//       accessorKey: "STATUS",
//       header: "Status",
//       cell: ({ row }) => (
//         <Badge variant={row.getValue("STATUS") === 1 ? "success" : "secondary"}>
//           {row.getValue("STATUS") === 1 ? "Active" : "Inactive"}
//         </Badge>
//       ),
//     },

//     // Actions
//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const supplier = row.original;
//         return (
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(supplier)}>
//               <IconEdit className="h-4 w-4" />
//               <span className="sr-only">Edit</span>
//             </Button>
//             {/* <Button
//             //   variant="ghost"
//               size="icon"
//             //   className="h-8 w-8 text-destructive hover:text-destructive"
//               onClick={() => handleDelete(supplier)}
//               disabled={deleteMutation.isPending}
//             >
//               {deleteMutation.isPending
//                 ? <Spinner data-icon="inline-start" />
//                 : <Trash2 className="h-4 w-4" />}
//               <span className="sr-only">Delete</span>
//             </Button> */}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: suppliers,
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

//   // ── Loading ──────────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Suppliers</h1>
//             <Button disabled><IconCircleDashedPlus className="mr-1" />Add Supplier</Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">Loading suppliers...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error ────────────────────────────────────────────────────────────────────
//   if (isError) {
//     return (
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Suppliers</h1>
//             <Button onClick={() => setIsAddSheetOpen(true)}>
//               <IconCircleDashedPlus className="mr-1" />Add Supplier
//             </Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Suppliers</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load suppliers."}</p>
//               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//                 {isFetching
//                   ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
//                   : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   // ── Main ─────────────────────────────────────────────────────────────────────
//   return (
//     <div>
//       {/* Header */}
//       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="space-y-0.5">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Suppliers</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             <Button onClick={() => setIsAddSheetOpen(true)}>
//               <IconCircleDashedPlus className="mr-1" />Add Supplier
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Input
//               placeholder="Search by name, contact, email..."
//               value={globalFilter ?? ""}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className="max-w-sm"
//             />
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto">
//                   Columns <ChevronDown className="ml-2 h-4 w-4" />
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

//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id}>
//                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
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
//                           <EmptyMedia variant="icon"><Truck /></EmptyMedia>
//                           <EmptyTitle>No Suppliers Found</EmptyTitle>
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

//       {/* Sheets */}
//       {isAddSheetOpen && (
//         <AddSupplierSheet
//           open={isAddSheetOpen}
//           onOpenChange={setIsAddSheetOpen}
//           showConfirmation={showConfirmation}
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateSupplierSheet
//           open={isUpdateSheetOpen}
//           onOpenChange={setIsUpdateSheetOpen}
//           showConfirmation={showConfirmation}
//           supplier={selectedSupplier}
//         />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }


import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, AlertCircle, RefreshCw, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useSuppliers } from "./queries";
import AddSupplierSheet from "./add-supplier-sheet";
import UpdateSupplierSheet from "./update-supplier-sheet";

const SortableHeader = ({ column, label }) => (
  <Button
    variant="ghost"
    className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label} <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
);

export default function SupplierList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: suppliers = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useSuppliers();

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsUpdateSheetOpen(true);
  };

  const columns = [
    {
      accessorKey: "SUPPLIER_NAME",
      header: ({ column }) => <SortableHeader column={column} label="Supplier Name" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("SUPPLIER_NAME") || "—"}</div>
      ),
    },
    {
      accessorKey: "CONTACT_PERSON",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Person</div>,
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.getValue("CONTACT_PERSON") || "—"}</div>
      ),
    },
    {
      accessorKey: "PHONE",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</div>,
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("PHONE") || "—"}</div>,
    },
    {
      accessorKey: "MOBILE",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile</div>,
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("MOBILE") || "—"}</div>,
    },
    {
      accessorKey: "EMAIL",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</div>,
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 truncate max-w-[180px]">
          {row.getValue("EMAIL") || "—"}
        </div>
      ),
    },
    {
      accessorKey: "STATUS",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</div>,
      cell: ({ row }) => (
        <Badge
          className={
            row.getValue("STATUS") === 1
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }
        >
          {row.getValue("STATUS") === 1 ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
              onClick={() => handleEdit(supplier)}
            >
              <IconEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: suppliers,
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
            <p className="text-sm text-gray-500">Loading suppliers...</p>
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
          <AlertTitle>Error Loading Suppliers</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load suppliers."}</p>
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
              <Truck size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Suppliers</h2>
              <p className="text-xs text-gray-400">{suppliers.length} total suppliers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Supplier
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, contact, email..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
              />
            </div>
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
                        <TableCell key={cell.id} className="text-sm text-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon"><Truck /></EmptyMedia>
                          <EmptyTitle>No Suppliers Found</EmptyTitle>
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
        <AddSupplierSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
      )}
      {isUpdateSheetOpen && (
        <UpdateSupplierSheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} supplier={selectedSupplier} />
      )}
      <ConfirmationDialog />
    </div>
  );
}