// Shared bracelet model + geometry. Every bracelet drawn on the site
// (stack builder, product art, wrist preview) comes from these functions.

export type Finish = "gold" | "silver" | "mixed" | "pearl-gold" | "pearl-silver";
export type BeadSize = 4 | 6;
export type BeadMaterial = "gold" | "silver" | "pearl";

export interface BraceletSpec {
  finish: Finish;
  size: BeadSize;
}

export const FINISHES: { id: Finish; label: string; code: string; blurb: string }[] = [
  { id: "gold", label: "gold", code: "g", blurb: "14k gold-plated beads" },
  { id: "silver", label: "silver", code: "s", blurb: "bright silver beads" },
  { id: "mixed", label: "mixed metals", code: "m", blurb: "gold + silver together" },
  { id: "pearl-gold", label: "pearl & gold", code: "pg", blurb: "pearls with gold beads" },
  { id: "pearl-silver", label: "pearl & silver", code: "ps", blurb: "pearls with silver beads" },
];

export const SIZES: { id: BeadSize; label: string; blurb: string }[] = [
  { id: 4, label: "4mm", blurb: "small & petite, dainty for everyday" },
  { id: 6, label: "6mm", blurb: "a chunky, classy statement" },
];

export function finishLabel(f: Finish) {
  return FINISHES.find((x) => x.id === f)?.label ?? f;
}

export function describeBracelet(b: BraceletSpec) {
  return `${b.size}mm ${finishLabel(b.finish)}`;
}

/** Which material each bead in a strand is, for a given finish. */
export function beadPattern(finish: Finish, count: number): BeadMaterial[] {
  return Array.from({ length: count }, (_, i) => {
    switch (finish) {
      case "gold":
        return "gold";
      case "silver":
        return "silver";
      case "mixed":
        return i % 2 === 0 ? "gold" : "silver";
      case "pearl-gold":
        return i % 4 === 0 ? "pearl" : "gold";
      case "pearl-silver":
        return i % 4 === 0 ? "pearl" : "silver";
    }
  });
}

export interface PlacedBead {
  x: number;
  y: number;
  r: number;
  /** -1 (far side of the ring) to 1 (nearest the viewer) */
  depth: number;
  material: BeadMaterial;
}

/**
 * Lay beads out on a circle of radius `radius` seen from slightly above,
 * so it projects to an ellipse with vertical squash `tilt` (0..1).
 * Returned beads are sorted back-to-front for painting.
 */
export function ringBeads(opts: {
  cx: number;
  cy: number;
  radius: number;
  tilt: number;
  beadR: number;
  finish: Finish;
  phase?: number;
}): PlacedBead[] {
  const { cx, cy, radius, tilt, beadR, finish, phase = 0 } = opts;
  const count = Math.max(8, Math.floor((2 * Math.PI * radius) / (beadR * 2.04)));
  const pattern = beadPattern(finish, count);
  const beads = pattern.map((material, i) => {
    const t = (i / count) * Math.PI * 2 + phase;
    const depth = Math.sin(t);
    const pearlBoost = material === "pearl" ? 1.12 : 1;
    return {
      x: cx + radius * Math.cos(t),
      y: cy + radius * tilt * depth,
      r: beadR * pearlBoost * (0.9 + 0.1 * (depth + 1) * 0.5),
      depth,
      material,
    };
  });
  return beads.sort((a, b) => a.depth - b.depth);
}

/** Bead radius (in SVG units) for a size, given a scale for the drawing. */
export function beadRadius(size: BeadSize, scale = 1) {
  return (size === 6 ? 7.4 : 5) * scale;
}

// ---- share codes: "g4.s6.pg4" <-> BraceletSpec[] ----

export function encodeStack(stack: BraceletSpec[]): string {
  return stack
    .map((b) => `${FINISHES.find((f) => f.id === b.finish)?.code ?? "g"}${b.size}`)
    .join(".");
}

export function decodeStack(code: string | null | undefined, max = 9): BraceletSpec[] {
  if (!code) return [];
  const out: BraceletSpec[] = [];
  for (const part of code.split(".")) {
    const m = /^(pg|ps|g|s|m)(4|6)$/.exec(part.trim());
    if (!m) continue;
    const finish = FINISHES.find((f) => f.code === m[1])!.id;
    out.push({ finish, size: Number(m[2]) as BeadSize });
    if (out.length >= max) break;
  }
  return out;
}

/** Layout for a free-standing stack of rings (product art). viewBox 0 0 300 300. */
export function stackRings(bracelets: BraceletSpec[], tilt = 0.4) {
  const n = Math.max(1, bracelets.length);
  const radius = 92;
  const maxBead = Math.max(...bracelets.map((b) => beadRadius(b.size, 1.45)), 7);
  const gap = Math.min(34, maxBead * 2 + 8);
  const stackHeight = (n - 1) * gap;
  const top = 150 - stackHeight / 2;
  const jitter = [0, 7, -5, 4, -6, 3, -3, 6, -4];
  const rings = bracelets.map((b, i) => ({
    key: `${i}-${describeBracelet(b)}`,
    index: i,
    beads: ringBeads({
      cx: 150 + jitter[i % jitter.length],
      cy: top + i * gap,
      radius,
      tilt,
      beadR: beadRadius(b.size, 1.45),
      finish: b.finish,
      phase: i * 0.37,
    }),
  }));
  const all = rings.flatMap((r) => r.beads);
  const pad = 8;
  const minX = Math.min(...all.map((b) => b.x - b.r)) - pad;
  const maxX = Math.max(...all.map((b) => b.x + b.r)) + pad;
  const minY = Math.min(...all.map((b) => b.y - b.r)) - pad;
  const shadowY = top + stackHeight + radius * tilt + 22;
  const maxY = shadowY + 11 + pad;
  return {
    /** viewBox that hugs the drawing */
    viewBox: `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`,
    // paint from the bottom ring up, so higher rings sit in front
    rings: rings.slice().reverse(),
    shadow: { cx: 150, cy: shadowY, rx: radius * 0.95, ry: 11 },
  };
}
