import type { ReactNode } from "react";

/**
 * The bubble ring from Georgia's logo: a ring of pearl bubbles framing
 * a round photo. Used once, around the founder photo.
 */
export function BubbleRing({ children, className = "" }: { children: ReactNode; className?: string }) {
  const count = 44;
  const R = 186;
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx={200} cy={200} r={R + 1} fill="var(--color-aqua)" opacity={0.9} />
        {Array.from({ length: count }, (_, i) => {
          const t = (i / count) * Math.PI * 2;
          const r = i % 2 === 0 ? 7.2 : 5.4;
          return (
            <circle
              key={i}
              cx={200 + R * Math.cos(t)}
              cy={200 + R * Math.sin(t)}
              r={r}
              fill="url(#bead-pearl)"
            />
          );
        })}
      </svg>
      <div className="absolute inset-[7.5%] overflow-hidden rounded-full bg-oat">{children}</div>
    </div>
  );
}

/** Line-art bow, for the gifting section. */
export function Bow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden="true">
      <g stroke="var(--color-bow)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 34 C44 14, 18 6, 12 18 C6 30, 30 44, 60 38" fill="rgb(244 182 194 / 0.25)" />
        <path d="M60 34 C76 14, 102 6, 108 18 C114 30, 90 44, 60 38" fill="rgb(244 182 194 / 0.25)" />
        <path d="M56 40 C50 54, 42 66, 34 74" />
        <path d="M64 40 C70 54, 78 66, 86 74" />
        <ellipse cx={60} cy={36} rx={6} ry={6.5} fill="var(--color-bow)" />
      </g>
    </svg>
  );
}
