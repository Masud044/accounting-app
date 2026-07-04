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
import { useMonthlyEggProduction } from "./queries";

Chart.register(...registerables);

// ── Helpers ───────────────────────────────────────────────────────────────────
// const currentYear = new Date().getFullYear();
// const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
const currentYear = new Date().getFullYear();

// current year থেকে 2030 পর্যন্ত
const yearOptions = Array.from(
  { length: 2030 - currentYear + 1 },
  (_, i) => currentYear + i
);

export default function MonthlyProductionChart() {
  const [year, setYear] = useState(currentYear);
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  const { data = [], isLoading, isError, error, refetch, isFetching } =
    useMonthlyEggProduction(year);

  // ── Build / update chart ──────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || isLoading || isError) return;

    const labels   = data.map((r) => r.MONTH);
    const totals   = data.map((r) => r.TOTAL_QTY);

    const gridColor = "rgba(128,128,128,0.12)";
    const textColor = "#888";

    // Destroy previous instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total Eggs",
            data: totals,
            backgroundColor: "#3b82f6cc",
            borderRadius: 4,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} eggs`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 12 }, autoSkip: false },
          },
          y: {
            grid: { color: gridColor },
            beginAtZero: true,
            ticks: {
              color: textColor,
              font: { size: 11 },
              callback: (v) =>
                v >= 1000 ? (v / 1000).toFixed(0) + "K" : v,
            },
            title: {
              display: true,
              text: "Total Eggs",
              color: textColor,
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-card rounded-md shadow-sm p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Monthly Production
        </p>
        <div className="flex items-center gap-2">
          {/* Year selector */}
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-blue-500/80" />
          Total eggs
        </span>
      </div>

      {/* Chart area */}
      <div className="relative" style={{ height: 220 }}>
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
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                ) : (
                  <><RefreshCw className="mr-2 h-4 w-4" />Retry</>
                )}
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
        />
      </div>

      {/* Summary row */}
      {!isLoading && !isError && data.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total ({year})</p>
            <p className="text-base font-semibold tabular-nums">
              {data.reduce((s, r) => s + (r.TOTAL_QTY ?? 0), 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Best month</p>
            <p className="text-base font-semibold tabular-nums">
              {data.reduce((best, r) =>
                (r.TOTAL_QTY ?? 0) > (best.TOTAL_QTY ?? 0) ? r : best
              , data[0])?.MONTH ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg daily</p>
            <p className="text-base font-semibold tabular-nums">
              {Math.round(
                data.reduce((s, r) => s + (r.AVG_DAILY_QTY ?? 0), 0) / data.length
              ).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}