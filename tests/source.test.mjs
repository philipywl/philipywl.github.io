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
  const [viteConfig, gitignore, workflow, packageJsonSource] = await Promise.all([
    read("vite.config.ts"),
    read(".gitignore"),
    read(".github/workflows/pages.yml"),
    read("package.json"),
  ]);
  const packageJson = JSON.parse(packageJsonSource);

  assert.doesNotMatch(
    viteConfig,
    /\bfrom\s+["']\.\/\.openai\/hosting\.json["']/,
  );
  assert.doesNotMatch(
    viteConfig,
    /\bimport\s*\(\s*["']\.\/\.openai\/hosting\.json["']/,
  );
  assert.match(
    viteConfig,
    /type\s+LocalHostingConfig\s*=\s*\{[\s\S]*?\bd1\?:\s*string\s*\|\s*null;[\s\S]*?\br2\?:\s*string\s*\|\s*null;/,
  );
  assert.match(viteConfig, /from\s+["']node:fs["']/);
  assert.match(viteConfig, /readFileSync\(hostingConfigPath,\s*["']utf8["']\)/);
  assert.match(viteConfig, /JSON\.parse\(source\)\s+as\s+LocalHostingConfig/);
  assert.match(viteConfig, /code\s*===\s*["']ENOENT["'][\s\S]*?return\s+\{\};/);
  assert.match(viteConfig, /throw\s+error;/);
  assert.match(viteConfig, /d1_databases:\s*d1\s*\?/);
  assert.match(viteConfig, /r2_buckets:\s*r2\s*\?/);

  assert.equal(packageJson.scripts["build:pages"], "next build --webpack");
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

test("configures an official Next.js root static export", async () => {
  const config = await read("next.config.ts");

  assert.match(config, /output:\s*["']export["']/);
  assert.match(config, /trailingSlash:\s*true/);
  assert.match(config, /images:\s*\{[\s\S]*?unoptimized:\s*true/);
  assert.match(config, /globalNotFound:\s*true/);
  assert.doesNotMatch(config, /\bbasePath\s*:/);
  assert.doesNotMatch(config, /\bassetPrefix\s*:/);
});

test("prepares a pull-request-safe GitHub Pages workflow", async () => {
  const workflow = await read(".github/workflows/pages.yml");
  const productionCondition = "if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'";

  assert.match(workflow, /pull_request:[\s\S]*?branches:[\s\S]*?- main/);
  assert.match(workflow, /uses: actions\/checkout@v7/);
  assert.match(workflow, /uses: actions\/setup-node@v6/);
  assert.match(workflow, /node-version: "24"/);
  assert.match(workflow, /run: npm ci/);
  assert.match(workflow, /run: npm run test --if-present/);
  assert.match(workflow, /run: npm run build:pages/);
  assert.match(workflow, /run: npm run verify:pages/);
  assert.match(workflow, /uses: actions\/configure-pages@v6/);
  assert.match(workflow, /uses: actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path: \.\/out/);
  assert.equal(workflow.split(productionCondition).length - 1, 3);
  assert.match(workflow, /deploy:[\s\S]*?if: github\.ref == 'refs\/heads\/main'/);
  assert.match(workflow, /uses: actions\/deploy-pages@v5/);
  assert.doesNotMatch(workflow, /\bCNAME\b|basePath|assetPrefix/);
});

test("documents the public hosting and media policy", async () => {
  const [readme, verifier] = await Promise.all([
    read("README.md"),
    read("scripts/verify-pages.mjs"),
  ]);

  assert.match(readme, /Oliver Yeung's bilingual English and Traditional Chinese portfolio website/);
  assert.match(readme, /Production hosting: GitHub Pages/);
  assert.match(readme, /Local ChatGPT Sites\/Vinext preview: `npm run dev`/);
  assert.match(readme, /GitHub Pages static build: `npm run build:pages`/);
  assert.match(readme, /Static output directory: `out\/`/);
  assert.match(readme, /Videos must remain externally hosted on YouTube/);
  assert.match(readme, /Never commit private information/);
  assert.match(verifier, /"\.mp4"/);
  assert.match(verifier, /"\.mov"/);
});

test("keeps private files and local video out of the public Git working set", () => {
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
    assert.equal(forbiddenPaths.some((prefix) => file === prefix.slice(0, -1) || file.startsWith(prefix)), false, file);
    assert.equal(forbiddenNames.has(path.posix.basename(file)), false, file);
    assert.doesNotMatch(file, forbiddenExtensions);
    assert.doesNotMatch(file, /(?:^|\/)\.env(?:\.|$)/i);
  }
});

test("uses trailing-slash locale paths and a client-only root handoff", async () => {
  const [rootRedirect, portfolio, notFound] = await Promise.all([
    read("app/RootRedirect.tsx"),
    read("app/OliverPortfolio.tsx"),
    read("app/global-not-found.tsx"),
  ]);

  assert.match(rootRedirect, /window\.location\.replace\(destination\)/);
  assert.match(rootRedirect, /<noscript>/);
  assert.match(rootRedirect, /href="\/en\/"/);
  assert.match(rootRedirect, /href="\/zh-hant\/"/);
  assert.doesNotMatch(rootRedirect, /from\s+["']next\/(?:navigation|server)["']/);
  assert.match(portfolio, /nextLocale === "zh" \? "\/zh-hant\/" : "\/en\/"/);
  assert.match(notFound, /Page not found/);
  assert.match(notFound, /找不到頁面/);
  assert.match(notFound, /href="\/en\/"/);
  assert.match(notFound, /href="\/zh-hant\/"/);
});

test("keeps private birth-date data out of tracked application source", async () => {
  await assert.rejects(access(path.join(projectRoot, "app", "age.mjs")), { code: "ENOENT" });

  const sourceFiles = await collectSourceFiles("app");
  const source = (await Promise.all(sourceFiles.map(read))).join("\n");
  const fullCalendarDatePatterns = [
    /\b(?:19|20)\d{2}[-/.]\d{1,2}[-/.]\d{1,2}\b/,
    /\b\d{1,2}[-/.]\d{1,2}[-/.](?:19|20)\d{2}\b/,
    /(?:19|20)\d{2}年\d{1,2}月\d{1,2}日/,
    /\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:19|20)\d{2}\b/i,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(?:19|20)\d{2}\b/i,
  ];

  assert.doesNotMatch(source, /\b(?:BIRTH_(?:YEAR|MONTH|DAY)|birthDate|dateOfBirth)\b/i);
  for (const pattern of fullCalendarDatePatterns) assert.doesNotMatch(source, pattern);
  assert.match(source, /studentLabel:\s*"Student"/);
  assert.match(source, /studentLabel:\s*"學生"/);
  assert.doesNotMatch(source, /formatRoundedAge|getRoundedAgeMonths/);
});

test("keeps the portfolio static-host and media-placeholder safe", async () => {
  const [portfolio, css] = await Promise.all([
    read("app/OliverPortfolio.tsx"),
    read("app/globals.css"),
  ]);

  assert.doesNotMatch(portfolio, /from\s+["']next\/(?:headers|navigation|image)["']/);
  assert.doesNotMatch(portfolio, /\bautoPlay\b|\bloop\b/);
  assert.match(portfolio, /controlsList="nodownload"/);
  assert.match(portfolio, /preload="none"/);
  assert.match(portfolio, /addEventListener\("contextmenu", blockPointerContextMenu, true\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
