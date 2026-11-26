// Sale Invoice guide texts (English + Bangla): list, create, edit.
// Used with <SaleInvoiceGuideSheet /> (see SaleInvoiceGuideSheet.jsx).
//
// Usage:
//   import { SaleInvoiceGuideSheet } from "@/components/sale-invoice-guide/SaleInvoiceGuideSheet";
//   import { saleInvoiceListGuide } from "@/components/sale-invoice-guide/sale-invoice-guide";
//   <SaleInvoiceGuideSheet guide={saleInvoiceListGuide} can={guidePermissions} />
//
// Permission keys (pass them in the `can` prop, list page only):
//   SALE_INVOICE_CREATE, SALE_INVOICE_EDIT, SALE_INVOICE_DELETE
//
// Screenshots go in public/guide/sale-invoice/ (missing files are simply hidden).

const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/sale-invoice/${name}`;

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
];

const ui = {
  guideButton: { en: "Guide", bn: "গাইড" },
  columnsHeading: { en: "What the fields mean", bn: "ফিল্ডগুলোর অর্থ" },
  notesHeading: { en: "Good to know", bn: "জেনে রাখুন" },
  openImage: { en: "Open full size", bn: "বড় করে দেখুন" },
};

const lockedText = {
  en: "Your account doesn't have permission for this step. Contact your administrator.",
  bn: "আপনার অ্যাকাউন্টে এই ধাপের অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
};

// Shared between Create and Edit
const shadeChangeNote = {
  en: "If you change the Shade after adding production records, the added records are cleared (a message tells you), because each invoice uses the production of one shade only. Add the records again after choosing the new shade.",
  bn: "প্রোডাকশন রেকর্ড যোগ করার পর Shade বদলালে যোগ করা রেকর্ডগুলো মুছে যায় (একটি মেসেজ দেখায়), কারণ একটি ইনভয়েসে একটি Shade-এর প্রোডাকশনই ব্যবহার করা যায়। নতুন Shade বেছে আবার রেকর্ড যোগ করুন।",
};

const combineNote = {
  en: "All the production dates you add are combined into one invoice line. The Quantity (Eggs) of that line is the total of those dates.",
  bn: "যেসব প্রোডাকশন তারিখ যোগ করেন সেগুলো একটি ইনভয়েস লাইনে একত্র হয়। ওই লাইনের Quantity (Eggs) হলো সেই তারিখগুলোর মোট।",
};

const salesQtyNote = {
  en: "Sales Qty can be different from Quantity (Eggs), for example when some eggs were not sold. It is split across the production dates automatically.",
  bn: "Sales Qty, Quantity (Eggs) থেকে আলাদা হতে পারে, যেমন কিছু ডিম বিক্রি না হলে। এটি নিজে থেকে প্রোডাকশন তারিখগুলোর মধ্যে ভাগ হয়।",
};

/* ════════════════════════════════════════════════════════════════════════
   1. SALE INVOICE LIST (InvoiceList)
   ════════════════════════════════════════════════════════════════════════ */
export const saleInvoiceListGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How the Sales Invoices page works",
    bn: "Sales Invoices পেজ কীভাবে কাজ করে",
  },
  purpose: {
    en: "This page lists your egg sales invoices. Use it to find an invoice, create a new one, open it to edit or view, or delete it, and to see the totals for what is listed.",
    bn: "এই পেজে আপনার ডিম বিক্রির ইনভয়েসগুলো দেখা যায়। এখান থেকে ইনভয়েস খুঁজুন, নতুন তৈরি করুন, Edit বা View করুন, Delete করুন, এবং তালিকার মোট হিসাব দেখুন।",
  },
  overview: {
    image: {
      src: shot("list-overview.png"),
      alt: { en: "Sales Invoices page overview", bn: "Sales Invoices পেজের সামগ্রিক চিত্র" },
      caption: {
        en: "The Sales Invoices page. Click an image to open it full size.",
        bn: "Sales Invoices পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
      },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "find",
      title: { en: "Find your invoice", bn: "আপনার ইনভয়েস খুঁজুন" },
      text: {
        en: "Type in the Search box (customer, shade, date), or set Invoice From Date and To Date to narrow the list. The dates apply instantly; use the ✕ inside a date box to clear it. Click a column title to sort (an arrow shows on the sorted column). Use the Columns button to hide or show columns. The refresh button reloads the list.",
        bn: "Search বক্সে লিখুন (কাস্টমার, Shade, তারিখ), অথবা Invoice From Date ও To Date দিয়ে তালিকা ছোট করুন। তারিখ দেওয়ামাত্র ফিল্টার হয়; তারিখ মুছতে বক্সের ভেতরের ✕ চাপুন। কলামের নামে ক্লিক করলে সর্ট হয় (সর্ট করা কলামে তীর দেখায়)। Columns বাটন দিয়ে কলাম দেখানো বা লুকানো যায়। রিফ্রেশ বাটনে তালিকা আবার লোড হয়।",
      },
      image: { src: shot("list-filters.png"), alt: { en: "Search and date filters", bn: "সার্চ ও তারিখ ফিল্টার" } },
    },
    {
      key: "totals",
      title: { en: "Read the totals", bn: "মোট হিসাব দেখুন" },
      text: {
        en: "The four cards show Total Entries, Total Quantity (Eggs), Total Sales Qty and Total Amount. They follow your search and dates, and count all pages, not just the page you are on.",
        bn: "চারটি কার্ডে Total Entries, Total Quantity (Eggs), Total Sales Qty ও Total Amount দেখায়। এগুলো সার্চ ও তারিখ অনুযায়ী হয়, এবং শুধু বর্তমান পেজ নয়, সব পেজ ধরে হিসাব করে।",
      },
      image: { src: shot("list-totals.png"), alt: { en: "Summary cards", bn: "সামারি কার্ড" } },
    },
    {
      key: "create",
      title: { en: "Create a new invoice", bn: "নতুন ইনভয়েস তৈরি করুন" },
      text: {
        en: "Click \"New Invoice\" at the top right to open the Create page.",
        bn: "ওপরে ডানদিকের \"New Invoice\" বাটনে ক্লিক করলে Create পেজ খুলবে।",
      },
      image: { src: shot("list-create.png"), alt: { en: "New Invoice button", bn: "New Invoice বাটন" } },
      permission: "SALE_INVOICE_CREATE",
    },
    {
      key: "edit",
      title: { en: "Edit or view an invoice", bn: "ইনভয়েস Edit বা View করুন" },
      text: {
        en: "Click the pencil icon in the Actions column to open the invoice. If a Receive Voucher has already been created for it, the invoice shows a green \"Received\" label, the pencil becomes an eye icon, and the invoice opens in view-only mode. On a small screen, tap the row first, then press Edit or View.",
        bn: "Actions কলামের পেনসিল আইকনে ক্লিক করলে ইনভয়েস খুলবে। এর জন্য Receive Voucher আগেই তৈরি হয়ে থাকলে ইনভয়েসে সবুজ \"Received\" লেবেল দেখায়, পেনসিল বদলে চোখ (eye) আইকন হয়, এবং ইনভয়েস শুধু দেখার মোডে খোলে। ছোট স্ক্রিনে আগে সারিতে ট্যাপ করুন, তারপর Edit বা View চাপুন।",
      },
      image: { src: shot("list-edit.png"), alt: { en: "Edit and view icons", bn: "Edit ও View আইকন" } },
      permission: "SALE_INVOICE_EDIT",
    },
    {
      key: "delete",
      title: { en: "Delete an invoice", bn: "ইনভয়েস Delete করুন" },
      text: {
        en: "Click the red trash icon and confirm. The confirmation names the invoice and the customer. Deleting cannot be undone. An invoice that already has a Receive Voucher cannot be deleted: its trash icon is dimmed, and pointing at it tells you why. On a small screen, tap the row first, then press Delete.",
        bn: "লাল ট্র্যাশ আইকনে ক্লিক করে নিশ্চিত করুন। নিশ্চিতকরণে ইনভয়েস ও কাস্টমারের নাম দেখায়। Delete ফিরিয়ে নেওয়া যায় না। যে ইনভয়েসে Receive Voucher আছে তা Delete করা যায় না: তার ট্র্যাশ আইকন ম্লান থাকে, আর আইকনের ওপর মাউস নিলে কারণ দেখায়। ছোট স্ক্রিনে আগে সারিতে ট্যাপ করুন, তারপর Delete চাপুন।",
      },
      image: { src: shot("list-delete.png"), alt: { en: "Delete confirmation", bn: "Delete নিশ্চিতকরণ" } },
      permission: "SALE_INVOICE_DELETE",
    },
    {
      key: "mobile",
      title: { en: "Using a small screen", bn: "ছোট স্ক্রিনে ব্যবহার" },
      text: {
        en: "On a phone the table becomes rows showing the invoice number, amount, customer and date. Tap a row to open Shade, Quantity, Sales Qty and the Edit / View / Delete buttons. Sorting moves to the Sort box above the list, with a button to flip the direction.",
        bn: "ফোনে টেবিল সারি আকারে দেখায়, যেখানে ইনভয়েস নম্বর, অ্যামাউন্ট, কাস্টমার ও তারিখ থাকে। সারিতে ট্যাপ করলে Shade, Quantity, Sales Qty এবং Edit / View / Delete বাটন খোলে। সর্টিং তালিকার ওপরের Sort বক্সে চলে যায়, পাশে দিক উল্টানোর বাটন থাকে।",
      },
      image: { src: shot("list-mobile.png"), alt: { en: "Small screen view", bn: "ছোট স্ক্রিনের চিত্র" } },
    },
  ],
  notes: [
    {
      en: "Delete cannot be undone, so check the invoice number and customer before confirming.",
      bn: "Delete ফিরিয়ে নেওয়া যায় না, তাই নিশ্চিত করার আগে ইনভয়েস নম্বর ও কাস্টমার দেখে নিন।",
    },
    {
      en: "Once a Receive Voucher is created for an invoice, the invoice is locked: it can only be viewed, not edited or deleted.",
      bn: "ইনভয়েসের জন্য Receive Voucher তৈরি হয়ে গেলে ইনভয়েসটি লক হয়ে যায়: শুধু দেখা যায়, Edit বা Delete করা যায় না।",
    },
    {
      en: "Records are shown 50 per page. Use the page controls at the bottom to move between pages.",
      bn: "প্রতি পেজে ৫০টি রেকর্ড দেখায়। পেজ বদলাতে নিচের পেজ কন্ট্রোল ব্যবহার করুন।",
    },
    {
      en: "Clicking a row only highlights it, so you can keep your place. Click it again to remove the highlight.",
      bn: "সারিতে ক্লিক করলে শুধু হাইলাইট হয়, যাতে জায়গা মনে থাকে। আবার ক্লিক করলে হাইলাইট চলে যায়।",
    },
    {
      en: "If nothing matches your search or dates, press \"Clear filters\" to reset them.",
      bn: "সার্চ বা তারিখে কিছু না মিললে \"Clear filters\" চাপলে সেগুলো রিসেট হয়।",
    },
    {
      en: "If you can't see the New Invoice, Edit or Delete buttons, your account doesn't have that permission. Contact your administrator.",
      bn: "New Invoice, Edit বা Delete বাটন না দেখালে বুঝবেন আপনার অ্যাকাউন্টে সেই অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
    },
  ],
  columns: [
    {
      label: "Invoice #",
      text: {
        en: "The invoice number. A green \"Received\" label means a Receive Voucher was already created for it.",
        bn: "ইনভয়েস নম্বর। সবুজ \"Received\" লেবেল মানে এর জন্য Receive Voucher আগেই তৈরি হয়েছে।",
      },
    },
    {
      label: "Invoice Date",
      text: { en: "The date of the invoice.", bn: "ইনভয়েসের তারিখ।" },
    },
    {
      label: "Customer",
      text: { en: "Who the eggs were sold to.", bn: "যাকে ডিম বিক্রি করা হয়েছে।" },
    },
    {
      label: "Shade",
      text: { en: "The shade (shed) the eggs came from.", bn: "যে Shade (শেড) থেকে ডিম এসেছে।" },
    },
    {
      label: "Quantity (Eggs)",
      text: {
        en: "Total eggs of the production records on this invoice.",
        bn: "এই ইনভয়েসের প্রোডাকশন রেকর্ডগুলোর মোট ডিম।",
      },
    },
    {
      label: "Sales Qty",
      text: { en: "Number of eggs actually sold.", bn: "বাস্তবে বিক্রি হওয়া ডিমের সংখ্যা।" },
    },
    {
      label: "Total Amount",
      text: { en: "The total amount of the invoice.", bn: "ইনভয়েসের মোট অ্যামাউন্ট।" },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   2. CREATE SALE INVOICE (CreateInvoicePage)
   ════════════════════════════════════════════════════════════════════════ */
export const saleInvoiceCreateGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to create a Sales Invoice",
    bn: "Sales Invoice কীভাবে তৈরি করবেন",
  },
  purpose: {
    en: "Use this page to sell eggs from your production records: choose the customer, the shade and the date, add the production dates you are selling, enter the unit price, and create the invoice.",
    bn: "প্রোডাকশন রেকর্ড থেকে ডিম বিক্রির ইনভয়েস করতে এই পেজ ব্যবহার করুন: কাস্টমার, Shade ও তারিখ বেছে নিন, বিক্রি করা প্রোডাকশন তারিখ যোগ করুন, ইউনিট প্রাইস লিখুন এবং ইনভয়েস তৈরি করুন।",
  },
  overview: {
    image: {
      src: shot("create-overview.png"),
      alt: { en: "Create Invoice page", bn: "Create Invoice পেজ" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "details",
      title: { en: "Choose Customer, Shade and Invoice Date", bn: "Customer, Shade ও Invoice Date বেছে নিন" },
      text: {
        en: "Select the Customer, select the Shade the eggs came from, and check the Invoice Date (it starts as today). All three are required.",
        bn: "Customer বেছে নিন, যে Shade থেকে ডিম এসেছে সেটি বেছে নিন, এবং Invoice Date দেখুন (শুরুতে আজকের তারিখ থাকে)। তিনটিই আবশ্যক।",
      },
      image: { src: shot("create-details.png"), alt: { en: "Customer, shade and date", bn: "Customer, Shade ও তারিখ" } },
    },
    {
      key: "production",
      title: { en: "Add production records", bn: "প্রোডাকশন রেকর্ড যোগ করুন" },
      text: {
        en: "The \"Add Production Record\" box stays disabled until you choose a Shade. Then open it and tick one or more production dates (each shows the date and its number of eggs). Only records of that shade that are not already used are listed. Press \"Add Selected\" to add them to the invoice.",
        bn: "Shade না বাছা পর্যন্ত \"Add Production Record\" বক্স বন্ধ থাকে। Shade বাছার পর বক্স খুলে এক বা একাধিক প্রোডাকশন তারিখে টিক দিন (প্রতিটিতে তারিখ ও ডিমের সংখ্যা দেখায়)। শুধু সেই Shade-এর এখনো ব্যবহার না হওয়া রেকর্ড তালিকায় আসে। ইনভয়েসে যোগ করতে \"Add Selected\" চাপুন।",
      },
      image: { src: shot("create-production.png"), alt: { en: "Production record picker", bn: "প্রোডাকশন রেকর্ড পিকার" } },
    },
    {
      key: "chips",
      title: { en: "Remove a date if needed", bn: "দরকার হলে তারিখ বাদ দিন" },
      text: {
        en: "Added dates appear as dark labels under the picker. Click the ✕ on a label to take that date out of the invoice. Dates you ticked but have not added yet appear as light labels, and can be removed the same way.",
        bn: "যোগ করা তারিখগুলো পিকারের নিচে গাঢ় লেবেল হিসেবে দেখায়। ইনভয়েস থেকে কোনো তারিখ বাদ দিতে লেবেলের ✕ চাপুন। টিক দিয়েছেন কিন্তু এখনো যোগ করেননি এমন তারিখ হালকা লেবেল হিসেবে দেখায়, সেগুলোও একইভাবে বাদ দেওয়া যায়।",
      },
      image: { src: shot("create-chips.png"), alt: { en: "Selected production dates", bn: "বাছাই করা প্রোডাকশন তারিখ" } },
    },
    {
      key: "line",
      title: { en: "Fill the invoice line", bn: "ইনভয়েস লাইন পূরণ করুন" },
      text: {
        en: "A line appears in the table. You can change its Date and Description. Quantity (Eggs) is calculated for you. Sales Qty starts equal to the quantity and can be changed. Enter the Unit Price/Egg: it is required and must be more than 0. The trash icon removes the whole line.",
        bn: "টেবিলে একটি লাইন আসে। এর Date ও Description বদলানো যায়। Quantity (Eggs) নিজে থেকে হিসাব হয়। Sales Qty শুরুতে Quantity-র সমান থাকে এবং বদলানো যায়। Unit Price/Egg লিখুন: এটি আবশ্যক এবং ০-এর বেশি হতে হবে। ট্র্যাশ আইকনে পুরো লাইন মুছে যায়।",
      },
      image: { src: shot("create-line.png"), alt: { en: "Invoice line", bn: "ইনভয়েস লাইন" } },
    },
    {
      key: "submit",
      title: { en: "Create the invoice", bn: "ইনভয়েস তৈরি করুন" },
      text: {
        en: "Check the Subtotal under the table, then press \"Create Invoice\" in the bottom bar. The button stays disabled until there is at least one line. On success you return to the Sales Invoices list.",
        bn: "টেবিলের নিচের Subtotal দেখে নিন, তারপর নিচের বারে \"Create Invoice\" চাপুন। অন্তত একটি লাইন না থাকলে বাটন বন্ধ থাকে। সফল হলে আপনি Sales Invoices তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("create-submit.png"), alt: { en: "Create Invoice button", bn: "Create Invoice বাটন" } },
    },
  ],
  notes: [
    {
      en: "Required: Customer, Shade, Invoice Date, at least one production line, and a Unit Price above 0. A message tells you what is missing.",
      bn: "আবশ্যক: Customer, Shade, Invoice Date, অন্তত একটি প্রোডাকশন লাইন এবং ০-এর বেশি Unit Price। কী বাকি আছে তা মেসেজে জানানো হয়।",
    },
    combineNote,
    salesQtyNote,
    shadeChangeNote,
    {
      en: "Cancel (or the back arrow) returns to the list without saving, and does not ask for confirmation.",
      bn: "Cancel (বা পেছনের তীর) সেভ না করে তালিকায় ফিরে যায়, এবং নিশ্চিতকরণ চায় না।",
    },
  ],
  columns: [
    {
      label: "Shade",
      text: {
        en: "The shed the eggs came from. It decides which production records you can add.",
        bn: "যে শেড থেকে ডিম এসেছে। এটি ঠিক করে কোন প্রোডাকশন রেকর্ড যোগ করা যাবে।",
      },
    },
    {
      label: "Quantity (Eggs)",
      text: {
        en: "Total eggs of the production dates on the line. It cannot be typed in.",
        bn: "লাইনের প্রোডাকশন তারিখগুলোর মোট ডিম। এটি হাতে লেখা যায় না।",
      },
    },
    {
      label: "Sales Qty",
      text: { en: "Number of eggs you are actually selling.", bn: "আপনি বাস্তবে যে কয়টি ডিম বিক্রি করছেন।" },
    },
    {
      label: "Unit Price/Egg",
      text: { en: "The price of one egg.", bn: "একটি ডিমের দাম।" },
    },
    {
      label: "Amount",
      text: { en: "The line amount, shown per line. The Subtotal below the table adds them up.", bn: "লাইনের অ্যামাউন্ট। টেবিলের নিচের Subtotal সেগুলো যোগ করে দেখায়।" },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   3. EDIT / VIEW SALE INVOICE (EditInvoicePage)
   ════════════════════════════════════════════════════════════════════════ */
export const saleInvoiceEditGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to edit or view a Sales Invoice",
    bn: "Sales Invoice কীভাবে Edit বা View করবেন",
  },
  purpose: {
    en: "Use this page to correct an invoice, or to view one that is locked. After editing you can update the invoice, or go on to create its Receive Voucher.",
    bn: "ইনভয়েস ঠিক করতে, অথবা লক হয়ে যাওয়া ইনভয়েস দেখতে এই পেজ ব্যবহার করুন। Edit করার পর ইনভয়েস Update করতে পারেন, অথবা এর Receive Voucher তৈরিতে যেতে পারেন।",
  },
  overview: {
    image: {
      src: shot("edit-overview.png"),
      alt: { en: "Edit Invoice page", bn: "Edit Invoice পেজ" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "load",
      title: { en: "Check the loaded invoice", bn: "লোড হওয়া ইনভয়েস দেখুন" },
      text: {
        en: "The page opens with the saved invoice filled in. The title shows the invoice number. The production dates already on the invoice are shown as dark labels, and the line is in the table.",
        bn: "পেজ খুললে সেভ করা ইনভয়েসের তথ্য পূরণ থাকে। শিরোনামে ইনভয়েস নম্বর দেখায়। ইনভয়েসে থাকা প্রোডাকশন তারিখগুলো গাঢ় লেবেল হিসেবে এবং লাইনটি টেবিলে দেখায়।",
      },
      image: { src: shot("edit-load.png"), alt: { en: "Loaded invoice", bn: "লোড হওয়া ইনভয়েস" } },
    },
    {
      key: "locked",
      title: { en: "A locked invoice is view-only", bn: "লক ইনভয়েস শুধু দেখা যায়" },
      text: {
        en: "If a Receive Voucher was already created for this invoice, a green \"Locked\" label shows next to the title, every field is disabled, and the bottom bar only offers \"Close\" and a dimmed \"Receive Voucher Created\" button. Nothing can be changed.",
        bn: "এই ইনভয়েসের জন্য Receive Voucher আগেই তৈরি হয়ে থাকলে শিরোনামের পাশে সবুজ \"Locked\" লেবেল দেখায়, সব ফিল্ড বন্ধ থাকে, এবং নিচের বারে শুধু \"Close\" ও ম্লান \"Receive Voucher Created\" বাটন থাকে। কিছুই বদলানো যায় না।",
      },
      image: { src: shot("edit-locked.png"), alt: { en: "Locked invoice", bn: "লক ইনভয়েস" } },
    },
    {
      key: "details",
      title: { en: "Change Customer, Shade or Date", bn: "Customer, Shade বা তারিখ বদলান" },
      text: {
        en: "You can change the Customer, the Shade and the Invoice Date. All three are required. An older invoice saved without a Shade shows the Shade empty: choose one before you update.",
        bn: "Customer, Shade ও Invoice Date বদলানো যায়। তিনটিই আবশ্যক। Shade ছাড়া সেভ হওয়া পুরোনো ইনভয়েসে Shade ফাঁকা দেখায়: Update করার আগে একটি বেছে নিন।",
      },
      image: { src: shot("edit-details.png"), alt: { en: "Customer, shade and date", bn: "Customer, Shade ও তারিখ" } },
    },
    {
      key: "production",
      title: { en: "Add or remove production dates", bn: "প্রোডাকশন তারিখ যোগ বা বাদ দিন" },
      text: {
        en: "To add more, open \"Add Production Record\" (it needs a Shade), tick the dates and press \"Add Selected\". Only unused records of that shade are listed. To take a date out, click the ✕ on its dark label.",
        bn: "আরও যোগ করতে \"Add Production Record\" খুলুন (Shade লাগবে), তারিখে টিক দিয়ে \"Add Selected\" চাপুন। শুধু সেই Shade-এর ব্যবহার না হওয়া রেকর্ড তালিকায় আসে। কোনো তারিখ বাদ দিতে তার গাঢ় লেবেলের ✕ চাপুন।",
      },
      image: { src: shot("edit-production.png"), alt: { en: "Production record picker", bn: "প্রোডাকশন রেকর্ড পিকার" } },
    },
    {
      key: "line",
      title: { en: "Correct the invoice line", bn: "ইনভয়েস লাইন ঠিক করুন" },
      text: {
        en: "In the table you can change the Date, Description, Sales Qty and Unit Price/Egg. The Amount is Sales Qty times Unit Price, and the Subtotal below adds the lines. Unit Price must be above 0.",
        bn: "টেবিলে Date, Description, Sales Qty ও Unit Price/Egg বদলানো যায়। Amount হলো Sales Qty গুণ Unit Price, আর নিচের Subtotal লাইনগুলো যোগ করে। Unit Price ০-এর বেশি হতে হবে।",
      },
      image: { src: shot("edit-line.png"), alt: { en: "Invoice line", bn: "ইনভয়েস লাইন" } },
    },
    {
      key: "update",
      title: { en: "Update the invoice", bn: "ইনভয়েস Update করুন" },
      text: {
        en: "Press \"Update Invoice\" in the bottom bar. It stays disabled while there are no lines. On success you return to the Sales Invoices list.",
        bn: "নিচের বারে \"Update Invoice\" চাপুন। লাইন না থাকলে বাটন বন্ধ থাকে। সফল হলে আপনি Sales Invoices তালিকায় ফিরে যাবেন।",
      },
      image: { src: shot("edit-update.png"), alt: { en: "Update Invoice button", bn: "Update Invoice বাটন" } },
    },
    {
      key: "receive",
      title: { en: "Create the Receive Voucher", bn: "Receive Voucher তৈরি করুন" },
      text: {
        en: "Press \"Receive Voucher\" to go to the Receive Voucher page with the customer, shade, date, description and amounts already filled in from this invoice. Once that voucher is created, this invoice becomes locked.",
        bn: "\"Receive Voucher\" চাপলে Receive Voucher পেজে যাবেন, যেখানে এই ইনভয়েস থেকে কাস্টমার, Shade, তারিখ, বিবরণ ও অ্যামাউন্ট আগে থেকেই পূরণ থাকে। ওই ভাউচার তৈরি হলে এই ইনভয়েস লক হয়ে যায়।",
      },
      image: { src: shot("edit-receive.png"), alt: { en: "Receive Voucher button", bn: "Receive Voucher বাটন" } },
    },
  ],
  notes: [
    {
      en: "Required: Customer, Shade, Invoice Date, at least one production line, and a Unit Price above 0. A message tells you what is missing.",
      bn: "আবশ্যক: Customer, Shade, Invoice Date, অন্তত একটি প্রোডাকশন লাইন এবং ০-এর বেশি Unit Price। কী বাকি আছে তা মেসেজে জানানো হয়।",
    },
    combineNote,
    salesQtyNote,
    shadeChangeNote,
    {
      en: "If you made changes and press Cancel or the back arrow, you are asked whether to discard them.",
      bn: "পরিবর্তন করার পর Cancel বা পেছনের তীর চাপলে বাতিল করবেন কিনা জিজ্ঞেস করা হয়।",
    },
    {
      en: "The Receive Voucher button takes you away from this page without saving. Press \"Update Invoice\" first if you changed something.",
      bn: "Receive Voucher বাটন সেভ না করেই এই পেজ থেকে নিয়ে যায়। কিছু বদলালে আগে \"Update Invoice\" চাপুন।",
    },
  ],
  columns: [
    {
      label: "Locked",
      text: {
        en: "Shown when a Receive Voucher exists for the invoice. The invoice can then only be viewed.",
        bn: "ইনভয়েসের Receive Voucher থাকলে দেখায়। তখন ইনভয়েস শুধু দেখা যায়।",
      },
    },
    {
      label: "Quantity (Eggs)",
      text: {
        en: "Total eggs of the production dates on the line. It cannot be typed in.",
        bn: "লাইনের প্রোডাকশন তারিখগুলোর মোট ডিম। এটি হাতে লেখা যায় না।",
      },
    },
    {
      label: "Sales Qty",
      text: { en: "Number of eggs actually sold.", bn: "বাস্তবে বিক্রি হওয়া ডিমের সংখ্যা।" },
    },
    {
      label: "Unit Price/Egg",
      text: { en: "The price of one egg.", bn: "একটি ডিমের দাম।" },
    },
    {
      label: "Amount",
      text: { en: "Sales Qty times Unit Price for the line.", bn: "লাইনের Sales Qty গুণ Unit Price।" },
    },
  ],
};