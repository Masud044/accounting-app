import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CashFlowSummary from "./cash-flow-summary";
import CashFlowStatement from "./cash-flow-statement-month";
import CashFlowDetails from "./cash-flow-details";

const getDefaultRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    fromDate: first.toISOString().slice(0, 10),
    toDate: last.toISOString().slice(0, 10),
  };
};

const CashFlowReport = () => {
  const [filters, setFilters] = useState(getDefaultRange());
  const [applied, setApplied] = useState(getDefaultRange());

  const handleApply = () => setApplied(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Cash Flow Report</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters((p) => ({ ...p, fromDate: e.target.value }))}
              className="w-[180px]"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters((p) => ({ ...p, toDate: e.target.value }))}
              className="w-[180px]"
            />
          </div>
          <Button onClick={handleApply}>Apply</Button>
        </CardContent>
      </Card>

      <CashFlowSummary applied={applied} />
      <CashFlowStatement applied={applied} />
      <CashFlowDetails applied={applied} />
    </div>
  );
};

export default CashFlowReport;