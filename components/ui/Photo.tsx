import Image from "next/image";
import type { ReactNode } from "react";
import { getImage, photoBriefs } from "@/lib/images";
import { BraceletArt } from "@/components/beads/BraceletArt";
import type { BraceletSpec } from "@/lib/beads";

interface Props {
  file?: string;
  alt: string;
  /** next/image sizes attribute */
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** what to show if the photo hasn't been added yet */
  fallback?: ReactNode;
  /** bracelets to sketch in the default placeholder */
  sketch?: BraceletSpec[];
  /** background mood for the placeholder, hinting at the photo's scene */
  tone?: Tone;
  /** keep the caption inside a round frame */
  round?: boolean;
}

export type Tone = "cream" | "latte" | "denim" | "blush" | "china" | "stone";

const tones: Record<Tone, string> = {
  cream: "bg-[radial-gradient(120%_90%_at_50%_35%,#fffdf9_0%,#f4ede1_70%,#ece2d1_100%)]",
  latte: "bg-[radial-gradient(120%_90%_at_50%_35%,#f6ebdd_0%,#e8d4bb_70%,#dcc3a3_100%)]",
  denim: "bg-[radial-gradient(120%_90%_at_50%_35%,#e9eef4_0%,#c9d5e3_70%,#b3c3d6_100%)]",
  blush: "bg-[radial-gradient(120%_90%_at_50%_35%,#fffaf9_0%,#fbe7ea_70%,#f5d6dc_100%)]",
  china: "bg-[radial-gradient(120%_90%_at_50%_35%,#ffffff_0%,#e8eef8_62%,#cbd8ee_100%)]",
  stone: "bg-[radial-gradient(120%_90%_at_50%_35%,#ffffff_0%,#f1efec_70%,#e2ded8_100%)]",
};

/**
 * A photo from /public/images that fills its (relatively positioned) parent.
 * If the file isn't there yet, renders a styled placeholder that names the
 * file to add, so the layout never breaks.
 */
export function Photo({ file, alt, sizes, priority, className = "", imgClassName = "", fallback, sketch, tone, round }: Props) {
  const entry = getImage(file);
  if (!entry || !file) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        {fallback ?? <PhotoPlaceholder file={file} sketch={sketch} tone={tone} round={round} />}
      </div>
    );
  }
  return (
    <Image
      src={`/images/${file}`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={entry.blur ? "blur" : "empty"}
      blurDataURL={entry.blur}
      className={`object-cover ${className} ${imgClassName}`}
    />
  );
}

const defaultSketch: BraceletSpec[] = [
  { finish: "gold", size: 6 },
  { finish: "pearl-gold", size: 4 },
  { finish: "gold", size: 4 },
];

export function PhotoPlaceholder({
  file,
  sketch,
  tone = "cream",
  round = false,
}: {
  file?: string;
  sketch?: BraceletSpec[];
  tone?: Tone;
  round?: boolean;
}) {
  const brief = file ? photoBriefs[file] : undefined;
  const caption = file && (
    <div className={round ? "mt-3 px-6 text-center" : "absolute inset-x-0 bottom-0 px-4 pb-3 text-center"}>
      {brief && <p className="text-[0.8rem] leading-snug text-ink-soft">{brief}</p>}
      <p className="mt-0.5 font-mono text-[0.68rem] tracking-tight text-ink-soft">/images/{file}</p>
    </div>
  );
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden ${tones[tone]}`}>
      <BraceletArt bracelets={sketch ?? defaultSketch} className={round ? "w-[46%]" : "w-[62%] max-w-[300px]"} />
      {caption}
    </div>
  );
}
