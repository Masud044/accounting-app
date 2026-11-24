

// import { useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, Search, AlertCircle, RefreshCw, Users } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
// import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
// import { useHasPermission } from "@/hooks/use-permission";

// import { useCustomers } from "./queries";
// import AddCustomerSheet from "./add-customer-sheet";
// import UpdateCustomerSheet from "./update-customer-sheet";

// const SortableHeader = ({ column, label }) => (
//   <Button
//     variant="ghost"
//     className="text-xs font-semibold text-gray-500 uppercase tracking-wide p-0 h-auto hover:bg-transparent"
//     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//   >
//     {label} <ArrowUpDown className="ml-1 h-3 w-3" />
//   </Button>
// );

// export default function CustomerList() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
//   const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Permissions ──
//   const canCreate = useHasPermission("CUSTOMER_CREATE");
//   const canEdit = useHasPermission("CUSTOMER_EDIT");
//   const canDelete = useHasPermission("CUSTOMER_DELETE");

//   const {
//     data: customers = [],
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useCustomers();

//   const handleEdit = (customer) => {
//     setSelectedCustomer(customer);
//     setIsUpdateSheetOpen(true);
//   };

//   const columns = [
//     {
//       accessorKey: "CUSTOMER_NAME",
//       header: ({ column }) => <SortableHeader column={column} label="Customer Name" />,
//       cell: ({ row }) => (
//         <div className="ml-3 text-sm font-medium text-gray-800">{row.getValue("CUSTOMER_NAME") || "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "CONTACT_PERSON",
//       header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Person</div>,
//       cell: ({ row }) => (
//         <div className="text-sm text-gray-500">{row.getValue("CONTACT_PERSON") || "—"}</div>
//       ),
//     },
//     {
//       accessorKey: "PHONE",
//       header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</div>,
//       cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("PHONE") || "—"}</div>,
//     },
//     {
//       accessorKey: "MOBILE",
//       header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile</div>,
//       cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("MOBILE") || "—"}</div>,
//     },
//     {
//       accessorKey: "EMAIL",
//       header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</div>,
//       cell: ({ row }) => (
//         <div className="text-sm text-gray-500 truncate max-w-[180px]">
//           {row.getValue("EMAIL") || "—"}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "STATUS",
//       header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</div>,
//       cell: ({ row }) => (
//         <Badge
//           className={
//             row.getValue("STATUS") === 1
//               ? "bg-green-100 text-green-700 border-green-200"
//               : "bg-gray-100 text-gray-600 border-gray-200"
//           }
//         >
//           {row.getValue("STATUS") === 1 ? "Active" : "Inactive"}
//         </Badge>
//       ),
//     },
//     {
//       id: "actions",
//       header: () => <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</div>,
//       enableHiding: false,
//       cell: ({ row }) => {
//         const customer = row.original;
//         return (
//           <div className="flex items-center gap-2">
//             {canEdit && (
//               <Button
//                 variant="ghost" size="icon" className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
//                 onClick={() => handleEdit(customer)}
//               >
//                 <IconEdit className="h-4 w-4" />
//                 <span className="sr-only">Edit</span>
//               </Button>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const table = useReactTable({
//     data: customers,
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
//             <p className="text-sm text-gray-500">Loading customers...</p>
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
//           <AlertTitle>Error Loading Customers</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load customers."}</p>
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
//               <Users size={16} />
//             </div>
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">Customers</h2>
//               <p className="text-xs text-gray-400">{customers.length} total customers</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="icon" className="bg-white border-gray-200" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
//               <span className="sr-only">Refresh</span>
//             </Button>
//             {canCreate && (
//               <Button onClick={() => setIsAddSheetOpen(true)}>
//                 <IconCircleDashedPlus className="mr-1" />Add Customer
//               </Button>
//             )}
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="relative max-w-sm w-full">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search by name, contact, email..."
//                 value={globalFilter ?? ""}
//                 onChange={(e) => setGlobalFilter(e.target.value)}
//                 className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
//               />
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto bg-white border-gray-200">
//                   Columns
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
//                   <DropdownMenuCheckboxItem
//                     key={col.id}
//                     className="capitalize"
//                     checked={col.getIsVisible()}
//                     onCheckedChange={(v) => col.toggleVisibility(!!v)}
//                   >
//                     {col.id.replace(/_/g, " ").toLowerCase()}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="overflow-hidden rounded-md border border-gray-200">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((h) => (
//                       <TableHead key={h.id} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                         {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
//                           <EmptyMedia variant="icon"><Users /></EmptyMedia>
//                           <EmptyTitle>No Customers Found</EmptyTitle>
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
//         <AddCustomerSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
//       )}
//       {isUpdateSheetOpen && (
//         <UpdateCustomerSheet open={isUpdateSheetOpen} onOpenChange={setIsUpdateSheetOpen} showConfirmation={showConfirmation} customer={selectedCustomer} />
//       )}
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
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { create } from "zustand";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IconCircleDashedPlus, IconEdit } from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useHasPermission } from "@/hooks/use-permission";

import { useCustomers } from "./queries";
import AddCustomerSheet from "./add-customer-sheet";
import UpdateCustomerSheet from "./update-customer-sheet";

/* ═════════════ active row store (one id at a time) ═════════════ */
const useActiveRowStore = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
  clear: () => set({ activeId: null }),
}));

/* ═════════════ helpers ═════════════ */
// Container-width switch: table → rows (pinned cols + 3 scrolling cols × ~115px ≈ 800px)
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

function StatusBadge({ active }) {
  return (
    <Badge
      className={cn(
        "whitespace-nowrap",
        active
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200"
      )}
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
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
      : `Sort by ${label.toLowerCase()}`;
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
const headCell = (pin) =>
  cn(
    "sticky top-0 h-12 whitespace-nowrap border-b border-gray-200 bg-gray-50 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500",
    pin ? "z-30" : "z-20",
    pin === "left" && "left-0 border-r border-r-gray-200",
    pin === "right" && "right-0 border-l border-l-gray-200"
  );

// Pinned cells get a SOLID background that follows hover / active (no shadow).
const bodyCell = (pin, active) =>
  cn(
    "h-12 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-gray-700",
    pin && [
      "sticky z-10",
      pin === "left" ? "left-0 border-r border-r-gray-200" : "right-0 border-l border-l-gray-200",
      active ? "bg-violet-100" : "bg-white group-hover:bg-gray-50",
    ]
  );

function DesktopTable({ table, rows, isLoading, empty, minWidth, activeId, toggle }) {
  const leafColumns = table.getVisibleLeafColumns();
  return (
    // single scroll container with bounded height → header stays pinned
    <div className="max-h-[calc(100dvh-12rem)] overflow-auto rounded-md border border-gray-200">
      <table className="w-full table-fixed border-separate border-spacing-0" style={{ minWidth }}>
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
                    className={cn(headCell(meta.pin), meta.width)}
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
                    <td key={col.id} className={bodyCell(meta.pin, false)}>
                      <Skeleton className={cn("h-4", meta.skeleton ?? "w-24")} />
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
                    "group h-12 cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-400",
                    active ? "bg-violet-100" : "hover:bg-gray-50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta ?? {};
                    return (
                      <td key={cell.id} className={bodyCell(meta.pin, active)}>
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
                      <span className="shrink-0">{m.state}</span>
                    </div>
                    {m.secondary && (
                      <div className="mt-1 line-clamp-2 text-xs text-gray-500">{m.secondary}</div>
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
                      <dl className="grid grid-cols-2 gap-3 text-sm">
                        {m.fields.map((f) => (
                          <div key={f.label} className="min-w-0">
                            <dt className="text-xs text-gray-400">{f.label}</dt>
                            <dd className="break-words text-gray-700">{f.value || "—"}</dd>
                          </div>
                        ))}
                      </dl>
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
  { key: "name-asc", label: "Name A–Z", sorting: [{ id: "CUSTOMER_NAME", desc: false }] },
  { key: "name-desc", label: "Name Z–A", sorting: [{ id: "CUSTOMER_NAME", desc: true }] },
  { key: "active", label: "Active first", sorting: [{ id: "STATUS", desc: true }] },
  { key: "inactive", label: "Inactive first", sorting: [{ id: "STATUS", desc: false }] },
];

/* ═════════════ page ═════════════ */
export default function CustomerList() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isUpdateSheetOpen, setIsUpdateSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [gridRef, compact] = useCompact();
  const activeId = useActiveRowStore((s) => s.activeId);
  const toggleActive = useActiveRowStore((s) => s.toggle);
  const clearActive = useActiveRowStore((s) => s.clear);
  useEffect(() => () => clearActive(), [clearActive]);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canCreate = useHasPermission("CUSTOMER_CREATE");
  const canEdit = useHasPermission("CUSTOMER_EDIT");

  const {
    data: customers = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCustomers();

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsUpdateSheetOpen(true);
  };

  const columns = [
    {
      accessorKey: "CUSTOMER_NAME",
      header: ({ column }) => <SortHeader column={column} label="Customer Name" />,
      cell: ({ row }) => (
        <TextCell value={row.getValue("CUSTOMER_NAME")} className="font-medium text-gray-800" />
      ),
      enableHiding: false,
      meta: { pin: "left", width: "w-[240px]", skeleton: "w-36" },
    },
    {
      accessorKey: "CONTACT_PERSON",
      header: "Contact Person",
      cell: ({ row }) => <TextCell value={row.getValue("CONTACT_PERSON")} className="text-gray-500" />,
      meta: { width: "w-[180px]", skeleton: "w-28" },
    },
    {
      accessorKey: "PHONE",
      header: "Phone",
      cell: ({ row }) => <TextCell value={row.getValue("PHONE")} className="text-gray-600" />,
      meta: { width: "w-[150px]", skeleton: "w-24" },
    },
    {
      accessorKey: "MOBILE",
      header: "Mobile",
      cell: ({ row }) => <TextCell value={row.getValue("MOBILE")} className="text-gray-600" />,
      meta: { width: "w-[150px]", skeleton: "w-24" },
    },
    {
      // flexible column: absorbs the slack
      accessorKey: "EMAIL",
      header: "Email",
      cell: ({ row }) => <TextCell value={row.getValue("EMAIL")} className="text-gray-500" />,
      meta: { skeleton: "w-40" },
    },
    {
      accessorKey: "STATUS",
      header: "Status",
      cell: ({ row }) => <StatusBadge active={row.getValue("STATUS") === 1} />,
      meta: { width: "w-[120px]", skeleton: "w-16" },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      enableSorting: false,
      meta: { pin: "right", width: "w-[88px]", skeleton: "w-8" },
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center gap-1">
            {canEdit && (
              <IconTip label="Edit customer">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit customer"
                  className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
                  onClick={(e) => {
                    e.stopPropagation(); // never toggles the row highlight
                    handleEdit(customer);
                  }}
                >
                  <IconEdit className="h-4 w-4" />
                </Button>
              </IconTip>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getRowId: (row, index) => String(row.CUSTOMER_ID ?? index),
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
        icon: Users,
        title: "No matching customers",
        description: "Try a different search term.",
        action: (
          <Button variant="outline" size="sm" onClick={() => setGlobalFilter("")}>
            Clear search
          </Button>
        ),
      }
    : {
        icon: Users,
        title: "No customers yet",
        description: "Add your first customer to get started.",
        action: canCreate && (
          <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
            <IconCircleDashedPlus className="mr-1" />
            Add first customer
          </Button>
        ),
      };

  // Phone row: identity left, state right; secondary line; 2 extra fields + actions on expand.
  const mobile = (c) => ({
    title: c.CUSTOMER_NAME || "—",
    state: <StatusBadge active={c.STATUS === 1} />,
    secondary: [c.CONTACT_PERSON, c.MOBILE].filter(Boolean).join(" · ") || null,
    fields: [
      { label: "Phone", value: c.PHONE },
      { label: "Email", value: c.EMAIL },
    ],
    actions: canEdit && (
      <Button variant="outline" className="h-10 flex-1" onClick={() => handleEdit(c)}>
        <IconEdit className="mr-2 h-4 w-4" />
        Edit
      </Button>
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
                <Users size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Customers</h2>
                <p className="text-xs text-gray-400">{customers.length} total customers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconTip label="Refresh list">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white border-gray-200"
                  aria-label="Refresh"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
              </IconTip>
              {canCreate && (
                <Button onClick={() => setIsAddSheetOpen(true)}>
                  <IconCircleDashedPlus className="mr-1" />
                  Add Customer
                </Button>
              )}
            </div>
          </div>

          <div ref={gridRef} className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, contact, email..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                />
              </div>
              {!compact && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto bg-white border-gray-200">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((col) => col.getCanHide())
                      .map((col) => (
                        <DropdownMenuCheckboxItem
                          key={col.id}
                          className="capitalize"
                          checked={col.getIsVisible()}
                          onCheckedChange={(v) => col.toggleVisibility(!!v)}
                        >
                          {col.id.replace(/_/g, " ").toLowerCase()}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Customers</AlertTitle>
                <AlertDescription className="mt-2 flex flex-col gap-2">
                  <p>{error?.message || "Failed to load customers."}</p>
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
                    minWidth={1150}
                    activeId={activeId}
                    toggle={toggleActive}
                  />
                )}
                {!isLoading && rows.length > 0 && <DataTablePagination table={table} />}
              </>
            )}
          </div>
        </div>

        {isAddSheetOpen && (
          <AddCustomerSheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen} showConfirmation={showConfirmation} />
        )}
        {isUpdateSheetOpen && (
          <UpdateCustomerSheet
            open={isUpdateSheetOpen}
            onOpenChange={setIsUpdateSheetOpen}
            showConfirmation={showConfirmation}
            customer={selectedCustomer}
          />
        )}
        <ConfirmationDialog />
      </div>
    </TooltipProvider>
  );
}