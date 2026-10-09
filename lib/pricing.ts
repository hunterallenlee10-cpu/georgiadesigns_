// The one place pricing lives. Georgia's offer: $20 a bracelet, any 3 for $50.
// Every full set of three bracelets in the order is $50; leftovers are $20 each.
// A "stack" product is simply three bracelets, so it lands at $50 on its own and
// also counts toward bundles when mixed with singles.

export const SINGLE_PRICE = 20;
export const BUNDLE_PRICE = 50;
export const BUNDLE_SIZE = 3;

export interface PriceBreakdown {
  /** total bracelets */
  count: number;
  /** how many full sets of three */
  bundles: number;
  /** bracelets left over after bundling, priced as singles */
  loose: number;
  subtotal: number;
  /** what it would cost at $20 each */
  fullPrice: number;
  savings: number;
  /** bracelets to add to complete the next set of three (0 when complete or empty) */
  toNextBundle: number;
}

export function priceForCount(count: number): PriceBreakdown {
  const n = Math.max(0, Math.floor(count));
  const bundles = Math.floor(n / BUNDLE_SIZE);
  const loose = n % BUNDLE_SIZE;
  const subtotal = bundles * BUNDLE_PRICE + loose * SINGLE_PRICE;
  const fullPrice = n * SINGLE_PRICE;
  return {
    count: n,
    bundles,
    loose,
    subtotal,
    fullPrice,
    savings: fullPrice - subtotal,
    toNextBundle: loose === 0 ? 0 : BUNDLE_SIZE - loose,
  };
}

export interface PricedLine {
  /** bracelets in one unit of this line (1 for a single, 3 for a stack, n for a custom stack) */
  bracelets: number;
  qty: number;
}

export function braceletCount(lines: PricedLine[]): number {
  return lines.reduce((sum, l) => sum + Math.max(0, l.bracelets) * Math.max(0, l.qty), 0);
}

export function priceLines(lines: PricedLine[]): PriceBreakdown {
  return priceForCount(braceletCount(lines));
}

/** Price shown on a product card: $20 for a single, $50 for a stack of three. */
export function listPrice(bracelets: number): number {
  return priceForCount(bracelets).subtotal;
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
