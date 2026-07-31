"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { PortfolioLocale } from "./portfolio-copy";

const welcomeCompleteEvent = "oliver:welcome-complete";
const portraitMotionDurationMs = 820;
const portraitMotionDelayMs = 140;

export default function HeroPortraitMotion({
  locale,
  children,
}: {
  locale: PortfolioLocale;
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sessionKey = `oliver-portrait-${locale}-v1`;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(sessionKey) === "seen";
    } catch {
      // The decorative motion never depends on storage being available.
    }

    if (seen || reducedMotion) {
      root.dataset.portraitMotion = "complete";
      return;
    }

    const image = root.querySelector<HTMLImageElement>("img");
    let imageReady = Boolean(image?.complete && image.naturalWidth > 0);
    let welcomeReady =
      (
        window as typeof window & { __oliverWelcomeShouldPlay?: boolean }
      ).__oliverWelcomeShouldPlay !== true;
    let startTimer = 0;
    let completeTimer = 0;
    let started = false;

    const startMotion = () => {
      if (started || !imageReady || !welcomeReady) return;
      started = true;
      startTimer = window.setTimeout(() => {
        root.dataset.portraitMotion = "play";
        try {
          window.sessionStorage.setItem(sessionKey, "seen");
        } catch {
          // A one-time animation is still safe when storage is unavailable.
        }
        completeTimer = window.setTimeout(() => {
          root.dataset.portraitMotion = "complete";
        }, portraitMotionDurationMs);
      }, portraitMotionDelayMs);
    };

    const handleImageReady = () => {
      imageReady = true;
      startMotion();
    };
    const handleWelcomeComplete = () => {
      welcomeReady = true;
      startMotion();
    };

    if (imageReady) startMotion();
    else image?.addEventListener("load", handleImageReady, { once: true });

    if (!welcomeReady) {
      window.addEventListener(welcomeCompleteEvent, handleWelcomeComplete, {
        once: true,
      });
    }

    // The welcome may have completed between the initial flag read and the
    // event listener above. Recheck once so the portrait never waits forever.
    if (
      (
        window as typeof window & { __oliverWelcomeShouldPlay?: boolean }
      ).__oliverWelcomeShouldPlay !== true
    ) {
      welcomeReady = true;
      startMotion();
    }

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(completeTimer);
      image?.removeEventListener("load", handleImageReady);
      window.removeEventListener(
        welcomeCompleteEvent,
        handleWelcomeComplete,
      );
    };
  }, [locale]);

  return (
    <div
      ref={rootRef}
      className="hero-visual"
      data-portrait-motion="waiting"
      suppressHydrationWarning
    >
      {children}
    </div>
  );
}
