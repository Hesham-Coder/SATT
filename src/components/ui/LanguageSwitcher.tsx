"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "@/i18n/provider";
import { Button } from "@/components/ui/Button";

export function LanguageSwitcher({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { locale } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPathname = pathname.replace(/^\/(ar|en)/, `/${newLocale}`);
    
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    router.push(newPathname || `/${newLocale}`);
    router.refresh();
  };

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
