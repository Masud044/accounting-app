// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { IconFileDescription, IconChevronRight } from "@tabler/icons-react";

// import { SectionContainer } from "@/components/SectionContainer";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// // ── API base + fetcher (report page-er shathe same pattern) ───────────────
// const BASE = import.meta.env.VITE_API_BASE_URL;
// const API = `${BASE}/api/project-profile`;

// const fetchJSON = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// export const projectProfileListKeys = {
//   all: ["projectProfileList"],
// };

// const fetchProjects = () => fetchJSON(`${API}/projects`);

// export default function ProjectProfileReportList() {
//   const navigate = useNavigate();

//   const { data: projects, isLoading, isError } = useQuery({
//     queryKey: projectProfileListKeys.all,
//     queryFn: fetchProjects,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

//   if (isLoading) {
//     return (
//       <SectionContainer title="Project Profile Report">
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 6 }).map((_, i) => (
//             <Skeleton key={i} className="h-28 w-full" />
//           ))}
//         </div>
//       </SectionContainer>
//     );
//   }

//   if (isError) {
//     return (
//       <SectionContainer title="Project Profile Report">
//         <p className="text-sm text-destructive">
//            Please try again.
//         </p>
//       </SectionContainer>
//     );
//   }

//   const list = projects ?? [];

//   return (
//     <SectionContainer
//       title="Project Profile Report"
//       description="Report dekhte kono project select koro"
//     >
//       {list.length === 0 ? (
//         <p className="text-sm text-muted-foreground">Kono project toiri kora hoyni.</p>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {list.map((p) => (
//             <button
//               key={p.PROJECT_ID}
//               type="button"
//               onClick={() => navigate(`/dashboard/project-profile-report/${p.PROJECT_ID}`)}
//               className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-shadow hover:shadow-md"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <IconFileDescription size={18} className="text-primary" />
//                   <span className="font-medium">{p.PROJECT_NAME}</span>
//                 </div>
//                 <IconChevronRight size={18} className="text-muted-foreground" />
//               </div>
//               <p className="line-clamp-2 text-xs text-muted-foreground">
//                 {p.PROJECT_LOCATION || "No location set"}
//               </p>
//               <Badge variant="secondary" className="w-fit">
//                 {p.BUSINESS_TYPE || "—"}
//               </Badge>
//             </button>
//           ))}
//         </div>
//       )}
//     </SectionContainer>
//   );
// }

import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  IconFileDescription, 
  IconChevronRight, 
  IconBuildingWarehouse,
  IconMapPin,
  IconBriefcase,
  IconClock,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher ───────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/project-profile`;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

export const projectProfileListKeys = {
  all: ["projectProfileList"],
};

const fetchProjects = () => fetchJSON(`${API}/projects`);

export default function ProjectProfileReportList() {
  const navigate = useNavigate();

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: projectProfileListKeys.all,
    queryFn: fetchProjects,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
              <IconFileDescription size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Project Profile Report</h2>
              <p className="text-xs text-gray-400">Loading projects...</p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600">
              <IconFileDescription size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Project Profile Report</h2>
              <p className="text-xs text-gray-400">Project list</p>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="text-red-400">⚠</span>
                Projects could not be loaded. Please try again.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="mt-3 border-red-200 text-red-600 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const list = projects ?? [];

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-sm">
              <IconFileDescription size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Project Profile Report</h2>
              <p className="text-xs text-gray-400">
                {list.length} {list.length === 1 ? "project" : "projects"} available
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
            Total: {list.length}
          </Badge>
        </div>

        <div className="p-6">
          {list.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                  <IconFileDescription size={32} className="text-gray-300" />
                </div>
                <p className="text-base font-medium text-gray-600">No projects created yet</p>
                <p className="text-sm text-gray-400 mt-1">Create a project to generate profile reports</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <button
                    key={p.PROJECT_ID}
                    type="button"
                    onClick={() => navigate(`/dashboard/project-profile-report/${p.PROJECT_ID}`)}
                    className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                          <IconBuildingWarehouse size={20} className="text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                            {p.PROJECT_NAME}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <IconMapPin size={12} className="text-gray-400 flex-shrink-0" />
                            <p className="text-xs text-gray-400 truncate">
                              {p.PROJECT_LOCATION || "No location set"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                        <IconChevronRight 
                          size={16} 
                          className="text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
                        <IconBriefcase size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {p.BUSINESS_TYPE || "—"}
                        </span>
                      </div>
                      {p.DURATION_DESC && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                          <IconClock size={12} className="text-blue-500" />
                          <span className="text-xs text-blue-600">{p.DURATION_DESC}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Showing {list.length} project{list.length > 1 ? "s" : ""}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                >
                  Refresh
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}