import { keepPreviousData, useQuery } from "@tanstack/react-query";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/income-gl-report`;

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

// Existing "income-report" feature-er query key-er shathe clash na hoy, tai alada key
export const incomeGlReportKeys = {
  all: ["income-gl-report"],
  filters: () => [...incomeGlReportKeys.all, "filters"],
  reports: () => [...incomeGlReportKeys.all, "report"],
  report: (params) => [...incomeGlReportKeys.reports(), params],
};

// -> { heads: [{ code, head }] }
export const useIncomeReportFilters = () =>
  useQuery({
    queryKey: incomeGlReportKeys.filters(),
    queryFn: () => fetchJSON(`${BASE}/filters`),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

// params: { from: "YYYY-MM-DD", to: "YYYY-MM-DD", head?: code }
export const useIncomeReport = (params) =>
  useQuery({
    queryKey: incomeGlReportKeys.report(params),
    queryFn: () => {
      const qs = new URLSearchParams();
      qs.set("from", params.from);
      qs.set("to", params.to);
      if (params.head) qs.set("head", params.head);
      return fetchJSON(`${BASE}?${qs.toString()}`);
    },
    enabled: Boolean(params.from && params.to),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });