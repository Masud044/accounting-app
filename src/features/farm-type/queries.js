import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const farmTypeKeys = {
  all:   ["farmType"],
  lists: () => [...farmTypeKeys.all, "list"],
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
export const useFarmTypes = () =>
  useQuery({
    queryKey: farmTypeKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-type`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useCreateFarmType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-type`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmTypeKeys.all }),
    onError: (err) => console.error("Create farm type failed:", err),
  });
};

export const useUpdateFarmType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-type/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmTypeKeys.all }),
    onError: (err) => console.error("Update farm type failed:", err),
  });
};

export const useDeleteFarmType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/farm-type/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmTypeKeys.all }),
    onError: (err) => console.error("Delete farm type failed:", err),
  });
};