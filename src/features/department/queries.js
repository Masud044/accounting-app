import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const departmentKeys = {
  all:    ["department"],
  lists:  () => [...departmentKeys.all, "list"],
  detail: (id) => [...departmentKeys.all, "detail", id],
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
export const useDepartments = () =>
  useQuery({
    queryKey: departmentKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/departments`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useDepartmentById = (id) =>
  useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/departments/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/departments`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: departmentKeys.all }),
    onError: (err) => console.error("Create department failed:", err),
  });
};

export const useUpdateDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/departments/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: departmentKeys.all }),
    onError: (err) => console.error("Update department failed:", err),
  });
};

export const useDeleteDepartment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/departments/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: departmentKeys.all }),
    onError: (err) => console.error("Delete department failed:", err),
  });
};