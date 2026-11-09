import { useState } from "react";
import {
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconReportMoney,
} from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import ExpenseReportFilters from "./expense-report-filter";
import ExpenseReportKpis from "./expense-kpi-card";
import {
  ByCategoryTable,
  ByProjectTable,
  DetailTable,
} from "./expense-report-table";
import { useExpenseReport, useExpenseReportFilters } from "./queries";
import { exportCsv, fmtAmount, fmtDate, toISODate } from "./utils";

// Default range: current year-er 1 Jan theke aj porjonto (filter diye bodlano jay)
const getDefaultFilters = () => {
  const now = new Date();
  return {
    from: toISODate(new Date(now.getFullYear(), 0, 1)),
    to: toISODate(now),
    project: "",
    category: "",
  };
};

export default function ExpenseReportPage() {
  const [applied, setApplied] = useState(getDefaultFilters);

  const filtersQuery = useExpenseReportFilters();
  const report = useExpenseReport(applied);
  const data = report.data;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-medium">Expense report</h2>
          <p className="text-muted-foreground text-xs">
            {fmtDate(applied.from)} to {fmtDate(applied.to)} · Date basis: GL
            entry date
          </p>
        </div>
        {data && data.details.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportCsv(data.details, data.filters.from, data.filters.to)
            }
          >
            <IconDownload className="size-4" />
            Export CSV
          </Button>
        )}
      </div>

      <ExpenseReportFilters
        value={applied}
        projects={filtersQuery.data?.projects}
        categories={filtersQuery.data?.categories}
        isFetching={report.isFetching}
        onApply={setApplied}
      />

      {report.isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {report.isError && (
        <Alert variant="destructive">
          <AlertTitle>Report load kora jay nai</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-3">
            <span>{report.error?.message}</span>
            <Button variant="outline" size="sm" onClick={() => report.refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {data && data.details.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReportMoney />
            </EmptyMedia>
            <EmptyTitle>Kono expense paoa jai nai</EmptyTitle>
            <EmptyDescription>
              Ei date range, project ba category-te kono expense voucher nai.
              Filter bodle abar try koro.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {data && data.details.length > 0 && (
        <>
          <ExpenseReportKpis kpis={data.kpis} />
          <ByProjectTable byProject={data.byProject} />
          <ByCategoryTable byCategory={data.byCategory} />
          <DetailTable details={data.details} />
          {/* <div className="flex flex-wrap gap-2 text-xs">
            <Check ok={data.checks.byProjectEqualsKpi}>
              Project total matches KPI total
            </Check>
            <Check ok={data.checks.byMonthEqualsKpi}>
              Monthly total matches KPI total
            </Check>
            <Check ok={data.checks.byCategoryEqualsKpi}>
              Category total matches KPI total
            </Check>
          </div> */}
        </>
      )}

      {/* {data && data.skippedVouchers.length > 0 && (
        <p className="text-muted-foreground text-xs">
          Debit ar credit mile nai, tai skip kora voucher:{" "}
          {data.skippedVouchers
            .map(
              (v) =>
                `${v.voucherNo} (Dr ${fmtAmount(v.debit)} / Cr ${fmtAmount(v.credit)})`
            )
            .join(", ")}
        </p>
      )} */}
    </div>
  );
}

function Check({ ok, children }) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-green-800 dark:bg-green-950 dark:text-green-300"
          : "bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-md px-2 py-1"
      }
    >
      {ok ? (
        <IconCheck className="size-3.5" />
      ) : (
        <IconAlertTriangle className="size-3.5" />
      )}
      {children}
    </span>
  );
}