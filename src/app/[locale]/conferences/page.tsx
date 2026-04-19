import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ConferencesIndex } from "@/components/conferences/ConferencesIndex";
import { getConferences } from "@/data/conferences";
import { type SupportedLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المؤتمرات والفعاليات",
  description:
    "تصفح المؤتمرات والفعاليات العلمية مع البحث والتصفية وصفحات التفاصيل الديناميكية.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ConferencesPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = locale as SupportedLocale;
  const conferences = await getConferences();

  return (
    <>
      <Navbar />
      <Container className="py-[var(--space-12)] md:py-[var(--space-16)]">
        <div className="mb-[var(--space-8)] md:mb-[var(--space-12)]">
          <SectionTitle
            description={validLocale === "ar" ? "تعرف على أحدث المؤتمرات والندوات العلمية وورش العمل التي تنظمها وتشارك فيها الجمعية." : "Explore the latest medical conferences, symposiums, and workshops organized or attended by the association."}
            eyebrow={validLocale === "ar" ? "الفعاليات المتاحة" : "Available Events"}
            title={validLocale === "ar" ? "المؤتمرات والفعاليات العلمية" : "Conferences & Scientific Events"}
          />
        </div>
        <ConferencesIndex conferences={conferences} />
      </Container>
      <Footer locale={validLocale} />
    </>
  );
}