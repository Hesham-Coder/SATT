"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";
import { pillars } from "@/data/pillars";
import { useFilter } from "@/hooks/useFilter";
import { cn } from "@/lib/utils";

export function PillarsSection() {
  const { activeFilter, filteredItems, filters, setActiveFilter } = useFilter({
    getValues: (pillar) => pillar.focusAreas,
    items: pillars,
    allLabel: "الكل"
  });

  return (
    <SectionShell
      description="ترتكز جهود الجمعية على أربعة محاور أساسية لتعزيز المعرفة ودعم الممارسات الطبية في مجال علاج الأورام."
      eyebrow="أهدافنا"
      id="pillars"
      title="محاورنا لدعم المتخصصين والارتقاء بطب الأورام."
    >
      <div className="space-y-[var(--space-8)]">
        <div className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-[var(--space-2)]">
            {filters.map((filter) => {
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
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <p className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
            عرض {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "محور" : (filteredItems.length === 2 ? "محورين" : "محاور")}
          </p>
        </div>

        <div className="grid gap-[var(--space-5)] lg:grid-cols-2">
          {filteredItems.map((pillar) => (
            <Card
              className="flex h-full flex-col justify-between gap-[var(--space-8)]"
              key={pillar.title}
            >
              <div className="space-y-[var(--space-4)]">
                <div className="space-y-[var(--space-2)]">
                  <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
                    محور رئيسي
                  </p>
                  <h3 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] text-[var(--color-text-primary)]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
                  {pillar.description}
                </p>
              </div>
              <div className="space-y-[var(--space-5)]">
                <ul className="flex flex-wrap gap-[var(--space-2)]">
                  {pillar.focusAreas.map((item) => (
                    <li key={item}>
                      <Badge>{item}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
