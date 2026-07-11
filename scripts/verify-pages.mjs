import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(process.cwd(), "out");
const requiredFiles = [
  "index.html",
  "en/index.html",
  "en/summary/index.html",
  "zh-hant/index.html",
  "zh-hant/summary/index.html",
  "404.html",
  "robots.txt",
  "favicon.svg",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
];
const textExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".txt",
  ".xml",
  ".svg",
  ".map",
  ".webmanifest",
  ".yaml",
  ".yml",
]);
const forbiddenPathSegments = new Set([
  ".next",
  ".openai",
  ".vinext",
  ".wrangler",
  "logs",
  "node_modules",
  "originals",
  "outputs",
  "private-media",
  "server",
  "work",
  "worker",
]);
const forbiddenMediaExtensions = new Set([
  ".3gp",
  ".7z",
  ".arw",
  ".avi",
  ".cr2",
  ".dng",
  ".docx",
  ".gz",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".m4v",
  ".mkv",
  ".mov",
  ".mp4",
  ".mpeg",
  ".mpg",
  ".nef",
  ".ogv",
  ".pdf",
  ".raw",
  ".tar",
  ".tif",
  ".tiff",
  ".webm",
  ".wmv",
  ".zip",
]);
const forbiddenText = [
  ["localhost URL", /(?:https?:)?\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i],
  ["local file URL", /file:\/\//i],
  ["Windows absolute path", /(?:^|[\s"'`(])(?:[A-Za-z]:[\\/])/m],
  ["temporary ChatGPT URL", /(?:https?:)?\/\/[^\s"']*(?:chatgpt\.com|chat\.openai\.com|openaiusercontent\.com)/i],
  ["Vinext image endpoint", /\/_vinext\/image\b/i],
  ["Vinext or Cloudflare worker runtime", /vinext\/server\/app-router-entry|cloudflare:workers|WorkerEntrypoint/i],
  ["server-only age configuration", /OLIVER_BIRTH_DATE|Required server-only age configuration/i],
  ["private key", /-----BEGIN (?:EC |OPENSSH |RSA )?PRIVATE KEY-----/i],
  ["GitHub credential", /\b(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b/],
  ["OpenAI credential", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
  ["AWS credential", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API credential", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["private review note", /oliver-portfolio-review-notes|PRIVATE WORKING DOCUMENT/i],
  ["birth-date implementation marker", /\b(?:BIRTH_(?:DATE|YEAR|MONTH|DAY)|birthDate|dateOfBirth)\b/i],
];
const forbiddenPublicCopy = [
  ["K1 wording", /\bK\s*1\b/i],
  ["application wording", /\b(?:application|applicant|admissions?)\b/i],
  ["kindergarten wording", /kindergarten/i],
  ["Chinese institutional wording", /(?:入學|申請|招生|學生)/u],
  ["Traditional-Chinese display label", /繁體中文/u],
  ["private-review wording", /(?:private portfolio|private review|unpublished review)/i],
  ["editorial placeholder", /(?:Content needed|Photo needed|Parent-provided|Alternative text will be added|Placeholder)/i],
  ["Chinese editorial placeholder", /(?:待補|待加入|預留|爸爸媽媽提供|未發佈|審閱版本)/u],
];

function fail(message) {
  throw new Error(`GitHub Pages verification failed: ${message}`);
}

async function walk(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);
    const stats = await lstat(absolutePath);

    if (stats.isSymbolicLink()) fail(`symbolic link is not allowed: ${relativePath}`);

    const segments = relativePath.toLowerCase().split("/");
    const forbiddenSegment = segments.find((segment) => forbiddenPathSegments.has(segment));
    if (forbiddenSegment) fail(`forbidden artifact path segment '${forbiddenSegment}': ${relativePath}`);
    if (/^_?worker(?:\.[^.]+)?$/i.test(entry.name)) fail(`worker runtime file is not allowed: ${relativePath}`);
    if (forbiddenMediaExtensions.has(path.extname(entry.name).toLowerCase())) {
      fail(`original photograph, video, or private document is not allowed: ${relativePath}`);
    }
    if (/(?:^|\/)(?:dsc|img|pxl|mvimg)[_-]?\d+\.(?:avif|png|webp)$/i.test(relativePath)) {
      fail(`camera-style media filename is not allowed: ${relativePath}`);
    }

    if (entry.isDirectory()) files.push(...await walk(absolutePath, relativePath));
    else if (entry.isFile()) files.push(relativePath);
    else fail(`unsupported artifact entry: ${relativePath}`);
  }

  return files;
}

function decodeHtml(text) {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&rsquo;", "’");
}

function visibleText(html) {
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

function requireRobots(html, route) {
  const robots = (html.match(/<meta\b[^>]*>/gi) ?? []).filter(
    (tag) => getAttribute(tag, "name")?.toLowerCase() === "robots",
  );
  if (robots.length === 0) fail(`${route} lacks robots metadata`);
  // Next emits an additional noindex-only tag for the global 404. Crawlers
  // combine repeated robots directives, so verification does the same.
  const content = robots
    .map((tag) => getAttribute(tag, "content") ?? "")
    .join(",")
    .toLowerCase();
  for (const directive of ["noindex", "nofollow", "noarchive", "nosnippet", "noimageindex"]) {
    if (!new RegExp(`(?:^|,\\s*)${directive}(?:,|$)`).test(content)) {
      fail(`${route} robots metadata lacks ${directive}`);
    }
  }
}

function requireLink(html, { route, rel, href, hrefLang }) {
  const link = findTag(html, "link", (tag) => {
    if (getAttribute(tag, "rel")?.toLowerCase() !== rel.toLowerCase()) return false;
    if (getAttribute(tag, "href") !== href) return false;
    return hrefLang ? getAttribute(tag, "hreflang") === hrefLang : true;
  });
  if (!link) fail(`${route} lacks ${rel} link ${hrefLang ? `${hrefLang} ` : ""}${href}`);
}

function requireMetadata(html, route, canonical, englishPath, chinesePath) {
  requireRobots(html, route);
  requireLink(html, { route, rel: "canonical", href: canonical });
  requireLink(html, {
    route,
    rel: "alternate",
    href: `https://oliveryeung.com${englishPath}`,
    hrefLang: "en-HK",
  });
  requireLink(html, {
    route,
    rel: "alternate",
    href: `https://oliveryeung.com${chinesePath}`,
    hrefLang: "zh-Hant-HK",
  });
  requireLink(html, {
    route,
    rel: "alternate",
    href: "https://oliveryeung.com/",
    hrefLang: "x-default",
  });
  for (const iconPath of [
    "/favicon.svg",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/apple-touch-icon.png",
  ]) {
    if (!html.includes(`href="${iconPath}"`)) {
      fail(`${route} lacks icon link ${iconPath}`);
    }
  }
}

function scanPublicCopy(html, route) {
  const publicSurface = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  for (const [label, pattern] of forbiddenPublicCopy) {
    if (pattern.test(publicSurface)) fail(`${label} found in ${route}`);
  }
  if (/<(?:img|picture|video|source|track|iframe)\b/i.test(html)) {
    fail(`unapproved photograph or video markup found in ${route}`);
  }
  if (/<form\b|social-share|google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net|doubleclick/i.test(html)) {
    fail(`form, social-sharing control, analytics, or tracker found in ${route}`);
  }
}

for (const relativePath of requiredFiles) {
  const stats = await lstat(path.join(outputRoot, relativePath)).catch(() => null);
  if (!stats?.isFile() || stats.size === 0) fail(`required file is missing or empty: out/${relativePath}`);
}

const files = await walk(outputRoot);
if (files.some((file) => path.posix.basename(file).toLowerCase() === "cname")) {
  fail("CNAME must not be included before the domain workflow explicitly adds it");
}
if (files.some((file) => /(?:^|\/)\.env(?:\.|$)/i.test(file))) {
  fail("environment files must not be included in the Pages artifact");
}

const privateBirthDate = process.env.OLIVER_BIRTH_DATE?.trim();
for (const relativePath of files) {
  if (privateBirthDate && relativePath.includes(privateBirthDate)) {
    fail(`private birth date found in an artifact path`);
  }

  const absolutePath = path.join(outputRoot, relativePath);
  if (privateBirthDate) {
    const bytes = await readFile(absolutePath);
    if (bytes.includes(Buffer.from(privateBirthDate))) {
      fail(`private birth date found in out/${relativePath}`);
    }
  }

  if (!textExtensions.has(path.extname(relativePath).toLowerCase())) continue;
  const contents = await readFile(absolutePath, "utf8");
  for (const [label, pattern] of forbiddenText) {
    const match = contents.match(pattern);
    if (match) fail(`${label} found in out/${relativePath}`);
  }
}

const routeFiles = {
  root: "index.html",
  english: "en/index.html",
  englishSummary: "en/summary/index.html",
  chinese: "zh-hant/index.html",
  chineseSummary: "zh-hant/summary/index.html",
  notFound: "404.html",
};
const routeHtml = Object.fromEntries(
  await Promise.all(
    Object.entries(routeFiles).map(async ([route, file]) => [
      route,
      await readFile(path.join(outputRoot, file), "utf8"),
    ]),
  ),
);

for (const [route, html] of Object.entries(routeHtml)) {
  scanPublicCopy(html, route);
}

if (!/<noscript>/i.test(routeHtml.root)) fail("root lacks a non-JavaScript fallback");
if (!/href="\/en\/"[^>]*>English<\/a>/i.test(routeHtml.root)) fail("root lacks the English fallback link");
if (!/href="\/zh-hant\/"[^>]*>中文<\/a>/i.test(routeHtml.root)) fail("root lacks the Chinese fallback link");
if (!/localStorage\.getItem\("oliver-portfolio-language"\)/.test(routeHtml.root)) fail("root lacks stored-language selection");
if (!/navigator\.language/.test(routeHtml.root) || !/startsWith\("zh"\)/.test(routeHtml.root)) {
  fail("root lacks browser-language selection");
}
if (!/window\.location\.replace/.test(routeHtml.root)) fail("root lacks immediate replacement navigation");
if (/Opening|Loading|Continue in English|正在開啟|以中文繼續/i.test(visibleText(routeHtml.root))) {
  fail("root exposes a loading or continuation screen");
}
requireMetadata(
  routeHtml.root,
  "root",
  "https://oliveryeung.com/",
  "/en/",
  "/zh-hant/",
);

if (!/<html[^>]+lang="en-HK"/i.test(routeHtml.english)) fail("English page language is not en-HK");
if (!/<html[^>]+lang="zh-Hant-HK"/i.test(routeHtml.chinese)) fail("Chinese page language is not zh-Hant-HK");
const englishText = visibleText(routeHtml.english);
const chineseText = visibleText(routeHtml.chinese);
for (const expected of [
  "Oliver's little learning journey",
  "Hello, I'm Oliver.",
  "A small collection of everyday moments showing how Oliver explores, connects and grows at his own pace.",
  "Everyday moments",
  "At his own pace",
  "Shared with care",
  "Content preview",
  "A little about Oliver",
  "Everyday moments, told with care",
  "A calm home for future videos",
  "Everyday growth and small steps",
  "The people and rhythms around Oliver",
  "This portfolio is shared by Oliver's parents. Please do not copy, download or redistribute its photographs or videos.",
  "中文 | English",
]) {
  if (!englishText.includes(expected)) fail(`English page lacks approved copy: ${expected}`);
}
for (const expected of [
  "昊熹的小小成長旅程",
  "透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。",
  "日常片段",
  "按自己的步伐",
  "用心分享",
  "內容預覽",
  "關於昊熹的一點點",
  "用心記下每個日常片段",
  "讓將來的影片自然融入故事",
  "日常成長與一小步一小步",
  "陪伴昊熹成長的人與日常",
  "本作品集由昊熹的爸爸媽媽整理。請勿複製、下載或轉載網站內的相片及影片。",
  "中文 | English",
]) {
  if (!chineseText.includes(expected)) fail(`Chinese page lacks approved copy: ${expected}`);
}
if ((routeHtml.english.match(/<h1\b/gi) ?? []).length !== 1) fail("English page must contain one H1");
if ((routeHtml.chinese.match(/<h1\b/gi) ?? []).length !== 1) fail("Chinese page must contain one H1");
if (!/<span class="sr-only">你好，我是昊熹。<\/span>/.test(routeHtml.chinese)) {
  fail("Chinese page lacks the approved accessible greeting");
}
if (!/class="greeting-visual" aria-hidden="true"/.test(routeHtml.english)) fail("English visual greeting is not aria-hidden");
if (!/class="greeting-visual" aria-hidden="true"/.test(routeHtml.chinese)) fail("Chinese visual greeting is not aria-hidden");
requireMetadata(
  routeHtml.english,
  "English page",
  "https://oliveryeung.com/en/",
  "/en/",
  "/zh-hant/",
);
requireMetadata(
  routeHtml.chinese,
  "Chinese page",
  "https://oliveryeung.com/zh-hant/",
  "/en/",
  "/zh-hant/",
);

for (const [route, html, lang, title, canonical] of [
  ["English summary", routeHtml.englishSummary, "en-HK", "Oliver at a glance", "https://oliveryeung.com/en/summary/"],
  ["Chinese summary", routeHtml.chineseSummary, "zh-Hant-HK", "昊熹的一頁摘要", "https://oliveryeung.com/zh-hant/summary/"],
]) {
  if (!new RegExp(`<html[^>]+lang="${lang}"`, "i").test(html)) fail(`${route} has the wrong page language`);
  if (!visibleText(html).includes(title)) fail(`${route} lacks its approved title`);
  if (!/(?:Content preview|內容預覽)/.test(visibleText(html))) {
    fail(`${route} lacks its approved content-preview label`);
  }
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) fail(`${route} must contain one H1`);
  requireMetadata(html, route, canonical, "/en/summary/", "/zh-hant/summary/");
}

if (!routeHtml.notFound.includes("Page not found") || !routeHtml.notFound.includes("找不到頁面")) {
  fail("404 lacks the bilingual not-found message");
}
if (!/href="\/en\/"/i.test(routeHtml.notFound) || !/href="\/zh-hant\/"/i.test(routeHtml.notFound)) {
  fail("404 lacks both locale return links");
}
requireRobots(routeHtml.notFound, "404");

const robotsText = await readFile(path.join(outputRoot, "robots.txt"), "utf8");
if (!/^User-agent:\s*\*$/im.test(robotsText) || !/^Disallow:\s*\/$/im.test(robotsText)) {
  fail("robots.txt must disallow crawling during public review");
}

const cssFiles = files.filter((file) => path.extname(file).toLowerCase() === ".css");
const css = (await Promise.all(cssFiles.map((file) => readFile(path.join(outputRoot, file), "utf8")))).join("\n");
if (!css.includes("Noto Sans TC")) fail("the single Noto Sans TC typography system is missing");
for (const paletteToken of ["#FFF9E6", "#29404A", "#C4DDEA", "#5C8B7F", "#3F6D65", "#E0AD3F", "#EEA283"]) {
  if (!css.includes(paletteToken)) fail(`Sunlit Meadow palette token is missing: ${paletteToken}`);
}
if (/Noto Serif|Georgia|--serif|@font-face|fonts\.(?:googleapis|gstatic)\.com/i.test(css)) {
  fail("an unapproved serif or external font remains in the artifact");
}
if (/(?<!sans-)\bserif\b/i.test(css)) fail("a separate serif font family remains in the artifact");

console.log(`GitHub Pages artifact verified: ${files.length} files in ${outputRoot}`);
console.log(`Required static files: ${requiredFiles.join(", ")}`);
