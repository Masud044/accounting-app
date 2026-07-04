import { useState } from "react";
import {
  flexRender, getCoreRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useInvoiceDashboard } from "./queries";

const MONTHS = [
  { label: "All", value: "" },
  { label: "January", value: 1 },  { label: "February", value: 2 },
  { label: "March", value: 3 },    { label: "April", value: 4 },
  { label: "May", value: 5 },      { label: "June", value: 6 },
  { label: "July", value: 7 },     { label: "August", value: 8 },
  { label: "September", value: 9 },{ label: "October", value: 10 },
  { label: "November", value: 11 },{ label: "December", value: 12 },
];

// const currentYear = new Date().getFullYear();
// const YEARS = [
//   { label: "All", value: "" },
//   ...Array.from({ length: 5 }, (_, i) => ({
//     label: String(currentYear - i),
//     value: currentYear - i,
//   })),
// ];

const currentYear  = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

// current year থেকে শুরু করে 2030 পর্যন্ত (আগের বছর বাদ)
const YEARS = Array.from(
  { length: 2030 - currentYear + 1 },
  (_, i) => {
    const y = currentYear + i;
    return { label: String(y), value: y };
  }
);

const selectClass =
  "text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

const columns = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: "GL_ENTRY_DATE",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Invoice Date <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-slate-500 text-xs">{row.getValue("GL_ENTRY_DATE")}</span>,
  },
  {
    accessorKey: "DESCRIPTION",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Customer <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="text-slate-700 text-xs">{row.getValue("DESCRIPTION")}</span>,
  },
  {
    accessorKey: "AMT",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Total Amount <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 text-xs">
        {Number(row.getValue("AMT")).toLocaleString()}
      </span>
    ),
  },
];

export default function InvoiceDashboardPanel() {
  const [filters, setFilters] = useState({
  month: currentMonth,
  year:  currentYear,
  date:  "",
});
  const [sorting, setSorting] = useState([]);

  const { data, isLoading } = useInvoiceDashboard(filters);
  const rows  = data?.rows  ?? [];
  const total = data?.total ?? 0;

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const handleMonthChange = (val) =>
    setFilters((prev) => ({ ...prev, month: val ? Number(val) : "", date: "" }));
  const handleYearChange = (val) =>
    setFilters((prev) => ({ ...prev, year: val ? Number(val) : "", date: "" }));
  const handleDateChange = (val) => {
    if (val) {
      const d = new Date(val);
      setFilters({ date: val, month: d.getMonth() + 1, year: d.getFullYear() });
    } else {
      setFilters((prev) => ({ ...prev, date: "" }));
    }
  };
  const handleClear = () => setFilters({ month: "", year: "", date: "" });

  const filterLabel = () => {
    if (filters.date) return filters.date;
    if (filters.month && filters.year)
      return `${MONTHS.find((m) => m.value === filters.month)?.label} ${filters.year}`;
    if (filters.month) return MONTHS.find((m) => m.value === filters.month)?.label;
    if (filters.year)  return String(filters.year);
    return "All time";
  };

  return (
    <div className="bg-card rounded-md shadow-sm p-4 border-t-2 border-primary/20">
      <div className="space-y-3">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-primary">Sales Invoice Details</h2>
            <p className="text-xs text-slate-400 mt-0.5">{filterLabel()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <select value={filters.month} onChange={(e) => handleMonthChange(e.target.value)} className={selectClass}>
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>

            <select value={filters.year} onChange={(e) => handleYearChange(e.target.value)} className={selectClass}>
              {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className={selectClass}
            />

            {(filters.month || filters.year || filters.date) && (
              <button
                onClick={handleClear}
                className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto rounded-md border max-h-[420px]">
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
                  <TableCell colSpan={4} className="h-20 text-center text-slate-400 text-xs">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center text-slate-400 text-xs">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Total */}
        <div className="flex items-center justify-end pt-1">
          <p className="text-xs font-semibold text-slate-600">
            Total:{" "}
            <span className="font-bold text-primary">
              {Number(total).toLocaleString()} Taka
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}