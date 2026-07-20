"use client";

import { useLayoutEffect, useRef, useState } from "react";

type YouTubeVideoProps = {
  videoId: string;
  poster: string;
  title: string;
  caption: string;
  ratio: "video" | "portrait-video";
  playLabel: string;
  loadingLabel: string;
};

export default function YouTubeVideo({
  videoId,
  poster,
  title,
  caption,
  ratio,
  playLabel,
  loadingLabel,
}: YouTubeVideoProps) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const landscape = ratio === "video";
  const posterSmall = landscape ? 320 : 240;
  const posterLarge = landscape ? 480 : 405;
  const posterWidth = landscape ? 480 : 405;
  const posterHeight = landscape ? 270 : 720;

  useLayoutEffect(() => {
    if (active) iframeRef.current?.focus();
  }, [active]);

  return (
    <figure className={`youtube-video youtube-video-${ratio}`}>
      <div className="youtube-video-frame">
        {active ? (
          <>
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`}
              title={title}
              loading="lazy"
              tabIndex={0}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                setLoaded(true);
              }}
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
            onClick={() => setActive(true)}
            aria-label={`${playLabel}: ${title}`}
          >
            {/* These pre-cropped local posters intentionally use an explicit srcset;
                no runtime image service is available on the static Pages build. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="youtube-video-poster"
              src={`/media/video/${poster}-${posterLarge}.webp`}
              srcSet={`/media/video/${poster}-${posterSmall}.webp ${posterSmall}w, /media/video/${poster}-${posterLarge}.webp ${posterLarge}w`}
              sizes={landscape ? "(min-width: 48rem) 320px, calc(100vw - 84px)" : "(min-width: 48rem) 340px, calc(100vw - 84px)"}
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
