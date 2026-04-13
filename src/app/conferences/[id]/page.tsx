import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ConferenceDetails } from "@/components/conferences/ConferenceDetails";
import { getConferenceById, getConferences } from "@/data/conferences";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const conference = await getConferenceById(id);
  if (!conference) return { title: "غير موجود" };

  return {
    title: conference.title.ar || conference.title.en,
    description:
      conference.shortDescription.ar ||
      conference.shortDescription.en ||
      conference.description.ar,
  };
}

export default async function ConferencePage({ params }: Props) {
  const { id } = await params;
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
      <Footer />
    </>
  );
}
