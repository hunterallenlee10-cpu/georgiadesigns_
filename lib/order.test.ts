import { describe, expect, it } from "vitest";
import { formatOrderText, priceCart, type CartLine } from "./order";
import { decodeStack, encodeStack } from "./beads";
import { splitEvents, type SiteEvent } from "@/data/events";

const single: CartLine = {
  id: "a",
  slug: "essential-4mm-gold",
  name: "The Essential: 4mm Gold",
  kind: "single",
  bracelets: [{ finish: "gold", size: 4 }],
  qty: 2,
  wristSize: "standard",
};
const stack: CartLine = {
  id: "b",
  slug: "custom-stack",
  name: "Custom stack",
  kind: "custom",
  bracelets: [
    { finish: "pearl-gold", size: 4 },
    { finish: "silver", size: 6 },
  ],
  qty: 1,
  wristSize: "custom",
  customSize: '6.25"',
  gift: true,
  giftNote: "happy birthday!",
};

describe("cart pricing", () => {
  it("bundles across lines", () => {
    expect(priceCart([single, stack]).subtotal).toBe(70); // 4 bracelets
  });
});

describe("formatOrderText", () => {
  it("includes items, sizes, gift note, total and delivery", () => {
    const text = formatOrderText([single, stack], {
      name: "Mary Kate",
      contact: "mk@example.com",
      instagram: "@mk",
      delivery: "ship",
      address: "1 Franklin St, Chapel Hill",
    });
    expect(text).toContain("The Essential: 4mm Gold × 2");
    expect(text).toContain("4mm pearl & gold + 6mm silver");
    expect(text).toContain('custom (6.25")');
    expect(text).toContain('note: "happy birthday!"');
    expect(text).toContain("4 bracelets: $70 (3 for $50 applied, saving $10)");
    expect(text).toContain("instagram: @mk");
    expect(text).toContain("ship to: 1 Franklin St, Chapel Hill");
  });
});

describe("stack share codes", () => {
  it("round-trips", () => {
    const s = [
      { finish: "gold", size: 4 },
      { finish: "pearl-silver", size: 6 },
      { finish: "mixed", size: 4 },
    ] as const;
    expect(encodeStack([...s])).toBe("g4.ps6.m4");
    expect(decodeStack("g4.ps6.m4")).toEqual(s);
  });
  it("drops junk and caps length", () => {
    expect(decodeStack("g4.zz9.s6")).toEqual([
      { finish: "gold", size: 4 },
      { finish: "silver", size: 6 },
    ]);
    expect(decodeStack(Array(20).fill("g4").join("."), 6)).toHaveLength(6);
    expect(decodeStack(null)).toEqual([]);
  });
});

describe("splitEvents", () => {
  const list: SiteEvent[] = [
    { id: "a", name: "A", status: "scheduled", date: "2025-11-15", venue: "v", city: "c", description: "" },
    { id: "b", name: "B", status: "tba", venue: "v", city: "c", description: "" },
    { id: "c", name: "C", status: "scheduled", date: "2026-11-14", venue: "v", city: "c", description: "" },
    { id: "d", name: "D", status: "scheduled", date: "2026-10-01", endDate: "2026-10-12", venue: "v", city: "c", description: "" },
  ];
  it("splits by date, keeps multi-day events upcoming until they end, and TBA last", () => {
    const { upcoming, past } = splitEvents("2026-10-09", list);
    expect(upcoming.map((e) => e.id)).toEqual(["d", "c", "b"]);
    expect(past.map((e) => e.id)).toEqual(["a"]);
  });
});
