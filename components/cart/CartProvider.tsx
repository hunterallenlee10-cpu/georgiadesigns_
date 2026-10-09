"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cartStore } from "./cart-store";
import { newLineId, priceCart, type CartLine } from "@/lib/order";

interface CartContextValue {
  lines: CartLine[];
  add: (line: Omit<CartLine, "id">, opts?: { open?: boolean }) => void;
  update: (id: string, patch: Partial<CartLine>) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toast: (message: string) => void;
  /** true when RESEND_API_KEY is configured on the server */
  emailEnabled: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children, emailEnabled }: { children: ReactNode; emailEnabled: boolean }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = toastRef.current;
    if (!el || typeof el.showPopover !== "function") return;
    try {
      if (message) {
        if (el.matches(":popover-open")) el.hidePopover();
        el.showPopover();
      } else if (el.matches(":popover-open")) {
        el.hidePopover();
      }
    } catch {
      // popover unsupported; the status region still announces the message
    }
  }, [message]);

  const toast = useCallback((m: string) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 4200);
  }, []);

  const add = useCallback<CartContextValue["add"]>((line, opts) => {
    const current = cartStore.getSnapshot();
    // merge identical singles/stacks with the same size instead of duplicating
    const same = current.find(
      (l) =>
        l.kind !== "custom" &&
        line.kind !== "custom" &&
        l.slug === line.slug &&
        l.wristSize === line.wristSize &&
        (l.customSize ?? "") === (line.customSize ?? ""),
    );
    if (same) {
      cartStore.set(current.map((l) => (l === same ? { ...l, qty: Math.min(20, l.qty + line.qty) } : l)));
    } else {
      cartStore.set([...current, { ...line, id: newLineId() }]);
    }
    if (opts?.open !== false) setOpen(true);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      add,
      update: (id, patch) => cartStore.set(cartStore.getSnapshot().map((l) => (l.id === id ? { ...l, ...patch } : l))),
      remove: (id) => cartStore.set(cartStore.getSnapshot().filter((l) => l.id !== id)),
      clear: () => cartStore.set([]),
      count: priceCart(lines).count,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      toast,
      emailEnabled,
    }),
    [lines, add, isOpen, toast, emailEnabled],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* a popover sits in the top layer, so the toast shows above the open order drawer */}
      <div
        ref={toastRef}
        popover="manual"
        role="status"
        aria-live="polite"
        className="fixed inset-auto bottom-5 left-1/2 m-0 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-visible border-0 bg-transparent p-0"
      >
        {message && (
          <p className="rounded-full bg-ink px-5 py-3 text-center text-sm text-cream shadow-[var(--shadow-lift)]">
            {message}
          </p>
        )}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
