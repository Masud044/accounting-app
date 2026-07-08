import { useState } from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown, ChevronDown, Trash2, AlertCircle, RefreshCw, FileText,
} from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useInvoices, useDeleteInvoice } from "./queries";
import AddInvoiceSheet from "./create-sale-invoice-sheet";
// import InvoiceDetailSheet from "./sale-invoice-detail-page";
import EditInvoiceSheet from "./edit-sale-invoice-sheet";

const fmtDate = (val) => {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
};
const fmtAmt = (v) =>
    Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

export default function InvoiceList() {
  const [sorting,          setSorting]          = useState([]);
  const [columnFilters,    setColumnFilters]    = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection,     setRowSelection]     = useState({});
  const [globalFilter,     setGlobalFilter]     = useState("");

  const [isAddOpen,    setIsAddOpen]    = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedHid,  setSelectedHid]  = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { data: invoices = [], isLoading, isError, error, refetch, isFetching } = useInvoices();
  const deleteMutation = useDeleteInvoice();

  const handleView = (hid) => {
    setSelectedHid(hid);
    setIsDetailOpen(true);
  };

  const handleDelete = async (invoice) => {
    const confirmed = await showConfirmation({
      title: "Delete invoice?",
      description: `Delete invoice #${invoice.HID} for ${invoice.CUSTOMER_NAME}? This cannot be undone.`,
      confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(invoice.HID);
        toast.success("Invoice deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete invoice.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "HID",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Invoice # <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
     
      cell: ({ row }) => (
  <div className="font-mono text-sm ps-2 font-medium flex items-center gap-2">
    #{row.getValue("HID")}
    {Number(row.original.RECEIVE_CREATED) === 1 && (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold">
        Received
      </span>
    )}
  </div>
),
    },
    {
      accessorKey: "INVOICE_DATE",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Invoice Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ps-2">{fmtDate(row.getValue("INVOICE_DATE"))}</div>
      ),
    },


    
    {
      accessorKey: "CUSTOMER_NAME",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium ps-2">{row.getValue("CUSTOMER_NAME") || "—"}</div>
      ),
    },
    
    {
  accessorKey: "PRODUCTION_QTY",
  header: "Quantity (Eggs)",
  cell: ({ row }) => (
    <div className="tabular-nums text-left pr-4">
      {Number(row.getValue("PRODUCTION_QTY") || 0).toLocaleString()}
    </div>
  ),
},
    {
      accessorKey: "TOT_QTY",
      header: "Sales Qty",
      cell: ({ row }) => (
        <div className="tabular-nums text-left pr-4">
          {Number(row.getValue("TOT_QTY") || 0).toLocaleString()}
        </div>
      ),
    },
    //  {
    //   accessorKey: "TOT_QTY",
    //   header: "Total Qty",
    //   cell: ({ row }) => (
    //     <div className="tabular-nums text-left pr-4">
    //       {Number(row.getValue("TOT_QTY") || 0).toLocaleString()}
    //     </div>
    //   ),
    // },
    {
  accessorKey: "TOT_AMT",
  header: "Total Amount",
  cell: ({ row }) => (
    <div className="tabular-nums font-medium text-left pr-4 text-primary">
      {fmtAmt(row.getValue("TOT_AMT"))}
    </div>
  ),
},
    // {
    //   accessorKey: "CREATION_DATE",
    //   header: "Created At",
    //   cell: ({ row }) => (
    //     <div className="text-muted-foreground text-sm">
    //       {fmtDate(row.getValue("CREATION_DATE"))}
    //     </div>
    //   ),
    // },
  {
  id: "actions",
  header: "Actions",
  enableHiding: false,
  cell: ({ row }) => {
    const inv = row.original;
    const isLocked = Number(inv.RECEIVE_CREATED) === 1;
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost" size="icon" className="h-8 w-8"
          onClick={() => handleView(inv.HID)}
          disabled={isLocked}
          title={isLocked ? "Receive Voucher already created — locked" : "Edit"}
        >
          <IconEdit className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
        <Button
          variant="ghost" size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => handleDelete(inv)}
          disabled={deleteMutation.isPending || isLocked}
          title={isLocked ? "Receive Voucher already created — cannot delete" : "Delete"}
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
    data: invoices,
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
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Sales Invoices</h1>
            <Button disabled><IconCircleDashedPlus className="mr-1" />New Invoice</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading invoices...</p>
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
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Sales Invoices</h1>
            <Button onClick={() => setIsAddOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />New Invoice
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Invoices</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load invoices."}</p>
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
          <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Sales Invoices</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />New Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by customer, date..."
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
                          <EmptyMedia variant="icon"><FileText /></EmptyMedia>
                          <EmptyTitle>No Invoices Found</EmptyTitle>
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

      {isAddOpen && (
        <AddInvoiceSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
        />
      )}
      {isDetailOpen && (
  <EditInvoiceSheet
    open={isDetailOpen}
    onOpenChange={setIsDetailOpen}
    hid={selectedHid}
    showConfirmation={showConfirmation}
  />
)}
     
      <ConfirmationDialog />
    </div>
  );
}