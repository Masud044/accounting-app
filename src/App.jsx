// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import "./App.css";
// import { ToastContainer } from "react-toastify";

// import Home from "./pages/Home";
// import HomeLayout from "./layout/HomeLayout";
// import Payment from "./features/main-entry/pages/Payment";
// import Journal from "./features/main-entry/pages/Journal";
// import Receive from "./features/main-entry/pages/Receive";
// import CashTransfer from "./features/main-entry/pages/CashTransfer";
// import DashboardHome from "./features/main-entry/pages/DashboardHome";
// import ReceiveEdit from "./features/main-entry/pages/ReceiveEdit";
// import ReceiveCreate from "./features/main-entry/pages/ReceiveCreate";
// import InventoriesPage from "./features/inventory-page/inventory";
// import ItemStockPage from "./features/inventory-page/item-stock";
// import ItemsPage from "./features/inventory-page/item";
// import Requisitions from "./features/inventory-page/requisition-master";
// import ChartOfAccountPage from "./features/main-entry/chart-account";
// import LoginV2 from "./features/authentication-v2/index";
// import RegisterV2 from "./features/authentication-v2/register-index";
// import ProtectedRoute from "./pages/route/ProtectedRoute";
// import UnauthorizedPage from "./pages/route/Unauthorized";

// import { useAuthV2 } from "./features/authentication-v2/use-auth-v2";
// import WelcomePage from "./pages/welcomePage";
// import Grades from "./features/user-management";
// import Roles from "./features/users/role";
// import Permissions from "./features/users/permission";
// import Modules from "./features/users/module";
// import { NuqsAdapter } from "nuqs/adapters/react";
// import UserDetailsPage from "./features/user-management/user-details";
// import SupplierPage from "./features/supplier";
// import CustomerPage from "./features/customer";
// import JournalCreate from "./features/main-entry/pages/JournalCreate";
// import JournalEdit from "./features/main-entry/pages/JournalEdit";
// import PaymentCreate from "./features/main-entry/pages/PaymentCreate";
// import PaymentEdit from "./features/main-entry/pages/PaymentEdit";
// import CashTransferCreate from "./features/main-entry/pages/CashTransferCreate";
// import SaleExpenseReportPage from "./features/account-report/sale-report";
// import EggProductionPage from "./features/egg-production";
// import { DashboardHomeTable } from "./features/main-entry/components/DashboardHomeTable";
// import GRN from "./features/grn-master";
// import InvoicePage from "./features/sale-invoice/sale-invoice-page";
// import RecognitionPage from "./features/purchase-recognition/recognition-page";
// import InvoiceSalesDashboard from "./features/sale-invoice/invoice-sale-dashboard";

// import ApprovalDashboardPage from "./features/purchase-recognition/recognition-approval-dashboard";
// import EggDashboardPage from "./features/egg-production/egg-dashboard-home";
// import ChickenProjectPage from "./features/chicken-project";
// import CowProjectPage from "./features/cow-project";
// import FishProjectPage from "./features/fish-project";
// import TrialBalancePage from "./features/account-report/trail-balance-report";
// import GeneralLedgerPage from "./features/general-ledger-report";
// import CashFlowPage from "./features/cash-flow-report";
// import ExpenseStatementPage from "./features/expense-report";
// import IncomeStatementPage from "./features/income-report";
// import ChickenProjectDetailPage from "./features/chicken-project/chicken-detail-page";
// import CowProjectDetail from "./features/cow-project/cow-project-detail";

// import FarmCalendarPage from "./features/farm-calendar/calender-list";
// import FarmCalendarDetailPage from "./features/farm-calendar/detail-calendar-page";
// import ActivityLogList from "./features/farm-activity-log/activity-log-list";
// import FarmTypePage from "./features/farm-type/index";
// import FarmBudgetDetailPage from "./features/farm-budget/budget-detail-page";
// import FarmBudgetPage from "./features/farm-budget/index";
// import FarmProjectDetailPage from "./features/farm-project-management/project-detail-page";
// import FarmProjectPage from "./features/farm-project-management/index";
// import FarmCalendarReportPage from "./features/farm-calender-report/farm-calendar-report";
// import FarmCalendarReportList from "./features/farm-calender-report/farm-calendar-report-list";
// import ProjectProfileReportPage from "./features/project-management/project-profile-report";
// import ProjectProfileReportList from "./features/project-management/report-project-list";
// import FinancialPage from "./features/financial-project/index";
// import ProjectProfilePage from "./features/project-management/index";
// import ProjectDetailPage from "./features/project-management/project-detail-page";
// import IncomeVoucherPage from "./features/income-expense-voucher-report";
// import AddUserPage from "./features/user-management/add-user-page";
// import EditUserPage from "./features/user-management/edit-user-page";
// import RolePermissionMatrix from "./features/users/role/role-permission-matrix";
// import RoleDetailsPage from "./features/users/role/role-details";
// import AddModulePage from "./features/users/module/add-module-page";
// import UpdateModulePage from "./features/users/module/update-module-page";
// import AddPermissionPage from "./features/users/permission/add-permission-page";
// import UpdatePermissionPage from "./features/users/permission/update-permission-page";
// import { NAV_ITEMS } from "./lib/constants/nav-item";

// const ADMIN = ["Admin"];
// const ADMIN_INVENTORY = ["Admin", "Inventory"];

// // ── Dashboard Index — role অনুযায়ী redirect ──────────────────────────────────
// // const DashboardIndex = () => {
// //   const { user, isLoading } = useAuthV2();
// //   if (isLoading) return null;

// //   if (user?.roles?.includes("Admin")) {
// //     return <WelcomePage />; // Admin → DashboardHome
// //   }
// //   return <Navigate to="/dashboard/welcome" replace />; // Inventory → WelcomePage
// // };

// const DashboardIndex = () => {
//   const { user, isLoading } = useAuthV2();
//   if (isLoading) return null;

//   const roles = user?.roles ?? [];
//   const permissions = user?.permissions ?? [];
//   const has = (code) => permissions.includes(code);
//   const hasAny = (required) => {
//     const codes = Array.isArray(required) ? required : [required];
//     return codes.some((c) => has(c));
//   };

//   // Admin (or anyone with dashboard scope) still lands on Overview.
//   if (roles.includes("Admin") || has("DASHBOARD_VIEW_ALL") || has("DASHBOARD_VIEW_SELF")) {
//     return <WelcomePage />;
//   }

//   // Otherwise, land on the first sidebar link the user actually has access to.
//   for (const group of NAV_ITEMS) {
//     for (const link of group.links) {
//       if (link.to !== "/dashboard" && hasAny(link.requiredPermission)) {
//         return <Navigate to={link.to} replace />;
//       }
//     }
//   }

//   // No accessible link at all — still authenticated, so not /login.
//   return <Navigate to="/unauthorized" replace />;
// };

// function App() {
//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />

//       <NuqsAdapter>
//         <Router>
//           <Routes>
//             {/* Public */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<LoginV2 />} />
//             <Route path="/register" element={<RegisterV2 />} />
//             <Route path="/unauthorized" element={<UnauthorizedPage />} />

//             {/* Protected Layout — Admin + Inventory */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute anyRole={ADMIN_INVENTORY}>
//                   <HomeLayout />
//                 </ProtectedRoute>
//               }
//             >
//               {/* ✅ Index — role অনুযায়ী DashboardHome বা Welcome */}
//               <Route index element={<DashboardIndex />} />
//               {/* Inventory welcome page */}
//               <Route path="welcome" element={<WelcomePage />} />
//               <Route
//                 path="overview"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <DashboardHome />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="sale-dashboard"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <InvoiceSalesDashboard></InvoiceSalesDashboard>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="egg-dashboard"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <EggDashboardPage></EggDashboardPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/chicken-project"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ChickenProjectPage></ChickenProjectPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/chicken-project/:id"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ChickenProjectDetailPage></ChickenProjectDetailPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/cow-project"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <CowProjectPage></CowProjectPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/cow-project/:id"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <CowProjectDetail></CowProjectDetail>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/farm-calendar"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmCalendarPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/farm-calendar/:id"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmCalendarDetailPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="farm-activity-log/detail/:detailId"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ActivityLogList></ActivityLogList>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="farm-type"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmTypePage></FarmTypePage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/farm-budget"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmBudgetPage></FarmBudgetPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/farm-budget/:id"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmBudgetDetailPage></FarmBudgetDetailPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/farm-project"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmProjectPage></FarmProjectPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/farm-project/:id"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmProjectDetailPage></FarmProjectDetailPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/financial-project"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FinancialPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/project-profile"
//                 element={<ProjectProfilePage />}
//               />
//               <Route
//                 path="/dashboard/project-profile/:id"
//                 element={<ProjectDetailPage />}
//               />
//               // report all // report all
//               <Route
//                 path="farm-calendar-report"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmCalendarReportList></FarmCalendarReportList>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="farm-calendar-report/:calendarId"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FarmCalendarReportPage></FarmCalendarReportPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/project-profile-report"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ProjectProfileReportList />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/project-profile-report/:projectId"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ProjectProfileReportPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/income-expense-voucher-report"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <IncomeVoucherPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/trail-balance"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <TrialBalancePage></TrialBalancePage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/general-ledger"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <GeneralLedgerPage></GeneralLedgerPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/cash-flow"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <CashFlowPage></CashFlowPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/expense-report"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ExpenseStatementPage></ExpenseStatementPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/income-report"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <IncomeStatementPage></IncomeStatementPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard/fish-project"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <FishProjectPage></FishProjectPage>
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="approval-dashboard"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ApprovalDashboardPage></ApprovalDashboardPage>
//                   </ProtectedRoute>
//                 }
//               />
//               {/* Admin + Inventory উভয়ই */}
//               <Route path="inventory" element={<InventoriesPage />} />
//               <Route path="item-stock" element={<ItemStockPage />} />
//               <Route path="item" element={<ItemsPage />} />
//               <Route path="dispatch" element={<Requisitions />} />
//               {/* admin only- user management */}
//                <Route
//                 path="user-management"
//                 element={
//                   <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
//                     <Grades />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="user-management/users/create"
//                 element={
//                   <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
//                     <AddUserPage />
//                   </ProtectedRoute>
//                 }
//               />

//                <Route
//                 path="user-management/users/:id/edit"
//                 element={
//                   <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
//                     <EditUserPage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="home-table"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <DashboardHomeTable />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="user-management/users/:id"
//                 element={
//                   <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
//                     <UserDetailsPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="role"
//                 element={
//                   <ProtectedRoute anyPermission="ROLE_VIEW">
//                     <Roles />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="role/matrix"
//                 element={
//                   <ProtectedRoute anyPermission="ROLE_VIEW">
//                     <RolePermissionMatrix />
//                   </ProtectedRoute>
//                 }
//               />
//                <Route
//                 path="role/:id"
//                 element={
//                   <ProtectedRoute anyPermission="ROLE_VIEW">
//                     <RoleDetailsPage />
//                   </ProtectedRoute>
//                 }
//               />

//              <Route
//                 path="module"
//                 element={
//                   <ProtectedRoute anyPermission="MODULE_VIEW">
//                     <Modules />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="module/create"
//                 element={
//                   <ProtectedRoute anyPermission="MODULE_VIEW">
//                     <AddModulePage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="module/:id/edit"
//                 element={
//                   <ProtectedRoute anyPermission="MODULE_VIEW">
//                     <UpdateModulePage />
//                   </ProtectedRoute>
//                 }
//               />

//               <Route
//                 path="permission"
//                 element={
//                   <ProtectedRoute anyPermission="PERMISSION_VIEW">
//                     <Permissions />
//                   </ProtectedRoute>
//                 }
//               />
//                             <Route
//                 path="permission/create"
//                 element={
//                   <ProtectedRoute anyPermission="PERMISSION_CREATE">
//                     <AddPermissionPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="permission/:id/edit"
//                 element={
//                   <ProtectedRoute anyPermission="PERMISSION_EDIT">
//                     <UpdatePermissionPage />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Admin only -main entry */}
//               <Route
//                 path="grn"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <GRN />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="payment-voucher"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <Payment />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="payment-create"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <PaymentCreate />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="payment-edit/:voucherId"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <PaymentEdit />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="journal-voucher"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <Journal />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="journal-create"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <JournalCreate />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="journal-edit/:voucherId"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <JournalEdit />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="receive-voucher"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <Receive />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="receive-create"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ReceiveCreate />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="receive-edit/:voucherId"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ReceiveEdit />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="cash-transfer"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <CashTransfer />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="cash-transfer-create"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <CashTransferCreate />
//                   </ProtectedRoute>
//                 }
//               />
//               {/* account report route */}
//               <Route
//                 path="sale-report"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <SaleExpenseReportPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="sale-invoice"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <InvoicePage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="egg-production"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <EggProductionPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="purchase-recognition"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <RecognitionPage />
//                   </ProtectedRoute>
//                 }
//               />
//               {/* <Route
//                 path="purchase-approve"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ApprovalDashboardPage />
//                   </ProtectedRoute>
//                 }
//               /> */}
//               <Route
//                 path="chart-account"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <ChartOfAccountPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="supplier"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <SupplierPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="customer"
//                 element={
//                   <ProtectedRoute anyRole={ADMIN}>
//                     <CustomerPage />
//                   </ProtectedRoute>
//                 }
//               />
//             </Route>
//           </Routes>
//         </Router>
//       </NuqsAdapter>
//     </>
//   );
// }

// export default App;

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
import FarmTypePage from "./features/farm-type/index";
import FarmBudgetDetailPage from "./features/farm-budget/budget-detail-page";
import FarmBudgetPage from "./features/farm-budget/index";
import FarmProjectDetailPage from "./features/farm-project-management/project-detail-page";
import FarmProjectPage from "./features/farm-project-management/index";
import FarmCalendarReportPage from "./features/farm-calender-report/farm-calendar-report";
import FarmCalendarReportList from "./features/farm-calender-report/farm-calendar-report-list";
import ProjectProfileReportPage from "./features/project-management/project-profile-report";
import ProjectProfileReportList from "./features/project-management/report-project-list";
import FinancialPage from "./features/financial-project/index";
import ProjectProfilePage from "./features/project-management/index";
import ProjectDetailPage from "./features/project-management/project-detail-page";
import IncomeVoucherPage from "./features/income-expense-voucher-report";
import AddUserPage from "./features/user-management/add-user-page";
import EditUserPage from "./features/user-management/edit-user-page";
import RolePermissionMatrix from "./features/users/role/role-permission-matrix";
import RoleDetailsPage from "./features/users/role/role-details";
import AddModulePage from "./features/users/module/add-module-page";
import UpdateModulePage from "./features/users/module/update-module-page";
import AddPermissionPage from "./features/users/permission/add-permission-page";
import UpdatePermissionPage from "./features/users/permission/update-permission-page";
import { NAV_ITEMS } from "./lib/constants/nav-item";
import UpdateAgendaPage from "./features/agenda-management/update-agenda-page";
import AddAgendaPage from "./features/agenda-management/add-agenda-page";
import AgendaManagementPage from "./features/agenda-management/index";
import DepartmentsPage from "./features/department/index";
import EmployeesPage from "./features/employee/index";
import MeetingRoomsPage from "./features/meeting-room/index";
import MeetingDetailPage from "./features/agenda-management/meeting-details";
import LedgerPeriodPage from "./features/ledger-period-calendar/index";
import DashboardExpenseIncomeIndex from "./features/main-entry/pages/dashboard-expense-income-index";

// ── Dashboard Index — permission অনুযায়ী redirect (fully permission-based) ──
const DashboardIndex = () => {
  const { user, isLoading } = useAuthV2();
  // console.log("before loading")
  if (isLoading) return null;
  //  console.log("before loading")
  const permissions = user?.permissions ?? [];
  const has = (code) => permissions.includes(code);
  const hasAny = (required) => {
    const codes = Array.isArray(required) ? required : [required];
    return codes.some((c) => has(c));
  };

  // Overview permission thakle shekhane land koro
  if (hasAny("OVERVIEW_VIEW")) {
    return <WelcomePage />;
  }

  // Nahole sidebar er first accessible link e redirect
  for (const group of NAV_ITEMS) {
    for (const link of group.links) {
      if (link.to !== "/dashboard" && hasAny(link.requiredPermission)) {
        console.log("route", link);
        return <Navigate to={link.to} replace />;
      }
    }
  }

  // Kono accessible link e nai — authenticated but no permission
  return <Navigate to="/unauthorized" replace />;
};

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <NuqsAdapter>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LoginV2 />} />
            <Route path="/login" element={<LoginV2 />} />
            <Route path="/register" element={<RegisterV2 />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Layout — shudhu authenticated hole entry, permission check protyek child route e */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomeLayout />
                </ProtectedRoute>
              }
            >
              {/* Index — permission onujayi DashboardHome ba Welcome ba first accessible link */}
              <Route index element={<DashboardIndex />} />
              <Route
                path="welcome"
                element={
                  <ProtectedRoute anyPermission="OVERVIEW_VIEW">
                    <WelcomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="overview"
                element={
                  <ProtectedRoute anyPermission="DASHBOARD_EXPENSE_INCOME_VIEW">
                    <DashboardExpenseIncomeIndex />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sale-dashboard"
                element={
                  <ProtectedRoute anyPermission="SALE_DASHBOARD_VIEW">
                    <InvoiceSalesDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="egg-dashboard"
                element={
                  <ProtectedRoute anyPermission="EGG_DASHBOARD_VIEW">
                    <EggDashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* Production */}
              <Route
                path="chicken-project"
                element={
                  <ProtectedRoute anyPermission="CHICKEN_PROJECT_VIEW">
                    <ChickenProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chicken-project/:id"
                element={
                  <ProtectedRoute anyPermission="CHICKEN_PROJECT_VIEW">
                    <ChickenProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cow-project"
                element={
                  <ProtectedRoute anyPermission="COW_PROJECT_VIEW">
                    <CowProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cow-project/:id"
                element={
                  <ProtectedRoute anyPermission="COW_PROJECT_VIEW">
                    <CowProjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="fish-project"
                element={
                  <ProtectedRoute anyPermission="FISH_PROJECT_VIEW">
                    <FishProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-calendar"
                element={
                  <ProtectedRoute anyPermission="FARM_CALENDAR_VIEW">
                    <FarmCalendarPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-calendar/:id"
                element={
                  <ProtectedRoute anyPermission="FARM_CALENDAR_VIEW">
                    <FarmCalendarDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-activity-log/detail/:detailId"
                element={
                  <ProtectedRoute anyPermission="FARM_CALENDAR_VIEW">
                    <ActivityLogList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-type"
                element={
                  <ProtectedRoute anyPermission="FARM_TYPE_VIEW">
                    <FarmTypePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-budget"
                element={
                  <ProtectedRoute anyPermission="FARM_BUDGET_VIEW">
                    <FarmBudgetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-budget/:id"
                element={
                  <ProtectedRoute anyPermission="FARM_BUDGET_VIEW">
                    <FarmBudgetDetailPage />
                  </ProtectedRoute>
                }
              />
              {/* NOTE: nav-item.js e ei duita route nai — notun permission code
                  "FARM_PROJECT_VIEW" / "FINANCIAL_PROJECT_VIEW" backend e create
                  kore user/role ke assign korte hobe, nahole keu access pabe na. */}
              <Route
                path="farm-project"
                element={
                  <ProtectedRoute anyPermission="FARM_PROJECT_VIEW">
                    <FarmProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-project/:id"
                element={
                  <ProtectedRoute anyPermission="FARM_PROJECT_VIEW">
                    <FarmProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="financial-project"
                element={
                  <ProtectedRoute anyPermission="FINANCIAL_PROJECT_VIEW">
                    <FinancialPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="project-profile"
                element={
                  <ProtectedRoute anyPermission="PROJECT_PROFILE_VIEW">
                    <ProjectProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="project-profile/:id"
                element={
                  <ProtectedRoute anyPermission="PROJECT_PROFILE_VIEW">
                    <ProjectDetailPage />
                  </ProtectedRoute>
                }
              />
              {/* Report all */}
              <Route
                path="farm-calendar-report"
                element={
                  <ProtectedRoute anyPermission="FARM_CALENDAR_REPORT_VIEW">
                    <FarmCalendarReportList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farm-calendar-report/:calendarId"
                element={
                  <ProtectedRoute anyPermission="FARM_CALENDAR_REPORT_VIEW">
                    <FarmCalendarReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="project-profile-report"
                element={
                  <ProtectedRoute anyPermission="PROJECT_PROFILE_REPORT_VIEW">
                    <ProjectProfileReportList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="project-profile-report/:projectId"
                element={
                  <ProtectedRoute anyPermission="PROJECT_PROFILE_REPORT_VIEW">
                    <ProjectProfileReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="income-expense-voucher-report"
                element={
                  <ProtectedRoute anyPermission="INCOME_EXPENSE_VOUCHER_REPORT_VIEW">
                    <IncomeVoucherPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="trail-balance"
                element={
                  <ProtectedRoute anyPermission="TRAIL_BALANCE_VIEW">
                    <TrialBalancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="general-ledger"
                element={
                  <ProtectedRoute anyPermission="GENERAL_LEDGER_VIEW">
                    <GeneralLedgerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cash-flow"
                element={
                  <ProtectedRoute anyPermission="CASH_FLOW_VIEW">
                    <CashFlowPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="expense-report"
                element={
                  <ProtectedRoute anyPermission="EXPENSE_REPORT_VIEW">
                    <ExpenseStatementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="income-report"
                element={
                  <ProtectedRoute anyPermission="INCOME_REPORT_VIEW">
                    <IncomeStatementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="approval-dashboard"
                element={
                  <ProtectedRoute anyPermission="APPROVAL_DASHBOARD_VIEW">
                    <ApprovalDashboardPage />
                  </ProtectedRoute>
                }
              />
              {/* Inventory */}
              <Route
                path="inventory"
                element={
                  <ProtectedRoute anyPermission="INVENTORY_VIEW">
                    <InventoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="item-stock"
                element={
                  <ProtectedRoute anyPermission="ITEM_STOCK_VIEW">
                    <ItemStockPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="item"
                element={
                  <ProtectedRoute anyPermission="ITEM_VIEW">
                    <ItemsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dispatch"
                element={
                  <ProtectedRoute anyPermission="DISPATCH_VIEW">
                    <Requisitions />
                  </ProtectedRoute>
                }
              />
              {/* agenda- management */}
              <Route
                path="agenda"
                element={
                  <ProtectedRoute anyPermission="AGENDA_MANAGEMENT_VIEW">
                    <AgendaManagementPage></AgendaManagementPage>
                  </ProtectedRoute>
                }
              />
              <Route
  path="agenda/:id"
  element={
    <ProtectedRoute anyPermission="AGENDA_MANAGEMENT_VIEW">
      <MeetingDetailPage />
    </ProtectedRoute>
  }
/>
              <Route
                path="agenda/add"
                element={
                  <ProtectedRoute anyPermission="AGENDA_MANAGEMENT_VIEW">
                    <AddAgendaPage></AddAgendaPage>
                  </ProtectedRoute>
                }
              />
              <Route
                path="agenda/edit/:id"
                element={
                  <ProtectedRoute anyPermission="AGENDA_MANAGEMENT_VIEW">
                    <UpdateAgendaPage></UpdateAgendaPage>
                  </ProtectedRoute>
                }
              />

              <Route
                path="departments"
                element={
                  <ProtectedRoute anyPermission="DEPARTMENT_VIEW">
                    <DepartmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employees"
                element={
                  <ProtectedRoute anyPermission="EMPLOYEE_VIEW">
                    <EmployeesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="meeting-rooms"
                element={
                  <ProtectedRoute anyPermission="MEETING_ROOM_VIEW">
                    <MeetingRoomsPage />
                  </ProtectedRoute>
                }
              />

             <Route
  path="ledger-period"
  element={
    <ProtectedRoute anyPermission="LEDGER_PERIOD_CALENDAR_VIEW">
      <LedgerPeriodPage />
    </ProtectedRoute>
  }
/>
              {/* User Management */}
              <Route
                path="user-management"
                element={
                  <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
                    <Grades />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user-management/users/create"
                element={
                  <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
                    <AddUserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user-management/users/:id/edit"
                element={
                  <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
                    <EditUserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="user-management/users/:id"
                element={
                  <ProtectedRoute anyPermission="USER_MANAGEMENT_VIEW">
                    <UserDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="home-table"
                element={
                  <ProtectedRoute anyPermission="HOME_VOUCHER_VIEW">
                    <DashboardHomeTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="role"
                element={
                  <ProtectedRoute anyPermission="ROLE_VIEW">
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="role/matrix"
                element={
                  <ProtectedRoute anyPermission="ROLE_VIEW">
                    <RolePermissionMatrix />
                  </ProtectedRoute>
                }
              />
              <Route
                path="role/:id"
                element={
                  <ProtectedRoute anyPermission="ROLE_VIEW">
                    <RoleDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="module"
                element={
                  <ProtectedRoute anyPermission="MODULE_VIEW">
                    <Modules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="module/create"
                element={
                  <ProtectedRoute anyPermission="MODULE_VIEW">
                    <AddModulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="module/:id/edit"
                element={
                  <ProtectedRoute anyPermission="MODULE_VIEW">
                    <UpdateModulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="permission"
                element={
                  <ProtectedRoute anyPermission="PERMISSION_VIEW">
                    <Permissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="permission/create"
                element={
                  <ProtectedRoute anyPermission="PERMISSION_CREATE">
                    <AddPermissionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="permission/:id/edit"
                element={
                  <ProtectedRoute anyPermission="PERMISSION_EDIT">
                    <UpdatePermissionPage />
                  </ProtectedRoute>
                }
              />
              {/* Main entry — voucher */}
              {/* NOTE: "grn" nav-item.js e nai — "GRN_VIEW" notun code, assign korte hobe */}
              <Route
                path="grn"
                element={
                  <ProtectedRoute anyPermission="GRN_VIEW">
                    <GRN />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-voucher"
                element={
                  <ProtectedRoute anyPermission="PAYMENT_VOUCHER_VIEW">
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-create"
                element={
                  <ProtectedRoute anyPermission="PAYMENT_VOUCHER_VIEW">
                    <PaymentCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="payment-edit/:voucherId"
                element={
                  <ProtectedRoute anyPermission="PAYMENT_VOUCHER_VIEW">
                    <PaymentEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="journal-voucher"
                element={
                  <ProtectedRoute anyPermission="JOURNAL_VOUCHER_VIEW">
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="journal-create"
                element={
                  <ProtectedRoute anyPermission="JOURNAL_VOUCHER_VIEW">
                    <JournalCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="journal-edit/:voucherId"
                element={
                  <ProtectedRoute anyPermission="JOURNAL_VOUCHER_VIEW">
                    <JournalEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receive-voucher"
                element={
                  <ProtectedRoute anyPermission="RECEIVE_VOUCHER_VIEW">
                    <Receive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receive-create"
                element={
                  <ProtectedRoute anyPermission="RECEIVE_VOUCHER_VIEW">
                    <ReceiveCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="receive-edit/:voucherId"
                element={
                  <ProtectedRoute anyPermission="RECEIVE_VOUCHER_VIEW">
                    <ReceiveEdit />
                  </ProtectedRoute>
                }
              />
              {/* Fix: nav-item.js e "cash-Transfer" (capital T) — eikhane lowercase e rakha
                  holo r nav-item.js o lowercase e update kore dite hobe (niche note dekho) */}
              <Route
                path="cash-transfer"
                element={
                  <ProtectedRoute anyPermission="CASH_TRANSFER_VIEW">
                    <CashTransfer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="cash-transfer-create"
                element={
                  <ProtectedRoute anyPermission="CASH_TRANSFER_VIEW">
                    <CashTransferCreate />
                  </ProtectedRoute>
                }
              />
              {/* Account report */}
              <Route
                path="sale-report"
                element={
                  <ProtectedRoute anyPermission="SALE_REPORT_VIEW">
                    <SaleExpenseReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sale-invoice"
                element={
                  <ProtectedRoute anyPermission="SALE_INVOICE_VIEW">
                    <InvoicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="egg-production"
                element={
                  <ProtectedRoute anyPermission="EGG_PRODUCTION_VIEW">
                    <EggProductionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="purchase-recognition"
                element={
                  <ProtectedRoute anyPermission="PURCHASE_RECOGNITION_VIEW">
                    <RecognitionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chart-account"
                element={
                  <ProtectedRoute anyPermission="CHART_ACCOUNT_VIEW">
                    <ChartOfAccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="supplier"
                element={
                  <ProtectedRoute anyPermission="SUPPLIER_VIEW">
                    <SupplierPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customer"
                element={
                  <ProtectedRoute anyPermission="CUSTOMER_VIEW">
                    <CustomerPage />
                  </ProtectedRoute>
                }
              />
              {/* Inventory report — daily-expense/daily-income/ledger/cash-book
                  nav-item.js e ache kintu App.jsx e in ei list-e route hishebe nai —
                  jodi dorkar hoy, ei charta o eikhane add korte hobe */}
            </Route>
          </Routes>
        </Router>
      </NuqsAdapter>
    </>
  );
}

export default App;
