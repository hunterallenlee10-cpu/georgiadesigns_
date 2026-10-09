import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "georgia designs: everyday gold, stacked your way. Handmade beaded bracelets, $20 each or any 3 for $50.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GOLD = "radial-gradient(circle at 35% 30%, #fff7da 0%, #edcf7a 28%, #c9a24a 62%, #7a5b1a 100%)";
const PEARL = "radial-gradient(circle at 36% 32%, #ffffff 0%, #fbf5ea 40%, #e8dcc6 78%, #b9ab90 100%)";

export default async function OgImage() {
  const [serif, serifItalic, sans] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-Medium.ttf")),
    readFile(join(process.cwd(), "assets/fonts/CormorantGaramond-MediumItalic.ttf")),
    readFile(join(process.cwd(), "assets/fonts/DMSans-Regular.ttf")),
  ]);

  // a ring of beads drawn with absolutely positioned circles
  const beads = Array.from({ length: 30 }, (_, i) => {
    const t = (i / 30) * Math.PI * 2;
    const pearl = i % 4 === 0;
    const r = pearl ? 30 : 26;
    return { x: 190 + 160 * Math.cos(t) - r, y: 190 + 160 * Math.sin(t) - r, r, pearl };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FBF7F0",
          padding: "70px 80px",
          fontFamily: "DM Sans",
          color: "#1B1B1B",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "#4FC3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cormorant Italic",
                fontSize: 30,
              }}
            >
              gd
            </div>
            <div style={{ fontFamily: "Cormorant Italic", fontSize: 44 }}>georgia designs</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Cormorant Italic", fontSize: 92, lineHeight: 1 }}>Everyday gold,</div>
            <div style={{ fontFamily: "Cormorant", fontSize: 92, lineHeight: 1.05 }}>stacked your way.</div>
          </div>
          <div style={{ fontSize: 28, color: "#5A534A" }}>
            handmade beaded bracelets · $20 each or any 3 for $50
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 380 }}>
          <div style={{ position: "relative", width: 380, height: 380, display: "flex" }}>
            {beads.map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: b.x,
                  top: b.y,
                  width: b.r * 2,
                  height: b.r * 2,
                  borderRadius: 999,
                  backgroundImage: b.pearl ? PEARL : GOLD,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, style: "normal", weight: 500 },
        { name: "Cormorant Italic", data: serifItalic, style: "italic", weight: 500 },
        { name: "DM Sans", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
