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
  AlertCircle,
  RefreshCw,
  Calculator,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

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
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useTrialBalance } from "./queries";

// ── Number formatter ─────────────────────────────────────────────────────────
const fmt = (val) =>
  Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function TrialBalanceList() {
  const [sorting, setSorting] = useState([{ id: "CODE", desc: false }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applied, setApplied] = useState(null);

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTrialBalance(applied);

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    setApplied({ fromDate, toDate });
  };

  const totals = useMemo(() => {
    if (!records.length) return null;
    return records.reduce(
      (acc, r) => ({
        openingDr: acc.openingDr + Number(r.OPENING_DR || 0),
        openingCr: acc.openingCr + Number(r.OPENING_CR || 0),
        periodDr: acc.periodDr + Number(r.PERIOD_DR || 0),
        periodCr: acc.periodCr + Number(r.PERIOD_CR || 0),
        closingDr: acc.closingDr + Number(r.CLOSING_DR || 0),
        closingCr: acc.closingCr + Number(r.CLOSING_CR || 0),
      }),
      { openingDr: 0, openingCr: 0, periodDr: 0, periodCr: 0, closingDr: 0, closingCr: 0 }
    );
  }, [records]);

  // ── Excel export ─────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    if (!records.length) return;

    const exportData = records.map((r) => ({
      "Code": r.CODE,
      "Account Name": r.ACCOUNT_NAME,
      "Opening Dr": Number(r.OPENING_DR || 0),
      "Opening Cr": Number(r.OPENING_CR || 0),
      "Period Dr": Number(r.PERIOD_DR || 0),
      "Period Cr": Number(r.PERIOD_CR || 0),
      "Closing Dr": Number(r.CLOSING_DR || 0),
      "Closing Cr": Number(r.CLOSING_CR || 0),
    }));

    if (totals) {
      exportData.push({
        "Code": "",
        "Account Name": "TOTAL",
        "Opening Dr": totals.openingDr,
        "Opening Cr": totals.openingCr,
        "Period Dr": totals.periodDr,
        "Period Cr": totals.periodCr,
        "Closing Dr": totals.closingDr,
        "Closing Cr": totals.closingCr,
      });
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 14 }, { wch: 35 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

    const fileName = `Trial_Balance_${applied.fromDate}_to_${applied.toDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const columns = [
    {
      accessorKey: "CODE",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Code <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm ps-2 font-medium">{row.getValue("CODE")}</div>
      ),
    },
    {
      accessorKey: "ACCOUNT_NAME",
      header: "Account Name",
      cell: ({ row }) => (
        <div className="ps-2">{row.getValue("ACCOUNT_NAME")}</div>
      ),
    },
    {
      accessorKey: "OPENING_DR",
      header: ({ column }) => (
        <Button variant="ghost" className="w-full justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Opening Dr <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{fmt(row.getValue("OPENING_DR"))}</div>
      ),
    },
    {
      accessorKey: "OPENING_CR",
      header: () => <div className="text-right pe-4">Opening Cr</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{fmt(row.getValue("OPENING_CR"))}</div>
      ),
    },
    {
      accessorKey: "PERIOD_DR",
      header: () => <div className="text-right pe-4">Period Dr</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{fmt(row.getValue("PERIOD_DR"))}</div>
      ),
    },
    {
      accessorKey: "PERIOD_CR",
      header: () => <div className="text-right pe-4">Period Cr</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums">{fmt(row.getValue("PERIOD_CR"))}</div>
      ),
    },
    {
      accessorKey: "CLOSING_DR",
      header: ({ column }) => (
        <Button variant="ghost" className="w-full justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Closing Dr <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right tabular-nums font-medium">{fmt(row.getValue("CLOSING_DR"))}</div>
      ),
    },
    {
      accessorKey: "CLOSING_CR",
      header: () => <div className="text-right pe-4">Closing Cr</div>,
      cell: ({ row }) => (
        <div className="text-right tabular-nums font-medium">{fmt(row.getValue("CLOSING_CR"))}</div>
      ),
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
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
  });

  // ── Filter bar (always visible) ───────────────────────────────────────────
  const FilterBar = (
    <div className="bg-card rounded-md shadow-sm p-4 mb-4 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Trial Balance</h1>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">From Date</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">To Date</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
          </div>
          <Button onClick={handleGenerate} disabled={!fromDate || !toDate}>
            <Calculator className="mr-1 h-4 w-4" /> Generate
          </Button>
          {applied && (
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
          )}
          {applied && records?.length > 0 && (
            <Button variant="outline" onClick={handleExportExcel}>
              <FileSpreadsheet className="mr-1 h-4 w-4" /> Excel
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // ── Not yet generated ───────────────────────────────────────────────────────
  if (!applied) {
    return (
      <div>
        {FilterBar}
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><Calculator /></EmptyMedia>
              <EmptyTitle>Date range select kore Generate button e click korun</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        {FilterBar}
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Trial balance generate kora hocche...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div>
        {FilterBar}
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Report</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load trial balance."}</p>
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
      {FilterBar}

      {/* Print header — only visible on print */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-xl font-bold">Trial Balance</h1>
        <p className="text-sm text-muted-foreground">
          {applied.fromDate} to {applied.toDate}
        </p>
      </div>

      {/* Summary cards */}
      {totals && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 print:hidden">
          <div className="bg-card rounded-md shadow-sm p-4">
            <p className="text-sm text-muted-foreground">Opening (Dr / Cr)</p>
            <p className="text-lg font-semibold tabular-nums">{fmt(totals.openingDr)} / {fmt(totals.openingCr)}</p>
          </div>
          <div className="bg-card rounded-md shadow-sm p-4">
            <p className="text-sm text-muted-foreground">Period (Dr / Cr)</p>
            <p className="text-lg font-semibold tabular-nums">{fmt(totals.periodDr)} / {fmt(totals.periodCr)}</p>
          </div>
          <div className="bg-card rounded-md shadow-sm p-4">
            <p className="text-sm text-muted-foreground">Closing (Dr / Cr)</p>
            <p className="text-lg font-semibold tabular-nums">{fmt(totals.closingDr)} / {fmt(totals.closingCr)}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 print:hidden">
            <Input
              placeholder="Search account..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
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
          </div>

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
                    <TableRow key={row.id}>
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
                          <EmptyMedia variant="icon"><Calculator /></EmptyMedia>
                          <EmptyTitle>No Records Found</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="print:hidden">
            <DataTablePagination table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}