// import PageContainer from "@/components/page-container";
import InventoryList from "./inventory-list";
// import { Section } from "lucide-react";
import { SectionContainer } from "@/components/SectionContainer";

const InventoriesPage = () => {
  return (
    <SectionContainer>
      <InventoryList />
    </SectionContainer>
  );
};

export default InventoriesPage;