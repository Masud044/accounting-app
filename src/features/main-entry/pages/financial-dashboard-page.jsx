import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
} from "recharts";
import { SectionContainer } from "@/components/SectionContainer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const currentYear = new Date().getFullYear();

// ── shared filter options ────────────────────────────────────────────────
const MONTHS = [
  { label: "All", value: "" },
  { label: "January", value: 1 },  { label: "February", value: 2 },
  { label: "March", value: 3 },    { label: "April", value: 4 },
  { label: "May", value: 5 },      { label: "June", value: 6 },
  { label: "July", value: 7 },     { label: "August", value: 8 },
  { label: "September", value: 9 },{ label: "October", value: 10 },
  { label: "November", value: 11 },{ label: "December", value: 12 },
];

// year dropdown শুধু 2026 থেকে 2030 পর্যন্ত
const YEARS = [2026, 2027, 2028, 2029, 2030].map((y) => ({ label: String(y), value: y }));

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const selectClass =
  "text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

// ── helpers ────────────────────────────────────────────────────────────────
const fmtTaka = (n) => `৳${Number(n || 0).toLocaleString()}`;

function aggregate(rows) {
  const byMonth    = {};
  const byCategory = {};
  for (const r of rows || []) {
    const amt = Number(r.AMT || 0);
    const d   = r.GL_ENTRY_DATE ? new Date(r.GL_ENTRY_DATE) : null;
    if (d && !isNaN(d.getTime())) {
      const key = d.getMonth();
      byMonth[key] = (byMonth[key] || 0) + amt;
    }
    const cat = r.DESCRIPTION || "Uncategorized";
    byCategory[cat] = (byCategory[cat] || 0) + amt;
  }
  return { byMonth, byCategory };
}

// ── small stat card ───────────────────────────────────────────────────────
function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5">
      <div className="text-xs text-slate-500 mb-1.5">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ── generic tooltip ───────────────────────────────────────────────────────
function MoneyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-md text-xs">
      <div className="font-medium mb-1 text-slate-700">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-500">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-slate-900">{fmtTaka(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── reusable filter row (কার্ডের নিজের হেডারে বসবে) ─────────────────────────
function CardFilter({ filters, onMonthChange, onYearChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <select value={filters.month} onChange={(e) => onMonthChange(e.target.value)} className={selectClass}>
        {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select value={filters.year} onChange={(e) => onYearChange(e.target.value)} className={selectClass}>
        {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
      </select>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 1: Monthly income vs expense trend (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function MonthlyTrendCard() {
  const [filters, setFilters] = useState({ month: "", year: currentYear });

  const { data: incomeData, isLoading: incLoading } = useQuery({
    queryKey: ["fin-trend-income", filters],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-income/breakdown`, {
        params: { year: filters.year, ...(filters.month ? { month: filters.month } : {}) },
      });
      return res.data?.data?.rows ?? [];
    },
  });

  const { data: expenseData, isLoading: expLoading } = useQuery({
    queryKey: ["fin-trend-expense", filters],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, {
        params: { year: filters.year, ...(filters.month ? { month: filters.month } : {}) },
      });
      return res.data?.data?.rows ?? [];
    },
  });

  const monthlyRows = useMemo(() => {
    const income  = aggregate(incomeData);
    const expense = aggregate(expenseData);
    return MONTH_LABELS.map((label, i) => ({
      month:   label,
      income:  income.byMonth[i]  || 0,
      expense: expense.byMonth[i] || 0,
    }));
  }, [incomeData, expenseData]);

  const isLoading = incLoading || expLoading;

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          Monthly income vs expense
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {isLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48}
              />
              <Tooltip content={<MoneyTooltip />} />
              <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="income"  name="Income"  fill="#2563eb" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 2: Expense breakdown by account (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function AccountBreakdownCard() {
  const [filters, setFilters] = useState({ month: "", year: currentYear });

  const { data: accountData, isLoading } = useQuery({
    queryKey: ["fin-account", filters],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-expense/by-account`, {
        params: { year: filters.year, ...(filters.month ? { month: filters.month } : {}) },
      });
      return res.data?.rows ?? [];
    },
    retry: 1,
  });

  const accountRows = useMemo(
    () => [...(accountData || [])].sort((a, b) => Number(b.AMT) - Number(a.AMT)),
    [accountData]
  );

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          Expense breakdown by account
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {isLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : accountRows.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No account-level expense data found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(280, accountRows.length * 32)}>
            <BarChart
              data={accountRows}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              />
              <YAxis
                type="category" dataKey="ACCOUNT_NAME"
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
                width={140}
              />
              <Tooltip
                formatter={(v) => fmtTaka(v)}
                labelStyle={{ fontSize: 12, color: "#334155" }}
                contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: "#e2e8f0" }}
              />
              <Bar dataKey="AMT" name="Amount" radius={[0, 4, 4, 0]}>
                {accountRows.map((_, i) => (
                  <Cell key={i} fill="#8b7cf6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 3: Income by category (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function IncomeByCategoryCard() {
  const [filters, setFilters] = useState({ month: "", year: currentYear });

  const { data: incomeData, isLoading } = useQuery({
    queryKey: ["fin-income-category", filters],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-income/breakdown`, {
        params: { year: filters.year, ...(filters.month ? { month: filters.month } : {}) },
      });
      return res.data?.data?.rows ?? [];
    },
  });

  const incomeByCategory = useMemo(() => {
    const { byCategory } = aggregate(incomeData);
    return Object.entries(byCategory)
      .map(([name, amt]) => ({ name, amt }))
      .sort((a, b) => b.amt - a.amt);
  }, [incomeData]);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          Income by category
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {isLoading ? (
          <div className="h-[240px] flex items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={incomeByCategory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48}
              />
              <Tooltip content={<MoneyTooltip />} />
              <Bar dataKey="amt" name="Income" fill="#2563eb" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 4: Expense by category (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function ExpenseByCategoryCard() {
  const [filters, setFilters] = useState({ month: "", year: currentYear });

  const { data: expenseData, isLoading } = useQuery({
    queryKey: ["fin-expense-category", filters],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, {
        params: { year: filters.year, ...(filters.month ? { month: filters.month } : {}) },
      });
      return res.data?.data?.rows ?? [];
    },
  });

  const expenseByCategory = useMemo(() => {
    const { byCategory } = aggregate(expenseData);
    return Object.entries(byCategory)
      .map(([name, amt]) => ({ name, amt }))
      .sort((a, b) => b.amt - a.amt);
  }, [expenseData]);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          Expense by category
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {isLoading ? (
          <div className="h-[240px] flex items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={expenseByCategory} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48}
              />
              <Tooltip content={<MoneyTooltip />} />
              <Bar dataKey="amt" name="Expense" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Main page ──
// ══════════════════════════════════════════════════════════════════════════
export default function FinancialDashboardPage() {
  // ── Stat cards: always unfiltered, full current-year totals ──
  const { data: incomeData, isLoading: incLoading } = useQuery({
    queryKey: ["financial-dashboard", "income-static", currentYear],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-income/breakdown`, {
        params: { year: currentYear },
      });
      return res.data?.data?.rows ?? [];
    },
  });

  const { data: expenseData, isLoading: expLoading } = useQuery({
    queryKey: ["financial-dashboard", "expense-static", currentYear],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, {
        params: { year: currentYear },
      });
      return res.data?.data?.rows ?? [];
    },
  });

  const isLoading = incLoading || expLoading;

  const totals = useMemo(() => {
    const totalIncome  = (incomeData  || []).reduce((s, r) => s + Number(r.AMT || 0), 0);
    const totalExpense = (expenseData || []).reduce((s, r) => s + Number(r.AMT || 0), 0);
    const netProfit    = totalIncome - totalExpense;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    return { totalIncome, totalExpense, netProfit, profitMargin };
  }, [incomeData, expenseData]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner className="h-8 w-8 mb-3" />
        <p className="text-sm text-muted-foreground">Loading financial dashboard...</p>
      </div>
    );
  }

  return (
    <SectionContainer>
      <div className="py-5 space-y-6 bg-slate-50/30 min-h-screen">

        {/* ── Stat cards — সবসময় unfiltered ({currentYear} full year) ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total income"  value={fmtTaka(totals.totalIncome)} />
          <StatCard label="Total expense" value={fmtTaka(totals.totalExpense)} />
          <StatCard label="Net profit"    value={fmtTaka(totals.netProfit)} />
          <StatCard label="Profit margin" value={`${totals.profitMargin.toFixed(1)}%`} />
        </div>

        {/* ── Chart cards — প্রতিটার নিজস্ব filter ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MonthlyTrendCard />
          <AccountBreakdownCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IncomeByCategoryCard />
          <ExpenseByCategoryCard />
        </div>

      </div>
    </SectionContainer>
  );
}