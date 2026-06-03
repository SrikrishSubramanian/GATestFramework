# Rate Table Content Fixture

## Overview

This directory contains the JCR content XML fixture for the Rate Table component style guide page. The fixture is designed to support comprehensive Playwright test automation across all component variations and background contexts.

## Fixture Contents

`rate-table-fixtures.xml` includes:

### Table Variations (5)
- Fixed Index Annuities (`fixed-index-annuities`)
- Fixed Annuities v1 (`fixed-annuities-v1`)
- Fixed Annuities v2 (`fixed-annuities-v2`)
- Index Linked Annuities (`index-linked-annuities`)
- Income Annuity (`income-annuity`)

### Backgrounds
- **White Background** — Each of the 5 variations plus empty state
- **Slate Background** — Each of the 5 variations plus empty state

### Empty State
- One rate-table instance on white background with no `tableVariation` set (tests placeholder behavior)
- One rate-table instance on slate background with no `tableVariation` set

## Deployment

To deploy this fixture to kkr-aem:

1. Copy `rate-table-fixtures.xml` to:
   ```
   ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components/rate-table/.content.xml
   ```

2. Commit and push to the kkr-aem repository

## Source Ticket

[GAAM-558](https://bounteous.jira.com/browse/GAAM-558)

## Component Details

- **Resource Type**: `ga/components/content/rate-table`
- **BEM Root Class**: `.cmp-rate-table`
- **Component Group**: GA - Dynamic Rates
- **Dialog Property**: `tableVariation` (select field)
- **Placeholder Text**: "Rate Table — Select a table variation" (when no variation selected)

## Test Coverage

This fixture enables Playwright tests to validate:

- All 5 table variations render correctly
- Empty state placeholder displays when no variation is selected
- Component styling works on both white and slate backgrounds
- Proper HTML semantics and accessibility attributes
- CSS class naming conventions (`.cmp-rate-table`)
- Responsive behavior across viewports

## Notes

All sections marked with `<!-- [Added] GAAM-558 ... -->` comments indicate components/sections added for this fixture.
