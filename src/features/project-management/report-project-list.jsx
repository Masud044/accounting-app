import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IconFileDescription, IconChevronRight } from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ── API base + fetcher (report page-er shathe same pattern) ───────────────
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
      <SectionContainer title="Project Profile Report">
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
      <SectionContainer title="Project Profile Report">
        <p className="text-sm text-destructive">
           Please try again.
        </p>
      </SectionContainer>
    );
  }

  const list = projects ?? [];

  return (
    <SectionContainer
      title="Project Profile Report"
      description="Report dekhte kono project select koro"
    >
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Kono project toiri kora hoyni.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <button
              key={p.PROJECT_ID}
              type="button"
              onClick={() => navigate(`/dashboard/project-profile-report/${p.PROJECT_ID}`)}
              className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconFileDescription size={18} className="text-primary" />
                  <span className="font-medium">{p.PROJECT_NAME}</span>
                </div>
                <IconChevronRight size={18} className="text-muted-foreground" />
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {p.PROJECT_LOCATION || "No location set"}
              </p>
              <Badge variant="secondary" className="w-fit">
                {p.BUSINESS_TYPE || "—"}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}