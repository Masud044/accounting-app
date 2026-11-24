// Payment Voucher guide texts (English + Bangla): list, create, edit.
// Used with <PaymentGuideSheet /> (see PaymentGuideSheet.jsx).
//
// Usage:
//   import { PaymentGuideSheet } from "@/components/payment-guide/PaymentGuideSheet";
//   import { paymentListGuide } from "@/components/payment-guide/payment-guide";
//   <PaymentGuideSheet guide={paymentListGuide} can={guidePermissions} />
//
// Permission keys (pass them in the `can` prop):
//   PAYMENT_VOUCHER_CREATE, PAYMENT_VOUCHER_EDIT, PAYMENT_VOUCHER_DOWNLOAD
//
// Screenshots go in public/guide/payment-voucher/ (missing files are simply hidden).

const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/payment-voucher/${name}`;

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
  en: "If the GL Date falls in a closed AP period, or no period is defined for it, you cannot save. Pick a date inside an open period.",
  bn: "GL Date যদি বন্ধ (closed) AP পিরিয়ডে পড়ে, বা সেই তারিখের জন্য কোনো পিরিয়ড না থাকে, তাহলে সেভ করা যাবে না। খোলা পিরিয়ডের ভেতরের তারিখ দিন।",
};

/* ════════════════════════════════════════════════════════════════════════
   1. PAYMENT VOUCHER LIST (PaymentTable)
   ════════════════════════════════════════════════════════════════════════ */
export const paymentListGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How the Payment Voucher page works",
    bn: "Payment Voucher পেজ কীভাবে কাজ করে",
  },
  purpose: {
    en: "This page lists your unposted payment vouchers (payments to suppliers). Use it to find a voucher, attach its invoice, edit it, review it, download it, or reverse it.",
    bn: "এই পেজে এখনো পোস্ট হয়নি এমন Payment ভাউচার (সাপ্লায়ারকে পেমেন্ট) দেখা যায়। এখান থেকে ভাউচার খুঁজুন, ইনভয়েস সংযুক্ত করুন, Edit, Review, ডাউনলোড বা Reverse করুন।",
  },
  overview: {
    image: {
      src: shot("list-overview.png"),
      alt: { en: "Payment Voucher page overview", bn: "Payment Voucher পেজের সামগ্রিক চিত্র" },
      caption: {
        en: "The Payment Voucher page. Click an image to open it full size.",
        bn: "Payment Voucher পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
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
        en: "Type in the search box, or set Gl From Date and To Date to narrow the list. Click a column title to sort. Use the Columns button to hide or show columns. On a small screen the list becomes rows: tap a row to open its details and actions.",
        bn: "সার্চ বক্সে লিখুন, অথবা Gl From Date ও To Date দিয়ে তালিকা ছোট করুন। কলামের নামে ক্লিক করলে সর্ট হয়। Columns বাটন দিয়ে কলাম দেখানো বা লুকানো যায়। ছোট স্ক্রিনে তালিকা সারি আকারে দেখায়: সারিতে ট্যাপ করলে বিস্তারিত ও অ্যাকশন খোলে।",
      },
      image: { src: shot("list-filters.png"), alt: { en: "Search and date filters", bn: "সার্চ ও তারিখ ফিল্টার" } },
    },
    {
      key: "create",
      title: { en: "Add a new payment", bn: "নতুন Payment যোগ করুন" },
      text: {
        en: "Click \"Add New Payment\" at the top right to open the Create page.",
        bn: "ওপরে ডানদিকের \"Add New Payment\" বাটনে ক্লিক করলে Create পেজ খুলবে।",
      },
      image: { src: shot("list-create.png"), alt: { en: "Add New Payment button", bn: "Add New Payment বাটন" } },
      permission: "PAYMENT_VOUCHER_CREATE",
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
      permission: "PAYMENT_VOUCHER_EDIT",
    },
    {
      key: "review",
      title: { en: "Review an approved voucher", bn: "Approved ভাউচার Review করুন" },
      text: {
        en: "After approval, the pencil is replaced by an eye icon. Click it to see the details, attachments and account distribution in read-only mode. Attachments open in a new tab when clicked.",
        bn: "Approved হওয়ার পর পেনসিলের জায়গায় চোখ (eye) আইকন দেখায়। ক্লিক করলে বিস্তারিত, অ্যাটাচমেন্ট ও অ্যাকাউন্ট ডিস্ট্রিবিউশন শুধু দেখার মোডে খোলে। অ্যাটাচমেন্টে ক্লিক করলে নতুন ট্যাবে ফাইল খোলে।",
      },
      image: { src: shot("list-review.png"), alt: { en: "Review voucher window", bn: "Review voucher উইন্ডো" } },
      permission: "PAYMENT_VOUCHER_EDIT",
    },
    {
      key: "download",
      title: { en: "Download the voucher", bn: "ভাউচার ডাউনলোড করুন" },
      text: {
        en: "Click the download icon and choose PDF or Excel. The file is named payment_voucher_<voucher no>.",
        bn: "ডাউনলোড আইকনে ক্লিক করে PDF বা Excel বেছে নিন। ফাইলের নাম হয় payment_voucher_<ভাউচার নম্বর>।",
      },
      image: { src: shot("list-download.png"), alt: { en: "Download menu", bn: "ডাউনলোড মেনু" } },
      permission: "PAYMENT_VOUCHER_DOWNLOAD",
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
  ],
  notes: [
    {
      en: "Reverse cannot be undone, so check the voucher first.",
      bn: "Reverse ফিরিয়ে নেওয়া যায় না, তাই আগে ভাউচার যাচাই করুন।",
    },
    {
      en: "The last row of the table shows the total Credit of the vouchers currently listed. It changes when you search or filter.",
      bn: "টেবিলের শেষ সারিতে এই মুহূর্তে তালিকায় থাকা ভাউচারগুলোর মোট Credit দেখায়। সার্চ বা ফিল্টার করলে এটি বদলায়।",
    },
    {
      en: "Clicking a row only highlights it, so you can keep your place. Click it again to remove the highlight.",
      bn: "সারিতে ক্লিক করলে শুধু হাইলাইট হয়, যাতে জায়গা মনে থাকে। আবার ক্লিক করলে হাইলাইট চলে যায়।",
    },
    {
      en: "If you can't see the Add, Edit or Download icons, your account doesn't have that permission. Contact your administrator.",
      bn: "Add, Edit বা Download আইকন না দেখালে বুঝবেন আপনার অ্যাকাউন্টে সেই অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
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
      label: "Supplier",
      text: {
        en: "The supplier this payment is made to.",
        bn: "যে সাপ্লায়ারকে এই পেমেন্ট করা হয়েছে।",
      },
    },
    {
      label: "Credit",
      text: {
        en: "The voucher amount.",
        bn: "ভাউচারের অ্যামাউন্ট।",
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
   2. CREATE PAYMENT VOUCHER (PaymentCreate)
   ════════════════════════════════════════════════════════════════════════ */
export const paymentCreateGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to create a Payment Voucher",
    bn: "Payment Voucher কীভাবে তৈরি করবেন",
  },
  purpose: {
    en: "Use this page to record a new supplier payment: fill the voucher details, split the total across GL accounts, and submit.",
    bn: "সাপ্লায়ারকে নতুন পেমেন্ট রেকর্ড করতে এই পেজ ব্যবহার করুন: ভাউচারের তথ্য দিন, মোট টাকা GL অ্যাকাউন্টে ভাগ করুন, তারপর সাবমিট করুন।",
  },
  overview: {
    image: {
      src: shot("create-overview.png"),
      alt: { en: "Create Payment Voucher page", bn: "Create Payment Voucher পেজ" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "supplier",
      title: { en: "Choose the supplier", bn: "সাপ্লায়ার বেছে নিন" },
      text: {
        en: "Select the supplier (required). If the supplier is not in the list, click \"New Supplier\" at the top, fill the form and create it, then select it.",
        bn: "সাপ্লায়ার বেছে নিন (আবশ্যক)। তালিকায় না থাকলে ওপরের \"New Supplier\" চাপুন, ফর্ম পূরণ করে তৈরি করুন, তারপর সিলেক্ট করুন।",
      },
      image: { src: shot("create-supplier.png"), alt: { en: "Supplier field", bn: "Supplier ফিল্ড" } },
    },
    {
      key: "details",
      title: { en: "Fill the voucher details", bn: "ভাউচারের তথ্য দিন" },
      text: {
        en: "Choose the Payment Code (required) and enter the number of supporting documents if you have any. Write a note in Description if needed. Entry Date is fixed to today, and Invoice No, PO Number and GRN No are read-only.",
        bn: "Payment Code বেছে নিন (আবশ্যক)। সাপোর্টিং ডকুমেন্ট থাকলে সংখ্যা লিখুন। দরকার হলে Description-এ নোট লিখুন। Entry Date আজকের তারিখে লক করা থাকে, আর Invoice No, PO Number ও GRN No শুধু দেখার জন্য।",
      },
      image: { src: shot("create-details.png"), alt: { en: "Voucher details", bn: "ভাউচারের তথ্য" } },
    },
    {
      key: "gldate",
      title: { en: "Pick a valid GL Date", bn: "সঠিক GL Date দিন" },
      text: {
        en: "GL Date must be inside an open AP period. If you pick a date in a closed period, or a date with no period, the date is not accepted and a message tells you why. A small badge (\"Period Closed\" or \"No Period\") may also appear next to GL Date, and while it shows, the Add and Create Voucher buttons are disabled. Choose another date.",
        bn: "GL Date অবশ্যই খোলা AP পিরিয়ডের ভেতরে হতে হবে। বন্ধ পিরিয়ড বা পিরিয়ডহীন তারিখ দিলে তারিখটি গ্রহণ করা হয় না, এবং কারণসহ একটি মেসেজ দেখায়। GL Date-এর পাশে \"Period Closed\" বা \"No Period\" ব্যাজও দেখাতে পারে; তখন Add ও Create Voucher বাটন বন্ধ থাকে। অন্য তারিখ বেছে নিন।",
      },
      image: { src: shot("create-gldate.png"), alt: { en: "GL Date and period badge", bn: "GL Date ও পিরিয়ড ব্যাজ" } },
    },
    {
      key: "entrytype",
      title: { en: "Check the Entry Type", bn: "Entry Type দেখুন" },
      text: {
        en: "Entry Type is Manual by default. It becomes Auto when you arrive from another page such as Purchase Recognition or Inventory. Change it only if you are sure.",
        bn: "Entry Type ডিফল্টভাবে Manual থাকে। Purchase Recognition বা Inventory-এর মতো অন্য পেজ থেকে এলে এটি Auto হয়ে যায়। নিশ্চিত হলেই বদলান।",
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
      title: { en: "Distribute the amount across accounts", bn: "অ্যামাউন্ট অ্যাকাউন্টে ভাগ করুন" },
      text: {
        en: "In Account Distribution, search and select an Account ID (Particular fills in automatically), type the Amount and click Add. Repeat for each account. Total Amount is the sum of all rows.",
        bn: "Account Distribution-এ Account ID সার্চ করে সিলেক্ট করুন (Particular নিজে থেকে আসে), Amount লিখে Add চাপুন। প্রতিটি অ্যাকাউন্টের জন্য এভাবে করুন। Total Amount হলো সব সারির যোগফল।",
      },
      image: { src: shot("create-rows.png"), alt: { en: "Account distribution", bn: "অ্যাকাউন্ট ডিস্ট্রিবিউশন" } },
    },
    {
      key: "submit",
      title: { en: "Review and submit", bn: "যাচাই করে সাবমিট করুন" },
      text: {
        en: "Click \"Create Voucher\". A summary window opens. Check it and press Confirm. On success you return to the Payment Voucher list.",
        bn: "\"Create Voucher\" চাপুন। একটি সারাংশ উইন্ডো খুলবে। যাচাই করে Confirm চাপুন। সফল হলে আপনি Payment Voucher তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("create-confirm.png"), alt: { en: "Confirm window", bn: "Confirm উইন্ডো" } },
    },
  ],
  notes: [
    {
      en: "Required: Supplier, GL Date, Payment Code and at least one account row. Each row needs an Account Code and a Particular.",
      bn: "আবশ্যক: Supplier, GL Date, Payment Code এবং অন্তত একটি অ্যাকাউন্ট সারি। প্রতিটি সারিতে Account Code ও Particular থাকতে হবে।",
    },
    periodNote,
    {
      en: "If you arrive from Purchase Recognition or Inventory, details such as supplier, dates, description, references, payment code and rows are filled for you. Check them before submitting.",
      bn: "Purchase Recognition বা Inventory থেকে এলে সাপ্লায়ার, তারিখ, বিবরণ, রেফারেন্স, Payment Code ও সারি আগে থেকে পূরণ হয়ে আসে। সাবমিটের আগে যাচাই করে নিন।",
    },
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
        en: "Manual (typed in by you), Auto (created from another page such as Purchase Recognition) or Reverse.",
        bn: "Manual (আপনি নিজে দিচ্ছেন), Auto (অন্য পেজ, যেমন Purchase Recognition থেকে তৈরি) অথবা Reverse।",
      },
    },
    {
      label: "Payment Code",
      text: {
        en: "The cash or bank account the payment is made from.",
        bn: "যে ক্যাশ বা ব্যাংক অ্যাকাউন্ট থেকে পেমেন্ট হচ্ছে।",
      },
    },
    {
      label: "PO Number / GRN No",
      text: {
        en: "Purchase order and goods receipt references. Filled by the system when they exist.",
        bn: "পারচেজ অর্ডার ও গুডস রিসিপ্ট রেফারেন্স। থাকলে সিস্টেম নিজে পূরণ করে।",
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
   3. EDIT PAYMENT VOUCHER (PaymentEdit)
   ════════════════════════════════════════════════════════════════════════ */
export const paymentEditGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to edit a Payment Voucher",
    bn: "Payment Voucher কীভাবে Edit করবেন",
  },
  purpose: {
    en: "Use this page to correct a voucher that is not yet approved: change its details, attachments or account rows, then update it.",
    bn: "যে ভাউচার এখনো Approved হয়নি তা ঠিক করতে এই পেজ ব্যবহার করুন: তথ্য, অ্যাটাচমেন্ট বা অ্যাকাউন্ট সারি বদলে Update করুন।",
  },
  overview: {
    image: {
      src: shot("edit-overview.png"),
      alt: { en: "Edit Payment Voucher page", bn: "Edit Payment Voucher পেজ" },
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
        en: "The page opens with the saved voucher already filled in. Entry Date, Invoice No and PO Number cannot be changed.",
        bn: "পেজ খুললে সেভ করা ভাউচারের তথ্য আগে থেকেই পূরণ থাকে। Entry Date, Invoice No ও PO Number বদলানো যায় না।",
      },
      image: { src: shot("edit-details.png"), alt: { en: "Loaded voucher details", bn: "লোড হওয়া ভাউচারের তথ্য" } },
    },
    {
      key: "details",
      title: { en: "Change the details", bn: "তথ্য বদলান" },
      text: {
        en: "You can change the Supplier, GL Date, Entry Type, Payment Code, No. of Supporting and Description. Supplier, GL Date, Payment Code and at least one account row are required.",
        bn: "Supplier, GL Date, Entry Type, Payment Code, No. of Supporting ও Description বদলানো যায়। Supplier, GL Date, Payment Code এবং অন্তত একটি অ্যাকাউন্ট সারি আবশ্যক।",
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
        en: "Rows already in the voucher can be changed directly in the table: edit their Particulars and Amount. To add a new row, select an Account ID, type the Amount and click Add. New rows are marked \"New\". Total Amount updates automatically.",
        bn: "ভাউচারে আগে থেকে থাকা সারিগুলো টেবিলেই বদলানো যায়: Particulars ও Amount Edit করুন। নতুন সারি যোগ করতে Account ID বেছে Amount লিখে Add চাপুন। নতুন সারিতে \"New\" লেখা থাকে। Total Amount নিজে থেকে হিসাব হয়।",
      },
      image: { src: shot("edit-rows.png"), alt: { en: "Account rows", bn: "অ্যাকাউন্ট সারি" } },
    },
    {
      key: "update",
      title: { en: "Review and update", bn: "যাচাই করে Update করুন" },
      text: {
        en: "Click \"Update Voucher\". A summary window opens, with each account row marked existing or new. Check it and press Confirm. On success you return to the Payment Voucher list.",
        bn: "\"Update Voucher\" চাপুন। একটি সারাংশ উইন্ডো খুলবে, যেখানে প্রতিটি অ্যাকাউন্ট সারি existing বা new হিসেবে চিহ্নিত থাকে। যাচাই করে Confirm চাপুন। সফল হলে আপনি Payment Voucher তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("edit-confirm.png"), alt: { en: "Confirm window", bn: "Confirm উইন্ডো" } },
    },
  ],
  notes: [
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
      label: "Payment Code",
      text: {
        en: "The cash or bank account the payment is made from.",
        bn: "যে ক্যাশ বা ব্যাংক অ্যাকাউন্ট থেকে পেমেন্ট হচ্ছে।",
      },
    },
    {
      label: "New",
      text: {
        en: "Marks an account row you added in this edit and that is not saved yet.",
        bn: "যে অ্যাকাউন্ট সারি এই Edit-এ আপনি যোগ করেছেন এবং এখনো সেভ হয়নি তা চিহ্নিত করে।",
      },
    },
  ],
};