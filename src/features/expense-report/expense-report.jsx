// // import { useMemo, useState } from "react";
// // import {
// //   flexRender,
// //   getCoreRowModel,
// //   getSortedRowModel,
// //   useReactTable,
// // } from "@tanstack/react-table";
// // import jsPDF from "jspdf";
// // import autoTable from "jspdf-autotable";
// // import { toast } from "react-toastify";
// // import { IconFileDownload, IconLoader2 } from "@tabler/icons-react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { useExpenseStatement } from "./queries";

// // const columns = [
// //   {
// //     accessorKey: "ACCOUNT_HEAD",
// //     header: "Account Head",
// //     cell: ({ getValue }) => <span>{getValue()}</span>,
// //   },
// //   {
// //     accessorKey: "AMOUNT",
// //     header: () => <div className="text-right">Amount</div>,
// //     cell: ({ getValue }) => (
// //       <div className="text-right font-mono">
// //         {Number(getValue() ?? 0).toLocaleString("en-US", {
// //           minimumFractionDigits: 2,
// //           maximumFractionDigits: 2,
// //         })}
// //       </div>
// //     ),
// //   },
// // ];

// // const ExpenseStatementReport = () => {
// //   const today = new Date().toISOString().slice(0, 10);
// //   const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
// //     .toISOString()
// //     .slice(0, 10);

// //   const [fromDate, setFromDate] = useState(firstOfMonth);
// //   const [toDate, setToDate] = useState(today);
// //   const [applied, setApplied] = useState({ fromDate: firstOfMonth, toDate: today });

// //   const { data, isLoading, isFetching, isError, error } = useExpenseStatement(applied);

// //   const rows = data ?? [];

// //   const total = useMemo(
// //     () => rows.reduce((sum, r) => sum + Number(r.AMOUNT ?? 0), 0),
// //     [rows]
// //   );

// //   const table = useReactTable({
// //     data: rows,
// //     columns,
// //     getCoreRowModel: getCoreRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //   });

// //   const handleApply = () => {
// //     if (!fromDate || !toDate) {
// //       toast.error("From Date এবং To Date দুটোই দিতে হবে");
// //       return;
// //     }
// //     setApplied({ fromDate, toDate });
// //   };

// //   const handleExportPDF = () => {
// //     if (!rows.length) {
// //       toast.warning("Export করার মতো কোনো data নেই");
// //       return;
// //     }
// //     const doc = new jsPDF();
// //     doc.setFontSize(14);
// //     doc.text("Expense Statement", 14, 15);
// //     doc.setFontSize(10);
// //     doc.text(`Period: ${applied.fromDate} to ${applied.toDate}`, 14, 22);

// //     autoTable(doc, {
// //       startY: 28,
// //       head: [["Account Head", "Amount"]],
// //       body: rows.map((r) => [
// //         r.ACCOUNT_HEAD,
// //         Number(r.AMOUNT ?? 0).toLocaleString("en-US", {
// //           minimumFractionDigits: 2,
// //           maximumFractionDigits: 2,
// //         }),
// //       ]),
// //       foot: [["Total", total.toLocaleString("en-US", { minimumFractionDigits: 2 })]],
// //       headStyles: { fillColor: [153, 27, 27] },
// //       footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: "bold" },
// //     });

// //     doc.save(`expense-statement_${applied.fromDate}_to_${applied.toDate}.pdf`);
// //   };

// //   return (
// //     <div className="space-y-4 mt-4">
// //       <div className="flex flex-wrap items-end gap-3">
// //         <div className="flex flex-col gap-1.5">
// //           <Label htmlFor="fromDate">From Date</Label>
// //           <Input
// //             id="fromDate"
// //             type="date"
// //             value={fromDate}
// //             onChange={(e) => setFromDate(e.target.value)}
// //           />
// //         </div>
// //         <div className="flex flex-col gap-1.5">
// //           <Label htmlFor="toDate">To Date</Label>
// //           <Input
// //             id="toDate"
// //             type="date"
// //             value={toDate}
// //             onChange={(e) => setToDate(e.target.value)}
// //           />
// //         </div>
// //         <Button onClick={handleApply} disabled={isFetching}>
// //           {isFetching ? (
// //             <IconLoader2 className="mr-1 size-4 animate-spin" />
// //           ) : null}
// //           Apply
// //         </Button>
// //         <Button
// //           variant="outline"
// //           onClick={handleExportPDF}
// //           disabled={isLoading || !rows.length}
// //         >
// //           <IconFileDownload className="mr-1 size-4" />
// //           Export PDF
// //         </Button>
// //       </div>

// //       {isError ? (
// //         <p className="text-sm text-red-500">
// //           {error?.message || "Expense statement load করতে সমস্যা হয়েছে"}
// //         </p>
// //       ) : null}

// //       <div className="rounded-md border">
// //         <Table>
// //           <TableHeader className="bg-blue-900">
// //             {table.getHeaderGroups().map((hg) => (
// //               <TableRow key={hg.id}>
// //                 {hg.headers.map((header) => (
// //                   <TableHead key={header.id} className="text-white">
// //                     {flexRender(header.column.columnDef.header, header.getContext())}
// //                   </TableHead>
// //                 ))}
// //               </TableRow>
// //             ))}
// //           </TableHeader>
// //           <TableBody>
// //             {isLoading ? (
// //               <TableRow>
// //                 <TableCell colSpan={columns.length} className="h-24 text-center">
// //                   <IconLoader2 className="mx-auto size-5 animate-spin" />
// //                 </TableCell>
// //               </TableRow>
// //             ) : table.getRowModel().rows.length ? (
// //               <>
// //                 {table.getRowModel().rows.map((row) => (
// //                   <TableRow key={row.id}>
// //                     {row.getVisibleCells().map((cell) => (
// //                       <TableCell key={cell.id}>
// //                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                       </TableCell>
// //                     ))}
// //                   </TableRow>
// //                 ))}
// //                 <TableRow className="bg-muted font-semibold">
// //                   <TableCell>Total</TableCell>
// //                   <TableCell className="text-right font-mono">
// //                     {total.toLocaleString("en-US", {
// //                       minimumFractionDigits: 2,
// //                       maximumFractionDigits: 2,
// //                     })}
// //                   </TableCell>
// //                 </TableRow>
// //               </>
// //             ) : (
// //               <TableRow>
// //                 <TableCell colSpan={columns.length} className="h-24 text-center">
// //                   not data found
// //                 </TableCell>
// //               </TableRow>
// //             )}
// //           </TableBody>
// //         </Table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ExpenseStatementReport;

// import { useMemo, useState } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { toast } from "react-toastify";
// import { IconFileDownload, IconLoader2 } from "@tabler/icons-react";
// import { TrendingDown, Wallet } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useExpenseStatement } from "./queries";

// const formatAmount = (v) =>
//   Number(v ?? 0).toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const columns = [
//   {
//     accessorKey: "ACCOUNT_HEAD",
//     header: "Account Head",
//     cell: ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
//   },
//   {
//     accessorKey: "AMOUNT",
//     header: () => <div className="text-right pr-3">Amount</div>,
//     cell: ({ getValue }) => (
//       <div className="text-right pr-3 font-mono text-sm font-semibold text-gray-800">
//         {formatAmount(getValue())}
//       </div>
//     ),
//   },
// ];

// const ExpenseStatementReport = () => {
//   const today = new Date().toISOString().slice(0, 10);
//   const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//     .toISOString()
//     .slice(0, 10);

//   const [fromDate, setFromDate] = useState(firstOfMonth);
//   const [toDate, setToDate] = useState(today);
//   const [applied, setApplied] = useState({ fromDate: firstOfMonth, toDate: today });

//   const { data, isLoading, isFetching, isError, error } = useExpenseStatement(applied);

//   const rows = data ?? [];

//   const total = useMemo(
//     () => rows.reduce((sum, r) => sum + Number(r.AMOUNT ?? 0), 0),
//     [rows]
//   );

//   const table = useReactTable({
//     data: rows,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   const handleApply = () => {
//     if (!fromDate || !toDate) {
//       toast.error("From Date এবং To Date দুটোই দিতে হবে");
//       return;
//     }
//     setApplied({ fromDate, toDate });
//   };

//   const handleExportPDF = () => {
//     if (!rows.length) {
//       toast.warning("Export করার মতো কোনো data নেই");
//       return;
//     }
//     const doc = new jsPDF();
//     doc.setFontSize(14);
//     doc.setFont(undefined, "bold");
//     doc.text("Expense Statement", 14, 15);
//     doc.setFontSize(10);
//     doc.setFont(undefined, "normal");
//     doc.setTextColor(100);
//     doc.text(`Period: ${applied.fromDate} to ${applied.toDate}`, 14, 21);
//     doc.setTextColor(20);

//     autoTable(doc, {
//       startY: 27,
//       head: [["Account Head", "Amount"]],
//       body: rows.map((r) => [r.ACCOUNT_HEAD, formatAmount(r.AMOUNT)]),
//       foot: [["Total", formatAmount(total)]],
//       styles: { fontSize: 9, cellPadding: 3 },
//       headStyles: { fillColor: [190, 18, 60], textColor: 255, fontStyle: "bold" },
//       footStyles: { fillColor: [243, 244, 246], textColor: 20, fontStyle: "bold" },
//       columnStyles: { 1: { halign: "right" } },
//     });

//     doc.save(`expense-statement_${applied.fromDate}_to_${applied.toDate}.pdf`);
//   };

//   return (
//     <div className="p-4 md:p-6">
//       <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
//         {/* Header */}
//         <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
//           <div className="flex items-center justify-center w-8 h-8 rounded-md bg-rose-50 bg-emerald-700">
//             <TrendingDown size={16} />
//           </div>
//           <div>
//             <h2 className="text-sm font-bold text-gray-900">Expense Statement</h2>
//             <p className="text-xs text-gray-400">{rows.length} account heads</p>
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Summary card */}
//           <div className="flex items-center justify-between rounded-md px-4 py-3 bg-emerald-50">
//             <div className="flex items-center gap-2">
//               <Wallet size={16} className="text-emerald-700" />
//               <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                 Total Expense
//               </span>
//             </div>
//             <span className="text-lg font-bold font-mono text-emerald-700">
//               {formatAmount(total)}
//             </span>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-wrap items-end gap-3">
//             <div className="flex flex-col gap-1.5">
//               <Label htmlFor="fromDate" className="text-xs font-medium text-gray-500">
//                 From Date
//               </Label>
//               <Input
//                 id="fromDate"
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="h-9 w-40 bg-white border-gray-200"
//               />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <Label htmlFor="toDate" className="text-xs font-medium text-gray-500">
//                 To Date
//               </Label>
//               <Input
//                 id="toDate"
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="h-9 w-40 bg-white border-gray-200"
//               />
//             </div>
//             <Button
//               onClick={handleApply}
//               disabled={isFetching}
//               className="h-9 bg-emerald-700 hover:bg-emerald-700"
//             >
//               {isFetching ? <IconLoader2 className="mr-1 size-4 animate-spin" /> : null}
//               Apply
//             </Button>
//             <Button
//               variant="outline"
//               onClick={handleExportPDF}
//               disabled={isLoading || !rows.length}
//               className="h-9 ml-auto bg-white border-gray-200"
//             >
//               <IconFileDownload className="mr-1 size-4" />
//               Export PDF
//             </Button>
//           </div>

//           {isError ? (
//             <p className="text-sm bg-emerald-700">
//               {error?.message || "Expense statement do not load "}
//             </p>
//           ) : null}

//           {/* Table */}
//           <div className="overflow-hidden rounded-md border border-gray-200">
//             <Table>
//               <TableHeader className="bg-gray-50">
//                 {table.getHeaderGroups().map((hg) => (
//                   <TableRow key={hg.id}>
//                     {hg.headers.map((header) => (
//                       <TableHead
//                         key={header.id}
//                         className="text-gray-500 text-xs font-semibold uppercase tracking-wide"
//                       >
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       <IconLoader2 className="mx-auto size-5 animate-spin text-gray-400" />
//                     </TableCell>
//                   </TableRow>
//                 ) : table.getRowModel().rows.length ? (
//                   <>
//                     {table.getRowModel().rows.map((row) => (
//                       <TableRow key={row.id} className="hover:bg-gray-50/70 transition-colors">
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id}>
//                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                     <TableRow className="bg-gray-50 font-semibold hover:bg-gray-50">
//                       <TableCell className="text-sm text-gray-800">Total</TableCell>
//                       <TableCell className="text-right pr-3 font-mono text-sm text-emerald-700">
//                         {formatAmount(total)}
//                       </TableCell>
//                     </TableRow>
//                   </>
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-gray-400">
//                       No data found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpenseStatementReport;

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { IconFileSpreadsheet, IconLoader2 } from "@tabler/icons-react";
import { TrendingDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExpenseStatement } from "./queries";

const formatAmount = (v) =>
  Number(v ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns = [
  {
    accessorKey: "ACCOUNT_HEAD",
    header: "Account Head",
    cell: ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
  },
  {
    accessorKey: "AMOUNT",
    header: () => <div className="text-right pr-3">Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-right pr-3 font-mono text-sm font-semibold text-gray-800">
        {formatAmount(getValue())}
      </div>
    ),
  },
];

const ExpenseStatementReport = () => {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const [fromDate, setFromDate] = useState(firstOfMonth);
  const [toDate, setToDate] = useState(today);
  const [applied, setApplied] = useState({ fromDate: firstOfMonth, toDate: today });

  const { data, isLoading, isFetching, isError, error } = useExpenseStatement(applied);

  const rows = data ?? [];

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + Number(r.AMOUNT ?? 0), 0),
    [rows]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleApply = () => {
    if (!fromDate || !toDate) {
      toast.error("From Date এবং To Date দুটোই দিতে হবে");
      return;
    }
    setApplied({ fromDate, toDate });
  };

  // ── Excel export ─────────────────────────────────────────────────────────
  const handleExportExcel = () => {
    if (!rows.length) {
      toast.warning("Export করার মতো কোনো data নেই");
      return;
    }

    const exportData = rows.map((r) => ({
      "Account Head": r.ACCOUNT_HEAD,
      "Amount": Number(r.AMOUNT ?? 0),
    }));

    exportData.push({
      "Account Head": "Total",
      "Amount": total,
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [{ wch: 35 }, { wch: 16 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense Statement");

    XLSX.writeFile(wb, `Expense_Statement_${applied.fromDate}_to_${applied.toDate}.xlsx`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-rose-50 bg-emerald-700">
            <TrendingDown size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Expense Statement</h2>
            <p className="text-xs text-gray-400">{rows.length} account heads</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Summary card */}
          <div className="flex items-center justify-between rounded-md px-4 py-3 bg-emerald-50">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-emerald-700" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Total Expense
              </span>
            </div>
            <span className="text-lg font-bold font-mono text-emerald-700">
              {formatAmount(total)}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fromDate" className="text-xs font-medium text-gray-500">
                From Date
              </Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9 w-40 bg-white border-gray-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="toDate" className="text-xs font-medium text-gray-500">
                To Date
              </Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9 w-40 bg-white border-gray-200"
              />
            </div>
            <Button
              onClick={handleApply}
              disabled={isFetching}
              className="h-9 bg-emerald-700 hover:bg-emerald-700"
            >
              {isFetching ? <IconLoader2 className="mr-1 size-4 animate-spin" /> : null}
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={isLoading || !rows.length}
              className="h-9 ml-auto bg-white border-gray-200"
            >
              <IconFileSpreadsheet className="mr-1 size-4" />
              Export Excel
            </Button>
          </div>

          {isError ? (
            <p className="text-sm bg-emerald-700">
              {error?.message || "Expense statement do not load "}
            </p>
          ) : null}

          {/* Table */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-gray-500 text-xs font-semibold uppercase tracking-wide"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <IconLoader2 className="mx-auto size-5 animate-spin text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/70 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 font-semibold hover:bg-gray-50">
                      <TableCell className="text-sm text-gray-800">Total</TableCell>
                      <TableCell className="text-right pr-3 font-mono text-sm text-emerald-700">
                        {formatAmount(total)}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-gray-400">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStatementReport;