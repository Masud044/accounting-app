// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { api, money } from '../api.js';

// export default function JournalS() {
//   const { module } = useParams();
//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     (async () => {
//       const res = await api.get(`/journal?module=${module}`);
//       setRows(res.data);
//     })();
//   }, [module]);

//   return (
//     <div className="wrap">
//       <h1 style={{ marginBottom: 18 }}>{module} Journal</h1>
//       {rows.map((h) => (
//         <div className="card" key={h.id}>
//           <div className="top" style={{ marginBottom: 8 }}>
//             <div>
//               <strong className="mono">{h.no}</strong>
//               <span className="badge">{h.sourceType}</span>
//               {h.partyName && <span style={{ color: 'var(--mute)' }}> · {h.partyName}</span>}
//               {' — '}{h.description}
//             </div>
//             <div style={{ color: 'var(--mute)' }}>{h.date}</div>
//           </div>
//           <div className="tblw"><table>
//             <thead><tr><th>Account</th><th>Description</th><th className="n">Debit</th><th className="n">Credit</th></tr></thead>
//             <tbody>
//               {h.lines.map((l, i) => (
//                 <tr key={i}><td>{l.code} - {l.name}</td><td style={{ color: 'var(--mute)' }}>{l.desc}</td><td className="n">{l.debit > 0 ? money(l.debit) : ''}</td><td className="n">{l.credit > 0 ? money(l.credit) : ''}</td></tr>
//               ))}
//               <tr style={{ fontWeight: 700 }}><td colSpan={2}>Total</td><td className="n">{money(h.total)}</td><td className="n">{money(h.total)}</td></tr>
//             </tbody>
//           </table></div>
//         </div>
//       ))}
//       {!rows.length && <div className="card empty">No journal entries yet.</div>}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, money } from '../api.js';
import {
  Page, H1, CARD, TOP_SM, TBLW, TABLE, TH, THN, TD, TDN, BADGE, MONO,
} from '../components/aparUi.jsx';

export default function JournalS() {
  const { module } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/journal?module=${module}`);
      setRows(res.data);
    })();
  }, [module]);

  return (
    <Page>
      <h1 className={`${H1} mb-[18px]`}>{module} Journal</h1>
      {rows.map((h) => (
        <div className={CARD} key={h.id}>
          <div className={TOP_SM}>
            <div>
              <strong className={MONO}>{h.no}</strong>
              <span className={BADGE}>{h.sourceType}</span>
              {h.partyName && <span className="text-apar-mute"> · {h.partyName}</span>}
              {' — '}{h.description}
            </div>
            <div className="text-apar-mute">{h.date}</div>
          </div>
          <div className={TBLW}>
            <table className={TABLE}>
              <thead>
                <tr><th className={TH}>Account</th><th className={TH}>Description</th><th className={THN}>Debit</th><th className={THN}>Credit</th></tr>
              </thead>
              <tbody>
                {h.lines.map((l, i) => (
                  <tr key={i}>
                    <td className={TD}>{l.code} - {l.name}</td>
                    <td className={`${TD} text-apar-mute`}>{l.desc}</td>
                    <td className={TDN}>{l.debit > 0 ? money(l.debit) : ''}</td>
                    <td className={TDN}>{l.credit > 0 ? money(l.credit) : ''}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={2} className={TD}>Total</td>
                  <td className={TDN}>{money(h.total)}</td>
                  <td className={TDN}>{money(h.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {!rows.length && <div className="mb-[14px] rounded-xl border border-apar-line bg-apar-panel px-0 py-[14px] text-apar-mute">No journal entries yet.</div>}
    </Page>
  );
}