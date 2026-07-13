type ResponsivePhotoProps = {
  name: "portrait" | "everyday-smile" | "family-care";
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
  portrait: { width: 1200, height: 1600 },
  "everyday-smile": { width: 1200, height: 1500 },
  "family-care": { width: 1200, height: 1500 },
};

function srcSet(name: ResponsivePhotoProps["name"], extension: "avif" | "webp") {
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
