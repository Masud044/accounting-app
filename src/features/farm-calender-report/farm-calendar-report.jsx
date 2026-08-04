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
} from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher (matches farmProject hooks pattern) ────────────────
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

// ── Query key + fetcher ─────────────────────────────────────────────────
export const farmCalendarReportKeys = {
  all:    ["farmCalendarReport"],
  detail: (id) => [...farmCalendarReportKeys.all, "detail", id],
};

const fetchFarmCalendarReport = (calendarId) => fetchJSON(`${API}/${calendarId}`);

const fmtMoney = (v) =>
  v == null ? "—" : `BDT ${Number(v).toLocaleString()}`;

// ── Excel export builder (mirrors original Annual Operational Calendar layout) ──
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

// ── Small presentational helpers ───────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = "text-primary" }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div className={`rounded-md bg-muted p-2 ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function CycleTable({ title, activities }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Month</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead className="w-32">Farm Type</TableHead>
            <TableHead className="w-28">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                No activities recorded.
              </TableCell>
            </TableRow>
          )}
          {activities.map((a) => (
            <TableRow key={a.DETAIL_ID}>
              <TableCell className="font-medium">{a.MONTH_NAME}</TableCell>
              <TableCell>{a.ACTIVITY_NAME || a.ACTIVITY_DESC}</TableCell>
              <TableCell>{a.FARM_TYPE || "—"}</TableCell>
              <TableCell>
                <Badge variant={a.STATUS === "COMPLETED" ? "default" : "secondary"}>
                  {a.STATUS || "PLANNED"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Generic Month + Activity table (Vaccination / Feed / Financial calendars) ──
function ActivityCalendarTable({ icon: Icon, title, activities }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        {/* <Icon size={18} className="text-primary" /> */}
        {title}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">Month</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                No {title.toLowerCase()} activities recorded.
              </TableCell>
            </TableRow>
          )}
          {activities.map((a) => (
            <TableRow key={a.DETAIL_ID}>
              <TableCell className="font-medium">{a.MONTH_NAME ?? "—"}</TableCell>
              <TableCell>{a.ACTIVITY_NAME || a.ACTIVITY_DESC}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{a.REMARKS ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Back button (shared across all render states) ─────────────────────
function BackButton({ onClick }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
    >
      <IconArrowLeft size={16} className="mr-1" />
      Back to Calendars
    </Button>
  );
}

// ── Main page ────────────────────────────────────────────────────────────
export default function FarmCalendarReportPage() {
  const { calendarId } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard/farm-calendar-report");

  const { data: report, isLoading, isError } = useQuery({
    queryKey: farmCalendarReportKeys.detail(calendarId),
    queryFn: () => fetchFarmCalendarReport(calendarId),
    enabled: !!calendarId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <SectionContainer title="Farm Calendar Report">
        <BackButton onClick={goBack} />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </SectionContainer>
    );
  }

  if (isError || !report) {
    return (
      <SectionContainer title="Farm Calendar Report">
        <BackButton onClick={goBack} />
        <p className="text-sm text-destructive">
          Report could not be loaded. Please confirm the calendar exists and try again.
        </p>
      </SectionContainer>
    );
  }

  const {
    header,
    operationalCalendar,
    routineActivities=[],
    vaccinationCalendar = [],
    feedCalendar = [],
    financialCalendar = [],
    kpiTargets=[],
    actualPerformance,
    expectedAnnualOutput,
  } = report;

  return (
    <SectionContainer
      title={`Farm Calendar Report — ${header.FARM_NAME}`}
      description={`${header.CALENDAR_YEAR} · Status: ${header.STATUS}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <BackButton onClick={goBack} />
        <Button variant="outline" size="sm" onClick={() => handleExportExcel(report)}>
          <IconDownload size={16} className="mr-1" />
          Export to Excel
        </Button>
      </div>

      <div className="space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={IconCalendarStats}
            label="Cycles Completed"
            value={actualPerformance?.CYCLES_COMPLETED ?? 0}
          />
          <StatCard
            icon={IconChecklist}
            label="Actual Qty (Head)"
            value={actualPerformance?.TOTAL_ACTUAL_QTY ?? 0}
          />
          <StatCard
            icon={IconTrendingUp}
            label="Actual Revenue (BDT)"
            value={actualPerformance?.TOTAL_ACTUAL_REVENUE?.toLocaleString() ?? 0}
            accent="text-emerald-600"
          />
          <StatCard
            icon={IconTarget}
            label="Actual Cost (BDT)"
            value={actualPerformance?.TOTAL_ACTUAL_COST?.toLocaleString() ?? 0}
            accent="text-amber-600"
          />
        </div>

        {/* Cycle-wise operational calendar */}
        <div className="space-y-6">
          <h3 className="text-base font-semibold">Operational & Activity Calendar</h3>
          <CycleTable
            title={operationalCalendar.cycle1.title}
            activities={operationalCalendar.cycle1.activities}
          />
          <CycleTable
            title={operationalCalendar.cycle2.title}
            activities={operationalCalendar.cycle2.activities}
          />
        </div>

        {/* Routine activities */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">Monthly Routine Activities</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead className="w-40">Frequency</TableHead>
                <TableHead className="w-32">Farm Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routineActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                    No routine activities recorded.
                  </TableCell>
                </TableRow>
              )}
              {routineActivities.map((r) => (
                <TableRow key={r.DETAIL_ID}>
                  <TableCell>{r.ACTIVITY_NAME || r.ACTIVITY_DESC}</TableCell>
                  <TableCell>{r.FREQUENCY}</TableCell>
                  <TableCell>{r.FARM_TYPE || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vaccination & Health Calendar */}
        <ActivityCalendarTable
          icon={IconVaccine}
          title="Vaccination & Health Calendar"
          activities={vaccinationCalendar}
        />

        {/* Feed Production & Procurement Calendar */}
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

        {/* KPI targets vs actuals */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">Key Performance Indicators</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI</TableHead>
                <TableHead className="w-32">Target</TableHead>
                <TableHead className="w-32">Actual</TableHead>
                <TableHead className="w-24">Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpiTargets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                    No KPI targets set.
                  </TableCell>
                </TableRow>
              )}
              {kpiTargets.map((k) => (
                <TableRow key={k.KPI_ID}>
                  <TableCell className="font-medium">{k.KPI_NAME}</TableCell>
                  <TableCell>{k.TARGET_VALUE}</TableCell>
                  <TableCell>{k.ACTUAL_VALUE ?? "—"}</TableCell>
                  <TableCell>{k.UNIT || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Expected Annual Output — from named KPI rows, may be blank */}
       {/* Expected Annual Output — always shown as cards, "—" when a KPI row is missing */}
<div className="space-y-2">
  <h3 className="text-base font-semibold">Expected Annual Output</h3>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
    <StatCard
      icon={IconChecklist}
      label="Cattle Fattened"
      value={expectedAnnualOutput?.cattleFattenedCount ?? "—"}
    />
    <StatCard
      icon={IconCalendarStats}
      label="Sales Cycles"
      value={expectedAnnualOutput?.salesCyclesCount ?? "—"}
    />
    <StatCard
      icon={IconTrendingUp}
      label="Estimated Revenue"
      value={fmtMoney(expectedAnnualOutput?.estimatedAnnualRevenue)}
      accent="text-emerald-600"
    />
    <StatCard
      icon={IconCoin}
      label="Estimated Gross Profit"
      value={fmtMoney(expectedAnnualOutput?.estimatedAnnualGrossProfit)}
      accent="text-amber-600"
    />
  </div>
</div>
      </div>
    </SectionContainer>
  );
}