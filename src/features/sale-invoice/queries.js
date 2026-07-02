import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

// ── Query Keys ────────────────────────────────────────────────────────────────
export const invoiceKeys = {
  all:    ["salInvoice"],
  lists:  () => [...invoiceKeys.all, "list"],
  detail: (hid) => [...invoiceKeys.all, "detail", hid],
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
export const useInvoices = () =>
  useQuery({
    queryKey: invoiceKeys.lists(),
    queryFn:  () => fetchJSON(`${BASE}/api/sal-invoice`),
    staleTime: 5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useInvoiceById = (hid) =>
  useQuery({
    queryKey: invoiceKeys.detail(hid),
    queryFn:  () => fetchJSON(`${BASE}/api/sal-invoice/${hid}`),
    enabled:  !!hid,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/sal-invoice`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoiceKeys.lists() }),
    onError: (err) => console.error("Create invoice failed:", err),
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hid) =>
      fetchJSON(`${BASE}/api/sal-invoice/${hid}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: invoiceKeys.lists() }),
    onError: (err) => console.error("Delete invoice failed:", err),
  });
};

export const useUpdateInvoice = (hid) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/sal-invoice/${hid}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invoiceKeys.lists() });
      qc.invalidateQueries({ queryKey: invoiceKeys.detail(hid) });
    },
    onError: (err) => console.error("Update invoice failed:", err),
  });
};