import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const farmCalendarKeys = {
  all:    ["farmCalendar"],
  lists:  () => [...farmCalendarKeys.all, "list"],
  detail: (id) => [...farmCalendarKeys.all, "detail", id],
  counts: (id) => [...farmCalendarKeys.all, "counts", id],
};

export const farmCalendarDetailKeys = {
  all:  ["farmCalendarDetails"],
  list: (calendarId) => [...farmCalendarDetailKeys.all, "list", calendarId],
};

export const farmKpiTargetKeys = {
  all:  ["farmKpiTargets"],
  list: (calendarId) => [...farmKpiTargetKeys.all, "list", calendarId],
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

// ═══════════════════ FARM CALENDAR (Header) ═══════════════════
export const useFarmCalendars = () =>
  useQuery({
    queryKey: farmCalendarKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-calendar`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useFarmCalendarById = (id) =>
  useQuery({
    queryKey: farmCalendarKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-calendar/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateFarmCalendar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-calendar`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmCalendarKeys.all }),
    onError: (err) => console.error("Create farm calendar failed:", err),
  });
};

export const useUpdateFarmCalendar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-calendar/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmCalendarKeys.all }),
    onError: (err) => console.error("Update farm calendar failed:", err),
  });
};

export const useDeleteFarmCalendar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/farm-calendar/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmCalendarKeys.all }),
    onError: (err) => console.error("Delete farm calendar failed:", err),
  });
};

// ═══════════════════ COUNTS (for tab badges) ═══════════════════
export const useFarmCalendarCounts = (id) =>
  useQuery({
    queryKey: farmCalendarKeys.counts(id),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-calendar/${id}/counts`),
    enabled:  !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// ═══════════════════ FARM CALENDAR DETAILS (Activities) ═══════════════════
export const useFarmCalendarDetails = (calendarId) =>
  useQuery({
    queryKey: farmCalendarDetailKeys.list(calendarId),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-calendar/details?calendarId=${calendarId}`),
    enabled:  !!calendarId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateDetailScope = (qc, calendarId) => {
  qc.invalidateQueries({ queryKey: farmCalendarDetailKeys.list(calendarId) });
  qc.invalidateQueries({ queryKey: farmCalendarKeys.counts(calendarId) });
};

export const useCreateFarmCalendarDetail = (calendarId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-calendar/details`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateDetailScope(qc, calendarId),
    onError: (err) => console.error("Create activity detail failed:", err),
  });
};

export const useUpdateFarmCalendarDetail = (calendarId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-calendar/details/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateDetailScope(qc, calendarId),
    onError: (err) => console.error("Update activity detail failed:", err),
  });
};

export const useDeleteFarmCalendarDetail = (calendarId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/farm-calendar/details/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateDetailScope(qc, calendarId),
    onError: (err) => console.error("Delete activity detail failed:", err),
  });
};

// ═══════════════════ FARM KPI TARGETS ═══════════════════
export const useFarmKpiTargets = (calendarId) =>
  useQuery({
    queryKey: farmKpiTargetKeys.list(calendarId),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-calendar/kpi-targets?calendarId=${calendarId}`),
    enabled:  !!calendarId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateKpiScope = (qc, calendarId) => {
  qc.invalidateQueries({ queryKey: farmKpiTargetKeys.list(calendarId) });
  qc.invalidateQueries({ queryKey: farmCalendarKeys.counts(calendarId) });
};

export const useCreateKpiTarget = (calendarId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-calendar/kpi-targets`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateKpiScope(qc, calendarId),
    onError: (err) => console.error("Create KPI target failed:", err),
  });
};

export const useUpdateKpiTarget = (calendarId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-calendar/kpi-targets/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateKpiScope(qc, calendarId),
    onError: (err) => console.error("Update KPI target failed:", err),
  });
};

export const useDeleteKpiTarget = (calendarId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/farm-calendar/kpi-targets/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateKpiScope(qc, calendarId),
    onError: (err) => console.error("Delete KPI target failed:", err),
  });
};