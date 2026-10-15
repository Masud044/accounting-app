
// // import { SectionContainer } from "@/components/SectionContainer";
// // import MonthlyProductionChart from "./monthly-production-chart";
// // import MonthlySummaryChart from "./monthy-summary-production";
// // import DailyTrendChart from "./daily-trend";

// // const EggDashboardPage = () => {
// //   return (
// //     <SectionContainer>
// //         <h1 className="text-center font-bold mt-2 opacity-60">Egg Production Summary</h1>
// //       <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-3">
         
// //          <DailyTrendChart></DailyTrendChart>
// //          <MonthlyProductionChart></MonthlyProductionChart>
// //          <MonthlySummaryChart></MonthlySummaryChart>
// //       </div>
// //     </SectionContainer>
// //   );
// // };

// // export default EggDashboardPage;

// import { useState } from "react";
// import { SectionContainer } from "@/components/SectionContainer";
// import MonthlyProductionChart from "./monthly-production-chart";
// import MonthlySummaryChart from "./monthy-summary-production";
// import DailyTrendChart from "./daily-trend";

// // CHICKEN_SHED.ID er sathe milaiyo
// const SHEDS = [
//   { id: 1, label: "Shed-1" },
//   { id: 2, label: "Shed-2" },
// ];

// const EggDashboardPage = () => {
//   const [activeShed, setActiveShed] = useState(SHEDS[0].id);

//   return (
//     <SectionContainer>
//       <h1 className="text-center font-bold mt-2 opacity-60">Egg Production Summary</h1>

//       {/* Shed switch */}
//       <div className="mt-4 inline-flex rounded-md border border-border bg-card p-1 gap-1">
//         {SHEDS.map((s) => (
//           <button
//             key={s.id}
//             onClick={() => setActiveShed(s.id)}
//             className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
//               activeShed === s.id
//                 ? "bg-primary text-primary-foreground"
//                 : "text-muted-foreground hover:bg-muted"
//             }`}
//           >
//             {s.label}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-3">
//         <DailyTrendChart shedId={activeShed} />
//         <MonthlyProductionChart shedId={activeShed} />
//         <MonthlySummaryChart shedId={activeShed} />
//       </div>
//     </SectionContainer>
//   );
// };

// export default EggDashboardPage;

import { SectionContainer } from "@/components/SectionContainer";
import MonthlyProductionChart from "./monthly-production-chart";
import MonthlySummaryChart from "./monthy-summary-production";
import DailyTrendChart from "./daily-trend";

// CHICKEN_SHED.ID er sathe milaiyo
const SHEDS = [
  { id: 1, label: "Shed-1" },
  { id: 2, label: "Shed-2" },
];

// 2-column row: bam e S-1, dane S-2
function PairRow({ children }) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{children}</div>;
}

const EggDashboardPage = () => {
  return (
    <SectionContainer>
      <h1 className="text-center font-bold mt-2 opacity-60">Egg Production Summary</h1>

      <div className="space-y-3 mt-5">
        {/* Daily trend: S-1 | S-2 */}
        <PairRow>
          {SHEDS.map((s) => (
            <DailyTrendChart key={s.id} shedId={s.id} shedLabel={s.label} />
          ))}
        </PairRow>

        {/* Monthly production: S-1 | S-2 */}
        <PairRow>
          {SHEDS.map((s) => (
            <MonthlyProductionChart key={s.id} shedId={s.id} shedLabel={s.label} />
          ))}
        </PairRow>

        {/* Monthly summary: S-1 | S-2 */}
        <PairRow>
          {SHEDS.map((s) => (
            <MonthlySummaryChart key={s.id} shedId={s.id} shedLabel={s.label} />
          ))}
        </PairRow>
      </div>
    </SectionContainer>
  );
};

export default EggDashboardPage;