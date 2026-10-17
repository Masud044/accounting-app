import { useState } from "react";
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
  Trash2,
  AlertCircle,
  RefreshCw,
  Warehouse,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

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
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Label } from "@/components/ui/label";
import { useHasPermission } from "@/hooks/use-permission";

import { useAllChickenSheds, useDeleteChickenShed } from "./queries";
import AddChickenShedSheet from "./add-shed";
import UpdateChickenShedSheet from "./edit-shed";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatDate = (val) => {
  const m = String(val ?? "").match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "—";
  return `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
};

const SortableHeader = ({ column, label }) => (
  <Button
    variant="ghost"
    className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label} <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
);

export default function ChickenShedList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions (permission code gulo apnar RBAC seed er sathe milan) ──
  const canCreate = useHasPermission("CHICKEN_SHED_CREATE");
  const canEdit   = useHasPermission("CHICKEN_SHED_EDIT");
  const canDelete = useHasPermission("CHICKEN_SHED_DELETE");

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAllChickenSheds();

  const deleteMutation = useDeleteChickenShed();

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete shed?",
      description: `Are you sure you want to delete shed ${record.SHED_CODE}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Shade deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete shade. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "SHED_CODE",
      header: ({ column }) => <SortableHeader column={column} label="Shade Code" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("SHED_CODE") || "—"}</div>
      ),
    },
    {
      accessorKey: "CREATION_DATE",
      header: ({ column }) => <SortableHeader column={column} label="Created At" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm text-gray-500">{formatDate(row.getValue("CREATION_DATE"))}</div>
      ),
    },
    ...(canEdit || canDelete
      ? [
          {
            id: "actions",
            header: () => (
              <div className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
            ),
            enableHiding: false,
            cell: ({ row }) => {
              const record = row.original;
              return (
                <div className="flex items-center justify-center gap-1">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => handleEdit(record)}
                    >
                      <IconEdit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive hover:bg-red-50"
                      onClick={() => handleDelete(record)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending
                        ? <Spinner className="h-4 w-4" />
                        : <Trash2 className="h-4 w-4" />}
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const table = useReactTable({
    data: records,
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

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
              <Warehouse size={16} />
            </div>
            <h1 className="text-sm font-bold text-gray-900">Chicken Shades</h1>
          </div>
          {canCreate && (
            <Button disabled className="bg-amber-600"><IconCircleDashedPlus className="mr-1" />Add Shed</Button>
          )}
        </div>
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-4 text-amber-600" />
            <p className="text-sm text-gray-500">Loading shade...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
              <Warehouse size={16} />
            </div>
            <h1 className="text-sm font-bold text-gray-900">Chicken Shades</h1>
          </div>
          {canCreate && (
            <Button onClick={() => setIsAddSheetOpen(true)} className="bg-amber-600 hover:bg-amber-700">
              <IconCircleDashedPlus className="mr-1" />Add Shed
            </Button>
          )}
        </div>
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Sheds</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load sheds."}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
                {isFetching
                  ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                  : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // ── Main ──
  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-50 text-amber-600">
              <Warehouse size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Chicken Shade</h1>
              <p className="text-xs text-gray-400">{records.length} Shade</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white border-gray-200"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            {canCreate && (
              <Button onClick={() => setIsAddSheetOpen(true)}>
                <IconCircleDashedPlus className="mr-1" />Add Shade
              </Button>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-4 flex-wrap">
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <Label className="text-xs font-medium text-gray-500">Search</Label>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search shades..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="h-9 pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-amber-300"
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 lg:ml-auto bg-white border-gray-200">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon"><Warehouse /></EmptyMedia>
                          <EmptyTitle>No Sheds Found</EmptyTitle>
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
        <AddChickenShedSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateChickenShedSheet
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