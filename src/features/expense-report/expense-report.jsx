import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { IconFileDownload, IconLoader2 } from "@tabler/icons-react";
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

const columns = [
  {
    accessorKey: "ACCOUNT_HEAD",
    header: "Account Head",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    accessorKey: "AMOUNT",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-right font-mono">
        {Number(getValue() ?? 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
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

  const handleExportPDF = () => {
    if (!rows.length) {
      toast.warning("Export করার মতো কোনো data নেই");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Expense Statement", 14, 15);
    doc.setFontSize(10);
    doc.text(`Period: ${applied.fromDate} to ${applied.toDate}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Account Head", "Amount"]],
      body: rows.map((r) => [
        r.ACCOUNT_HEAD,
        Number(r.AMOUNT ?? 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      ]),
      foot: [["Total", total.toLocaleString("en-US", { minimumFractionDigits: 2 })]],
      headStyles: { fillColor: [153, 27, 27] },
      footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: "bold" },
    });

    doc.save(`expense-statement_${applied.fromDate}_to_${applied.toDate}.pdf`);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fromDate">From Date</Label>
          <Input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="toDate">To Date</Label>
          <Input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <Button onClick={handleApply} disabled={isFetching}>
          {isFetching ? (
            <IconLoader2 className="mr-1 size-4 animate-spin" />
          ) : null}
          Apply
        </Button>
        <Button
          variant="outline"
          onClick={handleExportPDF}
          disabled={isLoading || !rows.length}
        >
          <IconFileDownload className="mr-1 size-4" />
          Export PDF
        </Button>
      </div>

      {isError ? (
        <p className="text-sm text-red-500">
          {error?.message || "Expense statement load করতে সমস্যা হয়েছে"}
        </p>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-blue-900">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
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
                  <IconLoader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow className="bg-muted font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right font-mono">
                    {total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  not data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseStatementReport;