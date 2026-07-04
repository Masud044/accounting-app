import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
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
import { useMonthlySummary } from "./queries";

Chart.register(...registerables, ChartDataLabels);

// const currentYear = new Date().getFullYear();
// const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

const currentYear = new Date().getFullYear();

// current year থেকে 2030 পর্যন্ত
const yearOptions = Array.from(
  { length: 2030 - currentYear + 1 },
  (_, i) => currentYear + i
);

export default function MonthlySummaryChart() {
  const [year, setYear] = useState(currentYear);
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  const { data = [], isLoading, isError, error, refetch, isFetching } =
    useMonthlySummary(year);

  useEffect(() => {
    if (!canvasRef.current || isLoading || isError || data.length === 0) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridC  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
    const tickC  = isDark ? "#9ca3af" : "#6b7280";
    const axisC  = isDark ? "#9ca3af" : "#6b7280";

    const labels   = data.map((r) => r.MONTH_LABEL);
    const totals   = data.map((r) => r.TOTAL_QTY   ?? 0);
    const avgDaily = data.map((r) => r.AVG_DAILY_QTY ?? 0);

    const maxTotal = Math.max(...totals);
    const yLeftMax = Math.ceil((maxTotal * 1.25) / 1000) * 1000;

    chartRef.current = new Chart(canvasRef.current, {
      data: {
        labels,
        datasets: [
          {
            type: "bar",
            label: "Total eggs",
            data: totals,
            backgroundColor: "#3b82f6cc",
            borderRadius: 3,
            borderSkipped: false,
            yAxisID: "yLeft",
            datalabels: {
              anchor: "end",
              align: "end",
              offset: 2,
              color: isDark ? "#d1d5db" : "#374151",
              font: { size: 11, weight: "500" },
              formatter: (v) => v.toLocaleString(),
            },
          },
          {
            type: "line",
            label: "Average daily (eggs)",
            data: avgDaily,
            borderColor: "#f59e0b",
            backgroundColor: "#f59e0b",
            pointBackgroundColor: "#f59e0b",
            pointBorderColor: isDark ? "#1f2937" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 7,
            borderWidth: 2,
            tension: 0.35,
            yAxisID: "yRight",
            datalabels: {
              anchor: "center",
              align: "center",
              color: isDark ? "#1f2937" : "#ffffff",
              font: { size: 10, weight: "500" },
              formatter: (v) => v,
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        layout: { padding: { top: 24, right: 8 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`,
            },
          },
          datalabels: {},
        },
        scales: {
          x: {
            grid: { color: gridC },
            ticks: { color: tickC, font: { size: 12 }, autoSkip: false },
            border: { color: gridC },
          },
          yLeft: {
            type: "linear",
            position: "left",
            grid: { color: gridC },
            beginAtZero: true,
            max: yLeftMax,
            ticks: {
              color: tickC,
              font: { size: 11 },
              callback: (v) =>
                v === 0 ? "0" : (v / 1000).toFixed(0) + "K",
            },
            border: { color: gridC },
            title: {
              display: true,
              text: "Total eggs",
              color: axisC,
              font: { size: 11 },
            },
          },
          yRight: {
            type: "linear",
            position: "right",
            grid: { drawOnChartArea: false },
            min: 0,
            ticks: { color: tickC, font: { size: 11 } },
            border: { color: gridC },
            title: {
              display: true,
              text: "Average daily (eggs)",
              color: axisC,
              font: { size: 11 },
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

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
        <p className="text-sm font-medium uppercase tracking-widest text-foreground">
          Monthly production summary
        </p>
        <div className="flex items-center gap-2">
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
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-500/80" />
          Total eggs
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
          Average daily (eggs)
        </span>
      </div>

      {/* Chart area */}
      <div className="relative" style={{ height: 280 }}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Spinner className="h-8 w-8" />
            <p className="text-xs text-muted-foreground">Loading chart...</p>
          </div>
        )}
        {isError && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load</AlertTitle>
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
            <p className="text-sm text-muted-foreground">No data for {year}</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{ display: isLoading || isError || data.length === 0 ? "none" : "block" }}
          aria-label="Monthly production summary combo chart"
          role="img"
        />
      </div>
    </div>
  );
}