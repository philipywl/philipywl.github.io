"use client";

import { useCallback, useEffect, useRef } from "react";

const sessionKey = "oliver-welcome-v2";
const completeEvent = "oliver:welcome-complete";
const welcomeDurationMs = 7000;
const exitDurationMs = 280;

type WelcomeIntroProps = {
  message: string;
};

function sourceSet(name: "welcome-family" | "welcome-walk", extension: "avif" | "webp") {
  return [480, 800, 1200]
    .map((width) => `/media/oliver/${name}-${width}.${extension} ${width}w`)
    .join(", ");
}

export default function WelcomeIntro({ message }: WelcomeIntroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const closedRef = useRef(false);
  const exitTimerRef = useRef(0);
  const bootstrap = `(() => {
    const root = document.getElementById("welcome-intro");
    if (!root) return;
    let seen = false;
    try { seen = window.sessionStorage.getItem(${JSON.stringify(sessionKey)}) === "seen"; } catch {}
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(window.navigator.connection && window.navigator.connection.saveData);
    const shouldPlay = !seen && !reduced && !saveData && !window.location.hash;
    window.__oliverWelcomeShouldPlay = shouldPlay;
    root.dataset.welcomeState = shouldPlay ? "play" : "hidden";
    if (shouldPlay) {
      try { window.sessionStorage.setItem(${JSON.stringify(sessionKey)}, "seen"); } catch {}
    }
  })();`;

  const completeWelcome = useCallback((focusHero = false) => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.welcomeState = "hidden";
    document.getElementById("top")?.removeAttribute("inert");
    document.body.classList.remove("welcome-open");
    window.dispatchEvent(new Event(completeEvent));
    if (focusHero) {
      document.getElementById("hero-title")?.focus({ preventScroll: true });
    }
  }, []);

  const dismissWelcome = useCallback(() => {
    const root = rootRef.current;
    if (!root || closedRef.current) return;
    closedRef.current = true;
    root.dataset.welcomeState = "exiting";
    exitTimerRef.current = window.setTimeout(
      () => completeWelcome(true),
      exitDurationMs,
    );
  }, [completeWelcome]);

  const failOpen = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    completeWelcome(false);
  }, [completeWelcome]);

  useEffect(() => {
    const root = rootRef.current;
    const site = document.getElementById("top");
    const welcomeWindow = window as typeof window & {
      __oliverWelcomeShouldPlay?: boolean;
    };
    const shouldPlay =
      welcomeWindow.__oliverWelcomeShouldPlay === true ||
      root?.dataset.welcomeState === "play";

    if (!root || !shouldPlay) {
      window.dispatchEvent(new Event(completeEvent));
      return;
    }

    site?.setAttribute("inert", "");
    document.body.classList.add("welcome-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissWelcome();
    };
    window.addEventListener("keydown", onKeyDown);
    const completionTimer = window.setTimeout(() => {
      if (closedRef.current) return;
      closedRef.current = true;
      completeWelcome(false);
    }, welcomeDurationMs);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(completionTimer);
      window.clearTimeout(exitTimerRef.current);
      site?.removeAttribute("inert");
      document.body.classList.remove("welcome-open");
    };
  }, [completeWelcome, dismissWelcome]);

  return (
    <>
      <aside
        id="welcome-intro"
        ref={rootRef}
        className="welcome-intro no-print"
        data-welcome-state="hidden"
        suppressHydrationWarning
      >
        <p
          id="welcome-intro-message"
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
        <div className="welcome-photo-pair" aria-hidden="true">
          {([
            { name: "welcome-family", motionClass: "welcome-photo-family" },
            { name: "welcome-walk", motionClass: "welcome-photo-walk" },
          ] as const).map(({ name, motionClass }) => (
            <div className={`welcome-photo ${motionClass}`} key={name}>
              <picture>
                <source
                  srcSet={sourceSet(name, "avif")}
                  sizes="50vw"
                  type="image/avif"
                />
                <img
                  src={`/media/oliver/${name}-800.webp`}
                  srcSet={sourceSet(name, "webp")}
                  sizes="50vw"
                  width="1200"
                  height="1500"
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={failOpen}
                />
              </picture>
            </div>
          ))}
        </div>
        <p className="welcome-message" aria-hidden="true">
          {message}
        </p>
      </aside>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
    </>
  );
}
