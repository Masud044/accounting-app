// src/config/module-options.js
//
// Source of truth for MODULE_NAME values used when creating a Module.
// Keep in sync manually with sidebar items (nav-items.js) — one entry per
// sidebar link that needs its own View/Create/Edit/Delete/Download permissions.
//
// IMPORTANT: Do not derive this from nav-items.js. Nav items are UI structure
// (labels, icons, grouping) and change often; module names are the permission
// vocabulary and must stay stable once permissions exist in the DB.

export const MODULE_OPTIONS = [
  // Home
  { value: "Overview", label: "Overview" },

  // Dashboard
  { value: "Expense & Income", label: " Expense & Income Dashboard" },
  { value: "Sales and  Invoice", label: "  Sales and  Invoice Dashboard" },
  { value: "Egg Production Summary", label: " Egg Production Summary Dashboard" },
  { value: "Approval Dashboard", label: "Approval Dashboard" },

  // Voucher Entry
  { value: "Home Voucher", label: "Home Voucher" },
  { value: "Receive Voucher", label: "Receive Voucher" },
  { value: "Payment Voucher", label: "Payment Voucher" },
  { value: "Journal Voucher", label: "Journal Voucher" },
  { value: "Cash Transfer", label: "Cash Transfer voucher" },

  // Production
  { value: "Egg Production", label: "Egg Production" },
  { value: "Sale Invoice", label: "Sale Invoice" },
  { value: "Purchase Recognition", label: "Purchase Recognition" },
  { value: "Chicken", label: "Chicken" },
  { value: "Cow", label: "Cow" },
  { value: "Fish", label: "Fish" },
  { value: "Farm calendar", label: "Farm calendar" },
  { value: "Farm Budget", label: "Farm Budget" },
  { value: "Project Management", label: "Project Management" },
   { value: "Agenda Management", label: "Agenda Management" },
   { value: "Ledger Period Calendar", label: "Ledger Period Calendar" },

  // Inventory
  { value: "Inventory", label: "Inventory" },
  { value: "Dispatch", label: "Dispatch" },
  { value: "Item Stock", label: "Item Stock" },

  // Account Report
  { value: "Income Expense Voucher", label: "Income Expense Voucher Report" },
  { value: " Expense Report", label: " Expense Report" },
  { value: "Income Report", label: "Income Report" },
  { value: "Sale Expense Report", label: "Sale Expense Report" },
  { value: "General Ledger", label: "General Ledger Report" },
  { value: "Trail Balance", label: "Trail Balance Report" },
  { value: "Cash Flow Statement", label: "Cash Flow Statement Report" },
  { value: "Project Profile Report", label: "Project Profile Report" },
  { value: "Calendar-Report", label: "Project Calendar Report" },

  // Inventory Report
  { value: "Daily Expense Report", label: "Daily Expense Report" },
  { value: "Daily Income Report", label: "Daily Income Report" },
  { value: "Ledger", label: "Ledger Report" },
  { value: "Cash Book", label: "Cash Book Report" },

  // Setup
  { value: "Chart of Account", label: "Chart of Account" },
  { value: "Customer Info", label: "Customer Info" },
  { value: "Supplier Info", label: "Supplier Info" },
  { value: "Item", label: "Item" },
  { value: "Farm Type", label: "Farm Type" },
   { value: "Employee", label: "Employee" },
    { value: "Department", label: "Department" },
     { value: "Meeting Room", label: "Meeting Room" },

  // User Management
  { value: "User Management", label: "User Management" },
  { value: "Module", label: "Module" },
  { value: "Role", label: "Role" },
  { value: "Permission", label: "Permission" },
];