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
  "hero.jpg": "gold & pearl stack, sweater sleeve, warm light",
  "stack-pearl-mixed.jpg": "gold, silver & pearl stack, grey sleeve",
  "stack-watch.jpg": "gold stack with a vintage gold watch",
  "stack-6mm-gold.jpg": "the chunky 6mm gold stack",
  "stack-4mm-silver.jpg": "the petite 4mm silver stack",
  "flatlay-table.jpg": "bracelets on burlap with GD business cards",
  "handful-pearls.jpg": "a handful of pearl & gold bracelets",
  "plate-gold.jpg": "gold bracelets on a chinoiserie plate",
  "bow-tee.jpg": "three gold bracelets, white tee, pink bow",
  "coffee-1.jpg": "iced latte with the stack",
  "coffee-2.jpg": "iced latte, stack on the wrist",
  "denim-ring.jpg": "hand on denim, gold ring, red nails",
  "gameday-unc.jpg": "the stack with a UNC jersey",
  "disco.jpg": "a colorful stack holding a disco ball",
  "market-table.jpg": "the bazaar table with the aqua GD sign",
  "georgia.jpg": "a portrait of Georgia",
  "archive-1.jpg": "gemstone bracelets on white marble",
  "archive-2.jpg": "wood beads with colorful tassels",
  "archive-3.jpg": "natural stone bracelets on marble",
  "archive-4.jpg": "hand-knotted stone necklace",
};
