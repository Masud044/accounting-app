import {
  Target, Gauge, Building2, Wallet, CalendarClock,
  Megaphone, TrendingUp, ShieldAlert, HeartHandshake,
} from "lucide-react";
import {
  objectivesApi, capacityApi, infrastructureApi, investmentsApi,
  schedulesApi, marketingApi, financialApi, risksApi, benefitsApi,
} from "./queries";

const fmt = (val) =>
  val == null || val === "" ? "—" : Number(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const textCell = (dbKey) => ({ row }) => <div>{row.original[dbKey] ?? "—"}</div>;
const amountCell = (dbKey) => ({ row }) => <div className="tabular-nums">{fmt(row.original[dbKey])}</div>;

// ═══════════════════ OBJECTIVES ═══════════════════
export const objectivesConfig = {
  title: "Objective",
  icon: Target,
  idKey: "OBJECTIVE_ID",
  ...objectivesApi,
  fields: [
    { name: "sequenceNo", dbKey: "SEQUENCE_NO", label: "Sequence No", type: "number" },
    { name: "objectiveDesc", dbKey: "OBJECTIVE_DESC", label: "Objective", type: "textarea", required: true },
    { name: "targetIndicator", dbKey: "TARGET_INDICATOR", label: "Target Indicator", type: "text" },
  ],
  columns: [
    { id: "SEQUENCE_NO", header: "#", cell: textCell("SEQUENCE_NO") },
    { id: "OBJECTIVE_DESC", header: "Objective", cell: textCell("OBJECTIVE_DESC") },
    { id: "TARGET_INDICATOR", header: "Target Indicator", cell: textCell("TARGET_INDICATOR") },
  ],
};

// ═══════════════════ CAPACITY ═══════════════════
export const capacityConfig = {
  title: "Capacity",
  icon: Gauge,
  idKey: "CAPACITY_ID",
  ...capacityApi,
  fields: [
    { name: "metricDescription", dbKey: "METRIC_DESCRIPTION", label: "Metric Description", type: "text", required: true },
    { name: "quantityValue", dbKey: "QUANTITY_VALUE", label: "Quantity", type: "text" },
  ],
  columns: [
    { id: "METRIC_DESCRIPTION", header: "Metric", cell: textCell("METRIC_DESCRIPTION") },
    { id: "QUANTITY_VALUE", header: "Quantity", cell: textCell("QUANTITY_VALUE") },
  ],
};

// ═══════════════════ INFRASTRUCTURE ═══════════════════
export const infrastructureConfig = {
  title: "Infrastructure",
  icon: Building2,
  idKey: "INFRA_ID",
  ...infrastructureApi,
  fields: [
    { name: "itemName", dbKey: "ITEM_NAME", label: "Item Name", type: "text", required: true },
    { name: "specification", dbKey: "SPECIFICATION", label: "Specification", type: "textarea" },
    { name: "quantity", dbKey: "QUANTITY", label: "Quantity", type: "number", required: true },
    { name: "unitCostBdt", dbKey: "UNIT_COST_BDT", label: "Unit Cost (BDT)", type: "number", required: true },
  ],
  columns: [
    { id: "ITEM_NAME", header: "Item", cell: textCell("ITEM_NAME") },
    { id: "SPECIFICATION", header: "Specification", cell: textCell("SPECIFICATION") },
    { id: "QUANTITY", header: "Qty", cell: amountCell("QUANTITY") },
    { id: "UNIT_COST_BDT", header: "Unit Cost", cell: amountCell("UNIT_COST_BDT") },
    { id: "TOTAL_COST_BDT", header: "Total Cost", cell: amountCell("TOTAL_COST_BDT") },
  ],
};

// ═══════════════════ INVESTMENTS ═══════════════════
export const investmentsConfig = {
  title: "Investment",
  icon: Wallet,
  idKey: "INVESTMENT_ID",
  ...investmentsApi,
  fields: [
    {
      name: "investmentType", dbKey: "INVESTMENT_TYPE", label: "Investment Type", type: "select", required: true,
      options: [{ value: "FIXED_ASSET", label: "Fixed Asset" }, { value: "WORKING_CAPITAL", label: "Working Capital" }],
    },
    { name: "particulars", dbKey: "PARTICULARS", label: "Particulars", type: "textarea", required: true },
    { name: "amountBdt", dbKey: "AMOUNT_BDT", label: "Amount (BDT)", type: "number", required: true },
  ],
  columns: [
    { id: "INVESTMENT_TYPE", header: "Type", cell: textCell("INVESTMENT_TYPE") },
    { id: "PARTICULARS", header: "Particulars", cell: textCell("PARTICULARS") },
    { id: "AMOUNT_BDT", header: "Amount", cell: amountCell("AMOUNT_BDT") },
  ],
};

// ═══════════════════ SCHEDULES ═══════════════════
export const schedulesConfig = {
  title: "Production Schedule",
  icon: CalendarClock,
  idKey: "SCHEDULE_ID",
  ...schedulesApi,
  fields: [
   // resource-configs.jsx → schedulesConfig.fields
{
  name: "timePeriod", dbKey: "TIME_PERIOD", label: "Time Period", type: "select", required: true,
  options: [
    { value: "MORNING", label: "Morning" },
    { value: "NOON", label: "Noon" },
    { value: "EVENING", label: "Evening" },
    { value: "GENERAL", label: "General" },
  ],
},
    { name: "itemDescription", dbKey: "ITEM_DESCRIPTION", label: "Item Description", type: "textarea", required: true },
  ],
  columns: [
    { id: "TIME_PERIOD", header: "Time Period", cell: textCell("TIME_PERIOD") },
    { id: "ITEM_DESCRIPTION", header: "Item", cell: textCell("ITEM_DESCRIPTION") },
  ],
};

// ═══════════════════ MARKETING CHANNELS ═══════════════════
export const marketingConfig = {
  title: "Marketing Channel",
  icon: Megaphone,
  idKey: "CHANNEL_ID",
  ...marketingApi,
  fields: [
    { name: "channelName", dbKey: "CHANNEL_NAME", label: "Channel Name", type: "text", required: true },
    { name: "remarks", dbKey: "REMARKS", label: "Remarks", type: "textarea" },
  ],
  columns: [
    { id: "CHANNEL_NAME", header: "Channel", cell: textCell("CHANNEL_NAME") },
    { id: "REMARKS", header: "Remarks", cell: textCell("REMARKS") },
  ],
};

// ═══════════════════ FINANCIAL PROJECTIONS ═══════════════════
export const financialConfig = {
  title: "Financial Projection",
  icon: TrendingUp,
  idKey: "PROJECTION_ID",
  ...financialApi,
  fields: [
    {
      name: "projectionScope", dbKey: "PROJECTION_SCOPE", label: "Scope", type: "select", required: true,
      options: [{ value: "PER_CYCLE", label: "Per Cycle" }, { value: "ANNUAL", label: "Annual" }],
    },
    { name: "revenueAmount", dbKey: "REVENUE_AMOUNT", label: "Revenue Amount", type: "number", required: true },
    { name: "operatingCost", dbKey: "OPERATING_COST", label: "Operating Cost", type: "number", required: true },
  ],
  columns: [
    { id: "PROJECTION_SCOPE", header: "Scope", cell: textCell("PROJECTION_SCOPE") },
    { id: "REVENUE_AMOUNT", header: "Revenue", cell: amountCell("REVENUE_AMOUNT") },
    { id: "OPERATING_COST", header: "Operating Cost", cell: amountCell("OPERATING_COST") },
    { id: "GROSS_PROFIT", header: "Gross Profit", cell: amountCell("GROSS_PROFIT") },
  ],
};

// ═══════════════════ RISKS ═══════════════════
export const risksConfig = {
  title: "Risk",
  icon: ShieldAlert,
  idKey: "RISK_ID",
  ...risksApi,
  fields: [
    { name: "riskCategory", dbKey: "RISK_CATEGORY", label: "Risk Category", type: "text", required: true },
    { name: "riskDescription", dbKey: "RISK_DESCRIPTION", label: "Risk Description", type: "textarea", required: true },
    {
      name: "likelihood", dbKey: "LIKELIHOOD", label: "Likelihood", type: "select", required: true,
      options: [{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }],
    },
    {
      name: "impact", dbKey: "IMPACT", label: "Impact", type: "select", required: true,
      options: [{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }],
    },
    { name: "mitigationStrategy", dbKey: "MITIGATION_STRATEGY", label: "Mitigation Strategy", type: "textarea" },
  ],
  columns: [
    { id: "RISK_CATEGORY", header: "Category", cell: textCell("RISK_CATEGORY") },
    { id: "RISK_DESCRIPTION", header: "Description", cell: textCell("RISK_DESCRIPTION") },
    { id: "LIKELIHOOD", header: "Likelihood", cell: textCell("LIKELIHOOD") },
    { id: "IMPACT", header: "Impact", cell: textCell("IMPACT") },
    { id: "MITIGATION_STRATEGY", header: "Mitigation", cell: textCell("MITIGATION_STRATEGY") },
  ],
};

// ═══════════════════ SOCIAL / ECONOMIC BENEFITS ═══════════════════
export const benefitsConfig = {
  title: "Social Benefit",
  icon: HeartHandshake,
  idKey: "BENEFIT_ID",
  ...benefitsApi,
  fields: [
    { name: "benefitCategory", dbKey: "BENEFIT_CATEGORY", label: "Category", type: "text", required: true },
    { name: "description", dbKey: "DESCRIPTION", label: "Description", type: "textarea", required: true },
  ],
  columns: [
    { id: "BENEFIT_CATEGORY", header: "Category", cell: textCell("BENEFIT_CATEGORY") },
    { id: "DESCRIPTION", header: "Description", cell: textCell("DESCRIPTION") },
  ],
};