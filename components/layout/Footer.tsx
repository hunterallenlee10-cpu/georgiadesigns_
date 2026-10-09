import Link from "next/link";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { footerNav, site } from "@/data/site";
import { getToday } from "@/lib/today";
import { LogoBadge } from "@/components/ui/Badge";
import { HomeLink } from "./HomeLink";

export async function Footer() {
  const year = (await getToday()).slice(0, 4);
  return (
    <footer className="mt-auto bg-oat">
      {/* a line of bead dots as the top border */}
      <div
        aria-hidden="true"
        className="h-3 bg-[radial-gradient(circle_at_center,#c9a24a_0_3.2px,transparent_3.6px)] bg-[length:14px_12px] bg-repeat-x opacity-80"
      />
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <HomeLink className="inline-flex items-center gap-3">
            <LogoBadge size={52} />
            <span className="font-serif text-3xl italic">georgia designs</span>
          </HomeLink>
          <p className="mt-5 text-ink-soft">
            Handmade beaded bracelets by Georgia, strung in Chapel Hill and High Point, NC since {site.since}.
          </p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium"
          >
            <InstagramLogo size={22} weight="light" />
            <span className="link-underline">@{site.instagram.handle}</span>
          </a>
        </div>
        {footerNav.map((col) => (
          <div key={col.title}>
            <p className="label text-ink-soft">{col.title}</p>
            <ul className="mt-4 grid gap-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-gold-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>venmo & paypal accepted. dm for shipping & wholesale.</p>
          <p>
            © {year} {site.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
