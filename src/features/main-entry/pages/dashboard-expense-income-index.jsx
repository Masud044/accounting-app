import { SectionContainer } from "@/components/SectionContainer";

import DashboardHome from "./DashboardHome";
import ChartListView from "../chart-account/dashboard-chart-list";
import FinancialDashboardPage from "./financial-dashboard-page";
import MonthlyDebitChart from "@/features/dashboad-debit-gl/monthly-debit-summary";
import CashFlowReport from "@/features/dashboad-debit-gl/cashflow-statement";

const DashboardExpenseIncomeIndex = () => {
  return (
    <SectionContainer>
      <ChartListView></ChartListView>
      <DashboardHome />
      <FinancialDashboardPage></FinancialDashboardPage>
      <MonthlyDebitChart></MonthlyDebitChart>
      <CashFlowReport></CashFlowReport>
    </SectionContainer>
  );
};

export default DashboardExpenseIncomeIndex;
