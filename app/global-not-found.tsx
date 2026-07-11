import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found | Oliver YEUNG",
  description: "Choose the English or Traditional Chinese portfolio page.",
  robots: { index: false, follow: false, nocache: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en-HK">
      <body>
        <main className="route-redirect not-found-page">
          <div className="not-found-card">
            <p className="eyebrow">404</p>
            <h1>Page not found</h1>
            <p>找不到頁面</p>
            <p className="not-found-copy">
              Please choose a language to return to Oliver&apos;s portfolio.<br />
              請選擇語言返回昊熹的成長故事。
            </p>
            <nav className="button-row" aria-label="Portfolio languages｜作品集語言">
              <a className="button primary-button" href="/en/">English</a>
              <a className="button secondary-button" href="/zh-hant/">中文</a>
            </nav>
          </div>
        </main>
      </body>
    </html>
  );
}
