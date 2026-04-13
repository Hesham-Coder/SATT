import dynamicImport from "next/dynamic";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionPlaceholder } from "@/components/ui/SectionPlaceholder";
import { getConferences } from "@/data/conferences";
import { getResearchArticles } from "@/data/research";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const AboutSection = dynamicImport(
  () =>
    import("@/components/sections/AboutSection").then(
      (mod) => mod.AboutSection,
    ),
  {
    loading: () => <SectionPlaceholder />,
  },
);

const PillarsSection = dynamicImport(
  () =>
    import("@/components/sections/PillarsSection").then(
      (mod) => mod.PillarsSection,
    ),
  {
    loading: () => <SectionPlaceholder />,
  },
);

const DoctorsSection = dynamicImport(
  () =>
    import("@/components/sections/DoctorsSection").then(
      (mod) => mod.DoctorsSection,
    ),
  {
    loading: () => <SectionPlaceholder />,
  },
);

const ConferencesSection = dynamicImport(
  () =>
    import("@/components/sections/ConferencesSection").then(
      (mod) => mod.ConferencesSection,
    ),
  {
    loading: () => <SectionPlaceholder />,
  },
);

const ResearchSection = dynamicImport(
  () =>
    import("@/components/sections/ResearchSection").then(
      (mod) => mod.ResearchSection,
    ),
  {
    loading: () => <SectionPlaceholder />,
  },
);

const ContactSection = dynamicImport(
  () =>
    import("@/components/sections/ContactSection").then(
      (mod) => mod.ContactSection,
    ),
  {
    loading: () => <SectionPlaceholder />,
  },
);

export default async function HomePage() {
  const [conferences, researchArticles] = await Promise.all([
    getConferences(),
    getResearchArticles(),
    prisma.siteSettings.findUnique({ where: { id: "settings" } }).catch(() => null)
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* We can pass settings to HeroSection/AboutSection if we modify them, but for now we ensure sections render */}
        <HeroSection />
        <AboutSection />
        <PillarsSection />
        <DoctorsSection />
        <ConferencesSection conferences={conferences} />
        <ResearchSection researchArticles={researchArticles} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
