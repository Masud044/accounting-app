import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const meetingKeys = {
  all:    ["meeting"],
  lists:  () => [...meetingKeys.all, "list"],
  detail: (id) => [...meetingKeys.all, "detail", id],
};

export const lookupKeys = {
  departments: ["meeting", "lookups", "departments"],
  employees:   ["meeting", "lookups", "employees"],
  rooms:       ["meeting", "lookups", "rooms"],
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

// ── Meeting hooks ─────────────────────────────────────────────────────────────
export const useMeetings = () =>
  useQuery({
    queryKey: meetingKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useMeetingById = (id) =>
  useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateMeeting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/agenda-management`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
    onError: (err) => console.error("Create meeting failed:", err),
  });
};

export const useUpdateMeeting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/agenda-management/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
    onError: (err) => console.error("Update meeting failed:", err),
  });
};

export const useDeleteMeeting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/agenda-management/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
    onError: (err) => console.error("Delete meeting failed:", err),
  });
};

// ── Lookup hooks (form dropdowns) ────────────────────────────────────────────
export const useDepartments = () =>
  useQuery({
    queryKey: lookupKeys.departments,
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/departments`),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useEmployees = () =>
  useQuery({
    queryKey: lookupKeys.employees,
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/employees`),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useMeetingRooms = () =>
  useQuery({
    queryKey: lookupKeys.rooms,
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/rooms`),
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });