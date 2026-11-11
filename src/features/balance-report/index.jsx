// ⚠️ tomar SectionContainer-er path mile nao

import { SectionContainer } from "@/components/SectionContainer";
import BalanceSheetPage from "./balance-report-page";


export default function BalanceSheet() {
  return (
    <SectionContainer title="Balance sheet">
      <BalanceSheetPage />
    </SectionContainer>
  );
}