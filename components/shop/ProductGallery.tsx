"use client";

import { useState, type MouseEvent } from "react";
import type { Product } from "@/data/products";
import { hasImage } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { GeorgiaPhoto } from "@/components/ui/GeorgiaPhoto";
import { getPhoto, type SitePhoto } from "@/lib/photos";
import { BraceletArt } from "@/components/beads/BraceletArt";
import { WristScene } from "@/components/beads/WristScene";
import { photoAlts, productAlt } from "./ProductCard";

type Slide =
  | { kind: "original"; photo: SitePhoto }
  | { kind: "photo"; file: string; alt: string }
  | { kind: "art" }
  | { kind: "wrist" };

export function ProductGallery({ product }: { product: Product }) {
  const original = getPhoto(product.photo);
  const wristOriginal = getPhoto(product.wristPhoto);
  // originals first; the older screenshot crops only fill in where there is no original
  const screenshots = [...(original ? [] : product.images), ...(wristOriginal ? [] : product.wristImage ? [product.wristImage] : [])].filter(hasImage);
  const slides: Slide[] = [
    ...(original ? [{ kind: "original" as const, photo: original }] : []),
    ...screenshots.map((file, i) => ({
      kind: "photo" as const,
      file,
      alt: photoAlts[file] ?? (i === 0 ? productAlt(product) : `${product.name} worn on the wrist`),
    })),
    ...(wristOriginal ? [{ kind: "original" as const, photo: wristOriginal }] : []),
    // the drawing shows the exact beads; the drawn wrist only fills in when there are no photos
    { kind: "art" as const },
    ...(original || wristOriginal || screenshots.length ? [] : [{ kind: "wrist" as const }]),
  ];
  const [active, setActive] = useState(0);

  const zoom = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const render = (s: Slide, priority = false) =>
    s.kind === "original" ? (
      <GeorgiaPhoto photo={s.photo} fill priority={priority} sizes="(min-width: 1024px) 50vw, 90vw" />
    ) : s.kind === "photo" ? (
      <Photo file={s.file} alt={s.alt} sizes="(min-width: 1024px) 50vw, 100vw" priority={priority} />
    ) : s.kind === "art" ? (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(110%_80%_at_50%_40%,#fffdf9_0%,#f1e8da_80%)]">
        <BraceletArt
          bracelets={product.bracelets}
          className="w-[78%]"
          title={`Drawing of ${product.name}: ${product.short}`}
        />
      </div>
    ) : (
      <div className="flex h-full items-end justify-center bg-[radial-gradient(90%_70%_at_50%_60%,#f7efe2_0%,#ecdfca_60%,#e2d1b6_100%)]">
        <WristScene bracelets={product.bracelets} title={`${product.name} shown on a wrist`} animate={false} className="h-[94%] w-auto" />
      </div>
    );

  return (
    <div>
      {/* mobile: swipe */}
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden" aria-label="product images">
        {slides.map((s, i) => (
          <li key={i} className="relative aspect-[4/5] w-[86%] shrink-0 snap-center sm:w-[58%] overflow-hidden rounded-[var(--radius-card)] bg-oat">
            {render(s, i === 0)}
          </li>
        ))}
      </ul>

      {/* desktop: main + thumbnails, hover to zoom */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[84px_1fr]">
        <div className="flex flex-col gap-3" role="tablist" aria-label="product images">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`image ${i + 1} of ${slides.length}`}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/5] overflow-hidden rounded-[10px] border-2 transition-colors ${
                i === active ? "border-ink" : "border-transparent hover:border-line"
              }`}
            >
              <span className="pointer-events-none absolute inset-0">{render(s)}</span>
            </button>
          ))}
        </div>
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[var(--radius-card)] bg-oat"
          onMouseMove={zoom}
          role="tabpanel"
        >
          <div className="absolute inset-0 transition-transform duration-300 ease-out [transform-origin:var(--zx,50%)_var(--zy,50%)] group-hover:scale-[1.7]">
            {render(slides[active], true)}
          </div>
        </div>
      </div>
    </div>
  );
}
