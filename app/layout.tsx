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

export const metadata: Metadata = {
  title: config.appName,
  description: config.tagline || config.heroSubheadline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider theme={resolvedTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
