import htmlParser from "next/dist/compiled/node-html-parser/index.js";
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
  "family-playful",
  "growth-rescue-motorcycle",
  "growth-supported",
  "hero-portrait",
  "portrait",
  "story-animals",
  "story-swimming",
];
const approvedVideoIds = [
  "2RE83LVmTVk",
  "FW24LCUNS_w",
  "vWXWUHqovGc",
  "9QrYnWYsVUQ",
  "gfiAoI900Vc",
  "IYiabpo7nuI",
  "kgPKylmVI7s",
  "rcpBdZzHJAk",
];
const approvedVideoPosters = [
  { name: "problem-solving", widths: [320, 480], width: "480", height: "270" },
  { name: "helping-laundry", widths: [320, 480], width: "480", height: "480" },
  { name: "ready-for-lunch", widths: [240, 405], width: "405", height: "720" },
  { name: "body-and-family", widths: [240, 405], width: "405", height: "720" },
  { name: "reading-pages", widths: [240, 405], width: "405", height: "720" },
  { name: "swimming-september", widths: [320, 480], width: "480", height: "270" },
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
  ["retired video or poster", /1Fxx4dzHCFo|BxMkQkxApBg|following-directions|water-step/],
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
  ["Chinese institutional wording", /(?:入學|申請|招生|學生(?!相))/u],
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
  if (pictures.length !== 14 || sources.length !== 14 || images.length !== 29) {
    fail(`${route} must contain fourteen responsive photographs, eight video posters and seven story thumbnails`);
  }
  if (/<a\b[^>]*(?:download\b|href="\/media\/oliver\/)/i.test(html)) {
    fail(`${route} exposes a photograph download link`);
  }
  if (images.some(tag => /(?:\/10(?:0\d|1\d)|\.jpe?g|\b20\d{2}-\d{2}-\d{2}\b)/i.test(getAttribute(tag,"src"))) || /\b20\d{2}-\d{2}-\d{2}\b/.test(visibleText(photoSurface))) {
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

  if (images.filter((tag) => getAttribute(tag, "loading") === "eager").length !== 1) {
    fail(`${route} must eagerly load only the hero portrait`);
  }
  if (images.filter((tag) => getAttribute(tag, "loading") === "lazy").length !== 28) {
    fail(`${route} must lazy-load all below-fold photographs, video posters and thumbnails`);
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
      "Exif", "GPS", "1001", "1002", "1003", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021", "1022", "1023", "1024",
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
      "Exif", "GPS", "1001", "1002", "1003", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021", "1022", "1023", "1024",
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
if (!hasPrivacyEnhancedVideoEmbed || foundApprovedVideoIds.size !== approvedVideoIds.length) {
  fail("the eight approved videos must load through the privacy-enhanced host on request");
}
for (const [language, html] of [["en",routeHtml.english],["zh",routeHtml.chinese]]) {
  const doc=htmlParser.parse(html);
  const album=doc.querySelector("#album");
  if (!album) fail(language+" lacks the album");
  const zh=language==="zh";
  const counts=[["h1",1],[".interest-card",4],[".story",7],[".station",11],[".moment",11],[".family-photos figure",4],[".play",8],[".pick",7]];
  for (const [selector,n] of counts) {
    if (album.querySelectorAll(selector).length!==n) fail(language+" has an incorrect count for "+selector);
  }
  const title=zh?"歡迎走進昊熹的小世界。":"Welcome to Oliver's little world.";
  if (album.querySelector("#welcome-title")?.textContent!==title || album.querySelector(".welcome-sheet button")) fail(language+" has an incorrect welcome");
  if (!album.querySelector(".about-main figcaption").textContent.includes(zh?"沖天遙控車":"RC Car")) fail(language+" lacks the RC Car caption");
  if (album.querySelector("#interest-2 h3").textContent!==(zh?"小小司機":"Behind the wheel")) fail(language+" has an incorrect car story");
  if (!album.querySelector("#moment-4 img") || !album.querySelector("#moment-4 h3").textContent.includes(zh?"學生相":"school photo")) fail(language+" lacks the first school photo");
  if (album.querySelector("iframe,form,[data-return-stop],[data-replay],.meadow-decor-dog")) fail(language+" contains an unexpected control or embed");
  const languages=album.querySelectorAll(".languages a").map(a=>a.getAttribute("href"));
  if (languages.join(",")!=="/zh-hant/,/en/") fail(language+" lacks stable locale links");
  const videoIds=album.querySelectorAll(".play").map(a=>a.getAttribute("data-video")).sort();
  if (videoIds.join(",")!==[...approvedVideoIds].sort().join(",")) fail(language+" has an unapproved video");
  if (process.env.REQUIRE_OLIVER_AGE==="true" && !album.querySelector(".identity-age")?.textContent.trim()) fail(language+" lacks the current age");
  if (!album.querySelector("footer p")?.textContent.trim()) fail(language+" lacks the privacy notice");
}
requireApprovedPhotos(routeHtml.english, "English page", [
  ["Nineteen-month-old Oliver sits facing the camera in a studio portrait, wearing a white shirt and tan trousers.", "hero-portrait", "1600"],
  ["Oliver stands inside the RC Car with one hand resting on its side.", "about-world", "1500"],
  ["Twelve-month-old Oliver sits close to Dad as they look at a board book together and Dad points to the page.", "about-reading", "1200"],
  ["Seventeen-month-old Oliver smiles from the driver's seat of a child-sized black play car.", "about-car", "1200"],
  ["Wearing dungarees, Oliver points up at the cartoon figures behind him. Snoopy stands beside him wearing a yellow crown.", "about-observing", "900"],
  ["Oliver laughs in the pool, wearing a swim top with pale blue sleeves.", "story-swimming", "800"],
  ["Dad holds Oliver, who is wearing a sun hat. Mum leans in beside them, with a white-faced owl in the foreground.", "story-animals", "800"],
  ["A front-facing portrait of 13-month-old Oliver wearing a blue collared shirt against a white background.", "portrait", "1600"],
  ["One-year-old Oliver stands between Mum and Dad while each parent holds one of his hands.", "growth-supported", "1500"],
  ["Nineteen-month-old Oliver holds a green-and-black toy motorcycle, with a full-sized yellow rescue motorcycle and part of an ambulance behind him.", "growth-rescue-motorcycle", "1500"],
  ["Fifteen-month-old Oliver is held close between Mum and Dad beneath flowering trees during a family outing.", "family-main", "800"],
  ["Six-month-old Oliver is held between Mum and Dad in front of a large red outdoor sculpture.", "family-origin", "1500"],
  ["Oliver rests against a grey cushion. Adult hands hold his little hands and cradle his bare feet.", "family-care", "1500"],
  ["One-year-old Oliver smiles outdoors while Mum and Dad hold him between them.", "family-playful", "1500"],
]);
requireApprovedPhotos(routeHtml.chinese, "Chinese page", [
  ["19個月大的昊熹穿着白色襯衣和淺棕色長褲，坐在柔和的紫灰色背景前，正面望向鏡頭。", "hero-portrait", "1600"],
  ["昊熹站在沖天遙控車裏，一隻手扶着車邊。", "about-world", "1500"],
  ["12個月大的昊熹依偎在爸爸身旁一起看圖書，爸爸正指着書頁。", "about-reading", "1200"],
  ["17個月大的昊熹坐在黑色兒童玩具車的駕駛座上，望向鏡頭微笑。", "about-car", "1200"],
  ["昊熹穿着吊帶褲，舉手指向身後的卡通人物。史諾比戴着黃色皇冠，站在他身旁。", "about-observing", "900"],
  ["昊熹穿着淺藍色衣袖的泳衣，在池水裏張口大笑。", "story-swimming", "800"],
  ["爸爸抱着戴帽子的昊熹，媽媽靠在他身旁，一隻白色臉的貓頭鷹就在三人面前。", "story-animals", "800"],
  ["13個月大的昊熹穿着藍色有領上衣，在白色背景前正面望向鏡頭。", "portrait", "1600"],
  ["1歲的昊熹站在爸爸媽媽中間，爸爸媽媽各牽着他一隻手。", "growth-supported", "1500"],
  ["19個月大的昊熹手拿綠黑色玩具電單車，身後停着一輛真實的黃色救護電單車，旁邊可見部分救護車。", "growth-rescue-motorcycle", "1500"],
  ["15個月大的昊熹在花樹下依偎在爸爸媽媽中間，一家三口望向鏡頭。", "family-main", "800"],
  ["6個月大的昊熹由爸爸媽媽抱在中間，三人在大型紅色戶外雕塑前合照。", "family-origin", "1500"],
  ["昊熹靠在灰色軟墊上，大人牽着他的小手，托着他的一雙小腳。", "family-care", "1500"],
  ["1歲的昊熹在戶外由爸爸媽媽抱在中間，一家人一起笑。", "family-playful", "1500"],
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
if (/fonts\.(?:googleapis|gstatic)\.com/i.test(css)) fail("fonts must be served locally");
for (const weight of [400,600,700]) {
  const font="album/noto-sans-tc-"+weight+".woff";
  if (!files.includes(font) || !css.includes("/"+font)) fail("missing local Noto Sans TC "+weight);
}
if (!files.includes("album/OFL.txt") || !files.includes("album/interactions.js")) fail("album assets are incomplete");

console.log(`GitHub Pages artifact verified: ${files.length} files in ${outputRoot}`);
console.log(`Required static files: ${requiredFiles.join(", ")}`);
