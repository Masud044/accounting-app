// // // // src\features\users\module\module-list.jsx
// // // import { useState } from "react";
// // // import {
// // //   flexRender,
// // //   getCoreRowModel,
// // //   getFilteredRowModel,
// // //   getPaginationRowModel,
// // //   getSortedRowModel,
// // //   useReactTable,
// // // } from "@tanstack/react-table";
// // // import { Trash2, AlertCircle, RefreshCw, LayoutGrid } from "lucide-react";
// // // import { toast } from "sonner";

// // // import { Button } from "@/components/ui/button";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import { DataTablePagination } from "@/components/DataTablePagination";
// // // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // // import { Spinner } from "@/components/ui/spinner";
// // // import { IconEdit, IconPlus } from "@tabler/icons-react";
// // // import {
// // //   Empty,
// // //   EmptyHeader,
// // //   EmptyMedia,
// // //   EmptyTitle,
// // // } from "@/components/ui/empty";
// // // import {
// // //   Breadcrumb,
// // //   BreadcrumbItem,
// // //   BreadcrumbLink,
// // //   BreadcrumbList,
// // //   BreadcrumbPage,
// // //   BreadcrumbSeparator,
// // // } from "@/components/ui/breadcrumb";
// // // import { Link, useNavigate } from "react-router"; // Added useNavigate

// // // import { useModules, useDeleteModule } from "./queries";
// // // // Removed: import AddModuleDialog from "./add-module-dialog";
// // // // Removed: import UpdateModuleDialog from "./update-module-dialog";
// // // import CustomDataTableColumnHeader from "@/components/shared/custom-data-table-column-header";
// // // import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";

// // // export default function ModuleList() {
// // //   const navigate = useNavigate(); // Added for routing
// // //   const [sorting, setSorting] = useState([]);
// // //   const [columnFilters, setColumnFilters] = useState([]);
// // //   const [columnVisibility, setColumnVisibility] = useState({});
// // //   const [rowSelection, setRowSelection] = useState({});
// // //   const [globalFilter, setGlobalFilter] = useState("");
  
// // //   // Removed Dialog states: isAddDialogOpen, isUpdateDialogOpen, selectedModule

// // //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

// // //   const {
// // //     data: rawModules = [],
// // //     isLoading,
// // //     isError,
// // //     error,
// // //     refetch,
// // //     isFetching,
// // //   } = useModules();

// // //   const modulesData = rawModules;

// // //   const deleteModuleMutation = useDeleteModule();

// // //   // Updated to navigate to the edit page instead of opening a dialog
// // //   const handleEdit = (module) => {
// // //     navigate(`/dashboard/module/${module.ID}/edit`);
// // //   };

// // //   const handleDelete = async (module) => {
// // //     const confirmed = await showConfirmation({
// // //       title: "Delete module?",
// // //       description: `Are you sure you want to delete "${module.MODULE_NAME}"? This will also affect all permissions under this module.`,
// // //       confirmText: "Delete",
// // //       cancelText: "Cancel",
// // //       variant: "destructive",
// // //     });

// // //     if (confirmed) {
// // //       try {
// // //         await deleteModuleMutation.mutateAsync(module.ID);
// // //         toast.success("Module deleted successfully!");
// // //       } catch (error) {
// // //         toast.error(error?.message || "Failed to delete module. Please try again.");
// // //       }
// // //     }
// // //   };

// // //   const columns = [
// // //     {
// // //       accessorKey: "SEQUENCE_NO",
// // //       header: ({ column }) => (
// // //         <CustomDataTableColumnHeader column={column} title="Seq." />
// // //       ),
// // //       cell: ({ row }) => (
// // //         <div className="text-center text-muted-foreground w-10">
// // //           {row.getValue("SEQUENCE_NO") ?? "—"}
// // //         </div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "MODULE_NAME",
// // //       header: ({ column }) => (
// // //         <CustomDataTableColumnHeader column={column} title="Module Name" />
// // //       ),
// // //       cell: ({ row }) => (
// // //         <div className="font-medium ps-2">{row.getValue("MODULE_NAME")}</div>
// // //       ),
// // //     },
// // //     {
// // //       accessorKey: "DESCRIPTION",
// // //       header: ({ column }) => (
// // //         <CustomDataTableColumnHeader column={column} title="Description" />
// // //       ),
// // //       cell: ({ row }) => (
// // //         <div className="text-muted-foreground">{row.getValue("DESCRIPTION") || "—"}</div>
// // //       ),
// // //     },
// // //     {
// // //       id: "actions",
// // //       header: "Actions",
// // //       enableHiding: false,
// // //       cell: ({ row }) => {
// // //         const module = row.original;

// // //         return (
// // //           <div className="flex items-center gap-1">
// // //             <Button
// // //               variant="ghost"
// // //               size="icon"
// // //               className="h-8 w-8"
// // //               onClick={() => handleEdit(module)} // Now navigates
// // //             >
// // //               <IconEdit className="h-4 w-4" />
// // //               <span className="sr-only">Edit</span>
// // //             </Button>

// // //             <Button
// // //               variant="ghost"
// // //               size="icon"
// // //               className="h-8 w-8 text-destructive hover:text-destructive"
// // //               onClick={() => handleDelete(module)}
// // //               disabled={deleteModuleMutation.isPending}
// // //             >
// // //               {deleteModuleMutation.isPending ? (
// // //                 <Spinner data-icon="inline-start" />
// // //               ) : (
// // //                 <Trash2 className="h-4 w-4" />
// // //               )}
// // //               <span className="sr-only">Delete</span>
// // //             </Button>
// // //           </div>
// // //         );
// // //       },
// // //     },
// // //   ];

// // //   const table = useReactTable({
// // //     data: modulesData,
// // //     columns,
// // //     onSortingChange: setSorting,
// // //     onColumnFiltersChange: setColumnFilters,
// // //     getCoreRowModel: getCoreRowModel(),
// // //     getPaginationRowModel: getPaginationRowModel(),
// // //     getSortedRowModel: getSortedRowModel(),
// // //     getFilteredRowModel: getFilteredRowModel(),
// // //     onColumnVisibilityChange: setColumnVisibility,
// // //     onRowSelectionChange: setRowSelection,
// // //     onGlobalFilterChange: setGlobalFilter,
// // //     state: {
// // //       sorting,
// // //       columnFilters,
// // //       columnVisibility,
// // //       rowSelection,
// // //       globalFilter,
// // //     },
// // //   });

// // //   if (isLoading) {
// // //     return (
// // //       <div>
// // //         <div className="bg-card rounded-md shadow-sm p-4 mb-4">
// // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //             <div>
// // //               <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Modules</h1>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div className="bg-card rounded-md shadow-sm p-4">
// // //           <div className="flex flex-col items-center justify-center py-16">
// // //             <Spinner className="h-12 w-12 mb-4" />
// // //             <p className="text-muted-foreground">Loading modules...</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (isError) {
// // //     return (
// // //       <div>
// // //         <div className="bg-card rounded-md shadow-sm p-4 mb-4">
// // //           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //             <div>
// // //               <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Modules</h1>
// // //             </div>
// // //             {/* Updated to navigate */}
// // //             <Button onClick={() => navigate("/dashboard/module/create")}>
// // //               <IconPlus />
// // //               Add Module
// // //             </Button>
// // //           </div>
// // //         </div>
// // //         <div className="bg-card rounded-md shadow-sm p-4">
// // //           <Alert variant="destructive">
// // //             <AlertCircle className="h-4 w-4" />
// // //             <AlertTitle>Error Loading Modules</AlertTitle>
// // //             <AlertDescription className="mt-2 flex flex-col gap-2">
// // //               <p>{error?.message || "Failed to load modules. Please try again."}</p>
// // //               <Button
// // //                 variant="outline"
// // //                 size="sm"
// // //                 onClick={() => refetch()}
// // //                 disabled={isFetching}
// // //                 className="w-fit"
// // //               >
// // //                 {isFetching ? (
// // //                   <>
// // //                     <Spinner className="mr-2 h-4 w-4" />
// // //                     Retrying...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <RefreshCw className="mr-2 h-4 w-4" />
// // //                     Retry
// // //                   </>
// // //                 )}
// // //               </Button>
// // //             </AlertDescription>
// // //           </Alert>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div>
// // //       {/* Header */}
// // //       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
// // //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //           <div className="space-y-0.5">
// // //             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Modules</h1>
// // //             <Breadcrumb>
// // //               <BreadcrumbList>
// // //                 <BreadcrumbItem>
// // //                   <BreadcrumbLink asChild>
// // //                     <Link to="/dashboard">Dashboard</Link>
// // //                   </BreadcrumbLink>
// // //                 </BreadcrumbItem>
// // //                 <BreadcrumbSeparator />
// // //                 <BreadcrumbItem>User Management</BreadcrumbItem>
// // //                 <BreadcrumbSeparator />
// // //                 <BreadcrumbItem>
// // //                   <BreadcrumbPage>Modules</BreadcrumbPage>
// // //                 </BreadcrumbItem>
// // //               </BreadcrumbList>
// // //             </Breadcrumb>
// // //           </div>

// // //           <div className="flex items-center gap-2">
// // //             <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
// // //                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> 
// // //               <span className="sr-only">Refresh data</span>
// // //             </Button>

// // //             {/* Updated to navigate */}
// // //             <Button onClick={() => navigate("/dashboard/module/create")}>
// // //               <IconPlus />
// // //               Add Module
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Table */}
// // //       <div className="bg-card rounded-md shadow-sm p-4">
// // //         <div className="space-y-4">
// // //           <CustomDataTableToolbar table={table} searchPlaceholder="Search modules..." />

// // //           <div className="overflow-hidden rounded-md border">
// // //             <Table>
// // //               <TableHeader>
// // //                 {table.getHeaderGroups().map((headerGroup) => (
// // //                   <TableRow key={headerGroup.id}>
// // //                     {headerGroup.headers.map((header) => (
// // //                       <TableHead key={header.id}>
// // //                         {header.isPlaceholder
// // //                           ? null
// // //                           : flexRender(header.column.columnDef.header, header.getContext())}
// // //                       </TableHead>
// // //                     ))}
// // //                   </TableRow>
// // //                 ))}
// // //               </TableHeader>

// // //               <TableBody>
// // //                 {table.getRowModel().rows?.length ? (
// // //                   table.getRowModel().rows.map((row) => (
// // //                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
// // //                       {row.getVisibleCells().map((cell) => (
// // //                         <TableCell key={cell.id}>
// // //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
// // //                         </TableCell>
// // //                       ))}
// // //                     </TableRow>
// // //                   ))
// // //                 ) : (
// // //                   <TableRow>
// // //                     <TableCell colSpan={columns.length} className="h-24 text-center">
// // //                       <Empty>
// // //                         <EmptyHeader>
// // //                           <EmptyMedia variant="icon">
// // //                             <LayoutGrid />
// // //                           </EmptyMedia>
// // //                           <EmptyTitle>No Modules Found</EmptyTitle>
// // //                         </EmptyHeader>
// // //                       </Empty>
// // //                     </TableCell>
// // //                   </TableRow>
// // //                 )}
// // //               </TableBody>
// // //             </Table>
// // //           </div>

// // //           <DataTablePagination table={table} />
// // //         </div>
// // //       </div>

// // //       {/* Removed Dialog Render Blocks:
// // //          {isAddDialogOpen && ...}
// // //          {isUpdateDialogOpen && ...}
// // //       */}

// // //       <ConfirmationDialog />
// // //     </div>
// // //   );
// // // }

// // import { useState } from "react";
// // import {
// //   flexRender,
// //   getCoreRowModel,
// //   getFilteredRowModel,
// //   getPaginationRowModel,
// //   getSortedRowModel,
// //   useReactTable,
// // } from "@tanstack/react-table";
// // import { Trash2, AlertCircle, RefreshCw, LayoutGrid } from "lucide-react";
// // import { toast } from "sonner";

// // import { Button } from "@/components/ui/button";
// // import {
// //   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// // } from "@/components/ui/table";
// // import { DataTablePagination } from "@/components/DataTablePagination";
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // import { Spinner } from "@/components/ui/spinner";
// // import { IconEdit, IconPlus } from "@tabler/icons-react";
// // import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// // import {
// //   Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb";
// // import { Link, useNavigate } from "react-router";

// // import { useModules, useDeleteModule } from "./queries";
// // import CustomDataTableColumnHeader from "@/components/shared/custom-data-table-column-header";
// // import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";

// // export default function ModuleList() {
// //   const navigate = useNavigate();
// //   const [sorting, setSorting] = useState([]);
// //   const [columnFilters, setColumnFilters] = useState([]);
// //   const [columnVisibility, setColumnVisibility] = useState({});
// //   const [rowSelection, setRowSelection] = useState({});
// //   const [globalFilter, setGlobalFilter] = useState("");

// //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
// //   const { data: modulesData = [], isLoading, isError, error, refetch, isFetching } = useModules();
// //   const deleteModuleMutation = useDeleteModule();

// //   const handleEdit = (module) => navigate(`/dashboard/module/${module.ID}/edit`);

// //   const handleDelete = async (module) => {
// //     const confirmed = await showConfirmation({
// //       title: "Delete module?",
// //       description: `Are you sure you want to delete "${module.MODULE_NAME}"? This will also affect all permissions under this module.`,
// //       confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
// //     });
// //     if (confirmed) {
// //       try {
// //         await deleteModuleMutation.mutateAsync(module.ID);
// //         toast.success("Module deleted successfully!");
// //       } catch (error) {
// //         toast.error(error?.message || "Failed to delete module. Please try again.");
// //       }
// //     }
// //   };

// //   const columns = [
// //     {
// //       accessorKey: "SEQUENCE_NO",
// //       header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Seq." />,
// //       cell: ({ row }) => (
// //         <div className="text-center text-sm text-gray-500 w-10">{row.getValue("SEQUENCE_NO") ?? "—"}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "MODULE_NAME",
// //       header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Module Name" />,
// //       cell: ({ row }) => (
// //         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("MODULE_NAME")}</div>
// //       ),
// //     },
// //     {
// //       accessorKey: "DESCRIPTION",
// //       header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Description" />,
// //       cell: ({ row }) => (
// //         <div className="text-sm text-gray-500">{row.getValue("DESCRIPTION") || "—"}</div>
// //       ),
// //     },
// //     {
// //       id: "actions",
// //       header: () => (
// //         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
// //       ),
// //       enableHiding: false,
// //       cell: ({ row }) => {
// //         const module = row.original;
// //         return (
// //           <div className="flex items-center gap-1">
// //             <Button
// //               variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
// //               onClick={() => handleEdit(module)}
// //             >
// //               <IconEdit className="h-4 w-4" />
// //               <span className="sr-only">Edit</span>
// //             </Button>
// //             <Button
// //               variant="ghost" size="icon" className="h-8 w-8  hover:text-destructive"
// //               onClick={() => handleDelete(module)}
// //               disabled={deleteModuleMutation.isPending}
// //             >
// //               {deleteModuleMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
// //               <span className="sr-only">Delete</span>
// //             </Button>
// //           </div>
// //         );
// //       },
// //     },
// //   ];

// //   const table = useReactTable({
// //     data: modulesData,
// //     columns,
// //     onSortingChange: setSorting,
// //     onColumnFiltersChange: setColumnFilters,
// //     getCoreRowModel: getCoreRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     onColumnVisibilityChange: setColumnVisibility,
// //     onRowSelectionChange: setRowSelection,
// //     onGlobalFilterChange: setGlobalFilter,
// //     state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
// //   });

// //   if (isLoading) {
// //     return (
// //       <div className="p-4 md:p-6">
// //         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
// //           <div className="flex flex-col items-center justify-center py-16">
// //             <Spinner className="h-10 w-10 mb-3" />
// //             <p className="text-sm text-gray-500">Loading modules...</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isError) {
// //     return (
// //       <div className="p-4 md:p-6">
// //         <Alert variant="destructive">
// //           <AlertCircle className="h-4 w-4" />
// //           <AlertTitle>Error Loading Modules</AlertTitle>
// //           <AlertDescription className="mt-2 flex flex-col gap-2">
// //             <p>{error?.message || "Failed to load modules. Please try again."}</p>
// //             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
// //               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
// //             </Button>
// //           </AlertDescription>
// //         </Alert>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-6">
// //       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
// //         {/* Header */}
// //         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
// //           <div className="flex items-center gap-2">
// //             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
// //               <LayoutGrid size={16} />
// //             </div>
// //             <div>
// //               <h1 className="text-sm font-bold text-gray-900">Modules</h1>
// //               <Breadcrumb>
// //                 <BreadcrumbList>
// //                   <BreadcrumbItem>
// //                     <BreadcrumbLink asChild><Link to="/dashboard" className="text-xs text-gray-400">Dashboard</Link></BreadcrumbLink>
// //                   </BreadcrumbItem>
// //                   <BreadcrumbSeparator />
// //                   <BreadcrumbItem className="text-xs text-gray-400">User Management</BreadcrumbItem>
// //                   <BreadcrumbSeparator />
// //                   <BreadcrumbItem><BreadcrumbPage className="text-xs text-gray-400">Modules</BreadcrumbPage></BreadcrumbItem>
// //                 </BreadcrumbList>
// //               </Breadcrumb>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
// //               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
// //               <span className="sr-only">Refresh data</span>
// //             </Button>
// //             <Button onClick={() => navigate("/dashboard/module/create")}>
// //               <IconPlus />
// //               Add Module
// //             </Button>
// //           </div>
// //         </div>

// //         <div className="p-5 space-y-4">
// //           <CustomDataTableToolbar table={table} searchPlaceholder="Search modules..." />

// //           <div className="overflow-hidden rounded-md border border-gray-200">
// //             <Table>
// //               <TableHeader className="bg-gray-50">
// //                 {table.getHeaderGroups().map((headerGroup) => (
// //                   <TableRow key={headerGroup.id}>
// //                     {headerGroup.headers.map((header) => (
// //                      <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide [&_button]:uppercase [&_button]:text-xs [&_button]:font-semibold [&_button]:text-gray-500">
// //   {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
// // </TableHead>
// //                     ))}
// //                   </TableRow>
// //                 ))}
// //               </TableHeader>
// //               <TableBody>
// //                 {table.getRowModel().rows?.length ? (
// //                   table.getRowModel().rows.map((row) => (
// //                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
// //                       {row.getVisibleCells().map((cell) => (
// //                         <TableCell key={cell.id} className="text-sm text-gray-700">
// //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                         </TableCell>
// //                       ))}
// //                     </TableRow>
// //                   ))
// //                 ) : (
// //                   <TableRow>
// //                     <TableCell colSpan={columns.length} className="h-24 text-center">
// //                       <Empty>
// //                         <EmptyHeader>
// //                           <EmptyMedia variant="icon"><LayoutGrid /></EmptyMedia>
// //                           <EmptyTitle>No Modules Found</EmptyTitle>
// //                         </EmptyHeader>
// //                       </Empty>
// //                     </TableCell>
// //                   </TableRow>
// //                 )}
// //               </TableBody>
// //             </Table>
// //           </div>

// //           <DataTablePagination table={table} />
// //         </div>
// //       </div>

// //       <ConfirmationDialog />
// //     </div>
// //   );
// // }

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
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { IconEdit, IconPlus } from "@tabler/icons-react";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import {
//   Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Link, useNavigate } from "react-router";
// import { useHasPermission } from "@/hooks/use-permission";

// import { useModules, useDeleteModule } from "./queries";
// import CustomDataTableColumnHeader from "@/components/shared/custom-data-table-column-header";
// import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";

// export default function ModuleList() {
//   const navigate = useNavigate();
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("MODULE_CREATE");
//   const canEdit = useHasPermission("MODULE_EDIT");
//   const canDelete = useHasPermission("MODULE_DELETE");

//   const { data: modulesData = [], isLoading, isError, error, refetch, isFetching } = useModules();
//   const deleteModuleMutation = useDeleteModule();

//   const handleEdit = (module) => navigate(`/dashboard/module/${module.ID}/edit`);

//   const handleDelete = async (module) => {
//     const confirmed = await showConfirmation({
//       title: "Delete module?",
//       description: `Are you sure you want to delete "${module.MODULE_NAME}"? This will also affect all permissions under this module.`,
//       confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
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
//       header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Seq." />,
//       cell: ({ row }) => (
//         <div className="text-center text-sm text-gray-500 w-10">{row.getValue("SEQUENCE_NO") ?? "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "MODULE_NAME",
//       header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Module Name" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("MODULE_NAME")}</div>
//       ),
//     },
//     {
//       accessorKey: "DESCRIPTION",
//       header: ({ column }) => <CustomDataTableColumnHeader column={column} title="Description" />,
//       cell: ({ row }) => (
//         <div className="text-sm text-gray-500">{row.getValue("DESCRIPTION") || "—"}</div>
//       ),
//     },
//     {
//       id: "actions",
//       header: () => (
//         <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>
//       ),
//       enableHiding: false,
//       cell: ({ row }) => {
//         const module = row.original;
//         return (
//           <div className="flex items-center gap-1">
//             {canEdit && (
//               <Button
//                 variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
//                 onClick={() => handleEdit(module)}
//               >
//                 <IconEdit className="h-4 w-4" />
//                 <span className="sr-only">Edit</span>
//               </Button>
//             )}
//             {canDelete && (
//               <Button
//                 variant="ghost" size="icon" className="h-8 w-8  hover:text-destructive"
//                 onClick={() => handleDelete(module)}
//                 disabled={deleteModuleMutation.isPending}
//               >
//                 {deleteModuleMutation.isPending ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
//                 <span className="sr-only">Delete</span>
//               </Button>
//             )}
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
//     state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
//   });

//   if (isLoading) {
//     return (
//       <div className="p-4 md:p-6">
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 mb-3" />
//             <p className="text-sm text-gray-500">Loading modules...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="p-4 md:p-6">
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Modules</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load modules. Please try again."}</p>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
//               <LayoutGrid size={16} />
//             </div>
//             <div>
//               <h1 className="text-sm font-bold text-gray-900">Modules</h1>
//               <Breadcrumb>
//                 <BreadcrumbList>
//                   <BreadcrumbItem>
//                     <BreadcrumbLink asChild><Link to="/dashboard" className="text-xs text-gray-400">Dashboard</Link></BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbItem className="text-xs text-gray-400">User Management</BreadcrumbItem>
//                   <BreadcrumbSeparator />
//                   <BreadcrumbItem><BreadcrumbPage className="text-xs text-gray-400">Modules</BreadcrumbPage></BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh data</span>
//             </Button>
//             {canCreate && (
//               <Button onClick={() => navigate("/dashboard/module/create")}>
//                 <IconPlus />
//                 Add Module
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           <CustomDataTableToolbar table={table} searchPlaceholder="Search modules..." />

//           <div className="overflow-hidden rounded-md border border-gray-200">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => (
//                       <TableHead key={header.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide [&_button]:uppercase [&_button]:text-xs [&_button]:font-semibold [&_button]:text-gray-500">
//                         {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50/70 transition-colors">
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} className="text-sm text-gray-700">
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
//                           <EmptyMedia variant="icon"><LayoutGrid /></EmptyMedia>
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

//       <ConfirmationDialog />
//     </div>
//   );
// }

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle, ArrowDown, ArrowUp, ChevronDown, LayoutGrid, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { create } from "zustand";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router";
import { useHasPermission } from "@/hooks/use-permission";

import { useModules, useDeleteModule } from "./queries";
import CustomDataTableToolbar from "@/components/shared/custom-data-table-toolbar";

/* ═════════════ active row store (one id at a time) ═════════════ */
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
  clear: () => set({ activeId: null }),
}));

/* ═════════════ helpers ═════════════ */
// Container-width switch: table → rows (measured on the table's own container, not the viewport)
function useCompact(threshold = 800) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width > 0 && width < threshold];
}

const Dash = () => <span className="text-gray-400">—</span>;

function IconTip({ label, children, side = "top" }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}

// Ellipsis for long text; tooltip appears ONLY when the text is actually cut off.
function TruncatedText({ children, className }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      open={open}
      onOpenChange={(next) => {
        const el = ref.current;
        setOpen(next && !!el && el.scrollWidth > el.clientWidth);
      }}
    >
      <TooltipTrigger asChild>
        <span ref={ref} className={cn("block truncate", className)}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" className="max-w-xs break-words">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

function TextCell({ value, className }) {
  if (value === null || value === undefined || value === "") return <Dash />;
  return <TruncatedText className={className}>{String(value)}</TruncatedText>;
}

// Numbers never truncate. Real 0 shows "0", missing shows "—".
function NumCell({ value }) {
  if (value === null || value === undefined || value === "") return <Dash />;
  return <span>{value}</span>;
}

// Sort arrow only on the active column.
function SortHeader({ column, label }) {
  const sorted = column.getIsSorted();
  const Icon = sorted === "asc" ? ArrowUp : ArrowDown;
  const tip =
    sorted === "asc"
      ? "Sorted ascending. Click to sort descending."
      : sorted === "desc"
      ? "Sorted descending. Click to sort ascending."
      : `Sort by ${label.toLowerCase().replace(/\.$/, "")}`;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className="inline-flex items-center gap-1 rounded-sm uppercase tracking-wide hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          {label}
          {sorted && <Icon className="h-3 w-3" aria-hidden="true" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">{tip}</TooltipContent>
    </Tooltip>
  );
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}

/* ═════════════ desktop table ═════════════ */
const headCell = (align) =>
  cn(
    "sticky top-0 z-20 h-12 whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500",
    align === "right" ? "text-right" : "text-left"
  );

const bodyCell = (align) =>
  cn(
    "h-12 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-gray-700",
    align === "right" && "text-right tabular-nums"
  );

function DesktopTable({ table, rows, isLoading, empty, activeId, toggle }) {
  const leafColumns = table.getVisibleLeafColumns();
  return (
    // single scroll container with bounded height → header stays pinned on vertical scroll
    <div className="max-h-[calc(100dvh-12rem)] overflow-auto rounded-md border border-gray-200">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const meta = h.column.columnDef.meta ?? {};
                const sorted = h.column.getIsSorted();
                return (
                  <th
                    key={h.id}
                    scope="col"
                    aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                    className={cn(headCell(meta.align), meta.width)}
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="[&_tr:last-child>td]:border-b-0">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="h-12">
                {leafColumns.map((col) => {
                  const meta = col.columnDef.meta ?? {};
                  return (
                    <td key={col.id} className={bodyCell(meta.align)}>
                      <Skeleton className={cn("h-4", meta.skeleton ?? "w-24", meta.align === "right" && "ml-auto")} />
                    </td>
                  );
                })}
              </tr>
            ))
          ) : rows.length ? (
            rows.map((row) => {
              const active = activeId === row.id;
              return (
                <tr
                  key={row.id}
                  tabIndex={0}
                  aria-current={active ? "true" : undefined}
                  onClick={() => toggle(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target === e.currentTarget) {
                      e.preventDefault();
                      toggle(row.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400",
                    active ? "bg-violet-100" : "hover:bg-gray-50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta ?? {};
                    return (
                      <td key={cell.id} className={bodyCell(meta.align)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={leafColumns.length} className="h-64 text-center">
                <EmptyState {...empty} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ═════════════ phone rows ═════════════ */
function MobileList({ table, rows, isLoading, empty, mobile, mobileSort }) {
  const [openId, setOpenId] = useState(null); // one row open at a time

  const s = table.getState().sorting[0];
  const current = mobileSort.find(
    (o) => o.sorting[0].id === s?.id && !!o.sorting[0].desc === !!s?.desc
  );

  return (
    <div>
      {/* sorting lives in a control above the list */}
      <div className="mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 w-full justify-between bg-white border-gray-200">
              <span>Sort: {current?.label ?? "Default"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={current?.key ?? ""}
              onValueChange={(key) => {
                const opt = mobileSort.find((o) => o.key === key);
                if (opt) table.setSorting(opt.sorting);
              }}
            >
              {mobileSort.map((o) => (
                <DropdownMenuRadioItem key={o.key} value={o.key} className="min-h-11">
                  {o.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ul className="divide-y divide-gray-100 overflow-hidden rounded-md border border-gray-200 bg-white">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex min-h-[64px] flex-col justify-center gap-2 px-4 py-3">
              <div className="flex items-center justify-between gap-6">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-48" />
            </li>
          ))
        ) : rows.length ? (
          rows.map((row) => {
            const m = mobile(row.original);
            const open = openId === row.id;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`row-detail-${row.id}`}
                  onClick={() => setOpenId(open ? null : row.id)}
                  className="flex min-h-[44px] w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="line-clamp-2 text-sm font-medium text-gray-800">{m.title}</span>
                      {m.state && <span className="max-w-[50%] shrink-0">{m.state}</span>}
                    </div>
                    {m.secondary && (
                      <div className="mt-1 line-clamp-2 break-all text-xs text-gray-500">{m.secondary}</div>
                    )}
                  </div>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ease-out motion-reduce:transition-none",
                      open && "rotate-180"
                    )}
                  />
                </button>

                <div
                  id={`row-detail-${row.id}`}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
                    open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 px-4 pb-4">
                      {m.fields.length > 0 && (
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                          {m.fields.map((f) => (
                            <div key={f.label} className={cn("min-w-0", f.wide && "col-span-2")}>
                              <dt className="text-xs text-gray-400">{f.label}</dt>
                              <dd className="break-words text-gray-700">{f.value || "—"}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {m.actions && <div className="flex gap-2">{m.actions}</div>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="py-10">
            <EmptyState {...empty} />
          </li>
        )}
      </ul>
    </div>
  );
}

const MOBILE_SORT = [
  { key: "seq-asc", label: "Sequence (low to high)", sorting: [{ id: "SEQUENCE_NO", desc: false }] },
  { key: "seq-desc", label: "Sequence (high to low)", sorting: [{ id: "SEQUENCE_NO", desc: true }] },
  { key: "name-asc", label: "Name A–Z", sorting: [{ id: "MODULE_NAME", desc: false }] },
  { key: "name-desc", label: "Name Z–A", sorting: [{ id: "MODULE_NAME", desc: true }] },
];

/* ═════════════ page ═════════════ */
export default function ModuleList() {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const [gridRef, compact] = useCompact();
  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);
  const clearActive = useActiveRowStore((s) => s.clear);
  useEffect(() => () => clearActive(), [clearActive]);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("MODULE_CREATE");
  const canEdit = useHasPermission("MODULE_EDIT");
  const canDelete = useHasPermission("MODULE_DELETE");

  const { data: modulesData = [], isLoading, isError, error, refetch, isFetching } = useModules();
  const deleteModuleMutation = useDeleteModule();
  // spinner only on the row being deleted; other delete buttons are just disabled meanwhile
  const deletingId = deleteModuleMutation.isPending ? deleteModuleMutation.variables : null;

  const handleEdit = (mod) => navigate(`/dashboard/module/${mod.ID}/edit`);

  const handleDelete = async (mod) => {
    const confirmed = await showConfirmation({
      title: "Delete module?",
      description: `Are you sure you want to delete "${mod.MODULE_NAME}"? This will also affect all permissions under this module.`,
      confirmText: "Delete", cancelText: "Cancel", variant: "destructive",
    });
    if (confirmed) {
      try {
        await deleteModuleMutation.mutateAsync(mod.ID);
        toast.success("Module deleted successfully!");
      } catch (error) {
        toast.error(error?.message || "Failed to delete module. Please try again.");
      }
    }
  };

  const columns = [
    {
      // number → right-aligned, tabular figures, never truncated
      accessorKey: "SEQUENCE_NO",
      header: ({ column }) => <SortHeader column={column} label="Seq." />,
      cell: ({ row }) => <NumCell value={row.getValue("SEQUENCE_NO")} />,
      meta: { align: "right", width: "w-[88px]", skeleton: "w-6" },
    },
    {
      accessorKey: "MODULE_NAME",
      header: ({ column }) => <SortHeader column={column} label="Module Name" />,
      cell: ({ row }) => (
        <TextCell value={row.getValue("MODULE_NAME")} className="font-medium text-gray-800" />
      ),
      meta: { width: "w-[260px]", skeleton: "w-36" },
    },
    {
      // flexible column: absorbs the slack
      accessorKey: "DESCRIPTION",
      header: ({ column }) => <SortHeader column={column} label="Description" />,
      cell: ({ row }) => <TextCell value={row.getValue("DESCRIPTION")} className="text-gray-500" />,
      meta: { skeleton: "w-56" },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      meta: { width: "w-[110px]", skeleton: "w-14" },
      cell: ({ row }) => {
        const mod = row.original;
        const deleting = deletingId === mod.ID;
        return (
          <div className="flex items-center gap-1">
            {canEdit && (
              <IconTip label="Edit module">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit module"
                  className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
                  onClick={(e) => {
                    e.stopPropagation(); // never toggles the row highlight
                    handleEdit(mod);
                  }}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
              </IconTip>
            )}
            {canDelete && (
              <IconTip label="Delete module">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete module"
                  className="h-8 w-8 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(mod);
                  }}
                  disabled={deleteModuleMutation.isPending}
                >
                  {deleting ? <Spinner data-icon="inline-start" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </IconTip>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: modulesData,
    columns,
    getRowId: (row, index) => String(row.ID ?? index),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
  });

  const rows = table.getRowModel().rows;

  const empty = globalFilter
    ? {
        icon: LayoutGrid,
        title: "No matching modules",
        description: "Try a different search term.",
        action: (
          <Button variant="outline" size="sm" onClick={() => setGlobalFilter("")}>
            Clear search
          </Button>
        ),
      }
    : {
        icon: LayoutGrid,
        title: "No modules yet",
        description: "Add your first module to get started.",
        action: canCreate && (
          <Button size="sm" onClick={() => navigate("/dashboard/module/create")}>
            <IconPlus />
            Add first module
          </Button>
        ),
      };

  // Phone row: name left, key value (sequence) right; description on line 2; actions on expand.
  const mobile = (m) => ({
    title: m.MODULE_NAME || "—",
    state:
      m.SEQUENCE_NO !== null && m.SEQUENCE_NO !== undefined ? (
        <span className="text-xs tabular-nums text-gray-500">Seq {m.SEQUENCE_NO}</span>
      ) : null,
    secondary: m.DESCRIPTION || null,
    fields: [],
    actions: (canEdit || canDelete) && (
      <>
        {canEdit && (
          <Button variant="outline" className="h-10 flex-1" onClick={() => handleEdit(m)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            className="h-10 flex-1 text-destructive hover:text-destructive"
            onClick={() => handleDelete(m)}
            disabled={deleteModuleMutation.isPending}
          >
            {deletingId === m.ID ? <Spinner className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        )}
      </>
    ),
  });

  return (
    <TooltipProvider delayDuration={200}>
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
              <IconTip label="Refresh list">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white border-gray-200"
                  aria-label="Refresh data"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
              </IconTip>
              {canCreate && (
                <Button onClick={() => navigate("/dashboard/module/create")}>
                  <IconPlus />
                  Add Module
                </Button>
              )}
            </div>
          </div>

          <div ref={gridRef} className="p-5 space-y-4">
            <CustomDataTableToolbar table={table} searchPlaceholder="Search modules..." />

            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Modules</AlertTitle>
                <AlertDescription className="mt-2 flex flex-col gap-2">
                  <p>{error?.message || "Failed to load modules. Please try again."}</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
                    {isFetching ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                      </>
                    )}
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {compact ? (
                  <MobileList
                    table={table}
                    rows={rows}
                    isLoading={isLoading}
                    empty={empty}
                    mobile={mobile}
                    mobileSort={MOBILE_SORT}
                  />
                ) : (
                  <DesktopTable
                    table={table}
                    rows={rows}
                    isLoading={isLoading}
                    empty={empty}
                    activeId={activeId}
                    toggle={toggleActive}
                  />
                )}
                {!isLoading && rows.length > 0 && <DataTablePagination table={table} />}
              </>
            )}
          </div>
        </div>

        <ConfirmationDialog />
      </div>
    </TooltipProvider>
  );
}