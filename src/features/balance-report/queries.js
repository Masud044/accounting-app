import { keepPreviousData, useQuery } from "@tanstack/react-query";

const BASE = `${import.meta.env.VITE_API_BASE_URL}/api/balance-sheet-report`;

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

export const balanceSheetKeys = {
  all: ["balance-sheet"],
  report: (params) => [...balanceSheetKeys.all, "report", params],
};

// params: { from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
export const useBalanceSheet = (params) =>
  useQuery({
    queryKey: balanceSheetKeys.report(params),
    queryFn: () => {
      const qs = new URLSearchParams();
      qs.set("from", params.from);
      qs.set("to", params.to);
      return fetchJSON(`${BASE}?${qs.toString()}`);
    },
    enabled: Boolean(params.from && params.to),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });