import type { Metadata } from "next";
import OliverPortfolio from "../../OliverPortfolio";

export const metadata: Metadata = {
  title: "A little learner's portfolio",
  description:
    "A private bilingual collection of Oliver's everyday discoveries, learning stories and family moments.",
  robots: { index: false, follow: false, nocache: true },
};

export default function EnglishPortfolio() {
  return <OliverPortfolio initialLocale="en" />;
}
