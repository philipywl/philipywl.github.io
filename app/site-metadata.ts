import type { Metadata, Viewport } from "next";

export const SITE_ORIGIN = "https://oliveryeung.com";

export const ENGLISH_TITLE = "Oliver Yeung | A Little Learning Journey";
export const ENGLISH_DESCRIPTION =
  "A warm collection of everyday moments showing how Oliver explores, connects and grows at his own pace.";

export const CHINESE_TITLE = "昊熹｜小小成長旅程";
export const CHINESE_DESCRIPTION =
  "透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。";

export const reviewRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
};

export const sharedIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
  ],
  apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
};

export const sharedViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF9E6",
  colorScheme: "light",
};

export const sharedMetadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  robots: reviewRobots,
  referrer: "no-referrer",
  icons: sharedIcons,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
};

export function localeAlternates(englishPath: string, chinesePath: string) {
  return {
    "en-HK": englishPath,
    "zh-Hant-HK": chinesePath,
    "x-default": "/",
  };
}
