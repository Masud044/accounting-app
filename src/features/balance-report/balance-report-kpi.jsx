import { fmtAmount } from "./utils";

export default function BalanceSheetKpis({ kpis }) {
  const items = [
    { label: "Total assets", value: kpis.totalAssets },
    { label: "Total liabilities", value: kpis.totalLiabilities },
    { label: "Total owner's equity", value: kpis.totalEquity },
    { label: "Net profit / (loss)", value: kpis.netProfit },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-muted/50 rounded-lg p-4">
          <p className="text-muted-foreground text-xs">{item.label}</p>
          <p
            className={`mt-1 truncate text-xl font-medium tabular-nums ${
              item.value < 0 ? "text-destructive" : ""
            }`}
          >
            {fmtAmount(item.value)}
          </p>
        </div>
      ))}
    </div>
  );
}