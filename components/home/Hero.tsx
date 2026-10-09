"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { buttonClass } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { RotatingSeal } from "@/components/ui/Badge";
import { WristScene } from "@/components/beads/WristScene";
import { hasImage } from "@/lib/images";
import type { BraceletSpec } from "@/lib/beads";

const heroStack: BraceletSpec[] = [
  { finish: "gold", size: 4 },
  { finish: "pearl-gold", size: 4 },
  { finish: "gold", size: 6 },
  { finish: "gold", size: 4 },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <section className="relative" aria-labelledby="hero-title">
      <div className="container-site grid items-center gap-10 pb-14 pt-6 sm:pt-10 lg:min-h-[calc(100dvh-108px)] lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-4">
        <div className="lg:col-span-6 xl:col-span-5">
          <motion.h1 id="hero-title" className="display max-w-[15ch] text-[clamp(2.75rem,5.4vw,4.75rem)]" {...rise(0.05)}>
            <span className="warm">Everyday gold,</span> stacked your way.
          </motion.h1>
          <motion.p className="lede mt-6 max-w-[40ch]" {...rise(0.18)}>
            Handmade beaded bracelets by Georgia, from Chapel Hill to High Point. $20 each, or any 3 for $50.
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" {...rise(0.3)}>
            <Link href="/build-your-stack" className={buttonClass("primary")}>
              Build your stack
            </Link>
            <Link href="/shop" className={buttonClass("text")}>
              Shop bracelets
            </Link>
          </motion.div>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <motion.div
            className="relative mx-auto aspect-[4/5] max-h-[calc(100dvh-150px)] w-full overflow-hidden rounded-[var(--radius-card)] bg-oat lg:aspect-auto lg:h-[min(760px,calc(100dvh-150px))]"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            {hasImage("hero.jpg") ? (
              <Photo
                file="hero.jpg"
                alt="A wrist wearing a stack of gold and pearl beaded bracelets with a knit sweater sleeve, in warm morning light"
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-end justify-center bg-[radial-gradient(90%_70%_at_50%_60%,#f7efe2_0%,#ecdfca_60%,#e2d1b6_100%)]">
                <WristScene
                  bracelets={heroStack}
                  intro
                  className="h-[94%] w-auto"
                  title="Illustration: a stack of gold and pearl beaded bracelets on a wrist with a knit sweater sleeve"
                />
              </div>
            )}
          </motion.div>
          <RotatingSeal className="absolute z-[1] -top-5 right-4 size-24 sm:size-28 lg:-left-14 lg:right-auto lg:top-12 lg:size-32" />
        </div>
      </div>
    </section>
  );
}
