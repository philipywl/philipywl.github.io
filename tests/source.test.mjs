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
  assert.match(metadata, /gathered by Oliver's parents/);
  assert.match(metadata, /由爸爸媽媽整理的一個個日常片段/);
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

test("uses warm factual placeholders without summary, admissions, or institutional copy", async () => {
  const appFiles = (await collectSourceFiles("app")).filter((file) => /\.[jt]sx?$/.test(file));
  const appSource = (await Promise.all(appFiles.map(read))).join("\n");
  const [portfolio, controls, copy, media] = await Promise.all([
    read("app/OliverPortfolio.tsx"),
    read("app/PortfolioControls.tsx"),
    read("app/portfolio-copy.ts"),
    read("app/PreviewMedia.tsx"),
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
  assert.match(copy, /Small steps in everyday life/);
  assert.match(copy, /日常裏的一小步/);
  assert.match(copy, /Growing together at home/);
  assert.match(copy, /在家中一起成長/);
  assert.match(copy, /Content preview/);
  assert.match(copy, /內容預覽/);
  assert.equal((copy.match(/Story title to be added \d{2}/g) ?? []).length, 5);
  assert.equal((copy.match(/故事標題稍後加入 \d{2}/g) ?? []).length, 5);
  assert.doesNotMatch(copy, /"\[[^"]+\]"/);

  for (const id of ["top", "about", "stories", "growth", "family", "privacy-notice"]) {
    assert.match(portfolio, new RegExp(`id=["']${id}["']`));
  }
  assert.match(portfolio, /copy\.stories\.items\.map/);
  assert.match(portfolio, /copy\.growth\.timelineItems\.map/);
  assert.match(portfolio, /copy\.family\.vignettes\.map/);
  assert.match(portfolio, /IntersectionObserver/);
  assert.match(portfolio, /aria-current=\{activeHref === item\.href \? "location"/);
  assert.doesNotMatch(portfolio, /SummaryLink|copy\.videos|journal-principles|usePointerContextMenuDeterrent/);
  assert.doesNotMatch(controls, /SummaryLink|SummaryIcon|HomeLink|HomeIcon|contextmenu/);
  assert.doesNotMatch(media, /preview-play/);
  assert.doesNotMatch(portfolio, /<img\b|<video\b|<picture\b|<iframe\b/);
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
  assert.match(controls, /onKeyDown=[\s\S]*?event\.key !== "Escape"[\s\S]*?closeMenu\(\)/);
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
  assert.doesNotMatch(greeting, /setInterval|autoPlay|\bloop\b/);
  assert.match(css, /greeting-cursor-rest[\s\S]*?animation:\s*greeting-cursor-last[^;]*forwards/);
  assert.doesNotMatch(css, /greeting-cursor-rest[\s\S]*?animation:\s*greeting-cursor-last[^;]*both/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.greeting-heading \.greeting-cursor[\s\S]*?display:\s*none !important/);
});

test("uses the Sunlit Meadow palette, one typography system, and accessible controls", async () => {
  const css = await read("app/globals.css");

  assert.match(css, /--font-sans:\s*"Noto Sans TC",\s*"PingFang TC",\s*"Microsoft JhengHei",\s*system-ui/);
  assert.doesNotMatch(css, /Noto Serif|Georgia|--serif|@font-face|@import\s+url/i);
  assert.doesNotMatch(css, /font-weight:\s*(?:[789]00|bold|bolder)\b/i);
  assert.match(css, /--focus-ring:\s*3px solid/);
  assert.match(css, /:focus-visible[\s\S]*?outline:\s*var\(--focus-ring\)/);
  assert.match(css, /\.footer-actions a[\s\S]*?min-width:\s*44px[\s\S]*?min-height:\s*44px/);
  assert.match(css, /aria-current="location"/);
  assert.match(css, /@media print/);
  for (const token of ["#FFF9E6", "#29404A", "#C4DDEA", "#5C8B7F", "#3F6D65", "#E0AD3F", "#EEA283"]) {
    assert.match(css, new RegExp(token));
  }
  assert.doesNotMatch(css, /summary-(?:card|main|link|hero|footer)|video-preview-grid|preview-play/);
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
  assert.match(verifier, /Vinext image endpoint/);
  assert.match(verifier, /openaiusercontent/);
  assert.match(verifier, /(?:Student|學生)/);
  assert.match(verifier, /one-page summary|一頁摘要/i);
  assert.doesNotMatch(verifier, /OLIVER_BIRTH_DATE:\s*\d/);
});
