import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ConferencesIndex } from "@/components/conferences/ConferencesIndex";
import { getConferences } from "@/data/conferences";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المؤتمرات والفعاليات",
  description:
    "تصفح المؤتمرات والفعاليات العلمية مع البحث والتصفية وصفحات التفاصيل الديناميكية.",
};

export default async function ConferencesPage() {
  const conferences = await getConferences();

  return (
    <>
      <Navbar />
      <ConferencesIndex conferences={conferences} />
      <Footer />
    </>
  );
}