"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right" | "full";
  /** extra header content beside the title */
  headerExtra?: ReactNode;
  className?: string;
}

/**
 * Accessible drawer built on the native <dialog> element: focus is trapped,
 * Esc closes it, and the page behind is inert while it is open.
 */
export function Drawer({ open, onClose, title, children, side = "right", headerExtra, className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && el.open) {
      el.close();
    }
    if (!open) document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const panel =
    side === "right"
      ? "ml-auto h-dvh max-h-dvh w-full max-w-[460px] translate-x-0 open:translate-x-0 starting:open:translate-x-full"
      : "h-dvh max-h-dvh w-full max-w-none starting:open:opacity-0";

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // click on the backdrop closes
        if (e.target === ref.current) onClose();
      }}
      className={`m-0 border-0 bg-paper p-0 text-ink shadow-[var(--shadow-lift)] transition-[translate,opacity,display,overlay] duration-500 ease-[var(--ease-out-soft)] [transition-behavior:allow-discrete] backdrop:bg-[rgb(27_27_27/0.35)] backdrop:backdrop-blur-[2px] ${panel} ${className}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-[1.65rem] leading-none">{title}</h2>
            {headerExtra}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-oat"
            aria-label="close"
          >
            <X size={22} weight="light" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  );
}
