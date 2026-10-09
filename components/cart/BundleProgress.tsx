import { BUNDLE_SIZE, formatPrice, type PriceBreakdown } from "@/lib/pricing";

/** "add 2 more to unlock 3 for $50" with three bead dots that fill in. */
export function BundleProgress({ price, className = "" }: { price: PriceBreakdown; className?: string }) {
  if (price.count === 0) return null;
  const filled = price.loose === 0 ? BUNDLE_SIZE : price.loose;
  const message =
    price.toNextBundle > 0
      ? `add ${price.toNextBundle} more to ${price.bundles > 0 ? "unlock another" : "unlock"} 3 for $50`
      : `3 for $50 unlocked, you're saving ${formatPrice(price.savings)}`;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: BUNDLE_SIZE }, (_, i) => (
          <span
            key={i}
            className={`size-3.5 rounded-full border transition-colors duration-500 ${
              i < filled
                ? "border-gold bg-[radial-gradient(circle_at_35%_30%,#fff7da,#c9a24a_60%,#7a5b1a)]"
                : "border-line bg-paper"
            }`}
          />
        ))}
      </span>
      <p className="text-sm text-ink-soft">{message}</p>
    </div>
  );
}
