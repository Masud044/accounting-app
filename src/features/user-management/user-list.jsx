// // // import { useState, useMemo, useCallback } from "react";
// // // import {
// // //   flexRender,
// // //   getCoreRowModel,
// // //   useReactTable,
// // // } from "@tanstack/react-table";
// // // import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
// // // import {
// // //   UserX,
// // //   UserCheck,
// // //   AlertCircle,
// // //   RefreshCw,
// // //   Users,
// // //   KeyRound,
// // //   Eye,
// // //   ArrowUp,
// // //   ArrowDown,
// // //   UsersIcon,
// // // } from "lucide-react";
// // // import {
// // //   IconColumns3Filled,
// // //   IconEdit,
// // //   IconPlus,
// // //   IconSelector,
// // //   IconX,
// // // } from "@tabler/icons-react";
// // // import { toast } from "react-toastify";
// // // import { Link, useNavigate } from "react-router";
// // // import { format } from "date-fns";

// // // import { Button } from "@/components/ui/button";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Combobox,
// // //   ComboboxContent,
// // //   ComboboxEmpty,
// // //   ComboboxInput,
// // //   ComboboxItem,
// // //   ComboboxList,
// // // } from "@/components/ui/combobox";
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from "@/components/ui/table";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuCheckboxItem,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuTrigger,
// // // } from "@/components/ui/dropdown-menu";
// // // import {
// // //   Tooltip,
// // //   TooltipContent,
// // //   TooltipProvider,
// // //   TooltipTrigger,
// // // } from "@/components/ui/tooltip";
// // // import { DataTablePagination } from "@/components/DataTablePagination";
// // // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // // import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// // // import { Spinner } from "@/components/ui/spinner";
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
// // // import { cn } from "@/lib/utils";
// // // import { getAvatarColor } from "@/lib/avatar-utils";
// // // import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

// // // import {
// // //   useUsers,
// // //   useDeleteUser,
// // //   useActivateUser,
// // //   useRoles,
// // // } from "./queries";
// // // import AddUserDialog from "./add-user-dialog";
// // // import UpdateUserDialog from "./update-user-dialog";
// // // import ChangePasswordDialog from "./change-password-dialog";
// // // import { SearchInput } from "@/components/shared/search-input";
// // // import { DataTable, TableLoadingOverlay } from "@/components/shared/data-table";
// // // import { EmployeeCell } from "@/components/shared/employee/employee-cell";

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // //  CONSTANTS
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // const SORT_COLUMN_MAP = {
// // //   user: "USERNAME",
// // //   CREATED_AT: "CREATED_AT",
// // // };

// // // const REVERSE_SORT_MAP = {
// // //   USERNAME: "user",
// // //   CREATED_AT: "CREATED_AT",
// // // };

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // //  HELPERS
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // const formatDate = (d) => {
// // //   if (!d) return "—";
// // //   try {
// // //     return format(new Date(d), "MMM dd, yyyy");
// // //   } catch {
// // //     return "—";
// // //   }
// // // };

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // //  SORT HEADER
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // function SortHeader({ column, children, className }) {
// // //   if (!column.getCanSort()) {
// // //     return <div className={cn(className)}>{children}</div>;
// // //   }
// // //   return (
// // //     <DropdownMenu>
// // //       <DropdownMenuTrigger
// // //         className={cn(
// // //           "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
// // //           className,
// // //         )}
// // //       >
// // //         {children}
// // //         {column.getIsSorted() === "desc" ? (
// // //           <ArrowDown />
// // //         ) : column.getIsSorted() === "asc" ? (
// // //           <ArrowUp />
// // //         ) : (
// // //           <IconSelector />
// // //         )}
// // //       </DropdownMenuTrigger>
// // //       <DropdownMenuContent align="start" className="w-28">
// // //         <DropdownMenuCheckboxItem
// // //           className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
// // //           checked={column.getIsSorted() === "asc"}
// // //           onClick={() => column.toggleSorting(false)}
// // //         >
// // //           <ArrowUp /> Asc
// // //         </DropdownMenuCheckboxItem>
// // //         <DropdownMenuCheckboxItem
// // //           className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
// // //           checked={column.getIsSorted() === "desc"}
// // //           onClick={() => column.toggleSorting(true)}
// // //         >
// // //           <ArrowDown /> Desc
// // //         </DropdownMenuCheckboxItem>
// // //         {column.getIsSorted() && (
// // //           <DropdownMenuItem
// // //             className="pl-2 [&_svg]:text-muted-foreground"
// // //             onClick={() => column.clearSorting()}
// // //           >
// // //             <IconX /> Reset
// // //           </DropdownMenuItem>
// // //         )}
// // //       </DropdownMenuContent>
// // //     </DropdownMenu>
// // //   );
// // // }

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // //  FILTER COMBOBOX
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // function FilterCombobox({ placeholder, options, value, onValueChange }) {
// // //   const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
// // //   const hasValue = !!value;

// // //   return (
// // //     <Combobox
// // //       items={options.map((o) => o.label)}
// // //       value={selectedLabel}
// // //       onValueChange={(label) => {
// // //         if (!label) {
// // //           onValueChange("");
// // //           return;
// // //         }
// // //         const opt = options.find((o) => o.label === label);
// // //         onValueChange(opt?.value ?? "");
// // //       }}
// // //     >
// // //       <ComboboxInput
// // //         placeholder={placeholder}
// // //         showTrigger={!hasValue}
// // //         showClear={hasValue}
// // //       />
// // //       <ComboboxContent>
// // //         <ComboboxEmpty>No results.</ComboboxEmpty>
// // //         <ComboboxList>
// // //           {(label) => (
// // //             <ComboboxItem key={label} value={label}>
// // //               {label}
// // //             </ComboboxItem>
// // //           )}
// // //         </ComboboxList>
// // //       </ComboboxContent>
// // //     </Combobox>
// // //   );
// // // }

// // // // ── Small avatar for the list (h-8 w-8) ──────────────────────────────────────
// // // function UserListAvatar({ user }) {
// // //   const BASE = import.meta.env.VITE_API_BASE_URL;

// // //   const urlsToTry = [
// // //     `${BASE}/api/emp-images/person/${user.ID}`,
// // //     user.EMPLOYEE_ID
// // //       ? `${BASE}/api/emp-images/person/${user.EMPLOYEE_ID}`
// // //       : null,
// // //   ].filter(Boolean);

// // //   const [srcIndex, setSrcIndex] = useState(0);
// // //   const [failed, setFailed] = useState(false);

// // //   const initials =
// // //     [user.FIRST_NAME?.[0], user.LAST_NAME?.[0]]
// // //       .filter(Boolean)
// // //       .join("")
// // //       .toUpperCase() || user.USERNAME?.[0]?.toUpperCase();

// // //   const handleError = () => {
// // //     const next = srcIndex + 1;
// // //     if (next < urlsToTry.length) {
// // //       setSrcIndex(next);
// // //     } else {
// // //       setFailed(true);
// // //     }
// // //   };

// // //   return (
// // //     <div
// // //       className={cn(
// // //         "h-8 w-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center",
// // //         getAvatarColor(user.USERNAME),
// // //       )}
// // //     >
// // //       {!failed ? (
// // //         <img
// // //           key={urlsToTry[srcIndex]}
// // //           src={urlsToTry[srcIndex]}
// // //           onError={handleError}
// // //           alt={user.USERNAME}
// // //           className="h-full w-full object-cover"
// // //         />
// // //       ) : (
// // //         <span className="text-xs font-semibold text-white">{initials}</span>
// // //       )}
// // //     </div>
// // //   );
// // // }
// // // // ─────────────────────────────────────────────────────────────────────────────
// // // //  MAIN COMPONENT
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // export default function UserList() {
// // //   const navigate = useNavigate();

// // //   // ── URL state via nuqs ──────────────────────────────────────────────────────
// // //   const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
// // //   const [limit, setLimit] = useQueryState(
// // //     "limit",
// // //     parseAsInteger.withDefault(20),
// // //   );
// // //   const [search, setSearch] = useQueryState(
// // //     "search",
// // //     parseAsString.withDefault(""),
// // //   );
// // //   const [roleId, setRoleId] = useQueryState(
// // //     "roleId",
// // //     parseAsString.withDefault(""),
// // //   );
// // //   const [sortBy, setSortBy] = useQueryState(
// // //     "sortBy",
// // //     parseAsString.withDefault("CREATED_AT"),
// // //   );
// // //   const [sortOrder, setSortOrder] = useQueryState(
// // //     "sortOrder",
// // //     parseAsString.withDefault("DESC"),
// // //   );

// // //   // ── Local UI state ──────────────────────────────────────────────────────────
// // //   const [columnVisibility, setColumnVisibility] = useState({});
// // //   const [isAddOpen, setIsAddOpen] = useState(false);
// // //   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
// // //   const [isPasswordOpen, setIsPasswordOpen] = useState(false);
// // //   const [selectedUser, setSelectedUser] = useState(null);

// // //   // Local search input — debounced before hitting the URL/backend
// // //   const [searchInput, setSearchInput] = useState(search);

// // //   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

// // //   // ── Filter data ─────────────────────────────────────────────────────────────
// // //   const { data: roles = [] } = useRoles();

// // //   // ── Combobox options ────────────────────────────────────────────────────────
// // //   const roleOptions = roles.map((r) => ({
// // //     label: r.ROLE_NAME,
// // //     value: String(r.ID),
// // //   }));

// // //   // ── Backend params ──────────────────────────────────────────────────────────
// // //   const backendParams = useMemo(
// // //     () => ({
// // //       page,
// // //       limit,
// // //       search,
// // //       roleId,
// // //       sortBy,
// // //       sortOrder,
// // //     }),
// // //     [page, limit, search, roleId, sortBy, sortOrder],
// // //   );

// // //   // ── Queries ─────────────────────────────────────────────────────────────────
// // //   const {
// // //     data: response,
// // //     isLoading,
// // //     isError,
// // //     error,
// // //     refetch,
// // //     isFetching,
// // //   } = useUsers(backendParams);

// // //   const deleteMutation = useDeleteUser();
// // //   const activateMutation = useActivateUser();

// // //   // ── Derived ─────────────────────────────────────────────────────────────────
// // //   const rows = response?.data ?? [];
// // //   const total = response?.pagination?.total ?? 0;
// // //   const pageCount = response?.pagination?.totalPages ?? 1;

// // //   // ── Debounced search ────────────────────────────────────────────────────────
// // //   const debouncedSearch = useDebouncedCallback((val) => {
// // //     setSearch(val || null);
// // //     setPage(1);
// // //   }, 300);

// // //   const handleSearchChange = (e) => {
// // //     setSearchInput(e.target.value);
// // //     debouncedSearch(e.target.value);
// // //   };

// // //   // ── Sorting bridge ──────────────────────────────────────────────────────────
// // //   const sorting = useMemo(() => {
// // //     if (!sortBy) return [];
// // //     const columnId = REVERSE_SORT_MAP[sortBy] ?? sortBy;
// // //     return [{ id: columnId, desc: sortOrder === "DESC" }];
// // //   }, [sortBy, sortOrder]);

// // //   const onSortingChange = useCallback(
// // //     (updaterOrValue) => {
// // //       const next =
// // //         typeof updaterOrValue === "function"
// // //           ? updaterOrValue(sorting)
// // //           : updaterOrValue;
// // //       if (next.length === 0) {
// // //         setSortBy("CREATED_AT");
// // //         setSortOrder("DESC");
// // //       } else {
// // //         const col = SORT_COLUMN_MAP[next[0].id] ?? "CREATED_AT";
// // //         setSortBy(col);
// // //         setSortOrder(next[0].desc ? "DESC" : "ASC");
// // //         setPage(1);
// // //       }
// // //     },
// // //     [sorting, setSortBy, setSortOrder, setPage],
// // //   );

// // //   // ── Pagination bridge ───────────────────────────────────────────────────────
// // //   const pagination = useMemo(
// // //     () => ({
// // //       pageIndex: page - 1,
// // //       pageSize: limit,
// // //     }),
// // //     [page, limit],
// // //   );

// // //   const onPaginationChange = useCallback(
// // //     (updaterOrValue) => {
// // //       const next =
// // //         typeof updaterOrValue === "function"
// // //           ? updaterOrValue(pagination)
// // //           : updaterOrValue;
// // //       setPage(next.pageIndex + 1);
// // //       setLimit(next.pageSize);
// // //     },
// // //     [pagination, setPage, setLimit],
// // //   );

// // //   // ── Filter helpers ──────────────────────────────────────────────────────────
// // //   const hasActiveFilters = search || roleId;

// // //   const clearAllFilters = () => {
// // //     setSearchInput("");
// // //     setSearch(null);
// // //     setRoleId(null);
// // //     setPage(1);
// // //   };

// // //   // ── Dialog helpers ──────────────────────────────────────────────────────────
// // //   // const handleEdit = (user) => {
// // //   //   setSelectedUser(user);
// // //   //   setIsUpdateOpen(true);
// // //   // };
// // //   const handleEdit = (user) => {
// // //     navigate(`/dashboard/user-management/users/${user.ID}/edit`);
// // //   };
// // //   const handlePassword = (user) => {
// // //     setSelectedUser(user);
// // //     setIsPasswordOpen(true);
// // //   };

// // //   const handleDelete = async (user) => {
// // //     const confirmed = await showConfirmation({
// // //       title: "Deactivate user?",
// // //       description: `Are you sure you want to deactivate "${user.USERNAME}"?`,
// // //       confirmText: "Deactivate",
// // //       cancelText: "Cancel",
// // //       variant: "destructive",
// // //     });
// // //     if (!confirmed) return;
// // //     try {
// // //       await deleteMutation.mutateAsync(user.ID);
// // //       toast.success("User deactivated successfully!");
// // //     } catch (err) {
// // //       toast.error(err?.message || "Failed to deactivate user.");
// // //     }
// // //   };

// // //   const handleActivate = async (user) => {
// // //     const confirmed = await showConfirmation({
// // //       title: "Activate user?",
// // //       description: `Are you sure you want to activate "${user.USERNAME}"?`,
// // //       confirmText: "Activate",
// // //       cancelText: "Cancel",
// // //     });
// // //     if (!confirmed) return;
// // //     try {
// // //       await activateMutation.mutateAsync(user.ID);
// // //       toast.success("User activated successfully!");
// // //     } catch (err) {
// // //       toast.error(err?.message || "Failed to activate user.");
// // //     }
// // //   };

// // //   // ── Columns ─────────────────────────────────────────────────────────────────
// // //   const columns = useMemo(
// // //     () => [
// // //       {
// // //         id: "user",
// // //         accessorFn: (row) => row.USERNAME,
// // //         header: ({ column }) => <SortHeader column={column}>User</SortHeader>,
// // //         cell: ({ row }) => {
// // //           const u = row.original;
// // //           const fullName = [u.FIRST_NAME, u.LAST_NAME].filter(Boolean).join(" ");

// // //           return (
// // //             <div className="flex items-center gap-3 py-1">
// // //               <UserListAvatar user={u} />
// // //               <div className="flex flex-col min-w-0">
// // //                 <span className="font-medium leading-tight">{u.USERNAME}</span>
// // //                 {fullName && (
// // //                   <span className="text-xs text-muted-foreground truncate">
// // //                     {fullName}
// // //                     {u.EMP_NO && (
// // //                       <span className="ml-1 font-mono opacity-70">{u.EMP_NO}</span>
// // //                     )}
// // //                   </span>
// // //                 )}
// // //                 {u.LOCATION_NAME && (
// // //                   <span className="text-xs text-muted-foreground/60 truncate">
// // //                     {u.LOCATION_NAME}
// // //                   </span>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           );
// // //         },
// // //       },
// // //       {
// // //         accessorKey: "STATUS",
// // //         header: "Status",
// // //         enableSorting: false,
// // //         cell: ({ row }) => {
// // //           const status = row.getValue("STATUS");
// // //           return (
// // //             <Badge
// // //               variant="outline"
// // //               className={cn(
// // //                 status === "ACTIVE"
// // //                   ? "bg-green-500/10 text-green-600 border-green-500/20"
// // //                   : "bg-muted text-muted-foreground border-border",
// // //               )}
// // //             >
// // //               {status}
// // //             </Badge>
// // //           );
// // //         },
// // //       },
// // //       {
// // //         accessorKey: "CREATED_AT",
// // //         header: ({ column }) => (
// // //           <SortHeader column={column}>Created</SortHeader>
// // //         ),
// // //         cell: ({ row }) => (
// // //           <div className="text-sm font-light">
// // //             {formatDate(row.getValue("CREATED_AT"))}
// // //           </div>
// // //         ),
// // //       },
// // //       {
// // //         id: "actions",
// // //         header: "Actions",
// // //         enableHiding: false,
// // //         enableSorting: false,
// // //         cell: ({ row }) => {
// // //           const user = row.original;
// // //           const isActive = user.STATUS === "ACTIVE";
// // //           const isBusy = deleteMutation.isPending || activateMutation.isPending;

// // //           return (
// // //             <TooltipProvider>
// // //               <div className="flex items-center gap-1">
// // //                 <Tooltip>
// // //                   <TooltipTrigger asChild>
// // //                     <Button
// // //                       variant="ghost"
// // //                       size="icon"
// // //                       className="h-8 w-8"
// // //                       onClick={() =>
// // //                         navigate(`/dashboard/user-management/users/${user.ID}`)
// // //                       }
// // //                     >
// // //                       <Eye className="h-4 w-4" />
// // //                     </Button>
// // //                   </TooltipTrigger>
// // //                   <TooltipContent>View Details</TooltipContent>
// // //                 </Tooltip>
// // // {/* no need edit */}
// // //                 {/* <Tooltip>
// // //                   <TooltipTrigger asChild>
// // //                     <Button
// // //                       variant="ghost"
// // //                       size="icon"
// // //                       className="h-8 w-8"
// // //                       onClick={() => handleEdit(user)}
// // //                     >
// // //                       <IconEdit className="h-4 w-4" />
// // //                     </Button>
// // //                   </TooltipTrigger>
// // //                   <TooltipContent>Edit User</TooltipContent>
// // //                 </Tooltip> */}

// // //                 <Tooltip>
// // //                   <TooltipTrigger asChild>
// // //                     <Button
// // //                       variant="ghost"
// // //                       size="icon"
// // //                       className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
// // //                       onClick={() => handlePassword(user)}
// // //                     >
// // //                       <KeyRound className="h-4 w-4" />
// // //                     </Button>
// // //                   </TooltipTrigger>
// // //                   <TooltipContent>Change Password</TooltipContent>
// // //                 </Tooltip>

// // //                 {isActive ? (
// // //                   <Tooltip>
// // //                     <TooltipTrigger asChild>
// // //                       <Button
// // //                         variant="ghost"
// // //                         size="icon"
// // //                         className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
// // //                         onClick={() => handleDelete(user)}
// // //                         disabled={isBusy}
// // //                       >
// // //                         {deleteMutation.isPending ? (
// // //                           <Spinner data-icon="inline-start" />
// // //                         ) : (
// // //                           <UserX className="h-4 w-4" />
// // //                         )}
// // //                       </Button>
// // //                     </TooltipTrigger>
// // //                     <TooltipContent>Deactivate</TooltipContent>
// // //                   </Tooltip>
// // //                 ) : (
// // //                   <Tooltip>
// // //                     <TooltipTrigger asChild>
// // //                       <Button
// // //                         variant="ghost"
// // //                         size="icon"
// // //                         className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10"
// // //                         onClick={() => handleActivate(user)}
// // //                         disabled={isBusy}
// // //                       >
// // //                         {activateMutation.isPending ? (
// // //                           <Spinner data-icon="inline-start" />
// // //                         ) : (
// // //                           <UserCheck className="h-4 w-4" />
// // //                         )}
// // //                       </Button>
// // //                     </TooltipTrigger>
// // //                     <TooltipContent>Activate</TooltipContent>
// // //                   </Tooltip>
// // //                 )}
// // //               </div>
// // //             </TooltipProvider>
// // //           );
// // //         },
// // //       },
// // //     ],
// // //     [deleteMutation.isPending],
// // //   );

// // //   // ── TanStack table ──────────────────────────────────────────────────────────
// // //   const table = useReactTable({
// // //     data: rows,
// // //     columns,
// // //     pageCount,
// // //     state: { pagination, columnVisibility, sorting },
// // //     onPaginationChange,
// // //     onSortingChange,
// // //     onColumnVisibilityChange: setColumnVisibility,
// // //     getCoreRowModel: getCoreRowModel(),
// // //     manualPagination: true,
// // //     manualSorting: true,
// // //     manualFiltering: true,
// // //   });

// // //   // ── Loading state ───────────────────────────────────────────────────────────
// // //   if (isLoading)
// // //     return (
// // //       <div>
// // //         <PageHeader disabled />
// // //         <div className="bg-card rounded-md shadow-sm p-4">
// // //           <div className="flex flex-col items-center justify-center py-16">
// // //             <Spinner className="h-12 w-12 mb-4" />
// // //             <p className="text-muted-foreground">Loading users...</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );

// // //   // ── Error state ─────────────────────────────────────────────────────────────
// // //   if (isError)
// // //     return (
// // //       <div>
// // //         <PageHeader
// // //           onRefetch={refetch}
// // //           isFetching={isFetching}
// // //           // onAdd={() => setIsAddOpen(true)}
// // //           onAdd={() => navigate("/dashboard/user-management/users/create")}
// // //         />
// // //         <div className="bg-card rounded-md shadow-sm p-4">
// // //           <Alert variant="destructive">
// // //             <AlertCircle className="h-4 w-4" />
// // //             <AlertTitle>Error Loading Users</AlertTitle>
// // //             <AlertDescription className="mt-2 flex flex-col gap-2">
// // //               <p>{error?.message || "Failed to load users."}</p>
// // //               <Button
// // //                 variant="outline"
// // //                 size="sm"
// // //                 onClick={refetch}
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

// // //   // ── Main render ─────────────────────────────────────────────────────────────
// // //   return (
// // //     <div>
// // //       <PageHeader
// // //         onRefetch={refetch}
// // //         isFetching={isFetching}
// // //         // onAdd={() => setIsAddOpen(true)}
// // //         onAdd={() => navigate("/dashboard/user-management/users/create")}
// // //       />

// // //       <div className="bg-card rounded-md shadow-sm p-4">
// // //         <div className="space-y-4">
// // //           {/* ── Filter Bar ─────────────────────────────────────────────── */}
// // //           <div className="flex flex-wrap items-center gap-2">
// // //             {/* Search — debounced 300ms */}
// // //             <SearchInput
// // //               placeholder="Search username..."
// // //               value={searchInput}
// // //               onChange={handleSearchChange}
// // //               onClear={() => {
// // //                 setSearchInput("");
// // //                 debouncedSearch("");
// // //               }}
// // //             />

// // //             {/* Role — Combobox */}
// // //             <FilterCombobox
// // //               placeholder="Role"
// // //               options={roleOptions}
// // //               value={roleId}
// // //               onValueChange={(v) => {
// // //                 setRoleId(v || null);
// // //                 setPage(1);
// // //               }}
// // //             />

// // //             {/* Reset all */}
// // //             {hasActiveFilters && (
// // //               <Button
// // //                 variant="ghost"
// // //                 size="sm"
// // //                 className="h-9 border border-dashed text-muted-foreground hover:text-foreground"
// // //                 onClick={clearAllFilters}
// // //               >
// // //                 Reset <IconX className="ml-2 h-4 w-4" />
// // //               </Button>
// // //             )}

// // //             {/* Columns — pushed right */}
// // //             <div className="ml-auto">
// // //               <DropdownMenu>
// // //                 <DropdownMenuTrigger asChild>
// // //                   <Button
// // //                     variant="ghost"
// // //                     size="sm"
// // //                     className="h-9 font-medium shadow-sm"
// // //                   >
// // //                     <IconColumns3Filled className="size-3.5" /> Columns
// // //                   </Button>
// // //                 </DropdownMenuTrigger>
// // //                 <DropdownMenuContent align="end" className="w-[160px]">
// // //                   {table
// // //                     .getAllColumns()
// // //                     .filter((col) => col.getCanHide())
// // //                     .map((col) => (
// // //                       <DropdownMenuCheckboxItem
// // //                         key={col.id}
// // //                         className="capitalize"
// // //                         checked={col.getIsVisible()}
// // //                         onCheckedChange={(v) => col.toggleVisibility(!!v)}
// // //                       >
// // //                         {col.id.replace(/_/g, " ")}
// // //                       </DropdownMenuCheckboxItem>
// // //                     ))}
// // //                 </DropdownMenuContent>
// // //               </DropdownMenu>
// // //             </div>
// // //           </div>

// // //           {/* Record count */}
// // //           <p className="text-sm font-medium text-muted-foreground">
// // //             {isFetching
// // //               ? "Loading records..."
// // //               : `${total.toLocaleString()} user${total !== 1 ? "s" : ""} found`}
// // //           </p>

// // //           {/* ── Table ──────────────────────────────────────────────────── */}
// // //           <DataTable
// // //             table={table}
// // //             isFetching={isFetching}
// // //             loadingLabel="Loading users..."
// // //             empty={{
// // //               colSpan: columns.length,
// // //               icon: UsersIcon,
// // //               title: "No Users Found",
// // //             }}
// // //           />

// // //           <DataTablePagination table={table} />
// // //         </div>
// // //       </div>

// // //       {isAddOpen && (
// // //         <AddUserDialog
// // //           open={isAddOpen}
// // //           onOpenChange={setIsAddOpen}
// // //           showConfirmation={showConfirmation}
// // //         />
// // //       )}
// // //       {isUpdateOpen && (
// // //         <UpdateUserDialog
// // //           open={isUpdateOpen}
// // //           onOpenChange={setIsUpdateOpen}
// // //           showConfirmation={showConfirmation}
// // //           user={selectedUser}
// // //         />
// // //       )}
// // //       {isPasswordOpen && (
// // //         <ChangePasswordDialog
// // //           open={isPasswordOpen}
// // //           onOpenChange={setIsPasswordOpen}
// // //           user={selectedUser}
// // //         />
// // //       )}
// // //       <ConfirmationDialog />
// // //     </div>
// // //   );
// // // }

// // // // ─────────────────────────────────────────────────────────────────────────────
// // // //  PAGE HEADER
// // // // ─────────────────────────────────────────────────────────────────────────────

// // // function PageHeader({ isFetching, onRefetch, onAdd, disabled }) {
// // //   return (
// // //     <div className="bg-card rounded-md shadow-sm p-4 mb-4">
// // //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //         <div className="space-y-0.5">
// // //           <h1 className="text-lg md:text-2xl font-semibold tracking-tight">
// // //             Users
// // //           </h1>
// // //           <Breadcrumb>
// // //             <BreadcrumbList>
// // //               <BreadcrumbItem>
// // //                 <BreadcrumbLink asChild>
// // //                   <Link to="/">Dashboard</Link>
// // //                 </BreadcrumbLink>
// // //               </BreadcrumbItem>
// // //               <BreadcrumbSeparator />
// // //               <BreadcrumbItem>User Management</BreadcrumbItem>
// // //               <BreadcrumbSeparator />
// // //               <BreadcrumbItem>
// // //                 <BreadcrumbPage>Users</BreadcrumbPage>
// // //               </BreadcrumbItem>
// // //             </BreadcrumbList>
// // //           </Breadcrumb>
// // //         </div>
// // //         <div className="flex items-center gap-2">
// // //           {onRefetch && (
// // //             <Button
// // //               variant="outline"
// // //               size="icon"
// // //               onClick={onRefetch}
// // //               disabled={isFetching || disabled}
// // //             >
// // //               <RefreshCw
// // //                 className={cn("h-4 w-4", isFetching && "animate-spin")}
// // //               />
// // //             </Button>
// // //           )}
// // //           <Button onClick={onAdd} disabled={disabled}>
// // //             <IconPlus size={18} className="mr-1" /> Add User
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// import { useState, useMemo, useCallback } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
// import {
//   UserX,
//   UserCheck,
//   AlertCircle,
//   RefreshCw,
//   KeyRound,
//   Eye,
//   ArrowUp,
//   ArrowDown,
//   UsersIcon,
// } from "lucide-react";
// import {
//   IconColumns3Filled,
//   IconPlus,
//   IconSelector,
//   IconX,
// } from "@tabler/icons-react";
// import { toast } from "react-toastify";
// import { Link, useNavigate } from "react-router";
// import { format } from "date-fns";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Combobox,
//   ComboboxContent,
//   ComboboxEmpty,
//   ComboboxInput,
//   ComboboxItem,
//   ComboboxList,
// } from "@/components/ui/combobox";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { DataTablePagination } from "@/components/DataTablePagination";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
// import { Spinner } from "@/components/ui/spinner";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { cn } from "@/lib/utils";
// import { getAvatarColor } from "@/lib/avatar-utils";
// import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

// import {
//   useUsers,
//   useDeleteUser,
//   useActivateUser,
//   useRoles,
// } from "./queries";
// import AddUserDialog from "./add-user-dialog";
// import UpdateUserDialog from "./update-user-dialog";
// import ChangePasswordDialog from "./change-password-dialog";
// import { SearchInput } from "@/components/shared/search-input";
// import { DataTable, TableLoadingOverlay } from "@/components/shared/data-table";
// import { EmployeeCell } from "@/components/shared/employee/employee-cell";

// // ─────────────────────────────────────────────────────────────────────────────
// //  CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────

// const SORT_COLUMN_MAP = {
//   user: "USERNAME",
//   CREATED_AT: "CREATED_AT",
// };

// const REVERSE_SORT_MAP = {
//   USERNAME: "user",
//   CREATED_AT: "CREATED_AT",
// };

// // ─────────────────────────────────────────────────────────────────────────────
// //  HELPERS
// // ─────────────────────────────────────────────────────────────────────────────

// const formatDate = (d) => {
//   if (!d) return "—";
//   try {
//     return format(new Date(d), "MMM dd, yyyy");
//   } catch {
//     return "—";
//   }
// };

// // ─────────────────────────────────────────────────────────────────────────────
// //  SORT HEADER — uppercase, gray, consistent with journal/invoice tables
// // ─────────────────────────────────────────────────────────────────────────────

// function SortHeader({ column, children, className }) {
//   if (!column.getCanSort()) {
//     return (
//       <div className={cn("text-xs font-semibold text-gray-500 uppercase tracking-wide", className)}>
//         {children}
//       </div>
//     );
//   }
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger
//         className={cn(
//           "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-violet-300 data-[state=open]:bg-gray-100 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-gray-400",
//           className,
//         )}
//       >
//         {children}
//         {column.getIsSorted() === "desc" ? (
//           <ArrowDown />
//         ) : column.getIsSorted() === "asc" ? (
//           <ArrowUp />
//         ) : (
//           <IconSelector />
//         )}
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="start" className="w-28">
//         <DropdownMenuCheckboxItem
//           className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
//           checked={column.getIsSorted() === "asc"}
//           onClick={() => column.toggleSorting(false)}
//         >
//           <ArrowUp /> Asc
//         </DropdownMenuCheckboxItem>
//         <DropdownMenuCheckboxItem
//           className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
//           checked={column.getIsSorted() === "desc"}
//           onClick={() => column.toggleSorting(true)}
//         >
//           <ArrowDown /> Desc
//         </DropdownMenuCheckboxItem>
//         {column.getIsSorted() && (
//           <DropdownMenuItem
//             className="pl-2 [&_svg]:text-muted-foreground"
//             onClick={() => column.clearSorting()}
//           >
//             <IconX /> Reset
//           </DropdownMenuItem>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// //  FILTER COMBOBOX
// // ─────────────────────────────────────────────────────────────────────────────

// function FilterCombobox({ placeholder, options, value, onValueChange }) {
//   const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
//   const hasValue = !!value;

//   return (
//     <Combobox
//       items={options.map((o) => o.label)}
//       value={selectedLabel}
//       onValueChange={(label) => {
//         if (!label) {
//           onValueChange("");
//           return;
//         }
//         const opt = options.find((o) => o.label === label);
//         onValueChange(opt?.value ?? "");
//       }}
//     >
//       <ComboboxInput
//         placeholder={placeholder}
//         showTrigger={!hasValue}
//         showClear={hasValue}
//       />
//       <ComboboxContent>
//         <ComboboxEmpty>No results.</ComboboxEmpty>
//         <ComboboxList>
//           {(label) => (
//             <ComboboxItem key={label} value={label}>
//               {label}
//             </ComboboxItem>
//           )}
//         </ComboboxList>
//       </ComboboxContent>
//     </Combobox>
//   );
// }

// // ── Small avatar for the list (h-8 w-8) ──────────────────────────────────────
// function UserListAvatar({ user }) {
//   const BASE = import.meta.env.VITE_API_BASE_URL;

//   const urlsToTry = [
//     `${BASE}/api/emp-images/person/${user.ID}`,
//     user.EMPLOYEE_ID
//       ? `${BASE}/api/emp-images/person/${user.EMPLOYEE_ID}`
//       : null,
//   ].filter(Boolean);

//   const [srcIndex, setSrcIndex] = useState(0);
//   const [failed, setFailed] = useState(false);

//   const initials =
//     [user.FIRST_NAME?.[0], user.LAST_NAME?.[0]]
//       .filter(Boolean)
//       .join("")
//       .toUpperCase() || user.USERNAME?.[0]?.toUpperCase();

//   const handleError = () => {
//     const next = srcIndex + 1;
//     if (next < urlsToTry.length) {
//       setSrcIndex(next);
//     } else {
//       setFailed(true);
//     }
//   };

//   return (
//     <div
//       className={cn(
//         "h-8 w-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center",
//         getAvatarColor(user.USERNAME),
//       )}
//     >
//       {!failed ? (
//         <img
//           key={urlsToTry[srcIndex]}
//           src={urlsToTry[srcIndex]}
//           onError={handleError}
//           alt={user.USERNAME}
//           className="h-full w-full object-cover"
//         />
//       ) : (
//         <span className="text-xs font-semibold text-white">{initials}</span>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// //  MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────

// export default function UserList() {
//   const navigate = useNavigate();

//   // ── URL state via nuqs ──────────────────────────────────────────────────────
//   const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
//   const [limit, setLimit] = useQueryState(
//     "limit",
//     parseAsInteger.withDefault(20),
//   );
//   const [search, setSearch] = useQueryState(
//     "search",
//     parseAsString.withDefault(""),
//   );
//   const [roleId, setRoleId] = useQueryState(
//     "roleId",
//     parseAsString.withDefault(""),
//   );
//   const [sortBy, setSortBy] = useQueryState(
//     "sortBy",
//     parseAsString.withDefault("CREATED_AT"),
//   );
//   const [sortOrder, setSortOrder] = useQueryState(
//     "sortOrder",
//     parseAsString.withDefault("DESC"),
//   );

//   // ── Local UI state ──────────────────────────────────────────────────────────
//   const [columnVisibility, setColumnVisibility] = useState({});
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isUpdateOpen, setIsUpdateOpen] = useState(false);
//   const [isPasswordOpen, setIsPasswordOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Local search input — debounced before hitting the URL/backend
//   const [searchInput, setSearchInput] = useState(search);

//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   // ── Filter data ─────────────────────────────────────────────────────────────
//   const { data: roles = [] } = useRoles();

//   // ── Combobox options ────────────────────────────────────────────────────────
//   const roleOptions = roles.map((r) => ({
//     label: r.ROLE_NAME,
//     value: String(r.ID),
//   }));

//   // ── Backend params ──────────────────────────────────────────────────────────
//   const backendParams = useMemo(
//     () => ({
//       page,
//       limit,
//       search,
//       roleId,
//       sortBy,
//       sortOrder,
//     }),
//     [page, limit, search, roleId, sortBy, sortOrder],
//   );

//   // ── Queries ─────────────────────────────────────────────────────────────────
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useUsers(backendParams);

//   const deleteMutation = useDeleteUser();
//   const activateMutation = useActivateUser();

//   // ── Derived ─────────────────────────────────────────────────────────────────
//   const rows = response?.data ?? [];
//   const total = response?.pagination?.total ?? 0;
//   const pageCount = response?.pagination?.totalPages ?? 1;

//   // ── Debounced search ────────────────────────────────────────────────────────
//   const debouncedSearch = useDebouncedCallback((val) => {
//     setSearch(val || null);
//     setPage(1);
//   }, 300);

//   const handleSearchChange = (e) => {
//     setSearchInput(e.target.value);
//     debouncedSearch(e.target.value);
//   };

//   // ── Sorting bridge ──────────────────────────────────────────────────────────
//   const sorting = useMemo(() => {
//     if (!sortBy) return [];
//     const columnId = REVERSE_SORT_MAP[sortBy] ?? sortBy;
//     return [{ id: columnId, desc: sortOrder === "DESC" }];
//   }, [sortBy, sortOrder]);

//   const onSortingChange = useCallback(
//     (updaterOrValue) => {
//       const next =
//         typeof updaterOrValue === "function"
//           ? updaterOrValue(sorting)
//           : updaterOrValue;
//       if (next.length === 0) {
//         setSortBy("CREATED_AT");
//         setSortOrder("DESC");
//       } else {
//         const col = SORT_COLUMN_MAP[next[0].id] ?? "CREATED_AT";
//         setSortBy(col);
//         setSortOrder(next[0].desc ? "DESC" : "ASC");
//         setPage(1);
//       }
//     },
//     [sorting, setSortBy, setSortOrder, setPage],
//   );

//   // ── Pagination bridge ───────────────────────────────────────────────────────
//   const pagination = useMemo(
//     () => ({
//       pageIndex: page - 1,
//       pageSize: limit,
//     }),
//     [page, limit],
//   );

//   const onPaginationChange = useCallback(
//     (updaterOrValue) => {
//       const next =
//         typeof updaterOrValue === "function"
//           ? updaterOrValue(pagination)
//           : updaterOrValue;
//       setPage(next.pageIndex + 1);
//       setLimit(next.pageSize);
//     },
//     [pagination, setPage, setLimit],
//   );

//   // ── Filter helpers ──────────────────────────────────────────────────────────
//   const hasActiveFilters = search || roleId;

//   const clearAllFilters = () => {
//     setSearchInput("");
//     setSearch(null);
//     setRoleId(null);
//     setPage(1);
//   };

//   // ── Dialog helpers ──────────────────────────────────────────────────────────
//   const handleEdit = (user) => {
//     navigate(`/dashboard/user-management/users/${user.ID}/edit`);
//   };
//   const handlePassword = (user) => {
//     setSelectedUser(user);
//     setIsPasswordOpen(true);
//   };

//   const handleDelete = async (user) => {
//     const confirmed = await showConfirmation({
//       title: "Deactivate user?",
//       description: `Are you sure you want to deactivate "${user.USERNAME}"?`,
//       confirmText: "Deactivate",
//       cancelText: "Cancel",
//       variant: "destructive",
//     });
//     if (!confirmed) return;
//     try {
//       await deleteMutation.mutateAsync(user.ID);
//       toast.success("User deactivated successfully!");
//     } catch (err) {
//       toast.error(err?.message || "Failed to deactivate user.");
//     }
//   };

//   const handleActivate = async (user) => {
//     const confirmed = await showConfirmation({
//       title: "Activate user?",
//       description: `Are you sure you want to activate "${user.USERNAME}"?`,
//       confirmText: "Activate",
//       cancelText: "Cancel",
//     });
//     if (!confirmed) return;
//     try {
//       await activateMutation.mutateAsync(user.ID);
//       toast.success("User activated successfully!");
//     } catch (err) {
//       toast.error(err?.message || "Failed to activate user.");
//     }
//   };

//   // ── Columns ─────────────────────────────────────────────────────────────────
//   const columns = useMemo(
//     () => [
//       {
//         id: "user",
//         accessorFn: (row) => row.USERNAME,
//         header: ({ column }) => <SortHeader column={column}>User</SortHeader>,
//         cell: ({ row }) => {
//           const u = row.original;
//           const fullName = [u.FIRST_NAME, u.LAST_NAME].filter(Boolean).join(" ");

//           return (
//             <div className="flex items-center gap-3 py-1 ml-1">
//               <UserListAvatar user={u} />
//               <div className="flex flex-col min-w-0">
//                 <span className="text-sm font-medium text-gray-800 leading-tight">{u.USERNAME}</span>
//                 {fullName && (
//                   <span className="text-xs text-gray-400 truncate">
//                     {fullName}
//                     {u.EMP_NO && (
//                       <span className="ml-1 font-mono opacity-70">{u.EMP_NO}</span>
//                     )}
//                   </span>
//                 )}
//                 {u.LOCATION_NAME && (
//                   <span className="text-xs text-gray-300 truncate">
//                     {u.LOCATION_NAME}
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: "STATUS",
//         header: () => (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//             Status
//           </div>
//         ),
//         enableSorting: false,
//         cell: ({ row }) => {
//           const status = row.getValue("STATUS");
//           return (
//             <Badge
//               variant="outline"
//               className={cn(
//                 status === "ACTIVE"
//                   ? "bg-green-100 text-green-700 border-green-200"
//                   : "bg-gray-100 text-gray-500 border-gray-200",
//               )}
//             >
//               {status}
//             </Badge>
//           );
//         },
//       },
//       {
//         accessorKey: "CREATED_AT",
//         header: ({ column }) => (
//           <SortHeader column={column}>Created</SortHeader>
//         ),
//         cell: ({ row }) => (
//           <div className="text-sm text-gray-500">
//             {formatDate(row.getValue("CREATED_AT"))}
//           </div>
//         ),
//       },
//       {
//         id: "actions",
//         header: () => (
//           <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//             Actions
//           </div>
//         ),
//         enableHiding: false,
//         enableSorting: false,
//         cell: ({ row }) => {
//           const user = row.original;
//           const isActive = user.STATUS === "ACTIVE";
//           const isBusy = deleteMutation.isPending || activateMutation.isPending;

//           return (
//             <TooltipProvider>
//               <div className="flex items-center gap-1">
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 hover:bg-violet-50 hover:text-violet-700"
//                       onClick={() =>
//                         navigate(`/dashboard/user-management/users/${user.ID}`)
//                       }
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>View Details</TooltipContent>
//                 </Tooltip>

//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
//                       onClick={() => handlePassword(user)}
//                     >
//                       <KeyRound className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Change Password</TooltipContent>
//                 </Tooltip>

//                 {isActive ? (
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
//                         onClick={() => handleDelete(user)}
//                         disabled={isBusy}
//                       >
//                         {deleteMutation.isPending ? (
//                           <Spinner data-icon="inline-start" />
//                         ) : (
//                           <UserX className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Deactivate</TooltipContent>
//                   </Tooltip>
//                 ) : (
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10"
//                         onClick={() => handleActivate(user)}
//                         disabled={isBusy}
//                       >
//                         {activateMutation.isPending ? (
//                           <Spinner data-icon="inline-start" />
//                         ) : (
//                           <UserCheck className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>Activate</TooltipContent>
//                   </Tooltip>
//                 )}
//               </div>
//             </TooltipProvider>
//           );
//         },
//       },
//     ],
//     [deleteMutation.isPending, activateMutation.isPending],
//   );

//   // ── TanStack table ──────────────────────────────────────────────────────────
//   const table = useReactTable({
//     data: rows,
//     columns,
//     pageCount,
//     state: { pagination, columnVisibility, sorting },
//     onPaginationChange,
//     onSortingChange,
//     onColumnVisibilityChange: setColumnVisibility,
//     getCoreRowModel: getCoreRowModel(),
//     manualPagination: true,
//     manualSorting: true,
//     manualFiltering: true,
//   });

//   // ── Loading state ───────────────────────────────────────────────────────────
//   if (isLoading)
//     return (
//       <div className="p-4 md:p-6">
//         <PageHeader disabled />
//         <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
//           <div className="flex flex-col items-center justify-center py-16">
//             <Spinner className="h-10 w-10 mb-3" />
//             <p className="text-sm text-gray-500">Loading users...</p>
//           </div>
//         </div>
//       </div>
//     );

//   // ── Error state ─────────────────────────────────────────────────────────────
//   if (isError)
//     return (
//       <div className="p-4 md:p-6">
//         <PageHeader
//           onRefetch={refetch}
//           isFetching={isFetching}
//           onAdd={() => navigate("/dashboard/user-management/users/create")}
//         />
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Users</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Failed to load users."}</p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={refetch}
//               disabled={isFetching}
//               className="w-fit"
//             >
//               {isFetching ? (
//                 <>
//                   <Spinner className="mr-2 h-4 w-4" />
//                   Retrying...
//                 </>
//               ) : (
//                 <>
//                   <RefreshCw className="mr-2 h-4 w-4" />
//                   Retry
//                 </>
//               )}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );

//   // ── Main render ─────────────────────────────────────────────────────────────
//   return (
//     <div className="p-4 md:p-6">
//       <PageHeader
//         onRefetch={refetch}
//         isFetching={isFetching}
//         onAdd={() => navigate("/dashboard/user-management/users/create")}
//         total={total}
//       />

//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-5">
//         <div className="space-y-4">
//           {/* ── Filter Bar ─────────────────────────────────────────────── */}
//           <div className="flex flex-wrap items-center gap-2">
//             {/* Search — debounced 300ms */}
//             <SearchInput
//               placeholder="Search username..."
//               value={searchInput}
//               onChange={handleSearchChange}
//               onClear={() => {
//                 setSearchInput("");
//                 debouncedSearch("");
//               }}
//             />

//             {/* Role — Combobox */}
//             <FilterCombobox
//               placeholder="Role"
//               options={roleOptions}
//               value={roleId}
//               onValueChange={(v) => {
//                 setRoleId(v || null);
//                 setPage(1);
//               }}
//             />

//             {/* Reset all */}
//             {hasActiveFilters && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-9 border border-dashed border-gray-200 text-gray-500 hover:text-gray-700"
//                 onClick={clearAllFilters}
//               >
//                 Reset <IconX className="ml-2 h-4 w-4" />
//               </Button>
//             )}

//             {/* Columns — pushed right */}
//             <div className="ml-auto">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-9 font-medium bg-white border-gray-200"
//                   >
//                     <IconColumns3Filled className="size-3.5" /> Columns
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-[160px]">
//                   {table
//                     .getAllColumns()
//                     .filter((col) => col.getCanHide())
//                     .map((col) => (
//                       <DropdownMenuCheckboxItem
//                         key={col.id}
//                         className="capitalize"
//                         checked={col.getIsVisible()}
//                         onCheckedChange={(v) => col.toggleVisibility(!!v)}
//                       >
//                         {col.id.replace(/_/g, " ")}
//                       </DropdownMenuCheckboxItem>
//                     ))}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>

//           {/* Record count */}
//           <p className="text-xs text-gray-400">
//             {isFetching
//               ? "Loading records..."
//               : `${total.toLocaleString()} user${total !== 1 ? "s" : ""} found`}
//           </p>

//           {/* ── Table ──────────────────────────────────────────────────── */}
//           <div className="overflow-hidden rounded-md border border-gray-200">
//             <DataTable
//               table={table}
//               isFetching={isFetching}
//               loadingLabel="Loading users..."
//               headerClassName="bg-gray-50"
//               headCellClassName="text-xs font-semibold text-gray-500 uppercase tracking-wide"
//               rowClassName="hover:bg-gray-50/70 transition-colors"
//               cellClassName="text-sm text-gray-700"
//               empty={{
//                 colSpan: columns.length,
//                 icon: UsersIcon,
//                 title: "No Users Found",
//               }}
//             />
//           </div>

//           <DataTablePagination table={table} />
//         </div>
//       </div>

//       {isAddOpen && (
//         <AddUserDialog
//           open={isAddOpen}
//           onOpenChange={setIsAddOpen}
//           showConfirmation={showConfirmation}
//         />
//       )}
//       {isUpdateOpen && (
//         <UpdateUserDialog
//           open={isUpdateOpen}
//           onOpenChange={setIsUpdateOpen}
//           showConfirmation={showConfirmation}
//           user={selectedUser}
//         />
//       )}
//       {isPasswordOpen && (
//         <ChangePasswordDialog
//           open={isPasswordOpen}
//           onOpenChange={setIsPasswordOpen}
//           user={selectedUser}
//         />
//       )}
//       <ConfirmationDialog />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// //  PAGE HEADER
// // ─────────────────────────────────────────────────────────────────────────────

// function PageHeader({ isFetching, onRefetch, onAdd, disabled }) {
//   return (
//     <div className="rounded-lg bg-white border border-gray-200 shadow-sm mb-4">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4">
//         <div className="flex items-center gap-2">
//           <div className="flex items-center justify-center w-8 h-8 rounded-md bg-violet-50 text-violet-600">
//             <UsersIcon size={16} />
//           </div>
//           <div>
//             <h1 className="text-sm font-bold text-gray-900">Users</h1>
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem>
//                   <BreadcrumbLink asChild>
//                     <Link to="/" className="text-xs text-gray-400">Dashboard</Link>
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem className="text-xs text-gray-400">User Management</BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage className="text-xs text-gray-400">Users</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {onRefetch && (
//             <Button
//               variant="outline"
//               size="icon"
//               className="bg-white border-gray-200"
//               onClick={onRefetch}
//               disabled={isFetching || disabled}
//             >
//               <RefreshCw
//                 className={cn("h-4 w-4", isFetching && "animate-spin")}
//               />
//             </Button>
//           )}
//           <Button onClick={onAdd} disabled={disabled}>
//             <IconPlus size={18} className="mr-1" /> Add User
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import { create } from "zustand";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import {
  UserX,
  UserCheck,
  AlertCircle,
  RefreshCw,
  KeyRound,
  Eye,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  UsersIcon,
} from "lucide-react";
import { IconColumns3Filled, IconPlus, IconX } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTablePagination } from "@/components/DataTablePagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { getAvatarColor } from "@/lib/avatar-utils";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { SearchInput } from "@/components/shared/search-input";

import { useUsers, useDeleteUser, useActivateUser, useRoles } from "./queries";
import ChangePasswordDialog from "./change-password-dialog";

/* ──────────────────────────────────────────────────────────────
   Constants & helpers
   ────────────────────────────────────────────────────────────── */

const SORT_COLUMN_MAP = { user: "USERNAME", CREATED_AT: "CREATED_AT" };
const REVERSE_SORT_MAP = { USERNAME: "user", CREATED_AT: "CREATED_AT" };

// 4 columns, nothing pinned → narrow table. Below this container width, switch to rows.
const PHONE_BREAKPOINT = 520;
// Header pinning only when the page has more than ~15 rows
const PIN_HEADER_MIN_ROWS = 15;

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return format(new Date(d), "MMM dd, yyyy");
  } catch {
    return "—";
  }
};

const statusLabel = (s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : "—");

const fullNameOf = (u) => [u.FIRST_NAME, u.LAST_NAME].filter(Boolean).join(" ");

/* ──────────────────────────────────────────────────────────────
   Active row store — one id at a time, same id again clears it
   ────────────────────────────────────────────────────────────── */

const useActiveUserRow = create((set) => ({
  activeId: null,
  toggle: (id) => set((s) => ({ activeId: s.activeId === id ? null : id })),
  clear: () => set({ activeId: null }),
}));

/* ──────────────────────────────────────────────────────────────
   Container width (container query, not viewport media query)
   ────────────────────────────────────────────────────────────── */

function useContainerWidth(ref) {
  const [width, setWidth] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/* ──────────────────────────────────────────────────────────────
   Small building blocks
   ────────────────────────────────────────────────────────────── */

const ACTIVE_ROW_BG = "bg-[color-mix(in_oklab,var(--primary)_14%,var(--card))]";

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" };

function StatusBadge({ status }) {
  const active = status === "ACTIVE";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-border bg-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {statusLabel(status)}
    </Badge>
  );
}

// Sort arrow only on the active column. Click toggles asc/desc.
function SortHeader({ column, children }) {
  if (!column.getCanSort()) {
    return (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</span>
    );
  }
  const sorted = column.getIsSorted();
  return (
    <Button
      type="button"
      variant="ghost"
      className="-mx-2 h-8 gap-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      {sorted === "asc" && <ArrowUp className="size-3" aria-hidden="true" />}
      {sorted === "desc" && <ArrowDown className="size-3" aria-hidden="true" />}
    </Button>
  );
}

function FilterCombobox({ placeholder, options, value, onValueChange }) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  const hasValue = !!value;
  return (
    <Combobox
      items={options.map((o) => o.label)}
      value={selectedLabel}
      onValueChange={(label) => {
        if (!label) {
          onValueChange("");
          return;
        }
        const opt = options.find((o) => o.label === label);
        onValueChange(opt?.value ?? "");
      }}
    >
      <ComboboxInput placeholder={placeholder} showTrigger={!hasValue} showClear={hasValue} />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(label) => (
            <ComboboxItem key={label} value={label}>
              {label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function UserListAvatar({ user }) {
  const BASE = import.meta.env.VITE_API_BASE_URL;

  const urlsToTry = [
    `${BASE}/api/emp-images/person/${user.ID}`,
    user.EMPLOYEE_ID ? `${BASE}/api/emp-images/person/${user.EMPLOYEE_ID}` : null,
  ].filter(Boolean);

  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const initials =
    [user.FIRST_NAME?.[0], user.LAST_NAME?.[0]].filter(Boolean).join("").toUpperCase() ||
    user.USERNAME?.[0]?.toUpperCase();

  const handleError = () => {
    const next = srcIndex + 1;
    if (next < urlsToTry.length) setSrcIndex(next);
    else setFailed(true);
  };

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
        getAvatarColor(user.USERNAME),
      )}
    >
      {!failed ? (
        <img
          key={urlsToTry[srcIndex]}
          src={urlsToTry[srcIndex]}
          onError={handleError}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold text-white">{initials}</span>
      )}
    </div>
  );
}

function ActionButton({ label, icon, onClick, className, disabled, withLabels }) {
  const btn = (
    <Button
      type="button"
      variant="ghost"
      size={withLabels ? "default" : "icon"}
      className={cn(withLabels ? "h-10 gap-1.5 px-3" : "h-8 w-8", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {withLabels ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </Button>
  );
  if (withLabels) return btn; // no tooltips on touch
  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// Always visible. Clicks/keys never bubble to the row → never toggle the highlight.
function RowActions({ user, busy, isRowBusy, onView, onPassword, onDeactivate, onActivate, withLabels = false }) {
  const isActive = user.STATUS === "ACTIVE";
  return (
    <div
      className={cn("flex items-center gap-1", withLabels ? "flex-wrap justify-start" : "justify-end")}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <ActionButton
        label="View Details"
        withLabels={withLabels}
        icon={<Eye className="size-4" />}
        className="hover:bg-accent hover:text-accent-foreground"
        onClick={() => onView(user)}
      />
      <ActionButton
        label="Change Password"
        withLabels={withLabels}
        icon={<KeyRound className="size-4" />}
        className="text-amber-600 hover:bg-amber-500/10 hover:text-amber-700"
        onClick={() => onPassword(user)}
      />
      {isActive ? (
        <ActionButton
          label="Deactivate"
          withLabels={withLabels}
          icon={isRowBusy ? <Spinner className="size-4" /> : <UserX className="size-4" />}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={busy}
          onClick={() => onDeactivate(user)}
        />
      ) : (
        <ActionButton
          label="Activate"
          withLabels={withLabels}
          icon={isRowBusy ? <Spinner className="size-4" /> : <UserCheck className="size-4" />}
          className="text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
          disabled={busy}
          onClick={() => onActivate(user)}
        />
      )}
    </div>
  );
}

function SkeletonRows({ count = 8 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border" role="status" aria-label="Loading users">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex h-12 items-center gap-3 border-b border-border px-3 last:border-b-0">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          <div className="ml-auto h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filtered, onClear, onAdd }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border py-14 text-center">
      <UsersIcon className="size-10 text-muted-foreground/40" />
      <p className="text-sm font-medium text-foreground">
        {filtered ? "No users match the selected filters" : "No users yet"}
      </p>
      {filtered ? (
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          <IconX className="mr-1 size-4" /> Clear filters
        </Button>
      ) : (
        <Button type="button" size="sm" onClick={onAdd}>
          <IconPlus className="mr-1 size-4" /> Add first user
        </Button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

export default function UserList() {
  const navigate = useNavigate();

  // ── URL state via nuqs ──
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(20));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [roleId, setRoleId] = useQueryState("roleId", parseAsString.withDefault(""));
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString.withDefault("CREATED_AT"));
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", parseAsString.withDefault("DESC"));

  // ── Local UI state ──
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // phone: one open row
  const [searchInput, setSearchInput] = useState(search);

  const activeId = useActiveUserRow((s) => s.activeId);
  const toggleActive = useActiveUserRow((s) => s.toggle);

  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Filter data ──
  const { data: roles = [] } = useRoles();
  const roleOptions = roles.map((r) => ({ label: r.ROLE_NAME, value: String(r.ID) }));

  // ── Backend params ──
  const backendParams = useMemo(
    () => ({ page, limit, search, roleId, sortBy, sortOrder }),
    [page, limit, search, roleId, sortBy, sortOrder],
  );

  // ── Queries ──
  const { data: response, isLoading, isError, error, refetch, isFetching } = useUsers(backendParams);
  const deleteMutation = useDeleteUser();
  const activateMutation = useActivateUser();

  const rows = response?.data ?? [];
  const total = response?.pagination?.total ?? 0;
  const pageCount = response?.pagination?.totalPages ?? 1;

  // ── Debounced search ──
  const debouncedSearch = useDebouncedCallback((val) => {
    setSearch(val || null);
    setPage(1);
  }, 300);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  // ── Sorting bridge ──
  const sorting = useMemo(() => {
    if (!sortBy) return [];
    const columnId = REVERSE_SORT_MAP[sortBy] ?? sortBy;
    return [{ id: columnId, desc: sortOrder === "DESC" }];
  }, [sortBy, sortOrder]);

  const onSortingChange = useCallback(
    (updaterOrValue) => {
      const next = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      if (next.length === 0) {
        setSortBy("CREATED_AT");
        setSortOrder("DESC");
      } else {
        setSortBy(SORT_COLUMN_MAP[next[0].id] ?? "CREATED_AT");
        setSortOrder(next[0].desc ? "DESC" : "ASC");
        setPage(1);
      }
    },
    [sorting, setSortBy, setSortOrder, setPage],
  );

  // ── Pagination bridge ──
  const pagination = useMemo(() => ({ pageIndex: page - 1, pageSize: limit }), [page, limit]);

  const onPaginationChange = useCallback(
    (updaterOrValue) => {
      const next = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;
      setPage(next.pageIndex + 1);
      setLimit(next.pageSize);
    },
    [pagination, setPage, setLimit],
  );

  // ── Filter helpers ──
  const hasActiveFilters = !!(search || roleId);

  const clearAllFilters = () => {
    setSearchInput("");
    setSearch(null);
    setRoleId(null);
    setPage(1);
  };

  // ── Action handlers ──
  const handleView = (user) => navigate(`/dashboard/user-management/users/${user.ID}`);
  const handleAdd = () => navigate("/dashboard/user-management/users/create");

  const handlePassword = (user) => {
    setSelectedUser(user);
    setIsPasswordOpen(true);
  };

  const handleDelete = async (user) => {
    const confirmed = await showConfirmation({
      title: "Deactivate user?",
      description: `Are you sure you want to deactivate "${user.USERNAME}"?`,
      confirmText: "Deactivate",
      cancelText: "Cancel",
      variant: "destructive",
    });
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync(user.ID);
      toast.success("User deactivated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to deactivate user.");
    }
  };

  const handleActivate = async (user) => {
    const confirmed = await showConfirmation({
      title: "Activate user?",
      description: `Are you sure you want to activate "${user.USERNAME}"?`,
      confirmText: "Activate",
      cancelText: "Cancel",
    });
    if (!confirmed) return;
    try {
      await activateMutation.mutateAsync(user.ID);
      toast.success("User activated successfully!");
    } catch (err) {
      toast.error(err?.message || "Failed to activate user.");
    }
  };

  const busy = deleteMutation.isPending || activateMutation.isPending;
  const isRowBusy = (user) =>
    (deleteMutation.isPending && deleteMutation.variables === user.ID) ||
    (activateMutation.isPending && activateMutation.variables === user.ID);

  const actionProps = (user) => ({
    user,
    busy,
    isRowBusy: isRowBusy(user),
    onView: handleView,
    onPassword: handlePassword,
    onDeactivate: handleDelete,
    onActivate: handleActivate,
  });

  /* ── Columns ──
     Identity: user · State: STATUS · Date: CREATED_AT · Action: actions
     4 columns → narrow table: no pinning, no horizontal scroll. */
  const columns = [
    {
      id: "user",
      accessorFn: (row) => row.USERNAME,
      meta: { label: "User", align: "left", flex: true, minWidth: 260 },
      header: ({ column }) => <SortHeader column={column}>User</SortHeader>,
      cell: ({ row }) => {
        const u = row.original;
        const fullName = fullNameOf(u);
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              {/* One line: avatar · username · muted full name + emp no. Location lives in the tooltip. */}
              <div className="flex min-w-0 items-center gap-3">
                <UserListAvatar user={u} />
                <span className="shrink-0 text-sm font-medium text-foreground">{u.USERNAME}</span>
                {(fullName || u.EMP_NO) && (
                  <span className="min-w-0 truncate text-xs text-muted-foreground">
                    {fullName}
                    {u.EMP_NO && <span className="ml-1.5 font-mono opacity-70">{u.EMP_NO}</span>}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-0.5">
                <div className="font-medium">{u.USERNAME}</div>
                {fullName && <div>{fullName}</div>}
                {u.EMP_NO && <div className="font-mono">{u.EMP_NO}</div>}
                {u.LOCATION_NAME && <div>{u.LOCATION_NAME}</div>}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "STATUS",
      enableSorting: false,
      meta: { label: "Status", align: "center", width: 130 },
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <StatusBadge status={row.getValue("STATUS")} />
        </div>
      ),
    },
    {
      accessorKey: "CREATED_AT",
      meta: { label: "Created", align: "left", width: 150 },
      header: ({ column }) => <SortHeader column={column}>Created</SortHeader>,
      cell: ({ row }) => <span className="text-sm text-foreground">{formatDate(row.getValue("CREATED_AT"))}</span>,
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      meta: { align: "right", width: 140 },
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</span>
      ),
      cell: ({ row }) => <RowActions {...actionProps(row.original)} />,
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    pageCount,
    state: { pagination, columnVisibility, sorting },
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const bodyRef = useRef(null);
  const bodyWidth = useContainerWidth(bodyRef);
  const isPhone = bodyWidth !== null && bodyWidth < PHONE_BREAKPOINT;
  const pinHeader = rows.length > PIN_HEADER_MIN_ROWS;

  /* ── Renderers ── */

  const renderDesktopTable = () => (
    <div
      className={cn("overflow-auto rounded-xl border border-border", isFetching && "opacity-60 transition-opacity")}
      style={pinHeader ? { maxHeight: "calc(100dvh - 12rem)" } : undefined}
      aria-busy={isFetching}
    >
      {/* Plain <table> inside ONE scroll container */}
      <table className="w-full border-separate border-spacing-0 text-sm">
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
                    style={{ width: meta.flex ? undefined : meta.width, minWidth: meta.minWidth ?? meta.width }}
                    className={cn(
                      "h-11 whitespace-nowrap border-b border-border bg-muted px-3 font-medium",
                      ALIGN[meta.align ?? "left"],
                      pinHeader && "sticky top-0 z-20",
                    )}
                  >
                    {h.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex",
                          meta.align === "center" ? "justify-center" : meta.align === "right" ? "justify-end" : "justify-start",
                        )}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const id = row.original.ID;
            const isActive = activeId === id;
            return (
              <tr
                key={row.id}
                tabIndex={0}
                aria-current={isActive ? "true" : undefined}
                onClick={() => toggleActive(id)}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    toggleActive(id);
                  }
                }}
                className={cn(
                  "cursor-pointer outline-none transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                  isActive ? ACTIVE_ROW_BG : "hover:bg-muted",
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta ?? {};
                  return (
                    <td
                      key={cell.id}
                      style={{
                        width: meta.flex ? "100%" : meta.width,
                        minWidth: meta.minWidth ?? meta.width,
                        // flexible column absorbs slack and lets inner text truncate
                        maxWidth: meta.flex ? 0 : undefined,
                      }}
                      className={cn(
                        "h-12 whitespace-nowrap border-b border-border px-3 align-middle",
                        ALIGN[meta.align ?? "left"],
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderPhoneList = () => (
    <div className="space-y-3">
      {/* Sorting lives above the list on phone */}
      <div className="flex items-center gap-2">
        <Label htmlFor="user-sort" className="sr-only">
          Sort by
        </Label>
        <select
          id="user-sort"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="h-11 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="CREATED_AT">Created</option>
          <option value="USERNAME">Username</option>
        </select>
        <Button
          type="button"
          variant="outline"
          className="size-11"
          onClick={() => {
            setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
            setPage(1);
          }}
          aria-label={sortOrder === "DESC" ? "Sorted descending, switch to ascending" : "Sorted ascending, switch to descending"}
        >
          {sortOrder === "DESC" ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />}
        </Button>
      </div>

      <ul className={cn("overflow-hidden rounded-xl border border-border", isFetching && "opacity-60 transition-opacity")}>
        {rows.map((u) => {
          const open = expandedId === u.ID;
          const fullName = fullNameOf(u);
          return (
            <li key={u.ID} className="border-b border-border bg-card last:border-b-0">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpandedId(open ? null : u.ID)}
                className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <UserListAvatar user={u} />
                <div className="min-w-0 flex-1">
                  {/* Line 1: identity left, state right (no value column) */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="line-clamp-2 min-w-0 break-words text-sm font-medium text-foreground">
                      {u.USERNAME}
                    </span>
                    <StatusBadge status={u.STATUS} />
                  </div>
                  {/* Line 2: secondary info */}
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="min-w-0 truncate">
                      {fullName}
                      {u.EMP_NO && <span className="ml-1.5 font-mono opacity-70">{u.EMP_NO}</span>}
                    </span>
                    <span className="shrink-0">Created {formatDate(u.CREATED_AT)}</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Expand in place: only fields not already on the row + actions */}
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-3 px-3 pb-3">
                    <dl className="text-sm">
                      <dt className="text-xs text-muted-foreground">Location</dt>
                      <dd>{u.LOCATION_NAME || "—"}</dd>
                    </dl>
                    <RowActions {...actionProps(u)} withLabels />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const renderBody = () => {
    if (isLoading) return <SkeletonRows />;
    if (isError)
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Users</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Failed to load users."}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              <RefreshCw className={cn("mr-2 size-4", isFetching && "animate-spin")} />
              {isFetching ? "Retrying..." : "Retry"}
            </Button>
          </AlertDescription>
        </Alert>
      );
    if (rows.length === 0) return <EmptyState filtered={hasActiveFilters} onClear={clearAllFilters} onAdd={handleAdd} />;
    return isPhone ? renderPhoneList() : renderDesktopTable();
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6">
        <PageHeader onRefetch={() => refetch()} isFetching={isFetching} onAdd={handleAdd} />

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="space-y-4">
            {/* ── Filter bar ── */}
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                placeholder="Search username..."
                value={searchInput}
                onChange={handleSearchChange}
                onClear={() => {
                  setSearchInput("");
                  debouncedSearch("");
                }}
              />

              <FilterCombobox
                placeholder="Role"
                options={roleOptions}
                value={roleId}
                onValueChange={(v) => {
                  setRoleId(v || null);
                  setPage(1);
                }}
              />

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 border border-dashed border-border text-muted-foreground hover:text-foreground"
                  onClick={clearAllFilters}
                >
                  Reset <IconX className="ml-2 size-4" />
                </Button>
              )}

              {/* Columns toggle: desktop table only */}
              {!isPhone && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" size="sm" className="h-9 font-medium">
                        <IconColumns3Filled className="size-3.5" /> Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      {table
                        .getAllColumns()
                        .filter((col) => col.getCanHide())
                        .map((col) => (
                          <DropdownMenuCheckboxItem
                            key={col.id}
                            checked={col.getIsVisible()}
                            onCheckedChange={(v) => col.toggleVisibility(!!v)}
                          >
                            {col.columnDef.meta?.label ?? col.id}
                          </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Record count */}
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading records..."
                : isError
                  ? "Error loading records"
                  : isFetching
                    ? "Updating..."
                    : `${total.toLocaleString()} user${total !== 1 ? "s" : ""} found`}
            </p>

            {/* Table / phone list — container-query target */}
            <div ref={bodyRef}>{renderBody()}</div>

            {!isLoading && !isError && rows.length > 0 && <DataTablePagination table={table} />}
          </div>
        </div>

        {isPasswordOpen && (
          <ChangePasswordDialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen} user={selectedUser} />
        )}
        <ConfirmationDialog />
      </div>
    </TooltipProvider>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page header
   ────────────────────────────────────────────────────────────── */

function PageHeader({ isFetching, onRefetch, onAdd }) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UsersIcon size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Users</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="text-xs text-muted-foreground">
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-xs text-muted-foreground">User Management</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xs text-muted-foreground">Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={onRefetch} disabled={isFetching} aria-label="Refresh">
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
          </Button>
          <Button type="button" onClick={onAdd}>
            <IconPlus size={18} className="mr-1" /> Add User
          </Button>
        </div>
      </div>
    </div>
  );
}
