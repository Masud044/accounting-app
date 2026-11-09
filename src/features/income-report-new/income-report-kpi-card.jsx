import { fmtAmount } from "./utils";

export default function IncomeReportKpis({ kpis }) {
  const items = [
    { label: "Total income", value: fmtAmount(kpis.totalIncome) },
    { label: "Vouchers", value: String(kpis.voucherCount) },
    { label: "Average per voucher", value: fmtAmount(kpis.averagePerVoucher) },
    { label: "Largest voucher", value: fmtAmount(kpis.largestVoucher) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-muted/50 rounded-lg p-4">
          <p className="text-muted-foreground text-xs">{item.label}</p>
          <p className="mt-1 text-xl font-medium tabular-nums">{item.value}</p>
        </div>
      ))}
    </div>
  );
}