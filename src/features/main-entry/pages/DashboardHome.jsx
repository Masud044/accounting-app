import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight, ArrowDownRight, Landmark,
  TrendingUp, TrendingDown, Activity,
} from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import axios from "axios";
import MonthlyProductionChart from "@/features/egg-production/monthly-production-chart";
import MonthlySummaryChart from "@/features/egg-production/monthy-summary-production";
import DailyTrendChart from "@/features/egg-production/daily-trend";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MONTHS = [
  { label: "All", value: "" },
  { label: "January", value: 1 }, { label: "February", value: 2 },
  { label: "March", value: 3 },   { label: "April", value: 4 },
  { label: "May", value: 5 },     { label: "June", value: 6 },
  { label: "July", value: 7 },    { label: "August", value: 8 },
  { label: "September", value: 9 },{ label: "October", value: 10 },
  { label: "November", value: 11 },{ label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const YEARS = [{ label: "All", value: "" }, ...Array.from({ length: 5 }, (_, i) => ({
  label: String(currentYear - i), value: currentYear - i,
}))];

const DashboardHome = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Cash Balance — filter নেই
  const { data: cash = {} } = useQuery({
    queryKey: ["cash"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/dashboard-cash/balance/1020010001`);
      return res.data.success ? res.data : {};
    },
  });

  // Expenses — month/year filter
  const { data: expenses = {} } = useQuery({
    queryKey: ["expenses", selectedMonth, selectedYear],
    queryFn: async () => {
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear)  params.year  = selectedYear;
      const res = await axios.get(`${url}/api/dashboard-expense/breakdown`, { params });
      return res.data.success ? res.data : {};
    },
  });

  // Income — month/year filter
  const { data: income = {} } = useQuery({
    queryKey: ["income", selectedMonth, selectedYear],
    queryFn: async () => {
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear)  params.year  = selectedYear;
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

  const filterLabel = selectedMonth && selectedYear
    ? `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
    : selectedMonth
    ? MONTHS.find(m => m.value === selectedMonth)?.label
    : selectedYear
    ? String(selectedYear)
    : "All time";

  const StatCard = ({ title, value, icon: Icon, type }) => {
    const theme = getTheme(type);
    const TrendIcon = theme.trendIcon;
    return (
      <Card className={cn("border shadow-sm transition-all duration-300 hover:shadow-md", theme.cardBg)}>
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

        {/* Filter Row */}
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : "")}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : "")}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            {YEARS.map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <StatCard
            title="Money Income"
            value={income?.data?.total}
            icon={ArrowUpRight}
            type="income"
          />
          <StatCard
            title="Money Expenses"
            value={expenses?.data?.total}
            icon={ArrowDownRight}
            type="expense"
          />
          <StatCard
            title="Banking Balance"
            value={cash?.data?.balance}
            icon={Landmark}
            type="balance"
          />
        </div>

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