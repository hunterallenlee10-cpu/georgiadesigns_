"use client";

import { motion, useReducedMotion } from "motion/react";
import { stackRings, type BraceletSpec } from "@/lib/beads";
import { Bead } from "./Bead";

/** The product-art stack, with each ring dropping into place when scrolled into view. */
export function AnimatedStack({
  bracelets,
  className,
  title,
}: {
  bracelets: BraceletSpec[];
  className?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  const { rings, shadow, viewBox } = stackRings(bracelets, 0.4);
  const n = rings.length;
  return (
    <motion.svg
      viewBox={viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      <ellipse {...shadow} fill="#5b4822" opacity={0.07} />
      {rings.map((ring, i) => (
        <motion.g
          key={ring.key}
          variants={{ hidden: { y: -90, opacity: 0 }, shown: { y: 0, opacity: 1 } }}
          // the bottom ring lands first
          transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.15 + i * 0.28 }}
        >
          {ring.beads.map((bead, k) => (
            <Bead key={k} b={bead} />
          ))}
        </motion.g>
      ))}
      <desc>{n} bracelets</desc>
    </motion.svg>
  );
}
