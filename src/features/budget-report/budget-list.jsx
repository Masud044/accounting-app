import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  IconReceipt2,
  IconChevronRight,
  IconCalendar,
  IconRefresh,
} from "@tabler/icons-react";

import { SectionContainer } from "@/components/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ── API base + fetcher ───────────────────────────────────────────────────────
// Reuses the existing farm-budget list endpoint (FARM_BUDGET_H CRUD module) —
// the report just needs BUDGET_ID / FARM_NAME / BUDGET_YEAR / STATUS from it.
const BASE = import.meta.env.VITE_API_BASE_URL;
const API = `${BASE}/api/farm-budget`;

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

export const farmBudgetKeys = {
  all: ["farmBudgets"],
};

const fetchFarmBudgets = () => fetchJSON(API);

export default function FarmBudgetReportList() {
  const navigate = useNavigate();

  const { data: budgets, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: farmBudgetKeys.all,
    queryFn: fetchFarmBudgets,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  if (isLoading) {
    return (
      <SectionContainer title="Farm Budget Report">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </SectionContainer>
    );
  }

  if (isError) {
    return (
      <SectionContainer title="Farm Budget Report">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <span className="text-red-600 text-xl">⚠</span>
            </div>
            <p className="text-sm font-medium text-red-700">Budget list could not be loaded</p>
            <p className="text-xs text-red-500 mt-1">Please check your connection and try again.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
            >
              {isFetching ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  Retrying...
                </div>
              ) : (
                <>
                  <IconRefresh size={14} className="mr-1.5" />
                  Retry
                </>
              )}
            </Button>
          </div>
        </div>
      </SectionContainer>
    );
  }

  const list = budgets ?? [];

  return (
    <SectionContainer title="Farm Budget Report" description="Select a budget to view its detailed report">
      {list.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <IconReceipt2 size={32} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-600">No budgets created yet</p>
            <p className="text-sm text-gray-400 mt-1">Create a farm budget to generate reports</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => (
            <button
              key={b.BUDGET_ID}
              type="button"
              onClick={() => navigate(`/dashboard/farm-budget-report/${b.BUDGET_ID}`)}
              className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 text-left transition-all duration-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1"
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                    <IconReceipt2 size={20} className="text-emerald-700 group-hover:text-emerald-800" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                      {b.FARM_NAME}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <IconCalendar size={12} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-400">{b.BUDGET_YEAR}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0 mt-1">
                  <IconChevronRight size={16} className="text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              <Badge className={b.STATUS === "APPROVED" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}>
                {b.STATUS || "DRAFT"}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </SectionContainer>
  );
}