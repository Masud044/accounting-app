// Egg Production guide texts (English + Bangla): list, add, update.
// Used with <EggGuideSheet /> (see EggGuideSheet.jsx and EGG-INTEGRATION.md).
//
// Usage:
//   import { EggGuideSheet } from "@/components/egg-guide/EggGuideSheet";
//   import { eggListGuide } from "@/components/egg-guide/egg-guide";
//   <EggGuideSheet guide={eggListGuide} can={guidePermissions} />
//
// Permission keys (pass them in the `can` prop, list page only):
//   EGG_PRODUCTION_CREATE, EGG_PRODUCTION_EDIT, EGG_PRODUCTION_DELETE
//
// Screenshots go in public/guide/egg-production/ (missing files are simply hidden).

const shot = (name) =>
  `${import.meta.env.BASE_URL}guide/egg-production/${name}`;

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

// Shared (Add + Update)
const requiredNote = {
  en: "Required: Production Date, Shade and Quantity. Reject Quantity is optional (left empty it is saved as 0). Remarks can be up to 50 characters.",
  bn: "আবশ্যক: Production Date, Shade ও Quantity। Reject Quantity ঐচ্ছিক (ফাঁকা রাখলে ০ হিসেবে সেভ হয়)। Remarks সর্বোচ্চ ৫০ অক্ষর।",
};

const discardNote = {
  en: "If you close the window or press Cancel after typing something, you are asked whether to discard your changes.",
  bn: "কিছু লেখার পর উইন্ডো বন্ধ করলে বা Cancel চাপলে পরিবর্তন বাতিল করবেন কিনা জিজ্ঞেস করা হয়।",
};

/* ════════════════════════════════════════════════════════════════════════
   1. EGG PRODUCTION LIST (EggProductionList)
   ════════════════════════════════════════════════════════════════════════ */
export const eggListGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How the Egg Production page works",
    bn: "Egg Production পেজ কীভাবে কাজ করে",
  },
  purpose: {
    en: "This page lists the daily egg production records of each shade. Use it to find a record, add a new one, edit it, or delete it, and to see the totals for what you are looking at.",
    bn: "এই পেজে প্রতিটি Shade-এর দৈনিক ডিম উৎপাদনের রেকর্ড দেখা যায়। এখান থেকে রেকর্ড খুঁজুন, নতুন যোগ করুন, Edit বা Delete করুন, এবং যা দেখছেন তার মোট হিসাব দেখুন।",
  },
  overview: {
    image: {
      src: shot("list-overview.png"),
      alt: { en: "Egg Production page overview", bn: "Egg Production পেজের সামগ্রিক চিত্র" },
      caption: {
        en: "The Egg Production page. Click an image to open it full size.",
        bn: "Egg Production পেজ। বড় করে দেখতে ছবিতে ক্লিক করুন।",
      },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "shade",
      title: { en: "Choose a shade", bn: "Shade বেছে নিন" },
      text: {
        en: "The tabs at the top are your shades. Click a tab to see only that shade's records. The small number on each tab is how many records that shade has. The first shade is selected when the page opens.",
        bn: "ওপরের ট্যাবগুলো আপনার Shade। কোনো ট্যাবে ক্লিক করলে শুধু সেই Shade-এর রেকর্ড দেখায়। প্রতিটি ট্যাবের ছোট সংখ্যাটি সেই Shade-এর রেকর্ড সংখ্যা। পেজ খুললে প্রথম Shade বাছাই থাকে।",
      },
      image: { src: shot("list-shade.png"), alt: { en: "Shade tabs", bn: "Shade ট্যাব" } },
    },
    {
      key: "find",
      title: { en: "Find your records", bn: "আপনার রেকর্ড খুঁজুন" },
      text: {
        en: "Type in the Search box, or set Production From Date and To Date to narrow the list. The dates apply instantly; use the ✕ inside a date box to clear it. Click a column title to sort (an arrow shows on the sorted column). Use the Columns button to hide or show columns. The refresh button reloads the records.",
        bn: "Search বক্সে লিখুন, অথবা Production From Date ও To Date দিয়ে তালিকা ছোট করুন। তারিখ দেওয়ামাত্র ফিল্টার হয়; তারিখ মুছতে বক্সের ভেতরের ✕ চাপুন। কলামের নামে ক্লিক করলে সর্ট হয় (সর্ট করা কলামে তীর দেখায়)। Columns বাটন দিয়ে কলাম দেখানো বা লুকানো যায়। রিফ্রেশ বাটনে রেকর্ড আবার লোড হয়।",
      },
      image: { src: shot("list-filters.png"), alt: { en: "Search and date filters", bn: "সার্চ ও তারিখ ফিল্টার" } },
    },
    {
      key: "totals",
      title: { en: "Read the totals", bn: "মোট হিসাব দেখুন" },
      text: {
        en: "The three cards show Total Entries, Total Quantity and Total Reject Qty. They follow the selected shade, dates and search, and count all pages, not just the page you are on.",
        bn: "তিনটি কার্ডে Total Entries, Total Quantity ও Total Reject Qty দেখায়। এগুলো বাছাই করা Shade, তারিখ ও সার্চ অনুযায়ী হয়, এবং শুধু বর্তমান পেজ নয়, সব পেজ ধরে হিসাব করে।",
      },
      image: { src: shot("list-totals.png"), alt: { en: "Summary cards", bn: "সামারি কার্ড" } },
    },
    {
      key: "create",
      title: { en: "Add a new record", bn: "নতুন রেকর্ড যোগ করুন" },
      text: {
        en: "Click \"Add Record\" at the top right. A side window opens with the current shade already selected. See the Add guide for the fields.",
        bn: "ওপরে ডানদিকের \"Add Record\" বাটনে ক্লিক করুন। পাশে একটি উইন্ডো খুলবে, যেখানে বর্তমান Shade আগে থেকেই বাছাই থাকে। ফিল্ডগুলোর জন্য Add গাইড দেখুন।",
      },
      image: { src: shot("list-create.png"), alt: { en: "Add Record button", bn: "Add Record বাটন" } },
      permission: "EGG_PRODUCTION_CREATE",
    },
    {
      key: "edit",
      title: { en: "Edit a record", bn: "রেকর্ড Edit করুন" },
      text: {
        en: "Click the pencil icon in the Actions column to open the Edit window with the saved values filled in. On a small screen, tap the row first, then press Edit.",
        bn: "Actions কলামের পেনসিল আইকনে ক্লিক করলে সেভ করা তথ্যসহ Edit উইন্ডো খুলবে। ছোট স্ক্রিনে আগে সারিতে ট্যাপ করুন, তারপর Edit চাপুন।",
      },
      image: { src: shot("list-edit.png"), alt: { en: "Edit icon in the row", bn: "সারিতে Edit আইকন" } },
      permission: "EGG_PRODUCTION_EDIT",
    },
    {
      key: "delete",
      title: { en: "Delete a record", bn: "রেকর্ড Delete করুন" },
      text: {
        en: "Click the red trash icon in the Actions column. A confirmation window shows the record number; press Delete to confirm. The record is removed permanently and this cannot be undone. On a small screen, tap the row first, then press Delete.",
        bn: "Actions কলামের লাল ট্র্যাশ আইকনে ক্লিক করুন। নিশ্চিতকরণ উইন্ডোতে রেকর্ড নম্বর দেখায়; নিশ্চিত করতে Delete চাপুন। রেকর্ডটি স্থায়ীভাবে মুছে যায়, ফিরিয়ে আনা যায় না। ছোট স্ক্রিনে আগে সারিতে ট্যাপ করুন, তারপর Delete চাপুন।",
      },
      image: { src: shot("list-delete.png"), alt: { en: "Delete confirmation", bn: "Delete নিশ্চিতকরণ" } },
      permission: "EGG_PRODUCTION_DELETE",
    },
    // {
    //   key: "mobile",
    //   title: { en: "Using a small screen", bn: "ছোট স্ক্রিনে ব্যবহার" },
    //   text: {
    //     en: "On a phone the table becomes rows showing the date, quantity, shade and reject. Tap a row to open Remarks, Created date and the Edit / Delete buttons. Sorting moves to the Sort box above the list, with a button to flip the direction.",
    //     bn: "ফোনে টেবিল সারি আকারে দেখায়, যেখানে তারিখ, Quantity, Shade ও Reject থাকে। সারিতে ট্যাপ করলে Remarks, তৈরির তারিখ এবং Edit / Delete বাটন খোলে। সর্টিং তালিকার ওপরের Sort বক্সে চলে যায়, পাশে দিক উল্টানোর বাটন থাকে।",
    //   },
    //   image: { src: shot("list-mobile.png"), alt: { en: "Small screen view", bn: "ছোট স্ক্রিনের চিত্র" } },
    // },
  ],
  notes: [
    {
      en: "Delete cannot be undone, so check the record number before confirming. If you only entered a wrong value, use Edit instead.",
      bn: "Delete ফিরিয়ে নেওয়া যায় না, তাই নিশ্চিত করার আগে রেকর্ড নম্বর দেখে নিন। শুধু ভুল মান দিলে Delete না করে Edit ব্যবহার করুন।",
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
      en: "If nothing matches your search or dates, press \"Clear filters\" to reset them. The selected shade stays as it is.",
      bn: "সার্চ বা তারিখে কিছু না মিললে \"Clear filters\" চাপলে সেগুলো রিসেট হয়। বাছাই করা Shade যেমন আছে তেমনই থাকে।",
    },
    {
      en: "If you can't see the Add, Edit or Delete buttons, your account doesn't have that permission. Contact your administrator.",
      bn: "Add, Edit বা Delete বাটন না দেখালে বুঝবেন আপনার অ্যাকাউন্টে সেই অনুমতি নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।",
    },
  ],
  columns: [
    {
      label: "Production Date",
      text: {
        en: "The day the eggs were produced.",
        bn: "যে দিন ডিম উৎপাদন হয়েছে।",
      },
    },
    {
      label: "Shade",
      text: {
        en: "The shade (shed) the eggs came from.",
        bn: "যে Shade (শেড) থেকে ডিম এসেছে।",
      },
    },
    {
      label: "Quantity",
      text: {
        en: "Number of eggs produced that day in that shade.",
        bn: "সেই দিন সেই Shade-এ উৎপাদিত ডিমের সংখ্যা।",
      },
    },
    {
      label: "Reject Qty",
      text: {
        en: "Number of eggs rejected (for example broken or unfit).",
        bn: "বাতিল হওয়া ডিমের সংখ্যা (যেমন ভাঙা বা অনুপযুক্ত)।",
      },
    },
    {
      label: "Remarks",
      text: {
        en: "An optional note about the record. A dash means no note.",
        bn: "রেকর্ড সম্পর্কে ঐচ্ছিক নোট। ড্যাশ (—) মানে কোনো নোট নেই।",
      },
    },
    {
      label: "Created At",
      text: {
        en: "The date the record was entered into the system.",
        bn: "যে তারিখে রেকর্ডটি সিস্টেমে এন্ট্রি হয়েছে।",
      },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   2. ADD EGG PRODUCTION (AddEggProductionSheet)
   ════════════════════════════════════════════════════════════════════════ */
export const eggAddGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to add an Egg Production record",
    bn: "Egg Production রেকর্ড কীভাবে যোগ করবেন",
  },
  purpose: {
    en: "Use this window to record one day's egg production for one shade: pick the date and shade, enter the quantity, and create the record.",
    bn: "এক Shade-এর একদিনের ডিম উৎপাদন রেকর্ড করতে এই উইন্ডো ব্যবহার করুন: তারিখ ও Shade বেছে Quantity লিখুন এবং রেকর্ড তৈরি করুন।",
  },
  overview: {
    image: {
      src: shot("add-overview.png"),
      alt: { en: "Add Egg Production window", bn: "Add Egg Production উইন্ডো" },
      caption: { en: "Click an image to open it full size.", bn: "বড় করে দেখতে ছবিতে ক্লিক করুন।" },
    },
  },
  lockedText,
  ui,
  steps: [
    {
      key: "date",
      title: { en: "Pick the Production Date", bn: "Production Date বেছে নিন" },
      text: {
        en: "Choose the day the eggs were produced. This field is required.",
        bn: "যে দিন ডিম উৎপাদন হয়েছে সেই তারিখ বেছে নিন। এই ফিল্ড আবশ্যক।",
      },
      image: { src: shot("add-date.png"), alt: { en: "Production date", bn: "Production date" } },
    },
    {
      key: "shade",
      title: { en: "Check the Shade", bn: "Shade দেখুন" },
      text: {
        en: "The shade of the tab you were on is already selected. Change it if you are entering for another shade. This field is required.",
        bn: "যে ট্যাবে ছিলেন তার Shade আগে থেকেই বাছাই থাকে। অন্য Shade-এর জন্য লিখলে বদলে নিন। এই ফিল্ড আবশ্যক।",
      },
      image: { src: shot("add-shade.png"), alt: { en: "Shade selection", bn: "Shade সিলেকশন" } },
    },
    {
      key: "qty",
      title: { en: "Enter the Quantity", bn: "Quantity লিখুন" },
      text: {
        en: "Type the number of eggs produced. It cannot be negative. This field is required.",
        bn: "উৎপাদিত ডিমের সংখ্যা লিখুন। ঋণাত্মক হতে পারে না। এই ফিল্ড আবশ্যক।",
      },
    },
    {
      key: "reject",
      title: { en: "Enter the Reject Quantity", bn: "Reject Quantity লিখুন" },
      text: {
        en: "Type the number of rejected eggs, if any. If you leave it empty, it is saved as 0.",
        bn: "বাতিল ডিম থাকলে তার সংখ্যা লিখুন। ফাঁকা রাখলে ০ হিসেবে সেভ হবে।",
      },
    },
    {
      key: "remarks",
      title: { en: "Add Remarks (optional)", bn: "Remarks দিন (ঐচ্ছিক)" },
      text: {
        en: "Write a short note if needed, up to 50 characters.",
        bn: "দরকার হলে ছোট নোট লিখুন, সর্বোচ্চ ৫০ অক্ষর।",
      },
    },
    {
      key: "submit",
      title: { en: "Create the record", bn: "রেকর্ড তৈরি করুন" },
      text: {
        en: "Press \"Create Record\". On success the window closes and the record appears in the list.",
        bn: "\"Create Record\" চাপুন। সফল হলে উইন্ডো বন্ধ হয়ে যায় এবং রেকর্ডটি তালিকায় দেখা যায়।",
      },
      image: { src: shot("add-submit.png"), alt: { en: "Create Record button", bn: "Create Record বাটন" } },
    },
  ],
  notes: [requiredNote, discardNote],
  columns: [
    {
      label: "Shade",
      text: {
        en: "The shed the eggs came from. Pick it from the list.",
        bn: "যে শেড থেকে ডিম এসেছে। তালিকা থেকে বেছে নিন।",
      },
    },
    {
      label: "Quantity (Eggs)",
      text: {
        en: "Total eggs produced that day, including any that are later rejected.",
        bn: "সেই দিনের মোট উৎপাদিত ডিম, পরে বাতিল হওয়াগুলো সহ।",
      },
    },
    {
      label: "Reject Quantity",
      text: {
        en: "How many of those eggs were rejected.",
        bn: "ওই ডিমগুলোর মধ্যে কয়টি বাতিল হয়েছে।",
      },
    },
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   3. UPDATE EGG PRODUCTION (UpdateEggProductionSheet)
   ════════════════════════════════════════════════════════════════════════ */
export const eggUpdateGuide = {
  defaultLanguage: "en",
  languages,
  title: {
    en: "How to edit an Egg Production record",
    bn: "Egg Production রেকর্ড কীভাবে Edit করবেন",
  },
  purpose: {
    en: "Use this window to correct a saved record: change the date, shade, quantity, reject quantity or remarks, then update it.",
    bn: "সেভ করা রেকর্ড ঠিক করতে এই উইন্ডো ব্যবহার করুন: তারিখ, Shade, Quantity, Reject Quantity বা Remarks বদলে Update করুন।",
  },
  overview: {
    image: {
      src: shot("update-overview.png"),
      alt: { en: "Update Egg Production window", bn: "Update Egg Production উইন্ডো" },
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
        en: "The window opens with the saved values already filled in. The title shows which record you are editing (\"Editing record #...\").",
        bn: "উইন্ডো খুললে সেভ করা তথ্য আগে থেকেই পূরণ থাকে। শিরোনামে কোন রেকর্ড Edit করছেন তা দেখায় (\"Editing record #...\")।",
      },
      image: { src: shot("update-load.png"), alt: { en: "Loaded record", bn: "লোড হওয়া রেকর্ড" } },
    },
    {
      key: "change",
      title: { en: "Change what is wrong", bn: "যা ভুল তা বদলান" },
      text: {
        en: "Change the Production Date, Shade, Quantity, Reject Quantity or Remarks. Production Date, Shade and Quantity cannot be left empty, and Quantity and Reject Quantity cannot be negative.",
        bn: "Production Date, Shade, Quantity, Reject Quantity বা Remarks বদলান। Production Date, Shade ও Quantity ফাঁকা রাখা যায় না, আর Quantity ও Reject Quantity ঋণাত্মক হতে পারে না।",
      },
      image: { src: shot("update-change.png"), alt: { en: "Editing fields", bn: "ফিল্ড Edit" } },
    },
    {
      key: "submit",
      title: { en: "Update the record", bn: "রেকর্ড Update করুন" },
      text: {
        en: "Press \"Update Record\". On success the window closes and the list shows the new values.",
        bn: "\"Update Record\" চাপুন। সফল হলে উইন্ডো বন্ধ হয়ে যায় এবং তালিকায় নতুন মান দেখায়।",
      },
      image: { src: shot("update-submit.png"), alt: { en: "Update Record button", bn: "Update Record বাটন" } },
    },
  ],
  notes: [
    requiredNote,
    discardNote,
    {
      en: "If you moved the record to a different shade, it will move to that shade's tab in the list.",
      bn: "রেকর্ড অন্য Shade-এ সরালে তালিকায় সেটি ওই Shade-এর ট্যাবে চলে যাবে।",
    },
    {
      en: "If the record was entered by mistake and should not exist at all, delete it from the list instead of editing it.",
      bn: "রেকর্ডটি ভুল করে এন্ট্রি হয়ে থাকলে এবং একেবারেই দরকার না থাকলে Edit না করে তালিকা থেকে Delete করুন।",
    },
  ],
  columns: [
    {
      label: "Shade",
      text: {
        en: "The shed the eggs came from. The saved shade is selected for you.",
        bn: "যে শেড থেকে ডিম এসেছে। সেভ করা Shade আগে থেকেই বাছাই থাকে।",
      },
    },
    {
      label: "Quantity (Eggs)",
      text: {
        en: "Total eggs produced that day, including any that are later rejected.",
        bn: "সেই দিনের মোট উৎপাদিত ডিম, পরে বাতিল হওয়াগুলো সহ।",
      },
    },
    {
      label: "Reject Quantity",
      text: {
        en: "How many of those eggs were rejected.",
        bn: "ওই ডিমগুলোর মধ্যে কয়টি বাতিল হয়েছে।",
      },
    },
  ],
};