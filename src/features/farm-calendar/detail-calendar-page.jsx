// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
// import { SectionContainer } from "@/components/SectionContainer";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// import { useFarmCalendarById, useFarmCalendarCounts } from "./queries";
// import HeaderSummaryCard from "./header-summary-card";
// import UpdateFarmCalendarSheet from "./update-header-calender-sheet";
// import ActivitiesTab from "./activity-tab";
// import KpiTargetsTab from "./kpi-tab";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

// export default function FarmCalendarDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const {
//     data: record,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useFarmCalendarById(id);

//   const { data: counts } = useFarmCalendarCounts(id);

//   if (isError) {
//     return (
//       <SectionContainer>
//         <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//           <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
//           </Button>
//         </div>
//         <div className="bg-card rounded-lg shadow-sm p-4">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error Loading Farm Calendar</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load this farm calendar."}</p>
//               <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//                 {isFetching
//                   ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Retrying...</>
//                   : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </SectionContainer>
//     );
//   }

//   return (
//     <SectionContainer>
//       <div className="mb-2">
//         <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
//           <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
//         </Button>
//       </div>

//       <HeaderSummaryCard
//         record={record}
//         isLoading={isLoading}
//         onEdit={() => setIsEditOpen(true)}
//       />

//       <div className="bg-card rounded-md shadow-sm p-4">
//         <Tabs defaultValue="activities">
//           <TabsList>
//             <TabsTrigger value="activities" className="gap-1.5">
//               Calendar Details
//               {counts?.DETAILS_COUNT > 0 && (
//                 <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
//                   {counts.DETAILS_COUNT}
//                 </Badge>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="kpi" className="gap-1.5">
//               KPI Targets
//               {counts?.KPI_COUNT > 0 && (
//                 <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
//                   {counts.KPI_COUNT}
//                 </Badge>
//               )}
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="activities" className="mt-4">
//             <ActivitiesTab calendarId={id} />
//           </TabsContent>
//           <TabsContent value="kpi" className="mt-4">
//             <KpiTargetsTab calendarId={id} />
//           </TabsContent>
//         </Tabs>
//       </div>

//       {isEditOpen && (
//         <UpdateFarmCalendarSheet
//           open={isEditOpen}
//           onOpenChange={setIsEditOpen}
//           showConfirmation={showConfirmation}
//           record={record}
//         />
//       )}
//       <ConfirmationDialog />
//     </SectionContainer>
//   );
// }

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw, ShieldAlert } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useHasPermission } from "@/hooks/use-permission";
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

import { FARM_PERMS } from "./permissions";
import { useFarmCalendarById, useFarmCalendarCounts } from "./queries";
import HeaderSummaryCard from "./header-summary-card";
import UpdateFarmCalendarSheet from "./update-header-calender-sheet";
import ActivitiesTab from "./activity-tab";
import KpiTargetsTab from "./kpi-tab";

export default function FarmCalendarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  // ── Permissions ──
  const canView = useHasPermission(FARM_PERMS.VIEW);
  const canEdit = useHasPermission(FARM_PERMS.EDIT);

  const {
    data: record,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFarmCalendarById(id);

  const { data: counts } = useFarmCalendarCounts(id);

  // View permission na thakle kichui dekhabe na (shob hooks er pore early return)
  if (!canView) {
    return (
      <SectionContainer>
        <div className="bg-card rounded-md shadow-sm p-10 flex flex-col items-center text-center">
          <ShieldAlert className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Access denied</p>
          <p className="text-xs text-muted-foreground mt-1">
            You don't have permission to view this farm calendar.
          </p>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
          </Button>
        </div>
      </SectionContainer>
    );
  }

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
            <AlertTitle>Error Loading Farm Calendar</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-2">
              <p>{error?.message || "Failed to load this farm calendar."}</p>
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
        onEdit={canEdit ? () => setIsEditOpen(true) : undefined}
      />

      <div className="bg-card rounded-md shadow-sm p-4">
        <Tabs defaultValue="activities">
          <TabsList>
            <TabsTrigger value="activities" className="gap-1.5">
              Calendar Details
              {counts?.DETAILS_COUNT > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {counts.DETAILS_COUNT}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="kpi" className="gap-1.5">
              KPI Targets
              {counts?.KPI_COUNT > 0 && (
                <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
                  {counts.KPI_COUNT}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="mt-4">
            <ActivitiesTab calendarId={id} />
          </TabsContent>
          <TabsContent value="kpi" className="mt-4">
            <KpiTargetsTab calendarId={id} />
          </TabsContent>
        </Tabs>
      </div>

      {isEditOpen && (
        <UpdateFarmCalendarSheet
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