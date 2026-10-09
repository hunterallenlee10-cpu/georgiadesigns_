import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Accordion } from "@/components/ui/Accordion";
import { BeadDivider } from "@/components/ui/BeadDivider";
import { JsonLd } from "@/components/JsonLd";
import { careTips, faqs, materialClaims } from "@/data/faqs";
import { wristSizes } from "@/data/products";

export const metadata: Metadata = {
  title: "Care, sizing & FAQ",
  description:
    "How to care for your 14k gold-plated beaded bracelets, how to find your wrist size, and answers about ordering, Venmo & PayPal, shipping and local pickup in Chapel Hill & High Point.",
  alternates: { canonical: "/care" },
};

export default function CarePage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <PageHeader
        title={
          <>
            Care, sizing <span className="warm">& questions</span>
          </>
        }
        intro="They're made to be worn every day. A little care keeps them looking new."
      />

      <section className="container-site pb-16" aria-labelledby="care-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="care-title" className="h3">
              What they&apos;re made of
            </h2>
            <dl className="mt-6 grid gap-6">
              {materialClaims.map((c) => (
                <div key={c.title} className="border-t border-gold/60 pt-4">
                  <dt className="font-serif text-[1.5rem] leading-tight">{c.title}</dt>
                  <dd className="mt-1 text-ink-soft">{c.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[var(--radius-card)] bg-oat p-6 sm:p-10">
            <h2 className="h3">Care tips</h2>
            <p className="mt-2 text-sm text-ink-soft">General tips to make your stack last.</p>
            <ol className="mt-6 grid gap-6">
              {careTips.map((t, i) => (
                <li key={t.title} className="grid grid-cols-[2.25rem_1fr] gap-2">
                  <span className="font-serif text-3xl italic leading-none text-gold" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-ink-soft">{t.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="container-site">
        <BeadDivider />
      </div>

      <section id="sizing" className="container-site py-16" aria-labelledby="size-title">
        <h2 id="size-title" className="h3">
          Finding your size
        </h2>
        <p className="mt-2 max-w-[60ch] text-ink-soft">
          Wrap a soft tape measure or a strip of paper around your wrist bone, then add about half an inch for a comfy
          fit. [CONFIRM WITH GEORGIA: fit allowance]
        </p>
        <ul className="mt-6 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {wristSizes.map((w) => (
            <li key={w.id} className="rounded-[var(--radius-card)] border border-line bg-paper p-5 text-center">
              <p className="font-serif text-2xl">{w.label}</p>
              <p className="text-ink-soft">{w.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink-soft">Bracelet sizes above are drafts. [CONFIRM WITH GEORGIA: sizes]</p>
      </section>

      <section className="container-site pb-24" aria-labelledby="faq-title">
        <h2 id="faq-title" className="h2">
          FAQ
        </h2>
        <Accordion
          className="mt-8 max-w-3xl"
          items={faqs.map((f) => ({
            title: f.q,
            body: (
              <p>
                {f.a}
                {f.confirm ? " [CONFIRM WITH GEORGIA]" : ""}
              </p>
            ),
          }))}
        />
        <p className="mt-8 text-ink-soft">
          Still wondering?{" "}
          <Link href="/contact" className="link-underline text-ink">
            Send Georgia a message
          </Link>
          .
        </p>
      </section>
    </>
  );
}
