import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Phase 2
import { scanDOM, loadLatestSnapshot, generateStrategies, elementToLocatorEntry, DOMElement } from '../../utils/dom-scanner';
import { scanSource, inferElementsFromSource, sourceElementToStrategies, SourceComponentData } from '../../utils/source-scanner';
import { writePOMFromDOM, POMWriterOptions } from '../../utils/pom-writer';
import { isDarkBackground, isLightBackground, getExpectedChildTheme, getSectionBackgrounds } from '../../utils/interaction-detector';
import { loginToAEMAuthor, isPreviewMode } from '../../utils/auth-fixture';

// Phase 3
import { parseCSV, parseMapFlag } from '../../utils/csv-test-parser';
import { getTagsForTest, formatTags, getDefaultCategories, getAxeTags, getCITier } from '../../utils/test-tagger';
import { writeComponentSpec } from '../../utils/spec-writer';

// Phase 4
import { jiraToTestCases, figmaToVisualTestCases, mergeRequirements, JiraRequirement, FigmaDesignSpec } from '../../utils/requirements-merger';

// Phase 5
import { generateVisualSpec } from '../../utils/visual-assertion-generator';
import { captureComponentBaseline, getBaselineForViewport, clearBaselines, listBaselines } from '../../utils/baseline-manager';

// Phase 6
import { annotateEnvironment, testInfoToLogResult } from '../../utils/report-enhancer';
import { scanImages } from '../../utils/broken-image-detector';
import { loadMatrix, saveMatrix, updateComponentCoverage, getCoverageSummary, formatCoverageReport } from '../../utils/coverage-matrix-reporter';

// Phase 7
import { generateStateMatrix, generateMatrixSpec, KNOWN_VARIANTS } from '../../utils/state-matrix-generator';
import { setupMocks, clearMocks, loadMockData, saveMockData, initMockData } from '../../utils/api-mock-helper';
import { analyzeContentXML, generateContentTests } from '../../utils/content-driven-generator';
import { testDispatcherCache } from '../../utils/dispatcher-tester';

const TEMP_DIR = path.resolve(__dirname, '..', '..', '_test_temp');

function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function cleanupTempDir() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

// ==================== Phase 2: DOM Scanner ====================

test.describe('DOM Scanner', () => {
  test('scanDOM extracts elements from page', async ({ page }) => {
    await page.setContent(`
      <div class="ga-button">
        <a class="ga-button__link primary-filled" href="/page" data-testid="btn-primary">Learn More</a>
        <a class="ga-button__link secondary-outline" href="/page2">Contact Us</a>
      </div>
    `);
    const snapshot = await scanDOM(page, 'button');
    expect(snapshot.component).toBe('button');
    expect(snapshot.elements.length).toBeGreaterThan(0);
    expect(snapshot.url).toBeTruthy();
  });

  test('generateStrategies creates multiple strategies for element with testid', () => {
    const el: DOMElement = {
      name: 'primaryBtn',
      tag: 'a',
      text: 'Learn More',
      classes: ['ga-button__link', 'primary-filled'],
      attributes: { href: '/page' },
      testId: 'btn-primary',
      id: null,
      parentClasses: ['ga-button'],
      role: 'link',
      ariaLabel: 'Learn More',
      isInteractive: true,
      boundingBox: { x: 0, y: 0, width: 200, height: 40 },
    };
    const strategies = generateStrategies(el, 'button');
    expect(strategies.length).toBeGreaterThanOrEqual(3);
    expect(strategies[0].type).toBe('testid');
    expect(strategies[0].confidence).toBe(1.0);
  });

  test('elementToLocatorEntry creates valid entry', () => {
    const el: DOMElement = {
      name: 'heading',
      tag: 'h1',
      text: 'Welcome',
      classes: ['title'],
      attributes: {},
      testId: null,
      id: 'main-heading',
      parentClasses: [],
      role: null,
      ariaLabel: null,
      isInteractive: false,
      boundingBox: null,
    };
    const entry = elementToLocatorEntry(el, 'hero');
    expect(entry.name).toBe('heading');
    expect(entry.component).toBe('hero');
    expect(entry.strategies.length).toBeGreaterThan(0);
  });
});

// ==================== Phase 2: Source Scanner ====================

test.describe('Source Scanner', () => {
  test('inferElementsFromSource creates elements from source data', () => {
    const data: SourceComponentData = {
      component: 'button',
      source: 'kkr-aem',
      dialogFields: ['linkURL', 'linkText'],
      lessClasses: ['.ga-button', '.primary-filled', '.secondary-outline'],
      styleIds: { 'primary-filled': '1001' },
    };
    const elements = inferElementsFromSource(data);
    expect(elements.length).toBeGreaterThan(0);
    // Should have dialog fields
    expect(elements.some(e => e.name.includes('dialog_linkURL'))).toBe(true);
    // Should have root from LESS
    expect(elements.some(e => e.name === 'componentRoot')).toBe(true);
  });

  test('sourceElementToStrategies creates CSS strategy', () => {
    const strategies = sourceElementToStrategies({
      name: 'root',
      tag: 'div',
      cssSelector: '.ga-button',
      inferredFrom: 'less',
      isInteractive: false,
    });
    expect(strategies.length).toBeGreaterThanOrEqual(1);
    expect(strategies[0].type).toBe('css');
  });
});

// ==================== Phase 2: Interaction Detector ====================

test.describe('Interaction Detector', () => {
  test('isDarkBackground classifies correctly', () => {
    expect(isDarkBackground('granite')).toBe(true);
    expect(isDarkBackground('azul')).toBe(true);
    expect(isDarkBackground('white')).toBe(false);
    expect(isDarkBackground('slate')).toBe(false);
  });

  test('getExpectedChildTheme returns correct theme', () => {
    expect(getExpectedChildTheme('granite')).toBe('light-theme');
    expect(getExpectedChildTheme('white')).toBe('dark-theme');
  });

  test('getSectionBackgrounds returns all variants', () => {
    const bgs = getSectionBackgrounds();
    expect(bgs).toContain('white');
    expect(bgs).toContain('granite');
    expect(bgs.length).toBe(4);
  });
});

// ==================== Phase 3: CSV Parser ====================

test.describe('CSV Parser', () => {
  const CSV_PATH = path.join(TEMP_DIR, 'test-cases.csv');

  test.beforeAll(() => {
    ensureTempDir();
    fs.writeFileSync(CSV_PATH,
      'Test ID,Title,Steps,Expected,Component,Priority,Tags\n' +
      'TC001,Login success,"1. Open login page\n2. Enter credentials\n3. Click submit",Dashboard shown,login,high,@smoke\n' +
      'TC002,Login fail empty password,1. Open login page 2. Leave password empty,Error message,login,medium,@negative\n' +
      'TC003,Button click,Click primary button,Navigates to CTA,button,high,@smoke @regression\n'
    );
  });

  test.afterAll(() => cleanupTempDir());

  test('parseCSV groups by component', async () => {
    const groups = await parseCSV(CSV_PATH);
    expect(groups.length).toBe(2); // login + button
    const loginGroup = groups.find(g => g.component === 'login');
    expect(loginGroup).toBeTruthy();
    expect(loginGroup!.testCases.length).toBe(2);
  });

  test('parseMapFlag parses override string', () => {
    const map = parseMapFlag('steps=Action Steps,expected=Pass Criteria');
    expect(map.steps).toBe('Action Steps');
    expect(map.expected).toBe('Pass Criteria');
  });
});

// ==================== Phase 3: Test Tagger ====================

test.describe('Test Tagger', () => {
  test('getTagsForTest returns appropriate tags', () => {
    const tags = getTagsForTest('happy-path', 'high');
    expect(tags).toContain('@smoke');
    expect(tags).toContain('@regression');
  });

  test('getTagsForTest respects a11y level none', () => {
    const tags = getTagsForTest('accessibility', 'high', 'none');
    expect(tags).not.toContain('@a11y');
    expect(tags).not.toContain('@wcag22');
  });

  test('getAxeTags returns correct sets', () => {
    expect(getAxeTags('none')).toEqual([]);
    expect(getAxeTags('wcag21')).toEqual(['wcag2a', 'wcag2aa']);
    expect(getAxeTags('wcag22')).toEqual(['wcag2a', 'wcag2aa', 'wcag22aa']);
  });

  test('formatTags joins with spaces', () => {
    expect(formatTags(['@smoke', '@regression'])).toBe('@smoke @regression');
  });

  test('getCITier assigns correct tier', () => {
    expect(getCITier(['@smoke'])).toBe('quick');
    expect(getCITier(['@a11y'])).toBe('pr-gate');
    expect(getCITier(['@visual'])).toBe('visual');
    expect(getCITier(['@regression'])).toBe('nightly');
  });

  test('getDefaultCategories excludes a11y when none', () => {
    const cats = getDefaultCategories('none');
    expect(cats).not.toContain('accessibility');
    const cats2 = getDefaultCategories('wcag22');
    expect(cats2).toContain('accessibility');
  });
});

// ==================== Phase 4: Requirements Merger ====================

test.describe('Requirements Merger', () => {
  const jira: JiraRequirement = {
    ticketKey: 'GAAM-100',
    summary: 'Button hover effect',
    description: 'Add hover animation to primary button',
    acceptanceCriteria: [
      'Given user hovers button, when mouse enters, then background color changes',
      'Button returns to original color on mouse leave',
    ],
    component: 'button',
    priority: 'high',
    labels: ['@regression', 'visual'],
  };

  const figma: FigmaDesignSpec = {
    component: 'button',
    colors: { backgroundColor: '#003DA5', color: '#FFFFFF' },
    typography: { fontSize: '16px', fontWeight: '600' },
    spacing: { paddingTop: '12px', paddingRight: '24px' },
    breakpoints: { mobile: { width: '100%' } },
    animations: { hover: { property: 'background-color', duration: '0.3s' } },
    states: ['default', 'hover', 'focus', 'disabled'],
  };

  test('jiraToTestCases creates test per acceptance criterion', () => {
    const cases = jiraToTestCases(jira);
    expect(cases.length).toBe(2);
    expect(cases[0].testId).toBe('GAAM-100-AC1');
    expect(cases[0].component).toBe('button');
  });

  test('figmaToVisualTestCases creates visual tests', () => {
    const cases = figmaToVisualTestCases(figma);
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.every(c => c.tags.includes('@visual'))).toBe(true);
  });

  test('mergeRequirements combines jira + figma', () => {
    const merged = mergeRequirements(jira, figma);
    expect(merged.source).toBe('merged');
    expect(merged.testCases.length).toBeGreaterThan(2); // jira ACs + figma visual tests
    expect(merged.figmaSpec).toBeTruthy();
  });

  test('mergeRequirements works without figma', () => {
    const merged = mergeRequirements(jira);
    expect(merged.source).toBe('jira');
    expect(merged.testCases.length).toBe(2);
  });
});

// ==================== Phase 6: Coverage Matrix ====================

test.describe('Coverage Matrix Reporter', () => {
  const BACKUP_PATH = path.resolve(__dirname, '..', '..', 'tests', 'data', 'coverage-matrix.json');

  test('updateComponentCoverage and getCoverageSummary work', () => {
    updateComponentCoverage('test-button', [
      { category: 'happy-path' as any, testCount: 3, specFile: 'button.spec.ts', tags: ['@smoke'] },
      { category: 'accessibility' as any, testCount: 2, specFile: 'button.spec.ts', tags: ['@a11y'] },
    ]);

    const summary = getCoverageSummary();
    expect(summary.totalComponents).toBeGreaterThanOrEqual(1);
    expect(summary.totalTests).toBeGreaterThanOrEqual(5);
    expect(summary.categoryCoverage['happy-path']).toBeGreaterThanOrEqual(3);

    // Cleanup
    const matrix = loadMatrix();
    delete matrix.components['test-button'];
    saveMatrix(matrix);
  });

  test('formatCoverageReport produces readable output', () => {
    const report = formatCoverageReport();
    expect(report).toContain('Test Coverage Matrix');
  });
});

// ==================== Phase 7: State Matrix ====================

test.describe('State Matrix Generator', () => {
  test('generateStateMatrix creates combinations', () => {
    const matrix = generateStateMatrix('button', ['primary-filled', 'secondary-outline'], ['light-theme', 'dark-theme']);
    expect(matrix.component).toBe('button');
    expect(matrix.combinations.length).toBe(2 * 2 * 4 * 3); // 48
    expect(matrix.validCount + matrix.invalidCount).toBe(matrix.combinations.length);
    expect(matrix.invalidCount).toBeGreaterThan(0); // dark-on-dark and light-on-light filtered
  });

  test('generateMatrixSpec produces valid TS content', () => {
    const matrix = generateStateMatrix('button', ['primary-filled'], ['light-theme']);
    const spec = generateMatrixSpec(matrix, 'ButtonPage', '../../pages/ga/components/buttonPage');
    expect(spec).toContain('import { test, expect }');
    expect(spec).toContain('ButtonPage');
    expect(spec).toContain('State Matrix');
  });

  test('KNOWN_VARIANTS has button variants', () => {
    expect(KNOWN_VARIANTS.button).toBeTruthy();
    expect(KNOWN_VARIANTS.button.variants.length).toBe(3);
  });
});

// ==================== Phase 7: API Mock Helper ====================

test.describe('API Mock Helper', () => {
  test('setupMocks intercepts and fulfills routes', async ({ page }) => {
    await setupMocks(page, [
      { urlPattern: '**/api/data', scenario: 'success', component: 'test' },
    ]);

    await page.setContent('<div>Test</div>');
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/data');
      return { status: res.status, body: await res.json() };
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');

    await clearMocks(page);
  });

  test('setupMocks handles error scenario', async ({ page }) => {
    await setupMocks(page, [
      { urlPattern: '**/api/fail', scenario: 'error', component: 'test' },
    ]);

    await page.setContent('<div>Test</div>');
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/fail');
      return { status: res.status };
    });

    expect(response.status).toBe(500);
    await clearMocks(page);
  });

  test('saveMockData and loadMockData round-trip', () => {
    ensureTempDir();
    const mockDir = path.join(TEMP_DIR, 'mocks');
    const data = { items: [1, 2, 3], total: 3 };
    // Save to temp
    const origMocksDir = path.resolve(__dirname, '..', '..', 'tests', 'data', 'mocks');
    saveMockData('_test_comp', 'success', data);
    const loaded = loadMockData('_test_comp', 'success');
    expect(loaded.items).toEqual([1, 2, 3]);
    // Cleanup
    const compDir = path.join(origMocksDir, '_test_comp');
    if (fs.existsSync(compDir)) fs.rmSync(compDir, { recursive: true, force: true });
  });
});

// ==================== Phase 7: Content-Driven Generator ====================

test.describe('Content-Driven Generator', () => {
  const XML_PATH = path.join(TEMP_DIR, 'test-content.xml');

  test.beforeAll(() => {
    ensureTempDir();
    fs.writeFileSync(XML_PATH, `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0">
  <button_1
    jcr:primaryType="nt:unstructured"
    sling:resourceType="ga/components/content/button"
    linkURL="/content/global-atlantic/page"
    linkText="Learn More"
    cq:styleIds="[primary-filled,dark-theme,granite]"/>
  <text_1
    jcr:primaryType="nt:unstructured"
    sling:resourceType="ga/components/content/text"
    text="Hello & welcome"/>
  <button_2
    jcr:primaryType="nt:unstructured"
    sling:resourceType="ga/components/content/button"
    linkURL="/content/global-atlantic/page2"/>
</jcr:root>`);
  });

  test.afterAll(() => cleanupTempDir());

  test('analyzeContentXML detects issues', () => {
    const analysis = analyzeContentXML(XML_PATH);
    expect(analysis.components.length).toBeGreaterThan(0);
    // Should detect: dark-theme on granite (invalid combo), missing .html in links, unescaped &, missing linkText
    expect(analysis.issues.length).toBeGreaterThan(0);
  });

  test('generateContentTests creates test strings', () => {
    const analysis = analyzeContentXML(XML_PATH);
    const tests = generateContentTests(analysis);
    expect(tests.length).toBeGreaterThan(0);
    expect(tests[0]).toContain('test(');
  });
});

// ==================== Phase 5: Baseline Manager ====================

test.describe('Baseline Manager', () => {
  const TEST_COMP = '_test_baseline_comp';
  const TEST_ENV = 'test';

  test.afterAll(() => {
    clearBaselines(TEST_COMP, TEST_ENV);
    // Clean parent dir
    const dir = path.resolve(__dirname, '..', 'data', 'baselines', TEST_COMP);
    if (fs.existsSync(dir)) {
      try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* */ }
    }
  });

  test('captureComponentBaseline saves PNG', async ({ page }) => {
    await page.setContent('<div class="ga-test" style="width:100px;height:50px;background:blue;">Test</div>');
    const info = await captureComponentBaseline(page, '.ga-test', TEST_COMP, TEST_ENV);
    expect(fs.existsSync(info.path)).toBe(true);
    expect(info.component).toBe(TEST_COMP);
  });

  test('getBaselineForViewport returns path after capture', async ({ page }) => {
    await page.setContent('<div class="ga-test" style="width:100px;height:50px;background:red;">X</div>');
    await captureComponentBaseline(page, '.ga-test', TEST_COMP, TEST_ENV);
    const viewport = page.viewportSize()!;
    const result = getBaselineForViewport(TEST_COMP, viewport, TEST_ENV);
    expect(result).not.toBeNull();
  });

  test('listBaselines returns captured baselines', async ({ page }) => {
    const list = listBaselines(TEST_COMP, TEST_ENV);
    expect(list.length).toBeGreaterThan(0);
  });
});

// ==================== Phase 6: Broken Image Detector ====================

test.describe('Broken Image Detector', () => {
  test('scanImages detects broken images', async ({ page }) => {
    await page.setContent(`
      <div class="ga-comp">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAABJREFau5CYII=" alt="valid">
        <img src="/nonexistent-image.png" alt="">
      </div>
    `);
    const results = await scanImages(page, '.ga-comp');
    expect(results.total).toBe(2);
    // The data URI image should load, the other won't
    expect(results.images[0].isBroken).toBe(false);
  });

  test('scanImages detects missing alt', async ({ page }) => {
    await page.setContent(`
      <div class="ga-comp">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNjN9GQAAAABJREFau5CYII=">
      </div>
    `);
    const results = await scanImages(page, '.ga-comp');
    expect(results.missingAlt).toBe(1);
  });
});
