import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, Target } from "lucide-react";
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

import { useFarmKpiTargets, useDeleteKpiTarget } from "./queries";
import AddKpiSheet from "./add-kpi-sheet";
import UpdateKpiSheet from "./update-kpi-sheet";

export default function KpiTargetsTab({ calendarId }) {
  const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading } = useFarmKpiTargets(calendarId);
  const deleteMutation = useDeleteKpiTarget(calendarId);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete KPI target?",
      description: `Are you sure you want to delete "${record.KPI_NAME}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.KPI_ID);
        toast.success("KPI target deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete KPI target. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "KPI_NAME",
      header: "KPI Name",
      cell: ({ row }) => <div className="font-semibold ps-2">{row.getValue("KPI_NAME")}</div>,
    },
    {
      accessorKey: "FARM_TYPE",
      header: "Farm Type",
      cell: ({ row }) => <div>{row.getValue("FARM_TYPE") || "—"}</div>,
    },
    {
      accessorKey: "TARGET_VALUE",
      header: "Target",
      cell: ({ row }) => <div className="tabular-nums">{row.getValue("TARGET_VALUE") ?? "—"}</div>,
    },
    {
      accessorKey: "UNIT",
      header: "Unit",
      cell: ({ row }) => <div>{row.getValue("UNIT") || "—"}</div>,
    },
    {
      accessorKey: "ACTUAL_VALUE",
      header: "Actual",
      cell: ({ row }) => <div className="tabular-nums">{row.getValue("ACTUAL_VALUE") ?? "—"}</div>,
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
        <p className="text-sm text-muted-foreground">Loading KPI targets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <IconCircleDashedPlus className="mr-1 h-4 w-4" /> Add KPI Target
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
                      <EmptyMedia variant="icon"><Target /></EmptyMedia>
                      <EmptyTitle>No KPI targets added yet</EmptyTitle>
                      <EmptyDescription>Add the first KPI target for this calendar.</EmptyDescription>
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
        <AddKpiSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          calendarId={calendarId}
        />
      )}
      {isUpdateOpen && (
        <UpdateKpiSheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          calendarId={calendarId}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}