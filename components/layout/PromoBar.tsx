"use client";

import { useSyncExternalStore } from "react";
import { X } from "@phosphor-icons/react";
import { site } from "@/data/site";

const KEY = "gd-promo-dismissed";
const listeners = new Set<() => void>();
let dismissed: boolean | null = null;

function read() {
  if (dismissed === null) {
    try {
      dismissed = window.sessionStorage.getItem(KEY) === "1";
    } catch {
      dismissed = false;
    }
  }
  return dismissed;
}

function dismiss() {
  dismissed = true;
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function PromoBar() {
  const hidden = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => false,
  );
  if (hidden) return null;
  return (
    <div className="relative bg-aqua text-ink">
      <p className="container-site flex min-h-10 items-center justify-center py-2 pr-12 text-center text-[0.8125rem] tracking-[0.02em] sm:pr-6">
        {site.promo.offer}
        <span className="hidden sm:inline">&nbsp;{site.promo.extra}</span>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-1 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-ink/10"
        aria-label="dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
