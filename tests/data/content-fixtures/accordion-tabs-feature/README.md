# Accordion Tabs Feature — Content Fixtures

## What was added (GAAM-561)

1. **`style="scrolling-tabs"` property** on the `accordion_tabs_scroll` node — This sets the `data-style="scrolling-tabs"` attribute on the rendered HTML, which activates the scroll-driven CSS behavior defined in `accordion-tabs-feature.less` lines 633-718. Without this property, the HTL defaults to `data-style="accordion"` even when `behavior-scroll` style system ID is applied.

2. **Granite dark background section** (section 4) — New instance with `cq:styleIds="[background-granite]"` to test dark mode color overrides for tab titles, descriptions, CTAs, and icon colors.

## Gap Analysis

The original style guide only covered:
- Accordion variant on white background
- Scrolling tabs variant on white background (but missing `style` property)
- Headline variant on white background

Missing scenarios needed for GAAM-561 test coverage:
- Scrolling tabs with correct `data-style` attribute
- Dark background variants (granite/azul) for color override testing
- The `style` property was not set on the scroll instance, causing all 3 instances to render as accordion in the DOM

## How to deploy

Copy this file to `kkr-aem/ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components/accordion-tabs-feature/.content.xml` and redeploy.
