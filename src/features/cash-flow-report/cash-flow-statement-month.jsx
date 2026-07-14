import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCashFlowStatement } from "./queries";

const formatAmount = (n) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0);

const MONTH_OPTIONS = [
  { value: 1, label: "January" }, { value: 2, label: "February" },
  { value: 3, label: "March" },   { value: 4, label: "April" },
  { value: 5, label: "May" },     { value: 6, label: "June" },
  { value: 7, label: "July" },    { value: 8, label: "August" },
  { value: 9, label: "September" },{ value: 10, label: "October" },
  { value: 11, label: "November" },{ value: 12, label: "December" },
];

const YEAR_OPTIONS = [2026, 2027, 2028, 2029, 2030];

const getMonthRange = (fromYear, fromMonth, toYear, toMonth) => {
  const fromDate = new Date(fromYear, fromMonth - 1, 1).toISOString().slice(0, 10);
  const toDate = new Date(toYear, toMonth, 0).toISOString().slice(0, 10); // last day of toMonth
  return { fromDate, toDate };
};

const CashFlowStatement = () => {
  const now = new Date();
  const defaultYear = now.getFullYear() >= 2026 ? now.getFullYear() : 2026;

  const [fromMonth, setFromMonth] = useState(1);
  const [fromYear, setFromYear] = useState(defaultYear);
  const [toMonth, setToMonth] = useState(12);
  const [toYear, setToYear] = useState(defaultYear);

  const applied = useMemo(
    () => getMonthRange(fromYear, fromMonth, toYear, toMonth),
    [fromYear, fromMonth, toYear, toMonth]
  );

  const { data, isLoading, isError, error } = useCashFlowStatement(applied);
  const rows = data || [];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Monthly Cash Flow Statement</CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(fromMonth)} onValueChange={(v) => setFromMonth(Number(v))}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(fromYear)} onValueChange={(v) => setFromYear(Number(v))}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground">to</span>

          <Select value={String(toMonth)} onValueChange={(v) => setToMonth(Number(v))}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTH_OPTIONS.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(toYear)} onValueChange={(v) => setToYear(Number(v))}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEAR_OPTIONS.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : isError ? (
          <p className="text-sm text-destructive">{error?.message || "Failed to load statement"}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Cash Inflow</TableHead>
                <TableHead className="text-right">Cash Outflow</TableHead>
                <TableHead className="text-right">Net Cash Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No data found for selected range
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.PERIOD}>
                    <TableCell>{row.PERIOD}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatAmount(row.CASH_INFLOW)}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatAmount(row.CASH_OUTFLOW)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatAmount(row.NET_CASH_FLOW)}
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

export default CashFlowStatement;