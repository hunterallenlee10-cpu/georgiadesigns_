import { describeBracelet, type BraceletSpec } from "./beads";
import { formatPrice, priceLines } from "./pricing";
import { wristSizes, type WristSize } from "@/data/products";
import { site } from "@/data/site";

export interface CartLine {
  id: string;
  /** product slug, or "custom-stack" for builder stacks */
  slug: string;
  name: string;
  kind: "single" | "stack" | "custom";
  bracelets: BraceletSpec[];
  qty: number;
  wristSize: WristSize;
  customSize?: string;
  gift?: boolean;
  giftNote?: string;
}

export type DeliveryMethod = "meetup-chapel-hill" | "meetup-high-point" | "ship";

export const deliveryOptions: { id: DeliveryMethod; label: string }[] = [
  { id: "meetup-chapel-hill", label: "local meetup in Chapel Hill" },
  { id: "meetup-high-point", label: "local meetup in High Point" },
  { id: "ship", label: "ship to me" },
];

export interface OrderDetails {
  name: string;
  contact: string;
  instagram?: string;
  delivery: DeliveryMethod;
  address?: string;
  notes?: string;
}

export function lineBracelets(line: Pick<CartLine, "bracelets" | "qty">) {
  return line.bracelets.length * line.qty;
}

export function priceCart(lines: CartLine[]) {
  return priceLines(lines.map((l) => ({ bracelets: l.bracelets.length, qty: l.qty })));
}

export function sizeLabel(line: Pick<CartLine, "wristSize" | "customSize">) {
  const s = wristSizes.find((w) => w.id === line.wristSize);
  if (line.wristSize === "custom") return `custom (${line.customSize?.trim() || "tbd"})`;
  return s ? `${s.label} ${s.detail}` : line.wristSize;
}

/** Plain-text order, used for the DM, the email body and the Resend email. */
export function formatOrderText(lines: CartLine[], d: OrderDetails): string {
  const p = priceCart(lines);
  const out: string[] = [];
  out.push("hi georgia! I'd love to order:");
  out.push("");
  lines.forEach((l, i) => {
    out.push(`${i + 1}. ${l.name}${l.qty > 1 ? ` × ${l.qty}` : ""}`);
    if (l.kind !== "single") out.push(`   ${l.bracelets.map(describeBracelet).join(" + ")}`);
    out.push(`   wrist size: ${sizeLabel(l)}`);
    if (l.gift) out.push(`   gift 🎀${l.giftNote ? ` note: "${l.giftNote.trim()}"` : ""}`);
  });
  out.push("");
  out.push(
    `${p.count} bracelet${p.count === 1 ? "" : "s"}: ${formatPrice(p.subtotal)}${p.savings ? ` (3 for $50 applied, saving ${formatPrice(p.savings)})` : ""}`,
  );
  out.push("");
  out.push(`name: ${d.name}`);
  out.push(`contact: ${d.contact}`);
  if (d.instagram) out.push(`instagram: @${d.instagram.replace(/^@/, "")}`);
  const delivery = deliveryOptions.find((o) => o.id === d.delivery)?.label ?? d.delivery;
  out.push(`delivery: ${delivery}`);
  if (d.delivery === "ship" && d.address) out.push(`ship to: ${d.address}`);
  if (d.notes) out.push(`notes: ${d.notes}`);
  return out.join("\n");
}

export function mailtoHref(subject: string, body: string, to: string = site.contactEmail) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function newLineId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
