"use client";

import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
} from "react";
import type { PortfolioLocale } from "./portfolio-copy";

export type MeadowDecorVariant = "rainbow" | "tree" | "balloons" | "dog";

export type MeadowDecorProps = {
  variant: MeadowDecorVariant;
  locale: PortfolioLocale;
  className?: string;
};

type MotionState = "idle" | "active" | "settled";

function dogSessionKey(locale: PortfolioLocale) {
  return `oliver-meadow-dog-${locale}-v1`;
}

export default function MeadowDecor({
  variant,
  locale,
  className = "",
}: MeadowDecorProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [motionState, setMotionState] = useState<MotionState>(
    variant === "rainbow" ? "settled" : "idle",
  );

  useEffect(() => {
    if (variant === "rainbow") return;

    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      const settleFrame = window.requestAnimationFrame(() => {
        setMotionState("settled");
      });
      return () => window.cancelAnimationFrame(settleFrame);
    }

    if (variant === "dog") {
      try {
        if (window.sessionStorage.getItem(dogSessionKey(locale)) === "seen") {
          const settleFrame = window.requestAnimationFrame(() => {
            setMotionState("settled");
          });
          return () => window.cancelAnimationFrame(settleFrame);
        }
      } catch {
        // Session storage is optional. The dog still runs only once while this
        // component remains mounted.
      }
    }

    let hasActivated = false;
    let observer: IntersectionObserver | null = null;
    const activate = () => {
      if (hasActivated) return;
      hasActivated = true;

      if (variant === "dog") {
        try {
          window.sessionStorage.setItem(dogSessionKey(locale), "seen");
        } catch {
          // The decorative animation does not depend on storage availability.
        }
      }

      setMotionState("active");
      observer?.disconnect();
    };

    if (!("IntersectionObserver" in window)) {
      activate();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) activate();
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.18,
      },
    );
    observer.observe(root);

    return () => observer?.disconnect();
  }, [locale, variant]);

  const classes = [
    "meadow-decor",
    `meadow-decor-${variant}`,
    "no-print",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (variant === "rainbow") {
    return (
      <div
        ref={rootRef}
        className={classes}
        data-meadow-state="settled"
        aria-hidden="true"
      />
    );
  }

  if (variant === "tree") {
    return (
      <div
        ref={rootRef}
        className={classes}
        data-meadow-state={motionState}
        aria-hidden="true"
      >
        <span className="meadow-tree-trunk" />
        <span className="meadow-tree-crown" />
        <span className="meadow-tree-leaf meadow-tree-leaf-one" />
        <span className="meadow-tree-leaf meadow-tree-leaf-two" />
        <span className="meadow-tree-leaf meadow-tree-leaf-three" />
      </div>
    );
  }

  if (variant === "balloons") {
    return (
      <div
        ref={rootRef}
        className={classes}
        data-meadow-state={motionState}
        aria-hidden="true"
      >
        <span className="meadow-balloon meadow-balloon-blue" />
        <span className="meadow-balloon meadow-balloon-peach" />
        <span className="meadow-balloon meadow-balloon-honey" />
      </div>
    );
  }

  const settleDog = (event: AnimationEvent<HTMLSpanElement>) => {
    if (
      event.target === event.currentTarget &&
      event.animationName === "meadow-dog-cross"
    ) {
      setMotionState("settled");
    }
  };

  return (
    <div
      ref={rootRef}
      className={classes}
      data-meadow-state={motionState}
      aria-hidden="true"
    >
      <span className="meadow-dog-runner" onAnimationEnd={settleDog}>
        <span className="meadow-dog-body" />
        <span className="meadow-dog-head" />
        <span className="meadow-dog-ear" />
        <span className="meadow-dog-tail" />
        <span className="meadow-dog-leg meadow-dog-leg-front" />
        <span className="meadow-dog-leg meadow-dog-leg-back" />
      </span>
    </div>
  );
}
