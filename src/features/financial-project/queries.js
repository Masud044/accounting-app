import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/financial-project`;
const PROJECTS_API = `${BASE}/api/project-profile/projects`; // BWA.PROJECTS dropdown source

// ── Query Keys ────────────────────────────────────────────────────────────────
export const financialProjectionKeys = {
  all:  ["financialProjection"],
  list: () => [...financialProjectionKeys.all, "list"],
};

export const projectKeys = {
  all:  ["projects"],
  list: () => [...projectKeys.all, "list"],
};

// ── Fetcher ───────────────────────────────────────────────────────────────────
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

// ═══════════════════ PROJECTS (dropdown source) ═══════════════════
export const useProjects = () =>
  useQuery({
    queryKey: projectKeys.list(),
    queryFn:  () => fetchJSON(`${PROJECTS_API}`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

// ═══════════════════ FINANCIAL PROJECTIONS ═══════════════════
export const useFinancialProjections = () =>
  useQuery({
    queryKey: financialProjectionKeys.list(),
    queryFn:  () => fetchJSON(`${API}`),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateFinancialProjection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${API}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialProjectionKeys.all }),
    onError: (err) => console.error("Create financial projection failed:", err),
  });
};

export const useUpdateFinancialProjection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${API}/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialProjectionKeys.all }),
    onError: (err) => console.error("Update financial projection failed:", err),
  });
};

export const useDeleteFinancialProjection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: financialProjectionKeys.all }),
    onError: (err) => console.error("Delete financial projection failed:", err),
  });
};