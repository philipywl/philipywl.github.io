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
  // Next adds its own noindex tag to the global 404. Treat multiple robots
  // tags as one combined directive set, as crawlers do.
  const content = robots
    .map((tag) => getAttribute(tag, "content") ?? "")
    .join(",")
    .toLowerCase();
  for (const directive of ["noindex", "nofollow", "noarchive", "nosnippet", "noimageindex"]) {
    assert.match(content, new RegExp(`(?:^|,\\s*)${directive}(?:,|$)`), `robots lacks ${directive}`);
  }
}

function expectLink(html, { rel, href, hrefLang }) {
  const link = findTag(html, "link", (tag) => {
    if (getAttribute(tag, "rel")?.toLowerCase() !== rel.toLowerCase()) return false;
    if (getAttribute(tag, "href") !== href) return false;
    return hrefLang ? getAttribute(tag, "hreflang") === hrefLang : true;
  });
  assert.ok(link, `missing ${rel} link ${hrefLang ? `${hrefLang} ` : ""}${href}`);
}

function expectMetadataAndIcons(html, canonical, englishPath, chinesePath) {
  expectRobots(html);
  expectLink(html, { rel: "canonical", href: canonical });
  expectLink(html, {
    rel: "alternate",
    href: `https://oliveryeung.com${englishPath}`,
    hrefLang: "en-HK",
  });
  expectLink(html, {
    rel: "alternate",
    href: `https://oliveryeung.com${chinesePath}`,
    hrefLang: "zh-Hant-HK",
  });
  expectLink(html, {
    rel: "alternate",
    href: "https://oliveryeung.com/",
    hrefLang: "x-default",
  });
  assert.match(html, /href="(?:https:\/\/oliveryeung\.com)?\/favicon\.svg"/i);
  assert.match(html, /href="(?:https:\/\/oliveryeung\.com)?\/favicon-32x32\.png"/i);
  assert.match(html, /href="(?:https:\/\/oliveryeung\.com)?\/favicon-16x16\.png"/i);
  assert.match(html, /href="(?:https:\/\/oliveryeung\.com)?\/apple-touch-icon\.png"/i);
}

function expectNoForbiddenPublicCopy(html) {
  const publicSurface = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const publicCopyPatterns = [
    /\bK\s*1\b/i,
    /\b(?:application|applicant|admissions?)\b/i,
    /kindergarten/i,
    /(?:入學|申請|招生|學生|繁體中文)/u,
    /(?:private portfolio|private review|unpublished review)/i,
    /(?:Content needed|Photo needed|Parent-provided|Alternative text will be added|Placeholder)/i,
    /(?:待補|待加入|預留|爸爸媽媽提供|未發佈|審閱版本)/u,
  ];

  for (const pattern of publicCopyPatterns) assert.doesNotMatch(publicSurface, pattern);
  assert.doesNotMatch(html, /OLIVER_BIRTH_DATE|NEXT_PUBLIC_|dateOfBirth|birthDate/);

  const privateBirthDate = process.env.OLIVER_BIRTH_DATE?.trim();
  if (privateBirthDate) {
    assert.equal(html.includes(privateBirthDate), false, "private birth date leaked into rendered HTML");
  }
}

function expectSafePage(html) {
  expectNoForbiddenPublicCopy(html);
  assert.doesNotMatch(
    html,
    /<form\b|social-share|google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net|doubleclick/i,
  );
  assert.doesNotMatch(html, /<img\b|<picture\b|<video\b|<source\b|<track\b/i);
}

test("renders the approved English public homepage", async () => {
  const response = await render("/en/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const text = textContent(html);
  assert.match(html, /<html lang="en-HK">/i);
  assert.match(html, /<title>Oliver Yeung \| A Little Learning Journey<\/title>/i);
  assert.match(
    html,
    /name="description" content="A warm collection of everyday moments showing how Oliver explores, connects and grows at his own pace\."/i,
  );
  assert.match(text, /Oliver's little learning journey/);
  assert.match(text, /Hello, I'm Oliver\./);
  assert.match(text, /A small collection of everyday moments showing how Oliver explores, connects and grows at his own pace\./);
  assert.match(text, /Everyday moments/);
  assert.match(text, /At his own pace/);
  assert.match(text, /Shared with care/);
  assert.match(
    text,
    /This portfolio is shared by Oliver's parents\. Please do not copy, download or redistribute its photographs or videos\./,
  );
  assert.match(text, /中文 \| English/);
  assert.match(html, /href="\/en\/summary\/"/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<span class="sr-only">Hello, I(?:&#x27;|')m Oliver\.<\/span>/);
  assert.match(html, /class="greeting-visual" aria-hidden="true"/);
  assert.match(text, /Explore Oliver's learning stories/);
  assert.match(text, /Content preview/);
  assert.match(text, /A little about Oliver/);
  assert.match(text, /Everyday moments, told with care/);
  assert.match(text, /A calm home for future videos/);
  assert.match(text, /Everyday growth and small steps/);
  assert.match(text, /The people and rhythms around Oliver/);
  for (const href of ["#top", "#stories", "#growth", "#family"]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }

  expectMetadataAndIcons(
    html,
    "https://oliveryeung.com/en/",
    "/en/",
    "/zh-hant/",
  );
  expectSafePage(html);
});

test("renders the approved Hong Kong Traditional Chinese homepage", async () => {
  const response = await render("/zh-hant/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const text = textContent(html);
  assert.match(html, /<html lang="zh-Hant-HK">/i);
  assert.match(html, /<title>昊熹｜小小成長旅程<\/title>/i);
  assert.match(
    html,
    /name="description" content="透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。"/i,
  );
  assert.match(text, /昊熹的小小成長旅程/);
  assert.match(text, /你好，\s*我是昊熹。/);
  assert.match(text, /透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。/);
  assert.match(text, /日常片段/);
  assert.match(text, /按自己的步伐/);
  assert.match(text, /用心分享/);
  assert.match(text, /本作品集由昊熹的爸爸媽媽整理。請勿複製、下載或轉載網站內的相片及影片。/);
  assert.match(text, /中文 \| English/);
  assert.match(html, /href="\/zh-hant\/summary\/"/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /<span class="sr-only">你好，我是昊熹。<\/span>/);
  assert.match(html, /class="greeting-visual" aria-hidden="true"/);
  assert.match(text, /閱讀昊熹的成長故事/);
  assert.match(text, /內容預覽/);
  assert.match(text, /關於昊熹的一點點/);
  assert.match(text, /用心記下每個日常片段/);
  assert.match(text, /讓將來的影片自然融入故事/);
  assert.match(text, /日常成長與一小步一小步/);
  assert.match(text, /陪伴昊熹成長的人與日常/);

  expectMetadataAndIcons(
    html,
    "https://oliveryeung.com/zh-hant/",
    "/en/",
    "/zh-hant/",
  );
  expectSafePage(html);
});

test("renders both richer one-page previews without unsupported facts", async () => {
  const cases = [
    {
      pathname: "/en/summary/",
      lang: "en-HK",
      title: "Oliver at a glance",
      intro: "A small collection of everyday moments showing how Oliver explores, connects and grows at his own pace.",
      updated: "Last updated 11 July 2026",
      home: "Back to home",
      print: "Print this page",
      privacy: "This portfolio is shared by Oliver's parents. Please do not copy, download or redistribute its photographs or videos.",
      canonical: "https://oliveryeung.com/en/summary/",
    },
    {
      pathname: "/zh-hant/summary/",
      lang: "zh-Hant-HK",
      title: "昊熹的一頁摘要",
      intro: "透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。",
      updated: "最後更新：2026年7月11日",
      home: "返回首頁",
      print: "列印本頁",
      privacy: "本作品集由昊熹的爸爸媽媽整理。請勿複製、下載或轉載網站內的相片及影片。",
      canonical: "https://oliveryeung.com/zh-hant/summary/",
    },
  ];

  for (const item of cases) {
    const response = await render(item.pathname);
    assert.equal(response.status, 200, item.pathname);
    const html = await response.text();
    const text = textContent(html);

    assert.match(html, new RegExp(`<html lang="${item.lang}">`, "i"));
    assert.match(text, new RegExp(item.title));
    assert.match(text, new RegExp(item.intro.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(text, new RegExp(item.updated));
    assert.match(text, new RegExp(item.home));
    assert.match(text, new RegExp(item.print));
    assert.match(text, new RegExp(item.privacy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(text, /中文 \| English/);
    assert.match(text, /Content preview|內容預覽/);
    assert.match(text, /Everyday observations|日常觀察/);
    assert.match(text, /Story highlights|故事重點/);
    assert.match(text, /Family & values|家庭與價值觀/i);
    assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
    expectMetadataAndIcons(
      html,
      item.canonical,
      "/en/summary/",
      "/zh-hant/summary/",
    );
    expectSafePage(html);
  }
});

test("renders an immediate root language handoff with a no-JavaScript fallback", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);

  const html = await response.text();
  const text = textContent(html);
  assert.match(html, /<html lang="en-HK">/i);
  assert.match(html, /window\.localStorage\.getItem\("oliver-portfolio-language"\)/);
  assert.match(html, /window\.navigator\.language/);
  assert.match(html, /startsWith\("zh"\)/);
  assert.match(html, /window\.location\.replace/);
  assert.match(html, /<noscript>/i);
  assert.match(html, /href="\/zh-hant\/"[^>]*>中文<\/a>/i);
  assert.match(html, /href="\/en\/"[^>]*>English<\/a>/i);
  assert.doesNotMatch(text, /Opening|Loading|Continue in English|正在開啟|以中文繼續/i);
  expectMetadataAndIcons(
    html,
    "https://oliveryeung.com/",
    "/en/",
    "/zh-hant/",
  );
  expectNoForbiddenPublicCopy(html);
});

test("keeps the Vinext 404 artifact safe while the Pages build owns the custom 404", async () => {
  const html = await readFile(new URL("../dist/client/404.html", import.meta.url), "utf8");
  if (html.trim() === "Not Found") {
    assert.equal(html.trim(), "Not Found");
    expectNoForbiddenPublicCopy(html);
    return;
  }

  const text = textContent(html);
  assert.match(text, /Page not found/);
  assert.match(text, /找不到頁面/);
  assert.match(html, /href="\/en\/"/);
  assert.match(html, /href="\/zh-hant\/"/);
  assert.match(html, /aria-label="中文 \| English"/);
  expectRobots(html);
  expectSafePage(html);
});

test("keeps preview media inert and the motion source safe", async () => {
  const [portfolio, greeting, css] = await Promise.all([
    readFile(new URL("../app/OliverPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/GreetingReveal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(portfolio, /<img\b|<picture\b|<video\b|autoPlay|\bloop\b/);
  assert.match(portfolio, /<PreviewMedia/);
  assert.match(portfolio, /copy\.videos\.items\.map/);
  assert.match(portfolio, /usePointerContextMenuDeterrent\(\)/);
  assert.match(greeting, /sessionStorage\.setItem\(sessionKey, "seen"\)/);
  assert.doesNotMatch(greeting, /setInterval|\bloop\b/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.greeting-heading \.greeting-segment[\s\S]*?animation:\s*none !important/);
  assert.match(css, /@media print[\s\S]*?\.no-print[\s\S]*?display:\s*none !important/);
});
