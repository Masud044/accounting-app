import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BalanceSheetFilters({ value, isFetching, onApply }) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");

  const set = (key) => (e) => {
    setDraft((d) => ({ ...d, [key]: e.target.value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!draft.from || !draft.to) {
      setError("From date ar To date dite hobe");
      return;
    }
    if (draft.from > draft.to) {
      setError("From date, To date er pore hote parbe na");
      return;
    }
    onApply(draft);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-card grid grid-cols-1 items-end gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_auto] lg:max-w-2xl"
    >
      <div className="space-y-1.5">
        <Label htmlFor="bs-from">From date</Label>
        <Input
          id="bs-from"
          type="date"
          value={draft.from}
          onChange={set("from")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bs-to">To date</Label>
        <Input id="bs-to" type="date" value={draft.to} onChange={set("to")} />
      </div>
      <Button type="submit" disabled={isFetching}>
        <IconSearch className="size-4" />
        Generate
      </Button>
      {error && (
        <p className="text-destructive text-sm sm:col-span-3">{error}</p>
      )}
    </form>
  );
}