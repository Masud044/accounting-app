import { useState, useMemo } from "react";
import {
  AlertCircle,
  RefreshCw,
  BookOpen,
  Printer,
  ChevronDown,
  ChevronRight,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { useGeneralLedger, useChartOfAccounts } from "./queries";

const fmt = (val) =>
  Number(val || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d)) return String(val);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const fmtBalance = (val) => {
  const n = Number(val || 0);
  return n < 0 ? `${fmt(Math.abs(n))} CR` : `${fmt(n)} DR`;
};

export default function GeneralLedgerList() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [accountPopoverOpen, setAccountPopoverOpen] = useState(false);

  const { data: rows = [], isLoading, isError, error, refetch, isFetching } =
    useGeneralLedger(applied);

  const { data: allAccounts = [], isLoading: accountsLoading } = useChartOfAccounts();

  // ── শুধু enabled + leaf accounts dropdown e দেখাবো (GL entry শুধু leaf-এ post হয়) ──
  const accounts = useMemo(
    () => allAccounts.filter((a) => a.ENABLED === 1 && a.IS_LEAF === 1),
    [allAccounts]
  );

  const selectedAccount = accounts.find((a) => String(a.ACCOUNT_ID) === String(accountCode));

  const handleGenerate = () => {
    if (!fromDate || !toDate) return;
    setApplied({ fromDate, toDate, accountCode: accountCode || null });
  };

  // ── Group rows by account CODE ──────────────────────────────────────────
  const groups = useMemo(() => {
    const map = new Map();
    for (const r of rows) {
      if (!map.has(r.CODE)) {
        map.set(r.CODE, { code: r.CODE, name: r.ACCOUNT_NAME, entries: [] });
      }
      map.get(r.CODE).entries.push(r);
    }
    return Array.from(map.values());
  }, [rows]);

  const grandTotals = useMemo(() => {
    if (!rows.length) return null;
    return rows.reduce(
      (acc, r) => ({
        debit: acc.debit + Number(r.DEBIT || 0),
        credit: acc.credit + Number(r.CREDIT || 0),
      }),
      { debit: 0, credit: 0 }
    );
  }, [rows]);

  const toggleGroup = (code) =>
    setCollapsed((c) => ({ ...c, [code]: !c[code] }));

  // ── Filter bar ───────────────────────────────────────────────────────────
  const FilterBar = (
    <div className="bg-card rounded-md shadow-sm p-4 mb-4 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg md:text-2xl font-semibold tracking-tight">General Ledger</h1>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">From Date</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">To Date</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">Account Code</label>
            <Popover open={accountPopoverOpen} onOpenChange={setAccountPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={accountPopoverOpen}
                  className="w-72 justify-between font-normal"
                >
                  <span className="truncate">
                    {selectedAccount
                      ? `${selectedAccount.ACCOUNT_ID} — ${selectedAccount.FULL_PATH.trim()}`
                      : "All accounts"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <Command>
                  <CommandInput placeholder="Search account code or name..." />
                  <CommandList>
                    <CommandEmpty>
                      {accountsLoading ? "Loading..." : "No account found."}
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all-accounts"
                        onSelect={() => {
                          setAccountCode("");
                          setAccountPopoverOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", !accountCode ? "opacity-100" : "opacity-0")} />
                        All accounts
                      </CommandItem>
                      {accounts.map((a) => (
                        <CommandItem
                          key={a.ID}
                          value={`${a.ACCOUNT_ID} ${a.ACCOUNT_NAME}`}
                          onSelect={() => {
                            setAccountCode(a.ACCOUNT_ID);
                            setAccountPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              String(accountCode) === String(a.ACCOUNT_ID) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="truncate">
                            {a.ACCOUNT_ID} — {a.FULL_PATH.trim()}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={handleGenerate} disabled={!fromDate || !toDate}>
            <BookOpen className="mr-1 h-4 w-4" /> Generate
          </Button>
          {applied && (
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>
          )}
          {applied && (
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (!applied) {
    return (
      <div>
        {FilterBar}
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
              <EmptyTitle>Date range select kore Generate button e click korun</EmptyTitle>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        {FilterBar}
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">General ledger generate kora hocche...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {FilterBar}
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Report</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load general ledger."}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
                {isFetching
                  ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</>
                  : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div>
      {FilterBar}

      {/* Print header — only visible on print */}
      <div className="hidden print:block mb-4 text-center">
        <h1 className="text-xl font-bold">General Ledger</h1>
        <p className="text-sm text-muted-foreground">
          {fmtDate(applied.fromDate)} to {fmtDate(applied.toDate)}
          {applied.accountCode ? ` — Account: ${applied.accountCode}` : ""}
        </p>
      </div>

      {grandTotals && (
        <div className="grid grid-cols-2 gap-3 mb-4 print:hidden">
          <div className="bg-card rounded-md shadow-sm p-4">
            <p className="text-sm text-muted-foreground">Total Debit</p>
            <p className="text-lg font-semibold tabular-nums">{fmt(grandTotals.debit)}</p>
          </div>
          <div className="bg-card rounded-md shadow-sm p-4">
            <p className="text-sm text-muted-foreground">Total Credit</p>
            <p className="text-lg font-semibold tabular-nums">{fmt(grandTotals.credit)}</p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-md shadow-sm p-4">
        {groups.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon"><BookOpen /></EmptyMedia>
              <EmptyTitle>No Records Found</EmptyTitle>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-6">
            {groups.map((g) => {
              const isCollapsed = collapsed[g.code];
              const openingBal = g.entries[0]
                ? Number(g.entries[0].BALANCE) - (Number(g.entries[0].DEBIT) - Number(g.entries[0].CREDIT))
                : 0;
              const closingBal = g.entries[g.entries.length - 1]?.BALANCE ?? 0;
              const subtotal = g.entries.reduce(
                (acc, r) => ({
                  debit: acc.debit + Number(r.DEBIT || 0),
                  credit: acc.credit + Number(r.CREDIT || 0),
                }),
                { debit: 0, credit: 0 }
              );

              return (
                <div key={g.code} className="border rounded-md overflow-hidden break-inside-avoid">
                  {/* Account header */}
                  <button
                    onClick={() => toggleGroup(g.code)}
                    className="w-full flex items-center justify-between bg-muted/50 px-4 py-2 text-left print:hidden"
                  >
                    <span className="font-semibold">
                      {g.code} — {g.name}
                    </span>
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <div className="hidden print:block bg-muted/50 px-4 py-2 font-semibold">
                    {g.code} — {g.name}
                  </div>

                  {!isCollapsed && (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-muted/20 italic">
                            <TableCell colSpan={4} className="text-muted-foreground">
                              Opening Balance
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {fmtBalance(openingBal)}
                            </TableCell>
                          </TableRow>
                          {g.entries.map((r, idx) => (
                            <TableRow key={`${g.code}-${idx}`}>
                              <TableCell>{fmtDate(r.GL_ENTRY_DATE)}</TableCell>
                              <TableCell className="max-w-xs truncate text-muted-foreground">
                                {r.DESCRIPTION || "—"}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {Number(r.DEBIT) ? fmt(r.DEBIT) : ""}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {Number(r.CREDIT) ? fmt(r.CREDIT) : ""}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {fmtBalance(r.BALANCE)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold border-t-2">
                            <TableCell colSpan={2}>Total / Closing Balance</TableCell>
                            <TableCell className="text-right tabular-nums">{fmt(subtotal.debit)}</TableCell>
                            <TableCell className="text-right tabular-nums">{fmt(subtotal.credit)}</TableCell>
                            <TableCell className="text-right tabular-nums">{fmtBalance(closingBal)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}