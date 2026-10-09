import manifest from "./image-manifest.json";

export interface ImageEntry {
  width: number;
  height: number;
  blur?: string;
}

const entries = manifest as Record<string, ImageEntry>;

export function getImage(file: string | undefined): ImageEntry | undefined {
  return file ? entries[file] : undefined;
}

export function hasImage(file: string | undefined): boolean {
  return Boolean(file && entries[file]);
}

/** Expected photos and what each should show (used for placeholders + README). */
export const photoBriefs: Record<string, string> = {
  "logo.png": "the round aqua GD badge",
  "georgia.jpg": "a portrait of Georgia",
  "stack-6mm-gold.jpg": "the chunky 6mm gold stack",
  "stack-4mm-silver.jpg": "the petite 4mm silver stack",
  "archive-1.jpg": "gemstone bracelets on white marble",
  "archive-2.jpg": "wood beads with colorful tassels",
  "archive-3.jpg": "natural stone bracelets on marble",
  "archive-4.jpg": "hand-knotted stone necklace",
};
