# Statistic — Content Fixtures

This directory contains AEM JCR XML fixtures used by the Statistic component's Playwright test suite.

## Files

| File | Purpose |
|------|---------|
| `statistic-fixtures.xml` | Full-fidelity content fixture derived from the style guide, with additions for dark-mode and combination testing |

## Deploy Path

```
/content/global-atlantic/test-fixtures/statistic
```

The fixture page must be deployed to a running AEM author instance before the content-driven specs execute. Import via CRX Package Manager or `vlt` import.

## Relationship to Style Guide

The fixture is a copy of:
```
/content/global-atlantic/style-guide/components/statistic
```
Source: `ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components/statistic/.content.xml`

All original nodes are preserved verbatim. Added nodes are annotated with `<!-- [Added] ... -->` inline comments.

## What Was Added (and Why)

### 1. Explicit `stat-align-left`

The style guide omits an explicit `stat-align-left` instance (default rendering is left-aligned but no style class is applied). A `statistic_align_left` node was added to exercise the CSS class directly and verify it does not break layout.

### 2. Additional Combined Style-ID Instances

The style guide has one combined instance (`stat-theme-granite + stat-border + stat-align-center`). Two more combinations were added:

- `stat-theme-azul + stat-border + stat-align-left` — dark theme, left-aligned, bordered
- `stat-theme-slate + stat-border + stat-align-center` — light theme, center-aligned, bordered

These cover the matrix of (theme) x (border) x (alignment) more thoroughly and expose class-ordering side effects.

### 3. Statistics Inside Section Backgrounds

All original statistics in the style guide are placed bare inside `main-par` with no section wrapper. Four sections were added to test how each statistic theme adapts when its parent section carries a background:

| Section node | Background style ID | Statistic inside | Dark/Light |
|---|---|---|---|
| `section_bg_white` | `background-white` | `stat-border` | Light |
| `section_bg_slate` | `background-slate` | `stat-theme-slate + stat-border` | Light |
| `section_bg_granite` | `background-granite` | `stat-theme-granite + stat-border` | Dark |
| `section_bg_azul` | `background-azul` | `stat-theme-azul + stat-border` | Dark |

Dark backgrounds (granite, azul) trigger inverted color rules in the GA LESS variables. These fixtures let visual and regression specs assert that text and border colors adapt correctly.

### 4. All Three Theme Variants in Matching Background Sections

`stat-theme-slate`, `stat-theme-granite`, and `stat-theme-azul` each appear both as standalone bare instances (carried over from the style guide) and inside their matching background section. This lets tests compare the component's self-styled state against the contextually-driven state.

## Style IDs Reference

| Style ID | CSS class applied | Effect |
|---|---|---|
| `stat-align-left` | `.stat-align-left` | Explicit left alignment |
| `stat-align-center` | `.stat-align-center` | Center alignment |
| `stat-border` | `.stat-border` | Top border line on statistic value |
| `stat-theme-slate` | `.stat-theme-slate` | Slate accent color |
| `stat-theme-granite` | `.stat-theme-granite` | Granite accent color |
| `stat-theme-azul` | `.stat-theme-azul` | Azul accent color |
| `background-white` | `.background-white` | Section: white background (light) |
| `background-slate` | `.background-slate` | Section: slate background (light) |
| `background-granite` | `.background-granite` | Section: granite background (dark) |
| `background-azul` | `.background-azul` | Section: azul background (dark) |
