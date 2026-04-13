import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Tajawal } from "next/font/google";
import { cookies } from "next/headers";

import "@/app/globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { resolveLocale } from "@/lib/i18n";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "الجمعية العلمية للعلاج الموجه",
    template: "%s | الجمعية العلمية للعلاج الموجه",
  },
  description:
    "الجمعية العلمية للعلاج الموجه توفر منصة للتعليم الطبي المستمر وتبادل الخبرات ودعم الأبحاث في مجال الأورام والعلاج الموجه.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "الجمعية العلمية للعلاج الموجه",
    description:
      "الجمعية العلمية للعلاج الموجه توفر منصة للتعليم الطبي المستمر وتبادل الخبرات ودعم الأبحاث.",
    type: "website",
    url: siteUrl,
    siteName: "الجمعية العلمية للعلاج الموجه",
  },
  twitter: {
    card: "summary_large_image",
    title: "الجمعية العلمية للعلاج الموجه",
    description:
      "الجمعية العلمية للعلاج الموجه توفر منصة للتعليم الطبي المستمر وتبادل الخبرات ودعم الأبحاث.",
  },
};

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
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
