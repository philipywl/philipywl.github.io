"use client";

import GreetingReveal from "./GreetingReveal";
import PreviewMedia from "./PreviewMedia";
import {
  LanguageSwitch,
  MobileMenu,
  PrintButton,
  SummaryLink,
  usePointerContextMenuDeterrent,
} from "./PortfolioControls";
import {
  localePaths,
  portfolioCopy,
  type PortfolioLocale,
} from "./portfolio-copy";

const mediaTones = ["sky", "honey", "peach", "teal"] as const;

export default function OliverPortfolio({
  initialLocale,
  age,
}: {
  initialLocale: PortfolioLocale;
  age: string | null;
}) {
  const locale = initialLocale;
  const copy = portfolioCopy[locale];
  const navigationItems = [
    { href: "#top", label: copy.nav.home },
    { href: "#stories", label: copy.nav.stories },
    { href: "#growth", label: copy.nav.growth },
    { href: "#family", label: copy.nav.family },
  ];

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

          <nav
            className="desktop-nav"
            aria-label={locale === "en" ? "Main navigation" : "主要導覽"}
          >
            {navigationItems.map((item) => (
              <a href={item.href} key={item.href}>{item.label}</a>
            ))}
          </nav>

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
            <MobileMenu
              locale={locale}
              items={navigationItems}
              menuLabel={copy.controls.menu}
              closeLabel={copy.controls.closeMenu}
              summaryLabel={copy.controls.summary}
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
                <a className="button primary-button" href="#stories">
                  {copy.hero.storiesAction}
                </a>
                <SummaryLink
                  locale={locale}
                  label={copy.controls.summary}
                  className="button secondary-button summary-hero-link"
                />
              </div>
            </div>

            <PreviewMedia
              label={copy.preview.portrait}
              detail={copy.preview.portraitDetail}
              ratio="portrait"
              tone="sky"
              className="hero-preview-media"
            />
          </div>
        </section>

        <section id="about" className="about-section section-pad" aria-labelledby="about-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.about.eyebrow}</p>
              <h2 id="about-title">{copy.about.title}</h2>
              <p>{copy.about.intro}</p>
            </div>
            <aside className="preview-note" aria-label={copy.preview.badge}>
              <span className="preview-badge">{copy.preview.badge}</span>
              <p>{copy.preview.note}</p>
            </aside>
          </div>

          <div className="page-grid about-grid">
            <PreviewMedia
              label={copy.preview.photo}
              detail={copy.preview.portraitDetail}
              ratio="portrait"
              tone="honey"
              className="about-preview-media"
            />
            <div className="about-fields">
              {copy.about.fields.map((field, index) => (
                <article className="about-field" key={field.title}>
                  <span className="field-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{field.title}</h3>
                  <p>{field.body}</p>
                </article>
              ))}
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

        <section id="stories" className="stories-section section-pad" aria-labelledby="stories-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.stories.eyebrow}</p>
              <h2 id="stories-title">{copy.stories.title}</h2>
              <p>{copy.stories.intro}</p>
            </div>
            <span className="section-count" aria-hidden="true">04</span>
          </div>

          <div className="page-grid stories-grid">
            {copy.stories.items.map((story, storyIndex) => (
              <article
                className={`story-card ${storyIndex === 0 ? "story-card-featured" : ""}`.trim()}
                key={story.title}
              >
                <div className={`story-media-grid story-media-count-${story.media.length}`}>
                  {story.media.map((media, mediaIndex) => (
                    <PreviewMedia
                      key={`${story.title}-${media.label}`}
                      label={media.label}
                      detail={media.detail}
                      kind={media.kind}
                      ratio={media.ratio}
                      tone={mediaTones[(storyIndex + mediaIndex) % mediaTones.length]}
                      playLabel={copy.preview.playLabel}
                    />
                  ))}
                </div>

                <div className="story-content">
                  <header className="story-header">
                    <div>
                      <span className="preview-badge">{copy.preview.badge}</span>
                      <h3>{story.title}</h3>
                    </div>
                    <p className="story-age">{story.age}</p>
                  </header>

                  <div className="story-observation">
                    <p className="story-label">{copy.stories.whatHappened}</p>
                    <p>{story.observation}</p>
                  </div>

                  <div className="story-detail-grid">
                    <div>
                      <p className="story-label">{copy.stories.noticed}</p>
                      <p>{story.noticed}</p>
                    </div>
                    <div>
                      <p className="story-label">{copy.stories.support}</p>
                      <p>{story.support}</p>
                    </div>
                  </div>

                  <blockquote className="parent-reflection">
                    <span>{copy.stories.reflection}</span>
                    <p>{story.reflection}</p>
                  </blockquote>

                  <div className="learning-clues" aria-label={copy.stories.learningClues}>
                    <span className="story-label">{copy.stories.learningClues}</span>
                    {story.tags.map((tag, tagIndex) => (
                      <span className="learning-tag" key={`${story.title}-${tagIndex}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="videos-section section-pad" aria-labelledby="videos-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.videos.eyebrow}</p>
              <h2 id="videos-title">{copy.videos.title}</h2>
              <p>{copy.videos.intro}</p>
            </div>
          </div>

          <div className="page-grid video-preview-grid">
            {copy.videos.items.map((video, index) => (
              <article className="video-preview-card" key={video.title}>
                <PreviewMedia
                  label={`${copy.preview.video} · ${String(index + 1).padStart(2, "0")}`}
                  detail={video.detail}
                  kind="video"
                  ratio={video.ratio}
                  tone={mediaTones[(index + 1) % mediaTones.length]}
                  playLabel={copy.preview.playLabel}
                />
                <h3>{video.title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="growth" className="growth-section section-pad" aria-labelledby="growth-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.growth.eyebrow}</p>
              <h2 id="growth-title">{copy.growth.title}</h2>
              <p>{copy.growth.intro}</p>
            </div>
          </div>

          <div className="page-grid growth-layout">
            <section className="everyday-panel" aria-labelledby="everyday-title">
              <h3 id="everyday-title">{copy.growth.everydayTitle}</h3>
              <div className="everyday-grid">
                {copy.growth.everydayItems.map((item, index) => (
                  <article className="everyday-card" key={item.title}>
                    <span className="field-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="timeline-panel" aria-labelledby="timeline-title">
              <h3 id="timeline-title">{copy.growth.timelineTitle}</h3>
              <ol className="timeline-list">
                {copy.growth.timelineItems.map((item, index) => (
                  <li key={`${item.time}-${index}`}>
                    <span className="timeline-dot" aria-hidden="true" />
                    <p className="timeline-time">{item.time}</p>
                    <p>{item.moment}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </section>

        <section id="family" className="family-section section-pad" aria-labelledby="family-title">
          <div className="page-grid family-grid">
            <div className="family-copy">
              <p className="eyebrow">{copy.family.eyebrow}</p>
              <h2 id="family-title">{copy.family.title}</h2>
              <p>{copy.family.intro}</p>
              <div className="family-values-card">
                <span className="preview-badge">{copy.preview.badge}</span>
                <h3>{copy.family.valuesTitle}</h3>
                <p>{copy.family.valuesBody}</p>
              </div>
            </div>

            <div className="family-media-grid">
              {copy.family.media.map((media, index) => (
                <PreviewMedia
                  key={`${media.label}-${index}`}
                  label={media.label}
                  detail={media.detail}
                  kind={media.kind}
                  ratio={media.ratio}
                  tone={index === 0 ? "peach" : "teal"}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="closing-section section-pad" aria-labelledby="closing-title">
          <div className="page-grid closing-inner">
            <p className="eyebrow">{copy.closing.eyebrow}</p>
            <h2 id="closing-title">{copy.closing.title}</h2>
            <p>{copy.closing.reflection}</p>
            <p>{copy.closing.hope}</p>
            <div className="button-row no-print">
              <a className="button secondary-button" href="#top">{copy.footer.top}</a>
              <PrintButton
                label={copy.controls.print}
                accessibleLabel={copy.controls.printLabel}
                className="button primary-button"
              />
            </div>
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
