// Receive Voucher guide texts (English + Bangla): list, create, edit.
// Used with <ReceiveGuideSheet /> (see ReceiveGuideSheet.jsx).
//
// Usage:
//   import { ReceiveGuideSheet } from "@/components/receive-guide/ReceiveGuideSheet";
//   import { receiveListGuide } from "@/components/receive-guide/receive-guide";
//   <ReceiveGuideSheet guide={receiveListGuide} can={guidePermissions} />
//
// Permission keys (pass them in the `can` prop):
//   RECEIVE_VOUCHER_CREATE, RECEIVE_VOUCHER_EDIT, RECEIVE_VOUCHER_DOWNLOAD
//
// Screenshots go in public/guide/receive-voucher/ (missing files are simply hidden).

const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/receive-voucher/${name}`;

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

// Shared field explanations (Create + Edit)
const periodNote = {
  en: "If the GL Date falls in a closed AR period, or no period is defined for it, you cannot save. Pick a date inside an open period.",
  bn: "GL Date যদি বন্ধ (closed) AR পিরিয়ডে পড়ে, বা সেই তারিখের জন্য কোনো পিরিয়ড না থাকে, তাহলে সেভ করা যাবে না। খোলা পিরিয়ডের ভেতরের তারিখ দিন।",
};

/* ════════════════════════════════════════════════════════════════════════
   1. RECEIVE VOUCHER LIST (ReceiveTable)
   ════════════════════════════════════════════════════════════════════════ */
export const receiveListGuide = {
  defaultLanguage: "en",
  languages,
  title: { en: "How the Receive Voucher page works", bn: "Receive Voucher পেজ কীভাবে কাজ করে" },
  purpose: {
    en: "This page lists your receive vouchers (customer receipts). Use it to find a voucher, attach its invoice, edit it, review it, download it, or reverse it.",
    bn: "এই পেজে Receive ভাউচার (কাস্টমারের কাছ থেকে প্রাপ্তি) দেখা যায়। এখান থেকে ভাউচার খুঁজুন, ইনভয়েস সংযুক্ত করুন, Edit, Review, ডাউনলোড বা Reverse করুন।",
  },
  overview: {
    image: {
      src: shot("list-overview.png"),
      alt: { en: "Receive Voucher page overview", bn: "Receive Voucher পেজের সামগ্রিক চিত্র" },
      caption: {
        en: "The Receive Voucher page. Click an image to open it full size.",
        bn: "Receive Voucher পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
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
        en: "Type in the search box, or set GL From Date and To Date to narrow the list. Click a column title to sort. Use the Columns button to hide or show columns. On a small screen the list becomes cards: tap a card to open its details and actions.",
        bn: "সার্চ বক্সে লিখুন, অথবা GL From Date ও To Date দিয়ে তালিকা ছোট করুন। কলামের নামে ক্লিক করলে সর্ট হয়। Columns বাটন দিয়ে কলাম দেখানো বা লুকানো যায়। ছোট স্ক্রিনে তালিকা কার্ড হয়ে যায়: কার্ডে ট্যাপ করলে বিস্তারিত ও অ্যাকশন খোলে।",
      },
      image: { src: shot("list-filters.png"), alt: { en: "Search and date filters", bn: "সার্চ ও তারিখ ফিল্টার" } },
    },
    {
      key: "create",
      title: { en: "Add a new receive voucher", bn: "নতুন Receive ভাউচার যোগ করুন" },
      text: {
        en: "Click \"Add New Receiver\" at the top right to open the Create page.",
        bn: "ওপরে ডানদিকের \"Add New Receiver\" বাটনে ক্লিক করলে Create পেজ খুলবে।",
      },
       image: { src: shot("list-create.png"), alt: { en: "Create voucher window", bn: "Create voucher উইন্ডো" } },
      permission: "RECEIVE_VOUCHER_CREATE",
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
      image: { src: shot("list-edit.png"), alt: { en: "Edit icon in the row", bn: "রো-তে Edit আইকন" } },
      permission: "RECEIVE_VOUCHER_EDIT",
    },
    {
      key: "review",
      title: { en: "Review an approved voucher", bn: "Approved ভাউচার Review করুন" },
      text: {
        en: "After approval, the pencil is replaced by an eye icon. Click it to see the details, attachments and account distribution in read-only mode.",
        bn: "Approved হওয়ার পর পেনসিলের জায়গায় চোখ (eye) আইকন দেখায়। ক্লিক করলে বিস্তারিত, অ্যাটাচমেন্ট ও অ্যাকাউন্ট ডিস্ট্রিবিউশন শুধু দেখার মোডে খোলে।",
      },
      image: { src: shot("list-review.png"), alt: { en: "Review voucher window", bn: "Review voucher উইন্ডো" } },
      permission: "RECEIVE_VOUCHER_EDIT",
    },
    {
      key: "download",
      title: { en: "Download the voucher", bn: "ভাউচার ডাউনলোড করুন" },
      text: {
        en: "Click the download icon and choose PDF or Excel. The file is named receipt_voucher_<voucher no>.",
        bn: "ডাউনলোড আইকনে ক্লিক করে PDF বা Excel বেছে নিন। ফাইলের নাম হয় receipt_voucher_<ভাউচার নম্বর>।",
      },
       image: { src: shot("list-download.png"), alt: { en: "Download voucher window", bn: "Download voucher উইন্ডো" } },
      permission: "RECEIVE_VOUCHER_DOWNLOAD",
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
      en: "The last row of the table shows the total of the vouchers currently listed. It changes when you search or filter.",
      bn: "টেবিলের শেষ সারিতে এই মুহূর্তে তালিকায় থাকা ভাউচারগুলোর মোট দেখায়। সার্চ বা ফিল্টার করলে এটি বদলায়।",
    },
    {
      en: "Clicking a row only highlights it, so you can keep your place. Click it again to remove the highlight.",
      bn: "রো-তে ক্লিক করলে শুধু হাইলাইট হয়, যাতে জায়গা মনে থাকে। আবার ক্লিক করলে হাইলাইট চলে যায়।",
    },
    {
      en: "If you can't see the Add, Edit or Download icons, your account doesn't have that permission. Contact your administrator.",
      bn: "Add, Edit বা Download আইকন না দেখালে বুঝবেন আপনার অ্যাকাউন্টে সেই অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
    },
  ],
  voucherTypes: [
    { label: "Manual", className: "text-gray-800 bg-gray-100" },
    { label: "Auto", className: "text-blue-800 bg-blue-100" },
    { label: "Reverse", className: "text-red-800 bg-red-100" },
  ],
  columns: [
    {
      label: "GL Date",
      text: {
        en: "The date the entry is posted to the ledger.",
        bn: "যে তারিখে এন্ট্রিটি লেজারে পোস্ট হয়।",
      },
    },
    {
      label: "Debit",
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
   2. CREATE RECEIVE VOUCHER (ReceiveCreate)
   ════════════════════════════════════════════════════════════════════════ */
export const receiveCreateGuide = {
  defaultLanguage: "en",
  languages,
  title: { en: "How to create a Receive Voucher", bn: "Receive Voucher কীভাবে তৈরি করবেন" },
  purpose: {
    en: "Use this page to record a new customer receipt: fill the voucher details, split the total across GL accounts, and submit.",
    bn: "কাস্টমারের কাছ থেকে নতুন প্রাপ্তি রেকর্ড করতে এই পেজ ব্যবহার করুন: ভাউচারের তথ্য দিন, মোট টাকা GL অ্যাকাউন্টে ভাগ করুন, তারপর সাবমিট করুন।",
  },
  overview: {
    image: {
      src: shot("create-overview.png"),
      alt: { en: "Create Receive Voucher page", bn: "Create Receive Voucher পেজ" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "customer",
      title: { en: "Choose the customer", bn: "কাস্টমার বেছে নিন" },
      text: {
        en: "Select the customer (required). If the customer is not in the list, click \"New Customer\" at the top, fill the form and create it, then select it.",
        bn: "কাস্টমার বেছে নিন (আবশ্যক)। তালিকায় না থাকলে ওপরের \"New Customer\" চাপুন, ফর্ম পূরণ করে তৈরি করুন, তারপর সিলেক্ট করুন।",
      },
      image: { src: shot("create-customer.png"), alt: { en: "Customer field", bn: "Customer ফিল্ড" } },
    },
    {
      key: "details",
      title: { en: "Fill the voucher details", bn: "ভাউচারের তথ্য দিন" },
      text: {
        en: "Set the GL Date, choose the Receive Code (required) and write a Description (required). Enter the number of supporting documents if you have any. Entry Date is fixed to today, and Invoice No and Sale Invoice No are filled by the system.",
        bn: "GL Date দিন, Receive Code বেছে নিন (আবশ্যক) এবং Description লিখুন (আবশ্যক)। সাপোর্টিং ডকুমেন্ট থাকলে সংখ্যা লিখুন। Entry Date আজকের তারিখে লক করা থাকে, আর Invoice No ও Sale Invoice No সিস্টেম নিজে দেয়।",
      },
      image: { src: shot("create-details.png"), alt: { en: "Voucher details", bn: "ভাউচারের তথ্য" } },
    },
    {
      key: "period",
      title: { en: "Check the GL Date period", bn: "GL Date-এর পিরিয়ড দেখুন" },
      text: {
        en: "A small badge next to GL Date shows \"Period Closed\" or \"No Period\" when the date cannot be used. While that is showing, the Add and Create Voucher buttons are disabled. Choose another date.",
        bn: "তারিখটি ব্যবহার করা না গেলে GL Date-এর পাশে \"Period Closed\" বা \"No Period\" ব্যাজ দেখায়। তখন Add ও Create Voucher বাটন বন্ধ থাকে। অন্য তারিখ বেছে নিন।",
      },
      image: { src: shot("create-period.png"), alt: { en: "Period status badge", bn: "পিরিয়ড স্ট্যাটাস ব্যাজ" } },
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
        en: "In Account Distribution, search and select an Account ID (Particular fills in automatically), type the Amount and click Add. Repeat for each account. You can still edit or delete a row in the table below. Total Amount is the sum of all rows.",
        bn: "Account Distribution-এ Account ID সার্চ করে সিলেক্ট করুন (Particular নিজে থেকে আসে), Amount লিখে Add চাপুন। প্রতিটি অ্যাকাউন্টের জন্য এভাবে করুন। নিচের টেবিলে যেকোনো সারি Edit বা মুছে ফেলা যায়। Total Amount হলো সব সারির যোগফল।",
      },
      image: { src: shot("create-rows.png"), alt: { en: "Account distribution", bn: "অ্যাকাউন্ট ডিস্ট্রিবিউশন" } },
    },
    {
      key: "submit",
      title: { en: "Review and submit", bn: "যাচাই করে সাবমিট করুন" },
      text: {
        en: "Click \"Create Voucher\". A summary window opens. Check it and press Confirm. On success you return to the Receive Voucher list.",
        bn: "\"Create Voucher\" চাপুন। একটি সারাংশ উইন্ডো খুলবে। যাচাই করে Confirm চাপুন। সফল হলে আপনি Receive Voucher তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("create-confirm.png"), alt: { en: "Confirm window", bn: "Confirm উইন্ডো" } },
    },
  ],
  notes: [
    {
      en: "Required: Customer, GL Date, Description, Receive Code and at least one account row. Each row needs an Account Code and a Particular.",
      bn: "আবশ্যক: Customer, GL Date, Description, Receive Code এবং অন্তত একটি অ্যাকাউন্ট সারি। প্রতিটি সারিতে Account Code ও Particular থাকতে হবে।",
    },
    periodNote,
    {
      en: "If you arrive from a Sale Invoice, the customer, dates, description, rows, type (Auto) and receive code are filled for you. If the shed has no income account set up, you will see a message and must choose the account yourself.",
      bn: "Sale Invoice থেকে এলে কাস্টমার, তারিখ, বিবরণ, সারি, Type (Auto) ও Receive Code আগে থেকে পূরণ হয়ে আসে। শেডের জন্য ইনকাম অ্যাকাউন্ট সেট করা না থাকলে একটি মেসেজ দেখাবে, তখন অ্যাকাউন্ট নিজে বেছে নিতে হবে।",
    },
  ],
  voucherTypes: [
    { label: "Manual", className: "text-gray-800 bg-gray-100" },
    { label: "Auto", className: "text-blue-800 bg-blue-100" },
    { label: "Reverse", className: "text-red-800 bg-red-100" },
  ],
  columns: [
    {
      label: "Entry Type",
      text: {
        en: "Manual (typed in by you), Auto (created from another page such as Sale Invoice) or Reverse.",
        bn: "Manual (আপনি নিজে দিচ্ছেন), Auto (অন্য পেজ, যেমন Sale Invoice থেকে তৈরি) অথবা Reverse।",
      },
    },
    {
      label: "Receive Code",
      text: {
        en: "The cash or bank account that received the money.",
        bn: "যে ক্যাশ বা ব্যাংক অ্যাকাউন্টে টাকা এসেছে।",
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
   3. EDIT RECEIVE VOUCHER (ReceiveEdit)
   ════════════════════════════════════════════════════════════════════════ */
export const receiveEditGuide = {
  defaultLanguage: "en",
  languages,
  title: { en: "How to edit a Receive Voucher", bn: "Receive Voucher কীভাবে Edit করবেন" },
  purpose: {
    en: "Use this page to correct a voucher that is not yet approved: change its details, attachments or account rows, then update it.",
    bn: "যে ভাউচার এখনো Approved হয়নি তা ঠিক করতে এই পেজ ব্যবহার করুন: তথ্য, অ্যাটাচমেন্ট বা অ্যাকাউন্ট সারি বদলে Update করুন।",
  },
  overview: {
    image: {
      src: shot("edit-overview.png"),
      alt: { en: "Edit Receive Voucher page", bn: "Edit Receive Voucher পেজ" },
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
        en: "The page opens with the saved voucher already filled in. Entry Date, Invoice No and Sale Invoice No cannot be changed.",
        bn: "পেজ খুললে সেভ করা ভাউচারের তথ্য আগে থেকেই পূরণ থাকে। Entry Date, Invoice No ও Sale Invoice No বদলানো যায় না।",
      },
      image: { src: shot("edit-details.png"), alt: { en: "Loaded voucher details", bn: "লোড হওয়া ভাউচারের তথ্য" } },
    },
    {
      key: "details",
      title: { en: "Change the details", bn: "তথ্য বদলান" },
      text: {
        en: "You can change the Customer, GL Date, Entry Type, Payment Code, No. of Supporting and Description. Customer, GL Date, Payment Code and at least one account row are required.",
        bn: "Customer, GL Date, Entry Type, Payment Code, No. of Supporting ও Description বদলানো যায়। Customer, GL Date, Payment Code এবং অন্তত একটি অ্যাকাউন্ট সারি আবশ্যক।",
      },
    },
    {
      key: "period",
      title: { en: "Check the GL Date period", bn: "GL Date-এর পিরিয়ড দেখুন" },
      text: {
        en: "If you change the GL Date to a closed period, or a date with no period, a badge appears and the Add and Update Voucher buttons are disabled. Choose another date.",
        bn: "GL Date বন্ধ পিরিয়ড বা পিরিয়ডহীন তারিখে নিলে একটি ব্যাজ দেখায় এবং Add ও Update Voucher বাটন বন্ধ হয়ে যায়। অন্য তারিখ বেছে নিন।",
      },
      image: { src: shot("edit-period.png"), alt: { en: "Period status badge", bn: "পিরিয়ড স্ট্যাটাস ব্যাজ" } },
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
        en: "Rows marked \"(saved)\" are already in the voucher. You can change their Particulars and Amount directly in the table, or delete them with the bin icon. To add a new row, select an Account ID, type the Amount and click Add. Total Amount updates automatically.",
        bn: "\"(saved)\" লেখা সারিগুলো ভাউচারে আগে থেকেই আছে। টেবিলেই এদের Particulars ও Amount বদলানো যায়, অথবা বিন আইকন দিয়ে মুছে ফেলা যায়। নতুন সারি যোগ করতে Account ID বেছে Amount লিখে Add চাপুন। Total Amount নিজে থেকে হিসাব হয়।",
      },
      image: { src: shot("edit-rows.png"), alt: { en: "Account rows", bn: "অ্যাকাউন্ট সারি" } },
    },
    {
      key: "update",
      title: { en: "Review and update", bn: "যাচাই করে Update করুন" },
      text: {
        en: "Click \"Update Voucher\". A summary window opens, with each account row marked existing or new. Check it and press Confirm. On success you return to the Receive Voucher list.",
        bn: "\"Update Voucher\" চাপুন। একটি সারাংশ উইন্ডো খুলবে, যেখানে প্রতিটি অ্যাকাউন্ট সারি existing বা new হিসেবে চিহ্নিত থাকে। যাচাই করে Confirm চাপুন। সফল হলে আপনি Receive Voucher তালিকায় ফিরে যাবেন।",
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
  voucherTypes: [
    { label: "Manual", className: "text-gray-800 bg-gray-100" },
    { label: "Auto", className: "text-blue-800 bg-blue-100" },
    { label: "Reverse", className: "text-red-800 bg-red-100" },
  ],
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
        en: "The cash or bank account that received the money.",
        bn: "যে ক্যাশ বা ব্যাংক অ্যাকাউন্টে টাকা এসেছে।",
      },
    },
    {
      label: "(saved)",
      text: {
        en: "Marks an account row that was already saved in this voucher.",
        bn: "যে অ্যাকাউন্ট সারি এই ভাউচারে আগে থেকেই সেভ করা আছে তা চিহ্নিত করে।",
      },
    },
  ],
};