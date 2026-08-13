import { AlertCircle, CalendarX, RefreshCw, CalendarPlus } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

import { useLedgerPeriodCalendar, useLedgerModules, useToggleModuleStatus } from "./queries";
import PeriodCard from "./period-card";
import AddLedgerPeriodSheet from "./add-ledger-period";
import EditLedgerPeriodSheet from "./edit-ledger-period";

export default function CalendarView({ fiscalYearId }) {
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [isAddPeriodOpen, setIsAddPeriodOpen] = useState(false);

const [editingPeriod, setEditingPeriod] = useState(null);
const openEdit = (period) => setEditingPeriod(period);

  const {
    data: periods = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useLedgerPeriodCalendar(fiscalYearId);

  const { data: moduleList = [] } = useLedgerModules();
  const toggleMutation = useToggleModuleStatus(fiscalYearId);

  const handleToggle = async ({ periodId, moduleId, moduleCode, status }) => {
    if (status === "CLOSED") {
      const confirmed = await showConfirmation({
        title: "Close period?",
        description: `Are you sure you want to close ${moduleCode} for this period? Users will no longer be able to post to it.`,
        confirmText: "Close",
        cancelText: "Cancel",
        variant: "destructive",
      });
      if (!confirmed) return;
    }

    try {
      await toggleMutation.mutateAsync({ periodId, moduleId, moduleCode, status });
    } catch (err) {
      toast.error(err?.message || `Failed to update ${moduleCode} status. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner className="h-10 w-10 mb-4" />
        <p className="text-muted-foreground">Loading period calendar...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Calendar</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{error?.message || "Failed to load the period calendar."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
            {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!periods.length) {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon"><CalendarX /></EmptyMedia>
            <EmptyTitle>No Periods Found</EmptyTitle>
          </EmptyHeader>
          <Button className="mt-4" onClick={() => setIsAddPeriodOpen(true)}>
            <CalendarPlus className="mr-1 h-4 w-4" />Add Period
          </Button>
        </Empty>
        {isAddPeriodOpen && (
          <AddLedgerPeriodSheet
            open={isAddPeriodOpen}
            onOpenChange={setIsAddPeriodOpen}
            fiscalYearId={fiscalYearId}
          />
        )}
      </>
    );
  }

  const months = periods.filter((p) => !p.adjustment);
  const adjustment = periods.find((p) => p.adjustment);
  const quarters = [0, 1, 2, 3].map((q) => months.slice(q * 3, q * 3 + 3));

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant="outline" size="sm" onClick={() => setIsAddPeriodOpen(true)}>
          <CalendarPlus className="mr-1 h-4 w-4" />Add Period
        </Button>
      </div>

      {quarters.map((qPeriods, qIdx) => (
        <div key={qIdx} className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded bg-primary px-2 py-0.5 font-mono text-[11px] font-semibold text-primary-foreground">
              Q{qIdx + 1}
            </span>
            <Separator className="flex-1" />
            {qPeriods.length === 3 && (
              <span className="font-mono text-[11px] text-muted-foreground">
                {qPeriods[0].start} – {qPeriods[2].end}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {qPeriods.map((p) => (
            //   <PeriodCard
            //     key={p.periodId}
            //     period={p}
            //     moduleList={moduleList}
            //     pending={toggleMutation.isPending}
            //     onToggleModule={handleToggle}
            //   />
            <PeriodCard
  key={p.periodId}
  period={p}
  moduleList={moduleList}
  pending={toggleMutation.isPending}
  onToggleModule={handleToggle}
  onEdit={openEdit}
/>

            ))}
          </div>
        </div>
      ))}

      {adjustment && (
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded bg-destructive px-2 py-0.5 font-mono text-[11px] font-semibold text-destructive-foreground">
              P13
            </span>
            <Separator className="flex-1" />
            <span className="font-mono text-[11px] text-muted-foreground">year-end adjustment window</span>
          </div>
          <div className="max-w-sm">
            <PeriodCard
              period={adjustment}
              moduleList={moduleList}
              pending={toggleMutation.isPending}
              onToggleModule={handleToggle}
              onEdit={openEdit}
            />

            {/* <PeriodCard
  key={p.periodId}
  period={p}
  moduleList={moduleList}
  pending={toggleMutation.isPending}
  onToggleModule={handleToggle}
  onEdit={openEdit}
/> */}

          </div>
        </div>
      )}

      {isAddPeriodOpen && (
        <AddLedgerPeriodSheet
          open={isAddPeriodOpen}
          onOpenChange={setIsAddPeriodOpen}
          fiscalYearId={fiscalYearId}
        />
      )}

      {editingPeriod && (
  <EditLedgerPeriodSheet
    open={!!editingPeriod}
    onOpenChange={(open) => !open && setEditingPeriod(null)}
    period={editingPeriod}
    fiscalYearId={fiscalYearId}
  />
)}

      <ConfirmationDialog />
    </div>
  );
}