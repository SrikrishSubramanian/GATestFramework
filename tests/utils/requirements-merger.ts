import { ParsedTestCase } from './csv-test-parser';

/**
 * Raw output from dev-agents-shared requirements-reader agent.
 * This is the JSON schema the agent produces via jira_get_issue MCP or REST API.
 */
export interface RequirementsReaderOutput {
  ticket_key: string;
  title: string;
  status: string;
  priority: string;
  assignee?: string;
  user_stories: string[];
  acceptance_criteria: string[];
  technical_requirements: string[];
  non_functional_requirements: string[];
  dependencies: string[];
  references: string[];
  raw_description: string;
}

/**
 * Structured requirement from Jira ticket (via requirements-reader agent).
 */
export interface JiraRequirement {
  ticketKey: string;
  summary: string;
  description: string;
  acceptanceCriteria: string[];
  component: string;
  priority: string;
  labels: string[];
}

/**
 * Convert requirements-reader agent JSON output into our JiraRequirement format.
 * The requirements-reader agent (dev-agents-shared) outputs a domain-agnostic JSON.
 * This function bridges it to our test generation pipeline.
 *
 * @param raw - Output from `/read-jira <ticket>` or requirements-reader agent
 * @param component - Component name (extracted from ticket or provided manually)
 */
export function fromRequirementsReader(
  raw: RequirementsReaderOutput,
  component?: string
): JiraRequirement {
  // Try to detect component from title or description
  const detectedComponent = component
    || detectComponentFromText(raw.title)
    || detectComponentFromText(raw.raw_description)
    || 'general';

  // Merge acceptance criteria with user stories if ACs are empty
  const criteria = raw.acceptance_criteria.length > 0
    ? raw.acceptance_criteria
    : raw.user_stories.length > 0
      ? raw.user_stories
      : [raw.raw_description || raw.title];

  // Extract labels from technical + non-functional requirements
  const labels: string[] = [];
  for (const nfr of raw.non_functional_requirements) {
    if (/accessibility|a11y|wcag/i.test(nfr)) labels.push('@a11y');
    if (/performance|speed|load/i.test(nfr)) labels.push('@performance');
    if (/responsive|mobile|tablet/i.test(nfr)) labels.push('@mobile');
    if (/security|auth/i.test(nfr)) labels.push('@security');
  }

  return {
    ticketKey: raw.ticket_key,
    summary: raw.title,
    description: raw.raw_description,
    acceptanceCriteria: criteria,
    component: detectedComponent,
    priority: mapPriority(raw.priority),
    labels,
  };
}

/**
 * Detect GA component name from ticket text.
 */
const GA_COMPONENTS = [
  'button', 'feature-banner', 'statistic', 'section', 'separator', 'spacer',
  'headline-block', 'text', 'image-with-nested-content', 'homepage-hero',
  'footer-banner', 'breadcrumb', 'disclaimers', 'login', 'role-selector',
  'brand-relationship', 'content-trail', 'rate-sheet-grid', 'user-box',
  'ratingsCard', 'accordion', 'tabs', 'navigation',
];

function detectComponentFromText(text: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const comp of GA_COMPONENTS) {
    if (lower.includes(comp)) return comp;
  }
  return null;
}

function mapPriority(jiraPriority: string): string {
  const p = (jiraPriority || '').toLowerCase();
  if (p.includes('highest') || p.includes('blocker') || p.includes('critical')) return 'critical';
  if (p.includes('high') || p.includes('major')) return 'high';
  if (p.includes('low') || p.includes('minor') || p.includes('trivial')) return 'low';
  return 'medium';
}

/**
 * Design spec from Figma (via design-reader agent).
 */
export interface FigmaDesignSpec {
  component: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius?: string;
  breakpoints: Record<string, Record<string, string>>;
  animations: Record<string, Record<string, string>>;
  states: string[];
}

/**
 * Merged requirement combining Jira + Figma data.
 */
export interface MergedRequirement {
  source: 'jira' | 'figma' | 'merged';
  component: string;
  testCases: ParsedTestCase[];
  figmaSpec?: FigmaDesignSpec;
}

/**
 * Convert Jira requirement into test cases.
 */
export function jiraToTestCases(jira: JiraRequirement): ParsedTestCase[] {
  const cases: ParsedTestCase[] = [];

  // Each acceptance criterion becomes a test case
  for (let i = 0; i < jira.acceptanceCriteria.length; i++) {
    const criterion = jira.acceptanceCriteria[i];
    cases.push({
      testId: `${jira.ticketKey}-AC${i + 1}`,
      title: `${jira.summary} — AC${i + 1}`,
      steps: extractStepsFromCriterion(criterion),
      expected: criterion,
      component: jira.component || 'general',
      priority: jira.priority || 'medium',
      tags: jira.labels.map(l => l.startsWith('@') ? l : `@${l}`),
      url: '',
    });
  }

  // If no ACs, create a single test from the description
  if (cases.length === 0 && jira.description) {
    cases.push({
      testId: `${jira.ticketKey}-01`,
      title: jira.summary,
      steps: [`Navigate to ${jira.component} page`, 'Verify the described behavior'],
      expected: jira.description,
      component: jira.component || 'general',
      priority: jira.priority || 'medium',
      tags: jira.labels.map(l => l.startsWith('@') ? l : `@${l}`),
      url: '',
    });
  }

  return cases;
}

/**
 * Generate visual test cases from Figma design spec.
 */
export function figmaToVisualTestCases(figma: FigmaDesignSpec): ParsedTestCase[] {
  const cases: ParsedTestCase[] = [];
  const comp = figma.component;

  // Color tests
  for (const [property, value] of Object.entries(figma.colors)) {
    cases.push({
      testId: `FIGMA-${comp}-color-${property}`,
      title: `${comp} ${property} color matches Figma spec (${value})`,
      steps: [
        `Navigate to ${comp} style guide page`,
        `Get computed ${property} of component`,
      ],
      expected: `${property} should be ${value}`,
      component: comp,
      priority: 'medium',
      tags: ['@visual'],
      url: '',
    });
  }

  // Typography tests
  if (Object.keys(figma.typography).length > 0) {
    cases.push({
      testId: `FIGMA-${comp}-typography`,
      title: `${comp} typography matches Figma spec`,
      steps: [
        `Navigate to ${comp} style guide page`,
        `Get computed font properties`,
      ],
      expected: `Typography should match: ${JSON.stringify(figma.typography)}`,
      component: comp,
      priority: 'medium',
      tags: ['@visual'],
      url: '',
    });
  }

  // Animation tests
  for (const [trigger, props] of Object.entries(figma.animations)) {
    cases.push({
      testId: `FIGMA-${comp}-animation-${trigger}`,
      title: `${comp} ${trigger} animation matches Figma spec`,
      steps: [
        `Navigate to ${comp} style guide page`,
        `Trigger ${trigger} interaction`,
        `Capture before/after states`,
      ],
      expected: `Animation: ${JSON.stringify(props)}`,
      component: comp,
      priority: 'low',
      tags: ['@visual'],
      url: '',
    });
  }

  // Responsive tests
  for (const [breakpoint, props] of Object.entries(figma.breakpoints)) {
    cases.push({
      testId: `FIGMA-${comp}-responsive-${breakpoint}`,
      title: `${comp} layout at ${breakpoint} matches Figma`,
      steps: [
        `Set viewport to ${breakpoint}`,
        `Navigate to ${comp} style guide page`,
        `Verify dimensions`,
      ],
      expected: `Layout should match: ${JSON.stringify(props)}`,
      component: comp,
      priority: 'medium',
      tags: ['@visual', breakpoint === 'mobile' ? '@mobile' : '@regression'],
      url: '',
    });
  }

  return cases;
}

/**
 * Merge Jira requirements with Figma design specs.
 */
export function mergeRequirements(
  jira: JiraRequirement,
  figma?: FigmaDesignSpec
): MergedRequirement {
  const testCases = jiraToTestCases(jira);

  if (figma) {
    const visualCases = figmaToVisualTestCases(figma);
    testCases.push(...visualCases);
  }

  return {
    source: figma ? 'merged' : 'jira',
    component: jira.component || figma?.component || 'general',
    testCases,
    figmaSpec: figma,
  };
}

/**
 * Extract action steps from an acceptance criterion string.
 */
function extractStepsFromCriterion(criterion: string): string[] {
  // Try to split by "when" / "then" / "given" patterns
  const bddMatch = criterion.match(/given\s+(.+?)\s+when\s+(.+?)\s+then\s+(.+)/i);
  if (bddMatch) {
    return [
      `Given: ${bddMatch[1].trim()}`,
      `When: ${bddMatch[2].trim()}`,
      `Then: ${bddMatch[3].trim()}`,
    ];
  }

  // Try numbered steps
  const numbered = criterion.split(/\d+\.\s+/).filter(s => s.trim());
  if (numbered.length > 1) return numbered.map(s => s.trim());

  // Fallback: single step
  return [criterion.trim()];
}
