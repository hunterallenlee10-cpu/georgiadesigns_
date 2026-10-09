import Image from "next/image";
import { getImage } from "@/lib/images";

/**
 * Georgia's round logo badge. We never redraw her logo: if /images/logo.png
 * exists it is used as-is; otherwise a plain type badge stands in and the
 * README flags it. [CONFIRM: logo file]
 */
export function LogoBadge({ size = 44, className = "" }: { size?: number; className?: string }) {
  const logo = getImage("logo.png");
  if (logo) {
    return (
      <Image
        src="/images/logo.png"
        alt="georgia designs"
        width={size}
        height={size}
        className={`rounded-full ${className}`}
        priority
      />
    );
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-aqua font-serif text-ink ring-2 ring-paper ring-offset-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      <span className="-mt-[0.08em] italic">gd</span>
    </span>
  );
}

/**
 * Slowly rotating seal for the hero corner. Circular type around the badge;
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
      <div className="absolute inset-[27%] flex items-center justify-center">
        {getImage("logo.png") ? (
          <LogoBadge size={120} className="!h-full !w-full" />
        ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-aqua font-serif text-[1.6rem] italic text-ink sm:text-[1.9rem]">
            gd
          </span>
        )}
      </div>
    </div>
  );
}
