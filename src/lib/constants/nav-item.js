// // import {
// //   Home,
// //   FileText,
// //   Plus,
// //   Wrench,
// //   ClipboardList,
// //   Settings,
// //   User,
// //   LogOutIcon,
// //   Menu,
// //   X,
// // } from "lucide-react";







// // export const NAV_ITEMS = [
// //  {
// //     label: "Dashboard",
// //     roles: ["Admin"],            
// //     links: [
// //         { to: "/dashboard", label: "Home", Icon: Home },
   
      
     
// //     ],
// //   },




// //   {
// //     label: "Voucher Entry",
// //     roles: ["Admin"],                  // শুধু Admin
// //     links: [
// //        { to: "/dashboard/home-table", label: "Home", Icon: Home },
// //       { to: "/dashboard/receive-voucher", label: "Receive Voucher", Icon: Home },
// //       { to: "/dashboard/payment-voucher", label: "Payment Voucher", Icon: FileText },
// //       { to: "/dashboard/journal-voucher", label: "Journal Voucher", Icon: Plus },
// //       { to: "/dashboard/cash-Transfer", label: "Cash Transfer", Icon: Plus },
// //       //  { to: "/dashboard/grn", label: "GRN Entry", Icon: Plus },
      
// //     ],
// //   },
// //   {
// //     label: "Account Report",
// //     roles: ["Admin"],                  // শুধু Admin
// //     links: [
// //       { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
// //       { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
// //        { to: "/dashboard/sale-report", label: "Sale Expense Report", Icon: ClipboardList },
// //       { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
// //       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
// //       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
      
// //     ],
// //   },
// //   {
// //     label: "Setup",
// //     roles: ["Admin"],                  // শুধু Admin
// //     links: [
// //       { to: "/dashboard/chart-account", label: "Chart of Account", Icon: Wrench },
// //       { to: "/dashboard/customer", label: "Customer Info", Icon: Wrench },
// //       { to: "/dashboard/supplier", label: "Supplier Info", Icon: Wrench },
// //        { to: "/dashboard/item", label: "Item", Icon: ClipboardList },
// //        { to: "/dashboard/user-management", label: "User Management", Icon: ClipboardList },
// //       { to: "/dashboard/module", label: "Module", Icon: ClipboardList },
// //       { to: "/dashboard/role", label: "Role", Icon: FileText },
// //       { to: "/dashboard/permission", label: "Permission", Icon: FileText },
      
// //           //  { to: "/dashboard/purchase-approve", label: "Purchase Approve", Icon: FileText },
      
// //     ],
// //   },

// //    {
// //     label: "Production",
// //     roles: ["Admin"],     // Admin + Inventory উভয়ই
// //     links: [
// //       { to: "/dashboard/egg-production", label: "Egg Production", Icon: FileText },
// //          { to: "/dashboard/sale-invoice", label: "Sale Invoice", Icon: FileText },
// //          { to: "/dashboard/purchase-recognition", label: "Purchase Recognition", Icon: FileText },
// //     ],
// //   },

  
// //   {
// //     label: "Inventory",
// //     roles: ["Admin", "Inventory"],     // Admin + Inventory উভয়ই
// //     links: [
// //       { to: "/dashboard/inventory", label: "Inventory", Icon: ClipboardList },
// //       { to: "/dashboard/dispatch", label: "Dispatch", Icon: FileText },
     
// //       { to: "/dashboard/item-stock", label: "Item Stock", Icon: FileText },
// //     ],
// //   },
// //   {
// //     label: "Inventory Report",
// //    roles: ["Admin", "Inventory"],             // Admin + Inventory উভয়ই
// //     links: [
// //       { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
// //       { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
// //       { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
// //       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
// //     ],
// //   },
// // ];


// import {
//   Home,
//   FileText,
//   Plus,
//   Wrench,
//   ClipboardList,
//   Settings,
//   User,
//   LogOutIcon,
//   Menu,
//   X,
// } from "lucide-react";

// import {
//   IconBuildingSkyscraper,
//   IconDashboard,
//   IconSettings,
//   IconUserHexagon,
//   IconUsers,
//   IconBuilding,
//   IconFileInfo,
// } from "@tabler/icons-react";


// export const NAV_ITEMS = [
//   {
//     label: "Home",
//     roles: ["Admin"],
//     links:[ 
//       {to: "/dashboard/welcome",label: "Overview", Icon: Home,}
  
//   ]
   
//   },
//   {
//     label: "Dashboard",
//     roles: ["Admin"],
//      links: [
//       { to: "/dashboard/overview", label: "Expense & Income", Icon: Home },
//       { to: "/dashboard/sale-dashboard", label: "Sales and  Invoice", Icon: Home },
//       { to: "/dashboard/egg-dashboard", label: "Egg Production Summary", Icon: FileText },
//       { to: "/dashboard/approval-dashboard", label: "Approval Dashboard", Icon: Plus },
     
//     ],
//     // to: "/dashboard/overview",
//     // Icon: Home,
//   },

//   {
//     label: "Voucher Entry",
//     roles: ["Admin"],
//     links: [
//       { to: "/dashboard/home-table", label: "Home Voucher", Icon: Home },
//       { to: "/dashboard/receive-voucher", label: "Receive Voucher", Icon: Home },
//       { to: "/dashboard/payment-voucher", label: "Payment Voucher", Icon: FileText },
//       { to: "/dashboard/journal-voucher", label: "Journal Voucher", Icon: Plus },
//       { to: "/dashboard/cash-Transfer", label: "Cash Transfer", Icon: Plus },
//     ],
//   },
  

// {
//     label: "Production",
//     roles: ["Admin"],
//     links: [
//       { to: "/dashboard/egg-production", label: "Egg Production", Icon: FileText },
//       { to: "/dashboard/sale-invoice", label: "Sale Invoice", Icon: FileText },
//       { to: "/dashboard/purchase-recognition", label: "Purchase Recognition", Icon: FileText },
//        { to: "/dashboard/chicken-project", label: "Chicken", Icon: FileText },
//       { to: "/dashboard/cow-project", label: "Cow", Icon: FileText },
//       { to: "/dashboard/fish-project", label: "Fish", Icon: FileText },

//        { to: "/dashboard/farm-calendar", label: "Farm calendar", Icon: FileText },
       
//           { to: "/dashboard/farm-budget", label: "Farm Budget", Icon: FileText },
          
//             // { to: "/dashboard/farm-project", label: "Farm Project Management", Icon: FileText },
//             //  { to: "/dashboard/financial-project", label: "Financial Project", Icon: FileText },
//                 { to: "/dashboard/project-profile", label: "Project Management", Icon: FileText },
       
      
//     ],
//   },

//   {
//     label: "Inventory",
//     roles: ["Admin", "Inventory"],
//     links: [
//       { to: "/dashboard/inventory", label: "Inventory", Icon: ClipboardList },
//       { to: "/dashboard/dispatch", label: "Dispatch", Icon: FileText },
//       { to: "/dashboard/item-stock", label: "Item Stock", Icon: FileText },
//     ],
//   },

//   {
//     label: "Account Report",
//     roles: ["Admin"],
//     links: [
//        { to: "/dashboard/income-expense-voucher-report", label: "Income Expense Voucher", Icon: FileText },
//       { to: "/dashboard/expense-report", label: " Expense Report", Icon: ClipboardList },
//       { to: "/dashboard/income-report", label: "Income Report", Icon: ClipboardList },
//       { to: "/dashboard/sale-report", label: "Sale Expense Report", Icon: ClipboardList },
//       { to: "/dashboard/general-ledger", label: "General Ledger", Icon: FileText },
//       { to: "/dashboard/trail-balance", label: "Trail Balance", Icon: FileText },
//       { to: "/dashboard/cash-flow", label: "Cash Flow Statement", Icon: FileText },
//        { to: "/dashboard/project-profile-report", label: "Project Profile Report", Icon: FileText },
//       { to: "/dashboard/farm-calendar-report", label: "Project Calendar Report", Icon: FileText },
//     ],
//   },
//   {
//     label: "Inventory Report",
//     roles: ["Admin", "Inventory"],
//     links: [
//       { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
//       { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
//       { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
//       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
//     ],
//   },

//   {
//     label: "Setup",
//     roles: ["Admin"],
//     links: [
//       { to: "/dashboard/chart-account", label: "Chart of Account", Icon: Wrench },
//       { to: "/dashboard/customer", label: "Customer Info", Icon: Wrench },
//       { to: "/dashboard/supplier", label: "Supplier Info", Icon: Wrench },
//       { to: "/dashboard/item", label: "Item", Icon: ClipboardList },
//        { to: "/dashboard/farm-type", label: "Farm Type", Icon: FileText },
//       // { to: "/dashboard/user-management", label: "User Management", Icon: ClipboardList },
//       // { to: "/dashboard/module", label: "Module", Icon: ClipboardList },
//       // { to: "/dashboard/role", label: "Role", Icon: FileText },
//       // { to: "/dashboard/permission", label: "Permission", Icon: FileText },
//     ],
//   },

//   // {
//   //   label: "User Management",
//   //   roles: ["Admin"],
//   //   links: [
      
//   //     { to: "/dashboard/user-management", label: "User Management", Icon: ClipboardList },
//   //     { to: "/dashboard/module", label: "Module", Icon: ClipboardList },
//   //     { to: "/dashboard/role", label: "Role", Icon: FileText },
//   //     { to: "/dashboard/permission", label: "Permission", Icon: FileText },
//   //   ],
//   // },

//   {
//     label: "User Management",
//     ItemIcon: IconUsers,
//     links: [
//       {
//         to: "/dashboard/user-management",
//         label: "User Management",
//         Icon: ClipboardList,
//         requiredPermission: "USER_MANAGEMENT_VIEW",
//       },
//       {
//         to: "/dashboard/module",
//         label: "Module",
//         Icon: ClipboardList,
//         requiredPermission: "MODULE_VIEW",
//       },
//       {
//         to: "/dashboard/role",
//         label: "Role",
//         Icon: FileText,
//         requiredPermission: "ROLE_VIEW",
//       },
//       {
//         to: "/dashboard/permission",
//         label: "Permission",
//         Icon: FileText,
//         requiredPermission: "PERMISSION_VIEW",
//       },
//     ],
//   },


 
  
  
  
  
// ];



import {
  Home, FileText, Plus, Wrench, ClipboardList,
} from "lucide-react";
import { IconUsers } from "@tabler/icons-react";

export const NAV_ITEMS = [
  {
    label: "Home",
    links: [
      { to: "/dashboard/welcome", label: "Overview", Icon: Home, requiredPermission: "OVERVIEW_VIEW" },
    ],
  },
  {
    label: "Dashboard",
    links: [
      { to: "/dashboard/overview", label: "Expense & Income", Icon: Home, requiredPermission: "DASHBOARD_OVERVIEW_VIEW" },
      { to: "/dashboard/sale-dashboard", label: "Sales and Invoice", Icon: Home, requiredPermission: "SALE_DASHBOARD_VIEW" },
      { to: "/dashboard/egg-dashboard", label: "Egg Production Summary", Icon: FileText, requiredPermission: "EGG_DASHBOARD_VIEW" },
      { to: "/dashboard/approval-dashboard", label: "Approval Dashboard", Icon: Plus, requiredPermission: "APPROVAL_DASHBOARD_VIEW" },
    ],
  },
  {
    label: "Voucher Entry",
    links: [
      { to: "/dashboard/home-table", label: "Home Voucher", Icon: Home, requiredPermission: "HOME_VOUCHER_VIEW" },
      { to: "/dashboard/receive-voucher", label: "Receive Voucher", Icon: Home, requiredPermission: "RECEIVE_VOUCHER_VIEW" },
      { to: "/dashboard/payment-voucher", label: "Payment Voucher", Icon: FileText, requiredPermission: "PAYMENT_VOUCHER_VIEW" },
      { to: "/dashboard/journal-voucher", label: "Journal Voucher", Icon: Plus, requiredPermission: "JOURNAL_VOUCHER_VIEW" },
      { to: "/dashboard/cash-Transfer", label: "Cash Transfer", Icon: Plus, requiredPermission: "CASH_TRANSFER_VIEW" },
    ],
  },
  {
    label: "Production",
    links: [
      { to: "/dashboard/egg-production", label: "Egg Production", Icon: FileText, requiredPermission: "EGG_PRODUCTION_VIEW" },
      { to: "/dashboard/sale-invoice", label: "Sale Invoice", Icon: FileText, requiredPermission: "SALE_INVOICE_VIEW" },
      { to: "/dashboard/purchase-recognition", label: "Purchase Recognition", Icon: FileText, requiredPermission: "PURCHASE_RECOGNITION_VIEW" },
      { to: "/dashboard/chicken-project", label: "Chicken", Icon: FileText, requiredPermission: "CHICKEN_PROJECT_VIEW" },
      { to: "/dashboard/cow-project", label: "Cow", Icon: FileText, requiredPermission: "COW_PROJECT_VIEW" },
      { to: "/dashboard/fish-project", label: "Fish", Icon: FileText, requiredPermission: "FISH_PROJECT_VIEW" },
      { to: "/dashboard/farm-calendar", label: "Farm calendar", Icon: FileText, requiredPermission: "FARM_CALENDAR_VIEW" },
      { to: "/dashboard/farm-budget", label: "Farm Budget", Icon: FileText, requiredPermission: "FARM_BUDGET_VIEW" },
      { to: "/dashboard/project-profile", label: "Project Management", Icon: FileText, requiredPermission: "PROJECT_PROFILE_VIEW" },
    ],
  },
  {
    label: "Inventory",
    links: [
      { to: "/dashboard/inventory", label: "Inventory", Icon: ClipboardList, requiredPermission: "INVENTORY_VIEW" },
      { to: "/dashboard/dispatch", label: "Dispatch", Icon: FileText, requiredPermission: "DISPATCH_VIEW" },
      { to: "/dashboard/item-stock", label: "Item Stock", Icon: FileText, requiredPermission: "ITEM_STOCK_VIEW" },
    ],
  },
  {
    label: "Account Report",
    links: [
      { to: "/dashboard/income-expense-voucher-report", label: "Income Expense Voucher", Icon: FileText, requiredPermission: "INCOME_EXPENSE_VOUCHER_REPORT_VIEW" },
      { to: "/dashboard/expense-report", label: "Expense Report", Icon: ClipboardList, requiredPermission: "EXPENSE_REPORT_VIEW" },
      { to: "/dashboard/income-report", label: "Income Report", Icon: ClipboardList, requiredPermission: "INCOME_REPORT_VIEW" },
      { to: "/dashboard/sale-report", label: "Sale Expense Report", Icon: ClipboardList, requiredPermission: "SALE_REPORT_VIEW" },
      { to: "/dashboard/general-ledger", label: "General Ledger", Icon: FileText, requiredPermission: "GENERAL_LEDGER_VIEW" },
      { to: "/dashboard/trail-balance", label: "Trail Balance", Icon: FileText, requiredPermission: "TRAIL_BALANCE_VIEW" },
      { to: "/dashboard/cash-flow", label: "Cash Flow Statement", Icon: FileText, requiredPermission: "CASH_FLOW_VIEW" },
      { to: "/dashboard/project-profile-report", label: "Project Profile Report", Icon: FileText, requiredPermission: "PROJECT_PROFILE_REPORT_VIEW" },
      { to: "/dashboard/farm-calendar-report", label: "Project Calendar Report", Icon: FileText, requiredPermission: "FARM_CALENDAR_REPORT_VIEW" },
    ],
  },
  {
    label: "Inventory Report",
    links: [
      { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList, requiredPermission: "DAILY_EXPENSE_REPORT_VIEW" },
      { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList, requiredPermission: "DAILY_INCOME_REPORT_VIEW" },
      { to: "/dashboard/ledger", label: "Ledger", Icon: FileText, requiredPermission: "LEDGER_VIEW" },
      { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText, requiredPermission: "CASH_BOOK_VIEW" },
    ],
  },
  {
    label: "Setup",
    links: [
      { to: "/dashboard/chart-account", label: "Chart of Account", Icon: Wrench, requiredPermission: "CHART_ACCOUNT_VIEW" },
      { to: "/dashboard/customer", label: "Customer Info", Icon: Wrench, requiredPermission: "CUSTOMER_VIEW" },
      { to: "/dashboard/supplier", label: "Supplier Info", Icon: Wrench, requiredPermission: "SUPPLIER_VIEW" },
      { to: "/dashboard/item", label: "Item", Icon: ClipboardList, requiredPermission: "ITEM_VIEW" },
      { to: "/dashboard/farm-type", label: "Farm Type", Icon: FileText, requiredPermission: "FARM_TYPE_VIEW" },
    ],
  },
  {
    label: "User Management",
    ItemIcon: IconUsers,
    links: [
      { to: "/dashboard/user-management", label: "User Management", Icon: ClipboardList, requiredPermission: "USER_MANAGEMENT_VIEW" },
      { to: "/dashboard/module", label: "Module", Icon: ClipboardList, requiredPermission: "MODULE_VIEW" },
      { to: "/dashboard/role", label: "Role", Icon: FileText, requiredPermission: "ROLE_VIEW" },
      { to: "/dashboard/permission", label: "Permission", Icon: FileText, requiredPermission: "PERMISSION_VIEW" },
    ],
  },
];