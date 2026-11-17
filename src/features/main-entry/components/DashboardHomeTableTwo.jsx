"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Pencil,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  FileUser,
  CheckCircle,
  BadgeCheck,
  Clock,
  Search,
  ReceiptText,
  Eye,
  Upload,
  X,
  FileText,
  Paperclip as PaperclipIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/DataTablePagination";
import { cn } from "@/lib/utils";
// zustand store — active (highlighted) row id; file ta @/stores/ e rakho
import { useActiveRowStore } from "@/hooks/use-active-row-store";
import axios from "axios";
import { toast } from "react-toastify";
import { useHasPermission } from "@/hooks/use-permission";
// Path ta folder structure onujayi thik kore nio (payment table-er same component)
import { EntryTypeBadge } from "./entry-type-badge";
import { AttachmentIndicator } from "./attachment-indicator";

// ── Guide ── path ta tomar folder onujayi adjust koro
import { PageGuideSheet } from "../approval-guide/page-guide-sheet";

import { approvalVoucherGuide } from "../approval-guide/approval-voucher-guide";

const url = import.meta.env.VITE_API_BASE_URL;

// ── Doc delete request ──
// Backend e DELETE route kon style e ache sheta confirm hole ekhane-i change koro.
const gldocDeleteRequest = (docId) =>
  axios.delete(`${url}/api/gldoc/${docId}`);
// const gldocDeleteRequest = (docId) =>
//   axios.delete(`${url}/api/gldoc`, { params: { id: docId } });

/* ───────────────────────── helpers ───────────────────────── */

const getVoucherTypeLabel = (type) => {
  switch (String(type)) {
    case "1": return "Receive";
    case "2": return "Payment";
    case "3": return "Journal";
    case "4": return "Bank Transfer";
    default: return "Unknown";
  }
};

const VOUCHER_TYPE_COLOR = {
  1: "text-green-800 bg-green-100",
  2: "text-red-800 bg-red-100",
  3: "text-blue-800 bg-blue-100",
  4: "text-purple-800 bg-purple-100",
};

const getEditRoute = (type, id) => {
  switch (String(type)) {
    case "1": return `/dashboard/receive-edit/${id}`;
    case "2": return `/dashboard/payment-edit/${id}`;
    case "3": return `/dashboard/journal-edit/${id}`;
    default: return `/dashboard/cash-transfer`;
  }
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const toISODateString = (val) => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getAmount = (item) => {
  const debit = parseFloat(item.TOTAL_DEBIT || 0);
  const credit = parseFloat(item.TOTAL_CREDIT || 0);
  return debit !== 0 ? debit : credit;
};

const VOUCHER_TYPE_OPTIONS = [
  { value: "1", label: "Receive" },
  { value: "2", label: "Payment" },
  { value: "3", label: "Journal" },
  { value: "4", label: "Bank Transfer" },
];

const isRowApproved = (item, approvedIds) =>
  item.POSTED === 1 || item.POSTED === "1" || approvedIds.has(item.ID);

// Fixed row height (48px)
const ROW_HEIGHT = "h-12";

const MOBILE_SORTS = [
  { value: "date-desc", label: "GL Date: newest first", sort: [{ id: "GL_ENTRY_DATE", desc: true }] },
  { value: "date-asc", label: "GL Date: oldest first", sort: [{ id: "GL_ENTRY_DATE", desc: false }] },
  { value: "amount-desc", label: "Amount: high to low", sort: [{ id: "AMOUNT", desc: true }] },
  { value: "amount-asc", label: "Amount: low to high", sort: [{ id: "AMOUNT", desc: false }] },
  { value: "no-asc", label: "Voucher No: A to Z", sort: [{ id: "VOUCHERNO", desc: false }] },
];

// Skill: container query threshold ~ pinned + 3 scrolling cols * 115px ≈ 800px
const ROW_LAYOUT_BREAKPOINT = 800;

const ALIGN = { left: "text-left", center: "text-center", right: "text-right" };
const HEAD_JUSTIFY = { left: "justify-start", center: "justify-center", right: "justify-end" };

// Container width observer (viewport media query na, container query)
function useContainerWidth() {
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(1200);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/* ───────────────────────── small components ───────────────────────── */

const ApprovedPill = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
    <BadgeCheck size={14} />
    Approved
  </span>
);

const VoucherTypeBadge = ({ type }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${VOUCHER_TYPE_COLOR[type] || "text-gray-800 bg-gray-100"}`}
  >
    {getVoucherTypeLabel(type)}
  </span>
);

// Sort arrow shudhu active column e
const SortableHeader = ({ column, label, align = "left" }) => {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide rounded-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
        HEAD_JUSTIFY[align]
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      {sorted === "asc" && <ArrowUp className="h-3 w-3" aria-hidden />}
      {sorted === "desc" && <ArrowDown className="h-3 w-3" aria-hidden />}
    </button>
  );
};

const StaticHeader = ({ label, align = "left" }) => (
  <div className={cn("text-xs font-semibold text-gray-500 uppercase tracking-wide", ALIGN[align])}>
    {label}
  </div>
);

// Desktop (icon) ar phone (labeled) duto layout e same actions
function RowActions({
  item,
  approved,
  canEdit,
  canApprove,
  onUpload,
  onReview,
  onApprove,
  variant = "icon",
}) {
  const editRoute = getEditRoute(item.VOUCHER_TYPE, item.ID);

  if (variant === "labeled") {
    return (
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <Button variant="outline" className="h-11 gap-2 px-4" onClick={() => onReview(item)}>
            <Eye size={16} /> View
          </Button>
        )}
        {!approved && (
          <Button variant="outline" className="h-11 gap-2 px-4" onClick={() => onUpload(item)}>
            <Upload size={16} /> Upload
          </Button>
        )}
        {!approved && canEdit && (
          <Button asChild variant="outline" className="h-11 gap-2 px-4">
            <Link to={editRoute}>
              <Pencil size={16} /> Edit
            </Link>
          </Button>
        )}
        {!approved && canApprove && (
          <Button
            variant="outline"
            className="h-11 gap-2 px-4 border-green-200 text-green-700 hover:bg-green-50"
            onClick={() => onApprove(item.ID)}
          >
            <FileUser size={16} /> Approve
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <div className="flex items-center gap-1">
        {/* Upload Invoice */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={approved ? 0 : -1}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => onUpload(item)}
                disabled={approved}
                aria-label="Upload Invoice"
              >
                <Upload size={16} />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {approved ? "Cannot upload (approved)" : "Upload Invoice"}
          </TooltipContent>
        </Tooltip>

        {/* Review (approved) / Edit (not approved) */}
        {approved && canEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700"
                onClick={() => onReview(item)}
                aria-label="Review Voucher"
              >
                <Eye size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Review Voucher</TooltipContent>
          </Tooltip>
        )}

        {!approved && canEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
              >
                <Link to={editRoute} aria-label="Edit Voucher">
                  <Pencil size={16} />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit Voucher</TooltipContent>
          </Tooltip>
        )}

        {!approved && canApprove && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                onClick={() => onApprove(item.ID)}
                aria-label="Approve Voucher"
              >
                <FileUser size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-green-700 text-white text-xs">
              Approve Voucher
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* State always visible: color + icon + text */}
      {approved && <ApprovedPill />}
    </div>
  );
}

/* ───────────────────────── columns ───────────────────────── */
// meta: { align, pinPos, className }
//  - Identity (VOUCHERNO) + checkbox: left pinned
//  - Actions: right pinned
//  - Upload Invoice column ta Actions er moddhe merge kora hoyeche (action column ek-i thakbe)

const createColumns = ({ approvedIds, actionProps }) => [
  {
    id: "select",
    meta: { align: "center", pinPos: "left-0", className: "w-11 min-w-11 max-w-11" },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "VOUCHERNO",
    meta: {
      align: "left",
      pinPos: "left-11",
      className: "min-w-[150px] border-r border-r-gray-200",
    },
    enableHiding: false,
    header: ({ column }) => <SortableHeader column={column} label="Voucher No" />,
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.getValue("VOUCHERNO")}</span>
    ),
  },
  {
    accessorKey: "VOUCHER_TYPE",
    meta: { align: "left", className: "w-[130px] min-w-[130px]" },
    header: ({ column }) => <SortableHeader column={column} label="Voucher Type" />,
    cell: ({ row }) => <VoucherTypeBadge type={row.getValue("VOUCHER_TYPE")} />,
  },
  {
    accessorKey: "GL_ENTRY_DATE",
    meta: { align: "left", className: "w-[120px] min-w-[120px]" },
    header: ({ column }) => <SortableHeader column={column} label="Gl Date" />,
    cell: ({ row }) => (
      <span className="text-gray-600 tabular-nums">{formatDate(row.getValue("GL_ENTRY_DATE"))}</span>
    ),
  },
  {
    accessorKey: "DESCRIPTION",
    meta: { align: "left", className: "w-full min-w-[240px] max-w-0" },
    header: ({ column }) => <SortableHeader column={column} label="Description" />,
    cell: ({ row }) => {
      const text = row.getValue("DESCRIPTION");
      if (!text) return <span className="text-gray-400">—</span>;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="truncate text-gray-600">{text}</div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-sm whitespace-normal">
            {text}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "AMOUNT",
    accessorFn: (row) => getAmount(row),
    meta: { align: "right", className: "w-[150px] min-w-[150px]" },
    header: ({ column }) => <SortableHeader column={column} label="Debit/Credit" align="right" />,
    cell: ({ row }) => (
      <span className="font-semibold text-gray-800 tabular-nums">
        {formatMoney(getAmount(row.original))}
      </span>
    ),
  },
  {
    id: "type",
    meta: { align: "center", className: "w-[110px] min-w-[110px]" },
    enableSorting: false,
    header: () => <StaticHeader label="Type" align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <EntryTypeBadge type={row.original.TYPE} />
      </div>
    ),
  },
  {
    id: "attachment",
    meta: { align: "center", className: "w-[130px] min-w-[130px]" },
    enableSorting: false,
    header: () => <StaticHeader label="Invoice Count" align="center" />,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <AttachmentIndicator count={row.original.DOC_COUNT} />
      </div>
    ),
  },
  {
    id: "actions",
    meta: {
      align: "right",
      pinPos: "right-0",
      className: "w-[210px] min-w-[210px] border-l border-l-gray-200",
    },
    enableHiding: false,
    enableSorting: false,
    header: () => <StaticHeader label="Actions" align="right" />,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <RowActions
          item={item}
          approved={isRowApproved(item, approvedIds)}
          {...actionProps}
        />
      );
    },
  },
];

/* ───────────────────────── phone list ───────────────────────── */

function MobileVoucherList({
  rows,
  isLoading,
  error,
  refetch,
  approvedIds,
  actionProps,
  emptyState,
}) {
  const [expandedId, setExpandedId] = React.useState(null);

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="min-h-[64px] space-y-2 px-4 py-3 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>
            <div className="h-4 w-40 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-gray-200 p-6 text-center">
        <p className="text-sm text-red-600">{approvalVoucherGuide.states.error}</p>
        <Button variant="outline" className="mt-3 h-11" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (rows.length === 0) return emptyState;

  return (
    <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
      {rows.map((row) => {
        const item = row.original;
        const open = expandedId === item.ID;
        const approved = isRowApproved(item, approvedIds);
        return (
          <li key={row.id}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setExpandedId(open ? null : item.ID)}
              className="flex min-h-[64px] w-full items-start gap-2 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                {/* Line 1: identity left, key value right */}
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {item.VOUCHERNO}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-gray-800 tabular-nums">
                    {formatMoney(getAmount(item))}
                  </span>
                </div>
                {/* Line 2: state + secondary */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <VoucherTypeBadge type={item.VOUCHER_TYPE} />
                  {approved ? (
                    <ApprovedPill />
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                      <Clock size={12} /> Pending
                    </span>
                  )}
                  <span className="text-xs text-gray-500 tabular-nums">
                    GL {formatDate(item.GL_ENTRY_DATE)}
                  </span>
                </div>
              </div>
              <ChevronDown
                size={18}
                aria-hidden
                className={cn(
                  "mt-0.5 shrink-0 text-gray-400 transition-transform duration-200 ease-out motion-reduce:transition-none",
                  open && "rotate-180"
                )}
              />
            </button>

            {/* Expand: shudhu row te nai emon field + action buttons */}
            <div
              aria-hidden={!open}
              className={cn(
                "grid transition-[grid-template-rows,opacity,visibility] duration-200 ease-out motion-reduce:transition-none",
                open ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-3 px-4 pb-4">
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Description
                      </dt>
                      <dd className="line-clamp-2 text-gray-700">{item.DESCRIPTION || "—"}</dd>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          Type
                        </dt>
                        <dd className="mt-0.5">
                          <EntryTypeBadge type={item.TYPE} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                          Invoice Count
                        </dt>
                        <dd className="mt-0.5">
                          <AttachmentIndicator count={item.DOC_COUNT} />
                        </dd>
                      </div>
                    </div>
                  </dl>
                  <RowActions
                    item={item}
                    approved={approved}
                    variant="labeled"
                    {...actionProps}
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ───────────────────────── main component ───────────────────────── */

export function DashboardHomeTableTwo() {
  const queryClient = useQueryClient();
  const [containerRef, containerWidth] = useContainerWidth();
  const isNarrow = containerWidth < ROW_LAYOUT_BREAKPOINT;

  const [confirmId, setConfirmId] = React.useState(null);
  const [isApproving, setIsApproving] = React.useState(false);

  const canEdit = useHasPermission("HOME_VOUCHER_EDIT");
  const canApprove = useHasPermission("HOME_VOUCHER_APPROVE");

  const [approvedIds, setApprovedIds] = React.useState(new Set());
  const [voucherTypeFilter, setVoucherTypeFilter] = React.useState("all");
  const [glDateFrom, setGlDateFrom] = React.useState("");
  const [glDateTo, setGlDateTo] = React.useState("");
  const [mobileSort, setMobileSort] = React.useState("date-desc");

  // ── Upload state ──
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [selectedVoucher, setSelectedVoucher] = React.useState(null);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  // ── Review state ──
  const [reviewVoucher, setReviewVoucher] = React.useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["unpostedVouchers"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/info-list`);
      return res.data;
    },
  });

  const apiData = Array.isArray(data?.vouchers) ? data.vouchers : [];

  const guidePermissions = {
    HOME_VOUCHER_EDIT: canEdit,
    HOME_VOUCHER_APPROVE: canApprove,
  };

  const confirmVoucher = apiData.find((v) => v.ID === confirmId);

  // ── Existing docs for the Upload dialog ──
  const { data: existingDocs = [], refetch: refetchDocs } = useQuery({
    queryKey: ["gldocs", selectedVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gldoc`, {
        params: { glmaster_id: selectedVoucher.ID },
      });
      return res.data.data || [];
    },
    enabled: !!selectedVoucher,
  });

  // ── Upload mutation ──
  const uploadMutation = useMutation({
    mutationFn: async ({ voucherId, files }) => {
      const uploads = files.map((file) => {
        const fd = new FormData();
        fd.append("doc_file", file);
        fd.append("GLMASTERID", voucherId);
        return axios.post(`${url}/api/gldoc`, fd);
      });
      return await Promise.all(uploads);
    },
    onSuccess: async () => {
      toast.success("Invoice uploaded successfully!");
      setSelectedFiles([]);
      await refetchDocs();
      queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
    },
    onError: (err) => {
      toast.error("Failed to upload invoice: " + (err.response?.data?.message || err.message));
    },
    onSettled: () => setUploading(false),
  });

  // ── Delete document mutation ──
  const deleteDocMutation = useMutation({
    mutationFn: (docId) => gldocDeleteRequest(docId),
    onSuccess: async () => {
      toast.success("Document deleted successfully!");
      await refetchDocs();
      queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
    },
    onError: (err) => {
      toast.error("Failed to delete document: " + (err.response?.data?.message || err.message));
    },
  });

  // ── Review modal: master + details ──
  const { data: reviewData, isLoading: reviewLoading } = useQuery({
    queryKey: ["voucherReview", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/voucher-review/${reviewVoucher.ID}`);
      return res.data;
    },
    enabled: !!reviewVoucher,
  });

  // ── Review modal: attachments ──
  const { data: reviewDocs = [] } = useQuery({
    queryKey: ["gldocs", "review", reviewVoucher?.ID],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gldoc`, {
        params: { glmaster_id: reviewVoucher.ID },
      });
      return res.data.data || [];
    },
    enabled: !!reviewVoucher,
  });

  const distributionRows = React.useMemo(() => {
    const details = reviewData?.details || [];
    return details
      .map((d) => ({
        id: d.ID ?? d.id,
        code: d.CODE ?? d.code ?? "",
        codedescription: d.CODEDESCRIPTION ?? d.codedescription ?? "",
        description: d.DESCRIPTION ?? d.description ?? "",
        debit: Number(d.DEBIT ?? d.debit ?? 0),
        credit: Number(d.CREDIT ?? d.credit ?? 0),
      }))
      .filter((d) => d.debit > 0 || d.credit > 0);
  }, [reviewData]);

  const totalDebit = distributionRows.reduce((s, d) => s + d.debit, 0);
  const totalCredit = distributionRows.reduce((s, d) => s + d.credit, 0);

  // ── voucher type + GL date range filter ──
  const filteredData = React.useMemo(() => {
    return apiData.filter((v) => {
      if (voucherTypeFilter !== "all" && String(v.VOUCHER_TYPE) !== voucherTypeFilter) {
        return false;
      }
      if (glDateFrom || glDateTo) {
        const d = toISODateString(v.GL_ENTRY_DATE);
        if (!d) return false;
        if (glDateFrom && d < glDateFrom) return false;
        if (glDateTo && d > glDateTo) return false;
      }
      return true;
    });
  }, [apiData, voucherTypeFilter, glDateFrom, glDateTo]);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleActivateVoucher = async () => {
    if (!confirmId) return;
    setIsApproving(true);
    try {
      const res = await axios.get(`${url}/api/active-voucher?id=${confirmId}`);
      if (res.data.success) {
        setApprovedIds((prev) => new Set([...prev, confirmId]));
        queryClient.invalidateQueries({ queryKey: ["unpostedVouchers"] });
      } else {
        alert(res.data.message || "Failed to approve voucher");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setIsApproving(false);
      setConfirmId(null);
    }
  };

  // ── Upload handlers ──
  const closeUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedVoucher(null);
    setSelectedFiles([]);
  };

  const handleUploadClick = React.useCallback((voucher) => {
    setSelectedVoucher(voucher);
    setSelectedFiles([]);
    setUploadDialogOpen(true);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }
    setUploading(true);
    uploadMutation.mutate({ voucherId: selectedVoucher.ID, files: selectedFiles });
  };

  const actionProps = React.useMemo(
    () => ({
      canEdit,
      canApprove,
      onUpload: handleUploadClick,
      onReview: setReviewVoucher,
      onApprove: setConfirmId,
    }),
    [canEdit, canApprove, handleUploadClick]
  );

  const columns = React.useMemo(
    () => createColumns({ approvedIds, actionProps }),
    [approvedIds, actionProps]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 50 } },
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const handleMobileSort = (value) => {
    setMobileSort(value);
    const opt = MOBILE_SORTS.find((o) => o.value === value);
    if (opt) setSorting(opt.sort);
  };

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const selectedCount = Object.keys(rowSelection).length;
  const hasActiveFilters =
    voucherTypeFilter !== "all" ||
    !!glDateFrom ||
    !!glDateTo ||
    !!table.getColumn("VOUCHERNO")?.getFilterValue();
  const pinHeader = rows.length > 15; // ~15 row ba kom hole pin korar dorkar nai

  const clearFilters = () => {
    setVoucherTypeFilter("all");
    setGlDateFrom("");
    setGlDateTo("");
    table.getColumn("VOUCHERNO")?.setFilterValue("");
  };

  const reviewMaster = reviewData?.master || {};
  const reviewApproved = reviewVoucher ? isRowApproved(reviewVoucher, approvedIds) : false;

  // Row click → shudhu row highlight (zustand). Detail khulbe na.
  // Same row e abar click korle highlight remove hobe.
  const activeRowId = useActiveRowStore((s) => s.activeRowId);
  const toggleActiveRow = useActiveRowStore((s) => s.toggleActiveRow);

  const handleRowClick = (e, item) => {
    if (e.target.closest("button, a, input, [role='checkbox']")) return;
    toggleActiveRow(item.ID);
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-gray-200 px-4 py-10 text-center">
      <p className="text-sm font-medium text-gray-700">{approvalVoucherGuide.states.emptyTitle}</p>
      <p className="text-xs text-gray-500">{approvalVoucherGuide.states.emptyText}</p>
      {hasActiveFilters && (
        <Button variant="outline" className="mt-3 h-10" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="p-4 md:p-6">
        <div ref={containerRef} className="rounded-lg bg-white border border-gray-200 shadow-sm">
          {/* Approve Confirmation Dialog */}
          <AlertDialog
            open={!!confirmId}
            onOpenChange={() => !isApproving && setConfirmId(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  Approve this voucher?
                </AlertDialogTitle>

                <AlertDialogDescription asChild>
                  <div className="space-y-3 text-sm">
                    <p>
                      Voucher <strong>{confirmVoucher?.VOUCHERNO}</strong> (
                      {getVoucherTypeLabel(confirmVoucher?.VOUCHER_TYPE)}) will be marked as
                      approved.
                    </p>
                    <div>
                      <p>After approval:</p>
                      <ul className="list-disc pl-5">
                        <li>It can no longer be edited</li>
                        <li>No invoice can be uploaded</li>
                        <li>You can only view it using the Review icon</li>
                      </ul>
                    </div>
                    <p>
                      <span className="text-red-500 font-medium">This cannot be undone.</span>{" "}
                      Please check the amounts and attached invoices first.
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleActivateVoucher}
                  disabled={isApproving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isApproving ? "Approving..." : "Yes, Approve"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600">
                <ReceiptText size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Approval Voucher</h2>
                <p className="text-xs text-gray-400">
                  {filteredData.length} of {apiData.length} — all vouchers
                </p>
              </div>
            </div>

            <PageGuideSheet guide={approvalVoucherGuide} can={guidePermissions} />
          </div>

          <div className="p-5 space-y-4">
            {/* <IconLegend
              items={approvalVoucherGuide.legend}
              can={guidePermissions}
              storageKey="approval-voucher"
            /> */}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Filter voucher no..."
                  value={table.getColumn("VOUCHERNO")?.getFilterValue() ?? ""}
                  onChange={(e) =>
                    table.getColumn("VOUCHERNO")?.setFilterValue(e.target.value)
                  }
                  className="pl-9 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-blue-300"
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
                  <SelectTrigger className="bg-white border-gray-200 focus:ring-1 focus:ring-blue-300">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {VOUCHER_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GL From Date */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Gl From Date
                </label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={glDateFrom}
                    max={glDateTo || undefined}
                    onChange={(e) => setGlDateFrom(e.target.value)}
                    className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                  />
                  {glDateFrom && (
                    <button
                      type="button"
                      onClick={() => setGlDateFrom("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      title="Clear from date"
                      aria-label="Clear from date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* GL To Date */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  To Date
                </label>
                <div className="relative w-full sm:w-40">
                  <Input
                    type="date"
                    value={glDateTo}
                    min={glDateFrom || undefined}
                    onChange={(e) => setGlDateTo(e.target.value)}
                    className="pr-8 bg-white border-gray-200 focus-visible:ring-1 focus-visible:ring-violet-300"
                  />
                  {glDateTo && (
                    <button
                      type="button"
                      onClick={() => setGlDateTo("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      title="Clear to date"
                      aria-label="Clear to date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop-only controls: density + columns */}
              {!isNarrow && (
                <div className="flex items-center gap-2 sm:ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white border-gray-200">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table
                        .getAllColumns()
                        .filter((col) => col.getCanHide())
                        .map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Phone: sorting control list er upore */}
              {isNarrow && (
                <div className="w-full">
                  <Select value={mobileSort} onValueChange={handleMobileSort}>
                    <SelectTrigger className="h-11 bg-white border-gray-200" aria-label="Sort by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOBILE_SORTS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Bulk action bar */}
            {!isNarrow && selectedCount > 0 && (
              <div
                role="status"
                className="flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900"
              >
                <span className="font-medium">{selectedCount} selected</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-blue-700 hover:bg-blue-100"
                  onClick={() => table.resetRowSelection()}
                >
                  Clear selection
                </Button>
              </div>
            )}

            {/* ── Phone rows ── */}
            {isNarrow ? (
              <MobileVoucherList
                rows={rows}
                isLoading={isLoading}
                error={error}
                refetch={refetch}
                approvedIds={approvedIds}
                actionProps={actionProps}
                emptyState={emptyState}
              />
            ) : (
              /* ── Desktop table: ek-i scroll container, bounded height ── */
              <div
                className={cn(
                  "overflow-auto rounded-md border border-gray-200",
                  pinHeader && "max-h-[calc(100dvh-12rem)]"
                )}
                aria-busy={isLoading}
              >
                <table className="w-full min-w-[1100px] border-separate border-spacing-0 text-sm">
                  <thead>
                    {table.getHeaderGroups().map((group) => (
                      <tr key={group.id}>
                        {group.headers.map((header) => {
                          const meta = header.column.columnDef.meta || {};
                          const sorted = header.column.getIsSorted();
                          return (
                            <th
                              key={header.id}
                              scope="col"
                              aria-sort={
                                header.column.getCanSort()
                                  ? sorted === "asc"
                                    ? "ascending"
                                    : sorted === "desc"
                                    ? "descending"
                                    : "none"
                                  : undefined
                              }
                              className={cn(
                                "sticky top-0 h-10 whitespace-nowrap border-b border-gray-200 bg-gray-50 px-3",
                                meta.pinPos ? "z-30" : "z-20",
                                meta.pinPos,
                                ALIGN[meta.align || "left"],
                                meta.className
                              )}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>

                  <tbody>
                    {/* Loading: real row layout-er moto skeleton */}
                    {isLoading &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <tr key={`sk-${i}`}>
                          {visibleColumns.map((col) => {
                            const meta = col.columnDef.meta || {};
                            return (
                              <td
                                key={col.id}
                                className={cn(
                                  "border-b border-gray-100 bg-white px-3",
                                  ROW_HEIGHT,
                                  meta.pinPos && `sticky z-10 ${meta.pinPos}`,
                                  meta.className
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-4 animate-pulse rounded bg-gray-200",
                                    meta.align === "right" && "ml-auto w-20",
                                    meta.align === "center" && "mx-auto w-12",
                                    (!meta.align || meta.align === "left") && "w-3/4"
                                  )}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                    {/* Error: message + retry */}
                    {!isLoading && error && (
                      <tr>
                        <td colSpan={visibleColumns.length} className="h-32 text-center">
                          <p className="text-sm text-red-600">{approvalVoucherGuide.states.error}</p>
                          <Button variant="outline" className="mt-3" onClick={() => refetch()}>
                            Retry
                          </Button>
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      !error &&
                      rows.map((row) => {
                        const item = row.original;
                        const selected = row.getIsSelected();
                        const active = activeRowId === item.ID;
                        const rowBg = active
                          ? "bg-indigo-100"
                          : selected
                          ? "bg-blue-50"
                          : "bg-white group-hover/row:bg-gray-50";
                        return (
                          <tr
                            key={row.id}
                            data-state={selected ? "selected" : undefined}
                            data-active={active ? "true" : undefined}
                            aria-current={active ? "true" : undefined}
                            tabIndex={0}
                            onClick={(e) => handleRowClick(e, item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.target === e.currentTarget) {
                                toggleActiveRow(item.ID);
                              }
                            }}
                            className="group/row cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300"
                          >
                            {row.getVisibleCells().map((cell) => {
                              const meta = cell.column.columnDef.meta || {};
                              return (
                                <td
                                  key={cell.id}
                                  className={cn(
                                    "whitespace-nowrap border-b border-gray-100 px-3 text-sm text-gray-700 transition-colors",
                                    ROW_HEIGHT,
                                    rowBg,
                                    meta.pinPos && `sticky z-10 ${meta.pinPos}`,
                                    ALIGN[meta.align || "left"],
                                    meta.className
                                  )}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}

                    {!isLoading && !error && rows.length === 0 && (
                      <tr>
                        <td colSpan={visibleColumns.length}>{emptyState}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <DataTablePagination table={table} />
          </div>
        </div>

        {/* ── Upload Invoice Dialog ── */}
        <Dialog
          open={uploadDialogOpen}
          onOpenChange={(open) => {
            if (uploading) return;
            if (!open) closeUploadDialog();
            else setUploadDialogOpen(true);
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload size={18} className="text-blue-600" />
                Upload Invoice
              </DialogTitle>
              <DialogDescription>
                Upload invoice for voucher #{selectedVoucher?.VOUCHERNO}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Supported: PDF, JPG, PNG, DOC (Max 5MB each)
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Selected Files ({selectedFiles.length})
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-gray-700 truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveFile(index)}
                          disabled={uploading}
                          aria-label="Remove file"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {existingDocs.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Existing Documents ({existingDocs.length})
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {existingDocs.map((doc) => (
                      <div
                        key={doc.ID}
                        className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2 text-sm"
                      >
                        <a
                          href={`${url}/api/gldoc?id=${doc.ID}&file=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-700 hover:underline min-w-0"
                        >
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {doc.FILE_NAME || `Document #${doc.ID}`}
                          </span>
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 shrink-0"
                          onClick={() => deleteDocMutation.mutate(doc.ID)}
                          disabled={uploading || deleteDocMutation.isPending}
                          aria-label="Delete document"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeUploadDialog} disabled={uploading}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUploadSubmit}
                disabled={selectedFiles.length === 0 || uploading}
              >
                {uploading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload {selectedFiles.length} file(s)
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Review Voucher Modal (read-only) ── */}
        {reviewVoucher && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
            <div
              role="dialog"
              aria-modal="true"
              className="bg-white rounded-2xl shadow-xl w-full md:w-2/3 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-indigo-600" />
                  <h2 className="text-base font-bold text-gray-900">
                    {getVoucherTypeLabel(reviewVoucher.VOUCHER_TYPE)} Voucher #{reviewVoucher.VOUCHERNO}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <EntryTypeBadge type={reviewVoucher.TYPE} />
                  <button
                    onClick={() => setReviewVoucher(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Voucher Type
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                    {getVoucherTypeLabel(reviewVoucher.VOUCHER_TYPE)}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    GL Date
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                    {formatDate(reviewVoucher.GL_ENTRY_DATE)}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Voucher No
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                    {reviewVoucher.VOUCHERNO}
                  </div>
                </div>
                {reviewMaster.TRANS_DATE && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                      Transaction Date
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700">
                      {formatDate(reviewMaster.TRANS_DATE)}
                    </div>
                  </div>
                )}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Description
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 min-h-[42px]">
                    {reviewVoucher.DESCRIPTION || "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Total Amount
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 tabular-nums">
                    {formatMoney(getAmount(reviewVoucher))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Status
                  </label>
                  {reviewApproved ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <BadgeCheck size={14} /> Approved
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <Clock size={14} /> Pending approval
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Attachments
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 space-y-1.5">
                    {reviewDocs.length === 0 ? (
                      <span className="text-xs text-slate-500">
                        {Number(reviewVoucher.DOC_COUNT) || 0} file(s)
                      </span>
                    ) : (
                      reviewDocs.map((doc) => (
                        <a
                          key={doc.ID}
                          href={`${url}/api/gldoc?id=${doc.ID}&file=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          <PaperclipIcon size={13} />
                          {doc.FILE_NAME || `Document #${doc.ID}`}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Account Distribution */}
              <div className="px-6 pb-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  Account Distribution
                </h3>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th scope="col" className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Code</th>
                        <th scope="col" className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">Particulars</th>
                        <th scope="col" className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Debit</th>
                        <th scope="col" className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewLoading && (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
                            Loading account details…
                          </td>
                        </tr>
                      )}
                      {!reviewLoading && distributionRows.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-sm text-slate-400">
                            No account rows found.
                          </td>
                        </tr>
                      )}
                      {!reviewLoading &&
                        distributionRows.map((d, i) => (
                          <tr key={d.id ?? i} className="border-t border-slate-100">
                            <td className="px-4 py-2 text-slate-700 font-medium">{d.code}</td>
                            <td className="px-4 py-2 text-slate-600">
                              {d.codedescription || d.description || "—"}
                            </td>
                            <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                              {d.debit > 0 ? formatMoney(d.debit) : "—"}
                            </td>
                            <td className="px-4 py-2 text-right tabular-nums text-slate-700">
                              {d.credit > 0 ? formatMoney(d.credit) : "—"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    {!reviewLoading && distributionRows.length > 0 && (
                      <tfoot>
                        <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                          <td colSpan={2} className="px-4 py-2 text-right text-slate-800">Total</td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatMoney(totalDebit)}</td>
                          <td className="px-4 py-2 text-right tabular-nums text-slate-900">{formatMoney(totalCredit)}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setReviewVoucher(null)}
                  className="border-slate-200 text-slate-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}