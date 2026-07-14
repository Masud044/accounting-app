import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Income Statement ────────────────────────────────────────────────────
export const incomeStatementKeys = {
  all: ["incomeStatement"],
  statement: (params) => [...incomeStatementKeys.all, "statement", params],
};

// ── Fetcher ──────────────────────────────────────────────────────────────
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

// ── Hooks ────────────────────────────────────────────────────────────────
// NOTE: adjust base path ("/api/financial-statement") to match how you
// mount the income/expense router in app.js
export const useIncomeStatement = (applied) =>
  useQuery({
    queryKey: incomeStatementKeys.statement(applied),
    queryFn: () =>
      fetchJSON(`${BASE}/api/income-statement?${buildQS(applied)}`),
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });