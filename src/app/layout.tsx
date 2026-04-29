import type { ReactNode } from "react";
import { headers } from "next/headers";
import { DM_Sans, Plus_Jakarta_Sans, Tajawal } from "next/font/google";

import "@/app/globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-satt-locale") === "en" ? "en" : "ar";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${arabic.variable}`}>
        {children}
      </body>
    </html>
  );
}
