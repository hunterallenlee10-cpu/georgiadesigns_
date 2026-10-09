"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Shuffle, X, Plus, ShareNetwork, Gift } from "@phosphor-icons/react";
import { WristScene } from "@/components/beads/WristScene";
import { BraceletArt } from "@/components/beads/BraceletArt";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import {
  FINISHES,
  SIZES,
  decodeStack,
  describeBracelet,
  encodeStack,
  type BraceletSpec,
} from "@/lib/beads";
import { BUNDLE_SIZE, formatPrice, priceForCount } from "@/lib/pricing";
import { wristSizes, type WristSize } from "@/data/products";
import { copyText } from "@/lib/clipboard";

const MAX = 6;

interface Slot {
  id: string;
  spec: BraceletSpec | null;
}

/** Curated combos for "surprise me": always a nice mix of sizes and finishes. */
const SURPRISES: BraceletSpec[][] = [
  [{ finish: "gold", size: 4 }, { finish: "pearl-gold", size: 4 }, { finish: "gold", size: 6 }],
  [{ finish: "gold", size: 6 }, { finish: "mixed", size: 4 }, { finish: "silver", size: 4 }],
  [{ finish: "silver", size: 4 }, { finish: "pearl-silver", size: 4 }, { finish: "silver", size: 6 }],
  [{ finish: "pearl-gold", size: 6 }, { finish: "gold", size: 4 }, { finish: "gold", size: 4 }],
  [{ finish: "mixed", size: 6 }, { finish: "gold", size: 4 }, { finish: "pearl-silver", size: 4 }],
  [{ finish: "gold", size: 4 }, { finish: "gold", size: 6 }, { finish: "gold", size: 4 }],
  [{ finish: "pearl-silver", size: 6 }, { finish: "silver", size: 4 }, { finish: "mixed", size: 4 }],
];

/** a random curated combo that differs from the current stack */
function pickSurprise(current: string): BraceletSpec[] {
  const options = SURPRISES.filter((c) => encodeStack(c) !== current);
  return options[Math.floor(Math.random() * options.length)];
}

let slotCounter = 0;
const newSlot = (spec: BraceletSpec | null = null): Slot => ({ id: `slot-${++slotCounter}`, spec });

function initialSlots(code: string | null): Slot[] {
  const decoded = decodeStack(code, MAX);
  const slots = decoded.map((s) => newSlot(s));
  while (slots.length < BUNDLE_SIZE) slots.push(newSlot());
  return slots;
}

function syncUrl(slots: Slot[], gift: boolean) {
  try {
    const filled = slots.map((s) => s.spec).filter(Boolean) as BraceletSpec[];
    const params = new URLSearchParams();
    if (filled.length) params.set("s", encodeStack(filled));
    if (gift) params.set("gift", "1");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  } catch {
    // ignore
  }
}

export function StackBuilder() {
  const params = useSearchParams();
  const cart = useCart();
  const uid = useId();
  const [slots, setSlots] = useState<Slot[]>(() => initialSlots(params.get("s")));
  const [active, setActive] = useState(() => {
    const firstEmpty = slots.findIndex((s) => !s.spec);
    return firstEmpty === -1 ? 0 : firstEmpty;
  });
  const [gift, setGift] = useState(params.get("gift") === "1");
  const [giftNote, setGiftNote] = useState("");
  const [wristSize, setWristSize] = useState<WristSize>("standard");
  const [customSize, setCustomSize] = useState("");

  const filled = slots.filter((s) => s.spec) as { id: string; spec: BraceletSpec }[];
  const price = priceForCount(filled.length);

  const update = (next: Slot[], nextGift = gift) => {
    setSlots(next);
    syncUrl(next, nextGift);
  };

  const choose = (spec: BraceletSpec) => {
    const next = slots.map((s, i) => (i === active ? { id: s.spec ? newSlot().id : s.id, spec } : s));
    update(next);
    // move on to the next empty slot, if any
    const nextEmpty = next.findIndex((s, i) => !s.spec && i > active);
    const anyEmpty = next.findIndex((s) => !s.spec);
    setActive(nextEmpty !== -1 ? nextEmpty : anyEmpty !== -1 ? anyEmpty : active);
  };

  const removeSlot = (index: number) => {
    let next = slots.filter((_, i) => i !== index);
    while (next.length < BUNDLE_SIZE) next = [...next, newSlot()];
    update(next);
    setActive(Math.min(active, next.length - 1));
  };

  const addSlot = () => {
    if (slots.length >= MAX) return;
    const next = [...slots, newSlot()];
    update(next);
    setActive(next.length - 1);
  };

  const surprise = () => {
    const next = pickSurprise(encodeStack(filled.map((f) => f.spec))).map((s) => newSlot(s));
    update(next);
    setActive(0);
  };

  const share = async () => {
    const url = `${window.location.origin}/build-your-stack?s=${encodeStack(filled.map((f) => f.spec))}`;
    const shareData = { title: "my georgia designs stack", text: "look at this stack 😍", url };
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // cancelled; fall back to copy
    }
    const ok = await copyText(url);
    cart.toast(ok ? "link copied, send it to your friends" : url);
  };

  const addToOrder = () => {
    if (!filled.length) return;
    const n = filled.length;
    cart.add({
      slug: "custom-stack",
      name: n === 1 ? "Custom bracelet" : `Custom stack of ${n}`,
      kind: "custom",
      bracelets: filled.map((f) => f.spec),
      qty: 1,
      wristSize,
      customSize: wristSize === "custom" ? customSize.trim() : undefined,
      gift,
      giftNote: gift ? giftNote.trim() : undefined,
    });
  };

  const activeLabel = `bracelet ${active + 1}`;
  const toNext = price.toNextBundle;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      {/* ---------- preview ---------- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-[radial-gradient(90%_70%_at_50%_60%,#f7efe2_0%,#ecdfca_60%,#e2d1b6_100%)]">
          <div className="flex h-[min(56dvh,440px)] items-end justify-center sm:h-[480px] lg:h-[min(640px,calc(100dvh-220px))]">
            <WristScene
              bracelets={filled.map((f) => f.spec)}
              ids={filled.map((f) => f.id)}
              className="h-full w-auto"
              title={
                filled.length
                  ? `Your stack on a wrist: ${filled.map((f) => describeBracelet(f.spec)).join(", ")}`
                  : "An empty wrist, ready for your first bracelet"
              }
            />
          </div>
          {!filled.length && (
            <p className="absolute inset-x-0 top-[38%] text-center font-serif text-2xl italic text-ink-soft">
              pick a bracelet to start
            </p>
          )}
        </div>
        {/* price, announced to screen readers when it changes */}
        <div className="mt-5 flex items-end justify-between gap-4" aria-live="polite" aria-atomic="true">
          <div>
            <p className="text-sm text-ink-soft">
              {filled.length} {filled.length === 1 ? "bracelet" : "bracelets"}
            </p>
            <p className="font-serif text-5xl leading-none tabular-nums">{formatPrice(price.subtotal)}</p>
          </div>
          <p className="text-right text-sm">
            {price.savings > 0 ? (
              <span className="text-gold-deep">you save {formatPrice(price.savings)}</span>
            ) : filled.length > 0 ? (
              <span className="text-ink-soft">
                add {toNext} more for 3 for $50
              </span>
            ) : (
              <span className="text-ink-soft">$20 each, any 3 for $50</span>
            )}
          </p>
        </div>
      </div>

      {/* ---------- controls ---------- */}
      <div className="grid content-start gap-10">
        <section aria-labelledby={`${uid}-slots`}>
          <div className="flex items-center justify-between gap-4">
            <h2 id={`${uid}-slots`} className="h3">
              Your bracelets
            </h2>
            <button
              type="button"
              onClick={surprise}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 text-[0.9rem] hover:border-ink/60"
            >
              <Shuffle size={16} /> surprise me
            </button>
          </div>
          <p className="mt-1 text-sm text-ink-soft">Tap a slot to swap it, then pick a bracelet below.</p>
          <ol className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-3">
            {slots.map((s, i) => (
              <li key={s.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  aria-label={`bracelet ${i + 1}: ${s.spec ? describeBracelet(s.spec) : "empty"}${i === active ? ", selected" : ""}`}
                  className={`flex aspect-square w-full flex-col items-center justify-center rounded-[var(--radius-card)] border p-2 transition-colors ${
                    i === active
                      ? "border-ink bg-paper ring-2 ring-gold-soft"
                      : s.spec
                        ? "border-line bg-paper hover:border-ink/50"
                        : "border-dashed border-[#cdbb9a] bg-transparent hover:border-ink/50"
                  }`}
                >
                  {s.spec ? (
                    <>
                      <BraceletArt bracelets={[s.spec]} className="w-[82%]" />
                      <span className="mt-1 text-center text-[0.78rem] leading-tight">{describeBracelet(s.spec)}</span>
                    </>
                  ) : (
                    <span className="font-serif text-3xl italic text-ink-soft">{i + 1}</span>
                  )}
                </button>
                {s.spec && (
                  <button
                    type="button"
                    onClick={() => removeSlot(i)}
                    className="absolute -right-2 -top-2 inline-flex size-8 items-center justify-center rounded-full border border-line bg-paper text-ink-soft shadow-sm hover:text-ink"
                    aria-label={`remove bracelet ${i + 1}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </li>
            ))}
          </ol>
          {slots.length < MAX && (
            <button type="button" onClick={addSlot} className="mt-3 inline-flex min-h-11 items-center gap-2 text-[0.9rem]">
              <Plus size={16} /> <span className="link-underline">add another bracelet</span>
            </button>
          )}
        </section>

        <section aria-labelledby={`${uid}-pick`}>
          <h2 id={`${uid}-pick`} className="h3">
            Pick {activeLabel}
          </h2>
          {SIZES.map((size) => (
            <div key={size.id} className="mt-5">
              <p className="text-sm">
                <span className="font-medium">{size.label}</span>{" "}
                <span className="text-ink-soft">{size.blurb}</span>
              </p>
              <ul className="mt-2.5 grid grid-cols-5 gap-1.5 sm:gap-2">
                {FINISHES.map((f) => {
                  const spec: BraceletSpec = { finish: f.id, size: size.id };
                  const current = slots[active]?.spec;
                  const selected = current?.finish === f.id && current?.size === size.id;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => choose(spec)}
                        aria-pressed={selected}
                        aria-label={`${describeBracelet(spec)} for ${activeLabel}`}
                        className={`flex w-full flex-col items-center rounded-[var(--radius-card)] border px-1.5 pb-2.5 pt-1 transition-[border-color,transform] active:scale-[0.97] ${
                          selected ? "border-ink bg-paper" : "border-line bg-paper/70 hover:border-ink/50"
                        }`}
                      >
                        <BraceletArt bracelets={[spec]} className="w-full" />
                        <span className="text-[0.7rem] leading-tight sm:text-[0.8rem]">{f.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section aria-labelledby={`${uid}-finish`} className="grid gap-6 border-t border-line pt-8">
          <h2 id={`${uid}-finish`} className="sr-only">
            Finish your order
          </h2>
          <div className="grid gap-1.5">
            <label htmlFor={`${uid}-size`} className="text-sm font-medium">
              wrist size <span className="font-normal text-ink-soft">(draft sizes)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <select
                id={`${uid}-size`}
                value={wristSize}
                onChange={(e) => setWristSize(e.target.value as WristSize)}
                className="field !w-auto pr-9"
              >
                {wristSizes.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label} {w.id !== "custom" ? w.detail : ""}
                  </option>
                ))}
              </select>
              {wristSize === "custom" && (
                <>
                  <label htmlFor={`${uid}-custom`} className="sr-only">
                    your wrist measurement
                  </label>
                  <input
                    id={`${uid}-custom`}
                    className="field !w-auto flex-1"
                    placeholder='your wrist, e.g. 6.25"'
                    maxLength={40}
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-line bg-paper p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2.5" id={`${uid}-gift-label`}>
                <Gift size={20} weight="light" className="text-[#c45a74]" aria-hidden="true" />
                <span>
                  <span className="font-medium">this is a gift</span>
                  <span className="block text-sm text-ink-soft">add a note and georgia will include it</span>
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={gift}
                aria-labelledby={`${uid}-gift-label`}
                onClick={() => {
                  setGift(!gift);
                  syncUrl(slots, !gift);
                }}
                className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${gift ? "bg-ink" : "bg-[#8f8576]"}`}
              >
                <span
                  className={`absolute top-1 size-6 rounded-full bg-paper shadow transition-transform duration-300 ${
                    gift ? "translate-x-7 bg-bow" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {gift && (
              <div className="mt-4 grid gap-1.5">
                <label htmlFor={`${uid}-note`} className="text-sm font-medium">
                  gift note <span className="font-normal text-ink-soft">(optional)</span>
                </label>
                <textarea
                  id={`${uid}-note`}
                  className="field min-h-20"
                  maxLength={240}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={addToOrder} disabled={!filled.length} className="sm:flex-1">
              Add stack to order · {formatPrice(price.subtotal)}
            </Button>
            <Button variant="outline" onClick={share} disabled={!filled.length}>
              <ShareNetwork size={18} /> share this stack
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
