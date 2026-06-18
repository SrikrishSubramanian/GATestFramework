# Feature Banner — Content Fixtures

## Overview

`feature-banner-fixtures.xml` is a JCR content package definition intended for deployment at:

```
/content/global-atlantic/test-fixtures/feature-banner
```

It is a superset of the production style guide page at:

```
/content/global-atlantic/style-guide/components/feature-banner
```

All content present in the style guide is preserved verbatim. Three additional fixture-only sections have been appended (each marked with `<!-- [Added] ... -->` comments in the XML).

---

## Deploy Path

```
/content/global-atlantic/test-fixtures/feature-banner
```

---

## Fixture Additions

### 1. Azul Background Variant (`feature_banner_azul`)

The feature-banner style system registers only three background styleIds: `feature-banner-white-bg`, `feature-banner-slate-bg`, and `feature-banner-granite-bg`. There is no `feature-banner-azul-bg`.

The correct pattern — matching how other components handle azul — is to wrap the banner inside a **Section** component carrying `cq:styleIds="[background-azul]"`, which applies `cmp-section--background-color-azul` on the outer wrapper.

**Node**: `section_azul_bg > section-par > feature_banner_azul`

Key properties:
- Section: `cq:styleIds="[background-azul]"`
- `graphicType="image"`
- Buttons: `dark-theme` (azul is a dark background per the GA dark/light classification)
- Content trail: `content-trail-background-dark-color` style applied

**Test assertions**:
- The section wrapper carries `cmp-section--background-color-azul`
- Button elements carry `cmp-button--dark-theme`
- Content trail carries the dark-color variant class

---

### 2. Video-Only Section (`feature_banner_video_white`, `feature_banner_video_granite`)

Two `graphicType="video"` instances are grouped consecutively for easier Playwright targeting. The style guide's existing video instances are scattered between image instances; this section allows tests to select video banners without page-position coupling.

| Node | Background | Alignment | Statistic theme |
|------|-----------|-----------|-----------------|
| `feature_banner_video_white` | white (default) | left | `stat-theme-slate` |
| `feature_banner_video_granite` | `feature-banner-granite-bg` | right (`feature-banner-image-right`) | `stat-theme-azul` |

**Test assertions**:
- `graphicType="video"` instances render the video wrapper (`__video-wrapper`) at desktop breakpoints
- Play/pause control (`__video-control`) is present and focusable
- At mobile breakpoints the video wrapper is `display:none` and the fallback image is shown instead
- Granite instance: buttons carry `dark-theme`, statistic carries `stat-theme-azul`

---

### 3. Mobile Image Swap Test (`feature_banner_mobile_swap`)

This instance has **distinctly different** `image` (desktop) and `mobileImage` paths so tests can assert the responsive swap at the tablet breakpoint.

| Property | Value |
|----------|-------|
| Desktop image | `/content/dam/ga/style-guide/feature-banner.png` |
| Mobile image | `/content/dam/ga/style-guide/feature-banner-mobile-portrait.png` |
| `isDecorative` (both) | `false` — enables alt-text assertions |

The LESS rule that drives this behaviour:

```less
.cmp-feature-banner__mobile-image {
    display: block;
    @media (min-width: @bp_tablet_min) {
        display: none;
    }
}
```

**Test assertions**:
- At mobile viewport (`< @bp_tablet_min`): `__mobile-image` is visible, desktop `cmp-image` wrapper inside `__wrapper` is hidden
- At desktop viewport (`>= @bp_tablet_min`): `__mobile-image` is `display:none`, desktop image is visible
- Both `alt` attributes are non-empty (isDecorative is false)
- The two `fileReference` values are distinct strings (guards against accidental copy-paste where both point to the same asset)

---

## Selector Reference

All nodes follow the pattern `[data-component="feature-banner"]` or can be targeted by their JCR node name rendered as a `data-` attribute depending on HTL implementation. Use the node names below as stable identifiers in locator sidecars:

| Fixture Node | Purpose |
|---|---|
| `feature_banner_one` … `feature_banner_eight` | Verbatim style guide instances |
| `feature_banner_azul` | Azul section background variant |
| `feature_banner_video_white` | Isolated video / white bg |
| `feature_banner_video_granite` | Isolated video / granite bg |
| `feature_banner_mobile_swap` | Responsive image swap breakpoint test |

---

## Notes

- This fixture page should be deployed to the **author** environment only; it is not intended for publish replication.
- The `cq:template` and `sling:resourceType` are identical to the style guide page — no additional template or policy changes are required.
- If `feature-banner-mobile-portrait.png` does not yet exist in DAM, upload a portrait-cropped version of any feature-banner asset before running the image-swap tests.
