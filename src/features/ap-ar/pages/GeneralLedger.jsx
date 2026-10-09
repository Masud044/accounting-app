// import { useEffect, useState } from 'react';
// import { api, money } from '../api.js';

// const VOUCHER_TYPE_LABEL = { 1: 'Receipt', 2: 'Payment', 3: 'General Journal' };

// export default function GeneralLedger() {
//   const [accounts, setAccounts] = useState([]);
//   const [module, setModule] = useState('');
//   const [account, setAccount] = useState('');
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [data, setData] = useState({ headers: [], totalDr: 0, totalCr: 0 });

//   useEffect(() => { (async () => setAccounts((await api.get('/gl-accounts')).data))(); }, []);

//   async function load() {
//     const qs = new URLSearchParams({ module, account, from, to }).toString();
//     const res = await api.get(`/general-ledger-ap?${qs}`);
//     setData(res.data);
//   }
//   useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const balanced = Math.abs(data.totalDr - data.totalCr) < 0.01;

//   return (
//     <div className="wrap">
//       <h1 style={{ marginBottom: 4 }}>General Ledger</h1>
//       <p style={{ color: 'var(--mute)', marginTop: 0 }}>
//         The company's existing general ledger (GLMASTER / GLDETAILS), showing only vouchers posted by this AP/AR app.
//         New vouchers land here as <strong>unposted</strong>, pending the normal approval step in that system.
//       </p>

//       <div className="filters">
//         <div><label>Module</label><select value={module} onChange={(e) => setModule(e.target.value)}>
//           <option value="">All (AP + AR)</option><option value="AP">AP only</option><option value="AR">AR only</option>
//         </select></div>
//         <div><label>Account</label><select value={account} onChange={(e) => setAccount(e.target.value)}>
//           <option value="">All accounts</option>{accounts.map((a) => <option key={a.code} value={a.code}>{a.code} - {a.name}</option>)}
//         </select></div>
//         <div><label>From</label><input className="in" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
//         <div><label>To</label><input className="in" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
//         <div><button className="btn" style={{ marginTop: 0 }} onClick={load}>Filter</button></div>
//       </div>

//       <div className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <div><span style={{ color: 'var(--mute)' }}>Vouchers shown</span> <b>{data.headers.length}</b></div>
//         <div><span style={{ color: 'var(--mute)' }}>Total Debit</span> <b className="mono">{money(data.totalDr)}</b></div>
//         <div><span style={{ color: 'var(--mute)' }}>Total Credit</span> <b className="mono">{money(data.totalCr)}</b></div>
//         <div><span style={{ color: 'var(--mute)' }}>Balanced?</span> <b style={{ color: balanced ? 'var(--ok)' : 'var(--err)' }}>{balanced ? 'Yes' : 'No'}</b></div>
//       </div>

//       {data.headers.map((h) => {
//         const isAr = h.no.startsWith('JRN-AR-');
//         return (
//           <div className="card" key={h.id}>
//             <div className="top" style={{ marginBottom: 8 }}>
//               <div>
//                 <strong className="mono">{h.no}</strong>
//                 <span className={`badge ${isAr ? 'ar' : 'ap'}`}>{isAr ? 'AR' : 'AP'}</span>
//                 <span className="badge">{VOUCHER_TYPE_LABEL[h.voucherType] || h.voucherType}</span>
//                 <span className="badge" style={{ color: h.posted === 1 ? 'var(--ok)' : 'var(--warn)' }}>{h.posted === 1 ? 'Posted' : 'Unposted'}</span>
//                 {' — '}{h.description}
//               </div>
//               <div style={{ color: 'var(--mute)' }}>{h.date}</div>
//             </div>
//             <div className="tblw"><table>
//               <thead><tr><th>Account</th><th>Description</th><th className="n">Debit</th><th className="n">Credit</th></tr></thead>
//               <tbody>
//                 {h.lines.map((l, i) => (
//                   <tr key={i}><td>{l.code} - {l.codeDesc}</td><td style={{ color: 'var(--mute)' }}>{l.desc}</td><td className="n">{l.debit > 0 ? money(l.debit) : ''}</td><td className="n">{l.credit > 0 ? money(l.credit) : ''}</td></tr>
//                 ))}
//               </tbody>
//             </table></div>
//           </div>
//         );
//       })}
//       {!data.headers.length && <div className="card empty">No GL entries match this filter.</div>}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
import {
  Page, H1, CARD, TOP_SM, FILTERS, TBLW, TABLE, TH, THN, TD, TDN, TD_EMPTY, BADGE, MONO,
} from '../components/aparUi.jsx';

const VOUCHER_TYPE_LABEL = { 1: 'Receipt', 2: 'Payment', 3: 'General Journal' };

export default function GeneralLedger() {
  const [accounts, setAccounts] = useState([]);
  const [module, setModule] = useState('');
  const [account, setAccount] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState({ headers: [], totalDr: 0, totalCr: 0 });

  useEffect(() => { (async () => setAccounts((await api.get('/gl-accounts')).data))(); }, []);

  async function load() {
    const qs = new URLSearchParams({ module, account, from, to }).toString();
    const res = await api.get(`/general-ledger-ap?${qs}`);
    setData(res.data);
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const balanced = Math.abs(data.totalDr - data.totalCr) < 0.01;

  return (
    <Page>
      <h1 className={`${H1} mb-[4px]`}>General Ledger</h1>
      <p className="mb-[14.5px] text-apar-mute">
        The company's existing general ledger (GLMASTER / GLDETAILS), showing only vouchers posted by this AP/AR app.
        New vouchers land here as <strong>unposted</strong>, pending the normal approval step in that system.
      </p>

      <div className={FILTERS}>
        <div>
          <label className="apar-label">Module</label>
          <select className="apar-select" value={module} onChange={(e) => setModule(e.target.value)}>
            <option value="">All (AP + AR)</option><option value="AP">AP only</option><option value="AR">AR only</option>
          </select>
        </div>
        <div>
          <label className="apar-label">Account</label>
          <select className="apar-select" value={account} onChange={(e) => setAccount(e.target.value)}>
            <option value="">All accounts</option>{accounts.map((a) => <option key={a.code} value={a.code}>{a.code} - {a.name}</option>)}
          </select>
        </div>
        <div><label className="apar-label">From</label><input className="apar-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="apar-label">To</label><input className="apar-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div><button className="apar-btn" onClick={load}>Filter</button></div>
      </div>

      <div className={`${CARD} flex justify-between`}>
        <div><span className="text-apar-mute">Vouchers shown</span> <b>{data.headers.length}</b></div>
        <div><span className="text-apar-mute">Total Debit</span> <b className={MONO}>{money(data.totalDr)}</b></div>
        <div><span className="text-apar-mute">Total Credit</span> <b className={MONO}>{money(data.totalCr)}</b></div>
        <div><span className="text-apar-mute">Balanced?</span> <b className={balanced ? 'text-apar-ok' : 'text-apar-err'}>{balanced ? 'Yes' : 'No'}</b></div>
      </div>

      {data.headers.map((h) => {
        const isAr = h.no.startsWith('JRN-AR-');
        return (
          <div className={CARD} key={h.id}>
            <div className={TOP_SM}>
              <div>
                <strong className={MONO}>{h.no}</strong>
                <span className={`${BADGE} ${isAr ? 'text-apar-acc' : 'text-apar-err'}`}>{isAr ? 'AR' : 'AP'}</span>
                <span className={BADGE}>{VOUCHER_TYPE_LABEL[h.voucherType] || h.voucherType}</span>
                <span className={`${BADGE} ${h.posted === 1 ? 'text-apar-ok' : 'text-apar-warn'}`}>{h.posted === 1 ? 'Posted' : 'Unposted'}</span>
                {' — '}{h.description}
              </div>
              <div className="text-apar-mute">{h.date}</div>
            </div>
            <div className={TBLW}>
              <table className={TABLE}>
                <thead><tr><th className={TH}>Account</th><th className={TH}>Description</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr></thead>
                <tbody>
                  {h.lines.map((l, i) => (
                    <tr key={i}>
                      <td className={TD}>{l.code} - {l.codeDesc}</td>
                      <td className={`${TD} text-apar-mute`}>{l.desc}</td>
                      <td className={TDN}>{l.debit > 0 ? money(l.debit) : ''}</td>
                      <td className={TDN}>{l.credit > 0 ? money(l.credit) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      {!data.headers.length && <div className={`${CARD} ${TD_EMPTY} border-apar-line`}>No GL entries match this filter.</div>}
    </Page>
  );
}