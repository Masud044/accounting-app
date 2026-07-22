import { useQuery } from "@tanstack/react-query";

const BASE = import.meta.env.VITE_API_BASE_URL;

const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data ?? json;
};

// export const useMonthlyDebitByAccount = (code) =>
//   useQuery({
//     queryKey: ["gl-report", "monthly-debit", code],
//     queryFn: () => fetchJSON(`${BASE}/api/gl-report/monthly-debit?code=${code}`),
//     enabled: !!code,
//     staleTime: 5 * 60 * 1000,
//   });

export const useMonthlyDebitByAccount = (code, year) =>
  useQuery({
    queryKey: ["gl-report", "monthly-debit", code, year],
    queryFn: () => {
      const params = new URLSearchParams({ code });
      if (year) params.set("year", year);
      return fetchJSON(`${BASE}/api/gl-report/monthly-debit?${params}`);
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000,
  });

  export const useCashFlowSummary = (fromDate, toDate) =>
  useQuery({
    queryKey: ["gl-report", "cash-flow", fromDate, toDate],
    queryFn: () => {
      const params = new URLSearchParams({ fromDate, toDate });
      return fetchJSON(`${BASE}/api/gl-report/cash-flow?${params}`);
    },
    enabled: !!fromDate && !!toDate,
    staleTime: 2 * 60 * 1000,
  });