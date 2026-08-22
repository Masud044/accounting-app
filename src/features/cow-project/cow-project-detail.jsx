// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, AlertCircle, RefreshCw, Beef } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Spinner } from "@/components/ui/spinner";
// import { SectionContainer } from "@/components/SectionContainer";

// import { useCowProjectById } from "./queries";
// import VaccineTab from "./vaccine-tab";
// import WeightTab from "./weight-tab";

// export default function CowProjectDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const { data: project, isLoading, isError, error, refetch, isFetching } = useCowProjectById(id);

//   if (isLoading) {
//     return (
//       <SectionContainer>
//         <div className="flex flex-col items-center justify-center py-16">
//           <Spinner className="h-12 w-12 mb-4" />
//           <p className="text-muted-foreground">Loading cow details...</p>
//         </div>
//       </SectionContainer>
//     );
//   }

//   if (isError || !project) {
//     return (
//       <SectionContainer>
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Cow Project</AlertTitle>
//           <AlertDescription className="mt-2 flex flex-col gap-2">
//             <p>{error?.message || "Cow project not found."}</p>
//             <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="w-fit">
//               {isFetching ? <><Spinner className="mr-2 h-4 w-4" />Retrying...</> : <><RefreshCw className="mr-2 h-4 w-4" />Retry</>}
//             </Button>
//           </AlertDescription>
//         </Alert>
//       </SectionContainer>
//     );
//   }

//   const cowNo = project.ID;

//   return (
//     <SectionContainer>
//       {/* Header */}
//       <div className="bg-card rounded-md shadow-sm p-4 mb-4">
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/cow-project")}>
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//             <Beef className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-lg md:text-2xl font-semibold tracking-tight">Cow #{project.COW_NUMBER}</h1>
//             <p className="text-sm text-muted-foreground">Vaccine and weight history</p>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-card rounded-md shadow-sm p-4">
//         <Tabs defaultValue="vaccine">
//           <TabsList>
//             <TabsTrigger value="vaccine">Vaccine History</TabsTrigger>
//             <TabsTrigger value="weight">Weight History</TabsTrigger>
//           </TabsList>

//           <TabsContent value="vaccine" className="mt-4">
//             <VaccineTab cowNo={cowNo} cowLabel={project.COW_NUMBER} />
//           </TabsContent>

//           <TabsContent value="weight" className="mt-4">
//             <WeightTab cowNo={cowNo} cowLabel={project.COW_NUMBER} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </SectionContainer>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, RefreshCw, Beef, Calendar, Scale, Syringe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { SectionContainer } from "@/components/SectionContainer";
import { Badge } from "@/components/ui/badge";

import { useCowProjectById } from "./queries";
import VaccineTab from "./vaccine-tab";
import WeightTab from "./weight-tab";

const formatDate = (val) => {
  if (!val) return "—";
  const isoMatch = String(val).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!isoMatch) return "—";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [, year, month, day] = isoMatch;
  return `${day} ${months[Number(month) - 1]} ${year}`;
};

export default function CowProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading, isError, error, refetch, isFetching } = useCowProjectById(id);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
                <Beef size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Cow Details</h2>
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center py-16">
            <Spinner className="h-10 w-10 text-emerald-600 mb-4" />
            <p className="text-sm text-gray-400">Loading cow details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/cow-project")} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to list
            </Button>
          </div>
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error Loading Cow Project</h4>
                  <p className="text-sm text-red-600 mt-1">{error?.message || "Cow project not found."}</p>
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
    );
  }

  const isActive = Number(project.STATUS) === 1;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Card */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard/cow-project")}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 -ml-2 flex-shrink-0 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-900 shadow-sm flex-shrink-0">
                  <Beef size={18} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-gray-900">
                      Cow #{project.COW_NUMBER}
                    </h2>
                    <Badge className={isActive 
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                      : "bg-gray-100 text-gray-600 border-gray-200"
                    }>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Vaccine and weight history
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" />
                <span>Purchase: {formatDate(project.PURCHASE_DATE)}</span>
              </div>
              {project.SELLING_DATE && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-red-500" />
                  <span>Selling: {formatDate(project.SELLING_DATE)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 pt-4">
          <Tabs defaultValue="vaccine" className="w-full">
            <TabsList className="bg-gray-50 p-1 rounded-lg">
              <TabsTrigger 
                value="vaccine" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 transition-all gap-2"
              >
                <Syringe size={14} />
                Vaccine History
              </TabsTrigger>
              <TabsTrigger 
                value="weight" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 transition-all gap-2"
              >
                <Scale size={14} />
                Weight History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vaccine" className="mt-4">
              <VaccineTab cowNo={id} cowLabel={project.COW_NUMBER} />
            </TabsContent>

            <TabsContent value="weight" className="mt-4">
              <WeightTab cowNo={id} cowLabel={project.COW_NUMBER} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}