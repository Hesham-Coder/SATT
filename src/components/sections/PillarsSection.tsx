"use client";

import { useTranslations } from "@/i18n/provider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";
import { pillars } from "@/data/pillars";
import { useFilter } from "@/hooks/useFilter";
import { cn } from "@/lib/utils";

import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

export function PillarsSection() {
  const { t, locale } = useTranslations("pillars");
  const { activeFilter, filteredItems, filters, setActiveFilter } = useFilter({
    getValues: (pillar) => locale === 'en' && pillar.focusAreasEn ? pillar.focusAreasEn : pillar.focusAreas,
    items: pillars,
    allLabel: t("all") as string
  });

  return (
    <SectionShell
      description={t("desc") as string}
      eyebrow={t("eyebrow") as string}
      id="pillars"
      title={t("title") as string}
    >
      <div className="space-y-[var(--space-8)]">
        <FadeUpOnScroll className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-[var(--space-2)]">
            {filters.map((filter, index) => {
              const isActive = filter === activeFilter;

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full border px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]",
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] active:border-[var(--color-primary)]",
                  )}
                  key={`${filter}-${index}`}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <p className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
            {t("showing")} {filteredItems.length}{" "}
            {filteredItems.length === 1 ? t("single") : (filteredItems.length === 2 ? t("dual") : t("plural"))}
          </p>
        </FadeUpOnScroll>

        <div className="grid gap-[var(--space-5)] lg:grid-cols-2">
          {filteredItems.map((pillar, index) => {
            const title = locale === 'en' && pillar.titleEn ? pillar.titleEn : pillar.title;
            const desc = locale === 'en' && pillar.descriptionEn ? pillar.descriptionEn : pillar.description;
            const focusAreas = locale === 'en' && pillar.focusAreasEn ? pillar.focusAreasEn : pillar.focusAreas;

            return (
              <FadeUpOnScroll delay={index * 0.1} key={pillar.title}>
                <Card
                  className="flex h-full flex-col justify-between gap-[var(--space-8)]"
                >
                  <div className="space-y-[var(--space-4)]">
                    <div className="space-y-[var(--space-2)]">
                      <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
                        {t("mainPillar")}
                      </p>
                      <h3 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] text-[var(--color-text-primary)]">
                        {title}
                      </h3>
                    </div>
                    <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
                      {desc}
                    </p>
                  </div>
                  <div className="space-y-[var(--space-5)]">
                    <ul className="flex flex-wrap gap-[var(--space-2)]">
                      {focusAreas.map((item, focusIndex) => (
                        <li key={`${item}-${focusIndex}`}>
                          <Badge>{item}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </FadeUpOnScroll>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
