import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, productPrice, products, type Product } from "@/data/products";
import { careTips } from "@/data/faqs";
import { site } from "@/data/site";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToStack } from "@/components/shop/AddToStack";
import { ProductCard } from "@/components/shop/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/JsonLd";
import { describeBracelet, finishLabel } from "@/lib/beads";
import { formatPrice } from "@/lib/pricing";
import { getPhoto, photoSrc } from "@/lib/photos";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const price = formatPrice(productPrice(p));
  return {
    title: p.name,
    description: `${p.name}: ${p.short}. Handmade beaded ${p.type === "stack" ? "bracelet stack" : "bracelet"}, ${price}. 14k gold-plated beads, stretch fit, made in Chapel Hill & High Point, NC.`,
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { title: `${p.name} | georgia designs`, url: `/shop/${p.slug}` },
  };
}

function completeTheStack(p: Product) {
  return products
    .filter((x) => x.slug !== p.slug && x.type === "single" && x.metal !== p.metal)
    .sort((a, b) => (a.featured ?? 50) - (b.featured ?? 50))
    .slice(0, 3);
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const price = productPrice(p);
  const sizes = [...new Set(p.bracelets.map((b) => `${b.size}mm`))].join(" + ");
  const finishes = [...new Set(p.bracelets.map((b) => finishLabel(b.finish)))].join(", ");
  const suggestions = completeTheStack(p);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.slug,
    brand: { "@type": "Brand", name: site.legalName },
    image: getPhoto(p.photo)
      ? [`${site.url}${photoSrc(getPhoto(p.photo)!, getPhoto(p.photo)!.widths.at(-1)!, "webp")}`]
      : p.images.length
        ? p.images.map((f) => `${site.url}/images/${f}`)
        : [`${site.url}/opengraph-image`],
    url: `${site.url}/shop/${p.slug}`,
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/shop/${p.slug}`,
    },
  };

  return (
    <>
      <JsonLd data={productLd} />
      <div className="container-site pt-6 md:pt-10">
        <nav aria-label="breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="hover:text-ink">
                shop
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {p.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-site grid gap-10 pb-20 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-28">
        <ProductGallery product={p} />

        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-serif text-[clamp(2.4rem,4vw,3.4rem)] font-medium leading-[1.05]">{p.name}</h1>
          <p className="mt-3 text-xl">
            {formatPrice(price)}
            {p.type === "stack" ? <span className="text-ink-soft"> · stack of 3</span> : null}
          </p>
          {p.type === "single" && <p className="mt-1 text-sm text-ink-soft">or any 3 for $50</p>}
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] text-ink-soft">{p.description}</p>

          <ul className="mt-6 grid gap-2 text-[0.95rem]">
            {[
              p.type === "stack" ? `three bracelets: ${p.bracelets.map(describeBracelet).join(", ")}` : `${sizes} beads`,
              `finish: ${finishes}`,
              "14k gold-plated beads, won't tarnish or turn",
              "stretch fit, rolls right on",
              "handmade in North Carolina",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-[0.55em] size-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <AddToStack product={p} />
          </div>

          <Accordion
            className="mt-10"
            items={[
              {
                title: "care",
                body: (
                  <>
                    <p>They can be exposed to water and sweat, and the plated gold beads won&apos;t tarnish or turn.</p>
                    <p>{careTips.map((t) => t.body).slice(0, 2).join(" ")}</p>
                    <p>
                      <Link href="/care" className="link-underline text-ink">
                        care & sizing guide
                      </Link>
                    </p>
                  </>
                ),
              },
              {
                title: "ordering & payment",
                body: (
                  <>
                    <p>
                      Add bracelets to your stack and send the order as an Instagram DM or email. Georgia confirms it and
                      sends venmo / paypal details. No payment is taken on this site.
                    </p>
                  </>
                ),
              },
              {
                title: "local pickup & shipping",
                body: (
                  <>
                    <p>Meet up locally in Chapel Hill or High Point, or have it shipped.</p>
                    <p>[CONFIRM WITH GEORGIA: shipping cost, shipping time, and return / exchange policy.]</p>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="border-t border-line bg-oat py-16 md:py-24" aria-labelledby="complete-title">
          <div className="container-site">
            <h2 id="complete-title" className="h2">
              Complete <span className="warm">the stack</span>
            </h2>
            <p className="lede mt-3">
              {p.type === "stack"
                ? "Every bracelet you add counts toward your next 3 for $50."
                : "Add two more and all three are $50."}
            </p>
            <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
              {suggestions.map((s) => (
                <li key={s.slug}>
                  <ProductCard product={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
