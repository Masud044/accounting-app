import { useState, useEffect } from "react";
import Select from "react-select";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

import { SectionContainer } from "@/components/SectionContainer";
import JournalTable from "../components/JournalTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import BillUploadPanel from "@/components/shared/bill-upload-panel";
import BillUploadPanelEdit from "@/components/shared/edit-bill-upload-panel";

const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Journal = () => {
  const { voucherId } = useParams();
  const isEdit = !!voucherId;

  useEffect(() => {
    window.scrollTo({ top: 80, behavior: "smooth" });
  }, [voucherId]);

  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  // ── Bill state ─────────────────────────────────────────────────────────────
  const [newBillFiles, setNewBillFiles] = useState([]);   // create mode
  const [existingDocs, setExistingDocs] = useState([]);   // edit mode

  const [rows, setRows] = useState([
    { id: "dummy", accountCode: "", particulars: "", debitId: null, creditId: null },
  ]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    entryDate: today,
    supporting: "",
    description: "",
    glDate: today,
    accountId: "",
    particular: "",
  });

  // ── Fetch existing docs in edit mode ───────────────────────────────────────
  useQuery({
    queryKey: ["gldocs", voucherId],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gldoc`, { params: { glmaster_id: voucherId } });
      const docs = res.data.data || [];
      setExistingDocs(docs);
      return docs;
    },
    enabled: isEdit,
  });

  // ── Upload helper ──────────────────────────────────────────────────────────
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

  // ── Accounts query ─────────────────────────────────────────────────────────
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
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

  // ── Fetch voucher for edit ─────────────────────────────────────────────────
  const { data: voucherData } = useQuery({
    queryKey: ["voucher", voucherId],
    queryFn: async () => {
      const res = await axios.get(`${url}/api/gl-view?insertID=${voucherId}`);
      return res.data;
    },
    enabled: !!voucherId && accounts.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  // ── voucherId change → reset ───────────────────────────────────────────────
  useEffect(() => {
    setRows([{ id: "dummy", accountCode: "", particulars: "", debitId: null, creditId: null }]);
    setForm({
      entryDate: today,
      supporting: "",
      description: "",
      glDate: today,
      accountId: "",
      particular: "",
    });
    setNewBillFiles([]);
  }, [voucherId]);

  // ── Populate form from voucherData ─────────────────────────────────────────
  useEffect(() => {
    if (!voucherId || !voucherData || accounts.length === 0) return;
    if (voucherData.status !== "success") return;

    const master = voucherData.master || {};
    if (String(master.ID) !== String(voucherId)) return;

    const details = voucherData.details || [];

    const mappedRows = details.map((d, i) => ({
      id: d.ID || `${d.CODE}-${i}`,
      detail_id: d.ID,
      accountCode: d.CODE,
      particulars: d.ACCOUNT_NAME || d.CODEDESCRIPTION || "",
      debit: parseFloat(d.DEBIT) || 0,
      credit: parseFloat(d.CREDIT) || 0,
    }));

    setRows(mappedRows);
    setForm({
      entryDate: master.TRANS_DATE || today,
      glDate: master.GL_ENTRY_DATE || today,
      supporting: master.SUPPORTING || "",
      description: master.DESCRIPTION || "",
      accountId: "",
      particular: "",
    });
  }, [voucherData, accounts, voucherId]);

  // ── Mutation ───────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: async ({ isNew, payload }) => {
      const apiUrl = isNew ? `${url}/api/gl-add` : `${url}/api/gl-edit`;
      const res = await axios.post(apiUrl, payload);
      return res.data;
    },
    onSuccess: async (data, variables) => {
      if (data.status === "success") {
        toast.success(variables.isNew ? "Journal-Voucher created!" : "Journal-Voucher updated!");

        if (variables.isNew) {
          // upload bills with new master ID
         await uploadBills(data.masterId || data.masterID || data.id);
          setForm({
            entryDate: today,
            supporting: "",
            description: "",
            glDate: today,
            accountId: "",
            particular: "",
          });
          setRows([{ id: "dummy", accountCode: "", particulars: "", debitId: null, creditId: null }]);
        } else {
          // upload new bills for existing master
          await uploadBills(voucherId);
          await queryClient.invalidateQueries(["voucher", voucherId]);
          await queryClient.invalidateQueries(["gldocs", voucherId]);
        }

        queryClient.invalidateQueries(["unpostedVouchers"]);
      } else {
        toast.error(data.message || "Error processing voucher.");
      }
      setShowModal(false);
    },
    onError: (err) => {
      console.error("Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Server error. Please try again.");
      setShowModal(false);
    },
  });

  // ── Row handlers ───────────────────────────────────────────────────────────
  const addRow = () => {
    if (!form.accountId) return;
    const newRow = {
      id: Date.now() + Math.random(),
      detail_id: null,
      accountCode: form.accountId,
      particulars: form.particular,
      debit: 0,
      credit: 0,
    };
    const updatedRows =
      rows.length === 1 && rows[0].id === "dummy" ? [newRow] : [...rows, newRow];
    setRows(updatedRows);
    setForm({ ...form, accountId: "", particular: "" });
  };

  const handleRowChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
              ...(field === "debit" && value
                ? { credit: "" }
                : field === "credit" && value
                ? { debit: "" }
                : {}),
            }
          : row
      )
    );
  };

  // ── Totals ─────────────────────────────────────────────────────────────────
  const debitTotal = rows.reduce((sum, r) => sum + (parseFloat(r.debit) || 0), 0);
  const creditTotal = rows.reduce((sum, r) => sum + (parseFloat(r.credit) || 0), 0);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const isNew = !voucherId;

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

    const payload = isNew
      ? {
          trans_date: form.entryDate,
          GL_ENTRY_DATE: form.glDate,
          receive_desc: form.description,
          supporting: String(form.supporting || "0"),
          details: rows.map((r) => ({
            code: `${r.accountCode}##${r.particulars}`,
            debit: parseFloat(r.debit) || 0,
            credit: parseFloat(r.credit) || 0,
            description: r.particulars,
          })),
        }
      : {
          master_id: voucherId,
          trans_date: form.entryDate,
          gl_entry_date: form.glDate,
          receive_desc: form.description,
          supporting: String(form.supporting || "0"),
          details: rows.map((r) => ({
            id: r.detail_id || r.id,
            debit: parseFloat(r.debit) || 0,
            credit: parseFloat(r.credit) || 0,
          })),
        };

    mutation.mutate({ isNew, payload });
  };

  const isSubmitting = mutation.isPending;

  return (
    <SectionContainer>
      <div className="">
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-md">

          {/* ── Top section: Bill panel + form fields ── */}
          <div className="md:flex justify-between gap-10 bg-white rounded-lg">

            {/* Bill upload panel */}
            <div className="border rounded-lg p-3 bg-gray-50 min-w-[200px] md:w-[220px]">
              {isEdit ? (
                <BillUploadPanelEdit
                  existingDocs={existingDocs}
                  onDeleteDoc={(id) => setExistingDocs((p) => p.filter((d) => d.ID !== id))}
                  newFiles={newBillFiles}
                  onNewFiles={setNewBillFiles}
                  disabled={isSubmitting}
                />
              ) : (
                <BillUploadPanel
                  files={newBillFiles}
                  onChange={setNewBillFiles}
                  disabled={isSubmitting}
                />
              )}
            </div>

            {/* Form fields */}
            <div>
              <div className="grid grid-cols-3 px-3 items-center py-2">
                <label className="font-bold text-gray-800 text-sm font-sans">Entry Date</label>
                <input
                  type="date"
                  value={form.entryDate}
                  onChange={(e) => setForm({ ...form, entryDate: e.target.value })}
                  className="col-span-2 w-full border rounded py-1 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 py-2 px-3 items-center">
                <label className="font-bold text-gray-800 text-sm font-sans">No. of Supporting</label>
                <input
                  type="number"
                  value={form.supporting}
                  onChange={(e) => setForm({ ...form, supporting: e.target.value })}
                  className="col-span-2 w-40 border rounded py-1 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 py-2 px-3 items-center">
                <label className="font-bold text-gray-800 text-sm font-sans">GL Date</label>
                <input
                  type="date"
                  value={form.glDate}
                  onChange={(e) => setForm({ ...form, glDate: e.target.value })}
                  className="col-span-2 w-full border rounded py-1 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 mb-4 bg-white">
            <label className="block font-bold text-gray-800 text-sm font-sans mb-2 py-2 px-4 rounded-lg">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          {/* Add row inputs */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr_2fr_1fr] gap-4 rounded-lg justify-center items-center">
            <div className="grid grid-cols-3 px-3 items-center py-1">
              <label className="font-bold text-gray-800 text-sm font-sans block">Account ID</label>
              <Select
                options={accounts}
                className="col-span-2 border w-full rounded shadow-2xl"
                value={accounts.find((acc) => acc.value === form.accountId) || null}
                onChange={(selected) =>
                  setForm({
                    ...form,
                    accountId: selected ? selected.value : "",
                    particular: selected ? selected.name : "",
                  })
                }
                placeholder="Enter account..."
                isClearable
                isSearchable
                isDisabled={isSubmitting}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }),
                }}
              />
            </div>

            <div className="grid grid-cols-3 px-3 items-center py-3">
              <label className="font-bold text-gray-800 text-sm font-sans block">Particular</label>
              <input
                type="text"
                value={form.particular}
                readOnly
                className="col-span-2 border w-full rounded py-1 bg-white"
              />
            </div>

            <div className="px-4 py-2">
              <button
                type="button"
                onClick={addRow}
                disabled={isSubmitting}
                className="font-bold text-gray-800 font-sans cursor-pointer border px-3 py-1 rounded-lg flex items-center text-sm"
              >
                <span className="mr-1 font-extrabold">+</span>Add
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full table-fixed border-collapse rounded-lg overflow-x-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 w-[20%] text-center font-bold text-gray-800 text-sm font-sans">Account Code</th>
                <th className="px-4 py-2 w-[35%] text-center font-bold text-gray-800 text-sm font-sans">Particulars</th>
                <th className="px-4 py-2 w-[10%] text-center font-bold text-gray-800 text-sm font-sans">Debit</th>
                <th className="px-4 py-2 w-[10%] text-center font-bold text-gray-800 text-sm font-sans">Credit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border">
                  <td className="border px-4 py-2">{row.accountCode}</td>
                  <td className="border px-4 py-2">{row.particulars}</td>
                  <td className="border p-2">
                    {row.credit > 0 ? (
                      <span className="block w-full text-center text-gray-700">{row.debit || 0}</span>
                    ) : (
                      <input
                        type="number"
                        value={row.debit || ""}
                        onChange={(e) => handleRowChange(row.id, "debit", e.target.value)}
                        className="w-full border-none outline-none bg-transparent text-center"
                      />
                    )}
                  </td>
                  <td className="border p-2">
                    {row.debit > 0 ? (
                      <span className="block w-full text-center text-gray-700">{row.credit || 0}</span>
                    ) : (
                      <input
                        type="number"
                        value={row.credit || ""}
                        onChange={(e) => handleRowChange(row.id, "credit", e.target.value)}
                        className="w-full border-none outline-none bg-transparent text-center"
                      />
                    )}
                  </td>
                </tr>
              ))}

              {rows.length > 0 && (
                <tr className="font-semibold">
                  <td colSpan="2" className="text-right text-sm p-2">Total</td>
                  <td className="border text-sm text-center p-2">{debitTotal.toFixed(2)}</td>
                  <td className="border text-sm text-center p-2">{creditTotal.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end items-center gap-10 mb-4">
            <Button type="button" onClick={() => setShowModal(true)} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </div>

        <JournalTable />

        {/* ── Confirm Dialog (shadcn) ── */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="w-11/12 md:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Confirm Voucher Submission</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 text-sm">
              <p><strong>Entry Date:</strong> {form.entryDate}</p>
              <p><strong>No. of Supporting:</strong> {form.supporting}</p>
              <p><strong>Description:</strong> {form.description}</p>
              <p><strong>GL Date:</strong> {form.glDate}</p>

              {/* Bills summary */}
              {(existingDocs.length > 0 || newBillFiles.length > 0) && (
                <div>
                  <strong>Bills:</strong>
                  <ul className="list-disc pl-5 text-gray-600 mt-1">
                    {existingDocs.map((d) => (
                      <li key={d.ID}>Doc #{d.ID} (saved)</li>
                    ))}
                    {newBillFiles.map((f, i) => (
                      <li key={i} className="text-blue-600">{f.name} (new)</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="font-semibold mt-2">Accounts:</p>
              <ul className="list-disc pl-5">
                {rows.map((row, r) => (
                  <li key={r}>
                    {row.accountCode} — {row.particulars} — Debit: {row.debit}, Credit: {row.credit}
                  </li>
                ))}
              </ul>

              <p className="font-semibold">
                Total Debit: {debitTotal.toFixed(2)} | Total Credit: {creditTotal.toFixed(2)}
              </p>
            </div>

            <DialogFooter className="gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SectionContainer>
  );
};

export default Journal;