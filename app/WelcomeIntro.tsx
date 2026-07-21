"use client";

import { useCallback, useEffect, useRef } from "react";

const sessionKey = "oliver-welcome-v4";
const completeEvent = "oliver:welcome-complete";
const welcomeDurationMs = 3200;
const exitDurationMs = 280;

type WelcomeIntroProps = {
  message: string;
};

export default function WelcomeIntro({ message }: WelcomeIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef(false);
  const exitTimerRef = useRef(0);
  const releaseFocusIsolationRef = useRef<(() => void) | null>(null);
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
      window.__oliverWelcomeFailOpenTimer = window.setTimeout(() => {
        const current = document.getElementById("welcome-intro");
        if (!current || current.dataset.welcomeState !== "play") return;
        current.dataset.welcomeState = "hidden";
        window.__oliverWelcomeShouldPlay = false;
        document.body.classList.remove("welcome-open");
        window.dispatchEvent(new Event(${JSON.stringify(completeEvent)}));
      }, ${welcomeDurationMs + 1_000});
    }
  })();`;

  const completeWelcome = useCallback((focusHero = false) => {
    const root = rootRef.current;
    if (!root) return;
    const hadWelcomeFocus = root.contains(document.activeElement);
    releaseFocusIsolationRef.current?.();
    const welcomeWindow = window as typeof window & {
      __oliverWelcomeFailOpenTimer?: number;
      __oliverWelcomeShouldPlay?: boolean;
    };
    if (welcomeWindow.__oliverWelcomeFailOpenTimer) {
      window.clearTimeout(welcomeWindow.__oliverWelcomeFailOpenTimer);
      delete welcomeWindow.__oliverWelcomeFailOpenTimer;
    }
    welcomeWindow.__oliverWelcomeShouldPlay = false;
    root.dataset.welcomeState = "hidden";
    document.body.classList.remove("welcome-open");
    window.dispatchEvent(new Event(completeEvent));
    if (focusHero || hadWelcomeFocus) {
      const heroTitle = document.getElementById("hero-title");
      if (!heroTitle) return;

      // The timed welcome handoff should feel visually seamless. Keep the
      // normal focus ring for an explicit keyboard dismissal, and restore it
      // immediately when the visitor next uses a keyboard or pointer.
      if (!focusHero) {
        heroTitle.dataset.welcomeFocus = "quiet";
        let cleared = false;
        const clearQuietFocus = () => {
          if (cleared) return;
          cleared = true;
          delete heroTitle.dataset.welcomeFocus;
          window.removeEventListener("keydown", clearQuietFocus, true);
          window.removeEventListener("pointerdown", clearQuietFocus, true);
          heroTitle.removeEventListener("blur", clearQuietFocus);
        };
        window.addEventListener("keydown", clearQuietFocus, true);
        window.addEventListener("pointerdown", clearQuietFocus, true);
        heroTitle.addEventListener("blur", clearQuietFocus, { once: true });
      }

      heroTitle.focus({ preventScroll: true });
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

  useEffect(() => {
    const root = rootRef.current;
    const welcomeWindow = window as typeof window & {
      __oliverWelcomeShouldPlay?: boolean;
    };
    const shouldPlay =
      welcomeWindow.__oliverWelcomeShouldPlay === true &&
      root?.dataset.welcomeState === "play";

    if (!root || !shouldPlay) {
      window.dispatchEvent(new Event(completeEvent));
      return;
    }

    document.body.classList.add("welcome-open");

    const keepFocusOnWelcome = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof Node && !root.contains(target)) {
        root.focus({ preventScroll: true });
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        root.focus({ preventScroll: true });
        return;
      }
      if (event.key === "Escape") dismissWelcome();
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", keepFocusOnWelcome, true);
    const releaseFocusIsolation = () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", keepFocusOnWelcome, true);
      if (releaseFocusIsolationRef.current === releaseFocusIsolation) {
        releaseFocusIsolationRef.current = null;
      }
    };
    releaseFocusIsolationRef.current = releaseFocusIsolation;
    root.focus({ preventScroll: true });
    const completionTimer = window.setTimeout(() => {
      if (closedRef.current) return;
      closedRef.current = true;
      completeWelcome(false);
    }, welcomeDurationMs);

    return () => {
      releaseFocusIsolation();
      window.clearTimeout(completionTimer);
      window.clearTimeout(exitTimerRef.current);
      document.body.classList.remove("welcome-open");
    };
  }, [completeWelcome, dismissWelcome]);

  return (
    <>
      <div
        id="welcome-intro"
        ref={rootRef}
        className="welcome-intro no-print"
        data-welcome-state="hidden"
        suppressHydrationWarning
        tabIndex={-1}
      >
        <p
          id="welcome-intro-message"
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
        <p className="welcome-message" aria-hidden="true">
          {message}
        </p>
      </div>
      <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
    </>
  );
}
