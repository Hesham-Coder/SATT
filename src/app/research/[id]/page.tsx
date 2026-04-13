import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MediaGallery } from "@/components/ui/MediaGallery";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Badge } from "@/components/ui/Badge";
import { getResearchArticles } from "@/data/research";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const researchArticles = await getResearchArticles();
  const article = researchArticles.find((r) => r.id === id);
  if (!article) return { title: "غير موجود" };

  return {
    title: article.title,
    description: article.abstract,
  };
}

export async function generateStaticParams() {
  const researchArticles = await getResearchArticles();
  return researchArticles.map((r) => ({ id: r.id }));
}

export default async function ResearchPage({ params }: Props) {
  const { id } = await params;
  const researchArticles = await getResearchArticles();
  const article = researchArticles.find((r) => r.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="py-[var(--space-16)] md:py-[var(--space-24)]">
      <Container className="max-w-4xl space-y-[var(--space-10)]">
        <div className="space-y-[var(--space-5)]">
          <Link
            href="/#research"
            className="inline-flex items-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
          >
            &rarr; العودة للأبحاث
          </Link>
          
          <div className="space-y-[var(--space-3)]">
            <Badge>{article.category}</Badge>
            <h1 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-3xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] text-[var(--color-text-primary)]">
              {article.title}
            </h1>
            <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-muted)]">
              تاريخ النشر: {article.publishDate} • بقلم: {article.author}
            </p>
          </div>
        </div>

        {article.relatedMedia?.images && article.relatedMedia.images.length > 0 && (
          <MediaGallery images={article.relatedMedia.images} />
        )}

        <div className="prose prose-slate max-w-none prose-headings:font-[family-name:var(--font-family-display)] rtl:prose-headings:text-right">
          <p className="text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)] whitespace-pre-wrap">
            {article.content}
          </p>
        </div>

        {article.relatedMedia?.videos && article.relatedMedia.videos.length > 0 && (
          <div className="space-y-[var(--space-4)] pt-[var(--space-8)] border-t border-[var(--color-border)]">
            <h2 className="text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)]">
              استعراض الميديا المرتبطة
            </h2>
            <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
              {article.relatedMedia.videos.map((vid, idx) => (
                <VideoPlayer key={idx} url={vid} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
