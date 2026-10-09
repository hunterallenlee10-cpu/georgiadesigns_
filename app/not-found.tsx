import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { BraceletArt } from "@/components/beads/BraceletArt";

export default function NotFound() {
  return (
    <section className="container-site flex flex-col items-center py-20 text-center md:py-28">
      <BraceletArt
        bracelets={[
          { finish: "gold", size: 4 },
          { finish: "pearl-gold", size: 4 },
        ]}
        className="w-56 opacity-90"
      />
      <h1 className="display mt-8 max-w-[16ch] text-[clamp(2.4rem,5vw,4rem)]">
        This page slipped <span className="warm">off the string.</span>
      </h1>
      <p className="lede mt-5 text-center">The link might be old, or the page moved. Let&apos;s get you back to the good stuff.</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <ButtonLink href="/shop">Shop bracelets</ButtonLink>
        <Link href="/" className="link-underline min-h-11 py-2.5">
          back home
        </Link>
      </div>
    </section>
  );
}
