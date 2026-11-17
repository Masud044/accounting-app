// Guide for the Vendor Payments page (AP/AR module).
// Same shape as approval-voucher-guide.js. Used by <PageGuideSheet />.
//
// TEXT: every user-facing text is { en: "...", bn: "..." }.
// SCREENSHOTS: put the files in public/guide/vendor-payments/ (see the integration doc).
// A missing image file is simply not shown.
// This page has no permission keys, so no step is locked.

// public/guide/vendor-payments/<name>  (works with a Vite `base` path too)
const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/vendor-payments/${name}`;

export const vendorPaymentsGuide = {
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
    en: "Use this page to pay a vendor. You can pay in advance before the invoice arrives, add the vendor's payable invoices, and settle them from the advance, from a bank or cash account, or both.",
    bn: "এই পেজে ভেন্ডরকে পেমেন্ট করা হয়। ইনভয়েস আসার আগে অ্যাডভান্স দিতে পারেন, ভেন্ডরের payable ইনভয়েস যোগ করতে পারেন, এবং সেগুলো অ্যাডভান্স থেকে, ব্যাংক বা ক্যাশ অ্যাকাউন্ট থেকে, অথবা দুটো মিলিয়ে পরিশোধ (settle) করতে পারেন।",
  },

  overview: {
    image: {
      src: shot("overview.png"),
      alt: {
        en: "Vendor Payments page overview",
        bn: "Vendor Payments পেজের সামগ্রিক চিত্র",
      },
      caption: {
        en: "The Vendor Payments page. Click an image to open it full size.",
        bn: "Vendor Payments পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
      },
    },
  },

  lockedText: {
    en: "Your account doesn't have permission for this step. Contact your administrator.",
    bn: "আপনার অ্যাকাউন্টে এই ধাপের অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
  },

  ui: {
    voucherTypeIntro: {
      en: "is shown as a colored label:",
      bn: "রঙিন লেবেল হিসেবে দেখানো হয়:",
    },
    columnsHeading: { en: "What the terms mean", bn: "শব্দগুলোর অর্থ" },
    notesHeading: { en: "Good to know", bn: "জেনে রাখুন" },
    openImage: { en: "Open full size", bn: "বড় করে দেখুন" },
  },

  steps: [
    {
      key: "vendor",
      title: { en: "Choose the vendor", bn: "ভেন্ডর নির্বাচন করুন" },
      text: {
        en: "Pick the vendor from the Vendor dropdown at the top right. Its invoices, advances, payments and refunds then appear. If there are no vendors yet, type a name and click Add vendor.",
        bn: "পেজের উপরে ডানদিকের Vendor ড্রপডাউন থেকে ভেন্ডর বেছে নিন। এরপর তার ইনভয়েস, অ্যাডভান্স, পেমেন্ট ও রিফান্ড দেখা যাবে। কোনো ভেন্ডর না থাকলে নাম লিখে Add vendor চাপুন।",
      },
      image: {
        src: shot("select-vendor.png"),
        alt: { en: "Vendor dropdown", bn: "Vendor ড্রপডাউন" },
      },
    },
    {
      key: "advance",
      title: {
        en: "Record an advance (paying before the invoice)",
        bn: "অ্যাডভান্স রেকর্ড করুন (ইনভয়েসের আগে পেমেন্ট)",
      },
      text: {
        en: "Open the Advance to vendor tab. Choose the account you paid from, the payment date and the method, and add a reference such as a PO number. In Advance lines, write what the advance is for (required) and the amount. Click Add line if you need more lines. The account of an advance line is fixed. Check the Journal entry preview, then click Record advance. The amount becomes the vendor's Advance balance.",
        bn: "Advance to vendor ট্যাবে যান। কোন অ্যাকাউন্ট থেকে পেমেন্ট করেছেন, পেমেন্টের তারিখ ও পদ্ধতি বেছে নিন এবং রেফারেন্স (যেমন PO নম্বর) দিন। Advance lines-এ অ্যাডভান্স কীসের জন্য (আবশ্যক) এবং পরিমাণ লিখুন। আরও লাইন লাগলে Add line চাপুন। অ্যাডভান্স লাইনের অ্যাকাউন্ট নির্দিষ্ট, বদলানো যায় না। Journal entry preview দেখে নিয়ে Record advance চাপুন। এই টাকা ভেন্ডরের Advance balance হিসেবে জমা থাকবে।",
      },
      image: {
        src: shot("advance.png"),
        alt: { en: "Advance to vendor form", bn: "Advance to vendor ফর্ম" },
      },
    },
    {
      key: "invoice",
      title: { en: "Add a payable invoice", bn: "Payable ইনভয়েস যোগ করুন" },
      text: {
        en: "Open the Pay against invoices tab and click Add payable invoice. The invoice number is filled in for you and can be changed. Set the invoice date and the due date (the due date starts 30 days ahead), and write a description (required). In Invoice lines, choose the account and enter the amount. To use an advance already paid to this vendor, pick it in Link advance payment. The amount to apply is filled in for you and can be lowered (at most the smaller of the advance balance and the invoice total). Check the Journal entry preview, then click Save invoice. Use the attachment button on the invoice row to attach the invoice file.",
        bn: "Pay against invoices ট্যাবে গিয়ে Add payable invoice চাপুন। ইনভয়েস নম্বর নিজে থেকে বসে যায়, চাইলে বদলাতে পারেন। ইনভয়েসের তারিখ ও Due তারিখ দিন (Due তারিখ প্রথমে ৩০ দিন পরে ধরা থাকে) এবং Description লিখুন (আবশ্যক)। Invoice lines-এ অ্যাকাউন্ট বেছে পরিমাণ দিন। এই ভেন্ডরকে আগে দেওয়া কোনো অ্যাডভান্স ব্যবহার করতে চাইলে Link advance payment থেকে সেটি বাছুন। কত টাকা ধরা হবে তা নিজে থেকে বসে যায়, কমাতে পারেন (অ্যাডভান্সের ব্যালেন্স ও ইনভয়েসের মোট, এই দুটির ছোটটির বেশি হবে না)। Journal entry preview দেখে Save invoice চাপুন। ইনভয়েসের ফাইল জুড়তে সারির অ্যাটাচমেন্ট বাটন ব্যবহার করুন।",
      },
      image: {
        src: shot("invoice.png"),
        alt: { en: "Add payable invoice form", bn: "Payable ইনভয়েস যোগ করার ফর্ম" },
      },
    },
    {
      key: "settle",
      title: {
        en: "Pay the invoices (settle)",
        bn: "ইনভয়েস পরিশোধ করুন (Settle)",
      },
      text: {
        en: "In the invoice table, tick the invoices you want to pay. Pay now starts at the full balance. Lower it for a part payment (it cannot be more than the balance). Tick Apply advance balance to use the vendor's advance first, and the rest is paid in cash. Choose the method, the Paid from account (not needed if the whole amount comes from the advance) and the payment date. Check Selected invoices, Advance applied and Cash to pay, then click Settle selected invoices.",
        bn: "ইনভয়েস টেবিলে যেগুলো পরিশোধ করবেন সেগুলোর চেকবক্সে টিক দিন। Pay now-এ প্রথমে পুরো ব্যালেন্স বসে থাকে। আংশিক দিতে চাইলে কমিয়ে দিন (ব্যালেন্সের বেশি দেওয়া যায় না)। ভেন্ডরের অ্যাডভান্স আগে কাজে লাগাতে Apply advance balance-এ টিক দিন, বাকিটা নগদে পরিশোধ হবে। পদ্ধতি, Paid from account (পুরোটা অ্যাডভান্স থেকে গেলে লাগে না) এবং পেমেন্টের তারিখ বেছে নিন। Selected invoices, Advance applied ও Cash to pay মিলিয়ে দেখে Settle selected invoices চাপুন।",
      },
      image: {
        src: shot("settle.png"),
        alt: { en: "Invoice table and settle section", bn: "ইনভয়েস টেবিল ও Settle অংশ" },
      },
    },
    {
      key: "refund",
      title: {
        en: "Refund an unused advance",
        bn: "ব্যবহার না হওয়া অ্যাডভান্স ফেরত নিন",
      },
      text: {
        en: "In the right panel, under Advance payments, click Refund beside an advance that still has a balance. Enter the amount (up to the balance), the date, the account the money goes to, and the method. Reference and Remarks are optional. Click Confirm refund.",
        bn: "ডানদিকের প্যানেলে Advance payments-এর নিচে, যে অ্যাডভান্সে ব্যালেন্স আছে তার পাশে Refund চাপুন। পরিমাণ (ব্যালেন্সের বেশি নয়), তারিখ, যে অ্যাকাউন্টে টাকা আসবে সেটি এবং পদ্ধতি দিন। Reference ও Remarks ঐচ্ছিক। শেষে Confirm refund চাপুন।",
      },
      image: {
        src: shot("refund.png"),
        alt: { en: "Refund advance window", bn: "Refund advance উইন্ডো" },
      },
    },
    {
      key: "edit",
      title: { en: "Edit an advance", bn: "অ্যাডভান্স Edit করুন" },
      text: {
        en: "In Recent activity, click the pencil icon next to an advance entry. The form opens with the saved values and the message Editing advance. Change what you need and click Save changes, or click Cancel edit. The pencil appears only while the advance can still be changed, for example before it is applied to an invoice or refunded.",
        bn: "Recent activity-তে অ্যাডভান্স এন্ট্রির পাশের পেনসিল আইকনে ক্লিক করুন। সংরক্ষিত তথ্যসহ ফর্ম খুলবে এবং Editing advance লেখা দেখাবে। যা বদলানো দরকার বদলে Save changes চাপুন, অথবা Cancel edit করুন। পেনসিল শুধু তখনই দেখায় যখন অ্যাডভান্সটি এখনও বদলানো যায়, যেমন ইনভয়েসে প্রয়োগ বা রিফান্ড হওয়ার আগে।",
      },
      image: {
        src: shot("edit.png"),
        alt: { en: "Pencil icon in Recent activity", bn: "Recent activity-তে পেনসিল আইকন" },
      },
    },
    {
      key: "details",
      title: {
        en: "View details, print or export",
        bn: "বিস্তারিত দেখুন, প্রিন্ট বা এক্সপোর্ট করুন",
      },
      text: {
        en: "In Recent activity, click the eye icon to open the full details of an entry, including its journal entries and whether it is posted to the GL. Click Print to print it, or Excel to download it as a file. Press Esc or click Close to go back.",
        bn: "Recent activity-তে চোখ (eye) আইকনে ক্লিক করলে এন্ট্রির পূর্ণ বিস্তারিত খুলবে, সঙ্গে জার্নাল এন্ট্রি এবং GL-এ পোস্ট হয়েছে কি না দেখা যাবে। প্রিন্ট করতে Print, ফাইল হিসেবে নামাতে Excel চাপুন। ফিরে যেতে Esc চাপুন বা Close করুন।",
      },
      image: {
        src: shot("details.png"),
        alt: { en: "Transaction details window", bn: "লেনদেনের বিস্তারিত উইন্ডো" },
      },
    },
    {
      key: "cancel",
      title: { en: "Cancel a mistake", bn: "ভুল হলে Cancel করুন" },
      text: {
        en: "Use the Cancel link beside an invoice, a payment or a refund. An invoice can be cancelled only if nothing has been paid on it. Cancelling a payment or a refund reverses it in the accounts. Cancel works immediately, without a confirmation, so check the line before you click.",
        bn: "ইনভয়েস, পেমেন্ট বা রিফান্ডের পাশের Cancel লিংক ব্যবহার করুন। ইনভয়েসে কোনো পেমেন্ট না হয়ে থাকলেই শুধু Cancel করা যায়। পেমেন্ট বা রিফান্ড Cancel করলে হিসাবে তা রিভার্স হয়ে যায়। Cancel সঙ্গে সঙ্গে কাজ করে, কোনো নিশ্চিতকরণ চায় না, তাই ক্লিকের আগে লাইনটি দেখে নিন।",
      },
    },
  ],

  notes: [
    {
      en: "Always check the Journal entry preview before saving. It shows exactly what will be posted.",
      bn: "সেভ করার আগে Journal entry preview দেখে নিন। কী পোস্ট হবে তা সেখানে ঠিক সেভাবেই দেখায়।",
    },
    {
      en: "An advance stays as the vendor's balance until you apply it to an invoice or refund it.",
      bn: "অ্যাডভান্স ভেন্ডরের ব্যালেন্স হিসেবে জমা থাকে, যতক্ষণ না কোনো ইনভয়েসে প্রয়োগ করেন বা ফেরত নেন।",
    },
  ],

  // Colored Status labels in the invoice table
  badges: {
    label: "Status",
    items: [
      { label: "Open", className: "text-gray-700 bg-gray-100" },
      { label: "Partial", className: "text-amber-800 bg-amber-100" },
      { label: "Overdue", className: "text-red-800 bg-red-100" },
      { label: "Paid", className: "text-green-800 bg-green-100" },
    ],
  },

  // "term: meaning" lines
  columns: [
    {
      label: "Partial",
      text: {
        en: "Part of the invoice is already paid or covered by an advance.",
        bn: "ইনভয়েসের একটি অংশ পরিশোধ হয়েছে বা অ্যাডভান্স দিয়ে মেটানো হয়েছে।",
      },
    },
    {
      label: "Overdue",
      text: {
        en: "The due date has passed and a balance is still unpaid.",
        bn: "Due তারিখ পার হয়ে গেছে এবং ব্যালেন্স এখনও বাকি।",
      },
    },
    {
      label: "Balance",
      text: {
        en: "What is still unpaid on that invoice.",
        bn: "ওই ইনভয়েসের কত টাকা এখনও বাকি।",
      },
    },
    {
      label: "Pay now",
      text: {
        en: "The amount you pay on that invoice in this settlement. It becomes editable after you tick the invoice.",
        bn: "এই Settle-এ ওই ইনভয়েসে আপনি কত দিচ্ছেন। ইনভয়েসে টিক দিলে তবেই বদলানো যায়।",
      },
    },
    {
      label: "Outstanding",
      text: {
        en: "Total unpaid balance of all invoices of this vendor.",
        bn: "এই ভেন্ডরের সব ইনভয়েসের মোট বাকি টাকা।",
      },
    },
    {
      label: "Advance balance",
      text: {
        en: "Money paid in advance that has not been used against an invoice or refunded yet.",
        bn: "আগাম দেওয়া যে টাকা এখনও কোনো ইনভয়েসে ব্যবহার বা ফেরত হয়নি।",
      },
    },
  ],
};