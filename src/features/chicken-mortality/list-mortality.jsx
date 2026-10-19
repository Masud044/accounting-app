import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, AlertCircle, RefreshCw, Trash2, ClipboardList, ShieldAlert } from "lucide-react";
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

import { CHICKEN_PERMS } from "../chicken-project/permissions";
import { useChickenProjectById, useChickenProjectDetails } from "../chicken-project/queries";
import { useMortalities, useDeleteMortality } from "./queries";
import MortalityHeaderSummaryCard from "./mortality-header-summary";
import AddMortalitySheet from "./add-mortality-sheet";
import UpdateMortalitySheet from "./update-mortality-sheet";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

const headerClass = "text-xs font-semibold text-gray-500 uppercase tracking-wider";

export default function MortalityList() {
  // route: chicken-project/:id/mortality/:detailId  (id = project/header id)
  const { id, detailId } = useParams();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions (parent chicken project er permission) ──
  const canView = useHasPermission(CHICKEN_PERMS.VIEW);
  const canCreate = useHasPermission(CHICKEN_PERMS.CREATE);
  const canEdit = useHasPermission(CHICKEN_PERMS.EDIT);
  const canDelete = useHasPermission(CHICKEN_PERMS.DELETE);

  const { data: project, isLoading: projectLoading } = useChickenProjectById(id);
  const { data: details = [], isLoading: detailsLoading } = useChickenProjectDetails(id);
  const detail = useMemo(
    () => details.find((d) => String(d.ID) === String(detailId)),
    [details, detailId]
  );

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMortalities(detailId);
  const deleteMutation = useDeleteMortality(detailId);

  const totalDied = useMemo(
    () => records.reduce((sum, r) => sum + Number(r.QTY || 0), 0),
    [records]
  );

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete mortality record?",
      description: `Are you sure you want to delete the record of ${record.QTY} chickens on ${formatDate(record.MORTALITY_DATE)}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.ID);
        toast.success("Mortality record deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete mortality record. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "MORTALITY_DATE",
      header: () => <div className={headerClass}>Date</div>,
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">{formatDate(row.getValue("MORTALITY_DATE"))}</div>
      ),
    },
    {
      accessorKey: "QTY",
      header: () => <div className={headerClass}>Chicken Died Quantity</div>,
      cell: ({ row }) => (
        <div className="font-mono text-sm font-semibold text-gray-900">
          {Number(row.getValue("QTY") || 0).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "REASON_NAME",
      header: () => <div className={headerClass}>Reason</div>,
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
          {row.getValue("REASON_NAME") || "—"}
        </span>
      ),
    },
    {
      accessorKey: "REMARKS",
      header: () => <div className={headerClass}>Remarks</div>,
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {row.getValue("REMARKS") || "—"}
        </div>
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

  // View permission na thakle kichui dekhabe na (shob hooks er pore early return)
  if (!canView) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
          <ShieldAlert className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700">Access denied</p>
          <p className="text-xs text-gray-400 mt-1">
            You don't have permission to view mortality records.
          </p>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
        </div>
      </div>
    );
  }

  const headerLoading = projectLoading || detailsLoading;

  // Detail load hoye gele-o record na thakle
  if (!headerLoading && !detail) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
          <AlertCircle className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700">Detail not found</p>
          <p className="text-xs text-gray-400 mt-1">
            This detail may have been deleted or does not belong to this batch.
          </p>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to details
        </Button>
      </div>

      {/* Header Card */}
      <MortalityHeaderSummaryCard
        project={project}
        detail={detail}
        totalDied={totalDied}
        isLoading={headerLoading}
      />

      {/* Mortality table card */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Mortality records</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Chickens that died in this detail, with the reason.
            </p>
          </div>
          {canCreate && (
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <IconCircleDashedPlus className="mr-1.5 h-4 w-4" /> Add Mortality
            </Button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {isError ? (
            <div className="rounded-lg bg-red-50 border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error Loading Mortality</h4>
                  <p className="text-sm text-red-600 mt-1">
                    {error?.message || "Failed to load mortality records."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <RefreshCw
                      className={`mr-2 h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
                    />
                    {isFetching ? "Retrying..." : "Retry"}
                  </Button>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner className="h-8 w-8 text-emerald-600 mb-3" />
              <p className="text-sm text-gray-400">Loading mortality records...</p>
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
                            <p className="text-sm font-medium text-gray-500">No mortality recorded</p>
                            {canCreate && (
                              <p className="text-xs text-gray-400">
                                Add a record when chickens die in this detail
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

      {isAddOpen && (
        <AddMortalitySheet
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          showConfirmation={showConfirmation}
          detailId={detailId}
        />
      )}
      {isUpdateOpen && (
        <UpdateMortalitySheet
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          detailId={detailId}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}