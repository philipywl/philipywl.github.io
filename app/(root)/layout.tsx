import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Oliver YEUNG | A little learner's portfolio",
  description:
    "Choose the English or Traditional Chinese version of Oliver's private review portfolio.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F1",
};

export default function RootEntryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-HK">
      <body>{children}</body>
    </html>
  );
}
