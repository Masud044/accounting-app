import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ── API base + fetcher (report page-er shathe same pattern) ───────────────
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/farm-calendar`; // calendar header list endpoint

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

  const { data: calendars, isLoading, isError } = useQuery({
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
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </SectionContainer>
    );
  }

  if (isError) {
    return (
      <SectionContainer title="Farm Calendar Report">
        <p className="text-sm text-destructive">
          Calendar list load korte problem hoyeche. Please try again.
        </p>
      </SectionContainer>
    );
  }

  const list = calendars ?? [];

  return (
    <SectionContainer
      title="Farm Calendar Report"
      description="Report dekhte kono calendar select koro"
    >
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">not found calendar</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <button
              key={c.CALENDAR_ID}
              type="button"
              onClick={() => navigate(`/dashboard/farm-calendar-report/${c.CALENDAR_ID}`)}
              className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconCalendarStats size={18} className="text-primary" />
                  <span className="font-medium">
                    {c.FARM_NAME} — {c.CALENDAR_YEAR}
                  </span>
                </div>
                <IconChevronRight size={18} className="text-muted-foreground" />
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {c.DESCRIPTION || "No description"}
              </p>
              <Badge
                variant={c.STATUS === "ACTIVE" ? "default" : "secondary"}
                className="w-fit"
              >
                {c.STATUS}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}