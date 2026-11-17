import { CircleHelp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Reusable "How this page works" side panel.
 *
 * Props:
 *  - guide: a guide config (see approvalVoucherGuide.js)
 *  - can:   map of permission key -> boolean, e.g. { HOME_VOUCHER_EDIT: true }
 *           A step with a `permission` the user lacks is shown dimmed with a note.
 */
export function PageGuideSheet({ guide, can = {} }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 bg-white border-gray-200 text-gray-700"
        >
          <CircleHelp size={15} />
          Guide
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{guide.title}</SheetTitle>
          <SheetDescription>{guide.purpose}</SheetDescription>
        </SheetHeader>

        <div className="space-y-8 px-4 pb-8">
          {/* Steps */}
          <ol className="space-y-5">
            {guide.steps.map((step, i) => {
              const locked = step.permission && !can[step.permission];
              return (
                <li key={step.key} className="flex gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      locked
                        ? "bg-gray-100 text-gray-400"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className={locked ? "opacity-60" : ""}>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {step.text}
                    </p>
                    {locked && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
                        <Lock size={12} className="mt-0.5 shrink-0" />
                        {guide.lockedText}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Column meanings */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              What the columns mean
            </h3>

            <div>
              <p className="mb-1.5 text-sm text-gray-600">
                <span className="font-medium text-gray-800">Voucher Type</span>{" "}
                is shown as a colored label:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {guide.voucherTypes.map((t) => (
                  <span
                    key={t.label}
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${t.className}`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {guide.columns.map((c) => (
              <p key={c.label} className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{c.label}</span>:{" "}
                {c.text}
              </p>
            ))}
          </section>

          {/* Good to know */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900">Good to know</h3>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-600">
              {guide.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}