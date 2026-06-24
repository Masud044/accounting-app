// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   ArrowUpRight, ArrowDownRight, Landmark,
//   TrendingUp, TrendingDown, Activity,
// } from "lucide-react";
// import { SectionContainer } from "@/components/SectionContainer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { cn } from "@/lib/utils";
// import axios from "axios";
// import MonthlyProductionChart from "@/features/egg-production/monthly-production-chart";
// import MonthlySummaryChart from "@/features/egg-production/monthy-summary-production";
// import DailyTrendChart from "@/features/egg-production/daily-trend";

// const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// const MONTHS = [
//   { label: "All", value: "" },
//   { label: "January", value: 1 }, { label: "February", value: 2 },
//   { label: "March", value: 3 },   { label: "April", value: 4 },
//   { label: "May", value: 5 },     { label: "June", value: 6 },
//   { label: "July", value: 7 },    { label: "August", value: 8 },
//   { label: "September", value: 9 },{ label: "October", value: 10 },
//   { label: "November", value: 11 },{ label: "December", value: 12 },
// ];

// const currentYear = new Date().getFullYear();
// const YEARS = [
//   { label: "All", value: "" },
//   ...Array.from({ length: 5 }, (_, i) => ({
//     label: String(currentYear - i),
//     value: currentYear - i,
//   })),
// ];

// const DashboardHome = () => {
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [activeTab, setActiveTab] = useState("expense"); // "expense" | "income"

//   // Cash Balance
//   const { data: cash = {} } = useQuery({
//     queryKey: ["cash"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/dashboard-cash/balance/1020010001`);
//       return res.data.success ? res.data : {};
//     },
//   });

//   // Expenses
//   const { data: expenses = {}, isLoading: expLoading } = useQuery({
//     queryKey: ["expenses", selectedMonth, selectedYear],
//     queryFn: async () => {
//       const params = {};
//       if (selectedMonth) params.month = selectedMonth;
//       if (selectedYear)  params.year  = selectedYear;
//       const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, { params });
//       return res.data.success ? res.data : {};
//     },
//   });

//   // Income
//   const { data: income = {}, isLoading: incLoading } = useQuery({
//     queryKey: ["income", selectedMonth, selectedYear],
//     queryFn: async () => {
//       const params = {};
//       if (selectedMonth) params.month = selectedMonth;
//       if (selectedYear)  params.year  = selectedYear;
//       const res = await axios.get(`${url}/api/dashboard-income/breakdown`, { params });
//       return res.data.success ? res.data : {};
//     },
//   });

//   const filterLabel =
//     selectedMonth && selectedYear
//       ? `${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`
//       : selectedMonth
//       ? MONTHS.find((m) => m.value === selectedMonth)?.label
//       : selectedYear
//       ? String(selectedYear)
//       : "All time";

//   const getTheme = (type) => {
//     switch (type) {
//       case "income":  return { cardBg: "bg-[#F0FDF4] border-emerald-100/50", iconBg: "bg-emerald-100 text-emerald-600", badgeBg: "bg-emerald-100/50 text-emerald-700", trendIcon: TrendingUp };
//       case "expense": return { cardBg: "bg-[#FFF1F2] border-rose-100/50",    iconBg: "bg-rose-100 text-rose-600",       badgeBg: "bg-rose-100/50 text-rose-700",    trendIcon: TrendingDown };
//       case "balance": return { cardBg: "bg-[#F5F3FF] border-violet-100/50",  iconBg: "bg-violet-100 text-violet-600",   badgeBg: "bg-violet-100/50 text-violet-700", trendIcon: Activity };
//       default: return {};
//     }
//   };

//   const StatCard = ({ title, value, icon: Icon, type, onClick, active }) => {
//     const theme = getTheme(type);
//     const TrendIcon = theme.trendIcon;
//     return (
//       <Card
//         onClick={onClick}
//         className={cn(
//           "border shadow-sm transition-all duration-300 hover:shadow-md",
//           onClick ? "cursor-pointer" : "",
//           active ? "ring-2 ring-offset-2 ring-slate-400" : "",
//           theme.cardBg
//         )}
//       >
//         <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
//           <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
//           <div className={cn("p-2 rounded-full transition-transform hover:scale-110", theme.iconBg)}>
//             <Icon size={18} strokeWidth={2.5} />
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-baseline space-x-2">
//             <span className="text-3xl font-bold tracking-tight text-slate-900">
//               {Number(value || 0).toLocaleString()}
//             </span>
//             <span className="text-sm font-semibold text-slate-500">Taka</span>
//           </div>
//           <div className="mt-5">
//             <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-black/5", theme.badgeBg)}>
//               <TrendIcon size={12} className="mr-1.5" strokeWidth={3} />
//               {filterLabel}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   // Active tab এর rows
//   const activeRows = activeTab === "expense"
//     ? (expenses?.data?.rows ?? [])
//     : (income?.data?.rows ?? []);
//   const isLoading = activeTab === "expense" ? expLoading : incLoading;

//   return (
//     <SectionContainer>
//       <div className="py-5 space-y-6 bg-slate-50/30 min-h-screen">

//         {/* Filter Row */}
//         {/* <div className="flex items-center gap-3">
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : "")}
//             className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
//           >
//             {MONTHS.map((m) => (
//               <option key={m.value} value={m.value}>{m.label}</option>
//             ))}
//           </select>

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : "")}
//             className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
//           >
//             {YEARS.map((y) => (
//               <option key={y.value} value={y.value}>{y.label}</option>
//             ))}
//           </select>
//         </div> */}

//         {/* Stats Grid */}
//         <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
//           <StatCard
//             title="Money Income"
//             value={income?.data?.total}
//             icon={ArrowUpRight}
//             type="income"
//             onClick={() => setActiveTab("income")}
//             active={activeTab === "income"}
//           />
//           <StatCard
//             title="Money Expenses"
//             value={expenses?.data?.total}
//             icon={ArrowDownRight}
//             type="expense"
//             onClick={() => setActiveTab("expense")}
//             active={activeTab === "expense"}
//           />
//           <StatCard
//             title="Banking Balance"
//             value={cash?.data?.balance}
//             icon={Landmark}
//             type="balance"
//           />
//         </div>

//         {/* Details Table */}
//         <Card className="border shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between pb-3">
//             <CardTitle className="text-base font-semibold text-slate-700">
//               {activeTab === "expense" ? "Expense Details" : "Income Details"}
//               <span className="ml-2 text-xs font-normal text-slate-400">({filterLabel})</span>
//             </CardTitle>

//             {/* Tab Switch */}
//             <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
//               <button
//                 onClick={() => setActiveTab("expense")}
//                 className={cn(
//                   "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
//                   activeTab === "expense"
//                     ? "bg-white text-rose-600 shadow-sm"
//                     : "text-slate-500 hover:text-slate-700"
//                 )}
//               >
//                 Expense
//               </button>
//               <button
//                 onClick={() => setActiveTab("income")}
//                 className={cn(
//                   "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
//                   activeTab === "income"
//                     ? "bg-white text-emerald-600 shadow-sm"
//                     : "text-slate-500 hover:text-slate-700"
//                 )}
//               >
//                 Income
//               </button>
//             </div>
//           </CardHeader>

//           <CardContent className="p-0">
//             {isLoading ? (
//               <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
//                 Loading...
//               </div>
//             ) : activeRows.length === 0 ? (
//               <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
//                 No data found
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b border-slate-100 bg-slate-50">
//                       {/* <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th> */}
//                       <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
//                       <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (Taka)</th>
//                       <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {activeRows.map((row, idx) => (
//                       <tr key={idx} className="hover:bg-slate-50 transition-colors">
//                         {/* <td className="px-6 py-3 text-slate-400">{idx + 1}</td> */}
//                         <td className="px-6 py-3 text-slate-700">{row.DESCRIPTION}</td>
//                         <td className="px-6 py-3 text-right font-medium text-slate-800">
//                           {Number(row.AMT).toLocaleString()}
//                         </td>
//                         <td className="px-6 py-3 text-right text-slate-500">{row.GL_ENTRY_DATE}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   {/* Total Row */}
//                   <tfoot>
//                     <tr className="border-t-2 border-slate-200 bg-slate-50">
//                       <td colSpan={2} className="px-6 py-3 text-sm font-semibold text-slate-600">Total</td>
//                       <td className="px-6 py-3 text-right font-bold text-slate-900">
//                         {Number(
//                           activeTab === "expense"
//                             ? expenses?.data?.total
//                             : income?.data?.total
//                         ).toLocaleString()}
//                       </td>
//                       <td />
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Charts */}
//         <div className="grid grid-cols-3 gap-4">
//           <MonthlyProductionChart />
//           <MonthlySummaryChart />
//           <DailyTrendChart />
//         </div>

//       </div>
//     </SectionContainer>
//   );
// };

// export default DashboardHome;


import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpRight, ArrowDownRight, Landmark,
  TrendingUp, TrendingDown, Activity, ArrowUpDown,
} from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/DataTablePagination";
import { cn } from "@/lib/utils";
import axios from "axios";
import MonthlyProductionChart from "@/features/egg-production/monthly-production-chart";
import MonthlySummaryChart from "@/features/egg-production/monthy-summary-production";
import DailyTrendChart from "@/features/egg-production/daily-trend";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MONTHS = [
  { label: "All", value: "" },
  { label: "January", value: 1 },  { label: "February", value: 2 },
  { label: "March", value: 3 },    { label: "April", value: 4 },
  { label: "May", value: 5 },      { label: "June", value: 6 },
  { label: "July", value: 7 },     { label: "August", value: 8 },
  { label: "September", value: 9 },{ label: "October", value: 10 },
  { label: "November", value: 11 },{ label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const YEARS = [
  { label: "All", value: "" },
  ...Array.from({ length: 5 }, (_, i) => ({
    label: String(currentYear - i),
    value: currentYear - i,
  })),
];

// ── Columns ────────────────────────────────────────────────────────────────
const expenseColumns = [
  // {
  //   id: "index",
  //   header: "#",
  //   cell: ({ row, table }) => {
  //     const pageIndex = table.getState().pagination.pageIndex;
  //     const pageSize  = table.getState().pagination.pageSize;
  //     return pageIndex * pageSize + row.index + 1;
  //   },
  //   enableSorting: false,
  // },
  {
    accessorKey: "DESCRIPTION",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-slate-700 ml-2">{row.getValue("DESCRIPTION")}</span>
    ),
  },
  {
    accessorKey: "AMT",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount (Taka) <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 ml-2">
        {Number(row.getValue("AMT")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "GL_ENTRY_DATE",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-slate-500 ml-2">{row.getValue("GL_ENTRY_DATE")}</span>
    ),
  },
];

// ── Main Component ─────────────────────────────────────────────────────────
const DashboardHome = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear,  setSelectedYear]  = useState("");
  const [activeTab,     setActiveTab]     = useState("expense");
  const [sorting,       setSorting]       = useState([]);

  // Cash
  const { data: cash = {} } = useQuery({
    queryKey: ["cash"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-cash/balance/1020010001`);
      return res.data.success ? res.data : {};
    },
  });

  // Expenses
  const { data: expenses = {}, isLoading: expLoading } = useQuery({
    queryKey: ["expenses", selectedMonth, selectedYear],
    queryFn: async () => {
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear)  params.year  = selectedYear;
      const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, { params });
      return res.data.success ? res.data : {};
    },
  });

  // Income
  const { data: income = {}, isLoading: incLoading } = useQuery({
    queryKey: ["income", selectedMonth, selectedYear],
    queryFn: async () => {
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear)  params.year  = selectedYear;
      const res = await axios.get(`${url}/api/dashboard-income/breakdown`, { params });
      return res.data.success ? res.data : {};
    },
  });

  const activeRows  = activeTab === "expense"
    ? (expenses?.data?.rows ?? [])
    : (income?.data?.rows  ?? []);
  const activeTotal = activeTab === "expense"
    ? expenses?.data?.total
    : income?.data?.total;
  const isLoading = activeTab === "expense" ? expLoading : incLoading;

  // ── TanStack Table ─────────────────────────────────────────────────────
  const table = useReactTable({
    data: activeRows,
    columns: expenseColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
    autoResetPageIndex: false,
  });

  const filterLabel =
    selectedMonth && selectedYear
      ? `${MONTHS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`
      : selectedMonth
      ? MONTHS.find((m) => m.value === selectedMonth)?.label
      : selectedYear
      ? String(selectedYear)
      : "All time";

  const getTheme = (type) => {
    switch (type) {
      case "income":  return { cardBg: "bg-[#F0FDF4] border-emerald-100/50", iconBg: "bg-emerald-100 text-emerald-600", badgeBg: "bg-emerald-100/50 text-emerald-700", trendIcon: TrendingUp };
      case "expense": return { cardBg: "bg-[#FFF1F2] border-rose-100/50",    iconBg: "bg-rose-100 text-rose-600",       badgeBg: "bg-rose-100/50 text-rose-700",    trendIcon: TrendingDown };
      case "balance": return { cardBg: "bg-[#F5F3FF] border-violet-100/50",  iconBg: "bg-violet-100 text-violet-600",   badgeBg: "bg-violet-100/50 text-violet-700", trendIcon: Activity };
      default: return {};
    }
  };

  const StatCard = ({ title, value, icon: Icon, type, onClick, active }) => {
    const theme = getTheme(type);
    const TrendIcon = theme.trendIcon;
    return (
      <Card
        onClick={onClick}
        className={cn(
          "border shadow-sm transition-all duration-300 hover:shadow-md",
          onClick ? "cursor-pointer" : "",
          active  ? "ring-2 ring-offset-2 ring-slate-400" : "",
          theme.cardBg
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={cn("p-2 rounded-full transition-transform hover:scale-110", theme.iconBg)}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {Number(value || 0).toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-slate-500">Taka</span>
          </div>
          <div className="mt-5">
            <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-black/5", theme.badgeBg)}>
              <TrendIcon size={12} className="mr-1.5" strokeWidth={3} />
              {filterLabel}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SectionContainer>
      <div className="py-5 space-y-6 bg-slate-50/30 min-h-screen">

        {/* Filter */}
        {/* <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : "")}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : "")}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
          </select>
        </div> */}

        {/* Stat Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <StatCard
            title="Money Income"
            value={income?.data?.total}
            icon={ArrowUpRight}
            type="income"
            onClick={() => setActiveTab("income")}
            active={activeTab === "income"}
          />
          <StatCard
            title="Money Expenses"
            value={expenses?.data?.total}
            icon={ArrowDownRight}
            type="expense"
            onClick={() => setActiveTab("expense")}
            active={activeTab === "expense"}
          />
          <StatCard
            title="Banking Balance"
            value={cash?.data?.balance}
            icon={Landmark}
            type="balance"
          />
        </div>

        {/* Details Table */}
        <div className="bg-card rounded-md shadow-sm p-4">
          <div className="space-y-4">

            {/* Table Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-700">
                {activeTab === "expense" ? "Expense Details" : "Income Details"}
                <span className="ml-2 text-xs font-normal text-slate-400">({filterLabel})</span>
              </h2>

              {/* Tab Switch */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("expense")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    activeTab === "expense"
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Expense
                </button>
                <button
                  onClick={() => setActiveTab("income")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    activeTab === "income"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>
                          {h.isPlaceholder
                            ? null
                            : flexRender(h.column.columnDef.header, h.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-400 text-sm">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-400 text-sm">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Total + Pagination */}
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm font-semibold text-slate-600">
                Total:{" "}
                <span className="text-slate-900">
                  {Number(activeTotal || 0).toLocaleString()} Taka
                </span>
              </p>
              <DataTablePagination table={table} />
            </div>

          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-4">
          <MonthlyProductionChart />
          <MonthlySummaryChart />
          <DailyTrendChart />
        </div>

      </div>
    </SectionContainer>
  );
};

export default DashboardHome;