import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mortalityKeys } from "../chicken-mortality/queries";

const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/chicken-mortality-reason`;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const mortalityReasonKeys = {
  all:  ["chickenMortalityReason"],
  list: () => [...mortalityReasonKeys.all, "list"],
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

// Reason name mortality list e show hoy, tai reason change hole mortality cache o refresh hobe
const invalidateReasonScope = (qc) => {
  qc.invalidateQueries({ queryKey: mortalityReasonKeys.all });
  qc.invalidateQueries({ queryKey: mortalityKeys.all });
};

// ═══════════════════ MORTALITY REASON (LOV) ═══════════════════
export const useMortalityReasons = () =>
  useQuery({
    queryKey: mortalityReasonKeys.list(),
    queryFn:  () => fetchJSON(API),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateMortalityReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => fetchJSON(API, jsonOptions("POST", data)),
    onSuccess: () => invalidateReasonScope(qc),
    onError: (err) => console.error("Create mortality reason failed:", err),
  });
};

export const useUpdateMortalityReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => fetchJSON(`${API}/${id}`, jsonOptions("PUT", data)),
    onSuccess: () => invalidateReasonScope(qc),
    onError: (err) => console.error("Update mortality reason failed:", err),
  });
};

export const useDeleteMortalityReason = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateReasonScope(qc),
    onError: (err) => console.error("Delete mortality reason failed:", err),
  });
};