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

function expectApprovedPhotos(html, locale) {
  const photoSurface = html.replaceAll("/social-preview.jpg", "");
  const pictures = html.match(/<picture\b[^>]*>/gi) ?? [];
  const sources = html.match(/<source\b[^>]*>/gi) ?? [];
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  assert.equal(pictures.length, 14);
  assert.equal(sources.length, 14);
  assert.equal(images.length, 21);

  const expected = locale === "en"
    ? [
        ["Nineteen-month-old Oliver looks towards the camera from inside a large green play vehicle.", "about-world", "1500"],
        ["Twelve-month-old Oliver sits close to an adult family member as they look at a board book together; the adult points to the page.", "about-reading", "1200"],
        ["Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.", "about-car", "1200"],
        ["Eighteen-month-old Oliver stands in front of a group of colourful cartoon figures, raising one arm to point towards them.", "about-observing", "900"],
        ["Oliver smiles in a swimming pool, with an adult close by.", "story-swimming", "800"],
        ["Oliver is held between Mum and Dad beside an owl perched on a glove.", "story-animals", "800"],
        ["A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.", "portrait", "1600"],
        ["One-year-old Oliver stands between Mum and Dad while each parent holds one of his hands.", "growth-supported", "1500"],
        ["Oliver smiles broadly while holding both sides of a toddler swing.", "growth-swing", "1500"],
        ["Oliver stands outdoors holding a yellow firefighter helmet.", "growth-firefighter", "1500"],
        ["Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.", "family-main", "800"],
        ["Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.", "family-origin", "1500"],
        ["Four-month-old Oliver sits in a cushioned baby seat while several people gently support him with their hands.", "family-care", "1500"],
        ["One-year-old Oliver smiles outdoors while Mum and Dad hold him between them.", "family-playful", "1500"],
      ]
    : [
        ["19個月大的昊熹身處一架大型綠色玩樂車輛內，望向鏡頭。", "about-world", "1500"],
        ["12個月大的昊熹依偎在一位成年家人身旁一起看圖書，家人正指着書頁。", "about-reading", "1200"],
        ["17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。", "about-car", "1200"],
        ["18個月大的昊熹站在一組色彩繽紛的卡通人物佈景前，舉起一隻手指向人物。", "about-observing", "900"],
        ["昊熹在泳池裏開心地笑，身旁有大人陪伴。", "story-swimming", "800"],
        ["昊熹由爸爸媽媽抱在中間，身旁有一隻貓頭鷹停在手套上。", "story-animals", "800"],
        ["13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。", "portrait", "1600"],
        ["1歲的昊熹站在爸爸媽媽中間，爸爸媽媽各牽着他一隻手。", "growth-supported", "1500"],
        ["昊熹坐在幼兒鞦韆上，雙手扶着兩旁，開懷地笑。", "growth-swing", "1500"],
        ["昊熹站在戶外，雙手拿着一頂黃色消防頭盔。", "growth-firefighter", "1500"],
        ["15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。", "family-main", "800"],
        ["6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。", "family-origin", "1500"],
        ["4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正溫柔承托着他。", "family-care", "1500"],
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
    ["following-directions", "405", "720"],
    ["body-and-family", "405", "720"],
    ["reading-pages", "405", "720"],
    ["water-step", "405", "720"],
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

  assert.equal(images.filter((tag) => getAttribute(tag, "loading") === "eager").length, 0);
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
  assert.match(html, /<title>Oliver YEUNG \| A Little Learning Journey<\/title>/i);
  assert.match(html, /name="description" content="A warm collection of everyday moments, lovingly gathered by Oliver(?:&#x27;|')s parents,/i);
  assert.match(text, /Oliver's learning journey/);
  assert.match(text, /Hello, I'm Oliver\./);
  assert.match(text, /Oliver's everyday world/);
  assert.match(text, /Reading together/);
  assert.match(text, /Cars and dogs/);
  assert.match(text, /Working things out/);
  assert.match(text, /Noticing and remembering/);
  assert.match(text, /often chooses one from the shelf by himself/);
  assert.match(text, /vroom vroom/);
  assert.match(text, /glasses remind him of Dad, a bald head of Grandpa/);
  assert.match(text, /Welcome to Oliver's little world/);
  assert.match(text, /Everyday moments, held with care/);
  assert.match(text, /Small steps, quietly gathering/);
  assert.match(text, /Twelve everyday moments along the way/);
  assert.match(text, /Family & Care/);
  assert.match(text, /Growing within a circle of care/);
  assert.match(text, /Oliver's days unfold within the steady warmth of family/);
  assert.match(text, /Held by many loving hands/);
  assert.match(text, /Where our story began/);
  assert.match(text, /A quiet portrait from 13 months/);
  assert.match(text, /How we continue alongside him/);
  assert.match(text, /Growing alongside him/);
  assert.match(text, /a child's learning begins in the steady companionship of family/);
  for (const title of [
    "He listens, then responds",
    "Turning to the next page",
    "A little step into the water",
    "The piano corner he always finds",
    "A gentle hello to the animals",
  ]) assert.match(text, new RegExp(title));
  assert.ok(text.indexOf("He listens, then responds") < text.indexOf("Turning to the next page"));
  assert.ok(text.indexOf("Turning to the next page") < text.indexOf("A little step into the water"));
  assert.ok(text.indexOf("A little step into the water") < text.indexOf("The piano corner he always finds"));
  assert.ok(text.indexOf("The piano corner he always finds") < text.indexOf("A gentle hello to the animals"));
  assert.match(text, /Oliver's new portrait is coming/);
  assert.doesNotMatch(text, /problem-solving moment to be added|noticing moment to be added/i);
  assert.match(text, /Looking for what disappeared/);
  assert.match(text, /Matching shapes/);
  assert.match(text, /Pouring between cups/);
  assert.match(text, /Joining tidy-up time/);
  assert.match(text, /Waving Bye bye/);
  assert.equal((html.match(/class="growth-milestone(?: |")/g) ?? []).length, 12);
  assert.doesNotMatch(text, /Videos never play automatically/);
  assert.match(text, /中文 \| English/);
  assert.equal((html.match(/class="story-card/g) ?? []).length, 5);
  assert.equal((html.match(/class="youtube-video /g) ?? []).length, 7);
  assert.equal((html.match(/class="youtube-video-trigger"/g) ?? []).length, 7);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) ?? []).length, 0);
  assert.doesNotMatch(html, /<iframe\b|youtube-nocookie\.com\/embed/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<span class="sr-only">Hello, I(?:'|&#x27;)m Oliver\.<\/span>/);
  assert.match(html, /class="greeting-visual" aria-hidden="true"/);
  assert.doesNotMatch(html, /class="(?:button primary-button|hero-text-link)"[^>]*href="#(?:stories|about)"/);
  assert.doesNotMatch(html, /href="\/en\/summary\/"/);
  assert.doesNotMatch(text, /Print this page/);
  assert.doesNotMatch(text, /\[[^\]]+\]/);
  for (const href of ["#about", "#stories", "#growth", "#family"]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
  expectMetadataAndIcons(html, "https://oliveryeung.com/en/");
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
  assert.match(html, /name="description" content="爸爸媽媽用心收集一個個日常片段/);
  assert.match(text, /昊熹的成長旅程/);
  assert.match(text, /你好，\s*我是昊熹。/);
  assert.match(text, /昊熹的日常小世界/);
  assert.match(text, /親子共讀/);
  assert.match(text, /車和小狗/);
  assert.match(text, /專注解難/);
  assert.match(text, /細心觀察/);
  assert.match(text, /主動從書架拿書來看/);
  assert.match(text, /車一出現.*說「嗚嗚」/);
  assert.match(text, /戴眼鏡的是爸爸，光頭的是公公/);
  assert.match(text, /歡迎走進昊熹的小小世界/);
  assert.match(text, /把日常片段，輕輕收進故事裏/);
  assert.match(text, /把一點一滴，慢慢收進成長裏/);
  assert.match(text, /十二個日常片段，一步一步走來/);
  assert.match(text, /家庭與陪伴/);
  assert.match(text, /在愛與陪伴中，一起長大/);
  assert.match(text, /昊熹的日常，在家人安穩的愛裏慢慢展開/);
  assert.match(text, /許多雙疼愛他的手/);
  assert.match(text, /回到故事起點/);
  assert.match(text, /13個月大時留下的一張安靜近照/);
  assert.match(text, /我們如何繼續陪伴/);
  assert.match(text, /陪着他，一起長大/);
  assert.match(text, /孩子的成長從家庭裏每一次安穩的陪伴開始/);
  for (const title of [
    "聽見，也回應",
    "自己翻開下一頁",
    "水裏的一小步",
    "總會走近的琴鍵",
    "輕輕走近小動物",
  ]) assert.match(text, new RegExp(title));
  assert.ok(text.indexOf("聽見，也回應") < text.indexOf("自己翻開下一頁"));
  assert.ok(text.indexOf("自己翻開下一頁") < text.indexOf("水裏的一小步"));
  assert.ok(text.indexOf("水裏的一小步") < text.indexOf("總會走近的琴鍵"));
  assert.ok(text.indexOf("總會走近的琴鍵") < text.indexOf("輕輕走近小動物"));
  assert.match(text, /新近照稍後加入/);
  assert.doesNotMatch(text, /解難小片段稍後加入|觀察小片段稍後加入/);
  assert.match(text, /尋找躲起的物件/);
  assert.match(text, /把形狀放對位置/);
  assert.match(text, /倒進另一隻杯/);
  assert.match(text, /一起 Clean up/);
  assert.match(text, /揮手說 Bye bye/);
  assert.equal((html.match(/class="growth-milestone(?: |")/g) ?? []).length, 12);
  assert.doesNotMatch(text, /影片不會自動播放/);
  assert.match(text, /中文 \| English/);
  assert.equal((html.match(/class="story-card/g) ?? []).length, 5);
  assert.equal((html.match(/class="youtube-video /g) ?? []).length, 7);
  assert.equal((html.match(/class="youtube-video-trigger"/g) ?? []).length, 7);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) ?? []).length, 0);
  assert.doesNotMatch(html, /<iframe\b|youtube-nocookie\.com\/embed/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<span class="sr-only">你好，我是昊熹。<\/span>/);
  assert.doesNotMatch(html, /class="(?:button primary-button|hero-text-link)"[^>]*href="#(?:stories|about)"/);
  assert.doesNotMatch(html, /href="\/zh-hant\/summary\/"/);
  assert.doesNotMatch(text, /列印本頁/);
  assert.doesNotMatch(text, /\[[^\]]+\]/);
  expectMetadataAndIcons(html, "https://oliveryeung.com/zh-hant/");
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

test("keeps placeholders inert, photographs responsive, videos deferred, and motion source safe", async () => {
  const [portfolio, controls, media, responsivePhoto, youtubeVideo, greeting, welcomeIntro, css] = await Promise.all([
    readFile(new URL("../app/OliverPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PortfolioControls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PreviewMedia.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResponsivePhoto.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/YouTubeVideo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GreetingReveal.tsx", import.meta.url), "utf8"),
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
  assert.match(youtubeVideo, /onClick=\{\(\) => setActive\(true\)\}/);
  assert.match(youtubeVideo, /\{loadingLabel\}/);
  assert.match(youtubeVideo, /const posterSmall = landscape \? 320 : 240/);
  assert.match(youtubeVideo, /const posterLarge = landscape \? 480 : 405/);
  assert.match(youtubeVideo, /\/media\/video\/\$\{poster\}-\$\{posterSmall\}\.webp/);
  assert.match(youtubeVideo, /\/media\/video\/\$\{poster\}-\$\{posterLarge\}\.webp/);
  assert.match(youtubeVideo, /srcSet=/);
  assert.match(youtubeVideo, /alt=""/);
  assert.doesNotMatch(youtubeVideo, /i\.ytimg\.com|img\.youtube\.com/);
  assert.doesNotMatch(youtubeVideo, /<video\b|autoPlay|\bloop\b/);
  assert.match(greeting, /sessionStorage\.setItem\(sessionKey, "seen"\)/);
  assert.match(welcomeIntro, /sessionStorage\.getItem/);
  assert.match(welcomeIntro, /sessionStorage\.setItem/);
  assert.match(welcomeIntro, /prefers-reduced-motion: reduce/);
  assert.match(welcomeIntro, /window\.location\.hash/);
  assert.match(welcomeIntro, /event\.key === "Escape"/);
  assert.match(welcomeIntro, /setAttribute\("inert"/);
  assert.doesNotMatch(welcomeIntro, /<img|<picture|<source|welcome-photo|motionClass/);
  assert.match(welcomeIntro, /<div[\s\S]*?id="welcome-intro"/);
  assert.doesNotMatch(css, /welcome-photo|welcome-photo-pair/);
  assert.match(css, /\.welcome-message\s*\{[\s\S]*?animation:\s*welcome-message 3\.2s/);
  assert.match(welcomeIntro, /const welcomeDurationMs = 3200/);
  assert.match(welcomeIntro, /const completionTimer = window\.setTimeout\(\(\) => \{/);
  assert.match(welcomeIntro, /\}, welcomeDurationMs\);/);
  assert.match(welcomeIntro, /__oliverWelcomeFailOpenTimer/);
  assert.match(welcomeIntro, /window\.__oliverWelcomeShouldPlay = false/);
  assert.match(welcomeIntro, /welcomeWindow\.__oliverWelcomeShouldPlay === true &&[\s\S]*?root\?\.dataset\.welcomeState === "play"/);
  assert.match(welcomeIntro, /current\.dataset\.welcomeState = "hidden"/);
  assert.match(welcomeIntro, /document\.getElementById\("top"\)\?\.removeAttribute\("inert"\)/);
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
});
