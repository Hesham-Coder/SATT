"use client";

import { createContext, useContext, ReactNode } from "react";
import type { SupportedLocale } from "./server";

type TranslationContextType = {
  locale: SupportedLocale;
  messages: Record<string, unknown>;
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: SupportedLocale;
  messages: Record<string, unknown>;
}) {
  return (
    <TranslationContext.Provider value={{ locale, messages }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslations must be used within TranslationProvider");
  }

  const { locale, messages } = context;

  function t(path: string): string | string[] {
    const fullPath = namespace ? `${namespace}.${path}` : path;
    const keys = fullPath.split(".");
    let current: unknown = messages;

    for (const key of keys) {
      if (typeof current !== 'object' || current === null || !(key in current)) {
        return fullPath; // Fallback to key
      }
      current = (current as Record<string, unknown>)[key];
    }

    return current as string | string[];
  }

  return { t, locale };
}
