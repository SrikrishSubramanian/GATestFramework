import * as fs from 'fs';
import csvParser from 'csv-parser';

export interface ParsedTestCase {
  testId: string;
  title: string;
  steps: string[];
  expected: string;
  component: string;
  priority: string;
  tags: string[];
  url: string;
}

export interface ParsedTestGroup {
  component: string;
  testCases: ParsedTestCase[];
}

/** Column alias mappings — case-insensitive matching */
const COLUMN_ALIASES: Record<string, string[]> = {
  testId: ['test id', 'test_id', 'id', 'tc_id', 'test case id'],
  title: ['title', 'test name', 'name', 'scenario', 'description'],
  steps: ['steps', 'test steps', 'actions', 'procedure', 'action steps'],
  expected: ['expected', 'expected result', 'acceptance criteria', 'pass criteria'],
  component: ['component', 'module', 'feature', 'area', 'page'],
  priority: ['priority', 'severity', 'importance'],
  tags: ['tags', 'labels', 'categories', 'type'],
  url: ['url', 'page url', 'test url', 'target url'],
};

/**
 * Parse a CSV file into grouped test cases.
 * Auto-detects columns by matching headers against aliases.
 * @param csvPath - path to CSV file
 * @param columnMap - optional explicit overrides e.g. { steps: 'Action Steps', expected: 'Pass Criteria' }
 */
export async function parseCSV(
  csvPath: string,
  columnMap?: Record<string, string>
): Promise<ParsedTestGroup[]> {
  const rows = await readCSV(csvPath);
  if (rows.length === 0) return [];

  // Detect or apply column mappings
  const headers = Object.keys(rows[0]);
  const mapping = columnMap
    ? applyExplicitMap(headers, columnMap)
    : autoDetectColumns(headers);

  // Parse rows into test cases
  const testCases: ParsedTestCase[] = [];
  for (const row of rows) {
    const tc = rowToTestCase(row, mapping);
    if (tc.title || tc.steps.length > 0) {
      testCases.push(tc);
    }
  }

  // Group by component
  return groupByComponent(testCases);
}

/** Read CSV file into array of row objects */
function readCSV(csvPath: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const rows: Record<string, string>[] = [];
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (row: Record<string, string>) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

/** Auto-detect column mapping from headers */
function autoDetectColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const normalizedHeaders = headers.map(h => h.trim().toLowerCase());

  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const alias of aliases) {
      const idx = normalizedHeaders.indexOf(alias.toLowerCase());
      if (idx !== -1) {
        mapping[field] = headers[idx];
        break;
      }
    }
  }
  return mapping;
}

/** Apply explicit column map overrides */
function applyExplicitMap(
  headers: string[],
  overrides: Record<string, string>
): Record<string, string> {
  const mapping = autoDetectColumns(headers);
  for (const [field, headerName] of Object.entries(overrides)) {
    if (headers.includes(headerName)) {
      mapping[field] = headerName;
    }
  }
  return mapping;
}

/** Convert a CSV row to a ParsedTestCase */
function rowToTestCase(
  row: Record<string, string>,
  mapping: Record<string, string>
): ParsedTestCase {
  const get = (field: string): string => {
    const header = mapping[field];
    return header ? (row[header] || '').trim() : '';
  };

  // Split steps by newlines or numbered lines (1. 2. 3.)
  const rawSteps = get('steps');
  const steps = rawSteps
    ? rawSteps
        .split(/\n|(?=\d+\.\s)/)
        .map(s => s.replace(/^\d+\.\s*/, '').trim())
        .filter(s => s.length > 0)
    : [];

  // Parse tags (comma or space separated)
  const rawTags = get('tags');
  const tags = rawTags
    ? rawTags.split(/[,;\s]+/).map(t => t.trim()).filter(t => t.length > 0)
    : [];

  return {
    testId: get('testId') || `TC_${Date.now()}`,
    title: get('title'),
    steps,
    expected: get('expected'),
    component: get('component') || 'general',
    priority: get('priority') || 'medium',
    tags,
    url: get('url'),
  };
}

/** Group test cases by component */
function groupByComponent(testCases: ParsedTestCase[]): ParsedTestGroup[] {
  const groups = new Map<string, ParsedTestCase[]>();
  for (const tc of testCases) {
    const key = tc.component.toLowerCase().replace(/\s+/g, '-');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tc);
  }
  return Array.from(groups.entries()).map(([component, testCases]) => ({
    component,
    testCases,
  }));
}

/**
 * Parse a --map string into a column mapping object.
 * Format: "steps=Action Steps,expected=Pass Criteria"
 */
export function parseMapFlag(mapStr: string): Record<string, string> {
  const mapping: Record<string, string> = {};
  const pairs = mapStr.split(',');
  for (const pair of pairs) {
    const [field, header] = pair.split('=').map(s => s.trim());
    if (field && header) {
      mapping[field] = header;
    }
  }
  return mapping;
}
