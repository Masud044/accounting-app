import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowUpDown, Trash2, AlertCircle, RefreshCw, ListChecks } from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";


import AddActivityLogSheet from "./add-activity-log-sheet";
import UpdateActivityLogSheet from "./update-activity-log-sheet";


import { useActivityLogsByDetailId, useDeleteActivityLog } from "./queries";


const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export default function ActivityLogList() {
  const { detailId } = useParams();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([{ id: "LOG_ID", desc: true }]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

 const { data: records = [], isLoading, isError, error, refetch, isFetching } = useActivityLogsByDetailId(detailId);


  const deleteMutation = useDeleteActivityLog(detailId);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmation({
      title: "Delete log?",
      description: `Are you sure you want to delete log #${record.LOG_ID}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteMutation.mutateAsync(record.LOG_ID);
        toast.success("Activity log deleted successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to delete log. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "ACTIVITY_DATE",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="ps-2">{formatDate(row.getValue("ACTIVITY_DATE"))}</div>,
    },
    {
      accessorKey: "ACTUAL_QTY",
      header: "Qty",
      cell: ({ row }) => (
        <div className="tabular-nums">{row.getValue("ACTUAL_QTY") != null ? Number(row.getValue("ACTUAL_QTY")).toLocaleString() : "—"}</div>
      ),
    },
    {
      accessorKey: "ACTUAL_COST",
      header: "Cost",
      cell: ({ row }) => (
        <div className="tabular-nums">{row.getValue("ACTUAL_COST") != null ? Number(row.getValue("ACTUAL_COST")).toLocaleString() : "—"}</div>
      ),
    },
    {
      accessorKey: "ACTUAL_REVENUE",
      header: "Revenue",
      cell: ({ row }) => (
        <div className="tabular-nums">{row.getValue("ACTUAL_REVENUE") != null ? Number(row.getValue("ACTUAL_REVENUE")).toLocaleString() : "—"}</div>
      ),
    },
    { accessorKey: "UNIT", header: "Unit", cell: ({ row }) => <div>{row.getValue("UNIT") || "—"}</div> },
    { accessorKey: "COMPLETED_BY", header: "Completed By", cell: ({ row }) => <div>{row.getValue("COMPLETED_BY") || "—"}</div> },
    {
      accessorKey: "COMPLETION_STATUS",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("COMPLETION_STATUS");
        return <Badge variant={status === "COMPLETED" ? "default" : "secondary"}>{status || "—"}</Badge>;
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
                  <IconEdit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(record)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
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
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading activity logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Logs</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load activity logs."}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
                {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Activity Log</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Log
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="space-y-4">
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
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon"><ListChecks /></EmptyMedia>
                          <EmptyTitle>No logs added yet</EmptyTitle>
                          <EmptyDescription>Add an activity log to get started.</EmptyDescription>
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

      {isAddSheetOpen && (
        <AddActivityLogSheet
          open={isAddSheetOpen}
          onOpenChange={setIsAddSheetOpen}
          showConfirmation={showConfirmation}
          detailId={detailId}
        />
      )}
      {isUpdateSheetOpen && (
        <UpdateActivityLogSheet
          open={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
          showConfirmation={showConfirmation}
          record={selectedRecord}
          detailId={detailId}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}