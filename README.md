Agro Farm ERP and Accounting System

A full-stack ERP and accounting web application for managing farm operations and finances in one place: projects, production tracking, invoicing, vouchers, journals and financial reports, with role-based access and approval workflows.

Features

Accounting

Payment vouchers, receive vouchers and journal entries
Ledger period / fiscal year management
Financial reports: cash flow statement, income statement and expense statement

Sales and Purchase

Sale invoices with PDF invoice generation
Purchase recognition with an approval workflow (approve, then post to inventory and payment)
Linked receive vouchers against invoices

Farm Operations

Farm project management with phases, activities and financial projections
Farm budget (header and detail)
Cow, chicken, fish and egg production modules
Farm calendar and inventory sheet

Management

Meeting / agenda management with participants, minutes and action items
Dashboard with expense and income panels and date-filtered stats

Security and Access

Role-Based Access Control (RBAC) for modules and actions
Audit trail fields on records (entry by, updated by, updated date)

HR Integration

Hikvision attendance device data stored through the device API and shown in the HR dashboard
Tech Stack
Layer	Technology
Frontend	React (Vite), TanStack Query, TanStack Table, react-hook-form, Zod, shadcn/ui, Tailwind CSS
Backend	Node.js, Express.js
Database	Oracle Database (node-oracledb)
Auth	JWT, RBAC
Other	PDF generation for invoices, Hikvision device API
