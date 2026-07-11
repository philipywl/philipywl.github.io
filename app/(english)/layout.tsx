import type { Metadata, Viewport } from "next";
import "../globals.css";
import {
  ENGLISH_DESCRIPTION,
  ENGLISH_TITLE,
  sharedMetadata,
  sharedViewport,
} from "../site-metadata";

export const metadata: Metadata = {
  ...sharedMetadata,
  title: ENGLISH_TITLE,
  description: ENGLISH_DESCRIPTION,
};

export const viewport: Viewport = sharedViewport;

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-HK">
      <body>{children}</body>
    </html>
  );
}
