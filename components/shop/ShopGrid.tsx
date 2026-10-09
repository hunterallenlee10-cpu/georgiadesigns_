"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { metalFilters, products, productPrice, sizeFilters, typeFilters, type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { BraceletArt } from "@/components/beads/BraceletArt";

type Sort = "featured" | "price-asc" | "price-desc";

function parseList(v: string | null) {
  return v ? v.split(",").filter(Boolean) : [];
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-[0.9rem] transition-colors ${
        active ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink hover:border-ink/50"
      }`}
    >
      {children}
    </button>
  );
}

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const metals = parseList(params.get("metal"));
  const sizes = parseList(params.get("size"));
  const types = parseList(params.get("type"));
  const sort = (params.get("sort") as Sort) || "featured";

  const setParam = (key: string, values: string[] | string | null) => {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(values) ? values.join(",") : values;
    if (v) next.set(key, v);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggle = (key: string, list: string[], id: string) =>
    setParam(key, list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const shown = useMemo(() => {
    const out: Product[] = products.filter(
      (p) =>
        (metals.length === 0 || metals.includes(p.metal)) &&
        (sizes.length === 0 || sizes.includes(p.size)) &&
        (types.length === 0 || types.includes(p.type)),
    );
    const featuredRank = (p: Product) => (p.featured ?? 50) + products.indexOf(p) / 100;
    return out.sort((a, b) =>
      sort === "price-asc"
        ? productPrice(a) - productPrice(b) || featuredRank(a) - featuredRank(b)
        : sort === "price-desc"
          ? productPrice(b) - productPrice(a) || featuredRank(a) - featuredRank(b)
          : featuredRank(a) - featuredRank(b),
    );
  }, [metals, sizes, types, sort]);

  const anyFilter = metals.length + sizes.length + types.length > 0;

  return (
    <div>
      <div className="grid gap-5 border-y border-line py-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="grid gap-4">
          <FilterRow label="metal">
            {metalFilters.map((f) => (
              <Chip key={f.id} active={metals.includes(f.id)} onClick={() => toggle("metal", metals, f.id)}>
                {f.label}
              </Chip>
            ))}
          </FilterRow>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            <FilterRow label="bead size">
              {sizeFilters.map((f) => (
                <Chip key={f.id} active={sizes.includes(f.id)} onClick={() => toggle("size", sizes, f.id)}>
                  {f.label}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="type">
              {typeFilters.map((f) => (
                <Chip key={f.id} active={types.includes(f.id)} onClick={() => toggle("type", types, f.id)}>
                  {f.label}
                </Chip>
              ))}
            </FilterRow>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="label text-ink-soft">
            sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)}
            className="field !w-auto pr-9"
          >
            <option value="featured">featured</option>
            <option value="price-asc">price, low to high</option>
            <option value="price-desc">price, high to low</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between py-5 text-sm text-ink-soft">
        <p aria-live="polite">
          {shown.length} {shown.length === 1 ? "bracelet" : "bracelets"}
        </p>
        {anyFilter && (
          <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="link-underline min-h-11 text-ink">
            clear filters
          </button>
        )}
      </div>

      <h2 className="sr-only">Bracelets</h2>
      {shown.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
          {shown.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <BraceletArt bracelets={[{ finish: "pearl-silver", size: 4 }]} className="w-40 opacity-80" />
          <p className="mt-4 font-serif text-3xl">no bracelets match that combo</p>
          <p className="mt-2 text-ink-soft">Try fewer filters, or build exactly what you want.</p>
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="link-underline mt-6 min-h-11"
          >
            clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="min-w-0 sm:flex sm:items-center sm:gap-2">
      <span className="label mb-2 block text-ink-soft sm:mb-0 sm:mr-2">{label}</span>
      {/* chips scroll sideways on phones instead of stacking up */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {children}
      </div>
    </div>
  );
}
