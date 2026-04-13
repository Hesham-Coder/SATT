const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const DEFAULT_TRUSTED_DOMAINS = ["localhost", "127.0.0.1"];
const BLOCKED_HOSTS = ["facebook.com", "fb.com", "m.facebook.com", "www.facebook.com"];

function normalizeDomain(value: string) {
  return value.trim().toLowerCase();
}

function getTrustedImageDomains() {
  const envValue =
    process.env.NEXT_PUBLIC_TRUSTED_IMAGE_DOMAINS || process.env.TRUSTED_IMAGE_DOMAINS || "";

  const fromEnv = envValue
    .split(",")
    .map(normalizeDomain)
    .filter(Boolean);

  const combined = [...DEFAULT_TRUSTED_DOMAINS, ...fromEnv];

  return Array.from(new Set(combined));
}

function hasAllowedImageExtension(pathname: string) {
  const normalizedPath = pathname.toLowerCase();

  return ALLOWED_IMAGE_EXTENSIONS.some((extension) => normalizedPath.endsWith(extension));
}

function isBlockedHost(hostname: string) {
  const normalizedHost = normalizeDomain(hostname);

  return BLOCKED_HOSTS.some((blockedHost) =>
    normalizedHost === blockedHost || normalizedHost.endsWith(`.${blockedHost}`),
  );
}

function isTrustedHost(hostname: string) {
  const normalizedHost = normalizeDomain(hostname);

  return getTrustedImageDomains().some(
    (domain) => normalizedHost === domain || normalizedHost.endsWith(`.${domain}`),
  );
}

function asPathWithFilename(rawValue: string) {
  if (rawValue.startsWith("/")) {
    return rawValue;
  }

  if (rawValue.startsWith("uploads/")) {
    return `/${rawValue}`;
  }

  return rawValue;
}

export function isValidImageUrl(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return false;
  }

  if (value.startsWith("/") || value.startsWith("uploads/")) {
    const normalizedPath = asPathWithFilename(value);

    if (!normalizedPath.startsWith("/uploads/")) {
      return false;
    }

    const [pathname] = normalizedPath.split(/[?#]/);
    return hasAllowedImageExtension(pathname);
  }

  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return false;
  }

  if (isBlockedHost(parsed.hostname) || !isTrustedHost(parsed.hostname)) {
    return false;
  }

  return hasAllowedImageExtension(parsed.pathname);
}

export function sanitizeImageUrls(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => isValidImageUrl(value)),
    ),
  );
}

export function getSafeImageSrc(value: string | null | undefined, fallbackSrc: string) {
  if (!value) {
    return fallbackSrc;
  }

  return isValidImageUrl(value) ? value.trim() : fallbackSrc;
}

export const IMAGE_URL_VALIDATION_ERROR =
  "Please enter a direct image URL (jpg/png/webp)";
