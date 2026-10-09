# georgia designs

A spec website for **georgia designs**, Georgia's handmade beaded bracelet brand (Chapel Hill & High Point, NC). Built to pitch: a polished storefront with an interactive stack builder, ordering by Instagram DM or email, and no payment processing.

- **Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Motion · Vitest
- **Design notes:** see [`DESIGN.md`](./DESIGN.md) for palette, type scale, components and wireframes.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # pricing, order text, share codes, event dates
npm run lint
npm run build && npm start
```

Node 20.9+ is required.

## Pages

| route | what it is |
|---|---|
| `/` | home: hero, 3 for $50, shop by finish, essentials, materials, feed, game day, gifting, founder note, giving back, next event, wholesale |
| `/shop` | all bracelets with metal / bead size / type filters and sort (filters live in the URL, e.g. `/shop?metal=gold`) |
| `/shop/[slug]` | product detail: gallery, wrist size, quantity, 3-for-$50 progress, complete the stack, care / ordering / shipping |
| `/build-your-stack` | the stack builder. Share links encode the stack, e.g. `/build-your-stack?s=g4.pg4.g6&gift=1` |
| `/about` | Georgia's story and timeline |
| `/events` | upcoming and past markets, split by today's date automatically, with add-to-calendar and Google Maps |
| `/wholesale` | boutique pitch + inquiry form |
| `/care` | care, sizing and FAQ |
| `/contact` | DM button + message form |
| 404 | "this page slipped off the string" |

## Editing content (no coding needed beyond copy-paste)

All content lives in typed files under `data/`:

- **Products:** `data/products.ts`. Copy an entry, give it a new `slug`, set `type` (`single` or `stack`), and list its `bracelets` (finish + bead size). The drawing and the price ($20 single, $50 for three) come from that list automatically. `featured` controls order on the home page (`null` hides it there).
- **Events:** `data/events.ts`. Add an entry with `date: "YYYY-MM-DD"`. It shows as upcoming until the day passes, then moves to past markets. Use `status: "tba"` for a market without a date yet.
- **FAQ, care tips, material claims:** `data/faqs.ts`.
- **Site settings** (Instagram, contact email, Venmo / PayPal, promo bar): `data/site.ts` and the env vars below.
- **Pricing rules:** `lib/pricing.ts` (one function, unit tested in `lib/pricing.test.ts`).

## Photos

> These photos belong to Georgia Designs and are licensed for this site only. Don't reuse them in other projects or templates.

### Georgia's originals (`public/images/georgia/`)

38 photos from `georgia-designs-photos.zip`, each built as **AVIF + WebP at 400, 800 and 1440px** (the originals are 1440px wide, so the 1600 size is capped at 1440 rather than upscaled). The zip and the full-size JPEGs are never committed (`.gitignore` blocks `*.zip` and `georgia-designs-NN.jpg`).

- **One manifest:** `data/photos.json` holds every photo's id, source file, category, alt text, width/height, and the `placements` (hero, founder, about, holiday, instagram). Change a placement or alt text there and every page follows. `lib/photos.ts` is the typed reader.
- **Rebuild:** `npm run photos -- path/to/georgia-designs-photos.zip` (or a folder of the JPEGs). It unzips into the OS temp folder, writes the variants, and fills in width/height.
- **Rendering:** `components/ui/GeorgiaPhoto.tsx` outputs `<picture>` with AVIF/WebP `srcset` + `sizes`, explicit width/height (no layout shift), `loading="lazy"` everywhere except the hero, which is the only preloaded image.

| category | files | where it appears |
|---|---|---|
| gold & silver stacks | `gold-stack-01` … `10` | home hero (01), founder note (09), product cards and galleries, collections, Instagram strip |
| chinoiserie | `chinoiserie-stack-01` … `05` | shop collections (light navy band), Instagram strip |
| heishi & clay | `heishi-stack-01` … `04` | shop collections, Instagram strip |
| stone & glass | `stone-stack-01` … `07` | shop collections, Instagram strip |
| wood & shell | `neutral-stack-01` … `05` | shop collections, about page, Instagram strip |
| necklaces | `necklace-01` … `03` | shop collections |
| styled | `styled-01` | about page |
| ornaments | `ornament-01` … `03` | home holiday banner |

The Instagram strip sits above the footer on every page except home (home already has the "styled by you" grid) and links to @georgiadesigns_. Nothing is loaded from Instagram.

Category notes vs. the original guide: **03** (pastel stone beads in a palm) is filed under stone & glass, not heishi; **12** is gold-only and **07** is silver, both kept with the gold & silver stacks.

### Earlier screenshot crops (`public/images/*.jpg`)

21 photos cut from Instagram grid screenshots before the originals arrived. They still fill spots the zip doesn't cover (the 2024 bazaar flyer, the market table, the UNC game day photo, the "styled by you" grid, shop-by-finish tiles). They're lower resolution; swap or remove them once Georgia sends originals for those shots. `npm run images` rescans this folder.

**Still missing:** `logo.png` (her GD badge), `georgia.jpg` (optional portrait), and `archive-1.jpg` to `archive-4.jpg` (older gemstone and tassel pieces for the About timeline).

## How the live site updates

Vercel's production branch for this project is `claude/nice-goldberg-5br4td`. The workflow in `.github/workflows/sync-production.yml` fast-forwards that branch to `main` on every push to `main`, so **merging into `main` publishes the site** with no Vercel setting changes. If you later set Vercel's production branch to `main` (Settings → Environments → Production → Branch Tracking), delete that workflow.

## Deploy to Vercel

1. Push this repo to GitHub and import it at vercel.com/new. Framework preset: Next.js. No build settings to change.
2. Add environment variables (Project → Settings → Environment Variables):

| variable | required | what it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | the live URL, e.g. `https://georgiadesigns.com` (used for SEO, sitemap, OG) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | yes | where email orders and inquiries go (shown only inside `mailto:` links). Use a business inbox, not a personal one |
| `NEXT_PUBLIC_VENMO_HANDLE` | yes | shown on the order confirmation |
| `NEXT_PUBLIC_PAYPAL_LINK` | yes | shown on the order confirmation |
| `RESEND_API_KEY` | optional | turns on sending orders and forms straight from the site |
| `ORDER_INBOX` | optional | inbox for Resend emails (defaults to `NEXT_PUBLIC_CONTACT_EMAIL`) |
| `RESEND_FROM` | optional | verified sender, e.g. `georgia designs <orders@georgiadesigns.com>` |

3. Redeploy after changing env vars (they're read at build time).

## Turning on Resend (optional)

Without Resend, orders go out as an Instagram DM (the order text is copied to the clipboard and `ig.me/m/georgiadesigns_` opens) or as a prefilled email. With Resend:

1. Create an account at resend.com and verify the sending domain.
2. Set `RESEND_API_KEY`, `RESEND_FROM` and (optionally) `ORDER_INBOX` in Vercel and redeploy.
3. The order drawer and the wholesale / contact forms show a **send** button that posts to `app/api/order/route.ts`, which emails Georgia and sends the customer a copy.

Until a domain is verified, Resend's test sender (`onboarding@resend.dev`) can only email the Resend account owner.

## Adding payments later

There's no checkout in v1 (Georgia takes Venmo & PayPal). The hook is marked `[HOOK]` in `app/api/order/route.ts`: create a Stripe Checkout session there, or replace the drawer's send buttons in `components/cart/OrderDrawer.tsx` with a Shopify Buy Button. Cart lines (`lib/order.ts`) already carry slug, bracelets, quantity and wrist size.

## Checklist for Georgia: every `[CONFIRM]` placeholder

Nothing below was invented as fact; each item is a draft or placeholder that needs Georgia's sign-off. Search the code for `CONFIRM` to find them.

**Brand assets & permissions**
- [ ] Logo file (`public/images/logo.png`). Until then the site uses a plain "gd" type badge, not a redrawn logo
- [ ] Favicon / app icons: `app/icon.svg` is a placeholder "gd" monogram. Replace with her GD mark, then run `node scripts/make-icons.mjs`
- [x] Permission to use her Instagram photos on this site (confirmed)
- [ ] Original files for the 21 screenshot crops still in `public/images/` (bazaar flyer, market table, game day, coffee shots)
- [ ] Photo-to-product matches in `data/products.ts` (`photo` / `wristPhoto`), e.g. which photo shows the Mixed Metals single
- [ ] The shop "collections" (chinoiserie, heishi, stone, wood & shell, necklaces, ornaments) are photo-only with a DM link; add products and prices if she sells them now
- [ ] OK to mention Gracie Lou and UNC on the site

**Products** (`data/products.ts`)
- [ ] All 12 product names (e.g. "The Essential: 4mm Gold", "The Pearl Party Stack")
- [ ] All product descriptions and one-liners
- [ ] Bead size of Mixed Metals, Pearl & Gold and Pearl & Silver singles (drafted as 4mm)
- [ ] The bracelets inside the Mixed Metals Stack and Pearl Party Stack
- [ ] Which products are featured on the home page

**Sizing**
- [ ] Wrist sizes: small 6", standard 6.5", large 7" (placeholders)
- [ ] Fit allowance in the size guide ("add about half an inch")

**Ordering, shipping & policies**
- [ ] Shipping cost and shipping time
- [ ] Return / exchange policy (none is stated anywhere yet)
- [ ] Local meetups in Chapel Hill and High Point are OK as delivery options
- [ ] Wholesale: "pricing & minimums shared on request" wording; quantity ranges in the form

**Contact & payment**
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` (a business inbox)
- [ ] Venmo handle and PayPal link
- [ ] Final domain (`NEXT_PUBLIC_SITE_URL`)

**Events & dates**
- [ ] Carolina Christmas Bazaar 2026 date (currently "date coming soon")
- [ ] Past event dates: Nov 15, 2025; Nov 16, 2024; Jewels of Hope Apr 8 to 12, 2024
- [ ] Timeline years on the About page (2016, 2017, 2017 to 2022, 2021, 2023, 2024)

**Copy in her voice**
- [ ] Founder note on the home page and the About page story
- [ ] Care tips (written as general tips, not guarantees)
- [ ] FAQ answers marked `[CONFIRM WITH GEORGIA]` (shipping, sizing)

## Project layout

```
app/                 routes, metadata, sitemap, robots, manifest, OG image, /api/order
components/beads/    bracelet renderer (BraceletArt, WristScene, AnimatedStack)
components/builder/  stack builder
components/cart/     cart store (localStorage), order drawer
components/home/     home page sections
components/shop/     product card, filters, gallery, add to stack
components/ui/       Button, BeadDivider, Photo, Drawer, Accordion, ornaments
data/                products, events, FAQ, site settings  ← edit these
lib/                 pricing, order text, beads geometry, share codes, ics
scripts/             image scan, icon generation
```
