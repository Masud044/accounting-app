import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Package, Tag } from "lucide-react";
import { useInvoices } from "@/features/sale-invoice/queries";
import { IconCoinTaka } from "@tabler/icons-react";
import InvoiceDashboardPanel from "./invoice-dashboard-panel";
import InvoiceMonthlyChart from "./invoice-monthly-chart";
import InvoiceDailyTrendChart from "./invoice-daily-chart";
import { SectionContainer } from "@/components/SectionContainer";

const currentYear = new Date().getFullYear();

// ── shared filter options ────────────────────────────────────────────────
const MONTHS = [
  { label: "All", value: "" },
  { label: "January", value: 1 },  { label: "February", value: 2 },
  { label: "March", value: 3 },    { label: "April", value: 4 },
  { label: "May", value: 5 },      { label: "June", value: 6 },
  { label: "July", value: 7 },     { label: "August", value: 8 },
  { label: "September", value: 9 },{ label: "October", value: 10 },
  { label: "November", value: 11 },{ label: "December", value: 12 },
];

// year dropdown শুধু 2026 থেকে 2030 পর্যন্ত
const YEARS = [2026, 2027, 2028, 2029, 2030].map((y) => ({ label: String(y), value: y }));

const selectClass =
  "text-xs border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer";

// ── helpers ────────────────────────────────────────────────────────────────
const fmtMoney = (n) =>
  `${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const fmtAxisDate = (val) => {
  if (!val) return "";
  const d = new Date(`${val}T00:00:00`);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
};

const fmtTooltipDate = (val) => {
  const d = new Date(`${val}T00:00:00`);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const toRow = (i) => {
  const qty          = Number(i.TOT_QTY || 0);
  const amt           = Number(i.TOT_AMT || 0);
  const productionQty = Number(i.PRODUCTION_QTY || 0);
  const unitPrice     = qty > 0 ? amt / qty : 0;
  return {
    date:          i.INVOICE_DATE,
    revenue:       amt,
    salesQty:      qty,
    productionQty,
    unitPrice:     Math.round(unitPrice * 100) / 100,
  };
};

const filterInvoices = (invoices, filters) =>
  invoices.filter((i) => {
    if (!i.INVOICE_DATE) return false;
    const d = new Date(i.INVOICE_DATE);
    if (isNaN(d.getTime())) return false;
    if (filters.year && d.getFullYear() !== filters.year) return false;
    if (filters.month && d.getMonth() + 1 !== filters.month) return false;
    return true;
  });

// ── stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

// ── tooltip ────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, formatters }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-md text-xs">
      <div className="font-medium mb-1">{fmtTooltipDate(label)}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground">
            {(formatters?.[p.dataKey] ?? ((v) => v))(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── reusable filter row (কার্ডের নিজের হেডারে বসবে) ─────────────────────────
function CardFilter({ filters, onMonthChange, onYearChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <select value={filters.month} onChange={(e) => onMonthChange(e.target.value)} className={selectClass}>
        {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select value={filters.year} onChange={(e) => onYearChange(e.target.value)} className={selectClass}>
        {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
      </select>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 1: Revenue by invoice date (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function RevenueTrendCard({ invoices }) {
  const [filters, setFilters] = useState({ month: "", year: currentYear });
  const rows = useMemo(
    () => [...filterInvoices(invoices, filters)]
      .sort((a, b) => new Date(a.INVOICE_DATE) - new Date(b.INVOICE_DATE))
      .map(toRow),
    [invoices, filters]
  );

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Revenue by invoice date
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No data for this filter.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date" tickFormatter={fmtAxisDate}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48}
              />
              <Tooltip content={<ChartTooltip formatters={{ revenue: fmtMoney }} />} />
              <Area
                type="monotone" dataKey="revenue" name="Revenue"
                stroke="#2563eb" strokeWidth={2} fill="url(#revFill)"
                dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 2: Production vs sales quantity (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function ProductionVsSalesCard({ invoices }) {
  const [filters, setFilters] = useState({ month: "", year: currentYear });
  const rows = useMemo(
    () => [...filterInvoices(invoices, filters)]
      .sort((a, b) => new Date(a.INVOICE_DATE) - new Date(b.INVOICE_DATE))
      .map(toRow),
    [invoices, filters]
  );

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Production vs sales quantity per invoice
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No data for this filter.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date" tickFormatter={fmtAxisDate}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={48} />
              <Tooltip content={<ChartTooltip formatters={{
                productionQty: (v) => v.toLocaleString(),
                salesQty: (v) => v.toLocaleString(),
              }} />} />
              <Legend
                iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Bar dataKey="productionQty" name="Production qty" fill="#2563eb" radius={[3, 3, 0, 0]} />
              <Bar dataKey="salesQty" name="Sales qty" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Card 3: Unit price trend (নিজের filter) ──
// ══════════════════════════════════════════════════════════════════════════
function UnitPriceTrendCard({ invoices }) {
  const [filters, setFilters] = useState({ month: "", year: currentYear });
  const rows = useMemo(
    () => [...filterInvoices(invoices, filters)]
      .sort((a, b) => new Date(a.INVOICE_DATE) - new Date(b.INVOICE_DATE))
      .map(toRow),
    [invoices, filters]
  );

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Unit price trend
        </CardTitle>
        <CardFilter
          filters={filters}
          onMonthChange={(v) => setFilters((p) => ({ ...p, month: v ? Number(v) : "" }))}
          onYearChange={(v) => setFilters((p) => ({ ...p, year: Number(v) }))}
        />
      </CardHeader>
      <CardContent className="pl-0 pr-4">
        {rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No data for this filter.</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date" tickFormatter={fmtAxisDate}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}`}
                tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40}
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
              />
              <Tooltip content={<ChartTooltip formatters={{ unitPrice: (v) => `${v.toFixed(2)}` }} />} />
              <Line
                type="monotone" dataKey="unitPrice" name="Unit price"
                stroke="#f59e0b" strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ── Main component ──
// ══════════════════════════════════════════════════════════════════════════
export default function InvoiceSalesDashboard() {
  const { data: invoices = [], isLoading } = useInvoices();

  // ── Stat cards: সবসময় unfiltered — সব invoice-এর উপর ──
  const totals = useMemo(() => {
    const validRows = invoices.filter((i) => i.INVOICE_DATE);
    const totalQty     = validRows.reduce((s, i) => s + Number(i.TOT_QTY || 0), 0);
    const totalRevenue = validRows.reduce((s, i) => s + Number(i.TOT_AMT || 0), 0);
    const avgPrice      = totalQty > 0 ? totalRevenue / totalQty : 0;
    return {
      invoiceCount: validRows.length,
      totalQty,
      totalRevenue,
      avgPrice,
    };
  }, [invoices]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Spinner className="h-8 w-8 mb-3" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FileText className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">No invoices yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create your first invoice to see sales analytics here.
        </p>
      </div>
    );
  }

  return (
    <SectionContainer>
    <div className="space-y-6">

      {/* ── Stat cards — সবসময় unfiltered ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-3">
        <StatCard icon={FileText} label="Invoices" value={totals.invoiceCount} />
        <StatCard icon={Package} label="Total qty sold" value={totals.totalQty.toLocaleString()} />
        <StatCard icon={IconCoinTaka} label="Total revenue" value={fmtMoney(totals.totalRevenue)} />
        <StatCard icon={Tag} label="Avg price" value={`${totals.avgPrice.toFixed(2)}`} />
      </div>

      {/* ── Chart cards — প্রতিটার নিজস্ব filter ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <RevenueTrendCard invoices={invoices} />
        <ProductionVsSalesCard invoices={invoices} />
        <UnitPriceTrendCard invoices={invoices} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InvoiceDashboardPanel  />
        <InvoiceMonthlyChart />
        <InvoiceDailyTrendChart  />
      </div>
    </div>
    </SectionContainer>
  );
}