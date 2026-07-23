import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/farm-project`;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const farmProjectKeys = {
  all:    ["farmProject"],
  lists:  () => [...farmProjectKeys.all, "list"],
  detail: (id) => [...farmProjectKeys.all, "detail", id],
};

export const farmProjectPhaseKeys = {
  all:  ["farmProjectPhase"],
  list: (projectId) => [...farmProjectPhaseKeys.all, "list", projectId],
};

export const farmProjectActivityKeys = {
  all:  ["farmProjectActivity"],
  list: (projectId) => [...farmProjectActivityKeys.all, "list", projectId],
};

export const financialProjectionKeys = {
  all:  ["financialProjection"],
  list: (projectId) => [...financialProjectionKeys.all, "list", projectId],
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

// ═══════════════════ PROJECT (Header) ═══════════════════
export const useFarmProjects = () =>
  useQuery({
    queryKey: farmProjectKeys.lists(),
    queryFn:  () => fetchJSON(`${API}`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useFarmProjectById = (id) =>
  useQuery({
    queryKey: farmProjectKeys.detail(id),
    queryFn:  () => fetchJSON(`${API}/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateFarmProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${API}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmProjectKeys.all }),
    onError: (err) => console.error("Create farm project failed:", err),
  });
};

export const useUpdateFarmProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${API}/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmProjectKeys.all }),
    onError: (err) => console.error("Update farm project failed:", err),
  });
};

export const useDeleteFarmProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: farmProjectKeys.all }),
    onError: (err) => console.error("Delete farm project failed:", err),
  });
};

// ═══════════════════ PHASE ═══════════════════
export const useFarmProjectPhases = (projectId) =>
  useQuery({
    queryKey: farmProjectPhaseKeys.list(projectId),
    queryFn:  () => fetchJSON(`${API}/phases?projectId=${projectId}`),
    enabled:  !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidatePhaseScope = (qc, projectId) => {
  qc.invalidateQueries({ queryKey: farmProjectPhaseKeys.list(projectId) });
  qc.invalidateQueries({ queryKey: farmProjectActivityKeys.list(projectId) });
};

export const useCreateFarmProjectPhase = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${API}/phases`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidatePhaseScope(qc, projectId),
    onError: (err) => console.error("Create phase failed:", err),
  });
};

export const useUpdateFarmProjectPhase = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${API}/phases/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidatePhaseScope(qc, projectId),
    onError: (err) => console.error("Update phase failed:", err),
  });
};

export const useDeleteFarmProjectPhase = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/phases/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidatePhaseScope(qc, projectId),
    onError: (err) => console.error("Delete phase failed:", err),
  });
};

// ═══════════════════ ACTIVITY ═══════════════════
export const useFarmProjectActivities = (projectId) =>
  useQuery({
    queryKey: farmProjectActivityKeys.list(projectId),
    queryFn:  () => fetchJSON(`${API}/activities?projectId=${projectId}`),
    enabled:  !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateActivityScope = (qc, projectId) => {
  qc.invalidateQueries({ queryKey: farmProjectActivityKeys.list(projectId) });
};

export const useCreateFarmProjectActivity = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${API}/activities`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateActivityScope(qc, projectId),
    onError: (err) => console.error("Create activity failed:", err),
  });
};

export const useUpdateFarmProjectActivity = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${API}/activities/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateActivityScope(qc, projectId),
    onError: (err) => console.error("Update activity failed:", err),
  });
};

export const useDeleteFarmProjectActivity = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/activities/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateActivityScope(qc, projectId),
    onError: (err) => console.error("Delete activity failed:", err),
  });
};

// ═══════════════════ FINANCIAL PROJECTIONS ═══════════════════
export const useFinancialProjections = (projectId) =>
  useQuery({
    queryKey: financialProjectionKeys.list(projectId),
    queryFn:  () => fetchJSON(`${API}/financial-projections?projectId=${projectId}`),
    enabled:  !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateProjectionScope = (qc, projectId) => {
  qc.invalidateQueries({ queryKey: financialProjectionKeys.list(projectId) });
};

export const useCreateFinancialProjection = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${API}/financial-projections`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateProjectionScope(qc, projectId),
    onError: (err) => console.error("Create financial projection failed:", err),
  });
};

export const useUpdateFinancialProjection = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${API}/financial-projections/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateProjectionScope(qc, projectId),
    onError: (err) => console.error("Update financial projection failed:", err),
  });
};

export const useDeleteFinancialProjection = (projectId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${API}/financial-projections/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateProjectionScope(qc, projectId),
    onError: (err) => console.error("Delete financial projection failed:", err),
  });
};