import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInvoiceMonthlySummary } from "./queries";

// const currentYear = new Date().getFullYear();
// const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const currentYear = new Date().getFullYear();

// current year থেকে 2030 পর্যন্ত
const YEARS = Array.from(
  { length: 2030 - currentYear + 1 },
  (_, i) => currentYear + i
);

const MONTH_LABELS = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};

export default function InvoiceMonthlyChart() {
  const [year, setYear] = useState(currentYear);
  const { data: rows = [], isLoading } = useInvoiceMonthlySummary(year);

  const chartData = rows.map((r) => ({
    month: MONTH_LABELS[r.MONTH?.split("-")[1]] || r.MONTH,
    amount: Number(r.TOTAL_AMT || 0),
    qty: Number(r.TOTAL_QTY || 0),
    count: Number(r.INVOICE_COUNT || 0),
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">
          Sales Invoice — Monthly Total
        </CardTitle>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-400">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-400">
            No invoice data for {year}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip
                formatter={(value, name) =>
                  name === "amount" ? [`৳ ${Number(value).toLocaleString()}`, "Total Amount"] : [value, name]
                }
              />
              <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}