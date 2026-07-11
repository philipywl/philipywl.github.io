import type { Metadata } from "next";
import "./globals.css";
import { localeAlternates, sharedMetadata } from "./site-metadata";

export const metadata: Metadata = {
  ...sharedMetadata,
  title: "Page not found | Oliver Yeung",
  description: "Choose 中文 or English to return to Oliver's learning journey.",
  alternates: {
    canonical: "/404.html",
    languages: localeAlternates("/en/", "/zh-hant/"),
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-HK">
      <body>
        <main className="route-redirect not-found-page">
          <div className="not-found-card">
            <p className="eyebrow">404</p>
            <h1>Page not found</h1>
            <p lang="zh-Hant-HK">找不到頁面</p>
            <p className="not-found-copy">
              Please choose a language to return home.<br />
              <span lang="zh-Hant-HK">請選擇語言，返回首頁。</span>
            </p>
            <nav className="button-row" aria-label="中文 | English">
              <a className="button primary-button" href="/zh-hant/" lang="zh-Hant-HK">
                中文
              </a>
              <a className="button secondary-button" href="/en/">
                English
              </a>
            </nav>
          </div>
        </main>
      </body>
    </html>
  );
}
