import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ConversionActions } from "@/components/layout/ConversionActions";
import { getDictionary, type SupportedLocale } from "@/i18n/server";
import { TranslationProvider } from "@/i18n/provider";
import { getSeoSettings } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const metadataBase = new URL(seo.siteUrl);

  return {
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`,
    },
    description: seo.description,
    metadataBase,
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
    alternates: {
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: seo.siteUrl,
      siteName: seo.title,
      images: [{ url: seo.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
  };
}

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const validLocale: SupportedLocale = locale === "en" ? "en" : "ar";
  const messages = await getDictionary(validLocale);

  return (
    <TranslationProvider locale={validLocale} messages={messages}>
      {children}
      <ConversionActions />
    </TranslationProvider>
  );
}
