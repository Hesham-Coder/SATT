"use client";

import { useState, useMemo } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Input } from "@/components/ui/Input";
import type { ResearchArticle } from "@/types/research";
import { useTranslations } from "@/i18n/provider";

import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

export function ResearchSection({ researchArticles }: { researchArticles: ResearchArticle[] }) {
  const { t, locale } = useTranslations("research");
  const allLabel = t("all") as string;

  const [activeFilter, setActiveFilter] = useState(allLabel);
  const [searchQuery, setSearchQuery] = useState("");

  const filters = useMemo(() => {
    const allCategories = new Set<string>();
    researchArticles.forEach((r) => allCategories.add(locale === 'en' && r.categoryEn ? r.categoryEn : r.category));
    return [allLabel, ...Array.from(allCategories)];
  }, [researchArticles, locale, allLabel]);

  const filteredArticles = useMemo(() => {
    return researchArticles.filter((r) => {
      const title = locale === 'en' && r.titleEn ? r.titleEn : r.title;
      const category = locale === 'en' && r.categoryEn ? r.categoryEn : r.category;
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === allLabel || category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery, researchArticles, locale, allLabel]);

  return (
    <SectionShell
      description={t("desc") as string}
      eyebrow={t("eyebrow") as string}
      id="research"
      surface="muted"
      title={t("title") as string}
    >
      <div className="space-y-[var(--space-8)]">
        <FadeUpOnScroll className="flex flex-col gap-[var(--space-4)] md:grid md:grid-cols-[1fr_auto] md:items-end">
          <div className="mb-[var(--space-2)] md:mb-0">
            <FilterTabs
              activeFilter={activeFilter}
              filters={filters}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="w-full md:w-72">
            <Input
              id="search-research"
              name="search"
              label={t("search") as string}
              placeholder={t("searchPlaceholder") as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </FadeUpOnScroll>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <FadeUpOnScroll delay={index * 0.1} key={article.id}>
                <ArticleCard article={article} />
              </FadeUpOnScroll>
            ))}
          </div>
        ) : (
          <FadeUpOnScroll>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-12)] text-center text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
              {t("noResults")}
            </div>
          </FadeUpOnScroll>
        )}
      </div>
    </SectionShell>
  );
}
