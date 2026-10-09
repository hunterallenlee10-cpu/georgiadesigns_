import { preload } from "react-dom";
import { photoSrc, photoSrcSet, type SitePhoto } from "@/lib/photos";

interface Props {
  photo: SitePhoto;
  /** the `sizes` attribute: how wide the image renders at each breakpoint */
  sizes: string;
  /** above-the-fold hero only: preloads and loads eagerly */
  priority?: boolean;
  /** fill a positioned parent (object-cover) instead of sizing by aspect ratio */
  fill?: boolean;
  className?: string;
  /** e.g. object position, "object-[50%_30%]" */
  imgClassName?: string;
}

/**
 * Georgia's photos, served from the AVIF/WebP files built by
 * scripts/import-photos.mjs. Width/height are always set (no layout shift),
 * everything lazy-loads unless `priority`, and only priority images preload.
 */
export function GeorgiaPhoto({ photo, sizes, priority = false, fill = false, className = "", imgClassName = "" }: Props) {
  const fallbackWidth = photo.widths.find((w) => w >= 800) ?? photo.widths[photo.widths.length - 1];

  if (priority) {
    // AVIF preload: browsers without AVIF skip it and pick the WebP source as usual
    preload(photoSrc(photo, fallbackWidth, "avif"), {
      as: "image",
      type: "image/avif",
      imageSrcSet: photoSrcSet(photo, "avif"),
      imageSizes: sizes,
      fetchPriority: "high",
    });
  }

  return (
    <picture className={fill ? `absolute inset-0 block ${className}` : `block ${className}`}>
      <source type="image/avif" srcSet={photoSrcSet(photo, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={photoSrcSet(photo, "webp")} sizes={sizes} />
      {/* plain img: the AVIF/WebP variants are pre-built by scripts/import-photos.mjs */}
      <img
        src={photoSrc(photo, fallbackWidth, "webp")}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={fill ? `h-full w-full object-cover ${imgClassName}` : `h-auto w-full ${imgClassName}`}
        style={fill ? undefined : { aspectRatio: `${photo.width} / ${photo.height}` }}
      />
    </picture>
  );
}
