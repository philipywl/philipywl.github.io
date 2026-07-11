import type { Metadata, Viewport } from "next";
import "../globals.css";
import {
  CHINESE_DESCRIPTION,
  CHINESE_TITLE,
  sharedMetadata,
  sharedViewport,
} from "../site-metadata";

export const metadata: Metadata = {
  ...sharedMetadata,
  title: CHINESE_TITLE,
  description: CHINESE_DESCRIPTION,
};

export const viewport: Viewport = sharedViewport;

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-HK">
      <body>{children}</body>
    </html>
  );
}
