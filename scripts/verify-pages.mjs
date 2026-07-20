import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(process.cwd(), "out");
const approvedSocialPreview = "social-preview.jpg";
const approvedPhotoNames = [
  "about-car",
  "about-observing",
  "about-reading",
  "about-world",
  "family-care",
  "family-main",
  "family-origin",
  "growth-firefighter",
  "growth-swing",
  "portrait",
  "story-animals",
  "story-swimming",
  "welcome-family",
  "welcome-walk",
];
const approvedVideoIds = [
  "2RE83LVmTVk",
  "FW24LCUNS_w",
  "BxMkQkxApBg",
  "9QrYnWYsVUQ",
  "1Fxx4dzHCFo",
  "kgPKylmVI7s",
  "rcpBdZzHJAk",
];
const approvedVideoPosters = [
  { name: "problem-solving", widths: [320, 480], width: "480", height: "270" },
  { name: "following-directions", widths: [240, 405], width: "405", height: "720" },
  { name: "body-and-family", widths: [240, 405], width: "405", height: "720" },
  { name: "reading-pages", widths: [240, 405], width: "405", height: "720" },
  { name: "water-step", widths: [240, 405], width: "405", height: "720" },
  { name: "piano-keys", widths: [240, 405], width: "405", height: "720" },
  { name: "feeding-rabbits", widths: [240, 405], width: "405", height: "720" },
];
const approvedPhotoWidths = [480, 800, 1200];
const requiredPhotoFiles = approvedPhotoNames.flatMap((name) =>
  approvedPhotoWidths.flatMap((width) => [
    `media/oliver/${name}-${width}.avif`,
    `media/oliver/${name}-${width}.webp`,
  ]),
);
const requiredVideoPosterFiles = approvedVideoPosters.flatMap(({ name, widths }) =>
  widths.map((width) => `media/video/${name}-${width}.webp`),
);
const requiredFiles = [
  "index.html",
  "en/index.html",
  "zh-hant/index.html",
  "404.html",
  "robots.txt",
  "favicon.svg",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  approvedSocialPreview,
  ...requiredPhotoFiles,
  ...requiredVideoPosterFiles,
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
  ["standard YouTube embed host", /https:\/\/(?:www\.)?youtube\.com\/embed\//i],
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
  ["old editorial placeholder", /(?:Content needed|Photo needed|Parent-provided|Alternative text will be added)/i],
  ["Chinese editorial placeholder", /(?:待補|待加入|預留|爸爸媽媽提供|未發佈|審閱版本)/u],
  ["removed one-page summary", /(?:one-page summary|一頁摘要)/i],
  ["removed print action", /(?:Print this page|列印本頁)/i],
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
    if (
      forbiddenMediaExtensions.has(path.extname(entry.name).toLowerCase()) &&
      relativePath !== approvedSocialPreview
    ) {
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
  return match ? decodeHtml(match[1]) : null;
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
  if (/<(?:video|track|iframe)\b/i.test(html)) {
    fail(`unapproved video or embedded media markup found in ${route}`);
  }
  if (/<form\b|social-share|google-analytics|googletagmanager|segment\.com|mixpanel|facebook\.net|doubleclick/i.test(html)) {
    fail(`form, social-sharing control, analytics, or tracker found in ${route}`);
  }
}

function requireApprovedPhotos(html, route, expectedPhotos) {
  const photoSurface = html.replaceAll(`/${approvedSocialPreview}`, "");
  const pictures = html.match(/<picture\b[^>]*>/gi) ?? [];
  const sources = html.match(/<source\b[^>]*>/gi) ?? [];
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  if (pictures.length !== 14 || sources.length !== 14 || images.length !== 21) {
    fail(`${route} must contain fourteen responsive photographs and seven local video posters`);
  }
  if (/<a\b[^>]*(?:download\b|href="\/media\/oliver\/)/i.test(html)) {
    fail(`${route} exposes a photograph download link`);
  }
  if (/10(?:0\d|1\d)|\.jpe?g|\b20\d{2}-\d{2}-\d{2}\b/i.test(photoSurface)) {
    fail(`${route} exposes an original filename, capture date, or JPEG photograph`);
  }

  for (const [alt, name, expectedHeight] of expectedPhotos) {
    const image = images.find((tag) => getAttribute(tag, "alt") === alt);
    if (!image) fail(`${route} lacks approved photograph alt text: ${alt}`);
    if (getAttribute(image, "width") !== "1200" || getAttribute(image, "height") !== expectedHeight) {
      fail(`${route} photograph lacks stable intrinsic dimensions: ${alt}`);
    }
    if (!getAttribute(image, "sizes") || !getAttribute(image, "srcset")) {
      fail(`${route} photograph lacks responsive sizes or srcset: ${alt}`);
    }
    if (getAttribute(image, "src") !== `/media/oliver/${name}-800.webp`) {
      fail(`${route} photograph uses an unapproved fallback path: ${alt}`);
    }
  }

  for (const source of sources) {
    if (getAttribute(source, "type") !== "image/avif") fail(`${route} lacks an AVIF source`);
    const srcset = getAttribute(source, "srcset") ?? "";
    for (const width of approvedPhotoWidths) {
      if (!new RegExp(`-${width}\\.avif ${width}w`).test(srcset)) {
        fail(`${route} AVIF source lacks ${width}px derivative`);
      }
    }
  }

  for (const name of ["welcome-family", "welcome-walk"]) {
    const image = images.find((tag) => getAttribute(tag, "src") === `/media/oliver/${name}-800.webp`);
    if (!image || getAttribute(image, "alt") !== "") {
      fail(`${route} lacks the approved decorative welcome photograph: ${name}`);
    }
    if (getAttribute(image, "width") !== "1200" || getAttribute(image, "height") !== "1500") {
      fail(`${route} welcome photograph lacks stable intrinsic dimensions: ${name}`);
    }
  }

  for (const { name, widths, width, height } of approvedVideoPosters) {
    const [small, large] = widths;
    const image = images.find((tag) => getAttribute(tag, "src") === `/media/video/${name}-${large}.webp`);
    if (!image || getAttribute(image, "class") !== "youtube-video-poster") {
      fail(`${route} lacks the approved local video poster: ${name}`);
    }
    if (getAttribute(image, "width") !== width || getAttribute(image, "height") !== height) {
      fail(`${route} video poster lacks stable intrinsic dimensions: ${name}`);
    }
    if (getAttribute(image, "alt") !== "" || getAttribute(image, "loading") !== "lazy") {
      fail(`${route} video poster must be decorative and lazy-loaded: ${name}`);
    }
    const srcset = getAttribute(image, "srcset") ?? "";
    if (!srcset.includes(`/media/video/${name}-${small}.webp ${small}w`) ||
        !srcset.includes(`/media/video/${name}-${large}.webp ${large}w`)) {
      fail(`${route} video poster lacks the approved responsive srcset: ${name}`);
    }
  }

  if (images.filter((tag) => getAttribute(tag, "loading") === "eager").length !== 2) {
    fail(`${route} must eagerly load only the two welcome photographs`);
  }
  if (images.filter((tag) => getAttribute(tag, "loading") === "lazy").length !== 19) {
    fail(`${route} must lazy-load twelve content photographs and seven video posters`);
  }
}

for (const relativePath of requiredFiles) {
  const stats = await lstat(path.join(outputRoot, relativePath)).catch(() => null);
  if (!stats?.isFile() || stats.size === 0) fail(`required file is missing or empty: out/${relativePath}`);
}

const files = await walk(outputRoot);
if (files.some((file) => /^(?:en|zh-hant)\/summary\//i.test(file))) {
  fail("removed one-page summary output is still present");
}
if (files.some((file) => path.posix.basename(file).toLowerCase() === "cname")) {
  fail("CNAME must not be included before the domain workflow explicitly adds it");
}
if (files.some((file) => /(?:^|\/)\.env(?:\.|$)/i.test(file))) {
  fail("environment files must not be included in the Pages artifact");
}
const artifactPhotos = files.filter((file) => file.startsWith("media/oliver/")).sort();
if (JSON.stringify(artifactPhotos) !== JSON.stringify(requiredPhotoFiles.sort())) {
  fail("the Pages artifact does not contain exactly the approved reduced photo derivatives");
}
const artifactVideoPosters = files.filter((file) => file.startsWith("media/video/")).sort();
if (JSON.stringify(artifactVideoPosters) !== JSON.stringify(requiredVideoPosterFiles.sort())) {
  fail("the Pages artifact does not contain exactly the approved local video posters");
}

const privateBirthDate = process.env.OLIVER_BIRTH_DATE?.trim();
let hasPrivacyEnhancedVideoEmbed = false;
const foundApprovedVideoIds = new Set();
for (const relativePath of files) {
  if (privateBirthDate && relativePath.includes(privateBirthDate)) {
    fail(`private birth date found in an artifact path`);
  }

  const absolutePath = path.join(outputRoot, relativePath);
  if (relativePath.startsWith("media/oliver/")) {
    const bytes = await readFile(absolutePath);
    if (bytes.length < 1_000 || bytes.length > 250_000) {
      fail(`photo derivative has an unexpected size: out/${relativePath}`);
    }
    for (const marker of [
      "Exif", "GPS", "1001", "1002", "1003", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021", "1022",
    ]) {
      if (bytes.includes(Buffer.from(marker))) {
        fail(`photo derivative contains private metadata or an original filename: out/${relativePath}`);
      }
    }
  }
  if (relativePath.startsWith("media/video/")) {
    const bytes = await readFile(absolutePath);
    if (bytes.length < 5_000 || bytes.length > 120_000) {
      fail(`video poster has an unexpected size: out/${relativePath}`);
    }
    for (const marker of [
      "Exif", "GPS", "XMP", ...approvedVideoIds,
      "1004", "1005", "1006", "1007", "1008", "1009", "1015",
    ]) {
      if (bytes.includes(Buffer.from(marker))) {
        fail(`video poster contains private metadata or a source identifier: out/${relativePath}`);
      }
    }
  }
  if (relativePath === approvedSocialPreview) {
    const bytes = await readFile(absolutePath);
    if (bytes.length < 20_000 || bytes.length > 250_000) {
      fail(`social preview has an unexpected size: out/${relativePath}`);
    }
    for (const marker of [
      "Exif", "GPS", "1001", "1002", "1003", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021", "1022",
    ]) {
      if (bytes.includes(Buffer.from(marker))) {
        fail(`social preview contains private metadata or an original filename: out/${relativePath}`);
      }
    }
  }
  if (privateBirthDate) {
    const bytes = await readFile(absolutePath);
    if (bytes.includes(Buffer.from(privateBirthDate))) {
      fail(`private birth date found in out/${relativePath}`);
    }
  }

  if (!textExtensions.has(path.extname(relativePath).toLowerCase())) continue;
  const contents = await readFile(absolutePath, "utf8");
  if (contents.includes("youtube-nocookie.com/embed")) hasPrivacyEnhancedVideoEmbed = true;
  for (const videoId of approvedVideoIds) {
    if (contents.includes(videoId)) foundApprovedVideoIds.add(videoId);
  }
  for (const [label, pattern] of forbiddenText) {
    const match = contents.match(pattern);
    if (match) fail(`${label} found in out/${relativePath}`);
  }
}

const routeFiles = {
  root: "index.html",
  english: "en/index.html",
  chinese: "zh-hant/index.html",
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
  "Oliver's learning journey",
  "Hello, I'm Oliver.",
  "This little collection follows the things that brighten Oliver's days—books, cars, dogs and little problems to solve",
  "Oliver's new portrait is coming",
  "Oliver's everyday world",
  "Reading together",
  "Cars and dogs",
  "Working things out",
  "Noticing and remembering",
  "often chooses one from the shelf by himself",
  "vroom vroom",
  "glasses remind him of Dad, a bald head of Grandpa",
  "Welcome to Oliver's little world.",
  "Everyday moments, held with care",
  "Videos never play automatically",
  "Small steps, quietly gathering",
  "One step, then another",
  "Little moments that become part of the day",
  "Little moments from recent days",
  "Family & Care",
  "Growing within a circle of care",
  "Oliver's days unfold within the steady warmth of family",
  "Held by many loving hands",
  "Where our story began",
  "A quiet portrait from 13 months",
  "How we continue alongside him",
  "Keeping these little days close",
  "Five learning stories, a handful of everyday observations",
  "He listens, then responds",
  "Turning to the next page",
  "A little step into the water",
  "The piano corner he always finds",
  "A gentle hello to the animals",
  "Matching shapes",
  "Pouring between cups",
  "Joining tidy-up time",
  "Waving along the way",
  "Clean up",
  "Bye bye",
  "This portfolio has been lovingly gathered by Oliver's parents. Please help us care for these memories",
  "中文 | English",
]) {
  if (!englishText.includes(expected)) fail(`English page lacks approved copy: ${expected}`);
}
for (const expected of [
  "昊熹的成長旅程",
  "這裏輕輕收進昊熹日常裏喜歡的事",
  "新近照稍後加入",
  "昊熹的日常小世界",
  "親子共讀",
  "車和小狗",
  "專注解難",
  "細心觀察",
  "主動從書架拿書來看",
  "車一出現，昊熹便會開心地說「嗚嗚」",
  "戴眼鏡的是爸爸，光頭的是公公",
  "歡迎走進昊熹的小小世界。",
  "把日常片段，輕輕收進故事裏",
  "影片不會自動播放",
  "把一點一滴，慢慢收進成長裏",
  "一步一步，慢慢走起來",
  "慢慢走進日常的小片段",
  "近日裏的小小片段",
  "家庭與陪伴",
  "在愛與陪伴中，一起長大",
  "昊熹的日常，在家人安穩的愛裏慢慢展開",
  "許多雙疼愛他的手",
  "回到故事起點",
  "13個月大時留下的一張安靜近照",
  "我們如何繼續陪伴",
  "把這些小日子，好好珍藏",
  "五個成長故事、一些日常觀察",
  "聽見，也回應",
  "自己翻開下一頁",
  "水裏的一小步",
  "總會走近的琴鍵",
  "輕輕走近小動物",
  "配對形狀",
  "倒進另一杯",
  "一起收拾",
  "揮手道別",
  "Clean up",
  "Bye bye",
  "本作品集由昊熹的爸爸媽媽用心整理。為了好好守護這些珍貴片段",
  "中文 | English",
]) {
  if (!chineseText.includes(expected)) fail(`Chinese page lacks approved copy: ${expected}`);
}
for (const removedCopy of [
  "A problem-solving moment to be added",
  "A noticing moment to be added",
  "解難小片段稍後加入",
  "觀察小片段稍後加入",
]) {
  if ((englishText + chineseText).includes(removedCopy)) fail(`removed placeholder remains: ${removedCopy}`);
}
for (const [text, orderedTitles, route] of [
  [englishText, ["He listens, then responds", "Turning to the next page", "A little step into the water", "The piano corner he always finds", "A gentle hello to the animals"], "English"],
  [chineseText, ["聽見，也回應", "自己翻開下一頁", "水裏的一小步", "總會走近的琴鍵", "輕輕走近小動物"], "Chinese"],
]) {
  let previousIndex = -1;
  for (const title of orderedTitles) {
    const currentIndex = text.indexOf(title);
    if (currentIndex <= previousIndex) fail(`${route} learning stories are out of order at: ${title}`);
    previousIndex = currentIndex;
  }
}
for (const videoId of approvedVideoIds) {
  if (!foundApprovedVideoIds.has(videoId)) fail(`approved deferred YouTube video is missing: ${videoId}`);
}
if ((routeHtml.english.match(/<h1\b/gi) ?? []).length !== 1) fail("English page must contain one H1");
if ((routeHtml.chinese.match(/<h1\b/gi) ?? []).length !== 1) fail("Chinese page must contain one H1");
if (!/<span class="sr-only">你好，我是昊熹。<\/span>/.test(routeHtml.chinese)) {
  fail("Chinese page lacks the approved accessible greeting");
}
if (!/class="greeting-visual" aria-hidden="true"/.test(routeHtml.english)) fail("English visual greeting is not aria-hidden");
if (!/class="greeting-visual" aria-hidden="true"/.test(routeHtml.chinese)) fail("Chinese visual greeting is not aria-hidden");
if (/href="\/(?:en|zh-hant)\/summary\//i.test(routeHtml.english + routeHtml.chinese)) {
  fail("a removed one-page summary link remains on a locale page");
}
if (/href="#privacy-notice"|id="privacy-notice"|id="privacy-title"/i.test(routeHtml.english + routeHtml.chinese)) {
  fail("a separate privacy destination remains on a locale page");
}
for (const [route, html] of Object.entries({ english: routeHtml.english, chinese: routeHtml.chinese })) {
  if (!/class="footer-privacy"/.test(html)) fail(`${route} page lacks the inline footer privacy note`);
}
for (const [route, html] of Object.entries({ english: routeHtml.english, chinese: routeHtml.chinese })) {
  if ((html.match(/class="story-card/g) ?? []).length !== 5) {
    fail(`${route} page does not contain the five approved learning stories`);
  }
  if ((html.match(/class="youtube-video-trigger"/g) ?? []).length !== 7) {
    fail(`${route} page does not contain seven explicit click-to-load video controls`);
  }
  if (/<iframe\b|youtube-nocookie\.com\/embed/i.test(html)) {
    fail(`${route} page loads a YouTube player before visitor interaction`);
  }
  if (/youtube\.com\/watch\?v=|在 YouTube 開啟這段影片|Open this video on YouTube/i.test(html)) {
    fail(`${route} page exposes a removed YouTube outbound link`);
  }
}
if (!hasPrivacyEnhancedVideoEmbed) {
  fail("the click-to-load player does not use YouTube's privacy-enhanced embed host");
}
if (/\[[^\]]+\]/.test(englishText + chineseText)) {
  fail("bracketed editorial tokens remain in visitor-visible text");
}
requireApprovedPhotos(routeHtml.english, "English page", [
  ["Nineteen-month-old Oliver looks towards the camera from inside a large green play vehicle.", "about-world", "1500"],
  ["Twelve-month-old Oliver sits close to an adult family member as they look at a board book together; the adult points to the page.", "about-reading", "1200"],
  ["Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.", "about-car", "1200"],
  ["Eighteen-month-old Oliver stands in front of a group of colourful cartoon figures, raising one arm to point towards them.", "about-observing", "900"],
  ["Nineteen-month-old Oliver smiles in a swimming pool, with an adult close by.", "story-swimming", "800"],
  ["Fifteen-month-old Oliver is held between Mum and Dad beside an owl perched on a glove.", "story-animals", "800"],
  ["A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.", "portrait", "1600"],
  ["Sixteen-month-old Oliver smiles broadly while holding both sides of a toddler swing.", "growth-swing", "1500"],
  ["Nineteen-month-old Oliver stands outdoors holding a yellow firefighter helmet.", "growth-firefighter", "1500"],
  ["Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.", "family-main", "800"],
  ["Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.", "family-origin", "1500"],
  ["Four-month-old Oliver sits in a cushioned baby seat while several people gently support him with their hands.", "family-care", "1500"],
]);
requireApprovedPhotos(routeHtml.chinese, "Chinese page", [
  ["19個月大的昊熹身處一架大型綠色玩樂車輛內，望向鏡頭。", "about-world", "1500"],
  ["12個月大的昊熹依偎在一位成年家人身旁一起看圖書，家人正指着書頁。", "about-reading", "1200"],
  ["17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。", "about-car", "1200"],
  ["18個月大的昊熹站在一組色彩繽紛的卡通人物佈景前，舉起一隻手指向人物。", "about-observing", "900"],
  ["19個月大的昊熹在泳池裏開心地笑，身旁有大人陪伴。", "story-swimming", "800"],
  ["15個月大的昊熹由爸爸媽媽抱在中間，身旁有一隻貓頭鷹停在手套上。", "story-animals", "800"],
  ["13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。", "portrait", "1600"],
  ["16個月大的昊熹坐在幼兒鞦韆上，雙手扶着兩旁，開懷地笑。", "growth-swing", "1500"],
  ["19個月大的昊熹站在戶外，雙手拿着一頂黃色消防頭盔。", "growth-firefighter", "1500"],
  ["15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。", "family-main", "800"],
  ["6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。", "family-origin", "1500"],
  ["4個月大的昊熹坐在軟墊嬰兒座椅上，身旁幾雙手正溫柔承托着他。", "family-care", "1500"],
]);
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

if (!routeHtml.notFound.includes("We couldn") || !routeHtml.notFound.includes("暫時找不到這一頁")) {
  fail("404 lacks the bilingual not-found message");
}
if (/<(?:img|picture|source)\b/i.test(routeHtml.root + routeHtml.notFound)) {
  fail("root or 404 page contains an unapproved photograph");
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
if (/summary-(?:card|main|link|hero|footer)|video-preview-grid|preview-play/i.test(css)) {
  fail("removed summary or fake-video-control styling remains in the artifact");
}
if (!/greeting-cursor-rest[^}]*animation:[^;]*forwards/i.test(css)) {
  fail("the delayed greeting cursor is not hidden correctly before its reveal");
}
if (/animation:[^;}]*\bboth\b/i.test(css)) {
  fail("completed entrance animations must not retain their compositor fill effects");
}

console.log(`GitHub Pages artifact verified: ${files.length} files in ${outputRoot}`);
console.log(`Required static files: ${requiredFiles.join(", ")}`);
