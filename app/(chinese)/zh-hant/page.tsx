import type { Metadata } from "next";
import OliverPortfolio from "../../OliverPortfolio";
import { getCurrentPortfolioAge } from "../../../lib/current-age.server";
import {
  CHINESE_DESCRIPTION,
  CHINESE_TITLE,
  localeAlternates,
  reviewRobots,
} from "../../site-metadata";

export const metadata: Metadata = {
  title: CHINESE_TITLE,
  description: CHINESE_DESCRIPTION,
  robots: reviewRobots,
  alternates: {
    canonical: "/zh-hant/",
    languages: localeAlternates("/en/", "/zh-hant/"),
  },
  openGraph: {
    type: "website",
    url: "/zh-hant/",
    title: CHINESE_TITLE,
    description: CHINESE_DESCRIPTION,
    siteName: "Oliver YEUNG",
    locale: "zh_HK",
    alternateLocale: ["en_HK"],
    images: [
      {
        url: "/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "一幅柔和的陽光草地插畫，畫面有彩虹、小樹、氣球和小狗仔。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CHINESE_TITLE,
    description: CHINESE_DESCRIPTION,
    images: [
      {
        url: "/social-preview.jpg",
        alt: "一幅柔和的陽光草地插畫，畫面有彩虹、小樹、氣球和小狗仔。",
      },
    ],
  },
};

export default function ChinesePortfolio() {
  const age = getCurrentPortfolioAge();

  return (
    <OliverPortfolio
      initialLocale="zh"
      age={age?.chinese ?? null}
    />
  );
}
