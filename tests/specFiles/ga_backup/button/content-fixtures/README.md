# Button Content Fixtures

## Overview

`button-fixtures.xml` is an AEM JCR content package that serves as the test-automation content fixture for the Button component. It is a copy of the production style guide page at:

```
/content/global-atlantic/style-guide/components/button
```

with additional component instances that expose style combinations not present in the style guide. The fixture page deploys to:

```
/content/global-atlantic/test-fixtures/button
```

## What Was Added (and Why)

### 1. Theme styleId Combinations

**Sections added** (each is a `section` component with the specified background containing two buttons):

| Section element name | Background | Theme styleId | Variants covered |
|---|---|---|---|
| `section_fx_white_light` | background-white | light-theme | primary-filled, secondary-outline |
| `section_fx_white_dark` | background-white | dark-theme | primary-filled, secondary-outline |
| `section_fx_white_auto` | background-white | auto-theme | primary-filled, secondary-outline |
| `section_fx_granite_light` | background-granite | light-theme | primary-filled, secondary-outline |
| `section_fx_granite_dark` | background-granite | dark-theme | primary-filled, secondary-outline |
| `section_fx_granite_auto` | background-granite | auto-theme | primary-filled, secondary-outline |

**Why:** The production style guide never applies `light-theme`, `dark-theme`, or `auto-theme` as explicit `cq:styleIds`. The AEM Style System renders theme as a CSS class on the component wrapper only when the styleId is authored. The matrix spec (`button.matrix.spec.ts`) and interaction spec (`button.interaction.spec.ts`) need DOM instances where these classes are guaranteed to be present so Playwright can assert them without relying on implicit defaults.

White (light background) and granite (dark background) were chosen because they represent the two ends of the background-classification spectrum defined in `CLAUDE.md`.

### 2. Medium-Button Size (Explicit styleId)

**Sections added:**

| Section element name | Background | Size styleId |
|---|---|---|
| `section_fx_white_medium` | background-white | medium-button |
| `section_fx_granite_medium` | background-granite | medium-button |

Each section contains one `[primary-filled, medium-button]` button instance.

**Why:** The style guide shows medium-sized buttons using `[primary-filled]` alone — the medium size is the default and carries no explicit styleId in the style guide. The author spec (`button.author.spec.ts`) verifies size class presence. Without a `medium-button` class on the element, an assertion for explicit class membership would always fail. These fixture instances carry the styleId explicitly, enabling unambiguous assertions that the medium-button class is rendered when authored.

## Page Metadata Changes

| Property | Original style guide | This fixture |
|---|---|---|
| `jcr:title` | `Button` | `Button — Test Fixtures` |
| `jcr:description` | (absent) | Mentions GAAM test automation purpose |
| Deploy path | `/content/global-atlantic/style-guide/components/button` | `/content/global-atlantic/test-fixtures/button` |

All original content (standalone buttons, background-white, background-slate, background-azul, background-granite sections) is preserved verbatim. New nodes are appended after the last original section.

## Naming Conventions

All added nodes use the `_fx_` infix (e.g., `button_fx_wl_pf`, `section_fx_white_light`) to distinguish them from style-guide nodes and prevent name collisions when both pages are deployed to the same JCR repository.

All added blocks are annotated with `<!-- [Added] ... -->` comments for traceability.
