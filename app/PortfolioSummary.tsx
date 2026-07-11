"use client";

import PreviewMedia from "./PreviewMedia";
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
          <PreviewMedia
            label={copy.preview.portrait}
            detail={copy.preview.portraitDetail}
            ratio="portrait"
            tone="sky"
            className="summary-preview-portrait"
          />

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
            <p className="summary-preview-note">
              <span className="preview-badge">{copy.preview.badge}</span>
              {copy.preview.note}
            </p>

            <section className="summary-section" aria-labelledby="summary-observations-title">
              <h2 id="summary-observations-title">{copy.summary.observationsTitle}</h2>
              <div className="summary-observation-grid">
                {copy.summary.observations.map((observation, index) => (
                  <article key={observation.title}>
                    <span className="field-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{observation.title}</h3>
                    <p>{observation.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="summary-bottom-grid">
              <section className="summary-section" aria-labelledby="summary-stories-title">
                <h2 id="summary-stories-title">{copy.summary.storiesTitle}</h2>
                <ol className="summary-story-list">
                  {copy.summary.storyHighlights.map((story) => (
                    <li key={story}>{story}</li>
                  ))}
                </ol>
              </section>

              <section className="summary-section summary-family" aria-labelledby="summary-family-title">
                <h2 id="summary-family-title">{copy.summary.familyTitle}</h2>
                <p>{copy.summary.familyBody}</p>
              </section>
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
