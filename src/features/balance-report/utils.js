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

// // Date -> "YYYY-MM-DD" (local time)
// export const toISODate = (d) => {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// };

// /* ---------------- Excel export (pura page, colored header) ---------------- */
// export const buildBalanceSheetRows = (data) => {
//   const { kpis, assets, liabilities, equity } = data;
//   const rows = [];
//   const add = (kind, ...cells) => rows.push({ kind, cells });
//   const blank = () => rows.push({ kind: "blank", cells: [] });
//   const label = (t) => ({ v: t, bold: true, span: 2 });
//   const hr = (t) => ({ v: t, right: true });
//   const head = () =>
//     add("header", "Code", { v: "Account", span: 2 }, hr("Opening"), hr("Period"), hr("Closing"));
//   const amts = (v, neg = false) => {
//     const f = neg ? -1 : 1;
//     return [f * v.opening, f * v.movement, f * v.closing];
//   };
//   const bold = (v) => ({ v, bold: true });

//   const addGroups = (section, emptyText) => {
//     if (!section.groups.length) {
//       add("data", { v: emptyText, span: 6 });
//       return;
//     }
//     section.groups.forEach((g) => {
//       add("data", { v: g.name, span: 3, bold: true }, ...amts(g.total).map(bold));
//       g.accounts.forEach((a) =>
//         add("data", a.code, { v: a.name, span: 2 }, ...amts(a))
//       );
//     });
//   };

//   add("title", "Balance sheet");
//   add("data", label("Period"), {
//     v: `${fmtDate(data.from)} to ${fmtDate(data.to)}`,
//     span: 2,
//   });
//   add("data", label("Date basis"), { v: "GL entry date", span: 2 });
//   blank();

//   add("section", "Summary (closing)");
//   add("data", label("Total assets"), kpis.totalAssets);
//   add("data", label("Total liabilities"), kpis.totalLiabilities);
//   add("data", label("Total owner's equity"), kpis.totalEquity);
//   add("data", label("Net profit / (loss) for the period"), kpis.netProfit);
//   blank();

//   add("section", "Assets");
//   head();
//   addGroups(assets, "No asset accounts");
//   add("total", { v: "Total assets", span: 3 }, ...amts(assets.total));
//   blank();

//   add("section", "Liabilities");
//   head();
//   addGroups(liabilities, "No liability accounts in the data");
//   add("total", { v: "Total liabilities", span: 3 }, ...amts(liabilities.total));
//   blank();

//   add("section", "Owner's equity");
//   head();
//   equity.groups.forEach((g) =>
//     g.accounts.forEach((a) =>
//       add("data", a.code, { v: a.name, span: 2 }, ...amts(a))
//     )
//   );
//   add("data", { v: "Total income (sales)", span: 3 }, ...amts(equity.income));
//   add("data", { v: "Less: total expenses", span: 3 }, ...amts(equity.expense, true));
//   add("data", { v: "Net profit / (loss)", span: 3, bold: true }, ...amts(equity.profit).map(bold));
//   add("total", { v: "Total owner's equity", span: 3 }, ...amts(equity.total));
//   blank();

//   add("section", "Total");
//   add(
//     "total",
//     { v: "Total liabilities + owner's equity", span: 3 },
//     ...amts(data.totalLiabilitiesEquity)
//   );
//   add(
//     "data",
//     { v: "Check: assets - (liabilities + equity), closing", span: 3, bold: true },
//     { v: data.check.difference, span: 3 }
//   );

//   if (data.unclassified.length) {
//     blank();
//     add("section", "Accounts without a root (not in assets / liabilities / equity / income / expense)");
//     add("header", "Code", { v: "Account", span: 2 }, hr("Amount"));
//     data.unclassified.forEach((a) =>
//       add("data", a.code, { v: a.name, span: 2 }, a.amount)
//     );
//   }
//   return rows;
// };

// export const exportExcel = (data) =>
//   downloadReportWorkbook({
//     rows: buildBalanceSheetRows(data),
//     sheetName: "Balance sheet",
//     fileName: `balance-sheet_${data.from}_to_${data.to}.xlsx`,
//   });

// /* ---------------- Excel writer (exceljs, colored .xlsx) ---------------- */
// // Report row-gulo ke colored .xlsx file-e convert kore download kore (exceljs)
// //
// // Row   : { kind: "title" | "section" | "header" | "data" | "total" | "blank", cells: [...] }
// // Cell  : plain value ya { v, span, bold, right, wrap, int }

// const FIRST_COL_WIDTH = 12;
// const COL_WIDTH = 18;

// const COLORS = {
//   sectionBg: "FF1F4E78",
//   sectionText: "FFFFFFFF",
//   headerBg: "FFD9E1F2",
//   headerText: "FF1F2937",
//   totalBg: "FFF2F2F2",
//   border: "FFBFC7D5",
// };

// const THIN = (argb) => ({ style: "thin", color: { argb } });
// const BORDER = {
//   top: THIN(COLORS.border),
//   left: THIN(COLORS.border),
//   bottom: THIN(COLORS.border),
//   right: THIN(COLORS.border),
// };

// const toCell = (c) =>
//   c !== null && typeof c === "object" ? c : { v: c };

// const rowWidth = (row) =>
//   row.cells.reduce((s, c) => s + (toCell(c).span || 1), 0);

// const colWidth = (col) => (col === 1 ? FIRST_COL_WIDTH : COL_WIDTH);

// export const buildReportWorkbook = async (rows, sheetName) => {
//   const { default: ExcelJS } = await import("exceljs");
//   const wb = new ExcelJS.Workbook();
//   const ws = wb.addWorksheet(sheetName, {
//     views: [{ showGridLines: false }],
//     pageSetup: {
//       orientation: "landscape",
//       fitToPage: true,
//       fitToWidth: 1,
//       fitToHeight: 0,
//     },
//   });

//   // Section bar-er width = tar niche-r table-er sobcheye choto-bor row-er width
//   const sectionWidth = (idx) => {
//     let w = 1;
//     for (let i = idx + 1; i < rows.length && rows[i].kind !== "blank"; i++) {
//       w = Math.max(w, rowWidth(rows[i]));
//     }
//     return w;
//   };

//   const maxCols = Math.max(
//     1,
//     ...rows.filter((r) => r.kind !== "section").map(rowWidth)
//   );
//   for (let c = 1; c <= maxCols; c++) ws.getColumn(c).width = colWidth(c);

//   let r = 1;
//   rows.forEach((row, idx) => {
//     if (row.kind === "blank") {
//       r += 1;
//       return;
//     }
//     const excelRow = ws.getRow(r);

//     /* ---- title ---- */
//     if (row.kind === "title") {
//       const cell = excelRow.getCell(1);
//       cell.value = toCell(row.cells[0]).v;
//       cell.font = { bold: true, size: 15 };
//       excelRow.height = 24;
//       r += 1;
//       return;
//     }

//     /* ---- section bar ---- */
//     if (row.kind === "section") {
//       const width = Math.max(sectionWidth(idx), 2);
//       ws.mergeCells(r, 1, r, width);
//       const cell = excelRow.getCell(1);
//       cell.value = toCell(row.cells[0]).v;
//       for (let c = 1; c <= width; c++) {
//         const x = excelRow.getCell(c);
//         x.fill = {
//           type: "pattern",
//           pattern: "solid",
//           fgColor: { argb: COLORS.sectionBg },
//         };
//         x.font = { bold: true, size: 11, color: { argb: COLORS.sectionText } };
//         x.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
//       }
//       excelRow.height = 22;
//       r += 1;
//       return;
//     }

//     /* ---- header / data / total ---- */
//     let col = 1;
//     let lines = 1;
//     for (const raw of row.cells) {
//       const cell = toCell(raw);
//       const span = cell.span || 1;
//       if (span > 1) ws.mergeCells(r, col, r, col + span - 1);

//       const isNumber = typeof cell.v === "number";
//       const rightAlign = cell.right ?? isNumber;

//       for (let c = col; c < col + span; c++) {
//         const x = excelRow.getCell(c);
//         if (c === col) {
//           x.value = cell.v ?? null;
//           if (isNumber) x.numFmt = cell.int ? "0" : "#,##0.00";
//         }
//         x.border = BORDER;
//         x.alignment = {
//           vertical: row.kind === "data" ? "top" : "middle",
//           horizontal: rightAlign ? "right" : "left",
//           wrapText: Boolean(cell.wrap) || row.kind === "header",
//         };
//         if (row.kind === "header") {
//           x.font = { bold: true, color: { argb: COLORS.headerText } };
//           x.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: COLORS.headerBg },
//           };
//         } else if (row.kind === "total") {
//           x.font = { bold: true };
//           x.fill = {
//             type: "pattern",
//             pattern: "solid",
//             fgColor: { argb: COLORS.totalBg },
//           };
//         } else if (cell.bold) {
//           x.font = { bold: true };
//         }
//       }

//       if (cell.wrap && cell.v) {
//         let width = 0;
//         for (let c = col; c < col + span; c++) width += colWidth(c);
//         lines = Math.max(
//           lines,
//           Math.ceil(String(cell.v).length / (width * 0.8))
//         );
//       }
//       col += span;
//     }
//     if (lines > 1) excelRow.height = 15 * lines;
//     r += 1;
//   });

//   return wb;
// };

// export const downloadReportWorkbook = async ({ rows, sheetName, fileName }) => {
//   const wb = await buildReportWorkbook(rows, sheetName);
//   const buffer = await wb.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = fileName;
//   document.body.appendChild(a); // Firefox/Safari-te DOM-e na thakle click kaj kore na
//   a.click();
//   document.body.removeChild(a);
//   // sange sange revoke korle kichu browser-e download cancel hoye jay
//   setTimeout(() => URL.revokeObjectURL(url), 1000);
// };

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

// Date -> "YYYY-MM-DD" (local time)
export const toISODate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/* ---------------- Excel export (pura page, colored header) ---------------- */
export const buildBalanceSheetRows = (data) => {
  const { kpis, assets, liabilities, equity } = data;
  const rows = [];
  const add = (kind, ...cells) => rows.push({ kind, cells });
  const blank = () => rows.push({ kind: "blank", cells: [] });
  const label = (t) => ({ v: t, bold: true, span: 2 });
  const hr = (t) => ({ v: t, right: true });
  const head = () =>
    add("header", "Code", { v: "Account", span: 2 }, hr("Opening"), hr("Period"), hr("Closing"));
  const amts = (v, neg = false) => {
    const f = neg ? -1 : 1;
    return [f * v.opening, f * v.movement, f * v.closing];
  };
  const bold = (v) => ({ v, bold: true });

  const addGroups = (section, emptyText) => {
    if (!section.groups.length) {
      add("data", { v: emptyText, span: 6 });
      return;
    }
    section.groups.forEach((g) => {
      add("data", { v: g.name, span: 3, bold: true }, ...amts(g.total).map(bold));
      g.accounts.forEach((a) =>
        add("data", a.code, { v: a.name, span: 2 }, ...amts(a))
      );
    });
  };

  add("title", "Balance sheet");
  add("data", label("Period"), {
    v: `${fmtDate(data.from)} to ${fmtDate(data.to)}`,
    span: 2,
  });
  add("data", label("Date basis"), { v: "GL entry date", span: 2 });
  blank();

  add("section", "Summary (closing)");
  add("data", label("Total assets"), kpis.totalAssets);
  add("data", label("Total liabilities"), kpis.totalLiabilities);
  add("data", label("Total owner's equity"), kpis.totalEquity);
  add("data", label("Net profit / (loss) for the period"), kpis.netProfit);
  blank();

  add("section", "Assets");
  head();
  addGroups(assets, "No asset accounts");
  add("total", { v: "Total assets", span: 3 }, ...amts(assets.total));
  blank();

  add("section", "Liabilities");
  head();
  addGroups(liabilities, "No liability accounts in the data");
  add("total", { v: "Total liabilities", span: 3 }, ...amts(liabilities.total));
  blank();

  add("section", "Owner's equity");
  head();
  equity.groups.forEach((g) =>
    g.accounts.forEach((a) =>
      add("data", a.code, { v: a.name, span: 2 }, ...amts(a))
    )
  );
  add("data", { v: "Total income (sales)", span: 3 }, ...amts(equity.income));
  add("data", { v: "Less: total expenses", span: 3 }, ...amts(equity.expense, true));
  add("data", { v: "Net profit / (loss)", span: 3, bold: true }, ...amts(equity.profit).map(bold));
  add("total", { v: "Total owner's equity", span: 3 }, ...amts(equity.total));
  blank();

  add("section", "Total");
  add(
    "total",
    { v: "Total liabilities + owner's equity", span: 3 },
    ...amts(data.totalLiabilitiesEquity)
  );
  add(
    "data",
    { v: "Check: assets - (liabilities + equity), closing", span: 3, bold: true },
    { v: data.check.difference, span: 3 }
  );

  if (data.unclassified.length) {
    blank();
    add("section", "Accounts without a root (not in assets / liabilities / equity / income / expense)");
    add("header", "Code", { v: "Account", span: 2 }, hr("Amount"));
    data.unclassified.forEach((a) =>
      add("data", a.code, { v: a.name, span: 2 }, a.amount)
    );
  }
  return rows;
};

export const exportExcel = (data) =>
  downloadReportWorkbook({
    rows: buildBalanceSheetRows(data),
    sheetName: "Balance sheet",
    fileName: `balance-sheet_${data.from}_to_${data.to}.xls`,
  });

/* ---------------- Excel writer (no library, HTML-based .xls) ---------------- */
// Report row-gulo ke colored .xls file-e convert kore download kore.
// Kono package install lage na; Excel/LibreOffice duitei open hoy.
//
// Row   : { kind: "title" | "section" | "header" | "data" | "total" | "blank", cells: [...] }
// Cell  : plain value ya { v, span, bold, right, wrap, int }

const FIRST_COL_PX = 90;
const COL_PX = 130;

const COLORS = {
  sectionBg: "#1F4E78",
  sectionText: "#FFFFFF",
  headerBg: "#D9E1F2",
  headerText: "#1F2937",
  totalBg: "#F2F2F2",
  border: "#BFC7D5",
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const toCell = (c) => (c !== null && typeof c === "object" ? c : { v: c });

const rowWidth = (row) =>
  row.cells.reduce((s, c) => s + (toCell(c).span || 1), 0);

export const buildReportHtml = (rows, sheetName) => {
  // Section bar-er width = tar niche-r table-er sobcheye boro row-er width
  const sectionWidth = (idx) => {
    let w = 1;
    for (let i = idx + 1; i < rows.length && rows[i].kind !== "blank"; i++) {
      w = Math.max(w, rowWidth(rows[i]));
    }
    return w;
  };

  const maxCols = Math.max(
    1,
    ...rows.filter((r) => r.kind !== "section").map(rowWidth)
  );

  const border = `border:1px solid ${COLORS.border};`;
  let body = "";

  rows.forEach((row, idx) => {
    if (row.kind === "blank") {
      body += "<tr><td></td></tr>";
      return;
    }

    if (row.kind === "title") {
      body += `<tr><td colspan="${maxCols}" style="font-size:15pt;font-weight:bold;height:24px">${esc(
        toCell(row.cells[0]).v
      )}</td></tr>`;
      return;
    }

    if (row.kind === "section") {
      const width = Math.max(sectionWidth(idx), 2);
      body += `<tr><td colspan="${width}" style="background:${COLORS.sectionBg};color:${COLORS.sectionText};font-weight:bold;font-size:11pt;height:22px;padding-left:6px">${esc(
        toCell(row.cells[0]).v
      )}</td></tr>`;
      return;
    }

    // header / data / total
    let tr = "<tr>";
    for (const raw of row.cells) {
      const cell = toCell(raw);
      const span = cell.span || 1;
      const isNumber = typeof cell.v === "number";
      const right = cell.right ?? isNumber;

      let style = border + `text-align:${right ? "right" : "left"};`;
      style += row.kind === "data" ? "vertical-align:top;" : "vertical-align:middle;";
      if (row.kind === "header") {
        style += `font-weight:bold;color:${COLORS.headerText};background:${COLORS.headerBg};`;
      } else if (row.kind === "total") {
        style += `font-weight:bold;background:${COLORS.totalBg};`;
      } else if (cell.bold) {
        style += "font-weight:bold;";
      }
      if (cell.wrap || row.kind === "header") style += "white-space:normal;";
      if (isNumber) {
        style += cell.int
          ? "mso-number-format:'0';"
          : "mso-number-format:'#,##0.00';";
      }

      const value =
        cell.v === null || cell.v === undefined ? "" : isNumber ? cell.v : esc(cell.v);
      tr += `<td${span > 1 ? ` colspan="${span}"` : ""} style="${style}">${value}</td>`;
    }
    tr += "</tr>";
    body += tr;
  });

  const cols = Array.from(
    { length: maxCols },
    (_, i) => `<col width="${i === 0 ? FIRST_COL_PX : COL_PX}">`
  ).join("");

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
<x:Name>${esc(sheetName)}</x:Name>
<x:WorksheetOptions><x:Print><x:FitWidth>1</x:FitWidth></x:Print></x:WorksheetOptions>
</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head>
<body><table style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;font-size:11pt">${cols}${body}</table></body>
</html>`;
};

export const downloadReportWorkbook = ({ rows, sheetName, fileName }) => {
  const html = buildReportHtml(rows, sheetName);
  const blob = new Blob(["\ufeff", html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
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