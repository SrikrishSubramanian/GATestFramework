import * as fs from 'fs';
import * as path from 'path';
import { TestCategory } from '../infra/test-tagger';

const MATRIX_PATH = path.resolve(__dirname, '..', 'data', 'coverage-matrix.json');

export interface ComponentCoverage {
  component: string;
  categories: Record<string, CategoryCoverage>;
  totalTests: number;
  lastUpdated: string;
}

export interface CategoryCoverage {
  category: string;
  testCount: number;
  specFile: string;
  tags: string[];
}

export interface CoverageMatrix {
  lastUpdated: string;
  components: Record<string, ComponentCoverage>;
}

/**
 * Load the coverage matrix from disk.
 */
export function loadMatrix(): CoverageMatrix {
  if (!fs.existsSync(MATRIX_PATH)) {
    return { lastUpdated: '', components: {} };
  }
  return JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf-8'));
}

/**
 * Save the coverage matrix to disk.
 */
export function saveMatrix(matrix: CoverageMatrix): void {
  const dir = path.dirname(MATRIX_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  matrix.lastUpdated = new Date().toISOString();
  fs.writeFileSync(MATRIX_PATH, JSON.stringify(matrix, null, 2), 'utf-8');
}

/**
 * Update coverage for a component after test generation.
 */
export function updateComponentCoverage(
  component: string,
  categories: Array<{ category: TestCategory; testCount: number; specFile: string; tags: string[] }>
): void {
  const matrix = loadMatrix();

  const existing = matrix.components[component] || {
    component,
    categories: {},
    totalTests: 0,
    lastUpdated: '',
  };

  let total = 0;
  for (const cat of categories) {
    existing.categories[cat.category] = {
      category: cat.category,
      testCount: cat.testCount,
      specFile: cat.specFile,
      tags: cat.tags,
    };
    total += cat.testCount;
  }
  existing.totalTests = total;
  existing.lastUpdated = new Date().toISOString();

  matrix.components[component] = existing;
  saveMatrix(matrix);
}

/**
 * Get coverage summary for all components.
 */
export function getCoverageSummary(): {
  totalComponents: number;
  totalTests: number;
  categoryCoverage: Record<string, number>;
  uncoveredCategories: Record<string, string[]>;
} {
  const matrix = loadMatrix();
  const allCategories: TestCategory[] = [
    'happy-path', 'negative', 'responsive', 'accessibility',
    'visual', 'console-errors', 'interaction', 'state-matrix', 'broken-images',
  ];

  let totalTests = 0;
  const categoryCoverage: Record<string, number> = {};
  const uncoveredCategories: Record<string, string[]> = {};

  for (const [name, comp] of Object.entries(matrix.components)) {
    totalTests += comp.totalTests;
    const covered = Object.keys(comp.categories);
    const uncovered = allCategories.filter(c => !covered.includes(c));
    if (uncovered.length > 0) {
      uncoveredCategories[name] = uncovered;
    }
    for (const cat of covered) {
      categoryCoverage[cat] = (categoryCoverage[cat] || 0) + comp.categories[cat].testCount;
    }
  }

  return {
    totalComponents: Object.keys(matrix.components).length,
    totalTests,
    categoryCoverage,
    uncoveredCategories,
  };
}

/**
 * Format coverage as a human-readable report.
 */
export function formatCoverageReport(): string {
  const summary = getCoverageSummary();
  const lines: string[] = [
    `=== Test Coverage Matrix ===`,
    `Components: ${summary.totalComponents}`,
    `Total tests: ${summary.totalTests}`,
    '',
    'Category breakdown:',
  ];

  for (const [cat, count] of Object.entries(summary.categoryCoverage)) {
    lines.push(`  ${cat}: ${count} tests`);
  }

  if (Object.keys(summary.uncoveredCategories).length > 0) {
    lines.push('', 'Uncovered categories:');
    for (const [comp, cats] of Object.entries(summary.uncoveredCategories)) {
      lines.push(`  ${comp}: ${cats.join(', ')}`);
    }
  }

  return lines.join('\n');
}
