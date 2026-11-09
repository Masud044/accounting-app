import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const selectClass =
  "border-input bg-background h-9 w-full rounded-md border px-3 text-sm";

export default function ExpenseReportFilters({
  value,
  projects = [],
  categories = [],
  isFetching,
  onApply,
}) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");

  const set = (key) => (e) => {
    setDraft((d) => ({ ...d, [key]: e.target.value }));
    setError("");
  };

  // Project bodlale, oi project-e nai emon category reset hoy
  const onProjectChange = (e) => {
    const project = e.target.value;
    setDraft((d) => {
      const stillValid = categories.some(
        (c) => c.code === d.category && (!project || c.projects.includes(project))
      );
      return { ...d, project, category: stillValid ? d.category : "" };
    });
    setError("");
  };

  const visibleCategories = draft.project
    ? categories.filter((c) => c.projects.includes(draft.project))
    : categories;

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
      className="bg-card grid grid-cols-1 items-end gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr_auto]"
    >
      <div className="space-y-1.5">
        <Label htmlFor="er-from">From date</Label>
        <Input
          id="er-from"
          type="date"
          value={draft.from}
          onChange={set("from")}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="er-to">To date</Label>
        <Input id="er-to" type="date" value={draft.to} onChange={set("to")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="er-project">Project</Label>
        <select
          id="er-project"
          value={draft.project}
          onChange={onProjectChange}
          className={selectClass}
        >
          <option value="">All</option>
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="er-category">Category</Label>
        <select
          id="er-category"
          value={draft.category}
          onChange={set("category")}
          className={selectClass}
        >
          <option value="">All</option>
          {visibleCategories.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={isFetching}>
        <IconSearch className="size-4" />
        Generate
      </Button>
      {error && (
        <p className="text-destructive text-sm sm:col-span-2 lg:col-span-5">
          {error}
        </p>
      )}
    </form>
  );
}