"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getSafeImageSrc, isValidImageUrl } from "@/lib/validateImage";

type MediaGalleryProps = {
  images: string[];
  title?: string;
};

export function MediaGallery({ images, title }: MediaGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const placeholderImage = "/images/research-1.png";

  const sanitizedImages = useMemo(
    () => images.filter((image) => isValidImageUrl(image)),
    [images],
  );

  const galleryImages = sanitizedImages.length > 0 ? sanitizedImages : [placeholderImage];

  const activeImageUrl = galleryImages[activeImage] || galleryImages[0];
  const activeBroken = brokenImages[activeImageUrl];
  const activeDisplaySrc = activeBroken
    ? placeholderImage
    : getSafeImageSrc(activeImageUrl, placeholderImage);

  function markBroken(url: string) {
    setBrokenImages((current) => ({ ...current, [url]: true }));
  }

  return (
    <div className="space-y-[var(--space-4)]">
      <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        {!activeBroken || activeImageUrl === placeholderImage ? (
          <Image
            alt={title ? `${title} ${activeImage + 1}` : `Conference image ${activeImage + 1}`}
            src={activeDisplaySrc}
            fill
            className="object-cover"
            onError={() => {
              if (activeImageUrl !== placeholderImage) {
                markBroken(activeImageUrl);
              }
            }}
            sizes="(max-width: 1200px) 100vw, 800px"
            priority={activeImage === 0}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-muted)] px-[var(--space-4)] text-center text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
            Image unavailable
          </div>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-2 gap-[var(--space-2)] overflow-hidden sm:grid-cols-4 lg:grid-cols-5">
          {galleryImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative aspect-video w-full overflow-hidden rounded-[var(--radius-sm)] border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] ${
                index === activeImage
                  ? "border-[var(--color-primary)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              type="button"
            >
              <Image
                alt={title ? `${title} thumbnail ${index + 1}` : `Conference thumbnail ${index + 1}`}
                src={brokenImages[img] ? placeholderImage : getSafeImageSrc(img, placeholderImage)}
                fill
                className="object-cover"
                onError={() => {
                  if (img !== placeholderImage) {
                    markBroken(img);
                  }
                }}
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
