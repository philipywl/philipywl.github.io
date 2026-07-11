import type { Metadata, Viewport } from "next";
import "../globals.css";
import {
  ENGLISH_DESCRIPTION,
  ENGLISH_TITLE,
  localeAlternates,
  sharedMetadata,
  sharedViewport,
} from "../site-metadata";

export const metadata: Metadata = {
  ...sharedMetadata,
  title: ENGLISH_TITLE,
  description: ENGLISH_DESCRIPTION,
  alternates: {
    canonical: "/",
    languages: localeAlternates("/en/", "/zh-hant/"),
  },
  openGraph: {
    type: "website",
    url: "/",
    title: ENGLISH_TITLE,
    description: ENGLISH_DESCRIPTION,
    siteName: "Oliver YEUNG",
    locale: "en_HK",
    alternateLocale: ["zh_HK"],
  },
  twitter: {
    card: "summary",
    title: ENGLISH_TITLE,
    description: ENGLISH_DESCRIPTION,
  },
};

export const viewport: Viewport = sharedViewport;

export default function RootEntryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-HK">
      <body>{children}</body>
    </html>
  );
}
