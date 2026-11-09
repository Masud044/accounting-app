// import { useEffect, useMemo, useState } from "react";
// import { IconDownload } from "@tabler/icons-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { fmtAmount, fmtDate, fmtMonth, headLabel } from "./utils";

// const Section = ({ title, actions, children }) => (
//   <section className="bg-card rounded-lg border p-4">
//     <div className="mb-3 flex items-center justify-between gap-3">
//       <h3 className="text-sm font-medium">{title}</h3>
//       {actions}
//     </div>
//     {children}
//   </section>
// );

// /* ---------------------------- Income by head --------------------------- */
// export function ByHeadTable({ byHead }) {
//   return (
//     <Section title="Income by head">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Code</TableHead>
//             <TableHead>Head</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//             <TableHead className="w-40">Share</TableHead>
//             <TableHead className="text-right">%</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {byHead.rows.map((r) => (
//             <TableRow key={r.code}>
//               <TableCell>{r.code}</TableCell>
//               <TableCell>{headLabel(r)}</TableCell>
//               <TableCell className="text-right tabular-nums">
//                 {fmtAmount(r.amount)}
//               </TableCell>
//               <TableCell>
//                 <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
//                   <div
//                     className="bg-primary h-full"
//                     style={{ width: `${Math.min(r.percent, 100)}%` }}
//                   />
//                 </div>
//               </TableCell>
//               <TableCell className="text-right tabular-nums">
//                 {fmtAmount(r.percent)}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//           <TableRow>
//             <TableCell colSpan={2}>Total</TableCell>
//             <TableCell className="text-right tabular-nums">
//               {fmtAmount(byHead.total)}
//             </TableCell>
//             <TableCell />
//             <TableCell className="text-right tabular-nums">100.00</TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </Section>
//   );
// }

// /* ------------------------------ Monthly -------------------------------- */
// export function MonthlyTable({ monthly }) {
//   return (
//     <Section title="Monthly income by head">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Head</TableHead>
//             {monthly.months.map((m) => (
//               <TableHead key={m} className="text-right">
//                 {fmtMonth(m)}
//               </TableHead>
//             ))}
//             <TableHead className="text-right">Total</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {monthly.rows.map((r) => (
//             <TableRow key={r.code}>
//               <TableCell>{headLabel(r)}</TableCell>
//               {monthly.months.map((m) => (
//                 <TableCell key={m} className="text-right tabular-nums">
//                   {fmtAmount(r.months[m])}
//                 </TableCell>
//               ))}
//               <TableCell className="text-right tabular-nums">
//                 {fmtAmount(r.total)}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//           <TableRow>
//             <TableCell>Total</TableCell>
//             {monthly.months.map((m) => (
//               <TableCell key={m} className="text-right tabular-nums">
//                 {fmtAmount(monthly.totals[m])}
//               </TableCell>
//             ))}
//             <TableCell className="text-right tabular-nums">
//               {fmtAmount(monthly.grandTotal)}
//             </TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </Section>
//   );
// }

// /* ------------------------------ Details -------------------------------- */
// const PAGE_SIZE = 10;

// const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// const exportCsv = (rows, from, to) => {
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
//   const blob = new Blob(["\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\n")], {
//     type: "text/csv;charset=utf-8;",
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `income-report_${from}_to_${to}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
// };

// export function DetailTable({ details, from, to }) {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return details;
//     return details.filter((d) =>
//       [d.voucherNo, d.description, d.shortDescription, headLabel(d)]
//         .join(" ")
//         .toLowerCase()
//         .includes(q)
//     );
//   }, [details, search]);

//   useEffect(() => setPage(1), [search, details]);

//   const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const start = (page - 1) * PAGE_SIZE;
//   const rows = filtered.slice(start, start + PAGE_SIZE);

//   return (
//     <Section
//       title="Voucher details"
//       actions={
//         <div className="flex items-center gap-2 print:hidden">
//           <Input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search voucher or description"
//             className="h-8 w-56"
//           />
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => exportCsv(details, from, to)}
//           >
//             <IconDownload className="size-4" />
//             Export CSV
//           </Button>
//         </div>
//       }
//     >
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>#</TableHead>
//             <TableHead>GL date</TableHead>
//             <TableHead>Voucher</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Head</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//             <TableHead className="text-right">Cumulative</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {rows.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={7} className="text-muted-foreground py-6 text-center">
//                 Kono voucher paoa jai nai
//               </TableCell>
//             </TableRow>
//           ) : (
//             rows.map((d) => (
//               <TableRow key={d.sNo}>
//                 <TableCell>{d.sNo}</TableCell>
//                 <TableCell className="whitespace-nowrap">
//                   {fmtDate(d.glDate)}
//                 </TableCell>
//                 <TableCell>{d.voucherNo}</TableCell>
//                 <TableCell className="max-w-72 truncate" title={d.description}>
//                   {d.description}
//                 </TableCell>
//                 <TableCell className="whitespace-nowrap">
//                   {headLabel(d)}
//                 </TableCell>
//                 <TableCell className="text-right tabular-nums">
//                   {fmtAmount(d.amount)}
//                 </TableCell>
//                 <TableCell className="text-right tabular-nums">
//                   {fmtAmount(d.cumulative)}
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs print:hidden">
//         <span>
//           {filtered.length === 0
//             ? "Showing 0 of 0"
//             : `Showing ${start + 1} to ${start + rows.length} of ${filtered.length}`}
//         </span>
//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={page <= 1}
//             onClick={() => setPage((p) => p - 1)}
//           >
//             Previous
//           </Button>
//           <span>
//             Page {page} of {pageCount}
//           </span>
//           <Button
//             variant="outline"
//             size="sm"
//             disabled={page >= pageCount}
//             onClick={() => setPage((p) => p + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </Section>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtAmount, fmtDate, fmtMonth, headLabel } from "./utils";

const Section = ({ title, actions, children }) => (
  <section className="bg-card rounded-lg border p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {actions}
    </div>
    {children}
  </section>
);

/* ---------------------------- Income by head --------------------------- */
export function ByHeadTable({ byHead }) {
  return (
    <Section title="Income by head">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Head</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-40">Share</TableHead>
            <TableHead className="text-right">%</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {byHead.rows.map((r) => (
            <TableRow key={r.code}>
              <TableCell>{r.code}</TableCell>
              <TableCell>{headLabel(r)}</TableCell>
              <TableCell className="text-right tabular-nums">
                {fmtAmount(r.amount)}
              </TableCell>
              <TableCell>
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${Math.min(r.percent, 100)}%` }}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {fmtAmount(r.percent)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right tabular-nums">
              {fmtAmount(byHead.total)}
            </TableCell>
            <TableCell />
            <TableCell className="text-right tabular-nums">100.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Section>
  );
}

/* ------------------------------ Monthly -------------------------------- */
export function MonthlyTable({ monthly }) {
  return (
    <Section title="Monthly income by head">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Head</TableHead>
            {monthly.months.map((m) => (
              <TableHead key={m} className="text-right">
                {fmtMonth(m)}
              </TableHead>
            ))}
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monthly.rows.map((r) => (
            <TableRow key={r.code}>
              <TableCell>{headLabel(r)}</TableCell>
              {monthly.months.map((m) => (
                <TableCell key={m} className="text-right tabular-nums">
                  {fmtAmount(r.months[m])}
                </TableCell>
              ))}
              <TableCell className="text-right tabular-nums">
                {fmtAmount(r.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            {monthly.months.map((m) => (
              <TableCell key={m} className="text-right tabular-nums">
                {fmtAmount(monthly.totals[m])}
              </TableCell>
            ))}
            <TableCell className="text-right tabular-nums">
              {fmtAmount(monthly.grandTotal)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Section>
  );
}

/* ------------------------------ Details -------------------------------- */
const PAGE_SIZE = 10;

export function DetailTable({ details }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return details;
    return details.filter((d) =>
      [d.voucherNo, d.description, d.shortDescription, headLabel(d)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [details, search]);

  useEffect(() => setPage(1), [search, details]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <Section
      title="Voucher details"
      actions={
        <div className="flex items-center gap-2 print:hidden">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search voucher or description"
            className="h-8 w-56"
          />
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>GL date</TableHead>
            <TableHead>Voucher</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Head</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Cumulative</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground py-6 text-center">
                Kono voucher paoa jai nai
              </TableCell>
            </TableRow>
          ) : (
            rows.map((d) => (
              <TableRow key={d.sNo}>
                <TableCell>{d.sNo}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {fmtDate(d.glDate)}
                </TableCell>
                <TableCell>{d.voucherNo}</TableCell>
                <TableCell className="max-w-72 truncate" title={d.description}>
                  {d.description}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {headLabel(d)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {fmtAmount(d.amount)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {fmtAmount(d.cumulative)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs print:hidden">
        <span>
          {filtered.length === 0
            ? "Showing 0 of 0"
            : `Showing ${start + 1} to ${start + rows.length} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span>
            Page {page} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Section>
  );
}