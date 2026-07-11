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
  age: "Age at the time · to be added",
  observation:
    "Oliver's parents will describe the moment through the small details they saw and heard.",
  noticed:
    "Their reflection will share what caught Oliver's attention and how he responded, staying close to what could be seen and heard in the moment.",
  support:
    "Oliver's parents will describe what they did next, staying close to the details of the real moment.",
  reflection:
    "A brief note from home will share why this ordinary little moment felt worth keeping.",
  tags: ["Learning clue 01 · to be added", "Learning clue 02 · to be added"],
};

const chineseStoryText = {
  age: "當時幾個月大 · 稍後加入",
  observation: "爸爸媽媽會如實記下當時發生的事，以及親眼看見、親耳聽見的細節。",
  noticed: "爸爸媽媽會按照當時看見和聽見的細節，分享甚麼引起昊熹注意，以及他如何回應。",
  support: "爸爸媽媽會按照真實片段，記下當時如何回應，以及之後如何繼續陪伴。",
  reflection: "爸爸媽媽會用一句話，記下這個日常小片段為何值得珍藏。",
  tags: ["學習線索 01 · 稍後加入", "學習線索 02 · 稍後加入"],
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
      family: "Family & Care",
    },
    controls: {
      languages: "Choose language",
      selected: "Current language",
      menu: "Open menu",
      closeMenu: "Close menu",
      print: "Print this page",
      printLabel: "Open the browser's print options for this page",
    },
    hero: {
      eyebrow: "Oliver's little learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "A small collection of everyday moments, gathered with care by Oliver's parents, showing how Oliver explores, connects and grows at his own pace.",
      storiesAction: "Explore Oliver's learning stories",
      aboutAction: "Meet Oliver",
      ageLabel: "Oliver's current age",
    },
    preview: {
      badge: "A little preview",
      note:
        "This preview shows the gentle rhythm of Oliver's finished journal. His parents will gradually add the stories, photographs and videos they feel are right to share.",
      portrait: "Oliver's portrait",
      portraitDetail: "A portrait chosen with care by Oliver's parents will appear here.",
      photo: "An everyday portrait",
      supportingPhoto: "Second story photo",
      video: "Video moment",
      playLabel:
        "Video preview — a short moment chosen by Oliver's parents will appear here and will not play automatically",
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "Here, Oliver's parents will gather the little details that make his everyday world his own—what catches his eye, what he enjoys returning to and how he takes part in family life.",
      fields: [
        {
          title: "What sparks his curiosity",
          body:
            "His parents will share the everyday sights, sounds or activities that naturally draw Oliver in.",
        },
        {
          title: "What he enjoys returning to",
          body:
            "The family will add the activities and experiences Oliver genuinely chooses to revisit.",
        },
        {
          title: "How he shares and connects",
          body:
            "A short note will describe the languages around Oliver and the ways he reaches out, responds and shares a moment with others.",
        },
        {
          title: "How he takes part in family life",
          body:
            "His parents will share a real example of Oliver joining a familiar routine, discovering a new place with their support or sharing time together.",
        },
      ],
    },
    stories: {
      eyebrow: "Learning Stories",
      title: "Everyday moments, told with care",
      intro:
        "Each story will stay close to what really happened: what Oliver did, how he responded, what his parents noticed and how they chose to support the interest afterwards.",
      mediaNote:
        "Short videos will appear only where they help a moment unfold, each with a clear duration and bilingual caption. Nothing will play automatically.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we continue supporting him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "A learning story to come · 01",
          ...englishStoryText,
          media: [
            {
              label: "Story photo · 4:3",
              detail:
                "A photograph chosen with care by Oliver's parents will open this story.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "A learning story to come · 02",
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
              detail: "A second photograph may show how the moment unfolded.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "A learning story to come · 03",
          ...englishStoryText,
          media: [
            {
              label: "Story photo · 4:3",
              detail: "A photograph may set the scene before the story begins.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Story video · 16:9",
              detail:
                "A short, family-chosen video may preserve the movement or exchange as it happened.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "A learning story to come · 04",
          ...englishStoryText,
          media: [
            {
              label: "Portrait story photo · 4:5",
              detail: "A portrait photograph may open this story.",
              kind: "photo",
              ratio: "portrait",
            },
            {
              label: "Portrait story video · 9:16",
              detail:
                "A short vertical video may sit beside the written observation.",
              kind: "video",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "A learning story to come · 05",
          ...englishStoryText,
          media: [
            {
              label: "Story video · 16:9",
              detail:
                "A short, family-chosen video may hold one complete, meaningful moment.",
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
        "As observations are added, this section will gather familiar routines, moments of trying in his own way and the small changes Oliver's parents notice over time.",
      everydayTitle: "Everyday rhythms and small steps",
      everydayItems: [
        {
          title: "Sharing in familiar routines",
          body:
            "Oliver's parents will add a real example of how he takes part in a routine he knows well.",
        },
        {
          title: "Space to try in his own way",
          body:
            "Once a real moment is added, the observation will show how Oliver tried and how his parents responded.",
        },
        {
          title: "Connection through everyday moments",
          body:
            "A parent observation will show how Oliver responds, shares attention or joins others in a familiar family setting.",
        },
      ],
      timelineTitle: "Small changes we have noticed",
      timelineItems: [
        {
          time: "Earlier moment · age to be added",
          moment: "A familiar everyday observation will begin this gentle thread of change.",
        },
        {
          time: "A little later · age to be added",
          moment: "A later observation will share what felt new, different or more familiar.",
        },
        {
          time: "Another small step · age to be added",
          moment: "A family moment will show how Oliver responded to the people or world around him.",
        },
        {
          time: "Recent moment · age to be added",
          moment: "A recent parent observation will bring the story gently into the present.",
        },
      ],
    },
    family: {
      eyebrow: "Family & Care",
      title: "Growing together at home",
      intro:
        "Oliver's parents will use this space to share the everyday rhythms of home, time together and the real family moments they feel comfortable sharing.",
      valuesTitle: "The everyday things we value",
      valuesBody:
        "Oliver's parents will share the simple values that guide family life—perhaps making time for one another, reading together, enjoying the outdoors, offering room to explore and noticing kindness in everyday actions.",
      vignettes: [
        {
          title: "Time to be together",
          body:
            "Oliver's parents will choose a real moment of time together that they feel comfortable sharing.",
        },
        {
          title: "Room to explore, with support nearby",
          body:
            "Once a real moment is added, a parent reflection will share the setting around Oliver's exploration and how his parents responded.",
        },
        {
          title: "Care and being together",
          body:
            "A parent-selected family moment about care and being together will appear here.",
        },
      ],
      media: [
        {
          label: "Time together · 3:2",
          detail:
            "A family photograph chosen with care by Oliver's parents will appear here.",
          kind: "photo",
          ratio: "wide",
        },
        {
          label: "Another family moment · 3:2",
          detail:
            "A second photograph may hold another small piece of everyday family life.",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Holding close each small step",
      reflection:
        "Oliver's parents will close the journal with a few words about the everyday moments they most want to remember.",
      hope:
        "They will also add a hope written in their own words, bringing the journal to a gentle close.",
    },
    privacy: {
      eyebrow: "Privacy",
      title: "A note about this portfolio",
      body:
        "This portfolio is carefully gathered by Oliver's parents. To help protect his privacy, please do not copy, download or redistribute its photographs or videos. Thank you for understanding.",
      link: "Privacy",
    },
    footer: {
      updated: "Last updated · July 2026",
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
      family: "家庭與陪伴",
    },
    controls: {
      languages: "選擇語言",
      selected: "目前語言",
      menu: "開啟選單",
      closeMenu: "關閉選單",
      print: "列印本頁",
      printLabel: "開啟瀏覽器列印選項，列印本頁",
    },
    hero: {
      eyebrow: "昊熹的小小成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro:
        "透過一個個日常片段，輕輕記下昊熹如何探索、與人互動，並按自己的步伐慢慢成長。",
      storiesAction: "閱讀昊熹的成長故事",
      aboutAction: "認識昊熹",
      ageLabel: "昊熹現在的年齡",
    },
    preview: {
      badge: "故事預覽",
      note:
        "這個預覽展示昊熹的成長記錄完成後會如何展開。爸爸媽媽會慢慢加入親自挑選的文字、相片和影片，讓每個位置逐步盛載他們想珍藏的日常片段。",
      portrait: "昊熹的主相片",
      portraitDetail: "日後會放上一張由爸爸媽媽用心挑選的昊熹近照，帶大家走進他的日常小世界。",
      photo: "一張日常近照",
      supportingPhoto: "第二張故事相片",
      video: "故事影片",
      playLabel:
        "影片預覽——日後會加入一段由爸爸媽媽挑選的片段，只會在訪客主動按下播放時開始",
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "爸爸媽媽會在這裏分享日常裏的細微發現：甚麼吸引昊熹、哪些活動令他樂於再次探索，以及他如何在熟悉的家庭日常中與人連繫。",
      fields: [
        {
          title: "吸引他的日常小事",
          body: "爸爸媽媽會記下那些自然吸引昊熹注意、讓他願意多停留一會的日常小事。",
        },
        {
          title: "他喜歡再次探索的事",
          body: "爸爸媽媽會分享昊熹真正喜歡、願意再次參與的活動和體驗。",
        },
        {
          title: "他如何表達自己、與人連繫",
          body: "爸爸媽媽會分享昊熹日常接觸的語言，以及他如何用自己的方式表達和回應別人。",
        },
        {
          title: "他如何參與家庭日常",
          body: "爸爸媽媽會記下昊熹在熟悉的生活節奏、新環境和家庭時光中，如何按自己的方式參與。",
        },
      ],
    },
    stories: {
      eyebrow: "成長故事",
      title: "用心記下每個日常片段",
      intro:
        "每個故事都會忠於當時真正發生的事：昊熹做了甚麼、如何回應、爸爸媽媽留意到甚麼，以及之後如何在日常中繼續陪伴。",
      mediaNote:
        "短片只會在有助完整呈現故事時加入，並附上片長和中英文說明；所有影片都只會在訪客主動選擇時播放。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何繼續陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "成長故事 01 · 標題稍後加入",
          ...chineseStoryText,
          media: [
            {
              label: "故事相片 · 4:3",
              detail: "日後會由爸爸媽媽用心挑選一張相片，帶出這個小故事。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "成長故事 02 · 標題稍後加入",
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
              detail: "第二張相片可補充這個小故事如何繼續發展。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "成長故事 03 · 標題稍後加入",
          ...chineseStoryText,
          media: [
            {
              label: "故事相片 · 4:3",
              detail: "日後可先用一張相片，帶大家走進當時的情境。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "故事影片 · 16:9",
              detail: "爸爸媽媽可挑選一段短片，保留當時的動作或互動。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "成長故事 04 · 標題稍後加入",
          ...chineseStoryText,
          media: [
            {
              label: "直向故事相片 · 4:5",
              detail: "日後可用一張直向相片帶出這個小故事。",
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
          title: "成長故事 05 · 標題稍後加入",
          ...chineseStoryText,
          media: [
            {
              label: "故事影片 · 16:9",
              detail: "爸爸媽媽可挑選一段短片，完整保留一個值得珍藏的小片段。",
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
        "隨着成長記錄逐步豐富，這裏會串起熟悉的生活節奏、昊熹自己嘗試的小片段，以及爸爸媽媽一路用心留意到的細微轉變。",
      everydayTitle: "日常節奏與小小嘗試",
      everydayItems: [
        {
          title: "參與熟悉的日常",
          body: "爸爸媽媽會記下昊熹在熟悉的生活節奏中，自然參與的一個小片段。",
        },
        {
          title: "用自己的方式試一試",
          body: "加入真實片段後，爸爸媽媽會記下昊熹當時如何嘗試，以及他們如何回應。",
        },
        {
          title: "在相處中建立連繫",
          body: "爸爸媽媽會記下一個熟悉片段，分享昊熹如何留意、回應或參與身邊的人和事。",
        },
      ],
      timelineTitle: "我們留意到的小轉變",
      timelineItems: [
        {
          time: "較早的片段 · 年齡稍後加入",
          moment: "時間軸會從一段熟悉的日常觀察開始。",
        },
        {
          time: "稍後的片段 · 年齡稍後加入",
          moment: "較後的觀察會記下當時出現的新變化，或逐漸變得熟悉的事。",
        },
        {
          time: "另一小步 · 年齡稍後加入",
          moment: "一段家庭片段會補充昊熹如何回應身邊的人和事。",
        },
        {
          time: "近期片段 · 年齡稍後加入",
          moment: "近期觀察會把這條成長軌跡自然帶到現在。",
        },
      ],
    },
    family: {
      eyebrow: "家庭與陪伴",
      title: "在家中，一起慢慢成長",
      intro:
        "爸爸媽媽會在這裏親自寫下家中的日常節奏、彼此相處的時光，以及他們願意分享的真實家庭片段。",
      valuesTitle: "一家人珍惜的日常",
      valuesBody:
        "爸爸媽媽會在這裏分享一家人珍惜的日常；可能是為彼此留出時間、一起閱讀、到戶外走走、給昊熹空間探索，或在小事中互相照顧。",
      vignettes: [
        {
          title: "一起相處的時光",
          body: "爸爸媽媽會從真實的家庭日常中，挑選一段願意分享的相處時光放在這裏。",
        },
        {
          title: "給他探索，也在身旁陪伴",
          body: "加入真實片段後，爸爸媽媽會分享昊熹探索時的情境，以及他們當時如何回應。",
        },
        {
          title: "關心與彼此陪伴",
          body: "這裏會加入一段由爸爸媽媽挑選、關於家人互相關心和彼此陪伴的真實片段。",
        },
      ],
      media: [
        {
          label: "一起相處的時光 · 3:2",
          detail: "日後會放上一張由爸爸媽媽用心挑選的自然家庭相片。",
          kind: "photo",
          ratio: "wide",
        },
        {
          label: "另一段家庭時光 · 3:2",
          detail: "第二張相片可珍藏另一段真實而自然的家庭日常。",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "珍惜每一個小小成長片段",
      reflection:
        "爸爸媽媽會在最後寫下幾句心裏話，分享一路以來最想好好記住的日常片段。",
      hope:
        "最後，爸爸媽媽會加入一份親自寫下的心願，為這份成長記錄輕輕收結。",
    },
    privacy: {
      eyebrow: "私隱",
      title: "關於本作品集",
      body:
        "本作品集由昊熹的爸爸媽媽用心整理。為保護孩子的私隱，請勿複製、下載或轉載網站內的相片及影片。謝謝體諒。",
      link: "私隱",
    },
    footer: {
      updated: "最後更新 · 2026年7月",
      top: "返回頁首",
    },
  },
};
