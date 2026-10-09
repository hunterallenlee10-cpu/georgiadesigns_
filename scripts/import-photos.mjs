// Builds Georgia's photos into public/images/georgia/ from the original zip.
//
//   npm run photos -- path/to/georgia-designs-photos.zip
//   npm run photos -- path/to/folder-of-jpegs
//
// - Unzips into the OS temp folder (never inside the repo), so the zip and the
//   full-size originals are never committed.
// - For every entry in data/photos.json it writes AVIF + WebP at 400, 800 and
//   1600px wide (capped at the original width, never upscaled), quality ~80,
//   named by the entry's id: gold-stack-01-800.webp, ornament-02-400.avif, ...
// - Writes each photo's width, height and generated widths back into
//   data/photos.json, which is the single place the site reads photos from.
//
// These photos belong to Georgia Designs and are licensed for this site only.

import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, stat, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifestPath = path.join(root, "data", "photos.json");
const outDir = path.join(root, "public", "images", "georgia");
const WIDTHS = [400, 800, 1600];
const QUALITY = { webp: 80, avif: 60 }; // AVIF's scale runs lower; 60 looks like WebP 80

const input = process.argv[2];
if (!input) {
  console.error("usage: npm run photos -- <georgia-designs-photos.zip | folder>");
  process.exit(1);
}

async function findJpegs(dir) {
  const found = new Map();
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__MACOSX") continue;
      for (const [k, v] of await findJpegs(full)) found.set(k, v);
    } else if (/\.jpe?g$/i.test(entry.name) && !entry.name.startsWith("._")) {
      found.set(entry.name.toLowerCase(), full);
    }
  }
  return found;
}

let workDir = null;
let sourceDir = path.resolve(input);
if ((await stat(sourceDir)).isFile()) {
  workDir = await mkdtemp(path.join(tmpdir(), "georgia-photos-"));
  execFileSync("unzip", ["-q", "-o", sourceDir, "-d", workDir]);
  sourceDir = workDir;
}

try {
  const files = await findJpegs(sourceDir);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  await mkdir(outDir, { recursive: true });

  let made = 0;
  const missing = [];
  for (const photo of manifest.photos) {
    const src = files.get(photo.source.toLowerCase());
    if (!src) {
      missing.push(photo.source);
      continue;
    }
    // apply EXIF rotation so width/height match what people see
    const base = sharp(src).rotate();
    const meta = await base.metadata();
    const rotated = (meta.orientation ?? 1) >= 5;
    const width = rotated ? meta.height : meta.width;
    const height = rotated ? meta.width : meta.height;
    const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];

    for (const w of widths) {
      const resized = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
      await resized.clone().webp({ quality: QUALITY.webp }).toFile(path.join(outDir, `${photo.id}-${w}.webp`));
      await resized.clone().avif({ quality: QUALITY.avif }).toFile(path.join(outDir, `${photo.id}-${w}.avif`));
      made += 2;
    }
    Object.assign(photo, { width, height, widths });
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`[photos] ${made} files written to public/images/georgia/`);
  if (missing.length) console.warn(`[photos] not found in ${input}: ${missing.join(", ")}`);
  const unused = [...files.keys()].filter((f) => !manifest.photos.some((p) => p.source.toLowerCase() === f));
  if (unused.length) console.warn(`[photos] in the zip but not in data/photos.json: ${unused.join(", ")}`);
} finally {
  if (workDir) await rm(workDir, { recursive: true, force: true });
}
