import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { ProductCard } from "@/components/shop/ProductCard";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop handmade beaded bracelets",
  description:
    "Shop handmade beaded bracelets in 14k gold-plated, silver, mixed metals and pearl. 4mm and 6mm stacks, $20 each or any 3 for $50. Made in Chapel Hill & High Point, NC.",
  alternates: { canonical: "/shop" },
};

/** Static fallback: the unfiltered catalog, so the page has content before the filters hydrate. */
function AllProducts() {
  return (
    <>
      <h2 className="sr-only">Bracelets</h2>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            All <span className="warm">bracelets</span>
          </>
        }
        intro={
          <>
            Every bracelet is $20, and any 3 are $50. Mix singles, grab a
            ready-made stack, or{" "}
            <Link href="/build-your-stack" className="link-underline text-ink">
              build your own
            </Link>
            .
          </>
        }
      />
      <div className="container-site pb-24">
        <Suspense fallback={<AllProducts />}>
          <ShopGrid />
        </Suspense>
      </div>
    </>
  );
}
