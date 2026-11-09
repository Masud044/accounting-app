// import { useEffect, useMemo, useState } from "react";
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
// import { fmtAmount, fmtDate, fmtMonth } from "./utils";

// const Section = ({ title, actions, children }) => (
//   <section className="bg-card rounded-lg border p-4">
//     <div className="mb-3 flex items-center justify-between gap-3">
//       <h3 className="text-sm font-medium">{title}</h3>
//       {actions}
//     </div>
//     {children}
//   </section>
// );

// /* ------------------------- Project x month ---------------------------- */
// export function ByProjectTable({ byProject }) {
//   return (
//     <Section title="Expense by project and month">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Project</TableHead>
//             {byProject.months.map((m) => (
//               <TableHead key={m} className="text-right">
//                 {fmtMonth(m)}
//               </TableHead>
//             ))}
//             <TableHead className="text-right">Total</TableHead>
//             <TableHead className="text-right">% of total</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {byProject.rows.map((r) => (
//             <TableRow key={r.project}>
//               <TableCell>{r.project}</TableCell>
//               {byProject.months.map((m) => (
//                 <TableCell key={m} className="text-right tabular-nums">
//                   {fmtAmount(r.months[m])}
//                 </TableCell>
//               ))}
//               <TableCell className="text-right tabular-nums">
//                 {fmtAmount(r.total)}
//               </TableCell>
//               <TableCell className="text-right tabular-nums">
//                 {fmtAmount(r.percent)}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         <TableFooter>
//           <TableRow>
//             <TableCell>Total</TableCell>
//             {byProject.months.map((m) => (
//               <TableCell key={m} className="text-right tabular-nums">
//                 {fmtAmount(byProject.totals[m])}
//               </TableCell>
//             ))}
//             <TableCell className="text-right tabular-nums">
//               {fmtAmount(byProject.grandTotal)}
//             </TableCell>
//             <TableCell className="text-right tabular-nums">100.00</TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </Section>
//   );
// }

// /* ------------------------ Category x project --------------------------- */
// export function ByCategoryTable({ byCategory }) {
//   return (
//     <Section title="Expense by category and project">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Code</TableHead>
//             <TableHead>Category</TableHead>
//             {byCategory.projects.map((p) => (
//               <TableHead key={p} className="text-right">
//                 {/* {p} */}
//               </TableHead>
//             ))}
//             <TableHead className="text-right">Total</TableHead>
//             <TableHead className="text-right">% of total</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {byCategory.rows.map((r) => (
//             <TableRow key={r.code}>
//               <TableCell>{r.code}</TableCell>
//               <TableCell>{r.category}</TableCell>
//               {byCategory.projects.map((p) => (
//                 <TableCell key={p} className="text-right tabular-nums">
//                   {fmtAmount(r.projects[p])}
//                 </TableCell>
//               ))}
//               <TableCell className="text-right tabular-nums">
//                 {fmtAmount(r.total)}
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
//             {byCategory.projects.map((p) => (
//               <TableCell key={p} className="text-right tabular-nums">
//                 {fmtAmount(byCategory.totals[p])}
//               </TableCell>
//             ))}
//             <TableCell className="text-right tabular-nums">
//               {fmtAmount(byCategory.grandTotal)}
//             </TableCell>
//             <TableCell className="text-right tabular-nums">100.00</TableCell>
//           </TableRow>
//         </TableFooter>
//       </Table>
//     </Section>
//   );
// }

// /* ------------------------------ Details -------------------------------- */
// const PAGE_SIZE = 10;

// export function DetailTable({ details }) {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return details;
//     return details.filter((d) =>
//       [d.voucherNo, d.description, d.category, d.project]
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
//       title="Expense transactions"
//       actions={
//         <Input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search voucher or description"
//           className="h-8 w-56"
//         />
//       }
//     >
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>#</TableHead>
//             <TableHead>GL date</TableHead>
//             <TableHead>Voucher</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Project</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead className="text-right">Amount</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {rows.length === 0 ? (
//             <TableRow>
//               <TableCell
//                 colSpan={7}
//                 className="text-muted-foreground py-6 text-center"
//               >
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
//                 <TableCell className="max-w-64 truncate" title={d.description}>
//                   {d.description}
//                 </TableCell>
//                 <TableCell>{d.project}</TableCell>
//                 <TableCell className="whitespace-nowrap">{d.category}</TableCell>
//                 <TableCell className="text-right tabular-nums">
//                   {fmtAmount(d.amount)}
//                 </TableCell>
//               </TableRow>
//             ))
//           )}
//         </TableBody>
//       </Table>

//       <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
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

import { Fragment, useEffect, useMemo, useState } from "react";
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
import { fmtAmount, fmtDate, fmtMonth } from "./utils";

const Section = ({ title, actions, children }) => (
  <section className="bg-card rounded-lg border p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {actions}
    </div>
    {children}
  </section>
);

/* ------------------------- Project x month ---------------------------- */
export function ByProjectTable({ byProject }) {
  return (
    <Section title="Expense by project and month">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            {byProject.months.map((m) => (
              <TableHead key={m} className="text-right">
                {fmtMonth(m)}
              </TableHead>
            ))}
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">% of total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {byProject.rows.map((r) => (
            <TableRow key={r.project}>
              <TableCell>{r.project}</TableCell>
              {byProject.months.map((m) => (
                <TableCell key={m} className="text-right tabular-nums">
                  {fmtAmount(r.months[m])}
                </TableCell>
              ))}
              <TableCell className="text-right tabular-nums">
                {fmtAmount(r.total)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {fmtAmount(r.percent)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            {byProject.months.map((m) => (
              <TableCell key={m} className="text-right tabular-nums">
                {fmtAmount(byProject.totals[m])}
              </TableCell>
            ))}
            <TableCell className="text-right tabular-nums">
              {fmtAmount(byProject.grandTotal)}
            </TableCell>
            <TableCell className="text-right tabular-nums">100.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Section>
  );
}

/* ------------------------ Category x project --------------------------- */
export function ByCategoryTable({ byCategory }) {
  return (
    <Section title="Expense by category and project">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Category / Account name</TableHead>
            {byCategory.projects.map((p) => (
              <TableHead key={p} className="text-right">
                {p}
              </TableHead>
            ))}
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">% of total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {byCategory.rows.map((r) => (
            <Fragment key={r.category}>
              {/* Category row (code nai, karon ek category-te onek account) */}
              <TableRow className="bg-muted/40 font-medium">
                <TableCell />
                <TableCell>{r.category}</TableCell>
                {byCategory.projects.map((p) => (
                  <TableCell key={p} className="text-right tabular-nums">
                    {fmtAmount(r.projects[p])}
                  </TableCell>
                ))}
                <TableCell className="text-right tabular-nums">
                  {fmtAmount(r.total)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {fmtAmount(r.percent)}
                </TableCell>
              </TableRow>

              {/* Account rows: Code + Name */}
              {(r.accounts || []).map((a) => (
                <TableRow key={`${r.category}-${a.code}`}>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {a.code}
                  </TableCell>
                  <TableCell className="text-muted-foreground pl-6">
                    {a.name}
                  </TableCell>
                  {byCategory.projects.map((p) => (
                    <TableCell
                      key={p}
                      className="text-muted-foreground text-right tabular-nums"
                    >
                      {fmtAmount(a.projects[p])}
                    </TableCell>
                  ))}
                  <TableCell className="text-muted-foreground text-right tabular-nums">
                    {fmtAmount(a.total)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right tabular-nums">
                    {fmtAmount(r.total ? (a.total / r.total) * 100 : 0)}
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            {byCategory.projects.map((p) => (
              <TableCell key={p} className="text-right tabular-nums">
                {fmtAmount(byCategory.totals[p])}
              </TableCell>
            ))}
            <TableCell className="text-right tabular-nums">
              {fmtAmount(byCategory.grandTotal)}
            </TableCell>
            <TableCell className="text-right tabular-nums">100.00</TableCell>
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
      [d.voucherNo, d.description, d.category, d.project]
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
      title="Expense transactions"
      actions={
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search voucher or description"
          className="h-8 w-56"
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>GL date</TableHead>
            <TableHead>Voucher</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground py-6 text-center"
              >
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
                <TableCell className="max-w-64 truncate" title={d.description}>
                  {d.description}
                </TableCell>
                <TableCell>{d.project}</TableCell>
                <TableCell className="whitespace-nowrap">{d.category}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {fmtAmount(d.amount)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
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