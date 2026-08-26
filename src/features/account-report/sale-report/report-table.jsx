// // import { TrendingUp, ShoppingCart } from "lucide-react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge }  from "@/components/ui/badge";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import {
// //   Table, TableBody, TableCell,
// //   TableHead, TableHeader, TableRow,
// // } from "@/components/ui/table";

// // const fmt = (v) =>
// //   Number(v) ? Number(v).toLocaleString("en-IN") : "—";

// // const fmtDate = (d) =>
// //   d ? new Date(d).toLocaleDateString("en-CA") : "—";

// // function TypeBadge({ voucherType, section }) {
// //   if (section === "sales") {
// //     return voucherType === 3
// //       ? <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">GL-Inc</Badge>
// //       : <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Income</Badge>;
// //   }
// //   return voucherType === 3
// //     ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300">GL-Exp</Badge>
// //     : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expense</Badge>;
// // }

// // function GlTable({ rows, section }) {
// //   const totalDebit  = rows.reduce((s, r) => s + (Number(r.DEBIT)  || 0), 0);
// //   const totalCredit = rows.reduce((s, r) => s + (Number(r.CREDIT) || 0), 0);

// //   return (
// //     <div className="rounded-md border overflow-hidden">
// //       <Table>
// //         <TableHeader>
// //           <TableRow>
// //             <TableHead className="w-[145px]">Voucher No.</TableHead>
// //             <TableHead className="w-[105px]">Date</TableHead>
// //             <TableHead className="w-[88px]">Type</TableHead>
// //             <TableHead>Description</TableHead>
// //             <TableHead>Account</TableHead>
// //             <TableHead className="text-right w-[120px]">Debit (৳)</TableHead>
// //             <TableHead className="text-right w-[120px]">Credit (৳)</TableHead>
// //           </TableRow>
// //         </TableHeader>
// //         <TableBody>
// //           {rows.length === 0 ? (
// //             <TableRow>
// //               <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
// //                 No entries found
// //               </TableCell>
// //             </TableRow>
// //           ) : (
// //             <>
// //               {rows.map((row, i) => (
// //                 <TableRow key={i}>
// //                   <TableCell className="font-mono text-xs text-muted-foreground">
// //                     {row.VOUCHERNO}
// //                   </TableCell>
// //                   <TableCell className="text-sm">{fmtDate(row.TRANS_DATE)}</TableCell>
// //                   <TableCell>
// //                     <TypeBadge voucherType={row.VOUCHER_TYPE} section={section} />
// //                   </TableCell>
// //                   <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
// //                     {row.VOUCHER_DESC || "—"}
// //                   </TableCell>
// //                   <TableCell className="text-sm font-medium">
// //                     {row.ACCOUNT_NAME || row.ACCOUNT_LABEL || row.ACCOUNT_ID}
// //                   </TableCell>
// //                   <TableCell className="text-right text-sm tabular-nums text-red-600">
// //                     {Number(row.DEBIT) ? fmt(row.DEBIT) : "—"}
// //                   </TableCell>
// //                   <TableCell className="text-right text-sm tabular-nums text-blue-600">
// //                     {Number(row.CREDIT) ? fmt(row.CREDIT) : "—"}
// //                   </TableCell>
// //                 </TableRow>
// //               ))}

// //               {/* Total row */}
// //               <TableRow className="bg-muted/50 font-medium">
// //                 <TableCell colSpan={5} className="text-right text-muted-foreground text-sm">
// //                   Total
// //                 </TableCell>
// //                 <TableCell className="text-right tabular-nums text-red-700">
// //                   {totalDebit  ? `৳${fmt(totalDebit)}`  : "—"}
// //                 </TableCell>
// //                 <TableCell className="text-right tabular-nums text-blue-700">
// //                   {totalCredit ? `৳${fmt(totalCredit)}` : "—"}
// //                 </TableCell>
// //               </TableRow>
// //             </>
// //           )}
// //         </TableBody>
// //       </Table>
// //     </div>
// //   );
// // }

// // export default function ReportTables({ sales = [], expenses = [] }) {
// //   return (
// //     <Card>
// //       <CardHeader className="pb-3">
// //         <CardTitle className="text-sm font-medium">GL detail lines</CardTitle>
// //       </CardHeader>
// //       <CardContent>
// //         <Tabs defaultValue="sales">
// //           <TabsList className="mb-4">
// //             <TabsTrigger value="sales" className="gap-1.5">
// //               <TrendingUp className="h-3.5 w-3.5 text-green-600" />
// //               Sales income
// //               <span className="text-xs text-muted-foreground">({sales.length})</span>
// //             </TabsTrigger>
// //             <TabsTrigger value="expenses" className="gap-1.5">
// //               <ShoppingCart className="h-3.5 w-3.5 text-red-500" />
// //               Expenses
// //               <span className="text-xs text-muted-foreground">({expenses.length})</span>
// //             </TabsTrigger>
// //           </TabsList>
// //           <TabsContent value="sales">
// //             <GlTable rows={sales} section="sales" />
// //           </TabsContent>
// //           <TabsContent value="expenses">
// //             <GlTable rows={expenses} section="expense" />
// //           </TabsContent>
// //         </Tabs>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import { TrendingUp, ShoppingCart } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge }  from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table, TableBody, TableCell,
//   TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";

// const fmt = (v) =>
//   Number(v) ? Number(v).toLocaleString("en-IN") : "—";

// const fmtDate = (d) =>
//   d ? new Date(d).toLocaleDateString("en-CA") : "—";

// function TypeBadge({ voucherType, section }) {
//   const label = voucherType === 3
//     ? (section === "sales" ? "GL-Inc" : "GL-Exp")
//     : (section === "sales" ? "Income" : "Expense");
//   return (
//     <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
//       {label}
//     </Badge>
//   );
// }

// function GlTable({ rows, section }) {
//   const totalDebit  = rows.reduce((s, r) => s + (Number(r.DEBIT)  || 0), 0);
//   const totalCredit = rows.reduce((s, r) => s + (Number(r.CREDIT) || 0), 0);

//   return (
//     <div className="rounded-md border overflow-hidden">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[145px]">Voucher No.</TableHead>
//             <TableHead className="w-[105px]">Date</TableHead>
//             <TableHead className="w-[88px]">Type</TableHead>
//             <TableHead>Description</TableHead>
//             <TableHead>Account</TableHead>
//             <TableHead className="text-right w-[120px]">Debit (৳)</TableHead>
//             <TableHead className="text-right w-[120px]">Credit (৳)</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {rows.length === 0 ? (
//             <TableRow>
//               <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
//                 No entries found
//               </TableCell>
//             </TableRow>
//           ) : (
//             <>
//               {rows.map((row, i) => (
//                 <TableRow key={i}>
//                   <TableCell className="font-mono text-xs text-muted-foreground">
//                     {row.VOUCHERNO}
//                   </TableCell>
//                   <TableCell className="text-sm">{fmtDate(row.TRANS_DATE)}</TableCell>
//                   <TableCell>
//                     <TypeBadge voucherType={row.VOUCHER_TYPE} section={section} />
//                   </TableCell>
//                   <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
//                     {row.VOUCHER_DESC || "—"}
//                   </TableCell>
//                   <TableCell className="text-sm font-medium">
//                     {row.ACCOUNT_NAME || row.ACCOUNT_LABEL || row.ACCOUNT_ID}
//                   </TableCell>
//                   <TableCell className="text-right text-sm tabular-nums">
//                     {Number(row.DEBIT) ? fmt(row.DEBIT) : "—"}
//                   </TableCell>
//                   <TableCell className="text-right text-sm tabular-nums">
//                     {Number(row.CREDIT) ? fmt(row.CREDIT) : "—"}
//                   </TableCell>
//                 </TableRow>
//               ))}

//               {/* Total row */}
//               <TableRow className="bg-muted/50 font-semibold">
//                 <TableCell colSpan={5} className="text-right text-muted-foreground text-sm">
//                   Total
//                 </TableCell>
//                 <TableCell className="text-right tabular-nums text-primary">
//                   {totalDebit  ? `৳${fmt(totalDebit)}`  : "—"}
//                 </TableCell>
//                 <TableCell className="text-right tabular-nums text-primary">
//                   {totalCredit ? `৳${fmt(totalCredit)}` : "—"}
//                 </TableCell>
//               </TableRow>
//             </>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// export default function ReportTables({ sales = [], expenses = [] }) {
//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-sm font-medium">GL detail lines</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="sales">
//           <TabsList className="mb-4">
//             <TabsTrigger value="sales" className="gap-1.5">
//               <TrendingUp className="h-3.5 w-3.5 text-primary" />
//               Sales income
//               <span className="text-xs text-muted-foreground">({sales.length})</span>
//             </TabsTrigger>
//             <TabsTrigger value="expenses" className="gap-1.5">
//               <ShoppingCart className="h-3.5 w-3.5 text-primary" />
//               Expenses
//               <span className="text-xs text-muted-foreground">({expenses.length})</span>
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="sales">
//             <GlTable rows={sales} section="sales" />
//           </TabsContent>
//           <TabsContent value="expenses">
//             <GlTable rows={expenses} section="expense" />
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// }

import { TrendingUp, ShoppingCart, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }  from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const fmt = (v) =>
  Number(v) ? Number(v).toLocaleString("en-IN") : "—";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-CA") : "—";

function TypeBadge({ voucherType, section }) {
  const label = voucherType === 3
    ? (section === "sales" ? "GL-Inc" : "GL-Exp")
    : (section === "sales" ? "Income" : "Expense");
  return (
    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
      {label}
    </Badge>
  );
}

// ── Excel export helper ──
const exportGlToExcel = (rows, section) => {
  const label = section === "sales" ? "Sales Income" : "Expenses";

  const exportData = rows.map((r) => ({
    "Voucher No": r.VOUCHERNO,
    "Date": fmtDate(r.TRANS_DATE),
    "Type": r.VOUCHER_TYPE === 3
      ? (section === "sales" ? "GL-Inc" : "GL-Exp")
      : (section === "sales" ? "Income" : "Expense"),
    "Description": r.VOUCHER_DESC || "",
    "Account": r.ACCOUNT_NAME || r.ACCOUNT_LABEL || r.ACCOUNT_ID || "",
    "Debit": Number(r.DEBIT) || 0,
    "Credit": Number(r.CREDIT) || 0,
  }));

  const totalDebit  = rows.reduce((s, r) => s + (Number(r.DEBIT)  || 0), 0);
  const totalCredit = rows.reduce((s, r) => s + (Number(r.CREDIT) || 0), 0);

  exportData.push({
    "Voucher No": "",
    "Date": "",
    "Type": "",
    "Description": "",
    "Account": "Total",
    "Debit": totalDebit,
    "Credit": totalCredit,
  });

  const ws = XLSX.utils.json_to_sheet(exportData);
  ws["!cols"] = [
    { wch: 16 }, { wch: 12 }, { wch: 10 }, { wch: 32 }, { wch: 26 }, { wch: 14 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, label);
  XLSX.writeFile(wb, `${label.replace(/\s+/g, "_")}_GL_Detail.xlsx`);
};

function GlTable({ rows, section }) {
  const totalDebit  = rows.reduce((s, r) => s + (Number(r.DEBIT)  || 0), 0);
  const totalCredit = rows.reduce((s, r) => s + (Number(r.CREDIT) || 0), 0);

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportGlToExcel(rows, section)}
          disabled={!rows.length}
        >
          <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" />
          Export Excel
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[145px]">Voucher No.</TableHead>
              <TableHead className="w-[105px]">Date</TableHead>
              <TableHead className="w-[88px]">Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right w-[120px]">Debit (৳)</TableHead>
              <TableHead className="text-right w-[120px]">Credit (৳)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No entries found
                </TableCell>
              </TableRow>
            ) : (
              <>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.VOUCHERNO}
                    </TableCell>
                    <TableCell className="text-sm">{fmtDate(row.TRANS_DATE)}</TableCell>
                    <TableCell>
                      <TypeBadge voucherType={row.VOUCHER_TYPE} section={section} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {row.VOUCHER_DESC || "—"}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {row.ACCOUNT_NAME || row.ACCOUNT_LABEL || row.ACCOUNT_ID}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {Number(row.DEBIT) ? fmt(row.DEBIT) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {Number(row.CREDIT) ? fmt(row.CREDIT) : "—"}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total row */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={5} className="text-right text-muted-foreground text-sm">
                    Total
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-primary">
                    {totalDebit  ? `৳${fmt(totalDebit)}`  : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-primary">
                    {totalCredit ? `৳${fmt(totalCredit)}` : "—"}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ReportTables({ sales = [], expenses = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">GL detail lines</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales" className="gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Sales income
              <span className="text-xs text-muted-foreground">({sales.length})</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5 text-primary" />
              Expenses
              <span className="text-xs text-muted-foreground">({expenses.length})</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sales">
            <GlTable rows={sales} section="sales" />
          </TabsContent>
          <TabsContent value="expenses">
            <GlTable rows={expenses} section="expense" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}