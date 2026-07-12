type ResponsivePhotoProps = {
  name: "portrait" | "everyday-smile" | "family-care";
  alt: string;
  caption: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

const widths = [480, 800, 1200] as const;

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
  return (
    <figure className={`portfolio-photo ${className}`.trim()}>
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
            width="1200"
            height="1500"
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
