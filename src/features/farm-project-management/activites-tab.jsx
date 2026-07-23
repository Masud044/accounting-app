import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, ListChecks } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { useFarmProjectActivities, useFarmProjectPhases, useDeleteFarmProjectActivity } from "./queries";
import AddActivitySheet from "./add-activites-sheet";
import UpdateActivitySheet from "./update-activites-sheet";

const statusVariant = (status) => {
  if (status === "ACTIVE") return "default";
  if (status === "COMPLETE" || status === "COMPLETED") return "secondary";
  if (status === "CANCELLED") return "destructive";
  return "outline";
};

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export default function ActivitiesTab({ projectId }) {
  const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const { data: records = [], isLoading } = useFarmProjectActivities(projectId);
  const { data: phases = [] } = useFarmProjectPhases(projectId);
  const deleteMutation = useDeleteFarmProjectActivity(projectId);

  const phaseNameById = useMemo(
    () => Object.fromEntries(phases.map((p) => [p.PHASE_ID, p.PHASE_NAME])),
    [phases]
  );

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete activity?",
      description: `Are you sure you want to delete "${record.ACTIVITY_NAME}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ACTIVITY_ID);
        toast.success("Activity deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete activity. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "ACTIVITY_NAME",
      header: "Activity",
      cell: ({ row }) => <div className=" ps-2">{row.getValue("ACTIVITY_NAME")}</div>,
    },
    {
      accessorKey: "PHASE_ID",
      header: "Phase",
      cell: ({ row }) => <div>{phaseNameById[row.getValue("PHASE_ID")] || "—"}</div>,
    },
    {
      accessorKey: "PLAN_START_DATE",
      header: "Plan Start",
      cell: ({ row }) => <div>{formatDate(row.getValue("PLAN_START_DATE"))}</div>,
    },
    {
      accessorKey: "PLAN_END_DATE",
      header: "Plan End",
      cell: ({ row }) => <div>{formatDate(row.getValue("PLAN_END_DATE"))}</div>,
    },
    {
      accessorKey: "STATUS",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.getValue("STATUS"))}>{row.getValue("STATUS")}</Badge>
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
        <p className="text-sm text-muted-foreground">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setIsAddOpen(true)} disabled={phases.length === 0}>
          <IconCircleDashedPlus className="mr-1 h-4 w-4" /> Add Activity
        </Button>
      </div>
      {phases.length === 0 && (
        <p className="text-sm text-muted-foreground">Add a phase first before adding activities.</p>
      )}

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
                      <EmptyMedia variant="icon"><ListChecks /></EmptyMedia>
                      <EmptyTitle>No activities added yet</EmptyTitle>
                      <EmptyDescription>Add the first activity for this project.</EmptyDescription>
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
        <AddActivitySheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          projectId={projectId}
          phases={phases}
        />
      )}
      {isUpdateOpen && (
        <UpdateActivitySheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          projectId={projectId}
          phases={phases}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}