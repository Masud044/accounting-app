// hooks/use-gl-date-check.js
import { usePeriodStatusForDate } from "@/features/ledger-period-calendar/queries";

export function useGlDateCheck(module, glDate) {
  const { data: periodStatus, isLoading, isFetching } =
    usePeriodStatusForDate(module, glDate);

  // date pick kora ache ar server er answer ekhono ashe nai
  const checking = !!glDate && (isLoading || isFetching);

  const isPeriodClosed = !checking && periodStatus?.STATUS === "CLOSED";

  // null / undefined / [] / {} shob case e kaj korbe
  const noPeriodDefined = !!glDate && !checking && !periodStatus?.STATUS;

  return {
    periodStatus,
    isPeriodClosed,
    noPeriodDefined,
    checking,
    blocked: checking || isPeriodClosed || noPeriodDefined,
  };
}