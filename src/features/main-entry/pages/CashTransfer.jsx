// import { useState } from "react";
// import { Plus, Trash2 } from "lucide-react";
// import Select from "react-select";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// // import api from "../../../api/Api";

// // import PageTitle from "../../RouteTitle";


// // import { SectionContainer } from "../../SectionContainer";

// import { toast } from "react-toastify";
// // import api from "@/api/Ap";

// import { SectionContainer } from "@/components/SectionContainer";
// import CashTransferTable from "../components/CashTransferTable";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// const url  = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
// const CashTransfer = () => {
//   const queryClient = useQueryClient();

//   const today = new Date().toISOString().split("T")[0];

//   const [message, setMessage] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     entryDate: today,
//     receive_desc: "",
//     toCode: "",
//     fromCode: "",
//     amount: "",
//     receive: "",
//     glDate: today,
//     supporting: "",
    
//   });

//   const { data: accounts = [] } = useQuery({
//     queryKey: ["accounts"],
//     queryFn: async () => {
//       // const res = await api.get("/case_flow_account_code.php");
//        const res = await axios.get(`${url}/api/case-flow-account-code`);
//       if (res.data.success === 1) {
//         return res.data.data.map((acc) => ({
//           value: acc.ACCOUNT_ID,
//           label: `${acc.ACCOUNT_ID} - ${acc.ACCOUNT_NAME}`,
//           name: acc.ACCOUNT_NAME,
//         }));
//       }
//       return [];
//     },
//   });

//   // ---------- MUTATION ----------
//   const mutation = useMutation({
//     mutationFn: async ({ payload }) => {
//       // const apiUrl = "/CashFlowAdd.php";
//        const apiUrl = `${url}/api/cash-flow-add`;
//       const res = await axios.post(apiUrl, payload);
//       return res.data;
//     },
//     onSuccess: (data) => {
//       if (data.status === "success") {
//         toast.success("cash-transfer successfully!");
//         setForm({
//           entryDate: new Date().toISOString().split("T")[0],
//           description: "",
//           amount: "",
//           toCode: "",
//           fromCode: "",
//           cash: "",
//           supporting: "",
//         });

//         queryClient.invalidateQueries(["unpostedVouchers"]);
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

//   const handleSubmit = () => {
//     setMessage("");

//     // Required fields check
//     if (
//       !form.entryDate ||
//       !form.amount ||
//       !form.toCode ||
//       !form.fromCode ||
//       !form.glDate 
     
//     ) {
//       toast.error("Please fill all required fields.");
//       return;
//     }

//     const payload = {
//       trans_date: form.entryDate,
//       receive_desc: form.description || "Cash Transfer",
//       fromCode: form.fromCode,
//       toCode: form.toCode,
//       amount: parseFloat(form.amount) || 0,
//       receive: parseFloat(form.accountId) || 0,
//       GL_ENTRY_DATE: form.glDate,
//       supporting: form.supporting || "0",
//     };
//     mutation.mutate({ payload });
//   };

 
//   return (
//    <SectionContainer>
//      <div className="">
//       {/* <h2 className="text-xl font-semibold text-gray-700 bg-green-200 rounded-lg px-4 mb-2 py-2">
//         Payment Voucher
//       </h2> */}
    

//       {/* Top Form */}
//       <div className=" p-6 space-y-6 bg-white rounded-lg shadow-md">
//         {message && (
//           <p className="text-center text-red-600 font-medium mt-2 mb-2">
//             {message}
//           </p>
//         )}

//         {/* Save button aligned right */}

//         <div className="md:flex justify-between gap-10  bg-white  rounded-lg">
//           {/* bill system */}
//           <div className=" bg-gray-200 border-black">
//             <h1 className=" text-center py-10 px-12">this is bill</h1>
//           </div>

//           {/* all input payment field */}
//           <div className="">
//             {/* Entry Date */}
//             <div className="grid grid-cols-3 opacity-60   px-3 items-center py-2">
//               <label className="font-medium block text-sm  text-foreground">
//                 Entry Date
//               </label>
//               <input
//                 type="date"
//                 value={form.entryDate}
//                 onChange={(e) =>
//                   setForm({ ...form, entryDate: e.target.value })
//                 }
//                 className="col-span-2 w-full border  rounded py-1   bg-white "
//               />
//             </div>

//             {/* Supporting */}
//             {/* <div className="grid grid-cols-3 opacity-60 py-2  px-3 items-center ">
//               <label className="font-medium block text-sm  text-foreground">
//                 No. of Supporting
//               </label>
//               <input
//                 type="number"
//                 value={form.supporting}
//                 onChange={(e) =>
//                   setForm({ ...form, supporting: e.target.value })
//                 }
//                 className="col-span-2 w-40 border rounded py-1   bg-white "
//               />
//             </div> */}
//             <div className="grid grid-cols-3  px-3 opacity-60  items-center py-3">
//               <label className="font-medium block text-sm  text-foreground">
//                 Amount
//               </label>
//               <input
//                 type="number"
//                 value={form.amount}
//                 onChange={(e) => setForm({ ...form, amount: e.target.value })}
//                 className="col-span-2 w-40 border rounded py-1   bg-white "
//               />
//             </div>
//             {/* <div className="grid grid-cols-3  px-3 opacity-60  items-center py-3">
//             <label className="font-medium block text-sm  text-foreground">
//               Available balance
//             </label>
//             <input
//               type="number"
//               value={form.amount}
//               onChange={(e) => setForm({ ...form, amount: e.target.value })}
//               className="col-span-2 w-40 border rounded py-1   bg-white "
//             />
//           </div> */}
//             <div className="grid grid-cols-3 opacity-60  px-3 items-center  py-1">
//               <label className="font-medium block text-sm  text-foreground">
//                 From Code
//               </label>
//               <Select
//                 options={accounts}
//                 value={
//                   accounts.find((acc) => acc.value === form.fromCode) || null
//                 }
//                 onChange={(selected) =>
//                   setForm({
//                     ...form,
//                     fromCode: selected ? selected.value : "",
//                   })
//                 }
//                 placeholder="Enter account..."
//                 isClearable
//                 isSearchable
//                 menuPortalTarget={document.body}
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     minHeight: "40px", // match other inputs
//                     height: "40px",
//                     fontSize: "0.875rem", // text-sm
//                     borderRadius: "0.375rem", // same as input rounded
//                   }),
//                   valueContainer: (base) => ({
//                     ...base,
//                     height: "40px", // fix value container height
//                     padding: "0 8px",
//                   }),
//                   input: (base) => ({
//                     ...base,
//                     margin: 0,
//                     padding: 0,
//                   }),
//                   indicatorsContainer: (base) => ({
//                     ...base,
//                     height: "40px", // arrow aligned
//                   }),
//                   singleValue: (base) => ({
//                     ...base,
//                     lineHeight: "40px", // center text vertically
//                   }),
//                 }}
//                 className="col-span-2"
//               />
//             </div>
//             <div className="grid grid-cols-3 opacity-60   px-3 items-center py-3">
//               <label className="font-medium block text-sm  text-foreground">
//                 To Code
//               </label>
//               <Select
//                 options={accounts}
//                 value={
//                   accounts.find((acc) => acc.value === form.toCode) || null
//                 }
//                 onChange={(selected) =>
//                   setForm({
//                     ...form,
//                     // accountId: selected ? selected.value : "",
//                     toCode: selected ? selected.value : "",
//                   })
//                 }
//                 placeholder="Enter account..."
//                 isClearable
//                 isSearchable
//                 menuPortalTarget={document.body}
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     minHeight: "40px", // match other inputs
//                     height: "40px",
//                     fontSize: "0.875rem", // text-sm
//                     borderRadius: "0.375rem", // same as input rounded
//                   }),
//                   valueContainer: (base) => ({
//                     ...base,
//                     height: "40px", // fix value container height
//                     padding: "0 8px",
//                   }),
//                   input: (base) => ({
//                     ...base,
//                     margin: 0,
//                     padding: 0,
//                   }),
//                   indicatorsContainer: (base) => ({
//                     ...base,
//                     height: "40px", // arrow aligned
//                   }),
//                   singleValue: (base) => ({
//                     ...base,
//                     lineHeight: "40px", // center text vertically
//                   }),
//                 }}
//                 className="col-span-2"
//               />
//             </div>

//             <div className="grid grid-cols-3 opacity-60 py-2  px-3 items-center">
//               <label className="font-medium block text-sm  text-foreground">
//                 GL Date
//               </label>
//               <input
//                 type="date"
//                 value={form.glDate}
//                 onChange={(e) => setForm({ ...form, glDate: e.target.value })}
//                 className="col-span-2 w-full border rounded py-1  bg-white "
//               />
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 mb-4 bg-white opacity-60">
//           <label className="block text-sm font-medium text-gray-600 mb-2  py-2 px-4 rounded-lg">
//             Description
//           </label>
//           <textarea
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className="w-full mt-1 border rounded-lg px-3 py-2"
//           />
//         </div>

       

//         <div className="flex justify-end items-center gap-10 mb-4">
         
//           <Button
//             type="button"
//             onClick={() => setShowModal(true)}
//             // className="bg-green-500 cursor-pointer text-white px-12 py-2 rounded-lg"
//           >
//             {mutation.isPending ? "Submitting..." : "Save"}
//           </Button>
//         </div>
//       </div>
//      <CashTransferTable></CashTransferTable>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0  bg-black flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">
//               Confirm Voucher Submission
//             </h2>

//             <div className="space-y-2">
//               <p>
//                 <strong>Entry Date:</strong> {form.entryDate}
//               </p>
//               <p>
//                 <strong>Amount:</strong> {form.amount}
//               </p>
//               <p>
//                 <strong>To Code:</strong> {form.toCode}
//               </p>
//               <p>
//                 <strong>From code:</strong> {form.fromCode}
//               </p>

//               {/* <p>
//                 <strong>No. of Supporting:</strong> {form.supporting}
//               </p> */}
//               <p>
//                 <strong>Description:</strong> {form.description}
//               </p>

//               <p>
//                 <strong>GL Date:</strong> {form.glDate}
//               </p>

//               {/* <h3 className="font-semibold mt-2">Accounts:</h3>
//               <ul className="list-disc pl-5">
//                 {rows.map((row, r) => (
//                   <li key={r}>
//                     {row.accountCode} - {row.particulars} - Debit: {row.debit},
//                     Credit: {row.credit}
//                   </li>
//                 ))}
//               </ul> */}
//             </div>

//             <div className="flex justify-end mt-4 space-x-3">
//               <Button
//                 onClick={() => setShowModal(false)}
//                 // className="px-4 py-2 rounded-lg bg-gray-300"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={mutation.isPending}
//                 // className="px-4 py-2 rounded-lg bg-green-500 text-white"
//               >
//                 {mutation.isPending ? "Submitting..." : "Confirm"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//    </SectionContainer>
//   );
// };

// export default CashTransfer;


import { useState } from "react";
import Select from "react-select";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import { SectionContainer } from "@/components/SectionContainer";
import CashTransferTable from "../components/CashTransferTable";
import axios from "axios";
import { Button } from "@/components/ui/button";
import BillUploadPanel from "@/components/shared/bill-upload-panel";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CashTransfer = () => {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  // ── Bill state ──────────────────────────────────────────────────────────────
  const [newBillFiles, setNewBillFiles] = useState([]);

  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    entryDate: today,
    receive_desc: "",
    toCode: "",
    fromCode: "",
    amount: "",
    receive: "",
    glDate: today,
    supporting: "",
  });

  // ── Upload helper ────────────────────────────────────────────────────────────
  const uploadBills = async (glMasterId) => {
    if (!newBillFiles.length || !glMasterId) return;
    await Promise.allSettled(
      newBillFiles.map((file) => {
        const fd = new FormData();
        fd.append("doc_file", file);
        fd.append("GLMASTERID", glMasterId);
        return axios.post(`${url}/api/gldoc`, fd);
      })
    );
    setNewBillFiles([]);
  };

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

  // ── Mutation ─────────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async ({ payload }) => {
      const res = await axios.post(`${url}/api/cash-flow-add`, payload);
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        toast.success("Cash transfer submitted successfully!");
        // upload bills after successful save
        await uploadBills(data.masterID || data.id);
        setForm({
          entryDate: today,
          description: "",
          amount: "",
          toCode: "",
          fromCode: "",
          cash: "",
          supporting: "",
          glDate: today,
        });
        queryClient.invalidateQueries(["unpostedVouchers"]);
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

  const isSubmitting = mutation.isPending;

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    setMessage("");

    if (!form.entryDate || !form.amount || !form.toCode || !form.fromCode || !form.glDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      trans_date: form.entryDate,
      receive_desc: form.description || "Cash Transfer",
      fromCode: form.fromCode,
      toCode: form.toCode,
      amount: parseFloat(form.amount) || 0,
      receive: parseFloat(form.accountId) || 0,
      GL_ENTRY_DATE: form.glDate,
      supporting: form.supporting || "0",
    };
    mutation.mutate({ payload });
  };

  // shared Select styles
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "40px",
      height: "40px",
      fontSize: "0.875rem",
      borderRadius: "0.375rem",
    }),
    valueContainer: (base) => ({ ...base, height: "40px", padding: "0 8px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, height: "40px" }),
    singleValue: (base) => ({ ...base, lineHeight: "40px" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <SectionContainer>
      <div className="">
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">
          {message && (
            <p className="text-center text-red-600 font-medium mt-2 mb-2">{message}</p>
          )}

          <div className="md:flex justify-between gap-10 bg-white rounded-lg">
            {/* ── Bill panel ──────────────────────────────────────────────── */}
            <div className="border rounded-lg p-3 bg-gray-50 w-full md:w-[200px] shrink-0">
              <BillUploadPanel
                files={newBillFiles}
                onChange={setNewBillFiles}
                disabled={isSubmitting}
              />
            </div>

            {/* ── Form fields ─────────────────────────────────────────────── */}
            <div className="">
              <div className="grid grid-cols-3 px-3 items-center py-2">
                <label className="font-bold text-gray-800 text-sm">Entry Date</label>
                <input
                  type="date"
                  value={form.entryDate}
                  onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                  disabled={isSubmitting}
                  className="col-span-2 w-full border rounded py-1 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 px-3 items-center py-3">
                <label className="font-bold text-gray-800 text-sm">Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  disabled={isSubmitting}
                  className="col-span-2 w-40 border rounded py-1 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 px-3 items-center py-1">
                <label className="font-bold text-gray-800 text-sm">From Code</label>
                <Select
                  options={accounts}
                  value={accounts.find((acc) => acc.value === form.fromCode) || null}
                  onChange={(selected) =>
                    setForm({ ...form, fromCode: selected ? selected.value : "" })
                  }
                  placeholder="Enter account..."
                  isClearable
                  isSearchable
                  isDisabled={isSubmitting}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-3 px-3 items-center py-3">
                <label className="font-bold text-gray-800 text-sm">To Code</label>
                <Select
                  options={accounts}
                  value={accounts.find((acc) => acc.value === form.toCode) || null}
                  onChange={(selected) =>
                    setForm({ ...form, toCode: selected ? selected.value : "" })
                  }
                  placeholder="Enter account..."
                  isClearable
                  isSearchable
                  isDisabled={isSubmitting}
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-3 py-2 px-3 items-center">
                <label className="font-bold text-gray-800 text-sm">GL Date</label>
                <input
                  type="date"
                  value={form.glDate}
                  onChange={(e) => setForm({ ...form, glDate: e.target.value })}
                  disabled={isSubmitting}
                  className="col-span-2 w-full border rounded py-1 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 mb-4 bg-white">
            <label className="block font-bold text-gray-800 text-sm mb-2 py-2 px-4 rounded-lg">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={isSubmitting}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex justify-end items-center gap-10 mb-4">
            <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Save"}
            </Button>
          </div>
        </div>

        <CashTransferTable />

        {/* Confirm Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Confirm Voucher Submission</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Entry Date:</strong> {form.entryDate}</p>
                <p><strong>GL Date:</strong> {form.glDate}</p>
                <p><strong>Amount:</strong> {form.amount}</p>
                <p><strong>From Code:</strong> {form.fromCode}</p>
                <p><strong>To Code:</strong> {form.toCode}</p>
                <p><strong>Description:</strong> {form.description}</p>

                {newBillFiles.length > 0 && (
                  <div>
                    <strong>Bills:</strong>
                    <ul className="list-disc pl-5 text-blue-600">
                      {newBillFiles.map((f, i) => (
                        <li key={i}>{f.name} (new)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4 space-x-3">
                <Button onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Confirm"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default CashTransfer;
