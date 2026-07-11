"use client";

import GreetingReveal from "./GreetingReveal";
import {
  LanguageSwitch,
  SummaryLink,
  usePointerContextMenuDeterrent,
} from "./PortfolioControls";
import {
  localePaths,
  portfolioCopy,
  type PortfolioLocale,
} from "./portfolio-copy";

export default function OliverPortfolio({
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
    <div id="top" className="site-shell" lang={copy.lang}>
      <a className="skip-link" href="#main-content">{copy.skip}</a>

      <header className="site-header no-print">
        <div className="header-inner">
          <a
            className="wordmark"
            href={localePaths[locale].home}
            aria-label={copy.wordmarkLabel}
          >
            <span>Oliver</span> YEUNG
          </a>

          <div className="header-actions">
            <LanguageSwitch
              locale={locale}
              scope="home"
              label={copy.controls.languages}
              selectedLabel={copy.controls.selected}
            />
            <SummaryLink
              locale={locale}
              label={copy.controls.summary}
              className="summary-link header-summary-link"
            />
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="page-grid hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{copy.hero.eyebrow}</p>
              <GreetingReveal
                locale={locale}
                id="hero-title"
                greeting={copy.hero.greeting}
                lead={copy.hero.greetingLead}
                rest={copy.hero.greetingRest}
              />
              <p className="identity-line">
                <span lang="en-HK">Oliver YEUNG</span>{" "}
                <span aria-hidden="true">·</span>{" "}
                <span lang="zh-Hant-HK">楊昊熹</span>
              </p>
              <p className="hero-intro">{copy.hero.intro}</p>
              {age && (
                <p className="age-line">
                  <span className="sr-only">{copy.hero.ageLabel}: </span>
                  {age}
                </p>
              )}
              <div className="button-row no-print">
                <SummaryLink
                  locale={locale}
                  label={copy.controls.summary}
                  className="button secondary-button summary-hero-link"
                />
              </div>
            </div>

            <div className="hero-visual hero-journal-visual" aria-hidden="true">
              <div className="hero-journal-mark">
                <span className="hero-journal-o">O</span>
                <span className="hero-seed" />
                <span className="hero-leaf" />
              </div>
              <span className="hero-path" />
            </div>
          </div>
        </section>

        <section
          className="journal-principles section-pad"
          aria-label={locale === "en" ? "About this learning journal" : "關於這份成長記錄"}
        >
          <div className="page-grid principles-grid">
            {copy.principles.map((principle, index) => (
              <article className="principle-card" key={principle.title}>
                <span className="principle-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{principle.title}</h2>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="privacy-notice"
          className="privacy-section"
          aria-labelledby="privacy-title"
        >
          <div className="page-grid privacy-inner">
            <div>
              <p className="eyebrow">{copy.privacy.eyebrow}</p>
              <h2 id="privacy-title">{copy.privacy.title}</h2>
            </div>
            <p>{copy.privacy.body}</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-grid footer-grid">
          <div>
            <p className="footer-name">
              <span lang="en-HK">Oliver YEUNG</span>{" "}
              <span aria-hidden="true">·</span>{" "}
              <span lang="zh-Hant-HK">楊昊熹</span>
            </p>
            <p>{copy.footer.updated}</p>
          </div>
          <nav
            className="footer-actions no-print"
            aria-label={locale === "en" ? "Footer navigation" : "頁尾導覽"}
          >
            <a href="#privacy-notice">{copy.privacy.link}</a>
            <a href="#top">{copy.footer.top}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
