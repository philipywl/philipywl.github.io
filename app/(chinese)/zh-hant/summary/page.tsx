import type { Metadata } from "next";
import PortfolioSummary from "../../../PortfolioSummary";
import { getCurrentPortfolioAge } from "../../../../lib/current-age.server";
import {
  CHINESE_DESCRIPTION,
  localeAlternates,
  reviewRobots,
} from "../../../site-metadata";

const title = "一頁摘要｜昊熹";

export const metadata: Metadata = {
  title,
  description: CHINESE_DESCRIPTION,
  robots: reviewRobots,
  alternates: {
    canonical: "/zh-hant/summary/",
    languages: localeAlternates("/en/summary/", "/zh-hant/summary/"),
  },
  openGraph: {
    type: "website",
    url: "/zh-hant/summary/",
    title,
    description: CHINESE_DESCRIPTION,
    siteName: "Oliver YEUNG",
    locale: "zh_HK",
    alternateLocale: ["en_HK"],
  },
  twitter: {
    card: "summary",
    title,
    description: CHINESE_DESCRIPTION,
  },
};

export default function ChinesePortfolioSummary() {
  const age = getCurrentPortfolioAge();

  return (
    <PortfolioSummary
      initialLocale="zh"
      age={age?.chinese ?? null}
    />
  );
}
