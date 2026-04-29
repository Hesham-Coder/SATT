import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { ResearchArticle } from "@/types/research";
import { useTranslations } from "@/i18n/provider";

export function ArticleCard({ article }: { article: ResearchArticle }) {
  const { locale } = useTranslations();
  
  const title = locale === "ar" ? (article.titleAr || article.title) : (article.titleEn || article.title);
  const category = locale === "ar" ? (article.categoryAr || article.category) : (article.categoryEn || article.category);
  const abstract = locale === "ar" ? (article.abstractAr || article.abstract) : (article.abstractEn || article.abstract);
  const author = locale === "ar" ? (article.authorAr || article.author) : (article.authorEn || article.author);

  return (
    <Card className="flex h-full flex-col justify-between gap-[var(--space-4)]">
      <div className="space-y-[var(--space-3)]">
        <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
          {category} • {article.publishDate}
        </p>
        <h3 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] text-[var(--color-text-primary)]">
          <Link href={`/research/${article.id}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]">
            {title}
          </Link>
        </h3>
      </div>
      
      <p className="line-clamp-3 text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
        {abstract}
      </p>

      <p className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
        {locale === "ar" ? "بقلم" : "By"}: {author}
      </p>
    </Card>
  );
}
