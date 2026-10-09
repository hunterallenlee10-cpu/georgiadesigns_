// Scans public/images and writes lib/image-manifest.json with each photo's
// size and a tiny blurred preview. Runs automatically before `dev` and `build`.
// The site checks this manifest to decide whether to show a real photo or a
// styled placeholder, so dropping a correctly named file into public/images
// is all it takes to swap a photo in.

import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dir = path.join(root, "public", "images");
const out = path.join(root, "lib", "image-manifest.json");
const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("[images] sharp not available; skipping blur previews");
}

let files = [];
try {
  files = (await readdir(dir)).filter((f) => exts.has(path.extname(f).toLowerCase()));
} catch {
  // no images folder yet
}

const manifest = {};
for (const file of files.sort()) {
  const full = path.join(dir, file);
  const entry = { width: 1200, height: 1500 };
  if (sharp && !file.endsWith(".svg")) {
    try {
      const img = sharp(full);
      const meta = await img.metadata();
      entry.width = meta.width ?? entry.width;
      entry.height = meta.height ?? entry.height;
      const buf = await img.resize(12).blur().webp({ quality: 40 }).toBuffer();
      entry.blur = `data:image/webp;base64,${buf.toString("base64")}`;
    } catch (err) {
      console.warn(`[images] could not read ${file}: ${err.message}`);
    }
  }
  manifest[file] = entry;
}

await writeFile(out, JSON.stringify(manifest, null, 2) + "\n");
console.log(`[images] ${Object.keys(manifest).length} photo(s) found in public/images`);
