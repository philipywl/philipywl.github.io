"use client";

import { useEffect } from "react";
import type { PortfolioLocale } from "./portfolio-copy";

const greetingDurations: Record<PortfolioLocale, number> = {
  en: 1770,
  zh: 1520,
};

export default function GreetingReveal({
  locale,
  id,
  greeting,
  lead,
  rest,
}: {
  locale: PortfolioLocale;
  id: string;
  greeting: string;
  lead: string;
  rest: string;
}) {
  const sessionKey = `oliver-greeting-${locale}-v1`;
  const playState = `${locale}-play`;
  const completeState = `${locale}-complete`;
  const bootstrap = `(() => {
    const heading = document.getElementById(${JSON.stringify(id)});
    if (!heading) return;
    const key = ${JSON.stringify(sessionKey)};
    const play = ${JSON.stringify(playState)};
    const complete = ${JSON.stringify(completeState)};
    let seen = false;
    try { seen = window.sessionStorage.getItem(key) === "seen"; } catch {}
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && !seen) {
      try { window.sessionStorage.setItem(key, "seen"); } catch {}
    }
    heading.dataset.greetingState = seen || reduced ? complete : play;
  })();`;

  useEffect(() => {
    const heading = document.getElementById(id);
    if (heading?.dataset.greetingState !== playState) return;

    // Mark the greeting as seen as soon as the one-time reveal begins. If a
    // visitor navigates away mid-animation, it still will not replay later in
    // the same browser session.
    try {
      window.sessionStorage.setItem(sessionKey, "seen");
    } catch {
      // Session storage is optional; the heading remains fully readable.
    }

    const completionTimer = window.setTimeout(() => {
      heading.dataset.greetingState = completeState;
    }, greetingDurations[locale]);

    return () => window.clearTimeout(completionTimer);
  }, [completeState, id, locale, playState, sessionKey]);

  return (
    <>
      <h1
        id={id}
        className="greeting-heading"
        data-greeting-locale={locale}
        data-greeting-state="static"
        suppressHydrationWarning
      >
        <span className="sr-only">{greeting}</span>
        <span className="greeting-reserve" aria-hidden="true">
          <span className="greeting-part">{lead}</span>
          {locale === "en" ? " " : <wbr />}
          <span className="greeting-part">{rest}</span>
        </span>
        <span className="greeting-visual" aria-hidden="true">
          <span className="greeting-part greeting-part-lead">
            <span className="greeting-segment">{lead}</span>
            <span className="greeting-cursor greeting-cursor-lead" />
          </span>
          {locale === "en" ? " " : <wbr />}
          <span className="greeting-part greeting-part-rest">
            <span className="greeting-segment">{rest}</span>
            <span className="greeting-cursor greeting-cursor-rest" />
          </span>
        </span>
      </h1>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
    </>
  );
}
