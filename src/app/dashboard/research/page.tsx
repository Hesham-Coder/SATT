import { ResearchManager } from "./ResearchManager";
import prisma from "@/lib/db";

export default async function ResearchPage() {
  const articles = await prisma.researchArticle.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <ResearchManager initialData={articles} />
    </div>
  );
}
