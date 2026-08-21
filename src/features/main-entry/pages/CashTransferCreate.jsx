// // import { useState } from "react";
// // import { ArrowLeft } from "lucide-react";
// // import Select from "react-select";
// // import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// // import { toast } from "react-toastify";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // import { SectionContainer } from "@/components/SectionContainer";
// // import { Button } from "@/components/ui/button";
// // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // import { useAuthUserId } from "@/hooks/use-auth-helper-id";

// // const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// // const CashTransferCreate = () => {
// //   const navigate    = useNavigate();
// //   const queryClient = useQueryClient();
// //   const today       = new Date().toISOString().split("T")[0];
// //   const userId = useAuthUserId();

// //   // ── Bill files ───────────────────────────────────────────────────────────────
// //   const [billFiles, setBillFiles] = useState([]);
// //   const [showModal, setShowModal] = useState(false);

// //   const [form, setForm] = useState({
// //     entryDate:    today,
// //     glDate:       today,
// //     amount:       "",
// //     fromCode:     "",
// //     toCode:       "",
// //     description:  "",
// //     supporting:   "",
// //   });

// //   // ── Accounts query ───────────────────────────────────────────────────────────
// //   const { data: accounts = [] } = useQuery({
// //     queryKey: ["cashFlowAccounts"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/case-flow-account-code`);
// //       if (res.data.success === 1) {
// //         return res.data.data.map((acc) => ({
// //           value: acc.ACCOUNT_ID,
// //           label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
// //           name:  acc.ACCOUNT_NAME,
// //         }));
// //       }
// //       return [];
// //     },
// //   });

// //   // ── Upload bills helper ──────────────────────────────────────────────────────
// //   const uploadBills = async (glMasterId) => {
// //     if (!billFiles.length || !glMasterId) return;
// //     const uploads = billFiles.map((file) => {
// //       const fd = new FormData();
// //       fd.append("doc_file",   file);
// //       fd.append("GLMASTERID", glMasterId);
// //       return axios.post(`${url}/api/gldoc`, fd);
// //     });
// //     await Promise.allSettled(uploads);
// //   };

// //   // ── Mutation ─────────────────────────────────────────────────────────────────
// //   const mutation = useMutation({
// //     mutationFn: async (payload) => {
// //       const res = await axios.post(`${url}/api/cash-flow-add`, payload);
// //       return res.data;
// //     },
// //     onSuccess: async (data) => {
// //       if (data.status === "success") {
// //         await uploadBills(data.masterID || data.id);
// //         toast.success("Cash transfer submitted successfully!");
// //         setBillFiles([]);
// //         setForm({
// //           entryDate: today, glDate: today,
// //           amount: "", fromCode: "", toCode: "",
// //           description: "", supporting: "",
// //         });
// //         queryClient.invalidateQueries(["unpostedCashTransfers"]);
// //         navigate("/dashboard/cash-transfer");
// //       } else {
// //         toast.error("Error processing voucher.");
// //       }
// //       setShowModal(false);
// //     },
// //     onError: () => {
// //       toast.error("Error submitting voucher. Please try again.");
// //       setShowModal(false);
// //     },
// //   });

// //   // ── Submit ───────────────────────────────────────────────────────────────────
// //   const handleSubmit = () => {
// //     if (!form.entryDate || !form.amount || !form.toCode || !form.fromCode || !form.glDate) {
// //       toast.error("Please fill all required fields.");
// //       return;
// //     }
// //     mutation.mutate({
// //       trans_date:    form.entryDate,
// //       receive_desc:  form.description || "Cash Transfer",
// //       fromCode:      form.fromCode,
// //       toCode:        form.toCode,
// //       amount:        parseFloat(form.amount) || 0,
// //       GL_ENTRY_DATE: form.glDate,
// //       supporting:    form.supporting || "0",
// //       entry_by: userId,
// //     });
// //   };

// //   const isSubmitting = mutation.isPending;

// //   const selectStyles = {
// //     control: (b) => ({ ...b, minHeight: "32px", height: "32px", fontSize: "0.875rem", borderRadius: "0.375rem" }),
// //     valueContainer: (b) => ({ ...b, height: "32px", padding: "0 8px" }),
// //     input: (b) => ({ ...b, margin: 0, padding: 0 }),
// //     indicatorsContainer: (b) => ({ ...b, height: "32px" }),
// //     singleValue: (b) => ({ ...b, lineHeight: "32px" }),
// //     menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// //     menu: (b) => ({ ...b, backgroundColor: "white", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }),
// //   };

// //   return (
// //     <SectionContainer>
// //       <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">

// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-6">
// //           <h2 className="font-semibold text-sm text-gray-800">Create Cash Transfer</h2>
// //           <Button variant="outline" onClick={() =>navigate("/dashboard/cash-Transfer")}>
// //             <ArrowLeft size={16} className="mr-2" /> Back
// //           </Button>
// //         </div>

// //         {/* Top grid: Bill panel | Fields */}
// //         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 bg-white rounded-lg">

// //           {/* Bill Upload */}
// //           <div className="border rounded-lg p-3 bg-gray-50">
// //             <BillUploadPanel
// //               files={billFiles}
// //               onChange={setBillFiles}
// //               disabled={isSubmitting}
// //             />
// //           </div>

// //           {/* Form fields */}
// //           <div>
// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-sm text-gray-800">Entry Date</label>
// //               <input
// //                 type="date"
// //                 value={form.entryDate}
// //                 onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-full border rounded py-1 bg-white"
// //               />
// //             </div>

// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-sm text-gray-800">GL Date</label>
// //               <input
// //                 type="date"
// //                 value={form.glDate}
// //                 onChange={(e) => setForm({ ...form, glDate: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-full border rounded py-1 bg-white"
// //               />
// //             </div>

// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-sm text-gray-800">Amount</label>
// //               <input
// //                 type="number"
// //                 value={form.amount}
// //                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-40 border rounded py-1 bg-white"
// //               />
// //             </div>

// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-sm text-gray-800">From Code</label>
// //               <div className="col-span-2">
// //                 <Select
// //                   options={accounts}
// //                   value={accounts.find((a) => a.value === form.fromCode) || null}
// //                   onChange={(s) => setForm({ ...form, fromCode: s ? s.value : "" })}
// //                   placeholder="Select account..."
// //                   isClearable isSearchable isDisabled={isSubmitting}
// //                   menuPortalTarget={document.body}
// //                   styles={selectStyles}
// //                 />
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-sm text-gray-800">To Code</label>
// //               <div className="col-span-2">
// //                 <Select
// //                   options={accounts}
// //                   value={accounts.find((a) => a.value === form.toCode) || null}
// //                   onChange={(s) => setForm({ ...form, toCode: s ? s.value : "" })}
// //                   placeholder="Select account..."
// //                   isClearable isSearchable isDisabled={isSubmitting}
// //                   menuPortalTarget={document.body}
// //                   styles={selectStyles}
// //                 />
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-sm text-gray-800">No. of Supporting</label>
// //               <input
// //                 type="number"
// //                 value={form.supporting}
// //                 onChange={(e) => setForm({ ...form, supporting: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-40 border rounded py-1 bg-white"
// //               />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Description */}
// //         <div className="mt-4 mb-4">
// //           <label className="font-bold text-sm text-gray-800 block mb-2 py-2 px-4 rounded-lg">
// //             Description
// //           </label>
// //           <textarea
// //             value={form.description}
// //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// //             disabled={isSubmitting}
// //             className="w-full mt-1 border rounded-lg px-3 py-2"
// //           />
// //         </div>

// //         {/* Actions */}
// //         <div className="flex justify-end gap-4">
// //           <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting}>
// //             {isSubmitting ? "Submitting..." : "Create"}
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Confirmation Modal */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
// //             <h2 className="text-xl font-bold mb-4">Confirm Cash Transfer</h2>
// //             <div className="space-y-2 text-sm">
// //               <p><strong>Entry Date:</strong> {form.entryDate}</p>
// //               <p><strong>GL Date:</strong> {form.glDate}</p>
// //               <p><strong>Amount:</strong> {form.amount}</p>
// //               <p><strong>From Code:</strong> {accounts.find((a) => a.value === form.fromCode)?.label || form.fromCode}</p>
// //               <p><strong>To Code:</strong> {accounts.find((a) => a.value === form.toCode)?.label || form.toCode}</p>
// //               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
// //               <p><strong>Description:</strong> {form.description}</p>

// //               {billFiles.length > 0 && (
// //                 <div>
// //                   <strong>Bills ({billFiles.length}):</strong>
// //                   <ul className="list-disc pl-5 text-gray-600">
// //                     {billFiles.map((f, i) => <li key={i}>{f.name}</li>)}
// //                   </ul>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="flex justify-end mt-4 space-x-3">
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="px-4 py-2 rounded-lg bg-gray-300"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={isSubmitting}
// //                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
// //               >
// //                 {isSubmitting ? "Submitting..." : "Confirm"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </SectionContainer>
// //   );
// // };

// // export default CashTransferCreate;


// import { useState } from "react";
// import { ArrowLeft } from "lucide-react";
// import Select from "react-select";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import { SectionContainer } from "@/components/SectionContainer";
// import { Button } from "@/components/ui/button";
// import BillUploadPanel from "@/components/shared/bill-upload-panel";
// import { useAuthUserId } from "@/hooks/use-auth-helper-id";

// const url = import.meta.env.VITE_API_BASE_URL ;

// const CashTransferCreate = () => {
//   const navigate    = useNavigate();
//   const queryClient = useQueryClient();
//   const today       = new Date().toISOString().split("T")[0];
//   const userId = useAuthUserId();

//   // ── Bill files ───────────────────────────────────────────────────────────────
//   const [billFiles, setBillFiles] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     entryDate:    today,
//     glDate:       today,
//     amount:       "",
//     fromCode:     "",
//     toCode:       "",
//     description:  "",
//     supporting:   "",
//   });

//   // ── Accounts query ───────────────────────────────────────────────────────────
//   const { data: accounts = [] } = useQuery({
//     queryKey: ["cashFlowAccounts"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/case-flow-account-code`);
//       if (res.data.success === 1) {
//         return res.data.data.map((acc) => ({
//           value: acc.ACCOUNT_ID,
//           label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
//           name:  acc.ACCOUNT_NAME,
//         }));
//       }
//       return [];
//     },
//   });

//   // ── Upload bills helper ──────────────────────────────────────────────────────
//   const uploadBills = async (glMasterId) => {
//     if (!billFiles.length || !glMasterId) return;
//     const uploads = billFiles.map((file) => {
//       const fd = new FormData();
//       fd.append("doc_file",   file);
//       fd.append("GLMASTERID", glMasterId);
//       return axios.post(`${url}/api/gldoc`, fd);
//     });
//     await Promise.allSettled(uploads);
//   };

//   // ── Mutation ─────────────────────────────────────────────────────────────────
//   const mutation = useMutation({
//     mutationFn: async (payload) => {
//       const res = await axios.post(`${url}/api/cash-flow-add`, payload);
//       return res.data;
//     },
//     onSuccess: async (data) => {
//       if (data.status === "success") {
//         await uploadBills(data.masterID || data.id);
//         toast.success("Cash transfer submitted successfully!");
//         setBillFiles([]);
//         setForm({
//           entryDate: today, glDate: today,
//           amount: "", fromCode: "", toCode: "",
//           description: "", supporting: "",
//         });
//         queryClient.invalidateQueries(["unpostedCashTransfers"]);
//         navigate("/dashboard/cash-transfer");
//       } else {
//         toast.error("Error processing voucher.");
//       }
//       setShowModal(false);
//     },
//     onError: () => {
//       toast.error("Error submitting voucher. Please try again.");
//       setShowModal(false);
//     },
//   });

//   // ── Submit ───────────────────────────────────────────────────────────────────
//   const handleSubmit = () => {
//     if (!form.entryDate || !form.amount || !form.toCode || !form.fromCode || !form.glDate) {
//       toast.error("Please fill all required fields.");
//       return;
//     }
//     mutation.mutate({
//       trans_date:    form.entryDate,
//       receive_desc:  form.description || "Cash Transfer",
//       fromCode:      form.fromCode,
//       toCode:        form.toCode,
//       amount:        parseFloat(form.amount) || 0,
//       GL_ENTRY_DATE: form.glDate,
//       supporting:    form.supporting || "0",
//       entry_by:      userId,
//     });
//   };

//   const isSubmitting = mutation.isPending;

//   return (
//     <SectionContainer>
//       <div className="p-6 space-y-6 bg-white rounded-lg mt-4 shadow-md">

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="font-semibold text-sm text-gray-800">Create Cash Transfer</h2>
//           <Button variant="outline" onClick={() => navigate("/dashboard/cash-transfer")}>
//             <ArrowLeft size={16} className="mr-2" /> Back
//           </Button>
//         </div>

//         {/* Bill panel + form fields — same layout as Journal Create */}
//         <div className="md:flex justify-between gap-10 bg-white rounded-lg">
//           <div className="border rounded-lg p-3 bg-gray-50 min-w-[200px] md:w-[220px]">
//             <BillUploadPanel files={billFiles} onChange={setBillFiles} disabled={isSubmitting} />
//           </div>

//           <div >
//             <div className="grid grid-cols-3 px-3 items-center py-2">
//               <label className="font-bold text-gray-800 text-sm font-sans">Entry Date</label>
//               <input
//                 type="date"
//                 value={form.entryDate}
//                 onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
//                 disabled={isSubmitting}
//                 className="col-span-2 w-full border rounded py-1 bg-white"
//               />
//             </div>

//             <div className="grid grid-cols-3 px-3 items-center py-2">
//               <label className="font-bold text-gray-800 text-sm font-sans">GL Date</label>
//               <input
//                 type="date"
//                 value={form.glDate}
//                 onChange={(e) => setForm({ ...form, glDate: e.target.value })}
//                 disabled={isSubmitting}
//                 className="col-span-2 w-full border rounded py-1 bg-white"
//               />
//             </div>

//             <div className="grid grid-cols-3 px-3 items-center py-2">
//               <label className="font-bold text-gray-800 text-sm font-sans">Amount</label>
//               <input
//                 type="number"
//                 value={form.amount}
//                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                 disabled={isSubmitting}
//                 className="col-span-2 w-40 border rounded py-1 bg-white"
//               />
//             </div>

//             <div className="grid grid-cols-3 px-3 items-center py-2">
//               <label className="font-bold text-gray-800 text-sm font-sans">From Code</label>
//               <div className="col-span-2">
//                 <Select
//                   options={accounts}
//                   value={accounts.find((a) => a.value === form.fromCode) || null}
//                   onChange={(s) => setForm({ ...form, fromCode: s ? s.value : "" })}
//                   placeholder="Select account..."
//                   isClearable isSearchable isDisabled={isSubmitting}
//                   menuPortalTarget={document.body}
//                   styles={{
//                     menuPortal: (b) => ({ ...b, zIndex: 9999 }),
//                     menu: (b) => ({ ...b, backgroundColor: "white", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }),
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-3 px-3 items-center py-2">
//               <label className="font-bold text-gray-800 text-sm font-sans">To Code</label>
//               <div className="col-span-2">
//                 <Select
//                   options={accounts}
//                   value={accounts.find((a) => a.value === form.toCode) || null}
//                   onChange={(s) => setForm({ ...form, toCode: s ? s.value : "" })}
//                   placeholder="Select account..."
//                   isClearable isSearchable isDisabled={isSubmitting}
//                   menuPortalTarget={document.body}
//                   styles={{
//                     menuPortal: (b) => ({ ...b, zIndex: 9999 }),
//                     menu: (b) => ({ ...b, backgroundColor: "white", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }),
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-3 px-3 items-center py-2">
//               <label className="font-bold text-gray-800 text-sm font-sans">No. of Supporting</label>
//               <input
//                 type="number"
//                 value={form.supporting}
//                 onChange={(e) => setForm({ ...form, supporting: e.target.value })}
//                 disabled={isSubmitting}
//                 className="col-span-2 w-40 border rounded py-1 bg-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="mt-4 mb-4 bg-white">
//           <label className="block font-bold text-gray-800 text-sm font-sans mb-2 py-2 px-4 rounded-lg">
//             Description
//           </label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             disabled={isSubmitting}
//             className="w-full mt-1 border rounded-lg px-3 py-2"
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end items-center gap-4">
//           <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting}>
//             {isSubmitting ? "Submitting..." : "Create"}
//           </Button>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Confirm Cash Transfer</h2>
//             <div className="space-y-2 text-sm">
//               <p><strong>Entry Date:</strong> {form.entryDate}</p>
//               <p><strong>GL Date:</strong> {form.glDate}</p>
//               <p><strong>Amount:</strong> {form.amount}</p>
//               <p><strong>From Code:</strong> {accounts.find((a) => a.value === form.fromCode)?.label || form.fromCode}</p>
//               <p><strong>To Code:</strong> {accounts.find((a) => a.value === form.toCode)?.label || form.toCode}</p>
//               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
//               <p><strong>Description:</strong> {form.description}</p>

//               {billFiles.length > 0 && (
//                 <div>
//                   <strong>Bills ({billFiles.length}):</strong>
//                   <ul className="list-disc pl-5 text-gray-600 mt-1">
//                     {billFiles.map((f, i) => <li key={i}>{f.name}</li>)}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end mt-4 space-x-3">
//               <button
//                 onClick={() => setShowModal(false)}
//                 disabled={isSubmitting}
//                 className="px-4 py-2 rounded-lg bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
//               >
//                 {isSubmitting ? "Submitting..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </SectionContainer>
//   );
// };

// export default CashTransferCreate;

import { useState } from "react";
import { ArrowLeft, FileText, ListChecks, ArrowLeftRight } from "lucide-react";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import BillUploadPanel from "@/components/shared/bill-upload-panel";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";

const url = import.meta.env.VITE_API_BASE_URL;

/* ── Shared design tokens (visual only) — mirrors PaymentCreate/ReceiveCreate ── */
const card =
  "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
const sectionHeader =
  "flex items-center gap-3 px-6 py-4 border-b border-slate-100";
const sectionIconWrap =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";
const sectionTitle = "text-[15px] font-semibold text-slate-800 leading-none";
const sectionSubtitle = "text-xs text-slate-400 mt-1";
const fieldLabel =
  "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
const fieldInput =
  "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:border-slate-200 transition-all";

const selectStyles = {
  control: (b, state) => ({
    ...b,
    borderColor: state.isFocused ? "#818cf8" : "#e2e8f0",
    borderRadius: "0.5rem",
    minHeight: "38px",
    backgroundColor: state.isFocused ? "#fff" : "#f8fafc",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(99,102,241,0.1)" : "none",
    "&:hover": { borderColor: "#cbd5e1" },
  }),
  menuPortal: (b) => ({ ...b, zIndex: 9999 }),
  menu: (b) => ({
    ...b,
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
  }),
};

const CashTransferCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const userId = useAuthUserId();

  // ── Bill files ───────────────────────────────────────────────────────────────
  const [billFiles, setBillFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    entryDate: today,
    glDate: today,
    amount: "",
    fromCode: "",
    toCode: "",
    description: "",
    supporting: "",
  });

  // ── Accounts query ───────────────────────────────────────────────────────────
  const { data: accounts = [] } = useQuery({
    queryKey: ["cashFlowAccounts"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/case-flow-account-code`);
      if (res.data.success === 1) {
        return res.data.data.map((acc) => ({
          value: acc.ACCOUNT_ID,
          label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
          name: acc.ACCOUNT_NAME,
        }));
      }
      return [];
    },
  });

  // ── Upload bills helper ──────────────────────────────────────────────────────
  const uploadBills = async (glMasterId) => {
    if (!billFiles.length || !glMasterId) return;
    const uploads = billFiles.map((file) => {
      const fd = new FormData();
      fd.append("doc_file", file);
      fd.append("GLMASTERID", glMasterId);
      return axios.post(`${url}/api/gldoc`, fd);
    });
    await Promise.allSettled(uploads);
  };

  // ── Mutation ─────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`${url}/api/cash-flow-add`, payload);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        await uploadBills(data.masterID || data.id);
        toast.success("Cash transfer submitted successfully!");
        setBillFiles([]);
        setForm({
          entryDate: today,
          glDate: today,
          amount: "",
          fromCode: "",
          toCode: "",
          description: "",
          supporting: "",
        });
        queryClient.invalidateQueries(["unpostedCashTransfers"]);
        navigate("/dashboard/cash-transfer");
      } else {
        toast.error("Error processing voucher.");
      }
      setShowModal(false);
    },
    onError: () => {
      toast.error("Error submitting voucher. Please try again.");
      setShowModal(false);
    },
  });

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.entryDate || !form.amount || !form.toCode || !form.fromCode || !form.glDate) {
      toast.error("Please fill all required fields.");
      return;
    }
    mutation.mutate({
      trans_date: form.entryDate,
      receive_desc: form.description || "Cash Transfer",
      fromCode: form.fromCode,
      toCode: form.toCode,
      amount: parseFloat(form.amount) || 0,
      GL_ENTRY_DATE: form.glDate,
      supporting: form.supporting || "0",
      entry_by: userId,
    });
  };

  const isSubmitting = mutation.isPending;

  return (
    <SectionContainer>
      <div className="flex flex-col min-h-full">
        <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Cash Management
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Create Cash Transfer
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Move funds between two cash/bank accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate("/dashboard/cash-transfer")}
              >
                <ArrowLeft size={16} className="mr-1.5" /> Back
              </Button>
            </div>
          </div>

          {/* ── Section: Transfer Details ────────────────────────────────────── */}
          <div className={card}>
            <div className={sectionHeader}>
              <div className={sectionIconWrap}>
                <FileText size={16} />
              </div>
              <div>
                <h3 className={sectionTitle}>Transfer Details</h3>
                <p className={sectionSubtitle}>References and posting dates</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              {/* Bill upload spans first column, full height */}
              <div className="md:row-span-3">
                <span className={fieldLabel}>Bill Attachments</span>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:border-slate-400 transition-colors">
                  <BillUploadPanel
                    files={billFiles}
                    onChange={setBillFiles}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className={fieldLabel}>Entry Date</label>
                <input
                  type="date"
                  value={form.entryDate}
                  onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                />
              </div>

              <div>
                <label className={fieldLabel}>GL Date</label>
                <input
                  type="date"
                  value={form.glDate}
                  onChange={(e) => setForm({ ...form, glDate: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                />
              </div>

              <div>
                <label className={fieldLabel}>Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                />
              </div>

              <div>
                <label className={fieldLabel}>No. of Supporting</label>
                <input
                  type="number"
                  value={form.supporting}
                  onChange={(e) => setForm({ ...form, supporting: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                />
              </div>
            </div>

            <div className="px-6 pb-6">
              <label className={fieldLabel}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={isSubmitting}
                rows={3}
                placeholder="Add a note about this transfer..."
                className={`${fieldInput} resize-none`}
              />
            </div>
          </div>

          {/* ── Section: From / To Accounts ──────────────────────────────────── */}
          <div className={card}>
            <div className={sectionHeader}>
              <div className={sectionIconWrap}>
                <ArrowLeftRight size={16} />
              </div>
              <div>
                <h3 className={sectionTitle}>Transfer Accounts</h3>
                <p className={sectionSubtitle}>Choose the source and destination accounts</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <label className={fieldLabel}>From Code</label>
                <Select
                  options={accounts}
                  value={accounts.find((a) => a.value === form.fromCode) || null}
                  onChange={(s) => setForm({ ...form, fromCode: s ? s.value : "" })}
                  placeholder="Select account..."
                  isClearable
                  isSearchable
                  isDisabled={isSubmitting}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                />
              </div>
              <div>
                <label className={fieldLabel}>To Code</label>
                <Select
                  options={accounts}
                  value={accounts.find((a) => a.value === form.toCode) || null}
                  onChange={(s) => setForm({ ...form, toCode: s ? s.value : "" })}
                  placeholder="Select account..."
                  isClearable
                  isSearchable
                  isDisabled={isSubmitting}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer action bar — sticks to the bottom of THIS content
            area (which already excludes the sidebar), never the full
            viewport, so it never overlaps the sidebar. */}
        <div className="sticky bottom-0 z-40 w-full mt-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Voucher ID · auto-generated
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => setShowModal(true)}
                disabled={isSubmitting}
                className="text-white shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Create Transfer"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <ListChecks size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-gray-900">Confirm Cash Transfer</h2>
            </div>
            <div className="px-6 py-5 space-y-2 text-sm">
              <p>
                <strong className="text-gray-700">Entry Date:</strong>{" "}
                <span className="text-gray-600">{form.entryDate}</span>
              </p>
              <p>
                <strong className="text-gray-700">GL Date:</strong>{" "}
                <span className="text-gray-600">{form.glDate}</span>
              </p>
              <p>
                <strong className="text-gray-700">Amount:</strong>{" "}
                <span className="text-gray-600">{form.amount}</span>
              </p>
              <p>
                <strong className="text-gray-700">From Code:</strong>{" "}
                <span className="text-gray-600">
                  {accounts.find((a) => a.value === form.fromCode)?.label || form.fromCode}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">To Code:</strong>{" "}
                <span className="text-gray-600">
                  {accounts.find((a) => a.value === form.toCode)?.label || form.toCode}
                </span>
              </p>
              <p>
                <strong className="text-gray-700">No. of Supporting:</strong>{" "}
                <span className="text-gray-600">{form.supporting}</span>
              </p>
              <p>
                <strong className="text-gray-700">Description:</strong>{" "}
                <span className="text-gray-600">{form.description}</span>
              </p>

              {billFiles.length > 0 && (
                <div>
                  <strong className="text-gray-700">Bills ({billFiles.length}):</strong>
                  <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                    {billFiles.map((f, i) => (
                      <li key={i}>{f.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default CashTransferCreate;