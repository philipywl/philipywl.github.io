// Keep photograph captions tied to the image, even if the album is reordered.
const edits = {
  zh: {
    intro: "昊熹喜歡看書和玩車。遇到有趣的玩具，他會停下來看看，伸手試試。爸爸媽媽陪着他，一起發現日常中的小趣事。",
    cards: {
      "about-car": {
        title: "小小司機",
        body: "平日看見車，昊熹會學着說「嗚嗚」。這回坐在方向盤後面，他望着鏡頭笑了。",
      },
      "about-observing": {
        body: "跟史諾比合照時，昊熹舉手指向身後的卡通人物。平日看卡通，戴眼鏡的人物讓他想起爸爸，長頭髮的讓他想起媽媽。",
      },
    },
    animals: "在嘉道理農場，我們抱着昊熹和貓頭鷹合照。那天他還伸手輕輕摸了摸牠。餵小兔的影片則是另一次到農場時拍的。",
    photos: {
      "about-world": {
        alt: "昊熹站在沖天遙控車裏，一隻手扶着車邊。",
        caption: "19個月大時，昊熹跟家人外出，和沖天遙控車合照。",
      },
      "about-car": {caption: "17個月大的昊熹，坐上了黑色玩具車。"},
      "about-observing": {
        alt: "昊熹穿着吊帶褲，舉手指向身後的卡通人物。史諾比戴着黃色皇冠，站在他身旁。",
        caption: "18個月大，和史諾比合照。",
      },
      "story-animals": {
        alt: "爸爸抱着戴帽子的昊熹，媽媽靠在他身旁，一隻白色臉的貓頭鷹就在三人面前。",
        caption: "在嘉道理農場，一家三口和貓頭鷹合照。",
      },
      "story-swimming": {
        alt: "昊熹穿着淺藍色衣袖的泳衣，在池水裏張口大笑。",
        caption: "七月玩水時，我們拍下了昊熹的笑容。",
      },
      "family-care": {
        alt: "昊熹靠在灰色軟墊上，大人牽着他的小手，托着他的一雙小腳。",
        caption: "昊熹4個月大時，他的一雙小腳還放得進我們的手掌。",
      },
    },
  },
  en: {
    intro: "Oliver loves books and toy cars. When a toy catches his interest, he stops to look and try it out. Mum and Dad share these everyday discoveries with him.",
    cards: {
      "about-car": {
        title: "Behind the wheel",
        body: "When Oliver sees a car, he likes to say “vroom vroom.” This time he had the driver's seat to himself and gave us a smile.",
      },
      "about-observing": {
        body: "Posing with Snoopy, Oliver points up at the characters behind him. When he looks at cartoons, glasses remind him of Dad and long hair reminds him of Mum.",
      },
    },
    animals: "At Kadoorie Farm, we held Oliver for a family photo with an owl. We remember him reaching out to touch it gently that day. The video of him feeding a rabbit is from another farm visit.",
    photos: {
      "about-world": {
        alt: "Oliver stands inside the RC Car with one hand resting on its side.",
        caption: "Oliver with the RC Car on a family outing at 19 months.",
      },
      "about-car": {caption: "Oliver in the black play car at 17 months."},
      "about-observing": {
        alt: "Wearing dungarees, Oliver points up at the cartoon figures behind him. Snoopy stands beside him wearing a yellow crown.",
        caption: "A photo with Snoopy at 18 months.",
      },
      "story-animals": {
        alt: "Dad holds Oliver, who is wearing a sun hat. Mum leans in beside them, with a white-faced owl in the foreground.",
        caption: "Our family photo with an owl at Kadoorie Farm.",
      },
      "story-swimming": {
        alt: "Oliver laughs in the pool, wearing a swim top with pale blue sleeves.",
        caption: "We caught this smile during a swim in July.",
      },
      "family-care": {
        alt: "Oliver rests against a grey cushion. Adult hands hold his little hands and cradle his bare feet.",
        caption: "At four months, both his feet still fit in the palm of a hand.",
      },
    },
  },
};

export function applyAlbumMediaCopy(portfolio) {
  for (const [locale, edit] of Object.entries(edits)) {
    const {about, stories, family} = portfolio[locale];
    about.intro = edit.intro;
    const animalStory = stories.items.find(story => story.media.some(medium => medium.name === "story-animals"));
    animalStory.observation = edit.animals;
    const photos = [
      about.mainPhoto,
      ...about.fields.map(field => field.media),
      ...stories.items.flatMap(story => story.media),
      ...family.photos,
    ];
    for (const [name, copy] of Object.entries(edit.cards)) {
      Object.assign(about.fields.find(field => field.media.name === name), copy);
    }
    for (const [name, copy] of Object.entries(edit.photos)) {
      Object.assign(photos.find(photo => photo.name === name), copy);
    }
  }
}
