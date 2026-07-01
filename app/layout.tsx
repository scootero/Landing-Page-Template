import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import { getAppConfig } from "@/lib/appData";
import { resolveTheme } from "@/lib/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = getAppConfig();
const resolvedTheme = resolveTheme(config.theme);

const pageTitle = config.seo.title || config.appName;
const pageDescription =
  config.seo.description || config.tagline || config.heroSubheadline;

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: config.seo.keywords.length ? config.seo.keywords : undefined,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    images: config.seo.ogImageUrl ? [config.seo.ogImageUrl] : undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={resolvedTheme.style}
      data-mode={resolvedTheme.mode}
      style={resolvedTheme.cssVars as React.CSSProperties}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
