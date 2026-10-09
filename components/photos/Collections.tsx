import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { GeorgiaPhoto } from "@/components/ui/GeorgiaPhoto";
import { collections, photosIn } from "@/lib/photos";
import { site } from "@/data/site";

/**
 * Columns per group size so no row ends with a lone photo:
 * 3 -> 3, 4 -> 4, 5 -> 5, 7 -> 4 with a wide lead photo, 10 -> 5.
 * On phones (2 columns) odd-sized groups get a wide first photo.
 */
function gridFor(n: number) {
  const lgCols: Record<number, string> = { 1: "lg:grid-cols-2", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-3", 7: "lg:grid-cols-4", 8: "lg:grid-cols-4", 9: "lg:grid-cols-3", 10: "lg:grid-cols-5" };
  const leadWideLg = n === 7 || n === 11;
  return { cols: lgCols[n] ?? "lg:grid-cols-4", leadWide: n % 2 === 1, leadWideLg };
}

const tones = {
  cream: { band: "", title: "text-ink" },
  oat: { band: "bg-oat", title: "text-ink" },
  navy: { band: "bg-navy-soft", title: "text-navy" },
} as const;

/**
 * Photo-only collections, grouped by category (no prices: these are looks to
 * ask Georgia about, not catalog items). Groups with no photos are skipped,
 * and the whole section disappears until photos are imported.
 */
export function Collections() {
  const groups = collections.map((c) => ({ ...c, items: photosIn(c.id) })).filter((g) => g.items.length > 0);
  if (!groups.length) return null;

  return (
    <section id="collections" aria-labelledby="collections-title" className="defer-render border-t border-line">
      <div className="container-site pb-6 pt-16 md:pt-24">
        <h2 id="collections-title" className="h2">
          The <span className="warm">collections</span>
        </h2>
        <p className="lede mt-4">
          More of what Georgia makes, beyond the everyday stack. See something you love? Send her a DM to ask about it.
        </p>
        <nav aria-label="collections" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-line bg-paper px-4 text-[0.9rem] hover:border-ink/50"
            >
              {g.title.toLowerCase()}
            </a>
          ))}
        </nav>
      </div>

      {groups.map((g) => {
        const t = tones[g.tone];
        return (
          <div key={g.id} id={g.id} className={`scroll-mt-24 py-12 md:py-16 ${t.band}`}>
            <div className="container-site">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className={`font-serif text-[clamp(1.9rem,3vw,2.5rem)] leading-tight ${t.title}`}>{g.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-ink-soft">{g.blurb}</p>
                </div>
                <a
                  href={site.instagram.dm}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-[0.95rem]"
                >
                  <InstagramLogo size={18} aria-hidden="true" /> <span className="link-underline">ask about these</span>
                </a>
              </div>
              <ul className={`mt-6 grid grid-cols-2 gap-3 sm:gap-4 ${gridFor(g.items.length).cols}`}>
                {g.items.map((p, i) => {
                  const wide = i === 0 && gridFor(g.items.length).leadWide;
                  return (
                    <li
                      key={p.id}
                      className={`relative overflow-hidden rounded-[var(--radius-card)] bg-oat ${
                        wide ? `col-span-2 aspect-[8/5] ${gridFor(g.items.length).leadWideLg ? "" : "lg:col-span-1 lg:aspect-[4/5]"}` : "aspect-[4/5]"
                      }`}
                    >
                      <GeorgiaPhoto
                        photo={p}
                        fill
                        sizes={wide ? "(min-width: 1024px) 48vw, 96vw" : "(min-width: 1024px) 24vw, 48vw"}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}
