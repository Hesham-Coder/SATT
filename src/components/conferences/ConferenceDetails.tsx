"use client";

import Link from "next/link";

import { useTranslations } from "@/i18n/provider";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { MediaGallery } from "@/components/ui/MediaGallery";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import {
  getConferenceCategoryLabel,
  getConferenceDescription,
  getConferenceLocation,
  getConferenceTags,
  getConferenceTitle,
} from "@/lib/conferences";
import type { Conference } from "@/types/conference";
import { ConferenceCard } from "@/components/ui/ConferenceCard";

export function ConferenceDetails({
  conference,
  relatedConferences = [],
}: {
  conference: Conference;
  relatedConferences?: Conference[];
}) {
  const { locale } = useTranslations();
  const title = getConferenceTitle(conference, locale);
  const description = getConferenceDescription(conference, locale);
  const location = getConferenceLocation(conference, locale);
  const category = getConferenceCategoryLabel(conference, locale);
  const tags = getConferenceTags(conference, locale);

  return (
    <main className="py-[var(--space-16)] md:py-[var(--space-24)]">
      <Container className="space-y-[var(--space-10)]">
        <section className="space-y-[var(--space-5)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-md)]">
          <Link
            className="inline-flex items-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
            href="/conferences"
          >
            {locale === "ar" ? "العودة إلى المؤتمرات" : "Back to conferences"}
          </Link>

          <div className="space-y-[var(--space-4)]">
            <div className="flex flex-wrap items-center gap-[var(--space-2)]">
              <Badge>{category}</Badge>
              {tags.slice(0, 4).map((tag) => (
                <Badge className="bg-[var(--color-surface-muted)]" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="max-w-4xl font-[family-name:var(--font-family-display)] text-[length:var(--font-size-3xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] text-[var(--color-text-primary)]">
              {title}
            </h1>
            <div className="grid gap-[var(--space-4)] text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)] sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
                <p className="text-[length:var(--font-size-xxs)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-muted)]">
                  {locale === "ar" ? "التاريخ" : "Date"}
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--font-size-md)] text-[var(--color-text-primary)]">
                  {conference.date}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
                <p className="text-[length:var(--font-size-xxs)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-muted)]">
                  {locale === "ar" ? "الموقع" : "Location"}
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--font-size-md)] text-[var(--color-text-primary)]">
                  {location}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
                <p className="text-[length:var(--font-size-xxs)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-muted)]">
                  {locale === "ar" ? "التصنيف" : "Category"}
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--font-size-md)] text-[var(--color-text-primary)]">
                  {category}
                </p>
              </div>
            </div>
          </div>
        </section>

        {conference.images.length > 0 ? (
          <section className="space-y-[var(--space-4)]">
            <h2 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              {locale === "ar" ? "معرض الصور" : "Image Gallery"}
            </h2>
            <MediaGallery images={conference.images} title={title} />
          </section>
        ) : null}

        {conference.videos.length > 0 ? (
          <section className="space-y-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
            <h2 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              {locale === "ar" ? "الفيديوهات والتسجيلات" : "Videos & Recordings"}
            </h2>
            <div className="grid gap-[var(--space-5)] md:grid-cols-2">
              {conference.videos.map((videoUrl) => (
                <VideoPlayer key={videoUrl} title={title} url={videoUrl} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-sm)]">
          <div className="space-y-[var(--space-4)]">
            <h2 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              {locale === "ar" ? "الوصف الكامل" : "Full Description"}
            </h2>
            <p className="whitespace-pre-wrap text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              {description}
            </p>
          </div>
        </section>

        {relatedConferences.length > 0 ? (
          <section className="space-y-[var(--space-4)]">
            <h2 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              {locale === "ar" ? "مؤتمرات ذات صلة" : "Related Conferences"}
            </h2>
            <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
              {relatedConferences.map((item) => (
                <ConferenceCard conference={item} key={item.id} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
