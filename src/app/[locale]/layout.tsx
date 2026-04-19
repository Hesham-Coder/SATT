import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Tajawal } from "next/font/google";

import "@/app/globals.css";
import { ConversionActions } from "@/components/layout/ConversionActions";
import { getSeoSettings } from "@/lib/seo";
import { getDictionary, type SupportedLocale } from "@/i18n/server";
import { TranslationProvider } from "@/i18n/provider";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const arabic = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-arabic",
});

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
        ar: '/ar',
        en: '/en',
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

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  const validLocale = locale as SupportedLocale;
  const messages = await getDictionary(validLocale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`${sans.variable} ${display.variable} ${arabic.variable}`}>
        <TranslationProvider locale={validLocale} messages={messages}>
          {children}
          <ConversionActions />
        </TranslationProvider>
      </body>
    </html>
  );
}

