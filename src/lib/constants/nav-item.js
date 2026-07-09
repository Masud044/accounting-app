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







// export const NAV_ITEMS = [
//  {
//     label: "Dashboard",
//     roles: ["Admin"],            
//     links: [
//         { to: "/dashboard", label: "Home", Icon: Home },
   
      
     
//     ],
//   },




//   {
//     label: "Voucher Entry",
//     roles: ["Admin"],                  // শুধু Admin
//     links: [
//        { to: "/dashboard/home-table", label: "Home", Icon: Home },
//       { to: "/dashboard/receive-voucher", label: "Receive Voucher", Icon: Home },
//       { to: "/dashboard/payment-voucher", label: "Payment Voucher", Icon: FileText },
//       { to: "/dashboard/journal-voucher", label: "Journal Voucher", Icon: Plus },
//       { to: "/dashboard/cash-Transfer", label: "Cash Transfer", Icon: Plus },
//       //  { to: "/dashboard/grn", label: "GRN Entry", Icon: Plus },
      
//     ],
//   },
//   {
//     label: "Account Report",
//     roles: ["Admin"],                  // শুধু Admin
//     links: [
//       { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
//       { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
//        { to: "/dashboard/sale-report", label: "Sale Expense Report", Icon: ClipboardList },
//       { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
//       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
//       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
      
//     ],
//   },
//   {
//     label: "Setup",
//     roles: ["Admin"],                  // শুধু Admin
//     links: [
//       { to: "/dashboard/chart-account", label: "Chart of Account", Icon: Wrench },
//       { to: "/dashboard/customer", label: "Customer Info", Icon: Wrench },
//       { to: "/dashboard/supplier", label: "Supplier Info", Icon: Wrench },
//        { to: "/dashboard/item", label: "Item", Icon: ClipboardList },
//        { to: "/dashboard/user-management", label: "User Management", Icon: ClipboardList },
//       { to: "/dashboard/module", label: "Module", Icon: ClipboardList },
//       { to: "/dashboard/role", label: "Role", Icon: FileText },
//       { to: "/dashboard/permission", label: "Permission", Icon: FileText },
      
//           //  { to: "/dashboard/purchase-approve", label: "Purchase Approve", Icon: FileText },
      
//     ],
//   },

//    {
//     label: "Production",
//     roles: ["Admin"],     // Admin + Inventory উভয়ই
//     links: [
//       { to: "/dashboard/egg-production", label: "Egg Production", Icon: FileText },
//          { to: "/dashboard/sale-invoice", label: "Sale Invoice", Icon: FileText },
//          { to: "/dashboard/purchase-recognition", label: "Purchase Recognition", Icon: FileText },
//     ],
//   },

  
//   {
//     label: "Inventory",
//     roles: ["Admin", "Inventory"],     // Admin + Inventory উভয়ই
//     links: [
//       { to: "/dashboard/inventory", label: "Inventory", Icon: ClipboardList },
//       { to: "/dashboard/dispatch", label: "Dispatch", Icon: FileText },
     
//       { to: "/dashboard/item-stock", label: "Item Stock", Icon: FileText },
//     ],
//   },
//   {
//     label: "Inventory Report",
//    roles: ["Admin", "Inventory"],             // Admin + Inventory উভয়ই
//     links: [
//       { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
//       { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
//       { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
//       { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
//     ],
//   },
// ];


import {
  Home,
  FileText,
  Plus,
  Wrench,
  ClipboardList,
  Settings,
  User,
  LogOutIcon,
  Menu,
  X,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Home",
    roles: ["Admin"],
    to: "/dashboard/welcome",
    Icon: Home,
  },
  {
    label: "Dashboard",
    roles: ["Admin"],
     links: [
      { to: "/dashboard/overview", label: "Expense & Income", Icon: Home },
      { to: "/dashboard/sale-dashboard", label: "Sales and  Invoice", Icon: Home },
      { to: "/dashboard/egg-dashboard", label: "Egg Production Summary", Icon: FileText },
      { to: "/dashboard/approval-dashboard", label: "Approval Dashboard", Icon: Plus },
     
    ],
    // to: "/dashboard/overview",
    // Icon: Home,
  },

  {
    label: "Voucher Entry",
    roles: ["Admin"],
    links: [
      { to: "/dashboard/home-table", label: "Home Voucher", Icon: Home },
      { to: "/dashboard/receive-voucher", label: "Receive Voucher", Icon: Home },
      { to: "/dashboard/payment-voucher", label: "Payment Voucher", Icon: FileText },
      { to: "/dashboard/journal-voucher", label: "Journal Voucher", Icon: Plus },
      { to: "/dashboard/cash-Transfer", label: "Cash Transfer", Icon: Plus },
    ],
  },
  {
    label: "Account Report",
    roles: ["Admin"],
    links: [
      { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
      { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
      { to: "/dashboard/sale-report", label: "Sale Expense Report", Icon: ClipboardList },
      { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
      { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
    ],
  },
  {
    label: "Setup",
    roles: ["Admin"],
    links: [
      { to: "/dashboard/chart-account", label: "Chart of Account", Icon: Wrench },
      { to: "/dashboard/customer", label: "Customer Info", Icon: Wrench },
      { to: "/dashboard/supplier", label: "Supplier Info", Icon: Wrench },
      { to: "/dashboard/item", label: "Item", Icon: ClipboardList },
      { to: "/dashboard/user-management", label: "User Management", Icon: ClipboardList },
      { to: "/dashboard/module", label: "Module", Icon: ClipboardList },
      { to: "/dashboard/role", label: "Role", Icon: FileText },
      { to: "/dashboard/permission", label: "Permission", Icon: FileText },
    ],
  },
  {
    label: "Production",
    roles: ["Admin"],
    links: [
      { to: "/dashboard/egg-production", label: "Egg Production", Icon: FileText },
      { to: "/dashboard/sale-invoice", label: "Sale Invoice", Icon: FileText },
      { to: "/dashboard/purchase-recognition", label: "Purchase Recognition", Icon: FileText },
    ],
  },
  {
    label: "Inventory",
    roles: ["Admin", "Inventory"],
    links: [
      { to: "/dashboard/inventory", label: "Inventory", Icon: ClipboardList },
      { to: "/dashboard/dispatch", label: "Dispatch", Icon: FileText },
      { to: "/dashboard/item-stock", label: "Item Stock", Icon: FileText },
    ],
  },
  {
    label: "Inventory Report",
    roles: ["Admin", "Inventory"],
    links: [
      { to: "/dashboard/daily-expense", label: "Daily Expense Report", Icon: ClipboardList },
      { to: "/dashboard/daily-income", label: "Daily Income Report", Icon: ClipboardList },
      { to: "/dashboard/ledger", label: "Ledger", Icon: FileText },
      { to: "/dashboard/cash-book", label: "Cash Book", Icon: FileText },
    ],
  },
];