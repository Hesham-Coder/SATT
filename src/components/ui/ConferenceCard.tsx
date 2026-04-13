"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  getConferenceLocation,
  getConferenceShortDescription,
  getConferenceTags,
  getConferenceTitle,
} from "@/lib/conferences";
import { getSafeImageSrc, isValidImageUrl } from "@/lib/validateImage";
import { cn } from "@/lib/utils";
import type { Conference } from "@/types/conference";

export function ConferenceCard({ conference }: { conference: Conference }) {
  const { locale } = useLanguage();
  const title = getConferenceTitle(conference, locale);
  const shortDescription = getConferenceShortDescription(conference, locale);
  const location = getConferenceLocation(conference, locale);
  const tags = getConferenceTags(conference, locale);
  const [coverBroken, setCoverBroken] = useState(false);
  const placeholderImage = "/images/conference-1.png";

  const coverImage = useMemo(
    () => conference.images.find((image) => isValidImageUrl(image)) || null,
    [conference.images],
  );

  const coverSrc = getSafeImageSrc(coverImage, placeholderImage);

  return (
    <Card className={cn("flex h-full flex-col justify-between overflow-hidden p-0")}>
      <Link
        aria-label={title}
        className="group flex h-full flex-col"
        href={`/conferences/${conference.id}`}
      >
      <div className="relative aspect-video w-full overflow-hidden">
        {!coverBroken ? (
          <Image
            alt={title}
            src={coverSrc}
            fill
            className="object-cover transition-transform duration-[var(--duration-base)] group-hover:scale-105"
            onError={() => {
              if (coverSrc !== placeholderImage) {
                setCoverBroken(true);
              }
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <Image
            alt={title}
            src={placeholderImage}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      
      <div className="flex flex-col gap-[var(--space-4)] p-[var(--space-6)]">
        <div className="space-y-[var(--space-2)]">
          <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
            {conference.date} • {location}
          </p>
          <h3 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)] group-hover:underline">
            {title}
          </h3>
        </div>
        
        <p className="line-clamp-2 text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
          {shortDescription}
        </p>

        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-[var(--space-2)]">
            {tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
      </Link>
    </Card>
  );
}
