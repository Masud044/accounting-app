import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, ClipboardList, ShieldAlert } from "lucide-react";
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
import { useHasPermission } from "@/hooks/use-permission";

import { MORTALITY_REASON_PERMS } from "./permission";
import { useMortalityReasons, useDeleteMortalityReason } from "./queries";
import AddReasonDialog from "./add-reason-dialog";
import UpdateReasonDialog from "./update-reason-dialog";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

const headerClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

export default function ReasonList() {
  const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions (chicken project er permission reuse) ──
  const canView = useHasPermission(MORTALITY_REASON_PERMS.VIEW);
  const canCreate = useHasPermission(MORTALITY_REASON_PERMS.CREATE);
  const canEdit = useHasPermission(MORTALITY_REASON_PERMS.EDIT);
  const canDelete = useHasPermission(MORTALITY_REASON_PERMS.DELETE);

  const { data: records = [], isLoading } = useMortalityReasons();
  const deleteMutation = useDeleteMortalityReason();

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete reason?",
      description: `Are you sure you want to delete "${record.REASON_NAME}"? A reason already used in mortality records cannot be deleted.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Reason deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete reason. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "REASON_NAME",
      header: () => <div className={headerClass}>Reason</div>,
      cell: ({ row }) => (
        <div className="text-sm font-medium text-gray-900">{row.getValue("REASON_NAME")}</div>
      ),
    },
    {
      accessorKey: "CREATION_DATE",
      header: () => <div className={headerClass}>Created</div>,
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{formatDate(row.getValue("CREATION_DATE"))}</div>
      ),
    },
    ...(canEdit || canDelete
      ? [
          {
            id: "actions",
            header: () => <div className={`text-right ${headerClass}`}>Actions</div>,
            enableHiding: false,
            cell: ({ row }) => {
              const record = row.original;
              return (
                <div className="flex items-center justify-end gap-1">
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
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
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600 text-gray-400"
                      onClick={() => handleDelete(record)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  if (!canView) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
          <ShieldAlert className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700">Access denied</p>
          <p className="text-xs text-gray-400 mt-1">
            You don't have permission to view mortality reasons.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Mortality reasons</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Reasons available when recording chicken mortality.
            </p>
          </div>
          {canCreate && (
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Reason
            </Button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner className="h-8 w-8 text-emerald-600 mb-3" />
              <p className="text-sm text-gray-400">Loading reasons...</p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <Table>
                  <TableHeader className="bg-gray-50">
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((h) => (
                          <TableHead key={h.id} className="py-2.5">
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
                        <TableRow key={row.id} className="hover:bg-gray-50/70 transition-colors">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-2.5">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <ClipboardList className="h-10 w-10 text-gray-300" />
                            <p className="text-sm font-medium text-gray-500">No reasons added yet</p>
                            {canCreate && (
                              <p className="text-xs text-gray-400">
                                Add a reason to use it in mortality records
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination table={table} />
            </>
          )}
        </div>
      </div>

      {isAddOpen && <AddReasonDialog open={isAddOpen} onOpenChange={setIsAddOpen} />}
      {isUpdateOpen && (
        <UpdateReasonDialog
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          record={selectedRecord}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}