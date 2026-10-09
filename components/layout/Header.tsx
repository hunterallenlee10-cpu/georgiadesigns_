"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { InstagramLogo, List } from "@phosphor-icons/react";
import { nav, site } from "@/data/site";
import { LogoBadge } from "@/components/ui/Badge";
import { BeadDivider } from "@/components/ui/BeadDivider";
import { Drawer } from "@/components/ui/Drawer";
import { useCart } from "@/components/cart/CartProvider";
import { HomeLink } from "./HomeLink";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="hidden sm:block">
        <LogoBadge size={38} />
      </span>
      <span className="font-serif text-[1.4rem] italic sm:text-[1.55rem] leading-none tracking-[-0.01em]">georgia designs</span>
    </span>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 12;
    if (next !== scrolled) setScrolled(next);
  });

  return (
    <>
      <motion.header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? "border-b border-line bg-cream/92 shadow-[0_1px_0_rgb(0_0_0/0.02)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-site flex h-[68px] items-center justify-between gap-6">
          <HomeLink className="shrink-0">
            <Wordmark />
          </HomeLink>

          <nav aria-label="main" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="link-grow py-2 text-[0.95rem]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="hidden size-11 items-center justify-center rounded-full hover:bg-oat sm:inline-flex"
              aria-label="georgia designs on instagram"
            >
              <InstagramLogo size={22} weight="light" />
            </a>
            <button
              type="button"
              onClick={cart.open}
              className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-ink/80 px-3.5 text-[0.9rem] sm:px-4 transition-colors hover:bg-ink hover:text-cream"
            >
              your stack
              <span
                className="inline-flex min-w-6 items-center justify-center rounded-full bg-aqua px-1.5 text-[0.8rem] font-medium tabular-nums text-ink"
                aria-label={`${cart.count} bracelets`}
              >
                {cart.count}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-oat lg:hidden"
              aria-label="open menu"
              aria-expanded={menuOpen}
            >
              <List size={24} weight="light" />
            </button>
          </div>
        </div>
      </motion.header>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="menu" side="full" className="bg-cream">
        <nav aria-label="mobile" className="container-site flex min-h-full flex-col pb-10 pt-6">
          <ul className="flex flex-col">
            {[{ href: "/", label: "home" }, ...nav, { href: "/care", label: "care & faq" }, { href: "/contact", label: "contact" }].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block py-2.5 font-serif text-[2.4rem] leading-tight aria-[current=page]:italic"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <BeadDivider className="my-8" variant="compact" />
          <div className="mt-auto flex flex-col gap-1 text-ink-soft">
            <a href={site.instagram.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2">
              <InstagramLogo size={20} weight="light" /> @{site.instagram.handle}
            </a>
            <p>venmo & paypal accepted</p>
          </div>
        </nav>
      </Drawer>
    </>
  );
}
