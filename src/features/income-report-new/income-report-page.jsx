// import { useState } from "react";
// import {
//   IconAlertTriangle,
//   IconCheck,
//   IconPrinter,
//   IconReportMoney,
// } from "@tabler/icons-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Empty,
//   EmptyDescription,
//   EmptyHeader,
//   EmptyMedia,
//   EmptyTitle,
// } from "@/components/ui/empty";
// import { Spinner } from "@/components/ui/spinner";
// import IncomeReportFilters from "./income-filter";
// import IncomeReportKpis from "./income-report-kpi-card";
// import { ByHeadTable, DetailTable, MonthlyTable } from "./income-table";
// import { useIncomeReport, useIncomeReportFilters } from "./queries";
// import { fmtDate, toISODate } from "./utils";

// // Default range: current year-er 1 Jan theke aj porjonto (filter diye bodlano jay)
// const getDefaultFilters = () => {
//   const now = new Date();
//   return {
//     from: toISODate(new Date(now.getFullYear(), 0, 1)),
//     to: toISODate(now),
//     head: "",
//   };
// };

// export default function IncomeReportPage() {
//   const [applied, setApplied] = useState(getDefaultFilters);

//   const filtersQuery = useIncomeReportFilters();
//   const report = useIncomeReport(applied);
//   const data = report.data;

//   return (
//     <div className="space-y-4 p-8">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <h2 className="text-base font-medium">Income report</h2>
//           <p className="text-muted-foreground text-xs">
//             {fmtDate(applied.from)} to {fmtDate(applied.to)} · Date basis: GL
//             entry date
//           </p>
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           className="print:hidden"
//           onClick={() => window.print()}
//         >
//           <IconPrinter className="size-4" />
//           Print
//         </Button>
//       </div>

//       <IncomeReportFilters
//         value={applied}
//         heads={filtersQuery.data?.heads}
//         isFetching={report.isFetching}
//         onApply={setApplied}
//       />

//       {report.isLoading && (
//         <div className="flex justify-center py-16">
//           <Spinner />
//         </div>
//       )}

//       {report.isError && (
//         <Alert variant="destructive">
//           <AlertTitle>Report load kora jay nai</AlertTitle>
//           <AlertDescription className="flex items-center justify-between gap-3">
//             <span>{report.error?.message}</span>
//             <Button variant="outline" size="sm" onClick={() => report.refetch()}>
//               Retry
//             </Button>
//           </AlertDescription>
//         </Alert>
//       )}

//       {data && data.details.length === 0 && (
//         <Empty>
//           <EmptyHeader>
//             <EmptyMedia variant="icon">
//               <IconReportMoney />
//             </EmptyMedia>
//             <EmptyTitle>Kono income paoa jai nai</EmptyTitle>
//             <EmptyDescription>
//               Ei date range ba head-e kono income voucher nai. Date bodle abar
//               try koro.
//             </EmptyDescription>
//           </EmptyHeader>
//         </Empty>
//       )}

//       {data && data.details.length > 0 && (
//         <>
//           <IncomeReportKpis kpis={data.kpis} />
//           <ByHeadTable byHead={data.byHead} />
//           <MonthlyTable monthly={data.monthly} />
//           <DetailTable
//             details={data.details}
//             from={data.filters.from}
//             to={data.filters.to}
//           />
//           {/* <div className="flex flex-wrap gap-2 text-xs print:hidden">
//             <Check ok={data.checks.byHeadEqualsKpi}>
//               By head total matches KPI total
//             </Check>
//             <Check ok={data.checks.monthlyEqualsKpi}>
//               Monthly total matches KPI total
//             </Check>
//           </div> */}
//         </>
//       )}
//     </div>
//   );
// }

// function Check({ ok, children }) {
//   return (
//     <span
//       className={
//         ok
//           ? "inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-green-800 dark:bg-green-950 dark:text-green-300"
//           : "bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-md px-2 py-1"
//       }
//     >
//       {ok ? (
//         <IconCheck className="size-3.5" />
//       ) : (
//         <IconAlertTriangle className="size-3.5" />
//       )}
//       {children}
//     </span>
//   );
// }

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
import IncomeReportFilters from "./income-filter";
import IncomeReportKpis from "./income-report-kpi-card";
import { ByHeadTable, DetailTable, MonthlyTable } from "./income-table";
import { useIncomeReport, useIncomeReportFilters } from "./queries";
import { exportCsv, fmtDate, toISODate } from "./utils";

// Default range: current year-er 1 Jan theke aj porjonto (filter diye bodlano jay)
const getDefaultFilters = () => {
  const now = new Date();
  return {
    from: toISODate(new Date(now.getFullYear(), 0, 1)),
    to: toISODate(now),
    head: "",
  };
};

export default function IncomeReportPage() {
  const [applied, setApplied] = useState(getDefaultFilters);

  const filtersQuery = useIncomeReportFilters();
  const report = useIncomeReport(applied);
  const data = report.data;

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-medium">Income report</h2>
          <p className="text-muted-foreground text-xs">
            {fmtDate(applied.from)} to {fmtDate(applied.to)} · Date basis: GL
            entry date
          </p>
        </div>
        {data && data.details.length > 0 && (
          <Button
            variant="outline"
            size="sm"
           onClick={() => exportCsv(data)}
          >
            <IconDownload className="size-4" />
            Export CSV
          </Button>
        )}
      </div>

      <IncomeReportFilters
        value={applied}
        heads={filtersQuery.data?.heads}
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
            <EmptyTitle>income empty</EmptyTitle>
            <EmptyDescription>
              please again another date
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {data && data.details.length > 0 && (
        <>
          <IncomeReportKpis kpis={data.kpis} />
          <ByHeadTable byHead={data.byHead} />
          <MonthlyTable monthly={data.monthly} />
          <DetailTable details={data.details} />
          {/* <div className="flex flex-wrap gap-2 text-xs print:hidden">
            <Check ok={data.checks.byHeadEqualsKpi}>
              By head total matches KPI total
            </Check>
            <Check ok={data.checks.monthlyEqualsKpi}>
              Monthly total matches KPI total
            </Check>
          </div> */}
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