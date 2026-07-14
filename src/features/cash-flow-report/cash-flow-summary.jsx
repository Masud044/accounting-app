import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCashFlowSummary } from "./queries";

const formatAmount = (n) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0);

const CashFlowSummary = ({ applied }) => {
  const { data, isLoading, isError, error } = useCashFlowSummary(applied);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-destructive">
          {error?.message || "Failed to load cash flow summary"}
        </CardContent>
      </Card>
    );
  }

  const rows = data || [];

  const tone = (lineName) => {
    if (lineName === "Operating Cash Outflow") return "text-red-600";
    if (lineName === "Operating Cash Inflow") return "text-green-600";
    if (lineName === "Net Cash Flow") return "text-blue-600";
    return "text-foreground";
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {rows.map((row) => (
        <Card key={row.LINE_NAME}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {row.LINE_NAME}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-lg font-semibold ${tone(row.LINE_NAME)}`}>
              {formatAmount(row.AMOUNT)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CashFlowSummary;