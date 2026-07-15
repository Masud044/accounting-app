import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { useChickenProjectById, useChickenProjectCounts } from "./queries";
import HeaderSummaryCard from "./header-summary-card";
import UpdateChickenProjectSheet from "./update-chicken-sheet";
import DetailsTab from "./detail-tab";
import VaccinationTab from "./vaccination-tab";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

export default function ChickenProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useChickenProjectById(id);

  const { data: counts } = useChickenProjectCounts(id);

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
            <AlertTitle>Error Loading Project</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load chicken project."}</p>
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
        project={project}
        isLoading={isLoading}
        onEdit={() => setIsEditOpen(true)}
      />

      <div className="bg-card rounded-md shadow-sm p-4">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details" className="gap-1.5">
              Details
              {counts?.DETAILS_COUNT > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {counts.DETAILS_COUNT}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="vaccination" className="gap-1.5">
              Vaccination
              {counts?.VACCINATION_COUNT > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {counts.VACCINATION_COUNT}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <DetailsTab hId={id} />
          </TabsContent>
          <TabsContent value="vaccination" className="mt-4">
            <VaccinationTab hid={id} />
          </TabsContent>
        </Tabs>
      </div>

      {isEditOpen && (
        <UpdateChickenProjectSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          showConfirmation={showConfirmation}
          record={project}
        />
      )}
      <ConfirmationDialog />
    </SectionContainer>
  );
}