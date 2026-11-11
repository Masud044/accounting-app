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
import BalanceSheetFilters from "./balance-report-filter";
import BalanceSheetKpis from "./balance-report-kpi";
import {
  EquitySection,
  GroupedSection,
  TotalSection,
} from "./balance-report-table";
import { useBalanceSheet } from "./queries";
import { exportExcel, fmtAmount, fmtDate, toISODate } from "./utils";

// Default range: current year-er 1 Jan theke aj porjonto (filter diye bodlano jay)
const getDefaultFilters = () => {
  const now = new Date();
  return {
    from: toISODate(new Date(now.getFullYear(), 0, 1)),
    to: toISODate(now),
  };
};

export default function BalanceSheetPage() {
  const [applied, setApplied] = useState(getDefaultFilters);
  const report = useBalanceSheet(applied);
  const data = report.data;

  const isEmpty =
    data &&
    data.assets.groups.length === 0 &&
    data.liabilities.groups.length === 0 &&
    data.equity.groups.length === 0 &&
    data.equity.income.closing === 0 &&
    data.equity.expense.closing === 0;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-medium">Balance sheet</h2>
          <p className="text-muted-foreground text-xs">
            {fmtDate(applied.from)} to {fmtDate(applied.to)} · Date basis: GL
            entry date
          </p>
        </div>
        {data && !isEmpty && (
          <Button variant="outline" size="sm" onClick={() => exportExcel(data)}>
            <IconDownload className="size-4" />
            Export Excel
          </Button>
        )}
      </div>

      <BalanceSheetFilters
        value={applied}
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

      {isEmpty && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconReportMoney />
            </EmptyMedia>
            <EmptyTitle>Kono data paoa jai nai</EmptyTitle>
            <EmptyDescription>
              Ei tarikh porjonto kono voucher nai. Date bodle abar try koro.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {data && !isEmpty && (
        <>
          <BalanceSheetKpis kpis={data.kpis} />

          <GroupedSection
            title="Assets"
            section={data.assets}
            totalLabel="Total assets"
            emptyText="Kono asset account nai"
          />
          <GroupedSection
            title="Liabilities"
            section={data.liabilities}
            totalLabel="Total liabilities"
            emptyText="Kono liability account nai"
          />
          <EquitySection equity={data.equity} />
          <TotalSection
            label="Total liabilities + owner's equity"
            value={data.totalLiabilitiesEquity}
          />

          {/* <Check ok={data.check.balanced}>
            {data.check.balanced
              ? "Assets = Liabilities + Equity (opening ar closing duitei)"
              : `Mile nai: closing difference ${fmtAmount(data.check.difference)}`}
          </Check> */}

          {data.unclassified.length > 0 && (
            <Alert variant="destructive">
              <AlertTitle>Root chhara account ache</AlertTitle>
              <AlertDescription>
                {data.unclassified
                  .map((a) => `${a.code} ${a.name} (${fmtAmount(a.amount)})`)
                  .join(", ")}
              </AlertDescription>
            </Alert>
          )}

          {data.skippedVouchers.length > 0 && (
            <p className="text-muted-foreground text-xs">
              Debit ar credit mile nai, tai skip kora voucher:{" "}
              {data.skippedVouchers
                .map(
                  (v) =>
                    `${v.voucherNo} (Dr ${fmtAmount(v.debit)} / Cr ${fmtAmount(v.credit)})`
                )
                .join(", ")}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function Check({ ok, children }) {
  return (
    <span
      className={
        ok
          ? "inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-950 dark:text-green-300"
          : "bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs"
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