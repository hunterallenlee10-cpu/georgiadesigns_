import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/build-your-stack", "/about", "/events", "/wholesale", "/care", "/contact"];
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : p === "/shop" || p === "/build-your-stack" ? 0.9 : 0.6,
    })),
    ...products.map((p) => ({
      url: `${site.url}/shop/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
