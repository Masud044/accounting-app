// import { Lock, LockOpen } from "lucide-react";
// import { cn } from "@/lib/utils";

// const STATUS_LABEL = { open: "Fully Open", closed: "Fully Closed", mixed: "Partially Closed" };
// const STATUS_CLASS = {
//   open:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
//   closed: "bg-destructive/10 text-destructive",
//   mixed:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
// };

// export default function PeriodCard({ period, moduleList, onToggleModule, pending }) {
//   return (
//     <div className={cn("bg-card rounded-md border shadow-sm p-4", period.adjustment && "border-destructive/40")}>
//       <div className="flex items-start justify-between gap-2 mb-1">
//         <p className="font-semibold text-sm">{period.name}</p>
//         <span className="font-mono text-[11px] text-muted-foreground">
//           P{String(period.no).padStart(2, "0")}
//         </span>
//       </div>
//       <p className="font-mono text-xs text-muted-foreground mb-3">
//         {period.start} → {period.end}
//       </p>

//       <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3", STATUS_CLASS[period.overallStatus])}>
//         {STATUS_LABEL[period.overallStatus]}
//       </span>

//       <div className="flex flex-wrap gap-1.5">
//         {moduleList.map((m) => {
//           const status = period.modules[m.MODULE_CODE];
//           const isOpen = status === "open";
//           return (
//             <button
//               key={m.MODULE_ID}
//               type="button"
//               disabled={pending}
//               title={`${m.MODULE_CODE}: ${isOpen ? "Open" : "Closed"} — click to toggle`}
//               onClick={() =>
//                 onToggleModule({
//                   periodId: period.periodId,
//                   moduleId: m.MODULE_ID,
//                   moduleCode: m.MODULE_CODE,
//                   status: isOpen ? "CLOSED" : "OPEN",
//                 })
//               }
//               className={cn(
//                 "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-mono font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
//                 isOpen
//                   ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
//                   : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15"
//               )}
//             >
//               {isOpen ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
//               {m.MODULE_CODE}
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import { Lock, LockOpen, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_LABEL = { open: "Fully Open", closed: "Fully Closed", mixed: "Partially Closed" };
const STATUS_CLASS = {
  open:   "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  closed: "bg-destructive/10 text-destructive",
  mixed:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

export default function PeriodCard({ period, moduleList, onToggleModule, onEdit, pending }) {
  return (
    <div className={cn("bg-card rounded-md border shadow-sm p-4", period.adjustment && "border-destructive/40")}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-semibold text-sm">{period.name}</p>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[11px] text-muted-foreground">
            P{String(period.no).padStart(2, "0")}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(period)}>
            <Pencil className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <p className="font-mono text-xs text-muted-foreground mb-3">
        {period.start} → {period.end}
      </p>

      <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3", STATUS_CLASS[period.overallStatus])}>
        {STATUS_LABEL[period.overallStatus]}
      </span>

      <div className="flex flex-wrap gap-1.5">
        {moduleList.map((m) => {
          const status = period.modules[m.MODULE_CODE];
          const isOpen = status === "open";
          return (
            <button
              key={m.MODULE_ID}
              type="button"
              disabled={pending}
              title={`${m.MODULE_CODE}: ${isOpen ? "Open" : "Closed"} — click to toggle`}
              onClick={() =>
                onToggleModule({
                  periodId: period.periodId,
                  moduleId: m.MODULE_ID,
                  moduleCode: m.MODULE_CODE,
                  status: isOpen ? "CLOSED" : "OPEN",
                })
              }
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-mono font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                isOpen
                  ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300"
                  : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15"
              )}
            >
              {isOpen ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              {m.MODULE_CODE}
            </button>
          );
        })}
      </div>
    </div>
  );
}