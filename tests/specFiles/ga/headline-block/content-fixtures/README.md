# Headline Block Content Fixtures

## Source
Base content copied from kkr-aem style guide:
`ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components/headline-block/.content.xml`

## Existing Style Guide Coverage (8 variations)
- Left-aligned + White background
- Center-aligned + White background
- Left-aligned + Slate background
- Center-aligned + Slate background
- Left-aligned + Granite background
- Center-aligned + Granite background
- Left-aligned + Azul background
- Center-aligned + Azul background

All variations include: eyebrow + h2 title + descriptor + primary CTA + secondary CTA.

## Added Fixtures

### GAAM-757: Padding Variations
- **Remove Top Padding** — `ga-headline-block--padding-top-off` style ID applied
- **Remove Bottom Padding** — `ga-headline-block--padding-bottom-off` style ID applied
- **Both Paddings Removed** — both style IDs applied simultaneously

### GAAM-344: Partial Content Variations
- **Title Only** — no eyebrow, no descriptor, no CTAs (minimal valid state)
- **Single CTA** — primary button only, no secondary
- **Different Heading Levels** — h1, h3, h4 (style guide only has h2)
- **No Eyebrow** — title + descriptor + CTA without eyebrow text

## Deployment
This fixture XML needs to be reviewed by a developer and merged into the kkr-aem repo
(as a style guide update or under a test-fixtures path). Once deployed to AEM, the
padding and partial-content tests can run against live content instead of being skipped.
