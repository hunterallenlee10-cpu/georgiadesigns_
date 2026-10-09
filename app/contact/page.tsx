import type { Metadata } from "next";
import { InstagramLogo, MapPin } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about a custom stack, an order, or a gift? Message georgia designs, handmade beaded bracelets based in Chapel Hill & High Point, NC.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const emailEnabled = Boolean(process.env.RESEND_API_KEY);
  return (
    <>
      <PageHeader
        title={
          <>
            Say <span className="warm">hi</span>
          </>
        }
        intro="Questions about a custom stack, an order, or a gift? The fastest way to reach Georgia is a DM."
      />
      <section className="container-site grid gap-12 pb-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="grid content-start gap-8">
          <a
            href={site.instagram.dm}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-ink px-7 text-cream transition-colors hover:bg-[#3a352e]"
          >
            <InstagramLogo size={20} /> DM @{site.instagram.handle}
          </a>
          <div className="grid gap-2 text-ink-soft">
            <p className="flex items-start gap-2">
              <MapPin size={20} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
              based in Chapel Hill & High Point, NC
            </p>
            <p>local meetups in both, or shipping.</p>
            <p>venmo & paypal accepted.</p>
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-paper p-6 sm:p-10">
          <h2 className="h3">Send a message</h2>
          <div className="mt-8">
            <InquiryForm
              kind="contact"
              emailEnabled={emailEnabled}
              submitLabel="send message"
              subject="message from {name}"
              fields={[
                { name: "name", label: "name", required: true, autoComplete: "name" },
                { name: "email", label: "email", type: "email", required: true, autoComplete: "email" },
                { name: "instagram", label: "instagram handle", wide: true },
                { name: "message", label: "message", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
