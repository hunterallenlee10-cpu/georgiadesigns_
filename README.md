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

## Swapping in photos

Drop files into `public/images/` with these exact names. The build scans the folder (`scripts/scan-images.mjs`) and swaps each placeholder for the real photo, with blur-up previews and AVIF/WebP via `next/image`. Until a photo exists, the site shows a styled placeholder naming the file, or draws the bracelets from data.

| file | what it should show |
|---|---|
| `logo.png` | the round aqua GD badge (transparent PNG). Used in the nav, footer and hero seal |
| `hero.jpg` | wrist with a gold & pearl stack, sweater sleeve, warm light |
| `stack-pearl-mixed.jpg` | gold, silver & pearl stack, grey sleeve |
| `stack-watch.jpg` | gold stack with a vintage gold watch and pearls |
| `stack-6mm-gold.jpg` | chunky 6mm gold stack |
| `stack-4mm-silver.jpg` | petite 4mm silver stack |
| `flatlay-table.jpg` | bracelets on burlap with the aqua GD business cards |
| `handful-pearls.jpg` | a handful of gold & pearl bracelets on a striped shirt |
| `plate-gold.jpg` | gold bracelets on a blue-and-white chinoiserie plate |
| `bow-tee.jpg` | three gold bracelets, white tee, pink bow |
| `coffee-1.jpg`, `coffee-2.jpg` | iced latte with the stack |
| `denim-ring.jpg` | hand on denim, gold ring, red nails, stack |
| `gameday-unc.jpg` | the stack with a UNC jersey |
| `disco.jpg` | colorful stack holding a disco ball |
| `market-table.jpg` | the bazaar table with the aqua GD sign |
| `georgia.jpg` | *(optional)* a portrait of Georgia; used instead of the market table in the founder note |
| `archive-1.jpg` … `archive-4.jpg` | older gemstone, wood & tassel and stone pieces on white marble |

Product photos are set per product in `data/products.ts` (`images` and `wristImage`).

After adding photos, run `npm run images` (or just restart `npm run dev`).

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
- [ ] Permission to use each Instagram photo listed above (and any photos of customers)
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
