// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import * as XLSX from "xlsx";
// import {
//   IconCalendarStats,
//   IconTarget,
//   IconChecklist,
//   IconTrendingUp,
//   IconArrowLeft,
//   IconVaccine,
//   IconPlant2,
//   IconCoin,
//   IconDownload,
// } from "@tabler/icons-react";

// import { SectionContainer } from "@/components/SectionContainer";
// import {
//   Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";

// // ── API base + fetcher (matches farmProject hooks pattern) ────────────────
// const BASE = import.meta.env.VITE_API_BASE_URL;
// const API = `${BASE}/api/farm-calendar-report`;

// const fetchJSON = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// // ── Query key + fetcher ─────────────────────────────────────────────────
// export const farmCalendarReportKeys = {
//   all:    ["farmCalendarReport"],
//   detail: (id) => [...farmCalendarReportKeys.all, "detail", id],
// };

// const fetchFarmCalendarReport = (calendarId) => fetchJSON(`${API}/${calendarId}`);

// const fmtMoney = (v) =>
//   v == null ? "—" : `BDT ${Number(v).toLocaleString()}`;

// // ── Excel export builder (mirrors original Annual Operational Calendar layout) ──
// function buildReportWorkbook(report) {
//   const {
//     header,
//     operationalCalendar,
//     routineActivities = [],
//     vaccinationCalendar = [],
//     feedCalendar = [],
//     financialCalendar = [],
//     kpiTargets = [],
//     expectedAnnualOutput = {},
//   } = report;

//   const rows = [];
//   const push = (...cells) => rows.push(cells);
//   const blank = () => rows.push([]);
//   const monthOf = (a) => a.MONTH_NAME ?? a.MONTH_LABEL ?? "—";

//   push("Annual Operational Calendar");
//   blank();
//   push(`${header.FARM_NAME}${header.CAPACITY ? ` (${header.CAPACITY})` : ""}`);
//   blank();

//   push(operationalCalendar.cycle1.title);
//   blank();
//   push("Month", "Activities");
//   operationalCalendar.cycle1.activities.forEach((a) =>
//     push(a.MONTH_NAME, a.ACTIVITY_NAME || a.ACTIVITY_DESC)
//   );
//   blank(); blank();

//   push(operationalCalendar.cycle2.title);
//   blank();
//   push("Month", "Activities");
//   operationalCalendar.cycle2.activities.forEach((a) =>
//     push(a.MONTH_NAME, a.ACTIVITY_NAME || a.ACTIVITY_DESC)
//   );
//   blank(); blank();

//   push("Monthly Routine Activities");
//   blank();
//   push("Activity", "Frequency");
//   routineActivities.forEach((r) =>
//     push(r.ACTIVITY_NAME || r.ACTIVITY_DESC, r.FREQUENCY)
//   );
//   blank(); blank();

//   push("Vaccination & Health Calendar");
//   blank();
//   push("Month", "Activity");
//   vaccinationCalendar.forEach((v) =>
//     push(monthOf(v), v.ACTIVITY_NAME || v.ACTIVITY_DESC)
//   );
//   blank(); blank();

//   push("Feed Production & Procurement Calendar");
//   blank();
//   push("Month", "Activity");
//   feedCalendar.forEach((f) =>
//     push(monthOf(f), f.ACTIVITY_NAME || f.ACTIVITY_DESC)
//   );
//   blank(); blank();

//   push("Financial Calendar");
//   blank();
//   push("Month", "Activity");
//   financialCalendar.forEach((f) =>
//     push(monthOf(f), f.ACTIVITY_NAME || f.ACTIVITY_DESC)
//   );
//   blank(); blank();

//   push("Key Performance Indicators (KPIs)");
//   blank();
//   push("KPI", "Target");
//   kpiTargets.forEach((k) => push(k.KPI_NAME, k.TARGET_VALUE));
//   blank(); blank();

//   push("Expected Annual Output");
//   blank();
//   if (expectedAnnualOutput?.cattleFattenedCount != null)
//     push(`Number of Cattle Fattened: ${expectedAnnualOutput.cattleFattenedCount}`);
//   if (expectedAnnualOutput?.salesCyclesCount != null)
//     push(`Number of Sales Cycles: ${expectedAnnualOutput.salesCyclesCount}`);
//   if (expectedAnnualOutput?.estimatedAnnualRevenue != null)
//     push(`Estimated Annual Revenue: ${fmtMoney(expectedAnnualOutput.estimatedAnnualRevenue)}`);
//   if (expectedAnnualOutput?.estimatedAnnualGrossProfit != null)
//     push(`Estimated Annual Gross Profit: ${fmtMoney(expectedAnnualOutput.estimatedAnnualGrossProfit)}`);
//   blank();

//   if (header.REVIEW_NOTE) push(header.REVIEW_NOTE);

//   const ws = XLSX.utils.aoa_to_sheet(rows);
//   ws["!cols"] = [{ wch: 28 }, { wch: 70 }];
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Calendar");
//   return wb;
// }

// const handleExportExcel = (report) => {
//   const wb = buildReportWorkbook(report);
//   const fileName = `Farm_Calendar_${(report.header.FARM_NAME || "report").replace(/\s+/g, "_")}_${report.header.CALENDAR_YEAR}.xlsx`;
//   XLSX.writeFile(wb, fileName);
// };

// // ── Small presentational helpers ───────────────────────────────────────
// function StatCard({ icon: Icon, label, value, accent = "text-primary" }) {
//   return (
//     <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
//       <div className={`rounded-md bg-muted p-2 ${accent}`}>
//         <Icon size={20} />
//       </div>
//       <div>
//         <p className="text-xs text-muted-foreground">{label}</p>
//         <p className="text-lg font-semibold">{value ?? "—"}</p>
//       </div>
//     </div>
//   );
// }

// function CycleTable({ title, activities }) {
//   return (
//     <div className="space-y-2">
//       <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-28">Month</TableHead>
//             <TableHead>Activity</TableHead>
//             <TableHead className="w-32">Farm Type</TableHead>
//             <TableHead className="w-28">Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {activities.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
//                 No activities recorded.
//               </TableCell>
//             </TableRow>
//           )}
//           {activities.map((a) => (
//             <TableRow key={a.DETAIL_ID}>
//               <TableCell className="font-medium">{a.MONTH_NAME}</TableCell>
//               <TableCell>{a.ACTIVITY_NAME || a.ACTIVITY_DESC}</TableCell>
//               <TableCell>{a.FARM_TYPE || "—"}</TableCell>
//               <TableCell>
//                 <Badge variant={a.STATUS === "COMPLETED" ? "default" : "secondary"}>
//                   {a.STATUS || "PLANNED"}
//                 </Badge>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// // ── Generic Month + Activity table (Vaccination / Feed / Financial calendars) ──
// function ActivityCalendarTable({ icon: Icon, title, activities }) {
//   return (
//     <div className="space-y-2">
//       <h3 className="flex items-center gap-2 text-base font-semibold">
//         {/* <Icon size={18} className="text-primary" /> */}
//         {title}
//       </h3>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-40">Month</TableHead>
//             <TableHead>Activity</TableHead>
//             <TableHead>Remarks</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {activities.length === 0 && (
//             <TableRow>
//               <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
//                 No {title.toLowerCase()} activities recorded.
//               </TableCell>
//             </TableRow>
//           )}
//           {activities.map((a) => (
//             <TableRow key={a.DETAIL_ID}>
//               <TableCell className="font-medium">{a.MONTH_NAME ?? "—"}</TableCell>
//               <TableCell>{a.ACTIVITY_NAME || a.ACTIVITY_DESC}</TableCell>
//               <TableCell className="text-xs text-muted-foreground">{a.REMARKS ?? "—"}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

// // ── Back button (shared across all render states) ─────────────────────
// function BackButton({ onClick }) {
//   return (
//     <Button
//       variant="ghost"
//       size="sm"
//       onClick={onClick}
//     >
//       <IconArrowLeft size={16} className="mr-1" />
//       Back to Calendars
//     </Button>
//   );
// }

// // ── Main page ────────────────────────────────────────────────────────────
// export default function FarmCalendarReportPage() {
//   const { calendarId } = useParams();
//   const navigate = useNavigate();

//   const goBack = () => navigate("/dashboard/farm-calendar-report");

//   const { data: report, isLoading, isError } = useQuery({
//     queryKey: farmCalendarReportKeys.detail(calendarId),
//     queryFn: () => fetchFarmCalendarReport(calendarId),
//     enabled: !!calendarId,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

//   if (isLoading) {
//     return (
//       <SectionContainer title="Farm Calendar Report">
//         <BackButton onClick={goBack} />
//         <div className="space-y-3">
//           <Skeleton className="h-24 w-full" />
//           <Skeleton className="h-64 w-full" />
//         </div>
//       </SectionContainer>
//     );
//   }

//   if (isError || !report) {
//     return (
//       <SectionContainer title="Farm Calendar Report">
//         <BackButton onClick={goBack} />
//         <p className="text-sm text-destructive">
//           Report could not be loaded. Please confirm the calendar exists and try again.
//         </p>
//       </SectionContainer>
//     );
//   }

//   const {
//     header,
//     operationalCalendar,
//     routineActivities=[],
//     vaccinationCalendar = [],
//     feedCalendar = [],
//     financialCalendar = [],
//     kpiTargets=[],
//     actualPerformance,
//     expectedAnnualOutput,
//   } = report;

//   return (
//     <SectionContainer
//       title={`Farm Calendar Report — ${header.FARM_NAME}`}
//       description={`${header.CALENDAR_YEAR} · Status: ${header.STATUS}`}
//     >
//       <div className="mb-4 flex items-center justify-between">
//         <BackButton onClick={goBack} />
//         <Button variant="outline" size="sm" onClick={() => handleExportExcel(report)}>
//           <IconDownload size={16} className="mr-1" />
//           Export to Excel
//         </Button>
//       </div>

//       <div className="space-y-8">
//         {/* Summary cards */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <StatCard
//             icon={IconCalendarStats}
//             label="Cycles Completed"
//             value={actualPerformance?.CYCLES_COMPLETED ?? 0}
//           />
//           <StatCard
//             icon={IconChecklist}
//             label="Actual Qty (Head)"
//             value={actualPerformance?.TOTAL_ACTUAL_QTY ?? 0}
//           />
//           <StatCard
//             icon={IconTrendingUp}
//             label="Actual Revenue (BDT)"
//             value={actualPerformance?.TOTAL_ACTUAL_REVENUE?.toLocaleString() ?? 0}
//             accent="text-emerald-600"
//           />
//           <StatCard
//             icon={IconTarget}
//             label="Actual Cost (BDT)"
//             value={actualPerformance?.TOTAL_ACTUAL_COST?.toLocaleString() ?? 0}
//             accent="text-amber-600"
//           />
//         </div>

//         {/* Cycle-wise operational calendar */}
//         <div className="space-y-6">
//           <h3 className="text-base font-semibold">Operational & Activity Calendar</h3>
//           <CycleTable
//             title={operationalCalendar.cycle1.title}
//             activities={operationalCalendar.cycle1.activities}
//           />
//           <CycleTable
//             title={operationalCalendar.cycle2.title}
//             activities={operationalCalendar.cycle2.activities}
//           />
//         </div>

//         {/* Routine activities */}
//         <div className="space-y-2">
//           <h3 className="text-base font-semibold">Monthly Routine Activities</h3>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Activity</TableHead>
//                 <TableHead className="w-40">Frequency</TableHead>
//                 <TableHead className="w-32">Farm Type</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {routineActivities.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
//                     No routine activities recorded.
//                   </TableCell>
//                 </TableRow>
//               )}
//               {routineActivities.map((r) => (
//                 <TableRow key={r.DETAIL_ID}>
//                   <TableCell>{r.ACTIVITY_NAME || r.ACTIVITY_DESC}</TableCell>
//                   <TableCell>{r.FREQUENCY}</TableCell>
//                   <TableCell>{r.FARM_TYPE || "—"}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Vaccination & Health Calendar */}
//         <ActivityCalendarTable
//           icon={IconVaccine}
//           title="Vaccination & Health Calendar"
//           activities={vaccinationCalendar}
//         />

//         {/* Feed Production & Procurement Calendar */}
//         <ActivityCalendarTable
//           icon={IconPlant2}
//           title="Feed Production & Procurement Calendar"
//           activities={feedCalendar}
//         />

//         {/* Financial Calendar */}
//         <ActivityCalendarTable
//           icon={IconCoin}
//           title="Financial Calendar"
//           activities={financialCalendar}
//         />

//         {/* KPI targets vs actuals */}
//         <div className="space-y-2">
//           <h3 className="text-base font-semibold">Key Performance Indicators</h3>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>KPI</TableHead>
//                 <TableHead className="w-32">Target</TableHead>
//                 <TableHead className="w-32">Actual</TableHead>
//                 <TableHead className="w-24">Unit</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {kpiTargets.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
//                     No KPI targets set.
//                   </TableCell>
//                 </TableRow>
//               )}
//               {kpiTargets.map((k) => (
//                 <TableRow key={k.KPI_ID}>
//                   <TableCell className="font-medium">{k.KPI_NAME}</TableCell>
//                   <TableCell>{k.TARGET_VALUE}</TableCell>
//                   <TableCell>{k.ACTUAL_VALUE ?? "—"}</TableCell>
//                   <TableCell>{k.UNIT || "—"}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>

//         {/* Expected Annual Output — from named KPI rows, may be blank */}
//        {/* Expected Annual Output — always shown as cards, "—" when a KPI row is missing */}
// <div className="space-y-2">
//   <h3 className="text-base font-semibold">Expected Annual Output</h3>
//   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
//     <StatCard
//       icon={IconChecklist}
//       label="Cattle Fattened"
//       value={expectedAnnualOutput?.cattleFattenedCount ?? "—"}
//     />
//     <StatCard
//       icon={IconCalendarStats}
//       label="Sales Cycles"
//       value={expectedAnnualOutput?.salesCyclesCount ?? "—"}
//     />
//     <StatCard
//       icon={IconTrendingUp}
//       label="Estimated Revenue"
//       value={fmtMoney(expectedAnnualOutput?.estimatedAnnualRevenue)}
//       accent="text-emerald-600"
//     />
//     <StatCard
//       icon={IconCoin}
//       label="Estimated Gross Profit"
//       value={fmtMoney(expectedAnnualOutput?.estimatedAnnualGrossProfit)}
//       accent="text-amber-600"
//     />
//   </div>
// </div>
//       </div>
//     </SectionContainer>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import {
  IconCalendarStats,
  IconTarget,
  IconChecklist,
  IconTrendingUp,
  IconArrowLeft,
  IconVaccine,
  IconPlant2,
  IconCoin,
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import { Printer } from "lucide-react";

import { SectionContainer } from "@/components/SectionContainer";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher ───────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/farm-calendar-report`;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

// ── Query key + fetcher ──────────────────────────────────────────────────────
export const farmCalendarReportKeys = {
  all: ["farmCalendarReport"],
  detail: (id) => [...farmCalendarReportKeys.all, "detail", id],
};

const fetchFarmCalendarReport = (calendarId) => fetchJSON(`${API}/${calendarId}`);

const fmtMoney = (v) =>
  v == null ? "—" : `BDT ${Number(v).toLocaleString()}`;

// ── Excel export builder ─────────────────────────────────────────────────────
function buildReportWorkbook(report) {
  const {
    header,
    operationalCalendar,
    routineActivities = [],
    vaccinationCalendar = [],
    feedCalendar = [],
    financialCalendar = [],
    kpiTargets = [],
    expectedAnnualOutput = {},
  } = report;

  const rows = [];
  const push = (...cells) => rows.push(cells);
  const blank = () => rows.push([]);
  const monthOf = (a) => a.MONTH_NAME ?? a.MONTH_LABEL ?? "—";

  push("Annual Operational Calendar");
  blank();
  push(`${header.FARM_NAME}${header.CAPACITY ? ` (${header.CAPACITY})` : ""}`);
  blank();

  push(operationalCalendar.cycle1.title);
  blank();
  push("Month", "Activities");
  operationalCalendar.cycle1.activities.forEach((a) =>
    push(a.MONTH_NAME, a.ACTIVITY_NAME || a.ACTIVITY_DESC)
  );
  blank(); blank();

  push(operationalCalendar.cycle2.title);
  blank();
  push("Month", "Activities");
  operationalCalendar.cycle2.activities.forEach((a) =>
    push(a.MONTH_NAME, a.ACTIVITY_NAME || a.ACTIVITY_DESC)
  );
  blank(); blank();

  push("Monthly Routine Activities");
  blank();
  push("Activity", "Frequency");
  routineActivities.forEach((r) =>
    push(r.ACTIVITY_NAME || r.ACTIVITY_DESC, r.FREQUENCY)
  );
  blank(); blank();

  push("Vaccination & Health Calendar");
  blank();
  push("Month", "Activity");
  vaccinationCalendar.forEach((v) =>
    push(monthOf(v), v.ACTIVITY_NAME || v.ACTIVITY_DESC)
  );
  blank(); blank();

  push("Feed Production & Procurement Calendar");
  blank();
  push("Month", "Activity");
  feedCalendar.forEach((f) =>
    push(monthOf(f), f.ACTIVITY_NAME || f.ACTIVITY_DESC)
  );
  blank(); blank();

  push("Financial Calendar");
  blank();
  push("Month", "Activity");
  financialCalendar.forEach((f) =>
    push(monthOf(f), f.ACTIVITY_NAME || f.ACTIVITY_DESC)
  );
  blank(); blank();

  push("Key Performance Indicators (KPIs)");
  blank();
  push("KPI", "Target");
  kpiTargets.forEach((k) => push(k.KPI_NAME, k.TARGET_VALUE));
  blank(); blank();

  push("Expected Annual Output");
  blank();
  if (expectedAnnualOutput?.cattleFattenedCount != null)
    push(`Number of Cattle Fattened: ${expectedAnnualOutput.cattleFattenedCount}`);
  if (expectedAnnualOutput?.salesCyclesCount != null)
    push(`Number of Sales Cycles: ${expectedAnnualOutput.salesCyclesCount}`);
  if (expectedAnnualOutput?.estimatedAnnualRevenue != null)
    push(`Estimated Annual Revenue: ${fmtMoney(expectedAnnualOutput.estimatedAnnualRevenue)}`);
  if (expectedAnnualOutput?.estimatedAnnualGrossProfit != null)
    push(`Estimated Annual Gross Profit: ${fmtMoney(expectedAnnualOutput.estimatedAnnualGrossProfit)}`);
  blank();

  if (header.REVIEW_NOTE) push(header.REVIEW_NOTE);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 28 }, { wch: 70 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Calendar");
  return wb;
}

const handleExportExcel = (report) => {
  const wb = buildReportWorkbook(report);
  const fileName = `Farm_Calendar_${(report.header.FARM_NAME || "report").replace(/\s+/g, "_")}_${report.header.CALENDAR_YEAR}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

// ── Presentational helpers ──────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
    rose: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md hover:border-gray-300">
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${colors[color] || colors.emerald}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-base font-bold text-gray-900 truncate">{value ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={18} className="text-emerald-700" />}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ colSpan, label }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-sm text-gray-400">
        No {label} recorded.
      </TableCell>
    </TableRow>
  );
}

function CycleTable({ title, activities }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-medium text-gray-500 w-28">Month</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Activity</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 w-32">Farm Type</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 w-28">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 && <EmptyRow colSpan={4} label="activities" />}
            {activities.map((a) => (
              <TableRow key={a.DETAIL_ID} className="hover:bg-gray-50/70 transition-colors">
                <TableCell className="text-sm font-medium text-gray-700">{a.MONTH_NAME}</TableCell>
                <TableCell className="text-sm text-gray-600">{a.ACTIVITY_NAME || a.ACTIVITY_DESC}</TableCell>
                <TableCell className="text-sm text-gray-500">{a.FARM_TYPE || "—"}</TableCell>
                <TableCell>
                  <Badge className={a.STATUS === "COMPLETED" 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }>
                    {a.STATUS || "PLANNED"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ActivityCalendarTable({ icon: Icon, title, activities }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs font-medium text-gray-500 w-40">Month</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Activity</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 && <EmptyRow colSpan={3} label={`${title.toLowerCase()} activities`} />}
            {activities.map((a) => (
              <TableRow key={a.DETAIL_ID} className="hover:bg-gray-50/70 transition-colors">
                <TableCell className="text-sm font-medium text-gray-700">{a.MONTH_NAME ?? "—"}</TableCell>
                <TableCell className="text-sm text-gray-600">{a.ACTIVITY_NAME || a.ACTIVITY_DESC}</TableCell>
                <TableCell className="text-sm text-gray-500">{a.REMARKS ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FarmCalendarReportPage() {
  const { calendarId } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard/farm-calendar-report");

  const { data: report, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: farmCalendarReportKeys.detail(calendarId),
    queryFn: () => fetchFarmCalendarReport(calendarId),
    enabled: !!calendarId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-500 hover:text-gray-700">
                <IconArrowLeft size={16} className="mr-1.5" /> Back
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <span className="text-red-600 text-xl">⚠</span>
                </div>
                <p className="text-sm font-medium text-red-700">
                  Report could not be loaded
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Please confirm the calendar exists and try again.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
                >
                  {isFetching ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1.5" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <IconRefresh size={14} className="mr-1.5" />
                      Retry
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    header,
    operationalCalendar,
    routineActivities = [],
    vaccinationCalendar = [],
    feedCalendar = [],
    financialCalendar = [],
    kpiTargets = [],
    actualPerformance,
    expectedAnnualOutput,
  } = report;

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goBack}
              className="text-gray-400 hover:text-gray-600 -ml-2 hover:bg-gray-50"
            >
              <IconArrowLeft size={18} />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 truncate">{header.FARM_NAME}</h2>
                <Badge className={header.STATUS === "ACTIVE" 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }>
                  {header.STATUS || "DRAFT"}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <IconCalendar size={12} />
                <span>{header.CALENDAR_YEAR}</span>
                {header.CAPACITY && (
                  <>
                    <span className="text-gray-300">·</span>
                    <IconBuildingWarehouse size={12} />
                    <span>Capacity: {header.CAPACITY}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-gray-200 bg-white"
            >
              <IconRefresh className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.print()}
              className="border-gray-200 bg-white"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportExcel(report)}
              className="border-gray-200 bg-white"
            >
              <IconDownload size={14} className="mr-1.5" /> Excel
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={IconCalendarStats}
              label="Cycles Completed"
              value={actualPerformance?.CYCLES_COMPLETED ?? 0}
              color="blue"
            />
            <StatCard
              icon={IconChecklist}
              label="Actual Qty (Head)"
              value={actualPerformance?.TOTAL_ACTUAL_QTY ?? 0}
              color="purple"
            />
            <StatCard
              icon={IconTrendingUp}
              label="Actual Revenue"
              value={actualPerformance?.TOTAL_ACTUAL_REVENUE?.toLocaleString() ?? 0}
              color="emerald"
            />
            <StatCard
              icon={IconCoin}
              label="Actual Cost"
              value={actualPerformance?.TOTAL_ACTUAL_COST?.toLocaleString() ?? 0}
              color="amber"
            />
          </div>

          {/* Operational Calendar */}
          <Section title="Operational & Activity Calendar" icon={IconCalendarStats}>
            <div className="space-y-4">
              <CycleTable
                title={operationalCalendar.cycle1.title}
                activities={operationalCalendar.cycle1.activities}
              />
              <CycleTable
                title={operationalCalendar.cycle2.title}
                activities={operationalCalendar.cycle2.activities}
              />
            </div>
          </Section>

          {/* Routine Activities */}
          <Section title="Monthly Routine Activities" icon={IconChecklist}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Activity</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 w-40">Frequency</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 w-32">Farm Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routineActivities.length === 0 && <EmptyRow colSpan={3} label="routine activities" />}
                  {routineActivities.map((r) => (
                    <TableRow key={r.DETAIL_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm text-gray-700">{r.ACTIVITY_NAME || r.ACTIVITY_DESC}</TableCell>
                      <TableCell className="text-sm text-gray-600">{r.FREQUENCY}</TableCell>
                      <TableCell className="text-sm text-gray-500">{r.FARM_TYPE || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Vaccination Calendar */}
          <ActivityCalendarTable
            icon={IconVaccine}
            title="Vaccination & Health Calendar"
            activities={vaccinationCalendar}
          />

          {/* Feed Calendar */}
          <ActivityCalendarTable
            icon={IconPlant2}
            title="Feed Production & Procurement Calendar"
            activities={feedCalendar}
          />

          {/* Financial Calendar */}
          <ActivityCalendarTable
            icon={IconCoin}
            title="Financial Calendar"
            activities={financialCalendar}
          />

          {/* KPI Targets */}
          <Section title="Key Performance Indicators" icon={IconTarget}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">KPI</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right w-32">Target</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right w-32">Actual</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 w-24">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpiTargets.length === 0 && <EmptyRow colSpan={4} label="KPI targets" />}
                  {kpiTargets.map((k) => (
                    <TableRow key={k.KPI_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm font-medium text-gray-700">{k.KPI_NAME}</TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{k.TARGET_VALUE}</TableCell>
                      <TableCell className="text-sm font-semibold text-gray-800 text-right">
                        {k.ACTUAL_VALUE ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{k.UNIT || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Expected Annual Output */}
          <Section title="Expected Annual Output" icon={IconTrendingUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={IconChecklist}
                label="Cattle Fattened"
                value={expectedAnnualOutput?.cattleFattenedCount ?? "—"}
                color="blue"
              />
              <StatCard
                icon={IconCalendarStats}
                label="Sales Cycles"
                value={expectedAnnualOutput?.salesCyclesCount ?? "—"}
                color="purple"
              />
              <StatCard
                icon={IconTrendingUp}
                label="Estimated Revenue"
                value={fmtMoney(expectedAnnualOutput?.estimatedAnnualRevenue)}
                color="emerald"
              />
              <StatCard
                icon={IconCoin}
                label="Estimated Gross Profit"
                value={fmtMoney(expectedAnnualOutput?.estimatedAnnualGrossProfit)}
                color="amber"
              />
            </div>
          </Section>

          {/* Review Note */}
          {header.REVIEW_NOTE && (
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200 p-5">
              <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                Review Note
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{header.REVIEW_NOTE}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}