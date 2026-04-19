import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { getResearchArticles } from "@/data/research";
import { type SupportedLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: "الأبحاث والمقالات | الجمعية العلمية للعلاج الموجه",
  description:
    "استكشف أحدث الأبحاث، المقالات العلمية، والموارد في مجال علاج الأورام الموجه.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ResearchPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = locale as SupportedLocale;
  const researchArticles = await getResearchArticles();

  return (
    <>
      <Navbar />
      <div className="pt-[var(--space-20)]">
        <ResearchSection researchArticles={researchArticles} />
      </div>
      <Footer locale={validLocale} />
    </>
  );
}
