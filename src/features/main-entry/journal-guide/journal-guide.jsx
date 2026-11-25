// Journal Voucher guide texts (English + Bangla): list, create, edit.
// Used with <JournalGuideSheet /> (see JournalGuideSheet.jsx).
//
// Usage:
//   import { JournalGuideSheet } from "@/components/journal-guide/JournalGuideSheet";
//   import { journalListGuide } from "@/components/journal-guide/journal-guide";
//   <JournalGuideSheet guide={journalListGuide} can={guidePermissions} />
//
// Permission keys (pass them in the `can` prop, list page only):
//   JOURNAL_VOUCHER_CREATE, JOURNAL_VOUCHER_EDIT,
//   JOURNAL_VOUCHER_DOWNLOAD, JOURNAL_VOUCHER_DELETE
//
// Screenshots go in public/guide/journal-voucher/ (missing files are simply hidden).

const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/journal-voucher/${name}`;

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

const ui = {
  guideButton: { en: "Guide", bn: "গাইড" },
  voucherTypeIntro: {
    en: "is shown as a colored label:",
    bn: "রঙিন লেবেল হিসেবে দেখানো হয়:",
  },
  columnsHeading: { en: "What the fields mean", bn: "ফিল্ডগুলোর অর্থ" },
  notesHeading: { en: "Good to know", bn: "জেনে রাখুন" },
  openImage: { en: "Open full size", bn: "বড় করে দেখুন" },
};

const lockedText = {
  en: "Your account doesn't have permission for this step. Contact your administrator.",
  bn: "আপনার অ্যাকাউন্টে এই ধাপের অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
};

const voucherTypes = [
  { label: "Manual", className: "text-gray-800 bg-gray-100" },
  { label: "Auto", className: "text-blue-800 bg-blue-100" },
  { label: "Reverse", className: "text-red-800 bg-red-100" },
];

// Shared note (Create + Edit)
const periodNote = {
  en: "If the GL Date falls in a closed GL period, or no period is defined for it, you cannot save. Pick a date inside an open period.",
  bn: "GL Date যদি বন্ধ (closed) GL পিরিয়ডে পড়ে, বা সেই তারিখের জন্য কোনো পিরিয়ড না থাকে, তাহলে সেভ করা যাবে না। খোলা পিরিয়ডের ভেতরের তারিখ দিন।",
};

const balanceNote = {
  en: "Total Debit must equal total Credit. If they don't match, a red warning shows under the table and the voucher cannot be saved.",
  bn: "মোট Debit ও মোট Credit সমান হতে হবে। না মিললে টেবিলের নিচে লাল সতর্কবার্তা দেখায় এবং ভাউচার সেভ করা যায় না।",
};

/* ════════════════════════════════════════════════════════════════════════
   1. JOURNAL VOUCHER LIST (JournalTable)
   ════════════════════════════════════════════════════════════════════════ */
export const journalListGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How the Journal Voucher page works",
    bn: "Journal Voucher পেজ কীভাবে কাজ করে",
  },
  purpose: {
    en: "This page lists your journal vouchers (manual debit/credit entries in the General Ledger). Use it to find a voucher, attach its invoice, edit it, review it, download it, reverse it, or delete it.",
    bn: "এই পেজে আপনার Journal ভাউচার (জেনারেল লেজারে ম্যানুয়াল ডেবিট/ক্রেডিট এন্ট্রি) দেখা যায়। এখান থেকে ভাউচার খুঁজুন, ইনভয়েস সংযুক্ত করুন, Edit, Review, ডাউনলোড, Reverse বা Delete করুন।",
  },
  overview: {
    image: {
      src: shot("list-overview.png"),
      alt: { en: "Journal Voucher page overview", bn: "Journal Voucher পেজের সামগ্রিক চিত্র" },
      caption: {
        en: "The Journal Voucher page. Click an image to open it full size.",
        bn: "Journal Voucher পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
      },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "find",
      title: { en: "Find your voucher", bn: "আপনার ভাউচার খুঁজুন" },
      text: {
        en: "Type in the search box, or set GL From Date and To Date to narrow the list. Click a column title to sort. Use the Columns button to hide or show columns. On a small screen the list becomes rows: tap a row to open its details and actions.",
        bn: "সার্চ বক্সে লিখুন, অথবা GL From Date ও To Date দিয়ে তালিকা ছোট করুন। কলামের নামে ক্লিক করলে সর্ট হয়। Columns বাটন দিয়ে কলাম দেখানো বা লুকানো যায়। ছোট স্ক্রিনে তালিকা সারি আকারে দেখায়: সারিতে ট্যাপ করলে বিস্তারিত ও অ্যাকশন খোলে।",
      },
      image: { src: shot("list-filters.png"), alt: { en: "Search and date filters", bn: "সার্চ ও তারিখ ফিল্টার" } },
    },
    {
      key: "create",
      title: { en: "Add a new journal", bn: "নতুন Journal যোগ করুন" },
      text: {
        en: "Click \"Add New Journal\" at the top right to open the Create page.",
        bn: "ওপরে ডানদিকের \"Add New Journal\" বাটনে ক্লিক করলে Create পেজ খুলবে।",
      },
      image: { src: shot("list-create.png"), alt: { en: "Add New Journal button", bn: "Add New Journal বাটন" } },
      permission: "JOURNAL_VOUCHER_CREATE",
    },
    {
      key: "upload",
      title: { en: "Upload the invoice", bn: "ইনভয়েস আপলোড করুন" },
      text: {
        en: "Click the upload icon in the Upload Invoice column. Choose PDF, JPG, PNG or DOC files (max 5 MB each) and press Upload. Files already attached are listed in the same window, and you can remove one with the X. The Invoice Count column shows how many files are attached. Upload is disabled once the voucher is approved.",
        bn: "Upload Invoice কলামের আপলোড আইকনে ক্লিক করুন। PDF, JPG, PNG বা DOC ফাইল (প্রতিটি সর্বোচ্চ ৫ MB) বেছে Upload চাপুন। আগে থেকে দেওয়া ফাইল একই উইন্ডোতে দেখা যায়, X দিয়ে মুছে ফেলা যায়। Invoice Count কলামে কয়টি ফাইল আছে তা দেখা যায়। ভাউচার Approved হয়ে গেলে আপলোড বন্ধ হয়ে যায়।",
      },
      image: { src: shot("list-upload.png"), alt: { en: "Upload Invoice window", bn: "Upload Invoice উইন্ডো" } },
    },
    {
      key: "edit",
      title: { en: "Edit a voucher", bn: "ভাউচার Edit করুন" },
      text: {
        en: "Click the pencil icon in the Actions column to open the Edit page. Editing is possible only until the voucher is approved.",
        bn: "Actions কলামের পেনসিল আইকনে ক্লিক করলে Edit পেজ খুলবে। ভাউচার Approved হওয়ার আগ পর্যন্তই Edit করা যায়।",
      },
      image: { src: shot("list-edit.png"), alt: { en: "Edit icon in the row", bn: "সারিতে Edit আইকন" } },
      permission: "JOURNAL_VOUCHER_EDIT",
    },
    {
      key: "review",
      title: { en: "Review an approved voucher", bn: "Approved ভাউচার Review করুন" },
      text: {
        en: "After approval, the pencil is replaced by an eye icon. Click it to see the details, attachments count and the account distribution (code, particulars, debit, credit) in read-only mode.",
        bn: "Approved হওয়ার পর পেনসিলের জায়গায় চোখ (eye) আইকন দেখায়। ক্লিক করলে বিস্তারিত, অ্যাটাচমেন্টের সংখ্যা ও অ্যাকাউন্ট ডিস্ট্রিবিউশন (কোড, বিবরণ, ডেবিট, ক্রেডিট) শুধু দেখার মোডে খোলে।",
      },
      image: { src: shot("list-review.png"), alt: { en: "Review voucher window", bn: "Review voucher উইন্ডো" } },
      permission: "JOURNAL_VOUCHER_EDIT",
    },
    {
      key: "download",
      title: { en: "Download the voucher", bn: "ভাউচার ডাউনলোড করুন" },
      text: {
        en: "Click the download icon and choose PDF or Excel. The file is named journal_voucher_<voucher no>.",
        bn: "ডাউনলোড আইকনে ক্লিক করে PDF বা Excel বেছে নিন। ফাইলের নাম হয় journal_voucher_<ভাউচার নম্বর>।",
      },
      image: { src: shot("list-download.png"), alt: { en: "Download menu", bn: "ডাউনলোড মেনু" } },
      permission: "JOURNAL_VOUCHER_DOWNLOAD",
    },
    {
      key: "reverse",
      title: { en: "Reverse an approved voucher", bn: "Approved ভাউচার Reverse করুন" },
      text: {
        en: "On an approved voucher, click the orange reverse icon and confirm. A new reversal entry is created with debit and credit swapped. The original then shows a red reversed icon with the new voucher number. Reverse is not offered for a voucher that is already a reversal, or already reversed.",
        bn: "Approved ভাউচারে কমলা রঙের reverse আইকনে ক্লিক করে নিশ্চিত করুন। ডেবিট ও ক্রেডিট উল্টে একটি নতুন reversal এন্ট্রি তৈরি হয়। মূল ভাউচারে তখন নতুন ভাউচার নম্বরসহ লাল reversed আইকন দেখায়। যে ভাউচার নিজেই reversal, বা আগেই reverse হয়েছে, তাতে Reverse অপশন থাকে না।",
      },
      image: { src: shot("list-reverse.png"), alt: { en: "Reverse confirmation", bn: "Reverse নিশ্চিতকরণ" } },
    },
    // {
    //   key: "delete",
    //   title: { en: "Delete a voucher", bn: "ভাউচার Delete করুন" },
    //   text: {
    //     en: "Click the red trash icon and confirm. The voucher and its entries are deleted permanently. This works for approved vouchers too, and then the entry is removed from the ledger, so use it with great care. If you only want to cancel the effect of an approved voucher, use Reverse instead.",
    //     bn: "লাল ট্র্যাশ আইকনে ক্লিক করে নিশ্চিত করুন। ভাউচার ও তার এন্ট্রিগুলো স্থায়ীভাবে মুছে যায়। Approved ভাউচারেও এটি কাজ করে, তখন এন্ট্রিটি লেজার থেকে সরে যায়, তাই খুব সতর্ক থাকুন। Approved ভাউচারের প্রভাব বাতিল করতে চাইলে Delete না করে Reverse ব্যবহার করুন।",
    //   },
    //   image: { src: shot("list-delete.png"), alt: { en: "Delete confirmation", bn: "Delete নিশ্চিতকরণ" } },
    //   permission: "JOURNAL_VOUCHER_DELETE",
    // },
  ],
  notes: [
    {
      en: "Reverse and Delete cannot be undone, so check the voucher first.",
      bn: "Reverse ও Delete ফিরিয়ে নেওয়া যায় না, তাই আগে ভাউচার যাচাই করুন।",
    },
    {
      en: "The last row of the table shows the total Debit and Credit of the vouchers currently listed. It changes when you search or filter.",
      bn: "টেবিলের শেষ সারিতে এই মুহূর্তে তালিকায় থাকা ভাউচারগুলোর মোট Debit ও Credit দেখায়। সার্চ বা ফিল্টার করলে এটি বদলায়।",
    },
    {
      en: "Clicking a row only highlights it, so you can keep your place. Click it again to remove the highlight.",
      bn: "সারিতে ক্লিক করলে শুধু হাইলাইট হয়, যাতে জায়গা মনে থাকে। আবার ক্লিক করলে হাইলাইট চলে যায়।",
    },
    {
      en: "If you can't see the Add, Edit, Download or Delete icons, your account doesn't have that permission. Contact your administrator.",
      bn: "Add, Edit, Download বা Delete আইকন না দেখালে বুঝবেন আপনার অ্যাকাউন্টে সেই অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
    },
  ],
  voucherTypes,
  columns: [
    {
      label: "GL Date",
      text: {
        en: "The date the entry is posted to the ledger.",
        bn: "যে তারিখে এন্ট্রিটি লেজারে পোস্ট হয়।",
      },
    },
    {
      label: "Debit / Credit",
      text: {
        en: "The total debit and total credit amount of the voucher. For a valid journal they are equal.",
        bn: "ভাউচারের মোট ডেবিট ও মোট ক্রেডিট অ্যামাউন্ট। সঠিক Journal-এ দুটি সমান হয়।",
      },
    },
    {
      label: "Type",
      text: {
        en: "How the entry was created (Manual, Auto or Reverse).",
        bn: "এন্ট্রিটি কীভাবে তৈরি হয়েছে (Manual, Auto বা Reverse)।",
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
};

/* ════════════════════════════════════════════════════════════════════════
   2. CREATE JOURNAL VOUCHER (JournalCreate)
   ════════════════════════════════════════════════════════════════════════ */
export const journalCreateGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to create a Journal Voucher",
    bn: "Journal Voucher কীভাবে তৈরি করবেন",
  },
  purpose: {
    en: "Use this page to record a manual journal entry: fill the voucher details, add the accounts, enter the debit or credit for each, and submit when the totals match.",
    bn: "ম্যানুয়াল Journal এন্ট্রি রেকর্ড করতে এই পেজ ব্যবহার করুন: ভাউচারের তথ্য দিন, অ্যাকাউন্ট যোগ করুন, প্রতিটির Debit বা Credit লিখুন, আর মোট মিললে সাবমিট করুন।",
  },
  overview: {
    image: {
      src: shot("create-overview.png"),
      alt: { en: "Create Journal Voucher page", bn: "Create Journal Voucher পেজ" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "details",
      title: { en: "Fill the voucher details", bn: "ভাউচারের তথ্য দিন" },
      text: {
        en: "Enter the number of supporting documents if you have any, and write a note in Description if needed. Entry Date is fixed to today and cannot be changed.",
        bn: "সাপোর্টিং ডকুমেন্ট থাকলে সংখ্যা লিখুন, আর দরকার হলে Description-এ নোট লিখুন। Entry Date আজকের তারিখে লক করা থাকে, বদলানো যায় না।",
      },
      image: { src: shot("create-details.png"), alt: { en: "Voucher details", bn: "ভাউচারের তথ্য" } },
    },
    {
      key: "gldate",
      title: { en: "Pick a valid GL Date", bn: "সঠিক GL Date দিন" },
      text: {
        en: "GL Date must be inside an open GL period. If you pick a date in a closed period, or a date with no period, the date is not accepted and a message tells you why. A small badge (\"Period Closed\" or \"No Period\") may also appear next to GL Date, and while it shows, the Add and Create Voucher buttons are disabled. Choose another date.",
        bn: "GL Date অবশ্যই খোলা GL পিরিয়ডের ভেতরে হতে হবে। বন্ধ পিরিয়ড বা পিরিয়ডহীন তারিখ দিলে তারিখটি গ্রহণ করা হয় না, এবং কারণসহ একটি মেসেজ দেখায়। GL Date-এর পাশে \"Period Closed\" বা \"No Period\" ব্যাজও দেখাতে পারে; তখন Add ও Create Voucher বাটন বন্ধ থাকে। অন্য তারিখ বেছে নিন।",
      },
      image: { src: shot("create-gldate.png"), alt: { en: "GL Date and period badge", bn: "GL Date ও পিরিয়ড ব্যাজ" } },
    },
    {
      key: "entrytype",
      title: { en: "Check the Entry Type", bn: "Entry Type দেখুন" },
      text: {
        en: "Entry Type is Manual by default. The other choices are Reverse and Auto. Change it only if you are sure.",
        bn: "Entry Type ডিফল্টভাবে Manual থাকে। অন্য অপশন Reverse ও Auto। নিশ্চিত হলেই বদলান।",
      },
    },
    {
      key: "bills",
      title: { en: "Attach the bills", bn: "বিল সংযুক্ত করুন" },
      text: {
        en: "Add invoice or bill files in the Bill Attachments box. They are uploaded when the voucher is created.",
        bn: "Bill Attachments বক্সে ইনভয়েস বা বিলের ফাইল দিন। ভাউচার তৈরি হওয়ার সময় ফাইলগুলো আপলোড হয়।",
      },
    },
    {
      key: "rows",
      title: { en: "Add the accounts", bn: "অ্যাকাউন্ট যোগ করুন" },
      text: {
        en: "In Account Distribution, search and select an Account ID (Particular fills in automatically) and click Add. A new row appears in the table. Repeat for each account you need.",
        bn: "Account Distribution-এ Account ID সার্চ করে সিলেক্ট করুন (Particular নিজে থেকে আসে) এবং Add চাপুন। টেবিলে একটি নতুন সারি যোগ হবে। প্রয়োজনীয় প্রতিটি অ্যাকাউন্টের জন্য এভাবে করুন।",
      },
      image: { src: shot("create-rows.png"), alt: { en: "Account distribution", bn: "অ্যাকাউন্ট ডিস্ট্রিবিউশন" } },
    },
    {
      key: "amounts",
      title: { en: "Enter Debit or Credit for each row", bn: "প্রতিটি সারিতে Debit বা Credit লিখুন" },
      text: {
        en: "Type the amount directly in the Debit or the Credit cell of each row. A row can have only one of them: when you type in one, the other shows a dash. Use the trash icon to remove a row. The Total row shows the sum of all Debit and all Credit.",
        bn: "প্রতিটি সারির Debit বা Credit ঘরে সরাসরি অ্যামাউন্ট লিখুন। একটি সারিতে দুটির একটিই থাকতে পারে: একটিতে লিখলে অন্যটিতে ড্যাশ (—) দেখায়। সারি মুছতে ট্র্যাশ আইকন ব্যবহার করুন। Total সারিতে সব Debit ও সব Credit-এর যোগফল দেখায়।",
      },
      image: { src: shot("create-amounts.png"), alt: { en: "Debit and credit cells", bn: "Debit ও Credit ঘর" } },
    },
    {
      key: "submit",
      title: { en: "Review and submit", bn: "যাচাই করে সাবমিট করুন" },
      text: {
        en: "When Total Debit equals Total Credit, click \"Create Voucher\". A summary window opens. Check it and press Confirm. On success you return to the Journal Voucher list.",
        bn: "মোট Debit ও মোট Credit সমান হলে \"Create Voucher\" চাপুন। একটি সারাংশ উইন্ডো খুলবে। যাচাই করে Confirm চাপুন। সফল হলে আপনি Journal Voucher তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("create-confirm.png"), alt: { en: "Confirm window", bn: "Confirm উইন্ডো" } },
    },
  ],
  notes: [
    {
      en: "Required: GL Date and at least one account row. Each row needs an Account Code and a Particular.",
      bn: "আবশ্যক: GL Date এবং অন্তত একটি অ্যাকাউন্ট সারি। প্রতিটি সারিতে Account Code ও Particular থাকতে হবে।",
    },
    balanceNote,
    periodNote,
    {
      en: "If the server rejects the voucher (for example, no ledger period defined), the reason is shown in a message at the top.",
      bn: "সার্ভার ভাউচার গ্রহণ না করলে (যেমন লেজার পিরিয়ড নেই), কারণটি ওপরে মেসেজ আকারে দেখায়।",
    },
  ],
  voucherTypes,
  columns: [
    {
      label: "Entry Type",
      text: {
        en: "Manual (typed in by you), Auto or Reverse.",
        bn: "Manual (আপনি নিজে দিচ্ছেন), Auto অথবা Reverse।",
      },
    },
    {
      label: "Particular",
      text: {
        en: "The account name. It fills in automatically when you select an Account ID.",
        bn: "অ্যাকাউন্টের নাম। Account ID সিলেক্ট করলে নিজে থেকে পূরণ হয়।",
      },
    },
    {
      label: "Debit / Credit",
      text: {
        en: "The amount for each account row. Enter it in only one of the two columns.",
        bn: "প্রতিটি অ্যাকাউন্ট সারির অ্যামাউন্ট। দুই কলামের যেকোনো একটিতে লিখুন।",
      },
    },
    {
      label: "No. of Supporting",
      text: {
        en: "How many supporting documents go with this voucher.",
        bn: "এই ভাউচারের সাথে কয়টি সাপোর্টিং ডকুমেন্ট আছে।",
      },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   3. EDIT JOURNAL VOUCHER (JournalEdit)
   ════════════════════════════════════════════════════════════════════════ */
export const journalEditGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to edit a Journal Voucher",
    bn: "Journal Voucher কীভাবে Edit করবেন",
  },
  purpose: {
    en: "Use this page to correct a voucher that is not yet approved: change its details, attachments or account rows, then update it.",
    bn: "যে ভাউচার এখনো Approved হয়নি তা ঠিক করতে এই পেজ ব্যবহার করুন: তথ্য, অ্যাটাচমেন্ট বা অ্যাকাউন্ট সারি বদলে Update করুন।",
  },
  overview: {
    image: {
      src: shot("edit-overview.png"),
      alt: { en: "Edit Journal Voucher page", bn: "Edit Journal Voucher পেজ" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "load",
      title: { en: "Check the loaded data", bn: "লোড হওয়া তথ্য দেখুন" },
      text: {
        en: "The page opens with the saved voucher already filled in. Entry Date cannot be changed. Rows already saved are highlighted and marked \"(saved)\".",
        bn: "পেজ খুললে সেভ করা ভাউচারের তথ্য আগে থেকেই পূরণ থাকে। Entry Date বদলানো যায় না। আগে সেভ করা সারিগুলো হাইলাইট থাকে এবং \"(saved)\" লেখা থাকে।",
      },
      image: { src: shot("edit-details.png"), alt: { en: "Loaded voucher details", bn: "লোড হওয়া ভাউচারের তথ্য" } },
    },
    {
      key: "details",
      title: { en: "Change the details", bn: "তথ্য বদলান" },
      text: {
        en: "You can change the GL Date, Entry Type, No. of Supporting and Description. GL Date and at least one account row are required.",
        bn: "GL Date, Entry Type, No. of Supporting ও Description বদলানো যায়। GL Date এবং অন্তত একটি অ্যাকাউন্ট সারি আবশ্যক।",
      },
    },
    {
      key: "gldate",
      title: { en: "Check the GL Date period", bn: "GL Date-এর পিরিয়ড দেখুন" },
      text: {
        en: "If you change the GL Date to a closed period, or a date with no period, a badge (\"Period Closed\" or \"No Period\") appears and the Add and Update Voucher buttons are disabled. Choose another date.",
        bn: "GL Date বন্ধ পিরিয়ড বা পিরিয়ডহীন তারিখে নিলে \"Period Closed\" বা \"No Period\" ব্যাজ দেখায় এবং Add ও Update Voucher বাটন বন্ধ হয়ে যায়। অন্য তারিখ বেছে নিন।",
      },
      image: { src: shot("edit-gldate.png"), alt: { en: "Period status badge", bn: "পিরিয়ড স্ট্যাটাস ব্যাজ" } },
    },
    {
      key: "bills",
      title: { en: "Manage the bills", bn: "বিল ম্যানেজ করুন" },
      text: {
        en: "Bill Attachments shows the files already saved. Add new files in the same box. New files are uploaded after you update the voucher.",
        bn: "Bill Attachments-এ আগে সেভ করা ফাইল দেখায়। একই বক্সে নতুন ফাইল যোগ করুন। ভাউচার Update করার পর নতুন ফাইল আপলোড হয়।",
      },
    },
    {
      key: "rows",
      title: { en: "Edit the account rows", bn: "অ্যাকাউন্ট সারি Edit করুন" },
      text: {
        en: "Saved rows can be changed directly in the table: edit their Particulars, Debit and Credit. To add a new row, select an Account ID, click Add, then type its Debit or Credit (a new row can have only one of them). Use the trash icon to remove a row. Total Debit and Total Credit update automatically.",
        bn: "সেভ করা সারিগুলো টেবিলেই বদলানো যায়: Particulars, Debit ও Credit Edit করুন। নতুন সারি যোগ করতে Account ID বেছে Add চাপুন, তারপর তার Debit বা Credit লিখুন (নতুন সারিতে দুটির একটিই থাকে)। সারি মুছতে ট্র্যাশ আইকন ব্যবহার করুন। মোট Debit ও মোট Credit নিজে থেকে হিসাব হয়।",
      },
      image: { src: shot("edit-rows.png"), alt: { en: "Account rows", bn: "অ্যাকাউন্ট সারি" } },
    },
    {
      key: "update",
      title: { en: "Review and update", bn: "যাচাই করে Update করুন" },
      text: {
        en: "When the totals match, click \"Update Voucher\". A summary window opens, with each account row marked existing or new. Check it and press Confirm. On success you return to the Journal Voucher list.",
        bn: "মোট মিললে \"Update Voucher\" চাপুন। একটি সারাংশ উইন্ডো খুলবে, যেখানে প্রতিটি অ্যাকাউন্ট সারি existing বা new হিসেবে চিহ্নিত থাকে। যাচাই করে Confirm চাপুন। সফল হলে আপনি Journal Voucher তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("edit-confirm.png"), alt: { en: "Confirm window", bn: "Confirm উইন্ডো" } },
    },
  ],
  notes: [
    balanceNote,
    periodNote,
    {
      en: "Changing the Entry Type changes how the voucher is labelled in the list, so change it only when you are sure.",
      bn: "Entry Type বদলালে তালিকায় ভাউচারের লেবেল বদলে যায়, তাই নিশ্চিত হলেই বদলান।",
    },
    {
      en: "Once a voucher is approved it can no longer be edited. Use Review in the list to view it.",
      bn: "ভাউচার Approved হয়ে গেলে আর Edit করা যায় না। দেখতে তালিকা থেকে Review ব্যবহার করুন।",
    },
    {
      en: "Cancel leaves the page without saving your changes.",
      bn: "Cancel চাপলে পরিবর্তন সেভ না করেই পেজ থেকে বেরিয়ে যায়।",
    },
  ],
  voucherTypes,
  columns: [
    {
      label: "Entry Type",
      text: {
        en: "Manual, Auto or Reverse. Shows how the entry was created.",
        bn: "Manual, Auto বা Reverse। এন্ট্রিটি কীভাবে তৈরি হয়েছে তা দেখায়।",
      },
    },
    {
      label: "(saved)",
      text: {
        en: "Marks an account row that is already saved in the voucher. Rows without it were added in this edit.",
        bn: "ভাউচারে আগে থেকে সেভ করা অ্যাকাউন্ট সারি চিহ্নিত করে। এটি ছাড়া সারিগুলো এই Edit-এ যোগ করা।",
      },
    },
    {
      label: "Debit / Credit",
      text: {
        en: "The amount of each account row. Saved rows can be corrected freely; the totals must still match.",
        bn: "প্রতিটি অ্যাকাউন্ট সারির অ্যামাউন্ট। সেভ করা সারি স্বাধীনভাবে ঠিক করা যায়; তবে মোট অবশ্যই মিলতে হবে।",
      },
    },
  ],
};