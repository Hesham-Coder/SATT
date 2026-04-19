import "server-only";

const dictionaries = {
  ar: () => import("../../messages/ar.json").then((module) => module.default),
  en: () => import("../../messages/en.json").then((module) => module.default),
};

export type SupportedLocale = "ar" | "en";

export const getDictionary = async (locale: SupportedLocale) => {
  return dictionaries[locale]?.() ?? dictionaries.ar();
};
