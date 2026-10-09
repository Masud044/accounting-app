// import { useEffect, useState } from 'react';
// import { api } from '../api.js';


// export default function ChartOfAccounts() {
//   const [coa, setCoa] = useState({ expense: [], bank: [] });

//   useEffect(() => { (async () => setCoa((await api.get('/ap/coa')).data))(); }, []);

//   function table(title, rows) {
//     return (
//       <div className="card">
//         <h2>{title} <span style={{ color: 'var(--mute)', fontWeight: 400 }}>({rows.length})</span></h2>
//         <div className="tblw"><table>
//           <thead><tr><th>Code</th><th>Name</th></tr></thead>
//           <tbody>{rows.map((a) => <tr key={a.code}><td className="mono">{a.code}</td><td>{a.name}</td></tr>)}</tbody>
//         </table></div>
//       </div>
//     );
//   }

//   return (
//     <div className="wrap">
//       <h1 style={{ marginBottom: 4 }}>Chart of Accounts</h1>
//       <p style={{ color: 'var(--mute)', marginTop: 0 }}>
//         The company's real chart of accounts (CHART_OF_ACCOUNT) — the single chart used by both AP and AR, and by the General Ledger.
//       </p>
//       {table('Bank / Cash accounts', coa.bank)}
//       {table('Other posting accounts', coa.expense)}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Page, H1, CARD, TBLW, TABLE, TH, TD, MONO } from '../components/aparUi.jsx';

export default function ChartOfAccounts() {
  const [coa, setCoa] = useState({ expense: [], bank: [] });

  useEffect(() => { (async () => setCoa((await api.get('/ap/coa')).data))(); }, []);

  function table(title, rows) {
    return (
      <div className={CARD}>
        <h2 className="apar-h2">{title} <span className="font-normal text-apar-mute">({rows.length})</span></h2>
        <div className={TBLW}>
          <table className={TABLE}>
            <thead><tr><th className={TH}>Code</th><th className={TH}>Name</th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.code}><td className={`${TD} ${MONO}`}>{a.code}</td><td className={TD}>{a.name}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <Page>
      <h1 className={`${H1} mb-[4px]`}>Chart of Accounts</h1>
      <p className="mb-[14.5px] text-apar-mute">
        The company's real chart of accounts (CHART_OF_ACCOUNT) — the single chart used by both AP and AR, and by the General Ledger.
      </p>
      {table('Bank / Cash accounts', coa.bank)}
      {table('Other posting accounts', coa.expense)}
    </Page>
  );
}