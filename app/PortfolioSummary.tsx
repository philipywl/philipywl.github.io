"use client";

import {
  HomeLink,
  LanguageSwitch,
  PrintButton,
  usePointerContextMenuDeterrent,
} from "./PortfolioControls";
import {
  localePaths,
  portfolioCopy,
  type PortfolioLocale,
} from "./portfolio-copy";

export default function PortfolioSummary({
  initialLocale,
  age,
}: {
  initialLocale: PortfolioLocale;
  age: string | null;
}) {
  const locale = initialLocale;
  const copy = portfolioCopy[locale];

  usePointerContextMenuDeterrent();

  return (
    <div className="site-shell summary-page" lang={copy.lang}>
      <a className="skip-link" href="#summary-content">{copy.skip}</a>

      <header className="site-header summary-header no-print">
        <div className="header-inner">
          <a
            className="wordmark"
            href={localePaths[locale].home}
            aria-label={copy.wordmarkLabel}
          >
            <span>Oliver</span> YEUNG
          </a>
          <div className="summary-header-actions">
            <LanguageSwitch
              locale={locale}
              scope="summary"
              label={copy.controls.languages}
              selectedLabel={copy.controls.selected}
            />
          </div>
        </div>
      </header>

      <main id="summary-content" className="summary-main">
        <article className="page-grid summary-card" aria-labelledby="summary-title">
          <div className="summary-mark" aria-hidden="true">
            <span className="summary-mark-o">O</span>
            <span className="summary-mark-leaf" />
          </div>

          <div className="summary-copy">
            <p className="eyebrow">{copy.summary.eyebrow}</p>
            <h1 id="summary-title">{copy.summary.title}</h1>
            <p className="identity-line">
              <span lang="en-HK">Oliver YEUNG</span>{" "}
              <span aria-hidden="true">·</span>{" "}
              <span lang="zh-Hant-HK">楊昊熹</span>
            </p>
            {age && (
              <p className="age-line">
                <span className="sr-only">{copy.hero.ageLabel}: </span>
                {age}
              </p>
            )}
            <p className="summary-intro">{copy.summary.intro}</p>

            <div
              className="summary-principles"
              aria-label={locale === "en" ? "Journal principles" : "成長記錄原則"}
            >
              {copy.principles.map((principle) => (
                <div key={principle.title}>
                  <h2>{principle.title}</h2>
                  <p>{principle.description}</p>
                </div>
              ))}
            </div>

            <p className="summary-updated">{copy.summary.updated}</p>

            <div className="button-row no-print">
              <HomeLink locale={locale} label={copy.controls.home} />
              <PrintButton
                label={copy.controls.print}
                accessibleLabel={copy.controls.printLabel}
                className="button primary-button"
              />
            </div>
          </div>
        </article>

        <section
          id="privacy-notice"
          className="privacy-section summary-privacy"
          aria-labelledby="summary-privacy-title"
        >
          <div className="page-grid privacy-inner">
            <div>
              <p className="eyebrow">{copy.privacy.eyebrow}</p>
              <h2 id="summary-privacy-title">{copy.privacy.title}</h2>
            </div>
            <p>{copy.privacy.body}</p>
          </div>
        </section>
      </main>

      <footer className="site-footer summary-footer">
        <div className="page-grid footer-grid">
          <div>
            <p className="footer-name">
              <span lang="en-HK">Oliver YEUNG</span>{" "}
              <span aria-hidden="true">·</span>{" "}
              <span lang="zh-Hant-HK">楊昊熹</span>
            </p>
            <p>{copy.footer.updated}</p>
          </div>
          <a className="no-print" href="#privacy-notice">{copy.privacy.link}</a>
        </div>
      </footer>
    </div>
  );
}
