import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { getDictionary, type SupportedLocale } from "@/i18n/server";

export async function Footer({ locale }: { locale: SupportedLocale }) {
  const dictionary = await getDictionary(locale);
  const t = dictionary.footer;

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-10)]">
      <Container className="grid gap-[var(--space-8)] md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="space-y-[var(--space-4)]">
          <div className="flex items-center gap-[var(--space-4)]">
            <div className="relative size-[var(--space-12)] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-white p-1 shadow-sm">
              <Image src="/images/logo.png" alt="SATT Logo" fill className="object-contain" />
            </div>
            <Badge>{t.badge}</Badge>
          </div>
          <div className="space-y-[var(--space-2)]">
            <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              {t.title}
            </p>
            <p className="max-w-xl text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              {t.desc}
            </p>
          </div>
        </div>
        <div className="space-y-[var(--space-2)] text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] md:text-end">
          <p>{t.copyright}</p>
          <p>{t.rights}</p>
        </div>
      </Container>
    </footer>
  );
}
