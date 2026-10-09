import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { GeorgiaPhoto } from "@/components/ui/GeorgiaPhoto";
import { placement } from "@/lib/photos";
import { site } from "@/data/site";

/**
 * Holiday banner with Georgia's hand-painted ornaments. Only renders once
 * the ornament photos are imported. Copy sticks to what she has posted.
 */
export function HolidayOrnaments() {
  const items = placement("holiday");
  if (!items.length) return null;
  return (
    <section aria-labelledby="holiday-title" className="defer-render border-t border-line py-20 md:py-28">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 id="holiday-title" className="h2">
            Hand-painted <span className="warm">for the holidays</span>
          </h2>
          <p className="lede mt-4">
            Georgia hand-paints holiday angel ornaments, and has sold them to help fund a mission trip to Costa Rica.
            Send her a DM to ask about ornaments this season.
          </p>
          <a
            href={site.instagram.dm}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-7 text-cream transition-colors hover:bg-[#3a352e]"
          >
            <InstagramLogo size={18} aria-hidden="true" /> DM about ornaments
          </a>
        </div>
        <ul className={`grid gap-3 sm:gap-4 ${items.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {items.slice(0, 3).map((p, i) => (
            <li
              key={p.id}
              className={`relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-cream ${i === 1 ? "sm:translate-y-8" : ""}`}
            >
              <GeorgiaPhoto photo={p} fill sizes="(min-width: 1024px) 18vw, 32vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
