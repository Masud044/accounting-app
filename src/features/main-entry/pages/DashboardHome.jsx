// // import React, { useState } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import {
// //   flexRender,
// //   getCoreRowModel,
  
// //   getSortedRowModel,
// //   useReactTable,
// // } from "@tanstack/react-table";
// // import {
// //   ArrowUpRight, ArrowDownRight, Landmark,
// //   TrendingUp, TrendingDown, Activity, ArrowUpDown,
// // } from "lucide-react";
// // import { SectionContainer } from "@/components/SectionContainer";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Table, TableBody, TableCell, TableHead,
// //   TableHeader, TableRow,
// // } from "@/components/ui/table";
// // import { cn } from "@/lib/utils";
// // import axios from "axios";
// // // import MonthlyProductionChart from "@/features/egg-production/monthly-production-chart";
// // // import MonthlySummaryChart from "@/features/egg-production/monthy-summary-production";
// // // import DailyTrendChart from "@/features/egg-production/daily-trend";
// // // import ApprovalDashboardPage from "@/features/purchase-recognition/recognition-approval-dashboard";
// // // import InvoiceDashboardPanel from "@/features/sale-invoice/invoice-dashboard-panel";
// // // import InvoiceMonthlyChart from "@/features/sale-invoice/invoice-monthly-chart";

// // // import InvoiceDailyTrendChart from "@/features/sale-invoice/invoice-daily-chart";
// // // import InvoiceSalesDashboard from "@/features/sale-invoice/invoice-sale-dashboard";
// // // import FinancialDashboardPage from "./financial-dashboard-page";
// // // import MonthlyDebitChart from "@/features/dashboad-debit-gl/monthly-debit-summary";
// // // import CashFlowReport from "@/features/dashboad-debit-gl/cashflow-statement";
// // // import ChartListView from "../chart-account/dashboard-chart-list";

// // const url = import.meta.env.VITE_API_BASE_URL ;

// // const MONTHS = [
// //   { label: "All", value: "" },
// //   { label: "January", value: 1 },  { label: "February", value: 2 },
// //   { label: "March", value: 3 },    { label: "April", value: 4 },
// //   { label: "May", value: 5 },      { label: "June", value: 6 },
// //   { label: "July", value: 7 },     { label: "August", value: 8 },
// //   { label: "September", value: 9 },{ label: "October", value: 10 },
// //   { label: "November", value: 11 },{ label: "December", value: 12 },
// // ];

// // // const currentYear = new Date().getFullYear();
// // // const YEARS = [
// // //   { label: "All", value: "" },
// // //   ...Array.from({ length: 5 }, (_, i) => ({
// // //     label: String(currentYear - i),
// // //     value: currentYear - i,
// // //   })),
// // // ];

// // const currentYear  = new Date().getFullYear();
// // // const currentMonth = new Date().getMonth() + 1;
// // // const yearOptions  = Array.from({ length: 5 }, (_, i) => currentYear - i);
// // const YEARS = Array.from(
// //   { length: 2030 - currentYear + 1 },
// //   (_, i) => {
// //     const y = currentYear + i;
// //     return { label: String(y), value: y };
// //   }
// // );

// // const formatDate = (value) => {
// //   if (!value) return "—";
// //   // GL_ENTRY_DATE ধরে নিচ্ছি "YYYY-MM-DD" বা ISO string আকারে আসছে
// //   const d = new Date(value);
// //   if (isNaN(d.getTime())) return String(value); // parse fail হলে raw value দেখাবে

// //   const day   = String(d.getDate()).padStart(2, "0");
// //   const month = d.toLocaleString("en-US", { month: "short" }); // Aug
// //   const year  = d.getFullYear();

// //   return `${month} ${day} ${year}`; // → Aug 01 2026
// // };


// // const makeColumns = () => [
// //   {
// //     id: "index",
// //     header: "#",
// //     cell: ({ row, table }) => {
// //       const { pageIndex, pageSize } = table.getState().pagination;
// //       return pageIndex * pageSize + row.index + 1;
// //     },
// //     enableSorting: false,
// //   },
// //    {
// //   accessorKey: "GL_ENTRY_DATE",
// //   header: ({ column }) => (
// //     <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// //       Date <ArrowUpDown className="ml-1 h-3 w-3" />
// //     </Button>
// //   ),
// //   cell: ({ row }) => (
// //     <span >
// //       {formatDate(row.getValue("GL_ENTRY_DATE"))}
// //     </span>
// //   ),
// // },
// //   {
// //     accessorKey: "DESCRIPTION",
// //     header: ({ column }) => (
// //       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// //         Description <ArrowUpDown className="ml-1 h-3 w-3" />
// //       </Button>
// //     ),
// //     cell: ({ row }) => <span >{row.getValue("DESCRIPTION")}</span>,
// //   },
// //   {
// //     accessorKey: "AMT",
// //     header: ({ column }) => (
// //       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
// //         Amount <ArrowUpDown className="ml-1 h-3 w-3" />
// //       </Button>
// //     ),
// //     cell: ({ row }) => (
// //       <span >
// //         {Number(row.getValue("AMT")).toLocaleString()}
// //       </span>
// //     ),
// //   },
 
// // ];

// // const selectClass =
// //   "text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

// // const DataPanel = ({ title, type, filters, setFilters, data, isLoading }) => {
// //   const [sorting, setSorting] = useState([]);

// //   const rows  = data?.data?.rows  ?? [];
// //   const total = data?.data?.total ?? 0;

// //   // pagination ছাড়া — সব row একসাথে
// //   const table = useReactTable({
// //     data: rows,
// //     columns: makeColumns(),
// //     getCoreRowModel: getCoreRowModel(),
// //     getSortedRowModel: getSortedRowModel(),
// //     onSortingChange: setSorting,
// //     state: { sorting },
// //   });

// //   const handleMonthChange = (val) => {
// //     setFilters((prev) => ({ ...prev, month: val ? Number(val) : "", date: "" }));
// //   };
// //   const handleYearChange = (val) => {
// //     setFilters((prev) => ({ ...prev, year: val ? Number(val) : "", date: "" }));
// //   };
// //   const handleDateChange = (val) => {
// //     if (val) {
// //       const d = new Date(val);
// //       setFilters({ date: val, month: d.getMonth() + 1, year: d.getFullYear() });
// //     } else {
// //       setFilters((prev) => ({ ...prev, date: "" }));
// //     }
// //   };
// //   // const handleClear = () => setFilters({ month: "", year: "", date: "" });
// //   const handleClear = () =>
// //   setFilters({
// //     month: new Date().getMonth() + 1,
// //     year:  currentYear,
// //     date:  "",
// //   });

// //   const filterLabel = () => {
// //     if (filters.date) return filters.date;
// //     if (filters.month && filters.year)
// //       return `${MONTHS.find((m) => m.value === filters.month)?.label} ${filters.year}`;
// //     if (filters.month) return MONTHS.find((m) => m.value === filters.month)?.label;
// //     if (filters.year)  return String(filters.year);
// //     return "All time";
// //   };

// //   // const accentColor  = type === "expense" ? "text-rose-600"    : "text-emerald-600";
// //   const borderTop    = type === "expense" ? "border-rose-200"   : "border-emerald-200";
// //   const totalColor   = type === "expense" ? "text-rose-700"     : "text-emerald-700";

// //   return (
// //     <div className={`bg-card rounded-md shadow-sm p-4 border-t-2 ${borderTop}`}>
// //       <div className="space-y-3">

// //         {/* Header */}
// //         <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
// //           <div>
// //             <h2 className="font-semibold">{title}</h2>
// //             <p className=" mt-0.5">{filterLabel()}</p>
// //           </div>

// //           <div className="flex flex-wrap items-center gap-1.5">
// //             <select value={filters.month} onChange={(e) => handleMonthChange(e.target.value)} className={selectClass}>
// //               {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
// //             </select>

// //             <select value={filters.year} onChange={(e) => handleYearChange(e.target.value)} className={selectClass}>
// //               {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
// //             </select>

// //             <input
// //               type="date"
// //               value={filters.date}
// //               onChange={(e) => handleDateChange(e.target.value)}
// //               className={selectClass}
// //             />

// //             {(filters.month || filters.year || filters.date) && (
// //               <button
// //                 onClick={handleClear}
// //                 className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
// //               >
// //                 ✕
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Table — no pagination, সব row */}
// //         <div className="overflow-auto rounded-md border max-h-[420px]">
// //           <Table>
// //             <TableHeader className="sticky top-0  z-10">
// //               {table.getHeaderGroups().map((hg) => (
// //                 <TableRow key={hg.id}>
// //                   {hg.headers.map((h) => (
// //                     <TableHead key={h.id} className="py-2 text-xs">
// //                       {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
// //                     </TableHead>
// //                   ))}
// //                 </TableRow>
// //               ))}
// //             </TableHeader>
// //             <TableBody>
// //               {isLoading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={4} className="h-20 text-center text-slate-400 text-xs">
// //                     Loading...
// //                   </TableCell>
// //                 </TableRow>
// //               ) : table.getRowModel().rows.length ? (
// //                 table.getRowModel().rows.map((row) => (
// //                   <TableRow key={row.id}>
// //                     {row.getVisibleCells().map((cell) => (
// //                       <TableCell key={cell.id} className="py-2">
// //                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
// //                       </TableCell>
// //                     ))}
// //                   </TableRow>
// //                 ))
// //               ) : (
// //                 <TableRow>
// //                   <TableCell colSpan={4} className="h-20 text-center text-slate-400 text-xs">
// //                     No data found
// //                   </TableCell>
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </div>

// //         {/* শুধু Total */}
// //         <div className="flex items-center justify-end pt-1">
// //           <p className="text-xs font-semibold text-slate-600">
// //             Total:{" "}
// //             <span className={`font-bold ${totalColor}`}>
// //               {Number(total).toLocaleString()} Taka
// //             </span>
// //           </p>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // // ── Main ──
// // const DashboardHome = () => {
// //  const currentMonth = new Date().getMonth() + 1;

// // const [expenseFilters, setExpenseFilters] = useState({
// //   month: currentMonth,
// //   year:  currentYear,
// //   date:  "",
// // });
// // const [incomeFilters, setIncomeFilters] = useState({
// //   month: currentMonth,
// //   year:  currentYear,
// //   date:  "",
// // });

// //   const { data: cash = {} } = useQuery({
// //     queryKey: ["cash"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/dashboard-cash/balance/1020010001`);
// //       return res.data.success ? res.data : {};
// //     },
// //   });

// //   const { data: expenses = {}, isLoading: expLoading } = useQuery({
// //     queryKey: ["expenses", expenseFilters],
// //     queryFn: async () => {
// //       const params = {};
// //       if (expenseFilters.date) params.date = expenseFilters.date;
// //       else {
// //         if (expenseFilters.month) params.month = expenseFilters.month;
// //         if (expenseFilters.year)  params.year  = expenseFilters.year;
// //       }
// //       const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, { params });
// //       return res.data.success ? res.data : {};
// //     },
// //   });

// //   const { data: income = {}, isLoading: incLoading } = useQuery({
// //     queryKey: ["income", incomeFilters],
// //     queryFn: async () => {
// //       const params = {};
// //       if (incomeFilters.date) params.date = incomeFilters.date;
// //       else {
// //         if (incomeFilters.month) params.month = incomeFilters.month;
// //         if (incomeFilters.year)  params.year  = incomeFilters.year;
// //       }
// //       const res = await axios.get(`${url}/api/dashboard-income/breakdown`, { params });
// //       return res.data.success ? res.data : {};
// //     },
// //   });

// //   const getTheme = (type) => {
// //     switch (type) {
// //       case "income":  return { cardBg: "bg-[#F0FDF4] border-emerald-100/50", iconBg: "bg-emerald-100 text-emerald-600", badgeBg: "bg-emerald-100/50 text-emerald-700", trendIcon: TrendingUp };
// //       case "expense": return { cardBg: "bg-[#FFF1F2] border-rose-100/50",    iconBg: "bg-rose-100 text-rose-600",       badgeBg: "bg-rose-100/50 text-rose-700",    trendIcon: TrendingDown };
// //       case "balance": return { cardBg: "bg-[#F5F3FF] border-violet-100/50",  iconBg: "bg-violet-100 text-violet-600",   badgeBg: "bg-violet-100/50 text-violet-700", trendIcon: Activity };
// //       default: return {};
// //     }
// //   };

// //   const StatCard = ({ title, value, icon: Icon, type }) => {
// //     const theme = getTheme(type);
// //     const TrendIcon = theme.trendIcon;
// //     return (
// //       <Card className={cn("border shadow-sm", theme.cardBg)}>
// //         <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
// //           <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
// //           <div className={cn("p-2 rounded-full", theme.iconBg)}>
// //             <Icon size={18} strokeWidth={2.5} />
// //           </div>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="flex items-baseline space-x-2">
// //             <span className="text-3xl font-bold tracking-tight text-slate-900">
// //               {Number(value || 0).toLocaleString()}
// //             </span>
// //             <span className="text-sm font-semibold text-slate-500">Taka</span>
// //           </div>
// //           <div className="mt-5">
// //             <div className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ring-black/5", theme.badgeBg)}>
// //               <TrendIcon size={12} className="mr-1.5" strokeWidth={3} />
// //               All time
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     );
// //   };

// //   return (
// //     <SectionContainer>
// //       <div className="mt-10">

// //         {/* Expense + Income Tables — আগে */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //           <DataPanel
// //             title="Expense Details"
// //             type="expense"
// //             filters={expenseFilters}
// //             setFilters={setExpenseFilters}
// //             data={expenses}
// //             isLoading={expLoading}
// //           />
// //           <DataPanel
// //             title="Income Details"
// //             type="income"
// //             filters={incomeFilters}
// //             setFilters={setIncomeFilters}
// //             data={income}
// //             isLoading={incLoading}
// //           />
// //         </div>

// //         {/* Stat Cards — পরে */}
// //         {/* <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
// //           <StatCard title="Money Income"    value={income?.data?.total}   icon={ArrowUpRight}   type="income"  />
// //           <StatCard title="Money Expenses"  value={expenses?.data?.total} icon={ArrowDownRight}  type="expense" />
// //           <StatCard title="Banking Balance" value={cash?.data?.balance}   icon={Landmark}        type="balance" />
// //         </div> */}

// //         {/* Charts
// //         <div className="grid grid-cols-3 gap-4">
// //           <MonthlyProductionChart />
// //           <MonthlySummaryChart />
// //           <DailyTrendChart />
// //         </div> */}
// //         {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //   <InvoiceDashboardPanel className="col-span-2"/>
// //   <InvoiceMonthlyChart />
// //   <InvoiceDailyTrendChart></InvoiceDailyTrendChart>
// // </div> */}

// // {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //   <InvoiceDashboardPanel  />
// //   <InvoiceMonthlyChart />
// //   <InvoiceDailyTrendChart  />
// // </div> */}
// //         {/* <div>
// //           <ApprovalDashboardPage></ApprovalDashboardPage>
// //         </div>
// //         <div>
// //          <InvoiceSalesDashboard></InvoiceSalesDashboard>
// //         </div> */}
// //         {/* <div>
// //           <ChartListView></ChartListView>
// //         <FinancialDashboardPage></FinancialDashboardPage>
// //         <MonthlyDebitChart></MonthlyDebitChart>
// //         <CashFlowReport></CashFlowReport>
// //         </div> */}

// //       </div>
// //     </SectionContainer>
// //   );
// // };

// // export default DashboardHome;


// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   flexRender,
//   getCoreRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ArrowUpRight, ArrowDownRight, Landmark,
//   TrendingUp, TrendingDown, Activity, ArrowUpDown,
// } from "lucide-react";
// import { SectionContainer } from "@/components/SectionContainer";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Table, TableBody, TableCell, TableHead,
//   TableHeader, TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { cn } from "@/lib/utils";
// import axios from "axios";

// const url = import.meta.env.VITE_API_BASE_URL;

// const MONTHS = [
//   { label: "All", value: "" },
//   { label: "January", value: 1 },  { label: "February", value: 2 },
//   { label: "March", value: 3 },    { label: "April", value: 4 },
//   { label: "May", value: 5 },      { label: "June", value: 6 },
//   { label: "July", value: 7 },     { label: "August", value: 8 },
//   { label: "September", value: 9 },{ label: "October", value: 10 },
//   { label: "November", value: 11 },{ label: "December", value: 12 },
// ];

// const currentYear = new Date().getFullYear();
// const YEARS = Array.from(
//   { length: 2030 - currentYear + 1 },
//   (_, i) => {
//     const y = currentYear + i;
//     return { label: String(y), value: y };
//   }
// );

// const formatDate = (value) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return String(value);

//   const day   = String(d.getDate()).padStart(2, "0");
//   const month = d.toLocaleString("en-US", { month: "short" });
//   const year  = d.getFullYear();

//   return `${month} ${day} ${year}`;
// };

// // ── Income er jonno column — Account name nai ──
// const makeIncomeColumns = () => [
//   {
//     id: "index",
//     header: "#",
//     cell: ({ row, table }) => {
//       const { pageIndex, pageSize } = table.getState().pagination;
//       return pageIndex * pageSize + row.index + 1;
//     },
//     enableSorting: false,
//   },
//   {
//     accessorKey: "GL_ENTRY_DATE",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Date <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <span className="whitespace-nowrap">{formatDate(row.getValue("GL_ENTRY_DATE"))}</span>
//     ),
//   },
//   {
//     accessorKey: "DESCRIPTION",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Description <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => <span>{row.getValue("DESCRIPTION")}</span>,
//   },
//   {
//     accessorKey: "AMT",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Amount <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <span className="whitespace-nowrap font-medium">{Number(row.getValue("AMT")).toLocaleString()}</span>
//     ),
//   },
// ];

// // ── Expense er jonom column — Account name shoho ──
// const makeExpenseColumns = () => [
//   {
//     id: "index",
//     header: "#",
//     cell: ({ row, table }) => {
//       const { pageIndex, pageSize } = table.getState().pagination;
//       return pageIndex * pageSize + row.index + 1;
//     },
//     enableSorting: false,
//   },
//   {
//     accessorKey: "GL_ENTRY_DATE",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Date <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <span className="whitespace-nowrap">{formatDate(row.getValue("GL_ENTRY_DATE"))}</span>
//     ),
//   },
//   {
//     accessorKey: "ACCOUNT_NAME",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Account <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("ACCOUNT_NAME") || "—"}</span>,
//   },
//   {
//     accessorKey: "DESCRIPTION",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Description <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => <span>{row.getValue("DESCRIPTION")}</span>,
//   },
//   {
//     accessorKey: "AMT",
//     header: ({ column }) => (
//       <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
//         Amount <ArrowUpDown className="ml-1 h-3 w-3" />
//       </Button>
//     ),
//     cell: ({ row }) => (
//       <span className="whitespace-nowrap font-medium">{Number(row.getValue("AMT")).toLocaleString()}</span>
//     ),
//   },
// ];

// const selectClass =
//   "text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

// // ── Table + total — columns props diye income/expense duitai reuse korbe ──
// const DataTable = ({ rows, total, isLoading, totalColor, columns, colCount }) => {
//   const [sorting, setSorting] = useState([]);

//   const table = useReactTable({
//     data: rows,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//     state: { sorting },
//   });

//   return (
//     <div className="space-y-3">
//       <div className="rounded-md border overflow-y-auto overflow-x-auto max-h-[420px]">
//         <Table className="min-w-full">
//           <TableHeader className="sticky top-0 z-10 bg-white">
//             {table.getHeaderGroups().map((hg) => (
//               <TableRow key={hg.id}>
//                 {hg.headers.map((h) => (
//                   <TableHead key={h.id} className="py-2 text-xs whitespace-nowrap">
//                     {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={colCount} className="h-20 text-center text-slate-400 text-xs">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id} className="py-2">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={colCount} className="h-20 text-center text-slate-400 text-xs">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-end pt-1">
//         <p className="text-xs font-semibold text-slate-600">
//           Total:{" "}
//           <span className={`font-bold ${totalColor}`}>
//             {Number(total).toLocaleString()} Taka
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// // ── Income Details panel — age jerokom chilo, shudhu column set-e Account nai ──
// const DataPanel = ({ title, type, filters, setFilters, data, isLoading }) => {
//   const rows  = data?.data?.rows  ?? [];
//   const total = data?.data?.total ?? 0;
//   const columns = makeIncomeColumns();

//   const handleMonthChange = (val) => {
//     setFilters((prev) => ({ ...prev, month: val ? Number(val) : "", date: "" }));
//   };
//   const handleYearChange = (val) => {
//     setFilters((prev) => ({ ...prev, year: val ? Number(val) : "", date: "" }));
//   };
//   const handleDateChange = (val) => {
//     if (val) {
//       const d = new Date(val);
//       setFilters({ date: val, month: d.getMonth() + 1, year: d.getFullYear() });
//     } else {
//       setFilters((prev) => ({ ...prev, date: "" }));
//     }
//   };
//   const handleClear = () =>
//     setFilters({
//       month: new Date().getMonth() + 1,
//       year:  currentYear,
//       date:  "",
//     });

//   const filterLabel = () => {
//     if (filters.date) return filters.date;
//     if (filters.month && filters.year)
//       return `${MONTHS.find((m) => m.value === filters.month)?.label} ${filters.year}`;
//     if (filters.month) return MONTHS.find((m) => m.value === filters.month)?.label;
//     if (filters.year)  return String(filters.year);
//     return "All time";
//   };

//   const borderTop  = type === "expense" ? "border-rose-200"   : "border-emerald-200";
//   const totalColor = type === "expense" ? "text-rose-700"     : "text-emerald-700";

//   return (
//     <div className={`bg-card rounded-md shadow-sm p-4 border-t-2 ${borderTop}`}>
//       <div className="space-y-3">

//         <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
//           <div>
//             <h2 className="font-semibold">{title}</h2>
//             <p className="mt-0.5">{filterLabel()}</p>
//           </div>

//           <div className="flex flex-wrap items-center gap-1.5">
//             <select value={filters.month} onChange={(e) => handleMonthChange(e.target.value)} className={selectClass}>
//               {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
//             </select>

//             <select value={filters.year} onChange={(e) => handleYearChange(e.target.value)} className={selectClass}>
//               {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
//             </select>

//             <input
//               type="date"
//               value={filters.date}
//               onChange={(e) => handleDateChange(e.target.value)}
//               className={selectClass}
//             />

//             {(filters.month || filters.year || filters.date) && (
//               <button
//                 onClick={handleClear}
//                 className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         <DataTable rows={rows} total={total} isLoading={isLoading} totalColor={totalColor} columns={columns} colCount={4} />

//       </div>
//     </div>
//   );
// };

// // ── Expense Details panel — same filter bar, niche tab diye Project / Other switch ──
// const ExpenseDetailsPanel = ({ filters, setFilters, expenseSplit, isLoading }) => {
//   const columns = makeExpenseColumns();

//   const handleMonthChange = (val) => {
//     setFilters((prev) => ({ ...prev, month: val ? Number(val) : "", date: "" }));
//   };
//   const handleYearChange = (val) => {
//     setFilters((prev) => ({ ...prev, year: val ? Number(val) : "", date: "" }));
//   };
//   const handleDateChange = (val) => {
//     if (val) {
//       const d = new Date(val);
//       setFilters({ date: val, month: d.getMonth() + 1, year: d.getFullYear() });
//     } else {
//       setFilters((prev) => ({ ...prev, date: "" }));
//     }
//   };
//   const handleClear = () =>
//     setFilters({
//       month: new Date().getMonth() + 1,
//       year:  currentYear,
//       date:  "",
//     });

//   const filterLabel = () => {
//     if (filters.date) return filters.date;
//     if (filters.month && filters.year)
//       return `${MONTHS.find((m) => m.value === filters.month)?.label} ${filters.year}`;
//     if (filters.month) return MONTHS.find((m) => m.value === filters.month)?.label;
//     if (filters.year)  return String(filters.year);
//     return "All time";
//   };

//   const projectRows  = expenseSplit?.project?.rows  ?? [];
//   const projectTotal = expenseSplit?.project?.total ?? 0;
//   const otherRows    = expenseSplit?.other?.rows    ?? [];
//   const otherTotal   = expenseSplit?.other?.total   ?? 0;

//   return (
//     <div className="bg-card rounded-md shadow-sm p-4 border-t-2 border-rose-200">
//       <div className="space-y-3">

//         <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
//           <div>
//             <h2 className="font-semibold">Expense Details</h2>
//             <p className="mt-0.5">{filterLabel()}</p>
//           </div>

//           <div className="flex flex-wrap items-center gap-1.5">
//             <select value={filters.month} onChange={(e) => handleMonthChange(e.target.value)} className={selectClass}>
//               {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
//             </select>

//             <select value={filters.year} onChange={(e) => handleYearChange(e.target.value)} className={selectClass}>
//               {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
//             </select>

//             <input
//               type="date"
//               value={filters.date}
//               onChange={(e) => handleDateChange(e.target.value)}
//               className={selectClass}
//             />

//             {(filters.month || filters.year || filters.date) && (
//               <button
//                 onClick={handleClear}
//                 className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>

//         <Tabs defaultValue="project">
//           <TabsList>
//             <TabsTrigger
//               value="project"
//               className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
//             >
//               Project Expense
//             </TabsTrigger>
//             <TabsTrigger
//               value="other"
//               className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
//             >
//               Other Expense
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="project">
//             <DataTable rows={projectRows} total={projectTotal} isLoading={isLoading} totalColor="text-rose-700" columns={columns} colCount={5} />
//           </TabsContent>

//           <TabsContent value="other">
//             <DataTable rows={otherRows} total={otherTotal} isLoading={isLoading} totalColor="text-rose-700" columns={columns} colCount={5} />
//           </TabsContent>
//         </Tabs>

//       </div>
//     </div>
//   );
// };

// // ── Main ──
// const DashboardHome = () => {
//   const currentMonth = new Date().getMonth() + 1;

//   const [expenseFilters, setExpenseFilters] = useState({
//     month: currentMonth,
//     year:  currentYear,
//     date:  "",
//   });
//   const [incomeFilters, setIncomeFilters] = useState({
//     month: currentMonth,
//     year:  currentYear,
//     date:  "",
//   });

//   const { data: cash = {} } = useQuery({
//     queryKey: ["cash"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/dashboard-cash/balance/1020010001`);
//       return res.data.success ? res.data : {};
//     },
//   });

//   const { data: expenseSplit = {}, isLoading: expLoading } = useQuery({
//     queryKey: ["expense-split", expenseFilters],
//     queryFn: async () => {
//       const params = {};
//       if (expenseFilters.date) params.date = expenseFilters.date;
//       else {
//         if (expenseFilters.month) params.month = expenseFilters.month;
//         if (expenseFilters.year)  params.year  = expenseFilters.year;
//       }
//       const res = await axios.get(`${url}/api/dashboard-expense/breakdown-split`, { params });
//       return res.data.success ? res.data.data : {};
//     },
//   });

//   const { data: income = {}, isLoading: incLoading } = useQuery({
//     queryKey: ["income", incomeFilters],
//     queryFn: async () => {
//       const params = {};
//       if (incomeFilters.date) params.date = incomeFilters.date;
//       else {
//         if (incomeFilters.month) params.month = incomeFilters.month;
//         if (incomeFilters.year)  params.year  = incomeFilters.year;
//       }
//       const res = await axios.get(`${url}/api/dashboard-income/breakdown`, { params });
//       return res.data.success ? res.data : {};
//     },
//   });

//   const getTheme = (type) => {
//     switch (type) {
//       case "income":  return { cardBg: "bg-[#F0FDF4] border-emerald-100/50", iconBg: "bg-emerald-100 text-emerald-600", badgeBg: "bg-emerald-100/50 text-emerald-700", trendIcon: TrendingUp };
//       case "expense": return { cardBg: "bg-[#FFF1F2] border-rose-100/50",    iconBg: "bg-rose-100 text-rose-600",       badgeBg: "bg-rose-100/50 text-rose-700",    trendIcon: TrendingDown };
//       case "balance": return { cardBg: "bg-[#F5F3FF] border-violet-100/50",  iconBg: "bg-violet-100 text-violet-600",   badgeBg: "bg-violet-100/50 text-violet-700", trendIcon: Activity };
//       default: return {};
//     }
//   };

//   const StatCard = ({ title, value, icon: Icon, type }) => {
//     const theme = getTheme(type);
//     const TrendIcon = theme.trendIcon;
//     return (
//       <Card className={cn("border shadow-sm", theme.cardBg)}>
//         <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
//           <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
//           <div className={cn("p-2 rounded-full", theme.iconBg)}>
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
//               All time
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <SectionContainer>
//       <div className="mt-10">

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           <ExpenseDetailsPanel
//             filters={expenseFilters}
//             setFilters={setExpenseFilters}
//             expenseSplit={expenseSplit}
//             isLoading={expLoading}
//           />
//           <DataPanel
//             title="Income Details"
//             type="income"
//             filters={incomeFilters}
//             setFilters={setIncomeFilters}
//             data={income}
//             isLoading={incLoading}
//           />
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
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpRight, ArrowDownRight, Landmark,
  TrendingUp, TrendingDown, Activity, ArrowUpDown, Download,
} from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import axios from "axios";
import * as XLSX from "xlsx";

const url = import.meta.env.VITE_API_BASE_URL;

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
const YEARS = Array.from(
  { length: 2030 - currentYear + 1 },
  (_, i) => {
    const y = currentYear + i;
    return { label: String(y), value: y };
  }
);

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);

  const day   = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year  = d.getFullYear();

  return `${month} ${day} ${year}`;
};

// ── Excel export helper ──
// sheets: [{ name, rows, headers: [{ label, getValue(row) }] }]
const exportToExcel = (sheets, fileName) => {
  const wb = XLSX.utils.book_new();

  sheets.forEach(({ name, rows, headers }) => {
    const data = (rows ?? []).map((row) => {
      const obj = {};
      headers.forEach((h) => {
        obj[h.label] = h.getValue(row);
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(data.length ? data : [{}]);
    // Sheet names max 31 chars, no special chars
    const safeName = name.replace(/[\\/?*[\]:]/g, "").slice(0, 31) || "Sheet";
    XLSX.utils.book_append_sheet(wb, ws, safeName);
  });

  XLSX.writeFile(wb, fileName);
};

const incomeExportHeaders = [
  { label: "Date", getValue: (r) => formatDate(r.GL_ENTRY_DATE) },
  { label: "Description", getValue: (r) => r.DESCRIPTION ?? "" },
  { label: "Amount", getValue: (r) => Number(r.AMT ?? 0) },
];

const expenseExportHeaders = [
  { label: "Date", getValue: (r) => formatDate(r.GL_ENTRY_DATE) },
  { label: "Account", getValue: (r) => r.ACCOUNT_NAME ?? "" },
  { label: "Description", getValue: (r) => r.DESCRIPTION ?? "" },
  { label: "Amount", getValue: (r) => Number(r.AMT ?? 0) },
];

// ── Income er jonno column — Account name nai ──
const makeIncomeColumns = () => [
  {
    id: "index",
    header: "#",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: "GL_ENTRY_DATE",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.getValue("GL_ENTRY_DATE"))}</span>
    ),
  },
  {
    accessorKey: "DESCRIPTION",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("DESCRIPTION")}</span>,
  },
  {
    accessorKey: "AMT",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">{Number(row.getValue("AMT")).toLocaleString()}</span>
    ),
  },
];

// ── Expense er jonom column — Account name shoho ──
const makeExpenseColumns = () => [
  {
    id: "index",
    header: "#",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: "GL_ENTRY_DATE",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.getValue("GL_ENTRY_DATE"))}</span>
    ),
  },
  {
    accessorKey: "ACCOUNT_NAME",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Account <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="whitespace-nowrap">{row.getValue("ACCOUNT_NAME") || "—"}</span>,
  },
  {
    accessorKey: "DESCRIPTION",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Description <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.getValue("DESCRIPTION")}</span>,
  },
  {
    accessorKey: "AMT",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">{Number(row.getValue("AMT")).toLocaleString()}</span>
    ),
  },
];

const selectClass =
  "text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

const ExportButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors px-2 py-1.5 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
  >
    <Download className="h-3 w-3" />
    Export
  </button>
);

// ── Table + total — columns props diye income/expense duitai reuse korbe ──
const DataTable = ({ rows, total, isLoading, totalColor, columns, colCount }) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className="space-y-3">
      <div className="rounded-md border overflow-y-auto overflow-x-auto max-h-[420px]">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="py-2 text-xs whitespace-nowrap">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-20 text-center text-slate-400 text-xs">
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
                <TableCell colSpan={colCount} className="h-20 text-center text-slate-400 text-xs">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end pt-1">
        <p className="text-xs font-semibold text-slate-600">
          Total:{" "}
          <span className={`font-bold ${totalColor}`}>
            {Number(total).toLocaleString()} Taka
          </span>
        </p>
      </div>
    </div>
  );
};

// ── Income Details panel — age jerokom chilo, shudhu column set-e Account nai, ekhon export button shoho ──
const DataPanel = ({ title, type, filters, setFilters, data, isLoading }) => {
  const rows  = data?.data?.rows  ?? [];
  const total = data?.data?.total ?? 0;
  const columns = makeIncomeColumns();

  const handleMonthChange = (val) => {
    setFilters((prev) => ({ ...prev, month: val ? Number(val) : "", date: "" }));
  };
  const handleYearChange = (val) => {
    setFilters((prev) => ({ ...prev, year: val ? Number(val) : "", date: "" }));
  };
  const handleDateChange = (val) => {
    if (val) {
      const d = new Date(val);
      setFilters({ date: val, month: d.getMonth() + 1, year: d.getFullYear() });
    } else {
      setFilters((prev) => ({ ...prev, date: "" }));
    }
  };
  const handleClear = () =>
    setFilters({
      month: new Date().getMonth() + 1,
      year:  currentYear,
      date:  "",
    });

  const filterLabel = () => {
    if (filters.date) return filters.date;
    if (filters.month && filters.year)
      return `${MONTHS.find((m) => m.value === filters.month)?.label} ${filters.year}`;
    if (filters.month) return MONTHS.find((m) => m.value === filters.month)?.label;
    if (filters.year)  return String(filters.year);
    return "All time";
  };

  const borderTop  = type === "expense" ? "border-rose-200"   : "border-emerald-200";
  const totalColor = type === "expense" ? "text-rose-700"     : "text-emerald-700";

  const handleExport = () => {
    exportToExcel(
      [{ name: "Income", rows, headers: incomeExportHeaders }],
      `Income_Details_${filterLabel().replace(/\s+/g, "_")}.xlsx`
    );
  };

  return (
    <div className={`bg-card rounded-md shadow-sm p-4 border-t-2 ${borderTop}`}>
      <div className="space-y-3">

        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-0.5">{filterLabel()}</p>
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

            <ExportButton onClick={handleExport} />
          </div>
        </div>

        <DataTable rows={rows} total={total} isLoading={isLoading} totalColor={totalColor} columns={columns} colCount={4} />

      </div>
    </div>
  );
};

// ── Expense Details panel — same filter bar, tab order: Other Expense age, Project Expense pore, export button shoho (dutai sheet ek excel-e) ──
const ExpenseDetailsPanel = ({ filters, setFilters, expenseSplit, isLoading }) => {
  const columns = makeExpenseColumns();

  const handleMonthChange = (val) => {
    setFilters((prev) => ({ ...prev, month: val ? Number(val) : "", date: "" }));
  };
  const handleYearChange = (val) => {
    setFilters((prev) => ({ ...prev, year: val ? Number(val) : "", date: "" }));
  };
  const handleDateChange = (val) => {
    if (val) {
      const d = new Date(val);
      setFilters({ date: val, month: d.getMonth() + 1, year: d.getFullYear() });
    } else {
      setFilters((prev) => ({ ...prev, date: "" }));
    }
  };
  const handleClear = () =>
    setFilters({
      month: new Date().getMonth() + 1,
      year:  currentYear,
      date:  "",
    });

  const filterLabel = () => {
    if (filters.date) return filters.date;
    if (filters.month && filters.year)
      return `${MONTHS.find((m) => m.value === filters.month)?.label} ${filters.year}`;
    if (filters.month) return MONTHS.find((m) => m.value === filters.month)?.label;
    if (filters.year)  return String(filters.year);
    return "All time";
  };

  const projectRows  = expenseSplit?.project?.rows  ?? [];
  const projectTotal = expenseSplit?.project?.total ?? 0;
  const otherRows    = expenseSplit?.other?.rows    ?? [];
  const otherTotal   = expenseSplit?.other?.total   ?? 0;

  const handleExport = () => {
    exportToExcel(
      [
        { name: "Expense", rows: otherRows, headers: expenseExportHeaders },
        { name: "Project", rows: projectRows, headers: expenseExportHeaders },
      ],
      `Expense_Details_${filterLabel().replace(/\s+/g, "_")}.xlsx`
    );
  };

  return (
    <div className="bg-card rounded-md shadow-sm p-4 border-t-2 border-rose-200">
      <div className="space-y-3">

        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-semibold">Expense Details</h2>
            <p className="mt-0.5">{filterLabel()}</p>
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

            <ExportButton onClick={handleExport} />
          </div>
        </div>

        <Tabs defaultValue="other">
          <TabsList>
            <TabsTrigger
              value="other"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
            >
              Expense
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
            >
              Project
            </TabsTrigger>
          </TabsList>

          <TabsContent value="other">
            <DataTable rows={otherRows} total={otherTotal} isLoading={isLoading} totalColor="text-rose-700" columns={columns} colCount={5} />
          </TabsContent>

          <TabsContent value="project">
            <DataTable rows={projectRows} total={projectTotal} isLoading={isLoading} totalColor="text-rose-700" columns={columns} colCount={5} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

// ── Main ──
const DashboardHome = () => {
  const currentMonth = new Date().getMonth() + 1;

  const [expenseFilters, setExpenseFilters] = useState({
    month: currentMonth,
    year:  currentYear,
    date:  "",
  });
  const [incomeFilters, setIncomeFilters] = useState({
    month: currentMonth,
    year:  currentYear,
    date:  "",
  });

  const { data: cash = {} } = useQuery({
    queryKey: ["cash"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-cash/balance/1020010001`);
      return res.data.success ? res.data : {};
    },
  });

  const { data: expenseSplit = {}, isLoading: expLoading } = useQuery({
    queryKey: ["expense-split", expenseFilters],
    queryFn: async () => {
      const params = {};
      if (expenseFilters.date) params.date = expenseFilters.date;
      else {
        if (expenseFilters.month) params.month = expenseFilters.month;
        if (expenseFilters.year)  params.year  = expenseFilters.year;
      }
      const res = await axios.get(`${url}/api/dashboard-expense/breakdown-split`, { params });
      return res.data.success ? res.data.data : {};
    },
  });

  const { data: income = {}, isLoading: incLoading } = useQuery({
    queryKey: ["income", incomeFilters],
    queryFn: async () => {
      const params = {};
      if (incomeFilters.date) params.date = incomeFilters.date;
      else {
        if (incomeFilters.month) params.month = incomeFilters.month;
        if (incomeFilters.year)  params.year  = incomeFilters.year;
      }
      const res = await axios.get(`${url}/api/dashboard-income/breakdown`, { params });
      return res.data.success ? res.data : {};
    },
  });

  const getTheme = (type) => {
    switch (type) {
      case "income":  return { cardBg: "bg-[#F0FDF4] border-emerald-100/50", iconBg: "bg-emerald-100 text-emerald-600", badgeBg: "bg-emerald-100/50 text-emerald-700", trendIcon: TrendingUp };
      case "expense": return { cardBg: "bg-[#FFF1F2] border-rose-100/50",    iconBg: "bg-rose-100 text-rose-600",       badgeBg: "bg-rose-100/50 text-rose-700",    trendIcon: TrendingDown };
      case "balance": return { cardBg: "bg-[#F5F3FF] border-violet-100/50",  iconBg: "bg-violet-100 text-violet-600",   badgeBg: "bg-violet-100/50 text-violet-700", trendIcon: Activity };
      default: return {};
    }
  };

  const StatCard = ({ title, value, icon: Icon, type }) => {
    const theme = getTheme(type);
    const TrendIcon = theme.trendIcon;
    return (
      <Card className={cn("border shadow-sm", theme.cardBg)}>
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={cn("p-2 rounded-full", theme.iconBg)}>
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
              All time
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <SectionContainer>
      <div className="mt-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExpenseDetailsPanel
            filters={expenseFilters}
            setFilters={setExpenseFilters}
            expenseSplit={expenseSplit}
            isLoading={expLoading}
          />
          <DataPanel
            title="Income Details"
            type="income"
            filters={incomeFilters}
            setFilters={setIncomeFilters}
            data={income}
            isLoading={incLoading}
          />
        </div>

      </div>
    </SectionContainer>
  );
};

export default DashboardHome;