// import { Upload, Pencil, FileUser, Eye, BadgeCheck } from "lucide-react";

// // Single source of truth for the Approval Voucher page guide.
// // Used by <PageGuideSheet /> (side panel) and <IconLegend /> (strip above the table).
// // `permission` keys must match the keys you pass in the `can` prop,
// // e.g. can={{ HOME_VOUCHER_EDIT: canEdit, HOME_VOUCHER_APPROVE: canApprove }}

// export const approvalVoucherGuide = {
//   title: "How this page works",

//   purpose:
//     "This page lists all vouchers (Receive, Payment, Journal and Bank Transfer) in one place. Use it to check each voucher, attach its invoice, and approve it.",

//   lockedText:
//     "Your account doesn't have permission for this step. Contact your administrator.",

//   steps: [
//     {
//       key: "find",
//       title: "Find your voucher",
//       text: "Search by voucher number, or narrow the list with the voucher type and the GL date range.",
//     },
//     {
//       key: "upload",
//       title: "Upload the invoice",
//       text: "Click the upload icon in the Upload Invoice column and attach PDF, JPG, PNG or DOC files (max 5 MB each). The Invoice Count column shows how many files are attached. Upload before approving, because uploads are locked after approval.",
//     },
//     {
//       key: "edit",
//       title: "Edit if something is wrong",
//       text: "Click the pencil icon to open the voucher and correct it. Editing is available only until the voucher is approved.",
//       permission: "HOME_VOUCHER_EDIT",
//     },
//     {
//       key: "approve",
//       title: "Approve",
//       text: "Click the approve icon and confirm. The voucher is then marked as approved under its own type (for example, an approved Payment voucher stays a Payment voucher). Once approved, it cannot be edited, and no invoice can be uploaded.",
//       permission: "HOME_VOUCHER_APPROVE",
//     },
//     {
//       key: "review",
//       title: "Review approved vouchers",
//       text: "After approval, the pencil is replaced by an eye icon. Click it to see the voucher details, attachments and account distribution in read-only mode.",
//       permission: "HOME_VOUCHER_EDIT",
//     },
//   ],

//   notes: [
//     "Approval cannot be undone, so check the amounts and attachments first.",
//     "If you can't see the Edit or Approve icons, your account doesn't have that permission. Contact your administrator.",
//   ],

//   // Icon legend strip (icons are the same lucide icons used in the table)
//   legend: [
//     {
//       key: "upload",
//       icon: Upload,
//       label: "Upload invoice",
//       hint: "Attach invoice files. Disabled after approval.",
//       tone: "text-blue-600 bg-blue-50",
//     },
//     {
//       key: "edit",
//       icon: Pencil,
//       label: "Edit voucher",
//       hint: "Correct the voucher. Only before approval.",
//       tone: "text-blue-600 bg-blue-50",
//       permission: "HOME_VOUCHER_EDIT",
//     },
//     {
//       key: "approve",
//       icon: FileUser,
//       label: "Approve voucher",
//       hint: "Approve after confirmation. Cannot be undone.",
//       tone: "text-green-600 bg-green-50",
//       permission: "HOME_VOUCHER_APPROVE",
//     },
//     {
//       key: "review",
//       icon: Eye,
//       label: "Review voucher",
//       hint: "View an approved voucher (read-only).",
//       tone: "text-indigo-600 bg-indigo-50",
//       permission: "HOME_VOUCHER_EDIT",
//     },
//     {
//       key: "approved",
//       icon: BadgeCheck,
//       label: "Approved",
//       hint: "This voucher is already approved.",
//       tone: "text-green-600 bg-green-100",
//     },
//   ],

//   // Shown in the side panel under "What the columns mean"
//   voucherTypes: [
//     { label: "Receive", className: "text-green-800 bg-green-100" },
//     { label: "Payment", className: "text-red-800 bg-red-100" },
//     { label: "Journal", className: "text-blue-800 bg-blue-100" },
//     { label: "Bank Transfer", className: "text-purple-800 bg-purple-100" },
//   ],

//   columns: [
//     {
//       label: "Type",
//       text: "Shows how the entry was created (Manual, Auto or Reverse).",
//     },
//     {
//       label: "Invoice Count",
//       text: "Number of invoice files attached to the voucher.",
//     },
//   ],

//   // Text used in the improved table states and approve dialog
//   states: {
//     emptyTitle: "No vouchers found",
//     emptyText: "Try clearing the search box, the voucher type, or the GL date range.",
//     loading: "Loading vouchers...",
//     error: "Could not load vouchers. Please refresh the page or contact your administrator.",
//   },
// };

import { Upload, Pencil, FileUser, Eye, BadgeCheck } from "lucide-react";

// Single source of truth for the Approval Voucher page guide.
// Used by <PageGuideSheet /> (side panel) and <IconLegend /> (strip above the table).
// `permission` keys must match the keys you pass in the `can` prop,
// e.g. can={{ HOME_VOUCHER_EDIT: canEdit, HOME_VOUCHER_APPROVE: canApprove }}
//
// TEXT: every user-facing text is { en: "...", bn: "..." }.
// A plain string also works (it is shown in both languages).
//
// SCREENSHOTS: a step (or `overview`) can have
//   image: { src, alt: {en,bn}, caption?: {en,bn} }
// Put the files in public/guide/approval-voucher/ (see INTEGRATION.md).
// If an image file is missing, it is simply not shown.

// Pick the text for a language. Falls back to English.
export const t = (value, lang = "en") =>
  value && typeof value === "object" ? value[lang] ?? value.en ?? "" : value ?? "";

// public/guide/approval-voucher/<name>  (works with a Vite `base` path too)
const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/approval-voucher/${name}`;

export const approvalVoucherGuide = {
  // Guide language tabs. First one is the default.
  defaultLanguage: "en",
  languages: [
    { code: "en", label: "English" },
    { code: "bn", label: "বাংলা" },
  ],

  title: {
    en: "How this page works",
    bn: "এই পেজ কীভাবে কাজ করে",
  },

  purpose: {
    en: "This page lists all vouchers (Receive, Payment, Journal and Bank Transfer) in one place. Use it to check each voucher, attach its invoice, and approve it.",
    bn: "এই পেজে সব ভাউচার (Receive, Payment, Journal ও Bank Transfer) এক জায়গায় দেখা যায়। এখান থেকে প্রতিটি ভাউচার যাচাই করুন, ইনভয়েস সংযুক্ত করুন এবং Approve করুন।",
  },

  // Optional screenshot shown above the steps
  overview: {
    image: {
      src: shot("overview.png"),
      alt: {
        en: "Approval Voucher page overview",
        bn: "Approval Voucher পেজের সামগ্রিক চিত্র",
      },
      caption: {
        en: "The Approval Voucher page. Click an image to open it full size.",
        bn: "Approval Voucher পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
      },
    },
  },

  lockedText: {
    en: "Your account doesn't have permission for this step. Contact your administrator.",
    bn: "আপনার অ্যাকাউন্টে এই ধাপের অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
  },

  // Small fixed labels used by the side panel and the legend strip
  ui: {
    guideButton: { en: "Guide", bn: "গাইড" },
    voucherTypeIntro: {
      en: "is shown as a colored label:",
      bn: "রঙিন লেবেল হিসেবে দেখানো হয়:",
    },
    columnsHeading: { en: "What the columns mean", bn: "কলামগুলোর অর্থ" },
    notesHeading: { en: "Good to know", bn: "জেনে রাখুন" },
    openImage: { en: "Open full size", bn: "বড় করে দেখুন" },
  },

  steps: [
    {
      key: "find",
      title: { en: "Find your voucher", bn: "আপনার ভাউচার খুঁজুন" },
      text: {
        en: "Search by voucher number, or narrow the list with the voucher type and the GL date range.",
        bn: "ভাউচার নম্বর দিয়ে সার্চ করুন, অথবা ভাউচারের ধরন ও GL তারিখের রেঞ্জ দিয়ে তালিকা ছোট করুন।",
      },
      image: {
        src: shot("filters.png"),
        alt: { en: "Search and filters", bn: "সার্চ ও ফিল্টার" },
      },
    },
    {
      key: "upload",
      title: { en: "Upload the invoice", bn: "ইনভয়েস আপলোড করুন" },
      text: {
        en: "Click the upload icon in the Actions column and attach PDF, JPG, PNG or DOC files (max 5 MB each). The Invoice Count column shows how many files are attached. Upload before approving, because uploads are locked after approval.",
        bn: "Actions কলামের আপলোড আইকনে ক্লিক করে PDF, JPG, PNG বা DOC ফাইল দিন (প্রতিটি সর্বোচ্চ ৫ MB)। Invoice Count কলামে কয়টি ফাইল দেওয়া আছে তা দেখা যায়। Approve করার আগেই আপলোড করুন, কারণ Approve হয়ে গেলে আর আপলোড করা যায় না।",
      },
      image: {
        src: shot("upload.png"),
        alt: { en: "Upload Invoice dialog", bn: "Upload Invoice ডায়ালগ" },
      },
    },
    {
      key: "edit",
      title: {
        en: "Edit if something is wrong",
        bn: "কিছু ভুল থাকলে Edit করুন",
      },
      text: {
        en: "Click the pencil icon to open the voucher and correct it. Editing is available only until the voucher is approved.",
        bn: "পেনসিল আইকনে ক্লিক করে ভাউচার খুলে ঠিক করুন। Approve হওয়ার আগ পর্যন্তই Edit করা যায়।",
      },
      image: {
        src: shot("edit.png"),
        alt: { en: "Edit icon in the row", bn: "রো-তে Edit আইকন" },
      },
      permission: "HOME_VOUCHER_EDIT",
    },
    {
      key: "approve",
      title: { en: "Approve", bn: "Approve করুন" },
      text: {
        en: "Click the approve icon and confirm. The voucher is then marked as approved under its own type (for example, an approved Payment voucher stays a Payment voucher). Once approved, it cannot be edited, and no invoice can be uploaded.",
        bn: "Approve আইকনে ক্লিক করে নিশ্চিত করুন। ভাউচারটি তার নিজের ধরনেই approved হিসেবে চিহ্নিত হবে (যেমন, Approved Payment ভাউচার Payment ভাউচারই থাকে)। Approve হয়ে গেলে আর Edit করা যায় না এবং ইনভয়েস আপলোড করা যায় না।",
      },
      image: {
        src: shot("approve.png"),
        alt: { en: "Approve confirmation", bn: "Approve নিশ্চিতকরণ" },
      },
      permission: "HOME_VOUCHER_APPROVE",
    },
    {
      key: "review",
      title: {
        en: "Review approved vouchers",
        bn: "Approved ভাউচার দেখুন",
      },
      text: {
        en: "After approval, the pencil is replaced by an eye icon. Click it to see the voucher details, attachments and account distribution in read-only mode.",
        bn: "Approve-এর পর পেনসিলের জায়গায় চোখ (eye) আইকন দেখাবে। ক্লিক করলে ভাউচারের বিস্তারিত, অ্যাটাচমেন্ট এবং অ্যাকাউন্ট ডিস্ট্রিবিউশন শুধু দেখার মোডে খুলবে।",
      },
      image: {
        src: shot("review.png"),
        alt: { en: "Review voucher window", bn: "Review voucher উইন্ডো" },
      },
      permission: "HOME_VOUCHER_EDIT",
    },
  ],

  notes: [
    {
      en: "Approval cannot be undone, so check the amounts and attachments first.",
      bn: "Approve ফিরিয়ে নেওয়া যায় না, তাই আগে অ্যামাউন্ট ও অ্যাটাচমেন্ট যাচাই করুন।",
    },
    {
      en: "If you can't see the Edit or Approve icons, your account doesn't have that permission. Contact your administrator.",
      bn: "Edit বা Approve আইকন না দেখালে বুঝবেন আপনার অ্যাকাউন্টে সেই অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
    },
  ],

  // Icon legend strip (icons are the same lucide icons used in the table)
  legend: [
    {
      key: "upload",
      icon: Upload,
      label: { en: "Upload invoice", bn: "ইনভয়েস আপলোড" },
      hint: {
        en: "Attach invoice files. Disabled after approval.",
        bn: "ইনভয়েস ফাইল সংযুক্ত করুন। Approve-এর পর বন্ধ থাকে।",
      },
      tone: "text-blue-600 bg-blue-50",
    },
    {
      key: "edit",
      icon: Pencil,
      label: { en: "Edit voucher", bn: "ভাউচার Edit" },
      hint: {
        en: "Correct the voucher. Only before approval.",
        bn: "ভাউচার ঠিক করুন। শুধু Approve-এর আগে।",
      },
      tone: "text-blue-600 bg-blue-50",
      permission: "HOME_VOUCHER_EDIT",
    },
    {
      key: "approve",
      icon: FileUser,
      label: { en: "Approve voucher", bn: "ভাউচার Approve" },
      hint: {
        en: "Approve after confirmation. Cannot be undone.",
        bn: "নিশ্চিত করে Approve করুন। ফিরিয়ে নেওয়া যায় না।",
      },
      tone: "text-green-600 bg-green-50",
      permission: "HOME_VOUCHER_APPROVE",
    },
    {
      key: "review",
      icon: Eye,
      label: { en: "Review voucher", bn: "ভাউচার Review" },
      hint: {
        en: "View an approved voucher (read-only).",
        bn: "Approved ভাউচার দেখুন (শুধু দেখার মোড)।",
      },
      tone: "text-indigo-600 bg-indigo-50",
      permission: "HOME_VOUCHER_EDIT",
    },
    {
      key: "approved",
      icon: BadgeCheck,
      label: { en: "Approved", bn: "Approved" },
      hint: {
        en: "This voucher is already approved.",
        bn: "এই ভাউচার ইতিমধ্যে Approved।",
      },
      tone: "text-green-600 bg-green-100",
    },
  ],

  // Shown in the side panel under "What the columns mean"
  // (labels match the badges in the table, so they are not translated)
  voucherTypes: [
    { label: "Receive", className: "text-green-800 bg-green-100" },
    { label: "Payment", className: "text-red-800 bg-red-100" },
    { label: "Journal", className: "text-blue-800 bg-blue-100" },
    { label: "Bank Transfer", className: "text-purple-800 bg-purple-100" },
  ],

  columns: [
    {
      label: "Type",
      text: {
        en: "Shows how the entry was created (Manual, Auto or Reverse).",
        bn: "এন্ট্রিটি কীভাবে তৈরি হয়েছে তা দেখায় (Manual, Auto বা Reverse)।",
      },
    },
    {
      label: "Invoice Count",
      text: {
        en: "Number of invoice files attached to the voucher.",
        bn: "ভাউচারে কয়টি ইনভয়েস ফাইল সংযুক্ত আছে।",
      },
    },
  ],

  // Table states (plain English strings, used directly by DashboardHomeTable)
  states: {
    emptyTitle: "No vouchers found",
    emptyText: "Try clearing the search box, the voucher type, or the GL date range.",
    loading: "Loading vouchers...",
    error: "Could not load vouchers. Please refresh the page or contact your administrator.",
  },
};