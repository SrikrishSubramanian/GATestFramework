# content-trail — Content Fixtures

**Source:** `kkr-aem/ui.content.ga/.../style-guide/components/content-trail/.content.xml`
**Fixture:** `content-trail-fixtures.xml`
**Tickets:** GAAM-328, GAAM-672

## What This Fixture Contains

The fixture is a complete copy of the style guide page with 7 additional variations appended.
The original 8 style-guide variations are preserved **unchanged**; all additions are marked
with `<!-- [Added] GAAM-328/GAAM-672 ... -->` comments.

---

## Original Variations (from style guide — unchanged)

| # | Node name | Style IDs | Content Type | Background |
|---|-----------|-----------|--------------|------------|
| 1 | `content_trail` | _(none)_ | video | Default transparent + border |
| 2 | `content_trail_copy` | `content-trail-background-light-color`, `content-trail-small` | written | Light (white) |
| 3 | `content_trail_copy_249442947` | `content-trail-background-dark-color` | link | Dark transparent + border |
| 4 | `content_trail_copy_c` | `content-trail-background-dark-color-no-border` | video | Dark granite |
| 5 | `content_trail_copy_c_2003914106` | `content-trail-large`, `content-trail-background-light-color` | video | Light (white) large |
| 6 | `content_trail_copy_c_1509132237` | `content-trail-background-dark-color-no-border`, `content-trail-large` | written | Dark granite large _(note: has stray `videoId`)_ |
| 7 | `content_trail_copy_1521364670` | `content-trail-background-transparent`, `content-trail-large` | link | Default transparent large |
| 8 | `content_trail` _(inside `section[background-granite]`)_ | `content-trail-small`, `content-trail-background-transparent` | written | Inside granite section |

---

## Added Variations

### GAP 1 — Inside Azul Section | Video (GAAM-328)
**Node:** `content_trail_azul_video` inside `section_azul[background-azul]`

The style guide covered a granite section context but had no azul section equivalent.
The LESS file has `.cmp-section--background-color-azul` applying white-border + transparent
background rules to nested content-trail containers (same rule block as granite/ink/azul at
lines 233–288 of `content-trail.less`). This variation is needed to verify that the azul
dark-context styles fire correctly.

**Style IDs on section:** `background-azul` → CSS class: `cmp-section--background-color-azul`

---

### GAP 2 — Dark Mode (Transparent + Border, Small) | Video (GAAM-328)
**Node:** `content_trail_dark_transparent_video`
**Style IDs:** `content-trail-background-dark-color`

The style guide only had a Link content type in dark-transparent mode. Video is missing, which
means the dark-mode hover icon swap for video (a white-tinted video play icon vs the
light-background version) cannot be tested. The LESS has distinct `::after` background-image
URLs per content type in the dark context.

---

### GAP 3 — Dark Mode (Transparent + Border, Small) | Written (GAAM-328)
**Node:** `content_trail_dark_transparent_written`
**Style IDs:** `content-trail-background-dark-color`

Completes the three-content-type matrix for the dark-transparent mode. Written also has a
distinct dark-context hover icon (SVG with green circle, white bookmark). Without this
variation the written dark-transparent state is untested.

---

### GAP 4 — Link Target `_blank` (GAAM-672)
**Node:** `content_trail_blank_target`
**Style IDs:** `content-trail-background-light-color`, `content-trail-small`

All 8 original variations use `linkTarget="_self"`. Adding one with `linkTarget="_blank"` enables
tests to assert that:
- The anchor element renders `target="_blank"`
- `rel="noopener noreferrer"` is present (security requirement)
- The external-link icon behaviour is exercised if applicable

Using a light-mode, small instance so background context does not interfere.

---

### GAP 5 — Clean Written without stray `videoId` (GAAM-672)
**Node:** `content_trail_clean_written`
**Style IDs:** `content-trail-background-dark-color-no-border`, `content-trail-large`

Original variation #6 (`content_trail_copy_c_1509132237`) is `contentType="written"` but
has `videoId="6365778310112"` set — incorrect authored content. This variation is identical
in background and size but omits `videoId`, enabling tests to assert that the video modal
is **not** triggered when a user interacts with a written-type content trail (even if a
stray `videoId` is present on the sibling node).

---

### GAP 6 — Inside Feature Banner (White BG) inside Granite Section | Link (GAAM-328)
**Node:** `content_trail_fb_white_link` inside `feature_banner_white` inside `section_granite_fb_white`
**CSS context:** `.cmp-section--background-color-granite .cmp-feature-banner-white .cmp-section--background-light-color`

The LESS has a four-selector block (lines 332–388) applying special context overrides when
a light-mode content-trail (`content-trail-background-light-color`) sits inside a white or
slate feature-banner that is itself inside a granite or azul section. Specifically, the
container gets `background: transparent` and `border: 1px solid rgba(21,65,151,0.2)` instead
of the white solid background — reversing the light-mode appearance back toward transparent.
The hover icon also switches back to the light-bg variants.

This fixture covers the `granite + feature-banner-white` combination.

---

### GAP 6b — Inside Feature Banner (Slate BG) inside Azul Section | Written (GAAM-328)
**Node:** `content_trail_fb_slate_written` inside `feature_banner_slate` inside `section_azul_fb_slate`
**CSS context:** `.cmp-section--background-color-azul .cmp-feature-banner-slate .cmp-section--background-light-color`

Covers the fourth permutation of the feature-banner context rule (azul + slate). This
completes the 2×2 matrix of {granite, azul} × {white-banner, slate-banner}.

---

## Style System IDs Reference

| Style ID | CSS Class Applied | Description |
|----------|-------------------|-------------|
| `content-trail-background-dark-color` | `cmp-section--background-dark-color` | Dark transparent + border |
| `content-trail-background-dark-color-no-border` | `cmp-section--background-dark-no-border` | Dark granite, no border |
| `content-trail-background-light-color` | `cmp-section--background-light-color` | White background, no border |
| `content-trail-background-transparent` | `cmp-section--background-transparent` | Transparent + border (default) |
| `content-trail-small` | `cmp-section--small` | Small size |
| `content-trail-large` | `cmp-section--large` | Large size |
| `background-azul` | `cmp-section--background-color-azul` | Section azul background |
| `background-granite` | `cmp-section--background-color-granite` | Section granite background |
| `feature-banner-white-bg` | `cmp-feature-banner-white` | Feature banner white variant |
| `feature-banner-slate-bg` | `cmp-feature-banner-slate` | Feature banner slate variant |

## Known Content Issue (existing, not fixed here)

Variation #6 in the original style guide (`content_trail_copy_c_1509132237`) has
`contentType="written"` combined with `videoId="6365778310112"`. This is pre-existing
incorrect content in kkr-aem. It has been preserved as-is; GAP 5 above provides a clean
reference instance for testing.

## Deployment

- **Local / Dev**: Auto-deployed to `/content/global-atlantic/test-fixtures/content-trail`
  via `content-fixture-deployer.ts` before tests run.
- **QA / UAT / Prod**: Fixture XML should be reviewed and merged into kkr-aem style guide
  by the CMS team.
