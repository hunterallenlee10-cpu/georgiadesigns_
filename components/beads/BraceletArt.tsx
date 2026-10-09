import { stackRings, type BraceletSpec } from "@/lib/beads";
import { Bead } from "./Bead";

interface Props {
  bracelets: BraceletSpec[];
  className?: string;
  /** accessible description; omit to hide from screen readers */
  title?: string;
  /** vertical squash of each ring, 0..1 */
  tilt?: number;
}

/**
 * Bracelets standing in a loose stack, seen from slightly above.
 * Pure SVG, server-renderable. Gradients come from <BeadDefs />.
 */
export function BraceletArt({ bracelets, className, title, tilt = 0.4 }: Props) {
  const { rings, shadow, viewBox } = stackRings(bracelets, tilt);
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
    >
      {title && <title>{title}</title>}
      <ellipse {...shadow} fill="#5b4822" opacity={0.07} />
      {rings.map((ring) => (
        <g key={ring.key}>
          {ring.beads.map((bead, k) => (
            <Bead key={k} b={bead} />
          ))}
        </g>
      ))}
    </svg>
  );
}
