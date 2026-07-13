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
    body: string;
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
      badge: "Stories taking shape",
      note:
        "Oliver's family journal has helped us select five real moments. Photographs and short videos will be added after his parents choose the right media; the labelled frames show how each story will appear.",
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
            "Every day, Oliver and his parents spend time reading together. He has begun pointing out familiar pictures, turning the pages into a quiet conversation they share.",
        },
        {
          title: "Cars",
          body:
            "Oliver likes cars—one of the familiar interests in his everyday world.",
        },
        {
          title: "Dogs",
          body:
            "Oliver notices dogs and has pointed them out with an imitated 'woof'—a small, cheerful connection between books and the world around him.",
        },
        {
          title: "Problem-solving",
          body:
            "Oliver enjoys exploring where things go, including simple matching play and looking for an object that has been gently hidden.",
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
          title: "Little discoveries in books",
          age: "17 months",
          observation:
            "During shared reading, Oliver pointed to familiar pictures in the book, including a car, a dog, a bird and other animals.",
          noticed:
            "His parents noticed how pointing allowed him to take part in the moment and share what he recognised.",
          support:
            "They continue reading together every day, pausing to follow what catches his attention and giving him time to respond.",
          reflection:
            "We treasure the little moments when a familiar picture becomes something we discover together.",
          tags: ["Communication", "Exploration"],
          media: [
            {
              label: "Shared-reading photograph to be added",
              detail:
                "A warm 4:3 photograph of Oliver reading with his parents will open this story.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Reading-together video to be added",
              detail:
                "An optional 20–30 second clip will show one natural exchange around the page.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "Listening and helping",
          age: "17 months",
          observation:
            "In one recorded moment, Oliver was asked—using words without gestures—to fetch an object and give it to a named person. He found it and carried it over.",
          noticed:
            "This simple request became a warm moment of listening, helping and connecting with another person.",
          support:
            "In moments like this, his parents use short, natural words and give him time to respond.",
          reflection:
            "It felt lovely to see words becoming part of how we help one another at home.",
          tags: ["Communication", "Relationships"],
          media: [
            {
              label: "Helping-at-home video to be added",
              detail:
                "A natural 20–30 second clip will show the spoken request, Oliver's response and the shared ending.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "Finding where each piece belongs",
          age: "14 months",
          observation:
            "During shape play, Oliver picked up a cylinder and a circle and placed each into an opening that matched.",
          noticed:
            "His parents noticed how the shape of each piece and the opening in front of him guided his action.",
          support:
            "Simple matching materials give Oliver another way to revisit this kind of exploration at his own pace.",
          reflection:
            "We enjoy watching him work things out quietly, one small piece at a time.",
          tags: ["Problem-solving", "Exploration"],
          media: [
            {
              label: "Shape-play photograph to be added",
              detail:
                "The first photograph will show the pieces and Oliver beginning to explore them.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Supporting sequence photograph to be added",
              detail:
                "A second photograph will show the piece meeting its matching opening.",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "Pouring from one cup to another",
          age: "16 months",
          observation:
            "Oliver tried pouring what was inside one cup into another. A few days later, his parents saw him line up the cups and pour again.",
          noticed:
            "Trying the familiar action again gave him another chance to adjust the way he held the containers and lined them up.",
          support:
            "Simple, safe pouring play gives Oliver room to revisit the action and try at his own pace.",
          reflection:
            "The small change from one attempt to the next reminded us to slow down and notice.",
          tags: ["Independence", "Problem-solving"],
          media: [
            {
              label: "Pouring photograph to be added",
              detail:
                "A side-angle photograph will keep Oliver's hands, expression and the full action in view.",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "Pouring video to be added",
              detail:
                "An optional 15–25 second clip will preserve the beginning, adjustment and ending.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "Waving along the way",
          age: "16–19 months",
          observation:
            "While out, Oliver repeatedly waved to people around him. Later, his parents recorded him saying 'bye bye' while waving and joining others in a shared farewell.",
          noticed:
            "The same small gesture became a warm response to the people he noticed around him.",
          support:
            "A warm response gives these everyday greetings time to unfold in Oliver's own way.",
          reflection:
            "A little wave has become one of the warm ways Oliver connects with the world around him.",
          tags: ["Relationships", "Communication"],
          media: [
            {
              label: "Greeting video to be added",
              detail:
                "A short natural clip will show one greeting or farewell without including unrelated faces.",
              kind: "video",
              ratio: "video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "Everyday Growth",
      title: "Small steps, gathered over time",
      intro:
        "Oliver's family journal holds small changes that are easy to miss from one day to the next. Together, they show how movement, curiosity and everyday participation have gradually found their place in his world.",
      everydayTitle: "Little moments of everyday participation",
      everydayIntro:
        "Three shorter observations add texture to the larger stories, each staying close to something Oliver actually did.",
      everydayItems: [
        {
          title: "Hidden—and found again",
          body:
            "At eight months, when an object disappeared from view, Oliver looked for it again.",
        },
        {
          title: "Joining tidy-up time",
          body:
            "At 17 months, after hearing 'clean up,' Oliver helped put toys in the basket and cards into separate slots.",
        },
        {
          title: "Taking part at the table",
          body:
            "At 16 months, Oliver drank from his straw cup and joined a familiar family 'cheers.'",
        },
      ],
      timelineTitle: "Growing into movement",
      timelineItems: [
        {
          time: "10 months",
          moment:
            "Holding on with one or both hands, Oliver moved sideways for a few steps and shifted from crawling to sitting, then from sitting to standing.",
        },
        {
          time: "14 months",
          moment: "After standing without support, he began trying one or two independent steps.",
        },
        {
          time: "16 months",
          moment: "His family recorded him walking more steadily and beginning to explore stairs.",
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
          title: "A small family invitation",
          body:
            "At 16 months, Oliver brought slippers to his parents and let them know he wanted them to put them on. His parents kept this natural, affectionate family moment in their journal.",
        },
        {
          title: "Loved by many people",
          body:
            "Since his early months, Oliver has been gently held and cared for by many loving people around him.",
        },
      ],
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Holding close the little moments",
      reflection:
        "This little journal now brings together five real stories, several everyday moments and a gentle timeline of growth.",
      hope:
        "Around Oliver are many people who love him, bringing warmth and companionship to the everyday world in which he explores and grows.",
    },
    privacy: {
      body:
        "This portfolio is carefully gathered by Oliver's parents. Please do not copy, download or redistribute its photographs or videos. Thank you for understanding.",
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
      badge: "故事正在成形",
      note:
        "爸爸媽媽從家庭日誌中挑選了五個真實片段。相片和短片會在爸爸媽媽選好合適素材後加入；現在的相片框，讓大家先看看每個故事日後的模樣。",
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
          body: "爸爸媽媽每天都會陪昊熹一起閱讀。他開始在書頁中指出熟悉的圖案，讓看書成為一家人之間安靜而溫暖的小對話。",
        },
        {
          title: "喜歡車",
          body: "昊熹喜歡車；車是他日常小世界裏熟悉的興趣之一。",
        },
        {
          title: "喜歡狗仔",
          body: "昊熹會留意狗仔，也曾指着狗仔模仿「汪汪」；書頁裏的圖案，就這樣與身邊的世界連在一起。",
        },
        {
          title: "喜歡解難",
          body: "昊熹喜歡探索物件應該放在哪裏，也會找尋被輕輕遮起來的東西；這些都是他日常解難遊戲的一部分。",
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
          title: "書頁裏的小發現",
          age: "17個月大",
          observation:
            "親子閱讀時，昊熹會指出書中熟悉的圖案，包括車、狗仔、雀仔和其他動物。",
          noticed:
            "爸爸媽媽留意到，他會用手指參與這段親子閱讀，也讓他們知道自己認出了甚麼。",
          support:
            "爸爸媽媽每天繼續陪他閱讀，跟着他的目光停一停，也給他時間用自己的方式回應。",
          reflection:
            "我們很珍惜這些時刻——一幅熟悉的圖畫，成為一家人共同發現的小驚喜。",
          tags: ["溝通", "探索"],
          media: [
            {
              label: "親子閱讀相片稍後加入",
              detail: "日後會用一張溫暖的4:3相片，記下昊熹與爸爸媽媽一起閱讀的片段。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "親子閱讀短片稍後加入",
              detail: "可加入一段20至30秒短片，完整記下書頁旁一次自然的小交流。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "聽一聽，一起幫忙",
          age: "17個月大",
          observation:
            "一次記錄中，大人只用說話、沒有配合手勢，請昊熹取來一件物件，再交給指定的人；他找到物件，並拿了過去。",
          noticed:
            "一個簡單的家庭請求，成為聆聽、幫忙和與人連結的溫暖日常片段。",
          support:
            "在這些日常互動中，爸爸媽媽會用簡短自然的說話，並給他時間回應。",
          reflection:
            "看見說話慢慢成為一家人互相幫忙的一部分，讓我們感到很窩心。",
          tags: ["溝通", "相處"],
          media: [
            {
              label: "日常幫忙短片稍後加入",
              detail: "日後會用一段20至30秒的自然片段，記下爸爸媽媽的說話、昊熹的回應和故事結尾。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "這一塊放哪裏？",
          age: "14個月大",
          observation:
            "玩形狀配對玩具時，昊熹拿起柱體和圓形，把它們放進相應的開口。",
          noticed:
            "爸爸媽媽看見他留意手中的形狀和眼前的開口，再決定下一個動作。",
          support:
            "簡單的配對材料，讓昊熹可以按自己的步伐，再次探索形狀與位置。",
          reflection:
            "我們喜歡在旁邊靜靜看着他，一小塊、一小塊地找出方法。",
          tags: ["解難", "探索"],
          media: [
            {
              label: "形狀遊戲相片稍後加入",
              detail: "第一張相片會拍下玩具和昊熹剛開始探索的時刻。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "連續相片稍後加入",
              detail: "第二張相片會記下形狀放進相應開口的一刻。",
              kind: "photo",
              ratio: "landscape",
            },
          ],
        },
        {
          title: "慢慢倒進另一隻杯",
          age: "16個月大",
          observation:
            "昊熹嘗試把一隻杯裏的東西倒進另一隻杯。幾天後，爸爸媽媽又看見他慢慢對準兩隻杯，再試一次。",
          noticed:
            "再次嘗試這個熟悉動作，讓他有機會調整握住容器的方式，也慢慢把兩者對準。",
          support:
            "簡單而安全的倒東西小遊戲，讓昊熹可以再次嘗試這個動作，並按自己的步伐探索。",
          reflection:
            "前後兩次嘗試之間的小變化，提醒我們放慢腳步，好好留意。",
          tags: ["自理", "解難"],
          media: [
            {
              label: "倒杯相片稍後加入",
              detail: "日後會從側面拍攝，讓雙手、表情和完整動作都清楚可見。",
              kind: "photo",
              ratio: "landscape",
            },
            {
              label: "倒杯短片稍後加入",
              detail: "可加入一段15至25秒短片，保留動作的開始、調整和結尾。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
        {
          title: "一路走，一路揮揮手",
          age: "16至19個月大",
          observation:
            "出街時，昊熹會一次又一次向身邊的人揮手。後來，爸爸媽媽亦記下他一邊說「bye bye」、一邊揮手，和大家一起道別。",
          noticed:
            "同一個小動作，慢慢成為他回應身邊人的溫暖方式。",
          support:
            "身邊人溫暖的回應，讓這些日常招呼可以按昊熹的步伐自然展開。",
          reflection:
            "一個小小的揮手，成為昊熹與身邊世界連結的溫暖方式。",
          tags: ["相處", "溝通"],
          media: [
            {
              label: "打招呼短片稍後加入",
              detail: "日後會用一段簡短自然的片段，記下一次招呼或道別，並避免拍到無關人士的正面。",
              kind: "video",
              ratio: "video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "日常成長",
      title: "日子裏慢慢累積的小步",
      intro:
        "家庭日誌記下了一些每天看來很細微的變化。放在一起，便看見昊熹如何慢慢把動作、好奇心和日常參與，放進自己的小世界。",
      everydayTitle: "日常參與的小片段",
      everydayIntro:
        "三段較短的真實觀察，為主要故事添上更多日常細節。",
      everydayItems: [
        {
          title: "不見了，再找出來",
          body: "8個月大時，眼前的物件消失後，昊熹會再去找它。",
        },
        {
          title: "一起收拾的日常",
          body: "17個月大時，聽到「clean up」後，昊熹幫忙把玩具放進籃子，也把字卡放進不同格格。",
        },
        {
          title: "一起參與餐桌時光",
          body: "16個月大時，昊熹用飲管杯飲奶，也會參與一家人熟悉的「cheers」。",
        },
      ],
      timelineTitle: "一步一步去探索",
      timelineItems: [
        {
          time: "10個月大",
          moment: "昊熹會用單手或雙手扶着站立，扶着橫行幾步，也會由爬行轉為坐下，再由坐下站起來。",
        },
        {
          time: "14個月大",
          moment: "在不用攙扶站立之後，他開始試着獨自行一兩步。",
        },
        {
          time: "16個月大",
          moment: "爸爸媽媽記下他漸漸走得更穩，也開始探索樓梯。",
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
          title: "一個小小的家庭邀請",
          body: "16個月大時，昊熹拿着拖鞋走到爸爸媽媽身邊，示意他們穿上。爸爸媽媽把這個自然又窩心的家庭片段記了下來。",
        },
        {
          title: "在許多人的疼愛中",
          body: "從還是小寶寶的時候開始，昊熹身邊已有很多疼愛他的人，溫柔地抱着他、照顧他、陪伴他。",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "珍惜日常裏的小片段",
      reflection:
        "這份成長記錄，現在收集了五個真實故事、幾段日常片段，以及一條慢慢延伸的成長軌跡。",
      hope:
        "昊熹身邊有很多疼愛他的人，讓他在溫暖的陪伴中探索日常、慢慢成長。",
    },
    privacy: {
      body:
        "這份作品集由昊熹的爸爸媽媽用心整理。請勿複製、下載或轉載當中的相片及影片。謝謝體諒。",
    },
    footer: {
      updated: "最後更新 · 2026年7月",
      top: "返回頁首",
    },
  },
};
