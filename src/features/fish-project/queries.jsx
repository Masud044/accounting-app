import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const fishProjectKeys = {
  all:    ["fishProject"],
  lists:  () => [...fishProjectKeys.all, "list"],
  detail: (id) => [...fishProjectKeys.all, "detail", id],
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
export const useFishProjects = () =>
  useQuery({
    queryKey: fishProjectKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/fish-project`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useFishProjectById = (id) =>
  useQuery({
    queryKey: fishProjectKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/fish-project/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateFishProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/fish-project`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: fishProjectKeys.all }),
    onError: (err) => console.error("Create fish project failed:", err),
  });
};

export const useUpdateFishProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/fish-project/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: fishProjectKeys.all }),
    onError: (err) => console.error("Update fish project failed:", err),
  });
};

export const useDeleteFishProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/fish-project/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: fishProjectKeys.all }),
    onError: (err) => console.error("Delete fish project failed:", err),
  });
};