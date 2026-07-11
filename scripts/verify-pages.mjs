import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve(process.cwd(), "out");
const requiredFiles = [
  "index.html",
  "en/index.html",
  "zh-hant/index.html",
  "404.html",
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
  ".avi",
  ".cr2",
  ".dng",
  ".docx",
  ".gz",
  ".heic",
  ".heif",
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
  ".7z",
  ".3gp",
  ".arw",
]);
const monthNames = "January|February|March|April|May|June|July|August|September|October|November|December";
const forbiddenText = [
  ["localhost URL", /(?:https?:)?\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/i],
  ["local file URL", /file:\/\//i],
  ["Windows absolute path", /(?:^|[\s"'`(])(?:[A-Za-z]:[\\/])/m],
  ["temporary ChatGPT URL", /(?:https?:)?\/\/[^\s"']*(?:chatgpt\.com|chat\.openai\.com|openaiusercontent\.com)/i],
  ["Vinext image endpoint", /\/_vinext\/image\b/i],
  ["Vinext or Cloudflare worker runtime", /vinext\/server\/app-router-entry|cloudflare:workers|WorkerEntrypoint/i],
  ["private key", /-----BEGIN (?:EC |OPENSSH |RSA )?PRIVATE KEY-----/i],
  ["GitHub credential", /\b(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b/],
  ["OpenAI credential", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
  ["AWS credential", /\bAKIA[0-9A-Z]{16}\b/],
  ["Google API credential", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["private review note", /oliver-portfolio-review-notes|PRIVATE WORKING DOCUMENT/i],
  ["birth-date implementation marker", /\b(?:BIRTH_(?:YEAR|MONTH|DAY)|birthDate|dateOfBirth)\b/i],
  ["complete year-first calendar date", /\b(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b/],
  ["complete day-first numeric date", /\b\d{1,2}[-/.]\d{1,2}[-/.](?:19|20)\d{2}\b/],
  ["complete Chinese calendar date", /(?:19|20)\d{2}年\d{1,2}月\d{1,2}日/],
  ["complete English day-first date", new RegExp(`\\b\\d{1,2}\\s+(?:${monthNames})\\s+(?:19|20)\\d{2}\\b`, "i")],
  ["complete English month-first date", new RegExp(`\\b(?:${monthNames})\\s+\\d{1,2},?\\s+(?:19|20)\\d{2}\\b`, "i")],
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
      fail(`original photograph or video file is not allowed: ${relativePath}`);
    }

    if (entry.isDirectory()) files.push(...await walk(absolutePath, relativePath));
    else if (entry.isFile()) files.push(relativePath);
    else fail(`unsupported artifact entry: ${relativePath}`);
  }

  return files;
}

for (const relativePath of requiredFiles) {
  const stats = await lstat(path.join(outputRoot, relativePath)).catch(() => null);
  if (!stats?.isFile() || stats.size === 0) fail(`required file is missing or empty: out/${relativePath}`);
}

const files = await walk(outputRoot);
if (files.some((file) => path.posix.basename(file).toLowerCase() === "cname")) {
  fail("CNAME must not be included in this phase");
}
if (files.some((file) => /(?:^|\/)\.env(?:\.|$)/i.test(file))) {
  fail("environment files must not be included in the Pages artifact");
}

for (const relativePath of files) {
  if (!textExtensions.has(path.extname(relativePath).toLowerCase())) continue;
  const contents = await readFile(path.join(outputRoot, relativePath), "utf8");
  for (const [label, pattern] of forbiddenText) {
    const match = contents.match(pattern);
    if (match) fail(`${label} '${match[0]}' found in out/${relativePath}`);
  }
}

const [rootHtml, englishHtml, chineseHtml, notFoundHtml] = await Promise.all(
  requiredFiles.map((relativePath) => readFile(path.join(outputRoot, relativePath), "utf8")),
);

if (!/<noscript>/i.test(rootHtml)) fail("out/index.html lacks a non-JavaScript fallback");
if (!/href="\/en\/"/i.test(rootHtml)) fail("out/index.html lacks the /en/ fallback link");
if (!/href="\/zh-hant\/"/i.test(rootHtml)) fail("out/index.html lacks the /zh-hant/ fallback link");
if (!/<html[^>]+lang="en-HK"/i.test(englishHtml)) fail("English page language is not en-HK");
if (!englishHtml.includes("Student")) fail("English page lacks the neutral Student label");
if (!/<html[^>]+lang="zh-Hant-HK"/i.test(chineseHtml)) fail("Chinese page language is not zh-Hant-HK");
if (!chineseHtml.includes("學生")) fail("Chinese page lacks the neutral 學生 label");
if (!notFoundHtml.includes("Page not found") || !notFoundHtml.includes("找不到頁面")) {
  fail("out/404.html lacks the bilingual not-found message");
}
if (!/href="\/en\/"/i.test(notFoundHtml) || !/href="\/zh-hant\/"/i.test(notFoundHtml)) {
  fail("out/404.html lacks both locale return links");
}

console.log(`GitHub Pages artifact verified: ${files.length} files in ${outputRoot}`);
console.log(`Required routes: ${requiredFiles.join(", ")}`);
