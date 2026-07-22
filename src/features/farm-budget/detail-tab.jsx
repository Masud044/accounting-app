import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, ClipboardList } from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { useFarmBudgetDetails, useDeleteFarmBudgetDetail } from "./queries";
import AddFarmBudgetDetailSheet from "./add-detail-sheet";
import UpdateFarmBudgetDetailSheet from "./update-detail-sheet";

const MONTH_NAMES = ["", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function DetailsTab({ budgetId }) {
  const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading } = useFarmBudgetDetails(budgetId);
  const deleteMutation = useDeleteFarmBudgetDetail(budgetId);

  const totalAmount = useMemo(
    () => records.reduce((sum, r) => sum + Number(r.BUDGET_AMOUNT || 0), 0),
    [records]
  );

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete expense line?",
      description: `Are you sure you want to delete this expense line? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.BUDGET_DETAIL_ID);
        toast.success("Expense line deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete expense line. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "FARM_TYPE",
      header: "Farm Type",
      cell: ({ row }) => <div className="ps-2">{row.getValue("FARM_TYPE") || "—"}</div>,
    },
    {
      accessorKey: "EXPENSE_HEAD",
      header: "Expense Head",
      cell: ({ row }) => <div>{row.getValue("EXPENSE_HEAD") || "—"}</div>,
    },
    {
      accessorKey: "BUDGET_MONTH",
      header: "Month",
      cell: ({ row }) => {
        const m = row.getValue("BUDGET_MONTH");
        return <div>{MONTH_NAMES[Number(m)] || "—"}</div>;
      },
    },
    {
      accessorKey: "EXPENSE_CODE",
      header: "Expense Code",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("EXPENSE_CODE") || "—"}</div>,
    },
    {
      accessorKey: "BUDGET_AMOUNT",
      header: "Amount",
      cell: ({ row }) => (
        <div className="tabular-nums font-medium">
          {Number(row.getValue("BUDGET_AMOUNT") || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="h-8 w-8 mb-3" />
        <p className="text-sm text-muted-foreground">Loading expense lines...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total budgeted:{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </p>
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <IconCircleDashedPlus className="mr-1 h-4 w-4" /> Add Line
        </Button>
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
                      <EmptyMedia variant="icon"><ClipboardList /></EmptyMedia>
                      <EmptyTitle>No expense lines added yet</EmptyTitle>
                      <EmptyDescription>Add a budget line item to get started.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      {isAddOpen && (
        <AddFarmBudgetDetailSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          budgetId={budgetId}
        />
      )}
      {isUpdateOpen && (
        <UpdateFarmBudgetDetailSheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          budgetId={budgetId}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}