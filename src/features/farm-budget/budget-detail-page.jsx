import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useFarmBudgetById } from "./queries";
import HeaderSummaryCard from "./header-summary-card";
import UpdateFarmBudgetSheet from "./update-farm-budget-sheet";
import DetailsTab from "./detail-tab";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

export default function FarmBudgetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: budget,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFarmBudgetById(id);

  if (isError) {
    return (
      <SectionContainer>
        <div className="bg-card rounded-md shadow-sm p-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
          </Button>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Budget</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load farm budget."}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
                {isFetching
                  ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Retrying...</>
                  : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
        </Button>
      </div>

      <HeaderSummaryCard
        budget={budget}
        isLoading={isLoading}
        onEdit={() => setIsEditOpen(true)}
      />

      <div className="bg-card rounded-md shadow-sm p-4">
        <h2 className="text-base font-semibold mb-4">Expense Lines</h2>
        <DetailsTab budgetId={id} />
      </div>

      {isEditOpen && (
        <UpdateFarmBudgetSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          showConfirmation={showConfirmation}
          record={budget}
        />
      )}
      <ConfirmationDialog />
    </SectionContainer>
  );
}