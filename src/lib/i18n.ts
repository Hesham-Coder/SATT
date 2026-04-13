import type { LocalizedText, SupportedLocale } from "@/types/conference";

export const DEFAULT_LOCALE: SupportedLocale = "ar";

export function resolveLocale(value?: string | null): SupportedLocale {
  return value === "en" ? "en" : "ar";
}

export function localizeText(
  value: LocalizedText,
  locale: SupportedLocale,
): string {
  const primary = value[locale]?.trim();
  const fallback = value[locale === "ar" ? "en" : "ar"]?.trim();

  return primary || fallback || "";
}

export function isArabic(locale: SupportedLocale) {
  return locale === "ar";
}