"use client";

import type { CartLine } from "@/lib/order";
import { FINISHES } from "@/lib/beads";
import { wristSizes } from "@/data/products";

// A tiny external store for the order, persisted to localStorage.
// Every storage access is wrapped: private windows and blocked storage
// just fall back to an in-memory cart.

const KEY = "gd-stack-v1";
const EMPTY: CartLine[] = [];
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function isLine(x: unknown): x is CartLine {
  if (!x || typeof x !== "object") return false;
  const l = x as CartLine;
  return (
    typeof l.id === "string" &&
    typeof l.name === "string" &&
    Array.isArray(l.bracelets) &&
    l.bracelets.length > 0 &&
    l.bracelets.every((b) => FINISHES.some((f) => f.id === b?.finish) && (b.size === 4 || b.size === 6)) &&
    Number.isInteger(l.qty) &&
    l.qty > 0 &&
    wristSizes.some((w) => w.id === l.wristSize)
  );
}

function load(): CartLine[] {
  if (lines === null) {
    try {
      const raw = window.localStorage.getItem(KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      lines = Array.isArray(parsed) ? parsed.filter(isLine) : [];
    } catch {
      lines = [];
    }
  }
  return lines;
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lines ?? []));
  } catch {
    // storage unavailable; the cart still works for this visit
  }
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: load,
  getServerSnapshot: () => EMPTY,
  set(next: CartLine[]) {
    lines = next;
    save();
    listeners.forEach((l) => l());
  },
};
