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
  assert.equal(pictures.length, 8);
  assert.equal(sources.length, 8);
  assert.equal(images.length, 8);

  const expected = locale === "en"
    ? [
        ["Nineteen-month-old Oliver looks towards the camera from inside a large green play vehicle.", "about-world", "1500"],
        ["Twelve-month-old Oliver sits close to an adult family member as they look at a board book together; the adult points to the page.", "about-reading", "1200"],
        ["Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.", "about-car", "1200"],
        ["Nineteen-month-old Oliver smiles in a swimming pool, with an adult close by.", "story-swimming", "800"],
        ["A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.", "portrait", "1600"],
        ["Eighteen-month-old Oliver stands with one arm raised, posing beside a display of colourful cartoon figures.", "growth-pose", "900"],
        ["Nineteen-month-old Oliver stands outdoors holding a yellow firefighter helmet.", "growth-firefighter", "1500"],
        ["Four-month-old Oliver sits in a cushioned baby seat while several people gently support him with their hands.", "family-care", "1500"],
      ]
    : [
        ["19個月大的昊熹身處一架大型綠色玩樂車輛內，望向鏡頭。", "about-world", "1500"],
        ["12個月大的昊熹依偎在一位成年家人身旁一起看圖書，家人正指着書頁。", "about-reading", "1200"],
        ["17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。", "about-car", "1200"],
        ["19個月大的昊熹在泳池裏開心地笑，身旁有成人陪伴。", "story-swimming", "800"],
        ["13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。", "portrait", "1600"],
        ["18個月大的昊熹站在色彩繽紛的卡通人物佈景旁，舉起一隻手臂擺姿勢。", "growth-pose", "900"],
        ["19個月大的昊熹站在戶外，雙手拿着一頂黃色消防頭盔。", "growth-firefighter", "1500"],
        ["4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正溫柔承托着他。", "family-care", "1500"],
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

  assert.equal(images.filter((tag) => getAttribute(tag, "loading") === "eager").length, 0);
  assert.equal(images.filter((tag) => getAttribute(tag, "loading") === "lazy").length, 8);
  assert.doesNotMatch(photoSurface, /10(?:0\d|1\d)|\.jpe?g|\b20\d{2}-\d{2}-\d{2}\b/i);
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
  assert.match(text, /connects everyday belongings with the person they belong to/);
  assert.match(text, /Everyday moments, held with care/);
  assert.match(text, /Small steps, quietly gathering/);
  assert.match(text, /One step, then another/);
  assert.match(text, /Family & Care/);
  assert.match(text, /Growing within a circle of care/);
  assert.match(text, /Oliver's days are held by many people who love him/);
  assert.match(text, /Held by many loving hands/);
  assert.match(text, /A pair of slippers, a little invitation/);
  assert.match(text, /A quiet portrait from 13 months/);
  assert.match(text, /How we continue alongside him/);
  assert.match(text, /Keeping these little days close/);
  assert.match(text, /Five learning stories, a handful of everyday observations/);
  for (const title of [
    "A page of his own",
    "Words that bring us together",
    "A door, a handle, a little idea",
    "The piano corner he always finds",
    "A little step into the water",
  ]) assert.match(text, new RegExp(title));
  assert.match(text, /Oliver's new portrait is coming/);
  assert.match(text, /A problem-solving moment to be added/);
  assert.match(text, /A noticing moment to be added/);
  assert.match(text, /Matching shapes/);
  assert.match(text, /Pouring between cups/);
  assert.match(text, /Joining tidy-up time/);
  assert.match(text, /Waving along the way/);
  assert.match(text, /中文 \| English/);
  assert.equal((html.match(/class="story-card/g) ?? []).length, 5);
  assert.equal((html.match(/class="youtube-video /g) ?? []).length, 6);
  assert.equal((html.match(/class="youtube-video-trigger"/g) ?? []).length, 6);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) ?? []).length, 6);
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
  assert.match(text, /把日常物品與它們的主人連繫起來/);
  assert.match(text, /把日常片段，輕輕收進故事裏/);
  assert.match(text, /把一點一滴，慢慢收進成長裏/);
  assert.match(text, /一步一步，慢慢走起來/);
  assert.match(text, /家庭與陪伴/);
  assert.match(text, /在愛與陪伴中，一起長大/);
  assert.match(text, /昊熹的日常，由許多疼愛他的人/);
  assert.match(text, /許多雙疼愛他的手/);
  assert.match(text, /一雙拖鞋的小邀請/);
  assert.match(text, /13個月大時留下的一張安靜近照/);
  assert.match(text, /我們如何繼續陪伴/);
  assert.match(text, /把這些小日子，好好珍藏/);
  assert.match(text, /五個成長故事、一些日常觀察/);
  for (const title of [
    "自己翻開下一頁",
    "聽見，也回應",
    "一扇門，一個小辦法",
    "總會走近的琴鍵",
    "水裏的一小步",
  ]) assert.match(text, new RegExp(title));
  assert.match(text, /新近照稍後加入/);
  assert.match(text, /解難小片段稍後加入/);
  assert.match(text, /觀察小片段稍後加入/);
  assert.match(text, /配對形狀/);
  assert.match(text, /倒進另一杯/);
  assert.match(text, /一起收拾/);
  assert.match(text, /揮手問好/);
  assert.match(text, /中文 \| English/);
  assert.equal((html.match(/class="story-card/g) ?? []).length, 5);
  assert.equal((html.match(/class="youtube-video /g) ?? []).length, 6);
  assert.equal((html.match(/class="youtube-video-trigger"/g) ?? []).length, 6);
  assert.equal((html.match(/youtube\.com\/watch\?v=/g) ?? []).length, 6);
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
  const [portfolio, controls, media, responsivePhoto, youtubeVideo, greeting, css] = await Promise.all([
    readFile(new URL("../app/OliverPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PortfolioControls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PreviewMedia.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ResponsivePhoto.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/YouTubeVideo.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GreetingReveal.tsx", import.meta.url), "utf8"),
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
  assert.doesNotMatch(youtubeVideo, /<video\b|autoPlay|\bloop\b/);
  assert.match(greeting, /sessionStorage\.setItem\(sessionKey, "seen"\)/);
  assert.match(responsivePhoto, /<picture>/);
  assert.match(responsivePhoto, /image\/avif/);
  assert.match(responsivePhoto, /\.webp/);
  assert.match(responsivePhoto, /loading=\{priority \? "eager" : "lazy"\}/);
  assert.doesNotMatch(responsivePhoto, /\.jpe?g|10(?:0\d|1\d)/i);
  assert.doesNotMatch(greeting, /setInterval|\bloop\b/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /animation:[^;}]*\bboth\b/);
  assert.match(css, /greeting-cursor-rest[\s\S]*?forwards/);
  assert.match(css, /@media print[\s\S]*?\.no-print[\s\S]*?display:\s*none !important/);
});
