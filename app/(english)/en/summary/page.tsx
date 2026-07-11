import type { Metadata } from "next";
import PortfolioSummary from "../../../PortfolioSummary";
import { getCurrentPortfolioAge } from "../../../../lib/current-age.server";
import {
  ENGLISH_DESCRIPTION,
  localeAlternates,
  reviewRobots,
} from "../../../site-metadata";

const title = "One-Page Summary | Oliver Yeung";

export const metadata: Metadata = {
  title,
  description: ENGLISH_DESCRIPTION,
  robots: reviewRobots,
  alternates: {
    canonical: "/en/summary/",
    languages: localeAlternates("/en/summary/", "/zh-hant/summary/"),
  },
  openGraph: {
    type: "website",
    url: "/en/summary/",
    title,
    description: ENGLISH_DESCRIPTION,
    siteName: "Oliver YEUNG",
    locale: "en_HK",
    alternateLocale: ["zh_HK"],
  },
  twitter: {
    card: "summary",
    title,
    description: ENGLISH_DESCRIPTION,
  },
};

export default function EnglishPortfolioSummary() {
  const age = getCurrentPortfolioAge();

  return (
    <PortfolioSummary
      initialLocale="en"
      age={age?.english ?? null}
    />
  );
}
