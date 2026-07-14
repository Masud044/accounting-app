import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCashFlowDetails } from "./queries";

const formatAmount = (n) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0);

const CashFlowDetails = ({ applied }) => {
  const { data, isLoading, isError, error } = useCashFlowDetails(applied);
  const rows = data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cash Flow Details by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : isError ? (
          <p className="text-sm text-destructive">{error?.message || "Failed to load details"}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No data found for selected range
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.CATEGORY}>
                    <TableCell>{row.CATEGORY}</TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        row.AMOUNT >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatAmount(row.AMOUNT)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowDetails;