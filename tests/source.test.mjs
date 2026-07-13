import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

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
  assert.match(metadata, /gathered with care by Oliver's parents/);
  assert.match(metadata, /由爸爸媽媽用心整理的一個個日常片段/);
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

test("uses supplied factual content and warm placeholders without admissions or institutional copy", async () => {
  const appFiles = (await collectSourceFiles("app")).filter((file) => /\.[jt]sx?$/.test(file));
  const appSource = (await Promise.all(appFiles.map(read))).join("\n");
  const [portfolio, controls, copy, media, responsivePhoto] = await Promise.all([
    read("app/OliverPortfolio.tsx"),
    read("app/PortfolioControls.tsx"),
    read("app/portfolio-copy.ts"),
    read("app/PreviewMedia.tsx"),
    read("app/ResponsivePhoto.tsx"),
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
  assert.match(copy, /Small steps, gathered over time/);
  assert.match(copy, /日子裏慢慢累積的小步/);
  assert.match(copy, /Family & Care/);
  assert.match(copy, /家庭與陪伴/);
  assert.match(copy, /Growing together, surrounded by care/);
  assert.match(copy, /在陪伴中，一起慢慢成長/);
  assert.match(copy, /Stories taking shape/);
  assert.match(copy, /故事正在成形/);
  assert.match(copy, /Books, every day/);
  assert.match(copy, /每天一起看書/);
  assert.match(copy, /Oliver likes cars—one of the familiar interests/);
  assert.match(copy, /昊熹喜歡車；車是他日常小世界裏熟悉的興趣之一/);
  assert.match(copy, /Oliver notices dogs/);
  assert.match(copy, /昊熹會留意狗仔/);
  assert.match(copy, /Oliver enjoys exploring where things go/);
  assert.match(copy, /昊熹喜歡探索物件應該放在哪裏/);
  assert.match(copy, /Oliver is loved by many people/);
  assert.match(copy, /昊熹身邊有很多疼愛他的人/);
  assert.match(copy, /Reading together, every day/);
  assert.match(copy, /每天一起閱讀/);
  assert.match(copy, /A small family invitation/);
  assert.match(copy, /一個小小的家庭邀請/);
  assert.match(copy, /Loved by many people/);
  assert.match(copy, /在許多人的疼愛中/);
  assert.match(copy, /caption: "Oliver at 13 months"/);
  assert.match(copy, /caption: "An everyday smile at 18 months"/);
  assert.match(copy, /time: "10 months"/);
  assert.match(copy, /time: "14 months"/);
  assert.match(copy, /time: "16 months"/);
  assert.match(copy, /time: "10個月大"/);
  assert.match(copy, /time: "14個月大"/);
  assert.match(copy, /time: "16個月大"/);
  assert.match(copy, /How we continued alongside him/);
  assert.match(copy, /我們如何繼續陪伴/);
  assert.match(copy, /Holding close the little moments/);
  assert.match(copy, /珍惜日常裏的小片段/);
  assert.match(copy, /This little journal now brings together five real stories/);
  assert.match(copy, /這份成長記錄，現在收集了五個真實故事/);
  for (const title of [
    "Little discoveries in books",
    "Listening and helping",
    "Finding where each piece belongs",
    "Pouring from one cup to another",
    "Waving along the way",
    "書頁裏的小發現",
    "聽一聽，一起幫忙",
    "這一塊放哪裏？",
    "慢慢倒進另一隻杯",
    "一路走，一路揮揮手",
  ]) assert.match(copy, new RegExp(title.replace(/[?？]/g, ".")));
  assert.match(copy, /Shared-reading photograph to be added/);
  assert.match(copy, /親子閱讀相片稍後加入/);
  assert.match(copy, /Hidden—and found again/);
  assert.match(copy, /不見了，再找出來/);
  assert.doesNotMatch(copy, /A learning story to come|成長故事 \d{2} · 標題稍後加入|Family & Home/);
  assert.doesNotMatch(copy, /"\[[^"]+\]"/);

  for (const id of ["top", "about", "stories", "growth", "family", "privacy-notice"]) {
    assert.match(portfolio, new RegExp(`id=["']${id}["']`));
  }
  assert.match(portfolio, /copy\.stories\.items\.map/);
  assert.doesNotMatch(portfolio, /plannedItems|planned-stories/);
  assert.match(portfolio, /copy\.growth\.timelineItems\.map/);
  assert.match(portfolio, /copy\.family\.vignettes\.map/);
  assert.doesNotMatch(portfolio, /copy\.family\.media\.map/);
  assert.match(portfolio, /stories-section section-pad preview-only/);
  assert.match(portfolio, /future-growth-section section-pad preview-only/);
  assert.match(portfolio, /future-growth-list/);
  assert.doesNotMatch(copy, /Learning clue 0\d · to be added|學習線索 0\d · 稍後加入/);
  assert.ok(portfolio.indexOf('id="about"') < portfolio.indexOf('id="stories"'));
  assert.ok(portfolio.indexOf('id="stories"') < portfolio.indexOf('id="growth"'));
  assert.ok(portfolio.indexOf('id="growth"') < portfolio.indexOf('id="everyday-title"'));
  assert.ok(portfolio.indexOf('id="everyday-title"') < portfolio.indexOf('id="family"'));
  assert.equal((portfolio.match(/<ResponsivePhoto/g) ?? []).length, 3);
  for (const name of ["portrait", "everyday-smile", "family-care"]) {
    assert.match(portfolio, new RegExp(`name=["']${name}["']`));
  }
  assert.match(portfolio, /IntersectionObserver/);
  assert.match(portfolio, /aria-current=\{activeHref === item\.href \? "location"/);
  assert.doesNotMatch(portfolio, /SummaryLink|copy\.videos|journal-principles|usePointerContextMenuDeterrent/);
  assert.doesNotMatch(portfolio, /PrintButton|controls\.print/);
  assert.doesNotMatch(controls, /SummaryLink|SummaryIcon|HomeLink|HomeIcon|PrintButton|PrintIcon|window\.print|contextmenu/);
  assert.doesNotMatch(copy, /Print this page|列印本頁|printLabel/);
  assert.doesNotMatch(media, /preview-play/);
  assert.doesNotMatch(portfolio, /<img\b|<video\b|<picture\b|<iframe\b/);
  assert.match(responsivePhoto, /<picture>/);
  assert.match(responsivePhoto, /type="image\/avif"/);
  assert.match(responsivePhoto, /<img/);
  assert.match(responsivePhoto, /srcSet=\{srcSet\(name, "webp"\)\}/);
  assert.match(responsivePhoto, /portrait:\s*\{ width: 1200, height: 1600 \}/);
  assert.match(responsivePhoto, /"everyday-smile":\s*\{ width: 1200, height: 1500 \}/);
  assert.match(responsivePhoto, /width=\{dimensions\.width\}/);
  assert.match(responsivePhoto, /height=\{dimensions\.height\}/);
  assert.match(responsivePhoto, /loading=\{priority \? "eager" : "lazy"\}/);
  assert.match(responsivePhoto, /fetchPriority=\{priority \? "high" : "auto"\}/);
  assert.match(responsivePhoto, /decoding="async"/);
  assert.doesNotMatch(responsivePhoto, /\.jpe?g|100[123]|\b20\d{2}-\d{2}-\d{2}\b/i);
});

test("ships only the approved reduced metadata-free photo derivatives", async () => {
  const photoDirectory = path.join(projectRoot, "public", "media", "oliver");
  const files = (await readdir(photoDirectory)).sort();
  const expected = [];
  for (const name of ["everyday-smile", "family-care", "portrait"]) {
    for (const width of [480, 800, 1200]) {
      for (const extension of ["avif", "webp"]) expected.push(`${name}-${width}.${extension}`);
    }
  }
  assert.deepEqual(files, expected.sort());

  for (const file of files) {
    const bytes = await readFile(path.join(photoDirectory, file));
    assert.ok(bytes.length > 1_000 && bytes.length < 250_000, file);
    assert.equal(bytes.includes(Buffer.from("Exif")), false, file);
    assert.equal(bytes.includes(Buffer.from("1001")), false, file);
    assert.equal(bytes.includes(Buffer.from("1002")), false, file);
    assert.equal(bytes.includes(Buffer.from("1003")), false, file);
    assert.equal(bytes.includes(Buffer.from("GPS")), false, file);
  }
});

test("serves the approved responsive photo formats with correct MIME types", async () => {
  const server = await read("scripts/serve-pages.mjs");

  assert.match(server, /\["\.avif",\s*"image\/avif"\]/);
  assert.match(server, /\["\.jpg",\s*"image\/jpeg"\]/);
  assert.match(server, /\["\.webp",\s*"image\/webp"\]/);
});

test("implements immediate language routing and an accessible section-aware selector", async () => {
  const [rootRedirect, controls, copy, notFound] = await Promise.all([
    read("app/RootRedirect.tsx"),
    read("app/PortfolioControls.tsx"),
    read("app/portfolio-copy.ts"),
    read("app/global-not-found.tsx"),
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
  assert.match(css, /\.meadow-decor-rainbow\s*\{[\s\S]*?width:\s*clamp\(360px, 110vw, 430px\)/);
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
  assert.match(css, /\.footer-actions a[\s\S]*?min-width:\s*44px[\s\S]*?min-height:\s*44px/);
  assert.match(css, /aria-current="location"/);
  assert.match(css, /@media print/);
  assert.match(css, /@media print[\s\S]*?\.story-media-note\s*\{[\s\S]*?display:\s*none/);
  assert.match(css, /@media print[\s\S]*?\.preview-only\s*\{[\s\S]*?display:\s*none !important/);
  assert.doesNotMatch(css, /\.preview-note,\s*\.story-media-note\s*\{[\s\S]*?display:\s*none/);
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
  assert.match(portfolio, /id="privacy-title" tabIndex=\{-1\}/);
  assert.match(portfolio, /const focusSection = \(href: string\)/);
  assert.match(portfolio, /onClick=\{\(\) => focusSection\(item\.href\)\}/);
  assert.match(portfolio, /onClick=\{\(\) => focusSection\("#stories"\)\}/);
  assert.match(portfolio, /onClick=\{\(\) => focusSection\("#about"\)\}/);
  assert.match(portfolio, /onClick=\{\(\) => focusSection\("#privacy-notice"\)\}/);
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
  assert.match(css, /@media \(min-width: 30rem\)[\s\S]*?\.story-media-count-2[\s\S]*?repeat\(2/);
  assert.match(css, /\.button:active|\.primary-button:active/);
  assert.match(css, /@media \(hover: hover\)/);
  assert.match(media, /className="preview-media-kind" aria-hidden="true"/);
  assert.match(responsivePhoto, /const widths = \[480, 800, 1200\] as const/);
  assert.match(css, /\.portfolio-photo-frame\s*\{[\s\S]*?aspect-ratio:\s*4 \/ 5/);
  assert.match(css, /\.portfolio-photo-portrait \.portfolio-photo-frame\s*\{[\s\S]*?aspect-ratio:\s*3 \/ 4/);
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
