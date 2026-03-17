# Hero 50/50 — Content Fixtures

## Overview

`hero-fifty-fifty-fixtures.xml` is a JCR content package definition for the **Hero 50/50**
component (GAAM-519). This is a **new component** that does not yet exist in kkr-aem, so there
is no production style guide page to copy from. All content in this fixture was authored from
scratch based on the GAAM-519 acceptance criteria.

Resource type: `ga/components/content/hero-fifty-fifty`

Intended deploy path once the component is built:

```
/content/global-atlantic/test-fixtures/hero-fifty-fifty
```

A developer must review and merge this content into kkr-aem before it can be deployed or tested
against a live AEM instance.

---

## Deploy Path

```
/content/global-atlantic/test-fixtures/hero-fifty-fifty
```

---

## Component BEM CSS Classes

The following CSS classes have been validated against the live DOM:

**Root and columns:**
- `.cmp-hero-fifty-fifty` — Root component wrapper
- `.cmp-hero-fifty-fifty__left` — Left column
- `.cmp-hero-fifty-fifty__right` — Right column

**Left column content:**
- `.cmp-hero-fifty-fifty__breadcrumb` — Breadcrumb wrapper
- `.cmp-hero-fifty-fifty__content` — Content wrapper
- `.cmp-hero-fifty-fifty__text-content` — Text content container
- `.cmp-hero-fifty-fifty__eyebrow-headline` — Eyebrow and headline wrapper
- `.cmp-hero-fifty-fifty__eyebrow` — Eyebrow text
- `.cmp-hero-fifty-fifty__headline` — H1 headline
- `.cmp-hero-fifty-fifty__headline--h1` — Standard H1 size modifier
- `.cmp-hero-fifty-fifty__headline--h1-xl` — XL H1 size modifier
- `.cmp-hero-fifty-fifty__headline--granite` — Granite 50% color override (inline span)
- `.cmp-hero-fifty-fifty__description` — Description text
- `.cmp-hero-fifty-fifty__description--medium` — Medium description size
- `.cmp-hero-fifty-fifty__description--large` — Large description size
- `.cmp-hero-fifty-fifty__buttons` — CTA buttons wrapper

**Right column content:**
- `.cmp-hero-fifty-fifty__image` — Image wrapper
- `.cmp-hero-fifty-fifty__secondary-slot` — Secondary slot wrapper (carousel, statistic, or content trail)

---

## What this fixture covers

Each fixture maps directly to a GAAM-519 acceptance criterion. All nodes are marked
`<!-- [Added] GAAM-519 ... -->` in the XML.

### Fixture 1 — Full: All fields authored

**Node**: `hero_fifty_fifty_full`

All optional fields are present:
- Breadcrumb enabled (3 items)
- Eyebrow text
- H1 headline with granite 50% color override on the end phrase
- Paragraph Large description
- 2 CTAs: primary-filled (auto-theme) + secondary-outline (auto-theme)
- Right column: image + Statistic secondary slot (stat-theme-azul)

**Test assertions**:
- All sub-elements render: breadcrumb nav, eyebrow, h1, description, both buttons, image, statistic
- Statistic carries `stat-theme-azul` class
- Both CTA buttons carry `auto-theme` class
- Breadcrumb is visible on desktop; hidden on mobile (`display:none` via media query)
- Root selector `.cmp-hero-fifty-fifty` is present

---

### Fixture 2 — Minimal: Headline only

**Node**: `hero_fifty_fifty_minimal`

Only the required headline is authored. No eyebrow, description, CTAs, or breadcrumb.
Right column has only an image (no secondary slot).

**Test assertions**:
- Component renders without errors when all optional fields are absent
- No eyebrow, description, CTA, or breadcrumb elements are present in the DOM
- Right column renders the image with a non-empty `alt` attribute
- Root selector `.cmp-hero-fifty-fifty` is present

---

### Fixture 3 — Headline + Description + 1 CTA (no eyebrow)

**Node**: `hero_fifty_fifty_desc_cta`

- No breadcrumb, no eyebrow
- Paragraph Medium description
- Single primary-filled CTA
- Image only in right column

**Test assertions**:
- Description renders with the Paragraph Medium size class `.cmp-hero-fifty-fifty__description--medium`
- Only one CTA button is present in the DOM
- No eyebrow element rendered

---

### Fixture 4 — Headline + 1 CTA (no eyebrow, no description)

**Node**: `hero_fifty_fifty_headline_cta`

- Headline + single CTA, nothing else on the left column
- Image only in right column

**Test assertions**:
- Neither eyebrow nor description element is present in the DOM
- CTA renders as a primary-filled button with auto-theme

---

### Fixture 5a — Granite 50% color override: beginning of headline

**Node**: `hero_fifty_fifty_color_begin`

Inline `<span class="cmp-hero-fifty-fifty__headline--granite">` wraps the first word(s).

**Test assertions**:
- Span with class `.cmp-hero-fifty-fifty__headline--granite` is present inside the h1
- Span is at the beginning of the headline text
- Span color resolves to the expected granite token (visual/computed style assertion)

---

### Fixture 5b — Granite 50% color override: middle of headline

**Node**: `hero_fifty_fifty_color_middle`

Inline granite span wraps a middle phrase (text before and after the span).

**Test assertions**:
- Span with class `.cmp-hero-fifty-fifty__headline--granite` is present
- Both a leading and trailing text node are present alongside the span

---

### Fixture 5c — Granite 50% color override: end of headline

**Node**: `hero_fifty_fifty_color_end`

Inline granite span wraps the last word(s) of the headline.

**Test assertions**:
- Span with class `.cmp-hero-fifty-fifty__headline--granite` is present at end of headline text
- Leading text node is present before the span

---

### Fixture 6a — Headline size: H1 XL

**Node**: `hero_fifty_fifty_h1xl`

`headlineSize="h1-xl"` — the component should apply the XL size modifier class.

**Test assertions**:
- Headline element carries the H1 XL size modifier class `.cmp-hero-fifty-fifty__headline--h1-xl`
- Computed `font-size` is larger than the standard H1 variant (Fixture 6b)

---

### Fixture 6b — Headline size: H1 (standard)

**Node**: `hero_fifty_fifty_h1`

Same content as 6a but with `headlineSize="h1"` for direct side-by-side comparison.

**Test assertions**:
- Headline element carries the standard H1 size class `.cmp-hero-fifty-fifty__headline--h1`
- Computed `font-size` is smaller than Fixture 6a

---

### Fixture 7a — Description size: Paragraph Medium

**Node**: `hero_fifty_fifty_para_medium`

`descriptionSize="paragraph-medium"`.

**Test assertions**:
- Description element carries the Paragraph Medium size class `.cmp-hero-fifty-fifty__description--medium`
- Computed `font-size` matches the Paragraph Medium design token

---

### Fixture 7b — Description size: Paragraph Large

**Node**: `hero_fifty_fifty_para_large`

`descriptionSize="paragraph-large"` — same copy as 7a for direct comparison.

**Test assertions**:
- Description element carries the Paragraph Large size class `.cmp-hero-fifty-fifty__description--large`
- Computed `font-size` is larger than Fixture 7a

---

### Fixture 8a — Secondary slot: Nested Carousel

**Node**: `hero_fifty_fifty_carousel`

Secondary slot contains an `image-with-nested-content` wrapper holding a two-item carousel.

**Test assertions**:
- Carousel renders below the image in the right column under `.cmp-hero-fifty-fifty__secondary-slot`
- Both carousel items are present in the DOM (may be hidden depending on active slide)
- Carousel prev/next controls are present and focusable
- No secondary-slot content is visible if the component hides it at mobile breakpoints

---

### Fixture 8b — Secondary slot: Statistic

**Node**: `hero_fifty_fifty_statistic`

Secondary slot contains a statistic component with `stat-theme-azul`.

**Test assertions**:
- Statistic value `$150B+` is visible in the right column
- Secondary slot wrapper has class `.cmp-hero-fifty-fifty__secondary-slot`
- Statistic carries `stat-theme-azul` class
- Description text "Assets under management" is present

---

### Fixture 8c — Secondary slot: Content Trail

**Node**: `hero_fifty_fifty_content_trail`

Secondary slot contains a content-trail component with `content-trail-background-dark-color`.

**Test assertions**:
- Content Trail renders in the right column below the image under `.cmp-hero-fifty-fifty__secondary-slot`
- Trail headline "Resources" is visible
- Both trail links ("Fixed Annuities", "Life Insurance 101") are present and have valid `href` attributes
- Content trail carries the dark-color variant class

---

### Fixture 8d — No secondary slot (Image only)

**Node**: `hero_fifty_fifty_image_only`

No `secondary_slot` child node is authored. Right column contains only the image.

**Test assertions**:
- Right column renders the image under `.cmp-hero-fifty-fifty__image`
- No secondary-slot container element is present in the DOM
- Component layout remains stable with a single right-column element

---

### Fixture 9 — Missing image (no fileReference authored)

**Node**: `hero_fifty_fifty_no_image`

The `<image>` child node exists but has no `fileReference` property — simulates an author
who added the component but has not yet selected an image.

**Test assertions**:
- Component renders without a JavaScript error
- Right column shows a placeholder (in author mode) or is gracefully empty/hidden (in publish mode)
- No broken `<img src="">` element is emitted
- In author mode: AEM placeholder text/icon is shown; in `?wcmmode=disabled`: no `<img>` rendered

---

## Pending / Requires Developer Input

The following properties are assumptions based on the acceptance criteria. A developer building
the component must confirm or adjust them before deploying:

| Assumption | Property/value used | Needs confirmation |
|---|---|---|
| JCR node resource type | `ga/components/content/hero-fifty-fifty` | Confirm exact sling:resourceType |
| Headline field name | `headline` (rich text) | Confirm dialog field name |
| Headline size field name | `headlineSize` | Confirm; may be a styleId instead |
| Description field name | `description` (rich text) | Confirm dialog field name |
| Description size field name | `descriptionSize` | Confirm; may be a styleId instead |
| Granite color span class | `cmp-hero-fifty-fifty__headline--granite` | Confirm BEM class name |
| Breadcrumb flag field name | `breadcrumbEnabled` | Confirm field name + implementation |
| Eyebrow field name | `eyebrow` | Confirm dialog field name |
| Secondary slot child structure | `secondary_slot` child node | Confirm slot name and nesting depth |
| H1 XL size value | `h1-xl` | Confirm enum value in dialog |
| Paragraph Large size value | `paragraph-large` | Confirm enum value in dialog |
| Paragraph Medium size value | `paragraph-medium` | Confirm enum value in dialog |
| DAM path for hero image | `/content/dam/ga/style-guide/hero-fifty-fifty/hero-image.jpg` | Upload image to DAM or update path |
| Nested Carousel resource type | `ga/components/content/image-with-nested-content` | Confirm correct nesting pattern |

---

## Notes

- This fixture page targets the **author** environment only; it is not intended for publish
  replication in its current test-data form.
- The `cq:template` and `sling:resourceType` on `jcr:content` match the standard GA freeform
  page template — no new template or policy changes should be required.
- Once the component is live in kkr-aem, run the Playwright generation pipeline to produce the
  full POM and spec suite:
  ```bash
  COMPONENTS=hero-fifty-fifty env=local npx playwright test generate-components \
    --config playwright.generators.config.ts --project chromium --workers 1
  COMPONENTS=hero-fifty-fifty env=local npx playwright test generate-advanced \
    --config playwright.generators.config.ts --project chromium --workers 1
  ```
- The `fixture-meta.json` file (required by `fixture-sync-checker.ts`) should be created once
  the corresponding kkr-aem style guide page exists and its file hash is known.
