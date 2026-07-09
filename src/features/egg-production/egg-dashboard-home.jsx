
import { SectionContainer } from "@/components/SectionContainer";
import MonthlyProductionChart from "./monthly-production-chart";
import MonthlySummaryChart from "./monthy-summary-production";
import DailyTrendChart from "./daily-trend";

const EggDashboardPage = () => {
  return (
    <SectionContainer>
        <h1 className="text-center font-bold mt-2 opacity-60">Egg Production Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-3">
         
         <DailyTrendChart></DailyTrendChart>
         <MonthlyProductionChart></MonthlyProductionChart>
         <MonthlySummaryChart></MonthlySummaryChart>
      </div>
    </SectionContainer>
  );
};

export default EggDashboardPage;