import { Button } from "@/components/ui/button";

export default function FiscalYearSwitch({ fiscalYears = [], activeId, onChange }) {
  if (!fiscalYears.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {fiscalYears.map((fy) => (
        <Button
          key={fy.FISCAL_YEAR_ID}
          size="sm"
          variant={fy.FISCAL_YEAR_ID === activeId ? "default" : "outline"}
          onClick={() => onChange(fy.FISCAL_YEAR_ID)}
        >
          {fy.YEAR_CODE}
        </Button>
      ))}
    </div>
  );
}