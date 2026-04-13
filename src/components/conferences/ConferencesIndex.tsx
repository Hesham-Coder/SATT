"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/layout/Container";
import { ConferenceCard } from "@/components/ui/ConferenceCard";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { Input } from "@/components/ui/Input";
import {
  getConferenceCategoryLabel,
  getConferenceTags,
  getConferenceTitle,
} from "@/lib/conferences";
import type { Conference } from "@/types/conference";

export function ConferencesIndex({ conferences }: { conferences: Conference[] }) {
  const { locale } = useLanguage();
  const allCategoriesLabel = locale === "ar" ? "كل التصنيفات" : "All Categories";
  const allTagsLabel = locale === "ar" ? "كل الوسوم" : "All Tags";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(allCategoriesLabel);
  const [activeTag, setActiveTag] = useState(allTagsLabel);

  const categories = useMemo(() => {
    const values = new Set<string>();

    conferences.forEach((conference) => {
      values.add(getConferenceCategoryLabel(conference, locale));
    });

    return [allCategoriesLabel, ...Array.from(values).sort((left, right) => left.localeCompare(right, locale))];
  }, [allCategoriesLabel, conferences, locale]);

  const tags = useMemo(() => {
    const values = new Set<string>();

    conferences.forEach((conference) => {
      getConferenceTags(conference, locale).forEach((tag) => values.add(tag));
    });

    return [allTagsLabel, ...Array.from(values).sort((left, right) => left.localeCompare(right, locale))];
  }, [allTagsLabel, conferences, locale]);

  useEffect(() => {
    setActiveCategory(allCategoriesLabel);
    setActiveTag(allTagsLabel);
  }, [allCategoriesLabel, allTagsLabel]);

  const filteredConferences = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return conferences.filter((conference) => {
      const localizedTitle = getConferenceTitle(conference, locale).toLowerCase();
      const localizedCategory = getConferenceCategoryLabel(conference, locale);
      const localizedTags = getConferenceTags(conference, locale);

      const matchesSearch = !query || localizedTitle.includes(query);
      const matchesCategory =
        activeCategory === allCategoriesLabel || localizedCategory === activeCategory;
      const matchesTag = activeTag === allTagsLabel || localizedTags.includes(activeTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [activeCategory, activeTag, allCategoriesLabel, allTagsLabel, conferences, locale, searchQuery]);

  return (
    <main className="py-[var(--space-16)] md:py-[var(--space-24)]">
      <Container className="space-y-[var(--space-10)]">
        <section className="grid gap-[var(--space-8)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-md)] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-[var(--space-5)]">
            <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-primary)]">
              {locale === "ar" ? "مركز المؤتمرات" : "Conference Hub"}
            </p>
            <div className="space-y-[var(--space-3)]">
              <h1 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-3xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] text-[var(--color-text-primary)]">
                {locale === "ar"
                  ? "المؤتمرات والفعاليات العلمية"
                  : "Scientific Conferences & Events"}
              </h1>
              <p className="max-w-3xl text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
                {locale === "ar"
                  ? "ابحث عن المؤتمرات حسب العنوان، صفِّ النتائج حسب التصنيف والوسوم، ثم انتقل إلى صفحة كل مؤتمر لمشاهدة الصور والفيديو والمحتوى الكامل."
                  : "Search by title, filter by category and tags, and open each conference for full media and content details."}
              </p>
            </div>
          </div>
          <div className="grid gap-[var(--space-4)] sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
              <p className="text-[length:var(--font-size-xxs)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-muted)]">
                {locale === "ar" ? "إجمالي المؤتمرات" : "Total Conferences"}
              </p>
              <p className="mt-[var(--space-2)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                {conferences.length}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
              <p className="text-[length:var(--font-size-xxs)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-muted)]">
                {locale === "ar" ? "تصنيفات نشطة" : "Active Categories"}
              </p>
              <p className="mt-[var(--space-2)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                {Math.max(categories.length - 1, 0)}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
              <p className="text-[length:var(--font-size-xxs)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-muted)]">
                {locale === "ar" ? "نتائج البحث" : "Visible Results"}
              </p>
              <p className="mt-[var(--space-2)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                {filteredConferences.length}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-[var(--space-6)]">
          <div className="grid gap-[var(--space-5)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)] lg:grid-cols-[minmax(0,18rem)_1fr]">
            <Input
              id="conferences-search"
              label={locale === "ar" ? "ابحث بالعنوان" : "Search by Title"}
              name="search"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={locale === "ar" ? "مثال: مؤتمر العلاج الموجه" : "Example: targeted therapy summit"}
              value={searchQuery}
            />
            <div className="space-y-[var(--space-4)]">
              <div className="space-y-[var(--space-2)]">
                <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
                  {locale === "ar" ? "التصنيفات" : "Categories"}
                </p>
                <FilterTabs
                  activeFilter={activeCategory}
                  filters={categories}
                  onFilterChange={setActiveCategory}
                />
              </div>
              <div className="space-y-[var(--space-2)]">
                <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
                  {locale === "ar" ? "الوسوم" : "Tags"}
                </p>
                <FilterTabs
                  activeFilter={activeTag}
                  filters={tags}
                  onFilterChange={setActiveTag}
                />
              </div>
            </div>
          </div>

          {filteredConferences.length > 0 ? (
            <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
              {filteredConferences.map((conference) => (
                <ConferenceCard conference={conference} key={conference.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-6)] py-[var(--space-12)] text-center text-[length:var(--font-size-sm)] text-[var(--color-text-muted)] shadow-[var(--shadow-sm)]">
              {locale === "ar"
                ? "لا توجد مؤتمرات مطابقة للبحث أو التصفية الحالية."
                : "No conferences match the current search or filters."}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}