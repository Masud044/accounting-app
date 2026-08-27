// import { useState, useEffect  } from "react";

// import { ArrowLeft, Trash2, Users, X } from "lucide-react";
// import Select from "react-select";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// import { SectionContainer } from "@/components/SectionContainer";
// import { ReceiveService } from "@/api/AccontingApi";
// import { Button } from "@/components/ui/button";
// import BillUploadPanel from "@/components/shared/bill-upload-panel";
// import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";


// const url = import.meta.env.VITE_API_BASE_URL ;

// const invoiceLockUrl = (hid) => `${url}/api/sal-invoice/${hid}/lock`;

// // ── Customer default form ────────────────────────────────────────────────────
// const customerDefault = {
//   customerName: "", contactPerson: "", phone: "", mobile: "",
//   email: "", address: "", remarks: "", status: "1",
// };

// const ReceiveCreate = () => {
//   const navigate    = useNavigate();
//   const queryClient = useQueryClient();
//   const today       = new Date().toISOString().split("T")[0];
//   const location = useLocation();
//   const userId = useAuthUserId();

//   // ── Bill files ───────────────────────────────────────────────────────────────
//   const [billFiles, setBillFiles] = useState([]);

//   const [rows, setRows] = useState([
//     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
//   ]);

//   const [showModal,        setShowModal]        = useState(false);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [customerForm,      setCustomerForm]      = useState(customerDefault);
//   const [customerErrors,    setCustomerErrors]    = useState({});

//   const [form, setForm] = useState({
//     entryDate: today, invoiceNo: "", supporting: "", description: "",
//     customer: "", glDate: today, ReceiveCode: "",
//     accountId: "", particular: "", amount: "", totalAmount: 0, inv_type: "", sale_invoice_no: "", 
//   });
//   const { data: periodStatus } = usePeriodStatusForDate("AR", form.glDate);
// const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
// const noPeriodDefined = !!form.glDate && periodStatus === null;

//   // ── Queries ──────────────────────────────────────────────────────────────────
//   const { data: customers = [] } = useQuery({
//     queryKey: ["customers"],
//     queryFn: async () => (await axios.get(`${url}/api/customer-type`)).data.data || [],
//   });

//   const { data: ReceiveCodes = [] } = useQuery({
//     queryKey: ["ReceiveCodes"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/receive-code`);
//       return res.data.success ? res.data.data || [] : [];
//     },
//   });

//   const { data: invTypes = [] } = useQuery({
//   queryKey: ["invTypes"],
//   queryFn: async () => {
//     const res = await axios.get(`${url}/api/inv-type`); 
//     return res.data.data || [];
//   },
// });

//   const { data: accounts = [] } = useQuery({
//     queryKey: ["accounts"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/receive-account-code`);
//       return res.data.success === true
//         ? res.data.data.map((acc) => ({
//             value: acc.ACCOUNT_ID,
//             label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
//             name: acc.ACCOUNT_NAME,
//           }))
//         : [];
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

//   // ── Voucher Mutation ─────────────────────────────────────────────────────────
//   // const mutation = useMutation({
//   //   mutationFn: async (payload) => (await ReceiveService.insert(payload)).data,
//   //   onSuccess: async (data) => {
//   //     if (data.status === "success") {
//   //       await uploadBills(data.masterID);
//   //       toast.success("Voucher created successfully!");
//   //       setBillFiles([]);
//   //       setForm({
//   //         entryDate: today, invoiceNo: "", supporting: "", description: "",
//   //         customer: "", glDate: today, ReceiveCode: "",
//   //         accountId: "", particular: "", amount: "", totalAmount: 0, inv_type: "",sale_invoice_no: "",  
//   //       });
//   //       setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
//   //       queryClient.invalidateQueries(["unpostedVouchers"]);
//   //       navigate("/dashboard/receive-voucher");
//   //     } else {
//   //       toast.error("Error processing voucher");
//   //     }
//   //   },
//   //   onError:   () => toast.error("Error submitting voucher. Please try again."),
//   //   onSettled: () => setShowModal(false),
//   // });

//   const mutation = useMutation({
//   mutationFn: async (payload) => (await ReceiveService.insert(payload)).data,
//   onSuccess: async (data) => {
//     if (data.status === "success") {
//       await uploadBills(data.masterID);

//       // ✅ Sale Invoice theke ashle, oi invoice-take lock kore dao
//       const invoiceHid = location.state?.invoiceHid;
//       if (invoiceHid) {
//         try {
//           await axios.put(invoiceLockUrl(invoiceHid));
//         } catch (err) {
//           console.error("Failed to lock invoice:", err);
//         }
//       }

//       toast.success("Voucher created successfully!");
//       setBillFiles([]);
//       setForm({
//         entryDate: today, invoiceNo: "", supporting: "", description: "",
//         customer: "", glDate: today, ReceiveCode: "",
//         accountId: "", particular: "", amount: "", totalAmount: 0, inv_type: "", sale_invoice_no: "",
//       });
//       setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
//       queryClient.invalidateQueries(["unpostedVouchers"]);
//       queryClient.invalidateQueries(["salInvoice", "list"]);   // ← invoice list o invalidate koro
//       navigate("/dashboard/receive-voucher");
//     } else {
//       toast.error("Error processing voucher");
//     }
//   },
//   onError:   () => toast.error("Error submitting voucher. Please try again."),
//   onSettled: () => setShowModal(false),
// });

//   // ── Customer Mutation ────────────────────────────────────────────────────────
//   const customerMutation = useMutation({
//     mutationFn: (data) =>
//       axios.post(`${url}/api/customer`, {
//         CUSTOMER_NAME:  data.customerName,
//         CONTACT_PERSON: data.contactPerson || null,
//         PHONE:          data.phone         || null,
//         MOBILE:         data.mobile        || null,
//         EMAIL:          data.email         || null,
//         ADDRESS:        data.address       || null,
//         REMARKS:        data.remarks       || null,
//         STATUS:         Number(data.status),
//         ENTRY_BY: null, PASSWORD: null, ORG_ID: null, DUE: null, FAX: null,
//       }),
//     onSuccess: () => {
//       toast.success("Customer created successfully!");
//       queryClient.invalidateQueries(["customers"]);
//       setCustomerForm(customerDefault);
//       setCustomerErrors({});
//       setShowCustomerModal(false);
//     },
//     onError: (err) =>
//       toast.error(err?.response?.data?.message || "Failed to create customer."),
//   });

//   // ── Customer form validation ─────────────────────────────────────────────────
//   const validateCustomer = () => {
//     const errs = {};
//     if (!customerForm.customerName.trim()) errs.customerName = "Customer name is required";
//     if (customerForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email))
//       errs.email = "Invalid email address";
//     setCustomerErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleCustomerSubmit = (e) => {
//     e.preventDefault();
//     if (!validateCustomer()) return;
//     customerMutation.mutate(customerForm);
//   };

//   const handleCloseCustomerModal = () => {
//     setCustomerForm(customerDefault);
//     setCustomerErrors({});
//     setShowCustomerModal(false);
//   };

//   // ── Row handlers ─────────────────────────────────────────────────────────────
//   const addRow = () => {
//     if (!form.accountId || !form.amount) return;
//     const newRow = {
//       id: Date.now(), accountCode: form.accountId,
//       particulars: form.particular, amount: parseFloat(form.amount),
//     };
//     const updated = rows.length === 1 && rows[0].id === "dummy" ? [newRow] : [...rows, newRow];
//     setRows(updated);
//     setForm({
//       ...form, accountId: "", particular: "", amount: "",
//       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
//     });
//   };

//   const removeRow = (id) => {
//     const updated = rows.filter((r) => r.id !== id);
//     setRows(updated);
//     setForm({ ...form, totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0) });
//   };

//   const updateRow = (id, field, value) => {
//     setRows((prev) => {
//       const updated = prev.map((r) =>
//         r.id === id ? { ...r, [field]: value } : r
//       );
//       setForm((f) => ({
//         ...f,
//         totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
//       }));
//       return updated;
//     });
//   };

//   // ── Submit ───────────────────────────────────────────────────────────────────
//   const handleSubmit = () => {
//     if (
//       !form.entryDate || !form.glDate || !form.description ||
//       !form.ReceiveCode || !form.customer ||
//       rows.length === 0 || rows[0].id === "dummy"
//     ) {
//       toast.error("Please fill all required fields and add at least one row.");
//       return;
//     }
//     if (rows.some((r) => !r.accountCode || !r.particulars)) {
//       toast.error("Each row must have Account Code and Particular filled.");
//       return;
//     }
//     mutation.mutate({
//       trans_date:   form.entryDate,
//       gl_date:      form.glDate,
//       receive_desc: form.description,
//       supporting:   String(form.supporting),
//       receive:      form.ReceiveCode,
//       supplierid:   String(form.customer),
//       totalAmount:  Number(form.totalAmount),
//       accountID:    rows.map((r) => r.accountCode),
//       amount2:      rows.map((r) => Number(r.amount || 0)),
//       inv_type: form.inv_type ? Number(form.inv_type) : null,
//        sale_invoice_no: form.sale_invoice_no ? Number(form.sale_invoice_no) : null, 
//        entry_by: userId,
//     });
//   };

//   // ── Prefill from Edit Sale Invoice's "Receive Voucher" button ───────────────
//   useEffect(() => {
//     const incoming = location.state;
//     if (!incoming) return;

//     setForm((f) => ({
//       ...f,
//       customer:   incoming.customer ? String(incoming.customer) : f.customer,
//       entryDate:  incoming.invoiceDate || f.entryDate,
//       glDate:     incoming.invoiceDate || f.glDate,
//       description: incoming.description || f.description,
//       invoiceNo:   incoming.invoiceNo || f.invoiceNo,
//       sale_invoice_no: incoming.saleInvoiceNo ? String(incoming.saleInvoiceNo) : f.sale_invoice_no, 
//     }));

//  if (incoming.rows && incoming.rows.length > 0) {
//   const mappedRows = incoming.rows.map((r, i) => ({
//     id: Date.now() + i,
//     accountCode: "4030010000",
//     particulars: r.particulars || "",
//     amount: Math.round(Number(r.amount || 0) * 100) / 100,   // ← round যোগ করো
//   }));
//   setRows(mappedRows);
//   setForm((f) => ({
//     ...f,
//     totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
//   }));
// }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Auto-select "Egg" type when coming from Sale Invoice ────────────────────
//   useEffect(() => {
//     if (!location.state) return;      // sale invoice থেকে না আসলে skip
//     if (!invTypes.length) return;     // invTypes এখনো load হয়নি
//     if (form.inv_type) return;        // আগে থেকেই সেট থাকলে overwrite না

//     const eggType = invTypes.find(
//       (t) => String(t.DESCRIPTIO || "").trim().toLowerCase() === "egg"
//     );
//     if (eggType) {
//       setForm((f) => ({ ...f, inv_type: String(eggType.ID) }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [invTypes, location.state]);

//   // ── Auto-select "Cash at Bank (Chicken)" receive code when coming from Sale Invoice ──
//   useEffect(() => {
//     if (!location.state) return;
//     if (!ReceiveCodes.length) return;
//     if (form.ReceiveCode) return;

//     const cashInBank = ReceiveCodes.find(
//       (c) => String(c.ACCOUNT_NAME || "").trim().toLowerCase() === "cash at bank (chicken)"
//     );
//     if (cashInBank) {
//       setForm((f) => ({ ...f, ReceiveCode: cashInBank.ACCOUNT_ID }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ReceiveCodes, location.state]);

//   const isSubmitting       = mutation.isPending;
//   const isCustomerSaving   = customerMutation.isPending;

//   // ── Shared input class ───────────────────────────────────────────────────────
//   const inputCls = "w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400";
//   const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
//   const errCls   = "text-xs text-red-500 mt-0.5";

//   // ── UI ───────────────────────────────────────────────────────────────────────
//   return (
//     <SectionContainer>
//       <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">

//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="font-semibold text-sm text-gray-800">Create Receive Voucher</h2>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => setShowCustomerModal(true)}>
//               <Users size={15} className="mr-1" /> + Customer
//             </Button>
//             <Button variant="outline" onClick={() => navigate("/dashboard/receive-voucher")}>
//               <ArrowLeft size={16} className="mr-2" /> Back
//             </Button>
//           </div>
//         </div>

//         {/* Top grid */}
//         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 bg-white rounded-lg">

//           {/* Bill Upload */}
//           <div className="border rounded-lg p-3 bg-gray-50">
//             <BillUploadPanel files={billFiles} onChange={setBillFiles} disabled={isSubmitting} />
//           </div>

//           {/* Customer */}
//           <div>
//             <div className="grid grid-cols-3 px-3 items-center py-3">
//               <label className="font-bold text-sm text-gray-800">Customer</label>
//               <select
//                 value={form.customer}
//                 onChange={(e) => setForm({ ...form, customer: e.target.value })}
//                 disabled={isSubmitting}
//                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
//               >
//                 <option value="">Select customer</option>
//                 {customers.map((c) => (
//                   <option key={c.CUSTOMER_ID} value={String(c.CUSTOMER_ID)}>{c.CUSTOMER_NAME}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Dates / Invoice / Supporting / GL Date / Receive Code / Total */}
//           <div>
//             {[
//               { label: "Entry Date",        type: "date",   key: "entryDate",  onChange: (v) => setForm({ ...form, entryDate: v }) },
//               { label: "Invoice No",         type: "text",   key: "invoiceNo",  readOnly: true },
//               { label: "Sale Invoice No",   type: "text",   key: "sale_invoice_no",  readOnly: true },
//               { label: "No. of Supporting",  type: "number", key: "supporting", onChange: (v) => setForm({ ...form, supporting: v }) },
//               // { label: "GL Date",            type: "date",   key: "glDate",     onChange: (v) => setForm({ ...form, glDate: v }) },
//             ].map(({ label, type, key, readOnly, onChange }) => (
//               <div key={key} className="grid grid-cols-3 px-3 items-center py-2">
//                 <label className="font-bold text-sm text-gray-800">{label}</label>
//                 <input
//                   type={type} value={form[key]} readOnly={readOnly}
//                   disabled={isSubmitting || readOnly}
//                   onChange={(e) => onChange?.(e.target.value)}
//                   className={`col-span-2 w-full border rounded py-1 ${readOnly ? "bg-gray-100" : "bg-white"}`}
//                 />
//               </div>
//             ))}

//             {/* GL Date — আলাদা */}
// <div className="grid grid-cols-3 px-3 items-center py-2">
//   <label className="font-bold text-sm text-gray-800">GL Date</label>
//   <input
//     type="date"
//     value={form.glDate}
//     onChange={(e) => setForm({ ...form, glDate: e.target.value })}
//     disabled={isSubmitting}
//     className={`col-span-2 w-full border rounded py-1 ${isPeriodClosed ? "border-red-400" : ""} bg-white`}
//   />
// </div>
// {isPeriodClosed && (
//   <p className="text-xs text-red-500 px-3 -mt-1 mb-2">
//     ⚠ Period "{periodStatus.PERIOD_NAME}" is closed for AR postings. Choose a different date.
//   </p>
// )}
// {noPeriodDefined && (
//   <p className="text-xs text-amber-500 px-3 -mt-1 mb-2">
//     ⚠ No ledger period found for this date.
//   </p>
// )}

//             {/* Customer select-এর পরে এই block যোগ করো */}
// <div className="grid grid-cols-3 px-3 items-center py-3">
//   <label className="font-bold text-sm text-gray-800">Type</label>
//   <select
//     value={form.inv_type}
//     onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
//     disabled={isSubmitting}
//     className="col-span-2 w-full border rounded py-1 h-8 bg-white"
//   >
//     <option value="">Select type</option>
//     {invTypes.map((t) => (
//       <option key={t.ID} value={String(t.ID)}>{t.DESCRIPTIO}</option>
//     ))}
//   </select>
// </div>

//             <div className="grid grid-cols-3 px-3 items-center">
//               <label className="font-bold text-sm text-gray-800">Receive Code</label>
//               <select
//                 value={form.ReceiveCode}
//                 onChange={(e) => setForm({ ...form, ReceiveCode: e.target.value })}
//                 disabled={isSubmitting}
//                 className="col-span-2 w-full rounded py-1 border bg-white"
//               >
//                 <option value="">Select Receive</option>
//                 {ReceiveCodes.map((c) => (
//                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>{c.ACCOUNT_NAME}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-3 px-3 items-center py-3">
//               <label className="font-bold text-sm text-gray-800">Total Amount</label>
//               <input
//                 type="number" value={form.totalAmount.toFixed(2)} readOnly
//                 className="col-span-2 w-full border rounded py-1 bg-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="mt-4 mb-4">
//           <label className="font-bold text-sm text-gray-800 block mb-2 py-2 px-4 rounded-lg">Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             disabled={isSubmitting}
//             className="w-full mt-1 border rounded-lg px-3 py-2"
//           />
//         </div>

//         {/* Add row inputs */}
//         <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-4 rounded-lg items-center">
//           <div className="grid grid-cols-3 px-3 items-center py-1">
//             <label className="font-bold text-sm text-gray-800">Account ID</label>
//             <Select
//               options={accounts}
//               className="col-span-2 border w-full rounded shadow-2xl"
//               value={accounts.find((a) => a.value === form.accountId) || null}
//               onChange={(s) => setForm({ ...form, accountId: s?.value || "", particular: s?.name || "" })}
//               placeholder="Enter account..."
//               isClearable isSearchable isDisabled={isSubmitting}
//               menuPortalTarget={document.body}
//               styles={{
//                 menuPortal: (b) => ({ ...b, zIndex: 9999 }),
//                 menu: (b) => ({ ...b, backgroundColor: "white", border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }),
//               }}
//             />
//           </div>
//           <div className="grid grid-cols-3 px-3 items-center py-3">
//             <label className="font-bold text-sm text-gray-800">Particular</label>
//             <input type="text" value={form.particular} readOnly className="col-span-2 border w-full rounded py-1 bg-white" />
//           </div>
//           <div className="grid grid-cols-3 px-3 items-center py-3">
//             <label className="font-bold text-sm text-gray-800">Amount</label>
//             <input
//               type="number" value={form.amount}
//               onChange={(e) => setForm({ ...form, amount: e.target.value })}
//               disabled={isSubmitting}
//               className="col-span-1 border w-full rounded py-1 bg-white"
//             />
//           </div>
//           <div className="px-4 py-2">
//             <button
//               type="button" onClick={addRow} disabled={isSubmitting}
//               className="cursor-pointer border px-3 py-1 rounded-lg flex items-center font-bold text-sm text-gray-800"
//             >
//               <span className="mr-1 font-extrabold">+</span>Add
//             </button>
//           </div>
//         </div>

//         {/* Rows table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse rounded-lg text-xs md:text-sm">
//             <thead>
//               <tr className="bg-gray-50">
//                 {["Account Code", "Particulars", "Amount", ""].map((h) => (
//                   <th key={h} className="px-2 md:px-4 py-2 text-center font-bold text-sm text-gray-800">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             {/* <tbody>
//               {rows.map((row) => (
//                 <tr key={row.id} className="border">
//                   <td className="border px-2 md:px-4 py-2">{row.accountCode}</td>
//                   <td className="border px-2 md:px-4 py-2">{row.particulars}</td>
//                   <td className="border px-2 md:px-4 py-2 text-center">{Number(row.amount).toFixed(2)}</td>
//                   <td className="border px-2 md:px-4 py-2 text-center">
//                     {row.id !== "dummy" && (
//                       <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.id)} disabled={isSubmitting}>
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </Button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               {rows.length > 0 && rows[0].id !== "dummy" && (
//                 <tr className="font-semibold">
//                   <td colSpan="2" className="p-2 text-right font-bold text-sm text-gray-800">Total</td>
//                   <td className="border p-2 text-center">{form.totalAmount.toFixed(2)}</td>
//                   <td />
//                 </tr>
//               )}
//             </tbody> */}

//             <tbody>
//               {rows.map((row) => (
//                 row.id === "dummy" ? null : (
//                   <tr key={row.id} className="border">
//                     <td className="border px-1 py-1">
//                       <input
//                         type="text"
//                         value={row.accountCode}
//                         onChange={(e) => updateRow(row.id, "accountCode", e.target.value)}
//                         disabled={isSubmitting}
//                         className="w-full border rounded px-2 py-1 bg-white text-sm text-center"
//                       />
//                     </td>
//                     <td className="border px-1 py-1">
//                       <input
//                         type="text"
//                         value={row.particulars}
//                         onChange={(e) => updateRow(row.id, "particulars", e.target.value)}
//                         disabled={isSubmitting}
//                         className="w-full border rounded px-2 py-1 bg-white text-sm"
//                       />
//                     </td>
//                     <td className="border px-1 py-1">
//                       <input
//                         type="number"
//                         value={row.amount}
//                         onChange={(e) => updateRow(row.id, "amount", e.target.value)}
//                         disabled={isSubmitting}
//                         className="w-full border rounded px-2 py-1 bg-white text-sm text-center"
//                       />
//                     </td>
//                     <td className="border px-2 md:px-4 py-2 text-center">
//                       <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.id)} disabled={isSubmitting}>
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               ))}
//               {rows.length > 0 && rows[0].id !== "dummy" && (
//                 <tr className="font-semibold">
//                   <td colSpan="2" className="p-2 text-right font-bold text-sm text-gray-800">Total</td>
//                   <td className="border p-2 text-center">{form.totalAmount.toFixed(2)}</td>
//                   <td />
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-4">
//         <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting || isPeriodClosed || noPeriodDefined}>
//   {isSubmitting ? "Submitting..." : "Create"}
// </Button>
//         </div>
//       </div>

//       {/* ── Voucher Confirmation Modal ── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Confirm Voucher Submission</h2>
//             <div className="space-y-2">
//               <p><strong>Entry Date:</strong> {form.entryDate}</p>
//               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
//               <p><strong>Description:</strong> {form.description}</p>
//               <p><strong>Customer:</strong> {customers.find((s) => String(s.CUSTOMER_ID) === form.customer)?.CUSTOMER_NAME}</p>
//               <p><strong>GL Date:</strong> {form.glDate}</p>
//               <p><strong>Receive Code:</strong> {form.ReceiveCode}</p>
//               {billFiles.length > 0 && (
//                 <div>
//                   <strong>Bills ({billFiles.length}):</strong>
//                   <ul className="list-disc pl-5 text-sm text-gray-600">
//                     {billFiles.map((f, i) => <li key={i}>{f.name}</li>)}
//                   </ul>
//                 </div>
//               )}
//               <h3 className="font-semibold mt-2">Accounts:</h3>
//               <ul className="list-disc pl-5">
//                 {rows.filter((r) => r.id !== "dummy").map((row, i) => (
//                   <li key={i}>{row.accountCode} - {row.particulars} - {row.amount}</li>
//                 ))}
//               </ul>
//               <p className="font-semibold mt-2">Total: {form.totalAmount.toFixed(2)}</p>
//             </div>
//             <div className="flex justify-end mt-4 space-x-3">
//               <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-300">Cancel</button>
//               <button
//                 onClick={handleSubmit} disabled={isSubmitting}
//                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
//               >
//                 {isSubmitting ? "Submitting..." : "Confirm"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Add Customer Dialog Modal ── */}
//       {showCustomerModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-[560px] max-h-[90vh] overflow-y-auto">

//             {/* Modal Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-gray-100">
//                   <Users size={18} className="text-gray-700" />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-gray-800">Add New Customer</h2>
//                   <p className="text-xs text-gray-500">Create a new customer record</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleCloseCustomerModal}
//                 disabled={isCustomerSaving}
//                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <X size={18} className="text-gray-500" />
//               </button>
//             </div>

//             {/* Modal Form */}
//             <form onSubmit={handleCustomerSubmit} className="px-6 py-5 space-y-4">

//               {/* Customer Name */}
//               <div>
//                 <label className={labelCls}>
//                   Customer Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={customerForm.customerName}
//                   onChange={(e) => setCustomerForm({ ...customerForm, customerName: e.target.value })}
//                   placeholder="Enter customer name"
//                   disabled={isCustomerSaving}
//                   className={inputCls}
//                 />
//                 {customerErrors.customerName && <p className={errCls}>{customerErrors.customerName}</p>}
//               </div>

//               {/* Contact Person + Phone */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className={labelCls}>Contact Person</label>
//                   <input
//                     type="text"
//                     value={customerForm.contactPerson}
//                     onChange={(e) => setCustomerForm({ ...customerForm, contactPerson: e.target.value })}
//                     placeholder="Contact person"
//                     disabled={isCustomerSaving}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Phone</label>
//                   <input
//                     type="text"
//                     value={customerForm.phone}
//                     onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
//                     placeholder="Phone number"
//                     disabled={isCustomerSaving}
//                     className={inputCls}
//                   />
//                 </div>
//               </div>

//               {/* Mobile + Email */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className={labelCls}>Mobile</label>
//                   <input
//                     type="text"
//                     value={customerForm.mobile}
//                     onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
//                     placeholder="Mobile number"
//                     disabled={isCustomerSaving}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Email</label>
//                   <input
//                     type="email"
//                     value={customerForm.email}
//                     onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
//                     placeholder="email@example.com"
//                     disabled={isCustomerSaving}
//                     className={inputCls}
//                   />
//                   {customerErrors.email && <p className={errCls}>{customerErrors.email}</p>}
//                 </div>
//               </div>

//               {/* Address */}
//               <div>
//                 <label className={labelCls}>Address</label>
//                 <textarea
//                   value={customerForm.address}
//                   onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
//                   placeholder="Customer address"
//                   rows={2}
//                   disabled={isCustomerSaving}
//                   className={`${inputCls} resize-none`}
//                 />
//               </div>

//               {/* Remarks + Status */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className={labelCls}>Remarks</label>
//                   <input
//                     type="text"
//                     value={customerForm.remarks}
//                     onChange={(e) => setCustomerForm({ ...customerForm, remarks: e.target.value })}
//                     placeholder="Optional remarks"
//                     disabled={isCustomerSaving}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelCls}>
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={customerForm.status}
//                     onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
//                     disabled={isCustomerSaving}
//                     className={inputCls}
//                   >
//                     <option value="1">Active</option>
//                     <option value="0">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="flex justify-end gap-2 pt-2 border-t mt-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseCustomerModal}
//                   disabled={isCustomerSaving}
//                   className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isCustomerSaving}
//                   className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
//                 >
//                   {isCustomerSaving ? "Creating..." : "Create Customer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </SectionContainer>
//   );
// };

// export default ReceiveCreate;

import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Users, X, FileText, Receipt, ListChecks ,Lock, AlertTriangle} from "lucide-react";
import Select from "react-select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { SectionContainer } from "@/components/SectionContainer";
import { ReceiveService } from "@/api/AccontingApi";
import { Button } from "@/components/ui/button";
import BillUploadPanel from "@/components/shared/bill-upload-panel";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";
import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

const url = import.meta.env.VITE_API_BASE_URL;

const invoiceLockUrl = (hid) => `${url}/api/sal-invoice/${hid}/lock`;

// ── Customer default form ────────────────────────────────────────────────────
const customerDefault = {
  customerName: "",
  contactPerson: "",
  phone: "",
  mobile: "",
  email: "",
  address: "",
  remarks: "",
  status: "1",
};

/* ── Shared design tokens (visual only) — mirrors PaymentCreate ──────────── */
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
const ReceiveCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const location = useLocation();
  const userId = useAuthUserId();

  // ── Bill files ───────────────────────────────────────────────────────────────
  const [billFiles, setBillFiles] = useState([]);

  const [rows, setRows] = useState([
    { id: "dummy", accountCode: "", particulars: "", amount: 0 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerForm, setCustomerForm] = useState(customerDefault);
  const [customerErrors, setCustomerErrors] = useState({});

  const [form, setForm] = useState({
    entryDate: today,
    invoiceNo: "",
    supporting: "",
    description: "",
    customer: "",
    glDate: today,
    ReceiveCode: "",
    accountId: "",
    particular: "",
    amount: "",
    totalAmount: 0,
    inv_type: "",
    sale_invoice_no: "",
   
type: "MANUAL",   // ← notun
  });

  const { data: periodStatus } = usePeriodStatusForDate("AR", form.glDate);
  const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
  const noPeriodDefined = !!form.glDate && periodStatus === null;

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: async () =>
      (await axios.get(`${url}/api/customer-type`)).data.data || [],
  });

  const { data: ReceiveCodes = [] } = useQuery({
    queryKey: ["ReceiveCodes"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/receive-code`);
      return res.data.success ? res.data.data || [] : [];
    },
  });

  const { data: invTypes = [] } = useQuery({
    queryKey: ["invTypes"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/inv-type`);
      return res.data.data || [];
    },
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/receive-account-code`);
      return res.data.success === true
        ? res.data.data.map((acc) => ({
            value: acc.ACCOUNT_ID,
            label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
            name: acc.ACCOUNT_NAME,
          }))
        : [];
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

  // ── Voucher Mutation ─────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (payload) => (await ReceiveService.insert(payload)).data,
    onSuccess: async (data) => {
      if (data.status === "success") {
        await uploadBills(data.masterID);

        // Sale Invoice theke ashle, oi invoice-take lock kore dao
        const invoiceHid = location.state?.invoiceHid;
        if (invoiceHid) {
          try {
            await axios.put(invoiceLockUrl(invoiceHid));
          } catch (err) {
            console.error("Failed to lock invoice:", err);
          }
        }

        toast.success("Voucher created successfully!");
        setBillFiles([]);
        setForm({
          entryDate: today,
          invoiceNo: "",
          supporting: "",
          description: "",
          customer: "",
          glDate: today,
          ReceiveCode: "",
          accountId: "",
          particular: "",
          amount: "",
          totalAmount: 0,
          inv_type: "",
          sale_invoice_no: "",
          type: "MANUAL",
        });
        setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
        queryClient.invalidateQueries(["unpostedVouchers"]);
        queryClient.invalidateQueries(["salInvoice", "list"]);
        navigate("/dashboard/receive-voucher");
      } else {
        toast.error("Error processing voucher");
      }
    },
    onError: () => toast.error("Error submitting voucher. Please try again."),
    onSettled: () => setShowModal(false),
  });

  // ── Customer Mutation ────────────────────────────────────────────────────────
  const customerMutation = useMutation({
    mutationFn: (data) =>
      axios.post(`${url}/api/customer`, {
        CUSTOMER_NAME: data.customerName,
        CONTACT_PERSON: data.contactPerson || null,
        PHONE: data.phone || null,
        MOBILE: data.mobile || null,
        EMAIL: data.email || null,
        ADDRESS: data.address || null,
        REMARKS: data.remarks || null,
        STATUS: Number(data.status),
        ENTRY_BY: null,
        PASSWORD: null,
        ORG_ID: null,
        DUE: null,
        FAX: null,
      }),
    onSuccess: () => {
      toast.success("Customer created successfully!");
      queryClient.invalidateQueries(["customers"]);
      setCustomerForm(customerDefault);
      setCustomerErrors({});
      setShowCustomerModal(false);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create customer."),
  });

  // ── Customer form validation ─────────────────────────────────────────────────
  const validateCustomer = () => {
    const errs = {};
    if (!customerForm.customerName.trim())
      errs.customerName = "Customer name is required";
    if (
      customerForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)
    )
      errs.email = "Invalid email address";
    setCustomerErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (!validateCustomer()) return;
    customerMutation.mutate(customerForm);
  };

  const handleCloseCustomerModal = () => {
    setCustomerForm(customerDefault);
    setCustomerErrors({});
    setShowCustomerModal(false);
  };

  // ── Row handlers ─────────────────────────────────────────────────────────────
  const addRow = () => {
    if (!form.accountId || !form.amount) {
      toast.error("Please select account and enter amount");
      return;
    }
    const newRow = {
      id: Date.now(),
      accountCode: form.accountId,
      particulars: form.particular,
      amount: parseFloat(form.amount),
    };
    const updated =
      rows.length === 1 && rows[0].id === "dummy" ? [newRow] : [...rows, newRow];
    setRows(updated);
    setForm({
      ...form,
      accountId: "",
      particular: "",
      amount: "",
      totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
    });
  };

  const removeRow = (id) => {
    const updated = rows.filter((r) => r.id !== id);
    setRows(updated);
    setForm({
      ...form,
      totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
    });
  };

  const updateRow = (id, field, value) => {
    setRows((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      );
      setForm((f) => ({
        ...f,
        totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
      }));
      return updated;
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (
      !form.entryDate ||
      !form.glDate ||
      !form.description ||
      !form.ReceiveCode ||
      !form.customer ||
      rows.length === 0 ||
      rows[0].id === "dummy"
    ) {
      toast.error("Please fill all required fields and add at least one row.");
      return;
    }
    if (rows.some((r) => !r.accountCode || !r.particulars)) {
      toast.error("Each row must have Account Code and Particular filled.");
      return;
    }
    mutation.mutate({
      trans_date: form.entryDate,
      gl_date: form.glDate,
      receive_desc: form.description,
      supporting: String(form.supporting),
      receive: form.ReceiveCode,
      supplierid: String(form.customer),
      totalAmount: Number(form.totalAmount),
      accountID: rows.map((r) => r.accountCode),
      amount2: rows.map((r) => Number(r.amount || 0)),
      inv_type: form.inv_type ? Number(form.inv_type) : null,
      sale_invoice_no: form.sale_invoice_no ? Number(form.sale_invoice_no) : null,
      entry_by: userId,
      type: form.type, 
    });
  };

  // ── Prefill from Edit Sale Invoice's "Receive Voucher" button ───────────────
  useEffect(() => {
    const incoming = location.state;
    if (!incoming) return;

    setForm((f) => ({
      ...f,
      customer: incoming.customer ? String(incoming.customer) : f.customer,
      entryDate: incoming.invoiceDate || f.entryDate,
      glDate: incoming.invoiceDate || f.glDate,
      description: incoming.description || f.description,
      invoiceNo: incoming.invoiceNo || f.invoiceNo,
      sale_invoice_no: incoming.saleInvoiceNo
        ? String(incoming.saleInvoiceNo)
        : f.sale_invoice_no,
    }));

    if (incoming.rows && incoming.rows.length > 0) {
      const mappedRows = incoming.rows.map((r, i) => ({
        id: Date.now() + i,
        accountCode: "4030010000",
        particulars: r.particulars || "",
        amount: Math.round(Number(r.amount || 0) * 100) / 100,
      }));
      setRows(mappedRows);
      setForm((f) => ({
        ...f,
        totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-select "Egg" type when coming from Sale Invoice ────────────────────
  useEffect(() => {
    if (!location.state) return;
    if (!invTypes.length) return;
    if (form.inv_type) return;

    const eggType = invTypes.find(
      (t) => String(t.DESCRIPTIO || "").trim().toLowerCase() === "egg"
    );
    if (eggType) {
      setForm((f) => ({ ...f, inv_type: String(eggType.ID) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invTypes, location.state]);

  // ── Auto-select "Cash at Bank (Chicken)" receive code when coming from Sale Invoice ──
  useEffect(() => {
    if (!location.state) return;
    if (!ReceiveCodes.length) return;
    if (form.ReceiveCode) return;

    const cashInBank = ReceiveCodes.find(
      (c) =>
        String(c.ACCOUNT_NAME || "").trim().toLowerCase() ===
        "cash at bank (chicken)"
    );
    if (cashInBank) {
      setForm((f) => ({ ...f, ReceiveCode: cashInBank.ACCOUNT_ID }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReceiveCodes, location.state]);

  const isSubmitting = mutation.isPending;
  const isCustomerSaving = customerMutation.isPending;

  const inputCls =
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all";
  const labelCls =
    "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
  const errCls = "text-xs text-red-500 mt-1";

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <SectionContainer>
      <div className="flex flex-col min-h-full">
        <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Accounts Receivable
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Create Receive Voucher
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Record a new customer receipt entry
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => setShowCustomerModal(true)}
              >
                <Users size={15} className="mr-1.5" /> New Customer
              </Button>
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => navigate("/dashboard/receive-voucher")}
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
                <p className={sectionSubtitle}>
                  Customer, references and posting dates
                </p>
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
                <label className={fieldLabel}>
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.customer}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                >
                  <option value="">Select customer</option>
                  {customers.map((c) => (
                    <option key={c.CUSTOMER_ID} value={String(c.CUSTOMER_ID)}>
                      {c.CUSTOMER_NAME}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Entry Date</label>
                <input
                  type="date"
                  value={form.entryDate}
                  disabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                  className={fieldInput}
                />
              </div>

              <div>
                <label className={fieldLabel}>Invoice No</label>
                <input
                  type="text"
                  value={form.invoiceNo}
                  readOnly
                  className={fieldInputReadOnly}
                />
              </div>

              <div>
                <label className={fieldLabel}>Sale Invoice No</label>
                <input
                  type="text"
                  value={form.sale_invoice_no}
                  readOnly
                  className={fieldInputReadOnly}
                />
              </div>

              <div>
                <label className={fieldLabel}>No. of Supporting</label>
                <input
                  type="number"
                  value={form.supporting}
                  disabled={isSubmitting}
                  onChange={(e) => setForm({ ...form, supporting: e.target.value })}
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
  </select>
</div>

              <div>
                <label className={fieldLabel}>Type</label>
                <select
                  value={form.inv_type}
                  onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                >
                  <option value="">Select type</option>
                  {invTypes.map((t) => (
                    <option key={t.ID} value={String(t.ID)}>
                      {t.DESCRIPTIO}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Receive Code</label>
                <select
                  value={form.ReceiveCode}
                  onChange={(e) => setForm({ ...form, ReceiveCode: e.target.value })}
                  disabled={isSubmitting}
                  className={fieldInput}
                >
                  <option value="">Select receive</option>
                  {ReceiveCodes.map((c) => (
                    <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
                      {c.ACCOUNT_NAME}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={fieldLabel}>Total Amount</label>
                <input
                  type="number"
                  value={form.totalAmount.toFixed(2)}
                  readOnly
                  className={`${fieldInputReadOnly} font-semibold`}
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
                  Break the total down across GL accounts
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_auto] gap-4 items-end">
              <div>
                <label className={fieldLabel}>Account ID</label>
                <Select
                  options={accounts}
                  value={accounts.find((a) => a.value === form.accountId) || null}
                  onChange={(s) =>
                    setForm({
                      ...form,
                      accountId: s?.value || "",
                      particular: s?.name || "",
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

            {/* Rows table — editable, since Receive keeps rows inline-editable */}
            <div className="px-6 pb-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      { label: "Account Code", align: "text-left" },
                      { label: "Particulars", align: "text-left" },
                      { label: "Amount", align: "text-right" },
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
                  {rows.map((row, i) =>
                    row.id === "dummy" ? null : (
                      <tr
                        key={row.id}
                        className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${
                          i % 2 === 1 ? "bg-slate-50/50" : ""
                        }`}
                      >
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.accountCode}
                            onChange={(e) =>
                              updateRow(row.id, "accountCode", e.target.value)
                            }
                            disabled={isSubmitting}
                            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm bg-white text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.particulars}
                            onChange={(e) =>
                              updateRow(row.id, "particulars", e.target.value)
                            }
                            disabled={isSubmitting}
                            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm bg-white text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="number"
                            value={row.amount}
                            onChange={(e) =>
                              updateRow(row.id, "amount", e.target.value)
                            }
                            disabled={isSubmitting}
                            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm bg-white text-slate-700 text-right tabular-nums focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                          />
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
                    )
                  )}
                  {rows.length > 0 && rows[0].id !== "dummy" && (
                    <tr className="font-semibold bg-slate-50">
                      <td colSpan="2" className="px-4 py-2.5 text-right text-sm text-slate-800">
                        Total
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
                        {form.totalAmount.toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
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
              onClick={() => navigate("/dashboard/receive-voucher")}
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

      {/* ── Voucher Confirmation Modal ── */}
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
                <strong className="text-gray-700">Customer:</strong>{" "}
                <span className="text-gray-600">
                  {
                    customers.find((s) => String(s.CUSTOMER_ID) === form.customer)
                      ?.CUSTOMER_NAME
                  }
                </span>
              </p>
              <p>
                <strong className="text-gray-700">GL Date:</strong>{" "}
                <span className="text-gray-600">{form.glDate}</span>
              </p>
              <p>
                <strong className="text-gray-700">Receive Code:</strong>{" "}
                <span className="text-gray-600">{form.ReceiveCode}</span>
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
                {rows
                  .filter((r) => r.id !== "dummy")
                  .map((row, i) => (
                    <li key={i}>
                      {row.accountCode} — {row.particulars} — {row.amount}
                    </li>
                  ))}
              </ul>
              <p className="font-semibold mt-2 text-gray-900">
                Total: {form.totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
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

      {/* ── Add Customer Dialog Modal ── */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-[560px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50">
                  <Users size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Add New Customer</h2>
                  <p className="text-xs text-gray-500">Create a new customer record</p>
                </div>
              </div>
              <button
                onClick={handleCloseCustomerModal}
                disabled={isCustomerSaving}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerForm.customerName}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                  disabled={isCustomerSaving}
                  className={inputCls}
                />
                {customerErrors.customerName && (
                  <p className={errCls}>{customerErrors.customerName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Contact Person</label>
                  <input
                    type="text"
                    value={customerForm.contactPerson}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, contactPerson: e.target.value })
                    }
                    placeholder="Contact person"
                    disabled={isCustomerSaving}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="text"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, phone: e.target.value })
                    }
                    placeholder="Phone number"
                    disabled={isCustomerSaving}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Mobile</label>
                  <input
                    type="text"
                    value={customerForm.mobile}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, mobile: e.target.value })
                    }
                    placeholder="Mobile number"
                    disabled={isCustomerSaving}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    disabled={isCustomerSaving}
                    className={inputCls}
                  />
                  {customerErrors.email && <p className={errCls}>{customerErrors.email}</p>}
                </div>
              </div>

              <div>
                <label className={labelCls}>Address</label>
                <textarea
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, address: e.target.value })
                  }
                  placeholder="Customer address"
                  rows={2}
                  disabled={isCustomerSaving}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Remarks</label>
                  <input
                    type="text"
                    value={customerForm.remarks}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, remarks: e.target.value })
                    }
                    placeholder="Optional remarks"
                    disabled={isCustomerSaving}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={customerForm.status}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, status: e.target.value })
                    }
                    disabled={isCustomerSaving}
                    className={inputCls}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={handleCloseCustomerModal}
                  disabled={isCustomerSaving}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isCustomerSaving}
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
                >
                  {isCustomerSaving ? "Creating..." : "Create Customer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default ReceiveCreate;