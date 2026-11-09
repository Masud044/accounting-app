// // // Code 4030020000-er DB-te kono naam nai, frontend-e ei naam dekhabe
// // const HEAD_LABEL_OVERRIDES = {
// //   "4030020000": "Egg Sales - Other",
// // };

// // export const headLabel = (h) => HEAD_LABEL_OVERRIDES[h.code] ?? h.head;

// // const MONTHS = [
// //   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
// //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// // ];

// // const amountFmt = new Intl.NumberFormat("en-US", {
// //   minimumFractionDigits: 2,
// //   maximumFractionDigits: 2,
// // });

// // export const fmtAmount = (n) => amountFmt.format(Number(n) || 0);

// // // "2026-05-11" -> "11-May-2026"
// // export const fmtDate = (iso) => {
// //   if (!iso) return "";
// //   const [y, m, d] = iso.split("-");
// //   return `${d}-${MONTHS[Number(m) - 1]}-${y}`;
// // };

// // // "2026-05" -> "May-26"
// // export const fmtMonth = (ym) => {
// //   const [y, m] = ym.split("-");
// //   return `${MONTHS[Number(m) - 1]}-${y.slice(2)}`;
// // };

// // // Date -> "YYYY-MM-DD" (local time)
// // export const toISODate = (d) => {
// //   const y = d.getFullYear();
// //   const m = String(d.getMonth() + 1).padStart(2, "0");
// //   const day = String(d.getDate()).padStart(2, "0");
// //   return `${y}-${m}-${day}`;
// // };

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

// const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// export const exportCsv = (rows, from, to) => {
//   const header = [
//     "S.No", "GL date", "Voucher no", "Description",
//     "Head", "Amount", "Cumulative",
//   ];
//   const lines = rows.map((d) =>
//     [
//       d.sNo, d.glDate, d.voucherNo, d.description,
//       headLabel(d), d.amount, d.cumulative,
//     ]
//       .map(csvCell)
//       .join(",")
//   );
//   // BOM thakle Excel-e Bangla description thik dekhay
//   const blob = new Blob(
//     ["\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\n")],
//     { type: "text/csv;charset=utf-8;" }
//   );
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `income-report_${from}_to_${to}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
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

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// Excel-e jog/sort kora jay emon plain number (comma chhara, 2 decimal)
const num = (n) => (Number(n) || 0).toFixed(2);

const download = (rows, fileName) => {
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
  // BOM thakle Excel-e Bangla description thik dekhay
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a); // Firefox/Safari-te DOM-e na thakle click kaj kore na
  a.click();
  document.body.removeChild(a);
  // sange sange revoke korle kichu browser-e download cancel hoye jay
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Pura page (filter, summary, sob table) ekta CSV-te, section alada kore
export const buildIncomeCsv = (data) => {
  const { filters, kpis, byHead, monthly, details } = data;
  const rows = [];
  const add = (...cells) => rows.push(cells);
  const blank = () => rows.push([]);

  const selectedHead = byHead.rows.find((r) => r.code === filters.head);
  add("Income report");
  add("Period", `${fmtDate(filters.from)} to ${fmtDate(filters.to)}`);
  add("Date basis", "GL entry date");
  add("Income head", selectedHead ? headLabel(selectedHead) : "All");
  blank();

  add("Summary");
  add("Total income", num(kpis.totalIncome));
  add("Vouchers", kpis.voucherCount);
  add("Average per voucher", num(kpis.averagePerVoucher));
  add("Largest voucher", num(kpis.largestVoucher));
  blank();

  add("Income by head");
  add("Code", "Head", "Amount", "%");
  byHead.rows.forEach((r) =>
    add(r.code, headLabel(r), num(r.amount), num(r.percent))
  );
  add("Total", "", num(byHead.total), "100.00");
  blank();

  add("Monthly income by head");
  add("Head", ...monthly.months.map(fmtMonth), "Total");
  monthly.rows.forEach((r) =>
    add(headLabel(r), ...monthly.months.map((m) => num(r.months[m])), num(r.total))
  );
  add(
    "Total",
    ...monthly.months.map((m) => num(monthly.totals[m])),
    num(monthly.grandTotal)
  );
  blank();

  add("Voucher details");
  add("#", "GL date", "Voucher", "Description", "Head", "Amount", "Cumulative");
  details.forEach((d) =>
    add(
      d.sNo, fmtDate(d.glDate), d.voucherNo, d.description,
      headLabel(d), num(d.amount), num(d.cumulative)
    )
  );
  return rows;
};

export const exportCsv = (data) =>
  download(
    buildIncomeCsv(data),
    `income-report_${data.filters.from}_to_${data.filters.to}.csv`
  );