// // // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// // // const BASE = import.meta.env.VITE_API_BASE_URL;

// // // // ── Query Keys ────────────────────────────────────────────────────────────────
// // // export const meetingKeys = {
// // //   all:    ["meeting"],
// // //   lists:  () => [...meetingKeys.all, "list"],
// // //   detail: (id) => [...meetingKeys.all, "detail", id],
// // // };

// // // export const lookupKeys = {
// // //   departments: ["meeting", "lookups", "departments"],
// // //   employees:   ["meeting", "lookups", "employees"],
// // //   rooms:       ["meeting", "lookups", "rooms"],
// // // };

// // // // ── Fetcher ───────────────────────────────────────────────────────────────────
// // // const fetchJSON = async (url, options = {}) => {
// // //   const res = await fetch(url, options);
// // //   if (!res.ok) {
// // //     const err = await res.json().catch(() => ({}));
// // //     throw new Error(err.message || `${res.status} ${res.statusText}`);
// // //   }
// // //   const json = await res.json();
// // //   return json.data ?? json;
// // // };

// // // // ── Meeting hooks ─────────────────────────────────────────────────────────────
// // // export const useMeetings = () =>
// // //   useQuery({
// // //     queryKey: meetingKeys.lists(),
// // //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management`),
// // //     staleTime: 5 * 60 * 1000,
// // //     gcTime:    10 * 60 * 1000,
// // //     refetchOnWindowFocus: false,
// // //     refetchOnMount: true,
// // //     retry: 2,
// // //     retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
// // //     throwOnError: false,
// // //   });

// // // export const useMeetingById = (id) =>
// // //   useQuery({
// // //     queryKey: meetingKeys.detail(id),
// // //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${id}`),
// // //     enabled:  !!id,
// // //     staleTime: 5 * 60 * 1000,
// // //     refetchOnWindowFocus: false,
// // //     throwOnError: false,
// // //   });

// // // export const useCreateMeeting = () => {
// // //   const qc = useQueryClient();
// // //   return useMutation({
// // //     mutationFn: (data) =>
// // //       fetchJSON(`${BASE}/api/agenda-management`, {
// // //         method:  "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body:    JSON.stringify(data),
// // //       }),
// // //     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
// // //     onError: (err) => console.error("Create meeting failed:", err),
// // //   });
// // // };

// // // export const useUpdateMeeting = () => {
// // //   const qc = useQueryClient();
// // //   return useMutation({
// // //     mutationFn: ({ id, data }) =>
// // //       fetchJSON(`${BASE}/api/agenda-management/${id}`, {
// // //         method:  "PUT",
// // //         headers: { "Content-Type": "application/json" },
// // //         body:    JSON.stringify(data),
// // //       }),
// // //     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
// // //     onError: (err) => console.error("Update meeting failed:", err),
// // //   });
// // // };

// // // export const useDeleteMeeting = () => {
// // //   const qc = useQueryClient();
// // //   return useMutation({
// // //     mutationFn: (id) =>
// // //       fetchJSON(`${BASE}/api/agenda-management/${id}`, { method: "DELETE" }),
// // //     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
// // //     onError: (err) => console.error("Delete meeting failed:", err),
// // //   });
// // // };

// // // // ── Lookup hooks (form dropdowns) ────────────────────────────────────────────
// // // export const useDepartments = () =>
// // //   useQuery({
// // //     queryKey: lookupKeys.departments,
// // //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/departments`),
// // //     staleTime: 30 * 60 * 1000,
// // //     refetchOnWindowFocus: false,
// // //     throwOnError: false,
// // //   });

// // // export const useEmployees = () =>
// // //   useQuery({
// // //     queryKey: lookupKeys.employees,
// // //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/employees`),
// // //     staleTime: 30 * 60 * 1000,
// // //     refetchOnWindowFocus: false,
// // //     throwOnError: false,
// // //   });

// // // export const useMeetingRooms = () =>
// // //   useQuery({
// // //     queryKey: lookupKeys.rooms,
// // //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/rooms`),
// // //     staleTime: 30 * 60 * 1000,
// // //     refetchOnWindowFocus: false,
// // //     throwOnError: false,
// // //   });


// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// // const BASE = import.meta.env.VITE_API_BASE_URL;

// // // ── Query Keys ────────────────────────────────────────────────────────────────
// // export const meetingKeys = {
// //   all:    ["meeting"],
// //   lists:  () => [...meetingKeys.all, "list"],
// //   detail: (id) => [...meetingKeys.all, "detail", id],
// // };

// // export const lookupKeys = {
// //   departments: ["meeting", "lookups", "departments"],
// //   employees:   ["meeting", "lookups", "employees"],
// //   rooms:       ["meeting", "lookups", "rooms"],
// // };

// // export const actionItemKeys = {
// //   list: (meetingId) => ["actionItems", meetingId],
// // };

// // export const attachmentKeys = {
// //   list: (meetingId) => ["attachments", meetingId],
// // };

// // export const notificationKeys = {
// //   list: (meetingId) => ["notifications", meetingId],
// // };

// // // ── Fetcher ───────────────────────────────────────────────────────────────────
// // const fetchJSON = async (url, options = {}) => {
// //   const res = await fetch(url, options);
// //   if (!res.ok) {
// //     const err = await res.json().catch(() => ({}));
// //     throw new Error(err.message || `${res.status} ${res.statusText}`);
// //   }
// //   const json = await res.json();
// //   return json.data ?? json;
// // };

// // // ── Meeting hooks ─────────────────────────────────────────────────────────────
// // export const useMeetings = () =>
// //   useQuery({
// //     queryKey: meetingKeys.lists(),
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management`),
// //     staleTime: 5 * 60 * 1000,
// //     gcTime:    10 * 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     refetchOnMount: true,
// //     retry: 2,
// //     retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
// //     throwOnError: false,
// //   });

// // export const useMeetingById = (id) =>
// //   useQuery({
// //     queryKey: meetingKeys.detail(id),
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${id}`),
// //     enabled:  !!id,
// //     staleTime: 5 * 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // export const useCreateMeeting = () => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (data) =>
// //       fetchJSON(`${BASE}/api/agenda-management`, {
// //         method:  "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body:    JSON.stringify(data),
// //       }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
// //     onError: (err) => console.error("Create meeting failed:", err),
// //   });
// // };

// // export const useUpdateMeeting = () => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: ({ id, data }) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${id}`, {
// //         method:  "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body:    JSON.stringify(data),
// //       }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
// //     onError: (err) => console.error("Update meeting failed:", err),
// //   });
// // };

// // export const useDeleteMeeting = () => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (id) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${id}`, { method: "DELETE" }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
// //     onError: (err) => console.error("Delete meeting failed:", err),
// //   });
// // };

// // // ── Lookup hooks (form dropdowns) ────────────────────────────────────────────
// // export const useDepartments = () =>
// //   useQuery({
// //     queryKey: lookupKeys.departments,
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/departments`),
// //     staleTime: 30 * 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // export const useEmployees = () =>
// //   useQuery({
// //     queryKey: lookupKeys.employees,
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/employees`),
// //     staleTime: 30 * 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // export const useMeetingRooms = () =>
// //   useQuery({
// //     queryKey: lookupKeys.rooms,
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/rooms`),
// //     staleTime: 30 * 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // // ═══════════════════ ACTION ITEMS ═══════════════════
// // export const useActionItems = (meetingId) =>
// //   useQuery({
// //     queryKey: actionItemKeys.list(meetingId),
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items`),
// //     enabled:  !!meetingId,
// //     staleTime: 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // export const useCreateActionItem = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (data) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items`, {
// //         method:  "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body:    JSON.stringify(data),
// //       }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
// //     onError: (err) => console.error("Create action item failed:", err),
// //   });
// // };

// // export const useUpdateActionItemStatus = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: ({ actionItemId, status }) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}/status`, {
// //         method:  "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body:    JSON.stringify({ status }),
// //       }),
// //     // Optimistic update so moving a card between columns feels instant
// //     onMutate: async ({ actionItemId, status }) => {
// //       await qc.cancelQueries({ queryKey: actionItemKeys.list(meetingId) });
// //       const previous = qc.getQueryData(actionItemKeys.list(meetingId));
// //       qc.setQueryData(actionItemKeys.list(meetingId), (old = []) =>
// //         old.map((item) =>
// //           item.ACTION_ITEM_ID === actionItemId ? { ...item, STATUS: status } : item
// //         )
// //       );
// //       return { previous };
// //     },
// //     onError: (err, _vars, context) => {
// //       if (context?.previous) qc.setQueryData(actionItemKeys.list(meetingId), context.previous);
// //       console.error("Update action item status failed:", err);
// //     },
// //     onSettled: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
// //   });
// // };

// // export const useDeleteActionItem = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (actionItemId) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}`, { method: "DELETE" }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
// //     onError: (err) => console.error("Delete action item failed:", err),
// //   });
// // };

// // // ═══════════════════ ATTACHMENTS ═══════════════════
// // export const useAttachments = (meetingId) =>
// //   useQuery({
// //     queryKey: attachmentKeys.list(meetingId),
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments`),
// //     enabled:  !!meetingId,
// //     staleTime: 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // // data: FormData with 'file' + optional 'agendaItemId' + 'uploadedBy'
// // export const useUploadAttachment = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (formData) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments`, {
// //         method: "POST",
// //         body:   formData, // no Content-Type header — browser sets multipart boundary
// //       }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: attachmentKeys.list(meetingId) }),
// //     onError: (err) => console.error("Upload attachment failed:", err),
// //   });
// // };

// // export const useDeleteAttachment = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (attachmentId) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments/${attachmentId}`, { method: "DELETE" }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: attachmentKeys.list(meetingId) }),
// //     onError: (err) => console.error("Delete attachment failed:", err),
// //   });
// // };

// // export const attachmentDownloadUrl = (meetingId, attachmentId) =>
// //   `${BASE}/api/agenda-management/${meetingId}/attachments/${attachmentId}/download`;

// // // ═══════════════════ NOTIFICATIONS ═══════════════════
// // export const useNotifications = (meetingId) =>
// //   useQuery({
// //     queryKey: notificationKeys.list(meetingId),
// //     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications`),
// //     enabled:  !!meetingId,
// //     staleTime: 60 * 1000,
// //     refetchOnWindowFocus: false,
// //     throwOnError: false,
// //   });

// // // data: { employeeIds: [1,2,3], notificationType, message, sendAt }
// // export const useCreateNotification = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (data) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications`, {
// //         method:  "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body:    JSON.stringify(data),
// //       }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.list(meetingId) }),
// //     onError: (err) => console.error("Create notification failed:", err),
// //   });
// // };

// // export const useDeleteNotification = (meetingId) => {
// //   const qc = useQueryClient();
// //   return useMutation({
// //     mutationFn: (notificationId) =>
// //       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications/${notificationId}`, { method: "DELETE" }),
// //     onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.list(meetingId) }),
// //     onError: (err) => console.error("Delete notification failed:", err),
// //   });
// // };



// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const BASE = import.meta.env.VITE_API_BASE_URL;

// // ── Query Keys ────────────────────────────────────────────────────────────────
// export const meetingKeys = {
//   all:    ["meeting"],
//   lists:  () => [...meetingKeys.all, "list"],
//   detail: (id) => [...meetingKeys.all, "detail", id],
// };

// export const lookupKeys = {
//   departments: ["meeting", "lookups", "departments"],
//   employees:   ["meeting", "lookups", "employees"],
//   rooms:       ["meeting", "lookups", "rooms"],
// };

// export const actionItemKeys = {
//   list: (meetingId) => ["actionItems", meetingId],
// };

// export const attachmentKeys = {
//   list: (meetingId) => ["attachments", meetingId],
// };

// export const notificationKeys = {
//   list: (meetingId) => ["notifications", meetingId],
// };

// // ── Fetcher ───────────────────────────────────────────────────────────────────
// const fetchJSON = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// // ── Meeting hooks ─────────────────────────────────────────────────────────────
// export const useMeetings = () =>
//   useQuery({
//     queryKey: meetingKeys.lists(),
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management`),
//     staleTime: 5 * 60 * 1000,
//     gcTime:    10 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//     retry: 2,
//     retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
//     throwOnError: false,
//   });

// export const useMeetingById = (id) =>
//   useQuery({
//     queryKey: meetingKeys.detail(id),
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${id}`),
//     enabled:  !!id,
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// export const useCreateMeeting = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data) =>
//       fetchJSON(`${BASE}/api/agenda-management`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(data),
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
//     onError: (err) => console.error("Create meeting failed:", err),
//   });
// };

// export const useUpdateMeeting = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, data }) =>
//       fetchJSON(`${BASE}/api/agenda-management/${id}`, {
//         method:  "PUT",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(data),
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
//     onError: (err) => console.error("Update meeting failed:", err),
//   });
// };

// export const useDeleteMeeting = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (id) =>
//       fetchJSON(`${BASE}/api/agenda-management/${id}`, { method: "DELETE" }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: meetingKeys.all }),
//     onError: (err) => console.error("Delete meeting failed:", err),
//   });
// };

// // ── Lookup hooks (form dropdowns) ────────────────────────────────────────────
// export const useDepartments = () =>
//   useQuery({
//     queryKey: lookupKeys.departments,
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/departments`),
//     staleTime: 30 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// export const useEmployees = () =>
//   useQuery({
//     queryKey: lookupKeys.employees,
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/employees`),
//     staleTime: 30 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// export const useMeetingRooms = () =>
//   useQuery({
//     queryKey: lookupKeys.rooms,
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/lookups/rooms`),
//     staleTime: 30 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// // ═══════════════════ ACTION ITEMS ═══════════════════
// export const useActionItems = (meetingId) =>
//   useQuery({
//     queryKey: actionItemKeys.list(meetingId),
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items`),
//     enabled:  !!meetingId,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// export const useCreateActionItem = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(data),
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
//     onError: (err) => console.error("Create action item failed:", err),
//   });
// };

// export const useUpdateActionItemStatus = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ actionItemId, status }) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}/status`, {
//         method:  "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ status }),
//       }),
//     // Optimistic update so moving a card between columns feels instant
//     onMutate: async ({ actionItemId, status }) => {
//       await qc.cancelQueries({ queryKey: actionItemKeys.list(meetingId) });
//       const previous = qc.getQueryData(actionItemKeys.list(meetingId));
//       qc.setQueryData(actionItemKeys.list(meetingId), (old = []) =>
//         old.map((item) =>
//           item.ACTION_ITEM_ID === actionItemId ? { ...item, STATUS: status } : item
//         )
//       );
//       return { previous };
//     },
//     onError: (err, _vars, context) => {
//       if (context?.previous) qc.setQueryData(actionItemKeys.list(meetingId), context.previous);
//       console.error("Update action item status failed:", err);
//     },
//     onSettled: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
//   });
// };

// export const useDeleteActionItem = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (actionItemId) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}`, { method: "DELETE" }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
//     onError: (err) => console.error("Delete action item failed:", err),
//   });
// };

// // ═══════════════════ ATTACHMENTS ═══════════════════
// export const useAttachments = (meetingId) =>
//   useQuery({
//     queryKey: attachmentKeys.list(meetingId),
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments`),
//     enabled:  !!meetingId,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// // data: FormData with 'file' + optional 'agendaItemId' + 'uploadedBy'
// export const useUploadAttachment = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (formData) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments`, {
//         method: "POST",
//         body:   formData, // no Content-Type header — browser sets multipart boundary
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: attachmentKeys.list(meetingId) }),
//     onError: (err) => console.error("Upload attachment failed:", err),
//   });
// };

// export const useDeleteAttachment = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (attachmentId) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments/${attachmentId}`, { method: "DELETE" }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: attachmentKeys.list(meetingId) }),
//     onError: (err) => console.error("Delete attachment failed:", err),
//   });
// };

// export const attachmentDownloadUrl = (meetingId, attachmentId) =>
//   `${BASE}/api/agenda-management/${meetingId}/attachments/${attachmentId}/download`;

// // ═══════════════════ NOTIFICATIONS ═══════════════════
// export const useNotifications = (meetingId) =>
//   useQuery({
//     queryKey: notificationKeys.list(meetingId),
//     queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications`),
//     enabled:  !!meetingId,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

// // data: { employeeIds: [1,2,3], notificationType, message, sendAt }
// export const useCreateNotification = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(data),
//       }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.list(meetingId) }),
//     onError: (err) => console.error("Create notification failed:", err),
//   });
// };

// export const useDeleteNotification = (meetingId) => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (notificationId) =>
//       fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications/${notificationId}`, { method: "DELETE" }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.list(meetingId) }),
//     onError: (err) => console.error("Delete notification failed:", err),
//   });
// };


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

export const actionItemKeys = {
  list: (meetingId) => ["actionItems", meetingId],
};

export const attachmentKeys = {
  list: (meetingId) => ["attachments", meetingId],
};

export const notificationKeys = {
  list: (meetingId) => ["notifications", meetingId],
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

// ═══════════════════ ACTION ITEMS ═══════════════════
export const useActionItems = (meetingId) =>
  useQuery({
    queryKey: actionItemKeys.list(meetingId),
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items`),
    enabled:  !!meetingId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

export const useCreateActionItem = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
    onError: (err) => console.error("Create action item failed:", err),
  });
};

// Full edit — description/agenda item/assignee/priority/due date/status,
// used by EditActionItemSheet. Distinct from the lightweight status-only
// mutation below, which is for quick column moves / cancel / reopen.
export const useUpdateActionItem = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ actionItemId, data }) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
    onError: (err) => console.error("Update action item failed:", err),
  });
};

export const useUpdateActionItemStatus = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ actionItemId, status }) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      }),
    // Optimistic update so moving a card between columns feels instant
    onMutate: async ({ actionItemId, status }) => {
      await qc.cancelQueries({ queryKey: actionItemKeys.list(meetingId) });
      const previous = qc.getQueryData(actionItemKeys.list(meetingId));
      qc.setQueryData(actionItemKeys.list(meetingId), (old = []) =>
        old.map((item) =>
          item.ACTION_ITEM_ID === actionItemId ? { ...item, STATUS: status } : item
        )
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) qc.setQueryData(actionItemKeys.list(meetingId), context.previous);
      console.error("Update action item status failed:", err);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
  });
};

export const useDeleteActionItem = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (actionItemId) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/action-items/${actionItemId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: actionItemKeys.list(meetingId) }),
    onError: (err) => console.error("Delete action item failed:", err),
  });
};

// ═══════════════════ ATTACHMENTS ═══════════════════
export const useAttachments = (meetingId) =>
  useQuery({
    queryKey: attachmentKeys.list(meetingId),
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments`),
    enabled:  !!meetingId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// data: FormData with 'file' + optional 'agendaItemId' + 'uploadedBy'
export const useUploadAttachment = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments`, {
        method: "POST",
        body:   formData, // no Content-Type header — browser sets multipart boundary
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: attachmentKeys.list(meetingId) }),
    onError: (err) => console.error("Upload attachment failed:", err),
  });
};

export const useDeleteAttachment = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/attachments/${attachmentId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: attachmentKeys.list(meetingId) }),
    onError: (err) => console.error("Delete attachment failed:", err),
  });
};

export const attachmentDownloadUrl = (meetingId, attachmentId) =>
  `${BASE}/api/agenda-management/${meetingId}/attachments/${attachmentId}/download`;

// ═══════════════════ NOTIFICATIONS ═══════════════════
export const useNotifications = (meetingId) =>
  useQuery({
    queryKey: notificationKeys.list(meetingId),
    queryFn:  () => fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications`),
    enabled:  !!meetingId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

// data: { employeeIds: [1,2,3], notificationType, message, sendAt }
export const useCreateNotification = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.list(meetingId) }),
    onError: (err) => console.error("Create notification failed:", err),
  });
};

export const useDeleteNotification = (meetingId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) =>
      fetchJSON(`${BASE}/api/agenda-management/${meetingId}/notifications/${notificationId}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.list(meetingId) }),
    onError: (err) => console.error("Delete notification failed:", err),
  });
};