# georgia designs: design doc

**Design read:** a premium-consumer storefront for college women, gift buyers and boutique owners, in a "Southern preppy meets everyday gold" language: cream knit, gold beads, pearls, a pop of aqua from Georgia's own badge. Polished like a DTC jewelry brand, personal like her Instagram.

**Dials:** variance 7 (asymmetric splits, a masonry feed, one full-bleed band), motion 5 (hero entrance, beads that string in, a spring when a bracelet drops on the wrist, nothing looping except the badge), density 3 (airy, gallery-like).

## Palette

The brief names the palette, so this is a brand-mandated palette, not a default reach. Tokens live in `app/globals.css` (`@theme`).

| token | hex | job |
|---|---|---|
| `cream` | `#FBF7F0` | page background (knit sweaters, pearls) |
| `paper` | `#FFFDF9` | cards, drawer, inputs |
| `oat` | `#F4EDE1` | quiet alternate section band |
| `line` | `#E6DBC7` | 1px hairlines |
| `ink` | `#1B1B1B` | text, primary buttons (16.1:1 on cream) |
| `ink-soft` | `#5A534A` | secondary text (7.1:1 on cream) |
| `gold` | `#C9A24A` | beads, numerals in display sizes, focus ring, hairlines. never small text |
| `gold-soft` | `#E9D7A5` | hover fills, bead highlights |
| `gold-deep` | `#7C5E17` | gold-toned small text (5.7:1 on cream) |
| `aqua` | `#4FC3C7` | brand moments only: badge, cart count, order bar. never body text |
| `aqua-deep` | `#16696C` | aqua-toned text when needed (6.0:1 on cream) |
| `bow` | `#F4B6C2` | tiny accents: the bow, the gift toggle |
| `carolina` | `#7BAFD4` | game-day band only |

Theme is locked to light. The brand lives on cream; a dark mode would lose the knit-and-pearl feel, so `color-scheme: light` is set deliberately.

## Type

- **Display:** Cormorant Garamond 500/600, with its italic for warm phrases ("everyday gold", "your stack"). Used at 28px and up only (it is a thin face).
- **Body / UI:** DM Sans 400/500/600.
- **Script:** Pinyon Script, exactly two places: the "xoxo, georgia" sign-off and the order confirmation.
- Lowercase for nav, labels, small eyebrows (her voice). Headlines in sentence case.

Scale (fluid with `clamp`):

| role | size | line-height |
|---|---|---|
| display | clamp(2.75rem, 6.2vw, 5.25rem) | 1.02 (1.1 when italics carry descenders) |
| h2 | clamp(2.1rem, 4.2vw, 3.4rem) | 1.08 |
| h3 | 1.6rem serif / 1.125rem sans | 1.2 |
| body | 1rem (1.0625 on desktop) | 1.65 |
| small | 0.875rem | 1.5 |
| label | 0.8125rem, lowercase, +0.04em | 1.3 |

## Spacing and shape

- 4px base. Section padding `py-20 md:py-28`. Container `max-w-[1320px] px-4 sm:px-6 lg:px-10`.
- Shape rule: **buttons and chips are full pills; cards and photos are 12px; inputs are 10px.** No other radii.
- Shadows only on floating layers (drawer, sticky nav once scrolled), tinted warm: `0 10px 40px -12px rgb(91 72 34 / .18)`.

## Motifs

- **Bead divider:** an SVG row of gold and pearl beads on a hairline that strings in from the left on scroll.
- **Bubble ring:** the logo's ring of pearl bubbles, drawn as an SVG frame around the founder photo only.
- **Bow:** line-art bow on the gifting section only.
- **Bracelet renderer:** one geometry module (`lib/beads.ts` + `components/beads/*`) draws every bracelet on the site from data (finish, bead size, pearl pattern). It powers the stack builder, the product art when photos are missing, and the wrist preview.

## Components

Button (primary / outline / text link), Pill, BeadDivider, BubbleRing, Bow, SectionHeader, Photo (next/image with blur, or a styled placeholder naming the missing file), BraceletArt, WristScene, ProductCard, Swatch, Drawer, Accordion, Toast, OrderDrawer, ShopGrid, StackBuilder, InquiryForm, JsonLd.

## Page wireframes (text)

**Home**
1. Hero: asymmetric split. Left: headline, sub, two CTAs. Right: tall 4:5 photo (hero.jpg) with the rotating badge overlapping its corner.
2. 3 for $50: three numerals in gold serif on a hairline row (metal, size, three) next to a live-rendered three-bracelet stack. One CTA.
3. Shop by finish: four tall tiles, 2x2 on mobile, 4-up on desktop.
4. The essentials: snap-scroll row on mobile, 4-up grid on desktop.
5. Won't tarnish: split, macro photo left, four plain claims right.
6. The feed: masonry, 10 photos, follow button.
7. Game day: one full-bleed carolina-blue band.
8. Gifting: bow motif, copy, CTA to builder with gift toggle on.
9. Founder note: bubble-ring framed photo, letter, script sign-off.
10. Giving back: quiet bordered card, text only.
11. Next event: card from `data/events.ts`.
12. Wholesale teaser: single line + link.
13. Footer.

**Shop:** title, filter chips (metal, bead size, type) + sort, grid of cards. Empty state if filters match nothing.
**Product:** gallery left, details right (price, bullets, wrist size, qty, add, bundle progress), complete-the-stack row, accordion.
**Build your stack:** wrist preview left (sticky on desktop), steps right: slots, swatch grid, surprise me, price (aria-live), gift toggle + note, add to order, share link.
**About:** story intro, bead-string vertical timeline, archive gallery, Gracie Lou, sign-off.
**Events:** upcoming (or empty state), past list.
**Wholesale:** pitch, form. **Care:** care tips + FAQ accordion. **Contact:** form + DM button. **404:** "this page slipped off the string."
