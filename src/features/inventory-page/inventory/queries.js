// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const BASE = import.meta.env.VITE_API_BASE_URL;

// export const inventoryKeys = {
//   all:    ["inventories"],
//   lists:  () => [...inventoryKeys.all, "lists"],
//   detail: (hid) => [...inventoryKeys.all, "detail", hid],
// };

// const fetchJSON = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// export const useInventories = ({ page = 1, limit = 50 } = {}) =>
//   useQuery({
//     queryKey: [...inventoryKeys.lists(), page, limit],
//     queryFn:  () => fetchJSON(`${BASE}/api/inventory?page=${page}&limit=${limit}`),
//     staleTime: 30 * 1000,
//     gcTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//     retry: 2,
//     retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
//     throwOnError: false,
//   });

// export const useInventoryById = (hid) =>
//   useQuery({
//     queryKey: inventoryKeys.detail(hid),
//     queryFn:  () => fetchJSON(`${BASE}/api/inventory/${hid}`),
//     enabled:  !!hid,
//     staleTime: 10 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// export const useNextGrnNo = (enabled = true) =>
//   useQuery({
//     queryKey: ["inventory", "next-grn-no"],
//     queryFn:  () => fetchJSON(`${BASE}/api/inventory/next-grn-no`),
//     staleTime: 0,
//     refetchOnWindowFocus: false,
//     enabled,
//   });

//   export const useNextPoNo = (enabled = true) =>
//   useQuery({
//     queryKey: ["inventory", "next-po-no"],
//     queryFn:  () => fetchJSON(`${BASE}/api/inventory/next-po-no`),
//     staleTime: 0,
//     refetchOnWindowFocus: false,
//     enabled,
//   });

// // ── data = { invDate, storeId, poNo, grnNo, items: [...] } ──
// export const useCreateInventory = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data) =>
//       fetchJSON(`${BASE}/api/inventory`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(data),
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: inventoryKeys.lists() }),
//     onError: (err) => console.error("Create inventory failed:", err),
//   });
// };

// // ── { hid, data: { invDate, storeId, poNo, grnNo, items: [{ tid?, ... }] } } ──
// export const useUpdateInventory = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ hid, data }) =>
//       fetchJSON(`${BASE}/api/inventory/${hid}`, {
//         method:  "PUT",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(data),
//       }),
//     onSuccess: (_, { hid }) => {
//       qc.invalidateQueries({ queryKey: inventoryKeys.lists() });
//       qc.invalidateQueries({ queryKey: inventoryKeys.detail(hid) });
//     },
//     onError: (err) => console.error("Update inventory failed:", err),
//   });
// };

// export const useDeleteInventory = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (hid) =>
//       fetchJSON(`${BASE}/api/inventory/${hid}`, { method: "DELETE" }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: inventoryKeys.lists() }),
//     onError: (err) => console.error("Delete inventory failed:", err),
//   });
// };

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

export const inventoryKeys = {
  all:    ["inventories"],
  lists:  () => [...inventoryKeys.all, "lists"],
  detail: (hid) => [...inventoryKeys.all, "detail", hid],
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

export const useInventories = ({ page = 1, limit = 50 } = {}) =>
  useQuery({
    queryKey: [...inventoryKeys.lists(), page, limit],
    queryFn:  () => fetchJSON(`${BASE}/api/inventory?page=${page}&limit=${limit}`),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
    throwOnError: false,
  });

export const useInventoryById = (hid) =>
  useQuery({
    queryKey: inventoryKeys.detail(hid),
    queryFn:  () => fetchJSON(`${BASE}/api/inventory/${hid}`),
    enabled:  !!hid,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useNextGrnNo = (enabled = true) =>
  useQuery({
    queryKey: ["inventory", "next-grn-no"],
    queryFn:  () => fetchJSON(`${BASE}/api/inventory/next-grn-no`),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled,
  });

export const useNextPoNo = (enabled = true) =>
  useQuery({
    queryKey: ["inventory", "next-po-no"],
    queryFn:  () => fetchJSON(`${BASE}/api/inventory/next-po-no`),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled,
  });

// ✅ Invoice Number auto-generate — GRN/PO er moto e pattern
export const useNextInvoiceNo = (enabled = true) =>
  useQuery({
    queryKey: ["inventory", "next-invoice-no"],
    queryFn:  () => fetchJSON(`${BASE}/api/inventory/next-invoice-no`),
    staleTime: 0,
    refetchOnWindowFocus: false,
    enabled,
  });

// ✅ Supplier dropdown-er jonno
export const useSuppliers = () =>
  useQuery({
    queryKey: ["inv-suppliers"],
    queryFn:  () => fetchJSON(`${BASE}/api/supplier-type`),
    staleTime: 5 * 60 * 1000,
  });

// ── data = { invDate, storeId, poNo, grnNo, invoiceNumber, supplierId, items: [...] } ──
export const useCreateInventory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/inventory`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: inventoryKeys.lists() }),
    onError: (err) => console.error("Create inventory failed:", err),
  });
};

// ── { hid, data: { invDate, storeId, poNo, grnNo, supplierId, items: [{ tid?, ... }] } } ──
export const useUpdateInventory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ hid, data }) =>
      fetchJSON(`${BASE}/api/inventory/${hid}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: (_, { hid }) => {
      qc.invalidateQueries({ queryKey: inventoryKeys.lists() });
      qc.invalidateQueries({ queryKey: inventoryKeys.detail(hid) });
    },
    onError: (err) => console.error("Update inventory failed:", err),
  });
};

export const useDeleteInventory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hid) =>
      fetchJSON(`${BASE}/api/inventory/${hid}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: inventoryKeys.lists() }),
    onError: (err) => console.error("Delete inventory failed:", err),
  });
};

// ✅ Payment Voucher successful hobar por inventory lock korte
export const useLockInventoryForPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (hid) =>
      fetchJSON(`${BASE}/api/inventory/${hid}/lock`, { method: "PUT" }),
    onSuccess: (_, hid) => {
      qc.invalidateQueries({ queryKey: inventoryKeys.lists() });
      qc.invalidateQueries({ queryKey: inventoryKeys.detail(hid) });
    },
    onError: (err) => console.error("Lock inventory failed:", err),
  });
};