import * as fs from 'fs';
import csvParser from 'csv-parser';

export interface CSVMetadata {
  testName: string;
  jiraId: string;
  testedUrl: string;
  figmaLink: string;
}

export interface ParsedTestCase {
  testId: string;
  title: string;
  steps: string[];
  expected: string;
  component: string;
  priority: string;
  tags: string[];
  url: string;
  preCondition: string;
  testData: string;
}

export interface ParsedTestGroup {
  component: string;
  testCases: ParsedTestCase[];
}

/** Column alias mappings — case-insensitive matching */
const COLUMN_ALIASES: Record<string, string[]> = {
  testId: ['test id', 'test_id', 'id', 'tc_id', 'test case id'],
  title: ['title', 'test name', 'name', 'scenario', 'test scenario', 'description'],
  steps: ['steps', 'test steps', 'actions', 'procedure', 'action steps'],
  expected: ['expected', 'expected result', 'acceptance criteria', 'pass criteria'],
  component: ['component', 'module', 'feature', 'area', 'page'],
  priority: ['priority', 'severity', 'importance'],
  tags: ['tags', 'labels', 'categories', 'type', 'test type'],
  url: ['url', 'page url', 'test url', 'target url'],
  preCondition: ['pre-condition', 'precondition', 'pre condition', 'prerequisites'],
  testData: ['test data', 'data', 'test_data'],
};

/** Metadata key aliases for rows 1-4 */
const METADATA_KEYS: Record<string, keyof CSVMetadata> = {
  'test name': 'testName',
  'jira id': 'jiraId',
  'tested url': 'testedUrl',
  'figma link': 'figmaLink',
};

/**
 * Parse a CSV file into grouped test cases.
 * Supports two CSV formats:
 *   1. Standard: row 1 is headers, row 2+ is data
 *   2. Metadata: rows 1-4 are key-value metadata, row 5 is blank, row 6 is headers, row 7+ is data
 * Auto-detects format by checking if row 1 col A matches a metadata key.
 * @param csvPath - path to CSV file
 * @param columnMap - optional explicit overrides e.g. { steps: 'Action Steps', expected: 'Pass Criteria' }
 */
export async function parseCSV(
  csvPath: string,
  columnMap?: Record<string, string>
): Promise<ParsedTestGroup[]> {
  const { metadata, rows } = await readCSV(csvPath);
  if (rows.length === 0) return [];

  // Detect or apply column mappings
  const headers = Object.keys(rows[0]);
  const mapping = columnMap
    ? applyExplicitMap(headers, columnMap)
    : autoDetectColumns(headers);

  // Derive component name from metadata or COMPONENT env var
  const componentFromMeta = deriveComponentFromMetadata(metadata);

  // Parse rows into test cases
  const testCases: ParsedTestCase[] = [];
  for (const row of rows) {
    const tc = rowToTestCase(row, mapping);
    if (componentFromMeta && tc.component === 'general') {
      tc.component = componentFromMeta;
    }
    // Use tested URL from metadata if test case has no URL
    if (!tc.url && metadata.testedUrl) {
      tc.url = metadata.testedUrl;
    }
    if (tc.title || tc.steps.length > 0) {
      testCases.push(tc);
    }
  }

  // Group by component
  return groupByComponent(testCases);
}

/**
 * Get metadata from a parsed CSV (call after parseCSV).
 */
export async function parseCSVWithMetadata(
  csvPath: string,
  columnMap?: Record<string, string>
): Promise<{ metadata: CSVMetadata; groups: ParsedTestGroup[] }> {
  const { metadata, rows } = await readCSV(csvPath);
  if (rows.length === 0) return { metadata, groups: [] };

  const headers = Object.keys(rows[0]);
  const mapping = columnMap
    ? applyExplicitMap(headers, columnMap)
    : autoDetectColumns(headers);

  const componentFromMeta = deriveComponentFromMetadata(metadata);

  const testCases: ParsedTestCase[] = [];
  for (const row of rows) {
    const tc = rowToTestCase(row, mapping);
    if (componentFromMeta && tc.component === 'general') {
      tc.component = componentFromMeta;
    }
    if (!tc.url && metadata.testedUrl) {
      tc.url = metadata.testedUrl;
    }
    if (tc.title || tc.steps.length > 0) {
      testCases.push(tc);
    }
  }

  return { metadata, groups: groupByComponent(testCases) };
}

/**
 * Read CSV file, auto-detecting metadata rows.
 * If the first column of row 1 matches a known metadata key, rows 1-4 are
 * treated as metadata and the actual data table starts after the next header row.
 */
function readCSV(csvPath: string): Promise<{ metadata: CSVMetadata; rows: Record<string, string>[] }> {
  return new Promise((resolve, reject) => {
    const rawLines: string[][] = [];
    fs.createReadStream(csvPath)
      .pipe(csvParser({ headers: false }))
      .on('data', (row: Record<string, string>) => {
        rawLines.push(Object.values(row));
      })
      .on('end', () => {
        const result = splitMetadataAndData(rawLines);
        resolve(result);
      })
      .on('error', reject);
  });
}

/**
 * Detect whether the CSV has metadata rows and split accordingly.
 */
function splitMetadataAndData(
  rawLines: string[][]
): { metadata: CSVMetadata; rows: Record<string, string>[] } {
  const metadata: CSVMetadata = { testName: '', jiraId: '', testedUrl: '', figmaLink: '' };

  if (rawLines.length === 0) return { metadata, rows: [] };

  // Check if first cell of row 0 is a metadata key
  const firstCell = (rawLines[0]?.[0] || '').trim().toLowerCase();
  const isMetadataFormat = Object.keys(METADATA_KEYS).some(
    key => firstCell === key || firstCell.replace(/\s+/g, ' ') === key
  );

  if (isMetadataFormat) {
    // Parse metadata from rows 0-3
    for (let i = 0; i < Math.min(4, rawLines.length); i++) {
      const key = (rawLines[i]?.[0] || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const value = (rawLines[i]?.[1] || '').trim();
      const metaKey = METADATA_KEYS[key];
      if (metaKey) {
        metadata[metaKey] = value;
      }
    }

    // Find the header row (first non-empty row after metadata, typically row 5 which is index 5)
    let headerIdx = 4;
    while (headerIdx < rawLines.length) {
      const row = rawLines[headerIdx];
      const nonEmpty = row.filter(cell => cell.trim().length > 0);
      // A header row has multiple non-empty cells (at least 3)
      if (nonEmpty.length >= 3) break;
      headerIdx++;
    }

    if (headerIdx >= rawLines.length) return { metadata, rows: [] };

    // Build row objects using the detected header row
    const headers = rawLines[headerIdx].map(h => h.trim());
    const rows: Record<string, string>[] = [];
    for (let i = headerIdx + 1; i < rawLines.length; i++) {
      const line = rawLines[i];
      // Skip empty rows
      if (line.every(cell => cell.trim() === '')) continue;
      const obj: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        if (headers[j]) {
          obj[headers[j]] = (line[j] || '').trim();
        }
      }
      rows.push(obj);
    }

    return { metadata, rows };
  }

  // Standard format: row 0 is headers
  const headers = rawLines[0].map(h => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (line.every(cell => cell.trim() === '')) continue;
    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      if (headers[j]) {
        obj[headers[j]] = (line[j] || '').trim();
      }
    }
    rows.push(obj);
  }

  return { metadata, rows };
}

/**
 * Derive component name from CSV metadata.
 * Extracts from testName (e.g., "CMS FE: Spacer (Desktop and Mobile)" → "spacer")
 * or from jiraId as fallback.
 */
function deriveComponentFromMetadata(metadata: CSVMetadata): string | null {
  if (metadata.testName) {
    // Try "CMS FE: <Component>" pattern
    const match = metadata.testName.match(/(?:CMS\s+FE:\s*)?([A-Za-z][\w-]*)/i);
    if (match) {
      return match[1].toLowerCase().replace(/\s+/g, '-');
    }
  }
  return process.env.COMPONENT || null;
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

/** Map test type values to tags */
const TEST_TYPE_TAG_MAP: Record<string, string> = {
  positive: '@smoke',
  negative: '@negative',
  boundary: '@negative',
  accessibility: '@a11y',
  responsive: '@mobile',
  visual: '@visual',
};

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

  // Parse tags — support both explicit tags and Test Type column (Positive/Negative)
  const rawTags = get('tags');
  let tags: string[];
  const testTypeTag = TEST_TYPE_TAG_MAP[rawTags.toLowerCase()];
  if (testTypeTag) {
    // Test Type column value like "Positive" or "Negative"
    tags = [testTypeTag, '@regression'];
  } else {
    tags = rawTags
      ? rawTags.split(/[,;\s]+/).map(t => t.trim()).filter(t => t.length > 0)
      : [];
  }

  return {
    testId: get('testId') || `TC_${Date.now()}`,
    title: get('title'),
    steps,
    expected: get('expected'),
    component: get('component') || 'general',
    priority: get('priority') || 'medium',
    tags,
    url: get('url'),
    preCondition: get('preCondition'),
    testData: get('testData'),
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
