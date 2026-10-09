// Typed access to Georgia's photos. Everything reads from data/photos.json,
// so swapping a photo, its alt text or where it appears happens in one place.
// A photo only counts as available once `npm run photos` has built its files
// (it then has width/height); until then sections fall back gracefully.

import manifest from "@/data/photos.json";

export type PhotoCategory =
  | "gold-stack"
  | "chinoiserie-stack"
  | "heishi-stack"
  | "stone-stack"
  | "neutral-stack"
  | "necklace"
  | "styled"
  | "ornament";

export interface SitePhoto {
  id: string;
  source: string;
  category: PhotoCategory;
  alt: string;
  reviewed: boolean;
  width: number;
  height: number;
  /** widths actually generated, ascending */
  widths: number[];
}

type RawPhoto = Omit<SitePhoto, "width" | "height"> & { width: number | null; height: number | null };

const all = manifest.photos as RawPhoto[];

/** Photos whose files have been built. */
export const photos: SitePhoto[] = all.filter(
  (p): p is SitePhoto => typeof p.width === "number" && typeof p.height === "number" && p.widths.length > 0,
);

const byId = new Map(photos.map((p) => [p.id, p]));

export function getPhoto(id: string | undefined): SitePhoto | undefined {
  return id ? byId.get(id) : undefined;
}

export function photosIn(category: PhotoCategory): SitePhoto[] {
  return photos.filter((p) => p.category === category);
}

const placements = manifest.placements as {
  hero: string;
  founder: string;
  about: string[];
  holiday: string[];
  instagram: string[];
};

export function placement(name: "hero" | "founder"): SitePhoto | undefined;
export function placement(name: "about" | "holiday" | "instagram"): SitePhoto[];
export function placement(name: keyof typeof placements) {
  const v = placements[name];
  return Array.isArray(v) ? v.map((id) => byId.get(id)).filter((p): p is SitePhoto => Boolean(p)) : byId.get(v);
}

export function photoSrc(p: SitePhoto, width: number, format: "webp" | "avif" = "webp") {
  return `/images/georgia/${p.id}-${width}.${format}`;
}

export function photoSrcSet(p: SitePhoto, format: "webp" | "avif") {
  return p.widths.map((w) => `${photoSrc(p, w, format)} ${w}w`).join(", ");
}

/** The shop's photo-only collections, in display order. */
export const collections: {
  id: PhotoCategory;
  title: string;
  blurb: string;
  tone: "cream" | "navy" | "oat";
}[] = [
  { id: "gold-stack", title: "Gold & silver stacks", blurb: "Gold, silver and pearl, the everyday favorites.", tone: "cream" },
  { id: "chinoiserie-stack", title: "Chinoiserie", blurb: "Blue-and-white beads with a nod to chinoiserie porcelain.", tone: "navy" },
  { id: "heishi-stack", title: "Heishi & clay", blurb: "Colorful heishi and clay beads for a bright stack.", tone: "oat" },
  { id: "stone-stack", title: "Stone & glass", blurb: "Natural stone, geode and glass beads.", tone: "cream" },
  { id: "neutral-stack", title: "Wood & shell", blurb: "Neutral wood, shell and earthy beads.", tone: "oat" },
  { id: "necklace", title: "Necklaces", blurb: "Beaded necklaces and pendants.", tone: "cream" },
];
