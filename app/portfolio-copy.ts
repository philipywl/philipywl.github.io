export type PortfolioLocale = "en" | "zh";

type PreviewMedia = {
  label: string;
  detail: string;
  kind: "photo" | "video";
  ratio: "landscape" | "portrait" | "wide" | "video" | "portrait-video";
};

type PreviewField = {
  title: string;
  body: string;
};

type StoryPreview = {
  title: string;
  age: string;
  observation: string;
  noticed: string;
  support: string;
  reflection: string;
  tags: [string, string];
  media: PreviewMedia[];
};

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
  preview: {
    badge: string;
    note: string;
    portrait: string;
    portraitDetail: string;
    photo: string;
    supportingPhoto: string;
    video: string;
    playLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    fields: PreviewField[];
  };
  principles: Array<{
    title: string;
    description: string;
  }>;
  stories: {
    eyebrow: string;
    title: string;
    intro: string;
    whatHappened: string;
    noticed: string;
    support: string;
    reflection: string;
    learningClues: string;
    items: StoryPreview[];
  };
  videos: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{
      title: string;
      detail: string;
      ratio: "video" | "portrait-video";
    }>;
  };
  growth: {
    eyebrow: string;
    title: string;
    intro: string;
    everydayTitle: string;
    everydayItems: PreviewField[];
    timelineTitle: string;
    timelineItems: Array<{
      time: string;
      moment: string;
    }>;
  };
  family: {
    eyebrow: string;
    title: string;
    intro: string;
    valuesTitle: string;
    valuesBody: string;
    media: PreviewMedia[];
  };
  closing: {
    eyebrow: string;
    title: string;
    reflection: string;
    hope: string;
  };
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
    observationsTitle: string;
    observations: PreviewField[];
    storiesTitle: string;
    storyHighlights: string[];
    familyTitle: string;
    familyBody: string;
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
    preview: {
      badge: "Content preview",
      note:
        "This preview shows the intended rhythm and layout. Personal stories and media will be added only after the family supplies and reviews them.",
      portrait: "Portrait area",
      portraitDetail: "A 4:5 portrait will appear here.",
      photo: "Primary photo",
      supportingPhoto: "Supporting photo",
      video: "Video area",
      playLabel: "Video preview — playback will be available after an approved video is added",
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "A little about Oliver",
      intro:
        "This area will introduce Oliver through brief, parent-written observations rather than labels or scores.",
      fields: [
        {
          title: "Everyday character",
          body: "[Three or four short observations will appear here.]",
        },
        {
          title: "Favourite activities",
          body: "[Activities confirmed by the family will appear here.]",
        },
        {
          title: "Language exposure",
          body: "[A brief note about language exposure will appear here.]",
        },
        {
          title: "Ways of exploring",
          body: "[A brief note about how Oliver likes to explore will appear here.]",
        },
      ],
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
    stories: {
      eyebrow: "Learning Stories",
      title: "Everyday moments, told with care",
      intro:
        "Each story will pair one observed moment with a short parent reflection. The structure below previews the finished reading experience without making claims about Oliver.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we continue supporting him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "[Story title 01]",
          age: "[Age at the time]",
          observation: "[A short, factual observation of the moment will appear here.]",
          noticed: "[Two brief learning clues grounded in the observation.]",
          support: "[A one-sentence note on how the family supported this interest.]",
          reflection: "[A short reflection from Oliver's parents.]",
          tags: ["[Learning clue]", "[Learning clue]"],
          media: [
            {
              label: "Primary photo · 4:3",
              detail: "One meaningful photograph will lead this story.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "[Story title 02]",
          age: "[Age at the time]",
          observation: "[A short, factual observation of the moment will appear here.]",
          noticed: "[Two brief learning clues grounded in the observation.]",
          support: "[A one-sentence note on how the family supported this interest.]",
          reflection: "[A short reflection from Oliver's parents.]",
          tags: ["[Learning clue]", "[Learning clue]"],
          media: [
            {
              label: "Primary photo · 4:3",
              detail: "The first photograph will establish the moment.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Supporting photo · 4:3",
              detail: "A second photograph may show a meaningful sequence.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "[Story title 03]",
          age: "[Age at the time]",
          observation: "[A short, factual observation of the moment will appear here.]",
          noticed: "[Two brief learning clues grounded in the observation.]",
          support: "[A one-sentence note on how the family supported this interest.]",
          reflection: "[A short reflection from Oliver's parents.]",
          tags: ["[Learning clue]", "[Learning clue]"],
          media: [
            {
              label: "Video story · 16:9",
              detail: "An approved video may accompany this observation.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "[Story title 04]",
          age: "[Age at the time]",
          observation: "[A short, factual observation of the moment will appear here.]",
          noticed: "[Two brief learning clues grounded in the observation.]",
          support: "[A one-sentence note on how the family supported this interest.]",
          reflection: "[A short reflection from Oliver's parents.]",
          tags: ["[Learning clue]", "[Learning clue]"],
          media: [
            {
              label: "Portrait photo · 4:5",
              detail: "A portrait-oriented moment will appear here.",
              kind: "photo",
              ratio: "portrait",
            },
          ],
        },
      ],
    },
    videos: {
      eyebrow: "Moments in motion",
      title: "A calm home for future videos",
      intro:
        "Short videos will be added without autoplay. Each one will include a clear title, duration and bilingual caption.",
      items: [
        {
          title: "[Video title 01]",
          detail: "[Duration and a short description will appear here.]",
          ratio: "video",
        },
        {
          title: "[Video title 02]",
          detail: "[Duration and a short description will appear here.]",
          ratio: "portrait-video",
        },
        {
          title: "[Video title 03]",
          detail: "[Duration and a short description will appear here.]",
          ratio: "video",
        },
      ],
    },
    growth: {
      eyebrow: "Growing over time",
      title: "Everyday growth and small steps",
      intro:
        "This section will bring together confirmed examples of daily independence and a simple timeline of observed moments.",
      everydayTitle: "Everyday independence",
      everydayItems: [
        {
          title: "[An everyday routine]",
          body: "[A specific observation about joining a routine will appear here.]",
        },
        {
          title: "[A moment of participation]",
          body: "[A specific observation about taking part will appear here.]",
        },
        {
          title: "[A small independent step]",
          body: "[A specific observation, without comparison, will appear here.]",
        },
      ],
      timelineTitle: "A simple growth timeline",
      timelineItems: [
        { time: "[Age or month]", moment: "[A short observed moment.]" },
        { time: "[Age or month]", moment: "[A short observed moment.]" },
        { time: "[Age or month]", moment: "[A short observed moment.]" },
        { time: "[Age or month]", moment: "[A short observed moment.]" },
      ],
    },
    family: {
      eyebrow: "Family & Values",
      title: "The people and rhythms around Oliver",
      intro:
        "This section will hold a short family-written reflection about everyday values and shared time.",
      valuesTitle: "[Family values reflection]",
      valuesBody:
        "[A concise paragraph about shared reading, outdoor exploration, kindness or family routines will appear here once confirmed.]",
      media: [
        {
          label: "Shared moment · 3:2",
          detail: "A reviewed family photograph may appear here.",
          kind: "photo",
          ratio: "wide",
        },
        {
          label: "Shared moment · 3:2",
          detail: "A second photograph may show another meaningful routine.",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "A note from home",
      title: "Growing, one small moment at a time",
      reflection: "[A short closing reflection from Oliver's parents will appear here.]",
      hope: "[A simple hope for Oliver's continuing learning journey will follow.]",
    },
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
      observationsTitle: "Everyday observations",
      observations: [
        { title: "[Observation 01]", body: "[A brief, evidence-based observation.]" },
        { title: "[Observation 02]", body: "[A brief, evidence-based observation.]" },
        { title: "[Observation 03]", body: "[A brief, evidence-based observation.]" },
        { title: "[Observation 04]", body: "[A brief, evidence-based observation.]" },
      ],
      storiesTitle: "Story highlights",
      storyHighlights: [
        "[Story highlight 01]",
        "[Story highlight 02]",
        "[Story highlight 03]",
        "[Story highlight 04]",
      ],
      familyTitle: "Family & values",
      familyBody: "[A short family-values statement will appear here.]",
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
    preview: {
      badge: "內容預覽",
      note: "這個預覽展示將來的版面和閱讀節奏。個人故事及相片影片只會在爸爸媽媽整理並確認後加入。",
      portrait: "主相片位置",
      portraitDetail: "日後會在這裏加入一張4:5直向相片。",
      photo: "主要相片",
      supportingPhoto: "補充相片",
      video: "影片位置",
      playLabel: "影片預覽——加入已確認的影片後才可播放",
    },
    about: {
      eyebrow: "認識昊熹",
      title: "關於昊熹的一點點",
      intro: "這個部分會以爸爸媽媽的簡短日常觀察來介紹昊熹，不使用標籤、分數或比較。",
      fields: [
        { title: "日常性格觀察", body: "[三至四項簡短觀察將會放在這裏。]" },
        { title: "喜愛的活動", body: "[爸爸媽媽確認後的活動將會放在這裏。]" },
        { title: "語言接觸", body: "[簡短的語言接觸說明將會放在這裏。]" },
        { title: "探索方式", body: "[昊熹日常探索方式的說明將會放在這裏。]" },
      ],
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
    stories: {
      eyebrow: "成長故事",
      title: "用心記下每個日常片段",
      intro: "每個故事會結合一段具體觀察和爸爸媽媽的簡短回想。以下版面只預覽將來的閱讀效果，並不代表昊熹的實際經歷。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何繼續陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "[故事標題 01]",
          age: "[拍攝時年齡]",
          observation: "[一段簡短而具體的日常觀察將會放在這裏。]",
          noticed: "[兩項從觀察中整理出的簡短學習線索。]",
          support: "[爸爸媽媽如何繼續陪伴這份興趣的一句說明。]",
          reflection: "[爸爸媽媽的一句觀察或回想。]",
          tags: ["[學習線索]", "[學習線索]"],
          media: [
            {
              label: "主要相片 · 4:3",
              detail: "以一張有意義的相片帶出故事。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "[故事標題 02]",
          age: "[拍攝時年齡]",
          observation: "[一段簡短而具體的日常觀察將會放在這裏。]",
          noticed: "[兩項從觀察中整理出的簡短學習線索。]",
          support: "[爸爸媽媽如何繼續陪伴這份興趣的一句說明。]",
          reflection: "[爸爸媽媽的一句觀察或回想。]",
          tags: ["[學習線索]", "[學習線索]"],
          media: [
            {
              label: "主要相片 · 4:3",
              detail: "第一張相片會交代當時的情境。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "補充相片 · 4:3",
              detail: "第二張相片可用來展示有意義的前後片段。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "[故事標題 03]",
          age: "[拍攝時年齡]",
          observation: "[一段簡短而具體的日常觀察將會放在這裏。]",
          noticed: "[兩項從觀察中整理出的簡短學習線索。]",
          support: "[爸爸媽媽如何繼續陪伴這份興趣的一句說明。]",
          reflection: "[爸爸媽媽的一句觀察或回想。]",
          tags: ["[學習線索]", "[學習線索]"],
          media: [
            {
              label: "影片故事 · 16:9",
              detail: "日後可加入一段已確認的影片補充觀察。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "[故事標題 04]",
          age: "[拍攝時年齡]",
          observation: "[一段簡短而具體的日常觀察將會放在這裏。]",
          noticed: "[兩項從觀察中整理出的簡短學習線索。]",
          support: "[爸爸媽媽如何繼續陪伴這份興趣的一句說明。]",
          reflection: "[爸爸媽媽的一句觀察或回想。]",
          tags: ["[學習線索]", "[學習線索]"],
          media: [
            {
              label: "直向相片 · 4:5",
              detail: "一個直向拍攝的日常片段會放在這裏。",
              kind: "photo",
              ratio: "portrait",
            },
          ],
        },
      ],
    },
    videos: {
      eyebrow: "動態片段",
      title: "讓將來的影片自然融入故事",
      intro: "短片不會自動播放。每段影片日後都會加入清楚的標題、長度及雙語說明。",
      items: [
        { title: "[影片標題 01]", detail: "[影片長度及簡短說明將會放在這裏。]", ratio: "video" },
        { title: "[影片標題 02]", detail: "[影片長度及簡短說明將會放在這裏。]", ratio: "portrait-video" },
        { title: "[影片標題 03]", detail: "[影片長度及簡短說明將會放在這裏。]", ratio: "video" },
      ],
    },
    growth: {
      eyebrow: "成長軌跡",
      title: "日常成長與一小步一小步",
      intro: "這個部分會整理經爸爸媽媽確認的日常自理例子，以及簡單清晰的成長時間線。",
      everydayTitle: "日常自理",
      everydayItems: [
        { title: "[一段日常習慣]", body: "[一項參與日常習慣的具體觀察將會放在這裏。]" },
        { title: "[一次參與日常的片段]", body: "[一項投入家庭日常的具體觀察將會放在這裏。]" },
        { title: "[一小步自理經驗]", body: "[一項不作比較的具體觀察將會放在這裏。]" },
      ],
      timelineTitle: "簡單的成長時間線",
      timelineItems: [
        { time: "[年齡或月份]", moment: "[一段簡短的成長觀察。]" },
        { time: "[年齡或月份]", moment: "[一段簡短的成長觀察。]" },
        { time: "[年齡或月份]", moment: "[一段簡短的成長觀察。]" },
        { time: "[年齡或月份]", moment: "[一段簡短的成長觀察。]" },
      ],
    },
    family: {
      eyebrow: "家庭與價值觀",
      title: "陪伴昊熹成長的人與日常",
      intro: "這個部分會放上一段由爸爸媽媽整理、關於日常價值觀和相處時光的簡短分享。",
      valuesTitle: "[家庭價值觀分享]",
      valuesBody: "[經確認後，可在這裏分享親子閱讀、戶外探索、待人友善或家庭日常。]",
      media: [
        {
          label: "家庭時光 · 3:2",
          detail: "日後可加入一張經確認的家庭相片。",
          kind: "photo",
          ratio: "wide",
        },
        {
          label: "家庭時光 · 3:2",
          detail: "第二張相片可以記下一段有意義的家庭日常。",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "在一個個小片段中慢慢成長",
      reflection: "[爸爸媽媽寫給昊熹的一段簡短成長回想將會放在這裏。]",
      hope: "[最後會以一句對昊熹往後成長旅程的簡單期望作結。]",
    },
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
      observationsTitle: "日常觀察",
      observations: [
        { title: "[觀察 01]", body: "[一項有具體根據的簡短觀察。]" },
        { title: "[觀察 02]", body: "[一項有具體根據的簡短觀察。]" },
        { title: "[觀察 03]", body: "[一項有具體根據的簡短觀察。]" },
        { title: "[觀察 04]", body: "[一項有具體根據的簡短觀察。]" },
      ],
      storiesTitle: "故事重點",
      storyHighlights: ["[故事重點 01]", "[故事重點 02]", "[故事重點 03]", "[故事重點 04]"],
      familyTitle: "家庭與價值觀",
      familyBody: "[簡短的家庭價值觀分享將會放在這裏。]",
      updated: "最後更新：2026年7月11日",
    },
  },
};
