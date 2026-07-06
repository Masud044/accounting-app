import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceDailyTrend } from "./queries";

Chart.register(...registerables);

const currentYear  = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const yearOptions = Array.from(
  { length: 2030 - currentYear + 1 },
  (_, i) => currentYear + i
);
const MONTHS = [
  { value: "1",  label: "January"  },
  { value: "2",  label: "February" },
  { value: "3",  label: "March"    },
  { value: "4",  label: "April"    },
  { value: "5",  label: "May"      },
  { value: "6",  label: "June"     },
  { value: "7",  label: "July"     },
  { value: "8",  label: "August"   },
  { value: "9",  label: "September"},
  { value: "10", label: "October"  },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const GRID_COLOR = "rgba(128,128,128,0.12)";
const TEXT_COLOR = "#888";

// "2026-07-05" -> "5 Jul"
const toDayLabel = (isoDate) => {
  const d = new Date(isoDate);
  return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
};

export default function InvoiceDailyTrendChart() {
  const [year,  setYear]  = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  const { data: rawData = [], isLoading, isError, error, refetch, isFetching } =
    useInvoiceDailyTrend(year, month);

  // raw rows -> { DAY_LABEL, AMT }
  const data = rawData.map((r) => ({
    DAY_LABEL: toDayLabel(r.DAY),
    AMT: Number(r.TOTAL_AMT ?? 0),
  }));

  useEffect(() => {
    if (!canvasRef.current || isLoading || isError || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = data.map((r) => r.DAY_LABEL);
    const values = data.map((r) => r.AMT ?? 0);

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Sale Amount",
            data: values,
            borderColor: "#3b82f6",
            backgroundColor: "#3b82f610",
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointBorderWidth: 1.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2,
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` Sale Amount: ৳ ${ctx.parsed.y?.toLocaleString() ?? "—"}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: GRID_COLOR },
            ticks: {
              color: TEXT_COLOR,
              font: { size: 11 },
              autoSkip: true,
              maxTicksLimit: 9,
              maxRotation: 0,
            },
          },
          y: {
            grid: { color: GRID_COLOR },
            beginAtZero: false,
            ticks: {
              color: TEXT_COLOR,
              font: { size: 11 },
              callback: (v) => v.toLocaleString(),
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, isLoading, isError]);

  const monthLabel = MONTHS.find((m) => Number(m.value) === month)?.label ?? "";

  return (
    <div className="bg-card rounded-md shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <p className="text-sm font-semibold text-slate-700">
          Daily Invoice Sale 
        </p>
        <div className="flex items-center gap-2">
          {/* Month selector */}
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year selector */}
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline" size="icon" className="h-8 w-8"
            onClick={() => refetch()} disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-5 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
          Sale Amount
        </span>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: 240 }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Spinner className="h-8 w-8" />
            <p className="text-xs text-muted-foreground">Loading chart...</p>
          </div>
        )}
        {isError && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load chart</AlertTitle>
            <AlertDescription className="mt-1 flex flex-col gap-2">
              <p>{error?.message || "Something went wrong."}</p>
              <Button variant="outline" size="sm" className="w-fit" onClick={() => refetch()} disabled={isFetching}>
                {isFetching
                  ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                  : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !isError && data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No data for {monthLabel} {year}
            </p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{ display: isLoading || isError || data.length === 0 ? "none" : "block" }}
        />
      </div>

      {/* Summary row */}
      {!isLoading && !isError && data.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total ({monthLabel})</p>
            <p className="text-base font-semibold tabular-nums">
              ৳ {data.reduce((s, r) => s + (r.AMT ?? 0), 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Peak day</p>
            <p className="text-base font-semibold tabular-nums">
              {data.reduce((best, r) => (r.AMT ?? 0) > (best.AMT ?? 0) ? r : best, data[0])?.DAY_LABEL ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Daily avg</p>
            <p className="text-base font-semibold tabular-nums">
              ৳ {Math.round(
                data.reduce((s, r) => s + (r.AMT ?? 0), 0) / data.length
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}