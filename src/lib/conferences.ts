import type { Conference, ConferenceFormValues, SupportedLocale } from "@/types/conference";
import {
  IMAGE_URL_VALIDATION_ERROR,
  VIDEO_URL_VALIDATION_ERROR,
  isValidImageUrl,
  isValidVideoUrl,
} from "@/lib/validateImage";

type NullableString = string | null | undefined;

export type ConferenceRecord = {
  id: string;
  title: string;
  titleAr?: NullableString;
  titleEn?: NullableString;
  description: string;
  descriptionAr?: NullableString;
  descriptionEn?: NullableString;
  shortDescriptionAr?: NullableString;
  shortDescriptionEn?: NullableString;
  fullDescription?: NullableString;
  date: string;
  location: string;
  locationAr?: NullableString;
  locationEn?: NullableString;
  categoryKey?: NullableString;
  categoryAr?: NullableString;
  categoryEn?: NullableString;
  images: string;
  videos: string;
  tags: string;
  tagsAr?: NullableString;
  tagsEn?: NullableString;
  createdAt: Date;
};

function asStringArray(value: NullableString): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function normalizeMediaUrl(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return value;
  }

  if (value.startsWith("uploads/")) {
    return `/${value}`;
  }

  if (/^[^/\\]+\.[a-z0-9]+$/i.test(value)) {
    return `/uploads/${value}`;
  }

  return value;
}

function sanitizeText(value: NullableString): string {
  return String(value ?? "").trim();
}

function fallbackLocalized(primary: NullableString, fallback: NullableString, legacy: string) {
  const first = sanitizeText(primary);
  const second = sanitizeText(fallback);
  const legacyValue = sanitizeText(legacy);

  return {
    ar: first || second || legacyValue,
    en: second || first || legacyValue,
  };
}

function inferCategoryKey(rawValue: string) {
  return rawValue
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

export function mapConferenceRecord(record: ConferenceRecord): Conference {
  const legacyTags = asStringArray(record.tags);
  const tagsAr = asStringArray(record.tagsAr) || legacyTags;
  const tagsEn = asStringArray(record.tagsEn) || legacyTags;
  const description = fallbackLocalized(
    record.descriptionAr,
    record.descriptionEn || record.fullDescription,
    record.description,
  );
  const images = asStringArray(record.images)
    .map(normalizeMediaUrl)
    .filter((value) => isValidImageUrl(value));
  const videos = asStringArray(record.videos)
    .map(normalizeMediaUrl)
    .filter((value) => isValidVideoUrl(value));

  return {
    id: record.id,
    title: fallbackLocalized(record.titleAr, record.titleEn, record.title),
    description,
    shortDescription: {
      ar:
        sanitizeText(record.shortDescriptionAr) ||
        description.ar,
      en:
        sanitizeText(record.shortDescriptionEn) ||
        description.en,
    },
    date: sanitizeText(record.date),
    location: fallbackLocalized(record.locationAr, record.locationEn, record.location),
    category: {
      key: sanitizeText(record.categoryKey) || inferCategoryKey(record.categoryEn || record.categoryAr || "general"),
      label: {
        ar: sanitizeText(record.categoryAr) || sanitizeText(record.categoryEn) || "عام",
        en: sanitizeText(record.categoryEn) || sanitizeText(record.categoryAr) || "General",
      },
    },
    images,
    videos,
    tags: {
      ar: tagsAr.length > 0 ? tagsAr : legacyTags,
      en: tagsEn.length > 0 ? tagsEn : legacyTags,
    },
    createdAt: record.createdAt.toISOString(),
  };
}

export function getConferenceTitle(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.title.ar || conference.title.en
    : conference.title.en || conference.title.ar;
}

export function getConferenceDescription(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.description.ar || conference.description.en
    : conference.description.en || conference.description.ar;
}

export function getConferenceShortDescription(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.shortDescription.ar || conference.shortDescription.en
    : conference.shortDescription.en || conference.shortDescription.ar;
}

export function getConferenceLocation(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.location.ar || conference.location.en
    : conference.location.en || conference.location.ar;
}

export function getConferenceCategoryLabel(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.category.label.ar || conference.category.label.en
    : conference.category.label.en || conference.category.label.ar;
}

export function getConferenceTags(
  conference: Conference,
  locale: SupportedLocale,
) {
  const localized = locale === "ar" ? conference.tags.ar : conference.tags.en;
  const fallback = locale === "ar" ? conference.tags.en : conference.tags.ar;

  return localized.length > 0 ? localized : fallback;
}

function uniqueTrimmed(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function validateImagesOrThrow(values: string[]) {
  const invalid = values.filter((value) => !isValidImageUrl(value));

  if (invalid.length > 0) {
    throw new Error(IMAGE_URL_VALIDATION_ERROR);
  }
}

function validateVideosOrThrow(values: string[]) {
  const invalid = values.filter((value) => !isValidVideoUrl(value));

  if (invalid.length > 0) {
    throw new Error(VIDEO_URL_VALIDATION_ERROR);
  }
}

export function parseCommaSeparatedList(value: string) {
  return uniqueTrimmed(value.split(","));
}

export function normalizeConferencePayload(values: ConferenceFormValues) {
  const categoryKey =
    values.category.key?.trim() ||
    inferCategoryKey(values.category.label.en || values.category.label.ar);

  const titleAr = sanitizeText(values.title.ar);
  const titleEn = sanitizeText(values.title.en);
  const descriptionAr = sanitizeText(values.description.ar);
  const descriptionEn = sanitizeText(values.description.en);
  const shortDescriptionAr = sanitizeText(values.shortDescription.ar);
  const shortDescriptionEn = sanitizeText(values.shortDescription.en);
  const locationAr = sanitizeText(values.location.ar);
  const locationEn = sanitizeText(values.location.en);
  const categoryAr = sanitizeText(values.category.label.ar);
  const categoryEn = sanitizeText(values.category.label.en);
  const tagsAr = uniqueTrimmed(values.tags.ar);
  const tagsEn = uniqueTrimmed(values.tags.en);
  const images = uniqueTrimmed(values.images).map(normalizeMediaUrl);
  validateImagesOrThrow(images);
  const videos = uniqueTrimmed(values.videos).map(normalizeMediaUrl);
  validateVideosOrThrow(videos);

  return {
    title: titleAr || titleEn,
    titleAr,
    titleEn,
    description: descriptionAr || descriptionEn,
    descriptionAr,
    descriptionEn,
    shortDescriptionAr,
    shortDescriptionEn,
    fullDescription: descriptionAr || descriptionEn,
    date: sanitizeText(values.date),
    location: locationAr || locationEn,
    locationAr,
    locationEn,
    categoryKey,
    categoryAr,
    categoryEn,
    images: JSON.stringify(images),
    videos: JSON.stringify(videos),
    tags: JSON.stringify(uniqueTrimmed([...tagsAr, ...tagsEn])),
    tagsAr: JSON.stringify(tagsAr),
    tagsEn: JSON.stringify(tagsEn),
  };
}

export function isYouTubeUrl(url: string) {
  return /youtu\.be|youtube\.com/.test(url);
}

export function getYouTubeVideoId(url: string) {
  const match = url.match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/,
  );

  return match?.[1] ?? null;
}
import type { Conference, ConferenceFormValues, SupportedLocale } from "@/types/conference";
import {
  IMAGE_URL_VALIDATION_ERROR,
  VIDEO_URL_VALIDATION_ERROR,
  isValidImageUrl,
  isValidVideoUrl,
} from "@/lib/validateImage";

type NullableString = string | null | undefined;

export type ConferenceRecord = {
  id: string;
  title: string;
  titleAr?: NullableString;
  titleEn?: NullableString;
  description: string;
  descriptionAr?: NullableString;
  descriptionEn?: NullableString;
  shortDescriptionAr?: NullableString;
  shortDescriptionEn?: NullableString;
  fullDescription?: NullableString;
  date: string;
  location: string;
  locationAr?: NullableString;
  locationEn?: NullableString;
  categoryKey?: NullableString;
  categoryAr?: NullableString;
  categoryEn?: NullableString;
  images: string;
  videos: string;
  tags: string;
  tagsAr?: NullableString;
  tagsEn?: NullableString;
  createdAt: Date;
};

function asStringArray(value: NullableString): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function normalizeMediaUrl(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/uploads/")) {
    return value;
  }

  if (value.startsWith("uploads/")) {
    return `/${value}`;
  }

  if (/^[^/\\]+\.[a-z0-9]+$/i.test(value)) {
    return `/uploads/${value}`;
  }

  return value;
}

function sanitizeText(value: NullableString): string {
  return String(value ?? "").trim();
}

function fallbackLocalized(primary: NullableString, fallback: NullableString, legacy: string) {
  const first = sanitizeText(primary);
  const second = sanitizeText(fallback);
  const legacyValue = sanitizeText(legacy);

  return {
    ar: first || second || legacyValue,
    en: second || first || legacyValue,
  };
}

    const invalid = values.filter((value) => !isValidImageUrl(value));

    if (invalid.length > 0) {
      throw new Error(IMAGE_URL_VALIDATION_ERROR);
    }
  }

  function validateVideosOrThrow(values: string[]) {
    const invalid = values.filter((value) => !isValidVideoUrl(value));

    if (invalid.length > 0) {
      throw new Error(VIDEO_URL_VALIDATION_ERROR);
    }
function inferCategoryKey(rawValue: string) {
  return rawValue
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

export function mapConferenceRecord(record: ConferenceRecord): Conference {
  const legacyTags = asStringArray(record.tags);
  const tagsAr = asStringArray(record.tagsAr) || legacyTags;
  const tagsEn = asStringArray(record.tagsEn) || legacyTags;
  const description = fallbackLocalized(
    record.descriptionAr,
    record.descriptionEn || record.fullDescription,
    record.description,
  );
  const images = asStringArray(record.images)
    .map(normalizeMediaUrl)
    .filter((value) => isValidImageUrl(value));
  const videos = asStringArray(record.videos)
    .map(normalizeMediaUrl)
    .filter(Boolean);

  return {
    id: record.id,
    title: fallbackLocalized(record.titleAr, record.titleEn, record.title),
    description,
    shortDescription: {
      ar:
        sanitizeText(record.shortDescriptionAr) ||
        description.ar,
      en:
        sanitizeText(record.shortDescriptionEn) ||
        description.en,
    },
    date: sanitizeText(record.date),
    location: fallbackLocalized(record.locationAr, record.locationEn, record.location),
    category: {
      key: sanitizeText(record.categoryKey) || inferCategoryKey(record.categoryEn || record.categoryAr || "general"),
      label: {
        ar: sanitizeText(record.categoryAr) || sanitizeText(record.categoryEn) || "عام",
        en: sanitizeText(record.categoryEn) || sanitizeText(record.categoryAr) || "General",
      },
    },
    images,
    videos,
    tags: {
      ar: tagsAr.length > 0 ? tagsAr : legacyTags,
      en: tagsEn.length > 0 ? tagsEn : legacyTags,
    },
    createdAt: record.createdAt.toISOString(),
  };
}

export function getConferenceTitle(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.title.ar || conference.title.en
    : conference.title.en || conference.title.ar;
}

export function getConferenceDescription(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.description.ar || conference.description.en
    : conference.description.en || conference.description.ar;
}

export function getConferenceShortDescription(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.shortDescription.ar || conference.shortDescription.en
    : conference.shortDescription.en || conference.shortDescription.ar;
}

export function getConferenceLocation(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.location.ar || conference.location.en
    : conference.location.en || conference.location.ar;
}

export function getConferenceCategoryLabel(
  conference: Conference,
  locale: SupportedLocale,
) {
  return locale === "ar"
    ? conference.category.label.ar || conference.category.label.en
    : conference.category.label.en || conference.category.label.ar;
}

export function getConferenceTags(
  conference: Conference,
  locale: SupportedLocale,
) {
  const localized = locale === "ar" ? conference.tags.ar : conference.tags.en;
  const fallback = locale === "ar" ? conference.tags.en : conference.tags.ar;

  return localized.length > 0 ? localized : fallback;
}

function uniqueTrimmed(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function validateImagesOrThrow(values: string[]) {
  const invalid = values.filter((value) => !isValidImageUrl(value));

  if (invalid.length > 0) {
    throw new Error(IMAGE_URL_VALIDATION_ERROR);
  }
}

export function parseCommaSeparatedList(value: string) {
  return uniqueTrimmed(value.split(","));
}

export function normalizeConferencePayload(values: ConferenceFormValues) {
  const categoryKey =
    values.category.key?.trim() ||
    inferCategoryKey(values.category.label.en || values.category.label.ar);

  const titleAr = sanitizeText(values.title.ar);
  const titleEn = sanitizeText(values.title.en);
  const descriptionAr = sanitizeText(values.description.ar);
  const descriptionEn = sanitizeText(values.description.en);
  const shortDescriptionAr = sanitizeText(values.shortDescription.ar);
  const shortDescriptionEn = sanitizeText(values.shortDescription.en);
  const locationAr = sanitizeText(values.location.ar);
  const locationEn = sanitizeText(values.location.en);
  const categoryAr = sanitizeText(values.category.label.ar);
  const categoryEn = sanitizeText(values.category.label.en);
  const tagsAr = uniqueTrimmed(values.tags.ar);
  const tagsEn = uniqueTrimmed(values.tags.en);
  const images = uniqueTrimmed(values.images).map(normalizeMediaUrl);
  validateImagesOrThrow(images);
  const videos = uniqueTrimmed(values.videos);
  validateVideosOrThrow(videos);

  return {
    title: titleAr || titleEn,
    titleAr,
    titleEn,
    description: descriptionAr || descriptionEn,
    descriptionAr,
    descriptionEn,
    shortDescriptionAr,
    shortDescriptionEn,
    fullDescription: descriptionAr || descriptionEn,
    date: sanitizeText(values.date),
    location: locationAr || locationEn,
    locationAr,
    locationEn,
    categoryKey,
    categoryAr,
    categoryEn,
    images: JSON.stringify(images),
    videos: JSON.stringify(videos),
    tags: JSON.stringify(uniqueTrimmed([...tagsAr, ...tagsEn])),
    tagsAr: JSON.stringify(tagsAr),
    tagsEn: JSON.stringify(tagsEn),
  };
}

export function isYouTubeUrl(url: string) {
  return /youtu\.be|youtube\.com/.test(url);
}

export function getYouTubeVideoId(url: string) {
  const match = url.match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/,
  );

  return match?.[1] ?? null;
}