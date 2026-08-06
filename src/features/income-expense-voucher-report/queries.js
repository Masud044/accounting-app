import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── GL Report (Income & Expense) ────────────────────────────────────────
export const glReportKeys = {
  all: ["glReport"],
  expense: (params) => [...glReportKeys.all, "expense", params],
  income: (params) => [...glReportKeys.all, "income", params],
};

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

// fromDate/toDate না থাকলে query string এ যোগ হবে না → backend সব data দিবে
const buildQS = (applied) => {
  const params = new URLSearchParams();
  if (applied?.fromDate) params.set("fromDate", applied.fromDate);
  if (applied?.toDate) params.set("toDate", applied.toDate);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const useExpenseReport = (applied, enabled = true) =>
  useQuery({
    queryKey: glReportKeys.expense(applied),
    queryFn: () => fetchJSON(`${BASE}/api/gl-report-voucher/expense${buildQS(applied)}`),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useIncomeReport = (applied, enabled = true) =>
  useQuery({
    queryKey: glReportKeys.income(applied),
    queryFn: () => fetchJSON(`${BASE}/api/gl-report-voucher/income${buildQS(applied)}`),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });