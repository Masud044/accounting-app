// // // // // // import { useState, useEffect } from "react";
// // // // // // import { ArrowLeft, Trash2, Users, X } from "lucide-react";
// // // // // // import Select from "react-select";
// // // // // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // // // // import { toast } from "react-toastify";
// // // // // // import axios from "axios";
// // // // // // import { useNavigate , useLocation} from "react-router-dom";
// // // // // // import { useMutation } from "@tanstack/react-query";

// // // // // // import { SectionContainer } from "@/components/SectionContainer";
// // // // // // import { PaymentService } from "@/api/AccontingApi";
// // // // // // import { Button } from "@/components/ui/button";
// // // // // // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // // // // // import { useCreateSupplier } from "@/features/supplier/queries"; // ← তোমার actual path
 



// // // // // // const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// // // // // // // ── Supplier default form ────────────────────────────────────────────────────
// // // // // // const supplierDefault = {
// // // // // //   supplierName: "",
// // // // // //   contactPerson: "",
// // // // // //   phone: "",
// // // // // //   mobile: "",
// // // // // //   email: "",
// // // // // //   address: "",
// // // // // //   remarks: "",
// // // // // //   status: "1",
// // // // // // };

// // // // // // const PaymentCreate = () => {
// // // // // //   const navigate = useNavigate();
// // // // // //   const queryClient = useQueryClient();
// // // // // //   const today = new Date().toISOString().split("T")[0];

// // // // // //   // ── Bill files ───────────────────────────────────────────────────────────────
// // // // // //   const [billFiles, setBillFiles] = useState([]);

// // // // // //   const [rows, setRows] = useState([
// // // // // //     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
// // // // // //   ]);

// // // // // //   const [showModal, setShowModal] = useState(false);
// // // // // //   const [showSupplierModal, setShowSupplierModal] = useState(false);
// // // // // //   const [supplierForm, setSupplierForm] = useState(supplierDefault);
// // // // // //   const [supplierErrors, setSupplierErrors] = useState({});

// // // // // //   const location = useLocation();

// // // // // //  const [form, setForm] = useState({
// // // // // //   entryDate: today,
// // // // // //   invoiceNo: "",
// // // // // //   poNumber: "",   // 👈 নতুন
// // // // // //   supporting: "",
// // // // // //   description: "",
// // // // // //   supplier: "",
// // // // // //   glDate: today,
// // // // // //   paymentCode: "",
// // // // // //   accountId: "",
// // // // // //   particular: "",
// // // // // //   amount: "",
// // // // // //   totalAmount: 0,
// // // // // //   inv_type: "",
// // // // // // });
// // // // // //   // ── Queries ──────────────────────────────────────────────────────────────────
// // // // // //   const { data: suppliers = [] } = useQuery({
// // // // // //     queryKey: ["suppliers"],
// // // // // //     queryFn: async () =>
// // // // // //       (await axios.get(`${url}/api/supplier-type`)).data.data || [],
// // // // // //   });

// // // // // //   const { data: PaymentCodes = [] } = useQuery({
// // // // // //     queryKey: ["paymentCodes"],
// // // // // //     queryFn: async () => {
// // // // // //       const res = await axios.get(`${url}/api/receive-code`);
// // // // // //       return res.data.success ? res.data.data || [] : [];
// // // // // //     },
// // // // // //   });

// // // // // //   const { data: invTypes = [] } = useQuery({
// // // // // //     queryKey: ["invTypes"],
// // // // // //     queryFn: async () => {
// // // // // //       const res = await axios.get(`${url}/api/inv-type`); // আপনার endpoint
// // // // // //       return res.data.data || [];
// // // // // //     },
// // // // // //   });

// // // // // //   const { data: accounts = [] } = useQuery({
// // // // // //     queryKey: ["accounts"],
// // // // // //     queryFn: async () => {
// // // // // //       const res = await axios.get(`${url}/api/account-code`);
// // // // // //       return res.data.success === 1
// // // // // //         ? res.data.data.map((a) => ({
// // // // // //             value: a.ACCOUNT_ID,
// // // // // //             label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
// // // // // //             name: a.ACCOUNT_NAME,
// // // // // //           }))
// // // // // //         : [];
// // // // // //     },
// // // // // //   });

// // // // // //   // ── Upload bills helper ──────────────────────────────────────────────────────
// // // // // //   const uploadBills = async (glMasterId) => {
// // // // // //     if (!billFiles.length || !glMasterId) return;
// // // // // //     const uploads = billFiles.map((file) => {
// // // // // //       const fd = new FormData();
// // // // // //       fd.append("doc_file", file);
// // // // // //       fd.append("GLMASTERID", glMasterId);
// // // // // //       return axios.post(`${url}/api/gldoc`, fd);
// // // // // //     });
// // // // // //     await Promise.allSettled(uploads);
// // // // // //   };

// // // // // //   // ── Voucher Mutation ─────────────────────────────────────────────────────────
// // // // // //   const mutation = useMutation({
// // // // // //     mutationFn: async (payload) => {
// // // // // //       const res = await PaymentService.insert(payload);
// // // // // //       return res.data;
// // // // // //     },
// // // // // //     onSuccess: async (data) => {
// // // // // //       if (data.status === "success") {
// // // // // //         await uploadBills(data.masterID || data.id);
// // // // // //         toast.success("Voucher created successfully!");
// // // // // //         setBillFiles([]);
// // // // // //         setForm({
// // // // // //           entryDate: today,
// // // // // //           invoiceNo: "",
// // // // // //           supporting: "",
// // // // // //           description: "",
// // // // // //           poNumber: "",
// // // // // //           supplier: "",
// // // // // //           glDate: today,
// // // // // //           paymentCode: "",
// // // // // //           accountId: "",
// // // // // //           particular: "",
// // // // // //           amount: "",
// // // // // //           totalAmount: 0,
// // // // // //           inv_type: "",
// // // // // //         });
// // // // // //         setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
// // // // // //         queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
// // // // // //         navigate("/dashboard/payment-voucher");
// // // // // //       } else {
// // // // // //         toast.error("Error processing voucher.");
// // // // // //       }
// // // // // //     },
// // // // // //     onError: () => toast.error("Error submitting voucher. Please try again."),
// // // // // //     onSettled: () => setShowModal(false),
// // // // // //   });

// // // // // //   // ── Supplier Mutation (useCreateSupplier hook) ───────────────────────────────
// // // // // //   const supplierMutation = useCreateSupplier();

// // // // // //   // ── Supplier form validation ─────────────────────────────────────────────────
// // // // // //   const validateSupplier = () => {
// // // // // //     const errs = {};
// // // // // //     if (!supplierForm.supplierName.trim())
// // // // // //       errs.supplierName = "Supplier name is required";
// // // // // //     if (
// // // // // //       supplierForm.email &&
// // // // // //       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
// // // // // //     )
// // // // // //       errs.email = "Invalid email address";
// // // // // //     setSupplierErrors(errs);
// // // // // //     return Object.keys(errs).length === 0;
// // // // // //   };

// // // // // //   const handleSupplierSubmit = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     if (!validateSupplier()) return;
// // // // // //     try {
// // // // // //       await supplierMutation.mutateAsync({
// // // // // //         SUPPLIER_NAME: supplierForm.supplierName,
// // // // // //         CONTACT_PERSON: supplierForm.contactPerson || null,
// // // // // //         PHONE: supplierForm.phone || null,
// // // // // //         MOBILE: supplierForm.mobile || null,
// // // // // //         EMAIL: supplierForm.email || null,
// // // // // //         ADDRESS: supplierForm.address || null,
// // // // // //         REMARKS: supplierForm.remarks || null,
// // // // // //         STATUS: Number(supplierForm.status),
// // // // // //         ENTRY_BY: null,
// // // // // //         PASSWORD: null,
// // // // // //         ORG_ID: null,
// // // // // //         DUE: null,
// // // // // //         FAX: null,
// // // // // //       });
// // // // // //       toast.success("Supplier created successfully!");
// // // // // //       queryClient.invalidateQueries(["suppliers"]);
// // // // // //       setSupplierForm(supplierDefault);
// // // // // //       setSupplierErrors({});
// // // // // //       setShowSupplierModal(false);
// // // // // //     } catch (err) {
// // // // // //       toast.error(err?.message || "Failed to create supplier.");
// // // // // //     }
// // // // // //   };

// // // // // //   const handleCloseSupplierModal = () => {
// // // // // //     setSupplierForm(supplierDefault);
// // // // // //     setSupplierErrors({});
// // // // // //     setShowSupplierModal(false);
// // // // // //   };

// // // // // //   // ── Row handlers ─────────────────────────────────────────────────────────────
// // // // // //   const addRow = () => {
// // // // // //     if (!form.accountId || !form.amount) {
// // // // // //       toast.error("Please select account and enter amount");
// // // // // //       return;
// // // // // //     }
// // // // // //     const account = accounts.find((a) => a.value === form.accountId);
// // // // // //     const newRow = {
// // // // // //       id: Date.now(),
// // // // // //       accountCode: form.accountId,
// // // // // //       particulars: form.particular || account?.label || "",
// // // // // //       amount: parseFloat(form.amount),
// // // // // //     };
// // // // // //     const updated =
// // // // // //       rows.length === 1 && rows[0].id === "dummy"
// // // // // //         ? [newRow]
// // // // // //         : [...rows, newRow];
// // // // // //     setRows(updated);
// // // // // //     setForm({
// // // // // //       ...form,
// // // // // //       accountId: "",
// // // // // //       particular: "",
// // // // // //       amount: "",
// // // // // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
// // // // // //     });
// // // // // //   };

// // // // // //   const removeRow = (id) => {
// // // // // //     const updated = rows.filter((r) => r.id !== id);
// // // // // //     setRows(updated);
// // // // // //     setForm({
// // // // // //       ...form,
// // // // // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
// // // // // //     });
// // // // // //   };

// // // // // //   // ── Voucher Submit ───────────────────────────────────────────────────────────
// // // // // //   const handleSubmit = () => {
// // // // // //     if (
// // // // // //       !form.entryDate ||
// // // // // //       !form.glDate ||
// // // // // //       !form.paymentCode ||
// // // // // //       !form.supplier ||
// // // // // //       rows.length === 0 ||
// // // // // //       rows[0].id === "dummy"
// // // // // //     ) {
// // // // // //       toast.error("Please fill all required fields and add at least one row.");
// // // // // //       return;
// // // // // //     }
// // // // // //     if (rows.some((r) => !r.accountCode || !r.particulars)) {
// // // // // //       toast.error("Each row must have Account Code and Particular filled.");
// // // // // //       return;
// // // // // //     }
// // // // // //     mutation.mutate({
// // // // // //       trans_date: form.entryDate,
// // // // // //       gl_date: form.glDate,
// // // // // //       receive_desc: form.description,
// // // // // //       supporting: String(form.supporting),
// // // // // //       receive: form.paymentCode,
// // // // // //       supplierid: form.supplier,
// // // // // //       user_id: "1",
// // // // // //       totalAmount: String(form.totalAmount),
// // // // // //       accountID: rows.map((r) => r.accountCode),
// // // // // //       amount2: rows.map((r) => String(r.amount || 0)),
// // // // // //       inv_type: form.inv_type ? Number(form.inv_type) : null,
// // // // // //     });
// // // // // //   };

// // // // // //   const isSubmitting = mutation.isPending;
// // // // // //   const isSupplierSaving = supplierMutation.isPending;



// // // // // // useEffect(() => {
// // // // // //   const incoming = location.state;
// // // // // //   if (!incoming) return;

// // // // // //   setForm((f) => ({
// // // // // //     ...f,
// // // // // //     supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
// // // // // //     entryDate: incoming.entryDate || f.entryDate,
// // // // // //     glDate: incoming.glDate || f.glDate,
// // // // // //     description: incoming.description || f.description,
// // // // // //     invoiceNo: incoming.invoiceNo || f.invoiceNo,
// // // // // //   }));

// // // // // //   if (incoming.rows?.length > 0) {
// // // // // //     const mappedRows = incoming.rows.map((r, i) => ({
// // // // // //       id: Date.now() + i,
// // // // // //       accountCode: "",       // 👈 tumar payment account code convention diye set korte hobe
// // // // // //       particulars: r.particulars || "",
// // // // // //       amount: Number(r.amount || 0),
// // // // // //     }));
// // // // // //     setRows(mappedRows);
// // // // // //     setForm((f) => ({
// // // // // //       ...f,
// // // // // //       totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
// // // // // //     }));
// // // // // //   }
// // // // // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // }, []);

// // // // // //   // ── Shared input classes ─────────────────────────────────────────────────────
// // // // // //   const inputCls =
// // // // // //     "w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400";
// // // // // //   const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
// // // // // //   const errCls = "text-xs text-red-500 mt-0.5";

// // // // // //   // ── UI ───────────────────────────────────────────────────────────────────────
// // // // // //   return (
// // // // // //     <SectionContainer>
// // // // // //       <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
// // // // // //         {/* Header */}
// // // // // //         <div className="flex items-center justify-between mb-6">
// // // // // //           <h2 className="font-semibold text-sm text-gray-800">
// // // // // //             Create Payment Voucher
// // // // // //           </h2>
// // // // // //           <div className="flex items-center gap-2">
// // // // // //             <Button
// // // // // //               variant="outline"
// // // // // //               onClick={() => setShowSupplierModal(true)}
// // // // // //             >
// // // // // //               <Users size={15} className="mr-1" /> + Supplier
// // // // // //             </Button>
// // // // // //             <Button variant="outline" onClick={() => navigate("/dashboard/payment-voucher")}>
// // // // // //               <ArrowLeft size={16} className="mr-2" /> Back
// // // // // //             </Button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Top grid: Bill panel | Supplier | Fields */}
// // // // // //         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 bg-white rounded-lg">
// // // // // //           {/* Bill Upload */}
// // // // // //           <div className="border rounded-lg p-3 bg-gray-50">
// // // // // //             <BillUploadPanel
// // // // // //               files={billFiles}
// // // // // //               onChange={setBillFiles}
// // // // // //               disabled={isSubmitting}
// // // // // //             />
// // // // // //           </div>

// // // // // //           {/* Supplier dropdown */}
// // // // // //           <div>
// // // // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // // //               <label className="font-bold text-sm text-gray-800">
// // // // // //                 Supplier
// // // // // //               </label>
// // // // // //               <select
// // // // // //                 value={form.supplier}
// // // // // //                 onChange={(e) => setForm({ ...form, supplier: e.target.value })}
// // // // // //                 disabled={isSubmitting}
// // // // // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // // // // //               >
// // // // // //                 <option value="">Select supplier</option>
// // // // // //                 {suppliers.map((s) => (
// // // // // //                   <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
// // // // // //                     {s.SUPPLIER_NAME}
// // // // // //                   </option>
// // // // // //                 ))}
// // // // // //               </select>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Dates / Invoice / Supporting / GL Date / Payment Code / Total */}
// // // // // //           <div>
// // // // // //             {[
// // // // // //               {
// // // // // //                 label: "Entry Date",
// // // // // //                 type: "date",
// // // // // //                 key: "entryDate",
// // // // // //                 onChange: (v) => setForm({ ...form, entryDate: v }),
// // // // // //               },
// // // // // //               {
// // // // // //                 label: "Invoice No",
// // // // // //                 type: "text",
// // // // // //                 key: "invoiceNo",
// // // // // //                 readOnly: true,
// // // // // //               },
// // // // // //               {
// // // // // //                 label: "No. of Supporting",
// // // // // //                 type: "number",
// // // // // //                 key: "supporting",
// // // // // //                 onChange: (v) => setForm({ ...form, supporting: v }),
// // // // // //               },
// // // // // //               {
// // // // // //                 label: "GL Date",
// // // // // //                 type: "date",
// // // // // //                 key: "glDate",
// // // // // //                 onChange: (v) => setForm({ ...form, glDate: v }),
// // // // // //               },
// // // // // //             ].map(({ label, type, key, readOnly, onChange }) => (
// // // // // //               <div
// // // // // //                 key={key}
// // // // // //                 className="grid grid-cols-3 px-3 items-center py-2"
// // // // // //               >
// // // // // //                 <label className="font-bold text-sm text-gray-800">
// // // // // //                   {label}
// // // // // //                 </label>
// // // // // //                 <input
// // // // // //                   type={type}
// // // // // //                   value={form[key]}
// // // // // //                   readOnly={readOnly}
// // // // // //                   disabled={isSubmitting || readOnly}
// // // // // //                   onChange={(e) => onChange?.(e.target.value)}
// // // // // //                   className={`col-span-2 w-full border rounded py-1 ${readOnly ? "bg-gray-100" : "bg-white"}`}
// // // // // //                 />
// // // // // //               </div>
// // // // // //             ))}

// // // // // //             {/* Customer select-এর পরে এই block যোগ করো */}
// // // // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // // //               <label className="font-bold text-sm text-gray-800">Type</label>
// // // // // //               <select
// // // // // //                 value={form.inv_type}
// // // // // //                 onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
// // // // // //                 disabled={isSubmitting}
// // // // // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // // // // //               >
// // // // // //                 <option value="">Select type</option>
// // // // // //                 {invTypes.map((t) => (
// // // // // //                   <option key={t.ID} value={String(t.ID)}>
// // // // // //                     {t.DESCRIPTIO}
// // // // // //                   </option>
// // // // // //                 ))}
// // // // // //               </select>
// // // // // //             </div>

// // // // // //             <div className="grid grid-cols-3 px-3 items-center">
// // // // // //               <label className="font-bold text-sm text-gray-800">
// // // // // //                 Payment Code
// // // // // //               </label>
// // // // // //               <select
// // // // // //                 value={form.paymentCode}
// // // // // //                 onChange={(e) =>
// // // // // //                   setForm({ ...form, paymentCode: e.target.value })
// // // // // //                 }
// // // // // //                 disabled={isSubmitting}
// // // // // //                 className="col-span-2 w-full rounded py-1 border bg-white"
// // // // // //               >
// // // // // //                 <option value="">Select payment</option>
// // // // // //                 {PaymentCodes.map((c) => (
// // // // // //                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
// // // // // //                     {c.ACCOUNT_NAME}
// // // // // //                   </option>
// // // // // //                 ))}
// // // // // //               </select>
// // // // // //             </div>

// // // // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // // //               <label className="font-bold text-sm text-gray-800">
// // // // // //                 Total Amount
// // // // // //               </label>
// // // // // //               <input
// // // // // //                 type="number"
// // // // // //                 value={form.totalAmount.toFixed(2)}
// // // // // //                 readOnly
// // // // // //                 className="col-span-2 w-full border rounded py-1 bg-white"
// // // // // //               />
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Description */}
// // // // // //         <div className="mt-4 mb-4">
// // // // // //           <label className="font-bold text-sm text-gray-800 block mb-2 py-2 px-4 rounded-lg">
// // // // // //             Description
// // // // // //           </label>
// // // // // //           <textarea
// // // // // //             value={form.description}
// // // // // //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// // // // // //             disabled={isSubmitting}
// // // // // //             className="w-full mt-1 border rounded-lg px-3 py-2"
// // // // // //           />
// // // // // //         </div>

// // // // // //         {/* Add row inputs */}
// // // // // //         <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-4 rounded-lg items-center">
// // // // // //           <div className="grid grid-cols-3 px-3 items-center py-1">
// // // // // //             <label className="font-bold text-sm text-gray-800">
// // // // // //               Account ID
// // // // // //             </label>
// // // // // //             <Select
// // // // // //               options={accounts}
// // // // // //               className="col-span-2 border w-full rounded shadow-2xl"
// // // // // //               value={accounts.find((a) => a.value === form.accountId) || null}
// // // // // //               onChange={(s) =>
// // // // // //                 setForm({
// // // // // //                   ...form,
// // // // // //                   accountId: s?.value || "",
// // // // // //                   particular: s?.name || "",
// // // // // //                 })
// // // // // //               }
// // // // // //               placeholder="Enter account..."
// // // // // //               isClearable
// // // // // //               isSearchable
// // // // // //               isDisabled={isSubmitting}
// // // // // //               menuPortalTarget={document.body}
// // // // // //               styles={{
// // // // // //                 menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// // // // // //                 menu: (b) => ({
// // // // // //                   ...b,
// // // // // //                   backgroundColor: "white",
// // // // // //                   border: "1px solid #e5e7eb",
// // // // // //                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// // // // // //                 }),
// // // // // //               }}
// // // // // //             />
// // // // // //           </div>
// // // // // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // // //             <label className="font-bold text-sm text-gray-800">
// // // // // //               Particular
// // // // // //             </label>
// // // // // //             <input
// // // // // //               type="text"
// // // // // //               value={form.particular}
// // // // // //               readOnly
// // // // // //               className="col-span-2 border w-full rounded py-1 bg-white"
// // // // // //             />
// // // // // //           </div>
// // // // // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // // //             <label className="font-bold text-sm text-gray-800">Amount</label>
// // // // // //             <input
// // // // // //               type="number"
// // // // // //               value={form.amount}
// // // // // //               onChange={(e) => setForm({ ...form, amount: e.target.value })}
// // // // // //               disabled={isSubmitting}
// // // // // //               className="col-span-1 border w-full rounded py-1 bg-white"
// // // // // //             />
// // // // // //           </div>
// // // // // //           <div className="px-4 py-2">
// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={addRow}
// // // // // //               disabled={isSubmitting}
// // // // // //               className="cursor-pointer border px-3 py-1 rounded-lg flex items-center font-bold text-sm text-gray-800"
// // // // // //             >
// // // // // //               <span className="mr-1 font-extrabold">+</span>Add
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Rows table */}
// // // // // //         <div className="overflow-x-auto">
// // // // // //           <table className="w-full border-collapse rounded-lg text-xs md:text-sm">
// // // // // //             <thead>
// // // // // //               <tr className="bg-gray-50">
// // // // // //                 {["Account Code", "Particulars", "Amount", ""].map((h) => (
// // // // // //                   <th
// // // // // //                     key={h}
// // // // // //                     className="px-2 md:px-4 py-2 text-center font-bold text-sm text-gray-800"
// // // // // //                   >
// // // // // //                     {h}
// // // // // //                   </th>
// // // // // //                 ))}
// // // // // //               </tr>
// // // // // //             </thead>
// // // // // //             <tbody>
// // // // // //               {rows.map((row) => (
// // // // // //                 <tr key={row.id} className="border">
// // // // // //                   <td className="border px-2 md:px-4 py-2">
// // // // // //                     {row.accountCode}
// // // // // //                   </td>
// // // // // //                   <td className="border px-2 md:px-4 py-2">
// // // // // //                     {row.particulars}
// // // // // //                   </td>
// // // // // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // // // // //                     {Number(row.amount).toFixed(2)}
// // // // // //                   </td>
// // // // // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // // // // //                     {row.id !== "dummy" && (
// // // // // //                       <Button
// // // // // //                         type="button"
// // // // // //                         variant="ghost"
// // // // // //                         size="icon"
// // // // // //                         onClick={() => removeRow(row.id)}
// // // // // //                         disabled={isSubmitting}
// // // // // //                       >
// // // // // //                         <Trash2 className="w-4 h-4 text-red-500" />
// // // // // //                       </Button>
// // // // // //                     )}
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               ))}
// // // // // //               {rows.length > 0 && rows[0].id !== "dummy" && (
// // // // // //                 <tr className="font-semibold">
// // // // // //                   <td
// // // // // //                     colSpan="2"
// // // // // //                     className="p-2 text-right font-bold text-sm text-gray-800"
// // // // // //                   >
// // // // // //                     Total
// // // // // //                   </td>
// // // // // //                   <td className="border p-2 text-center">
// // // // // //                     {form.totalAmount.toFixed(2)}
// // // // // //                   </td>
// // // // // //                   <td />
// // // // // //                 </tr>
// // // // // //               )}
// // // // // //             </tbody>
// // // // // //           </table>
// // // // // //         </div>

// // // // // //         {/* Actions */}
// // // // // //         <div className="flex justify-end gap-4">
// // // // // //           <Button
// // // // // //             type="button"
// // // // // //             onClick={() => setShowModal(true)}
// // // // // //             disabled={isSubmitting}
// // // // // //           >
// // // // // //             {isSubmitting ? "Submitting..." : "Create"}
// // // // // //           </Button>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* ── Voucher Confirmation Modal ── */}
// // // // // //       {showModal && (
// // // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // // // //           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
// // // // // //             <h2 className="text-xl font-bold mb-4">
// // // // // //               Confirm Voucher Submission
// // // // // //             </h2>
// // // // // //             <div className="space-y-2">
// // // // // //               <p>
// // // // // //                 <strong>Entry Date:</strong> {form.entryDate}
// // // // // //               </p>
// // // // // //               <p>
// // // // // //                 <strong>No. of Supporting:</strong> {form.supporting}
// // // // // //               </p>
// // // // // //               <p>
// // // // // //                 <strong>Description:</strong> {form.description}
// // // // // //               </p>
// // // // // //               <p>
// // // // // //                 <strong>Supplier:</strong>{" "}
// // // // // //                 {
// // // // // //                   suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
// // // // // //                     ?.SUPPLIER_NAME
// // // // // //                 }
// // // // // //               </p>
// // // // // //               <p>
// // // // // //                 <strong>GL Date:</strong> {form.glDate}
// // // // // //               </p>
// // // // // //               <p>
// // // // // //                 <strong>Payment Code:</strong> {form.paymentCode}
// // // // // //               </p>
// // // // // //               {billFiles.length > 0 && (
// // // // // //                 <div>
// // // // // //                   <strong>Bills ({billFiles.length}):</strong>
// // // // // //                   <ul className="list-disc pl-5 text-sm text-gray-600">
// // // // // //                     {billFiles.map((f, i) => (
// // // // // //                       <li key={i}>{f.name}</li>
// // // // // //                     ))}
// // // // // //                   </ul>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //               <h3 className="font-semibold mt-2">Accounts:</h3>
// // // // // //               <ul className="list-disc pl-5">
// // // // // //                 {rows
// // // // // //                   .filter((r) => r.id !== "dummy")
// // // // // //                   .map((row, i) => (
// // // // // //                     <li key={i}>
// // // // // //                       {row.accountCode} - {row.particulars} - {row.amount}
// // // // // //                     </li>
// // // // // //                   ))}
// // // // // //               </ul>
// // // // // //               <p className="font-semibold mt-2">
// // // // // //                 Total: {form.totalAmount.toFixed(2)}
// // // // // //               </p>
// // // // // //             </div>
// // // // // //             <div className="flex justify-end mt-4 space-x-3">
// // // // // //               <button
// // // // // //                 onClick={() => setShowModal(false)}
// // // // // //                 className="px-4 py-2 rounded-lg bg-gray-300"
// // // // // //               >
// // // // // //                 Cancel
// // // // // //               </button>
// // // // // //               <button
// // // // // //                 onClick={handleSubmit}
// // // // // //                 disabled={isSubmitting}
// // // // // //                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
// // // // // //               >
// // // // // //                 {isSubmitting ? "Submitting..." : "Confirm"}
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}

// // // // // //       {/* ── Add Supplier Dialog Modal ── */}
// // // // // //       {showSupplierModal && (
// // // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // // // //           <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-[560px] max-h-[90vh] overflow-y-auto">
// // // // // //             {/* Modal Header */}
// // // // // //             <div className="flex items-center justify-between px-6 py-4 border-b">
// // // // // //               <div className="flex items-center gap-2">
// // // // // //                 <div className="p-1.5 rounded-lg bg-gray-100">
// // // // // //                   <Users size={18} className="text-gray-700" />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <h2 className="text-base font-bold text-gray-800">
// // // // // //                     Add New Supplier
// // // // // //                   </h2>
// // // // // //                   <p className="text-xs text-gray-500">
// // // // // //                     Create a new supplier record
// // // // // //                   </p>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //               <button
// // // // // //                 onClick={handleCloseSupplierModal}
// // // // // //                 disabled={isSupplierSaving}
// // // // // //                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// // // // // //               >
// // // // // //                 <X size={18} className="text-gray-500" />
// // // // // //               </button>
// // // // // //             </div>

// // // // // //             {/* Modal Form */}
// // // // // //             <form
// // // // // //               onSubmit={handleSupplierSubmit}
// // // // // //               className="px-6 py-5 space-y-4"
// // // // // //             >
// // // // // //               {/* Supplier Name */}
// // // // // //               <div>
// // // // // //                 <label className={labelCls}>
// // // // // //                   Supplier Name <span className="text-red-500">*</span>
// // // // // //                 </label>
// // // // // //                 <input
// // // // // //                   type="text"
// // // // // //                   value={supplierForm.supplierName}
// // // // // //                   onChange={(e) =>
// // // // // //                     setSupplierForm({
// // // // // //                       ...supplierForm,
// // // // // //                       supplierName: e.target.value,
// // // // // //                     })
// // // // // //                   }
// // // // // //                   placeholder="Enter supplier name"
// // // // // //                   disabled={isSupplierSaving}
// // // // // //                   className={inputCls}
// // // // // //                 />
// // // // // //                 {supplierErrors.supplierName && (
// // // // // //                   <p className={errCls}>{supplierErrors.supplierName}</p>
// // // // // //                 )}
// // // // // //               </div>

// // // // // //               {/* Contact Person + Phone */}
// // // // // //               <div className="grid grid-cols-2 gap-3">
// // // // // //                 <div>
// // // // // //                   <label className={labelCls}>Contact Person</label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={supplierForm.contactPerson}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSupplierForm({
// // // // // //                         ...supplierForm,
// // // // // //                         contactPerson: e.target.value,
// // // // // //                       })
// // // // // //                     }
// // // // // //                     placeholder="Contact person"
// // // // // //                     disabled={isSupplierSaving}
// // // // // //                     className={inputCls}
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label className={labelCls}>Phone</label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={supplierForm.phone}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSupplierForm({
// // // // // //                         ...supplierForm,
// // // // // //                         phone: e.target.value,
// // // // // //                       })
// // // // // //                     }
// // // // // //                     placeholder="Phone number"
// // // // // //                     disabled={isSupplierSaving}
// // // // // //                     className={inputCls}
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               {/* Mobile + Email */}
// // // // // //               <div className="grid grid-cols-2 gap-3">
// // // // // //                 <div>
// // // // // //                   <label className={labelCls}>Mobile</label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={supplierForm.mobile}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSupplierForm({
// // // // // //                         ...supplierForm,
// // // // // //                         mobile: e.target.value,
// // // // // //                       })
// // // // // //                     }
// // // // // //                     placeholder="Mobile number"
// // // // // //                     disabled={isSupplierSaving}
// // // // // //                     className={inputCls}
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label className={labelCls}>Email</label>
// // // // // //                   <input
// // // // // //                     type="email"
// // // // // //                     value={supplierForm.email}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSupplierForm({
// // // // // //                         ...supplierForm,
// // // // // //                         email: e.target.value,
// // // // // //                       })
// // // // // //                     }
// // // // // //                     placeholder="email@example.com"
// // // // // //                     disabled={isSupplierSaving}
// // // // // //                     className={inputCls}
// // // // // //                   />
// // // // // //                   {supplierErrors.email && (
// // // // // //                     <p className={errCls}>{supplierErrors.email}</p>
// // // // // //                   )}
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               {/* Address */}
// // // // // //               <div>
// // // // // //                 <label className={labelCls}>Address</label>
// // // // // //                 <textarea
// // // // // //                   value={supplierForm.address}
// // // // // //                   onChange={(e) =>
// // // // // //                     setSupplierForm({
// // // // // //                       ...supplierForm,
// // // // // //                       address: e.target.value,
// // // // // //                     })
// // // // // //                   }
// // // // // //                   placeholder="Supplier address"
// // // // // //                   rows={2}
// // // // // //                   disabled={isSupplierSaving}
// // // // // //                   className={`${inputCls} resize-none`}
// // // // // //                 />
// // // // // //               </div>

// // // // // //               {/* Remarks + Status */}
// // // // // //               <div className="grid grid-cols-2 gap-3">
// // // // // //                 <div>
// // // // // //                   <label className={labelCls}>Remarks</label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={supplierForm.remarks}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSupplierForm({
// // // // // //                         ...supplierForm,
// // // // // //                         remarks: e.target.value,
// // // // // //                       })
// // // // // //                     }
// // // // // //                     placeholder="Optional remarks"
// // // // // //                     disabled={isSupplierSaving}
// // // // // //                     className={inputCls}
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label className={labelCls}>
// // // // // //                     Status <span className="text-red-500">*</span>
// // // // // //                   </label>
// // // // // //                   <select
// // // // // //                     value={supplierForm.status}
// // // // // //                     onChange={(e) =>
// // // // // //                       setSupplierForm({
// // // // // //                         ...supplierForm,
// // // // // //                         status: e.target.value,
// // // // // //                       })
// // // // // //                     }
// // // // // //                     disabled={isSupplierSaving}
// // // // // //                     className={inputCls}
// // // // // //                   >
// // // // // //                     <option value="1">Active</option>
// // // // // //                     <option value="0">Inactive</option>
// // // // // //                   </select>
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               {/* Footer */}
// // // // // //               <div className="flex justify-end gap-2 pt-2 border-t mt-4">
// // // // // //                 <button
// // // // // //                   type="button"
// // // // // //                   onClick={handleCloseSupplierModal}
// // // // // //                   disabled={isSupplierSaving}
// // // // // //                   className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
// // // // // //                 >
// // // // // //                   Cancel
// // // // // //                 </button>
// // // // // //                 <button
// // // // // //                   type="submit"
// // // // // //                   disabled={isSupplierSaving}
// // // // // //                   className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
// // // // // //                 >
// // // // // //                   {isSupplierSaving ? "Creating..." : "Create Supplier"}
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </form>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </SectionContainer>
// // // // // //   );
// // // // // // };

// // // // // // export default PaymentCreate;


// // // // // import { useState, useEffect } from "react";
// // // // // import { ArrowLeft, Trash2, Users, X } from "lucide-react";
// // // // // import Select from "react-select";
// // // // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // // // import { toast } from "react-toastify";
// // // // // import axios from "axios";
// // // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // // import { useMutation } from "@tanstack/react-query";

// // // // // import { SectionContainer } from "@/components/SectionContainer";
// // // // // import { PaymentService } from "@/api/AccontingApi";
// // // // // import { Button } from "@/components/ui/button";
// // // // // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // // // // import { useCreateSupplier } from "@/features/supplier/queries";

// // // // // const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// // // // // const supplierDefault = {
// // // // //   supplierName: "",
// // // // //   contactPerson: "",
// // // // //   phone: "",
// // // // //   mobile: "",
// // // // //   email: "",
// // // // //   address: "",
// // // // //   remarks: "",
// // // // //   status: "1",
// // // // // };

// // // // // const PaymentCreate = () => {
// // // // //   const navigate = useNavigate();
// // // // //   const queryClient = useQueryClient();
// // // // //   const today = new Date().toISOString().split("T")[0];
// // // // //   const location = useLocation();

// // // // //   const [billFiles, setBillFiles] = useState([]);

// // // // //   const [rows, setRows] = useState([
// // // // //     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
// // // // //   ]);

// // // // //   const [showModal, setShowModal] = useState(false);
// // // // //   const [showSupplierModal, setShowSupplierModal] = useState(false);
// // // // //   const [supplierForm, setSupplierForm] = useState(supplierDefault);
// // // // //   const [supplierErrors, setSupplierErrors] = useState({});

// // // // //   const [form, setForm] = useState({
// // // // //     entryDate: today,
// // // // //     invoiceNo: "",
// // // // //     poNumber: "",          // 👈 নতুন
// // // // //     supporting: "",
// // // // //     description: "",
// // // // //     supplier: "",
// // // // //     glDate: today,
// // // // //     paymentCode: "",
// // // // //     accountId: "",
// // // // //     particular: "",
// // // // //     amount: "",
// // // // //     totalAmount: 0,
// // // // //     inv_type: "",
// // // // //   });

// // // // //   // ── Queries ──────────────────────────────────────────────────────────────────
// // // // //   const { data: suppliers = [] } = useQuery({
// // // // //     queryKey: ["suppliers"],
// // // // //     queryFn: async () =>
// // // // //       (await axios.get(`${url}/api/supplier-type`)).data.data || [],
// // // // //   });

// // // // //   const { data: PaymentCodes = [] } = useQuery({
// // // // //     queryKey: ["paymentCodes"],
// // // // //     queryFn: async () => {
// // // // //       const res = await axios.get(`${url}/api/receive-code`);
// // // // //       return res.data.success ? res.data.data || [] : [];
// // // // //     },
// // // // //   });

// // // // //   const { data: invTypes = [] } = useQuery({
// // // // //     queryKey: ["invTypes"],
// // // // //     queryFn: async () => {
// // // // //       const res = await axios.get(`${url}/api/inv-type`);
// // // // //       return res.data.data || [];
// // // // //     },
// // // // //   });

// // // // //   const { data: accounts = [] } = useQuery({
// // // // //     queryKey: ["accounts"],
// // // // //     queryFn: async () => {
// // // // //       const res = await axios.get(`${url}/api/account-code`);
// // // // //       return res.data.success === 1
// // // // //         ? res.data.data.map((a) => ({
// // // // //             value: a.ACCOUNT_ID,
// // // // //             label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
// // // // //             name: a.ACCOUNT_NAME,
// // // // //           }))
// // // // //         : [];
// // // // //     },
// // // // //   });

// // // // //   // ── Upload bills helper ──────────────────────────────────────────────────────
// // // // //   const uploadBills = async (glMasterId) => {
// // // // //     if (!billFiles.length || !glMasterId) return;
// // // // //     const uploads = billFiles.map((file) => {
// // // // //       const fd = new FormData();
// // // // //       fd.append("doc_file", file);
// // // // //       fd.append("GLMASTERID", glMasterId);
// // // // //       return axios.post(`${url}/api/gldoc`, fd);
// // // // //     });
// // // // //     await Promise.allSettled(uploads);
// // // // //   };

// // // // //   // ── Voucher Mutation ─────────────────────────────────────────────────────────
// // // // //   const mutation = useMutation({
// // // // //     mutationFn: async (payload) => {
// // // // //       const res = await PaymentService.insert(payload);
// // // // //       return res.data;
// // // // //     },
// // // // //     onSuccess: async (data) => {
// // // // //       if (data.status === "success") {
// // // // //         await uploadBills(data.masterID || data.id);
// // // // //         toast.success("Voucher created successfully!");
// // // // //         setBillFiles([]);
// // // // //         setForm({
// // // // //           entryDate: today,
// // // // //           invoiceNo: "",
// // // // //           poNumber: "",       // 👈 নতুন
// // // // //           supporting: "",
// // // // //           description: "",
// // // // //           supplier: "",
// // // // //           glDate: today,
// // // // //           paymentCode: "",
// // // // //           accountId: "",
// // // // //           particular: "",
// // // // //           amount: "",
// // // // //           totalAmount: 0,
// // // // //           inv_type: "",
// // // // //         });
// // // // //         setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
// // // // //         queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
// // // // //         navigate("/dashboard/payment-voucher");
// // // // //       } else {
// // // // //         toast.error("Error processing voucher.");
// // // // //       }
// // // // //     },
// // // // //     onError: () => toast.error("Error submitting voucher. Please try again."),
// // // // //     onSettled: () => setShowModal(false),
// // // // //   });

// // // // //   // ── Supplier Mutation ────────────────────────────────────────────────────────
// // // // //   const supplierMutation = useCreateSupplier();

// // // // //   const validateSupplier = () => {
// // // // //     const errs = {};
// // // // //     if (!supplierForm.supplierName.trim())
// // // // //       errs.supplierName = "Supplier name is required";
// // // // //     if (
// // // // //       supplierForm.email &&
// // // // //       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
// // // // //     )
// // // // //       errs.email = "Invalid email address";
// // // // //     setSupplierErrors(errs);
// // // // //     return Object.keys(errs).length === 0;
// // // // //   };

// // // // //   const handleSupplierSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!validateSupplier()) return;
// // // // //     try {
// // // // //       await supplierMutation.mutateAsync({
// // // // //         SUPPLIER_NAME: supplierForm.supplierName,
// // // // //         CONTACT_PERSON: supplierForm.contactPerson || null,
// // // // //         PHONE: supplierForm.phone || null,
// // // // //         MOBILE: supplierForm.mobile || null,
// // // // //         EMAIL: supplierForm.email || null,
// // // // //         ADDRESS: supplierForm.address || null,
// // // // //         REMARKS: supplierForm.remarks || null,
// // // // //         STATUS: Number(supplierForm.status),
// // // // //         ENTRY_BY: null,
// // // // //         PASSWORD: null,
// // // // //         ORG_ID: null,
// // // // //         DUE: null,
// // // // //         FAX: null,
// // // // //       });
// // // // //       toast.success("Supplier created successfully!");
// // // // //       queryClient.invalidateQueries(["suppliers"]);
// // // // //       setSupplierForm(supplierDefault);
// // // // //       setSupplierErrors({});
// // // // //       setShowSupplierModal(false);
// // // // //     } catch (err) {
// // // // //       toast.error(err?.message || "Failed to create supplier.");
// // // // //     }
// // // // //   };

// // // // //   const handleCloseSupplierModal = () => {
// // // // //     setSupplierForm(supplierDefault);
// // // // //     setSupplierErrors({});
// // // // //     setShowSupplierModal(false);
// // // // //   };

// // // // //   // ── Row handlers ─────────────────────────────────────────────────────────────
// // // // //   const addRow = () => {
// // // // //     if (!form.accountId || !form.amount) {
// // // // //       toast.error("Please select account and enter amount");
// // // // //       return;
// // // // //     }
// // // // //     const account = accounts.find((a) => a.value === form.accountId);
// // // // //     const newRow = {
// // // // //       id: Date.now(),
// // // // //       accountCode: form.accountId,
// // // // //       particulars: form.particular || account?.label || "",
// // // // //       amount: parseFloat(form.amount),
// // // // //     };
// // // // //     const updated =
// // // // //       rows.length === 1 && rows[0].id === "dummy"
// // // // //         ? [newRow]
// // // // //         : [...rows, newRow];
// // // // //     setRows(updated);
// // // // //     setForm({
// // // // //       ...form,
// // // // //       accountId: "",
// // // // //       particular: "",
// // // // //       amount: "",
// // // // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
// // // // //     });
// // // // //   };

// // // // //   const removeRow = (id) => {
// // // // //     const updated = rows.filter((r) => r.id !== id);
// // // // //     setRows(updated);
// // // // //     setForm({
// // // // //       ...form,
// // // // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
// // // // //     });
// // // // //   };

// // // // //   // ── Prefill from Purchase Recognition's "Create Payment" button ────────────
// // // // //   useEffect(() => {
// // // // //     const incoming = location.state;
// // // // //     if (!incoming) return;

// // // // //    setForm((f) => ({
// // // // //   ...f,
// // // // //   supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
// // // // //   entryDate: incoming.entryDate || f.entryDate,
// // // // //   glDate: incoming.glDate || f.glDate,
// // // // //   description: incoming.description || f.description,
// // // // //   invoiceNo: incoming.invoiceNo || f.invoiceNo,
// // // // //   poNumber: incoming.poNumber || f.poNumber,
// // // // //   inv_type: incoming.invType || f.inv_type,           // 👈 নতুন
// // // // //   paymentCode: incoming.paymentCode || f.paymentCode, // 👈 নতুন
// // // // // }));
// // // // //     // rows intentionally left untouched — user adds Account/Particular/Amount manually
// // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // //   }, []);

// // // // //   // ── Voucher Submit ───────────────────────────────────────────────────────────
// // // // //   const handleSubmit = () => {
// // // // //     if (
// // // // //       !form.entryDate ||
// // // // //       !form.glDate ||
// // // // //       !form.paymentCode ||
// // // // //       !form.supplier ||
// // // // //       rows.length === 0 ||
// // // // //       rows[0].id === "dummy"
// // // // //     ) {
// // // // //       toast.error("Please fill all required fields and add at least one row.");
// // // // //       return;
// // // // //     }
// // // // //     if (rows.some((r) => !r.accountCode || !r.particulars)) {
// // // // //       toast.error("Each row must have Account Code and Particular filled.");
// // // // //       return;
// // // // //     }
// // // // //     mutation.mutate({
// // // // //       trans_date: form.entryDate,
// // // // //       gl_date: form.glDate,
// // // // //       receive_desc: form.description,
// // // // //       supporting: String(form.supporting),
// // // // //       receive: form.paymentCode,
// // // // //       supplierid: form.supplier,
// // // // //       user_id: "1",
// // // // //       totalAmount: String(form.totalAmount),
// // // // //       accountID: rows.map((r) => r.accountCode),
// // // // //       amount2: rows.map((r) => String(r.amount || 0)),
// // // // //       inv_type: form.inv_type ? Number(form.inv_type) : null,
// // // // //       po_number: form.poNumber || null,   // 👈 নতুন
// // // // //     });
// // // // //   };

// // // // //   const isSubmitting = mutation.isPending;
// // // // //   const isSupplierSaving = supplierMutation.isPending;

// // // // //   const inputCls =
// // // // //     "w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400";
// // // // //   const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
// // // // //   const errCls = "text-xs text-red-500 mt-0.5";

// // // // //   return (
// // // // //     <SectionContainer>
// // // // //       <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
// // // // //         {/* Header */}
// // // // //         <div className="flex items-center justify-between mb-6">
// // // // //           <h2 className="font-semibold text-sm text-gray-800">
// // // // //             Create Payment Voucher
// // // // //           </h2>
// // // // //           <div className="flex items-center gap-2">
// // // // //             <Button
// // // // //               variant="outline"
// // // // //               onClick={() => setShowSupplierModal(true)}
// // // // //             >
// // // // //               <Users size={15} className="mr-1" /> + Supplier
// // // // //             </Button>
// // // // //             <Button variant="outline" onClick={() => navigate("/dashboard/payment-voucher")}>
// // // // //               <ArrowLeft size={16} className="mr-2" /> Back
// // // // //             </Button>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Top grid */}
// // // // //         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 bg-white rounded-lg">
// // // // //           <div className="border rounded-lg p-3 bg-gray-50">
// // // // //             <BillUploadPanel
// // // // //               files={billFiles}
// // // // //               onChange={setBillFiles}
// // // // //               disabled={isSubmitting}
// // // // //             />
// // // // //           </div>

// // // // //           <div>
// // // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // //               <label className="font-bold text-sm text-gray-800">
// // // // //                 Supplier
// // // // //               </label>
// // // // //               <select
// // // // //                 value={form.supplier}
// // // // //                 onChange={(e) => setForm({ ...form, supplier: e.target.value })}
// // // // //                 disabled={isSubmitting}
// // // // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // // // //               >
// // // // //                 <option value="">Select supplier</option>
// // // // //                 {suppliers.map((s) => (
// // // // //                   <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
// // // // //                     {s.SUPPLIER_NAME}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div>
// // // // //             {[
// // // // //               {
// // // // //                 label: "Entry Date",
// // // // //                 type: "date",
// // // // //                 key: "entryDate",
// // // // //                 onChange: (v) => setForm({ ...form, entryDate: v }),
// // // // //               },
// // // // //               {
// // // // //                 label: "Invoice No",
// // // // //                 type: "text",
// // // // //                 key: "invoiceNo",
// // // // //                 readOnly: true,
// // // // //               },
// // // // //               {
// // // // //                 label: "PO Number",        // 👈 নতুন
// // // // //                 type: "text",
// // // // //                 key: "poNumber",
// // // // //                 readOnly: true,
// // // // //               },
// // // // //               {
// // // // //                 label: "No. of Supporting",
// // // // //                 type: "number",
// // // // //                 key: "supporting",
// // // // //                 onChange: (v) => setForm({ ...form, supporting: v }),
// // // // //               },
// // // // //               {
// // // // //                 label: "GL Date",
// // // // //                 type: "date",
// // // // //                 key: "glDate",
// // // // //                 onChange: (v) => setForm({ ...form, glDate: v }),
// // // // //               },
// // // // //             ].map(({ label, type, key, readOnly, onChange }) => (
// // // // //               <div
// // // // //                 key={key}
// // // // //                 className="grid grid-cols-3 px-3 items-center py-2"
// // // // //               >
// // // // //                 <label className="font-bold text-sm text-gray-800">
// // // // //                   {label}
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type={type}
// // // // //                   value={form[key]}
// // // // //                   readOnly={readOnly}
// // // // //                   disabled={isSubmitting || readOnly}
// // // // //                   onChange={(e) => onChange?.(e.target.value)}
// // // // //                   className={`col-span-2 w-full border rounded py-1 ${readOnly ? "bg-gray-100" : "bg-white"}`}
// // // // //                 />
// // // // //               </div>
// // // // //             ))}

// // // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // //               <label className="font-bold text-sm text-gray-800">Type</label>
// // // // //               <select
// // // // //                 value={form.inv_type}
// // // // //                 onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
// // // // //                 disabled={isSubmitting}
// // // // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // // // //               >
// // // // //                 <option value="">Select type</option>
// // // // //                 {invTypes.map((t) => (
// // // // //                   <option key={t.ID} value={String(t.ID)}>
// // // // //                     {t.DESCRIPTIO}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>

// // // // //             <div className="grid grid-cols-3 px-3 items-center">
// // // // //               <label className="font-bold text-sm text-gray-800">
// // // // //                 Payment Code
// // // // //               </label>
// // // // //               <select
// // // // //                 value={form.paymentCode}
// // // // //                 onChange={(e) =>
// // // // //                   setForm({ ...form, paymentCode: e.target.value })
// // // // //                 }
// // // // //                 disabled={isSubmitting}
// // // // //                 className="col-span-2 w-full rounded py-1 border bg-white"
// // // // //               >
// // // // //                 <option value="">Select payment</option>
// // // // //                 {PaymentCodes.map((c) => (
// // // // //                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
// // // // //                     {c.ACCOUNT_NAME}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>

// // // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // //               <label className="font-bold text-sm text-gray-800">
// // // // //                 Total Amount
// // // // //               </label>
// // // // //               <input
// // // // //                 type="number"
// // // // //                 value={form.totalAmount.toFixed(2)}
// // // // //                 readOnly
// // // // //                 className="col-span-2 w-full border rounded py-1 bg-white"
// // // // //               />
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Description */}
// // // // //         <div className="mt-4 mb-4">
// // // // //           <label className="font-bold text-sm text-gray-800 block mb-2 py-2 px-4 rounded-lg">
// // // // //             Description
// // // // //           </label>
// // // // //           <textarea
// // // // //             value={form.description}
// // // // //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// // // // //             disabled={isSubmitting}
// // // // //             className="w-full mt-1 border rounded-lg px-3 py-2"
// // // // //           />
// // // // //         </div>

// // // // //         {/* Add row inputs */}
// // // // //         <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-4 rounded-lg items-center">
// // // // //           <div className="grid grid-cols-3 px-3 items-center py-1">
// // // // //             <label className="font-bold text-sm text-gray-800">
// // // // //               Account ID
// // // // //             </label>
// // // // //             <Select
// // // // //               options={accounts}
// // // // //               className="col-span-2 border w-full rounded shadow-2xl"
// // // // //               value={accounts.find((a) => a.value === form.accountId) || null}
// // // // //               onChange={(s) =>
// // // // //                 setForm({
// // // // //                   ...form,
// // // // //                   accountId: s?.value || "",
// // // // //                   particular: s?.name || "",
// // // // //                 })
// // // // //               }
// // // // //               placeholder="Enter account..."
// // // // //               isClearable
// // // // //               isSearchable
// // // // //               isDisabled={isSubmitting}
// // // // //               menuPortalTarget={document.body}
// // // // //               styles={{
// // // // //                 menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// // // // //                 menu: (b) => ({
// // // // //                   ...b,
// // // // //                   backgroundColor: "white",
// // // // //                   border: "1px solid #e5e7eb",
// // // // //                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// // // // //                 }),
// // // // //               }}
// // // // //             />
// // // // //           </div>
// // // // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // //             <label className="font-bold text-sm text-gray-800">
// // // // //               Particular
// // // // //             </label>
// // // // //             <input
// // // // //               type="text"
// // // // //               value={form.particular}
// // // // //               readOnly
// // // // //               className="col-span-2 border w-full rounded py-1 bg-white"
// // // // //             />
// // // // //           </div>
// // // // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // // // //             <label className="font-bold text-sm text-gray-800">Amount</label>
// // // // //             <input
// // // // //               type="number"
// // // // //               value={form.amount}
// // // // //               onChange={(e) => setForm({ ...form, amount: e.target.value })}
// // // // //               disabled={isSubmitting}
// // // // //               className="col-span-1 border w-full rounded py-1 bg-white"
// // // // //             />
// // // // //           </div>
// // // // //           <div className="px-4 py-2">
// // // // //             <button
// // // // //               type="button"
// // // // //               onClick={addRow}
// // // // //               disabled={isSubmitting}
// // // // //               className="cursor-pointer border px-3 py-1 rounded-lg flex items-center font-bold text-sm text-gray-800"
// // // // //             >
// // // // //               <span className="mr-1 font-extrabold">+</span>Add
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Rows table */}
// // // // //         <div className="overflow-x-auto">
// // // // //           <table className="w-full border-collapse rounded-lg text-xs md:text-sm">
// // // // //             <thead>
// // // // //               <tr className="bg-gray-50">
// // // // //                 {["Account Code", "Particulars", "Amount", ""].map((h) => (
// // // // //                   <th
// // // // //                     key={h}
// // // // //                     className="px-2 md:px-4 py-2 text-center font-bold text-sm text-gray-800"
// // // // //                   >
// // // // //                     {h}
// // // // //                   </th>
// // // // //                 ))}
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody>
// // // // //               {rows.map((row) => (
// // // // //                 <tr key={row.id} className="border">
// // // // //                   <td className="border px-2 md:px-4 py-2">
// // // // //                     {row.accountCode}
// // // // //                   </td>
// // // // //                   <td className="border px-2 md:px-4 py-2">
// // // // //                     {row.particulars}
// // // // //                   </td>
// // // // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // // // //                     {Number(row.amount).toFixed(2)}
// // // // //                   </td>
// // // // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // // // //                     {row.id !== "dummy" && (
// // // // //                       <Button
// // // // //                         type="button"
// // // // //                         variant="ghost"
// // // // //                         size="icon"
// // // // //                         onClick={() => removeRow(row.id)}
// // // // //                         disabled={isSubmitting}
// // // // //                       >
// // // // //                         <Trash2 className="w-4 h-4 text-red-500" />
// // // // //                       </Button>
// // // // //                     )}
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ))}
// // // // //               {rows.length > 0 && rows[0].id !== "dummy" && (
// // // // //                 <tr className="font-semibold">
// // // // //                   <td
// // // // //                     colSpan="2"
// // // // //                     className="p-2 text-right font-bold text-sm text-gray-800"
// // // // //                   >
// // // // //                     Total
// // // // //                   </td>
// // // // //                   <td className="border p-2 text-center">
// // // // //                     {form.totalAmount.toFixed(2)}
// // // // //                   </td>
// // // // //                   <td />
// // // // //                 </tr>
// // // // //               )}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>

// // // // //         {/* Actions */}
// // // // //         <div className="flex justify-end gap-4">
// // // // //           <Button
// // // // //             type="button"
// // // // //             onClick={() => setShowModal(true)}
// // // // //             disabled={isSubmitting}
// // // // //           >
// // // // //             {isSubmitting ? "Submitting..." : "Create"}
// // // // //           </Button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* ── Voucher Confirmation Modal ── */}
// // // // //       {showModal && (
// // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // // //           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
// // // // //             <h2 className="text-xl font-bold mb-4">
// // // // //               Confirm Voucher Submission
// // // // //             </h2>
// // // // //             <div className="space-y-2">
// // // // //               <p><strong>Entry Date:</strong> {form.entryDate}</p>
// // // // //               <p><strong>PO Number:</strong> {form.poNumber || "—"}</p>
// // // // //               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
// // // // //               <p><strong>Description:</strong> {form.description}</p>
// // // // //               <p>
// // // // //                 <strong>Supplier:</strong>{" "}
// // // // //                 {
// // // // //                   suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
// // // // //                     ?.SUPPLIER_NAME
// // // // //                 }
// // // // //               </p>
// // // // //               <p><strong>GL Date:</strong> {form.glDate}</p>
// // // // //               <p><strong>Payment Code:</strong> {form.paymentCode}</p>
// // // // //               {billFiles.length > 0 && (
// // // // //                 <div>
// // // // //                   <strong>Bills ({billFiles.length}):</strong>
// // // // //                   <ul className="list-disc pl-5 text-sm text-gray-600">
// // // // //                     {billFiles.map((f, i) => (
// // // // //                       <li key={i}>{f.name}</li>
// // // // //                     ))}
// // // // //                   </ul>
// // // // //                 </div>
// // // // //               )}
// // // // //               <h3 className="font-semibold mt-2">Accounts:</h3>
// // // // //               <ul className="list-disc pl-5">
// // // // //                 {rows
// // // // //                   .filter((r) => r.id !== "dummy")
// // // // //                   .map((row, i) => (
// // // // //                     <li key={i}>
// // // // //                       {row.accountCode} - {row.particulars} - {row.amount}
// // // // //                     </li>
// // // // //                   ))}
// // // // //               </ul>
// // // // //               <p className="font-semibold mt-2">
// // // // //                 Total: {form.totalAmount.toFixed(2)}
// // // // //               </p>
// // // // //             </div>
// // // // //             <div className="flex justify-end mt-4 space-x-3">
// // // // //               <button
// // // // //                 onClick={() => setShowModal(false)}
// // // // //                 className="px-4 py-2 rounded-lg bg-gray-300"
// // // // //               >
// // // // //                 Cancel
// // // // //               </button>
// // // // //               <button
// // // // //                 onClick={handleSubmit}
// // // // //                 disabled={isSubmitting}
// // // // //                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
// // // // //               >
// // // // //                 {isSubmitting ? "Submitting..." : "Confirm"}
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ── Add Supplier Dialog Modal ── */}
// // // // //       {showSupplierModal && (
// // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // // //           <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-[560px] max-h-[90vh] overflow-y-auto">
// // // // //             <div className="flex items-center justify-between px-6 py-4 border-b">
// // // // //               <div className="flex items-center gap-2">
// // // // //                 <div className="p-1.5 rounded-lg bg-gray-100">
// // // // //                   <Users size={18} className="text-gray-700" />
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <h2 className="text-base font-bold text-gray-800">
// // // // //                     Add New Supplier
// // // // //                   </h2>
// // // // //                   <p className="text-xs text-gray-500">
// // // // //                     Create a new supplier record
// // // // //                   </p>
// // // // //                 </div>
// // // // //               </div>
// // // // //               <button
// // // // //                 onClick={handleCloseSupplierModal}
// // // // //                 disabled={isSupplierSaving}
// // // // //                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// // // // //               >
// // // // //                 <X size={18} className="text-gray-500" />
// // // // //               </button>
// // // // //             </div>

// // // // //             <form
// // // // //               onSubmit={handleSupplierSubmit}
// // // // //               className="px-6 py-5 space-y-4"
// // // // //             >
// // // // //               <div>
// // // // //                 <label className={labelCls}>
// // // // //                   Supplier Name <span className="text-red-500">*</span>
// // // // //                 </label>
// // // // //                 <input
// // // // //                   type="text"
// // // // //                   value={supplierForm.supplierName}
// // // // //                   onChange={(e) =>
// // // // //                     setSupplierForm({
// // // // //                       ...supplierForm,
// // // // //                       supplierName: e.target.value,
// // // // //                     })
// // // // //                   }
// // // // //                   placeholder="Enter supplier name"
// // // // //                   disabled={isSupplierSaving}
// // // // //                   className={inputCls}
// // // // //                 />
// // // // //                 {supplierErrors.supplierName && (
// // // // //                   <p className={errCls}>{supplierErrors.supplierName}</p>
// // // // //                 )}
// // // // //               </div>

// // // // //               <div className="grid grid-cols-2 gap-3">
// // // // //                 <div>
// // // // //                   <label className={labelCls}>Contact Person</label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={supplierForm.contactPerson}
// // // // //                     onChange={(e) =>
// // // // //                       setSupplierForm({
// // // // //                         ...supplierForm,
// // // // //                         contactPerson: e.target.value,
// // // // //                       })
// // // // //                     }
// // // // //                     placeholder="Contact person"
// // // // //                     disabled={isSupplierSaving}
// // // // //                     className={inputCls}
// // // // //                   />
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <label className={labelCls}>Phone</label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={supplierForm.phone}
// // // // //                     onChange={(e) =>
// // // // //                       setSupplierForm({
// // // // //                         ...supplierForm,
// // // // //                         phone: e.target.value,
// // // // //                       })
// // // // //                     }
// // // // //                     placeholder="Phone number"
// // // // //                     disabled={isSupplierSaving}
// // // // //                     className={inputCls}
// // // // //                   />
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="grid grid-cols-2 gap-3">
// // // // //                 <div>
// // // // //                   <label className={labelCls}>Mobile</label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={supplierForm.mobile}
// // // // //                     onChange={(e) =>
// // // // //                       setSupplierForm({
// // // // //                         ...supplierForm,
// // // // //                         mobile: e.target.value,
// // // // //                       })
// // // // //                     }
// // // // //                     placeholder="Mobile number"
// // // // //                     disabled={isSupplierSaving}
// // // // //                     className={inputCls}
// // // // //                   />
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <label className={labelCls}>Email</label>
// // // // //                   <input
// // // // //                     type="email"
// // // // //                     value={supplierForm.email}
// // // // //                     onChange={(e) =>
// // // // //                       setSupplierForm({
// // // // //                         ...supplierForm,
// // // // //                         email: e.target.value,
// // // // //                       })
// // // // //                     }
// // // // //                     placeholder="email@example.com"
// // // // //                     disabled={isSupplierSaving}
// // // // //                     className={inputCls}
// // // // //                   />
// // // // //                   {supplierErrors.email && (
// // // // //                     <p className={errCls}>{supplierErrors.email}</p>
// // // // //                   )}
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div>
// // // // //                 <label className={labelCls}>Address</label>
// // // // //                 <textarea
// // // // //                   value={supplierForm.address}
// // // // //                   onChange={(e) =>
// // // // //                     setSupplierForm({
// // // // //                       ...supplierForm,
// // // // //                       address: e.target.value,
// // // // //                     })
// // // // //                   }
// // // // //                   placeholder="Supplier address"
// // // // //                   rows={2}
// // // // //                   disabled={isSupplierSaving}
// // // // //                   className={`${inputCls} resize-none`}
// // // // //                 />
// // // // //               </div>

// // // // //               <div className="grid grid-cols-2 gap-3">
// // // // //                 <div>
// // // // //                   <label className={labelCls}>Remarks</label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={supplierForm.remarks}
// // // // //                     onChange={(e) =>
// // // // //                       setSupplierForm({
// // // // //                         ...supplierForm,
// // // // //                         remarks: e.target.value,
// // // // //                       })
// // // // //                     }
// // // // //                     placeholder="Optional remarks"
// // // // //                     disabled={isSupplierSaving}
// // // // //                     className={inputCls}
// // // // //                   />
// // // // //                 </div>
// // // // //                 <div>
// // // // //                   <label className={labelCls}>
// // // // //                     Status <span className="text-red-500">*</span>
// // // // //                   </label>
// // // // //                   <select
// // // // //                     value={supplierForm.status}
// // // // //                     onChange={(e) =>
// // // // //                       setSupplierForm({
// // // // //                         ...supplierForm,
// // // // //                         status: e.target.value,
// // // // //                       })
// // // // //                     }
// // // // //                     disabled={isSupplierSaving}
// // // // //                     className={inputCls}
// // // // //                   >
// // // // //                     <option value="1">Active</option>
// // // // //                     <option value="0">Inactive</option>
// // // // //                   </select>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="flex justify-end gap-2 pt-2 border-t mt-4">
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={handleCloseSupplierModal}
// // // // //                   disabled={isSupplierSaving}
// // // // //                   className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
// // // // //                 >
// // // // //                   Cancel
// // // // //                 </button>
// // // // //                 <button
// // // // //                   type="submit"
// // // // //                   disabled={isSupplierSaving}
// // // // //                   className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
// // // // //                 >
// // // // //                   {isSupplierSaving ? "Creating..." : "Create Supplier"}
// // // // //                 </button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </SectionContainer>
// // // // //   );
// // // // // };

// // // // // export default PaymentCreate;


// // // // import { useState, useEffect } from "react";
// // // // import { ArrowLeft, Trash2, Users, X } from "lucide-react";
// // // // import Select from "react-select";
// // // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // // import { toast } from "react-toastify";
// // // // import axios from "axios";
// // // // import { useNavigate, useLocation } from "react-router-dom";
// // // // import { useMutation } from "@tanstack/react-query";

// // // // import { SectionContainer } from "@/components/SectionContainer";
// // // // import { PaymentService } from "@/api/AccontingApi";
// // // // import { Button } from "@/components/ui/button";
// // // // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // // // import { useCreateSupplier } from "@/features/supplier/queries";

// // // // const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// // // // const supplierDefault = {
// // // //   supplierName: "",
// // // //   contactPerson: "",
// // // //   phone: "",
// // // //   mobile: "",
// // // //   email: "",
// // // //   address: "",
// // // //   remarks: "",
// // // //   status: "1",
// // // // };

// // // // const PaymentCreate = () => {
// // // //   const navigate = useNavigate();
// // // //   const queryClient = useQueryClient();
// // // //   const today = new Date().toISOString().split("T")[0];
// // // //   const location = useLocation();

// // // //   const [billFiles, setBillFiles] = useState([]);

// // // //   const [rows, setRows] = useState([
// // // //     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
// // // //   ]);

// // // //   const [showModal, setShowModal] = useState(false);
// // // //   const [showSupplierModal, setShowSupplierModal] = useState(false);
// // // //   const [supplierForm, setSupplierForm] = useState(supplierDefault);
// // // //   const [supplierErrors, setSupplierErrors] = useState({});

// // // //   const [form, setForm] = useState({
// // // //     entryDate: today,
// // // //     invoiceNo: "",
// // // //     poNumber: "",
// // // //     supporting: "",
// // // //     description: "",
// // // //     supplier: "",
// // // //     glDate: today,
// // // //     paymentCode: "",
// // // //     accountId: "",
// // // //     particular: "",
// // // //     amount: "",
// // // //     totalAmount: 0,
// // // //     inv_type: "",
// // // //   });

// // // //   // ── Queries ──────────────────────────────────────────────────────────────────
// // // //   const { data: suppliers = [] } = useQuery({
// // // //     queryKey: ["suppliers"],
// // // //     queryFn: async () =>
// // // //       (await axios.get(`${url}/api/supplier-type`)).data.data || [],
// // // //   });

// // // //   const { data: PaymentCodes = [] } = useQuery({
// // // //     queryKey: ["paymentCodes"],
// // // //     queryFn: async () => {
// // // //       const res = await axios.get(`${url}/api/receive-code`);
// // // //       return res.data.success ? res.data.data || [] : [];
// // // //     },
// // // //   });

// // // //   const { data: invTypes = [] } = useQuery({
// // // //     queryKey: ["invTypes"],
// // // //     queryFn: async () => {
// // // //       const res = await axios.get(`${url}/api/inv-type`);
// // // //       return res.data.data || [];
// // // //     },
// // // //   });

// // // //   const { data: accounts = [] } = useQuery({
// // // //     queryKey: ["accounts"],
// // // //     queryFn: async () => {
// // // //       const res = await axios.get(`${url}/api/account-code`);
// // // //       return res.data.success === 1
// // // //         ? res.data.data.map((a) => ({
// // // //             value: a.ACCOUNT_ID,
// // // //             label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
// // // //             name: a.ACCOUNT_NAME,
// // // //           }))
// // // //         : [];
// // // //     },
// // // //   });

// // // //   // ── Upload bills helper ──────────────────────────────────────────────────────
// // // //   const uploadBills = async (glMasterId) => {
// // // //     if (!billFiles.length || !glMasterId) return;
// // // //     const uploads = billFiles.map((file) => {
// // // //       const fd = new FormData();
// // // //       fd.append("doc_file", file);
// // // //       fd.append("GLMASTERID", glMasterId);
// // // //       return axios.post(`${url}/api/gldoc`, fd);
// // // //     });
// // // //     await Promise.allSettled(uploads);
// // // //   };

// // // //   // ── Voucher Mutation ─────────────────────────────────────────────────────────
// // // //   const mutation = useMutation({
// // // //     mutationFn: async (payload) => {
// // // //       const res = await PaymentService.insert(payload);
// // // //       return res.data;
// // // //     },
// // // //     onSuccess: async (data) => {
// // // //       if (data.status === "success") {
// // // //         await uploadBills(data.masterID || data.id);
// // // //         toast.success("Voucher created successfully!");
// // // //         setBillFiles([]);
// // // //         setForm({
// // // //           entryDate: today,
// // // //           invoiceNo: "",
// // // //           poNumber: "",
// // // //           supporting: "",
// // // //           description: "",
// // // //           supplier: "",
// // // //           glDate: today,
// // // //           paymentCode: "",
// // // //           accountId: "",
// // // //           particular: "",
// // // //           amount: "",
// // // //           totalAmount: 0,
// // // //           inv_type: "",
// // // //         });
// // // //         setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
// // // //         queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
// // // //         navigate("/dashboard/payment-voucher");
// // // //       } else {
// // // //         toast.error("Error processing voucher.");
// // // //       }
// // // //     },
// // // //     onError: () => toast.error("Error submitting voucher. Please try again."),
// // // //     onSettled: () => setShowModal(false),
// // // //   });

// // // //   // ── Supplier Mutation ────────────────────────────────────────────────────────
// // // //   const supplierMutation = useCreateSupplier();

// // // //   const validateSupplier = () => {
// // // //     const errs = {};
// // // //     if (!supplierForm.supplierName.trim())
// // // //       errs.supplierName = "Supplier name is required";
// // // //     if (
// // // //       supplierForm.email &&
// // // //       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
// // // //     )
// // // //       errs.email = "Invalid email address";
// // // //     setSupplierErrors(errs);
// // // //     return Object.keys(errs).length === 0;
// // // //   };

// // // //   const handleSupplierSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!validateSupplier()) return;
// // // //     try {
// // // //       await supplierMutation.mutateAsync({
// // // //         SUPPLIER_NAME: supplierForm.supplierName,
// // // //         CONTACT_PERSON: supplierForm.contactPerson || null,
// // // //         PHONE: supplierForm.phone || null,
// // // //         MOBILE: supplierForm.mobile || null,
// // // //         EMAIL: supplierForm.email || null,
// // // //         ADDRESS: supplierForm.address || null,
// // // //         REMARKS: supplierForm.remarks || null,
// // // //         STATUS: Number(supplierForm.status),
// // // //         ENTRY_BY: null,
// // // //         PASSWORD: null,
// // // //         ORG_ID: null,
// // // //         DUE: null,
// // // //         FAX: null,
// // // //       });
// // // //       toast.success("Supplier created successfully!");
// // // //       queryClient.invalidateQueries(["suppliers"]);
// // // //       setSupplierForm(supplierDefault);
// // // //       setSupplierErrors({});
// // // //       setShowSupplierModal(false);
// // // //     } catch (err) {
// // // //       toast.error(err?.message || "Failed to create supplier.");
// // // //     }
// // // //   };

// // // //   const handleCloseSupplierModal = () => {
// // // //     setSupplierForm(supplierDefault);
// // // //     setSupplierErrors({});
// // // //     setShowSupplierModal(false);
// // // //   };

// // // //   // ── Row handlers ─────────────────────────────────────────────────────────────
// // // //   const addRow = () => {
// // // //     if (!form.accountId || !form.amount) {
// // // //       toast.error("Please select account and enter amount");
// // // //       return;
// // // //     }
// // // //     const account = accounts.find((a) => a.value === form.accountId);
// // // //     const newRow = {
// // // //       id: Date.now(),
// // // //       accountCode: form.accountId,
// // // //       particulars: form.particular || account?.label || "",
// // // //       amount: parseFloat(form.amount),
// // // //     };
// // // //     const updated =
// // // //       rows.length === 1 && rows[0].id === "dummy"
// // // //         ? [newRow]
// // // //         : [...rows, newRow];
// // // //     setRows(updated);
// // // //     setForm({
// // // //       ...form,
// // // //       accountId: "",
// // // //       particular: "",
// // // //       amount: "",
// // // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
// // // //     });
// // // //   };

// // // //   const removeRow = (id) => {
// // // //     const updated = rows.filter((r) => r.id !== id);
// // // //     setRows(updated);
// // // //     setForm({
// // // //       ...form,
// // // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
// // // //     });
// // // //   };

// // // //   // ── Prefill from Purchase Recognition's "Create Payment" OR
// // // //   //    Inventory's "Payment Voucher" button ─────────────────────────────────
// // // //   useEffect(() => {
// // // //     const incoming = location.state;
// // // //     if (!incoming) return;

// // // //     setForm((f) => ({
// // // //       ...f,
// // // //       supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
// // // //       entryDate: incoming.entryDate || f.entryDate,
// // // //       glDate: incoming.glDate || f.glDate,
// // // //       description: incoming.description || f.description,
// // // //       invoiceNo: incoming.invoiceNo || f.invoiceNo,
// // // //       poNumber: incoming.poNumber || f.poNumber,
// // // //       inv_type: incoming.invType || f.inv_type,
// // // //       paymentCode: incoming.paymentCode || f.paymentCode,
// // // //     }));

// // // //     // ✅ Inventory theke ashle (ba PR theke rows sathe ashle) — total ekta
// // // //     //    row hishebe prefill hobe, user Account ID nijei select korbe
// // // //     if (incoming.rows?.length > 0) {
// // // //       const mappedRows = incoming.rows.map((r, i) => ({
// // // //         id: Date.now() + i,
// // // //         accountCode: "", // user Account ID manually select korbe
// // // //         particulars: r.particulars || "",
// // // //         amount: Number(r.amount || 0),
// // // //       }));
// // // //       setRows(mappedRows);
// // // //       setForm((f) => ({
// // // //         ...f,
// // // //         totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
// // // //       }));
// // // //     }
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, []);

// // // //   // ── Voucher Submit ───────────────────────────────────────────────────────────
// // // //   const handleSubmit = () => {
// // // //     if (
// // // //       !form.entryDate ||
// // // //       !form.glDate ||
// // // //       !form.paymentCode ||
// // // //       !form.supplier ||
// // // //       rows.length === 0 ||
// // // //       rows[0].id === "dummy"
// // // //     ) {
// // // //       toast.error("Please fill all required fields and add at least one row.");
// // // //       return;
// // // //     }
// // // //     if (rows.some((r) => !r.accountCode || !r.particulars)) {
// // // //       toast.error("Each row must have Account Code and Particular filled.");
// // // //       return;
// // // //     }
// // // //     mutation.mutate({
// // // //       trans_date: form.entryDate,
// // // //       gl_date: form.glDate,
// // // //       receive_desc: form.description,
// // // //       supporting: String(form.supporting),
// // // //       receive: form.paymentCode,
// // // //       supplierid: form.supplier,
// // // //       user_id: "1",
// // // //       totalAmount: String(form.totalAmount),
// // // //       accountID: rows.map((r) => r.accountCode),
// // // //       amount2: rows.map((r) => String(r.amount || 0)),
// // // //       inv_type: form.inv_type ? Number(form.inv_type) : null,
// // // //       po_number: form.poNumber || null,
// // // //     });
// // // //   };

// // // //   const isSubmitting = mutation.isPending;
// // // //   const isSupplierSaving = supplierMutation.isPending;

// // // //   const inputCls =
// // // //     "w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400";
// // // //   const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
// // // //   const errCls = "text-xs text-red-500 mt-0.5";

// // // //   return (
// // // //     <SectionContainer>
// // // //       <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
// // // //         {/* Header */}
// // // //         <div className="flex items-center justify-between mb-6">
// // // //           <h2 className="font-semibold text-sm text-gray-800">
// // // //             Create Payment Voucher
// // // //           </h2>
// // // //           <div className="flex items-center gap-2">
// // // //             <Button
// // // //               variant="outline"
// // // //               onClick={() => setShowSupplierModal(true)}
// // // //             >
// // // //               <Users size={15} className="mr-1" /> + Supplier
// // // //             </Button>
// // // //             <Button variant="outline" onClick={() => navigate("/dashboard/payment-voucher")}>
// // // //               <ArrowLeft size={16} className="mr-2" /> Back
// // // //             </Button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Top grid */}
// // // //         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 bg-white rounded-lg">
// // // //           <div className="border rounded-lg p-3 bg-gray-50">
// // // //             <BillUploadPanel
// // // //               files={billFiles}
// // // //               onChange={setBillFiles}
// // // //               disabled={isSubmitting}
// // // //             />
// // // //           </div>

// // // //           <div>
// // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // //               <label className="font-bold text-sm text-gray-800">
// // // //                 Supplier
// // // //               </label>
// // // //               <select
// // // //                 value={form.supplier}
// // // //                 onChange={(e) => setForm({ ...form, supplier: e.target.value })}
// // // //                 disabled={isSubmitting}
// // // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // // //               >
// // // //                 <option value="">Select supplier</option>
// // // //                 {suppliers.map((s) => (
// // // //                   <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
// // // //                     {s.SUPPLIER_NAME}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>
// // // //           </div>

// // // //           <div>
// // // //             {[
// // // //               {
// // // //                 label: "Entry Date",
// // // //                 type: "date",
// // // //                 key: "entryDate",
// // // //                 onChange: (v) => setForm({ ...form, entryDate: v }),
// // // //               },
// // // //               {
// // // //                 label: "Invoice No",
// // // //                 type: "text",
// // // //                 key: "invoiceNo",
// // // //                 readOnly: true,
// // // //               },
// // // //               {
// // // //                 label: "PO Number",
// // // //                 type: "text",
// // // //                 key: "poNumber",
// // // //                 readOnly: true,
// // // //               },
// // // //               {
// // // //                 label: "No. of Supporting",
// // // //                 type: "number",
// // // //                 key: "supporting",
// // // //                 onChange: (v) => setForm({ ...form, supporting: v }),
// // // //               },
// // // //               {
// // // //                 label: "GL Date",
// // // //                 type: "date",
// // // //                 key: "glDate",
// // // //                 onChange: (v) => setForm({ ...form, glDate: v }),
// // // //               },
// // // //             ].map(({ label, type, key, readOnly, onChange }) => (
// // // //               <div
// // // //                 key={key}
// // // //                 className="grid grid-cols-3 px-3 items-center py-2"
// // // //               >
// // // //                 <label className="font-bold text-sm text-gray-800">
// // // //                   {label}
// // // //                 </label>
// // // //                 <input
// // // //                   type={type}
// // // //                   value={form[key]}
// // // //                   readOnly={readOnly}
// // // //                   disabled={isSubmitting || readOnly}
// // // //                   onChange={(e) => onChange?.(e.target.value)}
// // // //                   className={`col-span-2 w-full border rounded py-1 ${readOnly ? "bg-gray-100" : "bg-white"}`}
// // // //                 />
// // // //               </div>
// // // //             ))}

// // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // //               <label className="font-bold text-sm text-gray-800">Type</label>
// // // //               <select
// // // //                 value={form.inv_type}
// // // //                 onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
// // // //                 disabled={isSubmitting}
// // // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // // //               >
// // // //                 <option value="">Select type</option>
// // // //                 {invTypes.map((t) => (
// // // //                   <option key={t.ID} value={String(t.ID)}>
// // // //                     {t.DESCRIPTIO}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             <div className="grid grid-cols-3 px-3 items-center">
// // // //               <label className="font-bold text-sm text-gray-800">
// // // //                 Payment Code
// // // //               </label>
// // // //               <select
// // // //                 value={form.paymentCode}
// // // //                 onChange={(e) =>
// // // //                   setForm({ ...form, paymentCode: e.target.value })
// // // //                 }
// // // //                 disabled={isSubmitting}
// // // //                 className="col-span-2 w-full rounded py-1 border bg-white"
// // // //               >
// // // //                 <option value="">Select payment</option>
// // // //                 {PaymentCodes.map((c) => (
// // // //                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
// // // //                     {c.ACCOUNT_NAME}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // // //               <label className="font-bold text-sm text-gray-800">
// // // //                 Total Amount
// // // //               </label>
// // // //               <input
// // // //                 type="number"
// // // //                 value={form.totalAmount.toFixed(2)}
// // // //                 readOnly
// // // //                 className="col-span-2 w-full border rounded py-1 bg-white"
// // // //               />
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* Description */}
// // // //         <div className="mt-4 mb-4">
// // // //           <label className="font-bold text-sm text-gray-800 block mb-2 py-2 px-4 rounded-lg">
// // // //             Description
// // // //           </label>
// // // //           <textarea
// // // //             value={form.description}
// // // //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// // // //             disabled={isSubmitting}
// // // //             className="w-full mt-1 border rounded-lg px-3 py-2"
// // // //           />
// // // //         </div>

// // // //         {/* Add row inputs */}
// // // //         <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-4 rounded-lg items-center">
// // // //           <div className="grid grid-cols-3 px-3 items-center py-1">
// // // //             <label className="font-bold text-sm text-gray-800">
// // // //               Account ID
// // // //             </label>
// // // //             <Select
// // // //               options={accounts}
// // // //               className="col-span-2 border w-full rounded shadow-2xl"
// // // //               value={accounts.find((a) => a.value === form.accountId) || null}
// // // //               onChange={(s) =>
// // // //                 setForm({
// // // //                   ...form,
// // // //                   accountId: s?.value || "",
// // // //                   particular: s?.name || "",
// // // //                 })
// // // //               }
// // // //               placeholder="Enter account..."
// // // //               isClearable
// // // //               isSearchable
// // // //               isDisabled={isSubmitting}
// // // //               menuPortalTarget={document.body}
// // // //               styles={{
// // // //                 menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// // // //                 menu: (b) => ({
// // // //                   ...b,
// // // //                   backgroundColor: "white",
// // // //                   border: "1px solid #e5e7eb",
// // // //                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// // // //                 }),
// // // //               }}
// // // //             />
// // // //           </div>
// // // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // // //             <label className="font-bold text-sm text-gray-800">
// // // //               Particular
// // // //             </label>
// // // //             <input
// // // //               type="text"
// // // //               value={form.particular}
// // // //               readOnly
// // // //               className="col-span-2 border w-full rounded py-1 bg-white"
// // // //             />
// // // //           </div>
// // // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // // //             <label className="font-bold text-sm text-gray-800">Amount</label>
// // // //             <input
// // // //               type="number"
// // // //               value={form.amount}
// // // //               onChange={(e) => setForm({ ...form, amount: e.target.value })}
// // // //               disabled={isSubmitting}
// // // //               className="col-span-1 border w-full rounded py-1 bg-white"
// // // //             />
// // // //           </div>
// // // //           <div className="px-4 py-2">
// // // //             <button
// // // //               type="button"
// // // //               onClick={addRow}
// // // //               disabled={isSubmitting}
// // // //               className="cursor-pointer border px-3 py-1 rounded-lg flex items-center font-bold text-sm text-gray-800"
// // // //             >
// // // //               <span className="mr-1 font-extrabold">+</span>Add
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Rows table */}
// // // //         <div className="overflow-x-auto">
// // // //           <table className="w-full border-collapse rounded-lg text-xs md:text-sm">
// // // //             <thead>
// // // //               <tr className="bg-gray-50">
// // // //                 {["Account Code", "Particulars", "Amount", ""].map((h) => (
// // // //                   <th
// // // //                     key={h}
// // // //                     className="px-2 md:px-4 py-2 text-center font-bold text-sm text-gray-800"
// // // //                   >
// // // //                     {h}
// // // //                   </th>
// // // //                 ))}
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {rows.map((row) => (
// // // //                 <tr key={row.id} className="border">
// // // //                   <td className="border px-2 md:px-4 py-2">
// // // //                     {row.accountCode}
// // // //                   </td>
// // // //                   <td className="border px-2 md:px-4 py-2">
// // // //                     {row.particulars}
// // // //                   </td>
// // // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // // //                     {Number(row.amount).toFixed(2)}
// // // //                   </td>
// // // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // // //                     {row.id !== "dummy" && (
// // // //                       <Button
// // // //                         type="button"
// // // //                         variant="ghost"
// // // //                         size="icon"
// // // //                         onClick={() => removeRow(row.id)}
// // // //                         disabled={isSubmitting}
// // // //                       >
// // // //                         <Trash2 className="w-4 h-4 text-red-500" />
// // // //                       </Button>
// // // //                     )}
// // // //                   </td>
// // // //                 </tr>
// // // //               ))}
// // // //               {rows.length > 0 && rows[0].id !== "dummy" && (
// // // //                 <tr className="font-semibold">
// // // //                   <td
// // // //                     colSpan="2"
// // // //                     className="p-2 text-right font-bold text-sm text-gray-800"
// // // //                   >
// // // //                     Total
// // // //                   </td>
// // // //                   <td className="border p-2 text-center">
// // // //                     {form.totalAmount.toFixed(2)}
// // // //                   </td>
// // // //                   <td />
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>

// // // //         {/* Actions */}
// // // //         <div className="flex justify-end gap-4">
// // // //           <Button
// // // //             type="button"
// // // //             onClick={() => setShowModal(true)}
// // // //             disabled={isSubmitting}
// // // //           >
// // // //             {isSubmitting ? "Submitting..." : "Create"}
// // // //           </Button>
// // // //         </div>
// // // //       </div>

// // // //       {/* ── Voucher Confirmation Modal ── */}
// // // //       {showModal && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // //           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
// // // //             <h2 className="text-xl font-bold mb-4">
// // // //               Confirm Voucher Submission
// // // //             </h2>
// // // //             <div className="space-y-2">
// // // //               <p><strong>Entry Date:</strong> {form.entryDate}</p>
// // // //               <p><strong>PO Number:</strong> {form.poNumber || "—"}</p>
// // // //               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
// // // //               <p><strong>Description:</strong> {form.description}</p>
// // // //               <p>
// // // //                 <strong>Supplier:</strong>{" "}
// // // //                 {
// // // //                   suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
// // // //                     ?.SUPPLIER_NAME
// // // //                 }
// // // //               </p>
// // // //               <p><strong>GL Date:</strong> {form.glDate}</p>
// // // //               <p><strong>Payment Code:</strong> {form.paymentCode}</p>
// // // //               {billFiles.length > 0 && (
// // // //                 <div>
// // // //                   <strong>Bills ({billFiles.length}):</strong>
// // // //                   <ul className="list-disc pl-5 text-sm text-gray-600">
// // // //                     {billFiles.map((f, i) => (
// // // //                       <li key={i}>{f.name}</li>
// // // //                     ))}
// // // //                   </ul>
// // // //                 </div>
// // // //               )}
// // // //               <h3 className="font-semibold mt-2">Accounts:</h3>
// // // //               <ul className="list-disc pl-5">
// // // //                 {rows
// // // //                   .filter((r) => r.id !== "dummy")
// // // //                   .map((row, i) => (
// // // //                     <li key={i}>
// // // //                       {row.accountCode} - {row.particulars} - {row.amount}
// // // //                     </li>
// // // //                   ))}
// // // //               </ul>
// // // //               <p className="font-semibold mt-2">
// // // //                 Total: {form.totalAmount.toFixed(2)}
// // // //               </p>
// // // //             </div>
// // // //             <div className="flex justify-end mt-4 space-x-3">
// // // //               <button
// // // //                 onClick={() => setShowModal(false)}
// // // //                 className="px-4 py-2 rounded-lg bg-gray-300"
// // // //               >
// // // //                 Cancel
// // // //               </button>
// // // //               <button
// // // //                 onClick={handleSubmit}
// // // //                 disabled={isSubmitting}
// // // //                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
// // // //               >
// // // //                 {isSubmitting ? "Submitting..." : "Confirm"}
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ── Add Supplier Dialog Modal ── */}
// // // //       {showSupplierModal && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // // //           <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-[560px] max-h-[90vh] overflow-y-auto">
// // // //             <div className="flex items-center justify-between px-6 py-4 border-b">
// // // //               <div className="flex items-center gap-2">
// // // //                 <div className="p-1.5 rounded-lg bg-gray-100">
// // // //                   <Users size={18} className="text-gray-700" />
// // // //                 </div>
// // // //                 <div>
// // // //                   <h2 className="text-base font-bold text-gray-800">
// // // //                     Add New Supplier
// // // //                   </h2>
// // // //                   <p className="text-xs text-gray-500">
// // // //                     Create a new supplier record
// // // //                   </p>
// // // //                 </div>
// // // //               </div>
// // // //               <button
// // // //                 onClick={handleCloseSupplierModal}
// // // //                 disabled={isSupplierSaving}
// // // //                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// // // //               >
// // // //                 <X size={18} className="text-gray-500" />
// // // //               </button>
// // // //             </div>

// // // //             <form
// // // //               onSubmit={handleSupplierSubmit}
// // // //               className="px-6 py-5 space-y-4"
// // // //             >
// // // //               <div>
// // // //                 <label className={labelCls}>
// // // //                   Supplier Name <span className="text-red-500">*</span>
// // // //                 </label>
// // // //                 <input
// // // //                   type="text"
// // // //                   value={supplierForm.supplierName}
// // // //                   onChange={(e) =>
// // // //                     setSupplierForm({
// // // //                       ...supplierForm,
// // // //                       supplierName: e.target.value,
// // // //                     })
// // // //                   }
// // // //                   placeholder="Enter supplier name"
// // // //                   disabled={isSupplierSaving}
// // // //                   className={inputCls}
// // // //                 />
// // // //                 {supplierErrors.supplierName && (
// // // //                   <p className={errCls}>{supplierErrors.supplierName}</p>
// // // //                 )}
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-3">
// // // //                 <div>
// // // //                   <label className={labelCls}>Contact Person</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={supplierForm.contactPerson}
// // // //                     onChange={(e) =>
// // // //                       setSupplierForm({
// // // //                         ...supplierForm,
// // // //                         contactPerson: e.target.value,
// // // //                       })
// // // //                     }
// // // //                     placeholder="Contact person"
// // // //                     disabled={isSupplierSaving}
// // // //                     className={inputCls}
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className={labelCls}>Phone</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={supplierForm.phone}
// // // //                     onChange={(e) =>
// // // //                       setSupplierForm({
// // // //                         ...supplierForm,
// // // //                         phone: e.target.value,
// // // //                       })
// // // //                     }
// // // //                     placeholder="Phone number"
// // // //                     disabled={isSupplierSaving}
// // // //                     className={inputCls}
// // // //                   />
// // // //                 </div>
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-3">
// // // //                 <div>
// // // //                   <label className={labelCls}>Mobile</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={supplierForm.mobile}
// // // //                     onChange={(e) =>
// // // //                       setSupplierForm({
// // // //                         ...supplierForm,
// // // //                         mobile: e.target.value,
// // // //                       })
// // // //                     }
// // // //                     placeholder="Mobile number"
// // // //                     disabled={isSupplierSaving}
// // // //                     className={inputCls}
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className={labelCls}>Email</label>
// // // //                   <input
// // // //                     type="email"
// // // //                     value={supplierForm.email}
// // // //                     onChange={(e) =>
// // // //                       setSupplierForm({
// // // //                         ...supplierForm,
// // // //                         email: e.target.value,
// // // //                       })
// // // //                     }
// // // //                     placeholder="email@example.com"
// // // //                     disabled={isSupplierSaving}
// // // //                     className={inputCls}
// // // //                   />
// // // //                   {supplierErrors.email && (
// // // //                     <p className={errCls}>{supplierErrors.email}</p>
// // // //                   )}
// // // //                 </div>
// // // //               </div>

// // // //               <div>
// // // //                 <label className={labelCls}>Address</label>
// // // //                 <textarea
// // // //                   value={supplierForm.address}
// // // //                   onChange={(e) =>
// // // //                     setSupplierForm({
// // // //                       ...supplierForm,
// // // //                       address: e.target.value,
// // // //                     })
// // // //                   }
// // // //                   placeholder="Supplier address"
// // // //                   rows={2}
// // // //                   disabled={isSupplierSaving}
// // // //                   className={`${inputCls} resize-none`}
// // // //                 />
// // // //               </div>

// // // //               <div className="grid grid-cols-2 gap-3">
// // // //                 <div>
// // // //                   <label className={labelCls}>Remarks</label>
// // // //                   <input
// // // //                     type="text"
// // // //                     value={supplierForm.remarks}
// // // //                     onChange={(e) =>
// // // //                       setSupplierForm({
// // // //                         ...supplierForm,
// // // //                         remarks: e.target.value,
// // // //                       })
// // // //                     }
// // // //                     placeholder="Optional remarks"
// // // //                     disabled={isSupplierSaving}
// // // //                     className={inputCls}
// // // //                   />
// // // //                 </div>
// // // //                 <div>
// // // //                   <label className={labelCls}>
// // // //                     Status <span className="text-red-500">*</span>
// // // //                   </label>
// // // //                   <select
// // // //                     value={supplierForm.status}
// // // //                     onChange={(e) =>
// // // //                       setSupplierForm({
// // // //                         ...supplierForm,
// // // //                         status: e.target.value,
// // // //                       })
// // // //                     }
// // // //                     disabled={isSupplierSaving}
// // // //                     className={inputCls}
// // // //                   >
// // // //                     <option value="1">Active</option>
// // // //                     <option value="0">Inactive</option>
// // // //                   </select>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="flex justify-end gap-2 pt-2 border-t mt-4">
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={handleCloseSupplierModal}
// // // //                   disabled={isSupplierSaving}
// // // //                   className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
// // // //                 >
// // // //                   Cancel
// // // //                 </button>
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={isSupplierSaving}
// // // //                   className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
// // // //                 >
// // // //                   {isSupplierSaving ? "Creating..." : "Create Supplier"}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </SectionContainer>
// // // //   );
// // // // };

// // // // export default PaymentCreate;


// // // import { useState, useEffect } from "react";
// // // import { ArrowLeft, Trash2, Users, X } from "lucide-react";
// // // import Select from "react-select";
// // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // import { toast } from "react-toastify";
// // // import axios from "axios";
// // // import { useNavigate, useLocation } from "react-router-dom";
// // // import { useMutation } from "@tanstack/react-query";

// // // import { SectionContainer } from "@/components/SectionContainer";
// // // import { PaymentService } from "@/api/AccontingApi";
// // // import { Button } from "@/components/ui/button";
// // // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // // import { useCreateSupplier } from "@/features/supplier/queries";
// // // import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// // // import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

// // // const url = import.meta.env.VITE_API_BASE_URL ;

// // // const supplierDefault = {
// // //   supplierName: "",
// // //   contactPerson: "",
// // //   phone: "",
// // //   mobile: "",
// // //   email: "",
// // //   address: "",
// // //   remarks: "",
// // //   status: "1",
// // // };

// // // const MONTHS = {
// // //   JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
// // //   JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
// // // };

// // // const toDateInputValue = (val) => {
// // //   if (!val) return "";
// // //   const str = String(val).trim();

// // //   // ✅ Already ISO: "2026-07-03" or "2026-07-03T00:00:00.000Z"
// // //   if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.split("T")[0];

// // //   // ✅ Oracle default format: "03-JUL-26"
// // //   const match = str.match(/^(\d{2})-([A-Za-z]{3})-(\d{2})$/);
// // //   if (match) {
// // //     const [, day, mon, yy] = match;
// // //     const month = MONTHS[mon.toUpperCase()];
// // //     if (!month) return "";
// // //     return `20${yy}-${month}-${day}`;
// // //   }

// // //   const d = new Date(str);
// // //   if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];

// // //   return "";
// // // };

// // // const PaymentCreate = () => {
// // //   const navigate = useNavigate();
// // //   const queryClient = useQueryClient();
// // //   const today = new Date().toISOString().split("T")[0];
// // //   const location = useLocation();
// // //   const userId = useAuthUserId();

// // //   const [billFiles, setBillFiles] = useState([]);

// // //   const [rows, setRows] = useState([
// // //     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
// // //   ]);

// // //   const [showModal, setShowModal] = useState(false);
// // //   const [showSupplierModal, setShowSupplierModal] = useState(false);
// // //   const [supplierForm, setSupplierForm] = useState(supplierDefault);
// // //   const [supplierErrors, setSupplierErrors] = useState({});

// // //   const [form, setForm] = useState({
// // //     entryDate: today,
// // //     invoiceNo: "",
// // //     poNumber: "",
// // //     grnNo: "",          // 👈 নতুন
// // //     supporting: "",
// // //     description: "",
// // //     supplier: "",
// // //     glDate: today,
// // //     paymentCode: "",
// // //     accountId: "",
// // //     particular: "",
// // //     amount: "",
// // //     totalAmount: 0,
// // //     inv_type: "",
// // //   });

// // //   const { data: periodStatus } = usePeriodStatusForDate("AP", form.glDate);
// // // const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
// // // const noPeriodDefined = !!form.glDate && periodStatus === null;

// // //   // ── Queries ──────────────────────────────────────────────────────────────────
// // //   const { data: suppliers = [] } = useQuery({
// // //     queryKey: ["suppliers"],
// // //     queryFn: async () =>
// // //       (await axios.get(`${url}/api/supplier-type`)).data.data || [],
// // //   });

// // //   const { data: PaymentCodes = [] } = useQuery({
// // //     queryKey: ["paymentCodes"],
// // //     queryFn: async () => {
// // //       const res = await axios.get(`${url}/api/receive-code`);
// // //       return res.data.success ? res.data.data || [] : [];
// // //     },
// // //   });

// // //   const { data: invTypes = [] } = useQuery({
// // //     queryKey: ["invTypes"],
// // //     queryFn: async () => {
// // //       const res = await axios.get(`${url}/api/inv-type`);
// // //       return res.data.data || [];
// // //     },
// // //   });

// // //   const { data: accounts = [] } = useQuery({
// // //     queryKey: ["accounts"],
// // //     queryFn: async () => {
// // //       const res = await axios.get(`${url}/api/account-code`);
// // //       return res.data.success === 1
// // //         ? res.data.data.map((a) => ({
// // //             value: a.ACCOUNT_ID,
// // //             label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
// // //             name: a.ACCOUNT_NAME,
// // //           }))
// // //         : [];
// // //     },
// // //   });

// // //   // ── Upload bills helper ──────────────────────────────────────────────────────
// // //   const uploadBills = async (glMasterId) => {
// // //     if (!billFiles.length || !glMasterId) return;
// // //     const uploads = billFiles.map((file) => {
// // //       const fd = new FormData();
// // //       fd.append("doc_file", file);
// // //       fd.append("GLMASTERID", glMasterId);
// // //       return axios.post(`${url}/api/gldoc`, fd);
// // //     });
// // //     await Promise.allSettled(uploads);
// // //   };


// // //   // ── Lock the Inventory (if this payment came from Inventory) ──────────────
// // // const lockInventory = async (inventoryHid) => {
// // //   if (!inventoryHid) return;
// // //   try {
// // //     await axios.put(`${url}/api/inventory/${inventoryHid}/lock`);
// // //     queryClient.invalidateQueries(["inventories"]);
// // //   } catch (err) {
// // //     console.error("Failed to lock inventory:", err);
// // //   }
// // // };

// // //   // ── Lock the Purchase Recognition form (if this payment came from PR) ────────
// // //   const lockRecognitionForm = async (purchaseFormId) => {
// // //     if (!purchaseFormId) return;
// // //     try {
// // //       await axios.put(`${url}/api/purchase-recognition/${purchaseFormId}/lock`);
// // //       queryClient.invalidateQueries(["purchaseRecognitions"]);
// // //       queryClient.invalidateQueries(["purchaseRecognition", purchaseFormId]);
// // //     } catch (err) {
// // //       console.error("Failed to lock recognition form:", err);
// // //     }
// // //   };

// // //   // ── Voucher Mutation ─────────────────────────────────────────────────────────
// // //   const mutation = useMutation({
// // //     mutationFn: async (payload) => {
// // //       const res = await PaymentService.insert(payload);
// // //       return res.data;
// // //     },
// // //     onSuccess: async (data) => {
// // //       if (data.status === "success") {
// // //         await uploadBills(data.masterID || data.id);
// // //         await lockRecognitionForm(location.state?.purchaseFormId);
// // //         await lockInventory(location.state?.inventoryHid);

// // //         toast.success("Voucher created successfully!");
// // //         setBillFiles([]);
// // //         setForm({
// // //           entryDate: today,
// // //           invoiceNo: "",
// // //           poNumber: "",
// // //           grnNo: "",
// // //           supporting: "",
// // //           description: "",
// // //           supplier: "",
// // //           glDate: today,
// // //           paymentCode: "",
// // //           accountId: "",
// // //           particular: "",
// // //           amount: "",
// // //           totalAmount: 0,
// // //           inv_type: "",
// // //         });
// // //         setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
// // //         queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
// // //         navigate("/dashboard/payment-voucher");
// // //       } else {
// // //         toast.error("Error processing voucher.");
// // //       }
// // //     },
// // //     onError: () => toast.error("Error submitting voucher. Please try again."),
// // //     onSettled: () => setShowModal(false),
// // //   });

// // //   // ── Supplier Mutation ────────────────────────────────────────────────────────
// // //   const supplierMutation = useCreateSupplier();

// // //   const validateSupplier = () => {
// // //     const errs = {};
// // //     if (!supplierForm.supplierName.trim())
// // //       errs.supplierName = "Supplier name is required";
// // //     if (
// // //       supplierForm.email &&
// // //       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
// // //     )
// // //       errs.email = "Invalid email address";
// // //     setSupplierErrors(errs);
// // //     return Object.keys(errs).length === 0;
// // //   };

// // //   const handleSupplierSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!validateSupplier()) return;
// // //     try {
// // //       await supplierMutation.mutateAsync({
// // //         SUPPLIER_NAME: supplierForm.supplierName,
// // //         CONTACT_PERSON: supplierForm.contactPerson || null,
// // //         PHONE: supplierForm.phone || null,
// // //         MOBILE: supplierForm.mobile || null,
// // //         EMAIL: supplierForm.email || null,
// // //         ADDRESS: supplierForm.address || null,
// // //         REMARKS: supplierForm.remarks || null,
// // //         STATUS: Number(supplierForm.status),
// // //         ENTRY_BY: null,
// // //         PASSWORD: null,
// // //         ORG_ID: null,
// // //         DUE: null,
// // //         FAX: null,
// // //       });
// // //       toast.success("Supplier created successfully!");
// // //       queryClient.invalidateQueries(["suppliers"]);
// // //       setSupplierForm(supplierDefault);
// // //       setSupplierErrors({});
// // //       setShowSupplierModal(false);
// // //     } catch (err) {
// // //       toast.error(err?.message || "Failed to create supplier.");
// // //     }
// // //   };

// // //   const handleCloseSupplierModal = () => {
// // //     setSupplierForm(supplierDefault);
// // //     setSupplierErrors({});
// // //     setShowSupplierModal(false);
// // //   };

// // //   // ── Row handlers ─────────────────────────────────────────────────────────────
// // //   const addRow = () => {
// // //     if (!form.accountId || !form.amount) {
// // //       toast.error("Please select account and enter amount");
// // //       return;
// // //     }
// // //     const account = accounts.find((a) => a.value === form.accountId);
// // //     const newRow = {
// // //       id: Date.now(),
// // //       accountCode: form.accountId,
// // //       particulars: form.particular || account?.label || "",
// // //       amount: parseFloat(form.amount),
// // //     };
// // //     const updated =
// // //       rows.length === 1 && rows[0].id === "dummy"
// // //         ? [newRow]
// // //         : [...rows, newRow];
// // //     setRows(updated);
// // //     setForm({
// // //       ...form,
// // //       accountId: "",
// // //       particular: "",
// // //       amount: "",
// // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
// // //     });
// // //   };

// // //   const removeRow = (id) => {
// // //     const updated = rows.filter((r) => r.id !== id);
// // //     setRows(updated);
// // //     setForm({
// // //       ...form,
// // //       totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
// // //     });
// // //   };

// // //   // ── Prefill from Purchase Recognition's "Create Payment" OR
// // //   //    Inventory's "Payment Voucher" button ─────────────────────────────────
// // //   useEffect(() => {
// // //     const incoming = location.state;
// // //     if (!incoming) return;

// // //     setForm((f) => ({
// // //       ...f,
// // //       supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
// // //       entryDate: incoming.entryDate ? toDateInputValue(incoming.entryDate) : f.entryDate,
// // //       glDate: incoming.glDate ? toDateInputValue(incoming.glDate) : f.glDate,
// // //       description: incoming.description || f.description,
// // //       invoiceNo: incoming.invoiceNo || f.invoiceNo,
// // //       poNumber: incoming.poNumber || f.poNumber,
// // //       grnNo: incoming.grnNo || f.grnNo,          // 👈 নতুন
// // //       inv_type: incoming.invType || f.inv_type,
// // //       paymentCode: incoming.paymentCode || f.paymentCode,
// // //     }));

// // //     // ✅ Inventory theke row (total amount) ashle prefill hobe
// // //     if (incoming.rows?.length > 0) {
// // //       const mappedRows = incoming.rows.map((r, i) => ({
// // //         id: Date.now() + i,
// // //         accountCode: "",
// // //         particulars: r.particulars || "",
// // //         amount: Number(r.amount || 0),
// // //       }));
// // //       setRows(mappedRows);
// // //       setForm((f) => ({
// // //         ...f,
// // //         totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
// // //       }));
// // //     }
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   // ── Voucher Submit ───────────────────────────────────────────────────────────
// // //   const handleSubmit = () => {
// // //     if (
// // //       !form.entryDate ||
// // //       !form.glDate ||
// // //       !form.paymentCode ||
// // //       !form.supplier ||
// // //       rows.length === 0 ||
// // //       rows[0].id === "dummy"
// // //     ) {
// // //       toast.error("Please fill all required fields and add at least one row.");
// // //       return;
// // //     }
// // //     if (rows.some((r) => !r.accountCode || !r.particulars)) {
// // //       toast.error("Each row must have Account Code and Particular filled.");
// // //       return;
// // //     }
// // //     mutation.mutate({
// // //       trans_date: form.entryDate,
// // //       gl_date: form.glDate,
// // //       receive_desc: form.description,
// // //       supporting: String(form.supporting),
// // //       receive: form.paymentCode,
// // //       supplierid: form.supplier,
// // //       user_id: "1",
// // //       totalAmount: String(form.totalAmount),
// // //       accountID: rows.map((r) => r.accountCode),
// // //       amount2: rows.map((r) => String(r.amount || 0)),
// // //       inv_type: form.inv_type ? Number(form.inv_type) : null,
// // //       po_number: form.poNumber || null,
// // //       grn_no: form.grnNo || null, 
// // //       entry_by: userId,  // 👈 নতুন — backend এ GRN_NO কলাম থাকলে সেভ হবে
// // //     });
// // //   };

// // //   const isSubmitting = mutation.isPending;
// // //   const isSupplierSaving = supplierMutation.isPending;

// // //   const inputCls =
// // //     "w-full border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-400";
// // //   const labelCls = "block text-sm font-semibold text-gray-700 mb-1";
// // //   const errCls = "text-xs text-red-500 mt-0.5";

// // //   return (
// // //     <SectionContainer>
// // //       <div className="p-2 space-y-6 bg-white rounded-lg mt-4 shadow-md">
// // //         {/* Header */}
// // //         <div className="flex items-center justify-between mb-6">
// // //           <h2 className="font-semibold text-sm text-gray-800">
// // //             Create Payment Voucher
// // //           </h2>
// // //           <div className="flex items-center gap-2">
// // //             <Button
// // //               variant="outline"
// // //               onClick={() => setShowSupplierModal(true)}
// // //             >
// // //               <Users size={15} className="mr-1" /> + Supplier
// // //             </Button>
// // //             <Button variant="outline" onClick={() => navigate("/dashboard/payment-voucher")}>
// // //               <ArrowLeft size={16} className="mr-2" /> Back
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         {/* Top grid */}
// // //         <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 bg-white rounded-lg">
// // //           <div className="border rounded-lg p-3 bg-gray-50">
// // //             <BillUploadPanel
// // //               files={billFiles}
// // //               onChange={setBillFiles}
// // //               disabled={isSubmitting}
// // //             />
// // //           </div>

// // //           <div>
// // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // //               <label className="font-bold text-sm text-gray-800">
// // //                 Supplier
// // //               </label>
// // //               <select
// // //                 value={form.supplier}
// // //                 onChange={(e) => setForm({ ...form, supplier: e.target.value })}
// // //                 disabled={isSubmitting}
// // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // //               >
// // //                 <option value="">Select supplier</option>
// // //                 {suppliers.map((s) => (
// // //                   <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
// // //                     {s.SUPPLIER_NAME}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           </div>

// // //           <div>
// // //             {[
// // //               {
// // //                 label: "Entry Date",
// // //                 type: "date",
// // //                 key: "entryDate",
// // //                 onChange: (v) => setForm({ ...form, entryDate: v }),
// // //               },
// // //               {
// // //                 label: "Invoice No",
// // //                 type: "text",
// // //                 key: "invoiceNo",
// // //                 readOnly: true,
// // //               },
// // //               {
// // //                 label: "PO Number",
// // //                 type: "text",
// // //                 key: "poNumber",
// // //                 readOnly: true,
// // //               },
// // //               {
// // //                 label: "GRN No",           // 👈 নতুন field
// // //                 type: "text",
// // //                 key: "grnNo",
// // //                 readOnly: true,
// // //               },
// // //               {
// // //                 label: "No. of Supporting",
// // //                 type: "number",
// // //                 key: "supporting",
// // //                 onChange: (v) => setForm({ ...form, supporting: v }),
// // //               },
// // //               // {
// // //               //   label: "GL Date",
// // //               //   type: "date",
// // //               //   key: "glDate",
// // //               //   onChange: (v) => setForm({ ...form, glDate: v }),
// // //               // },
// // //             ].map(({ label, type, key, readOnly, onChange }) => (
// // //               <div
// // //                 key={key}
// // //                 className="grid grid-cols-3 px-3 items-center py-2"
// // //               >
// // //                 <label className="font-bold text-sm text-gray-800">
// // //                   {label}
// // //                 </label>
// // //                 <input
// // //                   type={type}
// // //                   value={form[key]}
// // //                   readOnly={readOnly}
// // //                   disabled={isSubmitting || readOnly}
// // //                   onChange={(e) => onChange?.(e.target.value)}
// // //                   className={`col-span-2 w-full border rounded py-1 ${readOnly ? "bg-gray-100" : "bg-white"}`}
// // //                 />
// // //               </div>
// // //             ))}

// // //             <div className="grid grid-cols-3 px-3 items-center py-2">
// // //   <label className="font-bold text-sm text-gray-800">GL Date</label>
// // //   <input
// // //     type="date"
// // //     value={form.glDate}
// // //     onChange={(e) => setForm({ ...form, glDate: e.target.value })}
// // //     disabled={isSubmitting}
// // //     className={`col-span-2 w-full border rounded py-1 ${isPeriodClosed ? "border-red-400 bg-white" : "bg-white"}`}
// // //   />
// // // </div>
// // // {isPeriodClosed && (
// // //   <p className="text-xs text-red-500 px-3 -mt-1 mb-2">
// // //     ⚠ Period "{periodStatus.PERIOD_NAME}" is closed for AP postings. Choose a different date.
// // //   </p>
// // // )}
// // // {noPeriodDefined && (
// // //   <p className="text-xs text-amber-500 px-3 -mt-1 mb-2">
// // //     ⚠ No ledger period found for this date.
// // //   </p>
// // // )}

// // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // //               <label className="font-bold text-sm text-gray-800">Type</label>
// // //               <select
// // //                 value={form.inv_type}
// // //                 onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
// // //                 disabled={isSubmitting}
// // //                 className="col-span-2 w-full border rounded py-1 h-8 bg-white"
// // //               >
// // //                 <option value="">Select type</option>
// // //                 {invTypes.map((t) => (
// // //                   <option key={t.ID} value={String(t.ID)}>
// // //                     {t.DESCRIPTIO}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div className="grid grid-cols-3 px-3 items-center">
// // //               <label className="font-bold text-sm text-gray-800">
// // //                 Payment Code
// // //               </label>
// // //               <select
// // //                 value={form.paymentCode}
// // //                 onChange={(e) =>
// // //                   setForm({ ...form, paymentCode: e.target.value })
// // //                 }
// // //                 disabled={isSubmitting}
// // //                 className="col-span-2 w-full rounded py-1 border bg-white"
// // //               >
// // //                 <option value="">Select payment</option>
// // //                 {PaymentCodes.map((c) => (
// // //                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
// // //                     {c.ACCOUNT_NAME}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div className="grid grid-cols-3 px-3 items-center py-3">
// // //               <label className="font-bold text-sm text-gray-800">
// // //                 Total Amount
// // //               </label>
// // //               <input
// // //                 type="number"
// // //                 value={form.totalAmount.toFixed(2)}
// // //                 readOnly
// // //                 className="col-span-2 w-full border rounded py-1 bg-white"
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Description */}
// // //         <div className="mt-4 mb-4">
// // //           <label className="font-bold text-sm text-gray-800 block mb-2 py-2 px-4 rounded-lg">
// // //             Description
// // //           </label>
// // //           <textarea
// // //             value={form.description}
// // //             onChange={(e) => setForm({ ...form, description: e.target.value })}
// // //             disabled={isSubmitting}
// // //             className="w-full mt-1 border rounded-lg px-3 py-2"
// // //           />
// // //         </div>

// // //         {/* Add row inputs */}
// // //         <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-4 rounded-lg items-center">
// // //           <div className="grid grid-cols-3 px-3 items-center py-1">
// // //             <label className="font-bold text-sm text-gray-800">
// // //               Account ID
// // //             </label>
// // //             <Select
// // //               options={accounts}
// // //               className="col-span-2 border w-full rounded shadow-2xl"
// // //               value={accounts.find((a) => a.value === form.accountId) || null}
// // //               onChange={(s) =>
// // //                 setForm({
// // //                   ...form,
// // //                   accountId: s?.value || "",
// // //                   particular: s?.name || "",
// // //                 })
// // //               }
// // //               placeholder="Enter account..."
// // //               isClearable
// // //               isSearchable
// // //               isDisabled={isSubmitting}
// // //               menuPortalTarget={document.body}
// // //               styles={{
// // //                 menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// // //                 menu: (b) => ({
// // //                   ...b,
// // //                   backgroundColor: "white",
// // //                   border: "1px solid #e5e7eb",
// // //                   boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// // //                 }),
// // //               }}
// // //             />
// // //           </div>
// // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // //             <label className="font-bold text-sm text-gray-800">
// // //               Particular
// // //             </label>
// // //             <input
// // //               type="text"
// // //               value={form.particular}
// // //               readOnly
// // //               className="col-span-2 border w-full rounded py-1 bg-white"
// // //             />
// // //           </div>
// // //           <div className="grid grid-cols-3 px-3 items-center py-3">
// // //             <label className="font-bold text-sm text-gray-800">Amount</label>
// // //             <input
// // //               type="number"
// // //               value={form.amount}
// // //               onChange={(e) => setForm({ ...form, amount: e.target.value })}
// // //               disabled={isSubmitting}
// // //               className="col-span-1 border w-full rounded py-1 bg-white"
// // //             />
// // //           </div>
// // //           <div className="px-4 py-2">
// // //             <button
// // //               type="button"
// // //               onClick={addRow}
// // //               disabled={isSubmitting}
// // //               className="cursor-pointer border px-3 py-1 rounded-lg flex items-center font-bold text-sm text-gray-800"
// // //             >
// // //               <span className="mr-1 font-extrabold">+</span>Add
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Rows table */}
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full border-collapse rounded-lg text-xs md:text-sm">
// // //             <thead>
// // //               <tr className="bg-gray-50">
// // //                 {["Account Code", "Particulars", "Amount", ""].map((h) => (
// // //                   <th
// // //                     key={h}
// // //                     className="px-2 md:px-4 py-2 text-center font-bold text-sm text-gray-800"
// // //                   >
// // //                     {h}
// // //                   </th>
// // //                 ))}
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {rows.map((row) => (
// // //                 <tr key={row.id} className="border">
// // //                   <td className="border px-2 md:px-4 py-2">
// // //                     {row.accountCode}
// // //                   </td>
// // //                   <td className="border px-2 md:px-4 py-2">
// // //                     {row.particulars}
// // //                   </td>
// // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // //                     {Number(row.amount).toFixed(2)}
// // //                   </td>
// // //                   <td className="border px-2 md:px-4 py-2 text-center">
// // //                     {row.id !== "dummy" && (
// // //                       <Button
// // //                         type="button"
// // //                         variant="ghost"
// // //                         size="icon"
// // //                         onClick={() => removeRow(row.id)}
// // //                         disabled={isSubmitting}
// // //                       >
// // //                         <Trash2 className="w-4 h-4 text-red-500" />
// // //                       </Button>
// // //                     )}
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //               {rows.length > 0 && rows[0].id !== "dummy" && (
// // //                 <tr className="font-semibold">
// // //                   <td
// // //                     colSpan="2"
// // //                     className="p-2 text-right font-bold text-sm text-gray-800"
// // //                   >
// // //                     Total
// // //                   </td>
// // //                   <td className="border p-2 text-center">
// // //                     {form.totalAmount.toFixed(2)}
// // //                   </td>
// // //                   <td />
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>

// // //         {/* Actions */}
// // //         <div className="flex justify-end gap-4">
// // //          <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting || isPeriodClosed || noPeriodDefined}>
// // //   {isSubmitting ? "Submitting..." : "Create"}
// // // </Button>
// // //         </div>
// // //       </div>

// // //       {/* ── Voucher Confirmation Modal ── */}
// // //       {showModal && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // //           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
// // //             <h2 className="text-xl font-bold mb-4">
// // //               Confirm Voucher Submission
// // //             </h2>
// // //             <div className="space-y-2">
// // //               <p><strong>Entry Date:</strong> {form.entryDate}</p>
// // //               <p><strong>PO Number:</strong> {form.poNumber || "—"}</p>
// // //               <p><strong>GRN No:</strong> {form.grnNo || "—"}</p>
// // //               <p><strong>No. of Supporting:</strong> {form.supporting}</p>
// // //               <p><strong>Description:</strong> {form.description}</p>
// // //               <p>
// // //                 <strong>Supplier:</strong>{" "}
// // //                 {
// // //                   suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
// // //                     ?.SUPPLIER_NAME
// // //                 }
// // //               </p>
// // //               <p><strong>GL Date:</strong> {form.glDate}</p>
// // //               <p><strong>Payment Code:</strong> {form.paymentCode}</p>
// // //               {billFiles.length > 0 && (
// // //                 <div>
// // //                   <strong>Bills ({billFiles.length}):</strong>
// // //                   <ul className="list-disc pl-5 text-sm text-gray-600">
// // //                     {billFiles.map((f, i) => (
// // //                       <li key={i}>{f.name}</li>
// // //                     ))}
// // //                   </ul>
// // //                 </div>
// // //               )}
// // //               <h3 className="font-semibold mt-2">Accounts:</h3>
// // //               <ul className="list-disc pl-5">
// // //                 {rows
// // //                   .filter((r) => r.id !== "dummy")
// // //                   .map((row, i) => (
// // //                     <li key={i}>
// // //                       {row.accountCode} - {row.particulars} - {row.amount}
// // //                     </li>
// // //                   ))}
// // //               </ul>
// // //               <p className="font-semibold mt-2">
// // //                 Total: {form.totalAmount.toFixed(2)}
// // //               </p>
// // //             </div>
// // //             <div className="flex justify-end mt-4 space-x-3">
// // //               <button
// // //                 onClick={() => setShowModal(false)}
// // //                 className="px-4 py-2 rounded-lg bg-gray-300"
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button
// // //                 onClick={handleSubmit}
// // //                 disabled={isSubmitting}
// // //                 className="px-4 py-2 rounded-lg bg-green-500 text-white"
// // //               >
// // //                 {isSubmitting ? "Submitting..." : "Confirm"}
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ── Add Supplier Dialog Modal ── */}
// // //       {showSupplierModal && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
// // //           <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-[560px] max-h-[90vh] overflow-y-auto">
// // //             <div className="flex items-center justify-between px-6 py-4 border-b">
// // //               <div className="flex items-center gap-2">
// // //                 <div className="p-1.5 rounded-lg bg-gray-100">
// // //                   <Users size={18} className="text-gray-700" />
// // //                 </div>
// // //                 <div>
// // //                   <h2 className="text-base font-bold text-gray-800">
// // //                     Add New Supplier
// // //                   </h2>
// // //                   <p className="text-xs text-gray-500">
// // //                     Create a new supplier record
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //               <button
// // //                 onClick={handleCloseSupplierModal}
// // //                 disabled={isSupplierSaving}
// // //                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// // //               >
// // //                 <X size={18} className="text-gray-500" />
// // //               </button>
// // //             </div>

// // //             <form
// // //               onSubmit={handleSupplierSubmit}
// // //               className="px-6 py-5 space-y-4"
// // //             >
// // //               <div>
// // //                 <label className={labelCls}>
// // //                   Supplier Name <span className="text-red-500">*</span>
// // //                 </label>
// // //                 <input
// // //                   type="text"
// // //                   value={supplierForm.supplierName}
// // //                   onChange={(e) =>
// // //                     setSupplierForm({
// // //                       ...supplierForm,
// // //                       supplierName: e.target.value,
// // //                     })
// // //                   }
// // //                   placeholder="Enter supplier name"
// // //                   disabled={isSupplierSaving}
// // //                   className={inputCls}
// // //                 />
// // //                 {supplierErrors.supplierName && (
// // //                   <p className={errCls}>{supplierErrors.supplierName}</p>
// // //                 )}
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <label className={labelCls}>Contact Person</label>
// // //                   <input
// // //                     type="text"
// // //                     value={supplierForm.contactPerson}
// // //                     onChange={(e) =>
// // //                       setSupplierForm({
// // //                         ...supplierForm,
// // //                         contactPerson: e.target.value,
// // //                       })
// // //                     }
// // //                     placeholder="Contact person"
// // //                     disabled={isSupplierSaving}
// // //                     className={inputCls}
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className={labelCls}>Phone</label>
// // //                   <input
// // //                     type="text"
// // //                     value={supplierForm.phone}
// // //                     onChange={(e) =>
// // //                       setSupplierForm({
// // //                         ...supplierForm,
// // //                         phone: e.target.value,
// // //                       })
// // //                     }
// // //                     placeholder="Phone number"
// // //                     disabled={isSupplierSaving}
// // //                     className={inputCls}
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <label className={labelCls}>Mobile</label>
// // //                   <input
// // //                     type="text"
// // //                     value={supplierForm.mobile}
// // //                     onChange={(e) =>
// // //                       setSupplierForm({
// // //                         ...supplierForm,
// // //                         mobile: e.target.value,
// // //                       })
// // //                     }
// // //                     placeholder="Mobile number"
// // //                     disabled={isSupplierSaving}
// // //                     className={inputCls}
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className={labelCls}>Email</label>
// // //                   <input
// // //                     type="email"
// // //                     value={supplierForm.email}
// // //                     onChange={(e) =>
// // //                       setSupplierForm({
// // //                         ...supplierForm,
// // //                         email: e.target.value,
// // //                       })
// // //                     }
// // //                     placeholder="email@example.com"
// // //                     disabled={isSupplierSaving}
// // //                     className={inputCls}
// // //                   />
// // //                   {supplierErrors.email && (
// // //                     <p className={errCls}>{supplierErrors.email}</p>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label className={labelCls}>Address</label>
// // //                 <textarea
// // //                   value={supplierForm.address}
// // //                   onChange={(e) =>
// // //                     setSupplierForm({
// // //                       ...supplierForm,
// // //                       address: e.target.value,
// // //                     })
// // //                   }
// // //                   placeholder="Supplier address"
// // //                   rows={2}
// // //                   disabled={isSupplierSaving}
// // //                   className={`${inputCls} resize-none`}
// // //                 />
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <label className={labelCls}>Remarks</label>
// // //                   <input
// // //                     type="text"
// // //                     value={supplierForm.remarks}
// // //                     onChange={(e) =>
// // //                       setSupplierForm({
// // //                         ...supplierForm,
// // //                         remarks: e.target.value,
// // //                       })
// // //                     }
// // //                     placeholder="Optional remarks"
// // //                     disabled={isSupplierSaving}
// // //                     className={inputCls}
// // //                   />
// // //                 </div>
// // //                 <div>
// // //                   <label className={labelCls}>
// // //                     Status <span className="text-red-500">*</span>
// // //                   </label>
// // //                   <select
// // //                     value={supplierForm.status}
// // //                     onChange={(e) =>
// // //                       setSupplierForm({
// // //                         ...supplierForm,
// // //                         status: e.target.value,
// // //                       })
// // //                     }
// // //                     disabled={isSupplierSaving}
// // //                     className={inputCls}
// // //                   >
// // //                     <option value="1">Active</option>
// // //                     <option value="0">Inactive</option>
// // //                   </select>
// // //                 </div>
// // //               </div>

// // //               <div className="flex justify-end gap-2 pt-2 border-t mt-4">
// // //                 <button
// // //                   type="button"
// // //                   onClick={handleCloseSupplierModal}
// // //                   disabled={isSupplierSaving}
// // //                   className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={isSupplierSaving}
// // //                   className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
// // //                 >
// // //                   {isSupplierSaving ? "Creating..." : "Create Supplier"}
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </SectionContainer>
// // //   );
// // // };

// // // export default PaymentCreate;
// // import { useState, useEffect } from "react";
// // import { ArrowLeft, Trash2, Users, X, FileText, Receipt, ListChecks,AlertTriangle } from "lucide-react";
// // import Select from "react-select";
// // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // import { toast } from "react-toastify";
// // import axios from "axios";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { useMutation } from "@tanstack/react-query";

// // import { SectionContainer } from "@/components/SectionContainer";
// // import { PaymentService } from "@/api/AccontingApi";
// // import { Button } from "@/components/ui/button";
// // import BillUploadPanel from "@/components/shared/bill-upload-panel";
// // import { useCreateSupplier } from "@/features/supplier/queries";
// // import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// // import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

// // const url = import.meta.env.VITE_API_BASE_URL;

// // const supplierDefault = {
// //   supplierName: "",
// //   contactPerson: "",
// //   phone: "",
// //   mobile: "",
// //   email: "",
// //   address: "",
// //   remarks: "",
// //   status: "1",
// // };

// // const MONTHS = {
// //   JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
// //   JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
// // };

// // const toDateInputValue = (val) => {
// //   if (!val) return "";
// //   const str = String(val).trim();

// //   if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.split("T")[0];

// //   const match = str.match(/^(\d{2})-([A-Za-z]{3})-(\d{2})$/);
// //   if (match) {
// //     const [, day, mon, yy] = match;
// //     const month = MONTHS[mon.toUpperCase()];
// //     if (!month) return "";
// //     return `20${yy}-${month}-${day}`;
// //   }

// //   const d = new Date(str);
// //   if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];

// //   return "";
// // };

// // /* ── Shared design tokens (visual only) ──────────────────────────────────── */
// // const card =
// //   "bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
// // const sectionHeader =
// //   "flex items-center gap-3 px-6 py-4 border-b border-slate-100";
// // const sectionIconWrap =
// //   "flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 shrink-0";
// // const sectionTitle = "text-[15px] font-semibold text-slate-800 leading-none";
// // const sectionSubtitle = "text-xs text-slate-400 mt-1";
// // const fieldLabel =
// //   "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
// // const fieldInput =
// //   "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 disabled:hover:border-slate-200 transition-all";
// // const fieldInputReadOnly = `${fieldInput} bg-slate-100 text-slate-500`;

// // const PeriodStatusBadge = ({ isPeriodClosed, noPeriodDefined }) => {
// //   if (isPeriodClosed) {
// //     return (
// //       <span className="inline-flex items-center gap-1 text-[10px] font-semibold  px-2 py-0.5 rounded-full">
// //         <Lock size={10} /> Period Closed
// //       </span>
// //     );
// //   }
// //   if (noPeriodDefined) {
// //     return (
// //       <span className="inline-flex items-center gap-1 text-[10px] font-semibold  px-2 py-0.5 rounded-full">
// //         <AlertTriangle size={10} /> No Period
// //       </span>
// //     );
// //   }
// //   return null;
// // };

// // const PaymentCreate = () => {
// //   const navigate = useNavigate();
// //   const queryClient = useQueryClient();
// //   const today = new Date().toISOString().split("T")[0];
// //   const location = useLocation();
// //   const userId = useAuthUserId();

// //   const [billFiles, setBillFiles] = useState([]);

// //   const [rows, setRows] = useState([
// //     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
// //   ]);

// //   const [showModal, setShowModal] = useState(false);
// //   const [showSupplierModal, setShowSupplierModal] = useState(false);
// //   const [supplierForm, setSupplierForm] = useState(supplierDefault);
// //   const [supplierErrors, setSupplierErrors] = useState({});

// //   const [form, setForm] = useState({
// //     entryDate: today,
// //     invoiceNo: "",
// //     poNumber: "",
// //     grnNo: "",
// //     supporting: "",
// //     description: "",
// //     supplier: "",
// //     glDate: today,
// //     paymentCode: "",
// //     accountId: "",
// //     particular: "",
// //     amount: "",
// //     totalAmount: 0,
// //     inv_type: "",
// //   });

// //   const { data: periodStatus } = usePeriodStatusForDate("AP", form.glDate);
// //   const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
// //   const noPeriodDefined = !!form.glDate && periodStatus === null;

// //   // ── Queries ──────────────────────────────────────────────────────────────────
// //   const { data: suppliers = [] } = useQuery({
// //     queryKey: ["suppliers"],
// //     queryFn: async () =>
// //       (await axios.get(`${url}/api/supplier-type`)).data.data || [],
// //   });

// //   const { data: PaymentCodes = [] } = useQuery({
// //     queryKey: ["paymentCodes"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/receive-code`);
// //       return res.data.success ? res.data.data || [] : [];
// //     },
// //   });

// //   const { data: invTypes = [] } = useQuery({
// //     queryKey: ["invTypes"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/inv-type`);
// //       return res.data.data || [];
// //     },
// //   });

// //   const { data: accounts = [] } = useQuery({
// //     queryKey: ["accounts"],
// //     queryFn: async () => {
// //       const res = await axios.get(`${url}/api/account-code`);
// //       return res.data.success === 1
// //         ? res.data.data.map((a) => ({
// //             value: a.ACCOUNT_ID,
// //             label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
// //             name: a.ACCOUNT_NAME,
// //           }))
// //         : [];
// //     },
// //   });

// //   // ── Upload bills helper ──────────────────────────────────────────────────────
// //   const uploadBills = async (glMasterId) => {
// //     if (!billFiles.length || !glMasterId) return;
// //     const uploads = billFiles.map((file) => {
// //       const fd = new FormData();
// //       fd.append("doc_file", file);
// //       fd.append("GLMASTERID", glMasterId);
// //       return axios.post(`${url}/api/gldoc`, fd);
// //     });
// //     await Promise.allSettled(uploads);
// //   };

// //   // ── Lock the Inventory (if this payment came from Inventory) ──────────────
// //   const lockInventory = async (inventoryHid) => {
// //     if (!inventoryHid) return;
// //     try {
// //       await axios.put(`${url}/api/inventory/${inventoryHid}/lock`);
// //       queryClient.invalidateQueries(["inventories"]);
// //     } catch (err) {
// //       console.error("Failed to lock inventory:", err);
// //     }
// //   };

// //   // ── Lock the Purchase Recognition form (if this payment came from PR) ────────
// //   const lockRecognitionForm = async (purchaseFormId) => {
// //     if (!purchaseFormId) return;
// //     try {
// //       await axios.put(`${url}/api/purchase-recognition/${purchaseFormId}/lock`);
// //       queryClient.invalidateQueries(["purchaseRecognitions"]);
// //       queryClient.invalidateQueries(["purchaseRecognition", purchaseFormId]);
// //     } catch (err) {
// //       console.error("Failed to lock recognition form:", err);
// //     }
// //   };

// //   // ── Voucher Mutation ─────────────────────────────────────────────────────────
// //   const mutation = useMutation({
// //     mutationFn: async (payload) => {
// //       const res = await PaymentService.insert(payload);
// //       return res.data;
// //     },
// //     onSuccess: async (data) => {
// //       if (data.status === "success") {
// //         await uploadBills(data.masterID || data.id);
// //         await lockRecognitionForm(location.state?.purchaseFormId);
// //         await lockInventory(location.state?.inventoryHid);

// //         toast.success("Voucher created successfully!");
// //         setBillFiles([]);
// //         setForm({
// //           entryDate: today,
// //           invoiceNo: "",
// //           poNumber: "",
// //           grnNo: "",
// //           supporting: "",
// //           description: "",
// //           supplier: "",
// //           glDate: today,
// //           paymentCode: "",
// //           accountId: "",
// //           particular: "",
// //           amount: "",
// //           totalAmount: 0,
// //           inv_type: "",
// //         });
// //         setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
// //         queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
// //         navigate("/dashboard/payment-voucher");
// //       } else {
// //         toast.error("Error processing voucher.");
// //       }
// //     },
// //     onError: () => toast.error("Error submitting voucher. Please try again."),
// //     onSettled: () => setShowModal(false),
// //   });

// //   // ── Supplier Mutation ────────────────────────────────────────────────────────
// //   const supplierMutation = useCreateSupplier();

// //   const validateSupplier = () => {
// //     const errs = {};
// //     if (!supplierForm.supplierName.trim())
// //       errs.supplierName = "Supplier name is required";
// //     if (
// //       supplierForm.email &&
// //       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
// //     )
// //       errs.email = "Invalid email address";
// //     setSupplierErrors(errs);
// //     return Object.keys(errs).length === 0;
// //   };

// //   const handleSupplierSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateSupplier()) return;
// //     try {
// //       await supplierMutation.mutateAsync({
// //         SUPPLIER_NAME: supplierForm.supplierName,
// //         CONTACT_PERSON: supplierForm.contactPerson || null,
// //         PHONE: supplierForm.phone || null,
// //         MOBILE: supplierForm.mobile || null,
// //         EMAIL: supplierForm.email || null,
// //         ADDRESS: supplierForm.address || null,
// //         REMARKS: supplierForm.remarks || null,
// //         STATUS: Number(supplierForm.status),
// //         ENTRY_BY: null,
// //         PASSWORD: null,
// //         ORG_ID: null,
// //         DUE: null,
// //         FAX: null,
// //       });
// //       toast.success("Supplier created successfully!");
// //       queryClient.invalidateQueries(["suppliers"]);
// //       setSupplierForm(supplierDefault);
// //       setSupplierErrors({});
// //       setShowSupplierModal(false);
// //     } catch (err) {
// //       toast.error(err?.message || "Failed to create supplier.");
// //     }
// //   };

// //   const handleCloseSupplierModal = () => {
// //     setSupplierForm(supplierDefault);
// //     setSupplierErrors({});
// //     setShowSupplierModal(false);
// //   };

// //   // ── Row handlers ─────────────────────────────────────────────────────────────
// //   const addRow = () => {
// //     if (!form.accountId || !form.amount) {
// //       toast.error("Please select account and enter amount");
// //       return;
// //     }
// //     const account = accounts.find((a) => a.value === form.accountId);
// //     const newRow = {
// //       id: Date.now(),
// //       accountCode: form.accountId,
// //       particulars: form.particular || account?.label || "",
// //       amount: parseFloat(form.amount),
// //     };
// //     const updated =
// //       rows.length === 1 && rows[0].id === "dummy"
// //         ? [newRow]
// //         : [...rows, newRow];
// //     setRows(updated);
// //     setForm({
// //       ...form,
// //       accountId: "",
// //       particular: "",
// //       amount: "",
// //       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
// //     });
// //   };

// //   const removeRow = (id) => {
// //     const updated = rows.filter((r) => r.id !== id);
// //     setRows(updated);
// //     setForm({
// //       ...form,
// //       totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
// //     });
// //   };

// //   // ── Prefill from Purchase Recognition's "Create Payment" OR
// //   //    Inventory's "Payment Voucher" button ─────────────────────────────────
// //   useEffect(() => {
// //     const incoming = location.state;
// //     if (!incoming) return;

// //     setForm((f) => ({
// //       ...f,
// //       supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
// //       entryDate: incoming.entryDate ? toDateInputValue(incoming.entryDate) : f.entryDate,
// //       glDate: incoming.glDate ? toDateInputValue(incoming.glDate) : f.glDate,
// //       description: incoming.description || f.description,
// //       invoiceNo: incoming.invoiceNo || f.invoiceNo,
// //       poNumber: incoming.poNumber || f.poNumber,
// //       grnNo: incoming.grnNo || f.grnNo,
// //       inv_type: incoming.invType || f.inv_type,
// //       paymentCode: incoming.paymentCode || f.paymentCode,
// //     }));

// //     if (incoming.rows?.length > 0) {
// //       const mappedRows = incoming.rows.map((r, i) => ({
// //         id: Date.now() + i,
// //         accountCode: "",
// //         particulars: r.particulars || "",
// //         amount: Number(r.amount || 0),
// //       }));
// //       setRows(mappedRows);
// //       setForm((f) => ({
// //         ...f,
// //         totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
// //       }));
// //     }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // ── Voucher Submit ───────────────────────────────────────────────────────────
// //   const handleSubmit = () => {
// //     if (
// //       !form.entryDate ||
// //       !form.glDate ||
// //       !form.paymentCode ||
// //       !form.supplier ||
// //       rows.length === 0 ||
// //       rows[0].id === "dummy"
// //     ) {
// //       toast.error("Please fill all required fields and add at least one row.");
// //       return;
// //     }
// //     if (rows.some((r) => !r.accountCode || !r.particulars)) {
// //       toast.error("Each row must have Account Code and Particular filled.");
// //       return;
// //     }
// //     mutation.mutate({
// //       trans_date: form.entryDate,
// //       gl_date: form.glDate,
// //       receive_desc: form.description,
// //       supporting: String(form.supporting),
// //       receive: form.paymentCode,
// //       supplierid: form.supplier,
// //       user_id: "1",
// //       totalAmount: String(form.totalAmount),
// //       accountID: rows.map((r) => r.accountCode),
// //       amount2: rows.map((r) => String(r.amount || 0)),
// //       inv_type: form.inv_type ? Number(form.inv_type) : null,
// //       po_number: form.poNumber || null,
// //       grn_no: form.grnNo || null,
// //       entry_by: userId,
// //     });
// //   };

// //   const isSubmitting = mutation.isPending;
// //   const isSupplierSaving = supplierMutation.isPending;

// //   const inputCls =
// //     "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all";
// //   const labelCls = "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
// //   const errCls = "text-xs text-red-500 mt-1";

// //   return (
// //     <SectionContainer>
// //       <div className="flex flex-col min-h-full">
// //       <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
// //         {/* Header */}
// //         <div className="flex items-center justify-between flex-wrap gap-3">
// //           <div>
// //             <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
// //               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
// //               Accounts Payable
// //             </div>
// //             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Payment Voucher</h2>
// //             <p className="text-sm text-slate-500 mt-0.5">Record a new supplier payment entry</p>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <Button
// //               variant="outline"
// //               className="border-slate-200 text-slate-700 hover:bg-slate-50"
// //               onClick={() => setShowSupplierModal(true)}
// //             >
// //               <Users size={15} className="mr-1.5" /> New Supplier
// //             </Button>
// //             <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/dashboard/payment-voucher")}>
// //               <ArrowLeft size={16} className="mr-1.5" /> Back
// //             </Button>
// //           </div>
// //         </div>

// //         {/* ── Section: Voucher Details ─────────────────────────────────────── */}
// //         <div className={card}>
// //           <div className={sectionHeader}>
// //             <div className={sectionIconWrap}>
// //               <FileText size={16} />
// //             </div>
// //             <div>
// //               <h3 className={sectionTitle}>Voucher Details</h3>
// //               <p className={sectionSubtitle}>Supplier, references and posting dates</p>
// //             </div>
// //           </div>

// //           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
// //             {/* Bill upload spans first column, full height */}
// //             <div className="md:row-span-3">
// //               <span className={fieldLabel}>Bill Attachments</span>
// //               <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:border-slate-400 transition-colors">
// //                 <BillUploadPanel
// //                   files={billFiles}
// //                   onChange={setBillFiles}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>Supplier <span className="text-red-500">*</span></label>
// //               <select
// //                 value={form.supplier}
// //                 onChange={(e) => setForm({ ...form, supplier: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className={fieldInput}
// //               >
// //                 <option value="">Select supplier</option>
// //                 {suppliers.map((s) => (
// //                   <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
// //                     {s.SUPPLIER_NAME}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>Entry Date</label>
// //               <input
// //                 type="date"
// //                 value={form.entryDate}
// //                 disabled={isSubmitting}
// //                 onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
// //                 className={fieldInput}
// //               />
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>Invoice No</label>
// //               <input type="text" value={form.invoiceNo} readOnly className={fieldInputReadOnly} />
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>PO Number</label>
// //               <input type="text" value={form.poNumber} readOnly className={fieldInputReadOnly} />
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>GRN No</label>
// //               <input type="text" value={form.grnNo} readOnly className={fieldInputReadOnly} />
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>No. of Supporting</label>
// //               <input
// //                 type="number"
// //                 value={form.supporting}
// //                 disabled={isSubmitting}
// //                 onChange={(e) => setForm({ ...form, supporting: e.target.value })}
// //                 className={fieldInput}
// //               />
// //             </div>

// //            <div>
// //               <div className="flex items-center justify-between mb-1.5">
// //                 <label className={`${fieldLabel} mb-0`}>GL Date</label>
// //                 <PeriodStatusBadge
// //                   isPeriodClosed={isPeriodClosed}
// //                   noPeriodDefined={noPeriodDefined}
// //                 />
// //               </div>
// //               <input
// //                 type="date"
// //                 value={form.glDate}
// //                 onChange={(e) => setForm({ ...form, glDate: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className={`${fieldInput} ${
// //                   isPeriodClosed
// //                     ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-500/10"
// //                     : noPeriodDefined
// //                       ? "border-amber-300 bg-amber-50/40 focus:border-amber-400 focus:ring-amber-500/10"
// //                       : ""
// //                 }`}
// //               />
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>Type</label>
// //               <select
// //                 value={form.inv_type}
// //                 onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className={fieldInput}
// //               >
// //                 <option value="">Select type</option>
// //                 {invTypes.map((t) => (
// //                   <option key={t.ID} value={String(t.ID)}>
// //                     {t.DESCRIPTIO}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>Payment Code</label>
// //               <select
// //                 value={form.paymentCode}
// //                 onChange={(e) => setForm({ ...form, paymentCode: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className={fieldInput}
// //               >
// //                 <option value="">Select payment</option>
// //                 {PaymentCodes.map((c) => (
// //                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
// //                     {c.ACCOUNT_NAME}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div>
// //               <label className={fieldLabel}>Total Amount</label>
// //               <input
// //                 type="number"
// //                 value={form.totalAmount.toFixed(2)}
// //                 readOnly
// //                 className={`${fieldInputReadOnly} font-semibold`}
// //               />
// //             </div>
// //           </div>

// //           <div className="px-6 pb-6">
// //             <label className={fieldLabel}>Description</label>
// //             <textarea
// //               value={form.description}
// //               onChange={(e) => setForm({ ...form, description: e.target.value })}
// //               disabled={isSubmitting}
// //               rows={3}
// //               placeholder="Add a note about this voucher..."
// //               className={`${fieldInput} resize-none`}
// //             />
// //           </div>
// //         </div>

// //         {/* ── Section: Account Distribution ────────────────────────────────── */}
// //         <div className={card}>
// //           <div className={sectionHeader}>
// //             <div className={sectionIconWrap}>
// //               <Receipt size={16} />
// //             </div>
// //             <div>
// //               <h3 className={sectionTitle}>Account Distribution</h3>
// //               <p className={sectionSubtitle}>Break the total down across GL accounts</p>
// //             </div>
// //           </div>

// //           <div className="p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_auto] gap-4 items-end">
// //             <div>
// //               <label className={fieldLabel}>Account ID</label>
// //               <Select
// //                 options={accounts}
// //                 value={accounts.find((a) => a.value === form.accountId) || null}
// //                 onChange={(s) =>
// //                   setForm({
// //                     ...form,
// //                     accountId: s?.value || "",
// //                     particular: s?.name || "",
// //                   })
// //                 }
// //                 placeholder="Search account..."
// //                 isClearable
// //                 isSearchable
// //                 isDisabled={isSubmitting}
// //                 menuPortalTarget={document.body}
// //                 styles={{
// //                   control: (b, state) => ({
// //                     ...b,
// //                     borderColor: state.isFocused ? "#818cf8" : "#e2e8f0",
// //                     borderRadius: "0.5rem",
// //                     minHeight: "38px",
// //                     backgroundColor: state.isFocused ? "#fff" : "#f8fafc",
// //                     boxShadow: state.isFocused ? "0 0 0 4px rgba(99,102,241,0.1)" : "none",
// //                     "&:hover": { borderColor: "#cbd5e1" },
// //                   }),
// //                   menuPortal: (b) => ({ ...b, zIndex: 9999 }),
// //                   menu: (b) => ({
// //                     ...b,
// //                     backgroundColor: "white",
// //                     border: "1px solid #e2e8f0",
// //                     boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
// //                   }),
// //                 }}
// //               />
// //             </div>
// //             <div>
// //               <label className={fieldLabel}>Particular</label>
// //               <input type="text" value={form.particular} readOnly className={fieldInputReadOnly} />
// //             </div>
// //             <div>
// //               <label className={fieldLabel}>Amount</label>
// //               <input
// //                 type="number"
// //                 value={form.amount}
// //                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
// //                 disabled={isSubmitting}
// //                 className={fieldInput}
// //               />
// //             </div>
// //             <div>
// //               <Button
// //                 type="button"
// //                 onClick={addRow}
// //                 disabled={isSubmitting}
// //                 className="cursor-pointer  text-white px-4 py-2 rounded-lg flex items-center font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
// //               >
// //                 <span className="mr-1.5 font-bold text-base leading-none">+</span>Add
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Rows table */}
// //           <div className="px-6 pb-6 overflow-x-auto">
// //             <table className="w-full border-collapse text-sm">
// //               <thead>
// //                 <tr className="bg-slate-50">
// //                   {[
// //                     { label: "Account Code", align: "text-left" },
// //                     { label: "Particulars", align: "text-left" },
// //                     { label: "Amount", align: "text-right" },
// //                     { label: "", align: "text-center" },
// //                   ].map(({ label, align }) => (
// //                     <th
// //                       key={label || "actions"}
// //                       className={`px-4 py-2.5 ${align} font-semibold text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200 first:rounded-l-lg last:rounded-r-lg`}
// //                     >
// //                       {label}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {rows.map((row, i) => (
// //                   <tr key={row.id} className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
// //                     <td className="px-4 py-2.5 text-slate-700 font-medium">{row.accountCode}</td>
// //                     <td className="px-4 py-2.5 text-slate-600">{row.particulars}</td>
// //                     <td className="px-4 py-2.5 text-slate-700 text-right tabular-nums">
// //                       {Number(row.amount).toFixed(2)}
// //                     </td>
// //                     <td className="px-4 py-2.5 text-center">
// //                       {row.id !== "dummy" && (
// //                         <Button
// //                           type="button"
// //                           variant="ghost"
// //                           size="icon"
// //                           onClick={() => removeRow(row.id)}
// //                           disabled={isSubmitting}
// //                         >
// //                           <Trash2 className="w-4 h-4 " />
// //                         </Button>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 ))}
// //                 {rows.length > 0 && rows[0].id !== "dummy" && (
// //                   <tr className="font-semibold bg-slate-50">
// //                     <td colSpan="2" className="px-4 py-2.5 text-right text-sm text-slate-800">
// //                       Total
// //                     </td>
// //                     <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
// //                       {form.totalAmount.toFixed(2)}
// //                     </td>
// //                     <td />
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Sticky footer action bar — always spans the full width of whatever
// //           container/screen (normal or maximized) this form is rendered in */}
// //       <div className="sticky bottom-0 z-40 w-full mt-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
// //         <span className="text-xs text-slate-400 font-medium">Voucher ID · auto-generated</span>
// //         <div className="flex items-center gap-3">
// //           <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/dashboard/payment-voucher")} disabled={isSubmitting}>
// //             Cancel
// //           </Button>
// //           <Button
// //             type="button"
// //             onClick={() => setShowModal(true)}
// //             disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
// //             className=" text-white shadow-sm"
// //           >
// //             {isSubmitting ? "Submitting..." : "Create Voucher"}
// //           </Button>
// //         </div>
// //       </div>
// //       </div>

// //       {/* ── Voucher Confirmation Modal ── */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
// //               <ListChecks size={18} className="text-indigo-600" />
// //               <h2 className="text-base font-bold text-gray-900">Confirm Voucher Submission</h2>
// //             </div>
// //             <div className="px-6 py-5 space-y-2 text-sm">
// //               <p><strong className="text-gray-700">Entry Date:</strong> <span className="text-gray-600">{form.entryDate}</span></p>
// //               <p><strong className="text-gray-700">PO Number:</strong> <span className="text-gray-600">{form.poNumber || "—"}</span></p>
// //               <p><strong className="text-gray-700">GRN No:</strong> <span className="text-gray-600">{form.grnNo || "—"}</span></p>
// //               <p><strong className="text-gray-700">No. of Supporting:</strong> <span className="text-gray-600">{form.supporting}</span></p>
// //               <p><strong className="text-gray-700">Description:</strong> <span className="text-gray-600">{form.description}</span></p>
// //               <p>
// //                 <strong className="text-gray-700">Supplier:</strong>{" "}
// //                 <span className="text-gray-600">
// //                   {
// //                     suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
// //                       ?.SUPPLIER_NAME
// //                   }
// //                 </span>
// //               </p>
// //               <p><strong className="text-gray-700">GL Date:</strong> <span className="text-gray-600">{form.glDate}</span></p>
// //               <p><strong className="text-gray-700">Payment Code:</strong> <span className="text-gray-600">{form.paymentCode}</span></p>
// //               {billFiles.length > 0 && (
// //                 <div>
// //                   <strong className="text-gray-700">Bills ({billFiles.length}):</strong>
// //                   <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
// //                     {billFiles.map((f, i) => (
// //                       <li key={i}>{f.name}</li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //               )}
// //               <h3 className="font-semibold mt-3 text-gray-800">Accounts</h3>
// //               <ul className="list-disc pl-5 text-gray-600">
// //                 {rows
// //                   .filter((r) => r.id !== "dummy")
// //                   .map((row, i) => (
// //                     <li key={i}>
// //                       {row.accountCode} — {row.particulars} — {row.amount}
// //                     </li>
// //                   ))}
// //               </ul>
// //               <p className="font-semibold mt-2 text-gray-900">
// //                 Total: {form.totalAmount.toFixed(2)}
// //               </p>
// //             </div>
// //             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <Button
// //                 onClick={handleSubmit}
// //                 disabled={isSubmitting}
// //                 className="px-4 py-2 rounded-lg  text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
// //               >
// //                 {isSubmitting ? "Submitting..." : "Confirm"}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ── Add Supplier Dialog Modal ── */}
// //       {showSupplierModal && (
// //         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl w-full md:w-[560px] max-h-[90vh] overflow-y-auto">
// //             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
// //               <div className="flex items-center gap-2">
// //                 <div className="p-1.5 rounded-lg bg-indigo-50">
// //                   <Users size={18} className="text-indigo-600" />
// //                 </div>
// //                 <div>
// //                   <h2 className="text-base font-bold text-gray-900">
// //                     Add New Supplier
// //                   </h2>
// //                   <p className="text-xs text-gray-500">
// //                     Create a new supplier record
// //                   </p>
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={handleCloseSupplierModal}
// //                 disabled={isSupplierSaving}
// //                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// //               >
// //                 <X size={18} className="text-gray-500" />
// //               </button>
// //             </div>

// //             <form onSubmit={handleSupplierSubmit} className="px-6 py-5 space-y-4">
// //               <div>
// //                 <label className={labelCls}>
// //                   Supplier Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={supplierForm.supplierName}
// //                   onChange={(e) =>
// //                     setSupplierForm({ ...supplierForm, supplierName: e.target.value })
// //                   }
// //                   placeholder="Enter supplier name"
// //                   disabled={isSupplierSaving}
// //                   className={inputCls}
// //                 />
// //                 {supplierErrors.supplierName && (
// //                   <p className={errCls}>{supplierErrors.supplierName}</p>
// //                 )}
// //               </div>

// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className={labelCls}>Contact Person</label>
// //                   <input
// //                     type="text"
// //                     value={supplierForm.contactPerson}
// //                     onChange={(e) =>
// //                       setSupplierForm({ ...supplierForm, contactPerson: e.target.value })
// //                     }
// //                     placeholder="Contact person"
// //                     disabled={isSupplierSaving}
// //                     className={inputCls}
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className={labelCls}>Phone</label>
// //                   <input
// //                     type="text"
// //                     value={supplierForm.phone}
// //                     onChange={(e) =>
// //                       setSupplierForm({ ...supplierForm, phone: e.target.value })
// //                     }
// //                     placeholder="Phone number"
// //                     disabled={isSupplierSaving}
// //                     className={inputCls}
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className={labelCls}>Mobile</label>
// //                   <input
// //                     type="text"
// //                     value={supplierForm.mobile}
// //                     onChange={(e) =>
// //                       setSupplierForm({ ...supplierForm, mobile: e.target.value })
// //                     }
// //                     placeholder="Mobile number"
// //                     disabled={isSupplierSaving}
// //                     className={inputCls}
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className={labelCls}>Email</label>
// //                   <input
// //                     type="email"
// //                     value={supplierForm.email}
// //                     onChange={(e) =>
// //                       setSupplierForm({ ...supplierForm, email: e.target.value })
// //                     }
// //                     placeholder="email@example.com"
// //                     disabled={isSupplierSaving}
// //                     className={inputCls}
// //                   />
// //                   {supplierErrors.email && (
// //                     <p className={errCls}>{supplierErrors.email}</p>
// //                   )}
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className={labelCls}>Address</label>
// //                 <textarea
// //                   value={supplierForm.address}
// //                   onChange={(e) =>
// //                     setSupplierForm({ ...supplierForm, address: e.target.value })
// //                   }
// //                   placeholder="Supplier address"
// //                   rows={2}
// //                   disabled={isSupplierSaving}
// //                   className={`${inputCls} resize-none`}
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className={labelCls}>Remarks</label>
// //                   <input
// //                     type="text"
// //                     value={supplierForm.remarks}
// //                     onChange={(e) =>
// //                       setSupplierForm({ ...supplierForm, remarks: e.target.value })
// //                     }
// //                     placeholder="Optional remarks"
// //                     disabled={isSupplierSaving}
// //                     className={inputCls}
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className={labelCls}>
// //                     Status <span className="text-red-500">*</span>
// //                   </label>
// //                   <select
// //                     value={supplierForm.status}
// //                     onChange={(e) =>
// //                       setSupplierForm({ ...supplierForm, status: e.target.value })
// //                     }
// //                     disabled={isSupplierSaving}
// //                     className={inputCls}
// //                   >
// //                     <option value="1">Active</option>
// //                     <option value="0">Inactive</option>
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
// //                 <button
// //                   type="button"
// //                   onClick={handleCloseSupplierModal}
// //                   disabled={isSupplierSaving}
// //                   className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <Button
// //                   type="submit"
// //                   disabled={isSupplierSaving}
// //                   className="px-4 py-2 rounded-lg  text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
// //                 >
// //                   {isSupplierSaving ? "Creating..." : "Create Supplier"}
// //                 </Button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </SectionContainer>
// //   );
// // };

// // export default PaymentCreate;

// import { useState, useEffect } from "react";
// import {
//   ArrowLeft,
//   Trash2,
//   Users,
//   X,
//   FileText,
//   Receipt,
//   ListChecks,
//   Lock,
//   AlertTriangle,
// } from "lucide-react";
// import Select from "react-select";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";

// import { SectionContainer } from "@/components/SectionContainer";
// import { PaymentService } from "@/api/AccontingApi";
// import { Button } from "@/components/ui/button";
// import BillUploadPanel from "@/components/shared/bill-upload-panel";
// import { useCreateSupplier } from "@/features/supplier/queries";
// import { useAuthUserId } from "@/hooks/use-auth-helper-id";
// import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

// const url = import.meta.env.VITE_API_BASE_URL;

// const supplierDefault = {
//   supplierName: "",
//   contactPerson: "",
//   phone: "",
//   mobile: "",
//   email: "",
//   address: "",
//   remarks: "",
//   status: "1",
// };

// const MONTHS = {
//   JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
//   JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
// };

// const toDateInputValue = (val) => {
//   if (!val) return "";
//   const str = String(val).trim();

//   if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.split("T")[0];

//   const match = str.match(/^(\d{2})-([A-Za-z]{3})-(\d{2})$/);
//   if (match) {
//     const [, day, mon, yy] = match;
//     const month = MONTHS[mon.toUpperCase()];
//     if (!month) return "";
//     return `20${yy}-${month}-${day}`;
//   }

//   const d = new Date(str);
//   if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];

//   return "";
// };

// /* ── Shared design tokens (visual only) ──────────────────────────────────── */
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

// /* ── Small inline status badge — sits next to the GL Date label instead of
//      a warning line under the field. ────────────────────────────────────── */
// const PeriodStatusBadge = ({ isPeriodClosed, noPeriodDefined }) => {
//   if (isPeriodClosed) {
//     return (
//       <span className="inline-flex items-center gap-1 text-[10px] font-semibold  px-2 py-0.5 rounded-full">
//         <Lock size={10} /> Period Closed
//       </span>
//     );
//   }
//   if (noPeriodDefined) {
//     return (
//       <span className="inline-flex items-center gap-1 text-[10px] font-semibold  px-2 py-0.5 rounded-full">
//         <AlertTriangle size={10} /> No Period
//       </span>
//     );
//   }
//   return null;
// };

// const PaymentCreate = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const today = new Date().toISOString().split("T")[0];
//   const location = useLocation();
//   const userId = useAuthUserId();

//   const [billFiles, setBillFiles] = useState([]);

//   const [rows, setRows] = useState([
//     { id: "dummy", accountCode: "", particulars: "", amount: 0 },
//   ]);

//   const [showModal, setShowModal] = useState(false);
//   const [showSupplierModal, setShowSupplierModal] = useState(false);
//   const [supplierForm, setSupplierForm] = useState(supplierDefault);
//   const [supplierErrors, setSupplierErrors] = useState({});

//   const [form, setForm] = useState({
//     entryDate: today,
//     invoiceNo: "",
//     poNumber: "",
//     grnNo: "",
//     supporting: "",
//     description: "",
//     supplier: "",
//     glDate: today,
//     paymentCode: "",
//     accountId: "",
//     particular: "",
//     amount: "",
//     totalAmount: 0,
//     inv_type: "",
//   });

//   const { data: periodStatus } = usePeriodStatusForDate("AP", form.glDate);
//   const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
//   const noPeriodDefined = !!form.glDate && periodStatus === null;

//   // ── Queries ──────────────────────────────────────────────────────────────────
//   const { data: suppliers = [] } = useQuery({
//     queryKey: ["suppliers"],
//     queryFn: async () =>
//       (await axios.get(`${url}/api/supplier-type`)).data.data || [],
//   });

//   const { data: PaymentCodes = [] } = useQuery({
//     queryKey: ["paymentCodes"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/receive-code`);
//       return res.data.success ? res.data.data || [] : [];
//     },
//   });

//   const { data: invTypes = [] } = useQuery({
//     queryKey: ["invTypes"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/inv-type`);
//       return res.data.data || [];
//     },
//   });

//   const { data: accounts = [] } = useQuery({
//     queryKey: ["accounts"],
//     queryFn: async () => {
//       const res = await axios.get(`${url}/api/account-code`);
//       return res.data.success === 1
//         ? res.data.data.map((a) => ({
//             value: a.ACCOUNT_ID,
//             label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
//             name: a.ACCOUNT_NAME,
//           }))
//         : [];
//     },
//   });

//   // ── Upload bills helper ──────────────────────────────────────────────────────
//   const uploadBills = async (glMasterId) => {
//     if (!billFiles.length || !glMasterId) return;
//     const uploads = billFiles.map((file) => {
//       const fd = new FormData();
//       fd.append("doc_file", file);
//       fd.append("GLMASTERID", glMasterId);
//       return axios.post(`${url}/api/gldoc`, fd);
//     });
//     await Promise.allSettled(uploads);
//   };

//   // ── Lock the Inventory (if this payment came from Inventory) ──────────────
//   const lockInventory = async (inventoryHid) => {
//     if (!inventoryHid) return;
//     try {
//       await axios.put(`${url}/api/inventory/${inventoryHid}/lock`);
//       queryClient.invalidateQueries(["inventories"]);
//     } catch (err) {
//       console.error("Failed to lock inventory:", err);
//     }
//   };

//   // ── Lock the Purchase Recognition form (if this payment came from PR) ────────
//   const lockRecognitionForm = async (purchaseFormId) => {
//     if (!purchaseFormId) return;
//     try {
//       await axios.put(`${url}/api/purchase-recognition/${purchaseFormId}/lock`);
//       queryClient.invalidateQueries(["purchaseRecognitions"]);
//       queryClient.invalidateQueries(["purchaseRecognition", purchaseFormId]);
//     } catch (err) {
//       console.error("Failed to lock recognition form:", err);
//     }
//   };

//   // ── Voucher Mutation ─────────────────────────────────────────────────────────
//   const mutation = useMutation({
//     mutationFn: async (payload) => {
//       const res = await PaymentService.insert(payload);
//       return res.data;
//     },
//     onSuccess: async (data) => {
//       if (data.status === "success") {
//         await uploadBills(data.masterID || data.id);
//         await lockRecognitionForm(location.state?.purchaseFormId);
//         await lockInventory(location.state?.inventoryHid);

//         toast.success("Voucher created successfully!");
//         setBillFiles([]);
//         setForm({
//           entryDate: today,
//           invoiceNo: "",
//           poNumber: "",
//           grnNo: "",
//           supporting: "",
//           description: "",
//           supplier: "",
//           glDate: today,
//           paymentCode: "",
//           accountId: "",
//           particular: "",
//           amount: "",
//           totalAmount: 0,
//           inv_type: "",
//         });
//         setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
//         queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
//         navigate("/dashboard/payment-voucher");
//       } else {
//         toast.error("Error processing voucher.");
//       }
//     },
//     onError: () => toast.error("Error submitting voucher. Please try again."),
//     onSettled: () => setShowModal(false),
//   });

//   // ── Supplier Mutation ────────────────────────────────────────────────────────
//   const supplierMutation = useCreateSupplier();

//   const validateSupplier = () => {
//     const errs = {};
//     if (!supplierForm.supplierName.trim())
//       errs.supplierName = "Supplier name is required";
//     if (
//       supplierForm.email &&
//       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
//     )
//       errs.email = "Invalid email address";
//     setSupplierErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSupplierSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateSupplier()) return;
//     try {
//       await supplierMutation.mutateAsync({
//         SUPPLIER_NAME: supplierForm.supplierName,
//         CONTACT_PERSON: supplierForm.contactPerson || null,
//         PHONE: supplierForm.phone || null,
//         MOBILE: supplierForm.mobile || null,
//         EMAIL: supplierForm.email || null,
//         ADDRESS: supplierForm.address || null,
//         REMARKS: supplierForm.remarks || null,
//         STATUS: Number(supplierForm.status),
//         ENTRY_BY: null,
//         PASSWORD: null,
//         ORG_ID: null,
//         DUE: null,
//         FAX: null,
//       });
//       toast.success("Supplier created successfully!");
//       queryClient.invalidateQueries(["suppliers"]);
//       setSupplierForm(supplierDefault);
//       setSupplierErrors({});
//       setShowSupplierModal(false);
//     } catch (err) {
//       toast.error(err?.message || "Failed to create supplier.");
//     }
//   };

//   const handleCloseSupplierModal = () => {
//     setSupplierForm(supplierDefault);
//     setSupplierErrors({});
//     setShowSupplierModal(false);
//   };

//   // ── Row handlers ─────────────────────────────────────────────────────────────
//   const addRow = () => {
//     if (!form.accountId || !form.amount) {
//       toast.error("Please select account and enter amount");
//       return;
//     }
//     const account = accounts.find((a) => a.value === form.accountId);
//     const newRow = {
//       id: Date.now(),
//       accountCode: form.accountId,
//       particulars: form.particular || account?.label || "",
//       amount: parseFloat(form.amount),
//     };
//     const updated =
//       rows.length === 1 && rows[0].id === "dummy"
//         ? [newRow]
//         : [...rows, newRow];
//     setRows(updated);
//     setForm({
//       ...form,
//       accountId: "",
//       particular: "",
//       amount: "",
//       totalAmount: updated.reduce((s, r) => s + Number(r.amount), 0),
//     });
//   };

//   const removeRow = (id) => {
//     const updated = rows.filter((r) => r.id !== id);
//     setRows(updated);
//     setForm({
//       ...form,
//       totalAmount: updated.reduce((s, r) => s + Number(r.amount || 0), 0),
//     });
//   };

//   // ── Prefill from Purchase Recognition's "Create Payment" OR
//   //    Inventory's "Payment Voucher" button ─────────────────────────────────
//   useEffect(() => {
//     const incoming = location.state;
//     if (!incoming) return;

//     setForm((f) => ({
//       ...f,
//       supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
//       entryDate: incoming.entryDate ? toDateInputValue(incoming.entryDate) : f.entryDate,
//       glDate: incoming.glDate ? toDateInputValue(incoming.glDate) : f.glDate,
//       description: incoming.description || f.description,
//       invoiceNo: incoming.invoiceNo || f.invoiceNo,
//       poNumber: incoming.poNumber || f.poNumber,
//       grnNo: incoming.grnNo || f.grnNo,
//       inv_type: incoming.invType || f.inv_type,
//       paymentCode: incoming.paymentCode || f.paymentCode,
//     }));

//     if (incoming.rows?.length > 0) {
//       const mappedRows = incoming.rows.map((r, i) => ({
//         id: Date.now() + i,
//         accountCode: "",
//         particulars: r.particulars || "",
//         amount: Number(r.amount || 0),
//       }));
//       setRows(mappedRows);
//       setForm((f) => ({
//         ...f,
//         totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
//       }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Voucher Submit ───────────────────────────────────────────────────────────
//   const handleSubmit = () => {
//     if (
//       !form.entryDate ||
//       !form.glDate ||
//       !form.paymentCode ||
//       !form.supplier ||
//       rows.length === 0 ||
//       rows[0].id === "dummy"
//     ) {
//       toast.error("Please fill all required fields and add at least one row.");
//       return;
//     }
//     if (rows.some((r) => !r.accountCode || !r.particulars)) {
//       toast.error("Each row must have Account Code and Particular filled.");
//       return;
//     }
//     mutation.mutate({
//       trans_date: form.entryDate,
//       gl_date: form.glDate,
//       receive_desc: form.description,
//       supporting: String(form.supporting),
//       receive: form.paymentCode,
//       supplierid: form.supplier,
//       user_id: "1",
//       totalAmount: String(form.totalAmount),
//       accountID: rows.map((r) => r.accountCode),
//       amount2: rows.map((r) => String(r.amount || 0)),
//       inv_type: form.inv_type ? Number(form.inv_type) : null,
//       po_number: form.poNumber || null,
//       grn_no: form.grnNo || null,
//       entry_by: userId,
//     });
//   };

//   const isSubmitting = mutation.isPending;
//   const isSupplierSaving = supplierMutation.isPending;

//   const inputCls =
//     "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all";
//   const labelCls = "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
//   const errCls = "text-xs text-red-500 mt-1";

//   return (
//     <SectionContainer>
//       <div className="flex flex-col min-h-full">
//       <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
//         {/* Header */}
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <div>
//             <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
//               Accounts Payable
//             </div>
//             <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Payment Voucher</h2>
//             <p className="text-sm text-slate-500 mt-0.5">Record a new supplier payment entry</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               className="border-slate-200 text-slate-700 hover:bg-slate-50"
//               onClick={() => setShowSupplierModal(true)}
//             >
//               <Users size={15} className="mr-1.5" /> New Supplier
//             </Button>
//             <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/dashboard/payment-voucher")}>
//               <ArrowLeft size={16} className="mr-1.5" /> Back
//             </Button>
//           </div>
//         </div>

//         {/* ── Section: Voucher Details ─────────────────────────────────────── */}
//         <div className={card}>
//           <div className={sectionHeader}>
//             <div className={sectionIconWrap}>
//               <FileText size={16} />
//             </div>
//             <div>
//               <h3 className={sectionTitle}>Voucher Details</h3>
//               <p className={sectionSubtitle}>Supplier, references and posting dates</p>
//             </div>
//           </div>

//           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
//             {/* Bill upload spans first column, full height */}
//             <div className="md:row-span-3">
//               <span className={fieldLabel}>Bill Attachments</span>
//               <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50 hover:border-slate-400 transition-colors">
//                 <BillUploadPanel
//                   files={billFiles}
//                   onChange={setBillFiles}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className={fieldLabel}>Supplier <span className="text-red-500">*</span></label>
//               <select
//                 value={form.supplier}
//                 onChange={(e) => setForm({ ...form, supplier: e.target.value })}
//                 disabled={isSubmitting}
//                 className={fieldInput}
//               >
//                 <option value="">Select supplier</option>
//                 {suppliers.map((s) => (
//                   <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
//                     {s.SUPPLIER_NAME}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={fieldLabel}>Entry Date</label>
//               <input
//                 type="date"
//                 value={form.entryDate}
//                 disabled={isSubmitting}
//                 onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
//                 className={fieldInput}
//               />
//             </div>

//             <div>
//               <label className={fieldLabel}>Invoice No</label>
//               <input type="text" value={form.invoiceNo} readOnly className={fieldInputReadOnly} />
//             </div>

//             <div>
//               <label className={fieldLabel}>PO Number</label>
//               <input type="text" value={form.poNumber} readOnly className={fieldInputReadOnly} />
//             </div>

//             <div>
//               <label className={fieldLabel}>GRN No</label>
//               <input type="text" value={form.grnNo} readOnly className={fieldInputReadOnly} />
//             </div>

//             <div>
//               <label className={fieldLabel}>No. of Supporting</label>
//               <input
//                 type="number"
//                 value={form.supporting}
//                 disabled={isSubmitting}
//                 onChange={(e) => setForm({ ...form, supporting: e.target.value })}
//                 className={fieldInput}
//               />
//             </div>

//             {/* ── GL Date — period status shows as a compact badge next to
//                 the label instead of a text line under the field. ────────── */}
//             <div>
//               <div className="flex items-center justify-between mb-1.5">
//                 <label className={`${fieldLabel} mb-0`}>GL Date</label>
//                 <PeriodStatusBadge
//                   isPeriodClosed={isPeriodClosed}
//                   noPeriodDefined={noPeriodDefined}
//                 />
//               </div>
//               <input
//                 type="date"
//                 value={form.glDate}
//                 onChange={(e) => setForm({ ...form, glDate: e.target.value })}
//                 disabled={isSubmitting}
//                 className={`${fieldInput} ${
//                   isPeriodClosed
//                     ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-red-500/10"
//                     : noPeriodDefined
//                       ? "border-amber-300 bg-amber-50/40 focus:border-amber-400 focus:ring-amber-500/10"
//                       : ""
//                 }`}
//               />
//             </div>

//             <div>
//               <label className={fieldLabel}>Type</label>
//               <select
//                 value={form.inv_type}
//                 onChange={(e) => setForm({ ...form, inv_type: e.target.value })}
//                 disabled={isSubmitting}
//                 className={fieldInput}
//               >
//                 <option value="">Select type</option>
//                 {invTypes.map((t) => (
//                   <option key={t.ID} value={String(t.ID)}>
//                     {t.DESCRIPTIO}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={fieldLabel}>Payment Code</label>
//               <select
//                 value={form.paymentCode}
//                 onChange={(e) => setForm({ ...form, paymentCode: e.target.value })}
//                 disabled={isSubmitting}
//                 className={fieldInput}
//               >
//                 <option value="">Select payment</option>
//                 {PaymentCodes.map((c) => (
//                   <option key={c.ACCOUNT_ID} value={c.ACCOUNT_ID}>
//                     {c.ACCOUNT_NAME}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={fieldLabel}>Total Amount</label>
//               <input
//                 type="number"
//                 value={form.totalAmount.toFixed(2)}
//                 readOnly
//                 className={`${fieldInputReadOnly} font-semibold`}
//               />
//             </div>
//           </div>

//           <div className="px-6 pb-6">
//             <label className={fieldLabel}>Description</label>
//             <textarea
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//               disabled={isSubmitting}
//               rows={3}
//               placeholder="Add a note about this voucher..."
//               className={`${fieldInput} resize-none`}
//             />
//           </div>
//         </div>

//         {/* ── Section: Account Distribution ────────────────────────────────── */}
//         <div className={card}>
//           <div className={sectionHeader}>
//             <div className={sectionIconWrap}>
//               <Receipt size={16} />
//             </div>
//             <div>
//               <h3 className={sectionTitle}>Account Distribution</h3>
//               <p className={sectionSubtitle}>Break the total down across GL accounts</p>
//             </div>
//           </div>

//           <div className="p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_auto] gap-4 items-end">
//             <div>
//               <label className={fieldLabel}>Account ID</label>
//               <Select
//                 options={accounts}
//                 value={accounts.find((a) => a.value === form.accountId) || null}
//                 onChange={(s) =>
//                   setForm({
//                     ...form,
//                     accountId: s?.value || "",
//                     particular: s?.name || "",
//                   })
//                 }
//                 placeholder="Search account..."
//                 isClearable
//                 isSearchable
//                 isDisabled={isSubmitting}
//                 menuPortalTarget={document.body}
//                 styles={{
//                   control: (b, state) => ({
//                     ...b,
//                     borderColor: state.isFocused ? "#818cf8" : "#e2e8f0",
//                     borderRadius: "0.5rem",
//                     minHeight: "38px",
//                     backgroundColor: state.isFocused ? "#fff" : "#f8fafc",
//                     boxShadow: state.isFocused ? "0 0 0 4px rgba(99,102,241,0.1)" : "none",
//                     "&:hover": { borderColor: "#cbd5e1" },
//                   }),
//                   menuPortal: (b) => ({ ...b, zIndex: 9999 }),
//                   menu: (b) => ({
//                     ...b,
//                     backgroundColor: "white",
//                     border: "1px solid #e2e8f0",
//                     boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
//                   }),
//                 }}
//               />
//             </div>
//             <div>
//               <label className={fieldLabel}>Particular</label>
//               <input type="text" value={form.particular} readOnly className={fieldInputReadOnly} />
//             </div>
//             <div>
//               <label className={fieldLabel}>Amount</label>
//               <input
//                 type="number"
//                 value={form.amount}
//                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                 disabled={isSubmitting}
//                 className={fieldInput}
//               />
//             </div>
//             <div>
//               <Button
//                 type="button"
//                 onClick={addRow}
//                  disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
//                 className="cursor-pointer  text-white px-4 py-2 rounded-lg flex items-center font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
//               >
//                 <span className="mr-1.5 font-bold text-base leading-none">+</span>Add
//               </Button>
//             </div>
//           </div>

//           {/* Rows table */}
//           <div className="px-6 pb-6 overflow-x-auto">
//             <table className="w-full border-collapse text-sm">
//               <thead>
//                 <tr className="bg-slate-50">
//                   {[
//                     { label: "Account Code", align: "text-left" },
//                     { label: "Particulars", align: "text-left" },
//                     { label: "Amount", align: "text-right" },
//                     { label: "", align: "text-center" },
//                   ].map(({ label, align }) => (
//                     <th
//                       key={label || "actions"}
//                       className={`px-4 py-2.5 ${align} font-semibold text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200 first:rounded-l-lg last:rounded-r-lg`}
//                     >
//                       {label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.map((row, i) => (
//                   <tr key={row.id} className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
//                     <td className="px-4 py-2.5 text-slate-700 font-medium">{row.accountCode}</td>
//                     <td className="px-4 py-2.5 text-slate-600">{row.particulars}</td>
//                     <td className="px-4 py-2.5 text-slate-700 text-right tabular-nums">
//                       {Number(row.amount).toFixed(2)}
//                     </td>
//                     <td className="px-4 py-2.5 text-center">
//                       {row.id !== "dummy" && (
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => removeRow(row.id)}
//                           disabled={isSubmitting}
//                         >
//                           <Trash2 className="w-4 h-4 " />
//                         </Button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//                 {rows.length > 0 && rows[0].id !== "dummy" && (
//                   <tr className="font-semibold bg-slate-50">
//                     <td colSpan="2" className="px-4 py-2.5 text-right text-sm text-slate-800">
//                       Total
//                     </td>
//                     <td className="px-4 py-2.5 text-right text-slate-900 tabular-nums">
//                       {form.totalAmount.toFixed(2)}
//                     </td>
//                     <td />
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Sticky footer action bar — always spans the full width of whatever
//           container/screen (normal or maximized) this form is rendered in */}
//       <div className="sticky bottom-0 z-40 w-full mt-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
//         <span className="text-xs text-slate-400 font-medium">Voucher ID · auto-generated</span>
//         <div className="flex items-center gap-3">
//           <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/dashboard/payment-voucher")} disabled={isSubmitting}>
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             onClick={() => setShowModal(true)}
//             disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
//             className=" text-white shadow-sm"
//           >
//             {isSubmitting ? "Submitting..." : "Create Voucher"}
//           </Button>
//         </div>
//       </div>
//       </div>

//       {/* ── Voucher Confirmation Modal ── */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
//               <ListChecks size={18} className="text-indigo-600" />
//               <h2 className="text-base font-bold text-gray-900">Confirm Voucher Submission</h2>
//             </div>
//             <div className="px-6 py-5 space-y-2 text-sm">
//               <p><strong className="text-gray-700">Entry Date:</strong> <span className="text-gray-600">{form.entryDate}</span></p>
//               <p><strong className="text-gray-700">PO Number:</strong> <span className="text-gray-600">{form.poNumber || "—"}</span></p>
//               <p><strong className="text-gray-700">GRN No:</strong> <span className="text-gray-600">{form.grnNo || "—"}</span></p>
//               <p><strong className="text-gray-700">No. of Supporting:</strong> <span className="text-gray-600">{form.supporting}</span></p>
//               <p><strong className="text-gray-700">Description:</strong> <span className="text-gray-600">{form.description}</span></p>
//               <p>
//                 <strong className="text-gray-700">Supplier:</strong>{" "}
//                 <span className="text-gray-600">
//                   {
//                     suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
//                       ?.SUPPLIER_NAME
//                   }
//                 </span>
//               </p>
//               <p><strong className="text-gray-700">GL Date:</strong> <span className="text-gray-600">{form.glDate}</span></p>
//               <p><strong className="text-gray-700">Payment Code:</strong> <span className="text-gray-600">{form.paymentCode}</span></p>
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
//                 {rows
//                   .filter((r) => r.id !== "dummy")
//                   .map((row, i) => (
//                     <li key={i}>
//                       {row.accountCode} — {row.particulars} — {row.amount}
//                     </li>
//                   ))}
//               </ul>
//               <p className="font-semibold mt-2 text-gray-900">
//                 Total: {form.totalAmount.toFixed(2)}
//               </p>
//             </div>
//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="px-4 py-2 rounded-lg  text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
//               >
//                 {isSubmitting ? "Submitting..." : "Confirm"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Add Supplier Dialog Modal ── */}
//       {showSupplierModal && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full md:w-[560px] max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <div className="flex items-center gap-2">
//                 <div className="p-1.5 rounded-lg bg-indigo-50">
//                   <Users size={18} className="text-indigo-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold text-gray-900">
//                     Add New Supplier
//                   </h2>
//                   <p className="text-xs text-gray-500">
//                     Create a new supplier record
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleCloseSupplierModal}
//                 disabled={isSupplierSaving}
//                 className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <X size={18} className="text-gray-500" />
//               </button>
//             </div>

//             <form onSubmit={handleSupplierSubmit} className="px-6 py-5 space-y-4">
//               <div>
//                 <label className={labelCls}>
//                   Supplier Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={supplierForm.supplierName}
//                   onChange={(e) =>
//                     setSupplierForm({ ...supplierForm, supplierName: e.target.value })
//                   }
//                   placeholder="Enter supplier name"
//                   disabled={isSupplierSaving}
//                   className={inputCls}
//                 />
//                 {supplierErrors.supplierName && (
//                   <p className={errCls}>{supplierErrors.supplierName}</p>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className={labelCls}>Contact Person</label>
//                   <input
//                     type="text"
//                     value={supplierForm.contactPerson}
//                     onChange={(e) =>
//                       setSupplierForm({ ...supplierForm, contactPerson: e.target.value })
//                     }
//                     placeholder="Contact person"
//                     disabled={isSupplierSaving}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Phone</label>
//                   <input
//                     type="text"
//                     value={supplierForm.phone}
//                     onChange={(e) =>
//                       setSupplierForm({ ...supplierForm, phone: e.target.value })
//                     }
//                     placeholder="Phone number"
//                     disabled={isSupplierSaving}
//                     className={inputCls}
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className={labelCls}>Mobile</label>
//                   <input
//                     type="text"
//                     value={supplierForm.mobile}
//                     onChange={(e) =>
//                       setSupplierForm({ ...supplierForm, mobile: e.target.value })
//                     }
//                     placeholder="Mobile number"
//                     disabled={isSupplierSaving}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelCls}>Email</label>
//                   <input
//                     type="email"
//                     value={supplierForm.email}
//                     onChange={(e) =>
//                       setSupplierForm({ ...supplierForm, email: e.target.value })
//                     }
//                     placeholder="email@example.com"
//                     disabled={isSupplierSaving}
//                     className={inputCls}
//                   />
//                   {supplierErrors.email && (
//                     <p className={errCls}>{supplierErrors.email}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className={labelCls}>Address</label>
//                 <textarea
//                   value={supplierForm.address}
//                   onChange={(e) =>
//                     setSupplierForm({ ...supplierForm, address: e.target.value })
//                   }
//                   placeholder="Supplier address"
//                   rows={2}
//                   disabled={isSupplierSaving}
//                   className={`${inputCls} resize-none`}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className={labelCls}>Remarks</label>
//                   <input
//                     type="text"
//                     value={supplierForm.remarks}
//                     onChange={(e) =>
//                       setSupplierForm({ ...supplierForm, remarks: e.target.value })
//                     }
//                     placeholder="Optional remarks"
//                     disabled={isSupplierSaving}
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelCls}>
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={supplierForm.status}
//                     onChange={(e) =>
//                       setSupplierForm({ ...supplierForm, status: e.target.value })
//                     }
//                     disabled={isSupplierSaving}
//                     className={inputCls}
//                   >
//                     <option value="1">Active</option>
//                     <option value="0">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 mt-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseSupplierModal}
//                   disabled={isSupplierSaving}
//                   className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <Button
//                   type="submit"
//                   disabled={isSupplierSaving}
//                   className="px-4 py-2 rounded-lg  text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
//                 >
//                   {isSupplierSaving ? "Creating..." : "Create Supplier"}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </SectionContainer>
//   );
// };

// export default PaymentCreate;

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Trash2,
  Users,
  X,
  FileText,
  Receipt,
  ListChecks,
  Lock,
  AlertTriangle,
} from "lucide-react";
import Select from "react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { SectionContainer } from "@/components/SectionContainer";
import { PaymentService } from "@/api/AccontingApi";
import { Button } from "@/components/ui/button";
import BillUploadPanel from "@/components/shared/bill-upload-panel";
import { useCreateSupplier } from "@/features/supplier/queries";
import { useAuthUserId } from "@/hooks/use-auth-helper-id";
import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

const url = import.meta.env.VITE_API_BASE_URL;

const supplierDefault = {
  supplierName: "",
  contactPerson: "",
  phone: "",
  mobile: "",
  email: "",
  address: "",
  remarks: "",
  status: "1",
};

const MONTHS = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

const toDateInputValue = (val) => {
  if (!val) return "";
  const str = String(val).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.split("T")[0];

  const match = str.match(/^(\d{2})-([A-Za-z]{3})-(\d{2})$/);
  if (match) {
    const [, day, mon, yy] = match;
    const month = MONTHS[mon.toUpperCase()];
    if (!month) return "";
    return `20${yy}-${month}-${day}`;
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];

  return "";
};

/* ── Shared design tokens (visual only) ──────────────────────────────────── */
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

/* ── Small inline status badge — sits next to the GL Date label instead of
     a warning line under the field. ────────────────────────────────────── */
const PeriodStatusBadge = ({ isPeriodClosed, noPeriodDefined }) => {
  if (isPeriodClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold  px-2 py-0.5 rounded-full">
        <Lock size={10} /> Period Closed
      </span>
    );
  }
  if (noPeriodDefined) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold  px-2 py-0.5 rounded-full">
        <AlertTriangle size={10} /> No Period
      </span>
    );
  }
  return null;
};

const PaymentCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const location = useLocation();
  const userId = useAuthUserId();

  const [billFiles, setBillFiles] = useState([]);

  const [rows, setRows] = useState([
    { id: "dummy", accountCode: "", particulars: "", amount: 0 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierForm, setSupplierForm] = useState(supplierDefault);
  const [supplierErrors, setSupplierErrors] = useState({});

  const [form, setForm] = useState({
    entryDate: today,
    invoiceNo: "",
    poNumber: "",
    grnNo: "",
    supporting: "",
    description: "",
    supplier: "",
    glDate: today,
    paymentCode: "",
    accountId: "",
    particular: "",
    amount: "",
    totalAmount: 0,
    inv_type: "",
    type: "MANUAL", // ← Reversal Type: "MANUAL" (default) or "REVERSE"
  });

  const { data: periodStatus } = usePeriodStatusForDate("AP", form.glDate);
  const isPeriodClosed = periodStatus?.STATUS === "CLOSED";
  const noPeriodDefined = !!form.glDate && periodStatus === null;

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () =>
      (await axios.get(`${url}/api/supplier-type`)).data.data || [],
  });

  const { data: PaymentCodes = [] } = useQuery({
    queryKey: ["paymentCodes"],
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
      const res = await axios.get(`${url}/api/account-code`);
      return res.data.success === 1
        ? res.data.data.map((a) => ({
            value: a.ACCOUNT_ID,
            label: `${a.ACCOUNT_ID} - ${a.ACCOUNT_NAME}`,
            name: a.ACCOUNT_NAME,
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

  // ── Lock the Inventory (if this payment came from Inventory) ──────────────
  const lockInventory = async (inventoryHid) => {
    if (!inventoryHid) return;
    try {
      await axios.put(`${url}/api/inventory/${inventoryHid}/lock`);
      queryClient.invalidateQueries(["inventories"]);
    } catch (err) {
      console.error("Failed to lock inventory:", err);
    }
  };

  // ── Lock the Purchase Recognition form (if this payment came from PR) ────────
  const lockRecognitionForm = async (purchaseFormId) => {
    if (!purchaseFormId) return;
    try {
      await axios.put(`${url}/api/purchase-recognition/${purchaseFormId}/lock`);
      queryClient.invalidateQueries(["purchaseRecognitions"]);
      queryClient.invalidateQueries(["purchaseRecognition", purchaseFormId]);
    } catch (err) {
      console.error("Failed to lock recognition form:", err);
    }
  };

  // ── Voucher Mutation ─────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await PaymentService.insert(payload);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        await uploadBills(data.masterID || data.id);
        await lockRecognitionForm(location.state?.purchaseFormId);
        await lockInventory(location.state?.inventoryHid);

        toast.success("Voucher created successfully!");
        setBillFiles([]);
        setForm({
          entryDate: today,
          invoiceNo: "",
          poNumber: "",
          grnNo: "",
          supporting: "",
          description: "",
          supplier: "",
          glDate: today,
          paymentCode: "",
          accountId: "",
          particular: "",
          amount: "",
          totalAmount: 0,
          inv_type: "",
          type: "MANUAL",
        });
        setRows([{ id: "dummy", accountCode: "", particulars: "", amount: 0 }]);
        queryClient.invalidateQueries(["unpostedPaymentVouchers"]);
        navigate("/dashboard/payment-voucher");
      } else {
        toast.error("Error processing voucher.");
      }
    },
    onError: () => toast.error("Error submitting voucher. Please try again."),
    onSettled: () => setShowModal(false),
  });

  // ── Supplier Mutation ────────────────────────────────────────────────────────
  const supplierMutation = useCreateSupplier();

  const validateSupplier = () => {
    const errs = {};
    if (!supplierForm.supplierName.trim())
      errs.supplierName = "Supplier name is required";
    if (
      supplierForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierForm.email)
    )
      errs.email = "Invalid email address";
    setSupplierErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    if (!validateSupplier()) return;
    try {
      await supplierMutation.mutateAsync({
        SUPPLIER_NAME: supplierForm.supplierName,
        CONTACT_PERSON: supplierForm.contactPerson || null,
        PHONE: supplierForm.phone || null,
        MOBILE: supplierForm.mobile || null,
        EMAIL: supplierForm.email || null,
        ADDRESS: supplierForm.address || null,
        REMARKS: supplierForm.remarks || null,
        STATUS: Number(supplierForm.status),
        ENTRY_BY: null,
        PASSWORD: null,
        ORG_ID: null,
        DUE: null,
        FAX: null,
      });
      toast.success("Supplier created successfully!");
      queryClient.invalidateQueries(["suppliers"]);
      setSupplierForm(supplierDefault);
      setSupplierErrors({});
      setShowSupplierModal(false);
    } catch (err) {
      toast.error(err?.message || "Failed to create supplier.");
    }
  };

  const handleCloseSupplierModal = () => {
    setSupplierForm(supplierDefault);
    setSupplierErrors({});
    setShowSupplierModal(false);
  };

  // ── Row handlers ─────────────────────────────────────────────────────────────
  const addRow = () => {
    if (!form.accountId || !form.amount) {
      toast.error("Please select account and enter amount");
      return;
    }
    const account = accounts.find((a) => a.value === form.accountId);
    const newRow = {
      id: Date.now(),
      accountCode: form.accountId,
      particulars: form.particular || account?.label || "",
      amount: parseFloat(form.amount),
    };
    const updated =
      rows.length === 1 && rows[0].id === "dummy"
        ? [newRow]
        : [...rows, newRow];
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

  // ── Prefill from Purchase Recognition's "Create Payment" OR
  //    Inventory's "Payment Voucher" button ─────────────────────────────────
  useEffect(() => {
    const incoming = location.state;
    if (!incoming) return;

    setForm((f) => ({
      ...f,
      supplier: incoming.supplier ? String(incoming.supplier) : f.supplier,
      entryDate: incoming.entryDate ? toDateInputValue(incoming.entryDate) : f.entryDate,
      glDate: incoming.glDate ? toDateInputValue(incoming.glDate) : f.glDate,
      description: incoming.description || f.description,
      invoiceNo: incoming.invoiceNo || f.invoiceNo,
      poNumber: incoming.poNumber || f.poNumber,
      grnNo: incoming.grnNo || f.grnNo,
      inv_type: incoming.invType || f.inv_type,
      paymentCode: incoming.paymentCode || f.paymentCode,
    }));

    if (incoming.rows?.length > 0) {
      const mappedRows = incoming.rows.map((r, i) => ({
        id: Date.now() + i,
        accountCode: "",
        particulars: r.particulars || "",
        amount: Number(r.amount || 0),
      }));
      setRows(mappedRows);
      setForm((f) => ({
        ...f,
        totalAmount: mappedRows.reduce((s, r) => s + Number(r.amount || 0), 0),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Voucher Submit ───────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (
      !form.entryDate ||
      !form.glDate ||
      !form.paymentCode ||
      !form.supplier ||
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
      receive: form.paymentCode,
      supplierid: form.supplier,
      user_id: "1",
      totalAmount: String(form.totalAmount),
      accountID: rows.map((r) => r.accountCode),
      amount2: rows.map((r) => String(r.amount || 0)),
      inv_type: form.inv_type ? Number(form.inv_type) : null,
      po_number: form.poNumber || null,
      grn_no: form.grnNo || null,
      entry_by: userId,
      type: form.type, // ← "MANUAL" or "REVERSE"
    });
  };

  const isSubmitting = mutation.isPending;
  const isSupplierSaving = supplierMutation.isPending;

  const inputCls =
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-800 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all";
  const labelCls = "block text-[11px] font-semibold tracking-wider uppercase text-slate-500 mb-1.5";
  const errCls = "text-xs text-red-500 mt-1";

  return (
    <SectionContainer>
      <div className="flex flex-col min-h-full">
      <div className="max-w-6xl mx-auto w-full space-y-6 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Accounts Payable
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create Payment Voucher</h2>
            <p className="text-sm text-slate-500 mt-0.5">Record a new supplier payment entry</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={() => setShowSupplierModal(true)}
            >
              <Users size={15} className="mr-1.5" /> New Supplier
            </Button>
            <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/dashboard/payment-voucher")}>
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
              <p className={sectionSubtitle}>Supplier, references and posting dates</p>
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
              <label className={fieldLabel}>Supplier <span className="text-red-500">*</span></label>
              <select
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                disabled={isSubmitting}
                className={fieldInput}
              >
                <option value="">Select supplier</option>
                {suppliers.map((s) => (
                  <option key={s.SUPPLIER_ID} value={s.SUPPLIER_ID}>
                    {s.SUPPLIER_NAME}
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
              <input type="text" value={form.invoiceNo} readOnly className={fieldInputReadOnly} />
            </div>

            <div>
              <label className={fieldLabel}>PO Number</label>
              <input type="text" value={form.poNumber} readOnly className={fieldInputReadOnly} />
            </div>

            <div>
              <label className={fieldLabel}>GRN No</label>
              <input type="text" value={form.grnNo} readOnly className={fieldInputReadOnly} />
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

            {/* ── GL Date — period status shows as a compact badge next to
                the label instead of a text line under the field. ────────── */}
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

            <div>
              <label className={fieldLabel}>Payment Code</label>
              <select
                value={form.paymentCode}
                onChange={(e) => setForm({ ...form, paymentCode: e.target.value })}
                disabled={isSubmitting}
                className={fieldInput}
              >
                <option value="">Select payment</option>
                {PaymentCodes.map((c) => (
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
              <p className={sectionSubtitle}>Break the total down across GL accounts</p>
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
                }}
              />
            </div>
            <div>
              <label className={fieldLabel}>Particular</label>
              <input type="text" value={form.particular} readOnly className={fieldInputReadOnly} />
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
                className="cursor-pointer  text-white px-4 py-2 rounded-lg flex items-center font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
              >
                <span className="mr-1.5 font-bold text-base leading-none">+</span>Add
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
                {rows.map((row, i) => (
                  <tr key={row.id} className={`border-b border-slate-100 hover:bg-indigo-50/30 transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                    <td className="px-4 py-2.5 text-slate-700 font-medium">{row.accountCode}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.particulars}</td>
                    <td className="px-4 py-2.5 text-slate-700 text-right tabular-nums">
                      {Number(row.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {row.id !== "dummy" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(row.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4 " />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
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

      {/* Sticky footer action bar — always spans the full width of whatever
          container/screen (normal or maximized) this form is rendered in */}
      <div className="sticky bottom-0 z-40 w-full mt-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center justify-between shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
        <span className="text-xs text-slate-400 font-medium">Voucher ID · auto-generated</span>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" onClick={() => navigate("/dashboard/payment-voucher")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={isSubmitting || isPeriodClosed || noPeriodDefined}
            className=" text-white shadow-sm"
          >
            {isSubmitting ? "Submitting..." : "Create Voucher"}
          </Button>
        </div>
      </div>
      </div>

      {/* ── Voucher Confirmation Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <ListChecks size={18} className="text-indigo-600" />
              <h2 className="text-base font-bold text-gray-900">Confirm Voucher Submission</h2>
            </div>
            <div className="px-6 py-5 space-y-2 text-sm">
              <p><strong className="text-gray-700">Entry Date:</strong> <span className="text-gray-600">{form.entryDate}</span></p>
              <p><strong className="text-gray-700">PO Number:</strong> <span className="text-gray-600">{form.poNumber || "—"}</span></p>
              <p><strong className="text-gray-700">GRN No:</strong> <span className="text-gray-600">{form.grnNo || "—"}</span></p>
              <p><strong className="text-gray-700">No. of Supporting:</strong> <span className="text-gray-600">{form.supporting}</span></p>
              <p><strong className="text-gray-700">Description:</strong> <span className="text-gray-600">{form.description}</span></p>
              <p>
                <strong className="text-gray-700">Supplier:</strong>{" "}
                <span className="text-gray-600">
                  {
                    suppliers.find((s) => String(s.SUPPLIER_ID) === form.supplier)
                      ?.SUPPLIER_NAME
                  }
                </span>
              </p>
              <p><strong className="text-gray-700">GL Date:</strong> <span className="text-gray-600">{form.glDate}</span></p>
              <p><strong className="text-gray-700">Entry Type:</strong> <span className="text-gray-600">{form.type}</span></p>
              <p><strong className="text-gray-700">Payment Code:</strong> <span className="text-gray-600">{form.paymentCode}</span></p>
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
                className="px-4 py-2 rounded-lg  text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Supplier Dialog Modal ── */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-120 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full md:w-[560px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50">
                  <Users size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Add New Supplier
                  </h2>
                  <p className="text-xs text-gray-500">
                    Create a new supplier record
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseSupplierModal}
                disabled={isSupplierSaving}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSupplierSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={supplierForm.supplierName}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, supplierName: e.target.value })
                  }
                  placeholder="Enter supplier name"
                  disabled={isSupplierSaving}
                  className={inputCls}
                />
                {supplierErrors.supplierName && (
                  <p className={errCls}>{supplierErrors.supplierName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Contact Person</label>
                  <input
                    type="text"
                    value={supplierForm.contactPerson}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, contactPerson: e.target.value })
                    }
                    placeholder="Contact person"
                    disabled={isSupplierSaving}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="text"
                    value={supplierForm.phone}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, phone: e.target.value })
                    }
                    placeholder="Phone number"
                    disabled={isSupplierSaving}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Mobile</label>
                  <input
                    type="text"
                    value={supplierForm.mobile}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, mobile: e.target.value })
                    }
                    placeholder="Mobile number"
                    disabled={isSupplierSaving}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    disabled={isSupplierSaving}
                    className={inputCls}
                  />
                  {supplierErrors.email && (
                    <p className={errCls}>{supplierErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelCls}>Address</label>
                <textarea
                  value={supplierForm.address}
                  onChange={(e) =>
                    setSupplierForm({ ...supplierForm, address: e.target.value })
                  }
                  placeholder="Supplier address"
                  rows={2}
                  disabled={isSupplierSaving}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Remarks</label>
                  <input
                    type="text"
                    value={supplierForm.remarks}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, remarks: e.target.value })
                    }
                    placeholder="Optional remarks"
                    disabled={isSupplierSaving}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={supplierForm.status}
                    onChange={(e) =>
                      setSupplierForm({ ...supplierForm, status: e.target.value })
                    }
                    disabled={isSupplierSaving}
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
                  onClick={handleCloseSupplierModal}
                  disabled={isSupplierSaving}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isSupplierSaving}
                  className="px-4 py-2 rounded-lg  text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-60"
                >
                  {isSupplierSaving ? "Creating..." : "Create Supplier"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default PaymentCreate;