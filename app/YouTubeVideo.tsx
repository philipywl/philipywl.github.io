"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type YouTubeVideoProps = {
  videoId: string;
  poster: string;
  title: string;
  caption: string;
  ratio: "video" | "portrait-video";
  playLabel: string;
  loadingLabel: string;
  autoplayPriority: number;
};

type PlaybackEntry = {
  key: string;
  priority: number;
  element: HTMLElement;
  intersectionRatio: number;
  eligibleSince: number | null;
  ended: boolean;
  suppressed: boolean;
  playing: boolean;
  activation: "auto" | "manual" | null;
  activate: (manual: boolean) => void;
  play: () => void;
  pause: () => void;
  hasFocus: () => boolean;
};

const START_RATIO = 0.65;
const STOP_RATIO = 0.35;
const AUTOPLAY_DWELL_MS = 350;
const playbackEntries = new Map<string, PlaybackEntry>();
let activePlaybackKey: string | null = null;
let playbackObserver: IntersectionObserver | null = null;
let evaluationTimer = 0;
let visibilityListenersInstalled = false;

function scrollAutoplayAllowed() {
  if (
    typeof window === "undefined" ||
    !("IntersectionObserver" in window)
  ) {
    return false;
  }
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return !reducedMotion && connection?.saveData !== true;
}

function evaluatePlayback() {
  evaluationTimer = 0;
  let current = activePlaybackKey
    ? playbackEntries.get(activePlaybackKey)
    : undefined;
  const autoStartAllowed = scrollAutoplayAllowed();

  if (document.visibilityState !== "visible") {
    current?.pause();
    activePlaybackKey = null;
    return;
  }

  if (
    current &&
    (current.ended || current.intersectionRatio < STOP_RATIO)
  ) {
    current.pause();
    current.playing = false;
    current.activation = null;
    activePlaybackKey = null;
    current = undefined;
  }

  // Reduced Motion and Save Data stop automatic starts. They must not stop a
  // video the visitor explicitly chose to play while it remains in view.
  if (!autoStartAllowed) {
    if (current?.activation === "auto") {
      current.pause();
      current.playing = false;
      current.activation = null;
      activePlaybackKey = null;
    }
    return;
  }

  const now = performance.now();
  const visibleCandidates = [...playbackEntries.values()]
    .filter(
      (entry) =>
        entry.intersectionRatio >= START_RATIO &&
        !entry.ended &&
        !entry.suppressed,
    )
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        a.element.getBoundingClientRect().top -
          b.element.getBoundingClientRect().top,
    );
  const preferred = visibleCandidates[0];

  const hasHigherPriorityBlocker = (entry: PlaybackEntry) =>
    [...playbackEntries.values()].some(
      (candidate) =>
        candidate.priority < entry.priority &&
        candidate.intersectionRatio >= STOP_RATIO &&
        !candidate.ended &&
        !candidate.suppressed,
    );

  // A shorter neighbouring player can cross the start threshold first. Yield
  // while it is still loading so the prescribed story order remains stable.
  if (
    current &&
    current.activation === "auto" &&
    !current.playing &&
    hasHigherPriorityBlocker(current)
  ) {
    current.pause();
    current.playing = false;
    current.activation = null;
    activePlaybackKey = null;
    current = undefined;
  }

  // Do not replace a video that the visitor is controlling, has paused, or is
  // already watching. This keeps focus stable and prevents adjacent cards from
  // competing for attention.
  if (
    current &&
    (current.suppressed ||
      current.hasFocus() ||
      current.activation === "manual" ||
      current.intersectionRatio >= STOP_RATIO)
  ) {
    return;
  }

  // Only the highest-priority visible candidate may count down its dwell. A
  // lower-priority card therefore cannot win by a few milliseconds.
  const next =
    preferred &&
    !hasHigherPriorityBlocker(preferred) &&
    preferred.eligibleSince !== null &&
    now - preferred.eligibleSince >= AUTOPLAY_DWELL_MS
      ? preferred
      : undefined;

  if (!next) {
    if (
      preferred &&
      !hasHigherPriorityBlocker(preferred) &&
      preferred.eligibleSince !== null
    ) {
      schedulePlaybackEvaluation(
        Math.max(
          0,
          AUTOPLAY_DWELL_MS - (now - preferred.eligibleSince),
        ) + 16,
      );
    }
    return;
  }

  activePlaybackKey = next.key;
  next.activation = "auto";
  next.activate(false);
  next.play();
}

function schedulePlaybackEvaluation(delay = 0) {
  if (typeof window === "undefined") return;
  if (evaluationTimer) window.clearTimeout(evaluationTimer);
  evaluationTimer = window.setTimeout(evaluatePlayback, delay);
}

function pauseActivePlayback() {
  const current = activePlaybackKey
    ? playbackEntries.get(activePlaybackKey)
    : undefined;
  current?.pause();
  if (current) current.playing = false;
  activePlaybackKey = null;
}

function handleDocumentVisibility() {
  if (document.visibilityState !== "visible") pauseActivePlayback();
  else schedulePlaybackEvaluation();
}

function ensurePlaybackObserver() {
  if (
    playbackObserver ||
    typeof window === "undefined" ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  playbackObserver = new IntersectionObserver(
    (entries) => {
      const now = performance.now();
      entries.forEach((observerEntry) => {
        const key = (observerEntry.target as HTMLElement).dataset.videoId;
        if (!key) return;
        const entry = playbackEntries.get(key);
        if (!entry) return;

        entry.intersectionRatio = observerEntry.isIntersecting
          ? observerEntry.intersectionRatio
          : 0;
        if (entry.intersectionRatio >= START_RATIO) {
          entry.eligibleSince ??= now;
        } else {
          entry.eligibleSince = null;
        }
      });
      schedulePlaybackEvaluation();
    },
    {
      rootMargin: "-5% 0px -10% 0px",
      threshold: [0, STOP_RATIO, START_RATIO, 1],
    },
  );

  if (!visibilityListenersInstalled) {
    document.addEventListener("visibilitychange", handleDocumentVisibility);
    window.addEventListener("pagehide", pauseActivePlayback);
    visibilityListenersInstalled = true;
  }
}

function registerPlayback(entry: PlaybackEntry) {
  ensurePlaybackObserver();
  playbackEntries.set(entry.key, entry);
  playbackObserver?.observe(entry.element);
  schedulePlaybackEvaluation();

  return () => {
    playbackObserver?.unobserve(entry.element);
    playbackEntries.delete(entry.key);
    if (activePlaybackKey === entry.key) {
      entry.pause();
      activePlaybackKey = null;
      schedulePlaybackEvaluation();
    }
    if (playbackEntries.size === 0) {
      playbackObserver?.disconnect();
      playbackObserver = null;
      if (evaluationTimer) {
        window.clearTimeout(evaluationTimer);
        evaluationTimer = 0;
      }
      if (visibilityListenersInstalled) {
        document.removeEventListener(
          "visibilitychange",
          handleDocumentVisibility,
        );
        window.removeEventListener("pagehide", pauseActivePlayback);
        visibilityListenersInstalled = false;
      }
    }
  };
}

function requestManualPlayback(key: string) {
  const entry = playbackEntries.get(key);
  if (!entry) return;
  const current = activePlaybackKey
    ? playbackEntries.get(activePlaybackKey)
    : undefined;
  if (current && current.key !== key) {
    current.pause();
    current.playing = false;
    current.activation = null;
  }
  entry.ended = false;
  entry.suppressed = false;
  entry.playing = false;
  entry.activation = "manual";
  activePlaybackKey = key;
  entry.activate(true);
  entry.play();
}

function notifyPlaybackReady(key: string) {
  if (activePlaybackKey === key) {
    playbackEntries.get(key)?.play();
  }
}

function notifyPlaybackPlaying(key: string) {
  const entry = playbackEntries.get(key);
  if (!entry) return;
  const current = activePlaybackKey
    ? playbackEntries.get(activePlaybackKey)
    : undefined;
  if (current && current.key !== key) {
    current.pause();
    current.playing = false;
    current.activation = null;
  }
  entry.ended = false;
  entry.suppressed = false;
  entry.playing = true;
  entry.activation ??= "manual";
  activePlaybackKey = key;
}

function notifyUserPaused(key: string) {
  const entry = playbackEntries.get(key);
  if (!entry) return;
  entry.suppressed = true;
  entry.playing = false;
  entry.activation = "manual";
  activePlaybackKey = key;
}

function notifyPlaybackEnded(key: string) {
  const entry = playbackEntries.get(key);
  if (!entry) return;
  entry.ended = true;
  entry.suppressed = false;
  entry.playing = false;
  entry.activation = null;
  if (activePlaybackKey === key) activePlaybackKey = null;
  schedulePlaybackEvaluation();
}

export default function YouTubeVideo({
  videoId,
  poster,
  title,
  caption,
  ratio,
  playLabel,
  loadingLabel,
  autoplayPriority,
}: YouTubeVideoProps) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [playbackState, setPlaybackState] = useState<
    "poster" | "loading" | "playing" | "paused" | "ended"
  >("poster");
  const figureRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const focusAfterLoadRef = useRef(false);
  const coordinatorPauseUntilRef = useRef(0);
  const landscape = ratio === "video";
  const posterSmall = landscape ? 320 : 240;
  const posterLarge = landscape ? 480 : 405;
  const posterWidth = landscape ? 480 : 405;
  const posterHeight = landscape ? 270 : 720;

  const sendCommand = useCallback((func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "https://www.youtube-nocookie.com",
    );
  }, []);

  const play = useCallback(() => {
    sendCommand("mute");
    sendCommand("playVideo");
  }, [sendCommand]);

  const pause = useCallback(() => {
    coordinatorPauseUntilRef.current = Date.now() + 1200;
    sendCommand("pauseVideo");
    setPlaybackState((state) =>
      state === "poster" || state === "loading" ? state : "paused",
    );
  }, [sendCommand]);

  const activate = useCallback((manual: boolean) => {
    focusAfterLoadRef.current = manual;
    setPlaybackState("loading");
    setActive(true);
  }, []);

  useEffect(() => {
    const element = figureRef.current;
    if (!element) return;
    return registerPlayback({
      key: videoId,
      priority: autoplayPriority,
      element,
      intersectionRatio: 0,
      eligibleSince: null,
      ended: false,
      suppressed: false,
      playing: false,
      activation: null,
      activate,
      play,
      pause,
      hasFocus: () => element.contains(document.activeElement),
    });
  }, [activate, autoplayPriority, pause, play, videoId]);

  useEffect(() => {
    const handlePlayerMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      let data: unknown = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (
        typeof data !== "object" ||
        data === null ||
        !("event" in data) ||
        !("info" in data) ||
        data.event !== "onStateChange"
      ) {
        return;
      }

      const state = Number(data.info);
      if (state === 0) {
        setPlaybackState("ended");
        notifyPlaybackEnded(videoId);
      } else if (state === 1) {
        coordinatorPauseUntilRef.current = 0;
        setPlaybackState("playing");
        notifyPlaybackPlaying(videoId);
      } else if (state === 2) {
        setPlaybackState("paused");
        if (Date.now() > coordinatorPauseUntilRef.current) {
          notifyUserPaused(videoId);
        }
        coordinatorPauseUntilRef.current = 0;
      }
    };
    window.addEventListener("message", handlePlayerMessage);
    return () => window.removeEventListener("message", handlePlayerMessage);
  }, [videoId]);

  const handleIframeLoad = () => {
    setLoaded(true);
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: videoId }),
      "https://www.youtube-nocookie.com",
    );
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: "addEventListener",
        args: ["onStateChange"],
      }),
      "https://www.youtube-nocookie.com",
    );
    notifyPlaybackReady(videoId);
    if (focusAfterLoadRef.current) {
      iframeRef.current?.focus();
      focusAfterLoadRef.current = false;
    }
  };

  const origin =
    typeof window === "undefined"
      ? ""
      : `&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <figure
      ref={figureRef}
      className={`youtube-video youtube-video-${ratio}`}
      data-video-id={videoId}
      data-autoplay-priority={autoplayPriority}
      data-playback-state={playbackState}
    >
      <div className="youtube-video-frame">
        {active ? (
          <>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&playsinline=1&rel=0&controls=1${origin}`}
              title={title}
              loading="lazy"
              tabIndex={0}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
            />
            {!loaded && (
              <span className="youtube-video-loading" aria-live="polite">
                {loadingLabel}
              </span>
            )}
          </>
        ) : (
          <button
            className="youtube-video-trigger"
            type="button"
            onClick={() => requestManualPlayback(videoId)}
            aria-label={`${playLabel}: ${title}`}
          >
            {/* These pre-cropped local posters intentionally use an explicit srcset;
                no runtime image service is available on the static Pages build. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="youtube-video-poster"
              src={`/media/video/${poster}-${posterLarge}.webp`}
              srcSet={`/media/video/${poster}-${posterSmall}.webp ${posterSmall}w, /media/video/${poster}-${posterLarge}.webp ${posterLarge}w`}
              sizes={
                landscape
                  ? "(min-width: 48rem) 320px, calc(100vw - 84px)"
                  : "(min-width: 48rem) 340px, calc(100vw - 84px)"
              }
              width={posterWidth}
              height={posterHeight}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="youtube-video-scrim" aria-hidden="true" />
            <span className="youtube-video-play" aria-hidden="true" />
            <span className="youtube-video-trigger-label">{playLabel}</span>
          </button>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
