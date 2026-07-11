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
  reflection?: string;
  tags: string[];
  media: PreviewMedia[];
};

type PortfolioCopy = {
  lang: "en-HK" | "zh-Hant-HK";
  skip: string;
  wordmarkLabel: string;
  nav: {
    about: string;
    stories: string;
    growth: string;
    family: string;
  };
  controls: {
    languages: string;
    selected: string;
    menu: string;
    closeMenu: string;
    print: string;
    printLabel: string;
  };
  hero: {
    eyebrow: string;
    greeting: string;
    greetingLead: string;
    greetingRest: string;
    intro: string;
    storiesAction: string;
    aboutAction: string;
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
  stories: {
    eyebrow: string;
    title: string;
    intro: string;
    mediaNote: string;
    whatHappened: string;
    noticed: string;
    support: string;
    reflection: string;
    learningClues: string;
    items: StoryPreview[];
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
    vignettes: PreviewField[];
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
};

export const localePaths: Record<PortfolioLocale, { home: string }> = {
  en: { home: "/en/" },
  zh: { home: "/zh-hant/" },
};

const englishStoryText = {
  age: "Age when this happened",
  observation:
    "Oliver's parents will describe what happened, using the details they saw and heard.",
  noticed:
    "A short reflection will share what caught Oliver's attention and how he responded.",
  support:
    "His family will describe how they made time or space for the interest to continue.",
  reflection:
    "A personal sentence will explain why this small moment stayed with the family.",
  tags: ["Learning clue to be added", "Learning clue to be added"],
};

const chineseStoryText = {
  age: "當時的年齡",
  observation: "爸爸媽媽會在這裏記下當時看見和聽見的細節。",
  noticed: "簡短分享甚麼吸引了昊熹，以及他當時如何回應。",
  support: "爸爸媽媽會分享如何在日常中給他時間和空間繼續探索。",
  reflection: "爸爸媽媽會用一句話，分享這個小片段為何值得記住。",
  tags: ["學習線索稍後加入", "學習線索稍後加入"],
};

export const portfolioCopy: Record<PortfolioLocale, PortfolioCopy> = {
  en: {
    lang: "en-HK",
    skip: "Skip to main content",
    wordmarkLabel: "Oliver YEUNG — return to homepage",
    nav: {
      about: "Meet Oliver",
      stories: "Learning Stories",
      growth: "Everyday Growth",
      family: "Family & Values",
    },
    controls: {
      languages: "Choose language",
      selected: "Selected language",
      menu: "Open menu",
      closeMenu: "Close menu",
      print: "Print this page",
      printLabel: "Open the browser print dialog for this page",
    },
    hero: {
      eyebrow: "Oliver's little learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "A small collection of everyday moments showing how Oliver explores, connects and grows at his own pace.",
      storiesAction: "Explore Oliver's learning stories",
      aboutAction: "Meet Oliver",
      ageLabel: "Oliver's current age",
    },
    preview: {
      badge: "Content preview",
      note:
        "This preview shows how the finished journal will flow. Oliver's parents will gradually add the stories, photographs and videos they choose to share.",
      portrait: "Oliver's portrait",
      portraitDetail: "A portrait chosen by Oliver's parents will appear here.",
      photo: "Everyday portrait",
      supportingPhoto: "Second story photo",
      video: "Video moment",
      playLabel:
        "Video preview — a family-selected video will appear here and will never autoplay",
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "Oliver's parents will share the small things they notice in everyday life—what draws his attention, what he enjoys returning to and how he likes to take part.",
      fields: [
        {
          title: "What catches his attention",
          body:
            "Oliver's parents will share a few small things that naturally draw his interest.",
        },
        {
          title: "What he returns to",
          body:
            "The family will add activities and experiences Oliver genuinely enjoys revisiting.",
        },
        {
          title: "How he communicates and connects",
          body:
            "A short note will describe the languages around Oliver and the ways he expresses himself with others.",
        },
        {
          title: "How he joins everyday life",
          body:
            "His parents will share how Oliver approaches familiar routines, new spaces and shared experiences.",
        },
      ],
    },
    stories: {
      eyebrow: "Learning Stories",
      title: "Everyday moments, told with care",
      intro:
        "Each story will begin with what happened, followed by what Oliver's parents noticed and how they made room for the interest to continue.",
      mediaNote:
        "Short videos will sit beside the stories they belong to, with a clear duration and bilingual caption. Nothing will play automatically.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we continue supporting him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "Story title to be added 01",
          ...englishStoryText,
          media: [
            {
              label: "Story photo · 4:3",
              detail:
                "A photograph chosen by Oliver's parents will introduce this moment.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "Story title to be added 02",
          ...englishStoryText,
          media: [
            {
              label: "Story photo · 4:3",
              detail: "The first photograph will introduce the moment.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Second story photo · 4:3",
              detail: "A second photograph may show what happened next.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "Story title to be added 03",
          ...englishStoryText,
          media: [
            {
              label: "Story photo · 4:3",
              detail: "A still photograph may establish the setting.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Story video · 16:9",
              detail:
                "A family-selected video may preserve the movement or exchange in context.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "Story title to be added 04",
          ...englishStoryText,
          media: [
            {
              label: "Portrait story photo · 4:5",
              detail: "A portrait photograph may introduce this moment.",
              kind: "photo",
              ratio: "portrait",
            },
            {
              label: "Portrait story video · 9:16",
              detail:
                "A short vertical video may sit alongside the written observation.",
              kind: "video",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "Story title to be added 05",
          ...englishStoryText,
          media: [
            {
              label: "Story video · 16:9",
              detail:
                "A family-selected video may show one complete, meaningful moment.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "Everyday Growth",
      title: "Small steps in everyday life",
      intro:
        "As stories are added, this section will gather moments from familiar routines and the little changes Oliver's parents notice over time.",
      everydayTitle: "Taking part in everyday life",
      everydayItems: [
        {
          title: "Joining familiar routines",
          body:
            "Oliver's parents will describe a small moment from a routine he knows well.",
        },
        {
          title: "Trying something for himself",
          body:
            "A short observation will show something Oliver is beginning to try in his own way.",
        },
        {
          title: "Connecting and taking part",
          body:
            "A parent-written observation about how Oliver takes part or responds in a familiar situation will appear here.",
        },
      ],
      timelineTitle: "Small changes we have noticed",
      timelineItems: [
        {
          time: "Age or month to be added",
          moment: "A short family observation will appear here.",
        },
        {
          time: "Age or month to be added",
          moment: "A short family observation will appear here.",
        },
        {
          time: "Age or month to be added",
          moment: "A short family observation will appear here.",
        },
        {
          time: "Age or month to be added",
          moment: "A short family observation will appear here.",
        },
      ],
    },
    family: {
      eyebrow: "Family & Values",
      title: "Growing together at home",
      intro:
        "This space will be written by Oliver's parents, sharing the routines, conversations and time together that make up family life.",
      valuesTitle: "What matters in our family",
      valuesBody:
        "Oliver's parents will share a short reflection on the moments they genuinely value—perhaps reading together, time outdoors, kindness in small actions or familiar family routines.",
      vignettes: [
        {
          title: "Time together",
          body:
            "A small family moment—such as reading, talking or exploring together—will appear here.",
        },
        {
          title: "Room to explore and try",
          body:
            "A parent-written reflection about giving Oliver time and space to explore will appear here.",
        },
        {
          title: "Care and belonging",
          body:
            "A parent-written reflection about kindness, care or belonging will appear here.",
        },
      ],
      media: [
        {
          label: "Time together · 3:2",
          detail:
            "A family photograph chosen by Oliver's parents will appear here.",
          kind: "photo",
          ratio: "wide",
        },
        {
          label: "Another family moment · 3:2",
          detail:
            "A second photograph may show another part of everyday family life.",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "A note from home",
      title: "Growing, one small moment at a time",
      reflection:
        "Oliver's parents will close the journal with a few words about the moments they most want to remember.",
      hope:
        "They will also share a simple hope for the way Oliver continues to explore, connect and grow.",
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
  },
  zh: {
    lang: "zh-Hant-HK",
    skip: "跳至主要內容",
    wordmarkLabel: "Oliver YEUNG，返回首頁",
    nav: {
      about: "認識昊熹",
      stories: "成長故事",
      growth: "日常成長",
      family: "家庭與價值觀",
    },
    controls: {
      languages: "選擇語言",
      selected: "已選語言",
      menu: "開啟選單",
      closeMenu: "關閉選單",
      print: "列印本頁",
      printLabel: "開啟瀏覽器的本頁列印選項",
    },
    hero: {
      eyebrow: "昊熹的小小成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro:
        "透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。",
      storiesAction: "閱讀昊熹的成長故事",
      aboutAction: "認識昊熹",
      ageLabel: "昊熹現在的年齡",
    },
    preview: {
      badge: "內容預覽",
      note:
        "這個預覽展示完成後的閱讀節奏。爸爸媽媽會逐步加入親自挑選的故事、相片和影片。",
      portrait: "昊熹的主相片",
      portraitDetail: "日後會放上一張由爸爸媽媽挑選的昊熹近照。",
      photo: "日常近照",
      supportingPhoto: "第二張故事相片",
      video: "影片片段",
      playLabel:
        "影片預覽——日後會加入一段由爸爸媽媽挑選的影片，並且不會自動播放",
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "爸爸媽媽會在這裏分享日常中留意到的小事：甚麼會吸引昊熹、他喜歡一再回到哪些活動，以及他喜歡怎樣參與日常。",
      fields: [
        {
          title: "他會留意的事",
          body: "爸爸媽媽會分享一些自然吸引昊熹注意的日常小事。",
        },
        {
          title: "他一再回到的興趣",
          body: "爸爸媽媽會加入昊熹真正喜歡一再參與的活動和體驗。",
        },
        {
          title: "他如何表達及與人連繫",
          body: "爸爸媽媽會簡單分享昊熹身邊的語言，以及他與人表達和互動的方式。",
        },
        {
          title: "他如何參與日常",
          body: "爸爸媽媽會分享昊熹如何參與熟悉的日常、接觸新地方，以及和家人一起相處。",
        },
      ],
    },
    stories: {
      eyebrow: "成長故事",
      title: "用心記下每個日常片段",
      intro:
        "每個故事會先記下當時發生的事，再由爸爸媽媽分享他們留意到的細節，以及如何在日常中繼續陪伴。",
      mediaNote:
        "短片會放在相關故事旁邊，並附上片長和雙語說明；所有影片均不會自動播放。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何繼續陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "故事標題稍後加入 01",
          ...chineseStoryText,
          media: [
            {
              label: "故事相片 · 4:3",
              detail: "日後會由爸爸媽媽挑選一張相片，帶出這個片段。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "故事標題稍後加入 02",
          ...chineseStoryText,
          media: [
            {
              label: "故事相片 · 4:3",
              detail: "第一張相片會帶出當時的情境。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "第二張故事相片 · 4:3",
              detail: "第二張相片可補充接着發生的片段。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "故事標題稍後加入 03",
          ...chineseStoryText,
          media: [
            {
              label: "故事相片 · 4:3",
              detail: "日後可先用一張相片交代當時的環境。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "故事影片 · 16:9",
              detail: "爸爸媽媽可挑選一段影片，保留當時的動作或互動。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "故事標題稍後加入 04",
          ...chineseStoryText,
          media: [
            {
              label: "直向故事相片 · 4:5",
              detail: "日後可用一張直向相片帶出這個片段。",
              kind: "photo",
              ratio: "portrait",
            },
            {
              label: "直向故事影片 · 9:16",
              detail: "一段直向短片可與文字觀察放在一起。",
              kind: "video",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "故事標題稍後加入 05",
          ...chineseStoryText,
          media: [
            {
              label: "故事影片 · 16:9",
              detail: "爸爸媽媽可挑選一段影片，完整記下一個有意義的小片段。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "日常成長",
      title: "日常裏的一小步",
      intro:
        "故事逐步加入後，這裏會把熟悉日常中的小片段和爸爸媽媽一路留意到的轉變串連起來。",
      everydayTitle: "一起參與日常",
      everydayItems: [
        {
          title: "參與熟悉的生活習慣",
          body: "爸爸媽媽會分享一段昊熹熟悉的生活小片段。",
        },
        {
          title: "自己開始嘗試",
          body: "爸爸媽媽會記下一件昊熹正用自己的方式開始嘗試的小事。",
        },
        {
          title: "與人互動，一起參與",
          body: "爸爸媽媽會在這裏加入一段觀察，記下昊熹如何參與或回應一個熟悉的情境。",
        },
      ],
      timelineTitle: "我們留意到的小轉變",
      timelineItems: [
        {
          time: "年齡或月份稍後加入",
          moment: "爸爸媽媽會在這裏加入一段簡短的日常觀察。",
        },
        {
          time: "年齡或月份稍後加入",
          moment: "爸爸媽媽會在這裏加入一段簡短的日常觀察。",
        },
        {
          time: "年齡或月份稍後加入",
          moment: "爸爸媽媽會在這裏加入一段簡短的日常觀察。",
        },
        {
          time: "年齡或月份稍後加入",
          moment: "爸爸媽媽會在這裏加入一段簡短的日常觀察。",
        },
      ],
    },
    family: {
      eyebrow: "家庭與價值觀",
      title: "在家中一起成長",
      intro:
        "這裏會由爸爸媽媽寫下家庭中的日常節奏、相處時光，以及一家人一起經歷的小片段。",
      valuesTitle: "我們重視的家庭日常",
      valuesBody:
        "爸爸媽媽會在這裏分享他們真正重視的日常；可能是一起閱讀、到戶外走走、待人友善，或一家人熟悉的生活習慣。",
      vignettes: [
        {
          title: "一起相處的時光",
          body: "日後會加入一段一家人閱讀、傾談或一起探索的小片段。",
        },
        {
          title: "給他探索和嘗試的空間",
          body: "這裏會加入爸爸媽媽的分享，談談讓昊熹有時間和空間探索。",
        },
        {
          title: "關心與陪伴",
          body: "這裏會加入爸爸媽媽的分享，談談家庭日常中的關心、友善和彼此陪伴。",
        },
      ],
      media: [
        {
          label: "一起相處的時光 · 3:2",
          detail: "日後會放上一張由爸爸媽媽挑選的家庭相片。",
          kind: "photo",
          ratio: "wide",
        },
        {
          label: "另一段家庭時光 · 3:2",
          detail: "第二張相片可記下另一段一家人的日常。",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "在一個個小片段中慢慢成長",
      reflection:
        "爸爸媽媽會在這裏寫下一段說話，回想一路以來最想記住的小片段。",
      hope:
        "最後，他們會分享對昊熹繼續探索、與人相處和成長的一份簡單期望。",
    },
    privacy: {
      eyebrow: "私隱",
      title: "關於本作品集",
      body:
        "本作品集由昊熹的爸爸媽媽整理。請勿複製、下載或轉載網站內的相片及影片。",
      link: "私隱",
    },
    footer: {
      updated: "更新日期：2026年7月",
      top: "返回頁首",
    },
  },
};
