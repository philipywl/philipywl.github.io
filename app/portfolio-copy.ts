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

type PhotoCopy = {
  alt: string;
  caption: string;
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

type PlannedStory = {
  title: string;
  format: string;
  note: string;
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
    supportingPhoto: string;
    video: string;
    playLabel: string;
  };
  photos: {
    hero: PhotoCopy;
    everyday: PhotoCopy;
    family: PhotoCopy;
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
    plannedTitle: string;
    plannedIntro: string;
    plannedItems: PlannedStory[];
  };
  growth: {
    eyebrow: string;
    title: string;
    intro: string;
    everydayTitle: string;
    everydayIntro: string;
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
  age: "Age will be added with the story",
  observation:
    "This space will hold the small details Oliver's parents saw and heard in the moment.",
  noticed:
    "Their reflection will share what caught Oliver's attention and how he responded, staying close to what really happened.",
  support:
    "The story will also show how Oliver's parents responded and stayed alongside him.",
  reflection:
    "A short note from home will share why this everyday moment felt worth keeping.",
  tags: ["Learning clue 01 · to be added", "Learning clue 02 · to be added"],
};

const chineseStoryText = {
  age: "故事加入時，會一併記下當時年齡",
  observation: "這裏會如實記下爸爸媽媽當時親眼看見、親耳聽見的小細節。",
  noticed: "爸爸媽媽會從真實細節出發，分享甚麼引起昊熹注意，以及他如何回應。",
  support: "故事亦會記下爸爸媽媽當時如何回應和陪伴。",
  reflection: "爸爸媽媽會用一句心裏話，記下這個日常片段為何值得珍藏。",
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
      selected: "currently selected",
      menu: "Menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Oliver's little learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "This little collection gathers everyday moments around the things Oliver enjoys—books, cars, dogs and problem-solving—and the loving care of the many people around him.",
      storiesAction: "Explore Oliver's learning stories",
      aboutAction: "Meet Oliver",
      ageLabel: "Oliver's current age",
    },
    preview: {
      badge: "A little preview",
      note:
        "This first collection brings together three photographs chosen by Oliver's parents and a few everyday interests. More stories and videos will be added gradually, whenever they feel a moment is right to share.",
      supportingPhoto: "Second story photo",
      video: "Video moment",
      playLabel:
        "Video preview — a short moment chosen by Oliver's parents will appear here and will not play automatically",
    },
    photos: {
      hero: {
        alt: "A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.",
        caption: "Oliver at 13 months",
      },
      everyday: {
        alt: "Eighteen-month-old Oliver smiling towards the camera in a bright indoor setting.",
        caption: "An everyday smile at 18 months",
      },
      family: {
        alt: "Four-month-old Oliver sitting in a cushioned baby seat while several people gently support him with their hands.",
        caption:
          "At four months, Oliver was gently supported by several loving hands—a quiet moment of care and closeness.",
      },
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "Books, cars, dogs and problem-solving are simple, genuine parts of Oliver's everyday world. Every day, he and his parents also share time with a book—a familiar rhythm of being together.",
      fields: [
        {
          title: "Books, every day",
          body:
            "Every day, Oliver and his parents spend time reading together. Books have become a familiar part of their time at home.",
        },
        {
          title: "Cars",
          body:
            "Oliver likes cars—one of the familiar interests in his everyday world.",
        },
        {
          title: "Dogs",
          body:
            "Oliver also likes dogs, another simple interest in his everyday world.",
        },
        {
          title: "Problem-solving",
          body:
            "Oliver also enjoys problem-solving as part of his everyday interests.",
        },
      ],
    },
    stories: {
      eyebrow: "Learning Stories",
      title: "Everyday moments, told with care",
      intro:
        "Each story will stay close to a real moment: what Oliver did, how he responded, what his parents noticed, and how they continued alongside him.",
      mediaNote:
        "When a short video helps tell the story, it will include a clear duration and bilingual caption. Videos will never play automatically.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we continued alongside him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "A new learning story · 01",
          ...englishStoryText,
          media: [
            {
              label: "Story photo",
              detail:
                "A photograph chosen with care by Oliver's parents will open this story.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
      ],
      plannedTitle: "Story spaces for moments still to come",
      plannedIntro:
        "These little spaces offer a glimpse of how the journal can grow, one real family-chosen moment at a time.",
      plannedItems: [
        {
          title: "Reading together",
          format: "Photo story",
          note: "A future photo story will hold one of Oliver's everyday reading moments with his parents.",
        },
        {
          title: "Cars & problem-solving",
          format: "Photo sequence",
          note: "Reserved for a real moment involving cars or problem-solving, chosen by Oliver's parents.",
        },
        {
          title: "Dogs",
          format: "Photo + short video",
          note: "Reserved for a real moment involving dogs, told with a photograph or short video.",
        },
        {
          title: "An everyday moment",
          format: "Short video",
          note: "Reserved for a future everyday moment chosen by Oliver's parents.",
        },
      ],
    },
    growth: {
      eyebrow: "Everyday Growth",
      title: "Small steps in everyday life",
      intro:
        "These three photographs begin a gentle thread through time. As real observations are added, they will gather familiar routines, small attempts and the changes Oliver's parents notice along the way.",
      everydayTitle: "Everyday rhythms and small steps",
      everydayIntro:
        "These three gentle prompts show where future everyday stories can grow, always beginning with a real moment.",
      everydayItems: [
        {
          title: "Sharing in familiar routines",
          body:
            "A future story will hold one familiar routine, just as it happens.",
        },
        {
          title: "Space to try in his own way",
          body:
            "A future story will notice what Oliver tries and how his parents respond in the moment.",
        },
        {
          title: "Connecting in everyday moments",
          body:
            "A future story will stay close to an everyday moment Oliver shares with someone around him.",
        },
      ],
      timelineTitle: "Three moments to treasure",
      timelineItems: [
        {
          time: "4 months",
          moment: "A family photograph holds a quiet moment of Oliver being gently supported by several loved ones.",
        },
        {
          time: "13 months",
          moment: "A portrait preserves Oliver's calm, direct look towards the camera.",
        },
        {
          time: "18 months",
          moment: "An everyday photograph catches Oliver smiling in the bright space around him.",
        },
      ],
    },
    family: {
      eyebrow: "Family & Care",
      title: "Growing together, surrounded by care",
      intro:
        "Oliver is loved by many people. Their time, attention and gentle care bring warmth to the everyday moments his family treasures.",
      valuesTitle: "The everyday things we value",
      valuesBody:
        "Shared reading is part of every day at home. The time and care offered by the people around Oliver make these familiar moments feel warm and close.",
      vignettes: [
        {
          title: "Reading together, every day",
          body:
            "Oliver likes books, and his parents make time to read with him every day.",
        },
        {
          title: "Many caring hands",
          body:
            "Since his early months, Oliver has been gently held and cared for by many loving people around him.",
        },
      ],
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Holding close the little moments",
      reflection:
        "This little journal begins with shared reading, familiar interests and three moments chosen with care.",
      hope:
        "Around Oliver are many people who love him, bringing warmth and companionship to the everyday world in which he explores and grows.",
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
      selected: "現正使用",
      menu: "選單",
      closeMenu: "關閉選單",
    },
    hero: {
      eyebrow: "昊熹的小小成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro:
        "這裏收集了一個個日常片段：昊熹喜歡看書、車、狗仔和解難，也在身邊許多人的疼愛與陪伴中慢慢成長。",
      storiesAction: "閱讀昊熹的成長故事",
      aboutAction: "認識昊熹",
      ageLabel: "昊熹現在的年齡",
    },
    preview: {
      badge: "故事預覽",
      note:
        "這份成長記錄先收錄三張爸爸媽媽挑選的相片和幾項日常喜好；更多故事和影片，會在爸爸媽媽認為適合分享時慢慢加入。",
      supportingPhoto: "第二張故事相片",
      video: "故事影片",
      playLabel:
        "影片預覽——日後會加入一段由爸爸媽媽挑選的片段，只會在訪客主動按下播放時開始",
    },
    photos: {
      hero: {
        alt: "13個月大的昊熹穿着藍色有領上衣，在白色背景前拍攝正面近照。",
        caption: "13個月大的昊熹",
      },
      everyday: {
        alt: "18個月大的昊熹在明亮的室內望向鏡頭微笑。",
        caption: "18個月大的日常笑臉",
      },
      family: {
        alt: "4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正輕輕扶着他。",
        caption: "4個月大的昊熹，被幾雙溫柔的手輕輕扶着，留下充滿照顧與親近感的一刻。",
      },
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "看書、車、狗仔和解難，都是昊熹日常裏簡單而真實的喜好。每天，他也會和爸爸媽媽一起閱讀；這段親子閱讀時間，成為一家人熟悉而溫暖的日常。",
      fields: [
        {
          title: "每天一起看書",
          body: "爸爸媽媽每天都會陪昊熹一起閱讀。看書，已成為一家人熟悉的日常。",
        },
        {
          title: "喜歡車",
          body: "昊熹喜歡車；車是他日常小世界裏熟悉的興趣之一。",
        },
        {
          title: "喜歡狗仔",
          body: "昊熹也喜歡狗仔；這份簡單的喜愛，也是他日常小世界的一部分。",
        },
        {
          title: "喜歡解難",
          body: "昊熹也喜歡解難；這是他日常興趣的一部分。",
        },
      ],
    },
    stories: {
      eyebrow: "成長故事",
      title: "用心記下每個日常片段",
      intro:
        "每個故事都會從一個真實片段出發：昊熹做了甚麼、如何回應、爸爸媽媽留意到甚麼，以及他們如何繼續陪伴。",
      mediaNote:
        "短片只會在有助完整呈現故事時加入，並附上片長和中英文說明；影片不會自動播放。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何繼續陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "新的成長故事 · 01",
          ...chineseStoryText,
          media: [
            {
              label: "故事相片",
              detail: "日後會由爸爸媽媽用心挑選一張相片，帶出這個小故事。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
      ],
      plannedTitle: "日後故事的幾個方向",
      plannedIntro:
        "這些小小位置，讓大家預視成長記錄日後可以怎樣延伸；每個故事，都會從爸爸媽媽挑選的真實片段開始。",
      plannedItems: [
        {
          title: "每天一起閱讀",
          format: "相片故事",
          note: "日後可用相片記下昊熹與爸爸媽媽每天一起閱讀的其中一個片段。",
        },
        {
          title: "車與解難",
          format: "連續相片",
          note: "留待爸爸媽媽日後挑選一個與車或解難有關的真實片段。",
        },
        {
          title: "狗仔",
          format: "相片＋短片",
          note: "留待日後用相片或短片，記下一個與狗仔有關的真實片段。",
        },
        {
          title: "日常片段",
          format: "短片",
          note: "留待爸爸媽媽日後挑選一個適合分享的真實日常片段。",
        },
      ],
    },
    growth: {
      eyebrow: "日常成長",
      title: "日常裏的一小步",
      intro:
        "三張相片先串起幾個不同時期的片段。日後加入的真實觀察，會再記下熟悉的生活節奏、昊熹的小小嘗試，以及爸爸媽媽沿途留意到的轉變。",
      everydayTitle: "日常節奏與小小嘗試",
      everydayIntro:
        "這三個小小方向，讓大家預視日後的日常故事可以怎樣延伸；每一個故事，都會從真實片段開始。",
      everydayItems: [
        {
          title: "參與熟悉的日常",
          body: "日後會如實記下一個熟悉的日常片段。",
        },
        {
          title: "用自己的方式試一試",
          body: "日後會記下昊熹如何嘗試，以及爸爸媽媽當時如何回應。",
        },
        {
          title: "與人相處的日常片段",
          body: "日後會記下一個昊熹與身邊人相處的真實日常片段。",
        },
      ],
      timelineTitle: "三個珍藏片段",
      timelineItems: [
        {
          time: "4個月大",
          moment: "一張家庭相片，留下昊熹被幾雙溫柔的手輕輕承托的一刻。",
        },
        {
          time: "13個月大",
          moment: "近照記下昊熹安靜望向鏡頭的神情。",
        },
        {
          time: "18個月大",
          moment: "一張日常相片，捕捉到昊熹在明亮室內望向鏡頭微笑的一刻。",
        },
      ],
    },
    family: {
      eyebrow: "家庭與陪伴",
      title: "在陪伴中，一起慢慢成長",
      intro:
        "昊熹身邊有很多疼愛他的人。他們付出的時間、專注和溫柔陪伴，為一家人珍惜的日常添上暖意。",
      valuesTitle: "一家人珍惜的日常",
      valuesBody:
        "親子閱讀是家中每天都有的日常。身邊每一份時間和照顧，都讓這些熟悉片段多一份親近與暖意。",
      vignettes: [
        {
          title: "每天一起閱讀",
          body: "爸爸媽媽每天都會陪昊熹一起閱讀，讓看書成為一家人熟悉的日常。",
        },
        {
          title: "許多溫柔的手",
          body: "從還是小寶寶的時候開始，昊熹身邊已有很多疼愛他的人，溫柔地抱着他、照顧他、陪伴他。",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "珍惜日常裏的小片段",
      reflection:
        "這份成長記錄，從每天一起閱讀、幾項熟悉的喜好，以及三個爸爸媽媽用心挑選的片段開始。",
      hope:
        "昊熹身邊有很多疼愛他的人，讓他在溫暖的陪伴中探索日常、慢慢成長。",
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
