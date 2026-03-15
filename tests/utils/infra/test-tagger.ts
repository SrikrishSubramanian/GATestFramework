/**
 * Smart test tagging utility.
 * Assigns tags based on test content, categories, and priority.
 */

export type TestTag =
  | '@smoke'
  | '@regression'
  | '@a11y'
  | '@wcag22'
  | '@visual'
  | '@negative'
  | '@mobile'
  | '@author'
  | '@interaction'
  | '@matrix';

export type TestCategory =
  | 'happy-path'
  | 'negative'
  | 'responsive'
  | 'accessibility'
  | 'visual'
  | 'console-errors'
  | 'interaction'
  | 'state-matrix'
  | 'broken-images';

export type A11yLevel = 'none' | 'wcag21' | 'wcag22';

/** Map categories to their default tags */
const CATEGORY_TAGS: Record<TestCategory, TestTag[]> = {
  'happy-path': ['@smoke', '@regression'],
  'negative': ['@negative', '@regression'],
  'responsive': ['@mobile', '@regression'],
  'accessibility': ['@a11y', '@wcag22', '@regression'],
  'visual': ['@visual', '@regression'],
  'console-errors': ['@regression'],
  'interaction': ['@interaction', '@regression'],
  'state-matrix': ['@matrix', '@regression'],
  'broken-images': ['@regression'],
};

/** Priority-based tag assignment */
const PRIORITY_TAGS: Record<string, TestTag[]> = {
  high: ['@smoke', '@regression'],
  critical: ['@smoke', '@regression'],
  medium: ['@regression'],
  low: ['@regression'],
};

/**
 * Generate tags for a test based on its category and priority.
 */
export function getTagsForTest(
  category: TestCategory,
  priority: string = 'medium',
  a11yLevel: A11yLevel = 'wcag22'
): TestTag[] {
  const tags = new Set<TestTag>();

  // Category tags
  const categoryTags = CATEGORY_TAGS[category] || ['@regression'];
  for (const tag of categoryTags) {
    // Skip a11y tags if level is none
    if (a11yLevel === 'none' && (tag === '@a11y' || tag === '@wcag22')) continue;
    // Downgrade wcag22 to a11y-only if level is wcag21
    if (a11yLevel === 'wcag21' && tag === '@wcag22') continue;
    tags.add(tag);
  }

  // Priority tags
  const pTags = PRIORITY_TAGS[priority.toLowerCase()] || PRIORITY_TAGS.medium;
  for (const tag of pTags) {
    tags.add(tag);
  }

  return Array.from(tags);
}

/**
 * Format tags as a string for test titles.
 * e.g., "@smoke @regression"
 */
export function formatTags(tags: TestTag[]): string {
  return tags.join(' ');
}

/**
 * Get all default categories for component test generation.
 */
export function getDefaultCategories(a11yLevel: A11yLevel = 'wcag22'): TestCategory[] {
  const categories: TestCategory[] = [
    'happy-path',
    'negative',
    'responsive',
    'console-errors',
    'broken-images',
  ];
  if (a11yLevel !== 'none') {
    categories.push('accessibility');
  }
  return categories;
}

/**
 * Get the axe-core tag set for a given a11y level.
 */
export function getAxeTags(level: A11yLevel): string[] {
  switch (level) {
    case 'none': return [];
    case 'wcag21': return ['wcag2a', 'wcag2aa'];
    case 'wcag22': return ['wcag2a', 'wcag2aa', 'wcag22aa'];
  }
}

/**
 * Determine CI tier for a set of tags.
 */
export function getCITier(tags: TestTag[]): 'quick' | 'pr-gate' | 'nightly' | 'visual' {
  if (tags.includes('@visual')) return 'visual';
  if (tags.includes('@smoke')) return 'quick';
  if (tags.includes('@a11y') || tags.includes('@wcag22')) return 'pr-gate';
  return 'nightly';
}
