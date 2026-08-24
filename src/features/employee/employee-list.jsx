// import { useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, AlertCircle, RefreshCw, Users, UserX, UserCheck } from "lucide-react";
// import { toast } from "react-toastify";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// import { useEmployees, useDeactivateEmployee, useReactivateEmployee } from "./queries";
// import AddEmployeeSheet from "./add-employee-sheet";
// import UpdateEmployeeSheet from "./update-employee-sheet";

// export default function EmployeeList() {
//   const [sorting, setSorting] = useState([{ id: "FIRST_NAME", desc: false }]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const {
//     data: records = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useEmployees(true);

//   const deactivateMutation = useDeactivateEmployee();
//   const reactivateMutation = useReactivateEmployee();

//   const handleEdit = (record) => {
//     setSelectedRecord(record);
//     setIsUpdateSheetOpen(true);
//   };

//   const handleDeactivate = async (record) => {
//     const confirmed = await showConfirmation({
//       title: "Deactivate employee?",
//       description: `"${record.FIRST_NAME} ${record.LAST_NAME}" will no longer appear in meeting dropdowns. Existing meetings they're part of are unaffected.`,
//       confirmText: "Deactivate",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });
//     if (confirmed) {
//       try {
//         await deactivateMutation.mutateAsync(record.EMPLOYEE_ID);
//         toast.success("Employee deactivated successfully!");
//       } catch (err) {
//         toast.error(err?.message || "Failed to deactivate employee. Please try again.");
//       }
//     }
//   };

//   const handleReactivate = async (record) => {
//     try {
//       await reactivateMutation.mutateAsync(record.EMPLOYEE_ID);
//       toast.success("Employee reactivated successfully!");
//     } catch (err) {
//       toast.error(err?.message || "Failed to reactivate employee. Please try again.");
//     }
//   };

//   const columns = [
//     {
//       id: "NAME",
//       header: ({ column }) => (
//         <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//           Name <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       ),
//       accessorFn: (row) => `${row.FIRST_NAME} ${row.LAST_NAME}`,
//       cell: ({ row }) => (
//         <div className="ps-2 font-medium">{row.original.FIRST_NAME} {row.original.LAST_NAME}</div>
//       ),
//     },
//     { accessorKey: "EMAIL", header: "Email", cell: ({ row }) => <div>{row.getValue("EMAIL")}</div> },
//     { accessorKey: "JOB_TITLE", header: "Job title", cell: ({ row }) => <div>{row.getValue("JOB_TITLE") || "—"}</div> },
//     { accessorKey: "DEPARTMENT_NAME", header: "Department", cell: ({ row }) => <div>{row.getValue("DEPARTMENT_NAME") || "—"}</div> },
//     { accessorKey: "MANAGER_NAME", header: "Manager", cell: ({ row }) => <div>{row.getValue("MANAGER_NAME") || "—"}</div> },
//     {
//       accessorKey: "IS_ACTIVE",
//       header: "Status",
//       cell: ({ row }) => {
//         const active = row.getValue("IS_ACTIVE") === "Y";
//         return <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>;
//       },
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const record = row.original;
//         const active = record.IS_ACTIVE === "Y";
//         return (
//           <div className="flex items-center gap-1">
//             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(record)}>
//               <IconEdit className="h-4 w-4" />
//               <span className="sr-only">Edit</span>
//             </Button>
//             {active ? (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 text-destructive hover:text-destructive"
//                 onClick={() => handleDeactivate(record)}
//                 disabled={deactivateMutation.isPending}
//               >
//                 {deactivateMutation.isPending ? <Spinner className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
//                 <span className="sr-only">Deactivate</span>
//               </Button>
//             ) : (
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => handleReactivate(record)}
//                 disabled={reactivateMutation.isPending}
//               >
//                 {reactivateMutation.isPending ? <Spinner className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
//                 <span className="sr-only">Reactivate</span>
//               </Button>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: records,
//     columns,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onGlobalFilterChange: setGlobalFilter,
//     state: { sorting, globalFilter },
//   });

//   if (isLoading) {
//     return (
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Employees</h1>
//             <Button disabled><IconCircleDashedPlus className="mr-1" />Add Record</Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">Loading employees...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div>
//         <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Employees</h1>
//             <Button onClick={() => setIsAddSheetOpen(true)}>
//               <IconCircleDashedPlus className="mr-1" />Add Record
//             </Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Employees</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load employees."}</p>
//               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//                 {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Employees</h1>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             <Button onClick={() => setIsAddSheetOpen(true)}>
//               <IconCircleDashedPlus className="mr-1" />Add Record
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="space-y-4">
//           <Input
//             placeholder="Search employees..."
//             value={globalFilter ?? ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             className="max-w-sm"
//           />

//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id}>
//                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id}>
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <Empty>
//                         <EmptyHeader>
//                           <EmptyMedia variant="icon"><Users /></EmptyMedia>
//                           <EmptyTitle>No Employees Found</EmptyTitle>
//                         </EmptyHeader>
//                       </Empty>
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <DataTablePagination table={table} />
//         </div>
//       </div>

//       {isAddSheetOpen && (
//         <AddEmployeeSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateEmployeeSheet
//           open={isUpdateSheetOpen}
//           onOpenChange={setIsUpdateSheetOpen}
//           record={selectedRecord}
//         />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, AlertCircle, RefreshCw, Users, UserX, UserCheck, Search } from "lucide-react";
import { toast } from "react-toastify";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Reusable sortable header — consistent uppercase gray style
const SortableHeader = ({ column, label }) => (
  <Button
    variant="ghost"
    className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label} <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
);

export default function EmployeeList() {
  const [sorting, setSorting] = useState([{ id: "NAME", desc: false }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
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

  // ── Unique employee names for the filter dropdown ─────────────────────────
  const employeeOptions = useMemo(() => {
    const names = new Set(
      records
        .map((r) => `${r.FIRST_NAME ?? ""} ${r.LAST_NAME ?? ""}`.trim())
        .filter((n) => n)
    );
    return Array.from(names).sort();
  }, [records]);

  // ── Unique department names for the filter dropdown ───────────────────────
  const departmentOptions = useMemo(() => {
    const names = new Set(
      records.map((r) => r.DEPARTMENT_NAME).filter((n) => n && String(n).trim())
    );
    return Array.from(names).sort();
  }, [records]);

  // ── Apply employee + department filters before passing data to the table ─
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const fullName = `${r.FIRST_NAME ?? ""} ${r.LAST_NAME ?? ""}`.trim();
      const matchEmployee = employeeFilter === "all" || fullName === employeeFilter;
      const matchDepartment = departmentFilter === "all" || r.DEPARTMENT_NAME === departmentFilter;
      return matchEmployee && matchDepartment;
    });
  }, [records, employeeFilter, departmentFilter]);

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
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      accessorFn: (row) => `${row.FIRST_NAME} ${row.LAST_NAME}`,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">{row.original.FIRST_NAME} {row.original.LAST_NAME}</div>
      ),
    },
    {
      accessorKey: "EMAIL",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</div>,
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("EMAIL")}</div>,
    },
    {
      accessorKey: "JOB_TITLE",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Title</div>,
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("JOB_TITLE") || "—"}</div>,
    },
    {
      accessorKey: "DEPARTMENT_NAME",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Department</div>,
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("DEPARTMENT_NAME") || "—"}</div>,
    },
    {
      accessorKey: "MANAGER_NAME",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Manager</div>,
      cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("MANAGER_NAME") || "—"}</div>,
    },
    {
      accessorKey: "IS_ACTIVE",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</div>,
      cell: ({ row }) => {
        const active = row.getValue("IS_ACTIVE") === "Y";
        return (
          <Badge
            className={
              active
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }
          >
            {active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const record = row.original;
        const active = record.IS_ACTIVE === "Y";
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
              onClick={() => handleEdit(record)}
            >
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
                className="h-8 w-8 hover:bg-green-50 hover:text-green-700"
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
    data: filteredRecords,
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
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-sm text-gray-500">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
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
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
              <Users size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Employees</h2>
              <p className="text-xs text-gray-400">{filteredRecords.length} of {records.length} employees</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddSheetOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Record
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Search + Employee filter + Department filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
              />
            </div>

            <div className="w-full sm:w-56">
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-violet-300">
                  <SelectValue placeholder="All employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employeeOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-56">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-violet-300">
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departmentOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
                        <TableCell key={cell.id} className="text-sm text-gray-700">
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