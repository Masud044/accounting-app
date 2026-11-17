import { Upload, Pencil, FileUser, Eye, BadgeCheck } from "lucide-react";

// Single source of truth for the Approval Voucher page guide.
// Used by <PageGuideSheet /> (side panel) and <IconLegend /> (strip above the table).
// `permission` keys must match the keys you pass in the `can` prop,
// e.g. can={{ HOME_VOUCHER_EDIT: canEdit, HOME_VOUCHER_APPROVE: canApprove }}

export const approvalVoucherGuide = {
  title: "How this page works",

  purpose:
    "This page lists all vouchers (Receive, Payment, Journal and Bank Transfer) in one place. Use it to check each voucher, attach its invoice, and approve it.",

  lockedText:
    "Your account doesn't have permission for this step. Contact your administrator.",

  steps: [
    {
      key: "find",
      title: "Find your voucher",
      text: "Search by voucher number, or narrow the list with the voucher type and the GL date range.",
    },
    {
      key: "upload",
      title: "Upload the invoice",
      text: "Click the upload icon in the Upload Invoice column and attach PDF, JPG, PNG or DOC files (max 5 MB each). The Invoice Count column shows how many files are attached. Upload before approving, because uploads are locked after approval.",
    },
    {
      key: "edit",
      title: "Edit if something is wrong",
      text: "Click the pencil icon to open the voucher and correct it. Editing is available only until the voucher is approved.",
      permission: "HOME_VOUCHER_EDIT",
    },
    {
      key: "approve",
      title: "Approve",
      text: "Click the approve icon and confirm. The voucher is then marked as approved under its own type (for example, an approved Payment voucher stays a Payment voucher). Once approved, it cannot be edited, and no invoice can be uploaded.",
      permission: "HOME_VOUCHER_APPROVE",
    },
    {
      key: "review",
      title: "Review approved vouchers",
      text: "After approval, the pencil is replaced by an eye icon. Click it to see the voucher details, attachments and account distribution in read-only mode.",
      permission: "HOME_VOUCHER_EDIT",
    },
  ],

  notes: [
    "Approval cannot be undone, so check the amounts and attachments first.",
    "If you can't see the Edit or Approve icons, your account doesn't have that permission. Contact your administrator.",
  ],

  // Icon legend strip (icons are the same lucide icons used in the table)
  legend: [
    {
      key: "upload",
      icon: Upload,
      label: "Upload invoice",
      hint: "Attach invoice files. Disabled after approval.",
      tone: "text-blue-600 bg-blue-50",
    },
    {
      key: "edit",
      icon: Pencil,
      label: "Edit voucher",
      hint: "Correct the voucher. Only before approval.",
      tone: "text-blue-600 bg-blue-50",
      permission: "HOME_VOUCHER_EDIT",
    },
    {
      key: "approve",
      icon: FileUser,
      label: "Approve voucher",
      hint: "Approve after confirmation. Cannot be undone.",
      tone: "text-green-600 bg-green-50",
      permission: "HOME_VOUCHER_APPROVE",
    },
    {
      key: "review",
      icon: Eye,
      label: "Review voucher",
      hint: "View an approved voucher (read-only).",
      tone: "text-indigo-600 bg-indigo-50",
      permission: "HOME_VOUCHER_EDIT",
    },
    {
      key: "approved",
      icon: BadgeCheck,
      label: "Approved",
      hint: "This voucher is already approved.",
      tone: "text-green-600 bg-green-100",
    },
  ],

  // Shown in the side panel under "What the columns mean"
  voucherTypes: [
    { label: "Receive", className: "text-green-800 bg-green-100" },
    { label: "Payment", className: "text-red-800 bg-red-100" },
    { label: "Journal", className: "text-blue-800 bg-blue-100" },
    { label: "Bank Transfer", className: "text-purple-800 bg-purple-100" },
  ],

  columns: [
    {
      label: "Type",
      text: "Shows how the entry was created (Manual, Auto or Reverse).",
    },
    {
      label: "Invoice Count",
      text: "Number of invoice files attached to the voucher.",
    },
  ],

  // Text used in the improved table states and approve dialog
  states: {
    emptyTitle: "No vouchers found",
    emptyText: "Try clearing the search box, the voucher type, or the GL date range.",
    loading: "Loading vouchers...",
    error: "Could not load vouchers. Please refresh the page or contact your administrator.",
  },
};