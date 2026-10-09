import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { BubbleRing } from "@/components/ui/Ornaments";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { hasImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Georgia started georgia designs in 2016. From gemstones and tassels to 14k gold-plated stacks, here's the story of a handmade jewelry brand from Chapel Hill & High Point, NC.",
  alternates: { canonical: "/about" },
};

// Years come from Georgia's Instagram posts. [CONFIRM WITH GEORGIA: dates]
const timeline = [
  {
    year: "2016",
    title: "georgia designs begins",
    body: "The first Christmas bazaar table and jewelry parties. In her words, an exciting year filled with new beginnings.",
  },
  {
    year: "2017",
    title: "a new look",
    body: "New year, new look: the custom logo, the aqua badge with its ring of pearl bubbles and the GD monogram.",
  },
  {
    year: "2017 to 2022",
    title: "gemstones, wood & tassels",
    body: "Jasper, turquoise, lava stone and tiger's eye bracelets. Wood beads with colorful tassels. Hand-knotted stone necklaces, cowrie shells, chokers and coral. Plus hand-painted angel ornaments to fund a mission trip to Costa Rica.",
    archive: true,
  },
  {
    year: "2021",
    title: "back after a break",
    body: "A summer collection, and back at the bazaar.",
  },
  {
    year: "2023",
    title: "NEW NEW NEW",
    body: "The 14k gold-plated stack collection launches, and pearls join the lineup.",
  },
  {
    year: "2024",
    title: "Jewels of Hope",
    body: "A charity event with Carolina Women in Business at UNC, featuring women-owned jewelry businesses, with proceeds going to the Orange County Rape Crisis Center.",
  },
  {
    year: "now",
    title: "stacks, game days & gifting",
    body: "Made by hand between Chapel Hill and High Point, one stack at a time.",
  },
];

const archive = [
  { file: "archive-1.jpg", alt: "Gemstone bead bracelets on white marble" },
  { file: "archive-2.jpg", alt: "Wood bead bracelets with colorful tassels" },
  { file: "archive-3.jpg", alt: "Natural stone bracelets in blues and browns on marble" },
  { file: "archive-4.jpg", alt: "A hand-knotted stone necklace" },
];

export default function AboutPage() {
  const portrait = hasImage("georgia.jpg") ? "georgia.jpg" : "market-table.jpg";
  return (
    <>
      <PageHeader
        title={
          <>
            Handmade since <span className="warm">2016</span>
          </>
        }
      />

      <section className="container-site grid items-center gap-12 pb-20 md:grid-cols-[1fr_1.1fr] lg:gap-20">
        <BubbleRing className="mx-auto w-full max-w-[420px]">
          <Photo
            file={portrait}
            round
            alt={
              portrait === "georgia.jpg"
                ? "Georgia, the maker behind georgia designs"
                : "The georgia designs market table with the aqua GD sign"
            }
            sizes="(min-width: 768px) 40vw, 90vw"
          />
        </BubbleRing>
        <div className="grid max-w-[56ch] gap-4 text-[1.0625rem] text-ink-soft">
          <p className="font-serif text-[1.9rem] leading-snug text-ink">
            Hi, I&apos;m Georgia. I make every georgia designs bracelet by hand.
          </p>
          <p>
            It started in 2016 with jewelry parties and a table at the Carolina Christmas Bazaar in High Point. Since
            then the beads have changed a lot (gemstones, wood, tassels, shells), but the idea hasn&apos;t: pretty
            things you actually wear every day.
          </p>
          <p>
            These days it&apos;s all about the stack. 14k gold-plated beads that won&apos;t tarnish, silver, and
            pearls, in petite 4mm and chunky 6mm, $20 each or any 3 for $50. I string them between classes at UNC
            Chapel Hill and at home in High Point.
          </p>
          <p>
            And yes, there is an official mascot. Gracie Lou, my golden retriever, is my furry elf assistant. She
            even had puppies once.
          </p>
        </div>
      </section>

      <section className="bg-oat py-20 md:py-28" aria-labelledby="timeline-title">
        <div className="container-site">
          <h2 id="timeline-title" className="h2">
            The story <span className="warm">so far</span>
          </h2>
          <ol className="relative mt-14 grid gap-12 pl-10 sm:pl-14">
            {/* the string */}
            <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-px bg-gold sm:left-[15px]" />
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.04} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute -left-10 top-1 size-6 rounded-full sm:-left-14 sm:size-8 ${
                    i % 3 === 1
                      ? "bg-[radial-gradient(circle_at_35%_30%,#fff,#fbf5ea_40%,#e8dcc6_78%,#b9ab90)]"
                      : "bg-[radial-gradient(circle_at_35%_30%,#fff7da,#edcf7a_28%,#c9a24a_62%,#7a5b1a)]"
                  }`}
                />
                <p className="label text-gold-deep">{t.year}</p>
                <h3 className="mt-1 font-serif text-[1.9rem] leading-tight">{t.title}</h3>
                <p className="mt-2 max-w-[60ch] text-ink-soft">{t.body}</p>
                {t.archive && (
                  <ul className="mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4" aria-label="from the archive">
                    {archive.map((a) => (
                      <li key={a.file} className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-cream">
                        <Photo
                          file={a.file}
                          alt={a.alt}
                          sizes="(min-width: 640px) 20vw, 45vw"
                          tone="stone"
                          fallback={
                            <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(120%_90%_at_50%_35%,#ffffff_0%,#f1efec_70%,#e2ded8_100%)] p-3 text-center">
                              <p className="text-[0.8rem] leading-snug text-ink-soft">{a.alt.toLowerCase()}</p>
                              <p className="mt-1 font-mono text-[0.66rem] text-ink-soft">/images/{a.file}</p>
                            </div>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 text-center md:py-28">
        <div className="container-site flex flex-col items-center">
          <p className="font-script text-[3rem] leading-none">xoxo, georgia</p>
          <p className="lede mt-6 text-center">Thank you for supporting something handmade.</p>
          <ButtonLink href="/build-your-stack" className="mt-8">
            Build your stack
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
