// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import * as XLSX from "xlsx";
// import {
//   IconArrowLeft, IconDownload, IconTarget, IconBuildingWarehouse,
//   IconCoin, IconTrendingUp, IconAlertTriangle, IconHeartHandshake,
// } from "@tabler/icons-react";

// import { SectionContainer } from "@/components/SectionContainer";
// import {
//   Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Button } from "@/components/ui/button";

// // ── API base + fetcher (calendar report-er shathe same pattern) ───────────
// const BASE = import.meta.env.VITE_API_BASE_URL;
// const API = `${BASE}/api/project-profile`;

// const fetchJSON = async (url, options = {}) => {
//   const res = await fetch(url, options);
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || `${res.status} ${res.statusText}`);
//   }
//   const json = await res.json();
//   return json.data ?? json;
// };

// export const projectProfileReportKeys = {
//   all: ["projectProfileReport"],
//   detail: (id) => [...projectProfileReportKeys.all, "detail", id],
// };

// const fetchProjectProfileReport = (projectId) => fetchJSON(`${API}/projects/${projectId}/report`);

// const fmtMoney = (v) => (v == null ? "—" : `BDT ${Number(v).toLocaleString()}`);

// // ── Excel export builder (mirrors format_of_project_plan.xlsx layout) ─────
// function buildReportWorkbook(report) {
//   const {
//     project, objectives = [], capacity = [], infrastructure = [],
//     investments = [], schedules = [], marketingChannels = [],
//     financialProjections = [], risks = [], socialBenefits = [], conclusion,
//   } = report;

//   const rows = [];
//   const push = (...cells) => rows.push(cells);
//   const blank = () => rows.push([]);

//   push("PROJECT PROFILE");
//   blank();
//   push("Project Name", project.PROJECT_NAME);
//   push("Location", project.PROJECT_LOCATION || "—");
//   push("Owner", project.OWNER_NAME || "—");
//   push("Contact Number", project.CONTACT_NUMBER || "—");
//   push("Business Type", project.BUSINESS_TYPE || "—");
//   push("Duration", project.DURATION_DESC || "—");
//   blank(); blank();

//   push("Executive Summary");
//   blank();
//   push(project.EXECUTIVE_SUMMARY || "—");
//   blank(); blank();

//   push("Project Objectives");
//   blank();
//   push("#", "Objective", "Target Indicator");
//   objectives.forEach((o) => push(o.SEQUENCE_NO ?? "—", o.OBJECTIVE_DESC, o.TARGET_INDICATOR || "—"));
//   blank(); blank();

//   push("Farm Capacity");
//   blank();
//   push("Metric", "Value");
//   capacity.forEach((c) => push(c.METRIC_DESCRIPTION, c.QUANTITY_VALUE));
//   blank(); blank();

//   push("Infrastructure Requirements");
//   blank();
//   push("Item", "Specification", "Qty", "Unit Cost (BDT)", "Total Cost (BDT)");
//   infrastructure.forEach((i) =>
//     push(i.ITEM_NAME, i.SPECIFICATION || "—", i.QUANTITY, i.UNIT_COST_BDT, i.TOTAL_COST_BDT)
//   );
//   blank(); blank();

//   push("Investment Cost");
//   blank();
//   push("Type", "Particulars", "Amount (BDT)");
//   investments.forEach((inv) => push(inv.INVESTMENT_TYPE, inv.PARTICULARS, inv.AMOUNT_BDT));
//   blank(); blank();

//   push("Production Plan / Feeding Schedule");
//   blank();
//   push("Time Period", "Item Description");
//   schedules.forEach((s) => push(s.TIME_PERIOD, s.ITEM_DESCRIPTION));
//   blank(); blank();

//   push("Marketing Strategy");
//   blank();
//   push("Channel", "Remarks");
//   marketingChannels.forEach((m) => push(m.CHANNEL_NAME, m.REMARKS || "—"));
//   blank(); blank();

//   push("Financial Projection");
//   blank();
//   push("Scope", "Revenue (BDT)", "Operating Cost (BDT)", "Gross Profit (BDT)");
//   financialProjections.forEach((f) => push(f.PROJECTION_SCOPE, f.REVENUE_AMOUNT, f.OPERATING_COST, f.GROSS_PROFIT));
//   blank(); blank();

//   push("Risk Management");
//   blank();
//   push("Category", "Description", "Likelihood", "Impact", "Mitigation");
//   risks.forEach((r) => push(r.RISK_CATEGORY, r.RISK_DESCRIPTION, r.LIKELIHOOD, r.IMPACT, r.MITIGATION_STRATEGY || "—"));
//   blank(); blank();

//   push("Social & Economic Benefits");
//   blank();
//   push("Category", "Description");
//   socialBenefits.forEach((b) => push(b.BENEFIT_CATEGORY, b.DESCRIPTION));
//   blank(); blank();

//   push("Conclusion");
//   blank();
//   push(conclusion?.CONCLUSION_TEXT || "—");

//   const ws = XLSX.utils.aoa_to_sheet(rows);
//   ws["!cols"] = [{ wch: 24 }, { wch: 45 }, { wch: 16 }, { wch: 16 }, { wch: 30 }];
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Project Profile");
//   return wb;
// }

// const handleExportExcel = (report) => {
//   const wb = buildReportWorkbook(report);
//   const fileName = `Project_Profile_${(report.project.PROJECT_NAME || "report").replace(/\s+/g, "_")}.xlsx`;
//   XLSX.writeFile(wb, fileName);
// };

// // ── Small presentational helpers ───────────────────────────────────────
// function StatCard({ icon: Icon, label, value, accent = "text-primary" }) {
//   return (
//     <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
//       <div className={`rounded-md bg-muted p-2 ${accent}`}>
//         <Icon size={20} />
//       </div>
//       <div>
//         <p className="text-xs text-muted-foreground">{label}</p>
//         <p className="text-lg font-semibold">{value ?? "—"}</p>
//       </div>
//     </div>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div className="space-y-2">
//       <h3 className="text-base font-semibold">{title}</h3>
//       {children}
//     </div>
//   );
// }

// function EmptyRow({ colSpan, label }) {
//   return (
//     <TableRow>
//       <TableCell colSpan={colSpan} className="text-center text-sm text-muted-foreground">
//         No {label} recorded.
//       </TableCell>
//     </TableRow>
//   );
// }

// function BackButton({ onClick }) {
//   return (
//     <Button variant="ghost" size="sm" onClick={onClick}>
//       <IconArrowLeft size={16} className="mr-1" />
//       Back to Projects
//     </Button>
//   );
// }

// // ── Main page ────────────────────────────────────────────────────────────
// export default function ProjectProfileReportPage() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();

//   const goBack = () => navigate("/dashboard/project-profile-report");

//   const { data: report, isLoading, isError } = useQuery({
//     queryKey: projectProfileReportKeys.detail(projectId),
//     queryFn: () => fetchProjectProfileReport(projectId),
//     enabled: !!projectId,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     throwOnError: false,
//   });

//   if (isLoading) {
//     return (
//       <SectionContainer title="Project Profile Report">
//         <BackButton onClick={goBack} />
//         <div className="space-y-3">
//           <Skeleton className="h-24 w-full" />
//           <Skeleton className="h-64 w-full" />
//         </div>
//       </SectionContainer>
//     );
//   }

//   if (isError || !report) {
//     return (
//       <SectionContainer title="Project Profile Report">
//         <BackButton onClick={goBack} />
//         <p className="text-sm text-destructive">
//           Report could not be loaded. Please confirm the project exists and try again.
//         </p>
//       </SectionContainer>
//     );
//   }

//   const {
//     project, objectives, capacity, infrastructure, investments,
//     schedules, marketingChannels, financialProjections,
//     risks, socialBenefits, conclusion,
//   } = report;

//   const totalInfraCost = infrastructure.reduce((sum, i) => sum + (Number(i.TOTAL_COST_BDT) || 0), 0);
//   const totalInvestment = investments.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
//   const annualProjection = financialProjections.find((f) => f.PROJECTION_SCOPE === "ANNUAL");

//   return (
//     <SectionContainer
//       title={`Project Profile Report — ${project.PROJECT_NAME}`}
//       description={`${project.BUSINESS_TYPE || "—"} · ${project.PROJECT_LOCATION || "Location not set"}`}
//     >
//       <div className="mb-4 flex items-center justify-between">
//         <BackButton onClick={goBack} />
//         <Button variant="outline" size="sm" onClick={() => handleExportExcel(report)}>
//           <IconDownload size={16} className="mr-1" />
//           Export to Excel
//         </Button>
//       </div>

//       <div className="space-y-8">
//         {/* Summary cards */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <StatCard icon={IconBuildingWarehouse} label="Infrastructure Cost" value={fmtMoney(totalInfraCost)} />
//           <StatCard icon={IconCoin} label="Total Investment" value={fmtMoney(totalInvestment)} accent="text-amber-600" />
//           <StatCard
//             icon={IconTrendingUp}
//             label="Annual Gross Profit"
//             value={fmtMoney(annualProjection?.GROSS_PROFIT)}
//             accent="text-emerald-600"
//           />
//           <StatCard icon={IconTarget} label="Objectives" value={objectives.length} />
//         </div>

//         {/* Project Info + Executive Summary */}
//         <Section title="Project Information">
//           <Table>
//             <TableBody> <TableRow><TableCell className="font-medium">Project Name:</TableCell><TableCell>{project.PROJECT_NAME || "—"}</TableCell></TableRow>
//              <TableRow><TableCell className="font-medium">Project Location:</TableCell><TableCell>{project.PROJECT_LOCATION || "—"}</TableCell></TableRow>
//               <TableRow><TableCell className="w-48 font-medium">Owner:</TableCell><TableCell>{project.OWNER_NAME || "—"}</TableCell></TableRow>
//               <TableRow><TableCell className="font-medium">Contact Number :</TableCell><TableCell>{project.CONTACT_NUMBER || "—"}</TableCell></TableRow>
//               <TableRow><TableCell className="font-medium">Duration:</TableCell><TableCell>{project.DURATION_DESC || "—"}</TableCell></TableRow>
//                <TableRow><TableCell className="font-medium">Project Business type:</TableCell><TableCell>{project.BUSINESS_TYPE || "—"}</TableCell></TableRow>
                
//             </TableBody>
//           </Table>
//            <h1 className="text-base font-semibold"> Executive Summary</h1>
//           {project.EXECUTIVE_SUMMARY && (
           
//             <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{project.EXECUTIVE_SUMMARY}</p>
//           )}
//         </Section>

//         {/* Objectives */}
//         <Section title="Project Objectives">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-12">#</TableHead>
//                 <TableHead>Objective</TableHead>
//                 <TableHead>Target Indicator</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {objectives.length === 0 && <EmptyRow colSpan={3} label="objectives" />}
//               {objectives.map((o) => (
//                 <TableRow key={o.OBJECTIVE_ID}>
//                   <TableCell>{o.SEQUENCE_NO ?? "—"}</TableCell>
//                   <TableCell>{o.OBJECTIVE_DESC}</TableCell>
//                   <TableCell className="text-muted-foreground">{o.TARGET_INDICATOR || "—"}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Farm Capacity */}
//         <Section title="Farm Capacity">
//           <Table>
//             <TableHeader>
//               <TableRow><TableHead>Metric</TableHead><TableHead>Value</TableHead></TableRow>
//             </TableHeader>
//             <TableBody>
//               {capacity.length === 0 && <EmptyRow colSpan={2} label="capacity metrics" />}
//               {capacity.map((c) => (
//                 <TableRow key={c.CAPACITY_ID}>
//                   <TableCell>{c.METRIC_DESCRIPTION}</TableCell>
//                   <TableCell className="font-medium">{c.QUANTITY_VALUE}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Infrastructure Requirements */}
//         <Section title="Infrastructure Requirements">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Item</TableHead>
//                 <TableHead>Specification</TableHead>
//                 <TableHead className="w-16">Qty</TableHead>
//                 <TableHead className="w-32">Unit Cost</TableHead>
//                 <TableHead className="w-32">Total Cost</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {infrastructure.length === 0 && <EmptyRow colSpan={5} label="infrastructure items" />}
//               {infrastructure.map((i) => (
//                 <TableRow key={i.INFRA_ID}>
//                   <TableCell>{i.ITEM_NAME}</TableCell>
//                   <TableCell className="text-muted-foreground">{i.SPECIFICATION || "—"}</TableCell>
//                   <TableCell>{i.QUANTITY}</TableCell>
//                   <TableCell>{fmtMoney(i.UNIT_COST_BDT)}</TableCell>
//                   <TableCell className="font-medium">{fmtMoney(i.TOTAL_COST_BDT)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Investment Cost
//         <Section title="Investment Cost">
//           <Table>
//             <TableHeader>
//               <TableRow><TableHead className="w-40">Type</TableHead><TableHead>Particulars</TableHead><TableHead className="w-32">Amount</TableHead></TableRow>
//             </TableHeader>
//             <TableBody>
//               {investments.length === 0 && <EmptyRow colSpan={3} label="investment records" />}
//               {investments.map((inv) => (
//                 <TableRow key={inv.INVESTMENT_ID}>
//                   <TableCell><Badge variant="secondary">{inv.INVESTMENT_TYPE}</Badge></TableCell>
//                   <TableCell>{inv.PARTICULARS}</TableCell>
//                   <TableCell className="font-medium">{fmtMoney(inv.AMOUNT_BDT)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section> */}

//          {/* Investment Cost */}
//         <Section title="Investment Cost">
//           {(() => {
//             const fixed = investments.filter((i) => i.INVESTMENT_TYPE === "FIXED_ASSET");
//             const working = investments.filter((i) => i.INVESTMENT_TYPE === "WORKING_CAPITAL");
//             const fixedTotal = fixed.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
//             const workingTotal = working.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
//             const grandTotal = fixedTotal + workingTotal;

//             const CostGroup = ({ heading, rows, total }) => (
//               <div className="space-y-1">
//                 <h4 className="text-sm font-semibold">{heading}</h4>
//                 <Table>
//                   <TableHeader>
//                     <TableRow><TableHead>Particulars</TableHead><TableHead className="w-32 text-right">Amount (BDT)</TableHead></TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {rows.length === 0 && <EmptyRow colSpan={2} label="items" />}
//                     {rows.map((inv) => (
//                       <TableRow key={inv.INVESTMENT_ID}>
//                         <TableCell>{inv.PARTICULARS}</TableCell>
//                         <TableCell className="text-right">{Number(inv.AMOUNT_BDT).toLocaleString()}</TableCell>
//                       </TableRow>
//                     ))}
//                     <TableRow className="bg-muted/50 font-semibold">
//                       <TableCell>Total {heading}</TableCell>
//                       <TableCell className="text-right">{total.toLocaleString()}</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </div>
//             );

//             return (
//               <div className="space-y-6">
//                 <CostGroup heading="Fixed Cost" rows={fixed} total={fixedTotal} />
//                 <CostGroup heading="Working Capital" rows={working} total={workingTotal} />

//                 <div className="space-y-1">
//                   <h4 className="text-sm font-semibold">Total Project Cost</h4>
//                   <Table>
//                     <TableHeader>
//                       <TableRow><TableHead>Description</TableHead><TableHead className="w-32 text-right">Amount (BDT)</TableHead></TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       <TableRow>
//                         <TableCell>Fixed Cost</TableCell>
//                         <TableCell className="text-right">{fixedTotal.toLocaleString()}</TableCell>
//                       </TableRow>
//                       <TableRow>
//                         <TableCell>Working Capital</TableCell>
//                         <TableCell className="text-right">{workingTotal.toLocaleString()}</TableCell>
//                       </TableRow>
//                       <TableRow className="bg-muted font-semibold">
//                         <TableCell>Total Investment</TableCell>
//                         <TableCell className="text-right">{grandTotal.toLocaleString()}</TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </div>
//               </div>
//             );
//           })()}
//         </Section>

//         {/* Production Plan / Feeding Schedule */}
//         <Section title="Production Plan / Feeding Schedule">
//           <Table>
//             <TableHeader>
//               <TableRow><TableHead className="w-40">Time Period</TableHead><TableHead>Item Description</TableHead></TableRow>
//             </TableHeader>
//             <TableBody>
//               {schedules.length === 0 && <EmptyRow colSpan={2} label="schedule items" />}
//               {schedules.map((s) => (
//                 <TableRow key={s.SCHEDULE_ID}>
//                   <TableCell className="font-medium">{s.TIME_PERIOD}</TableCell>
//                   <TableCell>{s.ITEM_DESCRIPTION}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Marketing Strategy */}
//         <Section title="Marketing Strategy">
//           <Table>
//             <TableHeader>
//               <TableRow><TableHead>Channel</TableHead><TableHead>Remarks</TableHead></TableRow>
//             </TableHeader>
//             <TableBody>
//               {marketingChannels.length === 0 && <EmptyRow colSpan={2} label="marketing channels" />}
//               {marketingChannels.map((m) => (
//                 <TableRow key={m.CHANNEL_ID}>
//                   <TableCell>{m.CHANNEL_NAME}</TableCell>
//                   <TableCell className="text-muted-foreground">{m.REMARKS || "—"}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Financial Projection */}
//         <Section title="Financial Projection">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-28">Scope</TableHead>
//                 <TableHead>Revenue</TableHead>
//                 <TableHead>Operating Cost</TableHead>
//                 <TableHead>Gross Profit</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {financialProjections.length === 0 && <EmptyRow colSpan={4} label="financial projections" />}
//               {financialProjections.map((f) => (
//                 <TableRow key={f.PROJECTION_ID}>
//                   <TableCell><Badge variant={f.PROJECTION_SCOPE === "ANNUAL" ? "default" : "secondary"}>{f.PROJECTION_SCOPE}</Badge></TableCell>
//                   <TableCell>{fmtMoney(f.REVENUE_AMOUNT)}</TableCell>
//                   <TableCell>{fmtMoney(f.OPERATING_COST)}</TableCell>
//                   <TableCell className="font-medium text-emerald-600">{fmtMoney(f.GROSS_PROFIT)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Risk Management */}
//         <Section title="Risk Management">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Description</TableHead>
//                 <TableHead className="w-24">Likelihood</TableHead>
//                 <TableHead className="w-24">Impact</TableHead>
//                 <TableHead>Mitigation</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {risks.length === 0 && <EmptyRow colSpan={5} label="risk items" />}
//               {risks.map((r) => (
//                 <TableRow key={r.RISK_ID}>
//                   <TableCell>{r.RISK_CATEGORY}</TableCell>
//                   <TableCell className="text-muted-foreground">{r.RISK_DESCRIPTION}</TableCell>
//                   <TableCell><Badge variant="outline">{r.LIKELIHOOD}</Badge></TableCell>
//                   <TableCell><Badge variant="outline">{r.IMPACT}</Badge></TableCell>
//                   <TableCell className="text-muted-foreground">{r.MITIGATION_STRATEGY || "—"}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Social & Economic Benefits */}
//         <Section title="Social & Economic Benefits">
//           <Table>
//             <TableHeader>
//               <TableRow><TableHead>Category</TableHead><TableHead>Description</TableHead></TableRow>
//             </TableHeader>
//             <TableBody>
//               {socialBenefits.length === 0 && <EmptyRow colSpan={2} label="benefit items" />}
//               {socialBenefits.map((b) => (
//                 <TableRow key={b.BENEFIT_ID}>
//                   <TableCell className="flex items-center gap-2"><IconHeartHandshake size={14} className="text-primary" />{b.BENEFIT_CATEGORY}</TableCell>
//                   <TableCell className="text-muted-foreground">{b.DESCRIPTION}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Section>

//         {/* Conclusion */}
//         <Section title="Conclusion">
//           {conclusion?.CONCLUSION_TEXT ? (
//             <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{conclusion.CONCLUSION_TEXT}</p>
//           ) : (
//             <p className="flex items-center gap-2 text-sm text-muted-foreground">
//               <IconAlertTriangle size={14} />
//               No conclusion recorded yet.
//             </p>
//           )}
//         </Section>
//       </div>
//     </SectionContainer>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import {
  IconArrowLeft, IconDownload, IconTarget, IconBuildingWarehouse,
  IconCoin, IconTrendingUp, IconAlertTriangle, IconHeartHandshake,
  IconCalendar, IconUser, IconPhone, IconBriefcase, IconMapPin,
  IconRefresh,
} from "@tabler/icons-react";
import { Printer } from "lucide-react";

import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher ───────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/project-profile`;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

export const projectProfileReportKeys = {
  all: ["projectProfileReport"],
  detail: (id) => [...projectProfileReportKeys.all, "detail", id],
};

const fetchProjectProfileReport = (projectId) => fetchJSON(`${API}/projects/${projectId}/report`);

const fmtMoney = (v) => (v == null ? "—" : `BDT ${Number(v).toLocaleString()}`);

// ── Excel export builder ─────────────────────────────────────────────────────
function buildReportWorkbook(report) {
  const {
    project, objectives = [], capacity = [], infrastructure = [],
    investments = [], schedules = [], marketingChannels = [],
    financialProjections = [], risks = [], socialBenefits = [], conclusion,
  } = report;

  const rows = [];
  const push = (...cells) => rows.push(cells);
  const blank = () => rows.push([]);

  push("PROJECT PROFILE");
  blank();
  push("Project Name", project.PROJECT_NAME);
  push("Location", project.PROJECT_LOCATION || "—");
  push("Owner", project.OWNER_NAME || "—");
  push("Contact Number", project.CONTACT_NUMBER || "—");
  push("Business Type", project.BUSINESS_TYPE || "—");
  push("Duration", project.DURATION_DESC || "—");
  blank(); blank();

  push("Executive Summary");
  blank();
  push(project.EXECUTIVE_SUMMARY || "—");
  blank(); blank();

  push("Project Objectives");
  blank();
  push("#", "Objective", "Target Indicator");
  objectives.forEach((o) => push(o.SEQUENCE_NO ?? "—", o.OBJECTIVE_DESC, o.TARGET_INDICATOR || "—"));
  blank(); blank();

  push("Farm Capacity");
  blank();
  push("Metric", "Value");
  capacity.forEach((c) => push(c.METRIC_DESCRIPTION, c.QUANTITY_VALUE));
  blank(); blank();

  push("Infrastructure Requirements");
  blank();
  push("Item", "Specification", "Qty", "Unit Cost (BDT)", "Total Cost (BDT)");
  infrastructure.forEach((i) =>
    push(i.ITEM_NAME, i.SPECIFICATION || "—", i.QUANTITY, i.UNIT_COST_BDT, i.TOTAL_COST_BDT)
  );
  blank(); blank();

  push("Investment Cost");
  blank();
  push("Type", "Particulars", "Amount (BDT)");
  investments.forEach((inv) => push(inv.INVESTMENT_TYPE, inv.PARTICULARS, inv.AMOUNT_BDT));
  blank(); blank();

  push("Production Plan / Feeding Schedule");
  blank();
  push("Time Period", "Item Description");
  schedules.forEach((s) => push(s.TIME_PERIOD, s.ITEM_DESCRIPTION));
  blank(); blank();

  push("Marketing Strategy");
  blank();
  push("Channel", "Remarks");
  marketingChannels.forEach((m) => push(m.CHANNEL_NAME, m.REMARKS || "—"));
  blank(); blank();

  push("Financial Projection");
  blank();
  push("Scope", "Revenue (BDT)", "Operating Cost (BDT)", "Gross Profit (BDT)");
  financialProjections.forEach((f) => push(f.PROJECTION_SCOPE, f.REVENUE_AMOUNT, f.OPERATING_COST, f.GROSS_PROFIT));
  blank(); blank();

  push("Risk Management");
  blank();
  push("Category", "Description", "Likelihood", "Impact", "Mitigation");
  risks.forEach((r) => push(r.RISK_CATEGORY, r.RISK_DESCRIPTION, r.LIKELIHOOD, r.IMPACT, r.MITIGATION_STRATEGY || "—"));
  blank(); blank();

  push("Social & Economic Benefits");
  blank();
  push("Category", "Description");
  socialBenefits.forEach((b) => push(b.BENEFIT_CATEGORY, b.DESCRIPTION));
  blank(); blank();

  push("Conclusion");
  blank();
  push(conclusion?.CONCLUSION_TEXT || "—");

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 24 }, { wch: 45 }, { wch: 16 }, { wch: 16 }, { wch: 30 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Project Profile");
  return wb;
}

const handleExportExcel = (report) => {
  const wb = buildReportWorkbook(report);
  const fileName = `Project_Profile_${(report.project.PROJECT_NAME || "report").replace(/\s+/g, "_")}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

// ── Presentational helpers ──────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
    rose: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md hover:border-gray-300">
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${colors[color] || colors.emerald}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-base font-bold text-gray-900 truncate">{value ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={18} className="text-emerald-700" />}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyRow({ colSpan, label }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-sm text-gray-400">
        No {label} recorded.
      </TableCell>
    </TableRow>
  );
}

function InfoRow({ label, value }) {
  return (
    <TableRow className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      <TableCell className="py-3 text-xs font-medium text-gray-500 w-36">{label}</TableCell>
      <TableCell className="py-3 text-sm text-gray-700">{value || "—"}</TableCell>
    </TableRow>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProjectProfileReportPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard/project-profile-report");

  const { data: report, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: projectProfileReportKeys.detail(projectId),
    queryFn: () => fetchProjectProfileReport(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goBack} className="text-gray-500 hover:text-gray-700">
                <IconArrowLeft size={16} className="mr-1.5" /> Back
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
              <IconAlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-red-700">
                Report could not be loaded
              </p>
              <p className="text-xs text-red-500 mt-1">
                Please confirm the project exists and try again.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
              >
                {isFetching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1.5" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <IconRefresh size={14} className="mr-1.5" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    project, objectives, capacity, infrastructure, investments,
    schedules, marketingChannels, financialProjections,
    risks, socialBenefits, conclusion,
  } = report;

  const totalInfraCost = infrastructure.reduce((sum, i) => sum + (Number(i.TOTAL_COST_BDT) || 0), 0);
  const totalInvestment = investments.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
  const annualProjection = financialProjections.find((f) => f.PROJECTION_SCOPE === "ANNUAL");

  return (
    <div className="p-4 md:p-6">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goBack}
              className="text-gray-400 hover:text-gray-600 -ml-2 hover:bg-gray-50"
            >
              <IconArrowLeft size={18} />
            </Button>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-gray-900 truncate">{project.PROJECT_NAME}</h2>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <IconMapPin size={12} />
                <span className="truncate">{project.PROJECT_LOCATION || "No location set"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isFetching}
              className="border-gray-200 bg-white"
            >
              <IconRefresh className={`h-3.5 w-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.print()}
              className="border-gray-200 bg-white"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportExcel(report)}
              className="border-gray-200 bg-white"
            >
              <IconDownload size={14} className="mr-1.5" /> Excel
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={IconBuildingWarehouse} 
              label="Infrastructure Cost" 
              value={fmtMoney(totalInfraCost)} 
              color="blue"
            />
            <StatCard 
              icon={IconCoin} 
              label="Total Investment" 
              value={fmtMoney(totalInvestment)} 
              color="amber"
            />
            <StatCard
              icon={IconTrendingUp}
              label="Annual Gross Profit"
              value={fmtMoney(annualProjection?.GROSS_PROFIT)}
              color="emerald"
            />
            <StatCard 
              icon={IconTarget} 
              label="Objectives" 
              value={objectives.length} 
              color="purple"
            />
          </div>

          {/* Project Information */}
          <Section title="Project Information" icon={IconBuildingWarehouse}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableBody>
                  <InfoRow label="Project Name" value={project.PROJECT_NAME} />
                  <InfoRow label="Location" value={project.PROJECT_LOCATION} />
                  <InfoRow label="Owner" value={project.OWNER_NAME} />
                  <InfoRow label="Contact Number" value={project.CONTACT_NUMBER} />
                  <InfoRow label="Business Type" value={project.BUSINESS_TYPE} />
                  <InfoRow label="Duration" value={project.DURATION_DESC} />
                </TableBody>
              </Table>
            </div>
            {project.EXECUTIVE_SUMMARY && (
              <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200 p-5 mt-3">
                <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-600 rounded-full"></span>
                  Executive Summary
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{project.EXECUTIVE_SUMMARY}</p>
              </div>
            )}
          </Section>

          {/* Objectives */}
          <Section title="Project Objectives" icon={IconTarget}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500 w-12">#</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Objective</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Target Indicator</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {objectives.length === 0 && <EmptyRow colSpan={3} label="objectives" />}
                  {objectives.map((o) => (
                    <TableRow key={o.OBJECTIVE_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm text-gray-500">{o.SEQUENCE_NO ?? "—"}</TableCell>
                      <TableCell className="text-sm text-gray-700">{o.OBJECTIVE_DESC}</TableCell>
                      <TableCell className="text-sm text-gray-500">{o.TARGET_INDICATOR || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Farm Capacity */}
          <Section title="Farm Capacity" icon={IconBuildingWarehouse}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Metric</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capacity.length === 0 && <EmptyRow colSpan={2} label="capacity metrics" />}
                  {capacity.map((c) => (
                    <TableRow key={c.CAPACITY_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm text-gray-700">{c.METRIC_DESCRIPTION}</TableCell>
                      <TableCell className="text-sm font-semibold text-gray-800">{c.QUANTITY_VALUE}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Infrastructure Requirements */}
          <Section title="Infrastructure Requirements" icon={IconBuildingWarehouse}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Item</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Specification</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-center w-16">Qty</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right w-28">Unit Cost</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right w-28">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {infrastructure.length === 0 && <EmptyRow colSpan={5} label="infrastructure items" />}
                  {infrastructure.map((i) => (
                    <TableRow key={i.INFRA_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm text-gray-700">{i.ITEM_NAME}</TableCell>
                      <TableCell className="text-sm text-gray-500">{i.SPECIFICATION || "—"}</TableCell>
                      <TableCell className="text-sm text-gray-700 text-center">{i.QUANTITY}</TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{fmtMoney(i.UNIT_COST_BDT)}</TableCell>
                      <TableCell className="text-sm font-semibold text-gray-800 text-right">{fmtMoney(i.TOTAL_COST_BDT)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Investment Cost */}
          <Section title="Investment Cost" icon={IconCoin}>
            {(() => {
              const fixed = investments.filter((i) => i.INVESTMENT_TYPE === "FIXED_ASSET");
              const working = investments.filter((i) => i.INVESTMENT_TYPE === "WORKING_CAPITAL");
              const fixedTotal = fixed.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
              const workingTotal = working.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
              const grandTotal = fixedTotal + workingTotal;

              const CostGroup = ({ heading, rows, total }) => (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{heading}</h4>
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="text-xs font-medium text-gray-500">Particulars</TableHead>
                          <TableHead className="text-xs font-medium text-gray-500 text-right w-32">Amount (BDT)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.length === 0 && <EmptyRow colSpan={2} label="items" />}
                        {rows.map((inv) => (
                          <TableRow key={inv.INVESTMENT_ID} className="hover:bg-gray-50/70 transition-colors">
                            <TableCell className="text-sm text-gray-700">{inv.PARTICULARS}</TableCell>
                            <TableCell className="text-sm text-gray-600 text-right">{Number(inv.AMOUNT_BDT).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50 font-semibold">
                          <TableCell className="text-sm text-gray-700">Total {heading}</TableCell>
                          <TableCell className="text-sm text-gray-800 text-right">{total.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );

              return (
                <div className="space-y-4">
                  <CostGroup heading="Fixed Cost" rows={fixed} total={fixedTotal} />
                  <CostGroup heading="Working Capital" rows={working} total={workingTotal} />

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Project Cost</h4>
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-sm text-gray-700">Fixed Cost</TableCell>
                            <TableCell className="text-sm text-gray-600 text-right">{fixedTotal.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-sm text-gray-700">Working Capital</TableCell>
                            <TableCell className="text-sm text-gray-600 text-right">{workingTotal.toLocaleString()}</TableCell>
                          </TableRow>
                          <TableRow className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 font-bold">
                            <TableCell className="text-sm text-emerald-800">Total Investment</TableCell>
                            <TableCell className="text-sm text-emerald-800 text-right">{grandTotal.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Section>

          {/* Production Plan / Feeding Schedule */}
          <Section title="Production Plan / Feeding Schedule" icon={IconCalendar}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500 w-40">Time Period</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Item Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.length === 0 && <EmptyRow colSpan={2} label="schedule items" />}
                  {schedules.map((s) => (
                    <TableRow key={s.SCHEDULE_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm font-medium text-gray-700">{s.TIME_PERIOD}</TableCell>
                      <TableCell className="text-sm text-gray-600">{s.ITEM_DESCRIPTION}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Marketing Strategy */}
          <Section title="Marketing Strategy" icon={IconBriefcase}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Channel</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingChannels.length === 0 && <EmptyRow colSpan={2} label="marketing channels" />}
                  {marketingChannels.map((m) => (
                    <TableRow key={m.CHANNEL_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="text-sm font-medium text-gray-700">{m.CHANNEL_NAME}</TableCell>
                      <TableCell className="text-sm text-gray-500">{m.REMARKS || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Financial Projection */}
          <Section title="Financial Projection" icon={IconTrendingUp}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500 w-24">Scope</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right">Revenue</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right">Operating Cost</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-right">Gross Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financialProjections.length === 0 && <EmptyRow colSpan={4} label="financial projections" />}
                  {financialProjections.map((f) => (
                    <TableRow key={f.PROJECTION_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell>
                        <Badge 
                          className={f.PROJECTION_SCOPE === "ANNUAL" 
                            ? "bg-emerald-600 hover:bg-emerald-700" 
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }
                        >
                          {f.PROJECTION_SCOPE}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{fmtMoney(f.REVENUE_AMOUNT)}</TableCell>
                      <TableCell className="text-sm text-gray-600 text-right">{fmtMoney(f.OPERATING_COST)}</TableCell>
                      <TableCell className="text-sm font-semibold text-emerald-600 text-right">{fmtMoney(f.GROSS_PROFIT)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Risk Management */}
          <Section title="Risk Management" icon={IconAlertTriangle}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Category</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Description</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-center w-24">Likelihood</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500 text-center w-24">Impact</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Mitigation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.length === 0 && <EmptyRow colSpan={5} label="risk items" />}
                  {risks.map((r) => {
                    const likelihoodColors = {
                      LOW: "bg-green-100 text-green-700",
                      MEDIUM: "bg-yellow-100 text-yellow-700",
                      HIGH: "bg-red-100 text-red-700",
                    };
                    const impactColors = {
                      LOW: "bg-green-100 text-green-700",
                      MEDIUM: "bg-yellow-100 text-yellow-700",
                      HIGH: "bg-red-100 text-red-700",
                    };
                    return (
                      <TableRow key={r.RISK_ID} className="hover:bg-gray-50/70 transition-colors">
                        <TableCell className="text-sm font-medium text-gray-700">{r.RISK_CATEGORY}</TableCell>
                        <TableCell className="text-sm text-gray-600">{r.RISK_DESCRIPTION}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={likelihoodColors[r.LIKELIHOOD] || "bg-gray-100 text-gray-700"}>
                            {r.LIKELIHOOD}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={impactColors[r.IMPACT] || "bg-gray-100 text-gray-700"}>
                            {r.IMPACT}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{r.MITIGATION_STRATEGY || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Social & Economic Benefits */}
          <Section title="Social & Economic Benefits" icon={IconHeartHandshake}>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-gray-500">Category</TableHead>
                    <TableHead className="text-xs font-medium text-gray-500">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialBenefits.length === 0 && <EmptyRow colSpan={2} label="benefit items" />}
                  {socialBenefits.map((b) => (
                    <TableRow key={b.BENEFIT_ID} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <IconHeartHandshake size={12} className="text-emerald-700" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{b.BENEFIT_CATEGORY}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{b.DESCRIPTION}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Conclusion */}
          <Section title="Conclusion" icon={IconTarget}>
            {conclusion?.CONCLUSION_TEXT ? (
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200 p-5">
                <p className="text-sm text-gray-700 leading-relaxed">{conclusion.CONCLUSION_TEXT}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 p-6 text-center">
                <IconAlertTriangle size={24} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No conclusion recorded yet.</p>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}