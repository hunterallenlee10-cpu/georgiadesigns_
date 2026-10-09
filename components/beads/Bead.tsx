import type { PlacedBead } from "@/lib/beads";

/** One bead. Beads on the far side of a ring are shaded darker. */
export function Bead({ b }: { b: PlacedBead }) {
  // one element per bead keeps the DOM light; the far side uses a deeper gradient
  const fill = b.depth < -0.3 ? `url(#bead-${b.material}-back)` : `url(#bead-${b.material})`;
  return <circle cx={+b.x.toFixed(1)} cy={+b.y.toFixed(1)} r={+b.r.toFixed(2)} fill={fill} />;
}
