import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Cash Flow ──────────────────────────────────────────────────────────────
export const cashFlowKeys = {
  all:      ["cashFlow"],
  summary:  (params) => [...cashFlowKeys.all, "summary", params],
  statement:(params) => [...cashFlowKeys.all, "statement", params],
  details:  (params) => [...cashFlowKeys.all, "details", params],
};

// ── Fetcher ───────────────────────────────────────────────────────────────
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

const buildQS = (applied) =>
  new URLSearchParams({
    fromDate: applied.fromDate,
    toDate: applied.toDate,
  }).toString();

// ── Hooks ─────────────────────────────────────────────────────────────────
export const useCashFlowSummary = (applied) =>
  useQuery({
    queryKey: cashFlowKeys.summary(applied),
    queryFn: () => fetchJSON(`${BASE}/api/cash-flow/summary?${buildQS(applied)}`),
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useCashFlowStatement = (applied) =>
  useQuery({
    queryKey: cashFlowKeys.statement(applied),
    queryFn: () => fetchJSON(`${BASE}/api/cash-flow/statement?${buildQS(applied)}`),
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useCashFlowDetails = (applied) =>
  useQuery({
    queryKey: cashFlowKeys.details(applied),
    queryFn: () => fetchJSON(`${BASE}/api/cash-flow/details?${buildQS(applied)}`),
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });