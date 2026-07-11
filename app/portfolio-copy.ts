export type PortfolioLocale = "en" | "zh";

type PortfolioCopy = {
  lang: "en-HK" | "zh-Hant-HK";
  skip: string;
  wordmarkLabel: string;
  nav: {
    home: string;
    stories: string;
    growth: string;
    family: string;
  };
  controls: {
    languages: string;
    selected: string;
    menu: string;
    closeMenu: string;
    summary: string;
    print: string;
    printLabel: string;
    home: string;
  };
  hero: {
    eyebrow: string;
    greeting: string;
    greetingLead: string;
    greetingRest: string;
    intro: string;
    storiesAction: string;
    ageLabel: string;
  };
  principles: Array<{
    title: string;
    description: string;
  }>;
  privacy: {
    eyebrow: string;
    title: string;
    body: string;
    link: string;
  };
  footer: {
    updated: string;
    top: string;
  };
  summary: {
    eyebrow: string;
    title: string;
    intro: string;
    updated: string;
  };
};

export const localePaths: Record<
  PortfolioLocale,
  { home: string; summary: string }
> = {
  en: { home: "/en/", summary: "/en/summary/" },
  zh: { home: "/zh-hant/", summary: "/zh-hant/summary/" },
};

export const portfolioCopy: Record<PortfolioLocale, PortfolioCopy> = {
  en: {
    lang: "en-HK",
    skip: "Skip to main content",
    wordmarkLabel: "Oliver YEUNG — return to the homepage",
    nav: {
      home: "Home",
      stories: "Learning Stories",
      growth: "Growing Over Time",
      family: "Family & Values",
    },
    controls: {
      languages: "Choose language",
      selected: "Selected language",
      menu: "Open menu",
      closeMenu: "Close menu",
      summary: "View one-page summary",
      print: "Print this page",
      printLabel: "Open the browser print dialog for this page",
      home: "Back to home",
    },
    hero: {
      eyebrow: "Oliver's little learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "A small collection of everyday moments showing how Oliver explores, connects and grows at his own pace.",
      storiesAction: "Explore Oliver's learning stories",
      ageLabel: "Oliver's current age",
    },
    principles: [
      {
        title: "Everyday moments",
        description: "Small moments, gathered with a thoughtful eye.",
      },
      {
        title: "At his own pace",
        description: "A gentle record of growing, without comparison.",
      },
      {
        title: "Shared with care",
        description: "Shared thoughtfully, with privacy kept in mind.",
      },
    ],
    privacy: {
      eyebrow: "Privacy",
      title: "A note about this portfolio",
      body:
        "This portfolio is shared by Oliver's parents. Please do not copy, download or redistribute its photographs or videos.",
      link: "Privacy",
    },
    footer: {
      updated: "Updated July 2026",
      top: "Back to top",
    },
    summary: {
      eyebrow: "One-page summary",
      title: "Oliver at a glance",
      intro:
        "A small collection of everyday moments showing how Oliver explores, connects and grows at his own pace.",
      updated: "Last updated 11 July 2026",
    },
  },
  zh: {
    lang: "zh-Hant-HK",
    skip: "跳至主要內容",
    wordmarkLabel: "Oliver YEUNG——返回首頁",
    nav: {
      home: "首頁",
      stories: "成長故事",
      growth: "成長軌跡",
      family: "家庭與價值觀",
    },
    controls: {
      languages: "選擇語言",
      selected: "已選語言",
      menu: "開啟選單",
      closeMenu: "關閉選單",
      summary: "查看一頁摘要",
      print: "列印本頁",
      printLabel: "開啟瀏覽器的本頁列印選項",
      home: "返回首頁",
    },
    hero: {
      eyebrow: "昊熹的小小成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro: "透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。",
      storiesAction: "閱讀昊熹的成長故事",
      ageLabel: "昊熹現在的年齡",
    },
    principles: [
      {
        title: "日常片段",
        description: "細心整理生活中的小片段。",
      },
      {
        title: "按自己的步伐",
        description: "溫柔記下成長，不作比較。",
      },
      {
        title: "用心分享",
        description: "用心分享每個片段，並把私隱放在心上。",
      },
    ],
    privacy: {
      eyebrow: "私隱",
      title: "關於本作品集",
      body: "本作品集由昊熹的爸爸媽媽整理。請勿複製、下載或轉載網站內的相片及影片。",
      link: "私隱",
    },
    footer: {
      updated: "更新日期：2026年7月",
      top: "返回頁首",
    },
    summary: {
      eyebrow: "一頁摘要",
      title: "昊熹的一頁摘要",
      intro: "透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。",
      updated: "最後更新：2026年7月11日",
    },
  },
};
