import type { ReactNode } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

/** Native <details> accordion: keyboard and screen-reader friendly with no JS. */
export function Accordion({ items, className = "" }: { items: { title: ReactNode; body: ReactNode }[]; className?: string }) {
  return (
    <div className={`border-t border-line ${className}`}>
      {items.map((it, i) => (
        <details key={i} className="group border-b border-line">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-medium">{it.title}</span>
            <Plus
              size={18}
              weight="light"
              className="shrink-0 transition-transform duration-300 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <div className="pb-5 pr-8 text-ink-soft [&_p+p]:mt-3">{it.body}</div>
        </details>
      ))}
    </div>
  );
}
