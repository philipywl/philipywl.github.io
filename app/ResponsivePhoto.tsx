import type { PortfolioPhotoName } from "./portfolio-copy";

type ResponsivePhotoProps = {
  name: PortfolioPhotoName;
  alt: string;
  caption: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const widths = [480, 800, 1200] as const;

const photoDimensions: Record<
  ResponsivePhotoProps["name"],
  { width: number; height: number }
> = {
  "hero-portrait": { width: 1200, height: 1600 },
  portrait: { width: 1200, height: 1600 },
  "family-care": { width: 1200, height: 1500 },
  "family-main": { width: 1200, height: 800 },
  "family-origin": { width: 1200, height: 1500 },
  "family-playful": { width: 1200, height: 1500 },
  "about-world": { width: 1200, height: 1500 },
  "about-reading": { width: 1200, height: 1200 },
  "about-car": { width: 1200, height: 1200 },
  "about-observing": { width: 1200, height: 900 },
  "story-swimming": { width: 1200, height: 800 },
  "story-animals": { width: 1200, height: 800 },
  "growth-firefighter": { width: 1200, height: 1500 },
  "growth-supported": { width: 1200, height: 1500 },
  "growth-swing": { width: 1200, height: 1500 },
};

function srcSet(name: PortfolioPhotoName, extension: "avif" | "webp") {
  return widths
    .map((width) => `/media/oliver/${name}-${width}.${extension} ${width}w`)
    .join(", ");
}

export default function ResponsivePhoto({
  name,
  alt,
  caption,
  sizes,
  priority = false,
  className = "",
}: ResponsivePhotoProps) {
  const dimensions = photoDimensions[name];

  return (
    <figure
      className={`portfolio-photo portfolio-photo-${name} ${className}`.trim()}
    >
      <div className="portfolio-photo-frame">
        <picture>
          <source
            srcSet={srcSet(name, "avif")}
            sizes={sizes}
            type="image/avif"
          />
          <img
            src={`/media/oliver/${name}-800.webp`}
            srcSet={srcSet(name, "webp")}
            sizes={sizes}
            width={dimensions.width}
            height={dimensions.height}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </picture>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
