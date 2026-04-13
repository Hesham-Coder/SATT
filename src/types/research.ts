export type ResearchArticle = {
  id: string;
  title: string;
  abstract: string;
  author: string;
  publishDate: string;
  category: string;
  content: string; // rich text or markdown (string for now)
  relatedMedia: {
    images: string[];
    videos: string[];
  };
};
