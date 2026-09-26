import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import {
  IconArrowLeft,
  IconDownload,
  IconRefresh,
  IconCalendar,
  IconBuildingWarehouse,
  IconReceipt2,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";


import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher ───────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/farm-budget-report`;

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
export const farmBudgetReportKeys = {
  all: ["farmBudgetReport"],
  detail: (id) => [...farmBudgetReportKeys.all, "detail", id],
};

const fetchFarmBudgetReport = (budgetId) => fetchJSON(`${API}/${budgetId}`);

const fmtMoney = (v) => (v == null ? "—" : `BDT ${Number(v).toLocaleString()}`);
const fmtPercent = (v) => `${((v ?? 0) * 100).toFixed(1)}%`;

// ── Excel export builder (mirrors the Department Budget Report template layout) ──
function buildReportWorkbook(report) {
  const { header, categories = [], totals } = report;

  const rows = [];
  const push = (...cells) => rows.push(cells);
  const blank = () => rows.push([]);

  push("FARM BUDGET REPORT");
  blank();
  push("Farm Name:", header.FARM_NAME);
  push("Budget Year:", header.BUDGET_YEAR);
  push("Status:", header.STATUS);
  push("Prepared By:", header.CREATED_BY);
  blank();

  push("Budget Category", "Budgeted Amount", "Actual Amount", "Variance ($)", "Variance (%)");
  categories.forEach((c) =>
    push(c.category, c.budgeted, c.actual, c.varianceAmount, `${(c.variancePercent * 100).toFixed(1)}%`)
  );
  push("TOTAL", totals.budgeted, totals.actual, totals.varianceAmount, `${(totals.variancePercent * 100).toFixed(1)}%`);
  blank();

  push("Note: Actual Amount is not yet tracked in FARM_BUDGET_D — values shown as 0 until an actual-spend source is connected.");

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 28 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Budget Report");
  return wb;
}

const handleExportExcel = (report) => {
  const wb = buildReportWorkbook(report);
  const fileName = `Farm_Budget_${(report.header.FARM_NAME || "report").replace(/\s+/g, "_")}_${report.header.BUDGET_YEAR}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

// ── Presentational helpers ──────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
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

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FarmBudgetReportPage() {
  const { budgetId } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard/farm-budget-report");

  const { data: report, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: farmBudgetReportKeys.detail(budgetId),
    queryFn: () => fetchFarmBudgetReport(budgetId),
    enabled: !!budgetId,
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
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
            <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-500 hover:text-gray-700">
              <IconArrowLeft size={16} className="mr-1.5" /> Back
            </Button>
          </div>
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <span className="text-red-600 text-xl">⚠</span>
                </div>
                <p className="text-sm font-medium text-red-700">Report could not be loaded</p>
                <p className="text-xs text-red-500 mt-1">Please confirm the budget exists and try again.</p>
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

  const { header, categories = [], totals } = report;
  const isOverBudget = totals.varianceAmount > 0;

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-400 hover:text-gray-600 -ml-2 hover:bg-gray-50">
              <IconArrowLeft size={18} />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 truncate">{header.FARM_NAME}</h2>
                <Badge className={header.STATUS === "APPROVED" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}>
                  {header.STATUS || "DRAFT"}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <IconCalendar size={12} />
                <span>{header.BUDGET_YEAR}</span>
                <span className="text-gray-300">·</span>
                <IconBuildingWarehouse size={12} />
                <span>{header.CREATED_BY}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="border-gray-200 bg-white">
              <IconRefresh className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExportExcel(report)} className="border-gray-200 bg-white">
              <IconDownload size={14} className="mr-1.5" /> Excel
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={IconReceipt2} label="Total Budgeted" value={fmtMoney(totals.budgeted)} color="blue" />
            <StatCard icon={IconReceipt2} label="Total Actual" value={fmtMoney(totals.actual)} color="emerald" />
            <StatCard
              icon={isOverBudget ? IconTrendingUp : IconTrendingDown}
              label="Variance"
              value={fmtMoney(totals.varianceAmount)}
              color={isOverBudget ? "rose" : "amber"}
            />
          </div>

          {/* Category table */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800">Budget by category</h3>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Budget category</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right">Budgeted</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right">Actual</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right">Variance</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right w-24">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-sm text-gray-400">
                        No budget categories recorded.
                      </TableCell>
                    </TableRow>
                  )}
                  {categories.map((c) => (
                    <TableRow key={c.category} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm font-medium text-gray-700">{c.category}</TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{fmtMoney(c.budgeted)}</TableCell>
                      <TableCell className="text-sm text-gray-500 text-right">{fmtMoney(c.actual)}</TableCell>
                      <TableCell className={`text-sm text-right ${c.varianceAmount > 0 ? "text-rose-600" : "text-gray-500"}`}>
                        {fmtMoney(c.varianceAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={c.varianceAmount > 0 ? "bg-rose-100 text-rose-700 hover:bg-rose-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"}>
                          {fmtPercent(c.variancePercent)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-semibold">
                    <TableCell className="text-sm text-gray-800">TOTAL</TableCell>
                    <TableCell className="text-sm text-gray-800 text-right">{fmtMoney(totals.budgeted)}</TableCell>
                    <TableCell className="text-sm text-gray-800 text-right">{fmtMoney(totals.actual)}</TableCell>
                    <TableCell className={`text-sm text-right ${isOverBudget ? "text-rose-600" : "text-gray-800"}`}>
                      {fmtMoney(totals.varianceAmount)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-800 text-right">{fmtPercent(totals.variancePercent)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}