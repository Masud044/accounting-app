import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const chickenProjectKeys = {
  all:        ["chickenProject"],
  lists:      () => [...chickenProjectKeys.all, "list"],
  detail:     (id) => [...chickenProjectKeys.all, "detail", id],
  counts:     (id) => [...chickenProjectKeys.all, "counts", id],
};

export const chickenProjectDetailKeys = {
  all:  ["chickenProjectDetails"],
  list: (hId) => [...chickenProjectDetailKeys.all, "list", hId],
};

export const chickenProjectVaccinationKeys = {
  all:  ["chickenProjectVaccination"],
  list: (hid) => [...chickenProjectVaccinationKeys.all, "list", hid],
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

// ═══════════════════ CHICKEN PROJECT (Header) ═══════════════════
export const useChickenProjects = () =>
  useQuery({
    queryKey: chickenProjectKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useChickenProjectById = (id) =>
  useQuery({
    queryKey: chickenProjectKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateChickenProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/chicken-project`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenProjectKeys.all }),
    onError: (err) => console.error("Create chicken project failed:", err),
  });
};

export const useUpdateChickenProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/chicken-project/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenProjectKeys.all }),
    onError: (err) => console.error("Update chicken project failed:", err),
  });
};

export const useDeleteChickenProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/chicken-project/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: chickenProjectKeys.all }),
    onError: (err) => console.error("Delete chicken project failed:", err),
  });
};

// ═══════════════════ COUNTS (for tab badges) ═══════════════════
export const useChickenProjectCounts = (id) =>
  useQuery({
    queryKey: chickenProjectKeys.counts(id),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project/${id}/counts`),
    enabled:  !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// ═══════════════════ CHICKEN PROJECT DETAILS ═══════════════════
export const useChickenProjectDetails = (hId) =>
  useQuery({
    queryKey: chickenProjectDetailKeys.list(hId),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project/details?hId=${hId}`),
    enabled:  !!hId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateDetailScope = (qc, hId) => {
  qc.invalidateQueries({ queryKey: chickenProjectDetailKeys.list(hId) });
  qc.invalidateQueries({ queryKey: chickenProjectKeys.counts(hId) });
};

export const useCreateChickenProjectDetail = (hId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/chicken-project/details`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateDetailScope(qc, hId),
    onError: (err) => console.error("Create chicken project detail failed:", err),
  });
};

export const useUpdateChickenProjectDetail = (hId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/chicken-project/details/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateDetailScope(qc, hId),
    onError: (err) => console.error("Update chicken project detail failed:", err),
  });
};

export const useDeleteChickenProjectDetail = (hId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/chicken-project/details/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateDetailScope(qc, hId),
    onError: (err) => console.error("Delete chicken project detail failed:", err),
  });
};

// ═══════════════════ CHICKEN PROJECT VACCINATION ═══════════════════
export const useChickenProjectVaccination = (hid) =>
  useQuery({
    queryKey: chickenProjectVaccinationKeys.list(hid),
    queryFn:  () => fetchJSON(`${BASE}/api/chicken-project/vaccination?hid=${hid}`),
    enabled:  !!hid,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

const invalidateVaccinationScope = (qc, hid) => {
  qc.invalidateQueries({ queryKey: chickenProjectVaccinationKeys.list(hid) });
  qc.invalidateQueries({ queryKey: chickenProjectKeys.counts(hid) });
};

export const useCreateVaccination = (hid) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/chicken-project/vaccination`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateVaccinationScope(qc, hid),
    onError: (err) => console.error("Create vaccination failed:", err),
  });
};

export const useUpdateVaccination = (hid) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/chicken-project/vaccination/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => invalidateVaccinationScope(qc, hid),
    onError: (err) => console.error("Update vaccination failed:", err),
  });
};

export const useDeleteVaccination = (hid) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/chicken-project/vaccination/${id}`, { method: "DELETE" }),
    onSuccess: () => invalidateVaccinationScope(qc, hid),
    onError: (err) => console.error("Delete vaccination failed:", err),
  });
};