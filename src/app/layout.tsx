import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { ConversionActions } from "@/components/layout/ConversionActions";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { resolveLocale } from "@/lib/i18n";
import { getSeoSettings } from "@/lib/seo";

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
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("site-lang")?.value);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`${sans.variable} ${display.variable} ${arabic.variable}`}>
        <LanguageProvider initialLocale={locale}>
          {children}
          <ConversionActions />
        </LanguageProvider>
      </body>
    </html>
  );
}
