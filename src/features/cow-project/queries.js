import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const cowProjectKeys = {
  all:    ["cowProject"],
  lists:  () => [...cowProjectKeys.all, "list"],
  detail: (id) => [...cowProjectKeys.all, "detail", id],
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

// ── Hooks ─────────────────────────────────────────────────────────────────────
export const useCowProjects = () =>
  useQuery({
    queryKey: cowProjectKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/cow-project`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useCowProjectById = (id) =>
  useQuery({
    queryKey: cowProjectKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/cow-project/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateCowProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/cow-project`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowProjectKeys.all }),
    onError: (err) => console.error("Create cow project failed:", err),
  });
};

export const useUpdateCowProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/cow-project/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowProjectKeys.all }),
    onError: (err) => console.error("Update cow project failed:", err),
  });
};

export const useDeleteCowProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/cow-project/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowProjectKeys.all }),
    onError: (err) => console.error("Delete cow project failed:", err),
  });
};