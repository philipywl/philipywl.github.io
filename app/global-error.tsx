"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en-HK">
      <body>
        <main className="route-redirect not-found-page">
          <div className="not-found-card">
            <span className="route-seed-mark" aria-hidden="true" />
            <p className="eyebrow">Oliver YEUNG</p>
            <h1>This page needs a moment</h1>
            <p lang="zh-Hant-HK">頁面暫時未能顯示。</p>
            <p className="not-found-copy">
              Please try again, or choose a language to return to Oliver&apos;s learning journey.<br />
              <span lang="zh-Hant-HK">請再試一次，或選擇語言返回昊熹的成長旅程。</span>
            </p>
            <div className="button-row">
              <button className="button primary-button" type="button" onClick={reset}>
                Try again&nbsp;/&nbsp;<span lang="zh-Hant-HK">再試一次</span>
              </button>
              <nav className="language-switch" aria-label="中文 | English">
                <a className="language-option" href="/zh-hant/" lang="zh-Hant-HK">
                  中文
                </a>
                <span className="language-divider" aria-hidden="true">|</span>
                <a className="language-option" href="/en/">
                  English
                </a>
              </nav>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
