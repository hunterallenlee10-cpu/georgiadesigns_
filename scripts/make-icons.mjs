// Renders app/icon.svg to the PNG sizes used by the web manifest and iOS.
// Run once after changing the icon: node scripts/make-icons.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const svg = await readFile(new URL("../app/icon.svg", import.meta.url));
for (const [size, out] of [
  [192, "public/icon-192.png"],
  [512, "public/icon-512.png"],
  [180, "app/apple-icon.png"],
]) {
  await sharp(svg, { density: 600 }).resize(size, size).png().toFile(new URL(`../${out}`, import.meta.url).pathname);
  console.log("wrote", out);
}
