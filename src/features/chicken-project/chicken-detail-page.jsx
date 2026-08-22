// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
// import { SectionContainer } from "@/components/SectionContainer";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// import { useChickenProjectById, useChickenProjectCounts } from "./queries";
// import HeaderSummaryCard from "./header-summary-card";
// import UpdateChickenProjectSheet from "./update-chicken-sheet";
// import DetailsTab from "./detail-tab";
// import VaccinationTab from "./vaccination-tab";
// import { useConfirmationDialog } from "@/hooks/useConfirmationDialog";

// export default function ChickenProjectDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

//   const {
//     data: project,
//     isLoading,
//     isError,
//     error,
//     refetch,
//     isFetching,
//   } = useChickenProjectById(id);

//   const { data: counts } = useChickenProjectCounts(id);

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
//             <AlertTitle>Error Loading Project</AlertTitle>
//             <AlertDescription className="mt-2 flex flex-col gap-2">
//               <p>{error?.message || "Failed to load chicken project."}</p>
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
//         project={project}
//         isLoading={isLoading}
//         onEdit={() => setIsEditOpen(true)}
//       />

//       <div className="bg-card rounded-md shadow-sm p-4">
//         <Tabs defaultValue="details">
//           <TabsList>
//             <TabsTrigger value="details" className="gap-1.5">
//               Details
//               {counts?.DETAILS_COUNT > 0 && (
//                 <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
//                   {counts.DETAILS_COUNT}
//                 </Badge>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="vaccination" className="gap-1.5">
//               Vaccination
//               {counts?.VACCINATION_COUNT > 0 && (
//                 <Badge variant="secondary" className="rounded-full px-1.5 text-xs tabular-nums">
//                   {counts.VACCINATION_COUNT}
//                 </Badge>
//               )}
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="details" className="mt-4">
//             <DetailsTab hId={id} />
//           </TabsContent>
//           <TabsContent value="vaccination" className="mt-4">
//             <VaccinationTab hid={id} />
//           </TabsContent>
//         </Tabs>
//       </div>

//       {isEditOpen && (
//         <UpdateChickenProjectSheet
//           open={isEditOpen}
//           onOpenChange={setIsEditOpen}
//           showConfirmation={showConfirmation}
//           record={project}
//         />
//       )}
//       <ConfirmationDialog />
//     </SectionContainer>
//   );
// }
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw, Calendar, FileText, Syringe } from "lucide-react";
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
        <div className="p-4 md:p-6">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to list
              </Button>
            </div>
            <div className="p-6">
              <div className="rounded-lg bg-red-50 border border-red-200 p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Error Loading Project</h4>
                    <p className="text-sm text-red-600 mt-1">{error?.message || "Failed to load chicken project."}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()} 
                      disabled={isFetching}
                      className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {isFetching ? (
                        <>
                          <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Retrying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-3.5 w-3.5" />
                          Retry
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="p-4 md:p-6 space-y-6">
        {/* Back Button */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to list
          </Button>
        </div>

        {/* Header Card */}
        <HeaderSummaryCard
          project={project}
          isLoading={isLoading}
          onEdit={() => setIsEditOpen(true)}
        />

        {/* Tabs Card */}
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-4">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-gray-50 p-1 rounded-lg">
                <TabsTrigger 
                  value="details" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 transition-all gap-2"
                >
                  <FileText size={14} />
                  Details
                  {counts?.DETAILS_COUNT > 0 && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 ml-1">
                      {counts.DETAILS_COUNT}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="vaccination" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 transition-all gap-2"
                >
                  <Syringe size={14} />
                  Vaccination
                  {counts?.VACCINATION_COUNT > 0 && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 ml-1">
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
        </div>

        {/* Sheets */}
        {isEditOpen && (
          <UpdateChickenProjectSheet
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            showConfirmation={showConfirmation}
            record={project}
          />
        )}
        <ConfirmationDialog />
      </div>
    </SectionContainer>
  );
}