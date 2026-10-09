import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { BeadDefs } from "@/components/beads/BeadDefs";
import { CartProvider } from "@/components/cart/CartProvider";
import { OrderDrawer } from "@/components/cart/OrderDrawer";
import { PromoBar } from "@/components/layout/PromoBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InstagramStrip } from "@/components/photos/InstagramStrip";
import { JsonLd } from "@/components/JsonLd";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: "500",
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // only used for the sign-off, below the fold
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "georgia designs | handmade beaded bracelets, Chapel Hill & High Point NC",
    template: "%s | georgia designs",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "handmade beaded bracelets",
    "gold bracelet stack",
    "14k gold-plated bracelets",
    "Chapel Hill",
    "High Point NC",
    "UNC",
    "gift",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7F0",
  colorScheme: "light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
  description: site.description,
  foundingDate: String(site.since),
  founder: { "@type": "Person", name: site.founder },
  sameAs: [site.instagram.url],
  areaServed: site.locations,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const emailEnabled = Boolean(process.env.RESEND_API_KEY);
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${pinyon.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[80] rounded-full bg-ink px-5 py-3 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          skip to content
        </a>
        <BeadDefs />
        <JsonLd data={organization} />
        <CartProvider emailEnabled={emailEnabled}>
          <PromoBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <InstagramStrip />
          <Footer />
          <OrderDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
