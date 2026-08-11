import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, AlertCircle, RefreshCw, Users, UserX, UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

import { useEmployees, useDeactivateEmployee, useReactivateEmployee } from "./queries";
import AddEmployeeSheet from "./add-employee-sheet";
import UpdateEmployeeSheet from "./update-employee-sheet";

export default function EmployeeList() {
  const [sorting, setSorting] = useState([{ id: "FIRST_NAME", desc: false }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: records = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useEmployees(true);

  const deactivateMutation = useDeactivateEmployee();
  const reactivateMutation = useReactivateEmployee();

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateSheetOpen(true);
  };

  const handleDeactivate = async (record) => {
    const confirmed = await showConfirmation({
      title: "Deactivate employee?",
      description: `"${record.FIRST_NAME} ${record.LAST_NAME}" will no longer appear in meeting dropdowns. Existing meetings they're part of are unaffected.`,
      confirmText: "Deactivate",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (confirmed) {
      try {
        await deactivateMutation.mutateAsync(record.EMPLOYEE_ID);
        toast.success("Employee deactivated successfully!");
      } catch (err) {
        toast.error(err?.message || "Failed to deactivate employee. Please try again.");
      }
    }
  };

  const handleReactivate = async (record) => {
    try {
      await reactivateMutation.mutateAsync(record.EMPLOYEE_ID);
      toast.success("Employee reactivated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to reactivate employee. Please try again.");
    }
  };

  const columns = [
    {
      id: "NAME",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row) => `${row.FIRST_NAME} ${row.LAST_NAME}`,
      cell: ({ row }) => (
        <div className="ps-2 font-medium">{row.original.FIRST_NAME} {row.original.LAST_NAME}</div>
      ),
    },
    { accessorKey: "EMAIL", header: "Email", cell: ({ row }) => <div>{row.getValue("EMAIL")}</div> },
    { accessorKey: "JOB_TITLE", header: "Job title", cell: ({ row }) => <div>{row.getValue("JOB_TITLE") || "—"}</div> },
    { accessorKey: "DEPARTMENT_NAME", header: "Department", cell: ({ row }) => <div>{row.getValue("DEPARTMENT_NAME") || "—"}</div> },
    { accessorKey: "MANAGER_NAME", header: "Manager", cell: ({ row }) => <div>{row.getValue("MANAGER_NAME") || "—"}</div> },
    {
      accessorKey: "IS_ACTIVE",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("IS_ACTIVE") === "Y";
        return <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        const active = record.IS_ACTIVE === "Y";
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
              <IconEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            {active ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDeactivate(record)}
                disabled={deactivateMutation.isPending}
              >
                {deactivateMutation.isPending ? <Spinner className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                <span className="sr-only">Deactivate</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleReactivate(record)}
                disabled={reactivateMutation.isPending}
              >
                {reactivateMutation.isPending ? <Spinner className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                <span className="sr-only">Reactivate</span>
              </Button>
            )}
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
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  });

  if (isLoading) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Employees</h1>
            <Button disabled><IconCircleDashedPlus className="mr-1" />Add Record</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Employees</h1>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Employees</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load employees."}</p>
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
          <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Employees</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-md shadow-sm p-4">
        <div className="space-y-4">
          <Input
            placeholder="Search employees..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />

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
                          <EmptyMedia variant="icon"><Users /></EmptyMedia>
                          <EmptyTitle>No Employees Found</EmptyTitle>
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
        <AddEmployeeSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} />
      )}
      {isUpdateSheetOpen && (
        <UpdateEmployeeSheet
          open={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
          record={selectedRecord}
        />
      )}
      <ConfirmationDialog />
    </div>
  );
}