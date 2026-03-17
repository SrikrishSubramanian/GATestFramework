# Navigation Content Fixtures

## Source

Copied from `kkr-aem/ui.content.ga/.../style-guide/components/navigation/.content.xml`

## Existing Coverage (from style guide)

The style guide already covers the primary GAAM-396 scenarios:

| Variation | Background | structureDepth | Style ID |
|-----------|-----------|----------------|----------|
| Single List | Granite (dark) | 1 | — |
| Single List | White (light) | 1 | — |
| Grouped Accordion | Granite (dark) | 2 | — |
| Grouped Accordion | Azul (dark) | 2 | — |
| Grouped Accordion | White (light) | 2 | — |
| Vertical Orientation | Granite (dark) | 1 | `ga-nav--vertical` |

## Additions (GAAM-396)

| What was added | Why |
|---------------|-----|
| Single List on slate background | Additional light background variant for responsive edge case testing |
| Vertical Orientation on white background | Ensures vertical nav works correctly on light backgrounds |
| Manual navigation authoring mode | Tests the manual link authoring dialog mode (vs dynamic) |

## Deployment

This fixture must be reviewed by a developer and merged into kkr-aem before tests that depend on the added variations can run in QA/UAT environments. For local/dev, the fixture can be auto-deployed via the content-fixture-deployer.
