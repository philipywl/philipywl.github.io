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
  | "helping-laundry"
  | "ready-for-lunch"
  | "body-and-family"
  | "reading-pages"
  | "swimming-september"
  | "piano-keys"
  | "feeding-rabbits";

type VideoCopy = {
  kind: "video";
  videoId: string;
  poster: VideoPosterName;
  title: string;
  caption: string;
  ratio: "video" | "portrait-video" | "square-video";
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
        caption: "Oliver at 19 months.",
      },
    },
    about: {
      eyebrow: "Meet Oliver",
      title: "Oliver's everyday world",
      intro:
        "Oliver likes books, cars and watching dogs go by. When a toy catches his interest, he stops to look and try it out. Mum and Dad enjoy discovering everyday things with him.",
      mainPhoto: {
        name: "about-world",
        alt: "Nineteen-month-old Oliver inside a large green play car, looking towards the camera with one hand resting on its side.",
        caption:
          "A photo with a big play car during a family outing, at 19 months.",
      },
      fields: [
        {
          title: "Reading together",
          body:
            "Oliver often chooses a book from the shelf and invites someone in the family to read with him. Mum and Dad read with him every day, and he listens closely to the teacher during story time at playgroup. We treasure these times spent reading and talking together.",
          media: {
            name: "about-reading",
            alt: "Twelve-month-old Oliver sits close to Dad as they look at a board book together and Dad points to the page.",
            caption: "Oliver reading with Dad at 12 months.",
          },
        },
        {
          title: "Cars and dogs",
          body:
            "When Oliver sees a car, he says “vroom vroom”; when a dog passes, he points and says “woof woof.” With his toy cars, he makes up routes and imagines where they might go.",
          media: {
            name: "about-car",
            alt: "Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.",
            caption: "A happy moment behind the wheel at 17 months.",
          },
        },
        {
          title: "Working things out",
          body:
            "Oliver looks closely at the problem-solving toy, then tries moving its parts with both hands. If one way does not work, he tries another. Seeing his delight when he opens the latch makes us smile too.",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "Oliver tries opening a toy latch",
            caption:
              "At 19 months, Oliver tried the toy latch in different ways and gradually found how to release it.",
            ratio: "video",
            autoplayPriority: 5,
          },
        },
        {
          title: "Noticing and remembering",
          body:
            "Oliver recognises Grandma's clothes and Dad's cup. Familiar features in cartoon characters also remind him of his family: glasses make him think of Dad, a bald head of Grandpa, short hair of Grandma and long hair of Mum.",
          media: {
            name: "about-observing",
            alt: "Eighteen-month-old Oliver stands in front of a group of colourful cartoon figures, raising one arm to point towards them.",
            caption:
              "At 18 months, features of the cartoon characters reminded Oliver of his family.",
          },
        },
      ],
    },
    stories: {
      eyebrow: "Everyday Stories",
      title: "Everyday experiences that show what makes Oliver unique",
      intro:
        "Handing over clothes hangers, bringing his chair to the table, opening a favourite book—Mum and Dad have gathered these everyday moments, along with times spent swimming, meeting animals and exploring music.",
      whatHappened: "What happened",
      noticed: "What we noticed",
      support: "How we support him",
      reflection: "Parent observation",
      learningClues: "Learning clues",
      items: [
        {
          title: "Listening and lending a hand",
          age: "21 months",
          observation:
            "As the family's domestic helper hangs the laundry, Oliver responds to her request by handing her clothes hangers.",
          support:
            "His family uses short, clear phrases and gives Oliver time to understand and respond.",
          reflection: "We were happy to see Oliver lend a hand.",
          tags: ["Listening & Responding", "Taking Part Together"],
          media: [
            {
              kind: "video",
              videoId: "gfiAoI900Vc",
              poster: "helping-laundry",
              title:
                "Oliver hands over clothes hangers",
               caption:
                 "Oliver hands clothes hangers to the family's domestic helper as she hangs the laundry.",
               ratio: "square-video",
               autoplayPriority: 10,
            },
          ],
        },
        {
          title: "Bringing his chair to the table",
          age: "20 months",
          observation:
            "It is nearly lunchtime. Oliver pushes his own chair to the table, ready for lunch.",
          support:
            "Mum and Dad give Oliver time to try things for himself, making sure he is safe, offering encouragement and helping when needed.",
          reflection: "We were happy to see Oliver bring his own chair to the table, ready for lunch.",
          tags: ["Everyday Participation", "Coordinated Movement"],
          media: [
            {
              kind: "video",
              videoId: "IYiabpo7nuI",
              poster: "ready-for-lunch",
              title: "Oliver gets his chair ready for lunch",
              caption: "Oliver pushes his own little chair to the table, ready for lunch.",
              ratio: "portrait-video",
              autoplayPriority: 20,
            },
          ],
        },
        {
          title: "Recognising his body and family",
          age: "18 months",
          observation:
            "Following simple requests, Oliver points to his eyes, ears, mouth, nose and body, and to Mum and Dad.",
          support:
            "Through songs, books and everyday games, his family helps Oliver become familiar with body parts and words such as “Mum” and “Dad.”",
          reflection:
            "We name something and he points. These simple exchanges are another way we enjoy playing together.",
          tags: ["Recognising Body Parts", "Recognising Family"],
          media: [
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              poster: "body-and-family",
              title:
                "Oliver points to body parts and family",
               caption:
                 "Oliver listens to simple prompts and points to familiar body parts as well as Mum and Dad.",
               ratio: "portrait-video",
               autoplayPriority: 70,
            },
          ],
        },
        {
          title: "A gentle hello to the animals",
          age: "15–17 months",
          observation:
            "At Kadoorie Farm, Oliver looks closely at an owl and reaches out to touch it gently. On another farm visit, he offers food to a rabbit.",
          support:
            "Mum and Dad help him watch first, then approach slowly, paying attention to both Oliver and the animal and keeping the encounter safe and respectful.",
          reflection:
            "We enjoy learning about animals with Oliver and helping him learn to treat them gently.",
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
               autoplayPriority: 60,
            },
          ],
        },
        {
          title: "Little hands turning page after page",
          age: "18 months",
          observation:
            "Oliver opens the book himself and looks at pictures of cars, bees and other things. After looking at one page, he turns to the next.",
          support:
            "Picture books, Chinese and English books, and books used with a reading pen are kept on low shelves within Oliver's reach. Mum and Dad read with him every day and also give him time to choose books and look through them on his own.",
          reflection:
            "We love reading together and seeing him look through books on his own. We hope reading will remain something he enjoys.",
          tags: ["Independent Book Exploration", "Focused Book Time"],
          media: [
            {
              kind: "video",
              videoId: "kgPKylmVI7s",
              poster: "reading-pages",
              title:
                "Oliver looks through a book",
              caption:
                "Oliver looks through a book and turns to the next page by himself.",
              ratio: "portrait-video",
              autoplayPriority: 30,
            },
          ],
        },
        {
          title: "A brave step into the water",
          age: "19–21 months",
          observation:
            "Oliver swims in the pool with an adult close beside him.",
          support:
            "The adults follow Oliver's cues, keeping him safe and encouraging him to try without rushing him.",
          reflection:
            "We hope that, with reassuring support, he will become more comfortable in the water and enjoy swimming.",
          tags: ["Movement in Water", "Willingness to Try"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "Oliver smiles while standing in the pool, with an adult's hand visible nearby.",
              caption:
                "An earlier swimming moment in July: Oliver smiles in the water with an adult close by.",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "vWXWUHqovGc",
              poster: "swimming-september",
              title:
                "Oliver swims with an adult beside him",
              caption:
                "Swimming in September, with an adult close beside Oliver.",
              ratio: "video",
              autoplayPriority: 40,
            },
          ],
        },
        {
          title: "Returning to music",
          age: "17 months",
          observation:
            "At playgroup, Oliver returns to the piano, pressing the keys and listening to the different sounds.",
          support:
            "Mum and Dad will keep sharing musical games with Oliver, listening to sounds and exploring rhythm together.",
          reflection:
            "We enjoy seeing him return to the piano and would like to spend a little longer playing with him.",
          tags: ["Exploring Sounds", "Choosing to Take Part"],
          media: [
            {
              kind: "video",
              videoId: "2RE83LVmTVk",
              poster: "piano-keys",
              title: "Oliver explores piano keys",
               caption:
                 "Oliver returns to the piano and explores the keys in his own way.",
               ratio: "portrait-video",
               autoplayPriority: 50,
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "Growth Milestones",
      title: "Step by step, growing a little each day",
      intro:
        "From standing with support to matching shapes, helping to tidy and waving goodbye, Mum and Dad keep a record of the everyday changes they notice in Oliver.",
      milestonesTitle: "Ten everyday moments",
      milestonesIntro: "",
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
            "At one year old, Oliver stands between Mum and Dad, holding their hands.",
          photo: {
            name: "growth-supported",
            alt: "One-year-old Oliver stands between Mum and Dad while each parent holds one of his hands.",
            caption: "One-year-old Oliver standing with Mum and Dad, holding their hands.",
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
            "On outings, Oliver waves to the people around him and says “Bye bye.”",
        },
        {
          time: "19 months",
          title: "Matching the rescue motorcycle",
          moment:
            "At the fire station, Oliver spots a rescue motorcycle and holds up his toy motorcycle, noticing how the two are alike.",
          photo: {
            name: "growth-rescue-motorcycle",
            alt: "Nineteen-month-old Oliver holds a green-and-black toy motorcycle, with a full-sized yellow rescue motorcycle and part of an ambulance behind him.",
            caption:
              "Oliver holds up his toy motorcycle, with a full-sized rescue motorcycle behind him.",
          },
        },
      ],
      portrait: {
        name: "portrait",
        alt: "A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.",
        caption:
          "Oliver at 13 months.",
      },
    },
    family: {
      eyebrow: "Family & Care",
      title: "Secure in love, free to explore",
      intro:
        "Reading, playing and heading outdoors are familiar parts of Oliver's family life. We treasure our time together and want him to feel loved and encouraged as he tries new things and explores.",
      photos: [
        {
          name: "family-main",
          alt: "Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.",
          caption:
            "Together beneath the blossoms, in a family photo we love.",
        },
        {
          name: "family-origin",
          alt: "Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.",
          caption:
            "Mum and Dad brought six-month-old Oliver to the place where they first met.",
        },
        {
          name: "family-care",
          alt: "Four-month-old Oliver sits in a cushioned baby seat, with adults' hands visible supporting him.",
          caption:
            "Four-month-old Oliver sits in a baby seat, with adults nearby supporting him.",
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
        "We treasure the time we spend reading and playing with Oliver each day, and we enjoy heading outdoors together. We give him time to try things safely for himself and help when needed. We listen as he expresses himself, offer encouragement and try to show him, through our own actions, how to care for and respect others.",
      hope:
        "We hope Oliver grows up healthy and happy, stays curious, and learns to value himself and care for others. We hope he becomes kind, confident and empathetic, and we will keep learning and growing alongside him.",
    },
    privacy: {
      body:
        "This portfolio has been lovingly gathered by Oliver's parents. Please help us care for these memories by not copying, downloading or redistributing its photographs or videos.",
    },
    footer: {
      updated: "Last updated: September 2026",
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
        caption: "昊熹19個月大時的照片。",
      },
    },
    about: {
      eyebrow: "認識昊熹",
      title: "昊熹的日常小世界",
      intro:
        "昊熹喜歡看書、玩車，也會留意路過的小狗。遇到有趣的玩具，他會停下來看看、伸手試試。爸爸媽媽陪着他，一起發現日常裏有趣的事。",
      mainPhoto: {
        name: "about-world",
        alt: "19個月大的昊熹在大型綠色玩具車裏，一隻手扶着車身，望向鏡頭。",
        caption: "19個月大，一家人外出時，昊熹和大車拍張照。",
      },
      fields: [
        {
          title: "親子共讀",
          body:
            "昊熹常常主動從書架拿書，邀請家人一起看。爸爸媽媽每天都會陪他閱讀；到了幼兒遊戲班，他也會專心聆聽老師說故事。我們很珍惜這些一起看書、一起說說話的時間。",
          media: {
            name: "about-reading",
            alt: "12個月大的昊熹依偎在爸爸身旁一起看圖書，爸爸正指着書頁。",
            caption: "12個月大的昊熹，和爸爸一起看書。",
          },
        },
        {
          title: "車和小狗",
          body:
            "看到車，昊熹會開心地說「嗚嗚」；小狗經過，他會指着牠說「汪汪」。玩玩具車時，他喜歡自己安排路線，想像小車會到哪裏去。",
          media: {
            name: "about-car",
            alt: "17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。",
            caption: "17個月大，和喜歡的車留下一個開心時刻。",
          },
        },
        {
          title: "專注解難",
          body:
            "玩解難玩具時，昊熹會先仔細看看，再用雙手試試。遇到打不開的地方，他會換個方法再試；成功解開扣鎖時，他開心的樣子讓我們也忍不住笑起來。",
          media: {
            kind: "video",
            videoId: "9QrYnWYsVUQ",
            poster: "problem-solving",
            title: "昊熹嘗試解開玩具扣鎖",
            caption: "19個月大時，昊熹反覆嘗試玩具上的扣鎖，慢慢找到把它解開的方法。",
            ratio: "video",
            autoplayPriority: 5,
          },
        },
        {
          title: "細心觀察",
          body:
            "昊熹認得婆婆的衣服、爸爸的水杯。看到卡通人物熟悉的外貌特徵，他也會聯想到家人：戴眼鏡的像爸爸，光頭的像公公，短頭髮的像婆婆，長頭髮的像媽媽。",
          media: {
            name: "about-observing",
            alt: "18個月大的昊熹站在一組色彩繽紛的卡通人物佈景前，舉起一隻手指向人物。",
            caption: "18個月大，卡通人物的外貌讓昊熹想起熟悉的家人。",
          },
        },
      ],
    },
    stories: {
      eyebrow: "生活點滴",
      title: "一點點的體驗，看見獨一無二的你",
      intro:
        "幫忙遞衣架、推好自己的椅子、翻開喜歡的書……爸爸媽媽記下這些日常片段，也和你分享昊熹游泳、看小動物和玩音樂的時光。",
      whatHappened: "當時的小故事",
      noticed: "這一刻，我們看見……",
      support: "我們如何陪伴",
      reflection: "爸爸媽媽的觀察",
      learningClues: "學習線索",
      items: [
        {
          title: "聽懂指令，幫忙做家務",
          age: "21個月大",
          observation:
            "姐姐掛衣服時，昊熹聽懂她的指示，把衣架遞給她，幫忙做家務。",
          support:
            "家人用簡短、清楚的話和昊熹溝通，說完後等一等，給他時間理解和回應。",
          reflection: "昊熹也能幫上忙了，我們很開心。",
          tags: ["聆聽回應", "合作參與"],
          media: [
            {
              kind: "video",
              videoId: "gfiAoI900Vc",
              poster: "helping-laundry",
              title: "昊熹幫忙遞衣架",
              caption: "昊熹把衣架遞給姐姐，一起幫忙掛衣服。",
              ratio: "square-video",
              autoplayPriority: 10,
            },
          ],
        },
        {
          title: "推好椅子，準備開飯",
          age: "20個月大",
          observation:
            "快到午餐時間了，昊熹把自己的小椅子推到餐桌旁，準備吃飯。",
          support:
            "只要安全，爸爸媽媽便給昊熹時間自己試試，在旁鼓勵，並在需要時幫忙。",
          reflection: "看見昊熹自己推好椅子、準備吃飯，我們很高興。",
          tags: ["生活參與", "動作協調"],
          media: [
            {
              kind: "video",
              videoId: "IYiabpo7nuI",
              poster: "ready-for-lunch",
              title: "昊熹推好椅子，準備吃飯",
              caption: "昊熹把自己的小椅子推到餐桌旁，準備吃午餐。",
              ratio: "portrait-video",
              autoplayPriority: 20,
            },
          ],
        },
        {
          title: "認識身體和家人",
          age: "18個月大",
          observation:
            "昊熹按照簡單指示，指出自己的眼、耳、口、鼻和身體，也會指出爸爸和媽媽。",
          support:
            "家人透過兒歌、圖書和日常遊戲，陪昊熹認識身體部位，也一起說說家人的稱呼。",
          reflection:
            "我們說，他來指；這些簡單的互動，也是和昊熹一起玩的快樂時光。",
          tags: ["認識身體", "認出家人"],
          media: [
            {
              kind: "video",
              videoId: "FW24LCUNS_w",
              poster: "body-and-family",
              title: "昊熹指出身體部位和家人",
              caption: "昊熹按照簡單指示，指出熟悉的身體部位，以及爸爸和媽媽。",
              ratio: "portrait-video",
              autoplayPriority: 70,
            },
          ],
        },
        {
          title: "輕輕走近小動物",
          age: "15至17個月大",
          observation:
            "爸爸媽媽帶昊熹到嘉道理農場看小動物，他近距離看着貓頭鷹，伸手輕輕摸一摸。另一次到農場時，他也把食物遞給小兔。",
          support:
            "爸爸媽媽陪他先觀察，再留意他和動物的反應，在安全、尊重動物的情況下慢慢靠近。",
          reflection:
            "我們喜歡和昊熹一起認識小動物，也陪他學習怎樣溫柔地對待牠們。",
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
              autoplayPriority: 60,
            },
          ],
        },
        {
          title: "小手翻過一頁頁書",
          age: "18個月大",
          observation:
            "昊熹自己翻開書本，細看書中的車、蜜蜂等圖畫；看完一頁，再自己翻到下一頁。",
          support:
            "家中低矮的書架放着繪本、中英文圖書和點讀書，讓昊熹隨時拿到。爸爸媽媽每天陪他閱讀，也給他時間自己選書、慢慢翻看。",
          reflection:
            "我們喜歡陪他讀書，也珍惜他自己專心翻看的時候。希望閱讀一直是他喜歡的事。",
          tags: ["自主翻閱", "專注閱讀"],
          media: [
            {
              kind: "video",
              videoId: "kgPKylmVI7s",
              poster: "reading-pages",
              title: "昊熹自己翻看圖書",
              caption: "昊熹自己看書，並自行翻到下一頁。",
              ratio: "portrait-video",
              autoplayPriority: 30,
            },
          ],
        },
        {
          title: "勇敢走進水中",
          age: "19至21個月大",
          observation:
            "昊熹在泳池裏游泳，大人在身旁照顧着他。",
          support:
            "大人會留意昊熹的反應，在安全照顧下鼓勵他嘗試，不急着催促他。",
          reflection:
            "我們希望他在安心的陪伴下，慢慢熟習水中的感覺，享受游泳。",
          tags: ["水中探索", "願意嘗試"],
          media: [
            {
              kind: "photo",
              name: "story-swimming",
              alt: "昊熹在泳池裏站着微笑，身旁可見大人的手。",
              caption: "七月的游泳時光：昊熹笑着站在水中，身旁有大人陪伴。",
              ratio: "landscape",
            },
            {
              kind: "video",
              videoId: "vWXWUHqovGc",
              poster: "swimming-september",
              title: "昊熹在大人陪伴下游泳",
              caption: "九月的游泳片段：昊熹在大人近身照顧下嘗試游泳。",
              ratio: "video",
              autoplayPriority: 40,
            },
          ],
        },
        {
          title: "再次走近音樂",
          age: "17個月大",
          observation:
            "每次到幼兒遊戲班，昊熹都會走到鋼琴旁，按一按琴鍵，聽聽不同的聲音。",
          support:
            "爸爸媽媽會繼續陪昊熹玩音樂遊戲，一起聽聽聲音、感受節奏。",
          reflection:
            "我們喜歡看他又走到鋼琴旁，也想多陪他玩一會兒。",
          tags: ["音樂探索", "主動參與"],
          media: [
            {
              kind: "video",
              videoId: "2RE83LVmTVk",
              poster: "piano-keys",
              title: "昊熹探索鋼琴琴鍵",
              caption: "昊熹再次走到鋼琴旁，按自己的方式探索琴鍵。",
              ratio: "portrait-video",
              autoplayPriority: 50,
            },
          ],
        },
      ],
    },
    growth: {
      eyebrow: "成長里程",
      title: "一步步向前，一點點長大",
      intro:
        "從扶着站立，到配對形狀、幫忙收拾、揮手道別，爸爸媽媽把昊熹日常裏值得記住的變化一一記下。",
      milestonesTitle: "十個日常小片段",
      milestonesIntro: "",
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
          moment: "一歲時，昊熹站在爸爸媽媽中間，牽着他們的手。",
          photo: {
            name: "growth-supported",
            alt: "1歲的昊熹站在爸爸媽媽中間，爸爸媽媽各牽着他一隻手。",
            caption: "1歲的昊熹，和爸爸媽媽牽手站在一起。",
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
          moment: "外出時，昊熹會一邊向身邊的人揮手，一邊說「Bye bye」，和大家道別。",
        },
        {
          time: "19個月大",
          title: "配對救護電單車",
          moment: "參觀消防局時，昊熹看見救護電單車，便舉起手中的玩具電單車，認出它們相似的地方。",
          photo: {
            name: "growth-rescue-motorcycle",
            alt: "19個月大的昊熹手拿綠黑色玩具電單車，身後停着一輛真實的黃色救護電單車，旁邊可見部分救護車。",
            caption: "昊熹舉起玩具電單車，身後停着一輛救護電單車。",
          },
        },
      ],
      portrait: {
        name: "portrait",
        alt: "13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。",
        caption: "昊熹13個月大時的照片。",
      },
    },
    family: {
      eyebrow: "家庭與陪伴",
      title: "在愛裏安心，在陪伴中自在探索",
      intro:
        "一起看書、玩耍、到戶外走走，是昊熹和家人熟悉的日常。我們珍惜相處的時間，也希望他在關愛和鼓勵中，放心去試、去探索。",
      photos: [
        {
          name: "family-main",
          alt: "15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。",
          caption: "花樹下，一家三口靠在一起，拍下這張我們很喜歡的合照。",
        },
        {
          name: "family-origin",
          alt: "6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。",
          caption: "爸爸媽媽帶6個月大的昊熹，來到當年相識的地方。",
        },
        {
          name: "family-care",
          alt: "4個月大的昊熹坐在軟墊嬰兒座椅上，身旁有大人伸手扶着他。",
          caption: "4個月大的昊熹坐在嬰兒座椅上，身邊的大人伸手扶着他。",
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
      reflection: "我們珍惜每天陪昊熹讀書、玩耍的時間，也喜歡一起到戶外走走。在安全的情況下，我們給他時間自己嘗試，並在需要時幫忙。我們會認真聽他表達，多給鼓勵，也以身作則，陪他學習關心和尊重別人。",
      hope: "我們盼望昊熹健康快樂地長大，保持好奇心，學會欣賞自己，也關心別人，慢慢成為善良、自信、有同理心的人。爸爸媽媽會陪着他，一起學習，一起成長。",
    },
    privacy: {
      body: "本作品集由昊熹的爸爸媽媽用心整理。為了好好守護這些珍貴片段，請勿複製、下載或轉載網站內的相片及影片。",
    },
    footer: {
      updated: "最後更新：2026年9月",
      top: "返回頁首",
    },
  },
};
