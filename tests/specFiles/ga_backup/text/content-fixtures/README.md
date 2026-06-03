# Text Component — RTE Table Content Fixtures

**Ticket:** GAAM-523
**Component:** `text` (`ga/components/content/text`)
**Generated:** 2026-03-16

## Purpose

The GA text style guide page (`ui.content.ga/.../style-guide/components/text/.content.xml`) contains only typography examples (headlines, body text, eyebrow) and has no table content. This fixture provides a standalone AEM-compatible XML page that exercises every documented RTE table CSS class from `text.less`, for use as a local content fixture in Playwright tests.

## File: `text-fixtures.xml`

A complete AEM JCR page (`cq:Page`) ready for deployment via CRX Package Manager or the AEM fixture deploy script. It contains **7 tables** across three background contexts:

### Light Mode — White Background (no `cq:styleIds`)

| Table | Description | Columns | Caption | Dividers |
|-------|-------------|---------|---------|----------|
| 1 | All cell types (header, subheader, default, stripe, blank, blank-stripe, highlight) | 3 | Yes | Yes |
| 2 | Icon placement (`icon-left`, `icon-right`, combined with stripe) | 3 | No | No |
| 3 | Max columns test | 5 | Yes | Yes |
| 4 | Min columns test (subheader, stripe, blank) | 2 | No | No |

### Dark Mode — Granite Background (`cq:styleIds="[background-granite]"`)

| Table | Description | Columns | Caption | Dividers |
|-------|-------------|---------|---------|----------|
| 5 | All cell types — dark mode inversion via granite parent section | 3 | Yes | Yes |
| 6 | Icon placement in dark mode | 3 | No | No |

### Dark Mode — Azul Background (`cq:styleIds="[background-azul]"`)

| Table | Description | Columns | Caption | Dividers |
|-------|-------------|---------|---------|----------|
| 7 | All cell types — dark mode inversion via azul parent section | 3 | Yes | Yes |

## CSS Classes Covered

### Cell Types (`<th>` / `<td>`)
- `table-cell-header` — azul bg, white text (dark mode: inverted)
- `table-cell-subheader` — slate bg, azul bottom border (dark mode: inverted)
- `table-cell-stripe` — slate bg (dark mode: inverted)
- `table-cell-blank` — white bg, muted text (dark mode: inverted)
- `table-cell-blank-stripe` — slate bg, muted text (dark mode: inverted)
- `table-cell-highlight` — aubergine-tint bg, bold aubergine text (dark mode: inverted)

### Icon Placement (`<td>`)
- `icon-left` — icon rendered to the left of cell text
- `icon-right` — icon rendered to the right of cell text

### Table-Level Modifier (`<table>`)
- `table-dividers` — 1px vertical rules between columns

### Other Elements
- `<caption>` — table title with H5 desktop / H3 mobile typography
- `<thead>` / `<tbody>` — semantic grouping required for correct styling

## Dark Mode Behavior

Dark mode styles activate automatically when a table is nested inside a section with `cq:styleIds` containing `background-granite` or `background-azul`. This maps to the LESS selectors:
```less
.cmp-section--background-color-granite,
.cmp-section--background-color-azul {
  // dark mode cell type inversions
}
```

Tables 5, 6, and 7 in this fixture exercise those paths by placing identical table markup inside granite and azul sections respectively.

## Mobile Behavior

All tables get `min-width: 1024px` with horizontal scroll and a fade-out indicator at narrow viewports. This is handled entirely in `text.less` with no extra class needed on the table element.

## Usage in Tests

Reference this fixture in `text.author.spec.ts` or a dedicated `text.tables.spec.ts`:

```typescript
// Deploy fixture before tests (if using AEM fixture deploy script)
// Navigate to the fixture page on the AEM author
await page.goto(`${process.env.AEM_AUTHOR_URL}/content/global-atlantic/test-fixtures/text-tables.html`);

// Example: verify table-cell-header renders with correct background
const headerCell = page.locator('th.table-cell-header').first();
await expect(headerCell).toBeVisible();
```
