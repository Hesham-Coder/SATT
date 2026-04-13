import prisma from "@/lib/db";
import { sanitizeImageUrls } from "@/lib/validateImage";
import type { ResearchArticle } from "@/types/research";

export async function getResearchArticles(): Promise<ResearchArticle[]> {
  try {
    const raw = await prisma.researchArticle.findMany({ orderBy: { createdAt: "desc" } });
    return raw.map(r => ({
      ...r,
      relatedMedia: {
        images: sanitizeImageUrls(JSON.parse(r.images || "[]")),
        videos: JSON.parse(r.videos || "[]")
      }
    }));
  } catch {
    return [];
  }
}
