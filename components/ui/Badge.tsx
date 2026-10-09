import Image from "next/image";
import logo from "@/public/images/logo.png";
import monogram from "@/public/images/logo-gd.png";

// Georgia's logo is the site's one brand mark. Every file is generated from
// assets/brand/georgia-designs-logo.jpg by scripts/make-icons.mjs; never
// redraw or restyle it.

/** The full logo: aqua tile, pearl necklace, "georgia designs" and the GD monogram. */
export function Logo({
  size = 56,
  className = "",
  priority = false,
  alt = "georgia designs",
}: {
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <Image
      src={logo}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={`shrink-0 rounded-[10px] ${className}`}
    />
  );
}

/** Just the GD monogram from the logo, for spaces too small for the full logo. */
export function LogoMonogram({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src={monogram}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className={`shrink-0 rounded-full ${className}`}
    />
  );
}

/**
 * Slowly rotating seal for the hero corner: circular type around the GD monogram;
 * the rotation stops under reduced motion (globals.css).
 */
export function RotatingSeal({ className = "" }: { className?: string }) {
  const text = "handmade in north carolina ✦ georgia designs ✦ ";
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx={100} cy={100} r={98} fill="var(--color-paper)" />
        <text fontSize={15.5} letterSpacing={2.2} fill="var(--color-ink)" fontFamily="var(--font-sans)">
          <textPath href="#seal-path">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-[26%] flex items-center justify-center">
        <LogoMonogram size={72} className="!h-full !w-full" />
      </div>
    </div>
  );
}
