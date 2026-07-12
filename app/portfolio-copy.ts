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
    "Their reflection will stay close to those details, sharing what caught Oliver's attention and how he responded.",
  support:
    "Oliver's parents will describe how they responded at the time and what happened next.",
  reflection:
    "A brief note from home will share why this ordinary little moment felt worth keeping.",
  tags: ["Learning clue 01 · to be added", "Learning clue 02 · to be added"],
};

const chineseStoryText = {
  age: "當時幾個月大 · 稍後加入",
  observation: "爸爸媽媽會如實記下當時發生的事，以及親眼看見、親耳聽見的細節。",
  noticed: "爸爸媽媽會從當時親眼看見、親耳聽見的細節出發，分享甚麼引起昊熹注意，以及他如何回應。",
  support: "爸爸媽媽會根據真實片段，記下他們當時如何回應，以及之後發生的事。",
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
      family: "Family & Home",
    },
    controls: {
      languages: "Choose language",
      selected: "Current language",
      menu: "Menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Oliver's little learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "A small collection of everyday moments showing Oliver's love of books, cars, dogs and problem-solving, together with the care of the many people around him.",
      storiesAction: "Explore Oliver's learning stories",
      aboutAction: "Meet Oliver",
      ageLabel: "Oliver's current age",
    },
    preview: {
      badge: "A little preview",
      note:
        "This first collection begins with three family-chosen photographs and a few everyday interests. More stories and videos will be added only when Oliver's parents feel they are right to share.",
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
          "At four months, Oliver was gently held and supported by several people who love him—a quiet glimpse of the warmth around him.",
      },
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "Oliver's everyday world is shaped by a few simple things he genuinely enjoys: books, cars, dogs and problem-solving. His parents also share reading time with him every day, making books a familiar part of their time together.",
      fields: [
        {
          title: "Books, every day",
          body:
            "Oliver likes books, and his parents share reading time with him every day. It is a familiar part of their everyday time together.",
        },
        {
          title: "Cars",
          body:
            "Oliver likes cars. They are one of the simple, familiar interests in his everyday world.",
        },
        {
          title: "Dogs",
          body:
            "Oliver likes dogs, too. This simple interest is another part of his everyday world.",
        },
        {
          title: "Problem-solving",
          body:
            "Oliver likes problem-solving. It is another genuine interest that forms part of his everyday world.",
        },
      ],
    },
    stories: {
      eyebrow: "Learning Stories",
      title: "Everyday moments, told with care",
      intro:
        "Each story will stay close to what really happened: what Oliver did, how he responded, what his parents noticed and what happened next.",
      mediaNote:
        "Short videos will appear only where they help a moment unfold, each with a clear duration and bilingual caption. Nothing will play automatically.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we responded",
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
        "Three photographs now begin this gentle thread through time. Future observations will add familiar routines, moments of trying in his own way and the small changes Oliver's parents notice.",
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
          title: "Connecting in everyday moments",
          body:
            "A parent observation will share how Oliver notices and responds to the people around him, or joins in during a familiar family moment.",
        },
      ],
      timelineTitle: "Three moments over time",
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
      eyebrow: "Family & Home",
      title: "Growing together at home",
      intro:
        "Oliver is loved by many people. Around him are many caring hands, each adding warmth and companionship to the everyday moments his family holds close.",
      valuesTitle: "The everyday things we value",
      valuesBody:
        "Shared reading is part of every day at home. The time, attention and care of the people around Oliver give these familiar moments their warmth.",
      vignettes: [
        {
          title: "Reading together, every day",
          body:
            "Oliver likes books, and his parents make time to read with him every day.",
        },
        {
          title: "Many caring hands",
          body:
            "From his early months, Oliver has been surrounded by people who hold him gently and care for him with warmth.",
        },
      ],
      media: [
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
      title: "Holding close the little moments",
      reflection:
        "Oliver's parents will close the journal with a few words about the everyday moments they most want to hold close.",
      hope:
        "They will also add a hope in their own words, bringing the journal to a warm and personal close.",
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
      selected: "目前選用",
      menu: "選單",
      closeMenu: "關閉選單",
    },
    hero: {
      eyebrow: "昊熹的小小成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro:
        "透過一個個日常片段，記下昊熹喜歡看書、車、狗仔和解難的日常，也記下身邊許多人給他的疼愛與陪伴。",
      storiesAction: "閱讀昊熹的成長故事",
      aboutAction: "認識昊熹",
      ageLabel: "昊熹現在的年齡",
    },
    preview: {
      badge: "故事預覽",
      note:
        "這份成長記錄先由三張爸爸媽媽挑選的相片和幾項日常喜好開始；更多故事和影片，只會在爸爸媽媽認為適合分享時慢慢加入。",
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
        caption: "四個月大的昊熹，被幾雙溫柔的手輕輕扶着。這張相片留下了他被許多人疼愛和陪伴的溫暖一刻。",
      },
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "昊熹的日常，有幾份簡單而真實的喜好：看書、車、狗仔和解難。爸爸媽媽每天也會陪他一起閱讀，親子閱讀成為一家人日常相處的一部分。",
      fields: [
        {
          title: "每天一起看書",
          body: "昊熹喜歡看書，爸爸媽媽每天都會陪他一起閱讀。這段親子閱讀時間，是一家人日常相處的一部分。",
        },
        {
          title: "喜歡的車",
          body: "昊熹喜歡車。車是他日常小世界裏一個熟悉的興趣。",
        },
        {
          title: "喜歡狗仔",
          body: "昊熹也喜歡狗仔。這份簡單的喜愛，是他日常興趣的一部分。",
        },
        {
          title: "喜歡解難",
          body: "昊熹喜歡解難。這也是他日常興趣中很自然的一部分。",
        },
      ],
    },
    stories: {
      eyebrow: "成長故事",
      title: "用心記下每個日常片段",
      intro:
        "每個故事都會忠於當時真正發生的事：昊熹做了甚麼、如何回應、爸爸媽媽留意到甚麼，以及之後發生的事。",
      mediaNote:
        "短片只會在有助完整呈現故事時加入，並附上片長和中英文說明；所有影片都只會在訪客主動按下播放鍵後開始播放。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何回應",
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
        "三張相片先為這段成長軌跡揭開序幕；日後加入的真實觀察，會再串起熟悉日常、昊熹自己嘗試的小片段，以及爸爸媽媽留意到的細微轉變。",
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
          title: "與人相處的日常片段",
          body: "爸爸媽媽會記下一個熟悉的日常片段，分享昊熹如何留意和回應身邊的人，或如何參與其中。",
        },
      ],
      timelineTitle: "三個成長片段",
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
      title: "在家中，一起慢慢成長",
      intro:
        "昊熹身邊有很多疼愛他的人。一雙雙溫柔的手，為他的日常添上陪伴和暖意，也成為爸爸媽媽想好好珍藏的成長片段。",
      valuesTitle: "一家人珍惜的日常",
      valuesBody:
        "親子閱讀是家中每天都有的日常。身邊每一份時間、專注和照顧，都為這些熟悉片段添上暖意。",
      vignettes: [
        {
          title: "每天一起閱讀",
          body: "昊熹喜歡看書，爸爸媽媽每天都會留出時間陪他一起閱讀。",
        },
        {
          title: "許多溫柔的手",
          body: "從還是小寶寶的時候開始，昊熹身邊已有很多人溫柔地抱着他、陪伴他，給他滿滿的疼愛。",
        },
      ],
      media: [
        {
          label: "另一段家庭時光 · 3:2",
          detail: "第二張相片可記下另一段真實的家庭日常。",
          kind: "photo",
          ratio: "wide",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "珍惜日常裏的小片段",
      reflection:
        "爸爸媽媽會在最後寫下幾句心裏話，分享一路以來最想好好珍藏的日常片段。",
      hope:
        "最後，爸爸媽媽會用自己的說話寫下一份心願，為這份成長記錄添上一個溫暖的結尾。",
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
