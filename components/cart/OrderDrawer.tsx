"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Minus, Plus, Trash, InstagramLogo, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { Drawer } from "@/components/ui/Drawer";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BraceletArt } from "@/components/beads/BraceletArt";
import { useCart } from "./CartProvider";
import { BundleProgress } from "./BundleProgress";
import {
  deliveryOptions,
  formatOrderText,
  mailtoHref,
  priceCart,
  type CartLine,
  type DeliveryMethod,
  type OrderDetails,
} from "@/lib/order";
import { describeBracelet } from "@/lib/beads";
import { formatPrice, listPrice } from "@/lib/pricing";
import { wristSizes, type WristSize } from "@/data/products";
import { site } from "@/data/site";
import { copyText } from "@/lib/clipboard";

type View = "bag" | "sent";
type Errors = Partial<Record<"name" | "contact" | "address" | "form", string>>;

export function OrderDrawer() {
  const cart = useCart();
  const [view, setView] = useState<View>("bag");
  const [sentText, setSentText] = useState("");
  const [sentVia, setSentVia] = useState<"dm" | "email" | "resend">("dm");

  const close = () => {
    cart.close();
    if (view === "sent") {
      cart.clear();
      setView("bag");
    }
  };

  return (
    <Drawer
      open={cart.isOpen}
      onClose={close}
      title={view === "sent" ? "sent!" : "your stack"}
      headerExtra={
        view === "bag" && cart.count > 0 ? (
          <span className="rounded-full bg-aqua px-2.5 py-0.5 text-sm font-medium text-ink">{cart.count}</span>
        ) : null
      }
    >
      {view === "sent" ? (
        <Sent
          text={sentText}
          via={sentVia}
          onDone={() => {
            cart.clear();
            setView("bag");
            cart.close();
          }}
        />
      ) : cart.lines.length === 0 ? (
        <Empty onClose={cart.close} />
      ) : (
        <Bag
          onSent={(text, via) => {
            setSentText(text);
            setSentVia(via);
            setView("sent");
          }}
        />
      )}
    </Drawer>
  );
}

function Empty({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
      <BraceletArt
        bracelets={[
          { finish: "gold", size: 4 },
          { finish: "pearl-gold", size: 4 },
        ]}
        className="w-40 opacity-80"
      />
      <p className="mt-4 font-serif text-3xl">nothing here yet</p>
      <p className="mt-2 max-w-[30ch] text-ink-soft">Any 3 bracelets for $50. Start with one you love.</p>
      <div className="mt-8 flex flex-col items-center gap-3">
        <ButtonLink href="/build-your-stack" onClick={onClose}>
          build your stack
        </ButtonLink>
        <Link href="/shop" onClick={onClose} className="link-underline py-2 text-[0.95rem]">
          shop bracelets
        </Link>
      </div>
    </div>
  );
}

function LineItem({ line }: { line: CartLine }) {
  const { update, remove } = useCart();
  const unit = formatPrice(listPrice(line.bracelets.length * line.qty));
  const sizeId = `size-${line.id}`;
  return (
    <li className="flex gap-4 py-5">
      <div className="size-20 shrink-0 rounded-[var(--radius-card)] bg-oat p-1.5">
        <BraceletArt bracelets={line.bracelets} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium leading-snug">{line.name}</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {line.kind === "single" ? describeBracelet(line.bracelets[0]) : line.bracelets.map(describeBracelet).join(" + ")}
            </p>
            {line.gift && (
              <p className="mt-0.5 text-sm text-ink-soft">
                gift 🎀{line.giftNote ? `: “${line.giftNote}”` : ""}
              </p>
            )}
          </div>
          <p className="shrink-0 text-sm text-ink-soft">{unit}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label htmlFor={sizeId} className="sr-only">
            wrist size for {line.name}
          </label>
          <select
            id={sizeId}
            value={line.wristSize}
            onChange={(e) => update(line.id, { wristSize: e.target.value as WristSize })}
            className="field !min-h-10 !w-auto !py-1.5 pr-8 text-sm"
          >
            {wristSizes.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label} {w.id !== "custom" ? w.detail : ""}
              </option>
            ))}
          </select>
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full hover:bg-oat disabled:opacity-40"
              onClick={() => update(line.id, { qty: Math.max(1, line.qty - 1) })}
              disabled={line.qty <= 1}
              aria-label={`fewer ${line.name}`}
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm tabular-nums" aria-label={`quantity ${line.qty}`}>
              {line.qty}
            </span>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full hover:bg-oat"
              onClick={() => update(line.id, { qty: Math.min(20, line.qty + 1) })}
              aria-label={`more ${line.name}`}
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => remove(line.id)}
            className="ml-auto inline-flex size-10 items-center justify-center rounded-full text-ink-soft hover:bg-oat hover:text-ink"
            aria-label={`remove ${line.name}`}
          >
            <Trash size={18} weight="light" />
          </button>
        </div>
        {line.wristSize === "custom" && (
          <div className="mt-2">
            <label htmlFor={`custom-${line.id}`} className="sr-only">
              custom wrist size for {line.name}
            </label>
            <input
              id={`custom-${line.id}`}
              className="field !min-h-10 !py-1.5 text-sm"
              placeholder='your wrist, e.g. 6.25"'
              value={line.customSize ?? ""}
              maxLength={40}
              onChange={(e) => update(line.id, { customSize: e.target.value })}
            />
          </div>
        )}
      </div>
    </li>
  );
}

function Bag({ onSent }: { onSent: (text: string, via: "dm" | "email" | "resend") => void }) {
  const cart = useCart();
  const price = priceCart(cart.lines);
  const [details, setDetails] = useState<OrderDetails>({ name: "", contact: "", instagram: "", delivery: "meetup-chapel-hill", address: "", notes: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof OrderDetails>(k: K, v: OrderDetails[K]) => setDetails((d) => ({ ...d, [k]: v }));

  function validate(): boolean {
    const e: Errors = {};
    if (!details.name.trim()) e.name = "please add your name";
    if (!details.contact.trim()) e.contact = "add an email or phone so georgia can reach you";
    if (details.delivery === "ship" && !details.address?.trim()) e.address = "add a shipping address";
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`order-${first}`)?.focus();
      return false;
    }
    return true;
  }

  const text = () => formatOrderText(cart.lines, details);

  function sendDm() {
    if (!validate()) return;
    const t = text();
    void copyText(t).then((ok) =>
      cart.toast(ok ? "order copied, paste it in the DM" : "couldn't copy automatically, it's below to copy"),
    );
    window.open(site.instagram.dm, "_blank", "noopener,noreferrer");
    onSent(t, "dm");
  }

  function sendEmail() {
    if (!validate()) return;
    const t = text();
    window.location.href = mailtoHref(`georgia designs order from ${details.name.trim()}`, t);
    onSent(t, "email");
  }

  async function sendResend(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const t = text();
    setBusy(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "order", name: details.name, contact: details.contact, text: t }),
      });
      if (!res.ok) throw new Error(String(res.status));
      onSent(t, "resend");
    } catch {
      setErrors({ form: "that didn't go through. try the instagram or email button instead." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={sendResend} noValidate className="flex flex-col">
      <div className="px-5 sm:px-6">
        <ul className="divide-y divide-line">
          {cart.lines.map((l) => (
            <LineItem key={l.id} line={l} />
          ))}
        </ul>
        <div className="border-t border-line py-5">
          <BundleProgress price={price} />
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-ink-soft">subtotal</span>
            <span className="font-serif text-3xl tabular-nums" aria-live="polite">
              {formatPrice(price.subtotal)}
            </span>
          </div>
          {price.savings > 0 && (
            <p className="mt-1 text-right text-sm text-gold-deep">3 for $50 applied, you save {formatPrice(price.savings)}</p>
          )}
          <p className="mt-2 text-sm text-ink-soft">
            No payment now. Georgia confirms your order, then sends venmo / paypal details.
          </p>
        </div>
      </div>

      <fieldset className="border-t border-line bg-cream px-5 py-6 sm:px-6">
        <legend className="sr-only">your details</legend>
        <p className="mb-4 font-serif text-2xl">your details</p>
        <div className="grid gap-4">
          <Field id="order-name" label="name" error={errors.name}>
            <input
              id="order-name"
              className="field"
              autoComplete="name"
              value={details.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "order-name-error" : undefined}
              required
            />
          </Field>
          <Field id="order-contact" label="email or phone" error={errors.contact}>
            <input
              id="order-contact"
              className="field"
              autoComplete="email"
              value={details.contact}
              onChange={(e) => set("contact", e.target.value)}
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? "order-contact-error" : undefined}
              required
            />
          </Field>
          <Field id="order-instagram" label="instagram handle" hint="optional">
            <input
              id="order-instagram"
              className="field"
              autoComplete="off"
              placeholder="@"
              value={details.instagram}
              onChange={(e) => set("instagram", e.target.value)}
            />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium" id="delivery-label">
              how should you get it?
            </p>
            <div role="radiogroup" aria-labelledby="delivery-label" className="grid gap-2">
              {deliveryOptions.map((o) => (
                <label
                  key={o.id}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-input)] border border-line bg-paper px-4 has-[:checked]:border-ink"
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={o.id}
                    checked={details.delivery === o.id}
                    onChange={() => set("delivery", o.id as DeliveryMethod)}
                    className="size-4 accent-[var(--color-ink)]"
                  />
                  <span className="text-[0.95rem]">{o.label}</span>
                </label>
              ))}
            </div>
            {details.delivery === "ship" && (
              <p className="mt-2 text-sm text-ink-soft">Shipping cost is added when georgia confirms. [CONFIRM: shipping cost]</p>
            )}
          </div>
          {details.delivery === "ship" && (
            <Field id="order-address" label="shipping address" error={errors.address}>
              <textarea
                id="order-address"
                className="field min-h-24"
                autoComplete="street-address"
                value={details.address}
                onChange={(e) => set("address", e.target.value)}
                aria-invalid={!!errors.address}
                aria-describedby={errors.address ? "order-address-error" : undefined}
              />
            </Field>
          )}
          <Field id="order-notes" label="notes" hint="custom ideas, dates, gift details">
            <textarea
              id="order-notes"
              className="field min-h-20"
              value={details.notes}
              maxLength={800}
              onChange={(e) => set("notes", e.target.value)}
            />
          </Field>
        </div>
      </fieldset>

      <div className="sticky bottom-0 border-t border-line bg-paper/95 px-5 py-5 backdrop-blur sm:px-6">
        {errors.form && (
          <p role="alert" className="mb-3 text-sm text-[#a8343f]">
            {errors.form}
          </p>
        )}
        <div className="grid gap-2.5">
          {cart.emailEnabled && (
            <Button type="submit" disabled={busy} className="w-full">
              <PaperPlaneTilt size={18} /> {busy ? "sending…" : `send order · ${formatPrice(price.subtotal)}`}
            </Button>
          )}
          <Button
            onClick={sendDm}
            variant={cart.emailEnabled ? "outline" : "primary"}
            className="w-full"
          >
            <InstagramLogo size={18} /> send as an instagram DM
          </Button>
          <Button onClick={sendEmail} variant="outline" className="w-full">
            <EnvelopeSimple size={18} /> send by email
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {hint && <span className="font-normal text-ink-soft">({hint})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[#a8343f]">
          {error}
        </p>
      )}
    </div>
  );
}

function Sent({ text, via, onDone }: { text: string; via: "dm" | "email" | "resend"; onDone: () => void }) {
  const { toast } = useCart();
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <p className="font-script text-6xl leading-tight text-ink">thank you!!</p>
      <p className="mt-4 max-w-[34ch] text-lg">georgia will reach out to confirm and send venmo / paypal details 🥰</p>
      {via === "dm" && (
        <p className="mt-4 max-w-[36ch] text-sm text-ink-soft">
          Your order is copied. Paste it into the DM to @{site.instagram.handle}. If Instagram didn&apos;t open,{" "}
          <a href={site.instagram.dm} target="_blank" rel="noreferrer" className="link-underline text-ink">
            open it here
          </a>
          .
        </p>
      )}
      {via === "email" && (
        <p className="mt-4 max-w-[36ch] text-sm text-ink-soft">Your email app should open with the order filled in. Hit send there.</p>
      )}
      <p className="mt-6 rounded-full bg-oat px-4 py-2 text-sm text-ink-soft">
        venmo {site.venmo} · paypal {site.paypal}
      </p>
      <details className="mt-8 w-full text-left">
        <summary className="cursor-pointer py-2 text-sm text-ink-soft">see your order text</summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-[var(--radius-card)] bg-oat p-4 font-sans text-sm leading-relaxed">{text}</pre>
        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() => void copyText(text).then((ok) => toast(ok ? "copied" : "select the text above to copy"))}
        >
          copy order again
        </Button>
      </details>
      <Button className="mt-8" onClick={onDone}>
        done
      </Button>
    </div>
  );
}
