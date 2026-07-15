import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const cowProjectKeys = {
  all:    ["cowProject"],
  lists:  () => [...cowProjectKeys.all, "list"],
  detail: (id) => [...cowProjectKeys.all, "detail", id],
};

export const cowMedicineKeys = {
  all:    ["cowMedicine"],
  byCow:  (cowNo) => [...cowMedicineKeys.all, "byCow", cowNo],
};

export const cowWeightKeys = {
  all:    ["cowWeight"],
  byCow:  (cowNo) => [...cowWeightKeys.all, "byCow", cowNo],
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
   COW_PROJECT
   ════════════════════════════════════════════════════════════════════════ */

export const useCowProjects = () =>
  useQuery({
    queryKey: cowProjectKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/cow-project`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useCowProjectById = (id) =>
  useQuery({
    queryKey: cowProjectKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/cow-project/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateCowProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/cow-project`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowProjectKeys.all }),
    onError: (err) => console.error("Create cow project failed:", err),
  });
};

export const useUpdateCowProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/cow-project/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowProjectKeys.all }),
    onError: (err) => console.error("Update cow project failed:", err),
  });
};

export const useDeleteCowProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/cow-project/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowProjectKeys.all }),
    onError: (err) => console.error("Delete cow project failed:", err),
  });
};

/* ════════════════════════════════════════════════════════════════════════
   COW_PROJECT_MEDICIN
   ════════════════════════════════════════════════════════════════════════ */

export const useCowMedicineByCow = (cowNo) =>
  useQuery({
    queryKey: cowMedicineKeys.byCow(cowNo),
    queryFn:  () => fetchJSON(`${BASE}/api/cow-project/medicine/cow/${cowNo}`),
    enabled:  !!cowNo,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateCowMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/cow-project/medicine`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: cowMedicineKeys.byCow(variables.cowNo) }),
    onError: (err) => console.error("Create vaccine record failed:", err),
  });
};

export const useUpdateCowMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/cow-project/medicine/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: cowMedicineKeys.byCow(variables.data.cowNo) }),
    onError: (err) => console.error("Update vaccine record failed:", err),
  });
};

export const useDeleteCowMedicine = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/cow-project/medicine/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowMedicineKeys.all }),
    onError: (err) => console.error("Delete vaccine record failed:", err),
  });
};

/* ════════════════════════════════════════════════════════════════════════
   COW_PROJECT_WEIGHT
   ════════════════════════════════════════════════════════════════════════ */

export const useCowWeightByCow = (cowNo) =>
  useQuery({
    queryKey: cowWeightKeys.byCow(cowNo),
    queryFn:  () => fetchJSON(`${BASE}/api/cow-project/weight/cow/${cowNo}`),
    enabled:  !!cowNo,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateCowWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/cow-project/weight`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: cowWeightKeys.byCow(variables.cowNo) }),
    onError: (err) => console.error("Create weight record failed:", err),
  });
};

export const useUpdateCowWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/cow-project/weight/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: cowWeightKeys.byCow(variables.data.cowNo) }),
    onError: (err) => console.error("Update weight record failed:", err),
  });
};

export const useDeleteCowWeight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/cow-project/weight/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: cowWeightKeys.all }),
    onError: (err) => console.error("Delete weight record failed:", err),
  });
};