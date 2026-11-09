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
//     "Project", "Category", "Amount",
//   ];
//   const lines = rows.map((d) =>
//     [
//       d.sNo, d.glDate, d.voucherNo, d.description,
//       d.project, d.category, d.amount,
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
//   a.download = `expense-report_${from}_to_${to}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
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
    "Project", "Category", "Amount",
  ];
  const lines = rows.map((d) =>
    [
      d.sNo, d.glDate, d.voucherNo, d.description,
      d.project, d.category, d.amount,
    ]
      .map(csvCell)
      .join(",")
  );
  // BOM thakle Excel-e Bangla description thik dekhay
  const blob = new Blob(
    ["﻿" + [header.map(csvCell).join(","), ...lines].join("\n")],
    { type: "text/csv;charset=utf-8;" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expense-report_${from}_to_${to}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

/* ====================================================================== */
/* Excel export (puro report, section wise) — kono library install lage na  */
/*   Sheets: Summary | By Account | Transactions | Review Items            */
/*   Nijer moto chhoto .xlsx writer (zip STORE + OOXML) use kora hoyeche    */
/* ====================================================================== */

// ---- style ids (styles.xml-er cellXfs index) ----
const ST = {
  DEFAULT: 0, TITLE: 1, NOTE: 2, SECTION: 3, HEAD_L: 4, HEAD_R: 5, BOLD: 6,
  AMT: 7, PCT: 8, DATE: 9, MONTH: 10, CODE: 11, TOT_L: 12, TOT_AMT: 13,
  TOT_PCT: 14, INT: 15, WRAP: 16,
};

const t = (v, s = ST.DEFAULT) => ({ v, s });
const hl = (v) => t(v, ST.HEAD_L);
const hr = (v) => t(v, ST.HEAD_R);
const amt = (v) => t(v, ST.AMT);
const pct = (v) => t(v, ST.PCT);

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="4">
<numFmt numFmtId="164" formatCode="#,##0.00"/>
<numFmt numFmtId="165" formatCode="0.00&quot;%&quot;"/>
<numFmt numFmtId="166" formatCode="dd\-mmm\-yyyy"/>
<numFmt numFmtId="167" formatCode="mmm\-yy"/>
</numFmts>
<fonts count="6">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
<font><b/><sz val="14"/><name val="Calibri"/></font>
<font><b/><sz val="12"/><name val="Calibri"/></font>
<font><i/><sz val="10"/><color rgb="FF666666"/><name val="Calibri"/></font>
</fonts>
<fills count="4">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E3D"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE8EEEA"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="17">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="5" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="167" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="left"/></xf>
<xf numFmtId="0" fontId="1" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="164" fontId="1" fillId="3" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"/>
<xf numFmtId="165" fontId="1" fillId="3" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"/>
<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

/* ---------- xml helpers ---------- */
const xmlEsc = (s) =>
  String(s)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const colName = (i) => {
  let n = i + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

// "2026-05-30" -> Excel serial number (timezone-safe)
const isoToSerial = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return (Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000;
};

const asCode = (c) => (/^\d+$/.test(String(c)) ? Number(c) : c);

const sheetXml = ({ rows, widths = [], freezeRow = 0, filter }) => {
  const cols = widths.length
    ? `<cols>${widths
        .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`)
        .join("")}</cols>`
    : "";
  const view = freezeRow
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${freezeRow}" topLeftCell="A${freezeRow + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    : "";
  const body = rows
    .map((row, ri) => {
      const cells = row
        .map((cell, ci) => {
          if (cell === null || cell === undefined || cell === "") return "";
          const { v, s = 0 } =
            typeof cell === "object" ? cell : { v: cell, s: 0 };
          if (v === null || v === undefined || v === "") {
            return s ? `<c r="${colName(ci)}${ri + 1}" s="${s}"/>` : "";
          }
          const ref = `${colName(ci)}${ri + 1}`;
          if (typeof v === "number" && Number.isFinite(v)) {
            return `<c r="${ref}" s="${s}"><v>${v}</v></c>`;
          }
          return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
        })
        .join("");
      return cells ? `<row r="${ri + 1}">${cells}</row>` : "";
    })
    .join("");
  const filt = filter ? `<autoFilter ref="${filter}"/>` : "";
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${view}${cols}<sheetData>${body}</sheetData>${filt}</worksheet>`;
};

/* ---------- zip (STORE, compression chhara) ---------- */
const CRC_TABLE = (() => {
  const tbl = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tbl[n] = c >>> 0;
  }
  return tbl;
})();

const crc32 = (bytes) => {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const zipStore = (files) => {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const push = (u8) => {
    chunks.push(u8);
    offset += u8.length;
  };

  for (const f of files) {
    const name = enc.encode(f.name);
    const data = enc.encode(f.data);
    const crc = crc32(data);

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true); // UTF-8 file name
    lh.setUint16(8, 0, true); // STORE
    lh.setUint16(10, 0, true);
    lh.setUint16(12, 0x21, true); // 1980-01-01
    lh.setUint32(14, crc, true);
    lh.setUint32(18, data.length, true);
    lh.setUint32(22, data.length, true);
    lh.setUint16(26, name.length, true);
    lh.setUint16(28, 0, true);

    const localOffset = offset;
    push(new Uint8Array(lh.buffer));
    push(name);
    push(data);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, 0, true);
    ch.setUint16(14, 0x21, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, data.length, true);
    ch.setUint32(24, data.length, true);
    ch.setUint16(28, name.length, true);
    ch.setUint32(42, localOffset, true);
    central.push(new Uint8Array(ch.buffer), name);
  }

  const centralStart = offset;
  for (const c of central) push(c);
  const centralSize = offset - centralStart;

  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, centralStart, true);
  push(new Uint8Array(end.buffer));

  const out = new Uint8Array(offset);
  let p = 0;
  for (const c of chunks) {
    out.set(c, p);
    p += c.length;
  }
  return out;
};

/* ---------- report -> sheets ---------- */
export const buildExpenseSheets = (data) => {
  const { filters, kpis, byProject, byCategory, details } = data;
  const skipped = data.skippedVouchers || [];
  const projects = byCategory.projects;
  const months = byProject.months;

  /* ===== 1. Summary ===== */
  const kv = (k, v, s = ST.DEFAULT) => [t(k, ST.BOLD), t(v, s)];
  const summary = [
    [t("Farm Expense Report", ST.TITLE)],
    [
      t(
        `Period: ${fmtDate(filters.from)} to ${fmtDate(filters.to)} · Date basis: ${filters.dateBasis} · Project: ${filters.project} · Category: ${filters.category} · Amounts in BDT (assumed)`,
        ST.NOTE
      ),
    ],
    [],
    [t("Key figures", ST.SECTION)],
    kv("Total expense (BDT)", kpis.totalExpense, ST.AMT),
    kv("Expense lines in report", kpis.expenseLines, ST.INT),
    kv("Largest project", kpis.largestProject?.name ?? "-"),
    kv("Largest project amount (BDT)", kpis.largestProject?.amount ?? 0, ST.AMT),
    kv("Largest category", kpis.largestCategory?.name ?? "-"),
    kv("Largest category amount (BDT)", kpis.largestCategory?.amount ?? 0, ST.AMT),
    kv("Peak month", kpis.peakMonth ? fmtMonth(kpis.peakMonth.month) : "-"),
    kv("Peak month amount (BDT)", kpis.peakMonth?.amount ?? 0, ST.AMT),
    kv("Average per month with spending (BDT)", kpis.averagePerSpendingMonth, ST.AMT),
    [],
    [t("Expense by project and month", ST.SECTION)],
    [hl("Project"), ...months.map((m) => hr(fmtMonth(m))), hr("Total"), hr("% of Total")],
    ...byProject.rows.map((r) => [
      t(r.project),
      ...months.map((m) => amt(r.months[m] || 0)),
      amt(r.total),
      pct(r.percent),
    ]),
    [
      t("Total", ST.TOT_L),
      ...months.map((m) => t(byProject.totals[m] || 0, ST.TOT_AMT)),
      t(byProject.grandTotal, ST.TOT_AMT),
      t(100, ST.TOT_PCT),
    ],
    [],
    [t("Expense by category and project", ST.SECTION)],
    [hl("Category"), ...projects.map(hr), hr("Total"), hr("% of Total")],
    ...byCategory.rows.map((r) => [
      t(r.category),
      ...projects.map((p) => amt(r.projects[p] || 0)),
      amt(r.total),
      pct(r.percent),
    ]),
    [
      t("Total", ST.TOT_L),
      ...projects.map((p) => t(byCategory.totals[p] || 0, ST.TOT_AMT)),
      t(byCategory.grandTotal, ST.TOT_AMT),
      t(100, ST.TOT_PCT),
    ],
    [],
    kv(
      "Reconciliation check (should be 0)",
      Math.round((byProject.grandTotal - byCategory.grandTotal) * 100) / 100,
      ST.AMT
    ),
  ];

  /* ===== 2. By Account (code + name + category) ===== */
  const accMap = new Map();
  for (const d of details) {
    const a = accMap.get(d.code) || {
      code: d.code,
      name: d.accountName,
      category: d.category,
      projects: Object.fromEntries(projects.map((p) => [p, 0])),
      total: 0,
    };
    a.projects[d.project] = (a.projects[d.project] || 0) + d.amount;
    a.total += d.amount;
    accMap.set(d.code, a);
  }
  const accounts = [...accMap.values()].sort((a, b) => b.total - a.total);
  const grand = byCategory.grandTotal || accounts.reduce((s, a) => s + a.total, 0);
  const byAccount = [
    [t("Expense by Account", ST.TITLE)],
    [t("Net expense (debits less credits) on expense accounts, by project. Amounts in BDT.", ST.NOTE)],
    [],
    [hl("Account Code"), hl("Account Name"), hl("Category"), ...projects.map(hr), hr("Total"), hr("% of Total")],
    ...accounts.map((a) => [
      t(asCode(a.code), ST.CODE),
      t(a.name),
      t(a.category),
      ...projects.map((p) => amt(a.projects[p] || 0)),
      amt(a.total),
      pct(grand ? (a.total / grand) * 100 : 0),
    ]),
    [
      t("Total", ST.TOT_L), t("", ST.TOT_L), t("", ST.TOT_L),
      ...projects.map((p) => t(byCategory.totals[p] || 0, ST.TOT_AMT)),
      t(byCategory.grandTotal, ST.TOT_AMT),
      t(100, ST.TOT_PCT),
    ],
  ];

  /* ===== 3. Transactions ===== */
  const tx = [
    [
      hl("Voucher No"), hl("GL Date"), hl("Month"), hl("Project"), hl("Account Code"),
      hl("Account Name"), hl("Category"), hl("Description"), hr("Net Expense"),
    ],
    ...details.map((d) => [
      t(d.voucherNo),
      t(isoToSerial(d.glDate), ST.DATE),
      t(isoToSerial(`${d.glDate.slice(0, 7)}-01`), ST.MONTH),
      t(d.project),
      t(asCode(d.code), ST.CODE),
      t(d.accountName),
      t(d.category),
      t(d.description),
      amt(d.amount),
    ]),
    [
      t("Total", ST.TOT_L), t("", ST.TOT_L), t("", ST.TOT_L), t("", ST.TOT_L),
      t("", ST.TOT_L), t("", ST.TOT_L), t("", ST.TOT_L), t("", ST.TOT_L),
      t(Math.round(details.reduce((s, d) => s + d.amount, 0) * 100) / 100, ST.TOT_AMT),
    ],
  ];

  /* ===== 4. Review Items ===== */
  const review = [
    [t("Review Items & Assumptions", ST.TITLE)],
    [],
    [t("Unbalanced vouchers (report theke bad)", ST.SECTION)],
    ...(skipped.length
      ? [
          [hl("#"), hl("Voucher"), hr("Debit (BDT)"), hr("Credit (BDT)"), hr("Difference (BDT)")],
          ...skipped.map((v, i) => [
            t(i + 1, ST.INT),
            t(v.voucherNo),
            amt(v.debit),
            amt(v.credit),
            amt(Math.round((v.debit - v.credit) * 100) / 100),
          ]),
        ]
      : [[t("Ei period-e kono unbalanced voucher nai.", ST.NOTE)]]),
    [],
    [t("Assumptions", ST.SECTION)],
    ...[
      'Expense = net debit (debit less credit) on 5xxx expense accounts in vouchers of type "Expense".',
      "Unbalanced vouchers (debit != credit) puro skip kora hoy, upore list ache.",
      "Currency source e nai; amount BDT dhora hoyeche.",
      `Month ar date filter ${filters.dateBasis} onujayi.`,
      "Category Excel-er Accounts mapping onujayi; map-e na thaka account 'Other' e jay.",
    ].map((txt, i) => [t(`${i + 1}.`), t(txt)]),
  ];

  const wide = Math.max(months.length, projects.length) + 2;
  return [
    { name: "Summary", rows: summary, widths: [40, ...Array(wide).fill(16)] },
    {
      name: "By Account",
      rows: byAccount,
      widths: [16, 40, 24, ...Array(projects.length + 2).fill(16)],
      freezeRow: 4,
    },
    {
      name: "Transactions",
      rows: tx,
      widths: [14, 14, 10, 12, 16, 36, 24, 48, 16],
      freezeRow: 1,
      filter: `A1:I${details.length + 1}`,
    },
    { name: "Review Items", rows: review, widths: [8, 60, 16, 16, 18] },
  ];
};

/* ---------- sheets -> .xlsx bytes ---------- */
export const buildXlsxBytes = (data) => {
  const sheets = buildExpenseSheets(data);
  const files = [
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets
        .map(
          (_, i) =>
            `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
        )
        .join("")}</Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets
        .map((s, i) => `<sheet name="${xmlEsc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
        .join("")}</sheets></workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets
        .map(
          (_, i) =>
            `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
        )
        .join("")}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    },
    { name: "xl/styles.xml", data: STYLES_XML },
    ...sheets.map((s, i) => ({
      name: `xl/worksheets/sheet${i + 1}.xml`,
      data: sheetXml(s),
    })),
  ];
  return zipStore(files);
};

export const exportExcel = (data) => {
  const bytes = buildXlsxBytes(data);
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expense-report_${data.filters.from}_to_${data.filters.to}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};