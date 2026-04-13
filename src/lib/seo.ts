import prisma from "@/lib/db";

export type SeoSettings = {
  title: string;
  description: string;
  siteUrl: string;
  ogImage: string;
};

const DEFAULT_TITLE = "الجمعية العلمية للعلاج الموجه";
const DEFAULT_DESCRIPTION =
  "الجمعية العلمية للعلاج الموجه توفر منصة للتعليم الطبي المستمر وتبادل الخبرات ودعم الأبحاث.";
const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_OG_IMAGE_PATH = "/uploads/seo-og-image.jpg";

function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL;

  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getDefaultSeoSettings(): SeoSettings {
  const siteUrl = resolveSiteUrl();

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    siteUrl,
    ogImage: `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`,
  };
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const fallback = getDefaultSeoSettings();

  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });

    if (!settings) {
      return fallback;
    }

    const title = settings.heroTitle?.trim() || fallback.title;
    const description = settings.heroDesc?.trim() || fallback.description;

    return {
      ...fallback,
      title,
      description,
    };
  } catch {
    return fallback;
  }
}
