import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const roomKeys = {
  all:    ["meetingRoom"],
  lists:  () => [...roomKeys.all, "list"],
  detail: (id) => [...roomKeys.all, "detail", id],
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
export const useMeetingRooms = (includeInactive = true) =>
  useQuery({
    queryKey: [...roomKeys.lists(), { includeInactive }],
    queryFn:  () => fetchJSON(`${BASE}/api/rooms?includeInactive=${includeInactive}`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useMeetingRoomById = (id) =>
  useQuery({
    queryKey: roomKeys.detail(id),
    queryFn:  () => fetchJSON(`${BASE}/api/rooms/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateMeetingRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/rooms`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
    onError: (err) => console.error("Create meeting room failed:", err),
  });
};

export const useUpdateMeetingRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/rooms/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
    onError: (err) => console.error("Update meeting room failed:", err),
  });
};

export const useDeactivateMeetingRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/rooms/${id}/deactivate`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
    onError: (err) => console.error("Deactivate meeting room failed:", err),
  });
};

export const useReactivateMeetingRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetchJSON(`${BASE}/api/rooms/${id}/reactivate`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
    onError: (err) => console.error("Reactivate meeting room failed:", err),
  });
};