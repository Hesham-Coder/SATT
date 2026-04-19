"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "@/i18n/provider";
import { SectionShell } from "@/components/ui/SectionShell";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ConferenceCard } from "@/components/ui/ConferenceCard";
import { Input } from "@/components/ui/Input";
import { getConferenceCategoryLabel, getConferenceTitle } from "@/lib/conferences";
import type { Conference } from "@/types/conference";

import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

export function ConferencesSection({ conferences }: { conferences: Conference[] }) {
  const { t, locale } = useTranslations("conferences");
  const allLabel = t("all") as string;
  const [activeFilter, setActiveFilter] = useState(allLabel);
  const [searchQuery, setSearchQuery] = useState("");

  const filters = useMemo(() => {
    const categories = new Map<string, string>();

    conferences.forEach((conference) => {
      categories.set(
        conference.category.key,
        getConferenceCategoryLabel(conference, locale),
      );
    });

    return [
      allLabel,
      ...Array.from(categories.entries())
        .sort((left, right) => left[1].localeCompare(right[1], locale))
        .map(([, label]) => label),
    ];
  }, [allLabel, conferences, locale]);

  useEffect(() => {
    setActiveFilter(allLabel);
  }, [allLabel]);

  const filteredConferences = useMemo(() => {
    return conferences.filter((c) => {
      const matchesSearch = getConferenceTitle(c, locale)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        activeFilter === allLabel ||
        getConferenceCategoryLabel(c, locale) === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, allLabel, searchQuery, conferences, locale]);

  const featuredConferences = filteredConferences.slice(0, 3);

  return (
    <SectionShell
      description={t("desc") as string}
      eyebrow={t("eyebrow") as string}
      id="conferences"
      title={t("title") as string}
    >
      <div className="space-y-[var(--space-8)]">
        <FadeUpOnScroll className="flex flex-col gap-[var(--space-4)] xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-[var(--space-3)]">
            <p className="max-w-2xl text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              {t("filterText") as string}
            </p>
            <FilterTabs
              activeFilter={activeFilter}
              filters={filters}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="grid gap-[var(--space-3)] sm:grid-cols-[minmax(0,18rem)_auto] sm:items-end">
            <Input
              id="search-conferences"
              name="search"
              label={t("search") as string}
              placeholder={t("searchPlaceholder") as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link
              className="inline-flex min-h-[var(--control-height-md)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface)] px-[var(--space-5)] text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] ring-1 ring-inset ring-[var(--color-border)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:bg-[var(--color-surface-strong)] hover:ring-[var(--color-border-strong)] hover:scale-[1.05] active:scale-[0.98] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              href={`/${locale}/conferences`}
            >
              {t("viewAll") as string}
            </Link>
          </div>
        </FadeUpOnScroll>

        {conferences.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-[var(--space-12)] text-center text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
            {t("noItems")}
          </div>
        ) : featuredConferences.length > 0 ? (
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 lg:grid-cols-3">
            {featuredConferences.map((conf, index) => (
              <FadeUpOnScroll delay={index * 0.1} key={conf.id}>
                <ConferenceCard conference={conf} />
              </FadeUpOnScroll>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-[var(--space-12)] text-center text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
            {t("noResults")}
          </div>
        )}
      </div>
    </SectionShell>
  );
}
