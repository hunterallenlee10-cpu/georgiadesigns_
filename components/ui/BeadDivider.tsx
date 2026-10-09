"use client";

import { motion, useReducedMotion } from "motion/react";

interface Props {
  className?: string;
  /** number of beads */
  count?: number;
  /** compact = a short centered strand; full = edge to edge */
  variant?: "full" | "compact";
}

/**
 * The bead-row section divider: gold beads with a pearl every few, on a
 * hairline "string" that threads across when it scrolls into view.
 */
export function BeadDivider({ className = "", count, variant = "full" }: Props) {
  const reduce = useReducedMotion();
  const n = count ?? (variant === "compact" ? 13 : 41);
  const spacing = 16;
  const width = (n - 1) * spacing + 24;

  return (
    <div className={`${variant === "full" ? "w-full" : "mx-auto w-fit"} ${className}`} aria-hidden="true">
      <motion.svg
        viewBox={`0 0 ${width} 20`}
        className={variant === "full" ? "h-4 w-full" : "h-4"}
        style={variant === "compact" ? { width: width * 0.8 } : undefined}
        preserveAspectRatio={variant === "full" ? "xMidYMid meet" : undefined}
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.line
          x1={4}
          x2={width - 4}
          y1={10}
          y2={10}
          stroke="var(--color-gold)"
          strokeWidth={0.8}
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {Array.from({ length: n }, (_, i) => {
          const pearl = i % 5 === 2;
          return (
            <motion.circle
              key={i}
              cx={12 + i * spacing}
              cy={10}
              r={pearl ? 5.2 : 4.2}
              fill={pearl ? "url(#bead-pearl)" : "url(#bead-gold)"}
              variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.45, delay: 0.15 + i * (0.9 / n), ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </motion.svg>
    </div>
  );
}
