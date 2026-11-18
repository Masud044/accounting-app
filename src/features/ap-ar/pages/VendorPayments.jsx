

// // import { useEffect, useMemo, useRef, useState } from 'react';
// // import { api, money, round2 } from '../api';
// // import AccountPicker from '../components/AccountPicker.jsx';
// // import AttachmentsButton from '../components/AttachmentsButton.jsx';

// // const TODAY = new Date().toISOString().slice(0, 10);
// // const METHODS = ['Bank transfer', 'Cheque', 'Cash', 'Card'];
// // // Advance lines always post to this one fixed control account — see
// // // record_advance on the server for the full rationale. There's nothing to
// // // choose, so the Advance lines table shows it as a fixed label, not a picker.
// // const AP_ADVANCE_ACCOUNT_CODE = '1020120000';

// // /* ---------- Tailwind class constants (px values: app er --spacing custom, tai arbitrary px) ---------- */
// // const ROOT = 'min-h-full bg-apar-bg font-apar text-[14.5px] leading-[1.5] text-apar-ink';
// // const WRAP = 'mx-auto max-w-[1360px] px-[16px] pb-[48px] pt-[24px]';
// // const TOP = 'mb-[18px] flex flex-wrap items-end justify-between gap-[14px]';
// // const H1 = 'text-[24px] font-bold tracking-[-.01em]';
// // const PANEL = 'min-w-0 rounded-xl border border-apar-line bg-apar-panel p-[20px]';
// // const GRID = 'grid grid-cols-1 items-start gap-[18px] min-[861px]:grid-cols-[1fr_360px]';
// // const SEG = 'mb-[18px] grid grid-cols-2 gap-[10px]';
// // const SEG_BTN =
// //   'cursor-pointer rounded-[10px] border-[1.5px] border-apar-line bg-apar-field px-[14px] py-[12px] text-left text-apar-ink aria-pressed:border-apar-acc aria-pressed:bg-apar-soft';
// // const ROW = 'mb-[12px] grid grid-cols-1 gap-[12px]';
// // const ROW2 = `${ROW} min-[561px]:grid-cols-2`;
// // const ROW3 = `${ROW} min-[561px]:grid-cols-3`;
// // const ADDBAR = 'mb-[12px] flex items-center justify-between gap-[10px]';
// // const ADDBOX = 'mb-[16px] rounded-[10px] border border-dashed border-apar-acc bg-apar-soft p-[16px]';
// // const TBLW = 'mx-[-4px] overflow-x-auto';
// // const TABLE = 'w-full min-w-[560px] border-collapse';
// // const TABLE_SM = 'w-full min-w-[520px] border-collapse';
// // const THB = 'border-b border-apar-line px-[6px] py-[8px] text-[12.5px] font-medium text-apar-mute';
// // const TH = `${THB} text-left`;
// // const THN = `${THB} text-right`;
// // const TDB = 'border-b border-apar-line px-[6px] py-[10px] align-middle';
// // const TD = TDB;
// // const TDN = `${TDB} text-right`;
// // const TD_CR = 'border-b border-apar-line py-[10px] pl-[26px] pr-[6px] align-middle';
// // const TD_EMPTY = 'border-b border-apar-line px-0 py-[14px] align-middle text-apar-mute';
// // const TF = 'px-[6px] py-[10px] align-middle font-bold';
// // const TFN = `${TF} text-right`;
// // const NT = 'block text-[12.5px]';
// // const TAG = 'inline-block rounded-full bg-apar-soft px-[8px] py-[2px] text-[12px] font-medium';
// // const TAG_COLOR = { over: 'text-apar-err', part: 'text-apar-warn', paid: 'text-apar-ok', '': '' };
// // const LINE = 'flex justify-between py-[5px]';
// // const LINE_BIG = 'mt-[8px] flex justify-between border-t border-apar-line pb-[5px] pt-[12px] text-[17px] font-bold';
// // const CHK = 'my-[12px] flex items-center gap-[9px] rounded-[9px] bg-apar-soft px-[12px] py-[11px]';
// // const STAT = 'mb-[14px] grid grid-cols-2 gap-[10px]';
// // const STAT_BOX = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[10px]';
// // const STAT_LABEL = 'block text-[12.5px] text-apar-mute';
// // const LI = 'flex justify-between gap-[10px] border-b border-apar-line py-[9px] text-[13.5px]';
// // const LI_EMPTY = 'flex justify-between gap-[10px] border-b border-apar-line py-[14px] text-[13.5px] text-apar-mute';
// // const LED_SMALL = 'block text-apar-mute';
// // const LNX = 'cursor-pointer bg-transparent px-[8px] py-[4px] text-[20px] leading-none text-apar-err';
// // const XLINK = 'cursor-pointer bg-transparent p-0 text-[12px] text-apar-err underline';
// // const ERR = 'min-h-[20px] text-[13px] text-apar-err';
// // const MONO = 'font-apar-mono';

// // function Page({ children }) {
// //   return (
// //     <div className={ROOT}>
// //       <div className={WRAP}>{children}</div>
// //     </div>
// //   );
// // }

// // function an(list, code) {
// //   const f = list.find((a) => a.code === code);
// //   return f ? f.name : code;
// // }

// // export default function VendorPayments() {
// //   const [vendors, setVendors] = useState([]);
// //   const [coa, setCoa] = useState({ expense: [], invoiceExpense: [], bank: [] });
// //   const [venId, setVenId] = useState('');
// //   const [cur, setCur] = useState(null);
// //   const [mode, setMode] = useState('inv');
// //   const [sel, setSel] = useState({});
// //   const [useAdv, setUseAdv] = useState(false);
// //   const [meth, setMeth] = useState('Bank transfer');
// //   const [bankSel, setBankSel] = useState('');
// //   const [dt, setDt] = useState(TODAY);
// //   const [toast, setToast] = useState('');
// //   const [settling, setSettling] = useState(false);

// //   // advance mode
// //   const [aBank, setABank] = useState('');
// //   const [aDt, setADt] = useState(TODAY);
// //   const [aMeth, setAMeth] = useState('Bank transfer');
// //   const [aRef, setARef] = useState('');
// //   const [L, setL] = useState([{ a: '', d: '', n: '' }]);
// //   const [aErr, setAErr] = useState('');

// //   // add invoice
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [nNo, setNNo] = useState('');
// //   const [nDate, setNDate] = useState(TODAY);
// //   const [nDue, setNDue] = useState('');
// //   const [nNote, setNNote] = useState('');
// //   const [IL, setIL] = useState([{ a: '', d: '', n: '' }]);
// //   const [nLink, setNLink] = useState('');
// //   const [nApply, setNApply] = useState('');
// //   const [touched, setTouched] = useState(false);
// //   const [nErr, setNErr] = useState('');

// //   // refund modal
// //   const [refundAdv, setRefundAdv] = useState(null);
// //   const [refAmt, setRefAmt] = useState('');
// //   const [refDt, setRefDt] = useState(TODAY);
// //   const [refBank, setRefBank] = useState('');
// //   const [refMeth, setRefMeth] = useState('Bank transfer');
// //   const [refRef, setRefRef] = useState('');
// //   const [refNote, setRefNote] = useState('');
// //   const [refErr, setRefErr] = useState('');

// //   // edit mode: { type: 'ADVANCE' | 'INVOICE' | 'REFUND', id, no, advNo?, applied? }
// //   const [editing, setEditing] = useState(null);
// //   // advance-only settlement edit (date only): { id, no, date, description, amount, err }
// //   const [settleEdit, setSettleEdit] = useState(null);
// //   // the advance control account the server really posts to (falls back to the default code)
// //   const advCode = coa.advanceAccount?.code || AP_ADVANCE_ACCOUNT_CODE;

// //   // read-only transaction details dialog
// //   const [viewTx, setViewTx] = useState(null);
// //   const [vendorsLoaded, setVendorsLoaded] = useState(false);
// //   const [venErr, setVenErr] = useState('');
// //   const loadSeq = useRef(0); // only the latest vendor request may update the screen

// //   // double-submit guard: one save at a time (a second click/Enter is ignored)
// //   const busy = useRef(false);
// //   const [saving, setSaving] = useState(false);
// //   const guard = (fn) => async (...args) => {
// //     if (busy.current) return;
// //     busy.current = true;
// //     setSaving(true);
// //     try { await fn(...args); } finally { busy.current = false; setSaving(false); }
// //   };

// //   function showToast(t) {
// //     setToast(t);
// //     clearTimeout(showToast._t);
// //     showToast._t = setTimeout(() => setToast(''), 3200);
// //   }

// //   async function loadVendorList() {
// //     const res = await api.get('/ap/vendors');
// //     setVendors(res.data);
// //     setVendorsLoaded(true);
// //   }
// //   async function loadVendor(id) {
// //     if (!id) return;
// //     const seq = ++loadSeq.current;
// //     let res;
// //     try {
// //       res = await api.get(`/ap/vendor/${id}`);
// //     } catch (e) {
// //       if (seq === loadSeq.current) setVenErr(e.message || 'Failed to load vendor');
// //       return;
// //     }
// //     if (seq !== loadSeq.current) return; // a newer vendor was selected meanwhile
// //     if (!res.ok) { setVenErr(res.data?.error || 'Failed to load vendor'); showToast(res.data?.error || 'Failed to load vendor'); return; }
// //     setVenErr('');
// //     setCur(res.data);
// //     setSel({});
// //     setAddOpen(false);
// //   }

// //   useEffect(() => {
// //     (async () => {
// //       await loadVendorList();
// //       const res = await api.get('/ap/coa');
// //       setCoa(res.data);
// //       if (res.data.bank.length) { setABank(res.data.bank[0].code); setRefBank(res.data.bank[0].code); }
// //       setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]);
// //       if (res.data.invoiceExpense.length) setIL([{ a: res.data.invoiceExpense[0].code, d: '', n: '' }]);
// //     })();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);
// //   // Vendor changed: drop the previous vendor's data and form state, then load the new vendor.
// //   useEffect(() => {
// //     setCur(null); setVenErr(''); setSel({}); setUseAdv(false); setNLink(''); setNApply(''); setTouched(false);
// //     setAddOpen(false); setRefundAdv(null); setViewTx(null); setAErr(''); setNErr(''); setEditing(null);
// //     if (venId) loadVendor(venId); else loadSeq.current++;
// //   }, [venId]); // eslint-disable-line react-hooks/exhaustive-deps

// //   // A focused number input must not change its value on mouse-wheel scroll (500 -> 500.02 bug).
// //   useEffect(() => {
// //     const h = () => {
// //       const a = document.activeElement;
// //       if (a && a.tagName === 'INPUT' && a.type === 'number') a.blur();
// //     };
// //     document.addEventListener('wheel', h, { passive: true });
// //     return () => document.removeEventListener('wheel', h);
// //   }, []);

// //   function bal(i) { return Number(i.balance); }
// //   function status(i) {
// //     const b = bal(i);
// //     if (b <= 0.001) return ['Paid', 'paid'];
// //     if (i.due < TODAY) return ['Overdue', 'over'];
// //     if (Number(i.advanceAdjusted) + Number(i.paid) > 0) return ['Partial', 'part'];
// //     return ['Open', ''];
// //   }
// //   const outstanding = useMemo(() => (cur ? cur.invoices.reduce((s, i) => s + bal(i), 0) : 0), [cur]);

// //   const totals = useMemo(() => {
// //     let s = 0; Object.values(sel).forEach((v) => (s += v)); s = round2(s);
// //     const a = useAdv && cur ? Math.min(cur.advanceBalance, s) : 0;
// //     return { s, a, c: round2(s - a) };
// //   }, [sel, useAdv, cur]);

// //   function toggleInvoice(inv, checked) {
// //     setSel((prev) => {
// //       const next = { ...prev };
// //       if (checked) next[inv.id] = bal(inv); else delete next[inv.id];
// //       return next;
// //     });
// //   }
// //   function setInvoiceAmount(inv, raw) {
// //     let v = parseFloat(raw);
// //     if (!(v > 0)) v = bal(inv);
// //     v = Math.min(v, bal(inv));
// //     setSel((prev) => ({ ...prev, [inv.id]: v }));
// //   }

// //   async function doSettle() {
// //     if (totals.s <= 0) return;
// //     const applications = Object.keys(sel).map((k) => ({ invoiceId: k, payNow: 0, fromAdvance: 0 }));
// //     let leftAdv = totals.a, leftCash = totals.c;
// //     for (const a of applications) {
// //       const need = sel[a.invoiceId];
// //       const fromAdv = Math.min(need, leftAdv); a.fromAdvance = round2(fromAdv); leftAdv = round2(leftAdv - fromAdv);
// //       const fromCash = Math.min(need - fromAdv, leftCash); a.payNow = round2(fromCash); leftCash = round2(leftCash - fromCash);
// //     }
// //     setSettling(true);
// //     const res = await api.post('/ap/settle', { supplier_id: cur.id, date: dt || TODAY, method: meth, bank_account_code: bankSel, applications });
// //     setSettling(false);
// //     if (!res.data.ok) { showToast(res.data.error || 'Settle failed'); return; }
// //     setSel({}); setUseAdv(false);
// //     await loadVendor(cur.id);
// //     showToast(`Settled ${money(totals.s)}: ${money(totals.a)} from advance and ${money(totals.c)} by ${meth.toLowerCase()}.`);
// //   }

// //   async function cancelInvoice(id) {
// //     const res = await api.post('/ap/cancel_invoice', { invoice_id: id });
// //     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
// //     await loadVendor(cur.id);
// //     showToast(`Invoice ${res.data.invoiceNo} cancelled.`);
// //   }
// //   async function cancelPayment(id) {
// //     const res = await api.post('/ap/cancel_payment', { payment_id: id });
// //     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
// //     await loadVendor(cur.id);
// //     showToast(`Payment ${res.data.paymentNo} cancelled and reversed.`);
// //   }
// //   async function cancelRefund(id) {
// //     const res = await api.post('/ap/cancel_refund', { refund_id: id });
// //     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
// //     await loadVendor(cur.id);
// //     showToast(`Refund ${res.data.refundNo} cancelled and reversed.`);
// //   }

// //   // ---------------- advance mode ----------------
// //   const lineTotal = useMemo(() => round2(L.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [L]);
// //   function updateLine(i, k, v) { setL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
// //   function addLine() { setL((prev) => [...prev, { a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); }
// //   function removeLine(i) { setL((prev) => prev.filter((_, idx) => idx !== i)); }

// //   async function recordAdvance() {
// //     let badIdx = null;
// //     L.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
// //     if (badIdx !== null) { setAErr(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }
// //     const noDesc = L.findIndex((x) => !x.d.trim());
// //     if (noDesc !== -1) { setAErr(`Line ${noDesc + 1} needs a description.`); return; }
// //     if (!aBank) { setAErr('Select which account this was paid from.'); return; }
// //     setAErr('');
// //     const t = lineTotal;

// //     if (editing?.type === 'ADVANCE') {
// //       const r = await api.post('/ap/update_advance', {
// //         advance_id: editing.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
// //         lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //       });
// //       if (!r.data.ok) { setAErr(r.data.error || 'Update failed'); return; }
// //       const no = editing.no;
// //       cancelEdit();
// //       await loadVendor(cur.id);
// //       showToast(`Advance ${no} updated.`);
// //       return;
// //     }

// //     const res = await api.post('/ap/record_advance', {
// //       supplier_id: cur.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
// //       lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //     });
// //     if (!res.data.ok) { setAErr(res.data.error || 'Failed to save advance'); return; }
// //     setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
// //     await loadVendor(cur.id);
// //     showToast(`Advance of ${money(t)} posted, credited to ${an(coa.bank, aBank)}.`);
// //   }

// //   // ---------------- add invoice ----------------
// //   const ilTot = useMemo(() => round2(IL.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [IL]);
// //   const advSel = useMemo(() => (nLink && cur ? cur.advances.find((x) => String(x.id) === String(nLink)) : null), [nLink, cur]);
// //   useEffect(() => {
// //     if (!advSel) { setNApply(''); setTouched(false); return; }
// //     if (!touched) { const v = Math.min(advSel.balance, ilTot); setNApply(v > 0 ? String(v) : ''); }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [advSel, ilTot]);

// //   function updateIL(i, k, v) { setIL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
// //   function addIL() { setIL((prev) => [...prev, { a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]); }
// //   function removeIL(i) { setIL((prev) => prev.filter((_, idx) => idx !== i)); }

// //   function openAddBox(open) {
// //     setAddOpen(open); setNErr('');
// //     if (open) {
// //       setNDate(TODAY);
// //       const d = new Date(); d.setDate(d.getDate() + 30);
// //       setNDue(d.toISOString().slice(0, 10));
// //       setNNo('INV-' + Date.now().toString().slice(-6));
// //       setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
// //       setTouched(false); setNNote(''); setNLink('');
// //     }
// //   }

// //   async function saveInvoice() {
// //     const no = nNo.trim(), e = setNErr;
// //     let badIdx = null;
// //     IL.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
// //     if (!no) { e('Enter an invoice number.'); return; }
// //     if (!nNote.trim()) { e('Enter a description.'); return; }
// //     if (!nDate || !nDue) { e('Set both the invoice date and the due date.'); return; }
// //     if (nDue < nDate) { e("The due date can't be before the invoice date."); return; }
// //     if (badIdx !== null) { e(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }

// //     // Editing: the advance that was linked at creation keeps its applied amount.
// //     if (editing?.type === 'INVOICE') {
// //       if (editing.applied > 0 && ilTot + 0.001 < editing.applied) {
// //         e(`Invoice total can't be less than the advance already applied (${money(editing.applied)}).`);
// //         return;
// //       }
// //       e('');
// //       const r = await api.post('/ap/update_invoice', {
// //         invoice_id: editing.id, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
// //         lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //       });
// //       if (!r.data.ok) { e(r.data.error || 'Update failed'); return; }
// //       const eno = editing.no;
// //       setEditing(null);
// //       openAddBox(false);
// //       await loadVendor(cur.id);
// //       showToast(`Invoice ${eno} updated.`);
// //       return;
// //     }

// //     const t = ilTot, a = advSel, ap = a ? round2(parseFloat(nApply) || 0) : 0;
// //     if (a && !(ap > 0)) { e(`Enter how much to apply from ${a.no}, or choose no advance link.`); return; }
// //     if (a && ap > Math.min(a.balance, t)) { e(`You can apply at most ${money(Math.min(a.balance, t))} from ${a.no} (${money(a.balance)} available, invoice total ${money(t)}).`); return; }
// //     e('');

// //     const res = await api.post('/ap/save_invoice', {
// //       supplier_id: cur.id, invoice_no: no, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
// //       lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //       link_advance_id: a ? a.id : '', apply_amount: a ? ap : 0,
// //     });
// //     if (!res.data.ok) { e(res.data.error || 'Failed to save invoice'); return; }
// //     openAddBox(false);
// //     await loadVendor(cur.id);
// //     showToast(`Invoice ${no} for ${money(t)} added` + (a ? ` and linked to ${a.no}: ${money(ap)} applied.` : '. Select it to pay.'));
// //   }

// //   // ---------------- refund ----------------
// //   function openRefund(adv) {
// //     setRefundAdv(adv);
// //     setRefAmt(String(adv.balance)); setRefDt(TODAY); setRefRef(''); setRefNote(''); setRefErr('');
// //   }
// //   async function confirmRefund() {
// //     if (!refundAdv) return;

// //     if (editing?.type === 'REFUND') {
// //       if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
// //       setRefErr('');
// //       const r = await api.post('/ap/update_refund', {
// //         refund_id: editing.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth,
// //         reference_no: refRef.trim(), remarks: refNote.trim(),
// //       });
// //       if (!r.data.ok) { setRefErr(r.data.error || 'Update failed'); return; }
// //       const rn = editing.no;
// //       setEditing(null);
// //       setRefundAdv(null);
// //       await loadVendor(cur.id);
// //       showToast(`Refund ${rn} updated.`);
// //       return;
// //     }

// //     const amt = parseFloat(refAmt) || 0;
// //     if (!(amt > 0)) { setRefErr('Enter a refund amount greater than zero.'); return; }
// //     if (amt > refundAdv.balance + 0.001) { setRefErr(`Refund amount exceeds the available balance of ${money(refundAdv.balance)}.`); return; }
// //     if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
// //     setRefErr('');
// //     const no = refundAdv.no;
// //     const res = await api.post('/ap/refund_advance', {
// //       advance_id: refundAdv.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth, reference_no: refRef.trim(), amount: amt, remarks: refNote.trim(),
// //     });
// //     if (!res.data.ok) { setRefErr(res.data.error || 'Refund failed'); return; }
// //     setRefundAdv(null);
// //     await loadVendor(cur.id);
// //     showToast(`Refund of ${money(amt)} recorded for ${no}.`);
// //   }
// //   function closeRefundModal() {
// //     setRefundAdv(null);
// //     if (editing?.type === 'REFUND') setEditing(null);
// //   }

// //   // ---------------- edit (pencil in Recent activity) ----------------
// //   async function openEdit(l) {
// //     const isSettle = l.sourceType === 'PAYMENT' && Number(l.sourceId) === 0;
// //     const res = await api.get(isSettle ? `/ap/edit_data/SETTLEMENT/${l.journalId}` : `/ap/edit_data/${l.sourceType}/${l.sourceId}`);
// //     if (!res.ok || !res.data?.ok) { showToast(res.data?.error || 'This record cannot be edited'); return; }
// //     const d = res.data;
// //     if (d.type === 'SETTLEMENT') {
// //       setSettleEdit({ id: d.id, no: d.no, date: d.date, description: d.description, amount: Number(d.amount), err: '' });
// //       return;
// //     }
// //     // advNo / applied: advance that was linked when the invoice was created (read-only while editing)
// //     setEditing({ type: d.type, id: d.id, no: d.no, advNo: d.advNo || null, applied: Number(d.advanceApplied || 0) });
// //     if (d.type === 'ADVANCE') {
// //       setMode('adv'); setAErr('');
// //       setABank(d.bank); setADt(d.date); setAMeth(d.method || 'Bank transfer'); setARef(d.ref || '');
// //       setL(d.lines.map((x) => ({ a: AP_ADVANCE_ACCOUNT_CODE, d: x.d || '', n: String(x.n) })));
// //     } else if (d.type === 'INVOICE') {
// //       setMode('inv'); setNErr('');
// //       setAddOpen(true);
// //       setNNo(d.no); setNDate(d.date); setNDue(d.due || d.date); setNNote(d.note || ''); setNLink(''); setTouched(false);
// //       setIL(d.lines.map((x) => ({ a: x.a, d: x.d || '', n: String(x.n) })));
// //     } else {
// //       setRefundAdv({ id: d.advanceId, no: d.no, balance: d.amount });
// //       setRefAmt(String(d.amount)); setRefDt(d.date); setRefBank(d.bank); setRefMeth(d.method || 'Bank transfer');
// //       setRefRef(d.ref || ''); setRefNote(d.remarks || ''); setRefErr('');
// //     }
// //   }
// //   function cancelEdit() {
// //     setEditing(null); setAddOpen(false); setRefundAdv(null); setAErr(''); setNErr('');
// //     setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
// //     setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
// //   }

// //   // ---------------- journal previews ----------------
// //   function advanceJournalRows() {
// //     const rows = [];
// //     L.forEach((x) => { const v = parseFloat(x.n); if (v > 0) rows.push({ label: `${advCode} · Advances to Suppliers`, dr: v, cr: 0 }); });
// //     const t = lineTotal;
// //     if (t > 0) rows.push({ label: `${aBank} · ${an(coa.bank, aBank)}`, dr: 0, cr: t, isCredit: true });
// //     return { rows, total: t };
// //   }
// //   function invoiceJournalRows() {
// //     const rows = []; const t = ilTot;
// //     // While editing, the linked advance (if any) comes from the saved record, not from the form.
// //     const isEdit = editing?.type === 'INVOICE';
// //     const ap = isEdit ? Number(editing.applied || 0) : (parseFloat(nApply) || 0);
// //     const linkedNo = isEdit ? editing.advNo : nLink;
// //     IL.forEach((x) => { const v = parseFloat(x.n); if (v > 0 && x.a) rows.push({ label: `${x.a} · ${an(coa.invoiceExpense, x.a)}`, dr: v, cr: 0 }); });
// //     let total = t;
// //     if (t > 0) {
// //       rows.push({ label: '3020020000 · Accounts Payable - Trade', dr: 0, cr: t, isCredit: true });
// //       if (linkedNo && ap > 0) {
// //         total = t + ap;
// //         rows.push({ label: '3020020000 · Accounts Payable - Trade (advance applied)', dr: ap, cr: 0 });
// //         rows.push({ label: `${advCode} · Advances to Suppliers (${linkedNo})`, dr: 0, cr: ap, isCredit: true });
// //       }
// //     }
// //     return { rows, total };
// //   }

// //   const [newVendorName, setNewVendorName] = useState('');
// //   async function addVendor() {
// //     const name = newVendorName.trim();
// //     if (!name) return;
// //     const res = await api.post('/ap/vendors', { name });
// //     if (!res.data.ok) { showToast(res.data.error || 'Failed to add vendor'); return; }
// //     setNewVendorName('');
// //     await loadVendorList();
// //     setVenId(String(res.data.id));
// //   }

// //   async function saveSettleEdit() {
// //     const s = settleEdit;
// //     if (!s) return;
// //     if (!s.date) { setSettleEdit({ ...s, err: 'Select a date.' }); return; }
// //     const r = await api.post('/ap/update_settlement', { journal_id: s.id, date: s.date });
// //     if (!r.data.ok) { setSettleEdit({ ...s, err: r.data.error || 'Update failed' }); return; }
// //     setSettleEdit(null);
// //     await loadVendor(cur.id);
// //     showToast(`Settlement ${s.no} updated.`);
// //   }

// //   // guarded save handlers (function declarations above are hoisted, so this is safe)
// //   const onRecordAdvance = guard(recordAdvance);
// //   const onSaveInvoice = guard(saveInvoice);
// //   const onConfirmRefund = guard(confirmRefund);
// //   const onSaveSettleEdit = guard(saveSettleEdit);

// //   if (!cur) {
// //     return (
// //       <Page>
// //         <div className={TOP}>
// //           <div>
// //             <h1 className={H1}>Vendor payments</h1>
// //             <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
// //           </div>
// //           {vendors.length > 0 && (
// //             <div className="min-w-[240px]">
// //               <label className="apar-label">Vendor</label>
// //               <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
// //                 <option value="">Select vendor</option>
// //                 {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
// //               </select>
// //             </div>
// //           )}
// //         </div>

// //         {venErr && venId ? (
// //           <div className={PANEL}><div className={ERR} role="alert">{venErr}</div></div>
// //         ) : !vendorsLoaded || venId ? (
// //           <div className={PANEL}><div className="py-[24px] text-center text-apar-mute">Loading...</div></div>
// //         ) : vendors.length > 0 ? (
// //           <div className={PANEL}>
// //             <h2 className="apar-h2">Select a vendor</h2>
// //             <div className="text-apar-mute">Choose a vendor from the list above to see invoices, advances, and payments.</div>
// //           </div>
// //         ) : (
// //           <div className={PANEL}>
// //             <h2 className="apar-h2">No vendors yet</h2>
// //             <div className={`${ROW2} items-end`}>
// //               <div>
// //                 <label className="apar-label">Vendor name</label>
// //                 <input className="apar-input" value={newVendorName} onChange={(e) => setNewVendorName(e.target.value)} placeholder="e.g. Acme Supplies Ltd." />
// //               </div>
// //               <div><button className="apar-btn w-full" onClick={addVendor}>Add vendor</button></div>
// //             </div>
// //           </div>
// //         )}
// //       </Page>
// //     );
// //   }

// //   const open = cur.invoices.filter((i) => bal(i) > 0.001);
// //   const advJrn = advanceJournalRows();
// //   const invJrn = invoiceJournalRows();

// //   return (
// //     <Page>
// //       <div className={TOP}>
// //         <div>
// //           <h1 className={H1}>Vendor payments</h1>
// //           <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
// //         </div>
// //         <div className="min-w-[240px]">
// //           <label className="apar-label">Vendor</label>
// //           <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
// //             {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
// //           </select>
// //         </div>
// //       </div>

// //       <div className={GRID}>
// //         <main className={PANEL}>
// //           <div className={SEG} role="group" aria-label="Payment type">
// //             <button type="button" className={SEG_BTN} aria-pressed={mode === 'inv'} onClick={() => setMode('inv')}>
// //               <b className="block">Pay against invoices</b>
// //               <span className="text-[13px] text-apar-mute">Choose payable invoices and settle them</span>
// //             </button>
// //             <button type="button" className={SEG_BTN} aria-pressed={mode === 'adv'} onClick={() => setMode('adv')}>
// //               <b className="block">Advance to vendor</b>
// //               <span className="text-[13px] text-apar-mute">Individual payment with no invoice yet</span>
// //             </button>
// //           </div>

// //           {mode === 'inv' && (
// //             <section>
// //               <div className={ADDBAR}>
// //                 <b className="text-[15px]">Payable invoices</b>
// //                 <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(!addOpen))}>Add payable invoice</button>
// //               </div>

// //               {addOpen && (
// //                 <div className={ADDBOX}>
// //                   {editing?.type === 'INVOICE' && (
// //                     <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing invoice {editing.no}</div>
// //                   )}
// //                   {editing?.type === 'INVOICE' && editing.advNo && (
// //                     <div className="mb-[12px] text-[13px] text-apar-mute">
// //                       Advance {editing.advNo} ({money(editing.applied)}) is linked to this invoice. The applied amount stays the same.
// //                     </div>
// //                   )}
// //                   <div className={ROW3}>
// //                     <div><label className="apar-label">Invoice number</label><input className={`apar-input ${MONO}`} value={nNo} disabled={!!editing} onChange={(e) => setNNo(e.target.value)} placeholder="INV-2100" /></div>
// //                     <div><label className="apar-label">Invoice date</label><input className="apar-input" type="date" value={nDate} onChange={(e) => setNDate(e.target.value)} /></div>
// //                     <div><label className="apar-label">Due date</label><input className="apar-input" type="date" value={nDue} onChange={(e) => setNDue(e.target.value)} /></div>
// //                   </div>
// //                   <div className={ROW}>
// //                     <div><label className="apar-label">Description <span className="text-apar-err">*</span></label><input className="apar-input" required value={nNote} onChange={(e) => setNNote(e.target.value)} placeholder="e.g. October packaging supplies" /></div>
// //                   </div>

// //                   <div className={ADDBAR}>
// //                     <b className="text-[15px]">Invoice lines</b>
// //                     <button type="button" className="apar-ghost" onClick={addIL}>Add line</button>
// //                   </div>
// //                   <div className={TBLW}>
// //                     <table className={TABLE_SM}>
// //                       <thead>
// //                         <tr>
// //                           <th className={`${TH} w-[48%]`}>Account</th>
// //                           <th className={TH}>Description</th>
// //                           <th className={`${THN} w-[120px]`}>Amount</th>
// //                           <th className={`${TH} w-[36px]`}></th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {IL.map((x, i) => (
// //                           <tr key={i}>
// //                             <td className={TD}><AccountPicker options={coa.invoiceExpense} value={x.a} onChange={(code) => updateIL(i, 'a', code)} /></td>
// //                             <td className={TD}><input className="apar-input" value={x.d} onChange={(e) => updateIL(i, 'd', e.target.value)} placeholder="Optional. Defaults to the description above" /></td>
// //                             <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateIL(i, 'n', e.target.value)} placeholder="0.00" /></td>
// //                             <td className={TD}>{IL.length > 1 && <button type="button" className={LNX} onClick={() => removeIL(i)}>&times;</button>}</td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                       <tfoot>
// //                         <tr>
// //                           <td colSpan={2} className={TFN}>Invoice total</td>
// //                           <td className={`${TFN} ${MONO}`}>{money(ilTot)}</td>
// //                           <td></td>
// //                         </tr>
// //                       </tfoot>
// //                     </table>
// //                   </div>

// //                   <div className={`${ROW2} mt-[14px]`}>
// //                     <div>
// //                       <label className="apar-label">Link advance payment</label>
// //                       <select className="apar-select" value={nLink} onChange={(e) => { setNLink(e.target.value); setTouched(false); }} disabled={!!editing || !cur.advances.some((a) => a.balance > 0)}>
// //                         <option value="">{cur.advances.some((a) => a.balance > 0) ? 'No advance link' : 'No open advance for this vendor'}</option>
// //                         {cur.advances.filter((a) => a.balance > 0).map((a) => <option key={a.id} value={a.id}>{a.no} · {money(a.balance)} available ({a.date})</option>)}
// //                       </select>
// //                     </div>
// //                     <div>
// //                       <label className="apar-label">Apply from advance</label>
// //                       <input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={nApply} disabled={!advSel || !!editing} onChange={(e) => { setTouched(true); setNApply(e.target.value); }} placeholder="0.00" />
// //                     </div>
// //                   </div>

// //                   <h2 className="apar-h2">Journal entry preview</h2>
// //                   <div className={TBLW}>
// //                     <table className={TABLE_SM}>
// //                       <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //                       <tbody>
// //                         {invJrn.rows.length ? invJrn.rows.map((r, i) => (
// //                           <tr key={i}>
// //                             <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
// //                             <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
// //                             <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
// //                           </tr>
// //                         )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
// //                         {invJrn.total > 0 && (
// //                           <tr className="font-bold">
// //                             <td className={TD}>Total</td>
// //                             <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
// //                             <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
// //                           </tr>
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>

// //                   <div className={ERR} role="alert">{nErr}</div>
// //                   <div className="flex gap-[10px]">
// //                     <button type="button" className="apar-btn" disabled={saving} onClick={onSaveInvoice}>{editing?.type === 'INVOICE' ? 'Save changes' : 'Save invoice'}</button>
// //                     <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(false))}>Cancel</button>
// //                   </div>
// //                 </div>
// //               )}

// //               <div className={TBLW}>
// //                 <table className={TABLE}>
// //                   <thead>
// //                     <tr>
// //                       <th className={TH}></th>
// //                       <th className={TH}>Invoice</th>
// //                       <th className={TH}>Due</th>
// //                       <th className={TH}>Status</th>
// //                       <th className={THN}>Balance</th>
// //                       <th className={THN}>Pay now</th>
// //                       <th className={TH}></th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {cur.invoices.map((i) => {
// //                       const b = bal(i), st = status(i), on = sel[i.id] !== undefined;
// //                       const canCancel = Number(i.paid) <= 0.001;
// //                       return (
// //                         <tr key={i.id}>
// //                           <td className={TD}><input type="checkbox" disabled={b <= 0.001} checked={on} onChange={(e) => toggleInvoice(i, e.target.checked)} /></td>
// //                           <td className={TD}>
// //                             <span className={MONO}>{i.no}</span>
// //                             {i.note && <small className={`${NT} text-apar-mute`}>{i.note}</small>}
// //                             {i.links?.length > 0 && <small className={`${NT} text-apar-ok`}>Linked to {i.links.map((l) => `${l.advNo} (${money(l.amt)})`).join(', ')}</small>}
// //                           </td>
// //                           <td className={TD}>{i.due}</td>
// //                           <td className={TD}><span className={`${TAG} ${TAG_COLOR[st[1]]}`}>{st[0]}</span></td>
// //                           <td className={`${TDN} ${MONO}`}>{money(b)}</td>
// //                           <td className={TDN}>
// //                             <input className={`apar-input w-[104px] text-right ${MONO}`} type="number" min="0" max={b} step="0.01" disabled={!on} value={on ? sel[i.id] : ''} onChange={(e) => on && setInvoiceAmount(i, e.target.value)} />
// //                           </td>
// //                           <td className={TD}>
// //                             <div className="flex items-center justify-end gap-[8px]">
// //                               <AttachmentsButton entityType="AP_INVOICE" entityId={i.id} />
// //                               {canCancel && <button type="button" className={XLINK} onClick={() => cancelInvoice(i.id)}>Cancel</button>}
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                     {!open.length && <tr><td colSpan={7} className={TD_EMPTY}>All invoices for this vendor are paid.</td></tr>}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               <div className={CHK}>
// //                 <input className="h-[17px] w-[17px] accent-apar-acc" type="checkbox" id="useAdv" checked={useAdv} disabled={cur.advanceBalance <= 0} onChange={(e) => setUseAdv(e.target.checked)} />
// //                 <label htmlFor="useAdv">{cur.advanceBalance > 0 ? `Apply advance balance (${money(cur.advanceBalance)} available)` : 'No advance balance available'}</label>
// //               </div>

// //               <div className={ROW2}>
// //                 <div>
// //                   <label className="apar-label">Method</label>
// //                   <select className="apar-select" value={meth} onChange={(e) => setMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
// //                 </div>
// //                 <div>
// //                   <label className="apar-label">Paid from account</label>
// //                   <select className="apar-select" value={bankSel} onChange={(e) => setBankSel(e.target.value)}>
// //                     <option value="">Not needed if fully from advance</option>
// //                     {coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <div className={ROW2}>
// //                 <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={dt} onChange={(e) => setDt(e.target.value)} /></div>
// //                 <div></div>
// //               </div>

// //               <div className="ml-auto max-w-[380px]">
// //                 <div className={LINE}><span>Selected invoices</span><span className={MONO}>{money(totals.s)}</span></div>
// //                 <div className={LINE}><span>Advance applied</span><span className={`${MONO} text-apar-ok`}>-{money(totals.a)}</span></div>
// //                 <div className={LINE_BIG}><span>Cash to pay</span><span className={MONO}>{money(totals.c)}</span></div>
// //                 <button className="apar-btn mt-[6px] w-full" disabled={totals.s <= 0 || settling} onClick={doSettle}>Settle selected invoices</button>
// //               </div>
// //             </section>
// //           )}

// //           {mode === 'adv' && (
// //             <section>
// //               {editing?.type === 'ADVANCE' && (
// //                 <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing advance {editing.no}</div>
// //               )}
// //               <div className={ROW2}>
// //                 <div>
// //                   <label className="apar-label">Paid from account</label>
// //                   <select className="apar-select" value={aBank} onChange={(e) => setABank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
// //                 </div>
// //                 <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={aDt} onChange={(e) => setADt(e.target.value)} /></div>
// //               </div>
// //               <div className={ROW2}>
// //                 <div>
// //                   <label className="apar-label">Method</label>
// //                   <select className="apar-select" value={aMeth} onChange={(e) => setAMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
// //                 </div>
// //                 <div><label className="apar-label">Reference</label><input className="apar-input" value={aRef} onChange={(e) => setARef(e.target.value)} placeholder="PO number or note" /></div>
// //               </div>

// //               <div className={`${ADDBAR} mt-[4px]`}>
// //                 <b className="text-[15px]">Advance lines</b>
// //                 <button type="button" className="apar-ghost" onClick={addLine}>Add line</button>
// //               </div>
// //               <div className={TBLW}>
// //                 <table className={TABLE_SM}>
// //                   <thead>
// //                     <tr>
// //                       <th className={`${TH} w-[38%]`}>Account</th>
// //                       <th className={TH}>Description <span className="text-apar-err">*</span></th>
// //                       <th className={`${THN} w-[120px]`}>Amount</th>
// //                       <th className={`${TH} w-[36px]`}></th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {L.map((x, i) => (
// //                       <tr key={i}>
// //                         <td className={`${TD} ${MONO} text-apar-mute`}>{advCode} · {coa.advanceAccount?.name || 'Advances to Suppliers'}</td>
// //                         <td className={TD}><input className="apar-input" required value={x.d} onChange={(e) => updateLine(i, 'd', e.target.value)} placeholder="What is this advance for?" /></td>
// //                         <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateLine(i, 'n', e.target.value)} placeholder="0.00" /></td>
// //                         <td className={TD}>{L.length > 1 && <button type="button" className={LNX} onClick={() => removeLine(i)}>&times;</button>}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                   <tfoot>
// //                     <tr>
// //                       <td colSpan={2} className={TFN}>Total advance</td>
// //                       <td className={`${TFN} ${MONO}`}>{money(lineTotal)}</td>
// //                       <td></td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>
// //               </div>

// //               <h2 className="apar-h2 mt-[18px]">Journal entry preview</h2>
// //               <div className={TBLW}>
// //                 <table className={TABLE_SM}>
// //                   <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //                   <tbody>
// //                     {advJrn.total > 0 ? advJrn.rows.map((r, i) => (
// //                       <tr key={i}>
// //                         <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
// //                         <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
// //                         <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
// //                       </tr>
// //                     )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
// //                     {advJrn.total > 0 && (
// //                       <tr className="font-bold">
// //                         <td className={TD}>Total</td>
// //                         <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
// //                         <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
// //                       </tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               <div className={ERR} role="alert">{aErr}</div>
// //               <button className="apar-btn mt-[6px] w-full" disabled={saving} onClick={onRecordAdvance}>{editing?.type === 'ADVANCE' ? 'Save changes' : 'Record advance'}</button>
// //               {editing?.type === 'ADVANCE' && (
// //                 <button type="button" className="apar-ghost mt-[6px] w-full" onClick={cancelEdit}>Cancel edit</button>
// //               )}
// //               <p className="mt-[12px] text-[13px] text-apar-mute">The advance is held as a vendor balance. Switch to "Pay against invoices" to apply it when an invoice arrives.</p>
// //             </section>
// //           )}
// //         </main>

// //         <aside className={PANEL}>
// //           <h2 className="apar-h2">{cur.name}</h2>
// //           <div className={STAT}>
// //             <div className={STAT_BOX}><span className={STAT_LABEL}>Outstanding</span><b className={`text-[18px] ${MONO}`}>{money(outstanding)}</b></div>
// //             <div className={STAT_BOX}><span className={STAT_LABEL}>Advance balance</span><b className={`text-[18px] ${MONO} text-apar-ok`}>{money(cur.advanceBalance)}</b></div>
// //           </div>

// //           <h2 className="apar-h2">Advance payments</h2>
// //           <ul>
// //             {cur.advances.length ? cur.advances.map((a) => {
// //               const appliedTo = [];
// //               cur.invoices.forEach((i) => (i.links || []).forEach((l) => { if (l.advNo === a.no) appliedTo.push(`${i.no} ${money(l.amt)}`); }));
// //               const canRefund = a.balance > 0.001 && a.status !== 'Cancelled';
// //               return (
// //                 <li key={a.id} className={LI}>
// //                   <span>{a.no}<small className={LED_SMALL}>{a.date} {appliedTo.length ? `· applied to ${appliedTo.join(', ')}` : '· not yet applied'}</small></span>
// //                   <b className={`${MONO} text-apar-ok`}>{money(a.balance)} {canRefund && <button type="button" className={XLINK} onClick={() => openRefund(a)}>Refund</button>}</b>
// //                 </li>
// //               );
// //             }) : <li className={LI_EMPTY}>No advances yet.</li>}
// //           </ul>

// //           <h2 className="apar-h2 mt-[18px]">Payments</h2>
// //           <ul>
// //             {cur.payments?.length ? cur.payments.map((p) => {
// //               const cancelled = p.status === 'Cancelled';
// //               return (
// //                 <li key={p.id} className={LI}>
// //                   <span>{p.no}<small className={LED_SMALL}>{p.date}{cancelled ? ' · cancelled' : ''}</small>{p.note && <small className={LED_SMALL}>{p.note}</small>}</span>
// //                   <b className={`flex items-center gap-[8px] ${MONO}`}>
// //                     <AttachmentsButton entityType="AP_PAYMENT" entityId={p.id} />
// //                     {money(p.total)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelPayment(p.id)}>Cancel</button>}
// //                   </b>
// //                 </li>
// //               );
// //             }) : <li className={LI_EMPTY}>No payments yet.</li>}
// //           </ul>

// //           <h2 className="apar-h2 mt-[18px]">Refunds</h2>
// //           <ul>
// //             {cur.refunds?.length ? cur.refunds.map((r) => {
// //               const cancelled = r.status === 'Cancelled';
// //               return (
// //                 <li key={r.id} className={LI}>
// //                   <span>{r.no}<small className={LED_SMALL}>{r.date} · {r.advNo}{cancelled ? ' · cancelled' : ''}</small></span>
// //                   <b className={MONO}>{money(r.amount)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelRefund(r.id)}>Cancel</button>}</b>
// //                 </li>
// //               );
// //             }) : <li className={LI_EMPTY}>No refunds yet.</li>}
// //           </ul>

// //           <h2 className="apar-h2 mt-[18px]">Recent activity</h2>
// //           <ul>
// //             {cur.ledger.length ? cur.ledger.map((l, i) => (
// //               <li key={l.journalId || i} className={LI}>
// //                 <span>{l.description}<small className={LED_SMALL}>{l.date}</small></span>
// //                 <b className={`flex items-center gap-[8px] ${MONO} ${l.positive ? 'text-apar-ok' : 'text-apar-err'}`}>
// //                   {l.editable && l.sourceType === 'ADVANCE' && (
// //                     <button
// //                       type="button"
// //                       title="Edit"
// //                       aria-label="Edit"
// //                       className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
// //                       onClick={() => openEdit(l)}
// //                     >
// //                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //                         <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
// //                       </svg>
// //                     </button>
// //                   )}
// //                   <button
// //                     type="button"
// //                     title="View details"
// //                     aria-label="View details"
// //                     className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
// //                     onClick={() => setViewTx({ sourceType: l.sourceType, sourceId: l.sourceId, journalId: Number(l.sourceId) === 0 ? l.journalId : 0 })}
// //                   >
// //                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
// //                     </svg>
// //                   </button>
// //                   <span>{l.positive ? '+' : '-'}{money(l.amount)}</span>
// //                 </b>
// //               </li>
// //             )) : <li className={LI_EMPTY}>No activity yet.</li>}
// //           </ul>
// //         </aside>
// //       </div>

// //       {toast && (
// //         <div className="fixed bottom-[20px] left-1/2 z-[9] max-w-[92%] -translate-x-1/2 rounded-[9px] bg-apar-ink px-[18px] py-[11px] text-apar-bg" role="status">
// //           {toast}
// //         </div>
// //       )}

// //       {refundAdv && (
// //         <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && closeRefundModal()}>
// //           <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
// //             <h2 className="apar-h2">{editing?.type === 'REFUND' ? 'Edit refund' : 'Refund advance'} <span className={MONO}>{refundAdv.no}</span></h2>
// //             <div className="mb-[12px] text-[13px] text-apar-mute">{editing?.type === 'REFUND' ? 'Refund amount' : 'Available to refund'}: <b className={MONO}>{money(refundAdv.balance)}</b></div>
// //             <div className={ROW2}>
// //               <div><label className="apar-label">Refund amount</label><input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={refAmt} disabled={editing?.type === 'REFUND'} onChange={(e) => setRefAmt(e.target.value)} /></div>
// //               <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={refDt} onChange={(e) => setRefDt(e.target.value)} /></div>
// //             </div>
// //             <div className={ROW2}>
// //               <div>
// //                 <label className="apar-label">Refund to account</label>
// //                 <select className="apar-select" value={refBank} onChange={(e) => setRefBank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
// //               </div>
// //               <div>
// //                 <label className="apar-label">Method</label>
// //                 <select className="apar-select" value={refMeth} onChange={(e) => setRefMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
// //               </div>
// //             </div>
// //             <div className={ROW}><div><label className="apar-label">Reference</label><input className="apar-input" value={refRef} onChange={(e) => setRefRef(e.target.value)} placeholder="Optional" /></div></div>
// //             <div className={ROW}><div><label className="apar-label">Remarks</label><input className="apar-input" value={refNote} onChange={(e) => setRefNote(e.target.value)} placeholder="Optional" /></div></div>
// //             <div className={ERR} role="alert">{refErr}</div>
// //             <div className="flex gap-[10px]">
// //               <button type="button" className="apar-btn" disabled={saving} onClick={onConfirmRefund}>{editing?.type === 'REFUND' ? 'Save changes' : 'Confirm refund'}</button>
// //               <button type="button" className="apar-ghost" onClick={closeRefundModal}>Cancel</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {settleEdit && (
// //         <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && setSettleEdit(null)}>
// //           <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
// //             <h2 className="apar-h2">Edit settlement <span className={MONO}>{settleEdit.no}</span></h2>
// //             <div className="mb-[12px] text-[13px] text-apar-mute">{settleEdit.description}</div>
// //             <div className={ROW2}>
// //               <div><label className="apar-label">Amount</label><div className={`rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px] ${MONO}`}>{money(settleEdit.amount)}</div></div>
// //               <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={settleEdit.date} onChange={(e) => setSettleEdit({ ...settleEdit, date: e.target.value, err: '' })} /></div>
// //             </div>
// //             <div className="mb-[12px] text-[12.5px] text-apar-mute">Only the date can be changed for a settlement paid fully from an advance.</div>
// //             <div className={ERR} role="alert">{settleEdit.err}</div>
// //             <div className="flex gap-[10px]">
// //               <button type="button" className="apar-btn" disabled={saving} onClick={onSaveSettleEdit}>Save changes</button>
// //               <button type="button" className="apar-ghost" onClick={() => setSettleEdit(null)}>Cancel</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {viewTx && <TransactionDialog tx={viewTx} onClose={() => setViewTx(null)} />}
// //     </Page>
// //   );
// // }

// // /* ---------- read-only transaction details (view / print / excel) ---------- */
// // function csvCell(v) {
// //   const s = v === null || v === undefined ? '' : String(v);
// //   return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
// // }

// // function downloadCsv(d) {
// //   const rows = [];
// //   const add = (...cells) => rows.push(cells.map(csvCell).join(','));
// //   add('Farm Welfare Agro Limited');
// //   add(d.title);
// //   add('Vendor', d.supplierName);
// //   add('Date', d.date);
// //   add('Status', d.cancelled ? 'Cancelled' : d.status);
// //   add('GL', d.glPosted ? 'Posted' : 'Not posted');
// //   if (d.note) add('Note', d.note);
// //   (d.fields || []).forEach((f) => add(f.label, f.value));
// //   add();
// //   if (d.summary.length) {
// //     add('Summary');
// //     d.summary.forEach((s) => add(s.label, s.money ? Number(s.value || 0) : s.value));
// //     add();
// //   }
// //   d.sections.forEach((sec) => {
// //     add(sec.title);
// //     add(...sec.columns.map((c) => c.label));
// //     sec.rows.forEach((r) => add(...sec.columns.map((c) => (c.money ? Number(r[c.key] || 0) : r[c.key] ?? ''))));
// //     if (sec.footer) add(...sec.columns.map((c, i) => (i === sec.columns.length - 1 ? Number(sec.footer.value || 0) : i === sec.columns.length - 2 ? sec.footer.label : '')));
// //     add();
// //   });
// //   add('Journal entries');
// //   add('Journal no', 'Date', 'Type', 'Description', 'Account', 'Account name', 'Debit', 'Credit');
// //   d.journal.entries.forEach((e) => {
// //     e.lines.forEach((l) => add(e.journalNo, e.date, e.kind, e.description, l.account, l.accountName, l.debit || '', l.credit || ''));
// //   });
// //   add('', '', '', '', '', 'Total', d.journal.totalDebit, d.journal.totalCredit);

// //   const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
// //   const url = URL.createObjectURL(blob);
// //   const a = document.createElement('a');
// //   a.href = url;
// //   a.download = `${d.title.replace(/[^\w.-]+/g, '_')}.csv`;
// //   document.body.appendChild(a);
// //   a.click();
// //   a.remove();
// //   URL.revokeObjectURL(url);
// // }

// // function TransactionDialog({ tx, onClose }) {
// //   const [st, setSt] = useState({ loading: true, error: '', data: null });

// //   useEffect(() => {
// //     let off = false;
// //     (async () => {
// //       setSt({ loading: true, error: '', data: null });
// //       try {
// //         const q = tx.journalId ? `?journalId=${tx.journalId}` : '';
// //         const res = await api.get(`/ap/transaction/${tx.sourceType}/${tx.sourceId}${q}`);
// //         if (off) return;
// //         if (!res.ok) { setSt({ loading: false, error: res.data?.error || 'Failed to load details', data: null }); return; }
// //         setSt({ loading: false, error: '', data: res.data });
// //       } catch (e) {
// //         if (!off) setSt({ loading: false, error: e.message || 'Failed to load details', data: null });
// //       }
// //     })();
// //     return () => { off = true; };
// //   }, [tx]);

// //   useEffect(() => {
// //     const h = (e) => e.key === 'Escape' && onClose();
// //     window.addEventListener('keydown', h);
// //     return () => window.removeEventListener('keydown', h);
// //   }, [onClose]);

// //   const d = st.data;
// //   const cell = (c, row) => (c.money ? money(Number(row[c.key] || 0)) : row[c.key] ?? '');

// //   const secs = (list) => list.map((sec) => (
// //     <div key={sec.title} className="mb-[16px]">
// //       <h3 className="mb-[6px] text-[14px] font-bold">{sec.title}</h3>
// //       <div className={TBLW}>
// //         <table className={TABLE_SM}>
// //           <thead><tr>{sec.columns.map((c) => <th key={c.key} className={c.money ? THN : TH}>{c.label}</th>)}</tr></thead>
// //           <tbody>
// //             {sec.rows.map((row, i) => (
// //               <tr key={i}>{sec.columns.map((c) => <td key={c.key} className={c.money ? `${TDN} ${MONO}` : TD}>{cell(c, row)}</td>)}</tr>
// //             ))}
// //           </tbody>
// //           {sec.footer && (
// //             <tfoot>
// //               <tr>
// //                 <td colSpan={sec.columns.length - 1} className={TFN}>{sec.footer.label}</td>
// //                 <td className={`${TFN} ${MONO}`}>{money(Number(sec.footer.value || 0))}</td>
// //               </tr>
// //             </tfoot>
// //           )}
// //         </table>
// //       </div>
// //     </div>
// //   ));

// //   const journalBlock = d && (
// //     <div className="mb-[6px]">
// //       <h3 className="mb-[6px] text-[14px] font-bold">Journal entries</h3>
// //       {d.journal.entries.length === 0 && <div className="text-apar-mute">No journal found.</div>}
// //       {d.journal.entries.map((e) => {
// //         const dr = e.lines.reduce((t, l) => t + (l.debit || 0), 0), cr = e.lines.reduce((t, l) => t + (l.credit || 0), 0);
// //         return (
// //           <div key={e.journalId} className="mb-[12px]">
// //             <div className="flex flex-wrap items-center gap-[8px] text-[13px]">
// //               <span className={MONO}>{e.journalNo}</span>
// //               <span className="text-apar-mute">{e.date}</span>
// //               <span className={`${TAG} ${e.kind === 'Reversal' ? 'text-apar-err' : ''}`}>{e.kind}</span>
// //               <span>{e.description}</span>
// //             </div>
// //             <div className={TBLW}>
// //               <table className={TABLE_SM}>
// //                 <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //                 <tbody>
// //                   {e.lines.map((l, i) => (
// //                     <tr key={i}>
// //                       <td className={l.credit > 0 ? TD_CR : TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}{l.derived ? ' *' : ''}</td>
// //                       <td className={`${TDN} ${MONO}`}>{l.debit ? money(l.debit) : ''}</td>
// //                       <td className={`${TDN} ${MONO}`}>{l.credit ? money(l.credit) : ''}</td>
// //                     </tr>
// //                   ))}
// //                   <tr className="font-bold">
// //                     <td className={TD}>Total</td>
// //                     <td className={`${TDN} ${MONO}`}>{money(dr)}</td>
// //                     <td className={`${TDN} ${MONO}`}>{money(cr)}</td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //             {e.derived && <div className="text-[12px] text-apar-mute">* Not saved in the journal lines of this older record. Shown from the journal total so the entry balances.</div>}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );

// //   return (
// //     <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
// //       <style>{`
// //         .tx-only-print{display:none}
// //         @media print{
// //           @page{margin:14mm}
// //           body *{visibility:hidden}
// //           #tx-print,#tx-print *{visibility:visible}
// //           #tx-print{position:absolute;left:0;top:0;width:100%;max-height:none!important;overflow:visible!important;border:0!important;background:#fff!important;color:#000!important;padding:0!important}
// //           #tx-print .no-print{display:none!important}
// //           #tx-print .tx-only-print{display:block}
// //           #tx-print table{page-break-inside:auto}
// //           #tx-print tr{page-break-inside:avoid}
// //         }
// //       `}</style>
// //       <div id="tx-print" className="max-h-[90vh] w-full max-w-[820px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
// //         <div className="tx-only-print mb-[10px] border-b border-apar-line pb-[8px]">
// //           <div className="text-[16px] font-bold">Farm Welfare Agro Limited</div>
// //           <div className="text-[12px]">Vendor payments · printed {new Date().toISOString().slice(0, 10)}</div>
// //         </div>

// //         <div className="mb-[14px] flex items-start justify-between gap-[10px]">
// //           <div>
// //             <h2 className="apar-h2">{d ? d.title : 'Details'}</h2>
// //             {d && <div className="text-[13px] text-apar-mute">{d.supplierName}{d.date ? ` · ${d.date}` : ''}</div>}
// //           </div>
// //           <div className="flex flex-wrap items-center justify-end gap-[8px]">
// //             {d?.status && <span className={`${TAG} ${d.cancelled ? 'text-apar-err' : ''}`}>{d.cancelled ? 'Cancelled' : d.status}</span>}
// //             {d && <span className={`${TAG} ${d.glPosted ? 'text-apar-ok' : 'text-apar-warn'}`}>{d.glPosted ? 'GL posted' : 'GL not posted'}</span>}
// //             <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => window.print()}>Print</button>
// //             <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => downloadCsv(d)}>Excel</button>
// //             <button type="button" className="apar-ghost no-print" onClick={onClose}>Close</button>
// //           </div>
// //         </div>

// //         {st.loading && <div className="py-[24px] text-center text-apar-mute">Loading...</div>}
// //         {st.error && <div className={ERR} role="alert">{st.error}</div>}

// //         {d && (
// //           <>
// //             {d.note && <div className="mb-[12px] rounded-[9px] bg-apar-soft px-[12px] py-[10px] text-[13px]">{d.note}</div>}

// //             {d.fields && (
// //               <div className={ROW2}>
// //                 {d.fields.map((f) => (
// //                   <div key={f.label}>
// //                     <label className="apar-label">{f.label}</label>
// //                     <div className="rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]">{f.value}</div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {d.fields && secs(d.sections.filter((x) => x.title === 'Advance lines'))}

// //             {journalBlock}

// //             {!d.fields && d.summary.length > 0 && (
// //               <div className="mb-[16px] mt-[16px] grid grid-cols-1 gap-x-[20px] gap-y-[8px] min-[561px]:grid-cols-2">
// //                 {d.summary.map((s) => (
// //                   <div key={s.label} className="flex justify-between gap-[10px] border-b border-apar-line py-[6px] text-[13.5px]">
// //                     <span className="text-apar-mute">{s.label}</span>
// //                     <b className={s.money ? MONO : ''}>{s.money ? money(Number(s.value || 0)) : s.value}</b>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {!d.fields && secs(d.sections)}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // import { useEffect, useMemo, useRef, useState } from 'react';
// // import { api, money, round2 } from '../api';
// // import AccountPicker from '../components/AccountPicker.jsx';
// // import AttachmentsButton from '../components/AttachmentsButton.jsx';
// // import { PageGuideSheet } from '../vendor-guide/page-guide-sheet';
// // import { vendorPaymentsGuide } from '../vendor-guide/vendor-payment-guide';

// // const TODAY = new Date().toISOString().slice(0, 10);
// // const METHODS = ['Bank transfer', 'Cheque', 'Cash', 'Card'];
// // // Advance lines always post to this one fixed control account — see
// // // record_advance on the server for the full rationale. There's nothing to
// // // choose, so the Advance lines table shows it as a fixed label, not a picker.
// // const AP_ADVANCE_ACCOUNT_CODE = '1020120000';

// // /* ---------- Tailwind class constants (px values: app er --spacing custom, tai arbitrary px) ---------- */
// // const ROOT = 'min-h-full bg-apar-bg font-apar text-[14.5px] leading-[1.5] text-apar-ink';
// // const WRAP = 'mx-auto max-w-[1360px] px-[16px] pb-[48px] pt-[24px]';
// // const TOP = 'mb-[18px] flex flex-wrap items-end justify-between gap-[14px]';
// // const H1 = 'text-[24px] font-bold tracking-[-.01em]';
// // const PANEL = 'min-w-0 rounded-xl border border-apar-line bg-apar-panel p-[20px]';
// // const GRID = 'grid grid-cols-1 items-start gap-[18px] min-[861px]:grid-cols-[1fr_360px]';
// // const SEG = 'mb-[18px] grid grid-cols-2 gap-[10px]';
// // const SEG_BTN =
// //   'cursor-pointer rounded-[10px] border-[1.5px] border-apar-line bg-apar-field px-[14px] py-[12px] text-left text-apar-ink aria-pressed:border-apar-acc aria-pressed:bg-apar-soft';
// // const ROW = 'mb-[12px] grid grid-cols-1 gap-[12px]';
// // const ROW2 = `${ROW} min-[561px]:grid-cols-2`;
// // const ROW3 = `${ROW} min-[561px]:grid-cols-3`;
// // const ADDBAR = 'mb-[12px] flex items-center justify-between gap-[10px]';
// // const ADDBOX = 'mb-[16px] rounded-[10px] border border-dashed border-apar-acc bg-apar-soft p-[16px]';
// // const TBLW = 'mx-[-4px] overflow-x-auto';
// // const TABLE = 'w-full min-w-[560px] border-collapse';
// // const TABLE_SM = 'w-full min-w-[520px] border-collapse';
// // const THB = 'border-b border-apar-line px-[6px] py-[8px] text-[12.5px] font-medium text-apar-mute';
// // const TH = `${THB} text-left`;
// // const THN = `${THB} text-right`;
// // const TDB = 'border-b border-apar-line px-[6px] py-[10px] align-middle';
// // const TD = TDB;
// // const TDN = `${TDB} text-right`;
// // const TD_CR = 'border-b border-apar-line py-[10px] pl-[26px] pr-[6px] align-middle';
// // const TD_EMPTY = 'border-b border-apar-line px-0 py-[14px] align-middle text-apar-mute';
// // const TF = 'px-[6px] py-[10px] align-middle font-bold';
// // const TFN = `${TF} text-right`;
// // const NT = 'block text-[12.5px]';
// // const TAG = 'inline-block rounded-full bg-apar-soft px-[8px] py-[2px] text-[12px] font-medium';
// // const TAG_COLOR = { over: 'text-apar-err', part: 'text-apar-warn', paid: 'text-apar-ok', '': '' };
// // const LINE = 'flex justify-between py-[5px]';
// // const LINE_BIG = 'mt-[8px] flex justify-between border-t border-apar-line pb-[5px] pt-[12px] text-[17px] font-bold';
// // const CHK = 'my-[12px] flex items-center gap-[9px] rounded-[9px] bg-apar-soft px-[12px] py-[11px]';
// // const STAT = 'mb-[14px] grid grid-cols-2 gap-[10px]';
// // const STAT_BOX = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[10px]';
// // const STAT_LABEL = 'block text-[12.5px] text-apar-mute';
// // const LI = 'flex justify-between gap-[10px] border-b border-apar-line py-[9px] text-[13.5px]';
// // const LI_EMPTY = 'flex justify-between gap-[10px] border-b border-apar-line py-[14px] text-[13.5px] text-apar-mute';
// // const LED_SMALL = 'block text-apar-mute';
// // const LNX = 'cursor-pointer bg-transparent px-[8px] py-[4px] text-[20px] leading-none text-apar-err';
// // const XLINK = 'cursor-pointer bg-transparent p-0 text-[12px] text-apar-err underline';
// // const ERR = 'min-h-[20px] text-[13px] text-apar-err';
// // const MONO = 'font-apar-mono';

// // function Page({ children }) {
// //   return (
// //     <div className={ROOT}>
// //       <div className={WRAP}>{children}</div>
// //     </div>
// //   );
// // }

// // function an(list, code) {
// //   const f = list.find((a) => a.code === code);
// //   return f ? f.name : code;
// // }

// // export default function VendorPayments() {
// //   const [vendors, setVendors] = useState([]);
// //   const [coa, setCoa] = useState({ expense: [], invoiceExpense: [], bank: [] });
// //   const [venId, setVenId] = useState('');
// //   const [cur, setCur] = useState(null);
// //   const [mode, setMode] = useState('inv');
// //   const [sel, setSel] = useState({});
// //   const [useAdv, setUseAdv] = useState(false);
// //   const [meth, setMeth] = useState('Bank transfer');
// //   const [bankSel, setBankSel] = useState('');
// //   const [dt, setDt] = useState(TODAY);
// //   const [toast, setToast] = useState('');
// //   const [settling, setSettling] = useState(false);

// //   // advance mode
// //   const [aBank, setABank] = useState('');
// //   const [aDt, setADt] = useState(TODAY);
// //   const [aMeth, setAMeth] = useState('Bank transfer');
// //   const [aRef, setARef] = useState('');
// //   const [L, setL] = useState([{ a: '', d: '', n: '' }]);
// //   const [aErr, setAErr] = useState('');

// //   // add invoice
// //   const [addOpen, setAddOpen] = useState(false);
// //   const [nNo, setNNo] = useState('');
// //   const [nDate, setNDate] = useState(TODAY);
// //   const [nDue, setNDue] = useState('');
// //   const [nNote, setNNote] = useState('');
// //   const [IL, setIL] = useState([{ a: '', d: '', n: '' }]);
// //   const [nLink, setNLink] = useState('');
// //   const [nApply, setNApply] = useState('');
// //   const [touched, setTouched] = useState(false);
// //   const [nErr, setNErr] = useState('');

// //   // refund modal
// //   const [refundAdv, setRefundAdv] = useState(null);
// //   const [refAmt, setRefAmt] = useState('');
// //   const [refDt, setRefDt] = useState(TODAY);
// //   const [refBank, setRefBank] = useState('');
// //   const [refMeth, setRefMeth] = useState('Bank transfer');
// //   const [refRef, setRefRef] = useState('');
// //   const [refNote, setRefNote] = useState('');
// //   const [refErr, setRefErr] = useState('');

// //   // edit mode: { type: 'ADVANCE' | 'INVOICE' | 'REFUND', id, no, advNo?, applied? }
// //   const [editing, setEditing] = useState(null);
// //   // advance-only settlement edit (date only): { id, no, date, description, amount, err }
// //   const [settleEdit, setSettleEdit] = useState(null);
// //   // the advance control account the server really posts to (falls back to the default code)
// //   const advCode = coa.advanceAccount?.code || AP_ADVANCE_ACCOUNT_CODE;

// //   // read-only transaction details dialog
// //   const [viewTx, setViewTx] = useState(null);
// //   const [vendorsLoaded, setVendorsLoaded] = useState(false);
// //   const [venErr, setVenErr] = useState('');
// //   const loadSeq = useRef(0); // only the latest vendor request may update the screen

// //   // double-submit guard: one save at a time (a second click/Enter is ignored)
// //   const busy = useRef(false);
// //   const [saving, setSaving] = useState(false);
// //   const guard = (fn) => async (...args) => {
// //     if (busy.current) return;
// //     busy.current = true;
// //     setSaving(true);
// //     try { await fn(...args); } finally { busy.current = false; setSaving(false); }
// //   };

// //   function showToast(t) {
// //     setToast(t);
// //     clearTimeout(showToast._t);
// //     showToast._t = setTimeout(() => setToast(''), 3200);
// //   }

// //   async function loadVendorList() {
// //     const res = await api.get('/ap/vendors');
// //     setVendors(res.data);
// //     setVendorsLoaded(true);
// //   }
// //   async function loadVendor(id) {
// //     if (!id) return;
// //     const seq = ++loadSeq.current;
// //     let res;
// //     try {
// //       res = await api.get(`/ap/vendor/${id}`);
// //     } catch (e) {
// //       if (seq === loadSeq.current) setVenErr(e.message || 'Failed to load vendor');
// //       return;
// //     }
// //     if (seq !== loadSeq.current) return; // a newer vendor was selected meanwhile
// //     if (!res.ok) { setVenErr(res.data?.error || 'Failed to load vendor'); showToast(res.data?.error || 'Failed to load vendor'); return; }
// //     setVenErr('');
// //     setCur(res.data);
// //     setSel({});
// //     setAddOpen(false);
// //   }

// //   useEffect(() => {
// //     (async () => {
// //       await loadVendorList();
// //       const res = await api.get('/ap/coa');
// //       setCoa(res.data);
// //       if (res.data.bank.length) { setABank(res.data.bank[0].code); setRefBank(res.data.bank[0].code); }
// //       setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]);
// //       if (res.data.invoiceExpense.length) setIL([{ a: res.data.invoiceExpense[0].code, d: '', n: '' }]);
// //     })();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);
// //   // Vendor changed: drop the previous vendor's data and form state, then load the new vendor.
// //   useEffect(() => {
// //     setCur(null); setVenErr(''); setSel({}); setUseAdv(false); setNLink(''); setNApply(''); setTouched(false);
// //     setAddOpen(false); setRefundAdv(null); setViewTx(null); setAErr(''); setNErr(''); setEditing(null);
// //     if (venId) loadVendor(venId); else loadSeq.current++;
// //   }, [venId]); // eslint-disable-line react-hooks/exhaustive-deps

// //   // A focused number input must not change its value on mouse-wheel scroll (500 -> 500.02 bug).
// //   useEffect(() => {
// //     const h = () => {
// //       const a = document.activeElement;
// //       if (a && a.tagName === 'INPUT' && a.type === 'number') a.blur();
// //     };
// //     document.addEventListener('wheel', h, { passive: true });
// //     return () => document.removeEventListener('wheel', h);
// //   }, []);

// //   function bal(i) { return Number(i.balance); }
// //   function status(i) {
// //     const b = bal(i);
// //     if (b <= 0.001) return ['Paid', 'paid'];
// //     if (i.due < TODAY) return ['Overdue', 'over'];
// //     if (Number(i.advanceAdjusted) + Number(i.paid) > 0) return ['Partial', 'part'];
// //     return ['Open', ''];
// //   }
// //   const outstanding = useMemo(() => (cur ? cur.invoices.reduce((s, i) => s + bal(i), 0) : 0), [cur]);

// //   const totals = useMemo(() => {
// //     let s = 0; Object.values(sel).forEach((v) => (s += v)); s = round2(s);
// //     const a = useAdv && cur ? Math.min(cur.advanceBalance, s) : 0;
// //     return { s, a, c: round2(s - a) };
// //   }, [sel, useAdv, cur]);

// //   function toggleInvoice(inv, checked) {
// //     setSel((prev) => {
// //       const next = { ...prev };
// //       if (checked) next[inv.id] = bal(inv); else delete next[inv.id];
// //       return next;
// //     });
// //   }
// //   function setInvoiceAmount(inv, raw) {
// //     let v = parseFloat(raw);
// //     if (!(v > 0)) v = bal(inv);
// //     v = Math.min(v, bal(inv));
// //     setSel((prev) => ({ ...prev, [inv.id]: v }));
// //   }

// //   async function doSettle() {
// //     if (totals.s <= 0) return;
// //     const applications = Object.keys(sel).map((k) => ({ invoiceId: k, payNow: 0, fromAdvance: 0 }));
// //     let leftAdv = totals.a, leftCash = totals.c;
// //     for (const a of applications) {
// //       const need = sel[a.invoiceId];
// //       const fromAdv = Math.min(need, leftAdv); a.fromAdvance = round2(fromAdv); leftAdv = round2(leftAdv - fromAdv);
// //       const fromCash = Math.min(need - fromAdv, leftCash); a.payNow = round2(fromCash); leftCash = round2(leftCash - fromCash);
// //     }
// //     setSettling(true);
// //     const res = await api.post('/ap/settle', { supplier_id: cur.id, date: dt || TODAY, method: meth, bank_account_code: bankSel, applications });
// //     setSettling(false);
// //     if (!res.data.ok) { showToast(res.data.error || 'Settle failed'); return; }
// //     setSel({}); setUseAdv(false);
// //     await loadVendor(cur.id);
// //     showToast(`Settled ${money(totals.s)}: ${money(totals.a)} from advance and ${money(totals.c)} by ${meth.toLowerCase()}.`);
// //   }

// //   async function cancelInvoice(id) {
// //     const res = await api.post('/ap/cancel_invoice', { invoice_id: id });
// //     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
// //     await loadVendor(cur.id);
// //     showToast(`Invoice ${res.data.invoiceNo} cancelled.`);
// //   }
// //   async function cancelPayment(id) {
// //     const res = await api.post('/ap/cancel_payment', { payment_id: id });
// //     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
// //     await loadVendor(cur.id);
// //     showToast(`Payment ${res.data.paymentNo} cancelled and reversed.`);
// //   }
// //   async function cancelRefund(id) {
// //     const res = await api.post('/ap/cancel_refund', { refund_id: id });
// //     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
// //     await loadVendor(cur.id);
// //     showToast(`Refund ${res.data.refundNo} cancelled and reversed.`);
// //   }

// //   // ---------------- advance mode ----------------
// //   const lineTotal = useMemo(() => round2(L.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [L]);
// //   function updateLine(i, k, v) { setL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
// //   function addLine() { setL((prev) => [...prev, { a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); }
// //   function removeLine(i) { setL((prev) => prev.filter((_, idx) => idx !== i)); }

// //   async function recordAdvance() {
// //     let badIdx = null;
// //     L.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
// //     if (badIdx !== null) { setAErr(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }
// //     const noDesc = L.findIndex((x) => !x.d.trim());
// //     if (noDesc !== -1) { setAErr(`Line ${noDesc + 1} needs a description.`); return; }
// //     if (!aBank) { setAErr('Select which account this was paid from.'); return; }
// //     setAErr('');
// //     const t = lineTotal;

// //     if (editing?.type === 'ADVANCE') {
// //       const r = await api.post('/ap/update_advance', {
// //         advance_id: editing.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
// //         lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //       });
// //       if (!r.data.ok) { setAErr(r.data.error || 'Update failed'); return; }
// //       const no = editing.no;
// //       cancelEdit();
// //       await loadVendor(cur.id);
// //       showToast(`Advance ${no} updated.`);
// //       return;
// //     }

// //     const res = await api.post('/ap/record_advance', {
// //       supplier_id: cur.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
// //       lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //     });
// //     if (!res.data.ok) { setAErr(res.data.error || 'Failed to save advance'); return; }
// //     setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
// //     await loadVendor(cur.id);
// //     showToast(`Advance of ${money(t)} posted, credited to ${an(coa.bank, aBank)}.`);
// //   }

// //   // ---------------- add invoice ----------------
// //   const ilTot = useMemo(() => round2(IL.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [IL]);
// //   const advSel = useMemo(() => (nLink && cur ? cur.advances.find((x) => String(x.id) === String(nLink)) : null), [nLink, cur]);
// //   useEffect(() => {
// //     if (!advSel) { setNApply(''); setTouched(false); return; }
// //     if (!touched) { const v = Math.min(advSel.balance, ilTot); setNApply(v > 0 ? String(v) : ''); }
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [advSel, ilTot]);

// //   function updateIL(i, k, v) { setIL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
// //   function addIL() { setIL((prev) => [...prev, { a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]); }
// //   function removeIL(i) { setIL((prev) => prev.filter((_, idx) => idx !== i)); }

// //   function openAddBox(open) {
// //     setAddOpen(open); setNErr('');
// //     if (open) {
// //       setNDate(TODAY);
// //       const d = new Date(); d.setDate(d.getDate() + 30);
// //       setNDue(d.toISOString().slice(0, 10));
// //       setNNo('INV-' + Date.now().toString().slice(-6));
// //       setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
// //       setTouched(false); setNNote(''); setNLink('');
// //     }
// //   }

// //   async function saveInvoice() {
// //     const no = nNo.trim(), e = setNErr;
// //     let badIdx = null;
// //     IL.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
// //     if (!no) { e('Enter an invoice number.'); return; }
// //     if (!nNote.trim()) { e('Enter a description.'); return; }
// //     if (!nDate || !nDue) { e('Set both the invoice date and the due date.'); return; }
// //     if (nDue < nDate) { e("The due date can't be before the invoice date."); return; }
// //     if (badIdx !== null) { e(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }

// //     // Editing: the advance that was linked at creation keeps its applied amount.
// //     if (editing?.type === 'INVOICE') {
// //       if (editing.applied > 0 && ilTot + 0.001 < editing.applied) {
// //         e(`Invoice total can't be less than the advance already applied (${money(editing.applied)}).`);
// //         return;
// //       }
// //       e('');
// //       const r = await api.post('/ap/update_invoice', {
// //         invoice_id: editing.id, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
// //         lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //       });
// //       if (!r.data.ok) { e(r.data.error || 'Update failed'); return; }
// //       const eno = editing.no;
// //       setEditing(null);
// //       openAddBox(false);
// //       await loadVendor(cur.id);
// //       showToast(`Invoice ${eno} updated.`);
// //       return;
// //     }

// //     const t = ilTot, a = advSel, ap = a ? round2(parseFloat(nApply) || 0) : 0;
// //     if (a && !(ap > 0)) { e(`Enter how much to apply from ${a.no}, or choose no advance link.`); return; }
// //     if (a && ap > Math.min(a.balance, t)) { e(`You can apply at most ${money(Math.min(a.balance, t))} from ${a.no} (${money(a.balance)} available, invoice total ${money(t)}).`); return; }
// //     e('');

// //     const res = await api.post('/ap/save_invoice', {
// //       supplier_id: cur.id, invoice_no: no, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
// //       lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
// //       link_advance_id: a ? a.id : '', apply_amount: a ? ap : 0,
// //     });
// //     if (!res.data.ok) { e(res.data.error || 'Failed to save invoice'); return; }
// //     openAddBox(false);
// //     await loadVendor(cur.id);
// //     showToast(`Invoice ${no} for ${money(t)} added` + (a ? ` and linked to ${a.no}: ${money(ap)} applied.` : '. Select it to pay.'));
// //   }

// //   // ---------------- refund ----------------
// //   function openRefund(adv) {
// //     setRefundAdv(adv);
// //     setRefAmt(String(adv.balance)); setRefDt(TODAY); setRefRef(''); setRefNote(''); setRefErr('');
// //   }
// //   async function confirmRefund() {
// //     if (!refundAdv) return;

// //     if (editing?.type === 'REFUND') {
// //       if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
// //       setRefErr('');
// //       const r = await api.post('/ap/update_refund', {
// //         refund_id: editing.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth,
// //         reference_no: refRef.trim(), remarks: refNote.trim(),
// //       });
// //       if (!r.data.ok) { setRefErr(r.data.error || 'Update failed'); return; }
// //       const rn = editing.no;
// //       setEditing(null);
// //       setRefundAdv(null);
// //       await loadVendor(cur.id);
// //       showToast(`Refund ${rn} updated.`);
// //       return;
// //     }

// //     const amt = parseFloat(refAmt) || 0;
// //     if (!(amt > 0)) { setRefErr('Enter a refund amount greater than zero.'); return; }
// //     if (amt > refundAdv.balance + 0.001) { setRefErr(`Refund amount exceeds the available balance of ${money(refundAdv.balance)}.`); return; }
// //     if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
// //     setRefErr('');
// //     const no = refundAdv.no;
// //     const res = await api.post('/ap/refund_advance', {
// //       advance_id: refundAdv.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth, reference_no: refRef.trim(), amount: amt, remarks: refNote.trim(),
// //     });
// //     if (!res.data.ok) { setRefErr(res.data.error || 'Refund failed'); return; }
// //     setRefundAdv(null);
// //     await loadVendor(cur.id);
// //     showToast(`Refund of ${money(amt)} recorded for ${no}.`);
// //   }
// //   function closeRefundModal() {
// //     setRefundAdv(null);
// //     if (editing?.type === 'REFUND') setEditing(null);
// //   }

// //   // ---------------- edit (pencil in Recent activity) ----------------
// //   async function openEdit(l) {
// //     const isSettle = l.sourceType === 'PAYMENT' && Number(l.sourceId) === 0;
// //     const res = await api.get(isSettle ? `/ap/edit_data/SETTLEMENT/${l.journalId}` : `/ap/edit_data/${l.sourceType}/${l.sourceId}`);
// //     if (!res.ok || !res.data?.ok) { showToast(res.data?.error || 'This record cannot be edited'); return; }
// //     const d = res.data;
// //     if (d.type === 'SETTLEMENT') {
// //       setSettleEdit({ id: d.id, no: d.no, date: d.date, description: d.description, amount: Number(d.amount), err: '' });
// //       return;
// //     }
// //     // advNo / applied: advance that was linked when the invoice was created (read-only while editing)
// //     setEditing({ type: d.type, id: d.id, no: d.no, advNo: d.advNo || null, applied: Number(d.advanceApplied || 0) });
// //     if (d.type === 'ADVANCE') {
// //       setMode('adv'); setAErr('');
// //       setABank(d.bank); setADt(d.date); setAMeth(d.method || 'Bank transfer'); setARef(d.ref || '');
// //       setL(d.lines.map((x) => ({ a: AP_ADVANCE_ACCOUNT_CODE, d: x.d || '', n: String(x.n) })));
// //     } else if (d.type === 'INVOICE') {
// //       setMode('inv'); setNErr('');
// //       setAddOpen(true);
// //       setNNo(d.no); setNDate(d.date); setNDue(d.due || d.date); setNNote(d.note || ''); setNLink(''); setTouched(false);
// //       setIL(d.lines.map((x) => ({ a: x.a, d: x.d || '', n: String(x.n) })));
// //     } else {
// //       setRefundAdv({ id: d.advanceId, no: d.no, balance: d.amount });
// //       setRefAmt(String(d.amount)); setRefDt(d.date); setRefBank(d.bank); setRefMeth(d.method || 'Bank transfer');
// //       setRefRef(d.ref || ''); setRefNote(d.remarks || ''); setRefErr('');
// //     }
// //   }
// //   function cancelEdit() {
// //     setEditing(null); setAddOpen(false); setRefundAdv(null); setAErr(''); setNErr('');
// //     setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
// //     setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
// //   }

// //   // ---------------- journal previews ----------------
// //   function advanceJournalRows() {
// //     const rows = [];
// //     L.forEach((x) => { const v = parseFloat(x.n); if (v > 0) rows.push({ label: `${advCode} · Advances to Suppliers`, dr: v, cr: 0 }); });
// //     const t = lineTotal;
// //     if (t > 0) rows.push({ label: `${aBank} · ${an(coa.bank, aBank)}`, dr: 0, cr: t, isCredit: true });
// //     return { rows, total: t };
// //   }
// //   function invoiceJournalRows() {
// //     const rows = []; const t = ilTot;
// //     // While editing, the linked advance (if any) comes from the saved record, not from the form.
// //     const isEdit = editing?.type === 'INVOICE';
// //     const ap = isEdit ? Number(editing.applied || 0) : (parseFloat(nApply) || 0);
// //     const linkedNo = isEdit ? editing.advNo : nLink;
// //     IL.forEach((x) => { const v = parseFloat(x.n); if (v > 0 && x.a) rows.push({ label: `${x.a} · ${an(coa.invoiceExpense, x.a)}`, dr: v, cr: 0 }); });
// //     let total = t;
// //     if (t > 0) {
// //       rows.push({ label: '3020020000 · Accounts Payable - Trade', dr: 0, cr: t, isCredit: true });
// //       if (linkedNo && ap > 0) {
// //         total = t + ap;
// //         rows.push({ label: '3020020000 · Accounts Payable - Trade (advance applied)', dr: ap, cr: 0 });
// //         rows.push({ label: `${advCode} · Advances to Suppliers (${linkedNo})`, dr: 0, cr: ap, isCredit: true });
// //       }
// //     }
// //     return { rows, total };
// //   }

// //   const [newVendorName, setNewVendorName] = useState('');
// //   async function addVendor() {
// //     const name = newVendorName.trim();
// //     if (!name) return;
// //     const res = await api.post('/ap/vendors', { name });
// //     if (!res.data.ok) { showToast(res.data.error || 'Failed to add vendor'); return; }
// //     setNewVendorName('');
// //     await loadVendorList();
// //     setVenId(String(res.data.id));
// //   }

// //   async function saveSettleEdit() {
// //     const s = settleEdit;
// //     if (!s) return;
// //     if (!s.date) { setSettleEdit({ ...s, err: 'Select a date.' }); return; }
// //     const r = await api.post('/ap/update_settlement', { journal_id: s.id, date: s.date });
// //     if (!r.data.ok) { setSettleEdit({ ...s, err: r.data.error || 'Update failed' }); return; }
// //     setSettleEdit(null);
// //     await loadVendor(cur.id);
// //     showToast(`Settlement ${s.no} updated.`);
// //   }

// //   // guarded save handlers (function declarations above are hoisted, so this is safe)
// //   const onRecordAdvance = guard(recordAdvance);
// //   const onSaveInvoice = guard(saveInvoice);
// //   const onConfirmRefund = guard(confirmRefund);
// //   const onSaveSettleEdit = guard(saveSettleEdit);

// //   if (!cur) {
// //     return (
// //       <Page>
// //         <div className={TOP}>
// //           <div>
// //             <h1 className={H1}>Vendor payments</h1>
// //             <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
// //           </div>
// //           {vendors.length > 0 && (
// //             <div className="min-w-[240px]">
// //               <label className="apar-label">Vendor</label>
// //               <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
// //                 <option value="">Select vendor</option>
// //                 {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
// //               </select>
// //             </div>
// //           )}
// //         </div>

// //         {venErr && venId ? (
// //           <div className={PANEL}><div className={ERR} role="alert">{venErr}</div></div>
// //         ) : !vendorsLoaded || venId ? (
// //           <div className={PANEL}><div className="py-[24px] text-center text-apar-mute">Loading...</div></div>
// //         ) : vendors.length > 0 ? (
// //           <div className={PANEL}>
// //             <h2 className="apar-h2">Select a vendor</h2>
// //             <div className="text-apar-mute">Choose a vendor from the list above to see invoices, advances, and payments.</div>
// //           </div>
// //         ) : (
// //           <div className={PANEL}>
// //             <h2 className="apar-h2">No vendors yet</h2>
// //             <div className={`${ROW2} items-end`}>
// //               <div>
// //                 <label className="apar-label">Vendor name</label>
// //                 <input className="apar-input" value={newVendorName} onChange={(e) => setNewVendorName(e.target.value)} placeholder="e.g. Acme Supplies Ltd." />
// //               </div>
// //               <div><button className="apar-btn w-full" onClick={addVendor}>Add vendor</button></div>
// //             </div>
// //           </div>
// //         )}
// //       </Page>
// //     );
// //   }

// //   const open = cur.invoices.filter((i) => bal(i) > 0.001);
// //   const advJrn = advanceJournalRows();
// //   const invJrn = invoiceJournalRows();

// //   return (
// //     <Page>
// //       <div className={TOP}>
// //         <div>
// //           <h1 className={H1}>Vendor payments</h1>
// //           <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
// //         </div>
// //         <div className="min-w-[240px]">
// //           <label className="apar-label">Vendor</label>
// //           <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
// //             {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
// //           </select>
// //         </div>
// //       </div>

// //       <div className={GRID}>
// //         <main className={PANEL}>
// //           <div className={SEG} role="group" aria-label="Payment type">
// //             <button type="button" className={SEG_BTN} aria-pressed={mode === 'inv'} onClick={() => setMode('inv')}>
// //               <b className="block">Pay against invoices</b>
// //               <span className="text-[13px] text-apar-mute">Choose payable invoices and settle them</span>
// //             </button>
// //             <button type="button" className={SEG_BTN} aria-pressed={mode === 'adv'} onClick={() => setMode('adv')}>
// //               <b className="block">Advance to vendor</b>
// //               <span className="text-[13px] text-apar-mute">Individual payment with no invoice yet</span>
// //             </button>
// //           </div>

// //           {mode === 'inv' && (
// //             <section>
// //               <div className={ADDBAR}>
// //                 <b className="text-[15px]">Payable invoices</b>
// //                 <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(!addOpen))}>Add payable invoice</button>
// //               </div>

// //               {addOpen && (
// //                 <div className={ADDBOX}>
// //                   {editing?.type === 'INVOICE' && (
// //                     <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing invoice {editing.no}</div>
// //                   )}
// //                   {editing?.type === 'INVOICE' && editing.advNo && (
// //                     <div className="mb-[12px] text-[13px] text-apar-mute">
// //                       Advance {editing.advNo} ({money(editing.applied)}) is linked to this invoice. The applied amount stays the same.
// //                     </div>
// //                   )}
// //                   <div className={ROW3}>
// //                     <div><label className="apar-label">Invoice number</label><input className={`apar-input ${MONO}`} value={nNo} disabled={!!editing} onChange={(e) => setNNo(e.target.value)} placeholder="INV-2100" /></div>
// //                     <div><label className="apar-label">Invoice date</label><input className="apar-input" type="date" value={nDate} onChange={(e) => setNDate(e.target.value)} /></div>
// //                     <div><label className="apar-label">Due date</label><input className="apar-input" type="date" value={nDue} onChange={(e) => setNDue(e.target.value)} /></div>
// //                   </div>
// //                   <div className={ROW}>
// //                     <div><label className="apar-label">Description <span className="text-apar-err">*</span></label><input className="apar-input" required value={nNote} onChange={(e) => setNNote(e.target.value)} placeholder="e.g. October packaging supplies" /></div>
// //                   </div>

// //                   <div className={ADDBAR}>
// //                     <b className="text-[15px]">Invoice lines</b>
// //                     <button type="button" className="apar-ghost" onClick={addIL}>Add line</button>
// //                   </div>
// //                   <div className={TBLW}>
// //                     <table className={TABLE_SM}>
// //                       <thead>
// //                         <tr>
// //                           <th className={`${TH} w-[48%]`}>Account</th>
// //                           <th className={TH}>Description</th>
// //                           <th className={`${THN} w-[120px]`}>Amount</th>
// //                           <th className={`${TH} w-[36px]`}></th>
// //                         </tr>
// //                       </thead>
// //                       <tbody>
// //                         {IL.map((x, i) => (
// //                           <tr key={i}>
// //                             <td className={TD}><AccountPicker options={coa.invoiceExpense} value={x.a} onChange={(code) => updateIL(i, 'a', code)} /></td>
// //                             <td className={TD}><input className="apar-input" value={x.d} onChange={(e) => updateIL(i, 'd', e.target.value)} placeholder="Optional. Defaults to the description above" /></td>
// //                             <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateIL(i, 'n', e.target.value)} placeholder="0.00" /></td>
// //                             <td className={TD}>{IL.length > 1 && <button type="button" className={LNX} onClick={() => removeIL(i)}>&times;</button>}</td>
// //                           </tr>
// //                         ))}
// //                       </tbody>
// //                       <tfoot>
// //                         <tr>
// //                           <td colSpan={2} className={TFN}>Invoice total</td>
// //                           <td className={`${TFN} ${MONO}`}>{money(ilTot)}</td>
// //                           <td></td>
// //                         </tr>
// //                       </tfoot>
// //                     </table>
// //                   </div>

// //                   <div className={`${ROW2} mt-[14px]`}>
// //                     <div>
// //                       <label className="apar-label">Link advance payment</label>
// //                       <select className="apar-select" value={nLink} onChange={(e) => { setNLink(e.target.value); setTouched(false); }} disabled={!!editing || !cur.advances.some((a) => a.balance > 0)}>
// //                         <option value="">{cur.advances.some((a) => a.balance > 0) ? 'No advance link' : 'No open advance for this vendor'}</option>
// //                         {cur.advances.filter((a) => a.balance > 0).map((a) => <option key={a.id} value={a.id}>{a.no} · {money(a.balance)} available ({a.date})</option>)}
// //                       </select>
// //                     </div>
// //                     <div>
// //                       <label className="apar-label">Apply from advance</label>
// //                       <input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={nApply} disabled={!advSel || !!editing} onChange={(e) => { setTouched(true); setNApply(e.target.value); }} placeholder="0.00" />
// //                     </div>
// //                   </div>

// //                   <h2 className="apar-h2">Journal entry preview</h2>
// //                   <div className={TBLW}>
// //                     <table className={TABLE_SM}>
// //                       <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //                       <tbody>
// //                         {invJrn.rows.length ? invJrn.rows.map((r, i) => (
// //                           <tr key={i}>
// //                             <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
// //                             <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
// //                             <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
// //                           </tr>
// //                         )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
// //                         {invJrn.total > 0 && (
// //                           <tr className="font-bold">
// //                             <td className={TD}>Total</td>
// //                             <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
// //                             <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
// //                           </tr>
// //                         )}
// //                       </tbody>
// //                     </table>
// //                   </div>

// //                   <div className={ERR} role="alert">{nErr}</div>
// //                   <div className="flex gap-[10px]">
// //                     <button type="button" className="apar-btn" disabled={saving} onClick={onSaveInvoice}>{editing?.type === 'INVOICE' ? 'Save changes' : 'Save invoice'}</button>
// //                     <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(false))}>Cancel</button>
// //                   </div>
// //                 </div>
// //               )}

// //               <div className={TBLW}>
// //                 <table className={TABLE}>
// //                   <thead>
// //                     <tr>
// //                       <th className={TH}></th>
// //                       <th className={TH}>Invoice</th>
// //                       <th className={TH}>Due</th>
// //                       <th className={TH}>Status</th>
// //                       <th className={THN}>Balance</th>
// //                       <th className={THN}>Pay now</th>
// //                       <th className={TH}></th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {cur.invoices.map((i) => {
// //                       const b = bal(i), st = status(i), on = sel[i.id] !== undefined;
// //                       const canCancel = Number(i.paid) <= 0.001;
// //                       return (
// //                         <tr key={i.id}>
// //                           <td className={TD}><input type="checkbox" disabled={b <= 0.001} checked={on} onChange={(e) => toggleInvoice(i, e.target.checked)} /></td>
// //                           <td className={TD}>
// //                             <span className={MONO}>{i.no}</span>
// //                             {i.note && <small className={`${NT} text-apar-mute`}>{i.note}</small>}
// //                             {i.links?.length > 0 && <small className={`${NT} text-apar-ok`}>Linked to {i.links.map((l) => `${l.advNo} (${money(l.amt)})`).join(', ')}</small>}
// //                           </td>
// //                           <td className={TD}>{i.due}</td>
// //                           <td className={TD}><span className={`${TAG} ${TAG_COLOR[st[1]]}`}>{st[0]}</span></td>
// //                           <td className={`${TDN} ${MONO}`}>{money(b)}</td>
// //                           <td className={TDN}>
// //                             <input className={`apar-input w-[104px] text-right ${MONO}`} type="number" min="0" max={b} step="0.01" disabled={!on} value={on ? sel[i.id] : ''} onChange={(e) => on && setInvoiceAmount(i, e.target.value)} />
// //                           </td>
// //                           <td className={TD}>
// //                             <div className="flex items-center justify-end gap-[8px]">
// //                               <AttachmentsButton entityType="AP_INVOICE" entityId={i.id} />
// //                               {canCancel && <button type="button" className={XLINK} onClick={() => cancelInvoice(i.id)}>Cancel</button>}
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       );
// //                     })}
// //                     {!open.length && <tr><td colSpan={7} className={TD_EMPTY}>All invoices for this vendor are paid.</td></tr>}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               <div className={CHK}>
// //                 <input className="h-[17px] w-[17px] accent-apar-acc" type="checkbox" id="useAdv" checked={useAdv} disabled={cur.advanceBalance <= 0} onChange={(e) => setUseAdv(e.target.checked)} />
// //                 <label htmlFor="useAdv">{cur.advanceBalance > 0 ? `Apply advance balance (${money(cur.advanceBalance)} available)` : 'No advance balance available'}</label>
// //               </div>

// //               <div className={ROW2}>
// //                 <div>
// //                   <label className="apar-label">Method</label>
// //                   <select className="apar-select" value={meth} onChange={(e) => setMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
// //                 </div>
// //                 <div>
// //                   <label className="apar-label">Paid from account</label>
// //                   <select className="apar-select" value={bankSel} onChange={(e) => setBankSel(e.target.value)}>
// //                     <option value="">Not needed if fully from advance</option>
// //                     {coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}
// //                   </select>
// //                 </div>
// //               </div>
// //               <div className={ROW2}>
// //                 <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={dt} onChange={(e) => setDt(e.target.value)} /></div>
// //                 <div></div>
// //               </div>

// //               <div className="ml-auto max-w-[380px]">
// //                 <div className={LINE}><span>Selected invoices</span><span className={MONO}>{money(totals.s)}</span></div>
// //                 <div className={LINE}><span>Advance applied</span><span className={`${MONO} text-apar-ok`}>-{money(totals.a)}</span></div>
// //                 <div className={LINE_BIG}><span>Cash to pay</span><span className={MONO}>{money(totals.c)}</span></div>
// //                 <button className="apar-btn mt-[6px] w-full" disabled={totals.s <= 0 || settling} onClick={doSettle}>Settle selected invoices</button>
// //               </div>
// //             </section>
// //           )}

// //           {mode === 'adv' && (
// //             <section>
// //               {editing?.type === 'ADVANCE' && (
// //                 <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing advance {editing.no}</div>
// //               )}
// //               <div className={ROW2}>
// //                 <div>
// //                   <label className="apar-label">Paid from account</label>
// //                   <select className="apar-select" value={aBank} onChange={(e) => setABank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
// //                 </div>
// //                 <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={aDt} onChange={(e) => setADt(e.target.value)} /></div>
// //               </div>
// //               <div className={ROW2}>
// //                 <div>
// //                   <label className="apar-label">Method</label>
// //                   <select className="apar-select" value={aMeth} onChange={(e) => setAMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
// //                 </div>
// //                 <div><label className="apar-label">Reference</label><input className="apar-input" value={aRef} onChange={(e) => setARef(e.target.value)} placeholder="PO number or note" /></div>
// //               </div>

// //               <div className={`${ADDBAR} mt-[4px]`}>
// //                 <b className="text-[15px]">Advance lines</b>
// //                 <button type="button" className="apar-ghost" onClick={addLine}>Add line</button>
// //               </div>
// //               <div className={TBLW}>
// //                 <table className={TABLE_SM}>
// //                   <thead>
// //                     <tr>
// //                       <th className={`${TH} w-[38%]`}>Account</th>
// //                       <th className={TH}>Description <span className="text-apar-err">*</span></th>
// //                       <th className={`${THN} w-[120px]`}>Amount</th>
// //                       <th className={`${TH} w-[36px]`}></th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {L.map((x, i) => (
// //                       <tr key={i}>
// //                         <td className={`${TD} ${MONO} text-apar-mute`}>{advCode} · {coa.advanceAccount?.name || 'Advances to Suppliers'}</td>
// //                         <td className={TD}><input className="apar-input" required value={x.d} onChange={(e) => updateLine(i, 'd', e.target.value)} placeholder="What is this advance for?" /></td>
// //                         <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateLine(i, 'n', e.target.value)} placeholder="0.00" /></td>
// //                         <td className={TD}>{L.length > 1 && <button type="button" className={LNX} onClick={() => removeLine(i)}>&times;</button>}</td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                   <tfoot>
// //                     <tr>
// //                       <td colSpan={2} className={TFN}>Total advance</td>
// //                       <td className={`${TFN} ${MONO}`}>{money(lineTotal)}</td>
// //                       <td></td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>
// //               </div>

// //               <h2 className="apar-h2 mt-[18px]">Journal entry preview</h2>
// //               <div className={TBLW}>
// //                 <table className={TABLE_SM}>
// //                   <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //                   <tbody>
// //                     {advJrn.total > 0 ? advJrn.rows.map((r, i) => (
// //                       <tr key={i}>
// //                         <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
// //                         <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
// //                         <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
// //                       </tr>
// //                     )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
// //                     {advJrn.total > 0 && (
// //                       <tr className="font-bold">
// //                         <td className={TD}>Total</td>
// //                         <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
// //                         <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
// //                       </tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               <div className={ERR} role="alert">{aErr}</div>
// //               <button className="apar-btn mt-[6px] w-full" disabled={saving} onClick={onRecordAdvance}>{editing?.type === 'ADVANCE' ? 'Save changes' : 'Record advance'}</button>
// //               {editing?.type === 'ADVANCE' && (
// //                 <button type="button" className="apar-ghost mt-[6px] w-full" onClick={cancelEdit}>Cancel edit</button>
// //               )}
// //               <p className="mt-[12px] text-[13px] text-apar-mute">The advance is held as a vendor balance. Switch to "Pay against invoices" to apply it when an invoice arrives.</p>
// //             </section>
// //           )}
// //         </main>

// //         <aside className={PANEL}>
// //           <h2 className="apar-h2">{cur.name}</h2>
// //           <div className={STAT}>
// //             <div className={STAT_BOX}><span className={STAT_LABEL}>Outstanding</span><b className={`text-[18px] ${MONO}`}>{money(outstanding)}</b></div>
// //             <div className={STAT_BOX}><span className={STAT_LABEL}>Advance balance</span><b className={`text-[18px] ${MONO} text-apar-ok`}>{money(cur.advanceBalance)}</b></div>
// //           </div>

// //           <h2 className="apar-h2">Advance payments</h2>
// //           <ul>
// //             {cur.advances.length ? cur.advances.map((a) => {
// //               const appliedTo = [];
// //               cur.invoices.forEach((i) => (i.links || []).forEach((l) => { if (l.advNo === a.no) appliedTo.push(`${i.no} ${money(l.amt)}`); }));
// //               const canRefund = a.balance > 0.001 && a.status !== 'Cancelled';
// //               return (
// //                 <li key={a.id} className={LI}>
// //                   <span>{a.no}<small className={LED_SMALL}>{a.date} {appliedTo.length ? `· applied to ${appliedTo.join(', ')}` : '· not yet applied'}</small></span>
// //                   <b className={`${MONO} text-apar-ok`}>{money(a.balance)} {canRefund && <button type="button" className={XLINK} onClick={() => openRefund(a)}>Refund</button>}</b>
// //                 </li>
// //               );
// //             }) : <li className={LI_EMPTY}>No advances yet.</li>}
// //           </ul>

// //           <h2 className="apar-h2 mt-[18px]">Payments</h2>
// //           <ul>
// //             {cur.payments?.length ? cur.payments.map((p) => {
// //               const cancelled = p.status === 'Cancelled';
// //               return (
// //                 <li key={p.id} className={LI}>
// //                   <span>{p.no}<small className={LED_SMALL}>{p.date}{cancelled ? ' · cancelled' : ''}</small>{p.note && <small className={LED_SMALL}>{p.note}</small>}</span>
// //                   <b className={`flex items-center gap-[8px] ${MONO}`}>
// //                     <AttachmentsButton entityType="AP_PAYMENT" entityId={p.id} />
// //                     {money(p.total)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelPayment(p.id)}>Cancel</button>}
// //                   </b>
// //                 </li>
// //               );
// //             }) : <li className={LI_EMPTY}>No payments yet.</li>}
// //           </ul>

// //           <h2 className="apar-h2 mt-[18px]">Refunds</h2>
// //           <ul>
// //             {cur.refunds?.length ? cur.refunds.map((r) => {
// //               const cancelled = r.status === 'Cancelled';
// //               return (
// //                 <li key={r.id} className={LI}>
// //                   <span>{r.no}<small className={LED_SMALL}>{r.date} · {r.advNo}{cancelled ? ' · cancelled' : ''}</small></span>
// //                   <b className={MONO}>{money(r.amount)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelRefund(r.id)}>Cancel</button>}</b>
// //                 </li>
// //               );
// //             }) : <li className={LI_EMPTY}>No refunds yet.</li>}
// //           </ul>

// //           <h2 className="apar-h2 mt-[18px]">Recent activity</h2>
// //           <ul>
// //             {cur.ledger.length ? cur.ledger.map((l, i) => (
// //               <li key={l.journalId || i} className={LI}>
// //                 <span>{l.description}<small className={LED_SMALL}>{l.date}</small></span>
// //                 <b className={`flex items-center gap-[8px] ${MONO} ${l.positive ? 'text-apar-ok' : 'text-apar-err'}`}>
// //                   {l.editable && l.sourceType === 'ADVANCE' && (
// //                     <button
// //                       type="button"
// //                       title="Edit"
// //                       aria-label="Edit"
// //                       className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
// //                       onClick={() => openEdit(l)}
// //                     >
// //                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //                         <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
// //                       </svg>
// //                     </button>
// //                   )}
// //                   <button
// //                     type="button"
// //                     title="View details"
// //                     aria-label="View details"
// //                     className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
// //                     onClick={() => setViewTx({ sourceType: l.sourceType, sourceId: l.sourceId, journalId: Number(l.sourceId) === 0 || l.sourceType === 'INVOICE' ? l.journalId : 0 })}
// //                   >
// //                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
// //                     </svg>
// //                   </button>
// //                   <span>{l.positive ? '+' : '-'}{money(l.amount)}</span>
// //                 </b>
// //               </li>
// //             )) : <li className={LI_EMPTY}>No activity yet.</li>}
// //           </ul>
// //         </aside>
// //       </div>

// //       {toast && (
// //         <div className="fixed bottom-[20px] left-1/2 z-[130] max-w-[92%] -translate-x-1/2 rounded-[9px] bg-apar-ink px-[18px] py-[11px] text-apar-bg" role="status">
// //           {toast}
// //         </div>
// //       )}

// //       {refundAdv && (
// //         <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && closeRefundModal()}>
// //           <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
// //             <h2 className="apar-h2">{editing?.type === 'REFUND' ? 'Edit refund' : 'Refund advance'} <span className={MONO}>{refundAdv.no}</span></h2>
// //             <div className="mb-[12px] text-[13px] text-apar-mute">{editing?.type === 'REFUND' ? 'Refund amount' : 'Available to refund'}: <b className={MONO}>{money(refundAdv.balance)}</b></div>
// //             <div className={ROW2}>
// //               <div><label className="apar-label">Refund amount</label><input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={refAmt} disabled={editing?.type === 'REFUND'} onChange={(e) => setRefAmt(e.target.value)} /></div>
// //               <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={refDt} onChange={(e) => setRefDt(e.target.value)} /></div>
// //             </div>
// //             <div className={ROW2}>
// //               <div>
// //                 <label className="apar-label">Refund to account</label>
// //                 <select className="apar-select" value={refBank} onChange={(e) => setRefBank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
// //               </div>
// //               <div>
// //                 <label className="apar-label">Method</label>
// //                 <select className="apar-select" value={refMeth} onChange={(e) => setRefMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
// //               </div>
// //             </div>
// //             <div className={ROW}><div><label className="apar-label">Reference</label><input className="apar-input" value={refRef} onChange={(e) => setRefRef(e.target.value)} placeholder="Optional" /></div></div>
// //             <div className={ROW}><div><label className="apar-label">Remarks</label><input className="apar-input" value={refNote} onChange={(e) => setRefNote(e.target.value)} placeholder="Optional" /></div></div>
// //             <div className={ERR} role="alert">{refErr}</div>
// //             <div className="flex gap-[10px]">
// //               <button type="button" className="apar-btn" disabled={saving} onClick={onConfirmRefund}>{editing?.type === 'REFUND' ? 'Save changes' : 'Confirm refund'}</button>
// //               <button type="button" className="apar-ghost" onClick={closeRefundModal}>Cancel</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {settleEdit && (
// //         <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && setSettleEdit(null)}>
// //           <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
// //             <h2 className="apar-h2">Edit settlement <span className={MONO}>{settleEdit.no}</span></h2>
// //             <div className="mb-[12px] text-[13px] text-apar-mute">{settleEdit.description}</div>
// //             <div className={ROW2}>
// //               <div><label className="apar-label">Amount</label><div className={`rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px] ${MONO}`}>{money(settleEdit.amount)}</div></div>
// //               <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={settleEdit.date} onChange={(e) => setSettleEdit({ ...settleEdit, date: e.target.value, err: '' })} /></div>
// //             </div>
// //             <div className="mb-[12px] text-[12.5px] text-apar-mute">Only the date can be changed for a settlement paid fully from an advance.</div>
// //             <div className={ERR} role="alert">{settleEdit.err}</div>
// //             <div className="flex gap-[10px]">
// //               <button type="button" className="apar-btn" disabled={saving} onClick={onSaveSettleEdit}>Save changes</button>
// //               <button type="button" className="apar-ghost" onClick={() => setSettleEdit(null)}>Cancel</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {viewTx && <TransactionDialog tx={viewTx} onClose={() => setViewTx(null)} />}
// //     </Page>
// //   );
// // }

// // /* ---------- read-only transaction details (view / print / excel) ---------- */
// // function csvCell(v) {
// //   const s = v === null || v === undefined ? '' : String(v);
// //   return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
// // }

// // function downloadCsv(d) {
// //   const rows = [];
// //   const add = (...cells) => rows.push(cells.map(csvCell).join(','));
// //   add('Farm Welfare Agro Limited');
// //   add(d.title);
// //   add('Vendor', d.supplierName);
// //   add('Date', d.date);
// //   add('Status', d.cancelled ? 'Cancelled' : d.status);
// //   add('GL', d.glPosted ? 'Posted' : 'Not posted');
// //   if (d.note) add('Note', d.note);
// //   (d.fields || []).forEach((f) => add(f.label, f.value));
// //   add();
// //   if (d.summary.length) {
// //     add('Summary');
// //     d.summary.forEach((s) => add(s.label, s.money ? Number(s.value || 0) : s.value));
// //     add();
// //   }
// //   d.sections.forEach((sec) => {
// //     add(sec.title);
// //     add(...sec.columns.map((c) => c.label));
// //     sec.rows.forEach((r) => add(...sec.columns.map((c) => (c.money ? Number(r[c.key] || 0) : r[c.key] ?? ''))));
// //     if (sec.footer) add(...sec.columns.map((c, i) => (i === sec.columns.length - 1 ? Number(sec.footer.value || 0) : i === sec.columns.length - 2 ? sec.footer.label : '')));
// //     add();
// //   });
// //   add('Journal entries');
// //   add('Journal no', 'Date', 'Type', 'Description', 'Account', 'Account name', 'Debit', 'Credit');
// //   d.journal.entries.forEach((e) => {
// //     e.lines.forEach((l) => add(e.journalNo, e.date, e.kind, e.description, l.account, l.accountName, l.debit || '', l.credit || ''));
// //   });
// //   add('', '', '', '', '', 'Total', d.journal.totalDebit, d.journal.totalCredit);

// //   const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
// //   const url = URL.createObjectURL(blob);
// //   const a = document.createElement('a');
// //   a.href = url;
// //   a.download = `${d.title.replace(/[^\w.-]+/g, '_')}.csv`;
// //   document.body.appendChild(a);
// //   a.click();
// //   a.remove();
// //   URL.revokeObjectURL(url);
// // }

// // function TransactionDialog({ tx, onClose }) {
// //   const [st, setSt] = useState({ loading: true, error: '', data: null });

// //   useEffect(() => {
// //     let off = false;
// //     (async () => {
// //       setSt({ loading: true, error: '', data: null });
// //       try {
// //         const q = tx.journalId ? `?journalId=${tx.journalId}` : '';
// //         const res = await api.get(`/ap/transaction/${tx.sourceType}/${tx.sourceId}${q}`);
// //         if (off) return;
// //         if (!res.ok) { setSt({ loading: false, error: res.data?.error || 'Failed to load details', data: null }); return; }
// //         setSt({ loading: false, error: '', data: res.data });
// //       } catch (e) {
// //         if (!off) setSt({ loading: false, error: e.message || 'Failed to load details', data: null });
// //       }
// //     })();
// //     return () => { off = true; };
// //   }, [tx]);

// //   useEffect(() => {
// //     const h = (e) => e.key === 'Escape' && onClose();
// //     window.addEventListener('keydown', h);
// //     return () => window.removeEventListener('keydown', h);
// //   }, [onClose]);

// //   const d = st.data;
// //   const cell = (c, row) => (c.money ? money(Number(row[c.key] || 0)) : row[c.key] ?? '');

// //   const secs = (list) => list.map((sec) => (
// //     <div key={sec.title} className="mb-[16px]">
// //       <h3 className="mb-[6px] text-[14px] font-bold">{sec.title}</h3>
// //       <div className={TBLW}>
// //         <table className={TABLE_SM}>
// //           <thead><tr>{sec.columns.map((c) => <th key={c.key} className={c.money ? THN : TH}>{c.label}</th>)}</tr></thead>
// //           <tbody>
// //             {sec.rows.map((row, i) => (
// //               <tr key={i}>{sec.columns.map((c) => <td key={c.key} className={c.money ? `${TDN} ${MONO}` : TD}>{cell(c, row)}</td>)}</tr>
// //             ))}
// //           </tbody>
// //           {sec.footer && (
// //             <tfoot>
// //               <tr>
// //                 <td colSpan={sec.columns.length - 1} className={TFN}>{sec.footer.label}</td>
// //                 <td className={`${TFN} ${MONO}`}>{money(Number(sec.footer.value || 0))}</td>
// //               </tr>
// //             </tfoot>
// //           )}
// //         </table>
// //       </div>
// //     </div>
// //   ));

// //   const journalBlock = d && (
// //     <div className="mb-[6px]">
// //       <h3 className="mb-[6px] text-[14px] font-bold">Journal entries</h3>
// //       {d.journal.entries.length === 0 && <div className="text-apar-mute">No journal found.</div>}
// //       {d.journal.entries.map((e) => {
// //         const dr = e.lines.reduce((t, l) => t + (l.debit || 0), 0), cr = e.lines.reduce((t, l) => t + (l.credit || 0), 0);
// //         return (
// //           <div key={e.journalId} className="mb-[12px]">
// //             <div className="flex flex-wrap items-center gap-[8px] text-[13px]">
// //               <span className={MONO}>{e.journalNo}</span>
// //               <span className="text-apar-mute">{e.date}</span>
// //               <span className={`${TAG} ${e.kind === 'Reversal' ? 'text-apar-err' : ''}`}>{e.kind}</span>
// //               <span>{e.description}</span>
// //             </div>
// //             <div className={TBLW}>
// //               <table className={TABLE_SM}>
// //                 <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //                 <tbody>
// //                   {e.lines.map((l, i) => (
// //                     <tr key={i}>
// //                       <td className={l.credit > 0 ? TD_CR : TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}{l.derived ? ' *' : ''}</td>
// //                       <td className={`${TDN} ${MONO}`}>{l.debit ? money(l.debit) : ''}</td>
// //                       <td className={`${TDN} ${MONO}`}>{l.credit ? money(l.credit) : ''}</td>
// //                     </tr>
// //                   ))}
// //                   <tr className="font-bold">
// //                     <td className={TD}>Total</td>
// //                     <td className={`${TDN} ${MONO}`}>{money(dr)}</td>
// //                     <td className={`${TDN} ${MONO}`}>{money(cr)}</td>
// //                   </tr>
// //                 </tbody>
// //               </table>
// //             </div>
// //             {e.derived && <div className="text-[12px] text-apar-mute">* Not saved in the journal lines of this older record. Shown from the journal total so the entry balances.</div>}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );

// //   return (
// //     <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
// //       <style>{`
// //         .tx-only-print{display:none}
// //         @media print{
// //           @page{margin:14mm}
// //           body *{visibility:hidden}
// //           #tx-print,#tx-print *{visibility:visible}
// //           #tx-print{position:absolute;left:0;top:0;width:100%;max-height:none!important;overflow:visible!important;border:0!important;background:#fff!important;color:#000!important;padding:0!important}
// //           #tx-print .no-print{display:none!important}
// //           #tx-print .tx-only-print{display:block}
// //           #tx-print table{page-break-inside:auto}
// //           #tx-print tr{page-break-inside:avoid}
// //         }
// //       `}</style>
// //       <div id="tx-print" className="max-h-[90vh] w-full max-w-[820px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
// //         <div className="tx-only-print mb-[10px] border-b border-apar-line pb-[8px]">
// //           <div className="text-[16px] font-bold">Farm Welfare Agro Limited</div>
// //           <div className="text-[12px]">Vendor payments · printed {new Date().toISOString().slice(0, 10)}</div>
// //         </div>

// //         <div className="mb-[14px] flex items-start justify-between gap-[10px]">
// //           <div>
// //             <h2 className="apar-h2">{d ? d.title : 'Details'}</h2>
// //             {d && <div className="text-[13px] text-apar-mute">{d.supplierName}{d.date ? ` · ${d.date}` : ''}</div>}
// //           </div>
// //           <div className="flex flex-wrap items-center justify-end gap-[8px]">
// //             {d?.status && <span className={`${TAG} ${d.cancelled ? 'text-apar-err' : ''}`}>{d.cancelled ? 'Cancelled' : d.status}</span>}
// //             {d && <span className={`${TAG} ${d.glPosted ? 'text-apar-ok' : 'text-apar-warn'}`}>{d.glPosted ? 'GL posted' : 'GL not posted'}</span>}
// //             <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => window.print()}>Print</button>
// //             <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => downloadCsv(d)}>Excel</button>
// //             <button type="button" className="apar-ghost no-print" onClick={onClose}>Close</button>
// //           </div>
// //         </div>

// //         {st.loading && <div className="py-[24px] text-center text-apar-mute">Loading...</div>}
// //         {st.error && <div className={ERR} role="alert">{st.error}</div>}

// //         {d && d.invoiceForm && <InvoiceFormView f={d.invoiceForm} />}

// //         {d && !d.invoiceForm && (
// //           <>
// //             {d.note && <div className="mb-[12px] rounded-[9px] bg-apar-soft px-[12px] py-[10px] text-[13px]">{d.note}</div>}

// //             {d.fields && (
// //               <div className={ROW2}>
// //                 {d.fields.map((f) => (
// //                   <div key={f.label}>
// //                     <label className="apar-label">{f.label}</label>
// //                     <div className="rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]">{f.value}</div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {d.fields && secs(d.sections.filter((x) => x.title === 'Advance lines'))}

// //             {journalBlock}

// //             {!d.fields && d.summary.length > 0 && (
// //               <div className="mb-[16px] mt-[16px] grid grid-cols-1 gap-x-[20px] gap-y-[8px] min-[561px]:grid-cols-2">
// //                 {d.summary.map((s) => (
// //                   <div key={s.label} className="flex justify-between gap-[10px] border-b border-apar-line py-[6px] text-[13.5px]">
// //                     <span className="text-apar-mute">{s.label}</span>
// //                     <b className={s.money ? MONO : ''}>{s.money ? money(Number(s.value || 0)) : s.value}</b>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             {!d.fields && secs(d.sections)}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // /* ---------- read-only copy of the invoice entry form (shown in the eye-icon report of an invoice) ---------- */
// // function InvoiceFormView({ f }) {
// //   const RO = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]';
// //   return (
// //     <div>
// //       <div className={ROW3}>
// //         <div><label className="apar-label">Invoice number</label><div className={`${RO} ${MONO}`}>{f.no}</div></div>
// //         <div><label className="apar-label">Invoice date</label><div className={RO}>{f.date || '-'}</div></div>
// //         <div><label className="apar-label">Due date</label><div className={RO}>{f.due || '-'}</div></div>
// //       </div>
// //       <div className={ROW}>
// //         <div><label className="apar-label">Description</label><div className={RO}>{f.note || '-'}</div></div>
// //       </div>

// //       <b className="mb-[8px] block text-[15px]">Invoice lines</b>
// //       <div className={TBLW}>
// //         <table className={TABLE_SM}>
// //           <thead>
// //             <tr>
// //               <th className={`${TH} w-[48%]`}>Account</th>
// //               <th className={TH}>Description</th>
// //               <th className={`${THN} w-[120px]`}>Amount</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {f.lines.map((l, i) => (
// //               <tr key={i}>
// //                 <td className={TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}</td>
// //                 <td className={TD}>{l.desc}</td>
// //                 <td className={`${TDN} ${MONO}`}>{money(l.amount)}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //           <tfoot>
// //             <tr>
// //               <td colSpan={2} className={TFN}>Invoice total</td>
// //               <td className={`${TFN} ${MONO}`}>{money(f.total)}</td>
// //             </tr>
// //           </tfoot>
// //         </table>
// //       </div>

// //       <div className={`${ROW2} mt-[14px]`}>
// //         <div><label className="apar-label">Link advance payment</label><div className={RO}>{f.advance ? f.advance.no : 'No advance link'}</div></div>
// //         <div><label className="apar-label">Apply from advance</label><div className={`${RO} ${MONO}`}>{f.advance ? money(f.advance.applied) : '-'}</div></div>
// //       </div>

// //       <h2 className="apar-h2">Journal entry preview</h2>
// //       <div className={TBLW}>
// //         <table className={TABLE_SM}>
// //           <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
// //           <tbody>
// //             {f.preview.rows.map((r, i) => (
// //               <tr key={i}>
// //                 <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
// //                 <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
// //                 <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
// //               </tr>
// //             ))}
// //             <tr className="font-bold">
// //               <td className={TD}>Total</td>
// //               <td className={`${TDN} ${MONO}`}>{money(f.preview.total)}</td>
// //               <td className={`${TDN} ${MONO}`}>{money(f.preview.total)}</td>
// //             </tr>
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useRef, useState } from 'react';
// import { api, money, round2 } from '../api';
// import AccountPicker from '../components/AccountPicker.jsx';
// import AttachmentsButton from '../components/AttachmentsButton.jsx';
// import { PageGuideSheet } from '../vendor-guide/page-guide-sheet';
// import { vendorPaymentsGuide } from '../vendor-guide/vendor-payment-guide';

// const TODAY = new Date().toISOString().slice(0, 10);
// const METHODS = ['Bank transfer', 'Cheque', 'Cash', 'Card'];
// // Advance lines always post to this one fixed control account — see
// // record_advance on the server for the full rationale. There's nothing to
// // choose, so the Advance lines table shows it as a fixed label, not a picker.
// const AP_ADVANCE_ACCOUNT_CODE = '1020120000';

// /* ---------- Tailwind class constants (px values: app er --spacing custom, tai arbitrary px) ---------- */
// const ROOT = 'min-h-full bg-apar-bg font-apar text-[14.5px] leading-[1.5] text-apar-ink';
// const WRAP = 'mx-auto max-w-[1360px] px-[16px] pb-[48px] pt-[24px]';
// const TOP = 'mb-[18px] flex flex-wrap items-end justify-between gap-[14px]';
// const H1 = 'text-[24px] font-bold tracking-[-.01em]';
// const PANEL = 'min-w-0 rounded-xl border border-apar-line bg-apar-panel p-[20px]';
// const GRID = 'grid grid-cols-1 items-start gap-[18px] min-[861px]:grid-cols-[1fr_360px]';
// const SEG = 'mb-[18px] grid grid-cols-2 gap-[10px]';
// const SEG_BTN =
//   'cursor-pointer rounded-[10px] border-[1.5px] border-apar-line bg-apar-field px-[14px] py-[12px] text-left text-apar-ink aria-pressed:border-apar-acc aria-pressed:bg-apar-soft';
// const ROW = 'mb-[12px] grid grid-cols-1 gap-[12px]';
// const ROW2 = `${ROW} min-[561px]:grid-cols-2`;
// const ROW3 = `${ROW} min-[561px]:grid-cols-3`;
// const ADDBAR = 'mb-[12px] flex items-center justify-between gap-[10px]';
// const ADDBOX = 'mb-[16px] rounded-[10px] border border-dashed border-apar-acc bg-apar-soft p-[16px]';
// const TBLW = 'mx-[-4px] overflow-x-auto';
// const TABLE = 'w-full min-w-[560px] border-collapse';
// const TABLE_SM = 'w-full min-w-[520px] border-collapse';
// const THB = 'border-b border-apar-line px-[6px] py-[8px] text-[12.5px] font-medium text-apar-mute';
// const TH = `${THB} text-left`;
// const THN = `${THB} text-right`;
// const TDB = 'border-b border-apar-line px-[6px] py-[10px] align-middle';
// const TD = TDB;
// const TDN = `${TDB} text-right`;
// const TD_CR = 'border-b border-apar-line py-[10px] pl-[26px] pr-[6px] align-middle';
// const TD_EMPTY = 'border-b border-apar-line px-0 py-[14px] align-middle text-apar-mute';
// const TF = 'px-[6px] py-[10px] align-middle font-bold';
// const TFN = `${TF} text-right`;
// const NT = 'block text-[12.5px]';
// const TAG = 'inline-block rounded-full bg-apar-soft px-[8px] py-[2px] text-[12px] font-medium';
// const TAG_COLOR = { over: 'text-apar-err', part: 'text-apar-warn', paid: 'text-apar-ok', '': '' };
// const LINE = 'flex justify-between py-[5px]';
// const LINE_BIG = 'mt-[8px] flex justify-between border-t border-apar-line pb-[5px] pt-[12px] text-[17px] font-bold';
// const CHK = 'my-[12px] flex items-center gap-[9px] rounded-[9px] bg-apar-soft px-[12px] py-[11px]';
// const STAT = 'mb-[14px] grid grid-cols-2 gap-[10px]';
// const STAT_BOX = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[10px]';
// const STAT_LABEL = 'block text-[12.5px] text-apar-mute';
// const LI = 'flex justify-between gap-[10px] border-b border-apar-line py-[9px] text-[13.5px]';
// const LI_EMPTY = 'flex justify-between gap-[10px] border-b border-apar-line py-[14px] text-[13.5px] text-apar-mute';
// const LED_SMALL = 'block text-apar-mute';
// const LNX = 'cursor-pointer bg-transparent px-[8px] py-[4px] text-[20px] leading-none text-apar-err';
// const XLINK = 'cursor-pointer bg-transparent p-0 text-[12px] text-apar-err underline';
// const ERR = 'min-h-[20px] text-[13px] text-apar-err';
// const MONO = 'font-apar-mono';

// function Page({ children }) {
//   return (
//     <div className={ROOT}>
//       <div className={WRAP}>{children}</div>
//     </div>
//   );
// }

// function an(list, code) {
//   const f = list.find((a) => a.code === code);
//   return f ? f.name : code;
// }

// export default function VendorPayments() {
//   const [vendors, setVendors] = useState([]);
//   const [coa, setCoa] = useState({ expense: [], invoiceExpense: [], bank: [] });
//   const [venId, setVenId] = useState('');
//   const [cur, setCur] = useState(null);
//   const [mode, setMode] = useState('inv');
//   const [sel, setSel] = useState({});
//   const [useAdv, setUseAdv] = useState(false);
//   const [meth, setMeth] = useState('Bank transfer');
//   const [bankSel, setBankSel] = useState('');
//   const [dt, setDt] = useState(TODAY);
//   const [toast, setToast] = useState('');
//   const [settling, setSettling] = useState(false);

//   // advance mode
//   const [aBank, setABank] = useState('');
//   const [aDt, setADt] = useState(TODAY);
//   const [aMeth, setAMeth] = useState('Bank transfer');
//   const [aRef, setARef] = useState('');
//   const [L, setL] = useState([{ a: '', d: '', n: '' }]);
//   const [aErr, setAErr] = useState('');

//   // add invoice
//   const [addOpen, setAddOpen] = useState(false);
//   const [nNo, setNNo] = useState('');
//   const [nDate, setNDate] = useState(TODAY);
//   const [nDue, setNDue] = useState('');
//   const [nNote, setNNote] = useState('');
//   const [IL, setIL] = useState([{ a: '', d: '', n: '' }]);
//   const [nLink, setNLink] = useState('');
//   const [nApply, setNApply] = useState('');
//   const [touched, setTouched] = useState(false);
//   const [nErr, setNErr] = useState('');

//   // refund modal
//   const [refundAdv, setRefundAdv] = useState(null);
//   const [refAmt, setRefAmt] = useState('');
//   const [refDt, setRefDt] = useState(TODAY);
//   const [refBank, setRefBank] = useState('');
//   const [refMeth, setRefMeth] = useState('Bank transfer');
//   const [refRef, setRefRef] = useState('');
//   const [refNote, setRefNote] = useState('');
//   const [refErr, setRefErr] = useState('');

//   // edit mode: { type: 'ADVANCE' | 'INVOICE' | 'REFUND', id, no, advNo?, applied? }
//   const [editing, setEditing] = useState(null);
//   // advance-only settlement edit (date only): { id, no, date, description, amount, err }
//   const [settleEdit, setSettleEdit] = useState(null);
//   // the advance control account the server really posts to (falls back to the default code)
//   const advCode = coa.advanceAccount?.code || AP_ADVANCE_ACCOUNT_CODE;

//   // read-only transaction details dialog
//   const [viewTx, setViewTx] = useState(null);
//   const [vendorsLoaded, setVendorsLoaded] = useState(false);
//   const [venErr, setVenErr] = useState('');
//   const loadSeq = useRef(0); // only the latest vendor request may update the screen

//   // double-submit guard: one save at a time (a second click/Enter is ignored)
//   const busy = useRef(false);
//   const [saving, setSaving] = useState(false);
//   const guard = (fn) => async (...args) => {
//     if (busy.current) return;
//     busy.current = true;
//     setSaving(true);
//     try { await fn(...args); } finally { busy.current = false; setSaving(false); }
//   };

//   function showToast(t) {
//     setToast(t);
//     clearTimeout(showToast._t);
//     showToast._t = setTimeout(() => setToast(''), 3200);
//   }

//   async function loadVendorList() {
//     const res = await api.get('/ap/vendors');
//     setVendors(res.data);
//     setVendorsLoaded(true);
//   }
//   async function loadVendor(id) {
//     if (!id) return;
//     const seq = ++loadSeq.current;
//     let res;
//     try {
//       res = await api.get(`/ap/vendor/${id}`);
//     } catch (e) {
//       if (seq === loadSeq.current) setVenErr(e.message || 'Failed to load vendor');
//       return;
//     }
//     if (seq !== loadSeq.current) return; // a newer vendor was selected meanwhile
//     if (!res.ok) { setVenErr(res.data?.error || 'Failed to load vendor'); showToast(res.data?.error || 'Failed to load vendor'); return; }
//     setVenErr('');
//     setCur(res.data);
//     setSel({});
//     setAddOpen(false);
//   }

//   useEffect(() => {
//     (async () => {
//       await loadVendorList();
//       const res = await api.get('/ap/coa');
//       setCoa(res.data);
//       if (res.data.bank.length) { setABank(res.data.bank[0].code); setRefBank(res.data.bank[0].code); }
//       setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]);
//       if (res.data.invoiceExpense.length) setIL([{ a: res.data.invoiceExpense[0].code, d: '', n: '' }]);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   // Vendor changed: drop the previous vendor's data and form state, then load the new vendor.
//   useEffect(() => {
//     setCur(null); setVenErr(''); setSel({}); setUseAdv(false); setNLink(''); setNApply(''); setTouched(false);
//     setAddOpen(false); setRefundAdv(null); setViewTx(null); setAErr(''); setNErr(''); setEditing(null);
//     if (venId) loadVendor(venId); else loadSeq.current++;
//   }, [venId]); // eslint-disable-line react-hooks/exhaustive-deps

//   // A focused number input must not change its value on mouse-wheel scroll (500 -> 500.02 bug).
//   useEffect(() => {
//     const h = () => {
//       const a = document.activeElement;
//       if (a && a.tagName === 'INPUT' && a.type === 'number') a.blur();
//     };
//     document.addEventListener('wheel', h, { passive: true });
//     return () => document.removeEventListener('wheel', h);
//   }, []);

//   function bal(i) { return Number(i.balance); }
//   function status(i) {
//     const b = bal(i);
//     if (b <= 0.001) return ['Paid', 'paid'];
//     if (i.due < TODAY) return ['Overdue', 'over'];
//     if (Number(i.advanceAdjusted) + Number(i.paid) > 0) return ['Partial', 'part'];
//     return ['Open', ''];
//   }
//   const outstanding = useMemo(() => (cur ? cur.invoices.reduce((s, i) => s + bal(i), 0) : 0), [cur]);

//   const totals = useMemo(() => {
//     let s = 0; Object.values(sel).forEach((v) => (s += v)); s = round2(s);
//     const a = useAdv && cur ? Math.min(cur.advanceBalance, s) : 0;
//     return { s, a, c: round2(s - a) };
//   }, [sel, useAdv, cur]);

//   function toggleInvoice(inv, checked) {
//     setSel((prev) => {
//       const next = { ...prev };
//       if (checked) next[inv.id] = bal(inv); else delete next[inv.id];
//       return next;
//     });
//   }
//   function setInvoiceAmount(inv, raw) {
//     let v = parseFloat(raw);
//     if (!(v > 0)) v = bal(inv);
//     v = Math.min(v, bal(inv));
//     setSel((prev) => ({ ...prev, [inv.id]: v }));
//   }

//   async function doSettle() {
//     if (totals.s <= 0) return;
//     const applications = Object.keys(sel).map((k) => ({ invoiceId: k, payNow: 0, fromAdvance: 0 }));
//     let leftAdv = totals.a, leftCash = totals.c;
//     for (const a of applications) {
//       const need = sel[a.invoiceId];
//       const fromAdv = Math.min(need, leftAdv); a.fromAdvance = round2(fromAdv); leftAdv = round2(leftAdv - fromAdv);
//       const fromCash = Math.min(need - fromAdv, leftCash); a.payNow = round2(fromCash); leftCash = round2(leftCash - fromCash);
//     }
//     setSettling(true);
//     const res = await api.post('/ap/settle', { supplier_id: cur.id, date: dt || TODAY, method: meth, bank_account_code: bankSel, applications });
//     setSettling(false);
//     if (!res.data.ok) { showToast(res.data.error || 'Settle failed'); return; }
//     setSel({}); setUseAdv(false);
//     await loadVendor(cur.id);
//     showToast(`Settled ${money(totals.s)}: ${money(totals.a)} from advance and ${money(totals.c)} by ${meth.toLowerCase()}.`);
//   }

//   async function cancelInvoice(id) {
//     const res = await api.post('/ap/cancel_invoice', { invoice_id: id });
//     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
//     await loadVendor(cur.id);
//     showToast(`Invoice ${res.data.invoiceNo} cancelled.`);
//   }
//   async function cancelPayment(id) {
//     const res = await api.post('/ap/cancel_payment', { payment_id: id });
//     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
//     await loadVendor(cur.id);
//     showToast(`Payment ${res.data.paymentNo} cancelled and reversed.`);
//   }
//   async function cancelRefund(id) {
//     const res = await api.post('/ap/cancel_refund', { refund_id: id });
//     if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
//     await loadVendor(cur.id);
//     showToast(`Refund ${res.data.refundNo} cancelled and reversed.`);
//   }

//   // ---------------- advance mode ----------------
//   const lineTotal = useMemo(() => round2(L.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [L]);
//   function updateLine(i, k, v) { setL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
//   function addLine() { setL((prev) => [...prev, { a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); }
//   function removeLine(i) { setL((prev) => prev.filter((_, idx) => idx !== i)); }

//   async function recordAdvance() {
//     let badIdx = null;
//     L.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
//     if (badIdx !== null) { setAErr(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }
//     const noDesc = L.findIndex((x) => !x.d.trim());
//     if (noDesc !== -1) { setAErr(`Line ${noDesc + 1} needs a description.`); return; }
//     if (!aBank) { setAErr('Select which account this was paid from.'); return; }
//     setAErr('');
//     const t = lineTotal;

//     if (editing?.type === 'ADVANCE') {
//       const r = await api.post('/ap/update_advance', {
//         advance_id: editing.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
//         lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
//       });
//       if (!r.data.ok) { setAErr(r.data.error || 'Update failed'); return; }
//       const no = editing.no;
//       cancelEdit();
//       await loadVendor(cur.id);
//       showToast(`Advance ${no} updated.`);
//       return;
//     }

//     const res = await api.post('/ap/record_advance', {
//       supplier_id: cur.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
//       lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
//     });
//     if (!res.data.ok) { setAErr(res.data.error || 'Failed to save advance'); return; }
//     setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
//     await loadVendor(cur.id);
//     showToast(`Advance of ${money(t)} posted, credited to ${an(coa.bank, aBank)}.`);
//   }

//   // ---------------- add invoice ----------------
//   const ilTot = useMemo(() => round2(IL.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [IL]);
//   const advSel = useMemo(() => (nLink && cur ? cur.advances.find((x) => String(x.id) === String(nLink)) : null), [nLink, cur]);
//   useEffect(() => {
//     if (!advSel) { setNApply(''); setTouched(false); return; }
//     if (!touched) { const v = Math.min(advSel.balance, ilTot); setNApply(v > 0 ? String(v) : ''); }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [advSel, ilTot]);

//   function updateIL(i, k, v) { setIL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
//   function addIL() { setIL((prev) => [...prev, { a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]); }
//   function removeIL(i) { setIL((prev) => prev.filter((_, idx) => idx !== i)); }

//   function openAddBox(open) {
//     setAddOpen(open); setNErr('');
//     if (open) {
//       setNDate(TODAY);
//       const d = new Date(); d.setDate(d.getDate() + 30);
//       setNDue(d.toISOString().slice(0, 10));
//       setNNo('INV-' + Date.now().toString().slice(-6));
//       setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
//       setTouched(false); setNNote(''); setNLink('');
//     }
//   }

//   async function saveInvoice() {
//     const no = nNo.trim(), e = setNErr;
//     let badIdx = null;
//     IL.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
//     if (!no) { e('Enter an invoice number.'); return; }
//     if (!nNote.trim()) { e('Enter a description.'); return; }
//     if (!nDate || !nDue) { e('Set both the invoice date and the due date.'); return; }
//     if (nDue < nDate) { e("The due date can't be before the invoice date."); return; }
//     if (badIdx !== null) { e(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }

//     // Editing: the advance that was linked at creation keeps its applied amount.
//     if (editing?.type === 'INVOICE') {
//       if (editing.applied > 0 && ilTot + 0.001 < editing.applied) {
//         e(`Invoice total can't be less than the advance already applied (${money(editing.applied)}).`);
//         return;
//       }
//       e('');
//       const r = await api.post('/ap/update_invoice', {
//         invoice_id: editing.id, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
//         lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
//       });
//       if (!r.data.ok) { e(r.data.error || 'Update failed'); return; }
//       const eno = editing.no;
//       setEditing(null);
//       openAddBox(false);
//       await loadVendor(cur.id);
//       showToast(`Invoice ${eno} updated.`);
//       return;
//     }

//     const t = ilTot, a = advSel, ap = a ? round2(parseFloat(nApply) || 0) : 0;
//     if (a && !(ap > 0)) { e(`Enter how much to apply from ${a.no}, or choose no advance link.`); return; }
//     if (a && ap > Math.min(a.balance, t)) { e(`You can apply at most ${money(Math.min(a.balance, t))} from ${a.no} (${money(a.balance)} available, invoice total ${money(t)}).`); return; }
//     e('');

//     const res = await api.post('/ap/save_invoice', {
//       supplier_id: cur.id, invoice_no: no, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
//       lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
//       link_advance_id: a ? a.id : '', apply_amount: a ? ap : 0,
//     });
//     if (!res.data.ok) { e(res.data.error || 'Failed to save invoice'); return; }
//     openAddBox(false);
//     await loadVendor(cur.id);
//     showToast(`Invoice ${no} for ${money(t)} added` + (a ? ` and linked to ${a.no}: ${money(ap)} applied.` : '. Select it to pay.'));
//   }

//   // ---------------- refund ----------------
//   function openRefund(adv) {
//     setRefundAdv(adv);
//     setRefAmt(String(adv.balance)); setRefDt(TODAY); setRefRef(''); setRefNote(''); setRefErr('');
//   }
//   async function confirmRefund() {
//     if (!refundAdv) return;

//     if (editing?.type === 'REFUND') {
//       if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
//       setRefErr('');
//       const r = await api.post('/ap/update_refund', {
//         refund_id: editing.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth,
//         reference_no: refRef.trim(), remarks: refNote.trim(),
//       });
//       if (!r.data.ok) { setRefErr(r.data.error || 'Update failed'); return; }
//       const rn = editing.no;
//       setEditing(null);
//       setRefundAdv(null);
//       await loadVendor(cur.id);
//       showToast(`Refund ${rn} updated.`);
//       return;
//     }

//     const amt = parseFloat(refAmt) || 0;
//     if (!(amt > 0)) { setRefErr('Enter a refund amount greater than zero.'); return; }
//     if (amt > refundAdv.balance + 0.001) { setRefErr(`Refund amount exceeds the available balance of ${money(refundAdv.balance)}.`); return; }
//     if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
//     setRefErr('');
//     const no = refundAdv.no;
//     const res = await api.post('/ap/refund_advance', {
//       advance_id: refundAdv.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth, reference_no: refRef.trim(), amount: amt, remarks: refNote.trim(),
//     });
//     if (!res.data.ok) { setRefErr(res.data.error || 'Refund failed'); return; }
//     setRefundAdv(null);
//     await loadVendor(cur.id);
//     showToast(`Refund of ${money(amt)} recorded for ${no}.`);
//   }
//   function closeRefundModal() {
//     setRefundAdv(null);
//     if (editing?.type === 'REFUND') setEditing(null);
//   }

//   // ---------------- edit (pencil in Recent activity) ----------------
//   async function openEdit(l) {
//     const isSettle = l.sourceType === 'PAYMENT' && Number(l.sourceId) === 0;
//     const res = await api.get(isSettle ? `/ap/edit_data/SETTLEMENT/${l.journalId}` : `/ap/edit_data/${l.sourceType}/${l.sourceId}`);
//     if (!res.ok || !res.data?.ok) { showToast(res.data?.error || 'This record cannot be edited'); return; }
//     const d = res.data;
//     if (d.type === 'SETTLEMENT') {
//       setSettleEdit({ id: d.id, no: d.no, date: d.date, description: d.description, amount: Number(d.amount), err: '' });
//       return;
//     }
//     // advNo / applied: advance that was linked when the invoice was created (read-only while editing)
//     setEditing({ type: d.type, id: d.id, no: d.no, advNo: d.advNo || null, applied: Number(d.advanceApplied || 0) });
//     if (d.type === 'ADVANCE') {
//       setMode('adv'); setAErr('');
//       setABank(d.bank); setADt(d.date); setAMeth(d.method || 'Bank transfer'); setARef(d.ref || '');
//       setL(d.lines.map((x) => ({ a: AP_ADVANCE_ACCOUNT_CODE, d: x.d || '', n: String(x.n) })));
//     } else if (d.type === 'INVOICE') {
//       setMode('inv'); setNErr('');
//       setAddOpen(true);
//       setNNo(d.no); setNDate(d.date); setNDue(d.due || d.date); setNNote(d.note || ''); setNLink(''); setTouched(false);
//       setIL(d.lines.map((x) => ({ a: x.a, d: x.d || '', n: String(x.n) })));
//     } else {
//       setRefundAdv({ id: d.advanceId, no: d.no, balance: d.amount });
//       setRefAmt(String(d.amount)); setRefDt(d.date); setRefBank(d.bank); setRefMeth(d.method || 'Bank transfer');
//       setRefRef(d.ref || ''); setRefNote(d.remarks || ''); setRefErr('');
//     }
//   }
//   function cancelEdit() {
//     setEditing(null); setAddOpen(false); setRefundAdv(null); setAErr(''); setNErr('');
//     setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
//     setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
//   }

//   // ---------------- journal previews ----------------
//   function advanceJournalRows() {
//     const rows = [];
//     L.forEach((x) => { const v = parseFloat(x.n); if (v > 0) rows.push({ label: `${advCode} · Advances to Suppliers`, dr: v, cr: 0 }); });
//     const t = lineTotal;
//     if (t > 0) rows.push({ label: `${aBank} · ${an(coa.bank, aBank)}`, dr: 0, cr: t, isCredit: true });
//     return { rows, total: t };
//   }
//   function invoiceJournalRows() {
//     const rows = []; const t = ilTot;
//     // While editing, the linked advance (if any) comes from the saved record, not from the form.
//     const isEdit = editing?.type === 'INVOICE';
//     const ap = isEdit ? Number(editing.applied || 0) : (parseFloat(nApply) || 0);
//     const linkedNo = isEdit ? editing.advNo : nLink;
//     IL.forEach((x) => { const v = parseFloat(x.n); if (v > 0 && x.a) rows.push({ label: `${x.a} · ${an(coa.invoiceExpense, x.a)}`, dr: v, cr: 0 }); });
//     let total = t;
//     if (t > 0) {
//       rows.push({ label: '3020020000 · Accounts Payable - Trade', dr: 0, cr: t, isCredit: true });
//       if (linkedNo && ap > 0) {
//         total = t + ap;
//         rows.push({ label: '3020020000 · Accounts Payable - Trade (advance applied)', dr: ap, cr: 0 });
//         rows.push({ label: `${advCode} · Advances to Suppliers (${linkedNo})`, dr: 0, cr: ap, isCredit: true });
//       }
//     }
//     return { rows, total };
//   }

//   const [newVendorName, setNewVendorName] = useState('');
//   async function addVendor() {
//     const name = newVendorName.trim();
//     if (!name) return;
//     const res = await api.post('/ap/vendors', { name });
//     if (!res.data.ok) { showToast(res.data.error || 'Failed to add vendor'); return; }
//     setNewVendorName('');
//     await loadVendorList();
//     setVenId(String(res.data.id));
//   }

//   async function saveSettleEdit() {
//     const s = settleEdit;
//     if (!s) return;
//     if (!s.date) { setSettleEdit({ ...s, err: 'Select a date.' }); return; }
//     const r = await api.post('/ap/update_settlement', { journal_id: s.id, date: s.date });
//     if (!r.data.ok) { setSettleEdit({ ...s, err: r.data.error || 'Update failed' }); return; }
//     setSettleEdit(null);
//     await loadVendor(cur.id);
//     showToast(`Settlement ${s.no} updated.`);
//   }

//   // guarded save handlers (function declarations above are hoisted, so this is safe)
//   const onRecordAdvance = guard(recordAdvance);
//   const onSaveInvoice = guard(saveInvoice);
//   const onConfirmRefund = guard(confirmRefund);
//   const onSaveSettleEdit = guard(saveSettleEdit);

//   if (!cur) {
//     return (
//       <Page>
//         <div className={TOP}>
//           <div>
//             <h1 className={H1}>Vendor payments</h1>
//             <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
//           </div>
//           <div className="flex items-end gap-[10px]">
//             {vendors.length > 0 && (
//               <div className="min-w-[240px]">
//                 <label className="apar-label">Vendor</label>
//                 <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
//                   <option value="">Select vendor</option>
//                   {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
//                 </select>
//               </div>
//             )}
//             <PageGuideSheet guide={vendorPaymentsGuide} />
//           </div>
//         </div>

//         {venErr && venId ? (
//           <div className={PANEL}><div className={ERR} role="alert">{venErr}</div></div>
//         ) : !vendorsLoaded || venId ? (
//           <div className={PANEL}><div className="py-[24px] text-center text-apar-mute">Loading...</div></div>
//         ) : vendors.length > 0 ? (
//           <div className={PANEL}>
//             <h2 className="apar-h2">Select a vendor</h2>
//             <div className="text-apar-mute">Choose a vendor from the list above to see invoices, advances, and payments.</div>
//           </div>
//         ) : (
//           <div className={PANEL}>
//             <h2 className="apar-h2">No vendors yet</h2>
//             <div className={`${ROW2} items-end`}>
//               <div>
//                 <label className="apar-label">Vendor name</label>
//                 <input className="apar-input" value={newVendorName} onChange={(e) => setNewVendorName(e.target.value)} placeholder="e.g. Acme Supplies Ltd." />
//               </div>
//               <div><button className="apar-btn w-full" onClick={addVendor}>Add vendor</button></div>
//             </div>
//           </div>
//         )}
//       </Page>
//     );
//   }

//   const open = cur.invoices.filter((i) => bal(i) > 0.001);
//   const advJrn = advanceJournalRows();
//   const invJrn = invoiceJournalRows();

//   return (
//     <Page>
//       <div className={TOP}>
//         <div>
//           <h1 className={H1}>Vendor payments</h1>
//           <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
//         </div>
//         <div className="flex items-end gap-[10px]">
//           <div className="min-w-[240px]">
//             <label className="apar-label">Vendor</label>
//             <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
//               {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
//             </select>
//           </div>
//           <PageGuideSheet guide={vendorPaymentsGuide} />
//         </div>
//       </div>

//       <div className={GRID}>
//         <main className={PANEL}>
//           <div className={SEG} role="group" aria-label="Payment type">
//             <button type="button" className={SEG_BTN} aria-pressed={mode === 'inv'} onClick={() => setMode('inv')}>
//               <b className="block">Pay against invoices</b>
//               <span className="text-[13px] text-apar-mute">Choose payable invoices and settle them</span>
//             </button>
//             <button type="button" className={SEG_BTN} aria-pressed={mode === 'adv'} onClick={() => setMode('adv')}>
//               <b className="block">Advance to vendor</b>
//               <span className="text-[13px] text-apar-mute">Individual payment with no invoice yet</span>
//             </button>
//           </div>

//           {mode === 'inv' && (
//             <section>
//               <div className={ADDBAR}>
//                 <b className="text-[15px]">Payable invoices</b>
//                 <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(!addOpen))}>Add payable invoice</button>
//               </div>

//               {addOpen && (
//                 <div className={ADDBOX}>
//                   {editing?.type === 'INVOICE' && (
//                     <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing invoice {editing.no}</div>
//                   )}
//                   {editing?.type === 'INVOICE' && editing.advNo && (
//                     <div className="mb-[12px] text-[13px] text-apar-mute">
//                       Advance {editing.advNo} ({money(editing.applied)}) is linked to this invoice. The applied amount stays the same.
//                     </div>
//                   )}
//                   <div className={ROW3}>
//                     <div><label className="apar-label">Invoice number</label><input className={`apar-input ${MONO}`} value={nNo} disabled={!!editing} onChange={(e) => setNNo(e.target.value)} placeholder="INV-2100" /></div>
//                     <div><label className="apar-label">Invoice date</label><input className="apar-input" type="date" value={nDate} onChange={(e) => setNDate(e.target.value)} /></div>
//                     <div><label className="apar-label">Due date</label><input className="apar-input" type="date" value={nDue} onChange={(e) => setNDue(e.target.value)} /></div>
//                   </div>
//                   <div className={ROW}>
//                     <div><label className="apar-label">Description <span className="text-apar-err">*</span></label><input className="apar-input" required value={nNote} onChange={(e) => setNNote(e.target.value)} placeholder="e.g. October packaging supplies" /></div>
//                   </div>

//                   <div className={ADDBAR}>
//                     <b className="text-[15px]">Invoice lines</b>
//                     <button type="button" className="apar-ghost" onClick={addIL}>Add line</button>
//                   </div>
//                   <div className={TBLW}>
//                     <table className={TABLE_SM}>
//                       <thead>
//                         <tr>
//                           <th className={`${TH} w-[48%]`}>Account</th>
//                           <th className={TH}>Description</th>
//                           <th className={`${THN} w-[120px]`}>Amount</th>
//                           <th className={`${TH} w-[36px]`}></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {IL.map((x, i) => (
//                           <tr key={i}>
//                             <td className={TD}><AccountPicker options={coa.invoiceExpense} value={x.a} onChange={(code) => updateIL(i, 'a', code)} /></td>
//                             <td className={TD}><input className="apar-input" value={x.d} onChange={(e) => updateIL(i, 'd', e.target.value)} placeholder="Optional. Defaults to the description above" /></td>
//                             <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateIL(i, 'n', e.target.value)} placeholder="0.00" /></td>
//                             <td className={TD}>{IL.length > 1 && <button type="button" className={LNX} onClick={() => removeIL(i)}>&times;</button>}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                       <tfoot>
//                         <tr>
//                           <td colSpan={2} className={TFN}>Invoice total</td>
//                           <td className={`${TFN} ${MONO}`}>{money(ilTot)}</td>
//                           <td></td>
//                         </tr>
//                       </tfoot>
//                     </table>
//                   </div>

//                   <div className={`${ROW2} mt-[14px]`}>
//                     <div>
//                       <label className="apar-label">Link advance payment</label>
//                       <select className="apar-select" value={nLink} onChange={(e) => { setNLink(e.target.value); setTouched(false); }} disabled={!!editing || !cur.advances.some((a) => a.balance > 0)}>
//                         <option value="">{cur.advances.some((a) => a.balance > 0) ? 'No advance link' : 'No open advance for this vendor'}</option>
//                         {cur.advances.filter((a) => a.balance > 0).map((a) => <option key={a.id} value={a.id}>{a.no} · {money(a.balance)} available ({a.date})</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="apar-label">Apply from advance</label>
//                       <input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={nApply} disabled={!advSel || !!editing} onChange={(e) => { setTouched(true); setNApply(e.target.value); }} placeholder="0.00" />
//                     </div>
//                   </div>

//                   <h2 className="apar-h2">Journal entry preview</h2>
//                   <div className={TBLW}>
//                     <table className={TABLE_SM}>
//                       <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
//                       <tbody>
//                         {invJrn.rows.length ? invJrn.rows.map((r, i) => (
//                           <tr key={i}>
//                             <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
//                             <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
//                             <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
//                           </tr>
//                         )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
//                         {invJrn.total > 0 && (
//                           <tr className="font-bold">
//                             <td className={TD}>Total</td>
//                             <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
//                             <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>

//                   <div className={ERR} role="alert">{nErr}</div>
//                   <div className="flex gap-[10px]">
//                     <button type="button" className="apar-btn" disabled={saving} onClick={onSaveInvoice}>{editing?.type === 'INVOICE' ? 'Save changes' : 'Save invoice'}</button>
//                     <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(false))}>Cancel</button>
//                   </div>
//                 </div>
//               )}

//               <div className={TBLW}>
//                 <table className={TABLE}>
//                   <thead>
//                     <tr>
//                       <th className={TH}></th>
//                       <th className={TH}>Invoice</th>
//                       <th className={TH}>Due</th>
//                       <th className={TH}>Status</th>
//                       <th className={THN}>Balance</th>
//                       <th className={THN}>Pay now</th>
//                       <th className={TH}></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cur.invoices.map((i) => {
//                       const b = bal(i), st = status(i), on = sel[i.id] !== undefined;
//                       const canCancel = Number(i.paid) <= 0.001;
//                       return (
//                         <tr key={i.id}>
//                           <td className={TD}><input type="checkbox" disabled={b <= 0.001} checked={on} onChange={(e) => toggleInvoice(i, e.target.checked)} /></td>
//                           <td className={TD}>
//                             <span className={MONO}>{i.no}</span>
//                             {i.note && <small className={`${NT} text-apar-mute`}>{i.note}</small>}
//                             {i.links?.length > 0 && <small className={`${NT} text-apar-ok`}>Linked to {i.links.map((l) => `${l.advNo} (${money(l.amt)})`).join(', ')}</small>}
//                           </td>
//                           <td className={TD}>{i.due}</td>
//                           <td className={TD}><span className={`${TAG} ${TAG_COLOR[st[1]]}`}>{st[0]}</span></td>
//                           <td className={`${TDN} ${MONO}`}>{money(b)}</td>
//                           <td className={TDN}>
//                             <input className={`apar-input w-[104px] text-right ${MONO}`} type="number" min="0" max={b} step="0.01" disabled={!on} value={on ? sel[i.id] : ''} onChange={(e) => on && setInvoiceAmount(i, e.target.value)} />
//                           </td>
//                           <td className={TD}>
//                             <div className="flex items-center justify-end gap-[8px]">
//                               <AttachmentsButton entityType="AP_INVOICE" entityId={i.id} />
//                               {canCancel && <button type="button" className={XLINK} onClick={() => cancelInvoice(i.id)}>Cancel</button>}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                     {!open.length && <tr><td colSpan={7} className={TD_EMPTY}>All invoices for this vendor are paid.</td></tr>}
//                   </tbody>
//                 </table>
//               </div>

//               <div className={CHK}>
//                 <input className="h-[17px] w-[17px] accent-apar-acc" type="checkbox" id="useAdv" checked={useAdv} disabled={cur.advanceBalance <= 0} onChange={(e) => setUseAdv(e.target.checked)} />
//                 <label htmlFor="useAdv">{cur.advanceBalance > 0 ? `Apply advance balance (${money(cur.advanceBalance)} available)` : 'No advance balance available'}</label>
//               </div>

//               <div className={ROW2}>
//                 <div>
//                   <label className="apar-label">Method</label>
//                   <select className="apar-select" value={meth} onChange={(e) => setMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
//                 </div>
//                 <div>
//                   <label className="apar-label">Paid from account</label>
//                   <select className="apar-select" value={bankSel} onChange={(e) => setBankSel(e.target.value)}>
//                     <option value="">Not needed if fully from advance</option>
//                     {coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}
//                   </select>
//                 </div>
//               </div>
//               <div className={ROW2}>
//                 <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={dt} onChange={(e) => setDt(e.target.value)} /></div>
//                 <div></div>
//               </div>

//               <div className="ml-auto max-w-[380px]">
//                 <div className={LINE}><span>Selected invoices</span><span className={MONO}>{money(totals.s)}</span></div>
//                 <div className={LINE}><span>Advance applied</span><span className={`${MONO} text-apar-ok`}>-{money(totals.a)}</span></div>
//                 <div className={LINE_BIG}><span>Cash to pay</span><span className={MONO}>{money(totals.c)}</span></div>
//                 <button className="apar-btn mt-[6px] w-full" disabled={totals.s <= 0 || settling} onClick={doSettle}>Settle selected invoices</button>
//               </div>
//             </section>
//           )}

//           {mode === 'adv' && (
//             <section>
//               {editing?.type === 'ADVANCE' && (
//                 <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing advance {editing.no}</div>
//               )}
//               <div className={ROW2}>
//                 <div>
//                   <label className="apar-label">Paid from account</label>
//                   <select className="apar-select" value={aBank} onChange={(e) => setABank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
//                 </div>
//                 <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={aDt} onChange={(e) => setADt(e.target.value)} /></div>
//               </div>
//               <div className={ROW2}>
//                 <div>
//                   <label className="apar-label">Method</label>
//                   <select className="apar-select" value={aMeth} onChange={(e) => setAMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
//                 </div>
//                 <div><label className="apar-label">Reference</label><input className="apar-input" value={aRef} onChange={(e) => setARef(e.target.value)} placeholder="PO number or note" /></div>
//               </div>

//               <div className={`${ADDBAR} mt-[4px]`}>
//                 <b className="text-[15px]">Advance lines</b>
//                 <button type="button" className="apar-ghost" onClick={addLine}>Add line</button>
//               </div>
//               <div className={TBLW}>
//                 <table className={TABLE_SM}>
//                   <thead>
//                     <tr>
//                       <th className={`${TH} w-[38%]`}>Account</th>
//                       <th className={TH}>Description <span className="text-apar-err">*</span></th>
//                       <th className={`${THN} w-[120px]`}>Amount</th>
//                       <th className={`${TH} w-[36px]`}></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {L.map((x, i) => (
//                       <tr key={i}>
//                         <td className={`${TD} ${MONO} text-apar-mute`}>{advCode} · {coa.advanceAccount?.name || 'Advances to Suppliers'}</td>
//                         <td className={TD}><input className="apar-input" required value={x.d} onChange={(e) => updateLine(i, 'd', e.target.value)} placeholder="What is this advance for?" /></td>
//                         <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateLine(i, 'n', e.target.value)} placeholder="0.00" /></td>
//                         <td className={TD}>{L.length > 1 && <button type="button" className={LNX} onClick={() => removeLine(i)}>&times;</button>}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr>
//                       <td colSpan={2} className={TFN}>Total advance</td>
//                       <td className={`${TFN} ${MONO}`}>{money(lineTotal)}</td>
//                       <td></td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <h2 className="apar-h2 mt-[18px]">Journal entry preview</h2>
//               <div className={TBLW}>
//                 <table className={TABLE_SM}>
//                   <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
//                   <tbody>
//                     {advJrn.total > 0 ? advJrn.rows.map((r, i) => (
//                       <tr key={i}>
//                         <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
//                         <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
//                         <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
//                       </tr>
//                     )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
//                     {advJrn.total > 0 && (
//                       <tr className="font-bold">
//                         <td className={TD}>Total</td>
//                         <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
//                         <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               <div className={ERR} role="alert">{aErr}</div>
//               <button className="apar-btn mt-[6px] w-full" disabled={saving} onClick={onRecordAdvance}>{editing?.type === 'ADVANCE' ? 'Save changes' : 'Record advance'}</button>
//               {editing?.type === 'ADVANCE' && (
//                 <button type="button" className="apar-ghost mt-[6px] w-full" onClick={cancelEdit}>Cancel edit</button>
//               )}
//               <p className="mt-[12px] text-[13px] text-apar-mute">The advance is held as a vendor balance. Switch to "Pay against invoices" to apply it when an invoice arrives.</p>
//             </section>
//           )}
//         </main>

//         <aside className={PANEL}>
//           <h2 className="apar-h2">{cur.name}</h2>
//           <div className={STAT}>
//             <div className={STAT_BOX}><span className={STAT_LABEL}>Outstanding</span><b className={`text-[18px] ${MONO}`}>{money(outstanding)}</b></div>
//             <div className={STAT_BOX}><span className={STAT_LABEL}>Advance balance</span><b className={`text-[18px] ${MONO} text-apar-ok`}>{money(cur.advanceBalance)}</b></div>
//           </div>

//           <h2 className="apar-h2">Advance payments</h2>
//           <ul>
//             {cur.advances.length ? cur.advances.map((a) => {
//               const appliedTo = [];
//               cur.invoices.forEach((i) => (i.links || []).forEach((l) => { if (l.advNo === a.no) appliedTo.push(`${i.no} ${money(l.amt)}`); }));
//               const canRefund = a.balance > 0.001 && a.status !== 'Cancelled';
//               return (
//                 <li key={a.id} className={LI}>
//                   <span>{a.no}<small className={LED_SMALL}>{a.date} {appliedTo.length ? `· applied to ${appliedTo.join(', ')}` : '· not yet applied'}</small></span>
//                   <b className={`${MONO} text-apar-ok`}>{money(a.balance)} {canRefund && <button type="button" className={XLINK} onClick={() => openRefund(a)}>Refund</button>}</b>
//                 </li>
//               );
//             }) : <li className={LI_EMPTY}>No advances yet.</li>}
//           </ul>

//           <h2 className="apar-h2 mt-[18px]">Payments</h2>
//           <ul>
//             {cur.payments?.length ? cur.payments.map((p) => {
//               const cancelled = p.status === 'Cancelled';
//               return (
//                 <li key={p.id} className={LI}>
//                   <span>{p.no}<small className={LED_SMALL}>{p.date}{cancelled ? ' · cancelled' : ''}</small>{p.note && <small className={LED_SMALL}>{p.note}</small>}</span>
//                   <b className={`flex items-center gap-[8px] ${MONO}`}>
//                     <AttachmentsButton entityType="AP_PAYMENT" entityId={p.id} />
//                     {money(p.total)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelPayment(p.id)}>Cancel</button>}
//                   </b>
//                 </li>
//               );
//             }) : <li className={LI_EMPTY}>No payments yet.</li>}
//           </ul>

//           <h2 className="apar-h2 mt-[18px]">Refunds</h2>
//           <ul>
//             {cur.refunds?.length ? cur.refunds.map((r) => {
//               const cancelled = r.status === 'Cancelled';
//               return (
//                 <li key={r.id} className={LI}>
//                   <span>{r.no}<small className={LED_SMALL}>{r.date} · {r.advNo}{cancelled ? ' · cancelled' : ''}</small></span>
//                   <b className={MONO}>{money(r.amount)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelRefund(r.id)}>Cancel</button>}</b>
//                 </li>
//               );
//             }) : <li className={LI_EMPTY}>No refunds yet.</li>}
//           </ul>

//           <h2 className="apar-h2 mt-[18px]">Recent activity</h2>
//           <ul>
//             {cur.ledger.length ? cur.ledger.map((l, i) => (
//               <li key={l.journalId || i} className={LI}>
//                 <span>{l.description}<small className={LED_SMALL}>{l.date}</small></span>
//                 <b className={`flex items-center gap-[8px] ${MONO} ${l.positive ? 'text-apar-ok' : 'text-apar-err'}`}>
//                   {l.editable && l.sourceType === 'ADVANCE' && (
//                     <button
//                       type="button"
//                       title="Edit"
//                       aria-label="Edit"
//                       className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
//                       onClick={() => openEdit(l)}
//                     >
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
//                       </svg>
//                     </button>
//                   )}
//                   <button
//                     type="button"
//                     title="View details"
//                     aria-label="View details"
//                     className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
//                     onClick={() => setViewTx({ sourceType: l.sourceType, sourceId: l.sourceId, journalId: Number(l.sourceId) === 0 || l.sourceType === 'INVOICE' ? l.journalId : 0 })}
//                   >
//                     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
//                     </svg>
//                   </button>
//                   <span>{l.positive ? '+' : '-'}{money(l.amount)}</span>
//                 </b>
//               </li>
//             )) : <li className={LI_EMPTY}>No activity yet.</li>}
//           </ul>
//         </aside>
//       </div>

//       {toast && (
//         <div className="fixed bottom-[20px] left-1/2 z-[130] max-w-[92%] -translate-x-1/2 rounded-[9px] bg-apar-ink px-[18px] py-[11px] text-apar-bg" role="status">
//           {toast}
//         </div>
//       )}

//       {refundAdv && (
//         <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && closeRefundModal()}>
//           <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
//             <h2 className="apar-h2">{editing?.type === 'REFUND' ? 'Edit refund' : 'Refund advance'} <span className={MONO}>{refundAdv.no}</span></h2>
//             <div className="mb-[12px] text-[13px] text-apar-mute">{editing?.type === 'REFUND' ? 'Refund amount' : 'Available to refund'}: <b className={MONO}>{money(refundAdv.balance)}</b></div>
//             <div className={ROW2}>
//               <div><label className="apar-label">Refund amount</label><input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={refAmt} disabled={editing?.type === 'REFUND'} onChange={(e) => setRefAmt(e.target.value)} /></div>
//               <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={refDt} onChange={(e) => setRefDt(e.target.value)} /></div>
//             </div>
//             <div className={ROW2}>
//               <div>
//                 <label className="apar-label">Refund to account</label>
//                 <select className="apar-select" value={refBank} onChange={(e) => setRefBank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
//               </div>
//               <div>
//                 <label className="apar-label">Method</label>
//                 <select className="apar-select" value={refMeth} onChange={(e) => setRefMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
//               </div>
//             </div>
//             <div className={ROW}><div><label className="apar-label">Reference</label><input className="apar-input" value={refRef} onChange={(e) => setRefRef(e.target.value)} placeholder="Optional" /></div></div>
//             <div className={ROW}><div><label className="apar-label">Remarks</label><input className="apar-input" value={refNote} onChange={(e) => setRefNote(e.target.value)} placeholder="Optional" /></div></div>
//             <div className={ERR} role="alert">{refErr}</div>
//             <div className="flex gap-[10px]">
//               <button type="button" className="apar-btn" disabled={saving} onClick={onConfirmRefund}>{editing?.type === 'REFUND' ? 'Save changes' : 'Confirm refund'}</button>
//               <button type="button" className="apar-ghost" onClick={closeRefundModal}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {settleEdit && (
//         <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && setSettleEdit(null)}>
//           <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
//             <h2 className="apar-h2">Edit settlement <span className={MONO}>{settleEdit.no}</span></h2>
//             <div className="mb-[12px] text-[13px] text-apar-mute">{settleEdit.description}</div>
//             <div className={ROW2}>
//               <div><label className="apar-label">Amount</label><div className={`rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px] ${MONO}`}>{money(settleEdit.amount)}</div></div>
//               <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={settleEdit.date} onChange={(e) => setSettleEdit({ ...settleEdit, date: e.target.value, err: '' })} /></div>
//             </div>
//             <div className="mb-[12px] text-[12.5px] text-apar-mute">Only the date can be changed for a settlement paid fully from an advance.</div>
//             <div className={ERR} role="alert">{settleEdit.err}</div>
//             <div className="flex gap-[10px]">
//               <button type="button" className="apar-btn" disabled={saving} onClick={onSaveSettleEdit}>Save changes</button>
//               <button type="button" className="apar-ghost" onClick={() => setSettleEdit(null)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {viewTx && <TransactionDialog tx={viewTx} onClose={() => setViewTx(null)} />}
//     </Page>
//   );
// }

// /* ---------- read-only transaction details (view / print / excel) ---------- */
// function csvCell(v) {
//   const s = v === null || v === undefined ? '' : String(v);
//   return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
// }

// function downloadCsv(d) {
//   const rows = [];
//   const add = (...cells) => rows.push(cells.map(csvCell).join(','));
//   add('Farm Welfare Agro Limited');
//   add(d.title);
//   add('Vendor', d.supplierName);
//   add('Date', d.date);
//   add('Status', d.cancelled ? 'Cancelled' : d.status);
//   add('GL', d.glPosted ? 'Posted' : 'Not posted');
//   if (d.note) add('Note', d.note);
//   (d.fields || []).forEach((f) => add(f.label, f.value));
//   add();
//   if (d.summary.length) {
//     add('Summary');
//     d.summary.forEach((s) => add(s.label, s.money ? Number(s.value || 0) : s.value));
//     add();
//   }
//   d.sections.forEach((sec) => {
//     add(sec.title);
//     add(...sec.columns.map((c) => c.label));
//     sec.rows.forEach((r) => add(...sec.columns.map((c) => (c.money ? Number(r[c.key] || 0) : r[c.key] ?? ''))));
//     if (sec.footer) add(...sec.columns.map((c, i) => (i === sec.columns.length - 1 ? Number(sec.footer.value || 0) : i === sec.columns.length - 2 ? sec.footer.label : '')));
//     add();
//   });
//   add('Journal entries');
//   add('Journal no', 'Date', 'Type', 'Description', 'Account', 'Account name', 'Debit', 'Credit');
//   d.journal.entries.forEach((e) => {
//     e.lines.forEach((l) => add(e.journalNo, e.date, e.kind, e.description, l.account, l.accountName, l.debit || '', l.credit || ''));
//   });
//   add('', '', '', '', '', 'Total', d.journal.totalDebit, d.journal.totalCredit);

//   const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `${d.title.replace(/[^\w.-]+/g, '_')}.csv`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// }

// function TransactionDialog({ tx, onClose }) {
//   const [st, setSt] = useState({ loading: true, error: '', data: null });

//   useEffect(() => {
//     let off = false;
//     (async () => {
//       setSt({ loading: true, error: '', data: null });
//       try {
//         const q = tx.journalId ? `?journalId=${tx.journalId}` : '';
//         const res = await api.get(`/ap/transaction/${tx.sourceType}/${tx.sourceId}${q}`);
//         if (off) return;
//         if (!res.ok) { setSt({ loading: false, error: res.data?.error || 'Failed to load details', data: null }); return; }
//         setSt({ loading: false, error: '', data: res.data });
//       } catch (e) {
//         if (!off) setSt({ loading: false, error: e.message || 'Failed to load details', data: null });
//       }
//     })();
//     return () => { off = true; };
//   }, [tx]);

//   useEffect(() => {
//     const h = (e) => e.key === 'Escape' && onClose();
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [onClose]);

//   const d = st.data;
//   const cell = (c, row) => (c.money ? money(Number(row[c.key] || 0)) : row[c.key] ?? '');

//   const secs = (list) => list.map((sec) => (
//     <div key={sec.title} className="mb-[16px]">
//       <h3 className="mb-[6px] text-[14px] font-bold">{sec.title}</h3>
//       <div className={TBLW}>
//         <table className={TABLE_SM}>
//           <thead><tr>{sec.columns.map((c) => <th key={c.key} className={c.money ? THN : TH}>{c.label}</th>)}</tr></thead>
//           <tbody>
//             {sec.rows.map((row, i) => (
//               <tr key={i}>{sec.columns.map((c) => <td key={c.key} className={c.money ? `${TDN} ${MONO}` : TD}>{cell(c, row)}</td>)}</tr>
//             ))}
//           </tbody>
//           {sec.footer && (
//             <tfoot>
//               <tr>
//                 <td colSpan={sec.columns.length - 1} className={TFN}>{sec.footer.label}</td>
//                 <td className={`${TFN} ${MONO}`}>{money(Number(sec.footer.value || 0))}</td>
//               </tr>
//             </tfoot>
//           )}
//         </table>
//       </div>
//     </div>
//   ));

//   const journalBlock = d && (
//     <div className="mb-[6px]">
//       <h3 className="mb-[6px] text-[14px] font-bold">Journal entries</h3>
//       {d.journal.entries.length === 0 && <div className="text-apar-mute">No journal found.</div>}
//       {d.journal.entries.map((e) => {
//         const dr = e.lines.reduce((t, l) => t + (l.debit || 0), 0), cr = e.lines.reduce((t, l) => t + (l.credit || 0), 0);
//         return (
//           <div key={e.journalId} className="mb-[12px]">
//             <div className="flex flex-wrap items-center gap-[8px] text-[13px]">
//               <span className={MONO}>{e.journalNo}</span>
//               <span className="text-apar-mute">{e.date}</span>
//               <span className={`${TAG} ${e.kind === 'Reversal' ? 'text-apar-err' : ''}`}>{e.kind}</span>
//               <span>{e.description}</span>
//             </div>
//             <div className={TBLW}>
//               <table className={TABLE_SM}>
//                 <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
//                 <tbody>
//                   {e.lines.map((l, i) => (
//                     <tr key={i}>
//                       <td className={l.credit > 0 ? TD_CR : TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}{l.derived ? ' *' : ''}</td>
//                       <td className={`${TDN} ${MONO}`}>{l.debit ? money(l.debit) : ''}</td>
//                       <td className={`${TDN} ${MONO}`}>{l.credit ? money(l.credit) : ''}</td>
//                     </tr>
//                   ))}
//                   <tr className="font-bold">
//                     <td className={TD}>Total</td>
//                     <td className={`${TDN} ${MONO}`}>{money(dr)}</td>
//                     <td className={`${TDN} ${MONO}`}>{money(cr)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//             {e.derived && <div className="text-[12px] text-apar-mute">* Not saved in the journal lines of this older record. Shown from the journal total so the entry balances.</div>}
//           </div>
//         );
//       })}
//     </div>
//   );

//   return (
//     <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
//       <style>{`
//         .tx-only-print{display:none}
//         @media print{
//           @page{margin:14mm}
//           body *{visibility:hidden}
//           #tx-print,#tx-print *{visibility:visible}
//           #tx-print{position:absolute;left:0;top:0;width:100%;max-height:none!important;overflow:visible!important;border:0!important;background:#fff!important;color:#000!important;padding:0!important}
//           #tx-print .no-print{display:none!important}
//           #tx-print .tx-only-print{display:block}
//           #tx-print table{page-break-inside:auto}
//           #tx-print tr{page-break-inside:avoid}
//         }
//       `}</style>
//       <div id="tx-print" className="max-h-[90vh] w-full max-w-[820px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
//         <div className="tx-only-print mb-[10px] border-b border-apar-line pb-[8px]">
//           <div className="text-[16px] font-bold">Farm Welfare Agro Limited</div>
//           <div className="text-[12px]">Vendor payments · printed {new Date().toISOString().slice(0, 10)}</div>
//         </div>

//         <div className="mb-[14px] flex items-start justify-between gap-[10px]">
//           <div>
//             <h2 className="apar-h2">{d ? d.title : 'Details'}</h2>
//             {d && <div className="text-[13px] text-apar-mute">{d.supplierName}{d.date ? ` · ${d.date}` : ''}</div>}
//           </div>
//           <div className="flex flex-wrap items-center justify-end gap-[8px]">
//             {d?.status && <span className={`${TAG} ${d.cancelled ? 'text-apar-err' : ''}`}>{d.cancelled ? 'Cancelled' : d.status}</span>}
//             {d && <span className={`${TAG} ${d.glPosted ? 'text-apar-ok' : 'text-apar-warn'}`}>{d.glPosted ? 'GL posted' : 'GL not posted'}</span>}
//             <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => window.print()}>Print</button>
//             <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => downloadCsv(d)}>Excel</button>
//             <button type="button" className="apar-ghost no-print" onClick={onClose}>Close</button>
//           </div>
//         </div>

//         {st.loading && <div className="py-[24px] text-center text-apar-mute">Loading...</div>}
//         {st.error && <div className={ERR} role="alert">{st.error}</div>}

//         {d && d.invoiceForm && <InvoiceFormView f={d.invoiceForm} />}

//         {d && !d.invoiceForm && (
//           <>
//             {d.note && <div className="mb-[12px] rounded-[9px] bg-apar-soft px-[12px] py-[10px] text-[13px]">{d.note}</div>}

//             {d.fields && (
//               <div className={ROW2}>
//                 {d.fields.map((f) => (
//                   <div key={f.label}>
//                     <label className="apar-label">{f.label}</label>
//                     <div className="rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]">{f.value}</div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {d.fields && secs(d.sections.filter((x) => x.title === 'Advance lines'))}

//             {journalBlock}

//             {!d.fields && d.summary.length > 0 && (
//               <div className="mb-[16px] mt-[16px] grid grid-cols-1 gap-x-[20px] gap-y-[8px] min-[561px]:grid-cols-2">
//                 {d.summary.map((s) => (
//                   <div key={s.label} className="flex justify-between gap-[10px] border-b border-apar-line py-[6px] text-[13.5px]">
//                     <span className="text-apar-mute">{s.label}</span>
//                     <b className={s.money ? MONO : ''}>{s.money ? money(Number(s.value || 0)) : s.value}</b>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {!d.fields && secs(d.sections)}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------- read-only copy of the invoice entry form (shown in the eye-icon report of an invoice) ---------- */
// function InvoiceFormView({ f }) {
//   const RO = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]';
//   return (
//     <div>
//       <div className={ROW3}>
//         <div><label className="apar-label">Invoice number</label><div className={`${RO} ${MONO}`}>{f.no}</div></div>
//         <div><label className="apar-label">Invoice date</label><div className={RO}>{f.date || '-'}</div></div>
//         <div><label className="apar-label">Due date</label><div className={RO}>{f.due || '-'}</div></div>
//       </div>
//       <div className={ROW}>
//         <div><label className="apar-label">Description</label><div className={RO}>{f.note || '-'}</div></div>
//       </div>

//       <b className="mb-[8px] block text-[15px]">Invoice lines</b>
//       <div className={TBLW}>
//         <table className={TABLE_SM}>
//           <thead>
//             <tr>
//               <th className={`${TH} w-[48%]`}>Account</th>
//               <th className={TH}>Description</th>
//               <th className={`${THN} w-[120px]`}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {f.lines.map((l, i) => (
//               <tr key={i}>
//                 <td className={TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}</td>
//                 <td className={TD}>{l.desc}</td>
//                 <td className={`${TDN} ${MONO}`}>{money(l.amount)}</td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr>
//               <td colSpan={2} className={TFN}>Invoice total</td>
//               <td className={`${TFN} ${MONO}`}>{money(f.total)}</td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>

//       <div className={`${ROW2} mt-[14px]`}>
//         <div><label className="apar-label">Link advance payment</label><div className={RO}>{f.advance ? f.advance.no : 'No advance link'}</div></div>
//         <div><label className="apar-label">Apply from advance</label><div className={`${RO} ${MONO}`}>{f.advance ? money(f.advance.applied) : '-'}</div></div>
//       </div>

//       <h2 className="apar-h2">Journal entry preview</h2>
//       <div className={TBLW}>
//         <table className={TABLE_SM}>
//           <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
//           <tbody>
//             {f.preview.rows.map((r, i) => (
//               <tr key={i}>
//                 <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
//                 <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
//                 <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
//               </tr>
//             ))}
//             <tr className="font-bold">
//               <td className={TD}>Total</td>
//               <td className={`${TDN} ${MONO}`}>{money(f.preview.total)}</td>
//               <td className={`${TDN} ${MONO}`}>{money(f.preview.total)}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from 'react';
import { api, money, round2 } from '../api';
import AccountPicker from '../components/AccountPicker.jsx';
import AttachmentsButton from '../components/AttachmentsButton.jsx';
import { PageGuideSheet } from '../vendor-guide/page-guide-sheet';
import { vendorPaymentsGuide } from '../vendor-guide/vendor-payment-guide';

const TODAY = new Date().toISOString().slice(0, 10);
const METHODS = ['Bank transfer', 'Cheque', 'Cash', 'Card'];
// Advance lines always post to this one fixed control account — see
// record_advance on the server for the full rationale. There's nothing to
// choose, so the Advance lines table shows it as a fixed label, not a picker.
const AP_ADVANCE_ACCOUNT_CODE = '1020120000';

/* ---------- Tailwind class constants (px values: app er --spacing custom, tai arbitrary px) ---------- */
const ROOT = 'min-h-full bg-apar-bg font-apar text-[14.5px] leading-[1.5] text-apar-ink';
const WRAP = 'mx-auto max-w-[1360px] px-[16px] pb-[48px] pt-[24px]';
const TOP = 'mb-[18px] flex flex-wrap items-end justify-between gap-[14px]';
const H1 = 'text-[24px] font-bold tracking-[-.01em]';
const PANEL = 'min-w-0 rounded-xl border border-apar-line bg-apar-panel p-[20px]';
const GRID = 'grid grid-cols-1 items-start gap-[18px] min-[861px]:grid-cols-[1fr_360px]';
const SEG = 'mb-[18px] grid grid-cols-2 gap-[10px]';
const SEG_BTN =
  'cursor-pointer rounded-[10px] border-[1.5px] border-apar-line bg-apar-field px-[14px] py-[12px] text-left text-apar-ink aria-pressed:border-apar-acc aria-pressed:bg-apar-soft';
const ROW = 'mb-[12px] grid grid-cols-1 gap-[12px]';
const ROW2 = `${ROW} min-[561px]:grid-cols-2`;
const ROW3 = `${ROW} min-[561px]:grid-cols-3`;
const ADDBAR = 'mb-[12px] flex items-center justify-between gap-[10px]';
const ADDBOX = 'mb-[16px] rounded-[10px] border border-dashed border-apar-acc bg-apar-soft p-[16px]';
const TBLW = 'mx-[-4px] overflow-x-auto';
const TABLE = 'w-full min-w-[560px] border-collapse';
const TABLE_SM = 'w-full min-w-[520px] border-collapse';
const THB = 'border-b border-apar-line px-[6px] py-[8px] text-[12.5px] font-medium text-apar-mute';
const TH = `${THB} text-left`;
const THN = `${THB} text-right`;
const TDB = 'border-b border-apar-line px-[6px] py-[10px] align-middle';
const TD = TDB;
const TDN = `${TDB} text-right`;
const TD_CR = 'border-b border-apar-line py-[10px] pl-[26px] pr-[6px] align-middle';
const TD_EMPTY = 'border-b border-apar-line px-0 py-[14px] align-middle text-apar-mute';
const TF = 'px-[6px] py-[10px] align-middle font-bold';
const TFN = `${TF} text-right`;
const NT = 'block text-[12.5px]';
const TAG = 'inline-block rounded-full bg-apar-soft px-[8px] py-[2px] text-[12px] font-medium';
const TAG_COLOR = { over: 'text-apar-err', part: 'text-apar-warn', paid: 'text-apar-ok', '': '' };
const LINE = 'flex justify-between py-[5px]';
const LINE_BIG = 'mt-[8px] flex justify-between border-t border-apar-line pb-[5px] pt-[12px] text-[17px] font-bold';
const CHK = 'my-[12px] flex items-center gap-[9px] rounded-[9px] bg-apar-soft px-[12px] py-[11px]';
const STAT = 'mb-[14px] grid grid-cols-2 gap-[10px]';
const STAT_BOX = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[10px]';
const STAT_LABEL = 'block text-[12.5px] text-apar-mute';
const LI = 'flex justify-between gap-[10px] border-b border-apar-line py-[9px] text-[13.5px]';
const LI_EMPTY = 'flex justify-between gap-[10px] border-b border-apar-line py-[14px] text-[13.5px] text-apar-mute';
const LED_SMALL = 'block text-apar-mute';
const LNX = 'cursor-pointer bg-transparent px-[8px] py-[4px] text-[20px] leading-none text-apar-err';
const XLINK = 'cursor-pointer bg-transparent p-0 text-[12px] text-apar-err underline';
const ERR = 'min-h-[20px] text-[13px] text-apar-err';
const MONO = 'font-apar-mono';

function Page({ children }) {
  return (
    <div className={ROOT}>
      <div className={WRAP}>{children}</div>
    </div>
  );
}

function an(list, code) {
  const f = list.find((a) => a.code === code);
  return f ? f.name : code;
}

export default function VendorPayments() {
  const [vendors, setVendors] = useState([]);
  const [coa, setCoa] = useState({ expense: [], invoiceExpense: [], bank: [] });
  const [venId, setVenId] = useState('');
  const [cur, setCur] = useState(null);
  const [mode, setMode] = useState('inv');
  const [sel, setSel] = useState({});
  const [useAdv, setUseAdv] = useState(false);
  const [meth, setMeth] = useState('Bank transfer');
  const [bankSel, setBankSel] = useState('');
  const [dt, setDt] = useState(TODAY);
  const [toast, setToast] = useState('');
  const [settling, setSettling] = useState(false);

  // advance mode
  const [aBank, setABank] = useState('');
  const [aDt, setADt] = useState(TODAY);
  const [aMeth, setAMeth] = useState('Bank transfer');
  const [aRef, setARef] = useState('');
  const [L, setL] = useState([{ a: '', d: '', n: '' }]);
  const [aErr, setAErr] = useState('');

  // add invoice
  const [addOpen, setAddOpen] = useState(false);
  const [nNo, setNNo] = useState('');
  const [nDate, setNDate] = useState(TODAY);
  const [nDue, setNDue] = useState('');
  const [nNote, setNNote] = useState('');
  const [IL, setIL] = useState([{ a: '', d: '', n: '' }]);
  const [nLink, setNLink] = useState('');
  const [nApply, setNApply] = useState('');
  const [touched, setTouched] = useState(false);
  const [nErr, setNErr] = useState('');

  // refund modal
  const [refundAdv, setRefundAdv] = useState(null);
  const [refAmt, setRefAmt] = useState('');
  const [refDt, setRefDt] = useState(TODAY);
  const [refBank, setRefBank] = useState('');
  const [refMeth, setRefMeth] = useState('Bank transfer');
  const [refRef, setRefRef] = useState('');
  const [refNote, setRefNote] = useState('');
  const [refErr, setRefErr] = useState('');

  // edit mode: { type: 'ADVANCE' | 'INVOICE' | 'REFUND', id, no, advNo?, applied? }
  const [editing, setEditing] = useState(null);
  // advance-only settlement edit (date only): { id, no, date, description, amount, err }
  const [settleEdit, setSettleEdit] = useState(null);
  // the advance control account the server really posts to (falls back to the default code)
  const advCode = coa.advanceAccount?.code || AP_ADVANCE_ACCOUNT_CODE;

  // read-only transaction details dialog
  const [viewTx, setViewTx] = useState(null);
  // read-only "everything under this advance" dialog (advance id)
  const [viewAdv, setViewAdv] = useState(null);
  const [vendorsLoaded, setVendorsLoaded] = useState(false);
  const [venErr, setVenErr] = useState('');
  const loadSeq = useRef(0); // only the latest vendor request may update the screen

  // double-submit guard: one save at a time (a second click/Enter is ignored)
  const busy = useRef(false);
  const [saving, setSaving] = useState(false);
  const guard = (fn) => async (...args) => {
    if (busy.current) return;
    busy.current = true;
    setSaving(true);
    try { await fn(...args); } finally { busy.current = false; setSaving(false); }
  };

  function showToast(t) {
    setToast(t);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => setToast(''), 3200);
  }

  async function loadVendorList() {
    const res = await api.get('/ap/vendors');
    setVendors(res.data);
    setVendorsLoaded(true);
  }
  async function loadVendor(id) {
    if (!id) return;
    const seq = ++loadSeq.current;
    let res;
    try {
      res = await api.get(`/ap/vendor/${id}`);
    } catch (e) {
      if (seq === loadSeq.current) setVenErr(e.message || 'Failed to load vendor');
      return;
    }
    if (seq !== loadSeq.current) return; // a newer vendor was selected meanwhile
    if (!res.ok) { setVenErr(res.data?.error || 'Failed to load vendor'); showToast(res.data?.error || 'Failed to load vendor'); return; }
    setVenErr('');
    setCur(res.data);
    setSel({});
    setAddOpen(false);
  }

  useEffect(() => {
    (async () => {
      await loadVendorList();
      const res = await api.get('/ap/coa');
      setCoa(res.data);
      if (res.data.bank.length) { setABank(res.data.bank[0].code); setRefBank(res.data.bank[0].code); }
      setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]);
      if (res.data.invoiceExpense.length) setIL([{ a: res.data.invoiceExpense[0].code, d: '', n: '' }]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Vendor changed: drop the previous vendor's data and form state, then load the new vendor.
  useEffect(() => {
    setCur(null); setVenErr(''); setSel({}); setUseAdv(false); setNLink(''); setNApply(''); setTouched(false);
    setAddOpen(false); setRefundAdv(null); setViewTx(null); setViewAdv(null); setAErr(''); setNErr(''); setEditing(null);
    if (venId) loadVendor(venId); else loadSeq.current++;
  }, [venId]); // eslint-disable-line react-hooks/exhaustive-deps

  // A focused number input must not change its value on mouse-wheel scroll (500 -> 500.02 bug).
  useEffect(() => {
    const h = () => {
      const a = document.activeElement;
      if (a && a.tagName === 'INPUT' && a.type === 'number') a.blur();
    };
    document.addEventListener('wheel', h, { passive: true });
    return () => document.removeEventListener('wheel', h);
  }, []);

  function bal(i) { return Number(i.balance); }
  function status(i) {
    const b = bal(i);
    if (b <= 0.001) return ['Paid', 'paid'];
    if (i.due < TODAY) return ['Overdue', 'over'];
    if (Number(i.advanceAdjusted) + Number(i.paid) > 0) return ['Partial', 'part'];
    return ['Open', ''];
  }
  const outstanding = useMemo(() => (cur ? cur.invoices.reduce((s, i) => s + bal(i), 0) : 0), [cur]);

  const totals = useMemo(() => {
    let s = 0; Object.values(sel).forEach((v) => (s += v)); s = round2(s);
    const a = useAdv && cur ? Math.min(cur.advanceBalance, s) : 0;
    return { s, a, c: round2(s - a) };
  }, [sel, useAdv, cur]);

  function toggleInvoice(inv, checked) {
    setSel((prev) => {
      const next = { ...prev };
      if (checked) next[inv.id] = bal(inv); else delete next[inv.id];
      return next;
    });
  }
  function setInvoiceAmount(inv, raw) {
    let v = parseFloat(raw);
    if (!(v > 0)) v = bal(inv);
    v = Math.min(v, bal(inv));
    setSel((prev) => ({ ...prev, [inv.id]: v }));
  }

  async function doSettle() {
    if (totals.s <= 0) return;
    const applications = Object.keys(sel).map((k) => ({ invoiceId: k, payNow: 0, fromAdvance: 0 }));
    let leftAdv = totals.a, leftCash = totals.c;
    for (const a of applications) {
      const need = sel[a.invoiceId];
      const fromAdv = Math.min(need, leftAdv); a.fromAdvance = round2(fromAdv); leftAdv = round2(leftAdv - fromAdv);
      const fromCash = Math.min(need - fromAdv, leftCash); a.payNow = round2(fromCash); leftCash = round2(leftCash - fromCash);
    }
    setSettling(true);
    const res = await api.post('/ap/settle', { supplier_id: cur.id, date: dt || TODAY, method: meth, bank_account_code: bankSel, applications });
    setSettling(false);
    if (!res.data.ok) { showToast(res.data.error || 'Settle failed'); return; }
    setSel({}); setUseAdv(false);
    await loadVendor(cur.id);
    showToast(`Settled ${money(totals.s)}: ${money(totals.a)} from advance and ${money(totals.c)} by ${meth.toLowerCase()}.`);
  }

  async function cancelInvoice(id) {
    const res = await api.post('/ap/cancel_invoice', { invoice_id: id });
    if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
    await loadVendor(cur.id);
    showToast(`Invoice ${res.data.invoiceNo} cancelled.`);
  }
  async function cancelPayment(id) {
    const res = await api.post('/ap/cancel_payment', { payment_id: id });
    if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
    await loadVendor(cur.id);
    showToast(`Payment ${res.data.paymentNo} cancelled and reversed.`);
  }
  async function cancelRefund(id) {
    const res = await api.post('/ap/cancel_refund', { refund_id: id });
    if (!res.data.ok) { showToast(res.data.error || 'Cancel failed'); return; }
    await loadVendor(cur.id);
    showToast(`Refund ${res.data.refundNo} cancelled and reversed.`);
  }

  // ---------------- advance mode ----------------
  const lineTotal = useMemo(() => round2(L.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [L]);
  function updateLine(i, k, v) { setL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
  function addLine() { setL((prev) => [...prev, { a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); }
  function removeLine(i) { setL((prev) => prev.filter((_, idx) => idx !== i)); }

  async function recordAdvance() {
    let badIdx = null;
    L.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
    if (badIdx !== null) { setAErr(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }
    const noDesc = L.findIndex((x) => !x.d.trim());
    if (noDesc !== -1) { setAErr(`Line ${noDesc + 1} needs a description.`); return; }
    if (!aBank) { setAErr('Select which account this was paid from.'); return; }
    setAErr('');
    const t = lineTotal;

    if (editing?.type === 'ADVANCE') {
      const r = await api.post('/ap/update_advance', {
        advance_id: editing.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
        lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
      });
      if (!r.data.ok) { setAErr(r.data.error || 'Update failed'); return; }
      const no = editing.no;
      cancelEdit();
      await loadVendor(cur.id);
      showToast(`Advance ${no} updated.`);
      return;
    }

    const res = await api.post('/ap/record_advance', {
      supplier_id: cur.id, date: aDt || TODAY, bank_account_code: aBank, method: aMeth, reference_no: aRef.trim(),
      lines: L.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
    });
    if (!res.data.ok) { setAErr(res.data.error || 'Failed to save advance'); return; }
    setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
    await loadVendor(cur.id);
    showToast(`Advance of ${money(t)} posted, credited to ${an(coa.bank, aBank)}.`);
  }

  // ---------------- add invoice ----------------
  const ilTot = useMemo(() => round2(IL.reduce((s, x) => s + (parseFloat(x.n) > 0 ? parseFloat(x.n) : 0), 0)), [IL]);
  const advSel = useMemo(() => (nLink && cur ? cur.advances.find((x) => String(x.id) === String(nLink)) : null), [nLink, cur]);
  useEffect(() => {
    if (!advSel) { setNApply(''); setTouched(false); return; }
    if (!touched) { const v = Math.min(advSel.balance, ilTot); setNApply(v > 0 ? String(v) : ''); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advSel, ilTot]);

  function updateIL(i, k, v) { setIL((prev) => prev.map((x, idx) => (idx === i ? { ...x, [k]: v } : x))); }
  function addIL() { setIL((prev) => [...prev, { a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]); }
  function removeIL(i) { setIL((prev) => prev.filter((_, idx) => idx !== i)); }

  function openAddBox(open) {
    setAddOpen(open); setNErr('');
    if (open) {
      setNDate(TODAY);
      const d = new Date(); d.setDate(d.getDate() + 30);
      setNDue(d.toISOString().slice(0, 10));
      setNNo('INV-' + Date.now().toString().slice(-6));
      setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
      setTouched(false); setNNote(''); setNLink('');
    }
  }

  async function saveInvoice() {
    const no = nNo.trim(), e = setNErr;
    let badIdx = null;
    IL.forEach((x, i) => { if (!(parseFloat(x.n) > 0) && badIdx === null) badIdx = i; });
    if (!no) { e('Enter an invoice number.'); return; }
    if (!nNote.trim()) { e('Enter a description.'); return; }
    if (!nDate || !nDue) { e('Set both the invoice date and the due date.'); return; }
    if (nDue < nDate) { e("The due date can't be before the invoice date."); return; }
    if (badIdx !== null) { e(`Line ${badIdx + 1} needs an amount greater than zero. Fill it in or remove the line.`); return; }

    // Editing: the advance that was linked at creation keeps its applied amount.
    if (editing?.type === 'INVOICE') {
      if (editing.applied > 0 && ilTot + 0.001 < editing.applied) {
        e(`Invoice total can't be less than the advance already applied (${money(editing.applied)}).`);
        return;
      }
      e('');
      const r = await api.post('/ap/update_invoice', {
        invoice_id: editing.id, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
        lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
      });
      if (!r.data.ok) { e(r.data.error || 'Update failed'); return; }
      const eno = editing.no;
      setEditing(null);
      openAddBox(false);
      await loadVendor(cur.id);
      showToast(`Invoice ${eno} updated.`);
      return;
    }

    const t = ilTot, a = advSel, ap = a ? round2(parseFloat(nApply) || 0) : 0;
    if (a && !(ap > 0)) { e(`Enter how much to apply from ${a.no}, or choose no advance link.`); return; }
    if (a && ap > Math.min(a.balance, t)) { e(`You can apply at most ${money(Math.min(a.balance, t))} from ${a.no} (${money(a.balance)} available, invoice total ${money(t)}).`); return; }
    e('');

    const res = await api.post('/ap/save_invoice', {
      supplier_id: cur.id, invoice_no: no, invoice_date: nDate, due_date: nDue, note: nNote.trim(),
      lines: IL.map((x) => ({ account: x.a, desc: x.d, amount: x.n })),
      link_advance_id: a ? a.id : '', apply_amount: a ? ap : 0,
    });
    if (!res.data.ok) { e(res.data.error || 'Failed to save invoice'); return; }
    openAddBox(false);
    await loadVendor(cur.id);
    showToast(`Invoice ${no} for ${money(t)} added` + (a ? ` and linked to ${a.no}: ${money(ap)} applied.` : '. Select it to pay.'));
  }

  // ---------------- refund ----------------
  function openRefund(adv) {
    setRefundAdv(adv);
    setRefAmt(String(adv.balance)); setRefDt(TODAY); setRefRef(''); setRefNote(''); setRefErr('');
  }
  async function confirmRefund() {
    if (!refundAdv) return;

    if (editing?.type === 'REFUND') {
      if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
      setRefErr('');
      const r = await api.post('/ap/update_refund', {
        refund_id: editing.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth,
        reference_no: refRef.trim(), remarks: refNote.trim(),
      });
      if (!r.data.ok) { setRefErr(r.data.error || 'Update failed'); return; }
      const rn = editing.no;
      setEditing(null);
      setRefundAdv(null);
      await loadVendor(cur.id);
      showToast(`Refund ${rn} updated.`);
      return;
    }

    const amt = parseFloat(refAmt) || 0;
    if (!(amt > 0)) { setRefErr('Enter a refund amount greater than zero.'); return; }
    if (amt > refundAdv.balance + 0.001) { setRefErr(`Refund amount exceeds the available balance of ${money(refundAdv.balance)}.`); return; }
    if (!refBank) { setRefErr('Select which account the refund goes to.'); return; }
    setRefErr('');
    const no = refundAdv.no;
    const res = await api.post('/ap/refund_advance', {
      advance_id: refundAdv.id, date: refDt || TODAY, bank_account_code: refBank, method: refMeth, reference_no: refRef.trim(), amount: amt, remarks: refNote.trim(),
    });
    if (!res.data.ok) { setRefErr(res.data.error || 'Refund failed'); return; }
    setRefundAdv(null);
    await loadVendor(cur.id);
    showToast(`Refund of ${money(amt)} recorded for ${no}.`);
  }
  function closeRefundModal() {
    setRefundAdv(null);
    if (editing?.type === 'REFUND') setEditing(null);
  }

  // ---------------- edit (pencil in Recent activity) ----------------
  async function openEdit(l) {
    const isSettle = l.sourceType === 'PAYMENT' && Number(l.sourceId) === 0;
    const res = await api.get(isSettle ? `/ap/edit_data/SETTLEMENT/${l.journalId}` : `/ap/edit_data/${l.sourceType}/${l.sourceId}`);
    if (!res.ok || !res.data?.ok) { showToast(res.data?.error || 'This record cannot be edited'); return; }
    const d = res.data;
    if (d.type === 'SETTLEMENT') {
      setSettleEdit({ id: d.id, no: d.no, date: d.date, description: d.description, amount: Number(d.amount), err: '' });
      return;
    }
    // advNo / applied: advance that was linked when the invoice was created (read-only while editing)
    setEditing({ type: d.type, id: d.id, no: d.no, advNo: d.advNo || null, applied: Number(d.advanceApplied || 0) });
    if (d.type === 'ADVANCE') {
      setMode('adv'); setAErr('');
      setABank(d.bank); setADt(d.date); setAMeth(d.method || 'Bank transfer'); setARef(d.ref || '');
      setL(d.lines.map((x) => ({ a: AP_ADVANCE_ACCOUNT_CODE, d: x.d || '', n: String(x.n) })));
    } else if (d.type === 'INVOICE') {
      setMode('inv'); setNErr('');
      setAddOpen(true);
      setNNo(d.no); setNDate(d.date); setNDue(d.due || d.date); setNNote(d.note || ''); setNLink(''); setTouched(false);
      setIL(d.lines.map((x) => ({ a: x.a, d: x.d || '', n: String(x.n) })));
    } else {
      setRefundAdv({ id: d.advanceId, no: d.no, balance: d.amount });
      setRefAmt(String(d.amount)); setRefDt(d.date); setRefBank(d.bank); setRefMeth(d.method || 'Bank transfer');
      setRefRef(d.ref || ''); setRefNote(d.remarks || ''); setRefErr('');
    }
  }
  function cancelEdit() {
    setEditing(null); setAddOpen(false); setRefundAdv(null); setAErr(''); setNErr('');
    setL([{ a: AP_ADVANCE_ACCOUNT_CODE, d: '', n: '' }]); setARef('');
    setIL([{ a: coa.invoiceExpense[0]?.code || '', d: '', n: '' }]);
  }

  // ---------------- journal previews ----------------
  function advanceJournalRows() {
    const rows = [];
    L.forEach((x) => { const v = parseFloat(x.n); if (v > 0) rows.push({ label: `${advCode} · Advances to Suppliers`, dr: v, cr: 0 }); });
    const t = lineTotal;
    if (t > 0) rows.push({ label: `${aBank} · ${an(coa.bank, aBank)}`, dr: 0, cr: t, isCredit: true });
    return { rows, total: t };
  }
  function invoiceJournalRows() {
    const rows = []; const t = ilTot;
    // While editing, the linked advance (if any) comes from the saved record, not from the form.
    const isEdit = editing?.type === 'INVOICE';
    const ap = isEdit ? Number(editing.applied || 0) : (parseFloat(nApply) || 0);
    const linkedNo = isEdit ? editing.advNo : nLink;
    IL.forEach((x) => { const v = parseFloat(x.n); if (v > 0 && x.a) rows.push({ label: `${x.a} · ${an(coa.invoiceExpense, x.a)}`, dr: v, cr: 0 }); });
    let total = t;
    if (t > 0) {
      rows.push({ label: '3020020000 · Accounts Payable - Trade', dr: 0, cr: t, isCredit: true });
      if (linkedNo && ap > 0) {
        total = t + ap;
        rows.push({ label: '3020020000 · Accounts Payable - Trade (advance applied)', dr: ap, cr: 0 });
        rows.push({ label: `${advCode} · Advances to Suppliers (${linkedNo})`, dr: 0, cr: ap, isCredit: true });
      }
    }
    return { rows, total };
  }

  const [newVendorName, setNewVendorName] = useState('');
  async function addVendor() {
    const name = newVendorName.trim();
    if (!name) return;
    const res = await api.post('/ap/vendors', { name });
    if (!res.data.ok) { showToast(res.data.error || 'Failed to add vendor'); return; }
    setNewVendorName('');
    await loadVendorList();
    setVenId(String(res.data.id));
  }

  async function saveSettleEdit() {
    const s = settleEdit;
    if (!s) return;
    if (!s.date) { setSettleEdit({ ...s, err: 'Select a date.' }); return; }
    const r = await api.post('/ap/update_settlement', { journal_id: s.id, date: s.date });
    if (!r.data.ok) { setSettleEdit({ ...s, err: r.data.error || 'Update failed' }); return; }
    setSettleEdit(null);
    await loadVendor(cur.id);
    showToast(`Settlement ${s.no} updated.`);
  }

  // guarded save handlers (function declarations above are hoisted, so this is safe)
  const onRecordAdvance = guard(recordAdvance);
  const onSaveInvoice = guard(saveInvoice);
  const onConfirmRefund = guard(confirmRefund);
  const onSaveSettleEdit = guard(saveSettleEdit);

  if (!cur) {
    return (
      <Page>
        <div className={TOP}>
          <div>
            <h1 className={H1}>Vendor payments</h1>
            <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
          </div>
          <div className="flex items-end gap-[10px]">
            {vendors.length > 0 && (
              <div className="min-w-[240px]">
                <label className="apar-label">Vendor</label>
                <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
                  <option value="">Select vendor</option>
                  {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            )}
            <PageGuideSheet guide={vendorPaymentsGuide} />
          </div>
        </div>

        {venErr && venId ? (
          <div className={PANEL}><div className={ERR} role="alert">{venErr}</div></div>
        ) : !vendorsLoaded || venId ? (
          <div className={PANEL}><div className="py-[24px] text-center text-apar-mute">Loading...</div></div>
        ) : vendors.length > 0 ? (
          <div className={PANEL}>
            <h2 className="apar-h2">Select a vendor</h2>
            <div className="text-apar-mute">Choose a vendor from the list above to see invoices, advances, and payments.</div>
          </div>
        ) : (
          <div className={PANEL}>
            <h2 className="apar-h2">No vendors yet</h2>
            <div className={`${ROW2} items-end`}>
              <div>
                <label className="apar-label">Vendor name</label>
                <input className="apar-input" value={newVendorName} onChange={(e) => setNewVendorName(e.target.value)} placeholder="e.g. Acme Supplies Ltd." />
              </div>
              <div><button className="apar-btn w-full" onClick={addVendor}>Add vendor</button></div>
            </div>
          </div>
        )}
      </Page>
    );
  }

  const open = cur.invoices.filter((i) => bal(i) > 0.001);
  const advJrn = advanceJournalRows();
  const invJrn = invoiceJournalRows();

  return (
    <Page>
      <div className={TOP}>
        <div>
          <h1 className={H1}>Vendor payments</h1>
          <div className="text-apar-mute">Record an advance, then settle it against payable invoices.</div>
        </div>
        <div className="flex items-end gap-[10px]">
          <div className="min-w-[240px]">
            <label className="apar-label">Vendor</label>
            <select className="apar-select" value={venId} onChange={(e) => setVenId(e.target.value)}>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <PageGuideSheet guide={vendorPaymentsGuide} />
        </div>
      </div>

      <div className={GRID}>
        <main className={PANEL}>
          <div className={SEG} role="group" aria-label="Payment type">
            <button type="button" className={SEG_BTN} aria-pressed={mode === 'inv'} onClick={() => setMode('inv')}>
              <b className="block">Pay against invoices</b>
              <span className="text-[13px] text-apar-mute">Choose payable invoices and settle them</span>
            </button>
            <button type="button" className={SEG_BTN} aria-pressed={mode === 'adv'} onClick={() => setMode('adv')}>
              <b className="block">Advance to vendor</b>
              <span className="text-[13px] text-apar-mute">Individual payment with no invoice yet</span>
            </button>
          </div>

          {mode === 'inv' && (
            <section>
              <div className={ADDBAR}>
                <b className="text-[15px]">Payable invoices</b>
                <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(!addOpen))}>Add payable invoice</button>
              </div>

              {addOpen && (
                <div className={ADDBOX}>
                  {editing?.type === 'INVOICE' && (
                    <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing invoice {editing.no}</div>
                  )}
                  {editing?.type === 'INVOICE' && editing.advNo && (
                    <div className="mb-[12px] text-[13px] text-apar-mute">
                      Advance {editing.advNo} ({money(editing.applied)}) is linked to this invoice. The applied amount stays the same.
                    </div>
                  )}
                  <div className={ROW3}>
                    <div><label className="apar-label">Invoice number</label><input className={`apar-input ${MONO}`} value={nNo} disabled={!!editing} onChange={(e) => setNNo(e.target.value)} placeholder="INV-2100" /></div>
                    <div><label className="apar-label">Invoice date</label><input className="apar-input" type="date" value={nDate} onChange={(e) => setNDate(e.target.value)} /></div>
                    <div><label className="apar-label">Due date</label><input className="apar-input" type="date" value={nDue} onChange={(e) => setNDue(e.target.value)} /></div>
                  </div>
                  <div className={ROW}>
                    <div><label className="apar-label">Description <span className="text-apar-err">*</span></label><input className="apar-input" required value={nNote} onChange={(e) => setNNote(e.target.value)} placeholder="e.g. October packaging supplies" /></div>
                  </div>

                  <div className={ADDBAR}>
                    <b className="text-[15px]">Invoice lines</b>
                    <button type="button" className="apar-ghost" onClick={addIL}>Add line</button>
                  </div>
                  <div className={TBLW}>
                    <table className={TABLE_SM}>
                      <thead>
                        <tr>
                          <th className={`${TH} w-[48%]`}>Account</th>
                          <th className={TH}>Description</th>
                          <th className={`${THN} w-[120px]`}>Amount</th>
                          <th className={`${TH} w-[36px]`}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {IL.map((x, i) => (
                          <tr key={i}>
                            <td className={TD}><AccountPicker options={coa.invoiceExpense} value={x.a} onChange={(code) => updateIL(i, 'a', code)} /></td>
                            <td className={TD}><input className="apar-input" value={x.d} onChange={(e) => updateIL(i, 'd', e.target.value)} placeholder="Optional. Defaults to the description above" /></td>
                            <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateIL(i, 'n', e.target.value)} placeholder="0.00" /></td>
                            <td className={TD}>{IL.length > 1 && <button type="button" className={LNX} onClick={() => removeIL(i)}>&times;</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2} className={TFN}>Invoice total</td>
                          <td className={`${TFN} ${MONO}`}>{money(ilTot)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className={`${ROW2} mt-[14px]`}>
                    <div>
                      <label className="apar-label">Link advance payment</label>
                      <select className="apar-select" value={nLink} onChange={(e) => { setNLink(e.target.value); setTouched(false); }} disabled={!!editing || !cur.advances.some((a) => a.balance > 0)}>
                        <option value="">{cur.advances.some((a) => a.balance > 0) ? 'No advance link' : 'No open advance for this vendor'}</option>
                        {cur.advances.filter((a) => a.balance > 0).map((a) => <option key={a.id} value={a.id}>{a.no} · {money(a.balance)} available ({a.date})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="apar-label">Apply from advance</label>
                      <input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={nApply} disabled={!advSel || !!editing} onChange={(e) => { setTouched(true); setNApply(e.target.value); }} placeholder="0.00" />
                    </div>
                  </div>

                  <h2 className="apar-h2">Journal entry preview</h2>
                  <div className={TBLW}>
                    <table className={TABLE_SM}>
                      <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
                      <tbody>
                        {invJrn.rows.length ? invJrn.rows.map((r, i) => (
                          <tr key={i}>
                            <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
                            <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
                            <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
                          </tr>
                        )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
                        {invJrn.total > 0 && (
                          <tr className="font-bold">
                            <td className={TD}>Total</td>
                            <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
                            <td className={`${TDN} ${MONO}`}>{money(invJrn.total)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className={ERR} role="alert">{nErr}</div>
                  <div className="flex gap-[10px]">
                    <button type="button" className="apar-btn" disabled={saving} onClick={onSaveInvoice}>{editing?.type === 'INVOICE' ? 'Save changes' : 'Save invoice'}</button>
                    <button type="button" className="apar-ghost" onClick={() => (editing ? cancelEdit() : openAddBox(false))}>Cancel</button>
                  </div>
                </div>
              )}

              <div className={TBLW}>
                <table className={TABLE}>
                  <thead>
                    <tr>
                      <th className={TH}></th>
                      <th className={TH}>Invoice</th>
                      <th className={TH}>Due</th>
                      <th className={TH}>Status</th>
                      <th className={THN}>Balance</th>
                      <th className={THN}>Pay now</th>
                      <th className={TH}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cur.invoices.map((i) => {
                      const b = bal(i), st = status(i), on = sel[i.id] !== undefined;
                      const canCancel = Number(i.paid) <= 0.001;
                      return (
                        <tr key={i.id}>
                          <td className={TD}><input type="checkbox" disabled={b <= 0.001} checked={on} onChange={(e) => toggleInvoice(i, e.target.checked)} /></td>
                          <td className={TD}>
                            <span className={MONO}>{i.no}</span>
                            {i.note && <small className={`${NT} text-apar-mute`}>{i.note}</small>}
                            {i.links?.length > 0 && <small className={`${NT} text-apar-ok`}>Linked to {i.links.map((l) => `${l.advNo} (${money(l.amt)})`).join(', ')}</small>}
                          </td>
                          <td className={TD}>{i.due}</td>
                          <td className={TD}><span className={`${TAG} ${TAG_COLOR[st[1]]}`}>{st[0]}</span></td>
                          <td className={`${TDN} ${MONO}`}>{money(b)}</td>
                          <td className={TDN}>
                            <input className={`apar-input w-[104px] text-right ${MONO}`} type="number" min="0" max={b} step="0.01" disabled={!on} value={on ? sel[i.id] : ''} onChange={(e) => on && setInvoiceAmount(i, e.target.value)} />
                          </td>
                          <td className={TD}>
                            <div className="flex items-center justify-end gap-[8px]">
                              <AttachmentsButton entityType="AP_INVOICE" entityId={i.id} />
                              {canCancel && <button type="button" className={XLINK} onClick={() => cancelInvoice(i.id)}>Cancel</button>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {!open.length && <tr><td colSpan={7} className={TD_EMPTY}>All invoices for this vendor are paid.</td></tr>}
                  </tbody>
                </table>
              </div>

              <div className={CHK}>
                <input className="h-[17px] w-[17px] accent-apar-acc" type="checkbox" id="useAdv" checked={useAdv} disabled={cur.advanceBalance <= 0} onChange={(e) => setUseAdv(e.target.checked)} />
                <label htmlFor="useAdv">{cur.advanceBalance > 0 ? `Apply advance balance (${money(cur.advanceBalance)} available)` : 'No advance balance available'}</label>
              </div>

              <div className={ROW2}>
                <div>
                  <label className="apar-label">Method</label>
                  <select className="apar-select" value={meth} onChange={(e) => setMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
                </div>
                <div>
                  <label className="apar-label">Paid from account</label>
                  <select className="apar-select" value={bankSel} onChange={(e) => setBankSel(e.target.value)}>
                    <option value="">Not needed if fully from advance</option>
                    {coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}
                  </select>
                </div>
              </div>
              <div className={ROW2}>
                <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={dt} onChange={(e) => setDt(e.target.value)} /></div>
                <div></div>
              </div>

              <div className="ml-auto max-w-[380px]">
                <div className={LINE}><span>Selected invoices</span><span className={MONO}>{money(totals.s)}</span></div>
                <div className={LINE}><span>Advance applied</span><span className={`${MONO} text-apar-ok`}>-{money(totals.a)}</span></div>
                <div className={LINE_BIG}><span>Cash to pay</span><span className={MONO}>{money(totals.c)}</span></div>
                <button className="apar-btn mt-[6px] w-full" disabled={totals.s <= 0 || settling} onClick={doSettle}>Settle selected invoices</button>
              </div>
            </section>
          )}

          {mode === 'adv' && (
            <section>
              {editing?.type === 'ADVANCE' && (
                <div className="mb-[12px] text-[13px] font-medium text-apar-warn">Editing advance {editing.no}</div>
              )}
              <div className={ROW2}>
                <div>
                  <label className="apar-label">Paid from account</label>
                  <select className="apar-select" value={aBank} onChange={(e) => setABank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
                </div>
                <div><label className="apar-label">Payment date</label><input className="apar-input" type="date" value={aDt} onChange={(e) => setADt(e.target.value)} /></div>
              </div>
              <div className={ROW2}>
                <div>
                  <label className="apar-label">Method</label>
                  <select className="apar-select" value={aMeth} onChange={(e) => setAMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
                </div>
                <div><label className="apar-label">Reference</label><input className="apar-input" value={aRef} onChange={(e) => setARef(e.target.value)} placeholder="PO number or note" /></div>
              </div>

              <div className={`${ADDBAR} mt-[4px]`}>
                <b className="text-[15px]">Advance lines</b>
                <button type="button" className="apar-ghost" onClick={addLine}>Add line</button>
              </div>
              <div className={TBLW}>
                <table className={TABLE_SM}>
                  <thead>
                    <tr>
                      <th className={`${TH} w-[38%]`}>Account</th>
                      <th className={TH}>Description <span className="text-apar-err">*</span></th>
                      <th className={`${THN} w-[120px]`}>Amount</th>
                      <th className={`${TH} w-[36px]`}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {L.map((x, i) => (
                      <tr key={i}>
                        <td className={`${TD} ${MONO} text-apar-mute`}>{advCode} · {coa.advanceAccount?.name || 'Advances to Suppliers'}</td>
                        <td className={TD}><input className="apar-input" required value={x.d} onChange={(e) => updateLine(i, 'd', e.target.value)} placeholder="What is this advance for?" /></td>
                        <td className={TDN}><input className={`apar-input ${MONO} text-right`} type="number" min="0" step="0.01" value={x.n} onChange={(e) => updateLine(i, 'n', e.target.value)} placeholder="0.00" /></td>
                        <td className={TD}>{L.length > 1 && <button type="button" className={LNX} onClick={() => removeLine(i)}>&times;</button>}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className={TFN}>Total advance</td>
                      <td className={`${TFN} ${MONO}`}>{money(lineTotal)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <h2 className="apar-h2 mt-[18px]">Journal entry preview</h2>
              <div className={TBLW}>
                <table className={TABLE_SM}>
                  <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
                  <tbody>
                    {advJrn.total > 0 ? advJrn.rows.map((r, i) => (
                      <tr key={i}>
                        <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
                        <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
                        <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
                      </tr>
                    )) : <tr><td colSpan={3} className={TD_EMPTY}>Add an amount to a line to see the entry.</td></tr>}
                    {advJrn.total > 0 && (
                      <tr className="font-bold">
                        <td className={TD}>Total</td>
                        <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
                        <td className={`${TDN} ${MONO}`}>{money(advJrn.total)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className={ERR} role="alert">{aErr}</div>
              <button className="apar-btn mt-[6px] w-full" disabled={saving} onClick={onRecordAdvance}>{editing?.type === 'ADVANCE' ? 'Save changes' : 'Record advance'}</button>
              {editing?.type === 'ADVANCE' && (
                <button type="button" className="apar-ghost mt-[6px] w-full" onClick={cancelEdit}>Cancel edit</button>
              )}
              <p className="mt-[12px] text-[13px] text-apar-mute">The advance is held as a vendor balance. Switch to "Pay against invoices" to apply it when an invoice arrives.</p>
            </section>
          )}
        </main>

        <aside className={PANEL}>
          <h2 className="apar-h2">{cur.name}</h2>
          <div className={STAT}>
            <div className={STAT_BOX}><span className={STAT_LABEL}>Outstanding</span><b className={`text-[18px] ${MONO}`}>{money(outstanding)}</b></div>
            <div className={STAT_BOX}><span className={STAT_LABEL}>Advance balance</span><b className={`text-[18px] ${MONO} text-apar-ok`}>{money(cur.advanceBalance)}</b></div>
          </div>

          <h2 className="apar-h2">Advance payments</h2>
          <ul>
            {cur.advances.length ? cur.advances.map((a) => {
              const appliedTo = [];
              cur.invoices.forEach((i) => (i.links || []).forEach((l) => { if (l.advNo === a.no) appliedTo.push(`${i.no} ${money(l.amt)}`); }));
              const canRefund = a.balance > 0.001 && a.status !== 'Cancelled';
              return (
                <li key={a.id} className={LI}>
                  <span>{a.no}<small className={LED_SMALL}>{a.date} {appliedTo.length ? `· applied to ${appliedTo.join(', ')}` : '· not yet applied'}</small></span>
                  <b className={`flex items-center gap-[8px] ${MONO} text-apar-ok`}>
                    <button
                      type="button"
                      title="View advance details"
                      aria-label="View advance details"
                      className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
                      onClick={() => setViewAdv(a.id)}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <span>{money(a.balance)}</span>
                    {canRefund && <button type="button" className={XLINK} onClick={() => openRefund(a)}>Refund</button>}
                  </b>
                </li>
              );
            }) : <li className={LI_EMPTY}>No advances yet.</li>}
          </ul>

          <h2 className="apar-h2 mt-[18px]">Payments</h2>
          <ul>
            {cur.payments?.length ? cur.payments.map((p) => {
              const cancelled = p.status === 'Cancelled';
              return (
                <li key={p.id} className={LI}>
                  <span>{p.no}<small className={LED_SMALL}>{p.date}{cancelled ? ' · cancelled' : ''}</small>{p.note && <small className={LED_SMALL}>{p.note}</small>}</span>
                  <b className={`flex items-center gap-[8px] ${MONO}`}>
                    <AttachmentsButton entityType="AP_PAYMENT" entityId={p.id} />
                    {money(p.total)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelPayment(p.id)}>Cancel</button>}
                  </b>
                </li>
              );
            }) : <li className={LI_EMPTY}>No payments yet.</li>}
          </ul>

          <h2 className="apar-h2 mt-[18px]">Refunds</h2>
          <ul>
            {cur.refunds?.length ? cur.refunds.map((r) => {
              const cancelled = r.status === 'Cancelled';
              return (
                <li key={r.id} className={LI}>
                  <span>{r.no}<small className={LED_SMALL}>{r.date} · {r.advNo}{cancelled ? ' · cancelled' : ''}</small></span>
                  <b className={MONO}>{money(r.amount)} {!cancelled && <button type="button" className={XLINK} onClick={() => cancelRefund(r.id)}>Cancel</button>}</b>
                </li>
              );
            }) : <li className={LI_EMPTY}>No refunds yet.</li>}
          </ul>

          <h2 className="apar-h2 mt-[18px]">Recent activity</h2>
          <ul>
            {cur.ledger.length ? cur.ledger.map((l, i) => (
              <li key={l.journalId || i} className={LI}>
                <span>{l.description}<small className={LED_SMALL}>{l.date}</small></span>
                <b className={`flex items-center gap-[8px] ${MONO} ${l.positive ? 'text-apar-ok' : 'text-apar-err'}`}>
                  {l.editable && l.sourceType === 'ADVANCE' && (
                    <button
                      type="button"
                      title="Edit"
                      aria-label="Edit"
                      className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
                      onClick={() => openEdit(l)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    title="View details"
                    aria-label="View details"
                    className="cursor-pointer bg-transparent p-0 text-apar-mute hover:text-apar-ink"
                    onClick={() => setViewTx({ sourceType: l.sourceType, sourceId: l.sourceId, journalId: Number(l.sourceId) === 0 || l.sourceType === 'INVOICE' ? l.journalId : 0 })}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <span>{l.positive ? '+' : '-'}{money(l.amount)}</span>
                </b>
              </li>
            )) : <li className={LI_EMPTY}>No activity yet.</li>}
          </ul>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-[20px] left-1/2 z-[130] max-w-[92%] -translate-x-1/2 rounded-[9px] bg-apar-ink px-[18px] py-[11px] text-apar-bg" role="status">
          {toast}
        </div>
      )}

      {refundAdv && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && closeRefundModal()}>
          <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
            <h2 className="apar-h2">{editing?.type === 'REFUND' ? 'Edit refund' : 'Refund advance'} <span className={MONO}>{refundAdv.no}</span></h2>
            <div className="mb-[12px] text-[13px] text-apar-mute">{editing?.type === 'REFUND' ? 'Refund amount' : 'Available to refund'}: <b className={MONO}>{money(refundAdv.balance)}</b></div>
            <div className={ROW2}>
              <div><label className="apar-label">Refund amount</label><input className={`apar-input ${MONO}`} type="number" min="0" step="0.01" value={refAmt} disabled={editing?.type === 'REFUND'} onChange={(e) => setRefAmt(e.target.value)} /></div>
              <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={refDt} onChange={(e) => setRefDt(e.target.value)} /></div>
            </div>
            <div className={ROW2}>
              <div>
                <label className="apar-label">Refund to account</label>
                <select className="apar-select" value={refBank} onChange={(e) => setRefBank(e.target.value)}>{coa.bank.map((a) => <option key={a.code} value={a.code}>{a.code} · {a.name}</option>)}</select>
              </div>
              <div>
                <label className="apar-label">Method</label>
                <select className="apar-select" value={refMeth} onChange={(e) => setRefMeth(e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select>
              </div>
            </div>
            <div className={ROW}><div><label className="apar-label">Reference</label><input className="apar-input" value={refRef} onChange={(e) => setRefRef(e.target.value)} placeholder="Optional" /></div></div>
            <div className={ROW}><div><label className="apar-label">Remarks</label><input className="apar-input" value={refNote} onChange={(e) => setRefNote(e.target.value)} placeholder="Optional" /></div></div>
            <div className={ERR} role="alert">{refErr}</div>
            <div className="flex gap-[10px]">
              <button type="button" className="apar-btn" disabled={saving} onClick={onConfirmRefund}>{editing?.type === 'REFUND' ? 'Save changes' : 'Confirm refund'}</button>
              <button type="button" className="apar-ghost" onClick={closeRefundModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {settleEdit && (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && setSettleEdit(null)}>
          <div className="max-h-[90vh] w-full max-w-[420px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
            <h2 className="apar-h2">Edit settlement <span className={MONO}>{settleEdit.no}</span></h2>
            <div className="mb-[12px] text-[13px] text-apar-mute">{settleEdit.description}</div>
            <div className={ROW2}>
              <div><label className="apar-label">Amount</label><div className={`rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px] ${MONO}`}>{money(settleEdit.amount)}</div></div>
              <div><label className="apar-label">Date</label><input className="apar-input" type="date" value={settleEdit.date} onChange={(e) => setSettleEdit({ ...settleEdit, date: e.target.value, err: '' })} /></div>
            </div>
            <div className="mb-[12px] text-[12.5px] text-apar-mute">Only the date can be changed for a settlement paid fully from an advance.</div>
            <div className={ERR} role="alert">{settleEdit.err}</div>
            <div className="flex gap-[10px]">
              <button type="button" className="apar-btn" disabled={saving} onClick={onSaveSettleEdit}>Save changes</button>
              <button type="button" className="apar-ghost" onClick={() => setSettleEdit(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {viewTx && <TransactionDialog tx={viewTx} onClose={() => setViewTx(null)} />}
      {viewAdv && <AdvanceDetailDialog advId={viewAdv} onClose={() => setViewAdv(null)} />}
    </Page>
  );
}

/* ---------- read-only transaction details (view / print / excel) ---------- */
function csvCell(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(d) {
  const rows = [];
  const add = (...cells) => rows.push(cells.map(csvCell).join(','));
  add('Farm Welfare Agro Limited');
  add(d.title);
  add('Vendor', d.supplierName);
  add('Date', d.date);
  add('Status', d.cancelled ? 'Cancelled' : d.status);
  add('GL', d.glPosted ? 'Posted' : 'Not posted');
  if (d.note) add('Note', d.note);
  (d.fields || []).forEach((f) => add(f.label, f.value));
  add();
  if (d.summary.length) {
    add('Summary');
    d.summary.forEach((s) => add(s.label, s.money ? Number(s.value || 0) : s.value));
    add();
  }
  d.sections.forEach((sec) => {
    add(sec.title);
    add(...sec.columns.map((c) => c.label));
    sec.rows.forEach((r) => add(...sec.columns.map((c) => (c.money ? Number(r[c.key] || 0) : r[c.key] ?? ''))));
    if (sec.footer) add(...sec.columns.map((c, i) => (i === sec.columns.length - 1 ? Number(sec.footer.value || 0) : i === sec.columns.length - 2 ? sec.footer.label : '')));
    add();
  });
  add('Journal entries');
  add('Journal no', 'Date', 'Type', 'Description', 'Account', 'Account name', 'Debit', 'Credit');
  d.journal.entries.forEach((e) => {
    e.lines.forEach((l) => add(e.journalNo, e.date, e.kind, e.description, l.account, l.accountName, l.debit || '', l.credit || ''));
  });
  add('', '', '', '', '', 'Total', d.journal.totalDebit, d.journal.totalCredit);

  const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${d.title.replace(/[^\w.-]+/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function TransactionDialog({ tx, onClose }) {
  const [st, setSt] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let off = false;
    (async () => {
      setSt({ loading: true, error: '', data: null });
      try {
        const q = tx.journalId ? `?journalId=${tx.journalId}` : '';
        const res = await api.get(`/ap/transaction/${tx.sourceType}/${tx.sourceId}${q}`);
        if (off) return;
        if (!res.ok) { setSt({ loading: false, error: res.data?.error || 'Failed to load details', data: null }); return; }
        setSt({ loading: false, error: '', data: res.data });
      } catch (e) {
        if (!off) setSt({ loading: false, error: e.message || 'Failed to load details', data: null });
      }
    })();
    return () => { off = true; };
  }, [tx]);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const d = st.data;
  const cell = (c, row) => (c.money ? money(Number(row[c.key] || 0)) : row[c.key] ?? '');

  const secs = (list) => list.map((sec) => (
    <div key={sec.title} className="mb-[16px]">
      <h3 className="mb-[6px] text-[14px] font-bold">{sec.title}</h3>
      <div className={TBLW}>
        <table className={TABLE_SM}>
          <thead><tr>{sec.columns.map((c) => <th key={c.key} className={c.money ? THN : TH}>{c.label}</th>)}</tr></thead>
          <tbody>
            {sec.rows.map((row, i) => (
              <tr key={i}>{sec.columns.map((c) => <td key={c.key} className={c.money ? `${TDN} ${MONO}` : TD}>{cell(c, row)}</td>)}</tr>
            ))}
          </tbody>
          {sec.footer && (
            <tfoot>
              <tr>
                <td colSpan={sec.columns.length - 1} className={TFN}>{sec.footer.label}</td>
                <td className={`${TFN} ${MONO}`}>{money(Number(sec.footer.value || 0))}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  ));

  const journalBlock = d && (
    <div className="mb-[6px]">
      <h3 className="mb-[6px] text-[14px] font-bold">Journal entries</h3>
      {d.journal.entries.length === 0 && <div className="text-apar-mute">No journal found.</div>}
      {d.journal.entries.map((e) => {
        const dr = e.lines.reduce((t, l) => t + (l.debit || 0), 0), cr = e.lines.reduce((t, l) => t + (l.credit || 0), 0);
        return (
          <div key={e.journalId} className="mb-[12px]">
            <div className="flex flex-wrap items-center gap-[8px] text-[13px]">
              <span className={MONO}>{e.journalNo}</span>
              <span className="text-apar-mute">{e.date}</span>
              <span className={`${TAG} ${e.kind === 'Reversal' ? 'text-apar-err' : ''}`}>{e.kind}</span>
              <span>{e.description}</span>
            </div>
            <div className={TBLW}>
              <table className={TABLE_SM}>
                <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
                <tbody>
                  {e.lines.map((l, i) => (
                    <tr key={i}>
                      <td className={l.credit > 0 ? TD_CR : TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}{l.derived ? ' *' : ''}</td>
                      <td className={`${TDN} ${MONO}`}>{l.debit ? money(l.debit) : ''}</td>
                      <td className={`${TDN} ${MONO}`}>{l.credit ? money(l.credit) : ''}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className={TD}>Total</td>
                    <td className={`${TDN} ${MONO}`}>{money(dr)}</td>
                    <td className={`${TDN} ${MONO}`}>{money(cr)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {e.derived && <div className="text-[12px] text-apar-mute">* Not saved in the journal lines of this older record. Shown from the journal total so the entry balances.</div>}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .tx-only-print{display:none}
        @media print{
          @page{margin:14mm}
          body *{visibility:hidden}
          #tx-print,#tx-print *{visibility:visible}
          #tx-print{position:absolute;left:0;top:0;width:100%;max-height:none!important;overflow:visible!important;border:0!important;background:#fff!important;color:#000!important;padding:0!important}
          #tx-print .no-print{display:none!important}
          #tx-print .tx-only-print{display:block}
          #tx-print table{page-break-inside:auto}
          #tx-print tr{page-break-inside:avoid}
        }
      `}</style>
      <div id="tx-print" className="max-h-[90vh] w-full max-w-[820px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
        <div className="tx-only-print mb-[10px] border-b border-apar-line pb-[8px]">
          <div className="text-[16px] font-bold">Farm Welfare Agro Limited</div>
          <div className="text-[12px]">Vendor payments · printed {new Date().toISOString().slice(0, 10)}</div>
        </div>

        <div className="mb-[14px] flex items-start justify-between gap-[10px]">
          <div>
            <h2 className="apar-h2">{d ? d.title : 'Details'}</h2>
            {d && <div className="text-[13px] text-apar-mute">{d.supplierName}{d.date ? ` · ${d.date}` : ''}</div>}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-[8px]">
            {d?.status && <span className={`${TAG} ${d.cancelled ? 'text-apar-err' : ''}`}>{d.cancelled ? 'Cancelled' : d.status}</span>}
            {d && <span className={`${TAG} ${d.glPosted ? 'text-apar-ok' : 'text-apar-warn'}`}>{d.glPosted ? 'GL posted' : 'GL not posted'}</span>}
            <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => window.print()}>Print</button>
            <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => downloadCsv(d)}>Excel</button>
            <button type="button" className="apar-ghost no-print" onClick={onClose}>Close</button>
          </div>
        </div>

        {st.loading && <div className="py-[24px] text-center text-apar-mute">Loading...</div>}
        {st.error && <div className={ERR} role="alert">{st.error}</div>}

        {d && d.invoiceForm && <InvoiceFormView f={d.invoiceForm} />}

        {d && !d.invoiceForm && (
          <>
            {d.note && <div className="mb-[12px] rounded-[9px] bg-apar-soft px-[12px] py-[10px] text-[13px]">{d.note}</div>}

            {d.fields && (
              <div className={ROW2}>
                {d.fields.map((f) => (
                  <div key={f.label}>
                    <label className="apar-label">{f.label}</label>
                    <div className="rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]">{f.value}</div>
                  </div>
                ))}
              </div>
            )}

            {d.fields && secs(d.sections.filter((x) => x.title === 'Advance lines'))}

            {journalBlock}

            {!d.fields && d.summary.length > 0 && (
              <div className="mb-[16px] mt-[16px] grid grid-cols-1 gap-x-[20px] gap-y-[8px] min-[561px]:grid-cols-2">
                {d.summary.map((s) => (
                  <div key={s.label} className="flex justify-between gap-[10px] border-b border-apar-line py-[6px] text-[13.5px]">
                    <span className="text-apar-mute">{s.label}</span>
                    <b className={s.money ? MONO : ''}>{s.money ? money(Number(s.value || 0)) : s.value}</b>
                  </div>
                ))}
              </div>
            )}

            {!d.fields && secs(d.sections)}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- read-only copy of the invoice entry form (shown in the eye-icon report of an invoice) ---------- */
function InvoiceFormView({ f }) {
  const RO = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[9px]';
  return (
    <div>
      <div className={ROW3}>
        <div><label className="apar-label">Invoice number</label><div className={`${RO} ${MONO}`}>{f.no}</div></div>
        <div><label className="apar-label">Invoice date</label><div className={RO}>{f.date || '-'}</div></div>
        <div><label className="apar-label">Due date</label><div className={RO}>{f.due || '-'}</div></div>
      </div>
      <div className={ROW}>
        <div><label className="apar-label">Description</label><div className={RO}>{f.note || '-'}</div></div>
      </div>

      <b className="mb-[8px] block text-[15px]">Invoice lines</b>
      <div className={TBLW}>
        <table className={TABLE_SM}>
          <thead>
            <tr>
              <th className={`${TH} w-[48%]`}>Account</th>
              <th className={TH}>Description</th>
              <th className={`${THN} w-[120px]`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {f.lines.map((l, i) => (
              <tr key={i}>
                <td className={TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}</td>
                <td className={TD}>{l.desc}</td>
                <td className={`${TDN} ${MONO}`}>{money(l.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className={TFN}>Invoice total</td>
              <td className={`${TFN} ${MONO}`}>{money(f.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={`${ROW2} mt-[14px]`}>
        <div><label className="apar-label">Link advance payment</label><div className={RO}>{f.advance ? f.advance.no : 'No advance link'}</div></div>
        <div><label className="apar-label">Apply from advance</label><div className={`${RO} ${MONO}`}>{f.advance ? money(f.advance.applied) : '-'}</div></div>
      </div>

      <h2 className="apar-h2">Journal entry preview</h2>
      <div className={TBLW}>
        <table className={TABLE_SM}>
          <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
          <tbody>
            {f.preview.rows.map((r, i) => (
              <tr key={i}>
                <td className={r.isCredit ? TD_CR : TD}>{r.label}</td>
                <td className={`${TDN} ${MONO}`}>{r.dr ? money(r.dr) : ''}</td>
                <td className={`${TDN} ${MONO}`}>{r.cr ? money(r.cr) : ''}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className={TD}>Total</td>
              <td className={`${TDN} ${MONO}`}>{money(f.preview.total)}</td>
              <td className={`${TDN} ${MONO}`}>{money(f.preview.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}



/* ---------- everything created under one advance (eye icon in "Advance payments") ----------
   VendorPayments.jsx er niche ager `downloadAdvanceCsv`, `TONE`, `AdvSection`, `AdvanceDetailDialog`
   delete kore eta boshao. Baki constant (TH, THN, TD, TDN, TAG, MONO, TBLW, TABLE ...) ager file-er-i. */

function downloadAdvanceCsv(d) {
  const rows = [];
  const add = (...c) => rows.push(c.map(csvCell).join(','));
  add('Farm Welfare Agro Limited');
  add(`Advance ${d.no}`); add('Vendor', d.supplierName); add('Date', d.date); add('Status', d.status);
  add();
  add('Summary');
  add('Advance amount', d.summary.total); add('Applied to invoices', d.summary.applied);
  add('Refunded', d.summary.refunded); add('Balance', d.summary.balance);
  add();
  add('Transactions');
  d.rows.forEach((r) => {
    add();
    add(r.date, r.journalNo, r.type + (r.reversal ? ' (Reversal)' : ''), r.description, r.amount);
    const x = r.detail;
    if (x?.kind === 'advance') {
      x.fields.forEach((f) => add('', f.label, f.value));
      x.lines.forEach((l) => add('', `Line ${l.lineNo}`, l.desc, l.amount));
    } else if (x?.invoice) {
      add('', 'Invoice', x.invoice.no, x.invoice.note);
      add('', 'Invoice date', x.invoice.date, 'Due', x.invoice.due);
      if (x.kind === 'invoice') x.invoice.lines.forEach((l) => add('', l.account, l.accountName, l.desc, l.amount));
      add('', 'Invoice total', x.invoice.total, 'From this advance', x.invoice.fromAdvance, 'Balance', x.invoice.balance);
    } else if (x?.kind === 'payment') {
      x.items.forEach((i) => add('', i.invNo, 'from this advance', i.amount));
    } else if (x?.kind === 'refund') {
      add('', 'Refunded to', x.refund.bankName || x.refund.bank, x.refund.method, x.refund.ref, x.refund.status);
    }
    add('', 'Account', 'Account name', 'Debit', 'Credit');
    r.lines.forEach((l) => add('', l.account, l.accountName, l.debit || '', l.credit || ''));
  });
  const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `Advance_${d.no}.csv`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* plain label/value pairs (no input-box look) */
function Kv({ items }) {
  return (
    <div className="mb-[10px] grid grid-cols-2 gap-x-[20px] gap-y-[6px] min-[561px]:grid-cols-4">
      {items.map(([k, v]) => (
        <div key={k}>
          <span className="block text-[12px] text-apar-mute">{k}</span>
          <span className="text-[13.5px]">{v || '-'}</span>
        </div>
      ))}
    </div>
  );
}

function MiniTable({ cols, rows, footer }) {
  return (
    <div className={TBLW}>
      <table className={TABLE_SM}>
        <thead><tr>{cols.map((c) => <th key={c.key} className={c.num ? THN : TH}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{cols.map((c) => <td key={c.key} className={c.num ? `${TDN} ${MONO}` : TD}>{c.money ? money(r[c.key]) : r[c.key]}</td>)}</tr>
          ))}
        </tbody>
        {footer && (
          <tfoot><tr>
            <td colSpan={cols.length - 1} className={TFN}>{footer.label}</td>
            <td className={`${TFN} ${MONO}`}>{money(footer.value)}</td>
          </tr></tfoot>
        )}
      </table>
    </div>
  );
}

function RowDetail({ r }) {
  const x = r.detail;
  const dr = r.lines.reduce((t, l) => t + l.debit, 0), cr = r.lines.reduce((t, l) => t + l.credit, 0);
  return (
    <div className="px-[6px] py-[12px]">
      {x?.kind === 'advance' && (
        <>
          <Kv items={x.fields.map((f) => [f.label, f.value])} />
          <MiniTable
            cols={[{ key: 'lineNo', label: '#' }, { key: 'desc', label: 'Description' }, { key: 'amount', label: 'Amount', num: true, money: true }]}
            rows={x.lines} footer={{ label: 'Total advance', value: x.total }}
          />
        </>
      )}

      {(x?.kind === 'invoice' || x?.kind === 'apply') && (
        <>
          <Kv items={[
            ['Invoice', x.invoice.no], ['Invoice date', x.invoice.date], ['Due date', x.invoice.due], ['Status', x.invoice.status],
            ['Description', x.invoice.note],
          ]} />
          {x.kind === 'invoice' ? (
            <MiniTable
              cols={[
                { key: 'account', label: 'Account' }, { key: 'desc', label: 'Description' },
                { key: 'amount', label: 'Amount', num: true, money: true },
              ]}
              rows={x.invoice.lines.map((l) => ({ ...l, account: `${l.account}${l.accountName ? ' · ' + l.accountName : ''}` }))}
              footer={{ label: 'Invoice total', value: x.invoice.total }}
            />
          ) : (
            <div className="ml-auto max-w-[360px]">
              <div className={LINE}><span>Invoice total</span><span className={MONO}>{money(x.invoice.total)}</span></div>
              <div className={LINE}><span>From this advance</span><span className={`${MONO} text-apar-ok`}>{money(x.invoice.fromAdvance)}</span></div>
              <div className={LINE}><span>Invoice balance</span><span className={MONO}>{money(x.invoice.balance)}</span></div>
            </div>
          )}
        </>
      )}

      {x?.kind === 'payment' && (
        <>
          <Kv items={[['Payment', x.payNo]]} />
          <MiniTable
            cols={[{ key: 'invNo', label: 'Invoice' }, { key: 'note', label: 'Description' }, { key: 'amount', label: 'From this advance', num: true, money: true }]}
            rows={x.items}
          />
        </>
      )}

      {x?.kind === 'refund' && (
        <Kv items={[
          ['Refund', x.refund.no], ['Refunded to', `${x.refund.bank}${x.refund.bankName ? ' · ' + x.refund.bankName : ''}`],
          ['Method', x.refund.method], ['Reference', x.refund.ref], ['Remarks', x.refund.remarks],
          ['Status', x.refund.status],
        ]} />
      )}

      <b className="mb-[4px] mt-[6px] block text-[13px]">Journal entry</b>
      <div className={TBLW}>
        <table className={TABLE_SM}>
          <thead><tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
          <tbody>
            {r.lines.map((l, i) => (
              <tr key={i}>
                <td className={l.credit > 0 ? TD_CR : TD}>{l.account}{l.accountName ? ` · ${l.accountName}` : ''}</td>
                <td className={`${TDN} ${MONO}`}>{l.debit ? money(l.debit) : ''}</td>
                <td className={`${TDN} ${MONO}`}>{l.credit ? money(l.credit) : ''}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className={TD}>Total</td>
              <td className={`${TDN} ${MONO}`}>{money(dr)}</td>
              <td className={`${TDN} ${MONO}`}>{money(cr)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdvanceDetailDialog({ advId, onClose }) {
  const [st, setSt] = useState({ loading: true, error: '', data: null });
  const [open, setOpen] = useState({});

  useEffect(() => {
    let off = false;
    (async () => {
      setSt({ loading: true, error: '', data: null });
      try {
        const res = await api.get(`/ap/advance_detail/${advId}`);
        if (off) return;
        if (!res.ok) { setSt({ loading: false, error: res.data?.error || 'Failed to load details', data: null }); return; }
        setSt({ loading: false, error: '', data: res.data });
        setOpen({});
      } catch (e) {
        if (!off) setSt({ loading: false, error: e.message || 'Failed to load details', data: null });
      }
    })();
    return () => { off = true; };
  }, [advId]);

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const d = st.data;
  const rows = d ? d.rows : [];
  const allOpen = rows.length > 0 && rows.every((r) => open[r.journalId]);
  const setAll = (v) => { const o = {}; rows.forEach((r) => { o[r.journalId] = v; }); setOpen(o); };
  const toggle = (jid) => setOpen((p) => ({ ...p, [jid]: !p[jid] }));
  // print: sob row khule dao, tarpor print
  const doPrint = () => { setAll(true); setTimeout(() => window.print(), 60); };

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-[16px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <style>{`
        .tx-only-print{display:none}
        @media print{
          @page{margin:14mm}
          body *{visibility:hidden}
          #adv-print,#adv-print *{visibility:visible}
          #adv-print{position:absolute;left:0;top:0;width:100%;max-height:none!important;overflow:visible!important;border:0!important;background:#fff!important;color:#000!important;padding:0!important}
          #adv-print .no-print{display:none!important}
          #adv-print .tx-only-print{display:block}
          #adv-print tr{page-break-inside:avoid}
        }
      `}</style>
      <div id="adv-print" className="max-h-[90vh] w-full max-w-[900px] overflow-auto rounded-xl border border-apar-line bg-apar-panel p-[20px]">
        <div className="tx-only-print mb-[10px] border-b border-apar-line pb-[8px]">
          <div className="text-[16px] font-bold">Farm Welfare Agro Limited</div>
          <div className="text-[12px]">Advance details · printed {new Date().toISOString().slice(0, 10)}</div>
        </div>

        <div className="mb-[14px] flex items-start justify-between gap-[10px]">
          <div>
            <h2 className="apar-h2">{d ? `Advance ${d.no}` : 'Advance details'}</h2>
            {d && <div className="text-[13px] text-apar-mute">{d.supplierName} · {d.date}</div>}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-[8px]">
            {d && <span className={TAG}>{d.status}</span>}
            <button type="button" className="apar-ghost no-print" disabled={!d} onClick={doPrint}>Print</button>
            <button type="button" className="apar-ghost no-print" disabled={!d} onClick={() => downloadAdvanceCsv(d)}>Excel</button>
            <button type="button" className="apar-ghost no-print" onClick={onClose}>Close</button>
          </div>
        </div>

        {st.loading && <div className="py-[24px] text-center text-apar-mute">Loading...</div>}
        {st.error && <div className={ERR} role="alert">{st.error}</div>}

        {d && (
          <>
            <div className="mb-[16px] grid grid-cols-2 gap-[10px] min-[561px]:grid-cols-4">
              <div className={STAT_BOX}><span className={STAT_LABEL}>Advance amount</span><b className={MONO}>{money(d.summary.total)}</b></div>
              <div className={STAT_BOX}><span className={STAT_LABEL}>Applied to invoices</span><b className={MONO}>{money(d.summary.applied)}</b></div>
              <div className={STAT_BOX}><span className={STAT_LABEL}>Refunded</span><b className={MONO}>{money(d.summary.refunded)}</b></div>
              <div className={STAT_BOX}><span className={STAT_LABEL}>Remaining balance</span><b className={`${MONO} text-apar-ok`}>{money(d.summary.balance)}</b></div>
            </div>

            <div className={ADDBAR}>
              <b className="text-[15px]">Transactions</b>
              <button type="button" className="apar-ghost no-print" onClick={() => setAll(!allOpen)}>{allOpen ? 'Collapse all' : 'Expand all'}</button>
            </div>

            <div className={TBLW}>
              <table className={TABLE}>
                <thead>
                  <tr>
                    <th className={TH}>Date</th><th className={TH}>Voucher</th><th className={TH}>Type</th>
                    <th className={TH}>Description</th><th className={THN}>Amount</th><th className={`${TH} w-[28px]`}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? rows.map((r) => {
                    const isOpen = !!open[r.journalId];
                    return (
                      <FragmentRow key={r.journalId}>
                        <tr className="cursor-pointer hover:bg-apar-soft" onClick={() => toggle(r.journalId)}>
                          <td className={TD}>{r.date}</td>
                          <td className={`${TD} ${MONO}`}>{r.journalNo}</td>
                          <td className={TD}>
                            <span className={`${TAG} ${r.reversal ? 'text-apar-err' : ''}`}>{r.type}{r.reversal ? ' · Reversal' : ''}</span>
                          </td>
                          <td className={`${TD} text-apar-mute`}>{r.description}</td>
                          <td className={`${TDN} ${MONO}`}>{money(r.amount)}</td>
                          <td className={`${TD} text-apar-mute`}>{isOpen ? '▾' : '▸'}</td>
                        </tr>
                        {isOpen && (
                          <tr><td colSpan={6} className="border-b border-apar-line bg-apar-field p-0"><RowDetail r={r} /></td></tr>
                        )}
                      </FragmentRow>
                    );
                  }) : <tr><td colSpan={6} className={TD_EMPTY}>No transactions found for this advance.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// small helper so a data row + its detail row can share one key
function FragmentRow({ children }) { return <>{children}</>; }
