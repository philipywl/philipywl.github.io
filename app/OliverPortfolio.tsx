"use client";

import { useEffect, useState } from "react";
import GreetingReveal from "./GreetingReveal";
import PreviewMedia from "./PreviewMedia";
import {
  ArrowUpIcon,
  LanguageSwitch,
  MobileMenu,
  PrintButton,
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
    { href: "#about", label: copy.nav.about },
    { href: "#stories", label: copy.nav.stories },
    { href: "#growth", label: copy.nav.growth },
    { href: "#family", label: copy.nav.family },
  ];
  const [activeHref, setActiveHref] = useState("");
  const focusMain = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });
  };
  const focusHero = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("hero-title")?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    const sections = ["about", "stories", "growth", "family"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const visibleSections = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target.id);
          else visibleSections.delete(entry.target.id);
        });
        const visible = sections
          .filter((section) => visibleSections.has(section.id))
          .sort(
            (a, b) =>
              Math.abs(a.getBoundingClientRect().top - 96) -
              Math.abs(b.getBoundingClientRect().top - 96),
          );

        if (visible[0]) setActiveHref(`#${visible[0].id}`);
        else if (window.scrollY < 120) setActiveHref("");
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="site-shell" lang={copy.lang}>
      <a className="skip-link" href="#main-content" onClick={focusMain}>{copy.skip}</a>

      <header className="site-header no-print">
        <div className="header-inner">
          <a
            className="wordmark"
            href={localePaths[locale].home}
          >
            <span className="wordmark-name" lang="en-HK">
              <span>Oliver</span> YEUNG
            </span>
            <span className="sr-only" lang={copy.lang}>
              {locale === "en" ? " — return to homepage" : "，返回首頁"}
            </span>
          </a>

          <nav
            className="desktop-nav"
            aria-label={locale === "en" ? "Main navigation" : "主要導覽"}
          >
            {navigationItems.map((item) => (
              <a
                className={activeHref === item.href ? "is-active" : undefined}
                href={item.href}
                key={item.href}
                aria-current={activeHref === item.href ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageSwitch
              locale={locale}
              label={copy.controls.languages}
              selectedLabel={copy.controls.selected}
            />
            <MobileMenu
              items={navigationItems}
              menuLabel={copy.controls.menu}
              closeLabel={copy.controls.closeMenu}
              activeHref={activeHref}
            />
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
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
                <a className="hero-text-link" href="#about">
                  {copy.hero.aboutAction}
                </a>
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
              <h2 id="about-title" tabIndex={-1}>{copy.about.title}</h2>
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

        <section id="stories" className="stories-section section-pad" aria-labelledby="stories-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.stories.eyebrow}</p>
              <h2 id="stories-title" tabIndex={-1}>{copy.stories.title}</h2>
              <p>{copy.stories.intro}</p>
              <p className="story-media-note">{copy.stories.mediaNote}</p>
            </div>
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

                  {story.reflection && (
                    <blockquote className="parent-reflection">
                      <span>{copy.stories.reflection}</span>
                      <p>{story.reflection}</p>
                    </blockquote>
                  )}

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

        <section id="growth" className="growth-section section-pad" aria-labelledby="growth-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.growth.eyebrow}</p>
              <h2 id="growth-title" tabIndex={-1}>{copy.growth.title}</h2>
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
              <h2 id="family-title" tabIndex={-1}>{copy.family.title}</h2>
              <p>{copy.family.intro}</p>
              <div className="family-values-card">
                <h3>{copy.family.valuesTitle}</h3>
                <p>{copy.family.valuesBody}</p>
              </div>
              <div className="family-vignette-grid">
                {copy.family.vignettes.map((vignette, index) => (
                  <article className="family-vignette" key={vignette.title}>
                    <span className="field-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{vignette.title}</h3>
                    <p>{vignette.body}</p>
                  </article>
                ))}
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
              <a
                className="button secondary-button"
                href="#hero-title"
                onClick={focusHero}
              >
                <ArrowUpIcon />
                <span>{copy.footer.top}</span>
              </a>
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
            <a href="#hero-title" onClick={focusHero}>{copy.footer.top}</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
