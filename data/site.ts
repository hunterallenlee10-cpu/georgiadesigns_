// Site-wide settings. Values read from env vars can be changed in Vercel
// without touching code. Anything marked [CONFIRM] needs Georgia's sign-off.

export const site = {
  name: "georgia designs",
  legalName: "Georgia Designs",
  tagline: "handmade beaded bracelets",
  bio: "handmade jewelry by @georgiadorn",
  description:
    "Handmade beaded bracelets by Georgia, from Chapel Hill to High Point, NC. 14k gold-plated, silver and pearl stacks. $20 each, or any 3 for $50.",
  // [CONFIRM] final domain
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://georgiadesigns.vercel.app").replace(/\/$/, ""),
  since: 2016,
  founder: "Georgia",
  instagram: {
    handle: "georgiadesigns_",
    url: "https://www.instagram.com/georgiadesigns_/",
    // opens a DM thread in the Instagram app / web
    dm: "https://ig.me/m/georgiadesigns_",
  },
  founderInstagram: "georgiadorn",
  // [CONFIRM] never hard-code Georgia's personal email; set CONTACT_EMAIL in Vercel
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  // [CONFIRM] payment handles
  venmo: process.env.NEXT_PUBLIC_VENMO_HANDLE ?? "@VENMO_HANDLE",
  paypal: process.env.NEXT_PUBLIC_PAYPAL_LINK ?? "PAYPAL_LINK",
  locations: ["Chapel Hill, NC", "High Point, NC"],
  meetups: ["Chapel Hill", "High Point"],
  promo: { offer: "any 3 bracelets for $50", extra: "✨ handmade in north carolina" },
} as const;

export const nav = [
  { href: "/shop", label: "shop" },
  { href: "/build-your-stack", label: "build your stack" },
  { href: "/about", label: "about" },
  { href: "/events", label: "events" },
  { href: "/wholesale", label: "wholesale" },
] as const;

export const footerNav = [
  {
    title: "shop",
    links: [
      { href: "/shop", label: "all bracelets" },
      { href: "/shop?type=stack", label: "stacks of three" },
      { href: "/build-your-stack", label: "build your stack" },
      { href: "/care", label: "care & sizing" },
    ],
  },
  {
    title: "georgia designs",
    links: [
      { href: "/about", label: "our story" },
      { href: "/events", label: "markets & events" },
      { href: "/wholesale", label: "wholesale" },
      { href: "/contact", label: "contact" },
    ],
  },
] as const;
