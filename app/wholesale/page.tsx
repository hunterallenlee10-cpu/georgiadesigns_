import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Photo } from "@/components/ui/Photo";
import { metalFilters } from "@/data/products";

export const metadata: Metadata = {
  title: "Wholesale",
  description:
    "Carry georgia designs in your boutique: handmade beaded bracelet stacks in 14k gold-plated, silver and pearl, made in North Carolina. Wholesale pricing & minimums on request.",
  alternates: { canonical: "/wholesale" },
};

const points = [
  { title: "handmade in NC", body: "Every bracelet is strung by hand in Chapel Hill and High Point." },
  { title: "an easy price point", body: "A $20 bracelet and a $50 stack of three are simple for customers to say yes to." },
  { title: "easy to merchandise", body: "Stacks by finish and bead size look great on a bust, in a dish, or by the register." },
];

export default function WholesalePage() {
  const emailEnabled = Boolean(process.env.RESEND_API_KEY);
  return (
    <>
      <PageHeader
        title={
          <>
            Carry georgia designs <span className="warm">in your boutique</span>
          </>
        }
        intro="Gold, silver and pearl stacks your customers will wear every day. Pricing & minimums shared on request."
      />

      <section className="container-site grid gap-12 pb-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <div className="relative aspect-[4/5] max-w-[480px] overflow-hidden rounded-[var(--radius-card)] bg-oat">
            <Photo
              file="market-table.jpg"
              alt="The georgia designs market table: gold and silver bracelets on pillows and a burlap stand, with aqua GD business cards"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <dl className="mt-10 grid gap-7">
            {points.map((p) => (
              <div key={p.title} className="border-t border-gold/60 pt-5">
                <dt className="font-serif text-[1.6rem] leading-tight">{p.title}</dt>
                <dd className="mt-1 text-ink-soft">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-paper p-6 sm:p-10">
          <h2 className="h3">Wholesale inquiry</h2>
          <p className="mt-2 text-ink-soft">Tell Georgia a little about your shop and she&apos;ll send pricing & minimums.</p>
          <div className="mt-8">
            <InquiryForm
              kind="wholesale"
              emailEnabled={emailEnabled}
              submitLabel="send inquiry"
              subject="wholesale inquiry from {business}"
              subjectFallback="a boutique"
              fields={[
                { name: "business", label: "business name", required: true, autoComplete: "organization" },
                { name: "name", label: "your name", required: true, autoComplete: "name" },
                { name: "email", label: "email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "phone", autoComplete: "tel" },
                { name: "location", label: "city & state", required: true, autoComplete: "address-level2" },
                { name: "website", label: "instagram or website" },
                {
                  name: "quantity",
                  label: "estimated quantity",
                  type: "select",
                  options: ["just starting, under 24", "24 to 50", "50 to 100", "100+"],
                },
                {
                  name: "finishes",
                  label: "preferred finishes",
                  hint: metalFilters.map((m) => m.label).join(", "),
                },
                { name: "message", label: "message", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
