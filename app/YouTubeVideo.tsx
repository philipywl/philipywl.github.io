"use client";

import { useLayoutEffect, useRef, useState } from "react";

type YouTubeVideoProps = {
  videoId: string;
  title: string;
  caption: string;
  ratio: "video" | "portrait-video";
  playLabel: string;
  loadingLabel: string;
  openLabel: string;
};

export default function YouTubeVideo({
  videoId,
  title,
  caption,
  ratio,
  playLabel,
  loadingLabel,
  openLabel,
}: YouTubeVideoProps) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

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
            <span className="youtube-video-orbit" aria-hidden="true" />
            <span className="youtube-video-play" aria-hidden="true" />
            <span className="youtube-video-trigger-label">{playLabel}</span>
          </button>
        )}
      </div>
      <figcaption>
        <span>{caption}</span>
        <a href={watchUrl} target="_blank" rel="noopener noreferrer">
          {openLabel}
        </a>
      </figcaption>
    </figure>
  );
}
