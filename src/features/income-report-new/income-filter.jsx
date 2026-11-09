import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { headLabel } from "./utils";

export default function IncomeReportFilters({
  value,
  heads = [],
  isFetching,
  onApply,
}) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");

  const set = (key) => (e) => {
    setDraft((d) => ({ ...d, [key]: e.target.value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!draft.from || !draft.to) {
      setError("you must be fill up From date and To date");
      return;
    }
    if (draft.from > draft.to) {
      setError("you must be fill up From date and To date");
      return;
    }
    onApply(draft);
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 items-end gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] print:hidden"
    >
      <div className="space-y-1.5">
        <Label htmlFor="ir-from">From date</Label>
        <Input
          id="ir-from"
          type="date"
          value={draft.from}
          onChange={set("from")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ir-to">To date</Label>
        <Input id="ir-to" type="date" value={draft.to} onChange={set("to")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ir-head">Income head</Label>
        <select
          id="ir-head"
          value={draft.head}
          onChange={set("head")}
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
        >
          <option value="">All</option>
          {heads.map((h) => (
            <option key={h.code} value={h.code}>
              {headLabel(h)}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isFetching}>
        <IconSearch className="size-4" />
        Generate
      </Button>
      {error && (
        <p className="text-destructive text-sm sm:col-span-2 lg:col-span-4">
          {error}
        </p>
      )}
    </form>
  );
}