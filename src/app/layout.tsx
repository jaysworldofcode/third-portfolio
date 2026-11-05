import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter, Syne } from "next/font/google";
import { meta, SITE_URL, theme } from "@/data/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { MotionProvider } from "@/components/ui/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const ogImages = meta.ogImage ? [meta.ogImage] : undefined;

/** Accent colours from site.json, exposed to the CSS variables in globals.css. */
const accentStyle = {
  "--accent": theme.accentColor,
  "--on-accent": theme.accentTextColor,
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: meta.title, template: `%s | ${meta.siteName}` },
  description: meta.description,
  applicationName: meta.siteName,
  authors: [{ name: meta.siteName, url: SITE_URL }],
  icons: meta.favicon ? { icon: meta.favicon } : undefined,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: meta.siteName,
    title: meta.title,
    description: meta.description,
    images: ogImages,
  },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: ogImages },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The inline script may switch data-theme before hydration, so React must accept the DOM value.
    <html lang="en" data-theme={theme.defaultMode} style={accentStyle} suppressHydrationWarning>
      <head>
        {theme.showToggle && <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />}
      </head>
      <body className={`${inter.variable} ${syne.variable} antialiased`}>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
