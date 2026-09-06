import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function decodeHtml(text) {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&rsquo;", "’")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function textContent(html) {
  return decodeHtml(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<span\b[^>]*class="[^"]*sr-only[^"]*"[^>]*>[\s\S]*?<\/span>/gi, " ")
      .replace(/<wbr\s*\/?>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " "),
  ).trim();
}

function getAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}="([^"]*)"`, "i"));
  return match ? decodeHtml(match[1]) : null;
}

function findTag(html, tagName, predicate) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
  return tags.find(predicate) ?? null;
}

function expectRobots(html) {
  const robots = (html.match(/<meta\b[^>]*>/gi) ?? []).filter(
    (tag) => getAttribute(tag, "name")?.toLowerCase() === "robots",
  );
  assert.ok(robots.length > 0, "robots metadata is missing");
  const content = robots
    .map((tag) => getAttribute(tag, "content") ?? "")
    .join(",")
    .toLowerCase();
  for (const directive of ["noindex", "nofollow", "noarchive", "nosnippet", "noimageindex"]) {
    assert.match(content, new RegExp(`(?:^|,\\s*)${directive}(?:,|$)`));
  }
}

function expectLink(html, { rel, href, hrefLang }) {
  const link = findTag(html, "link", (tag) => {
    if (getAttribute(tag, "rel")?.toLowerCase() !== rel.toLowerCase()) return false;
    if (getAttribute(tag, "href") !== href) return false;
    return hrefLang ? getAttribute(tag, "hreflang") === hrefLang : true;
  });
  assert.ok(link, `missing ${rel} ${hrefLang ?? ""} ${href}`);
}

function expectMetadataAndIcons(html, canonical) {
  expectRobots(html);
  expectLink(html, { rel: "canonical", href: canonical });
  expectLink(html, {
    rel: "alternate",
    href: "https://oliveryeung.com/en/",
    hrefLang: "en-HK",
  });
  expectLink(html, {
    rel: "alternate",
    href: "https://oliveryeung.com/zh-hant/",
    hrefLang: "zh-Hant-HK",
  });
  expectLink(html, {
    rel: "alternate",
    href: "https://oliveryeung.com/",
    hrefLang: "x-default",
  });
  for (const icon of ["favicon.svg", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]) {
    assert.match(html, new RegExp(`href="(?:https:\\/\\/oliveryeung\\.com)?\\/${icon.replaceAll(".", "\\.")}"`, "i"));
  }
}

function expectNoForbiddenPublicCopy(html) {
  const publicSurface = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  for (const pattern of [
    /\bK\s*1\b/i,
    /\b(?:application|applicant|admissions?)\b/i,
    /kindergarten/i,
    /(?:入學|申請|招生|學生|繁體中文)/u,
    /(?:private portfolio|private review|unpublished review)/i,
    /(?:Content needed|Photo needed|Parent-provided|Alternative text will be added)/i,
    /(?:待補|待加入|預留|爸爸媽媽提供|未發佈|審閱版本)/u,
    /one-page summary|一頁摘要/i,
  ]) assert.doesNotMatch(publicSurface, pattern);

  assert.doesNotMatch(html, /OLIVER_BIRTH_DATE|NEXT_PUBLIC_|dateOfBirth|birthDate/);
  const privateBirthDate = process.env.OLIVER_BIRTH_DATE?.trim();
  if (privateBirthDate) assert.equal(html.includes(privateBirthDate), false);
}

function expectSafePage(html) {
  expectNoForbiddenPublicCopy(html);
  assert.doesNotMatch(
    html,
    /<form\b|social-share|google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net|doubleclick/i,
  );
  assert.doesNotMatch(html, /<video\b|<track\b|<iframe\b/i);
  assert.doesNotMatch(html, /<a\b[^>]*(?:download\b|href="\/media\/oliver\/)/i);
}

function expectRevisedStoryCopy(html) {
  assert.equal((html.match(/class="parent-reflection"/g) ?? []).length, 7);
  assert.doesNotMatch(html, /class="milestones-intro"/);
  assert.doesNotMatch(html, /<blockquote class="parent-reflection"/);
  const text = textContent(html);
  assert.doesNotMatch(text, /小椅子慢慢靠近餐桌|參與日常的一小步|以安全為界|兩雙熟悉的手|On his first birthday|journey he can open for himself/);
}

function expectApprovedPhotos(html, locale) {
  const photoSurface = html.replaceAll("/social-preview.jpg", "");
  const pictures = html.match(/<picture\b[^>]*>/gi) ?? [];
  const sources = html.match(/<source\b[^>]*>/gi) ?? [];
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  assert.equal(pictures.length, 14);
  assert.equal(sources.length, 14);
  assert.equal(images.length, 22);

  const expected = locale === "en"
    ? [
        ["Nineteen-month-old Oliver sits facing the camera in a studio portrait, wearing a white shirt and tan trousers.", "hero-portrait", "1600"],
        ["Nineteen-month-old Oliver inside a large green play car, looking towards the camera with one hand resting on its side.", "about-world", "1500"],
        ["Twelve-month-old Oliver sits close to Dad as they look at a board book together and Dad points to the page.", "about-reading", "1200"],
        ["Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.", "about-car", "1200"],
        ["Eighteen-month-old Oliver stands in front of a group of colourful cartoon figures, raising one arm to point towards them.", "about-observing", "900"],
        ["Oliver smiles while standing in the pool, with an adult's hand visible nearby.", "story-swimming", "800"],
        ["Oliver is held between Mum and Dad beside an owl perched on a glove.", "story-animals", "800"],
        ["A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.", "portrait", "1600"],
        ["One-year-old Oliver stands between Mum and Dad while each parent holds one of his hands.", "growth-supported", "1500"],
        ["Nineteen-month-old Oliver holds a green-and-black toy motorcycle, with a full-sized yellow rescue motorcycle and part of an ambulance behind him.", "growth-rescue-motorcycle", "1500"],
        ["Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.", "family-main", "800"],
        ["Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.", "family-origin", "1500"],
        ["Four-month-old Oliver sits in a cushioned baby seat, with adults' hands visible supporting him.", "family-care", "1500"],
        ["One-year-old Oliver smiles outdoors while Mum and Dad hold him between them.", "family-playful", "1500"],
      ]
    : [
        ["19個月大的昊熹穿着白色襯衣和淺棕色長褲，坐在柔和的紫灰色背景前，正面望向鏡頭。", "hero-portrait", "1600"],
        ["19個月大的昊熹在大型綠色玩具車裏，一隻手扶着車身，望向鏡頭。", "about-world", "1500"],
        ["12個月大的昊熹依偎在爸爸身旁一起看圖書，爸爸正指着書頁。", "about-reading", "1200"],
        ["17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。", "about-car", "1200"],
        ["18個月大的昊熹站在一組色彩繽紛的卡通人物佈景前，舉起一隻手指向人物。", "about-observing", "900"],
        ["昊熹在泳池裏站着微笑，身旁可見大人的手。", "story-swimming", "800"],
        ["昊熹由爸爸媽媽抱在中間，身旁有一隻貓頭鷹停在手套上。", "story-animals", "800"],
        ["13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。", "portrait", "1600"],
        ["1歲的昊熹站在爸爸媽媽中間，爸爸媽媽各牽着他一隻手。", "growth-supported", "1500"],
        ["19個月大的昊熹手拿綠黑色玩具電單車，身後停着一輛真實的黃色救護電單車，旁邊可見部分救護車。", "growth-rescue-motorcycle", "1500"],
        ["15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。", "family-main", "800"],
        ["6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。", "family-origin", "1500"],
        ["4個月大的昊熹坐在軟墊嬰兒座椅上，身旁有大人伸手扶着他。", "family-care", "1500"],
        ["1歲的昊熹在戶外由爸爸媽媽抱在中間，一家人一起笑。", "family-playful", "1500"],
      ];
  for (const [alt, name, height] of expected) {
    const image = images.find((tag) => getAttribute(tag, "alt") === alt);
    assert.ok(image, `missing photograph alt text: ${alt}`);
    assert.equal(getAttribute(image, "width"), "1200");
    assert.equal(getAttribute(image, "height"), height);
    assert.match(getAttribute(image, "sizes") ?? "", /vw|px/);
    assert.equal(getAttribute(image, "src"), `/media/oliver/${name}-800.webp`);
    const srcset = getAttribute(image, "srcset") ?? "";
    for (const width of [480, 800, 1200]) assert.match(srcset, new RegExp(`-${width}\\.webp ${width}w`));
  }

  for (const source of sources) {
    assert.equal(getAttribute(source, "type"), "image/avif");
    const srcset = getAttribute(source, "srcset") ?? "";
    for (const width of [480, 800, 1200]) assert.match(srcset, new RegExp(`-${width}\\.avif ${width}w`));
  }

  const posters = [
    ["problem-solving", "480", "270"],
    ["helping-laundry", "480", "480"],
    ["ready-for-lunch", "405", "720"],
    ["body-and-family", "405", "720"],
    ["reading-pages", "405", "720"],
    ["swimming-september", "480", "270"],
    ["piano-keys", "405", "720"],
    ["feeding-rabbits", "405", "720"],
  ];
  for (const [name, width, height] of posters) {
    const image = images.find((tag) => getAttribute(tag, "src") === `/media/video/${name}-${width}.webp`);
    assert.ok(image, `missing local video poster: ${name}`);
    assert.equal(getAttribute(image, "alt"), "");
    assert.equal(getAttribute(image, "width"), width);
    assert.equal(getAttribute(image, "height"), height);
    assert.equal(getAttribute(image, "loading"), "lazy");
    assert.match(getAttribute(image, "srcset") ?? "", new RegExp(`/media/video/${name}-`));
  }

  assert.equal(images.filter((tag) => getAttribute(tag, "loading") === "eager").length, 1);
  assert.equal(images.filter((tag) => getAttribute(tag, "loading") === "lazy").length, 21);
  assert.doesNotMatch(photoSurface, /10(?:0\d|1\d)|\.jpe?g|\b20\d{2}-\d{2}-\d{2}\b/i);
  assert.doesNotMatch(html, /i\.ytimg\.com|img\.youtube\.com/);
}

test("renders the refined English public homepage", async () => {
  const response = await render("/en/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = textContent(html);

  assert.match(html, /<html lang="en-HK">/i);
  assert.match(html, /id="welcome-intro"[^>]*tabindex="-1"/i);
  assert.match(html, /<main id="main-content"[^>]*>/i);
  assert.doesNotMatch(html, /<main[^>]*(?:\binert\b|aria-hidden="true")/i);
  assert.match(html, /<title>Oliver YEUNG \| A Learning Journey<\/title>/i);
  assert.match(html, /name="description" content="Everyday moments gathered by Oliver(?:&#x27;|')s parents,/i);
  assert.match(text, /Oliver's learning journey/);
  assert.match(text, /Hello, I'm Oliver\./);
  assert.match(text, /I'd love to share little moments and small challenges from my everyday life, and the time I spend exploring the world with my family\./);
  assert.doesNotMatch(text, /“Hello, I'm Oliver\.”/);
  assert.match(text, /Oliver's everyday world/);
  assert.match(text, /Reading together/);
  assert.match(text, /Cars and dogs/);
  assert.match(text, /Working things out/);
  assert.match(text, /Noticing and remembering/);
  assert.match(text, /often chooses a book from the shelf/);
  assert.match(text, /vroom vroom/);
  assert.match(text, /glasses make him think of Dad, a bald head of Grandpa/);
  assert.match(text, /Welcome to Oliver's little world/);
  assert.match(text, /Step by step, growing a little each day/);
  assert.match(text, /Everyday Stories/);
  assert.match(text, /Growth Milestones/);
  assert.match(text, /Ten everyday moments/);
  assert.match(text, /Family & Care/);
  assert.match(text, /Secure in love, free to explore/);
  assert.match(text, /Reading, playing and heading outdoors are familiar parts of Oliver's family life/);
  assert.match(text, /Oliver at 13 months/);
  assert.match(text, /How we support him/);
  assert.match(text, /Growing alongside him/);
  assert.match(text, /We believe a child's growth begins with steady, loving companionship at home/);
  for (const title of [
    "Listening and lending a hand",
    "Bringing his chair to the table",
    "Recognising his body and family",
    "A gentle hello to the animals",
    "Little hands turning page after page",
    "A brave step into the water",
    "Returning to music",
  ]) assert.match(text, new RegExp(title));
  assert.match(text, /Oliver swims in the pool with an adult close beside him/);
  assert.doesNotMatch(text, /Listening closely and following a request|tried to climb onto the pool edge/);
  assert.match(html, /<h3\b[^>]*>Listening and lending a hand<\/h3>\s*<p class="story-age">21 months<\/p>/);
  assert.match(html, /<h3\b[^>]*>Bringing his chair to the table<\/h3>\s*<p class="story-age">20 months<\/p>/);
  assert.match(html, /<h3\b[^>]*>A brave step into the water<\/h3>\s*<p class="story-age">19–21 months<\/p>/);
  assert.match(text, /Picture books, Chinese and English books, and books used with a reading pen are kept on low shelves within Oliver's reach/);
  assert.match(text, /Mum and Dad read with him every day/);
  assert.ok(text.indexOf("Listening and lending a hand") < text.indexOf("Bringing his chair to the table"));
  assert.ok(text.indexOf("Bringing his chair to the table") < text.indexOf("Little hands turning page after page"));
  assert.ok(text.indexOf("Little hands turning page after page") < text.indexOf("A brave step into the water"));
  assert.ok(text.indexOf("A brave step into the water") < text.indexOf("Returning to music"));
  assert.ok(text.indexOf("Returning to music") < text.indexOf("A gentle hello to the animals"));
  assert.ok(text.indexOf("A gentle hello to the animals") < text.indexOf("Recognising his body and family"));
  assert.match(text, /Oliver at 19 months/);
  assert.doesNotMatch(text, /problem-solving moment to be added|noticing moment to be added/i);
  assert.match(text, /Looking for what disappeared/);
  assert.match(text, /Matching shapes/);
  assert.match(text, /Pouring between cups/);
  assert.match(text, /Joining tidy-up time/);
  assert.match(text, /Waving Bye bye/);
  assert.match(text, /Matching the rescue motorcycle/);
  assert.match(text, /At the fire station, Oliver spots a rescue motorcycle and holds up his toy motorcycle/);
  assert.match(text, /Oliver holds up his toy motorcycle, with a full-sized rescue motorcycle behind him/);
  assert.equal((html.match(/class="growth-milestone(?: |")/g) ?? []).length, 10);
  assert.doesNotMatch(text, /Videos never play automatically/);
  assert.match(text, /中文 \| English/);
  assert.equal((html.match(/class="story-card/g) ?? []).length, 7);
  assert.equal((html.match(/class="youtube-video /g) ?? []).length, 8);
  assert.equal((html.match(/class="youtube-video-trigger"/g) ?? []).length, 8);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) ?? []).length, 0);
  assert.doesNotMatch(html, /<iframe\b|youtube-nocookie\.com\/embed/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /id="hero-title"[^>]*data-greeting-state="en-preparing"/);
  assert.match(html, /<span class="sr-only">[^<]*Hello, I(?:'|&#x27;)m Oliver\.[^<]*<\/span>/);
  assert.match(html, /class="greeting-visual" aria-hidden="true"/);
  assert.doesNotMatch(html, /class="(?:button primary-button|hero-text-link)"[^>]*href="#(?:stories|about)"/);
  assert.doesNotMatch(html, /href="\/en\/summary\/"/);
  assert.doesNotMatch(text, /Print this page/);
  assert.doesNotMatch(text, /\[[^\]]+\]/);
  for (const href of ["#about", "#stories", "#growth", "#family"]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
  expectMetadataAndIcons(html, "https://oliveryeung.com/en/");
  expectRevisedStoryCopy(html);
  expectApprovedPhotos(html, "en");
  expectSafePage(html);
});

test("renders the refined Hong Kong Traditional Chinese homepage", async () => {
  const response = await render("/zh-hant/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = textContent(html);

  assert.match(html, /<html lang="zh-Hant-HK">/i);
  assert.match(html, /<title>昊熹｜成長旅程<\/title>/i);
  assert.match(html, /name="description" content="爸爸媽媽用心記下昊熹的日常/);
  assert.match(text, /昊熹的成長旅程/);
  assert.match(text, /你好，\s*我是昊熹。/);
  assert.match(text, /我想和你分享我的生活點滴和小挑戰，還有與家人一起探索世界的時光。/);
  assert.doesNotMatch(text, /「你好，我是昊熹。」/);
  assert.match(text, /昊熹的日常小世界/);
  assert.match(text, /親子共讀/);
  assert.match(text, /車和小狗/);
  assert.match(text, /專注解難/);
  assert.match(text, /細心觀察/);
  assert.match(text, /主動從書架拿書/);
  assert.match(text, /看到車.*說「嗚嗚」/);
  assert.match(text, /戴眼鏡的像爸爸，光頭的像公公/);
  assert.match(text, /歡迎走進昊熹的小世界/);
  assert.match(text, /一步步向前，一點點長大/);
  assert.match(text, /生活點滴/);
  assert.match(text, /成長里程/);
  assert.match(text, /十個日常小片段/);
  assert.match(text, /家庭與陪伴/);
  assert.match(text, /在愛裏安心，在陪伴中自在探索/);
  assert.match(text, /一起看書、玩耍、到戶外走走，是昊熹和家人熟悉的日常/);
  assert.match(text, /昊熹13個月大時的照片/);
  assert.match(text, /我們如何陪伴/);
  assert.match(text, /陪着他，一起長大/);
  assert.match(text, /我們相信，孩子的成長始於家庭裏安穩而真誠的陪伴/);
  for (const title of [
    "聽懂指令，幫忙做家務",
    "推好椅子，準備開飯",
    "認識身體和家人",
    "輕輕走近小動物",
    "小手翻過一頁頁書",
    "勇敢走進水中",
    "再次走近音樂",
  ]) assert.match(text, new RegExp(title));
  assert.match(text, /昊熹在泳池裏游泳，大人在身旁照顧着他/);
  assert.doesNotMatch(text, /細心聆聽，跟着做|也試着自己爬上池邊/);
  assert.match(html, /<h3\b[^>]*>聽懂指令，幫忙做家務<\/h3>\s*<p class="story-age">21個月大<\/p>/);
  assert.match(html, /<h3\b[^>]*>推好椅子，準備開飯<\/h3>\s*<p class="story-age">20個月大<\/p>/);
  assert.match(html, /<h3\b[^>]*>勇敢走進水中<\/h3>\s*<p class="story-age">19至21個月大<\/p>/);
  assert.match(text, /家中低矮的書架放着繪本、中英文圖書和點讀書/);
  assert.ok(text.lastIndexOf("聽懂指令，幫忙做家務") < text.lastIndexOf("推好椅子，準備開飯"));
  assert.ok(text.lastIndexOf("推好椅子，準備開飯") < text.lastIndexOf("小手翻過一頁頁書"));
  assert.ok(text.lastIndexOf("小手翻過一頁頁書") < text.lastIndexOf("勇敢走進水中"));
  assert.ok(text.lastIndexOf("勇敢走進水中") < text.lastIndexOf("再次走近音樂"));
  assert.ok(text.lastIndexOf("再次走近音樂") < text.lastIndexOf("輕輕走近小動物"));
  assert.ok(text.lastIndexOf("輕輕走近小動物") < text.lastIndexOf("認識身體和家人"));
  assert.match(text, /昊熹19個月大時的照片/);
  assert.doesNotMatch(text, /解難小片段稍後加入|觀察小片段稍後加入/);
  assert.match(text, /尋找躲起的物件/);
  assert.match(text, /把形狀放對位置/);
  assert.match(text, /倒進另一隻杯/);
  assert.match(text, /一起 Clean up/);
  assert.match(text, /揮手說 Bye bye/);
  assert.match(text, /配對救護電單車/);
  assert.match(text, /參觀消防局時，昊熹看見救護電單車，便舉起手中的玩具電單車/);
  assert.match(text, /昊熹舉起玩具電單車，身後停着一輛救護電單車/);
  assert.equal((html.match(/class="growth-milestone(?: |")/g) ?? []).length, 10);
  assert.doesNotMatch(text, /影片不會自動播放/);
  assert.match(text, /中文 \| English/);
  assert.equal((html.match(/class="story-card/g) ?? []).length, 7);
  assert.equal((html.match(/class="youtube-video /g) ?? []).length, 8);
  assert.equal((html.match(/class="youtube-video-trigger"/g) ?? []).length, 8);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) ?? []).length, 0);
  assert.doesNotMatch(html, /<iframe\b|youtube-nocookie\.com\/embed/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /id="hero-title"[^>]*data-greeting-state="zh-preparing"/);
  assert.match(html, /<span class="sr-only">[^<]*你好，我是昊熹。[^<]*<\/span>/);
  assert.doesNotMatch(html, /class="(?:button primary-button|hero-text-link)"[^>]*href="#(?:stories|about)"/);
  assert.doesNotMatch(html, /href="\/zh-hant\/summary\/"/);
  assert.doesNotMatch(text, /列印本頁/);
  assert.doesNotMatch(text, /\[[^\]]+\]/);
  expectMetadataAndIcons(html, "https://oliveryeung.com/zh-hant/");
  expectRevisedStoryCopy(html);
  expectApprovedPhotos(html, "zh");
  expectSafePage(html);
});

test("renders an immediate root language handoff with a no-JavaScript fallback", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = textContent(html);

  assert.match(html, /window\.localStorage\.getItem\("oliver-portfolio-language"\)/);
  assert.match(html, /window\.navigator\.language/);
  assert.match(html, /startsWith\("zh"\)/);
  assert.match(html, /window\.location\.replace/);
  assert.match(html, /<noscript>/i);
  assert.match(html, /aria-label="中文 \| English"/);
  assert.match(html, /href="\/zh-hant\/"[^>]*>中文<\/a>/i);
  assert.match(html, /href="\/en\/"[^>]*>English<\/a>/i);
  assert.doesNotMatch(text, /Opening|Loading|Continue in English|正在開啟|以中文繼續/i);
  expectMetadataAndIcons(html, "https://oliveryeung.com/");
  assert.doesNotMatch(html, /<img\b|<picture\b|<source\b/i);
  expectNoForbiddenPublicCopy(html);
});

test("does not retain the removed one-page summary routes", async () => {
  for (const pathname of ["/en/summary/", "/zh-hant/summary/"]) {
    const response = await render(pathname);
    assert.equal(response.status, 404, pathname);
    const html = await response.text();
    expectNoForbiddenPublicCopy(html);
  }
});

test("keeps the bilingual custom 404 safe", async () => {
  const html = await readFile(new URL("../dist/client/404.html", import.meta.url), "utf8");
  if (html.trim() === "Not Found") return;

  const text = textContent(html);
  assert.match(text, /We couldn't find this little page\./);
  assert.match(text, /暫時找不到這一頁。/);
  assert.match(html, /href="\/en\/"/);
  assert.match(html, /href="\/zh-hant\/"/);
  assert.match(html, /aria-label="中文 \| English"/);
  assert.doesNotMatch(html, /<img\b|<picture\b|<source\b/i);
  expectRobots(html);
  expectSafePage(html);
});

test("keeps placeholders absent, photographs responsive, videos deferred, and motion source safe", async () => {
  const [portfolio, controls, media, responsivePhoto, youtubeVideo, greeting, heroPortraitMotion, welcomeIntro, css] = await Promise.all([
    readFile(new URL("../app/OliverPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PortfolioControls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PreviewMedia.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResponsivePhoto.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/YouTubeVideo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GreetingReveal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/HeroPortraitMotion.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/WelcomeIntro.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(portfolio, /<img\b|<picture\b|<video\b|autoPlay|\bloop\b/);
  assert.match(portfolio, /<PreviewMedia/);
  assert.ok((portfolio.match(/<ResponsivePhoto/g) ?? []).length >= 6);
  assert.match(portfolio, /<YouTubeVideo/);
  assert.doesNotMatch(portfolio, /copy\.videos|usePointerContextMenuDeterrent|SummaryLink/);
  assert.doesNotMatch(controls, /contextmenu|SummaryLink/);
  assert.doesNotMatch(media, /preview-play/);
  assert.match(youtubeVideo, /active \? \(/);
  assert.match(youtubeVideo, /youtube-nocookie\.com\/embed/);
  assert.match(youtubeVideo, /loading="lazy"/);
  assert.match(youtubeVideo, /onClick=\{\(\) => requestManualPlayback\(videoId\)\}/);
  assert.match(youtubeVideo, /\{loadingLabel\}/);
  assert.match(youtubeVideo, /const posterSmall = landscape \? 320 : 240/);
  assert.match(youtubeVideo, /const posterLarge = landscape \? 480 : 405/);
  assert.match(youtubeVideo, /\/media\/video\/\$\{poster\}-\$\{posterSmall\}\.webp/);
  assert.match(youtubeVideo, /\/media\/video\/\$\{poster\}-\$\{posterLarge\}\.webp/);
  assert.match(youtubeVideo, /srcSet=/);
  assert.match(youtubeVideo, /alt=""/);
  assert.doesNotMatch(youtubeVideo, /i\.ytimg\.com|img\.youtube\.com/);
  assert.match(youtubeVideo, /autoplay=1&mute=1&enablejsapi=1&playsinline=1/);
  assert.match(youtubeVideo, /VIDEO_SOUND_SESSION_KEY = "oliver-video-sound-v1"/);
  assert.match(youtubeVideo, /sessionStorage\.getItem\(VIDEO_SOUND_SESSION_KEY\)/);
  assert.match(youtubeVideo, /requestManualPlayback[\s\S]*?setVideoSoundEnabled\(true\)[\s\S]*?entry\.activate\(true\)/);
  assert.match(youtubeVideo, /sendCommand\("setVolume", \[65\]\)/);
  assert.match(youtubeVideo, /sendCommand\("unMute"\)/);
  assert.match(youtubeVideo, /args: \["onAutoplayBlocked"\]/);
  assert.match(youtubeVideo, /aria-pressed=\{soundEnabled\}/);
  assert.match(css, /\.youtube-video-sound\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(youtubeVideo, /const START_RATIO = 0\.65/);
  assert.match(youtubeVideo, /const STOP_RATIO = 0\.35/);
  assert.match(youtubeVideo, /const AUTOPLAY_DWELL_MS = 350/);
  assert.match(youtubeVideo, /let activePlaybackKey: string \| null = null/);
  assert.match(youtubeVideo, /const preferred = visibleCandidates\[0\]/);
  assert.match(youtubeVideo, /candidate\.priority < entry\.priority/);
  assert.match(youtubeVideo, /current\.activation === "auto"[\s\S]*?!current\.playing[\s\S]*?hasHigherPriorityBlocker\(current\)/);
  assert.match(youtubeVideo, /next\.activate\(false\)/);
  assert.match(youtubeVideo, /entry\.activate\(true\)/);
  assert.match(youtubeVideo, /document\.visibilityState !== "visible"/);
  assert.match(youtubeVideo, /window\.addEventListener\("pagehide", pauseActivePlayback\)/);
  assert.match(youtubeVideo, /prefers-reduced-motion: reduce/);
  assert.match(youtubeVideo, /connection\?\.saveData !== true/);
  assert.match(youtubeVideo, /const autoStartAllowed = scrollAutoplayAllowed\(\)/);
  assert.match(youtubeVideo, /if \(!autoStartAllowed\)[\s\S]*?current\?\.activation === "auto"[\s\S]*?return/);
  assert.doesNotMatch(youtubeVideo, /!scrollAutoplayAllowed\(\) \|\| document\.visibilityState/);
  assert.match(youtubeVideo, /entry\.suppressed = true/);
  assert.match(youtubeVideo, /notifyUserPaused\(videoId\)/);
  assert.match(youtubeVideo, /focusAfterLoadRef\.current = manual/);
  assert.match(youtubeVideo, /if \(active && focusAfterLoadRef\.current\)[\s\S]*?iframeRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(youtubeVideo, /<video\b|\bautoPlay\b|\bloop\b|useLayoutEffect|onClick=\{\(\) => setActive\(true\)\}/);
  assert.match(greeting, /sessionStorage\.setItem\(sessionKey, "seen"\)/);
  assert.match(greeting, /data-greeting-state=\{preparingState\}/);
  assert.match(greeting, /className="greeting-visual"\s+aria-hidden="true"\s*>/);
  assert.doesNotMatch(greeting, /visual\.style\.visibility/);
  assert.match(greeting, /<noscript>[\s\S]*?<style>/);
  assert.doesNotMatch(greeting, /data-greeting-state="static"/);
  assert.match(css, /data-greeting-state\$="-preparing"[\s\S]*?visibility:\s*hidden/);
  assert.match(heroPortraitMotion, /oliver-portrait-\$\{locale\}-v1/);
  assert.match(heroPortraitMotion, /data-portrait-motion="waiting"/);
  assert.match(css, /animation:\s*hero-portrait-hello 820ms/);
  assert.match(welcomeIntro, /sessionStorage\.getItem/);
  assert.match(welcomeIntro, /sessionStorage\.setItem/);
  assert.match(welcomeIntro, /prefers-reduced-motion: reduce/);
  assert.match(welcomeIntro, /window\.location\.hash/);
  assert.match(welcomeIntro, /event\.key === "Escape"/);
  assert.doesNotMatch(welcomeIntro, /(?:set|remove)Attribute\("inert"/);
  assert.match(welcomeIntro, /tabIndex=\{-1\}/);
  assert.match(welcomeIntro, /document\.addEventListener\("focusin", keepFocusOnWelcome, true\)/);
  assert.match(welcomeIntro, /event\.key === "Tab"[\s\S]*?event\.preventDefault\(\)[\s\S]*?root\.focus/);
  assert.match(welcomeIntro, /document\.removeEventListener\("focusin", keepFocusOnWelcome, true\)/);
  assert.match(welcomeIntro, /heroTitle\.dataset\.welcomeFocus = "quiet"/);
  assert.match(welcomeIntro, /window\.addEventListener\("keydown", clearQuietFocus, true\)/);
  assert.match(welcomeIntro, /window\.addEventListener\("pointerdown", clearQuietFocus, true\)/);
  assert.match(css, /\.greeting-heading\[data-welcome-focus="quiet"\]:focus-visible\s*\{[\s\S]*?outline:\s*none/);
  assert.doesNotMatch(welcomeIntro, /<img|<picture|<source|welcome-photo|motionClass/);
  assert.match(welcomeIntro, /<div[\s\S]*?id="welcome-intro"/);
  assert.doesNotMatch(css, /welcome-photo|welcome-photo-pair/);
  assert.match(css, /\.welcome-message\s*\{[\s\S]*?animation:\s*welcome-message 3\.2s/);
  assert.match(welcomeIntro, /const welcomeDurationMs = 3200/);
  assert.match(welcomeIntro, /const completionTimer = window\.setTimeout\(\(\) => \{/);
  assert.match(welcomeIntro, /\}, remainingMs\);/);
  assert.match(welcomeIntro, /__oliverWelcomeFailOpenTimer/);
  assert.match(welcomeIntro, /window\.__oliverWelcomeShouldPlay = false/);
  assert.match(welcomeIntro, /welcomeWindow\.__oliverWelcomeShouldPlay === true &&[\s\S]*?root\?\.dataset\.welcomeState === "play"/);
  assert.match(welcomeIntro, /current\.dataset\.welcomeState = "hidden"/);
  assert.match(welcomeIntro, /document\.body\.classList\.remove\("welcome-open"\)/);
  assert.match(css, /@keyframes welcome-surface[\s\S]*?100%\s*\{[\s\S]*?visibility:\s*hidden[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.growth-milestone-list \.timeline-dot\s*\{[\s\S]*?width:\s*18px[\s\S]*?border:\s*4px solid var\(--sage\)[\s\S]*?background:\s*var\(--honey\)/);
  assert.match(css, /data-welcome-state="exiting"\][\s\S]*?animation:\s*welcome-exit 280ms/);
  assert.doesNotMatch(welcomeIntro, /skipLabel|welcome-skip|Skip welcome|略過歡迎/);
  assert.doesNotMatch(css, /\.welcome-skip/);
  assert.doesNotMatch(welcomeIntro, /setInterval|\bloop\b/);
  assert.match(responsivePhoto, /<picture>/);
  assert.match(responsivePhoto, /image\/avif/);
  assert.match(responsivePhoto, /\.webp/);
  assert.match(responsivePhoto, /loading=\{priority \? "eager" : "lazy"\}/);
  assert.doesNotMatch(responsivePhoto, /\.jpe?g|10(?:0\d|1\d)/i);
  assert.doesNotMatch(greeting, /setInterval|\bloop\b/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.welcome-intro[\s\S]*?display:\s*none !important/);
  assert.doesNotMatch(css, /animation:[^;}]*\bboth\b/);
  assert.match(css, /greeting-cursor-rest[\s\S]*?forwards/);
  assert.match(css, /@media print[\s\S]*?\.no-print[\s\S]*?display:\s*none !important/);
  assert.match(css, /\.family-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media \(min-width: 48rem\)[\s\S]*?\.family-media-grid\s*\{[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)[\s\S]*?\.family-photo-main\s*\{[\s\S]*?grid-column:\s*1 \/ -1/);
  assert.match(portfolio, /className="family-photo family-photo-inline"/);
  assert.match(css, /@media \(min-width: 60rem\)[\s\S]*?\.family-grid\s*\{[\s\S]*?minmax\(280px, 0\.72fr\) minmax\(0, 1\.28fr\)/);
  assert.match(css, /@media \(min-width: 60rem\)[\s\S]*?\.stories-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media \(min-width: 72rem\)[\s\S]*?\.story-card-multi-media \.story-media-count-2/);
});
