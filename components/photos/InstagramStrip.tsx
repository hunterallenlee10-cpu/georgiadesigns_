import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { GeorgiaPhoto } from "@/components/ui/GeorgiaPhoto";
import { Photo } from "@/components/ui/Photo";
import { placement } from "@/lib/photos";
import { site } from "@/data/site";
import { NotOnHome } from "./NotOnHome";

// Until the original photos are imported, fall back to the Instagram crops already on the site.
const fallback = [
  { file: "coffee-2.jpg", alt: "Two iced coffees on a wooden cafe table with sunglasses and a striped knit" },
  { file: "stack-watch-floral.jpg", alt: "A gold watch with pearl and gold beaded bracelets on embroidered white cotton" },
  { file: "plate-gold.jpg", alt: "A pile of 4mm gold beaded bracelets on a blue and white chinoiserie plate" },
  { file: "disco.jpg", alt: "A hand holding up a mirrored disco ball, wearing a colorful beaded bracelet stack" },
  { file: "bow-tee.jpg", alt: "Three gold beaded bracelets on a white tee with a pink bow" },
  { file: "stack-art.jpg", alt: "Chunky gold and pearl beaded bracelets on a wrist in front of a painting" },
];

/**
 * A strip of six photos above the footer, linking to @georgiadesigns_.
 * Hidden on the home page, which has its own "styled by you" grid.
 * Photos are stored on this site; nothing is loaded from Instagram.
 */
export function InstagramStrip() {
  const picks = placement("instagram").slice(0, 6);
  return (
    <NotOnHome>
      <section aria-labelledby="ig-strip-title" className="defer-render border-t border-line bg-cream py-12 md:py-16">
        <div className="container-site flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="ig-strip-title" className="font-serif text-[clamp(1.8rem,3vw,2.4rem)] leading-tight">
            Follow along <span className="warm">@{site.instagram.handle}</span>
          </h2>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-ink/80 px-5 text-[0.9rem] transition-colors hover:bg-ink hover:text-cream"
          >
            <InstagramLogo size={18} aria-hidden="true" /> follow on instagram
          </a>
        </div>
        <ul className="container-site mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {(picks.length >= 6 ? picks : fallback).map((item) => {
            const key = "id" in item ? item.id : item.file;
            const label = "id" in item ? item.alt : item.alt;
            return (
              <li key={key}>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${label}. See more on Instagram`}
                  className="group relative block aspect-square overflow-hidden rounded-[10px] bg-oat"
                >
                  <span className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
                    {"id" in item ? (
                      <GeorgiaPhoto photo={item} fill sizes="(min-width: 1024px) 16vw, 32vw" />
                    ) : (
                      <Photo file={item.file} alt={item.alt} sizes="(min-width: 1024px) 16vw, 32vw" />
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </NotOnHome>
  );
}
