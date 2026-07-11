import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Oliver YEUNG | A little learner's portfolio",
    template: "%s | Oliver YEUNG",
  },
  description:
    "A private bilingual collection of Oliver's everyday discoveries, learning stories and family moments.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F1",
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-HK">
      <body>{children}</body>
    </html>
  );
}
