import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const employeeKeys = {
  all:    ["employee"],
  lists:  () => [...employeeKeys.all, "list"],
  detail: (id) => [...employeeKeys.all, "detail", id],
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
// includeInactive: the Setup list page shows everyone (active + deactivated);
// dropdowns elsewhere (meeting organizer/participants) call without it, so
// deactivated staff stay hidden there.
export const useEmployees = (includeInactive = true) =>
  useQuery({
    queryKey: [...employeeKeys.lists(), { includeInactive }],
    queryFn:  () => fetchJSON(`${BASE}/api/employees?includeInactive=${includeInactive}`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useEmployeeById = (id) =>
  useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/employees/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/employees`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
    onError: (err) => console.error("Create employee failed:", err),
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/employees/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
    onError: (err) => console.error("Update employee failed:", err),
  });
};

export const useDeactivateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/employees/${id}/deactivate`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
    onError: (err) => console.error("Deactivate employee failed:", err),
  });
};

export const useReactivateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/employees/${id}/reactivate`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: employeeKeys.all }),
    onError: (err) => console.error("Reactivate employee failed:", err),
  });
};

// ── Departments lookup (for the department select in the employee form) ────
export const useDepartmentsLookup = () =>
  useQuery({
    queryKey: ["employee", "lookups", "departments"],
    queryFn:  () => fetchJSON(`${BASE}/api/departments`),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });