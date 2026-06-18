# Form Options (Dropdown) — Content Fixtures

AEM JCR content fixture for testing form-options dropdown scenarios for GAAM-507.

## Workflow

1. `/automate` generates this fixture XML based on the kkr-aem style guide page + GAAM-507 acceptance criteria gaps
2. A developer reviews the fixture and deploys it to AEM (test-fixtures path)
3. Once deployed, Playwright tests run against it at `/content/global-atlantic/test-fixtures/form-options`

## File

- `form-options-fixtures.xml` — Fixture page with all dropdown states not present in the style guide

## Source

Based on: `kkr-aem/ui.content.ga/.../style-guide/components/form-options/.content.xml`
Ticket: GAAM-507 (Dropdown reskin — single-select and multi-select)

## Gap analysis: what the style guide covers vs. what was needed

The existing style guide page (`form-options/.content.xml`) covers **radio buttons and checkboxes only** — it contains no `drop-down` or `multi-drop-down` type instances at all. Every section in this fixture is new.

## What was added (all marked with `[Added] GAAM-507:` comments in XML)

### Single-Select Dropdown (`type="drop-down"`)

| State | Backgrounds | Notes |
|-------|-------------|-------|
| **Default** | white, slate, granite, azul | No selection made; trigger shows placeholder |
| **Filled** | white, slate, granite, azul | One item `selected="{Boolean}true"`; tests selected-value display and checkmark in open panel |
| **Disabled / Read Only** | white, slate, granite, azul | `readOnly="{Boolean}true"`; trigger non-interactive |
| **Required + Helper Text** | white, granite | `required="{Boolean}true"` + `helpMessage`; tests asterisk and helper text without error |
| **Error Default** | white, slate, granite, azul | Required, no selection; submit button triggers inline error message |
| **Error Filled** | white | Pre-selected item that can be cleared then submitted; tests error-after-filled visual |

### Multi-Select Dropdown (`type="multi-drop-down"`)

| State | Backgrounds | Notes |
|-------|-------------|-------|
| **Default** | white, slate, granite, azul | No items selected; trigger shows placeholder |
| **Filled** | white, slate, granite, azul | 2–3 items `selected="{Boolean}true"`; tests count badge (e.g., "2 selected") on trigger |
| **Disabled / Read Only** | white, granite, azul | `readOnly="{Boolean}true"` |
| **Required + Helper Text** | white, azul | `required="{Boolean}true"` + `helpMessage` |
| **Error Default** | white, slate, granite, azul | Required, no selection; submit triggers inline error |

### Structure conventions

- All dropdown instances are wrapped in `ga/components/form/container` with a submit button, so error states can be triggered by clicking submit without making a selection.
- `sling:resourceType="ga/components/form/options"` (GA overlay, not the base resource type used in the style guide).
- Sections use `cq:styleIds="[background-white]"`, `[background-slate]`, `[background-granite]`, `[background-azul]` for light/dark mode coverage.
- Deploy path: `/content/global-atlantic/test-fixtures/form-options`
