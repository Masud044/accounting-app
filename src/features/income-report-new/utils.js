// // Code 4030020000-er DB-te kono naam nai, frontend-e ei naam dekhabe
// const HEAD_LABEL_OVERRIDES = {
//   "4030020000": "Egg Sales - Other",
// };

// export const headLabel = (h) => HEAD_LABEL_OVERRIDES[h.code] ?? h.head;

// const MONTHS = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ];

// const amountFmt = new Intl.NumberFormat("en-US", {
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });

// export const fmtAmount = (n) => amountFmt.format(Number(n) || 0);

// // "2026-05-11" -> "11-May-2026"
// export const fmtDate = (iso) => {
//   if (!iso) return "";
//   const [y, m, d] = iso.split("-");
//   return `${d}-${MONTHS[Number(m) - 1]}-${y}`;
// };

// // "2026-05" -> "May-26"
// export const fmtMonth = (ym) => {
//   const [y, m] = ym.split("-");
//   return `${MONTHS[Number(m) - 1]}-${y.slice(2)}`;
// };

// // Date -> "YYYY-MM-DD" (local time)
// export const toISODate = (d) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// Code 4030020000-er DB-te kono naam nai, frontend-e ei naam dekhabe
const HEAD_LABEL_OVERRIDES = {
  "4030020000": "Egg Sales - Other",
};

export const headLabel = (h) => HEAD_LABEL_OVERRIDES[h.code] ?? h.head;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const amountFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fmtAmount = (n) => amountFmt.format(Number(n) || 0);

// "2026-05-11" -> "11-May-2026"
export const fmtDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${MONTHS[Number(m) - 1]}-${y}`;
};

// "2026-05" -> "May-26"
export const fmtMonth = (ym) => {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]}-${y.slice(2)}`;
};

// Date -> "YYYY-MM-DD" (local time)
export const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export const exportCsv = (rows, from, to) => {
  const header = [
    "S.No", "GL date", "Voucher no", "Description",
    "Head", "Amount", "Cumulative",
  ];
  const lines = rows.map((d) =>
    [
      d.sNo, d.glDate, d.voucherNo, d.description,
      headLabel(d), d.amount, d.cumulative,
    ]
      .map(csvCell)
      .join(",")
  );
  // BOM thakle Excel-e Bangla description thik dekhay
  const blob = new Blob(
    ["\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\n")],
    { type: "text/csv;charset=utf-8;" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `income-report_${from}_to_${to}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};