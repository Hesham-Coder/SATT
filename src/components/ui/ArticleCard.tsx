import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { ResearchArticle } from "@/types/research";

export function ArticleCard({ article }: { article: ResearchArticle }) {
  return (
    <Card className="flex h-full flex-col justify-between gap-[var(--space-4)]">
      <div className="space-y-[var(--space-3)]">
        <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
          {article.category} • {article.publishDate}
        </p>
        <h3 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] text-[var(--color-text-primary)]">
          <Link href={`/research/${article.id}`} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]">
            {article.title}
          </Link>
        </h3>
      </div>
      
      <p className="line-clamp-3 text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
        {article.abstract}
      </p>

      <p className="text-[length:var(--font-size-xs)] text-[var(--color-text-muted)]">
        بقلم: {article.author}
      </p>
    </Card>
  );
}
