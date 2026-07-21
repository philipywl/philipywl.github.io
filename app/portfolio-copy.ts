export type PortfolioLocale = "en" | "zh";

export type PortfolioPhotoName =
  | "hero-portrait"
  | "portrait"
  | "family-care"
  | "family-main"
  | "family-origin"
  | "family-playful"
  | "about-world"
  | "about-reading"
  | "about-car"
  | "about-observing"
  | "story-swimming"
  | "story-animals"
  | "growth-firefighter"
  | "growth-supported"
  | "growth-swing";

type PhotoCopy = {
  name: PortfolioPhotoName;
  alt: string;
  caption: string;
};

type PlaceholderCopy = {
  label: string;
  detail: string;
};

type VideoPosterName =
  | "problem-solving"
  | "following-directions"
  | "body-and-family"
  | "reading-pages"
  | "water-step"
  | "piano-keys"
  | "feeding-rabbits";

type VideoCopy = {
  kind: "video";
  videoId: string;
  poster: VideoPosterName;
  title: string;
  caption: string;
  ratio: "video" | "portrait-video";
};

type AboutField = {
  title: string;
  body: string;
  media: PhotoCopy | PlaceholderCopy | VideoCopy;
};

type StoryMedia =
  | VideoCopy
  | ({
      kind: "photo";
      ratio: "landscape" | "portrait" | "wide";
    } & PhotoCopy);

type Story = {
  title: string;
  age: string;
  observation: string;
  noticed?: string;
  support: string;
  reflection: string;
  tags: string[];
  media: StoryMedia[];
};

type GrowthMilestone = {
  time: string;
  title: string;
  moment: string;
  photo?: PhotoCopy;
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
  };
  welcome: {
    message: string;
  };
  hero: {
    eyebrow: string;
    greeting: string;
    greetingLead: string;
    greetingRest: string;
    intro: string;
    ageLabel: string;
    portrait: PhotoCopy;
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
    milestonesTitle: string;
    milestonesIntro: string;
    milestones: GrowthMilestone[];
    portrait: PhotoCopy;
  };
  family: {
    eyebrow: string;
    title: string;
    intro: string;
    valuesTitle: string;
    valuesBody: string;
    vignettes: Array<{ title: string; body: string }>;
    photos: PhotoCopy[];
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
      stories: "Growth Milestones",
      growth: "Everyday Moments",
      family: "Family & Care",
    },
    controls: {
      languages: "Choose language",
      selected: "currently selected",
      menu: "Menu",
      closeMenu: "Close menu",
      playVideo: "Play video",
      loadingVideo: "Loading video…",
    },
    welcome: {
      message: "Welcome to Oliver's little world.",
    },
    hero: {
      eyebrow: "Oliver's learning journey",
      greeting: "“Hello, I'm Oliver.”",
      greetingLead: "“Hello,",
      greetingRest: "I'm Oliver.”",
      intro:
        "“I'd love to share the things that brighten my days: books, cars and dogs, little challenges, and time exploring the world with my family.”",
      ageLabel: "Oliver's current age",
      portrait: {
        name: "hero-portrait",
        alt: "Nineteen-month-old Oliver sits facing the camera in a studio portrait, wearing a white shirt and tan trousers.",
        caption: "A recent portrait of Oliver at 19 months.",
      },
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "“My little world is full of things that invite me to stop and explore: different books, passing dogs, fast-moving cars, and places or toys with a little challenge.” In the familiar rhythm of everyday life, the love and presence of family give Oliver room to discover small and interesting things around him.",
      mainPhoto: {
        name: "about-world",
        alt: "Nineteen-month-old Oliver sits inside a large green play car and points towards one of its wheels.",
        caption:
          "At 19 months, Oliver notices a familiar wheel and points towards it during a family day out.",
      },
      fields: [
        {
          title: "Reading together",
          body:
            "Oliver often chooses a book from the shelf and invites someone in the family to read with him. Mum and Dad also share a book with him every night before bed. During story time at playgroup, he listens closely to the teacher and follows each turn of the page. Books are both a warm family ritual and a little world he chooses to enter.",
          media: {
            name: "about-reading",
            alt: "Twelve-month-old Oliver sits close to Dad as they look at a board book together and Dad points to the page.",
            caption: "A quiet page shared with Dad at 12 months.",
          },
        },
        {
          title: "Working things out",
          body:
            "With a problem-solving toy in front of him, Oliver first pauses to look closely, then tries the moving parts with both hands. When one approach does not work straight away, he stays with it and tries another; the delight on his face when the toy responds is easy to see.",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "Oliver explores a problem-solving toy",
            caption:
              "At 19 months, Oliver tried the toy latch in different ways and gradually found how to release it.",
            ratio: "video",
          },
        },
        {
          title: "Noticing and remembering",
          body:
            "When Oliver sees familiar features in cartoon characters, he links them with people he knows well: glasses remind him of Dad, a bald head of Grandpa, short hair of Grandma and long hair of Mum. He also recognises Grandma's clothes and Dad's cup. These spontaneous connections show the small details he notices and remembers in everyday family life.",
          media: {
            name: "about-observing",
            alt: "Eighteen-month-old Oliver stands in front of a group of colourful cartoon figures, raising one arm to point towards them.",
            caption:
              "At 18 months, Oliver noticed familiar features in the cartoon figures and connected them with members of his family.",
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
      ],
    },
    stories: {
      eyebrow: "Growth Milestones",
      title: "Step by step, growing a little each day",
      intro:
        "These six stories begin with something small and real: following a simple request, pointing to familiar people and body parts, reaching gently towards an animal, taking a little step into the water, turning a page, or returning to the piano. Together, they show what Oliver did, how he responded and how his family stayed close beside him.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we stay alongside him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "Listening closely and following a request",
          age: "17 months",
          observation:
            "Oliver listened to a simple spoken request, found the named object and brought it to the family member who had been mentioned.",
          support:
            "His family continues weaving short, natural phrases into everyday routines, then leaves a gentle pause for Oliver to respond in his own way.",
          reflection:
            "Mum and Dad notice how Oliver often pauses, takes in the words, then responds through action.",
          tags: ["Listening & Responding", "Everyday Participation"],
          media: [
            {
              kind: "video",
              videoId: "1Fxx4dzHCFo",
              poster: "following-directions",
              title:
                "Oliver listens to a request and brings a named item to a family member",
              caption:
                "Oliver finds a named item and brings it to a family member.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "Recognising his body and family",
          age: "18 months",
          observation:
            "When he heard familiar words, Oliver pointed to his eyes, ears, mouth, nose and body. He also pointed to Mum and Dad when they were named.",
          support:
            "Mum and Dad continue naming people and body parts naturally through songs, picture books and everyday routines.",
          reflection:
            "A familiar word, a pointing finger and a shared smile turn simple naming into a warm family exchange.",
          tags: ["Recognising Body Parts", "Recognising Family"],
          media: [
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              poster: "body-and-family",
              title:
                "Oliver listens and points to familiar people and body parts",
              caption:
                "Oliver listens to simple prompts and points to familiar body parts as well as Mum and Dad.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "A gentle hello to the animals",
          age: "15–17 months",
          observation:
            "Mum and Dad took Oliver to Kadoorie Farm to see the animals. When he met an owl at close range, he reached out for a gentle touch. During another farm visit, he offered food to a rabbit and later began saying “rabbit” when he saw one.",
          support:
            "Mum and Dad continue offering calm, closely supervised encounters with nature—looking first, then moving closer at a pace that respects both Oliver and the animal.",
          reflection:
            "As his little hand reached out, it felt like a quiet hello to the natural world.",
          tags: ["Careful Observation", "Gentle Contact"],
          media: [
            {
              kind: "photo",
              name: "story-animals",
              alt: "Oliver is held between Mum and Dad beside an owl perched on a glove.",
              caption:
                "Oliver meets an owl at close range with Mum and Dad beside him.",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "rcpBdZzHJAk",
              poster: "feeding-rabbits",
              title: "Oliver offers food to a rabbit",
              caption:
                "Oliver offers food to a rabbit during a family outing.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "A brave step into the water",
          age: "19 months",
          observation:
            "During a swimming lesson with his family and coach close by, Oliver happily kicked in the water, tried to climb onto the pool edge and took part in a short underwater experience.",
          support:
            "His family and coach continue to follow Oliver's cues, adjusting the pace and offering positive encouragement within close, safe supervision so he can explore comfortably.",
          reflection:
            "Mum and Dad are happy to see him try, and value how familiar company helps him build confidence little by little.",
          tags: ["Movement in Water", "Willingness to Try"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "Oliver smiles while standing in a swimming pool, with an adult's hand close by.",
              caption:
                "Oliver stands smiling in the water with an adult close by.",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "BxMkQkxApBg",
              poster: "water-step",
              title:
                "Oliver takes part in a closely supervised underwater swimming moment",
              caption:
                "Oliver takes part in a short underwater swimming moment with an adult close by.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "Little hands turning page after page",
          age: "18 months",
          observation:
            "Oliver opened a book by himself and, at his own pace, looked closely at pictures of cars, bees and more. After finishing one page, he turned to the next by himself.",
          support:
            "A low shelf keeps picture books, Chinese and English books and reading-pen books within easy reach. Mum and Dad read with Oliver every night before bed, while also leaving quiet moments for him to explore books by himself.",
          reflection:
            "Mum and Dad treasure the way he chooses a book and looks through it with care; each page shared together is gradually becoming a little journey he can open for himself.",
          tags: ["Independent Book Exploration", "Focused Book Time"],
          media: [
            {
              kind: "video",
              videoId: "kgPKylmVI7s",
              poster: "reading-pages",
              title:
                "Oliver looks through a book and turns the page by himself",
              caption:
                "Oliver looks through a book and turns to the next page by himself.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "Returning to music",
          age: "17 months",
          observation:
            "Whenever Oliver attends playgroup, he is drawn to the piano. In this recorded moment, his fingers move across the keys as he stays close to the instrument and explores its sounds in his own way.",
          support:
            "Mum and Dad continue making room for unhurried musical play, listening and responding warmly to the sounds Oliver discovers.",
          reflection:
            "Among all the corners at playgroup, the piano is one he chooses to find again and again.",
          tags: ["Musical Exploration", "Returning to the Piano"],
          media: [
            {
              kind: "video",
              videoId: "2RE83LVmTVk",
              poster: "piano-keys",
              title: "Oliver explores the piano at playgroup",
              caption:
                "Oliver returns to the piano and explores the keys in his own way.",
              ratio: "portrait-video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "Everyday Moments",
      title: "Everyday pages, little steps",
      intro:
        "Mum and Dad record the small, real changes of everyday life: looking for a hidden object, moving with support, trying independent steps, matching shapes, pouring between cups, helping to tidy and waving goodbye. Seen together, they show Oliver gradually taking part in daily life with curiosity and his own two hands.",
      milestonesTitle: "Twelve everyday moments",
      milestonesIntro:
        "Gathered into one gentle path, these observations show movement, thinking, participation and connection becoming part of Oliver's ordinary days.",
      milestones: [
        {
          time: "8 months",
          title: "Looking for what disappeared",
          moment:
            "When an object disappeared from view, Oliver looked for it again.",
        },
        {
          time: "10 months",
          title: "Moving between positions",
          moment:
            "Holding on with one or both hands, Oliver moved sideways for a few steps and shifted from crawling to sitting, then from sitting to standing.",
        },
        {
          time: "12 months",
          title: "Standing hand in hand",
          moment:
            "During a family photograph, Oliver stood between Mum and Dad while they held his hands.",
          photo: {
            name: "growth-supported",
            alt: "One-year-old Oliver stands between Mum and Dad while each parent holds one of his hands.",
            caption: "Standing between Mum and Dad, Oliver met the moment hand in hand.",
          },
        },
        {
          time: "14 months",
          title: "Trying independent steps",
          moment:
            "After standing without support, he began trying one or two independent steps.",
        },
        {
          time: "14 months",
          title: "Matching shapes",
          moment:
            "Oliver placed a cylinder and a circle into openings that matched their shapes.",
        },
        {
          time: "16 months",
          title: "Steadier steps and stairs",
          moment:
            "His family recorded him walking more steadily and beginning to explore stairs.",
        },
        {
          time: "16 months",
          title: "Pouring between cups",
          moment:
            "Oliver tried pouring from one cup into another, then returned to the action on another day.",
        },
        {
          time: "16 months",
          title: "A straw cup and a family toast",
          moment:
            "Oliver drank milk from his straw cup and joined the family in a familiar toast.",
        },
        {
          time: "16 months",
          title: "A smile on the swing",
          moment:
            "Oliver held the toddler swing with both hands and met its gentle movement with a wide smile.",
          photo: {
            name: "growth-swing",
            alt: "Oliver smiles broadly while holding both sides of a toddler swing.",
            caption: "The gentle swing brought a bright smile to Oliver's face.",
          },
        },
        {
          time: "17 months",
          title: "Joining tidy-up time",
          moment:
            "After hearing “Clean up,” Oliver helped place toys in the basket and cards into separate slots.",
        },
        {
          time: "Along the way",
          title: "Waving Bye bye",
          moment:
            "Across familiar outings, Oliver waved to people around him and later joined shared farewells with a wave and “Bye bye.”",
        },
        {
          time: "19 months",
          title: "A firefighter moment",
          moment:
            "Oliver held a yellow firefighter helmet during an outing. Firefighters are among the roles that catch his interest, so Mum and Dad kept this bright little moment in their journal.",
          photo: {
            name: "growth-firefighter",
            alt: "Oliver stands outdoors holding a yellow firefighter helmet.",
            caption: "A bright firefighter-themed moment from a family outing.",
          },
        },
      ],
      portrait: {
        name: "portrait",
        alt: "A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.",
        caption:
          "A quiet portrait from 13 months, now held within his everyday story of growth.",
      },
    },
    family: {
      eyebrow: "Family & Care",
      title: "Secure in love, free to explore",
      intro:
        "Oliver is growing up surrounded by Mum, Dad and the people who love him. They read, play and explore outdoors together, while giving him time to try everyday things for himself. Familiar arms give him a sense of security and room to meet the wider world with confidence.",
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
          title: "Where our story began",
          body:
            "At six months, Mum and Dad brought Oliver to the place where they first met and fell in love. A familiar place from their story now held a new family memory—the three of them returning together.",
        },
        {
          title: "Held by many loving hands",
          body:
            "From his earliest months, Oliver has grown among people who hold him gently, care for him and make time to stay close.",
        },
        {
          title: "Laughter held close",
          body:
            "At one year old, a family photograph caught Oliver smiling between Mum and Dad—a playful moment they still hold close.",
        },
      ],
      photos: [
        {
          name: "family-main",
          alt: "Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.",
          caption:
            "At 15 months, beneath the blossoms, a family outing became one of the warm moments Mum and Dad chose to keep.",
        },
        {
          name: "family-origin",
          alt: "Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.",
          caption:
            "At six months, Oliver visited the place where Mum and Dad's story began.",
        },
        {
          name: "family-care",
          alt: "Four-month-old Oliver sits in a cushioned baby seat while several people gently support him with their hands.",
          caption:
            "At four months, several loving hands stayed close—a quiet picture of care and togetherness.",
        },
        {
          name: "family-playful",
          alt: "One-year-old Oliver smiles outdoors while Mum and Dad hold him between them.",
          caption:
            "A playful family photograph captures one bright, shared laugh.",
        },
      ],
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Growing alongside him",
      reflection:
        "We believe a child's growth begins with steady, sincere companionship at home. Each day, we share a book, play together, step outdoors and give Oliver room to try everyday things for himself. With safety as the boundary and encouragement beside him, we listen patiently as he expresses himself and help him learn to care for those around him.",
      hope:
        "We hope Oliver will grow up healthy and happy, held by love and trust, keeping his curiosity as he gradually becomes kind, confident and empathetic. Through every step, Mum and Dad will stay beside him, learning and growing with him too.",
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
      stories: "成長里程",
      growth: "日常點滴",
      family: "家庭與陪伴",
    },
    controls: {
      languages: "選擇語言",
      selected: "目前選用",
      menu: "選單",
      closeMenu: "關閉選單",
      playVideo: "播放影片",
      loadingVideo: "正在載入影片……",
    },
    welcome: {
      message: "歡迎走進昊熹的小世界。",
    },
    hero: {
      eyebrow: "昊熹的成長旅程",
      greeting: "「你好，我是昊熹。」",
      greetingLead: "「你好，",
      greetingRest: "我是昊熹。」",
      intro:
        "「我想和你分享每天喜歡的事：書本、車和小狗、生活裏的小挑戰，還有與家人一起探索世界的時光。」",
      ageLabel: "昊熹現在的年齡",
      portrait: {
        name: "hero-portrait",
        alt: "19個月大的昊熹穿着白色襯衣和淺棕色長褲，坐在柔和的紫灰色背景前，正面望向鏡頭。",
        caption: "昊熹19個月大時的一張近照。",
      },
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "「我的小世界裏，總有好多有趣的事等我發現：不同的書本、路過的小狗、飛馳的車，還有讓我想再試一次的玩具。」在熟悉的日常裏，家人的愛與陪伴，讓昊熹安心地發現身邊每件細小而有趣的事。",
      mainPhoto: {
        name: "about-world",
        alt: "19個月大的昊熹坐在一架大型綠色玩具車裏，伸手指向車輪。",
        caption: "19個月大，一家人外出時，昊熹看見熟悉的車輪，便伸手指一指。",
      },
      fields: [
        {
          title: "親子共讀",
          body:
            "昊熹常常主動從書架拿起書本，邀請家人一起閱讀；爸爸媽媽也會每天在睡前陪他共讀。在幼兒遊戲班的故事時間，他會專心聆聽老師說故事，翻頁時，目光也隨着故事走。書本既是一家人熟悉的溫暖日常，也是他會主動走進的小天地。",
          media: {
            name: "about-reading",
            alt: "12個月大的昊熹依偎在爸爸身旁一起看圖書，爸爸正指着書頁。",
            caption: "12個月大，和爸爸靜靜分享一頁書。",
          },
        },
        {
          title: "專注解難",
          body:
            "玩解難玩具時，昊熹會先停下來仔細看看，再用雙手反覆嘗試。遇到未能立即解開的地方，他沒有急着放棄，而是換個方法繼續探索；成功把部件打開的一刻，那份滿足和開心自然流露。",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "昊熹專心研究解難玩具",
            caption: "19個月大時，昊熹反覆嘗試玩具上的扣鎖，慢慢找到把它解開的方法。",
            ratio: "video",
          },
        },
        {
          title: "細心觀察",
          body:
            "昊熹細心留意日常大小事：他認得婆婆的衣服、爸爸的水杯；看到卡通人物熟悉的外貌特徵，也會聯想到身邊的家人——戴眼鏡的是爸爸，光頭的是公公，短頭髮的是婆婆，長頭髮的是媽媽。從這些自然的小聯想裏，爸爸媽媽看見他如何把眼前的細節與熟悉的人和物連在一起。",
          media: {
            name: "about-observing",
            alt: "18個月大的昊熹站在一組色彩繽紛的卡通人物佈景前，舉起一隻手指向人物。",
            caption: "18個月大，昊熹留意卡通人物的外貌特徵，也把它們與熟悉的家人連繫起來。",
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
      ],
    },
    stories: {
      eyebrow: "成長里程",
      title: "一步步向前，一點點長大",
      intro:
        "六個小片段，記下昊熹一步一步向前的日常：細心聆聽並跟從指示、認出身體部位和家人、輕輕親近小動物、勇敢走進水中、自己翻過一頁頁書，也一次次走近音樂。每一步都不急，卻有好奇、有回應，也有家人在身旁。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "細心聆聽，跟着做",
          age: "17個月大",
          observation:
            "昊熹聽到家人的簡單指示後，找到指定物件，再拿給指定的家人。",
          support:
            "家人在日常相處中，用簡短自然的話與昊熹溝通，也輕輕停一停，給他時間用自己的方式回應。",
          reflection:
            "爸爸媽媽留意到，昊熹聽完會先停一停、想一想，再用行動回應。",
          tags: ["聆聽回應", "日常參與"],
          media: [
            {
              kind: "video",
              videoId: "1Fxx4dzHCFo",
              poster: "following-directions",
              title: "昊熹聽到說話後，把指定物件拿給家人",
              caption: "昊熹找到指定物件，再拿給家人。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "認識身體和家人",
          age: "18個月大",
          observation:
            "昊熹按照簡單指示，指出自己的眼、耳、口、鼻和身體，也認得爸爸和媽媽。",
          support:
            "家人把身體部位和熟悉的人，自然地放進歌曲、圖書、日常對話與遊戲裏，讓理解和表達在互動中慢慢累積。",
          reflection:
            "熟悉的詞語得到小手的回應，日常對話也成為一次溫暖的連結。",
          tags: ["認識身體", "認出家人"],
          media: [
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              poster: "body-and-family",
              title: "昊熹按照簡單指示，指出熟悉的家人和身體部位",
              caption: "昊熹按照簡單指示，指出熟悉的身體部位，以及爸爸和媽媽。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "輕輕走近小動物",
          age: "15至17個月大",
          observation:
            "15個月大時，爸爸媽媽帶昊熹到嘉道理農場看小動物，他近距離觀察貓頭鷹，也輕輕伸出小手；17個月大時，在另一次農場活動中，他主動把食物遞給小兔，也和牠輕輕互動。後來看到小兔，他也會說「兔兔」。",
          support:
            "爸爸媽媽會繼續帶他在安全、尊重動物的情況下親近自然：先觀察，再按昊熹和動物的反應慢慢靠近。",
          reflection:
            "小手慢慢伸出去，就像向自然說了一聲「你好」。",
          tags: ["細心觀察", "溫柔接觸"],
          media: [
            {
              kind: "photo",
              name: "story-animals",
              alt: "昊熹由爸爸媽媽抱在中間，身旁有一隻貓頭鷹停在手套上。",
              caption: "昊熹和爸爸媽媽一起，近距離看一看貓頭鷹。",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "rcpBdZzHJAk",
              poster: "feeding-rabbits",
              title: "昊熹把食物遞給小兔",
              caption: "家庭外出時，昊熹把食物遞給小兔。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "勇敢走進水中",
          age: "19個月大",
          observation:
            "在家人和教練陪伴的游泳課裏，昊熹開心地踢水，也試着自己爬上池邊，並完成一次短短的潛水體驗。",
          support:
            "家人和教練按他的反應調整步伐，在安全照顧中給予正面鼓勵，讓他自在嘗試。",
          reflection:
            "爸爸媽媽為他的嘗試感到高興，也珍惜他在熟悉陪伴中慢慢建立信心。",
          tags: ["水中探索", "願意嘗試"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "昊熹在泳池裏站着微笑，身旁有大人的手陪伴。",
              caption: "在大人陪伴下，昊熹笑着站在水中。",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "BxMkQkxApBg",
              poster: "water-step",
              title: "昊熹在大人陪伴下潛進水裏",
              caption: "昊熹在大人陪伴下，參與一次短短的潛水體驗。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "小手翻過一頁頁書",
          age: "18個月大",
          observation:
            "昊熹自己翻開書本，按自己的步伐細看書中的車、蜜蜂等圖畫；看完一頁，再自行翻到下一頁。",
          support:
            "家中低矮的書架放着繪本、中英文圖書和點讀書，讓昊熹隨時拿到。爸爸媽媽每晚睡前陪他閱讀，也留一點安靜的時間，讓他自己走進書本的世界。",
          reflection:
            "爸爸媽媽很珍惜他主動拿起書本、專心翻看的模樣；一起讀過的每一頁，也慢慢成為他能自己展開的小旅程。",
          tags: ["自主翻閱", "專注閱讀"],
          media: [
            {
              kind: "video",
              videoId: "kgPKylmVI7s",
              poster: "reading-pages",
              title: "昊熹自己看書，並自行翻到下一頁",
              caption: "昊熹自己看書，並自行翻到下一頁。",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "再次走近音樂",
          age: "17個月大",
          observation:
            "每次到幼兒遊戲班，昊熹總會走到鋼琴旁，伸出小手按一按琴鍵，聽一聽不同的聲音。",
          support:
            "爸爸媽媽會繼續和昊熹一起參與輕鬆的音樂遊戲，讓他按自己的步伐感受節奏與聲音的樂趣。",
          reflection:
            "遇上感興趣的聲音，昊熹總會一次次走近，安靜又專心地探索。",
          tags: ["音樂探索", "再次走近"],
          media: [
            {
              kind: "video",
              videoId: "2RE83LVmTVk",
              poster: "piano-keys",
              title: "昊熹在幼兒遊戲班探索鋼琴",
              caption: "昊熹再次走到鋼琴旁，按自己的方式探索琴鍵。",
              ratio: "portrait-video",
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "日常點滴",
      title: "日子一頁頁，腳步一點點",
      intro:
        "爸爸媽媽把日常裏細小而真實的轉變一一記下：尋找不見的物件、扶着移動、試着自己走、配對形狀、倒進另一隻杯、幫忙收拾、揮手道別……放在一起，便看見昊熹如何用好奇心和一雙小手，慢慢參與生活。",
      milestonesTitle: "十二個日常小片段",
      milestonesIntro:
        "把這些小觀察放在同一條成長小路上，便看見動作、思考、生活參與和與人連結，如何慢慢成為昊熹的日常。",
      milestones: [
        {
          time: "8個月大",
          title: "尋找躲起的物件",
          moment: "眼前的物件消失後，昊熹會再去找它。",
        },
        {
          time: "10個月大",
          title: "在爬、坐、站之間",
          moment: "昊熹會用單手或雙手扶着站立，扶着橫行幾步，也會由爬行轉為坐下，再由坐下站起來。",
        },
        {
          time: "12個月大",
          title: "牽着爸爸媽媽的手",
          moment: "一次家庭拍攝裏，昊熹站在爸爸媽媽中間，由他們一人牽着一隻手。",
          photo: {
            name: "growth-supported",
            alt: "1歲的昊熹站在爸爸媽媽中間，爸爸媽媽各牽着他一隻手。",
            caption: "站在爸爸媽媽中間，昊熹牽着兩雙熟悉的手。",
          },
        },
        {
          time: "14個月大",
          title: "試着自己走",
          moment: "在不用攙扶站立之後，他開始嘗試獨自行一、兩步。",
        },
        {
          time: "14個月大",
          title: "把形狀放對位置",
          moment: "昊熹把圓柱體和圓形放進相配的洞口。",
        },
        {
          time: "16個月大",
          title: "步伐更穩，也看見樓梯",
          moment: "爸爸媽媽記下他漸漸走得更穩，也開始探索樓梯。",
        },
        {
          time: "16個月大",
          title: "倒進另一隻杯",
          moment: "昊熹嘗試把一隻杯裏的東西倒進另一隻杯；隔天，他又再嘗試一次。",
        },
        {
          time: "16個月大",
          title: "飲管杯與碰杯",
          moment: "昊熹用飲管杯喝奶，也和家人一起碰杯。",
        },
        {
          time: "16個月大",
          title: "鞦韆上的笑容",
          moment: "昊熹雙手扶着幼兒鞦韆，在輕輕搖盪中笑得很開心。",
          photo: {
            name: "growth-swing",
            alt: "昊熹坐在幼兒鞦韆上，雙手扶着兩旁，開懷地笑。",
            caption: "鞦韆輕輕一盪，昊熹的笑容也亮了起來。",
          },
        },
        {
          time: "17個月大",
          title: "一起 Clean up",
          moment: "聽到「Clean up」後，昊熹幫忙把玩具放進籃子，也把字卡逐一放進不同格子。",
        },
        {
          time: "一路上",
          title: "揮手說 Bye bye",
          moment: "在熟悉的外出日常中，昊熹會向身邊的人揮手；後來也會一邊揮手，一邊說「Bye bye」，和大家道別。",
        },
        {
          time: "19個月大",
          title: "小小消防員",
          moment: "昊熹在一次外出活動中拿着黃色消防頭盔。消防員是吸引他目光的角色之一，爸爸媽媽也把這個明亮的小片段收進記錄裏。",
          photo: {
            name: "growth-firefighter",
            alt: "昊熹站在戶外，雙手拿着一頂黃色消防頭盔。",
            caption: "一段明亮又有趣的消防主題小片段。",
          },
        },
      ],
      portrait: {
        name: "portrait",
        alt: "13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。",
        caption: "13個月大時留下的一張安靜近照，如今也收進昊熹的日常成長故事裏。",
      },
    },
    family: {
      eyebrow: "家庭與陪伴",
      title: "在愛裏安心，在陪伴中探索",
      intro:
        "昊熹在爸爸媽媽和家人的陪伴中長大。每天一起讀書、一起玩、一起走到戶外，也在生活小事裏給他時間自己嘗試。熟悉的懷抱給他安全感，也讓他安心走向更大的世界。",
      valuesTitle: "我們珍惜的小日常",
      valuesBody:
        "一起打開的書本、願意留給彼此的時間，還有熟悉的人在身旁——這些簡單小事，組成昊熹溫暖的家庭日常。",
      vignettes: [
        {
          title: "每天共讀一頁",
          body: "昊熹喜歡書本，爸爸媽媽每天都會留一段時間，坐在他身旁一起閱讀。",
        },
        {
          title: "回到故事起點",
          body: "6個月大時，爸爸媽媽帶昊熹回到二人相識、相愛的地方。從前屬於兩個人的熟悉風景，從此也多了一段一家三口共同珍藏的回憶。",
        },
        {
          title: "許多雙疼愛他的手",
          body: "從還是小寶寶的時候開始，昊熹已在許多人的溫柔承托、照顧和陪伴中慢慢長大。",
        },
        {
          title: "笑聲留在身旁",
          body: "1歲時，一次家庭拍攝記下昊熹在爸爸媽媽中間開心地笑。那份一起玩、一起笑的輕鬆，也成為一家人想好好留住的回憶。",
        },
      ],
      photos: [
        {
          name: "family-main",
          alt: "15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。",
          caption: "15個月大，花影下的一次家庭外出，成為爸爸媽媽想好好留住的溫暖片段。",
        },
        {
          name: "family-origin",
          alt: "6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。",
          caption: "6個月大，昊熹跟爸爸媽媽回到他們相識相愛的地方。",
        },
        {
          name: "family-care",
          alt: "4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正溫柔承托着他。",
          caption: "4個月大時，幾雙疼愛昊熹的手留在身旁，成為一幅關於照顧、安心與陪伴的安靜畫面。",
        },
        {
          name: "family-playful",
          alt: "1歲的昊熹在戶外由爸爸媽媽抱在中間，一家人一起笑。",
          caption: "一張輕快的家庭合照，留住一家人的笑聲。",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "陪着他，一起長大",
      reflection: "我們相信，孩子的成長始於家庭裏安穩而真誠的陪伴。每天一起讀一本書、玩一會兒、走到戶外看看，也在生活小事裏給昊熹空間自己嘗試。我們以安全為界、以鼓勵作陪，耐心聽他表達，也陪他學着關心身邊的人。",
      hope: "我們盼望昊熹在愛與信任中健康快樂地長大，保有好奇心，慢慢成為善良、自信、有同理心的人。每一步，爸爸媽媽都願意陪着他，一起學習、一起成長。",
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
