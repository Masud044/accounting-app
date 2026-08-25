import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const notificationKeys = {
  all:    ["notifications"],
  lists:  (userId) => [...notificationKeys.all, "lists", userId],
  unread: (userId) => [...notificationKeys.all, "unread-count", userId],
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

// List — latest first, polling every 20s for near-real-time bell updates
export const useNotifications = (userId, limit = 20) =>
  useQuery({
    queryKey: notificationKeys.lists(userId),
    queryFn:  () => fetchJSON(`${BASE}/api/notifications?userId=${userId}&limit=${limit}`),
    enabled:  !!userId,
    staleTime: 0,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

// Unread count — for the badge on the bell icon
export const useUnreadCount = (userId) =>
  useQuery({
    queryKey: notificationKeys.unread(userId),
    queryFn:  () => fetchJSON(`${BASE}/api/notifications/unread-count?userId=${userId}`),
    enabled:  !!userId,
    staleTime: 0,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
    throwOnError: false,
    select: (data) => data?.count ?? 0,
  });

export const useMarkNotificationRead = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) =>
      fetchJSON(`${BASE}/api/notifications/${notificationId}/read`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.lists(userId) });
      qc.invalidateQueries({ queryKey: notificationKeys.unread(userId) });
    },
    onError: (err) => console.error("Mark notification read failed:", err),
  });
};

export const useMarkAllNotificationsRead = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fetchJSON(`${BASE}/api/notifications/read-all`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.lists(userId) });
      qc.invalidateQueries({ queryKey: notificationKeys.unread(userId) });
    },
    onError: (err) => console.error("Mark all notifications read failed:", err),
  });
};

export const useDeleteNotification = (userId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) =>
      fetchJSON(`${BASE}/api/notifications/${notificationId}`, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.lists(userId) });
      qc.invalidateQueries({ queryKey: notificationKeys.unread(userId) });
    },
    onError: (err) => console.error("Delete notification failed:", err),
  });
};