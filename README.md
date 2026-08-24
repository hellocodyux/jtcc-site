# Joshua Tree Catering Co. — Website

Static site. Astro + Tailwind, deployed to Vercel. Single page with anchor navigation.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:4321
```

Requires Node 18.17+ (20 or 22 recommended).

Other commands:

```bash
npm run build        # static output to dist/
npm run preview      # serve the built site locally
npm run assets       # pull remote photos into src/assets/images/
```

---

## Editing content

**All copy and content lives in `src/content/content.json`.** Components read from it — you shouldn't need to touch a `.astro` file to change words, prices, or photos.

Anything tagged `_PLACEHOLDER` in that file is awaiting real content. Three things need replacing before launch:

| What | Where | Status |
|---|---|---|
| Real menu | `menus.sections` | Currently Wix template filler |
| Testimonials | `testimonials.quotes` | **Fabricated** — must be replaced |
| Services offered | `parties.services` | Drafted, needs confirming |

### The menu

What's in there now came from a Wix template and is not JTCC's food. The real menus are in these files from the media export:

- `TACO WEB MENU.jpg`
- `WEBSITE DROP OFF CATER (8.5 x 45 in).png`
- `WEBITE XTRA INFO.png`
- `smaller font-5.jpg`

Transcribe them, write the descriptions in brand voice (see the `jtcc-brand` skill, `references/menu-language.md`), and replace the `sections` array. Keep the shape — `id`, `name`, `description`, `price`, `dietary`, `image` — because the commerce layer depends on it.

### Photos

Two ways to get images in:

1. **`npm run assets`** — downloads everything referenced in `content.json` from the Wix CDN into `src/assets/images/`, named by `key`.
2. **Manually** — drop files into `src/assets/images/` named to match the `key` field, e.g. `hero.jpg`.

Either way, once a local file exists, Astro optimizes it (responsive `srcset`, WebP/AVIF). Until then the site falls back to the Wix URL, so nothing breaks.

---

## Structure

```
src/
├── content/content.json     ← all copy and content
├── config.ts                ← feature flags
├── styles/global.css        ← design tokens + the long-table CSS
├── layouts/Base.astro       ← html shell, fonts, scroll reveal
├── components/
│   ├── Nav · Hero · Intro
│   ├── Menus · Parties · Media · Testimonials · Contact
│   ├── Figure.astro         ← local-or-remote image handling
│   └── Seo.astro            ← meta tags + LocalBusiness JSON-LD
├── lib/commerce/            ← Stripe-ready, not yet active
└── pages/index.astro        ← composes the single page
```

### Design

Palette and type come from the `jtcc-brand` skill and are defined once in `global.css` under `@theme`. Tailwind picks them up automatically as `bg-cream`, `text-ember`, `font-display`, and so on. Change a token there and it propagates everywhere.

The signature element is the **long table** in the Menus section — dishes set alternately either side of a hairline, like place settings facing each other. It's `.longtable` / `.longtable-row` in `global.css`, and collapses to a single column below 900px.

---

## Adding Stripe later

The commerce layer is already separated so this is wiring rather than refactoring.

- `src/lib/commerce/types.ts` — line item shapes, matching Stripe's expectations
- `src/lib/commerce/catalog.ts` — turns menu content into priced line items, dollars → cents
- `src/lib/commerce/checkout.ts` — stub with both integration paths documented
- `src/config.ts` — `features.checkout` is the single switch that reveals commerce UI

**Two paths**, both written up in `checkout.ts`:

**A. Payment Links** — create links in the Stripe dashboard, store URLs in `content.json`, link out. No backend, site stays fully static. For a caterer taking deposits, this is usually enough.

**B. Checkout Sessions** — add `@astrojs/vercel`, switch to `output: 'hybrid'`, add `src/pages/api/checkout.ts` with `export const prerender = false`. Only that route becomes dynamic.

---

## Deploying

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new). Vercel detects Astro automatically — framework preset Astro, build `npm run build`, output `dist`.
3. Preview deployments per branch are on by default; every PR gets its own URL.

### Before cutover

- [ ] Replace placeholder menu with real content
- [ ] Replace fabricated testimonials with real quotes
- [ ] Confirm the services list is accurate
- [ ] Run `npm run assets` and commit the images
- [ ] Update `site` in `astro.config.mjs` if the domain differs
- [ ] Update the sitemap URL in `public/robots.txt`
- [ ] Replace `public/favicon.svg` with the real mark
- [ ] Run Lighthouse (aim 95+ across the board)
- [ ] Check Safari, Firefox, Chrome, and a real phone
- [ ] Point DNS — keep the Wix site live until the new one is verified

**Keep Wix running until launch.** It's the source of truth, and it's still handling email, invoicing, and payments. Cancel nothing until those are replaced.
