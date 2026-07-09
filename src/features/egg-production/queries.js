import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const eggProductionKeys = {
  all:    ["eggProduction"],
  lists:  () => [...eggProductionKeys.all, "lists"],
  detail: (id) => [...eggProductionKeys.all, "detail", id],
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
// export const useEggProductions = ({ page = 1, limit = 20 } = {}) =>
//   useQuery({
//     queryKey: [...eggProductionKeys.lists(), { page, limit }],
//     queryFn:  () => fetchJSON(`${BASE}/api/egg-production?page=${page}&limit=${limit}`),
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//     retry: 2,
//     retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
//     throwOnError: false,
//   });

// useEggProductions কে replace করো এটা দিয়ে:
export const useAllEggProductions = () =>
  useQuery({
    queryKey: [...eggProductionKeys.all, "all"],
    queryFn:  () => fetchJSON(`${BASE}/api/egg-production?limit=0`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

  // শুধু invoice sheet গুলার জন্য — already-invoiced date বাদ দিয়ে
export const useAvailableEggProductions = () =>
  useQuery({
    queryKey: [...eggProductionKeys.all, "available"],
    queryFn:  () => fetchJSON(`${BASE}/api/egg-production?limit=0&excludeInvoiced=true`),
    staleTime: 2 * 60 * 1000,        // ছোট staleTime, কারণ invoice create/delete হলে দ্রুত reflect করা দরকার
    gcTime:    5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useEggProductionByDateRange = (fromDate, toDate) =>
  useQuery({
    queryKey: [...eggProductionKeys.lists(), { fromDate, toDate }],
    queryFn:  () =>
      fetchJSON(`${BASE}/api/egg-production?fromDate=${fromDate}&toDate=${toDate}`),
    enabled: !!fromDate && !!toDate,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useEggProductionById = (id) =>
  useQuery({
    queryKey: eggProductionKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/egg-production/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateEggProduction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/egg-production`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: eggProductionKeys.all }), // ✅
    onError: (err) => console.error("Create egg production failed:", err),
  });
};

export const useDeleteEggProduction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/egg-production/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: eggProductionKeys.all }), // ✅
    onError: (err) => console.error("Delete egg production failed:", err),
  });
};

export const useUpdateEggProduction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/egg-production/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      // ✅ eggProductionKeys.all দিয়ে সব query invalidate হবে
      qc.invalidateQueries({ queryKey: eggProductionKeys.all });
    },
    onError: (err) => console.error("Update egg production failed:", err),
  });
};


// export const useDeleteEggProduction = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (id) =>
//       fetchJSON(`${BASE}/api/egg-production/${id}`, { method: "DELETE" }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: eggProductionKeys.lists() }),
//     onError: (err) => console.error("Delete egg production failed:", err),
//   });
// };


// ─── Add this to your existing queries.js ────────────────────────────────────

export const useMonthlyEggProduction = (year = new Date().getFullYear()) =>
  useQuery({
    queryKey: [...eggProductionKeys.all, "monthly", year],
    queryFn:  () => fetchJSON(`${BASE}/api/egg-production/monthly-summary?year=${year}`),
    staleTime: 10 * 60 * 1000,
    gcTime:    15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });


  // ─── Add these 2 hooks to your existing queries.js ───────────────────────────

// Hook for Chart 1 — Monthly summary (total + avg daily)
export const useMonthlySummary = (year = new Date().getFullYear()) =>
  useQuery({
    queryKey: [...eggProductionKeys.all, "monthly-summary", year],
    queryFn:  () => fetchJSON(`${BASE}/api/egg-production/monthly-summary-avg?year=${year}`),
    staleTime: 10 * 60 * 1000,
    gcTime:    15 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

// Hook for Chart 2 — Daily trend for a specific month
export const useDailyTrend = (year = new Date().getFullYear(), month = new Date().getMonth() + 1) =>
  useQuery({
    queryKey: [...eggProductionKeys.all, "daily-trend", year, month],
    queryFn:  () =>
      fetchJSON(`${BASE}/api/egg-production/daily-trend?year=${year}&month=${month}`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });