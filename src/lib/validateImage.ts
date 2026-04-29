export const IMAGE_URL_VALIDATION_ERROR = "Please provide a direct image URL (jpg, jpeg, png, webp, avif) or a valid relative path (/uploads/...)";
export const VIDEO_URL_VALIDATION_ERROR = "Please provide a valid YouTube URL or mp4 file path";

export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  const imageRegex = /\.(jpg|jpeg|png|webp|avif)(?:[?#].*)?$/i;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    return imageRegex.test(url);
  }
  if (/^https?:\/\//i.test(url)) {
    return imageRegex.test(url);
  }
  return false;
}

export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
  if (youtubeRegex.test(url)) return true;
  const mp4Regex = /\.mp4$/i;
  if (url.startsWith("/uploads/") || url.startsWith("uploads/") || /^https?:\/\//i.test(url)) {
    return mp4Regex.test(url);
  }
  return false;
}

export function normalizeMediaUrl(rawValue: string): string {
  const value = rawValue.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/uploads/")) return value;
  if (value.startsWith("uploads/")) return `/${value}`;
  if (/^[^/\\]+\.[a-z0-9]+$/i.test(value)) return `/uploads/${value}`;
  return value;
}

export function getSafeImageSrc(value: string | null | undefined, fallback: string): string {
  const normalized = normalizeMediaUrl(value ?? "");
  return isValidImageUrl(normalized) ? normalized : fallback;
}

export function sanitizeImageUrls(urls: string[] | string): string[] {
  const list = Array.isArray(urls) ? urls : [urls];
  return list
    .map((url) => normalizeMediaUrl(url))
    .filter((url) => isValidImageUrl(url));
}
