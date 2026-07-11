import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Oliver YEUNG｜昊熹的成長故事",
    template: "%s｜Oliver YEUNG",
  },
  description: "由昊熹的爸爸媽媽整理的私人雙語成長故事，記錄日常探索、學習故事與家庭時光。",
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

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-HK">
      <body>{children}</body>
    </html>
  );
}
