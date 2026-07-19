export type PortfolioLocale = "en" | "zh";

export type PortfolioPhotoName =
  | "portrait"
  | "family-care"
  | "about-world"
  | "about-reading"
  | "about-car"
  | "story-swimming"
  | "growth-firefighter"
  | "growth-pose";

type PhotoCopy = {
  name: PortfolioPhotoName;
  alt: string;
  caption: string;
};

type PlaceholderCopy = {
  label: string;
  detail: string;
};

type AboutField = {
  title: string;
  body: string;
  media: PhotoCopy | PlaceholderCopy;
};

type StoryMedia =
  | {
      kind: "video";
      videoId: string;
      title: string;
      caption: string;
      ratio: "video" | "portrait-video";
    }
  | ({
      kind: "photo";
      ratio: "landscape" | "portrait" | "wide";
    } & PhotoCopy);

type Story = {
  title: string;
  age: string;
  observation: string;
  noticed: string;
  support: string;
  reflection: string;
  tags: string[];
  media: StoryMedia[];
};

type GrowthMoment = {
  title: string;
  body: string;
  photo: PhotoCopy;
};

type PortfolioCopy = {
  lang: "en-HK" | "zh-Hant-HK";
  skip: string;
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
    playVideo: string;
    loadingVideo: string;
    openYouTube: string;
  };
  hero: {
    eyebrow: string;
    greeting: string;
    greetingLead: string;
    greetingRest: string;
    intro: string;
    ageLabel: string;
    portrait: PlaceholderCopy;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    mainPhoto: PhotoCopy;
    fields: AboutField[];
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
    items: Story[];
  };
  growth: {
    eyebrow: string;
    title: string;
    intro: string;
    everydayTitle: string;
    everydayIntro: string;
    everydayItems: Array<{ title: string; body: string }>;
    timelineTitle: string;
    timelineItems: Array<{ time: string; moment: string }>;
    portrait: PhotoCopy;
    recentTitle: string;
    recentIntro: string;
    recentMoments: GrowthMoment[];
  };
  family: {
    eyebrow: string;
    title: string;
    intro: string;
    valuesTitle: string;
    valuesBody: string;
    vignettes: Array<{ title: string; body: string }>;
    photo: PhotoCopy;
  };
  closing: {
    eyebrow: string;
    title: string;
    reflection: string;
    hope: string;
  };
  privacy: { body: string };
  footer: { updated: string; top: string };
};

export const localePaths: Record<PortfolioLocale, { home: string }> = {
  en: { home: "/en/" },
  zh: { home: "/zh-hant/" },
};

export const portfolioCopy: Record<PortfolioLocale, PortfolioCopy> = {
  en: {
    lang: "en-HK",
    skip: "Skip to main content",
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
      playVideo: "Play video",
      loadingVideo: "Loading video…",
      openYouTube: "Open this video on YouTube",
    },
    hero: {
      eyebrow: "Oliver's learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "This little collection follows the things that brighten Oliver's days—books, cars, dogs and little problems to solve—gently held within the love and companionship of the people around him.",
      ageLabel: "Oliver's current age",
      portrait: {
        label: "Oliver's new portrait is coming",
        detail:
          "When Mum and Dad have chosen the right photograph, it will take its place here.",
      },
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "Oliver's little world is full of things worth pausing for: a familiar book, a passing dog, a favourite vehicle, or a toy that invites one more try. Close by are the family routines that make every exploration feel safe, warm and shared.",
      mainPhoto: {
        name: "about-world",
        alt: "Nineteen-month-old Oliver looks towards the camera from inside a large green play vehicle.",
        caption:
          "At 19 months, Oliver pauses inside a colourful play vehicle during a family day out.",
      },
      fields: [
        {
          title: "Reading together",
          body:
            "Every day, Mum and Dad open a book with Oliver. He often chooses one from the shelf by himself; during story time at playgroup, he listens closely as the teacher reads. Books have become both a gentle family ritual and a little world he chooses to enter.",
          media: {
            name: "about-reading",
            alt: "Twelve-month-old Oliver sits close to an adult family member as they look at a board book together; the adult points to the page.",
            caption: "A quiet page shared together at 12 months.",
          },
        },
        {
          title: "Cars and dogs",
          body:
            "A passing car brings a cheerful “vroom vroom”; a dog brings a pointing finger and a bright “woof woof.” When Oliver plays with toy cars, he sends them along imagined routes and into little scenes of his own.",
          media: {
            name: "about-car",
            alt: "Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.",
            caption: "A happy moment behind the wheel at 17 months.",
          },
        },
        {
          title: "Working things out",
          body:
            "Oliver often begins by looking closely. When a toy does not respond as he expects, he pauses, tries another way and stays with the little puzzle; when it finally works, his happiness is easy to see.",
          media: {
            label: "A problem-solving moment to be added",
            detail:
              "A close photograph of Oliver's hands, the object and his quiet exploration will be added here.",
          },
        },
        {
          title: "Noticing and remembering",
          body:
            "Oliver recognises familiar family members and connects everyday belongings with the person they belong to. In these quiet little connections, Mum and Dad see how carefully he notices the people, objects and familiar patterns around him.",
          media: {
            label: "A noticing moment to be added",
            detail:
              "A natural photograph of Oliver pausing over a familiar person, object or everyday detail will be added here.",
          },
        },
      ],
    },
    stories: {
      eyebrow: "Learning Stories",
      title: "Everyday moments, held with care",
      intro:
        "These five stories begin with something small and real: a page turned, a request understood, a door opened, a piano revisited, or a little step into the water. Together, they show what Oliver did, how he responded and how his family stayed close beside him.",
      mediaNote:
        "Videos never play automatically. They load from YouTube only after you choose to play them.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we continue alongside him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "A page of his own",
          age: "18 months",
          observation:
            "Oliver looked through a book by himself, taking in each page at his own pace. When he was ready, he turned to the next page and continued looking.",
          noticed:
            "A reading rhythm shared every day was also becoming a quiet little journey Oliver could begin for himself.",
          support:
            "Books remain within easy reach. Mum and Dad continue reading with him each day, while leaving unhurried time for him to return to familiar pages by himself.",
          reflection:
            "When he returns to a book by himself, the pages we have shared together feel even more precious.",
          tags: ["Exploration", "Independence"],
          media: [
            {
              kind: "video",
              videoId: "kgPKylmVI7s",
              title:
                "Oliver looks through a book and turns the page by himself",
              caption:
                "At 18 months, Oliver looked through a book and turned to the next page by himself.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "Words that bring us together",
          age: "17–18 months",
          observation:
            "At 17 months, Oliver listened to a spoken request, found the named object and brought it to a family member. At 18 months, he listened to prompts and pointed to familiar body parts, Mum and Dad.",
          noticed:
            "In both moments, a few familiar words opened the way to a shared exchange: Oliver listened, looked and answered through action.",
          support:
            "His family continues weaving short, natural phrases into everyday routines, leaving a gentle pause for Oliver to respond in his own way.",
          reflection:
            "A few simple words can become a lovely moment of understanding and helping one another.",
          tags: ["Communication", "Relationships"],
          media: [
            {
              kind: "video",
              videoId: "1Fxx4dzHCFo",
              title:
                "Oliver listens to a request and brings a named item to a family member",
              caption:
                "At 17 months, Oliver found a named item and brought it to a family member.",
              ratio: "portrait-video",
            },
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              title:
                "Oliver listens and points to familiar people and body parts",
              caption:
                "At 18 months, Oliver listened to prompts and pointed to familiar body parts, Mum and Dad.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "A door, a handle, a little idea",
          age: "19 months",
          observation:
            "Oliver came to a closed door and explored the handle. With his hands busy and his attention on the task, he found the movement that opened it.",
          noticed:
            "An ordinary door became a small invitation to notice, try and connect one action with what happened next.",
          support:
            "His family offers safe everyday tasks and gives him time to test his own ideas before stepping in to help.",
          reflection:
            "The door opened, and an ordinary moment became a discovery we were glad to share beside him.",
          tags: ["Problem-solving", "Independence"],
          media: [
            {
              kind: "video",
              videoId: "9QrYnWYsVUQ",
              title: "Oliver works out how to open a door",
              caption:
                "At 19 months, Oliver explored the handle and found a way to open the door.",
              ratio: "video",
            },
          ],
        },
        {
          title: "The piano corner he always finds",
          age: "17 months",
          observation:
            "Whenever Oliver attends playgroup, he is drawn to the piano. This recorded moment shows him staying close to the instrument and exploring its sounds in his own way.",
          noticed:
            "His parents notice how naturally he returns to something that interests him, giving the sounds his quiet, steady attention.",
          support:
            "They continue making room for unhurried musical play, listening and responding warmly to the sounds Oliver discovers.",
          reflection:
            "Among all the corners at playgroup, the piano is one he chooses to find again and again.",
          tags: ["Creativity", "Exploration"],
          media: [
            {
              kind: "video",
              videoId: "2RE83LVmTVk",
              title: "Oliver explores the piano at playgroup",
              caption:
                "At 17 months, Oliver returned to the piano and explored the keys in his own way.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "A little step into the water",
          age: "19 months",
          observation:
            "During closely supervised swimming sessions, Oliver enjoyed moving through the water and took part in a short underwater experience. An adult remained close throughout.",
          noticed:
            "His parents saw Oliver's willingness to join the experience, held safely by the calm presence of the adult beside him.",
          support:
            "Water experiences remain closely supervised and responsive to Oliver's cues, with gentle encouragement and no pressure.",
          reflection:
            "We felt proud to see this little step, and grateful to be close enough to share it with him.",
          tags: ["Movement", "Exploration"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "Nineteen-month-old Oliver smiles in a swimming pool, with an adult close by.",
              caption:
                "Water play at 19 months, with an adult close by.",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "BxMkQkxApBg",
              title:
                "Oliver takes part in a closely supervised underwater swimming moment",
              caption:
                "At 19 months, Oliver took part in a short underwater swimming moment with an adult close by.",
              ratio: "portrait-video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "Everyday Growth",
      title: "Small steps, quietly gathering",
      intro:
        "Oliver's family journal keeps the little changes that might otherwise slip quietly past. Placed side by side, they show movement, curiosity and everyday participation gradually finding their place in his world.",
      everydayTitle: "Little moments that become part of the day",
      everydayIntro:
        "Four brief observations hold onto the texture of ordinary days—small actions that were easy to miss, but lovely to remember.",
      everydayItems: [
        {
          title: "Matching shapes",
          body:
            "At 14 months, Oliver placed a cylinder and a circle into openings that matched their shapes.",
        },
        {
          title: "Pouring between cups",
          body:
            "At 16 months, Oliver tried pouring from one cup into another, then returned to the action on another day.",
        },
        {
          title: "Joining tidy-up time",
          body:
            "At 17 months, after hearing “clean up,” Oliver helped place toys in the basket and cards into separate slots.",
        },
        {
          title: "Waving along the way",
          body:
            "Across familiar outings, Oliver waved to people around him and later joined shared farewells with a wave and “bye bye.”",
        },
      ],
      timelineTitle: "One step, then another",
      timelineItems: [
        {
          time: "10 months",
          moment:
            "Holding on with one or both hands, Oliver moved sideways for a few steps and shifted from crawling to sitting, then from sitting to standing.",
        },
        {
          time: "14 months",
          moment:
            "After standing without support, he began trying one or two independent steps.",
        },
        {
          time: "16 months",
          moment:
            "His family recorded him walking more steadily and beginning to explore stairs.",
        },
      ],
      portrait: {
        name: "portrait",
        alt: "A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.",
        caption:
          "A quiet portrait from 13 months, now held within his everyday story of growth.",
      },
      recentTitle: "Little moments from recent days",
      recentIntro:
        "A few family-day photographs bring us back to Oliver's playful everyday world—the expressions, interests and little poses that make each outing his own.",
      recentMoments: [
        {
          title: "A pose of his own",
          body:
            "At 18 months, Oliver raised one arm and offered the camera a pose of his own during a family outing.",
          photo: {
            name: "growth-pose",
            alt: "Eighteen-month-old Oliver stands with one arm raised, posing beside a display of colourful cartoon figures.",
            caption: "At 18 months, Oliver adds a playful pose of his own to a family day out.",
          },
        },
        {
          title: "A firefighter moment",
          body:
            "At 19 months, Oliver held a yellow firefighter helmet during an outing. Firefighters are among the roles that catch his interest, so Mum and Dad kept this bright little moment in their journal.",
          photo: {
            name: "growth-firefighter",
            alt: "Nineteen-month-old Oliver stands outdoors holding a yellow firefighter helmet.",
            caption: "A bright firefighter-themed moment at 19 months.",
          },
        },
      ],
    },
    family: {
      eyebrow: "Family & Care",
      title: "Growing within a circle of care",
      intro:
        "Oliver's days are held by many people who love him. Their time, attention and gentle care turn ordinary routines into the warm moments his family holds close.",
      valuesTitle: "The quiet things we treasure",
      valuesBody:
        "A book opened together, time freely given and a familiar person close by—these simple things shape the warmth of Oliver's everyday home life.",
      vignettes: [
        {
          title: "A book together, every day",
          body:
            "Oliver loves books, and each day Mum and Dad set aside time to sit close and read with him.",
        },
        {
          title: "A pair of slippers, a little invitation",
          body:
            "At 16 months, Oliver carried slippers to Mum and Dad and indicated that he wanted them to put them on. His parents kept this small, affectionate family invitation in their journal.",
        },
        {
          title: "Held by many loving hands",
          body:
            "From his earliest months, Oliver has grown among people who hold him gently, care for him and make time to stay close.",
        },
      ],
      photo: {
        name: "family-care",
        alt: "Four-month-old Oliver sits in a cushioned baby seat while several people gently support him with their hands.",
        caption:
          "At four months, several loving hands stayed close—a quiet picture of care and togetherness.",
      },
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Keeping these little days close",
      reflection:
        "Five learning stories, a handful of everyday observations and a gentle trail of growth now sit together in this journal.",
      hope:
        "Around Oliver are many people who love him, giving him a warm place from which to explore, connect and grow at his own pace.",
    },
    privacy: {
      body:
        "This portfolio has been lovingly gathered by Oliver's parents. Please help us care for these memories by not copying, downloading or redistributing its photographs or videos.",
    },
    footer: {
      updated: "Last updated: July 2026",
      top: "Back to top",
    },
  },
  zh: {
    lang: "zh-Hant-HK",
    skip: "跳到主要內容",
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
      playVideo: "播放影片",
      loadingVideo: "正在載入影片……",
      openYouTube: "在 YouTube 開啟這段影片",
    },
    hero: {
      eyebrow: "昊熹的成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro:
        "這裏輕輕收進昊熹日常裏喜歡的事：書本、車、小狗，還有一個個等他想辦法解開的小難題；每個片段，也有身邊家人的疼愛與陪伴。",
      ageLabel: "昊熹現在的年齡",
      portrait: {
        label: "昊熹的新近照稍後加入",
        detail: "爸爸媽媽選好最合適的一張後，便會把它放在這裏。",
      },
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "昊熹的小世界裏，總有值得停下來看一看的事：熟悉的書本、路過的小狗、喜歡的車，還有讓他再試一次的玩具。身邊熟悉的家庭日常，讓每次探索都有安心、溫暖的陪伴。",
      mainPhoto: {
        name: "about-world",
        alt: "19個月大的昊熹身處一架大型綠色玩樂車輛內，望向鏡頭。",
        caption: "19個月大，昊熹在家庭外出時走進色彩繽紛的玩樂車輛裏，留下這個小片段。",
      },
      fields: [
        {
          title: "親子共讀",
          body:
            "爸爸媽媽每天都會陪昊熹打開一本書。他平日會主動從書架拿書來看；在幼兒遊戲班聽故事時，也會專心聽老師說故事。書本既是一家人熟悉的溫暖日常，也是他會主動走進的小天地。",
          media: {
            name: "about-reading",
            alt: "12個月大的昊熹依偎在一位成年家人身旁一起看圖書，家人正指着書頁。",
            caption: "12個月大，一頁書、一段親近的共讀時光。",
          },
        },
        {
          title: "車和小狗",
          body:
            "車一出現，昊熹便會開心地說「嗚嗚」；小狗經過，他則會指着牠說「汪汪」。玩玩具車時，他會讓小車走上想像中的路線，一幕一幕延伸自己的小故事。",
          media: {
            name: "about-car",
            alt: "17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。",
            caption: "17個月大，和喜歡的車留下一個開心時刻。",
          },
        },
        {
          title: "專注解難",
          body:
            "探索玩具時，昊熹常會先停下來仔細看看。遇上未能立即解開的地方，他會換個方法再試，繼續和這道小難題相處；找到方法的一刻，那份開心總會自然流露。",
          media: {
            label: "解難小片段稍後加入",
            detail: "稍後會加入一張近距離相片，記下昊熹的雙手、眼前的物件，以及他安靜探索的一刻。",
          },
        },
        {
          title: "細心觀察",
          body:
            "昊熹認得熟悉的家人，也會把日常物品與它們的主人連繫起來。從這些安靜的小連結裏，爸爸媽媽看見他如何細心留意身邊的人、物件和熟悉的日常。",
          media: {
            label: "觀察小片段稍後加入",
            detail: "稍後會加入一張自然相片，記下昊熹停下來留意熟悉人物、物件或生活細節的一刻。",
          },
        },
      ],
    },
    stories: {
      eyebrow: "成長故事",
      title: "把日常片段，輕輕收進故事裏",
      intro:
        "五個故事，都從一件細小而真實的事情開始：翻過一頁書、聽懂一句說話、打開一道門、再次走近鋼琴，或在水裏踏出一小步。每個片段都記下昊熹做了甚麼、如何回應，以及家人怎樣陪在身旁。",
      mediaNote: "影片不會自動播放；只有在你選擇播放後，才會從 YouTube 載入。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何繼續陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "自己翻開下一頁",
          age: "18個月大",
          observation:
            "昊熹自己看書，按自己的步伐細看眼前的一頁。看完後，他自行翻到下一頁，再繼續看下去。",
          noticed:
            "每天一起建立的閱讀節奏，也慢慢成為昊熹可以自己展開的一段安靜小旅程。",
          support:
            "家中的書會繼續放在昊熹容易拿到的位置。爸爸媽媽每天陪他閱讀，也留一點從容時間，讓他自己再回到熟悉的書頁。",
          reflection:
            "看見昊熹自己再次走近書本，讓我們更珍惜曾經一起翻過的每一頁。",
          tags: ["探索", "自主"],
          media: [
            {
              kind: "video",
              videoId: "kgPKylmVI7s",
              title: "昊熹自己看書，並自行翻到下一頁",
              caption: "18個月大時，昊熹自己看書，並自行翻到下一頁。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "聽見，也回應",
          age: "17至18個月大",
          observation:
            "17個月大時，昊熹聽到家人的說話後，找到指定物件，再拿給家人。18個月大時，他亦會聽着說話，指出熟悉的身體部位，也指出爸爸和媽媽。",
          noticed:
            "在兩個片段裏，幾句熟悉的說話，打開了一次次溫暖交流：昊熹聽一聽、找一找，再用動作回應。",
          support:
            "家人會繼續把簡短自然的說話放進日常相處中，也輕輕停一停，等昊熹用自己的方式回應。",
          reflection:
            "幾句簡單的說話，也可以成為一家人互相明白、互相幫忙的窩心時刻。",
          tags: ["溝通", "相處"],
          media: [
            {
              kind: "video",
              videoId: "1Fxx4dzHCFo",
              title: "昊熹聽到說話後，把指定物件拿給家人",
              caption: "17個月大時，昊熹找到指定物件，再拿給家人。",
              ratio: "portrait-video",
            },
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              title: "昊熹聽着說話，指出熟悉的家人和身體部位",
              caption: "18個月大時，昊熹聽着說話，指出熟悉的身體部位，也指出爸爸和媽媽。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "一扇門，一個小辦法",
          age: "19個月大",
          observation: "昊熹來到關上的門前，伸手探索門柄。他把心思放在眼前的小任務上，最後找到了把門打開的動作。",
          noticed:
            "一道普通的門，成為一次小小邀請：看一看、試一試，再留意手上的動作帶來甚麼結果。",
          support:
            "在安全的日常小任務中，家人會先給昊熹時間嘗試自己的方法，需要時才從旁協助。",
          reflection:
            "門打開了，一個普通時刻也成為小小發現；我們很高興能陪在昊熹身旁。",
          tags: ["解難", "自主"],
          media: [
            {
              kind: "video",
              videoId: "9QrYnWYsVUQ",
              title: "昊熹想辦法把門打開",
              caption: "19個月大時，昊熹探索門柄，找到了把門打開的方法。",
              ratio: "video",
            },
          ],
        },
        {
          title: "總會走近的琴鍵",
          age: "17個月大",
          observation:
            "每次到幼兒遊戲班，昊熹總會走到鋼琴旁。這段短片記下他留在琴鍵旁，按自己的方式探索一個個聲音。",
          noticed:
            "爸爸媽媽留意到，遇上感興趣的事物時，昊熹總會自然地再次走近，把安靜而持續的專注放在一個個聲音上。",
          support:
            "爸爸媽媽會繼續留出從容的音樂遊戲時間，細心聽着，也溫暖回應昊熹親手發現的聲音。",
          reflection: "幼兒遊戲班裏有許多角落，鋼琴總是昊熹一次又一次走回去的地方。",
          tags: ["創作", "探索"],
          media: [
            {
              kind: "video",
              videoId: "2RE83LVmTVk",
              title: "昊熹在幼兒遊戲班探索鋼琴",
              caption: "17個月大時，昊熹再次走到鋼琴旁，按自己的方式探索琴鍵。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "水裏的一小步",
          age: "19個月大",
          observation:
            "在成人貼身照顧的游泳活動中，昊熹享受在水裏活動，也參與了一次短短的潛水體驗；整個過程都有成人在旁陪伴。",
          noticed:
            "爸爸媽媽看見昊熹願意參與，而身旁成人安穩的陪伴，也一直輕輕承托着這次體驗。",
          support:
            "水中活動會繼續在成人貼身照顧下進行，跟着昊熹的反應調整步伐，輕輕鼓勵，也不給壓力。",
          reflection:
            "看見這一小步，我們很為昊熹高興，也很珍惜能在身旁一起經歷。",
          tags: ["動作", "探索"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "19個月大的昊熹在泳池裏開心地笑，身旁有成人陪伴。",
              caption: "19個月大，在成人陪伴下享受水中時光。",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "BxMkQkxApBg",
              title: "昊熹在成人陪伴下潛進水裏",
              caption: "19個月大時，昊熹在成人陪伴下，參與了一次短短的潛水體驗。",
              ratio: "portrait-video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "日常成長",
      title: "把一點一滴，慢慢收進成長裏",
      intro:
        "爸爸媽媽的日常記錄，留住了一些很容易悄悄溜走的小轉變。把它們放在一起，便看見動作、好奇心和生活參與，一點一滴走進昊熹的世界。",
      everydayTitle: "慢慢走進日常的小片段",
      everydayIntro:
        "四段簡短觀察，留住平常日子裏的生活質感：動作雖小，卻值得好好記住。",
      everydayItems: [
        {
          title: "配對形狀",
          body: "14個月大時，昊熹把圓柱體和圓形放進相配的洞口。",
        },
        {
          title: "倒進另一杯",
          body: "16個月大時，昊熹嘗試把一隻杯裏的東西倒進另一隻杯，之後又在另一日重拾這個動作。",
        },
        {
          title: "一起收拾",
          body: "17個月大時，聽到「收拾好」後，昊熹幫忙把玩具放進籃子，也把字卡逐一放進不同格子。",
        },
        {
          title: "揮手問好",
          body: "在熟悉的外出日常中，昊熹會向身邊的人揮手；後來也會一邊揮手，一邊說「再見」，和大家一起好好道別。",
        },
      ],
      timelineTitle: "一步一步，慢慢走起來",
      timelineItems: [
        {
          time: "10個月大",
          moment: "昊熹扶着物件向旁邊走幾步，也開始在爬、坐和站之間轉換。",
        },
        {
          time: "14個月大",
          moment: "站穩之後，他開始嘗試獨自行一、兩步。",
        },
        {
          time: "16個月大",
          moment: "家人記下他走得更穩，也開始探索樓梯。",
        },
      ],
      portrait: {
        name: "portrait",
        alt: "13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。",
        caption: "13個月大時留下的一張安靜近照，如今也收進昊熹的日常成長故事裏。",
      },
      recentTitle: "近日裏的小小片段",
      recentIntro: "幾張家庭外出相片，把記錄帶回昊熹開心活潑的小世界：有他的表情、喜歡的事物，也有每次都不一樣的小姿勢。",
      recentMoments: [
        {
          title: "自己的小姿勢",
          body: "18個月大時，昊熹在家庭外出時舉起手臂，為鏡頭擺出自己的小姿勢。",
          photo: {
            name: "growth-pose",
            alt: "18個月大的昊熹站在色彩繽紛的卡通人物佈景旁，舉起一隻手臂擺姿勢。",
            caption: "18個月大，昊熹用自己的小姿勢，為家庭外出添上一點活潑。",
          },
        },
        {
          title: "小小消防員",
          body: "19個月大時，昊熹在一次外出活動中拿着黃色消防頭盔。消防員是會吸引他留意的角色之一，爸爸媽媽也把這個明亮的小片段收進記錄裏。",
          photo: {
            name: "growth-firefighter",
            alt: "19個月大的昊熹站在戶外，雙手拿着一頂黃色消防頭盔。",
            caption: "19個月大，一段明亮又有趣的消防主題小片段。",
          },
        },
      ],
    },
    family: {
      eyebrow: "家庭與陪伴",
      title: "在愛與陪伴中，一起長大",
      intro:
        "昊熹的日常，由許多疼愛他的人一起輕輕托住。大家付出的時間、專注和溫柔照顧，讓平常的日子也成為一家人珍惜的溫暖片段。",
      valuesTitle: "我們珍惜的小日常",
      valuesBody:
        "一起打開的書本、願意留給彼此的時間，還有熟悉的人在身旁——這些簡單小事，組成昊熹溫暖的家庭日常。",
      vignettes: [
        {
          title: "每天共讀一頁",
          body: "昊熹喜歡書本，爸爸媽媽每天都會留一段時間，坐在他身旁一起閱讀。",
        },
        {
          title: "一雙拖鞋的小邀請",
          body: "16個月大時，昊熹把拖鞋拿給爸爸媽媽，示意他們穿上。這份自然又親切的小邀請，也被爸爸媽媽好好記了下來。",
        },
        {
          title: "許多雙疼愛他的手",
          body: "從還是小寶寶的時候開始，昊熹已在許多人的溫柔承托、照顧和陪伴中慢慢長大。",
        },
      ],
      photo: {
        name: "family-care",
        alt: "4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正溫柔承托着他。",
        caption: "4個月大時，幾雙疼愛昊熹的手留在身旁，成為一幅關於照顧、安心與陪伴的安靜畫面。",
      },
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "把這些小日子，好好珍藏",
      reflection: "五個成長故事、一些日常觀察，還有一條溫柔延伸的成長軌跡，都在這份記錄裏相遇。",
      hope: "昊熹身邊有很多愛他的人，給他一個溫暖安心的起點，讓他按自己的步伐探索、與人連結，慢慢長大。",
    },
    privacy: {
      body: "本作品集由昊熹的爸爸媽媽用心整理。為了好好守護這些珍貴片段，請勿複製、下載或轉載網站內的相片及影片。",
    },
    footer: {
      updated: "最後更新：2026年7月",
      top: "返回頁首",
    },
  },
};
