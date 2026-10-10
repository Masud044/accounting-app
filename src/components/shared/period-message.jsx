// components/shared/period-message.jsx
import { Lock, AlertTriangle } from "lucide-react";

export const PeriodMessage = ({ module, date, periodStatus, isPeriodClosed, noPeriodDefined }) => {
  if (isPeriodClosed)
    return (
      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
        <Lock size={12} className="mt-0.5 shrink-0" />
        {module} period "{periodStatus?.PERIOD_NAME}" is closed for posting. Choose a date within an open period.
      </p>
    );
  if (noPeriodDefined)
    return (
      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-600">
        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
        No ledger period is defined for {module} date {date}. Please set up the period calendar first.
      </p>
    );
  return null;
};