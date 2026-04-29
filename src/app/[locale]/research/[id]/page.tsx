import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { MediaGallery } from "@/components/ui/MediaGallery";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getResearchArticles } from "@/data/research";
import { type SupportedLocale } from "@/i18n/server";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const researchArticles = await getResearchArticles();
  const article = researchArticles.find((r) => r.id === id);
  if (!article) return { title: "غير موجود" };

  const validLocale = locale as SupportedLocale;
  const title = validLocale === "ar" ? (article.titleAr || article.title) : (article.titleEn || article.title);
  const description = validLocale === "ar" ? (article.abstractAr || article.abstract) : (article.abstractEn || article.abstract);

  return {
    title,
    description,
  };
}

export default async function ResearchItemPage({ params }: Props) {
  const { locale, id } = await params;
  const validLocale = locale as SupportedLocale;

  const researchArticles = await getResearchArticles();
  const article = researchArticles.find((r) => r.id === id);

  if (!article) {
    notFound();
  }

  const title = validLocale === "ar" ? (article.titleAr || article.title) : (article.titleEn || article.title);
  const category = validLocale === "ar" ? (article.categoryAr || article.category) : (article.categoryEn || article.category);
  const description = validLocale === "ar" ? (article.abstractAr || article.abstract) : (article.abstractEn || article.abstract);
  const content = validLocale === "ar" ? (article.contentAr || article.content) : (article.contentEn || article.content);

  return (
    <>
      <Navbar />
      <div className="py-[var(--space-16)] md:py-[var(--space-24)]">
        <Container className="max-w-4xl space-y-[var(--space-10)]">
          <div className="space-y-[var(--space-5)]">
            <Link
              href="/#research"
              className="inline-flex items-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
            >
              {validLocale === "ar" ? "← العودة للأبحاث" : "Back to Research →"}
            </Link>
            
            <div className="space-y-[var(--space-3)]">
              <Badge>{category}</Badge>
              <h1 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-3xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] text-[var(--color-text-primary)]">
                {title}
              </h1>
              <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-muted)]">
                {validLocale === "ar" ? "تاريخ النشر" : "Published"}: {article.publishDate} • {validLocale === "ar" ? "بقلم" : "By"}: {article.author}
              </p>
            </div>
          </div>

          {article.relatedMedia?.images && article.relatedMedia.images.length > 0 && (
            <MediaGallery images={article.relatedMedia.images} />
          )}

          <div 
            className="prose prose-slate max-w-none prose-headings:font-[family-name:var(--font-family-display)] text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div 
            className="prose prose-slate max-w-none prose-headings:font-[family-name:var(--font-family-display)] text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {article.relatedMedia?.videos && article.relatedMedia.videos.length > 0 && (
            <div className="space-y-[var(--space-4)] pt-[var(--space-8)] border-t border-[var(--color-border)]">
              <h2 className="text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)]">
                {validLocale === "ar" ? "استعراض الميديا المرتبطة" : "Related Media"}
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
      <Footer locale={validLocale} />
    </>
  );
}
