import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import HomeLayout from "./layout/HomeLayout";
import Payment from "./features/main-entry/pages/Payment";
import Journal from "./features/main-entry/pages/Journal";
import Receive from "./features/main-entry/pages/Receive";
import CashTransfer from "./features/main-entry/pages/CashTransfer";
import DashboardHome from "./features/main-entry/pages/DashboardHome";
import ReceiveEdit from "./features/main-entry/pages/ReceiveEdit";
import ReceiveCreate from "./features/main-entry/pages/ReceiveCreate";
import InventoriesPage from "./features/inventory-page/inventory";
import ItemStockPage from "./features/inventory-page/item-stock";
import ItemsPage from "./features/inventory-page/item";
import Requisitions from "./features/inventory-page/requisition-master";
import ChartOfAccountPage from "./features/main-entry/chart-account";
import LoginV2 from "./features/authentication-v2/index";
import RegisterV2 from "./features/authentication-v2/register-index";
import ProtectedRoute from "./pages/route/ProtectedRoute";
import UnauthorizedPage from "./pages/route/Unauthorized";

import { useAuthV2 } from "./features/authentication-v2/use-auth-v2";
import WelcomePage from "./pages/welcomePage";
import Grades from "./features/user-management";
import Roles from "./features/users/role";
import Permissions from "./features/users/permission";
import Modules from "./features/users/module";
import { NuqsAdapter } from "nuqs/adapters/react";
import UserDetailsPage from "./features/user-management/user-details";
import SupplierPage from "./features/supplier";
import CustomerPage from "./features/customer";
import JournalCreate from "./features/main-entry/pages/JournalCreate";
import JournalEdit from "./features/main-entry/pages/JournalEdit";
import PaymentCreate from "./features/main-entry/pages/PaymentCreate";
import PaymentEdit from "./features/main-entry/pages/PaymentEdit";
import CashTransferCreate from "./features/main-entry/pages/CashTransferCreate";
import SaleExpenseReportPage from "./features/account-report/sale-report";
import EggProductionPage from "./features/egg-production";
import { DashboardHomeTable } from "./features/main-entry/components/DashboardHomeTable";
import GRN from "./features/grn-master";
import InvoicePage from "./features/sale-invoice/sale-invoice-page";
import RecognitionPage from "./features/purchase-recognition/recognition-page";
import InvoiceSalesDashboard from "./features/sale-invoice/invoice-sale-dashboard";

import ApprovalDashboardPage from "./features/purchase-recognition/recognition-approval-dashboard";
import EggDashboardPage from "./features/egg-production/egg-dashboard-home";
import ChickenProjectPage from "./features/chicken-project";
import CowProjectPage from "./features/cow-project";
import FishProjectPage from "./features/fish-project";
import TrialBalancePage from "./features/account-report/trail-balance-report";
import GeneralLedgerPage from "./features/general-ledger-report";
import CashFlowPage from "./features/cash-flow-report";
import ExpenseStatementPage from "./features/expense-report";
import IncomeStatementPage from "./features/income-report";
import ChickenProjectDetailPage from "./features/chicken-project/chicken-detail-page";
import CowProjectDetail from "./features/cow-project/cow-project-detail";




import FarmCalendarPage from "./features/farm-calendar/calender-list";
import FarmCalendarDetailPage from "./features/farm-calendar/detail-calendar-page";
import ActivityLogList from "./features/farm-activity-log/activity-log-list";

const ADMIN = ["Admin"];
const ADMIN_INVENTORY = ["Admin", "Inventory"];

// ── Dashboard Index — role অনুযায়ী redirect ──────────────────────────────────
const DashboardIndex = () => {
  const { user, isLoading } = useAuthV2();
  if (isLoading) return null;

  if (user?.roles?.includes("Admin")) {
    return <WelcomePage />; // Admin → DashboardHome
  }
  return <Navigate to="/dashboard/welcome" replace />; // Inventory → WelcomePage
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <NuqsAdapter>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginV2 />} />
            <Route path="/register" element={<RegisterV2 />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Layout — Admin + Inventory */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute anyRole={ADMIN_INVENTORY}>
                  <HomeLayout />
                </ProtectedRoute>
              }
            >
              {/* ✅ Index — role অনুযায়ী DashboardHome বা Welcome */}
              <Route index element={<DashboardIndex />} />

              {/* Inventory welcome page */}
              <Route path="welcome" element={<WelcomePage />} />
              <Route
                path="overview"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />

              <Route
                path="sale-dashboard"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <InvoiceSalesDashboard></InvoiceSalesDashboard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="egg-dashboard"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <EggDashboardPage></EggDashboardPage>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/chicken-project"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                   <ChickenProjectPage></ChickenProjectPage>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/dashboard/chicken-project/:id"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                 <ChickenProjectDetailPage></ChickenProjectDetailPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/cow-project"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                  <CowProjectPage></CowProjectPage>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/dashboard/cow-project/:id"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                 <CowProjectDetail></CowProjectDetail>
                  </ProtectedRoute>
                }
              />



<Route path="/dashboard/farm-calendar" element={
  <ProtectedRoute anyRole={ADMIN}><FarmCalendarPage /></ProtectedRoute>
} />


<Route path="/dashboard/farm-calendar/:id" element={
  <ProtectedRoute anyRole={ADMIN}><FarmCalendarDetailPage /></ProtectedRoute>
} />


<Route path="farm-activity-log/detail/:detailId" element={
  <ProtectedRoute anyRole={ADMIN}>
    <ActivityLogList></ActivityLogList>
  </ProtectedRoute>
} />

      // report all 
               <Route
                path="/dashboard/trail-balance"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                 <TrialBalancePage></TrialBalancePage>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/dashboard/general-ledger"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                <GeneralLedgerPage></GeneralLedgerPage>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/dashboard/cash-flow"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                <CashFlowPage></CashFlowPage>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/dashboard/expense-report"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                <ExpenseStatementPage></ExpenseStatementPage>
                  </ProtectedRoute>
                }
              />
               <Route
                path="/dashboard/income-report"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
              <IncomeStatementPage></IncomeStatementPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/fish-project"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                  <FishProjectPage></FishProjectPage>
                  </ProtectedRoute>
                }
              />

              <Route
                path="approval-dashboard"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <ApprovalDashboardPage></ApprovalDashboardPage>
                  </ProtectedRoute>
                }
              />

              {/* Admin + Inventory উভয়ই */}
              <Route path="inventory" element={<InventoriesPage />} />
              <Route path="item-stock" element={<ItemStockPage />} />
              <Route path="item" element={<ItemsPage />} />
              <Route path="dispatch" element={<Requisitions />} />

              {/* admin only- user management */}
              <Route
                path="user-management"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Grades />
                  </ProtectedRoute>
                }
              />

              <Route
                path="home-table"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <DashboardHomeTable />
                  </ProtectedRoute>
                }
              />

              <Route
                path="user-management/users/:id"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <UserDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="role"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="module"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Modules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="permission"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Permissions />
                  </ProtectedRoute>
                }
              />

              {/* Admin only -main entry */}

              <Route
                path="grn"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <GRN />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-voucher"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-create"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <PaymentCreate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="payment-edit/:voucherId"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <PaymentEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="journal-voucher"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="journal-create"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <JournalCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="journal-edit/:voucherId"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <JournalEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receive-voucher"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <Receive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receive-create"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <ReceiveCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receive-edit/:voucherId"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <ReceiveEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cash-transfer"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <CashTransfer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cash-transfer-create"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <CashTransferCreate />
                  </ProtectedRoute>
                }
              />
              {/* account report route */}

              <Route
                path="sale-report"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <SaleExpenseReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sale-invoice"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <InvoicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="egg-production"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <EggProductionPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="purchase-recognition"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <RecognitionPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="purchase-approve"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <ApprovalDashboardPage />
                  </ProtectedRoute>
                }
              /> */}

              <Route
                path="chart-account"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <ChartOfAccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="supplier"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <SupplierPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customer"
                element={
                  <ProtectedRoute anyRole={ADMIN}>
                    <CustomerPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </NuqsAdapter>
    </>
  );
}

export default App;
