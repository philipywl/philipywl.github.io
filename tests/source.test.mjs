import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";
import { resolveLanguageSection } from "../app/section-navigation.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

async function read(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

async function collectSourceFiles(directory) {
  const absoluteDirectory = path.join(projectRoot, directory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectSourceFiles(relativePath));
    else if (/\.(?:[cm]?[jt]sx?|mjs|css)$/i.test(entry.name)) files.push(relativePath);
  }

  return files;
}

test("language changes follow an in-flight target, then the visible section", () => {
  assert.equal(
    resolveLanguageSection({
      nearTop: false,
      pendingSection: "#stories",
      currentSectionId: "about",
      routeHash: "#about",
    }),
    "#stories",
  );
  assert.equal(
    resolveLanguageSection({
      nearTop: false,
      currentSectionId: "family",
      activeHref: "#about",
      routeHash: "#about",
    }),
    "#family",
  );
  assert.equal(
    resolveLanguageSection({
      nearTop: true,
      pendingSection: "#stories",
      currentSectionId: "stories",
      routeHash: "#stories",
    }),
    "#stories",
  );
  assert.equal(
    resolveLanguageSection({
      nearTop: true,
      currentSectionId: "about",
      routeHash: "#about",
    }),
    "",
  );
});

test("keeps Sites and GitHub Pages workflows separate", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.scripts.dev, "vinext dev");
  assert.equal(packageJson.scripts.build, "vinext build");
  assert.equal(packageJson.scripts["build:pages"], "next build --webpack");
  assert.equal(packageJson.scripts["verify:pages"], "node scripts/verify-pages.mjs");
});

test("keeps local Sites metadata optional and outside GitHub Pages", async () => {
  const [viteConfig, gitignore, workflow] = await Promise.all([
    read("vite.config.ts"),
    read(".gitignore"),
    read(".github/workflows/pages.yml"),
  ]);

  assert.doesNotMatch(viteConfig, /\bfrom\s+["']\.\/\.openai\/hosting\.json["']/);
  assert.match(viteConfig, /type\s+LocalHostingConfig/);
  assert.match(viteConfig, /readFileSync\(hostingConfigPath,\s*["']utf8["']\)/);
  assert.match(viteConfig, /code\s*===\s*["']ENOENT["'][\s\S]*?return\s+\{\};/);
  assert.match(viteConfig, /throw\s+error;/);
  assert.doesNotMatch(workflow, /\.openai\/hosting\.json/);
  assert.match(gitignore, /^\/\.openai\/hosting\.json$/m);
  assert.equal(
    execFileSync("git", ["ls-files", "--", ".openai/hosting.json"], {
      cwd: projectRoot,
      encoding: "utf8",
    }).trim(),
    "",
  );
});

test("configures a root static export with only the approved public content routes", async () => {
  const config = await read("next.config.ts");

  assert.match(config, /output:\s*["']export["']/);
  assert.match(config, /trailingSlash:\s*true/);
  assert.match(config, /images:\s*\{[\s\S]*?unoptimized:\s*true/);
  assert.match(config, /globalNotFound:\s*true/);
  assert.doesNotMatch(config, /\bbasePath\s*:/);
  assert.doesNotMatch(config, /\bassetPrefix\s*:/);

  for (const routeFile of [
    "app/(root)/page.tsx",
    "app/(english)/en/page.tsx",
    "app/(chinese)/zh-hant/page.tsx",
    "app/global-not-found.tsx",
    "app/global-error.tsx",
  ]) {
    await assert.doesNotReject(access(path.join(projectRoot, routeFile)));
  }

  for (const removedFile of [
    "app/PortfolioSummary.tsx",
    "app/(english)/en/summary/page.tsx",
    "app/(chinese)/zh-hant/summary/page.tsx",
  ]) {
    await assert.rejects(access(path.join(projectRoot, removedFile)));
  }
});

test("prepares a main-only daily GitHub Pages deployment with a private age input", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  const productionCondition = "if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'";

  assert.match(workflow, /pull_request:[\s\S]*?branches:[\s\S]*?- main/);
  assert.match(workflow, /schedule:[\s\S]*?- cron:/);
  assert.match(workflow, /uses: actions\/checkout@v7/);
  assert.match(workflow, /uses: actions\/setup-node@v6/);
  assert.match(workflow, /node-version: "24"/);
  assert.match(workflow, /run: npm ci/);
  assert.match(workflow, /run: npm run test --if-present/);
  assert.match(workflow, /run: npm run typecheck --if-present/);
  assert.match(workflow, /run: npm run build:pages/);
  assert.match(workflow, /run: npm run verify:pages/);
  assert.match(workflow, /OLIVER_BIRTH_DATE:[^\n]*secrets\.OLIVER_BIRTH_DATE/);
  assert.match(workflow, /REQUIRE_OLIVER_AGE:/);
  assert.doesNotMatch(workflow, /OLIVER_BIRTH_DATE:\s*\d/);
  assert.equal(workflow.split(productionCondition).length - 1, 3);
  assert.match(workflow, /path: \.\/out/);
  assert.doesNotMatch(workflow, /\bCNAME\b|basePath|assetPrefix/);
});

test("keeps private files, original media, and generated output outside the public Git set", () => {
  const publicFiles = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: projectRoot, encoding: "utf8" },
  ).split("\0").filter(Boolean).map((file) => file.replaceAll("\\", "/").toLowerCase());
  const forbiddenPaths = [
    ".openai/hosting.json",
    "app/age.mjs",
    "outputs/",
    "work/",
    "node_modules/",
    ".next/",
    ".vinext/",
    ".wrangler/",
    "dist/",
    "out/",
    "private-media/",
    "originals/",
  ];
  const forbiddenExtensions = /\.(?:3gp|7z|arw|avi|cr2|dng|docx|gz|heic|heif|m4v|mkv|mov|mp4|mpeg|mpg|nef|ogv|pdf|raw|tar|tif|tiff|webm|wmv|zip)$/i;

  for (const file of publicFiles) {
    assert.equal(
      forbiddenPaths.some((prefix) => file === prefix.slice(0, -1) || file.startsWith(prefix)),
      false,
      file,
    );
    assert.doesNotMatch(file, forbiddenExtensions);
    assert.doesNotMatch(file, /(?:^|\/)\.env(?:\.|$)/i);
    assert.notEqual(path.posix.basename(file), "cname");
  }
});

test("keeps the private date server-only and sends only formatted age to locale pages", async () => {
  const [serverAge, ageCore, englishPage, chinesePage] = await Promise.all([
    read("lib/current-age.server.ts"),
    read("lib/age.mjs"),
    read("app/(english)/en/page.tsx"),
    read("app/(chinese)/zh-hant/page.tsx"),
  ]);

  assert.match(serverAge, /import\s+["']server-only["']/);
  assert.match(serverAge, /process\.env\.OLIVER_BIRTH_DATE/);
  assert.match(ageCore, /HONG_KONG_TIME_ZONE\s*=\s*["']Asia\/Hong_Kong["']/);
  assert.doesNotMatch(serverAge, /NEXT_PUBLIC_/);
  for (const page of [englishPage, chinesePage]) {
    assert.match(page, /getCurrentPortfolioAge\(\)/);
    assert.doesNotMatch(page, /process\.env|OLIVER_BIRTH_DATE|NEXT_PUBLIC_/);
  }

  const sourceFiles = [
    ...await collectSourceFiles("app"),
    ...await collectSourceFiles("lib"),
  ];
  const source = (await Promise.all(sourceFiles.map(read))).join("\n");
  assert.doesNotMatch(source, /\b\d{4}-\d{2}-\d{2}\b/);
  const privateBirthDate = process.env.OLIVER_BIRTH_DATE?.trim();
  if (privateBirthDate) assert.equal(source.includes(privateBirthDate), false);
});

test("defines accurate public metadata, review robots, alternates, and icons", async () => {
  const [metadata, rootLayout, englishLayout, chineseLayout] = await Promise.all([
    read("app/site-metadata.ts"),
    read("app/(root)/layout.tsx"),
    read("app/(english)/layout.tsx"),
    read("app/(chinese)/layout.tsx"),
  ]);

  assert.match(metadata, /Oliver YEUNG \| A Little Learning Journey/);
  assert.match(metadata, /lovingly gathered by Oliver's parents/);
  assert.match(metadata, /爸爸媽媽用心收集一個個日常片段/);
  for (const directive of ["index: false", "follow: false", "noarchive: true", "nosnippet: true", "noimageindex: true"]) {
    assert.match(metadata, new RegExp(directive.replace(" ", "\\s*")));
  }
  for (const icon of ["favicon.svg", "favicon-16x16.png", "favicon-32x32.png", "apple-touch-icon.png"]) {
    assert.match(metadata, new RegExp(icon.replace(".", "\\.")));
  }
  assert.match(rootLayout, /<html lang="en-HK">/);
  assert.match(englishLayout, /<html lang="en-HK">/);
  assert.match(chineseLayout, /<html lang="zh-Hant-HK">/);
});

test("uses supplied factual content, restrained placeholders, and privacy-enhanced video", async () => {
  const appFiles = (await collectSourceFiles("app")).filter((file) => /\.[jt]sx?$/.test(file));
  const appSource = (await Promise.all(appFiles.map(read))).join("\n");
  const [portfolio, controls, copy, media, responsivePhoto, youtubeVideo, welcomeIntro, css] = await Promise.all([
    read("app/OliverPortfolio.tsx"),
    read("app/PortfolioControls.tsx"),
    read("app/portfolio-copy.ts"),
    read("app/PreviewMedia.tsx"),
    read("app/ResponsivePhoto.tsx"),
    read("app/YouTubeVideo.tsx"),
    read("app/WelcomeIntro.tsx"),
    read("app/globals.css"),
  ]);

  for (const pattern of [
    /\bK\s*1\b/i,
    /\b(?:application|applicant|admissions?)\b/i,
    /kindergarten/i,
    /(?:入學|申請|招生|學生|繁體中文)/u,
    /(?:private portfolio|private review|unpublished review)/i,
    /one-page summary|一頁摘要/i,
  ]) assert.doesNotMatch(appSource, pattern);

  assert.match(copy, /Oliver's everyday world/);
  assert.match(copy, /昊熹的日常小世界/);
  assert.match(copy, /Everyday pages, little steps/);
  assert.match(copy, /日子一頁頁，腳步一點點/);
  assert.match(copy, /Family & Care/);
  assert.match(copy, /家庭與陪伴/);
  assert.match(copy, /Secure in love, free to explore/);
  assert.match(copy, /在愛裏安心，在陪伴中探索/);
  assert.match(copy, /Oliver's learning journey/);
  assert.match(copy, /昊熹的成長旅程/);
  assert.match(copy, /Reading together/);
  assert.match(copy, /親子共讀/);
  assert.match(copy, /Cars and dogs/);
  assert.match(copy, /車和小狗/);
  assert.match(copy, /Working things out/);
  assert.match(copy, /專注解難/);
  assert.match(copy, /Noticing and remembering/);
  assert.match(copy, /細心觀察/);
  assert.match(copy, /often chooses a book from the shelf/);
  assert.match(copy, /主動從書架拿起書本/);
  assert.match(copy, /vroom vroom/);
  assert.match(copy, /車一出現.*說「嗚嗚」/);
  assert.match(copy, /glasses remind him of Dad, a bald head of Grandpa/);
  assert.match(copy, /戴眼鏡的是爸爸，光頭的是公公/);
  assert.doesNotMatch(copy, /fast learner|有很強記憶力|looks towards the teacher/i);
  assert.match(copy, /Oliver is growing up surrounded by Mum, Dad/);
  assert.match(copy, /昊熹在爸爸媽媽和家人的陪伴中長大/);
  assert.match(copy, /A book together, every day/);
  assert.match(copy, /每天共讀一頁/);
  assert.match(copy, /Where our story began/);
  assert.match(copy, /回到故事起點/);
  assert.match(copy, /Held by many loving hands/);
  assert.match(copy, /許多雙疼愛他的手/);
  assert.match(copy, /A quiet portrait from 13 months/);
  assert.match(copy, /13個月大時留下的一張安靜近照/);
  assert.match(copy, /time: "10 months"/);
  assert.match(copy, /time: "14 months"/);
  assert.match(copy, /time: "16 months"/);
  assert.match(copy, /time: "10個月大"/);
  assert.match(copy, /time: "14個月大"/);
  assert.match(copy, /time: "16個月大"/);
  assert.match(copy, /How we stay alongside him/);
  assert.match(copy, /我們如何陪伴/);
  assert.match(copy, /Growing alongside him/);
  assert.match(copy, /陪着他，一起長大/);
  assert.match(copy, /a child's growth begins with steady, sincere companionship at home/);
  assert.match(copy, /孩子的成長始於家庭裏安穩而真誠的陪伴/);
  assert.match(copy, /Twelve everyday moments/);
  assert.match(copy, /十二個日常小片段/);
  assert.match(copy, /Laughter held close/);
  assert.match(copy, /笑聲留在身旁/);
  for (const title of [
    "Listening closely and following a request",
    "Recognising his body and family",
    "A gentle hello to the animals",
    "A brave step into the water",
    "Little hands turning page after page",
    "Returning to music",
    "細心聆聽，跟着做",
    "認識身體和家人",
    "輕輕走近小動物",
    "勇敢走進水中",
    "小手翻過一頁頁書",
    "再次走近音樂",
  ]) assert.match(copy, new RegExp(title));
  assert.match(copy, /name: "hero-portrait"/);
  assert.match(copy, /A recent portrait|looks calmly towards the camera/);
  assert.match(copy, /昊熹19個月大時的一張近照/);
  assert.match(copy, /With a problem-solving toy in front of him/);
  assert.match(copy, /玩解難玩具時/);
  assert.match(copy, /Welcome to Oliver's little world/);
  assert.match(copy, /歡迎走進昊熹的小世界/);
  assert.match(copy, /“Clean up,”/);
  assert.match(copy, /“Bye bye.”/);
  assert.match(copy, /「Clean up」/);
  assert.match(copy, /「Bye bye」/);
  assert.doesNotMatch(copy, /Videos never play automatically|影片不會自動播放/);
  for (const clue of [
    "聆聽回應", "日常參與", "認識身體", "認出家人", "自主翻閱",
    "專注閱讀", "水中探索", "願意嘗試", "音樂探索", "再次走近",
    "細心觀察", "溫柔接觸",
  ]) assert.match(copy, new RegExp(`tags: \\[.*${clue}`));
  assert.match(copy, /These six stories/);
  assert.match(copy, /六個小片段/);
  assert.match(copy, /tried to climb onto the pool edge/);
  assert.match(copy, /A low shelf keeps picture books, Chinese and English books and reading-pen books within easy reach/);
  assert.match(copy, /every night before bed/);
  assert.match(copy, /也試着自己爬上池邊/);
  assert.match(copy, /家中低矮的書架放着繪本、中英文圖書和點讀書/);
  assert.doesNotMatch(copy, /音樂天賦|冷靜平穩的性格|適時力|fast learner|有很強記憶力/i);
  assert.doesNotMatch(copy, /Stories taking shape|故事正在成形|A learning story to come|Family & Home/);
  assert.doesNotMatch(copy, /problem-solving moment to be added|noticing moment to be added|解難小片段稍後加入|觀察小片段稍後加入/i);
  assert.doesNotMatch(copy, /"\[[^"]+\]"/);

  for (const videoId of [
    "2RE83LVmTVk",
    "FW24LCUNS_w",
    "BxMkQkxApBg",
    "9QrYnWYsVUQ",
    "1Fxx4dzHCFo",
    "kgPKylmVI7s",
    "rcpBdZzHJAk",
  ]) assert.equal(copy.split(videoId).length - 1, 2, videoId);

  for (const poster of [
    "problem-solving",
    "following-directions",
    "body-and-family",
    "reading-pages",
    "water-step",
    "piano-keys",
    "feeding-rabbits",
  ]) assert.equal(copy.split(`poster: "${poster}"`).length - 1, 2, poster);

  for (const id of ["top", "about", "stories", "growth", "family"]) {
    assert.match(portfolio, new RegExp(`id=["']${id}["']`));
  }
  assert.doesNotMatch(portfolio, /privacy-notice|privacy-title|href=["']#privacy/);
  assert.match(portfolio, /className="footer-privacy">\{copy\.privacy\.body\}/);
  assert.match(portfolio, /copy\.stories\.items\.map/);
  assert.doesNotMatch(portfolio, /plannedItems|planned-stories/);
  assert.match(portfolio, /copy\.growth\.milestones\.map/);
  assert.match(portfolio, /copy\.family\.vignettes\.map/);
  assert.match(portfolio, /copy\.family\.photos\.map/);
  assert.match(portfolio, /stories-section section-pad/);
  assert.doesNotMatch(portfolio, /future-growth-section|future-growth-list|recent-moments-grid/);
  assert.match(portfolio, /growth-milestone-list/);
  assert.match(portfolio, /<YouTubeVideo/);
  assert.match(portfolio, /<WelcomeIntro/);
  assert.doesNotMatch(copy, /Learning clue 0\d · to be added|學習線索 0\d · 稍後加入/);
  assert.ok(portfolio.indexOf('id="about"') < portfolio.indexOf('id="stories"'));
  assert.ok(portfolio.indexOf('id="stories"') < portfolio.indexOf('id="growth"'));
  assert.ok(portfolio.indexOf('id="growth"') < portfolio.indexOf('id="family"'));
  assert.equal((portfolio.match(/id="growth"/g) ?? []).length, 1);
  assert.ok((portfolio.match(/<ResponsivePhoto/g) ?? []).length >= 6);
  assert.match(portfolio, /IntersectionObserver/);
  assert.match(portfolio, /markPendingSection\(item\.href\)/);
  assert.match(portfolio, /const sectionIds = \["about", "stories", "growth", "family"\] as const/);
  assert.match(portfolio, /markPendingSection\(destination\)[\s\S]*?scrollIntoView/);
  assert.match(portfolio, /querySelector<HTMLElement>\(destination\)[\s\S]*?scrollIntoView\(\{ block: "start" \}\)/);
  assert.match(portfolio, /root\.classList\.add\("is-scroll-ready"\)/);
  assert.match(portfolio, /root\.classList\.remove\("is-scroll-ready"\)/);
  assert.match(css, /html\s*\{[\s\S]*?scroll-behavior:\s*auto/);
  assert.match(css, /html\.is-scroll-ready\s*\{[\s\S]*?scroll-behavior:\s*smooth/);
  assert.match(portfolio, /aria-current=\{activeHref === item\.href \? "location"/);
  assert.doesNotMatch(portfolio, /SummaryLink|copy\.videos|journal-principles|usePointerContextMenuDeterrent/);
  assert.doesNotMatch(portfolio, /PrintButton|controls\.print/);
  assert.doesNotMatch(controls, /SummaryLink|SummaryIcon|HomeLink|HomeIcon|PrintButton|PrintIcon|window\.print|contextmenu/);
  assert.match(controls, /const readingLine = 120/);
  assert.match(controls, /export function markPendingSection/);
  assert.match(controls, /root\.dataset\.scrollTarget = destination/);
  assert.doesNotMatch(controls, /scrollend|clearWhenArrived/);
  assert.match(controls, /window\.setTimeout\(clearPendingSection, 1800\)/);
  assert.match(controls, /\["about", "stories", "growth", "family"\]/);
  assert.match(controls, /bounds\.top <= readingLine && bounds\.bottom > readingLine/);
  assert.match(controls, /resolveLanguageSection\(\{[\s\S]*?nearTop: window\.scrollY < readingLine[\s\S]*?pendingSection[\s\S]*?currentSectionId: currentSection\?\.id[\s\S]*?routeHash/);
  assert.doesNotMatch(copy, /Print this page|列印本頁|printLabel/);
  assert.doesNotMatch(media, /preview-play/);
  assert.doesNotMatch(portfolio, /<img\b|<video\b|<picture\b|<iframe\b/);
  assert.match(youtubeVideo, /https:\/\/www\.youtube-nocookie\.com\/embed\/\$\{videoId\}/);
  assert.match(youtubeVideo, /active \? \(/);
  assert.match(youtubeVideo, /onClick=\{\(\) => setActive\(true\)\}/);
  assert.match(youtubeVideo, /\{loadingLabel\}/);
  assert.match(youtubeVideo, /className="youtube-video-poster"/);
  assert.match(youtubeVideo, /\/media\/video\/\$\{poster\}-\$\{posterLarge\}\.webp/);
  assert.match(youtubeVideo, /srcSet=.*posterSmall[\s\S]*?posterLarge/);
  assert.match(youtubeVideo, /alt=""/);
  assert.doesNotMatch(youtubeVideo, /i\.ytimg\.com|img\.youtube\.com/);
  assert.match(copy, /loadingVideo: "Loading video…"/);
  assert.match(copy, /loadingVideo: "正在載入影片……"/);
  assert.match(youtubeVideo, /loading="lazy"/);
  assert.match(youtubeVideo, /tabIndex=\{0\}/);
  assert.match(youtubeVideo, /useLayoutEffect/);
  assert.match(youtubeVideo, /iframeRef\.current\?\.focus\(\)/);
  assert.doesNotMatch(youtubeVideo, /onLoad=\{\(\) => \{[\s\S]*?iframeRef\.current\?\.focus\(\)/);
  assert.match(youtubeVideo, /referrerPolicy="strict-origin-when-cross-origin"/);
  assert.match(youtubeVideo, /allowFullScreen/);
  assert.doesNotMatch(youtubeVideo, /youtube\.com\/watch|openLabel|autoplay=1[^\n]*setActive\(true\)/);
  assert.match(welcomeIntro, /sessionStorage\.getItem\(/);
  assert.match(welcomeIntro, /sessionStorage\.setItem\(/);
  assert.match(welcomeIntro, /prefers-reduced-motion: reduce/);
  assert.match(welcomeIntro, /navigator\.connection/);
  assert.match(welcomeIntro, /window\.location\.hash/);
  assert.match(welcomeIntro, /event\.key === "Escape"/);
  assert.doesNotMatch(welcomeIntro, /(?:set|remove)Attribute\("inert"/);
  assert.match(welcomeIntro, /tabIndex=\{-1\}/);
  assert.match(welcomeIntro, /document\.addEventListener\("focusin", keepFocusOnWelcome, true\)/);
  assert.match(welcomeIntro, /event\.key === "Tab"[\s\S]*?event\.preventDefault\(\)[\s\S]*?root\.focus/);
  assert.match(welcomeIntro, /document\.activeElement/);
  assert.match(welcomeIntro, /document\.removeEventListener\("focusin", keepFocusOnWelcome, true\)/);
  assert.match(welcomeIntro, /heroTitle\.dataset\.welcomeFocus = "quiet"/);
  assert.match(welcomeIntro, /window\.addEventListener\("keydown", clearQuietFocus, true\)/);
  assert.match(welcomeIntro, /window\.addEventListener\("pointerdown", clearQuietFocus, true\)/);
  assert.match(css, /\.greeting-heading\[data-welcome-focus="quiet"\]:focus-visible\s*\{[\s\S]*?outline:\s*none/);
  assert.doesNotMatch(welcomeIntro, /(?:setAttribute\("aria-hidden"|\.setAttribute\("inert")/);
  assert.doesNotMatch(welcomeIntro, /<img|<picture|<source|welcome-photo|motionClass/);
  assert.match(welcomeIntro, /<div[\s\S]*?id="welcome-intro"/);
  assert.doesNotMatch(welcomeIntro, /setInterval|\bloop\b|\.jpe?g|10(?:0\d|1\d)|skipLabel|welcome-skip/i);
  assert.match(welcomeIntro, /const welcomeDurationMs = 3200/);
  assert.match(welcomeIntro, /window\.setTimeout\(\(\) => \{[\s\S]*?completeWelcome\(false\)[\s\S]*?welcomeDurationMs/);
  assert.match(welcomeIntro, /__oliverWelcomeFailOpenTimer/);
  assert.match(welcomeIntro, /window\.__oliverWelcomeShouldPlay = false/);
  assert.match(welcomeIntro, /welcomeWindow\.__oliverWelcomeShouldPlay === true &&[\s\S]*?root\?\.dataset\.welcomeState === "play"/);
  assert.match(welcomeIntro, /current\.dataset\.welcomeState = "hidden"/);
  assert.match(welcomeIntro, /document\.body\.classList\.remove\("welcome-open"\)/);
  assert.match(welcomeIntro, /\}, \$\{welcomeDurationMs \+ 1_000\}\);/);
  assert.match(css, /data-welcome-state="exiting"\][\s\S]*?animation:\s*welcome-exit 280ms/);
  assert.doesNotMatch(css, /welcome-photo|welcome-photo-pair/);
  assert.match(css, /\.welcome-message\s*\{[\s\S]*?animation:\s*welcome-message 3\.2s/);
  assert.match(css, /@keyframes welcome-message[\s\S]*?18\.75%, 68\.75%[\s\S]*?83\.75%, 100%/);
  assert.match(css, /@keyframes welcome-surface[\s\S]*?100%\s*\{[\s\S]*?visibility:\s*hidden[\s\S]*?pointer-events:\s*none/);
  assert.match(css, /\.growth-milestone-list \.timeline-dot\s*\{[\s\S]*?width:\s*18px[\s\S]*?border:\s*4px solid var\(--sage\)[\s\S]*?background:\s*var\(--honey\)/);
  assert.match(css, /html:has\(body\.welcome-open\)\s*\{[\s\S]*?scrollbar-gutter:\s*auto/);
  assert.doesNotMatch(css, /\.welcome-skip/);
  assert.match(css, /\.youtube-video-video \.youtube-video-trigger-label\s*\{[\s\S]*?display:\s*none/);
  assert.match(responsivePhoto, /<picture>/);
  assert.match(responsivePhoto, /type="image\/avif"/);
  assert.match(responsivePhoto, /<img/);
  assert.match(responsivePhoto, /srcSet=\{srcSet\(name, "webp"\)\}/);
  assert.match(responsivePhoto, /portrait:\s*\{ width: 1200, height: 1600 \}/);
  assert.match(responsivePhoto, /"hero-portrait":\s*\{ width: 1200, height: 1600 \}/);
  assert.match(responsivePhoto, /"about-world":\s*\{ width: 1200, height: 1500 \}/);
  assert.match(responsivePhoto, /"story-swimming":\s*\{ width: 1200, height: 800 \}/);
  assert.match(responsivePhoto, /"about-observing":\s*\{ width: 1200, height: 900 \}/);
  assert.match(responsivePhoto, /"story-animals":\s*\{ width: 1200, height: 800 \}/);
  assert.match(responsivePhoto, /"growth-swing":\s*\{ width: 1200, height: 1500 \}/);
  assert.match(responsivePhoto, /"family-main":\s*\{ width: 1200, height: 800 \}/);
  assert.match(responsivePhoto, /"family-playful":\s*\{ width: 1200, height: 1500 \}/);
  assert.match(responsivePhoto, /"growth-supported":\s*\{ width: 1200, height: 1500 \}/);
  assert.match(responsivePhoto, /width=\{dimensions\.width\}/);
  assert.match(responsivePhoto, /height=\{dimensions\.height\}/);
  assert.match(responsivePhoto, /loading=\{priority \? "eager" : "lazy"\}/);
  assert.match(responsivePhoto, /fetchPriority=\{priority \? "high" : "auto"\}/);
  assert.match(responsivePhoto, /decoding="async"/);
  assert.doesNotMatch(responsivePhoto, /\.jpe?g|10(?:0\d|1\d)|\b20\d{2}-\d{2}-\d{2}\b/i);
});

test("ships only the approved reduced metadata-free photo derivatives", async () => {
  const photoDirectory = path.join(projectRoot, "public", "media", "oliver");
  const files = (await readdir(photoDirectory)).sort();
  const expected = [];
  for (const name of [
    "about-car",
    "about-observing",
    "about-reading",
    "about-world",
    "family-care",
    "family-main",
    "family-origin",
    "growth-firefighter",
    "growth-swing",
    "hero-portrait",
    "portrait",
    "story-animals",
    "story-swimming",
    "family-playful",
    "growth-supported",
  ]) {
    for (const width of [480, 800, 1200]) {
      for (const extension of ["avif", "webp"]) expected.push(`${name}-${width}.${extension}`);
    }
  }
  assert.deepEqual(files, expected.sort());

  for (const file of files) {
    const bytes = await readFile(path.join(photoDirectory, file));
    assert.ok(bytes.length > 1_000 && bytes.length < 250_000, file);
    assert.equal(bytes.includes(Buffer.from("Exif")), false, file);
    for (const originalName of [
      "1001", "1002", "1003", "1010", "1011", "1012", "1013", "1014", "1015", "1016", "1017", "1018", "1019", "1020", "1021", "1022", "1023",
    ]) assert.equal(bytes.includes(Buffer.from(originalName)), false, file);
    assert.equal(bytes.includes(Buffer.from("GPS")), false, file);
  }
});

test("ships only approved local metadata-free video posters", async () => {
  const posterDirectory = path.join(projectRoot, "public", "media", "video");
  const files = (await readdir(posterDirectory)).sort();
  const expected = [
    ...["problem-solving"].flatMap((name) => [320, 480].map((width) => `${name}-${width}.webp`)),
    ...[
      "body-and-family",
      "feeding-rabbits",
      "following-directions",
      "piano-keys",
      "reading-pages",
      "water-step",
    ].flatMap((name) => [240, 405].map((width) => `${name}-${width}.webp`)),
  ].sort();

  assert.deepEqual(files, expected);
  for (const file of files) {
    const bytes = await readFile(path.join(posterDirectory, file));
    assert.ok(bytes.length > 1_000 && bytes.length < 150_000, file);
    for (const marker of [
      "Exif", "GPS", "XMP", "youtube", "youtu.be",
      "9QrYnWYsVUQ", "1Fxx4dzHCFo", "FW24LCUNS_w", "kgPKylmVI7s",
      "BxMkQkxApBg", "2RE83LVmTVk", "rcpBdZzHJAk",
    ]) {
      assert.equal(bytes.includes(Buffer.from(marker)), false, `${file}: ${marker}`);
    }
  }
});

test("serves the approved responsive photo formats with correct MIME types", async () => {
  const server = await read("scripts/serve-pages.mjs");

  assert.match(server, /\["\.avif",\s*"image\/avif"\]/);
  assert.match(server, /\["\.jpg",\s*"image\/jpeg"\]/);
  assert.match(server, /\["\.webp",\s*"image\/webp"\]/);
});

test("implements immediate language routing and an accessible section-aware selector", async () => {
  const [rootRedirect, controls, copy, notFound, portfolio] = await Promise.all([
    read("app/RootRedirect.tsx"),
    read("app/PortfolioControls.tsx"),
    read("app/portfolio-copy.ts"),
    read("app/global-not-found.tsx"),
    read("app/OliverPortfolio.tsx"),
  ]);

  assert.doesNotMatch(rootRedirect, /["']use client["']|useEffect|Opening|Loading|正在開啟/);
  assert.match(rootRedirect, /localStorage\.getItem\("oliver-portfolio-language"\)/);
  assert.match(rootRedirect, /navigator\.language/);
  assert.match(rootRedirect, /startsWith\("zh"\)/);
  assert.match(rootRedirect, /window\.location\.replace/);
  assert.match(rootRedirect, /<noscript>/);
  assert.match(rootRedirect, /aria-label="中文 \| English"/);
  assert.match(copy, /en:\s*\{ home: "\/en\/" \}/);
  assert.match(copy, /zh:\s*\{ home: "\/zh-hant\/" \}/);
  assert.match(controls, />\s*中文\s*/);
  assert.match(controls, />\s*English\s*/);
  assert.match(controls, /window\.location\.hash/);
  assert.match(controls, /window\.scrollY < readingLine/);
  assert.match(controls, /document\.documentElement\.dataset\.scrollTarget/);
  assert.match(controls, /\.desktop-nav a\[aria-current=\"location\"\]/);
  assert.match(controls, /sectionHashes\.includes\(window\.location\.hash\)/);
  assert.match(controls, /resolveLanguageSection/);
  assert.match(controls, /anchor\.dataset\.languageDestination = destination/);
  assert.match(controls, /event\.detail > 0[\s\S]*?event\.currentTarget\.dataset\.languageDestination/);
  assert.match(controls, /event\.currentTarget\.href = destination/);
  assert.match(controls, /const plainPrimaryClick =[\s\S]*?event\.button === 0[\s\S]*?!event\.ctrlKey[\s\S]*?!event\.metaKey[\s\S]*?!event\.shiftKey/);
  assert.match(controls, /if \(plainPrimaryClick\)[\s\S]*?event\.preventDefault\(\)[\s\S]*?window\.location\.assign\(destination\)/);
  assert.equal((controls.match(/onPointerDown=\{\(event\) => prepareLanguageLink/g) ?? []).length, 2);
  assert.doesNotMatch(controls, /onFocus=/);
  assert.equal((controls.match(/event\.key === "Enter"/g) ?? []).length, 2);
  assert.equal((controls.match(/href=\{`\$\{localePaths\.(?:zh|en)\.home\}\$\{activeHref\}`\}/g) ?? []).length, 2);
  assert.match(portfolio, /activeHref=\{activeHref\}/);
  assert.match(controls, /dialog\.showModal\(\)/);
  assert.match(controls, /onCancel=/);
  assert.match(controls, /onKeyDown=[\s\S]*?event\.key === "Escape"[\s\S]*?closeMenu\(\)/);
  assert.match(controls, /event\.key !== "Tab"/);
  assert.match(controls, /dialog\.querySelectorAll<HTMLElement>\("button:not\(\[disabled\]\), a\[href\]"\)/);
  assert.match(controls, /event\.shiftKey && document\.activeElement === first/);
  assert.match(controls, /!event\.shiftKey && document\.activeElement === last/);
  assert.match(controls, /document\.body\.style\.overflow = "hidden"/);
  assert.match(controls, /triggerRef\.current\?\.focus\(\)/);
  assert.match(controls, /aria-current=\{activeHref === item\.href \? "location"/);
  assert.match(notFound, /aria-label="中文 \| English"/);
});

test("keeps the greeting accessible, one-time, motion-safe, and cursor-correct", async () => {
  const [greeting, css] = await Promise.all([
    read("app/GreetingReveal.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(greeting, /<span className="sr-only">\{greeting\}<\/span>/);
  assert.match(greeting, /greeting-visual" aria-hidden="true"/);
  assert.match(greeting, /greeting-reserve/);
  assert.match(greeting, /sessionStorage\.getItem\(key\)/);
  assert.match(greeting, /sessionStorage\.setItem\(key, "seen"\)/);
  assert.match(greeting, /prefers-reduced-motion: reduce/);
  assert.match(greeting, /addEventListener\("animationend", completeGreeting/);
  assert.match(greeting, /tabIndex=\{-1\}/);
  assert.doesNotMatch(greeting, /setInterval|autoPlay|\bloop\b/);
  assert.match(css, /greeting-cursor-rest[\s\S]*?animation:\s*greeting-cursor-last[^;]*forwards/);
  assert.doesNotMatch(css, /greeting-cursor-rest[\s\S]*?animation:\s*greeting-cursor-last[^;]*both/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /animation:[^;}]*\bboth\b/);
  assert.match(css, /html\s*\{[\s\S]*?scroll-padding-top:\s*calc\(var\(--header-height\) \+ 20px\)/);
  assert.doesNotMatch(css, /\.section-pad\s*\{[^}]*scroll-margin-top/);
  assert.match(css, /\.greeting-heading \.greeting-cursor[\s\S]*?display:\s*none !important/);
});

test("adds lively Sunlit Meadow decoration without accessibility or motion debt", async () => {
  const [portfolio, decor, css] = await Promise.all([
    read("app/OliverPortfolio.tsx"),
    read("app/MeadowDecor.tsx"),
    read("app/globals.css"),
  ]);

  for (const variant of ["rainbow", "tree", "balloons", "dog", "garden"]) {
    assert.match(portfolio, new RegExp(`MeadowDecor\\s+variant=["']${variant}["']`));
  }
  assert.match(decor, /aria-hidden="true"/);
  assert.match(decor, /IntersectionObserver/);
  assert.match(decor, /prefers-reduced-motion: reduce/);
  assert.match(decor, /sessionStorage\.getItem\(dogSessionKey\(locale\)\)/);
  assert.match(decor, /sessionStorage\.setItem\(dogSessionKey\(locale\), "seen"\)/);
  assert.match(decor, /oliver-meadow-dog-\$\{locale\}-v3/);
  for (const scenePart of [
    "meadow-rainbow-cloud-left",
    "meadow-rainbow-cloud-right",
    "meadow-tree-ground",
    "meadow-dog-hill-back",
    "meadow-dog-hill-front",
    "meadow-dog-path",
    "meadow-garden-sprout",
    "meadow-garden-butterfly",
  ]) {
    assert.match(decor, new RegExp(scenePart));
  }
  assert.doesNotMatch(decor, /<svg|<img|<canvas|role="img"|aria-label=/i);
  assert.doesNotMatch(css, /meadow-[^;{}]*animation:[^;{}]*\binfinite\b/i);
  assert.match(css, /meadow-dog-cross 4\.8s[^;]*forwards/);
  assert.match(css, /--meadow-dog-distance:\s*min\(64vw, 748px\)/);
  assert.match(css, /meadow-balloon-blue 4\.9s[^;]*forwards/);
  assert.match(css, /meadow-balloon-peach 4\.8s 100ms[^;]*forwards/);
  assert.match(css, /meadow-balloon-honey 4\.7s 180ms[^;]*forwards/);
  assert.match(css, /\.hero-copy\s*\{[\s\S]*?position:\s*relative[\s\S]*?z-index:\s*3/);
  assert.match(css, /\.hero-visual\s*\{[\s\S]*?z-index:\s*1[\s\S]*?overflow:\s*clip/);
  assert.match(css, /\.hero-visual \.meadow-decor-rainbow\s*\{[\s\S]*?position:\s*absolute[\s\S]*?z-index:\s*0[\s\S]*?width:\s*190%[\s\S]*?aspect-ratio:\s*520 \/ 298/);
  assert.match(css, /\.hero-preview-media\s*\{[\s\S]*?z-index:\s*2/);
  assert.match(css, /@media \(min-width: 48rem\)[\s\S]*?\.hero-visual \.meadow-decor-rainbow\s*\{[\s\S]*?width:\s*190%/);
  assert.match(css, /@media \(min-width: 72rem\)[\s\S]*?\.hero-visual \.meadow-decor-rainbow\s*\{[\s\S]*?width:\s*190%/);
  assert.doesNotMatch(css, /right:\s*-210px|31\.25vw - 440px/);
  assert.match(css, /\.meadow-decor-balloons\s*\{[\s\S]*?overflow:\s*visible[\s\S]*?contain:\s*layout/);
  assert.match(css, /\.meadow-decor-tree\s*\{[\s\S]*?overflow:\s*visible[\s\S]*?contain:\s*layout/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.meadow-decor-dog[\s\S]*?display:\s*none !important/);
  assert.match(css, /@media \(forced-colors: active\)[\s\S]*?\.meadow-decor[\s\S]*?display:\s*none !important/);
  assert.match(css, /@media print[\s\S]*?\.meadow-decor[\s\S]*?display:\s*none !important/);
  assert.match(css, /\.meadow-decor\s*\{[\s\S]*?pointer-events:\s*none[\s\S]*?user-select:\s*none/);
});

test("uses a child-free Sunlit Meadow social-preview image", async () => {
  const [rootLayout, englishPage, chinesePage, preview] = await Promise.all([
    read("app/(root)/layout.tsx"),
    read("app/(english)/en/page.tsx"),
    read("app/(chinese)/zh-hant/page.tsx"),
    readFile(path.join(projectRoot, "public", "social-preview.jpg")),
  ]);

  for (const metadata of [rootLayout, englishPage, chinesePage]) {
    assert.match(metadata, /\/social-preview\.jpg/);
    assert.match(metadata, /width:\s*1200/);
    assert.match(metadata, /height:\s*630/);
    assert.match(metadata, /card:\s*["']summary_large_image["']/);
  }
  assert.ok(preview.length > 20_000 && preview.length < 250_000);
  assert.equal(preview.includes(Buffer.from("Exif")), false);
  assert.equal(preview.includes(Buffer.from("GPS")), false);
});

test("uses the Sunlit Meadow palette, one typography system, and accessible controls", async () => {
  const css = await read("app/globals.css");

  assert.match(css, /--font-sans:\s*"Noto Sans TC",\s*"PingFang TC",\s*"Microsoft JhengHei",\s*system-ui/);
  assert.doesNotMatch(css, /Noto Serif|Georgia|--serif|@font-face|@import\s+url/i);
  assert.doesNotMatch(css, /font-weight:\s*(?:[789]00|bold|bolder)\b/i);
  assert.match(css, /--focus-ring:\s*3px solid/);
  assert.match(css, /:focus-visible[\s\S]*?outline:\s*var\(--focus-ring\)/);
  assert.match(css, /\.closing-section \.eyebrow\s*\{[\s\S]*?color:\s*var\(--ink\)/);
  assert.match(css, /\.footer-privacy[\s\S]*?border-inline-start:\s*3px solid var\(--sage\)/);
  assert.match(css, /aria-current="location"/);
  assert.match(css, /@media print/);
  assert.doesNotMatch(css, /story-media-note/);
  assert.match(css, /@media print[\s\S]*?\.preview-only\s*\{[\s\S]*?display:\s*none !important/);
  assert.doesNotMatch(css, /\.preview-note,\s*\.story-media-note/);
  for (const token of ["#FFF9E6", "#29404A", "#C4DDEA", "#5C8B7F", "#3F6D65", "#E0AD3F", "#EEA283"]) {
    assert.match(css, new RegExp(token));
  }
  assert.doesNotMatch(css, /summary-(?:card|main|link|hero|footer)|video-preview-grid|preview-play/);
});

test("keeps responsive navigation, photographs, focus movement, and motion polished", async () => {
  const [portfolio, controls, media, responsivePhoto, css] = await Promise.all([
    read("app/OliverPortfolio.tsx"),
    read("app/PortfolioControls.tsx"),
    read("app/PreviewMedia.tsx"),
    read("app/ResponsivePhoto.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(portfolio, /<main id="main-content" tabIndex=\{-1\}>/);
  assert.match(portfolio, /className="skip-link" href="#main-content" onClick=\{focusMain\}/);
  assert.match(portfolio, /className="wordmark-name" lang="en-HK"/);
  assert.doesNotMatch(portfolio, /className="wordmark"[\s\S]{0,160}aria-label=/);
  assert.match(portfolio, /id="(?:about|stories|growth|family)-title" tabIndex=\{-1\}/);
  assert.doesNotMatch(portfolio, /id="privacy-title"|id="privacy-notice"/);
  assert.match(portfolio, /const focusSection = \(href: string\)/);
  assert.match(portfolio, /onClick=\{\(\) => \{[\s\S]*?markPendingSection\(item\.href\);[\s\S]*?focusSection\(item\.href\);/);
  assert.doesNotMatch(portfolio, /copy\.hero\.(?:storiesAction|aboutAction)|className="hero-text-link"/);
  assert.doesNotMatch(portfolio, /focusSection\("#privacy-notice"\)|href="#privacy-notice"/);
  assert.match(portfolio, /href="#hero-title"[\s\S]*?onClick=\{focusHero\}/);
  assert.doesNotMatch(portfolio, /className="section-count"/);
  assert.match(controls, /destinationRef/);
  assert.match(controls, /heading\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(controls, /event\.preventDefault\(\)[\s\S]*?destinationRef\.current = item\.href/);
  assert.match(controls, /window\.history\.pushState\(null, "", destination\)/);
  assert.match(controls, /section\?\.scrollIntoView\([\s\S]*?behavior: reducedMotion \? "auto" : "smooth"/);
  assert.match(controls, /event\.target === event\.currentTarget/);
  assert.match(css, /\.mobile-menu-panel[\s\S]*?height:\s*100dvh[\s\S]*?overflow-y:\s*auto[\s\S]*?overscroll-behavior:\s*contain/);
  assert.match(css, /\.mobile-menu-dialog\[open\] \.mobile-menu-panel[\s\S]*?animation:\s*menu-panel-in/);
  assert.doesNotMatch(css, /menu-(?:backdrop|panel)-in[^;}]*\bboth\b/);
  assert.doesNotMatch(css, /hero-journal-enter[^;}]*\bboth\b/);
  assert.match(css, /@media \(min-width: 72rem\)[\s\S]*?\.desktop-nav[\s\S]*?display:\s*flex/);
  assert.match(css, /\.story-media-count-2\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.doesNotMatch(css, /\n\s{2}\.story-media-count-2\s*\{\s*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /@media \(min-width: 72rem\)[\s\S]*?\.story-card-3 \.story-media-count-2,[\s\S]*?\.story-card-4 \.story-media-count-2[\s\S]*?1\.65fr[\s\S]*?0\.65fr/);
  assert.match(css, /\.button:active|\.primary-button:active/);
  assert.match(css, /@media \(hover: hover\)/);
  assert.match(media, /className="preview-media-kind" aria-hidden="true"/);
  assert.match(responsivePhoto, /const widths = \[480, 800, 1200\] as const/);
  assert.match(css, /\.portfolio-photo-frame\s*\{[\s\S]*?aspect-ratio:\s*4 \/ 5/);
  assert.match(css, /\.portfolio-photo-portrait \.portfolio-photo-frame,[\s\S]*?\.portfolio-photo-hero-portrait \.portfolio-photo-frame\s*\{[\s\S]*?aspect-ratio:\s*3 \/ 4/);
  assert.match(css, /\.portfolio-photo img\s*\{[\s\S]*?object-fit:\s*cover/);
  assert.match(css, /\.family-media-grid > \*\s*\{[\s\S]*?grid-column:\s*1 \/ -1/);
});

test("keeps the Pages verifier aligned with the simplified public architecture", async () => {
  const verifier = await read("scripts/verify-pages.mjs");

  assert.doesNotMatch(verifier, /en\/summary\/index\.html|zh-hant\/summary\/index\.html/);
  assert.match(verifier, /process\.env\.OLIVER_BIRTH_DATE/);
  assert.match(verifier, /noindex/);
  assert.match(verifier, /noarchive/);
  assert.match(verifier, /nosnippet/);
  assert.match(verifier, /noimageindex/);
  assert.match(verifier, /favicon\.svg/);
  assert.match(verifier, /approvedSocialPreview\s*=\s*["']social-preview\.jpg["']/);
  assert.match(verifier, /html\.replaceAll\(`\/\$\{approvedSocialPreview\}`/);
  assert.match(verifier, /social preview contains private metadata or an original filename/);
  assert.match(verifier, /Vinext image endpoint/);
  assert.match(verifier, /openaiusercontent/);
  assert.match(verifier, /(?:Student|學生)/);
  assert.match(verifier, /one-page summary|一頁摘要/i);
  assert.doesNotMatch(verifier, /OLIVER_BIRTH_DATE:\s*\d/);
});
