import type { PlacedBead } from "@/lib/beads";

/** One bead. Beads on the far side of a ring are shaded darker. */
export function Bead({ b }: { b: PlacedBead }) {
  const shade = b.depth < 0 ? Math.min(0.2, -b.depth * 0.2) : 0;
  return (
    <g>
      <circle cx={b.x} cy={b.y} r={b.r} fill={`url(#bead-${b.material})`} />
      {shade > 0 && <circle cx={b.x} cy={b.y} r={b.r} fill="#6b4a12" opacity={shade} />}
    </g>
  );
}
