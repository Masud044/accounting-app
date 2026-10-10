// hooks/use-validated-gl-date.js
import { useState, useEffect } from "react";
import { useGlDateCheck } from "@/hooks/use-gl-date-check";

// Only fully typed dates are checked (avoids checking "0002-10-10" while the
// user is still typing the year with the keyboard).
const isFullDate = (d) =>
  /^\d{4}-\d{2}-\d{2}$/.test(d || "") && Number(d.slice(0, 4)) >= 2000;

/**
 * value    : currently ACCEPTED GL date (form.glDate)
 * onAccept : called only when the picked date is in an OPEN period
 * onReject : called when the picked date is rejected (toast etc.)
 *
 * Valid date   -> accepted silently.
 * Invalid date -> NOT accepted, input goes back to the last valid date and a
 *                 message is shown.
 */
export function useValidatedGlDate(module, value, onAccept, onReject, delay = 400) {
  const [draft, setDraft] = useState(value); // what the input shows
  const [candidate, setCandidate] = useState(null); // date being checked
  const [rejected, setRejected] = useState(null);

  // keep draft in sync when the parent changes value (prefill / reset)
  useEffect(() => {
    setDraft(value);
  }, [value]);

  // draft -> candidate (debounced, full dates only)
  useEffect(() => {
    if (draft === value || !isFullDate(draft)) return;
    const t = setTimeout(() => setCandidate(draft), delay);
    return () => clearTimeout(t);
  }, [draft, value, delay]);

  const target = candidate ?? value;
  const { periodStatus, isPeriodClosed, noPeriodDefined, checking } =
    useGlDateCheck(module, target);

  useEffect(() => {
    if (candidate === null || checking) return;

    if (isPeriodClosed || noPeriodDefined) {
      const info = {
        date: candidate,
        closed: isPeriodClosed,
        periodName: periodStatus?.PERIOD_NAME,
      };
      setRejected(info);
      setDraft(value); // revert to last valid date
      onReject?.(info);
    } else {
      setRejected(null);
      onAccept(candidate);
    }
    setCandidate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate, checking, isPeriodClosed, noPeriodDefined]);

  const validating = candidate !== null;

  return {
    draft,
    onInputChange: (date) => {
      setRejected(null);
      setDraft(date);
    },
    validating,
    rejected,
    // status of the ACCEPTED date (hidden while a new date is being checked)
    periodStatus: validating ? null : periodStatus,
    isPeriodClosed: !validating && isPeriodClosed,
    noPeriodDefined: !validating && noPeriodDefined,
    blocked: validating || isPeriodClosed || noPeriodDefined,
  };
}