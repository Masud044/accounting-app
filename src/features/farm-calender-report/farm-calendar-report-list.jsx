// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";

// import { SectionContainer } from "@/components/SectionContainer";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";

// // ── API base + fetcher (report page-er shathe same pattern) ───────────────
// const BASE = import.meta.env.VITE_API_BASE_URL;
// const API = `${BASE}/api/farm-calendar`; // calendar header list endpoint

// const fetchJSON = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// export const farmCalendarKeys = {
//   all: ["farmCalendars"],
// };

// const fetchFarmCalendars = () => fetchJSON(API);

// export default function FarmCalendarReportList() {
//   const navigate = useNavigate();

//   const { data: calendars, isLoading, isError } = useQuery({
//     queryKey: farmCalendarKeys.all,
//     queryFn: fetchFarmCalendars,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

//   if (isLoading) {
//     return (
//       <SectionContainer title="Farm Calendar Report">
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
//       <SectionContainer title="Farm Calendar Report">
//         <p className="text-sm text-destructive">
//           Calendar list load korte problem hoyeche. Please try again.
//         </p>
//       </SectionContainer>
//     );
//   }

//   const list = calendars ?? [];

//   return (
//     <SectionContainer
//       title="Farm Calendar Report"
//       description="Report dekhte kono calendar select koro"
//     >
//       {list.length === 0 ? (
//         <p className="text-sm text-muted-foreground">not found calendar</p>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {list.map((c) => (
//             <button
//               key={c.CALENDAR_ID}
//               type="button"
//               onClick={() => navigate(`/dashboard/farm-calendar-report/${c.CALENDAR_ID}`)}
//               className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-shadow hover:shadow-md"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <IconCalendarStats size={18} className="text-primary" />
//                   <span className="font-medium">
//                     {c.FARM_NAME} — {c.CALENDAR_YEAR}
//                   </span>
//                 </div>
//                 <IconChevronRight size={18} className="text-muted-foreground" />
//               </div>
//               <p className="line-clamp-2 text-xs text-muted-foreground">
//                 {c.DESCRIPTION || "No description"}
//               </p>
//               <Badge
//                 variant={c.STATUS === "ACTIVE" ? "default" : "secondary"}
//                 className="w-fit"
//               >
//                 {c.STATUS}
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
  IconCalendarStats, 
  IconChevronRight,
  IconCalendar,
  IconClock,
  IconRefresh,
} from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher ───────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/farm-calendar`;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

export const farmCalendarKeys = {
  all: ["farmCalendars"],
};

const fetchFarmCalendars = () => fetchJSON(API);

export default function FarmCalendarReportList() {
  const navigate = useNavigate();

  const { data: calendars, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: farmCalendarKeys.all,
    queryFn: fetchFarmCalendars,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <SectionContainer title="Farm Calendar Report">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </SectionContainer>
    );
  }

  if (isError) {
    return (
      <SectionContainer title="Farm Calendar Report ">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6  text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <span className="text-red-600 text-xl">⚠</span>
            </div>
            <p className="text-sm font-medium text-red-700">
              Calendar list could not be loaded
            </p>
            <p className="text-xs text-red-500 mt-1">
              Please check your connection and try again.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  Retrying...
                </div>
              ) : (
                <>
                  <IconRefresh size={14} className="mr-1.5" />
                  Retry
                </>
              )}
            </Button>
          </div>
        </div>
      </SectionContainer>
    );
  }

  const list = calendars ?? [];

  return (
    <SectionContainer
      title="Farm Calendar Report"
      description="Select a calendar to view its detailed report"
    >
      {list.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <IconCalendarStats size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-600">No calendars created yet</p>
            <p className="text-sm text-gray-400 mt-1">Create a farm calendar to generate reports</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 px-6 py-4  sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <button
                key={c.CALENDAR_ID}
                type="button"
                onClick={() => navigate(`/dashboard/farm-calendar-report/${c.CALENDAR_ID}`)}
                className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all duration-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1"
              >
                {/* Decorative gradient line on hover */}
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                      <IconCalendarStats size={20} className="text-emerald-700 group-hover:text-emerald-800" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                        {c.FARM_NAME}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <IconCalendar size={12} className="text-gray-400 flex-shrink-0" />
                        <p className="text-xs text-gray-400">
                          {c.CALENDAR_YEAR}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0 mt-1">
                    <IconChevronRight 
                      size={16} 
                      className="text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" 
                    />
                  </div>
                </div>

                {c.DESCRIPTION && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {c.DESCRIPTION}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    className={c.STATUS === "ACTIVE" 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }
                  >
                    {c.STATUS || "DRAFT"}
                  </Badge>
                  {c.CAPACITY && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                      <IconClock size={12} className="text-blue-500" />
                      <span className="text-xs text-blue-600">Capacity: {c.CAPACITY}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {list.length} {list.length === 1 ? "calendar" : "calendars"}
              </Badge>
             
            </div>
            {/* <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  <IconRefresh size={14} className="mr-1.5" />
                  Refresh
                </>
              )}
            </Button> */}
          </div>
        </>
      )}
    </SectionContainer>
  );
}