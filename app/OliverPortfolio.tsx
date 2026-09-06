"use client";

import { useEffect, useState } from "react";
import GreetingReveal from "./GreetingReveal";
import HeroPortraitMotion from "./HeroPortraitMotion";
import MeadowDecor from "./MeadowDecor";
import PreviewMedia from "./PreviewMedia";
import ResponsivePhoto from "./ResponsivePhoto";
import WelcomeIntro from "./WelcomeIntro";
import YouTubeVideo from "./YouTubeVideo";
import {
  ArrowUpIcon,
  LanguageSwitch,
  markPendingSection,
  MobileMenu,
} from "./PortfolioControls";
import {
  localePaths,
  portfolioCopy,
  type PortfolioLocale,
} from "./portfolio-copy";

const mediaTones = ["sky", "honey", "peach", "teal"] as const;
const sectionIds = ["about", "stories", "growth", "family"] as const;
const storyVideoOrder = [
  "gfiAoI900Vc",
  "IYiabpo7nuI",
  "kgPKylmVI7s",
  "vWXWUHqovGc",
  "2RE83LVmTVk",
  "rcpBdZzHJAk",
  "FW24LCUNS_w",
] as const;

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
  const [familyMainPhoto, familyInlinePhoto, ...familySupportPhotos] =
    copy.family.photos;
  const orderedStories = [...copy.stories.items].sort((left, right) => {
    const firstVideoId = (story: (typeof copy.stories.items)[number]) =>
      story.media.find((media) => media.kind === "video")?.videoId ?? "";
    const leftPosition = storyVideoOrder.indexOf(
      firstVideoId(left) as (typeof storyVideoOrder)[number],
    );
    const rightPosition = storyVideoOrder.indexOf(
      firstVideoId(right) as (typeof storyVideoOrder)[number],
    );
    return (
      (leftPosition < 0 ? Number.MAX_SAFE_INTEGER : leftPosition) -
      (rightPosition < 0 ? Number.MAX_SAFE_INTEGER : rightPosition)
    );
  });
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
  const focusSection = (href: string) => {
    window.requestAnimationFrame(() => {
      const section = document.querySelector<HTMLElement>(href);
      section?.querySelector<HTMLElement>("h2, h3")?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    const destination = window.location.hash;
    const root = document.documentElement;
    if (sectionIds.some((id) => destination === `#${id}`)) {
      markPendingSection(destination);
      document
        .querySelector<HTMLElement>(destination)
        ?.scrollIntoView({ block: "start" });
    }
    const enableSmoothScroll = window.requestAnimationFrame(() => {
      root.classList.add("is-scroll-ready");
    });

    return () => {
      window.cancelAnimationFrame(enableSmoothScroll);
      root.classList.remove("is-scroll-ready");
    };
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const visibleSections = new Set<string>();
    let activeSectionTimer = 0;
    const settleActiveHref = (href: string) => {
      window.clearTimeout(activeSectionTimer);
      activeSectionTimer = window.setTimeout(() => {
        setActiveHref(document.documentElement.dataset.scrollTarget || href);
      }, 180);
    };

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

        if (visible[0]) settleActiveHref(`#${visible[0].id}`);
        else if (window.scrollY < 120) settleActiveHref("");
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 0.1, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      window.clearTimeout(activeSectionTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <WelcomeIntro message={copy.welcome.message} />
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
                onClick={() => {
                  setActiveHref(item.href);
                  markPendingSection(item.href);
                  focusSection(item.href);
                }}
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
              activeHref={activeHref}
            />
            <MobileMenu
              items={navigationItems}
              menuLabel={copy.controls.menu}
              closeLabel={copy.controls.closeMenu}
              activeHref={activeHref}
              onNavigate={setActiveHref}
            />
          </div>
        </div>
      </header>

      <noscript>
        <style>{`
          .mobile-menu { display: none !important; }
          @media (max-width: 71.999rem) {
            .site-header { position: relative; }
            .desktop-nav { display: flex; flex-wrap: wrap; grid-column: 1 / -1; grid-row: 2; gap: 4px 12px; padding-bottom: 8px; }
            .desktop-nav a { display: inline-flex; align-items: center; min-height: 44px; color: var(--ink); }
            .header-actions { grid-column: 2; grid-row: 1; }
          }
        `}</style>
      </noscript>

      <main id="main-content" tabIndex={-1}>
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="page-grid hero-grid">
            <MeadowDecor
              variant="hero-sky"
              locale={locale}
              className="meadow-hero-sky"
            />
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
            </div>

            <HeroPortraitMotion locale={locale}>
              <ResponsivePhoto
                name={copy.hero.portrait.name}
                alt={copy.hero.portrait.alt}
                caption={copy.hero.portrait.caption}
                sizes="(min-width: 72rem) 380px, (min-width: 48rem) 360px, calc(100vw - 72px)"
                priority
                className="hero-preview-media"
              />
            </HeroPortraitMotion>
          </div>
        </section>

        <section id="about" className="about-section section-pad" aria-labelledby="about-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.about.eyebrow}</p>
              <h2 id="about-title" tabIndex={-1}>{copy.about.title}</h2>
              <p>{copy.about.intro}</p>
            </div>
          </div>

          <div className="page-grid about-grid">
            <ResponsivePhoto
              name={copy.about.mainPhoto.name}
              alt={copy.about.mainPhoto.alt}
              caption={copy.about.mainPhoto.caption}
              sizes="(min-width: 30rem) 360px, calc(100vw - 40px)"
              className="about-preview-media"
            />
            <div className="about-fields">
              {copy.about.fields.map((field, index) => (
                <article className="about-field" key={field.title}>
                  {"kind" in field.media ? (
                    <div className="about-field-video">
                      <YouTubeVideo
                        videoId={field.media.videoId}
                        poster={field.media.poster}
                        title={field.media.title}
                        caption={field.media.caption}
                        ratio={field.media.ratio}
                        playLabel={copy.controls.playVideo}
                        loadingLabel={copy.controls.loadingVideo}
                        unavailableLabel={copy.controls.unavailableVideo}
                        retryLabel={copy.controls.retryVideo}
                        enableScriptLabel={copy.controls.enableVideoScript}
                        enableSoundLabel={copy.controls.enableVideoSound}
                        disableSoundLabel={copy.controls.disableVideoSound}
                        autoplayPriority={field.media.autoplayPriority}
                      />
                    </div>
                  ) : "name" in field.media ? (
                    <ResponsivePhoto
                      name={field.media.name}
                      alt={field.media.alt}
                      caption={field.media.caption}
                      sizes="(min-width: 48rem) 220px, calc(100vw - 84px)"
                      className="about-field-photo"
                    />
                  ) : (
                    <PreviewMedia
                      label={field.media.label}
                      detail={field.media.detail}
                      kind="photo"
                      ratio="square"
                      tone={mediaTones[index % mediaTones.length]}
                      className="about-field-placeholder"
                    />
                  )}
                  <div className="about-field-copy">
                    <span className="field-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{field.title}</h3>
                    <p>{field.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <MeadowDecor variant="dog" locale={locale} />
        </section>

        <section id="stories" className="stories-section section-pad" aria-labelledby="stories-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.stories.eyebrow}</p>
              <h2 id="stories-title" tabIndex={-1}>{copy.stories.title}</h2>
              <p>{copy.stories.intro}</p>
            </div>
          </div>

          <div className="page-grid stories-grid">
            {orderedStories.map((story, storyIndex) => (
              <article
                aria-labelledby={`story-${storyIndex + 1}-title`}
                className={`story-card story-card-${storyIndex + 1} ${story.media.length > 1 ? "story-card-multi-media" : ""} ${storyIndex === 0 ? "story-card-featured" : ""} ${storyIndex === orderedStories.length - 1 ? "story-card-closing" : ""}`.trim()}
                key={story.title}
              >
                <div className={`story-media-grid story-media-count-${story.media.length}`}>
                  {story.media.map((media, mediaIndex) => (
                    media.kind === "video" ? (
                      <YouTubeVideo
                        key={`${story.title}-${media.videoId}`}
                        videoId={media.videoId}
                        poster={media.poster}
                        title={media.title}
                        caption={media.caption}
                        ratio={media.ratio}
                        playLabel={copy.controls.playVideo}
                        loadingLabel={copy.controls.loadingVideo}
                        unavailableLabel={copy.controls.unavailableVideo}
                        retryLabel={copy.controls.retryVideo}
                        enableScriptLabel={copy.controls.enableVideoScript}
                        enableSoundLabel={copy.controls.enableVideoSound}
                        disableSoundLabel={copy.controls.disableVideoSound}
                        autoplayPriority={(storyIndex + 1) * 10}
                      />
                    ) : (
                      <ResponsivePhoto
                        key={`${story.title}-${media.name}-${mediaIndex}`}
                        name={media.name}
                        alt={media.alt}
                        caption={media.caption}
                        sizes="(min-width: 60rem) 520px, (min-width: 30rem) 46vw, calc(100vw - 64px)"
                        className={`story-photo story-photo-${media.ratio}`}
                      />
                    )
                  ))}
                </div>

                <div className="story-content">
                  <header className="story-header">
                    <h3 id={`story-${storyIndex + 1}-title`}>{story.title}</h3>
                    <p className="story-age">{story.age}</p>
                  </header>

                  <div className="story-observation">
                    <p className="story-label">{copy.stories.whatHappened}</p>
                    <p>{story.observation}</p>
                  </div>

                  <div className={`story-detail-grid ${story.noticed ? "" : "story-detail-grid-single"}`.trim()}>
                    {story.noticed && (
                      <div>
                        <p className="story-label">{copy.stories.noticed}</p>
                        <p>{story.noticed}</p>
                      </div>
                    )}
                    <div>
                      <p className="story-label">{copy.stories.support}</p>
                      <p>{story.support}</p>
                    </div>
                  </div>

                  {story.reflection && (
                    <div className="parent-reflection">
                      <span>{copy.stories.reflection}</span>
                      <p>{story.reflection}</p>
                    </div>
                  )}

                  {story.tags.length > 0 && (
                    <div className="learning-clues" aria-label={copy.stories.learningClues}>
                      <span className="story-label">{copy.stories.learningClues}</span>
                      {story.tags.map((tag, tagIndex) => (
                        <span className="learning-tag" key={`${story.title}-${tagIndex}`}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          <MeadowDecor
            variant="garden"
            locale={locale}
            className="meadow-garden-stories"
          />
        </section>

        <section id="growth" className="growth-section section-pad" aria-labelledby="growth-title">
          <div className="page-grid section-intro-grid">
            <div className="section-heading-copy">
              <p className="eyebrow">{copy.growth.eyebrow}</p>
              <h2 id="growth-title" tabIndex={-1}>{copy.growth.title}</h2>
              <p>{copy.growth.intro}</p>
            </div>
          </div>

          <div className="page-grid growth-moments-layout">
            <section
              className="timeline-panel growth-milestones-panel"
              aria-labelledby="milestones-title"
            >
              <h3 id="milestones-title">{copy.growth.milestonesTitle}</h3>
              {copy.growth.milestonesIntro && (
                <p className="milestones-intro">{copy.growth.milestonesIntro}</p>
              )}
              <ol className="growth-milestone-list">
                {copy.growth.milestones.map((item, index) => (
                  <li
                    className={`growth-milestone ${item.photo || item.placeholder ? "has-media" : ""}`.trim()}
                    key={`${item.time}-${item.title}-${index}`}
                  >
                    <p className="timeline-time">{item.time}</p>
                    <span className="timeline-dot" aria-hidden="true" />
                    <article className="milestone-card">
                      <div className="milestone-copy">
                        <h4>{item.title}</h4>
                        <p>{item.moment}</p>
                      </div>
                      {item.photo && (
                        <ResponsivePhoto
                          name={item.photo.name}
                          alt={item.photo.alt}
                          caption={item.photo.caption}
                          sizes="(min-width: 72rem) 230px, (min-width: 48rem) 280px, calc(100vw - 96px)"
                          className="milestone-photo"
                        />
                      )}
                      {item.placeholder && (
                        <PreviewMedia
                          label={item.placeholder.label}
                          detail={item.placeholder.detail}
                          ratio="landscape"
                          tone="honey"
                          className="milestone-placeholder"
                        />
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            </section>
            <ResponsivePhoto
              name={copy.growth.portrait.name}
              alt={copy.growth.portrait.alt}
              caption={copy.growth.portrait.caption}
              sizes="(min-width: 60rem) 330px, (min-width: 48rem) 34vw, calc(100vw - 40px)"
              className="growth-portrait"
            />
          </div>
          <MeadowDecor variant="tree" locale={locale} />
        </section>

        <section id="family" className="family-section section-pad" aria-labelledby="family-title">
          <div className="page-grid family-grid">
            <div className="family-copy">
              <p className="eyebrow">{copy.family.eyebrow}</p>
              <h2 id="family-title" tabIndex={-1}>{copy.family.title}</h2>
              <p>{copy.family.intro}</p>
              <ResponsivePhoto
                name={familyInlinePhoto.name}
                alt={familyInlinePhoto.alt}
                caption={familyInlinePhoto.caption}
                sizes="(min-width: 60rem) 350px, (min-width: 48rem) 520px, calc(100vw - 40px)"
                className="family-photo family-photo-inline"
              />
            </div>

            <div className="family-media-grid">
              {[familyMainPhoto, ...familySupportPhotos].map((photo, index) => (
                <ResponsivePhoto
                  key={photo.name}
                  name={photo.name}
                  alt={photo.alt}
                  caption={photo.caption}
                  sizes={index === 0
                    ? "(min-width: 60rem) 640px, (min-width: 48rem) 660px, calc(100vw - 40px)"
                    : "(min-width: 60rem) 300px, (min-width: 48rem) calc((100vw - 88px) / 2), calc(100vw - 40px)"}
                  className={`family-photo ${index === 0 ? "family-photo-main" : "family-photo-support"}`}
                />
              ))}
            </div>
          </div>
          <MeadowDecor
            variant="garden"
            locale={locale}
            className="meadow-garden-family"
          />
        </section>

        <section className="closing-section section-pad" aria-labelledby="closing-title">
          <MeadowDecor variant="balloons" locale={locale} />
          <div className="page-grid closing-inner">
            <p className="eyebrow">{copy.closing.eyebrow}</p>
            <h2 id="closing-title">{copy.closing.title}</h2>
            <p>{copy.closing.reflection}</p>
            <p>{copy.closing.hope}</p>
            <div className="button-row no-print">
              <a
                className="button secondary-button"
                href="#top"
                onClick={focusHero}
              >
                <ArrowUpIcon />
                <span>{copy.footer.top}</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="page-grid footer-grid">
          <div className="footer-identity">
            <p className="footer-name">
              <span lang="en-HK">Oliver YEUNG</span>{" "}
              <span aria-hidden="true">·</span>{" "}
              <span lang="zh-Hant-HK">楊昊熹</span>
            </p>
            <p>{copy.footer.updated}</p>
          </div>
          <p className="footer-privacy">{copy.privacy.body}</p>
        </div>
      </footer>
      </div>
    </>
  );
}
