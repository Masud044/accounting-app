import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const BASE = `${url}/api/purchase-recognition`;

// ═══════════════════════════════════════════════════════════════
// ITEM (search/autocomplete for the item line picker)
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
// UOM (for GRN Qty / Receive Qty line — same master used by Inventory module)
// ═══════════════════════════════════════════════════════════════
export const useUoms = () =>
  useQuery({
    queryKey: ["uoms"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/inv-uom`);
      return res.data.success ? res.data.data || [] : (res.data.data ?? res.data ?? []);
    },
    staleTime: 10 * 60 * 1000,
  });

// ═══════════════════════════════════════════════════════════════
// PURCHASE RECOGNITION (H + D)
// ═══════════════════════════════════════════════════════════════

export const usePurchaseRecognitions = () =>
  useQuery({
    queryKey: ["purchaseRecognitions"],
    queryFn: async () => {
      const res = await axios.get(BASE);
      return res.data.success ? res.data.data || [] : [];
    },
  });

export const usePurchaseRecognitionByFormId = (formId) =>
  useQuery({
    queryKey: ["purchaseRecognition", formId],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/${formId}`);
      return res.data.data;
    },
    enabled: !!formId,
  });

export const useCreatePurchaseRecognition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await axios.post(BASE, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries(["purchaseRecognitions"]);
    },
  });
};

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

export const useApprovalTracking = () =>
  useQuery({
    queryKey: ["approvalTracking"],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/approvals/all`);
      return res.data.success ? res.data.data || [] : [];
    },
  });

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

 



export const useInvTypes = () =>
  useQuery({
    queryKey: ["inv-types"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/inv-type`);
      return res.data?.success ? res.data.data || [] : [];
    },
    staleTime: 10 * 60 * 1000,
  });

export const usePaymentCodes = () =>
  useQuery({
    queryKey: ["payment-codes"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/receive-code`);
      return res.data?.success ? res.data.data || [] : [];
    },
    staleTime: 10 * 60 * 1000,
  });


  export const useLockRecognitionAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formId) => (await axios.put(`${BASE}/${formId}/lock`)).data,
    onSuccess: (_data, formId) => {
      queryClient.invalidateQueries(["purchaseRecognitions"]);
      queryClient.invalidateQueries(["purchaseRecognition", formId]);
    },
  });
};