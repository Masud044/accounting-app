import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const fiscalYearKeys = {
  all:    ["fiscalYear"],
  lists:  () => [...fiscalYearKeys.all, "list"],
  detail: (id) => [...fiscalYearKeys.all, "detail", id],
};

export const periodTypeKeys = {
  all: ["periodType"],
};

export const ledgerModuleKeys = {
  all: ["ledgerModule"],
};

export const ledgerPeriodKeys = {
  all:      ["ledgerPeriod"],
  byFy:     (fiscalYearId) => [...ledgerPeriodKeys.all, "byFy", fiscalYearId],
  calendar: (fiscalYearId) => [...ledgerPeriodKeys.all, "calendar", fiscalYearId],
};

export const periodModuleStatusKeys = {
  all:     ["periodModuleStatus"],
  summary: (periodId) => [...periodModuleStatusKeys.all, "summary", periodId],
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

/* ════════════════════════════════════════════════════════════════════════
   FISCAL_YEAR
   ════════════════════════════════════════════════════════════════════════ */

export const useFiscalYears = () =>
  useQuery({
    queryKey: fiscalYearKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/fiscal-years`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useFiscalYearById = (id) =>
  useQuery({
    queryKey: fiscalYearKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/fiscal-years/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateFiscalYear = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/fiscal-years`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: fiscalYearKeys.all }),
    onError: (err) => console.error("Create fiscal year failed:", err),
  });
};

export const useUpdateFiscalYearStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/fiscal-years/${id}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: fiscalYearKeys.all }),
    onError: (err) => console.error("Update fiscal year status failed:", err),
  });
};

/* ════════════════════════════════════════════════════════════════════════
   PERIOD_TYPE / MODULE  (reference / lookup)
   ════════════════════════════════════════════════════════════════════════ */

export const usePeriodTypes = () =>
  useQuery({
    queryKey: periodTypeKeys.all,
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/period-types`),
    staleTime: 30 * 60 * 1000,
    gcTime:    60 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useLedgerModules = () =>
  useQuery({
    queryKey: ledgerModuleKeys.all,
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/modules`),
    staleTime: 30 * 60 * 1000,
    gcTime:    60 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

/* ════════════════════════════════════════════════════════════════════════
   LEDGER_PERIOD
   ════════════════════════════════════════════════════════════════════════ */

export const useLedgerPeriodsByFiscalYear = (fiscalYearId) =>
  useQuery({
    queryKey: ledgerPeriodKeys.byFy(fiscalYearId),
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/ledger-periods/${fiscalYearId}`),
    enabled:  !!fiscalYearId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useLedgerPeriodCalendar = (fiscalYearId) =>
  useQuery({
    queryKey: ledgerPeriodKeys.calendar(fiscalYearId),
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/ledger-periods/calendar/${fiscalYearId}`),
    enabled:  !!fiscalYearId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useCreateLedgerPeriod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/ledger-periods`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: ledgerPeriodKeys.calendar(variables.fiscalYearId) }),
      
    
    onError: (err) => console.error("Create ledger period failed:", err),
  });
};

/* ════════════════════════════════════════════════════════════════════════
   PERIOD_MODULE_STATUS
   ════════════════════════════════════════════════════════════════════════ */

export const usePeriodStatusSummary = (periodId) =>
  useQuery({
    queryKey: periodModuleStatusKeys.summary(periodId),
    queryFn:  () => fetchJSON(`${BASE}/api/ledger-period-calendar/period-status-summary/${periodId}`),
    enabled:  !!periodId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// Optimistic toggle — flips one module's OPEN/CLOSED status inside the
// cached calendar list, rolls back on error, revalidates on settle.
export const useToggleModuleStatus = (fiscalYearId) => {
  const qc = useQueryClient();
  const key = ledgerPeriodKeys.calendar(fiscalYearId);

  return useMutation({
    mutationFn: ({ periodId, moduleId, status }) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/period-module-status/${periodId}/${moduleId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      }),

    onMutate: async ({ periodId, moduleCode, status }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData(key);

      qc.setQueryData(key, (old) =>
        old?.map((period) => {
          if (period.periodId !== periodId) return period;
          const modules = { ...period.modules, [moduleCode]: status.toLowerCase() };
          const values = Object.values(modules);
          const overallStatus = values.every((v) => v === "open")
            ? "open"
            : values.every((v) => v === "closed")
              ? "closed"
              : "mixed";
          return { ...period, modules, overallStatus };
        })
      );

      return { previous };
    },

    onError: (err, _vars, context) => {
      console.error("Toggle module status failed:", err);
      if (context?.previous) qc.setQueryData(key, context.previous);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
};


export const useUpdateLedgerPeriod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fiscalYearId, ...data }) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/ledger-periods/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ledgerPeriodKeys.calendar(variables.fiscalYearId) });
      qc.invalidateQueries({ queryKey: ledgerPeriodKeys.byFy(variables.fiscalYearId) });
    },
    onError: (err) => console.error("Update ledger period failed:", err),
  });
};

export const useCreatePeriodType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/period-types`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: periodTypeKeys.all }),
    onError: (err) => console.error("Create period type failed:", err),
  });
};

export const useUpdatePeriodType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetchJSON(`${BASE}/api/ledger-period-calendar/period-types/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: periodTypeKeys.all }),
    onError: (err) => console.error("Update period type failed:", err),
  });
};