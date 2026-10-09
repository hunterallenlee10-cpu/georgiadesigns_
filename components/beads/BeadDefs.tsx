import { ARM_PATH } from "@/lib/wrist";

// One hidden SVG with the bead gradients, mounted once in the root layout.
// Every bracelet drawing references these by id. (Keeping a single copy that
// is never display:none avoids Chrome's "gradient inside hidden svg" bug.)

export function BeadDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <radialGradient id="bead-gold" cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFF7DA" />
          <stop offset="28%" stopColor="#EDCF7A" />
          <stop offset="62%" stopColor="#C9A24A" />
          <stop offset="100%" stopColor="#7A5B1A" />
        </radialGradient>
        <radialGradient id="bead-silver" cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E6E8EB" />
          <stop offset="66%" stopColor="#AEB4BC" />
          <stop offset="100%" stopColor="#5F666F" />
        </radialGradient>
        <radialGradient id="bead-pearl" cx="36%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FBF5EA" />
          <stop offset="78%" stopColor="#E8DCC6" />
          <stop offset="100%" stopColor="#B9AB90" />
        </radialGradient>
        <linearGradient id="arm-skin" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#D7B497" />
          <stop offset="22%" stopColor="#EACFB7" />
          <stop offset="55%" stopColor="#F1DCC8" />
          <stop offset="85%" stopColor="#E3C3A7" />
          <stop offset="100%" stopColor="#CFAB8D" />
        </linearGradient>
        <linearGradient id="arm-fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="78%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="arm-mask" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#arm-fade)" />
        </mask>
        <clipPath id="arm-clip">
          <path d={ARM_PATH} />
        </clipPath>
        <linearGradient id="cuff-shadow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8a6446" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#8a6446" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="knit" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#E4D8C4" />
          <stop offset="50%" stopColor="#F3ECDF" />
          <stop offset="100%" stopColor="#E1D4BE" />
        </linearGradient>
      </defs>
    </svg>
  );
}
