// Side panel ("Guide" button) for the Sale Invoice pages.
// It only displays a guide config passed in the `guide` prop
// (saleInvoiceListGuide / saleInvoiceCreateGuide / saleInvoiceEditGuide).
//
// Props:
//  - guide: a guide config
//  - can:   map of permission key -> boolean, e.g. { SALE_INVOICE_DELETE: true }
//           A step with a `permission` the user lacks is shown dimmed with a note.
//           (Create / Edit guides have no permission keys, so `can` can be omitted.)
//  - contentClassName: extra classes for the panel (z-index etc.).
//
// Needs shadcn components: button, sheet, tabs.

import * as React from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Pick the text for a language. Falls back to English.
const t = (value, lang = "en") =>
  value && typeof value === "object" ? value[lang] ?? value.en ?? "" : value ?? "";

// Screenshot. Click opens the full-size image in a new tab.
// If the file is missing, nothing is rendered.
function GuideImage({ image, lang, openLabel, className = "mt-3" }) {
  const [failed, setFailed] = React.useState(false);
  const src = t(image?.src, lang);
  if (!src || failed) return null;

  const caption = t(image.caption, lang);

  return (
    <figure className={className}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        title={openLabel}
        className="block overflow-hidden rounded-md border border-gray-200 bg-gray-50 transition-colors hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <img
          src={src}
          alt={t(image.alt, lang)}
          loading="lazy"
          onError={() => {
            console.warn("[Sale Invoice Guide] screenshot not found:", src);
            setFailed(true);
          }}
          className="h-auto w-full"
        />
      </a>
      {caption && (
        <figcaption className="mt-1 text-xs text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}

function GuideBody({ guide, lang, can }) {
  const g = guide.ui || {};
  const columns = guide.columns || [];
  const notes = guide.notes || [];

  return (
    <div className="space-y-8 pb-8">
      {guide.overview?.image && (
        <GuideImage
          image={guide.overview.image}
          lang={lang}
          openLabel={t(g.openImage, lang)}
        />
      )}

      {/* Steps */}
      <ol className="space-y-6">
        {guide.steps.map((step, i) => {
          const locked = step.permission && !can[step.permission];
          return (
            <li key={step.key} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  locked ? "bg-gray-100 text-gray-400" : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {i + 1}
              </span>
              <div
                className={`flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-start md:gap-5 ${
                  locked ? "opacity-60" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {t(step.title, lang)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {t(step.text, lang)}
                  </p>

                  {locked && (
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-700">
                      <Lock size={12} className="mt-0.5 shrink-0" />
                      {t(guide.lockedText, lang)}
                    </p>
                  )}
                </div>

                {step.image && (
                  <GuideImage
                    image={step.image}
                    lang={lang}
                    openLabel={t(g.openImage, lang)}
                    className="md:w-[45%] md:shrink-0"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Field meanings */}
      {columns.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            {t(g.columnsHeading, lang)}
          </h3>
          {columns.map((c) => (
            <p key={c.label} className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">{c.label}</span>:{" "}
              {t(c.text, lang)}
            </p>
          ))}
        </section>
      )}

      {/* Good to know */}
      {notes.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            {t(g.notesHeading, lang)}
          </h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-600">
            {notes.map((n, i) => (
              <li key={i}>{t(n, lang)}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export function SaleInvoiceGuideSheet({ guide, can = {}, contentClassName = "" }) {
  const languages = guide.languages || [{ code: "en", label: "English" }];
  const defaultLang = guide.defaultLanguage || languages[0].code;
  const [lang, setLang] = React.useState(defaultLang);

  // Every time the guide is opened, start from the default language
  const handleOpenChange = (open) => {
    if (open) setLang(defaultLang);
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 bg-white border-gray-200 text-gray-700"
        >
          <CircleHelp size={15} />
          {t(guide.ui?.guideButton, lang) || "Guide"}
        </Button>
      </SheetTrigger>

      <SheetContent
        className={`w-full overflow-y-auto sm:max-w-3xl ${contentClassName}`}
      >
        <SheetHeader>
          <SheetTitle>{t(guide.title, lang)}</SheetTitle>
          <SheetDescription>{t(guide.purpose, lang)}</SheetDescription>
        </SheetHeader>

        <Tabs value={lang} onValueChange={setLang} className="px-4">
          {languages.length > 1 && (
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${languages.length}, minmax(0, 1fr))`,
              }}
            >
              {languages.map((l) => (
                <TabsTrigger key={l.code} value={l.code}>
                  {l.label}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {languages.map((l) => (
            <TabsContent key={l.code} value={l.code} className="mt-6">
              <GuideBody guide={guide} lang={l.code} can={can} />
            </TabsContent>
          ))}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}