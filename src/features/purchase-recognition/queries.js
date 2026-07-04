// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
// const BASE = `${url}/api/purchase-recognition`;

// // ═══════════════════════════════════════════════════════════════
// // PURCHASE RECOGNITION (H + D)
// // ═══════════════════════════════════════════════════════════════

// // ── List (one row per form) ────────────────────────────────────────────────────
// export const usePurchaseRecognitions = () =>
//   useQuery({
//     queryKey: ["purchaseRecognitions"],
//     queryFn: async () => {
//       const res = await axios.get(BASE);
//       return res.data.success ? res.data.data || [] : [];
//     },
//   });

// // ── Single (header + items) ────────────────────────────────────────────────────
// export const usePurchaseRecognitionByFormId = (formId) =>
//   useQuery({
//     queryKey: ["purchaseRecognition", formId],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE}/${formId}`);
//       return res.data.data;
//     },
//     enabled: !!formId,
//   });

// // ── Create ──────────────────────────────────────────────────────────────────────
// export const useCreatePurchaseRecognition = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload) => (await axios.post(BASE, payload)).data,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["purchaseRecognitions"]);
//     },
//   });
// };

// // ── Update ──────────────────────────────────────────────────────────────────────
// export const useUpdatePurchaseRecognition = (formId) => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload) => (await axios.put(`${BASE}/${formId}`, payload)).data,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["purchaseRecognitions"]);
//       queryClient.invalidateQueries(["purchaseRecognition", formId]);
//       queryClient.invalidateQueries(["approvalTracking"]);
//     },
//   });
// };

// // ── Delete ──────────────────────────────────────────────────────────────────────
// export const useDeletePurchaseRecognition = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (formId) => (await axios.delete(`${BASE}/${formId}`)).data,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["purchaseRecognitions"]);
//       queryClient.invalidateQueries(["approvalTracking"]);
//     },
//   });
// };

// // ═══════════════════════════════════════════════════════════════
// // APPROVAL TRACKING
// // ═══════════════════════════════════════════════════════════════

// // ── List (dashboard) ────────────────────────────────────────────────────────────
// export const useApprovalTracking = () =>
//   useQuery({
//     queryKey: ["approvalTracking"],
//     queryFn: async () => {
//       const res = await axios.get(`${BASE}/approvals/all`);
//       return res.data.success ? res.data.data || [] : [];
//     },
//   });

// // ── Update one stage (Approved / Pending) ──────────────────────────────────────
// export const useUpdateApprovalStage = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ formId, stage, value }) =>
//       (await axios.patch(`${BASE}/approvals/${formId}/stage`, { stage, value })).data,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["approvalTracking"]);
//       queryClient.invalidateQueries(["purchaseRecognitions"]);
//     },
//   });
// };

// // ═══════════════════════════════════════════════════════════════
// // SUPPLIERS (for the header dropdown — auto-fills vendor/contact)
// // ═══════════════════════════════════════════════════════════════
// export const useActiveSuppliers = () =>
//   useQuery({
//     queryKey: ["activeSuppliers"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/supplier`);
//       return res.data.success ? res.data.data || [] : [];
//     },
//   });


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE = `${url}/api/purchase-recognition`;

// ═══════════════════════════════════════════════════════════════
// ITEM (search/autocomplete for the item line picker)
// keyword="" returns the default item list (backend LIKE '%%' matches all)
// enabled lets the caller gate fetching to when the picker is actually open
// ═══════════════════════════════════════════════════════════════
export const useSearchItems = (keyword, enabled = true) =>
  useQuery({
    queryKey: ["itemSearch", keyword],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/item/search`, { params: { q: keyword } });
      return res.data.success ? res.data.data || [] : [];
    },
    enabled,
  });

// ═══════════════════════════════════════════════════════════════
// PURCHASE RECOGNITION (H + D)
// ═══════════════════════════════════════════════════════════════

// ── List (one row per form) ────────────────────────────────────────────────────
export const usePurchaseRecognitions = () =>
  useQuery({
    queryKey: ["purchaseRecognitions"],
    queryFn: async () => {
      const res = await axios.get(BASE);
      return res.data.success ? res.data.data || [] : [];
    },
  });

// ── Single (header + items) ────────────────────────────────────────────────────
export const usePurchaseRecognitionByFormId = (formId) =>
  useQuery({
    queryKey: ["purchaseRecognition", formId],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/${formId}`);
      return res.data.data;
    },
    enabled: !!formId,
  });

// ── Create ──────────────────────────────────────────────────────────────────────
export const useCreatePurchaseRecognition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await axios.post(BASE, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["purchaseRecognitions"]);
    },
  });
};

// ── Update ──────────────────────────────────────────────────────────────────────
export const useUpdatePurchaseRecognition = (formId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await axios.put(`${BASE}/${formId}`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["purchaseRecognitions"]);
      queryClient.invalidateQueries(["purchaseRecognition", formId]);
      queryClient.invalidateQueries(["approvalTracking"]);
    },
  });
};

// ── Delete ──────────────────────────────────────────────────────────────────────
export const useDeletePurchaseRecognition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formId) => (await axios.delete(`${BASE}/${formId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["purchaseRecognitions"]);
      queryClient.invalidateQueries(["approvalTracking"]);
    },
  });
};

// ═══════════════════════════════════════════════════════════════
// APPROVAL TRACKING (single STATUS field: Pending → Approved / Rejected)
// ═══════════════════════════════════════════════════════════════

// ── List (dashboard) ────────────────────────────────────────────────────────────
export const useApprovalTracking = () =>
  useQuery({
    queryKey: ["approvalTracking"],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/approvals/all`);
      return res.data.success ? res.data.data || [] : [];
    },
  });

// ── Update status ────────────────────────────────────────────────────────────────
export const useUpdateApprovalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formId, status }) =>
      (await axios.patch(`${BASE}/approvals/${formId}/status`, { status })).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["approvalTracking"]);
      queryClient.invalidateQueries(["purchaseRecognitions"]);
    },
  });
};

// ═══════════════════════════════════════════════════════════════
// SUPPLIERS (for the header dropdown — auto-fills vendor/contact)
// ═══════════════════════════════════════════════════════════════
export const useActiveSuppliers = () =>
  useQuery({
    queryKey: ["activeSuppliers"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/supplier`);
      return res.data.success ? res.data.data || [] : [];
    },
  });