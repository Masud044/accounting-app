import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import {
  IconArrowLeft, IconDownload, IconTarget, IconBuildingWarehouse,
  IconCoin, IconTrendingUp, IconAlertTriangle, IconHeartHandshake,
} from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher (calendar report-er shathe same pattern) ───────────
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

// ── Excel export builder (mirrors format_of_project_plan.xlsx layout) ─────
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

// ── Small presentational helpers ───────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = "text-primary" }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div className={`rounded-md bg-muted p-2 ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function EmptyRow({ colSpan, label }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center text-sm text-muted-foreground">
        No {label} recorded.
      </TableCell>
    </TableRow>
  );
}

function BackButton({ onClick }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      <IconArrowLeft size={16} className="mr-1" />
      Back to Projects
    </Button>
  );
}

// ── Main page ────────────────────────────────────────────────────────────
export default function ProjectProfileReportPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard/project-profile-report");

  const { data: report, isLoading, isError } = useQuery({
    queryKey: projectProfileReportKeys.detail(projectId),
    queryFn: () => fetchProjectProfileReport(projectId),
    enabled: !!projectId,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <SectionContainer title="Project Profile Report">
        <BackButton onClick={goBack} />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </SectionContainer>
    );
  }

  if (isError || !report) {
    return (
      <SectionContainer title="Project Profile Report">
        <BackButton onClick={goBack} />
        <p className="text-sm text-destructive">
          Report could not be loaded. Please confirm the project exists and try again.
        </p>
      </SectionContainer>
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
    <SectionContainer
      title={`Project Profile Report — ${project.PROJECT_NAME}`}
      description={`${project.BUSINESS_TYPE || "—"} · ${project.PROJECT_LOCATION || "Location not set"}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <BackButton onClick={goBack} />
        <Button variant="outline" size="sm" onClick={() => handleExportExcel(report)}>
          <IconDownload size={16} className="mr-1" />
          Export to Excel
        </Button>
      </div>

      <div className="space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={IconBuildingWarehouse} label="Infrastructure Cost" value={fmtMoney(totalInfraCost)} />
          <StatCard icon={IconCoin} label="Total Investment" value={fmtMoney(totalInvestment)} accent="text-amber-600" />
          <StatCard
            icon={IconTrendingUp}
            label="Annual Gross Profit"
            value={fmtMoney(annualProjection?.GROSS_PROFIT)}
            accent="text-emerald-600"
          />
          <StatCard icon={IconTarget} label="Objectives" value={objectives.length} />
        </div>

        {/* Project Info + Executive Summary */}
        <Section title="Project Information">
          <Table>
            <TableBody> <TableRow><TableCell className="font-medium">Project Name:</TableCell><TableCell>{project.PROJECT_NAME || "—"}</TableCell></TableRow>
             <TableRow><TableCell className="font-medium">Project Location:</TableCell><TableCell>{project.PROJECT_LOCATION || "—"}</TableCell></TableRow>
              <TableRow><TableCell className="w-48 font-medium">Owner:</TableCell><TableCell>{project.OWNER_NAME || "—"}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Contact Number :</TableCell><TableCell>{project.CONTACT_NUMBER || "—"}</TableCell></TableRow>
              <TableRow><TableCell className="font-medium">Duration:</TableCell><TableCell>{project.DURATION_DESC || "—"}</TableCell></TableRow>
               <TableRow><TableCell className="font-medium">Project Business type:</TableCell><TableCell>{project.BUSINESS_TYPE || "—"}</TableCell></TableRow>
                
            </TableBody>
          </Table>
           <h1 className="text-base font-semibold"> Executive Summary</h1>
          {project.EXECUTIVE_SUMMARY && (
           
            <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{project.EXECUTIVE_SUMMARY}</p>
          )}
        </Section>

        {/* Objectives */}
        <Section title="Project Objectives">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Objective</TableHead>
                <TableHead>Target Indicator</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objectives.length === 0 && <EmptyRow colSpan={3} label="objectives" />}
              {objectives.map((o) => (
                <TableRow key={o.OBJECTIVE_ID}>
                  <TableCell>{o.SEQUENCE_NO ?? "—"}</TableCell>
                  <TableCell>{o.OBJECTIVE_DESC}</TableCell>
                  <TableCell className="text-muted-foreground">{o.TARGET_INDICATOR || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Farm Capacity */}
        <Section title="Farm Capacity">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Metric</TableHead><TableHead>Value</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {capacity.length === 0 && <EmptyRow colSpan={2} label="capacity metrics" />}
              {capacity.map((c) => (
                <TableRow key={c.CAPACITY_ID}>
                  <TableCell>{c.METRIC_DESCRIPTION}</TableCell>
                  <TableCell className="font-medium">{c.QUANTITY_VALUE}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Infrastructure Requirements */}
        <Section title="Infrastructure Requirements">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Specification</TableHead>
                <TableHead className="w-16">Qty</TableHead>
                <TableHead className="w-32">Unit Cost</TableHead>
                <TableHead className="w-32">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {infrastructure.length === 0 && <EmptyRow colSpan={5} label="infrastructure items" />}
              {infrastructure.map((i) => (
                <TableRow key={i.INFRA_ID}>
                  <TableCell>{i.ITEM_NAME}</TableCell>
                  <TableCell className="text-muted-foreground">{i.SPECIFICATION || "—"}</TableCell>
                  <TableCell>{i.QUANTITY}</TableCell>
                  <TableCell>{fmtMoney(i.UNIT_COST_BDT)}</TableCell>
                  <TableCell className="font-medium">{fmtMoney(i.TOTAL_COST_BDT)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Investment Cost
        <Section title="Investment Cost">
          <Table>
            <TableHeader>
              <TableRow><TableHead className="w-40">Type</TableHead><TableHead>Particulars</TableHead><TableHead className="w-32">Amount</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {investments.length === 0 && <EmptyRow colSpan={3} label="investment records" />}
              {investments.map((inv) => (
                <TableRow key={inv.INVESTMENT_ID}>
                  <TableCell><Badge variant="secondary">{inv.INVESTMENT_TYPE}</Badge></TableCell>
                  <TableCell>{inv.PARTICULARS}</TableCell>
                  <TableCell className="font-medium">{fmtMoney(inv.AMOUNT_BDT)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section> */}

         {/* Investment Cost */}
        <Section title="Investment Cost">
          {(() => {
            const fixed = investments.filter((i) => i.INVESTMENT_TYPE === "FIXED_ASSET");
            const working = investments.filter((i) => i.INVESTMENT_TYPE === "WORKING_CAPITAL");
            const fixedTotal = fixed.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
            const workingTotal = working.reduce((sum, i) => sum + (Number(i.AMOUNT_BDT) || 0), 0);
            const grandTotal = fixedTotal + workingTotal;

            const CostGroup = ({ heading, rows, total }) => (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{heading}</h4>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Particulars</TableHead><TableHead className="w-32 text-right">Amount (BDT)</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 && <EmptyRow colSpan={2} label="items" />}
                    {rows.map((inv) => (
                      <TableRow key={inv.INVESTMENT_ID}>
                        <TableCell>{inv.PARTICULARS}</TableCell>
                        <TableCell className="text-right">{Number(inv.AMOUNT_BDT).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total {heading}</TableCell>
                      <TableCell className="text-right">{total.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            );

            return (
              <div className="space-y-6">
                <CostGroup heading="Fixed Cost" rows={fixed} total={fixedTotal} />
                <CostGroup heading="Working Capital" rows={working} total={workingTotal} />

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Total Project Cost</h4>
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Description</TableHead><TableHead className="w-32 text-right">Amount (BDT)</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Fixed Cost</TableCell>
                        <TableCell className="text-right">{fixedTotal.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Working Capital</TableCell>
                        <TableCell className="text-right">{workingTotal.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="bg-muted font-semibold">
                        <TableCell>Total Investment</TableCell>
                        <TableCell className="text-right">{grandTotal.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })()}
        </Section>

        {/* Production Plan / Feeding Schedule */}
        <Section title="Production Plan / Feeding Schedule">
          <Table>
            <TableHeader>
              <TableRow><TableHead className="w-40">Time Period</TableHead><TableHead>Item Description</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {schedules.length === 0 && <EmptyRow colSpan={2} label="schedule items" />}
              {schedules.map((s) => (
                <TableRow key={s.SCHEDULE_ID}>
                  <TableCell className="font-medium">{s.TIME_PERIOD}</TableCell>
                  <TableCell>{s.ITEM_DESCRIPTION}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Marketing Strategy */}
        <Section title="Marketing Strategy">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Channel</TableHead><TableHead>Remarks</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {marketingChannels.length === 0 && <EmptyRow colSpan={2} label="marketing channels" />}
              {marketingChannels.map((m) => (
                <TableRow key={m.CHANNEL_ID}>
                  <TableCell>{m.CHANNEL_NAME}</TableCell>
                  <TableCell className="text-muted-foreground">{m.REMARKS || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Financial Projection */}
        <Section title="Financial Projection">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Scope</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Operating Cost</TableHead>
                <TableHead>Gross Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialProjections.length === 0 && <EmptyRow colSpan={4} label="financial projections" />}
              {financialProjections.map((f) => (
                <TableRow key={f.PROJECTION_ID}>
                  <TableCell><Badge variant={f.PROJECTION_SCOPE === "ANNUAL" ? "default" : "secondary"}>{f.PROJECTION_SCOPE}</Badge></TableCell>
                  <TableCell>{fmtMoney(f.REVENUE_AMOUNT)}</TableCell>
                  <TableCell>{fmtMoney(f.OPERATING_COST)}</TableCell>
                  <TableCell className="font-medium text-emerald-600">{fmtMoney(f.GROSS_PROFIT)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Risk Management */}
        <Section title="Risk Management">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-24">Likelihood</TableHead>
                <TableHead className="w-24">Impact</TableHead>
                <TableHead>Mitigation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.length === 0 && <EmptyRow colSpan={5} label="risk items" />}
              {risks.map((r) => (
                <TableRow key={r.RISK_ID}>
                  <TableCell>{r.RISK_CATEGORY}</TableCell>
                  <TableCell className="text-muted-foreground">{r.RISK_DESCRIPTION}</TableCell>
                  <TableCell><Badge variant="outline">{r.LIKELIHOOD}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{r.IMPACT}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.MITIGATION_STRATEGY || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Social & Economic Benefits */}
        <Section title="Social & Economic Benefits">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Category</TableHead><TableHead>Description</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {socialBenefits.length === 0 && <EmptyRow colSpan={2} label="benefit items" />}
              {socialBenefits.map((b) => (
                <TableRow key={b.BENEFIT_ID}>
                  <TableCell className="flex items-center gap-2"><IconHeartHandshake size={14} className="text-primary" />{b.BENEFIT_CATEGORY}</TableCell>
                  <TableCell className="text-muted-foreground">{b.DESCRIPTION}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>

        {/* Conclusion */}
        <Section title="Conclusion">
          {conclusion?.CONCLUSION_TEXT ? (
            <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{conclusion.CONCLUSION_TEXT}</p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconAlertTriangle size={14} />
              No conclusion recorded yet.
            </p>
          )}
        </Section>
      </div>
    </SectionContainer>
  );
}