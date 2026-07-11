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

test("renders the complete English review portfolio", async () => {
  const response = await render("/en/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="en-HK">/i);
  assert.match(html, /Hello, I(?:&#x27;|')m Oliver/);
  assert.match(html, /Movement &amp; Growth/);
  assert.match(html, /Featured learning stories/);
  assert.match(html, /Everyday independence/);
  assert.match(html, /Relationships and family values/);
  assert.match(html, /Recent moments of growth/);
  assert.match(html, /PARENT-PROVIDED INTRODUCTION/);
  assert.match(html, />Student</);
  assert.match(html, /A bilingual collection of everyday discoveries and family moments/);
  assert.match(html, /Story video and poster to be added/);
  assert.match(html, /REVIEWED ENGLISH \+ TRADITIONAL CHINESE CAPTIONS/);
  assert.match(html, /INTEGRATED OR AUDIO-DESCRIBED NARRATION/);
  assert.match(html, /shared by Oliver(?:&#x27;|')s parents with invited viewers/);
  assert.doesNotMatch(html, /visitor submissions|visitor analytics/i);
  assert.doesNotMatch(html, /kindergarten admissions|admissions review/i);
  assert.match(html, /name="robots" content="noindex, nofollow, nocache"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("renders a structurally equivalent Traditional Chinese route", async () => {
  const response = await render("/zh-hant/");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<html lang="zh-Hant-HK">/i);
  assert.match(html, /你好，我是昊熹/);
  assert.match(html, /活動與成長/);
  assert.match(html, /精選成長故事/);
  assert.match(html, /日常自理/);
  assert.match(html, /相處與家庭價值觀/);
  assert.match(html, /近期成長點滴/);
  assert.match(html, /爸爸媽媽提供的簡介/);
  assert.match(html, />學生</);
  assert.match(html, /記錄日常探索與家庭時光的成長故事/);
  assert.match(html, /待加入故事影片及封面/);
  assert.match(html, /經覆核的 English 及繁體中文字幕/);
  assert.match(html, /整合式旁述或口述影像版本/);
  assert.match(html, /本私人作品集由昊熹的爸爸媽媽與獲邀人士分享/);
  assert.doesNotMatch(html, /不接受訪客提交資料|訪客分析功能|父母/);
  assert.doesNotMatch(html, /你好，我是 Oliver|關於 Oliver|Oliver 的學習方式|Oliver 當時/);
  assert.doesNotMatch(html, /小小學習者/);
  assert.doesNotMatch(html, /入學評審|供香港幼稚園/);
  assert.match(html, /Oliver YEUNG/);
  assert.match(html, /列印本頁/);
  assert.match(html, /English/);
});

test("keeps the review build static and privacy-led", async () => {
  const html = await (await render("/en/")).text();

  assert.match(html, /Skip to main content/);
  assert.match(html, /Hero portrait to be added/);
  assert.match(html, /Open print options for Oliver/);
  assert.equal(
    (html.match(/class="editorial-video video-placeholder"/g) ?? []).length,
    4,
  );
  assert.doesNotMatch(html, /<video\b|<source\b|<track\b/i);
  assert.doesNotMatch(html, /<dialog\b|role="dialog"|aria-modal="true"|lightbox/i);
  assert.doesNotMatch(
    html,
    /<form\b|social-share|autoplay|google-analytics|segment\.com|mixpanel/i,
  );
  assert.doesNotMatch(
    html,
    /(?:19|20)\d{2}年\d{1,2}月\d{1,2}日|\b\d{1,2}\s+[A-Z][a-z]+\s+(?:19|20)\d{2}\b|oliveryeung\.com/i,
  );
});

test("renders an unbranded root language handoff without a duplicate title", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Oliver YEUNG \| A little learner(?:&#x27;|')s portfolio<\/title>/i);
  assert.doesNotMatch(html, /Oliver YEUNG \| A little learner(?:&#x27;|')s portfolio \| Oliver YEUNG/i);
  assert.match(html, /Opening Oliver(?:&#x27;|')s portfolio/);
  assert.match(html, /href="\/en\/"[^>]*>Continue in English/);
  assert.match(html, /href="\/zh-hant\/"[^>]*>以中文繼續/);
});

test("keeps the future video path poster-first, complete, and motion-safe", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("../app/OliverPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(source, /prepareStoryVideoAssets/);
  assert.match(source, /localized: Record</);
  assert.match(source, /completeLocalizedMetadata/);
  assert.match(source, /requiredCaptionLanguages/);
  assert.match(source, /Duplicate story video asset id/);
  assert.match(source, /visualDescription: "integrated" \| "audio-described"/);
  assert.match(source, /flushSync\(\(\) => setActivated\(true\)\)/);
  assert.match(source, /controls\s+playsInline\s+preload="none"/);
  assert.match(source, /controlsList="nodownload"/);
  assert.match(source, /kind="captions"/);
  assert.match(source, /STORY_VIDEO_PLAY_EVENT/);
  assert.match(source, /\n\s*中文\n/);
  assert.doesNotMatch(source, /\n\s*繁體中文\n/);
  assert.doesNotMatch(source, /’/);
  assert.match(source, /addEventListener\("contextmenu", blockPointerContextMenu, true\)/);
  assert.match(source, /event\.button === 2 \|\| event\.ctrlKey/);
  assert.doesNotMatch(source, /\bautoPlay\b|\bloop\b/);

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation-duration: 0\.01ms !important/);
  assert.match(css, /\[data-reveal\]\.reveal-pending[\s\S]*?opacity: 1 !important/);
  assert.match(css, /@media print[\s\S]*?\.video-poster-button[\s\S]*?display: none !important/);
  assert.match(css, /@media print[\s\S]*?\[data-reveal\][\s\S]*?transform: none !important/);
});
