import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useMonthlyDebitByAccount } from "./queries";

export default function MonthlyDebitChart({ code = 5150010000 }) {
  const { data: rows = [], isLoading } = useMonthlyDebitByAccount(code);

  const chartData = rows.map((r) => ({
    month: r.MONTH_YEAR,
    debit: Number(r.TOTAL_DEBIT || 0),
  }));

  const accountName = rows[0]?.ACCOUNT_NAME || "";

  return (
    <div className="bg-card rounded-md shadow-sm p-4">
      <p className="text-sm text-slate-500 mb-4">
        {accountName ? `${accountName} — Expense income` : "Expense income"}
      </p>

      {isLoading ? (
        <div className="h-72 flex items-center justify-center text-sm text-slate-400">
          Loading...
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-sm text-slate-400">
          No data found
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString(), "Total Debit"]}
            />
            <Bar dataKey="debit" fill="#2563eb" maxBarSize={60} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}