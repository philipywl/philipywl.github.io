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
    /(?:入學|申請|招生|學生(?!相)|繁體中文)/u,
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

import htmlParser from "next/dist/compiled/node-html-parser/index.js";

for (const [route, lang, values] of [
  ["/en/", "en-HK", ["Hello, I'm Oliver.", "Behind the wheel", "RC Car", "His first school photo"]],
  ["/zh-hant/", "zh-Hant-HK", ["你好，我是昊熹。", "小小司機", "沖天遙控車", "第一張學生相"]],
]) {
  test("renders the approved public album at " + route, async () => {
    const response = await render(route);
    assert.equal(response.status, 200);
    const html = await response.text();
    const doc = htmlParser.parse(html);
    assert.equal(doc.querySelector("html").getAttribute("lang"), lang);
    const album = doc.querySelector("#album");
    assert.ok(album);
    assert.equal(album.querySelector("h1").getAttribute("aria-label"), values[0]);
    assert.equal(album.querySelector("#interest-2 h3").textContent, values[1]);
    assert.ok(album.querySelector(".about-main figcaption").textContent.includes(values[2]));
    assert.equal(album.querySelector("#moment-4 h3").textContent, values[3]);
    assert.ok(album.querySelector("#moment-4 img"));
    assert.equal(album.querySelector(".welcome-sheet").childNodes.filter(n => n.tagName).length, 1);
    for (const id of ["about", "stories", "growth", "family"]) {
      assert.ok(album.querySelector("#" + id));
      assert.ok(album.querySelector('nav a[href="#' + id + '"]'));
    }
    for (const [selector, count] of [
      ["h1", 1], [".interest-card", 4], [".pick", 7], [".story", 7],
      [".notes", 7], [".play", 8], ["picture", 14], [".station", 11], [".moment", 11],
    ]) assert.equal(album.querySelectorAll(selector).length, count, selector);
    for (const picture of album.querySelectorAll("picture")) {
      assert.match(picture.querySelector("source").getAttribute("srcset"), /\.avif 1200w/);
      const img = picture.querySelector("img");
      assert.match(img.getAttribute("srcset"), /\.webp 1200w/);
      assert.ok(img.getAttribute("alt").trim());
    }
    const buttons = album.querySelectorAll(".station");
    for (const [index, button] of buttons.entries()) {
      assert.equal(button.getAttribute("aria-controls"), "moment-" + (index + 1));
      assert.match(button.querySelector("strong").textContent, /^\d+/);
    }
    assert.deepEqual(album.querySelectorAll(".languages a").map(a => a.getAttribute("href")), ["/zh-hant/", "/en/"]);
    assert.equal(album.querySelector(".languages [aria-current=page]").getAttribute("href"), route);
    assert.ok(album.querySelector("footer p").textContent.trim());
    assert.doesNotMatch(html, /i\.ytimg\.com|img\.youtube\.com|class="meadow-decor-dog"/);
    expectMetadataAndIcons(html, "https://oliveryeung.com" + route);
    expectSafePage(html);
  });
}

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
  const response = await render("/missing-page/");
  assert.equal(response.status, 404);
  const html = await response.text();
  if (html.trim() === "Not Found") return;

  const text = textContent(html);
  assert.match(text, /We couldn't find this page\./);
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
