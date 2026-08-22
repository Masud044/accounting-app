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
//   ChevronDown,
//   Trash2,
//   AlertCircle,
//   RefreshCw,
//   Fish as FishIcon,
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

// import { useFishProjects, useDeleteFishProject } from "./queries";
// import AddFishProjectSheet from "./add-fish-sheet";
// import UpdateFishProjectSheet from "./update-fish-sheet";

// export default function FishProjectList() {
//   const [sorting, setSorting] = useState([{ id: "ID", desc: true }]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");

//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const {
//     data: records = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useFishProjects();

//   const deleteMutation = useDeleteFishProject();

//   const handleEdit = (record) => {
//     setSelectedRecord(record);
//     setIsUpdateSheetOpen(true);
//   };

//   const handleDelete = async (record) => {
//     const confirmed = await showConfirmation({
//       title: "Delete record?",
//       description: `Are you sure you want to delete fish project #${record.ID}? This action cannot be undone.`,
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
//     // {
//     //   accessorKey: "ID",
//     //   header: ({ column }) => (
//     //     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//     //       ID <ArrowUpDown className="ml-2 h-4 w-4" />
//     //     </Button>
//     //   ),
//     //   cell: ({ row }) => (
//     //     <div className="font-mono text-sm ps-2 font-medium">#{row.getValue("ID")}</div>
//     //   ),
//     // },
//     {
//       accessorKey: "FISH_NUMBER",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Fish Number <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       cell: ({ row }) => (
//         <div className=" tabular-nums ps-2">
//           {Number(row.getValue("FISH_NUMBER") || 0).toLocaleString()}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "FISH_TYPE",
//       header: "Fish Type",
//       cell: ({ row }) => (
//         <div className=" ps-2">{row.getValue("FISH_TYPE") || "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "LOT",
//       header: "Lot",
//       cell: ({ row }) => (
//         <div className="tabular-nums">{row.getValue("LOT") ?? "—"}</div>
//       ),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const record = row.original;
//         return (
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8"
//               onClick={() => handleEdit(record)}
//             >
//               <IconEdit className="h-4 w-4" />
//               <span className="sr-only">Edit</span>
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-destructive hover:text-destructive"
//               onClick={() => handleDelete(record)}
//               disabled={deleteMutation.isPending}
//             >
//               {deleteMutation.isPending
//                 ? <Spinner className="h-4 w-4" />
//                 : <Trash2 className="h-4 w-4" />}
//               <span className="sr-only">Delete</span>
//             </Button>
//           </div>
//         );
//       },
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

//   // ── Loading ──────────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Fish Project</h1>
//             <Button disabled><IconCircleDashedPlus className="mr-1" />Add Record</Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">Loading fish project records...</p>
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
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Fish Project</h1>
//             <Button onClick={() => setIsAddSheetOpen(true)}>
//               <IconCircleDashedPlus className="mr-1" />Add Record
//             </Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Records</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load fish project records."}</p>
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
//           <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Fish Project</h1>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             <Button onClick={() => setIsAddSheetOpen(true)}>
//               <IconCircleDashedPlus className="mr-1" />Add Record
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="space-y-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Input
//               placeholder="Search records..."
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
//                           <EmptyMedia variant="icon"><FishIcon /></EmptyMedia>
//                           <EmptyTitle>No Records Found</EmptyTitle>
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
//         <AddFishProjectSheet
//           open={isAddSheetOpen}
//           onOpenChange={setIsAddSheetOpen}
//           showConfirmation={showConfirmation}
//         />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateFishProjectSheet
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
  Trash2,
  AlertCircle,
  RefreshCw,
  Fish as FishIcon,
  Search,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useFishProjects, useDeleteFishProject } from "./queries";
import AddFishProjectSheet from "./add-fish-sheet";
import UpdateFishProjectSheet from "./update-fish-sheet";

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

export default function FishProjectList() {
  const [sorting, setSorting] = useState([{ id: "FISH_NUMBER", desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [fishTypeFilter, setFishTypeFilter] = useState("all");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFishProjects();

  const deleteMutation = useDeleteFishProject();

  // ── Unique fish types for the filter dropdown ─────────────────────────────
  const fishTypeOptions = useMemo(() => {
    const types = new Set(
      records.map((r) => r.FISH_TYPE).filter((t) => t && String(t).trim())
    );
    return Array.from(types).sort();
  }, [records]);

  // ── Apply fish type filter before passing data to the table ──────────────
  const filteredRecords = useMemo(() => {
    if (fishTypeFilter === "all") return records;
    return records.filter((r) => r.FISH_TYPE === fishTypeFilter);
  }, [records, fishTypeFilter]);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete record?",
      description: `Are you sure you want to delete fish project #${record.ID}? This action cannot be undone.`,
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
      accessorKey: "FISH_NUMBER",
      header: ({ column }) => <SortableHeader column={column} label="Fish Number" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800 tabular-nums">
          {Number(row.getValue("FISH_NUMBER") || 0).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "FISH_TYPE",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fish Type</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.getValue("FISH_TYPE") || "—"}</div>
      ),
    },
    {
      accessorKey: "LOT",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lot</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 tabular-nums">{row.getValue("LOT") ?? "—"}</div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
              onClick={() => handleEdit(record)}
            >
              <IconEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => handleDelete(record)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? <Spinner className="h-4 w-4" />
                : <Trash2 className="h-4 w-4" />}
              <span className="sr-only">Delete</span>
            </Button>
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

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-sm text-gray-500">Loading fish project records...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Records</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load fish project records."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              {isFetching
                ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
              <FishIcon size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Fish Project</h2>
              <p className="text-xs text-gray-400">{filteredRecords.length} of {records.length} records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Search + Fish Type filter + Column visibility — all in one row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full sm:w-48">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Fish Type
              </label>
              <Select value={fishTypeFilter} onValueChange={setFishTypeFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-violet-300">
                  <SelectValue placeholder="All fish types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fish Types</SelectItem>
                  {fishTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                          <EmptyMedia variant="icon"><FishIcon /></EmptyMedia>
                          <EmptyTitle>No Records Found</EmptyTitle>
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

      {/* Sheets */}
      {isAddSheetOpen && (
        <AddFishProjectSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateFishProjectSheet
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