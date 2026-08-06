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
import { IconFileDownload, IconLoader2, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExpenseReport, useIncomeReport } from "./queries";

const formatAmount = (v) =>
  Number(v ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const columns = [
  {
    accessorKey: "VOUCHERNO",
    header: "Voucher No",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
  accessorKey: "GL_ENTRY_DATE",
  header: "Date",
  cell: ({ getValue }) => {
    const v = getValue();
    return (
      <span>
        {v
          ? new Date(v).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : ""}
      </span>
    );
  },
},
  {
    accessorKey: "DESCRIPTION_WITH_CODE",
    header: "Description",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  },
  {
    accessorKey: "AMOUNT",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ getValue }) => (
      <div className="text-right font-mono">{formatAmount(getValue())}</div>
    ),
  },
];

const IncomeExpenseReport = () => {
  const [reportType, setReportType] = useState("expense"); // "expense" | "income"
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // শুরুতে খালি → filter ছাড়া সব data লোড হবে
  const [applied, setApplied] = useState({ fromDate: "", toDate: "" });

  const expenseQuery = useExpenseReport(applied, reportType === "expense");
  const incomeQuery = useIncomeReport(applied, reportType === "income");

  const { data, isLoading, isFetching, isError, error } =
    reportType === "expense" ? expenseQuery : incomeQuery;

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
    // fromDate/toDate খালি রাখলেও চলবে — সেক্ষেত্রে সব data আসবে
    setApplied({ fromDate, toDate });
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setApplied({ fromDate: "", toDate: "" });
  };

  const isFiltered = Boolean(applied.fromDate || applied.toDate);

  const handleExportPDF = () => {
    if (!rows.length) {
      toast.warning("Export করার মতো কোনো data নেই");
      return;
    }
    const title = reportType === "expense" ? "Expense Statement" : "Income Statement";
    const periodLabel = isFiltered
      ? `Period: ${applied.fromDate || "..."} to ${applied.toDate || "..."}`
      : "Period: All";

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(periodLabel, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["Voucher No", "Date", "Description", "Amount"]],
    body: rows.map((r) => [
  r.VOUCHERNO,
  r.GL_ENTRY_DATE
    ? new Date(r.GL_ENTRY_DATE).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "",
  r.DESCRIPTION_WITH_CODE,
  formatAmount(r.AMOUNT),
]),
      foot: [["", "", "Total", formatAmount(total)]],
      headStyles: {
        fillColor: reportType === "expense" ? [153, 27, 27] : [21, 128, 61],
      },
      footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: "bold" },
    });

    const suffix = isFiltered
      ? `_${applied.fromDate || "all"}_to_${applied.toDate || "all"}`
      : "_all";
    doc.save(`${reportType}-statement${suffix}.pdf`);
  };

  return (
    <div className="space-y-4 mt-4">
      <Tabs
        value={reportType}
        onValueChange={(v) => setReportType(v)}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
      </Tabs>

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
          {isFetching ? <IconLoader2 className="mr-1 size-4 animate-spin" /> : null}
          Apply
        </Button>
        {isFiltered ? (
          <Button variant="ghost" onClick={handleClear} disabled={isFetching}>
            <IconX className="mr-1 size-4" />
            Clear
          </Button>
        ) : null}
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
          {error?.message || "Report load করতে সমস্যা হয়েছে"}
        </p>
      ) : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader
            className={reportType === "expense" ? "bg-red-900" : "bg-green-900"}
          >
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
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatAmount(total)}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IncomeExpenseReport;