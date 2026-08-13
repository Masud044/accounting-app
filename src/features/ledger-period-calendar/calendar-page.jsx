import { useEffect, useState } from "react";
import { AlertCircle, CalendarRange, RefreshCw } from "lucide-react";
import { IconCircleDashedPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

import { useFiscalYears } from "./queries";
import FiscalYearSwitch from "./fiscal-year-switch";
import CalendarView from "./calendar-view";
import PeriodTypesTab from "./period-tab";
import AddFiscalYearSheet from "./add-fiscal-year";

export default function LedgerPeriodCalendarPage() {
  const [activeFyId, setActiveFyId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  const {
    data: fiscalYears = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFiscalYears();

  useEffect(() => {
    if (!activeFyId && fiscalYears.length) setActiveFyId(fiscalYears[0].FISCAL_YEAR_ID);
  }, [fiscalYears, activeFyId]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Ledger Period Calendar</h1>
            <Button disabled><IconCircleDashedPlus className="mr-1" />Add Fiscal Year</Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <div className="flex flex-col items-center justify-center py-16">
            <Spinner className="h-12 w-12 mb-4" />
            <p className="text-muted-foreground">Loading fiscal years...</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div>
        <div className="bg-card rounded-sm shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Ledger Period Calendar</h1>
            <Button onClick={() => setIsAddOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Fiscal Year
            </Button>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Fiscal Years</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load fiscal years."}</p>
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

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <CalendarRange className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Ledger Period Calendar</h1>
              <p className="text-sm text-muted-foreground">Open/close posting periods per module</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button onClick={() => setIsAddOpen(true)}>
              <IconCircleDashedPlus className="mr-1" />Add Fiscal Year
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
    {/* Body */}
      <div className="bg-card rounded-md shadow-sm p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="period-types">Period Types</TabsTrigger>
          </TabsList>

          {activeTab === "calendar" && (
            <div className="mt-4">
              <FiscalYearSwitch fiscalYears={fiscalYears} activeId={activeFyId} onChange={setActiveFyId} />
            </div>
          )}

          <TabsContent value="calendar" className="mt-4">
            <CalendarView fiscalYearId={activeFyId} />
          </TabsContent>
          <TabsContent value="period-types" className="mt-4">
            <PeriodTypesTab />
          </TabsContent>
        </Tabs>
      </div>

      {isAddOpen && (
        <AddFiscalYearSheet open={isAddOpen} onOpenChange={setIsAddOpen} />
      )}
    </div>
  );
}