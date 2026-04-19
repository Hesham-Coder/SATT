export type ResearchArticle = {
  id: string;
  title: string;
  titleAr?: string | null;
  titleEn?: string | null;
  abstract: string;
  abstractAr?: string | null;
  abstractEn?: string | null;
  author: string;
  authorAr?: string | null;
  authorEn?: string | null;
  publishDate: string;
  category: string;
  categoryAr?: string | null;
  categoryEn?: string | null;
  content: string; // rich text or markdown (string for now)
  contentAr?: string | null;
  contentEn?: string | null;
  relatedMedia: {
    images: string[];
    videos: string[];
  };
};
