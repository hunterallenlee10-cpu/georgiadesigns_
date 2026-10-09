import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { RotatingSeal } from "@/components/ui/Badge";
import { WristScene } from "@/components/beads/WristScene";
import { hasImage } from "@/lib/images";
import { placement } from "@/lib/photos";
import { GeorgiaPhoto } from "@/components/ui/GeorgiaPhoto";
import type { BraceletSpec } from "@/lib/beads";

const heroStack: BraceletSpec[] = [
  { finish: "gold", size: 4 },
  { finish: "pearl-gold", size: 4 },
  { finish: "gold", size: 6 },
  { finish: "gold", size: 4 },
];

// Entrance runs in CSS (see .rise / .settle in globals.css) so the headline
// paints with the first HTML instead of waiting for JavaScript.
export function Hero() {
  const rise = (delay: number) => ({ style: { animationDelay: `${delay}s` } });
  const heroPhoto = placement("hero");

  return (
    <section className="relative" aria-labelledby="hero-title">
      <div className="container-site grid items-center gap-10 pb-14 pt-6 sm:pt-10 lg:min-h-[calc(100dvh-108px)] lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-4">
        <div className="lg:col-span-6">
          <h1 id="hero-title" className="display rise-slide text-[clamp(2.75rem,4.7vw,4.4rem)]">
            <span className="warm block">Everyday gold,</span> <span className="block">stacked your way.</span>
          </h1>
          <p className="lede rise mt-6 max-w-[40ch]" style={rise(0.12).style}>
            Handmade beaded bracelets by Georgia, from Chapel Hill to High Point. $20 each, or any 3 for $50.
          </p>
          <div className="rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-4" style={rise(0.24).style}>
            <Link href="/build-your-stack" className={buttonClass("primary")}>
              Build your stack
            </Link>
            <Link href="/shop" className={buttonClass("text")}>
              Shop bracelets
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          <div
            className={
              heroPhoto
                ? "settle relative mx-auto w-full overflow-hidden rounded-[var(--radius-card)] bg-oat lg:max-h-[min(760px,calc(100dvh-150px))]"
                : "settle relative mx-auto aspect-[4/5] max-h-[calc(100dvh-150px)] w-full overflow-hidden rounded-[var(--radius-card)] bg-oat lg:aspect-auto lg:h-[min(760px,calc(100dvh-150px))]"
            }
            style={heroPhoto ? { aspectRatio: `${heroPhoto.width} / ${heroPhoto.height}` } : undefined}
          >
            {heroPhoto ? (
              <GeorgiaPhoto photo={heroPhoto} fill priority sizes="(min-width: 1024px) 50vw, 100vw" />
            ) : hasImage("hero.jpg") ? (
              <Photo
                file="hero.jpg"
                alt="A wrist wearing a stack of gold, silver and pearl beaded bracelets, resting on a cream knit sweater and grey jeans"
                sizes="(min-width: 1024px) 55vw, 100vw"
                priority
                imgClassName="object-[50%_22%]"
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
          </div>
          <RotatingSeal className="absolute z-[1] -top-5 right-4 size-24 sm:size-28 lg:-left-14 lg:right-auto lg:top-12 lg:size-32" />
        </div>
      </div>
    </section>
  );
}
