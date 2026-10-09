import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

const API = `${BASE}/api/chicken-shed/shed`;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const chickenShedKeys = {
  all:    ["chickenShed"],
  list:   () => [...chickenShedKeys.all, "list"],
  detail: (id) => [...chickenShedKeys.all, "detail", id],
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
// Egg production er LOV + list page, duita i eta use kore
export const useAllChickenSheds = () =>
  useQuery({
    queryKey: chickenShedKeys.list(),
    queryFn:  () => fetchJSON(API),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useChickenShedById = (id) =>
  useQuery({
    queryKey: chickenShedKeys.detail(id),
    queryFn:  () => fetchJSON(`${API}/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateChickenShed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(API, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenShedKeys.all }),
    onError: (err) => console.error("Create chicken shed failed:", err),
  });
};

export const useUpdateChickenShed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${API}/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chickenShedKeys.all });
      // Egg production list e SHED_CODE join diye ashe, tai rename hole oitao refresh hobe
      qc.invalidateQueries({ queryKey: ["eggProduction"] });
    },
    onError: (err) => console.error("Update chicken shed failed:", err),
  });
};

export const useDeleteChickenShed = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chickenShedKeys.all });
      qc.invalidateQueries({ queryKey: ["eggProduction"] });
    },
    onError: (err) => console.error("Delete chicken shed failed:", err),
  });
};