import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import {
  useFarmProjectById,
  useFarmProjectPhases,
  useFarmProjectActivities,
  useFinancialProjections,
} from "./queries";
import HeaderSummaryCard from "./header-summary-card";
import UpdateFarmProjectSheet from "./update-project-sheet";
import PhasesTab from "./phase-tab";
import ActivitiesTab from "./activites-tab";
import FinancialProjectionsTab from "./financial-tab";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

export default function FarmProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: record,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFarmProjectById(id);

  // Fetched here once so the tab badges can show counts without a dedicated counts endpoint.
  const { data: phases = [] } = useFarmProjectPhases(id);
  const { data: activities = [] } = useFarmProjectActivities(id);
  const { data: projections = [] } = useFinancialProjections(id);

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
            <AlertTitle>Error Loading Farm Project</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load this farm project."}</p>
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
        record={record}
        isLoading={isLoading}
        onEdit={() => setIsEditOpen(true)}
      />

      <div className="bg-card rounded-md shadow-sm p-4">
        <Tabs defaultValue="phases">
          <TabsList>
            <TabsTrigger value="phases" className="gap-1.5">
              Phases
              {phases.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {phases.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-1.5">
              Activities
              {activities.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {activities.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-1.5">
              Financial Projections
              {projections.length > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {projections.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phases" className="mt-4">
            <PhasesTab projectId={id} />
          </TabsContent>
          <TabsContent value="activities" className="mt-4">
            <ActivitiesTab projectId={id} />
          </TabsContent>
          <TabsContent value="financial" className="mt-4">
            <FinancialProjectionsTab projectId={id} />
          </TabsContent>
        </Tabs>
      </div>

      {isEditOpen && (
        <UpdateFarmProjectSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          showConfirmation={showConfirmation}
          record={record}
        />
      )}
      <ConfirmationDialog />
    </SectionContainer>
  );
}