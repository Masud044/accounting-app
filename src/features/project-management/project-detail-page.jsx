import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useProjectById } from "./queries";
import HeaderSummaryCard from "./header-summary-card";
import UpdateProjectSheet from "./update-project-sheet";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

import ResourceCrudSection from "./resource-all";
import {
  objectivesConfig, capacityConfig, infrastructureConfig, investmentsConfig,
  schedulesConfig, marketingConfig, financialConfig, risksConfig, benefitsConfig,
} from "./resource-config";
import PhasesTab from "./phase-tab";
import ActivitiesTab from "./active-tab";
import ConclusionTab from "./conclusion";

// Tab order follows the flow: header → objectives/capacity/infra/investments →
// schedules/marketing → phases/activities → financial/risks/benefits → conclusion
const TABS = [
  { value: "objectives", label: "Objectives" },
  { value: "capacity", label: "Capacity" },
  { value: "infrastructure", label: "Infra Reqs" },
  { value: "investments", label: "Investments" },
  { value: "schedules", label: "Schedules" },
  { value: "marketing", label: "Marketing" },
  { value: "phases", label: "Phases" },
  { value: "activities", label: "Activities" },
  { value: "financial", label: "Financial" },
  { value: "risks", label: "Risks" },
  { value: "benefits", label: "Benefits" },
  { value: "conclusion", label: "Conclusion" },
];

export default function ProjectDetailPage() {
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
  } = useProjectById(id);

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
              <p>{error?.message || "Failed to load this project."}</p>
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
        <Tabs defaultValue="objectives">
          <TabsList className="flex flex-wrap h-auto gap-1">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="objectives" className="mt-4">
            <ResourceCrudSection projectId={id} config={objectivesConfig} />
          </TabsContent>
          <TabsContent value="capacity" className="mt-4">
            <ResourceCrudSection projectId={id} config={capacityConfig} />
          </TabsContent>
          <TabsContent value="infrastructure" className="mt-4">
            <ResourceCrudSection projectId={id} config={infrastructureConfig} />
          </TabsContent>
          <TabsContent value="investments" className="mt-4">
            <ResourceCrudSection projectId={id} config={investmentsConfig} />
          </TabsContent>
          <TabsContent value="schedules" className="mt-4">
            <ResourceCrudSection projectId={id} config={schedulesConfig} />
          </TabsContent>
          <TabsContent value="marketing" className="mt-4">
            <ResourceCrudSection projectId={id} config={marketingConfig} />
          </TabsContent>
          <TabsContent value="phases" className="mt-4">
            <PhasesTab projectId={id} />
          </TabsContent>
          <TabsContent value="activities" className="mt-4">
            <ActivitiesTab projectId={id} />
          </TabsContent>
          <TabsContent value="financial" className="mt-4">
            <ResourceCrudSection projectId={id} config={financialConfig} />
          </TabsContent>
          <TabsContent value="risks" className="mt-4">
            <ResourceCrudSection projectId={id} config={risksConfig} />
          </TabsContent>
          <TabsContent value="benefits" className="mt-4">
            <ResourceCrudSection projectId={id} config={benefitsConfig} />
          </TabsContent>
          <TabsContent value="conclusion" className="mt-4">
            <ConclusionTab projectId={id} />
          </TabsContent>
        </Tabs>
      </div>

      {isEditOpen && (
        <UpdateProjectSheet
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