import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const trialBalanceKeys = {
  all:    ["trialBalance"],
  report: (params) => [...trialBalanceKeys.all, "report", params],
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
export const useTrialBalance = (applied) =>
  useQuery({
    queryKey: trialBalanceKeys.report(applied),
    queryFn: () => {
      const qs = new URLSearchParams({
        fromDate: applied.fromDate,
        toDate: applied.toDate,
      });
      return fetchJSON(`${BASE}/api/trial-balance?${qs.toString()}`);
    },
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });