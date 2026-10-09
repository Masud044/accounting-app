// import { useEffect, useState } from 'react';
// import { api, money } from '../api.js';

// const TABS = [
//   { id: 'aging', label: 'Aging Report' },
//   { id: 'outstanding', label: 'Outstanding Summary' },
//   { id: 'statement', label: 'Statement' },
//   { id: 'gl', label: 'GL Summary' },
// ];

// export default function Reports() {
//   const [tab, setTab] = useState('aging');
//   return (
//     <div className="wrap">
//       <h1 style={{ marginBottom: 14 }}>Reports</h1>
//       <div className="seg" style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)`, marginBottom: 20 }}>
//         {TABS.map((t) => (
//           <button key={t.id} type="button" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}><b>{t.label}</b></button>
//         ))}
//       </div>
//       {tab === 'aging' && <AgingReport />}
//       {tab === 'outstanding' && <OutstandingReport />}
//       {tab === 'statement' && <StatementReport />}
//       {tab === 'gl' && <GlSummaryReport />}
//     </div>
//   );
// }

// function ModuleToggle({ module, setModule }) {
//   return (
//     <div className="filters">
//       <div><label>Module</label>
//         <select value={module} onChange={(e) => setModule(e.target.value)}>
//           <option value="AP">AP (Vendors)</option>
//           <option value="AR">AR (Customers)</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// const BUCKETS = [
//   { key: 'current', label: 'Current' },
//   { key: 'd130', label: '1-30 days' },
//   { key: 'd3160', label: '31-60 days' },
//   { key: 'd6190', label: '61-90 days' },
//   { key: 'd90', label: '90+ days' },
// ];

// function AgingReport() {
//   const [module, setModule] = useState('AP');
//   const [data, setData] = useState({ parties: [], totals: {} });

//   useEffect(() => { (async () => setData((await api.get(`/reports/aging?module=${module}`)).data))(); }, [module]);

//   return (
//     <div>
//       <ModuleToggle module={module} setModule={setModule} />
//       <div className="card">
//         <div className="tblw"><table>
//           <thead><tr><th>{module === 'AP' ? 'Vendor' : 'Customer'}</th>{BUCKETS.map((b) => <th className="n" key={b.key}>{b.label}</th>)}<th className="n">Total</th></tr></thead>
//           <tbody>
//             {data.parties.map((p) => (
//               <tr key={p.partyId}>
//                 <td>{p.partyName}</td>
//                 {BUCKETS.map((b) => <td className="n mono" key={b.key}>{p[b.key] > 0 ? money(p[b.key]) : ''}</td>)}
//                 <td className="n mono" style={{ fontWeight: 700 }}>{money(p.total)}</td>
//               </tr>
//             ))}
//             {!data.parties.length && <tr><td colSpan={BUCKETS.length + 2} className="empty">No outstanding invoices.</td></tr>}
//           </tbody>
//           {data.parties.length > 0 && (
//             <tfoot><tr style={{ fontWeight: 700 }}>
//               <td>Total</td>
//               {BUCKETS.map((b) => <td className="n mono" key={b.key}>{money(data.totals[b.key] || 0)}</td>)}
//               <td className="n mono">{money(data.totals.total || 0)}</td>
//             </tr></tfoot>
//           )}
//         </table></div>
//       </div>
//     </div>
//   );
// }

// function OutstandingReport() {
//   const [module, setModule] = useState('AP');
//   const [data, setData] = useState({ rows: [], totals: {} });

//   useEffect(() => { (async () => setData((await api.get(`/reports/outstanding?module=${module}`)).data))(); }, [module]);

//   return (
//     <div>
//       <ModuleToggle module={module} setModule={setModule} />
//       <div className="card">
//         <div className="tblw"><table>
//           <thead><tr><th>{module === 'AP' ? 'Vendor' : 'Customer'}</th><th className="n">Outstanding</th><th className="n">Advance balance</th></tr></thead>
//           <tbody>
//             {data.rows.map((r) => (
//               <tr key={r.id}><td>{r.name}</td><td className="n mono">{money(r.outstanding)}</td><td className="n mono pos">{money(r.advanceBalance)}</td></tr>
//             ))}
//             {!data.rows.length && <tr><td colSpan={3} className="empty">Nothing outstanding.</td></tr>}
//           </tbody>
//           {data.rows.length > 0 && (
//             <tfoot><tr style={{ fontWeight: 700 }}><td>Total</td><td className="n mono">{money(data.totals.outstanding || 0)}</td><td className="n mono">{money(data.totals.advanceBalance || 0)}</td></tr></tfoot>
//           )}
//         </table></div>
//       </div>
//     </div>
//   );
// }

// function StatementReport() {
//   const [module, setModule] = useState('AP');
//   const [parties, setParties] = useState([]);
//   const [partyId, setPartyId] = useState('');
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const res = await api.get(module === 'AP' ? '/ap/vendors' : '/ar/customers');
//       setParties(res.data);
//       setPartyId(res.data.length ? String(res.data[0].id) : '');
//     })();
//   }, [module]);

//   useEffect(() => {
//     if (!partyId) { setData(null); return; }
//     (async () => setData((await api.get(`/reports/statement?module=${module}&partyId=${partyId}`)).data))();
//   }, [module, partyId]);

//   return (
//     <div>
//       <div className="filters">
//         <div><label>Module</label><select value={module} onChange={(e) => setModule(e.target.value)}><option value="AP">AP (Vendors)</option><option value="AR">AR (Customers)</option></select></div>
//         <div><label>{module === 'AP' ? 'Vendor' : 'Customer'}</label>
//           <select value={partyId} onChange={(e) => setPartyId(e.target.value)}>{parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
//         </div>
//       </div>
//       {data && (
//         <div className="card">
//           <h2>{data.partyName}</h2>
//           <div className="tblw"><table>
//             <thead><tr><th>Date</th><th>Voucher</th><th>Type</th><th>Description</th><th className="n">Amount</th></tr></thead>
//             <tbody>
//               {data.rows.map((r, i) => (
//                 <tr key={i}>
//                   <td>{r.date}</td><td className="mono">{r.no}</td><td><span className="tag">{r.sourceType}</span></td><td style={{ color: 'var(--mute)' }}>{r.description}</td>
//                   <td className="n mono">{money(r.amount)}</td>
//                 </tr>
//               ))}
//               {!data.rows.length && <tr><td colSpan={5} className="empty">No activity yet.</td></tr>}
//             </tbody>
//           </table></div>
//           <p style={{ color: 'var(--mute)', fontSize: 12.5 }}>A chronological transaction list — not a cumulative balance (an "advance applied" entry and the invoice it applies to represent different things that happen to share an amount, so they can't be meaningfully summed into one running total). The Outstanding / Advance balance shown on the main page remain the authoritative figures.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// function GlSummaryReport() {
//   const [module, setModule] = useState('');
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [data, setData] = useState({ rows: [], totals: {} });

//   async function load() {
//     const qs = new URLSearchParams({ module, from, to }).toString();
//     setData((await api.get(`/reports/gl-summary?${qs}`)).data);
//   }
//   useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <div>
//       <div className="filters">
//         <div><label>Module</label><select value={module} onChange={(e) => setModule(e.target.value)}><option value="">All (AP + AR)</option><option value="AP">AP only</option><option value="AR">AR only</option></select></div>
//         <div><label>From</label><input className="in" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
//         <div><label>To</label><input className="in" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
//         <div><button className="btn" style={{ marginTop: 0 }} onClick={load}>Filter</button></div>
//       </div>
//       <div className="card">
//         <div className="tblw"><table>
//           <thead><tr><th>Account</th><th className="n">Debit</th><th className="n">Credit</th><th className="n">Net</th></tr></thead>
//           <tbody>
//             {data.rows.map((r) => (
//               <tr key={r.code}><td>{r.code} - {r.name}</td><td className="n mono">{money(r.debit)}</td><td className="n mono">{money(r.credit)}</td><td className={`n mono ${r.net >= 0 ? 'pos' : 'neg'}`}>{money(r.net)}</td></tr>
//             ))}
//             {!data.rows.length && <tr><td colSpan={4} className="empty">No GL activity in this range.</td></tr>}
//           </tbody>
//           {data.rows.length > 0 && (
//             <tfoot><tr style={{ fontWeight: 700 }}><td>Total</td><td className="n mono">{money(data.totals.debit || 0)}</td><td className="n mono">{money(data.totals.credit || 0)}</td><td className="n mono">{money((data.totals.debit || 0) - (data.totals.credit || 0))}</td></tr></tfoot>
//           )}
//         </table></div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
import {
  Page, H1, CARD, FILTERS, SEG_BTN, TBLW, TABLE, TH, THN, TD, TDN, TD_EMPTY, TAG, MONO,
} from '../components/aparUi.jsx';

const TABS = [
  { id: 'aging', label: 'Aging Report' },
  { id: 'outstanding', label: 'Outstanding Summary' },
  { id: 'statement', label: 'Statement' },
  { id: 'gl', label: 'GL Summary' },
];

export default function Reports() {
  const [tab, setTab] = useState('aging');
  return (
    <Page>
      <h1 className={`${H1} mb-[14px]`}>Reports</h1>
      <div className="mb-[20px] grid gap-[10px]" style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)` }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" className={SEG_BTN} aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>
            <b className="block">{t.label}</b>
          </button>
        ))}
      </div>
      {tab === 'aging' && <AgingReport />}
      {tab === 'outstanding' && <OutstandingReport />}
      {tab === 'statement' && <StatementReport />}
      {tab === 'gl' && <GlSummaryReport />}
    </Page>
  );
}

function ModuleToggle({ module, setModule }) {
  return (
    <div className={FILTERS}>
      <div>
        <label className="apar-label">Module</label>
        <select className="apar-select" value={module} onChange={(e) => setModule(e.target.value)}>
          <option value="AP">AP (Vendors)</option>
          <option value="AR">AR (Customers)</option>
        </select>
      </div>
    </div>
  );
}

const BUCKETS = [
  { key: 'current', label: 'Current' },
  { key: 'd130', label: '1-30 days' },
  { key: 'd3160', label: '31-60 days' },
  { key: 'd6190', label: '61-90 days' },
  { key: 'd90', label: '90+ days' },
];

function AgingReport() {
  const [module, setModule] = useState('AP');
  const [data, setData] = useState({ parties: [], totals: {} });

  useEffect(() => { (async () => setData((await api.get(`/reports/aging?module=${module}`)).data))(); }, [module]);

  return (
    <div>
      <ModuleToggle module={module} setModule={setModule} />
      <div className={CARD}>
        <div className={TBLW}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH}>{module === 'AP' ? 'Vendor' : 'Customer'}</th>
                {BUCKETS.map((b) => <th className={THN} key={b.key}>{b.label}</th>)}
                <th className={THN}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.parties.map((p) => (
                <tr key={p.partyId}>
                  <td className={TD}>{p.partyName}</td>
                  {BUCKETS.map((b) => <td className={`${TDN} ${MONO}`} key={b.key}>{p[b.key] > 0 ? money(p[b.key]) : ''}</td>)}
                  <td className={`${TDN} ${MONO} font-bold`}>{money(p.total)}</td>
                </tr>
              ))}
              {!data.parties.length && <tr><td colSpan={BUCKETS.length + 2} className={TD_EMPTY}>No outstanding invoices.</td></tr>}
            </tbody>
            {data.parties.length > 0 && (
              <tfoot>
                <tr className="font-bold">
                  <td className={TD}>Total</td>
                  {BUCKETS.map((b) => <td className={`${TDN} ${MONO}`} key={b.key}>{money(data.totals[b.key] || 0)}</td>)}
                  <td className={`${TDN} ${MONO}`}>{money(data.totals.total || 0)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

function OutstandingReport() {
  const [module, setModule] = useState('AP');
  const [data, setData] = useState({ rows: [], totals: {} });

  useEffect(() => { (async () => setData((await api.get(`/reports/outstanding?module=${module}`)).data))(); }, [module]);

  return (
    <div>
      <ModuleToggle module={module} setModule={setModule} />
      <div className={CARD}>
        <div className={TBLW}>
          <table className={TABLE}>
            <thead>
              <tr>
                <th className={TH}>{module === 'AP' ? 'Vendor' : 'Customer'}</th>
                <th className={THN}>Outstanding</th>
                <th className={THN}>Advance balance</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.id}>
                  <td className={TD}>{r.name}</td>
                  <td className={`${TDN} ${MONO}`}>{money(r.outstanding)}</td>
                  <td className={`${TDN} ${MONO} text-apar-ok`}>{money(r.advanceBalance)}</td>
                </tr>
              ))}
              {!data.rows.length && <tr><td colSpan={3} className={TD_EMPTY}>Nothing outstanding.</td></tr>}
            </tbody>
            {data.rows.length > 0 && (
              <tfoot>
                <tr className="font-bold">
                  <td className={TD}>Total</td>
                  <td className={`${TDN} ${MONO}`}>{money(data.totals.outstanding || 0)}</td>
                  <td className={`${TDN} ${MONO}`}>{money(data.totals.advanceBalance || 0)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

function StatementReport() {
  const [module, setModule] = useState('AP');
  const [parties, setParties] = useState([]);
  const [partyId, setPartyId] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.get(module === 'AP' ? '/ap/vendors' : '/ar/customers');
      setParties(res.data);
      setPartyId(res.data.length ? String(res.data[0].id) : '');
    })();
  }, [module]);

  useEffect(() => {
    if (!partyId) { setData(null); return; }
    (async () => setData((await api.get(`/reports/statement?module=${module}&partyId=${partyId}`)).data))();
  }, [module, partyId]);

  return (
    <div>
      <div className={FILTERS}>
        <div>
          <label className="apar-label">Module</label>
          <select className="apar-select" value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="AP">AP (Vendors)</option><option value="AR">AR (Customers)</option>
          </select>
        </div>
        <div>
          <label className="apar-label">{module === 'AP' ? 'Vendor' : 'Customer'}</label>
          <select className="apar-select" value={partyId} onChange={(e) => setPartyId(e.target.value)}>
            {parties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      {data && (
        <div className={CARD}>
          <h2 className="apar-h2">{data.partyName}</h2>
          <div className={TBLW}>
            <table className={TABLE}>
              <thead>
                <tr>
                  <th className={TH}>Date</th><th className={TH}>Voucher</th><th className={TH}>Type</th>
                  <th className={TH}>Description</th><th className={THN}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r, i) => (
                  <tr key={i}>
                    <td className={TD}>{r.date}</td>
                    <td className={`${TD} ${MONO}`}>{r.no}</td>
                    <td className={TD}><span className={TAG}>{r.sourceType}</span></td>
                    <td className={`${TD} text-apar-mute`}>{r.description}</td>
                    <td className={`${TDN} ${MONO}`}>{money(r.amount)}</td>
                  </tr>
                ))}
                {!data.rows.length && <tr><td colSpan={5} className={TD_EMPTY}>No activity yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="my-[14.5px] text-[12.5px] text-apar-mute">A chronological transaction list — not a cumulative balance (an "advance applied" entry and the invoice it applies to represent different things that happen to share an amount, so they can't be meaningfully summed into one running total). The Outstanding / Advance balance shown on the main page remain the authoritative figures.</p>
        </div>
      )}
    </div>
  );
}

function GlSummaryReport() {
  const [module, setModule] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState({ rows: [], totals: {} });

  async function load() {
    const qs = new URLSearchParams({ module, from, to }).toString();
    setData((await api.get(`/reports/gl-summary?${qs}`)).data);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className={FILTERS}>
        <div>
          <label className="apar-label">Module</label>
          <select className="apar-select" value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="">All (AP + AR)</option><option value="AP">AP only</option><option value="AR">AR only</option>
          </select>
        </div>
        <div><label className="apar-label">From</label><input className="apar-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="apar-label">To</label><input className="apar-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div><button className="apar-btn" onClick={load}>Filter</button></div>
      </div>
      <div className={CARD}>
        <div className={TBLW}>
          <table className={TABLE}>
            <thead>
              <tr><th className={TH}>Account</th><th className={THN}>Debit</th><th className={THN}>Credit</th><th className={THN}>Net</th></tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.code}>
                  <td className={TD}>{r.code} - {r.name}</td>
                  <td className={`${TDN} ${MONO}`}>{money(r.debit)}</td>
                  <td className={`${TDN} ${MONO}`}>{money(r.credit)}</td>
                  <td className={`${TDN} ${MONO} ${r.net >= 0 ? 'text-apar-ok' : 'text-apar-err'}`}>{money(r.net)}</td>
                </tr>
              ))}
              {!data.rows.length && <tr><td colSpan={4} className={TD_EMPTY}>No GL activity in this range.</td></tr>}
            </tbody>
            {data.rows.length > 0 && (
              <tfoot>
                <tr className="font-bold">
                  <td className={TD}>Total</td>
                  <td className={`${TDN} ${MONO}`}>{money(data.totals.debit || 0)}</td>
                  <td className={`${TDN} ${MONO}`}>{money(data.totals.credit || 0)}</td>
                  <td className={`${TDN} ${MONO}`}>{money((data.totals.debit || 0) - (data.totals.credit || 0))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}