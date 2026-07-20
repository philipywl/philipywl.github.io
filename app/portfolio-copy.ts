export type PortfolioLocale = "en" | "zh";

export type PortfolioPhotoName =
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
  noticed: string;
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
            "Every day, Mum and Dad open a book with Oliver. He often chooses one from the shelf by himself; during story time at playgroup, he listens closely as the teacher shares a story. Books have become both a gentle family ritual and a little world he chooses to enter.",
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
            "With a problem-solving toy in front of him, Oliver first pauses to look closely, then tries the moving parts with both hands. When one approach does not work straight away, he stays with it and tries another; the delight on his face when the toy responds is easy to see.",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "Oliver explores a problem-solving toy",
            caption:
              "At 19 months, Oliver tried the toy's movable piece in different ways and gradually found how to open it.",
            ratio: "video",
          },
        },
        {
          title: "Noticing and remembering",
          body:
            "When Oliver sees familiar features in cartoon characters, he links them with people he knows well: glasses remind him of Dad, a bald head of Grandpa, short hair of Grandma and long hair of Mum. In these spontaneous little connections, Mum and Dad notice how carefully he links visual details with the people around him.",
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
      eyebrow: "Learning Stories",
      title: "Everyday moments, held with care",
      intro:
        "These five stories begin with something small and real: a spoken request answered, a page turned, a little step into the water, a familiar return to the piano, or a gentle hand reaching towards an animal. Together, they show what Oliver did, how he responded and how his family stayed close beside him.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we continue alongside him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "He listens, then responds",
          age: "17–18 months",
          observation:
            "At 17 months, Oliver listened to a spoken request, found the named object and brought it to a family member. At 18 months, he listened to simple prompts and pointed to familiar body parts as well as Mum and Dad.",
          noticed:
            "In both moments, a few familiar words opened the way to a shared exchange: Oliver listened, looked and answered through action.",
          support:
            "His family continues weaving short, natural phrases into everyday routines, leaving a gentle pause for Oliver to respond in his own way.",
          reflection:
            "A few simple words can become a lovely moment of understanding and helping one another.",
          tags: ["Listening & Responding", "Language Interaction"],
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
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              poster: "body-and-family",
              title:
                "Oliver listens and points to familiar people and body parts",
              caption:
                "Oliver listens to simple prompts and points to familiar body parts, Mum and Dad.",
              ratio: "portrait-video",
            },
          ],
        },
        {
          title: "Turning to the next page",
          age: "18 months",
          observation:
            "Oliver looked through a book by himself, taking in each page at his own pace. When he was ready, he turned to the next page and continued looking.",
          noticed:
            "A reading rhythm shared every day was also becoming a quiet little journey Oliver could begin for himself.",
          support:
            "Books remain within easy reach. Mum and Dad continue reading with him each day, while leaving unhurried time for him to return to familiar pages by himself.",
          reflection:
            "When he returns to a book by himself, the pages we have shared together feel even more precious.",
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
          tags: ["Movement in Water", "Willingness to Try"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "Oliver smiles in a swimming pool, with an adult close by.",
              caption:
                "Oliver enjoys time in the water with an adult close by.",
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
          tags: ["Musical Exploration", "Sustained Interest"],
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
        {
          title: "A gentle hello to the animals",
          age: "15–17 months",
          observation:
            "At 15 months, Mum and Dad took Oliver to Kadoorie Farm to see the animals. When he met an owl at close range, he reached out for a gentle touch. At 17 months, in another animal encounter, he offered food to a rabbit.",
          noticed:
            "In both moments, Oliver paused to look before reaching out slowly with an adult close beside him. His curiosity became a gentle way of meeting another living creature.",
          support:
            "Mum and Dad will continue offering calm, closely supervised encounters with nature—looking first, then moving closer at a pace that respects both Oliver and the animal.",
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
      ],
    },
    growth: {
      eyebrow: "Everyday Growth",
      title: "Small steps, quietly gathering",
      intro:
        "Oliver's family journal keeps the little changes that might otherwise slip quietly past. Placed side by side, they show movement, curiosity and everyday participation gradually finding their place in his world.",
      milestonesTitle: "Twelve everyday moments along the way",
      milestonesIntro:
        "Gathered into one gentle path, these observations show movement, thinking, participation and connection finding their way into Oliver's ordinary days.",
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
          title: "A straw cup and Cheers",
          moment:
            "Oliver drank milk from his straw cup and joined a familiar family Cheers.",
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
      title: "Growing within a circle of care",
      intro:
        "Oliver's days unfold within the steady warmth of family. Mum and Dad make time to read, explore and notice the little things with him, while many loving people stay close—giving him a secure place from which to meet the wider world.",
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
            "A playful family photograph kept one bright shared laugh.",
        },
      ],
    },
    closing: {
      eyebrow: "From Oliver's parents",
      title: "Growing alongside him",
      reflection:
        "We believe a child's learning begins in the steady companionship of family. Through daily reading, play, outdoor exploration and the small routines of home, we give Oliver room to discover the world for himself—safely, gently and with plenty of encouragement—while learning to express himself and care for others.",
      hope:
        "We hope Oliver will keep his curiosity, grow in health and happiness, and become a kind, confident and empathetic person. Mum and Dad will stay beside him, learning and growing with him too.",
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
    },
    welcome: {
      message: "歡迎走進昊熹的小小世界。",
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
            "爸爸媽媽每天都會陪昊熹打開一本書。他平日會主動從書架拿書來看；在幼兒遊戲班的故事時間，他也會專心聽老師說故事。書本既是一家人熟悉的溫暖日常，也是他會主動走進的小天地。",
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
            "玩解難玩具時，昊熹會先停下來仔細看看，再用雙手反覆嘗試。遇到未能立即解開的地方，他沒有急着放棄，而是換個方法繼續探索；找到玩法的一刻，那份開心自然流露。",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "昊熹專心研究解難玩具",
            caption: "19個月大時，昊熹反覆嘗試玩具上可以開合的部件，慢慢找到讓它打開的方法。",
            ratio: "video",
          },
        },
        {
          title: "細心觀察",
          body:
            "昊熹看到卡通人物熟悉的外貌特徵時，會聯想到身邊的家人：戴眼鏡的是爸爸，光頭的是公公，短頭髮的是婆婆，長頭髮的是媽媽。從這些自然的小聯想裏，爸爸媽媽看見他如何把眼前的細節，與熟悉的人連在一起。",
          media: {
            name: "about-observing",
            alt: "18個月大的昊熹站在一組色彩繽紛的卡通人物佈景前，舉起一隻手指向人物。",
            caption: "18個月大，昊熹留意卡通人物的外貌特徵，也把它們與熟悉的家人連繫起來。",
          },
        },
      ],
    },
    stories: {
      eyebrow: "成長故事",
      title: "把日常片段，輕輕收進故事裏",
      intro:
        "五個故事，都從一件細小而真實的事情開始：聽見一句話，便用行動回應；自己翻過一頁書；在水裏踏出一小步；再次走近琴鍵；或輕輕伸手親近小動物。每個片段都記下昊熹做了甚麼、如何回應，以及家人怎樣陪在身旁。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何繼續陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "聽見，也回應",
          age: "17至18個月大",
          observation:
            "17個月大時，昊熹聽到家人的簡單指示，找到指定物件，再拿給家人。18個月大時，他也會按照簡單指示，指出熟悉的身體部位，以及爸爸和媽媽。",
          noticed:
            "在兩個片段裏，幾句熟悉的說話，打開了一次次溫暖交流：昊熹聽一聽、找一找，再用動作回應。",
          support:
            "家人會繼續在日常相處中，用簡短自然的話與昊熹溝通，也輕輕停一停，等他用自己的方式回應。",
          reflection:
            "幾句簡單的說話，也可以成為一家人互相明白、互相幫忙的窩心時刻。",
          tags: ["聆聽回應", "語言互動"],
          media: [
            {
              kind: "video",
              videoId: "1Fxx4dzHCFo",
              poster: "following-directions",
              title: "昊熹聽到說話後，把指定物件拿給家人",
              caption: "昊熹找到指定物件，再拿給家人。",
              ratio: "portrait-video",
            },
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
          title: "自己翻開下一頁",
          age: "18個月大",
          observation:
            "昊熹自己看書，按自己的步伐細看眼前的一頁。看完後，他自行翻到下一頁，再繼續看下去。",
          noticed:
            "每天一起翻過的書頁，也慢慢成為昊熹能自己展開的一段安靜小旅程。",
          support:
            "家中的書會繼續放在昊熹容易拿到的位置。爸爸媽媽每天陪他閱讀，也留一點從容時間，讓他自己再回到熟悉的書頁。",
          reflection:
            "看見昊熹自己再次走近書本，讓我們更珍惜曾經一起翻過的每一頁。",
          tags: ["自主翻閱", "專注看書"],
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
          title: "水裏的一小步",
          age: "19個月大",
          observation:
            "在大人近距離陪伴的游泳活動中，昊熹享受在水裏活動，也參與了一次短短的潛水體驗；整個過程，大人一直在身旁細心照顧。",
          noticed:
            "爸爸媽媽看見昊熹願意參與，而身旁大人安穩的陪伴，也一直輕輕承托着這次體驗。",
          support:
            "往後的水中活動，也會繼續由大人在身旁細心照顧，按昊熹的反應調整步伐，輕輕鼓勵，不給壓力。",
          reflection:
            "看見這一小步，我們很為昊熹高興，也很珍惜能在身旁一起經歷。",
          tags: ["水中活動", "願意嘗試"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "昊熹在泳池裏開心地笑，身旁有大人陪伴。",
              caption: "在大人陪伴下，昊熹享受水中時光。",
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
          title: "總會走近的琴鍵",
          age: "17個月大",
          observation:
            "每次到幼兒遊戲班，昊熹總會走到鋼琴旁。這段短片記下他停在琴鍵前，按自己的方式探索一個個聲音。",
          noticed:
            "爸爸媽媽留意到，遇上感興趣的事物時，昊熹會一次又一次走近，安靜而專心地探索。",
          support:
            "爸爸媽媽會繼續留出從容的音樂遊戲時間，細心聽着，也溫暖回應昊熹親手發現的聲音。",
          reflection: "幼兒遊戲班裏有許多角落，鋼琴總是昊熹一次又一次走回去的地方。",
          tags: ["音樂探索", "持續興趣"],
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
        {
          title: "輕輕走近小動物",
          age: "15至17個月大",
          observation:
            "15個月大時，爸爸媽媽帶昊熹到嘉道理農場看小動物。近距離看見貓頭鷹，他伸出小手，輕輕摸一摸；17個月大時，在另一次親近動物的片段裏，他把食物遞給小兔。",
          noticed:
            "兩次相遇中，昊熹都先停下來看一看，再在大人陪伴下慢慢伸手。爸爸媽媽看見，他對小動物的好奇，也可以是一份輕柔的靠近。",
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
      ],
    },
    growth: {
      eyebrow: "日常成長",
      title: "把一點一滴，慢慢收進成長裏",
      intro:
        "爸爸媽媽的日常記錄，留住了一些很容易悄悄溜走的小轉變。把它們放在一起，便看見動作、好奇心和生活參與，一點一滴走進昊熹的世界。",
      milestonesTitle: "十二個日常片段，一步一步走來",
      milestonesIntro:
        "把這些小觀察放在同一條成長小路上，便看見動作、思考、生活參與和與人連結，如何慢慢走進昊熹的日常。",
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
          moment: "昊熹嘗試把一隻杯裏的東西倒進另一隻杯；到另一日，他又再試了一次。",
        },
        {
          time: "16個月大",
          title: "飲管杯和 Cheers",
          moment: "昊熹用飲管杯喝奶，也參與一家人熟悉的「Cheers」。",
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
          moment: "昊熹在一次外出活動中拿着黃色消防頭盔。消防員是會吸引他留意的角色之一，爸爸媽媽也把這個明亮的小片段收進記錄裏。",
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
      title: "在愛與陪伴中，一起長大",
      intro:
        "昊熹的日常，在家人安穩的愛裏慢慢展開。爸爸媽媽陪他閱讀、探索，也一起留意生活裏的小事；身邊還有許多疼愛他的人，讓他從熟悉而安心的懷抱出發，慢慢認識更大的世界。",
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
      reflection: "我們相信，孩子的成長從家庭裏每一次安穩的陪伴開始。每天的親子閱讀、遊戲、戶外探索和生活小事，都是我們陪昊熹認識世界的方式；在安全和鼓勵中，讓他自在嘗試，也慢慢學會表達自己、關心別人。",
      hope: "我們盼望昊熹一直保有好奇心，健康快樂地長大，成為善良、自信、有同理心的人；爸爸媽媽也會留在他身旁，陪他一起學習、一起成長。",
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
