import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

export const activityLogKeys = {
  all:        ["activityLog"],
  lists:      () => [...activityLogKeys.all, "list"],
  byDetail:   (detailId) => [...activityLogKeys.all, "detail", detailId],
  single:     (id) => [...activityLogKeys.all, "single", id],
};

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

// ── LIST (all, no filter) ───────────────────────────────────────────────────
export const useActivityLogs = () =>
  useQuery({
    queryKey: activityLogKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-activity-log`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

// ── LIST BY DETAIL_ID ───────────────────────────────────────────────────────
export const useActivityLogsByDetailId = (detailId) =>
  useQuery({
    queryKey: activityLogKeys.byDetail(detailId),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-activity-log/detail/${detailId}`),
    enabled:  !!detailId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// ── SINGLE ───────────────────────────────────────────────────────────────────
export const useActivityLogById = (id) =>
  useQuery({
    queryKey: activityLogKeys.single(id),
    queryFn:  () => fetchJSON(`${BASE}/api/farm-activity-log/${id}`),
    enabled:  !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// ── CREATE ───────────────────────────────────────────────────────────────────
export const useCreateActivityLog = (detailId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/farm-activity-log`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activityLogKeys.byDetail(detailId) });
      qc.invalidateQueries({ queryKey: activityLogKeys.lists() });
    },
    onError: (err) => console.error("Create activity log failed:", err),
  });
};

// ── UPDATE ───────────────────────────────────────────────────────────────────
export const useUpdateActivityLog = (detailId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      fetchJSON(`${BASE}/api/farm-activity-log/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activityLogKeys.byDetail(detailId) });
      qc.invalidateQueries({ queryKey: activityLogKeys.lists() });
    },
    onError: (err) => console.error("Update activity log failed:", err),
  });
};

// ── DELETE ───────────────────────────────────────────────────────────────────
export const useDeleteActivityLog = (detailId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => fetchJSON(`${BASE}/api/farm-activity-log/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activityLogKeys.byDetail(detailId) });
      qc.invalidateQueries({ queryKey: activityLogKeys.lists() });
    },
    onError: (err) => console.error("Delete activity log failed:", err),
  });
};