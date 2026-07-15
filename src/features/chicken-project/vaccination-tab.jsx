import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, Syringe } from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
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
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { useChickenProjectVaccination, useDeleteVaccination } from "./queries";
import AddVaccinationSheet from "./add-vaccination-sheet";
import UpdateVaccinationSheet from "./update-vaccination-sheet";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

// Next dose due within 7 days gets flagged
const isDueSoon = (val) => {
  if (!val) return false;
  const due = new Date(val);
  const diffDays = (due - new Date()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
};

export default function VaccinationTab({ hid }) {
const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading } = useChickenProjectVaccination(hid);
  const deleteMutation = useDeleteVaccination(hid);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete vaccination record?",
      description: `Are you sure you want to delete this vaccination record (${record.VACCIN_NAME})? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Vaccination record deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete vaccination record. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "VACCIN_NAME",
      header: "Vaccine",
      cell: ({ row }) => <div className="font-semibold ps-2">{row.getValue("VACCIN_NAME")}</div>,
    },
    {
      accessorKey: "DOSES",
      header: "Doses",
      cell: ({ row }) => <div>{row.getValue("DOSES") || "—"}</div>,
    },
    {
      accessorKey: "VACCIN_DATE",
      header: "Vaccination Date",
      cell: ({ row }) => <div>{formatDate(row.getValue("VACCIN_DATE"))}</div>,
    },
    {
      accessorKey: "NEXT_VACCIN_DATE",
      header: "Next Due",
      cell: ({ row }) => {
        const val = row.getValue("NEXT_VACCIN_DATE");
        return (
          <div className="flex items-center gap-2">
            {formatDate(val)}
            {isDueSoon(val) && <Badge variant="destructive" className="text-xs">Due soon</Badge>}
          </div>
        );
      },
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
        <p className="text-sm text-muted-foreground">Loading vaccination records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <IconCircleDashedPlus className="mr-1 h-4 w-4" /> Add Vaccination
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
                      <EmptyMedia variant="icon"><Syringe /></EmptyMedia>
                      <EmptyTitle>No vaccination records yet</EmptyTitle>
                      <EmptyDescription>Add the first vaccine record for this batch.</EmptyDescription>
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
        <AddVaccinationSheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          hid={hid}
        />
      )}
      {isUpdateOpen && (
        <UpdateVaccinationSheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          hid={hid}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}