import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, RefreshCw, BookOpen, AlertCircle } from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useProjectChartAccounts, useOtherChartAccounts } from "./queries";

// Level badge colors
// const LEVEL_COLORS = {
//   1: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
//   2: "bg-blue-100   text-blue-800   dark:bg-blue-900/30   dark:text-blue-300",
//   3: "bg-teal-100   text-teal-800   dark:bg-teal-900/30   dark:text-teal-300",
//   4: "bg-amber-100  text-amber-800  dark:bg-amber-900/30  dark:text-amber-300",
// };

export default function ChartListView() {
  const [sorting, setSorting]                   = useState([]);
  const [columnFilters, setColumnFilters]       = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter]         = useState("");
  const [activeTab, setActiveTab]               = useState("project");

  const {
    data: projectAccounts = [],
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
    refetch: refetchProject,
    isFetching: isProjectFetching,
  } = useProjectChartAccounts();

  const {
    data: otherAccounts = [],
    isLoading: isOtherLoading,
    isError: isOtherError,
    error: otherError,
    refetch: refetchOther,
    isFetching: isOtherFetching,
  } = useOtherChartAccounts();

  const isLoading  = isProjectLoading || isOtherLoading;
  const isError    = isProjectError || isOtherError;
  const error      = projectError || otherError;
  const isFetching = isProjectFetching || isOtherFetching;

  const refetch = () => {
    refetchProject();
    refetchOther();
  };

  const activeData = activeTab === "project" ? projectAccounts : otherAccounts;

  const columns = [
    // ── Account ID ───────────────────────────────────────────────────────────
    {
      accessorKey: "ACCOUNT_ID",
      header: ({ column }) => (
        <Button
           variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account ID <ArrowUpDown className="ml-2 font-medium h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.getValue("ACCOUNT_ID")}
        </span>
      ),
    },

    // ── Account Name (indent by level) ────────────────────────────────────────
    {
      accessorKey: "ACCOUNT_NAME",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const level  = row.getValue("LEBEL") ?? 1;
        const name   = String(row.getValue("ACCOUNT_NAME") ?? "").trim();
        const indent = (level - 1) * 16;
        return (
          <span className="font-medium block" style={{ paddingLeft: `${indent}px` }}>
            {name || "—"}
          </span>
        );
      },
      filterFn: (row, _, filterValue) =>
        String(row.getValue("ACCOUNT_NAME"))
          .trim()
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
    },

    // ── Root Account ─────────────────────────────────────────────────────────
    {
      accessorKey: "ROOT_ACCOUNT",
      header: "Root",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("ROOT_ACCOUNT") || "—"}
        </Badge>
      ),
    },

    // ── Level ────────────────────────────────────────────────────────────────
    {
      accessorKey: "LEBEL",
      header: "Level",
      cell: ({ row }) => {
        const lvl = row.getValue("LEBEL");
        return (
          <span
            // className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            //   LEVEL_COLORS[lvl] ?? "bg-gray-100 text-gray-800"
            // }`}
          >
            L{lvl}
          </span>
        );
      },
    },

    // ── Is Leaf ──────────────────────────────────────────────────────────────
    {
      accessorKey: "IS_LEAF",
      header: "Type",
      cell: ({ row }) => {
        const isLeaf = row.getValue("IS_LEAF") === 1;
        return (
          <Badge variant={isLeaf ? "success" : "secondary"}>
            {isLeaf ? "Leaf" : "Parent"}
          </Badge>
        );
      },
    },

    // ── Full Path ────────────────────────────────────────────────────────────
    {
      accessorKey: "FULL_PATH",
      header: "Full Path",
      cell: ({ row }) => {
        const path = String(row.getValue("FULL_PATH") ?? "").replace(/^\s*>\s*/, "");
        return (
          <span >
            {path || "—"}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: activeData,
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
    autoResetPageIndex: false,
    enableMultiSort: false,
  });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
            Chart of Account
          </h1>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
            Chart of Account
          </h1>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Accounts</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load accounts."}</p>
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

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className=" rounded-lg shadow-md p-4 mt-2">
      {/* Header */}
     
       

      {/* Table + Tabs */}
      <div >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
          <TabsList className="">
            <TabsTrigger value="project"  className="font-semibold data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
              Project ({projectAccounts.length})
            </TabsTrigger>
            <TabsTrigger value="others" className="font-semibold data-[state=active]:bg-emerald-700 data-[state=active]:text-white">
              Others ({otherAccounts.length})
            </TabsTrigger>
          </TabsList>
             <h1 className="mb-[-10] font-semibold text-center"> Chart of Account</h1>

          <TabsContent value={activeTab} className="space-y-4 mt-4 ">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by name or account ID..."
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
                    .filter((col) => col.getCanHide())
                    .map((col) => (
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
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader >
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>
                          {h.isPlaceholder
                            ? null
                            : flexRender(h.column.columnDef.header, h.getContext())}
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
                            <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
                            <EmptyTitle>No Accounts Found</EmptyTitle>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <DataTablePagination table={table} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}