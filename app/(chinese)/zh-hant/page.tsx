import type { Metadata } from "next";
import OliverPortfolio from "../../OliverPortfolio";

export const metadata: Metadata = {
  title: "昊熹的成長故事",
  description: "由昊熹的爸爸媽媽整理的私人雙語成長故事，記錄日常探索、學習故事與家庭時光。",
  robots: { index: false, follow: false, nocache: true },
};

export default function ChinesePortfolio() {
  return <OliverPortfolio initialLocale="zh" />;
}
