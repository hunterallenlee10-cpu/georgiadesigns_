// Builds every logo and icon file from Georgia's logo, so the brand mark is
// never redrawn. Run after replacing assets/brand/georgia-designs-logo.jpg:
//   node scripts/make-icons.mjs
//
// Outputs
//   public/images/logo.png      full logo, square (header, footer, share image)
//   public/images/logo-gd.png   just the GD monogram disc, transparent corners
//   app/icon.png                browser-tab icon (the GD monogram; the full
//                               logo is unreadable at 16-32px)
//   app/apple-icon.png          iOS home screen (full logo)
//   public/icon-192.png, public/icon-512.png   web app manifest (full logo)

import sharp from "sharp";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = path.join(root, "assets/brand/georgia-designs-logo.jpg");
const out = (p) => path.join(root, p);

// The source is 640x635 with a flat aqua background; trim to a centered square.
const meta = await sharp(src).metadata();
const side = Math.min(meta.width, meta.height);
const square = await sharp(src)
  .extract({
    left: Math.floor((meta.width - side) / 2),
    top: Math.floor((meta.height - side) / 2),
    width: side,
    height: side,
  })
  .toBuffer();

await sharp(square).png({ compressionLevel: 9 }).toFile(out("public/images/logo.png"));
for (const [size, file] of [
  [180, "app/apple-icon.png"],
  [192, "public/icon-192.png"],
  [512, "public/icon-512.png"],
]) {
  await sharp(square).resize(size, size, { kernel: "lanczos3" }).png().toFile(out(file));
}

// GD monogram: the cream disc behind the black GD ring, measured from the
// source (black ring spans x 305-456, y 455-606, so center 380.5,530.5).
const xOffset = Math.floor((meta.width - side) / 2);
const cx = 380.5 - xOffset;
const cy = 530.5 - Math.floor((meta.height - side) / 2);
const r = 84; // ring radius 75.5 plus a little of the cream around it
const box = Math.round(r * 2);
const left = Math.round(cx - r);
const top = Math.round(cy - r);
const mask = Buffer.from(
  `<svg width="${box}" height="${box}"><circle cx="${box / 2}" cy="${box / 2}" r="${box / 2}" fill="#fff"/></svg>`,
);
const disc = await sharp(square)
  .extract({ left, top, width: box, height: box })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

await sharp(disc).resize(256, 256).png().toFile(out("public/images/logo-gd.png"));
await sharp(disc).resize(96, 96, { kernel: "lanczos3" }).png().toFile(out("app/icon.png"));

console.log("[icons] logo files written");
