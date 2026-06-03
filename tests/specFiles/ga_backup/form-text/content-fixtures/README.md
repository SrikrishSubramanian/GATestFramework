# Form Text — Content Fixtures

AEM JCR content fixture for testing form-text (Text Field + Text Area) scenarios.

## Workflow

1. `/automate` generates this fixture XML based on the kkr-aem style guide page + acceptance criteria gaps
2. A developer reviews the fixture and merges it back into the kkr-aem repo (style guide or test-fixtures path)
3. Once deployed to AEM, the generated Playwright tests can run against it

## File

- `form-text-fixtures.xml` — Copy of the kkr-aem style guide `.content.xml` with missing states added

## What was added (marked with `[Added]` comments in XML)

| Addition | Per section | Purpose |
|----------|-----------|---------|
| **Filled** (pre-populated `value`) | All 4 backgrounds x Text Field | Tests `:not(:placeholder-shown)` border-color change |
| **Required + Helper** (non-error) | All 4 backgrounds x Text Field | Tests asterisk rendering + helper text below field without error |
| **Filled + Counter** | All 4 backgrounds x Text Area | Tests filled styling + live character counter |

## Source

Based on: `kkr-aem/ui.content.ga/.../style-guide/components/form/form-text/.content.xml`
Ticket: GAAM-504
