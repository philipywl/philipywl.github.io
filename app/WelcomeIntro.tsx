"use client";

import { useEffect, useRef } from "react";

const sessionKey = "oliver-welcome-v1";
const completeEvent = "oliver:welcome-complete";

type WelcomeIntroProps = {
  message: string;
  skipLabel: string;
};

function sourceSet(name: "welcome-family" | "welcome-walk", extension: "avif" | "webp") {
  return [480, 800, 1200]
    .map((width) => `/media/oliver/${name}-${width}.${extension} ${width}w`)
    .join(", ");
}

export default function WelcomeIntro({ message, skipLabel }: WelcomeIntroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const closedRef = useRef(false);
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
    window.requestAnimationFrame(() => skipRef.current?.focus({ preventScroll: true }));

    let hideTimer = 0;
    const complete = () => {
      root.dataset.welcomeState = "hidden";
      site?.removeAttribute("inert");
      document.body.classList.remove("welcome-open");
      window.dispatchEvent(new Event(completeEvent));
      if (root.contains(document.activeElement)) {
        document.getElementById("hero-title")?.focus({ preventScroll: true });
      }
    };

    const finish = (animateExit = true) => {
      if (closedRef.current) return;
      closedRef.current = true;
      if (!animateExit) {
        complete();
        return;
      }
      root.dataset.welcomeState = "exiting";
      hideTimer = window.setTimeout(complete, 320);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    const completionTimer = window.setTimeout(() => finish(false), 2700);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(completionTimer);
      window.clearTimeout(hideTimer);
      site?.removeAttribute("inert");
      document.body.classList.remove("welcome-open");
    };
  }, []);

  const skipWelcome = () => {
    const root = rootRef.current;
    if (!root || closedRef.current) return;
    closedRef.current = true;
    root.dataset.welcomeState = "exiting";
    window.setTimeout(() => {
      root.dataset.welcomeState = "hidden";
      document.getElementById("top")?.removeAttribute("inert");
      document.body.classList.remove("welcome-open");
      window.dispatchEvent(new Event(completeEvent));
      document.getElementById("hero-title")?.focus({ preventScroll: true });
    }, 320);
  };

  return (
    <>
      <aside
        id="welcome-intro"
        ref={rootRef}
        className="welcome-intro no-print"
        data-welcome-state="hidden"
        aria-labelledby="welcome-intro-message"
        suppressHydrationWarning
      >
        <p id="welcome-intro-message" className="sr-only">
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
                  sizes="(min-width: 48rem) 360px, calc(50vw - 28px)"
                  type="image/avif"
                />
                <img
                  src={`/media/oliver/${name}-800.webp`}
                  srcSet={sourceSet(name, "webp")}
                  sizes="(min-width: 48rem) 360px, calc(50vw - 28px)"
                  width="1200"
                  height="1500"
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={skipWelcome}
                />
              </picture>
            </div>
          ))}
        </div>
        <p className="welcome-message" aria-hidden="true">
          {message}
        </p>
        <button
          ref={skipRef}
          className="welcome-skip"
          type="button"
          onClick={skipWelcome}
        >
          {skipLabel}
        </button>
      </aside>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
    </>
  );
}
