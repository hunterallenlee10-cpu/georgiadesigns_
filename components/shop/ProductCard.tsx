"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import type { Product } from "@/data/products";
import { productPrice } from "@/data/products";
import { formatPrice } from "@/lib/pricing";
import { hasImage } from "@/lib/images";
import { Photo } from "@/components/ui/Photo";
import { GeorgiaPhoto } from "@/components/ui/GeorgiaPhoto";
import { getPhoto } from "@/lib/photos";
import { BraceletArt } from "@/components/beads/BraceletArt";
import { WristScene } from "@/components/beads/WristScene";
import { useCart } from "@/components/cart/CartProvider";

/** What each real photo shows, used as its alt text. */
export const photoAlts: Record<string, string> = {
  "plate-gold.jpg": "A pile of 4mm gold beaded bracelets on a blue and white chinoiserie plate",
  "denim-ring.jpg": "A hand with red nails and gold rings wearing a stack of gold beaded bracelets, resting on jeans",
  "stack-stripes.jpg": "A stack of gold and silver beaded bracelets on a wrist, with striped pants and a grey sweater",
  "stack-pink-shirt.jpg": "Pearl and gold beaded bracelets on a wrist with a pink button-down shirt",
  "coffee-1.jpg": "A hand wearing pearl and gold bracelets next to an iced latte in a ribbed glass",
  "bow-tee.jpg": "Three gold beaded bracelets laid on a white tee with a pink bow, next to sneakers",
  "stack-watch.jpg": "A gold watch stacked with gold, silver and pearl beaded bracelets on a white dress",
  "stack-pearl-mixed.jpg": "A stack of gold, silver and pearl beaded bracelets on a wrist with a grey sleeve",
  "stack-watch-denim.jpg": "A gold watch with gold, silver and pearl beaded bracelets on a wrist over jeans",
  "stack-art.jpg": "A hand with navy nails wearing chunky gold and pearl beaded bracelets in front of a painting",
  "stack-watch-floral.jpg": "A gold watch with pearl and gold beaded bracelets on a wrist resting on embroidered white cotton",
};

export function productAlt(p: Product) {
  return `${p.name}: ${p.type === "stack" ? "a stack of three " : ""}handmade beaded bracelet${p.type === "stack" ? "s" : ""}, ${p.short}`;
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add, toast } = useCart();
  const price = productPrice(product);
  const main = product.images[0];
  const hasMain = hasImage(main);
  const original = getPhoto(product.photo);
  const wristOriginal = getPhoto(product.wristPhoto);
  const cardSizes = "(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 75vw";
  const href = `/shop/${product.slug}`;
  // the on-wrist drawing is only built when someone hovers, to keep pages light
  const [showWrist, setShowWrist] = useState(false);

  return (
    <article className="group flex flex-col" onPointerEnter={() => setShowWrist(true)}>
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-oat">
        {/* default view: product photo, or the bracelet drawn from data */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out-soft)] group-hover:opacity-0">
          {original ? (
            <GeorgiaPhoto photo={original} fill sizes={cardSizes} priority={priority} />
          ) : hasMain ? (
            <Photo
              file={main}
              alt={photoAlts[main] ?? productAlt(product)}
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 75vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(110%_80%_at_50%_40%,#fffdf9_0%,#f4ede1_75%)]">
              <BraceletArt bracelets={product.bracelets} className="w-[82%]" title={productAlt(product)} />
            </div>
          )}
        </div>
        {/* hover view: on the wrist */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-[var(--ease-out-soft)] group-hover:opacity-100"
        >
          {wristOriginal ? (
            <GeorgiaPhoto photo={wristOriginal} fill sizes={cardSizes} />
          ) : hasImage(product.wristImage) ? (
            <Photo file={product.wristImage} alt="" sizes="(min-width: 1024px) 24vw, 45vw" />
          ) : (
            <div className="flex h-full items-end justify-center bg-[#efe5d6]">
              {showWrist && <WristScene bracelets={product.bracelets} animate={false} className="h-[96%] w-auto" />}
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[0.98rem] font-medium leading-snug">
            <Link href={href} className="hover:text-gold-deep">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-ink-soft">
            {formatPrice(price)}
            {product.type === "stack" ? " · stack of 3" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            add(
              {
                slug: product.slug,
                name: product.name,
                kind: product.type,
                bracelets: product.bracelets,
                qty: 1,
                wristSize: "standard",
              },
              { open: false },
            );
            toast(`${product.name} added to your stack`);
          }}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/70 transition-colors hover:bg-ink hover:text-cream"
          aria-label={`add ${product.name} to your stack`}
        >
          <Plus size={18} />
        </button>
      </div>
    </article>
  );
}
