"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

/**
 * Link to the home page that always lands at the top. Next.js doesn't scroll
 * when you link to the page you're already on, so on "/" this scrolls up
 * itself (smoothly, or instantly for people who prefer reduced motion).
 */
export function HomeLink({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // let cmd/ctrl/shift-click open a new tab as usual
    if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (window.location.hash) window.history.replaceState(null, "", "/");
  };

  return (
    <Link href="/" scroll className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
