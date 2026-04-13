"use client";

import { getYouTubeVideoId, isYouTubeUrl } from "@/lib/conferences";

type VideoPlayerProps = {
  url: string;
  title?: string;
};

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const ytId = isYouTubeUrl(url) ? getYouTubeVideoId(url) : null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-black">
      {ytId ? (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title={title || "Conference video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        ></iframe>
      ) : (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
