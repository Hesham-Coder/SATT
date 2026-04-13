"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { SupportedLocale } from "@/types/conference";

type LanguageContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  toggleLocale: () => void;
};

const STORAGE_KEY = "site-lang";
const COOKIE_KEY = "site-lang";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function persistLocale(locale: SupportedLocale) {
  document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
  window.localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);

    if (storedLocale === "ar" || storedLocale === "en") {
      setLocaleState(storedLocale);
      persistLocale(storedLocale);
      return;
    }

    persistLocale(initialLocale);
  }, [initialLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale(nextLocale) {
        setLocaleState(nextLocale);
        persistLocale(nextLocale);
      },
      toggleLocale() {
        const nextLocale = locale === "ar" ? "en" : "ar";
        setLocaleState(nextLocale);
        persistLocale(nextLocale);
      },
    }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}