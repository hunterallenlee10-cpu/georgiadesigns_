"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { beadRadius, describeBracelet, ringBeads, type BraceletSpec } from "@/lib/beads";
import { Bead } from "./Bead";

interface Props {
  bracelets: BraceletSpec[];
  className?: string;
  title?: string;
  /** spring bracelets onto the wrist when they are added */
  animate?: boolean;
  /** show the knit sweater cuff */
  cuff?: boolean;
  /** drop the starting bracelets in one by one on first load */
  intro?: boolean;
  /** stable ids per bracelet, so swapping one only re-drops that one */
  ids?: string[];
}

import { ARM_PATH, BASE_Y, CX, H, TILT, W, armHalf } from "@/lib/wrist";

function layout(bracelets: BraceletSpec[], ids?: string[]) {
  let y = BASE_Y;
  return bracelets.map((b, i) => {
    const beadR = beadRadius(b.size, 1.25);
    if (i > 0) {
      const prev = beadRadius(bracelets[i - 1].size, 1.25);
      y -= prev + beadR + 2;
    }
    const radius = armHalf(y) + beadR * 0.75;
    const beads = ringBeads({ cx: CX, cy: y, radius, tilt: TILT, beadR, finish: b.finish, phase: i * 0.41 });
    return {
      key: `${ids?.[i] ?? i}-${describeBracelet(b)}`,
      y,
      radius,
      beadR,
      back: beads.filter((bd) => bd.depth < -0.08),
      front: beads.filter((bd) => bd.depth >= -0.08),
    };
  });
}

export function WristScene({ bracelets, className, title, animate = true, cuff = true, intro = false, ids }: Props) {
  const reduce = useReducedMotion();
  const rings = layout(bracelets, ids);
  const springy = animate && !reduce;

  const enter = springy ? { y: -260, opacity: 0 } : false;
  const transition = (i: number) => ({
    type: "spring" as const,
    stiffness: 210,
    damping: 17,
    mass: 0.9,
    delay: intro ? 0.45 + i * 0.22 : 0,
  });
  const exit = springy ? { y: -60, opacity: 0, transition: { duration: 0.25 } } : { opacity: 0 };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title ?? undefined}
    >
      {title && <title>{title}</title>}

      {/* far side of each bracelet, hidden behind the arm except at the edges */}
      <AnimatePresence initial={intro}>
        {rings.map((r, i) => (
          <motion.g key={`back-${r.key}`} initial={enter} animate={{ y: 0, opacity: 1 }} exit={exit} transition={transition(i)}>
            {r.back.map((b, k) => (
              <Bead key={k} b={b} />
            ))}
          </motion.g>
        ))}
      </AnimatePresence>

      {/* forearm */}
      <path d={ARM_PATH} fill="url(#arm-skin)" mask="url(#arm-mask)" />

      {cuff && (
        <g>
          <rect x={CX - 80} y={92} width={160} height={70} fill="url(#cuff-shadow)" clipPath="url(#arm-clip)" />
          <path
            d={`M${CX - 98},0 L${CX + 98},0 L${CX + 98},92 Q${CX},${122} ${CX - 98},92 Z`}
            fill="url(#knit)"
          />
          {Array.from({ length: 21 }, (_, i) => {
            const x = CX - 90 + i * 9;
            const bottom = 92 + 26 * (1 - ((x - CX) / 98) ** 2);
            return (
              <line key={i} x1={x} x2={x} y1={4} y2={bottom - 3} stroke="#D6C7AC" strokeWidth={1.4} opacity={0.75} />
            );
          })}
          <path
            d={`M${CX - 98},92 Q${CX},${122} ${CX + 98},92`}
            fill="none"
            stroke="#D2C2A5"
            strokeWidth={2}
          />
        </g>
      )}

      {/* near side of each bracelet, with a soft contact shadow on the skin */}
      <AnimatePresence initial={intro}>
        {rings.map((r, i) => (
          <motion.g key={`front-${r.key}`} initial={enter} animate={{ y: 0, opacity: 1 }} exit={exit} transition={transition(i)}>
            <path
              d={`M${CX - r.radius},${r.y + r.beadR * 0.7} A${r.radius} ${r.radius * TILT} 0 0 0 ${CX + r.radius},${r.y + r.beadR * 0.7}`}
              fill="none"
              stroke="#A97F5E"
              strokeWidth={r.beadR * 1.1}
              strokeLinecap="round"
              opacity={0.18}
            />
            {r.front.map((b, k) => (
              <Bead key={k} b={b} />
            ))}
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>
  );
}
