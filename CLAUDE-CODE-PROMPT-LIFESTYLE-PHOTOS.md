# Claude Code prompt — Incorporate lifestyle photography across the SUB site

Paste everything below this line into a fresh Claude Code session, running at the repo root.

---

You are working on **SUB**, a Next.js 15 / TypeScript / Tailwind + shadcn/ui e-commerce site that sells exclusive all-over-print sublimation t-shirts designed by Brazilian artist Sara Dias. Price is a flat $30. Eight patterns live in `src/lib/patterns.ts`; the site has a homepage (`src/app/page.tsx`), a collection grid (`src/app/collection/page.tsx`), product detail pages (`src/app/product/[slug]/ProductDetail.tsx`), a placeholder About page (`src/app/about/page.tsx`), and supporting cart / checkout / FAQ routes. Images live in `public/patterns/`. Product cards and detail pages currently use `{slug}-mockup.jpg` (tee flat-lay) and `{slug}-tile.jpg` (pattern swatch) for every pattern. The current homepage hero uses the first featured pattern's mockup as the hero visual, and the "Designed by Sara Dias" section uses a CSS gradient placeholder — not a real photo. The About page is a stub.

I have eight new professional photoshoot images in `public/patterns/` that I want incorporated site-wide. They are currently named `pomelli_photoshoot-1.png` … `pomelli_photoshoot-8.png`. All eight must be renamed and committed in place. Here is exactly what each one is:

| Current filename | Pattern | Content |
|---|---|---|
| pomelli_photoshoot-1.png | Midnight Bloom | Flat-lay of the tee on cream surface with sketches around it |
| pomelli_photoshoot-2.png | Midnight Bloom | Male model, cream/studio backdrop, styled more as a camp-collar mockup |
| pomelli_photoshoot-3.png | Midnight Bloom | Female model in a wooden geodesic-cabin interior, holding a ceramic piece |
| pomelli_photoshoot-4.png | Midnight Bloom | Male model in a pastel studio set with geometric "egg" shapes |
| pomelli_photoshoot-5.png | Pineapple Scarf | Flat-lay on a warm wood surface with a paper roll and decorative ball |
| pomelli_photoshoot-6.png | Pineapple Scarf | Female model torso crop, cream studio backdrop |
| pomelli_photoshoot-7.png | Pineapple Scarf | Female model in the same wooden geodesic cabin, contemplative portrait |
| pomelli_photoshoot-8.png | Pineapple Scarf | Female model with pastel arches / Easter-egg studio set |

## Step 1 — Rename the files

Rename on disk (use `git mv` so history is preserved) to these exact names, all lowercase with hyphens, staying in `public/patterns/`:

- pomelli_photoshoot-1.png → `midnight-bloom-flatlay.png`
- pomelli_photoshoot-2.png → `midnight-bloom-model-studio.png`
- pomelli_photoshoot-3.png → `midnight-bloom-model-cabin.png`
- pomelli_photoshoot-4.png → `midnight-bloom-model-pastel.png`
- pomelli_photoshoot-5.png → `pineapple-scarf-flatlay.png`
- pomelli_photoshoot-6.png → `pineapple-scarf-model-studio.png`
- pomelli_photoshoot-7.png → `pineapple-scarf-model-cabin.png`
- pomelli_photoshoot-8.png → `pineapple-scarf-model-pastel.png`

Open each renamed image to visually verify it matches the mapping before you wire it into a component. If any photo doesn't match the description above, stop and tell me before writing code.

## Step 2 — Extend the data model (non-breaking)

In `src/lib/patterns.ts`, extend the `Pattern` interface with an optional `lifestyle` array so every pattern can ship extra photography over time without breaking existing logic:

```ts
export interface LifestyleShot {
  src: string;
  alt: string;
  kind: "flatlay" | "model" | "detail";
}

// add to Pattern:
// lifestyle?: LifestyleShot[];
```

Populate `lifestyle` for the two patterns that now have photography:

- `midnight-bloom` → four shots in this order: model-cabin, model-pastel, flatlay, model-studio. Use specific, descriptive alt text (e.g. "Model wearing the Midnight Bloom tee in a wooden geodesic-cabin interior"). The first entry is the "hero" lifestyle shot for the pattern.
- `pineapple-scarf` → four shots: model-cabin, model-pastel, flatlay, model-studio — same alt-text pattern.

Keep `mockupImage` and `patternTile` exactly as they are — lifestyle is additive.

Export a helper `getHeroLifestyle(): LifestyleShot | undefined` that returns the first shot of the first featured pattern that has lifestyle photography — this will drive the homepage hero.

## Step 3 — Incorporate the photography (design-quality bar is high)

Be deliberate. These are the only professional photos on the site right now, so they need to land where they have the most impact. Work through every change below.

### 3a. Homepage hero (`src/app/page.tsx`)

Replace the current single mockup card in the hero with a **split-visual**: one large lifestyle shot (`midnight-bloom-model-cabin.png`) as the primary image, with a smaller floating flat-lay (`midnight-bloom-flatlay.png`) offset over its bottom-left corner, both rounded-2xl with the existing border/shadow treatment. Keep the "$30" badge on the primary image. Preload the primary image (`priority`). On mobile, collapse to just the primary shot. Use `next/image` with correct `sizes`, explicit width/height or `fill` with a sized parent, and object-cover.

### 3b. New "In the wild" lookbook section on the homepage

Add a new section between "Featured Designs" and "How it works":

- Title: "In the wild" · subtitle: "Sara's patterns, photographed."
- A bento-style grid of four images on desktop (e.g. a tall portrait on the left spanning two rows, then three square/portrait tiles on the right): `pineapple-scarf-model-cabin`, `midnight-bloom-model-pastel`, `pineapple-scarf-model-pastel`, `midnight-bloom-model-studio`. On mobile, stack as a horizontal scroll-snap carousel.
- Each tile is a clickable link to the corresponding product page. On hover, subtle scale (1.02) and a soft caption overlay from the bottom with the pattern name + "Shop →". Respect `motion-reduce`.
- Use `next/image` with `sizes` tuned to the layout. No CLS.

### 3c. Artist section on the homepage

Replace the `SARA DIAS` gradient placeholder block with a real photograph. Use `pineapple-scarf-model-cabin.png` (the contemplative cabin portrait) inside the existing rounded-2xl/bordered/shadowed frame. Keep the aspect-square container; use `object-cover` with `object-position: center`. No text overlay — let the photo breathe.

### 3d. Product detail pages (`src/app/product/[slug]/ProductDetail.tsx`)

Right now the left column shows `mockupImage` stacked with `patternTile`. Upgrade it to a proper **gallery** for any pattern that has `pattern.lifestyle`:

- A large main image (defaults to the pattern's first lifestyle shot if available, otherwise today's `mockupImage`).
- A thumbnail strip underneath (horizontally scrollable on mobile) with every image: the lifestyle shots first, then the existing mockup, then the pattern tile at the end.
- Clicking a thumbnail swaps the main image with a soft crossfade (Tailwind transition). Keyboard-accessible: thumbnails are real `<button>`s with `aria-pressed` and visible focus rings; arrow keys move between them.
- The `patternTile` thumbnail gets a small "Pattern" label so users know it's the swatch, not a product photo.
- For patterns **without** a `lifestyle` array, the component must render exactly as it does today — no visual regression.

### 3e. Collection page (`src/app/collection/page.tsx`)

Add a slim banner above the filters: a wide 21:9 crop using `midnight-bloom-model-pastel.png`, overlaid with the existing page title + subtitle in white with a subtle dark gradient scrim for legibility. Keep the filter/sort toolbar beneath it. On narrow screens the banner becomes a 16:9 to preserve the model's framing.

### 3f. Build out the About page (`src/app/about/page.tsx`)

Replace the `Placeholder` with a real page. Structure:

1. Editorial-style hero: `pineapple-scarf-model-pastel.png` as a full-width image (capped at max-w-7xl), rounded-2xl, with a short headline to its side.
2. A two-column "Our story" section mixing two flat-lays (`midnight-bloom-flatlay.png`, `pineapple-scarf-flatlay.png`) with copy about the collaboration with Sara Dias, sublimation printing, and why polyester. Pull existing Sara-Dias copy from `src/app/page.tsx` as the starting point — do not duplicate it verbatim, adapt it.
3. A "Meet Sara" block using `midnight-bloom-model-cabin.png` or any remaining portrait with the Instagram link `@saradiasestampa`.
4. A final CTA linking to `/collection`.

Keep the visual language consistent with the rest of the site: `font-black` display headings, `text-primary` / `text-muted` / `text-accent`, rounded-2xl images with `border border-border`, `max-w-7xl` container, generous vertical rhythm (`py-20 sm:py-24`).

## Step 4 — Design and engineering quality bar

- All new images must go through `next/image` with meaningful `alt` text, explicit `sizes`, and `priority` only on the homepage hero primary.
- No layout shift: every image container has an enforced aspect ratio.
- Respect `prefers-reduced-motion` on every hover/transition you add.
- Keep the existing Tailwind tokens (`bg-light`, `text-muted`, `text-accent`, `border-border`, `font-mono` for numbers). Don't introduce new colors.
- Accessibility: thumbnails and lookbook tiles are keyboard-navigable with visible focus states. Decorative overlays use `aria-hidden`.
- Run `npm run build` at the end. It must pass with no new TypeScript or ESLint errors. If `next/image` needs any `remotePatterns` or config changes, update `next.config.ts` accordingly.
- Don't introduce new dependencies unless strictly necessary. If you need a tiny carousel/gallery, build it with React state + Tailwind, not a library.

## Step 5 — Before you start coding

Write a short plan back to me first (≤ 20 lines) that lists: the exact rename commands you'll run, the components you'll touch, the new components you'll create, and anything you noticed in the photos that changes a decision above (e.g., if the cabin portrait won't crop cleanly into a square for the Artist section, propose a different shot). Then proceed.

At the end, give me a summary of what changed, any screenshots / URLs of the pages you ran locally if possible, and a list of future polish items you'd recommend (e.g., commissioning lifestyle photography for the other six patterns).
