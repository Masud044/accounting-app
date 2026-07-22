import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { useCashFlowSummary } from "./queries";

const selectClass =
  "text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

const fmt = (v) => Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const columns = [
  {
    accessorKey: "ROOT_ACCOUNT",
    header: "Root Account",
    cell: ({ row }) => {
      const isTotal = row.original.ROOT_ACCOUNT === "ZZZ_TOTAL";
      return (
        <span className={isTotal ? "font-bold text-slate-800" : "text-slate-500 text-xs"}>
          {isTotal ? "" : row.getValue("ROOT_ACCOUNT")}
        </span>
      );
    },
  },
  {
    accessorKey: "ACCOUNT_NAME",
    header: "Account Name",
    cell: ({ row }) => {
      const isTotal = row.original.ROOT_ACCOUNT === "ZZZ_TOTAL";
      return (
        <span className={isTotal ? "font-bold text-slate-800 text-sm" : "text-slate-700 text-xs"}>
          {row.getValue("ACCOUNT_NAME")}
        </span>
      );
    },
  },
  {
    accessorKey: "CASH_IN",
    header: () => <div className="text-right">Cash In (Debit)</div>,
    cell: ({ row }) => {
      const isTotal = row.original.ROOT_ACCOUNT === "ZZZ_TOTAL";
      return (
        <div className={`text-right tabular-nums ${isTotal ? "font-bold text-emerald-700" : "text-emerald-600 text-xs"}`}>
          {fmt(row.getValue("CASH_IN"))}
        </div>
      );
    },
  },
  {
    accessorKey: "CASH_OUT",
    header: () => <div className="text-right">Cash Out (Credit)</div>,
    cell: ({ row }) => {
      const isTotal = row.original.ROOT_ACCOUNT === "ZZZ_TOTAL";
      return (
        <div className={`text-right tabular-nums ${isTotal ? "font-bold text-rose-700" : "text-rose-600 text-xs"}`}>
          {fmt(row.getValue("CASH_OUT"))}
        </div>
      );
    },
  },
  {
    accessorKey: "NET_CASH_FLOW",
    header: () => <div className="text-right">Net Cash Flow</div>,
    cell: ({ row }) => {
      const val = Number(row.getValue("NET_CASH_FLOW") || 0);
      const isTotal = row.original.ROOT_ACCOUNT === "ZZZ_TOTAL";
      const colorClass = val < 0 ? "text-rose-600" : "text-slate-800";
      return (
        <div className={`text-right tabular-nums ${isTotal ? "font-bold text-base " + (val < 0 ? "text-rose-700" : "text-emerald-700") : colorClass + " text-xs font-medium"}`}>
          {fmt(val)}
        </div>
      );
    },
  },
];

export default function CashFlowReport() {
  const today = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [toDate, setToDate] = useState(today);

  const { data: rows = [], isLoading, isError, error } = useCashFlowSummary(fromDate, toDate);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-card rounded-md shadow-sm p-4 mt-8">
      {/* Header + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Cash Flow Summary</h2>
          <p className="text-xs text-slate-400 mt-0.5">{fromDate} to {toDate}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-500">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={selectClass}
          />
          <label className="text-xs text-slate-500">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={selectClass}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="py-2 text-xs">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-slate-400 text-xs">
                  Loading...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-rose-500 text-xs">
                  {error?.message || "Failed to load report."}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const isTotal = row.original.ROOT_ACCOUNT === "ZZZ_TOTAL";
                return (
                  <TableRow
                    key={row.id}
                    className={isTotal ? "bg-slate-50 border-t-2 border-slate-300" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-slate-400 text-xs">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}