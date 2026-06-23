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
  AlertCircle,
  RefreshCw,
  PackageCheck,
} from "lucide-react";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CustomDataTableColumnHeader from "@/components/shared/custom-data-table-column-header";
import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";
import { useGRNList, useDeleteGRN } from "./queries";
import AddGRNSheet from "./add-grn-sheet";
import UpdateGRNSheet from "./update-grn-sheet";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const formatDate = (v) => {
  if (!v) return "—";
  try { return format(new Date(v), "dd MMM yyyy"); }
  catch { return "—"; }
};

function StatusBadge({ status }) {
  if (status === 2) {
    return (
      <Badge className="text-[11px] font-semibold uppercase tracking-wide bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-800 hover:bg-green-100">
        Approved
      </Badge>
    );
  }
  return (
    <Badge className="text-[11px] font-semibold uppercase tracking-wide bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800 hover:bg-yellow-100">
      Pending
    </Badge>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function GRNList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedTid, setSelectedTid] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: grnList = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGRNList();

  const deleteMutation = useDeleteGRN();

  const handleEdit = (tid) => {
    setSelectedTid(tid);
    setIsUpdateSheetOpen(true);
  };

  const handleDelete = async (tid, grnno) => {
    const confirmed = await showConfirmation({
      title: "Delete GRN?",
      description: `This will permanently delete GRN ${grnno || `#${tid}`} and all its line items. This cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync(tid);
      toast.success("GRN deleted successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to delete GRN.");
    }
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "TID",
      header: ({ column }) => (
        <CustomDataTableColumnHeader column={column} title="TID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">#{row.getValue("TID")}</span>
      ),
    },
    {
      accessorKey: "GRNNO",
      header: ({ column }) => (
        <CustomDataTableColumnHeader column={column} title="GRN No" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.getValue("GRNNO") || "—"}</span>
      ),
    },
    {
      accessorKey: "GRNDATE",
      header: ({ column }) => (
        <CustomDataTableColumnHeader column={column} title="GRN Date" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-light">{formatDate(row.getValue("GRNDATE"))}</span>
      ),
    },
    {
      accessorKey: "CHALLANNO",
      header: ({ column }) => (
        <CustomDataTableColumnHeader column={column} title="Challan No" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-light">{row.getValue("CHALLANNO") || "—"}</span>
      ),
    },
    {
      accessorKey: "PONO",
      header: ({ column }) => (
        <CustomDataTableColumnHeader column={column} title="PO No" />
      ),
      cell: ({ row }) => (
        <span className="text-sm font-light">{row.getValue("PONO") || "—"}</span>
      ),
    },
    // {
    //   id: "items",
    //   header: "Items",
    //   cell: ({ row }) => {
    //     const total = row.original.TOTAL_ITEMS ?? 0;
    //     return (
    //       <span className="text-sm font-medium">
    //         {total > 0 ? `${total} ${total === 1 ? "item" : "items"}` : "—"}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: "STATUS",
      header: ({ column }) => (
        <CustomDataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusBadge status={row.getValue("STATUS")} />,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const grn = row.original;
        return (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(grn.TID)}
                  >
                    <IconEdit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit GRN</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(grn.TID, grn.GRNNO)}
                    disabled={deleteMutation.isPending}
                  >
                    <IconTrash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete GRN</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: grnList,
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  /* ─── Loading ────────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div>
        <div className="bg-card rounded-md shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Goods Receipt Note</h1>
            <Button disabled>
              <IconPlus />
              Add GRN
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-md shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading GRN records...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Error ──────────────────────────────────────────────────────────── */
  if (isError) {
    return (
      <div>
        <div className="bg-card rounded-md shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">GRN Form</h1>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconPlus />
              Add GRN
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-md shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading GRN Records</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load. Please try again."}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="w-fit"
              >
                {isFetching ? (
                  <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" />Retry</>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  /* ─── Main ───────────────────────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">GRN Form</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconPlus />
              Add GRN
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="space-y-4">
          <CustomDataTableToolbar
            table={table}
            searchPlaceholder="Search by TID, GRN no, challan, PO..."
          />

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
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
                          {flexRender(cell.column.columnDef.def, cell.getContext()) ??
                            flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <PackageCheck />
                          </EmptyMedia>
                          <EmptyTitle>No GRN Records Found</EmptyTitle>
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
        <AddGRNSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
        />
      )}

      {isUpdateSheetOpen && selectedTid && (
        <UpdateGRNSheet
          open={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
          showConfirmation={showConfirmation}
          grnTid={selectedTid}
        />
      )}

      <ConfirmationDialog />
    </div>
  );
}