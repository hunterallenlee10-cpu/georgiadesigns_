"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders its children everywhere except the home page. */
export function NotOnHome({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
