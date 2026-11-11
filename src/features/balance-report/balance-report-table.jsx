import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtAmount } from "./utils";

const Section = ({ title, children }) => (
  <section className="bg-card overflow-hidden rounded-lg border">
    <div className="bg-muted flex items-center border-b px-4 py-2.5">
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </section>
);

const Money = ({ value, className = "" }) => (
  <TableCell
    className={`text-right tabular-nums ${
      value < 0 ? "text-destructive" : ""
    } ${className}`}
  >
    {fmtAmount(value)}
  </TableCell>
);

// { opening, movement, closing } -> 3 ta cell (negate = true hole minus)
const Amounts = ({ value, negate = false }) => {
  const f = negate ? -1 : 1;
  return (
    <>
      <Money value={f * value.opening} />
      <Money value={f * value.movement} />
      <Money value={f * value.closing} />
    </>
  );
};

const THead = () => (
  <TableHeader className="bg-muted/50 [&_th]:text-foreground [&_th]:font-semibold">
    <TableRow>
      <TableHead>Code</TableHead>
      <TableHead>Account</TableHead>
      <TableHead className="text-right">Opening</TableHead>
      <TableHead className="text-right">Period</TableHead>
      <TableHead className="text-right">Closing</TableHead>
    </TableRow>
  </TableHeader>
);

/* Assets / Liabilities: group + account row */
export function GroupedSection({ title, section, totalLabel, emptyText }) {
  return (
    <Section title={title}>
      <Table>
        <THead />
        <TableBody>
          {section.groups.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground py-6 text-center"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            section.groups.map((g) => <GroupRows key={g.name} group={g} />)
          )}
        </TableBody>
        <TableFooter className="font-semibold">
          <TableRow>
            <TableCell colSpan={2}>{totalLabel}</TableCell>
            <Amounts value={section.total} />
          </TableRow>
        </TableFooter>
      </Table>
    </Section>
  );
}

function GroupRows({ group }) {
  return (
    <>
      <TableRow className="bg-muted/30 font-medium">
        <TableCell colSpan={2}>{group.name}</TableCell>
        <Amounts value={group.total} />
      </TableRow>
      {group.accounts.map((a) => (
        <TableRow key={a.code}>
          <TableCell>{a.code}</TableCell>
          <TableCell className="pl-6">{a.name}</TableCell>
          <Amounts value={a} />
        </TableRow>
      ))}
    </>
  );
}

/* Owner's equity: equity account + income/expense + net profit */
export function EquitySection({ equity }) {
  return (
    <Section title="Owner's equity">
      <Table>
        <THead />
        <TableBody>
          {equity.groups.flatMap((g) =>
            g.accounts.map((a) => (
              <TableRow key={a.code}>
                <TableCell>{a.code}</TableCell>
                <TableCell>{a.name}</TableCell>
                <Amounts value={a} />
              </TableRow>
            ))
          )}
          <TableRow>
            <TableCell colSpan={2}>Total income (sales)</TableCell>
            <Amounts value={equity.income} />
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Less: total expenses</TableCell>
            <Amounts value={equity.expense} negate />
          </TableRow>
          <TableRow className="font-medium">
            <TableCell colSpan={2}>Net profit / (loss)</TableCell>
            <Amounts value={equity.profit} />
          </TableRow>
        </TableBody>
        <TableFooter className="font-semibold">
          <TableRow>
            <TableCell colSpan={2}>Total owner's equity</TableCell>
            <Amounts value={equity.total} />
          </TableRow>
        </TableFooter>
      </Table>
    </Section>
  );
}

/* Total liabilities + owner's equity */
export function TotalSection({ label, value }) {
  return (
    <Section title="Total">
      <Table>
        <TableBody>
          <TableRow className="font-semibold">
            <TableCell>{label}</TableCell>
            <Amounts value={value} />
          </TableRow>
        </TableBody>
      </Table>
    </Section>
  );
}