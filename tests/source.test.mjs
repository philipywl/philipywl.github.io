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
    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(relativePath));
    } else if (/\.(?:[cm]?[jt]sx?|mjs|css)$/i.test(entry.name)) {
      files.push(relativePath);
    }
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
  assert.doesNotMatch(viteConfig, /\bimport\s*\(\s*["']\.\/\.openai\/hosting\.json["']/);
  assert.match(
    viteConfig,
    /type\s+LocalHostingConfig\s*=\s*\{[\s\S]*?\bd1\?:\s*string\s*\|\s*null;[\s\S]*?\br2\?:\s*string\s*\|\s*null;/,
  );
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
  assert.doesNotThrow(() => {
    execFileSync(
      "git",
      ["check-ignore", "--quiet", "--no-index", "--", ".openai/hosting.json"],
      { cwd: projectRoot, stdio: "ignore" },
    );
  });
});

test("configures a root static export with real locale and summary routes", async () => {
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
    "app/(english)/en/summary/page.tsx",
    "app/(chinese)/zh-hant/summary/page.tsx",
    "app/global-not-found.tsx",
    "app/global-error.tsx",
  ]) {
    await assert.doesNotReject(access(path.join(projectRoot, routeFile)));
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
  assert.match(workflow, /run: npm run build:pages/);
  assert.match(workflow, /run: npm run verify:pages/);
  assert.match(workflow, /OLIVER_BIRTH_DATE:[^\n]*secrets\.OLIVER_BIRTH_DATE/);
  assert.match(workflow, /REQUIRE_OLIVER_AGE:/);
  assert.doesNotMatch(workflow, /OLIVER_BIRTH_DATE:\s*\d/);
  assert.match(workflow, /uses: actions\/configure-pages@v6/);
  assert.match(workflow, /uses: actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path: \.\/out/);
  assert.equal(workflow.split(productionCondition).length - 1, 3);
  assert.match(workflow, /uses: actions\/deploy-pages@v5/);
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
  const forbiddenNames = new Set([
    "cname",
    "oliver-portfolio-review-notes.md",
    "oliver_yeung_portfolio_content_template_bilingual.docx",
  ]);
  const forbiddenExtensions = /\.(?:3gp|7z|arw|avi|cr2|dng|docx|gz|heic|heif|m4v|mkv|mov|mp4|mpeg|mpg|nef|ogv|pdf|raw|tar|tif|tiff|webm|wmv|zip)$/i;

  for (const file of publicFiles) {
    assert.equal(
      forbiddenPaths.some((prefix) => file === prefix.slice(0, -1) || file.startsWith(prefix)),
      false,
      file,
    );
    assert.equal(forbiddenNames.has(path.posix.basename(file)), false, file);
    assert.doesNotMatch(file, forbiddenExtensions);
    assert.doesNotMatch(file, /(?:^|\/)\.env(?:\.|$)/i);
  }
});

test("keeps the private date server-only and sends only formatted age to pages", async () => {
  const [serverAge, ageCore, englishPage, chinesePage, englishSummary, chineseSummary] = await Promise.all([
    read("lib/current-age.server.ts"),
    read("lib/age.mjs"),
    read("app/(english)/en/page.tsx"),
    read("app/(chinese)/zh-hant/page.tsx"),
    read("app/(english)/en/summary/page.tsx"),
    read("app/(chinese)/zh-hant/summary/page.tsx"),
  ]);

  assert.match(serverAge, /import\s+["']server-only["']/);
  assert.match(serverAge, /process\.env\.OLIVER_BIRTH_DATE/);
  assert.match(serverAge, /getCurrentPortfolioAge/);
  assert.match(ageCore, /HONG_KONG_TIME_ZONE\s*=\s*["']Asia\/Hong_Kong["']/);
  assert.match(ageCore, /timeZone:\s*HONG_KONG_TIME_ZONE/);
  assert.doesNotMatch(serverAge, /NEXT_PUBLIC_/);

  for (const page of [englishPage, chinesePage, englishSummary, chineseSummary]) {
    assert.match(page, /getCurrentPortfolioAge\(\)/);
    assert.doesNotMatch(page, /process\.env|OLIVER_BIRTH_DATE|NEXT_PUBLIC_/);
  }
  assert.match(englishPage, /age=\{age\?\.english \?\? null\}/);
  assert.match(chinesePage, /age=\{age\?\.chinese \?\? null\}/);
  assert.match(englishSummary, /age=\{age\?\.english \?\? null\}/);
  assert.match(chineseSummary, /age=\{age\?\.chinese \?\? null\}/);

  const sourceFiles = [
    ...await collectSourceFiles("app"),
    ...await collectSourceFiles("lib"),
  ];
  const source = (await Promise.all(sourceFiles.map(read))).join("\n");
  assert.doesNotMatch(source, /\b\d{4}-\d{2}-\d{2}\b/);

  const privateBirthDate = process.env.OLIVER_BIRTH_DATE?.trim();
  if (privateBirthDate) {
    assert.equal(source.includes(privateBirthDate), false, "private birth date leaked into source");
  }
});

test("defines public metadata, review robots, alternates, and icons centrally", async () => {
  const [metadata, rootLayout, englishLayout, chineseLayout, englishPage, chinesePage] = await Promise.all([
    read("app/site-metadata.ts"),
    read("app/(root)/layout.tsx"),
    read("app/(english)/layout.tsx"),
    read("app/(chinese)/layout.tsx"),
    read("app/(english)/en/page.tsx"),
    read("app/(chinese)/zh-hant/page.tsx"),
  ]);

  assert.match(metadata, /Oliver Yeung \| A Little Learning Journey/);
  assert.match(metadata, /昊熹｜小小成長旅程/);
  assert.match(metadata, /A warm collection of everyday moments showing how Oliver explores, connects and grows at his own pace\./);
  assert.match(metadata, /透過一個個日常片段，記下昊熹如何探索、與人互動，並按自己的步伐成長。/);
  for (const directive of ["index: false", "follow: false", "noarchive: true", "nosnippet: true", "noimageindex: true"]) {
    assert.match(metadata, new RegExp(directive.replace(" ", "\\s*")));
  }
  assert.match(metadata, /favicon\.svg/);
  assert.match(metadata, /favicon-16x16\.png/);
  assert.match(metadata, /favicon-32x32\.png/);
  assert.match(metadata, /apple-touch-icon\.png/);
  assert.match(metadata, /"en-HK"/);
  assert.match(metadata, /"zh-Hant-HK"/);
  assert.match(metadata, /"x-default"/);

  assert.match(rootLayout, /<html lang="en-HK">/);
  assert.match(englishLayout, /<html lang="en-HK">/);
  assert.match(chineseLayout, /<html lang="zh-Hant-HK">/);
  assert.doesNotMatch(englishPage, /A little learner|private bilingual/i);
  assert.doesNotMatch(chinesePage, /私人雙語|昊熹的成長故事/);
});

test("contains only approved public copy and conditionally omits unsupported content", async () => {
  const appFiles = (await collectSourceFiles("app")).filter((file) => /\.[jt]sx?$/.test(file));
  const appSource = (await Promise.all(appFiles.map(read))).join("\n");
  const portfolio = await read("app/OliverPortfolio.tsx");
  const summary = await read("app/PortfolioSummary.tsx");
  const copy = await read("app/portfolio-copy.ts");

  const prohibited = [
    /\bK\s*1\b/i,
    /\b(?:application|applicant|admissions?)\b/i,
    /kindergarten/i,
    /(?:入學|申請|招生|學生|繁體中文)/u,
    /(?:Content needed|Photo needed|Parent-provided|Placeholder|Alternative text will be added)/i,
    /(?:待補|待加入|預留|爸爸媽媽提供|未發佈|審閱版本)/u,
    /(?:private portfolio|private review|unpublished review)/i,
  ];
  for (const pattern of prohibited) assert.doesNotMatch(appSource, pattern);

  assert.match(copy, /Oliver's little learning journey/);
  assert.match(copy, /Hello, I'm Oliver\./);
  assert.match(copy, /昊熹的小小成長旅程/);
  assert.match(copy, /你好，我是昊熹。/);
  assert.match(copy, /This portfolio is shared by Oliver's parents\. Please do not copy, download or redistribute its photographs or videos\./);
  assert.match(copy, /本作品集由昊熹的爸爸媽媽整理。請勿複製、下載或轉載網站內的相片及影片。/);
  assert.match(portfolio, /age &&/);
  assert.match(summary, /age &&/);
  assert.doesNotMatch(portfolio, /PhotoPlaceholder|StoryCard|<img\b|<video\b|<picture\b/);
  assert.doesNotMatch(summary, /<img\b|<video\b|<picture\b/);
});

test("implements immediate language routing and an accessible route-aware selector", async () => {
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
  assert.match(rootRedirect, /href="\/zh-hant\/"/);
  assert.match(rootRedirect, /href="\/en\/"/);

  assert.match(copy, /en:\s*\{ home: "\/en\/", summary: "\/en\/summary\/" \}/);
  assert.match(copy, /zh:\s*\{ home: "\/zh-hant\/", summary: "\/zh-hant\/summary\/" \}/);
  assert.match(controls, />\s*中文\s*/);
  assert.match(controls, /language-divider[^>]*[\s\S]*?\|/);
  assert.match(controls, />\s*English\s*/);
  assert.match(controls, /aria-current=\{locale === "zh" \? "page"/);
  assert.match(controls, /aria-current=\{locale === "en" \? "page"/);
  assert.match(controls, /window\.location\.hash/);
  assert.match(controls, /dialog\.showModal\(\)/);
  assert.match(controls, /onCancel=/);
  assert.match(controls, /document\.body\.style\.overflow = "hidden"/);
  assert.match(controls, /triggerRef\.current\?\.focus\(\)/);

  assert.match(notFound, /aria-label="中文 \| English"/);
  assert.match(notFound, /href="\/en\/"/);
  assert.match(notFound, /href="\/zh-hant\/"/);
});

test("keeps the greeting accessible, one-time, motion-safe, and layout-stable", async () => {
  const [greeting, portfolio, css] = await Promise.all([
    read("app/GreetingReveal.tsx"),
    read("app/OliverPortfolio.tsx"),
    read("app/globals.css"),
  ]);

  assert.match(greeting, /<span className="sr-only">\{greeting\}<\/span>/);
  assert.match(greeting, /greeting-visual" aria-hidden="true"/);
  assert.match(greeting, /greeting-reserve/);
  assert.match(greeting, /sessionStorage\.getItem\(key\)/);
  assert.match(greeting, /sessionStorage\.setItem\(key, "seen"\)/);
  assert.match(greeting, /oliver-greeting-\$\{locale\}-v1/);
  assert.match(greeting, /prefers-reduced-motion: reduce/);
  assert.match(greeting, /suppressHydrationWarning/);
  assert.doesNotMatch(greeting, /setInterval|autoPlay|\bloop\b/);
  assert.match(portfolio, /<GreetingReveal/);

  assert.match(css, /\.greeting-reserve/);
  assert.match(css, /\.greeting-visual[\s\S]*?position:\s*absolute/);
  assert.match(css, /data-greeting-state="en-play"/);
  assert.match(css, /data-greeting-state="zh-play"/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.greeting-heading \.greeting-segment[\s\S]*?animation:\s*none !important[\s\S]*?clip-path:\s*none !important/);
  assert.match(css, /\.greeting-heading \.greeting-cursor[\s\S]*?display:\s*none !important/);
});

test("uses one sans-serif typography system with keyboard, touch, and print safeguards", async () => {
  const css = await read("app/globals.css");

  assert.match(
    css,
    /--font-sans:\s*"Noto Sans TC",\s*"PingFang TC",\s*"Microsoft JhengHei",\s*system-ui,\s*-apple-system,\s*"Segoe UI",\s*sans-serif;/,
  );
  assert.doesNotMatch(css, /Noto Serif|Georgia|--serif|@font-face|@import\s+url/i);
  assert.doesNotMatch(css, /(?<!sans-)\bserif\b/i);
  assert.doesNotMatch(css, /font-weight:\s*(?:[789]00|bold|bolder)\b/i);
  assert.match(css, /--focus-ring:\s*3px solid/);
  assert.match(css, /:focus-visible[\s\S]*?outline:\s*var\(--focus-ring\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /width:\s*min\(calc\(100% - 40px\),\s*var\(--page-width\)\)/);
  assert.match(css, /@media print/);
  assert.doesNotMatch(css, /photo-placeholder|placeholder-line|story-card|video-placeholder/);
});

test("keeps the Pages verifier aligned with summaries, private-input scanning, and public-copy rules", async () => {
  const verifier = await read("scripts/verify-pages.mjs");

  assert.match(verifier, /en\/summary\/index\.html/);
  assert.match(verifier, /zh-hant\/summary\/index\.html/);
  assert.match(verifier, /process\.env\.OLIVER_BIRTH_DATE/);
  assert.match(verifier, /noindex/);
  assert.match(verifier, /noarchive/);
  assert.match(verifier, /nosnippet/);
  assert.match(verifier, /noimageindex/);
  assert.match(verifier, /favicon\.svg/);
  assert.match(verifier, /Vinext image endpoint/);
  assert.match(verifier, /openaiusercontent/);
  assert.match(verifier, /(?:Student|學生)/);
  assert.doesNotMatch(verifier, /OLIVER_BIRTH_DATE:\s*\d/);
});
