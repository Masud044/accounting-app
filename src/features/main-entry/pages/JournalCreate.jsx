// // import { useState } from "react";
// // import { ArrowLeft, Trash2 } from "lucide-react";
// // import Select from "react-select";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import { toast } from "react-toastify";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // import { SectionContainer } from "@/components/SectionContainer";
// // import { Button } from "@/components/ui/button";
// // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// // import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

// // const url = import.meta.env.VITE_API_BASE_URL ;

// // const JournalCreate = () => {
// //   const navigate = useNavigate();
// //   const queryClient = useQueryClient();
// //   const today = new Date().toISOString().split("T")[0];
// //   const userId = useAuthUserId();

// //   const [billFiles, setBillFiles] = useState([]);
// //   const [rows, setRows] = useState([]);
// //   const [showModal, setShowModal] = useState(false);


// //   const [form, setForm] = useState({
// //     entryDate: today,
// //     supporting: "",
// //     description: "",
// //     glDate: today,
// //     accountId: "",
// //     particular: "",
// //   });

// //   const { data: periodStatus } = usePeriodStatusForDate("GL", form.glDate);
// // const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
// // const noPeriodDefined = !!form.glDate && periodStatus === null;

// //   // ── Accounts ─────────────────────────────────────────────────────────────────
// //   const { data: accounts = [] } = useQuery({
// //     queryKey: ["journalAccounts"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/gl-account-code`);
// //       if (res.data.success === true) {
// //         return res.data.data.map((acc) => ({
// //           value: acc.ACCOUNT_ID,
// //           label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
// //           name: acc.ACCOUNT_NAME,
// //         }));
// //       }
// //       return [];
// //     },
// //   });

// //   // ── Upload bills ──────────────────────────────────────────────────────────────
// //   const uploadBills = async (glMasterId) => {
// //     if (!billFiles.length || !glMasterId) return;
// //     await Promise.allSettled(
// //       billFiles.map((file) => {
// //         const fd = new FormData();
// //         fd.append("doc_file", file);
// //         fd.append("GLMASTERID", glMasterId);
// //         return axios.post(`${url}/api/gldoc`, fd);
// //       })
// //     );
// //     setBillFiles([]);
// //   };

// //   // ── Mutation ──────────────────────────────────────────────────────────────────
// //   const mutation = useMutation({
// //     mutationFn: async (payload) => {
// //       const res = await axios.post(`${url}/api/gl-add`, payload);
// //       return res.data;
// //     },
// //     onSuccess: async (data) => {
// //       if (data.status === "success") {
// //         await uploadBills(data.masterId || data.masterID || data.id);
// //         toast.success("Journal Voucher created successfully!");
// //         queryClient.invalidateQueries(["unpostedJournalVouchers"]);
// //         navigate("/dashboard/journal-voucher");
// //       } else {
// //         toast.error(data.message || "Error processing voucher.");
// //       }
// //     },
// //     onError: (err) => {
// //       toast.error(err.response?.data?.message || "Server error. Please try again.");
// //     },
// //     onSettled: () => setShowModal(false),
// //   });

// //   // ── Add row: only account required, debit/credit filled in table ─────────────
// //   const addRow = () => {
// //     if (!form.accountId) {
// //       toast.error("Please select an account.");
// //       return;
// //     }
// //     setRows((prev) => [
// //       ...prev,
// //       {
// //         id: Date.now() + Math.random(),
// //         detail_id: null,
// //         accountCode: form.accountId,
// //         particulars: form.particular,
// //         debit: "",
// //         credit: "",
// //       },
// //     ]);
// //     setForm((prev) => ({ ...prev, accountId: "", particular: "" }));
// //   };

// //   // ── Inline debit/credit — mutually exclusive ──────────────────────────────────
// //   const handleRowChange = (id, field, value) => {
// //     setRows((prev) =>
// //       prev.map((row) =>
// //         row.id !== id
// //           ? row
// //           : {
// //               ...row,
// //               [field]: value,
// //               ...(field === "debit" && value ? { credit: "" } : {}),
// //               ...(field === "credit" && value ? { debit: "" } : {}),
// //             }
// //       )
// //     );
// //   };

// //   const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

// //   const debitTotal = rows.reduce((s, r) => s + (parseFloat(r.debit) || 0), 0);
// //   const creditTotal = rows.reduce((s, r) => s + (parseFloat(r.credit) || 0), 0);

// //   // ── Submit ────────────────────────────────────────────────────────────────────
// //   const handleSubmit = () => {
// //     if (!form.entryDate || !form.glDate || rows.length === 0) {
// //       toast.error("Please fill all required fields and add at least one row.");
// //       return;
// //     }
// //       if (rows.some((row) => !row.accountCode || !row.particulars)) {
// //       toast.error("Each row must have Account Code and Particular filled.");
// //       return;
// //     }
// //     if (debitTotal !== creditTotal) {
// //       toast.error("Debit and Credit totals must be equal before submission.");
// //       return;
// //     }
// //     mutation.mutate({
// //       trans_date: form.entryDate,
// //       GL_ENTRY_DATE: form.glDate,
// //       receive_desc: form.description,
// //       supporting: String(form.supporting || "0"),
// //       entry_by: userId,
// //       details: rows.map((r) => ({
// //         code: `${r.accountCode}##${r.particulars}`,
// //         debit: parseFloat(r.debit) || 0,
// //         credit: parseFloat(r.credit) || 0,
// //         description: r.particulars,
// //       })),
// //     });
// //   };

// //   const isSubmitting = mutation.isPending;

// //   return (
// //     <SectionContainer>
// //       <div className="p-6 space-y-6 bg-white rounded-lg mt-4 shadow-md">

// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           <h2 className="font-semibold text-sm text-gray-800">Create Journal Voucher</h2>
// //           <Button variant="outline" onClick={() => navigate("/dashboard/journal-voucher")}>
// //             <ArrowLeft size={16} className="mr-2" /> Back
// //           </Button>
// //         </div>

// //         {/* Bill panel + form fields */}
// //         <div className="md:flex justify-between gap-10 bg-white rounded-lg">
// //           <div className="border rounded-lg p-3 bg-gray-50 min-w-[200px] md:w-[220px]">
// //             <BillUploadPanel files={billFiles} onChange={setBillFiles} disabled={isSubmitting} />
// //           </div>

// //           <div>
// //             <div className="grid grid-cols-3 px-3 items-center py-2">
// //               <label className="font-bold text-gray-800 text-sm font-sans">Entry Date</label>
// //               <input
// //                 type="date" value={form.entryDate}
// //                 onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-full border rounded py-1 bg-white"
// //               />
// //             </div>
// //             <div className="grid grid-cols-3 py-2 px-3 items-center">
// //               <label className="font-bold text-gray-800 text-sm font-sans">No. of Supporting</label>
// //               <input
// //                 type="number" value={form.supporting}
// //                 onChange={(e) => setForm({ ...form, supporting: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-40 border rounded py-1 bg-white"
// //               />
// //             </div>
// //             {/* <div className="grid grid-cols-3 py-2 px-3 items-center">
// //               <label className="font-bold text-gray-800 text-sm font-sans">GL Date</label>
// //               <input
// //                 type="date" value={form.glDate}
// //                 onChange={(e) => setForm({ ...form, glDate: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className="col-span-2 w-full border rounded py-1 bg-white"
// //               />
// //             </div> */}

// //             <div className="grid grid-cols-3 py-2 px-3 items-center">
// //   <label className="font-bold text-gray-800 text-sm font-sans">GL Date</label>
// //   <input
// //     type="date" value={form.glDate}
// //     onChange={(e) => setForm({ ...form, glDate: e.target.value })}
// //     disabled={isSubmitting}
// //     className={`col-span-2 w-full border rounded py-1 bg-white ${isPeriodClosed ? "border-red-400" : ""}`}
// //   />
// // </div>
// // {isPeriodClosed && (
// //   <p className="text-xs text-red-500 px-3 -mt-1 mb-2">
// //     ⚠ Period "{periodStatus.PERIOD_NAME}" is closed for GL postings. Choose a different date.
// //   </p>
// // )}
// // {noPeriodDefined && (
// //   <p className="text-xs text-amber-500 px-3 -mt-1 mb-2">
// //     ⚠ No ledger period found for this date.
// //   </p>
// // )}
// //           </div>
// //         </div>

// //         {/* Description */}
// //         <div className="mt-4 mb-4 bg-white">
// //           <label className="block font-bold text-gray-800 text-sm font-sans mb-2 py-2 px-4 rounded-lg">
// //             Description
// //           </label>
// //           <textarea
// //             value={form.description}
// //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// //             disabled={isSubmitting}
// //             className="w-full mt-1 border rounded-lg px-3 py-2"
// //           />
// //         </div>

// //         {/* Add row: Account + Particular + Add (NO debit/credit here) */}
// //         <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_auto] gap-4 rounded-lg items-center">
// //           <div className="grid grid-cols-3 px-3 items-center py-1">
// //             <label className="font-bold text-gray-800 text-sm font-sans block">Account ID</label>
// //             <Select
// //               options={accounts}
// //               className="col-span-2 border w-full rounded shadow-2xl"
// //               value={accounts.find((a) => a.value === form.accountId) || null}
// //               onChange={(s) =>
// //                 setForm({ ...form, accountId: s ? s.value : "", particular: s ? s.name : "" })
// //               }
// //               placeholder="Enter account..."
// //               isClearable isSearchable isDisabled={isSubmitting}
// //               menuPortalTarget={document.body}
// //               styles={{
// //                 menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// //                 menu: (b) => ({ ...b, backgroundColor: "white", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }),
// //               }}
// //             />
// //           </div>

// //           <div className="grid grid-cols-3 px-3 items-center py-3">
// //             <label className="font-bold text-gray-800 text-sm font-sans block">Particular</label>
// //             <input
// //               type="text" value={form.particular} readOnly
// //               className="col-span-2 border w-full rounded py-1 bg-white"
// //             />
// //           </div>

// //           <div className="px-4 py-2">
// //             <button
// //               type="button" onClick={addRow} disabled={isSubmitting}
// //               className="font-bold text-gray-800 font-sans cursor-pointer border px-3 py-1 rounded-lg flex items-center text-sm"
// //             >
// //               <span className="mr-1 font-extrabold">+</span>Add
// //             </button>
// //           </div>
// //         </div>

// //         {/* Table: debit/credit entered inline after row is added */}
// //         <table className="w-full table-fixed border-collapse rounded-lg overflow-x-auto">
// //           <thead>
// //             <tr>
// //               <th className="px-4 py-2 w-[22%] text-center font-bold text-gray-800 text-sm font-sans">Account Code</th>
// //               <th className="px-4 py-2 w-[35%] text-center font-bold text-gray-800 text-sm font-sans">Particulars</th>
// //               <th className="px-4 py-2 w-[14%] text-center font-bold text-gray-800 text-sm font-sans">Debit</th>
// //               <th className="px-4 py-2 w-[14%] text-center font-bold text-gray-800 text-sm font-sans">Credit</th>
// //               <th className="px-4 py-2 w-[8%]"></th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {rows.length === 0 && (
// //               <tr>
// //                 <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
// //                   No rows yet — select an account above and click Add.
// //                 </td>
// //               </tr>
// //             )}

// //             {rows.map((row) => (
// //               <tr key={row.id} className="border">
// //                 <td className="border px-4 py-2 text-sm">{row.accountCode}</td>
// //                 <td className="border px-4 py-2 text-sm">{row.particulars}</td>

// //                 {/* Debit — locked (shows —) when credit has a value */}
// //                 <td className="border p-2">
// //                   {parseFloat(row.credit) > 0 ? (
// //                     <span className="block w-full text-center text-gray-300 text-sm select-none">—</span>
// //                   ) : (
// //                     <input
// //                       type="number"
// //                       value={row.debit}
// //                       onChange={(e) => handleRowChange(row.id, "debit", e.target.value)}
// //                       disabled={isSubmitting}
// //                       placeholder="0"
// //                       className="w-full border-none outline-none bg-transparent text-center text-sm"
// //                     />
// //                   )}
// //                 </td>

// //                 {/* Credit — locked (shows —) when debit has a value */}
// //                 <td className="border p-2">
// //                   {parseFloat(row.debit) > 0 ? (
// //                     <span className="block w-full text-center text-gray-300 text-sm select-none">—</span>
// //                   ) : (
// //                     <input
// //                       type="number"
// //                       value={row.credit}
// //                       onChange={(e) => handleRowChange(row.id, "credit", e.target.value)}
// //                       disabled={isSubmitting}
// //                       placeholder="0"
// //                       className="w-full border-none outline-none bg-transparent text-center text-sm"
// //                     />
// //                   )}
// //                 </td>

// //                 <td className="border p-2 text-center">
// //                   <Button type="button" variant="ghost" size="icon"
// //                     onClick={() => removeRow(row.id)} disabled={isSubmitting}>
// //                     <Trash2 className="w-4 h-4 text-red-500" />
// //                   </Button>
// //                 </td>
// //               </tr>
// //             ))}

// //             {rows.length > 0 && (
// //               <tr className="font-semibold bg-gray-50">
// //                 <td colSpan="2" className="text-right text-sm p-2 pr-4">Total</td>
// //                 <td className="border text-sm text-center p-2">{debitTotal.toFixed(2)}</td>
// //                 <td className="border text-sm text-center p-2">{creditTotal.toFixed(2)}</td>
// //                 <td />
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>

// //         {/* Imbalance warning */}
// //         {rows.length > 0 && Math.abs(debitTotal - creditTotal) > 0.001 && (
// //           <p className="text-sm text-red-500 text-right">
// //             ⚠ Debit ({debitTotal.toFixed(2)}) ≠ Credit ({creditTotal.toFixed(2)}) — totals must match to save.
// //           </p>
// //         )}

// //         {/* Actions */}
// //         <div className="flex justify-end items-center gap-4">
// //           <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
// //             Cancel
// //           </Button>
// //          <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting || isPeriodClosed || noPeriodDefined}>
// //   {isSubmitting ? "Submitting..." : "Create"}
// // </Button>
// //         </div>
// //       </div>

// //       {/* Confirmation Modal */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// //           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
// //             <h2 className="text-xl font-bold mb-4">Confirm Voucher Submission</h2>
// //             <div className="space-y-2 text-sm">
// //               <p><strong>Entry Date:</strong> {form.entryDate}</p>
// //               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
// //               <p><strong>Description:</strong> {form.description}</p>
// //               <p><strong>GL Date:</strong> {form.glDate}</p>
// //               {billFiles.length > 0 && (
// //                 <div>
// //                   <strong>Bills ({billFiles.length}):</strong>
// //                   <ul className="list-disc pl-5 text-gray-600 mt-1">
// //                     {billFiles.map((f, i) => <li key={i}>{f.name}</li>)}
// //                   </ul>
// //                 </div>
// //               )}
// //               <p className="font-semibold mt-2">Accounts:</p>
// //               <ul className="list-disc pl-5">
// //                 <p className="font-semibold mt-2">Accounts:</p>
// //               <ul className="list-disc pl-5">
// //                 {rows.map((row, i) => (
// //     <li key={i}>
// //       {row.accountCode} — {row.particulars} —{" "}

// //       {(row.debit) > 0
// //         ? `Debit: ${row.debit}`
// //         : (row.credit) > 0
// //         ? `Credit: ${row.credit}`
// //         : null}
// //     </li>
// //   ))}
// //               </ul>
// //               </ul>
// //               <p className="font-semibold">
// //                 Total Debit: {debitTotal.toFixed(2)} | Total Credit: {creditTotal.toFixed(2)}
// //               </p>
// //             </div>
// //             <div className="flex justify-end mt-4 space-x-3">
// //               <button onClick={() => setShowModal(false)} disabled={isSubmitting}
// //                 className="px-4 py-2 rounded-lg bg-gray-300">Cancel</button>
// //               <button onClick={handleSubmit} disabled={isSubmitting}
// //                 className="px-4 py-2 rounded-lg bg-green-500 text-white">
// //                 {isSubmitting ? "Submitting..." : "Confirm"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </SectionContainer>
// //   );
// // };

// // export default JournalCreate;

// import { useState } from "react";
// import { ArrowLeft, Trash2, FileText, Receipt, ListChecks, Lock, AlertTriangle } from "lucide-react";
// import Select from "react-select";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import { SectionContainer } from "@/components/SectionContainer";
// import { Button } from "@/components/ui/button";
// import BillUploadPanel from "@/components/shared/bill-upload-panel";
// import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

// const url = import.meta.env.VITE_API_BASE_URL;

// /* ── Shared design tokens (visual only) — mirrors PaymentCreate/ReceiveCreate ── */
// const card =
//   "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
// const sectionHeader =
//   "flex items-center gap-3 px-6 py-4 border-b border-slate-100";
// const sectionIconWrap =
//   "flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";
// const sectionTitle = "text-[15px] font-semibold text-slate-800 leading-none";
// const sectionSubtitle = "text-xs text-slate-400 mt-1";
// const fieldLabel =
//   "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
// const fieldInput =
//   "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:border-slate-200 transition-all";
// const fieldInputReadOnly = `${fieldInput} bg-slate-100 text-slate-500`;

// const PeriodStatusBadge = ({ isPeriodClosed, noPeriodDefined }) => {
//   if (isPeriodClosed) {
//     return (
//       <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full">
//         <Lock size={10} /> Period Closed
//       </span>
//     );
//   }
//   if (noPeriodDefined) {
//     return (
//       <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full">
//         <AlertTriangle size={10} /> No Period
//       </span>
//     );
//   }
//   return null;
// };
// const JournalCreate = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const today = new Date().toISOString().split("T")[0];
//   const userId = useAuthUserId();

//   const [billFiles, setBillFiles] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     entryDate: today,
//     supporting: "",
//     description: "",
//     glDate: today,
//     accountId: "",
//     particular: "",
//   });

//   const { data: periodStatus } = usePeriodStatusForDate("GL", form.glDate);
//   const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
//   const noPeriodDefined = !!form.glDate && periodStatus === null;

//   // ── Accounts ─────────────────────────────────────────────────────────────────
//   const { data: accounts = [] } = useQuery({
//     queryKey: ["journalAccounts"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/gl-account-code`);
//       if (res.data.success === true) {
//         return res.data.data.map((acc) => ({
//           value: acc.ACCOUNT_ID,
//           label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
//           name: acc.ACCOUNT_NAME,
//         }));
//       }
//       return [];
//     },
//   });

//   // ── Upload bills ──────────────────────────────────────────────────────────────
//   const uploadBills = async (glMasterId) => {
//     if (!billFiles.length || !glMasterId) return;
//     await Promise.allSettled(
//       billFiles.map((file) => {
//         const fd = new FormData();
//         fd.append("doc_file", file);
//         fd.append("GLMASTERID", glMasterId);
//         return axios.post(`${url}/api/gldoc`, fd);
//       })
//     );
//     setBillFiles([]);
//   };

//   // ── Mutation ──────────────────────────────────────────────────────────────────
//   const mutation = useMutation({
//     mutationFn: async (payload) => {
//       const res = await axios.post(`${url}/api/gl-add`, payload);
//       return res.data;
//     },
//     onSuccess: async (data) => {
//       if (data.status === "success") {
//         await uploadBills(data.masterId || data.masterID || data.id);
//         toast.success("Journal Voucher created successfully!");
//         queryClient.invalidateQueries(["unpostedJournalVouchers"]);
//         navigate("/dashboard/journal-voucher");
//       } else {
//         toast.error(data.message || "Error processing voucher.");
//       }
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Server error. Please try again.");
//     },
//     onSettled: () => setShowModal(false),
//   });

//   // ── Add row: only account required, debit/credit filled in table ─────────────
//   const addRow = () => {
//     if (!form.accountId) {
//       toast.error("Please select an account.");
//       return;
//     }
//     setRows((prev) => [
//       ...prev,
//       {
//         id: Date.now() + Math.random(),
//         detail_id: null,
//         accountCode: form.accountId,
//         particulars: form.particular,
//         debit: "",
//         credit: "",
//       },
//     ]);
//     setForm((prev) => ({ ...prev, accountId: "", particular: "" }));
//   };

//   // ── Inline debit/credit — mutually exclusive ──────────────────────────────────
//   const handleRowChange = (id, field, value) => {
//     setRows((prev) =>
//       prev.map((row) =>
//         row.id !== id
//           ? row
//           : {
//               ...row,
//               [field]: value,
//               ...(field === "debit" && value ? { credit: "" } : {}),
//               ...(field === "credit" && value ? { debit: "" } : {}),
//             }
//       )
//     );
//   };

//   const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

//   const debitTotal = rows.reduce((s, r) => s + (parseFloat(r.debit) || 0), 0);
//   const creditTotal = rows.reduce((s, r) => s + (parseFloat(r.credit) || 0), 0);

//   // ── Submit ────────────────────────────────────────────────────────────────────
//   const handleSubmit = () => {
//     if (!form.entryDate || !form.glDate || rows.length === 0) {
//       toast.error("Please fill all required fields and add at least one row.");
//       return;
//     }
//     if (rows.some((row) => !row.accountCode || !row.particulars)) {
//       toast.error("Each row must have Account Code and Particular filled.");
//       return;
//     }
//     if (debitTotal !== creditTotal) {
//       toast.error("Debit and Credit totals must be equal before submission.");
//       return;
//     }
//     mutation.mutate({
//       trans_date: form.entryDate,
//       GL_ENTRY_DATE: form.glDate,
//       receive_desc: form.description,
//       supporting: String(form.supporting || "0"),
//       entry_by: userId,
//       details: rows.map((r) => ({
//         code: `${r.accountCode}##${r.particulars}`,
//         debit: parseFloat(r.debit) || 0,
//         credit: parseFloat(r.credit) || 0,
//         description: r.particulars,
//       })),
//     });
//   };

//   const isSubmitting = mutation.isPending;

//   return (
//     <SectionContainer>
//       <div className="flex flex-col min-h-full">
//         <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
//           {/* Header */}
//           <div className="flex items-center justify-between flex-wrap gap-3">
//             <div>
//               <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
//                 <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
//                 General Ledger
//               </div>
//               <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                 Create Journal Voucher
//               </h2>
//               <p className="text-sm text-slate-500 mt-0.5">
//                 Record a manual debit/credit journal entry
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 className="border-slate-200 text-slate-700 hover:bg-slate-50"
//                 onClick={() => navigate("/dashboard/journal-voucher")}
//               >
//                 <ArrowLeft size={16} className="mr-1.5" /> Back
//               </Button>
//             </div>
//           </div>

//           {/* ── Section: Voucher Details ─────────────────────────────────────── */}
//           <div className={card}>
//             <div className={sectionHeader}>
//               <div className={sectionIconWrap}>
//                 <FileText size={16} />
//               </div>
//               <div>
//                 <h3 className={sectionTitle}>Voucher Details</h3>
//                 <p className={sectionSubtitle}>References and posting dates</p>
//               </div>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
//               {/* Bill upload spans first column, full height */}
//               <div className="md:row-span-2">
//                 <span className={fieldLabel}>Bill Attachments</span>
//                 <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:border-slate-400 transition-colors">
//                   <BillUploadPanel
//                     files={billFiles}
//                     onChange={setBillFiles}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className={fieldLabel}>Entry Date</label>
//                 <input
//                   type="date"
//                   value={form.entryDate}
//                   onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
//                   disabled={isSubmitting}
//                   className={fieldInput}
//                 />
//               </div>

//               <div>
//                 <label className={fieldLabel}>No. of Supporting</label>
//                 <input
//                   type="number"
//                   value={form.supporting}
//                   onChange={(e) => setForm({ ...form, supporting: e.target.value })}
//                   disabled={isSubmitting}
//                   className={fieldInput}
//                 />
//               </div>

//            <div>
//   <div className="flex items-center justify-between mb-1.5">
//     <label className={`${fieldLabel} mb-0`}>GL Date</label>
//     <PeriodStatusBadge
//       isPeriodClosed={isPeriodClosed}
//       noPeriodDefined={noPeriodDefined}
//     />
//   </div>
//   <input
//     type="date"
//     value={form.glDate}
//     onChange={(e) => setForm({ ...form, glDate: e.target.value })}
//     disabled={isSubmitting}
//     className={`${fieldInput} ${
//       isPeriodClosed
//         ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-500/10"
//         : noPeriodDefined
//           ? "border-amber-300 bg-amber-50/40 focus:border-amber-400 focus:ring-amber-500/10"
//           : ""
//     }`}
//   />
// </div>
//             </div>

//             <div className="px-6 pb-6">
//               <label className={fieldLabel}>Description</label>
//               <textarea
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//                 disabled={isSubmitting}
//                 rows={3}
//                 placeholder="Add a note about this voucher..."
//                 className={`${fieldInput} resize-none`}
//               />
//             </div>
//           </div>

//           {/* ── Section: Account Distribution ────────────────────────────────── */}
//           <div className={card}>
//             <div className={sectionHeader}>
//               <div className={sectionIconWrap}>
//                 <Receipt size={16} />
//               </div>
//               <div>
//                 <h3 className={sectionTitle}>Account Distribution</h3>
//                 <p className={sectionSubtitle}>
//                   Add accounts, then fill in debit or credit inline
//                 </p>
//               </div>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr_auto] gap-4 items-end">
//               <div>
//                 <label className={fieldLabel}>Account ID</label>
//                 <Select
//                   options={accounts}
//                   value={accounts.find((a) => a.value === form.accountId) || null}
//                   onChange={(s) =>
//                     setForm({
//                       ...form,
//                       accountId: s ? s.value : "",
//                       particular: s ? s.name : "",
//                     })
//                   }
//                   placeholder="Search account..."
//                   isClearable
//                   isSearchable
//                   isDisabled={isSubmitting}
//                   menuPortalTarget={document.body}
//                   styles={{
//                     control: (b, state) => ({
//                       ...b,
//                       borderColor: state.isFocused ? "#818cf8" : "#e2e8f0",
//                       borderRadius: "0.5rem",
//                       minHeight: "38px",
//                       backgroundColor: state.isFocused ? "#fff" : "#f8fafc",
//                       boxShadow: state.isFocused
//                         ? "0 0 0 4px rgba(99,102,241,0.1)"
//                         : "none",
//                       "&:hover": { borderColor: "#cbd5e1" },
//                     }),
//                     menuPortal: (b) => ({ ...b, zIndex: 9999 }),
//                     menu: (b) => ({
//                       ...b,
//                       backgroundColor: "white",
//                       border: "1px solid #e2e8f0",
//                       boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
//                     }),
//                   }}
//                 />
//               </div>
//               <div>
//                 <label className={fieldLabel}>Particular</label>
//                 <input
//                   type="text"
//                   value={form.particular}
//                   readOnly
//                   className={fieldInputReadOnly}
//                 />
//               </div>
//               <div>
//                 <Button
//                   type="button"
//                   onClick={addRow}
//                    disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
//                   className="cursor-pointer text-white px-4 py-2 rounded-lg flex items-center font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
//                 >
//                   <span className="mr-1.5 font-bold text-base leading-none">+</span>
//                   Add
//                 </Button>
//               </div>
//             </div>

//             {/* Rows table */}
//             <div className="px-6 pb-6 overflow-x-auto">
//               <table className="w-full border-collapse text-sm">
//                 <thead>
//                   <tr className="bg-slate-50">
//                     {[
//                       { label: "Account Code", align: "text-left" },
//                       { label: "Particulars", align: "text-left" },
//                       { label: "Debit", align: "text-right" },
//                       { label: "Credit", align: "text-right" },
//                       { label: "", align: "text-center" },
//                     ].map(({ label, align }) => (
//                       <th
//                         key={label || "actions"}
//                         className={`px-4 py-2.5 ${align} font-semibold text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200 first:rounded-l-lg last:rounded-r-lg`}
//                       >
//                         {label}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.length === 0 && (
//                     <tr>
//                       <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
//                         No rows yet — select an account above and click Add.
//                       </td>
//                     </tr>
//                   )}

//                   {rows.map((row, i) => (
//                     <tr
//                       key={row.id}
//                       className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${
//                         i % 2 === 1 ? "bg-slate-50/50" : ""
//                       }`}
//                     >
//                       <td className="px-4 py-2.5 text-slate-700 font-medium">
//                         {row.accountCode}
//                       </td>
//                       <td className="px-4 py-2.5 text-slate-600">{row.particulars}</td>

//                       {/* Debit — locked (shows —) when credit has a value */}
//                       <td className="px-2 py-1.5">
//                         {parseFloat(row.credit) > 0 ? (
//                           <span className="block w-full text-center text-slate-300 text-sm select-none">
//                             —
//                           </span>
//                         ) : (
//                           <input
//                             type="number"
//                             value={row.debit}
//                             onChange={(e) => handleRowChange(row.id, "debit", e.target.value)}
//                             disabled={isSubmitting}
//                             placeholder="0"
//                             className="w-full border border-transparent rounded-md px-2 py-1.5 text-sm bg-transparent text-slate-700 text-right tabular-nums hover:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all"
//                           />
//                         )}
//                       </td>

//                       {/* Credit — locked (shows —) when debit has a value */}
//                       <td className="px-2 py-1.5">
//                         {parseFloat(row.debit) > 0 ? (
//                           <span className="block w-full text-center text-slate-300 text-sm select-none">
//                             —
//                           </span>
//                         ) : (
//                           <input
//                             type="number"
//                             value={row.credit}
//                             onChange={(e) => handleRowChange(row.id, "credit", e.target.value)}
//                             disabled={isSubmitting}
//                             placeholder="0"
//                             className="w-full border border-transparent rounded-md px-2 py-1.5 text-sm bg-transparent text-slate-700 text-right tabular-nums hover:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all"
//                           />
//                         )}
//                       </td>

//                       <td className="px-4 py-2.5 text-center">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => removeRow(row.id)}
//                           disabled={isSubmitting}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}

//                   {rows.length > 0 && (
//                     <tr className="font-semibold bg-slate-50">
//                       <td colSpan="2" className="px-4 py-2.5 text-right text-sm text-slate-800">
//                         Total
//                       </td>
//                       <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
//                         {debitTotal.toFixed(2)}
//                       </td>
//                       <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
//                         {creditTotal.toFixed(2)}
//                       </td>
//                       <td />
//                     </tr>
//                   )}
//                 </tbody>
//               </table>

//               {/* Imbalance warning */}
//               {rows.length > 0 && Math.abs(debitTotal - creditTotal) > 0.001 && (
//                 <p className="text-xs text-red-500 text-right mt-2">
//                   ⚠ Debit ({debitTotal.toFixed(2)}) ≠ Credit ({creditTotal.toFixed(2)}) — totals
//                   must match to save.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Sticky footer action bar — sticks to the bottom of THIS content
//             area (which already excludes the sidebar), never the full
//             viewport, so it never overlaps the sidebar. */}
//         <div className="sticky bottom-0 z-40 w-full mt-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
//           <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
//             <span className="text-xs text-slate-400 font-medium">
//               Voucher ID · auto-generated
//             </span>
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="outline"
//                 className="border-slate-200 text-slate-700 hover:bg-slate-50"
//                 onClick={() => navigate(-1)}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => setShowModal(true)}
//                 disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
//                 className="text-white shadow-sm"
//               >
//                 {isSubmitting ? "Submitting..." : "Create Voucher"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Confirmation Modal ── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
//               <ListChecks size={18} className="text-indigo-600" />
//               <h2 className="text-base font-bold text-gray-900">
//                 Confirm Voucher Submission
//               </h2>
//             </div>
//             <div className="px-6 py-5 space-y-2 text-sm">
//               <p>
//                 <strong className="text-gray-700">Entry Date:</strong>{" "}
//                 <span className="text-gray-600">{form.entryDate}</span>
//               </p>
//               <p>
//                 <strong className="text-gray-700">No. of Supporting:</strong>{" "}
//                 <span className="text-gray-600">{form.supporting}</span>
//               </p>
//               <p>
//                 <strong className="text-gray-700">Description:</strong>{" "}
//                 <span className="text-gray-600">{form.description}</span>
//               </p>
//               <p>
//                 <strong className="text-gray-700">GL Date:</strong>{" "}
//                 <span className="text-gray-600">{form.glDate}</span>
//               </p>
//               {billFiles.length > 0 && (
//                 <div>
//                   <strong className="text-gray-700">Bills ({billFiles.length}):</strong>
//                   <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
//                     {billFiles.map((f, i) => (
//                       <li key={i}>{f.name}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <h3 className="font-semibold mt-3 text-gray-800">Accounts</h3>
//               <ul className="list-disc pl-5 text-gray-600">
//                 {rows.map((row, i) => (
//                   <li key={i}>
//                     {row.accountCode} — {row.particulars} —{" "}
//                     {row.debit > 0
//                       ? `Debit: ${row.debit}`
//                       : row.credit > 0
//                         ? `Credit: ${row.credit}`
//                         : null}
//                   </li>
//                 ))}
//               </ul>
//               <p className="font-semibold mt-2 text-gray-900">
//                 Total Debit: {debitTotal.toFixed(2)} | Total Credit: {creditTotal.toFixed(2)}
//               </p>
//             </div>
//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
//               <button
//                 onClick={() => setShowModal(false)}
//                 disabled={isSubmitting}
//                 className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
//               >
//                 {isSubmitting ? "Submitting..." : "Confirm"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </SectionContainer>
//   );
// };

// export default JournalCreate;
import { useState } from "react";
import { ArrowLeft, Trash2, FileText, Receipt, ListChecks, Lock, AlertTriangle } from "lucide-react";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { SectionContainer } from "@/components/SectionContainer";
import { Button } from "@/components/ui/button";
import BillUploadPanel from "@/components/shared/bill-upload-panel";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";
import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

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
const fieldInputReadOnly = `${fieldInput} bg-slate-100 text-slate-500`;

const PeriodStatusBadge = ({ isPeriodClosed, noPeriodDefined }) => {
  if (isPeriodClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full">
        <Lock size={10} /> Period Closed
      </span>
    );
  }
  if (noPeriodDefined) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full">
        <AlertTriangle size={10} /> No Period
      </span>
    );
  }
  return null;
};
const JournalCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const userId = useAuthUserId();

  const [billFiles, setBillFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    entryDate: today,
    supporting: "",
    description: "",
    glDate: today,
    accountId: "",
    particular: "",
    type: "MANUAL", // ← Reversal Type: "MANUAL" (default) or "REVERSE"
  });

  const { data: periodStatus } = usePeriodStatusForDate("GL", form.glDate);
  const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
  const noPeriodDefined = !!form.glDate && periodStatus === null;

  // ── Accounts ─────────────────────────────────────────────────────────────────
  const { data: accounts = [] } = useQuery({
    queryKey: ["journalAccounts"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gl-account-code`);
      if (res.data.success === true) {
        return res.data.data.map((acc) => ({
          value: acc.ACCOUNT_ID,
          label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
          name: acc.ACCOUNT_NAME,
        }));
      }
      return [];
    },
  });

  // ── Upload bills ──────────────────────────────────────────────────────────────
  const uploadBills = async (glMasterId) => {
    if (!billFiles.length || !glMasterId) return;
    await Promise.allSettled(
      billFiles.map((file) => {
        const fd = new FormData();
        fd.append("doc_file", file);
        fd.append("GLMASTERID", glMasterId);
        return axios.post(`${url}/api/gldoc`, fd);
      })
    );
    setBillFiles([]);
  };

  // ── Mutation ──────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`${url}/api/gl-add`, payload);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        await uploadBills(data.masterId || data.masterID || data.id);
        toast.success("Journal Voucher created successfully!");
        queryClient.invalidateQueries(["unpostedJournalVouchers"]);
        navigate("/dashboard/journal-voucher");
      } else {
        toast.error(data.message || "Error processing voucher.");
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Server error. Please try again.");
    },
    onSettled: () => setShowModal(false),
  });

  // ── Add row: only account required, debit/credit filled in table ─────────────
  const addRow = () => {
    if (!form.accountId) {
      toast.error("Please select an account.");
      return;
    }
    setRows((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        detail_id: null,
        accountCode: form.accountId,
        particulars: form.particular,
        debit: "",
        credit: "",
      },
    ]);
    setForm((prev) => ({ ...prev, accountId: "", particular: "" }));
  };

  // ── Inline debit/credit — mutually exclusive ──────────────────────────────────
  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id !== id
          ? row
          : {
              ...row,
              [field]: value,
              ...(field === "debit" && value ? { credit: "" } : {}),
              ...(field === "credit" && value ? { debit: "" } : {}),
            }
      )
    );
  };

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const debitTotal = rows.reduce((s, r) => s + (parseFloat(r.debit) || 0), 0);
  const creditTotal = rows.reduce((s, r) => s + (parseFloat(r.credit) || 0), 0);

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.entryDate || !form.glDate || rows.length === 0) {
      toast.error("Please fill all required fields and add at least one row.");
      return;
    }
    if (rows.some((row) => !row.accountCode || !row.particulars)) {
      toast.error("Each row must have Account Code and Particular filled.");
      return;
    }
    if (debitTotal !== creditTotal) {
      toast.error("Debit and Credit totals must be equal before submission.");
      return;
    }
    mutation.mutate({
      trans_date: form.entryDate,
      GL_ENTRY_DATE: form.glDate,
      receive_desc: form.description,
      supporting: String(form.supporting || "0"),
      entry_by: userId,
      type: form.type, // ← "MANUAL" or "REVERSE"
      details: rows.map((r) => ({
        code: `${r.accountCode}##${r.particulars}`,
        debit: parseFloat(r.debit) || 0,
        credit: parseFloat(r.credit) || 0,
        description: r.particulars,
      })),
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
                General Ledger
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Create Journal Voucher
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Record a manual debit/credit journal entry
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate("/dashboard/journal-voucher")}
              >
                <ArrowLeft size={16} className="mr-1.5" /> Back
              </Button>
            </div>
          </div>

          {/* ── Section: Voucher Details ─────────────────────────────────────── */}
          <div className={card}>
            <div className={sectionHeader}>
              <div className={sectionIconWrap}>
                <FileText size={16} />
              </div>
              <div>
                <h3 className={sectionTitle}>Voucher Details</h3>
                <p className={sectionSubtitle}>References and posting dates</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              {/* Bill upload spans first column, full height */}
              <div className="md:row-span-2">
                <span className={fieldLabel}>Bill Attachments</span>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:border-slate-400 transition-colors">
                  <BillUploadPanel
                    files={billFiles}
                    onChange={setBillFiles}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* <div>
                <label className={fieldLabel}>Entry Date</label>
                <input
                  type="date"
                  value={form.entryDate}
                  onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                />
              </div> */}
              <div>
  <label className={fieldLabel}>Entry Date</label>
  <div className="relative">
    <input
      type="date"
      value={form.entryDate}
      disabled
      className={`${fieldInput} cursor-not-allowed bg-slate-100 opacity-75`}
    />
    <div className="absolute inset-0 cursor-not-allowed" />
  </div>
  <input type="hidden" name="entryDate" value={form.entryDate} />
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${fieldLabel} mb-0`}>GL Date</label>
                  <PeriodStatusBadge
                    isPeriodClosed={isPeriodClosed}
                    noPeriodDefined={noPeriodDefined}
                  />
                </div>
                <input
                  type="date"
                  value={form.glDate}
                  onChange={(e) => setForm({ ...form, glDate: e.target.value })}
                  disabled={isSubmitting}
                  className={`${fieldInput} ${
                    isPeriodClosed
                      ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-500/10"
                      : noPeriodDefined
                        ? "border-amber-300 bg-amber-50/40 focus:border-amber-400 focus:ring-amber-500/10"
                        : ""
                  }`}
                />
              </div>

              {/* ── Entry Type (Reversal) — Manual (default) or Reverse ─────── */}
              <div>
                <label className={fieldLabel}>Entry Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                >
                  <option value="MANUAL">Manual</option>
                  <option value="REVERSE">Reverse</option>
                  <option value="AUTO">Auto</option>
                </select>
              </div>
            </div>

            <div className="px-6 pb-6">
              <label className={fieldLabel}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={isSubmitting}
                rows={3}
                placeholder="Add a note about this voucher..."
                className={`${fieldInput} resize-none`}
              />
            </div>
          </div>

          {/* ── Section: Account Distribution ────────────────────────────────── */}
          <div className={card}>
            <div className={sectionHeader}>
              <div className={sectionIconWrap}>
                <Receipt size={16} />
              </div>
              <div>
                <h3 className={sectionTitle}>Account Distribution</h3>
                <p className={sectionSubtitle}>
                  Add accounts, then fill in debit or credit inline
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr_auto] gap-4 items-end">
              <div>
                <label className={fieldLabel}>Account ID</label>
                <Select
                  options={accounts}
                  value={accounts.find((a) => a.value === form.accountId) || null}
                  onChange={(s) =>
                    setForm({
                      ...form,
                      accountId: s ? s.value : "",
                      particular: s ? s.name : "",
                    })
                  }
                  placeholder="Search account..."
                  isClearable
                  isSearchable
                  isDisabled={isSubmitting}
                  menuPortalTarget={document.body}
                  styles={{
                    control: (b, state) => ({
                      ...b,
                      borderColor: state.isFocused ? "#818cf8" : "#e2e8f0",
                      borderRadius: "0.5rem",
                      minHeight: "38px",
                      backgroundColor: state.isFocused ? "#fff" : "#f8fafc",
                      boxShadow: state.isFocused
                        ? "0 0 0 4px rgba(99,102,241,0.1)"
                        : "none",
                      "&:hover": { borderColor: "#cbd5e1" },
                    }),
                    menuPortal: (b) => ({ ...b, zIndex: 9999 }),
                    menu: (b) => ({
                      ...b,
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
                    }),
                  }}
                />
              </div>
              <div>
                <label className={fieldLabel}>Particular</label>
                <input
                  type="text"
                  value={form.particular}
                  readOnly
                  className={fieldInputReadOnly}
                />
              </div>
              <div>
                <Button
                  type="button"
                  onClick={addRow}
                   disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
                  className="cursor-pointer text-white px-4 py-2 rounded-lg flex items-center font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  <span className="mr-1.5 font-bold text-base leading-none">+</span>
                  Add
                </Button>
              </div>
            </div>

            {/* Rows table */}
            <div className="px-6 pb-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      { label: "Account Code", align: "text-left" },
                      { label: "Particulars", align: "text-left" },
                      { label: "Debit", align: "text-right" },
                      { label: "Credit", align: "text-right" },
                      { label: "", align: "text-center" },
                    ].map(({ label, align }) => (
                      <th
                        key={label || "actions"}
                        className={`px-4 py-2.5 ${align} font-semibold text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200 first:rounded-l-lg last:rounded-r-lg`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                        No rows yet — select an account above and click Add.
                      </td>
                    </tr>
                  )}

                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${
                        i % 2 === 1 ? "bg-slate-50/50" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 text-slate-700 font-medium">
                        {row.accountCode}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{row.particulars}</td>

                      {/* Debit — locked (shows —) when credit has a value */}
                      <td className="px-2 py-1.5">
                        {parseFloat(row.credit) > 0 ? (
                          <span className="block w-full text-center text-slate-300 text-sm select-none">
                            —
                          </span>
                        ) : (
                          <input
                            type="number"
                            value={row.debit}
                            onChange={(e) => handleRowChange(row.id, "debit", e.target.value)}
                            disabled={isSubmitting}
                            placeholder="0"
                            className="w-full border border-transparent rounded-md px-2 py-1.5 text-sm bg-transparent text-slate-700 text-right tabular-nums hover:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all"
                          />
                        )}
                      </td>

                      {/* Credit — locked (shows —) when debit has a value */}
                      <td className="px-2 py-1.5">
                        {parseFloat(row.debit) > 0 ? (
                          <span className="block w-full text-center text-slate-300 text-sm select-none">
                            —
                          </span>
                        ) : (
                          <input
                            type="number"
                            value={row.credit}
                            onChange={(e) => handleRowChange(row.id, "credit", e.target.value)}
                            disabled={isSubmitting}
                            placeholder="0"
                            className="w-full border border-transparent rounded-md px-2 py-1.5 text-sm bg-transparent text-slate-700 text-right tabular-nums hover:border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all"
                          />
                        )}
                      </td>

                      <td className="px-4 py-2.5 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(row.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {rows.length > 0 && (
                    <tr className="font-semibold bg-slate-50">
                      <td colSpan="2" className="px-4 py-2.5 text-right text-sm text-slate-800">
                        Total
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
                        {debitTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
                        {creditTotal.toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Imbalance warning */}
              {rows.length > 0 && Math.abs(debitTotal - creditTotal) > 0.001 && (
                <p className="text-xs text-red-500 text-right mt-2">
                  ⚠ Debit ({debitTotal.toFixed(2)}) ≠ Credit ({creditTotal.toFixed(2)}) — totals
                  must match to save.
                </p>
              )}
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
                disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
                className="text-white shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Create Voucher"}
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
              <h2 className="text-base font-bold text-gray-900">
                Confirm Voucher Submission
              </h2>
            </div>
            <div className="px-6 py-5 space-y-2 text-sm">
              <p>
                <strong className="text-gray-700">Entry Date:</strong>{" "}
                <span className="text-gray-600">{form.entryDate}</span>
              </p>
              <p>
                <strong className="text-gray-700">No. of Supporting:</strong>{" "}
                <span className="text-gray-600">{form.supporting}</span>
              </p>
              <p>
                <strong className="text-gray-700">Description:</strong>{" "}
                <span className="text-gray-600">{form.description}</span>
              </p>
              <p>
                <strong className="text-gray-700">GL Date:</strong>{" "}
                <span className="text-gray-600">{form.glDate}</span>
              </p>
              <p>
                <strong className="text-gray-700">Entry Type:</strong>{" "}
                <span className="text-gray-600">{form.type}</span>
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
              <h3 className="font-semibold mt-3 text-gray-800">Accounts</h3>
              <ul className="list-disc pl-5 text-gray-600">
                {rows.map((row, i) => (
                  <li key={i}>
                    {row.accountCode} — {row.particulars} —{" "}
                    {row.debit > 0
                      ? `Debit: ${row.debit}`
                      : row.credit > 0
                        ? `Credit: ${row.credit}`
                        : null}
                  </li>
                ))}
              </ul>
              <p className="font-semibold mt-2 text-gray-900">
                Total Debit: {debitTotal.toFixed(2)} | Total Credit: {creditTotal.toFixed(2)}
              </p>
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

export default JournalCreate;