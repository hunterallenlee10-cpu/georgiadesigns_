// ─────────────────────────────────────────────────────────────────────────────
// DRAFT CATALOG. [CONFIRM WITH GEORGIA]: every product name, description and
// bead-size assignment below is a suggestion written for the spec site.
// Prices ($20 single / $50 stack of three) come from her posts.
//
// To add a product: copy an entry, give it a unique `slug`, and list the
// bracelets it is made of. Photos go in /public/images and are referenced by
// file name; if a photo is missing the site draws the bracelet instead.
// ─────────────────────────────────────────────────────────────────────────────

import type { BraceletSpec, Finish } from "@/lib/beads";
import { listPrice } from "@/lib/pricing";

export type ProductType = "single" | "stack";
export type MetalFilter = Finish;
export type SizeFilter = "4mm" | "6mm" | "mixed";

export interface Product {
  slug: string;
  name: string;
  type: ProductType;
  /** finish used for filtering */
  metal: MetalFilter;
  size: SizeFilter;
  bracelets: BraceletSpec[];
  /** one line, shown on cards */
  short: string;
  /** a few sentences in Georgia's voice */
  description: string;
  /** photo file names in /public/images, first is the main shot */
  images: string[];
  /** on-wrist photo used for the hover swap */
  wristImage?: string;
  /** lower = earlier in "featured" sort. null = not featured on home */
  featured: number | null;
}

export const products: Product[] = [
  {
    slug: "essential-4mm-gold",
    name: "The Essential: 4mm Gold",
    type: "single",
    metal: "gold",
    size: "4mm",
    bracelets: [{ finish: "gold", size: 4 }],
    short: "small, petite & dainty for everyday",
    description:
      "Small 4mm gold beads, dainty & perfect for everyday. They sit close to the wrist and stack with everything: your watch, your rings, your other favs.",
    images: ["plate-gold.jpg"],
    wristImage: "coffee-1.jpg",
    featured: 1,
  },
  {
    slug: "essential-4mm-silver",
    name: "The Essential: 4mm Silver",
    type: "single",
    metal: "silver",
    size: "4mm",
    bracelets: [{ finish: "silver", size: 4 }],
    short: "the dainty everyday, in silver",
    description:
      "Same petite 4mm strand, in silver. Perfect if you wear silver jewelry or want a little contrast in a gold stack.",
    images: ["stack-4mm-silver.jpg"],
    featured: 5,
  },
  {
    slug: "statement-6mm-gold",
    name: "The Statement: 6mm Gold",
    type: "single",
    metal: "gold",
    size: "6mm",
    bracelets: [{ finish: "gold", size: 6 }],
    short: "chunky gold, a cute & classy statement",
    description:
      "Bigger 6mm gold beads for a chunkier look. Wear it alone with a watch or as the anchor of your stack.",
    images: ["stack-6mm-gold.jpg"],
    wristImage: "stack-watch.jpg",
    featured: 2,
  },
  {
    slug: "statement-6mm-silver",
    name: "The Statement: 6mm Silver",
    type: "single",
    metal: "silver",
    size: "6mm",
    bracelets: [{ finish: "silver", size: 6 }],
    short: "chunky silver for everyday",
    description:
      "The chunky 6mm strand in silver. Bold enough on its own, easy to mix with gold.",
    images: [],
    featured: null,
  },
  {
    slug: "mixed-metals",
    name: "Mixed Metals",
    type: "single",
    metal: "mixed",
    size: "4mm",
    bracelets: [{ finish: "mixed", size: 4 }],
    short: "gold + silver, so you never have to choose",
    description:
      "Gold and silver beads on one strand. It ties a mixed stack together and goes with every ring you own.",
    images: [],
    featured: 6,
  },
  {
    slug: "pearl-and-gold",
    name: "Pearl & Gold",
    type: "single",
    metal: "pearl-gold",
    size: "4mm",
    bracelets: [{ finish: "pearl-gold", size: 4 }],
    short: "pearls tucked between gold beads",
    description:
      "Creamy pearls between little gold beads. A sweet one for game days, brunch, and everything in between.",
    images: ["handful-pearls.jpg"],
    featured: 3,
  },
  {
    slug: "pearl-and-silver",
    name: "Pearl & Silver",
    type: "single",
    metal: "pearl-silver",
    size: "4mm",
    bracelets: [{ finish: "pearl-silver", size: 4 }],
    short: "pearls with bright silver beads",
    description: "Pearls with silver beads. Soft, bright, and so pretty with a silver watch.",
    images: [],
    featured: null,
  },
  {
    slug: "everyday-stack",
    name: "The Everyday Stack",
    type: "stack",
    metal: "gold",
    size: "4mm",
    bracelets: [
      { finish: "gold", size: 4 },
      { finish: "gold", size: 4 },
      { finish: "gold", size: 4 },
    ],
    short: "3 × 4mm gold, so dainty & perfect for everyday",
    description:
      "Three petite 4mm gold strands. So dainty & perfect for everyday, and the easiest way to start an arm party.",
    images: ["stack-watch.jpg"],
    wristImage: "coffee-2.jpg",
    featured: 0,
  },
  {
    slug: "chunky-stack",
    name: "The Chunky Stack",
    type: "stack",
    metal: "gold",
    size: "6mm",
    bracelets: [
      { finish: "gold", size: 6 },
      { finish: "gold", size: 6 },
      { finish: "gold", size: 6 },
    ],
    short: "3 × 6mm gold, a cute & classy statement",
    description:
      "Three chunky 6mm gold strands. A cute & classy statement for everyday, stacked and ready to go.",
    images: ["stack-6mm-gold.jpg"],
    featured: 4,
  },
  {
    slug: "petite-silver-stack",
    name: "The Petite Silver Stack",
    type: "stack",
    metal: "silver",
    size: "4mm",
    bracelets: [
      { finish: "silver", size: 4 },
      { finish: "silver", size: 4 },
      { finish: "silver", size: 4 },
    ],
    short: "3 × 4mm silver",
    description: "Three petite 4mm silver strands for the silver girls. Dainty, bright, everyday.",
    images: ["stack-4mm-silver.jpg"],
    featured: null,
  },
  {
    slug: "mixed-metals-stack",
    name: "The Mixed Metals Stack",
    type: "stack",
    metal: "mixed",
    size: "mixed",
    bracelets: [
      { finish: "gold", size: 6 },
      { finish: "mixed", size: 4 },
      { finish: "silver", size: 4 },
    ],
    short: "gold, silver & a mixed strand",
    description:
      "A chunky gold strand, a mixed metals strand and a petite silver one. Mix & match your favs, already done for you.",
    images: [],
    featured: 7,
  },
  {
    slug: "pearl-party-stack",
    name: "The Pearl Party Stack",
    type: "stack",
    metal: "pearl-gold",
    size: "mixed",
    bracelets: [
      { finish: "pearl-gold", size: 4 },
      { finish: "gold", size: 6 },
      { finish: "gold", size: 4 },
    ],
    short: "pearl & gold with two gold strands",
    description:
      "Pearl & gold, chunky gold and petite gold together. Arm party all day, every day.",
    images: ["stack-pearl-mixed.jpg"],
    featured: null,
  },
];

export function productPrice(p: Product) {
  return listPrice(p.bracelets.length);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function featuredProducts(limit = 8) {
  return products
    .filter((p) => p.featured !== null)
    .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99))
    .slice(0, limit);
}

export const metalFilters: { id: MetalFilter; label: string }[] = [
  { id: "gold", label: "gold" },
  { id: "silver", label: "silver" },
  { id: "mixed", label: "mixed metals" },
  { id: "pearl-gold", label: "pearl & gold" },
  { id: "pearl-silver", label: "pearl & silver" },
];

export const sizeFilters: { id: SizeFilter; label: string }[] = [
  { id: "4mm", label: "4mm" },
  { id: "6mm", label: "6mm" },
  { id: "mixed", label: "mixed sizes" },
];

export const typeFilters: { id: ProductType; label: string }[] = [
  { id: "single", label: "singles" },
  { id: "stack", label: "stacks of 3" },
];

/** Wrist sizes. [CONFIRM WITH GEORGIA]: these measurements are placeholders. */
export const wristSizes = [
  { id: "small", label: "small", detail: '6"' },
  { id: "standard", label: "standard", detail: '6.5"' },
  { id: "large", label: "large", detail: '7"' },
  { id: "custom", label: "custom", detail: "tell me" },
] as const;

export type WristSize = (typeof wristSizes)[number]["id"];
