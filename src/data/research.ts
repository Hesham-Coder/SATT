import prisma from "@/lib/db";
import { sanitizeImageUrls } from "@/lib/validateImage";
import type { ResearchArticle } from "@/types/research";

export async function getResearchArticles(): Promise<ResearchArticle[]> {
  try {
    const raw = await prisma.researchArticle.findMany({ orderBy: { createdAt: "desc" } });
    return raw.map(r => ({
      ...r,
      titleAr: r.titleAr || r.title,
      titleEn: r.titleEn || r.title,
      abstractAr: r.abstractAr || r.abstract,
      abstractEn: r.abstractEn || r.abstract,
      categoryAr: r.categoryAr || r.category,
      categoryEn: r.categoryEn || r.category,
      contentAr: r.contentAr || r.content,
      contentEn: r.contentEn || r.content,
      relatedMedia: {
        images: sanitizeImageUrls(JSON.parse(r.images || "[]")),
        videos: JSON.parse(r.videos || "[]")
      }
    }));
  } catch {
    return [];
  }
}
