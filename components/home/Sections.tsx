import Link from "next/link";
import { InstagramLogo, ArrowRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Photo, type Tone } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { BubbleRing, Bow } from "@/components/ui/Ornaments";
import { BraceletArt } from "@/components/beads/BraceletArt";
import { AnimatedStack } from "@/components/beads/AnimatedStack";
import { ProductCard } from "@/components/shop/ProductCard";
import { featuredProducts } from "@/data/products";
import { materialClaims } from "@/data/faqs";
import { formatEventDate, splitEvents } from "@/data/events";
import { site } from "@/data/site";
import { hasImage } from "@/lib/images";
import type { BraceletSpec } from "@/lib/beads";
import { getToday } from "@/lib/today";

/* ---------- 3 for $50 ---------- */

const steps = [
  { n: "1", title: "pick your metal", body: "Gold, silver, mixed metals, or pearl." },
  { n: "2", title: "pick your size", body: "Petite 4mm or chunky 6mm. Or both." },
  { n: "3", title: "pick your three", body: "Any three bracelets are $50, so you save $10." },
];

export function ThreeForFifty() {
  return (
    <section className="bg-oat py-20 md:py-28" aria-labelledby="three-title">
      <div className="container-site grid items-center gap-12 md:grid-cols-2 lg:gap-20">
        <div className="relative order-2 mx-auto w-full max-w-[520px] md:order-1">
          <div className="aspect-square rounded-full bg-[radial-gradient(circle_at_50%_45%,#fffdf9_0%,#f8f1e5_55%,transparent_72%)]">
            <AnimatedStack
              bracelets={[
                { finish: "gold", size: 4 },
                { finish: "pearl-gold", size: 4 },
                { finish: "gold", size: 6 },
              ]}
              className="h-full w-full"
              title="Three bracelets stacking: petite gold, pearl and gold, and chunky gold"
            />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 id="three-title" className="h2">
            Any 3 for <span className="warm">$50.</span>
          </h2>
          <p className="lede mt-4">Every bracelet is $20. Pick any three and the stack is $50, mixed however you like.</p>
          <ol className="mt-10 grid gap-7">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.08} className="grid grid-cols-[3.25rem_1fr] items-baseline gap-3">
                <span className="font-serif text-[3.25rem] italic leading-none text-gold" aria-hidden="true">
                  {s.n}
                </span>
                <div className="border-b border-line pb-6">
                  <p className="font-serif text-[1.65rem] leading-tight">{s.title}</p>
                  <p className="mt-1 text-ink-soft">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <ButtonLink href="/build-your-stack" className="mt-10">
            Build your stack
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ---------- shop by finish ---------- */

const finishTiles: { label: string; href: string; file: string; alt: string; sketch: BraceletSpec[] }[] = [
  {
    label: "gold",
    href: "/shop?metal=gold",
    file: "plate-gold.jpg",
    alt: "A pile of gold beaded bracelets on a blue and white chinoiserie plate",
    sketch: [
      { finish: "gold", size: 4 },
      { finish: "gold", size: 6 },
      { finish: "gold", size: 4 },
    ],
  },
  {
    label: "silver",
    href: "/shop?metal=silver",
    file: "stack-4mm-silver.jpg",
    alt: "A petite stack of silver beaded bracelets on a wrist",
    sketch: [
      { finish: "silver", size: 4 },
      { finish: "silver", size: 6 },
      { finish: "silver", size: 4 },
    ],
  },
  {
    label: "mixed metals",
    href: "/shop?metal=mixed",
    file: "stack-pearl-mixed.jpg",
    alt: "A mixed stack of gold, silver and pearl bracelets on a wrist with a grey sleeve",
    sketch: [
      { finish: "gold", size: 6 },
      { finish: "mixed", size: 4 },
      { finish: "silver", size: 4 },
    ],
  },
  {
    label: "pearl",
    href: "/shop?metal=pearl-gold,pearl-silver",
    file: "handful-pearls.jpg",
    alt: "A handful of pearl and gold beaded bracelets on a striped shirt",
    sketch: [
      { finish: "pearl-gold", size: 4 },
      { finish: "pearl-silver", size: 4 },
      { finish: "pearl-gold", size: 6 },
    ],
  },
];

export function ShopByFinish() {
  return (
    <section className="defer-render py-20 md:py-28" aria-labelledby="finish-title">
      <div className="container-site">
        <h2 id="finish-title" className="h2">
          Shop by <span className="warm">finish</span>
        </h2>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {finishTiles.map((t, i) => (
            <Reveal as="li" key={t.label} delay={i * 0.06}>
              <Link href={t.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-oat">
                  <div className="absolute inset-0 transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]">
                    {hasImage(t.file) ? (
                      <Photo file={t.file} alt={t.alt} sizes="(min-width: 1024px) 24vw, 48vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(110%_80%_at_50%_40%,#fffdf9_0%,#efe5d6_80%)]">
                        <BraceletArt bracelets={t.sketch} className="w-[86%]" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-3 flex items-center justify-between font-serif text-[1.6rem] leading-none">
                  {t.label}
                  <ArrowRight
                    size={18}
                    weight="light"
                    className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- the essentials ---------- */

export function Essentials() {
  const items = featuredProducts(8);
  return (
    <section className="defer-render pb-20 md:pb-28" aria-labelledby="essentials-title">
      <div className="container-site">
        <div className="flex items-end justify-between gap-6">
          <h2 id="essentials-title" className="h2">
            The <span className="warm">essentials</span>
          </h2>
          <Link href="/shop" className="link-underline mb-2 shrink-0 text-[0.95rem]">
            shop all
          </Link>
        </div>
      </div>
      {/* mobile: snap row that bleeds to the edge. desktop: 4-up grid */}
      <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:max-w-[1320px] lg:px-10 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible">
        {items.map((p, i) => (
          <li key={p.slug} className="w-[72vw] max-w-[320px] shrink-0 snap-start sm:w-[44vw] lg:w-auto lg:max-w-none">
            <ProductCard product={p} priority={i < 2} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- won't tarnish ---------- */

export function WontTarnish() {
  return (
    <section className="defer-render py-20 md:py-28" aria-labelledby="tarnish-title">
      <div className="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-oat lg:col-span-5">
          <Photo
            file="flatlay-table.jpg"
            alt="Gold and silver beaded bracelets laid out on burlap next to aqua georgia designs business cards"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
        <div className="lg:col-span-7">
          <h2 id="tarnish-title" className="h2 max-w-[14ch]">
            Won&apos;t tarnish, <span className="warm">won&apos;t turn.</span>
          </h2>
          <p className="lede mt-4">Wear them every day. That&apos;s the whole point.</p>
          <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {materialClaims.map((c) => (
              <div key={c.title} className="border-t border-gold/60 pt-5">
                <dt className="font-serif text-[1.55rem] leading-tight">{c.title}</dt>
                <dd className="mt-1.5 text-ink-soft">{c.body}</dd>
              </div>
            ))}
          </dl>
          <Link href="/care" className="link-underline mt-10 inline-block text-[0.95rem]">
            how to care for your stack
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- the feed ---------- */

const feed: { file: string; alt: string; ratio: string; tone: Tone; sketch: BraceletSpec[] }[] = [
  { file: "coffee-1.jpg", alt: "An iced latte held by a hand wearing a gold bracelet stack", ratio: "aspect-[4/5]", tone: "latte", sketch: [{ finish: "gold", size: 4 }, { finish: "gold", size: 4 }] },
  { file: "bow-tee.jpg", alt: "Three gold bracelets on a white tee with a pink bow", ratio: "aspect-[3/4]", tone: "blush", sketch: [{ finish: "gold", size: 6 }, { finish: "gold", size: 4 }, { finish: "gold", size: 6 }] },
  { file: "denim-ring.jpg", alt: "A hand on denim with a gold ring, red nails and a bracelet stack", ratio: "aspect-[3/4]", tone: "denim", sketch: [{ finish: "mixed", size: 4 }, { finish: "gold", size: 6 }] },
  { file: "plate-gold.jpg", alt: "A pile of gold bracelets on a blue and white chinoiserie plate", ratio: "aspect-[4/5]", tone: "china", sketch: [{ finish: "gold", size: 4 }, { finish: "gold", size: 6 }] },
  { file: "stack-watch.jpg", alt: "A gold bracelet stack with a vintage gold watch and pearls", ratio: "aspect-[3/4]", tone: "cream", sketch: [{ finish: "pearl-gold", size: 4 }, { finish: "gold", size: 4 }, { finish: "gold", size: 6 }] },
  { file: "disco.jpg", alt: "A colorful bracelet stack on a hand holding a disco ball", ratio: "aspect-[4/5]", tone: "stone", sketch: [{ finish: "silver", size: 6 }, { finish: "pearl-silver", size: 4 }] },
  { file: "coffee-2.jpg", alt: "An iced latte with a gold and pearl stack on the wrist", ratio: "aspect-[4/5]", tone: "latte", sketch: [{ finish: "pearl-gold", size: 4 }, { finish: "gold", size: 6 }] },
  { file: "handful-pearls.jpg", alt: "A handful of gold and pearl bracelets on a striped shirt", ratio: "aspect-[3/4]", tone: "china", sketch: [{ finish: "pearl-gold", size: 6 }, { finish: "pearl-gold", size: 4 }, { finish: "pearl-silver", size: 4 }] },
];

export function Feed() {
  return (
    <section className="defer-render bg-oat py-20 md:py-28" aria-labelledby="feed-title">
      <div className="container-site">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label text-gold-deep">arm party all day, every day</p>
            <h2 id="feed-title" className="h2 mt-3">
              Styled <span className="warm">by you</span>
            </h2>
          </div>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-ink/80 px-6 text-[0.95rem] transition-colors hover:bg-ink hover:text-cream"
          >
            <InstagramLogo size={18} /> follow @{site.instagram.handle}
          </a>
        </div>
        <ul className="mt-10 columns-2 gap-3 sm:gap-5 lg:columns-4 [&>li]:mb-3 sm:[&>li]:mb-5">
          {feed.map((f) => (
            <li key={f.file} className="break-inside-avoid">
              <div className={`relative ${f.ratio} overflow-hidden rounded-[var(--radius-card)] bg-cream`}>
                <Photo file={f.file} alt={f.alt} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw" sketch={f.sketch} tone={f.tone} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- game day ---------- */

export function GameDay() {
  return (
    <section className="defer-render bg-carolina" aria-labelledby="gameday-title">
      <div className="container-site grid items-center gap-8 py-14 md:grid-cols-[1.1fr_1fr] md:py-0">
        <div className="md:py-20">
          <h2 id="gameday-title" className="h2 text-ink">
            Game day stack, <span className="warm">tar heels edition</span> 🐏
          </h2>
          <p className="mt-4 max-w-[48ch] text-lg text-ink">
            Gold and pearls with your jersey, for kickoff or tip-off. Go heels.
          </p>
          <ButtonLink href="/build-your-stack?s=pg4.g6.s4" variant="primary" className="mt-8">
            Build a game day stack
          </ButtonLink>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] md:my-10">
          <Photo
            file="gameday-unc.jpg"
            alt="A gold and pearl bracelet stack worn with a UNC jersey"
            sizes="(min-width: 768px) 45vw, 100vw"
            tone="china"
            sketch={[
              { finish: "pearl-gold", size: 4 },
              { finish: "gold", size: 6 },
              { finish: "silver", size: 4 },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- gifting ---------- */

export function Gifting() {
  return (
    <section className="defer-render py-20 md:py-28" aria-labelledby="gift-title">
      <div className="container-site flex flex-col items-center text-center">
        <Bow className="w-24" />
        <h2 id="gift-title" className="h2 mt-6 max-w-[20ch]">
          The perfect stocking stuffer, best-friend gift, or <span className="warm">mother&apos;s day stack.</span>
        </h2>
        <p className="lede mt-5 text-center">
          Add a gift note when you build it. We can meet up in Chapel Hill or High Point, or Georgia will ship it to you.
        </p>
        <ButtonLink href="/build-your-stack?gift=1" className="mt-9">
          Build a gift stack
        </ButtonLink>
      </div>
    </section>
  );
}

/* ---------- founder note ---------- */

export function FounderNote() {
  const portrait = hasImage("georgia.jpg") ? "georgia.jpg" : "market-table.jpg";
  return (
    <section className="defer-render bg-oat py-20 md:py-28" aria-labelledby="founder-title">
      <div className="container-site grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <BubbleRing className="mx-auto w-full max-w-[440px]">
          <Photo
            file={portrait}
            alt={
              portrait === "georgia.jpg"
                ? "Georgia, the maker behind georgia designs"
                : "The georgia designs table at the Carolina Christmas Bazaar with the aqua GD sign"
            }
            sizes="(min-width: 768px) 40vw, 90vw"
            round
          />
        </BubbleRing>
        <div>
          <h2 id="founder-title" className="h2">
            Hi, I&apos;m <span className="warm">Georgia.</span>
          </h2>
          <div className="mt-6 grid max-w-[54ch] gap-4 text-[1.0625rem] text-ink-soft">
            <p>
              I started georgia designs in 2016 with jewelry parties and a table at the Christmas bazaar in High Point.
              A year later I got my very own logo, and I still love it.
            </p>
            <p>
              Now I make every stack by hand, juggling classes at UNC with stringing beads. My golden retriever Gracie
              Lou keeps me company as my furry assistant and official mascot.
            </p>
            <p>Thank you for being here and for supporting something handmade.</p>
          </div>
          <p className="mt-6 font-script text-[2.6rem] leading-none text-ink" aria-label="xoxo, georgia">
            xoxo, georgia
          </p>
          <Link href="/about" className="link-underline mt-8 inline-block text-[0.95rem]">
            read our story
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- giving back + next event ---------- */

export async function CommunityRow() {
  const today = await getToday();
  const next = splitEvents(today).upcoming[0];
  return (
    <section className="defer-render py-20 md:py-28" aria-label="community">
      <div className="container-site grid gap-5 md:grid-cols-2">
        <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-paper p-7 sm:p-10">
          <h2 className="h3">Giving back</h2>
          <p className="mt-4 max-w-[48ch] text-ink-soft">
            In 2024 georgia designs joined Jewels of Hope with Carolina Women in Business at UNC, an event featuring
            women-owned jewelry businesses. Proceeds went to the Orange County Rape Crisis Center.
          </p>
        </div>

        <div className="flex flex-col rounded-[var(--radius-card)] border border-line bg-paper p-7 sm:p-10">
          <h2 className="h3">Find us at the next market</h2>
          {next ? (
            <div className="mt-5 flex gap-5">
              <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-full bg-oat text-center">
                {next.date ? (
                  <>
                    <span className="label text-ink-soft">
                      {new Date(`${next.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="font-serif text-3xl leading-none">{Number(next.date.slice(8, 10))}</span>
                  </>
                ) : (
                  <span className="font-serif text-xl italic leading-none">soon</span>
                )}
              </div>
              <div>
                <p className="font-medium">{next.name}</p>
                <p className="text-ink-soft">{formatEventDate(next)}</p>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-ink-soft">
                  <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {next.venue}, {next.city}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-ink-soft">next market coming soon. follow @{site.instagram.handle} for dates.</p>
          )}
          <Link href="/events" className="link-underline mt-auto w-fit pt-6 text-[0.95rem]">
            all markets & events
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- wholesale teaser ---------- */

export function WholesaleTeaser() {
  return (
    <section className="defer-render pb-20 md:pb-28" aria-labelledby="wholesale-title">
      <div className="container-site">
        <Link
          href="/wholesale"
          className="group flex flex-col gap-4 border-y border-line py-10 sm:flex-row sm:items-center sm:justify-between"
        >
          <h2 id="wholesale-title" className="font-serif text-[clamp(1.9rem,3.6vw,2.9rem)] leading-tight">
            Carry georgia designs <span className="warm">in your boutique.</span>
          </h2>
          <span className="inline-flex items-center gap-2 text-[0.95rem]">
            <span className="link-underline">wholesale inquiries</span>
            <ArrowRight size={18} weight="light" className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}
