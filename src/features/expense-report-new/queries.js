import { keepPreviousData, useQuery } from "@tanstack/react-query";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/expense-gl-report`;

// Project-er shared pattern: response-er `data` return kore (json.data ?? json)
const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

export const expenseGlReportKeys = {
  all: ["expense-gl-report"],
  filters: () => [...expenseGlReportKeys.all, "filters"],
  reports: () => [...expenseGlReportKeys.all, "report"],
  report: (params) => [...expenseGlReportKeys.reports(), params],
};

// -> { projects: [name], categories: [{ code, name, project }] }
export const useExpenseReportFilters = () =>
  useQuery({
    queryKey: expenseGlReportKeys.filters(),
    queryFn: () => fetchJSON(`${BASE}/filters`),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// params: { from, to, project?, category? (account code) }
export const useExpenseReport = (params) =>
  useQuery({
    queryKey: expenseGlReportKeys.report(params),
    queryFn: () => {
      const qs = new URLSearchParams();
      qs.set("from", params.from);
      qs.set("to", params.to);
      if (params.project) qs.set("project", params.project);
      if (params.category) qs.set("category", params.category);
      return fetchJSON(`${BASE}?${qs.toString()}`);
    },
    enabled: Boolean(params.from && params.to),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });