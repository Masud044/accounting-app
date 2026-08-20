// // src\features\users\module\module-list.jsx
// import { useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Trash2, AlertCircle, RefreshCw, LayoutGrid } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
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
// import { IconEdit, IconPlus } from "@tabler/icons-react";
// import {
//   Empty,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@/components/ui/empty";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Link, useNavigate } from "react-router"; // Added useNavigate

// import { useModules, useDeleteModule } from "./queries";
// // Removed: import AddModuleDialog from "./add-module-dialog";
// // Removed: import UpdateModuleDialog from "./update-module-dialog";
// import CustomDataTableColumnHeader from "@/components/shared/custom-data-table-column-header";
// import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";

// export default function ModuleList() {
//   const navigate = useNavigate(); // Added for routing
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
  
//   // Removed Dialog states: isAddDialogOpen, isUpdateDialogOpen, selectedModule

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const {
//     data: rawModules = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useModules();

//   const modulesData = rawModules;

//   const deleteModuleMutation = useDeleteModule();

//   // Updated to navigate to the edit page instead of opening a dialog
//   const handleEdit = (module) => {
//     navigate(`/dashboard/module/${module.ID}/edit`);
//   };

//   const handleDelete = async (module) => {
//     const confirmed = await showConfirmation({
//       title: "Delete module?",
//       description: `Are you sure you want to delete "${module.MODULE_NAME}"? This will also affect all permissions under this module.`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });

//     if (confirmed) {
//       try {
//         await deleteModuleMutation.mutateAsync(module.ID);
//         toast.success("Module deleted successfully!");
//       } catch (error) {
//         toast.error(error?.message || "Failed to delete module. Please try again.");
//       }
//     }
//   };

//   const columns = [
//     {
//       accessorKey: "SEQUENCE_NO",
//       header: ({ column }) => (
//         <CustomDataTableColumnHeader column={column} title="Seq." />
//       ),
//       cell: ({ row }) => (
//         <div className="text-center text-muted-foreground w-10">
//           {row.getValue("SEQUENCE_NO") ?? "—"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "MODULE_NAME",
//       header: ({ column }) => (
//         <CustomDataTableColumnHeader column={column} title="Module Name" />
//       ),
//       cell: ({ row }) => (
//         <div className="font-medium ps-2">{row.getValue("MODULE_NAME")}</div>
//       ),
//     },
//     {
//       accessorKey: "DESCRIPTION",
//       header: ({ column }) => (
//         <CustomDataTableColumnHeader column={column} title="Description" />
//       ),
//       cell: ({ row }) => (
//         <div className="text-muted-foreground">{row.getValue("DESCRIPTION") || "—"}</div>
//       ),
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const module = row.original;

//         return (
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8"
//               onClick={() => handleEdit(module)} // Now navigates
//             >
//               <IconEdit className="h-4 w-4" />
//               <span className="sr-only">Edit</span>
//             </Button>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-destructive hover:text-destructive"
//               onClick={() => handleDelete(module)}
//               disabled={deleteModuleMutation.isPending}
//             >
//               {deleteModuleMutation.isPending ? (
//                 <Spinner data-icon="inline-start" />
//               ) : (
//                 <Trash2 className="h-4 w-4" />
//               )}
//               <span className="sr-only">Delete</span>
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: modulesData,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onGlobalFilterChange: setGlobalFilter,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       globalFilter,
//     },
//   });

//   if (isLoading) {
//     return (
//       <div>
//         <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Modules</h1>
//             </div>
//           </div>
//         </div>
//         <div className="bg-card rounded-md shadow-sm p-4">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-12 w-12 mb-4" />
//             <p className="text-muted-foreground">Loading modules...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div>
//         <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Modules</h1>
//             </div>
//             {/* Updated to navigate */}
//             <Button onClick={() => navigate("/dashboard/module/create")}>
//               <IconPlus />
//               Add Module
//             </Button>
//           </div>
//         </div>
//         <div className="bg-card rounded-md shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Modules</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load modules. Please try again."}</p>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => refetch()}
//                 disabled={isFetching}
//                 className="w-fit"
//               >
//                 {isFetching ? (
//                   <>
//                     <Spinner className="mr-2 h-4 w-4" />
//                     Retrying...
//                   </>
//                 ) : (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4" />
//                     Retry
//                   </>
//                 )}
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="space-y-0.5">
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Modules</h1>
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     <Link to="/dashboard">Dashboard</Link>
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>User Management</BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Modules</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
//                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> 
//               <span className="sr-only">Refresh data</span>
//             </Button>

//             {/* Updated to navigate */}
//             <Button onClick={() => navigate("/dashboard/module/create")}>
//               <IconPlus />
//               Add Module
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="space-y-4">
//           <CustomDataTableToolbar table={table} searchPlaceholder="Search modules..." />

//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead key={header.id}>
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(header.column.columnDef.header, header.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>

//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
//                           <EmptyMedia variant="icon">
//                             <LayoutGrid />
//                           </EmptyMedia>
//                           <EmptyTitle>No Modules Found</EmptyTitle>
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

//       {/* Removed Dialog Render Blocks:
//          {isAddDialogOpen && ...}
//          {isUpdateDialogOpen && ...}
//       */}

//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2, AlertCircle, RefreshCw, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router";

import { useModules, useDeleteModule } from "./queries";
import CustomDataTableColumnHeader from "@/components/shared/custom-data-table-column-header";
import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";

export default function ModuleList() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const { data: modulesData = [], isLoading, isError, error, refetch, isFetching } = useModules();
  const deleteModuleMutation = useDeleteModule();

  const handleEdit = (module) => navigate(`/dashboard/module/${module.ID}/edit`);

  const handleDelete = async (module) => {
    const confirmed = await showConfirmation({
      title: "Delete module?",
      description: `Are you sure you want to delete "${module.MODULE_NAME}"? This will also affect all permissions under this module.`,
      confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteModuleMutation.mutateAsync(module.ID);
        toast.success("Module deleted successfully!");
      } catch (error) {
        toast.error(error?.message || "Failed to delete module. Please try again.");
      }
    }
  };

  const columns = [
    {
      accessorKey: "SEQUENCE_NO",
      header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Seq." />,
      cell: ({ row }) => (
        <div className="text-center text-sm text-gray-500 w-10">{row.getValue("SEQUENCE_NO") ?? "—"}</div>
      ),
    },
    {
      accessorKey: "MODULE_NAME",
      header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Module Name" />,
      cell: ({ row }) => (
        <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("MODULE_NAME")}</div>
      ),
    },
    {
      accessorKey: "DESCRIPTION",
      header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.getValue("DESCRIPTION") || "—"}</div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const module = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
              onClick={() => handleEdit(module)}
            >
              <IconEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost" size="icon" className="h-8 w-8  hover:text-destructive"
              onClick={() => handleDelete(module)}
              disabled={deleteModuleMutation.isPending}
            >
              {deleteModuleMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: modulesData,
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

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 mb-3" />
            <p className="text-sm text-gray-500">Loading modules...</p>
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
          <AlertTitle>Error Loading Modules</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load modules. Please try again."}</p>
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
              <LayoutGrid size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Modules</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild><Link to="/dashboard" className="text-xs text-gray-400">Dashboard</Link></BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className="text-xs text-gray-400">User Management</BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage className="text-xs text-gray-400">Modules</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh data</span>
            </Button>
            <Button onClick={() => navigate("/dashboard/module/create")}>
              <IconPlus />
              Add Module
            </Button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <CustomDataTableToolbar table={table} searchPlaceholder="Search modules..." />

          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                     <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide [&_button]:uppercase [&_button]:text-xs [&_button]:font-semibold [&_button]:text-gray-500">
  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
</TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
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
                          <EmptyMedia variant="icon"><LayoutGrid /></EmptyMedia>
                          <EmptyTitle>No Modules Found</EmptyTitle>
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

      <ConfirmationDialog />
    </div>
  );
}