import type { Metadata } from "next";
import OliverPortfolio from "../../OliverPortfolio";
import { getCurrentPortfolioAge } from "../../../lib/current-age.server";
import {
  ENGLISH_DESCRIPTION,
  ENGLISH_TITLE,
  localeAlternates,
  reviewRobots,
} from "../../site-metadata";

export const metadata: Metadata = {
  title: ENGLISH_TITLE,
  description: ENGLISH_DESCRIPTION,
  robots: reviewRobots,
  alternates: {
    canonical: "/en/",
    languages: localeAlternates("/en/", "/zh-hant/"),
  },
  openGraph: {
    type: "website",
    url: "/en/",
    title: ENGLISH_TITLE,
    description: ENGLISH_DESCRIPTION,
    siteName: "Oliver YEUNG",
    locale: "en_HK",
    alternateLocale: ["zh_HK"],
    images: [
      {
        url: "/social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "A gentle illustration of a sunlit meadow with a rainbow, a tree, balloons and a small dog.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ENGLISH_TITLE,
    description: ENGLISH_DESCRIPTION,
    images: [
      {
        url: "/social-preview.jpg",
        alt: "A gentle illustration of a sunlit meadow with a rainbow, a tree, balloons and a small dog.",
      },
    ],
  },
};

export default function EnglishPortfolio() {
  const age = getCurrentPortfolioAge();

  return (
    <OliverPortfolio
      initialLocale="en"
      age={age?.english ?? null}
    />
  );
}
