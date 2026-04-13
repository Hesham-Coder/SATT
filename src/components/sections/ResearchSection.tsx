"use client";

import { useState, useMemo } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Input } from "@/components/ui/Input";
import type { ResearchArticle } from "@/types/research";

export function ResearchSection({ researchArticles }: { researchArticles: ResearchArticle[] }) {
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = useMemo(() => {
    const allCategories = new Set<string>();
    researchArticles.forEach((r) => allCategories.add(r.category));
    return ["الكل", ...Array.from(allCategories)];
  }, [researchArticles]);

  const filteredArticles = useMemo(() => {
    return researchArticles.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "الكل" || r.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery, researchArticles]);

  return (
    <SectionShell
      description="أحدث الأبحاث الإكلينيكية، المراجعات العلمية، والدراسات في مجال العلاج المناعي والجيني."
      eyebrow="الأبحاث"
      id="research"
      surface="muted"
      title="منشوراتنا وشراكاتنا البحثية"
    >
      <div className="space-y-[var(--space-8)]">
        <div className="flex flex-col gap-[var(--space-4)] md:grid md:grid-cols-[1fr_auto] md:items-end">
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
              label="البحث"
              placeholder="ابحث في الأبحاث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-[var(--space-5)] sm:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-12)] text-center text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
            لا توجد أبحاث تطابق بحثك.
          </div>
        )}
      </div>
    </SectionShell>
  );
}
