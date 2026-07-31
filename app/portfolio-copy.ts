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
  | "growth-supported"
  | "growth-rescue-motorcycle";

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
  autoplayPriority: number;
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
  placeholder?: PlaceholderCopy;
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
    enableVideoSound: string;
    disableVideoSound: string;
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
      stories: "Everyday Stories",
      growth: "Growth Milestones",
      family: "Family & Care",
    },
    controls: {
      languages: "Choose language",
      selected: "currently selected",
      menu: "Menu",
      closeMenu: "Close menu",
      playVideo: "Play video",
      loadingVideo: "Loading video…",
      enableVideoSound: "Turn on video sound",
      disableVideoSound: "Turn off video sound",
    },
    welcome: {
      message: "Welcome to Oliver's little world.",
    },
    hero: {
      eyebrow: "Oliver's learning journey",
      greeting: "Hello, I'm Oliver.",
      greetingLead: "Hello,",
      greetingRest: "I'm Oliver.",
      intro:
        "I'd love to share little moments and small challenges from everyday life, and the time I spend exploring the world with my family.",
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
        "Oliver's everyday world is full of things that invite him to pause, look closely and try: a book, a car, a passing dog, or a toy that makes him want to have another go. With familiar family close by, he explores at his own pace and gradually connects one small discovery with another.",
      mainPhoto: {
        name: "about-world",
        alt: "Nineteen-month-old Oliver sits inside a large green play car, taking in its wheels and controls.",
        caption:
          "At 19 months, Oliver sits in a large play car and takes in the wheels and controls around him.",
      },
      fields: [
        {
          title: "Reading together",
          body:
            "Oliver often chooses a book from the shelf and invites someone in the family to read with him. Mum and Dad also share a book with him every day. During story time at playgroup, he listens closely to the teacher and follows each turn of the page. Books are both a warm family ritual and a little world he chooses to enter.",
          media: {
            name: "about-reading",
            alt: "Twelve-month-old Oliver sits close to Dad as they look at a board book together and Dad points to the page.",
            caption: "A quiet page shared with Dad at 12 months.",
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
            "With a problem-solving toy in front of him, Oliver first pauses to look closely, then tries the moving parts with both hands. When one approach does not work straight away, he stays with it and tries another; the delight on his face when the toy responds is easy to see.",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "Oliver explores a problem-solving toy",
            caption:
              "At 19 months, Oliver tried the toy latch in different ways and gradually found how to release it.",
            ratio: "video",
            autoplayPriority: 5,
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
      ],
    },
    stories: {
      eyebrow: "Everyday Stories",
      title: "Little experiences, each revealing more of Oliver",
      intro:
        "Six everyday stories reveal different sides of Oliver: listening closely and following a request, turning page after page, stepping bravely into the water, returning to music, approaching animals with a gentle hand, and recognising familiar people and body parts. Each is a real experience, quietly showing more of the child he is becoming.",
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
               autoplayPriority: 10,
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
               autoplayPriority: 20,
            },
          ],
        },
        {
          title: "A gentle hello to the animals",
          age: "15–17 months",
          observation:
            "Mum and Dad took Oliver to Kadoorie Farm to see the animals. When he met an owl at close range, he reached out for a gentle touch. During another farm visit, he offered food to a rabbit and stayed close for a gentle interaction.",
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
               autoplayPriority: 30,
            },
          ],
        },
        {
          title: "Little hands turning page after page",
          age: "18 months",
          observation:
            "Oliver opened a book by himself and, at his own pace, looked closely at pictures of cars, bees and more. After finishing one page, he turned to the next by himself.",
          support:
            "A low shelf keeps picture books, Chinese and English books and reading-pen books within easy reach. Mum and Dad read with Oliver every day, while also leaving quiet moments for him to explore books by himself.",
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
              autoplayPriority: 40,
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
              autoplayPriority: 50,
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
               autoplayPriority: 60,
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "Growth Milestones",
      title: "Step by step, growing a little each day",
      intro:
        "Mum and Dad record Oliver's everyday steps forward: looking for a hidden object, moving with support, experimenting with early sounds, matching shapes, pouring between cups, helping to tidy and waving goodbye. Together, these small moments trace his journey from babyhood into an increasingly curious and involved little boy.",
      milestonesTitle: "Ten everyday moments",
      milestonesIntro:
        "Along this gentle path, movement, thinking, participation and connection gradually unfold at Oliver's own pace.",
      milestones: [
        {
          time: "8 months",
          title: "Looking for what disappeared",
          moment:
            "When an object disappeared from view, Oliver looked for it with curiosity.",
        },
        {
          time: "10 months",
          title: "Moving between positions",
          moment:
            "Holding on with one or both hands, Oliver moved sideways for a few steps and shifted from crawling to sitting, then from sitting to standing.",
        },
        {
          time: "12 months",
          title: "Holding Mum and Dad's hands",
          moment:
            "On his first birthday, Oliver held Mum and Dad's hands and stepped forward, one small step at a time.",
          photo: {
            name: "growth-supported",
            alt: "One-year-old Oliver stands between Mum and Dad while each parent holds one of his hands.",
            caption: "At one year old, Oliver stepped forward between two familiar hands.",
          },
        },
        {
          time: "14 months",
          title: "Early sounds",
          moment:
            "Oliver began imitating adult speech, making sounds such as “Mama” and “dada.”",
        },
        {
          time: "14 months",
          title: "Matching shapes",
          moment:
            "Oliver placed a cylinder and a circle into openings that matched their shapes.",
        },
        {
          time: "16 months",
          title: "Pouring between cups",
          moment:
            "Oliver poured the contents of one cup into another.",
        },
        {
          time: "16 months",
          title: "A straw cup and a family toast",
          moment:
            "Oliver drank milk through a straw and joined the family in a cheerful toast.",
        },
        {
          time: "17 months",
          title: "Joining tidy-up time",
          moment:
            "After hearing “Clean up,” Oliver helped place toys in the basket and cards into a bag.",
        },
        {
          time: "18 months",
          title: "Waving Bye bye",
          moment:
            "Across familiar outings, Oliver waved to people around him and later joined shared farewells with a wave and “Bye bye.”",
        },
        {
          time: "19 months",
          title: "Matching the rescue motorcycle",
          moment:
            "During a visit to the fire station, Oliver held his much-loved toy motorcycle. When he noticed the full-sized rescue motorcycle, he lifted his model and connected the little one in his hand with the larger one before him.",
          photo: {
            name: "growth-rescue-motorcycle",
            alt: "Nineteen-month-old Oliver holds a green-and-black toy motorcycle, with a full-sized yellow rescue motorcycle and part of an ambulance behind him.",
            caption:
              "A little motorcycle in his hand, a full-sized one behind him—Oliver connects a familiar toy with something newly discovered.",
          },
        },
      ],
      portrait: {
        name: "portrait",
        alt: "A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.",
        caption:
          "At 13 months, Oliver looks towards the camera with a bright, curious gaze.",
      },
    },
    family: {
      eyebrow: "Family & Care",
      title: "Secure in love, free to explore",
      intro:
        "Mum, Dad and the people who love Oliver fill his days with love, encouragement and a sense of safety, giving him room to try and explore at his own pace. They read together every day, and also play and step outdoors together; with familiar company close by, he discovers a little more of the wider world.",
      photos: [
        {
          name: "family-main",
          alt: "Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.",
          caption:
            "Beneath the blossoms, the three of them gather close, holding on to an everyday moment wrapped in love.",
        },
        {
          name: "family-origin",
          alt: "Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.",
          caption:
            "At six months, Oliver returned with Mum and Dad to the place where their story began, adding a new family memory to a familiar view.",
        },
        {
          name: "family-care",
          alt: "Four-month-old Oliver sits in a cushioned baby seat while several people gently support him with their hands.",
          caption:
            "At four months, several loving hands stayed close, quietly holding and caring for Oliver.",
        },
        {
          name: "family-playful",
          alt: "One-year-old Oliver smiles outdoors while Mum and Dad hold him between them.",
          caption:
            "Oliver's happy smile is one of the everyday sights Mum and Dad treasure most.",
        },
      ],
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Growing alongside him",
      reflection:
        "We believe a child's growth begins with steady, sincere companionship at home. Each day, we share a book. We also play together, step outdoors and patiently give Oliver room to try everyday things for himself. With safety as the boundary and encouragement beside him, we listen as he expresses himself and help him learn to care for those around him.",
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
      stories: "生活點滴",
      growth: "成長里程",
      family: "家庭與陪伴",
    },
    controls: {
      languages: "選擇語言",
      selected: "目前選用",
      menu: "選單",
      closeMenu: "關閉選單",
      playVideo: "播放影片",
      loadingVideo: "正在載入影片……",
      enableVideoSound: "開啟影片聲音",
      disableVideoSound: "關閉影片聲音",
    },
    welcome: {
      message: "歡迎走進昊熹的小世界。",
    },
    hero: {
      eyebrow: "昊熹的成長旅程",
      greeting: "你好，我是昊熹。",
      greetingLead: "你好，",
      greetingRest: "我是昊熹。",
      intro:
        "我想和你分享生活點滴和小挑戰，還有與家人一起探索世界的時光。",
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
        "昊熹的日常小世界裏，總有許多值得停下來看看、伸手試試的事：一本書、一輛車、路過的小狗，還有讓他想再試一次的玩具。在熟悉的日常與家人的陪伴中，他安心地探索，也慢慢把一個個小發現連在一起。",
      mainPhoto: {
        name: "about-world",
        alt: "19個月大的昊熹坐在一架大型綠色玩具車裏，細看身邊的車輪和裝置。",
        caption: "19個月大，一家人外出時，昊熹坐進喜歡的大車裏，細看身邊的車輪和裝置。",
      },
      fields: [
        {
          title: "親子共讀",
          body:
            "昊熹常常主動從書架拿起書本，邀請家人一起閱讀；爸爸媽媽也會每天陪他共讀。在幼兒遊戲班的故事時間，他會專心聆聽老師說故事，翻頁時，目光也隨着故事走。書本既是一家人熟悉的溫暖日常，也是他會主動走進的小天地。",
          media: {
            name: "about-reading",
            alt: "12個月大的昊熹依偎在爸爸身旁一起看圖書，爸爸正指着書頁。",
            caption: "12個月大，和爸爸靜靜分享一頁書。",
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
            "玩解難玩具時，昊熹會先停下來仔細看看，再用雙手反覆嘗試。遇到未能立即解開的地方，他沒有急着放棄，而是換個方法繼續探索；成功把部件打開的一刻，那份滿足和開心自然流露。",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "昊熹專心研究解難玩具",
            caption: "19個月大時，昊熹反覆嘗試玩具上的扣鎖，慢慢找到把它解開的方法。",
            ratio: "video",
            autoplayPriority: 5,
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
      ],
    },
    stories: {
      eyebrow: "生活點滴",
      title: "一點點的體驗，看見獨一無二的你",
      intro:
        "六個日常小片段，讓我們看見昊熹不同的面向：細心聆聽並跟從指示、自己翻過一頁頁書、勇敢走進水中、一次次走近音樂、輕輕親近小動物，也認出熟悉的身體部位和家人。每一段都是真實的經歷，也讓獨一無二的他慢慢被看見。",
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
              autoplayPriority: 10,
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
              autoplayPriority: 20,
            },
          ],
        },
        {
          title: "輕輕走近小動物",
          age: "15至17個月大",
          observation:
            "15個月大時，爸爸媽媽帶昊熹到嘉道理農場看小動物，他近距離觀察貓頭鷹，也輕輕伸出小手；17個月大時，在另一次農場活動中，他主動把食物遞給小兔，也留在牠身旁輕輕互動。",
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
              autoplayPriority: 30,
            },
          ],
        },
        {
          title: "小手翻過一頁頁書",
          age: "18個月大",
          observation:
            "昊熹自己翻開書本，按自己的步伐細看書中的車、蜜蜂等圖畫；看完一頁，再自行翻到下一頁。",
          support:
            "家中低矮的書架放着繪本、中英文圖書和點讀書，讓昊熹隨時拿到。爸爸媽媽每天陪他閱讀，也留一點安靜的時間，讓他自己走進書本的世界。",
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
              autoplayPriority: 40,
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
              autoplayPriority: 50,
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
              autoplayPriority: 60,
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "成長里程",
      title: "一步步向前，一點點長大",
      intro:
        "爸爸媽媽記下昊熹一步一步向前的日常：尋找不見的物件、扶着移動、模仿說話、配對形狀、倒進另一隻杯、幫忙收拾、揮手道別……一個個小片段，見證他從小寶寶慢慢長成好奇、投入生活的小孩子。",
      milestonesTitle: "十個日常小片段",
      milestonesIntro:
        "在這條成長小路上，可以看見他的動作、思考、生活參與和與人連結，如何按自己的步伐慢慢展開。",
      milestones: [
        {
          time: "8個月大",
          title: "尋找躲起的物件",
          moment: "眼前的物件消失後，昊熹會好奇地尋找它。",
        },
        {
          time: "10個月大",
          title: "在爬、坐、站之間",
          moment: "昊熹會用單手或雙手扶着站立，扶着橫行幾步，也會由爬行轉為坐下，再由坐下站起來。",
        },
        {
          time: "12個月大",
          title: "牽着爸爸媽媽的手",
          moment: "一歲生日時，昊熹牽着爸爸媽媽的手，一步步向前。",
          photo: {
            name: "growth-supported",
            alt: "1歲的昊熹站在爸爸媽媽中間，爸爸媽媽各牽着他一隻手。",
            caption: "1歲的昊熹牽着兩雙熟悉的手，一步步向前。",
          },
        },
        {
          time: "14個月大",
          title: "牙牙學語",
          moment: "昊熹開始模仿大人說話，發出「媽媽」和「dada」的聲音。",
        },
        {
          time: "14個月大",
          title: "把形狀放對位置",
          moment: "昊熹把圓柱體和圓形放進相配的洞口。",
        },
        {
          time: "16個月大",
          title: "倒進另一隻杯",
          moment: "昊熹把一隻杯裏的東西倒進另一隻杯。",
        },
        {
          time: "16個月大",
          title: "飲管杯與碰杯",
          moment: "昊熹用飲管喝鮮奶，也和家人一起碰杯。",
        },
        {
          time: "17個月大",
          title: "一起 Clean up",
          moment: "聽到「Clean up」後，昊熹幫忙把玩具放進籃子，也把字卡逐一放進袋子。",
        },
        {
          time: "18個月大",
          title: "揮手說 Bye bye",
          moment: "在熟悉的外出日常中，昊熹會向身邊的人揮手；後來也會一邊揮手，一邊說「Bye bye」，和大家道別。",
        },
        {
          time: "19個月大",
          title: "配對救護電單車",
          moment: "參觀消防局時，昊熹拿着心愛的玩具電單車；看見眼前真實的救護電單車，他便把手中的模型舉起來，把一小一大兩輛電單車連在一起。",
          photo: {
            name: "growth-rescue-motorcycle",
            alt: "19個月大的昊熹手拿綠黑色玩具電單車，身後停着一輛真實的黃色救護電單車，旁邊可見部分救護車。",
            caption: "手中的小電單車，與身後的大電單車；昊熹把熟悉的玩具和眼前的新發現連在一起。",
          },
        },
      ],
      portrait: {
        name: "portrait",
        alt: "13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。",
        caption: "13個月大的昊熹，帶着明亮好奇的目光望向鏡頭。",
      },
    },
    family: {
      eyebrow: "家庭與陪伴",
      title: "在愛裏安心，在陪伴中自在探索",
      intro:
        "爸爸媽媽和家人以愛、鼓勵和安全感陪伴昊熹，讓他安心，也有空間按自己的步伐嘗試和探索。大家每天一起讀書，也會一起玩、一起走到戶外；在熟悉的陪伴中，他一點點認識更大的世界。",
      photos: [
        {
          name: "family-main",
          alt: "15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。",
          caption: "花影下，一家三口靠在一起，留住一段被愛包圍的日常。",
        },
        {
          name: "family-origin",
          alt: "6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。",
          caption: "6個月大，昊熹跟爸爸媽媽回到二人相識的地方，為熟悉的風景添上一段新的家庭回憶。",
        },
        {
          name: "family-care",
          alt: "4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正溫柔承托着他。",
          caption: "4個月大時，幾雙疼愛昊熹的手留在身旁，安靜地承托着他。",
        },
        {
          name: "family-playful",
          alt: "1歲的昊熹在戶外由爸爸媽媽抱在中間，一家人一起笑。",
          caption: "昊熹開心的笑容，是爸爸媽媽最珍惜的日常風景。",
        },
      ],
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "陪着他，一起長大",
      reflection: "我們相信，孩子的成長始於家庭裏安穩而真誠的陪伴。每天一起讀一本書，也會一起玩、走到戶外看看；在生活小事裏，我們耐心地給昊熹空間自己嘗試。我們以安全為界、以鼓勵作陪，細心聽他表達，也陪他學着關心身邊的人。",
      hope: "我們盼望昊熹在愛與信任中健康快樂地長大，保持好奇心，慢慢成為善良、自信、有同理心的人。每一步，爸爸媽媽都願意陪着他，一起學習、一起成長。",
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
