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
  return match?.[1] ?? null;
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
  assert.doesNotMatch(html, /<img\b|<picture\b|<video\b|<source\b|<track\b|<iframe\b/i);
}

test("renders the refined English public homepage", async () => {
  const response = await render("/en/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = textContent(html);

  assert.match(html, /<html lang="en-HK">/i);
  assert.match(html, /<title>Oliver YEUNG \| A Little Learning Journey<\/title>/i);
  assert.match(html, /name="description" content="A warm collection of everyday moments, gathered with care by Oliver(?:&#x27;|')s parents,/i);
  assert.match(text, /Oliver's little learning journey/);
  assert.match(text, /Hello, I'm Oliver\./);
  assert.match(text, /Oliver's everyday world/);
  assert.match(text, /What sparks his curiosity/);
  assert.match(text, /How he shares and connects/);
  assert.match(text, /Everyday moments, told with care/);
  assert.match(text, /Small steps in everyday life/);
  assert.match(text, /Small changes we have noticed/);
  assert.match(text, /Family & Home/);
  assert.match(text, /Growing together at home/);
  assert.match(text, /Looking after one another/);
  assert.match(text, /How we responded/);
  assert.match(text, /Holding close the little moments/);
  assert.match(text, /hope in their own words/);
  assert.match(text, /中文 \| English/);
  assert.equal((text.match(/story to come · \d{2}/g) ?? []).length, 5);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<span class="sr-only">Hello, I(?:&#x27;|')m Oliver\.<\/span>/);
  assert.match(html, /class="greeting-visual" aria-hidden="true"/);
  assert.doesNotMatch(html, /href="\/en\/summary\/"/);
  assert.doesNotMatch(text, /\[[^\]]+\]/);
  for (const href of ["#about", "#stories", "#growth", "#family"]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
  expectMetadataAndIcons(html, "https://oliveryeung.com/en/");
  expectSafePage(html);
});

test("renders the refined Hong Kong Traditional Chinese homepage", async () => {
  const response = await render("/zh-hant/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = textContent(html);

  assert.match(html, /<html lang="zh-Hant-HK">/i);
  assert.match(html, /<title>昊熹｜小小成長旅程<\/title>/i);
  assert.match(html, /name="description" content="由爸爸媽媽用心整理的一個個日常片段/);
  assert.match(text, /昊熹的小小成長旅程/);
  assert.match(text, /你好，\s*我是昊熹。/);
  assert.match(text, /昊熹的日常小世界/);
  assert.match(text, /吸引他的日常小事/);
  assert.match(text, /他如何表達自己、與人連繫/);
  assert.match(text, /用心記下每個日常片段/);
  assert.match(text, /日常裏的一小步/);
  assert.match(text, /我們留意到的小轉變/);
  assert.match(text, /家庭與陪伴/);
  assert.match(text, /在家中，一起慢慢成長/);
  assert.match(text, /關心與彼此陪伴/);
  assert.match(text, /我們如何回應/);
  assert.match(text, /珍惜日常裏的小片段/);
  assert.match(text, /用自己的說話寫下一份心願/);
  assert.match(text, /中文 \| English/);
  assert.equal((text.match(/成長故事 \d{2} · 標題稍後加入/g) ?? []).length, 5);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<span class="sr-only">你好，我是昊熹。<\/span>/);
  assert.doesNotMatch(html, /href="\/zh-hant\/summary\/"/);
  assert.doesNotMatch(text, /\[[^\]]+\]/);
  expectMetadataAndIcons(html, "https://oliveryeung.com/zh-hant/");
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
  expectRobots(html);
  expectSafePage(html);
});

test("keeps preview media inert and motion source safe", async () => {
  const [portfolio, controls, media, greeting, css] = await Promise.all([
    readFile(new URL("../app/OliverPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PortfolioControls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PreviewMedia.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GreetingReveal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(portfolio, /<img\b|<picture\b|<video\b|autoPlay|\bloop\b/);
  assert.match(portfolio, /<PreviewMedia/);
  assert.doesNotMatch(portfolio, /copy\.videos|usePointerContextMenuDeterrent|SummaryLink/);
  assert.doesNotMatch(controls, /contextmenu|SummaryLink/);
  assert.doesNotMatch(media, /preview-play/);
  assert.match(greeting, /sessionStorage\.setItem\(sessionKey, "seen"\)/);
  assert.doesNotMatch(greeting, /setInterval|\bloop\b/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /greeting-cursor-rest[\s\S]*?forwards/);
  assert.match(css, /@media print[\s\S]*?\.no-print[\s\S]*?display:\s*none !important/);
});
