"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";

export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { locale, toggleLocale } = useLanguage();

  return (
    <Button
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={className}
      onClick={toggleLocale}
      size={compact ? "md" : "lg"}
      variant="ghost"
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "ar" ? "English" : "العربية"}</span>
    </Button>
  );
}