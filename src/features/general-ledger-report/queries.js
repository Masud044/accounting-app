import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── General Ledger ────────────────────────────────────────────────────────────
export const generalLedgerKeys = {
  all:    ["generalLedger"],
  report: (params) => [...generalLedgerKeys.all, "report", params],
};

// ── Chart of Accounts ─────────────────────────────────────────────────────────
export const chartKeys = {
  all:   ["chartOfAccounts"],
  lists: () => [...chartKeys.all, "list"],
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
export const useGeneralLedger = (applied) =>
  useQuery({
    queryKey: generalLedgerKeys.report(applied),
    queryFn: () => {
      const qs = new URLSearchParams({
        fromDate: applied.fromDate,
        toDate: applied.toDate,
        ...(applied.accountCode ? { accountCode: applied.accountCode } : {}),
      });
      return fetchJSON(`${BASE}/api/general-ledger?${qs.toString()}`);
    },
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useChartOfAccounts = () =>
  useQuery({
    queryKey: chartKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/chart-account`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30_000),
    throwOnError: false,
  });