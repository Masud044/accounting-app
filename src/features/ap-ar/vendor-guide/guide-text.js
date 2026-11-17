// Shared helper for every page guide.
// A text is either { en: "...", bn: "..." } or a plain string (shown in all languages).
// Falls back to English if the selected language is missing.
export const t = (value, lang = "en") =>
  value && typeof value === "object" ? value[lang] ?? value.en ?? "" : value ?? "";