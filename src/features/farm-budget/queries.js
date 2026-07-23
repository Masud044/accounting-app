import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const farmBudgetKeys = {
  all:    ["farmBudget"],
  lists:  () => [...farmBudgetKeys.all, "list"],
  detail: (id) => [...farmBudgetKeys.all, "detail", id],
  counts: (id) => [...farmBudgetKeys.all, "counts", id],
};

export const farmBudgetDetailKeys = {
  all:  ["farmBudgetDetails"],
  list: (budgetId) => [...farmBudgetDetailKeys.all, "list", budgetId],
};

export const farmTypeKeys = { all: ["farmTypes"] };

export const expenseAccountKeys = { all: ["expenseAccounts"] };

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

// ═══════════════════ FARM BUDGET (Header) ═══════════════════
export const useFarmBudgets = () =>
  useQuery({
    queryKey: farmBudgetKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-budget`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useFarmBudgetById = (id) =>
  useQuery({
    queryKey: farmBudgetKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-budget/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateFarmBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-budget`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmBudgetKeys.all }),
    onError: (err) => console.error("Create farm budget failed:", err),
  });
};

export const useUpdateFarmBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-budget/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmBudgetKeys.all }),
    onError: (err) => console.error("Update farm budget failed:", err),
  });
};

export const useDeleteFarmBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/farm-budget/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmBudgetKeys.all }),
    onError: (err) => console.error("Delete farm budget failed:", err),
  });
};

// ═══════════════════ COUNTS (for tab badges) ═══════════════════
export const useFarmBudgetCounts = (id) =>
  useQuery({
    queryKey: farmBudgetKeys.counts(id),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-budget/${id}/counts`),
    enabled:  !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// ═══════════════════ FARM BUDGET DETAILS (Expense Lines) ═══════════════════
export const useFarmBudgetDetails = (budgetId) =>
  useQuery({
    queryKey: farmBudgetDetailKeys.list(budgetId),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-budget/details?budgetId=${budgetId}`),
    enabled:  !!budgetId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateDetailScope = (qc, budgetId) => {
  qc.invalidateQueries({ queryKey: farmBudgetDetailKeys.list(budgetId) });
  qc.invalidateQueries({ queryKey: farmBudgetKeys.counts(budgetId) });
  qc.invalidateQueries({ queryKey: farmBudgetKeys.all });
};

export const useCreateFarmBudgetDetail = (budgetId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-budget/details`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateDetailScope(qc, budgetId),
    onError: (err) => console.error("Create farm budget detail failed:", err),
  });
};

export const useUpdateFarmBudgetDetail = (budgetId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-budget/details/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateDetailScope(qc, budgetId),
    onError: (err) => console.error("Update farm budget detail failed:", err),
  });
};

export const useDeleteFarmBudgetDetail = (budgetId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/farm-budget/details/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateDetailScope(qc, budgetId),
    onError: (err) => console.error("Delete farm budget detail failed:", err),
  });
};

// ═══════════════════ FARM TYPES (master list) ═══════════════════
export const useFarmTypes = () =>
  useQuery({
    queryKey: farmTypeKeys.all,
    queryFn:  () => fetchJSON(`${BASE}/api/farm-type`),
    staleTime: 10 * 60 * 1000,
    gcTime:    30 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// ═══════════════════ EXPENSE ACCOUNTS (COA leaf nodes under Expense) ═══════════════════
export const useExpenseAccounts = () =>
  useQuery({
    queryKey: expenseAccountKeys.all,
    queryFn:  () => fetchJSON(`${BASE}/api/farm-budget/expense-accounts`),
    staleTime: 10 * 60 * 1000,
    gcTime:    30 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });