import { fmtAmount, fmtMonth } from "./utils";

export default function ExpenseReportKpis({ kpis }) {
  const items = [
    { label: "Total expense", value: fmtAmount(kpis.totalExpense) },
    { label: "Expense lines", value: String(kpis.expenseLines) },
    {
      label: "Largest project",
      value: kpis.largestProject?.name ?? "-",
      sub: kpis.largestProject && fmtAmount(kpis.largestProject.amount),
    },
    {
      label: "Largest category",
      value: kpis.largestCategory?.name ?? "-",
      sub: kpis.largestCategory && fmtAmount(kpis.largestCategory.amount),
    },
    {
      label: "Peak month",
      value: kpis.peakMonth ? fmtMonth(kpis.peakMonth.month) : "-",
      sub: kpis.peakMonth && fmtAmount(kpis.peakMonth.amount),
    },
    {
      label: "Average per spending month",
      value: fmtAmount(kpis.averagePerSpendingMonth),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-muted/50 rounded-lg p-4">
          <p className="text-muted-foreground text-xs">{item.label}</p>
          <p className="mt-1 truncate text-xl font-medium tabular-nums">
            {item.value}
          </p>
          {item.sub && (
            <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
              {item.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}