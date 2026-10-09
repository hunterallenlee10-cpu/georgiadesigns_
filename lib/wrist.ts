// Geometry for the illustrated forearm in the wrist preview (viewBox 0 0 360 460).

export const W = 360;
export const H = 460;
export const CX = W / 2;
export const BASE_Y = 352;
export const TILT = 0.26;

/** half-width of the forearm at a given y (it tapers toward the wrist) */
export function armHalf(y: number) {
  if (y <= 300) return 76 - (y / 300) * 14; // 76 at the elbow side -> 62 at the wrist
  return 62 + ((y - 300) / 160) * 9; // flare toward the hand
}

export const ARM_PATH = (() => {
  const pts: string[] = [];
  for (let y = 0; y <= H; y += 20) pts.push(`${(CX - armHalf(y)).toFixed(1)},${y}`);
  const right: string[] = [];
  for (let y = H; y >= 0; y -= 20) right.push(`${(CX + armHalf(y)).toFixed(1)},${y}`);
  return `M${pts.join(" L")} L${right.join(" L")} Z`;
})();

