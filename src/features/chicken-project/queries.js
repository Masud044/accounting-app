import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const chickenProjectKeys = {
  all:    ["chickenProject"],
  lists:  () => [...chickenProjectKeys.all, "list"],
  detail: (id) => [...chickenProjectKeys.all, "detail", id],
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
export const useChickenProjects = () =>
  useQuery({
    queryKey: chickenProjectKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useChickenProjectById = (id) =>
  useQuery({
    queryKey: chickenProjectKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateChickenProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/chicken-project`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenProjectKeys.all }),
    onError: (err) => console.error("Create chicken project failed:", err),
  });
};

export const useUpdateChickenProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/chicken-project/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenProjectKeys.all }),
    onError: (err) => console.error("Update chicken project failed:", err),
  });
};

export const useDeleteChickenProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/chicken-project/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenProjectKeys.all }),
    onError: (err) => console.error("Delete chicken project failed:", err),
  });
};