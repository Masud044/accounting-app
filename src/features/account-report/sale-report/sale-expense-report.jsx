// import { useState } from "react";
// import {
//   TrendingUp, ShoppingCart, Coins,
//   Receipt, RefreshCw, AlertCircle, FileBarChart,
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button }    from "@/components/ui/button";
// import { Input }     from "@/components/ui/input";
// import { Label }     from "@/components/ui/label";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Separator } from "@/components/ui/separator";
// import { Spinner }   from "@/components/ui/spinner";
// import { useSaleExpenseReport } from "./queries";
// import ReportBreakdown from "./report-breakdown";
// import ReportTables    from "./report-table";

// const fmt = (v) => `৳${Number(v || 0).toLocaleString("en-IN")}`;

// function KpiCard({ label, value, sub, icon: Icon, colorClass }) {
//   return (
//     <Card>
//       <CardContent className="p-5">
//         <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
//           <Icon className="h-3.5 w-3.5" />
//           {label}
//         </p>
//         <p className={`text-2xl font-semibold tabular-nums ${colorClass}`}>{value}</p>
//         {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
//       </CardContent>
//     </Card>
//   );
// }

// export default function SaleExpenseReport() {
//   const today          = new Date().toISOString().split("T")[0];
//   const firstOfMonth   = `${today.slice(0, 8)}01`;

//   const [fromDate, setFromDate]       = useState(firstOfMonth);
//   const [toDate, setToDate]           = useState(today);
//   const [queryParams, setQueryParams] = useState(null);

//   const { data, isLoading, isError, error, refetch, isFetching } =
//     useSaleExpenseReport({
//       from_date: queryParams?.from_date,
//       to_date:   queryParams?.to_date,
//       enabled:   !!queryParams,
//     });

//   const summary = data?.summary;

//   return (
//     <div className="space-y-5">
//       {/* ── Page Header ───────────────────────────────────────────── */}
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <div>
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight flex items-center gap-2">
//               <FileBarChart className="h-5 w-5 text-muted-foreground" />
//               Sales &amp; Expense Report
//             </h1>
//             {summary && (
//               <p className="text-xs text-muted-foreground mt-1">
//                 {summary.from_date} → {summary.to_date}
//                 &nbsp;·&nbsp;{summary.total_gl_lines} GL lines
//                 &nbsp;·&nbsp;{summary.total_vouchers} vouchers
//               </p>
//             )}
//           </div>
//           {queryParams && (
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
//               <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
//               Refresh
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* ── Date Filter ───────────────────────────────────────────── */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-sm font-medium text-muted-foreground">Date range</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap items-end gap-4">
//             <div className="space-y-1.5">
//               <Label htmlFor="from_date" className="text-xs">From</Label>
//               <Input
//                 id="from_date"
//                 type="date"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className="w-44"
//               />
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="to_date" className="text-xs">To</Label>
//               <Input
//                 id="to_date"
//                 type="date"
//                 value={toDate}
//                 onChange={(e) => setToDate(e.target.value)}
//                 className="w-44"
//               />
//             </div>
//             <Button
//               onClick={() => setQueryParams({ from_date: fromDate, to_date: toDate })}
//               disabled={isLoading}
//             >
//               {isLoading
//                 ? <><Spinner className="mr-2 h-4 w-4" />Generating...</>
//                 : "Generate Report"
//               }
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* ── States ───────────────────────────────────────────────── */}
//       {isLoading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <Spinner className="h-10 w-10 mb-3" />
//           <p className="text-sm text-muted-foreground">Loading report…</p>
//         </div>
//       )}

//       {isError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Failed to load report</AlertTitle>
//           <AlertDescription>{error?.message || "Something went wrong."}</AlertDescription>
//         </Alert>
//       )}

//       {!queryParams && !isLoading && (
//         <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
//           <FileBarChart className="h-14 w-14 mb-3 opacity-20" />
//           <p className="text-sm">
//             Select a date range and click <strong>Generate Report</strong>
//           </p>
//         </div>
//       )}

//       {/* ── Report ───────────────────────────────────────────────── */}
//       {data && !isLoading && (
//         <>
//           {/* Journal KPIs */}
//           <div>
//             <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
//               Journal entries — voucher type 3
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               <KpiCard label="Total Sales"    value={fmt(summary.journal.total_sales)}   sub="Credit-account" icon={TrendingUp}  colorClass="text-blue-600" />
//               <KpiCard label="Total Expenses" value={fmt(summary.journal.total_expense)} sub="Debit-account "  icon={ShoppingCart} colorClass="text-red-600" />
//               <KpiCard
//                 label="Net Surplus"
//                 value={fmt(summary.journal.net_surplus)}
//                 sub="Sales − expenses"
//                 icon={Coins}
//                 colorClass={summary.journal.net_surplus >= 0 ? "text-green-600" : "text-red-600"}
//               />
//               <KpiCard
//                 label="Vouchers"
//                 value={summary.total_vouchers}
//                 sub={`Income: ${summary.income_vouchers} · Expense: ${summary.expense_vouchers}`}
//                 icon={Receipt}
//                 colorClass="text-foreground"
//               />
//             </div>
//           </div>

//           <Separator />

//           {/* All-voucher KPIs */}
//           <div>
//             <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
//               All vouchers — overall
//             </p>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//               <KpiCard label="Total Sales"    value={fmt(summary.all.total_sales)}   sub="All income entries"  icon={TrendingUp}  colorClass="text-blue-600" />
//               <KpiCard label="Total Expenses" value={fmt(summary.all.total_expense)} sub="All expense entries" icon={ShoppingCart} colorClass="text-red-600" />
//               <KpiCard
//                 label="Net Surplus"
//                 value={fmt(summary.all.net_surplus)}
//                 sub="Sales − expenses"
//                 icon={Coins}
//                 colorClass={summary.all.net_surplus >= 0 ? "text-green-600" : "text-red-600"}
//               />
//               <KpiCard
//                 label="Profit Margin"
//                 value={`${summary.all.profit_margin_pct}%`}
//                 sub="Net / total sales"
//                 icon={Receipt}
//                 colorClass={Number(summary.all.profit_margin_pct) >= 0 ? "text-green-600" : "text-red-600"}
//               />
//             </div>
//           </div>

//           {/* Charts + Breakdown */}
//           <ReportBreakdown
//             salesBreakdown={data.sales_breakdown}
//             expenseBreakdown={data.expense_breakdown}
//             summary={summary}
//           />

//           {/* Tables */}
//           <ReportTables sales={data.sales} expenses={data.expenses} />
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import {
  TrendingUp, ShoppingCart, Coins,
  Receipt, RefreshCw, AlertCircle, FileBarChart,
  CalendarRange, Sparkles,
} from "lucide-react";
import { Button }    from "@/components/ui/button";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner }   from "@/components/ui/spinner";
import { useSaleExpenseReport } from "./queries";
import ReportBreakdown from "./report-breakdown";
import ReportTables    from "./report-table";

const fmt = (v) => `৳${Number(v || 0).toLocaleString("en-IN")}`;

/* ── Shared design tokens ─────────────────────────────────────────────── */
const card =
  "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
const sectionHeader =
  "flex items-center gap-3 px-6 py-4 border-b border-slate-100";
const sectionIconWrap =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";
const sectionTitle = "text-[15px] font-semibold text-slate-800 leading-none";
const sectionSubtitle = "text-xs text-slate-400 mt-1";
const fieldLabel =
  "text-[11px] font-semibold tracking-wider uppercase text-slate-500";
const fieldInput =
  "border-slate-200 bg-slate-50 hover:border-slate-300 focus-visible:ring-4 focus-visible:ring-indigo-500/10 focus-visible:border-indigo-400 focus-visible:bg-white transition-all";
const kicker =
  "flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1";
const groupLabel =
  "text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5";

/* ── KPI card ─────────────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, icon: Icon, tone = "slate" }) {
  const toneMap = {
    blue:   { chip: "bg-blue-50 text-blue-600",   value: "text-slate-900" },
    red:    { chip: "bg-rose-50 text-rose-600",   value: "text-slate-900" },
    green:  { chip: "bg-emerald-50 text-emerald-600", value: "text-emerald-700" },
    redVal: { chip: "bg-rose-50 text-rose-600",   value: "text-rose-700" },
    slate:  { chip: "bg-slate-100 text-slate-600", value: "text-slate-900" },
  };
  const t = toneMap[tone] || toneMap.slate;

  return (
    <div className={`${card} p-4 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`flex items-center justify-center w-7 h-7 rounded-md shrink-0 ${t.chip}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">{label}</p>
      </div>
      <p className={`text-2xl font-bold tabular-nums ${t.value}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function SaleExpenseReport() {
  const today          = new Date().toISOString().split("T")[0];
  const firstOfMonth   = `${today.slice(0, 8)}01`;

  const [fromDate, setFromDate]       = useState(firstOfMonth);
  const [toDate, setToDate]           = useState(today);
  const [queryParams, setQueryParams] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSaleExpenseReport({
      from_date: queryParams?.from_date,
      to_date:   queryParams?.to_date,
      enabled:   !!queryParams,
    });

  const summary = data?.summary;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6">

      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className={kicker}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Reports
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart className="h-5 w-5 text-slate-400" />
            Sales &amp; Expense Report
          </h1>
          {summary ? (
            <p className="text-sm text-slate-500 mt-0.5">
              {summary.from_date} → {summary.to_date}
              <span className="mx-1.5 text-slate-300">·</span>
              {summary.total_gl_lines} GL lines
              <span className="mx-1.5 text-slate-300">·</span>
              {summary.total_vouchers} vouchers
            </p>
          ) : (
            <p className="text-sm text-slate-500 mt-0.5">Overview of sales and expense activity</p>
          )}
        </div>
        {queryParams && (
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* ── Date Filter ───────────────────────────────────────────── */}
      <div className={card}>
        <div className={sectionHeader}>
          <div className={sectionIconWrap}>
            <CalendarRange size={16} />
          </div>
          <div>
            <h3 className={sectionTitle}>Date Range</h3>
            <p className={sectionSubtitle}>Choose a period to generate the report</p>
          </div>
        </div>
        <div className="p-6 flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="from_date" className={fieldLabel}>From</Label>
            <Input
              id="from_date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={`w-44 ${fieldInput}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to_date" className={fieldLabel}>To</Label>
            <Input
              id="to_date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={`w-44 ${fieldInput}`}
            />
          </div>
          <Button
            onClick={() => setQueryParams({ from_date: fromDate, to_date: toDate })}
            disabled={isLoading}
            className="shadow-sm"
          >
            {isLoading
              ? <><Spinner className="mr-2 h-4 w-4" />Generating...</>
              : <><Sparkles className="h-4 w-4 mr-1.5" />Generate Report</>
            }
          </Button>
        </div>
      </div>

      {/* ── States ───────────────────────────────────────────────── */}
      {isLoading && (
        <div className={`${card} flex flex-col items-center justify-center py-20`}>
          <Spinner className="h-9 w-9 mb-3 text-indigo-500" />
          <p className="text-sm text-slate-500">Loading report…</p>
        </div>
      )}

      {isError && (
        <Alert variant="destructive" className="rounded-2xl border-rose-200 bg-rose-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load report</AlertTitle>
          <AlertDescription>{error?.message || "Something went wrong."}</AlertDescription>
        </Alert>
      )}

      {!queryParams && !isLoading && (
        <div className={`${card} flex flex-col items-center justify-center py-24 text-slate-400`}>
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-300 mb-4">
            <FileBarChart className="h-7 w-7" />
          </div>
          <p className="text-sm text-slate-500">
            Select a date range and click <strong className="text-slate-700">Generate Report</strong>
          </p>
        </div>
      )}

      {/* ── Report ───────────────────────────────────────────────── */}
      {data && !isLoading && (
        <>
          {/* Journal KPIs */}
          <div>
            <p className={groupLabel}>
              <span className="w-1 h-1 rounded-full bg-indigo-400" />
              Journal entries — voucher type 3
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard label="Total Sales"    value={fmt(summary.journal.total_sales)}   sub="Credit-account" icon={TrendingUp}  tone="blue" />
              <KpiCard label="Total Expenses" value={fmt(summary.journal.total_expense)} sub="Debit-account"  icon={ShoppingCart} tone="red" />
              <KpiCard
                label="Net Surplus"
                value={fmt(summary.journal.net_surplus)}
                sub="Sales − expenses"
                icon={Coins}
                tone={summary.journal.net_surplus >= 0 ? "green" : "redVal"}
              />
              <KpiCard
                label="Vouchers"
                value={summary.total_vouchers}
                sub={`Income: ${summary.income_vouchers} · Expense: ${summary.expense_vouchers}`}
                icon={Receipt}
                tone="slate"
              />
            </div>
          </div>

          {/* All-voucher KPIs */}
          <div>
            <p className={groupLabel}>
              <span className="w-1 h-1 rounded-full bg-indigo-400" />
              All vouchers — overall
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard label="Total Sales"    value={fmt(summary.all.total_sales)}   sub="All income entries"  icon={TrendingUp}  tone="blue" />
              <KpiCard label="Total Expenses" value={fmt(summary.all.total_expense)} sub="All expense entries" icon={ShoppingCart} tone="red" />
              <KpiCard
                label="Net Surplus"
                value={fmt(summary.all.net_surplus)}
                sub="Sales − expenses"
                icon={Coins}
                tone={summary.all.net_surplus >= 0 ? "green" : "redVal"}
              />
              <KpiCard
                label="Profit Margin"
                value={`${summary.all.profit_margin_pct}%`}
                sub="Net / total sales"
                icon={Receipt}
                tone={Number(summary.all.profit_margin_pct) >= 0 ? "green" : "redVal"}
              />
            </div>
          </div>

          {/* Charts + Breakdown */}
          <div className={card}>
            <ReportBreakdown
              salesBreakdown={data.sales_breakdown}
              expenseBreakdown={data.expense_breakdown}
              summary={summary}
            />
          </div>

          {/* Tables */}
          <div className={card}>
            <ReportTables sales={data.sales} expenses={data.expenses} />
          </div>
        </>
      )}
    </div>
  );
}