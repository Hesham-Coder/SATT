import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ConferenceDetails } from "@/components/conferences/ConferenceDetails";
import { getConferences, getConferenceById } from "@/data/conferences";
import { type SupportedLocale } from "@/i18n/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const conference = await getConferenceById(id);
  if (!conference) return { title: "غير موجود" };

  const validLocale = locale as SupportedLocale;
  const title = validLocale === "en" ? conference.title.en : conference.title.ar;
  const desc = validLocale === "en" ? conference.shortDescription.en : conference.shortDescription.ar;

  return {
    title,
    description: desc || conference.description.ar,
  };
}

export default async function ConferencePage({ params }: Props) {
  const { locale, id } = await params;
  const validLocale = locale as SupportedLocale;

  const [conference, allConferences] = await Promise.all([
    getConferenceById(id),
    getConferences(),
  ]);

  if (!conference) {
    notFound();
  }

  const relatedConferences = allConferences
    .filter((item) => item.id !== conference.id)
    .filter((item) => item.category.key === conference.category.key)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <ConferenceDetails
        conference={conference}
        relatedConferences={relatedConferences}
      />
      <Footer locale={validLocale} />
    </>
  );
}
