type PreviewMediaProps = {
  label: string;
  detail: string;
  kind?: "photo" | "video";
  ratio?: "landscape" | "portrait" | "wide" | "video" | "portrait-video";
  tone?: "sky" | "honey" | "peach" | "teal";
  playLabel?: string;
  className?: string;
};

export default function PreviewMedia({
  label,
  detail,
  kind = "photo",
  ratio = "landscape",
  tone = "sky",
  playLabel,
  className = "",
}: PreviewMediaProps) {
  const accessibleLabel = kind === "video" && playLabel
    ? `${label}. ${playLabel}`
    : label;

  return (
    <figure
      className={`preview-media preview-media-${ratio} preview-media-${tone} ${className}`.trim()}
    >
      <div
        className="preview-media-surface"
        role="img"
        aria-label={accessibleLabel}
      >
        <span className="preview-media-orbit" aria-hidden="true" />
        {kind === "video" && (
          <span className="preview-play" aria-hidden="true">
            <span />
          </span>
        )}
        <span className="preview-media-label">{label}</span>
      </div>
      <figcaption>{detail}</figcaption>
    </figure>
  );
}
