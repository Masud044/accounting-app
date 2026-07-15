import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw, Beef } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { SectionContainer } from "@/components/SectionContainer";

import { useCowProjectById } from "./queries";
import VaccineTab from "./vaccine-tab";
import WeightTab from "./weight-tab";

export default function CowProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, isError, error, refetch, isFetching } = useCowProjectById(id);

  if (isLoading) {
    return (
      <SectionContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner className="h-12 w-12 mb-4" />
          <p className="text-muted-foreground">Loading cow details...</p>
        </div>
      </SectionContainer>
    );
  }

  if (isError || !project) {
    return (
      <SectionContainer>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Cow Project</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-2">
            <p>{error?.message || "Cow project not found."}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
              {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
            </Button>
          </AlertDescription>
        </Alert>
      </SectionContainer>
    );
  }

  const cowNo = project.ID;

  return (
    <SectionContainer>
      {/* Header */}
      <div className="bg-card rounded-md shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/cow-project")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Beef className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Cow #{project.COW_NUMBER}</h1>
            <p className="text-sm text-muted-foreground">Vaccine and weight history</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-md shadow-sm p-4">
        <Tabs defaultValue="vaccine">
          <TabsList>
            <TabsTrigger value="vaccine">Vaccine History</TabsTrigger>
            <TabsTrigger value="weight">Weight History</TabsTrigger>
          </TabsList>

          <TabsContent value="vaccine" className="mt-4">
            <VaccineTab cowNo={cowNo} cowLabel={project.COW_NUMBER} />
          </TabsContent>

          <TabsContent value="weight" className="mt-4">
            <WeightTab cowNo={cowNo} cowLabel={project.COW_NUMBER} />
          </TabsContent>
        </Tabs>
      </div>
    </SectionContainer>
  );
}