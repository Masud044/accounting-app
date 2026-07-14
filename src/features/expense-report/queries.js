import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Expense Statement ───────────────────────────────────────────────────
export const expenseStatementKeys = {
  all: ["expenseStatement"],
  statement: (params) => [...expenseStatementKeys.all, "statement", params],
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

const buildQS = (applied) =>
  new URLSearchParams({
    fromDate: applied.fromDate,
    toDate: applied.toDate,
  }).toString();

export const useExpenseStatement = (applied) =>
  useQuery({
    queryKey: expenseStatementKeys.statement(applied),
    queryFn: () =>
      fetchJSON(`${BASE}/api/expense-statement?${buildQS(applied)}`),
    enabled: !!applied,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });