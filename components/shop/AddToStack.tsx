"use client";

import { useState } from "react";
import { Minus, Plus } from "@phosphor-icons/react";
import { wristSizes, type Product, type WristSize } from "@/data/products";
import { useCart } from "@/components/cart/CartProvider";
import { BundleProgress } from "@/components/cart/BundleProgress";
import { Button } from "@/components/ui/Button";
import { priceCart } from "@/lib/order";
import { formatPrice, listPrice, priceForCount } from "@/lib/pricing";

export function AddToStack({ product }: { product: Product }) {
  const cart = useCart();
  const [size, setSize] = useState<WristSize>("standard");
  const [custom, setCustom] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  // show the bundle progress as if this were added
  const inCart = priceCart(cart.lines).count;
  const preview = priceForCount(inCart + product.bracelets.length * qty);

  const add = () => {
    if (size === "custom" && !custom.trim()) {
      setError("tell georgia your wrist measurement");
      document.getElementById("custom-size")?.focus();
      return;
    }
    setError("");
    cart.add({
      slug: product.slug,
      name: product.name,
      kind: product.type,
      bracelets: product.bracelets,
      qty,
      wristSize: size,
      customSize: size === "custom" ? custom.trim() : undefined,
    });
  };

  return (
    <div className="grid gap-7">
      <fieldset>
        <legend className="mb-3 text-sm font-medium">
          wrist size <span className="font-normal text-ink-soft">(sizes are drafts, see the size guide)</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {wristSizes.map((w) => (
            <label
              key={w.id}
              className="flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-input)] border border-line bg-paper px-2 text-center transition-colors hover:border-ink/50 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-cream has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-deep"
            >
              <input
                type="radio"
                name="wrist-size"
                value={w.id}
                checked={size === w.id}
                onChange={() => setSize(w.id)}
                className="sr-only"
              />
              <span className="text-[0.95rem]">{w.label}</span>
              <span className="text-xs opacity-75">{w.detail}</span>
            </label>
          ))}
        </div>
        {size === "custom" && (
          <div className="mt-3 grid gap-1.5">
            <label htmlFor="custom-size" className="text-sm font-medium">
              your wrist measurement
            </label>
            <input
              id="custom-size"
              className="field"
              placeholder='e.g. 6.25"'
              value={custom}
              maxLength={40}
              onChange={(e) => setCustom(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "custom-size-error" : undefined}
            />
            {error && (
              <p id="custom-size-error" className="text-sm text-[#a8343f]">
                {error}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-full border border-line bg-paper" role="group" aria-label="quantity">
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full hover:bg-oat disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="fewer"
          >
            <Minus size={16} />
          </button>
          <output className="w-8 text-center tabular-nums" aria-live="polite">
            {qty}
          </output>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-full hover:bg-oat"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="more"
          >
            <Plus size={16} />
          </button>
        </div>
        <Button onClick={add} className="flex-1 sm:flex-none sm:px-10">
          Add to my stack · {formatPrice(listPrice(product.bracelets.length * qty))}
        </Button>
      </div>

      <BundleProgress price={preview} />
    </div>
  );
}
