import { describe, expect, it } from "vitest";
import { braceletCount, listPrice, priceForCount, priceLines } from "./pricing";

describe("priceForCount", () => {
  const cases: [number, number, number][] = [
    // count, subtotal, savings
    [0, 0, 0],
    [1, 20, 0],
    [2, 40, 0],
    [3, 50, 10],
    [4, 70, 10],
    [5, 90, 10],
    [6, 100, 20],
    [7, 120, 20],
  ];
  it.each(cases)("%i bracelets cost $%i and save $%i", (count, subtotal, savings) => {
    const p = priceForCount(count);
    expect(p.subtotal).toBe(subtotal);
    expect(p.savings).toBe(savings);
    expect(p.fullPrice).toBe(count * 20);
  });

  it("tells you how many more unlock the next set of three", () => {
    expect(priceForCount(0).toNextBundle).toBe(0);
    expect(priceForCount(1).toNextBundle).toBe(2);
    expect(priceForCount(2).toNextBundle).toBe(1);
    expect(priceForCount(3).toNextBundle).toBe(0);
    expect(priceForCount(4).toNextBundle).toBe(2);
  });

  it("ignores negative and fractional input", () => {
    expect(priceForCount(-2).subtotal).toBe(0);
    expect(priceForCount(3.9).subtotal).toBe(50);
  });
});

describe("priceLines (mixed singles and stacks)", () => {
  it("a stack of three on its own is $50", () => {
    expect(priceLines([{ bracelets: 3, qty: 1 }]).subtotal).toBe(50);
  });

  it("one stack + one single = 4 bracelets = $70", () => {
    expect(priceLines([{ bracelets: 3, qty: 1 }, { bracelets: 1, qty: 1 }]).subtotal).toBe(70);
  });

  it("three different singles bundle to $50", () => {
    const p = priceLines([
      { bracelets: 1, qty: 1 },
      { bracelets: 1, qty: 1 },
      { bracelets: 1, qty: 1 },
    ]);
    expect(p.subtotal).toBe(50);
    expect(p.savings).toBe(10);
  });

  it("qty counts: 2 of one single + 1 stack + 2 singles = 7 bracelets = $120", () => {
    const lines = [
      { bracelets: 1, qty: 2 },
      { bracelets: 3, qty: 1 },
      { bracelets: 1, qty: 2 },
    ];
    expect(braceletCount(lines)).toBe(7);
    expect(priceLines(lines).subtotal).toBe(120);
  });

  it("a custom stack of 5 from the builder + 1 single = 6 bracelets = $100", () => {
    expect(priceLines([{ bracelets: 5, qty: 1 }, { bracelets: 1, qty: 1 }]).subtotal).toBe(100);
  });

  it("two stacks = $100", () => {
    expect(priceLines([{ bracelets: 3, qty: 2 }]).subtotal).toBe(100);
  });
});

describe("listPrice", () => {
  it("is $20 for a single and $50 for a stack", () => {
    expect(listPrice(1)).toBe(20);
    expect(listPrice(3)).toBe(50);
  });
});
