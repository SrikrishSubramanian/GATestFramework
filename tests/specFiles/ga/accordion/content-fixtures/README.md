# Accordion Content Fixtures — GAAM-381

This directory contains test content fixtures for the GA Accordion component.

## Source

The fixture XML is derived from the live AEM style guide page at:

```
ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components/accordion/.content.xml
```

All four original sections are preserved verbatim. Four additional sections were appended after
the azul section to cover acceptance criteria gaps identified in GAAM-381.

## Files

| File | Purpose |
|------|---------|
| `accordion-fixtures.xml` | Full JCR XML: original style guide content + 4 new test sections |
| `fixture-meta.json` | Structured metadata describing every section, its properties, and which AC it covers |
| `README.md` | This file |

## Original Sections (preserved)

| Section ID | Background | singleExpansion | singleExpansionAllClosed | expandedItems |
|---|---|---|---|---|
| `section_white` | white | false | true | — |
| `section_slate` | slate | true | false | `[item_0]` |
| `section_granite` | granite | false | true | — |
| `section_azul` | azul | false | true | — |

## Added Sections (GAAM-381)

### 1. `section_preexpanded` — Pre-expanded non-first item

**AC covered:** "Author can select which accordion item is expanded by default"

The existing slate section only tests `expandedItems="[item_0]"`. This section uses
`expandedItems="[item_2]"` so tests can assert that:
- item_0 and item_1 are collapsed on initial load
- item_2 is expanded on initial load
- item_3 is collapsed on initial load

Key properties:
```
singleExpansion="{Boolean}false"
singleExpansionAllClosed="{Boolean}false"
expandedItems="[item_2]"
```

### 2. `section_varheight` — Variable height content

**AC covered:** "Accordion height is variable based on content"

All 4 items are pre-expanded (`expandedItems="[item_0,item_1,item_2,item_3]"`) so the rendered
panel heights are immediately visible without interaction. Items contain:

| Item | Content type | Approx height |
|------|------|------|
| `item_0` | Single word ("Yes.") | ~1 line |
| `item_1` | Short paragraph (~40 words) | ~3 lines |
| `item_2` | Four paragraphs (~120 words) | ~12 lines |
| `item_3` | Heading + 5-item bullet list + paragraph | ~10 lines |

Tests should assert that each panel's rendered height differs and that heights contract/expand
correctly on toggle.

### 3. `section_stress` — Maximum items stress test

**AC covered:** "No limit on number of accordion items"

7 items, all closed on load (`singleExpansionAllClosed="{Boolean}true"`). Tests should assert:
- All 7 panel triggers are rendered
- Each item can be independently expanded and collapsed
- The component does not truncate, hide, or error on items beyond a fixed count

### 4. `section_header_fields` — Eyebrow, headline, and description header

**AC covered:** Optional accordion header fields render correctly

No existing style guide section uses the optional header. This section populates all three:

| Property | Value |
|---|---|
| `eyebrow` | "Frequently Asked Questions" |
| `headline` | "Everything You Need to Know" |
| `description` | "Browse the topics below to find answers to our most common questions. If you don't find what you're looking for, please contact our customer service team." |

Tests should assert the eyebrow, headline, and description are rendered above the accordion panels
and that the panel triggers appear below the header block.

## Usage in Tests

Reference section IDs from `fixture-meta.json` to locate the accordion under test:

```typescript
// Example: locate the pre-expanded non-first item accordion
const accordion = page.locator('[data-cmp-is="accordion"]').nth(/* index of section_preexpanded */);
```

Because these fixtures are JCR XML (not a live page URL), tests that require a live AEM instance
should deploy the fixture via the AEM fixture deploy script before running.
