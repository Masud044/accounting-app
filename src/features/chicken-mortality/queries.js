import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/chicken-project-mortality`;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const mortalityKeys = {
  all:  ["chickenProjectMortality"],
  list: (detailId) => [...mortalityKeys.all, "list", detailId],
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

const jsonOptions = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// ═══════════════════ CHICKEN PROJECT MORTALITY (per detail) ═══════════════════
export const useMortalities = (detailId) =>
  useQuery({
    queryKey: mortalityKeys.list(detailId),
    queryFn:  () => fetchJSON(`${API}?detailId=${detailId}`),
    enabled:  !!detailId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateMortality = (detailId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetchJSON(API, jsonOptions("POST", data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: mortalityKeys.list(detailId) }),
    onError: (err) => console.error("Create mortality failed:", err),
  });
};

export const useUpdateMortality = (detailId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => fetchJSON(`${API}/${id}`, jsonOptions("PUT", data)),
    onSuccess: () => qc.invalidateQueries({ queryKey: mortalityKeys.list(detailId) }),
    onError: (err) => console.error("Update mortality failed:", err),
  });
};

export const useDeleteMortality = (detailId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: mortalityKeys.list(detailId) }),
    onError: (err) => console.error("Delete mortality failed:", err),
  });
};