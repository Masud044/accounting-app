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
  Egg,
  CalendarSearch,
  X,
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

// import { useEggProductions, useEggProductionByDateRange, useDeleteEggProduction } from "./queries";
import { useAllEggProductions, useDeleteEggProduction } from "./queries";
import AddEggProductionSheet from "./add-egg-production-sheet";
import UpdateEggProductionSheet from "./update-egg-production-sheet";

// ── Date formatter ────────────────────────────────────────────────────────────
const formatDate = (val) => {
  if (!val) return "—";
  const str = String(val); // e.g. "16-MAY-26"
  
  // ✅ Oracle "DD-MON-YY" format handle
  const oracleMatch = str.match(/^(\d{2})-([A-Z]{3})-(\d{2})$/i);
  if (oracleMatch) {
    const [, day, mon, yy] = oracleMatch;
    return `${day} ${mon.charAt(0).toUpperCase() + mon.slice(1).toLowerCase()} 20${yy}`;
  }

  // ✅ ISO format fallback "2026-06-26T..."
  const isoMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const [, year, month, day] = isoMatch;
    return `${day} ${months[Number(month) - 1]} ${year}`;
  }

  return "—";
};

export default function EggProductionList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Date range filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [activeDateRange, setActiveDateRange] = useState({ from: "", to: "" });
  const isDateRangeActive = !!(activeDateRange.from && activeDateRange.to);

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // Use date-range query when active, else paginated list
  // const listQuery = useEggProductions();
  // const dateRangeQuery = useEggProductionByDateRange(activeDateRange.from, activeDateRange.to);

  // const activeQuery = isDateRangeActive ? dateRangeQuery : listQuery;

  // const {
  //   data: records = [],
  //   isLoading,
  //   isError,
  //   error,
  //   refetch,
  //   isFetching,
  // } = activeQuery;


  // পুরোনো block সরাও, এটা দাও:
const {
  data: allRecords = [],
  isLoading,
  isError,
  error,
  refetch,
  isFetching,
} = useAllEggProductions();

const toFilterDateStr = (val) => {
  if (!val) return "";
  const str = String(val);
  const oracleMatch = str.match(/^(\d{2})-([A-Z]{3})-(\d{2})$/i);
  if (oracleMatch) {
    const [, day, mon, yy] = oracleMatch;
    const mm = { JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",
                 JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12" }[mon.toUpperCase()];
    return mm ? `20${yy}-${mm}-${day}` : "";
  }
  const isoMatch = str.match(/(\d{4}-\d{2}-\d{2})/);
  return isoMatch ? isoMatch[1] : "";
};

const records = isDateRangeActive
  ? allRecords.filter((r) => {
      const d = toFilterDateStr(r.PRODUCTION_DATE);
      return d >= activeDateRange.from && d <= activeDateRange.to;
    })
  : allRecords;
  const deleteMutation = useDeleteEggProduction();

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete record?",
      description: `Are you sure you want to delete egg production record #${record.ID}? This action cannot be undone.`,
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

  const handleApplyDateFilter = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both from and to dates.");
      return;
    }
    if (fromDate > toDate) {
      toast.error("From date cannot be after To date.");
      return;
    }
    setActiveDateRange({ from: fromDate, to: toDate });
  };

  const handleClearDateFilter = () => {
    setFromDate("");
    setToDate("");
    setActiveDateRange({ from: "", to: "" });
  };

  const columns = [
    // {
    //   accessorKey: "ID",
    //   header: ({ column }) => (
    //     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
    //       ID <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   cell: ({ row }) => (
    //     <div className="font-mono text-sm ps-2 text-muted-foreground">{row.getValue("ID")}</div>
    //   ),
    // },
    {
      accessorKey: "PRODUCTION_DATE",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Production Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium ps-2">{formatDate(row.getValue("PRODUCTION_DATE"))}</div>
      ),
    },
    {
      accessorKey: "QTY",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantity <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold tabular-nums ps-2">
          {row.getValue("QTY")?.toLocaleString() ?? "—"}
        </div>
      ),
    },
    // {
    //   accessorKey: "CREATION_BY",
    //   header: "Created By",
    //   cell: ({ row }) => (
    //     <div className="text-muted-foreground">{row.getValue("CREATION_BY") || "—"}</div>
    //   ),
    // },
    {
      accessorKey: "CREATION_DATE",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-muted-foreground text-sm">{formatDate(row.getValue("CREATION_DATE"))}</div>
      ),
    },
    // {
    //   accessorKey: "UPDATE_DATE",
    //   header: "Updated At",
    //   cell: ({ row }) => (
    //     <div className="text-muted-foreground text-sm">{formatDate(row.getValue("UPDATE_DATE"))}</div>
    //   ),
    // },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Egg Production</h1>
            <Button disabled><IconCircleDashedPlus className="mr-1" />Add Record</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading egg production records...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Egg Production</h1>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Records</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load egg production records."}</p>
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

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Egg Production</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="space-y-4">

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            {/* Global Search */}
            <Input
              placeholder="Search records..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />

            {/* Date Range Filter */}
            <div className="flex items-end gap-2 flex-wrap">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-36"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-36"
                />
              </div>
              <Button variant="secondary" onClick={handleApplyDateFilter} disabled={isFetching}>
                <CalendarSearch className="h-4 w-4 mr-1" />
                Filter
              </Button>
              {isDateRangeActive && (
                <Button variant="ghost" size="icon" onClick={handleClearDateFilter} title="Clear date filter">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
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

          {/* Active date range badge */}
          {isDateRangeActive && (
            <p className="text-xs text-muted-foreground">
              Showing results from <strong>{activeDateRange.from}</strong> to <strong>{activeDateRange.to}</strong>
            </p>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id}>
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
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
                          <EmptyMedia variant="icon"><Egg /></EmptyMedia>
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
        <AddEggProductionSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateEggProductionSheet
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